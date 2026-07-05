/**
 * @module imp-34007-i1-roundoff-per-rung-lnN-scaling
 *
 * imp-34007 (numerical, frontier-direction): does the imp-33960 round-off cancellation floor
 * r(DL) ~ eps*|ln N|/(2 DL) hold PER RUNG, and does the fitted coefficient track |ln N| ACROSS rungs?
 *
 * imp-33960 fit the I1-residual round-off floor ONLY at the max-residual rung N = 1e200 (largest
 * |ln N|), where it found the log-log slope of r vs 1/DL ~ +1.05 and a coefficient C_fit ~ 0.18..0.26
 * of the predicted ceiling C_pred = eps*|ln N|/2. It NEVER checked the |ln N|-scaling ACROSS rungs:
 * the max-over-grid always lands on N = 1e200, so imp-33960 R3 "|ln N|-scaling confirmed" is really
 * only a single-rung, worst-case reading. This module opens the aggregate up rung by rung.
 *
 * THE MEASUREMENT (this module)
 * -----------------------------
 * On the SAME imp-33854/imp-33925 grid and inherited sub-terms, for EACH rung N = 1e^d separately:
 *   (a) recompute the per-rung I1 residual r_N(DL) over the same FIVE steps
 *       DL in {1e-2, 1e-3, 1e-4, 1e-5, 1e-6},
 *   (b) fit the per-rung log-log slope of r_N against 1/DL (predict ~ +1 at every rung if the
 *       round-off floor is a per-rung phenomenon, not just an aggregate max artifact),
 *   (c) form the per-rung coefficient C_N = geomean_DL[ r_N(DL) * DL ] (robust central estimate,
 *       round-off being stochastic per step) and compare it to the per-rung ceiling
 *       C_pred_N = eps*|ln N|/2,
 *   (d) TEST THE |ln N|-PROPORTIONALITY the floor law predicts: regress log(C_N) on log(|ln N|)
 *       across the ten rungs -- a clean C ~ |ln N| law gives cross-rung slope ~ +1.
 *
 * THE NUMBERS (per-rung, this platform; round-off magnitudes platform-dependent -> asserted to order)
 * ---------------------------------------------------------------------------------------------------
 *   d(=log10 N)  |ln N|   per-rung slope   C_N=geomean(r*DL)   C_pred_N=eps|lnN|/2   C_N/C_pred
 *   12            27.63    1.00             5.16e-16            3.07e-15              0.168
 *   13            29.93    0.95             5.06e-16            3.32e-15              0.152
 *   14            32.24    0.99             1.34e-15            3.58e-15              0.375
 *   15            34.54    0.98             1.09e-15            3.83e-15              0.283
 *   18            41.45    1.05             1.57e-15            4.60e-15              0.340
 *   20            46.05    1.08             1.34e-15            5.11e-15              0.262
 *   30            69.08    0.94             2.02e-15            7.67e-15              0.264
 *   44           101.31    0.77             1.13e-15            1.13e-14              0.100
 *   100          230.26    0.99             1.17e-15            2.56e-14              0.046
 *   200          460.52    1.05             1.26e-14            5.11e-14              0.246
 *   median per-rung log-log slope (r vs 1/DL)             ~ 0.99   (round-off ~1/DL at EVERY rung)
 *   cross-rung log-log slope of C_N vs |ln N|             ~ 0.71   (positive, but BELOW the clean +1)
 *   C_N/C_pred_N range                                   ~ 0.046..0.375   (sub-ceiling at EVERY rung)
 *
 * THE FINDINGS (measurement / reconciliation only)
 * ------------------------------------------------
 *   (R1) THE ~1/DL ROUND-OFF SLOPE IS A PER-RUNG PROPERTY. Every rung -- not just N = 1e200 --
 *        shows a per-rung log-log slope of r_N vs 1/DL clustered around +1 (median ~0.99, range
 *        ~0.77..1.08), so the eps*|ln N|/(2 DL) cancellation floor governs each rung individually,
 *        not merely the grid maximum. This generalizes imp-33960 R1/R3 from the single dominant
 *        rung to the whole 1e12..1e200 ladder.
 *   (R2) THE eps*|ln N|/2 CEILING IS RESPECTED RUNG BY RUNG. At every rung the per-rung coefficient
 *        C_N sits BELOW its own per-rung ceiling C_pred_N = eps*|ln N|/2 (ratio ~0.05..0.38), so the
 *        machine-epsilon worst-case model holds locally, not just for the aggregate max. imp-33960 R2
 *        (sub-ceiling by ~0.18..0.26 at N = 1e200) is confirmed as a per-rung, not a lucky-rung, fact.
 *   (R3) THE |ln N|-PROPORTIONALITY IS ONLY APPROXIMATE / SUB-LINEAR ACROSS RUNGS. The cross-rung
 *        log-log slope of C_N vs |ln N| is ~ +0.71 -- POSITIVE (coefficient does grow with |ln N|,
 *        the sign the floor law predicts) but distinctly BELOW the clean +1 a strict C ~ |ln N|
 *        proportionality would give, and the realized ceiling-fraction C_N/C_pred_N drifts non-
 *        monotonically (dips to ~0.05 at d=100, recovers to ~0.25 at d=200). So imp-33960 R3
 *        "|ln N|-scaling confirmed" is an AGGREGATE / worst-rung reading: the ordering (largest
 *        |ln N| carries the largest residual) holds, but the coefficient grows SUB-linearly in
 *        |ln N| rung by rung, because per-rung round-off is stochastic and only fractionally
 *        same-sign, not a deterministic |ln N| law. HONEST SCOPE narrowing, not an overturn.
 *
 * MEASUREMENT ONLY. Same inherited imp-3220/imp-3406/imp-33582/imp-33602 component model as
 * imp-33854/imp-33925/imp-33960; same sub-terms; changes no bound; the C_mb GUE-conditional share per
 * imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_C = 1/8
 * ansatz untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA. Realized
 * round-off magnitudes are platform-dependent, so per-rung slopes and coefficients are asserted only
 * to order (per-rung slope near +1, C_N sub-ceiling, cross-rung slope positive but below +1).
 *
 * @see imp-33960-i1-roundoff-coefficient-fit (fit ONLY at the max rung N = 1e200; slope ~+1.05, C_fit ~0.18..0.26 of ceiling)
 * @see imp-33925-i1-step-robustness (R2: residual grows ~1/DL; attributes to eps*|ln N|/(2 DL))
 * @see imp-33854-log-saturation-exponent-reconciliation (I1 gap_ecoll = q + 1/2 = g)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5;
const EPS = Number.EPSILON; // 2^-52 machine epsilon for IEEE-754 doubles

// EXACT imp-33925/imp-33854/imp-33960 sub-terms, in log-N space (identical model, no re-derivation).
function parts(lnN) {
  const N = Math.exp(lnN);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { L, E_coll };
}

const lnEcollAt = (lnN) => Math.log(parts(lnN).E_coll);
const lnLogT0At = (lnN) => Math.log(parts(lnN).L);

// I1 identity residual |gap_ecoll - g| at a given step DL (verbatim imp-33925/imp-33960 central diff).
function i1ResidualAtLog10(d, DL) {
  const lnN = d * Math.LN10;
  const q = (lnEcollAt(lnN + DL) - lnEcollAt(lnN - DL)) / (2 * DL);
  const gapEcoll = q + HALF;
  const g = 0.5 * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
  return Math.abs(gapEcoll - g);
}

// The imp-33854/imp-33925/imp-33960 shared grid and the SAME five-step sweep, now applied PER RUNG.
const SHARED_GRID = [12, 13, 14, 15, 18, 20, 30, 44, 100, 200];
const STEPS = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6];

// Ordinary-least-squares log-log slope of ys against xs (both strictly positive).
function logLogSlope(xs, ys) {
  const lx = xs.map(Math.log);
  const ly = ys.map(Math.log);
  const n = lx.length;
  const mx = lx.reduce((a, b) => a + b, 0) / n;
  const my = ly.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (lx[i] - mx) * (ly[i] - my);
    sxx += (lx[i] - mx) * (lx[i] - mx);
  }
  return sxy / sxx;
}

// (a)-(c) Per-rung sweep: residuals over the five steps, the per-rung log-log slope of r vs 1/DL,
// the robust per-rung coefficient C_N = geomean(r*DL), its per-rung ceiling, and the ratio.
const invSteps = STEPS.map((DL) => 1 / DL);
const PER_RUNG = SHARED_GRID.map((d) => {
  const residuals = STEPS.map((DL) => i1ResidualAtLog10(d, DL));
  const perRungSlope = logLogSlope(invSteps, residuals);
  const perPoint = STEPS.map((DL, i) => residuals[i] * DL); // r(DL)*DL ~ eps*|ln N|/2
  const C_N = Math.exp(perPoint.map(Math.log).reduce((a, b) => a + b, 0) / perPoint.length);
  const lnN = d * Math.LN10;
  const C_pred_N = (EPS * lnN) / 2;
  return {
    log10N: d,
    lnN: +lnN.toFixed(2),
    perRungSlope: +perRungSlope.toFixed(3),
    C_N: +C_N.toExponential(3),
    C_pred_N: +C_pred_N.toExponential(3),
    ratio_C_N_over_C_pred: +(C_N / C_pred_N).toFixed(3),
    residuals: residuals.map((r) => +r.toExponential(3)),
  };
});

// (d) Cross-rung |ln N|-proportionality test: regress log(C_N) on log(|ln N|) over the ten rungs.
// A strict C ~ |ln N| law gives cross-rung slope ~ +1; a positive-but-smaller slope means the
// coefficient grows SUB-linearly in |ln N| (the honest correction to imp-33960 R3).
const lnNvals = PER_RUNG.map((r) => r.lnN);
const CNvals = PER_RUNG.map((r) => r.C_N);
const crossRungLnNSlope = logLogSlope(lnNvals, CNvals);

// Robust central summary of the per-rung slopes (median: round-off makes individual rungs noisy).
const sortedSlopes = PER_RUNG.map((r) => r.perRungSlope).sort((a, b) => a - b);
const medianPerRungSlope =
  sortedSlopes.length % 2 === 1
    ? sortedSlopes[(sortedSlopes.length - 1) / 2]
    : (sortedSlopes[sortedSlopes.length / 2 - 1] + sortedSlopes[sortedSlopes.length / 2]) / 2;

// Discriminators used by the assertions below.
const RUNGS_WITH_ROUNDOFF_SLOPE = PER_RUNG.filter(
  (r) => r.perRungSlope > 0.6 && r.perRungSlope < 1.35,
).length; // per-rung ~1/DL round-off signature (wide window: round-off is noisy per rung)
const SLOPE_IS_PER_RUNG_ROUNDOFF =
  medianPerRungSlope > 0.85 && medianPerRungSlope < 1.15 && RUNGS_WITH_ROUNDOFF_SLOPE >= 8;
const CEILING_RESPECTED_EVERY_RUNG = PER_RUNG.every(
  (r) => r.ratio_C_N_over_C_pred > 0.01 && r.ratio_C_N_over_C_pred < 0.9,
); // C_N sub-ceiling at every rung (below the eps*|ln N|/2 full-ULP worst case)
const LNN_SCALING_POSITIVE_BUT_SUBLINEAR = crossRungLnNSlope > 0.3 && crossRungLnNSlope < 1.0;

export const IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING = {
  id: 'imp-34007',
  proofSection: 'S-frontier',
  question:
    'imp-33960 fit the I1 round-off floor r(DL) ~ eps*|ln N|/(2 DL) ONLY at the max rung N = 1e200 ' +
    'and never checked the |ln N|-scaling ACROSS rungs. Recompute the per-rung r_N(DL) over five ' +
    'steps at each grid rung, fit the per-rung log-log slope of r_N vs 1/DL, and test whether the ' +
    'fitted coefficient C_N tracks eps*|ln N|/2 as N varies. Measurement only, no bound change, NO QED.',
  model: 'r_N(DL) ~ C_N / DL per rung, with predicted per-rung ceiling C_pred_N = eps*|ln N|/2',
  perRung: PER_RUNG,
  summary: {
    medianPerRungSlope: +medianPerRungSlope.toFixed(3), // ~0.99 => r ~ 1/DL at EVERY rung
    rungsWithRoundoffSlope: RUNGS_WITH_ROUNDOFF_SLOPE, // out of 10
    crossRungLnNSlope: +crossRungLnNSlope.toFixed(3), // ~0.71: positive but BELOW the clean +1
    ratioRangeLow: Math.min(...PER_RUNG.map((r) => r.ratio_C_N_over_C_pred)), // ~0.046
    ratioRangeHigh: Math.max(...PER_RUNG.map((r) => r.ratio_C_N_over_C_pred)), // ~0.375
    machineEpsilon: +EPS.toExponential(4), // 2.22e-16
  },
  findings: {
    R1_slope_is_per_rung_roundoff:
      'Every rung -- not just N = 1e200 -- shows a per-rung log-log slope of r_N vs 1/DL clustered ' +
      'around +1 (median ~0.99, range ~0.77..1.08), so the eps*|ln N|/(2 DL) cancellation floor ' +
      'governs each rung individually. Generalizes imp-33960 R1/R3 from the single dominant rung to ' +
      'the whole 1e12..1e200 ladder.',
    R2_ceiling_respected_every_rung:
      'At every rung the per-rung coefficient C_N sits BELOW its own ceiling C_pred_N = eps*|ln N|/2 ' +
      '(ratio ~0.05..0.38), so the machine-epsilon worst-case model holds locally, not just for the ' +
      'aggregate max. imp-33960 R2 (sub-ceiling by ~0.18..0.26 at N = 1e200) is confirmed as a ' +
      'per-rung, not a lucky-rung, fact.',
    R3_lnN_scaling_positive_but_sublinear:
      'The cross-rung log-log slope of C_N vs |ln N| is ~+0.71 -- positive (coefficient does grow ' +
      'with |ln N|, as the floor law predicts) but distinctly BELOW the clean +1 of a strict ' +
      'C ~ |ln N| proportionality, and the ceiling-fraction C_N/C_pred_N drifts non-monotonically ' +
      '(dips to ~0.05 at d=100, recovers to ~0.25 at d=200). So imp-33960 R3 "|ln N|-scaling ' +
      'confirmed" is an aggregate / worst-rung reading: the ordering holds, but the coefficient grows ' +
      'SUB-linearly in |ln N| rung by rung because per-rung round-off is stochastic and only ' +
      'fractionally same-sign, not a deterministic |ln N| law.',
  },
  isRigorous: false,
  verdict:
    'FIT (measurement only). Per rung on the shared imp-33854 grid, the I1 residual r_N(DL) scales ' +
    'as ~1/DL at EVERY rung (median per-rung log-log slope ~0.99, range ~0.77..1.08), and the ' +
    'per-rung coefficient C_N = geomean(r*DL) sits below its own ceiling C_pred_N = eps*|ln N|/2 at ' +
    'every rung (ratio ~0.05..0.38). But the coefficient grows only SUB-linearly in |ln N| across ' +
    'rungs: the cross-rung log-log slope of C_N vs |ln N| is ~+0.71, positive but below the clean +1 ' +
    'a strict proportionality would give, with a non-monotone ceiling-fraction. This confirms ' +
    'imp-33960 R1/R2 as per-rung facts while narrowing R3: the |ln N|-scaling is an aggregate / ' +
    'worst-rung ordering, not a tight per-rung law. Same inherited imp-3220/imp-3406 component model; ' +
    'the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33960 (fit ONLY at max rung N = 1e200; slope ~+1.05, C_fit ~0.18..0.26 of ceiling); ' +
    'imp-33925 (r grows ~1/DL); imp-33854 (I1 identity); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping.',
};

export const IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING_ASSERTIONS = [
  {
    // (R1) The ~1/DL round-off slope is a PER-RUNG property (median near +1, >=8 of 10 rungs in band).
    id: 'imp34007-per-rung-slope-is-roundoff',
    description: 'median per-rung log-log slope of r vs 1/DL near +1 and >=8/10 rungs in (0.6,1.35)',
    holds: () => SLOPE_IS_PER_RUNG_ROUNDOFF,
  },
  {
    // (R2) The eps*|ln N|/2 ceiling is respected at every rung (C_N sub-ceiling everywhere).
    id: 'imp34007-ceiling-respected-every-rung',
    description: 'per-rung coefficient C_N is below its own ceiling eps*|ln N|/2 at every rung',
    holds: () => CEILING_RESPECTED_EVERY_RUNG,
  },
  {
    // (R3) Cross-rung |ln N|-scaling is POSITIVE but SUB-linear (slope in (0.3,1.0), not the clean +1).
    id: 'imp34007-lnN-scaling-positive-but-sublinear',
    description: 'cross-rung log-log slope of C_N vs |ln N| is positive but below the clean +1',
    holds: () => LNN_SCALING_POSITIVE_BUT_SUBLINEAR,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp34007-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.isRigorous === false &&
      /NO QED/.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict) &&
      /remains SOTA/.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict),
  },
];

for (const a of IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34007-i1-roundoff-per-rung-lnN-scaling assertion failed: ${a.id}`);
  }
}
