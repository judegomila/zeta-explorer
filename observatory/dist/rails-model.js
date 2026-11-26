/**
 * The two rails of the completed zeta function, their time delay, the variance
 * of that delay, and the vacuum and jitter constants of a ladder.
 *
 * With ξ(s) = ½ s(s−1) π^(−s/2) Γ(s/2) ζ(s) and bridge thickness a,
 *
 *   A_a(t) = Re ξ(½ + a + it)        (even rail)
 *   B_a(t) = Im ξ(½ + a + it)        (odd rail)
 *   m_a = B_a / A_a = tan φ_a,       φ_a = arg ξ(½ + a + it)
 *   τ_a(t) = 2 φ_a′(t) = 2 Re (ξ′/ξ)(½ + a + it)      (time delay)
 *
 * No scaling enters these definitions. For display only, the rails are divided
 * by the positive smooth factor |½ s(s−1) π^(−s/2) Γ(s/2)|, which leaves the
 * zeros, the ratio m_a and the phase unchanged; the scaled rails are
 * |ζ(s)| cos φ_a and |ζ(s)| sin φ_a.
 *
 * ξ and ζ are evaluated by math.js (the evaluator of the main view). Nothing
 * in this module is a statement about the location of zeros beyond the window
 * it samples, and a sampled window establishes nothing about RH.
 */
import { evaluatePolar, logGamma } from './math.js';
import { RAILS_TABLE, V_EXPANSION } from './rails-data.js';

const TAU=2*Math.PI,LOGPI=Math.log(Math.PI);
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const num=(x,fallback)=>typeof x==='number'&&Number.isFinite(x)?x:fallback;

/** Thickness at which the prime series of the delay stops converging absolutely. */
export const LIMITING_THICKNESS=.5;
export const HEIGHT_LIMIT=2000;

export function railsConfig(input={}){
  const a=clamp(num(input.a,.5),.01,3),t0=clamp(num(input.t0,10),0,HEIGHT_LIMIT-5);
  const span=clamp(num(input.span,40),5,Math.min(400,HEIGHT_LIMIT-t0));
  return {a,t0,span,terms:Math.round(clamp(num(input.terms,2000),2,20000))};
}

// ---- von Mangoldt table ------------------------------------------------------
let mangoldtCache=null;
/** Λ(n) for n ≤ limit as [n, log p] pairs in ascending n (prime powers only). */
export function mangoldtTable(limit=20000){
  if(mangoldtCache&&mangoldtCache.limit>=limit)return mangoldtCache.rows.filter(r=>r[0]<=limit);
  const sieve=new Uint8Array(limit+1),rows=[];
  for(let p=2;p<=limit;p++){
    if(sieve[p])continue;
    for(let q=p*p;q<=limit;q+=p)sieve[q]=1;
    const lp=Math.log(p);for(let q=p;q<=limit;q*=p)rows.push([q,lp]);
  }
  rows.sort((x,y)=>x[0]-y[0]);mangoldtCache={limit,rows};return rows;
}

// ---- rails ---------------------------------------------------------------------
/** log of the positive smooth factor |½ s(s−1) π^(−s/2) Γ(s/2)| at s = σ + it. */
export function logSmoothFactor(sigma,t){
  return Math.log(.5*Math.hypot(sigma,t)*Math.hypot(sigma-1,t))-sigma/2*LOGPI+logGamma(sigma/2,t/2).re;
}

/**
 * One point of the two-rail system. A, B are the raw rails (they underflow to
 * 0 in double precision above t ≈ 900; `scaledA`, `scaledB` stay representable).
 */
export function railPoint(a,t){
  const sigma=.5+a,p=evaluatePolar(sigma,t,'xi',0,true);
  if(!p.valid)return {valid:false};
  const z=evaluatePolar(sigma,t,'zeta',0,true);
  const scale=Math.exp(p.logAbs-logSmoothFactor(sigma,t)),c=Math.cos(p.arg),s=Math.sin(p.arg);
  const delay=2*p.q.re,fluct=z.valid&&z.q?2*z.q.re:NaN;
  return {valid:true,t,a,A:p.re,B:p.im,logAbs:p.logAbs,phase:p.arg,ratio:c===0?Infinity:s/c,
    scaledA:scale*c,scaledB:scale*s,delay,fluct,smooth:delay-fluct};
}

/** τ_a(t) = 2 Re ξ′/ξ(½ + a + it). */
export const timeDelay=(a,t)=>{const p=evaluatePolar(.5+a,t,'xi',0,true);return p.valid?2*p.q.re:NaN;};
/** Fluctuating part 2 Re ζ′/ζ(½ + a + it) and the smooth remainder of τ_a. */
export function delayParts(a,t){
  const p=railPoint(a,t);return p.valid?{delay:p.delay,fluct:p.fluct,smooth:p.smooth}:{delay:NaN,fluct:NaN,smooth:NaN};
}
/**
 * Truncated prime series of the fluctuating part,
 *   −2 Σ_{n ≤ N} Λ(n) n^(−½−a) cos(t log n).
 * It converges absolutely exactly for a > ½; below that it is drawn as a
 * finite sum only.
 */
export function primeDelaySeries(a,t,terms=2000){
  let sum=0;for(const [n,lp] of mangoldtTable(Math.max(2,terms)))sum+=lp*Math.pow(n,-.5-a)*Math.cos(t*Math.log(n));
  return -2*sum;
}

/** Sampled rails, ratio, continuous phase and delay on [t0, t0 + span]. */
export function railScan(input,steps=600){
  const c=railsConfig(input),n=Math.max(8,steps),t=new Float64Array(n+1);
  const A=new Float64Array(n+1),B=new Float64Array(n+1),phase=new Float64Array(n+1),delay=new Float64Array(n+1),
    smooth=new Float64Array(n+1),series=new Float64Array(n+1),ratio=new Float64Array(n+1);
  let turns=0,last=NaN;
  for(let i=0;i<=n;i++){
    const p=railPoint(c.a,c.t0+c.span*i/n);t[i]=p.t;
    A[i]=p.scaledA;B[i]=p.scaledB;ratio[i]=p.ratio;delay[i]=p.delay;smooth[i]=p.smooth;
    if(Number.isFinite(last)){const d=p.phase-last;if(d>Math.PI)turns-=TAU;else if(d<-Math.PI)turns+=TAU;}
    last=p.phase;phase[i]=p.phase+turns;
    series[i]=p.smooth+primeDelaySeries(c.a,p.t,c.terms);
  }
  return {config:c,t,A,B,ratio,phase,delay,smooth,series};
}

/**
 * Passivity indicator (T) on a sampled window: the inequality drawn is
 * τ_a(t) > 0. `holds` refers to the samples only.
 */
export function delayPositivity(delay){
  let min=Infinity,at=-1,negative=0;
  for(let i=0;i<delay.length;i++){if(delay[i]<min){min=delay[i];at=i;}if(!(delay[i]>0))negative++;}
  return {min,index:at,negative,samples:delay.length,holds:negative===0};
}
/** Overlap parameter κ = (a/π) log(t/2π): resonance width 2a over mean spacing. */
export const overlap=(a,t)=>a/Math.PI*Math.log(Math.max(t,TAU)/TAU);

// ---- variance of the time delay ---------------------------------------------
function tableValue(a,column){
  const rows=RAILS_TABLE,pole=x=>column===1?1/(8*x*x):0;
  if(!(a>=rows[0][0])||a>rows[rows.length-1][0])return NaN;
  let lo=0,hi=rows.length-1;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(rows[mid][0]<=a)lo=mid;else hi=mid;}
  const [a0,a1]=[rows[lo][0],rows[hi][0]],u=(a-a0)/(a1-a0);
  // Interpolate the part left after the double pole is removed.
  return pole(a)+(1-u)*(rows[lo][column]-pole(a0))+u*(rows[hi][column]-pole(a1));
}
/** V(a) = ½ Σ Λ(n)² n^(−1−2a), from the precomputed table (0.005 ≤ a ≤ 3). */
export const varianceSeries=a=>tableValue(a,1);
/** v(a) = (1/2π²) Σ Λ(n)² / (n^(1+2a) log² n), from the precomputed table. */
export const primeJitter=a=>tableValue(a,2);
/** Three-term expansion 1/(8a²) + V₀ + V₁ a, valid for small a. */
export const varianceExpansion=a=>1/(8*a*a)+V_EXPANSION.V0+V_EXPANSION.V1*a;
/**
 * Direct evaluation of V(a): prime powers up to N plus the tail
 * ½ ∫_N^∞ log x · x^(−1−2a) dx from the prime number theorem. Used to check
 * table entries; accurate only where the tail is small (a ≳ ¼).
 */
export function varianceDirect(a,N=200000){
  let sum=0;for(const [n,lp] of mangoldtTable(N))sum+=lp*lp*Math.pow(n,-1-2*a);
  return (sum+Math.pow(N,-2*a)*(Math.log(N)/(2*a)+1/(4*a*a)))/2;
}
/** Direct evaluation of v(a): prime powers up to N, with the matching tail. */
export function primeJitterDirect(a,N=200000){
  let sum=0;for(const [n,lp] of mangoldtTable(N))sum+=lp*lp/(Math.pow(n,1+2*a)*Math.log(n)**2);
  // ∫_N^∞ x^(−1−2a)/log x dx ≤ N^(−2a)/(2a log N); used as the estimate.
  return (sum+Math.pow(N,-2*a)/(2*a*Math.log(N)))/(2*Math.PI**2);
}
/** L = log(t/2π). */
export const heightLog=t=>Math.log(Math.max(t,TAU*1.0001)/TAU);
/**
 * Rounding at finite height. `rounded` is (1 − e^(−2aL))/(2a²), the variance
 * for sine-kernel points of density L/2π carrying Lorentzians of half-width a;
 * `smallA` is its expansion L/a − L² for a ≪ 1/L; `infinite` is 4V(a).
 */
export function roundedVariance(a,L){
  return {infinite:4*varianceSeries(a),rounded:(1-Math.exp(-2*a*L))/(2*a*a),smallA:L/a-L*L,crossover:1/(2*L)};
}
/** Diagonal prime sum cut at n ≤ t/2π plus (L/a)(t/2π)^(−2a) (heuristic form). */
export function truncatedVariance(a,t){
  const x=t/TAU,L=heightLog(t);let sum=0;
  for(const [n,lp] of mangoldtTable(Math.max(2,Math.floor(x))))sum+=lp*lp*Math.pow(n,-1-2*a);
  return 2*sum+L/a*Math.pow(x,-2*a);
}
/**
 * Sample variance of the fluctuating part 2 Re ζ′/ζ of the delay on
 * [t0, t0 + span], and the sample mean of τ_a there.
 */
export function measuredDelayVariance(a,t0,span,step=.05){
  const n=Math.max(4,Math.round(span/step));let s1=0,s2=0,mean=0,count=0;
  for(let i=0;i<=n;i++){
    const p=delayParts(a,t0+span*i/n);if(!Number.isFinite(p.fluct))continue;
    s1+=p.fluct;s2+=p.fluct*p.fluct;mean+=p.delay;count++;
  }
  if(!count)return {variance:NaN,mean:NaN,samples:0};
  const m=s1/count;
  return {variance:s2/count-m*m,meanSquare:s2/count,mean:mean/count,samples:count};
}

// ---- vacuum and jitter of a ladder -------------------------------------------
export const ZETA_MINUS_ONE=-1/12;
/** ζ(2)/(2π²) with ζ(2) summed numerically (Euler–Maclaurin tail). */
export function jitterConstant(terms=2000){
  let z=0;for(let k=1;k<=terms;k++)z+=1/(k*k);
  z+=1/terms-1/(2*terms*terms)+1/(6*terms**3);
  return z/(2*Math.PI**2);
}
/** Σ_{n≥1} n e^(−εn) − 1/ε², which tends to ζ(−1) = −1/12 as ε → 0. */
export function regularisedLadderSum(eps){
  if(eps<1e-3)return -1/12+eps*eps/240;                 // series; avoids cancellation
  const q=Math.exp(-eps);return q/((1-q)*(1-q))-1/(eps*eps);
}
/** Sawtooth F(x) = ½ − {x} of the perfect ladder; its mean square is 1/12. */
export const sawtooth=x=>.5-(x-Math.floor(x));
export const bernoulli2=x=>x*x-x+1/6;
/** Hurwitz value ζ(−1, α) = −½ B₂(α) for the shifted ladder {n + α}. */
export const hurwitzMinusOne=alpha=>-.5*bernoulli2(alpha);

/**
 * Jitter energy ⟨F²⟩ of a periodic point set of unit density: `points` in
 * [0, period), period = number of points. F = N(x) − x − c with mean zero.
 */
export function jitterEnergy(points,period=points.length){
  const x=[...points].sort((p,q)=>p-q),n=x.length;
  // On [x_k, x_{k+1}) the count is k+1, so F = k + 1 − x − c.
  let s1=0,s2=0;
  for(let k=0;k<n;k++){
    const lo=x[k],hi=k+1<n?x[k+1]:x[0]+period,u0=k+1-lo,u1=k+1-hi;   // F + c at the ends
    s1+=(u0*u0-u1*u1)/2;s2+=(u0**3-u1**3)/3;
  }
  const mean=s1/period;return s2/period-mean*mean;
}
/**
 * Energy of a periodic unit-density set seen from the origin y,
 *   E_ε(y) = Σ_{x_n > y} (x_n − y) e^(−ε(x_n − y)) − 1/ε²,
 * summed over all periodic images in closed form.
 */
export function ladderEnergyFrom(points,y,eps,period=points.length){
  const q=Math.exp(-eps*period);let sum=0;
  for(const p of points){
    let r=(p-y)%period;if(r<=1e-12)r+=period;            // strictly ahead of y
    sum+=Math.exp(-eps*r)*(r/(1-q)+period*q/((1-q)*(1-q)));
  }
  return sum-1/(eps*eps);
}
/** Mean over the points of the set of the energy seen from each point. */
export function rungEnergyMean(points,eps,period=points.length){
  let sum=0;for(const p of points)sum+=ladderEnergyFrom(points,p,eps,period);
  return sum/points.length;
}

/**
 * Rungs of the odd rail B_a in a window, in the unfolded variable
 * u = φ_a/π − s_a with s_a = (1/π) arg ζ(½ + a + it): the rung n sits at
 * u_n = n − s_a(t_n), a unit ladder displaced by δ_n = −s_a(t_n).
 * Requires a ≥ ½, where arg ζ is taken by continuity from its principal value.
 */
export function railRungs(a,t0,span,step=.02){
  const n=Math.max(8,Math.round(span/step)),rungs=[];
  let prevPhi=NaN,prevS=NaN,prevT=NaN,phiTurns=0,sTurns=0,lastPhi=NaN,lastS=NaN;
  for(let i=0;i<=n;i++){
    const t=t0+span*i/n,x=evaluatePolar(.5+a,t,'xi'),z=evaluatePolar(.5+a,t,'zeta');
    if(!x.valid||!z.valid)continue;
    if(Number.isFinite(lastPhi)){const d=x.arg-lastPhi;if(d>Math.PI)phiTurns-=TAU;else if(d<-Math.PI)phiTurns+=TAU;}
    if(Number.isFinite(lastS)){const d=z.arg-lastS;if(d>Math.PI)sTurns-=TAU;else if(d<-Math.PI)sTurns+=TAU;}
    lastPhi=x.arg;lastS=z.arg;
    const phi=(x.arg+phiTurns)/Math.PI,s=(z.arg+sTurns)/Math.PI;
    if(Number.isFinite(prevPhi)&&Math.floor(phi)!==Math.floor(prevPhi)&&phi>prevPhi){
      const k=Math.floor(phi),w=(k-prevPhi)/(phi-prevPhi),sn=prevS+w*(s-prevS);
      rungs.push({index:k,t:prevT+w*(t-prevT),shift:sn,u:k-sn,delta:-sn});
    }
    prevPhi=phi;prevS=s;prevT=t;
  }
  let m2=0;for(const r of rungs)m2+=r.delta*r.delta;
  return {rungs,meanSquare:rungs.length?m2/rungs.length:NaN};
}

/**
 * The paper's statements about the vacuum balance, as numbers.
 * `twoPoint` is ζ(−1) − v(a); `jitter` is 1/12 + v(a); their sum is 0.
 */
export function vacuumBalance(a,primes=true){
  const v=primes?primeJitter(a):0;
  return {vacuum:ZETA_MINUS_ONE,jitterLadder:1/12,prime:v,twoPoint:ZETA_MINUS_ONE-v,jitter:1/12+v};
}
/**
 * One-point energies V of the rails computed in the source paper (contour
 * formula, ε → 0), beside the value the one-point balance would require.
 * They differ: the one-point balance is false.
 */
export const ONE_POINT_TABLE=Object.freeze([
  {a:2,rail:'B',value:-.1551360975,balance:-.0851574631},
  {a:2,rail:'A',value:.1464533896,balance:.0398425369},
  {a:3,rail:'B',value:-.0472462234,balance:-.0837537756},
  {a:3,rail:'A',value:.0044917132,balance:.0412462244},
]);
/** Time-delay variance measured in the source paper at heights beyond the browser's range. */
export const VARIANCE_REFERENCE=Object.freeze([
  {t:1e4,window:400,rows:[[.5,1.618],[.25,7.073],[.1,37.63],[.05,103.7],[.02,320.1],[.01,688.6]]},
  {t:1e6,window:200,rows:[[.5,1.603],[.25,7.169],[.1,43.96],[.05,138.1],[.02,474.3],[.01,1063.5]]},
]);
