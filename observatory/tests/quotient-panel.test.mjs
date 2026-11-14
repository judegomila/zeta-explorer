import test from 'node:test';
import assert from 'node:assert/strict';
import { comparePolarConjugates, quotientDiagnostics, quotientPhaseResolution, QuotientPanel } from '../dist/quotient-panel.js';
import { evaluatePolar, ZERO_HEIGHTS } from '../dist/math.js';
import { torusPoint } from '../dist/elliptic.js';

const state={geometry:'klein',function:'xi',tau:0,torusR:1.6,chartScale:24,extent:'extended',playing:false,researchMode:'off',dynamicsMode:'off'};
const polar=(logAbs,arg=0,extra={})=>({valid:true,reliable:true,logAbs,arg,...extra});
const close=(a,b,tol=1e-12)=>assert.ok(Math.abs(a-b)<=tol,`${a} versus ${b}`);

test('log-polar comparison preserves underflowed amplitudes and detects unequal conjugates',()=>{
 const a=polar(-1200,.7,{re:0,im:0,rawRepresentable:false,status:'underflow'});
 const equal=comparePolarConjugates(a,polar(-1200,-.7,{re:0,im:0}));
 assert.equal(equal.status,'nonzero');assert.equal(equal.residual,0);assert.equal(equal.phaseError,0);
 const wrongMagnitude=comparePolarConjugates(a,polar(-1202,-.7,{re:0,im:0}));
 close(wrongMagnitude.residual,1-Math.exp(-2));assert.equal(wrongMagnitude.logModulusGap,2);
 const wrongPhase=comparePolarConjugates(a,polar(-1200,.7));
 close(wrongPhase.residual,2*Math.sin(.7));close(wrongPhase.phaseError,1.4);
 const wrapped=comparePolarConjugates(polar(-30,Math.PI),polar(-30,Math.PI));
 assert.ok(wrapped.phaseError<1e-14);assert.ok(wrapped.residual<1e-14);
});

test('evaluated zeros have no phase and invalid samples cannot become exact agreement',()=>{
 const both=comparePolarConjugates(polar(-Infinity),polar(-Infinity));
 assert.equal(both.residual,0);assert.equal(both.phaseError,null);assert.equal(both.status,'both-zero');
 const one=comparePolarConjugates(polar(-Infinity),polar(-1600,0));
 assert.equal(one.residual,1);assert.equal(one.logModulusGap,Infinity);assert.equal(one.phaseError,null);
 for(const p of [null,{valid:false},polar(NaN),polar(Infinity),polar(-20,NaN),polar(-20,0,{reliable:false})]){
  const c=comparePolarConjugates(p,polar(-20));assert.equal(c.valid,false);assert.equal(c.residual,null);
 }
});

test('actual xi and heat diagnostics evaluate the two reflected spectral points',()=>{
 for(const patch of [{function:'xi',tau:0},{function:'heat',tau:.3}]){
  const calls=[],current={...state,...patch},probe={sigma:.73,t:21.4};
  const d=quotientDiagnostics(current,probe,{evaluate:(...args)=>{calls.push(args);return evaluatePolar(...args);}});
  assert.equal(calls.length,2);assert.equal(calls[0][0],.73);assert.equal(calls[1][0],1-.73);assert.equal(calls[0][1],21.4);assert.equal(calls[1][1],21.4);
  assert.equal(calls[0][4],true);assert.equal(calls[1][4],true);assert.ok(d.comparison.residual<1e-12);assert.ok(Number.isFinite(d.logDensity));
  const p=torusPoint(d.lift.u,d.lift.v,{r:current.torusR,scale:current.chartScale});
  const a=torusPoint(d.pairedLift.u,d.pairedLift.v,{r:current.torusR,scale:current.chartScale});
  close(p.sigma,probe.sigma,1e-10);close(p.t,probe.t,1e-10);close(a.sigma,1-probe.sigma,1e-10);close(a.t,probe.t,1e-10);
 }
});

test('raw zeta selections explicitly use completed xi and unsupported samples stay masked',()=>{
 const kinds=[];
 const d=quotientDiagnostics({...state,function:'zeta'},{sigma:.63,t:14},{evaluate:(sigma,t,kind,...args)=>{kinds.push(kind);return evaluatePolar(sigma,t,kind,...args);},inverse:()=>[]});
 assert.equal(d.kind,'xi');assert.deepEqual(kinds,['xi','xi']);
 let calls=0;
 const outside=quotientDiagnostics({...state,extent:'core'},{sigma:.5,t:121},{evaluate:()=>{calls++;return polar(0);},inverse:()=>[]});
 assert.equal(calls,0);assert.equal(outside.comparison.valid,false);assert.equal(outside.logDensity,null);
 const badTime=quotientDiagnostics({...state,function:'heat',tau:2},{sigma:.5,t:14},{evaluate:()=>{calls++;return polar(0);},inverse:()=>[]});
 assert.equal(calls,0);assert.equal(badTime.comparison.valid,false);
});

test('local derivative density remains logarithmic and does not inherit phase singularity',()=>{
 const d=quotientDiagnostics(state,{sigma:.5,t:14},{evaluate:()=>polar(-Infinity,0,{derivativeLogAbs:-1000}),inverse:()=>[]});
 assert.equal(d.comparison.phaseError,null);close(d.logDensity,-2000/Math.LN10);
 const stationary=quotientDiagnostics(state,{sigma:.5,t:14},{evaluate:()=>polar(-10,0,{derivativeLogAbs:-Infinity}),inverse:()=>[]});
 assert.equal(stationary.logDensity,-Infinity);assert.equal(stationary.comparison.status,'nonzero');
});

test('phase conditioning detects a reference zero without confusing tiny amplitudes with zeros',()=>{
 const probe={sigma:.5,t:ZERO_HEIGHTS[0]},atZero=quotientDiagnostics(state,probe);
 assert.equal(atZero.sourcePhase,'near-zero');assert.equal(atZero.partnerPhase,'near-zero');
 assert.equal(atZero.sourceValue.status,'ok');assert.ok(Number.isFinite(atZero.sourceValue.logAbs));
 const nearby=quotientDiagnostics(state,{sigma:.5+1e-10,t:ZERO_HEIGHTS[0]});
 assert.equal(nearby.sourcePhase,'resolved');assert.equal(nearby.partnerPhase,'resolved');
 const tiny=polar(-1200,.4,{derivativeLogAbs:-1201,status:'underflow'});
 assert.equal(quotientPhaseResolution(tiny,{sigma:.5,t:1900}),'resolved');
 assert.equal(quotientPhaseResolution(polar(-Infinity),probe),'zero');
});

// The panel has no rendering or timing dependency: SVG is derived from the
// cached snapshot. This fixture exercises the real update/hold/action paths.
class Element {
 constructor(){this.dataset={};this.hidden=false;this.nodes=[];this.textContent='';this.classList={add(){}};}
 set innerHTML(html){
  this.html=html;this.nodes=[];
  for(const m of html.matchAll(/data-(quotient(?:-action)?)="([^"]+)"/g)){
   const el=new Element();el.dataset[m[1]==='quotient'?'quotient':'quotientAction']=m[2];this.nodes.push(el);
  }
 }
 get innerHTML(){return this.html??'';}
 querySelectorAll(selector){return this.nodes.filter(el=>selector==='[data-quotient]'?'quotient' in el.dataset:'quotientAction' in el.dataset);}
}

test('panel holds clear the previous sample and repeated redraws use the cached record',()=>{
 const panel=new QuotientPanel(new Element()),probe={sigma:.73,t:21.4};
 assert.equal(panel.container.hidden,true);panel.update(state,probe);const record=panel.snapshot;
 assert.equal(panel.container.hidden,false);assert.ok(record);assert.notEqual(panel.el.residual.textContent,'—');
 panel.redraw();panel.update({...state},{...probe});assert.equal(panel.snapshot,record);
 panel.hold(state,{sigma:.7,t:30},'Pending field');
 assert.equal(panel.snapshot,null);assert.equal(panel.el.residual.textContent,'—');assert.equal(panel.el.density.textContent,'—');assert.equal(panel.el.status.textContent,'Pending field');assert.doesNotMatch(panel.el.phase.innerHTML,/φ =/);
 panel.update(state,probe);assert.notEqual(panel.snapshot,record);assert.equal(panel.message,'');
 panel.update({...state,playing:true},probe);assert.equal(panel.snapshot,null);assert.match(panel.el.status.textContent,/pause/);
 panel.update({...state,geometry:'torus'},probe);assert.equal(panel.container.hidden,true);assert.equal(panel.snapshot,null);
 panel.dispose();
});

test('annulus boundary and Klein seam keep distinct explanations and explicit actions',()=>{
 const probes=[],actions=[],panel=new QuotientPanel(new Element(),{onProbe:p=>probes.push(p),onAction:a=>actions.push(a)});
 panel.update(state,{sigma:.5,t:12});
 panel.actions.antiBridge.onclick();panel.actions.zero.onclick();panel.actions.companion.onclick();panel.actions.bridgeEnergy.onclick();panel.actions.gramSchur.onclick();
 assert.deepEqual(probes,[{sigma:.5,t:0},{sigma:.5,t:ZERO_HEIGHTS[0]}]);
 assert.deepEqual(actions,[{type:'open-view',view:'annulus'},{type:'open-research',view:'bridgeEnergy'},{type:'open-research',view:'gramSchur'}]);
 assert.match(panel.el.boundaryFormula.textContent,/conj/);assert.match(panel.el.topologyNote.textContent,/nonorientable/);
 panel.update({...state,geometry:'annulus'},{sigma:.5,t:12});
 assert.match(panel.el.boundaryFormula.textContent,/Im F = 0/);assert.match(panel.el.cover.innerHTML,/P = R\(P\)/);
 assert.match(panel.el.tag.textContent,/REAL TRACES/);
 panel.actions.companion.onclick();assert.deepEqual(actions.at(-1),{type:'open-view',view:'klein'});
 panel.update({...state,function:'heat',tau:.3},{sigma:.5,t:12});assert.equal(panel.actions.zero.hidden,true);
 panel.update({...state,researchMode:'energy'},{sigma:.5,t:12});assert.equal(panel.container.hidden,true);
 panel.dispose();assert.equal(panel.actions.companion.onclick,null);
});

test('a reference-zero readout masks ill-conditioned phase and retains the actual sample',()=>{
 const panel=new QuotientPanel(new Element());panel.update(state,{sigma:.5,t:ZERO_HEIGHTS[0]});
 assert.match(panel.el.phaseError.textContent,/unresolved near zero/);assert.match(panel.el.status.textContent,/ill conditioned/);
 assert.doesNotMatch(panel.el.phase.innerHTML,/φ =/);assert.match(panel.el.phase.innerHTML,/near zero/);
 assert.notEqual(panel.el.residual.textContent,'—');assert.notEqual(panel.snapshot.sourceValue.logAbs,-Infinity);
 panel.dispose();
});
