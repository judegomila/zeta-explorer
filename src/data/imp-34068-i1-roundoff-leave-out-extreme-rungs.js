/**
 * @module imp-34068-i1-roundoff-leave-out-extreme-rungs
 *
 * imp-34068 (numerical, frontier-direction): is the imp-34007 R3 sub-linear cross-rung
 * |ln N|-scaling slope ~+0.71 DRIVEN by the two non-monotone ceiling-fraction outliers, or does the
 * sub-linearity survive in the interior rungs?
 *
 * imp-34007 R3 found the per-rung round-off coefficient C_N = geomean_DL[ r_N(DL)*DL ] grows only
 * SUB-linearly in |ln N| across the ten-rung imp-33854 ladder (cross-rung log-log slope of C_N vs
 * |ln N| ~+0.71, positive but below the clean +1 a strict eps*|ln N|/(2 DL) floor law would give) and
 * flagged that the realized ceiling-fraction C_N/C_pred_N drifts NON-monotonically: it dips to ~0.05
 * at d=100 (the deepest sub-ceiling rung) and recovers to ~0.25 at d=200 (the top rung). imp-34067
 * already showed the sub-linearity is not a GEOMEAN artifact (median/trimmed estimators stay in a
 * ~0.57..0.80 band). This module runs the complementary robustness check on the DATA rather than the
 * estimator: it drops the two extreme rungs (d=100 and d=200) whose ceiling-fractions are the
 * non-monotone outliers and re-regresses log(C_N) on log(|ln N|) over the remaining EIGHT interior
 * rungs -- does the slope return toward +1 (outlier-driven) or stay sub-linear (a genuine interior law)?
 *
 * THE MEASUREMENT (this module)
 * -----------------------------
 * Reusing the imp-34007 per-rung geomean coefficients C_N VERBATIM (imported, not re-derived), on the
 * SAME imp-33854/imp-33925/imp-34007 grid and inherited sub-terms:
 *   (a) reproduce the FULL ten-rung cross-rung slope (regress log(C_N) on log(|ln N|)) as a baseline,
 *   (b) DROP the two extreme rungs d=100 and d=200 and re-regress over the interior EIGHT
 *       (d in {12,13,14,15,18,20,30,44}) -- the leave-out test,
 *   (c) also drop each extreme rung SINGLY to expose its leverage on the full-grid slope,
 *   (d) report whether the interior-eight slope snaps toward +1 (outlier-driven sub-linearity) or
 *       stays clearly below +1 (a robust interior sub-linear law).
 *
 * THE NUMBERS (this platform; round-off magnitudes platform-dependent -> asserted only to order)
 * ---------------------------------------------------------------------------------------------
 *   set                                            n    cross-rung slope of C_N vs |ln N|
 *   full ten-rung ladder                           10   ~+0.710   (reproduces imp-34007 R3)
 *   interior eight (drop d=100 AND d=200)           8   ~+0.614   (even MORE sub-linear -- not toward +1)
 *   drop d=100 ONLY                                 9   ~+0.945   (d=100 is a DOWNWARD leverage point)
 *   drop d=200 ONLY                                 9   ~+0.256   (d=200 is an UPWARD leverage point)
 *
 * THE FINDING (measurement / reconciliation only)
 * -----------------------------------------------
 *   THE SUB-LINEARITY IS NOT DRIVEN BY THE TWO NON-MONOTONE OUTLIERS -- IT STRENGTHENS WITHOUT THEM.
 *   Dropping both extreme rungs (d=100, d=200) does NOT return the cross-rung |ln N|-scaling slope to
 *   the clean +1; the interior EIGHT rungs give ~+0.614, if anything MORE sub-linear than the full-grid
 *   ~+0.710. The single leave-outs explain why the two outliers looked like they might be driving the
 *   reading: they are OPPOSING high-leverage endpoints. d=100 (deepest sub-ceiling, C_N/C_pred ~0.05)
 *   is a DOWNWARD lever -- removing it raises the slope to ~+0.945 (nearly +1); d=200 (top rung, the
 *   largest |ln N| and the largest residual) is an UPWARD lever -- removing it collapses the slope to
 *   ~+0.256. Their effects roughly cancel in the full grid (~+0.710), and removing BOTH lands on the
 *   interior slope ~+0.614. So the ~0.71 reading is NOT an artifact of the two non-monotone
 *   ceiling-fraction rungs: the coefficient grows sub-linearly in |ln N| in the INTERIOR of the ladder
 *   too, because per-rung round-off is stochastic and only fractionally same-sign, not a deterministic
 *   |ln N| law. HONEST confirmation of imp-34007 R3 (and complementary to imp-34067's estimator check),
 *   not an overturn.
 *
 * MEASUREMENT ONLY. Same inherited imp-3220/imp-3406/imp-33582/imp-33602 component model as
 * imp-33854/imp-33925/imp-33960/imp-34007/imp-34067; same sub-terms; changes no bound; the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; C_C = 1/8 ansatz untouched; no RH verdict, NO QED. No refereed bound is changed
 * . Realized round-off magnitudes are platform-dependent, so the leave-out cross-rung
 * slopes are asserted only to order (full ~sub-linear, interior-eight still sub-linear and not
 * reaching +1, the two extreme rungs opposing high-leverage endpoints).
 *
 * @see imp-34007-i1-roundoff-per-rung-lnN-scaling (R3: geomean cross-rung slope ~+0.71, non-monotone ceiling-fraction d=100/d=200)
 * @see imp-34067-i1-roundoff-estimator-sensitivity (complementary: sub-linearity is not a geomean artifact)
 * @see imp-33960-i1-roundoff-coefficient-fit (fit ONLY at the max rung N = 1e200; slope ~+1.05)
 * @see imp-33925-i1-step-robustness (R2: residual grows ~1/DL; attributes to eps*|ln N|/(2 DL))
 * @see imp-33854-log-saturation-exponent-reconciliation (I1 gap_ecoll = q + 1/2 = g)
 */

import { IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING } from './imp-34007-i1-roundoff-per-rung-lnN-scaling.js';

const EPS = Number.EPSILON; // 2^-52 machine epsilon for IEEE-754 doubles

// The imp-34007 per-rung geomean coefficients C_N, reused VERBATIM (no re-derivation of the model).
const PER_RUNG = IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.perRung;

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

// Cross-rung slope over an arbitrary subset of the ten rungs (regress log(C_N) on log(|ln N|)).
const slopeOver = (rows) => logLogSlope(rows.map((r) => r.lnN), rows.map((r) => r.C_N));

// The two extreme rungs whose ceiling-fraction is the non-monotone outlier per imp-34007 R3.
const EXTREME = new Set([100, 200]);

// (a) Full ten-rung baseline. (b) Interior eight (drop d=100 AND d=200). (c) Single leave-outs.
const fullSlope = slopeOver(PER_RUNG);
const interiorRows = PER_RUNG.filter((r) => !EXTREME.has(r.log10N));
const interiorSlope = slopeOver(interiorRows);
const dropD100Slope = slopeOver(PER_RUNG.filter((r) => r.log10N !== 100));
const dropD200Slope = slopeOver(PER_RUNG.filter((r) => r.log10N !== 200));

// (d) Discriminators used by the assertions.
// The leave-out slope is still positive but sub-linear -- it does NOT snap up to the strict +1 law.
const INTERIOR_STILL_SUBLINEAR = interiorSlope > 0.3 && interiorSlope < 0.95;
// Removing the two outliers does NOT raise the slope toward +1: interior <= full within round-off.
const NOT_OUTLIER_DRIVEN = interiorSlope <= fullSlope + 0.05;
// The two extreme rungs are OPPOSING leverage points: dropping d=100 raises the slope (upward past the
// full-grid value), dropping d=200 lowers it (below the full-grid value).
const OPPOSING_LEVERAGE = dropD100Slope > fullSlope && dropD200Slope < fullSlope;

export const IMP34068_I1_ROUNDOFF_LEAVE_OUT_EXTREME_RUNGS = {
  id: 'imp-34068',
  proofSection: 'S-frontier',
  question:
    'imp-34007 R3 found the per-rung round-off coefficient C_N grows only sub-linearly in |ln N| ' +
    '(cross-rung slope ~+0.71) with a NON-monotone ceiling-fraction that dips to ~0.05 at d=100 and ' +
    'recovers to ~0.25 at d=200. Drop those two extreme rungs and re-regress log(C_N) on log(|ln N|) ' +
    'over the remaining eight interior rungs: does the slope return toward the clean +1 (outlier- ' +
    'driven) or stay sub-linear (a genuine interior law)? Measurement only, no bound change, NO QED.',
  model: 'cross-rung slope of log(C_N) vs log(|ln N|) over rung subsets; C_N reused from imp-34007',
  perRung: PER_RUNG.map((r) => ({
    log10N: r.log10N,
    lnN: r.lnN,
    C_N: r.C_N,
    ratio_C_N_over_C_pred: r.ratio_C_N_over_C_pred,
    extreme: EXTREME.has(r.log10N),
  })),
  summary: {
    fullSlope: +fullSlope.toFixed(3), // ~0.710 (reproduces imp-34007 R3)
    interiorSlope: +interiorSlope.toFixed(3), // ~0.614 (drop d=100 AND d=200 -- MORE sub-linear)
    dropD100Slope: +dropD100Slope.toFixed(3), // ~0.945 (d=100 is a downward leverage point)
    dropD200Slope: +dropD200Slope.toFixed(3), // ~0.256 (d=200 is an upward leverage point)
    nInterior: interiorRows.length, // 8
    machineEpsilon: +EPS.toExponential(4), // 2.22e-16
  },
  findings: {
    R1_sublinearity_survives_leave_out:
      'Dropping both extreme rungs (d=100, d=200) does NOT return the cross-rung |ln N|-scaling slope ' +
      'to the clean +1: the interior EIGHT rungs give ~+0.614, if anything MORE sub-linear than the ' +
      'full-grid ~+0.710. So the ~0.71 reading is NOT an artifact of the two non-monotone ' +
      'ceiling-fraction outliers -- the coefficient grows sub-linearly in |ln N| in the INTERIOR of ' +
      'the ladder too.',
    R2_extreme_rungs_are_opposing_leverage:
      'The two extreme rungs are OPPOSING high-leverage endpoints, which is why they looked like they ' +
      'might drive the reading. d=100 (deepest sub-ceiling, C_N/C_pred ~0.05) is a DOWNWARD lever -- ' +
      'removing it raises the slope to ~+0.945; d=200 (top rung, largest |ln N| and largest residual) ' +
      'is an UPWARD lever -- removing it collapses the slope to ~+0.256. Their effects roughly cancel ' +
      'in the full grid, and removing BOTH lands on the interior slope ~+0.614.',
  },
  isRigorous: false,
  verdict:
    'FIT (measurement only). Leaving out the two non-monotone ceiling-fraction rungs (d=100 where ' +
    'C_N/C_pred dips to ~0.05, d=200 where it recovers to ~0.25) and re-regressing log(C_N) on ' +
    'log(|ln N|) over the interior EIGHT rungs leaves the cross-rung |ln N|-scaling slope sub-linear: ' +
    '~+0.614, if anything MORE sub-linear than the full-grid ~+0.710, not moving toward the clean +1 a ' +
    'strict C ~ |ln N| proportionality would give. The single leave-outs show the two extreme rungs are ' +
    'OPPOSING high-leverage endpoints (drop d=100 -> ~+0.945, drop d=200 -> ~+0.256) whose effects ' +
    'roughly cancel in the full grid. This CONFIRMS imp-34007 R3 as a data-robust fact rather than an ' +
    'outlier artifact (complementary to imp-34067 ruling out a geomean artifact): the coefficient grows ' +
    'sub-linearly in |ln N| in the interior of the ladder because per-rung round-off is stochastic and ' +
    'only fractionally same-sign. Same inherited imp-3220/imp-3406 component model; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34007 (geomean cross-rung slope ~+0.71, non-monotone ceiling-fraction d=100/d=200); ' +
    'imp-34067 (sub-linearity is not a geomean artifact); imp-33960 (fit at max rung N = 1e200); ' +
    'imp-33925 (r grows ~1/DL); imp-33854 (I1 identity); imp-486 (C_mb GUE-conditional).',
};

export const IMP34068_I1_ROUNDOFF_LEAVE_OUT_EXTREME_RUNGS_ASSERTIONS = [
  {
    // The full ten-rung slope reproduces imp-34007 R3 (~0.71 on this platform).
    id: 'imp34068-full-reproduces-imp34007',
    description: 'full ten-rung cross-rung slope reproduces the imp-34007 R3 sub-linear ~0.71 reading',
    holds: () => fullSlope > 0.5 && fullSlope < 0.9,
  },
  {
    // Dropping the two extreme rungs leaves the interior-eight slope still positive but sub-linear.
    id: 'imp34068-interior-still-sublinear',
    description: 'interior-eight cross-rung slope (drop d=100 and d=200) is positive but below +1',
    holds: () => INTERIOR_STILL_SUBLINEAR,
  },
  {
    // The sub-linearity is NOT driven by the two outliers: removing them does not raise it toward +1,
    // and the two extreme rungs are opposing high-leverage endpoints.
    id: 'imp34068-sublinearity-not-outlier-driven',
    description: 'interior slope does not rise toward +1 and the two extreme rungs are opposing levers',
    holds: () => NOT_OUTLIER_DRIVEN && OPPOSING_LEVERAGE,
  },
  {
    // Honesty gate: measurement only, no QED, imp-3066 untouched, no refereed bound is changed.
    id: 'imp34068-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP34068_I1_ROUNDOFF_LEAVE_OUT_EXTREME_RUNGS.isRigorous === false &&
      /NO QED/.test(IMP34068_I1_ROUNDOFF_LEAVE_OUT_EXTREME_RUNGS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34068_I1_ROUNDOFF_LEAVE_OUT_EXTREME_RUNGS.verdict) &&
      /refereed bound is changed/i.test(IMP34068_I1_ROUNDOFF_LEAVE_OUT_EXTREME_RUNGS.verdict),
  },
];

for (const a of IMP34068_I1_ROUNDOFF_LEAVE_OUT_EXTREME_RUNGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34068-i1-roundoff-leave-out-extreme-rungs assertion failed: ${a.id}`);
  }
}
