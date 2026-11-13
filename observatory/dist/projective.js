/**
 * Projective charts for the completed-zeta geometry.
 *
 * A pair [U:V] is stored at unit Hermitian norm. Its Bloch sphere is
 * (2 Re(conj(U)V), 2 Im(conj(U)V), |U|^2-|V|^2). The affine chart is U/V;
 * the reciprocal chart is V/U. Consequently this sphere's Y coordinate
 * is the NEGATIVE of the usual stereographic Im(U/V) coordinate.
 *
 * These are coordinate identities, not a positivity or RH certificate.
 * A simultaneous zero is indeterminate; no common-zero divisor is erased.
 */

const C=(re=0,im=0)=>({re,im});
const finite=z=>!!z&&Number.isFinite(z.re)&&Number.isFinite(z.im);
const hasNaN=z=>!z||typeof z.re!=='number'||typeof z.im!=='number'||Number.isNaN(z.re)||Number.isNaN(z.im);
const abs=z=>Math.hypot(z.re,z.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const add=(a,b)=>C(a.re+b.re,a.im+b.im);
const sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const scl=(a,b)=>C(a.re*b,a.im*b);
const EPS=64*Number.EPSILON;

function invalid(status,extra={}){
  return {valid:false,sphere:null,homogeneous:null,affine:null,reciprocal:null,
    chart:null,coordinate:null,status,unresolved:true,...extra};
}

function quotient(a,b){
  const bmag=abs(b);
  if(bmag===0)return {value:null,status:'infinity'};
  if(abs(a)===0)return {value:C(),status:'finite'};
  // Divide by a unit denominator before its magnitude; never square a
  // subnormal denominator. The selected chart always has |quotient| <= 1.
  const br=b.re/bmag,bi=b.im/bmag;
  const value=C((a.re*br+a.im*bi)/bmag,(a.im*br-a.re*bi)/bmag);
  return finite(value)?{value,status:'finite'}:{value:null,status:'overflow'};
}

function fromNormalized(U,V,status='ok'){
  const a=abs(U),b=abs(V),norm=Math.hypot(a,b);
  U=scl(U,1/norm);V=scl(V,1/norm);
  const aa=U.re*U.re+U.im*U.im,bb=V.re*V.re+V.im*V.im;
  const sphere={x:2*(U.re*V.re+U.im*V.im),
    y:2*(U.re*V.im-U.im*V.re),z:aa-bb};
  const aq=quotient(U,V),rq=quotient(V,U),chart=abs(V)>=abs(U)?'affine':'reciprocal';
  return {valid:true,sphere,homogeneous:[U,V],affine:aq.value,reciprocal:rq.value,
    affineStatus:aq.status,reciprocalStatus:rq.status,chart,
    coordinate:chart==='affine'?aq.value:rq.value,status,unresolved:false};
}

/** Scale-invariant Bloch sphere of [U:V], including either coordinate pole. */
export function homogeneousSphere(U,V){
  if(hasNaN(U)||hasNaN(V))return invalid('invalid-coordinate');
  const ui=!finite(U),vi=!finite(V);
  if(ui&&vi)return invalid('indeterminate-infinity');
  if(ui)return fromNormalized(C(1),C(),'coordinate-infinity');
  if(vi)return fromNormalized(C(),C(1),'coordinate-infinity');
  const largest=Math.max(Math.abs(U.re),Math.abs(U.im),Math.abs(V.re),Math.abs(V.im));
  if(largest===0)return invalid('simultaneous-zero',{simultaneousZero:true});
  // Dividing each component (rather than multiplying by 1/largest) also
  // works when every component is subnormal.
  return fromNormalized(C(U.re/largest,U.im/largest),C(V.re/largest,V.im/largest));
}

function validPolar(p){
  return !!p&&p.valid===true&&typeof p.logAbs==='number'&&!Number.isNaN(p.logAbs)
    &&(p.logAbs===-Infinity||Number.isFinite(p.arg));
}

/** Shared log-polar scaling preserves relative amplitudes despite raw overflow. */
export function pairSphereFromPolar(U,V){
  if(!validPolar(U)||!validPolar(V))return invalid('invalid-polar-sample');
  const zeroU=U.logAbs===-Infinity,zeroV=V.logAbs===-Infinity;
  if(zeroU&&zeroV)return invalid('simultaneous-zero',{simultaneousZero:true});
  if(U.logAbs===Infinity&&V.logAbs===Infinity)return invalid('indeterminate-infinity');
  if(U.logAbs===Infinity)return fromNormalized(C(1),C(),'coordinate-infinity');
  if(V.logAbs===Infinity)return fromNormalized(C(),C(1),'coordinate-infinity');
  const peak=Math.max(U.logAbs,V.logAbs);
  const polar=p=>{const a=p.logAbs===-Infinity?0:Math.exp(p.logAbs-peak);
    return a===0?C():C(a*Math.cos(p.arg),a*Math.sin(p.arg));};
  const out=fromNormalized(polar(U),polar(V));
  const roundedToPole=(!zeroU&&out.homogeneous[0].re===0&&out.homogeneous[0].im===0)
    ||(!zeroV&&out.homogeneous[1].re===0&&out.homogeneous[1].im===0);
  const reliable=U.reliable!==false&&V.reliable!==false;
  return {...out,logAmplitudeDifference:U.logAbs-V.logAbs,roundedToPole,
    reliable,unresolved:!reliable};
}

/**
 * Source sphere [s0-1:s0], s0=1/2+(s-1/2)/scale.
 * Multiplication by scale yields [s-(1+scale)/2:s-(1-scale)/2].
 * Form the latter with a shared scale to avoid overflow at large s.
 * scale=1 is the literal w=(s-1)/s atlas in the research note.
 */
export function domainProjective(sigma,t,scale=1){
  if(typeof sigma!=='number'||typeof t!=='number'||Number.isNaN(sigma)||Number.isNaN(t)
    ||!Number.isFinite(scale)||scale<=0)return invalid('invalid-domain-coordinate');
  if(!Number.isFinite(sigma)||!Number.isFinite(t)){
    return {...homogeneousSphere(C(1),C(1)),scale,w:C(1),inverseW:C(1),
      spectralInfinity:true,status:'spectral-infinity',s0:null};
  }
  const magnitude=Math.max(1,Math.abs(sigma),Math.abs(t),scale);
  const center=sigma/magnitude-.5/magnitude,halfScale=.5*(scale/magnitude),y=t/magnitude;
  const out=homogeneousSphere(C(center-halfScale,y),C(center+halfScale,y));
  const s0=C(.5+(sigma-.5)/scale,t/scale);
  return {...out,scale,w:out.affine,inverseW:out.reciprocal,s0:finite(s0)?s0:null,
    spectralInfinity:false,chartInfinity:out.affineStatus==='infinity'};
}

function derivativeInvalid(status,p,ell){
  return {...invalid(status),q:p?.q??null,ell,cayley:null,cayleyProjective:null,
    diskSign:null,diskRegion:'unresolved',diskMargin:null,
    unresolvedReason:status,cayleyPole:false};
}

/**
 * [F:ell F'] from evaluatePolar(..., true). Raw re/im are never used.
 * The Cayley coordinate is C=(F-ell F')/(F+ell F')=(1-ell q)/(1+ell q).
 * Re(q)>0 maps inside the disk. A floating-point sign is only a diagnostic.
 */
export function derivativeProjective(p,ell=1){
  if(!Number.isFinite(ell)||ell<=0)return derivativeInvalid('invalid-derivative-scale',p,ell);
  if(!validPolar(p))return derivativeInvalid('invalid-polar-sample',p,ell);
  const hasDerivativeLog=typeof p.derivativeLogAbs==='number'&&!Number.isNaN(p.derivativeLogAbs);
  if(p.logAbs===-Infinity){
    if(!hasDerivativeLog)return derivativeInvalid('derivative-unavailable-at-zero',p,ell);
    if(p.derivativeLogAbs===-Infinity)return derivativeInvalid('simultaneous-zero',p,ell);
    if(!Number.isFinite(p.derivativeLogAbs))return derivativeInvalid('derivative-unresolved-at-zero',p,ell);
    // At a simple evaluated zero [0:F']=[0:1] independent of arg(F').
    const out=fromNormalized(C(),C(1),'function-zero');
    const cp=homogeneousSphere(C(-1),C(1));
    return {...out,q:null,ell,cayley:C(-1),cayleyProjective:cp,cayleyPole:false,
      diskSign:0,diskRegion:'boundary',diskMargin:0,unresolved:true,
      unresolvedReason:'logarithmic-derivative-undefined-at-zero'};
  }
  if(!finite(p.q))return derivativeInvalid('logarithmic-derivative-unresolved',p,ell);
  const qscale=Math.max(Math.abs(p.q.re),Math.abs(p.q.im));
  const qnorm=qscale===0?0:Math.hypot(p.q.re/qscale,p.q.im/qscale);
  const logq=qscale===0?-Infinity:Math.log(qscale)+Math.log(qnorm);
  // For finite q the projective pair [1:ell q] is equivalent and avoids
  // cancellation between very large absolute function/derivative logs.
  const logv=logq===-Infinity?-Infinity:Math.log(ell)+logq;
  const peak=Math.max(0,logv),vabs=logv===-Infinity?0:Math.exp(logv-peak);
  const V0=vabs===0?C():C((p.q.re/qscale)/qnorm*vabs,(p.q.im/qscale)/qnorm*vabs);
  const out=fromNormalized(C(Math.exp(-peak)),V0);
  if(!out.valid)return derivativeInvalid('derivative-projective-failure',p,ell);
  const [U,V]=out.homogeneous;
  const cp=homogeneousSphere(sub(U,V),add(U,V));
  const diskSign=Math.sign(p.q.re);
  // A nearly imaginary q is sensitive to numerical errors in evaluation.
  const nearBoundary=Math.abs(p.q.re)<=EPS*Math.max(1,qscale);
  const nearFunctionZero=hasDerivativeLog&&Number.isFinite(p.derivativeLogAbs)
    &&p.derivativeLogAbs-p.logAbs>Math.log(1/EPS);
  const unreliable=p.reliable===false;
  const unresolved=nearBoundary||nearFunctionZero||unreliable;
  const unresolvedReason=unreliable?'unreliable-function-sample':nearFunctionZero?'near-function-zero':nearBoundary?'disk-boundary-within-roundoff':null;
  return {...out,q:{...p.q},ell,cayley:cp.affine,cayleyProjective:cp,
    cayleyPole:cp.affineStatus==='infinity',diskSign,diskMargin:out.sphere.x,
    diskRegion:unresolved?'unresolved':diskSign>0?'inside':diskSign<0?'outside':'boundary',
    unresolved,unresolvedReason};
}

function normalizeFour(coords){
  if(coords.some(z=>!finite(z)))return null;
  const largest=Math.max(...coords.flatMap(z=>[Math.abs(z.re),Math.abs(z.im)]));
  if(!largest)return null;
  const scaled=coords.map(z=>C(z.re/largest,z.im/largest));
  const norm=Math.hypot(...scaled.flatMap(z=>[z.re,z.im]));
  return scaled.map(z=>scl(z,1/norm));
}

/**
 * CP^3 model [1:w:w^2:eta] of the exact elliptic cover, using torusPoint.
 * When |w|>1 use [v^2:v:1:eta/w^2] to avoid squaring a huge w.
 * At w=infinity eta/w^2=-i*r*(ds/dz)/scale. Since scale is positive,
 * sign(Im(ds/dz)) recovers the sheet from torusPoint's analytic derivative.
 * Callers may instead provide infinitySign=+1/-1. Without either datum,
 * return both candidates and mark the sheet unresolved instead of guessing.
 */
export function torusProjective(point,{r=2,infinitySign}={}){
  if(!Number.isFinite(r)||r<=1||r>100)return {valid:false,status:'invalid-elliptic-shape',coordinates:null,unresolved:true};
  if(!point?.w||!point?.eta||hasNaN(point.w)||hasNaN(point.eta))
    return {valid:false,status:'invalid-torus-point',coordinates:null,unresolved:true};
  const w=point.w,eta=point.eta;
  if(!finite(w)){
    let sign=infinitySign===1||infinitySign===-1?infinitySign:null;
    let infinitySignSource=sign?'explicit':null;
    const d=point.dsdz;
    if(!sign&&finite(d)&&d.im!==0&&Math.abs(d.re)<=1e-10*Math.abs(d.im)){
      sign=Math.sign(d.im);infinitySignSource='analytic-derivative';
    }
    const signs=sign?[sign]:[1,-1];
    const candidates=signs.map(sign=>normalizeFour([C(),C(),C(1),C(sign)]));
    return {valid:signs.length===1,status:signs.length===1?'chart-infinity':'sheet-unresolved-at-chart-infinity',
      coordinates:signs.length===1?candidates[0]:null,candidates,chart:'X2',chartInfinity:true,
      spectralInfinity:false,unresolved:signs.length!==1,infinitySignSource,r};
  }
  if(!finite(eta))return {valid:false,status:'eta-unresolved',coordinates:null,unresolved:true,r};
  let raw,chart;
  if(abs(w)<=1){raw=[C(1),w,mul(w,w),eta];chart='X0';}
  else{
    const v=quotient(C(1),w).value;
    if(!v)return {valid:false,status:'reciprocal-chart-failure',coordinates:null,unresolved:true,r};
    // Divide eta by w twice, rather than first forming eta or w squared.
    const e1=quotient(eta,w).value,e2=e1?quotient(e1,w).value:null;
    if(!e2)return {valid:false,status:'eta-chart-failure',coordinates:null,unresolved:true,r};
    raw=[mul(v,v),v,C(1),e2];chart='X2';
  }
  const coordinates=normalizeFour(raw);
  if(!coordinates)return {valid:false,status:'projective-normalization-failure',coordinates:null,unresolved:true,r};
  const [X0,X1,X2,X3]=coordinates;
  const q1=sub(mul(X1,X1),mul(X0,X2));
  const q2=sub(mul(X3,X3),add(add(mul(X0,X0),scl(mul(X1,X1),r*r+1/(r*r))),mul(X2,X2)));
  return {valid:true,status:point.puncture?'spectral-infinity':'ok',coordinates,chart,r,
    chartInfinity:false,spectralInfinity:!!point.puncture,
    residuals:{quadric1:abs(q1),quadric2:abs(q2)},unresolved:false};
}
