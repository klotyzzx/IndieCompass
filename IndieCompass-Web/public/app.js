import {icon} from './icons.js';
import {enhanceSelects,syncSelects,closeDropdowns} from './selects.js';
const $=id=>document.getElementById(id);
const DEFAULT={term:'',tags:['indie'],mood:'',region:'ru',os:'',mode:'',price:'',russian:false,minRating:0,from:'',to:'',sort:'popular'};
const fields=['mood','from','to','price','minRating','mode','os','russian','sort','region'];
let prefs={hidden:[],favorites:[],filters:{}},items=[],offset=null,total=0,scanned=0,loading=false,view='discover',applied={...DEFAULT},detailVersion=0,saveQueue=Promise.resolve(),toastTimer;
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
async function api(route,method='GET',body){const r=await fetch('/api/'+route,{method,headers:{'X-Compass':'local',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const value=await r.json();if(!r.ok)throw new Error(value.error||'Ошибка запроса.');return value;}
function save(){const snapshot=JSON.parse(JSON.stringify(prefs));saveQueue=saveQueue.catch(()=>{}).then(()=>api('preferences','PUT',snapshot)).catch(e=>toast(e.message));return saveQueue;}
function readFilters(){const f={term:$('search').value.trim()};for(const name of fields)f[name]=name==='russian'?$(name).checked:$(name).value;f.minRating=+f.minRating;f.tags=[...$('tag').selectedOptions].map(o=>o.value);return f;}
function fillFilters(f={}){const value={...DEFAULT,...f};const tags=Array.isArray(f.tags)?f.tags:typeof f.tag==='string'?(f.tag?[f.tag]:[]):DEFAULT.tags;$('search').value=value.term;for(const name of fields){if(name==='russian')$(name).checked=!!value[name];else $(name).value=value[name];}for(const option of $('tag').options)option.selected=tags.includes(option.value);syncSelects();}
function updateCounts(){$('fav-count').textContent=prefs.favorites.length;$('restore').textContent=`Вернуть скрытые (${prefs.hidden.length})`;$('restore').disabled=!prefs.hidden.length;}
function notice(text,error=false){$('notice').hidden=!text;$('notice').textContent=text;$('notice').classList.toggle('error',error);}
function image(parent,url,alt,cls=''){if(!url){parent.append(el('span','missing-cover','◈'));return;}const img=el('img',cls);img.alt=alt;img.loading='lazy';img.referrerPolicy='no-referrer';img.src=url;img.addEventListener('error',()=>{img.replaceWith(el('span','missing-cover','◈'));},{once:true});parent.append(img);}
function isSaved(id){return prefs.favorites.some(g=>g.id===id);}
function favorite(game){if(isSaved(game.id)){prefs.favorites=prefs.favorites.filter(g=>g.id!==game.id);toast('Удалено из избранного');}else{prefs.favorites.push({id:game.id,title:game.title,image:game.image||game.header||'',releaseText:game.releaseText||'',price:game.price||'',rating:game.rating??null});toast('Сохранено в избранное');}save();updateCounts();renderCards();document.querySelectorAll('[data-detail-favorite]').forEach(b=>b.textContent=isSaved(game.id)?'♥ В избранном':'♡ В избранное');}
function hide(game){prefs.hidden=[...new Set([...prefs.hidden,game.id])];items=items.filter(g=>g.id!==game.id);save();updateCounts();renderCards();toast('Игра скрыта. Вернуть её можно в боковом меню.');}
const names={indie:'Инди',horror:'Хоррор',simulation:'Симулятор',adventure:'Приключение',action:'Экшен',puzzle:'Головоломка',survival:'Выживание',relaxing:'Расслабляющая',atmospheric:'Атмосферная',single:'Одиночная',coop:'Кооператив',multi:'Мультиплеер',free:'Бесплатные',paid:'Платные',sale:'Скидки',win:'Windows',mac:'macOS',linux:'Linux / SteamOS'};
function why(){const words=[...(applied.tags||[]).map(t=>names[t]),names[applied.mood],names[applied.mode],applied.russian?'Русский язык':''].filter(Boolean);if(applied.from||applied.to)words.push('Выбранный период');return words.join(' · ')||'В результатах поиска Steam';}
function renderCards(){
 const list=view==='favorites'?prefs.favorites:items;$('cards').replaceChildren();$('result-count').textContent=list.length;
 for(const game of list){
  const card=el('article','game-card'),cover=el('button','cover-button');cover.type='button';cover.setAttribute('aria-label','Подробнее: '+game.title);image(cover,game.image,game.title);cover.onclick=()=>openDetails(game.id);card.append(cover);
  const heart=el('button','heart'+(isSaved(game.id)?' saved':''));heart.append(icon('heart'));heart.type='button';heart.setAttribute('aria-label',(isSaved(game.id)?'Убрать из избранного: ':'В избранное: ')+game.title);heart.setAttribute('aria-pressed',String(isSaved(game.id)));heart.onclick=()=>favorite(game);card.append(heart);
  if(game.discount)card.append(el('span','discount',game.discount));
  const body=el('div','card-body'),title=el('button','card-title',game.title);title.type='button';title.onclick=()=>openDetails(game.id);body.append(title);
  const meta=el('div','card-meta');meta.append(el('span','',game.release?new Date(game.release+'T12:00:00').toLocaleDateString('ru-RU'):game.releaseText||'Дата не указана'),el('span','rating',game.rating!==null&&game.rating!==undefined?'↑ '+game.rating+'%':'Нет оценок'));body.append(meta);
  const foot=el('div','card-foot');foot.append(el('span','price',game.price==='Free To Play'||game.price==='Free'?'Бесплатно':game.price));
  if(view!=='favorites'){const skip=el('button','hide-game','Не интересно');skip.type='button';skip.onclick=()=>hide(game);foot.append(skip);}body.append(foot);
  if(view!=='favorites')body.append(el('p','why',why()));card.append(body);$('cards').append(card);
 }
 const empty=list.length===0&&!loading;$('empty').hidden=!empty;
 if(empty){$('empty-title').textContent=view==='favorites'?'Твои открытия будут здесь':offset!==null?'На просмотренных страницах совпадений нет':'Пока ничего не найдено';$('empty-text').textContent=view==='favorites'?'Нажми на сердечко у понравившейся игры. Избранное хранится на этом компьютере.':offset!==null?'Каталог большой. Продолжи поиск по следующим страницам Steam или смягчи фильтры.':'Попробуй другой запрос, измени фильтры или верни скрытые игры.';}
 $('retry').hidden=view==='favorites'||offset!==null;
 $('load-more').hidden=view!=='discover'||offset===null;$('load-more').textContent=items.length?'Показать ещё ↓':'Продолжить поиск ↓';
 updateProgress();
}
function updateProgress(){if(view==='favorites'){$('progress').textContent='Сохранено локально · для подробностей нужен Steam или ранее загруженный кэш';return;}
 const count=new Intl.NumberFormat('ru-RU');$('progress').textContent=loading?'Ищем в Steam… Это может занять несколько секунд.':total?`В Steam по основным фильтрам: ${count.format(total)} · просмотрено ${count.format(scanned)} · показано ${items.length}${applied.from||applied.to||applied.minRating?' · Дата и рейтинг проверяются при загрузке страниц.':''}`:'';}
function showChips(){const chips=[];if(applied.term)chips.push('«'+applied.term+'»');chips.push(...(applied.tags||[]).map(t=>names[t]));for(const key of ['mood','price','mode','os'])if(applied[key])chips.push(names[applied[key]]);if(applied.russian)chips.push('Русский язык');if(applied.from)chips.push('С '+applied.from);if(applied.to)chips.push('По '+applied.to);if(applied.minRating)chips.push('Отзывы ≥ '+applied.minRating+'%');$('active-filters').replaceChildren(...chips.map(t=>el('span','filter-chip',t)));document.querySelectorAll('[data-quick]').forEach(b=>b.classList.toggle('selected',[...(applied.tags||[]),applied.mood].includes(b.dataset.quick)));}
function setLoading(value){loading=value;document.querySelectorAll('.apply,#sort,#region,#load-more').forEach(b=>b.disabled=value);syncSelects();updateProgress();}
async function search(more=false){
 if(loading){toast('Поиск ещё выполняется. Дождись результата.');return;}
 if(view!=='discover')setView('discover',false);
 const candidate=more?applied:readFilters();if(candidate.from&&candidate.to&&candidate.from>candidate.to){notice('Начало периода должно быть раньше его конца.',true);return;}
 if(!more){applied=candidate;if(applied.from||applied.to){applied.sort='new';$('sort').value='new';syncSelects();}items=[];offset=0;total=0;scanned=0;prefs.filters=applied;save();showChips();}
 setLoading(true);notice('');$('empty').hidden=true;if(!more)$('cards').replaceChildren(...Array.from({length:6},()=>el('div','skeleton')));
 try{const data=await api('search','POST',{filters:applied,offset:more?offset:0});items=[...new Map([...items,...data.items].filter(g=>!prefs.hidden.includes(g.id)).map(g=>[g.id,g])).values()];offset=data.next;total=data.total;scanned+=data.scanned;if(data.dateNote)notice(data.dateNote);if(data.stale)notice('Steam сейчас недоступен. Показана сохранённая копия; даты и цены могут устареть.');}
 catch(e){notice(e.message,true);if(!more)offset=null;}
 finally{setLoading(false);if(view==='discover')renderCards();}
}
function setView(next,fetch=true){view=next;$('discover').classList.toggle('active',next==='discover');$('favorites').classList.toggle('active',next==='favorites');$('section-title').textContent=next==='discover'?'Найти игру':'Избранное';$('results-title').firstChild.textContent=next==='discover'?'Стоит присмотреться ':'Твои сохранённые игры ';$('results-eyebrow').textContent=next==='discover'?'ВЫБИРАЙ СВОЁ':'КОЛЛЕКЦИЯ ОТКРЫТИЙ';document.querySelector('.sort-label').hidden=next==='favorites';$('active-filters').hidden=next==='favorites';notice('');renderCards();if(next==='discover'&&fetch&&!items.length&&!loading)search();}
function detailSection(id,title){const s=el('section','detail-section');s.id=id;s.append(el('h3','',title));return s;}
async function openDetails(id){
 closeDropdowns();
 const version=++detailVersion;const dialog=$('details');$('detail-content').replaceChildren(el('div','empty','Загружаем страницу игры…'));if(!dialog.open)dialog.showModal();
 try{const d=await api('details?id='+encodeURIComponent(id)+'&region='+encodeURIComponent($('region').value));if(version!==detailVersion||!dialog.open)return;renderDetails(d);dialog.scrollTop=0;}
 catch(e){if(version!==detailVersion)return;const box=el('div','empty');box.append(el('h3','', 'Не удалось открыть игру'),el('p','',e.message));const again=el('button','secondary','Повторить');again.onclick=()=>openDetails(id);box.append(again);$('detail-content').replaceChildren(box);}
}
function renderDetails(d){
 const content=$('detail-content');content.replaceChildren();const cover=el('div','detail-cover');image(cover,d.hero||d.header,'Баннер '+d.title);content.append(cover);
 const heading=el('div','detail-heading');heading.append(el('div','eyebrow','ОТКРЫТИЕ В STEAM'),el('h2','',d.title),el('p','',d.short));content.append(heading);
 const inner=el('div','detail-inner');content.append(inner);if(d.stale)inner.append(el('div','notice','Сохранённая копия от '+new Date(d.savedAt).toLocaleString('ru-RU')+'. Steam недоступен, сведения могут устареть.'));
 const summary=el('div','detail-summary');summary.append(el('span','detail-price',d.price));const fav=el('button','secondary',isSaved(d.id)?'♥ В избранном':'♡ В избранное');fav.dataset.detailFavorite='1';fav.onclick=()=>favorite(d);summary.append(fav);const store=el('a','primary','Открыть в Steam ↗');store.href=`https://store.steampowered.com/app/${d.id}/?cc=${encodeURIComponent($('region').value)}&l=russian`;store.target='_blank';store.rel='noopener noreferrer';summary.append(store);inner.append(summary);
 const tabs=el('nav','detail-tabs');tabs.setAttribute('aria-label','Содержание игры');for(const [key,name]of [['about-game','Об игре'],['screenshots','Скриншоты'],['requirements','Требования']]){const a=el('a','',name);a.href='#'+key;a.onclick=e=>{e.preventDefault();$(key).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});};tabs.append(a);}inner.append(tabs);
 const about=detailSection('about-game','Об игре');about.append(el('div','description',d.description||'Разработчик не предоставил описание.'));inner.append(about);
 const shots=detailSection('screenshots','Мир игры');if(d.screenshots.length){const gallery=el('div','gallery');for(const [index,s]of d.screenshots.entries()){const button=el('button');button.setAttribute('aria-label','Открыть скриншот '+(index+1));image(button,s.thumb||s.full,'Скриншот '+(index+1)+' — '+d.title);button.onclick=()=>{$('full-image').src=s.full;$('full-image').alt='Скриншот '+(index+1)+' — '+d.title;$('lightbox').showModal();};gallery.append(button);}shots.append(gallery);}else shots.append(el('p','description','Steam не предоставил скриншоты.'));inner.append(shots);
 const req=detailSection('requirements','Системные требования');req.append(el('p','help','Требования разработчика. Приложение не сканирует компьютер и не гарантирует совместимость.'));
 const os=el('select','spec-os');os.setAttribute('aria-label','Системные требования для платформы');for(const [key,name]of [['pc','Windows'],['mac','macOS'],['linux','Linux / SteamOS']]){const option=el('option','',name);option.value=key;os.append(option);}os.value={win:'pc',mac:'mac',linux:'linux'}[applied.os]||'pc';req.append(os);const specs=el('div','spec-grid');const fill=()=>{specs.replaceChildren();for(const [key,title]of [['minimum','Минимальные'],['recommended','Рекомендуемые']]){const box=el('div','spec');box.append(el('h4','',title),el('p','',d.requirements[os.value]?.[key]||'Разработчик не указал требования для этой платформы.'));specs.append(box);}};os.onchange=fill;fill();req.append(specs);inner.append(req);
 const facts=el('div','detail-facts');for(const [label,text]of [['ВЫХОД В STEAM',d.releaseText+(d.comingSoon?' · ожидается':'')],['ЖАНРЫ',d.genres.join(', ')],['РАЗРАБОТЧИК',d.developers.join(', ')],['ИЗДАТЕЛЬ',d.publishers.join(', ')],['ЯЗЫКИ',d.languages],['ИСТОЧНИК','Steam · сведения могут различаться по регионам']]){const fact=el('div');fact.append(el('span','fact-label',label),el('span','',text||'Не указано'));facts.append(fact);}inner.append(facts);enhanceSelects(content);
}
$('filters-form').onsubmit=e=>{e.preventDefault();search();};$('search-form').onsubmit=e=>{e.preventDefault();search();};$('sort').onchange=()=>search();$('region').onchange=()=>search();$('load-more').onclick=()=>search(true);$('retry').onclick=()=>search();
$('reset').onclick=()=>{fillFilters({...DEFAULT,tags:[],region:$('region').value});search();};
$('restore').onclick=async()=>{prefs.hidden=[];updateCounts();await save();toast('Скрытые игры возвращены');if(view==='discover')search();};
$('discover').onclick=()=>setView('discover');$('favorites').onclick=()=>setView('favorites');
function quick(value){if(loading){toast('Подожди завершения поиска');return;}fillFilters({...DEFAULT,region:$('region').value,tags:['relaxing','atmospheric','indie'].includes(value)?['indie']:['indie',value],mood:['relaxing','atmospheric'].includes(value)?value:''});search();}
for(const button of document.querySelectorAll('[data-quick]'))button.onclick=()=>quick(button.dataset.quick);$('indie-shortcut').onclick=()=>quick('indie');
$('close-details').onclick=()=>{$('details').close();detailVersion++;};$('details').addEventListener('cancel',()=>detailVersion++);$('close-lightbox').onclick=()=>$('lightbox').close();
for(const id of ['details','lightbox'])$(id).addEventListener('click',e=>{if(e.target===$(id)){const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){$(id).close();if(id==='details')detailVersion++;}}});
async function init(){try{const loaded=await api('preferences');prefs={hidden:loaded.hidden,favorites:loaded.favorites,filters:loaded.filters};fillFilters(prefs.filters);updateCounts();if(loaded.warning)toast(loaded.warning);await search();}catch(e){notice(e.message,true);$('empty').hidden=false;$('empty-title').textContent='Не удалось запустить каталог';$('empty-text').textContent='Открой приложение через start.bat и повтори попытку.';}}
const compact=matchMedia('(max-width: 950px)');
function moveTools(){(compact.matches?$('compact-tools'):document.querySelector('.rail')).append(document.querySelector('.rail-bottom'));}
compact.addEventListener('change',moveTools);moveTools();
enhanceSelects();
const searchSymbol=document.querySelector('#search-form>span');searchSymbol.replaceChildren(icon('search'));searchSymbol.className='search-icon';searchSymbol.setAttribute('aria-hidden','true');
const navHeart=document.querySelector('#favorites>span');navHeart.replaceChildren(icon('heart'));
init();
