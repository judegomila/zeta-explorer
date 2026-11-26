/**
 * Spectral statistics used to compare a measured level sequence (s-wave
 * neutron resonances) and zeros of ζ with three reference laws: Poisson, and
 * the Wigner surmises for the Gaussian orthogonal (GOE) and unitary (GUE)
 * ensembles. Every goodness-of-fit number shown in the interface is computed
 * here from the data; none is typed in.
 *
 * Reference forms
 *   spacing density     Poisson e^(−s);  GOE (π/2) s e^(−πs²/4);  GUE (32/π²) s² e^(−4s²/π)
 *   spacing ratio       r = min(s_n, s_{n+1}) / max(s_n, s_{n+1})  (Oganesyan–Huse)
 *                       Poisson 2/(1+r)²;  surmise of Atas et al. for GOE and GUE
 *   number variance     Poisson L;  GOE (2/π²)[ln 2πL + γ + 1 − π²/8];  GUE (1/π²)[ln 2πL + γ + 1]
 *   reduced widths      Porter–Thomas: χ² with one degree of freedom, CDF erf(√(x/2))
 */
import { erf, SPACING_LAWS, ksDistance, smoothZeroCount } from './nucleus-model.js';

export { SPACING_LAWS, ksDistance };
export const ENSEMBLES=Object.freeze(['goe','gue','poisson']);
export const ENSEMBLE_LABELS=Object.freeze({goe:'GOE',gue:'GUE',poisson:'Poisson'});
const EULER=.5772156649015329;

/** Nearest-neighbour spacing densities at unit mean spacing. */
export const SPACING_DENSITIES=Object.freeze({
  poisson:s=>Math.exp(-s),
  goe:s=>Math.PI/2*s*Math.exp(-Math.PI*s*s/4),
  gue:s=>32/(Math.PI*Math.PI)*s*s*Math.exp(-4*s*s/Math.PI),
});

/** Positions at unit mean density for a sequence of constant level density. */
export function unfoldLinear(levels){
  const n=levels.length,mean=(levels[n-1]-levels[0])/(n-1);
  return levels.map(e=>(e-levels[0])/mean);
}
/** Positions of zero ordinates under the smooth counting function of ζ. */
export const unfoldZeros=heights=>heights.map(smoothZeroCount);
/** Consecutive differences, rescaled to unit mean. */
export function spacingsOf(unfolded){
  const s=[];for(let i=1;i<unfolded.length;i++)s.push(unfolded[i]-unfolded[i-1]);
  const mean=s.reduce((a,b)=>a+b,0)/s.length;return s.map(x=>x/mean);
}
/** Histogram as a density on [0, max]. */
export function histogram(sample,bins=12,max=3){
  const counts=new Array(bins).fill(0),width=max/bins;
  for(const x of sample)if(x>=0&&x<max)counts[Math.floor(x/width)]++;
  return {width,max,density:counts.map(c=>c/(sample.length*width))};
}

/**
 * Asymptotic Kolmogorov p-value for a distance d from n points, with
 * Stephens' finite-n correction. It assumes independent points and a law with
 * no fitted parameter; spacings are rescaled to unit mean and are correlated,
 * so the value is indicative only.
 */
export function ksPValue(d,n){
  if(!(d>0)||!(n>0))return 1;
  const x=(Math.sqrt(n)+.12+.11/Math.sqrt(n))*d;let sum=0;
  for(let k=1;k<=100;k++){const term=Math.exp(-2*k*k*x*x);sum+=(k%2?1:-1)*term;if(term<1e-12)break;}
  return Math.max(0,Math.min(1,2*sum));
}

// ---- spacing ratio -----------------------------------------------------------
export function spacingRatios(spacings){
  const r=[];
  for(let i=1;i<spacings.length;i++){const a=spacings[i-1],b=spacings[i],hi=Math.max(a,b);if(hi>0)r.push(Math.min(a,b)/hi);}
  return r;
}
/** Densities of r on [0, 1]. */
export const RATIO_DENSITIES=Object.freeze({
  poisson:r=>2/((1+r)*(1+r)),
  goe:r=>27/4*(r+r*r)/Math.pow(1+r+r*r,2.5),
  gue:r=>81*Math.sqrt(3)/(2*Math.PI)*(r+r*r)**2/Math.pow(1+r+r*r,4),
});
function integrate(f,a,b,n=64){
  const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;
}
/** Cumulative laws of r on [0, 1] (Simpson integration of the densities). */
export const RATIO_LAWS=Object.freeze({
  poisson:r=>2*r/(1+r),
  goe:r=>r<=0?0:r>=1?1:integrate(RATIO_DENSITIES.goe,0,r),
  gue:r=>r<=0?0:r>=1?1:integrate(RATIO_DENSITIES.gue,0,r),
});
/** Mean of r: large-matrix values (Atas et al. 2013) and 2 ln 2 − 1 for Poisson. */
export const RATIO_MEANS=Object.freeze({goe:.5307,gue:.5996,poisson:2*Math.LN2-1});
/** Mean of r under the 3 × 3 surmise: 4 − 2√3 and 2√3/π − ½. */
export const RATIO_SURMISE_MEANS=Object.freeze({goe:4-2*Math.sqrt(3),gue:2*Math.sqrt(3)/Math.PI-.5,poisson:2*Math.LN2-1});
export function meanAndError(sample){
  const n=sample.length,mean=sample.reduce((a,b)=>a+b,0)/n;
  const variance=sample.reduce((a,b)=>a+(b-mean)**2,0)/Math.max(1,n-1);
  return {n,mean,sd:Math.sqrt(variance),error:Math.sqrt(variance/n)};
}

// ---- number variance ---------------------------------------------------------
/** Variance of the number of unfolded levels in windows of length L. */
export function numberVariance(unfolded,L,stride=.25){
  const lo=unfolded[0],hi=unfolded[unfolded.length-1];if(!(hi-lo>L))return NaN;
  let i0=0,i1=0,s1=0,s2=0,count=0;
  for(let x=lo;x+L<=hi;x+=stride){
    while(i0<unfolded.length&&unfolded[i0]<x)i0++;
    while(i1<unfolded.length&&unfolded[i1]<x+L)i1++;
    const n=i1-i0;s1+=n;s2+=n*n;count++;
  }
  const mean=s1/count;return s2/count-mean*mean;
}
/** Asymptotic number variance of the reference laws (used for L ≥ 1). */
export const NUMBER_VARIANCE=Object.freeze({
  poisson:L=>L,
  goe:L=>2/(Math.PI*Math.PI)*(Math.log(2*Math.PI*L)+EULER+1-Math.PI*Math.PI/8),
  gue:L=>1/(Math.PI*Math.PI)*(Math.log(2*Math.PI*L)+EULER+1),
});

// ---- reduced widths ----------------------------------------------------------
/** Porter–Thomas cumulative law for a width divided by the mean width. */
export const porterThomas=x=>x<=0?0:erf(Math.sqrt(x/2));
/** Widths divided by their sample mean. */
export function normaliseWidths(widths){
  const mean=widths.reduce((a,b)=>a+b,0)/widths.length;return widths.map(w=>w/mean);
}
/** Variance over squared mean; 2 for Porter–Thomas, 0 for equal widths. */
export function relativeVariance(sample){
  const {mean}=meanAndError(sample),n=sample.length;
  return sample.reduce((a,b)=>a+(b-mean)**2,0)/n/(mean*mean);
}

// ---- one call for the interface ---------------------------------------------
/**
 * All comparisons for one unfolded level sequence. Each entry carries the
 * statistic and one goodness-of-fit number per reference law.
 */
export function levelStatistics(unfolded,{maxL=10}={}){
  const spacings=spacingsOf(unfolded),ratios=spacingRatios(spacings),r=meanAndError(ratios);
  const Ls=[];for(let L=1;L<=maxL+1e-9;L+=.5)if(unfolded[unfolded.length-1]-unfolded[0]>4*L)Ls.push(L);
  const sigma2=Ls.map(L=>numberVariance(unfolded,L));
  const fit={};
  for(const name of ENSEMBLES){
    const d=ksDistance(spacings,SPACING_LAWS[name]),dr=ksDistance(ratios,RATIO_LAWS[name]);
    let rms=0;Ls.forEach((L,i)=>{rms+=(sigma2[i]-NUMBER_VARIANCE[name](L))**2;});
    fit[name]={spacingKS:d,spacingP:ksPValue(d,spacings.length),ratioKS:dr,ratioP:ksPValue(dr,ratios.length),
      ratioZ:(r.mean-RATIO_MEANS[name])/r.error,varianceRMS:Ls.length?Math.sqrt(rms/Ls.length):NaN};
  }
  return {levels:unfolded.length,spacings,ratios,ratioMean:r.mean,ratioError:r.error,Ls,sigma2,fit};
}
/** Width comparison with Porter–Thomas. */
export function widthStatistics(widths){
  const x=normaliseWidths(widths),d=ksDistance(x,porterThomas);
  return {n:x.length,normalised:x,ks:d,p:ksPValue(d,x.length),relativeVariance:relativeVariance(x),
    belowTenth:x.filter(v=>v<.1).length/x.length};
}

// ---- synthetic samples (tests and reference curves) --------------------------
export function seededRandom(seed=1){
  let a=seed>>>0;
  return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
export function gaussian(random){
  let u=0;while(u===0)u=random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*random());
}
/** Independent spacings drawn from a reference law by inverting its CDF. */
export function sampleSpacings(name,n,random){
  const law=SPACING_LAWS[name],out=[];
  for(let i=0;i<n;i++){
    const u=random();let lo=0,hi=12;
    for(let k=0;k<60;k++){const mid=(lo+hi)/2;if(law(mid)<u)lo=mid;else hi=mid;}
    out.push((lo+hi)/2);
  }
  return out;
}
