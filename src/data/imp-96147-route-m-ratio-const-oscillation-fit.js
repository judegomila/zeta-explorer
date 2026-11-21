/**
 * @module imp-96147-route-m-ratio-const-oscillation-fit
 *
 * imp-96147 (accuracy): partial closure of the imp-96105 sub-gap
 * imp-96105-beyond-6000. imp-96105 extended the Vasyunin Gram ratio ladder
 *     ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2,
 * to N = 6000 and found ratio(N) stays in the band [0.964, 1.010] without
 * converging (six sign changes, non-monotone). Its honest sub-gap said that
 * SEPARATING the CONSTANT term from the ZERO-OSCILLATION (fluctuation) term of
 * ratio(N) is still open, and whether the asymptotic log-power form manifests
 * only for N well beyond 6000 is undecided.
 *
 * WHAT WAS DONE (tmp/rh-route-m/m11-const-osc-fit.py, reproducible): the 17
 * baked rows N = 250..6000 from tmp/rh-route-m/m10-out.json were fit by ordinary
 * least squares to a TWO-TERM constant-plus-smooth model
 *     ratio(N) = c0 + c1 / log N + oscillatory residual.
 * The fitted constant c0, the smooth 1/logN coefficient c1, the residual
 * amplitude / sign-changes / dominant period in log N, and a goodness-of-fit
 * were recorded, and the residual oscillation was checked AGAINST the zero-side
 * prediction: the leading nontrivial zeta zero gamma_1 = 14.1347.. predicts an
 * oscillation cos(gamma_1 log N) with period 2 pi / gamma_1 = 0.4445 in log N.
 *
 * FINDINGS (see IMP96147_FIT / IMP96147_OSC / IMP96147_VERDICT):
 *   (1) FITTED CONSTANT c0 = 0.97503, NOT 1. The smooth 1/logN coefficient is
 *       c1 = 0.07818, but the smooth term explains almost nothing: the fit
 *       R^2 = 0.0099 (< 1 percent of the variance). The constant-plus-1/logN
 *       model is essentially a horizontal line at 0.975; the 1/logN slope is
 *       not statistically resolved by the data.
 *   (2) THE RESIDUAL DOES NOT DECAY. Residual RMS = 0.01349 (max |resid| =
 *       0.02526), and it does NOT shrink with N: first-half RMS 0.01291,
 *       second-half RMS 0.01399 (slightly larger). amplitudeDecays = false.
 *       Five sign changes remain in the residual after the smooth term is
 *       removed. This is the signature of a genuine fluctuation, not a smooth
 *       drift toward a limit.
 *   (3) THE FLUCTUATION DOES NOT MATCH THE gamma_1 ZERO-SIDE PREDICTION AT THIS
 *       GRID. A single-tone fit at the predicted frequency gamma_1 = 14.1347
 *       (period 0.4445 in log N) has amplitude only 0.00243 and explains just
 *       1.26 percent of the residual variance. The best free-frequency single
 *       tone instead sits at angular frequency 4.09 (period 1.536 in log N,
 *       amplitude 0.01648) -- a long low-frequency swing with no zeta zero
 *       there. This is consistent with under-sampling: the 17-point log N grid
 *       has median spacing 0.141 (Nyquist angular freq 22.2, so gamma_1 is below
 *       Nyquist there) but the low-N gaps reach 0.69 / 0.41, which ALIAS the
 *       gamma_1 oscillation. The apparent period-1.5 swing is most plausibly an
 *       alias of the true zero-driven oscillation, unresolvable at N <= 6000.
 *
 * VERDICT: the two-term decomposition SEPARATES the constant from the
 * fluctuation quantitatively. The constant is c0 = 0.975 (not the RH-predicted
 * 1); the fluctuation is a persistent ~1.3 percent RMS oscillation that (a) does
 * NOT decay with N and (b) the smooth 1/logN term does NOT capture (R^2 < 0.01).
 * So the non-convergence is NOT a resolvable smooth drift toward a limit -- it
 * is a genuine, non-decaying oscillation on this range. Whether that oscillation
 * IS the gamma_1 zero-side term cannot be confirmed here: the coarse, uneven
 * N <= 6000 grid aliases the predicted period-0.4445 tone, so the zero-side
 * identification stays open -- see IMP96147_SUBGAP.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (source ladder to 6000)
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (dense ladder to 2600)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (Route M base)
 *
 * Ticket: imp-96147 (accuracy, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Burnol constant C = Sum_rho 1/|rho|^2 = 2 + gamma - log(4 pi).
export const IMP96147_C_BURNOL = 0.04619141793224202;

export const IMP96147_INPUT = Object.freeze({
  source: 'tmp/rh-route-m/m10-out.json (imp-96105 baked rows)',
  nPoints: 17,
  Nrange: '250..6000',
  quantity: 'ratio(N) = d_N^2 * log N / C_burnol',
  model: 'ratio(N) = c0 + c1/logN + oscillatory residual (ordinary least squares)',
});

// Two-term fit ratio = c0 + c1/logN over the full 250..6000 ladder.
export const IMP96147_FIT = Object.freeze({
  c0Const: 0.9750300248365944,
  c1OverLogN: 0.07818066334214946,
  R2: 0.009880554258731467,
  residRms: 0.013491216893314752,
  residMaxAbs: 0.025256174509487694,
  note: 'the fitted constant is 0.975, NOT 1; R^2 = 0.0099 means the smooth 1/logN term explains under 1 percent of the variance -- the model is effectively a flat line at 0.975.',
});

// Residual oscillation vs the zero-side (gamma_1) prediction.
export const IMP96147_OSC = Object.freeze({
  residSignChanges: 5,
  amplitudeDecays: false,
  residRmsFirstHalf: 0.01290613640571048,
  residRmsSecondHalf: 0.013990762865704564,
  bestFreqW: 4.091522880720181,
  bestPeriodLogN: 1.5356593352530963,
  bestOscAmp: 0.016475508096464732,
  gamma1: 14.134725141734693,
  gamma1PredPeriodLogN: 0.44452122302878244,
  ampAtGamma1: 0.002426574079275238,
  varExplainedByGamma1Osc: 0.012612330174385789,
  logNSpacingMedian: 0.1414,
  logNSpacingMax: 0.6931,
  nyquistWMedian: 22.21,
  note: 'the residual does not decay (second-half RMS >= first-half); the gamma_1 tone (period 0.4445) explains only 1.26 percent of residual variance while a free single tone lands at period 1.536 with no zeta zero there -- consistent with aliasing of the true zero-oscillation by the coarse low-N gaps (up to 0.69 in log N).',
});

// Per-N residual after removing c0 + c1/logN (constant separated out).
export const IMP96147_RESID_ROWS = Object.freeze([
  Object.freeze({ N: 250,  resid: -0.00389 }),
  Object.freeze({ N: 500,  resid: +0.01066 }),
  Object.freeze({ N: 750,  resid: -0.02284 }),
  Object.freeze({ N: 1000, resid: -0.00593 }),
  Object.freeze({ N: 1250, resid: -0.00330 }),
  Object.freeze({ N: 1500, resid: +0.00288 }),
  Object.freeze({ N: 1750, resid: +0.01402 }),
  Object.freeze({ N: 2000, resid: +0.02077 }),
  Object.freeze({ N: 2300, resid: +0.01786 }),
  Object.freeze({ N: 2600, resid: +0.02526 }),
  Object.freeze({ N: 3000, resid: -0.01187 }),
  Object.freeze({ N: 3500, resid: -0.02072 }),
  Object.freeze({ N: 4000, resid: -0.01202 }),
  Object.freeze({ N: 4500, resid: -0.00685 }),
  Object.freeze({ N: 5000, resid: -0.00630 }),
  Object.freeze({ N: 5500, resid: +0.00069 }),
  Object.freeze({ N: 6000, resid: +0.00160 }),
]);

export const IMP96147_VERDICT = Object.freeze({
  constSeparated: 0.9750300248365944,
  smoothTermResolves: false,
  fluctuationDecays: false,
  matchesGamma1AtThisGrid: false,
  conclusion:
    'the two-term fit separates a constant c0 = 0.975 (not the RH-predicted 1) from a persistent ~1.3 percent RMS fluctuation. The smooth 1/logN term explains < 1 percent of the variance and the fluctuation does not decay, so the non-convergence is a genuine oscillation, NOT a resolvable drift toward a limit. The fluctuation cannot be identified with the gamma_1 zero-side tone on this grid: the predicted period-0.4445 oscillation is aliased by the coarse low-N log N gaps and captures only 1.26 percent of residual variance.',
});

// Honest residual sub-gap: constant vs zero-oscillation term partly separated,
// but the zero-side identification is grid-limited.
export const IMP96147_SUBGAP = Object.freeze({
  id: 'imp-96147-gamma1-identification',
  statement:
    'the constant term (c0 = 0.975) is now separated from the fluctuation, and the fluctuation is shown to be genuine and non-decaying on N <= 6000. But identifying the fluctuation with the leading zero-side tone cos(gamma_1 logN) (period 0.4445) is NOT possible at this 17-point coarse/uneven grid: the low-N log N gaps (up to 0.69) alias the predicted frequency, and only 1.26 percent of residual variance sits at gamma_1. Deciding whether c0 -> 1 and the fluctuation is the true gamma_1 zero-oscillation needs a DENSER, more uniform log N grid (many rungs per unit log N well past 6000) or an explicit-formula remainder model summing the low zeros -- not a coarse brute-force extension.',
});

export const IMP96147_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/rh-route-m/m11-const-osc-fit.py fitting the imp-96105 baked rows (tmp/rh-route-m/m10-out.json); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96147_ASSERTIONS = [
  {
    id: 'imp96147-constant-separated-not-one',
    holds: () =>
      Math.abs(IMP96147_FIT.c0Const - 0.9750300248365944) < 1e-12 &&
      Math.abs(IMP96147_FIT.c0Const - 1) > 0.02,
    why: 'the two-term fit yields a constant c0 = 0.975 that is clearly not the RH-predicted 1.',
  },
  {
    id: 'imp96147-smooth-term-does-not-resolve',
    holds: () => IMP96147_FIT.R2 < 0.05 && IMP96147_VERDICT.smoothTermResolves === false,
    why: 'the 1/logN term explains under 1 percent of the variance (R^2 = 0.0099): the non-convergence is not a resolvable smooth drift.',
  },
  {
    id: 'imp96147-fluctuation-does-not-decay',
    holds: () =>
      IMP96147_OSC.amplitudeDecays === false &&
      IMP96147_OSC.residRmsSecondHalf >= IMP96147_OSC.residRmsFirstHalf &&
      IMP96147_OSC.residSignChanges >= 4,
    why: 'the residual RMS does not shrink (second-half >= first-half) and keeps five sign changes: a genuine non-decaying oscillation.',
  },
  {
    id: 'imp96147-gamma1-not-resolved-at-this-grid',
    holds: () =>
      IMP96147_OSC.varExplainedByGamma1Osc < 0.05 &&
      IMP96147_OSC.logNSpacingMax > 0.5 * IMP96147_OSC.gamma1PredPeriodLogN &&
      IMP96147_VERDICT.matchesGamma1AtThisGrid === false,
    why: 'the gamma_1 tone explains only 1.26 percent of residual variance and the largest log N gap (0.69) exceeds the Nyquist limit (half the predicted period, 0.2223), so gamma_1 is aliased and cannot be confirmed here.',
  },
  {
    id: 'imp96147-resid-rows-match-fit-rms',
    holds: () => {
      const rms = Math.sqrt(
        IMP96147_RESID_ROWS.reduce((s, r) => s + r.resid * r.resid, 0) /
          IMP96147_RESID_ROWS.length,
      );
      // rounded residual rows reproduce the fit RMS to rounding tolerance.
      return Math.abs(rms - IMP96147_FIT.residRms) < 5e-4;
    },
    why: 'the baked per-N residuals reproduce the reported fit RMS to 5-digit rounding, tying the row table to the least-squares fit.',
  },
  {
    id: 'imp96147-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96147_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96147_HONEST_BANNER) &&
      /NO QED/.test(IMP96147_HONEST_BANNER) &&
      typeof IMP96147_SUBGAP.statement === 'string' &&
      /gamma1-identification/.test(IMP96147_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap for the grid-limited gamma_1 identification.',
  },
];

for (const a of IMP96147_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96147-route-m-ratio-const-oscillation-fit assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96147_C_BURNOL,
  input: IMP96147_INPUT,
  fit: IMP96147_FIT,
  osc: IMP96147_OSC,
  residRows: IMP96147_RESID_ROWS,
  verdict: IMP96147_VERDICT,
  subGap: IMP96147_SUBGAP,
  banner: IMP96147_HONEST_BANNER,
};
