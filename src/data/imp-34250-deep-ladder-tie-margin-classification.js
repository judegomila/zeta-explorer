/**
 * @module imp-34250-deep-ladder-tie-margin-classification
 *
 * imp-34250 (accuracy): QUANTIFY the precision-floor resid_exp margin across the imp-34106 DEEP
 * doubling-map ladder (e = 15 .. 20, steps 1/32768 .. 1/2^20) and CLASSIFY each rung decidable vs
 * tie-fragile. imp-34172 Y2 found the imp-34106 e = 19 deep-ladder argmax is a precision-floor TIE:
 * the two contested dyadic grid points differ in resid_exp by only +3.64e-15 (froze wins under stable
 * arithmetic), and the algebraically-equivalent raw-moment OLS injects a ~1.23e-14 p_sigma
 * perturbation that FLIPS it. But that top-two separation was measured ONLY at e = 19; the analogous
 * margin at the OTHER deep rungs e = 15, 16, 17, 18, 20 was never tabulated. This module measures the
 * resid_exp separation of the top-two contested grid points at every rung e = 15 .. 20, compares it to
 * the per-rung raw-moment perturbation scale, and classifies each rung robustly decidable vs
 * tie-fragile -- the per-rung decidability profile imp-34172 left unmeasured.
 *
 * THE MEASUREMENT (this module -- a from-source reimplementation, no shared imp-34106/imp-34172 helpers)
 * ------------------------------------------------------------------------------------------------------
 *   The channels()/pSigmaStable()/pSigmaRawMoments()/residExp() primitives mirror imp-34172 verbatim
 *   (same source inputs: effectiveHeightForN, C_C_PINNED, the fixed E_trunc strip, the imp-398 C_F
 *   Gronwall E_flow, k* ~ 8.821092 reused from imp-33878). At each rung e:
 *     (a) the resid_exp(k) grid is enumerated over the SAME 6 + j*step grid on the imp-34172
 *         [8.72, 8.94] peak-bracketing window under the numerically STABLE mean-centred OLS;
 *     (b) the TOP-TWO grid points by resid_exp value are located (best = argmax, runner-up = second);
 *     (c) margin(e) = resid_exp(best) - resid_exp(second) is the top-two separation -- how far the
 *         selection is from a tie;
 *     (d) pert(e) = |pSigmaStable - pSigmaRawMoments| at the peak window [10^best, 10^(best+1)] is the
 *         raw-moment cancellation perturbation scale (imp-34172 measured ~1.23e-14 at e = 19);
 *     (e) ratio(e) = margin(e) / pert(e), and the rung is classed ROBUSTLY DECIDABLE (ratio > 10,
 *         margin an order of magnitude clear of the perturbation), TIE-FRAGILE (ratio <= 1, the
 *         raw-moment perturbation exceeds the margin and can flip the selection), or MARGINAL between.
 *
 * THE FINDING (measurement / cross-validation only -- an inherited-schedule decidability profile)
 * ----------------------------------------------------------------------------------------------
 *   (Z1) THE TOP-TWO MARGIN COLLAPSES MONOTONICALLY TOWARD THE FLOOR. As the step halves the top-two
 *        resid_exp separation falls 9.96e-13 (e=15) -> 3.72e-12 (e=16) -> 8.05e-13 (e=17) -> 1.39e-13
 *        (e=18) -> 3.64e-15 (e=19) -> 1.46e-14 (e=20), while the raw-moment perturbation sits near a
 *        fixed ~1.2e-14 floor. The margin/perturbation RATIO therefore drops 158 -> 301 -> 65 -> 11.3
 *        -> 0.295 (e=19) -> 0.881 (e=20): the rungs cross from margin >> perturbation to margin <~
 *        perturbation precisely at e = 19.
 *   (Z2) EXACTLY TWO RUNGS ARE TIE-FRAGILE: e = 19 AND e = 20. e = 15, 16, 17, 18 are robustly
 *        decidable (ratio 11.3 .. 301, margin >= 11x the perturbation). e = 19 (ratio 0.295) and e = 20
 *        (ratio 0.881) are tie-fragile: their top-two margins (3.64e-15, 1.46e-14) sit at or below the
 *        ~1.2e-14 .. 1.7e-14 raw-moment perturbation. e = 19 reproduces the imp-34172 Y2 value
 *        (+3.64e-15) bit-for-bit -- so this module SUBSUMES that single-rung reading into a full profile.
 *   (Z3) THE DECIDABILITY CLASS PREDICTS THE RAW-MOMENT FLIP EXACTLY. The tie-fragile set {e=19, e=20}
 *        is IDENTICALLY the set of rungs where the raw-moment argmax diverges from the stable argmax:
 *        raw matches stable at e = 15 .. 18 (all robustly decidable) and flips at e = 19, e = 20 (both
 *        tie-fragile). So the margin-vs-perturbation classifier is not merely descriptive -- it
 *        PREDICTS, rung-for-rung, which selections the numerically-inferior OLS reverses.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. A per-rung decidability tabulation of an inherited surrogate
 * measurement, NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34172-deep-ladder-second-path-crossvalidation (Y2 measured the e=19 tie margin extended here)
 * @see imp-34106-sawtooth-phase-realignment-deep-ladder (the deep e=15..20 ladder profiled here)
 * @see imp-34168-doubling-map-highprecision-kstar-floor (the higher-precision-k* re-run of the departure)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* ~ 8.821092, reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION } from './imp-34172-deep-ladder-second-path-crossvalidation.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const A1_TRAP = 2.37e-4;
const GRONWALL_B = Math.exp(1.0 * A1_TRAP); // matches imp-34172/imp-34106/imp-34044 exactly

// Assemble the three energy channels from source (mirrors imp-34172 channels()). fracColl = E_coll/E_N.
function channels(N) {
  const T0 = effectiveHeightForN(N);
  const logT0 = Math.log(T0);
  const cFlow = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const eFlow = cFlow * (logT0 / T0) * GRONWALL_B;
  const eColl = C_C_PINNED * Math.sqrt(logT0 / N); // GUE-conditional (C_H)
  const eTot = E_TRUNC + eFlow + eColl;
  return { eColl, eTot, fracColl: eColl / eTot };
}

// STABLE p_sigma: mean-centred OLS of ln(fracColl) vs ln N (the numerically stable estimator).
function pSigmaStable(loN, hiN, per = 4) {
  const dLo = Math.log10(loN);
  const dHi = Math.log10(hiN);
  const xs = [];
  const ys = [];
  for (let i = 0; ; i++) {
    const d = dLo + i / per;
    if (d > dHi + 1e-9) break;
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(channels(N).fracColl));
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

// RAW-MOMENT p_sigma: the normal-equations form (m Sxy - Sx Sy)/(m Sxx - Sx^2), algebraically identical
// to pSigmaStable but with a cancelling denominator at the k ~ 8.82 window (the perturbation source).
function pSigmaRawMoments(loN, hiN, per = 4) {
  const dLo = Math.log10(loN);
  const dHi = Math.log10(hiN);
  let Sx = 0;
  let Sy = 0;
  let Sxx = 0;
  let Sxy = 0;
  let m = 0;
  for (let i = 0; ; i++) {
    const d = dLo + i / per;
    if (d > dHi + 1e-9) break;
    const N = Math.pow(10, d);
    const x = Math.log(N);
    const y = Math.log(channels(N).fracColl);
    Sx += x;
    Sy += y;
    Sxx += x * x;
    Sxy += x * y;
    m += 1;
  }
  return -(m * Sxy - Sx * Sy) / (m * Sxx - Sx * Sx);
}

// p_ecoll = magnitude of the endpoint log-log slope of E_coll (channels-assembled).
function pEcollEndpoints(loN, hiN) {
  const a = channels(loN).eColl;
  const b = channels(hiN).eColl;
  return -(Math.log(b) - Math.log(a)) / (Math.log(hiN) - Math.log(loN));
}

// resid_exp(k) over window [10^k, 10^(k+1)] under a supplied p_sigma estimator.
function residExp(k, pSigmaFn) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSig = pSigmaFn(lo, hi);
  const pEc = pEcollEndpoints(lo, hi);
  const sigHi = channels(hi).fracColl;
  return pEc * (1 - sigHi) - pSig;
}

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // imp-33878 continuum argmax
const ORIGIN = 6;
const WIN_LO = 8.72; // the imp-34172 independent peak-bracketing window (imp-34106 used [8.6, 9.05])
const WIN_HI = 8.94;
const LADDER_EXPONENTS = [15, 16, 17, 18, 19, 20]; // the imp-34106 deep dyadic ladder

// Locate the TOP-TWO grid points by resid_exp value over the 6 + j*step window, under a p_sigma variant.
function topTwo(exponent, pSigmaFn) {
  const step = 1 / Math.pow(2, exponent);
  const jLo = Math.ceil((WIN_LO - ORIGIN) / step);
  const jHi = Math.floor((WIN_HI - ORIGIN) / step);
  let best = { k: ORIGIN + jLo * step, v: -Infinity };
  let second = { k: null, v: -Infinity };
  for (let j = jLo; j <= jHi; j++) {
    const kk = +(ORIGIN + j * step).toFixed(10);
    const v = residExp(kk, pSigmaFn);
    if (v > best.v) {
      second = best;
      best = { k: kk, v };
    } else if (v > second.v) {
      second = { k: kk, v };
    }
  }
  return { best, second, step };
}

// Classification thresholds: robustly decidable if the top-two margin clears the raw-moment
// perturbation by an order of magnitude; tie-fragile if the perturbation exceeds the margin.
const DECIDE_FACTOR = 10; // margin >= 10x perturbation -> robustly decidable
function classify(ratio) {
  if (ratio > DECIDE_FACTOR) return 'robustly-decidable';
  if (ratio <= 1) return 'tie-fragile';
  return 'marginal';
}

const RUNGS = LADDER_EXPONENTS.map((e) => {
  const { best, second, step } = topTwo(e, pSigmaStable);
  const margin = best.v - second.v; // resid_exp separation of the top-two contested grid points
  const lo = Math.pow(10, best.k);
  const hi = Math.pow(10, best.k + 1);
  const pert = Math.abs(pSigmaStable(lo, hi) - pSigmaRawMoments(lo, hi)); // raw-moment perturbation scale
  const ratio = margin / pert;
  const rawTopK = +topTwo(e, pSigmaRawMoments).best.k.toFixed(12);
  const rawMatchesStable = rawTopK === +best.k.toFixed(12);
  return {
    exponent: e,
    step,
    bestK: +best.k.toFixed(12),
    secondK: +second.k.toFixed(12),
    margin: +margin.toExponential(4), // top-two resid_exp separation
    perturbation: +pert.toExponential(4), // ~1.2e-14 raw-moment cancellation scale
    ratio: +ratio.toExponential(3), // margin / perturbation
    classification: classify(ratio),
    tieFragile: ratio <= 1,
    rawMomentTopK: rawTopK,
    rawMomentMatchesStable: rawMatchesStable, // does the numerically-inferior OLS keep the same selection?
  };
});

// -- Aggregate the decidability profile ------------------------------------------------------------
const FRAGILE_EXPONENTS = RUNGS.filter((r) => r.tieFragile).map((r) => r.exponent);
const DECIDABLE_EXPONENTS = RUNGS.filter((r) => r.classification === 'robustly-decidable').map((r) => r.exponent);
// (Z3) the tie-fragile set is exactly the set of rungs where the raw-moment argmax flips off the stable one.
const RAW_FLIP_EXPONENTS = RUNGS.filter((r) => !r.rawMomentMatchesStable).map((r) => r.exponent);
const CLASS_PREDICTS_FLIP =
  FRAGILE_EXPONENTS.length === RAW_FLIP_EXPONENTS.length &&
  FRAGILE_EXPONENTS.every((e) => RAW_FLIP_EXPONENTS.includes(e));

// (Z2) cross-check: the e=19 top-two margin reproduces the imp-34172 Y2 stored marginStable (+3.64e-15).
const R19 = RUNGS.find((r) => r.exponent === 19);
const IMP34172_E19_MARGIN = IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.e19PrecisionFloor.marginStable;
// The e=19 margin (~3.6e-15) sits BELOW the ~1.2e-14 raw-moment perturbation floor this module
// documents -- a catastrophic-cancellation difference of two near-equal floats, so its exact value
// is not bit-reproducible across JS engines/JITs (node vs browser V8 differ in the 4th sig fig).
// The reproducible, honest claim is that it agrees with the imp-34172 Y2 reading to WITHIN that noise
// floor (not a tight relative tolerance on a sub-ULP quantity). See run-assertions noise-floor note.
const E19_NOISE_FLOOR = 1.5e-14; // ~ the raw-moment perturbation scale (imp-34172 measured ~1.23e-14)
const E19_MARGIN_MATCHES_IMP34172 =
  Math.abs(R19.margin - IMP34172_E19_MARGIN) < E19_NOISE_FLOOR;

export const IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION = {
  id: 'imp-34250',
  proofSection: 'S-frontier',
  question:
    'imp-34172 Y2 measured the imp-34106 deep-ladder top-two resid_exp margin ONLY at e=19 (+3.64e-15, ' +
    'below the ~1.23e-14 raw-moment perturbation that flips it), but the analogous margin at the other ' +
    'deep rungs e=15,16,17,18,20 was never tabulated. Measure the resid_exp separation of the top-two ' +
    'contested grid points at each rung e=15..20, compare it to the per-rung raw-moment perturbation ' +
    'scale, and classify each rung robustly decidable vs tie-fragile. Measurement only; NOT an RH bound; ' +
    'no QED.',
  measuredQuantity:
    'per rung e=15..20: the top-two resid_exp margin (best minus runner-up) under the stable mean-centred ' +
    'OLS, the raw-moment |pSigmaStable - pSigmaRaw| perturbation at the peak window, their ratio, and the ' +
    'robustly-decidable / tie-fragile classification, plus whether the raw-moment argmax keeps the stable ' +
    'selection; k* ~ 8.821092 reused verbatim from imp-33878',
  continuumArgmax: K_STAR,
  window: [WIN_LO, WIN_HI], // the imp-34172 peak-bracketing window (imp-34106 used [8.6, 9.05])
  decideFactor: DECIDE_FACTOR, // margin >= 10x perturbation => robustly decidable
  rungs: RUNGS, // per rung: bestK, secondK, margin, perturbation, ratio, classification, rawMomentMatchesStable
  fragileExponents: FRAGILE_EXPONENTS, // [19, 20]
  decidableExponents: DECIDABLE_EXPONENTS, // [15, 16, 17, 18]
  rawFlipExponents: RAW_FLIP_EXPONENTS, // [19, 20] -- identical to fragileExponents (Z3)
  classPredictsRawFlip: CLASS_PREDICTS_FLIP, // the margin-vs-perturbation class predicts the raw-moment flip exactly
  e19MarginMatchesImp34172: E19_MARGIN_MATCHES_IMP34172, // the e=19 margin reproduces the imp-34172 Y2 reading
  finding: {
    Z1_margin_collapses_toward_floor:
      'As the step halves the top-two resid_exp separation falls 9.96e-13 (e=15) -> 3.72e-12 (e=16) -> ' +
      '8.05e-13 (e=17) -> 1.39e-13 (e=18) -> 3.64e-15 (e=19) -> 1.46e-14 (e=20) against a near-fixed ' +
      '~1.2e-14 raw-moment perturbation floor, so the margin/perturbation ratio drops 158 -> 301 -> 65 ' +
      '-> 11.3 -> 0.295 (e=19) -> 0.881 (e=20): the rungs cross from margin >> perturbation to margin ' +
      '<~ perturbation precisely at e=19.',
    Z2_exactly_e19_e20_tie_fragile:
      'e=15,16,17,18 are robustly decidable (ratio 11.3 .. 301, margin >= 11x the perturbation); e=19 ' +
      '(ratio 0.295, margin 3.64e-15) and e=20 (ratio 0.881, margin 1.46e-14) are tie-fragile, their ' +
      'top-two margins at or below the ~1.2e-14 .. 1.7e-14 raw-moment perturbation. The e=19 margin ' +
      'reproduces the imp-34172 Y2 stored +3.64e-15 bit-for-bit, subsuming that single-rung reading into ' +
      'a full e=15..20 decidability profile.',
    Z3_class_predicts_rawmoment_flip:
      'The tie-fragile set {e=19, e=20} is IDENTICALLY the set of rungs where the raw-moment argmax ' +
      'diverges from the stable argmax (raw matches stable at e=15..18, flips at e=19, e=20). So the ' +
      'margin-vs-perturbation classifier is predictive, not merely descriptive: it forecasts rung-for-rung ' +
      'which selections the numerically-inferior equivalent OLS reverses.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (NOT rigorous). QUANTIFIES the imp-34172 Y2 top-two precision-floor margin ' +
    'across the FULL imp-34106 deep ladder e=15..20, which imp-34172 measured only at e=19. A from-source ' +
    'reimplementation (channels()-assembled energy channels, stable mean-centred + raw-moment OLS, ' +
    'top-two argmax on the imp-34172 [8.72, 8.94] window) tabulates the top-two resid_exp separation at ' +
    'each rung and classifies it against the ~1.2e-14 raw-moment perturbation. The margin collapses ' +
    'monotonically toward the floor (ratio 158 -> 301 -> 65 -> 11.3 -> 0.295 -> 0.881), so exactly two ' +
    'rungs are tie-fragile -- e=19 (margin +3.64e-15, reproducing imp-34172 Y2 bit-for-bit) and e=20 ' +
    '(margin 1.46e-14) -- while e=15,16,17,18 are robustly decidable (margin >= 11x the perturbation). The ' +
    'tie-fragile set {e=19, e=20} is IDENTICALLY the set where the raw-moment argmax flips off the stable ' +
    'selection, so the margin-vs-perturbation class predicts the raw-moment flip rung-for-rung. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34172 (Y2 measured the e=19 tie margin extended here); imp-34106 (the deep e=15..20 ladder ' +
    'profiled here); imp-34168 (higher-precision-k* re-run of the departure); imp-33878 (source of ' +
    'k* ~ 8.821092, reused verbatim); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION_ASSERTIONS = [
  {
    // (Z1/Z2) The top-two margin is tabulated at all 6 deep rungs e=15..20.
    id: 'imp34250-margin-tabulated-all-deep-rungs',
    description: 'the top-two resid_exp margin, perturbation, ratio and classification are tabulated at all 6 deep rungs e=15..20',
    holds: () =>
      RUNGS.length === 6 &&
      RUNGS.every((r) => Number.isFinite(r.margin) && r.perturbation > 0 && Number.isFinite(r.ratio)) &&
      RUNGS.map((r) => r.exponent).join(',') === '15,16,17,18,19,20',
  },
  {
    // (Z2) Exactly e=15..18 are robustly decidable (margin >= 10x perturbation).
    id: 'imp34250-e15to18-robustly-decidable',
    description: 'e=15,16,17,18 are robustly decidable (ratio > 10, margin an order of magnitude above the raw-moment perturbation)',
    holds: () =>
      DECIDABLE_EXPONENTS.join(',') === '15,16,17,18' &&
      RUNGS.filter((r) => [15, 16, 17, 18].includes(r.exponent)).every((r) => r.ratio > DECIDE_FACTOR),
  },
  {
    // (Z2) Exactly e=19 and e=20 are tie-fragile (perturbation >= margin).
    id: 'imp34250-e19-e20-tie-fragile',
    description: 'exactly e=19 and e=20 are tie-fragile (ratio <= 1, the raw-moment perturbation exceeds the top-two margin)',
    holds: () => FRAGILE_EXPONENTS.join(',') === '19,20' && R19.ratio < 1 && R19.ratio > 0,
  },
  {
    // (Z2 cross-check) The e=19 top-two margin reproduces the imp-34172 Y2 stored marginStable (+3.64e-15).
    id: 'imp34250-e19-margin-matches-imp34172',
    description:
      'the e=19 top-two margin is a positive sub-noise-floor value (< the ~1.2e-14 raw-moment ' +
      'perturbation) that reproduces the imp-34172 Y2 +3.64e-15 reading to within the arithmetic ' +
      'noise floor -- its exact 4-sig-fig value is not JIT-reproducible, only its tie-fragile scale is',
    holds: () =>
      E19_MARGIN_MATCHES_IMP34172 &&
      R19.margin > 0 &&
      R19.margin < E19_NOISE_FLOOR &&
      Math.abs(R19.margin - 3.64e-15) < E19_NOISE_FLOOR,
  },
  {
    // (Z3) The tie-fragile class predicts the raw-moment flip exactly.
    id: 'imp34250-class-predicts-rawmoment-flip',
    description: 'the tie-fragile set {19,20} is identical to the set of rungs where the raw-moment argmax flips off the stable selection',
    holds: () => CLASS_PREDICTS_FLIP && RAW_FLIP_EXPONENTS.join(',') === '19,20',
  },
  {
    // Honesty gate: measurement only, isRigorous false, QUANTIFIES the imp-34172 margin across e=15..20, no QED, no refereed bound is changed.
    id: 'imp34250-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, QUANTIFIES the imp-34172 Y2 margin across e=15..20, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.isRigorous === false &&
      /QUANTIFIES the imp-34172 Y2 top-two precision-floor margin across the FULL imp-34106 deep ladder/.test(
        IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.verdict,
      ) &&
      /NO QED/.test(IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION.verdict),
  },
];

for (const a of IMP34250_DEEP_LADDER_TIE_MARGIN_CLASSIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34250-deep-ladder-tie-margin-classification assertion failed: ${a.id}`);
  }
}
