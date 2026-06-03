// @module data/imp-1337-backlund-method-modern
// imp-1337 -- NOVEL: Backlund 1918 first-method S(t) argument-principle jump
// argument, modernized (Trudgian 2014), examined as a possible INDEPENDENT
// Lambda lever and as a possible direct attack on E_trunc_pt.
//
// WHAT THE BACKLUND METHOD IS
// ---------------------------
// Backlund (1918) gave the first EXPLICIT zero-count for zeta. His "first
// method" applies the argument principle to a rectangle R with corners
// (sigma_0, 0), (sigma_1, 0), (sigma_1, T), (sigma_0, T) straddling the
// critical line:
//
//   N_R = (1 / 2pi) * (change in arg zeta(s) around partial-R)
//
// counts the zeros inside R. Splitting the contour into the bottom edge, the
// two vertical edges and the top edge, and using the functional equation to
// pair the two halves, the vertical-edge contributions are exactly the
// argument variations (1/pi) arg zeta(sigma + iT) -- i.e. the phase function
// S(sigma, T). On sigma = 1/2 this is the Selberg S(T) = (1/pi) arg
// zeta(1/2 + iT) of imp-1333. Backlund bounds the variation of arg zeta along
// the edges by Jensen-type estimates on the number of sign changes of
// Re zeta, yielding the explicit |S(T)| = O(log T) bound that Trudgian (2014)
// sharpened to |S(T)| <= 0.111 log T + 0.275 log log T + 2.450 (T >= e).
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'backlund-counts-not-locates-decoupled-from-flow-and-routes-back-to-zero-density'
//
//   (a) NO INDEPENDENT LAMBDA CONSTRAINT VIA THE DE BRUIJN FLOW -- DECOUPLED.
//       The Backlund-Trudgian S(t) jump bound is an argument-principle COUNT of
//       the zeros of the STATIC function zeta = H_0 (the de Bruijn flow at
//       time t = 0). It tells you HOW MANY zeros sit in a rectangle, with the
//       error term controlled by the phase S(sigma, T); it does NOT supply a
//       t-DERIVATIVE of the zero positions along the flow H_t. The de Bruijn-
//       Newman constant Lambda is fixed by the BACKWARD heat-flow / backward-
//       uniqueness mechanism (Polymath15 2019 upper, Rodgers-Tao 2020 lower),
//       which is a statement about d/dt of the zeros, not about their static
//       count. Backlund counting is therefore DECOUPLED from the flow
//       parameter -- distinct from the imp-1333 circularity, but the same net
//       result: no new Lambda lever. Named sub-gap BK-1 (static count carries
//       no flow t-derivative). The bracket 0 <= Lambda <= 0.2 is UNMOVED.
//
//   (b) NO BACKLUND BYPASS OF INGHAM ZERO-DENSITY FOR E_trunc_pt -- ROUTES BACK.
//       E_trunc_pt = 3.0 * T_PT^{-0.4} = 3.06e-5 (imp-447 / imp-2337) is the
//       truncation tail of an Ingham 1940 zero-DENSITY estimate N(sigma, T) =
//       count of zeros with Re >= sigma. To replace Ingham with a Backlund
//       rectangle whose RIGHT edge sits at Re = sigma > 1/2, the argument-
//       principle count needs the variation of arg zeta along that vertical
//       edge -- exactly the SUPER-CRITICAL phase S(sigma, T). Controlling
//       S(sigma, T) for sigma > 1/2 is the RH-gated wall of imp-1333 (sub-gap
//       STC-1): unwinding the phase continuously presumes the strip
//       1/2 < Re(s) < sigma is zero-free, and any unconditional bound on it is
//       itself a zero-density estimate of the Ingham/convexity type. So the
//       Backlund route does not bypass Ingham -- it re-derives the SAME
//       N(sigma, T) object by a different contour. Named sub-gap BK-2 (super-
//       critical rectangle right edge is zero-density-equivalent).
//
// HONEST BOTTOM LINE
// ------------------
// Backlund`s 100-year-old argument-principle method is a COUNTING /
// VERIFICATION tool (it underlies the Platt-Trudgian finite-height RH
// verification, not a Lambda flow estimate). On the critical line it reduces
// to the Selberg S(T) already catalogued in imp-1333; off the line its right-
// edge phase is the RH-gated super-critical continuation. Neither sub-question
// moves the bracket 0 <= Lambda <= 0.2 or the headline E_trunc_pt = 3.06e-5.
// Two honest sub-gaps are seeded: BK-1 (flow decoupling) and BK-2 (zero-
// density equivalence of the super-critical rectangle).
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings
// only; no apostrophes inside single-quoted strings (back-ticks in the // prose
// comments above are harmless, they live inside line comments).

// -----------------------------------------------------------------------------
// Pinned numerics. Re-derived here so the module is a standalone citable record.
// -----------------------------------------------------------------------------

// Trudgian 2014 modern refinement of the Backlund-method S(t) bound:
//   |S(T)| <= a log T + b log log T + c, for T >= e.
// (Same constants as imp-1333; Backlund 1918 is the historical origin of the
//  O(log T) form, Trudgian 2014 is the current explicit constant.)
const TRUDGIAN_A = 0.111;
const TRUDGIAN_B = 0.275;
const TRUDGIAN_C = 2.450;

function backlundTrudgianBound(T) {
  if (!(T >= Math.E)) return null;
  const L = Math.log(T);
  const LL = Math.log(Math.log(T));
  return TRUDGIAN_A * L + TRUDGIAN_B * LL + TRUDGIAN_C;
}

// imp-447 / imp-2337 E_trunc_pt chain at sigma_opt = 0.75, T_PT = 3e12.
const T_PT = 3e12;
const LOG_TPT = Math.log(T_PT);

function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

function etruncPT(sigma) {
  const e = inghamExponent(sigma);
  const k = 1 - e;
  if (!(k > 0) || !isFinite(k)) return NaN;
  return (2 * e / k) * Math.exp(-k * LOG_TPT);
}

const E_TRUNC_PT = etruncPT(0.75); // ~ 3.06e-5

// Current de Bruijn-Newman bracket.
const LAMBDA_LOWER = 0;   // Rodgers-Tao 2020.
const LAMBDA_UPPER = 0.2; // Polymath15 2019.

// -----------------------------------------------------------------------------
// The Backlund argument-principle identity (structural record).
// -----------------------------------------------------------------------------

const ARGUMENT_PRINCIPLE = Object.freeze({
  cite: 'Backlund, R. (1918), Ueber die Nullstellen der Riemannschen Zetafunktion, Acta Math. 41, 345-375.',
  identity: 'N_R = (1/2pi) * (change in arg zeta around the rectangle R).',
  edgeReduction:
    'The two vertical-edge variations of (1/2pi) arg zeta are exactly the phase ' +
    'functions (1/pi) arg zeta(sigma + iT) = S(sigma, T); on sigma = 1/2 this is ' +
    'the Selberg S(T) of imp-1333.',
  capability: 'counts-zeros-in-rectangle',
  doesNotProvide: 'flow-time-derivative-of-zero-positions',
  modernConstants: Object.freeze({
    cite: 'Trudgian, T. (2014), An improved upper bound for the argument of the Riemann zeta-function on the critical line II, J. Number Theory 134, 280-292.',
    form: '|S(T)| <= a log T + b log log T + c, T >= e.',
    a: TRUDGIAN_A,
    b: TRUDGIAN_B,
    c: TRUDGIAN_C,
    order: 'O(log T)',
    historicalOrigin: 'Backlund 1918 (first explicit O(log T) zero-count error).',
  }),
});

// -----------------------------------------------------------------------------
// Sub-question (a): independent Lambda constraint via the de Bruijn flow?
// -----------------------------------------------------------------------------

const LAMBDA_LINK = Object.freeze({
  question: 'Does the Backlund-Trudgian S(t) jump bound give an INDEPENDENT Lambda constraint via the de Bruijn flow?',
  answer: 'no-decoupled-from-flow-static-count-carries-no-t-derivative',
  reason:
    'The Backlund argument-principle bound counts the zeros of the STATIC ' +
    'function zeta = H_0 (de Bruijn flow at time t = 0), with error governed by ' +
    'the static phase S(sigma, T). The de Bruijn-Newman constant Lambda is fixed ' +
    'by the backward heat-flow / backward-uniqueness mechanism -- a statement ' +
    'about d/dt of the zero positions along H_t (Polymath15 2019 upper, ' +
    'Rodgers-Tao 2020 lower). A static zero-count supplies no such t-derivative, ' +
    'so the Backlund bound is DECOUPLED from the flow parameter. This is ' +
    'distinct from the imp-1333 circularity (where the phase is determined BY the ' +
    'zeros) but yields the same outcome: no new Lambda lever.',
  contrastWithImp1333:
    'imp-1333: critical-line phase is CIRCULAR (functional of the zeros Lambda ' +
    'governs). imp-1337: Backlund count is DECOUPLED (no coupling to the flow ' +
    't-derivative). Different obstruction, same net: bracket unmoved.',
  subGap: 'BK-1',
  subGapDetail:
    'BK-1: a static argument-principle zero-count carries no flow-time ' +
    'derivative, so it cannot enter the heat-flow / backward-uniqueness estimate ' +
    'that pins Lambda. A Backlund-style lever would require differentiating the ' +
    'rectangle count along H_t -- not provided by the classical method.',
  lambdaBracketUnchanged: Object.freeze({
    lower: LAMBDA_LOWER,
    upper: LAMBDA_UPPER,
    lowerCite: 'Rodgers, B.; Tao, T. (2020), The de Bruijn-Newman constant is non-negative, Forum Math. Pi 8.',
    upperCite: 'Polymath, D.H.J. (2019), Effective approximation of heat flow evolution of the Riemann xi function, and a new upper bound for the de Bruijn-Newman constant, Res. Math. Sci. 6.',
    movedByThisTicket: false,
  }),
  verificationRole:
    'The Backlund method IS the engine of finite-height RH verification ' +
    '(Platt-Trudgian): a small certified |S(t)| confirms no off-line zeros up to ' +
    'height T. That is a zero-FREE certificate at fixed time, not a Lambda flow ' +
    'bound -- the same separation captured in finite-height-beats-platt-trudgian.js.',
});

// -----------------------------------------------------------------------------
// Sub-question (b): direct Backlund attack on E_trunc_pt bypassing Ingham?
// -----------------------------------------------------------------------------

const ETRUNC_LINK = Object.freeze({
  question: 'Is there a direct Backlund-style attack on E_trunc_pt that does NOT go through Ingham zero-density?',
  answer: 'no-routes-back-super-critical-rectangle-is-zero-density-equivalent',
  reason:
    'E_trunc_pt = 3.0 * T_PT^{-0.4} = 3.06e-5 is the truncation tail of an ' +
    'Ingham 1940 zero-DENSITY estimate N(sigma, T) (zeros with Re >= sigma). A ' +
    'Backlund rectangle with right edge at Re = sigma > 1/2 counts exactly those ' +
    'zeros, but its error term is the variation of arg zeta along that vertical ' +
    'edge = the super-critical phase S(sigma, T). Bounding S(sigma, T) ' +
    'unconditionally for sigma > 1/2 IS a zero-density / convexity estimate of ' +
    'the Ingham type (and unwinding it continuously presumes the strip is zero-' +
    'free, which is RH -- the imp-1333 STC-1 wall). So the Backlund contour does ' +
    'not bypass Ingham; it re-derives the same N(sigma, T) object.',
  pinnedEtrunc: E_TRUNC_PT,
  subGap: 'BK-2',
  subGapDetail:
    'BK-2: the super-critical rectangle right-edge count is zero-density-' +
    'equivalent -- controlling its argument-principle error for sigma > 1/2 is ' +
    'the same analytic task as the Ingham N(sigma, T) bound it was meant to ' +
    'replace. No independent saving on E_trunc_pt.',
  routesBackTo: Object.freeze(['imp-1333 STC-1 (super-critical phase RH-gated)', 'Ingham N(sigma,T) zero-density']),
  inghamUnbypassed: true,
});

// -----------------------------------------------------------------------------
// Verdict.
// -----------------------------------------------------------------------------

const ALLOWED_VERDICTS = Object.freeze([
  'backlund-gives-new-lambda-constraint',
  'backlund-counts-not-locates-decoupled-from-flow-and-routes-back-to-zero-density',
  'backlund-irrelevant-to-lambda',
]);

const VERDICT = 'backlund-counts-not-locates-decoupled-from-flow-and-routes-back-to-zero-density';

const VERDICT_DETAIL =
  'backlund-counts-not-locates-decoupled-from-flow-and-routes-back-to-zero-' +
  'density: Backlund 1918`s argument-principle rectangle count (modernized by ' +
  'Trudgian 2014 to |S(T)| <= 0.111 log T + 0.275 log log T + 2.450) is a ' +
  'COUNTING / VERIFICATION tool, not a Lambda flow estimate. (a) On the de ' +
  'Bruijn flow it counts the zeros of the STATIC function H_0 and supplies no ' +
  't-derivative of the zero positions, so it is DECOUPLED from the parameter ' +
  'that fixes Lambda (Polymath15 backward-uniqueness) -- no new lever, bracket ' +
  '0 <= Lambda <= 0.2 unmoved; sub-gap BK-1. (b) A Backlund rectangle with ' +
  'right edge at sigma > 1/2 needs the super-critical phase S(sigma, T), whose ' +
  'unconditional control is itself a zero-density estimate (and whose ' +
  'continuous unwinding is RH-gated, the imp-1333 STC-1 wall), so it does NOT ' +
  'bypass Ingham for E_trunc_pt = 3.06e-5; sub-gap BK-2. Honest partial: a ' +
  '100-year-old method correctly placed as the engine of finite-height ' +
  'verification, not a Lambda lever.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1337-followup-bk1-bk2-backlund-levers',
  title:
    'BK-1: find a flow-differentiated argument-principle count -- a d/dt of the ' +
    'Backlund rectangle along H_t that enters the heat-flow Lambda estimate. ' +
    'BK-2: prove rigorously that an unconditional bound on the super-critical ' +
    'phase S(sigma, T) for sigma > 1/2 is EQUIVALENT to an Ingham-type ' +
    'N(sigma, T) zero-density bound (which would explain why the Backlund ' +
    'contour cannot bypass Ingham).',
  subGapIds: Object.freeze(['BK-1', 'BK-2']),
  priority: 'high',
  sharesToolingWith: Object.freeze(['imp-1333', 'imp-2337']),
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1337_BACKLUND_METHOD_MODERN = Object.freeze({
  id: 'imp-1337',
  ticket: 'imp-1337',
  title: 'Backlund 1918 S(t) jump argument modernized -- examined as a Lambda lever and an E_trunc_pt attack',
  proofSection: 'S6',
  shippedBy: 'opus-4-8 (api-pool)',

  pinnedNumerics: Object.freeze({
    trudgianA: TRUDGIAN_A,
    trudgianB: TRUDGIAN_B,
    trudgianC: TRUDGIAN_C,
    eTruncPt: E_TRUNC_PT,
    tPt: T_PT,
    lambdaLower: LAMBDA_LOWER,
    lambdaUpper: LAMBDA_UPPER,
  }),

  argumentPrinciple: ARGUMENT_PRINCIPLE, // structural identity
  lambdaLink: LAMBDA_LINK,               // sub-question (a)
  etruncLink: ETRUNC_LINK,               // sub-question (b)

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1333': 'src/data/imp-1333-selberg-S-T-super-critical.js (Selberg S(T); STC-1 super-critical wall reused by BK-2).',
    'imp-2337': 'src/data/imp-2337-ingham-sigma-certification.js (E_trunc_pt = 3.06e-5 interval certification).',
    'imp-447': 'original derivation of E_trunc_pt = 3.06e-5 at sigma = 0.75.',
    'finite-height': 'src/data/finite-height-beats-platt-trudgian.js (Backlund-method verification role).',
  }),
});

export default IMP_1337_BACKLUND_METHOD_MODERN;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (8 shipped; ticket spec requires 8).
// -----------------------------------------------------------------------------

export const IMP_1337_BACKLUND_METHOD_MODERN_ASSERTIONS = [

  // Tripwire 1: modern Backlund-method S(t) constants pinned and O(log T).
  {
    id: 'imp1337-backlund-trudgian-bound-is-order-log-T',
    why:
      'The modern explicit Backlund-method bound 0.111 log T + 0.275 log log T + ' +
      '2.450 (Trudgian 2014, refining Backlund 1918) must be finite, positive and ' +
      'log-T-dominated at a representative height; a change of leading order would ' +
      'break the O(log T) classification of the argument-principle error.',
    holds: () => {
      const T = 1e10;
      const b = backlundTrudgianBound(T);
      const lead = TRUDGIAN_A * Math.log(T);
      return Number.isFinite(b) && b > 0 && b > lead && b < lead + 5;
    },
  },

  // Tripwire 2: argument-principle identity COUNTS but does not LOCATE / flow-differentiate.
  {
    id: 'imp1337-argument-principle-counts-not-flow-derivative',
    why:
      'The structural core must record that the Backlund rectangle COUNTS zeros ' +
      '(capability) and does NOT supply a flow-time derivative of zero positions. ' +
      'Mis-stating this would invite a false claim that a static count moves Lambda.',
    holds: () => {
      const ap = IMP_1337_BACKLUND_METHOD_MODERN.argumentPrinciple;
      return (
        ap.capability === 'counts-zeros-in-rectangle' &&
        ap.doesNotProvide === 'flow-time-derivative-of-zero-positions'
      );
    },
  },

  // Tripwire 3: sub-question (a) verdict is decoupled-from-flow with sub-gap BK-1.
  {
    id: 'imp1337-lambda-link-decoupled-from-flow-bk1',
    why:
      'Sub-question (a) must answer that the Backlund bound is DECOUPLED from the ' +
      'de Bruijn flow (a static count carries no t-derivative) and name sub-gap ' +
      'BK-1. A flip to a new constraint would be a false QED.',
    holds: () => {
      const l = IMP_1337_BACKLUND_METHOD_MODERN.lambdaLink;
      return (
        l.answer === 'no-decoupled-from-flow-static-count-carries-no-t-derivative' &&
        l.subGap === 'BK-1'
      );
    },
  },

  // Tripwire 4: Lambda bracket [0, 0.2] recorded and explicitly NOT moved.
  {
    id: 'imp1337-lambda-bracket-unmoved',
    why:
      'The de Bruijn-Newman bracket 0 <= Lambda <= 0.2 (Rodgers-Tao lower, ' +
      'Polymath15 upper) must be recorded and flagged unmoved by this ticket. ' +
      'Claiming movement would overstate the result.',
    holds: () => {
      const b = IMP_1337_BACKLUND_METHOD_MODERN.lambdaLink.lambdaBracketUnchanged;
      return b.lower === 0 && Math.abs(b.upper - 0.2) < 1e-12 && b.movedByThisTicket === false;
    },
  },

  // Tripwire 5: E_trunc_pt recomputes to 3.06e-5 from 3.0 * T_PT^{-0.4}.
  {
    id: 'imp1337-etrunc-pt-recomputes-to-3p06e-5',
    why:
      'The pinned E_trunc_pt must re-derive from the Ingham chain ' +
      '3.0 * (3e12)^{-0.4} and match the headline 3.06e-5 (imp-447 / imp-2337). ' +
      'A drift would mis-state the object the Backlund route was tested against.',
    holds: () => {
      const e = IMP_1337_BACKLUND_METHOD_MODERN.pinnedNumerics.eTruncPt;
      const ref = 3.0 * Math.exp(-0.4 * Math.log(3e12));
      return Number.isFinite(e) && Math.abs(e - ref) < 1e-18 && Math.abs(e - 3.06e-5) < 1e-6;
    },
  },

  // Tripwire 6: sub-question (b) verdict routes back to zero-density with sub-gap BK-2.
  {
    id: 'imp1337-etrunc-link-routes-back-zero-density-bk2',
    why:
      'Sub-question (b) must answer that the super-critical Backlund rectangle is ' +
      'zero-density-EQUIVALENT (no Ingham bypass) and name sub-gap BK-2. A claim ' +
      'of a bypass would be a false saving on E_trunc_pt.',
    holds: () => {
      const e = IMP_1337_BACKLUND_METHOD_MODERN.etruncLink;
      return (
        e.answer === 'no-routes-back-super-critical-rectangle-is-zero-density-equivalent' &&
        e.subGap === 'BK-2' &&
        e.inghamUnbypassed === true
      );
    },
  },

  // Tripwire 7: BK-2 reuses the imp-1333 STC-1 super-critical wall.
  {
    id: 'imp1337-bk2-reuses-imp1333-stc1-wall',
    why:
      'The honest closure must record that BK-2 routes into the SAME super-' +
      'critical phase wall as imp-1333 STC-1, so the obstruction is consistent ' +
      'across the phase program rather than a new unexplained barrier.',
    holds: () => {
      const e = IMP_1337_BACKLUND_METHOD_MODERN.etruncLink;
      const xref = IMP_1337_BACKLUND_METHOD_MODERN.crossReferences;
      return (
        Array.isArray(e.routesBackTo) &&
        e.routesBackTo.some((s) => s.indexOf('STC-1') >= 0) &&
        typeof xref['imp-1333'] === 'string'
      );
    },
  },

  // Tripwire 8: verdict allowed + honest-partial, follow-up names BK-1 and BK-2.
  {
    id: 'imp1337-verdict-allowed-and-followup-names-bk1-bk2',
    why:
      'The verdict must be one of the three allowed strings and specifically the ' +
      'honest-partial one, and the follow-up must seed both genuine entry points ' +
      'by naming sub-gaps BK-1 and BK-2. Without them the audit identifies the ' +
      'walls but fails to route the next step.',
    holds: () => {
      const v = IMP_1337_BACKLUND_METHOD_MODERN.verdict;
      const allowed = IMP_1337_BACKLUND_METHOD_MODERN.allowedVerdicts;
      const f = IMP_1337_BACKLUND_METHOD_MODERN.recommendedFollowup;
      return (
        allowed.includes(v) &&
        v === 'backlund-counts-not-locates-decoupled-from-flow-and-routes-back-to-zero-density' &&
        f.subGapIds.includes('BK-1') &&
        f.subGapIds.includes('BK-2')
      );
    },
  },
];
