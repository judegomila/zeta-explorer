import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5;
const A = C_C_PINNED / E_TRUNC_PT;
const LO = Math.log(1e9);
const HI = Math.log(1e11);

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else { b = m; }
  }
  return (a + b) / 2;
}
function Lof(x) { return Math.log(effectiveHeightForN(Math.exp(x))); }
function uOf(x) { return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; }
function sigmaOf(x) { return 1 / (1 + Math.exp(-uOf(x))); }

// F-route (u-route): analytic factorized knee, with v,vp,vpp from central differences of u at step h.
function fKneeAt(x, h) {
  const d1 = (uOf(x + h) - uOf(x - h)) / (2 * h);
  const d2 = (uOf(x + h) - 2 * uOf(x) + uOf(x - h)) / (h * h);
  const d3 = (uOf(x + 2 * h) - 2 * uOf(x + h) + 2 * uOf(x - h) - uOf(x - 2 * h)) / (2 * h * h * h);
  const v = -d1, vp = -d2, vpp = -d3;
  const S = sigmaOf(x);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function uRouteKnee(h) { return bisect((x) => fKneeAt(x, h), LO, HI) / Math.LN10; }

// Direct (ln-sigma) route: central-difference p''(x)=0 of ln sigma (no E_flow).
function lnSigmaNoFlow(x) {
  const N = Math.exp(x);
  const L = Math.log(effectiveHeightForN(N));
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return Math.log(E_coll / (E_TRUNC_PT + E_coll));
}
function pLocal(f, x, h) { return -(f(x + h) - f(x - h)) / (2 * h); }
function pSecond(f, x, h) { return (pLocal(f, x + h, h) - 2 * pLocal(f, x, h) + pLocal(f, x - h, h)) / (h * h); }
function directKnee(h) { return bisect((x) => pSecond(lnSigmaNoFlow, x, h), LO, HI) / Math.LN10; }

// Sweep h geometrically, record knee locations and per-step gap.
const hs = [];
for (let k = 0; k <= 24; k++) hs.push(2e-2 * Math.pow(0.5, k)); // 2e-2 down to ~1.2e-9
console.log('h            uRoute        direct        gap');
const rows = [];
for (const h of hs) {
  const u = uRouteKnee(h);
  const d = directKnee(h);
  rows.push({ h, u, d, gap: u - d });
  console.log(h.toExponential(3), u.toFixed(8), d.toFixed(8), (u - d).toExponential(4));
}

// Optimal step: pick the h where |gap| is smallest AND estimator is stable (before roundoff blowup).
// Truncation error of central second-diff ~ O(h^2); roundoff ~ O(eps/h^2). Optimum ~ eps^(1/4).
let best = rows[0];
for (const r of rows) if (Math.abs(r.gap) < Math.abs(best.gap)) best = r;
console.log('\nsmallest |gap| at h =', best.h.toExponential(3), 'gap =', best.gap.toExponential(4));

// Richardson extrapolation on the TRUNCATION-dominated regime.
// Both estimators are 2nd-order accurate: q(h) = q0 + c h^2 + ..., so
// q_R = (4 q(h/2) - q(h)) / 3 removes the leading h^2 term. Use a mid-range h pair
// safely above roundoff onset (h ~ 5e-4 per imp-34756), e.g. h and h/2 with h ~ 4e-3.
function richardson(fn, h) { return (4 * fn(h / 2) - fn(h)) / 3; }
for (const h of [8e-3, 4e-3, 2e-3, 1e-3]) {
  const uR = richardson(uRouteKnee, h);
  const dR = richardson(directKnee, h);
  console.log(`Richardson @h=${h.toExponential(2)}: uR=${uR.toFixed(8)} dR=${dR.toFixed(8)} gapR=${(uR - dR).toExponential(4)}`);
}
// Iterated (2-level) Richardson to O(h^6): combine two O(h^2)-removed estimates.
function richardson2(fn, h) {
  const r1 = richardson(fn, h);
  const r2 = richardson(fn, h / 2);
  return (16 * r2 - r1) / 15;
}
const H0 = 4e-3;
const uR2 = richardson2(uRouteKnee, H0);
const dR2 = richardson2(directKnee, H0);
console.log(`\nIterated Richardson @h0=${H0}: uR2=${uR2.toFixed(9)} dR2=${dR2.toFixed(9)} gapR2=${(uR2 - dR2).toExponential(4)}`);
console.log('raw h=1e-3 gap =', (uRouteKnee(1e-3) - directKnee(1e-3)).toExponential(4));

// ---- Plateau characterization: fine sweep in the roundoff-free window --------
console.log('\n--- plateau sweep (roundoff-free window) ---');
console.log('h            uRoute         direct         gap');
const plateau = [4e-2, 3e-2, 2e-2, 1.5e-2, 1e-2, 7e-3, 5e-3];
for (const h of plateau) {
  const u = uRouteKnee(h), d = directKnee(h);
  console.log(h.toExponential(3), u.toFixed(9), d.toFixed(9), (u - d).toExponential(4));
}
// Best (smallest |gap|) within the roundoff-free plateau:
let bp = null;
for (const h of plateau) {
  const g = uRouteKnee(h) - directKnee(h);
  if (!bp || Math.abs(g) < Math.abs(bp.g)) bp = { h, g };
}
console.log('plateau best |gap| at h =', bp.h.toExponential(3), 'gap =', bp.g.toExponential(4));
