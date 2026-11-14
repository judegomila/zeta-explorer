/**
 * Real quotients of the elliptic cover, not a welding of its R³ display.
 * In the cover's UV coordinates R(u,v)=(u,1/2-v) and
 * A=D∘R(u,v)=(1/2-u,v+1/2), modulo Z². R has two fixed circles;
 * A is free. The common fundamental band is 1/4<=v<=3/4.
 *
 * A completed field is a Real section: F(Ap)=conj(F(p)). Its modulus and
 * zero set descend; its complex phase is expressed in the selected lift.
 */
import { torusPoint, torusInverse, torusLandmarks, torusCriticalPoint } from './elliptic.js';

const unit=x=>((x%1)+1)%1;
const tolerance=16*Number.EPSILON;
export const isQuotientGeometry=geometry=>geometry==='klein'||geometry==='annulus';
function requireKind(geometry){if(!isQuotientGeometry(geometry))throw new RangeError('Quotient geometry must be klein or annulus.');}

/** The exact anti-holomorphic involution in full-cover coordinates. */
export function quotientInvolution(u,v,geometry='klein'){
  requireKind(geometry);
  return geometry==='klein'?{u:unit(.5-u),v:unit(v+.5)}:{u:unit(u),v:unit(.5-v)};
}

/**
 * Fold a cover point into the band. The Klein upper edge is represented on
 * the lower edge with u reversed; the annulus retains both separate edges.
 * `conjugated` records the transition of the local complex field value.
 */
export function quotientCoordinates(u,v,geometry='klein'){
  requireKind(geometry);
  if(!Number.isFinite(u)||!Number.isFinite(v))throw new RangeError('Finite cover coordinates are required.');
  const sourceU=unit(u),sourceV=unit(v);
  let coverU=sourceU,coverV=sourceV,conjugated=false;
  if(Math.abs(coverV-.25)<tolerance)coverV=.25;
  if(Math.abs(coverV-.75)<tolerance)coverV=.75;
  if(coverV<.25||coverV>.75){
    const p=quotientInvolution(coverU,coverV,geometry);
    coverU=p.u;coverV=p.v;conjugated=true;
  }
  if(Math.abs(coverV-.25)<tolerance)coverV=.25;
  if(Math.abs(coverV-.75)<tolerance)coverV=.75;
  if(geometry==='klein'&&coverV===.75){coverU=unit(.5-coverU);coverV=.25;conjugated=!conjugated;}
  if(coverU<tolerance||1-coverU<tolerance)coverU=0;
  return {u:coverU,v:2*(coverV-.25),coverU,coverV,conjugated,sourceU,sourceV};
}

/** Exact local spectral pullback on the band, including both boundary edges. */
export function quotientPoint(u,v,{r=1.6,scale=24}={}){
  if(!Number.isFinite(u)||!Number.isFinite(v)||v<0||v>1)return {sigma:NaN,t:NaN,valid:false};
  const coverU=unit(u),coverV=.25+v/2;
  let p;
  if(v===0||v===1){
    const oval=v===0?0:1,q=unit(oval===0?coverU:.5-coverU);
    p=torusCriticalPoint(q,oval,{r,scale});
  }else p=torusPoint(coverU,coverV,{r,scale});
  const dsdv=p.dsdv?{re:p.dsdv.re/2,im:p.dsdv.im/2}:undefined;
  return {...p,u:coverU,v,coverU,coverV,dsdv,localLift:true};
}

/** Inverse up to the quotient involution; retain the source spectral point. */
export function quotientInverse(sigma,t,{geometry='klein',r=1.6,scale=24}={}){
  requireKind(geometry);
  const result=[];
  for(const p of torusInverse(sigma,t,{r,scale})){
    // The exact critical-line inverse lies on one of these known ovals.
    // Impose that identity only for sigma===1/2, never by snapping nearby
    // off-line points onto the critical curve.
    const coverV=sigma===.5?(Math.abs(p.v-.25)<Math.abs(p.v-.75)?.25:.75):p.v;
    const q=quotientCoordinates(p.u,coverV,geometry);
    if(result.some(x=>Math.min(Math.abs(x.u-q.u),1-Math.abs(x.u-q.u))<1e-8&&Math.abs(x.v-q.v)<1e-8))continue;
    result.push({...q,residual:p.residual,sourceSigma:sigma,sourceT:t,
      representativeSigma:q.conjugated?1-sigma:sigma,representativeT:t});
  }
  return result;
}

/** Orbit-aware markers: a visual self-intersection never merges UV points. */
export function quotientLandmarks(geometry,{r=1.6,scale=24}={}){
  requireKind(geometry);
  const cover=torusLandmarks({r,scale});
  const fold=list=>{
    const result=[];
    for(const p of list){
      const q=quotientCoordinates(p.u,p.v,geometry);
      const previous=result.find(x=>Math.min(Math.abs(x.u-q.u),1-Math.abs(x.u-q.u))<1e-8&&Math.abs(x.v-q.v)<1e-8);
      if(previous){previous.coverLabels.push(p.label);continue;}
      result.push({...q,label:p.label,coverLabels:[p.label]});
    }
    return result;
  };
  const punctures=fold(cover.punctures),antiBridge=fold(cover.antiBridge),branches=fold(cover.branches);
  punctures.forEach((p,i)=>{p.label=geometry==='klein'?'p± · one infinity puncture':`p${i?'−':'+'} · infinity boundary puncture`;});
  antiBridge.forEach((p,i)=>{p.label=geometry==='klein'?'q± · anti-bridge · s=½':`q${i?'+':'−'} · anti-bridge · s=½`;});
  branches.forEach(p=>{p.label=(p.u<.5?'+':'−')+'i/r ∼ '+(p.u<.5?'+':'−')+'ir · branch orbit';});
  const regular=fold([{u:0,v:0,label:'ω+ · regular chart orbit'},{u:.5,v:0,label:'ω− · regular chart orbit'}]);
  regular.forEach(p=>{p.label+=' · w=0 ∼ ∞';});
  return {criticalOvals:geometry==='klein'?[0]:[0,1],scale,punctures,antiBridge,branches,regular};
}

/** Boundary parameterization in common spectral orientation, +i∞ to −i∞. */
export function quotientCriticalPoint(q,curve=0,{geometry='klein',r=1.6,scale=24}={}){
  requireKind(geometry);
  if(!Number.isInteger(curve)||curve<0||curve>(geometry==='klein'?0:1))throw new RangeError('Invalid quotient critical circle.');
  const p=torusCriticalPoint(q,curve,{r,scale});
  return {...p,v:curve===0?0:1,coverU:p.u,coverV:p.v,
    dsdv:p.dsdv?{re:p.dsdv.re/2,im:p.dsdv.im/2}:undefined,localLift:true};
}
