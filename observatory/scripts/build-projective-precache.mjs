#!/usr/bin/env node
/**
 * Append lossless projective starter frames without replacing legacy caches.
 * Run: node scripts/build-projective-precache.mjs [--jobs N] [--out DIR]
 * Optional --base-only builds zeta/xi while preserving existing heat entries.
 *
 * Independent frames are sampled in a small worker pool. Assets and manifest
 * checkpoints use atomic renames; interrupted runs reuse only matching keys,
 * engine/codec versions, and present, valid gzip assets. No asset is deleted.
 */
import {mkdir,writeFile,readFile,rename,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {availableParallelism} from 'node:os';
import {Worker,isMainThread,parentPort} from 'node:worker_threads';
import {sampleField} from '../dist/sampler.js';
import {encodeField,CACHE_CODEC_VERSION} from '../dist/cache-codec.js';
import {fieldKey,FIELD_CACHE_VERSION} from '../dist/field-cache.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const meshKeys=['nx','ny','coords','uvs','uAxis','vAxis','sampleWeights','basePositions','normals'];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex').slice(0,20);
const defaults={geometry:'sphere',projective:true,function:'zeta',tau:0,
  resolution:'standard',extent:'extended',sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,
  chartScale:24,torusR:2,bridgeA:.25,colorMode:'phase',vortices:false,
  ladder:true,packets:false};
const taus=Array.from({length:17},(_,i)=>Number((-.3+i*.05).toFixed(2)));

function compute({state,key,label}){
  const data=sampleField(state),mesh={},frame={...data};
  for(const name of meshKeys){mesh[name]=frame[name];delete frame[name];}
  const meshRaw=encodeField(mesh),frameRaw=encodeField(frame);
  const pack=(raw,name)=>({name:name+'.bin.gz',data:Uint8Array.from(gzipSync(raw,{level:9})),decodedBytes:raw.byteLength});
  return {state,key,label,samples:data.validCount,maxSampleT:data.maxSampleT,computeMs:Math.round(data.ms),
    mesh:pack(meshRaw,'projective-mesh-'+digest(meshRaw)),
    // The key includes the engine and projective-atlas versions. Unlike the
    // measured frame.ms field, the filename is deterministic across builds.
    frame:pack(frameRaw,'projective-frame-'+digest(JSON.stringify([CACHE_CODEC_VERSION,key])))};
}

if(!isMainThread){
  parentPort.on('message',task=>{
    try{
      const result=compute(task);
      parentPort.postMessage({result},[result.mesh.data.buffer,result.frame.data.buffer]);
    }catch(error){parentPort.postMessage({error:{message:error.message,stack:error.stack}});}
  });
}else{
  await main();
}

async function main(){
  const args=process.argv.slice(2);
  if(args.includes('--help')){
    console.log('Usage: node scripts/build-projective-precache.mjs [--jobs 1..16] [--out DIR] [--base-only]');
    return;
  }
  const option=name=>{const i=args.indexOf(name);if(i<0)return null;
    if(!args[i+1]||args[i+1].startsWith('--'))throw new Error('Missing value for '+name);return args[i+1];};
  const requestedJobs=option('--jobs'),jobs=requestedJobs===null?Math.min(4,availableParallelism()):Number(requestedJobs);
  if(!Number.isInteger(jobs)||jobs<1||jobs>16)throw new RangeError('--jobs must be an integer from 1 to 16.');
  const outValue=option('--out'),out=outValue===null?path.join(root,'dist/precache'):path.resolve(outValue);
  await mkdir(out,{recursive:true});
  const manifestPath=path.join(out,'manifest.json'),started=performance.now();
  let prior={};
  try{prior=JSON.parse(await readFile(manifestPath,'utf8'));}
  catch(error){if(error.code!=='ENOENT')throw new Error('Cannot safely read existing manifest: '+error.message);}
  if(prior.entries!==undefined&&(!prior.entries||typeof prior.entries!=='object'||Array.isArray(prior.entries)))
    throw new Error('Existing manifest entries are not an object; refusing to replace it.');
  const entries={...(prior.entries??{})},fileInfo=new Map();
  const compatible=prior.version===FIELD_CACHE_VERSION&&prior.codecVersion===CACHE_CODEC_VERSION;
  const tasks=[];
  for(const kind of ['zeta','xi'])for(const geometry of ['sphere','torus'])
    tasks.push(makeTask({function:kind,geometry},`${kind} · projective ${geometry}`));
  if(!args.includes('--base-only'))for(const geometry of ['sphere','torus'])for(const tau of taus)
    tasks.push(makeTask({function:'heat',geometry,tau},`heat ${tau.toFixed(2)} · projective ${geometry}`));
  const pending=[];let reused=0,built=0,writeSequence=0;

  function makeTask(overrides,label){const state={...defaults,...overrides};return {state,key:fieldKey(state),label};}
  function plainState(state){return {...state,ladder:false,packets:false};}
  function filePath(url){
    if(typeof url!=='string'||!/^\.\/precache\/[A-Za-z0-9._-]+$/.test(url))
      throw new Error('Unexpected precache asset URL: '+String(url));
    return path.join(out,path.basename(url));
  }
  async function inspect(url){
    if(fileInfo.has(url))return fileInfo.get(url);
    let info=null;
    try{
      const filename=filePath(url),metadata=await stat(filename);
      if(metadata.isFile()){
        const compressed=await readFile(filename),decoded=gunzipSync(compressed);
        // Sizes come from the actual unique assets, never alias sums or old
        // metadata. gunzip also detects truncated/corrupt interrupted files.
        info={bytes:compressed.byteLength,decodedBytes:decoded.byteLength};
      }
    }catch(error){
      if(error.code!=='ENOENT'&&!['Z_DATA_ERROR','Z_BUF_ERROR'].includes(error.code))throw error;
    }
    fileInfo.set(url,info);return info;
  }
  async function intact(entry){
    if(!entry||entry.compression!=='gzip'||!entry.url||!entry.meshUrl)return false;
    const [frame,mesh]=await Promise.all([inspect(entry.url),inspect(entry.meshUrl)]);
    return !!(frame&&mesh);
  }
  function register(task,entry){
    entries[task.key]={...entry,state:task.state,label:task.label};
    const plain=plainState(task.state);
    entries[fieldKey(plain)]={...entry,state:plain,label:task.label+' · overlays off'};
  }
  async function refreshEntry(entry){
    const frame=await inspect(entry.url),mesh=await inspect(entry.meshUrl);
    return {...entry,bytes:frame.bytes,frameDecodedBytes:frame.decodedBytes,
      meshBytes:mesh.bytes,meshDecodedBytes:mesh.decodedBytes,
      decodedBytes:frame.decodedBytes+mesh.decodedBytes};
  }
  for(const task of tasks){
    const old=entries[task.key];
    let keyMatches=false;
    try{keyMatches=!!old?.state&&fieldKey(old.state)===task.key;}catch{}
    if(compatible&&keyMatches&&await intact(old)){
      register(task,await refreshEntry(old));reused++;
    }else{
      // Only stale entries owned by these requested projective states are
      // removed. Every legacy entry and file is retained unchanged.
      delete entries[task.key];delete entries[fieldKey(plainState(task.state))];
      pending.push(task);
    }
  }

  async function aggregate(){
    const urls=new Set();
    for(const entry of Object.values(entries)){
      if(entry.url)urls.add(entry.url);
      if(entry.meshUrl)urls.add(entry.meshUrl);
    }
    let totalCompressedBytes=0,totalDecodedBytes=0;
    for(const url of urls){
      const info=await inspect(url);
      if(!info)throw new Error('Retained manifest references a missing or corrupt asset: '+url);
      totalCompressedBytes+=info.bytes;totalDecodedBytes+=info.decodedBytes;
    }
    return {uniqueFiles:urls.size,totalCompressedBytes,totalDecodedBytes};
  }
  async function atomicWrite(filename,contents){
    const temporary=filename+`.tmp-${process.pid}-${++writeSequence}`;
    await writeFile(temporary,contents);await rename(temporary,filename);
  }
  async function saveManifest(){
    const sizes=await aggregate();
    const manifest={...prior,version:FIELD_CACHE_VERSION,codecVersion:CACHE_CODEC_VERSION,
      generatedAt:new Date().toISOString(),...sizes,
      projectivePrecache:{...(prior.projectivePrecache??{}),
        atlas:'projective-atlas-v1',resolution:'standard',extent:'extended',chartScale:24,torusR:2,
        bridgeA:.25,geometries:['sphere','torus'],heatRange:{min:-.3,max:.5,step:.05,frames:17}},entries};
    await atomicWrite(manifestPath,JSON.stringify(manifest,null,2)+'\n');
    return sizes;
  }
  async function writeAsset(asset){
    const url='./precache/'+asset.name;
    const existing=await inspect(url);
    if(!existing||existing.decodedBytes!==asset.decodedBytes){
      await atomicWrite(filePath(url),asset.data);
      fileInfo.set(url,{bytes:asset.data.byteLength,decodedBytes:asset.decodedBytes});
    }
    return {url,...fileInfo.get(url)};
  }

  // Verify retained legacy assets before any checkpoint changes its manifest.
  await aggregate();
  console.log(JSON.stringify({projectivePrecache:true,frames:tasks.length,reused,pending:pending.length,
    jobs:Math.min(jobs,pending.length),retainedEntries:Object.keys(entries).length}));
  let next=0,failed=null,commitQueue=Promise.resolve();
  const workers=[];
  function runWorker(worker,task){
    return new Promise((resolve,reject)=>{
      const cleanup=()=>{worker.off('message',message);worker.off('error',error);worker.off('exit',exit);};
      const message=payload=>{cleanup();payload.error?reject(Object.assign(new Error(payload.error.message),{stack:payload.error.stack})):resolve(payload.result);};
      const error=e=>{cleanup();reject(e);};
      const exit=code=>error(new Error('Projective worker exited before completing a frame (code '+code+').'));
      worker.once('message',message);worker.once('error',error);worker.once('exit',exit);
      worker.postMessage(task);
    });
  }
  async function commit(result){
    const mesh=await writeAsset(result.mesh),frame=await writeAsset(result.frame);
    const entry={...frame,compression:'gzip',frameDecodedBytes:frame.decodedBytes,
      decodedBytes:frame.decodedBytes+mesh.decodedBytes,meshUrl:mesh.url,meshBytes:mesh.bytes,
      meshDecodedBytes:mesh.decodedBytes,samples:result.samples,maxSampleT:result.maxSampleT};
    register(result,entry);built++;
    await saveManifest();
    console.log(JSON.stringify({label:result.label,built,total:pending.length,samples:result.samples,
      computeMs:result.computeMs,frameBytes:frame.bytes,meshBytes:mesh.bytes}));
  }
  try{
    await Promise.all(Array.from({length:Math.min(jobs,pending.length)},async()=>{
      const worker=new Worker(new URL(import.meta.url));workers.push(worker);
      while(!failed){
        const task=pending[next++];if(!task)break;
        try{
          const result=await runWorker(worker,task);
          // One ordered commit queue prevents simultaneous manifest writers;
          // workers continue computing independently of the other workers.
          commitQueue=commitQueue.then(()=>commit(result));
          await commitQueue;
        }catch(error){failed??=error;throw error;}
      }
    }));
  }finally{
    await Promise.allSettled(workers.map(worker=>worker.terminate()));
    await commitQueue;
  }
  if(failed)throw failed;
  const sizes=await saveManifest();
  console.log(JSON.stringify({complete:true,built,reused,entries:Object.keys(entries).length,...sizes,
    compressedMegabytes:sizes.totalCompressedBytes/1e6,decodedMegabytes:sizes.totalDecodedBytes/1e6,
    elapsedSeconds:(performance.now()-started)/1000}));
}
