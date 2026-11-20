import { sampleField } from './sampler.js';

// Transfer every typed buffer once; the numerical implementation lives in sampler.js.
function transferables(value){
 const buffers=new Set();
 const visit=item=>{
  if(ArrayBuffer.isView(item))buffers.add(item.buffer);
  else if(item&&typeof item==='object')for(const child of Object.values(item))visit(child);
 };
 visit(value);
 return [...buffers];
}
self.onmessage=event=>{
 const {id,state}=event.data;
 try{
  const data=sampleField(state,{onProgress:message=>self.postMessage({id,type:'progress',message})});
  self.postMessage({id,type:'complete',data},transferables(data));
 }catch(error){self.postMessage({id,type:'error',message:error.message,stack:error.stack});}
};
