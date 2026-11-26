/** Positive, real display weighting. Never used by an analytic evaluator. */
export const DISPLAY_DEFAULTS={displayDamping:false,displayDampingScale:120};
export const DISPLAY_LIMITS={displayDampingScale:[1,2000]};

export function gaussianLogWeight(sigma,t,scale=120){
  if(!Number.isFinite(sigma)||!Number.isFinite(t)||!Number.isFinite(scale)||scale<=0)return NaN;
  const radius=Math.hypot(sigma-.5,t)/scale;
  return -radius*radius;
}

export function displayLogMagnitude(logAbs,sigma,t,state={}){
  if(!state.displayDamping)return logAbs;
  if(!(Number.isFinite(logAbs)||logAbs===-Infinity))return NaN;
  const weight=gaussianLogWeight(sigma,t,state.displayDampingScale??120);
  return Number.isNaN(weight)?NaN:logAbs+weight;
}

/** Smooth bounded amplitude transfer; a zero has no assigned phase hue. */
export function displayVisibility(logAbs,reference=0){
  if(logAbs===-Infinity)return 0;
  if(!Number.isFinite(logAbs)||!Number.isFinite(reference))return 0;
  const x=(logAbs-reference)/6;
  return x>=0?1/(1+Math.exp(-Math.min(x,750))):Math.exp(Math.max(x,-750))/(1+Math.exp(Math.max(x,-750)));
}

/** Keep source polar records immutable and retain their diagnostic values. */
export function displayPolar(polar,sigma,t,state={}){
  const logAbs=displayLogMagnitude(polar.logAbs,sigma,t,state);
  return {...polar,logAbs,arg:polar.arg,sourceLogAbs:polar.logAbs,displayOnly:!!state.displayDamping};
}

/* Far field for the plane (sampled in horizon.js). Display-only geometry and fade. */
export const HORIZON_DEFAULTS=Object.freeze({farField:false});
// The far field runs a long way along t (where the zeros continue) and a
// short way across σ: far left of the strip |ζ| grows without bound and the
// relief would stand as a wall in front of the window.
export const HORIZON_SCENE=Object.freeze({width:12,depth:16,reach:150,side:10,growth:1.1});
const inside=(x)=>x>=0&&x<=1;

/** A grid cell lies inside the window (and is drawn by the main surface). */
export function cellInWindow(u0,u1,v0,v1){return inside(u0)&&inside(u1)&&inside(v0)&&inside(v1);}

/** Distance (scene units) from a far-field point to the window rectangle. */
export function distanceToWindow(u,v){
  const W=HORIZON_SCENE.width,D=HORIZON_SCENE.depth;
  const dx=u<0?-u*W:u>1?(u-1)*W:0,dz=v<0?-v*D:v>1?(v-1)*D:0;
  return Math.hypot(dx,dz);
}

/** Display fade: 1 at the window, 0 at the reach. Smoothstep in distance. */
export function horizonFade(distance,reach=HORIZON_SCENE.reach){
  const x=Math.max(0,Math.min(1,distance/(.92*reach)));
  return 1-x*x*(3-2*x);
}

/** Display fade at a far-field knot: smooth to zero at both reaches. */
export function horizonFadeAt(u,v,{reach=HORIZON_SCENE.reach,side=HORIZON_SCENE.side}={}){
  const W=HORIZON_SCENE.width,D=HORIZON_SCENE.depth;
  const dx=u<0?-u*W:u>1?(u-1)*W:0,dz=v<0?-v*D:v>1?(v-1)*D:0;
  return horizonFade(dx,side)*horizonFade(dz,reach);
}
