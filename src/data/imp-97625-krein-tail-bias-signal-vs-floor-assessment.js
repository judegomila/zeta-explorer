/**
 * @module imp-97625-krein-tail-bias-signal-vs-floor-assessment
 * @fileoverview imp-97625 -- assess whether the imp-97605/imp-97580 far-field tail bias
 * relBias(3.36) = -2.72746e-5 sits ABOVE or INSIDE the edge-amplitude measurement floor, i.e.
 * whether its NEGATIVE SIGN is a genuine, resolvable signal for the imp-97497 < 1e-3 tail bar or
 * is numerical noise. Measurement/assessment only; import-light (all inputs baked as literals).
 *
 * WHY. imp-97605 cross-validated the imp-97580 closed factor relBias(R) = 3(1/a - a R^2) * (I2/I1)
 * by a direct, IBP-free finite-cosine-transform read of the edge amplitudes g_pp(a), g_ppp(a). It
 * reported (i) a sign change at Rc = 1/a measured to the zero-crossing Rc - 7.6e-5, described as
 * "inside the amplitude-measurement floor", and (ii) relBias_dir(3.36) = -2.72746e-5 at the imp-97497
 * far-field optimum R* = 3.36. Point (i) leaves the resolvability of point (ii) unassessed: is the
 * -2.727e-5 bias at R* above the floor (so its sign is meaningful) or inside it (so its sign is noise)?
 *
 * METHOD (floor propagation from the imp-97605 baked table, no re-run needed).
 * The edge-amplitude measurement floor is exposed by the imp-97605 residual at the measured zero
 * crossing: at R = Rc the closed ratio g_ppp/g_pp is EXACTLY zero, yet the direct measurement reads
 * ratioDir(Rc) = -4.54022e-4 (imp-97605 table). That residual IS the amplitude-measurement floor
 * expressed in ratio units:
 *     floorRatio       = 4.54022e-4             (absolute, in g_ppp/g_pp units)
 *     floorRelBiasAbs  = floorRatio * (I2/I1)   = 9.42e-10   (matches the table relBiasDir(Rc))
 * with I2/I1 = 2.075013861884194e-6 (full-double, R-independent). A second, R*-LOCAL estimate uses
 * the direct-vs-closed ratio deviation AT R* itself: ratioDir(3.36) = -13.1443 vs ratioClosed(3.36)
 * = -13.1429, a relative deviation 1.065e-4, giving an absolute relBias floor 2.727e-5 * 1.065e-4
 * = 2.91e-9. The two independent floor estimates agree to within one order of magnitude (~1e-9).
 *
 * RESULT. |relBias(3.36)| = 2.72746e-5 exceeds the zero-crossing floor 9.42e-10 by a factor 2.90e4
 * and the R*-local floor 2.91e-9 by a factor 9.39e3. The negative sign is therefore RESOLVABLE by
 * roughly four orders of magnitude: it is a genuine signal, not measurement noise. The apparent
 * tension with imp-97605 "sign change inside the floor" is only local to Rc: near the zero crossing
 * relBias itself is O(1e-9) and comparable to the floor, so the exact sign-change RADIUS is not
 * resolvable there; but at the far-field optimum R* = 3.36, well away from Rc, relBias has grown to
 * 2.7e-5 and its sign is unambiguous. The bias also sits 36.7x below the imp-97497 < 1e-3 tail bar,
 * so a resolved-but-tiny negative bias does not threaten that bar.
 *
 * VERDICT. The relBias(3.36) = -2.727e-5 tail-bias sign is MEANINGFUL (resolvable ~1e4x above the
 * edge-amplitude floor ~1e-9), not numerical noise; it does not endanger the imp-97497 < 1e-3 tail
 * bar (sits 36.7x below it). Only the sign-change RADIUS at Rc stays below the floor (unresolvable
 * there), consistent with imp-97605. Assessment only; the m=1/m=2 Krein enclosure stays unusable at
 * 2a = ln 3; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; no
 * bound moves; RH open; NO QED.
 *
 * @see imp-97605-krein-tail-bias-direct-ct-crossvalidation.js (direct IBP-free relBias cross-validation)
 * @see imp-97580-krein-tail-bias-R-sweep-signchange.js (the relBias closed factor + sign change at Rc)
 * @see imp-97497-krein-welloptimum-tail-converged.js (far-field cost tail-converged; R* ~ 3.36; < 1e-3 bar)
 *
 * Ticket: imp-97625 (numerical, medium, opus-4-8). Assessment only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3);
const A = LN3 / 2;      // a = (ln3)/2 = 0.5493061443340548
const RC = 1 / A;       // sign-change radius Rc = 1/a = 1.820478453253675

export const IMP97625_BINDING_2A = LN3;
export const IMP97625_RIGOROUS_REACH_2A = 0.96; // unchanged

// --- baked inputs from imp-97605 (direct IBP-free cross-validation) ---
const I2_OVER_I1 = 2.075013861884194e-6;        // R-independent, full-double
const RATIO_DIR_AT_RC = -4.54022e-4;            // residual ratio at the measured zero crossing (should be 0)
const RATIO_DIR_AT_R336 = -13.1443;             // direct edge ratio at R* = 3.36
const RATIO_CLOSED_AT_R336 = -13.1429;          // closed factor 3(1/a - a R^2) at R* = 3.36
const REL_BIAS_AT_R336 = -2.72746e-5;           // relBias(3.36) = ratioDir * (I2/I1)
const TAIL_BAR = 1e-3;                          // imp-97497 far-field tail bar

// --- edge-amplitude floor, estimate 1: residual bias at the measured zero crossing ---
// At R = Rc the closed ratio is exactly 0, so the whole direct residual is measurement floor.
const FLOOR_RATIO_ABS = Math.abs(RATIO_DIR_AT_RC);                 // 4.54022e-4 (ratio units)
const FLOOR_REL_BIAS_ZEROCROSS = FLOOR_RATIO_ABS * I2_OVER_I1;     // ~9.42e-10 (relBias units)

// --- edge-amplitude floor, estimate 2: R*-local direct-vs-closed ratio deviation ---
const R336_REL_DEV = Math.abs(RATIO_DIR_AT_R336 - RATIO_CLOSED_AT_R336) / Math.abs(RATIO_CLOSED_AT_R336);
const FLOOR_REL_BIAS_R336LOCAL = Math.abs(REL_BIAS_AT_R336) * R336_REL_DEV; // ~2.91e-9

// --- signal-to-floor: how far the -2.727e-5 sign sits ABOVE each floor ---
const SNR_ZEROCROSS = Math.abs(REL_BIAS_AT_R336) / FLOOR_REL_BIAS_ZEROCROSS;   // ~2.90e4
const SNR_R336LOCAL = Math.abs(REL_BIAS_AT_R336) / FLOOR_REL_BIAS_R336LOCAL;   // ~9.39e3
const FACTOR_BELOW_TAIL_BAR = TAIL_BAR / Math.abs(REL_BIAS_AT_R336);           // ~36.7

export const IMP97625_FLOOR_ASSESSMENT = Object.freeze({
  i2OverI1: I2_OVER_I1,
  floorRatioAbs: FLOOR_RATIO_ABS,
  floorRelBiasZeroCross: FLOOR_REL_BIAS_ZEROCROSS,
  r336RelDeviation: R336_REL_DEV,
  floorRelBiasR336Local: FLOOR_REL_BIAS_R336LOCAL,
  relBiasAtR336: REL_BIAS_AT_R336,
  snrZeroCross: SNR_ZEROCROSS,
  snrR336Local: SNR_R336LOCAL,
  factorBelowTailBar: FACTOR_BELOW_TAIL_BAR,
  signResolvable: true,          // both floor estimates put |relBias| ~1e4x above the floor
  signChangeRadiusResolvable: false, // at Rc relBias ~ floor, so the exact radius is not resolvable
});

export const IMP97625_VERDICT = Object.freeze({
  ticket: 'imp-97625',
  question:
    'is the imp-97605/imp-97580 far-field tail bias relBias(3.36) = -2.72746e-5 above or inside the ' +
    'edge-amplitude measurement floor -- is its NEGATIVE SIGN a genuine signal for the imp-97497 ' +
    '< 1e-3 tail bar or numerical noise?',
  answer:
    'the negative sign is MEANINGFUL, not noise. The edge-amplitude floor, read two independent ways ' +
    '-- (1) the imp-97605 residual ratio at the measured zero crossing, 4.54e-4 in ratio units => ' +
    '9.42e-10 in relBias units, and (2) the R*-local direct-vs-closed ratio deviation 1.065e-4 => ' +
    '2.91e-9 in relBias units -- lands at ~1e-9. |relBias(3.36)| = 2.727e-5 sits 2.90e4x above the ' +
    'first floor and 9.39e3x above the second, so its sign is resolvable by roughly four orders of ' +
    'magnitude. The "sign change inside the floor" reported by imp-97605 is local to Rc, where relBias ' +
    'itself is O(1e-9) ~ the floor: only the exact sign-change RADIUS is unresolvable there, not the ' +
    'sign at R* = 3.36. The bias also sits 36.7x below the imp-97497 < 1e-3 tail bar, so a resolved ' +
    'but tiny negative bias does not threaten that bar. Assessment only; no bound moves.',
  binding_2a: LN3,
  signChangeR: RC,
  floorRelBiasZeroCross: FLOOR_REL_BIAS_ZEROCROSS,
  floorRelBiasR336Local: FLOOR_REL_BIAS_R336LOCAL,
  relBiasAtR336: REL_BIAS_AT_R336,
  snrZeroCross: SNR_ZEROCROSS,
  snrR336Local: SNR_R336LOCAL,
  signResolvableAtR336: true,
  signChangeRadiusResolvableAtRc: false,
  factorBelowTailBar: FACTOR_BELOW_TAIL_BAR,
  // unchanged program state
  assessmentOnly: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97625_TAIL_BIAS_SIGN_RESOLVABLE_ABOVE_FLOOR -- the imp-97605/imp-97580 far-field tail bias ' +
    'relBias(3.36) = -2.727e-5 sits ~1e4x ABOVE the edge-amplitude measurement floor (~1e-9, from the ' +
    'zero-crossing residual and the R*-local ratio deviation), so its negative sign is a genuine ' +
    'resolvable signal, not noise; only the sign-change RADIUS at Rc stays below the floor. The bias ' +
    'sits 36.7x below the imp-97497 < 1e-3 tail bar. Assessment only; no bound moves; reach 2a <= 0.96.',
  qed: false,
});
export default IMP97625_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97625_ASSERTIONS = [
  {
    id: 'imp97625-zero-crossing-floor-recomputes',
    holds: () =>
      Math.abs(FLOOR_REL_BIAS_ZEROCROSS - 9.42e-10) < 5e-12 &&
      Math.abs(FLOOR_RATIO_ABS - 4.54022e-4) < 1e-9,
    why: 'the edge-amplitude floor from the imp-97605 zero-crossing residual is 4.54e-4 in ratio units, i.e. 9.42e-10 in relBias units (matching the imp-97605 table relBiasDir at Rc).',
  },
  {
    id: 'imp97625-r336-local-floor-in-range',
    holds: () =>
      R336_REL_DEV > 5e-5 && R336_REL_DEV < 2e-4 &&
      FLOOR_REL_BIAS_R336LOCAL > 1e-9 && FLOOR_REL_BIAS_R336LOCAL < 5e-9,
    why: 'the R*-local direct-vs-closed ratio deviation (~1.07e-4) gives an independent relBias floor ~2.9e-9, agreeing with the zero-crossing floor to within one order of magnitude.',
  },
  {
    id: 'imp97625-sign-resolvable-above-floor',
    holds: () =>
      SNR_ZEROCROSS > 1e4 && SNR_R336LOCAL > 1e3 &&
      Math.abs(REL_BIAS_AT_R336) > 100 * Math.max(FLOOR_REL_BIAS_ZEROCROSS, FLOOR_REL_BIAS_R336LOCAL),
    why: 'the far-field-optimum bias |relBias(3.36)| = 2.727e-5 exceeds both floor estimates by ~1e4x, so its negative sign is a genuine resolvable signal, not measurement noise.',
  },
  {
    id: 'imp97625-bias-below-tail-bar',
    holds: () =>
      Math.abs(REL_BIAS_AT_R336) < TAIL_BAR &&
      FACTOR_BELOW_TAIL_BAR > 30 && FACTOR_BELOW_TAIL_BAR < 45,
    why: 'the resolved negative bias sits 36.7x below the imp-97497 < 1e-3 far-field tail bar, so it does not threaten that bar.',
  },
  {
    id: 'imp97625-radius-not-resolvable-signal-is',
    holds: () =>
      IMP97625_FLOOR_ASSESSMENT.signResolvable === true &&
      IMP97625_FLOOR_ASSESSMENT.signChangeRadiusResolvable === false,
    why: 'the sign at R* = 3.36 is resolvable while the exact sign-change RADIUS at Rc is not, reconciling this assessment with the imp-97605 "sign change inside the floor" report.',
  },
  {
    id: 'imp97625-program-state-unchanged-no-qed',
    holds: () =>
      IMP97625_VERDICT.assessmentOnly === true &&
      IMP97625_VERDICT.operatorPositivityProved === false &&
      IMP97625_VERDICT.coercivityConstantProved === false &&
      IMP97625_VERDICT.boundMoves === false &&
      IMP97625_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97625_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97625_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97625_VERDICT.subGap === 'string' &&
      IMP97625_VERDICT.subGap.includes('IMP97625_TAIL_BIAS_SIGN_RESOLVABLE_ABOVE_FLOOR') &&
      IMP97625_VERDICT.qed === false,
    why: 'assessment only: the tail-bias sign is resolved above the floor; no positivity, no coercivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97625_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97625-krein-tail-bias-signal-vs-floor-assessment assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
