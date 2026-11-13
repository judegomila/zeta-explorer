import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluatePolar,numericalDomain,heatDiagnostic,hardyZ,zeta,xi} from '../dist/math.js';
const extended=JSON.parse(readFileSync(new URL('./math-extended-reference.json',import.meta.url))).points;
const heat=JSON.parse(readFileSync(new URL('./math-heat-extended-reference.json',import.meta.url))).points;
const phaseError=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
const relativeError=(a,b)=>Math.hypot(a.re-b.re,a.im-b.im)/Math.max(1,Math.hypot(b.re,b.im));

test('extended zeta and xi log-polar values and derivatives match 90-digit references',()=>{
 for(const p of extended)for(const kind of ['zeta','xi']){
  const a=evaluatePolar(p.sigma,p.t,kind,0,true),b=p[kind],at=`${kind}(${p.sigma},${p.t})`;
  assert.equal(a.valid,true,at);
  if(b.zero){assert.equal(a.logAbs,-Infinity,at);assert.equal(a.status,'zero');continue;}
  assert.ok(Math.abs(a.logAbs-b.logAbs)<2e-10,`${at} log magnitude`);
  assert.ok(phaseError(a.arg,b.arg)<2e-10,`${at} phase`);
  assert.ok(relativeError(a.q,b.q)<2e-10,`${at} analytic q`);
  assert.ok(Math.abs(a.derivativeLogAbs-b.derivativeLogAbs)<2e-10,`${at} derivative log magnitude`);
 }
});
test('extended heat matches independent 90-digit 80-node convolution references',()=>{
 for(const p of heat){const a=evaluatePolar(p.sigma,p.t,'heat',p.tau,true),at=`F(${p.sigma},${p.t},${p.tau})`;
  assert.equal(a.valid,true,at);
  assert.ok(Math.abs(a.logAbs-p.logAbs)<3e-10,`${at} log magnitude`);
  assert.ok(phaseError(a.arg,p.arg)<3e-10,`${at} phase`);
  if(p.q)assert.ok(relativeError(a.q,p.q)<3e-10,`${at} analytic q`);
 }
});
test('underflow and overflow preserve geometry data while raw exports are flagged',()=>{
 const under=evaluatePolar(.5,2000,'xi',0,true),over=evaluatePolar(-128,2000,'zeta',0,true);
 assert.equal(under.valid,true);assert.equal(under.rawRepresentable,false);assert.equal(under.status,'underflow');
 assert.ok(under.logAbs < -1500);assert.ok(Number.isFinite(under.q.re));assert.ok(Number.isFinite(under.q.im));
 assert.equal(over.valid,true);assert.equal(over.rawRepresentable,false);assert.equal(over.status,'overflow');
 assert.ok(over.logAbs>Math.log(Number.MAX_VALUE));assert.ok(Number.isFinite(over.arg));assert.ok(Number.isFinite(over.q.re));
 assert.equal(Math.abs(xi(.5,2000).re),0);assert.equal(Math.abs(zeta(-128,2000).re),Infinity);
});
test('Hardy Z remains accurate above the former complex Gamma overflow threshold',()=>{
 for(const p of extended)if(p.hardyZ!==null&&p.hardyZ!==undefined){
  assert.ok(Math.abs(hardyZ(p.t)-p.hardyZ)<3e-10*Math.max(1,Math.abs(p.hardyZ)),`Hardy Z(${p.t})`);
 }
});
test('domains are explicit and refined heat checks still work below raw underflow',()=>{
 for(const kind of ['zeta','xi','heat']){const d=numericalDomain(kind);assert.equal(d.sigmaMin,-128);assert.equal(d.sigmaMax,129);assert.equal(d.tMax,2000);}
 assert.equal(evaluatePolar(130,0).valid,false);assert.equal(evaluatePolar(.5,2001).valid,false);
 assert.equal(evaluatePolar(.5,40,'heat',1.001).valid,false);
 const check=heatDiagnostic(.5,2000,-1);
 assert.ok(check.relativeGridDiscrepancy<2e-10);assert.ok(check.logAbs < -1500);assert.equal(check.certified,false);
});
