import { numericalDomain } from './math.js';

// One computation contract for worker, inspector, and exported sessions.
// Core remains available as a direct comparison with the original renderer.
export function domainFor(state) {
  const d = numericalDomain(state.function, state.tau);
  return state.extent === 'core'
    ? {...d, sigmaMin:Math.max(-12,d.sigmaMin), sigmaMax:Math.min(13,d.sigmaMax), tMax:Math.min(120,d.tMax)}
    : {...d};
}
export function withinDomain(sigma,t,d) {
  return Number.isFinite(sigma) && Number.isFinite(t)
    && sigma >= d.sigmaMin && sigma <= d.sigmaMax && Math.abs(t) <= d.tMax;
}
export function domainLabel(d) {
  return `${d.sigmaMin} ≤ σ ≤ ${d.sigmaMax}, |t| ≤ ${d.tMax.toLocaleString()}`;
}

/**
 * Hole at spectral infinity. The essential point s=infinity is not filled,
 * damped, or assigned a value: an open disc around it is removed, leaving a
 * compact surface whose boundary is the spectral circle |s-1/2| = holeRadius.
 * The circle is centred on the anti-bridge point, so it is preserved by both
 * s -> 1-conj(s) and s -> conj(s), hence by the Klein and annulus quotients.
 * The radius is a chosen cutoff, not a canonical one.
 */
export const HOLE_DEFAULTS=Object.freeze({infinityHole:false,holeRadius:120});
export const HOLE_LIMITS=Object.freeze({holeRadius:[2,128]});
export function holeRadiusFor(state){
  if(!state?.infinityHole||!state.geometry||state.geometry==='plane')return null;
  const radius=Number(state.holeRadius??HOLE_DEFAULTS.holeRadius);
  if(!Number.isFinite(radius))return null;
  return Math.max(HOLE_LIMITS.holeRadius[0],Math.min(HOLE_LIMITS.holeRadius[1],radius));
}
export function insideHole(sigma,t,radius){return radius!==null&&Math.hypot(sigma-.5,t)>radius;}
/** Sampling domain: on the critical line the hole is exactly |t| > radius. */
export function samplingDomain(state){
  const d=domainFor(state),radius=holeRadiusFor(state);
  return radius===null?d:{...d,tMax:Math.min(d.tMax,radius),holeRadius:radius};
}
