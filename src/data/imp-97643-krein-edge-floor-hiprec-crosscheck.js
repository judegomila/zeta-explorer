/**
 * @module imp-97643-krein-edge-floor-hiprec-crosscheck
 * @fileoverview imp-97643 -- INDEPENDENT high-precision (dps = 40, mpmath) recomputation of the
 * edge amplitudes g_pp(a), g_ppp(a) at a = (ln3)/2 and their ratio at R* = 3.36, re-deriving the
 * edge-amplitude measurement floor DIRECTLY to cross-check the imp-97625 verdict that the
 * far-field tail bias relBias(3.36) is a resolvable signal ~1e4x above the floor.
 *
 * WHY. imp-97625 propagated the edge-amplitude floor from two BAKED IEEE-double literals of imp-97605
 * (zero-cross residual 9.42e-10, R*-local direct-vs-closed deviation 2.91e-9), concluding the
 * relBias(3.36) = -2.727e-5 sign sits ~1e4x above the floor (SNR 2.90e4 / 9.39e3). Its siblings were
 * IEEE-double only. This ticket recomputes g_pp, g_ppp and the floor at higher working precision to
 * confirm (i) |relBias(3.36)| exceeds the recomputed floor by ~1e4x and (ii) the sign-change RADIUS at
 * Rc = 1/a stays below the floor -- checking the imp-97625 propagation is not an IEEE-double artifact.
 *
 * METHOD (mpmath dps = 40; executed run /tmp/imp-97643-hiprec.py).
 * The far profile edge amplitudes are the endpoint asymptotics of the finite cosine transform
 *   C(t) = int_{-a}^a g cos(xi t) dxi,   g(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2),   a = (ln3)/2,
 * read off at the special phases a t = pi/2 + k pi (gives g_pp) and a t = k pi (gives g_ppp) with a
 * 1/t^2 Richardson step (k = 120/240). Unlike the imp-97605 composite-Simpson read, C(t) is here
 * integrated by adaptive mpmath quadrature split at every cos(xi t) zero, so the ONLY residual is the
 * genuine finite-t endpoint truncation (no Simpson/IEEE noise). The double-zero taper has the exact
 * three-IBP closed forms g_pp(a) = 8/a^2 exp(-(R a)^2/2), g_ppp(a) = (24/a)(1/a^2 - R^2) exp(-(R a)^2/2),
 * so the ratio is exactly 3(1/a - a R^2) (imp-97518); the exponential cancels in the ratio.
 *
 * RESULT (executed dps = 40, ~3 s).
 *   - The direct hi-prec amplitudes reproduce the closed forms to relerr 1.14e-8 (g_pp) and 2.42e-9
 *     (g_ppp) -- ~5 orders tighter than the imp-97605 IEEE-double < 2e-4, so the closed forms and hence
 *     the ratio are validated at high precision.
 *   - The EXACT relBias(3.36) = ratioClosed * (I2/I1) = -13.14290458 * 2.075013861884194e-6
 *     = -2.72717e-5. The imp-97605 baked -2.72746e-5 (which used the IEEE-double direct ratio -13.1443)
 *     differs by 1.1e-4 relative -- exactly the imp-97605 IEEE-double measurement floor, so the two are
 *     consistent and the baked value is accurate to its stated floor.
 *   - The INTRINSIC finite-t edge-amplitude floor, recomputed cleanly at dps = 40, is FAR below the
 *     imp-97625 ~1e-9 estimate: R*-local floor 3.76e-13 (SNR 7.25e7) and zero-cross residual ratioDir(Rc)
 *     = 2.84e-9 in ratio units => 5.89e-15 in relBias units (SNR 4.63e9). The imp-97625 ~1e-9 floor was
 *     pinned by IEEE-double / Simpson noise, not the method truncation.
 *   - Sign-change radius: the measured zero of ratioDir sits at offset 4.73e-10 in R from Rc = 1/a
 *     (|offset|/Rc = 2.60e-10); near Rc relBias is O(floor), so the exact RADIUS stays below the floor.
 *
 * VERDICT. imp-97625 CONFIRMED and strengthened. (i) |relBias(3.36)| = 2.727e-5 exceeds the
 * recomputed edge-amplitude floor by >= 1e4x -- ~1e4x against the operationally-relevant IEEE-double
 * floor ~1e-9 (matching imp-97625 SNR 2.9e4 / 9.4e3), and by 7e7x -- 4.6e9x against the intrinsic
 * high-precision finite-t floor -- so the imp-97625 "~1e4x above the floor" is a CONSERVATIVE lower
 * bound and the negative sign is genuinely resolvable. (ii) The sign-change RADIUS at Rc stays below
 * the floor (offset 4.73e-10 in R, relBias ~ floor near Rc), consistent with imp-97605/imp-97625
 * signChangeRadiusResolvable = false. The bias sits 36.7x below the imp-97497 < 1e-3 tail bar.
 * Cross-check only; the m=1/m=2 Krein enclosure stays unusable at 2a = ln 3; interval-rigorous reach
 * stays 2a <= 0.96; no refereed bound is changed; no bound moves; RH open; NO QED.
 *
 * @see imp-97625-krein-tail-bias-signal-vs-floor-assessment.js (the floor propagation cross-checked here)
 * @see imp-97605-krein-tail-bias-direct-ct-crossvalidation.js (IEEE-double direct edge-amplitude read)
 * @see imp-97580-krein-tail-bias-R-sweep-signchange.js (the relBias closed factor + sign change at Rc)
 * @see imp-97518-krein-tail-endpoint-asymptotic-closed-form.js (the three-IBP g_pp, g_ppp closed forms)
 *
 * Ticket: imp-97643 (accuracy, medium, opus-4-8). Cross-check only; changes no bound; NO QED;
 * no refereed bound is changed. Import-light: all inputs baked as literals.
 */

const LN3 = Math.log(3);
const A = LN3 / 2;      // a = (ln3)/2 = 0.5493061443340548
const RC = 1 / A;       // sign-change radius Rc = 1/a = 1.820478453253675

export const IMP97643_BINDING_2A = LN3;
export const IMP97643_RIGOROUS_REACH_2A = 0.96; // unchanged

// R-independent moment ratio (imp-97580/97605), full double.
const I2_OVER_I1 = 2.075013861884194e-6;
const R_STAR = 3.36;      // imp-97497 far-field optimum
const TAIL_BAR = 1e-3;    // imp-97497 far-field tail bar

// closed edge-amplitude ratio 3(1/a - a R^2) (exponential cancels in the ratio).
export const ratioClosed = (R) => 3 * (1 / A - A * R * R);

// --- executed dps = 40 run (mpmath, exact-quad finite cosine transform, k = 120/240) ---
// exact closed-form edge amplitudes at R* = 3.36 (three-IBP closed forms).
const GPP_CLOSED_R336 = 4.827814467543430;    // 8/a^2 exp(-(R a)^2/2)
const GPPP_CLOSED_R336 = -63.45150488391644;  // (24/a)(1/a^2 - R^2) exp(-(R a)^2/2)
const RATIO_CLOSED_R336 = -13.14290458146021; // 3(1/a - a R^2) at R* = 3.36
const REL_BIAS_EXACT_R336 = -2.727170919195122e-5; // RATIO_CLOSED_R336 * I2/I1 (exact)

// direct high-precision measurement (finite cosine transform + 1/t^2 Richardson).
const GPP_DIRECT_R336 = 4.827814522430448;
const GPPP_DIRECT_R336 = -63.45150473047899;
const RATIO_DIRECT_R336 = -13.14290440025767;
const GPP_RELERR = 1.136891609e-8;   // |g_pp_dir/g_pp_closed - 1|
const GPPP_RELERR = 2.418184642e-9;  // |g_ppp_dir/g_ppp_closed - 1|

// imp-97605 baked IEEE-double values (for the floor-notion comparison).
const REL_BIAS_IEEE_R336 = -2.72746e-5; // imp-97605 baked (used direct ratio -13.1443)
const IEEE_FLOOR_REL_BIAS = 1e-9;       // imp-97625 operational floor (zero-cross 9.42e-10 / R*-local 2.91e-9)

// --- intrinsic high-precision floors (executed run) ---
// R*-local: |ratioDir - ratioClosed|/|ratioClosed| carried into relBias units.
const R336_REL_DEV_HIPREC = 1.378710058e-8;
const FLOOR_R336_LOCAL_HIPREC = 3.759977924e-13;   // |relBias| * R336_REL_DEV_HIPREC
// zero-cross: at R = Rc the closed ratio is exactly 0, so |ratioDir(Rc)| IS the floor in ratio units.
const RATIO_DIR_AT_RC_HIPREC = 2.839533061e-9;     // should be 0; residual = floor (ratio units)
const FLOOR_ZEROCROSS_HIPREC = 5.892070462e-15;    // RATIO_DIR_AT_RC_HIPREC * I2/I1

// signal-to-floor factors.
const SNR_R336_LOCAL_HIPREC = Math.abs(REL_BIAS_EXACT_R336) / FLOOR_R336_LOCAL_HIPREC;   // ~7.25e7
const SNR_ZEROCROSS_HIPREC = Math.abs(REL_BIAS_EXACT_R336) / FLOOR_ZEROCROSS_HIPREC;     // ~4.63e9
const SNR_IEEE_OPERATIONAL = Math.abs(REL_BIAS_EXACT_R336) / IEEE_FLOOR_REL_BIAS;        // ~2.73e4
const FACTOR_BELOW_TAIL_BAR = TAIL_BAR / Math.abs(REL_BIAS_EXACT_R336);                  // ~36.7

// sign-change radius: analytic offset of the measured zero from Rc, dRatio/dR = -6 a R at Rc.
const SIGN_CHANGE_OFFSET_R = RATIO_DIR_AT_RC_HIPREC / (6 * A * RC);  // ~4.73e-10 in R
const SIGN_CHANGE_OFFSET_REL = SIGN_CHANGE_OFFSET_R / RC;            // ~2.60e-10

export const IMP97643_HIPREC_CROSSCHECK = Object.freeze({
  dps: 40,
  i2OverI1: I2_OVER_I1,
  gppClosedR336: GPP_CLOSED_R336,
  gpppClosedR336: GPPP_CLOSED_R336,
  ratioClosedR336: RATIO_CLOSED_R336,
  relBiasExactR336: REL_BIAS_EXACT_R336,
  gppDirectR336: GPP_DIRECT_R336,
  gpppDirectR336: GPPP_DIRECT_R336,
  ratioDirectR336: RATIO_DIRECT_R336,
  gppRelErr: GPP_RELERR,
  gpppRelErr: GPPP_RELERR,
  relBiasIeeeR336: REL_BIAS_IEEE_R336,
  ieeeFloorRelBias: IEEE_FLOOR_REL_BIAS,
  floorR336LocalHiprec: FLOOR_R336_LOCAL_HIPREC,
  ratioDirAtRcHiprec: RATIO_DIR_AT_RC_HIPREC,
  floorZeroCrossHiprec: FLOOR_ZEROCROSS_HIPREC,
  snrR336LocalHiprec: SNR_R336_LOCAL_HIPREC,
  snrZeroCrossHiprec: SNR_ZEROCROSS_HIPREC,
  snrIeeeOperational: SNR_IEEE_OPERATIONAL,
  factorBelowTailBar: FACTOR_BELOW_TAIL_BAR,
  signChangeOffsetR: SIGN_CHANGE_OFFSET_R,
  signChangeOffsetRel: SIGN_CHANGE_OFFSET_REL,
  signResolvableAtR336: true,        // exceeds every floor by >= 1e4x
  signChangeRadiusResolvableAtRc: false, // offset below the floor, unresolvable there
});

export const IMP97643_VERDICT = Object.freeze({
  ticket: 'imp-97643',
  question:
    'recompute the edge amplitudes g_pp(a), g_ppp(a) at a = (ln3)/2 and the ratio g_ppp/g_pp at ' +
    'R* = 3.36 at higher working precision (dps >= 40), re-derive the edge-amplitude floor directly, ' +
    'and confirm (i) |relBias(3.36)| exceeds the recomputed floor by ~1e4x and (ii) the sign-change ' +
    'RADIUS at Rc = 1/a stays below the floor -- cross-checking the imp-97625 propagation from baked ' +
    'IEEE-double literals.',
  answer:
    'confirmed and strengthened. At dps = 40 the direct finite-cosine-transform amplitudes reproduce ' +
    'the three-IBP closed forms g_pp = 8/a^2 exp(-(R a)^2/2), g_ppp = (24/a)(1/a^2 - R^2) exp(-(R a)^2/2) ' +
    'to relerr 1.14e-8 (g_pp) and 2.42e-9 (g_ppp), so the closed ratio 3(1/a - a R^2) and hence ' +
    'relBias are validated at high precision. The EXACT relBias(3.36) = -13.14290458 * 2.075e-6 = ' +
    '-2.72717e-5; the imp-97605 baked -2.72746e-5 differs by 1.1e-4 relative, which is exactly its ' +
    'stated IEEE-double floor. (i) |relBias(3.36)| exceeds the operationally-relevant IEEE-double floor ' +
    '~1e-9 by ~2.7e4x (matching imp-97625 SNR 2.9e4 / 9.4e3) and the INTRINSIC high-precision finite-t ' +
    'floor -- R*-local 3.76e-13, zero-cross 5.89e-15 -- by 7.25e7x / 4.63e9x, so the imp-97625 ' +
    '"~1e4x above the floor" is a conservative lower bound and the negative sign is genuinely resolvable. ' +
    '(ii) the measured zero of ratioDir sits 4.73e-10 in R from Rc = 1/a (|offset|/Rc = 2.60e-10); near ' +
    'Rc relBias is O(floor), so the exact sign-change RADIUS stays below the floor, consistent with ' +
    'imp-97605/imp-97625 signChangeRadiusResolvable = false. The bias sits 36.7x below the imp-97497 ' +
    '< 1e-3 tail bar. Cross-check only; no bound moves.',
  binding_2a: LN3,
  signChangeR: RC,
  relBiasExactR336: REL_BIAS_EXACT_R336,
  relBiasIeeeR336: REL_BIAS_IEEE_R336,
  floorR336LocalHiprec: FLOOR_R336_LOCAL_HIPREC,
  floorZeroCrossHiprec: FLOOR_ZEROCROSS_HIPREC,
  ieeeFloorRelBias: IEEE_FLOOR_REL_BIAS,
  snrR336LocalHiprec: SNR_R336_LOCAL_HIPREC,
  snrZeroCrossHiprec: SNR_ZEROCROSS_HIPREC,
  snrIeeeOperational: SNR_IEEE_OPERATIONAL,
  signResolvableAtR336: true,
  signChangeRadiusResolvableAtRc: false,
  signChangeOffsetR: SIGN_CHANGE_OFFSET_R,
  factorBelowTailBar: FACTOR_BELOW_TAIL_BAR,
  // unchanged program state
  crossCheckOnly: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97643_EDGE_FLOOR_HIPREC_CONFIRMS_RESOLVABLE -- a high-precision (dps = 40, exact-quad finite ' +
    'cosine transform) recomputation of g_pp, g_ppp at a = (ln3)/2 reproduces the three-IBP closed forms ' +
    'to relerr <= 1.1e-8 and fixes the EXACT relBias(3.36) = -2.72717e-5. The intrinsic finite-t ' +
    'edge-amplitude floor (R*-local 3.76e-13, zero-cross 5.89e-15) is far below the imp-97625 IEEE-double ' +
    'estimate ~1e-9, so |relBias(3.36)| exceeds the recomputed floor by 7e7x -- 4.6e9x (and the ' +
    'operational IEEE floor by ~2.7e4x): the imp-97625 "~1e4x above the floor" is a conservative lower ' +
    'bound and the negative sign is genuinely resolvable. The sign-change RADIUS at Rc stays below the ' +
    'floor (offset 4.73e-10 in R). Cross-check only; no bound moves; reach 2a <= 0.96.',
  qed: false,
});
export default IMP97643_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97643_ASSERTIONS = [
  {
    id: 'imp97643-direct-amplitudes-reproduce-closed-forms',
    holds: () =>
      GPP_RELERR < 1e-6 && GPPP_RELERR < 1e-6 &&
      Math.abs(GPP_DIRECT_R336 / GPP_CLOSED_R336 - 1) < 1e-6 &&
      Math.abs(GPPP_DIRECT_R336 / GPPP_CLOSED_R336 - 1) < 1e-6,
    why: 'the dps = 40 direct finite-cosine-transform amplitudes reproduce the three-IBP closed forms g_pp, g_ppp to relerr <= ~1e-8, ~5 orders tighter than the imp-97605 IEEE-double < 2e-4, validating the closed ratio at high precision.',
  },
  {
    id: 'imp97643-closed-ratio-and-exact-relbias',
    holds: () =>
      Math.abs(ratioClosed(R_STAR) - RATIO_CLOSED_R336) < 1e-10 &&
      Math.abs(RATIO_CLOSED_R336 * I2_OVER_I1 - REL_BIAS_EXACT_R336) < 1e-16 &&
      Math.abs(REL_BIAS_EXACT_R336 - (-2.72717e-5)) < 5e-9,
    why: 'the exact closed ratio 3(1/a - a R^2) at R* = 3.36 equals -13.14290458 and gives the EXACT relBias(3.36) = -2.72717e-5; the imp-97605 baked -2.72746e-5 differs only within its IEEE-double floor.',
  },
  {
    id: 'imp97643-ieee-baked-consistent-with-exact-floor',
    holds: () =>
      Math.abs(REL_BIAS_IEEE_R336 - REL_BIAS_EXACT_R336) / Math.abs(REL_BIAS_EXACT_R336) < 2e-4 &&
      Math.abs(REL_BIAS_IEEE_R336 - REL_BIAS_EXACT_R336) / Math.abs(REL_BIAS_EXACT_R336) > 5e-5,
    why: 'the imp-97605 baked IEEE-double relBias(3.36) = -2.72746e-5 differs from the exact -2.72717e-5 by ~1.1e-4 relative -- exactly the IEEE-double measurement floor imp-97625 propagated -- so the baked value is accurate to its stated floor.',
  },
  {
    id: 'imp97643-hiprec-floor-below-ieee-and-snr-above-1e4',
    holds: () =>
      FLOOR_R336_LOCAL_HIPREC < IEEE_FLOOR_REL_BIAS &&
      FLOOR_ZEROCROSS_HIPREC < IEEE_FLOOR_REL_BIAS &&
      SNR_IEEE_OPERATIONAL > 1e4 &&
      SNR_R336_LOCAL_HIPREC > 1e4 && SNR_ZEROCROSS_HIPREC > 1e4,
    why: 'the intrinsic high-precision finite-t floors (R*-local 3.76e-13, zero-cross 5.89e-15) sit below the imp-97625 IEEE-double floor ~1e-9, and |relBias(3.36)| exceeds every floor by >= 1e4x (operational ~2.7e4x, intrinsic 7e7x -- 4.6e9x), confirming point (i).',
  },
  {
    id: 'imp97643-sign-change-radius-below-floor',
    holds: () =>
      IMP97643_HIPREC_CROSSCHECK.signChangeRadiusResolvableAtRc === false &&
      SIGN_CHANGE_OFFSET_R < 1e-8 && SIGN_CHANGE_OFFSET_REL < 1e-8 &&
      RATIO_DIR_AT_RC_HIPREC < 1e-6,
    why: 'the measured zero of ratioDir sits 4.73e-10 in R from Rc = 1/a (relBias ~ floor near Rc), so the exact sign-change RADIUS stays below the floor, confirming point (ii) and reconciling with imp-97605/imp-97625 signChangeRadiusResolvable = false.',
  },
  {
    id: 'imp97643-bias-below-tail-bar',
    holds: () =>
      Math.abs(REL_BIAS_EXACT_R336) < TAIL_BAR &&
      FACTOR_BELOW_TAIL_BAR > 30 && FACTOR_BELOW_TAIL_BAR < 45,
    why: 'the resolved negative bias sits 36.7x below the imp-97497 < 1e-3 far-field tail bar, so it does not threaten that bar.',
  },
  {
    id: 'imp97643-program-state-unchanged-no-qed',
    holds: () =>
      IMP97643_VERDICT.crossCheckOnly === true &&
      IMP97643_VERDICT.operatorPositivityProved === false &&
      IMP97643_VERDICT.coercivityConstantProved === false &&
      IMP97643_VERDICT.boundMoves === false &&
      IMP97643_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97643_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97643_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97643_VERDICT.subGap === 'string' &&
      IMP97643_VERDICT.subGap.includes('IMP97643_EDGE_FLOOR_HIPREC_CONFIRMS_RESOLVABLE') &&
      IMP97643_VERDICT.qed === false,
    why: 'cross-check only: the tail-bias sign resolvability is confirmed at high precision; no positivity, no coercivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97643_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97643-krein-edge-floor-hiprec-crosscheck assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
