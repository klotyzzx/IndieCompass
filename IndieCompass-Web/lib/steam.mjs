export const TAGS={indie:'492',horror:'1667',simulation:'599',adventure:'21',action:'19',puzzle:'1664',survival:'1662',relaxing:'1654',atmospheric:'4166'};
const SORTS={popular:'Relevance',new:'Released_DESC',rating:'Reviews_DESC',name:'Name_ASC',cheap:'Price_ASC'};
export function decode(value='') {
 const entities={amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' ',ndash:'–',mdash:'—',hellip:'…',copy:'©',reg:'®'};
 return String(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(all,k)=>{if(k[0]!=='#')return entities[k.toLowerCase()]??all;const n=k[1].toLowerCase()==='x'?parseInt(k.slice(2),16):parseInt(k.slice(1),10);return n>0&&n<=0x10ffff?String.fromCodePoint(n):'';});
}
export function plain(html='') {
 return decode(String(html).replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<br\s*\/?\s*>|<\/(?:p|div|h\d|ul|ol)>/gi,'\n').replace(/<li\b[^>]*>/gi,'\n• ').replace(/<[^>]*>/g,'')).replace(/[\t \u00a0]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
export function mediaUrl(value) {try{const u=new URL(value);return u.protocol==='https:'&&/(^|\.)(steamstatic\.com|steamcontent\.com|akamaihd\.net)$/.test(u.hostname)?u.href:'';}catch{return '';}}
export function releaseISO(text) {
 const m=String(text).trim().match(/^(?:(\d{1,2})\s+([A-Za-z]{3}),?\s+(\d{4})|([A-Za-z]{3})\s+(\d{1,2}),?\s+(\d{4}))$/);
 if(!m)return null;const day=+(m[1]||m[5]),year=+(m[3]||m[6]),month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m[2]||m[4]);
 if(month<0)return null;const d=new Date(Date.UTC(year,month,day));return d.getUTCDate()===day?d.toISOString().slice(0,10):null;
}
function attr(html,key){return decode(html.match(new RegExp('\\b'+key+'="([^"]*)"','i'))?.[1]||'');}
function content(html,cls){return html.match(new RegExp('<(?:span|div)\\b[^>]*class="[^"]*\\b'+cls+'\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/(?:span|div)>','i'))?.[1]||'';}
export function parseSearch(payload){
 if(!payload||typeof payload.results_html!=='string'||!Number.isFinite(Number(payload.total_count)))throw new Error('Steam изменил формат каталога. Попробуйте позже.');
 const games=[];let rowCount=0;
 for(const row of payload.results_html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){
  const head=row[1],body=row[2];if(!attr(head,'class').split(/\s+/).includes('search_result_row'))continue;
  rowCount++;const id=attr(head,'data-ds-appid');if(!/^\d+$/.test(id))continue;
  const title=plain(content(body,'title'));if(!title)continue;
  const releaseText=plain(content(body,'search_released')),tooltip=plain(attr(body,'data-tooltip-html'));
  const percent=tooltip.match(/(\d{1,3})%/),reviews=tooltip.match(/([\d,]+) user reviews/i),priceRaw=attr(body,'data-price-final');
  games.push({id,title,releaseText,release:releaseISO(releaseText),image:mediaUrl(attr(body.match(/<img\b[^>]*>/i)?.[0]||'','src')),
   tags:attr(head,'data-ds-tagids').match(/\d+/g)||[],rating:percent?Math.min(100,+percent[1]):null,reviews:reviews?+reviews[1].replaceAll(',',''):null,
   price:(plain(content(body,'discount_final_price'))||plain(content(body,'search_price'))).replace(/\s+/g,' ')||'Цена не указана',priceCents:priceRaw!==''?Number(priceRaw):null,
   discount:plain(content(body,'discount_pct')),platforms:['win','mac','linux'].filter(os=>new RegExp('platform_img[^"<>]*\\b'+os+'\\b').test(body))});
 }
 if(Number(payload.total_count)>0&&!rowCount&&payload.results_html.trim())throw new Error('Steam вернул неожиданный формат карточек.');
 return {games,rowCount,total:Number(payload.total_count)};
}
function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(v||'')&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;}
export function normalizeFilters(input={}){
 if(!input||typeof input!=='object')input={};
 const selected=Array.isArray(input.tags)?input.tags:typeof input.tag==='string'?[input.tag]:[];
 const tags=[...new Set(selected.filter(t=>Object.hasOwn(TAGS,t)&&!['relaxing','atmospheric'].includes(t)))];
 const f={tags,term:String(input.term||'').trim().slice(0,120),mood:['relaxing','atmospheric'].includes(input.mood)?input.mood:'',region:['ru','us','kz','de','tr'].includes(input.region)?input.region:'ru',os:['win','mac','linux'].includes(input.os)?input.os:'',mode:['single','coop','multi'].includes(input.mode)?input.mode:'',price:['free','paid','sale'].includes(input.price)?input.price:'',russian:input.russian===true,minRating:[0,70,80,90].includes(+input.minRating)?+input.minRating:0,from:input.from||'',to:input.to||'',sort:Object.hasOwn(SORTS,input.sort)?input.sort:'popular'};
 if((f.from&&!validDate(f.from))||(f.to&&!validDate(f.to)))throw new Error('Укажите корректную дату выхода.');
 if(f.from&&f.to&&f.from>f.to)throw new Error('Начало периода должно быть раньше его конца.');
 if(f.from||f.to)f.sort='new';return f;
}
export function searchURL(f,start=0,count=50){
 const q=new URLSearchParams({start:String(start),count:String(count),json:'1',infinite:'1',category1:'998',l:'english',cc:f.region,sort_by:SORTS[f.sort]});
 if(f.term)q.set('term',f.term);const tags=[...(f.tags||[]).map(t=>TAGS[t]),TAGS[f.mood]].filter(Boolean);if(tags.length)q.set('tags',[...new Set(tags)].join(','));
 if(f.russian)q.set('supportedlang','russian');if(f.os)q.set('os',f.os);if(f.mode)q.set('category2',{single:'2',coop:'9',multi:'1'}[f.mode]);
 if(f.price==='free')q.set('maxprice','free');if(f.price==='paid')q.set('hidef2p','1');if(f.price==='sale')q.set('specials','1');
 if(f.from||f.to)q.set('hidecomingsoon','1');return 'https://store.steampowered.com/search/results/?'+q;
}
export function matches(g,f){return !((f.from||f.to)&&!g.release)&&!(f.from&&g.release<f.from)&&!(f.to&&g.release>f.to)&&!(f.minRating&&(g.rating===null||g.rating<f.minRating));}
export function normalizeDetails(d,id){
 if(!d||d.type!=='game')throw new Error('Steam не вернул страницу игры для выбранного региона.');
 const requirements={};for(const os of ['pc','mac','linux']){const r=d[os+'_requirements']||{};requirements[os]={minimum:plain(r.minimum),recommended:plain(r.recommended)};}
 return {id,title:plain(d.name),description:plain(d.about_the_game||d.detailed_description||d.short_description),short:plain(d.short_description),header:mediaUrl(d.header_image),hero:mediaUrl(d.background_raw||d.background||d.header_image),screenshots:(d.screenshots||[]).map(s=>({thumb:mediaUrl(s.path_thumbnail),full:mediaUrl(s.path_full)})).filter(s=>s.full),requirements,releaseText:d.release_date?.date||'Не указана',comingSoon:!!d.release_date?.coming_soon,developers:(d.developers||[]).map(plain),publishers:(d.publishers||[]).map(plain),genres:(d.genres||[]).map(g=>plain(g.description)),platforms:d.platforms||{},languages:plain(d.supported_languages),price:d.is_free?'Бесплатно':d.price_overview?.final_formatted||'Цена недоступна в регионе',discount:d.price_overview?.discount_percent||0,age:d.required_age||0};
}
export class SteamClient{
 constructor(cache,transport=fetch,delay=550){this.cache=cache;this.transport=transport;this.delay=delay;this.queue=Promise.resolve();this.last=0;}
 async get(url,ttl,validate=()=>{}){
  let cached=await this.cache.get(url);if(cached){try{validate(cached.value);}catch{cached=null;}}if(cached&&Date.now()-cached.savedAt<ttl)return {...cached,stale:false};
  const run=async()=>{
   await new Promise(r=>setTimeout(r,Math.max(0,this.last+this.delay-Date.now())));this.last=Date.now();
   try{const r=await this.transport(url,{headers:{Accept:'application/json','User-Agent':'IndieCompass/2.0'},signal:AbortSignal.timeout(18000)});
    if(!r.ok)throw new Error(r.status===429?'Steam ограничил частоту запросов. Подождите немного.':`Steam ответил HTTP ${r.status}.`);
    const value=await r.json();if(value===null)throw new Error('Steam вернул пустой ответ.');validate(value);const savedAt=Date.now();await this.cache.set(url,{value,savedAt});return {value,savedAt,stale:false};
   }catch(e){if(cached)return {...cached,stale:true};throw new Error(e.message.startsWith('Steam')?e.message:'Нет связи со Steam. Проверьте интернет или попробуйте другой регион магазина.');}
  };
  const task=this.queue.then(run,run);this.queue=task.catch(()=>{});return task;
 }
 async search(input,offset=0,hidden=[]){
  const f=normalizeFilters(input);let dateNote='';let start=Math.max(0,Math.min(10000000,Math.trunc(Number(offset)||0))),total=0,scanned=0,stale=false,finished=false;const items=[],seen=new Set();
  if(start===0&&f.to){const seek=await this.seekDate(f);start=seek.start;dateNote=seek.note;}
  for(let n=0;n<((f.from||f.to||f.minRating)?4:1);n++){
   const result=await this.get(searchURL(f,start),15*60*1000,parseSearch);stale||=result.stale;const page=parseSearch(result.value);total=page.total;
   if(!page.rowCount){if(start<total)throw new Error('Steam вернул неполную страницу каталога. Повторите запрос позже.');finished=true;break;}
   for(const g of page.games)if(matches(g,f)&&!hidden.includes(g.id)&&!seen.has(g.id)){seen.add(g.id);items.push(g);}
   start+=page.rowCount;scanned+=page.rowCount;finished=start>=total;if(items.length>=24||finished)break;
  }
  return {items,total,next:finished?null:start,scanned,stale,dateNote,filters:f};
 }
 async seekDate(f){
  const read=async start=>{const r=await this.get(searchURL(f,start),900000,parseSearch);return parseSearch(r.value);};
  const ordered=p=>p.games.length>0&&p.games.every((g,i)=>g.release&&(!i||p.games[i-1].release>=g.release));
  const fallback={start:0,note:'Steam не предоставил точные упорядоченные даты. Период проверяется при последовательной загрузке страниц.'};
  const first=await read(0);if(!first.games.length||!ordered(first))return fallback;
  if(first.games.at(-1).release<=f.to)return {start:0,note:''};
  let low=0,high=Math.max(0,Math.ceil(first.total/50)-1),steps=0;
  while(low<high&&steps++<18){const mid=Math.floor((low+high)/2),page=await read(mid*50);if(!ordered(page))return fallback;if(page.games.at(-1).release<=f.to)high=mid;else low=mid+1;}
  return {start:low*50,note:''};
 }
 async details(id,region='ru'){
  if(!/^\d{1,10}$/.test(id))throw new Error('Некорректный идентификатор игры.');if(!['ru','us','kz','de','tr'].includes(region))throw new Error('Неизвестный регион.');
  const r=await this.get(`https://store.steampowered.com/api/appdetails?appids=${id}&l=russian&cc=${region}`,86400000,value=>{if(!value[id]?.success)throw new Error('Steam не предоставил данные игры для этого региона.');normalizeDetails(value[id].data,id);}),app=r.value[id];
  if(!app?.success)throw new Error('Steam не предоставил данные игры. Она может быть недоступна в этом регионе.');return {...normalizeDetails(app.data,id),stale:r.stale,savedAt:r.savedAt};
 }
}
