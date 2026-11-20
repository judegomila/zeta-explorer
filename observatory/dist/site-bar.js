/**
 * Site bar for the combined site. The build writes ./site-nav.json from the
 * main app's navigation data; when the file is absent (the Observatory served
 * alone) no bar is drawn and the layout is unchanged.
 */
const el=(tag,props={},...children)=>{const node=Object.assign(document.createElement(tag),props);node.append(...children);return node;};

/** Hash-router link into the main app, relative to the Observatory folder. */
export const siteHref=(to,root='../')=>root+'#'+(String(to).startsWith('/')?to:'/'+to);

/** Keep only well-formed groups, sections and internal routes. */
export function cleanNav(raw){
  if(!Array.isArray(raw))return [];
  return raw.map(group=>({label:String(group?.label??''),sections:(Array.isArray(group?.sections)?group.sections:[]).map(section=>({
    heading:String(section?.heading??''),
    items:(Array.isArray(section?.items)?section.items:[]).filter(item=>typeof item?.to==='string'&&/^\/(?!\/)[\w\-/.]*$/.test(item.to)&&typeof item?.label==='string'),
  })).filter(section=>section.items.length)})).filter(group=>group.label&&group.sections.length);
}

function panel(group){
  return el('div',{className:'sb-panel'},...group.sections.map(section=>el('div',{},
    ...(section.heading?[el('h3',{textContent:section.heading})]:[]),
    ...section.items.map(item=>el('a',{href:siteHref(item.to),textContent:item.label})))));
}
/** Pages listed under a group, or under the whole navigation. */
export const pageCount=groups=>[].concat(groups).reduce((n,group)=>n+group.sections.reduce((m,section)=>m+section.items.length,0),0);
const dropdown=group=>el('details',{},el('summary',{},group.label,el('small',{textContent:String(pageCount(group))})),panel(group));

export function buildSiteBar(nav){
  const groups=el('div',{className:'sb-groups'},...nav.map(dropdown));
  const menu=el('details',{className:'sb-menu'},el('summary',{},'Research menu',el('small',{textContent:String(pageCount(nav))})),el('div',{className:'sb-panel'},...nav.map(dropdown)));
  // Two modes of one site: this visual workbench, and the written research.
  const here=el('span',{textContent:'Observatory'});here.setAttribute('aria-current','page');
  const mode=el('div',{className:'sb-mode',title:'Switch between the visual Observatory and the research programme'},
    here,el('a',{href:siteHref('/')},'Research',el('small',{textContent:pageCount(nav)+' pages'})));
  // One header for the combined site: brand, mode switch, research menus, then
  // the Observatory's own actions (saved views, help, source), which move here.
  const right=el('div',{className:'sb-right'});
  const actions=document.querySelector('.topbar .header-actions');
  if(actions)right.append(actions);
  const bar=el('nav',{className:'site-bar'},
    el('a',{className:'sb-brand',href:'./',title:'Front page'},'explore',el('i',{textContent:'zeta'})),
    mode,groups,menu,right);
  bar.setAttribute('aria-label','Site sections');
  // One dropdown open at a time; close on outside click or Escape.
  const tops=[...groups.children,menu];
  bar.addEventListener('toggle',event=>{if(event.target.open&&tops.includes(event.target))for(const other of tops)if(other!==event.target)other.open=false;},true);
  document.addEventListener('click',event=>{if(!bar.contains(event.target))for(const d of tops)d.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')for(const d of tops)if(d.open){d.open=false;d.querySelector('summary').focus();}});
  return bar;
}

if(typeof document!=='undefined'){
  fetch('./site-nav.json').then(r=>r.ok?r.json():null).then(raw=>{
    const nav=cleanNav(raw);
    if(!nav.length)return;
    // The bar replaces the Observatory's 74px header (64px on phones) and is
    // 18px shorter, so the layout offset is negative.
    document.documentElement.style.setProperty('--site-bar','-18px');
    document.body.prepend(buildSiteBar(nav));
    document.body.dataset.siteBar='true';
    window.dispatchEvent(new Event('resize'));
  }).catch(()=>{});
}
