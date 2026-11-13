/**
 * Deterministic numerical experiments for the dynamics lab.
 *
 * Evaluated ξ tracers, shifted-field interference, bounded two-dimensional
 * diffusion, and finite polynomial zero models are deliberately identified in
 * every snapshot. None of the finite models is an evolution of all ξ zeros.
 * See docs/DYNAMICS.md for conventions, sources, and numerical limitations.
 */
import {evaluatePolar} from './math.js';

const TAU=2*Math.PI, DT=.02, MAX_STEPS=2400, FIRST_ZERO=14.134725141734693;
const C=(re=0,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im), sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scale=(a,k)=>C(a.re*k,a.im*k), abs=a=>Math.hypot(a.re,a.im);
const finiteComplex=a=>a&&Number.isFinite(a.re)&&Number.isFinite(a.im);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const div=(a,b)=>{
  const m=Math.max(Math.abs(b.re),Math.abs(b.im));
  if(!(m>0)||!Number.isFinite(m))return C(NaN,NaN);
  const r=b.re/m,i=b.im/m,d=r*r+i*i;
  return C(((a.re/m)*r+(a.im/m)*i)/d,((a.im/m)*r-(a.re/m)*i)/d);
};
const wrap=x=>Math.atan2(Math.sin(x),Math.cos(x));

export const DYNAMICS_DEFAULTS=Object.freeze({
  dynamicsMode:'off',dynamicsSeed:17,dynamicsStep:0,
  dynamicsAlpha:.6,dynamicsBeta:.7,dynamicsDiffusion:.08,
  dynamicsPhase:0,dynamicsPhaseRate:.4,dynamicsAmplitude:1,dynamicsShift:.25,
  dynamicsPerturbation:.35,dynamicsKappa:2,dynamicsBoundary:'reflect',
  dynamicsPolynomial:'cubic',dynamicsForcing:0,
  dynamicsShowPhase:true,dynamicsShowVelocity:true,dynamicsShowTrails:true,
  dynamicsShowZeros:true,dynamicsRate:40,
});
export const DYNAMICS_LIMITS=Object.freeze({
  dynamicsSeed:[0,4294967295,1],dynamicsStep:[0,MAX_STEPS,1],
  dynamicsAlpha:[0,2,.05],dynamicsBeta:[-2,2,.05],
  dynamicsDiffusion:[0,.4,.005],dynamicsPhase:[0,TAU,.02],dynamicsPhaseRate:[0,2,.05],
  dynamicsAmplitude:[0,2,.05],dynamicsShift:[.02,.8,.01],
  dynamicsPerturbation:[0,1,.02],dynamicsKappa:[0,8,.1],
  dynamicsForcing:[0,.05,.01],dynamicsRate:[1,100,1],
});
export const DYNAMICS_ENUMS=Object.freeze({
  dynamicsMode:['off','phase','relax','walk','cancel','heat','trap','collision'],
  dynamicsBoundary:['reflect','pin'],
  dynamicsPolynomial:['cubic','six-real','lehmer','eight-real','quartet'],
  dynamicsForcing:[0,.01,.05],
});
export const DYNAMICS_TIMESTEP=DT;
export const DYNAMICS_MAX_STEPS=MAX_STEPS;
export const POLYNOMIAL_PRESETS=Object.freeze({
  'six-real':[-2.5,-1.5,-.5,.5,1.5,2.5],
  lehmer:[-3,-1.2,-.18,.18,1.2,3],
  'eight-real':[-3.5,-2.5,-1.5,-.5,.5,1.5,2.5,3.5],
  quartet:[-1.6,-1.2,1.2,1.6],
});

function shortKey(key){const s=key.slice(8);return s[0].toLowerCase()+s.slice(1);}
export function normalizeDynamicsConfig(input={}){
  const out={...DYNAMICS_DEFAULTS};
  for(const key of Object.keys(out)){
    const value=input[key]??input[shortKey(key)];
    if(value===undefined)continue;
    if(DYNAMICS_ENUMS[key]){if(DYNAMICS_ENUMS[key].includes(value))out[key]=value;}
    else if(typeof out[key]==='boolean'){if(typeof value==='boolean')out[key]=value;}
    else if(Number.isFinite(value)){
      const [lo,hi]=DYNAMICS_LIMITS[key]||[-Infinity,Infinity];out[key]=clamp(value,lo,hi);
    }
  }
  out.dynamicsSeed=Math.floor(out.dynamicsSeed)>>>0;
  out.dynamicsStep=Math.floor(out.dynamicsStep);
  out.dynamicsForcing=[0,.01,.05].reduce((a,b)=>Math.abs(b-out.dynamicsForcing)<Math.abs(a-out.dynamicsForcing)?b:a,0);
  const d=input.domain;
  if(d&&[d.sigmaMin,d.sigmaMax,d.tMin,d.tMax].every(Number.isFinite)&&d.sigmaMax>d.sigmaMin&&d.tMax>d.tMin)out.domain={...d};
  for(const [key,lo,hi,def] of [['gridWidth',12,96,48],['gridHeight',12,128,72],['particles',1,96,32]])out[key]=Math.floor(clamp(Number(input[key])||def,lo,hi));
  return out;
}

/** Analytic q=F'/F gives ∇log|F|=(Re q,−Im q), ∇arg F=(Im q,Re q). */
export function flowVector(record,{alpha=0,beta=1,maxSpeed=Infinity}={}){
  if(!record||record.valid===false)return {x:0,y:0,vx:0,vy:0,valid:false,clipped:false};
  const q=record.q;
  const gu=record.gradientLog||(finiteComplex(q)?{x:q.re,y:-q.im}:null);
  const gp=record.gradientPhase||(finiteComplex(q)?{x:q.im,y:q.re}:null);
  if(!gu||!gp||![gu.x,gu.y,gp.x,gp.y].every(Number.isFinite))return {x:0,y:0,vx:0,vy:0,valid:false,clipped:false};
  let x=-alpha*gu.x+beta*gp.x,y=-alpha*gu.y+beta*gp.y;
  const speed=Math.hypot(x,y),clipped=speed>maxSpeed;
  if(clipped){const f=maxSpeed/speed;x*=f;y*=f;}
  return {x,y,vx:x,vy:y,valid:Number.isFinite(x)&&Number.isFinite(y),clipped,
    gradientLog:gu,gradientPhase:gp,speed};
}

/** Scale-free local root proximity; a small raw ξ value is not a root test. */
export function newtonDistance(record){
  if(record?.valid===false)return Infinity;
  if(Number.isFinite(record?.rootDistance))return record.rootDistance;
  if(record?.logAbs===-Infinity&&Number.isFinite(record.derivativeLogAbs))return 0;
  return finiteComplex(record?.q)&&abs(record.q)>0?1/abs(record.q):Infinity;
}

export function polynomialFromRoots(roots){
  let a=[1];
  for(const r of roots){
    if(!Number.isFinite(r))throw new TypeError('Polynomial presets require finite real roots.');
    const next=new Array(a.length+1).fill(0);
    for(let k=0;k<a.length;k++){next[k]-=r*a[k];next[k+1]+=a[k];}a=next;
  }
  return a;
}

/** Ascending real coefficients of e^(−τD²)P, exact up to floating point. */
export function polynomialHeat(coeffs,tau){
  if(!Array.isArray(coeffs)||!coeffs.length||!coeffs.every(Number.isFinite)||!Number.isFinite(tau))throw new TypeError('Finite polynomial coefficients and heat time are required.');
  const out=new Array(coeffs.length).fill(0);
  for(let k=0;k<coeffs.length;k++){
    let factor=1;
    for(let j=0;k+2*j<coeffs.length;j++){
      if(j)factor*=(-tau)*(k+2*j)*(k+2*j-1)/j;
      out[k]+=factor*coeffs[k+2*j];
    }
  }
  return out;
}

export function polynomialEvaluate(coeffs,z){
  if(typeof z==='number')z=C(z);
  let value=C(),derivative=C(),secondDerivative=C();
  for(let k=coeffs.length-1;k>=0;k--){
    secondDerivative=add(mul(secondDerivative,z),scale(derivative,2));
    derivative=add(mul(derivative,z),value);
    value=add(mul(value,z),C(coeffs[k]));
  }
  return {value,derivative,secondDerivative};
}

/** Aberth iteration. Residuals are returned; roots are numerical, not certified. */
export function polynomialRoots(coeffs){
  let a=coeffs.slice();while(a.length>1&&a[a.length-1]===0)a.pop();
  const n=a.length-1;if(n<=0)return [];
  const lead=a[n];a=a.map(x=>x/lead);
  if(n===1)return [{re:-a[0],im:0,residual:0}];
  let radius=1;
  for(let k=0;k<n;k++)radius=Math.max(radius,2*Math.abs(a[k])**(1/(n-k)));
  let roots=Array.from({length:n},(_,k)=>C(radius*Math.cos(TAU*(k+.37)/n),radius*Math.sin(TAU*(k+.37)/n)));
  for(let iter=0;iter<180;iter++){
    let movement=0;
    const next=roots.map((z,j)=>{
      const p=polynomialEvaluate(a,z),newton=div(p.value,p.derivative);
      if(!finiteComplex(newton))return add(z,C(1e-9*(j+1),-1e-9));
      let rep=C();
      for(let k=0;k<n;k++)if(k!==j){const delta=sub(z,roots[k]);if(abs(delta)>1e-20)rep=add(rep,div(C(1),delta));}
      let correction=div(newton,sub(C(1),mul(newton,rep)));
      if(!finiteComplex(correction))correction=newton;
      movement=Math.max(movement,abs(correction));return sub(z,correction);
    });
    roots=next;if(movement<3e-13)break;
  }
  return roots.map(z=>{
    if(Math.abs(z.im)<1e-10)z.im=0;if(Math.abs(z.re)<1e-12)z.re=0;
    const residual=abs(polynomialEvaluate(a,z).value)/(1+a.reduce((sum,c,k)=>sum+Math.abs(c)*abs(z)**k,0));
    return {...z,residual};
  }).sort((a,b)=>Math.abs(a.re-b.re)>1e-8?a.re-b.re:a.im-b.im);
}

export function cubicHeat(tau,b=1){
  const d=6*tau-b*b,r=Math.sqrt(Math.abs(d));
  const roots=d>=0?[C(-r),C(),C(r)]:[C(0,-r),C(),C(0,r)];
  return {tau,b,coefficients:[0,b*b-6*tau,0,1],roots:roots.map(z=>({...z,residual:0})),collisionTime:b*b/6,
    value:z=>polynomialEvaluate([0,b*b-6*tau,0,1],z).value};
}

function randomGenerator(seed){
  let state=seed>>>0;
  return ()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
function normalPair(random){const r=Math.sqrt(-2*Math.log(Math.max(1/4294967296,random()))),a=TAU*random();return [r*Math.cos(a),r*Math.sin(a)];}

const PRIME_TERMS=[[2,1],[2,2],[3,1],[3,2],[5,1],[7,1]].map(([p,m])=>({frequency:m*Math.log(p),weight:Math.log(p)*p**(-m/2)}));
const PRIME_WEIGHT=PRIME_TERMS.reduce((s,a)=>s+a.weight,0);
export function trapKappa(t,{kappa=2,perturbation=.35}={}){
  return kappa*(1+perturbation*PRIME_TERMS.reduce((s,a)=>s+a.weight*(1-Math.cos(t*a.frequency)),0)/PRIME_WEIGHT);
}

/** Reverse heat time u=−τ: ds/du=+½Σ1/(s−sk), with imposed pinning. */
export function finiteZeroVelocity(roots,{kappa=0,perturbation=0,forcing=0,time=0,center=FIRST_ZERO,omega:fixedOmega}={}){
  const heights=roots.map(z=>z.t??z.im),meanGap=heights.length>1?(Math.max(...heights)-Math.min(...heights))/(heights.length-1):1;
  const k0=Math.PI,omega=Number.isFinite(fixedOmega)?fixedOmega:k0*Math.PI/Math.max(.1,2*meanGap);
  return roots.map((p,j)=>{
    const x=p.sigma??p.re,y=p.t??p.im;let vx=-trapKappa(y,{kappa,perturbation})*(x-.5),vy=0;
    for(let k=0;k<roots.length;k++)if(k!==j){const dx=x-(roots[k].sigma??roots[k].re),dy=y-(roots[k].t??roots[k].im),d=dx*dx+dy*dy;if(d>1e-20){vx+=.5*dx/d;vy-=.5*dy/d;}}
    vy+=.5*forcing*Math.cos(k0*2*(y-center)-omega*time);
    return {x:vx,y:vy,vx,vy};
  });
}

function minimumEigenvalue(matrix){
  const a=matrix.map(r=>r.slice()),n=a.length;
  for(let iter=0;iter<120;iter++){
    let p=0,q=1,m=0;
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(a[i][j])>m){m=Math.abs(a[i][j]);p=i;q=j;}
    if(m<1e-12)break;
    const angle=.5*Math.atan2(2*a[p][q],a[q][q]-a[p][p]),c=Math.cos(angle),s=Math.sin(angle);
    const pp=a[p][p],qq=a[q][q],pq=a[p][q];
    a[p][p]=c*c*pp-2*s*c*pq+s*s*qq;a[q][q]=s*s*pp+2*s*c*pq+c*c*qq;a[p][q]=a[q][p]=0;
    for(let k=0;k<n;k++)if(k!==p&&k!==q){const ap=a[k][p],aq=a[k][q];a[k][p]=a[p][k]=c*ap-s*aq;a[k][q]=a[q][k]=s*ap+c*aq;}
  }
  return Math.min(...a.map((r,i)=>r[i]));
}

const META={
  off:{title:'Dynamics paused',kind:'off',equation:'',note:'Select an experiment.'},
  phase:{title:'ξ phase circulation',kind:'evaluated-xi',equation:'q̇=β∇arg ξ',note:'Tracers move in the fixed evaluated ξ field. The ξ zeros do not move.'},
  relax:{title:'ξ modulus relaxation',kind:'evaluated-xi',equation:'q̇=−α∇log|ξ|',note:'Tracers approach fixed zeros. Capture uses the scale-free Newton correction |ξ/ξ′|.'},
  walk:{title:'Seeded drift and diffusion',kind:'evaluated-xi-tracer-extension',equation:'dq=(−α∇log|ξ|+β∇arg ξ) du+√(2D) dW',note:'Seeded Euler–Maruyama noise moves tracers in fixed ξ; this is a new stochastic visualization extension.'},
  cancel:{title:'Shifted ξ interference',kind:'deformed-evaluated-field',equation:'G(s,u)=ξ(s+a)−c exp(i[φ+ωu]) ξ(s−a)',note:'Relative phase evolves when its rate is positive. Numerical zeros belong to G, not to ξ. A global phase alone cannot cancel a zero.'},
  heat:{title:'Bounded complex-field diffusion',kind:'bounded-grid-model',equation:'∂u f=D(∂σ²+∂t²)f',note:'A perturbed complex ξ sample diffuses on a finite grid. This is ordinary 2D diffusion, distinct from de Bruijn–Newman heat.'},
  trap:{title:'Finite zero trapping model',kind:'finite-zero-model',equation:'u=−τ: dsj/du=½ Σk≠j 1/(sj−sk)−κ(tj)(σj−½)+i ε cos(k₀gj−ωu)/2',note:'Finite drift in reverse heat time u=−τ with imposed transverse pinning; the margin tests only its instantaneous linearization. No RH inference.'},
  collision:{title:'Exact polynomial heat',kind:'finite-polynomial-model',equation:'∂τP=−Pzz; żj=Pzz(zj)/Pz(zj)',note:'Finite coefficient heat and numerical polynomial roots. The cubic branch is analytic through its collision. No statement about ξ or Λ follows.'},
};

function polarFromComplex(value,derivative,logScale=0){
  const m=abs(value),q=derivative?div(derivative,value):C(NaN,NaN);
  return {valid:finiteComplex(value),logAbs:m>0?Math.log(m)+logScale:-Infinity,arg:Math.atan2(value.im,value.re),q,
    derivativeLogAbs:derivative?Math.log(abs(derivative))+logScale:undefined,value};
}
function productRecord(sigma,t,roots){
  let logAbs=0,arg=0,q=C();
  for(const p of roots){const d=C(sigma-p.sigma,t-p.t),r=abs(d);logAbs+=Math.log(r);arg+=Math.atan2(d.im,d.re);q=add(q,div(C(1),d));}
  return {valid:true,logAbs,arg:wrap(arg),q};
}

// Minimum-total-displacement labeling of ≤8 numerical polynomial roots.
// Through a multiple root there is no canonical particle identity; this only
// keeps a continuous choice of display labels whenever a nearby choice exists.
function matchRoots(previous,roots){
  const n=roots.length;if(previous.length!==n||n>8)return roots;
  const count=1<<n,cost=new Float64Array(count).fill(Infinity),chosen=new Int8Array(count).fill(-1);cost[0]=0;
  for(let mask=0;mask<count;mask++){
    let i=0;for(let b=mask;b;b&=b-1)i++;
    if(i===n)continue;
    for(let j=0;j<n;j++)if(!(mask&(1<<j))){
      const sigma=.5-roots[j].im/2,t=FIRST_ZERO+roots[j].re/2,next=mask|(1<<j);
      const c=cost[mask]+(previous[i].sigma-sigma)**2+(previous[i].t-t)**2;
      if(c<cost[next]){cost[next]=c;chosen[next]=j;}
    }
  }
  if(chosen[count-1]<0)return roots;
  const result=new Array(n);let mask=count-1;
  for(let i=n-1;i>=0;i--){const j=chosen[mask];result[i]=roots[j];mask^=1<<j;}
  return result;
}

export class DynamicsSimulation{
  constructor(config={},options={}){
    this.sampler=options.sampler||((sigma,t)=>evaluatePolar(sigma,t,'xi',0,true));
    this.reset(config);
  }
  reset(input=this.config){
    this.config=normalizeDynamicsConfig(input);this.mode=this.config.dynamicsMode;
    this.stepIndex=0;this.time=0;this.random=randomGenerator(this.config.dynamicsSeed);
    const widePolynomial=this.mode==='collision'&&this.config.dynamicsPolynomial!=='cubic';
    this.domain=this.config.domain||{sigmaMin:this.mode==='collision'?(widePolynomial?-3:-1.5):-.75,sigmaMax:this.mode==='collision'?(widePolynomial?4:2.5):1.75,
      tMin:FIRST_ZERO-(this.mode==='collision'?3.6:3.2),tMax:FIRST_ZERO+(this.mode==='collision'?3.6:3.2)};
    this.particles=[];this.zeros=[];this.field=null;this.fieldVersion=0;this.stopped=false;
    this.status=this.mode==='off'?'Choose a dynamics experiment.':'Ready';this.clippedSteps=0;this.boundaryHits=0;
    this.heatRe=null;this.heatIm=null;this.heatScale=0;this.heatInitialEnergy=null;this.polynomial=null;this.cancelGrid=null;
    this._initialiseParticles();
    if(this.mode==='trap')this._initialiseTrap();
    if(this.mode==='collision')this._setPolynomial();
    if(this.mode==='heat')this._initialiseHeat();
    if(this.mode==='cancel')this._initialiseCancellation();
    this._refreshField();this._updateSnapshot();return this.cachedSnapshot;
  }
  _initialiseParticles(){
    if(['off','trap','collision'].includes(this.mode))return;
    const d=this.domain,w=d.sigmaMax-d.sigmaMin,h=d.tMax-d.tMin;
    for(let id=0;id<this.config.particles;id++){
      let sigma=d.sigmaMin+w*(.08+.84*this.random()),t=d.tMin+h*(.08+.84*this.random());
      if(id<8&&!this.config.domain){const angle=TAU*id/8+.2*this.random(),r=.3+.5*this.random();sigma=.5+r*Math.cos(angle);t=FIRST_ZERO+r*Math.sin(angle);}
      this.particles.push({id,sigma,t,vx:0,vy:0,trapped:false,escaped:false,trail:[[sigma,t]]});
    }
  }
  _initialiseTrap(){
    const heights=[14.134725141734693,21.022039638771554,25.01085758014569,30.424876125859513,32.93506158773919,37.586178158825675];
    const mean=heights.reduce((a,b)=>a+b,0)/heights.length,meanGap=(heights.at(-1)-heights[0])/(heights.length-1);
    this.particles=heights.map((g,id)=>{
      const sigma=.5+.55*this.config.dynamicsPerturbation*(2*this.random()-1),t=FIRST_ZERO+(g-mean)/meanGap;
      return {id,sigma,t,vx:0,vy:0,trapped:false,escaped:false,trail:[[sigma,t]]};
    });
    this.trapOmega=Math.PI*Math.PI/2; // Initial unfolded g=2(t−center) has mean spacing 2.
  }
  _setPolynomial(){
    // A triangular sweep reproduces the Math Explorer [−1.6,.8] controls.
    const u=(this.time*.15)%4.8;this.tau=.8-(u<=2.4?u:4.8-u);
    if(this.config.dynamicsPolynomial==='cubic'){
      const cubic=cubicHeat(this.tau);this.polynomial=cubic.coefficients;this.modelRoots=cubic.roots;
    }else{
      this.polynomial=polynomialHeat(polynomialFromRoots(POLYNOMIAL_PRESETS[this.config.dynamicsPolynomial]),this.tau);
      this.modelRoots=polynomialRoots(this.polynomial);
    }
    const previous=this.particles;this.modelRoots=matchRoots(previous,this.modelRoots);
    this.particles=this.modelRoots.map((z,id)=>{
      const sigma=.5-z.im/2,t=FIRST_ZERO+z.re/2,old=previous[id];
      const trail=old?old.trail.slice():[];trail.push([sigma,t]);if(trail.length>100)trail.shift();
      return {id,sigma,t,vx:old?(sigma-old.sigma)/DT:0,vy:old?(t-old.t)/DT:0,trapped:false,escaped:false,trail,residual:z.residual};
    });
  }
  _initialiseHeat(){
    const w=this.config.gridWidth,h=this.config.gridHeight,d=this.domain,raw=[];
    let max=-Infinity;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const p=this.sampler(d.sigmaMin+(d.sigmaMax-d.sigmaMin)*x/(w-1),d.tMin+(d.tMax-d.tMin)*y/(h-1));
      raw.push(p);if(p.valid&&Number.isFinite(p.logAbs))max=Math.max(max,p.logAbs);
    }
    this.heatScale=Number.isFinite(max)?max:0;
    this.heatRe=new Float64Array(w*h);this.heatIm=new Float64Array(w*h);
    const a=TAU*this.random(),b=TAU*this.random(),eps=this.config.dynamicsPerturbation;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const k=y*w+x,p=raw[k],m=p.valid&&Number.isFinite(p.logAbs)?Math.exp(p.logAbs-this.heatScale):0;
      const X=x/(w-1),Y=y/(h-1),window=Math.sin(Math.PI*X)*Math.sin(Math.PI*Y);
      this.heatRe[k]=m*Math.cos(p.arg||0)+eps*window*Math.cos(TAU*X+a)*Math.cos(Math.PI*Y+b);
      this.heatIm[k]=m*Math.sin(p.arg||0)+eps*window*Math.sin(TAU*Y+b)*Math.cos(Math.PI*X+a);
    }
    this.heatPinnedRe=this.heatRe.slice();this.heatPinnedIm=this.heatIm.slice();
  }
  _cancellationPair(sigma,t){
    const a=this.config.dynamicsShift,c=this.config.dynamicsAmplitude;
    const U=this.sampler(sigma+a,t),V=c?this.sampler(sigma-a,t):null;
    if(!U.valid||(c&&!V.valid))return null;
    if(c===0)return {unshifted:U};
    const logScale=Math.max(U.logAbs,V.logAbs+Math.log(c));
    if(!Number.isFinite(logScale))return null;
    const um=Math.exp(U.logAbs-logScale);
    const u=C(um*Math.cos(U.arg),um*Math.sin(U.arg));
    const scaledVm=Math.exp(V.logAbs+Math.log(c)-logScale);
    const v=C(scaledVm*Math.cos(V.arg),scaledVm*Math.sin(V.arg));
    return {u,v,du:mul(u,U.q||C(NaN,NaN)),dv:mul(v,V.q||C(NaN,NaN)),logScale};
  }
  _mixCancellation(pair){
    if(!pair)return {valid:false,logAbs:NaN,arg:NaN,q:C(NaN,NaN)};
    if(pair.unshifted)return pair.unshifted;
    const phi=this.config.dynamicsPhase+this.config.dynamicsPhaseRate*this.time,p=C(Math.cos(phi),Math.sin(phi));
    return polarFromComplex(sub(pair.u,mul(p,pair.v)),sub(pair.du,mul(p,pair.dv)),pair.logScale);
  }
  _initialiseCancellation(){
    const w=this.config.gridWidth,h=this.config.gridHeight,d=this.domain;
    this.cancelGrid=[];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)this.cancelGrid.push(this._cancellationPair(
      d.sigmaMin+(d.sigmaMax-d.sigmaMin)*x/(w-1),d.tMin+(d.tMax-d.tMin)*y/(h-1)));
  }
  _analyticSample(sigma,t){
    if(this.mode==='trap')return productRecord(sigma,t,this.particles);
    if(this.mode==='collision'){
      const p=polynomialEvaluate(this.polynomial,C(2*(t-FIRST_ZERO),-2*(sigma-.5)));
      return polarFromComplex(p.value,mul(C(0,-2),p.derivative));
    }
    if(this.mode!=='cancel')return this.sampler(sigma,t);
    return this._mixCancellation(this._cancellationPair(sigma,t));
  }
  _heatSample(sigma,t){
    const w=this.config.gridWidth,h=this.config.gridHeight,d=this.domain,dx=(d.sigmaMax-d.sigmaMin)/(w-1),dy=(d.tMax-d.tMin)/(h-1);
    const X=clamp((sigma-d.sigmaMin)/dx,0,w-1),Y=clamp((t-d.tMin)/dy,0,h-1);
    const x=Math.min(w-2,Math.floor(X)),y=Math.min(h-2,Math.floor(Y)),a=X-x,b=Y-y;
    const read=arr=>{
      const f00=arr[y*w+x],f10=arr[y*w+x+1],f01=arr[(y+1)*w+x],f11=arr[(y+1)*w+x+1];
      return {v:(1-b)*((1-a)*f00+a*f10)+b*((1-a)*f01+a*f11),
        x:((1-b)*(f10-f00)+b*(f11-f01))/dx,y:((1-a)*(f01-f00)+a*(f11-f10))/dy};
    };
    const re=read(this.heatRe),im=read(this.heatIm),norm=re.v*re.v+im.v*im.v;
    const gu={x:(re.v*re.x+im.v*im.x)/norm,y:(re.v*re.y+im.v*im.y)/norm};
    const gp={x:(re.v*im.x-im.v*re.x)/norm,y:(re.v*im.y-im.v*re.y)/norm};
    const det=re.x*im.y-re.y*im.x;
    const rootDistance=Math.abs(det)>1e-20?Math.hypot((im.y*re.v-re.y*im.v)/det,(-im.x*re.v+re.x*im.v)/det):Infinity;
    return {valid:true,logAbs:.5*Math.log(norm)+this.heatScale,arg:Math.atan2(im.v,re.v),q:C(NaN,NaN),gradientLog:gu,gradientPhase:gp,rootDistance,
      value:C(re.v,im.v),derivatives:{re,im},analytic:false};
  }
  sample(sigma,t){return this.mode==='heat'?this._heatSample(sigma,t):this._analyticSample(sigma,t);}
  _parameters(){return {alpha:this.mode==='phase'?0:this.config.dynamicsAlpha,beta:this.mode==='relax'?0:this.config.dynamicsBeta,maxSpeed:1.5};}
  _velocity(sigma,t){return flowVector(this.sample(sigma,t),this._parameters());}
  _boundary(p){
    const d=this.domain;let hit=false;
    for(const [key,lo,hi] of [['sigma',d.sigmaMin,d.sigmaMax],['t',d.tMin,d.tMax]]){
      if(p[key]<lo||p[key]>hi){hit=true;if(this.config.dynamicsBoundary==='pin'){p[key]=clamp(p[key],lo,hi);p.escaped=true;}
        else{const length=hi-lo;let u=((p[key]-lo)%(2*length)+2*length)%(2*length);p[key]=lo+(u<=length?u:2*length-u);}}
    }
    if(hit)this.boundaryHits++;
  }
  _advanceTracers(){
    const noise=this.mode==='walk'?Math.sqrt(2*this.config.dynamicsDiffusion*DT):0;
    for(const p of this.particles){
      if(p.trapped||p.escaped)continue;
      const rec=this.sample(p.sigma,p.t),distance=newtonDistance(rec);
      const capture=!['phase','walk','heat'].includes(this.mode)&&this.config.dynamicsAlpha>0&&!(this.mode==='cancel'&&this.config.dynamicsPhaseRate>0);
      if(capture&&distance<.025){
        let sigma=p.sigma,t=p.t,candidate=rec;
        for(let iter=0;iter<8&&newtonDistance(candidate)>1e-10;iter++){
          if(!finiteComplex(candidate.q))break;
          const delta=div(C(1),candidate.q);if(!finiteComplex(delta))break;
          sigma-=delta.re;t-=delta.im;
          if(Math.hypot(sigma-p.sigma,t-p.t)>.05)break;
          candidate=this.sample(sigma,t);
        }
        const d=this.domain;
        const rootEvidence=newtonDistance(candidate)<distance*.01
          ||this.zeros.some(z=>z.residual<1e-7&&Math.hypot(z.sigma-sigma,z.t-t)<1e-5)
          ||(candidate.logAbs===-Infinity&&Number.isFinite(candidate.derivativeLogAbs));
        if(rootEvidence&&newtonDistance(candidate)<1e-7&&Math.hypot(sigma-p.sigma,t-p.t)<=.05&&sigma>=d.sigmaMin&&sigma<=d.sigmaMax&&t>=d.tMin&&t<=d.tMax){
          p.sigma=sigma;p.t=t;p.trapped=true;p.vx=p.vy=0;p.trail.push([p.sigma,p.t]);continue;
        }
      }
      const k1=this._velocity(p.sigma,p.t),k2=this._velocity(p.sigma+DT*k1.x/2,p.t+DT*k1.y/2);
      const k3=this._velocity(p.sigma+DT*k2.x/2,p.t+DT*k2.y/2),k4=this._velocity(p.sigma+DT*k3.x,p.t+DT*k3.y);
      p.vx=(k1.x+2*k2.x+2*k3.x+k4.x)/6;p.vy=(k1.y+2*k2.y+2*k3.y+k4.y)/6;
      if([k1,k2,k3,k4].some(k=>k.clipped))this.clippedSteps++;
      p.sigma+=DT*p.vx;p.t+=DT*p.vy;
      if(noise){const [a,b]=normalPair(this.random);p.sigma+=noise*a;p.t+=noise*b;}
      this._boundary(p);p.trail.push([p.sigma,p.t]);if(p.trail.length>100)p.trail.shift();
    }
  }
  _advanceHeat(){
    const w=this.config.gridWidth,h=this.config.gridHeight,d=this.domain,D=this.config.dynamicsDiffusion;
    if(D===0)return;
    const dx=(d.sigmaMax-d.sigmaMin)/(w-1),dy=(d.tMax-d.tMin)/(h-1),ix=1/(dx*dx),iy=1/(dy*dy);
    const substeps=Math.max(1,Math.ceil(2*D*DT*(ix+iy)/.9)),delta=DT/substeps;
    this.heatSubsteps=substeps;
    for(let n=0;n<substeps;n++){
      const rr=new Float64Array(w*h),ii=new Float64Array(w*h),a=D*delta;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const k=y*w+x,boundary=x===0||x===w-1||y===0||y===h-1;
        if(boundary&&this.config.dynamicsBoundary==='pin'){rr[k]=this.heatPinnedRe[k];ii[k]=this.heatPinnedIm[k];continue;}
        let lr=0,li=0;
        if(x>0){lr+=(this.heatRe[k-1]-this.heatRe[k])*ix;li+=(this.heatIm[k-1]-this.heatIm[k])*ix;}
        if(x<w-1){lr+=(this.heatRe[k+1]-this.heatRe[k])*ix;li+=(this.heatIm[k+1]-this.heatIm[k])*ix;}
        if(y>0){lr+=(this.heatRe[k-w]-this.heatRe[k])*iy;li+=(this.heatIm[k-w]-this.heatIm[k])*iy;}
        if(y<h-1){lr+=(this.heatRe[k+w]-this.heatRe[k])*iy;li+=(this.heatIm[k+w]-this.heatIm[k])*iy;}
        rr[k]=this.heatRe[k]+a*lr;ii[k]=this.heatIm[k]+a*li;
      }
      this.heatRe=rr;this.heatIm=ii;
    }
  }
  _advanceTrap(){
    if(this.stopped)return;
    let min=Infinity;for(let j=0;j<this.particles.length;j++)for(let k=j+1;k<this.particles.length;k++)min=Math.min(min,Math.hypot(this.particles[j].sigma-this.particles[k].sigma,this.particles[j].t-this.particles[k].t));
    if(min<.045){this.stopped=true;this.status='Finite model stopped near a collision; use polynomial heat to cross an exact collision.';return;}
    const options={kappa:this.config.dynamicsKappa,perturbation:this.config.dynamicsPerturbation,forcing:this.config.dynamicsForcing,time:this.time,omega:this.trapOmega};
    const a=finiteZeroVelocity(this.particles,options);
    const middle=this.particles.map((p,j)=>({...p,sigma:p.sigma+DT*a[j].x/2,t:p.t+DT*a[j].y/2}));
    const b=finiteZeroVelocity(middle,{...options,time:this.time+DT/2});
    for(let j=0;j<this.particles.length;j++){
      const p=this.particles[j],speed=Math.hypot(b[j].x,b[j].y),f=speed>3?3/speed:1;
      if(f<1)this.clippedSteps++;p.vx=b[j].x*f;p.vy=b[j].y*f;p.sigma+=DT*p.vx;p.t+=DT*p.vy;
      this._boundary(p);p.trail.push([p.sigma,p.t]);if(p.trail.length>100)p.trail.shift();
    }
  }
  step(count=1){
    count=Math.min(MAX_STEPS-this.stepIndex,Math.max(0,Math.floor(Number(count)||0)));
    if(this.mode==='off')return this.cachedSnapshot;
    for(let n=0;n<count;n++){
      if(this.mode==='heat'){this._advanceHeat();this._advanceTracers();}
      else if(this.mode==='trap')this._advanceTrap();
      else if(this.mode!=='collision')this._advanceTracers();
      this.stepIndex++;this.time=this.stepIndex*DT;
      if(this.mode==='collision')this._setPolynomial();
    }
    if(['cancel','heat','trap','collision'].includes(this.mode))this._refreshField();
    if(this.stepIndex===MAX_STEPS)this.status='Replay limit reached; reset to start again.';
    else if(!this.stopped)this.status='Running a deterministic fixed-step experiment.';
    this._updateSnapshot();return this.cachedSnapshot;
  }
  _refineZero(sigma,t,cell){
    for(let iter=0;iter<12;iter++){
      const p=this.sample(sigma,t);let dx,dy;
      if(this.mode==='heat'){
        const {re,im}=p.derivatives,det=re.x*im.y-re.y*im.x;
        if(Math.abs(det)<1e-18)break;dx=(im.y*re.v-re.y*im.v)/det;dy=(-im.x*re.v+re.x*im.v)/det;
      }else{if(!finiteComplex(p.q)||abs(p.q)===0)break;const delta=div(C(1),p.q);dx=delta.re;dy=delta.im;}
      const max=Math.max(cell.dx,cell.dy),length=Math.hypot(dx,dy),f=length>max?max/length:1;
      sigma-=dx*f;t-=dy*f;if(length<1e-10)break;
    }
    const d=this.domain;if(sigma<d.sigmaMin||sigma>d.sigmaMax||t<d.tMin||t>d.tMax)return null;
    const p=this.sample(sigma,t),distance=newtonDistance(p);
    if(!Number.isFinite(distance)||distance>1e-6)return null;
    return {sigma,t,winding:cell.winding,residual:distance,status:this.mode==='heat'?'Grid-interpolated vortex':'Numerically refined zero'};
  }
  _refreshField(){
    if(this.mode==='off'){this.field=null;this.zeros=[];return;}
    const w=this.config.gridWidth,h=this.config.gridHeight,d=this.domain,dx=(d.sigmaMax-d.sigmaMin)/(w-1),dy=(d.tMax-d.tMin)/(h-1),n=w*h;
    const field={width:w,height:h,phase:new Float32Array(n),logAbs:new Float32Array(n),valid:new Uint8Array(n),velocityX:new Float32Array(n),velocityY:new Float32Array(n),revision:this.stepIndex,domain:d};
    if(this.mode==='heat'){field.re=this.heatRe.slice();field.im=this.heatIm.slice();field.logScale=this.heatScale;}
    let lo=Infinity,hi=-Infinity;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const k=y*w+x,p=this.mode==='cancel'?this._mixCancellation(this.cancelGrid[k]):this.sample(d.sigmaMin+x*dx,d.tMin+y*dy),v=flowVector(p,this._parameters());
      field.valid[k]=p.valid?1:0;field.phase[k]=p.arg;field.logAbs[k]=p.logAbs;field.velocityX[k]=v.x;field.velocityY[k]=v.y;
      if(Number.isFinite(p.logAbs)){lo=Math.min(lo,p.logAbs);hi=Math.max(hi,p.logAbs);}
    }
    field.logMin=lo;field.logMax=hi;this.field=field;this.fieldVersion=this.stepIndex;
    if(['trap','collision'].includes(this.mode)){
      this.zeros=this.particles.map(p=>({sigma:p.sigma,t:p.t,winding:1,residual:p.residual??0,status:this.mode==='collision'?'Polynomial model zero':'Finite model zero'}));return;
    }
    const zeros=[];this.unresolvedWindingCells=0;
    for(let y=0;y<h-1;y++)for(let x=0;x<w-1;x++){
      const ids=[y*w+x,y*w+x+1,(y+1)*w+x+1,(y+1)*w+x];
      if(!ids.every(k=>field.valid[k]))continue;
      let angle=0;for(let j=0;j<4;j++)angle+=wrap(field.phase[ids[(j+1)%4]]-field.phase[ids[j]]);
      const winding=Math.round(angle/TAU);if(!winding)continue;
      const z=this._refineZero(d.sigmaMin+(x+.5)*dx,d.tMin+(y+.5)*dy,{dx,dy,winding});
      if(!z)this.unresolvedWindingCells++;
      if(z&&!zeros.some(q=>Math.hypot(q.sigma-z.sigma,q.t-z.t)<Math.min(dx,dy)/3))zeros.push(z);
    }
    this.zeros=zeros;
  }
  _diagnostics(){
    const diagnostics={step:this.stepIndex,time:this.time,dt:DT,seed:this.config.dynamicsSeed,
      particles:this.particles.length,trapped:this.particles.filter(p=>p.trapped).length,detectedZeros:this.zeros.length,
      clippedTracerSteps:this.clippedSteps,boundaryHits:this.boundaryHits,unresolvedWindingCells:this.unresolvedWindingCells||0};
    if(this.mode==='cancel')Object.assign(diagnostics,{effectivePhase:((this.config.dynamicsPhase+this.config.dynamicsPhaseRate*this.time)%TAU+TAU)%TAU,phaseRate:this.config.dynamicsPhaseRate});
    if(this.mode==='walk')diagnostics.diffusion=this.config.dynamicsDiffusion;
    if(this.mode==='heat'){
      const w=this.config.gridWidth,h=this.config.gridHeight,d=this.domain,dx=(d.sigmaMax-d.sigmaMin)/(w-1),dy=(d.tMax-d.tMin)/(h-1);
      let massRe=0,massIm=0,energy=0,dirichletEnergy=0;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const k=y*w+x,r=this.heatRe[k],i=this.heatIm[k];massRe+=r;massIm+=i;energy+=r*r+i*i;
        if(x<w-1)dirichletEnergy+=((r-this.heatRe[k+1])**2+(i-this.heatIm[k+1])**2)/(dx*dx);
        if(y<h-1)dirichletEnergy+=((r-this.heatRe[k+w])**2+(i-this.heatIm[k+w])**2)/(dy*dy);
      }
      Object.assign(diagnostics,{massRe:massRe*dx*dy,massIm:massIm*dx*dy,energy:energy*dx*dy,dirichletEnergy:dirichletEnergy*dx*dy,
        diffusion:this.config.dynamicsDiffusion,substeps:this.heatSubsteps||0,logAmplitudeScale:this.heatScale,boundary:this.config.dynamicsBoundary});
    }
    if(this.mode==='trap'){
      const n=this.particles.length,A=Array.from({length:n},()=>new Array(n).fill(0));let minimumGap=Infinity,minimumHeightGap=Infinity;
      for(let j=0;j<n;j++){
        A[j][j]=trapKappa(this.particles[j].t,{kappa:this.config.dynamicsKappa,perturbation:this.config.dynamicsPerturbation});
        for(let k=0;k<n;k++)if(k!==j){const dy=this.particles[j].t-this.particles[k].t,w=.5/Math.max(1e-16,dy*dy);A[j][j]-=w;A[j][k]+=w;
          minimumHeightGap=Math.min(minimumHeightGap,Math.abs(dy));
          minimumGap=Math.min(minimumGap,Math.hypot(this.particles[j].sigma-this.particles[k].sigma,dy));}
      }
      Object.assign(diagnostics,{transverseEnergy:this.particles.reduce((s,p)=>s+(p.sigma-.5)**2,0),
        linearMargin:minimumHeightGap>1e-6?minimumEigenvalue(A):null,minimumGap,minimumHeightGap,
        marginStatus:minimumHeightGap>1e-6?'Instantaneous transverse linearization':'Undefined at coincident projected heights',
        nearAxis:this.particles.filter(p=>Math.abs(p.sigma-.5)<.01).length,
        kappa:this.config.dynamicsKappa,forcing:this.config.dynamicsForcing,stopped:this.stopped});
    }
    if(this.mode==='collision')Object.assign(diagnostics,{tau:this.tau,polynomial:this.config.dynamicsPolynomial,
      coefficientDegree:this.polynomial.length-1,maxRootResidual:Math.max(...this.modelRoots.map(r=>r.residual)),
      offAxisZeros:this.modelRoots.filter(z=>Math.abs(z.im)>1e-6).length,
      collisionTime:this.config.dynamicsPolynomial==='cubic'?1/6:'Preset dependent'});
    return diagnostics;
  }
  _updateSnapshot(){
    const particles=this.particles.map(p=>({...p,trail:p.trail.map(q=>q.slice())}));
    this.cachedSnapshot={mode:this.mode,step:this.stepIndex,time:this.time,dt:DT,maxSteps:MAX_STEPS,domain:{...this.domain},
      field:this.field,grid:this.field,fieldVersion:this.fieldVersion,particles,trails:particles.map(p=>p.trail),
      zeros:this.zeros.map(z=>({...z})),diagnostics:this._diagnostics(),status:this.status,stopped:this.stopped,
      meta:{...META[this.mode],axes:{x:'σ',y:'t'},source:this.mode==='collision'||this.mode==='trap'?'Math Explorer finite-model conventions':'Zeta renderer evaluated ξ and explicitly identified extensions',
        sampling:'IEEE-754 numerical samples; winding-cell detections are not a completeness certificate.',velocityCap:1.5},
      model:['trap','heat','collision'].includes(this.mode),source:META[this.mode].kind};
  }
  snapshot(){return this.cachedSnapshot;}
}
