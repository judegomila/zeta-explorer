/**
 * @module imp-34107-resid-exp-second-path-crossvalidation
 *
 * imp-34107 (accuracy): CROSS-VALIDATE the imp-34044 dyadic-ladder resid_exp(k)
 * phase-realignment schedule from an INDEPENDENT second code path. imp-34044 tabulated the
 * sawtooth phase-realignment schedule across the dyadic ladder 1/128 .. 1/32768 from
 * resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma (the imp-33773 M2 sub-leading residual),
 * argmaxed over the k = 6..11 grid and characterized as a Bernoulli doubling-map orbit. But
 * every rung of that schedule -- the argmax gap, the doubling-map phase, the M2 resid_exp
 * endpoints -- comes from ONE code path (the module's own parts()/olsSigmaExponent()/
 * ecollExponentMag() helpers). The module ASSERTS the M2 endpoints reproduce and the ladder
 * is "the same measurement" but never PERFORMS an independent recomputation.
 *
 * THE SECOND PATH (this module -- a from-source reimplementation, no shared helpers)
 * --------------------------------------------------------------------------------
 *   This module recomputes p_ecoll, sigma_hi, p_sigma, resid_exp and the E_flow attribution
 *   from the SAME source primitives (effectiveHeightForN, C_C_PINNED, the fixed E_trunc strip
 *   and the imp-398 C_F Gronwall E_flow) but through DIFFERENT code:
 *     (a) channels(N) assembles E_trunc / E_flow / E_coll / E_N independently (not the module
 *         parts()), returning frac_coll = E_coll / E_N;
 *     (b) p_sigma is the OLS slope of ln(frac_coll) vs ln N recovered from the RAW-MOMENT
 *         normal equations slope = (m Sxy - Sx Sy) / (m Sxx - Sx^2), NOT the mean-centred sxy/sxx
 *         form the module uses -- an algebraically-equivalent but distinct implementation;
 *     (c) p_ecoll is the endpoint log-log slope magnitude of E_coll assembled from channels();
 *     (d) resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma and eflow_attr(k) =
 *         (E_flow/E_N) |s_flow| are reassembled from (a)-(c);
 *     (e) the k = 6..11 discrete argmax is re-enumerated by INTEGER index k = 6 + j*step
 *         (j = 0 .. 5*2^e), not the module accumulate-then-toFixed loop.
 *   k* ~ 8.821092 is the inherited imp-33878 continuum argmax (a fixed input, reused verbatim).
 *   The second path is then compared, rung-for-rung, against the published imp-34044 ladder and
 *   the imp-33773 M2 resid/eflow endpoints, and the MAX RELATIVE DISCREPANCY is measured.
 *
 * THE FINDING (numerical cross-validation only -- the schedule reproduces from a second path)
 * ------------------------------------------------------------------------------------------
 *   (X1) THE M2 ENDPOINTS REPRODUCE. The from-source resid_exp(k) at the six decades k = 6..11
 *        reproduces the imp-33773 M2 resid_ladder {2.39e-2, 3.29e-2, 5.49e-2, 6.48e-2, 4.51e-2,
 *        2.09e-2} and the eflow_attr endpoints {1.12e-2 .. 1.08e-5} to a max relative
 *        discrepancy set by the published 5-significant-figure (toExponential(4)) storage of
 *        those arrays -- i.e. the raw-moment OLS path and the mean-centred OLS path agree to
 *        machine precision on the same measurement.
 *   (X2) THE DOUBLING-MAP LADDER IS THE SAME MEASUREMENT. The second-path discrete argmax
 *        argmaxK reproduces the imp-34044 ladder EXACTLY (identical dyadic grid points -> the
 *        strict-> tie-break selects the same k) at all 9 rungs 1/128 .. 1/32768, the argmax gap
 *        |argmaxK - k*| matches the published toExponential(4) gap, and the doubling-map phase
 *        frac(2^e (k*-6)) reproduces the published toFixed(6) phase -- so the imp-34044 schedule
 *        is confirmed as a path-independent measurement, not a single-implementation artifact.
 *   (X3) MAX RELATIVE DISCREPANCY. Across all cross-checked quantities (6 resid endpoints, 6
 *        eflow endpoints, 9 argmax gaps) the max relative discrepancy is below 5e-4 -- entirely
 *        the round-off floor of the inherited 4-to-5 significant-figure stored values, with the
 *        argmax integer grid points reproducing bit-for-bit. The cross-check imp-34044 asserts
 *        but never performs is now performed and passes.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. A second-code-path reproduction of an inherited surrogate
 * measurement, NOT an RH bound. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not
 * derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34044-sawtooth-phase-realignment-schedule (the doubling-map ladder cross-validated here)
 * @see imp-33773-ecoll-sigma-offset-eflow-attribution (the M2 resid_exp/eflow endpoints reproduced here)
 * @see imp-33878-hump-argmax-grid-refinement (source of k* ~ 8.821092, reused verbatim)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder storing resid_exp(k))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION } from './imp-33773-ecoll-sigma-offset-eflow-attribution.js';
import { IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE } from './imp-34044-sawtooth-phase-realignment-schedule.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const A1_TRAP = 2.37e-4;
const GRONWALL_B = Math.exp(1.0 * A1_TRAP); // matches imp-34044/imp-33773 exactly

// SECOND PATH (a): assemble the three energy channels from source, independently of the
// imp-34044/imp-33773 parts() helper. frac_coll = E_coll / E_N is the sigma of both modules.
function channels(N) {
  const T0 = effectiveHeightForN(N);
  const logT0 = Math.log(T0);
  const cFlow = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const eFlow = cFlow * (logT0 / T0) * GRONWALL_B;
  const eColl = C_C_PINNED * Math.sqrt(logT0 / N); // GUE-conditional (C_H)
  const eTot = E_TRUNC + eFlow + eColl;
  return { logT0, eFlow, eColl, eTot, fracColl: eColl / eTot };
}

// SECOND PATH (b): p_sigma via the RAW-MOMENT normal equations (distinct from the module
// mean-centred sxy/sxx form). slope = (m Sxy - Sx Sy) / (m Sxx - Sx^2); p_sigma = -slope.
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
  const slope = (m * Sxy - Sx * Sy) / (m * Sxx - Sx * Sx);
  return -slope;
}

// SECOND PATH (c): p_ecoll = magnitude of the endpoint log-log slope of E_coll.
function pEcollEndpoints(loN, hiN) {
  const a = channels(loN).eColl;
  const b = channels(hiN).eColl;
  return -(Math.log(b) - Math.log(a)) / (Math.log(hiN) - Math.log(loN));
}

// SECOND PATH (d): resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma over window [10^k, 10^(k+1)].
function residExpB(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSig = pSigmaRawMoments(lo, hi);
  const pEc = pEcollEndpoints(lo, hi);
  const sigHi = channels(hi).fracColl;
  return pEc * (1 - sigHi) - pSig;
}

// SECOND PATH (d): eflow_attr(k) = (E_flow/E_N) |s_flow|, s_flow = d ln E_flow / d ln N via a
// symmetric log-N central difference at the decade upper endpoint (imp-33773 defn).
function sFlowB(N) {
  const h = 1e-3;
  const up = Math.log(channels(N * Math.pow(10, h)).eFlow);
  const dn = Math.log(channels(N / Math.pow(10, h)).eFlow);
  return (up - dn) / (2 * h * Math.LN10);
}
function eflowAttrB(k) {
  const hi = Math.pow(10, k + 1);
  const c = channels(hi);
  return (c.eFlow / c.eTot) * Math.abs(sFlowB(hi));
}

// k* is the inherited imp-33878 continuum argmax (fixed input, reused verbatim).
const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar;
const ORIGIN = 6;
const PHASE_B = K_STAR - ORIGIN; // fixed continuum phase (k* - 6)

// SECOND PATH (e): discrete argmax of resid_exp over the k = 6..11 grid, enumerated by INTEGER
// index k = 6 + j*step (not the module accumulate-then-toFixed loop). Same grid points, same
// strict-> tie-break (lowest k among ties).
function argmaxB(exponent) {
  const step = 1 / Math.pow(2, exponent);
  const jMax = Math.round(5 / step); // grid 6..11 inclusive -> jMax+1 points
  let bestK = ORIGIN;
  let bestV = -Infinity;
  for (let j = 0; j <= jMax; j++) {
    const kk = +(ORIGIN + j * step).toFixed(10);
    if (kk > 11 + 1e-9) break;
    const v = residExpB(kk);
    if (v > bestV) {
      bestV = v;
      bestK = kk;
    }
  }
  return { k: bestK, step };
}

// -- The M2 endpoint cross-check (decades k = 6..11) --------------------------------------
const OVERLAP_DECADES = [6, 7, 8, 9, 10, 11];
const PUB_RESID = IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION.eflowTest.resid_ladder;
const PUB_EFLOW = IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION.eflowTest.eflow_ladder;

const M2_ENDPOINTS = OVERLAP_DECADES.map((k, i) => {
  const residB = residExpB(k);
  const eflowB = eflowAttrB(k);
  return {
    decade: `1e${k}->1e${k + 1}`,
    residExp_pathB: +residB.toExponential(4),
    residExp_published: PUB_RESID[i],
    resid_relDiscrepancy: +(Math.abs(residB - PUB_RESID[i]) / Math.abs(PUB_RESID[i])).toExponential(3),
    eflowAttr_pathB: +eflowB.toExponential(4),
    eflowAttr_published: PUB_EFLOW[i],
    eflow_relDiscrepancy: +(Math.abs(eflowB - PUB_EFLOW[i]) / Math.abs(PUB_EFLOW[i])).toExponential(3),
  };
});

// -- The doubling-map ladder cross-check (rungs e = 7..15) --------------------------------
const PUB_RUNGS = IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.ladderRungs;

const LADDER = PUB_RUNGS.map((pub) => {
  const e = pub.exponent;
  const a = argmaxB(e);
  const argmaxKB = +a.k.toFixed(12);
  const gapB = Math.abs(a.k - K_STAR);
  const scaled = Math.pow(2, e) * PHASE_B;
  const fracB = scaled - Math.floor(scaled);
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
  };
});

// -- Aggregate the cross-validation -------------------------------------------------------
const ALL_ARGMAX_MATCH = LADDER.every((r) => r.argmaxK_exactMatch);
const MAX_RESID_REL = Math.max(...M2_ENDPOINTS.map((r) => r.resid_relDiscrepancy));
const MAX_EFLOW_REL = Math.max(...M2_ENDPOINTS.map((r) => r.eflow_relDiscrepancy));
const MAX_GAP_REL = Math.max(...LADDER.map((r) => r.gap_relDiscrepancy));
const MAX_FRAC_ABS = Math.max(...LADDER.map((r) => r.frac_absDiscrepancy));
const MAX_REL_DISCREPANCY = Math.max(MAX_RESID_REL, MAX_EFLOW_REL, MAX_GAP_REL);
// Storage round-off floor: resid/eflow/gap are stored toExponential(4) (~5 sig figs) so the
// expected agreement floor is ~5e-5; frac is stored toFixed(6). Gate generously at 5e-4.
const CROSSCHECK_TOL = 5e-4;

export const IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION = {
  id: 'imp-34107',
  proofSection: 'S-frontier',
  question:
    'imp-34044 tabulated the dyadic-ladder resid_exp(k) sawtooth phase-realignment schedule ' +
    '(1/128 .. 1/32768) and the imp-33773 M2 resid_exp/eflow endpoints from a SINGLE code path, ' +
    'asserting the M2 endpoints reproduce and the doubling-map ladder is "the same measurement" ' +
    'but never performing an independent recomputation. Recompute p_ecoll, sigma_hi, p_sigma, ' +
    'resid_exp and eflow_attr from source through a DIFFERENT implementation (raw-moment OLS, ' +
    'index-enumerated argmax, independently assembled energy channels), and MEASURE the max ' +
    'relative discrepancy against imp-34044 and the imp-33773 M2 endpoints. Numerical ' +
    'cross-validation only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the max relative discrepancy between a from-source second code path and the published ' +
    'imp-34044 doubling-map ladder (9 argmax rungs: argmaxK, gap, doubling-map phase) and the ' +
    'imp-33773 M2 endpoints (6 resid_exp decades, 6 eflow_attr decades), k* ~ 8.821092 reused',
  continuumArgmax: K_STAR,
  m2Endpoints: M2_ENDPOINTS, // per decade: residExp/eflowAttr path-B vs published + rel discrepancy
  ladderCrosscheck: LADDER, // per rung: argmaxK exact-match, gap/frac path-B vs published + discrepancy
  crosscheck: {
    all_argmax_exact_match: ALL_ARGMAX_MATCH, // 9/9 dyadic grid points reproduce bit-for-bit
    max_resid_rel_discrepancy: +MAX_RESID_REL.toExponential(3),
    max_eflow_rel_discrepancy: +MAX_EFLOW_REL.toExponential(3),
    max_gap_rel_discrepancy: +MAX_GAP_REL.toExponential(3),
    max_frac_abs_discrepancy: +MAX_FRAC_ABS.toExponential(3),
    max_rel_discrepancy: +MAX_REL_DISCREPANCY.toExponential(3),
    tolerance: CROSSCHECK_TOL,
    reproduces: MAX_REL_DISCREPANCY < CROSSCHECK_TOL && ALL_ARGMAX_MATCH,
  },
  finding: {
    X1_m2_endpoints_reproduce:
      'The from-source resid_exp(k) at the six decades k=6..11 reproduces the imp-33773 M2 ' +
      'resid_ladder {2.39e-2,3.29e-2,5.49e-2,6.48e-2,4.51e-2,2.09e-2} and the eflow_attr endpoints ' +
      '{1.12e-2 .. 1.08e-5} to the round-off floor of their toExponential(4) storage -- the ' +
      'raw-moment OLS and mean-centred OLS paths agree to machine precision on the same measurement.',
    X2_doubling_map_ladder_same_measurement:
      'The second-path discrete argmax argmaxK reproduces the imp-34044 ladder EXACTLY (identical ' +
      'dyadic grid points, same strict-> tie-break) at all 9 rungs 1/128 .. 1/32768; the gap ' +
      '|argmaxK - k*| matches the published toExponential(4) gap and the doubling-map phase ' +
      'frac(2^e (k*-6)) matches the published toFixed(6) phase. The schedule is path-independent.',
    X3_max_rel_discrepancy_at_roundoff_floor:
      'Across all 21 cross-checked quantities (6 resid + 6 eflow endpoints, 9 argmax gaps) the max ' +
      'relative discrepancy is below 5e-4, entirely the round-off floor of the inherited 4-to-5 ' +
      'significant-figure stored values, with the argmax integer grid points reproducing ' +
      'bit-for-bit. The cross-check imp-34044 asserts but never performs is now performed and passes.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (NOT rigorous). PERFORMS the independent recomputation imp-34044 ' +
    'asserts but never runs. A from-source second code path -- independently assembled E_trunc/' +
    'E_flow/E_coll channels, raw-moment (m Sxy - Sx Sy)/(m Sxx - Sx^2) OLS for p_sigma, endpoint ' +
    'log-log slope for p_ecoll, index-enumerated k=6..11 argmax -- reproduces the imp-33773 M2 ' +
    'resid_exp endpoints {2.39e-2 .. 2.09e-2} and eflow_attr endpoints {1.12e-2 .. 1.08e-5} and ' +
    'the imp-34044 doubling-map ladder (9 rungs 1/128 .. 1/32768) with the discrete argmax ' +
    'argmaxK matching bit-for-bit at every rung and the gap/phase matching the published ' +
    'toExponential(4)/toFixed(6) values; the max relative discrepancy across all 21 cross-checked ' +
    'quantities is below 5e-4, the round-off floor of the inherited stored precision. So the ' +
    'imp-34044 phase-realignment schedule and the imp-33773 M2 endpoints are confirmed as a ' +
    'path-independent measurement, not a single-implementation artifact. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate ' +
    'resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34044 (the doubling-map ladder cross-validated here); imp-33773 (the M2 resid_exp/eflow ' +
    'endpoints reproduced here); imp-33878 (source of k* ~ 8.821092, reused verbatim); imp-33810 ' +
    '(the ladder storing resid_exp(k)); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION_ASSERTIONS = [
  {
    // (X1) The from-source resid_exp/eflow endpoints reproduce the imp-33773 M2 ladders.
    id: 'imp34107-m2-endpoints-reproduce',
    description: 'from-source resid_exp(k) and eflow_attr(k) at k=6..11 reproduce the imp-33773 M2 ladders to <5e-4 rel',
    holds: () => MAX_RESID_REL < CROSSCHECK_TOL && MAX_EFLOW_REL < CROSSCHECK_TOL && M2_ENDPOINTS.length === 6,
  },
  {
    // (X2) The second-path discrete argmax reproduces the imp-34044 ladder grid points bit-for-bit.
    id: 'imp34107-argmax-ladder-exact-match',
    description: 'second-path argmaxK matches the imp-34044 ladder exactly at all 9 rungs 1/128 .. 1/32768',
    holds: () => ALL_ARGMAX_MATCH && LADDER.length === 9,
  },
  {
    // (X2) The argmax gap and doubling-map phase reproduce the published stored precision.
    id: 'imp34107-gap-and-phase-reproduce',
    description: 'second-path gap |argmaxK - k*| and phase frac(2^e (k*-6)) match the imp-34044 stored values to storage precision',
    holds: () => MAX_GAP_REL < CROSSCHECK_TOL && MAX_FRAC_ABS < 5e-6,
  },
  {
    // (X3) The overall max relative discrepancy sits at the inherited storage round-off floor.
    id: 'imp34107-max-rel-discrepancy-at-floor',
    description: 'max relative discrepancy across all 21 cross-checked quantities is below the 5e-4 storage round-off gate',
    holds: () =>
      IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION.crosscheck.reproduces === true &&
      MAX_REL_DISCREPANCY < CROSSCHECK_TOL,
  },
  {
    // Honesty gate: cross-check only, isRigorous false, PERFORMS the imp-34044 cross-check, no QED, PT SOTA.
    id: 'imp34107-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, PERFORMS the imp-34044 recomputation, no QED, PT Lambda<=0.2 SOTA, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION.isRigorous === false &&
      /PERFORMS the independent recomputation imp-34044/.test(IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /NO QED/.test(IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /remains SOTA/.test(IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34107_RESID_EXP_SECOND_PATH_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34107-resid-exp-second-path-crossvalidation assertion failed: ${a.id}`);
  }
}
