/**
 * Pure two-component spinor geometry. No zeta or heat evaluator is imported.
 * ψ†σψ is the existing projective Bloch convention, with +2 Im(conj(U)V).
 * Rotations use exp(-i θ n·σ/2): a 2π rotation changes ψ's sign and a 4π
 * rotation returns ψ. A common phase is a Hopf fiber, not a moved zeta zero.
 * References and the chosen frame gauge: docs/SPINORS-TWISTORS.md.
 */
import {homogeneousSphere} from './projective.js';

const C=(re=0,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scl=(a,b)=>C(a.re*b,a.im*b);
const conj=a=>C(a.re,-a.im);
const axes={x:{x:1,y:0,z:0},y:{x:0,y:1,z:0},z:{x:0,y:0,z:1}};
const invalid=status=>({valid:false,status,amplitudes:null,bloch:null,sphere:null,frame:null});

/** Normalization is shared with CP¹ so poles and common zeros agree. */
export function normalizeSpinor(pair){
  if(pair?.valid===false)return invalid(pair.status||'invalid-projective-point');
  const z=Array.isArray(pair)?pair:pair?.homogeneous??pair?.amplitudes;
  if(!Array.isArray(z)||z.length!==2)return invalid('missing-spinor-pair');
  const p=homogeneousSphere(z[0],z[1]);
  if(!p.valid)return invalid(p.status);
  return {...p,amplitudes:p.homogeneous.map(a=>({...a})),bloch:p.sphere,norm:1};
}

/** The Hopf base is insensitive to the spinor's common U(1) phase. */
export function hopfMap(pair){
  const p=normalizeSpinor(pair);
  return p.valid?{valid:true,bloch:p.bloch,sphere:p.sphere,status:'ok'}:p;
}

export function spinorAxis(axis='z'){
  const a=typeof axis==='string'?axes[axis]:Array.isArray(axis)?{x:axis[0],y:axis[1],z:axis[2]}:axis;
  if(!a||![a.x,a.y,a.z].every(Number.isFinite))return null;
  const largest=Math.max(Math.abs(a.x),Math.abs(a.y),Math.abs(a.z));
  if(largest===0)return null;
  const n=Math.hypot(a.x/largest,a.y/largest,a.z/largest);
  return {x:a.x/largest/n,y:a.y/largest/n,z:a.z/largest/n};
}

/** Matrix rows of the spin-1/2 rotation. Angles are in radians. */
export function su2Rotation(axis='z',angle=0){
  const n=spinorAxis(axis);
  if(!n||!Number.isFinite(angle))return {valid:false,status:'invalid-rotation',matrix:null};
  const c=Math.cos(angle/2),s=Math.sin(angle/2);
  const matrix=[[C(c,-n.z*s),C(-n.y*s,-n.x*s)],
    [C(n.y*s,-n.x*s),C(c,n.z*s)]];
  return {valid:true,matrix,axis:n,angle,status:'ok'};
}

export function rotateSpinor(pair,axis='z',angle=0){
  const p=normalizeSpinor(pair),rotation=su2Rotation(axis,angle);
  if(!p.valid)return p;if(!rotation.valid)return invalid(rotation.status);
  const [a,b]=p.amplitudes,[u,v]=rotation.matrix;
  const out=normalizeSpinor([add(mul(u[0],a),mul(u[1],b)),add(mul(v[0],a),mul(v[1],b))]);
  return {...out,axis:rotation.axis,angle};
}

export function spinorInnerProduct(left,right){
  const a=normalizeSpinor(left),b=normalizeSpinor(right);
  if(!a.valid||!b.valid)return null;
  return add(mul(conj(a.amplitudes[0]),b.amplitudes[0]),mul(conj(a.amplitudes[1]),b.amplitudes[1]));
}

/** SO(3) frame from SU(2) columns (ψ,Jψ), J(a,b)=(-conj b,conj a). */
export function spinorFrame(pair){
  const p=normalizeSpinor(pair);if(!p.valid)return null;
  const [a,b]=p.amplitudes,ja=scl(conj(b),-1),jb=conj(a);
  const e1=normalizeSpinor([add(a,ja),add(b,jb)]).bloch;
  const e2=normalizeSpinor([add(a,mul(C(0,1),ja)),add(b,mul(C(0,1),jb))]).bloch;
  return {e1,e2,n:p.bloch};
}

/**
 * Display state for a selected CP¹ channel. The raw normalized input is the
 * reference for overlap, so both a common phase and the 2π sign are visible.
 * rotationOverlap instead compares with the phase-adjusted reference.
 */
export function spinorFromProjective(pair,{phase=0,angle=0,axis='z'}={}){
  if(!Number.isFinite(phase))return invalid('invalid-fiber-phase');
  const base=normalizeSpinor(pair);if(!base.valid)return base;
  const phaseFactor=C(Math.cos(phase),Math.sin(phase));
  const phaseAmplitudes=base.amplitudes.map(z=>mul(phaseFactor,z));
  const rotated=rotateSpinor(phaseAmplitudes,axis,angle);if(!rotated.valid)return rotated;
  return {...rotated,baseAmplitudes:base.amplitudes,phaseAmplitudes,phase,angle,
    frame:spinorFrame(rotated),overlap:spinorInnerProduct(base,rotated),
    rotationOverlap:spinorInnerProduct(phaseAmplitudes,rotated),
    sourceUnresolved:!!pair?.unresolved,status:'ok'};
}
