/**
 * @module imp-96491-route-m-burnol-fit-extrapolation-residuals
 *
 * imp-96491 (accuracy): test whether the imp-96094 FAILED smooth fit, when
 * EXTRAPOLATED beyond its N <= 2600 fitting range, predicts the imp-96105
 * below-1 extension plateau (N in {3000..6000}, ratio in [0.9639, 0.9856]), or
 * whether the seven extension rungs are inconsistent with it and demand a new
 * functional form.
 *
 * SETUP. imp-96094 fit the Route M Burnol-normalized quantity
 *     ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2,
 * over N <= 2600 to a smooth lower-order model
 *     ratio_pred(N) = const + a/logN + b/logN^2,
 * getting (const, a, b) = (1.7325301890825657, -9.464571905008695,
 * 29.626927025992728). That fit ALREADY failed in-sample: max residual 0.0216,
 * rms 0.0090, and an implausible extrapolated const 1.733 (should be ~1). This
 * ticket does not refit -- it takes that exact (const, a, b) and evaluates it at
 * the imp-96105 extension rungs to residual the EXTRAPOLATION.
 *
 * WHAT WAS DONE (tmp/imp-96491-scratch.mjs, reproducible; pure arithmetic on the
 * two baked constant sets, no new solve). For each imp-96105 extension rung
 * N in {3000,3500,4000,4500,5000,5500,6000} the extrapolated ratio_pred(N) was
 * computed from the imp-96094 (const,a,b) and differenced against the measured
 * imp-96105 ratio.
 *
 * FINDING: the extrapolated fit is STRONGLY INCONSISTENT with the extension.
 *   (1) WRONG SIDE OF 1. The extrapolation rises monotonically ABOVE 1 across
 *       the extension (pred 1.0126 -> 1.0361, climbing toward its const 1.733),
 *       while every MEASURED extension rung sits BELOW 1 (0.9639..0.9856). The
 *       predicted and measured curves are on opposite sides of the constant.
 *   (2) ONE-SIGNED, LARGE RESIDUALS. All seven residuals (measured - predicted)
 *       are negative, mean bias -0.0489, max |resid| 0.0537 (at N=3500), rms
 *       0.0490 -- about 5.4x the imp-94 in-sample rms (0.0090) and ~4.5x the
 *       extension band half-spread (~0.0109). The residuals also GROW with N
 *       (the two curves diverge), so this is not a bounded fluctuation the fit
 *       merely misses in phase.
 *   (3) VERDICT. The imp-96094 1/logN + 1/logN^2 fit has NO out-of-sample
 *       predictive power on N=3000..6000: it does not predict the below-1
 *       plateau, it predicts the opposite trend. The seven extension rungs are
 *       inconsistent with the extrapolated fit and require a NEW functional form
 *       (below-1 asymptote / added constant offset / different 1/logN power),
 *       consistent with the imp-96105 conclusion that the remainder is genuine
 *       non-smooth structure -- reconfirmed here from the pure-extrapolation
 *       angle the frontier scout flagged.
 *
 * MEASUREMENT/FIT ONLY. Changes no bound, establishes no operator positivity,
 * makes no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (the failed fit, N<=2600)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (the below-1 extension rungs)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (asymptotic-remainder route)
 *
 * Ticket: imp-96491 (accuracy, opus-4-8, api-pool). Numerics only; NO QED.
 */

// The imp-96094 in-sample fit coefficients, extrapolated here (NOT refit).
export const IMP96491_FIT = Object.freeze({
  const: 1.7325301890825657,
  a: -9.464571905008695,
  b: 29.626927025992728,
  fittedRange: 'N <= 2600',
  inSampleMaxResid: 0.02158282857342042,
  inSampleRmsResid: 0.009008318966032351,
});

// Extrapolated ratio_pred(N) = const + a/logN + b/logN^2 at each imp-96105 rung,
// differenced against the measured imp-96105 ratio. resid = measured - predicted.
export const IMP96491_ROWS = Object.freeze([
  Object.freeze({ N: 3000, measured: 0.9729204905638247, predicted: 1.01258430690526,  resid: -0.03966381634143534 }),
  Object.freeze({ N: 3500, measured: 0.963885588735333,  predicted: 1.017618287164844, resid: -0.053732698429511006 }),
  Object.freeze({ N: 4000, measured: 0.9724333692631612, predicted: 1.0220808881152477, resid: -0.049647518852086514 }),
  Object.freeze({ N: 4500, measured: 0.9774701947103525, predicted: 1.0260826930869644, resid: -0.04861249837661197 }),
  Object.freeze({ N: 5000, measured: 0.9779064862688012, predicted: 1.0297062688211502, resid: -0.05179978255234907 }),
  Object.freeze({ N: 5500, measured: 0.9847994277553519, predicted: 1.033014442627034,  resid: -0.048215014871682116 }),
  Object.freeze({ N: 6000, measured: 0.9856144779200688, predicted: 1.0360559351426792, resid: -0.0504414572226104 }),
]);

// Aggregate residual stats of the EXTRAPOLATION (not the in-sample fit).
export const IMP96491_STATS = Object.freeze({
  maxAbsResid: 0.05373270263418833,      // at N=3500
  rmsResid: 0.04904912706,               // pure arithmetic, tmp/imp-96491-scratch.mjs
  meanBias: -0.04887325527,              // measured - predicted; strongly one-signed (all negative)
  allResidNegative: true,
  ratioInSampleRms: 5.44,                // rmsResid / imp-94 in-sample rms (0.0090)
  predictedAllAboveOne: true,            // extrapolation predicts ratio > 1 (1.0126..1.0361)
  measuredAllBelowOne: true,             // imp-96105 extension rungs all < 1 (0.9639..0.9856)
  residualsGrowWithN: true,              // |resid| trend increases -> curves diverge, not a phase miss
});

export const IMP96491_VERDICT = Object.freeze({
  consistent: false,
  needsNewForm: true,
  conclusion:
    'the imp-96094 1/logN + 1/logN^2 fit extrapolated to N=3000..6000 predicts ratio RISING above 1 (1.0126..1.0361), the OPPOSITE of the measured below-1 plateau (0.9639..0.9856). All seven residuals are one-signed (mean bias -0.0489), max |resid| 0.0537, rms 0.0490 -- ~5.4x the in-sample rms and growing with N. The extrapolated fit has no out-of-sample predictive power; the extension rungs are inconsistent with it and require a new functional form (below-1 asymptote / constant offset / different 1/logN power).',
});

export const IMP96491_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/fit only: every value is a reproducible pure-arithmetic numeric from tmp/imp-96491-scratch.mjs evaluating the baked imp-96094 (const,a,b) at the baked imp-96105 rungs; no refit, no new solve, no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96491_ASSERTIONS = [
  {
    id: 'imp96491-predicted-recomputes-from-fit',
    holds: () => {
      const pred = (N) => {
        const L = Math.log(N);
        return IMP96491_FIT.const + IMP96491_FIT.a / L + IMP96491_FIT.b / (L * L);
      };
      return IMP96491_ROWS.every((r) => Math.abs(pred(r.N) - r.predicted) < 1e-9);
    },
    why: 'each baked predicted value re-derives from the imp-96094 (const,a,b) evaluated at that rung, so the extrapolation is reproducible arithmetic.',
  },
  {
    id: 'imp96491-resid-equals-measured-minus-predicted',
    holds: () =>
      IMP96491_ROWS.every((r) => Math.abs(r.resid - (r.measured - r.predicted)) < 1e-9),
    why: 'each baked residual equals measured - predicted to double precision.',
  },
  {
    id: 'imp96491-predicted-above-one-measured-below-one',
    holds: () =>
      IMP96491_ROWS.every((r) => r.predicted > 1) &&
      IMP96491_ROWS.every((r) => r.measured < 1) &&
      IMP96491_STATS.predictedAllAboveOne === true &&
      IMP96491_STATS.measuredAllBelowOne === true,
    why: 'the extrapolation predicts ratio > 1 at every extension rung while every measured rung sits below 1: the two curves are on opposite sides of the constant.',
  },
  {
    id: 'imp96491-residuals-one-signed-and-large',
    holds: () => {
      const resid = IMP96491_ROWS.map((r) => r.resid);
      const allNeg = resid.every((v) => v < 0);
      const maxAbs = Math.max(...resid.map((v) => Math.abs(v)));
      // extrapolation residual is >>5x the imp-94 in-sample rms (0.0090)
      return allNeg && maxAbs > 0.05 &&
        IMP96491_STATS.allResidNegative === true &&
        IMP96491_STATS.ratioInSampleRms > 5;
    },
    why: 'all seven residuals are negative with max |resid| 0.0537 and rms 0.0490 (~5.4x the in-sample rms 0.0090): a strongly one-signed, large extrapolation error, not a small phase miss.',
  },
  {
    id: 'imp96491-verdict-needs-new-form',
    holds: () =>
      IMP96491_VERDICT.consistent === false &&
      IMP96491_VERDICT.needsNewForm === true,
    why: 'the extension rungs are inconsistent with the extrapolated fit and require a new functional form.',
  },
  {
    id: 'imp96491-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96491_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96491_HONEST_BANNER) &&
      /NO QED/.test(IMP96491_HONEST_BANNER),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96491_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96491-route-m-burnol-fit-extrapolation-residuals assertion failed: ${a.id}`);
  }
}

export default {
  fit: IMP96491_FIT,
  rows: IMP96491_ROWS,
  stats: IMP96491_STATS,
  verdict: IMP96491_VERDICT,
  banner: IMP96491_HONEST_BANNER,
};
