/**
 * @module imp-124772-knee-floor-elasticity-multifloor-fit
 *
 * imp-124772 (accuracy, frontier-direction): imp-97822 fit the bracketing-free pointwise sigma-ramp
 * knee floor-elasticity p_knee in N* ~ E_trunc^(p_knee) from ONLY the 0.5x and 2x floors (the
 * imp-33708 two-floor recipe), reading p_knee ~ -2.099 and declaring it matches the imp-33708
 * far-tail halving landmark exponent (~ -2.099) rather than the softer imp-33684 interior-peak
 * exponent (~ -1.375). A two-point fit cannot separate a clean power law from curvature: any two
 * (log E_trunc, log N*) points define an exact line, so the reported -2.099 is a chord slope with
 * zero residual by construction and no evidence the relation is actually a power law.
 *
 * This module CERTIFIES that exponent by re-using the imp-97822 bracketing-free knee locator across
 * the ENTIRE imp-33708 0.5x..5x floor ladder (all 10 factors, already computed and exported by
 * imp-97822) and fitting p_knee by ordinary least squares over the full set, then reporting the fit
 * residual so the clean dimensional ~ -2 scaling can be confirmed or refuted against the curvature
 * alternative and against the interior-peak ~ -1.375 contrast.
 *
 * THE FIT (no fresh model -- reuses the imp-97822 floorSweep verbatim)
 * -------------------------------------------------------------------
 * imp-97822 relocated the single pointwise curvature zero-crossing log10 N*(factor) for every floor
 * factor in {0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0}. Since N* ~ E_trunc^(p_knee) is
 * equivalent to log10 N* = p_knee * log10 E_trunc + const, the slope of an OLS line through the ten
 * (log10 E_trunc, log10 N*) points IS p_knee directly. We report:
 *   - the full 10-floor OLS slope p_knee_lsq,
 *   - the coefficient of determination R^2,
 *   - the RMS and max-abs residual in decades of log10 N*,
 *   - the per-floor residual pattern (a signed-curvature diagnostic).
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F0) THE FULL-SET OLS SLOPE CONFIRMS THE TWO-FLOOR VALUE. p_knee_lsq ~ -2.106 over all ten
 *        floors, within ~0.007 of the imp-97822 two-floor chord -2.099 -- the two-point fit was NOT
 *        materially contaminated by curvature.
 *   (F1) THE POWER LAW IS CLEAN. R^2 ~ 0.99999 with an RMS residual ~ 1.6e-3 decades and a max-abs
 *        residual ~ 3.0e-3 decades over a ~2.1-decade span of log10 N*: the (log E_trunc, log N*)
 *        relation is a straight line to ~1 part in 700 of its span, so N* ~ E_trunc^(-2.1) is a
 *        genuine power law, not curvature masquerading as one.
 *   (F2) A FAINT SYMMETRIC CURVATURE REMAINS. The residuals form a shallow, sign-symmetric U
 *        (negative at both floor extremes 0.5x/5x, positive in the interior), i.e. a tiny concave-up
 *        deviation ~ 3e-3 decades -- present but ~100x smaller than the 0.72-decade gap to the
 *        -1.375 interior-peak alternative, so it does not threaten the ~ -2 identification.
 *   (F3) CONFIRMED: TRACKS THE HALVING LANDMARK, NOT THE INTERIOR PEAK. p_knee_lsq ~ -2.106 sits
 *        with the imp-33708 sigma=0.5 far-tail halving exponent (~ -2.099) and is far steeper than
 *        the imp-33684 interior-peak exponent (~ -1.375): the full-set fit reproduces the imp-97822
 *        conclusion with a quantified residual rather than a bare two-point chord.
 *
 * VERDICT: the imp-97822 knee floor-elasticity p_knee ~ -2.099 is CERTIFIED by the full 10-floor OLS
 * fit (p_knee_lsq ~ -2.106, R^2 ~ 0.99999, RMS residual ~ 1.6e-3 decades). The clean dimensional
 * N* ~ E_trunc^(-2) scaling is confirmed and the softer imp-33684 interior-peak -1.375 is refuted;
 * a faint symmetric ~ 3e-3-decade curvature is present but negligible against the ~0.72 exponent gap.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (the two-floor knee fit p_knee ~ -2.099; floorSweep reused here)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor sweep; far-tail exponent ~ -2.099)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak floor exponent ~ -1.375, the SOFTER contrast)
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';

// Full imp-97822 floor ladder: {floorFactor, E_trunc, log10Nstar} per factor in {0.5..5}.
const SWEEP = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.floorSweep.filter((r) => r.log10Nstar !== null);

// OLS of log10 N* on log10 E_trunc. Slope = p_knee (N* ~ E_trunc^(p_knee)).
function olsFit(rows) {
  const xs = rows.map((r) => Math.log10(r.E_trunc));
  const ys = rows.map((r) => r.log10Nstar);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  let maxAbs = 0;
  const residuals = [];
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    const resid = ys[i] - pred;
    residuals.push({ floorFactor: rows[i].floorFactor, residualDecades: +resid.toFixed(5) });
    ssRes += resid * resid;
    maxAbs = Math.max(maxAbs, Math.abs(resid));
  }
  return {
    n,
    slope: +slope.toFixed(6),
    intercept: +intercept.toFixed(6),
    r2: +(1 - ssRes / syy).toFixed(8),
    rmsResidualDecades: +Math.sqrt(ssRes / n).toExponential(4),
    maxAbsResidualDecades: +maxAbs.toExponential(4),
    residuals,
  };
}

const FIT = olsFit(SWEEP);

// imp-97822 baked cross-reference literals (from its exponentComparison block).
const TWO_FLOOR_EXPONENT = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.kneeFloorExponent; // ~ -2.099
const FARTAIL_HALVING_EXPONENT =
  IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.exponentComparison.imp33708_fartail_halving_exponent; // ~ -2.099
const INTERIOR_PEAK_EXPONENT =
  IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.exponentComparison.imp33684_interior_peak_exponent; // ~ -1.375

const DELTA_TWO_FLOOR = +Math.abs(FIT.slope - TWO_FLOOR_EXPONENT).toFixed(4); // ~0.007
const DELTA_HALVING = +Math.abs(FIT.slope - FARTAIL_HALVING_EXPONENT).toFixed(4); // ~0.007
const GAP_TO_PEAK = +Math.abs(FIT.slope - INTERIOR_PEAK_EXPONENT).toFixed(4); // ~0.73

export const IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT = {
  id: 'imp-124772',
  proofSection: 'S-frontier',
  question:
    'imp-97822 fit the bracketing-free knee floor-elasticity p_knee in N* ~ E_trunc^(p_knee) from ' +
    'only the 0.5x and 2x floors (a two-point chord that cannot separate a power law from curvature). ' +
    'Re-locate the knee across the full imp-33708 0.5x..5x floor ladder and fit p_knee by least ' +
    'squares over all ten floors, reporting the fit residual to confirm or refute the clean ' +
    'dimensional ~ -2 scaling against the imp-33684 interior-peak ~ -1.375 contrast. Measurement/fit ' +
    'only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the OLS slope p_knee of log10 N* on log10 E_trunc over the full imp-97822 floorSweep (ten ' +
    'factors {0.5..5}), with R^2, RMS and max-abs residual in decades, and the per-floor residual ' +
    'pattern',
  fit: FIT,
  pKneeLsq: FIT.slope, // ~ -2.106
  twoFloorExponent: TWO_FLOOR_EXPONENT, // ~ -2.099 (imp-97822 chord)
  deltaTwoFloor: DELTA_TWO_FLOOR, // ~0.007
  exponentComparison: {
    p_knee_lsq_full_ladder: FIT.slope, // ~ -2.106
    imp97822_two_floor_chord: TWO_FLOOR_EXPONENT, // ~ -2.099
    imp33708_fartail_halving_exponent: FARTAIL_HALVING_EXPONENT, // ~ -2.099
    imp33684_interior_peak_exponent: INTERIOR_PEAK_EXPONENT, // ~ -1.375
    delta_to_halving: DELTA_HALVING, // ~0.007
    gap_to_interior_peak: GAP_TO_PEAK, // ~0.73
    note:
      'the full 10-floor OLS slope (~ -2.106) confirms the imp-97822 two-floor chord (~ -2.099) to ' +
      '~0.007 and tracks the imp-33708 far-tail halving exponent (~ -2.099), far steeper than the ' +
      'imp-33684 interior-peak exponent (~ -1.375); the ~0.73 gap to the peak dwarfs the residual',
  },
  finding: {
    F0_full_set_confirms_two_floor:
      'p_knee_lsq ~ -2.106 over all ten floors, within ~0.007 of the imp-97822 two-floor chord ' +
      '-2.099 -- the two-point fit was not materially contaminated by curvature.',
    F1_power_law_is_clean:
      'R^2 ~ 0.99999 with an RMS residual ~ 1.6e-3 decades and a max-abs residual ~ 3.0e-3 decades ' +
      'over a ~2.1-decade span of log10 N*: the (log E_trunc, log N*) relation is a straight line to ' +
      '~1 part in 700 of its span, so N* ~ E_trunc^(-2.1) is a genuine power law, not curvature.',
    F2_faint_symmetric_curvature:
      'the residuals form a shallow sign-symmetric U (negative at the 0.5x/5x extremes, positive in ' +
      'the interior) -- a tiny concave-up deviation ~ 3e-3 decades, present but ~100x smaller than ' +
      'the 0.72-decade exponent gap to the -1.375 interior-peak alternative.',
    F3_tracks_halving_not_peak:
      'p_knee_lsq ~ -2.106 sits with the imp-33708 sigma=0.5 far-tail halving exponent (~ -2.099) ' +
      'and is far steeper than the imp-33684 interior-peak exponent (~ -1.375): the full-set fit ' +
      'reproduces the imp-97822 conclusion with a quantified residual rather than a bare chord.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-97822 knee floor-elasticity ' +
    'p_knee ~ -2.099 is CERTIFIED by the full 10-floor OLS fit: p_knee_lsq ~ -2.106, R^2 ~ 0.99999, ' +
    'RMS residual ~ 1.6e-3 decades, max-abs residual ~ 3.0e-3 decades over a ~2.1-decade span. The ' +
    'clean dimensional N* ~ E_trunc^(-2) scaling is confirmed and the softer imp-33684 interior-peak ' +
    '-1.375 is refuted (a ~0.73 exponent gap); a faint sign-symmetric ~ 3e-3-decade curvature is ' +
    'present but negligible against that gap. The two-floor chord -2.099 was not materially ' +
    'contaminated by curvature (~0.007 from the full-set slope). The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97822 (two-floor knee fit p_knee ~ -2.099; floorSweep reused here); imp-33708 (0.5x..5x ' +
    'E_trunc floor sweep; far-tail sigma=0.5 exponent ~ -2.099); imp-33684 (interior-peak floor ' +
    'exponent ~ -1.375, the softer contrast); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT_ASSERTIONS = [
  {
    // Reuse gate: the full imp-97822 floor ladder resolved to ten single-crossing knees.
    id: 'imp124772-uses-full-ten-floor-ladder',
    description: 'the OLS fit runs over all ten imp-97822 floor factors with resolved knees',
    holds: () => FIT.n === 10,
  },
  {
    // F0: the full-set OLS slope confirms the imp-97822 two-floor chord to ~0.007.
    id: 'imp124772-lsq-slope-confirms-two-floor-chord',
    description: 'p_knee_lsq ~ -2.106 within 0.02 of the imp-97822 two-floor chord -2.099',
    holds: () => DELTA_TWO_FLOOR < 0.02,
  },
  {
    // F1: the power law is clean -- high R^2, tiny residual.
    id: 'imp124772-power-law-clean-high-r2',
    description: 'R^2 > 0.9999 and RMS residual < 5e-3 decades over the full ladder',
    holds: () => FIT.r2 > 0.9999 && FIT.rmsResidualDecades < 5e-3,
  },
  {
    // F3: p_knee_lsq matches the far-tail halving exponent and refutes the interior peak.
    id: 'imp124772-tracks-halving-refutes-peak',
    description: 'p_knee_lsq in [-2.2,-1.9], near the halving -2.099, far steeper than the peak -1.375',
    holds: () =>
      FIT.slope < -1.9 &&
      FIT.slope > -2.2 &&
      DELTA_HALVING < 0.05 &&
      FIT.slope < INTERIOR_PEAK_EXPONENT &&
      GAP_TO_PEAK > 0.5,
  },
  {
    // F2: the residual pattern is a sign-symmetric U (curvature present but negligible).
    id: 'imp124772-residuals-sign-symmetric-u',
    description: 'residuals are negative at both floor extremes and positive in the interior',
    holds: () => {
      const first = FIT.residuals[0].residualDecades;
      const last = FIT.residuals[FIT.residuals.length - 1].residualDecades;
      const mid = FIT.residuals[Math.floor(FIT.residuals.length / 2)].residualDecades;
      return first < 0 && last < 0 && mid > 0;
    },
  },
  {
    // Honesty gate: measurement/fit only, no QED, PT SOTA.
    id: 'imp124772-honesty-gate-no-qed',
    description: 'Measurement only: certifies p_knee ~ -2 via full-set LSQ, no QED, PT stays SOTA',
    holds: () =>
      IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.isRigorous === false &&
      /NO QED/.test(IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.verdict) &&
      /remains SOTA/.test(IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.verdict),
  },
];

for (const a of IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124772-knee-floor-elasticity-multifloor-fit assertion failed: ${a.id}`);
  }
}
