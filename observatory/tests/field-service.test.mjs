import test from 'node:test';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {FieldService} from '../dist/field-service.js';
import {FIELD_CACHE_VERSION,fieldKey} from '../dist/field-cache.js';
import {encodeField} from '../dist/cache-codec.js';

const state=(tau=0)=>({geometry:'torus',function:'heat',tau,extent:'extended',resolution:'draft',chartScale:24,torusR:1.6,colorMode:'phase'});
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}
function memoryCache(){
  const values=new Map(),writes=[];
  return {values,writes,async get(s){return values.get(fieldKey(s))||null;},async set(s,data){writes.push(fieldKey(s));values.set(fieldKey(s),{data,source:'memory'});},async clear(){values.clear();return true;},stats(){return {memoryEntries:values.size};}};
}
function pieces(offset=0){
  const mesh={nx:1,ny:1,basePositions:new Float32Array([0,0,0,1,0,0,0,0,1,1,0,1]),normals:new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]),uvs:new Float64Array([0,0,1,0,0,1,1,1])};
  const frame={valid:new Uint8Array([1,1,0,1]),logAbs:new Float64Array([offset,1+offset,NaN,-Infinity]),arg:new Float64Array([0,.8,NaN,0]),values:new Float64Array([1,0,2,3,NaN,NaN,-0,0]),
    slice:{lo:0,hi:1,vals:new Float64Array([-0,NaN,Infinity,1]),scaleLog:-Infinity},
    criticalSamples:[[{q:0,u:0,v:.25,position:[0,0,0],normal:[0,1,0],sigma:.5,t:Infinity,valid:false,puncture:true,polar:null,computed:false}]],landmarkValues:[],zeroPoints:[],ladderLines:[],flowLines:[]};
  return {mesh,frame,data:{...mesh,...frame}};
}
function bytesEqual(a,b){assert.equal(a.constructor,b.constructor);assert.deepEqual(new Uint8Array(a.buffer,a.byteOffset,a.byteLength),new Uint8Array(b.buffer,b.byteOffset,b.byteLength));}
function noWorker(){throw Error('A worker must not be started');}
function finishedWorker(data,instances){return ()=>{const w={terminated:0,posted:[],terminate(){this.terminated++;},postMessage(message){this.posted.push(message);queueMicrotask(()=>this.onmessage({data:{type:'complete',data}}));}};instances.push(w);return w;};}

 test('memory hit bypasses manifest, shipped fetch, and numerical worker',async()=>{
  const cache=memoryCache(),data=pieces().data;cache.values.set(fieldKey(state()),{data,source:'memory'});
  let fetches=0;const service=new FieldService({cache,fetcher:async()=>{fetches++;throw Error('unexpected network');},workerFactory:noWorker});
  const hit=await service.get(state());assert.equal(hit.data,data);assert.equal(hit.source,'memory');assert.equal(fetches,0);assert.equal(service.stats().workerJobs,0);assert.equal(service.stats().cacheHits,1);
 });

 test('gzip split mesh and frames decode losslessly and reuse the shared mesh',async()=>{
  const cache=memoryCache(),a=pieces(),b=pieces(.25),calls=[];
  const manifest={version:FIELD_CACHE_VERSION,entries:{[fieldKey(state())]:{meshUrl:'./precache/test-mesh.gz',url:'./precache/test-a.gz'},[fieldKey(state(.25))]:{meshUrl:'./precache/test-mesh.gz',url:'./precache/test-b.gz'}}};
  const assets=new Map([['test-mesh.gz',gzipSync(encodeField(a.mesh))],['test-a.gz',gzipSync(encodeField(a.frame))],['test-b.gz',gzipSync(encodeField(b.frame))]]);
  const fetcher=async url=>{const name=new URL(url).pathname.split('/').at(-1);calls.push(name);return name==='manifest.json'?Response.json(manifest):new Response(assets.get(name)||null,{status:assets.has(name)?200:404});};
  const service=new FieldService({cache,fetcher,workerFactory:noWorker});
  const first=await service.get(state()),second=await service.get(state(.25));
  assert.equal(first.source,'precomputed');assert.equal(second.source,'precomputed');
  bytesEqual(first.data.basePositions,a.mesh.basePositions);bytesEqual(first.data.logAbs,a.frame.logAbs);bytesEqual(first.data.values,a.frame.values);bytesEqual(first.data.slice.vals,a.frame.slice.vals);bytesEqual(second.data.logAbs,b.frame.logAbs);
  assert.equal(first.data.criticalSamples[0][0].t,Infinity);assert.equal(first.data.slice.scaleLog,-Infinity);
  assert.equal(first.data.basePositions,second.data.basePositions,'Shared decoded mesh is reused across frames');
  assert.equal(calls.filter(x=>x==='manifest.json').length,1);assert.equal(calls.filter(x=>x==='test-mesh.gz').length,1);assert.equal(service.stats().workerJobs,0);assert.equal(service.stats().precomputedLoads,2);
  const hit=await service.get(state());assert.equal(hit.source,'memory');assert.equal(calls.length,4);
 });

 test('missing shipped frame falls back to one worker and caches its actual result',async()=>{
  const cache=memoryCache(),data=pieces().data,workers=[];
  const manifest={version:FIELD_CACHE_VERSION,entries:{[fieldKey(state())]:{url:'./precache/missing.gz'}}};
  const service=new FieldService({cache,fetcher:async url=>String(url).endsWith('manifest.json')?Response.json(manifest):new Response(null,{status:404}),workerFactory:finishedWorker(data,workers)});
  const result=await service.get(state());assert.equal(result.source,'computed');assert.equal(result.data,data);assert.equal(workers.length,1);assert.equal(workers[0].terminated,1);assert.deepEqual(workers[0].posted[0].state,state());assert.equal(cache.writes.length,1);assert.equal(service.stats().workerJobs,1);
 });

 test('allowCompute:false never creates a worker on a missing or damaged pack',async()=>{
  for(const shipped of [false,true]){
    const cache=memoryCache();let workerCalls=0;
    const manifest={version:FIELD_CACHE_VERSION,entries:shipped?{[fieldKey(state())]:{url:'./precache/damaged.gz'}}:{}};
    const service=new FieldService({cache,fetcher:async url=>String(url).endsWith('manifest.json')?Response.json(manifest):new Response('bad bytes'),workerFactory:()=>{workerCalls++;return {};}});
    assert.equal(await service.get(state(),{allowCompute:false}),null);assert.equal(workerCalls,0);assert.equal(cache.writes.length,0);assert.equal(service.stats().workerJobs,0);
  }
 });

 test('aborting an active worker prevents stale cache writes and terminates it',async()=>{
  const cache=memoryCache(),started=deferred(),controller=new AbortController();let worker;
  const service=new FieldService({cache,fetcher:async()=>new Response(null,{status:404}),workerFactory:()=>worker={terminated:0,postMessage(){started.resolve();},terminate(){this.terminated++;}}});
  const pending=service.get(state(),{signal:controller.signal});await started.promise;controller.abort();
  await assert.rejects(pending,{name:'AbortError'});assert.equal(worker.terminated,1);
  worker.onmessage({data:{type:'complete',data:pieces().data}});await Promise.resolve();
  assert.equal(cache.writes.length,0);assert.equal(cache.values.size,0);assert.equal(service.controllers.size,0);
 });

 test('clear invalidates a just-completed worker before its result can be cached',async()=>{
  const cache=memoryCache(),started=deferred();let worker;
  const service=new FieldService({cache,fetcher:async()=>new Response(null,{status:404}),workerFactory:()=>worker={postMessage(){started.resolve();},terminate(){}}});
  const pending=service.get(state());await started.promise;
  worker.onmessage({data:{type:'complete',data:pieces().data}});
  await service.clear();await assert.rejects(pending,{name:'AbortError'});
  assert.equal(cache.writes.length,0);assert.equal(cache.values.size,0);assert.equal(service.controllers.size,0);
 });

 test('clear invalidates an in-flight cache read instead of returning stale data',async()=>{
  const read=deferred(),cache=memoryCache();cache.get=()=>read.promise;
  const service=new FieldService({cache,fetcher:async()=>{throw Error('unexpected fetch');},workerFactory:noWorker});
  const pending=service.get(state());await service.clear();read.resolve({data:pieces().data,source:'memory'});
  await assert.rejects(pending,{name:'AbortError'});assert.equal(cache.writes.length,0);assert.equal(service.stats().workerJobs,0);
 });

 test('aborting a shipped download cannot trigger fallback computation or cache a late response',async()=>{
  const cache=memoryCache(),download=deferred(),started=deferred(),controller=new AbortController();
  const manifest={version:FIELD_CACHE_VERSION,entries:{[fieldKey(state())]:{url:'./precache/slow.gz'}}};
  const service=new FieldService({cache,fetcher:async url=>{if(String(url).endsWith('manifest.json'))return Response.json(manifest);started.resolve();return download.promise;},workerFactory:noWorker});
  const pending=service.get(state(),{signal:controller.signal});await started.promise;controller.abort();download.resolve(new Response(gzipSync(encodeField(pieces().data))));
  await assert.rejects(pending,{name:'AbortError'});assert.equal(cache.writes.length,0);assert.equal(service.stats().workerJobs,0);
 });
