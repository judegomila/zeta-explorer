import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluatePolar} from '../dist/math.js';
import {railsConfig,mangoldtTable,logSmoothFactor,railPoint,timeDelay,delayParts,primeDelaySeries,railScan,delayPositivity,overlap,
  varianceSeries,primeJitter,varianceExpansion,varianceDirect,primeJitterDirect,heightLog,roundedVariance,truncatedVariance,measuredDelayVariance,
  ZETA_MINUS_ONE,jitterConstant,regularisedLadderSum,sawtooth,bernoulli2,hurwitzMinusOne,jitterEnergy,ladderEnergyFrom,rungEnergyMean,railRungs,
  vacuumBalance,ONE_POINT_TABLE,VARIANCE_REFERENCE,LIMITING_THICKNESS} from '../dist/rails-model.js';
import {RAILS_TABLE,V_EXPANSION,ZETA_ZEROS_1000} from '../dist/rails-data.js';
import {seededRandom} from '../dist/spectral-stats.js';

const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol,`${a} vs ${b} (tol ${tol})`);
const rel=(a,b,tol)=>assert.ok(Math.abs(a-b)<=tol*Math.abs(b),`${a} vs ${b} (rel ${tol})`);

test('rails are the real and imaginary parts of ξ on the line ½ + a, with no scaling',()=>{
  for(const [a,t] of [[.5,14.2],[.25,30],[1.5,47.3],[.05,21]]){
    const p=railPoint(a,t),x=evaluatePolar(.5+a,t,'xi');
    assert.equal(p.A,x.re);assert.equal(p.B,x.im);
    close(p.ratio,x.im/x.re,1e-9*Math.abs(x.im/x.re));
    // The display scaling is positive and common to both rails: ratio and phase are unchanged.
    rel(p.scaledB/p.scaledA,p.B/p.A,1e-10);assert.ok(p.scaledA*p.A>0);
    close(Math.hypot(p.scaledA,p.scaledB),Math.exp(evaluatePolar(.5+a,t,'zeta').logAbs),1e-9);
    close(Math.log(Math.hypot(p.A,p.B)),p.logAbs,1e-9);close(logSmoothFactor(.5+a,t),p.logAbs-evaluatePolar(.5+a,t,'zeta').logAbs,1e-9);
  }
});

test('functional-equation symmetries: A_a is even and B_a odd, in t and in a',()=>{
  for(const [a,t] of [[.5,14.2],[.3,25.7],[1,40]]){
    const p=railPoint(a,t),flipT=railPoint(a,-t);
    rel(flipT.A,p.A,1e-10);rel(flipT.B,-p.B,1e-10);
    // ξ(½ − a + it) is the complex conjugate of ξ(½ + a + it).
    const lo=evaluatePolar(.5-a,t,'xi');
    rel(lo.re,p.A,1e-9);rel(lo.im,-p.B,1e-9);
    // Hence |ξ| agrees on the two lines and the delay is odd in a.
    close(lo.logAbs,p.logAbs,1e-9);
    rel(2*evaluatePolar(.5-a,t,'xi',0,true).q.re,-p.delay,1e-8);
  }
  // At a = 0 the odd rail vanishes: ξ is real on the critical line.
  const on=evaluatePolar(.5,20,'xi');assert.ok(Math.abs(on.im)<1e-12*Math.abs(on.re));
});

test('the time delay is twice the derivative of the phase',()=>{
  for(const [a,t] of [[.5,17],[.2,33.3],[1.2,60]]){
    const h=1e-4,d=(evaluatePolar(.5+a,t+h,'xi').arg-evaluatePolar(.5+a,t-h,'xi').arg)/(2*h);
    close(timeDelay(a,t),2*d,2e-6);
    const parts=delayParts(a,t);close(parts.smooth+parts.fluct,parts.delay,1e-12);
    close(parts.fluct,2*evaluatePolar(.5+a,t,'zeta',0,true).q.re,1e-12);
  }
  // Value quoted in the source: 2φ′ = 1.864963343 at a = 1.5, t = 30.
  close(timeDelay(1.5,30),1.864963343,2e-9);
  // First poles and reduced widths at a = ½: t = 13.98838070, w = 0.533237.
  close(Math.cos(evaluatePolar(1,13.98838070,'xi').arg),0,1e-7);close(2/timeDelay(.5,13.98838070),.533237,1e-6);
});

test('the prime series converges to the exact delay for a > ½ and not below',()=>{
  const error=(a,t,N)=>Math.abs(delayParts(a,t).fluct-primeDelaySeries(a,t,N));
  assert.ok(error(1.5,30,20000)<1e-4);assert.ok(error(1.5,30,20000)<error(1.5,30,200));
  assert.ok(error(1,45.5,20000)<5e-3);
  assert.ok(error(.1,45.5,20000)>.5,'no convergence at a = 0.1');
  assert.equal(LIMITING_THICKNESS,.5);
  const table=mangoldtTable(30);
  assert.deepEqual(table.map(r=>r[0]),[2,3,4,5,7,8,9,11,13,16,17,19,23,25,27,29]);
  close(table[2][1],Math.log(2));close(table[6][1],Math.log(3));
});

test('a scan samples the rails and reports the inequality τ > 0 on its samples',()=>{
  const scan=railScan({a:.5,t0:10,span:40,terms:200},400);
  assert.equal(scan.t.length,401);close(scan.t[0],10);close(scan.t[400],50);
  const pos=delayPositivity(scan.delay);
  assert.equal(pos.holds,true);assert.equal(pos.negative,0);assert.ok(pos.min>0);
  // The phase is continuous: it advances by π between consecutive zeros of one rail.
  for(let i=1;i<scan.phase.length;i++)assert.ok(Math.abs(scan.phase[i]-scan.phase[i-1])<1);
  assert.ok(scan.phase[400]-scan.phase[0]>5*Math.PI);
  // A window with a negative sample is reported as such.
  assert.deepEqual(delayPositivity(Float64Array.of(1,-.5,2)),{min:-.5,index:1,negative:1,samples:3,holds:false});
  close(overlap(.5,3364.6),1,1e-4);
  const cfg=railsConfig({a:9,t0:-4,span:1e9,terms:3.7});
  assert.deepEqual(cfg,{a:3,t0:0,span:400,terms:4});
});

test('V(a) agrees with direct summation, with the source values, and with its expansion',()=>{
  // Table entries recomputed in JavaScript: prime powers up to 2·10⁵ plus the integral tail.
  for(const a of [.5,.75,1,1.5,2,3])rel(varianceDirect(a),varianceSeries(a),a>=1?2e-6:2e-4);
  rel(varianceDirect(.25),varianceSeries(.25),2e-3);
  close(varianceSeries(.5),.40260491011420701,1e-13);close(varianceSeries(1),.080242019551761946,1e-14);
  close(varianceSeries(.25),1.7957112919162996,1e-12);close(varianceSeries(.01),1249.2704311413671,1e-9);
  // Expansion 1/(8a²) + V0 + V1 a at small a.
  assert.equal(V_EXPANSION.V0,-.786575535662477614);assert.equal(V_EXPANSION.V1,6.02404097319776);
  let previous=Infinity;
  for(const a of [.04,.02,.01,.005]){const d=Math.abs(varianceSeries(a)-varianceExpansion(a));assert.ok(d<previous);previous=d;assert.ok(d<40*a*a,`a=${a}: ${d}`);}
  rel(8*.005**2*varianceSeries(.005),1,1e-3);
  // Interpolation between table rows keeps the double pole exact.
  rel(varianceSeries(.0125),(varianceSeries(.01)+varianceSeries(.015))/2-(1/(8*.01**2)+1/(8*.015**2))/2+1/(8*.0125**2),1e-12);
  assert.ok(Number.isNaN(varianceSeries(.001)));assert.ok(Number.isNaN(varianceSeries(4)));
  assert.ok(RAILS_TABLE.length>100);for(let i=1;i<RAILS_TABLE.length;i++){assert.ok(RAILS_TABLE[i][0]>RAILS_TABLE[i-1][0]);assert.ok(RAILS_TABLE[i][1]<RAILS_TABLE[i-1][1]);}
});

test('measured variance of the delay follows 4V(a) above the crossover and the rounded form below it',()=>{
  const high=measuredDelayVariance(1,1000,200,.1);
  rel(high.variance,4*varianceSeries(1),.03);
  rel(high.mean,Math.log(1100/(2*Math.PI)),.01);
  const L=heightLog(1100),low=measuredDelayVariance(.05,1000,200,.05),round=roundedVariance(.05,L);
  assert.ok(low.variance<.75*round.infinite,'rounded well below the infinite-height value');
  rel(low.variance,round.rounded,.2);
  // The rounded form reduces to L/a − L² for a ≪ 1/L, and to 1/(2a²) for a ≫ 1/L.
  const tiny=roundedVariance(.002,L);rel(tiny.rounded,tiny.smallA,.01);close(tiny.crossover,1/(2*L));
  rel(roundedVariance(2,L).rounded,1/8,1e-6);
  rel(truncatedVariance(.5,1100),4*varianceSeries(.5),.02);
  // Reference rows from the source obey the same ordering: measured < 4V for small a.
  for(const ref of VARIANCE_REFERENCE)for(const [a,v] of ref.rows)if(a<=.1)assert.ok(v<4*varianceSeries(a));
});

test('the perfect ladder: ζ(−1) = −1/12 and the jitter constant ζ(2)/(2π²) = +1/12',()=>{
  assert.equal(ZETA_MINUS_ONE,-1/12);
  close(jitterConstant(),1/12,1e-13);close(jitterConstant(50),1/12,1e-9);
  close(ZETA_MINUS_ONE+jitterConstant(),0,1e-13);
  // Regularised sum of n: direct summation against the closed form, and its limit.
  for(const eps of [.5,.1,.02]){let sum=0;for(let n=1;n<60/eps;n++)sum+=n*Math.exp(-eps*n);close(sum-1/(eps*eps),regularisedLadderSum(eps),1e-8);}
  close(regularisedLadderSum(1e-2),-1/12,1e-6);close(regularisedLadderSum(1e-4),-1/12,1e-9);
  // Mean square of the sawtooth.
  let m2=0;const n=20000;for(let i=0;i<n;i++)m2+=sawtooth((i+.5)/n)**2;close(m2/n,1/12,1e-8);
  // Shifted ladders: ζ(−1, α) = −½ B₂(α); α = 1 is the ladder itself, and B₂(¼) = B₂(¾) = −1/48.
  close(hurwitzMinusOne(1),-1/12);close(hurwitzMinusOne(.5),1/24);close(bernoulli2(.25),bernoulli2(.75));close(-2*hurwitzMinusOne(.25),-1/48);
});

test('two-point balance: energy seen from the rungs equals minus the jitter energy, for any point set',()=>{
  const ladder=Array.from({length:30},(_,i)=>i);
  close(jitterEnergy(ladder),1/12,1e-12);
  close(rungEnergyMean(ladder,.01),-1/12,1e-5);close(ladderEnergyFrom(ladder,0,.01),-1/12,1e-5);
  // From the midpoint between rungs the one-point energy is +1/24: it depends on the origin.
  close(ladderEnergyFrom(ladder,.5,.01),1/24,1e-5);
  const random=seededRandom(11);
  for(const size of [12,25]){
    const points=Array.from({length:size},()=>random()*size),J=jitterEnergy(points);
    assert.ok(J>1/12);
    close(rungEnergyMean(points,2e-3),-J,2e-3*Math.max(1,J));
    // The one-point energy from an arbitrary origin is not −J.
    assert.ok(Math.abs(ladderEnergyFrom(points,.123,2e-3)+J)>1e-3);
  }
  // A quasi-periodically displaced ladder.
  const displaced=ladder.map(n=>n+.2*Math.sin(2*Math.PI*n/5)),J=jitterEnergy(displaced);
  close(J,1/12+.2*.2/2,1e-9);close(rungEnergyMean(displaced,2e-3),-J,1e-4);
});

test('prime term v_a and the stated balance ζ(−1) − v_a',()=>{
  close(primeJitter(1),.0090819039,1e-10);close(primeJitter(2),.0018241297,1e-10);close(primeJitter(3),.0004204422,1e-10);
  for(const a of [.5,1,2])rel(primeJitterDirect(a),primeJitter(a),a>=1?1e-6:2e-3);
  const on=vacuumBalance(1,true),off=vacuumBalance(1,false);
  close(on.twoPoint,-1/12-.0090819039,1e-10);close(on.twoPoint,-.092415237,1e-9);close(on.twoPoint+on.jitter,0,1e-15);
  assert.equal(off.prime,0);close(off.twoPoint,-1/12);close(off.jitter,1/12);
  // The source's one-point energies differ from what a one-point balance would require.
  for(const r of ONE_POINT_TABLE){assert.ok(Math.abs(r.value-r.balance)>.03);close(r.balance,(r.rail==='B'?-1/12:1/24)-primeJitter(r.a),1e-9);}
});

test('rungs of the odd rail are a unit ladder displaced by −(1/π) arg ζ',()=>{
  const {rungs,meanSquare}=railRungs(1,100,150,.04);
  assert.ok(rungs.length>70);
  for(let i=1;i<rungs.length;i++){assert.equal(rungs[i].index,rungs[i-1].index+1);assert.ok(rungs[i].t>rungs[i-1].t);}
  for(const r of rungs.slice(0,10)){
    // B_a vanishes at the rung, and the displacement is the phase of ζ there.
    assert.ok(Math.abs(Math.sin(evaluatePolar(1.5,r.t,'xi').arg))<2e-3);
    close(r.delta,-evaluatePolar(1.5,r.t,'zeta').arg/Math.PI,2e-3);close(r.u,r.index+r.delta,1e-12);
  }
  rel(meanSquare,primeJitter(1),.15);
});

test('the zero table is ascending and starts at the known ordinates',()=>{
  assert.equal(ZETA_ZEROS_1000.length,1000);close(ZETA_ZEROS_1000[0],14.134725141735,1e-9);close(ZETA_ZEROS_1000[999],1419.422480946,1e-8);
  for(let i=1;i<1000;i++)assert.ok(ZETA_ZEROS_1000[i]>ZETA_ZEROS_1000[i-1]);
  for(const i of [0,7,100,640])assert.ok(evaluatePolar(.5,ZETA_ZEROS_1000[i],'zeta').logAbs<-14);
});
