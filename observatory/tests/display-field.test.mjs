import test from 'node:test';
import assert from 'node:assert/strict';
import {gaussianLogWeight,displayLogMagnitude,displayVisibility,displayPolar} from '../dist/display-field.js';
import {evaluatePolar} from '../dist/math.js';
import {fieldKey} from '../dist/field-cache.js';
import {sequenceKey} from '../dist/playback.js';

test('Gaussian display factor respects the Klein reflection and leaves every finite nonzero phase unchanged',()=>{
  const state={displayDamping:true,displayDampingScale:120};
  for(const [sigma,t]of [[.3,14],[1.2,-80],[-12,400],[.5,1700]]){
    const raw=evaluatePolar(sigma,t,'xi',0,true),before=structuredClone(raw),shown=displayPolar(raw,sigma,t,state);
    assert.equal(gaussianLogWeight(sigma,t,120),gaussianLogWeight(1-sigma,t,120));
    assert.equal(shown.logAbs,raw.logAbs-((sigma-.5)**2+t*t)/14400);
    assert.equal(shown.arg,raw.arg);assert.equal(shown.q,raw.q);assert.deepEqual(raw,before);
    assert.equal(shown.sourceLogAbs,raw.logAbs);assert.equal(shown.displayOnly,true);
  }
});

test('zero, unsupported coordinates and the infinity display are kept distinct',()=>{
  const state={displayDamping:true,displayDampingScale:1};
  assert.equal(displayLogMagnitude(-Infinity,.5,14,state),-Infinity);
  assert.equal(displayVisibility(-Infinity),0);
  assert.ok(Number.isNaN(displayLogMagnitude(0,Infinity,0,state)));
  assert.ok(Number.isNaN(gaussianLogWeight(.5,0,0)));
  assert.equal(displayLogMagnitude(123,.5,50,{displayDamping:false}),123);
  assert.ok(displayVisibility(displayLogMagnitude(100,.5,100,state))<1e-100);
});

test('visual damping is excluded from the exact field and buffered heat cache identities',()=>{
  const base={geometry:'klein',projective:true,function:'xi',tau:0,resolution:'draft',extent:'extended',chartScale:24,torusR:2,bridgeA:.25,colorMode:'phase',vortices:false,ladder:false,packets:false,sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,heatStart:-.3,heatEnd:.5,heatFrames:9,playbackResolution:'draft'};
  const shown={...base,displayDamping:true,displayDampingScale:37};
  assert.equal(fieldKey(base),fieldKey(shown));assert.equal(sequenceKey(base),sequenceKey(shown));
});
