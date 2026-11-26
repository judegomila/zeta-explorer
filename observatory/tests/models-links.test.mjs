import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {SECTION_LINKS,sectionLinks,allLinkTargets,methodsLink,learnLink,siteLink,METHODS_PAGE,LEARN_PAGE} from '../dist/models-links.js';
import {SECTIONS,MODE_SECTIONS} from '../dist/models-sections.js';
import {MODELS_ENUMS} from '../dist/models.js';

const dist=new URL('../dist/',import.meta.url);
const idsOf=file=>new Set([...readFileSync(new URL(file,dist),'utf8').matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
const methods=readFileSync(new URL('methods.html',dist),'utf8');

test('every section of every workbench has links, and every link target exists',()=>{
  const sections=Object.values(MODE_SECTIONS).flat().map(([key])=>key);
  assert.deepEqual(sections.sort(),Object.keys(SECTION_LINKS).sort());
  assert.deepEqual(MODE_SECTIONS.ladder.map(s=>s[0]),MODELS_ENUMS.ladderPanel);
  assert.deepEqual(MODE_SECTIONS.nucleus.map(s=>s[0]),MODELS_ENUMS.nucleusPanel);
  for(const key of Object.keys(SECTIONS))assert.ok(SECTION_LINKS[key],key);
  const targets=allLinkTargets(),methodIds=idsOf('methods.html'),learnIds=idsOf('learn/index.html');
  assert.ok(existsSync(new URL(METHODS_PAGE,dist)));assert.ok(existsSync(new URL(LEARN_PAGE+'index.html',dist)));
  for(const anchor of targets.methods)assert.ok(methodIds.has(anchor),`methods.html#${anchor} exists`);
  for(const anchor of targets.learn)assert.ok(learnIds.has(anchor),`learn/#${anchor} exists`);
  // Sections without a prior home on the methods page have their own heading there.
  for(const anchor of ['rails','rails-primes','rails-passivity','limiting-temperature','vacuum-energy','vacuum-balance','level-statistics','spacing-ratio',
    'number-variance','porter-thomas','heavy-nuclei','horizon','horizon-temperature','horizon-buchdahl','horizon-counting'])
    assert.match(methods,new RegExp(`<h[23] id="${anchor}">`),anchor);
  // The methods page lists them in its contents.
  for(const anchor of ['rails','limiting-temperature','vacuum-energy','level-statistics','heavy-nuclei','horizon','nucleus'])
    assert.ok(methods.includes(`<a href="#${anchor}">`),`contents entry for ${anchor}`);
});

test('main-site links name routes that exist, and are offered only in the mounted build',()=>{
  // The Observatory can be tested alone; the route check runs when the main site is present.
  const nav=new URL('../../src/data/nav-groups.js',import.meta.url),{site}=allLinkTargets();
  assert.ok(site.length>=4);
  if(existsSync(nav)){const text=readFileSync(nav,'utf8');for(const route of site)assert.ok(text.includes(`to: '${route}'`),`route ${route} is in the site navigation`);}
  for(const route of site)assert.match(route,/^\/[a-z-]+$/);
  assert.equal(siteLink('/twin-ladder'),'../#/twin-ladder');
  for(const section of Object.keys(SECTION_LINKS)){
    const alone=sectionLinks(section),mounted=sectionLinks(section,{mounted:true});
    assert.ok(alone.every(l=>l.kind!=='site'));assert.ok(mounted.some(l=>l.kind==='site'));
    assert.equal(alone[0].href,methodsLink(SECTION_LINKS[section].primary));assert.equal(alone[1].href,learnLink(SECTION_LINKS[section].learn));
    // Relative paths only: the same links work alone and under /observatory/.
    for(const l of mounted)assert.match(l.href,/^\.\.?\//);
  }
  assert.deepEqual(sectionLinks('nowhere'),[]);
});

test('links inside the methods page resolve',()=>{
  const ids=idsOf('methods.html');
  for(const [,anchor] of methods.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(anchor),`#${anchor}`);
  // Deep links from the new sections open named views with valid state.
  for(const [,query] of methods.matchAll(/href="\.\/\?view=(?:twinLadder|uranium238)&amp;state=([^"]+)"/g)){
    const state=JSON.parse(decodeURIComponent(query));
    for(const [key,value] of Object.entries(state))assert.ok(MODELS_ENUMS[key].includes(value),`${key}=${value}`);
  }
  assert.ok(methods.includes('href="./?view=horizon"'));
});

test('section texts keep to the wording rules',()=>{
  const banned=/\b(breakthrough|remarkabl|stunning|beautiful|elegant|powerful|revolutionar|amazing|striking|groundbreaking|proves the Riemann|proof of the Riemann|evidence for the Riemann|supports the Riemann)/i;
  for(const [key,s] of Object.entries(SECTIONS)){
    const text=[s.title,s.lede,s.note,...s.captions,...s.heads.flat()].join(' ');
    assert.doesNotMatch(text,banned,key);
    assert.equal(s.heads.length,4);assert.equal(s.captions.length,4);assert.equal(typeof s.draw,'function');
  }
  // Where the status of a statement matters, it is named.
  assert.match(SECTIONS.rails.note,/THEOREM[^]*EQUIVALENT TO RH[^]*finite window shows nothing/);
  assert.match(SECTIONS.vacuum.note,/one-point balance[^]*FALSE[^]*two-point[^]*any point set[^]*no information on zeros/);
  assert.match(SECTIONS.statistics.note,/cannot separate GOE from GUE/);assert.match(SECTIONS.statistics.note,/None of this is evidence about the Riemann hypothesis/);
  assert.match(SECTIONS.horizon.lede,/model analogy and establishes nothing about black holes or about the Riemann hypothesis/);
  assert.match(SECTIONS.temperature.lede,/a = ½ is the inverse temperature β\s*= 1/);
  const methodsNew=methods.slice(methods.indexOf('<h2 id="rails">'),methods.indexOf('<h2 id="heat">'));
  assert.doesNotMatch(methodsNew,banned);
});
