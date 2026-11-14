import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleField } from '../dist/sampler.js';
import { evaluatePolar } from '../dist/math.js';

test('the surface shear color uses the derivative of the displayed completed field and its reflection sign',()=>{
 const state={geometry:'plane',function:'xi',resolution:'draft',extent:'core',colorMode:'shear',sigmaMin:.1,sigmaMax:.9,tMin:13.7,tMax:14.5,tau:0,bridgeA:.25};
 const data=sampleField(state);
 let checked=0;
 for(let k=0;k<data.valid.length;k+=97){
  if(!data.valid[k])continue;
  const sigma=data.coords[2*k],t=data.coords[2*k+1],p=evaluatePolar(sigma,t,'xi',0,true);
  assert.ok(Math.abs(data.bridge[k]-Math.tanh(p.q.re))<7e-8);
  const reflected=evaluatePolar(1-sigma,t,'xi',0,true);
  assert.ok(Math.abs(Math.tanh(p.q.re)+Math.tanh(reflected.q.re))<1e-9);
  checked++;
 }
 assert.ok(checked>25);
});
