/**
 * @module imp-34172-deep-ladder-second-path-crossvalidation
 *
 * imp-34172 (accuracy): CROSS-VALIDATE the imp-34106 DEEP doubling-map ladder (e = 16 .. 20,
 * steps 1/65536 .. 1/2^20) from an INDEPENDENT second code path, mirroring the imp-34107
 * cross-validation of the SHALLOW e = 7 .. 15 ladder. imp-34107 recomputed the imp-34044 shallow
 * dyadic-ladder resid_exp(k) argmax gaps and doubling-map phases from a from-source second path
 * (independently assembled energy channels, index-enumerated argmax) and confirmed the shallow
 * schedule path-independent. But imp-34106 extended the ladder FIVE rungs deeper (e = 16 .. 20)
 * through a SINGLE code path (its own parts()/olsSigmaExponent()/ecollExponentMag() helpers) and
 * never had its deep-rung argmax gaps, doubling-map phases, or the headline 1/524288 (e = 19)
 * frozen-gap departure independently reproduced. This module carries the imp-34107 from-source
 * second path (no shared imp-34106 helpers) onto the deep ladder e = 15 .. 20.
 *
 * THE SECOND PATH (this module -- a from-source reimplementation, no shared imp-34106 helpers)
 * --------------------------------------------------------------------------------------------
 *   resid_exp(k) and its discrete argmax are recomputed from the SAME source primitives
 *   (effectiveHeightForN, C_C_PINNED, the fixed E_trunc strip and the imp-398 C_F Gronwall E_flow)
 *   but through DIFFERENT code:
 *     (a) channels(N) assembles E_trunc / E_flow / E_coll / E_N independently (not imp-34106
 *         parts()), returning fracColl = E_coll / E_N;
 *     (b) p_ecoll is the endpoint log-log slope magnitude of E_coll from channels();
 *     (c) the discrete argmax is re-enumerated over the SAME 6 + j*step grid on an INDEPENDENT
 *         peak-bracketing window [8.72, 8.94] (imp-34106 used [8.6, 9.05]); the resid_exp hump is
 *         unimodal with its single interior maximum at k* ~ 8.821, so the windowed argmax equals the
 *         full-range argmax at every rung, and the strict-> tie-break (lowest k) matches imp-34106.
 *   TWO independent OLS variants for p_sigma are run to probe robustness at the precision floor:
 *     * STABLE variant -- the mean-centred sxy/sxx form (index-enumerated d = dLo + i/per, distinct
 *       from the imp-34106 accumulated d += step loop), the numerically stable estimator;
 *     * RAW-MOMENT variant -- the imp-34107 normal-equations form (m Sxy - Sx Sy)/(m Sxx - Sx^2),
 *       algebraically identical but with a cancelling denominator (m Sxx - Sx^2 ~ 51 from
 *       Sxx*m ~ 11500 minus Sx^2 ~ 11449 over the k ~ 8.82, N ~ 6.6e8 window).
 *   k* ~ 8.821092 is the inherited imp-33878 continuum argmax (a fixed input, reused verbatim).
 *
 * THE FINDING (numerical cross-validation only -- reproduces under STABLE arithmetic; the e=19
 *              departure is a precision-floor tie the raw-moment variant flips)
 * ---------------------------------------------------------------------------------------------
 *   (Y1) THE STABLE SECOND PATH REPRODUCES THE DEEP LADDER BIT-FOR-BIT. The mean-centred-OLS argmax
 *        reproduces the imp-34106 deep ladder EXACTLY at all 6 rungs e = 15 .. 20 (1/32768 .. 1/2^20):
 *        identical dyadic grid points, same tie-break -> the same k at every rung, including the
 *        frozen 8.8210906982 across e = 16 .. 19 and the 8.8210916519 descent at e = 20. Gap
 *        |argmaxK - k*| and phase frac(2^e (k*-6)) match the published stored values. So the deep
 *        ladder -- INCLUDING the e = 19 frozen-gap departure -- is path-independent under stable
 *        arithmetic, not a single-implementation artifact.
 *   (Y2) THE e=19 DEPARTURE IS A PRECISION-FLOOR TIE THE RAW-MOMENT VARIANT FLIPS. At e = 19 the two
 *        contested grid points are separated by a resid_exp margin of just +3.64e-15 (froze wins under
 *        stable arithmetic). The algebraically-equivalent raw-moment OLS injects a ~1.23e-14 p_sigma
 *        perturbation (from its cancelling m Sxx - Sx^2 denominator) -- LARGER than the margin -- which
 *        flips the e = 19 (and e = 20) selection to the DESCENT (8.8210926056, gap 6.056e-7, exactly the
 *        closed-form sawtooth prediction). Through e = 18 the raw-moment argmax still matches (margins
 *        there are far above the ~1e-14 noise); the first raw-vs-stable divergence is precisely e = 19.
 *   (Y3) THIS SHARPENS imp-34106 E3. imp-34106 diagnosed the e = 19 departure as the STORED-k*
 *        precision floor (grid half-step 9.54e-7 crossing the ~4.12e-7 rounding error of the 6-decimal
 *        k*). The second path corroborates and sharpens it: the departure survives an independent
 *        STABLE reimplementation (Y1) yet is so marginal (+3.64e-15) that a numerically-inferior but
 *        equivalent OLS reformulation reverses it (Y2). The stable-path max relative discrepancy across
 *        all 6 deep rungs is below 5e-4 -- the round-off floor of the inherited stored precision.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. A second-code-path reproduction of an inherited surrogate
 * measurement, NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34106-sawtooth-phase-realignment-deep-ladder (the deep e=16..20 ladder cross-validated here)
 * @see imp-34107-resid-exp-second-path-crossvalidation (the shallow e=7..15 second-path check mirrored here)
 * @see imp-34168-doubling-map-highprecision-kstar-floor (the higher-precision-k* re-run of the departure)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* ~ 8.821092, reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER } from './imp-34106-sawtooth-phase-realignment-deep-ladder.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const A1_TRAP = 2.37e-4;
const GRONWALL_B = Math.exp(1.0 * A1_TRAP); // matches imp-34106/imp-34044 exactly

// SECOND PATH (a): assemble the three energy channels from source, independently of the imp-34106
// parts() helper. fracColl = E_coll / E_N is the sigma of both modules.
function channels(N) {
  const T0 = effectiveHeightForN(N);
  const logT0 = Math.log(T0);
  const cFlow = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const eFlow = cFlow * (logT0 / T0) * GRONWALL_B;
  const eColl = C_C_PINNED * Math.sqrt(logT0 / N); // GUE-conditional (C_H)
  const eTot = E_TRUNC + eFlow + eColl;
  return { eColl, eTot, fracColl: eColl / eTot };
}

// STABLE p_sigma: mean-centred OLS of ln(fracColl) vs ln N, index-enumerated grid (d = dLo + i/per,
// distinct from the imp-34106 accumulated d += step loop). The numerically stable estimator.
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

// RAW-MOMENT p_sigma: the imp-34107 normal-equations form slope = (m Sxy - Sx Sy)/(m Sxx - Sx^2),
// algebraically identical to pSigmaStable but with a cancelling denominator at the k ~ 8.82 window.
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

// k* is the inherited imp-33878 continuum argmax (fixed input, reused verbatim).
const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar;
const ORIGIN = 6;
const PHASE_B = K_STAR - ORIGIN; // fixed continuum phase (k* - 6) ~ 2.821092

// Discrete argmax of resid_exp over the 6 + j*step grid on an INDEPENDENT peak-bracketing window
// [WIN_LO, WIN_HI] (imp-34106 used [8.6, 9.05]). Same strict-> tie-break (lowest k among ties).
const WIN_LO = 8.72;
const WIN_HI = 8.94;
function argmaxWindowed(exponent, pSigmaFn) {
  const step = 1 / Math.pow(2, exponent);
  const jLo = Math.ceil((WIN_LO - ORIGIN) / step);
  const jHi = Math.floor((WIN_HI - ORIGIN) / step);
  let bestK = ORIGIN + jLo * step;
  let bestV = -Infinity;
  for (let j = jLo; j <= jHi; j++) {
    const kk = +(ORIGIN + j * step).toFixed(10);
    const v = residExp(kk, pSigmaFn);
    if (v > bestV) {
      bestV = v;
      bestK = kk;
    }
  }
  return { k: bestK, step };
}

// The sawtooth closed form (imp-33942 defn): distance from k* to the nearest grid point 6 + j*step.
function sawtoothPredicted(step) {
  const off = PHASE_B / step;
  const frac = off - Math.floor(off);
  return Math.min(frac, 1 - frac) * step;
}

// -- (Y1) The STABLE second path vs the published imp-34106 deep ladder (rungs e = 15 .. 20) --------
const PUB_RUNGS = IMP34106_SAWTOOTH_PHASE_REALIGNMENT_DEEP_LADDER.ladderRungs;

const LADDER = PUB_RUNGS.map((pub) => {
  const e = pub.exponent;
  const a = argmaxWindowed(e, pSigmaStable);
  const argmaxKB = +a.k.toFixed(12);
  const gapB = Math.abs(a.k - K_STAR);
  const scaled = Math.pow(2, e) * PHASE_B;
  const fracB = scaled - Math.floor(scaled);
  const sawB = sawtoothPredicted(a.step);
  const relDevB = gapB > 0 ? Math.abs(sawB - gapB) / gapB : 0;
  return {
    exponent: e,
    step: a.step,
    argmaxK_pathB: argmaxKB,
    argmaxK_published: pub.argmaxK,
    argmaxK_exactMatch: argmaxKB === pub.argmaxK,
    gap_pathB: +gapB.toExponential(4),
    gap_published: pub.gap,
    gap_relDiscrepancy: +(Math.abs(gapB - pub.gap) / Math.abs(pub.gap)).toExponential(3),
    frac_pathB: +fracB.toFixed(6),
    frac_published: pub.frac,
    frac_absDiscrepancy: +Math.abs(fracB - pub.frac).toExponential(3),
    relDeviationFromClosedForm_pathB: +relDevB.toExponential(4),
    relDeviationFromClosedForm_published: pub.relDeviationFromClosedForm,
  };
});

// -- (Y2) The raw-moment variant flips the e = 19 precision-floor tie -------------------------------
const RAW_SELECTION = PUB_RUNGS.map((pub) => {
  const argmaxKRaw = +argmaxWindowed(pub.exponent, pSigmaRawMoments).k.toFixed(12);
  return {
    exponent: pub.exponent,
    argmaxK_raw: argmaxKRaw,
    matchesStable: argmaxKRaw === LADDER.find((r) => r.exponent === pub.exponent).argmaxK_pathB,
  };
});
const FIRST_RAW_DIVERGENCE = (RAW_SELECTION.find((r) => !r.matchesStable) || {}).exponent ?? null;

// The e = 19 selection margin: resid_exp(frozen) - resid_exp(descent) under each OLS variant, at the
// two contested grid points (stable froze at kFroze; raw descends to kDesc = sawtooth-predicted point).
const R19_STABLE = LADDER.find((r) => r.exponent === 19);
const K_FROZE = R19_STABLE.argmaxK_pathB; // 8.8210906982 (stable / imp-34106 selection)
const K_DESC = RAW_SELECTION.find((r) => r.exponent === 19).argmaxK_raw; // 8.8210926056 (raw selection)
const E19_MARGIN_STABLE = residExp(K_FROZE, pSigmaStable) - residExp(K_DESC, pSigmaStable); // ~+3.64e-15 (froze wins)
const E19_MARGIN_RAW = residExp(K_FROZE, pSigmaRawMoments) - residExp(K_DESC, pSigmaRawMoments); // ~-3.53e-14 (desc wins)
// The raw-moment p_sigma perturbation at the peak window -- the cancellation noise that exceeds the margin.
const PEAK_LO = Math.pow(10, K_FROZE);
const PEAK_HI = Math.pow(10, K_FROZE + 1);
const PSIGMA_RAW_PERTURBATION = Math.abs(pSigmaStable(PEAK_LO, PEAK_HI) - pSigmaRawMoments(PEAK_LO, PEAK_HI)); // ~1.23e-14

// -- Aggregate the cross-validation ----------------------------------------------------------------
const ALL_ARGMAX_MATCH = LADDER.every((r) => r.argmaxK_exactMatch);
const MAX_GAP_REL = Math.max(...LADDER.map((r) => r.gap_relDiscrepancy));
const MAX_FRAC_ABS = Math.max(...LADDER.map((r) => r.frac_absDiscrepancy));
const MAX_REL_DISCREPANCY = MAX_GAP_REL;
const CROSSCHECK_TOL = 5e-4; // gap stored toExponential(4) (~5 sig figs); frac toFixed(6)

// (Y1) stable path reproduces the departure: e=19 frozen (relDev>0.5) and e=20 descent (relDev<1e-3).
const R18_STABLE = LADDER.find((r) => r.exponent === 18);
const R20_STABLE = LADDER.find((r) => r.exponent === 20);
const STABLE_REPRODUCES_DEPARTURE =
  R19_STABLE.argmaxK_pathB === R18_STABLE.argmaxK_pathB && // e=19 gap frozen at the e=18 grid point
  R19_STABLE.relDeviationFromClosedForm_pathB > 0.5 &&
  R19_STABLE.relDeviationFromClosedForm_pathB < 0.6 &&
  R20_STABLE.gap_pathB < R19_STABLE.gap_pathB && // e=20 descent: the gap drops (argmaxK re-approaches k*)
  R20_STABLE.relDeviationFromClosedForm_pathB < 1e-3;
// (Y2) raw-moment flips first at e=19, and the margin is below the raw-moment perturbation.
const RAW_FLIPS_AT_FLOOR =
  FIRST_RAW_DIVERGENCE === 19 &&
  E19_MARGIN_STABLE > 0 &&
  E19_MARGIN_RAW < 0 &&
  Math.abs(E19_MARGIN_STABLE) < PSIGMA_RAW_PERTURBATION;

export const IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION = {
  id: 'imp-34172',
  proofSection: 'S-frontier',
  question:
    'imp-34107 cross-validated the imp-34044 SHALLOW dyadic ladder (e=7..15) from a from-source ' +
    'second code path, but imp-34106 extended the ladder five rungs deeper (e=16..20) through a ' +
    'SINGLE code path and never had its deep-rung argmax gaps, doubling-map phases, and 1/524288 ' +
    'departure independently reproduced. Recompute the imp-34106 deep-ladder resid_exp(k) argmax ' +
    'gaps and doubling-map orbit from an independent channels()-based second path (no shared ' +
    'imp-34106 helpers), and MEASURE the max relative discrepancy rung-for-rung, in particular ' +
    'whether the e=19 departure reproduces. Numerical cross-validation only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the max relative discrepancy between a from-source second code path and the published imp-34106 ' +
    'deep doubling-map ladder (6 rungs e=15..20, 1/32768 .. 1/2^20: argmaxK bit-for-bit, gap, ' +
    'doubling-map phase, closed-form relative deviation) under a numerically STABLE OLS, plus the ' +
    'e=19 selection margin and the RAW-MOMENT-OLS perturbation that flips it; k* ~ 8.821092 reused',
  continuumArgmax: K_STAR,
  window: [WIN_LO, WIN_HI], // independent peak-bracketing window (imp-34106 used [8.6, 9.05])
  ladderCrosscheck: LADDER, // stable-path per rung: argmaxK exact-match, gap/frac vs published + discrepancy
  rawMomentSelection: RAW_SELECTION, // per rung: raw-moment argmaxK and whether it matches the stable path
  firstRawDivergenceExponent: FIRST_RAW_DIVERGENCE, // 19 -- raw-moment first disagrees with the stable path here
  e19PrecisionFloor: {
    kFroze: K_FROZE, // 8.8210906982 (stable / imp-34106 selection, gap 1.302e-6)
    kDesc: K_DESC, // 8.8210926056 (raw-moment selection, gap 6.056e-7 = sawtooth prediction)
    marginStable: +E19_MARGIN_STABLE.toExponential(4), // ~+3.64e-15 (froze wins under stable arithmetic)
    marginRaw: +E19_MARGIN_RAW.toExponential(4), // ~-3.53e-14 (descent wins under raw-moment arithmetic)
    pSigmaRawPerturbation: +PSIGMA_RAW_PERTURBATION.toExponential(4), // ~1.23e-14 > |marginStable| -> flips the tie
  },
  crosscheck: {
    all_argmax_exact_match: ALL_ARGMAX_MATCH, // stable path: 6/6 deep dyadic grid points reproduce bit-for-bit
    max_gap_rel_discrepancy: +MAX_GAP_REL.toExponential(3),
    max_frac_abs_discrepancy: +MAX_FRAC_ABS.toExponential(3),
    max_rel_discrepancy: +MAX_REL_DISCREPANCY.toExponential(3),
    tolerance: CROSSCHECK_TOL,
    stable_reproduces_departure: STABLE_REPRODUCES_DEPARTURE,
    raw_flips_e19_at_precision_floor: RAW_FLIPS_AT_FLOOR,
    reproduces: MAX_REL_DISCREPANCY < CROSSCHECK_TOL && ALL_ARGMAX_MATCH && STABLE_REPRODUCES_DEPARTURE,
  },
  finding: {
    Y1_stable_second_path_reproduces_bit_for_bit:
      'The mean-centred-OLS second path reproduces the imp-34106 deep ladder EXACTLY at all 6 rungs ' +
      'e=15..20 (1/32768 .. 1/2^20): identical dyadic grid points, same tie-break, the same k at every ' +
      'rung -- the frozen 8.8210906982 across e=16..19 and the 8.8210916519 descent at e=20 -- with gap ' +
      'and phase matching the published stored values. So the deep ladder, INCLUDING the e=19 ' +
      'frozen-gap departure, is path-independent under stable arithmetic, not an implementation artifact.',
    Y2_e19_is_precision_floor_tie_rawmoment_flips:
      'At e=19 the two contested grid points are separated by a resid_exp margin of only +3.64e-15 ' +
      '(froze wins under stable arithmetic). The algebraically-equivalent raw-moment OLS injects a ' +
      '~1.23e-14 p_sigma perturbation (from its cancelling m Sxx - Sx^2 denominator), LARGER than the ' +
      'margin, flipping the e=19 (and e=20) selection to the DESCENT (8.8210926056, gap 6.056e-7, the ' +
      'closed-form sawtooth value). The first raw-vs-stable divergence is precisely e=19; through e=18 ' +
      'the raw-moment argmax still matches (those margins sit far above the ~1e-14 noise).',
    Y3_sharpens_imp34106_E3_precision_floor:
      'This corroborates and sharpens the imp-34106 E3 diagnosis (the departure as the stored-k* ' +
      'precision floor): the departure SURVIVES an independent stable reimplementation (Y1) yet is so ' +
      'marginal (+3.64e-15) that a numerically-inferior but equivalent OLS reformulation reverses it ' +
      '(Y2). The stable-path max relative discrepancy across all 6 deep rungs is below 5e-4, the ' +
      'round-off floor of the inherited stored precision. Consistent with imp-34168, which pushes the ' +
      'floor past 1/262144 by refining k* to 10 sig figs.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (NOT rigorous). PERFORMS the deep-ladder recomputation imp-34106 never ' +
    'ran, mirroring the imp-34107 shallow-ladder second-path check. A from-source second code path -- ' +
    'independently assembled E_trunc/E_flow/E_coll channels, endpoint log-log slope for p_ecoll, ' +
    'index-enumerated argmax on an independent [8.72, 8.94] peak-bracketing window (imp-34106 used ' +
    '[8.6, 9.05]) -- reproduces the imp-34106 deep doubling-map ladder (6 rungs e=15..20, 1/32768 .. ' +
    '1/2^20) BIT-FOR-BIT under a numerically STABLE mean-centred OLS, argmaxK matching at every rung ' +
    'INCLUDING the e=19 frozen-gap departure and the e=20 descent, max relative discrepancy below 5e-4. ' +
    'So the deep ladder and its 1/524288 departure are path-independent under stable arithmetic. But ' +
    'the e=19 departure is a precision-floor tie: the two contested grid points differ by a resid_exp ' +
    'margin of only +3.64e-15, and the algebraically-equivalent raw-moment normal-equations OLS ' +
    '(m Sxy - Sx Sy)/(m Sxx - Sx^2), whose cancelling denominator injects a ~1.23e-14 p_sigma ' +
    'perturbation LARGER than the margin, FLIPS the e=19 (and e=20) selection to the sawtooth-predicted ' +
    'descent (8.8210926056, gap 6.056e-7); the first raw-vs-stable divergence is precisely e=19. This ' +
    'corroborates and sharpens the imp-34106 E3 stored-k* precision-floor diagnosis: the departure ' +
    'survives an independent stable path yet is marginal enough to reverse under a numerically-inferior ' +
    'equivalent reformulation. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34106 (the deep e=16..20 ladder cross-validated here); imp-34107 (the shallow e=7..15 ' +
    'second-path check mirrored here); imp-34168 (higher-precision-k* re-run of the departure); ' +
    'imp-33878 (source of k* ~ 8.821092, reused verbatim); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION_ASSERTIONS = [
  {
    // (Y1) The stable second path reproduces the imp-34106 deep ladder grid points bit-for-bit.
    id: 'imp34172-stable-path-reproduces-deep-ladder',
    description: 'stable-OLS second-path argmaxK matches the imp-34106 deep ladder exactly at all 6 rungs e=15..20 (1/32768 .. 1/2^20)',
    holds: () => ALL_ARGMAX_MATCH && LADDER.length === 6,
  },
  {
    // (Y1) The stable path reproduces the e=19 frozen-gap departure and the e=20 descent.
    id: 'imp34172-stable-path-reproduces-departure',
    description: 'the stable path reproduces the e=19 (1/524288) frozen-gap departure (rel deviation ~0.535) and the e=20 descent',
    holds: () => STABLE_REPRODUCES_DEPARTURE,
  },
  {
    // (Y2) The raw-moment variant flips the e=19 tie: first divergence at e=19, margin below the perturbation.
    id: 'imp34172-rawmoment-flips-e19-precision-floor',
    description: 'the raw-moment OLS first diverges at e=19 (margin +3.64e-15 < ~1.23e-14 perturbation), flipping the departure to the descent',
    holds: () => RAW_FLIPS_AT_FLOOR,
  },
  {
    // (Y3) The stable-path max relative discrepancy sits at the inherited storage round-off floor.
    id: 'imp34172-max-rel-discrepancy-at-floor',
    description: 'stable-path max relative discrepancy across the deep rungs is below the 5e-4 storage round-off gate and the cross-check reproduces',
    holds: () =>
      IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.crosscheck.reproduces === true &&
      MAX_REL_DISCREPANCY < CROSSCHECK_TOL &&
      MAX_FRAC_ABS < 5e-6,
  },
  {
    // Honesty gate: cross-check only, isRigorous false, PERFORMS the imp-34106 deep-ladder recomputation, no QED, no refereed bound is changed.
    id: 'imp34172-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, PERFORMS the imp-34106 deep-ladder recomputation, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.isRigorous === false &&
      /PERFORMS the deep-ladder recomputation imp-34106/.test(IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /NO QED/.test(IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34172_DEEP_LADDER_SECOND_PATH_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34172-deep-ladder-second-path-crossvalidation assertion failed: ${a.id}`);
  }
}
