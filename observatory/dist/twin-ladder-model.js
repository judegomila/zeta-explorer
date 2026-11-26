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
/** Primes up to `limit` by the sieve of Eratosthenes. */
export function sievePrimes(limit){
  const n=Math.max(0,Math.floor(limit)),composite=new Uint8Array(n+1),out=[];
  for(let i=2;i<=n;i++){if(composite[i])continue;out.push(i);for(let j=i*i;j<=n;j+=i)composite[j]=1;}
  return out;
}
/** The 168 primes below 1000; the first 40 are the original fixed list. */
export const LADDER_PRIMES=Object.freeze(sievePrimes(1000));

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

/**
 * Fast windowed packet. The Gaussian factor of each (cell, rung) pair does not
 * depend on T, so it is computed once; packetRow then needs one cos/sin per
 * rung and multiply-adds per cell. Rungs farther than `cutoff`·h from a cell
 * are dropped (relative weight below exp(−cutoff²/2); 1.5·10⁻⁸ at the default).
 * Rungs must be sorted by log-length, as ladderRungs returns them.
 */
export function packetKernel(rungs,ells,width,cutoff=6){
  const n=ells.length,h2=2*width*width,reach=cutoff*width,lo=new Int32Array(n),hi=new Int32Array(n),offset=new Int32Array(n+1);
  const ell=Float64Array.from(rungs,r=>r.ell);let a=0,b=0;
  for(let i=0;i<n;i++){
    while(a<ell.length&&ell[a]<ells[i]-reach)a++;if(b<a)b=a;
    while(b<ell.length&&ell[b]<=ells[i]+reach)b++;
    lo[i]=a;hi[i]=b;offset[i+1]=offset[i]+(b-a);
  }
  const direct=new Float64Array(offset[n]),dual=new Float64Array(offset[n]);
  for(let i=0;i<n;i++)for(let k=lo[i],o=offset[i];k<hi[i];k++,o++){const g=Math.exp(-((ells[i]-ell[k])**2)/h2);direct[o]=rungs[k].direct*g;dual[o]=rungs[k].dual*g;}
  return {n,ell,lo,hi,offset,direct,dual,cos:new Float64Array(ell.length),sin:new Float64Array(ell.length)};
}
/** Real and imaginary parts of both packets at height T on the kernel's cells. */
export function packetRow(kernel,T,out={}){
  const {n,ell,lo,hi,offset,direct,dual,cos,sin}=kernel;
  for(let k=0;k<ell.length;k++){cos[k]=Math.cos(T*ell[k]);sin[k]=Math.sin(T*ell[k]);}
  const dRe=out.directRe||new Float64Array(n),dIm=out.directIm||new Float64Array(n),uRe=out.dualRe||new Float64Array(n),uIm=out.dualIm||new Float64Array(n);
  for(let i=0;i<n;i++){
    let a=0,b=0,c=0,d=0;
    for(let k=lo[i],o=offset[i];k<hi[i];k++,o++){const x=cos[k],y=sin[k];a+=direct[o]*x;b-=direct[o]*y;c+=dual[o]*x;d+=dual[o]*y;}
    dRe[i]=a;dIm[i]=b;uRe[i]=c;uIm[i]=d;
  }
  return {directRe:dRe,directIm:dIm,dualRe:uRe,dualIm:uIm};
}

/** Finite arm balance along the damping centre c ∈ [0, 1], at n + 1 points. */
export function finiteBalanceCurve(input,T,n=80){
  const c=ladderConfig(input),rungs=ladderRungs({...c,centre:0,offset:0}),out=new Float64Array(n+1);
  const w=rungs.map(r=>r.direct),cs=rungs.map(r=>Math.cos(T*r.ell)),sn=rungs.map(r=>Math.sin(T*r.ell));
  for(let i=0;i<=n;i++){
    const sp=i/n+c.offset,sm=i/n-c.offset;let ar=0,ai=0,br=0,bi=0;
    for(let k=0;k<rungs.length;k++){const l=rungs[k].ell,A=w[k]*Math.exp(-sp*l),B=w[k]*Math.exp(-sm*l);ar+=A*cs[k];ai-=A*sn[k];br+=B*cs[k];bi+=B*sn[k];}
    const a=Math.hypot(ar,ai),b=Math.hypot(br,bi);
    out[i]=!(a>0)&&!(b>0)?NaN:!(b>0)?1:!(a>0)?-1:Math.tanh(Math.log(a)-Math.log(b));
  }
  return out;
}

/*
 * Thermal ensemble of the finite ladder. Each rung carries the weight
 *
 *   w(p,m) = b(p) · exp(−βℓ − Pℓ²),    ℓ = m log p,
 *
 * the same factor that multiplies both arms. β and P are model parameters
 * (an inverse temperature Θ = 1/β and a convex "pressure" on long rungs), not
 * a temperature or pressure of ζ. With log p weights and P = 0 the partition
 * function is a finite truncation of Σ Λ(n) n^(−β) = −ζ′/ζ(β), which diverges
 * as more primes are added when β ≤ 1; every value here is a finite sum.
 */
export const THERMO_OBSERVABLES=Object.freeze(['logZ','meanEll','entropy','armGap']);
export const THERMO_RANGE=Object.freeze({beta:[0,4],pressure:[0,2]});

function thermoTables(input){
  const c=ladderConfig(input),rungs=ladderRungs({...c,centre:0,offset:0,beta:0,pressure:0});
  const ell=Float64Array.from(rungs,r=>r.ell),logBase=Float64Array.from(rungs,r=>Math.log(r.base));
  return {c,rungs,ell,logBase,base:Float64Array.from(rungs,r=>r.base)};
}
/** Normalised thermal weights q, log Z, mean log-length and Shannon entropy. */
export function thermalEnsemble(input){
  const {c,rungs,ell,logBase}=thermoTables(input),n=ell.length,logw=new Float64Array(n);let top=-Infinity;
  for(let k=0;k<n;k++){logw[k]=logBase[k]-c.beta*ell[k]-c.pressure*ell[k]*ell[k];top=Math.max(top,logw[k]);}
  let z=0;for(let k=0;k<n;k++)z+=Math.exp(logw[k]-top);
  const logZ=top+Math.log(z),q=new Float64Array(n);let mean=0,entropy=0;
  for(let k=0;k<n;k++){q[k]=Math.exp(logw[k]-logZ);mean+=q[k]*ell[k];if(q[k]>0)entropy-=q[k]*(logw[k]-logZ);}
  return {logZ,mean,entropy,weights:q,ell,rungs,count:n};
}
/**
 * One observable at (β, P) taken from `input`. 'armGap' is |direct sum| − |dual
 * sum| at height T with the thermal weights included in both arms.
 */
export function thermoValue(input,observable,T=0){
  if(observable==='armGap'){const r=ladderRungs(input);return armSum(r,T,'direct').abs-armSum(r,T,'dual').abs;}
  const e=thermalEnsemble(input);
  return observable==='meanEll'?e.mean:observable==='entropy'?e.entropy:e.logZ;
}
/**
 * The observable on an nb × np grid over β ∈ [0, 4], P ∈ [0, 2]. values[j·nb + i]
 * belongs to β_i = 4i/(nb − 1), P_j = 2j/(np − 1). The exponentials are
 * tabulated once per axis, so each cell costs a few multiply-adds per rung.
 */
export function thermoGrid(input,observable,T=0,{nb=48,np=24}={}){
  const {c,ell,base,logBase}=thermoTables(input),n=ell.length,[b0,b1]=THERMO_RANGE.beta,[p0,p1]=THERMO_RANGE.pressure;
  const betas=Float64Array.from({length:nb},(_,i)=>b0+(b1-b0)*i/Math.max(1,nb-1));
  const pressures=Float64Array.from({length:np},(_,j)=>p0+(p1-p0)*j/Math.max(1,np-1));
  const values=new Float64Array(nb*np),EB=new Float64Array(nb*n),gap=observable==='armGap';
  for(let i=0;i<nb;i++)for(let k=0;k<n;k++)EB[i*n+k]=Math.exp(-betas[i]*ell[k]);
  const sp=c.centre+c.offset,sm=c.centre-c.offset,cs=new Float64Array(n),sn=new Float64Array(n),A=new Float64Array(n),B=new Float64Array(n),wp=new Float64Array(n),lp=new Float64Array(n);
  for(let k=0;k<n;k++){cs[k]=Math.cos(T*ell[k]);sn[k]=Math.sin(T*ell[k]);A[k]=Math.exp(-sp*ell[k]);B[k]=Math.exp(-sm*ell[k]);}
  for(let j=0;j<np;j++){
    for(let k=0;k<n;k++){wp[k]=base[k]*Math.exp(-pressures[j]*ell[k]*ell[k]);lp[k]=logBase[k]-pressures[j]*ell[k]*ell[k];}
    for(let i=0;i<nb;i++){
      const row=i*n;let v;
      if(gap){let ar=0,ai=0,br=0,bi=0;for(let k=0;k<n;k++){const w=wp[k]*EB[row+k],a=w*A[k],b=w*B[k];ar+=a*cs[k];ai-=a*sn[k];br+=b*cs[k];bi+=b*sn[k];}v=Math.hypot(ar,ai)-Math.hypot(br,bi);}
      else{
        let z=0,m=0,s=0;
        for(let k=0;k<n;k++){const w=wp[k]*EB[row+k];z+=w;m+=w*ell[k];s+=w*(lp[k]-betas[i]*ell[k]);}
        const logZ=Math.log(z);v=observable==='meanEll'?m/z:observable==='entropy'?logZ-s/z:logZ;
      }
      values[j*nb+i]=v;
    }
  }
  let min=Infinity,max=-Infinity;for(const v of values)if(Number.isFinite(v)){min=Math.min(min,v);max=Math.max(max,v);}
  return {values,nb,np,betas,pressures,min,max,observable};
}
