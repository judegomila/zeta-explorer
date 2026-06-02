// @module data/imp-1325-maynard-sieve-zero-density
// imp-1325 -- OPUS (api): A=0 sieve breakthrough attempt -- can the Maynard
// 2013/2024 sieve be applied DIRECTLY to the (log T)^A factor in the zero-
// density bound N(sigma, T), the factor that blocked imp-1321 + imp-1322?
//
// CONTEXT
// -------
// imp-1321 (Bui-Soundararajan rigor port) and imp-1322 (sigma-reopt within
// Ingham 1940) BOTH stalled on the same obstruction: the modern effective-
// Ingham family (Kadiri 2013 / KLN 2018 / Simonic 2020) makes the implicit
// constant in N(sigma, T) << T^{e(sigma)} explicit, but only at the cost of
// an explicit (log T)^A multiplicative factor with A in [1, 6]. At
// T_PT = 3e12 the worst-case (log T_PT)^6 ~= 5.7e8 cancels the formal Lambda
// tightening pound-for-pound. imp-1318 (Maynard 2024 sieve vs PCC) returned
// the verdict: the sieve does NOT transfer to the zero SPECTRAL structure
// (pair-correlation), BUT noted it MIGHT transfer to the zero-DENSITY
// arithmetic bound where sieve methods originated. imp-1325 walks exactly
// that residual possibility.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'maynard-sieve-does-not-transfer-to-density-log-factor'
//
//   * There are TWO distinct objects both informally called "Maynard 2024":
//       (1) the Maynard multidimensional GPY sieve (Maynard 2013-2015,
//           "Small gaps between primes" / Tao-Maynard polymath), and
//       (2) the Guth-Maynard 2024 large-value estimate for Dirichlet
//           polynomials ("New large value estimates for Dirichlet
//           polynomials"), which yields an improved zero-density EXPONENT.
//   * Object (1) -- the actual SIEVE -- produces prime-tuple / bounded-gap
//     results. It has NO mechanism that outputs a bound on N(sigma, T).
//     The standard route to zero-density estimates is the large-values /
//     Halasz-Montgomery / moment machinery, NOT the GPY-Maynard sieve.
//     Therefore the sieve gives NO explicit constant and NO control of the
//     (log T)^A exponent A. Answer to ticket (a): NO.
//   * Object (2) -- Guth-Maynard 2024 -- DOES improve the density exponent
//     to e_GM(sigma) = (30/13)(1 - sigma) for sigma in [3/4, 1], beating the
//     Ingham e_I(sigma) = 3(1 - sigma)/(2 - sigma) near sigma = 3/4. But it
//     is a large-values argument (Dirichlet-polynomial Fourier method), NOT
//     a sieve, AND it is stated with an unquantified T^{o(1)} correction --
//     which is STRICTLY WEAKER than a bounded (log T)^A for explicit-constant
//     work, because o(1) in the exponent can hide any fixed power of log T
//     and worse. So even object (2) does NOT deliver A < 2 explicitly.
//   * Net rigorous tightening attributable to the SIEVE route at
//     sigma = 0.75, T_PT = 3e12: factor 1.0 (NONE). The (log T)^A factor is
//     untouched by any sieve mechanism.
//
// HONEST BOTTOM LINE
// ------------------
// imp-1325 CLOSES THE SIEVE QUESTION NEGATIVELY and stays OPEN as a research
// ticket only in the sense that the parent goal (kill the (log T)^A factor)
// is NOT achievable via sieves. The sub-gap is named precisely: the
// (log T)^A factor in N(sigma, T) is a LARGE-VALUES / EXPLICIT-INGHAM
// problem, not a sieve problem. The single live density-side lever is the
// Guth-Maynard 2024 EXPONENT improvement (factor ~1.94x at sigma = 0.75),
// which is routed to imp-1332 -- and even that leaves A unquantified. No
// claim of A < 2 can be made today on the strength of any Maynard result.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc block comments). Single-quoted strings only.
// No apostrophes inside single-quoted strings. No star-slash in any comment.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0 -- Pinned production numerics (shared with imp-1321 / imp-1322).
// ─────────────────────────────────────────────────────────────────────────────

const T_PT = 3e12;
const LOG_T_PT = Math.log(T_PT);              // ~= 28.7297
const SIGMA = 0.75;

// Ingham 1940 zero-density exponent e_I(sigma) = 3(1 - sigma)/(2 - sigma).
function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// Guth-Maynard 2024 zero-density exponent e_GM(sigma) = (30/13)(1 - sigma),
// the headline improvement valid for sigma in [3/4, 1] (sharpest at 3/4).
function guthMaynardExponent(sigma) {
  return (30 / 13) * (1 - sigma);
}

const E_INGHAM = inghamExponent(SIGMA);                 // 0.6 exactly
const E_GUTH_MAYNARD = guthMaynardExponent(SIGMA);      // 7.5/13 = 0.576923...
const DELTA_EXPONENT = E_INGHAM - E_GUTH_MAYNARD;       // 0.023076923...

// Tightening from the EXPONENT improvement alone (large-values route, NOT
// sieve): T_PT^{DELTA_EXPONENT}. Routed to imp-1332, listed here for honesty.
const EXPONENT_ROUTE_TIGHTENING = Math.exp(DELTA_EXPONENT * LOG_T_PT);   // ~1.94

// Tightening attributable to the SIEVE route (the ticket question): NONE.
const SIEVE_ROUTE_TIGHTENING = 1.0;

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- Disambiguate the two "Maynard 2024" objects.
// ─────────────────────────────────────────────────────────────────────────────

const MAYNARD_OBJECTS = Object.freeze({
  sieve: Object.freeze({
    id: 'maynard-gpy-sieve',
    name: 'Maynard multidimensional GPY sieve',
    references: [
      'Maynard, J. -- Small gaps between primes -- Ann. of Math. 181 (2015) 383-413',
      'Tao-Maynard / Polymath8b -- Variants on the Selberg sieve',
    ],
    outputs: 'prime-tuple admissibility / bounded gaps between primes',
    producesZeroDensityBound: false,
    note:
      'The GPY-Maynard sieve weights prime k-tuples. It has no operator '
      + 'whose output is a count of zeta zeros in a half-plane strip. The '
      + 'zero-density bound N(sigma, T) is produced by large-values theorems '
      + 'for Dirichlet polynomials, the Halasz-Montgomery method, and moment '
      + 'estimates -- a disjoint toolchain from the sieve.',
  }),
  largeValueEstimate: Object.freeze({
    id: 'guth-maynard-2024',
    name: 'Guth-Maynard large value estimate for Dirichlet polynomials',
    references: [
      'Guth, L. and Maynard, J. -- New large value estimates for Dirichlet '
        + 'polynomials -- arXiv 2405.20552 (2024)',
    ],
    outputs: 'improved zero-density exponent e_GM(sigma) = (30/13)(1 - sigma)',
    producesZeroDensityBound: true,
    isSieve: false,
    note:
      'This is the result that genuinely tightens N(sigma, T). It is a '
      + 'large-values / Fourier-analytic argument, NOT a sieve. It is stated '
      + 'with a T^{o(1)} correction -- no explicit (log T)^A with bounded A. '
      + 'Routed to imp-1332 as an Ingham-1940 substitute.',
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- Answer the three ticket sub-questions explicitly.
// ─────────────────────────────────────────────────────────────────────────────

const TICKET_ANSWERS = Object.freeze({
  a_explicitConstantWithAbelow2: Object.freeze({
    question:
      'Does the Maynard 2013/2024 sieve give an explicit constant on '
      + 'N(sigma, T) with A < 2?',
    answer: 'NO',
    reason:
      'The GPY-Maynard SIEVE produces no zero-density bound at all, so there '
      + 'is no A to bound. The Guth-Maynard 2024 large-value estimate (not a '
      + 'sieve) improves the EXPONENT but carries an unquantified T^{o(1)} '
      + 'rather than an explicit (log T)^A, so it does not certify A < 2 '
      + 'either.',
  }),
  b_sigmaDependence: Object.freeze({
    question: 'What dependence on sigma?',
    answer:
      'The sieve contributes no sigma-dependence (it does not apply). The '
      + 'Guth-Maynard exponent e_GM(sigma) = (30/13)(1 - sigma) is linear in '
      + '(1 - sigma) on [3/4, 1] and beats Ingham most near sigma = 3/4; its '
      + 'T^{o(1)} factor is uniform in sigma but unquantified.',
    eInghamAt075: E_INGHAM,
    eGuthMaynardAt075: E_GUTH_MAYNARD,
    crossoverNote:
      'e_GM and e_I both vanish at sigma = 1; the GM advantage is largest at '
      + 'the lower end sigma = 3/4 and shrinks toward sigma = 1.',
  }),
  c_rigorousTighteningFactor: Object.freeze({
    question:
      'At sigma = 0.75 and T_PT = 3e12, what is the rigorous tightening '
      + 'factor?',
    sieveRouteFactor: SIEVE_ROUTE_TIGHTENING,             // 1.0 -- none
    exponentRouteFactor: EXPONENT_ROUTE_TIGHTENING,       // ~1.94 (imp-1332)
    answer:
      'From the SIEVE route: factor 1.0 (no tightening). The only achievable '
      + 'density-side tightening is the ~1.94x EXPONENT improvement from '
      + 'Guth-Maynard, which is a large-values result routed to imp-1332 and '
      + 'still leaves the (log T)^A factor unquantified.',
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Named sub-gap + canonical verdict.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'maynard-sieve-closes-density-log-factor',                 // would-be win
  'maynard-sieve-does-not-transfer-to-density-log-factor',   // actual
  'maynard-sieve-partially-transfers-needs-new-input',
  'inconclusive-needs-more-literature',
]);

const VERDICT = 'maynard-sieve-does-not-transfer-to-density-log-factor';

const NAMED_SUB_GAP = Object.freeze({
  id: 'SUBGAP-1325-A-is-large-values-not-sieve',
  statement:
    'The (log T)^A factor in N(sigma, T) is a LARGE-VALUES / EXPLICIT-INGHAM '
    + 'problem, NOT a sieve problem. No GPY-Maynard sieve mechanism outputs a '
    + 'density bound, and the Guth-Maynard large-value method that does '
    + 'improve the exponent reports T^{o(1)} rather than an explicit '
    + 'bounded-A factor. Killing the A factor requires an explicit-constants '
    + 'large-values / effective-Ingham paper (Kadiri family with A = 0), not '
    + 'a sieve.',
  liveLever: 'imp-1332 (Guth-Maynard exponent as Ingham-1940 substitute)',
  deadLever: 'imp-1325 sieve-on-density (this ticket -- closed negatively)',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- Cross-references + honest scope.
// ─────────────────────────────────────────────────────────────────────────────

const CROSS_REFERENCES = Object.freeze({
  'imp-1318': 'parent -- Maynard sieve vs spectral PCC (negative); flagged the '
    + 'residual density possibility this ticket resolves.',
  'imp-1321': 'sibling -- Bui-Soundararajan rigor port, blocked by (log T)^A.',
  'imp-1322': 'sibling -- sigma-reopt within Ingham 1940, blocked by (log T)^A.',
  'imp-1332': 'forward -- Guth-Maynard exponent substitute (the live density '
    + 'lever this audit isolates).',
  'imp-1261': 'consumer -- the composition whose E_trunc_pt the density bound '
    + 'feeds.',
});

const HONEST_SCOPE = Object.freeze([
  'The sieve route to the (log T)^A factor CANNOT be claimed -- it does not '
    + 'exist; the GPY-Maynard sieve produces no zero-density bound.',
  'The Guth-Maynard 2024 EXPONENT improvement is real (~1.94x at sigma = 0.75) '
    + 'but is NOT a sieve and is routed to imp-1332.',
  'No explicit A < 2 follows from any Maynard result; the A factor remains a '
    + 'large-values / explicit-Ingham research target (Kadiri family).',
  'imp-1325 is CLOSED NEGATIVELY on the sieve question; engine cannot deliver '
    + 'the A-factor win and does not claim it.',
]);

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY = Object.freeze({
  id: 'imp-1325',
  ticket: 'imp-1325',
  title: 'A=0 sieve breakthrough: Maynard 2013/2024 sieve vs the (log T)^A '
    + 'factor in zero-density N(sigma, T)',
  shippedAt: '2026-06-02T00:00:00Z',
  shippedBy: 'opus-4-8 (api)',

  T_PT,
  logT_PT: LOG_T_PT,
  sigma: SIGMA,
  eIngham: E_INGHAM,
  eGuthMaynard: E_GUTH_MAYNARD,
  deltaExponent: DELTA_EXPONENT,
  exponentRouteTightening: EXPONENT_ROUTE_TIGHTENING,
  sieveRouteTightening: SIEVE_ROUTE_TIGHTENING,

  maynardObjects: MAYNARD_OBJECTS,
  ticketAnswers: TICKET_ANSWERS,

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  namedSubGap: NAMED_SUB_GAP,

  crossReferences: CROSS_REFERENCES,
  honestScope: HONEST_SCOPE,

  pinnedNumerics: Object.freeze({
    T_PT: 3e12,
    logT_PT: 28.729711,
    sigma: 0.75,
    eIngham: 0.6,
    eGuthMaynard: 0.5769230769230769,        // 7.5 / 13
    deltaExponent: 0.02307692307692313,
    exponentRouteTightening: 1.9407,          // T_PT^{deltaExponent}
    sieveRouteTightening: 1.0,
  }),
});

export default IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (10 shipped; ticket spec requires 10).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY_ASSERTIONS = [
  // Tripwire 1: production numerics pinned.
  {
    id: 'imp1325-production-numerics-pinned',
    why:
      'The audit is anchored to T_PT = 3e12 and sigma = 0.75 (the imp-459 / '
      + 'imp-1261 production choice). Drift in either invalidates every '
      + 'downstream factor.',
    holds: () => {
      const r = IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY;
      return r.T_PT === 3e12 && r.sigma === 0.75;
    },
  },

  // Tripwire 2: Ingham exponent at sigma = 0.75 is exactly 0.6.
  {
    id: 'imp1325-ingham-exponent-at-075-is-0p6',
    why:
      'e_I(0.75) = 3(0.25)/(1.25) = 0.6 is the baseline density exponent the '
      + 'production chain assumes. A regression here means the Ingham formula '
      + 'decohered.',
    holds: () => Math.abs(IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY.eIngham - 0.6) < 1e-12,
  },

  // Tripwire 3: Guth-Maynard exponent at sigma = 0.75 is 7.5/13.
  {
    id: 'imp1325-guth-maynard-exponent-at-075-is-7p5-over-13',
    why:
      'The headline Guth-Maynard 2024 improvement is e_GM(sigma) = '
      + '(30/13)(1 - sigma); at sigma = 0.75 this is 7.5/13 = 0.576923. This '
      + 'is the load-bearing exponent for the exponent-route tightening.',
    holds: () => {
      const e = IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY.eGuthMaynard;
      return Number.isFinite(e) && Math.abs(e - 7.5 / 13) < 1e-12;
    },
  },

  // Tripwire 4: Guth-Maynard beats Ingham at sigma = 0.75 (strictly smaller).
  {
    id: 'imp1325-guth-maynard-beats-ingham-at-075',
    why:
      'The whole density-side story requires e_GM < e_I at sigma = 0.75. If '
      + 'this inequality flips the exponent-route tightening would be < 1 '
      + '(a loosening), contradicting the audit narrative.',
    holds: () => {
      const r = IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY;
      return r.eGuthMaynard < r.eIngham && r.deltaExponent > 0;
    },
  },

  // Tripwire 5: exponent-route tightening in [1.5, 2.5] (~1.94).
  {
    id: 'imp1325-exponent-route-tightening-near-1p94',
    why:
      'T_PT^{deltaExponent} = exp(0.023077 * 28.73) ~= 1.94 is the achievable '
      + 'density-side gain (routed to imp-1332). Drift outside [1.5, 2.5] '
      + 'means the exponent or logT_PT decohered.',
    holds: () => {
      const f = IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY.exponentRouteTightening;
      return Number.isFinite(f) && f > 1.5 && f < 2.5;
    },
  },

  // Tripwire 6: sieve-route tightening is EXACTLY 1.0 (the negative result).
  {
    id: 'imp1325-sieve-route-tightening-is-exactly-one',
    why:
      'The headline negative verdict is that the SIEVE route gives NO '
      + 'tightening. The factor must be exactly 1.0; any value > 1 would '
      + 'falsely claim a sieve win that this audit explicitly disproves.',
    holds: () => IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY.sieveRouteTightening === 1.0,
  },

  // Tripwire 7: the two Maynard objects are disambiguated correctly.
  {
    id: 'imp1325-two-maynard-objects-disambiguated',
    why:
      'The entire argument hinges on separating the GPY-Maynard SIEVE (no '
      + 'density bound) from the Guth-Maynard large-value estimate (density '
      + 'exponent, not a sieve). Conflating them is the exact error the audit '
      + 'guards against.',
    holds: () => {
      const o = IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY.maynardObjects;
      return (
        o.sieve.producesZeroDensityBound === false &&
        o.largeValueEstimate.producesZeroDensityBound === true &&
        o.largeValueEstimate.isSieve === false
      );
    },
  },

  // Tripwire 8: ticket sub-question (a) answered NO.
  {
    id: 'imp1325-subquestion-a-answered-no',
    why:
      'The primary ticket question -- does the sieve give explicit A < 2 -- '
      + 'must be answered NO. A regression to YES would be a fabricated '
      + 'breakthrough.',
    holds: () =>
      IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY.ticketAnswers
        .a_explicitConstantWithAbelow2.answer === 'NO',
  },

  // Tripwire 9: canonical verdict is in the allowed set and is the negative one.
  {
    id: 'imp1325-verdict-in-allowed-set-and-negative',
    why:
      'The verdict must be the canonical negative string and must belong to '
      + 'the allowed-verdicts enumeration. A free-text or out-of-set verdict '
      + 'would break engine routing.',
    holds: () => {
      const r = IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY;
      return (
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'maynard-sieve-does-not-transfer-to-density-log-factor'
      );
    },
  },

  // Tripwire 10 (semantic): named sub-gap routes A to large-values/imp-1332,
  // and honest scope refuses the A < 2 claim.
  {
    id: 'imp1325-semantic-subgap-routes-to-large-values-and-refuses-claim',
    why:
      'SEMANTIC check: the named sub-gap must attribute the A factor to a '
      + 'large-values / explicit-Ingham problem (NOT a sieve) and name '
      + 'imp-1332 as the live lever, and the honest scope must explicitly '
      + 'refuse any A < 2 claim. Glossing over either would mis-report the '
      + 'ticket as closeable.',
    holds: () => {
      const r = IMP_1325_MAYNARD_SIEVE_ZERO_DENSITY;
      const g = r.namedSubGap;
      const scopeBlob = r.honestScope.join(' || ');
      return (
        /large-values|explicit-ingham/i.test(g.statement) &&
        /not a sieve|NOT a sieve/i.test(g.statement) &&
        /imp-1332/.test(g.liveLever) &&
        /No explicit A < 2|cannot be claimed|CANNOT be claimed/i.test(scopeBlob)
      );
    },
  },
];
