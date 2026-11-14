import { sampleInfinityField } from './infinity.js';

// The owning panel terminates superseded work, so a stale heat evaluation
// cannot queue behind a newly selected chart or overwrite its result.
self.onmessage=event=>{
 const {id,state}=event.data||{};
 try{
  const started=performance.now();
  const result=sampleInfinityField(state,{onProgress:progress=>self.postMessage({id,progress})});
  if(!result)return;
  result.elapsedMs=performance.now()-started;
  const transfer=Object.values(result).filter(v=>ArrayBuffer.isView(v)).map(v=>v.buffer);
  self.postMessage({id,result},transfer);
 }catch(error){self.postMessage({id,error:error?.message||'The infinity chart could not be sampled.'});}
};
