/**
 * @module imp-34133-f2-f3-asymptotic-constant-fit
 *
 * imp-34133 (numerical, frontier-direction): imp-34023 measured the imp-33969 F4 collapse as a clean
 * geometric decay (ln F4 linear in kEnd, R^2 ~ 0.99942, per-unit factor ~0.359) and established that the
 * over-prediction ratio 1/(F2*F3*F4) DIVERGES without bound as the fit boundary kEnd recedes toward the
 * imp-33773 M2 residual sign-change ceiling at kEnd* ~ 21.28. But imp-34023 only ASSERTED that the two
 * companion attenuation factors F2 (per-unit factor ~0.9739) and F3 (~0.9907) are near-flat and "approach
 * constants" -- it fit them as single log-linear per-unit factors over the narrow kEnd=11..13 anchor
 * window and never fit their ASYMPTOTIC limits over the full sign-stable ladder. This module supplies that
 * fit: on the same inherited imp-3406/imp-33810 sub-terms (head fixed at k=6) it regresses F2(kEnd) and
 * F3(kEnd) across the extended sign-stable ladder kEnd = 13.0..21.0 against a constant-plus-decay form
 * F(kEnd) = c + A*exp(-r*kEnd), and reports the fitted asymptotic constants c and the residual decay rates
 * r -- confirming (or refuting) that F2, F3 SATURATE while F4 alone drives the divergence.
 *
 * THE CONSTANT-PLUS-DECAY FIT (F2 and F3 both saturate to finite positive constants)
 * --------------------------------------------------------------------------------
 *   F2(kEnd) = c + A*exp(-r*kEnd) fits the 17 sign-stable rungs (kEnd = 13.0..21.0 step 0.5) essentially
 *   perfectly: c ~ 0.059492, r ~ 1.1165, R^2 ~ 0.9999999. F3(kEnd) = c + A*exp(-r*kEnd) fits with
 *   c ~ 0.835955, r ~ 0.125, R^2 ~ 0.99997. Both asymptotic constants are FINITE and POSITIVE, so both
 *   factors SATURATE (F2 -> ~0.0595 from above, F3 -> ~0.836), converging faster in F2 (r ~ 1.12) than in
 *   the barely-moving F3 (r ~ 0.13). Neither collapses toward 0; only F4 does (F4 falls 0.11339 at kEnd=13
 *   to 3.65e-6 at kEnd=21, ~x3.1e-5), so the divergence of 1/(F2*F3*F4) is driven by F4 ALONE. CONFIRMED,
 *   not refuted.
 *
 * INDEPENDENT ANALYTIC CROSS-CHECK OF THE F2 ASYMPTOTE (E_N floor -> E_TRUNC_PT)
 * ---------------------------------------------------------------------------
 *   The F2 asymptote is not just a curve-fit artifact: F2 = TAIL.E_N / HEAD.E_N, and as N = 10^kEnd grows
 *   both moving parts of E_N = E_TRUNC_PT + E_flow + E_coll vanish (E_coll ~ sqrt(L/N) -> 0, E_flow ~
 *   (L/T0) -> 0), so TAIL.E_N collapses onto the N-independent floor E_TRUNC_PT = 3.06e-5. The analytic
 *   limit E_TRUNC_PT / HEAD.E_N ~ 0.0594922 MATCHES the fitted constant c ~ 0.0594921 to ~6 significant
 *   figures -- so the F2 saturation is a genuine floor effect, not a numerical coincidence. The F3
 *   asymptote is a slower approach (the E_flow log-slope carries log-log corrections that converge only
 *   sluggishly), so the fitted c ~ 0.836 is the better estimate of its limit than any single large-N probe.
 *
 * The punchline: on the extended sign-stable ladder both companion factors fit a constant-plus-decay form
 * with FINITE positive asymptotes (F2 -> 0.0595, cross-checked by the analytic E_TRUNC_PT floor; F3 ->
 * 0.836), confirming imp-34023's assertion that F2, F3 saturate while F4 alone (collapsing toward 0) drives
 * the geometric divergence of the over-prediction ratio.
 *
 * NUMERICAL / MEASUREMENT ONLY. Curve fit of an inherited surrogate ratio, NOT an RH bound. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the constant-plus-decay fit is descriptive
 * within that model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the F4 geometric collapse + the near-flat
 *   F2, F3 assertion this module fits to asymptotic constants; same sub-terms, head fixed at k=6)
 * @see imp-33969-eflow-decay-widening-ratio-kend-sweep (the 9-window kEnd=11..13 F1..F4 decomposition)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the quarter-decade rungs reused verbatim)
 * @see imp-33773 (the M2 residual whose sign change at kEnd ~ 21.28 caps the sign-stable ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33969/imp-34023 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34023 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810 endpoint rung at boundary k (head k=6, tail k=kEnd) -- same as imp-34023.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  return { k, E_N: ph.E_N, resid, sflow };
}

const HEAD = rung(6); // fixed head, exactly as imp-34023

// Per-boundary attenuation factors (head fixed at k=6), same identity as imp-34023.
function factors(kEnd) {
  const TAIL = rung(kEnd);
  const F2 = TAIL.E_N / HEAD.E_N; // normaliser collapse (-> E_TRUNC_PT/HEAD.E_N floor)
  const F3 = HEAD.sflow / TAIL.sflow; // E_flow log-slope ratio
  const F4 = TAIL.resid / HEAD.resid; // imp-33773 residual ratio (the driver)
  return { kEnd, F2, F3, F4, resid: TAIL.resid };
}

// Constant-plus-decay fit F(k) = c + A*exp(-r*k): grid-search r, linear least-squares for (c, A).
function fitConstantPlusDecay(ks, fs) {
  const n = ks.length;
  const mf = fs.reduce((a, b) => a + b, 0) / n;
  let sst = 0;
  for (let i = 0; i < n; i++) sst += (fs[i] - mf) ** 2;
  let best = null;
  for (let r = 0.02; r <= 3.0 + 1e-9; r += 0.0005) {
    const e = ks.map((k) => Math.exp(-r * k));
    const me = e.reduce((a, b) => a + b, 0) / n;
    let see = 0;
    let sef = 0;
    for (let i = 0; i < n; i++) {
      see += (e[i] - me) ** 2;
      sef += (e[i] - me) * (fs[i] - mf);
    }
    const A = sef / see;
    const c = mf - A * me;
    let sse = 0;
    for (let i = 0; i < n; i++) {
      const pred = c + A * e[i];
      sse += (fs[i] - pred) ** 2;
    }
    if (!best || sse < best.sse) best = { r, A, c, sse, R2: 1 - sse / sst };
  }
  return best;
}

// -- The extended sign-stable ladder kEnd = 13.0..21.0 step 0.5 (resid > 0 => F4 > 0, decomposition valid).
const LADDER_KENDS = [];
for (let k = 13; k <= 21 + 1e-9; k += 0.5) LADDER_KENDS.push(+k.toFixed(2));
const LADDER = LADDER_KENDS.map(factors).filter((r) => r.resid > 0);
const KS = LADDER.map((r) => r.kEnd);

const F2_FIT = fitConstantPlusDecay(KS, LADDER.map((r) => r.F2));
const F3_FIT = fitConstantPlusDecay(KS, LADDER.map((r) => r.F3));

// Independent analytic cross-check of the F2 asymptote: E_N -> E_TRUNC_PT floor as N grows.
const F2_ASYMPTOTE_ANALYTIC = E_TRUNC_PT / HEAD.E_N; // ~0.0594922
const F2_ASYMPTOTE_MATCH = Math.abs(F2_FIT.c - F2_ASYMPTOTE_ANALYTIC); // ~4e-8

// F4 contrast: it alone collapses toward 0 over the same ladder.
const F4_AT_13 = LADDER[0].F4;
const F4_AT_21 = LADDER[LADDER.length - 1].F4;
const F4_COLLAPSE_RATIO = F4_AT_21 / F4_AT_13; // ~3.2e-5 (F4 -> 0)

export const IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT = {
  id: 'imp-34133',
  proofSection: 'S-frontier',
  question:
    'imp-34023 asserted that the companion attenuation factors F2 (~0.974/unit) and F3 (~0.991/unit) ' +
    'are near-flat and "approach constants" while F4 collapses geometrically, but only fit them as single ' +
    'log-linear per-unit factors over the kEnd=11..13 anchor window -- it never fit their ASYMPTOTIC ' +
    'limits. On the same inherited sub-terms (head fixed at k=6), regress F2(kEnd) and F3(kEnd) across the ' +
    'extended sign-stable ladder kEnd=13..21 against a constant-plus-decay form F(kEnd)=c+A*exp(-r*kEnd) ' +
    'and report the fitted asymptotic constants c and decay rates r: do F2, F3 SATURATE (so F4 alone ' +
    'drives the divergence)? Numerical/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'Constant-plus-decay OLS F(kEnd)=c+A*exp(-r*kEnd) of F2(kEnd) and F3(kEnd) over the 17 sign-stable ' +
    'rungs kEnd=13.0..21.0 step 0.5 (head fixed at k=6, r grid-searched over [0.02,3.0] step 5e-4, (c,A) ' +
    'closed-form least-squares per r), reporting the fitted asymptotic constant c, residual decay rate r ' +
    'and R^2 for each factor, plus the independent analytic F2 asymptote E_TRUNC_PT/HEAD.E_N and the F4 ' +
    'collapse ratio F4(21)/F4(13) for contrast.',
  ladderWindow: {
    kEnd_lo: 13.0,
    kEnd_hi: 21.0,
    step: 0.5,
    sign_stable_rungs: LADDER.length, // 17 (all resid > 0 below the imp-33773 kEnd* ~ 21.28 ceiling)
  },
  f2Fit: {
    form: 'F2(kEnd) = c + A*exp(-r*kEnd)',
    asymptoticConstant_c: +F2_FIT.c.toFixed(8), // ~0.05949212
    decayRate_r: +F2_FIT.r.toFixed(4), // ~1.1165
    amplitude_A: +F2_FIT.A.toFixed(4), // ~832.40
    R2: +F2_FIT.R2.toFixed(9), // ~0.999999872
    asymptote_analytic_E_TRUNC_over_HEAD_E_N: +F2_ASYMPTOTE_ANALYTIC.toFixed(8), // ~0.05949216
    asymptote_fit_vs_analytic_absdiff: +F2_ASYMPTOTE_MATCH.toExponential(3), // ~4e-8 (6-sig-fig match)
  },
  f3Fit: {
    form: 'F3(kEnd) = c + A*exp(-r*kEnd)',
    asymptoticConstant_c: +F3_FIT.c.toFixed(6), // ~0.835955
    decayRate_r: +F3_FIT.r.toFixed(4), // ~0.1250 (much slower than F2)
    amplitude_A: +F3_FIT.A.toFixed(6), // ~0.275420
    R2: +F3_FIT.R2.toFixed(8), // ~0.99996759
  },
  f4Contrast: {
    F4_at_kEnd_13: +F4_AT_13.toExponential(5), // ~1.13392e-1
    F4_at_kEnd_21: +F4_AT_21.toExponential(5), // ~3.65247e-6
    F4_collapse_ratio_21_over_13: +F4_COLLAPSE_RATIO.toExponential(4), // ~3.2e-5 (F4 -> 0)
  },
  verdict:
    'NUMERICAL / CURVE-FIT (frontier-direction, NOT rigorous). On the extended sign-stable ladder ' +
    'kEnd=13..21 (17 rungs, same inherited imp-3406/imp-33810 sub-terms, head fixed at k=6), the two ' +
    'companion attenuation factors BOTH fit a constant-plus-decay form F(kEnd)=c+A*exp(-r*kEnd) with ' +
    'FINITE POSITIVE asymptotes: F2 -> c ~ 0.059492 (r ~ 1.1165, R^2 ~ 0.9999999) and F3 -> c ~ 0.835955 ' +
    '(r ~ 0.125, R^2 ~ 0.99997). Both SATURATE (F2 converging faster, F3 barely moving); neither collapses ' +
    'toward 0. The F2 asymptote is independently confirmed by the analytic E_N floor: E_TRUNC_PT/HEAD.E_N ' +
    '~ 0.0594922 matches the fitted c ~ 0.0594921 to ~6 significant figures (E_coll, E_flow -> 0 so ' +
    'TAIL.E_N -> the N-independent E_TRUNC_PT floor). By contrast F4 collapses from 0.11339 (kEnd=13) to ' +
    '3.65e-6 (kEnd=21), ~x3.2e-5. So imp-34023 is CONFIRMED, not refuted: F2 and F3 saturate to finite ' +
    'constants while F4 ALONE (collapsing geometrically toward 0) drives the divergence of the ' +
    'over-prediction ratio 1/(F2*F3*F4). The inherited imp-3220/imp-3406 component model is NOT a rigorous ' +
    'asymptotic; the fit is descriptive within the model only; changes no bound; establishes no operator ' +
    'positivity; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  isRigorous: false,
  citation:
    'imp-34023 (the F4 geometric collapse + the near-flat F2, F3 assertion fit here to asymptotic ' +
    'constants); imp-33969 (the 9-window F1..F4 decomposition); imp-33810 (the quarter-decade rungs); ' +
    'imp-33773 (the M2 residual whose sign change at kEnd ~ 21.28 caps the sign-stable ladder); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT_ASSERTIONS = [
  {
    // F2 fits a constant-plus-decay form with a finite positive asymptote near 0.0595 and a good decay.
    id: 'imp34133-f2-saturates-to-finite-constant',
    description: 'F2(kEnd)=c+A*exp(-r*kEnd): c ~ 0.0595 (finite, positive), r ~ 1.12, R2 > 0.9999',
    holds: () =>
      LADDER.length === 17 &&
      F2_FIT.c > 0.059 &&
      F2_FIT.c < 0.06 &&
      F2_FIT.r > 1.0 &&
      F2_FIT.r < 1.25 &&
      F2_FIT.R2 > 0.9999,
  },
  {
    // The F2 asymptote is a genuine E_N floor effect: matches E_TRUNC_PT/HEAD.E_N to ~6 sig figs.
    id: 'imp34133-f2-asymptote-matches-analytic-floor',
    description: 'fitted F2 constant matches the analytic E_TRUNC_PT/HEAD.E_N floor within 1e-5',
    holds: () => F2_ASYMPTOTE_MATCH < 1e-5 && F2_ASYMPTOTE_ANALYTIC > 0.059 && F2_ASYMPTOTE_ANALYTIC < 0.06,
  },
  {
    // Storage-precision guard (imp-34225, the imp-2546/imp-2539/imp-2643 red-build trap): the
    // toFixed(8) stored fields reconstruct to their live full-precision counterparts within the
    // half-ULP floor (0.5e-8 each), and the 1e-5 tolerance used by the assertion above safely
    // exceeds the combined 1e-8 storage floor.
    id: 'imp34133-f2-analytic-floor-storage-tolerance-pinned',
    description:
      'Stored toFixed(8) f2Fit.asymptoticConstant_c and asymptote_analytic_E_TRUNC_over_HEAD_E_N ' +
      'reconstruct within the 0.5e-8 half-ULP floor, and the 1e-5 cross-check tolerance exceeds the ' +
      'combined 1e-8 storage floor',
    holds: () =>
      Math.abs(IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT.f2Fit.asymptoticConstant_c - F2_FIT.c) <= 0.5e-8 &&
      Math.abs(
        IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT.f2Fit.asymptote_analytic_E_TRUNC_over_HEAD_E_N -
          F2_ASYMPTOTE_ANALYTIC,
      ) <= 0.5e-8 &&
      1e-5 >= 1e-8,
  },
  {
    // F3 also saturates: finite positive asymptote near 0.836, much slower decay than F2.
    id: 'imp34133-f3-saturates-to-finite-constant',
    description: 'F3(kEnd)=c+A*exp(-r*kEnd): c ~ 0.836 (finite, positive, < 1), r ~ 0.125, R2 > 0.999',
    holds: () =>
      F3_FIT.c > 0.82 &&
      F3_FIT.c < 0.85 &&
      F3_FIT.r > 0.05 &&
      F3_FIT.r < 0.3 &&
      F3_FIT.r < F2_FIT.r &&
      F3_FIT.R2 > 0.999,
  },
  {
    // F4 ALONE drives the divergence: it collapses toward 0 across the same ladder (x3.2e-5).
    id: 'imp34133-f4-alone-drives-divergence',
    description: 'F4 collapses 0.1134 -> 3.65e-6 over kEnd=13..21 while F2, F3 saturate to finite constants',
    holds: () =>
      F4_AT_13 > 0.1 &&
      F4_AT_21 > 0 &&
      F4_AT_21 < 1e-5 &&
      F4_COLLAPSE_RATIO < 1e-4 &&
      F2_FIT.c > 0.01 &&
      F3_FIT.c > 0.5,
  },
  {
    // Honesty gate: numerical/curve-fit only, isRigorous false, no QED, K_a untouched, PT SOTA.
    id: 'imp34133-honesty-gate-no-qed',
    description: 'Curve-fit only: isRigorous false, no QED, imp-3066 K_a >= 0 untouched, PT SOTA',
    holds: () =>
      IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT.isRigorous === false &&
      /NO QED/.test(IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT.verdict) &&
      /remains\s+SOTA/.test(IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT.verdict),
  },
  {
    // imp-34236: harmonize the C_mb GUE-conditional per imp-486 UNTOUCHED clause with the six
    // sibling cohort modules (imp-34223 audit found this module never named C_mb explicitly).
    id: 'imp34133-cmb-clause-named',
    description: 'Verdict names the C_mb GUE-conditional per imp-486 UNTOUCHED clause explicitly, matching the sibling cohort modules',
    holds: () => /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT.verdict),
  },
];

for (const a of IMP34133_F2_F3_ASYMPTOTIC_CONSTANT_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34133-f2-f3-asymptotic-constant-fit assertion failed: ${a.id}`);
  }
}
