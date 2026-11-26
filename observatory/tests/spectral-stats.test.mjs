import test from 'node:test';
import assert from 'node:assert/strict';
import {symmetricEigen} from '../dist/nucleus-model.js';
import {ENSEMBLES,SPACING_DENSITIES,SPACING_LAWS,RATIO_DENSITIES,RATIO_LAWS,RATIO_MEANS,RATIO_SURMISE_MEANS,NUMBER_VARIANCE,unfoldLinear,unfoldZeros,spacingsOf,
  histogram,ksDistance,ksPValue,spacingRatios,meanAndError,numberVariance,porterThomas,normaliseWidths,relativeVariance,levelStatistics,widthStatistics,
  seededRandom,gaussian,sampleSpacings} from '../dist/spectral-stats.js';
import {ZETA_ZEROS_1000} from '../dist/rails-data.js';
import {NUCLIDES,NUCLIDE_IDS} from '../dist/nuclides-data.js';
import {U238_DATA} from '../dist/nucleus-data.js';
import {MODELS_ENUMS} from '../dist/models.js';

const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol,`${a} vs ${b} (tol ${tol})`);
const simpson=(f,a,b,n=2000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;};

test('reference laws are normalised, have unit mean spacing, and match their cumulative forms',()=>{
  for(const name of ENSEMBLES){
    close(simpson(SPACING_DENSITIES[name],0,30,6000),1,1e-6);
    close(simpson(s=>s*SPACING_DENSITIES[name](s),0,30,6000),1,1e-6);
    for(const s of [.3,1,2.2])close(simpson(SPACING_DENSITIES[name],0,s),SPACING_LAWS[name](s),2e-6);
    close(simpson(RATIO_DENSITIES[name],0,1),1,1e-9);
    for(const r of [.2,.5,.9])close(simpson(RATIO_DENSITIES[name],0,r),RATIO_LAWS[name](r),1e-7);
    close(simpson(r=>r*RATIO_DENSITIES[name](r),0,1),RATIO_SURMISE_MEANS[name],1e-8);
  }
  close(RATIO_SURMISE_MEANS.goe,.5359,1e-4);close(RATIO_SURMISE_MEANS.gue,.6027,1e-4);close(RATIO_MEANS.poisson,.38629,1e-5);
  // Porter–Thomas: χ² with one degree of freedom has mean 1, and 24.8 % of widths lie below a tenth of the mean.
  close(porterThomas(.1),.248,1e-3);close(porterThomas(0),0);assert.ok(porterThomas(30)>.9999);
  // Level repulsion: density vanishes at s = 0 for GOE (linearly) and GUE (quadratically), not for Poisson.
  close(SPACING_DENSITIES.goe(1e-3)/1e-3,Math.PI/2,1e-5);close(SPACING_DENSITIES.gue(1e-3)/1e-6,32/Math.PI**2,1e-4);close(SPACING_DENSITIES.poisson(0),1);
});

test('synthetic spacing samples are attributed to the law they were drawn from',()=>{
  for(const [k,name] of ENSEMBLES.entries()){
    const sample=sampleSpacings(name,4000,seededRandom(7+k)),mean=meanAndError(sample).mean;
    close(mean,1,.05);
    const d=Object.fromEntries(ENSEMBLES.map(law=>[law,ksDistance(sample,SPACING_LAWS[law])]));
    for(const other of ENSEMBLES)if(other!==name)assert.ok(d[name]<d[other],`${name}: ${JSON.stringify(d)}`);
    assert.ok(d[name]<.03);assert.ok(ksPValue(d[name],sample.length)>.01);
    for(const other of ENSEMBLES)if(other!==name)assert.ok(ksPValue(d[other],sample.length)<1e-6);
  }
  // With 99 spacings GOE and GUE are not separated: both are accepted for a GOE sample.
  const small=sampleSpacings('goe',99,seededRandom(5));
  assert.ok(ksPValue(ksDistance(small,SPACING_LAWS.goe),99)>.05);assert.ok(ksPValue(ksDistance(small,SPACING_LAWS.gue),99)>.01);
  assert.ok(ksPValue(ksDistance(small,SPACING_LAWS.poisson),99)<.01);
  close(ksPValue(0,10),1);assert.ok(ksPValue(.5,100)<1e-15);
});

/** Eigenvalues of a 3 × 3 Gaussian matrix: real symmetric (GOE) or Hermitian (GUE, via its 6 × 6 real form). */
function triple(kind,random){
  const g=()=>gaussian(random),n=3;
  const A=Array.from({length:n},()=>new Array(n).fill(0)),B=Array.from({length:n},()=>new Array(n).fill(0));
  for(let i=0;i<n;i++){A[i][i]=g()*Math.SQRT2;for(let j=i+1;j<n;j++){A[i][j]=A[j][i]=g();if(kind==='gue'){B[i][j]=g();B[j][i]=-B[i][j];}}}
  if(kind==='goe')return symmetricEigen(A).values;
  const M=Array.from({length:2*n},(_,i)=>Array.from({length:2*n},(_,j)=>i<n?(j<n?A[i][j]:-B[i][j-n]):(j<n?B[i-n][j]:A[i-n][j-n])));
  const values=symmetricEigen(M).values;return [values[0],values[2],values[4]];
}
test('spacing ratios of sampled 3 × 3 GOE and GUE matrices follow the surmise; Poisson levels follow 2/(1+r)²',()=>{
  for(const kind of ['goe','gue']){
    const random=seededRandom(kind==='goe'?21:22),ratios=[];
    for(let k=0;k<3000;k++){const e=triple(kind,random);ratios.push(...spacingRatios([e[1]-e[0],e[2]-e[1]]));}
    const d=Object.fromEntries(ENSEMBLES.map(law=>[law,ksDistance(ratios,RATIO_LAWS[law])]));
    for(const other of ENSEMBLES)if(other!==kind)assert.ok(d[kind]<d[other],`${kind}: ${JSON.stringify(d)}`);
    assert.ok(d[kind]<.03,`${kind}: ${d[kind]}`);close(meanAndError(ratios).mean,RATIO_SURMISE_MEANS[kind],.012);
  }
  const random=seededRandom(31);let x=0;const levels=Array.from({length:6000},()=>x+=-Math.log(1-random()));
  const stats=levelStatistics(unfoldLinear(levels));
  close(stats.ratioMean,RATIO_MEANS.poisson,.012);
  assert.ok(stats.fit.poisson.spacingKS<.03&&stats.fit.poisson.ratioKS<.03);
  assert.ok(Math.abs(stats.fit.poisson.ratioZ)<3);assert.ok(stats.fit.goe.ratioZ<-10&&stats.fit.gue.ratioZ<-10);
  // Number variance of independent levels grows as L; a picket fence has almost none.
  stats.Ls.forEach((L,i)=>assert.ok(Math.abs(stats.sigma2[i]/L-1)<.25,`Σ²(${L}) = ${stats.sigma2[i]}`));
  assert.ok(stats.fit.poisson.varianceRMS<stats.fit.goe.varianceRMS);
  const fence=Array.from({length:400},(_,i)=>i+.5);for(const L of [1.5,4,9.25])assert.ok(numberVariance(fence,L)<.26);
  close(numberVariance(fence,3),0,1e-12);
  assert.ok(NUMBER_VARIANCE.gue(10)<NUMBER_VARIANCE.goe(10)&&NUMBER_VARIANCE.goe(10)<NUMBER_VARIANCE.poisson(10));
});

test('Porter–Thomas widths are recognised, equal widths are not',()=>{
  const random=seededRandom(44),widths=Array.from({length:3000},()=>gaussian(random)**2*.37);
  const w=widthStatistics(widths);
  assert.ok(w.ks<.03);assert.ok(w.p>.01);close(w.relativeVariance,2,.25);close(w.belowTenth,.248,.03);
  const equal=widthStatistics(Array.from({length:500},(_,i)=>1+.01*Math.sin(i)));
  assert.ok(equal.ks>.6);assert.ok(equal.relativeVariance<1e-3);assert.equal(equal.belowTenth,0);
  close(meanAndError(normaliseWidths(widths)).mean,1,1e-12);close(relativeVariance([1,1,1]),0);
});

test('unfolding, spacings and histograms',()=>{
  const u=unfoldLinear([10,12,16,22]);assert.deepEqual(u,[0,.5,1.5,3]);
  assert.deepEqual(spacingsOf(u),[.5,1,1.5]);assert.deepEqual(spacingRatios([.5,1,1.5]),[.5,1/1.5]);
  const z=unfoldZeros(ZETA_ZEROS_1000);close(z[999]-z[0],999,1.5);
  const hist=histogram([.1,.2,1.4,2.9,7],3,3);assert.deepEqual(hist.density,[2/5,1/5,1/5]);
});

test('statistics of the measured resonances and of the zeros, as reported in the interface',()=>{
  const u=NUCLIDES.U238.resonances,stats=levelStatistics(unfoldLinear(u.energies));
  assert.equal(stats.levels,100);assert.equal(stats.spacings.length,99);
  // Both Wigner surmises are compatible with 99 spacings; Poisson is not.
  assert.ok(stats.fit.goe.spacingP>.05&&stats.fit.gue.spacingP>.05);assert.ok(stats.fit.poisson.spacingP<1e-3);
  assert.ok(stats.ratioMean>.45&&stats.ratioMean<.6);assert.ok(Math.abs(stats.fit.goe.ratioZ)<2);
  const widths=widthStatistics(u.gammaN.map((g,i)=>g/Math.sqrt(u.energies[i])));
  assert.ok(widths.ks<.1&&widths.p>.05);assert.ok(widths.relativeVariance>1.2&&widths.relativeVariance<2.8);
  const zeros=levelStatistics(unfoldZeros(ZETA_ZEROS_1000));
  assert.ok(zeros.fit.gue.spacingKS<zeros.fit.goe.spacingKS&&zeros.fit.goe.spacingKS<zeros.fit.poisson.spacingKS);
  assert.ok(zeros.ratioMean>.59&&zeros.ratioMean<.64);
  // The low zeros are more rigid than GUE at long range (saturation by the primes).
  assert.ok(zeros.sigma2.at(-1)<NUMBER_VARIANCE.gue(zeros.Ls.at(-1)));
});

test('nuclide data: consistent, sourced, and empty where no evaluated value exists',()=>{
  assert.deepEqual([...NUCLIDE_IDS].sort(),[...MODELS_ENUMS.nucleus].sort());
  for(const n of Object.values(NUCLIDES)){
    assert.equal(n.A,n.Z+n.N,n.id);assert.ok(n.halfLife.seconds>0&&n.halfLife.text&&n.halfLife.evaluation);
    assert.ok(n.decay.length>=1&&n.decay[0].mode==='A');assert.ok(n.bindingPerNucleon.keV>7000&&n.bindingPerNucleon.keV<7700);
    assert.ok(n.notes.length>=1);
    if(n.beta2)for(const key of ['raman2001','pritychenko2016']){assert.ok(n.beta2[key][0]>.2&&n.beta2[key][0]<.35);assert.ok(n.beta2[key][1]>0);}
    if(n.barriers)assert.ok(n.barriers.inner>4&&n.barriers.inner<7&&n.barriers.outer>4&&n.barriers.outer<7);
    const r=n.resonances;
    if(r?.energies){
      assert.equal(r.energies.length,r.gammaN.length);assert.ok(r.energies.length<=100&&r.energies.length<=r.count);
      for(let i=0;i<r.energies.length;i++){assert.ok(r.gammaN[i]>0);if(i)assert.ok(r.energies[i]>r.energies[i-1]);}
      assert.ok(r.energies[0]>0&&r.energies.at(-1)<=r.rangeEV[1]);
      // Even-even target only.
      assert.equal(r.targetSpin,0);assert.equal(n.Z%2+n.N%2,0);
    }
  }
  // Fields without an evaluated source are empty, not filled in.
  assert.equal(NUCLIDES.Og294.beta2,null);assert.equal(NUCLIDES.Og294.barriers,null);assert.equal(NUCLIDES.Og294.resonances,null);
  assert.equal(NUCLIDES.U235.beta2,null);assert.equal(NUCLIDES.U235.resonances.energies,undefined);assert.equal(NUCLIDES.U235.resonances.statistics,false);
  assert.equal(NUCLIDES.Cf252.barriers,null);assert.equal(NUCLIDES.Pu244.resonances.statistics,false);
  assert.ok(NUCLIDES.Og294.bindingPerNucleon.systematics);
  // The uranium list is the one the branch already shipped, now with widths.
  assert.deepEqual(NUCLIDES.U238.resonances.energies,[...U238_DATA.resonances]);
  assert.deepEqual([NUCLIDES.U238.barriers.inner,NUCLIDES.U238.barriers.outer],[U238_DATA.fissionBarriers.inner,U238_DATA.fissionBarriers.outer]);
  assert.equal(NUCLIDES.U238.beta2.raman2001[0],U238_DATA.beta2);assert.equal(NUCLIDES.U238.d0.eV,U238_DATA.evaluatedD0);
});
