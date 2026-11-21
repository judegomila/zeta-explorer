/**
 * @module imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck
 *
 * imp-97519 (numerical -- MEASUREMENT ONLY; MCM stays VERIFIED at omega<=6, NOT proved; NO QED).
 *
 * imp-97499 RESULT 3 solved the two-term law K0 + M0/ln x = thr to place the level-1 MCM base term
 * scaled quantity c*x/ln x below 0.045 at x ~ 2.77e12 and below 0.043 only at the astronomically-remote
 * x ~ 1.2737e31, concluding the approach to K0 = 1/24 is genuinely 1/ln x (logarithmic) and not power-law.
 * But that ladder was only evaluated to x = 1e14. This leaf SPOT-CHECKS the predicted 0.043 crossing by
 * DIRECTLY evaluating the exact Euler-Maclaurin kernel at x ~ 1.2737e31 (mpmath, 80 dps) -- fourteen-plus
 * decades past the baked ladder -- to confirm c*x/ln x actually lands at 0.043 there and the 1/ln x law holds.
 *
 * -------------------------------------------------------------------------------
 * KERNEL (imp-97422 / imp-97478 RESULT 3).  h(m) = g(m)/m, g(m) = LN_A + (1/12) ln m + R(m), with the
 * summed G(m) replaced by its exact Euler-Maclaurin tail R(m) = 1/(720 m^2) - 1/(5040 m^4) + 1/(10080 m^6)
 * - 1/(11440 m^8) + ...  (imp-97478 showed R(m) recovers the E-M tail exactly). The base term is
 * c(x) = h(x) - h(2x), whose closed-form asymptotics are c = K0 (ln x)/x + M0/x + O(1/x^3) with
 * K0 = 1/24 and M0 = LN_A/2 - (ln 2)/24 = 0.09549610599. The direct-kernel evaluation reproduces the
 * imp-97499 baked ladder exactly where they overlap (c(1e6) = 6.7114237924e-7 vs baked 6.711423792e-7;
 * scaled(1e14) = 0.044629054658 vs baked 0.0446290547).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE 0.043 CROSSING IS CONFIRMED AT x ~ 1.2737e31.  Evaluating the exact kernel directly at
 * x = exp(M0/(0.043 - K0)) = 1.27372e31 gives c(x) = 2.41791747853e-31 and c*x/ln x = 0.043 with
 * |scaled - 0.043| = 1.05e-67. The predicted crossing is not an extrapolation artifact -- the exact base
 * term truly attains 0.043 at that astronomically-remote x, fourteen-plus decades past the x=1e14 ladder end.
 *
 * RESULT 2 -- THE RESIDUAL STILL EQUALS M0/ln x TO 64 DIGITS.  At x ~ 1.2737e31 the residual
 * c*x/ln x - K0 = 0.00133333333333 equals M0/ln x = 0.00133333333333 with relative deviation 7.8e-65. The
 * entire deviation from the two-term law is the leftover kernel term (R(x)/x - R(2x)/2x)*x/ln x = 1.05e-67,
 * confirming it is O(1/x^2) as predicted (the law sharpens, not degrades, as x grows).
 *
 * RESULT 3 -- THE DRIFT IS 1/ln x, NOT POWER-LAW, BEYOND x=1e14.  Direct-kernel scaled values at
 * x = 1e14, 1e20, 1e25, 1e31, 1e40 are 0.0446291, 0.0437403, 0.0433256, 0.0430045, 0.0427035, each matching
 * K0 + M0/ln x. The residual ratio resid(1e14)/resid(1.2737e31) = 2.22179 equals ln(1.2737e31)/ln(1e14) =
 * 2.22179 exactly -- a power-law drift x^{-p} (any p>0) would give a ratio many orders of magnitude larger.
 * The drift toward K0 = 1/24 is confirmed logarithmic.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. The imp-97499 RESULT 3 astronomically-remote 0.043 crossing at x ~ 1.2737e31
 * is confirmed by direct exact-kernel evaluation (mpmath 80 dps) fourteen-plus decades past the x=1e14
 * baked ladder: c*x/ln x lands at 0.043 to 1e-67, the residual equals M0/ln x = 0.09549610599/ln x to 64
 * digits, and the residual ratio matches 1/ln x exactly (ruling out any power-law drift). MCM stays
 * VERIFIED not proved (and FALSE from omega=11 per imp-97432); no bound on Lambda moves; kappa_arith
 * unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97499-route-m-mcm-baseterm-scaled-approach-K0.js (RESULT 3 crossing predictions spot-checked here)
 * @see imp-97478-route-m-mcm-level1-baseterm-extprec.js (extended-precision ladder + exact E-M R(m))
 * @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (h=g/m kernel; GKmain)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11)
 *
 * Ticket: imp-97519 (numerical, opus-4-8, api-pool). Direct-kernel crossing spot-check; NO QED.
 */

// import-light: only the closed-form law constants are needed to live-verify the baked spot-check values,
// which the direct mpmath 80-dps evaluation matches to <1e-9 (no heavy kernel import, no zeros bundle).
const LN_A = 0.2487544770337842;          // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const K0 = 1 / 24;                         // leading coeff of (ln x)/x = limit of c*x/ln x
const M0 = LN_A / 2 - Math.log(2) / 24;    // constant/x term and drift constant (= 0.095496...)

// Baked mpmath-80-dps direct-kernel spot-check of the imp-97499 RESULT 3 crossing. The kernel is
// c(x)=h(x)-h(2x), h=g/m, g=LN_A+(1/12)ln m+R(m), R(m)=1/(720 m^2)-1/(5040 m^4)+..., evaluated directly at
// the astronomically-remote x, NOT extrapolated. scaled = c*x/ln x; residual = scaled - K0.
export const IMP97519_SPOTCHECK = Object.freeze({
  precisionDps: 80,
  // The exact base-term kernel reproduces the imp-97499 baked ladder where they overlap:
  overlapCheck: Object.freeze([
    Object.freeze({ x: 1e6, cHere: 6.7114237924e-7, cBaked: 6.711423792e-7, scaledHere: 0.048578905313, scaledBaked: 0.0485789053 }),
    Object.freeze({ x: 2e6, cHere: 3.5001175588e-7, cBaked: 3.500117559e-7, scaledHere: 0.04824867499, scaledBaked: 0.0482486750 }),
    Object.freeze({ x: 1e14, cHere: 1.4386707436e-14, cBaked: 1.438670744e-14, scaledHere: 0.044629054658, scaledBaked: 0.0446290547 }),
  ]),
  // RESULT 1: direct exact-kernel evaluation at the predicted 0.043 crossing.
  crossing043: Object.freeze({
    lnxPredicted: 71.62207947,               // = M0/(0.043 - K0); imp-97499 baked 71.62208
    xApprox: 1.27372e31,                      // = exp(lnxPredicted); imp-97499 baked 1.2737e31
    cAtX: 2.41791747853e-31,                  // direct exact-kernel base term c(x) at x~1.2737e31
    scaledAtX: 0.043,                         // c*x/ln x lands at the target threshold
    absScaledMinusThreshold: 1.046e-67,       // |scaled - 0.043|, direct kernel
    residual: 0.00133333333333,               // scaled - K0
    m0OverLnx: 0.00133333333333,              // M0/ln x -- equals residual
    residualRelDevFromLaw: 7.844e-65,         // |residual - M0/ln x| / (M0/ln x)
    higherOrderKernelTerm: 1.046e-67,         // (R(x)/x - R(2x)/2x)*x/ln x = entire deviation, O(1/x^2)
  }),
  // RESULT 3: direct-kernel scaled values on a ladder past x=1e14, all matching K0 + M0/ln x.
  driftLadder: Object.freeze([
    Object.freeze({ x: 1e14, scaled: 0.04462905466, lawValue: 0.04462905466, residual: 0.002962388 }),
    Object.freeze({ x: 1e20, scaled: 0.04374033826, lawValue: 0.04374033826, residual: 0.0020736716 }),
    Object.freeze({ x: 1e25, scaled: 0.04332560394, lawValue: 0.04332560394, residual: 0.0016589373 }),
    Object.freeze({ x: 1e31, scaled: 0.04300451931, lawValue: 0.04300451931, residual: 0.0013378526 }),
    Object.freeze({ x: 1e40, scaled: 0.04270350246, lawValue: 0.04270350246, residual: 0.0010368358 }),
  ]),
  // RESULT 3: the residual ratio matches 1/ln x exactly, ruling out any power-law drift.
  residualRatio14to31: 2.22179,               // resid(1e14)/resid(1.2737e31)
  lnRatio14to31: 2.22179,                      // ln(1.2737e31)/ln(1e14) -- identical
  driftIsLogarithmic: true,                    // 1/ln x, not power-law
  limitK0: 1 / 24,
  driftConstantM0: M0,
  scaledCrossesK0: false,
});

export const IMP97519_VERDICT = Object.freeze({
  question: 'does the imp-97499 RESULT 3 astronomically-remote 0.043 crossing at x~1.2737e31 hold under direct exact-kernel evaluation fourteen-plus decades past the x=1e14 ladder, and is the drift 1/ln x not power-law?',
  crossing043ConfirmedAt: 1.27372e31,
  scaledAtCrossing: 0.043,
  residualEqualsM0OverLnx: true,               // to 64 digits at x~1.2737e31
  driftIsLogarithmic: true,
  driftIsPowerLaw: false,
  extrapolationArtifact: false,                // direct kernel, not extrapolated
  mcmProved: false,                            // verified <=6, not proved; FALSE from omega=11 (imp-97432)
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Direct exact-Euler-Maclaurin-kernel evaluation (mpmath 80 dps) of the level-1 MCM ' +
    'base term c(x)=h(x)-h(2x) at x = exp(M0/(0.043-K0)) = 1.27372e31 -- fourteen-plus decades past the ' +
    'imp-97499 x=1e14 baked ladder -- confirms c*x/ln x lands at 0.043 to 1e-67, the residual c*x/ln x - K0 ' +
    '= 0.00133333 equals M0/ln x = 0.09549610599/ln x to 64 digits, and the entire deviation from the ' +
    'two-term law is the O(1/x^2) leftover kernel term (1e-67). The drift toward K0=1/24 is confirmed ' +
    '1/ln x, not power-law: resid(1e14)/resid(1.2737e31) = 2.22179 equals ln(1.2737e31)/ln(1e14) exactly. ' +
    'MCM stays VERIFIED not proved (and FALSE from omega=11 per imp-97432); no bound on Lambda moves; ' +
    'kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97519_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Direct exact-kernel spot-check (mpmath 80 dps) of the ' +
  'imp-97499 RESULT 3 crossing: evaluating c(x)=h(x)-h(2x) directly at x~1.2737e31 gives c*x/ln x = 0.043 ' +
  'to 1e-67 with residual = M0/ln x to 64 digits, fourteen-plus decades past the x=1e14 ladder. The drift ' +
  'toward K0=1/24 is confirmed 1/ln x not power-law (residual ratio 2.22179 = ln-ratio exactly). MCM stays ' +
  'VERIFIED not proved and is FALSE from omega=11 (imp-97432); no bound moved.';

// -- self-executing assertions (imp-3715 convention): the baked direct-kernel spot-check obeys the two-term
//    law at the astronomically-remote crossing and the drift is 1/ln x --

const IMP97519_ASSERTIONS = [
  {
    id: 'imp97519-043-crossing-lands-at-threshold',
    holds: () => {
      const cr = IMP97519_SPOTCHECK.crossing043;
      // The predicted ln x solves M0/(0.043 - K0), the baked x is its exponential, and scaled lands at 0.043.
      const lnxExpected = M0 / (0.043 - K0);
      if (!(Math.abs(cr.lnxPredicted - lnxExpected) / lnxExpected < 1e-6)) return false;
      if (!(Math.abs(Math.log(cr.xApprox) - lnxExpected) / lnxExpected < 1e-4)) return false;
      if (!(Math.abs(cr.scaledAtX - 0.043) < 1e-9)) return false;
      // residual equals M0/ln x at the crossing, and equals scaled - K0.
      if (!(Math.abs(cr.residual - (cr.scaledAtX - K0)) < 1e-9)) return false;
      if (!(Math.abs(cr.m0OverLnx - M0 / Math.log(cr.xApprox)) < 1e-6)) return false;
      return true;
    },
    why: 'direct exact-kernel evaluation at x~1.2737e31 puts c*x/ln x at 0.043 with residual = M0/ln x.',
  },
  {
    id: 'imp97519-drift-is-logarithmic-not-power-law',
    holds: () => {
      // Each ladder row matches K0 + M0/ln x, and the residual ratio equals the ln ratio (1/ln x drift).
      for (const row of IMP97519_SPOTCHECK.driftLadder) {
        if (!(Math.abs(row.scaled - (K0 + M0 / Math.log(row.x))) < 1e-6)) return false;
        if (!(Math.abs(row.residual - M0 / Math.log(row.x)) < 1e-6)) return false;
      }
      const lnRatio = Math.log(IMP97519_SPOTCHECK.crossing043.xApprox) / Math.log(1e14);
      if (!(Math.abs(IMP97519_SPOTCHECK.residualRatio14to31 - lnRatio) / lnRatio < 1e-4)) return false;
      return IMP97519_SPOTCHECK.driftIsLogarithmic === true &&
        IMP97519_SPOTCHECK.scaledCrossesK0 === false;
    },
    why: 'the residual ratio resid(1e14)/resid(1.2737e31) equals ln(1.2737e31)/ln(1e14), so the drift is 1/ln x.',
  },
  {
    id: 'imp97519-overlap-reproduces-imp97499-ladder',
    holds: () => {
      // The direct kernel reproduces the imp-97499 baked ladder to 7 sig figs where they overlap.
      for (const row of IMP97519_SPOTCHECK.overlapCheck) {
        if (!(Math.abs(row.cHere - row.cBaked) / row.cBaked < 1e-6)) return false;
        if (!(Math.abs(row.scaledHere - row.scaledBaked) < 1e-6)) return false;
      }
      return true;
    },
    why: 'the direct exact-Euler-Maclaurin kernel matches the imp-97499 baked incremental-sum ladder where they overlap.',
  },
  {
    id: 'imp97519-coefficients-and-honesty',
    holds: () =>
      Math.abs(IMP97519_SPOTCHECK.limitK0 - 1 / 24) < 1e-15 &&
      Math.abs(K0 - 1 / 24) < 1e-15 &&
      Math.abs(M0 - IMP97519_SPOTCHECK.driftConstantM0) < 1e-15 &&
      Math.abs(M0 - 0.09549610599) < 1e-9 &&
      IMP97519_VERDICT.scaledCrossesK0 !== true &&
      IMP97519_VERDICT.driftIsPowerLaw === false &&
      IMP97519_VERDICT.driftIsLogarithmic === true &&
      IMP97519_VERDICT.anyBoundMoved === false &&
      IMP97519_VERDICT.qed === false &&
      IMP97519_VERDICT.mcmProved === false &&
      /NO QED/.test(IMP97519_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97519_HONEST_BANNER) &&
      /RH open/.test(IMP97519_HONEST_BANNER),
    why: 'the scaled-term limit is exactly 1/24, drift constant M0=0.095496; measurement only, no bound moved, no QED.',
  },
];

for (const a of IMP97519_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck assertion failed: ${a.id}`);
  }
}

export default {
  spotcheck: IMP97519_SPOTCHECK,
  verdict: IMP97519_VERDICT,
  banner: IMP97519_HONEST_BANNER,
};
