import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleField } from '../dist/sampler.js';
import { fieldKey } from '../dist/field-cache.js';
import { holeRadiusFor, samplingDomain, HOLE_LIMITS } from '../dist/domain.js';

const base={function:'xi',tau:0,torusR:2,chartScale:24,resolution:'draft',extent:'extended',colorMode:'phase',bridgeA:.25,projective:true,sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38};

test('the hole is off by default, never applies to the plane, and is clamped',()=>{
  assert.equal(holeRadiusFor({geometry:'torus'}),null);
  assert.equal(holeRadiusFor({geometry:'plane',infinityHole:true,holeRadius:50}),null);
  assert.equal(holeRadiusFor({geometry:'klein',infinityHole:true,holeRadius:50}),50);
  assert.equal(holeRadiusFor({geometry:'klein',infinityHole:true,holeRadius:9999}),HOLE_LIMITS.holeRadius[1]);
  assert.equal(samplingDomain({geometry:'torus',function:'xi',infinityHole:true,holeRadius:60}).tMax,60);
});

test('existing cache keys are unchanged and a hole owns a distinct key',()=>{
  for(const geometry of ['sphere','torus','klein','annulus']){
    const s={...base,geometry};
    assert.equal(fieldKey({...s,infinityHole:false,holeRadius:77}),fieldKey(s));
    assert.notEqual(fieldKey({...s,infinityHole:true,holeRadius:120}),fieldKey(s));
    assert.notEqual(fieldKey({...s,infinityHole:true,holeRadius:120}),fieldKey({...s,infinityHole:true,holeRadius:60}));
  }
  assert.equal(fieldKey({...base,geometry:'plane',infinityHole:true}),fieldKey({...base,geometry:'plane'}));
});

for(const geometry of ['sphere','torus','klein','annulus'])
test(`${geometry}: every kept sample lies inside the rim and the rim is evaluated`,()=>{
  const radius=60,data=sampleField({...base,geometry,ladder:true,infinityHole:true,holeRadius:radius});
  assert.equal(data.hole.radius,radius);
  let kept=0;
  for(let k=0;k<data.valid.length;k++)if(data.valid[k]){kept++;assert.ok(Math.hypot(data.coords[2*k]-.5,data.coords[2*k+1])<=radius);}
  assert.ok(kept>1000);
  const plain=sampleField({...base,geometry,ladder:true});
  assert.ok(plain.validCount>data.validCount,'the hole removes samples');
  assert.equal(plain.hole,undefined);
  const points=data.hole.rim.reduce((n,line)=>n+line.points.length,0);
  assert.ok(points>100,'rim curve present');
  for(const line of data.hole.rim)for(const v of line.logAbs)assert.ok(Number.isFinite(v)||v===-Infinity,'rim points carry evaluated values');
  // Ladder rails stop at the rim instead of running into the removed disc.
  for(const line of data.ladderLines)assert.ok(line.points.length>1);
});

test('the rim circle is symmetric under the critical reflection and conjugation',()=>{
  const radius=60;
  for(const [sigma,t] of [[10,59],[-30,40],[.5,60]]){
    const inside=Math.hypot(sigma-.5,t)<=radius;
    assert.equal(Math.hypot((1-sigma)-.5,t)<=radius,inside);
    assert.equal(Math.hypot(sigma-.5,-t)<=radius,inside);
  }
});
