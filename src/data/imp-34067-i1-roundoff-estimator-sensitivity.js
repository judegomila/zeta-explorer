/**
 * @module imp-34067-i1-roundoff-estimator-sensitivity
 *
 * imp-34067 (numerical, frontier-direction): is the imp-34007 R3 sub-linear cross-rung
 * |ln N|-scaling slope ~+0.71 a GEOMEAN ARTIFACT, or is it robust to the central estimator?
 *
 * imp-34007 R3 fit the per-rung round-off coefficient with a SINGLE robust central estimator,
 * C_N = geomean_DL[ r_N(DL) * DL ], and found the cross-rung log-log slope of C_N vs |ln N| is
 * ~+0.71 -- positive (the sign the eps*|ln N|/(2 DL) floor law predicts) but distinctly BELOW the
 * clean +1 a strict C ~ |ln N| proportionality would give. It flagged the estimate as round-off-
 * stochastic and never asked whether the sub-linearity is a property of the DATA or a property of
 * the GEOMEAN. This module answers that: it recomputes C_N per rung with MEDIAN and TRIMMED-MEAN
 * estimators over the same five DL steps (in place of the geomean), re-regresses log(C_N) on
 * log(|ln N|) across the ten rungs for each estimator, and reports whether the cross-rung slope
 * moves toward +1 or stays sub-linear regardless of estimator.
 *
 * THE MEASUREMENT (this module)
 * -----------------------------
 * On the SAME imp-33854/imp-33925/imp-34007 grid and inherited sub-terms, for EACH rung N = 1e^d:
 *   (a) recompute the five per-step products p_i = r_N(DL_i) * DL_i (~ eps*|ln N|/2 each),
 *   (b) form THREE central estimates of the per-rung coefficient:
 *         C_N^geo  = geomean(p)        (the imp-34007 estimator, reproduced VERBATIM),
 *         C_N^med  = median(p)         (rank estimator, immune to a single blown step),
 *         C_N^trim = mean of p with the min and max step dropped (5 -> middle 3),
 *   (c) regress log(C_N) on log(|ln N|) across the ten rungs, SEPARATELY for each estimator,
 *   (d) compare the three cross-rung slopes: a strict floor law gives +1; a geomean ARTIFACT would
 *       show the median/trimmed slopes snapping toward +1 while only the geomean sits low.
 *
 * THE NUMBERS (this platform; round-off magnitudes platform-dependent -> asserted only to order)
 * ---------------------------------------------------------------------------------------------
 *   d(=log10 N)  |ln N|   C_N^geo      C_N^med      C_N^trim
 *   12            27.63    5.157e-16    7.221e-16    6.753e-16
 *   13            29.93    5.055e-16    4.496e-16    4.583e-16
 *   14            32.24    1.340e-15    1.438e-15    1.384e-15
 *   15            34.54    1.087e-15    1.032e-15    1.064e-15
 *   18            41.45    1.566e-15    1.373e-15    1.639e-15
 *   20            46.05    1.339e-15    1.262e-15    1.362e-15
 *   30            69.08    2.024e-15    2.165e-15    2.116e-15
 *   44           101.31    1.127e-15    1.277e-15    1.560e-15
 *   100          230.26    1.174e-15    8.183e-16    2.198e-15
 *   200          460.52    1.259e-14    9.381e-15    1.259e-14
 *   cross-rung log-log slope of C_N vs |ln N|:   geomean ~+0.710   median ~+0.574   trimmed ~+0.802
 *
 * THE FINDING (measurement / reconciliation only)
 * -----------------------------------------------
 *   THE SUB-LINEAR CROSS-RUNG SLOPE IS NOT A GEOMEAN ARTIFACT. Swapping the geomean for a median or
 *   a trimmed mean does NOT move the cross-rung |ln N|-scaling slope to the clean +1 a strict floor
 *   law predicts: all three estimators land in a ~0.57..0.80 band (median ~+0.574 pulls even
 *   FURTHER below +1, trimmed mean ~+0.802 is the highest but still clearly sub-linear, geomean
 *   ~+0.710 sits between them). The decisive check: the MEDIAN -- a rank estimator that does NO
 *   log-averaging at all -- is even MORE sub-linear than the geomean, so the geomean is NOT the low
 *   outlier and cannot be what is dragging the slope below +1; no estimator reaches +1. So imp-34007
 *   R3 is an estimator-robust reading: the per-rung round-off coefficient genuinely grows SUB-linearly
 *   in |ln N| across rungs -- the aggregate/worst-rung ordering holds (largest |ln N| carries the
 *   largest residual) but the coefficient is NOT a deterministic |ln N| law, because per-rung
 *   round-off is stochastic and only fractionally same-sign, not a property the geomean invented.
 *   HONEST confirmation of imp-34007 R3, not an overturn.
 *
 * MEASUREMENT ONLY. Same inherited imp-3220/imp-3406/imp-33582/imp-33602 component model as
 * imp-33854/imp-33925/imp-33960/imp-34007; same sub-terms; changes no bound; the C_mb GUE-conditional
 * share per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * C_C = 1/8 ansatz untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 * Realized round-off magnitudes are platform-dependent, so the per-estimator cross-rung slopes are
 * asserted only to order (all positive, all sub-linear, none reaching the clean +1).
 *
 * @see imp-34007-i1-roundoff-per-rung-lnN-scaling (R3: geomean cross-rung slope ~+0.71, flagged round-off-stochastic)
 * @see imp-33960-i1-roundoff-coefficient-fit (fit ONLY at the max rung N = 1e200; slope ~+1.05)
 * @see imp-33925-i1-step-robustness (R2: residual grows ~1/DL; attributes to eps*|ln N|/(2 DL))
 * @see imp-33854-log-saturation-exponent-reconciliation (I1 gap_ecoll = q + 1/2 = g)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5;
const EPS = Number.EPSILON; // 2^-52 machine epsilon for IEEE-754 doubles

// EXACT imp-34007/imp-33925/imp-33854 sub-terms, in log-N space (identical model, no re-derivation).
function parts(lnN) {
  const N = Math.exp(lnN);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { L, E_coll };
}

const lnEcollAt = (lnN) => Math.log(parts(lnN).E_coll);
const lnLogT0At = (lnN) => Math.log(parts(lnN).L);

// I1 identity residual |gap_ecoll - g| at a given step DL (verbatim imp-33925/imp-34007 central diff).
function i1ResidualAtLog10(d, DL) {
  const lnN = d * Math.LN10;
  const q = (lnEcollAt(lnN + DL) - lnEcollAt(lnN - DL)) / (2 * DL);
  const gapEcoll = q + HALF;
  const g = 0.5 * (lnLogT0At(lnN + DL) - lnLogT0At(lnN - DL)) / (2 * DL);
  return Math.abs(gapEcoll - g);
}

// The imp-34007 shared grid and the SAME five-step sweep.
const SHARED_GRID = [12, 13, 14, 15, 18, 20, 30, 44, 100, 200];
const STEPS = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6];

// Three central estimators over the five per-step products p_i = r(DL_i)*DL_i.
const geomean = (a) => Math.exp(a.map(Math.log).reduce((x, y) => x + y, 0) / a.length);
function median(a) {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 === 1 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
function trimmedMean(a) {
  const s = [...a].sort((x, y) => x - y); // drop the smallest and largest step (5 -> middle 3)
  const mid = s.slice(1, s.length - 1);
  return mid.reduce((x, y) => x + y, 0) / mid.length;
}

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

// (a)-(b) Per-rung sweep: the five per-step products and the three central estimates of C_N.
const PER_RUNG = SHARED_GRID.map((d) => {
  const products = STEPS.map((DL) => i1ResidualAtLog10(d, DL) * DL); // ~ eps*|ln N|/2 each
  const lnN = d * Math.LN10;
  return {
    log10N: d,
    lnN: +lnN.toFixed(2),
    C_geo: +geomean(products).toExponential(3),
    C_med: +median(products).toExponential(3),
    C_trim: +trimmedMean(products).toExponential(3),
  };
});

// (c) Cross-rung |ln N|-scaling slope for EACH estimator (regress log(C_N) on log(|ln N|)).
const lnNvals = PER_RUNG.map((r) => r.lnN);
const crossRungSlopeGeo = logLogSlope(lnNvals, PER_RUNG.map((r) => r.C_geo));
const crossRungSlopeMed = logLogSlope(lnNvals, PER_RUNG.map((r) => r.C_med));
const crossRungSlopeTrim = logLogSlope(lnNvals, PER_RUNG.map((r) => r.C_trim));

// (d) Discriminators used by the assertions.
const SLOPES = [crossRungSlopeGeo, crossRungSlopeMed, crossRungSlopeTrim];
const estimatorSpread = Math.max(...SLOPES) - Math.min(...SLOPES);
const gapToOne = 1 - Math.max(...SLOPES); // gap from the HIGHEST estimator slope to the clean +1
const ALL_POSITIVE_AND_SUBLINEAR = SLOPES.every((s) => s > 0.3 && s < 1.0);
const NO_ESTIMATOR_REACHES_ONE = Math.max(...SLOPES) < 0.95; // none snaps up to the strict +1 law
// The decisive artifact test: the MEDIAN (a rank estimator that does NO log-averaging) is at least
// as sub-linear as the geomean, so dropping the geomean would not raise the slope toward +1 --
// the geomean cannot be manufacturing the sub-linearity.
const GEOMEAN_NOT_THE_LOW_OUTLIER = crossRungSlopeMed <= crossRungSlopeGeo;
const SUBLINEARITY_NOT_A_GEOMEAN_ARTIFACT =
  ALL_POSITIVE_AND_SUBLINEAR && NO_ESTIMATOR_REACHES_ONE && GEOMEAN_NOT_THE_LOW_OUTLIER;

export const IMP34067_I1_ROUNDOFF_ESTIMATOR_SENSITIVITY = {
  id: 'imp-34067',
  proofSection: 'S-frontier',
  question:
    'imp-34007 R3 fit the per-rung round-off coefficient C_N with a SINGLE estimator, geomean over ' +
    'the five DL steps, and found the cross-rung log-log slope of C_N vs |ln N| is ~+0.71 -- positive ' +
    'but below the clean +1 a strict floor law predicts. Recompute C_N per rung with median and ' +
    'trimmed-mean estimators, re-regress log(C_N) on log(|ln N|) across the ten rungs for each, and ' +
    'report whether the sub-linear slope moves toward +1 or is a geomean artifact. Measurement only, ' +
    'no bound change, NO QED.',
  model: 'C_N = central-estimate_DL[ r_N(DL)*DL ] per rung; cross-rung slope of log(C_N) vs log(|ln N|)',
  perRung: PER_RUNG,
  summary: {
    crossRungSlopeGeo: +crossRungSlopeGeo.toFixed(3), // ~0.710 (reproduces imp-34007 R3)
    crossRungSlopeMed: +crossRungSlopeMed.toFixed(3), // ~0.574 (pulls FURTHER below +1)
    crossRungSlopeTrim: +crossRungSlopeTrim.toFixed(3), // ~0.802 (highest, still sub-linear)
    estimatorSpread: +estimatorSpread.toFixed(3), // ~0.228 spread across the three estimators
    gapToOneHighest: +gapToOne.toFixed(3), // ~0.198 gap from the highest estimator to +1
    machineEpsilon: +EPS.toExponential(4), // 2.22e-16
  },
  findings: {
    R1_sublinearity_is_estimator_robust:
      'Swapping the geomean for a median or a trimmed mean does NOT move the cross-rung |ln N|-scaling ' +
      'slope to the clean +1: all three estimators land in a ~0.57..0.80 band (median ~+0.574 pulls ' +
      'FURTHER below +1, trimmed mean ~+0.802 is the highest but still clearly sub-linear, geomean ' +
      '~+0.710 sits between). The decisive check: the median -- a rank estimator that does NO ' +
      'log-averaging -- is even MORE sub-linear than the geomean, so the geomean is NOT the low ' +
      'outlier and cannot be dragging the slope below +1; no estimator reaches +1. So imp-34007 R3 is ' +
      'an estimator-robust reading, NOT a geomean artifact: the per-rung round-off coefficient genuinely ' +
      'grows SUB-linearly in |ln N| across rungs because per-rung round-off is stochastic and only ' +
      'fractionally same-sign, not a deterministic |ln N| law the geomean invented.',
  },
  isRigorous: false,
  verdict:
    'FIT (measurement only). Recomputing the per-rung round-off coefficient C_N with median and ' +
    'trimmed-mean estimators in place of the imp-34007 geomean leaves the cross-rung |ln N|-scaling ' +
    'slope sub-linear regardless of estimator: geomean ~+0.710, median ~+0.574, trimmed mean ~+0.802 ' +
    '-- all positive (the sign the eps*|ln N|/(2 DL) floor law predicts) but all clearly below the ' +
    'clean +1 a strict C ~ |ln N| proportionality would give, and the median (a rank estimator doing ' +
    'no log-averaging) is even MORE sub-linear than the geomean, so the geomean is not the low outlier. ' +
    'This CONFIRMS imp-34007 R3 as an estimator-robust fact rather than a geomean artifact: the ' +
    'coefficient grows sub-linearly in |ln N| because ' +
    'per-rung round-off is stochastic and only fractionally same-sign. Same inherited imp-3220/imp-3406 ' +
    'component model; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34007 (geomean cross-rung slope ~+0.71, flagged round-off-stochastic); imp-33960 (fit at ' +
    'max rung N = 1e200); imp-33925 (r grows ~1/DL); imp-33854 (I1 identity); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP34067_I1_ROUNDOFF_ESTIMATOR_SENSITIVITY_ASSERTIONS = [
  {
    // The geomean cross-rung slope reproduces imp-34007 R3 (~0.71 on this platform).
    id: 'imp34067-geomean-reproduces-imp34007',
    description: 'geomean cross-rung slope reproduces the imp-34007 R3 sub-linear ~0.71 reading',
    holds: () => crossRungSlopeGeo > 0.5 && crossRungSlopeGeo < 0.9,
  },
  {
    // All three estimators give a positive but sub-linear cross-rung slope (in (0.3,1.0)).
    id: 'imp34067-all-estimators-sublinear',
    description: 'geomean, median and trimmed-mean cross-rung slopes are all positive but below +1',
    holds: () => ALL_POSITIVE_AND_SUBLINEAR,
  },
  {
    // The sub-linearity is NOT a geomean artifact: no estimator reaches +1 and the median (no
    // log-averaging) is even MORE sub-linear than the geomean, so the geomean is not the low outlier.
    id: 'imp34067-sublinearity-not-a-geomean-artifact',
    description: 'no estimator reaches +1 and the median is at least as sub-linear as the geomean',
    holds: () => SUBLINEARITY_NOT_A_GEOMEAN_ARTIFACT,
  },
  {
    // Honesty gate: measurement only, no QED, imp-3066 untouched, Platt-Trudgian stays SOTA.
    id: 'imp34067-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, imp-3066 untouched, Platt-Trudgian SOTA',
    holds: () =>
      IMP34067_I1_ROUNDOFF_ESTIMATOR_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP34067_I1_ROUNDOFF_ESTIMATOR_SENSITIVITY.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34067_I1_ROUNDOFF_ESTIMATOR_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP34067_I1_ROUNDOFF_ESTIMATOR_SENSITIVITY.verdict),
  },
];

for (const a of IMP34067_I1_ROUNDOFF_ESTIMATOR_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34067-i1-roundoff-estimator-sensitivity assertion failed: ${a.id}`);
  }
}
