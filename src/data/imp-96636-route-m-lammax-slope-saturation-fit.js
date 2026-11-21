/**
 * @module imp-96636-route-m-lammax-slope-saturation-fit
 *
 * imp-96636 (numerical, MEASUREMENT / CURVE-FIT ONLY): imp-96612 measured the rank-r
 * power-iteration Rayleigh log-slopes b_r on the imp-96443 Vasyunin lam_max ladder
 * (b_0 = 0, b_1 = 0.01661, b_2 = 0.09286, ..., b_11 = 0.35232), converging to the
 * imp-96443 target L = 0.3526 as R_r -> lam_max, but reported only a DISCRETE r = 0..11
 * table with no functional law. This ticket fits that IMP96612_RANKR_SLOPES sequence to a
 * saturating form to extract a single continuous mode-count summary r0 and its goodness of
 * fit, sharpening (NOT closing) IMP96562_SUBGAP with a saturation-rate constant.
 *
 * WHAT WAS DONE (tmp/imp-96636-saturation-fit.py, reproducible, scipy curve_fit):
 * three models were fit to the 12-point b_r sequence, with L = 0.3526253785070698 held
 * fixed at the imp-96443 measured slope wherever it is the known asymptote:
 *   M1  fixed-amplitude single exponential   b_r = L (1 - e^{-r/r0})          (1 free param)
 *   M2  free-amplitude single exponential    b_r = A (1 - e^{-r/r0})          (2 free params)
 *   M3  logistic in r                        b_r = L / (1 + e^{-(r-r0)/k})    (2 free params)
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the requested single-exponential saturation law is a POOR fit.
 * -------------------------------------------------------------------------------
 * M1 gives r0 = 3.2229 (half-saturation rank r0 ln2 = 2.2339) but only R^2 = 0.9194 with a
 * large max residual 0.0775 and clearly STRUCTURED, S-shaped residuals: the fit OVER-predicts
 * the low-r modes (resid -0.077 at r=1, -0.070 at r=2) and UNDER-predicts the mid-r modes
 * (resid +0.036 at r=6). A pure exponential rises fastest at r=0; the measured b_r instead has
 * a delayed, sigmoidal ONSET because a rank-one surrogate contributes almost nothing (b_1/L =
 * 4.7%). The per-rung implied r0 = -r / ln(1 - b_r/L) is therefore NOT constant -- it drifts
 * monotonically from 20.72 (r=1) down through 3.77 (r=3) to 1.56 (r=11), the signature of a
 * model whose curvature is wrong. Freeing the amplitude (M2) does not rescue it: A = 0.4150
 * OVERSHOOTS the known asymptote L = 0.3526 (unphysical, since b_r -> L by construction) and
 * R^2 only reaches 0.9440. So the exponential-saturation ansatz named in the ticket does not
 * describe the mode-accumulation curve; reporting r0 = 3.22 alone would misrepresent the shape.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- a logistic in r captures the collective sigmoidal onset (R^2 = 0.9961).
 * -------------------------------------------------------------------------------
 * The delayed onset is exactly a sigmoid. The logistic M3 with fixed asymptote L fits with
 * inflection / half-saturation rank r0 = 2.9408, width k = 0.8632, R^2 = 0.99611, RMSE
 * 8.16e-3, max residual 0.0171 -- a >4x smaller RMSE than either exponential. The continuous
 * mode-count summary is thus: the 0.3526 log-coefficient turns on around rank r ~ 2.94 (half
 * saturation) with a sharp width k ~ 0.86, reaching 90% near r ~ 6 -- consistent with the
 * imp-96612 discrete table (within 25% at r = 4, within 10% at r = 6) and quantifying the
 * imp-96586 FINDING 2 collective (not single-mode / not low-rank) character: the coefficient
 * has essentially NO low-rank component (the exponential's fast-start ansatz fails), it
 * accumulates as a sigmoid centred at rank ~3.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The single-exponential saturation b_r = L(1 - e^{-r/r0}) is a POOR (R^2 = 0.92, S-shaped
 * residual) description; its best-fit r0 = 3.22 / half-saturation 2.23 should be read only as
 * a crude mode-count. The honest continuous summary is a LOGISTIC in r with half-saturation
 * (inflection) rank r0 = 2.94 and width k = 0.86 (R^2 = 0.996), which matches the discrete
 * imp-96612 milestones and encodes the sigmoidal, collective onset. This SHARPENS
 * IMP96562_SUBGAP with a mode-count constant (half-saturation rank ~3, 90% near ~6); it does
 * NOT close it: it is a fit to the measured surrogate, R_r -> lam_max by construction, no
 * closed-form / averaged-symbol asymptotic for the 0.3526 coefficient is produced. Changes no
 * bound; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96612-route-m-lammax-rankr-power-iteration-bracket.js (the discrete b_r table fit here)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (rank-one brackets, FINDING 2 collective)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (localizes IMP96562_SUBGAP)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max = 3.0247 + 0.3526 log N)
 *
 * Ticket: imp-96636 (numerical, opus-4-8, api-pool). Curve-fit / measurement only; NO QED.
 */

// imp-96443 measured leading log-slope L = asymptote of b_r (fixed in the amplitude-fixed fits).
export const IMP96636_TARGET_SLOPE = 0.3526253785070698;

// The imp-96612 discrete rank-r log-slope sequence this module fits (b_r, r = 0..11).
export const IMP96636_BR_SEQUENCE = Object.freeze(
  [
    { r: 0, b: 0.0 },
    { r: 1, b: 0.01661333 },
    { r: 2, b: 0.09286438 },
    { r: 3, b: 0.19357364 },
    { r: 4, b: 0.26902421 },
    { r: 5, b: 0.31227912 },
    { r: 6, b: 0.33404105 },
    { r: 7, b: 0.34428597 },
    { r: 8, b: 0.34894019 },
    { r: 9, b: 0.35101219 },
    { r: 10, b: 0.35192347 },
    { r: 11, b: 0.35232119 },
  ].map((row) => Object.freeze(row)),
);

// M1 -- fixed-amplitude single exponential  b_r = L (1 - e^{-r/r0}), one free param r0.
// The saturation law the ticket asked for. POOR fit: structured S-shaped residuals.
export const IMP96636_EXP_FIXED = Object.freeze({
  form: 'b_r = L (1 - exp(-r/r0)),  L = 0.3526253785 fixed',
  r0: 3.222852,
  halfSaturationRank: 2.233911, // r0 * ln2, where b = L/2
  r2: 0.919383,
  rmse: 0.037183,
  maxResid: 0.077454, // at r=1 (fit over-predicts the low-rank modes)
  residualShape: 'S-shaped: over-predicts r<=2 (resid -0.077,-0.070), under-predicts r=5..7 (+0.034..+0.032)',
  goodFit: false,
});

// M2 -- free-amplitude single exponential  b_r = A (1 - e^{-r/r0}).
// Freeing A does not rescue it: A = 0.4150 OVERSHOOTS the known asymptote L = 0.3526.
export const IMP96636_EXP_FREE = Object.freeze({
  form: 'b_r = A (1 - exp(-r/r0))',
  A: 0.41498,
  r0: 4.548018,
  r2: 0.944007,
  rmse: 0.030988,
  maxResid: 0.065296,
  amplitudeOvershootsAsymptote: true, // A = 0.415 > L = 0.3526, unphysical since b_r -> L
  goodFit: false,
});

// M3 -- logistic in r  b_r = L / (1 + e^{-(r-r0)/k}), fixed asymptote L.
// The honest continuous summary: sigmoidal onset, half-saturation (inflection) rank r0 ~ 2.94.
export const IMP96636_LOGISTIC = Object.freeze({
  form: 'b_r = L / (1 + exp(-(r-r0)/k)),  L = 0.3526253785 fixed',
  r0: 2.940802, // inflection / half-saturation rank (b = L/2)
  k: 0.863214, // width in ranks
  r2: 0.996115,
  rmse: 0.008163,
  maxResid: 0.017060,
  goodFit: true,
});

// Per-rung implied r0 for the fixed-amplitude exponential: r0(r) = -r / ln(1 - b_r/L).
// NOT constant -- drifts 20.72 -> 1.56, the direct diagnostic that a single exponential
// is the wrong curvature (a valid single-exp fit would give a flat sequence here).
export const IMP96636_IMPLIED_R0_DRIFT = Object.freeze(
  [
    { r: 1, r0: 20.7214 },
    { r: 2, r0: 6.5436 },
    { r: 3, r0: 3.768 },
    { r: 4, r0: 2.779 },
    { r: 5, r0: 2.3064 },
    { r: 6, r0: 2.0387 },
    { r: 7, r0: 1.8695 },
    { r: 8, r0: 1.754 },
    { r: 9, r0: 1.6706 },
    { r: 10, r0: 1.6079 },
    { r: 11, r0: 1.5591 },
  ].map((row) => Object.freeze(row)),
);

export const IMP96636_VERDICT = Object.freeze({
  question:
    'fit the imp-96612 rank-r log-slopes b_r to a saturation law b_r = 0.3526(1-e^{-r/r0}), ' +
    'estimate the mode-count r0 and half-saturation rank, and report goodness of fit',
  requestedExpSaturationIsGoodFit: false, // R^2 = 0.919, S-shaped residual, drifting implied r0
  bestModel: 'logistic',
  logisticHalfSaturationRank: 2.940802,
  logisticWidthK: 0.863214,
  logisticR2: 0.996115,
  modeCountFor90pct: 6, // matches imp-96612 discrete (within 10% at r=6)
  anyBoundMoved: false,
  conclusion:
    'The single-exponential saturation law named in the ticket is a POOR fit (r0 = 3.22, ' +
    'half-saturation 2.23, but R^2 = 0.92 with S-shaped residuals and a per-rung implied r0 ' +
    'that drifts 20.7 -> 1.56), because the mode-accumulation has a DELAYED sigmoidal onset -- ' +
    'a rank-one surrogate captures under 5%, so there is essentially no fast-start component ' +
    'for an exponential to fit. The honest continuous summary is a LOGISTIC in r with ' +
    'half-saturation (inflection) rank r0 = 2.94, width k = 0.86, R^2 = 0.996, reaching 90% ' +
    'near r ~ 6 -- consistent with the imp-96612 discrete milestones (25% at r=4, 10% at r=6) ' +
    'and quantifying imp-96586 FINDING 2 that the 0.3526 log-coefficient is a collective, not ' +
    'low-rank, off-diagonal effect. This SHARPENS IMP96562_SUBGAP with a mode-count constant; ' +
    'it does NOT close it -- it is a fit to a surrogate that converges to lam_max by ' +
    'construction, giving no closed-form pin. Changes no bound; no refereed bound is changed; NO QED.',
});

export const IMP96636_SUBGAP = Object.freeze({
  id: 'imp-96636-lammax-slope-onset-is-sigmoidal-half-saturation-rank-2p94',
  statement:
    'the rank-r accumulation of the 0.3526 multiplicative Vasyunin lam_max log-coefficient is ' +
    'SIGMOIDAL, not exponential-saturating: b_r is fit by a logistic in r with half-saturation ' +
    '(inflection) rank r0 = 2.94 and width k = 0.86 (R^2 = 0.996), whereas the exponential ' +
    'saturation b_r = L(1-e^{-r/r0}) fails (R^2 = 0.92, implied r0 drifts 20.7 -> 1.56). The ' +
    'delayed onset (b_1/L = 4.7%) confirms there is essentially no low-rank component. What ' +
    'remains open is unchanged: a multiplicative-Toeplitz / Dirichlet-Bohr spectral-edge ' +
    'growth-rate theorem giving the 0.3526 coefficient in closed form.',
});

export const IMP96636_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Curve-fit / measurement only: the three ' +
  'models are scipy curve_fit fits to the imp-96612 discrete b_r table (tmp/imp-96636-saturation' +
  '-fit.py). The requested single-exponential saturation is a poor fit; the logistic is reported ' +
  'as the honest continuous summary. This fits a surrogate whose b_r -> 0.3526 by construction, ' +
  'so no independent coefficient prediction, no closed form, no bound moved, no operator ' +
  'positivity. The measured 0.3526 slope stands unchanged (imp-96443).';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96636_ASSERTIONS = [
  {
    id: 'imp96636-br-sequence-matches-imp96612',
    holds: () =>
      IMP96636_BR_SEQUENCE.length === 12 &&
      IMP96636_BR_SEQUENCE[0].b === 0.0 &&
      Math.abs(IMP96636_BR_SEQUENCE[11].b - 0.35232119) < 1e-8 &&
      Math.abs(IMP96636_BR_SEQUENCE[11].b - IMP96636_TARGET_SLOPE) < 5e-3,
    why: 'the fitted sequence is the imp-96612 rank-r table (b_0 = 0, b_11 = 0.35232 within 0.5% of the 0.3526 target).',
  },
  {
    id: 'imp96636-exp-saturation-is-poor-fit',
    holds: () =>
      IMP96636_EXP_FIXED.goodFit === false &&
      IMP96636_EXP_FIXED.r2 < 0.93 &&
      IMP96636_EXP_FIXED.r0 > 3.0 &&
      IMP96636_EXP_FIXED.r0 < 3.5 &&
      Math.abs(IMP96636_EXP_FIXED.halfSaturationRank - IMP96636_EXP_FIXED.r0 * Math.LN2) < 1e-4,
    why: 'the requested single-exponential saturation gives r0 ~ 3.22 (half-saturation r0 ln2 ~ 2.23) but only R^2 = 0.919 -- a poor, S-shaped fit.',
  },
  {
    id: 'imp96636-implied-r0-drifts-not-constant',
    holds: () =>
      IMP96636_IMPLIED_R0_DRIFT[0].r0 > 20 &&
      IMP96636_IMPLIED_R0_DRIFT[IMP96636_IMPLIED_R0_DRIFT.length - 1].r0 < 1.6 &&
      IMP96636_IMPLIED_R0_DRIFT.every(
        (row, i) => i === 0 || row.r0 <= IMP96636_IMPLIED_R0_DRIFT[i - 1].r0 + 1e-9,
      ),
    why: 'the per-rung implied r0 drifts monotonically 20.72 -> 1.56 -- the direct signature that a single exponential has the wrong curvature.',
  },
  {
    id: 'imp96636-logistic-is-the-honest-summary',
    holds: () =>
      IMP96636_LOGISTIC.goodFit === true &&
      IMP96636_LOGISTIC.r2 > 0.995 &&
      IMP96636_LOGISTIC.r0 > 2.8 &&
      IMP96636_LOGISTIC.r0 < 3.1 &&
      IMP96636_LOGISTIC.r2 > IMP96636_EXP_FIXED.r2 &&
      IMP96636_LOGISTIC.rmse < IMP96636_EXP_FIXED.rmse,
    why: 'the logistic in r (half-saturation rank ~2.94, R^2 = 0.996) fits far better than the exponential -- the honest continuous mode-count summary.',
  },
  {
    id: 'imp96636-free-amp-overshoots-asymptote',
    holds: () =>
      IMP96636_EXP_FREE.amplitudeOvershootsAsymptote === true &&
      IMP96636_EXP_FREE.A > IMP96636_TARGET_SLOPE,
    why: 'freeing the amplitude does not rescue the exponential: A = 0.415 overshoots the known asymptote L = 0.3526, which is unphysical since b_r -> L.',
  },
  {
    id: 'imp96636-honesty-gate-no-qed',
    holds: () =>
      IMP96636_VERDICT.requestedExpSaturationIsGoodFit === false &&
      IMP96636_VERDICT.bestModel === 'logistic' &&
      IMP96636_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96636_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96636_HONEST_BANNER) &&
      /RH open/.test(IMP96636_HONEST_BANNER) &&
      /sigmoidal-half-saturation-rank/.test(IMP96636_SUBGAP.id),
    why: 'measurement only: the requested exponential fails, the logistic is the summary, no bound moved, and the honesty markers plus the sharpened sub-gap are present.',
  },
];

for (const a of IMP96636_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96636-route-m-lammax-slope-saturation-fit assertion failed: ${a.id}`,
    );
  }
}

export default {
  targetSlope: IMP96636_TARGET_SLOPE,
  brSequence: IMP96636_BR_SEQUENCE,
  expFixed: IMP96636_EXP_FIXED,
  expFree: IMP96636_EXP_FREE,
  logistic: IMP96636_LOGISTIC,
  impliedR0Drift: IMP96636_IMPLIED_R0_DRIFT,
  verdict: IMP96636_VERDICT,
  subGap: IMP96636_SUBGAP,
  banner: IMP96636_HONEST_BANNER,
};
