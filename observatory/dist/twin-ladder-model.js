/**
 * Finite twin-ladder model with an adjustable damping centre.
 *
 * Each prime p carries a ladder of rungs m = 1..M at log-length l = m log p.
 * A rung on an arm with damping sigma has amplitude
 *
 *   A(p,m;sigma) = b(p) · exp(−sigma·l) · exp(−beta·l − P·l²),
 *
 * with b(p) = log p (von Mangoldt weight) or b(p) = 1. The direct arm sits at
 * sigma₊ = c + a and turns as exp(−iTl); the dual arm sits at sigma₋ = c − a and
 * turns as exp(+iTl). c is the damping centre and a the bridge offset.
 *
 * With c = ½, the first eight primes, M = 2, Mangoldt weights and beta = P = 0
 * this is exactly the packet already drawn by the main view. The thermal
 * weights follow src/math/twin-ladder.js (psi(x) = x²).
 *
 * Everything here is a finite sum. With Mangoldt weights the direct sum is a
 * truncation of −ζ′/ζ(sigma + iT), which converges only for sigma > 1. Nothing
 * in this module evaluates ζ or ξ, and no finite plot is a statement about RH.
 * The completed bridge (bridgeBalance) is the one place ξ enters, through the
 * evaluator passed in by the caller.
 */
export const LADDER_PRIMES=Object.freeze([2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173]);

const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const num=(x,fallback)=>typeof x==='number'&&Number.isFinite(x)?x:fallback;

/** Clean numeric configuration; every consumer goes through this. */
export function ladderConfig(input={}){
  return {
    centre:clamp(num(input.centre,.5),-1,2),
    offset:clamp(num(input.offset,.25),0,1.5),
    primes:Math.round(clamp(num(input.primes,8),1,LADDER_PRIMES.length)),
    rungs:Math.round(clamp(num(input.rungs,2),1,12)),
    beta:clamp(num(input.beta,0),0,4),
    pressure:clamp(num(input.pressure,0),0,2),
    width:clamp(num(input.width,.35),.05,2),
    weight:input.weight==='unit'?'unit':'mangoldt',
  };
}

/** Damping exponents of the two arms. */
export function armDamping(input){
  const c=ladderConfig(input);
  return {direct:c.centre+c.offset,dual:c.centre-c.offset};
}

/**
 * Rungs sorted by log-length. `thermal` is the beta/P weight alone; `direct`
 * and `dual` are the full amplitudes on the two arms.
 */
export function ladderRungs(input){
  const c=ladderConfig(input),{direct,dual}=armDamping(c),out=[];
  for(const p of LADDER_PRIMES.slice(0,c.primes)){
    const logP=Math.log(p),base=c.weight==='mangoldt'?logP:1;
    for(let m=1;m<=c.rungs;m++){
      const ell=m*logP,thermal=Math.exp(-c.beta*ell-c.pressure*ell*ell);
      out.push({p,m,ell,base,thermal,direct:base*thermal*Math.exp(-direct*ell),dual:base*thermal*Math.exp(-dual*ell)});
    }
  }
  return out.sort((x,y)=>x.ell-y.ell||x.p-y.p);
}

/** Complex arm sum at height T. arm is 'direct' or 'dual'. */
export function armSum(rungs,T,arm){
  const sign=arm==='dual'?1:-1;let re=0,im=0;
  for(const r of rungs){const amp=r[arm],ph=sign*T*r.ell;re+=amp*Math.cos(ph);im+=amp*Math.sin(ph);}
  return {re,im,abs:Math.hypot(re,im)};
}

/** Tip-to-tail partial sums, starting at the origin, in order of log-length. */
export function armWalk(rungs,T,arm){
  const sign=arm==='dual'?1:-1,points=[{re:0,im:0}];let re=0,im=0;
  for(const r of rungs){const amp=r[arm],ph=sign*T*r.ell;re+=amp*Math.cos(ph);im+=amp*Math.sin(ph);points.push({re,im});}
  return points;
}

/** Complex Gaussian-windowed packet at log-position ell. */
export function packetValue(rungs,ell,T,arm,width){
  const sign=arm==='dual'?1:-1,h2=2*width*width;let re=0,im=0;
  for(const r of rungs){
    const amp=r[arm]*Math.exp(-((ell-r.ell)**2)/h2),ph=sign*T*r.ell;
    re+=amp*Math.cos(ph);im+=amp*Math.sin(ph);
  }
  return {re,im,abs:Math.hypot(re,im)};
}
/** Magnitude of the Gaussian-windowed packet at log-position ell. */
export const packetMagnitude=(rungs,ell,T,arm,width)=>packetValue(rungs,ell,T,arm,width).abs;

/** |arm sum| sampled along the height axis. */
export function heightScan(rungs,arm,tMin,tMax,steps=360){
  const out=new Float64Array(steps+1);
  for(let i=0;i<=steps;i++)out[i]=armSum(rungs,tMin+(tMax-tMin)*i/steps,arm).abs;
  return out;
}

/**
 * Finite arm imbalance tanh(log|D₊| − log|D₋|) at height T. For a > 0 the
 * direct arm is the more heavily damped one whatever the centre: the bare
 * ladders have no balanced centre.
 */
export function finiteBalance(rungs,T){
  const a=armSum(rungs,T,'direct').abs,b=armSum(rungs,T,'dual').abs;
  if(!(a>0)&&!(b>0))return NaN;
  if(!(b>0))return 1;
  if(!(a>0))return -1;
  return Math.tanh(Math.log(a)-Math.log(b));
}

/**
 * Completed bridge tanh(log|ξ(c+a+iT)| − log|ξ(c−a+iT)|). `evaluate(sigma,t)`
 * must return {valid, logAbs}. Because |ξ(s)| = |ξ(1 − s̄)|, the value is
 * exactly 0 at c = ½ for every a and T; that symmetry is what the bare
 * ladders lack.
 */
export function bridgeBalance(evaluate,centre,offset,T){
  const a=evaluate(centre+offset,T),b=evaluate(centre-offset,T);
  if(!a?.valid||!b?.valid)return NaN;
  if(a.logAbs===-Infinity&&b.logAbs===-Infinity)return NaN;
  return Math.tanh(a.logAbs-b.logAbs);
}

/** Total arm weights (sum of amplitudes) and their ratio. */
export function armTotals(rungs){
  let direct=0,dual=0;for(const r of rungs){direct+=r.direct;dual+=r.dual;}
  return {direct,dual,ratio:dual>0?direct/dual:NaN};
}
