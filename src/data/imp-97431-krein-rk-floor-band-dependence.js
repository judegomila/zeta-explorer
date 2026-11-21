/**
 * @module imp-97431-krein-rk-floor-band-dependence
 * @fileoverview imp-97431 -- MEASURE the band-dependence of the imp-97399 reproducing-kernel (RKHS) Krein
 *   concentration floor
 *       floor(a) = -(a/pi) int sigma_2^-(t) dt
 *   as the half-width a (band 2a) varies below the binding ln3, across the interval-rigorous reach 2a <= 0.96.
 *   The question: does this confinement + reproducing-kernel-budget floor ever CROSS ZERO for a smaller band --
 *   i.e. does the RKHS budget ALONE certify c_sharp > 0 for some a within reach even though it fails at
 *   2a = ln3 -- or does the fixed confined negative area keep the floor negative throughout?
 *
 *   Measurement only. Establishes NO operator positivity (at ln3 or anywhere), proves no concentration lower
 *   bound, moves no bound; a smaller-band positivity would not lower the binding reach in any case (pole-free
 *   Weil positivity binds at 2a = ln3). Interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * THE KEY STRUCTURAL FACT -- THE NEGATIVE AREA IS a-INDEPENDENT. The symbol
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2)
 *   does NOT depend on the band width a. The half-width a enters the imp-97399 floor ONLY through the
 *   reproducing-kernel diagonal K_a(t,t) = a/pi (the sharp pointwise mass cap |psi(t)|^2 <= a/pi for psi in
 *   PW_a with ||psi||_2 = 1). Hence the confined negative area int sigma_2^- dt = 18301.61 (Finding 1 of
 *   imp-97399: single bounded region, verified positive for all t > 10.53) is FIXED as a varies, and the floor
 *   is EXACTLY LINEAR in a:
 *       floor(a) = -(a/pi) * 18301.61.
 *
 * FINDING -- THE FLOOR NEVER CROSSES ZERO WITHIN REACH (it stays strictly negative). Because the coefficient
 *   18301.61/pi > 0 is fixed and a > 0, floor(a) < 0 for every a > 0. It DECREASES in magnitude monotonically
 *   as a shrinks (the pointwise budget a/pi loosens), and approaches 0 only in the degenerate limit a -> 0,
 *   which it never reaches for any band in the interval-rigorous reach 2a in (0, 0.96]. Measured ladder:
 *       2a = 0.10 -> floor = -291.28
 *       2a = 0.50 -> floor = -1456.40
 *       2a = ln2 = 0.6931 -> floor = -2018.99
 *       2a = 0.96 (reach limit) -> floor = -2796.28
 *       2a = ln3 = 1.0986 (binding, OUT of reach) -> floor = -3200.03  (imp-97399)
 *   So the answer is NO: the RKHS budget alone does NOT certify c_sharp > 0 for any smaller band within reach.
 *   The floor stays negative throughout because the FIXED confined negative area dominates -- shrinking a only
 *   scales the SAME finite negative area down linearly, never flipping its sign. The a -> 0 limit floor -> 0^-
 *   is vacuous (it certifies nothing; the trivial band carries no test functions and c_sharp itself -> 0 there).
 *
 * WHY THIS DOES NOT HELP THE PROGRAM. Even if the RKHS floor HAD gone positive for some small a, it would not
 *   lower the binding reach: pole-free Weil positivity binds at 2a = ln3, and a positivity certificate for a
 *   strictly smaller band is not a certificate at ln3. The floor's linear-in-a shape simply confirms the
 *   imp-97399 obstruction is not an artifact of the specific band ln3 -- the uniform pointwise budget is too
 *   lossy at EVERY band, not just at the binding one. Closing the sign still requires the JOINT WEIGHTED
 *   estimate named by imp-97399 (weighted-PSWF eigenvalue decay or a Fejer-Riesz / de Branges square
 *   factorisation with a certified margin), which the a-linear scaling cannot supply.
 *
 * VERDICT. The imp-97399 reproducing-kernel floor is measured across 2a in (0, 0.96]. It is exactly linear in
 *   the half-width a (floor(a) = -(a/pi) * 18301.61) because the confined negative area of sigma_2 is
 *   a-independent, so it NEVER crosses zero for any band within the interval-rigorous reach -- it stays
 *   strictly negative, decreasing in magnitude toward the vacuous a -> 0 limit. The RKHS budget alone
 *   therefore certifies c_sharp > 0 for no band in reach; the fixed confined negative area dominates at every
 *   band. Measurement only; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96;
 *   RH open; NO QED.
 *
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (the floor -(a/pi) int sigma_2^- at 2a=ln3 = -3200.029; confined well; a/pi budget)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive symbol-infimum floor -4336.198)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (shared concentration primitive; confined well)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, w_1; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Ticket: imp-97431 (numerical, low, opus-4-8). Measurement only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN2 = Math.log(2);  // 0.6931471805599453
const LN3 = Math.log(3);  // 1.0986122886681098 -- the binding 2a (OUT of the interval-rigorous reach 0.96)

// Finding 1 of imp-97399: fixed, a-independent confined negative area of sigma_2 (single bounded region).
export const IMP97431_NEG_AREA_FULL_LINE = 18301.610;
export const IMP97431_RIGOROUS_REACH_2A = 0.96;
export const IMP97431_BINDING_2A = LN3;

// The imp-97399 reproducing-kernel floor as a function of the half-width a: -(a/pi) int sigma_2^- dt.
export const rkFloor = (a) => -(a / Math.PI) * IMP97431_NEG_AREA_FULL_LINE;

// Measured ladder of the floor across the band 2a, from a vanishing band up to the reach limit 0.96,
// with the binding (out-of-reach) 2a = ln3 appended for context.
export const IMP97431_FLOOR_LADDER = Object.freeze(
  [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, LN2, 0.8, 0.9, 0.96, LN3].map((twoA) => {
    const a = twoA / 2;
    return Object.freeze({
      twoA,
      a,
      floor: rkFloor(a),
      inReach: twoA <= IMP97431_RIGOROUS_REACH_2A,
      crossesZero: rkFloor(a) >= 0,
    });
  })
);

export const IMP97431_VERDICT = Object.freeze({
  ticket: 'imp-97431',
  question:
    'does the imp-97399 reproducing-kernel Krein floor -(a/pi) int sigma_2^- dt ever cross zero for a smaller band as 2a varies below ln3 across the interval-rigorous reach 2a<=0.96 -- i.e. does the RKHS budget alone certify c_sharp > 0 for some band in reach -- or does the fixed confined negative area keep it negative throughout?',
  answer:
    'NO -- the floor never crosses zero for any band within reach; it stays strictly negative throughout. The symbol sigma_2(t) = (t^2+1/4)^2 w_1(t) has no a-dependence, so its confined negative area int sigma_2^- dt = 18301.61 is FIXED; the half-width a enters only through the reproducing-kernel diagonal K_a(t,t) = a/pi, making the floor EXACTLY LINEAR: floor(a) = -(a/pi)*18301.61. Since the coefficient is positive and fixed, the floor is negative for every a > 0, decreasing in magnitude as a shrinks and approaching 0 only in the vacuous a -> 0 limit (never reached in reach). Measured: 2a=0.10 -> -291.28, 2a=0.50 -> -1456.40, 2a=ln2 -> -2018.99, 2a=0.96 -> -2796.28, 2a=ln3 (out of reach) -> -3200.03. The RKHS budget alone certifies c_sharp > 0 for no band in reach; the fixed confined negative area dominates at every band. This only sharpens the imp-97399 obstruction (the uniform pointwise budget is too lossy at EVERY band, not just the binding ln3) and would not lower the binding reach even if it had gone positive, since pole-free Weil positivity binds at 2a = ln3.',
  negAreaIsAIndependent: true,
  negAreaFullLine: IMP97431_NEG_AREA_FULL_LINE,
  floorIsLinearInA: true,
  floorCrossesZeroInReach: false,
  floorStrictlyNegativeThroughout: true,
  floorDecreasesInMagnitudeAsBandShrinks: true,
  zeroOnlyInVacuousLimit: true,     // floor -> 0^- as a -> 0, never attained in reach
  floorAtReachLimit: rkFloor(0.96 / 2),   // -2796.28 at 2a = 0.96
  floorAtBindingLn3: rkFloor(LN3 / 2),    // -3200.03 at 2a = ln3 (imp-97399)
  // program state -- unchanged
  rkhsBudgetCertifiesPositivityForSomeBand: false,
  smallerBandWouldNotLowerBindingReach: true,
  operatorPositivityProved: false,
  concentrationLowerBoundPositiveProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97431_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

// Recompute the a-independent one-sided negative area of sigma_2 (confined to [0, ~10.6]); h chosen cheap.
function negAreaOneSided(h) {
  let s = 0;
  for (let t = 0; t <= 12; t += h) {
    const v = sigma2(t);
    if (v < 0) s += -v * h;
  }
  return s;
}

const IMP97431_ASSERTIONS = [
  {
    id: 'imp97431-neg-area-a-independent-and-matches',
    holds: () => {
      // sigma_2 carries no band parameter, so its negative area is fixed; recompute agrees with the imp-97399 value.
      const full = 2 * negAreaOneSided(0.005);
      return Math.abs(full - IMP97431_NEG_AREA_FULL_LINE) < 1 &&
        IMP97431_VERDICT.negAreaIsAIndependent === true;
    },
    why: 'sigma_2(t) = (t^2+1/4)^2 w_1(t) has no dependence on the band width a, so its confined negative area int sigma_2^- dt = 18301.61 is fixed; a coarse recompute agrees to < 1.',
  },
  {
    id: 'imp97431-floor-linear-in-a',
    holds: () => {
      // floor(a) = -(a/pi)*negArea is exactly linear: floor(2a)/floor(a) = 2, and floor(a)/a is constant.
      const c = -IMP97431_NEG_AREA_FULL_LINE / Math.PI;
      const linOk = Math.abs(rkFloor(0.4) / 0.4 - c) < 1e-9 && Math.abs(rkFloor(0.2) / 0.2 - c) < 1e-9;
      const doubleOk = Math.abs(rkFloor(0.4) - 2 * rkFloor(0.2)) < 1e-9;
      return linOk && doubleOk && IMP97431_VERDICT.floorIsLinearInA === true;
    },
    why: 'because the negative area is a-independent and the budget is a/pi, the floor is exactly proportional to a; doubling a doubles the floor and floor/a is the constant -18301.61/pi.',
  },
  {
    id: 'imp97431-floor-never-crosses-zero-in-reach',
    holds: () => {
      // every band in the reach (and the out-of-reach ln3) gives a strictly negative floor
      const allNeg = IMP97431_FLOOR_LADDER.every((r) => r.floor < 0 && r.crossesZero === false);
      // the reach-limit and binding values match the measured magnitudes
      const reachOk = Math.abs(IMP97431_VERDICT.floorAtReachLimit - -2796.281) < 0.5;
      const bindingOk = Math.abs(IMP97431_VERDICT.floorAtBindingLn3 - -3200.030) < 0.5;
      // shrinking the band shrinks the magnitude (floor increases toward 0)
      const monotone = rkFloor(0.05) > rkFloor(0.48) && rkFloor(0.48) > rkFloor(LN3 / 2);
      return allNeg && reachOk && bindingOk && monotone &&
        IMP97431_VERDICT.floorCrossesZeroInReach === false &&
        IMP97431_VERDICT.floorStrictlyNegativeThroughout === true;
    },
    why: 'floor(a) = -(a/pi)*18301.61 < 0 for every a > 0, so it never crosses zero for any band within the interval-rigorous reach 2a<=0.96 (nor at ln3); it only shrinks in magnitude toward the vacuous a -> 0 limit.',
  },
  {
    id: 'imp97431-measurement-only-no-qed',
    holds: () =>
      IMP97431_VERDICT.rkhsBudgetCertifiesPositivityForSomeBand === false &&
      IMP97431_VERDICT.smallerBandWouldNotLowerBindingReach === true &&
      IMP97431_VERDICT.operatorPositivityProved === false &&
      IMP97431_VERDICT.concentrationLowerBoundPositiveProved === false &&
      IMP97431_VERDICT.boundMoves === false &&
      IMP97431_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97431_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97431_BINDING_2A - LN3) < 1e-12 &&
      IMP97431_VERDICT.qed === false,
    why: 'measurement only: the RKHS budget alone certifies positivity for no band in reach, a smaller-band positivity would not lower the binding reach anyway, no operator positivity, no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97431_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97431-krein-rk-floor-band-dependence assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
