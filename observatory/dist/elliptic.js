/**
 * Exact elliptic double-cover coordinates used by Math Explorer PRs #43/#49.
 *
 * E_r: eta^2=(w^2+r^2)(w^2+r^-2), r>1.
 * z=4K(m)u+2iK(1-m)(v-1/2), m=r^-4.
 * w=(i/r)sn(z|m), eta=cn(z|m)dn(z|m), s0=1/(1-w).
 *
 * The optional, EXPLICIT spectral lens is s=1/2+scale(s0-1/2).
 * scale=1 is the literal studied pullback. Other scales preserve the
 * s -> 1-s symmetry, critical ovals, and anti-bridge value s=1/2, but
 * change the finite branch values in the displayed s-plane. They are not
 * an identity of zeta. The R^3 torus embedding is a display embedding.
 *
 * Source, immutable research checkpoint:
 * https://github.com/judegomila/zeta-explorer/blob/b7f045a34a194d852b645868ea0b8996d64ec2dd/rigorous/theta-bridge-2026-11-08/geometry_and_twistors.md
 * Jacobi theta quotient sn=(theta3(0)/theta2(0))*theta1(phi)/theta4(phi),
 * phi=pi*z/(2K). Ordinary IEEE-754 arithmetic, not interval arithmetic.
 */

const TAU=2*Math.PI;
const cache=new Map();
const C=(re=0,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im);
const sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scl=(a,x)=>C(a.re*x,a.im*x);
const abs=a=>Math.hypot(a.re,a.im);
const div=(a,b)=>{const q=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/q,(a.im*b.re-a.re*b.im)/q);};
const sin=z=>C(Math.sin(z.re)*Math.cosh(z.im),Math.cos(z.re)*Math.sinh(z.im));
const cos=z=>C(Math.cos(z.re)*Math.cosh(z.im),-Math.sin(z.re)*Math.sinh(z.im));
const unit=x=>((x%1)+1)%1;

/** Complete elliptic integral K with PARAMETER m, not modulus sqrt(m). */
export function ellipticK(m){
  if(!(m>=0&&m<1)) return NaN;
  let a=1,b=Math.sqrt(1-m);
  for(let i=0;i<32;i++){
    const an=(a+b)/2,bn=Math.sqrt(a*b);
    a=an;b=bn;
    if(Math.abs(a-b)<2e-16*a)break;
  }
  return Math.PI/(2*a);
}

export function torusParameters(r=1.6){
  if(!(r>1.000000001&&r<=100))throw new RangeError('Elliptic shape r must be greater than 1 and at most 100.');
  if(cache.has(r))return cache.get(r);
  const m=r**-4,K=ellipticK(m),Kprime=ellipticK(1-m),q=Math.exp(-Math.PI*Kprime/K),logq=Math.log(q);
  let t2=0,t3=1;
  for(let n=0;n<64;n++){
    const a=2*Math.exp((n+.5)**2*logq);t2+=a;
    if(n>0)t3+=2*Math.exp(n*n*logq);
    if(n>6&&a<1e-30)break;
  }
  const p={r,m,K,Kprime,q,logq,thetaRatio:t3/t2,periodReal:4*K,periodImag:2*Kprime};
  cache.set(r,p);return p;
}

function thetaAtZ(z,p){
  // Reduce to the true common period rectangle BEFORE hyperbolic functions.
  // sn and eta are periodic under 4K and 2iK'. The ratio formulation also
  // handles a pole of sn (w=infinity) as the regular s0=0 point.
  const zr=z.re-Math.round(z.re/p.periodReal)*p.periodReal;
  const zi=z.im-Math.round(z.im/p.periodImag)*p.periodImag;
  const phi=C(Math.PI*zr/(2*p.K),Math.PI*zi/(2*p.K));
  let t1=C(),t1d=C(),t4=C(1),t4d=C();
  for(let n=0;n<64;n++){
    const k=2*n+1,a=2*(n%2?-1:1)*Math.exp((n+.5)**2*p.logq);
    const arg=scl(phi,k);
    t1=add(t1,scl(sin(arg),a));t1d=add(t1d,scl(cos(arg),a*k));
    if(n>0){
      const b=2*(n%2?-1:1)*Math.exp(n*n*p.logq),arg4=scl(phi,2*n);
      t4=add(t4,scl(cos(arg4),b));t4d=sub(t4d,scl(sin(arg4),b*2*n));
    }
    // Bound magnitude of the next terms including complex-argument growth.
    const exponent=(n+.5)**2*p.logq+(2*n+1)*Math.abs(phi.im);
    if(n>8&&exponent < -48)break;
  }
  const c=p.thetaRatio/p.r,dphi=Math.PI/(2*p.K);
  const N=C(-c*t1.im,c*t1.re),D=t4;
  const Nd=C(-c*t1d.im*dphi,c*t1d.re*dphi),Dd=scl(t4d,dphi);
  return {N,D,Nd,Dd};
}

export function torusPoint(u,v,{r=1.6,scale=24}={}){
  if(!Number.isFinite(u)||!Number.isFinite(v)||!(scale>0&&Number.isFinite(scale)))return {sigma:NaN,t:NaN,w:C(NaN,NaN),eta:C(NaN,NaN),valid:false};
  const p=torusParameters(r),z=C(4*p.K*unit(u),2*p.Kprime*(unit(v)-.5));
  const {N,D,Nd,Dd}=thetaAtZ(z,p),den=sub(D,N),denAbs=abs(den);
  const w=abs(D)>1e-14?div(N,D):C(Infinity,Infinity);
  const determinant=sub(mul(Nd,D),mul(N,Dd));
  const wp=abs(D)>1e-14?div(determinant,mul(D,D)):C(Infinity,Infinity);
  const eta=C(r*wp.im,-r*wp.re);
  if(denAbs<1e-12*(1+abs(D)+abs(N)))return {sigma:NaN,t:NaN,w,eta,valid:false,puncture:true};
  const s0=div(D,den),dsdz=scl(div(determinant,mul(den,den)),scale);
  const sigma=.5+scale*(s0.re-.5),t=scale*s0.im;
  return {sigma,t,w,eta,valid:Number.isFinite(sigma)&&Number.isFinite(t),s0,
    dsdz,dsdu:scl(dsdz,4*p.K),dsdv:C(-dsdz.im*2*p.Kprime,dsdz.re*2*p.Kprime)};
}

/**
 * Both preimages of a finite spectral point. Newton solves a projective theta
 * equation, so w=infinity is regular. Returned roots have an independently
 * evaluated s residual; failure returns [] rather than a fabricated location.
 */
export function torusInverse(sigma,t,{r=1.6,scale=24}={}){
  if(!Number.isFinite(sigma)||!Number.isFinite(t)||!(scale>0))return [];
  const p=torusParameters(r),s0=C(.5+(sigma-.5)/scale,t/scale);
  const a=sub(s0,C(1));
  const seeds=[];
  // The two critical ovals are natural seeds for the research strip.
  for(const v of [.25,.75,.5,.08,.92])for(const u of [.0625,.1875,.3125,.4375,.5625,.6875,.8125,.9375])seeds.push([u,v]);
  let found=null;
  for(const [su,sv] of seeds){
    let z=C(4*p.K*su,2*p.Kprime*(sv-.5));
    for(let iter=0;iter<32;iter++){
      const {N,D,Nd,Dd}=thetaAtZ(z,p);
      const f=sub(mul(a,D),mul(s0,N)),fp=sub(mul(a,Dd),mul(s0,Nd));
      if(abs(fp)<1e-18)break;
      let step=div(f,fp);const sz=abs(step),maxStep=Math.min(p.K,p.Kprime);
      if(sz>maxStep)step=scl(step,maxStep/sz);
      z=sub(z,step);
      z.re=unit(z.re/(4*p.K))*4*p.K;
      z.im=(unit(z.im/(2*p.Kprime)+.5)-.5)*2*p.Kprime;
      if(abs(step)<2e-13)break;
    }
    const u=unit(z.re/(4*p.K)),v=unit(.5+z.im/(2*p.Kprime));
    const pt=torusPoint(u,v,{r,scale}),residual=Math.hypot(pt.sigma-sigma,pt.t-t);
    if(pt.valid&&residual<1e-8*(1+Math.hypot(sigma,t))){found={u,v,residual};break;}
  }
  if(!found)return [];
  // Deck transformation z -> 2K-z preserves w and reverses eta.
  const other={u:unit(.5-found.u),v:unit(1-found.v)};
  const pt=torusPoint(other.u,other.v,{r,scale});
  other.residual=Math.hypot(pt.sigma-sigma,pt.t-t);
  const du=Math.min(Math.abs(found.u-other.u),1-Math.abs(found.u-other.u));
  const dv=Math.min(Math.abs(found.v-other.v),1-Math.abs(found.v-other.v));
  return du+dv<1e-8?[found]:[found,other];
}

export function torusLandmarks({r=1.6,scale=24}={}){
  const branches=[{u:.25,v:.5,label:'+i/r'},{u:.75,v:.5,label:'−i/r'},
    {u:.25,v:0,label:'+ir'},{u:.75,v:0,label:'−ir'}].map(q=>({...q,...torusPoint(q.u,q.v,{r,scale})}));
  return {
    criticalOvals:[.25,.75],
    punctures:[{u:0,v:.25,label:'p+ · infinity'},{u:.5,v:.75,label:'p− · infinity'}],
    antiBridge:[{u:.5,v:.25,label:'q− · s=½'},{u:0,v:.75,label:'q+ · s=½'}],
    branches,scale,
  };
}

/**
 * A point on either complete critical oval, including its geometric puncture.
 * Both ovals have the SAME spectral orientation: q=0+ is +i infinity and
 * q=1- is -i infinity. The second oval is the exact deck lift of the first.
 * The critical condition is imposed analytically, not by finding a noisy
 * sigma=.5 contour through interpolated samples.
 *
 * At q=0 or 1 the base curve exists but the scalar pullback is undefined.
 * Return a puncture flag instead of manufacturing a limiting complex value.
 */
export function torusCriticalPoint(q,oval=0,{r=1.6,scale=24}={}){
  if(!Number.isFinite(q)||q<0||q>1||!Number.isInteger(oval)||oval<0||oval>1)
    throw new RangeError('Critical oval coordinates require 0<=q<=1 and oval 0 or 1.');
  const u=unit(oval===0?q:.5-q),v=oval===0?.25:.75;
  if(q===0||q===1)return {q,u,v,sigma:.5,t:q===0?Infinity:-Infinity,
    w:C(1),eta:C((oval===0?1:-1)*(r+1/r)),valid:false,puncture:true};
  const p=torusPoint(u,v,{r,scale});
  // On |w|=1, s=.5+(i*scale/2)cot(arg(w)/2). This stable half-angle
  // evaluation avoids cancellation of D-N leaking into Re(s) near infinity.
  const theta=Math.atan2(p.w.im,p.w.re);
  const t=q===.5?0:scale/(2*Math.tan(theta/2));
  return {...p,q,u,v,sigma:.5,t,s0:C(.5,t/scale),
    valid:Number.isFinite(t),puncture:!Number.isFinite(t)};
}
