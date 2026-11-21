#!/usr/bin/env node
/**
 * Mount the Observatory inside the main site's build output.
 * Run from anywhere, after the main `vite build`:
 *   node observatory/scripts/mount.mjs [--out DIR] [--skip-precache]
 *
 * 1. Builds the projective starter packs (git-ignored, reproducible).
 * 2. Copies observatory/dist to <repo>/dist/observatory, so the site serves
 *    the Observatory at /observatory/.
 * 3. Writes the site bar into the mounted index.html from the main app's
 *    navigation, so the single header is there on first paint.
 *
 * The Observatory uses relative asset paths only, so it needs no rewriting.
 */
import {cp,rm,stat,readdir,readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const here=path.dirname(fileURLToPath(import.meta.url));
const observatory=path.resolve(here,'..'),repo=path.resolve(observatory,'..');
const args=process.argv.slice(2);
const outAt=args.indexOf('--out');
const out=path.resolve(outAt>=0&&args[outAt+1]?args[outAt+1]:path.join(repo,'dist','observatory'));
const source=path.join(observatory,'dist');

// Refuse targets that would delete the source or anything above it.
const inside=(child,parent)=>{const r=path.relative(parent,child);return r===''||(!r.startsWith('..')&&!path.isAbsolute(r));};
if(inside(out,source)||inside(source,out)){
  console.error('mount: refusing output directory '+out);process.exit(1);
}

if(!args.includes('--skip-precache')){
  const built=spawnSync(process.execPath,[path.join(here,'build-projective-precache.mjs')],{cwd:observatory,stdio:'inherit'});
  if(built.status!==0){console.error('mount: precache build failed');process.exit(built.status??1);}
}

await rm(out,{recursive:true,force:true});
await cp(source,out,{recursive:true});

// The Observatory's site bar shows the main app's navigation. It is written
// into the page here, with the Observatory's own header actions moved into it,
// so nothing has to be fetched or rearranged after the page loads.
let nav=null;
try{
  const {NAV_GROUPS}=await import(pathToFileURL(path.join(repo,'src','data','nav-groups.js')).href);
  nav=NAV_GROUPS.map(group=>({label:group.label,sections:group.sections.map(section=>({heading:section.heading??'',items:section.items.map(({to,label})=>({to,label}))}))}));
}catch(error){
  console.warn('mount: no site navigation found ('+error.message+'); the Observatory keeps its own header');
}
if(nav){
  const {cleanNav,renderSiteBar}=await import(pathToFileURL(path.join(source,'site-bar.js')).href);
  const groups=cleanNav(nav),page=path.join(out,'index.html');
  let html=await readFile(page,'utf8');
  const actions=html.match(/[ \t]*<nav class="header-actions">[\s\S]*?<\/nav>\n?/);
  const marks=['<html lang="en">','<body>'];
  if(!groups.length||!actions||marks.some(mark=>html.split(mark).length!==2)){
    console.error('mount: index.html no longer has the markup the site bar is written into');process.exit(1);
  }
  // The bar replaces the Observatory's 74px header (64px on phones) and is
  // 18px shorter, so the layout offset is negative.
  html=html.replace(actions[0],'')
    .replace(marks[0],'<html lang="en" style="--site-bar:-18px">')
    .replace(marks[1],'<body data-site-bar="true">\n'+renderSiteBar(groups,actions[0].trim()));
  await writeFile(page,html);
  console.log('mount: site bar, '+groups.length+' groups');
}

async function size(dir){
  let files=0,bytes=0;
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()){const s=await size(full);files+=s.files;bytes+=s.bytes;}
    else{files++;bytes+=(await stat(full)).size;}
  }
  return {files,bytes};
}
const {files,bytes}=await size(out);
await stat(path.join(out,'index.html'));
console.log('mount: '+files+' files, '+(bytes/1048576).toFixed(1)+' MB -> '+path.relative(repo,out));
