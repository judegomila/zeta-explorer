import test from 'node:test';
import assert from 'node:assert/strict';
import { INFINITY_DEFAULTS, normalizeInfinityConfig, createInfinityPresets,
 infinityPoint, infinityInverse, kleinInfinityPartner, infinityDisplayLogAbs,
 infinityProbe, infinitySamplingKey, sampleInfinityField, sampleInfinityFieldAsync } from '../dist/infinity.js';
import { InfinityPanel } from '../dist/infinity-panel.js';

const near=(a,b,tol=2e-11)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} ≈ ${b}`);
const end={...INFINITY_DEFAULTS,infinityMode:'end',chartScale:24,function:'xi',extent:'extended'};

test('end chart satisfies q=1−w and the exact spectral lens, on both sheets',()=>{
 for(const chartScale of [1,7,24])for(const infinitySheet of ['plus','minus'])for(const [u,v] of [[.03,.2],[.25,.73],[.5,0],[.84,.9]]){
  const state={...end,chartScale,infinitySheet},p=infinityPoint(u,v,state),q=p.q,d=q.re*q.re+q.im*q.im;
  assert.equal(p.valid,true);near(p.sigma,chartScale*q.re/d+(1-chartScale)/2);near(p.t,-chartScale*q.im/d);
  near(Math.hypot(q.re,q.im),Math.exp(-p.tau));
  const inverse=infinityInverse(p.sigma,p.t,state);near(inverse.u,u);near(inverse.v,v);assert.equal(inverse.inView,true);
 }
});

test('the local cylinder remains branch-free and never includes the infinity point',()=>{
 const c=normalizeInfinityConfig({infinityMode:'end',infinityTauMin:-20,infinityTauMax:-10});
 assert.equal(c.infinityTauMin,0);assert.equal(c.infinityTauMax,.25);
 for(const r of [1.0001,2,20])for(const [u,v] of [[0,0],[.25,1],[.73,.2]]){
  const p=infinityPoint(u,v,{...end,...c});assert.ok(Math.hypot(p.q.re,p.q.im)<=1+1e-14);
  assert.ok(Math.hypot(p.q.re,p.q.im)<Math.sqrt(1+r**-2));assert.ok(Math.hypot(p.q.re,p.q.im)>0);
 }
 assert.equal(infinityPoint(.5,Infinity,end).valid,false);
 assert.equal(infinityInverse(Infinity,0,end).valid,false);
});

test('strip end keeps x independent at every height and retains upper/lower signs',()=>{
 for(const infinityEnd of ['upper','lower'])for(const u of [0,.3,.5,1])for(const v of [0,.2,1]){
  const state={...end,infinityMode:'strip',infinityEnd,infinitySigmaSpan:.7,infinityTMin:10,infinityTMax:1500};
  const p=infinityPoint(u,v,state);near(p.sigma-.5,.7*(2*u-1));near(p.y,1/p.t);
  near(Math.abs(p.t),10*Math.exp(v*Math.log(150)));assert.equal(Math.sign(p.t),infinityEnd==='lower'?-1:1);
  const inverse=infinityInverse(p.sigma,p.t,state);near(inverse.u,u);near(inverse.v,v);
  assert.equal(infinityInverse(p.sigma,-p.t,state).status,'other-strip-end');
 }
});

test('Klein partner obeys the exact nonlinear q action and is an involution',()=>{
 for(const [u,v] of [[.11,.12],[.33,.52],[.82,.8]]){
  const p=infinityPoint(u,v,end),partner=kleinInfinityPartner(p,end),again=kleinInfinityPartner(partner,{...end,infinitySheet:partner.sheet});
  near(partner.sigma,1-p.sigma);near(partner.t,p.t);near(again.sigma,p.sigma);near(again.t,p.t);
  assert.equal(partner.sheet,'minus');assert.equal(again.sheet,'plus');
  const a=p.q.re,b=p.q.im,d=(1-a)**2+b*b;
  near(partner.q.re,(a*a-a+b*b)/d);near(partner.q.im,b/d);
 }
 const state={...end,infinityMode:'strip',infinityProbeU:.3,infinityProbeV:.7};
 const p=infinityPoint(.3,.7,state),partner=kleinInfinityPartner(p,state);
 near(partner.u,.7);near(partner.v,.7);
});

test('actual xi probe and sheet exchange agree, with a separately evaluated conjugate partner',()=>{
 const state={...end,infinityMode:'strip',infinityProbeU:.67,infinityProbeV:.18,infinityTMin:12,infinityTMax:50};
 const a=infinityProbe({...state,infinitySheet:'plus'}),b=infinityProbe({...state,infinitySheet:'minus'});
 assert.equal(a.value.valid,true);assert.equal(a.partnerValue.valid,true);assert.ok(a.conjugacy<3e-11);
 near(a.value.logAbs,b.value.logAbs);near(a.value.arg,b.value.arg);assert.notEqual(a.partner.sheet,b.partner.sheet);
});

test('uncovered strip samples and cutoffs are never evaluated or fabricated',()=>{
 let calls=0;
 const data=sampleInfinityField({...end,infinityMode:'strip',infinityTMin:3000,infinityTMax:12000,infinityResolution:'draft'}, {evaluate:()=>{calls++;throw new Error('outside-domain call');}});
 assert.equal(calls,0);assert.equal(data.validCount,0);assert.ok(data.valid.every(x=>x===0));assert.ok(data.logAbs.every(Number.isNaN));
 for(const b of data.boundaries){assert.equal(b.coverage,0);assert.equal(b.complete,false);assert.equal(b.minLogAbs,null);assert.equal(b.maxLogAbs,null);assert.equal(b.fluxScaled,null);assert.equal(b.fluxLogScale,null);}
 assert.equal(data.probe.value.valid,false);
});

test('the core extent and heat-parameter limits are honored before evaluation',()=>{
 for(const extra of [{extent:'core',infinityTMin:150,infinityTMax:300},{function:'heat',tau:1.1,infinityTMin:5,infinityTMax:30}]){
  let calls=0;const result=sampleInfinityField({...end,infinityMode:'strip',infinityResolution:'draft',...extra},{evaluate:()=>{calls++;return {valid:true};}});
  assert.equal(calls,0);assert.equal(result.validCount,0);
 }
});

// Independent analytic controls check flux signs, arclength and normalization.
const linear=(sigma,t)=>{
 const d=sigma*sigma+t*t,logAbs=.5*Math.log(d),arg=Math.atan2(t,sigma);
 return {valid:true,reliable:true,logAbs,arg,re:sigma,im:t,q:{re:sigma/d,im:-t/d},derivativeLogAbs:0};
};
test('F(s)=s has exact signed cylinder cutoff flux and clockwise phase current',()=>{
 const state={...end,chartScale:1,infinityTauMin:0,infinityTauMax:Math.log(2),infinityResolution:'draft'};
 const data=sampleInfinityField(state,{evaluate:linear}),[nearCut,farCut]=data.boundaries;
 assert.equal(nearCut.complete,true);assert.equal(farCut.complete,true);
 near(nearCut.fluxScaled,-2*Math.PI);near(farCut.fluxScaled,2*Math.PI);
 near(nearCut.fluxLogScale,0);near(farCut.fluxLogScale,2*Math.log(2));
 near(nearCut.phaseIntegral,-2*Math.PI);near(farCut.phaseIntegral,-2*Math.PI);
 const restored=nearCut.fluxScaled*Math.exp(nearCut.fluxLogScale)+farCut.fluxScaled*Math.exp(farCut.fluxLogScale);
 near(restored,6*Math.PI);
});

test('strip cap normals account for both upper and lower end orientation',()=>{
 const a=.2,evaluate=(sigma,t)=>({valid:true,reliable:true,logAbs:a*t,arg:-a*sigma,re:NaN,im:NaN,q:{re:0,im:-a},derivativeLogAbs:a*t+Math.log(a)});
 for(const infinityEnd of ['upper','lower']){
  const state={...end,infinityMode:'strip',infinityEnd,infinitySigmaSpan:.75,infinityTMin:4,infinityTMax:10,infinityResolution:'draft'};
  const data=sampleInfinityField(state,{evaluate}),sign=infinityEnd==='lower'?-1:1;
  near(data.boundaries[0].fluxScaled,-sign*a*1.5);near(data.boundaries[1].fluxScaled,sign*a*1.5);
  near(data.boundaries[0].fluxLogScale,2*a*sign*4);near(data.boundaries[1].fluxLogScale,2*a*sign*10);
 }
});

test('Gaussian mode changes display amplitude only and preserves exact field/cache data',()=>{
 const state={...end,infinityDisplay:'damped',infinityDampingScale:10},p={sigma:2.5,t:30};
 near(infinityDisplayLogAbs(4,p.sigma,p.t,state),4-9.04);
 assert.equal(infinityDisplayLogAbs(-Infinity,p.sigma,p.t,state),-Infinity);
 assert.equal(infinityDisplayLogAbs(4,p.sigma,p.t,{...state,infinityDisplay:'exact'}),4);
 assert.equal(infinitySamplingKey(state),infinitySamplingKey({...state,infinityDisplay:'exact',infinityColor:'amplitude',infinitySheet:'minus',infinityProbeU:.9}));
 assert.notEqual(infinitySamplingKey(state),infinitySamplingKey({...state,function:'heat',tau:.1}));
 const a=infinityProbe(state),b=infinityProbe({...state,infinityDisplay:'exact'});
 assert.deepEqual(a.value,b.value);assert.deepEqual(a.current,b.current);
});

test('zero phase is undefined and rapid phase variation is explicitly marked',()=>{
 const zero=()=>({valid:true,reliable:true,logAbs:-Infinity,arg:0,re:0,im:0,q:{re:NaN,im:NaN},derivativeLogAbs:0});
 const z=infinityProbe({...end,chartScale:1},{evaluate:zero});assert.equal(z.value.phaseDefined,false);assert.equal(z.value.phaseStable,false);assert.equal(z.current,null);
 const fast=(sigma,t)=>({valid:true,reliable:true,logAbs:-200*t,arg:Math.atan2(Math.sin(200*sigma),Math.cos(200*sigma)),q:{re:0,im:200},derivativeLogAbs:-200*t+Math.log(200)});
 const data=sampleInfinityField({...end,chartScale:1,infinityTauMax:1,infinityResolution:'draft'},{evaluate:fast});
 assert.ok(data.phaseWarningCount>0);assert.ok(data.validCount>0);assert.equal(data.zeroCount,0);
});

test('configuration and sampling do not mutate inputs; preset scopes are explicit',()=>{
 const state=Object.freeze({...end,infinityTauMin:-2,infinityTMin:40,infinityTMax:20,infinityPartner:false});
 const config=normalizeInfinityConfig(state);assert.equal(state.infinityTauMin,-2);assert.equal(config.infinityTauMin,0);assert.equal(config.infinityTMax,44);assert.equal(config.infinityPartner,false);
 assert.equal(Object.hasOwn(config,'chartScale'),false);
 const presets=createInfinityPresets({function:'zeta',projective:true});
 for(const [name,mode] of [['infinityEnd','end'],['stripEnds','strip']]){
  const p=presets[name].settings;assert.equal(p.infinityMode,mode);assert.equal(p.function,'xi');assert.equal(p.extent,'extended');assert.equal(p.projective,false);assert.equal(p.infinityDisplay,'exact');assert.equal(p.channelsMode,'off');
 }
});

test('chunked fallback abandons superseded work rather than completing stale samples',async()=>{
 let rows=0;
 const data=await sampleInfinityFieldAsync({...end,chartScale:1,infinityResolution:'draft'},{evaluate:linear,onProgress:()=>rows++,cancelled:()=>rows>=2});
 assert.equal(data,null);assert.equal(rows,2);
});

test('panel terminates superseded workers and ignores stale progress and data',async()=>{
 const workers=[];
 class WorkerStub{
  constructor(){this.terminated=false;workers.push(this);}
  postMessage(message){this.message=message;}
  terminate(){this.terminated=true;}
 }
 const panel=Object.assign(Object.create(InfinityPanel.prototype),{
  el:{classList:{add(){},remove(){}}},WorkerClass:WorkerStub,state:{...end},data:null,probe:null,
  serial:0,active:true,worker:null,timer:null,pending:null,ready:Promise.resolve(),destroyed:false,
  _status(text){this.lastStatus=text;},_syncControls(){},_inspector(){},_readouts(){},_drawSoon(){},_clearSampledReadouts(){this.readoutsCleared=true;},
 });
 const first=panel.update({...end,infinityResolution:'draft'});panel.flush();
 assert.equal(workers.length,1);const stale=workers[0];
 const state={...end,infinityResolution:'draft',infinityTauMax:2.1};
 const second=panel.update(state);panel.flush();
 assert.equal(stale.terminated,true);assert.equal(await first,null);assert.equal(workers.length,2);
 const live=workers[1];live.onmessage({data:{id:live.message.id,progress:.4}});
 const status=panel.lastStatus;
 stale.onmessage({data:{id:stale.message.id,progress:.99}});assert.equal(panel.lastStatus,status);
 stale.onmessage({data:{id:stale.message.id,result:{key:'stale'}}});assert.equal(panel.data,null);
 const result={key:infinitySamplingKey(state),validCount:20};
 live.onmessage({data:{id:live.message.id,result}});assert.equal(await second,result);assert.equal(panel.data,result);assert.equal(live.terminated,true);
 panel.update({...state,infinityDisplay:'damped',infinityColor:'amplitude',infinityProbeU:.51});
 assert.equal(workers.length,2);assert.equal(panel.pending,null);assert.equal(panel.data,result);
 panel.readoutsCleared=false;panel.update({...state,infinityTauMax:3.4});
 assert.equal(panel.data,null);assert.equal(panel.readoutsCleared,true);assert.ok(panel.pending);
 panel.pause();
});

test('drawing refuses samples from a different coordinate or source key',()=>{
 const drawn=[],ctx={setTransform(){},fillRect(){},fillText(text){drawn.push(text);}};
 const state={...end,infinityTauMax:3.2};
 const panel={active:true,state,data:{key:infinitySamplingKey({...state,infinityTauMax:1.7})},
  canvas:{clientWidth:400,style:{},getContext(){return ctx;}},win:{devicePixelRatio:1},el:{clientWidth:400},hitAreas:[]};
 InfinityPanel.prototype._draw.call(panel);
 assert.deepEqual(drawn,['Preparing independently evaluated samples…']);
 assert.deepEqual(panel.hitAreas,[]);
});

test('unevaluated cutoff UI never converts null logarithms or flux scales into zero',()=>{
 const node=()=>({children:[],textContent:'',append(...items){this.children.push(...items);},replaceChildren(...items){this.children=[...items];}});
 const elements=new Map(),el={querySelector(selector){if(!elements.has(selector))elements.set(selector,node());return elements.get(selector);}};
 const panel={el,doc:{createElement:node},state:{infinityMode:'strip'},_status(){},data:{nx:1,ny:1,validCount:0,phaseWarningCount:0,kind:'xi',domain:{sigmaMin:-128,sigmaMax:129,tMax:2000},boundaries:[{outer:true,minLogAbs:null,maxLogAbs:null,fluxScaled:null,fluxLogScale:null,coverage:0,complete:false}]}};
 InfinityPanel.prototype._readouts.call(panel);
 const text=elements.get('[data-cutoffs]').children.flatMap(card=>card.children.map(child=>child.textContent)).join('\n');
 assert.match(text,/log₁₀\|F\|: unevaluated/);assert.match(text,/Signed flux: unevaluated/);assert.doesNotMatch(text,/multiplier 10\^0|0 … 0/);
 assert.match(elements.get('[data-boundary-scope]').textContent,/vertical sides are not included/);
});
