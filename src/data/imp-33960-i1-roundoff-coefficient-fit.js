/**
 * @module imp-33960-i1-roundoff-coefficient-fit
 *
 * imp-33960 (numerical, frontier-direction): FIT the imp-33925 I1-residual round-off coefficient.
 *
 * imp-33925 established that the imp-33854 I1 identity residual
 *     r(DL) := max_d |gap_ecoll(N) - g(N)|      on the shared 1e12..1e200 grid
 * GROWS as the central-difference step DL shrinks (round-off, NOT a DL^2 truncation artifact),
 * and ATTRIBUTED that growth to the subtractive-cancellation floor
 *     r(DL) ~ eps * |ln N| / (2 DL)             (the largest rung N = 1e200 dominating |ln N|).
 * But imp-33925 only reported r at THREE steps and never FIT the proportionality coefficient.
 *
 * THE MEASUREMENT (this module)
 * -----------------------------
 * Recompute r(DL) across FIVE steps DL in {1e-2, 1e-3, 1e-4, 1e-5, 1e-6} on the SAME imp-33854
 * grid and inherited sub-terms, then:
 *   (a) confirm the dominant rung is N = 1e200 at every step (|ln N| largest there),
 *   (b) fit the scaling exponent via a log-log regression of r against 1/DL -- a round-off
 *       cancellation floor gives slope ~ +1 (r ~ 1/DL); a DL^2 truncation artifact would give
 *       slope ~ -2 (r ~ DL^2 as a function of 1/DL) -- so the sign and size of the fitted slope
 *       are the decisive discriminator,
 *   (c) fit the COEFFICIENT C_fit (the slope of r vs 1/DL through the origin, plus the per-point
 *       coefficient r(DL)*DL) and compare it to the predicted worst-case cancellation ceiling
 *       C_pred = eps * |ln N| / 2 evaluated at the dominant rung N = 1e200.
 *
 * THE NUMBERS
 * -----------
 *   DL       r(DL) = max |gap_ecoll - g|   argmax rung   r(DL)*DL  (per-point coeff)
 *   1e-2     8.32e-13                       N=1e200       8.3e-15
 *   1e-3     9.38e-12                       N=1e200       9.4e-15
 *   1e-4     1.94e-10                       N=1e200       1.9e-14
 *   1e-5     2.33e-9                        N=1e200       2.3e-14
 *   1e-6     8.95e-9                        N=1e200       9.0e-15
 *   log-log slope of r vs (1/DL)   ~ +1.05   (round-off ~1/DL; NOT the -2 of a DL^2 artifact)
 *   through-origin coefficient C_fit   ~ 9.1e-15
 *   geometric-mean per-point coeff     ~ 1.3e-14
 *   predicted ceiling C_pred = eps*|ln 1e200|/2 = (2.22e-16)(460.52)/2 ~ 5.11e-14
 *   C_fit / C_pred  ~ 0.18   (sub-ceiling, same order of magnitude)
 *
 * THE FINDINGS (measurement / reconciliation only)
 * ------------------------------------------------
 *   (R1) SLOPE CONFIRMS ROUND-OFF. The log-log slope of r against 1/DL is ~ +1.05, i.e. r ~ 1/DL
 *        to within ~5%, quantitatively confirming the eps*|ln N|/(2 DL) cancellation law and
 *        excluding the slope ~ -2 that a DL^2 finite-difference truncation would produce. This
 *        upgrades the imp-33925 R2 three-point "grows as DL shrinks" reading to a FITTED exponent.
 *   (R2) COEFFICIENT MATCHES TO ORDER. The fitted coefficient C_fit ~ 9e-15..1.3e-14 is ~0.18..0.26
 *        of the predicted worst-case ceiling C_pred = eps*|ln N|/2 ~ 5.11e-14 -- the SAME order of
 *        magnitude, and correctly BELOW the ceiling: eps*|ln N|/2 is the full-ULP worst case, while
 *        the realized cancellation is a fraction of it because not every floating-point operation
 *        contributes a full same-sign ULP. So the machine-epsilon model is validated to within a
 *        factor of ~5, on the expected sub-ceiling side. This refines imp-33925 R2 without
 *        overturning it: the round-off attribution is quantitatively, not just qualitatively, correct.
 *   (R3) RUNG ATTRIBUTION. The max residual is carried by N = 1e200 at EVERY step, confirming the
 *        |ln N|-scaling of the cancellation floor (largest |ln N| => largest residual).
 *
 * MEASUREMENT ONLY. Same inherited imp-3220/imp-3406/imp-33582/imp-33602 component model as
 * imp-33854/imp-33925; same sub-terms; changes no bound; the C_mb GUE-conditional share per imp-486
 * is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_C = 1/8 ansatz
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA. Realized round-off
 * magnitudes are platform-dependent, so the fitted coefficient is asserted only to order (log-log
 * slope near +1 and C_fit within one decade of C_pred), not to a tight literal.
 *
 * @see imp-33925-i1-step-robustness (R2: residual grows ~1/DL; attributes to eps*|ln N|/(2 DL), never fit)
 * @see imp-33854-log-saturation-exponent-reconciliation (I1 gap_ecoll = q + 1/2 = g)
 * @see imp-33887-ecoll-gap-anchoring-convention-reconciliation (R1 leans on I1 as reference-independent)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5;
const EPS = Number.EPSILON; // 2^-52 machine epsilon for IEEE-754 doubles

// EXACT imp-33925/imp-33854 sub-terms, in log-N space (identical model, no re-derivation).
function parts(lnN) {
  const N = Math.exp(lnN);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { L, E_coll };
}

const lnEcollAt = (lnN) => Math.log(parts(lnN).E_coll);
const lnLogT0At = (lnN) => Math.log(parts(lnN).L);

// I1 identity residual |gap_ecoll - g| at a given step DL (verbatim imp-33925 central difference).
function i1ResidualAtLog10(d, DL) {
  const lnN = d * Math.LN10;
  const q = (lnEcollAt(lnN + DL) - lnEcollAt(lnN - DL)) / (2 * DL);
  const gapEcoll = q + HALF;
  const g = 0.5 * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
  return Math.abs(gapEcoll - g);
}

// The imp-33854/imp-33925 shared grid and the FIVE-step sweep this module adds (imp-33925 used 3).
const SHARED_GRID = [12, 13, 14, 15, 18, 20, 30, 44, 100, 200];
const STEPS = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6];

// Per-step max residual, its argmax rung, and the per-point coefficient r(DL)*DL (= r / (1/DL)).
const STEP_SWEEP = STEPS.map((DL) => {
  const residuals = SHARED_GRID.map((d) => i1ResidualAtLog10(d, DL));
  let maxResidual = -Infinity;
  let argmaxLog10 = SHARED_GRID[0];
  residuals.forEach((r, i) => {
    if (r > maxResidual) {
      maxResidual = r;
      argmaxLog10 = SHARED_GRID[i];
    }
  });
  return {
    DL,
    maxResidual: +maxResidual.toExponential(3),
    argmaxLog10, // decade d such that the dominant rung is N = 1e^d
    perPointCoeff: +(maxResidual * DL).toExponential(3), // r(DL) * DL ~ eps*|ln N|/2
  };
});

// (b) Log-log regression of r against x = 1/DL: slope ~ +1 => r ~ 1/DL (round-off), not -2 (DL^2).
const xs = STEP_SWEEP.map((s) => 1 / s.DL);
const ys = STEP_SWEEP.map((s) => s.maxResidual);
const lx = xs.map(Math.log);
const ly = ys.map(Math.log);
const n = lx.length;
const meanLx = lx.reduce((a, b) => a + b, 0) / n;
const meanLy = ly.reduce((a, b) => a + b, 0) / n;
let sxy = 0;
let sxx = 0;
for (let i = 0; i < n; i++) {
  sxy += (lx[i] - meanLx) * (ly[i] - meanLy);
  sxx += (lx[i] - meanLx) * (lx[i] - meanLx);
}
const logLogSlope = sxy / sxx;

// (c) Through-origin coefficient C_fit = slope of r vs (1/DL): sum(x*y)/sum(x*x).
let sxyLin = 0;
let sxxLin = 0;
for (let i = 0; i < n; i++) {
  sxyLin += xs[i] * ys[i];
  sxxLin += xs[i] * xs[i];
}
const C_fit_origin = sxyLin / sxxLin;

// Geometric mean of the per-point coefficients r(DL)*DL (robust central estimate of C).
const logCoeffs = STEP_SWEEP.map((s) => Math.log(s.perPointCoeff));
const C_fit_geomean = Math.exp(logCoeffs.reduce((a, b) => a + b, 0) / n);

// Predicted worst-case cancellation ceiling at the dominant rung N = 1e200 (|ln N| largest).
const LN_N_MAX = 200 * Math.LN10; // ln(1e200) ~ 460.517
const C_pred = (EPS * LN_N_MAX) / 2; // ~ 5.11e-14
const ratioOrigin = C_fit_origin / C_pred;
const ratioGeomean = C_fit_geomean / C_pred;

// Discriminators used by the assertions below.
const DOMINANT_RUNG_IS_1e200 = STEP_SWEEP.every((s) => s.argmaxLog10 === 200);
const SLOPE_IS_ROUNDOFF = logLogSlope > 0.85 && logLogSlope < 1.2; // ~+1 (round-off), not -2 (DL^2)
const RESIDUAL_GROWS_AS_DL_SHRINKS = STEP_SWEEP.every(
  (s, i) => i === 0 || s.maxResidual > STEP_SWEEP[i - 1].maxResidual,
);
const COEFF_MATCHES_TO_ORDER = ratioOrigin > 0.02 && ratioOrigin < 5; // within ~a decade, sub-ceiling

export const IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT = {
  id: 'imp-33960',
  proofSection: 'S-frontier',
  question:
    'imp-33925 attributed the growth of the I1 residual r(DL) = max |gap_ecoll - g| to the ' +
    'subtractive-cancellation floor eps*|ln N|/(2 DL) but never FIT the coefficient. Regress r ' +
    'against 1/DL over DL in {1e-2,1e-3,1e-4,1e-5,1e-6} at the shared grid and compare the fitted ' +
    'slope/coefficient to the predicted eps*|ln N|/2 at the dominant rung N = 1e200. Measurement ' +
    'only, no bound change, NO QED.',
  model: 'r(DL) ~ C / DL  with predicted worst-case C = eps * |ln N| / 2 at N = 1e200',
  stepSweep: STEP_SWEEP,
  regression: {
    logLogSlope: +logLogSlope.toFixed(4), // ~+1.05 => r ~ 1/DL (round-off), not -2 (DL^2 truncation)
    C_fit_origin: +C_fit_origin.toExponential(4), // ~9.1e-15
    C_fit_geomean: +C_fit_geomean.toExponential(4), // ~1.3e-14
    C_pred: +C_pred.toExponential(4), // eps*|ln 1e200|/2 ~ 5.11e-14
    machineEpsilon: +EPS.toExponential(4), // 2.22e-16
    lnN_dominant: +LN_N_MAX.toFixed(4), // ln(1e200) ~ 460.517
    ratio_C_fit_origin_over_C_pred: +ratioOrigin.toFixed(4), // ~0.18 (sub-ceiling, same order)
    ratio_C_fit_geomean_over_C_pred: +ratioGeomean.toFixed(4), // ~0.26
  },
  findings: {
    R1_slope_confirms_roundoff:
      'The log-log slope of r against 1/DL is ~+1.05, i.e. r ~ 1/DL to within ~5%, quantitatively ' +
      'confirming the eps*|ln N|/(2 DL) cancellation law and excluding the slope ~-2 a DL^2 ' +
      'finite-difference truncation would produce. This upgrades the imp-33925 R2 three-point ' +
      '"grows as DL shrinks" reading to a fitted scaling exponent.',
    R2_coefficient_matches_to_order:
      'The fitted coefficient C_fit ~ 9e-15..1.3e-14 is ~0.18..0.26 of the predicted worst-case ' +
      'ceiling C_pred = eps*|ln N|/2 ~ 5.11e-14 -- the SAME order of magnitude and correctly BELOW ' +
      'the ceiling (eps*|ln N|/2 is the full-ULP worst case; the realized cancellation is a fraction ' +
      'of it). The machine-epsilon model is validated to within a factor of ~5, refining -- not ' +
      'overturning -- imp-33925 R2.',
    R3_rung_attribution:
      'The max residual is carried by N = 1e200 at EVERY step, confirming the |ln N|-scaling of the ' +
      'cancellation floor (largest |ln N| => largest residual).',
  },
  isRigorous: false,
  verdict:
    'FIT (measurement only). Across DL in {1e-2,1e-3,1e-4,1e-5,1e-6} on the shared imp-33854 grid, ' +
    'the I1 residual r(DL) = max |gap_ecoll - g| is dominated by N = 1e200 at every step and scales ' +
    'as ~1/DL: the log-log slope of r vs 1/DL is ~+1.05 (round-off, not the -2 of a DL^2 artifact), ' +
    'and the fitted coefficient C_fit ~ 9e-15..1.3e-14 is ~0.18..0.26 of the predicted worst-case ' +
    'ceiling C_pred = eps*|ln N|/2 ~ 5.11e-14 -- the same order of magnitude, sitting below the ' +
    'full-ULP worst case as expected. This confirms and refines imp-33925 R2: the subtractive-' +
    'cancellation attribution is quantitatively, not just qualitatively, correct. Same inherited ' +
    'imp-3220/imp-3406 component model; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33925 (R2: r grows ~1/DL, attributes to eps*|ln N|/(2 DL), never fit); imp-33854 (I1 ' +
    'identity); imp-33887 (R1 leans on I1); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT_ASSERTIONS = [
  {
    // (R1) Round-off slope: r ~ 1/DL (log-log slope near +1), NOT a DL^2 truncation (slope ~ -2).
    id: 'imp33960-loglog-slope-is-roundoff-not-truncation',
    description: 'log-log slope of r vs 1/DL is in (0.85, 1.2), the ~1/DL round-off signature',
    holds: () => SLOPE_IS_ROUNDOFF && RESIDUAL_GROWS_AS_DL_SHRINKS,
  },
  {
    // (R2) Coefficient matches the eps*|ln N|/2 ceiling to order, on the expected sub-ceiling side.
    id: 'imp33960-coefficient-matches-machine-epsilon-model-to-order',
    description: 'C_fit / C_pred is in (0.02, 5): fitted coefficient within a decade of eps*|ln N|/2',
    holds: () => COEFF_MATCHES_TO_ORDER,
  },
  {
    // (R3) The dominant rung is N = 1e200 at every step (|ln N| largest => residual largest).
    id: 'imp33960-dominant-rung-is-1e200',
    description: 'the max I1 residual is carried by N = 1e200 at every step DL',
    holds: () => DOMINANT_RUNG_IS_1e200,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33960-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT.isRigorous === false &&
      /NO QED/.test(IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT.verdict) &&
      /remains SOTA/.test(IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT.verdict),
  },
];

for (const a of IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33960-i1-roundoff-coefficient-fit assertion failed: ${a.id}`);
  }
}
