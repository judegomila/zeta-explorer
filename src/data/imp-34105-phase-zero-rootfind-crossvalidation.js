/**
 * @module imp-34105-phase-zero-rootfind-crossvalidation
 *
 * imp-34105 (accuracy, frontier-cross-validation): CROSS-VALIDATE the imp-34045 closed-form phase-zero
 * branch angles against an INDEPENDENT direct root-find, confirming the residual-based branch
 * identification reproduces from a second code path.
 *
 * imp-34045 placed the outer phase-zero branches at the closed-form angles theta = pi/2 -+ pi/p
 * (real-NEGATIVE, arg(-A) = pi) and theta = pi/2 -+ 2 pi/p (real-POSITIVE, arg(-A) = 2 pi), p = 1 + alpha,
 * and validated them by EVALUATING the realness residual |Im|/|amp| AT those predicted angles (finding ~0
 * with the correct real-axis sign). It never independently ROOT-FINDS the crossings. This module locates the
 * crossings from scratch: on a fine theta grid it brackets every sign change of Im(-A)(theta), bisects each
 * to machine precision, classifies the located root by the sign of Re(-A) and by the nearest half-turn
 * k pi of the continuous phase, and MEASURES the discrepancy between the independently located roots and the
 * closed-form angles pi/2 - k pi/p. The two branch families reproduce to bisection tolerance (~1e-13) from a
 * second code path.
 *
 * THE INDEPENDENT ROOT-FIND (a second code path)
 * ----------------------------------------------
 * A real-axis crossing of -A(alpha, theta) is exactly a zero of Im(-A)(theta) (arg a multiple of pi). We do
 * NOT use the closed-form angle formula to locate them; we sample the numerically-evaluated complex amplitude
 * -A(alpha, theta) = [Re, Im], detect consecutive-sample sign changes of Im, and bisect each bracket. Each
 * located root is then CLASSIFIED independently:
 *   - k = round( p (pi/2 - theta) / pi )  gives the half-turn index of the continuous phase at the root;
 *   - sign of Re(-A) at the root gives the real axis: Re > 0 for k even (positive axis, arg = 0 or -+2pi),
 *     Re < 0 for k odd (negative axis, arg = -+pi).
 * The closed-form prediction for that root is theta_cf = pi/2 - k pi/p, and the discrepancy is |theta - theta_cf|.
 *
 * TWO WINDOWS
 * -----------
 *   (a) OPEN INTERVAL (0, pi): the wrapped phase arg(-A) = p(pi/2 - theta) stays inside (-p pi/2, p pi/2) with
 *       p pi/2 < pi for alpha < 1, so Im(-A) changes sign EXACTLY ONCE on (0, pi) -- at the central real-POSITIVE
 *       zero theta = pi/2 (k = 0). The independent root-find therefore recovers precisely ONE crossing on (0, pi),
 *       reproducing the imp-33970 uniqueness verdict from a second code path.
 *   (b) WIDENED WINDOW [pi/2 - 2pi/p - m, pi/2 + 2pi/p + m] (margin m = 0.3 < pi/p, so the k = -+3 crossings are
 *       excluded): the five crossings k in {-2, -1, 0, 1, 2} are all located. k = -+1 are the real-NEGATIVE
 *       family (i) at pi/2 -+ pi/p (Re < 0); k = -+2 are the real-POSITIVE family (ii) at pi/2 -+ 2 pi/p (Re > 0);
 *       k = 0 is the central zero. Each matches its closed-form angle to ~1e-13.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY, a numerical cross-check of the imp-34045 branch identification on the inherited imp-33924
 * closed form for the model cusp rho(x) = |x|^{-alpha}. It establishes NO operator positivity, does NOT
 * re-derive the m_prime -> C_ren map off-axis/off-exponent, and does NOT discharge H4 (imp-33766);
 * G6a_shock_lipschitz STAYS OPEN. C_mb GUE-conditional untouched; imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-34045-phase-zero-endpoint-degeneracy (residual-based branch identification AT the predicted angles)
 * @see imp-34104-second-positive-branch-geometry (the family (ii) real-positive branch geometry)
 * @see imp-33970-joint-phase-zero-uniqueness (theta = pi/2 unique on (0,pi) for every alpha in (0,1))
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 */

// B(alpha) = Gamma(1-alpha) Gamma(1+alpha) = pi alpha / sin(pi alpha).
function bOfAlpha(alpha) {
  return (Math.PI * alpha) / Math.sin(Math.PI * alpha);
}

// Joint leading amplitude -A(alpha, theta), returned as [Re, Im], with
//   A(alpha, theta) = B(alpha) e^{-i(1+alpha)theta} [1 + e^{i(1+alpha)pi}]   (imp-33924 closed form).
function negLeadingAmplitude(alpha, theta) {
  const p = 1 + alpha;
  const bracket = [1 + Math.cos(p * Math.PI), Math.sin(p * Math.PI)]; // 1 + e^{i(1+alpha)pi}
  const rot = [Math.cos(-p * theta), Math.sin(-p * theta)]; // e^{-i(1+alpha)theta}
  const b = bOfAlpha(alpha);
  const aRe = b * (bracket[0] * rot[0] - bracket[1] * rot[1]);
  const aIm = b * (bracket[0] * rot[1] + bracket[1] * rot[0]);
  return [-aRe, -aIm]; // -A(alpha, theta)
}

// imaginary part Im(-A)(theta): a real-axis crossing is exactly a zero of this.
function imNegA(alpha, theta) {
  return negLeadingAmplitude(alpha, theta)[1];
}

// bisect a bracketed sign change of Im(-A) to machine precision (100 iterations).
function bisectImZero(alpha, lo, hi) {
  let a = lo;
  let b = hi;
  let fa = imNegA(alpha, a);
  for (let i = 0; i < 100; i++) {
    const mid = 0.5 * (a + b);
    const fm = imNegA(alpha, mid);
    if (fm === 0) return mid;
    if ((fa < 0) === (fm < 0)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return 0.5 * (a + b);
}

// locate every Im(-A) sign change on [a, b] via a fine scan + bisection (a SECOND code path -- no closed-form
// angle formula is used to find the roots).
function findImZeros(alpha, a, b, n) {
  const roots = [];
  let prevT = a;
  let prevF = imNegA(alpha, a);
  for (let i = 1; i <= n; i++) {
    const t = a + ((b - a) * i) / n;
    const f = imNegA(alpha, t);
    if (f === 0) {
      roots.push(t);
    } else if (prevF !== 0 && prevF * f < 0) {
      roots.push(bisectImZero(alpha, prevT, t));
    }
    prevT = t;
    prevF = f;
  }
  return roots;
}

// ---- sweep alpha across the cusp-exponent range (0, 1) -------------------------------------------
const ALPHA_GRID = [0.1, 0.25, 0.5, 0.75, 0.9, 0.99];

const SCAN_POINTS = 4000; // fine enough that no two crossings (spacing pi/p) share a scan cell
const EDGE = 1e-4; // keep the open-interval scan strictly inside (0, pi)

const ROWS = ALPHA_GRID.map((alpha) => {
  const p = 1 + alpha;

  // (a) independent root-find on the OPEN interval (0, pi): expect exactly ONE crossing at theta = pi/2.
  const openRoots = findImZeros(alpha, EDGE, Math.PI - EDGE, SCAN_POINTS);
  const centralRoot = openRoots.length ? openRoots.reduce((best, r) => (Math.abs(r - Math.PI / 2) < Math.abs(best - Math.PI / 2) ? r : best), openRoots[0]) : NaN;
  const centralErrVsPiOver2 = Math.abs(centralRoot - Math.PI / 2);
  const centralReSign = negLeadingAmplitude(alpha, centralRoot)[0]; // > 0 (positive real axis)

  // (b) independent root-find on the WIDENED window: expect the five crossings k in {-2,-1,0,1,2}.
  const margin = 0.3; // < pi/p, so k = -+3 crossings (at 3 pi/p) are excluded
  const half = (2 * Math.PI) / p + margin;
  const wideRoots = findImZeros(alpha, Math.PI / 2 - half, Math.PI / 2 + half, SCAN_POINTS);

  // classify each located root INDEPENDENTLY: half-turn index k, closed-form angle, discrepancy, axis sign.
  const classified = wideRoots.map((theta) => {
    const k = Math.round((p * (Math.PI / 2 - theta)) / Math.PI); // half-turn index from the located root
    const closedForm = Math.PI / 2 - (k * Math.PI) / p; // imp-34045 closed-form angle for this k
    const discrepancy = Math.abs(theta - closedForm);
    const reSign = negLeadingAmplitude(alpha, theta)[0];
    return { theta, k, closedForm, discrepancy, reSign };
  });

  const byK = (kk) => classified.find((c) => c.k === kk);
  const negLower = byK(1); // pi/2 - pi/p, arg = pi (Re < 0)
  const negUpper = byK(-1); // pi/2 + pi/p, arg = -pi (Re < 0)
  const posLower = byK(2); // pi/2 - 2 pi/p, arg = 2 pi (Re > 0)
  const posUpper = byK(-2); // pi/2 + 2 pi/p, arg = -2 pi (Re > 0)

  const maxDiscrepancy = classified.reduce((m, c) => Math.max(m, c.discrepancy), 0);

  // the located negative-real (k = -+1) roots have Re < 0; the positive-real (k = 0, -+2) roots have Re > 0.
  const negAxisSignsCorrect = [negLower, negUpper].every((c) => c && c.reSign < 0);
  const posAxisSignsCorrect = [posLower, posUpper].every((c) => c && c.reSign > 0) && centralReSign > 0;

  return {
    alpha,
    p: +p.toFixed(6),
    // (a) open-interval uniqueness reproduced from the second code path.
    numRootsInOpenInterval: openRoots.length, // 1
    centralRootDeg: +((centralRoot * 180) / Math.PI).toFixed(6),
    centralErrVsPiOver2: +centralErrVsPiOver2.toExponential(3), // ~0
    centralIsPositiveAxis: centralReSign > 0,
    // (b) five crossings located on the widened window, matched to closed form.
    numRootsInWideWindow: wideRoots.length, // 5
    negRealLowerRootDeg: negLower ? +((negLower.theta * 180) / Math.PI).toFixed(6) : null,
    negRealLowerClosedFormDeg: negLower ? +((negLower.closedForm * 180) / Math.PI).toFixed(6) : null,
    negRealLowerDiscrepancy: negLower ? +negLower.discrepancy.toExponential(3) : null,
    negRealUpperDiscrepancy: negUpper ? +negUpper.discrepancy.toExponential(3) : null,
    secondPosLowerRootDeg: posLower ? +((posLower.theta * 180) / Math.PI).toFixed(6) : null,
    secondPosLowerClosedFormDeg: posLower ? +((posLower.closedForm * 180) / Math.PI).toFixed(6) : null,
    secondPosLowerDiscrepancy: posLower ? +posLower.discrepancy.toExponential(3) : null,
    secondPosUpperDiscrepancy: posUpper ? +posUpper.discrepancy.toExponential(3) : null,
    maxDiscrepancyAllRoots: +maxDiscrepancy.toExponential(3), // ~1e-13
    negAxisSignsCorrect,
    posAxisSignsCorrect,
  };
});

// aggregate verdicts.
// (a) the independent root-find recovers EXACTLY ONE crossing on (0, pi), at theta = pi/2 -- uniqueness reproduced.
const EXACTLY_ONE_ROOT_IN_OPEN_INTERVAL = ROWS.every((r) => r.numRootsInOpenInterval === 1);
const CENTRAL_ROOT_IS_PI_OVER_2 = ROWS.every((r) => r.centralErrVsPiOver2 < 1e-9 && r.centralIsPositiveAxis === true);
// (b) all five crossings are located on the widened window.
const FIVE_ROOTS_IN_WIDE_WINDOW = ROWS.every((r) => r.numRootsInWideWindow === 5);
// the independently located roots reproduce the closed-form angles pi/2 - k pi/p to bisection tolerance.
const ALL_BRANCHES_REPRODUCE_CLOSED_FORM = ROWS.every((r) => r.maxDiscrepancyAllRoots < 1e-9);
// the real-axis signs from the second code path match imp-34045 (k odd -> Re < 0, k even -> Re > 0).
const AXIS_SIGNS_REPRODUCE = ROWS.every((r) => r.negAxisSignsCorrect === true && r.posAxisSignsCorrect === true);

// worst discrepancy anywhere in the sweep (reported as a single headline number).
const WORST_DISCREPANCY = ROWS.reduce((m, r) => Math.max(m, r.maxDiscrepancyAllRoots), 0);

export const IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION = {
  id: 'imp-34105',
  proofSection: 'S-frontier',
  category: 'accuracy',
  question:
    'Do the imp-34045 closed-form phase-zero branch angles theta = pi/2 -+ pi/p (real-negative, arg(-A) = pi) ' +
    'and theta = pi/2 -+ 2 pi/p (real-positive, arg(-A) = 2 pi) reproduce from an INDEPENDENT direct root-find? ' +
    'Bracket-and-bisect the zeros of Im(-A)(theta) on a fine grid, classify each by half-turn index and Re sign, ' +
    'and measure the discrepancy between the located roots and the closed-form angles.',
  method:
    'a SECOND code path: sample the numerically-evaluated complex amplitude -A(alpha, theta) = [Re, Im], detect ' +
    'consecutive-sample sign changes of Im, bisect each to machine precision, then classify by ' +
    'k = round(p(pi/2 - theta)/pi) and by sign of Re -- no closed-form angle formula is used to LOCATE the roots',
  windows:
    '(a) open interval (0, pi): exactly ONE crossing at theta = pi/2 (k = 0), reproducing imp-33970 uniqueness; ' +
    '(b) widened window [pi/2 -+ (2 pi/p + 0.3)]: five crossings k in {-2,-1,0,1,2} -- k = -+1 real-negative ' +
    'family (i) at pi/2 -+ pi/p, k = -+2 real-positive family (ii) at pi/2 -+ 2 pi/p',

  // per-alpha table.
  rows: ROWS,

  // aggregate findings.
  exactlyOneRootInOpenInterval: EXACTLY_ONE_ROOT_IN_OPEN_INTERVAL,
  centralRootIsPiOver2: CENTRAL_ROOT_IS_PI_OVER_2,
  fiveRootsInWideWindow: FIVE_ROOTS_IN_WIDE_WINDOW,
  allBranchesReproduceClosedForm: ALL_BRANCHES_REPRODUCE_CLOSED_FORM,
  axisSignsReproduce: AXIS_SIGNS_REPRODUCE,
  worstDiscrepancyAcrossSweep: +WORST_DISCREPANCY.toExponential(3), // ~1e-13

  crossValidationVerdict:
    'REPRODUCED. The independent bracket-and-bisect root-find recovers exactly ONE real-axis crossing on (0, pi) ' +
    '(at theta = pi/2, positive real axis) for every alpha in (0, 1) -- reproducing imp-33970 uniqueness from a ' +
    'second code path -- and, on the widened window, locates all five crossings k in {-2,-1,0,1,2} matching the ' +
    'imp-34045 closed-form angles pi/2 - k pi/p to bisection tolerance (worst discrepancy ~1e-13 across the whole ' +
    'sweep). The real-axis signs agree: the k = -+1 real-NEGATIVE family (i) has Re < 0 and the k = -+2 ' +
    'real-POSITIVE family (ii) has Re > 0, exactly as imp-34045 reported from the residual-at-predicted-angle path.',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The imp-34045 closed-form phase-zero branch angles are ' +
    'CROSS-VALIDATED against an independent direct root-find. Bracketing and bisecting the zeros of Im(-A)(theta) ' +
    '-- a second code path that never uses the closed-form angle formula to LOCATE the crossings -- recovers ' +
    'exactly ONE crossing on the open interval (0, pi), at the central real-POSITIVE zero theta = pi/2 (k = 0), ' +
    'for every alpha in the sweep, reproducing the imp-33970 uniqueness verdict. On a widened window that brackets ' +
    'the outer branches, the five crossings k in {-2,-1,0,1,2} are all located and, classified independently by ' +
    'half-turn index k = round(p(pi/2 - theta)/pi) and by the sign of Re(-A), match the imp-34045 closed-form ' +
    'angles pi/2 - k pi/p to bisection tolerance -- worst discrepancy ~1e-13 across the whole sweep. The real-axis ' +
    'signs reproduce too: the k = -+1 real-NEGATIVE family (i) crossings pi/2 -+ pi/p carry Re < 0 and the k = -+2 ' +
    'real-POSITIVE family (ii) crossings pi/2 -+ 2 pi/p carry Re > 0, exactly as imp-34045 found by evaluating the ' +
    'realness residual AT the predicted angles. The residual-based branch identification therefore reproduces from ' +
    'an independent code path. Pure phase-condition geometry on the inherited imp-33924 closed form; establishes ' +
    'NO operator positivity; does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent and does NOT ' +
    'discharge H4 (imp-33766). C_mb GUE-conditional untouched; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION_ASSERTIONS = [
  {
    // the independent root-find recovers exactly one crossing on (0, pi), at theta = pi/2 -- uniqueness reproduced.
    id: 'imp34105-exactly-one-root-in-open-interval',
    description: 'bracket-and-bisect finds exactly ONE Im(-A) zero on (0, pi), at theta = pi/2 (positive real axis)',
    holds: () =>
      IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.exactlyOneRootInOpenInterval === true &&
      IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.centralRootIsPiOver2 === true,
  },
  {
    // all five crossings are located on the widened window from the second code path.
    id: 'imp34105-five-roots-in-wide-window',
    description: 'the widened-window root-find locates all five crossings k in {-2,-1,0,1,2}',
    holds: () => IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.fiveRootsInWideWindow === true,
  },
  {
    // the located roots reproduce the imp-34045 closed-form angles pi/2 - k pi/p to bisection tolerance.
    id: 'imp34105-branches-reproduce-closed-form',
    description: 'the independently located roots match the closed-form angles pi/2 - k pi/p to ~1e-13',
    holds: () =>
      IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.allBranchesReproduceClosedForm === true &&
      IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.worstDiscrepancyAcrossSweep < 1e-9,
  },
  {
    // the real-axis signs reproduce: k odd -> Re < 0 (real-negative), k even -> Re > 0 (real-positive).
    id: 'imp34105-axis-signs-reproduce',
    description: 'k = -+1 crossings carry Re < 0 and k = -+2 (and central) crossings carry Re > 0, as imp-34045',
    holds: () => IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.axisSignsReproduce === true,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp34105-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.isRigorous === false &&
      IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.dischargesH4 === false &&
      /NO QED/.test(IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.verdict) &&
      /STAYS OPEN/.test(IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.verdict) &&
      /remains the rigorous SOTA/.test(IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.verdict) &&
      /C_mb GUE-conditional untouched/i.test(IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34105_PHASE_ZERO_ROOTFIND_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34105-phase-zero-rootfind-crossvalidation assertion failed: ${a.id}`);
  }
}
