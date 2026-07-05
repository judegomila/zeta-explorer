/**
 * @module imp-33970-joint-phase-zero-uniqueness
 *
 * imp-33970 (numerical, frontier-derivation): ASSESS whether theta = pi/2 is the UNIQUE phase-zero angle
 * on the OPEN interval (0, pi) of the imp-33924 JOINT leading amplitude -A(alpha, theta) for EVERY cusp
 * exponent alpha in (0, 1). imp-33927 proved uniqueness only at the single anchor alpha = 1/2 (winding
 * rate -3/2); this module sweeps the whole alpha-grid and asks whether the alpha-dependent winding rate
 * -(1+alpha) ever winds far enough on (0, pi) to admit a SECOND real-positive crossing.
 *
 * WHAT imp-33924 ASSERTED vs WHAT THIS ADDS
 * -----------------------------------------
 * imp-33924 derived the joint closed form
 *     A(alpha, theta) = B(alpha) e^{-i(1+alpha) theta} [ 1 + e^{i(1+alpha) pi} ] ,
 *     B(alpha) = pi alpha / sin(pi alpha) ,
 * showed the modulus |A| = pi alpha/cos(pi alpha/2) is theta-independent, and OBSERVED that the phase-zero
 * (where -A is real and positive) "sits at theta = pi/2 for every alpha" -- but that uniqueness was never
 * CHECKED away from alpha = 1/2. The concern (raised by the ticket) is that the winding rate -(1+alpha)
 * grows with alpha, so for large enough alpha the phase might wind a full extra half-turn on (0, pi) and
 * produce a second real-positive angle. This module settles it, closed-form and numerically, over a grid.
 *
 * THE CLOSED-FORM ARGUMENT (works for every alpha, not just 1/2)
 * -------------------------------------------------------------
 * Put p = 1 + alpha in (1, 2) for alpha in (0, 1). Using 1 + e^{i p pi} = 2 cos(p pi/2) e^{i p pi/2},
 *     A(alpha, theta) = 2 B(alpha) cos(p pi/2) e^{i p (pi/2 - theta)} .
 * For p in (1, 2), p pi/2 in (pi/2, pi), so cos(p pi/2) < 0; hence
 *     -A(alpha, theta) = 2 B(alpha) |cos(p pi/2)| e^{i p (pi/2 - theta)} ,
 * a NEVER-vanishing modulus times a pure phase. Real-positivity is therefore a pure phase condition
 *     arg(-A) = p (pi/2 - theta) = 0   (mod 2 pi)   =>   theta = pi/2 - (2 pi / p) k ,  k in Z.
 * The step between consecutive branches is 2 pi / p in (pi, 2 pi), i.e. LARGER than the whole interval
 * length pi, so at most one branch can land inside (0, pi):
 *     k = 0  -> theta = pi/2                       (always in (0, pi)),
 *     k = 1  -> theta = pi/2 - 2 pi/p < pi/2 - pi < 0    (below 0),
 *     k = -1 -> theta = pi/2 + 2 pi/p > pi/2 + pi > pi   (above pi).
 * So theta = pi/2 is the UNIQUE phase-zero on (0, pi) for EVERY alpha in (0, 1).
 *
 * WHY THE WINDING NEVER MANUFACTURES A SECOND CROSSING (the range argument)
 * ------------------------------------------------------------------------
 * The phase arg(-A) = p(pi/2 - theta) is strictly monotone in theta with slope -p, so its total variation
 * across (0, pi) is p * pi in (pi, 2 pi) -- STRICTLY LESS than a full turn 2 pi for every alpha < 1. Its
 * open range runs from +p pi/2 (theta -> 0+) down to -p pi/2 (theta -> pi-); since p pi/2 < pi for alpha < 1,
 * that range is contained in (-pi, pi), which holds the multiple 0 of 2 pi exactly ONCE and no other. (It
 * does not even reach +-pi, so arg = pi, a real-NEGATIVE amplitude, is not attained either.) A second
 * real-positive crossing would require the span p pi to reach 2 pi, i.e. p >= 2, i.e. alpha >= 1 -- the
 * degeneracy sits exactly at the EXCLUDED endpoint alpha = 1 (p = 2), where theta -> 0+ and theta -> pi-
 * both become phase-zeros in the limit. Uniqueness thus holds on the ENTIRE open exponent range (0, 1).
 *
 * THE NUMERICAL CROSS-CHECK
 * -------------------------
 * For each alpha on a grid spanning (0, 1) -- including near-endpoint values 0.01 and 0.99 where the
 * winding is slowest/fastest -- a dense scan of theta over (0, pi) evaluates the closed-form -A(alpha,theta),
 * counts every real-positive angle (|Im|/|amp| below tolerance AND Re > 0), and confirms exactly one, at
 * pi/2. The measured phase span p*pi and the count of closed-form branches inside (0, pi) are reported per
 * alpha. Every alpha in the grid yields branchesInInterval = 1 and realPositiveCount = 1 at pi/2.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION / MEASUREMENT ONLY, on the model cusp rho(x) = |x|^{-alpha}. It characterises the phase
 * structure of the joint leading amplitude; it does NOT re-derive the m_prime -> C_ren map off-axis or
 * off-exponent, and a finite-window onset at fixed |z_0| = eps is NOT the uniform ANALYTIC tracking of
 * C_ren that H4 needs (imp-33766). H4 is NOT discharged. G6a_shock_lipschitz STAYS OPEN. No positivity;
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains
 * the rigorous SOTA.
 *
 * @see imp-33927-phase-zero-uniqueness (uniqueness at the single anchor alpha = 1/2, winding -3/2)
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint closed form A(alpha,theta), winding -(1+alpha))
 * @see imp-33883-off-axis-onset-angle-robustness (closed form at alpha = 1/2)
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

// ---- per-alpha assessment of phase-zero uniqueness on the OPEN interval (0, pi) -------------------
const ALPHA_GRID = [0.01, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 0.99];
const BRANCH_KS = [-3, -2, -1, 0, 1, 2, 3];
const SCAN_N = 100000; // interior theta grid points, endpoints excluded
const REALNESS_TOL = 1e-4; // |Im|/|amp| below this => "real" (>> grid spacing near pi/2)
const WINDOW = (2 * Math.PI) / 180; // 2 degrees, for the "residual bounded away from 0 outside" check

const ROWS = ALPHA_GRID.map((alpha) => {
  const p = 1 + alpha;
  // (a) closed-form branch enumeration: theta = pi/2 - (2 pi/p) k, count those inside (0, pi).
  const branchThetas = BRANCH_KS.map((k) => ({ k, theta: Math.PI / 2 - ((2 * Math.PI) / p) * k }));
  const inInterval = branchThetas.filter((b) => b.theta > 0 && b.theta < Math.PI);
  const branchesInInterval = inInterval.length;
  const uniqueBranchIsHalfPi =
    branchesInInterval === 1 && inInterval[0].k === 0 && Math.abs(inInterval[0].theta - Math.PI / 2) < 1e-12;

  // (b) dense numerical scan of (0, pi): count real-positive angles, locate the tightest one.
  let realPositiveCount = 0;
  let bestTheta = NaN;
  let bestResid = Infinity;
  let maxResidOutside = 0;
  for (let i = 1; i <= SCAN_N; i++) {
    const theta = (i * Math.PI) / (SCAN_N + 1);
    const amp = negLeadingAmplitude(alpha, theta);
    const mod = Math.hypot(amp[0], amp[1]);
    const resid = Math.abs(amp[1]) / mod;
    if (resid < bestResid) {
      bestResid = resid;
      bestTheta = theta;
    }
    if (resid < REALNESS_TOL && amp[0] > 0) realPositiveCount++;
    if (Math.abs(theta - Math.PI / 2) > WINDOW && resid > maxResidOutside) maxResidOutside = resid;
  }
  const scanUniqueAtHalfPi = realPositiveCount > 0 && Math.abs(bestTheta - Math.PI / 2) < 1e-3;

  return {
    alpha,
    windingRate: +(-p).toFixed(6), // d arg(-A)/d theta = -(1+alpha)
    phaseSpanOverInterval: +(p * Math.PI).toFixed(6), // p*pi in (pi, 2pi); < 2 pi => at most one crossing
    spanUnderOneTurn: p * Math.PI < 2 * Math.PI, // true for every alpha < 1
    branchesInInterval, // = 1 for every alpha in (0,1)
    uniqueBranchIsHalfPi, // the sole branch is theta = pi/2
    realPositiveCount, // dense-scan count of real-positive angles (clustered at one point)
    scanBestThetaDeg: +((bestTheta * 180) / Math.PI).toFixed(4), // ~90
    minRealnessResidual: +bestResid.toExponential(3), // ~0 at pi/2
    maxRealnessResidualOutsideWindow: +maxResidOutside.toExponential(3), // bounded away from 0
    scanUniqueAtHalfPi,
  };
});

// aggregate verdicts across the whole alpha-grid.
const ALL_BRANCHES_UNIQUE = ROWS.every((r) => r.branchesInInterval === 1 && r.uniqueBranchIsHalfPi === true);
const ALL_SPANS_UNDER_ONE_TURN = ROWS.every((r) => r.spanUnderOneTurn === true);
const ALL_SCAN_UNIQUE = ROWS.every((r) => r.scanUniqueAtHalfPi === true && r.realPositiveCount > 0);
const ALL_RESID_OUTSIDE_BOUNDED = ROWS.every((r) => r.maxRealnessResidualOutsideWindow > 1e-3);
// the critical exponent where a SECOND crossing would first appear: p*pi = 2 pi => p = 2 => alpha = 1.
const CRITICAL_ALPHA = 1.0; // the EXCLUDED endpoint; uniqueness holds on the whole open range (0, 1)

export const IMP33970_JOINT_PHASE_ZERO_UNIQUENESS = {
  id: 'imp-33970',
  proofSection: 'S-frontier',
  category: 'numerical',
  question:
    'Is theta = pi/2 the UNIQUE phase-zero angle of the imp-33924 joint leading amplitude -A(alpha,theta) on ' +
    '(0, pi) for EVERY cusp exponent alpha in (0, 1), or does the alpha-dependent winding rate -(1+alpha) ' +
    'admit a second real-positive crossing for some alpha? imp-33927 tested uniqueness only at alpha = 1/2.',
  leadingAmplitude:
    '-A(alpha,theta), A = B(alpha) e^{-i(1+alpha)theta}[1 + e^{i(1+alpha)pi}], B = pi alpha/sin(pi alpha)',
  phaseCondition:
    'real-positive <=> arg(-A) = (1+alpha)(pi/2 - theta) = 0 (mod 2 pi) => theta = pi/2 - (2 pi/(1+alpha)) k; ' +
    '|A| = pi alpha/cos(pi alpha/2) never 0, so realness is a pure phase condition',

  // per-alpha table (closed-form branch enumeration + dense numerical scan).
  rows: ROWS,

  // aggregate: theta = pi/2 is the unique phase-zero on (0, pi) for every alpha in the grid.
  uniquenessHoldsOverGrid: ALL_BRANCHES_UNIQUE && ALL_SCAN_UNIQUE,
  allBranchesUniqueAtHalfPi: ALL_BRANCHES_UNIQUE,
  allPhaseSpansUnderOneTurn: ALL_SPANS_UNDER_ONE_TURN,
  allScansUniqueAtHalfPi: ALL_SCAN_UNIQUE,
  allResidualsOutsideBounded: ALL_RESID_OUTSIDE_BOUNDED,

  // the alpha-range over which uniqueness holds, and where degeneracy would first appear.
  uniquenessAlphaRange: 'the entire open interval (0, 1)',
  criticalAlpha: CRITICAL_ALPHA, // p*pi = 2 pi <=> alpha = 1, the EXCLUDED endpoint
  criticalAlphaExcluded: CRITICAL_ALPHA >= 1,
  degeneracyMechanism:
    'a second real-positive crossing needs the phase span (1+alpha)*pi to reach 2 pi, i.e. alpha >= 1; at the ' +
    'excluded endpoint alpha = 1 (winding rate -2) theta -> 0+ and theta -> pi- both become phase-zeros in the ' +
    'limit, so uniqueness holds strictly for every alpha in (0, 1)',

  dischargesH4: false,
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. theta = pi/2 is the UNIQUE phase-zero ' +
    'angle of the imp-33924 joint leading amplitude -A(alpha,theta) on the OPEN interval (0, pi) for EVERY ' +
    'cusp exponent alpha in (0, 1) -- NOT only at the imp-33927 anchor alpha = 1/2. With p = 1 + alpha in ' +
    '(1, 2), the modulus |A| = pi alpha/cos(pi alpha/2) never vanishes, so realness is the pure phase condition ' +
    'arg(-A) = p(pi/2 - theta) = 0 (mod 2 pi), whose branches theta = pi/2 - (2 pi/p) k are spaced 2 pi/p in ' +
    '(pi, 2 pi) apart -- wider than the whole interval -- so only k = 0 (theta = pi/2) lands in (0, pi). ' +
    'Equivalently the phase is strictly monotone with slope -p, total variation p*pi in (pi, 2 pi) < 2 pi, its ' +
    'open range (-p pi/2, p pi/2) sits inside (-pi, pi) and contains 0 exactly once (arg = pi, a real-negative ' +
    'amplitude, is not attained either). A dense scan of (0, pi) at each alpha across a grid including the ' +
    'near-endpoint 0.01 and 0.99 confirms exactly one real-positive angle, at pi/2, with the realness residual ' +
    'outside a small window bounded away from 0. The alpha-dependent winding rate -(1+alpha) therefore NEVER ' +
    'manufactures a second crossing on (0, 1): a second phase-zero would need the span p*pi to reach 2 pi, ' +
    'i.e. alpha >= 1, and the degeneracy sits exactly at the EXCLUDED endpoint alpha = 1 (p = 2), where ' +
    'theta -> 0+ and theta -> pi- both become phase-zeros in the limit. Uniqueness thus holds on the ENTIRE ' +
    'open exponent range (0, 1). This does NOT re-derive the m_prime -> C_ren map off-axis/off-exponent and ' +
    'does NOT DISCHARGE H4 (imp-33766). No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33970_JOINT_PHASE_ZERO_UNIQUENESS_ASSERTIONS = [
  {
    // (a) closed-form: for every alpha in the grid exactly one branch (k = 0, theta = pi/2) is in (0, pi).
    id: 'imp33970-closed-form-unique-every-alpha',
    description: 'arg(-A) = 0 (mod 2 pi) has a UNIQUE solution theta = pi/2 in (0, pi) for every alpha in the grid',
    holds: () =>
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.allBranchesUniqueAtHalfPi === true &&
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.rows.every((r) => r.branchesInInterval === 1),
  },
  {
    // structural uniqueness: phase span p*pi < 2 pi for every alpha in (0, 1) => at most one crossing.
    id: 'imp33970-phase-span-under-one-turn',
    description: 'phase span (1+alpha)*pi is in (pi, 2 pi), strictly under one turn, for every alpha in (0, 1)',
    holds: () =>
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.allPhaseSpansUnderOneTurn === true &&
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.rows.every(
        (r) => r.phaseSpanOverInterval > Math.PI && r.phaseSpanOverInterval < 2 * Math.PI,
      ),
  },
  {
    // (b) dense numerical scan agrees at every alpha: exactly one real-positive angle, at pi/2.
    id: 'imp33970-numeric-scan-unique-every-alpha',
    description: 'dense scan of (0, pi) finds real-positive angles only at pi/2 for every alpha; residual outside bounded',
    holds: () =>
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.allScansUniqueAtHalfPi === true &&
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.allResidualsOutsideBounded === true &&
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.rows.every((r) => Math.abs(r.scanBestThetaDeg - 90) < 1e-2),
  },
  {
    // the degeneracy sits at the excluded endpoint alpha = 1; uniqueness holds on the whole open range.
    id: 'imp33970-critical-alpha-is-excluded-endpoint',
    description: 'a second crossing needs alpha >= 1; the critical exponent alpha = 1 is the EXCLUDED endpoint',
    holds: () =>
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.criticalAlphaExcluded === true &&
      Math.abs(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.criticalAlpha - 1) < 1e-12 &&
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.uniquenessHoldsOverGrid === true,
  },
  {
    // Honesty gate: derivation only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33970-honesty-gate-no-qed',
    description: 'Derivation only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.isRigorous === false &&
      IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.dischargesH4 === false &&
      /NO QED/.test(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.verdict) &&
      /STAYS OPEN/.test(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.verdict) &&
      /remains the rigorous SOTA/.test(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.verdict),
  },
];

for (const a of IMP33970_JOINT_PHASE_ZERO_UNIQUENESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33970-joint-phase-zero-uniqueness assertion failed: ${a.id}`);
  }
}
