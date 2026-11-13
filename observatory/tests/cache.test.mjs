import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FieldCache,fieldKey,estimateBytes,FIELD_CACHE_VERSION} from '../dist/field-cache.js';
const state=n=>({geometry:'plane',function:'zeta',sigmaMin:-2,sigmaMax:3,tMin:n,tMax:n+10,resolution:'standard',extent:'extended'});
const frame=(value=1)=>({nx:2,ny:2,values:new Float64Array([value,NaN,Infinity,-Infinity,-0,2,3,4]),valid:new Uint8Array([1,0,1,1]),arg:new Float64Array([0,Math.PI]),criticalSamples:[[{computed:true,polar:{logAbs:-Infinity,arg:0},t:Infinity}]],slice:{vals:new Float64Array([value,NaN])},precomputedPolars:{probe:{valid:true,logAbs:-1800,arg:.2}}});
class MemoryStore{
 constructor(){this.records=new Map();this.beforeSet=null;this.beforeGet=null;this.failSet=null;this.failList=null;}
 async list(){if(this.failList)throw this.failList;return [...this.records.values()].map(({data,...m})=>structuredClone(m));}
 async get(key){if(this.beforeGet)await this.beforeGet();return this.records.has(key)?structuredClone(this.records.get(key)):null;}
 async set(record){if(this.beforeSet)await this.beforeSet();if(this.failSet)throw this.failSet;this.records.set(record.key,structuredClone(record));}
 async touch(key,lastUsed){if(this.records.has(key))this.records.get(key).lastUsed=lastUsed;}
 async delete(key){this.records.delete(key);}
 async deleteMany(keys){for(const k of keys)this.records.delete(k);}
 async clear(){this.records.clear();}
}
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}

test('field keys include every active math input and exclude styles or irrelevant tau',()=>{
 const a={...state(8),tau:.25,colorMode:'phase',height:1,critical:true,zeros:true};
 const b={...a,tau:-.3,colorMode:'real',height:2,phaseOffset:1,opacity:.4,camera:{x:1},autoRotate:true,critical:false,zeros:false,chartScale:72,torusR:3,bridgeA:1};
 assert.equal(fieldKey(a),fieldKey(b));
 for(const patch of [{function:'xi'},{geometry:'sphere'},{extent:'core'},{resolution:'high'},{tMax:19},{sigmaMin:-1},{vortices:true},{colorMode:'bridge'},{ladder:true}])assert.notEqual(fieldKey(a),fieldKey({...a,...patch}));
 assert.equal(fieldKey({...a,ladder:true}),fieldKey({...a,packets:true}));
 assert.notEqual(fieldKey({...a,ladder:true,bridgeA:.2}),fieldKey({...a,ladder:true,bridgeA:.3}));
 assert.equal(fieldKey({...a,geometry:'sphere',torusR:1.2,tMin:0}),fieldKey({...a,geometry:'sphere',torusR:3,tMin:100}));
 assert.notEqual(fieldKey({...a,geometry:'sphere',chartScale:24}),fieldKey({...a,geometry:'sphere',chartScale:25}));
 assert.notEqual(fieldKey({...a,geometry:'torus',torusR:1.5}),fieldKey({...a,geometry:'torus',torusR:1.6}));
 assert.notEqual(fieldKey({...a,function:'heat',tau:.3}),fieldKey({...a,function:'heat',tau:.1+.2}));
 assert.equal(fieldKey({...a,function:'heat',tau:-0}),fieldKey({...a,function:'heat',tau:0}));
 assert.equal(JSON.parse(fieldKey(a))[0],FIELD_CACHE_VERSION);
 assert.throws(()=>fieldKey({...a,tMin:NaN}),TypeError);
});
test('byte estimates count real typed buffers once, including shared views and cycles',()=>{
 const buffer=new ArrayBuffer(1024),a=new Float64Array(buffer),b=new Uint8Array(buffer);assert.ok(estimateBytes(a)>=1024);
 assert.ok(estimateBytes([a,b])<estimateBytes(a)+estimateBytes(b));assert.equal(estimateBytes(a.subarray(0,2)),estimateBytes(a));
 const cyclic={a};cyclic.self=cyclic;assert.ok(Number.isFinite(estimateBytes(cyclic)));
});
test('memory LRU respects byte budget, takes a snapshot, and never detaches source buffers',async()=>{
 const f=frame(10),bytes=estimateBytes(f),cache=new FieldCache({memoryBudgetBytes:2*bytes,storageBudgetBytes:0,persistentStore:null});
 await cache.set(state(1),f);assert.ok(f.values.buffer.byteLength>0);f.values[0]=99;
 await cache.set(state(2),frame(20));const hit=await cache.get(state(1));assert.equal(hit.source,'memory');assert.equal(hit.data.values[0],10);
 await cache.set(state(3),frame(30));assert.equal(await cache.get(state(2)),null);assert.equal((await cache.get(state(1))).data.values[0],10);
 assert.equal(cache.stats().memoryEntries,2);assert.ok(cache.stats().memoryBytes<=2*bytes);assert.equal(cache.stats().evictions.memory,1);
});
test('persistent snapshots preserve types, nonfinite values, and optional records across instances',async()=>{
 const store=new MemoryStore(),f=frame(7),cache=new FieldCache({persistentStore:store});const r=await cache.set(state(1),f);assert.equal(r.persisted,true);
 const next=new FieldCache({persistentStore:store}),hit=await next.get(state(1));assert.equal(hit.source,'disk');assert.ok(hit.data.values instanceof Float64Array);assert.ok(hit.data.valid instanceof Uint8Array);
 assert.equal(hit.data.values[0],7);assert.ok(Number.isNaN(hit.data.values[1]));assert.equal(hit.data.values[2],Infinity);assert.equal(hit.data.values[3],-Infinity);assert.ok(Object.is(hit.data.values[4],-0));
 assert.equal(hit.data.criticalSamples[0][0].t,Infinity);assert.equal(hit.data.criticalSamples[0][0].polar.logAbs,-Infinity);assert.ok(hit.data.slice.vals instanceof Float64Array);assert.equal(hit.data.precomputedPolars.probe.logAbs,-1800);
 assert.equal((await next.get(state(1))).source,'memory');
});
test('disk LRU uses actual retained bytes and recently accessed records survive eviction',async()=>{
 const store=new MemoryStore(),bytes=estimateBytes(frame()),cache=new FieldCache({memoryBudgetBytes:0,storageBudgetBytes:2*bytes,persistentStore:store,now:(()=>{let t=0;return()=>++t;})()});
 await cache.set(state(1),frame(1));await cache.set(state(2),frame(2));assert.equal((await cache.get(state(1))).source,'disk');await cache.set(state(3),frame(3));
 assert.equal(await cache.get(state(2)),null);assert.equal((await cache.get(state(1))).data.values[0],1);assert.equal(store.records.size,2);assert.ok(cache.stats().storageBytes<=2*bytes);
});
test('quota and unavailable storage degrade to working memory without throwing',async()=>{
 const store=new MemoryStore();store.failSet=Object.assign(new Error('full'),{name:'QuotaExceededError'});const events=[];
 const cache=new FieldCache({persistentStore:store,onStatus:x=>events.push(x.type)}),result=await cache.set(state(1),frame(9));
 assert.equal(result.memory,true);assert.equal(result.persisted,false);assert.equal(cache.stats().storageWritable,false);assert.equal((await cache.get(state(1))).data.values[0],9);assert.ok(events.includes('storage-fallback'));
 const denied=new MemoryStore();denied.failList=new Error('denied');const fallback=new FieldCache({persistentStore:denied,onStatus(){throw new Error('bad UI');}});await fallback.set(state(1),frame(4));assert.equal((await fallback.get(state(1))).source,'memory');assert.equal(fallback.stats().storageAvailable,false);
});
test('browser quota estimate can reduce the persistent budget before writes',async()=>{
 const bytes=estimateBytes(frame()),store=new MemoryStore(),cache=new FieldCache({memoryBudgetBytes:0,storageBudgetBytes:bytes*10,persistentStore:store,estimateStorage:async()=>({quota:bytes*4,usage:bytes*2})});
 await cache.set(state(1),frame());await cache.set(state(2),frame());assert.equal(cache.stats().storageBudgetBytes,bytes);assert.equal(store.records.size,1);
});
test('clear waits out old pending writes and their epoch cannot repopulate either cache',async()=>{
 const store=new MemoryStore(),started=deferred(),release=deferred();store.beforeSet=async()=>{started.resolve();await release.promise;};
 const cache=new FieldCache({persistentStore:store}),pending=cache.set(state(1),frame(1));await started.promise;const cleared=cache.clear();release.resolve();
 const [writeResult,clearResult]=await Promise.all([pending,cleared]);assert.equal(writeResult.cleared,true);assert.equal(clearResult,true);assert.equal(store.records.size,0);assert.equal(cache.stats().memoryEntries,0);assert.equal(await cache.get(state(1)),null);
 store.beforeSet=null;await cache.set(state(2),frame(2));assert.equal((await cache.get(state(2))).data.values[0],2);
});
test('a disk read that completes after clear cannot promote an obsolete frame',async()=>{
 const store=new MemoryStore(),writer=new FieldCache({persistentStore:store});await writer.set(state(1),frame());
 const cache=new FieldCache({persistentStore:store,memoryBudgetBytes:0});await cache.get(state(9));const started=deferred(),release=deferred();store.beforeGet=async()=>{started.resolve();await release.promise;};
 const reading=cache.get(state(1));await started.promise;const clearing=cache.clear();release.resolve();await clearing;assert.equal(await reading,null);assert.equal(cache.stats().memoryEntries,0);
});
test('old engine versions are invalidated rather than reused or allowed to consume budget',async()=>{
 const store=new MemoryStore(),parts=JSON.parse(fieldKey(state(1)));parts[0]='zeta-observatory-field-old';const key=JSON.stringify(parts);await store.set({key,data:frame(100),bytes:estimateBytes(frame()),createdAt:1,lastUsed:1});
 const cache=new FieldCache({persistentStore:store});assert.equal(await cache.get(state(1)),null);assert.equal(store.records.size,0);
});
