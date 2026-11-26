import test from 'node:test';
import assert from 'node:assert/strict';
import { horizonAxes, sampleHorizon, outwardSteps, cellInWindow, horizonFadeAt, horizonKey, HORIZON_SCENE } from '../dist/horizon.js';
import { sampleAxes } from '../dist/geometry.js';
import { evaluatePolar } from '../dist/math.js';

const plane={geometry:'plane',function:'zeta',tau:0,sigmaMin:-1.5,sigmaMax:2.5,tMin:8,tMax:38,resolution:'standard',extent:'extended'};

test('outward steps grow geometrically and stop exactly at the reach',()=>{
  const steps=outwardSteps(.1,20,1.1);
  assert.equal(steps.at(-1),20);
  for(let i=1;i<steps.length;i++)assert.ok(steps[i]>steps[i-1]);
  assert.ok(steps.length<60,'far field stays cheap');
});

test('far-field axes keep every window knot, so the seam has no cracks',()=>{
  const base=sampleAxes(plane),{u,v}=horizonAxes(plane);
  for(const x of base.u)assert.ok(u.includes(x));
  for(const x of base.v)assert.ok(v.includes(x));
  for(let i=1;i<u.length;i++)assert.ok(u[i]>u[i-1]);
  for(let i=1;i<v.length;i++)assert.ok(v[i]>v[i-1]);
  assert.ok(Math.abs(-u[0]*HORIZON_SCENE.width-HORIZON_SCENE.side)<1e-9);
  assert.ok(Math.abs((v.at(-1)-1)*HORIZON_SCENE.depth-HORIZON_SCENE.reach)<1e-9);
});

test('far-field samples are the exact function, and the window interior is left to the main surface',()=>{
  const h=sampleHorizon(plane);
  assert.ok(h.evaluated>1000&&h.evaluated<60000);
  let checked=0;
  for(let k=0;k<h.valid.length;k+=997){
    if(h.interior[k]){assert.equal(h.valid[k],0);continue;}
    if(!h.valid[k])continue;
    const f=evaluatePolar(h.sigma[k],h.t[k],'zeta',0);
    assert.equal(h.logAbs[k],f.logAbs);assert.equal(h.arg[k],f.arg);checked++;
  }
  assert.ok(checked>10);
  assert.ok(Math.max(...h.t)>300,'reaches well past the window along t');
});

test('cells inside the window are skipped; fade is 1 at the window and 0 at the reach',()=>{
  assert.equal(cellInWindow(0,.1,.2,.3),true);
  assert.equal(cellInWindow(-.1,0,.2,.3),false);
  assert.equal(horizonFadeAt(.5,.5),1);
  assert.equal(horizonFadeAt(.5,1+HORIZON_SCENE.reach/HORIZON_SCENE.depth),0);
  assert.equal(horizonFadeAt(-HORIZON_SCENE.side/HORIZON_SCENE.width,.5),0);
});

test('far-field cache key ignores display settings',()=>{
  assert.equal(horizonKey(plane),horizonKey({...plane,height:2,colorMode:'modulus',farField:true}));
  assert.notEqual(horizonKey(plane),horizonKey({...plane,tMax:40}));
});
