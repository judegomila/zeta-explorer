/**
 * Zeta Observatory — numerical kernel, IEEE-754 double precision.
 *
 * zeta: Euler–Maclaurin (12 Bernoulli corrections), analytic continuation
 * through the functional equation in Re(s)<-1/4. No Dirichlet-series use in
 * the critical strip and no prescribed zero placement.
 * https://dlmf.nist.gov/25.2#iii and https://dlmf.nist.gov/25.4
 *
 * heatXi(sigma,t,tau) = 8 H_tau(2t - 2i(sigma-1/2)), with the STANDARD
 * de Bruijn–Newman parameter tau, H_tau(z)=int_0^infty exp(tau*u^2)
 * Phi(u) cos(z*u) du, Phi(u)=sum_n(2*pi^2*n^4*exp(9u)
 * -3*pi*n^2*exp(5u))*exp(-pi*n^2*exp(4u)). Thus heatXi(s,0)=xi(s).
 * PDE: partial_tau F = (1/4) partial_s^2 F = -(1/4) partial_t^2 F.
 * https://terrytao.wordpress.com/2018/01/19/the-de-bruijn-newman-constant-is-non-negativ/
 *
 * Heat integration shifts the whole real contour to Im u=alpha to suppress
 * catastrophic high-frequency cancellation; the integrand is analytic in
 * |Im u|<pi/8. Evenness lets both half-lines use the rapidly converging
 * positive-real-part theta sum. Cached trapezoidal weights use h=1/256,
 * U=1.5, n<=12. Independent doubled-grid comparisons are diagnostics,
 * not interval certificates. Extended zeta/xi evaluation uses a log-polar
 * representation so overflow or underflow cannot erase the phase field.
 * Per-function tested limits are in NUMERICS.domains. See tests/ for
 * independent arbitrary-precision reference values.
 */

export const NUMERICS = Object.freeze({
  arithmetic:'IEEE-754 double', method:'Euler–Maclaurin + functional equation',
  sigmaMin:-128,sigmaMax:129,tMax:2000,heatTauMax:1,bernoulliCorrections:12,
  domains:{zeta:{sigmaMin:-128,sigmaMax:129,tMax:2000},xi:{sigmaMin:-128,sigmaMax:129,tMax:2000},heat:{sigmaMin:-128,sigmaMax:129,tMax:2000,heatTauMax:1}},
  heatStep:1/256,heatCutoff:1.5,heatTerms:12,heatExtendedMethod:'32-node Gaussian convolution; 64-node diagnostic',
  heatNormalization:'8 H_tau(2t − 2i(σ−½)); F₀(s)=ξ(s)',
  heatEquation:'∂τ F = ¼∂s²F = −¼∂t²F',
  certified:false,
  sources:['https://dlmf.nist.gov/25.2#iii','https://dlmf.nist.gov/25.4','https://terrytao.wordpress.com/2018/01/19/the-de-bruijn-newman-constant-is-non-negativ/'],
});
const PI=Math.PI, LOGPI=Math.log(PI), LOG2PI=Math.log(2*PI);
const C=(re=0,im=0)=>({re,im});
export const complex={
  add:(a,b)=>C(a.re+b.re,a.im+b.im),sub:(a,b)=>C(a.re-b.re,a.im-b.im),
  mul:(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  div:(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},
  scale:(a,b)=>C(a.re*b,a.im*b),abs:a=>Math.hypot(a.re,a.im),arg:a=>Math.atan2(a.im,a.re),
  exp:a=>{const r=Math.exp(a.re);return C(r*Math.cos(a.im),r*Math.sin(a.im))},
  log:a=>C(Math.log(Math.hypot(a.re,a.im)),Math.atan2(a.im,a.re)),
  conj:a=>C(a.re,-a.im),
};
const {add,sub,mul,div,scale,exp,log}=complex;
function sin(z){return C(Math.sin(z.re)*Math.cosh(z.im),Math.cos(z.re)*Math.sinh(z.im));}
function cos(z){return C(Math.cos(z.re)*Math.cosh(z.im),-Math.sin(z.re)*Math.sinh(z.im));}
function logSin(z){
  const ay=Math.abs(z.im),e=Math.exp(-2*ay),sg=z.im<0?-1:1;
  const a=Math.sin(z.re)*(1+e)/2,b=sg*Math.cos(z.re)*(1-e)/2;
  return C(ay+Math.log(Math.hypot(a,b)),Math.atan2(b,a));
}
function cot(z){
  const ay=Math.abs(z.im),e=Math.exp(-2*ay),sg=z.im<0?-1:1;
  return div(C(Math.cos(z.re)*(1+e),-sg*Math.sin(z.re)*(1-e)),C(Math.sin(z.re)*(1+e),sg*Math.cos(z.re)*(1-e)));
}
const LANCZOS=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
export function logGamma(re,im=0){
  const z=typeof re==='object'?re:C(re,im);
  if(z.re<.5)return sub(sub(C(LOGPI),logSin(scale(z,PI))),logGamma(1-z.re,-z.im));
  const w=C(z.re-1,z.im);let a=C(LANCZOS[0]);
  for(let i=1;i<LANCZOS.length;i++)a=add(a,div(C(LANCZOS[i]),C(w.re+i,w.im)));
  const q=C(w.re+7.5,w.im);
  return add(sub(mul(C(w.re+.5,w.im),log(q)),q),add(C(.5*LOG2PI),log(a)));
}
function digamma(z){
  if(z.re<.5)return sub(digamma(C(1-z.re,-z.im)),scale(cot(scale(z,PI)),PI));
  const w=C(z.re-1,z.im);let a=C(LANCZOS[0]),ap=C();
  for(let i=1;i<LANCZOS.length;i++){const d=C(w.re+i,w.im);a=add(a,div(C(LANCZOS[i]),d));ap=sub(ap,div(C(LANCZOS[i]),mul(d,d)));}
  const q=C(w.re+7.5,w.im);
  return add(sub(add(log(q),div(C(w.re+.5,w.im),q)),C(1)),div(ap,a));
}
const BERNOULLI=[1/6,-1/30,1/42,-1/30,5/66,-691/2730,7/6,-3617/510,43867/798,-174611/330,854513/138,-236364091/2730];
const BC=BERNOULLI.map((b,k)=>{let f=1;for(let j=2;j<=2*k+2;j++)f*=j;return b/f;});
const logCache=Array.from({length:2048},(_,i)=>i?Math.log(i):0);
function rightDirichlet(sigma,t,wantDerivative){
  const N=Math.max(16,Math.ceil(Math.pow(4e15/(sigma-1),1/(sigma-1))));
  let re=1,im=0,dr=0,di=0,cr=0,ci=0,dcr=0,dci=0;
  for(let n=2;n<=N;n++){const ln=logCache[n]??Math.log(n),a=Math.exp(-sigma*ln),p=-t*ln,vr=a*Math.cos(p),vi=a*Math.sin(p);
    let y=vr-cr,q=re+y;cr=(q-re)-y;re=q;y=vi-ci;q=im+y;ci=(q-im)-y;im=q;
    if(wantDerivative){y=-ln*vr-dcr;q=dr+y;dcr=(q-dr)-y;dr=q;y=-ln*vi-dci;q=di+y;dci=(q-di)-y;di=q;}
  }
  return wantDerivative?{value:C(re,im),derivative:C(dr,di)}:C(re,im);
}
function zetaEM(sigma,t,wantDerivative=false,extra=0){
  if(sigma>=8)return rightDirichlet(sigma,t,wantDerivative);
  const N=Math.max(32,Math.ceil(.9*Math.abs(t)+16))+extra;
  let re=0,im=0,cr=0,ci=0,dr=0,di=0,dcr=0,dci=0;
  // Kahan summation is material near a zero and near negative sigma.
  for(let n=1;n<N;n++){
    const ln=logCache[n]??Math.log(n),a=Math.exp(-sigma*ln),p=-t*ln;
    const vr=a*Math.cos(p),vi=a*Math.sin(p);
    let y=vr-cr,q=re+y;cr=(q-re)-y;re=q;y=vi-ci;q=im+y;ci=(q-im)-y;im=q;
    if(wantDerivative){y=-ln*vr-dcr;q=dr+y;dcr=(q-dr)-y;dr=q;y=-ln*vi-dci;q=di+y;dci=(q-di)-y;di=q;}
  }
  const ln=Math.log(N),q=exp(C(-sigma*ln,-t*ln)),sm1=C(sigma-1,t);
  const tail=div(scale(q,N),sm1);
  let regular=add(C(re,im),scale(q,.5));
  let dregular=wantDerivative?sub(C(dr,di),scale(q,.5*ln)):C();
  let p=C(sigma/N,t/N),dp=C(1/N);
  for(let k=0;k<BC.length;k++){
    regular=add(regular,scale(mul(q,p),BC[k]));
    if(wantDerivative)dregular=add(dregular,scale(mul(q,sub(dp,scale(p,ln))),BC[k]));
    for(let j=2*k+1;j<=2*k+2;j++){
      const factor=C((sigma+j)/N,t/N);
      dp=add(mul(dp,factor),scale(p,1/N));p=mul(p,factor);
    }
  }
  const result=add(regular,tail);
  if(!wantDerivative)return result;
  return {value:result,derivative:sub(dregular,add(scale(tail,ln),div(tail,sm1))),
    regularized:add(mul(sm1,regular),scale(q,N)),
    regularizedDerivative:sub(add(regular,mul(sm1,dregular)),scale(q,N*ln))};
}
// A shared real log scale keeps F and F' together. It is NEVER
// differentiated: analytic logarithmic derivatives are taken before decoding.
function unscale(value,logScale=0){
  const m=Math.hypot(value.re,value.im);if(m===0)return C();
  const L=Math.log(m)+logScale,arg=Math.atan2(value.im,value.re),a=Math.exp(L);
  if(a===Infinity)return C(Math.cos(arg)===0?0:Math.sign(Math.cos(arg))*Infinity,Math.sin(arg)===0?0:Math.sign(Math.sin(arg))*Infinity);
  return C(a*Math.cos(arg),a*Math.sin(arg));
}
function realSinCosPiHalf(sigma){
  const r=((sigma%4)+4)%4;
  if(r===0)return [0,1];if(r===1)return [1,0];if(r===2)return [0,-1];if(r===3)return [-1,0];
  return [Math.sin(r*PI/2),Math.cos(r*PI/2)];
}
function zetaScaledPair(sigma,t,wantDerivative=false){
  if(sigma===1&&t===0)return {value:C(Infinity),derivative:C(-Infinity),logScale:0};
  if(sigma<-.25){
    const b=zetaEM(1-sigma,-t,wantDerivative),bv=wantDerivative?b.value:b;
    const lg=add(C(sigma*Math.log(2)+(sigma-1)*LOGPI,t*LOG2PI),logGamma(1-sigma,-t));
    // sin(x+iy) and cos(x+iy), each divided by exp(|y|), avoid
    // cosh overflow and a compensating Gamma underflow for |t|>450.
    const [sr,cs]=realSinCosPiHalf(sigma),ay=Math.abs(t)*PI/2,ey=Math.exp(-2*ay),sign=t<0?-1:1;
    const sn=C(sr*(1+ey)/2,sign*cs*(1-ey)/2),co=C(cs*(1+ey)/2,-sign*sr*(1-ey)/2),unit=C(Math.cos(lg.im),Math.sin(lg.im));
    const value=mul(unit,mul(sn,bv)),logScale=lg.re+ay;
    if(!wantDerivative)return {value,logScale};
    const ap=sub(C(LOG2PI),digamma(C(1-sigma,-t)));
    const derivative=mul(unit,add(sub(mul(ap,mul(sn,bv)),mul(sn,b.derivative)),scale(mul(co,bv),PI/2)));
    return {value,derivative,logScale};
  }
  const r=zetaEM(sigma,t,wantDerivative);
  return wantDerivative?{...r,logScale:0}:{value:r,logScale:0};
}
export function zeta(sigma,t=0){const p=zetaScaledPair(sigma,t);return unscale(p.value,p.logScale);}
function xiScaledPair(sigma,t,wantDerivative=false){
  if(sigma<.5){const r=xiScaledPair(1-sigma,-t,wantDerivative);return wantDerivative?{...r,derivative:scale(r.derivative,-1)}:r;}
  if(sigma===1&&t===0)return {value:C(.5),derivative:C((2+0.5772156649015329-Math.log(4*PI))/4),logScale:0};
  const zp=zetaScaledPair(sigma,t,wantDerivative),zv=zp.value;
  const lg=sub(logGamma(1+sigma/2,t/2),C(sigma*LOGPI/2,t*LOGPI/2)),g=C(Math.cos(lg.im),Math.sin(lg.im));
  const sm1=C(sigma-1,t),near=Math.hypot(sigma-1,t)<.01;
  const y=wantDerivative&&near?zp.regularized:mul(sm1,zv),value=mul(g,y),logScale=lg.re+zp.logScale;
  if(!wantDerivative)return {value,logScale};
  const gp=scale(sub(digamma(C(1+sigma/2,t/2)),C(LOGPI)),.5);
  const yp=near?zp.regularizedDerivative:add(zv,mul(sm1,zp.derivative));
  return {value,derivative:mul(g,add(yp,mul(gp,y))),logScale};
}
export function xi(sigma,t=0){const p=xiScaledPair(sigma,t);return unscale(p.value,p.logScale);}
export function hardyZ(t){const phase=logGamma(.25,t/2).im-t*LOGPI/2;const z=zeta(.5,t);return z.re*Math.cos(phase)-z.im*Math.sin(phase);}

// The classical positive-real-axis kernel; exposed for reproducible kernel plots.
export function thetaPhi(u){return complexThetaPhi(Math.abs(u),0).re;}
function complexThetaPhi(u,alpha){
  let rr=0,ii=0;
  const e4=Math.exp(4*u),e5=Math.exp(5*u),e9=Math.exp(9*u);
  const c4=Math.cos(4*alpha),s4=Math.sin(4*alpha),c5=Math.cos(5*alpha),s5=Math.sin(5*alpha),c9=Math.cos(9*alpha),s9=Math.sin(9*alpha);
  for(let n=1;n<=12;n++){
    const n2=n*n,q=PI*n2*e4,mag=Math.exp(-q*c4);if(mag===0)break;
    const pa=2*PI*PI*n2*n2*e9,pb=3*PI*n2*e5,ar=pa*c9-pb*c5,ai=pa*s9-pb*s5;
    const co=Math.cos(-q*s4)*mag,si=Math.sin(-q*s4)*mag;
    rr+=ar*co-ai*si;ii+=ar*si+ai*co;
  }
  return C(rr,ii);
}
const kernelCache=new Map();
function contourAlpha(t){return t<=16?0:t<=40?.2:t<=80?.3:.35;}
function heatWeights(tau,alpha,steps=384){
  const key=`${tau}|${alpha}|${steps}`;
  if(kernelCache.has(key))return kernelCache.get(key);
  const du=1.5/steps,us=new Float64Array(steps+1),rs=new Float64Array(steps+1),is=new Float64Array(steps+1);
  for(let j=0;j<=steps;j++){
    const u=du*j,p=complexThetaPhi(u,alpha),g=exp(C(tau*(u*u-alpha*alpha),2*tau*u*alpha));
    const weight=du*(j===0||j===steps?.5:1);us[j]=u;rs[j]=(p.re*g.re-p.im*g.im)*weight;is[j]=(p.re*g.im+p.im*g.re)*weight;
  }
  const weights={us,rs,is};if(kernelCache.size>24)kernelCache.delete(kernelCache.keys().next().value);kernelCache.set(key,weights);return weights;
}
function heatIntegrate(sigma,t,tau,wantDerivative=false,steps=384){
  const sign=t<0?-1:1,T=Math.abs(t),x=sigma-.5,alpha=contourAlpha(T),{us,rs,is}=heatWeights(tau,alpha,steps);
  let re=0,im=0,cr=0,ci=0;
  for(let j=0;j<us.length;j++){
    const u=us[j],ang=2*T*u,co=Math.cos(ang),si=Math.sin(ang),ar=rs[j]*co-is[j]*si,ai=rs[j]*si+is[j]*co;
    const sh=Math.sinh(2*x*u),ch=Math.cosh(2*x*u);
    const vr=wantDerivative?2*(u*ar-alpha*ai)*sh:ar*ch;
    const vi=wantDerivative?2*(u*ai+alpha*ar)*ch:ai*sh;
    let y=vr-cr,q=re+y;cr=(q-re)-y;re=q;y=vi-ci;q=im+y;ci=(q-im)-y;im=q;
  }
  const ang=2*x*alpha,factor=8*Math.exp(-2*T*alpha),co=Math.cos(ang),si=Math.sin(ang);
  return C(factor*(re*co-im*si),sign*factor*(re*si+im*co));
}
const GH=Object.freeze({"32":{"nodes":[-7.125813909830728,-6.409498149269661,-5.812225949515914,-5.2755509865158805,-4.777164503502596,-4.305547953351199,-3.853755485471445,-3.417167492818571,-2.992490825002374,-2.5772495377323175,-2.169499183606112,-1.7676541094632015,-1.3703764109528718,-0.9765004635896828,-0.5849787654359324,-0.19484074156939934,0.19484074156939934,0.5849787654359324,0.9765004635896828,1.3703764109528718,1.7676541094632015,2.169499183606112,2.5772495377323175,2.992490825002374,3.417167492818571,3.853755485471445,4.305547953351199,4.777164503502596,5.2755509865158805,5.812225949515914,6.409498149269661,7.125813909830728],"weights":[4.1246074890182323e-23,5.208449591960842e-19,6.755290223670129e-16,2.378064855777791e-13,3.3475012398012285e-11,2.312518412074231e-09,8.881290713105862e-08,2.0596221039534304e-06,3.055980306089635e-05,0.00030255702581706253,0.002062051051307884,0.009903461702320596,0.034109847726092095,0.08534480827208067,0.1565389937575985,0.21170556988047937,0.21170556988047937,0.1565389937575985,0.08534480827208067,0.034109847726092095,0.009903461702320596,0.002062051051307884,0.00030255702581706253,3.055980306089635e-05,2.0596221039534304e-06,8.881290713105862e-08,2.312518412074231e-09,3.3475012398012285e-11,2.378064855777791e-13,6.755290223670129e-16,5.208449591960842e-19,4.1246074890182323e-23]},"64":{"nodes":[-10.526123167960547,-9.89528758682954,-9.373159549646722,-8.907249099964769,-8.477529083379864,-8.073687285010225,-7.689540164040497,-7.321013032780949,-6.965241120551108,-6.620112262636027,-6.284011228774828,-5.955666326799486,-5.634052164349972,-5.318325224633271,-5.007779602198768,-4.7018156474075,-4.3999171682281375,-4.101634474566657,-3.8065715139453604,-3.5143759357409063,-3.2247312919920357,-2.9373508230046217,-2.651972435430635,-2.3683545886324016,-2.086272879881762,-1.805517171465545,-1.5258891402098635,-1.247200156943118,-0.969269423071178,-0.6919223058100445,-0.4149888241210787,-0.13830224498700971,0.13830224498700971,0.4149888241210787,0.6919223058100445,0.969269423071178,1.247200156943118,1.5258891402098635,1.805517171465545,2.086272879881762,2.3683545886324016,2.651972435430635,2.9373508230046217,3.2247312919920357,3.5143759357409063,3.8065715139453604,4.101634474566657,4.3999171682281375,4.7018156474075,5.007779602198768,5.318325224633271,5.634052164349972,5.955666326799486,6.284011228774828,6.620112262636027,6.965241120551108,7.321013032780949,7.689540164040497,8.073687285010225,8.477529083379864,8.907249099964769,9.373159549646722,9.89528758682954,10.526123167960547],"weights":[3.1231879651075858e-49,9.476963190042847e-44,1.9301704298296966e-39,8.786635679310702e-36,1.4384921208585243e-32,1.0883801541458748e-29,4.435544420470786e-27,1.0785651103547654e-24,1.682900112042946e-22,1.7784691911122742e-20,1.3269088554685335e-18,7.222153573524387e-17,2.94429314699771e-15,9.186928787329652e-14,2.2337268555257646e-12,4.296426248985222e-11,6.621423410950731e-10,8.266084421479288e-09,8.437641047540983e-08,7.099424621906616e-07,4.958379721063241e-06,2.8919958244145686e-05,0.0001416023883413604,0.0005846860830695999,0.002043825838784881,0.006068446015891503,0.015347721995577658,0.033140485961927986,0.06121363851067648,0.09686336389597526,0.13145323131750097,0.15310831636189676,0.15310831636189676,0.13145323131750097,0.09686336389597526,0.06121363851067648,0.033140485961927986,0.015347721995577658,0.006068446015891503,0.002043825838784881,0.0005846860830695999,0.0001416023883413604,2.8919958244145686e-05,4.958379721063241e-06,7.099424621906616e-07,8.437641047540983e-08,8.266084421479288e-09,6.621423410950731e-10,4.296426248985222e-11,2.2337268555257646e-12,9.186928787329652e-14,2.94429314699771e-15,7.222153573524387e-17,1.3269088554685335e-18,1.7784691911122742e-20,1.682900112042946e-22,1.0785651103547654e-24,4.435544420470786e-27,1.0883801541458748e-29,1.4384921208585243e-32,8.786635679310702e-36,1.9301704298296966e-39,9.476963190042847e-44,3.1231879651075858e-49]}});
/** Exact Gaussian-convolution identity (derived by inserting the theta
 * integral and integrating exp(-v²+2 sqrt(tau)uv)):
 * F_tau(s)=pi^(-1/2) int_R exp(-v²) xi(s+sqrt(tau)v) dv.
 * For tau<0 take sqrt(tau)=i sqrt(-tau). The Gaussian then produces
 * exp(tau*u²), so this is the same classical heat family, not a blur.
 * 32-node Gauss–Hermite is used outside the original theta chart; a
 * 64-node independent-order check is available through heatDiagnostic.
 */
function gaussianXiPair(sigma,t,tau,wantDerivative=false,order=32){
  if(tau===0)return xiScaledPair(sigma,t,wantDerivative);
  const rule=GH[order],a=Math.sqrt(Math.abs(tau)),terms=[];let largest=-Infinity;
  for(let j=0;j<rule.nodes.length;j++){
    const shift=a*rule.nodes[j],p=xiScaledPair(sigma+(tau>0?shift:0),t+(tau<0?shift:0),wantDerivative);
    const logWeight=p.logScale+Math.log(rule.weights[j]);largest=Math.max(largest,logWeight);terms.push({p,logWeight});
  }
  let re=0,im=0,cr=0,ci=0,dr=0,di=0,dcr=0,dci=0;
  for(const {p,logWeight} of terms){const w=Math.exp(logWeight-largest);
    let y=w*p.value.re-cr,q=re+y;cr=(q-re)-y;re=q;y=w*p.value.im-ci;q=im+y;ci=(q-im)-y;im=q;
    if(wantDerivative){y=w*p.derivative.re-dcr;q=dr+y;dcr=(q-dr)-y;dr=q;y=w*p.derivative.im-dci;q=di+y;dci=(q-di)-y;di=q;}
  }
  return {value:C(re,im),derivative:wantDerivative?C(dr,di):undefined,logScale:largest};
}
function heatScaledPair(sigma,t,tau,wantDerivative=false){
  if(sigma>=-12&&sigma<=13&&Math.abs(t)<=120)return {value:heatIntegrate(sigma,t,tau),derivative:wantDerivative?heatIntegrate(sigma,t,tau,true):undefined,logScale:0};
  if(tau===0)return xiScaledPair(sigma,t,wantDerivative);
  return gaussianXiPair(sigma,t,tau,wantDerivative);
}
export function heatXi(sigma,t=0,tau=0){const p=heatScaledPair(sigma,t,tau);return unscale(p.value,p.logScale);}
export function heatDiagnostic(sigma,t=0,tau=0){
  const p=heatScaledPair(sigma,t,tau),core=sigma>=-12&&sigma<=13&&Math.abs(t)<=120;
  const q=core?{value:heatIntegrate(sigma,t,tau,false,768),logScale:0}:gaussianXiPair(sigma,t,tau,false,64);
  const base=Math.max(p.logScale,q.logScale),a=scale(p.value,Math.exp(p.logScale-base)),b=scale(q.value,Math.exp(q.logScale-base));
  const error=Math.hypot(a.re-b.re,a.im-b.im),den=Math.hypot(b.re,b.im),logAbs=Math.log(den)+base;
  return {value:unscale(p.value,p.logScale),refined:unscale(q.value,q.logScale),logAbs,absoluteGridDiscrepancy:Math.exp(base)*error,
    relativeGridDiscrepancy:den?error/den:error===0?0:Infinity,method:core?'theta 384 versus 768 intervals':'Gaussian convolution 32 versus 64 nodes',certified:false};
}
export function evaluate(sigma,t,kind='zeta',tau=0){
  if(kind==='xi')return xi(sigma,t);
  if(kind==='heat'||kind==='heatXi')return heatXi(sigma,t,tau);
  return zeta(sigma,t);
}
export function derivative(sigma,t,kind='zeta',tau=0){
  if(kind==='heat'||kind==='heatXi'){const p=heatScaledPair(sigma,t,tau,true);return unscale(p.derivative,p.logScale);}
  const p=kind==='xi'?xiScaledPair(sigma,t,true):zetaScaledPair(sigma,t,true);
  return unscale(p.derivative,p.logScale);
}
export function logarithmicDerivative(sigma,t,kind='zeta',tau=0){return evaluatePolar(sigma,t,kind,tau,true).q??C(NaN,NaN);}
export function numericalDomain(kind='zeta',tau=0){
  const key=kind==='heatXi'?'heat':kind;
  return NUMERICS.domains[key]??NUMERICS.domains.zeta;
}
export const numericDomain=numericalDomain;
/** Log-polar evaluation. re/im remain raw, never display-normalized.
 * q, when requested, is analytic F'/F from a shared scaled pair.
 * logAbs=-Infinity is an evaluated zero, not a masked sample. */
export function evaluatePolar(sigma,t,kind='zeta',tau=0,withDerivative=false){
  const d=numericalDomain(kind,tau),isHeat=kind==='heat'||kind==='heatXi';
  if(!Number.isFinite(sigma)||!Number.isFinite(t)||sigma<d.sigmaMin||sigma>d.sigmaMax||Math.abs(t)>d.tMax||(isHeat&&(!Number.isFinite(tau)||Math.abs(tau)>d.heatTauMax)))
    return {valid:false,reliable:false,status:'outside-domain',logAbs:NaN,arg:NaN,re:NaN,im:NaN,rawRepresentable:false};
  if(kind==='zeta'&&sigma===1&&t===0)return {valid:false,reliable:false,status:'pole',logAbs:Infinity,arg:0,re:Infinity,im:0,rawRepresentable:false};
  const p=isHeat?heatScaledPair(sigma,t,tau,withDerivative):kind==='xi'?xiScaledPair(sigma,t,withDerivative):zetaScaledPair(sigma,t,withDerivative);
  const m=Math.hypot(p.value.re,p.value.im),logAbs=m===0?-Infinity:Math.log(m)+p.logScale,arg=m===0?0:Math.atan2(p.value.im,p.value.re);
  if(Number.isNaN(logAbs)||!Number.isFinite(arg))return {valid:false,reliable:false,status:'numeric-failure',logAbs:NaN,arg:NaN,re:NaN,im:NaN,rawRepresentable:false};
  const rawRepresentable=m===0||(logAbs>=Math.log(Number.MIN_VALUE)&&logAbs<=Math.log(Number.MAX_VALUE)),raw=unscale(p.value,p.logScale);
  const status=m===0?'zero':!rawRepresentable?(logAbs>0?'overflow':'underflow'):'ok';
  const out={valid:true,reliable:true,status,logAbs,arg,re:raw.re,im:raw.im,rawRepresentable};
  if(withDerivative){out.q=m===0?C(NaN,NaN):div(p.derivative,p.value);const dm=Math.hypot(p.derivative.re,p.derivative.im);out.derivativeLogAbs=dm===0?-Infinity:Math.log(dm)+p.logScale;}
  return out;
}
// Positive DISPLAY scale only; never use this non-holomorphic factor in a
// logarithmic derivative, phase current, root location, or function identity.
export function displayScale(t){return Math.exp(PI*Math.abs(t)/4)/Math.pow(1+Math.abs(t),1.75);}
export const ZERO_HEIGHTS=Object.freeze([14.134725141734693,21.022039638771556,25.01085758014569,30.424876125859513,32.93506158773919,37.586178158825675,40.9187190121475,43.327073280915,48.00515088116716,49.7738324776723,52.97032147771446,56.44624769706339,59.34704400260235,60.83177852460981,65.11254404808161,67.07981052949417,69.54640171117398,72.06715767448191,75.70469069908393,77.14484006887481,79.33737502024937,82.91038085408603,84.73549298051705,87.42527461312523,88.80911120763447]);
