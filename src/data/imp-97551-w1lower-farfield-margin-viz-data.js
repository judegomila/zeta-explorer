/**
 * @module imp-97551-w1lower-farfield-margin-viz-data
 *
 * imp-97551 (ux): import-light viz-data leaf visualizing the imp-97501
 * rigorous far-field positivity margin of sigma_2(t) = (t^2+1/4)^2 w_1(t),
 * w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2):
 *
 *   (a) the actual w_1(t) curve (oscillating) alongside its rigorous
 *       increasing lower bound w1Lower(t) = L(t) - sqrt2 ln2, over t in
 *       [0,40], with the confined negative well of sigma_2
 *       ([0,3.306] u [6.945,10.532], imp-97399 FINDING 1) shaded -- note
 *       sign(sigma_2) = sign(w_1) since (t^2+1/4)^2 > 0, so the well is a
 *       property of w_1 itself, not just sigma_2;
 *   (b) the rigorous crossing t* = 26.1023 (where w1Lower first turns
 *       positive) and the clean threshold t0 = 27 (margin 0.0616061),
 *       marking that w1Lower is strictly increasing so positivity holds for
 *       every t >= t0 thereafter.
 *
 * PRESENTATION ONLY. w1Lower(t) = L(t) - sqrt2 ln2 is recomputed here from the
 * exact closed form documented in imp-97501 (shifted-digamma Re z -> 12.25 +
 * Stirling N=8 + Binet remainder tail bound L, then cos(t ln2) <= 1); all
 * summary constants (t*, t0, margin, guarded window) are imported verbatim
 * from imp-97501, not re-derived. Establishes no operator positivity; changes
 * no bound; interval-rigorous certificate reach stays 2a<=0.96;
 * Platt-Trudgian Lambda<=0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97501-sigma2-far-field-positivity-rigorous-margin.js (the rigorous margin, t*, t0, guarded window)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (confined negative well [0,3.306]u[6.945,10.532])
 * @see rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js (twoThetaPrime; import-light, no zeros bundle)
 *
 * Ticket: imp-97551 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { twoThetaPrime } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';
import {
  IMP97501_FAR_FIELD,
  IMP97501_RIGOROUS_REACH_2A,
} from './imp-97501-sigma2-far-field-positivity-rigorous-margin.js';
import { IMP97399_WELL } from './imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js';

const PI = Math.PI, LN2 = Math.LN2, SQRT2 = Math.SQRT2;
const AMP = SQRT2 * LN2; // 0.9802581434685472 -- fixed oscillation amplitude, reused verbatim as IMP97501_FAR_FIELD.oscillationAmplitude

// Reused verbatim from imp-97501: the certificate's increasing rigorous lower bound of
// 2 theta prime(t) (shifted-digamma Re z -> 12.25 + Stirling N=8 + Binet remainder).
let SUMK = 0;
for (let j = 0; j < 12; j++) SUMK += j + 0.25; // 69
const Llower = (t) => Math.log(t / 2) - 1 / t - 4 * SUMK / (t * t) - 1 / (3 * t * t) - 5e-7 - Math.log(PI);
const w1Lower = (t) => Llower(t) - AMP;

export const IMP97551_REACH_2A = IMP97501_RIGOROUS_REACH_2A;
export const IMP97551_CROSSING_TSTAR = IMP97501_FAR_FIELD.rigorousCrossingTStar; // 26.1023
export const IMP97551_THRESHOLD_T0 = IMP97501_FAR_FIELD.rigorousThresholdT0;     // 27
export const IMP97551_MARGIN_AT_T0 = IMP97501_FAR_FIELD.rigorousMarginAtT0;     // 0.0616061
export const IMP97551_GUARDED_WINDOW_MIN = IMP97501_FAR_FIELD.guardedWindowMin; // 8.114
export const IMP97551_WINDOW_BRIDGE = IMP97501_FAR_FIELD.windowBridge;         // [10.532, 27]

// Confined negative well of w_1 (= sign(sigma_2)), reused verbatim from imp-97399.
export const IMP97551_NEGATIVE_WELL_INTERVALS = IMP97399_WELL.negativeSubIntervalsOneSided; // [[0,3.306],[6.945,10.532]]

// (a)+(b) sampled w_1(t) actual curve + rigorous lower bound, t in [0.3,40] (avoid t=0 log singularity in Llower).
const T_MIN = 0.3;
const T_MAX = 40;
const H = 0.1;

function buildProfile() {
  const pts = [];
  for (let t = T_MIN; t <= T_MAX + 1e-9; t += H) {
    const actual = 2 * twoThetaPrime(t) - AMP * Math.cos(t * LN2);
    const lower = w1Lower(t);
    pts.push(Object.freeze({ t: Number(t.toFixed(4)), actual, lower }));
  }
  return Object.freeze(pts);
}

export const IMP97551_W1_PROFILE = buildProfile();

export const IMP97551_VERDICT = Object.freeze({
  ticket: 'imp-97551',
  sourceTicket: 'imp-97501',
  claim:
    'charts the imp-97501 rigorous far-field positivity margin of sigma_2(t) = (t^2+1/4)^2 w_1(t): the ' +
    'actual oscillating w_1(t) against its rigorous increasing lower bound w1Lower(t) = L(t) - sqrt2 ln2, ' +
    'which crosses zero at t*=26.1023 and gives a clean positive margin 0.0616061 at the threshold t0=27, ' +
    'past which w1Lower stays positive forever (L strictly increasing); the confined negative well of w_1 ' +
    '([0,3.306] u [6.945,10.532]) and the guarded bridge window [10.532,27] are reused verbatim.',
  w1LowerReusedFormula: true,
  summaryConstantsReusedVerbatim: true,
  negativeWellReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: IMP97551_REACH_2A,
  qed: false,
});
export default IMP97551_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97551_ASSERTIONS = [
  {
    id: 'imp97551-w1lower-matches-imp97501-constants',
    holds: () => {
      const atT0 = w1Lower(IMP97551_THRESHOLD_T0);
      const okT0 = atT0 > 0 && Math.abs(atT0 - IMP97551_MARGIN_AT_T0) < 1e-4;
      const belowCross = w1Lower(26) < 0 && w1Lower(IMP97551_CROSSING_TSTAR) > -1e-3;
      const staysPositive = [30, 60, 1e3].every((t) => w1Lower(t) > 0);
      return okT0 && belowCross && staysPositive;
    },
    why: 'the recomputed w1Lower(t) must reproduce the imp-97501 verdict exactly: negative just below t*=26.1023, ' +
      'crossing to positive there, and giving margin 0.0616061 at t0=27, staying positive for all larger t.',
  },
  {
    id: 'imp97551-profile-dense-and-spans-window',
    holds: () => {
      const P = IMP97551_W1_PROFILE;
      if (P.length < 300) return false;
      return P[0].t <= T_MIN + 1e-6 && P[P.length - 1].t >= T_MAX - H;
    },
    why: 'the sampled w_1(t) profile must be dense enough to render (>=300 points) and span [0.3,40], covering ' +
      'the confined well, the bridge window, and the rigorous threshold t0=27.',
  },
  {
    id: 'imp97551-actual-w1-inside-confined-well-matches-sign',
    holds: () => {
      // inside the negative well t=1 (subinterval [0,3.306]), w_1 should be negative (sign(sigma_2)=sign(w_1))
      const insideWell1 = 2 * twoThetaPrime(1) - AMP * Math.cos(1 * LN2);
      const insideWell2 = 2 * twoThetaPrime(9) - AMP * Math.cos(9 * LN2);
      return insideWell1 < 0 && insideWell2 < 0;
    },
    why: 'sign(sigma_2(t)) = sign(w_1(t)) since (t^2+1/4)^2 > 0; sampled points inside the two confined-well ' +
      'sub-intervals [0,3.306] and [6.945,10.532] must have w_1 < 0, matching imp-97399 FINDING 1.',
  },
  {
    id: 'imp97551-negative-well-reused-verbatim',
    holds: () => {
      const W = IMP97551_NEGATIVE_WELL_INTERVALS;
      return Array.isArray(W) && W.length === 2 &&
        W[0][0] === 0 && Math.abs(W[0][1] - 3.306) < 1e-9 &&
        Math.abs(W[1][0] - 6.945) < 1e-9 && Math.abs(W[1][1] - 10.532) < 1e-9;
    },
    why: 'the charted negative well must be exactly the imp-97399 negativeSubIntervalsOneSided [[0,3.306],[6.945,10.532]], reused verbatim.',
  },
  {
    id: 'imp97551-documentation-only-no-qed',
    holds: () =>
      IMP97551_VERDICT.operatorPositivityProved === false &&
      IMP97551_VERDICT.boundMoves === false &&
      IMP97551_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97551_REACH_2A === 0.96 &&
      IMP97551_VERDICT.qed === false,
    why: 'documentation/measurement only: reuses the imp-97501 rigorous margin verbatim; no operator positivity, ' +
      'no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97551_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97551-w1lower-farfield-margin-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
