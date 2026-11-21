/**
 * @module imp-33969-eflow-decay-widening-ratio-kend-sweep
 *
 * imp-33969 (accuracy, frontier-direction): imp-33922 measured that the raw analytic (log N)^3/N
 * E_flow decay factor F1 OVER-predicts the empirical head-to-tail widening of the attributed ratio
 * roe(k) = resid_exp(k)/eflow_attr(k) by a factor F1/widening = 19.913, but ONLY at the single fixed
 * imp-33884 fit boundary kEnd=11. imp-33917 then showed the endpoint feature of the SAME ladder is
 * boundary-locked and NOT saturating -- the log-linear endpoint peak grows monotonically as the fit
 * boundary kEnd recedes 11.00 -> 13.00. Since the widening = roe(kEnd)/roe(6) has its tail at kEnd,
 * a receding boundary changes the widening, so the ~19.9x over-prediction was never tested for
 * window-stability. This module supplies that test: it recomputes the raw decay F1 and the attribution
 * attenuation F2*F3*F4 at EVERY boundary of the imp-33917 sweep (kEnd = 11.00 .. 13.00, step 0.25,
 * the same 9 windows, the same inherited imp-3406/imp-33810 sub-terms) and tabulates F1/widening
 * across it: is the ~19.9x window-invariant, or does it drift -- and which factor drives any drift?
 *
 * THE KEY ALGEBRAIC IDENTITY (why F1/widening IS the inverse attenuation)
 * ---------------------------------------------------------------------
 *   The exact four-factor decomposition (imp-28895/imp-33884) is widening = F1*F2*F3*F4, so
 *       F1 / widening = 1 / (F2*F3*F4) = 1 / attenuation      (exact, per window).
 *   The over-prediction factor is therefore PRECISELY the inverse of the attribution attenuation; the
 *   raw decay F1 itself cancels. "Does F1/widening drift" is EXACTLY "does the attenuation F2*F3*F4
 *   drift", and "which factor drives the drift" is "which of F2, F3, F4 moves most as kEnd recedes".
 *
 * THE FACTORS (same inherited sub-terms as imp-33922, tail moved from k=11 to k=kEnd)
 * ---------------------------------------------------------------------------------
 *   HEAD = rung(6) fixed (evaluated at N=1e7). For each boundary kEnd, TAIL = rung(kEnd) (at 1e(kEnd+1)):
 *       F1 = E_flow(6)/E_flow(kEnd)   -- the RAW (log N)^3/N head-to-tail E_flow decay
 *       F2 = E_N(kEnd)/E_N(6)         -- the normaliser collapse (E_N -> E_trunc as N grows)
 *       F3 = sflow(6)/sflow(kEnd)     -- the E_flow log-slope ratio
 *       F4 = resid(kEnd)/resid(6)     -- the imp-33773 M2 sub-leading residual ratio
 *   widening = roe(kEnd)/roe(6) = F1*F2*F3*F4; ratio = F1/widening = 1/(F2*F3*F4).
 *
 * THE FINDING (accuracy / measurement only -- the ~19.9x is NOT window-invariant; F4 drives the drift)
 * ---------------------------------------------------------------------------------------------------
 *   (R1) F1/widening IS THE INVERSE ATTENUATION, PER WINDOW, TO MACHINE PRECISION. At every one of the
 *        9 boundaries F1/widening = 1/(F2*F3*F4) to rel ~1e-15 -- the raw decay F1 cancels exactly, so
 *        the over-prediction factor is a pure attribution-attenuation quantity. At the anchor kEnd=11 it
 *        recovers the imp-33922 value 19.913 (= 1/0.05022) to the reported precision.
 *   (R2) THE ~19.9x IS NOT WINDOW-INVARIANT -- IT DRIFTS STRONGLY AND MONOTONICALLY UPWARD. As the fit
 *        boundary recedes 11.00 -> 13.00 the over-prediction factor rises MONOTONICALLY from 19.913 to
 *        165.351, a factor of 8.30 over the sweep. The raw decay F1 (17992 -> 1.10e6, x61) outruns the
 *        widening (903.5 -> 6672.6, x7.4), so taking the raw decay alone gets STEADILY WORSE as the
 *        window extends -- the ~19.9x anchor value is a lower bound of the over-prediction, not a stable
 *        constant. The attenuation collapses in lock-step 0.05022 -> 0.006048 (x0.120).
 *   (R3) THE DRIFT IS DRIVEN BY F4 (THE imp-33773 RESIDUAL RATIO), NOT THE NORMALISER F2 -- REORDERING
 *        THE imp-33922 ATTRIBUTION. Of the three attenuation factors, only F4 moves materially across
 *        the sweep: F4 collapses 0.87432 -> 0.11339 (x0.130) while F2 (0.06332 -> 0.05991, x0.946) and
 *        F3 (0.90709 -> 0.89031, x0.982) are nearly flat. On a log scale F4 supplies ~96.5% of the
 *        ln(attenuation) drift vs F2 ~2.6% and F3 ~0.9%. This REORDERS imp-33922: the normaliser F2
 *        dominates the attenuation LEVEL at the anchor (~92% of ln F2*F3*F4 there) but the residual
 *        ratio F4 dominates its DRIFT as the boundary recedes. The F4 collapse is the same tail feature
 *        the imp-33917 endpoint peak tracks -- the receding-boundary residual, not the normaliser.
 *
 * The punchline: F1/widening is exactly 1/(F2*F3*F4), and it is NOT window-invariant -- over the
 * imp-33917 sweep kEnd = 11..13 it drifts monotonically upward by a factor of 8.30 (19.913 -> 165.351),
 * so the raw (log N)^3/N decay over-predicts the widening WORSE and worse as the fit boundary recedes.
 * The drift is ~96.5% driven by the imp-33773 residual ratio F4 (which collapses x0.130), NOT by the
 * normaliser F2 (x0.946) that dominates the attenuation LEVEL at the anchor -- the level-dominant and
 * drift-dominant factors are different.
 *
 * ACCURACY / MEASUREMENT ONLY. Window-stability cross-check of an inherited surrogate ratio, NOT an RH
 * bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the closed-form
 * E_flow scaling and the OLS sub-terms are descriptive within that model only; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33922-eflow-analytic-decay-vs-widening-crosscheck (the fixed-kEnd=11 ~19.9x over-prediction)
 * @see imp-33917-endpoint-residual-growth-law (the 9-window kEnd = 11..13 boundary sweep reused here)
 * @see imp-33884-eflow-resid-widening-fullprec-recompute (the exact 903.538 widening + F1..F4 factors)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33922 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33922 (no re-derivation).
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

// imp-33810 helper defns (verbatim), needed for the resid_exp endpoints.
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

// The imp-33810 endpoint rung at boundary k (head k=6, tail k=kEnd) -- the roe = resid/eflow ratio.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, resid, sflow, eflow, roe: resid / eflow };
}

const HEAD = rung(6); // fixed head, exactly as imp-33922

// Sweep the fit boundary kEnd = 11.00 .. 13.00 step 0.25 -- the SAME 9 windows as imp-33917.
const K_ENDS = [];
for (let k = 11; k <= 13 + 1e-9; k += 0.25) K_ENDS.push(+k.toFixed(2));

// For each boundary: raw decay F1, attribution factors F2/F3/F4, widening, and ratio = F1/widening.
const SWEEP = K_ENDS.map((kEnd) => {
  const TAIL = rung(kEnd);
  const F1 = HEAD.E_flow / TAIL.E_flow; // raw (log N)^3/N head-to-tail decay
  const F2 = TAIL.E_N / HEAD.E_N; // normaliser collapse
  const F3 = HEAD.sflow / TAIL.sflow; // E_flow log-slope ratio
  const F4 = TAIL.resid / HEAD.resid; // imp-33773 residual ratio
  const widening = TAIL.roe / HEAD.roe; // = F1*F2*F3*F4 (exact identity)
  const attenuation = F2 * F3 * F4;
  const ratio = F1 / widening; // = 1/attenuation (the ~19.9x over-prediction)
  const identityRel = Math.abs(ratio - 1 / attenuation) / (1 / attenuation);
  return {
    kEnd,
    F1: +F1.toExponential(6),
    F2: +F2.toExponential(6),
    F3: +F3.toFixed(6),
    F4: +F4.toFixed(6),
    widening: +widening.toFixed(4),
    attenuation: +attenuation.toExponential(6),
    ratio: +ratio.toFixed(5),
    identityRel: +identityRel.toExponential(3),
  };
});

const FIRST = SWEEP[0]; // kEnd=11 anchor (imp-33922)
const LAST = SWEEP[SWEEP.length - 1]; // kEnd=13

// R1: identity F1/widening == 1/(F2*F3*F4) holds to machine precision at every window.
const MAX_IDENTITY_REL = Math.max(...SWEEP.map((r) => r.identityRel));

// R2: is the ratio window-invariant, or does it drift?
const RATIO_MONOTONIC_UP = SWEEP.every((r, i) => i === 0 || r.ratio > SWEEP[i - 1].ratio);
const RATIO_DRIFT_FACTOR = +(LAST.ratio / FIRST.ratio).toFixed(4); // ~8.30 (NOT ~1 -> not invariant)
const F1_DRIFT_FACTOR = +(LAST.F1 / FIRST.F1).toFixed(3); // ~61.3
const WIDENING_DRIFT_FACTOR = +(LAST.widening / FIRST.widening).toFixed(3); // ~7.39

// R3: which attenuation factor drives the drift? Compare per-factor drift and log shares.
const F2_DRIFT_FACTOR = +(LAST.F2 / FIRST.F2).toFixed(5); // ~0.946 (nearly flat)
const F3_DRIFT_FACTOR = +(LAST.F3 / FIRST.F3).toFixed(5); // ~0.982 (nearly flat)
const F4_DRIFT_FACTOR = +(LAST.F4 / FIRST.F4).toFixed(5); // ~0.130 (collapses -- the driver)
const D_LN_ATTEN = Math.log(LAST.attenuation) - Math.log(FIRST.attenuation); // < 0
const F2_DRIFT_LOG_SHARE = +((Math.log(LAST.F2) - Math.log(FIRST.F2)) / D_LN_ATTEN).toFixed(4); // ~0.026
const F3_DRIFT_LOG_SHARE = +((Math.log(LAST.F3) - Math.log(FIRST.F3)) / D_LN_ATTEN).toFixed(4); // ~0.009
const F4_DRIFT_LOG_SHARE = +((Math.log(LAST.F4) - Math.log(FIRST.F4)) / D_LN_ATTEN).toFixed(4); // ~0.965

export const IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP = {
  id: 'imp-33969',
  proofSection: 'S-frontier',
  question:
    'imp-33922 measured F1/widening = 19.913 (the raw (log N)^3/N decay F1 over-predicts the empirical ' +
    'widening by ~19.9x) ONLY at the fixed imp-33884 boundary kEnd=11; imp-33917 showed the endpoint ' +
    'feature of the same ladder is boundary-locked and grows as kEnd recedes, which shifts the ' +
    'widening = roe(kEnd)/roe(6). Recompute F1 and the attenuation F2*F3*F4 at each kEnd = 11..13 (the ' +
    'same 9 windows) and tabulate F1/widening: is the ~19.9x window-invariant, or does it drift, and ' +
    'which factor drives any drift? Accuracy/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'Over kEnd = 11.00 .. 13.00 step 0.25 (9 windows, head fixed at k=6): the raw decay F1 = ' +
    'E_flow(6)/E_flow(kEnd), the attribution factors F2 = E_N(kEnd)/E_N(6), F3 = sflow(6)/sflow(kEnd), ' +
    'F4 = resid(kEnd)/resid(6), the widening = roe(kEnd)/roe(6) = F1*F2*F3*F4, and the over-prediction ' +
    'ratio F1/widening = 1/(F2*F3*F4), with per-factor drift and log shares across the sweep',
  sweep: SWEEP, // {kEnd, F1, F2, F3, F4, widening, attenuation, ratio, identityRel} x 9
  anchor: {
    kEnd: FIRST.kEnd, // 11
    ratio: FIRST.ratio, // 19.91301 (recovers imp-33922)
    attenuation: FIRST.attenuation, // ~5.0218e-2
    widening: FIRST.widening, // 903.5379
  },
  endpoint: {
    kEnd: LAST.kEnd, // 13
    ratio: LAST.ratio, // 165.35120
    attenuation: LAST.attenuation, // ~6.0477e-3
    widening: LAST.widening, // 6672.615
  },
  identity: {
    form: 'F1/widening = 1/(F2*F3*F4) exactly (widening = F1*F2*F3*F4)',
    max_relative_residual: +MAX_IDENTITY_REL.toExponential(3), // ~1e-15 machine floor
  },
  windowInvariance: {
    ratio_is_window_invariant: false,
    ratio_monotonic_increasing: RATIO_MONOTONIC_UP,
    ratio_drift_factor: RATIO_DRIFT_FACTOR, // ~8.30 (NOT ~1)
    F1_drift_factor: F1_DRIFT_FACTOR, // ~61.3
    widening_drift_factor: WIDENING_DRIFT_FACTOR, // ~7.39
  },
  driftAttribution: {
    F2_drift_factor: F2_DRIFT_FACTOR, // ~0.946 (nearly flat)
    F3_drift_factor: F3_DRIFT_FACTOR, // ~0.982 (nearly flat)
    F4_drift_factor: F4_DRIFT_FACTOR, // ~0.130 (collapses -- the driver)
    F2_drift_log_share: F2_DRIFT_LOG_SHARE, // ~0.026
    F3_drift_log_share: F3_DRIFT_LOG_SHARE, // ~0.009
    F4_drift_log_share: F4_DRIFT_LOG_SHARE, // ~0.965 (F4 dominates the drift)
    driver: 'F4 (imp-33773 M2 residual ratio)',
  },
  finding: {
    R1_ratio_is_inverse_attenuation_per_window:
      'At every one of the 9 boundaries F1/widening = 1/(F2*F3*F4) to rel ~1e-15: the raw decay F1 ' +
      'cancels exactly, so the over-prediction factor is a pure attribution-attenuation quantity. At ' +
      'the anchor kEnd=11 it recovers the imp-33922 value 19.913 (= 1/0.05022).',
    R2_ratio_not_window_invariant_drifts_up:
      'The ~19.9x is NOT window-invariant. As the fit boundary recedes 11.00 -> 13.00 the ' +
      'over-prediction factor rises MONOTONICALLY from 19.913 to 165.351, a factor of ~8.30. The raw ' +
      'decay F1 (x61) outruns the widening (x7.4), so the raw (log N)^3/N decay over-predicts WORSE as ' +
      'the window extends -- the ~19.9x anchor value is a lower bound, not a stable constant.',
    R3_drift_driven_by_F4_not_normaliser_F2:
      'Of the three attenuation factors only F4 moves materially: F4 collapses 0.87432 -> 0.11339 ' +
      '(x0.130) while F2 (x0.946) and F3 (x0.982) are nearly flat; F4 supplies ~96.5% of the ' +
      'ln(attenuation) drift vs F2 ~2.6% and F3 ~0.9%. This REORDERS imp-33922: the normaliser F2 ' +
      'dominates the attenuation LEVEL at the anchor but the imp-33773 residual ratio F4 dominates its ' +
      'DRIFT as the boundary recedes -- the level-dominant and drift-dominant factors differ.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / WINDOW-STABILITY CROSS-CHECK (frontier-direction, NOT rigorous). Recomputing the raw ' +
    'decay F1 and the attribution attenuation F2*F3*F4 across the imp-33917 boundary sweep kEnd = ' +
    '11..13 (9 windows, identical inherited imp-3406/imp-33810 sub-terms) shows the imp-33922 ' +
    'over-prediction ratio F1/widening is EXACTLY the inverse attenuation 1/(F2*F3*F4) per window (rel ' +
    '~1e-15) and is NOT window-invariant: it drifts MONOTONICALLY upward from 19.913 (kEnd=11, ' +
    'recovering imp-33922) to 165.351 (kEnd=13), a factor of ~8.30, because the raw decay F1 (x61) ' +
    'outruns the widening (x7.4). So the raw (log N)^3/N decay over-predicts the widening WORSE as the ' +
    'fit boundary recedes -- the ~19.9x anchor value is a lower bound, not a stable constant. The drift ' +
    'is driven ~96.5% (log scale) by the imp-33773 M2 residual ratio F4, which collapses x0.130, NOT ' +
    'by the normaliser F2 (x0.946) or slope F3 (x0.982), which are nearly flat -- REORDERING the ' +
    'imp-33922 attribution, in which F2 dominates the attenuation LEVEL at the anchor. The ' +
    'level-dominant (F2) and drift-dominant (F4) factors are different; the F4 collapse is the same ' +
    'receding-boundary residual feature the imp-33917 endpoint peak tracks. The inherited ' +
    'imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the OLS sub-terms are descriptive ' +
    'within the model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33922 (the fixed-kEnd=11 ~19.9x F1/widening over-prediction anchored here); imp-33917 (the ' +
    '9-window kEnd = 11..13 boundary sweep reused); imp-33884 (the exact widening + F1..F4 factor ' +
    'decomposition); imp-33810 (the 21 quarter-decade rungs); imp-33773 (the M2 residual defining F4); ' +
    'imp-28895 (the four-factor decomposition); lambda-rh-height-mapping (RvM height law); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP_ASSERTIONS = [
  {
    // (R1) F1/widening = 1/(F2*F3*F4) to machine precision at every window; anchor recovers imp-33922.
    id: 'imp33969-ratio-is-inverse-attenuation-per-window',
    description: 'F1/widening == 1/(F2*F3*F4) to rel < 1e-9 for all 9 windows; anchor kEnd=11 ratio ~19.913',
    holds: () =>
      SWEEP.length === 9 &&
      MAX_IDENTITY_REL < 1e-9 &&
      Math.abs(FIRST.kEnd - 11) < 1e-9 &&
      Math.abs(FIRST.ratio - 19.913) < 1e-2,
  },
  {
    // (R2) The ratio is NOT window-invariant: strictly increasing, ~8.3x total drift, endpoint ~165.35.
    id: 'imp33969-ratio-not-window-invariant-drifts-up',
    description: 'ratio strictly increases 11..13 (19.913 -> ~165.35), drift factor ~8.30 (>> 1)',
    holds: () =>
      RATIO_MONOTONIC_UP === true &&
      IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP.windowInvariance.ratio_is_window_invariant === false &&
      Math.abs(LAST.ratio - 165.351) < 0.5 &&
      RATIO_DRIFT_FACTOR > 8 &&
      RATIO_DRIFT_FACTOR < 8.6,
  },
  {
    // (R3) The drift is driven by F4 (residual ratio), not F2/F3: F4 collapses, F2/F3 nearly flat.
    id: 'imp33969-drift-driven-by-residual-ratio-F4',
    description: 'F4 drift x0.130 (log share > 0.9), F2 (x0.946) and F3 (x0.982) nearly flat (log share < 0.1)',
    holds: () =>
      F4_DRIFT_FACTOR < 0.2 &&
      F2_DRIFT_FACTOR > 0.9 &&
      F3_DRIFT_FACTOR > 0.9 &&
      F4_DRIFT_LOG_SHARE > 0.9 &&
      F2_DRIFT_LOG_SHARE < 0.1 &&
      F3_DRIFT_LOG_SHARE < 0.1,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp33969-honesty-gate-no-qed',
    description: 'Window-stability cross-check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP.isRigorous === false &&
      /NO QED/.test(IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP.verdict),
  },
];

for (const a of IMP33969_EFLOW_DECAY_WIDENING_RATIO_KEND_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33969-eflow-decay-widening-ratio-kend-sweep assertion failed: ${a.id}`);
  }
}
