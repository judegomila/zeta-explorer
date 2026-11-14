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
