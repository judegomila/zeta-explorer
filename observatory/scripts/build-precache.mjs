#!/usr/bin/env node
/**
 * Build exact, lossless, standard-resolution starter frames offline.
 * Run: node scripts/build-precache.mjs
 * Options: --base-only, --without-heat-preset, --out <directory>
 * Each heat frame is independently evaluated by the same sampler as the worker.
 */
import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {sampleField} from '../dist/sampler.js';
import {encodeField,CACHE_CODEC_VERSION} from '../dist/cache-codec.js';
import {fieldKey,FIELD_CACHE_VERSION} from '../dist/field-cache.js';

const args=process.argv.slice(2),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const outArg=args.indexOf('--out'),out=outArg<0?path.join(root,'dist/precache'):path.resolve(args[outArg+1]);
await mkdir(out,{recursive:true});
const manifestPath=path.join(out,'manifest.json');
let prior=null;try{prior=JSON.parse(await readFile(manifestPath,'utf8'));}catch{}
const entries={},files=new Map(),meshes=new Map(),started=performance.now();
const defaults={geometry:'plane',function:'zeta',tau:0,resolution:'standard',extent:'extended',
  sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,chartScale:24,torusR:1.6,bridgeA:.25,
  colorMode:'phase',vortices:false,ladder:true,packets:false};
const meshKeys=['nx','ny','coords','uvs','uAxis','vAxis','sampleWeights','basePositions','normals'];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex').slice(0,20);
const assetUrl=file=>'./precache/'+file;
const localFile=url=>path.join(out,path.basename(url));

async function asset(raw,name){
 const file=name+'.bin.gz',url=assetUrl(file);
 if(!files.has(url)){
  const compressed=gzipSync(raw,{level:9});await writeFile(path.join(out,file),compressed);
  files.set(url,{bytes:compressed.byteLength,decodedBytes:raw.byteLength});
 }
 return {url,...files.get(url)};
}
async function retain(entry){
 for(const [url,bytes,decodedBytes]of[[entry.url,entry.bytes,entry.frameDecodedBytes??entry.decodedBytes],[entry.meshUrl,entry.meshBytes,entry.meshDecodedBytes]]){
  if(!url||!(await stat(localFile(url)).catch(()=>null))?.isFile())return false;
  files.set(url,{bytes,decodedBytes});
 }
 return true;
}
function register(state,entry,label){
 entries[fieldKey(state)]={...entry,state,label};
 // Precomputed ladder lines are an exact optional superset. They are ignored
 // when both overlay switches are off; numerical surface arrays are identical.
 if(state.ladder&&!state.vortices){
  const plain={...state,ladder:false,packets:false};
  entries[fieldKey(plain)]={...entry,state:plain,label:label+' · overlays off'};
 }
}
async function build(overrides,label){
 const state={...defaults,...overrides},key=fieldKey(state);
 const existing=prior?.version===FIELD_CACHE_VERSION&&prior?.codecVersion===CACHE_CODEC_VERSION?prior.entries?.[key]:null;
 if(existing&&await retain(existing)){register(state,existing,label);console.log('REUSED '+label);return;}
 const data=sampleField(state),mesh={},frame={...data};
 for(const name of meshKeys){mesh[name]=frame[name];delete frame[name];}
 const meshRaw=encodeField(mesh),meshHash=digest(meshRaw);
 let meshAsset=meshes.get(meshHash);
 if(!meshAsset){meshAsset=await asset(meshRaw,'mesh-'+meshHash);meshes.set(meshHash,meshAsset);}
 const frameAsset=await asset(encodeField(frame),'frame-'+digest(key));
 const entry={...frameAsset,frameDecodedBytes:frameAsset.decodedBytes,decodedBytes:frameAsset.decodedBytes+meshAsset.decodedBytes,
  compression:'gzip',meshUrl:meshAsset.url,meshBytes:meshAsset.bytes,
  meshDecodedBytes:meshAsset.decodedBytes,samples:data.validCount,maxSampleT:data.maxSampleT};
 register(state,entry,label);
 console.log(JSON.stringify({label,samples:data.validCount,computeMs:Math.round(data.ms),frameBytes:entry.bytes,meshBytes:entry.meshBytes}));
 // A durable manifest after each frame lets a long offline build resume safely.
 await saveManifest();
}
async function saveManifest(){
 const manifest={version:FIELD_CACHE_VERSION,codecVersion:CACHE_CODEC_VERSION,generatedAt:new Date().toISOString(),
  description:'Independent exact samples; lossless typed-array frames. Shared mesh files contain geometry only. Optional ladder records are a display superset, never an interpolated field.',
  resolution:'standard',heatRange:{min:-.3,max:.5,step:.05,frames:17},
  uniqueFiles:files.size,totalCompressedBytes:[...files.values()].reduce((sum,f)=>sum+f.bytes,0),
  totalDecodedBytes:[...files.values()].reduce((sum,f)=>sum+f.decodedBytes,0),entries};
 await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
}

for(const kind of ['zeta','xi'])for(const geometry of ['plane','sphere','torus'])
 await build({function:kind,geometry},`${kind} · ${geometry}`);
await build({function:'xi',colorMode:'bridge',sigmaMin:-.25,sigmaMax:1.25,tMin:10,tMax:28},'bridge preset');
await build({sigmaMin:-10,sigmaMax:4,tMin:-7,tMax:7},'pole preset');
await build({tMin:0,tMax:48},'phase atlas preset');
await build({sigmaMin:-.15,sigmaMax:1.15,tMin:12.8,tMax:15.5,vortices:true,ladder:false},'vortex preset');
if(!args.includes('--base-only')){
 const taus=Array.from({length:17},(_,i)=>Number((-.3+i*.05).toFixed(2)));
 for(const geometry of ['plane','sphere','torus'])for(const tau of taus)
  await build({function:'heat',geometry,tau},`heat ${tau.toFixed(2)} · ${geometry}`);
 if(!args.includes('--without-heat-preset'))for(const tau of taus)
  await build({function:'heat',tau,sigmaMin:-.75,sigmaMax:1.75,tMin:10,tMax:32},`heat preset ${tau.toFixed(2)}`);
}
await saveManifest();
console.log(JSON.stringify({complete:true,entries:Object.keys(entries).length,uniqueFiles:files.size,
  compressedMegabytes:[...files.values()].reduce((sum,f)=>sum+f.bytes,0)/1e6,
  elapsedSeconds:(performance.now()-started)/1000}));
