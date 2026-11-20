/**
 * Chosen Euclidean twistor structure CP³ -> HP¹ ≅ S⁴.
 * The ordering is (Z0+j Z1, Z2+j Z3), with complex coefficients on the RIGHT
 * of j. Thus ordinary complex projective scaling is common right scaling.
 *
 * This quaternionic/Hermitian structure is an explicit additional choice.
 * An elliptic curve in CP³ alone does not supply a canonical Penrose model.
 * Moving along a twistor fiber generally leaves that elliptic curve.
 * All operations here are algebraic; no analytic field evaluation occurs.
 * Source: Salamon–Viaclovsky, arXiv:0704.3422, sections 2.2–2.4.
 */
import {homogeneousSphere} from './projective.js';

const C=(re=0,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im);
const sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scl=(a,b)=>C(a.re*b,a.im*b);
const conj=a=>C(a.re,-a.im);
const norm2=a=>a.re*a.re+a.im*a.im;
const abs=a=>Math.hypot(a.re,a.im);
const finite=a=>!!a&&Number.isFinite(a.re)&&Number.isFinite(a.im);
const invalid=status=>({valid:false,status,coordinates:null,s4:null,projected:null,unresolved:true});

/** Overflow-safe normalization; the zero quartet has no projective point. */
export function normalizeProjective4(input,{canonicalPhase=false}={}){
  if(input?.valid===false)return invalid(input.status||'invalid-projective-point');
  const source=Array.isArray(input)?input:input?.coordinates;
  if(!Array.isArray(source)||source.length!==4||source.some(z=>!z||typeof z.re!=='number'||typeof z.im!=='number'||Number.isNaN(z.re)||Number.isNaN(z.im)))
    return invalid('invalid-homogeneous-quartet');
  const infinities=source.map((z,i)=>finite(z)?-1:i).filter(i=>i>=0);
  if(infinities.length>1)return invalid('indeterminate-infinite-quartet');
  let coordinates,coordinateInfinity=infinities.length===1;
  if(coordinateInfinity)coordinates=source.map((z,i)=>C(i===infinities[0]?1:0));
  else{
    const largest=Math.max(...source.flatMap(z=>[Math.abs(z.re),Math.abs(z.im)]));
    if(largest===0)return invalid('simultaneous-zero');
    coordinates=source.map(z=>C(z.re/largest,z.im/largest));
    const n=Math.hypot(...coordinates.flatMap(z=>[z.re,z.im]));
    coordinates=coordinates.map(z=>scl(z,1/n));
  }
  let gaugeIndex=null,gaugePhase=0;
  if(canonicalPhase){
    // A local section, not a nonexistent global Hopf gauge. Ties choose the
    // earliest coordinate; switching the largest component creates a seam.
    gaugeIndex=0;
    for(let i=1;i<4;i++)if(abs(coordinates[i])>abs(coordinates[gaugeIndex])+8*Number.EPSILON)gaugeIndex=i;
    const pivot=coordinates[gaugeIndex],m=abs(pivot),factor=C(pivot.re/m,-pivot.im/m);
    gaugePhase=Math.atan2(pivot.im,pivot.re);
    coordinates=coordinates.map(z=>mul(z,factor));
    coordinates[gaugeIndex]=C(m,0);
  }
  return {valid:true,coordinates,norm:Math.hypot(...coordinates.flatMap(z=>[z.re,z.im])),
    gaugeIndex,gaugePhase,coordinateInfinity,status:'ok',unresolved:false};
}

/** Right multiplication by j; J is anti-linear and J²=-1. */
export function quaternionicStructure(coordinates){
  if(!Array.isArray(coordinates)||coordinates.length!==4||coordinates.some(z=>!finite(z)))return null;
  return [scl(conj(coordinates[1]),-1),conj(coordinates[0]),
    scl(conj(coordinates[3]),-1),conj(coordinates[2])];
}

/** Products in the convention q=a+j b, h=c+j d. */
export function quaternionMultiply(q,h){
  return {a:sub(mul(q.a,h.a),mul(conj(q.b),h.b)),
    b:add(mul(conj(q.a),h.b),mul(q.b,h.a))};
}
export function quaternionConjugate(q){return {a:conj(q.a),b:scl(q.b,-1)};}

/** Common right SU(2) action on H². A nonzero h is normalized first. */
export function quaternionRightAction(input,h){
  const p=normalizeProjective4(input);
  const unit=homogeneousSphere(h?.a,h?.b);
  if(!p.valid||!unit.valid)return null;
  const [a,b,c,d]=p.coordinates,[ha,hb]=unit.homogeneous;
  const first=quaternionMultiply({a,b},{a:ha,b:hb});
  const second=quaternionMultiply({a:c,b:d},{a:ha,b:hb});
  return [first.a,first.b,second.a,second.b];
}

/** The exact second Hopf map, descended through complex projectivization. */
export function quaternionicHopf(input){
  const p=normalizeProjective4(input);if(!p.valid)return p;
  const [a,b,c,d]=p.coordinates,q1={a,b},q2={a:c,b:d};
  const cross=quaternionMultiply(q1,quaternionConjugate(q2));
  const s4=[2*cross.a.re,2*cross.a.im,2*cross.b.re,2*cross.b.im,
    norm2(a)+norm2(b)-norm2(c)-norm2(d)];
  return {...p,s4,quaternions:[q1,q2],sphereNorm:Math.hypot(...s4)};
}

/**
 * Two stereographic charts of S⁴. The result is R⁴, not a fabricated 3D
 * embedding. A caller may display three coordinates and encode the fourth.
 * 'north' divides by 1-x[pole]; 'south' divides by 1+x[pole].
 */
export function projectS4(s4,{projection='north',pole=4}={}){
  if(!Array.isArray(s4)||s4.length!==5||!s4.every(Number.isFinite)||!Number.isInteger(pole)||pole<0||pole>4)
    return {valid:false,status:'invalid-s4-point',coordinates:null};
  if(projection==='stereographic')projection='north';
  if(!['north','south','orthographic'].includes(projection))return {valid:false,status:'invalid-projection',coordinates:null};
  const n=Math.hypot(...s4);
  if(n===0)return {valid:false,status:'zero-s4-vector',coordinates:null};
  const unit=s4.map(x=>x/n),others=unit.filter((x,i)=>i!==pole),x=unit[pole];
  if(projection==='orthographic')return {valid:true,status:'ok',coordinates:others,projection,pole,denominator:1};
  const sign=projection==='north'?1:-1,denominator=1-sign*x,radial=Math.hypot(...others);
  if(radial===0&&sign*x>0)return {valid:false,status:'chart-infinity',coordinates:null,projection,pole,denominator:0};
  let coordinates;
  if(sign*x>0&&radial>0){
    // (1-sign*x) = ||others||²/(1+sign*x), using the sphere identity.
    // Evaluate direction * radius without squaring tiny components.
    const radius=(1+sign*x)/radial;
    coordinates=others.map(a=>(a/radial)*radius);
  }else coordinates=others.map(a=>a/denominator);
  if(!coordinates.every(Number.isFinite))return {valid:false,status:'chart-overflow',coordinates:null,projection,pole,denominator};
  return {valid:true,status:'ok',coordinates,projection,pole,denominator};
}

/** Unit-norm residuals, hence invariant under homogeneous scaling. */
export function ellipticQuadricResiduals(input,r=2){
  const p=normalizeProjective4(input);
  if(!p.valid||!Number.isFinite(r)||r<=1||r>100)return null;
  const [a,b,c,d]=p.coordinates;
  const q1=sub(mul(b,b),mul(a,c));
  const q2=sub(mul(d,d),add(add(mul(a,a),scl(mul(b,b),r*r+1/(r*r))),mul(c,c)));
  return {quadric1:abs(q1),quadric2:abs(q2)};
}

/**
 * CP¹ fiber [alpha:beta] through [Z]: alpha Z + beta JZ.
 * Root UI angles are theta∈[0,π], phi∈[0,2π]. The optional sheet flag
 * flips X3 BEFORE moving in the fiber, selecting the elliptic deck partner.
 */
export function twistorFromProjective(curve,{theta=0,phi=0,projection='north',pole=4,sheet='plus'}={}){
  if(!Number.isFinite(theta)||!Number.isFinite(phi))return invalid('invalid-fiber-angle');
  if(!['plus','minus',1,-1].includes(sheet))return invalid('invalid-sheet');
  const original=normalizeProjective4(curve);if(!original.valid)return original;
  const chosen=original.coordinates.map(z=>({...z})),sheetSign=sheet==='minus'||sheet===-1?-1:1;
  chosen[3]=scl(chosen[3],sheetSign);
  const base=normalizeProjective4(chosen,{canonicalPhase:true});
  const alpha=C(Math.cos(theta/2)),beta=C(Math.sin(theta/2)*Math.cos(phi),Math.sin(theta/2)*Math.sin(phi));
  const moved=quaternionRightAction(base.coordinates,{a:alpha,b:beta});
  const source=quaternionicHopf(base.coordinates),target=quaternionicHopf(moved);
  if(!source.valid||!target.valid)return invalid('twistor-projection-failure');
  const fiber=homogeneousSphere(alpha,beta),r=curve?.r??2;
  const sourceCurveResiduals=ellipticQuadricResiduals(base.coordinates,r);
  const curveResiduals=ellipticQuadricResiduals(target.coordinates,r);
  return {...target,baseCoordinates:base.coordinates,sourceCoordinates:chosen,
    s4:source.s4,movedS4:target.s4,projected:projectS4(source.s4,{projection,pole}),
    fiber:{spinor:fiber.homogeneous,bloch:fiber.sphere,sphere:fiber.sphere,theta,phi},
    invarianceError:Math.hypot(...source.s4.map((x,i)=>x-target.s4[i])),
    sourceCurveResiduals,curveResiduals,
    onSourceCurve:!!sourceCurveResiduals&&Math.max(...Object.values(sourceCurveResiduals))<1e-10,
    onCurve:!!curveResiduals&&Math.max(...Object.values(curveResiduals))<1e-10,
    gaugeIndex:base.gaugeIndex,gaugePhase:base.gaugePhase,sheet:sheetSign,r,
    sourceSpectralInfinity:!!curve?.spectralInfinity,status:'ok',unresolved:false};
}
