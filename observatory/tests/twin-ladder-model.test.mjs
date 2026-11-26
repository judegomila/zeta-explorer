import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluatePolar} from '../dist/math.js';
import {LADDER_PRIMES,ladderConfig,armDamping,ladderRungs,armSum,armWalk,packetValue,packetMagnitude,heightScan,finiteBalance,bridgeBalance,armTotals} from '../dist/twin-ladder-model.js';

const close=(a,b,tol=1e-12)=>assert.ok(Math.abs(a-b)<=tol,`${a} vs ${b}`);
const xi=(sigma,t)=>evaluatePolar(sigma,t,'xi',0);

test('the default ladder reproduces the packet of the main view exactly',()=>{
  // Independent copy of the formula in app.js: p ≤ 19, m = 1, 2, log p weights.
  const reference=(ell,T,sigma,dual,h)=>{let re=0,im=0;for(const p of [2,3,5,7,11,13,17,19])for(let m=1;m<=2;m++){
    const l=m*Math.log(p),amp=Math.log(p)*Math.exp(-sigma*l-(ell-l)**2/(2*h*h)),ph=(dual?1:-1)*T*l;re+=amp*Math.cos(ph);im+=amp*Math.sin(ph);}return Math.hypot(re,im);};
  const rungs=ladderRungs({});
  assert.equal(rungs.length,16);
  for(const [ell,T] of [[0,0],[1.3,7.7],[2.9,14.134725],[5.5,33.1]]){
    close(packetMagnitude(rungs,ell,T,'direct',.35),reference(ell,T,.75,false,.35));
    close(packetMagnitude(rungs,ell,T,'dual',.35),reference(ell,T,.25,true,.35));
  }
});

test('arm damping is c ± a and rungs are ordered by log-length',()=>{
  assert.deepEqual(armDamping({centre:.5,offset:.25}),{direct:.75,dual:.25});
  assert.deepEqual(armDamping({centre:.8,offset:0}),{direct:.8,dual:.8});
  const rungs=ladderRungs({primes:12,rungs:5});
  assert.equal(rungs.length,60);
  for(let i=1;i<rungs.length;i++)assert.ok(rungs[i].ell>=rungs[i-1].ell);
  for(const r of rungs){close(r.ell,r.m*Math.log(r.p));close(r.direct,Math.log(r.p)*r.p**(-.75*r.m),1e-14);close(r.dual,Math.log(r.p)*r.p**(-.25*r.m),1e-14);}
});

test('the T = 0 sum is the truncated geometric series of the research module',()=>{
  // src/math/twin-ladder.js, check 6: Σ_{m=0..5} 2^(−m/2) = 0.875/(1 − 2^(−1/2)). Here m starts at 1.
  const rungs=ladderRungs({centre:.5,offset:0,primes:1,rungs:5,weight:'unit'});
  const expected=.875/(1-Math.SQRT1_2)-1;
  close(armSum(rungs,0,'direct').re,expected,1e-12);close(armSum(rungs,0,'direct').im,0);
  close(armSum(rungs,0,'dual').abs,expected,1e-12);
});

test('thermal weights are exp(−βx − Px²) and only suppress',()=>{
  const plain=ladderRungs({primes:6,rungs:3}),weighted=ladderRungs({primes:6,rungs:3,beta:.7,pressure:.2});
  weighted.forEach((r,i)=>{close(r.thermal,Math.exp(-.7*r.ell-.2*r.ell*r.ell),1e-15);assert.ok(r.direct<plain[i].direct);close(r.direct/plain[i].direct,r.thermal,1e-12);});
});

test('with zero offset the two arms are complex conjugates',()=>{
  const rungs=ladderRungs({centre:.6,offset:0,primes:10,rungs:3});
  for(const T of [0,3.3,14.134725,41]){
    const a=armSum(rungs,T,'direct'),b=armSum(rungs,T,'dual');
    close(a.re,b.re);close(a.im,-b.im);close(finiteBalance(rungs,T),0);
  }
});

test('the walk ends at the arm sum and the packet tends to it for a wide window',()=>{
  const rungs=ladderRungs({primes:9,rungs:2});
  const walk=armWalk(rungs,9.5,'dual'),sum=armSum(rungs,9.5,'dual');
  assert.equal(walk.length,rungs.length+1);assert.deepEqual(walk[0],{re:0,im:0});
  close(walk.at(-1).re,sum.re);close(walk.at(-1).im,sum.im);
  const wide=packetValue(rungs,2,9.5,'dual',1e6);close(wide.re,sum.re,1e-9);close(wide.im,sum.im,1e-9);
});

test('the bare arms have no balanced centre, the completed bridge has exactly one at ½',()=>{
  for(const T of [5,14.134725,20,33.3])for(const a of [.05,.25,.6]){
    assert.equal(bridgeBalance(xi,.5,a,T),0,'|ξ(½+a+iT)| = |ξ(½−a+iT)|');
    const up=bridgeBalance(xi,.62,a,T),down=bridgeBalance(xi,.38,a,T);
    assert.ok(Math.abs(up)>1e-6);close(up,-down,1e-9);
  }
  // Total weights: the direct arm is the more damped one at every centre.
  for(const centre of [0,.25,.5,.75,1,1.5]){const t=armTotals(ladderRungs({centre,offset:.25,primes:12,rungs:3}));assert.ok(t.ratio<1);}
  assert.ok(Number.isNaN(bridgeBalance(()=>({valid:false}),.5,.1,3)));
});

test('configuration is clamped and the scan matches direct evaluation',()=>{
  const c=ladderConfig({centre:9,offset:-1,primes:999,rungs:0,beta:NaN,weight:'other'});
  assert.deepEqual(c,{centre:2,offset:0,primes:LADDER_PRIMES.length,rungs:1,beta:0,pressure:0,width:.35,weight:'mangoldt'});
  const rungs=ladderRungs({}),scan=heightScan(rungs,'direct',0,90,90);
  assert.equal(scan.length,91);close(scan[14],armSum(rungs,14,'direct').abs);
  assert.ok(scan.every(Number.isFinite));
});
