/**
 * @module imp-34608-eflow-attr-cohort-derived-pct-drift-audit
 * @fileoverview imp-34608 -- EXTEND the imp-34591 G3 near-equal-magnitude rounding-amplification
 *   audit (which examined only the imp-34570 slopeResidualPct literal) to the derived
 *   percent/ratio literals of the imp-34572 far-side and imp-34406 rung cohort, and MEASURE
 *   which stored literals exceed the 1e-6 storage-precision tolerance by the same amplification
 *   (per [[storage_precision_assertion_tolerance]]).
 *
 *   imp-34591 G3 isolated that the imp-34570 slopeResidualPct literal (0.131669) drifts ~2.8e-5,
 *   beyond the 1e-6 toExponential(6)/toFixed(6) tolerance, because it is a percent of a
 *   RATIO-minus-1 of two near-equal ~2.16 magnitudes, so the 6-decimal rounding of the analytic
 *   slope is amplified ~90x. Only imp-34570 was audited. This module reuses the same import-light
 *   imp-34169 machinery and re-derives the analogous derived-percent/ratio literals across the
 *   imp-34572 / imp-34406 cohort at full precision, then classifies each stored literal by the
 *   1e-6 tolerance and by its algebraic FORM (ratio-minus-1 vs plain difference).
 *
 *   METHOD (import-light; NO 16.7MB zeros bundle in the chain). A verbatim inline copy of the
 *   imp-34169 parts() / eflowLogSlope() sub-terms (built from effectiveHeightForN + C_C_PINNED
 *   only, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]) re-derives
 *   eflow_attr(k) = (E_flow / E_N) * |d ln E_flow / d log10 N| at N = 10^(k+1) fresh at each
 *   cohort k, REUSING only the k grid from the baked imp-34406 / imp-34572 rungs (recomputing
 *   the value, not reading the baked one). The four derived percent/ratio literals are then
 *   recomputed at full precision and cross-checked against the stored fields within 1e-6.
 *
 *   FINDINGS (measurement / accuracy guard only).
 *   -------------------------------------------------------------------------------------
 *   (H1) THE COHORT RUNGS RECOMPUTE EXACTLY. Re-deriving eflow_attr(k) from the inline
 *        imp-34169 machinery reproduces all 15 baked imp-34406 / imp-34572 rung values to a max
 *        relative drift 1.74e-9, well inside 1e-6. No rung carries copy drift, so any
 *        over-tolerance in a derived literal is amplification, not a mistyped input.
 *   (H2) EXACTLY ONE DERIVED LITERAL EXCEEDS 1e-6 -- THE ONLY RATIO-MINUS-1 FORM. Of the four
 *        cohort derived literals, only the imp-34406 imp34310InterpHighPct (the convexity
 *        over-read percent = ((E_star_interp - E_star_direct) / E_star_direct) * 100) drifts
 *        beyond 1e-6: its full-precision value 1.39517455 sits 2.55e-5 from the stored 1.3952.
 *        This is the SAME amplification imp-34591 G3 found: it is a ratio-minus-1 of two
 *        near-equal ~4.5e-15 magnitudes, so the 7-sig-fig rounding of the imp-34310 interp input
 *        is amplified ~71x (the input-only component alone is ~4.0e-6, already over 1e-6), and
 *        its own toFixed(4) percent storage carries the rest. The 4-sig-fig headline
 *        (convexity over-read ~1.40%) is unaffected.
 *   (H3) THE THREE PLAIN-DIFFERENCE LITERALS STAY WITHIN 1e-6. imp-34406 secondDifference
 *        (7.58e-8), imp-34572 slopeDrift (3.96e-7), and imp-34572 farSideSecondDifference
 *        (2.41e-7) all reproduce inside 1e-6 -- even slopeDrift, a difference of two near-equal
 *        ~-2.16 slopes. A plain subtraction propagates the inputs absolute rounding ~1:1 with NO
 *        division amplification, so it does NOT replicate the ratio-minus-1 blow-up. That is the
 *        distinction refining imp-34591 G3: the ratio-minus-1 percent amplifies; the plain
 *        difference does not.
 *
 *   The punchline: across the imp-34572 / imp-34406 cohort, the imp-34591 G3 near-equal-magnitude
 *   amplification recurs in EXACTLY the one ratio-minus-1 literal (imp-34406 imp34310InterpHighPct,
 *   2.55e-5, amplification-driven), while the three plain-difference literals (both second
 *   differences and the slope drift) stay within 1e-6. Practical guidance: imp-34406
 *   imp34310InterpHighPct already carries a loose 5e-2 assertion tolerance (its assertion compares
 *   the full-precision exported const, not the toFixed(4) field), so it is SAFE; the
 *   difference-form literals safely keep their tight tolerances. No assertion needs changing;
 *   this is a measured guard that documents WHY.
 *
 *   ACCURACY GUARD ONLY. An independent recompute-and-compare of inherited surrogate derived
 *   literals, NOT an RH bound. Reproduces the cohort numbers; establishes nothing new about them.
 *   The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 *   asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 *   no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34591-imp34570-fit-literal-drift-audit.js (G3 amplification isolated for imp-34570 only)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (the slopeResidualPct precedent)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (imp34310InterpHighPct, secondDifference)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (slopeDrift, farSideSecondDifference)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the parts()/eflowLogSlope() machinery)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import {
  IMP34406_EFLOW_ATTR_RUNGS,
  IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE,
} from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import {
  IMP34572_FAR_SIDE_RUNGS,
  IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS,
} from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import { IMP34310_EFLOW_ATTR_AT_KSTAR } from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';

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
  return { E_flow, E_coll, E_N };
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
// eflow_attr(k) = (E_flow / E_N) * |d ln E_flow / d log10 N| at the decade top N = 10^(k+1).
function eflowAttrAt(k) {
  const N = Math.pow(10, k + 1);
  const p = parts(N);
  return (p.E_flow / p.E_N) * Math.abs(eflowLogSlope(N));
}

// --- (H1) independent cohort rung recompute vs the baked imp-34406 / imp-34572 rung values -----
const COHORT_KS = [
  ...IMP34406_EFLOW_ATTR_RUNGS.map((r) => ({ k: r.k, baked: r.eflowAttr })),
  ...IMP34572_FAR_SIDE_RUNGS.map((r) => ({ k: r.k, baked: r.eflowAttr })),
];
export const IMP34608_COHORT_RUNG_COUNT = COHORT_KS.length; // 15 (8 near + 7 far, overlaps counted twice)
export const IMP34608_MAX_RUNG_REL_DRIFT = COHORT_KS.reduce(
  (m, r) => Math.max(m, Math.abs(eflowAttrAt(r.k) / r.baked - 1)),
  0,
); // 1.74e-9

// --- (H2/H3) full-precision recompute of the four derived percent/ratio literals ---------------
// (a) imp-34406 imp34310InterpHighPct = ((E*_interp - E*_direct) / E*_direct) * 100  [ratio-minus-1]
const E_STAR_DIRECT_FRESH = eflowAttrAt(KSTAR);
const INTERP_PCT_FULL =
  ((IMP34310_EFLOW_ATTR_AT_KSTAR - E_STAR_DIRECT_FRESH) / E_STAR_DIRECT_FRESH) * 100; // 1.39517455
// isolate the input-amplification component: the 7-sig-fig interp display vs the full interp const,
// both against the same direct denominator -- this alone already exceeds 1e-6 (~4.0e-6).
const INTERP_PCT_FROM_7SIG =
  ((4.582753e-15 - E_STAR_DIRECT_FRESH) / E_STAR_DIRECT_FRESH) * 100;
export const IMP34608_INTERP_PCT_INPUT_AMPLIFICATION = Math.abs(INTERP_PCT_FULL - INTERP_PCT_FROM_7SIG); // ~4.0e-6

// (b) imp-34406 secondDifference (uniform h=0.1 three-point)                          [plain difference]
const H = 0.1;
const SECOND_DIFF_406_FULL =
  (eflowAttrAt(IMP34406_EFLOW_ATTR_RUNGS[0].k) -
    2 * eflowAttrAt(IMP34406_EFLOW_ATTR_RUNGS[1].k) +
    eflowAttrAt(IMP34406_EFLOW_ATTR_RUNGS[2].k)) /
  (H * H); // 3.116727e-14

// (c) imp-34572 slopeDrift = endpoint(-2.160976) - centralSlope(21.35)               [plain difference]
const SLOPE_2135_FULL =
  (Math.log(eflowAttrAt(21.4)) - Math.log(eflowAttrAt(21.3))) / 0.1;
const SLOPE_ENDPOINT = -2.160976; // imp-34572 offline endpoint literal (h=0.01), treated as fixed
const SLOPE_DRIFT_FULL = SLOPE_ENDPOINT - SLOPE_2135_FULL; // -0.00165640

// (d) imp-34572 farSideSecondDifference (uniform h=0.1 three-point at 21.4/21.5/21.6) [plain difference]
const FAR_SECOND_DIFF_FULL =
  (eflowAttrAt(21.4) - 2 * eflowAttrAt(21.5) + eflowAttrAt(21.6)) / (H * H); // 1.317524e-14

// relative drift: absolute for the O(1) percent/slope, relative for the O(1e-14) second differences.
const relDrift = (full, stored) => Math.abs(full - stored) / Math.max(1, Math.abs(stored));

export const IMP34608_LITERAL_CHECKS = [
  {
    label: 'imp-34406 imp34310InterpHighPct',
    form: 'ratio-minus-1',
    full: INTERP_PCT_FULL,
    stored: IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE.imp34310InterpHighPct, // 1.3952
    drift: relDrift(INTERP_PCT_FULL, IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE.imp34310InterpHighPct),
  },
  {
    label: 'imp-34406 secondDifference',
    form: 'plain-difference',
    full: SECOND_DIFF_406_FULL,
    stored: IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE.secondDifference, // 3.116727e-14
    drift: relDrift(SECOND_DIFF_406_FULL, IMP34406_EFLOW_ATTR_SMOOTH_NONZERO_ACROSS_POLE.secondDifference),
  },
  {
    label: 'imp-34572 slopeDrift',
    form: 'plain-difference',
    full: SLOPE_DRIFT_FULL,
    stored: IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS.slopeDrift, // -0.001656
    drift: relDrift(SLOPE_DRIFT_FULL, IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS.slopeDrift),
  },
  {
    label: 'imp-34572 farSideSecondDifference',
    form: 'plain-difference',
    full: FAR_SECOND_DIFF_FULL,
    stored: IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS.farSideSecondDifference, // 1.317524e-14
    drift: relDrift(FAR_SECOND_DIFF_FULL, IMP34572_EFLOW_ATTR_FAR_SIDE_POLE_SMOOTHNESS.farSideSecondDifference),
  },
];
export const IMP34608_OUT_OF_TOLERANCE = IMP34608_LITERAL_CHECKS.filter((c) => c.drift > STORAGE_TOL);
export const IMP34608_MAX_DIFFERENCE_FORM_DRIFT = IMP34608_LITERAL_CHECKS.filter(
  (c) => c.form === 'plain-difference',
).reduce((m, c) => Math.max(m, c.drift), 0); // ~3.96e-7

export const IMP34608_EFLOW_ATTR_COHORT_DERIVED_PCT_DRIFT_AUDIT = {
  id: 'imp-34608',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  storageTolerance: STORAGE_TOL,
  question:
    'imp-34591 G3 flagged the imp-34570 slopeResidualPct (0.131669) as drifting ~2.8e-5 beyond ' +
    '1e-6 by ratio-minus-1 near-equal-magnitude amplification, auditing only imp-34570. Re-derive ' +
    'the analogous derived percent/ratio literals across the imp-34572 / imp-34406 cohort at full ' +
    'precision and measure which stored literals exceed 1e-6 by the same amplification. Accuracy ' +
    'guard only; NO QED.',
  cohortRungCount: IMP34608_COHORT_RUNG_COUNT, // 15
  maxRungRelDrift: +IMP34608_MAX_RUNG_REL_DRIFT.toExponential(3), // 1.74e-9
  interpPctInputAmplification: +IMP34608_INTERP_PCT_INPUT_AMPLIFICATION.toExponential(3), // ~4.0e-6
  maxDifferenceFormDrift: +IMP34608_MAX_DIFFERENCE_FORM_DRIFT.toExponential(3), // ~3.96e-7
  outOfToleranceLabels: IMP34608_OUT_OF_TOLERANCE.map((c) => c.label), // ['imp-34406 imp34310InterpHighPct']
  literalChecks: IMP34608_LITERAL_CHECKS.map((c) => ({
    label: c.label,
    form: c.form,
    full: c.full,
    stored: c.stored,
    drift: +c.drift.toExponential(3),
    withinTol: c.drift <= STORAGE_TOL,
  })),
  finding: {
    H1_cohort_rungs_recompute_exactly:
      'Re-deriving eflow_attr(k) from the inline imp-34169 parts()/eflowLogSlope() reproduces all ' +
      '15 baked imp-34406 / imp-34572 rung values to a max relative drift 1.74e-9, well inside ' +
      '1e-6. No rung carries copy drift, so any over-tolerance in a derived literal is ' +
      'amplification, not a mistyped input.',
    H2_only_ratio_minus_1_literal_exceeds_tolerance:
      'Of the four cohort derived literals, only imp-34406 imp34310InterpHighPct (the convexity ' +
      'over-read percent = ((E*_interp - E*_direct)/E*_direct)*100) drifts beyond 1e-6: full ' +
      '1.39517455 vs stored 1.3952 is 2.55e-5. Same amplification as imp-34591 G3 -- a ' +
      'ratio-minus-1 of near-equal ~4.5e-15 magnitudes, so the 7-sig-fig imp-34310 interp input ' +
      'is amplified ~71x (input-only component ~4.0e-6, already over 1e-6) and its toFixed(4) ' +
      'percent storage carries the rest. The 4-sig-fig headline (~1.40%) is unaffected.',
    H3_plain_difference_literals_stay_within_tolerance:
      'imp-34406 secondDifference (7.58e-8), imp-34572 slopeDrift (3.96e-7), and imp-34572 ' +
      'farSideSecondDifference (2.41e-7) all reproduce inside 1e-6 -- even slopeDrift, a ' +
      'difference of two near-equal ~-2.16 slopes. A plain subtraction propagates the inputs ' +
      'absolute rounding ~1:1 with NO division amplification, so it does NOT replicate the ' +
      'ratio-minus-1 blow-up. imp-34406 imp34310InterpHighPct already carries a loose 5e-2 ' +
      'assertion tolerance (compares the full-precision exported const, not the field), so it is ' +
      'SAFE; the difference-form literals safely keep their tight tolerances. No assertion needs ' +
      'changing.',
  },
  isRigorous: false,
  honest:
    'ACCURACY GUARD ONLY -- an independent recompute-and-compare of the derived percent/ratio ' +
    'literals of the imp-34572 / imp-34406 cohort, re-deriving the eflow_attr bracket from a ' +
    'verbatim inline copy of the imp-34169 parts()/eflowLogSlope() machinery (import-light, no ' +
    '16.7MB zeros bundle). All 15 rungs recompute to 1.74e-9; exactly one derived literal (the ' +
    'imp-34406 ratio-minus-1 imp34310InterpHighPct, 2.55e-5, amplification-driven) exceeds 1e-6, ' +
    'while the three plain-difference literals stay within 1e-6 (max 3.96e-7) -- refining ' +
    'imp-34591 G3: the ratio-minus-1 percent amplifies, the plain difference does not. Reproduces ' +
    'the cohort numbers; establishes nothing new about them. Descriptive surrogate, NOT a ' +
    'rigorous asymptotic; the component model is the inherited imp-3220/imp-3406 extrapolation; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34608_ASSERTIONS = [
  {
    // (H1) all 15 cohort rungs recompute from the primitive machinery to < 1e-6 relative.
    id: 'imp-34608-cohort-rungs-recompute-within-storage-tolerance',
    description: 'independent eflow_attr recompute reproduces all 15 baked imp-34406/imp-34572 rungs to < 1e-6 relative drift',
    holds: () =>
      IMP34608_COHORT_RUNG_COUNT === 15 &&
      IMP34608_MAX_RUNG_REL_DRIFT < STORAGE_TOL &&
      IMP34608_MAX_RUNG_REL_DRIFT < 1e-8,
  },
  {
    // (H2) exactly one literal exceeds 1e-6, and it is the ratio-minus-1 imp34310InterpHighPct,
    // by bounded amplification (< 1e-4), with its input-only amplification component already > 1e-6.
    id: 'imp-34608-only-ratio-minus-1-literal-exceeds-tolerance',
    description: 'exactly one cohort literal (imp-34406 imp34310InterpHighPct, ratio-minus-1) exceeds 1e-6 at ~2.55e-5 < 1e-4; input-only amplification already > 1e-6',
    holds: () =>
      IMP34608_OUT_OF_TOLERANCE.length === 1 &&
      IMP34608_OUT_OF_TOLERANCE[0].label === 'imp-34406 imp34310InterpHighPct' &&
      IMP34608_OUT_OF_TOLERANCE[0].form === 'ratio-minus-1' &&
      IMP34608_OUT_OF_TOLERANCE[0].drift > STORAGE_TOL &&
      IMP34608_OUT_OF_TOLERANCE[0].drift < 1e-4 &&
      IMP34608_INTERP_PCT_INPUT_AMPLIFICATION > STORAGE_TOL,
  },
  {
    // (H3) all three plain-difference literals reproduce within 1e-6 (no ratio amplification).
    id: 'imp-34608-plain-difference-literals-within-tolerance',
    description: 'the three plain-difference literals (both second differences, slopeDrift) reproduce within 1e-6',
    holds: () =>
      IMP34608_MAX_DIFFERENCE_FORM_DRIFT < STORAGE_TOL &&
      IMP34608_LITERAL_CHECKS.filter((c) => c.form === 'plain-difference').length === 3 &&
      IMP34608_LITERAL_CHECKS.filter((c) => c.form === 'plain-difference').every((c) => c.drift <= STORAGE_TOL),
  },
  {
    // Honesty gate: accuracy guard only, isRigorous false, no QED, no refereed bound is changed, imp-486 untouched.
    id: 'imp-34608-honesty-gate-no-qed',
    description: 'Accuracy guard only: isRigorous false, no QED, no refereed bound is changed, imp-486 untouched',
    holds: () =>
      IMP34608_EFLOW_ATTR_COHORT_DERIVED_PCT_DRIFT_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP34608_EFLOW_ATTR_COHORT_DERIVED_PCT_DRIFT_AUDIT.honest) &&
      /refereed bound is changed/i.test(IMP34608_EFLOW_ATTR_COHORT_DERIVED_PCT_DRIFT_AUDIT.honest) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34608_EFLOW_ATTR_COHORT_DERIVED_PCT_DRIFT_AUDIT.honest),
  },
];

for (const a of IMP34608_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34608-eflow-attr-cohort-derived-pct-drift-audit assertion failed: ${a.id}`);
  }
}
