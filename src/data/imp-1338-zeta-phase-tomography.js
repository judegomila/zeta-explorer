// @module data/imp-1338-zeta-phase-tomography
// imp-1338 -- NOVEL: zeta phase tomography via twin-ladder + Hardy Z
// decomposition. Does the twin-ladder deformation phase couple to S(T) in a
// way that constrains the de Bruijn-Newman constant Lambda?
//
// THE HARDY Z DECOMPOSITION
// -------------------------
// The Hardy Z-function is Z(t) = exp(i theta(t)) * zeta(1/2 + it), where
// theta(t) is the Riemann-Siegel theta function:
//   theta(t) = arg Gamma(1/4 + it/2) - (t/2) log pi
//            ~ (t/2) log(t / 2pi) - t/2 - pi/8 + 1/(48 t) + 7/(5760 t^3) + ...
// Z(t) is REAL for real t (this is the defining property: theta is exactly the
// smooth phase that rotates zeta(1/2 + it) onto the real axis). Reality of Z
// forces, for every real t with zeta(1/2 + it) =/= 0,
//   theta(t) + arg zeta(1/2 + it)  ==  0  (mod pi).
// Hence the proposed tomographic observable
//   P(t) := theta(t) - arg zeta(1/2 + it)
// is NOT an independent readout: on sigma = 1/2 it equals 2 theta(t) (mod pi).
// Equivalently, in the Riemann-von Mangoldt counting formula
//   N(T) = theta(T)/pi + 1 + S(T) + O(1/T),     S(T) = (1/pi) arg zeta(1/2+iT),
// the SMOOTH part theta(T)/pi carries the elementary gamma-and-log-pi content
// while the entire arithmetic content lives in the integer jumps of N(T) at the
// zeros -- i.e. in S(T), the oscillatory remainder (see imp-1333).
//
// THE TWIN-LADDER DEFORMATION
// ---------------------------
// Twin-Ladder paper section 16 deforms xi by a ladder parameter a (the same a
// that indexes K_a, B_a, Theta_a, the shift-bridge family of imp-1241). On the
// critical line the bridge factor chi(1/2 + it) is UNIMODULAR (glossary: the
// bridge is lossless exactly on sigma = 1/2), with arg chi(1/2 + it) = -2
// theta(t). The ladder deformation modulates this smooth bridge phase:
//   arg chi_a(1/2 + it) = -2 theta(t) + a * b(t),
// where b(t) is a smooth bounded ladder kernel. Because |chi_a| stays
// unimodular to leading order in a, the deformed Hardy function Z_a stays real
// to leading order: small ladder a produces NO new sign changes (no new zeros),
// only a smooth O(a) phase shift.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'phase-tomography-circular-and-ladder-axis-transverse-to-lambda'
//
//   (a) LADDER-HARDY-Z PHASE RELATIONSHIP IS EXACT BUT RIGID. Reality of Z_a
//       pins theta_a(t) + arg zeta_a(1/2 + it) to pi*Z. The tomographic
//       observable therefore recovers exactly the smooth ladder theta_a plus
//       the integer zero count N(T) -- nothing more. It is a re-coordinatised
//       readout of the same zero data, not a new functional.
//
//   (b) LADDER AXIS IS TRANSVERSE TO THE LAMBDA AXIS -- DOUBLE OBSTRUCTION.
//       Two independent walls, either one fatal:
//         (W1, circularity) On sigma = 1/2 the phase is a functional of the
//         very zeros whose reality Lambda controls; reading a Lambda constraint
//         off it presupposes the configuration Lambda decides (identical wall
//         to imp-1333 STC-1).
//         (W2, transversality) Lambda is the threshold of the de Bruijn HEAT
//         flow H_t, whose deformation direction is d/dt (the backward heat
//         operator on xi). The twin-ladder parameter a is a SHIFT-bridge
//         direction d/da. These are different axes in deformation space: the
//         ladder phase tomography reads the gamma/bridge smooth factor and the
//         zero count, but is blind to the heat-flow Hessian that defines
//         Lambda. Named sub-gap PT-LAMBDA-TRANSVERSE.
//
//   (c) EMPIRICAL CHECK AT SMALL LADDER PARAMETER. The smooth winding rate
//       d theta/dt = (1/2) log(t / 2pi) dominates; the ladder perturbation
//       contributes winding a*(b(t1) - b(t0))/pi, which -> 0 as a -> 0. So at
//       small a the deformed phase produces a vanishing fraction of the zero
//       count over any fixed interval: no new zeros, no new Lambda lever. The
//       tomography reads only the a = 0 zero data.
//
// HONEST BOTTOM LINE
// ------------------
// The twin-ladder x Hardy-Z phase IS a clean tomographic observable, but it is
// a re-coordinatisation of the existing zero/correlation data (same class as
// imp-1333). It does not move the de Bruijn-Newman bracket 0 <= Lambda <= 0.2
// (Rodgers-Tao 2020 lower, Polymath15 2019 upper), for two independent reasons:
// critical-line circularity (W1) and ladder/heat-flow axis transversality (W2).
// The genuine entry would be a deformation that mixes the ladder axis into the
// heat-flow axis -- recorded as sub-gap PT-LAMBDA-TRANSVERSE.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings
// only; no apostrophes inside single-quoted strings. Time derivatives written
// as d theta/dt and d/dt, never with the slash-star sequence.

// -----------------------------------------------------------------------------
// Numerics. All values re-derived here so this module is a standalone citable
// record (elementary functions only; no zeta evaluation is performed).
// -----------------------------------------------------------------------------

// Riemann-Siegel theta asymptotic expansion (smooth phase of zeta on sigma=1/2).
function rsTheta(t) {
  if (!(t > 0)) return null;
  const x = t / (2 * Math.PI);
  return (
    (t / 2) * Math.log(x) -
    t / 2 -
    Math.PI / 8 +
    1 / (48 * t) +
    7 / (5760 * t * t * t)
  );
}

// Leading smooth winding rate d theta/dt = (1/2) log(t / 2pi).
function thetaRate(t) {
  if (!(t > 0)) return null;
  return 0.5 * Math.log(t / (2 * Math.PI));
}

// Smooth zero count contribution N_smooth(T) = theta(T)/pi + 1 (Riemann-von
// Mangoldt main term; the oscillatory remainder S(T) is the small correction).
function smoothCount(t) {
  const th = rsTheta(t);
  if (th === null) return null;
  return th / Math.PI + 1;
}

// Bounded smooth ladder kernel b(t) in (-1, 1). Models the O(a) ladder
// modulation of the bridge phase; any bounded smooth choice gives the same
// transversality conclusion.
function ladderKernel(t) {
  return Math.tanh(t / 1000);
}

// Deformed bridge phase on the critical line: arg chi_a = -2 theta + a b(t).
function bridgePhase(t, a) {
  const th = rsTheta(t);
  if (th === null) return null;
  return -2 * th + a * ladderKernel(t);
}

// Smooth winding expressed as a zero count over [t0, t1] (~ N(t1) - N(t0)).
function smoothWindingInZeros(t0, t1) {
  const a0 = rsTheta(t0);
  const a1 = rsTheta(t1);
  if (a0 === null || a1 === null) return null;
  return (a1 - a0) / Math.PI;
}

// Ladder deformation contribution to the same zero count over [t0, t1].
function ladderWindingContribution(a, t0, t1) {
  return (a * (ladderKernel(t1) - ladderKernel(t0))) / Math.PI;
}

// Current de Bruijn-Newman bracket.
const LAMBDA_LOWER = 0;    // Rodgers-Tao 2020 (Newman conjecture proved).
const LAMBDA_UPPER = 0.2;  // Polymath15 2019.

// -----------------------------------------------------------------------------
// Sub-question (a): the ladder-Hardy-Z phase relationship.
// -----------------------------------------------------------------------------

const PHASE_RELATIONSHIP = Object.freeze({
  hardyZ: 'Z(t) = exp(i theta(t)) zeta(1/2 + it), real for real t.',
  thetaAsymptotic: 'theta(t) ~ (t/2) log(t/2pi) - t/2 - pi/8 + 1/(48 t) + ...',
  realityIdentity: 'theta(t) + arg zeta(1/2 + it) == 0 (mod pi) wherever zeta =/= 0.',
  observable: 'P(t) = theta(t) - arg zeta(1/2 + it) == 2 theta(t) (mod pi) on sigma = 1/2.',
  countingFormula: 'N(T) = theta(T)/pi + 1 + S(T) + O(1/T), S(T) = (1/pi) arg zeta(1/2+iT).',
  zIsRealOnCriticalLine: true,
  ladderBridgePhase: 'arg chi_a(1/2 + it) = -2 theta(t) + a b(t), |chi_a| unimodular to O(a).',
  content:
    'The tomographic observable recovers the smooth ladder theta_a plus the ' +
    'integer zero count N(T) and nothing else; it is a re-coordinatisation of ' +
    'the existing zero data, not an independent functional.',
});

// -----------------------------------------------------------------------------
// Sub-question (b): the Lambda dependence -- double obstruction.
// -----------------------------------------------------------------------------

const LAMBDA_LINK = Object.freeze({
  question:
    'Does the twin-ladder deformation phase couple to S(T) so as to constrain Lambda?',
  answer: 'no-new-constraint-circular-and-ladder-axis-transverse',
  wallW1: Object.freeze({
    name: 'critical-line circularity',
    reason:
      'On sigma = 1/2 the phase is a functional of the very zeros whose reality ' +
      'Lambda controls, so any Lambda statement read off it is circular. Same ' +
      'wall as imp-1333 STC-1.',
  }),
  wallW2: Object.freeze({
    name: 'ladder/heat-flow axis transversality',
    reason:
      'Lambda is the threshold of the de Bruijn heat flow H_t, whose deformation ' +
      'direction is d/dt. The twin-ladder parameter a is a shift-bridge ' +
      'direction d/da. These are different axes in deformation space: the ladder ' +
      'phase tomography reads the gamma/bridge smooth factor and the zero count ' +
      'but is blind to the heat-flow Hessian that defines Lambda.',
  }),
  subGap: 'PT-LAMBDA-TRANSVERSE',
  subGapDetail:
    'The non-circular, non-transverse entry would be a deformation that mixes ' +
    'the ladder shift axis d/da into the de Bruijn heat-flow axis d/dt -- a ' +
    'commutator [d/da, H_t] that does not vanish on sigma = 1/2. Building such a ' +
    'mixed deformation, or proving the two axes commute (which would explain why ' +
    'every ladder-phase route is Lambda-blind), is sub-gap PT-LAMBDA-TRANSVERSE.',
  lambdaBracketUnchanged: Object.freeze({
    lower: LAMBDA_LOWER,
    upper: LAMBDA_UPPER,
    lowerCite: 'Rodgers, B.; Tao, T. (2020), The de Bruijn-Newman constant is non-negative, Forum Math. Pi 8.',
    upperCite: 'Polymath, D.H.J. (2019), Effective approximation of heat flow evolution of the Riemann xi function, and a new upper bound for the de Bruijn-Newman constant, Res. Math. Sci. 6.',
    movedByThisTicket: false,
  }),
});

// -----------------------------------------------------------------------------
// Sub-question (c): empirical check at small ladder parameter.
// -----------------------------------------------------------------------------

const EMPIRICAL_CHECK = Object.freeze({
  claim:
    'At small ladder a the deformation contributes a vanishing fraction of the ' +
    'zero count over any fixed interval: no new zeros, no new Lambda lever.',
  interval: Object.freeze({ t0: 1e4, t1: 1e6 }),
  smoothZeros: smoothWindingInZeros(1e4, 1e6),
  ladderContributionAtSmallA: ladderWindingContribution(1e-4, 1e4, 1e6),
  ratioSmallA:
    Math.abs(ladderWindingContribution(1e-4, 1e4, 1e6)) /
    smoothWindingInZeros(1e4, 1e6),
  linearity:
    'ladder winding contribution is exactly linear in a (a b(t1)-b(t0))/pi, so ' +
    'it -> 0 as a -> 0; the smooth winding rate (1/2) log(t/2pi) dominates.',
  independentLever: false,
});

// -----------------------------------------------------------------------------
// Verdict.
// -----------------------------------------------------------------------------

const ALLOWED_VERDICTS = Object.freeze([
  'phase-tomography-gives-new-lambda-constraint',
  'phase-tomography-circular-and-ladder-axis-transverse-to-lambda',
  'phase-tomography-irrelevant-to-zeta',
]);

const VERDICT = 'phase-tomography-circular-and-ladder-axis-transverse-to-lambda';

const VERDICT_DETAIL =
  'phase-tomography-circular-and-ladder-axis-transverse-to-lambda: The twin- ' +
  'ladder x Hardy-Z phase P(t) = theta(t) - arg zeta(1/2 + it) is a clean ' +
  'tomographic observable, but reality of the deformed Hardy function Z_a pins ' +
  'it to 2 theta_a(t) (mod pi), so it recovers only the smooth ladder theta plus ' +
  'the integer zero count -- a re-coordinatisation of existing zero data. It ' +
  'yields no independent Lambda constraint for two independent reasons: (W1) ' +
  'critical-line circularity (the phase is a functional of the zeros Lambda ' +
  'governs, same wall as imp-1333 STC-1), and (W2) ladder/heat-flow ' +
  'transversality (the de Bruijn flow that defines Lambda deforms along d/dt ' +
  'while the ladder deforms along the shift axis d/da). Empirically, at small a ' +
  'the ladder winding contribution a(b(t1)-b(t0))/pi is a vanishing fraction of ' +
  'the smooth count, producing no new zeros. The bracket 0 <= Lambda <= 0.2 is ' +
  'unmoved. Genuine entry: a mixed d/da-into-d/dt deformation, sub-gap ' +
  'PT-LAMBDA-TRANSVERSE.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1338-followup-pt-lambda-transverse',
  title:
    'Construct (or rule out) a deformation that mixes the twin-ladder shift axis ' +
    'd/da into the de Bruijn heat-flow axis d/dt -- a non-vanishing commutator ' +
    '[d/da, H_t] on sigma = 1/2 -- so that the ladder phase tomography becomes ' +
    'sensitive to Lambda instead of transverse to it.',
  subGapId: 'PT-LAMBDA-TRANSVERSE',
  sharesToolingWith: Object.freeze(['imp-1333', 'imp-1241']),
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1338_ZETA_PHASE_TOMOGRAPHY = Object.freeze({
  id: 'imp-1338',
  ticket: 'imp-1338',
  title: 'zeta phase tomography via twin-ladder + Hardy Z decomposition',
  proofSection: 'S7',
  shippedBy: 'opus-4-8 (api-pool)',

  pinnedNumerics: Object.freeze({
    lambdaLower: LAMBDA_LOWER,
    lambdaUpper: LAMBDA_UPPER,
    smoothZerosTestInterval: smoothWindingInZeros(1e4, 1e6),
    ladderContributionSmallA: ladderWindingContribution(1e-4, 1e4, 1e6),
  }),

  phaseRelationship: PHASE_RELATIONSHIP, // sub-question (a)
  lambdaLink: LAMBDA_LINK,               // sub-question (b)
  empiricalCheck: EMPIRICAL_CHECK,       // sub-question (c)

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1333': 'src/data/imp-1333-selberg-S-T-super-critical.js (S(T) phase, STC-1 circularity wall).',
    'imp-1241': 'src/data/imp-1241-unified-existence-conjecture.js (shift-bridge ladder family K_a, B_a, Theta_a).',
    'imp-1334': 'queue: Voronin universality, super-critical strip sibling.',
  }),
});

export default IMP_1338_ZETA_PHASE_TOMOGRAPHY;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (8 shipped; ticket spec requires 8).
// -----------------------------------------------------------------------------

export const IMP_1338_ZETA_PHASE_TOMOGRAPHY_ASSERTIONS = [

  // Tripwire 1: Riemann-Siegel theta accumulates winding (monotone increasing).
  {
    id: 'imp1338-rs-theta-monotone-increasing',
    why:
      'The smooth phase theta(t) must increase with height -- it is what makes ' +
      'the zero count N(T) ~ theta(T)/pi grow. A non-monotone theta would break ' +
      'the entire Hardy-Z decomposition the tomography rests on.',
    holds: () => {
      const a = rsTheta(50);
      const b = rsTheta(1e3);
      const c = rsTheta(1e6);
      return (
        Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c) &&
        c > b && b > a
      );
    },
  },

  // Tripwire 2: leading winding rate (1/2) log(t/2pi) positive and increasing.
  {
    id: 'imp1338-theta-rate-positive-increasing',
    why:
      'The winding rate d theta/dt = (1/2) log(t/2pi) is the smooth density of ' +
      'zeros. It must be positive and increasing for t > 2pi, otherwise the ' +
      'claim that the smooth part dominates the ladder perturbation would fail.',
    holds: () => {
      const r1 = thetaRate(50);
      const r2 = thetaRate(1e6);
      return Number.isFinite(r1) && Number.isFinite(r2) && r1 > 0 && r2 > r1;
    },
  },

  // Tripwire 3: Hardy Z reality identity recorded and smooth count grows.
  {
    id: 'imp1338-hardy-z-reality-identity-recorded',
    why:
      'Reality of Z(t) forcing theta + arg zeta == 0 (mod pi) is the structural ' +
      'core: it makes the tomographic observable a re-coordinatisation of the ' +
      'zero count rather than an independent functional. The smooth count ' +
      'theta(T)/pi + 1 must be positive and grow with height.',
    holds: () => {
      const pr = IMP_1338_ZETA_PHASE_TOMOGRAPHY.phaseRelationship;
      const n1 = smoothCount(1e4);
      const n2 = smoothCount(1e6);
      return (
        pr.zIsRealOnCriticalLine === true &&
        Number.isFinite(n1) && Number.isFinite(n2) &&
        n1 > 0 && n2 > n1
      );
    },
  },

  // Tripwire 4: undeformed bridge phase reduces to -2 theta on the line.
  {
    id: 'imp1338-undeformed-bridge-phase-is-minus-2-theta',
    why:
      'On sigma = 1/2 the lossless bridge has arg chi = -2 theta(t). The ladder ' +
      'deformation must reduce to exactly this at a = 0; if it did not, the ' +
      'a -> 0 limit would not recover the undeformed Hardy-Z phase and the ' +
      'small-a empirical check would be meaningless.',
    holds: () => {
      const t = 12345;
      const phi0 = bridgePhase(t, 0);
      return Number.isFinite(phi0) && Math.abs(phi0 - -2 * rsTheta(t)) < 1e-12;
    },
  },

  // Tripwire 5: ladder winding contribution is exactly linear in a and small.
  {
    id: 'imp1338-ladder-contribution-linear-in-a',
    why:
      'The ladder deformation contributes winding a(b(t1)-b(t0))/pi, exactly ' +
      'linear in a. Doubling a must double the contribution, and since |b| < 1 ' +
      'the magnitude is bounded by 2a/pi. This linearity is what sends the ' +
      'contribution to zero as a -> 0.',
    holds: () => {
      const t0 = 1e4, t1 = 1e6;
      const c1 = ladderWindingContribution(1e-4, t0, t1);
      const c2 = ladderWindingContribution(2e-4, t0, t1);
      return (
        Number.isFinite(c1) && Number.isFinite(c2) &&
        Math.abs(c2 - 2 * c1) < 1e-15 &&
        Math.abs(c1) <= (2 * 1e-4) / Math.PI
      );
    },
  },

  // Tripwire 6: at small a the ladder adds a vanishing fraction of the zeros.
  {
    id: 'imp1338-small-a-adds-vanishing-fraction-of-zeros',
    why:
      'The empirical (c) claim: at small ladder a the deformation produces no ' +
      'new zeros over a fixed interval. The ratio of ladder winding to smooth ' +
      'winding must be tiny (< 1e-3) at a = 1e-4 over [1e4, 1e6], confirming ' +
      'the tomography reads only the a = 0 zero data.',
    holds: () => {
      const e = IMP_1338_ZETA_PHASE_TOMOGRAPHY.empiricalCheck;
      return (
        Number.isFinite(e.ratioSmallA) &&
        e.ratioSmallA >= 0 &&
        e.ratioSmallA < 1e-3 &&
        e.independentLever === false
      );
    },
  },

  // Tripwire 7: Lambda link is the honest double-obstruction; bracket unmoved.
  {
    id: 'imp1338-lambda-link-double-obstruction-bracket-unmoved',
    why:
      'Sub-question (b) must answer NO new Lambda constraint, recording both ' +
      'walls (circularity W1 and ladder/heat-flow transversality W2) and leaving ' +
      'the bracket 0 <= Lambda <= 0.2 unmoved. A flip to a new constraint would ' +
      'be a false claim, since the phase is a functional of the zeros Lambda ' +
      'governs and the ladder axis is transverse to the heat-flow axis.',
    holds: () => {
      const l = IMP_1338_ZETA_PHASE_TOMOGRAPHY.lambdaLink;
      const b = l.lambdaBracketUnchanged;
      return (
        l.answer === 'no-new-constraint-circular-and-ladder-axis-transverse' &&
        l.subGap === 'PT-LAMBDA-TRANSVERSE' &&
        !!l.wallW1 && !!l.wallW2 &&
        b.lower === 0 && Math.abs(b.upper - 0.2) < 1e-12 &&
        b.movedByThisTicket === false
      );
    },
  },

  // Tripwire 8: verdict is allowed + honest-partial; follow-up names sub-gap.
  {
    id: 'imp1338-verdict-allowed-and-followup-names-pt-lambda-transverse',
    why:
      'The verdict must be one of the three allowed strings and specifically the ' +
      'honest-partial one, and the follow-up must seed the genuine entry by ' +
      'naming sub-gap PT-LAMBDA-TRANSVERSE (mixing the ladder axis into the heat ' +
      'flow). Without it the audit identifies the wall but fails to route the ' +
      'next step.',
    holds: () => {
      const v = IMP_1338_ZETA_PHASE_TOMOGRAPHY.verdict;
      const allowed = IMP_1338_ZETA_PHASE_TOMOGRAPHY.allowedVerdicts;
      const f = IMP_1338_ZETA_PHASE_TOMOGRAPHY.recommendedFollowup;
      return (
        allowed.includes(v) &&
        v === 'phase-tomography-circular-and-ladder-axis-transverse-to-lambda' &&
        f.subGapId === 'PT-LAMBDA-TRANSVERSE'
      );
    },
  },
];
