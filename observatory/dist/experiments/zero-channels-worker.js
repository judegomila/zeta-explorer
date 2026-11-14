import { computeZeroChannels, normalizeChannelState } from '../zero-channels-math.js';

let theta=null,bounds=null;
const cache=new Map();
function cacheKey(state){return JSON.stringify(normalizeChannelState(state));}
self.onmessage=event=>{
 const {type,id,state,thetaDataset,boundsDataset}=event.data||{};
 if(type==='init'){theta=thetaDataset||null;bounds=boundsDataset||null;cache.clear();self.postMessage({type:'ready'});return;}
 if(type!=='compute')return;
 try{
  const normalized=normalizeChannelState(state),key=cacheKey(normalized);let result=cache.get(key);
  if(!result){result=computeZeroChannels(normalized,theta,bounds,{includeGuidance:normalized.view==='newton'});cache.set(key,result);while(cache.size>12)cache.delete(cache.keys().next().value);}
  self.postMessage({type:'result',id,result});
 }catch(error){self.postMessage({type:'error',id,error:error?.message||'The experiment could not be computed.'});}
};
