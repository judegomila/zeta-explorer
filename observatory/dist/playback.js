/** Prepare immutable, bounded heat clips. Playback itself reads this array only. */
import { fieldKey, estimateBytes } from './field-cache.js';
const DEFAULT_BYTE_LIMIT=192*1024*1024;
const SEQUENCE_VERSION='zeta-observatory-heat-sequence-v1';
const roundTau=value=>{const n=Number(value.toFixed(12));return Object.is(n,-0)?0:n;};
function finiteNumber(value,fallback,name){const v=value??fallback;if(typeof v!=='number'||!Number.isFinite(v))throw new TypeError(`${name} must be a finite number.`);return v;}
function sequenceSettings(state){
  const rawStart=finiteNumber(state.heatStart,-.3,'Heat range start'),rawEnd=finiteNumber(state.heatEnd,.5,'Heat range end');
  const start=roundTau(Math.max(-.3,Math.min(.5,rawStart))),end=roundTau(Math.max(-.3,Math.min(.5,rawEnd)));
  if(!(start<end))throw new RangeError('Heat range start must be less than its end.');
  const frameCount=state.heatFrames??17;if(![9,17,33].includes(frameCount))throw new RangeError('Choose 9, 17, or 33 heat frames.');
  const density=state.playbackResolution??'standard';if(!['draft','standard','current'].includes(density))throw new RangeError('Unknown playback density.');
  const resolution=density==='current'?(state.resolution??'standard'):density;
  if(!['draft','standard','high','ultra'].includes(resolution))throw new RangeError('Unknown current sampling density.');
  return {start,end,frameCount,resolution};
}
export function createSequencePlan(state={}){
  if(!state||typeof state!=='object')throw new TypeError('A view state is required.');
  const {start,end,frameCount,resolution}=sequenceSettings(state);
  const taus=Array.from({length:frameCount},(_,i)=>i===0?start:i===frameCount-1?end:roundTau(start+(end-start)*i/(frameCount-1)));
  for(let i=1;i<taus.length;i++)if(!(taus[i]>taus[i-1]))throw new RangeError('Heat range is too narrow for distinct frames at 12-decimal precision.');
  const base={...state,function:'heat',playing:false,resolution};
  const states=taus.map(tau=>({...base,tau}));
  const key=JSON.stringify([SEQUENCE_VERSION,fieldKey({...base,tau:0}),start,end,frameCount]);
  return {key,states,taus,resolution,frameCount};
}
export function sequenceKey(state={}){return createSequencePlan(state).key;}
/** Index only: no fetching, interpolation, numerical sampling, or side effects. */
export function nearestFrame(taus,tau){
  if(!taus||typeof taus.length!=='number')throw new TypeError('Frame times are required.');
  if(taus.length===0)return -1;
  if(typeof tau!=='number'||!Number.isFinite(tau))throw new TypeError('Heat time must be finite.');
  let index=0,distance=Infinity;
  for(let i=0;i<taus.length;i++){
    if(typeof taus[i]!=='number'||!Number.isFinite(taus[i]))throw new TypeError('Frame times must be finite.');
    const d=Math.abs(taus[i]-tau);if(d<distance){distance=d;index=i;}
  }
  return index;
}
export class SequenceMemoryError extends RangeError {
  constructor({bytes,byteLimit,completed,total,minimumBytes=bytes}){
    super(`The heat clip exceeds its ${(byteLimit/1024/1024).toFixed(0)} MiB memory budget. Use fewer frames or Responsive density.`);
    this.name='SequenceMemoryError';this.code='SEQUENCE_MEMORY_LIMIT';this.bytes=bytes;this.byteLimit=byteLimit;this.completed=completed;this.total=total;this.minimumBytes=minimumBytes;
  }
}
function abortError(signal){
  if(signal?.reason?.name==='AbortError')return signal.reason;
  if(typeof DOMException==='function')return new DOMException('Heat sequence preparation was cancelled.','AbortError');
  const error=new Error('Heat sequence preparation was cancelled.');error.name='AbortError';return error;
}
function checkAbort(signal){if(signal?.aborted)throw abortError(signal);}
/**
 * Sequential preparation is intentional: at most one frame computation/load is
 * in flight. Shared mesh buffers are counted once by estimateBytes(frames).
 * The result contains every frame needed by Play; displaying it needs no I/O.
 */
export async function prepareSequence(plan,loadFrame,{signal,onProgress=()=>{},byteLimit=DEFAULT_BYTE_LIMIT}={}){
  if(!plan||!Array.isArray(plan.states)||!Array.isArray(plan.taus)||!plan.states.length||plan.states.length!==plan.taus.length)throw new TypeError('A valid heat sequence plan is required.');
  if(typeof loadFrame!=='function')throw new TypeError('A frame loader is required.');
  if(typeof byteLimit!=='number'||!Number.isFinite(byteLimit)||byteLimit<0)throw new RangeError('A finite nonnegative clip memory budget is required.');
  checkAbort(signal);
  const frames=[],counts=new Map(),total=plan.states.length;let bytes=estimateBytes(frames);
  for(let index=0;index<total;index++){
    checkAbort(signal);let loaded;
    try{loaded=await loadFrame(plan.states[index],{signal,index,total});}catch(error){if(signal?.aborted)throw abortError(signal);throw error;}
    checkAbort(signal);
    if(!loaded||typeof loaded.data!=='object'||loaded.data===null)throw new TypeError(`Heat frame ${index+1} did not contain computed data.`);
    const source=typeof loaded.source==='string'?loaded.source:'unknown';
    frames.push({data:loaded.data,source,state:plan.states[index],tau:plan.taus[index]});
    bytes=estimateBytes(frames);
    if(bytes>byteLimit)throw new SequenceMemoryError({bytes,byteLimit,completed:frames.length,total});
    if(index===0){
      // A safe lower bound: future frames reuse the ENTIRE first data object,
      // and even their source strings are empty. This counts known wrappers and
      // states but never multiplies the first frame's mesh by the frame count.
      const minimum=plan.states.map((state,i)=>i===0?frames[0]:{data:loaded.data,source:'',state,tau:plan.taus[i]});
      const minimumBytes=estimateBytes(minimum);
      if(minimumBytes>byteLimit)throw new SequenceMemoryError({bytes,byteLimit,completed:1,total,minimumBytes});
    }
    counts.set(source,(counts.get(source)||0)+1);
    onProgress({completed:index+1,total,source,bytes});checkAbort(signal);
  }
  checkAbort(signal);
  return {key:plan.key,frames,taus:[...plan.taus],resolution:plan.resolution,bytes,sources:Object.fromEntries(counts)};
}
