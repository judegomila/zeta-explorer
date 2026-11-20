import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {zeta,xi,heatXi,derivative,evaluate,hardyZ,displayScale,heatDiagnostic,thetaPhi,ZERO_HEIGHTS,NUMERICS} from '../dist/math.js';
const references=JSON.parse(readFileSync(new URL('./reference.json',import.meta.url),'utf8'));
const abs=z=>Math.hypot(z.re,z.im);
const error=(a,b)=>Math.hypot(a.re-b.re,a.im-b.im);
function close(a,b,tol,message){assert.ok(error(a,b)<=tol,`${message}; error ${error(a,b)}, tolerance ${tol}`);}

test('analytic continuation agrees with independent 80-digit mpmath samples',()=>{
 for(const p of references.points){
  close(zeta(p.sigma,p.t),p.zeta,3e-12*Math.max(1,abs(p.zeta)),`zeta(${p.sigma}+${p.t}i)`);
  close(xi(p.sigma,p.t),p.xi,4e-12*Math.max(abs(p.xi),1/displayScale(p.t)),`xi(${p.sigma}+${p.t}i)`);
 }
});
test('analytic derivatives agree with independent 80-digit derivatives',()=>{
 for(const p of references.points){
  close(derivative(p.sigma,p.t,'zeta'),p.zetaDerivative,5e-12*Math.max(1,abs(p.zetaDerivative)),`zeta prime(${p.sigma},${p.t})`);
  close(derivative(p.sigma,p.t,'xi'),p.xiDerivative,5e-12*Math.max(abs(p.xiDerivative),1/displayScale(p.t)),`xi prime(${p.sigma},${p.t})`);
 }
});
test('shifted heat integral agrees with independent unshifted 80-digit quadrature',()=>{
 for(const p of references.heat){
  const scale=Math.max(abs(p.heat),1/displayScale(p.t));
  close(heatXi(p.sigma,p.t,p.tau),p.heat,5e-12*scale,`heat(${p.sigma},${p.t},${p.tau})`);
  close(derivative(p.sigma,p.t,'heat',p.tau),p.derivative,8e-12*Math.max(abs(p.derivative),scale),`heat derivative(${p.sigma},${p.t},${p.tau})`);
 }
});
test('heat tau zero reproduces xi across large and small ordinates',()=>{
 for(const sigma of [-12,-4,.13,.5,.87,2,5,13])for(const t of [0,14.13,16,16.0001,21,40,40.0001,60,80,80.0001,120]){
  const a=xi(sigma,t),b=heatXi(sigma,t,0);
  close(a,b,6e-12*Math.max(abs(a),1/displayScale(t)),`normalization (${sigma},${t})`);
 }
});
test('symmetry and conjugation hold without imposed root placement',()=>{
 for(const kind of ['xi','heat'])for(const [s,t] of [[.13,17.3],[-3.4,32.6],[3.9,60]]){
  const a=evaluate(s,t,kind,.7),b=evaluate(1-s,-t,kind,.7),c=evaluate(s,-t,kind,.7);
  close(a,b,1e-13*Math.max(abs(a),1e-300),'functional symmetry');
  close(a,{re:c.re,im:-c.im},1e-13*Math.max(abs(a),1e-300),'conjugation');
 }
});
test('finite-difference PDE uses classical de Bruijn–Newman time, including factor one quarter',()=>{
 const sigma=.73,t=21.4,tau=.21,ht=2e-4,hs=1e-3;
 const fp=heatXi(sigma,t,tau+ht),fm=heatXi(sigma,t,tau-ht),dt={re:(fp.re-fm.re)/(2*ht),im:(fp.im-fm.im)/(2*ht)};
 const f=heatXi(sigma,t,tau),a=heatXi(sigma+hs,t,tau),b=heatXi(sigma-hs,t,tau);
 const ds2={re:(a.re-2*f.re+b.re)/(4*hs*hs),im:(a.im-2*f.im+b.im)/(4*hs*hs)};
 close(dt,ds2,3e-7*Math.max(abs(dt),1e-20),'partial_tau=quarter partial_sigma_sigma');
});
test('known pole and entire-function removable singularities are explicit',()=>{
 assert.equal(zeta(1,0).re,Infinity);
 assert.equal(xi(0,0).re,.5);
 assert.equal(xi(1,0).re,.5);
 close(zeta(0,0),{re:-.5,im:0},2e-14,'zeta(0)');
 close(zeta(-1,0),{re:-1/12,im:0},2e-14,'zeta(-1)');
 close(zeta(2,0),{re:Math.PI**2/6,im:0},2e-14,'zeta(2)');
});
test('reference zeros are small but neighbouring off-line values are not coerced to zero',()=>{
 for(const t of ZERO_HEIGHTS){
  assert.ok(abs(zeta(.5,t))<3e-12,`reference zero at ${t}`);
  assert.ok(abs(zeta(.51,t))>1e-4,`off-line point at ${t}`);
  assert.ok(Math.abs(hardyZ(t))<3e-12,`Hardy Z at ${t}`);
 }
});
test('heat convergence diagnostics and positive theta kernel are available',()=>{
 for(const u of [0,.1,.3,.5,.8])assert.ok(thetaPhi(u)>0);
 const d=heatDiagnostic(.34,57,.6);
 assert.ok(d.relativeGridDiscrepancy<1e-10);
 assert.equal(d.certified,false);
 assert.equal(NUMERICS.certified,false);
});
