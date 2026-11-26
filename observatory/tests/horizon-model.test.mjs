import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluatePolar} from '../dist/math.js';
import {SI,horizonConfig,schwarzschildRadius,hawkingTemperature,tolmanTemperature,localTemperature,localAcceleration,horizonEntropy,evaporationTime,infallTime,
  quasiNormalMode,asymptoticMode,BUCHDAHL,centralPressure,horizonNumbers,TEMPERATURE_MARKS,gammaPhase,gammaDelay,smoothDelay,gammaPole,resonancePoles,
  lorentzianDelay,transmission,railLevels,zeroCount,zeroExponent,horizonLogStates,DICTIONARY} from '../dist/horizon-model.js';
import {timeDelay} from '../dist/rails-model.js';
import {ZETA_ZEROS_1000} from '../dist/rails-data.js';

const rel=(a,b,tol)=>assert.ok(Math.abs(a-b)<=tol*Math.abs(b),`${a} vs ${b} (rel ${tol})`);
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol,`${a} vs ${b}`);

test('Schwarzschild numbers for one solar mass match the values quoted in the source',()=>{
  const M=SI.solarMass;
  rel(schwarzschildRadius(M),2953.25,1e-4);rel(hawkingTemperature(M),6.170e-8,1e-3);rel(horizonEntropy(M),1.0489e77,1e-3);
  rel(evaporationTime(M)/SI.year,2.10e67,5e-3);rel(infallTime(M),15.5e-6,5e-3);
  const q=quasiNormalMode(M);rel(q.frequency,12070,2e-3);rel(q.dampingTime,.0554e-3,2e-3);
  // Scaling laws.
  rel(hawkingTemperature(10*M),hawkingTemperature(M)/10,1e-12);rel(horizonEntropy(10*M),100*horizonEntropy(M),1e-12);
  rel(horizonLogStates(M),4.555e76,1e-3);
  close(asymptoticMode(0).im,-1/8);close(asymptoticMode(3).im-asymptoticMode(2).im,-1/4);
});

test('local temperature: mass-independent near the horizon, Hawking temperature far away',()=>{
  // Marks of the source: 1 MeV at 31.4 fm, 17.9 MeV at 1.75 fm, 156.5 MeV at 0.20 fm, 0.12 MeV at 256 fm.
  for(const m of TEMPERATURE_MARKS)rel(localTemperature(m.fm*SI.fm)*SI.kB/SI.MeV,m.MeV,.03);
  rel(localAcceleration(2e-15),SI.c**2/2e-15,1e-12);rel(localTemperature(1e-15),2*localTemperature(2e-15),1e-12);
  const M=SI.solarMass,rs=schwarzschildRadius(M);
  rel(tolmanTemperature(M,1e9),hawkingTemperature(M),1e-8);
  // Tolman's relation reduces to ħc/2πk_Bℓ with ℓ ≈ 2 r_s √(r/r_s − 1) the proper distance.
  const x=1+1e-8,ell=2*rs*Math.sqrt(x-1);rel(tolmanTemperature(M,x),localTemperature(ell),1e-6);
  const n=horizonNumbers({logMass:1,logDistance:0});rel(n.local,localTemperature(SI.fm),1e-12);rel(n.rs,10*rs,1e-12);rel(n.solarMasses,10,1e-12);
});

test('Buchdahl bound: the central pressure of a uniform star has a simple pole at R = 9/8 r_s',()=>{
  assert.equal(BUCHDAHL,9/8);assert.equal(centralPressure(9/8),Infinity);assert.equal(centralPressure(1.05),Infinity);
  // Residue 3/16 in R/r_s − 9/8, as stated in the source.
  for(const d of [1e-4,1e-5])rel(centralPressure(9/8+d)*d,3/16,20*d);
  assert.ok(centralPressure(3)>centralPressure(6));rel(centralPressure(1e6),.25e-6,1e-3);
  const c=horizonConfig({radius:0,logMass:99,a:-1,logDistance:1e9});assert.deepEqual(c,{logMass:10,a:.01,radius:1.13,logDistance:20});
  assert.ok(horizonNumbers({radius:1.13}).pressure>30);
});

test('the gamma factor carries the smooth delay; the zeros enter only through the two-rail function',()=>{
  // 2θ′(E) = log(E/2π) + O(1/E²).
  for(const E of [50,200,1500])close(gammaDelay(E),smoothDelay(E),2/(E*E)+1e-6);
  assert.ok(gammaDelay(3)<0,'negative at small E: the gamma factor alone is not passive');
  // Identity: S_even(E) = ζ(½ − iE)/ζ(½ + iE), so the phase of ζ on the line is −θ (mod π).
  for(const E of [5,17.3,40]){const d=evaluatePolar(.5,E,'zeta').arg+gammaPhase(E);close(Math.sin(d),0,1e-9);}
  assert.deepEqual([gammaPole(0),gammaPole(1),gammaPole(2)],[.5,2.5,4.5]);
  // τ_a is a sum of Lorentzians of half-width a at the zeros: the partial sum over 1000 zeros accounts for most of it.
  const a=.25,g1=ZETA_ZEROS_1000[0];
  rel(timeDelay(a,g1),8.0338,1e-4);
  const partial=lorentzianDelay(ZETA_ZEROS_1000,a,g1);assert.ok(partial>2/a&&partial<timeDelay(a,g1)+.05&&partial>timeDelay(a,g1)-.3);
  assert.deepEqual(resonancePoles([14,21],.3),[{re:14,im:-.3},{re:21,im:-.3}]);
  rel(transmission(.5,14.134725),.55,.02);rel(transmission(.5,1000),.99,.01);
});

test('levels and reduced widths of the two-rail system',()=>{
  const levels=railLevels(.5,10,22);
  // Values quoted in the source at a = ½.
  const t=[13.98838070,20.83154836,24.86637287,30.18680412],w=[.533237,.551629,.518458,.569904];
  assert.equal(levels.length,4);levels.forEach((l,i)=>{close(l.t,t[i],1e-6);close(l.width,w[i],1e-5);});
  // One level per zero of ζ in the window.
  const many=railLevels(.25,10,190,.05);assert.equal(many.length,ZETA_ZEROS_1000.filter(g=>g<200).length);
  for(const l of many)assert.ok(l.width>0&&l.width<.6);
});

test('counting laws and the dictionary with its refuted rows',()=>{
  close(zeroCount(83),22,1);assert.equal(zeroCount(1),0);rel(zeroExponent(6e5),1.096,.01);assert.ok(zeroExponent(1e22)<1.03);
  assert.equal(DICTIONARY.length,10);
  const verdicts=DICTIONARY.map(r=>r.verdict);
  assert.equal(verdicts.filter(v=>v==='adopted').length,3);assert.equal(verdicts.filter(v=>v==='fails').length,5);
  assert.ok(verdicts.includes('no relation')&&verdicts.includes('not adopted'));
  for(const r of DICTIONARY){assert.ok(r.zeta&&r.physical&&r.test);if(r.verdict==='adopted')assert.ok(r.scope,'an adopted analogy states its scope');}
  assert.equal(DICTIONARY.find(r=>r.physical==='Buchdahl limit').verdict,'fails');
});
