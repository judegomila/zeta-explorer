/**
 * Projective conormal of the smooth elliptic curve in CP³.
 *
 * Q1 = X1² − X0 X2; Q2 = X3² − X0² − (r²+r⁻²) X1² − X2².
 * Every W = alpha dQ1 + beta dQ2 is a tangent hyperplane at Z.
 * Pairings W·Z and W·T are complex BILINEAR, without conjugation.
 * The CP¹ family is intrinsic to this embedding; the coordinate [alpha:beta]
 * uses the two explicitly written equations. No unique normal is selected.
 *
 * This module evaluates geometry only. In particular it assigns no xi value
 * at spectral infinity, where the geometric curve and its conormal are smooth.
 */
import { domainProjective, homogeneousSphere, torusProjective } from './projective.js';
import { torusInverse, torusPoint } from './elliptic.js';
import { normalizeProjective4, ellipticQuadricResiduals } from './twistor.js';

const TAU=2*Math.PI;
const C=(re=0,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im);
const sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scl=(a,n)=>C(a.re*n,a.im*n);
const conj=a=>C(a.re,-a.im);
const abs=a=>Math.hypot(a.re,a.im);
const finite=a=>a&&Number.isFinite(a.re)&&Number.isFinite(a.im);
const dot=(a,b)=>a.reduce((sum,z,i)=>add(sum,mul(z,b[i])),C());
const invalid=status=>({valid:false,status,unresolved:true,coordinates:null,fieldEvaluated:false});

export const DUAL_DEFAULTS=Object.freeze({
  dualMode:'off',dualTheta:Math.PI/2,dualPhi:0,dualSheet:1,dualAnchor:'probe'
});
export const DUAL_ENUMS=Object.freeze({
  dualMode:['off','conormal'],dualSheet:[1,-1],
  dualAnchor:['probe','infinity','antiBridge','branch','chartInfinity']
});
export const DUAL_LIMITS=Object.freeze({dualTheta:[0,Math.PI,.005],dualPhi:[0,TAU,.005]});
export const DUAL_VIEW_NAMES=Object.freeze(['dualTwistor']);

export function normalizeDualConfig(input={}){
  const out={...DUAL_DEFAULTS};
  for(const key of Object.keys(out)){
    const value=input?.[key];
    if(DUAL_ENUMS[key]){if(DUAL_ENUMS[key].includes(value))out[key]=value;}
    else if(typeof value==='number'&&Number.isFinite(value)){
      const [lo,hi]=DUAL_LIMITS[key];out[key]=Math.max(lo,Math.min(hi,value));
    }
  }
  return out;
}

export function createDualPresets(defaults={}){
  return {dualTwistor:{settings:{...defaults,...DUAL_DEFAULTS,dualMode:'conormal',
    projective:true,geometry:'torus',function:'xi',fiberMode:'off',
    dynamicsMode:'off',researchMode:'off',channelsMode:'off',playing:false,
    autoRotate:false,packets:false,torusR:2,chartScale:24,colorMode:'phase'},
    note:'Explore the ℂℙ¹ family of tangent hyperplanes at an elliptic point, including regular conormal geometry at spectral infinity. The scalar field keeps its essential puncture.'}};
}

/** Unit homogeneous normalization with a reproducible local phase gauge. */
function unit(input){
  if(!Array.isArray(input)||input.length!==4||input.some(z=>!finite(z)))return null;
  const out=normalizeProjective4(input,{canonicalPhase:true});
  return out.valid?out:null;
}

function det3(m){
  return add(sub(mul(m[0][0],sub(mul(m[1][1],m[2][2]),mul(m[1][2],m[2][1]))),
    mul(m[0][1],sub(mul(m[1][0],m[2][2]),mul(m[1][2],m[2][0])))),
    mul(m[0][2],sub(mul(m[1][0],m[2][1]),mul(m[1][1],m[2][0]))));
}

/** Gradients of the stated homogeneous equations, evaluated on unit Z. */
export function ellipticConormalBasis(input,r=2){
  if(!(Number.isFinite(r)&&r>1&&r<=100))return invalid('invalid-elliptic-shape');
  if(input?.valid===false)return invalid(input.status||'invalid-source-point');
  const source=unit(Array.isArray(input)?input:input?.coordinates);
  if(!source)return invalid('invalid-homogeneous-quartet');
  const Z=source.coordinates,[x0,x1,x2,x3]=Z,a=r*r+1/(r*r);
  const gradients=[
    [scl(x2,-1),scl(x1,2),scl(x0,-1),C()],
    [scl(x0,-2),scl(x1,-2*a),scl(x2,-2),scl(x3,2)]
  ];
  const units=gradients.map(g=>unit(g));
  if(units.some(g=>!g))return invalid('singular-conormal');
  const overlap=abs(dot(units[0].coordinates.map(conj),units[1].coordinates));
  // Each row is scaled independently only for the nullspace calculation.
  // The visible CP¹ coefficients always multiply the ORIGINAL gradients.
  const matrix=[...units.map(g=>g.coordinates),Z.map(conj)];
  const cofactors=Array.from({length:4},(_,i)=>scl(det3(matrix.map(row=>row.filter((_,j)=>i!==j))),i%2?-1:1));
  const tangent=unit(cofactors);
  if(!tangent)return invalid('singular-projective-tangent');
  const quadricResiduals=ellipticQuadricResiduals(Z,r);
  const onCurve=!!quadricResiduals&&Math.max(quadricResiduals.quadric1,quadricResiduals.quadric2)<1e-9;
  if(!onCurve)return {...invalid('source-off-elliptic-curve'),quadricResiduals};
  return {valid:true,status:'ok',unresolved:false,r,source,gradients,
    tangent:tangent.coordinates,quadricResiduals,
    familySeparation:Math.sqrt(Math.max(0,1-overlap*overlap)),fieldEvaluated:false};
}

/**
 * Exact projective conormal family, evaluated with floating-point arithmetic.
 * A supplied coefficient pair may have any nonzero common complex scale.
 * The optional deck exchange is applied before selecting the phase gauge.
 */
export function conormalFromProjective(curve,{theta=Math.PI/2,phi=0,sheet=1,coefficients}={}){
  if(![1,-1,'plus','minus'].includes(sheet))return invalid('invalid-sheet');
  if(!Number.isFinite(theta)||!Number.isFinite(phi))return invalid('invalid-family-angle');
  if(curve?.valid===false)return invalid(curve.status||'invalid-source-point');
  const incoming=Array.isArray(curve)?curve:curve?.coordinates;
  if(!Array.isArray(incoming)||incoming.length!==4||incoming.some(z=>!finite(z)))return invalid('invalid-homogeneous-quartet');
  const sign=sheet===-1||sheet==='minus'?-1:1;
  const chosen=incoming.map((z,i)=>i===3?scl(z,sign):C(z.re,z.im));
  const r=curve?.r??2,basis=ellipticConormalBasis(chosen,r);
  if(!basis.valid)return basis;
  let alpha=C(Math.cos(theta/2)),beta=C(Math.sin(theta/2)*Math.cos(phi),Math.sin(theta/2)*Math.sin(phi));
  if(coefficients!==undefined){
    if(!Array.isArray(coefficients)||coefficients.length!==2||coefficients.some(z=>!finite(z)))return invalid('invalid-family-coefficients');
    [alpha,beta]=coefficients;
  }
  const family=homogeneousSphere(alpha,beta);
  if(!family.valid)return invalid('zero-family-coefficients');
  [alpha,beta]=family.homogeneous;
  const raw=basis.gradients[0].map((g,i)=>add(mul(alpha,g),mul(beta,basis.gradients[1][i])));
  const dual=unit(raw);
  if(!dual)return invalid('singular-family-member');
  const Z=basis.source.coordinates,W=dual.coordinates,T=basis.tangent;
  return {...basis,coordinates:W,sourceCoordinates:Z,dualCoordinates:W,dual,
    family:{alpha,beta,sphere:family.sphere,theta,phi},sheet:sign,
    incidence:dot(W,Z),tangentPairing:dot(W,T),
    pointResidual:abs(dot(W,Z)),tangentResidual:abs(dot(W,T)),
    horizontalResidual:abs(dot(Z.map(conj),T)),
    sourceSpectralInfinity:!!curve?.spectralInfinity,
    sourceChartInfinity:!!curve?.chartInfinity,
    gaugeIndex:basis.source.gaugeIndex,dualGaugeIndex:dual.gaugeIndex,
    fieldEvaluated:false};
}

/** Exact geometric anchor; spectral infinity is NEVER sent to an evaluator. */
export function dualSourceFromProbe(state={},probe={sigma:.5,t:14.1347251417347}){
  const config=normalizeDualConfig(state),r=state.torusR??2,scale=state.chartScale??24;
  if(!(Number.isFinite(r)&&r>1.000000001&&r<=100&&Number.isFinite(scale)&&scale>0))return invalid('invalid-geometry-settings');
  const anchor=config.dualAnchor;
  const make=(coordinates,meta)=>({valid:true,status:'ok',r,coordinates,fieldEvaluated:false,...meta});
  if(anchor==='infinity')return make([C(1),C(1),C(1),C(r+1/r)],
    {spectralInfinity:true,w:C(1),label:'p± · spectral infinity',spectralCoordinate:null});
  if(anchor==='antiBridge')return make([C(1),C(-1),C(1),C(r+1/r)],
    {spectralInfinity:false,w:C(-1),label:'q± · anti-bridge',spectralCoordinate:{sigma:.5,t:0}});
  if(anchor==='branch'){
    const w=C(0,1/r),s0=C(1/(1+1/(r*r)),(1/r)/(1+1/(r*r)));
    return make([C(1),w,C(-1/(r*r)),C()],
      {spectralInfinity:false,w,label:'branch · w = i/r',spectralCoordinate:{sigma:.5+scale*(s0.re-.5),t:scale*s0.im}});
  }
  if(anchor==='chartInfinity')return make([C(),C(),C(1),C(1)],
    {spectralInfinity:false,chartInfinity:true,w:null,label:'w = ∞ · regular spectral point',spectralCoordinate:{sigma:.5-scale/2,t:0}});
  const sigma=probe?.sigma,t=probe?.t;
  if(!Number.isFinite(sigma)||!Number.isFinite(t))return invalid('finite-probe-required');
  const domain=domainProjective(sigma,t,scale);
  const roots=torusInverse(sigma,t,{r,scale});
  if(!roots.length)return invalid('elliptic-inverse-unresolved');
  const point=torusPoint(roots[0].u,roots[0].v,{r,scale}),curve=torusProjective(point,{r});
  if(!curve.valid)return {...curve,fieldEvaluated:false};
  return {...curve,w:domain.w,domain,label:'selected surface point',
    spectralCoordinate:{sigma,t},sourceUV:roots[0],fieldEvaluated:false};
}
