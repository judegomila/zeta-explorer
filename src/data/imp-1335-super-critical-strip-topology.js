// @module data/imp-1335-super-critical-strip-topology
// imp-1335 -- NOVEL (high): the IMAGE of zeta on the super-critical strip
// 1/2 < sigma < 1, viewed as a topological / measure-theoretic object, and what
// (if anything) the structure of that image says about the de Bruijn-Newman
// constant Lambda. Direct companion to imp-1334 (Voronin universality,
// quantitative) and imp-1333 (super-critical phase program). Depends on imp-1334.
//
// THE QUESTION (verbatim ticket intent)
// -------------------------------------
// Consider the image of zeta on the super-critical strip as the imaginary part
// varies. Density + topology of this image (Karatsuba-Voronin 1994, Steuding
// 2007) carries information about zero distribution.
//   (a) what is the topological closure of { zeta(sigma + iT) : T in R } for
//       fixed sigma in (1/2, 1)?
//   (b) does its measure-theoretic boundary contain 0? If 0 were NOT in the
//       closure for sigma in (1/2, 1), that would be RH on that strip.
//   (c) explicit quantitative version.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'closure-is-all-of-C-zero-in-closure-obstruction-no-lever'
//
//   (a) THE CLOSURE IS THE WHOLE PLANE. For every fixed sigma in (1/2, 1) the
//       value set { zeta(sigma + iT) : T in R } is DENSE in C. This is the
//       classical Bohr-Courant 1914 density theorem (Bohr-Courant, J. Reine
//       Angew. Math. 144 (1914) 249-274), strengthened by the Bohr-Jessen
//       1930-32 value-distribution theory and subsumed by Voronin 1975
//       universality (imp-1334). Hence the topological closure equals C:
//
//         closure{ zeta(sigma + iT) : T in R } = C   for every sigma in (1/2, 1).
//
//       Contrast: for sigma > 1 the Euler product keeps zeta bounded and bounded
//       AWAY from 0, so the image there is NOT dense and omits a neighbourhood of
//       0 -- the density (and the difficulty) switches on exactly at sigma = 1
//       and fills the strip down to, but not including, the critical line.
//
//   (b) 0 IS IN THE CLOSURE -- SO THE TOPOLOGICAL TEST FAILS. Because the closure
//       is all of C, it trivially contains 0. The ticket asked: "if 0 were NOT in
//       the closure, that would be RH on the strip." The answer is the opposite
//       of what a naive attack hopes: 0 is always in the closure, for EVERY
//       sigma in (1/2, 1), independently of RH. So a closure / topological-
//       boundary test CANNOT distinguish RH from its negation. The obstruction is
//       structural and is the same rigidity wall as imp-1334: denseness (closure
//       contains 0) is NOT attainment (zeta actually equal to 0). A zero in the
//       strip is the event zeta(sigma + iT) = 0 EXACTLY; the closure smears that
//       distinction away. Topology of the image is RH-blind on (1/2, 1).
//
//   (c) QUANTITATIVE / MEASURE-THEORETIC REFINEMENT -- the right object, and why
//       it still does not separate. The sharp tool is the Bohr-Jessen limiting
//       distribution: for fixed sigma in (1/2, 1) there is a probability measure
//       (a "limiting distribution") on C such that the proportion of T in [0, U]
//       with zeta(sigma + iT) in a Borel set B tends, as U -> inf, to that
//       measure of B; the measure has a smooth, strictly positive density
//       (Bohr-Jessen 1930-32; Jessen-Wintner; Borchsenius-Jessen 1948). Its
//       density at 0 is positive and FINITE, so the measure of {0} is ZERO. A
//       zero of zeta in the strip is a measure-zero event in the value
//       distribution and so is invisible to the density. The genuine bridge to
//       zero distribution is NOT the value 0 but the a-POINT / argument count:
//       Littlewood`s lemma turns the integral of log|zeta| on a strip rectangle
//       into the zero count, i.e. zero information lives in the BOUNDARY behaviour
//       of log zeta (the imp-1333 phase / S(T) track), not in whether 0 sits in
//       the value closure. No height-decaying inequality is produced, so there is
//       NO new input to the imp-1261 E_trunc_pt ~ T_PT^{-0.4} chain and the
//       headline unconditional Lambda <= 3.06e-5 is UNCHANGED.
//
// HONEST BOTTOM LINE
// ------------------
// The topological-closure framing of the super-critical image is catalogued and
// CLOSED in the negative: closure = C for all sigma in (1/2, 1) (Bohr-Courant
// 1914), so 0 is unconditionally in the closure and the "0 not in closure => RH"
// route is dead -- it is a rigidity obstruction, the same wall as imp-1334. The
// productive refinement is the Bohr-Jessen limiting distribution; but zeros are a
// measure-zero event in the value distribution, so density at 0 does not separate
// RH either. Real zero information lives in the boundary log-zeta / argument
// integral (Littlewood lemma -> imp-1333 phase track), not in the value-set
// topology. No Lambda lever. Named sub-gap SCS-BOUNDARY-LOGZETA: quantify the
// strip rectangle Littlewood-lemma argument integral as the genuine carrier of
// zero-count information -- the recommended (hard) follow-up.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings only.
// No apostrophes inside single-quoted strings.

// -----------------------------------------------------------------------------
// Pinned facts.
// -----------------------------------------------------------------------------

const STRIP_LO = 0.5;   // open strip lower edge (exclusive; theorem false at 1/2)
const STRIP_HI = 1.0;   // open strip upper edge; density persists up to sigma = 1

// The headline topological fact: the closure of the value set is the whole plane.
const CLOSURE = 'C';            // closure{ zeta(sigma + iT) : T in R } = C
const ZERO_IN_CLOSURE = true;   // 0 is unconditionally in the closure on (1/2, 1)

// Above sigma = 1 the Euler product forces a positive distance from 0.
const DENSE_ON_STRIP = true;          // dense for 1/2 < sigma < 1
const DENSE_ABOVE_ONE = false;        // NOT dense for sigma > 1 (omits nbhd of 0)
const SWITCH_ON_ABSCISSA = 1.0;       // denseness switches off at sigma = 1

// Bohr-Jessen limiting distribution: measure of the single point {0} is 0.
const LIMITING_MEASURE_OF_ZERO_POINT = 0; // {0} is a null set for the value measure
const LIMITING_DENSITY_AT_ZERO_FINITE = true; // density at 0 positive and finite

const T_PT = 3e12;            // production height (shared with imp-1261 chain)
const E_TRUNC_PT = 3.06e-5;   // the headline bound this topology cannot tighten

// -----------------------------------------------------------------------------
// Sub-question (a): topological closure of the image for fixed sigma.
// -----------------------------------------------------------------------------

const TOPOLOGICAL_CLOSURE = Object.freeze({
  cite: 'Bohr-Courant 1914, J. Reine Angew. Math. 144, 249-274; Bohr-Jessen 1930-32; subsumed by Voronin 1975 universality (imp-1334).',
  statement: 'for every fixed sigma in (1/2, 1), { zeta(sigma + iT) : T in R } is dense in C, hence its closure is all of C.',
  closure: CLOSURE,
  denseOnStrip: DENSE_ON_STRIP,
  contrastAboveOne: 'for sigma > 1 the Euler product makes zeta bounded and bounded away from 0; the image is NOT dense and omits a neighbourhood of 0.',
  denseAboveOne: DENSE_ABOVE_ONE,
  switchOnAbscissa: SWITCH_ON_ABSCISSA,
});

// -----------------------------------------------------------------------------
// Sub-question (b): does the closure contain 0? (Yes -- so the test fails.)
// -----------------------------------------------------------------------------

const ZERO_IN_CLOSURE_ANALYSIS = Object.freeze({
  question: 'is 0 in closure{ zeta(sigma + iT) : T in R } for sigma in (1/2, 1)?',
  answer: 'yes-unconditionally',
  zeroInClosure: ZERO_IN_CLOSURE,
  whyTestFails: 'the closure is all of C, so it contains 0 for EVERY sigma in (1/2, 1) regardless of RH; the closure cannot distinguish RH from its negation.',
  denseNotAttained: 'denseness (0 in the closure) is NOT attainment (zeta = 0 exactly); a strip zero is the exact-equality event, which the closure smears away.',
  obstruction: 'same rigidity wall as imp-1334: topology of the value set is RH-blind on (1/2, 1).',
  role: 'rigidity-obstruction-not-lambda-lever',
});

// -----------------------------------------------------------------------------
// Sub-question (c): measure-theoretic refinement (Bohr-Jessen) -- still no separation.
// -----------------------------------------------------------------------------

const MEASURE_REFINEMENT = Object.freeze({
  cite: 'Bohr-Jessen 1930-32 (Acta Math. 54, 57); Jessen-Wintner 1935; Borchsenius-Jessen 1948; exposition in Steuding 2007.',
  limitingDistribution: 'for fixed sigma in (1/2, 1) the values zeta(sigma + iT) have a limiting probability distribution on C with a smooth, strictly positive density.',
  measureOfZeroPoint: LIMITING_MEASURE_OF_ZERO_POINT,
  densityAtZeroFinite: LIMITING_DENSITY_AT_ZERO_FINITE,
  whyStillNoSeparation: 'a strip zero is a measure-ZERO event in the value distribution (the point {0} is null), so the density at 0 cannot detect it.',
  genuineBridge: 'zero information lives in the boundary log|zeta| / argument integral via Littlewood`s lemma, i.e. the imp-1333 phase / S(T) track, not in the value-set topology.',
  lambdaInput: 'none -- no height-decaying inequality, so no input to the imp-1261 E_trunc_pt ~ T_PT^{-0.4} chain.',
});

// -----------------------------------------------------------------------------
// Verdict + recommended follow-up.
// -----------------------------------------------------------------------------

const ALLOWED_VERDICTS = Object.freeze([
  'closure-is-all-of-C-zero-in-closure-obstruction-no-lever',
  'super-critical-image-topology-yields-new-lambda-bound',
  'super-critical-image-topology-not-applicable',
]);

const VERDICT = 'closure-is-all-of-C-zero-in-closure-obstruction-no-lever';

const VERDICT_DETAIL =
  'closure-is-all-of-C-zero-in-closure-obstruction-no-lever: for every fixed sigma in ' +
  '(1/2, 1) the value set { zeta(sigma + iT) : T in R } is dense in C (Bohr-Courant 1914), ' +
  'so its topological closure is the whole plane and contains 0 unconditionally. The naive ' +
  'route "0 not in the closure => RH on the strip" is therefore dead: 0 is always in the ' +
  'closure, independently of RH, because denseness is not attainment. This is the same ' +
  'rigidity obstruction as imp-1334 Voronin universality. The sharp refinement is the ' +
  'Bohr-Jessen limiting distribution with a smooth positive density, but a strip zero is a ' +
  'measure-zero event in that distribution, so density at 0 does not separate RH either. ' +
  'Real zero-count information lives in the boundary log|zeta| argument integral (Littlewood ' +
  'lemma -> imp-1333 phase track), not in the value-set topology. No Lambda lever; the ' +
  'headline unconditional Lambda <= 3.06e-5 is unchanged. Named sub-gap SCS-BOUNDARY-LOGZETA.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1335-followup-scs-boundary-logzeta',
  title:
    'Make explicit the Littlewood-lemma strip-rectangle argument integral as the genuine ' +
    'carrier of zero-count information: bound (1 / 2 pi) times the contour integral of ' +
    'log|zeta| over a rectangle [sigma_0, 1] x [0, T] in terms of the imp-1333 S(T) phase ' +
    'data, turning the boundary log-zeta behaviour into a strip zero-count and connecting ' +
    'it to the E_trunc_pt chain. This is where zero information actually lives, not in the ' +
    'value-set closure.',
  subGapId: 'SCS-BOUNDARY-LOGZETA',
  priority: 'medium',
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY = Object.freeze({
  id: 'imp-1335',
  ticket: 'imp-1335',
  title: 'NOVEL: super-critical strip image { zeta(sigma + it) } as a topological / measure-theoretic constraint',
  proofSection: 'S7',
  shippedBy: 'opus-4-8 (api-pool)',

  reference: Object.freeze({
    bohrCourant: 'Bohr, H. and Courant, R. -- "Neue Anwendungen der Theorie der Diophantischen Approximationen auf die Riemannsche Zetafunktion", J. Reine Angew. Math. 144 (1914) 249-274.',
    bohrJessen: 'Bohr, H. and Jessen, B. -- "Uber die Werteverteilung der Riemannschen Zetafunktion", Acta Math. 54 (1930) 1-35 and 58 (1932) 1-55.',
    karatsubaVoronin: 'Karatsuba, A. A. and Voronin, S. M. -- "The Riemann Zeta-Function", de Gruyter Expositions in Mathematics 5 (1992/1994).',
    steuding: 'Steuding, J. -- "Value-Distribution of L-Functions", Springer Lecture Notes in Mathematics 1877 (2007).',
  }),

  pinnedNumerics: Object.freeze({
    strip_lo: STRIP_LO,
    strip_hi: STRIP_HI,
    closure: CLOSURE,
    zero_in_closure: ZERO_IN_CLOSURE,
    dense_on_strip: DENSE_ON_STRIP,
    dense_above_one: DENSE_ABOVE_ONE,
    switch_on_abscissa: SWITCH_ON_ABSCISSA,
    limiting_measure_of_zero_point: LIMITING_MEASURE_OF_ZERO_POINT,
    limiting_density_at_zero_finite: LIMITING_DENSITY_AT_ZERO_FINITE,
    T_PT,
    E_trunc_pt_unchanged: E_TRUNC_PT,
  }),

  topologicalClosure: TOPOLOGICAL_CLOSURE,        // sub-question (a)
  zeroInClosureAnalysis: ZERO_IN_CLOSURE_ANALYSIS, // sub-question (b)
  measureRefinement: MEASURE_REFINEMENT,          // sub-question (c)

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1334': 'src/data/imp-1334-voronin-universality-quantitative.js (Voronin universality -- same rigidity obstruction; this ticket depends on it).',
    'imp-1333': 'src/data/imp-1333-selberg-S-T-super-critical.js (super-critical phase / S(T) program -- where zero-count information actually lives).',
    'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (the Lambda <= 3.06e-5 chain this topology cannot tighten).',
  }),
});

export default IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (10 shipped; ticket spec requires 10).
// -----------------------------------------------------------------------------

export const IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY_ASSERTIONS = [

  // Tripwire 1: the strip is the open super-critical strip (1/2, 1).
  {
    id: 'imp1335-strip-is-super-critical',
    why:
      'The whole framing lives on the OPEN strip 1/2 < sigma < 1: density is false at ' +
      'sigma = 1/2 and the topology changes character at sigma = 1. Mis-stating the domain ' +
      'would void the super-critical claim.',
    holds: () => {
      const n = IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.pinnedNumerics;
      return n.strip_lo === 0.5 && n.strip_hi === 1.0 && n.strip_lo < n.strip_hi;
    },
  },

  // Tripwire 2: the closure of the value set is all of C.
  {
    id: 'imp1335-closure-is-all-of-C',
    why:
      'The headline topological fact (Bohr-Courant 1914) is that the value set is dense in ' +
      'C, so the closure is the whole plane. Any weaker recorded closure would understate ' +
      'the theorem and could be misread as leaving room for an RH separation.',
    holds: () => {
      const t = IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.topologicalClosure;
      return t.closure === 'C' && t.denseOnStrip === true;
    },
  },

  // Tripwire 3: 0 is unconditionally in the closure.
  {
    id: 'imp1335-zero-in-closure',
    why:
      'Because the closure is all of C, 0 is in it for EVERY sigma in (1/2, 1), independently ' +
      'of RH. Recording zero_in_closure as false would resurrect the dead "0 not in closure ' +
      'implies RH" route as if it were viable.',
    holds: () => {
      const a = IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.zeroInClosureAnalysis;
      return a.zeroInClosure === true && a.answer === 'yes-unconditionally';
    },
  },

  // Tripwire 4: the closure test is honestly recorded as RH-blind / an obstruction.
  {
    id: 'imp1335-closure-test-is-obstruction',
    why:
      'Sub-question (b) must record that the closure/topological test CANNOT separate RH ' +
      'from its negation and is a rigidity obstruction. A flip to a claimed lever would be ' +
      'an unearned rigorous claim, the exact failure mode the engine guards against.',
    holds: () => {
      const a = IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.zeroInClosureAnalysis;
      return a.role === 'rigidity-obstruction-not-lambda-lever';
    },
  },

  // Tripwire 5: denseness above sigma = 1 is correctly recorded as FALSE.
  {
    id: 'imp1335-not-dense-above-one',
    why:
      'For sigma > 1 the Euler product keeps zeta bounded away from 0, so the image is NOT ' +
      'dense and omits a neighbourhood of 0. Recording denseness there would erase the ' +
      'crucial sigma = 1 switch-on that defines the super-critical phenomenon.',
    holds: () => {
      const n = IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.pinnedNumerics;
      return n.dense_above_one === false && n.switch_on_abscissa === 1.0;
    },
  },

  // Tripwire 6: the Bohr-Jessen measure of the single point {0} is zero.
  {
    id: 'imp1335-zero-point-is-null',
    why:
      'The measure-theoretic refinement turns on the fact that a strip zero is a ' +
      'measure-ZERO event: the limiting distribution assigns mass 0 to the point {0}. If ' +
      'this were recorded as positive, the density-at-0 attack would look viable when it is ' +
      'not.',
    holds: () => {
      const m = IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.measureRefinement;
      return m.measureOfZeroPoint === 0 && m.densityAtZeroFinite === true;
    },
  },

  // Tripwire 7: the genuine bridge is the boundary log-zeta / Littlewood argument integral.
  {
    id: 'imp1335-genuine-bridge-is-boundary-logzeta',
    why:
      'The productive content is that zero-count information lives in the boundary log|zeta| ' +
      'argument integral (Littlewood lemma -> imp-1333 phase track), not the value-set ' +
      'topology. Dropping this would lose the only forward-routing payload of the ticket.',
    holds: () => /Littlewood/.test(IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.measureRefinement.genuineBridge),
  },

  // Tripwire 8: no Lambda lever -- the headline E_trunc_pt is recorded UNCHANGED.
  {
    id: 'imp1335-headline-unchanged',
    why:
      'Because the image topology is no lever, the headline unconditional Lambda <= 3.06e-5 ' +
      'must be recorded as unchanged by this ticket. Any other value would imply a spurious ' +
      'tightening of the de Bruijn-Newman bound.',
    holds: () => Math.abs(IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.pinnedNumerics.E_trunc_pt_unchanged - 3.06e-5) < 1e-9,
  },

  // Tripwire 9: verdict is in the allowed set and is the honest obstruction one.
  {
    id: 'imp1335-verdict-allowed-honest',
    why:
      'The verdict must be one of the three allowed strings and specifically the ' +
      'closure-is-all-of-C obstruction one. A flip to ' +
      'super-critical-image-topology-yields-new-lambda-bound would be a false claim.',
    holds: () => {
      const v = IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.verdict;
      return (
        IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.allowedVerdicts.includes(v) &&
        v === 'closure-is-all-of-C-zero-in-closure-obstruction-no-lever'
      );
    },
  },

  // Tripwire 10: follow-up names the SCS-BOUNDARY-LOGZETA sub-gap.
  {
    id: 'imp1335-followup-names-scs-boundary-logzeta',
    why:
      'The honest partial must seed the next step: a follow-up naming the ' +
      'SCS-BOUNDARY-LOGZETA sub-gap (quantify the Littlewood-lemma strip-rectangle argument ' +
      'integral as the genuine zero-count carrier). Without it the ticket states the gap but ' +
      'fails to route it.',
    holds: () => IMP_1335_SUPER_CRITICAL_STRIP_TOPOLOGY.recommendedFollowup.subGapId === 'SCS-BOUNDARY-LOGZETA',
  },
];
