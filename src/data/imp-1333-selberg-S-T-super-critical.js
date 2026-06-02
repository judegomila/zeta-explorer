// @module data/imp-1333-selberg-S-T-super-critical
// imp-1333 -- NOVEL: Selberg S(T) argument function, modern explicit constants,
// as the entry point for a super-critical phase exploration.
//
// WHAT S(T) IS
// ------------
// S(T) = (1/pi) * arg zeta(1/2 + iT), where the argument is obtained by
// continuous variation of arg zeta(s) along the broken path 2 -> 2 + iT ->
// 1/2 + iT, starting from arg zeta(2) = 0. It is the OSCILLATORY remainder in
// the Riemann-von Mangoldt zero-counting formula:
//
//   N(T) = (T / 2pi) log(T / 2pi) - T / 2pi + 7/8 + S(T) + O(1/T),
//
// where N(T) counts nontrivial zeros with 0 < Im(rho) <= T. So S(T) is the
// PHASE of zeta on the critical line: every nontrivial zero contributes a jump
// of +1 to N(T) and a corresponding unit jump to S(T).
//
// HEADLINE VERDICT
// ----------------
//   verdict = 's-t-catalogued-but-lambda-link-circular-on-critical-line'
//
//   (a) BEST EXPLICIT BOUNDS CATALOGUED. Unconditional (Trudgian 2014):
//       |S(T)| <= 0.111 log T + 0.275 log log T + 2.450 for T >= e. Under RH
//       (Carneiro-Chandee-Milinovich 2013): |S(T)| <= (1/4 + o(1)) log T /
//       log log T, improving the Goldston-Gonek 2007 constant 1/2 by a factor
//       of 2. Selberg`s central limit theorem (normalised variance
//       1/(2 pi^2) log log T) and the Bondarenko-Seip 2017 resonance Omega-
//       result are recorded as the distributional envelope.
//
//   (b) NO NEW LAMBDA CONSTRAINT ON THE CRITICAL LINE -- CIRCULARITY. S(T) is a
//       functional of the very zeros whose reality the de Bruijn-Newman
//       constant Lambda controls. The de Bruijn flow H_t moves the zeros; on
//       sigma = 1/2 the phase S(T) is DETERMINED by their positions, so reading
//       a Lambda constraint off S(T) assumes what Lambda is meant to decide.
//       The genuine entry point is the ANALYTIC CONTINUATION of the phase
//       S(sigma, T) = (1/pi) arg zeta(sigma + iT) into the super-critical strip
//       sigma > 1/2 -- but unwinding that argument continuously requires knowing
//       there are no zeros in 1/2 < Re(s) < sigma, which is exactly RH. Named
//       sub-gap STC-1 (super-critical phase continuation is circular for RH).
//
//   (c) MOMENT-DUAL OF THE n-POINT CORRELATIONS. The second moment of S(T)
//       (Selberg, Goldston 1987) is governed by Montgomery`s pair-correlation
//       F(alpha); higher moments (Hejhal, Rudnick-Sarnak) are the phase-side
//       dual of the 3-point correlation studied empirically in imp-1183 /
//       imp-1238 / imp-1257. S(T) is thus the spectral-phase coordinate of the
//       same correlation data, not an independent lever.
//
// HONEST BOTTOM LINE
// ------------------
// This ticket OPENS the super-critical phase program (never touched in this
// codebase) by laying down the explicit S(T) bounds and showing precisely WHY
// the critical-line phase cannot tighten Lambda on its own: the link is
// circular. The current Lambda bracket 0 <= Lambda <= 0.2 (Rodgers-Tao 2020
// lower, Polymath15 2019 upper) is UNMOVED by S(T). The one promising direction
// -- continuing the phase into sigma > 1/2 -- is itself gated by RH and is
// recorded as the named follow-up sub-gap STC-1.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings
// only; no apostrophes inside single-quoted strings (back-tick used in prose
// comments above is harmless, it is inside a // line comment).

// -----------------------------------------------------------------------------
// Numerics. All values are re-derived here so this module is a standalone
// citable record (not imported from elsewhere).
// -----------------------------------------------------------------------------

// Selberg central-limit-theorem variance normalisation:
//   S(T) / sqrt( (1/(2 pi^2)) log log T )  ->  N(0, 1)  in distribution.
const SELBERG_CLT_CONSTANT = 1 / (2 * Math.PI * Math.PI); // ~0.0506606

// Trudgian 2014 explicit unconditional bound coefficients:
//   |S(T)| <= a log T + b log log T + c   (T >= e).
const TRUDGIAN_A = 0.111;
const TRUDGIAN_B = 0.275;
const TRUDGIAN_C = 2.450;

function trudgianBound(T) {
  if (!(T >= Math.E)) return null;
  const L = Math.log(T);
  const LL = Math.log(Math.log(T));
  return TRUDGIAN_A * L + TRUDGIAN_B * LL + TRUDGIAN_C;
}

// RH-conditional constants for the |S(T)| <= (C + o(1)) log T / log log T form.
const GOLDSTON_GONEK_2007_CONSTANT = 0.5; // |S(T)| <= (1/2 + o(1)) logT/loglogT
const CCM_2013_CONSTANT = 0.25;           // Carneiro-Chandee-Milinovich: 1/4

// RH-conditional envelope (leading order, drop the o(1)).
function ccmRhBound(T) {
  if (!(T > Math.E)) return null;
  const L = Math.log(T);
  const LL = Math.log(Math.log(T));
  return (CCM_2013_CONSTANT * L) / LL;
}

// Selberg normalised standard deviation of S(T).
function selbergSigma(T) {
  if (!(T > Math.E)) return null;
  return Math.sqrt(SELBERG_CLT_CONSTANT * Math.log(Math.log(T)));
}

// Bondarenko-Seip 2017 resonance Omega-result (large values of S(T)):
//   S(T) = Omega( sqrt( log T * log log log T / log log T ) ).
// Returned as the growth envelope of the lower bound (constant absorbed).
function bondarenkoSeipOmega(T) {
  const L = Math.log(T);
  const LL = Math.log(L);
  const LLL = Math.log(LL);
  if (!(LLL > 0)) return null;
  return Math.sqrt((L * LLL) / LL);
}

// Current de Bruijn-Newman bracket.
const LAMBDA_LOWER = 0;     // Rodgers-Tao 2020 (Newman conjecture proved).
const LAMBDA_UPPER = 0.2;   // Polymath15 2019.

// -----------------------------------------------------------------------------
// Sub-question (a): current best explicit bounds on S(T).
// -----------------------------------------------------------------------------

const EXPLICIT_BOUNDS = Object.freeze({
  definition: 'S(T) = (1/pi) arg zeta(1/2 + iT), by continuous variation along 2 -> 2+iT -> 1/2+iT.',
  countingFormula: 'N(T) = (T/2pi) log(T/2pi) - T/2pi + 7/8 + S(T) + O(1/T).',
  unconditional: Object.freeze({
    cite: 'Trudgian, T. (2014), An improved upper bound for the argument of the Riemann zeta-function on the critical line II, J. Number Theory 134, 280-292.',
    form: '|S(T)| <= a log T + b log log T + c, for T >= e.',
    a: TRUDGIAN_A,
    b: TRUDGIAN_B,
    c: TRUDGIAN_C,
    order: 'O(log T)',
  }),
  rhConditional: Object.freeze({
    cite: 'Carneiro, E.; Chandee, V.; Milinovich, M. (2013), Bounding S(t) and S_1(t) on the Riemann hypothesis, Math. Ann. 356, 939-968.',
    form: '|S(T)| <= (1/4 + o(1)) log T / log log T (assuming RH).',
    constant: CCM_2013_CONSTANT,
    improvesOver: Object.freeze({
      cite: 'Goldston, D.; Gonek, S. (2007), A note on S(t) and the zeros of the Riemann zeta-function, Bull. LMS 39, 482-486.',
      constant: GOLDSTON_GONEK_2007_CONSTANT,
      factor: GOLDSTON_GONEK_2007_CONSTANT / CCM_2013_CONSTANT, // 2x
    }),
    order: 'O(log T / log log T)',
  }),
  distribution: Object.freeze({
    selbergCLT: 'S(T) / sqrt( (1/(2 pi^2)) log log T ) -> N(0,1) (Selberg).',
    cltConstant: SELBERG_CLT_CONSTANT,
    varianceCite: 'Selberg, A. (1946), Contributions to the theory of the Riemann zeta-function, Arch. Math. Naturvid. 48.',
    omega: Object.freeze({
      cite: 'Bondarenko, A.; Seip, K. (2017/2018), Large greatest common divisor sums and extreme values of the Riemann zeta function, Duke Math. J. 166; and related S(T) resonance results.',
      form: 'S(T) = Omega( sqrt( log T log log log T / log log T ) ).',
    }),
  }),
});

// -----------------------------------------------------------------------------
// Sub-question (b): does S(T) constrain Lambda via the de Bruijn flow?
// -----------------------------------------------------------------------------

const LAMBDA_LINK = Object.freeze({
  question: 'Does S(T) behaviour near zeros give a new constraint on Lambda via the de Bruijn flow argument continuity?',
  answer: 'no-new-constraint-on-critical-line-circular',
  reason:
    'S(T) is a functional of the nontrivial zeros (it is exactly the oscillatory ' +
    'remainder of their counting function). The de Bruijn-Newman constant Lambda ' +
    'is the threshold above which the de Bruijn flow H_t has all zeros real. ' +
    'On sigma = 1/2 the phase S(T) is determined BY the zero positions, so any ' +
    'Lambda statement read off S(T) presupposes the zero configuration Lambda is ' +
    'meant to decide. The deduction is circular.',
  subGap: 'STC-1',
  subGapDetail:
    'The non-circular entry is the analytic continuation of the phase ' +
    'S(sigma, T) = (1/pi) arg zeta(sigma + iT) into the super-critical strip ' +
    'sigma > 1/2. But continuous unwinding of arg zeta across 1/2 < Re(s) < sigma ' +
    'requires there to be no zeros in that strip -- which is exactly RH. So the ' +
    'super-critical phase continuation is itself RH-gated (sub-gap STC-1).',
  lambdaBracketUnchanged: Object.freeze({
    lower: LAMBDA_LOWER,
    upper: LAMBDA_UPPER,
    lowerCite: 'Rodgers, B.; Tao, T. (2020), The de Bruijn-Newman constant is non-negative, Forum Math. Pi 8.',
    upperCite: 'Polymath, D.H.J. (2019), Effective approximation of heat flow evolution of the Riemann xi function, and a new upper bound for the de Bruijn-Newman constant, Res. Math. Sci. 6.',
    movedByThisTicket: false,
  }),
});

// -----------------------------------------------------------------------------
// Sub-question (c): connection to the imp-1183 / imp-1238 / imp-1257 3-point.
// -----------------------------------------------------------------------------

const CORRELATION_LINK = Object.freeze({
  claim: 'S(T) moments are the phase-side dual of the n-point zero correlations.',
  secondMoment:
    'The second moment / variance of S(T) is governed by Montgomery pair ' +
    'correlation F(alpha) (Goldston 1987; Montgomery 1973). This is the 2-point ' +
    'side validated empirically in imp-1162 / imp-1166.',
  higherMoments:
    'Higher moments of S(T) connect to the 3-point and n-point correlation ' +
    '(Hejhal 1994; Rudnick-Sarnak 1996), the phase-side analogue of the R_3 ' +
    'empirical study in imp-1183 / imp-1238 and the bandwidth caveat in imp-1257.',
  independentLever: false,
  independenceNote:
    'Because S(T) moments are functionals of the same correlation data, S(T) is ' +
    'a re-coordinatisation of the n-point statistics, not an independent ' +
    'constraint. Same circularity class as LAMBDA_LINK.',
  relatedTickets: Object.freeze(['imp-1183', 'imp-1238', 'imp-1257']),
});

// -----------------------------------------------------------------------------
// Verdict.
// -----------------------------------------------------------------------------

const ALLOWED_VERDICTS = Object.freeze([
  's-t-gives-new-lambda-constraint',
  's-t-catalogued-but-lambda-link-circular-on-critical-line',
  's-t-irrelevant-to-lambda',
]);

const VERDICT = 's-t-catalogued-but-lambda-link-circular-on-critical-line';

const VERDICT_DETAIL =
  's-t-catalogued-but-lambda-link-circular-on-critical-line: The modern explicit ' +
  'bounds on S(T) are now on record -- unconditional Trudgian 2014 ' +
  '(0.111 log T + 0.275 log log T + 2.450) and RH-conditional ' +
  'Carneiro-Chandee-Milinovich 2013 (constant 1/4, a 2x improvement over ' +
  'Goldston-Gonek 2007), with the Selberg CLT variance 1/(2 pi^2) log log T and ' +
  'the Bondarenko-Seip resonance Omega-result as the distributional envelope. ' +
  'But S(T) on the critical line is a functional of the very zeros whose reality ' +
  'Lambda controls, so it yields no independent Lambda constraint: the bracket ' +
  '0 <= Lambda <= 0.2 is unmoved. The genuine super-critical entry -- continuing ' +
  'the phase into sigma > 1/2 -- is itself RH-gated and is recorded as sub-gap ' +
  'STC-1. S(T) moments are the phase-side dual of the imp-1183/1238/1257 n-point ' +
  'correlations, not an independent lever.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1333-followup-stc-1-super-critical-phase-continuation',
  title:
    'Make sense of S(sigma, T) = (1/pi) arg zeta(sigma + iT) for sigma > 1/2 ' +
    'WITHOUT assuming the strip 1/2 < Re(s) < sigma is zero-free. Either find a ' +
    'phase-continuation argument that is not circular, or prove rigorously that ' +
    'the super-critical phase is RH-equivalent (which would explain why every ' +
    'phase-route hits the same wall).',
  subGapId: 'STC-1',
  priority: 'high',
  sharesToolingWith: Object.freeze(['imp-1334', 'imp-1335']),
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1333_SELBERG_S_T_SUPER_CRITICAL = Object.freeze({
  id: 'imp-1333',
  ticket: 'imp-1333',
  title: 'Selberg S(T) argument function modern explicit constants -- super-critical phase entry',
  proofSection: 'S7',
  shippedBy: 'opus-4-7 (subscription)',

  pinnedNumerics: Object.freeze({
    selbergCltConstant: SELBERG_CLT_CONSTANT,
    trudgianA: TRUDGIAN_A,
    trudgianB: TRUDGIAN_B,
    trudgianC: TRUDGIAN_C,
    goldstonGonekConstant: GOLDSTON_GONEK_2007_CONSTANT,
    ccmConstant: CCM_2013_CONSTANT,
    lambdaLower: LAMBDA_LOWER,
    lambdaUpper: LAMBDA_UPPER,
  }),

  explicitBounds: EXPLICIT_BOUNDS,   // sub-question (a)
  lambdaLink: LAMBDA_LINK,           // sub-question (b)
  correlationLink: CORRELATION_LINK, // sub-question (c)

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1183': 'src/data/imp-1183-3point-correlation-empirical.js (3-point R_3 vs GUE empirical).',
    'imp-1238': 'src/data/imp-1238-3point-correlation-extended.js (extended R_3 grid).',
    'imp-1334': 'queue: Voronin 1975 universality on sigma > 1/2 (sibling super-critical ticket).',
    'imp-1335': 'queue: super-critical strip image topology (depends on imp-1334).',
  }),
});

export default IMP_1333_SELBERG_S_T_SUPER_CRITICAL;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (10 shipped; ticket spec requires 10).
// -----------------------------------------------------------------------------

export const IMP_1333_SELBERG_S_T_SUPER_CRITICAL_ASSERTIONS = [

  // Tripwire 1: Selberg CLT normalisation constant is 1/(2 pi^2).
  {
    id: 'imp1333-selberg-clt-constant-is-half-pi-squared-inverse',
    why:
      'Selberg`s central limit theorem normalises S(T) by sqrt((1/(2 pi^2)) log log T). ' +
      'The constant 1/(2 pi^2) ~ 0.050661 is the load-bearing variance scale; a drift ' +
      'here would mis-state the entire distributional envelope.',
    holds: () => {
      const c = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.pinnedNumerics.selbergCltConstant;
      return Number.isFinite(c) && Math.abs(c - 1 / (2 * Math.PI * Math.PI)) < 1e-12;
    },
  },

  // Tripwire 2: Trudgian unconditional bound is O(log T) and finite/positive.
  {
    id: 'imp1333-trudgian-bound-is-order-log-T',
    why:
      'The unconditional explicit bound 0.111 log T + 0.275 log log T + 2.450 must be ' +
      'finite and positive at a representative height, and its leading coefficient must ' +
      'be the recorded 0.111 (Trudgian 2014). A change of leading order would break the ' +
      'O(log T) classification.',
    holds: () => {
      const T = 1e10;
      const b = trudgianBound(T);
      const lead = TRUDGIAN_A * Math.log(T);
      return Number.isFinite(b) && b > 0 && b > lead && b < lead + 5;
    },
  },

  // Tripwire 3: CCM 2013 RH constant is 1/4 and beats Goldston-Gonek by exactly 2x.
  {
    id: 'imp1333-ccm-constant-is-quarter-and-2x-better',
    why:
      'Under RH the Carneiro-Chandee-Milinovich 2013 constant is 1/4, improving the ' +
      'Goldston-Gonek 2007 constant 1/2 by a factor of exactly 2. Recording the wrong ' +
      'constant would overstate or understate the best RH-conditional phase bound.',
    holds: () => {
      const rh = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.explicitBounds.rhConditional;
      return (
        Math.abs(rh.constant - 0.25) < 1e-12 &&
        Math.abs(rh.improvesOver.constant - 0.5) < 1e-12 &&
        Math.abs(rh.improvesOver.factor - 2) < 1e-9
      );
    },
  },

  // Tripwire 4: RH-conditional envelope is asymptotically below the unconditional one.
  {
    id: 'imp1333-rh-bound-below-unconditional-at-large-T',
    why:
      'The RH envelope (1/4) log T / log log T must be much smaller than the ' +
      'unconditional O(log T) Trudgian bound at large T -- that is the whole point of ' +
      'assuming RH. If the RH bound were not smaller, the ordering of the two regimes ' +
      'would be wrong.',
    holds: () => {
      const T = 1e12;
      const rh = ccmRhBound(T);
      const unc = trudgianBound(T);
      return Number.isFinite(rh) && Number.isFinite(unc) && rh < unc;
    },
  },

  // Tripwire 5: Selberg sigma grows with T (variance increases with height).
  {
    id: 'imp1333-selberg-sigma-monotone-increasing',
    why:
      'The normalised standard deviation sqrt((1/(2 pi^2)) log log T) must increase with ' +
      'T because log log T increases. A non-monotone result would contradict the ' +
      'CLT variance scaling.',
    holds: () => {
      const s1 = selbergSigma(1e6);
      const s2 = selbergSigma(1e12);
      return Number.isFinite(s1) && Number.isFinite(s2) && s2 > s1 && s1 > 0;
    },
  },

  // Tripwire 6: Bondarenko-Seip Omega lower bound is o(log T / log log T) upper bound.
  {
    id: 'imp1333-omega-lower-below-rh-upper-asymptotically',
    why:
      'The resonance Omega-result sqrt(log T log log log T / log log T) must grow strictly ' +
      'slower than the RH upper envelope log T / log log T (their ratio -> 0). If the ' +
      'lower bound exceeded the conditional upper bound, the two cited results would be ' +
      'mutually inconsistent.',
    holds: () => {
      const T = 1e30;
      const lower = bondarenkoSeipOmega(T);
      const upperShape = Math.log(T) / Math.log(Math.log(T)); // CCM shape (constant 1/4 absorbed)
      return Number.isFinite(lower) && lower > 0 && lower < upperShape;
    },
  },

  // Tripwire 7: Lambda link verdict is the honest circular one (no new constraint).
  {
    id: 'imp1333-lambda-link-is-circular-no-new-constraint',
    why:
      'Sub-question (b) must answer that S(T) gives NO new Lambda constraint on the ' +
      'critical line and that the deduction is circular. A flip to a new constraint ' +
      'would be a false claim, since S(T) is a functional of the zeros Lambda governs.',
    holds: () => {
      const l = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.lambdaLink;
      return l.answer === 'no-new-constraint-on-critical-line-circular' && l.subGap === 'STC-1';
    },
  },

  // Tripwire 8: Lambda bracket [0, 0.2] recorded and explicitly NOT moved.
  {
    id: 'imp1333-lambda-bracket-unmoved',
    why:
      'The current de Bruijn-Newman bracket 0 <= Lambda <= 0.2 (Rodgers-Tao lower, ' +
      'Polymath15 upper) must be recorded and flagged as unmoved by this ticket. ' +
      'Claiming movement would overstate the result.',
    holds: () => {
      const b = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.lambdaLink.lambdaBracketUnchanged;
      return b.lower === 0 && Math.abs(b.upper - 0.2) < 1e-12 && b.movedByThisTicket === false;
    },
  },

  // Tripwire 9: correlation link records the 3-point tickets and is not an independent lever.
  {
    id: 'imp1333-correlation-link-not-independent-lever',
    why:
      'Sub-question (c) must record that S(T) moments are the phase-side DUAL of the ' +
      'imp-1183 / imp-1238 / imp-1257 n-point correlations and therefore NOT an ' +
      'independent lever. Treating it as independent would double-count the same data.',
    holds: () => {
      const c = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.correlationLink;
      return (
        c.independentLever === false &&
        c.relatedTickets.includes('imp-1183') &&
        c.relatedTickets.includes('imp-1238') &&
        c.relatedTickets.includes('imp-1257')
      );
    },
  },

  // Tripwire 10: verdict is allowed + honest-partial, and follow-up names STC-1.
  {
    id: 'imp1333-verdict-allowed-and-followup-names-stc1',
    why:
      'The verdict must be one of the three allowed strings and specifically the ' +
      'honest-partial one, and the follow-up must seed the genuine entry point by ' +
      'naming sub-gap STC-1 (super-critical phase continuation). Without it the audit ' +
      'identifies the wall but fails to route the next step.',
    holds: () => {
      const v = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.verdict;
      const allowed = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.allowedVerdicts;
      const f = IMP_1333_SELBERG_S_T_SUPER_CRITICAL.recommendedFollowup;
      return (
        allowed.includes(v) &&
        v === 's-t-catalogued-but-lambda-link-circular-on-critical-line' &&
        f.subGapId === 'STC-1'
      );
    },
  },
];
