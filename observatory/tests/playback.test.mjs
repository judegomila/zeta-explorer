import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSequencePlan,sequenceKey,nearestFrame,prepareSequence,SequenceMemoryError} from '../dist/playback.js';
import {estimateBytes} from '../dist/field-cache.js';
const base={geometry:'plane',function:'zeta',sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,extent:'extended',resolution:'high',tau:.25,colorMode:'phase'};
const frame=n=>({values:new Float64Array([n,n+1,NaN,Infinity]),valid:new Uint8Array([1,1])});

test('plans include exact endpoints, distinct rounded times, copied heat states and selected density',()=>{
 const input={...base,heatStart:-.2,heatEnd:.4,heatFrames:17,playbackResolution:'current',playing:true};
 const plan=createSequencePlan(input);assert.equal(plan.frameCount,17);assert.equal(plan.resolution,'high');assert.equal(plan.taus[0],-.2);assert.equal(plan.taus.at(-1),.4);
 assert.ok(plan.taus.every((x,i)=>!i||x>plan.taus[i-1]));
 assert.ok(plan.states.every((s,i)=>s!==input&&s.function==='heat'&&!s.playing&&s.resolution==='high'&&s.tau===plan.taus[i]));
 assert.equal(input.function,'zeta');assert.equal(input.playing,true);
 assert.equal(createSequencePlan(base).resolution,'standard');assert.equal(createSequencePlan({...base,playbackResolution:'draft'}).resolution,'draft');
 const defaults=createSequencePlan({});assert.equal(defaults.frameCount,17);assert.equal(defaults.taus[0],-.3);assert.equal(defaults.taus.at(-1),.5);assert.ok(defaults.taus.includes(0));
});
test('heat range is clamped while invalid counts, reversed ranges and duplicate rounded frames reject',()=>{
 const p=createSequencePlan({...base,heatStart:-9,heatEnd:9,heatFrames:9});assert.equal(p.taus[0],-.3);assert.equal(p.taus.at(-1),.5);
 for(const patch of [{heatFrames:16},{heatFrames:'17'},{heatStart:.3,heatEnd:.2},{heatStart:1,heatEnd:2},{heatStart:NaN},{playbackResolution:'unknown'},{heatStart:0,heatEnd:1e-12,heatFrames:33}])assert.throws(()=>createSequencePlan({...base,...patch}));
});
test('sequence identity ignores display and FPS changes but includes all active field and clip inputs',()=>{
 const a={...base,heatFrames:9,playbackResolution:'standard'},key=sequenceKey(a);
 assert.equal(key,sequenceKey({...a,height:2,phaseOffset:1,camera:{x:2},fps:60,playbackFps:60,tau:-.3,function:'xi',resolution:'ultra',playing:true}));
 for(const patch of [{geometry:'sphere'},{heatFrames:17},{heatStart:-.2},{heatEnd:.4},{playbackResolution:'draft'},{vortices:true},{colorMode:'bridge'},{tMax:40}])assert.notEqual(key,sequenceKey({...a,...patch}));
 assert.equal(sequenceKey({...a,resolution:'standard',playbackResolution:'current'}),key);
});
test('nearest frame retrieval is array-only and handles endpoints, ties and empty sequences',()=>{
 assert.equal(nearestFrame([-.3,-.1,.1,.3],-.25),0);assert.equal(nearestFrame([0,2],1),0);assert.equal(nearestFrame([0,2],2.1),1);assert.equal(nearestFrame([0,2],-1),0);assert.equal(nearestFrame([],0),-1);
 assert.equal(nearestFrame(new Float64Array([0,.1,.2]),.19),2);assert.throws(()=>nearestFrame([0],NaN));
});
test('preparation loads sequentially and retains every complete frame without transfer or later loader calls',async()=>{
 const plan=createSequencePlan({...base,heatFrames:9}),progress=[];let active=0,maxActive=0,calls=0;
 const clip=await prepareSequence(plan,async(s,{index,total})=>{active++;maxActive=Math.max(maxActive,active);calls++;assert.equal(s,plan.states[index]);assert.equal(total,9);await Promise.resolve();active--;return {data:frame(index),source:index%2?'disk':'precomputed'};},{onProgress:p=>progress.push(p)});
 assert.equal(maxActive,1);assert.equal(calls,9);assert.equal(clip.frames.length,9);assert.equal(clip.bytes,estimateBytes(clip.frames));assert.deepEqual(clip.sources,{precomputed:5,disk:4});assert.equal(progress.length,9);assert.equal(progress.at(-1).completed,9);
 const selected=clip.frames[nearestFrame(clip.taus,.49)];assert.ok(selected.data.values instanceof Float64Array);assert.ok(selected.data.values.buffer.byteLength>0);assert.equal(calls,9);assert.ok(Number.isNaN(selected.data.values[2]));assert.equal(selected.data.values[3],Infinity);
});
test('shared mesh buffers fit when first-frame-times-count would falsely reject',async()=>{
 const plan=createSequencePlan({...base,heatFrames:9}),shared=new Float64Array(100000),data=plan.states.map((_,i)=>({positions:shared,values:new Float64Array([i])}));
 const expected=plan.states.map((state,i)=>({data:data[i],source:'memory',state,tau:plan.taus[i]})),limit=estimateBytes(expected);
 assert.ok(estimateBytes(expected[0])*plan.frameCount>limit);
 const clip=await prepareSequence(plan,async(_,ctx)=>({data:data[ctx.index],source:'memory'}),{byteLimit:limit});assert.equal(clip.bytes,limit);assert.ok(clip.frames.every(f=>f.data.positions===shared));
});
test('memory limit checks actual retained frames and stops before loading the rest',async()=>{
 const plan=createSequencePlan({...base,heatFrames:9});let calls=0;
 await assert.rejects(prepareSequence(plan,async()=>{calls++;return {data:{values:new Float64Array(10000)},source:'computed'};},{byteLimit:200000}),error=>error instanceof SequenceMemoryError&&error.code==='SEQUENCE_MEMORY_LIMIT'&&error.bytes>error.byteLimit&&error.completed===3);
 assert.equal(calls,3);
 calls=0;await assert.rejects(prepareSequence(plan,async()=>{calls++;return {data:frame(1),source:'memory'};},{byteLimit:1}),SequenceMemoryError);assert.equal(calls,1);
});
test('known state/wrapper lower bound can reject after one frame without assuming independent mesh buffers',async()=>{
 const plan=createSequencePlan({...base,heatFrames:9}),data=frame(1);const first=[{data,source:'memory',state:plan.states[0],tau:plan.taus[0]}],limit=estimateBytes(first)+1;let calls=0;
 await assert.rejects(prepareSequence(plan,async()=>{calls++;return {data,source:'memory'};},{byteLimit:limit}),e=>e instanceof SequenceMemoryError&&e.completed===1&&e.minimumBytes>limit);assert.equal(calls,1);
});
test('cancellation is checked before, after and between awaited loads',async()=>{
 const plan=createSequencePlan({...base,heatFrames:9}),before=new AbortController();before.abort();let calls=0;
 await assert.rejects(prepareSequence(plan,async()=>{calls++;return {data:frame(1)};},{signal:before.signal}),{name:'AbortError'});assert.equal(calls,0);
 const during=new AbortController();await assert.rejects(prepareSequence(plan,async()=>{calls++;during.abort('cancel');await Promise.resolve();return {data:frame(1)};},{signal:during.signal}),{name:'AbortError'});assert.equal(calls,1);
 const between=new AbortController();calls=0;await assert.rejects(prepareSequence(plan,async()=>{calls++;return {data:frame(calls)};},{signal:between.signal,onProgress:p=>{if(p.completed===2)between.abort();}}),{name:'AbortError'});assert.equal(calls,2);
});
