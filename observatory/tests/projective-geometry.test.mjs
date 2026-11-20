import assert from 'node:assert/strict';
import test from 'node:test';
import {surfacePoint,inversePoint,criticalCurvePoint,criticalCurves,sampleAxes,landmarks,projectiveGuides} from '../dist/geometry.js';
import {computeLandmarkValues,computeCriticalSamples} from '../dist/critical-samples.js';
import {domainFor} from '../dist/domain.js';

const base={geometry:'sphere',projective:true,function:'xi',tau:0,extent:'extended',chartScale:1,torusR:2,resolution:'draft'};
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol*(1+Math.abs(b)),`${a} differs from ${b}`);

test('projective sphere has distinct spectral infinity and regular chart infinity',()=>{
  const infinity=surfacePoint(0,.5,base),north=surfacePoint(0,0,base),south=surfacePoint(0,1,base),anti=surfacePoint(.5,.5,base);
  assert.equal(infinity.puncture,true);assert.equal(infinity.valid,false);
  near(infinity.position[0],4);near(infinity.position[1],0);
  assert.ok(north.valid);near(north.sigma,0);near(north.t,0);assert.equal(north.chart,'reciprocal');
  assert.ok(south.valid);near(south.sigma,1);near(south.t,0);
  assert.ok(anti.valid);near(anti.sigma,.5);near(anti.t,0);near(anti.position[0],-4);
  for(const L of [1,24,72]){
    near(surfacePoint(0,0,{...base,chartScale:L}).sigma,.5-L/2);
    near(surfacePoint(0,1,{...base,chartScale:L}).sigma,.5+L/2);
  }
});

test('homogeneous domain sphere roundtrips throughout the finite evaluator region',()=>{
  for(const chartScale of [1,24,72])for(const [sigma,t] of [[0,0],[1,0],[.5,0],[.5,14.1347251417347],[-128,2000],[129,-2000],[-2,-17],[.51,.001]]){
    const state={...base,chartScale},[uv]=inversePoint(sigma,t,state),p=surfacePoint(uv.u,uv.v,state);
    assert.ok(p.valid);near(p.sigma,sigma,2e-8);near(p.t,t,2e-10);
    // Independent complex Mobius quotient in the finite w chart.
    const x=.5+(sigma-.5)/chartScale,y=t/chartScale,den=x*x+y*y;
    if(den){near(p.w.re,(x*(x-1)+y*y)/den,3e-9);near(p.w.im,y/den,3e-9);}
  }
});

test('projective chart Jacobian agrees with independently differenced spectral coordinates',()=>{
  for(const [u,v] of [[.13,.21],[.31,.72],[.72,.41],[.0001,.5001]]){
    const state={...base,chartScale:24},p=surfacePoint(u,v,state),h=1e-8;
    const up=surfacePoint(u+h,v,state),um=surfacePoint(u-h,v,state),vp=surfacePoint(u,v+h,state),vm=surfacePoint(u,v-h,state);
    near(p.dsdu.re,(up.sigma-um.sigma)/(2*h),3e-7);near(p.dsdu.im,(up.t-um.t)/(2*h),3e-7);
    near(p.dsdv.re,(vp.sigma-vm.sigma)/(2*h),3e-7);near(p.dsdv.im,(vp.t-vm.t)/(2*h),3e-7);
  }
});

test('projective critical line is the complete equator with only one puncture',()=>{
  const [curve]=criticalCurves(base,{segments:128});assert.ok(curve.closed);
  for(const p of curve.points){near(p.position[1],0);near(Math.hypot(...p.position),4);assert.equal(p.sigma,.5);}
  assert.equal(curve.points[0].puncture,true);assert.equal(curve.points.at(-1).puncture,true);
  for(const q of [.001,.1,.25,.5,.75,.99]){
    const p=criticalCurvePoint(q,0,base),s=surfacePoint(p.u,p.v,base);assert.ok(p.valid);
    near(s.t,p.t);near(p.t,.5/Math.tan(Math.PI*q));
  }
  near(curve.points[64].t,0);near(curve.points[64].position[0],-4);
});

test('tail-refined projective mesh follows the moved puncture and critical equator',()=>{
  for(const chartScale of [1,24,72]){
    const state={...base,chartScale,resolution:'standard'},axes=sampleAxes(state);
    assert.ok(axes.u.length*axes.v.length<60000);
    assert.ok([...axes.u].some(x=>Math.abs(x-1e-5)<1e-12));
    assert.ok([...axes.v].some(x=>Math.abs(x-(.5+1e-5))<1e-12));
    assert.ok([...axes.v].includes(.5));
    for(const t of [-1999.8,-1000,-120,120,1000,1999.8]){
      const [uv]=inversePoint(.5,t,state),u=[...axes.u].find(x=>Math.abs(x-uv.u)<1e-11);
      assert.notEqual(u,undefined);const p=surfacePoint(u,.5,state);near(p.t,t,2e-8);
    }
  }
});

test('branch markers and cuts agree with the exact elliptic cover',()=>{
  const lm=landmarks(base);assert.equal(lm.branches.length,4);
  const expected=[[0,2],[0,.5],[0,-2],[0,-.5]];
  lm.branches.forEach((b,i)=>{const p=surfacePoint(b.u,b.v,base);near(p.w.re,expected[i][0]);near(p.w.im,expected[i][1]);});
  const cuts=projectiveGuides(base);assert.equal(cuts.length,2);
  for(const cut of cuts)for(const p of cut.points){near(p[0],0);near(Math.hypot(...p),4);}
  for(const cut of projectiveGuides({...base,geometry:'torus'})){
    for(let k=0;k<3;k++)near(cut.points[0][k],cut.points.at(-1)[k]);
  }
});

test('prepared projective landmarks mask spectral infinity and evaluate regular quartic infinities',()=>{
  for(const geometry of ['sphere','torus']){
    const state={...base,geometry},markers=computeLandmarkValues(state,domainFor(state));
    const punctures=markers.filter(m=>m.kind==='puncture');assert.equal(punctures.length,geometry==='sphere'?1:2);
    for(const p of punctures){assert.equal(p.computed,false);assert.equal(p.polar,null);assert.equal(p.puncture,true);}
    const regular=markers.filter(m=>m.kind==='chart');assert.equal(regular.length,2);
    for(const p of regular){assert.equal(p.computed,true);assert.equal(p.puncture,false);near(Math.exp(p.polar.logAbs),.5);}
    const anti=markers.filter(m=>m.kind==='anti');
    for(const p of anti){near(p.sigma,.5);near(p.t,0);assert.ok(p.polar.logAbs>-Infinity,'anti-bridge is not a zero');}
  }
});

test('prepared projective critical traces retain finite-tail knots and puncture gaps',()=>{
  const state={...base,chartScale:24},[samples]=computeCriticalSamples(state,domainFor(state));
  assert.equal(samples[0].computed,false);assert.equal(samples.at(-1).computed,false);
  for(const target of [-1999.8,-1000,1000,1999.8])assert.ok(samples.some(p=>p.computed&&Math.abs(p.t-target)<1e-4));
  assert.ok(samples.every(p=>Math.abs(p.position[1])<1e-12));
});
