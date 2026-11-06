import {mkdir,readFile,writeFile,rename,readdir,unlink,stat} from 'node:fs/promises';
import path from 'node:path';import {createHash,randomUUID} from 'node:crypto';
export async function atomic(file,value){await mkdir(path.dirname(file),{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';try{await writeFile(temp,JSON.stringify(value),'utf8');await rename(temp,file);}finally{await unlink(temp).catch(()=>{});}}
export class DiskCache{
 constructor(folder){this.folder=folder;}
 file(key){return path.join(this.folder,createHash('sha256').update(key).digest('hex')+'.json');}
 async get(key){try{const v=JSON.parse(await readFile(this.file(key),'utf8'));return v&&typeof v.savedAt==='number'&&'value' in v?v:null;}catch{return null;}}
 async set(key,value){try{await atomic(this.file(key),value);}catch{}}
 async trim(){try{const files=await Promise.all((await readdir(this.folder)).filter(f=>f.endsWith('.json')).map(async f=>({file:path.join(this.folder,f),time:(await stat(path.join(this.folder,f))).mtimeMs})));files.sort((a,b)=>b.time-a.time);await Promise.all(files.filter((f,i)=>i>=400||Date.now()-f.time>30*86400000).map(f=>unlink(f.file).catch(()=>{})));}catch{}}
}
export function cleanPreferences(v={}){
 if(!v||typeof v!=='object')v={};const hidden=[...new Set((Array.isArray(v.hidden)?v.hidden:[]).filter(x=>typeof x==='string'&&/^\d{1,10}$/.test(x)))].slice(0,10000);
 const favorites=(Array.isArray(v.favorites)?v.favorites:[]).filter(x=>x&&/^\d{1,10}$/.test(x.id)&&typeof x.title==='string').map(x=>({id:x.id,title:x.title.slice(0,300),image:typeof x.image==='string'?x.image.slice(0,2000):'',releaseText:String(x.releaseText||'').slice(0,100),price:String(x.price||'').slice(0,100),rating:typeof x.rating==='number'?x.rating:null})).slice(0,5000);
 return {hidden,favorites:[...new Map(favorites.map(x=>[x.id,x])).values()],filters:v.filters&&typeof v.filters==='object'&&!Array.isArray(v.filters)?v.filters:{}};
}
export class Preferences{
 constructor(file){this.file=file;this.value=cleanPreferences();this.warning='';this.queue=Promise.resolve();}
 async load(){try{this.value=cleanPreferences(JSON.parse(await readFile(this.file,'utf8')));}catch(e){if(e.code!=='ENOENT')this.warning='Настройки повреждены или недоступны. Использованы начальные значения.';}return this;}
 async set(value){const next=cleanPreferences(value),task=this.queue.then(async()=>{await atomic(this.file,next);this.value=next;this.warning='';return next;});this.queue=task.catch(()=>{});return task;}
}
