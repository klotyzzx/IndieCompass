import {icon} from './icons.js';
const controls=new Set();let opened=null,serial=0;
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
class Dropdown {
 constructor(select){
  this.select=select;this.multiple=select.multiple;this.active=0;this.typeahead='';this.lastKey=0;
  const label=select.getAttribute('aria-label')||select.labels?.[0]?.childNodes[0]?.textContent.trim()||'Выбор';
  this.fieldLabel=label;this.wrap=node('div','custom-select'+(this.multiple?' multi-select':''));
  this.trigger=node('button','select-trigger');this.trigger.type='button';this.trigger.id=(select.id||'select-'+(++serial))+'-trigger';
  this.trigger.setAttribute('role','combobox');this.trigger.setAttribute('aria-haspopup','listbox');this.trigger.setAttribute('aria-expanded','false');this.trigger.setAttribute('aria-label',label);
  this.value=node('span','select-value');this.trigger.append(this.value,icon('chevron','select-chevron'));
  this.panel=node('div','dropdown-panel'+(this.multiple?' dropdown-multi':''));this.panel.id=this.trigger.id+'-panel';this.panel.setAttribute('popover','manual');
  this.list=node('div','dropdown-options');this.list.id=this.trigger.id+'-list';this.list.setAttribute('role','listbox');this.list.setAttribute('aria-label',label);if(this.multiple)this.list.setAttribute('aria-multiselectable','true');
  this.trigger.setAttribute('aria-controls',this.list.id);
  if(this.multiple){const heading=node('div','dropdown-heading');heading.append(node('strong','','Сочетание жанров'),node('span','','Ищем игры со всеми выбранными тегами'));this.panel.append(heading);}
  this.panel.append(this.list);
  this.options=[...select.options].map((option,i)=>{
   const row=node('div','dropdown-option');row.id=this.trigger.id+'-option-'+i;row.setAttribute('role','option');row.dataset.value=option.value;
   const marker=node('span','option-marker');marker.append(icon('check'));row.append(marker,node('span','option-text',option.textContent));
   row.addEventListener('pointerdown',e=>e.preventDefault());row.addEventListener('click',()=>{if(option.disabled)return;this.active=i;this.choose();});row.addEventListener('pointermove',()=>{this.active=i;this.highlight(false);});this.list.append(row);return row;
  });
  if(this.multiple){const footer=node('div','dropdown-footer'),clear=node('button','dropdown-clear','Все игры'),done=node('button','dropdown-done','Готово');clear.type=done.type='button';clear.onclick=()=>{for(const o of select.options)o.selected=false;this.changed();this.trigger.focus();};done.onclick=()=>this.close(true);footer.append(clear,done);this.panel.append(footer);}
  select.before(this.wrap);this.wrap.append(select,this.trigger);select.hidden=true;select.setAttribute('aria-hidden','true');select.tabIndex=-1;
  (select.closest('dialog')||document.body).append(this.panel);
  this.trigger.onclick=()=>opened===this?this.close():this.open();this.trigger.onkeydown=e=>this.keydown(e);
  this.onChange=()=>this.sync();select.addEventListener('change',this.onChange);this.panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();this.close(true);}});
  this.sync();controls.add(this);
 }
 sync(){
  const selected=[...this.select.selectedOptions];const label=this.multiple?(selected.length?selected.map(o=>o.textContent).join(' + '):'Все игры'):(selected[0]?.textContent||'Выбрать');
  this.value.textContent=this.multiple&&selected.length>2?selected.slice(0,2).map(o=>o.textContent).join(' + ')+' · ещё '+(selected.length-2):label;this.trigger.title=label;this.trigger.setAttribute('aria-label',this.fieldLabel+': '+label);this.trigger.disabled=this.select.disabled;this.trigger.setAttribute('aria-disabled',String(this.select.disabled));this.trigger.classList.toggle('has-selection',this.multiple&&selected.length>0);
  this.options.forEach((row,i)=>{const o=this.select.options[i];row.setAttribute('aria-selected',String(o.selected));row.setAttribute('aria-disabled',String(o.disabled));row.classList.toggle('selected',o.selected);});
  if(this.select.disabled&&opened===this)this.close();
 }
 open(){
  if(this.trigger.disabled)return;if(opened&&opened!==this)opened.close();opened=this;
  this.active=Math.max(0,this.select.selectedIndex);this.panel.showPopover();this.trigger.setAttribute('aria-expanded','true');this.wrap.classList.add('is-open');this.position();this.highlight();
 }
 close(focus=false){
  if(opened===this)opened=null;if(this.panel.matches(':popover-open'))this.panel.hidePopover();this.trigger.setAttribute('aria-expanded','false');this.trigger.removeAttribute('aria-activedescendant');this.wrap.classList.remove('is-open');this.typeahead='';if(focus&&this.trigger.isConnected)this.trigger.focus();
 }
 position(){
  const r=this.trigger.getBoundingClientRect(),gap=7,margin=10;
  if(r.bottom<0||r.top>innerHeight){this.close();return;}
  const width=Math.min(Math.max(r.width,this.multiple?278:220),innerWidth-margin*2);
  this.panel.style.width=width+'px';this.panel.style.maxHeight=Math.min(360,innerHeight-margin*2)+'px';
  const wanted=this.panel.scrollHeight,below=innerHeight-r.bottom-gap-margin,above=r.top-gap-margin;
  const up=below<Math.min(wanted,230)&&above>below,space=up?above:below,height=Math.min(wanted,Math.max(90,space));
  this.panel.style.maxHeight=height+'px';this.panel.style.left=Math.max(margin,Math.min(r.left,innerWidth-width-margin))+'px';
  this.panel.style.top=(up?Math.max(margin,r.top-gap-height):r.bottom+gap)+'px';
 }
 highlight(scroll=true){this.options.forEach((row,i)=>row.classList.toggle('highlighted',i===this.active));const row=this.options[this.active];if(row){this.trigger.setAttribute('aria-activedescendant',row.id);if(scroll)row.scrollIntoView({block:'nearest'});}}
 changed(){this.sync();this.select.dispatchEvent(new Event('input',{bubbles:true}));this.select.dispatchEvent(new Event('change',{bubbles:true}));}
 choose(){const o=this.select.options[this.active];if(!o||o.disabled)return;if(this.multiple)o.selected=!o.selected;else this.select.selectedIndex=this.active;this.changed();if(this.multiple){this.position();this.highlight(false);this.trigger.focus();}else this.close(true);}
 keydown(e){
  if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
   e.preventDefault();const wasOpen=opened===this;if(!wasOpen)this.open();else if(e.key==='ArrowDown')this.active=(this.active+1)%this.options.length;else if(e.key==='ArrowUp')this.active=(this.active+this.options.length-1)%this.options.length;
   if(e.key==='Home')this.active=0;if(e.key==='End')this.active=this.options.length-1;this.highlight();return;
  }
  if(e.key==='Enter'||e.key===' '){e.preventDefault();if(opened===this)this.choose();else this.open();return;}
  if(e.key==='Escape'&&opened===this){e.preventDefault();e.stopPropagation();this.close(true);return;}
  if(e.key==='Tab'){this.close();return;}
  if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();if(opened!==this)this.open();this.typeahead=Date.now()-this.lastKey>700?e.key:this.typeahead+e.key;this.lastKey=Date.now();const found=[...this.select.options].findIndex(o=>o.textContent.toLocaleLowerCase().startsWith(this.typeahead.toLocaleLowerCase()));if(found>=0){this.active=found;this.highlight();}}
 }
 destroy(){this.close();this.panel.remove();this.select.removeEventListener('change',this.onChange);controls.delete(this);}
}
export function enhanceSelects(root=document){for(const control of controls)if(!control.select.isConnected)control.destroy();for(const select of root.querySelectorAll('select'))if(![...controls].some(c=>c.select===select))new Dropdown(select);}
export function syncSelects(){for(const c of controls)if(c.select.isConnected)c.sync();}
export function closeDropdowns(){opened?.close();}
document.addEventListener('pointerdown',e=>{if(opened&&!opened.wrap.contains(e.target)&&!opened.panel.contains(e.target))opened.close();},true);
document.addEventListener('scroll',()=>opened?.position(),true);window.addEventListener('resize',()=>opened?.position());document.addEventListener('close',closeDropdowns,true);
