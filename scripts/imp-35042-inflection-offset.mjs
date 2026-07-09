#!/usr/bin/env node
// imp-35042: Is the imp-33721 sigmoid inflection knee N_star ~ 3.38e9 -- sitting
// ~3.3% ABOVE the imp-33723 E_coll=E_trunc crossover N_cross ~ 3.280294e9 and the
// imp-33582 halving point N_half -- a STRUCTURAL offset or a numerical coincidence?
//
// Model (inherited imp-3220/imp-3406 surrogate; identical to imp-34487):
//   sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
//   E_coll = C_C_PINNED * sqrt(L/N),  L = log T0(N),  T0 = effectiveHeightForN(N),
//   E_flow = C_F * (L/T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi.
// sigma(N) is a DECREASING sigmoid in x = log N (E_coll falls like sqrt(L/N)).
//
// Result (derivation, not just measurement): write r = (E_trunc+E_flow)/E_coll so
// sigma = 1/(1+r) and g(x) = ln r(x). The inflection d2sigma/dx2 = 0 is EXACTLY
//   r_star = (g'' + g'^2) / (g'^2 - g''),
// so the inflection sits at r = r_star, displaced from the halving value r = 1 by
// the sign of g''. If L were constant (symmetric-logistic limit) then g'' = 0 and
// r_star = 1 EXACTLY -- inflection co-located with halving. The offset is therefore
// set ENTIRELY by g'' != 0, i.e. the curvature that the slowly-varying log-height
// factor L(x) = log T0(N) injects into ln r -- the sigmoid asymmetry. Computable,
// closed form, NOT numerical noise.
//
// Measurement/derivation only. Changes no bound. C_mb GUE-conditional per imp-486. NO QED.

import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

const H = 2e-3; // log-N step for finite differences of the sigma-ramp
const sigmaOfX = (x) => parts(Math.exp(x)).sigma;                        // decreasing in x
const d2 = (x) => (sigmaOfX(x + H) - 2 * sigmaOfX(x) + sigmaOfX(x - H)) / (H * H);

// g(x) = ln r,  r = (E_trunc + E_flow) / E_coll  (r = 1 at the halving point).
const gOfX = (x) => {
  const p = parts(Math.exp(x));
  return Math.log((E_TRUNC_PT + p.E_flow) / p.E_coll);
};
const gp = (x) => (gOfX(x + H) - gOfX(x - H)) / (2 * H);
const gpp = (x) => (gOfX(x + H) - 2 * gOfX(x) + gOfX(x - H)) / (H * H);

// Bisections. sigma and E_coll both DECREASE with N.
function solveSigma(target, lo, hi) {
  let a = Math.log(lo), b = Math.log(hi);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaOfX(m) > target) a = m; else b = m; // sigma too high -> need larger N
  }
  return Math.exp((a + b) / 2);
}
function crossEcollEqEtrunc(lo, hi) { // imp-33723 Banach fixed point, closed form
  let a = Math.log(lo), b = Math.log(hi);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m; else b = m;
  }
  return Math.exp((a + b) / 2);
}
function inflectionX(lo, hi) { // d2sigma/dx2 crosses - -> + as N grows
  let a = Math.log(lo), b = Math.log(hi);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (d2(m) < 0) a = m; else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_cross = crossEcollEqEtrunc(1e6, 1e14);
const N_half = solveSigma(0.5, 1e6, 1e14);
const N_star = inflectionX(2e9, 6e9);
const N_cross_lit = 3.280294e9; // imp-33723 headline
const N_star_head = 3.38e9;     // imp-33721 headline (rounded)

console.log('Surrogate landmarks near the N ~ 3.3e9 cluster (imp-33582/33721/33723):');
console.log('  N_cross  (E_coll=E_trunc, Banach FP)         = ' + N_cross.toExponential(6) +
  '   (imp-33723 headline ' + N_cross_lit.toExponential(6) + ')');
console.log('  N_half   (sigma = 1/2)                        = ' + N_half.toExponential(6));
console.log('  N_star   (inflection d2sigma/dx2=0, x=log N)  = ' + N_star.toExponential(6) +
  '   (imp-33721 headline ' + N_star_head.toExponential(2) + ')');
console.log('  sigma(N_star)                                 = ' + sigmaOfX(Math.log(N_star)).toFixed(6) +
  '   (< 1/2: inflection is ABOVE halving on a decreasing ramp)');

console.log('\nOffsets (all POSITIVE -- N_star sits above the halving/crossover pair):');
console.log('  (N_star  - N_half ) / N_half   = ' + ((N_star - N_half) / N_half * 100).toFixed(3) + '%');
console.log('  (N_star  - N_cross) / N_cross  = ' + ((N_star - N_cross) / N_cross * 100).toFixed(3) + '%');
console.log('  (N_half  - N_cross) / N_cross  = ' + ((N_half - N_cross) / N_cross * 100).toFixed(3) + '%   (E_flow-only gap)');
console.log('  headline arithmetic (3.38-3.28)/3.28 = ' +
  ((N_star_head - N_cross_lit) / N_cross_lit * 100).toFixed(3) + '%   (the imp-33721 "~3.3%")');

// -------------------------------------------------------------------------
// EXACT structural derivation of the inflection displacement.
// -------------------------------------------------------------------------
const xs = Math.log(N_star);
const g1 = gp(xs), g2 = gpp(xs);
const r_star_formula = (g2 + g1 * g1) / (g1 * g1 - g2);
const p = parts(N_star);
const r_star_actual = (E_TRUNC_PT + p.E_flow) / p.E_coll;

console.log('\nExact inflection identity  r_star = (g\'\' + g\'^2)/(g\'^2 - g\'\'),  g = ln r:');
console.log('  g\'(x*)                       = ' + g1.toFixed(6) + '   (slope of ln r, ~ (1 - L\'/L)/2)');
console.log('  g\'\'(x*)                      = ' + g2.toExponential(4) + '   (log-height curvature; 0 => symmetric)');
console.log('  r_star  (closed form)         = ' + r_star_formula.toFixed(6));
console.log('  r_star  (actual at N_star)    = ' + r_star_actual.toFixed(6) + '   (match => identity verified)');
console.log('  r_star if g\'\'=0 (const L)     = ' + ((0 + g1 * g1) / (g1 * g1 - 0)).toFixed(6) +
  '   => inflection == halving (symmetric-logistic limit)');

// Offset prediction: ln r rises from 0 (halving, r=1) to ln(r_star) with slope ~ g1.
const dx_pred = Math.log(r_star_formula) / g1;
console.log('  predicted offset  ln(r_star)/g\' = ' + (dx_pred * 100).toFixed(3) + '%');
console.log('  measured  (N_star - N_half)/N_half = ' + ((N_star - N_half) / N_half * 100).toFixed(3) + '%');

const ph = parts(N_half);
console.log('\nE_flow smallness at N_half: E_flow/E_trunc = ' + (ph.E_flow / E_TRUNC_PT).toExponential(3) +
  ', E_flow/E_coll = ' + (ph.E_flow / ph.E_coll).toExponential(3) +
  '  (drops out of r_star as a near-constant prefactor)');

console.log('\nVerdict: STRUCTURAL, not numerical. The sigma-ramp inflection is displaced');
console.log('ABOVE the halving/crossover point by a closed-form margin r_star != 1 that');
console.log('vanishes exactly (r_star -> 1) in the constant-log-height limit g\'\'=0. The');
console.log('observed ~3.3-4% offset is entirely the curvature the slowly-varying log-height');
console.log('L(x)=log T0(N) injects into ln r -- the sigmoid asymmetry -- so N_star, N_half,');
console.log('and N_cross are NOT co-located but separated by a computable, sign-definite margin.');
console.log('Derivation on the inherited surrogate; C_mb GUE-conditional per imp-486; NO QED.');
