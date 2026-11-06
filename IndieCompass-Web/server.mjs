import http from 'node:http';import path from 'node:path';import os from 'node:os';import {readFile} from 'node:fs/promises';import {fileURLToPath} from 'node:url';
import {SteamClient} from './lib/steam.mjs';import {DiskCache,Preferences} from './lib/storage.mjs';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
export async function startServer({dataDir=process.env.COMPASS_DATA_DIR||path.join(process.env.APPDATA||path.join(os.homedir(),'.local','share'),'IndieCompassWeb'),client,port=0}={}){
 const preferences=await new Preferences(path.join(dataDir,'preferences.json')).load();
 const cache=new DiskCache(path.join(dataDir,'cache'));await cache.trim();const steam=client||new SteamClient(cache);
 let origin;let activeSearch=false;
 const server=http.createServer(async(req,res)=>{
  const reply=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
  try{
   if(req.headers.host!==new URL(origin).host)return reply(403,{error:'Недопустимый адрес приложения.'});
   if(req.headers['sec-fetch-site']==='cross-site'||(req.headers.origin&&req.headers.origin!==origin))return reply(403,{error:'Запрос отклонён.'});
   const url=new URL(req.url,origin);
   if(url.pathname.startsWith('/api/')){
    if(req.headers['x-compass']!=='local')return reply(403,{error:'Нужен локальный клиент.'});
    let body={};if(['POST','PUT'].includes(req.method)){let raw='';for await(const part of req){raw+=part;if(raw.length>2000000)return reply(413,{error:'Слишком большой запрос.'});}try{body=JSON.parse(raw||'{}');}catch{return reply(400,{error:'Некорректный JSON.'});}}
    if(url.pathname==='/api/preferences'&&req.method==='GET')return reply(200,{...preferences.value,warning:preferences.warning});
    if(url.pathname==='/api/preferences'&&req.method==='PUT'){try{return reply(200,await preferences.set(body));}catch{return reply(500,{error:'Не удалось сохранить настройки на диск. Проверьте права доступа.'});}}
    if(url.pathname==='/api/search'&&req.method==='POST'){
     if(activeSearch)return reply(429,{error:'Предыдущий поиск ещё выполняется. Подождите немного.'});
     activeSearch=true;try{return reply(200,await steam.search(body.filters,body.offset,preferences.value.hidden));}finally{activeSearch=false;}
    }
    if(url.pathname==='/api/details'&&req.method==='GET')return reply(200,await steam.details(url.searchParams.get('id')||'',url.searchParams.get('region')||'ru'));
    return reply(404,{error:'Неизвестный запрос.'});
   }
   if(!['GET','HEAD'].includes(req.method))return reply(405,{error:'Метод не поддерживается.'});
   const files={'/':'index.html','/app.js':'app.js','/icons.js':'icons.js','/selects.js':'selects.js','/style.css':'style.css','/favicon.svg':'favicon.svg'};
   const file=files[url.pathname];if(!file)return reply(404,{error:'Страница не найдена.'});
   const data=await readFile(path.join(ROOT,'public',file));
   res.writeHead(200,{'Content-Type':{'html':'text/html; charset=utf-8','js':'text/javascript; charset=utf-8','css':'text/css; charset=utf-8','svg':'image/svg+xml'}[file.split('.').pop()],
    'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://*.steamstatic.com https://*.steamcontent.com https://*.akamaihd.net; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});
   res.end(req.method==='HEAD'?undefined:data);
  }catch(e){reply(502,{error:e.message||'Не удалось выполнить запрос.'});}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});origin=`http://127.0.0.1:${server.address().port}`;
 return {server,url:origin,preferences,close:()=>new Promise(r=>server.close(r))};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const app=await startServer({port:Number(process.env.PORT)||0});console.log('Инди-компас: '+app.url);console.log('Оставьте это окно открытым. Ctrl+C — завершить.');
}
