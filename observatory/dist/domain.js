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
