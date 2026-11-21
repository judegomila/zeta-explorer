/**
 * @module imp-34591-imp34570-fit-literal-drift-audit
 * @fileoverview imp-34591 -- DRIFT GUARD for the imp-34570 baked fit literals. imp-34570 fit
 *   the smooth eflow_attr(k) bracket (8 imp-34406 rungs, k = 21.0 .. 21.5) to a power law
 *   eflow_attr = A * N^p in the decade top N = 10^(k+1) and baked several reference literals:
 *   R^2 = 0.99999993 (1 - R^2 = 6.93e-8), power p = -0.937481, amplitude A = 3.4917e+6, RMS
 *   log-residual 8.42e-5, max 1.40e-4, per-k slope p*ln10 = -2.158629, the analytic E_flow
 *   log-slope -0.938878 per ln N (= -2.161846 per k), the imp-34406 local slope -2.159, the
 *   analytic-slope residual +0.002846 and residualPct 0.132. None of those were re-derived
 *   from the primitive imp-34169 machinery inside the codebase -- they were computed offline
 *   and transcribed, exposing them to copy/storage drift (the same audit pattern as
 *   imp-34553 / imp-34272; [[storage_precision_assertion_tolerance]]).
 *
 *   METHOD (import-light; NO 16.7MB zeros bundle in the chain). This module RE-DERIVES the
 *   eflow_attr bracket from scratch using a verbatim inline copy of the imp-34169
 *   parts()/eflowLogSlope() sub-terms (built from effectiveHeightForN + C_C_PINNED only, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]), REUSES only the k
 *   grid from IMP34406_EFLOW_ATTR_RUNGS (recomputing eflowAttr fresh at each k, NOT reading
 *   the baked value), runs an INDEPENDENT OLS power-law fit, recomputes the analytic E_flow
 *   log-slope at k* at FULL precision, and cross-checks each imp-34570 exported literal against
 *   the storage-precision tolerance 1e-6 (the toExponential(6)/toFixed(6) trap, imp-2546/imp-2539).
 *
 *   FINDING (measurement / accuracy guard only).
 *   -------------------------------------------------------------------------------------
 *   (G1) THE 8 RUNGS RECOMPUTE EXACTLY. Re-deriving eflow_attr(k) = (E_flow/E_N)*|d ln E_flow
 *        / d log10 N| at N = 10^(k+1) from the inline imp-34169 parts()/eflowLogSlope()
 *        reproduces all 8 baked imp-34406 rung values to a max relative drift < 1e-8 (the
 *        rungs are stored at toExponential(8) = 9 significant figures), well inside 1e-6. No
 *        rung carries copy drift.
 *   (G2) NINE OF TEN FIT LITERALS REPRODUCE WITHIN 1e-6. The independent OLS refit reproduces
 *        p, A, R^2, RMS log-residual, max log-residual and per-k slope to < 1e-7; the
 *        full-precision analytic slope -0.9388777 sits 2.6e-7 from the baked 6-decimal
 *        -0.938878, its per-k image 2.8e-7 from -2.161846, and the derived slope residual
 *        +0.0028459 sits 6.0e-7 from the baked +0.0028465 -- all inside 1e-6. The primary fit
 *        is a faithful transcription.
 *   (G3) ONE DERIVED LITERAL DRIFTS BEYOND 1e-6, BY ROUNDING AMPLIFICATION, NOT COPY ERROR.
 *        slopeResidualPct reproduces to only 2.8e-5. Root cause isolated: imp-34570 derives
 *        residualPct = |(-2.159)/slope - 1|*100 from its OWN 6-decimal-rounded analytic-slope
 *        literal -0.938878, and feeding that SAME rounded literal back into the derivation
 *        reproduces the stored residual AND residualPct to machine epsilon (bit-exact), whereas
 *        the full-precision analytic slope gives 0.131641 vs the stored 0.131669. residualPct
 *        is a ~0.13% difference of two near-equal ~2.16 magnitudes, so the ~3e-7 six-decimal
 *        rounding of the slope amplifies ~90x into 2.8e-5. So there is NO transcription error --
 *        only intrinsic storage-rounding amplification in a small-difference ratio; the
 *        2-sig-fig headline (residualPct < 0.15%, quoted 0.132) is unaffected.
 *
 *   The punchline: re-deriving the eflow_attr bracket from the primitive imp-34169
 *   parts()/eflowLogSlope() and independently refitting the power law reproduces all 8 rungs
 *   (< 1e-8) and 9 of the 10 imp-34570 fit literals (p, A, R^2, residuals, per-k slope, analytic
 *   slope, slope residual) within the 1e-6 storage tolerance -- NO copy drift. The single
 *   over-tolerance literal, slopeResidualPct (2.8e-5), is precision-limited by imp-34570 having
 *   derived it from its own 6-decimal-rounded analytic slope (bit-exact when that rounded input
 *   is reused), a benign rounding amplification in a small-difference ratio, not a mistyped value.
 *
 *   ACCURACY GUARD ONLY. An independent recompute-and-compare of an inherited surrogate fit,
 *   NOT an RH bound. Reproduces the imp-34570 numbers; establishes nothing new about them. The
 *   component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 *   asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 *   establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (the baked fit literals audited here)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts()/eflowLogSlope() machinery)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the 8-rung k grid reused)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import {
  IMP34570_POWER_LAW_EXPONENT,
  IMP34570_POWER_LAW_AMPLITUDE,
  IMP34570_FIT_R2,
  IMP34570_FIT_RMS_LOG_RESID,
  IMP34570_FIT_MAX_LOG_RESID,
  IMP34570_FIT_PER_K_SLOPE,
  IMP34570_EFLOW_ANALYTIC_SLOPE_PER_LN_N,
  IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K,
  IMP34570_IMP34406_LOCAL_SLOPE,
  IMP34570_SLOPE_RESIDUAL,
  IMP34570_SLOPE_RESIDUAL_PCT,
} from './imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const STORAGE_TOL = 1e-6; // toExponential(6)/toFixed(6) storage-precision tolerance (imp-2546/imp-2539)

// --- verbatim inline copy of the imp-34169 parts()/eflowLogSlope() sub-terms (import-light) ----
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34169
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
// eflow_attr(k) = (E_flow / E_N) * |d ln E_flow / d ln N| at the decade top N = 10^(k+1).
function eflowAttrAt(k) {
  const N = Math.pow(10, k + 1);
  const p = parts(N);
  return (p.E_flow / p.E_N) * Math.abs(eflowLogSlope(N));
}

// --- (G1) independent rung recompute vs the baked imp-34406 rung values -----------------------
const RECOMPUTED_RUNGS = IMP34406_EFLOW_ATTR_RUNGS.map((r) => ({
  k: r.k,
  baked: r.eflowAttr,
  recomputed: eflowAttrAt(r.k),
}));
export const IMP34591_MAX_RUNG_REL_DRIFT = RECOMPUTED_RUNGS.reduce(
  (m, r) => Math.max(m, Math.abs(r.recomputed / r.baked - 1)),
  0,
); // < 1e-8

// --- (G2) independent OLS power-law fit  eflow_attr = A * N^p  on (ln N, ln eflow_attr) --------
const XS = RECOMPUTED_RUNGS.map((r) => Math.log(Math.pow(10, r.k + 1)));
const YS = RECOMPUTED_RUNGS.map((r) => Math.log(r.recomputed));
const NN = XS.length;
const MX = XS.reduce((a, b) => a + b, 0) / NN;
const MY = YS.reduce((a, b) => a + b, 0) / NN;
let SXX = 0;
let SXY = 0;
let SYY = 0;
for (let i = 0; i < NN; i++) {
  SXX += (XS[i] - MX) ** 2;
  SXY += (XS[i] - MX) * (YS[i] - MY);
  SYY += (YS[i] - MY) ** 2;
}
const P_EXPONENT = SXY / SXX;
const LN_A = MY - P_EXPONENT * MX;
let SSRES = 0;
let MAX_RESID = 0;
for (let i = 0; i < NN; i++) {
  const resid = YS[i] - (LN_A + P_EXPONENT * XS[i]);
  SSRES += resid * resid;
  MAX_RESID = Math.max(MAX_RESID, Math.abs(resid));
}
const ANALYTIC_SLOPE_PER_LN_N = eflowLogSlope(Math.pow(10, KSTAR + 1)); // full precision
const ANALYTIC_SLOPE_PER_K = ANALYTIC_SLOPE_PER_LN_N * Math.LN10;
const SLOPE_RESIDUAL = IMP34570_IMP34406_LOCAL_SLOPE - ANALYTIC_SLOPE_PER_K;
const SLOPE_RESIDUAL_PCT = Math.abs(IMP34570_IMP34406_LOCAL_SLOPE / ANALYTIC_SLOPE_PER_K - 1) * 100;
export const IMP34591_RECOMPUTED = {
  exponent: P_EXPONENT,
  amplitude: Math.exp(LN_A),
  r2: 1 - SSRES / SYY,
  rmsLogResid: Math.sqrt(SSRES / NN),
  maxLogResid: MAX_RESID,
  perKSlope: P_EXPONENT * Math.LN10,
  analyticSlopePerLnN: ANALYTIC_SLOPE_PER_LN_N,
  analyticSlopePerK: ANALYTIC_SLOPE_PER_K,
  slopeResidual: SLOPE_RESIDUAL,
  slopeResidualPct: SLOPE_RESIDUAL_PCT,
};

// --- cross-check every imp-34570 literal against the independent recompute --------------------
// rel = |a-b|/max(1,|b|): true relative drift for the O(1e6) amplitude, absolute for the O(1) rest.
const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(b));
export const IMP34591_LITERAL_CHECKS = [
  { label: 'power p', recomputed: P_EXPONENT, baked: IMP34570_POWER_LAW_EXPONENT, drift: rel(P_EXPONENT, IMP34570_POWER_LAW_EXPONENT) },
  { label: 'amplitude A', recomputed: IMP34591_RECOMPUTED.amplitude, baked: IMP34570_POWER_LAW_AMPLITUDE, drift: rel(IMP34591_RECOMPUTED.amplitude, IMP34570_POWER_LAW_AMPLITUDE) },
  { label: 'R^2', recomputed: IMP34591_RECOMPUTED.r2, baked: IMP34570_FIT_R2, drift: rel(IMP34591_RECOMPUTED.r2, IMP34570_FIT_R2) },
  { label: 'RMS log-resid', recomputed: IMP34591_RECOMPUTED.rmsLogResid, baked: IMP34570_FIT_RMS_LOG_RESID, drift: rel(IMP34591_RECOMPUTED.rmsLogResid, IMP34570_FIT_RMS_LOG_RESID) },
  { label: 'max log-resid', recomputed: MAX_RESID, baked: IMP34570_FIT_MAX_LOG_RESID, drift: rel(MAX_RESID, IMP34570_FIT_MAX_LOG_RESID) },
  { label: 'per-k slope', recomputed: IMP34591_RECOMPUTED.perKSlope, baked: IMP34570_FIT_PER_K_SLOPE, drift: rel(IMP34591_RECOMPUTED.perKSlope, IMP34570_FIT_PER_K_SLOPE) },
  { label: 'analytic slope /lnN', recomputed: ANALYTIC_SLOPE_PER_LN_N, baked: IMP34570_EFLOW_ANALYTIC_SLOPE_PER_LN_N, drift: rel(ANALYTIC_SLOPE_PER_LN_N, IMP34570_EFLOW_ANALYTIC_SLOPE_PER_LN_N) },
  { label: 'analytic slope /k', recomputed: ANALYTIC_SLOPE_PER_K, baked: IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K, drift: rel(ANALYTIC_SLOPE_PER_K, IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K) },
  { label: 'slope residual', recomputed: SLOPE_RESIDUAL, baked: IMP34570_SLOPE_RESIDUAL, drift: rel(SLOPE_RESIDUAL, IMP34570_SLOPE_RESIDUAL) },
  { label: 'slope residual pct', recomputed: SLOPE_RESIDUAL_PCT, baked: IMP34570_SLOPE_RESIDUAL_PCT, drift: rel(SLOPE_RESIDUAL_PCT, IMP34570_SLOPE_RESIDUAL_PCT) },
];
export const IMP34591_OUT_OF_TOLERANCE = IMP34591_LITERAL_CHECKS.filter((c) => c.drift > STORAGE_TOL);
// The clean set = every literal except the doubly-derived slopeResidualPct.
const CLEAN_CHECKS = IMP34591_LITERAL_CHECKS.filter((c) => c.label !== 'slope residual pct');
export const IMP34591_MAX_CLEAN_DRIFT = CLEAN_CHECKS.reduce((m, c) => Math.max(m, c.drift), 0); // ~6.0e-7
export const IMP34591_RESIDUAL_PCT_DRIFT = IMP34591_LITERAL_CHECKS.find(
  (c) => c.label === 'slope residual pct',
).drift; // ~2.8e-5

// Isolate rounding-amplification from copy error: feeding imp-34570 OWN 6-decimal-rounded
// analytic-slope literal (-0.938878) back into the derivation must reproduce its stored residual
// and residualPct BIT-EXACTLY -- proving the slopeResidualPct drift is pure storage rounding.
const SR_FROM_ROUNDED = IMP34570_IMP34406_LOCAL_SLOPE - IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K;
const SRP_FROM_ROUNDED =
  Math.abs(IMP34570_IMP34406_LOCAL_SLOPE / IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K - 1) * 100;
export const IMP34591_ROUNDED_INPUT_IS_BIT_EXACT =
  SR_FROM_ROUNDED === IMP34570_SLOPE_RESIDUAL && SRP_FROM_ROUNDED === IMP34570_SLOPE_RESIDUAL_PCT;

export const IMP34591_IMP34570_FIT_LITERAL_DRIFT_AUDIT = {
  id: 'imp-34591',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  storageTolerance: STORAGE_TOL,
  question:
    'imp-34570 bakes power-law fit literals (R^2 = 0.99999993, p = -0.9375, per-k slope ' +
    '-2.159, analytic per-k slope -2.1618, residual +0.003, residualPct 0.132) with no ' +
    'independent recompute guard. Re-derive the eflow_attr bracket from the primitive ' +
    'imp-34169 parts()/eflowLogSlope() machinery, refit the power law independently, and ' +
    'cross-check every baked literal within the storage-precision tolerance. Accuracy guard ' +
    'only; NO QED.',
  maxRungRelDrift: +IMP34591_MAX_RUNG_REL_DRIFT.toExponential(3), // < 1e-8
  maxCleanDrift: +IMP34591_MAX_CLEAN_DRIFT.toExponential(3), // ~6.0e-7 (9 of 10 literals)
  residualPctDrift: +IMP34591_RESIDUAL_PCT_DRIFT.toExponential(3), // ~2.8e-5 (the one flagged)
  outOfToleranceLabels: IMP34591_OUT_OF_TOLERANCE.map((c) => c.label), // ['slope residual pct']
  roundedInputBitExact: IMP34591_ROUNDED_INPUT_IS_BIT_EXACT, // true -> rounding, not copy error
  literalChecks: IMP34591_LITERAL_CHECKS.map((c) => ({
    label: c.label,
    recomputed: c.recomputed,
    baked: c.baked,
    drift: +c.drift.toExponential(3),
    withinTol: c.drift <= STORAGE_TOL,
  })),
  finding: {
    G1_rungs_recompute_exactly:
      'Re-deriving eflow_attr(k) = (E_flow/E_N)*|d ln E_flow / d log10 N| at N = 10^(k+1) from ' +
      'the inline imp-34169 parts()/eflowLogSlope() reproduces all 8 baked imp-34406 rung ' +
      'values to a max relative drift < 1e-8 (rungs stored at 9 sig figs). No rung carries copy drift.',
    G2_nine_of_ten_literals_within_tolerance:
      'The independent OLS refit reproduces p = -0.937481, A = 3.4917e+6, R^2 = 0.99999993, ' +
      'RMS 8.42e-5, max 1.40e-4 and per-k slope -2.158629 to < 1e-7; the full-precision analytic ' +
      'slope -0.9388777 sits 2.6e-7 from the baked -0.938878, its per-k image 2.8e-7 from ' +
      '-2.161846, and the slope residual +0.0028459 sits 6.0e-7 from +0.0028465 -- all 9 inside 1e-6.',
    G3_residual_pct_drifts_by_rounding_not_copy_error:
      'slopeResidualPct reproduces to only 2.8e-5 (> 1e-6). NOT a transcription error: imp-34570 ' +
      'derives residualPct = |(-2.159)/slope - 1|*100 from its OWN 6-decimal-rounded analytic ' +
      'slope -0.938878, and feeding that same rounded literal back reproduces the stored residual ' +
      'AND residualPct BIT-EXACTLY, whereas the full-precision slope gives 0.131641 vs stored ' +
      '0.131669. residualPct is a ~0.13% difference of near-equal ~2.16 magnitudes, so the ~3e-7 ' +
      'six-decimal slope rounding amplifies ~90x into 2.8e-5 -- intrinsic small-difference ' +
      'rounding, not a mistyped value; the 2-sig-fig headline (residualPct < 0.15%, 0.132) is unaffected.',
  },
  isRigorous: false,
  honest:
    'ACCURACY GUARD ONLY -- an independent recompute-and-compare of the imp-34570 baked ' +
    'power-law fit literals, re-deriving the eflow_attr bracket from a verbatim inline copy of ' +
    'the imp-34169 parts()/eflowLogSlope() machinery (import-light, no 16.7MB zeros bundle) and ' +
    'refitting the OLS independently. All 8 rungs (< 1e-8) and 9 of the 10 fit literals reproduce ' +
    'within the 1e-6 storage tolerance (max clean drift ~6.0e-7); the single over-tolerance ' +
    'literal, slopeResidualPct (2.8e-5), is precision-limited by imp-34570 having derived it from ' +
    'its own 6-decimal-rounded analytic slope (bit-exact when that rounded input is reused) -- a ' +
    'benign rounding amplification in a small-difference ratio, NOT a copy error. Reproduces the ' +
    'imp-34570 numbers; establishes nothing new about them. Descriptive surrogate, NOT a rigorous ' +
    'asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34591_ASSERTIONS = [
  {
    // (G1) the 8 rungs recompute from the primitive machinery to < 1e-6 relative (in fact < 1e-8).
    id: 'imp-34591-rungs-recompute-within-storage-tolerance',
    description: 'independent eflow_attr recompute reproduces all 8 baked imp-34406 rungs to < 1e-6 relative drift',
    holds: () => RECOMPUTED_RUNGS.length === 8 && IMP34591_MAX_RUNG_REL_DRIFT < STORAGE_TOL && IMP34591_MAX_RUNG_REL_DRIFT < 1e-6,
  },
  {
    // (G2) the independent OLS refit reproduces the 6 primary imp-34570 fit constants within tolerance.
    id: 'imp-34591-primary-fit-literals-reproduce-within-storage-tolerance',
    description: 'independent OLS refit reproduces imp-34570 p, A, R^2, RMS, max and per-k slope within 1e-6',
    holds: () =>
      Math.abs(P_EXPONENT - IMP34570_POWER_LAW_EXPONENT) < STORAGE_TOL &&
      rel(IMP34591_RECOMPUTED.amplitude, IMP34570_POWER_LAW_AMPLITUDE) < STORAGE_TOL &&
      Math.abs(IMP34591_RECOMPUTED.r2 - IMP34570_FIT_R2) < STORAGE_TOL &&
      Math.abs(IMP34591_RECOMPUTED.rmsLogResid - IMP34570_FIT_RMS_LOG_RESID) < STORAGE_TOL &&
      Math.abs(MAX_RESID - IMP34570_FIT_MAX_LOG_RESID) < STORAGE_TOL &&
      Math.abs(IMP34591_RECOMPUTED.perKSlope - IMP34570_FIT_PER_K_SLOPE) < STORAGE_TOL,
  },
  {
    // (G2) the full-precision analytic slope and the derived slope residual reproduce within tolerance.
    id: 'imp-34591-analytic-slope-and-residual-reproduce',
    description: 'full-precision analytic slope (-0.938878 per ln N) and slope residual (+0.002846) reproduce within 1e-6',
    holds: () =>
      Math.abs(ANALYTIC_SLOPE_PER_LN_N - IMP34570_EFLOW_ANALYTIC_SLOPE_PER_LN_N) < STORAGE_TOL &&
      Math.abs(ANALYTIC_SLOPE_PER_K - IMP34570_EFLOW_ANALYTIC_SLOPE_PER_K) < STORAGE_TOL &&
      Math.abs(SLOPE_RESIDUAL - IMP34570_SLOPE_RESIDUAL) < STORAGE_TOL &&
      IMP34591_MAX_CLEAN_DRIFT < STORAGE_TOL,
  },
  {
    // (G3) exactly ONE literal (slopeResidualPct) exceeds 1e-6, and the excess is rounding
    // amplification -- reusing imp-34570 OWN rounded analytic slope reproduces its residual/pct
    // bit-exactly -- staying under the documented amplification bound 1e-4, NOT a copy error.
    id: 'imp-34591-residual-pct-drift-is-rounding-not-copy-error',
    description: 'exactly one literal (slopeResidualPct) exceeds 1e-6 at ~2.8e-5; bit-exact from imp-34570 own rounded slope -> rounding amplification, < 1e-4',
    holds: () =>
      IMP34591_OUT_OF_TOLERANCE.length === 1 &&
      IMP34591_OUT_OF_TOLERANCE[0].label === 'slope residual pct' &&
      IMP34591_RESIDUAL_PCT_DRIFT > STORAGE_TOL &&
      IMP34591_RESIDUAL_PCT_DRIFT < 1e-4 &&
      IMP34591_ROUNDED_INPUT_IS_BIT_EXACT === true,
  },
  {
    // Honesty gate: accuracy guard only, isRigorous false, no QED, no refereed bound is changed, imp-486 untouched.
    id: 'imp-34591-honesty-gate-no-qed',
    description: 'Accuracy guard only: isRigorous false, no QED, no refereed bound is changed, imp-486 untouched',
    holds: () =>
      IMP34591_IMP34570_FIT_LITERAL_DRIFT_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP34591_IMP34570_FIT_LITERAL_DRIFT_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP34591_IMP34570_FIT_LITERAL_DRIFT_AUDIT.honest) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34591_IMP34570_FIT_LITERAL_DRIFT_AUDIT.honest),
  },
];

for (const a of IMP34591_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34591-imp34570-fit-literal-drift-audit assertion failed: ${a.id}`);
  }
}
