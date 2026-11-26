import { sampleHorizon } from './horizon.js';

self.onmessage=event=>{
 const {id,state}=event.data;
 try{
  const data=sampleHorizon(state,{onProgress:message=>self.postMessage({id,type:'progress',message})});
  const buffers=[data.u,data.v,data.sigma,data.t,data.logAbs,data.arg,data.valid,data.interior].map(a=>a.buffer);
  self.postMessage({id,type:'complete',data},buffers);
 }catch(error){self.postMessage({id,type:'error',message:error.message});}
};
