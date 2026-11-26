/**
 * Links from the model workbenches to the mathematics that explains them.
 *
 * `methods` and `learn` targets are files of the Observatory itself, given as
 * relative paths with an anchor; they work when the Observatory is served
 * alone and when it is mounted under /observatory/. `site` targets are routes
 * of the main research site, reached through its hash router one folder up;
 * they are shown only when the site bar is present, that is, in the mounted
 * build. tests/models-links.test.mjs checks that every target exists.
 */
export const METHODS_PAGE='./methods.html';
export const LEARN_PAGE='./learn/';
/** Hash-router link into the main site, relative to the Observatory folder. */
export const siteLink=route=>'../#'+route;
export const methodsLink=anchor=>METHODS_PAGE+'#'+anchor;
export const learnLink=anchor=>LEARN_PAGE+'#'+anchor;

const SITE=Object.freeze({
  ladder:['/twin-ladder','Twin-ladder explorer'],
  paper:['/paper','The twin-ladder paper'],
  fluid:['/supercritical','Supercritical-fluid analogy'],
  results:['/key-results','Key results'],
  hamiltonian:['/hamiltonian','Hamiltonian'],
  oscillators:['/oscillators','Prime oscillators'],
});

/**
 * Per section: `primary` is the methods anchor for the whole section,
 * `panels` the anchors for the four small panels (null where a section draws
 * fewer), `learn` an anchor of the introduction, `site` routes of the main site.
 */
export const SECTION_LINKS=Object.freeze({
  ladder:{primary:'ladder',panels:['ladder','ladder','ladder',null],learn:'music',site:[SITE.ladder,SITE.oscillators,SITE.paper]},
  rails:{primary:'rails',panels:['rails','rails','rails-primes','rails-passivity'],learn:'zeros',site:[SITE.ladder,SITE.hamiltonian,SITE.results]},
  temperature:{primary:'limiting-temperature',panels:['limiting-temperature','rails-primes','limiting-temperature',null],learn:'euler',site:[SITE.fluid,SITE.results]},
  vacuum:{primary:'vacuum-energy',panels:['vacuum-energy','vacuum-balance','vacuum-balance','vacuum-balance'],learn:'riemann',site:[SITE.ladder,SITE.results]},
  drop:{primary:'nucleus',panels:['nucleus','nucleus','nucleus',null],learn:'here',site:[SITE.results]},
  statistics:{primary:'level-statistics',panels:['level-statistics','spacing-ratio','number-variance','porter-thomas'],learn:'zeros',site:[SITE.results]},
  trend:{primary:'heavy-nuclei',panels:['heavy-nuclei','heavy-nuclei','heavy-nuclei','heavy-nuclei'],learn:'here',site:[SITE.fluid]},
  horizon:{primary:'horizon',panels:['horizon-counting','porter-thomas','horizon-buchdahl','horizon-temperature'],learn:'known',site:[SITE.fluid,SITE.results]},
});

/** Every link of a section as {label, href, kind}; `site` entries only when mounted. */
export function sectionLinks(section,{mounted=false}={}){
  const entry=SECTION_LINKS[section];if(!entry)return [];
  const out=[{label:'Mathematics of this view',href:methodsLink(entry.primary),kind:'methods'},
    {label:'Introduction for newcomers',href:learnLink(entry.learn),kind:'learn'}];
  if(mounted)for(const [route,label] of entry.site)out.push({label,href:siteLink(route),kind:'site'});
  return out;
}
/** All targets, for the link test. */
export function allLinkTargets(){
  const methods=new Set(),learn=new Set(),site=new Set();
  for(const entry of Object.values(SECTION_LINKS)){
    methods.add(entry.primary);for(const a of entry.panels)if(a)methods.add(a);
    learn.add(entry.learn);for(const [route] of entry.site)site.add(route);
  }
  return {methods:[...methods],learn:[...learn],site:[...site]};
}
