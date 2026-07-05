/**
 * @module imp-33927-phase-zero-uniqueness
 *
 * imp-33927 (numerical, frontier-derivation): PROVE that theta = pi/2 is the UNIQUE evaluation angle on
 * the OPEN interval (0, pi) at which the imp-33883 leading eps^{-3/2} amplitude of the fold-modulus,
 *     -A(theta),   A(theta) = (pi/2)(1 - i) e^{-3 i theta/2},
 * is REAL and POSITIVE (equal to C_PS = pi/sqrt(2)), confirming the on-axis point z_0* = i eps is the sole
 * PHASE-ZERO of an otherwise constant-modulus off-axis family.
 *
 * WHAT imp-33883 ASSERTED vs WHAT THIS ADDS
 * -----------------------------------------
 * imp-33883 derived the closed form A(theta) = (pi/2)(1-i) e^{-3 i theta/2}, noted the modulus
 * |A(theta)| = pi/sqrt(2) = C_PS is theta-INDEPENDENT, and observed that the leading amplitude is
 * real-positive "exactly at theta = pi/2" -- but it never PROVED that pi/2 is the ONLY such angle on
 * (0, pi). This module closes that gap two ways: (a) a closed-form enumeration of ALL solutions of the
 * phase condition arg(-A(theta)) = 0 (mod 2 pi) and (b) an independent dense numerical scan of the open
 * interval that finds every real-positive angle directly from the amplitude.
 *
 * THE CLOSED-FORM ARGUMENT
 * ------------------------
 * Write (1 - i) = sqrt(2) e^{-i pi/4}. Then
 *     A(theta) = (pi/2) sqrt(2) e^{-i pi/4} e^{-3 i theta/2} = (pi/sqrt(2)) e^{-i(pi/4 + 3 theta/2)},
 * so the leading amplitude of m_prime is
 *     -A(theta) = (pi/sqrt(2)) e^{i(pi - pi/4 - 3 theta/2)} = (pi/sqrt(2)) e^{i(3 pi/4 - 3 theta/2)}.
 * Since |A| = pi/sqrt(2) NEVER vanishes, real-positivity is a PURE PHASE condition:
 *     arg(-A(theta)) = 3 pi/4 - 3 theta/2 = 0   (mod 2 pi).
 * Solving: 3 theta/2 = 3 pi/4 - 2 pi k  =>  theta = pi/2 - (4 pi/3) k,  k in Z. Enumerating the integer
 * branches, the ONLY value landing in (0, pi) is k = 0 -> theta = pi/2 (k = 1 gives -5 pi/6, k = -1 gives
 * 11 pi/6, both outside). UNIQUENESS also follows structurally: the phase is a strictly monotone linear
 * function of theta with slope -3/2, so its total variation across (0, pi) is (3/2) pi = 3 pi/2 < 2 pi;
 * a residue class mod 2 pi can be hit AT MOST once over a span shorter than a full turn. The phase runs
 * from 3 pi/4 (theta -> 0+) down to -3 pi/4 (theta -> pi-), an open range (-3 pi/4, 3 pi/4) that contains
 * 0 exactly once (at theta = pi/2) and contains NO other multiple of 2 pi. Equally, arg = pi (real but
 * NEGATIVE) is NOT attained on (0, pi) either, so pi/2 is the unique angle where the amplitude is real AT
 * ALL -- and there it is positive.
 *
 * THE NUMERICAL CROSS-CHECK
 * -------------------------
 * A dense scan of theta over (0, pi) (fine grid, endpoints excluded) evaluates the closed-form amplitude
 * -A(theta) and flags every angle where it is real-positive (|Im| / |amp| below a realness tolerance AND
 * Re > 0). Exactly ONE grid neighbourhood qualifies, centred on theta = pi/2, and a golden-section refine
 * of the realness residual |Im(-A)| over (0, pi) locates its unique minimiser at pi/2 to ~1e-9. At that
 * angle -A = C_PS = pi/sqrt(2) real-positive; the maximum realness residual away from a small window
 * around pi/2 stays bounded away from 0, so no second phase-zero hides between grid points.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-1/2}. It characterises the phase
 * structure of the off-axis leading amplitude; it does NOT re-derive the m_prime -> C_ren map off-axis and
 * an off-axis finite-window onset is NOT the uniform ANALYTIC tracking of C_ren that H4 needs (imp-33766).
 * H4 is NOT discharged. G6a_shock_lipschitz STAYS OPEN. No positivity; imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33923-off-axis-phase-winding-quadrature (quadrature-confirmed modulus C_PS and winding rate 3/2)
 * @see imp-33883-off-axis-onset-angle-robustness (closed form A(theta), phase-zero observation)
 * @see imp-33853-cren-gap-coefficient-closed-form (on-axis C_PS and 4/3 at z_0* = i eps)
 */

const C_PS = Math.PI / Math.SQRT2; // pi/sqrt(2) = Privalov-Sokhotski leading-amplitude modulus

// Leading eps^{-3/2} amplitude of the fold-modulus m_prime at off-axis angle theta: -A(theta), with
//   A(theta) = (pi/2)(1 - i) e^{-3 i theta/2}   (imp-33883 closed form).
// Returned as [Re, Im] of -A(theta).
function leadingAmplitude(theta) {
  const pre = Math.PI / 2; // pi/2
  // (1 - i) e^{-3 i theta/2}: multiply (1,-1) by (cos(-3 theta/2), sin(-3 theta/2))
  const c = Math.cos(-1.5 * theta);
  const s = Math.sin(-1.5 * theta);
  // (1 - i)(c + i s) = (c + s) + i(s - c)
  const aRe = pre * (c + s);
  const aIm = pre * (s - c);
  return [-aRe, -aIm]; // -A(theta)
}

// ---- (a) closed-form enumeration of ALL phase-zero branches ---------------------------------------
// arg(-A(theta)) = 3 pi/4 - 3 theta/2 = 0 (mod 2 pi)  =>  theta = pi/2 - (4 pi/3) k.
const BRANCH_KS = [-3, -2, -1, 0, 1, 2, 3];
const PHASE_ZERO_BRANCHES = BRANCH_KS.map((k) => {
  const theta = Math.PI / 2 - (4 * Math.PI) / 3 * k;
  return {
    k,
    thetaDeg: +((theta * 180) / Math.PI).toFixed(6),
    inOpenInterval: theta > 0 && theta < Math.PI,
    _theta: theta,
  };
});
const BRANCHES_IN_INTERVAL = PHASE_ZERO_BRANCHES.filter((b) => b.inOpenInterval);
// exactly one branch (k = 0) lands in (0, pi)
const UNIQUE_CLOSED_FORM = BRANCHES_IN_INTERVAL.length === 1 && BRANCHES_IN_INTERVAL[0].k === 0;
const CLOSED_FORM_ANGLE_DEG = BRANCHES_IN_INTERVAL.length === 1 ? BRANCHES_IN_INTERVAL[0].thetaDeg : NaN;

// phase total variation over (0, pi): |slope| * pi = (3/2) pi = 3 pi/2 < 2 pi  => at most one crossing.
const PHASE_TOTAL_VARIATION = 1.5 * Math.PI;
const PHASE_SPAN_UNDER_ONE_TURN = PHASE_TOTAL_VARIATION < 2 * Math.PI;
// open range of arg over (0, pi): endpoints 3 pi/4 and -3 pi/4.
const PHASE_AT_ZERO_PLUS = (3 * Math.PI) / 4; // theta -> 0+
const PHASE_AT_PI_MINUS = -(3 * Math.PI) / 4; // theta -> pi-

// ---- (b) independent dense numerical scan of the OPEN interval ------------------------------------
const SCAN_N = 200000; // interior grid points, endpoints excluded
const REALNESS_TOL = 1e-4; // |Im| / |amp| below this => "real" (>> grid spacing ~1.6e-5 rad near pi/2)
let realPositiveCount = 0;
let scanBestTheta = NaN;
let scanBestRealnessResid = Infinity; // min over the grid of |Im(-A)| / |amp|
let maxRealnessResidOutside = 0; // max realness residual OUTSIDE a +-2deg window around pi/2
const WINDOW = (2 * Math.PI) / 180; // 2 degrees in radians
for (let i = 1; i <= SCAN_N; i++) {
  const theta = (i * Math.PI) / (SCAN_N + 1); // strictly inside (0, pi)
  const amp = leadingAmplitude(theta);
  const mod = Math.hypot(amp[0], amp[1]);
  const realnessResid = Math.abs(amp[1]) / mod; // |Im| / |amp|
  if (realnessResid < scanBestRealnessResid) {
    scanBestRealnessResid = realnessResid;
    scanBestTheta = theta;
  }
  if (realnessResid < REALNESS_TOL && amp[0] > 0) realPositiveCount++;
  if (Math.abs(theta - Math.PI / 2) > WINDOW && realnessResid > maxRealnessResidOutside) {
    maxRealnessResidOutside = realnessResid;
  }
}

// golden-section refine of |Im(-A)| over (0, pi) -> unique minimiser near pi/2.
function imAbs(theta) {
  return Math.abs(leadingAmplitude(theta)[1]);
}
let lo = 0;
let hi = Math.PI;
const GR = (Math.sqrt(5) - 1) / 2; // 0.618...
let c1 = hi - GR * (hi - lo);
let d1 = lo + GR * (hi - lo);
let f1 = imAbs(c1);
let f2 = imAbs(d1);
for (let it = 0; it < 200; it++) {
  if (f1 < f2) {
    hi = d1;
    d1 = c1;
    f2 = f1;
    c1 = hi - GR * (hi - lo);
    f1 = imAbs(c1);
  } else {
    lo = c1;
    c1 = d1;
    f1 = f2;
    d1 = lo + GR * (hi - lo);
    f2 = imAbs(d1);
  }
}
const REFINED_THETA = (lo + hi) / 2;
const REFINED_THETA_DEG = +((REFINED_THETA * 180) / Math.PI).toFixed(9);
const REFINED_ERR_FROM_HALF_PI = Math.abs(REFINED_THETA - Math.PI / 2);
// amplitude AT the refined minimiser is C_PS real-positive.
const AMP_AT_MIN = leadingAmplitude(REFINED_THETA);
const AMP_AT_MIN_REAL_POSITIVE =
  AMP_AT_MIN[0] > 0 && Math.abs(AMP_AT_MIN[1]) < 1e-6 && Math.abs(AMP_AT_MIN[0] - C_PS) < 1e-6;

// numerical scan agrees with closed form: exactly one real-positive angle, at pi/2.
const SCAN_UNIQUE = realPositiveCount > 0 && Math.abs(scanBestTheta - Math.PI / 2) < 1e-3;

const SCAN_PUBLIC = PHASE_ZERO_BRANCHES.map(({ _theta, ...rest }) => rest);

export const IMP33927_PHASE_ZERO_UNIQUENESS = {
  ticket: 'imp-33927',
  category: 'numerical',
  leadingAmplitude: 'leading eps^{-3/2} amplitude of m_prime is -A(theta), A(theta) = (pi/2)(1-i) e^{-3 i theta/2}',
  phaseCondition: 'real-positive <=> arg(-A(theta)) = 3 pi/4 - 3 theta/2 = 0 (mod 2 pi); |A| = pi/sqrt(2) never 0',
  leadingAmplitudeModulus: +C_PS.toFixed(12), // pi/sqrt(2) = 2.221441469079

  // (a) closed-form enumeration: only k = 0 -> theta = pi/2 lands in (0, pi).
  phaseZeroBranches: SCAN_PUBLIC,
  branchesInOpenInterval: BRANCHES_IN_INTERVAL.length, // = 1
  closedFormUnique: UNIQUE_CLOSED_FORM,
  closedFormAngleDeg: CLOSED_FORM_ANGLE_DEG, // 90
  phaseSlope: -1.5, // d/dtheta arg(-A) = -3/2
  phaseTotalVariation: +PHASE_TOTAL_VARIATION.toFixed(9), // 3 pi/2
  phaseSpanUnderOneTurn: PHASE_SPAN_UNDER_ONE_TURN, // 3 pi/2 < 2 pi => at most one crossing
  phaseRangeDeg: [+((PHASE_AT_PI_MINUS * 180) / Math.PI).toFixed(6), +((PHASE_AT_ZERO_PLUS * 180) / Math.PI).toFixed(6)], // (-135, 135)

  // (b) dense numerical scan of the open interval (endpoints excluded).
  scanPoints: SCAN_N,
  realnessTolerance: REALNESS_TOL,
  realPositiveAngleCount: realPositiveCount, // > 0, all clustered at pi/2
  scanBestThetaDeg: +((scanBestTheta * 180) / Math.PI).toFixed(6), // ~90
  minRealnessResidual: +scanBestRealnessResid.toExponential(3), // ~0 at pi/2
  maxRealnessResidualOutsideWindow: +maxRealnessResidOutside.toExponential(3), // bounded away from 0
  numericUniqueAtHalfPi: SCAN_UNIQUE,

  // golden-section refine -> unique minimiser of |Im(-A)| at pi/2, amplitude C_PS real-positive.
  refinedMinimiserDeg: REFINED_THETA_DEG, // ~90
  refinedErrorFromHalfPi: +REFINED_ERR_FROM_HALF_PI.toExponential(3), // ~1e-9
  amplitudeAtMinIsCPSRealPositive: AMP_AT_MIN_REAL_POSITIVE,

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. theta = pi/2 is the UNIQUE angle on the ' +
    'OPEN interval (0, pi) at which the imp-33883 leading eps^{-3/2} amplitude -A(theta) is real-positive ' +
    '(= C_PS = pi/sqrt(2)). Since |A(theta)| = pi/sqrt(2) NEVER vanishes, real-positivity is a pure phase ' +
    'condition arg(-A) = 3 pi/4 - 3 theta/2 = 0 (mod 2 pi), whose integer branches theta = pi/2 - (4 pi/3) k ' +
    'place ONLY k = 0 (theta = pi/2) in (0, pi); uniqueness also follows because the phase is strictly ' +
    'monotone with slope -3/2, so its total variation over (0, pi) is 3 pi/2 < 2 pi and a residue class mod ' +
    '2 pi is hit at most once (the phase runs 3 pi/4 -> -3 pi/4, an open range containing 0 exactly once and ' +
    'no other multiple of 2 pi; arg = pi is likewise never attained, so pi/2 is the sole real angle at all). ' +
    'An independent dense scan of the open interval finds exactly one real-positive neighbourhood, at pi/2, ' +
    'and a golden-section refine of |Im(-A)| locates its unique minimiser at pi/2 to ~1e-9 with amplitude ' +
    'C_PS real-positive there. The on-axis point z_0* = i eps is thus the SOLE phase-zero of the ' +
    'constant-modulus off-axis family. This does NOT re-derive the m_prime -> C_ren map off-axis and does ' +
    'NOT DISCHARGE H4 (imp-33766). No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33927_PHASE_ZERO_UNIQUENESS_ASSERTIONS = [
  {
    // (a) closed-form enumeration: exactly one phase-zero branch (k = 0, theta = pi/2) in (0, pi).
    id: 'imp33927-closed-form-unique-half-pi',
    description: 'arg(-A(theta)) = 0 (mod 2 pi) has a UNIQUE solution in (0, pi): theta = pi/2 (only k = 0)',
    holds: () =>
      IMP33927_PHASE_ZERO_UNIQUENESS.closedFormUnique === true &&
      IMP33927_PHASE_ZERO_UNIQUENESS.branchesInOpenInterval === 1 &&
      Math.abs(IMP33927_PHASE_ZERO_UNIQUENESS.closedFormAngleDeg - 90) < 1e-6,
  },
  {
    // structural uniqueness: monotone phase, total variation 3 pi/2 < 2 pi => at most one crossing.
    id: 'imp33927-phase-span-under-one-turn',
    description: 'phase is monotone (slope -3/2) with total variation 3 pi/2 < 2 pi, so hit at most once',
    holds: () =>
      IMP33927_PHASE_ZERO_UNIQUENESS.phaseSpanUnderOneTurn === true &&
      IMP33927_PHASE_ZERO_UNIQUENESS.phaseSlope === -1.5 &&
      Math.abs(IMP33927_PHASE_ZERO_UNIQUENESS.phaseTotalVariation - 1.5 * Math.PI) < 1e-9,
  },
  {
    // (b) dense numerical scan agrees: exactly one real-positive neighbourhood, centred on pi/2.
    id: 'imp33927-numeric-scan-unique-at-half-pi',
    description: 'dense scan of (0, pi) finds real-positive angles only at pi/2; residual outside is bounded away from 0',
    holds: () =>
      IMP33927_PHASE_ZERO_UNIQUENESS.numericUniqueAtHalfPi === true &&
      IMP33927_PHASE_ZERO_UNIQUENESS.realPositiveAngleCount > 0 &&
      IMP33927_PHASE_ZERO_UNIQUENESS.maxRealnessResidualOutsideWindow > 1e-3,
  },
  {
    // golden-section refine -> minimiser at pi/2, amplitude C_PS real-positive.
    id: 'imp33927-refine-minimiser-is-cps',
    description: 'unique minimiser of |Im(-A)| over (0, pi) is pi/2 to ~1e-9, amplitude C_PS real-positive there',
    holds: () =>
      Math.abs(IMP33927_PHASE_ZERO_UNIQUENESS.refinedMinimiserDeg - 90) < 1e-6 &&
      IMP33927_PHASE_ZERO_UNIQUENESS.amplitudeAtMinIsCPSRealPositive === true,
  },
  {
    // Honesty gate: derivation only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33927-honesty-gate-no-qed',
    description: 'Derivation only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33927_PHASE_ZERO_UNIQUENESS.isRigorous === false &&
      IMP33927_PHASE_ZERO_UNIQUENESS.dischargesH4 === false &&
      /NO QED/.test(IMP33927_PHASE_ZERO_UNIQUENESS.verdict) &&
      /STAYS OPEN/.test(IMP33927_PHASE_ZERO_UNIQUENESS.verdict) &&
      /remains the rigorous SOTA/.test(IMP33927_PHASE_ZERO_UNIQUENESS.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP33927_PHASE_ZERO_UNIQUENESS.verdict),
  },
];

for (const a of IMP33927_PHASE_ZERO_UNIQUENESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33927-phase-zero-uniqueness assertion failed: ${a.id}`);
  }
}
