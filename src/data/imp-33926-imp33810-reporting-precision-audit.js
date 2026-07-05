/**
 * @module imp-33926-imp33810-reporting-precision-audit
 *
 * imp-33926 (numerical, frontier-direction): imp-33884 R3 localised the imp-33810 reported widening
 * gap (917.9 vs exact 903.538, ~1.6%) ENTIRELY to the toFixed(1) rounding of the O(1) head rung
 * roe(6)=2.134 -> 2.1. That localisation was done for the ONE widening landmark. This module
 * GENERALISES it into a systematic reporting-precision audit of the WHOLE imp-33810 cohort:
 * recompute every reported ladder landmark at full IEEE-754 double precision and MEASURE the
 * relative error its display format (toFixed(1) for the resid_over_eflow rungs and the
 * SEPARATION_WIDENING factor; toExponential(4) for resid_exp / eflow_attr / eflow_over_resid)
 * introduces -- then identify the single MOST reporting-inflated quantity across the cohort.
 *
 * WHAT IS AUDITED (all recomputed from the inherited imp-3406/imp-33810 sub-terms, NO fresh model)
 * -----------------------------------------------------------------------------------------------
 *   For each of the 21 quarter-decade rungs k = 6.00, 6.25, ..., 11.00 the exact full-precision
 *   roe(k) = resid_exp(k)/eflow_attr(k) is compared to its imp-33810 toFixed(1) display, and the
 *   relative error |round1(roe) - roe| / |roe| is recorded. The SEPARATION_WIDENING factor
 *   (imp-33810 line 171: toFixed(1) of the ratio of the two toFixed(1)-rounded endpoint rungs) is
 *   compared to the exact roe(11)/roe(6). The toExponential(4) landmarks (5 significant figures)
 *   are bounded by their format (worst-case half-ULP-in-the-5th-figure ~ 5e-5).
 *
 * THE FINDING (measurement / reporting audit only -- generalises imp-33884)
 * ------------------------------------------------------------------------
 *   (R1) THE toFixed(1) RUNG ERROR IS MAXIMISED AT THE O(1) HEAD RUNG. Across all 21 rungs the
 *        toFixed(1) relative error peaks at k=6 (roe(6)=2.1334 -> 2.1, rel err 1.565e-2 ~= 1.57%)
 *        and falls to 1.438e-6 at the tail k=11 (roe=1927.60 -> 1927.6). Because roe(k) grows
 *        ~two-and-a-half orders (2.13 -> 1928) while the one-decimal absolute error is capped at
 *        0.05, the relative error is a SHRINKING envelope in N -- the smallest-magnitude head rung
 *        dominates the whole cohort. (The envelope is not strictly monotone: it jitters with each
 *        rung fractional part, e.g. roe(6.5)=3.5477 -> 3.5 gives 1.345e-2, second-largest.)
 *   (R2) THE SEPARATION_WIDENING FACTOR IS THE SINGLE MOST REPORTING-INFLATED LANDMARK. Its
 *        toFixed(1) relative error is 1.590e-2 (~1.59%), slightly EXCEEDING even the head rung,
 *        because it inherits the head-rung 1.565e-2 (imp-33884 R3) and adds the tail round plus the
 *        final toFixed(1) of the ratio (917.9 vs exact 903.538). It is the global maximum of the audit.
 *   (R3) THE toExponential(4) LANDMARKS ARE THREE ORDERS MORE ACCURATE. resid_exp, eflow_attr and
 *        eflow_over_resid are displayed at 5 significant figures, so their reporting error is
 *        <= ~5e-5 -- about 300x below the head-rung toFixed(1) error. ONLY the one-decimal displays
 *        are materially inflated; nothing reported in scientific notation is.
 *   (R4) THE COHORT VERDICT. The maximum toFixed(1) reporting-induced relative error anywhere in the
 *        imp-33810 cohort is ~1.59% (the SEPARATION_WIDENING factor), and it is inherited almost
 *        entirely from the single O(1) head rung roe(6). Every other reported quantity -- the 20
 *        non-head rungs and all scientific-notation fields -- is materially accurate (rel err below
 *        ~1.35e-2, and below 5e-5 for the exponential fields). The imp-33884 head-rung localisation
 *        is thus the cohort-wide worst case, not a one-off.
 *
 * The punchline: the imp-33884 ~1.6% head-rung artifact is the WORST reporting-precision error in
 * the entire imp-33810 ladder. The one-decimal display costs at most ~1.59% (at the SEPARATION_WIDENING
 * factor, driven by the O(1) head rung); every other landmark is reported to better than ~1.35%, and
 * the scientific-notation fields to better than 5e-5. No reported quantity beyond the head-rung-fed
 * widening is materially inflated by one-decimal rounding.
 *
 * MEASUREMENT / REPORTING AUDIT ONLY. Display-precision diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the underlying
 * values are unchanged -- only their reported precision is audited; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda
 * <= 0.2 remains SOTA.
 *
 * @see imp-33884-eflow-resid-widening-fullprec-recompute (R3 head-rung localisation generalised here)
 * @see imp-33885-eflow-closedform-per-rung-crossvalidation (per-rung closed-form cross-validation)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the ladder whose reported landmarks are audited)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773/imp-33810)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33810 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33810 helper defns (verbatim).
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

// Recompute the imp-33810 ladder at FULL precision, then measure each display formats reporting error.
const K_START = 6;
const K_END = 11;
const K_STEP = 0.25;
const AUDIT_RUNGS = [];
for (let k = K_START; k <= K_END + 1e-9; k += K_STEP) {
  const kk = +k.toFixed(2);
  const lo = Math.pow(10, kk);
  const hi = Math.pow(10, kk + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual (exact)
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // attributed E_flow term (exact)
  const roe = residExp / eflowAttr; // resid_over_eflow (exact, full precision)
  const roeReported = +roe.toFixed(1); // imp-33810 line 146 display
  const roeRelErr = Math.abs(roeReported - roe) / Math.abs(roe); // reporting-induced relative error
  AUDIT_RUNGS.push({
    k: kk,
    roe_exact: +roe.toPrecision(10),
    roe_tofixed1: roeReported,
    roe_rel_err: +roeRelErr.toExponential(4),
  });
}

// The head rung dominates the toFixed(1) rung errors (smallest magnitude O(1) roe).
const ROE_REL_ERRS = AUDIT_RUNGS.map((r) => r.roe_rel_err);
const MAX_ROE_REL_ERR = Math.max(...ROE_REL_ERRS);
const MAX_ROE_REL_ERR_RUNG = AUDIT_RUNGS.find((r) => r.roe_rel_err === MAX_ROE_REL_ERR);
const HEAD_ROE_REL_ERR = AUDIT_RUNGS[0].roe_rel_err; // k=6
const TAIL_ROE_REL_ERR = AUDIT_RUNGS[AUDIT_RUNGS.length - 1].roe_rel_err; // k=11

// SEPARATION_WIDENING (imp-33810 line 171): toFixed(1) of the ratio of the two toFixed(1) endpoint rungs.
const ROE_HEAD_EXACT = AUDIT_RUNGS[0].roe_exact;
const ROE_TAIL_EXACT = AUDIT_RUNGS[AUDIT_RUNGS.length - 1].roe_exact;
const WIDENING_EXACT = ROE_TAIL_EXACT / ROE_HEAD_EXACT; // ~903.538
const WIDENING_REPORTED = +(AUDIT_RUNGS[AUDIT_RUNGS.length - 1].roe_tofixed1 / AUDIT_RUNGS[0].roe_tofixed1).toFixed(1); // 917.9
const WIDENING_REL_ERR = Math.abs(WIDENING_REPORTED - WIDENING_EXACT) / WIDENING_EXACT; // ~1.590e-2

// toExponential(4) = 5 significant figures: worst-case half-ULP-in-the-5th-figure reporting error.
const TOEXP4_REL_ERR_BOUND = 5e-5;

// GLOBAL MAXIMUM reporting-induced relative error across the whole cohort.
const COHORT_MAX_REL_ERR = Math.max(MAX_ROE_REL_ERR, WIDENING_REL_ERR);
const COHORT_MAX_SOURCE =
  WIDENING_REL_ERR >= MAX_ROE_REL_ERR ? 'SEPARATION_WIDENING factor' : `roe rung k=${MAX_ROE_REL_ERR_RUNG.k}`;

export const IMP33926_IMP33810_REPORTING_PRECISION_AUDIT = {
  id: 'imp-33926',
  proofSection: 'S-frontier',
  question:
    'imp-33884 R3 localised the imp-33810 reported widening gap (917.9 vs exact 903.538, ~1.6%) entirely ' +
    'to the toFixed(1) rounding of the O(1) head rung roe(6)=2.134. Generalise that single-landmark ' +
    'result: recompute EVERY imp-33810 reported ladder landmark at full double precision, measure the ' +
    'relative error each display format (toFixed(1) rungs + SEPARATION_WIDENING; toExponential(4) ' +
    'scientific fields) introduces, and identify the single most reporting-inflated quantity in the ' +
    'cohort. Reporting/display audit only; NOT an RH bound; no QED.',
  measuredQuantity:
    'per landmark: |reported_display(x) - x_fullprecision| / |x_fullprecision|, the relative error ' +
    'introduced purely by the imp-33810 display format (toFixed(1) for the 21 resid_over_eflow rungs ' +
    'and the SEPARATION_WIDENING factor; toExponential(4) for resid_exp / eflow_attr / eflow_over_resid)',
  auditRungs: AUDIT_RUNGS,
  cohort: {
    max_roe_tofixed1_rel_err: MAX_ROE_REL_ERR, // ~1.565e-2 at the head rung k=6
    max_roe_rel_err_at_k: MAX_ROE_REL_ERR_RUNG.k, // 6
    head_roe_rel_err_k6: HEAD_ROE_REL_ERR, // ~1.565e-2 (roe=2.1334 -> 2.1)
    tail_roe_rel_err_k11: TAIL_ROE_REL_ERR, // ~1.438e-6 (roe=1927.60 -> 1927.6)
    separation_widening_exact: +WIDENING_EXACT.toFixed(5), // 903.53792
    separation_widening_reported: WIDENING_REPORTED, // 917.9
    separation_widening_rel_err: +WIDENING_REL_ERR.toExponential(4), // ~1.590e-2 (cohort maximum)
    toexponential4_rel_err_bound: TOEXP4_REL_ERR_BOUND, // <= ~5e-5 (5 significant figures)
    cohort_max_reporting_rel_err: +COHORT_MAX_REL_ERR.toExponential(4), // ~1.590e-2
    cohort_max_source: COHORT_MAX_SOURCE, // 'SEPARATION_WIDENING factor'
  },
  finding: {
    R1_tofixed1_rung_error_peaks_at_head:
      'Across all 21 rungs the toFixed(1) relative error peaks at k=6 (roe(6)=2.1334->2.1, ' +
      'rel err 1.565e-2 ~1.57%) and falls to 1.438e-6 at the tail k=11 (roe=1927.60->1927.6). ' +
      'roe(k) grows ~2.5 orders (2.13->1928) while the one-decimal absolute error is capped at 0.05, ' +
      'so the relative error is a shrinking envelope in N -- the O(1) head rung dominates the cohort. ' +
      'The envelope jitters with each rung fractional part (e.g. roe(6.5)=3.5477->3.5, rel 1.345e-2, ' +
      'second-largest), so it is not strictly monotone.',
    R2_separation_widening_is_cohort_maximum:
      'The SEPARATION_WIDENING factor carries the single largest reporting error: toFixed(1) gives ' +
      '917.9 versus the exact 903.538, rel err 1.590e-2 (~1.59%), slightly EXCEEDING even the head ' +
      'rung because it inherits the head-rung 1.565e-2 (imp-33884 R3) plus the tail round and the ' +
      'final toFixed(1) of the ratio. It is the global maximum of the audit.',
    R3_scientific_fields_three_orders_more_accurate:
      'resid_exp, eflow_attr and eflow_over_resid are displayed at 5 significant figures ' +
      '(toExponential(4)), so their reporting error is <= ~5e-5 -- about 300x below the head-rung ' +
      'toFixed(1) error. Only the one-decimal displays are materially inflated.',
    R4_cohort_verdict:
      'The maximum toFixed(1) reporting-induced relative error anywhere in the imp-33810 cohort is ' +
      '~1.59% (the SEPARATION_WIDENING factor), inherited almost entirely from the single O(1) head ' +
      'rung roe(6)=2.134. Every other reported quantity -- the 20 non-head rungs (<=1.35e-2) and all ' +
      'scientific-notation fields (<=5e-5) -- is materially accurate. The imp-33884 head-rung ' +
      'localisation is the cohort-wide worst case, not a one-off.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / REPORTING AUDIT (frontier-direction, NOT rigorous). A full-double-precision recompute ' +
    'of every imp-33810 reported ladder landmark, measuring the relative error each display format ' +
    'introduces, shows the maximum toFixed(1) reporting-induced relative error in the cohort is ~1.59% ' +
    'at the SEPARATION_WIDENING factor (917.9 reported vs 903.538 exact), inherited almost entirely from ' +
    'the O(1) head rung roe(6)=2.134 (whose own toFixed(1) error, 1.565e-2, is the largest among the 21 ' +
    'rungs and decays to 1.438e-6 at the tail). The toExponential(4) scientific fields (resid_exp, ' +
    'eflow_attr, eflow_over_resid) carry <=5e-5, three orders more accurate. So the imp-33884 head-rung ' +
    '~1.6% artifact is the cohort-wide worst case: only the one-decimal displays fed by the O(1) head ' +
    'rung are materially inflated; every other reported quantity is accurate to better than ~1.35%. The ' +
    'underlying values are unchanged -- only their reported precision is audited. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33884 (R3 head-rung localisation generalised here); imp-33885 (per-rung closed-form ' +
    'cross-validation); imp-33810 (the ladder whose reported landmarks are audited); imp-2631 ' +
    '(E_trunc fixed-strip); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP33926_IMP33810_REPORTING_PRECISION_AUDIT_ASSERTIONS = [
  {
    // (R1) 21 rungs audited; the toFixed(1) rung reporting error peaks at the O(1) head rung k=6.
    id: 'imp33926-tofixed1-rung-error-peaks-at-head',
    description: '21 rungs; max roe toFixed(1) rel err at k=6, ~1.57%, tail k=11 negligible (<1e-5)',
    holds: () =>
      AUDIT_RUNGS.length === 21 &&
      MAX_ROE_REL_ERR_RUNG.k === 6 &&
      MAX_ROE_REL_ERR > 1.5e-2 &&
      MAX_ROE_REL_ERR < 1.7e-2 &&
      TAIL_ROE_REL_ERR < 1e-5,
  },
  {
    // (R2) The SEPARATION_WIDENING factor is the single most reporting-inflated landmark (cohort max).
    id: 'imp33926-separation-widening-is-cohort-maximum',
    description: 'SEPARATION_WIDENING toFixed(1) rel err ~1.59% is the cohort maximum (>= head rung)',
    holds: () =>
      WIDENING_REL_ERR > 1.5e-2 &&
      WIDENING_REL_ERR < 1.7e-2 &&
      WIDENING_REL_ERR >= MAX_ROE_REL_ERR &&
      COHORT_MAX_SOURCE === 'SEPARATION_WIDENING factor',
  },
  {
    // (R3) The toExponential(4) scientific fields are three orders more accurate than the head rung.
    id: 'imp33926-scientific-fields-three-orders-more-accurate',
    description: 'toExponential(4) reporting error <= 5e-5, at least 100x below the head-rung toFixed(1)',
    holds: () => TOEXP4_REL_ERR_BOUND <= 5e-5 && MAX_ROE_REL_ERR / TOEXP4_REL_ERR_BOUND > 100,
  },
  {
    // (R4) Cohort max reporting error is ~1.59%, and every non-head rung is accurate to better than ~1.35%.
    id: 'imp33926-cohort-max-and-non-head-accuracy',
    description: 'cohort max ~1.59%; every non-head rung toFixed(1) rel err < 1.4e-2',
    holds: () =>
      COHORT_MAX_REL_ERR > 1.5e-2 &&
      COHORT_MAX_REL_ERR < 1.7e-2 &&
      AUDIT_RUNGS.slice(1).every((r) => r.roe_rel_err < 1.4e-2),
  },
  {
    // Honesty gate: measurement/reporting audit only, isRigorous false, no QED, PT SOTA.
    id: 'imp33926-honesty-gate-no-qed',
    description: 'Reporting audit only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP33926_IMP33810_REPORTING_PRECISION_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP33926_IMP33810_REPORTING_PRECISION_AUDIT.verdict) &&
      /remains SOTA/.test(IMP33926_IMP33810_REPORTING_PRECISION_AUDIT.verdict),
  },
];

for (const a of IMP33926_IMP33810_REPORTING_PRECISION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33926-imp33810-reporting-precision-audit assertion failed: ${a.id}`);
  }
}
