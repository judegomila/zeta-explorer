/**
 * Zero traps: one reflection-symmetric disc per tracked zero.
 *
 * A disc centred ON the critical line is mapped to itself by s -> 1-conj(s).
 * The completed function satisfies F(1-conj(s)) = conj(F(s)), so its zeros in
 * such a disc come in reflected pairs unless they lie on the line. A disc
 * holding EXACTLY ONE zero therefore holds it on the critical line, simple.
 * That implication is exact. What varies is how the count "one" is known:
 *
 *   certified  - the exact disc is covered by an interval-arithmetic record:
 *                at tau = 0, the Arb winding certificate for every tracked
 *                disc (zero-line-certificate.js); for small |tau|, the fixed
 *                Arb/Rouche witness in experiments/zero-channel-bounds.json
 *                (first zero only).
 *   count-one  - floating-point argument-principle winding equals one.
 *                Numerical evidence, not a certificate.
 *   unresolved - winding not resolved, or not equal to one.
 *
 * Discs are pairwise disjoint by construction. Covering finitely many zeros
 * says nothing about the rest; the complete count to height T is separate.
 */
import { evaluatePolar } from './math.js';
import { LINE_CERTIFICATE } from './zero-line-certificate.js';

const TAU=2*Math.PI;
export const TRAP_STATUS=Object.freeze({certified:'#8dffb0','count-one':'#ffd27a',unresolved:'#ff7d8a'});
/** The single shipped certificate: fixed disc, completed family, small |tau|. */
export const CERTIFIED_WITNESS=Object.freeze({t:14.134725141734693,radius:.35,tauMax:.05,id:'theta-first-disk-arb-v1'});

/** Certified at tau = 0 only when centre and radius match a record bit for bit. */
export function lineCertificateFor(disc,tau=0){
  if(tau!==0)return null;
  return LINE_CERTIFICATE.discs.some(d=>d.t===disc.t&&d.radius===disc.radius&&d.winding===1)?LINE_CERTIFICATE.certificateId:null;
}

/** Disjoint symmetric discs: radius is a fixed share of the nearest gap. */
export function trapDiscs(heights,{share=.4,maxRadius=.6,firstRadius=CERTIFIED_WITNESS.radius}={}){
  const t=[...heights].filter(Number.isFinite).sort((a,b)=>a-b);
  return t.map((height,i)=>{
    const gap=Math.min(i?height-t[i-1]:Infinity,i<t.length-1?t[i+1]-height:Infinity);
    let radius=Math.min(maxRadius,share*gap);
    // Keep the witness disc at its certified size when it still fits.
    if(Math.abs(height-CERTIFIED_WITNESS.t)<1e-9&&firstRadius<.5*gap)radius=firstRadius;
    return {t:height,radius};
  });
}

/** Zeros minus poles inside |s-(1/2+it)| = radius, by continued argument. */
export function trapWinding(t,radius,kind='xi',tau=0,{initialSteps=48,maxDepth=24}={}){
  const at=a=>{const p=evaluatePolar(.5+radius*Math.cos(a),t+radius*Math.sin(a),kind,tau);return p.valid&&p.logAbs!==-Infinity&&Number.isFinite(p.arg)?p.arg:NaN;};
  const wrap=d=>d-TAU*Math.round(d/TAU);
  let total=0,resolved=true;
  const walk=(a0,v0,a1,v1,depth)=>{
    if(Number.isNaN(v0)||Number.isNaN(v1)){resolved=false;return;}
    const d=wrap(v1-v0);
    if(Math.abs(d)<.5||depth>=maxDepth){if(Math.abs(d)>=.5)resolved=false;total+=d;return;}
    const am=(a0+a1)/2,vm=at(am);walk(a0,v0,am,vm,depth+1);walk(am,vm,a1,v1,depth+1);
  };
  let a0=0,v0=at(0);
  for(let i=1;i<=initialSteps;i++){const a1=TAU*i/initialSteps,v1=i===initialSteps?at(0):at(a1);walk(a0,v0,a1,v1,0);a0=a1;v0=v1;}
  const raw=total/TAU,count=Math.round(raw)+0;
  return {count,raw,resolved:resolved&&Math.abs(raw-count)<.01};
}

/**
 * Status of every trap for a completed field. Raw zeta shares its strip zeros
 * with xi but not the conjugation law, so its traps are counted on xi.
 */
export function computeTraps(heights,{kind='xi',tau=0}={}){
  const family=kind==='heat'?'heat':'xi',time=family==='heat'?tau:0;
  return trapDiscs(heights).map(disc=>{
    const winding=trapWinding(disc.t,disc.radius,family,time);
    const witness=Math.abs(disc.t-CERTIFIED_WITNESS.t)<1e-9&&disc.radius===CERTIFIED_WITNESS.radius&&Math.abs(time)<=CERTIFIED_WITNESS.tauMax;
    const certificateId=lineCertificateFor(disc,time)??(witness?CERTIFIED_WITNESS.id:null);
    // A certificate never overrides a floating-point count that disagrees.
    const status=!winding.resolved||winding.count!==1?'unresolved':certificateId?'certified':'count-one';
    return {...disc,sigma:.5,count:winding.count,resolved:winding.resolved,status,color:TRAP_STATUS[status],
      certificateId:status==='certified'?certificateId:null,countedOn:family};
  });
}
