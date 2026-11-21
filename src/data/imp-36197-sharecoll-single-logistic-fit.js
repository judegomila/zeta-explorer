/**
 * @module imp-36197-sharecoll-single-logistic-fit
 * @fileoverview imp-36197 -- FUNCTIONAL-FORM measurement on the imp-36111 merged
 *   five-landmark shareColl decay sequence (0.783 -> 0.716 -> 0.407 -> 0.100 ->
 *   0.0099). imp-36111 asserts the five landmarks are "five successive samples of
 *   that single decaying arm" of the roadmap sigma(N) = E_coll(N)/E(N) U-shape past
 *   its N ~ 9.22e5 peak. This module tests that claim QUANTITATIVELY: does ONE
 *   closed-form law fit all five N-samples within tabulation precision, or do the
 *   samples require piecewise fits?
 *
 *   MECHANISM. shareColl IS sigma(N): shareColl = E_coll/(E_trunc + E_flow + E_coll)
 *   = E_coll/E(N) = sigma(N). With E_flow negligible and E_trunc a near-constant
 *   floor, sigma = 1/(1 + E_trunc/E_coll). If the surviving ratio E_trunc/E_coll is a
 *   single power law in N (E_coll ~ sqrt(log T0/N) decays, E_trunc const, so the
 *   ratio ~ N^p up to log factors), then the LOGIT of sigma,
 *     logit(sigma) = ln( sigma / (1 - sigma) ) = ln( E_coll/E_trunc ),
 *   is LINEAR in log10 N -- i.e. a single two-parameter logistic law fits the whole
 *   arm. This module measures that linearity directly.
 *
 *   RESULT (measurement only; recomputed here from the recorded imp-35977/imp-36046
 *   share literals, no new surrogate evaluation):
 *     - The per-segment logit slope d[logit(sigma)]/d[log10 N] is REMARKABLY constant
 *       across all four consecutive segments: -1.0695, -1.0900, -1.1038, -1.1111.
 *       It drifts only ~4% (monotone STEEPENING), never breaks.
 *     - A single ordinary-least-squares logistic fit
 *         logit(sigma) = 10.4734 - 1.1020 * log10 N
 *       equivalently  sigma(N) = 1 / ( 1 + 10^{ 1.1020 * (log10 N - 9.5040) } )
 *       (midpoint sigma = 1/2 at N ~ 3.19e9, sitting exactly between the elbow/flow-
 *       crossing pair and the flattest/sigma-0.1/sole-survivor trio -- the imp-35337
 *       balance crossover) reproduces ALL FIVE recorded shareColl values with
 *       max |residual| ~ 0.0032 in sigma (~0.013 in logit), well inside the ~5e-3
 *       tabulation tolerance the imp-35977/imp-36046 source modules use on their own
 *       recorded shares.
 *
 *   VERDICT: a SINGLE closed-form law fits all five samples; NO piecewise fit is
 *   required. The small monotone ~4% slope drift is precisely the imp-33582
 *   running-exponent signature -- one arm whose local decay exponent varies slowly,
 *   NOT a structural break. This QUANTIFIES the imp-36111 "single decaying arm"
 *   claim (which imp-36111 stated only qualitatively, as monotone decay).
 *
 *   Ticket: imp-36197 (numerical, opus-4-8, api-pool). Measurement only; no
 *   re-derivation of the surrogate; C_C = (1/8) sqrt(3 pi) GUE-conditional
 *   (imp-2642/imp-2643/imp-486) untouched; imp-35337a stays OPEN; changes no bound;
 *   NO QED; no refereed bound is changed.
 *
 * @see imp-36111-e-share-tail-storyline-crossref (the five-landmark combinedSequence this fits)
 * @see imp-36179-sharecoll-decay-crossvalidation (independent direct recomputation of the same shares)
 * @see imp-35977-e-share-stacked-bar-viz-data (the two-knee bars: elbow, flattest)
 * @see imp-36046-e-share-tail-landmarks-viz-data (the three tail bars: flow-crossing, sigma-0.1, sole-survivor)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the running local-exponent form)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35977_E_SHARE_BARS } from './imp-35977-e-share-stacked-bar-viz-data.js';
import { IMP36046_E_SHARE_TAIL_BARS } from './imp-36046-e-share-tail-landmarks-viz-data.js';

// Five landmarks in strictly increasing-N order (peak-to-tail arc), same merge as
// the imp-36111 combinedSequence -- recorded shareColl literals only, no new numerics.
const LANDMARKS = [
  { label: 'Kneedle-elbow', N: IMP35977_E_SHARE_BARS[0].N, shareColl: IMP35977_E_SHARE_BARS[0].shareColl },
  { label: 'E_flow-1pct-crossing', N: IMP36046_E_SHARE_TAIL_BARS[0].N, shareColl: IMP36046_E_SHARE_TAIL_BARS[0].shareColl },
  { label: 'Flattest-point', N: IMP35977_E_SHARE_BARS[1].N, shareColl: IMP35977_E_SHARE_BARS[1].shareColl },
  { label: 'Sigma-0.1-landmark', N: IMP36046_E_SHARE_TAIL_BARS[1].N, shareColl: IMP36046_E_SHARE_TAIL_BARS[1].shareColl },
  { label: 'Sole-survivor', N: IMP36046_E_SHARE_TAIL_BARS[2].N, shareColl: IMP36046_E_SHARE_TAIL_BARS[2].shareColl },
];

const logit = (s) => Math.log(s / (1 - s));

const xs = LANDMARKS.map((p) => Math.log10(p.N)); // log10 N
const ys = LANDMARKS.map((p) => logit(p.shareColl)); // logit(sigma)

// Per-segment logit slope: if these are near-constant, one logistic law spans the arm.
const segmentSlopes = LANDMARKS.slice(1).map((p, i) => ({
  from: LANDMARKS[i].label,
  to: p.label,
  slope: (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]),
}));

// Ordinary-least-squares fit  logit(sigma) = a + b * log10 N.
const n = LANDMARKS.length;
const meanX = xs.reduce((s, v) => s + v, 0) / n;
const meanY = ys.reduce((s, v) => s + v, 0) / n;
let Sxx = 0;
let Sxy = 0;
for (let i = 0; i < n; i++) {
  Sxx += (xs[i] - meanX) ** 2;
  Sxy += (xs[i] - meanX) * (ys[i] - meanY);
}
const b = Sxy / Sxx; // logit slope per decade (negative: sigma decays)
const a = meanY - b * meanX; // logit intercept
const x50 = -a / b; // log10 N at sigma = 1/2 (logistic midpoint)
const p = -b; // decay exponent magnitude (the imp-33582 running exponent, here fixed)

// Residuals of the single-logistic fit, in both logit and sigma space.
const residuals = LANDMARKS.map((pt, i) => {
  const predLogit = a + b * xs[i];
  const predSigma = 1 / (1 + Math.exp(-predLogit));
  return {
    label: pt.label,
    residLogit: ys[i] - predLogit,
    residSigma: pt.shareColl - predSigma,
  };
});
const maxAbsResidSigma = Math.max(...residuals.map((r) => Math.abs(r.residSigma)));
const maxAbsResidLogit = Math.max(...residuals.map((r) => Math.abs(r.residLogit)));

// Tolerance the imp-35977/imp-36046 source modules themselves apply to these
// recorded landmark shares (they assert shareColl to within ~5e-3 / ~1e-4).
const TABULATION_TOLERANCE = 5e-3;

export const IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT = Object.freeze({
  id: 'imp-36197',
  title:
    'Functional-form measurement: a SINGLE two-parameter logistic in log10 N fits the imp-36111 merged ' +
    'five-landmark shareColl decay sequence (0.783 -> 0.716 -> 0.407 -> 0.100 -> 0.0099) within tabulation ' +
    'precision -- no piecewise fit required; the ~4% slope drift is the imp-33582 running exponent',

  question:
    'imp-36111 asserts the five landmarks are five successive samples of one decaying sigma(N) arm past the ' +
    'N ~ 9.22e5 peak. Does ONE closed-form law fit all five N-samples within tabulation precision, or do the ' +
    'samples require piecewise fits?',

  landmarks: LANDMARKS.map((pt, i) => ({
    label: pt.label,
    N: pt.N,
    log10_N: xs[i],
    shareColl: pt.shareColl,
    logit: ys[i],
  })),

  segmentSlopes: segmentSlopes.map((s) => ({ ...s })),

  singleLogisticFit: Object.freeze({
    form: 'logit(sigma) = a + b * log10 N ;  sigma(N) = 1 / (1 + 10^{ p * (log10 N - x50) })',
    a,
    b,
    p,
    x50,
    N_at_half: 10 ** x50,
    K_ratio_coefficient: Math.exp(a), // sigma/(1-sigma) = K * N^{b/ln10}
    note:
      'x50 ~ 9.5040 (N ~ 3.19e9) sits between the elbow/flow-crossing pair and the flattest/sigma-0.1/' +
      'sole-survivor trio -- the imp-35337 E_trunc = E_coll balance crossover at sigma = 1/2.',
  }),

  residuals: residuals.map((r) => ({ ...r })),
  maxAbsResidSigma,
  maxAbsResidLogit,
  tabulationTolerance: TABULATION_TOLERANCE,

  verdict:
    'SINGLE closed-form fits: one two-parameter logistic in log10 N reproduces all five recorded shareColl ' +
    'values with max |residual| ~ 0.0032 in sigma (~0.013 in logit), inside the ~5e-3 tabulation tolerance the ' +
    'imp-35977/imp-36046 sources use on these landmarks. NO piecewise fit is required. The per-segment logit ' +
    'slope stays within ~4% (-1.0695 -> -1.1111, a slow monotone steepening), which is the imp-33582 ' +
    'running-exponent signature of one arm, not a structural break. This QUANTIFIES the imp-36111 ' +
    'single-decaying-arm claim. Measurement only; changes no bound; imp-35337a stays OPEN; NO QED. ' +
    'No refereed bound is changed.',

  honestCaveat: Object.freeze({
    isProof: false,
    changesAnyBound: false,
    dischargesAnyObligation: false,
    portsAnyRoute: false,
    reDerivesSurrogate: false,
    sota: 'No refereed bound is changed',
  }),
});

export const IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT_ASSERTIONS = [
  {
    id: 'imp36197-five-landmarks-increasing-N',
    why: 'The fit must run over the five landmarks in strictly increasing-N order (the peak-to-tail arc).',
    holds: () =>
      IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.landmarks.length === 5 &&
      IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.landmarks.every(
        (m, i, arr) => i === 0 || m.N > arr[i - 1].N,
      ),
  },
  {
    id: 'imp36197-single-logistic-fits-within-tabulation',
    why: 'The core claim: one logistic law reproduces all five shareColl values within the source tabulation tolerance.',
    holds: () =>
      IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.maxAbsResidSigma <
      IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.tabulationTolerance,
  },
  {
    id: 'imp36197-logit-slope-near-constant',
    why: 'The single-form claim rests on the per-segment logit slope being near-constant (no piecewise break).',
    holds: () => {
      const slopes = IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.segmentSlopes.map((s) => s.slope);
      const spread = Math.max(...slopes) - Math.min(...slopes);
      // All four segment slopes negative and within ~5% of one another (measured ~4%).
      return slopes.every((s) => s < 0) && Math.abs(spread) < 0.05 * Math.abs(slopes[0]);
    },
  },
  {
    id: 'imp36197-slope-drift-is-monotone-steepening',
    why: 'The residual drift must be the imp-33582 running-exponent (monotone steepening), not an oscillatory break.',
    holds: () => {
      const slopes = IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.segmentSlopes.map((s) => s.slope);
      // Strictly increasing in magnitude (more negative) segment to segment.
      return slopes.every((s, i) => i === 0 || s < slopes[i - 1]);
    },
  },
  {
    id: 'imp36197-midpoint-matches-imp35337-crossover',
    why: 'The fitted logistic midpoint (sigma = 1/2) must land between the two landmark groups, i.e. the imp-35337 crossover.',
    holds: () => {
      const fit = IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.singleLogisticFit;
      const flowCrossing = IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.landmarks[1].N;
      const flattest = IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.landmarks[2].N;
      return fit.N_at_half > flowCrossing && fit.N_at_half < flattest;
    },
  },
  {
    id: 'imp36197-honesty-gate',
    why: 'This is a measurement note: it must not claim to discharge any obligation, port any route, or change any bound.',
    holds: () =>
      IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.honestCaveat.dischargesAnyObligation === false &&
      IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.honestCaveat.portsAnyRoute === false &&
      IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.honestCaveat.changesAnyBound === false &&
      /NO QED/.test(IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT.verdict),
  },
];

for (const assertion of IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36197-sharecoll-single-logistic-fit assertion failed: ${assertion.id}`);
  }
}

export default IMP36197_SHARECOLL_SINGLE_LOGISTIC_FIT;
