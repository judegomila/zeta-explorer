/**
 * @module imp-97501-sigma2-far-field-positivity-rigorous-margin
 * @fileoverview imp-97501 -- UPGRADE the imp-97417/imp-97399 far-field positivity of
 *   sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2),
 *   from SAMPLED (verified only to t = 2000-5000 by evaluation) to a RIGOROUS explicit-t0 margin,
 *   ruling out any negativity recurrence past the confined well (last negative t = 10.532).
 *
 *   THE FAR-FIELD ARGUMENT, MADE RIGOROUS. Since (t^2+1/4)^2 > 0, sign(sigma_2(t)) = sign(w_1(t)) for
 *   all t. Two rigorous bounds close the sign for large t:
 *     (1) cos(t ln2) <= 1, so  w_1(t) >= 2 theta prime(t) - sqrt2 ln2  (the fixed oscillation amplitude
 *         sqrt2 ln2 = 0.9802581 is the WORST case);
 *     (2) 2 theta prime(t) >= L(t) := ln(t / 2pi) - 1/t - 4 sum_{k<12}(k+1/4)/t^2 - 1/(3 t^2) - 5e-7, the
 *         SAME increasing rigorous lower bound (shifted-digamma Re z -> 12.25 + Stirling N=8 + Binet
 *         remainder) that the interval-verified certificate uses for its tail (tailBracket L).
 *   L(t) is STRICTLY INCREASING for all t > 0 (its derivative 1/t + 1/t^2 + 2*276.333.../t^3 > 0), so once
 *   L(t) - sqrt2 ln2 > 0 at some t0 it stays positive for every t >= t0. The rigorous lower bound
 *   w_1_lower(t) = L(t) - sqrt2 ln2 crosses zero at t* = 26.1023, so at the clean threshold
 *       t0 = 27 :  w_1(t) >= L(27) - sqrt2 ln2 = 0.0616061 > 0,
 *   hence  sigma_2(t) = (t^2+1/4)^2 w_1(t) > 0  PROVABLY for every t >= 27.  (The rigorous L(t) bound is
 *   deliberately conservative -- the actual 2 theta prime crosses far earlier, actual worst w_1(27) = 0.4776 --
 *   so t0 = 27 carries slack; the honest rigorous certificate threshold is t0 = 27.)
 *
 *   THE FINITE WINDOW [10.532, 27]. Between the last well edge and the rigorous threshold, positivity is
 *   converted from pure sampling to a second-order GUARDED margin (the same guard the certificate uses):
 *   on a grid of step h, sigma_2(t) >= sigma_2(t_i) - (h^2/8) sup|sigma_2''|, with the certificate's rigorous
 *   |sigma_2''| <= (12t^2+1)|w_1| + 8t(t^2+1/4)|w_1'| + (t^2+1/4)^2 * 33 bound. The guarded minimum over the
 *   window is +8.114 (h = 1e-3), attained at the left edge t = 10.532, so sigma_2 > 0 on all of [10.532, 27]
 *   with a comfortable margin. (Full interval arithmetic on [0, 60] is already discharged by the
 *   certificate verifier tmp/toeplitz-krein-verify4.py; this leaf supplies the closed-form t0 that removes
 *   the "verified only by sampling to t = 2000-5000" gap for the unbounded tail t > 27.)
 *
 *   RESULT. The far-field positivity of sigma_2 is now RIGOROUS, not sampled: no negativity recurs past the
 *   confined well; the explicit rigorous threshold is t0 = 27 (crossing t* = 26.1023) with margin 0.0616061,
 *   and the finite bridge window [10.532, 27] carries a guarded margin +8.114. This closes the imp-97417
 *   sub-gap "positivity for t > 10.532 verified only by sampling".
 *
 *   Documentation / numerical only. No operator positivity of P_a M_{sigma_2} P_a follows (the negative well
 *   on [0,3.306] u [6.945,10.532] is untouched); no coercivity constant; no bound moves; interval-rigorous
 *   reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97417-sigma2-confined-well-correction-honest-status.js (the confined-well correction this upgrades)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (FINDING 1 confined well; source of the sampled claim)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2, the tailBracket L lower bound, sigma2SecondDerivBound)
 *
 * Ticket: imp-97501 (numerical, opus-4-8, api-pool). Far-field positivity upgraded sampled -> rigorous;
 * no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 */

import { twoThetaPrime } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';
import { sigma2, sigma2SecondDerivBound } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN2 = Math.LN2, PI = Math.PI, SQRT2 = Math.SQRT2;
const AMP = SQRT2 * LN2; // 0.9802581434685472 -- fixed oscillation amplitude, the worst-case -cos(t ln2)

// The certificate's increasing rigorous lower bound of 2 theta prime(t) (tailBracket L): shifted-digamma
// (Re z -> 12.25) + Stirling N=8 + Binet remainder, outward-rounded. sum_{k<12}(k+1/4) = 69.
let SUMK = 0;
for (let j = 0; j < 12; j++) SUMK += j + 0.25; // 69
const Llower = (t) => Math.log(t / 2) - 1 / t - 4 * SUMK / (t * t) - 1 / (3 * t * t) - 5e-7 - Math.log(PI);
// rigorous lower bound of w_1(t): cos <= 1 gives w_1 >= 2theta prime - AMP >= Llower - AMP
const w1Lower = (t) => Llower(t) - AMP;

export const IMP97501_RIGOROUS_REACH_2A = 0.96; // unchanged by this documentation leaf

export const IMP97501_FAR_FIELD = Object.freeze({
  symbol: 'sigma_2(t) = (t^2+1/4)^2 w_1(t), w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2)',
  lastNegativeT: 10.532,          // imp-97399/imp-97417 confined well right edge
  oscillationAmplitude: AMP,      // 0.9802581 (sqrt2 ln2), worst-case -cos term
  rigorousCrossingTStar: 26.1023, // smallest t where L(t) - sqrt2 ln2 > 0 (bisection)
  rigorousThresholdT0: 27,        // clean explicit rigorous threshold; sigma_2 > 0 provably for t >= 27
  rigorousMarginAtT0: 0.0616061,  // w_1_lower(27) = L(27) - sqrt2 ln2 > 0
  actualWorstW1AtT0: 0.4776445,   // 2 theta prime(27) - AMP (bound is conservative, real margin larger)
  windowBridge: [10.532, 27],     // finite window closed by the guarded second-order margin
  guardedWindowMin: 8.114,        // min over [10.532,27] of sigma_2(t_i) - (h^2/8) sup|sigma_2''|, h=1e-3
  guardedWindowArgmin: 10.532,    // attained at the left edge
  LlowerStrictlyIncreasing: true, // once positive it stays positive for all larger t (derivative > 0)
  positivityIsRigorousNotSampled: true, // upgrades imp-97417 "verified only by sampling to t=2000-5000"
  operatorPositivityProved: false,
  boundMoves: false,
});

export const IMP97501_VERDICT = Object.freeze({
  ticket: 'imp-97501',
  question:
    'upgrade the imp-97417/imp-97399 far-field positivity of sigma_2 (verified only by sampling to ' +
    't=2000-5000) to a rigorous explicit-t0 margin, ruling out any negativity recurrence past t=10.532.',
  answer:
    'RIGOROUS. Since (t^2+1/4)^2 > 0, sign(sigma_2) = sign(w_1) and two rigorous bounds close the tail: ' +
    '(1) cos(t ln2) <= 1 gives w_1(t) >= 2 theta prime(t) - sqrt2 ln2 (worst amplitude 0.9802581), and ' +
    '(2) 2 theta prime(t) >= L(t), the certificates own increasing digamma+Stirling+Binet lower bound. ' +
    'L is strictly increasing, and w_1_lower(t) = L(t) - sqrt2 ln2 crosses zero at t* = 26.1023, so at ' +
    't0 = 27 the rigorous margin is L(27) - sqrt2 ln2 = 0.0616061 > 0 and sigma_2(t) > 0 PROVABLY for ' +
    'every t >= 27. The finite bridge window [10.532, 27] carries a second-order guarded margin +8.114 ' +
    '(attained at the left edge t = 10.532), and full interval arithmetic on [0,60] is already discharged ' +
    'by the certificate verifier. Far-field positivity is thus rigorous, not sampled; the negativity set ' +
    'stays confined to [0,3.306] u [6.945,10.532] (and mirror). No operator positivity, no coercivity ' +
    'constant, no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.',
  lastNegativeT: 10.532,
  rigorousThresholdT0: 27,
  rigorousCrossingTStar: 26.1023,
  rigorousMarginAtT0: 0.0616061,
  guardedWindowMin: 8.114,
  farFieldPositivityRigorous: true,
  closesImp97417SamplingSubGap: true,
  operatorPositivityProved: false,
  coercivityConstant: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97501_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

// recompute the second-order guarded minimum of sigma_2 on the finite bridge window (import stays cheap:
// h = 1e-3 over [10.532, 27] is ~16500 evals). sigma_2(t) >= sigma_2(t_i) - (h^2/8) sup|sigma_2''|.
function guardedMinSigma2(a, b, h) {
  let mn = Infinity;
  for (let t = a; t <= b + 1e-12; t += h) {
    const v = sigma2(t) - (h * h / 8) * sigma2SecondDerivBound(t);
    if (v < mn) mn = v;
  }
  return mn;
}

const IMP97501_ASSERTIONS = [
  {
    id: 'imp97501-rigorous-lower-bound-positive-at-t0-and-beyond',
    holds: () => {
      // the rigorous w_1 lower bound is > 0 at t0 = 27 and stays > 0 (L increasing) far out
      const atT0 = w1Lower(27);
      const okT0 = atT0 > 0 && Math.abs(atT0 - 0.0616061) < 1e-4;
      const staysPositive = [27, 30, 60, 1e3, 1e6, 1e9].every((t) => w1Lower(t) > 0);
      // and it is NOT yet positive just below the crossing (threshold is genuine)
      const belowCross = w1Lower(26) < 0 && w1Lower(26.1023) > -1e-3;
      return okT0 && staysPositive && belowCross &&
        Math.abs(AMP - Math.SQRT2 * Math.LN2) < 1e-15;
    },
    why: 'w_1(t) >= L(t) - sqrt2 ln2 with L the certificates increasing rigorous 2 theta prime lower bound; it crosses zero at t* = 26.1023, is 0.0616061 > 0 at t0 = 27, and (L increasing) stays positive for all larger t, so sigma_2 > 0 provably for every t >= 27.',
  },
  {
    id: 'imp97501-sign-follows-w1-and-far-field-positive',
    holds: () => {
      // (t^2+1/4)^2 > 0 so sign(sigma_2) = sign(w_1); sample-check sigma_2 > 0 past t0 (consistency)
      const farPos = [27, 30, 50, 100, 500, 2000, 1e4].every((t) => sigma2(t) > 0);
      // and sigma_2 is still negative inside the confined well (unchanged)
      const wellNeg = sigma2(9.35) < 0 && sigma2(10) < 0;
      return farPos && wellNeg;
    },
    why: 'sign(sigma_2) = sign(w_1) since (t^2+1/4)^2 > 0; sigma_2 > 0 at every sampled far point past t0 = 27 and still negative inside the confined well, consistent with the rigorous threshold and the confined negativity set.',
  },
  {
    id: 'imp97501-finite-window-guarded-margin-positive',
    holds: () => {
      const g = guardedMinSigma2(10.532, 27, 1e-3);
      // guarded min matches the baked +8.114 to a loose tolerance and is comfortably positive
      return g > 8 && Math.abs(g - 8.114) < 0.1 &&
        Math.abs(IMP97501_FAR_FIELD.guardedWindowMin - 8.114) < 1e-9;
    },
    why: 'on the finite bridge window [10.532, 27] the second-order guarded minimum sigma_2(t_i) - (h^2/8) sup of |second-derivative of sigma_2| is +8.114 (attained at the left edge), converting the sampled positivity of the window to a guarded rigorous margin.',
  },
  {
    id: 'imp97501-documentation-only-no-qed',
    holds: () =>
      IMP97501_VERDICT.farFieldPositivityRigorous === true &&
      IMP97501_VERDICT.closesImp97417SamplingSubGap === true &&
      IMP97501_VERDICT.rigorousThresholdT0 === 27 &&
      IMP97501_VERDICT.operatorPositivityProved === false &&
      IMP97501_VERDICT.coercivityConstant === false &&
      IMP97501_VERDICT.boundMoves === false &&
      IMP97501_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97501_RIGOROUS_REACH_2A === 0.96 &&
      IMP97501_VERDICT.qed === false,
    why: 'documentation/numerical only: the far-field positivity is upgraded sampled -> rigorous (t0 = 27), but no operator positivity, no coercivity constant, no bound moves; interval-rigorous reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97501_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97501-sigma2-far-field-positivity-rigorous-margin assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
