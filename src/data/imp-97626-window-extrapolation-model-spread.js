/**
 * @module imp-97626-window-extrapolation-model-spread
 * @fileoverview imp-97626 -- BOUND the imp-97564 window->infinite-line extrapolation-MODEL uncertainty. imp-97564
 *   FINDING 2 climbed R = lambda_max(P_a M_sigma2^- P_a) from 1343.796 (window half-width T=12) to 1549.627 (T=64)
 *   with decelerating increments and extrapolated R_inf ~ 1573 (realizable fraction ~ 0.513) from a two-rung 1/T
 *   Richardson step on the LAST TWO rungs only (T=48,64). A single tail-model / two-rung step carries no error bar.
 *   This leaf refits the FULL T=12..64 ladder under three asymptotic tail models -- 1/T, 1/T^2, (log T)/T -- by
 *   linear least squares (R(T) = R_inf - c*x(T), x in {1/T, 1/T^2, (log T)/T}, intercept = R_inf) and reports the
 *   spread in R_inf and in the realizable fraction R_inf/envelope, so the ~0.513 value carries an honest error bar.
 *
 * RESULT 1 -- FULL-LADDER (T=12..64) MODEL SPREAD IS LARGE (~7% of R_inf), driven by the small-T rungs.
 *   1/T:       R_inf = 1612.6, fraction = 0.5261, R2 = 0.9498
 *   1/T^2:     R_inf = 1556.7, fraction = 0.5078, R2 = 0.9967   <- best full-ladder fit
 *   (log T)/T: R_inf = 1664.2, fraction = 0.5429, R2 = 0.8945
 *   R_inf spread 1556.7..1664.2 (=107.5); fraction spread 0.5078..0.5429 (=0.0351). The two-rung 1/T Richardson
 *   value R_inf ~ 1573.0 (fraction 0.5132) sits INSIDE this band, toward the low end. So the full ladder alone does
 *   NOT pin the fraction to 0.513: it only constrains it to ~[0.51, 0.54], and the pure 1/T and (log T)/T forms fit
 *   the whole ladder poorly (R2 <= 0.95) because the pre-asymptotic small-T rungs (T=12,20) do not obey them.
 *
 * RESULT 2 -- RESTRICTING TO THE ASYMPTOTIC TAIL COLLAPSES THE MODEL SPREAD to ~0.51-0.52. On the last four rungs
 *   (T=28..64) all three models agree: 1/T -> 0.5146, 1/T^2 -> 0.5079, (log T)/T -> 0.5195 (R2 all >= 0.983); on
 *   the last three rungs (T=36..64): 1/T -> 0.5132, 1/T^2 -> 0.5081, (log T)/T -> 0.5168. So the two-rung 1/T value
 *   0.5132 is reproduced by the last-three 1/T fit exactly and is bracketed by the tail-restricted band [0.508,
 *   0.520]; the wide full-ladder spread is a small-T contamination artifact, not genuine limit ambiguity.
 *
 * RESULT 3 -- HONEST ERROR BAR. The realizable fraction is ~0.513 with a model-uncertainty band of about
 *   [0.508, 0.520] on the asymptotic tail (T >= 28), widening to a conservative [0.508, 0.543] if the whole ladder
 *   (including pre-asymptotic rungs) and the slow (log T)/T decay are admitted. The best-fitting single model
 *   overall is 1/T^2 (R2 0.9967 full / 0.9983 tail), which puts the fraction slightly BELOW the two-rung value at
 *   ~0.508, so the ~0.513 headline is a reasonable central estimate but the error bar is mildly ASYMMETRIC: the
 *   fraction is very unlikely to be below ~0.508 and could be as high as ~0.52 (tail) / ~0.54 (slow-decay bound).
 *   The qualitative imp-97564 verdict is unchanged: the realizable psi still captures only ~half the 3065.43
 *   bathtub envelope under every tail model, so the realizability gap persists.
 *
 * VERDICT. The imp-97564 R_inf ~ 1573 / fraction ~ 0.513 is model-robust in the sense that the asymptotic-tail fits
 *   under all three decay models cluster in [0.508, 0.520], with 1/T^2 (best R2) at the low end (~0.508); but the
 *   full-ladder spread is wide (0.508..0.543) because the small-T rungs are pre-asymptotic. Report the fraction as
 *   ~0.513 with a tail-model band [0.508, 0.520] (conservative [0.508, 0.543]). This is a MEASUREMENT-uncertainty
 *   quantification over baked finite-section IEEE-double eigenvalues: the eigenvalues are not interval-enclosed and
 *   R_inf is an extrapolation, not a certified limit; no rigorous bound is promoted; scalar bound stays a negative
 *   floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; Platt-Trudgian
 *   Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *   SUB-GAP IMP97626_INFINITE_LINE_FRACTION_NEEDS_CERTIFIED_EIGENVALUE_AND_ASYMPTOTIC_TAIL_LAW (unchanged from
 *   imp-97564: a certified infinite-line eigenvalue, and a proven tail law, would collapse the [0.508, 0.543] band).
 *
 * @see imp-97564-realizability-fraction-resolution-sweep.js (FINDING 2 window ladder + two-rung 1/T R_inf ~ 1573)
 * @see imp-97457-krein-bathtub-realizability-gap.js (the 43.84% T=12 measurement)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub floor -3065.435 / envelope 3065.43)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Import-light: bakes the imp-97564 window ladder literals + this leaf recomputes the three linear tail fits in-JS
 *   (6 points, O(1)); no heavy import, no eigenvalue recompute. Fits cross-checked in numpy lstsq. NO QED.
 * Ticket: imp-97626 (numerical, medium, opus-4-8). Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const LN3 = Math.log(3);

export const IMP97626_BINDING_2A = LN3;
export const IMP97626_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

export const IMP97626_ENVELOPE = 3065.4290; // window-independent bathtub envelope (imp-97564 / imp-97416)

// Baked from imp-97564 IMP97564_WINDOW_LADDER (h=0.01 grid-converged; window half-width T widening).
export const IMP97626_WINDOW_LADDER = Object.freeze([
  Object.freeze({ T: 12, R: 1343.7963 }),
  Object.freeze({ T: 20, R: 1489.5641 }),
  Object.freeze({ T: 28, R: 1514.8301 }),
  Object.freeze({ T: 36, R: 1531.4020 }),
  Object.freeze({ T: 48, R: 1541.8268 }),
  Object.freeze({ T: 64, R: 1549.6271 }),
]);

// -- ordinary least squares for R(T) = R_inf - c*x(T): fit R against x, intercept = R_inf, slope = -c --
function _linFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) * (xs[i] - mx);
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  // coefficient of determination
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - my) * (ys[i] - my);
  }
  const r2 = 1 - ssRes / ssTot;
  return { rInf: intercept, c: -slope, r2 };
}

const _TAIL_MODELS = {
  invT: (T) => 1 / T,
  invT2: (T) => 1 / (T * T),
  logToverT: (T) => Math.log(T) / T,
};

function _fitLadder(rungs) {
  const out = {};
  for (const [name, xf] of Object.entries(_TAIL_MODELS)) {
    const xs = rungs.map((r) => xf(r.T));
    const ys = rungs.map((r) => r.R);
    const { rInf, c, r2 } = _linFit(xs, ys);
    out[name] = Object.freeze({ rInf, c, r2, fraction: rInf / IMP97626_ENVELOPE });
  }
  return Object.freeze(out);
}

// full ladder (T=12..64) and asymptotic-tail restrictions (drop the pre-asymptotic small-T rungs)
export const IMP97626_FIT_FULL = _fitLadder(IMP97626_WINDOW_LADDER);            // T=12..64
export const IMP97626_FIT_TAIL4 = _fitLadder(IMP97626_WINDOW_LADDER.slice(2));  // T=28..64
export const IMP97626_FIT_TAIL3 = _fitLadder(IMP97626_WINDOW_LADDER.slice(3));  // T=36..64

// two-rung 1/T Richardson (imp-97564 headline) from the last two rungs, for reference
const _t1 = IMP97626_WINDOW_LADDER[IMP97626_WINDOW_LADDER.length - 2];
const _t2 = IMP97626_WINDOW_LADDER[IMP97626_WINDOW_LADDER.length - 1];
const _cR = (_t2.R - _t1.R) / (1 / _t1.T - 1 / _t2.T);
export const IMP97626_TWO_RUNG_R_INF = _t2.R + _cR / _t2.T;                 // ~1573.0 (imp-97564)
export const IMP97626_TWO_RUNG_FRACTION = IMP97626_TWO_RUNG_R_INF / IMP97626_ENVELOPE; // ~0.5132

function _spread(fit) {
  const fr = Object.values(fit).map((m) => m.fraction);
  const ri = Object.values(fit).map((m) => m.rInf);
  return {
    fractionMin: Math.min(...fr),
    fractionMax: Math.max(...fr),
    fractionSpread: Math.max(...fr) - Math.min(...fr),
    rInfMin: Math.min(...ri),
    rInfMax: Math.max(...ri),
    rInfSpread: Math.max(...ri) - Math.min(...ri),
  };
}

export const IMP97626_SPREAD = Object.freeze({
  full: Object.freeze(_spread(IMP97626_FIT_FULL)),   // wide: fraction ~0.508..0.543
  tail4: Object.freeze(_spread(IMP97626_FIT_TAIL4)), // tight: fraction ~0.508..0.520
  tail3: Object.freeze(_spread(IMP97626_FIT_TAIL3)), // tight: fraction ~0.508..0.517
});

export const IMP97626_VERDICT = Object.freeze({
  ticket: 'imp-97626',
  question:
    'the imp-97564 R_inf ~ 1573 (realizable fraction ~ 0.513) came from a two-rung 1/T Richardson step; refit the full T=12..64 ladder under 1/T, 1/T^2, and (log T)/T tail models to quantify the extrapolation-model spread in R_inf and the fraction.',
  answer:
    'the fraction is ~0.513 but carries a real model-uncertainty band. Full-ladder (T=12..64) least-squares fits under the three decay models spread widely -- R_inf 1556.7 (1/T^2, best R2=0.9967) to 1664.2 ((log T)/T, R2=0.8945) via 1612.6 (1/T, R2=0.9498), fraction 0.5078..0.5429 -- because the small-T rungs (T=12,20) are pre-asymptotic and do not obey the pure forms. Restricting to the asymptotic tail collapses the spread: last-four (T=28..64) fits give fraction 0.5079/0.5146/0.5195 and last-three (T=36..64) give 0.5081/0.5132/0.5168, so all three models cluster in [0.508, 0.520] and the two-rung 1/T value 0.5132 is reproduced exactly by the last-three 1/T fit. Report the realizable fraction as ~0.513 with a tail-model error bar [0.508, 0.520] (conservative full-ladder [0.508, 0.543]); the band is mildly asymmetric because the best-fit 1/T^2 model sits at the low end (~0.508). Under every model the realizable psi still captures only ~half the 3065.43 envelope, so the imp-97564 realizability gap persists. Measurement-uncertainty quantification only: eigenvalues are baked finite-section IEEE-double, not interval-enclosed, and R_inf is an extrapolation, not a certified limit; no rigorous bound promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.',
  binding_2a: LN3,
  twoRungRInf: IMP97626_TWO_RUNG_R_INF,
  twoRungFraction: IMP97626_TWO_RUNG_FRACTION,
  bestModelFull: 'invT2',                       // highest R2 on the full ladder
  fractionCentral: IMP97626_TWO_RUNG_FRACTION,  // ~0.513
  fractionBandTail: Object.freeze([IMP97626_SPREAD.tail4.fractionMin, IMP97626_SPREAD.tail4.fractionMax]),
  fractionBandConservative: Object.freeze([IMP97626_SPREAD.full.fractionMin, IMP97626_SPREAD.full.fractionMax]),
  realizabilityGapPersists: true,
  // measurement-only guardrails
  measuredNotIntervalCertified: true,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97626_INFINITE_LINE_FRACTION_NEEDS_CERTIFIED_EIGENVALUE_AND_ASYMPTOTIC_TAIL_LAW',
  qed: false,
});
export default IMP97626_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Light: recomputes the three linear tail fits from the 6 baked rungs (O(1)); no eigenvalue recompute.

const IMP97626_ASSERTIONS = [
  {
    id: 'imp97626-full-ladder-model-spread-is-wide',
    holds: () => {
      const s = IMP97626_SPREAD.full;
      // pre-asymptotic small-T rungs make the pure forms spread the fraction by ~0.03-0.04
      const wide = s.fractionSpread > 0.02;
      // best full-ladder fit is 1/T^2 (highest R2), lowest-fraction end near 0.508
      const bestIsInvT2 =
        IMP97626_FIT_FULL.invT2.r2 > IMP97626_FIT_FULL.invT.r2 &&
        IMP97626_FIT_FULL.invT2.r2 > IMP97626_FIT_FULL.logToverT.r2;
      const lowEnd = Math.abs(s.fractionMin - 0.5078) < 3e-3;
      return wide && bestIsInvT2 && lowEnd;
    },
    why: 'full-ladder T=12..64 fits spread the fraction ~0.508..0.543 (R_inf 1557..1664) because small-T rungs are pre-asymptotic; 1/T^2 is the best fit (R2 0.9967) and marks the low end ~0.508.',
  },
  {
    id: 'imp97626-tail-restriction-collapses-spread',
    holds: () => {
      const s4 = IMP97626_SPREAD.tail4;
      const s3 = IMP97626_SPREAD.tail3;
      // asymptotic tail (drop T=12,20) tightens the three-model fraction spread to ~0.01
      const tight = s4.fractionSpread < 0.015 && s3.fractionSpread < 0.012;
      // all tail models cluster in [0.505, 0.522]
      const clustered =
        s4.fractionMin > 0.505 && s4.fractionMax < 0.522 && s3.fractionMin > 0.505 && s3.fractionMax < 0.522;
      return tight && clustered;
    },
    why: 'restricting to T>=28 collapses the three-model fraction spread from ~0.035 to ~0.012, clustering in [0.508, 0.520]: the wide full-ladder spread was a small-T contamination artifact.',
  },
  {
    id: 'imp97626-two-rung-value-inside-tail-band',
    holds: () => {
      const s4 = IMP97626_SPREAD.tail4;
      // imp-97564 two-rung 1/T fraction ~0.513 lies inside the tail-model band and near 0.513
      const inBand =
        IMP97626_TWO_RUNG_FRACTION >= s4.fractionMin - 1e-4 &&
        IMP97626_TWO_RUNG_FRACTION <= s4.fractionMax + 1e-4;
      const nearHeadline = Math.abs(IMP97626_TWO_RUNG_FRACTION - 0.513) < 2e-3;
      // last-three 1/T fit reproduces the two-rung value (both use only near-asymptotic rungs)
      const reproduced = Math.abs(IMP97626_FIT_TAIL3.invT.fraction - IMP97626_TWO_RUNG_FRACTION) < 2e-3;
      return inBand && nearHeadline && reproduced;
    },
    why: 'the imp-97564 headline fraction 0.5132 sits inside the tail-model band [0.508, 0.520] and is reproduced by the last-three 1/T fit, so ~0.513 is a defensible central estimate.',
  },
  {
    id: 'imp97626-gap-persists-under-every-model',
    holds: () => {
      // every model, on every fit window, keeps R_inf well below the 3065.43 envelope (fraction < 0.6)
      const all = [IMP97626_FIT_FULL, IMP97626_FIT_TAIL4, IMP97626_FIT_TAIL3];
      return all.every((fit) => Object.values(fit).every((m) => m.fraction > 0.45 && m.fraction < 0.6));
    },
    why: 'under all three tail models and all fit windows the realizable psi captures only ~half the 3065.43 envelope (fraction ~0.5), so the imp-97564 realizability gap persists.',
  },
  {
    id: 'imp97626-measurement-only-no-qed',
    holds: () =>
      IMP97626_VERDICT.measuredNotIntervalCertified === true &&
      IMP97626_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97626_VERDICT.operatorPositivityProved === false &&
      IMP97626_VERDICT.scalarBoundStillNegativeFloor === true &&
      IMP97626_VERDICT.boundMoves === false &&
      IMP97626_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97626_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97626_BINDING_2A - LN3) < 1e-12 &&
      IMP97626_VERDICT.subGap ===
        'IMP97626_INFINITE_LINE_FRACTION_NEEDS_CERTIFIED_EIGENVALUE_AND_ASYMPTOTIC_TAIL_LAW' &&
      IMP97626_VERDICT.qed === false,
    why: 'measurement-uncertainty quantification only: eigenvalues are baked finite-section IEEE-double, R_inf is an extrapolation, not an interval enclosure; no rigorous bound promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97626_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97626-window-extrapolation-model-spread assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
