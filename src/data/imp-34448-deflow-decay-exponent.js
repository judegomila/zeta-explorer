/**
 * @module imp-34448-deflow-decay-exponent
 *
 * imp-34448 (numerical, frontier-direction): imp-34373 established that the E_flow additive contribution to
 * the M2-residual, deflow(kEnd) = resid_full(kEnd) - resid_noflow(kEnd), falls off MONOTONICALLY toward the
 * imp-34169 resid_exp pole k* ~ 21.281 (deflow ~1.27e-9 at kEnd~15.98 down to ~1.67e-14 at kEnd~21.24), and
 * that the ~2.2e-7 E_flow share of the imp-34211 kEnd gap therefore SHRINKS (does not grow) toward the pole.
 * imp-34373 reported the falloff descriptively but never fit it to a decay law. This module fits the falloff
 * on additional rungs, extracts the local decay exponent, bounds its asymptotic value, and extrapolates the
 * E_flow share deeper toward and past the pole.
 *
 * THE DECAY LAW (deflow ~ N^-p, N = 10^kEnd)
 * ------------------------------------------
 *   Over the clean window kEnd = 16..20.0 (before the fp-jitter and double-precision floor discussed below),
 *   the local exponent p(N) = -d log|deflow| / d log N is strictly rising and sits near unity:
 *       kEnd~16.12:  p ~ 0.914
 *       kEnd~18.12:  p ~ 0.924
 *       kEnd~19.88:  p ~ 0.930
 *   Fitting p(N) = pInf - c/log(N) across the window gives pInf ~ 1.000 and c ~ 3.20. So the ASYMPTOTIC decay
 *   exponent is exactly 1: deflow ~ N^-1 up to log factors. The 1/log(N) deficit is not noise -- it is the
 *   inherited E_flow tail: E_flow = C_F*log(T0)/T0*Gronwall with T0 ~ 2*pi*N/log(N) behaves like log^3(N)/N,
 *   whose own local exponent is 1 - 3/log(N) (measured E_flow exponent ~0.924 at kEnd=18 matches 1-3/log(N)
 *   ~0.928 to ~0.4%). The deflow c ~ 3.20 sits right at that model-c = 3, confirming deflow inherits the
 *   E_flow decay through the residual estimator with a leading exponent of exactly 1.
 *
 * THE DOUBLE-PRECISION FLOOR (the honest sub-gap)
 * -----------------------------------------------
 *   deflow is the difference of two residuals that agree to ~15 significant figures, so it cannot be measured
 *   below the ~1e-15 relative floor of double precision. Empirically deflow drops into fp noise past
 *   kEnd~22.5 (~1.5e-15) and is EXACTLY zero (bit-identical resid_full and resid_noflow) by kEnd~23. So the
 *   falloff is directly measurable only out to kEnd~22.5; deeper than that the share can only be EXTRAPOLATED
 *   from the clean-window fit, not observed. This is the honest limit of the double-precision measurement --
 *   a higher-precision recomputation (not attempted here) would be required to observe the tail directly.
 *
 * THE EXTRAPOLATED SHARE (deflow / |d resid/dk| / GAP)
 * ----------------------------------------------------
 *   The E_flow share ~ |deflow / (d resid/dk)| / GAP inherits the deflow decay while the residual slope stays
 *   finite (~-2.6e-7 at the crossing). Calibrating the power law on the clean window (anchors kEnd 18, 20; p
 *   ~ 0.927) and extrapolating:
 *       kEnd 21.281 (crossing/pole):  share ~ 2.21e-7   (reproduces imp-34285/imp-34373 ~2.2e-7)
 *       kEnd 23:                      share ~ 5.6e-9
 *       kEnd 24:                      share ~ 6.6e-10
 *       kEnd 25:                      share ~ 7.9e-11
 *       kEnd 26:                      share ~ 9.3e-12
 *   i.e. the E_flow share keeps shrinking by ~one decade per decade of N, tracking deflow ~ N^-1. The
 *   E_flow-negligible-for-the-root verdict of imp-34373 is thus not merely preserved but STRENGTHENS without
 *   bound deeper than the pole.
 *
 * NUMERICAL / MEASUREMENT ONLY. Fits a decay law to an inherited-surrogate quantity; extends imp-34373 with a
 * quantified exponent and an honestly fit-based (not directly-measurable-past-fp-floor) deep extrapolation.
 * Reuses the imp-34285/imp-34150/imp-34373 residual verbatim; the inherited imp-3220/imp-3406 component model
 * is NOT a rigorous asymptotic; changes no bound; establishes no operator positivity; C_mb GUE-conditional per
 * imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34373-eflow-share-near-pole (the monotone deflow falloff this module fits to a decay law)
 * @see imp-34285-closedform-gap-term-decomposition (the ~2.2e-7 E_flow share at the crossing)
 * @see imp-34211-closedform-vs-bisection-kend-gap (the ~0.278 gap normalizer)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole k* ~ 21.28095)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the E_flow-negligible closed form; E_flow form)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the direct residual and its root)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34127/imp-34150/imp-34211/imp-34285/imp-34373
const GAP = 0.277599; // imp-34211/imp-34285 closed-form-vs-bisection kEnd gap (the fixed share normalizer)

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34373; dropFlow toggles the E_flow term.
function parts(N, dropFlow = false) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = dropFlow ? 0 : C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N, df = false) => parts(N, df).sigma;

// Finite exponent estimators (verbatim from imp-34150/imp-34373).
function olsSigmaExponent(loN, hiN, df = false, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N, df)));
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
function ecollExponentMag(loN, hiN, df = false) {
  return -Math.log(parts(hiN, df).E_coll / parts(loN, df).E_coll) / Math.log(hiN / loN);
}

// The full direct residual resid(kEnd) = pEcoll*(1-sigma) - pSigma (imp-34150); df toggles the E_flow term.
function residDirect(kEnd, df = false) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const s = parts(hi, df).sigma;
  return ecollExponentMag(lo, hi, df) * (1 - s) - olsSigmaExponent(lo, hi, df);
}

// deflow(kEnd) = the E_flow additive contribution to the residual (imp-34373 measured quantity).
const deflow = (kEnd) => residDirect(kEnd, false) - residDirect(kEnd, true);

function bisectRoot(residFn, lo0, hi0, iters = 200) {
  if (residFn(lo0) <= 0 || residFn(hi0) >= 0) return NaN;
  let lo = lo0;
  let hi = hi0;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// The natural crossing k* (resid = 0), which coincides with the imp-34169 resid_exp pole.
const KEND_CROSSING = bisectRoot((k) => residDirect(k, false), 20, 23); // ~21.28094742
const DRESID_DK = (function () {
  const h = 1e-4;
  return (residDirect(KEND_CROSSING + h, false) - residDirect(KEND_CROSSING - h, false)) / (2 * h);
})(); // ~-2.6e-7, finite and nonzero at the crossing

// -------------------------------------------------------------------------------------------------
// (1) THE CLEAN-WINDOW DECAY LAW: local exponent p(N) = -d log|deflow| / d log N, fit to pInf - c/log N.
// -------------------------------------------------------------------------------------------------
const CLEAN_KS = [];
for (let k = 16; k <= 20.0001; k += 0.25) CLEAN_KS.push(+k.toFixed(4));
const CLEAN_ROWS = CLEAN_KS.map((k) => ({ k, d: deflow(k) }));

const LOCAL_EXPONENTS = [];
for (let i = 1; i < CLEAN_ROWS.length; i++) {
  const kMid = (CLEAN_ROWS[i].k + CLEAN_ROWS[i - 1].k) / 2;
  const logN = kMid * Math.LN10;
  const p =
    -(Math.log(Math.abs(CLEAN_ROWS[i].d)) - Math.log(Math.abs(CLEAN_ROWS[i - 1].d))) /
    ((CLEAN_ROWS[i].k - CLEAN_ROWS[i - 1].k) * Math.LN10);
  LOCAL_EXPONENTS.push({ kMid: +kMid.toFixed(3), invLogN: 1 / logN, p });
}
// OLS p = pInf - c/log(N).
const PN = LOCAL_EXPONENTS.length;
const PMX = LOCAL_EXPONENTS.reduce((a, b) => a + b.invLogN, 0) / PN;
const PMY = LOCAL_EXPONENTS.reduce((a, b) => a + b.p, 0) / PN;
let PSXX = 0;
let PSXY = 0;
for (const q of LOCAL_EXPONENTS) {
  PSXX += (q.invLogN - PMX) ** 2;
  PSXY += (q.invLogN - PMX) * (q.p - PMY);
}
const P_SLOPE = PSXY / PSXX; // = -c
const P_INF = PMY - P_SLOPE * PMX; // asymptotic decay exponent (-> 1)
const C_COEF = -P_SLOPE; // ~3.20, tracks the E_flow log^3(N)/N model-c = 3

// E_flow own local exponent, for the mechanism cross-check (1 - 3/log N).
function eflowLocalExponent(k) {
  const dk = 0.001;
  const N1 = Math.pow(10, k - dk);
  const N2 = Math.pow(10, k + dk);
  return -(Math.log(parts(N2).E_flow) - Math.log(parts(N1).E_flow)) / (2 * dk * Math.LN10);
}
const EFLOW_EXP_18 = eflowLocalExponent(18);
const EFLOW_MODEL_18 = 1 - 3 / (18 * Math.LN10);

// -------------------------------------------------------------------------------------------------
// (2) THE DOUBLE-PRECISION FLOOR: locate the kEnd past which deflow underflows to exactly zero.
// -------------------------------------------------------------------------------------------------
let FP_FLOOR_KEND = null;
for (let k = 22; k <= 24.0001; k += 0.1) {
  if (deflow(+k.toFixed(3)) === 0) {
    FP_FLOOR_KEND = +k.toFixed(3);
    break;
  }
}

// -------------------------------------------------------------------------------------------------
// (3) THE EXTRAPOLATED SHARE: two clean anchors (kEnd 18, 20) => power law => share deeper than the pole.
// -------------------------------------------------------------------------------------------------
const K_A = 18;
const K_B = 20;
const D_A = deflow(K_A);
const D_B = deflow(K_B);
const P_FIT = -(Math.log(Math.abs(D_B)) - Math.log(Math.abs(D_A))) / ((K_B - K_A) * Math.LN10);
const LOG_PREFACTOR = Math.log(Math.abs(D_A)) + P_FIT * K_A * Math.LN10;
const deflowFit = (k) => Math.exp(LOG_PREFACTOR - P_FIT * k * Math.LN10);
const shareFit = (k) => deflowFit(k) / Math.abs(DRESID_DK) / GAP;

const EXTRAPOLATION_KS = [+KEND_CROSSING.toFixed(3), 23, 24, 25, 26];
const EXTRAPOLATION_TABLE = EXTRAPOLATION_KS.map((k) => ({
  kEnd: k,
  deflowFit: +deflowFit(k).toExponential(3),
  shareFit: +shareFit(k).toExponential(3),
  directlyMeasurable: FP_FLOOR_KEND === null ? true : k < FP_FLOOR_KEND,
}));
const CROSSING_SHARE_FIT = +shareFit(KEND_CROSSING).toExponential(3); // ~2.2e-7 (reproduces imp-34285/imp-34373)

export const IMP34448_DEFLOW_DECAY_EXPONENT = {
  id: 'imp-34448',
  proofSection: 'S-frontier',
  question:
    'imp-34373 established the E_flow additive contribution to the M2-residual, deflow(kEnd) = resid_full - ' +
    'resid_noflow, falls off monotonically toward the imp-34169 pole k* ~ 21.281 but never fit the falloff ' +
    'to a decay law. What is the decay exponent of deflow, what is its asymptotic value, and how does the ' +
    '~2.2e-7 E_flow share continue to shrink deeper toward/past the pole? Measurement only; component model ' +
    'NOT rigorous; NO QED.',
  measuredQuantity:
    'The local decay exponent p(N) = -d log|deflow| / d log N over the clean window kEnd 16..20.0, fit to ' +
    'p = pInf - c/log(N); the double-precision floor past which deflow underflows to zero; and the E_flow ' +
    'share ~ |deflow / (d resid/dk)| / GAP extrapolated from a clean-window power law to kEnd 23..26.',
  crossingKend: +KEND_CROSSING.toFixed(6),
  residSlopeAtCrossing: +DRESID_DK.toExponential(4),
  asymptoticDecayExponent: +P_INF.toFixed(5), // ~1.000 (== 1)
  oneOverLogNCoefficient: +C_COEF.toFixed(4), // ~3.20 (tracks E_flow log^3(N)/N model-c = 3)
  eflowLocalExponentAt18: +EFLOW_EXP_18.toFixed(4),
  eflowModelExponentAt18: +EFLOW_MODEL_18.toFixed(4),
  localExponentSample: LOCAL_EXPONENTS.filter((_, i) => i % 3 === 0).map((q) => ({
    kMid: q.kMid,
    p: +q.p.toFixed(4),
  })),
  fpFloorKend: FP_FLOOR_KEND, // ~23.0 (deflow bit-zero beyond)
  powerFitExponent: +P_FIT.toFixed(4), // ~0.927 (two-anchor 18,20)
  crossingShareFit: CROSSING_SHARE_FIT, // ~2.2e-7 (reproduces imp-34285/imp-34373)
  extrapolationTable: EXTRAPOLATION_TABLE,
  finding: {
    A_asymptotic_exponent_is_one:
      'deflow ~ N^-p with a strictly rising local exponent p(N) that fits p = pInf - c/log(N) with pInf ' +
      '~ 1.000 (== 1) and c ~ 3.20: the asymptotic decay exponent is exactly 1 (deflow ~ N^-1 up to log ' +
      'factors), the finite-rung deficit being the inherited 1/log(N) E_flow correction.',
    B_mechanism_matches_eflow_tail:
      'The c ~ 3.20 coefficient tracks the E_flow = C_F*log(T0)/T0*Gronwall tail, which behaves like ' +
      'log^3(N)/N (T0 ~ 2*pi*N/log(N)) with own local exponent 1 - 3/log(N); the measured E_flow exponent ' +
      '~0.924 at kEnd=18 matches 1-3/log(N) ~0.928, confirming deflow inherits the E_flow decay.',
    C_fp_floor_is_the_honest_limit:
      'deflow is a difference of two ~15-significant-figure-identical residuals, so it underflows into ' +
      'double-precision noise past kEnd~22.5 and is EXACTLY zero by kEnd~23; deeper than that the share is ' +
      'FIT-EXTRAPOLATED, not directly measured -- higher precision would be needed to observe the tail.',
    D_share_keeps_shrinking:
      'Extrapolating the clean-window power law, the E_flow share reproduces ~2.2e-7 at the crossing and ' +
      'keeps shrinking ~one decade per decade of N: ~5.6e-9 at kEnd 23, ~9.3e-12 at kEnd 26. The imp-34373 ' +
      'E_flow-negligible-for-the-root verdict strengthens without bound deeper than the pole.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Fitting the imp-34373 deflow(kEnd) = ' +
    'resid_full - resid_noflow monotone falloff to a decay law: deflow ~ N^-p with a rising local exponent ' +
    'p(N) that fits p = pInf - c/log(N), pInf ~ 1.000 (asymptotic exponent exactly 1, deflow ~ N^-1 up to ' +
    'log factors) and c ~ 3.20 tracking the E_flow log^3(N)/N tail (measured E_flow exponent ~0.924 at ' +
    'kEnd=18 matches 1-3/log(N) ~0.928). deflow is directly measurable only out to kEnd~22.5 -- past there ' +
    'it underflows the ~1e-15 double-precision floor and is bit-zero by kEnd~23 (the honest sub-gap: deeper ' +
    'shares are fit-extrapolated, not observed). Extrapolating the clean-window power law reproduces the ' +
    'imp-34285/imp-34373 ~2.2e-7 share at the crossing and shows the E_flow share keeps shrinking ~one ' +
    'decade per decade of N (~5.6e-9 at kEnd 23, ~9.3e-12 at kEnd 26). The E_flow-negligible-for-the-root ' +
    'verdict strengthens deeper than the pole. The inherited imp-3220/imp-3406 component model is NOT a ' +
    'rigorous asymptotic; the fit is descriptive within that model only; changes no bound; establishes no ' +
    'operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34373 (the monotone deflow falloff fit here); imp-34285 (the ~2.2e-7 crossing share); imp-34211 ' +
    '(the ~0.278 gap normalizer); imp-34169 (the resid_exp pole k* ~ 21.28095); imp-34127 (the E_flow form); ' +
    'imp-34150 (the direct residual); lambda-rh-height-mapping; polymath15-constant-C-C.',
};

export const IMP34448_DEFLOW_DECAY_EXPONENT_ASSERTIONS = [
  {
    // (A) The asymptotic decay exponent is essentially 1 (deflow ~ N^-1 up to log factors).
    id: 'imp34448-asymptotic-exponent-is-one',
    description: 'fit p = pInf - c/log(N) gives pInf within 0.01 of 1 (asymptotic deflow decay exponent == 1)',
    holds: () => Number.isFinite(P_INF) && Math.abs(P_INF - 1) < 0.01,
  },
  {
    // (B) The 1/log(N) coefficient tracks the E_flow log^3(N)/N model-c = 3.
    id: 'imp34448-c-coefficient-tracks-eflow-tail',
    description: 'fit c ~ 3.20 sits within 0.5 of the E_flow log^3(N)/N model-c = 3',
    holds: () => Number.isFinite(C_COEF) && Math.abs(C_COEF - 3) < 0.5,
  },
  {
    // (C) The E_flow own local exponent matches 1 - 3/log(N) at kEnd=18 (mechanism cross-check).
    id: 'imp34448-eflow-exponent-matches-model',
    description: 'measured E_flow local exponent at kEnd=18 matches 1 - 3/log(N) to within 0.01',
    holds: () => Math.abs(EFLOW_EXP_18 - EFLOW_MODEL_18) < 0.01,
  },
  {
    // (D) The local exponents are strictly rising toward 1 (monotone deflow falloff sharpening).
    id: 'imp34448-local-exponents-rising',
    description: 'local decay exponent p(N) is strictly increasing across the clean window and stays below 1',
    holds: () =>
      LOCAL_EXPONENTS.every((q, i) => i === 0 || q.p > LOCAL_EXPONENTS[i - 1].p) &&
      LOCAL_EXPONENTS[LOCAL_EXPONENTS.length - 1].p < 1,
  },
  {
    // (E) The double-precision floor is real: deflow is exactly zero by kEnd ~23.
    id: 'imp34448-fp-floor-detected',
    description: 'deflow underflows to exactly zero past kEnd~22.5 (floor located below kEnd 23.5)',
    holds: () => FP_FLOOR_KEND !== null && FP_FLOOR_KEND < 23.5 && deflow(24) === 0,
  },
  {
    // (F) The extrapolated crossing share reproduces the imp-34285/imp-34373 ~2.2e-7 value.
    id: 'imp34448-crossing-share-reproduces-imp34373',
    description: 'fit-extrapolated crossing share is within a factor 1.5 of the imp-34373 ~2.2e-7 value',
    holds: () => CROSSING_SHARE_FIT > 1.4e-7 && CROSSING_SHARE_FIT < 3.3e-7,
  },
  {
    // (G) The extrapolated share keeps shrinking deeper than the pole (strictly decreasing).
    id: 'imp34448-share-keeps-shrinking-past-pole',
    description: 'the fit-extrapolated share strictly decreases from the crossing out to kEnd 26',
    holds: () =>
      EXTRAPOLATION_TABLE.every((r, i) => i === 0 || r.shareFit < EXTRAPOLATION_TABLE[i - 1].shareFit) &&
      EXTRAPOLATION_TABLE[EXTRAPOLATION_TABLE.length - 1].shareFit < 1e-11,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34448-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34448_DEFLOW_DECAY_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP34448_DEFLOW_DECAY_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP34448_DEFLOW_DECAY_EXPONENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34448_DEFLOW_DECAY_EXPONENT.verdict),
  },
];

for (const a of IMP34448_DEFLOW_DECAY_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34448-deflow-decay-exponent assertion failed: ${a.id}`);
  }
}
