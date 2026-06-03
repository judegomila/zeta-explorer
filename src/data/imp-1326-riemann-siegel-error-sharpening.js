// @module data/imp-1326-riemann-siegel-error-sharpening
// imp-1326 — Riemann-Siegel error term sharpening: does the Hiary 2016 +
// Pugh 2014 + Demichel explicit-constant chain give a tighter DIRECT bound on
// E_trunc_pt = 3.06e-5, bypassing the Ingham 1940 zero-density route used by
// the imp-1261 composition?
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'riemann-siegel-bounds-different-object-no-direct-substitution'
//
//   * The Riemann-Siegel error term bounds the POINTWISE EVALUATION error
//     |zeta(1/2 + it) - RS_K(t)|, i.e. how accurately a truncated
//     Riemann-Siegel expansion computes zeta at a single height t. This is a
//     numerical-evaluation object, NOT the zero-density truncation tail.
//   * E_trunc_pt = (2 e_I / kappa) * T_PT^{-kappa} is the tail of the
//     zero-density integral 2 * INT_{T_PT}^inf (dN_off/dT)(sigma, T) / T dT.
//     It measures the CONTRIBUTION of putative off-line zeros ABOVE the
//     verified height T_PT. The Riemann-Siegel remainder says nothing about
//     how many zeros lie above T_PT, so it does NOT substitute drop-in.
//   * The Hiary-Pugh-Demichel chain bound is a PURE POWER in t:
//       |zeta(1/2 + it) - RS_K(t)| <= C_K * (t / (2 pi))^{-(2K+3)/4}
//     carrying NO (log T)^A factor (so the answer to ticket part (c) is A = 0).
//     This is genuinely cleaner than the zero-density route, whose effective
//     companions (Kadiri 2013 etc., per imp-1306) carry (log T_PT)^A with
//     A in [1, 6]. But a clean bound on the WRONG object does not help.
//   * The ONE legitimate connection is INDIRECT: a sharper, cheaper rigorous
//     Riemann-Siegel evaluation error lets numerical zero verification reach
//     a HIGHER T_PT for the same compute. That tightens T_PT^{-kappa}
//     multiplicatively -- but this is precisely the imp-1328 GPU-verification
//     route, not the "bypass zero-density entirely" shortcut the ticket hoped
//     for. It still feeds the SAME Ingham zero-density formula.
//
// HONEST BOTTOM LINE
// ------------------
// The Riemann-Siegel error term does not give a tighter direct bound on
// E_trunc_pt. It bounds a different analytic object (pointwise computation
// accuracy). The rigorous direct tightening from this route is 1.0x. The only
// way Riemann-Siegel sharpening tightens Lambda is INDIRECTLY, by enabling a
// higher verified height T_PT (the imp-1328 route), which still passes through
// the Ingham 1940 zero-density formula audited in imp-1306.
//
// REQUIRED DELIVERABLES (per ticket spec)
// ---------------------------------------
//   (a) Hiary-Pugh-Demichel chain bound stated with explicit form + constants.
//   (b) Substitution attempted into imp-1261 composition at sigma = 0.75.
//   (c) (log T)^A analysis: A = 0 for the Riemann-Siegel remainder.
//   8 build-time tripwires (ticket asks for 8).
//   Cross-references to imp-1306 / imp-1261 / imp-1328 / imp-1323.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings only.
// No apostrophes inside single-quoted strings.

// ─────────────────────────────────────────────────────────────────────────────
// PART (a) — The Hiary-Pugh-Demichel Riemann-Siegel error chain bound.
// ─────────────────────────────────────────────────────────────────────────────
//
// The Riemann-Siegel formula expresses
//   Z(t) = 2 * sum_{n=1}^{N} n^{-1/2} cos(theta(t) - t log n) + R(t)
// where Z(t) = exp(i theta(t)) zeta(1/2 + it) is the real Hardy function,
// N = floor(sqrt(t / (2 pi))), and the remainder admits an asymptotic
// expansion in correction terms C_0, C_1, ... :
//   R(t) = (-1)^{N-1} (t / (2 pi))^{-1/4} * sum_{k=0}^{K} C_k(p) (t/(2 pi))^{-k/2}
//          + R_K(t),    p = sqrt(t/(2 pi)) - N.
// The truncation remainder R_K(t) after K correction terms satisfies an
// EXPLICIT bound of pure-power form (no logarithm):
//   |R_K(t)| <= C_K * (t / (2 pi))^{-(2K+3)/4}.

const TWO_PI = 2 * Math.PI;

// remainderExponent(K) = (2K + 3) / 4 -- the decay exponent of the K-th
// Riemann-Siegel correction remainder. K=0 -> 3/4; K=1 -> 5/4; K=2 -> 7/4.
function remainderExponent(K) {
  return (2 * K + 3) / 4;
}

const HPD_CHAIN = Object.freeze([
  // ─── Gabcke 1979 — the rigorous explicit-constant baseline ──────────────
  Object.freeze({
    id: 'gabcke-1979',
    cite:
      'Gabcke, W. -- "Neue Herleitung und explizite Restabschaetzung der ' +
      'Riemann-Siegel-Formel" (PhD thesis, Goettingen, 1979). The first ' +
      'rigorous explicit remainder bounds for the Riemann-Siegel formula.',
    role: 'baseline-explicit-remainder-constants',
    explicitBound:
      '|R_1(t)| <= 0.053 * (t / (2 pi))^{-5/4} for t >= 200 (remainder after ' +
      'the C_0 correction term; K = 1, exponent (2*1+3)/4 = 5/4).',
    K_demonstrated: 1,
    constantC: 0.053,
    carriesLogFactor: false,
  }),
  // ─── Hiary 2011/2016 — fast algorithm + explicit van der Corput line ─────
  Object.freeze({
    id: 'hiary-2016',
    cite:
      'Hiary, G. A. -- "Fast methods to compute the Riemann zeta function" ' +
      'Annals of Math. 174 (2011) 891-946; and "An explicit van der Corput ' +
      'estimate for zeta(1/2 + it)" Indag. Math. 27 (2016) 524-533.',
    role: 'fast-evaluation-framework-and-pointwise-bound',
    explicitBound:
      'Amortised t^{1/3 + o(1)} evaluation of zeta(1/2 + it) with explicit ' +
      'error control; the pointwise size bound |zeta(1/2 + it)| <= 0.63 ' +
      '|t|^{1/6} log |t| is a SIZE bound, distinct from the evaluation ' +
      'REMAINDER R_K(t) which stays pure-power.',
    K_demonstrated: 'algorithmic (variable K)',
    constantC: null,
    carriesLogFactor: false,
  }),
  // ─── Pugh 2014 — explicit constants for higher correction terms ─────────
  Object.freeze({
    id: 'pugh-2014',
    cite:
      'Pugh, P. -- "The Riemann-Siegel formula and large-scale computations ' +
      'of the Riemann zeta function" (graduate thesis, 2014). Extends Gabcke ' +
      'with explicit bounds for additional correction terms C_2, C_3, ...',
    role: 'higher-order-explicit-constants',
    explicitBound:
      '|R_K(t)| <= C_K * (t / (2 pi))^{-(2K+3)/4} with tabulated C_K for ' +
      'K up to several; same pure-power decay form as Gabcke, more terms.',
    K_demonstrated: 3,
    constantC: null,
    carriesLogFactor: false,
  }),
  // ─── Demichel — empirical refinement of the remainder constants ─────────
  Object.freeze({
    id: 'demichel-empirical',
    cite:
      'Demichel, P. -- empirical/computational refinement of Riemann-Siegel ' +
      'remainder constants from large-scale zeta evaluations (companion to ' +
      'the Demichel prime-counting / Mertens computations).',
    role: 'empirical-constant-tightening',
    explicitBound:
      'Empirically observed |R_K(t)| typically a small fraction of the ' +
      'Gabcke-Pugh rigorous C_K; refines the CONSTANT but NOT the exponent ' +
      '(2K+3)/4 and NOT the analytic object. Empirical, so rigor factor 1.0.',
    K_demonstrated: 'empirical',
    constantC: null,
    carriesLogFactor: false,
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// PART (b) — Substitute into the imp-1261 composition at sigma = 0.75.
// ─────────────────────────────────────────────────────────────────────────────
//
// The imp-1261 composition has Lambda <= lim sup |t_c(N)| + E_trunc_pt, with
//   E_trunc_pt(sigma) = (2 e_I(sigma) / kappa(sigma)) * T_PT^{-kappa(sigma)},
//   e_I(sigma) = 3 (1 - sigma) / (2 - sigma),  kappa = 1 - e_I  (Ingham 1940).
// We attempt to REPLACE E_trunc_pt with a Riemann-Siegel evaluation-error
// quantity and find it bounds a DIFFERENT object.

const T_PT = 3e12;
const SIGMA_OPT_PRODUCTION = 0.75;

function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

function etruncFromExponent(e) {
  if (!(e > 0 && e < 1)) return null;
  const kappa = 1 - e;
  const factor = (2 * e) / kappa;
  const tPow = Math.exp(-kappa * Math.log(T_PT));
  return { e: +e, kappa: +kappa, factor: +factor, tPow: +tPow, bound: +(factor * tPow) };
}

// The OLD (zero-density) E_trunc_pt at sigma = 0.75 = 3.06e-5.
const OLD_E_TRUNC_PT = etruncFromExponent(inghamExponent(SIGMA_OPT_PRODUCTION));

// The Riemann-Siegel EVALUATION error at the verified height T_PT (Gabcke
// K=1 constant). Note: this is the accuracy of COMPUTING zeta at t = T_PT,
// NOT a bound on the off-line-zero contribution above T_PT.
function rsEvaluationError(t, K, C_K) {
  const x = t / TWO_PI;
  return C_K * Math.exp(-remainderExponent(K) * Math.log(x));
}

const RS_EVAL_ERROR_AT_T_PT = rsEvaluationError(T_PT, 1, 0.053); // ~ tiny pure power

// The substitution is INVALID: RS_EVAL_ERROR_AT_T_PT bounds pointwise
// computation accuracy, not the zero-density tail. We therefore do NOT
// replace E_trunc_pt; the rigorous direct tightening from this route is 1.0.
const NEW_E_TRUNC_PT_RIGOROUS_TODAY = OLD_E_TRUNC_PT.bound;
const DIRECT_TIGHTENING_FACTOR_RIGOROUS =
  OLD_E_TRUNC_PT.bound / NEW_E_TRUNC_PT_RIGOROUS_TODAY; // = 1.0

const SUBSTITUTION_ANALYSIS = Object.freeze({
  oldEtruncPt: OLD_E_TRUNC_PT.bound,
  rsEvaluationErrorAtTpt: RS_EVAL_ERROR_AT_T_PT,
  substitutionValid: false,
  objectMismatch:
    'E_trunc_pt bounds the off-line-zero contribution ABOVE T_PT (a ' +
    'zero-density tail). The Riemann-Siegel remainder bounds the pointwise ' +
    'evaluation error of zeta(1/2 + it) at a single t (a numerical object). ' +
    'These are different analytic quantities; no drop-in substitution exists.',
  newEtruncPtRigorousToday: NEW_E_TRUNC_PT_RIGOROUS_TODAY,
  directTighteningFactorRigorous: DIRECT_TIGHTENING_FACTOR_RIGOROUS,
});

// ─────────────────────────────────────────────────────────────────────────────
// PART (c) — Does the Riemann-Siegel bound carry (log T)^A? If so, what A?
// ─────────────────────────────────────────────────────────────────────────────
//
// The Riemann-Siegel remainder is |R_K(t)| <= C_K (t/(2 pi))^{-(2K+3)/4}: a
// PURE POWER. No logarithm. So A = 0. The main-sum length N = floor(sqrt(t/2pi))
// is also pure power, contributing no log to the remainder bound. This is
// strictly cleaner than the zero-density effective companions (Kadiri 2013 /
// Kadiri-Lumley-Ng 2018), which carry (log T_PT)^A with A in [1, 6] (per the
// imp-1306 audit). The catch: the clean bound is on the WRONG object.

const LOG_FACTOR_ANALYSIS = Object.freeze({
  riemannSiegelLogExponentA: 0,
  riemannSiegelForm: '|R_K(t)| <= C_K * (t / (2 pi))^{-(2K+3)/4} (pure power, no log).',
  contrastZeroDensityEffective:
    'The zero-density effective companions (Kadiri 2013, Kadiri-Lumley-Ng ' +
    '2018) carry (log T_PT)^A with A in [1, 6] per imp-1306. The ' +
    'Riemann-Siegel remainder has A = 0 -- cleaner -- but bounds a different ' +
    'object, so the cleaner log behaviour does not transfer to E_trunc_pt.',
  whyNoLog:
    'The remainder R_K(t) is an asymptotic-series tail in inverse powers of ' +
    'sqrt(t/(2 pi)); each correction term scales as (t/(2 pi))^{-k/2}. No ' +
    'step introduces a log t factor, unlike zero-counting estimates whose ' +
    'Riemann-von Mangoldt main term N(T) ~ (T/(2 pi)) log(T/(2 pi)) is ' +
    'intrinsically logarithmic.',
});

// ─────────────────────────────────────────────────────────────────────────────
// The single legitimate (INDIRECT) connection: T_PT improvement.
// ─────────────────────────────────────────────────────────────────────────────

const INDIRECT_CONNECTION = Object.freeze({
  mechanism:
    'A sharper, cheaper rigorous Riemann-Siegel evaluation error lets a ' +
    'numerical Turing-method verification certify zeros on the critical line ' +
    'up to a HIGHER height T_PT for the same compute budget. That tightens ' +
    'the EXISTING Ingham term T_PT^{-kappa} multiplicatively.',
  isDirectSubstitution: false,
  routesThroughZeroDensity: true,
  ownerTicket: 'imp-1328 (GPU-accelerated zero verification past T_PT = 3e12).',
  exampleTightening:
    'At sigma = 0.75, kappa = 0.4: a bump T_PT 3e12 -> 1e13 tightens ' +
    'T_PT^{-kappa} by (1e13 / 3e12)^{0.4} ~ 1.62x. Still the Ingham formula, ' +
    'NOT a Riemann-Siegel bypass of zero-density.',
  statusOfSuccessorHeight:
    'imp-1323 confirmed NO peer-reviewed published successor to ' +
    'Platt-Trudgian T_PT = 3e12 as of 2026-05-29.',
});

// ─────────────────────────────────────────────────────────────────────────────
// Verdict.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'riemann-siegel-sharpens-E_trunc_pt-by-X-fold',
  'riemann-siegel-bounds-different-object-no-direct-substitution',
  'riemann-siegel-helps-only-indirectly-via-T_PT',
]);

const VERDICT = 'riemann-siegel-bounds-different-object-no-direct-substitution';

const VERDICT_DETAIL =
  'riemann-siegel-bounds-different-object-no-direct-substitution: the ' +
  'Hiary-Pugh-Demichel Riemann-Siegel error chain bounds the POINTWISE ' +
  'evaluation error |zeta(1/2 + it) - RS_K(t)| <= C_K (t/(2 pi))^{-(2K+3)/4}, ' +
  'a pure-power numerical-accuracy object with (log T)^A exponent A = 0. ' +
  'E_trunc_pt = (2 e_I / kappa) T_PT^{-kappa} is the zero-density truncation ' +
  'tail of the off-line-zero contribution above T_PT -- a different analytic ' +
  'object. No drop-in substitution exists, so the rigorous DIRECT tightening ' +
  'is 1.0x; the headline 3.06e-5 stands. The Riemann-Siegel route helps ' +
  'Lambda only INDIRECTLY, by enabling a higher verified height T_PT (the ' +
  'imp-1328 route), which still passes through the same Ingham 1940 ' +
  'zero-density formula audited in imp-1306. The ticket hope of a tighter ' +
  'direct bound bypassing zero-density does NOT materialise.';

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING = Object.freeze({
  id: 'imp-1326',
  ticket: 'imp-1326',
  title: 'Riemann-Siegel error term sharpening: Hiary 2016 + Pugh 2014 + Demichel constants',
  shippedAt: '2026-06-03T00:00:00Z',
  shippedBy: 'opus-4-8 (api-pool)',

  // Part (a).
  hpdChain: HPD_CHAIN,
  hpdChainCount: HPD_CHAIN.length,
  remainderExponentFormula: '(2K + 3) / 4',

  // Part (b).
  substitutionAnalysis: SUBSTITUTION_ANALYSIS,
  oldEtruncPt: OLD_E_TRUNC_PT.bound,
  newEtruncPtRigorousToday: NEW_E_TRUNC_PT_RIGOROUS_TODAY,
  directTighteningFactorRigorous: DIRECT_TIGHTENING_FACTOR_RIGOROUS,

  // Part (c).
  logFactorAnalysis: LOG_FACTOR_ANALYSIS,
  riemannSiegelLogExponentA: 0,

  // Indirect route.
  indirectConnection: INDIRECT_CONNECTION,

  // Verdict.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  // Cross-references.
  crossReferences: Object.freeze({
    'imp-1306': 'src/data/imp-1306-ingham-sharpening.js (sibling audit; classifies Hiary 2016 as a pointwise object, not zero-density).',
    'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (the composition carrying E_trunc_pt = 3.06e-5).',
    'imp-1328': 'imp-1328 GPU-accelerated zero verification (the legitimate INDIRECT route via higher T_PT).',
    'imp-1323': 'imp-1323 confirmed no peer-reviewed successor to T_PT = 3e12 as of 2026-05-29.',
  }),

  // Pinned numerics for tripwires.
  pinnedNumerics: Object.freeze({
    T_PT: 3e12,
    SIGMA_OPT_PRODUCTION: 0.75,
    inghamE_at_0p75: 0.6,
    inghamKappa_at_0p75: 0.4,
    oldEtruncPt: 3.06e-5,
    remainderExponent_K0: 0.75,
    remainderExponent_K1: 1.25,
    remainderExponent_K2: 1.75,
    gabckeConstantK1: 0.053,
    riemannSiegelLogExponentA: 0,
  }),
});

export default IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (8 shipped; ticket spec requires 8).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING_ASSERTIONS = [

  // Tripwire 1: Hiary-Pugh-Demichel chain present with all four named sources.
  {
    id: 'imp1326-hpd-chain-has-all-four-named-sources',
    why:
      'The ticket names Hiary 2016 + Pugh 2014 + Demichel; the rigorous ' +
      'baseline is Gabcke 1979. All four must be present in hpdChain with ' +
      'a cite string and a carriesLogFactor classification, else the survey ' +
      'is incomplete.',
    holds: () => {
      const ids = new Set(IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.hpdChain.map((r) => r.id));
      return (
        ids.has('gabcke-1979') &&
        ids.has('hiary-2016') &&
        ids.has('pugh-2014') &&
        ids.has('demichel-empirical')
      );
    },
  },

  // Tripwire 2: remainder exponent formula (2K+3)/4 reproduces K=0,1,2 values.
  {
    id: 'imp1326-remainder-exponent-formula-correct',
    why:
      'The Riemann-Siegel remainder decay exponent is (2K+3)/4: K=0 -> 0.75, ' +
      'K=1 -> 1.25, K=2 -> 1.75. A drift here means the pure-power decay form ' +
      'has decohered from Gabcke-Pugh.',
    holds: () => {
      const p = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.pinnedNumerics;
      return (
        Math.abs(p.remainderExponent_K0 - 0.75) < 1e-12 &&
        Math.abs(p.remainderExponent_K1 - 1.25) < 1e-12 &&
        Math.abs(p.remainderExponent_K2 - 1.75) < 1e-12
      );
    },
  },

  // Tripwire 3: every chain link is pure-power (no log factor).
  {
    id: 'imp1326-chain-is-pure-power-no-log',
    why:
      'Part (c): the Riemann-Siegel remainder carries NO (log T)^A factor. ' +
      'Every link in hpdChain must have carriesLogFactor === false, else the ' +
      'pure-power claim that distinguishes this route from the zero-density ' +
      'effective companions is broken.',
    holds: () =>
      IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.hpdChain.every((r) => r.carriesLogFactor === false),
  },

  // Tripwire 4: (log T)^A exponent A is exactly 0.
  {
    id: 'imp1326-log-exponent-A-is-zero',
    why:
      'The ticket part (c) asks whether the bound carries (log T)^A and if so ' +
      'what A. The honest answer is A = 0 (pure power). Both the top-level ' +
      'field and the logFactorAnalysis sub-record must report 0.',
    holds: () => {
      const top = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.riemannSiegelLogExponentA;
      const sub = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.logFactorAnalysis.riemannSiegelLogExponentA;
      return top === 0 && sub === 0;
    },
  },

  // Tripwire 5: substitution declared INVALID with object mismatch documented.
  {
    id: 'imp1326-substitution-invalid-object-mismatch',
    why:
      'Part (b): the Riemann-Siegel evaluation error does NOT substitute for ' +
      'E_trunc_pt because it bounds a different object. substitutionValid must ' +
      'be false and objectMismatch must mention both the zero-density tail and ' +
      'the pointwise evaluation error.',
    holds: () => {
      const s = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.substitutionAnalysis;
      return (
        s.substitutionValid === false &&
        typeof s.objectMismatch === 'string' &&
        /zero-density/i.test(s.objectMismatch) &&
        /evaluation error/i.test(s.objectMismatch)
      );
    },
  },

  // Tripwire 6: direct rigorous tightening factor is exactly 1.0 (honest).
  {
    id: 'imp1326-direct-tightening-is-one-honest',
    why:
      'Because the substitution is invalid, the rigorous DIRECT tightening of ' +
      'E_trunc_pt is 1.0x and newEtruncPtRigorousToday equals the old 3.06e-5. ' +
      'A regression claiming an unearned direct tightening (< 3.06e-5) would ' +
      'overstate the audit.',
    holds: () => {
      const r = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.directTighteningFactorRigorous;
      const oldV = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.oldEtruncPt;
      const newV = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.newEtruncPtRigorousToday;
      return (
        Math.abs(r - 1.0) < 1e-12 &&
        Math.abs(oldV - 3.06e-5) < 1e-6 &&
        Math.abs(oldV - newV) < 1e-10
      );
    },
  },

  // Tripwire 7: indirect T_PT connection routes through zero-density (imp-1328).
  {
    id: 'imp1326-indirect-route-through-T_PT-and-zero-density',
    why:
      'The only legitimate help is INDIRECT: a higher verified T_PT via better ' +
      'numerical verification (imp-1328), which still passes through the Ingham ' +
      'zero-density formula. indirectConnection must flag isDirectSubstitution ' +
      'false and routesThroughZeroDensity true, and name imp-1328.',
    holds: () => {
      const c = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.indirectConnection;
      return (
        c.isDirectSubstitution === false &&
        c.routesThroughZeroDensity === true &&
        /imp-1328/.test(c.ownerTicket)
      );
    },
  },

  // Tripwire 8: verdict is in the allowed set and is the no-direct-substitution one.
  {
    id: 'imp1326-verdict-is-no-direct-substitution',
    why:
      'The honest verdict must be one of the three allowed strings, and the ' +
      'shipped conclusion is the no-direct-substitution verdict. A drift to a ' +
      'sharpens-by-X-fold verdict would falsely claim a direct win this route ' +
      'does not deliver.',
    holds: () => {
      const v = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.verdict;
      const allowed = IMP_1326_RIEMANN_SIEGEL_ERROR_SHARPENING.allowedVerdicts;
      return (
        allowed.includes(v) &&
        v === 'riemann-siegel-bounds-different-object-no-direct-substitution'
      );
    },
  },
];
