export function icon(name, className='') {
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');if(className)svg.setAttribute('class',className);
 const paths={heart:['M12 20.5 3.6 12.3C-.3 8.3 2.2 2.5 6.7 3.5c2.3.3 3.8 2 5.3 3.7 1.5-1.7 3-3.4 5.3-3.7 4.5-1 7 4.8 3.1 8.8Z'],search:['M17 17 21 21','M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0'],chevron:['m6 9 6 6 6-6'],check:['m5 12 4 4L19 6'],close:['m6 6 12 12','M18 6 6 18']};
 for(const d of paths[name]||[]){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);svg.append(p);}return svg;
}
