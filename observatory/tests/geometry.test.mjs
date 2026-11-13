import assert from 'node:assert/strict';
import test from 'node:test';
import {sampleAxes,surfacePoint,inversePoint,embedded,criticalCurves,criticalCurvePoint} from '../dist/geometry.js';

const base={geometry:'sphere',resolution:'standard',chartScale:24,torusR:1.6,sigmaMin:-2,sigmaMax:3,tMin:-40,tMax:40};
const near=(a,b,tolerance=1e-10)=>assert.ok(Math.abs(a-b)<=tolerance*(1+Math.abs(b)),`${a} differs from ${b}`);

test('nonuniform axes preserve endpoints and exact critical/seam knots within practical budgets',()=>{
  const budgets={draft:25000,standard:60000,high:120000,ultra:250000};
  for(const geometry of ['sphere','torus'])for(const resolution of Object.keys(budgets)){
    const axes=sampleAxes({...base,geometry,resolution});
    for(const axis of [axes.u,axes.v]){
      assert.equal(axis[0],0);assert.equal(axis.at(-1),1);
      for(let i=1;i<axis.length;i++)assert.ok(axis[i]>axis[i-1]);
      for(const knot of [.25,.5,.75])assert.ok([...axis].includes(knot));
    }
    assert.ok(axes.u.length*axes.v.length<=budgets[resolution]);
    // Verify a true near-puncture knot exists, not just denser uniform spacing.
    const target=geometry==='sphere'?1e-5:.25+1e-5;
    assert.ok([...axes.v].some(x=>Math.abs(x-target)<1e-12));
  }
});

test('sphere critical guide is a complete great circle with only one geometric puncture',()=>{
  const curves=criticalCurves(base,{segments:256});assert.equal(curves.length,1);assert.ok(curves[0].closed);
  const points=curves[0].points;
  assert.equal(points[0].puncture,true);assert.equal(points.at(-1).puncture,true);
  for(let i=0;i<points.length;i++){
    const p=points[i];near(p.position[0],0);near(Math.hypot(...p.position),4);
    assert.equal(p.sigma,.5);
    if(i>0&&i<points.length-1)assert.equal(p.valid,true);
  }
  for(let k=0;k<3;k++)near(points[0].position[k],points.at(-1).position[k]);
  near(points[128].t,0);near(points[128].position[1],-4);
  assert.ok(points[1].t>0&&points.at(-2).t<0);
});

test('curved meshes include calibrated finite critical tails nearly to t=2000',()=>{
  for(const geometry of ['sphere','torus'])for(const chartScale of [1,24,72]){
    const state={...base,geometry,chartScale},axes=sampleAxes(state);
    for(const t of [-1999.8,-1500,-1000,-750,-500,-250,-120,120,250,500,750,1000,1500,1999.8]){
      const points=inversePoint(.5,t,state);
      assert.equal(points.length,geometry==='sphere'?1:2);
      for(const uv of points){
        const u=geometry==='sphere'?(t>0?.25:.75):[...axes.u].find(x=>Math.abs(x-uv.u)<1e-11);
        const v=geometry==='sphere'?[...axes.v].find(x=>Math.abs(x-uv.v)<1e-11):(uv.v<.5?.25:.75);
        assert.notEqual(u,undefined);assert.notEqual(v,undefined);
        const p=surfacePoint(u,v,state);assert.ok(p.valid);near(p.sigma,.5,2e-7);near(p.t,t,2e-8);
      }
    }
  }
});

test('both exact torus ovals remain continuous at all finite tails and are deck paired',()=>{
  const state={...base,geometry:'torus'};
  const curves=criticalCurves(state,{segments:256});assert.equal(curves.length,2);
  for(const curve of curves){
    assert.ok(curve.closed);
    assert.equal(curve.points[0].puncture,true);assert.equal(curve.points.at(-1).puncture,true);
    for(let k=0;k<3;k++)near(curve.points[0].position[k],curve.points.at(-1).position[k]);
    assert.ok(curve.points.slice(1,-1).every(p=>p.valid&&p.sigma===.5));
  }
  for(const q of [1e-6,1e-5,.001,.1,.25,.5,.75,.999,1-1e-6]){
    const a=criticalCurvePoint(q,0,state),b=criticalCurvePoint(q,1,state);
    near(a.t,b.t,5e-9);assert.equal(a.v,.25);assert.equal(b.v,.75);
    if(q<.5)assert.ok(a.t>0);else if(q>.5)assert.ok(a.t<0);else near(a.t,0);
  }
});

test('sphere half-angle chart preserves very large finite points instead of rounding them to infinity',()=>{
  for(const scale of [1,24,72])for(const [sigma,t] of [[.5,2000],[-128,2000],[129,-2000],[.5,1e8],[.5,-1e8],[.5,0]]){
    const state={...base,chartScale:scale},[uv]=inversePoint(sigma,t,state),p=surfacePoint(uv.u,uv.v,state);
    assert.ok(p.valid);near(p.t,t,2e-12);near(p.sigma,sigma,1e-6);
  }
});

test('elliptic inverse covers the expanded finite evaluation region',()=>{
  for(const r of [1.15,1.6,3])for(const [sigma,t] of [[.5,2000],[-128,2000],[129,-2000],[.5,14.1347251417347]]){
    const state={...base,geometry:'torus',torusR:r};
    const roots=inversePoint(sigma,t,state);assert.equal(roots.length,2);
    for(const uv of roots){const p=surfacePoint(uv.u,uv.v,state);assert.ok(p.valid);near(p.sigma,sigma,2e-8);near(p.t,t,2e-8);}
  }
});

test('parameter seams coincide exactly in the geometric embedding',()=>{
  for(const geometry of ['sphere','torus'])for(const v of [.01,.25,.5,.75,.99]){
    assert.deepEqual(embedded(0,v,geometry),embedded(1,v,geometry));
  }
  for(const u of [.01,.25,.5,.75,.99])assert.deepEqual(embedded(u,0,'torus'),embedded(u,1,'torus'));
});
