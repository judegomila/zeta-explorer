import { evaluatePolar } from './math.js';
import { domainFor, withinDomain } from './domain.js';
import { sampleAxes } from './geometry.js';
import { HORIZON_DEFAULTS, HORIZON_SCENE, cellInWindow, distanceToWindow, horizonFade, horizonFadeAt } from './display-field.js';
export { HORIZON_DEFAULTS, HORIZON_SCENE, cellInWindow, distanceToWindow, horizonFade, horizonFadeAt };

/**
 * Far field for the plane. The same analytic function, at the same scale as
 * the chosen window, sampled beyond the window's edges out to a fixed scene
 * radius. Only the sampling density changes with distance: steps grow
 * geometrically away from the window, so the far field costs a few tens of
 * thousands of evaluations however wide it reaches. Nothing is damped, filled
 * or extrapolated; points outside the numerical domain stay unevaluated.
 * The fade into the distance is a display effect applied by the renderer.
 *
 * Coordinates follow geometry.js for the plane: u, v ∈ [0, 1] span the
 * window and map to x = (u − ½)·12, z = (v − ½)·16 in scene units. The far
 * field extends u and v past [0, 1].
 */

/** Outward steps from an edge: first step `first`, growing by `growth` until `reach`. */
export function outwardSteps(first,reach,growth=HORIZON_SCENE.growth,maxStep=Infinity){
  const out=[];let d=0,h=first;
  while(d<reach){d=Math.min(reach,d+h);out.push(d);h=Math.min(h*growth,maxStep);}
  return out;
}

/**
 * Extended axes in window units. The window's own knots are kept exactly, so
 * the far field meets the window edge with no cracks.
 */
export function horizonAxes(state,{reach=HORIZON_SCENE.reach,side=HORIZON_SCENE.side,growth=HORIZON_SCENE.growth}={}){
  const base=sampleAxes({...state,geometry:'plane'}),W=HORIZON_SCENE.width,D=HORIZON_SCENE.depth;
  // Inner knots are thinned to every second one: the window itself is drawn by
  // the main surface, and only the edge rows/columns must match it exactly.
  // Along t the step is capped (HORIZON_SCENE.maxStep) so zero bands stay
  // resolved all the way out: zeros near t = 300 are under one scene unit apart.
  const extend=(axis,size,reach,maxStep)=>{
    const n=axis.length-1,du=(axis[1]-axis[0])*size,dv=(axis[n]-axis[n-1])*size;
    const lo=outwardSteps(du,reach,growth,maxStep).map(d=>-d/size).reverse(),hi=outwardSteps(dv,reach,growth,maxStep).map(d=>1+d/size);
    return Float64Array.from([...lo,...axis,...hi]);
  };
  return {u:extend(base.u,W,side,Infinity),v:extend(base.v,D,reach,HORIZON_SCENE.maxStep)};
}

/** Sample the far field. Window-interior knots are skipped (the main surface draws them). */
export function sampleHorizon(state,{reach,side,growth,onProgress=()=>{}}={}){
  const axes=horizonAxes(state,{reach,side,growth}),nu=axes.u.length,nv=axes.v.length,n=nu*nv;
  const domain=domainFor(state),kind=state.function==='heat'?'heat':state.function==='xi'?'xi':'zeta';
  const sigma=new Float64Array(n),t=new Float64Array(n),logAbs=new Float64Array(n).fill(NaN),arg=new Float64Array(n).fill(NaN),valid=new Uint8Array(n),interior=new Uint8Array(n);
  const sw=state.sigmaMax-state.sigmaMin,tw=state.tMax-state.tMin;let evaluated=0;
  for(let j=0;j<nv;j++){
    if(j%16===0)onProgress('Far field · '+Math.floor(100*j/nv)+'%');
    const v=axes.v[j];
    for(let i=0;i<nu;i++){
      const k=j*nu+i,u=axes.u[i],s=state.sigmaMin+u*sw,y=state.tMin+v*tw;
      sigma[k]=s;t[k]=y;
      if(u>0&&u<1&&v>0&&v<1){interior[k]=1;continue;}
      if(!withinDomain(s,y,domain))continue;
      const f=evaluatePolar(s,y,kind,state.tau);evaluated++;
      if(!f.valid)continue;
      logAbs[k]=f.logAbs;arg[k]=f.arg;valid[k]=1;
    }
  }
  return {nu,nv,u:axes.u,v:axes.v,sigma,t,logAbs,arg,valid,interior,evaluated,reach:reach??HORIZON_SCENE.reach};
}

/** Everything the far field depends on; display settings are excluded. */
export function horizonKey(state){
  return JSON.stringify(['function','tau','sigmaMin','sigmaMax','tMin','tMax','resolution','extent'].map(k=>state[k]));
}

