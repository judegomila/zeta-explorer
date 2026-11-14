/**
 * Bounded exact-field cache. Values are immutable by consumer contract.
 * set() takes an owned structured clone, without transferring/detaching buffers;
 * memory hits return that same read-only snapshot for fast mode/clip switching.
 * IndexedDB performs its own lossless structured clone (NaN, infinity, typed
 * arrays, nested critical samples, and optional precomputed records survive).
 *
 * Increment FIELD_CACHE_VERSION after any numerical engine, geometry, sampler,
 * or output-contract change that could change a computed field.
 */
export const FIELD_CACHE_VERSION = 'zeta-observatory-field-v3-20261110-logpolar2000';
const MiB = 1024 * 1024;
const DEFAULTS = Object.freeze({geometry:'plane',function:'zeta',extent:'extended',resolution:'standard',tau:0,sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,chartScale:24,torusR:1.6,bridgeA:.25});
function number(state,key){const v=state[key]??DEFAULTS[key];if(typeof v!=='number'||!Number.isFinite(v))throw new TypeError(`Invalid numerical cache input: ${key}`);return Object.is(v,-0)?0:v;}
/** Exact inputs used by the numerical sampler, deliberately excluding styles. */
export function fieldKey(state = {}) {
  const geometry=state.geometry??DEFAULTS.geometry,kind=state.function??DEFAULTS.function;
  const extent=state.extent??DEFAULTS.extent,resolution=state.resolution??DEFAULTS.resolution;
  const quotient=geometry==='klein'||geometry==='annulus';
  if(!['plane','sphere','torus','klein','annulus'].includes(geometry)||!['zeta','xi','heat'].includes(kind)||!['core','extended'].includes(extent)||!['draft','standard','high','ultra'].includes(resolution))throw new TypeError('Unknown numerical cache mode');
  if(quotient&&kind==='zeta')throw new TypeError('Real quotients require the completed xi or heat field.');
  const bridge=state.colorMode==='bridge',flow=!!state.vortices,ladder=!!(state.ladder||state.packets);
  const chart=geometry==='plane'?[number(state,'sigmaMin'),number(state,'sigmaMax'),number(state,'tMin'),number(state,'tMax')]:[number(state,'chartScale'),geometry==='torus'||quotient?number(state,'torusR'):null];
  const key=[FIELD_CACHE_VERSION,geometry,kind,kind==='heat'?number(state,'tau'):null,extent,resolution,chart,bridge,flow,ladder,bridge||ladder?number(state,'bridgeA'):null];
  // Keep every shipped legacy key unchanged. The new atlas changes sphere
  // coordinates and curved-surface landmarks, so it owns a separate namespace.
  // Inspector channels and derivative scale do not change a sampled field.
  if(state.projective&&geometry!=='plane')key.push(['projective-atlas-v1',number(state,'torusR')]);
  if(quotient)key.push(['real-quotient-v1',geometry]);
  // The derivative color owns a distinct payload without invalidating the
  // unchanged, precomputed phase/bridge fields. bridge[] holds tanh Re(F′/F).
  if(state.colorMode==='shear')key.push(['log-shear-v1']);
  return JSON.stringify(key);
}
function currentKey(key){try{return JSON.parse(key)?.[0]===FIELD_CACHE_VERSION;}catch{return false;}}
function keyFor(state){if(typeof state!=='string')return fieldKey(state);if(!currentKey(state))throw new TypeError('Cache key belongs to another engine version');return state;}
/** Conservative retained-memory estimate; shared backing buffers count once. */
export function estimateBytes(value) {
  let bytes=0;const seen=new WeakSet(),buffers=new WeakSet(),stack=[value];
  while(stack.length){const v=stack.pop();if(v==null){bytes+=4;continue;}
    switch(typeof v){case 'number':bytes+=8;continue;case 'boolean':bytes+=4;continue;case 'string':bytes+=2*v.length;continue;case 'undefined':bytes+=4;continue;case 'bigint':bytes+=16;continue;case 'symbol':case 'function':throw new TypeError('Computed frames must contain structured-cloneable data');}
    if(seen.has(v))continue;seen.add(v);
    if(ArrayBuffer.isView(v)){bytes+=32;if(!buffers.has(v.buffer)){buffers.add(v.buffer);bytes+=v.buffer.byteLength;}continue;}
    if(v instanceof ArrayBuffer||(typeof SharedArrayBuffer!=='undefined'&&v instanceof SharedArrayBuffer)){if(!buffers.has(v)){buffers.add(v);bytes+=v.byteLength;}continue;}
    if(v instanceof Date){bytes+=16;continue;}
    if(v instanceof Map){bytes+=48;for(const [k,x] of v){bytes+=16;stack.push(k,x);}continue;}
    if(v instanceof Set){bytes+=32;for(const x of v){bytes+=8;stack.push(x);}continue;}
    if(Array.isArray(v)){bytes+=24+8*v.length;for(const x of v)stack.push(x);continue;}
    bytes+=32;for(const [k,x] of Object.entries(v)){bytes+=2*k.length+8;stack.push(x);}
  }
  return bytes;
}
function cloneFrame(data){
  if(typeof structuredClone==='function')return structuredClone(data);
  // Lossless fallback for older runtimes; JSON must never be used for frames.
  const seen=new Map();
  const copy=v=>{
    if(v===null||typeof v!=='object'){if(typeof v==='function'||typeof v==='symbol')throw new TypeError('Uncloneable frame');return v;}
    if(seen.has(v))return seen.get(v);
    if(v instanceof ArrayBuffer){const r=v.slice(0);seen.set(v,r);return r;}
    if(ArrayBuffer.isView(v)){const b=copy(v.buffer),r=v instanceof DataView?new DataView(b,v.byteOffset,v.byteLength):new v.constructor(b,v.byteOffset,v.length);seen.set(v,r);return r;}
    if(v instanceof Date)return new Date(v.getTime());
    if(v instanceof Map){const r=new Map();seen.set(v,r);for(const [k,x]of v)r.set(copy(k),copy(x));return r;}
    if(v instanceof Set){const r=new Set();seen.set(v,r);for(const x of v)r.add(copy(x));return r;}
    const r=Array.isArray(v)?[]:{};seen.set(v,r);for(const [k,x]of Object.entries(v))r[k]=copy(x);return r;
  };return copy(data);
}
const quotaError=e=>e?.name==='QuotaExceededError'||e?.code===22||e?.code===1014;
function transaction(db,names,mode,work){return new Promise((resolve,reject)=>{
  let tx;try{tx=db.transaction(names,mode);}catch(e){reject(e);return;}
  let result;tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error||new Error('IndexedDB transaction failed'));tx.onabort=()=>reject(tx.error||new Error('IndexedDB transaction aborted'));
  try{work(tx,v=>{result=v;});}catch(e){try{tx.abort();}catch{}reject(e);}
});}
/** Native persistent adapter. Tests may inject the same six-method contract. */
export class IndexedDBFieldStore {
  constructor({indexedDB=globalThis.indexedDB,name='zeta-observatory-computed-fields',openTimeoutMs=3000}={}){
    this.openPromise=new Promise((resolve,reject)=>{
      if(!indexedDB){reject(new Error('IndexedDB is unavailable'));return;}
      let done=false,request;const timer=setTimeout(()=>finish(new Error('IndexedDB opening timed out')),openTimeoutMs);
      function finish(error,db){if(done){db?.close();return;}done=true;clearTimeout(timer);error?reject(error):resolve(db);}
      try{request=indexedDB.open(name,1);}catch(e){finish(e);return;}
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('frames'))db.createObjectStore('frames',{keyPath:'key'});if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta',{keyPath:'key'});};
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();finish(null,db);};
      request.onerror=()=>finish(request.error||new Error('IndexedDB could not open'));request.onblocked=()=>finish(new Error('IndexedDB upgrade was blocked'));
    });
    // A constructor used before its first operation must not cause an unhandled rejection.
    this.openPromise.catch(()=>{});
  }
  async get(key){const db=await this.openPromise;return transaction(db,['frames'],'readonly',(tx,set)=>{const q=tx.objectStore('frames').get(key);q.onsuccess=()=>set(q.result??null);});}
  async list(){const db=await this.openPromise;return transaction(db,['meta'],'readonly',(tx,set)=>{const q=tx.objectStore('meta').getAll();q.onsuccess=()=>set(q.result||[]);});}
  async set(record){const db=await this.openPromise;return transaction(db,['frames','meta'],'readwrite',tx=>{tx.objectStore('frames').put(record);const {data,...meta}=record;tx.objectStore('meta').put(meta);});}
  async touch(key,lastUsed){const db=await this.openPromise;return transaction(db,['meta'],'readwrite',tx=>{const store=tx.objectStore('meta'),q=store.get(key);q.onsuccess=()=>{if(q.result)store.put({...q.result,lastUsed});};});}
  async delete(key){return this.deleteMany([key]);}
  async deleteMany(keys){const db=await this.openPromise;return transaction(db,['frames','meta'],'readwrite',tx=>{for(const key of keys){tx.objectStore('frames').delete(key);tx.objectStore('meta').delete(key);}});}
  async clear(){const db=await this.openPromise;return transaction(db,['frames','meta'],'readwrite',tx=>{tx.objectStore('frames').clear();tx.objectStore('meta').clear();});}
}
/**
 * persistentStore injection contract: async get(key), set(record), list()
 * (metadata only), delete(key), clear(), and optional touch/deleteMany.
 * Pass null for a memory-only cache, e.g. a private browser fallback.
 */
export class FieldCache {
  constructor({memoryBudgetBytes=128*MiB,storageBudgetBytes=256*MiB,onStatus=()=>{},persistentStore,estimateStorage,now=()=>Date.now()}={}){
    this.memoryBudgetBytes=Math.max(0,Number(memoryBudgetBytes)||0);this.storageBudgetBytes=Math.max(0,Number(storageBudgetBytes)||0);
    this._configuredStorageBudget=this.storageBudgetBytes;this._onStatus=onStatus;this._now=now;
    this._memory=new Map();this._memoryBytes=0;this._diskMeta=new Map();this._storageBytes=0;this._epoch=0;
    this._hits={memory:0,disk:0};this._misses=0;this._evictions={memory:0,disk:0};this._errors=0;this._pendingWrites=0;
    this._queue=Promise.resolve();this._clearBarrier=Promise.resolve();this._storageAvailable=false;this._storageWritable=false;this._storageStatus='opening';
    this._store=persistentStore===undefined?(this.storageBudgetBytes>0&&globalThis.indexedDB?new IndexedDBFieldStore():null):persistentStore;
    this._estimateStorage=estimateStorage??(globalThis.navigator?.storage?.estimate?()=>globalThis.navigator.storage.estimate():null);
    this._ready=this._initialize();
  }
  _emit(type,detail={}){try{this._onStatus({type,...detail,stats:this.stats()});}catch{/* A UI status callback must never break the cache. */}}
  _fail(error,{disable=false}={}){this._errors++;if(disable){this._storageAvailable=false;this._storageWritable=false;}this._storageStatus=quotaError(error)?'quota-limited':'unavailable';this._emit('storage-fallback',{message:quotaError(error)?'Storage is full; computed fields remain available in memory.':'Persistent caching is unavailable; using memory.',errorName:error?.name||'Error'});}
  _loadMeta(records){this._diskMeta.clear();this._storageBytes=0;for(const r of records??[])if(r&&currentKey(r.key)&&Number.isFinite(r.bytes)&&r.bytes>=0){const meta={key:r.key,bytes:r.bytes,createdAt:Number(r.createdAt)||0,lastUsed:Number(r.lastUsed)||0};this._diskMeta.set(r.key,meta);this._storageBytes+=meta.bytes;}}
  async _initialize(){
    if(!this._store||this.storageBudgetBytes<=0){this._storageStatus='memory-only';this._emit('ready');return;}
    try{
      const records=await this._store.list();this._loadMeta(records);
      // This database is exclusively owned by this cache. Old numerical versions
      // must not consume the new version's persistent budget.
      const stale=(records??[]).filter(r=>r?.key&&!currentKey(r.key)).map(r=>r.key);
      if(stale.length){if(this._store.deleteMany)await this._store.deleteMany(stale);else for(const key of stale)await this._store.delete(key);}
      if(this._estimateStorage){try{const q=await this._estimateStorage();if(Number.isFinite(q?.quota)&&q.quota>0){const spare=Math.max(0,q.quota-(Number(q.usage)||0));this.storageBudgetBytes=Math.floor(Math.min(this._configuredStorageBudget,q.quota*.25,this._storageBytes+spare*.5));}}catch{/* Quota estimates are optional. */}}
      this._storageAvailable=true;this._storageWritable=this.storageBudgetBytes>0;this._storageStatus='ready';
      await this._trimDisk(0);this._emit('ready');
    }catch(e){this._fail(e,{disable:true});}
  }
  _enqueue(work){const next=this._queue.catch(()=>{}).then(work);this._queue=next.catch(()=>{});return next;}
  _remember(key,data,bytes){
    const old=this._memory.get(key);if(old){this._memoryBytes-=old.bytes;this._memory.delete(key);}
    if(bytes>this.memoryBudgetBytes||this.memoryBudgetBytes===0)return false;
    while(this._memoryBytes+bytes>this.memoryBudgetBytes&&this._memory.size){const k=this._memory.keys().next().value,e=this._memory.get(k);this._memory.delete(k);this._memoryBytes-=e.bytes;this._evictions.memory++;}
    this._memory.set(key,{data,bytes});this._memoryBytes+=bytes;return true;
  }
  async _deleteDisk(keys){
    if(!keys.length)return;
    if(this._store.deleteMany)await this._store.deleteMany(keys);else for(const key of keys)await this._store.delete(key);
    for(const key of keys){const old=this._diskMeta.get(key);if(old){this._storageBytes-=old.bytes;this._diskMeta.delete(key);this._evictions.disk++;}}
  }
  async _trimDisk(extraBytes,exceptKey){
    let projected=this._storageBytes-(this._diskMeta.get(exceptKey)?.bytes||0)+extraBytes;const keys=[];
    for(const item of [...this._diskMeta.values()].filter(r=>r.key!==exceptKey).sort((a,b)=>a.lastUsed-b.lastUsed||a.createdAt-b.createdAt||a.key.localeCompare(b.key))){if(projected<=this.storageBudgetBytes)break;keys.push(item.key);projected-=item.bytes;}
    await this._deleteDisk(keys);
  }
  async get(state){
    let key;try{key=keyFor(state);}catch{return null;}
    const epoch=this._epoch,hit=this._memory.get(key);
    if(hit){this._memory.delete(key);this._memory.set(key,hit);this._hits.memory++;this._touch(key,epoch);return {data:hit.data,source:'memory'};}
    await this._ready;await this._clearBarrier;if(epoch!==this._epoch)return null;
    if(!this._storageAvailable){this._misses++;return null;}
    try{
      const record=await this._store.get(key);if(epoch!==this._epoch)return null;
      if(!record?.data){this._misses++;return null;}
      const bytes=Number.isFinite(record.bytes)?record.bytes:estimateBytes(record.data),lastUsed=this._now();
      const old=this._diskMeta.get(key);this._storageBytes+=bytes-(old?.bytes||0);this._diskMeta.set(key,{key,bytes,createdAt:record.createdAt||lastUsed,lastUsed});
      this._remember(key,record.data,bytes);this._hits.disk++;this._touch(key,epoch);return {data:record.data,source:'disk'};
    }catch(e){this._fail(e,{disable:true});this._misses++;return null;}
  }
  _touch(key,epoch){
    const meta=this._diskMeta.get(key);if(!meta||!this._storageAvailable||!this._store.touch)return;
    const lastUsed=this._now();meta.lastUsed=lastUsed;
    this._enqueue(async()=>{if(epoch!==this._epoch||!this._storageAvailable)return;try{await this._store.touch(key,lastUsed);}catch(e){this._fail(e,{disable:true});}});
  }
  async set(state,data){
    let key,snapshot,bytes;const epoch=this._epoch;
    try{key=keyFor(state);snapshot=cloneFrame(data);bytes=estimateBytes(snapshot);}catch(e){this._emit('cache-skipped',{message:'The computed frame could not be cached.',errorName:e?.name||'Error'});return {memory:false,persisted:false,bytes:0};}
    // Clone without a transfer list: the renderer and the worker's returned
    // buffers keep their ownership and cannot be detached by this cache.
    const memory=this._remember(key,snapshot,bytes);this._pendingWrites++;
    try{return await this._enqueue(async()=>{
      await this._ready;if(epoch!==this._epoch)return {key,memory:false,persisted:false,bytes,cleared:true};
      if(!this._storageAvailable||!this._storageWritable||bytes>this.storageBudgetBytes)return {key,memory,persisted:false,bytes};
      const time=this._now(),record={key,data:snapshot,bytes,createdAt:this._diskMeta.get(key)?.createdAt||time,lastUsed:time};
      try{
        // Reconcile metadata so other tabs' completed writes participate in LRU.
        this._loadMeta(await this._store.list());if(epoch!==this._epoch)return {key,memory:false,persisted:false,bytes,cleared:true};
        await this._trimDisk(bytes,key);if(epoch!==this._epoch)return {key,memory:false,persisted:false,bytes,cleared:true};
        try{await this._store.set(record);}catch(e){
          if(!quotaError(e))throw e;
          const victims=[...this._diskMeta.values()].filter(r=>r.key!==key).sort((a,b)=>a.lastUsed-b.lastUsed);let freed=0;const keys=[];
          for(const item of victims){keys.push(item.key);freed+=item.bytes;if(freed>=Math.max(bytes,this._storageBytes*.25))break;}
          if(!keys.length)throw e;await this._deleteDisk(keys);if(epoch!==this._epoch)return {key,memory:false,persisted:false,bytes,cleared:true};await this._store.set(record);
        }
        if(epoch!==this._epoch)return {key,memory:false,persisted:false,bytes,cleared:true};
        const old=this._diskMeta.get(key);this._storageBytes+=bytes-(old?.bytes||0);const {data:unused,...meta}=record;this._diskMeta.set(key,meta);this._storageStatus='ready';this._emit('stored',{bytes});return {key,memory,persisted:true,bytes};
      }catch(e){if(quotaError(e)){this._storageWritable=false;this._fail(e);}else this._fail(e,{disable:true});return {key,memory,persisted:false,bytes};}
    });}finally{this._pendingWrites--;}
  }
  async clear(){
    ++this._epoch;this._memory.clear();this._memoryBytes=0;
    const action=this._enqueue(async()=>{await this._ready;try{if(this._store)await this._store.clear();this._diskMeta.clear();this._storageBytes=0;if(this._store){this._storageAvailable=true;this._storageWritable=this.storageBudgetBytes>0;this._storageStatus='ready';}this._emit('cleared');return true;}catch(e){this._fail(e,{disable:true});return false;}});
    this._clearBarrier=action.catch(()=>false);return action;
  }
  stats(){return {version:FIELD_CACHE_VERSION,memoryEntries:this._memory.size,memoryBytes:this._memoryBytes,memoryBudgetBytes:this.memoryBudgetBytes,storageEntries:this._diskMeta.size,storageBytes:Math.max(0,this._storageBytes),storageBudgetBytes:this.storageBudgetBytes,storageAvailable:this._storageAvailable,storageWritable:this._storageWritable,storageStatus:this._storageStatus,hits:{...this._hits},misses:this._misses,evictions:{...this._evictions},errors:this._errors,pendingWrites:this._pendingWrites,epoch:this._epoch};}
}
