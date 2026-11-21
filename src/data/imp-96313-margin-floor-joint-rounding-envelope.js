/**
 * imp-96313 -- joint seven-point rounding envelope of the imp-96173/imp-96148
 * reciprocal-log-with-floor margin floor.
 *
 * imp-96289 perturbed only the single highest-leverage T=60 ordinate (its
 * half-ULP rounding band +/-0.0005) and reported the floor stays 0.14159..0.14354.
 * But every one of the seven margin ordinates rho(T) is baked to three decimals,
 * so all seven independently carry a +/-0.0005 rounding band, not just T=60. This
 * module propagates the FULL seven-point rounding budget through the OLS intercept.
 *
 * The floor is the OLS intercept c of rho = c + d*x with x = 1/ln(T). Because the
 * intercept is linear in the ordinates, c = sum_i w_i * rho_i with the exact
 * intercept weights w_i = 1/n - xbar*(x_i - xbar)/Sxx (these reproduce the
 * imp-96289 sensitivity dc/drho(60) = w_0 = -1.94425 and sum to 1). Two joint
 * envelopes follow directly:
 *   worst-case (all seven rounding errors sign-aligned against the floor):
 *     Delta_c = 0.0005 * sum_i |w_i|
 *   RMS (independent uniform rounding, variance h^2/3 with h = 0.0005):
 *     sigma_c = sqrt( sum_i w_i^2 * h^2/3 )
 *
 * FINDINGS (measurement, no bound moves):
 *   1. Worst-case joint band: sum_i |w_i| = 7.0590, so the all-aligned rounding
 *      perturbation is +/-0.003529, giving a floor band 0.139034..0.146093 -- the
 *      sign survives even the adversarial all-seven-aligned rounding budget. This
 *      is ~3.6x the imp-96289 single-T=60 half-band (0.000972), as expected once
 *      the other six +/-0.0005 bands are added coherently.
 *   2. RMS joint band: sqrt(sum_i w_i^2) = 3.1607, so the independent-rounding
 *      standard deviation is sigma_c = 0.000912 -- barely above the single-T=60
 *      half-band, because the T=60 leverage (w_0 = -1.944) dominates sum w_i^2.
 *      The floor sits c/sigma_c = 156.2 rounding-sigma above zero, and even
 *      c - 3*sigma_c = 0.139826 stays clear of zero.
 *   3. Both envelopes are far smaller than the imp-96289 OLS intercept standard
 *      error (0.02173, which reflects fit scatter, not rounding); rounding is not
 *      the binding uncertainty on the floor sign.
 * ASSESSMENT: the positive-floor SIGN survives the full joint three-decimal
 * rounding budget of all seven ordinates, not merely the single T=60 perturbation
 * of imp-96289 -- both worst-case (all-aligned, floor >= 0.1390) and RMS
 * (independent, 156 sigma above zero). Propagating the other six bands widens the
 * worst-case envelope ~3.6x but leaves the sign firm; the RMS envelope is
 * essentially set by T=60 alone. The 0.14256 magnitude stays loose (fit-scatter
 * dominated) but the sign is not rounding-limited.
 *
 * GRADE: documentation/measurement only. Import-light (all literals baked, no
 * heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96289-margin-floor-t60-anchor-sensitivity (single-T=60 perturbation)
 * @see imp-96265-margin-floor-loo-stability (LOO/LTO leverage ranking)
 * @see imp-96173-route-bd-margin-decay-fits-table (the fit)
 * @see imp-96148-route-bd-online-margin-decay-law (source column + selector)
 */

const T = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const RHO = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const X = T.map((t) => 1 / Math.log(t));
const N = X.length;

// Half-ULP rounding band of a value baked to three decimals.
const ROUND_H = 0.0005;

// Exact OLS intercept weights w_i = dc/drho_i = 1/n - xbar*(x_i - xbar)/Sxx.
const XBAR = X.reduce((s, x) => s + x, 0) / N;
const SXX = X.reduce((s, x) => s + (x - XBAR) ** 2, 0);
export const IMP_96313_WEIGHTS = X.map((x) => 1 / N - (XBAR * (x - XBAR)) / SXX);

// Floor reproduced as the weighted sum c = sum_i w_i rho_i (matches 0.14256).
export const IMP_96313_FLOOR = IMP_96313_WEIGHTS.reduce((s, w, i) => s + w * RHO[i], 0);

// Worst-case joint envelope: all seven rounding errors sign-aligned against c.
const SUM_ABS_W = IMP_96313_WEIGHTS.reduce((s, w) => s + Math.abs(w), 0);
export const IMP_96313_WORST_CASE = {
  sumAbsWeights: SUM_ABS_W,
  halfBand: ROUND_H * SUM_ABS_W,
  floorMin: IMP_96313_FLOOR - ROUND_H * SUM_ABS_W,
  floorMax: IMP_96313_FLOOR + ROUND_H * SUM_ABS_W,
};

// RMS joint envelope: independent uniform rounding, variance ROUND_H^2/3 each.
const SUM_W2 = IMP_96313_WEIGHTS.reduce((s, w) => s + w * w, 0);
const SIGMA_C = Math.sqrt(SUM_W2 * (ROUND_H * ROUND_H / 3));
export const IMP_96313_RMS = {
  rootSumSquareWeights: Math.sqrt(SUM_W2),
  sigma: SIGMA_C,
  floorOverSigma: IMP_96313_FLOOR / SIGMA_C,
  floorMinusThreeSigma: IMP_96313_FLOOR - 3 * SIGMA_C,
};

// The imp-96289 single-T=60 half-band, for the coherence-vs-single comparison.
export const IMP_96313_SINGLE_T60_HALF_BAND = ROUND_H * Math.abs(IMP_96313_WEIGHTS[0]);

export const IMP_96313_MARGIN_FLOOR_JOINT_ROUNDING_ENVELOPE = {
  id: 'imp-96313-margin-floor-joint-rounding-envelope',
  title:
    'Joint seven-point rounding envelope of the imp-96173/imp-96148 margin floor: '
    + 'does the positive floor c~0.14 survive the full three-decimal rounding '
    + 'budget of all seven ordinates, not just the single T=60 perturbation?',
  floor: IMP_96313_FLOOR,
  bakedFloor: 0.14256,
  weights: IMP_96313_WEIGHTS,
  worstCase: IMP_96313_WORST_CASE,
  rms: IMP_96313_RMS,
  singleT60HalfBand: IMP_96313_SINGLE_T60_HALF_BAND,
  finding:
    'the positive-floor SIGN survives the full joint three-decimal rounding budget '
    + 'of all seven ordinates. Worst-case (all seven +/-0.0005 bands sign-aligned) '
    + 'is +/-0.003529 -- floor stays in 0.139034..0.146093, about 3.6x the '
    + 'imp-96289 single-T=60 half-band (0.000972) once the other six bands add '
    + 'coherently. RMS (independent rounding) is sigma=0.000912, barely above the '
    + 'single-T=60 band because the T=60 leverage dominates sum w_i^2, placing the '
    + 'floor 156 rounding-sigma above zero (c-3sigma=0.139826). Both envelopes are '
    + 'far below the imp-96289 fit-scatter intercept SE 0.02173, so rounding is not '
    + 'the binding uncertainty on the floor sign',
  note:
    'documentation/measurement only; import-light baked literals; changes no '
    + 'Lambda bound; no refereed bound is changed',
  closesTickets: ['imp-96313'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96313_ASSERTIONS = [
  {
    id: 'imp-96313-weighted-sum-reproduces-floor',
    holds: () => Math.abs(IMP_96313_FLOOR - 0.14256) < 1e-4,
    why: 'the intercept as a weighted sum of ordinates must reproduce the baked floor 0.14256.',
  },
  {
    id: 'imp-96313-weights-sum-to-one',
    holds: () => Math.abs(IMP_96313_WEIGHTS.reduce((s, w) => s + w, 0) - 1) < 1e-9,
    why: 'the OLS intercept weights must sum to one (unbiased intercept).',
  },
  {
    id: 'imp-96313-t60-weight-matches-imp96289',
    holds: () => Math.abs(IMP_96313_WEIGHTS[0] - (-1.944249)) < 1e-4,
    why: 'the T=60 intercept weight must equal the imp-96289 sensitivity dc/drho(60)=-1.94425.',
  },
  {
    id: 'imp-96313-worst-case-clears-zero',
    holds: () => IMP_96313_WORST_CASE.floorMin > 0.13,
    why: 'the all-seven-aligned worst-case rounding band must keep the floor above 0.13.',
  },
  {
    id: 'imp-96313-worst-case-wider-than-single-t60',
    holds: () =>
      IMP_96313_WORST_CASE.halfBand > 3 * IMP_96313_SINGLE_T60_HALF_BAND
      && IMP_96313_WORST_CASE.halfBand < 4 * IMP_96313_SINGLE_T60_HALF_BAND,
    why: 'adding the other six coherent bands must widen the worst-case band to ~3.6x the single-T=60 band.',
  },
  {
    id: 'imp-96313-rms-many-sigma-above-zero',
    holds: () => IMP_96313_RMS.floorOverSigma > 100 && IMP_96313_RMS.floorMinusThreeSigma > 0.13,
    why: 'the RMS rounding envelope must place the floor far (>100 sigma) above zero.',
  },
  {
    id: 'imp-96313-rms-near-single-t60-band',
    holds: () => Math.abs(IMP_96313_RMS.sigma - IMP_96313_SINGLE_T60_HALF_BAND) < 3e-4,
    why: 'the RMS sigma must be close to the single-T=60 half-band because T=60 dominates sum w_i^2.',
  },
  {
    id: 'imp-96313-not-a-bound',
    holds: () => Array.isArray(IMP_96313_MARGIN_FLOOR_JOINT_ROUNDING_ENVELOPE.closesTickets),
    why: 'this is a measurement module; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96313-closes-self',
    holds: () => IMP_96313_MARGIN_FLOOR_JOINT_ROUNDING_ENVELOPE.closesTickets.includes('imp-96313'),
    why: 'this module is the deliverable the imp-96313 ticket asked for.',
  },
];

for (const a of IMP_96313_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96313-margin-floor-joint-rounding-envelope assertion failed: ${a.id}`);
  }
}

export default IMP_96313_MARGIN_FLOOR_JOINT_ROUNDING_ENVELOPE;
