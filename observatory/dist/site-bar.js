/**
 * Site bar for the combined site. The build (scripts/mount.mjs) writes the bar
 * into index.html from the main app's navigation data, so it is on screen with
 * the first paint; this module only gives it its dropdown behaviour. Served
 * alone, the Observatory has no bar and its layout is unchanged.
 */
const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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

/** Pages listed under a group, or under the whole navigation. */
export const pageCount=groups=>[].concat(groups).reduce((n,group)=>n+group.sections.reduce((m,section)=>m+section.items.length,0),0);

const panel=group=>'<div class="sb-panel">'+group.sections.map(section=>'<div>'
  +(section.heading?'<h3>'+esc(section.heading)+'</h3>':'')
  +section.items.map(item=>'<a href="'+esc(siteHref(item.to))+'">'+esc(item.label)+'</a>').join('')+'</div>').join('')+'</div>';
const dropdown=group=>'<details><summary>'+esc(group.label)+'<small>'+pageCount(group)+'</small></summary>'+panel(group)+'</details>';

/**
 * The bar as markup: brand, mode switch, research menus, then `actions`, the
 * Observatory's own header actions (saved views, help, source) as trusted
 * markup from its page. One header for the combined site.
 */
export function renderSiteBar(nav,actions=''){
  const total=pageCount(nav);
  return '<nav class="site-bar" aria-label="Site sections">'
    +'<a class="sb-brand" href="./" title="Front page">explore<i>riemann</i></a>'
    // Two modes of one site: this visual workbench, and the written research.
    +'<div class="sb-mode" title="Switch between the visual Observatory and the research programme">'
    +'<span aria-current="page">Observatory</span><a href="'+esc(siteHref('/'))+'">Research<small>'+total+' pages</small></a></div>'
    +'<div class="sb-groups">'+nav.map(dropdown).join('')+'</div>'
    +'<details class="sb-menu"><summary>Research menu<small>'+total+'</small></summary><div class="sb-panel">'+nav.map(dropdown).join('')+'</div></details>'
    +'<div class="sb-right">'+actions+'</div></nav>';
}

/** One dropdown open at a time; close on outside click or Escape. */
export function attachSiteBar(bar,doc=document){
  const tops=[...bar.querySelectorAll('.sb-groups>details,.site-bar>.sb-menu')];
  bar.addEventListener('toggle',event=>{if(event.target.open&&tops.includes(event.target))for(const other of tops)if(other!==event.target)other.open=false;},true);
  doc.addEventListener('click',event=>{if(!bar.contains(event.target))for(const d of tops)d.open=false;});
  doc.addEventListener('keydown',event=>{if(event.key==='Escape')for(const d of tops)if(d.open){d.open=false;d.querySelector('summary').focus();}});
}

if(typeof document!=='undefined'){
  const bar=document.querySelector('.site-bar');
  if(bar)attachSiteBar(bar);
}
