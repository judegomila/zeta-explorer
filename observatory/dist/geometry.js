import { torusPoint, torusInverse, torusLandmarks, torusCriticalPoint } from './elliptic.js';
const TAU=Math.PI*2;
export const wrap=x=>((x%1)+1)%1;
export function embedded(u,v,geometry){
  if(geometry==='plane') return {position:[(u-.5)*12,0,(v-.5)*16],normal:[0,1,0]};
  if(geometry==='sphere'){
    const a=TAU*wrap(u),b=Math.PI*v,n=[Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)];
    return {position:n.map(x=>4*x),normal:n};
  }
  const a=TAU*wrap(u),b=TAU*wrap(v),n=[Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a)],r=3.65+1.38*Math.cos(b);
  return {position:[r*Math.cos(a),1.38*Math.sin(b),r*Math.sin(a)],normal:n};
}
export function surfacePoint(u,v,state){
  const p=embedded(u,v,state.geometry);
  if(state.geometry==='plane')return {...p,sigma:state.sigmaMin+u*(state.sigmaMax-state.sigmaMin),t:state.tMin+v*(state.tMax-state.tMin),valid:true};
  if(state.geometry==='torus')return {...p,...torusPoint(u,v,{r:state.torusR,scale:state.chartScale})};
  const a=TAU*wrap(u),L=state.chartScale/3;
  if(!(v>0&&v<=1))return {...p,sigma:NaN,t:NaN,valid:false,puncture:v===0};
  // cot(b/2) avoids the cancellation in sin(b)/(1-cos(b)) near the north
  // pole and supports the same chart at much larger finite spectral heights.
  const radius=v===1?0:L/Math.tan(Math.PI*v/2);
  return {...p,sigma:.5+radius*Math.cos(a),t:radius*Math.sin(a),valid:Number.isFinite(radius)};
}
export function inversePoint(sigma,t,state){
  if(state.geometry==='plane'){
    const u=(sigma-state.sigmaMin)/(state.sigmaMax-state.sigmaMin),v=(t-state.tMin)/(state.tMax-state.tMin);
    return u>=0&&u<=1&&v>=0&&v<=1?[{u,v}]:[];
  }
  if(state.geometry==='torus')return torusInverse(sigma,t,{r:state.torusR,scale:state.chartScale});
  const x=(sigma-.5)/(state.chartScale/3),y=t/(state.chartScale/3);
  // atan2 remains accurate when |c| is so large that (|c|^2-1)/(|c|^2+1)
  // would round to 1 and falsely collapse a finite point onto the pole.
  return [{u:wrap(Math.atan2(y,x)/TAU),v:2*Math.atan2(1,Math.hypot(x,y))/Math.PI}];
}
export function liftPoint(sigma,t,state){return inversePoint(sigma,t,state).map(p=>({...embedded(p.u,p.v,state.geometry),...p,sigma,t}));}
export function landmarks(state){
  if(state.geometry!=='torus')return [];
  const L=torusLandmarks({r:state.torusR,scale:state.chartScale});
  return L;
}

/** Complete geometric critical curves, independent of evaluator coverage. */
export function criticalCurvePoint(q,curve,state){
  if(!Number.isFinite(q)||q<0||q>1)throw new RangeError('Critical-curve q must lie in [0,1].');
  if(state.geometry==='torus'){
    const p=torusCriticalPoint(q,Number(curve),{r:state.torusR,scale:state.chartScale});
    return {...embedded(p.u,p.v,'torus'),...p};
  }
  if(state.geometry==='sphere'){
    const u=q<=.5?.25:.75,v=2*Math.min(q,1-q),phi=TAU*q;
    const normal=[0,Math.cos(phi),Math.sin(phi)];
    const puncture=q===0||q===1;
    // Parameterize the full X=0 great circle in one consistent orientation.
    const t=puncture?(q===0?Infinity:-Infinity):q===.5?0:(state.chartScale/3)/Math.tan(Math.PI*q);
    return {q,u,v,position:normal.map(x=>4*x),normal,sigma:.5,t,valid:!puncture,puncture};
  }
  const u=(.5-state.sigmaMin)/(state.sigmaMax-state.sigmaMin),v=q;
  return {...embedded(u,v,'plane'),q,u,v,sigma:.5,t:state.tMin+q*(state.tMax-state.tMin),valid:u>=0&&u<=1,puncture:false};
}

export function criticalCurves(state,{segments=720}={}){
  const n=Math.max(8,Math.ceil(segments));
  if(state.geometry==='plane'&&(.5<state.sigmaMin||.5>state.sigmaMax))return [];
  return Array.from({length:state.geometry==='torus'?2:1},(_,index)=>({
    id:`critical-${state.geometry}-${index}`,index,closed:state.geometry!=='plane',
    points:Array.from({length:n+1},(_,i)=>criticalCurvePoint(i/n,index,state)),
  }));
}

function distinctAxis(values){
  values.sort((a,b)=>a-b);
  const out=[];
  for(const value of values){
    const v=value<1e-14?0:value>1-1e-14?1:value;
    if(!out.length||v-out[out.length-1]>1e-12)out.push(v);
  }
  return new Float64Array(out);
}
function regularAxis(intervals){return Array.from({length:intervals+1},(_,i)=>i/intervals);}
function logKnots(count){return Array.from({length:count},(_,i)=>Math.exp(Math.log(1e-5)+i/(count-1)*Math.log(.06/1e-5)));}
function addPeriodicClusters(axis,centers,count){
  for(const c of centers)for(const d of logKnots(count))axis.push(wrap(c-d),wrap(c+d));
}

/**
 * Tensor sampling axes with extra finite-tail resolution at the punctures.
 * This changes the sampling density, NEVER the parameterization or function.
 * Consumers must retain each vertex's actual UV pair for picking/interpolation.
 * A denser mesh still does not resolve an infinite number of phase windings.
 *
 * Typical counts: sphere ~37k/82k/175k and torus ~48k/103k/214k vertices
 * for standard/high/ultra. Both seams and all critical rows are exact knots.
 */
export function sampleAxes(state){
  const factor=({draft:.65,standard:1,high:1.5,ultra:2.2})[state.resolution]??1;
  const intervals=n=>Math.max(8,4*Math.round(n*factor/4));
  if(state.geometry==='plane')return {u:new Float64Array(regularAxis(intervals(96))),v:new Float64Array(regularAxis(intervals(176)))};
  const sphere=state.geometry==='sphere';
  const u=regularAxis(intervals(sphere?224:192)),v=regularAxis(intervals(sphere?112:128));
  u.push(0,.25,.5,.75,1);v.push(0,.25,.5,.75,1);
  if(sphere){
    addPeriodicClusters(u,[.25,.75],Math.max(6,Math.round(8*factor)));
    v.push(...logKnots(Math.max(12,Math.round(24*factor))));
  }else{
    const knots=Math.max(8,Math.round(12*factor));
    addPeriodicClusters(u,[0,.5],knots);
    addPeriodicClusters(v,[.25,.75],knots);
  }
  // A generic logarithmic mesh can jump over the last part of the supported
  // finite t range. Calibrate a small set of actual spectral heights through
  // the inverse chart. Keep these knots in both core and extended views so
  // their coverage is comparable on the same mesh. No value at infinity is
  // assigned, and these anchors do not imply every intervening phase is resolved.
  const tailHeights=[120,250,500,750,1000,1500,1999.8];
  for(const height of tailHeights)for(const sign of [-1,1]){
    for(const p of inversePoint(.5,sign*height,state)){
      if(sphere)v.push(p.v);
      // The two critical rows are already exact v=.25,.75. Adding only u
      // avoids perturbing those rows by inverse-solver roundoff.
      else u.push(p.u);
    }
  }
  return {u:distinctAxis(u),v:distinctAxis(v)};
}
