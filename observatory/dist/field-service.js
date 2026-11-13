import { FieldCache, FIELD_CACHE_VERSION, fieldKey } from './field-cache.js';
import { decodeField } from './cache-codec.js';

const abortError=()=>new DOMException('Field loading cancelled.','AbortError');
function check(signal){if(signal?.aborted)throw abortError();}

/** Exact fields: memory → IndexedDB → shipped numerical frames → worker. */
export class FieldService {
  constructor({onStatus=()=>{},cache,fetcher=globalThis.fetch?.bind(globalThis),workerFactory}={}){
    this.onStatus=onStatus;this.cache=cache||new FieldCache({onStatus:()=>this.emit()});
    this.fetcher=fetcher;this.workerFactory=workerFactory||(()=>new Worker(new URL('./sample-worker.js',import.meta.url),{type:'module'}));
    this.controllers=new Set();this.meshes=new Map();this.manifestPromise=null;this.epoch=0;
    this.counts={workerJobs:0,precomputedLoads:0,cacheHits:0};
  }
  emit(){try{this.onStatus(this.stats());}catch{}}
  stats(){return {...this.cache?.stats(),...this.counts};}
  async manifest(){
    if(!this.manifestPromise)this.manifestPromise=(async()=>{
      try{const response=await this.fetcher(new URL('./precache/manifest.json',import.meta.url));if(!response.ok)return null;const m=await response.json();return m.version===FIELD_CACHE_VERSION&&m.entries?m:null;}catch{return null;}
    })();
    return this.manifestPromise;
  }
  async blob(url,signal){
    const response=await this.fetcher(new URL(url,import.meta.url),{signal});
    if(!response.ok)throw new Error('Precomputed field could not be loaded.');
    let bytes=new Uint8Array(await response.arrayBuffer());check(signal);
    if(bytes[0]===0x1f&&bytes[1]===0x8b){
      if(typeof DecompressionStream==='undefined')throw new Error('Compressed frames are unsupported in this browser.');
      bytes=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    }
    check(signal);return decodeField(bytes);
  }
  async shipped(entry,signal){
    let mesh=null;
    if(entry.meshUrl){
      mesh=this.meshes.get(entry.meshUrl);
      if(!mesh){mesh=await this.blob(entry.meshUrl,signal);check(signal);this.meshes.set(entry.meshUrl,mesh);while(this.meshes.size>6)this.meshes.delete(this.meshes.keys().next().value);}
    }
    const frame=await this.blob(entry.url,signal),data=mesh?{...mesh,...frame}:frame;
    if(!(data.valid instanceof Uint8Array)||!(data.logAbs instanceof Float64Array)||!data.slice||!data.criticalSamples||!data.landmarkValues||data.valid.length!==(data.nx+1)*(data.ny+1))throw new Error('Incomplete precomputed field.');
    return data;
  }
  compute(state,signal,onProgress){
    check(signal);this.counts.workerJobs++;this.emit();
    return new Promise((resolve,reject)=>{
      let worker;
      const finish=(error,data)=>{signal.removeEventListener('abort',cancel);worker?.terminate();error?reject(error):resolve(data);};
      const cancel=()=>finish(abortError());
      try{
        worker=this.workerFactory();signal.addEventListener('abort',cancel,{once:true});
        worker.onmessage=({data:result})=>{if(result.type==='progress')onProgress?.(result.message);else if(result.type==='complete')finish(null,result.data);else if(result.type==='error')finish(new Error(result.message));};
        worker.onerror=event=>finish(new Error(event.message||'The numerical worker failed.'));
        worker.postMessage({id:1,state});
      }catch(error){finish(error);}
    });
  }
  async get(state,{signal:externalSignal,onProgress,allowCompute=true}={}){
    const controller=new AbortController(),signal=controller.signal,epoch=this.epoch;
    const cancel=()=>controller.abort();externalSignal?.addEventListener('abort',cancel,{once:true});if(externalSignal?.aborted)cancel();this.controllers.add(controller);
    const current=()=>{check(signal);if(epoch!==this.epoch)throw abortError();};
    try{
      current();const cached=await this.cache.get(state);current();
      if(cached){this.counts.cacheHits++;this.emit();return cached;}
      const manifest=await this.manifest();current();const entry=manifest?.entries[fieldKey(state)];
      let data,source;
      if(entry){
        try{onProgress?.('Loading precomputed field');data=await this.shipped(entry,signal);current();source='precomputed';this.counts.precomputedLoads++;}
        catch(error){current();if(error.name==='AbortError')throw error;}
      }
      if(!data){
        if(!allowCompute)return null;
        onProgress?.('Computing and caching field');data=await this.compute(state,signal,onProgress);source='computed';
      }
      current();await this.cache.set(state,data);current();this.emit();return {data,source};
    }finally{externalSignal?.removeEventListener('abort',cancel);this.controllers.delete(controller);}
  }
  async clear(){this.epoch++;for(const c of this.controllers)c.abort();this.meshes.clear();const result=await this.cache.clear();this.emit();return result;}
  dispose(){for(const c of this.controllers)c.abort();this.meshes.clear();}
}
