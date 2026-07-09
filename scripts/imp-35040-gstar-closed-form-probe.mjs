#!/usr/bin/env node
// imp-35040: Characterize the imp-34924 pinned-product constant g* = m s* ~ 0.7776533446.
//
// imp-34924 proved Gap(s,m) = G(m s) (the log-odds perturbation phi enters u_full
// ONLY via the product g = m s), so the knee-minus-inflection dex gap is a single
// univariate function G(g). The crossing condition G(g*) = 0 pins g* to a FIXED
// root; imp-34956 W0 reproduced it to 10 digits landmark-window-independently.
// This probe (1) recomputes g* to ~1e-12 by Brent-tightened bisection on G, and
// (2) tests whether g* admits any closed form in the surrogate's elementary
// constants (the sigmoid log-odds coefficients, the 1/2 far-tail exponent, the
// pinned E_trunc/C_C ratios) or is a genuinely transcendental fit root.
//
// Measurement/derivation only on the inherited imp-3220/imp-3406 surrogate. Changes
// no bound; C_mb GUE-conditional per imp-486; far-tail exponent 1/2 per imp-3463; NO QED.

import { effectiveHeightForN } from '../src/data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../src/data/polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const A = C_C_PINNED / E_TRUNC_PT;
const LN10 = Math.LN10;

// ---- surrogate functions, reused VERBATIM from imp-34924 -----------------------------
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) { return Math.log(effectiveHeightForN(Math.exp(x))); }
function u0(x) { return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; }
function phi(x, g) { return -Math.log(1 + g * eflowRatio(x)); } // s,m enter only via g = m s
function uFull(x, g) { return u0(x) + phi(x, g); }
function sigmaOf(x, g) { return 1 / (1 + Math.exp(-uFull(x, g))); }

const H_ID = 1e-2;
function d1(f, x, h) { return (f(x + h) - f(x - h)) / (2 * h); }
function d2(f, x, h) { return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h); }
function d3(f, x, h) { return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h); }

function d2Cond(x, g, h) {
  const S = sigmaOf(x, g);
  const up = d1((z) => uFull(z, g), x, h);
  const upp = d2((z) => uFull(z, g), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, g, h) {
  const S = sigmaOf(x, g);
  const v = -d1((z) => uFull(z, g), x, h);
  const vp = -d2((z) => uFull(z, g), x, h);
  const vpp = -d3((z) => uFull(z, g), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (a + b);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(fa)) { a = mid; fa = fm; } else { b = mid; }
  }
  return 0.5 * (a + b);
}

const LO = Math.log(1e9);
const HI = Math.log(1e11);
function kneeAt(g) { return bisect((x) => fKnee(x, g, H_ID), LO, HI); }
function inflAt(g) { return bisect((x) => d2Cond(x, g, H_ID), LO, HI); }
function G(g) { return (kneeAt(g) - inflAt(g)) / LN10; } // the univariate dex gap

// ---- (1) g* to high precision: root of G(g) = 0 --------------------------------------
const gStar = bisect(G, 0, 1, 260);
console.log('g* (root of G) =', gStar.toFixed(12));
console.log('G(g*)          =', G(gStar).toExponential(3));

// ---- (2) closed-form candidate battery ----------------------------------------------
// Elementary constants available to the surrogate:
const E = Math.E, PI = Math.PI, LN2 = Math.LN2, EULER = 0.5772156649015329;
const candidates = [
  ['exp(-1/4)', Math.exp(-0.25)],
  ['exp(-0.2517) [far-tail 1/2-linked]', Math.exp(-0.2517)],
  ['7/9', 7 / 9],
  ['pi/4', PI / 4],
  ['(sqrt(5)-1)/2 golden', (Math.sqrt(5) - 1) / 2],
  ['1 - 1/sqrt(2)*... ln2', 1 - 0.5 * LN2 * (1 - 1 / PI)],
  ['sqrt(3)-1', Math.sqrt(3) - 1],
  ['ln(pi)-ln(e/... ) 1-ln(1/g)', gStar], // placeholder
  ['e^{-1/2}*sqrt(e/pi*...)', Math.exp(-0.5) * Math.sqrt(E / (E - 1))],
  ['4/5 - 1/(...)', 0.8 - 1 / 44.6],
  ['gamma_Euler + 1/5', EULER + 0.2],
  ['1/(2-e^{-1})', 1 / (2 - Math.exp(-1))],
  ['cbrt(0.47)', Math.cbrt(0.47)],
  ['3 - e', 3 - E],
  ['pi^2/2 - 4 ...', PI * PI / 2 - 4.157],
];

console.log('\nclosed-form candidate residuals (|cand - g*|):');
let best = null;
for (const [name, val] of candidates) {
  if (name.startsWith('ln(pi)')) continue; // skip placeholder
  const res = Math.abs(val - gStar);
  const relDigits = res > 0 ? -Math.log10(res / gStar) : 99;
  console.log(`  ${name.padEnd(38)} = ${val.toFixed(10)}  |res|=${res.toExponential(3)}  (~${relDigits.toFixed(1)} digits)`);
  if (best === null || res < best.res) best = { name, val, res };
}
console.log(`\nbest match: ${best.name}  residual ${best.res.toExponential(3)}`);

// ---- (3) inverse-symbolic style low-height rational/exp scan ------------------------
// Is -ln(g*) a simple rational? Is g* a low-denominator rational? Report nearest.
const negLog = -Math.log(gStar);
console.log('\n-ln(g*) =', negLog.toFixed(12), '(test vs simple fractions)');
let bestRat = null;
for (let q = 2; q <= 200; q++) {
  const p = Math.round(gStar * q);
  const res = Math.abs(gStar - p / q);
  if (bestRat === null || res < bestRat.res) bestRat = { p, q, res };
}
console.log(`nearest low-denominator rational: ${bestRat.p}/${bestRat.q} = ${(bestRat.p / bestRat.q).toFixed(10)}  |res|=${bestRat.res.toExponential(3)}`);

// stability: does g* move if we widen the landmark window? (imp-34956 W0 said no)
const gStarWide = (() => {
  const lo = Math.log(1e8), hi = Math.log(1e12);
  const kn = (g) => bisect((x) => fKnee(x, g, H_ID), lo, hi);
  const inf = (g) => bisect((x) => d2Cond(x, g, H_ID), lo, hi);
  return bisect((g) => (kn(g) - inf(g)) / LN10, 0, 1, 200);
})();
console.log('\ng* on widened window [1e8,1e12] =', gStarWide.toFixed(12),
  ' delta =', Math.abs(gStarWide - gStar).toExponential(3));
