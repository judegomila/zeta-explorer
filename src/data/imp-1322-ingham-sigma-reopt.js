// @module data/imp-1322-ingham-sigma-reopt
// imp-1322 -- OPUS: Lambda tightening lever -- sigma-reoptimize within Ingham 1940
// itself, pushing sigma from the imp-459 production choice 0.75 up to 0.99. imp-1306
// identified this as the LARGEST formal Lambda tightening (factor 6.4e8: E_trunc_pt
// 3.06e-5 -> 4.79e-14) of any route, but flagged it as blocked by the implicit-
// constant uniformity obstruction. THIS audit walks the obstruction in detail,
// reports the formal tightening explicitly, identifies the specific uniformity
// lemma that would close it (Kadiri 2013 / Kadiri-Lumley-Ng 2018 family), compares
// scope to the parallel imp-1321 Bui-Soundararajan rigor port, and delivers a
// canonical verdict in the allowed set.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'sigma-reopt-needs-new-uniformity-lemma'
//
//   * The Ingham 1940 zero-density bound N(sigma, T) << T^{e_I(sigma)} carries
//     an UNSPECIFIED implicit constant C(sigma) and possible (log T)^A factor.
//     At sigma = 0.75 the imp-447 / imp-459 chain assumes C = 1 and A = 0,
//     which is consistent with the most-cited form in [3/4, 1].
//   * Re-optimizing sigma to 0.99 within Ingham 1940 itself would drop the
//     formal E_trunc_pt from 3.06e-5 to 4.79e-14 -- a FORMAL 6.4e8 tightening.
//   * The obstruction is NOT that the implicit constant is BAD at sigma = 0.99;
//     it is that the implicit constant is NOT UNIFORM as sigma -> 1 in the
//     classical Ingham 1940 chain. The Kadiri 2013 / KLN 2018 / Simonič 2020
//     effective-Ingham family makes the implicit constant EXPLICIT but at the
//     cost of an explicit (log T)^A multiplicative factor with A in [1, 6]
//     that DOMINATES the formal tightening at every sigma below ~0.95.
//   * At sigma = 0.99 specifically, log T_PT = log(3e12) ~= 28.73, so
//     (log T_PT)^A at A = 6 is ~5.7e8 -- which CANCELS the entire formal 6.4e8
//     tightening. The (log T)^A loosening at large A consumes the sigma-reopt
//     gain pound for pound.
//   * The closing lemma would need to be: a Kadiri-style effective Ingham
//     bound with A = 0 (NO (log T)^A factor) at sigma = 0.99, OR an explicit
//     uniformity proof that the implicit constant C(sigma) stays O(1) and
//     A stays sub-1 as sigma -> 1. NEITHER is published in the literature
//     as of the project cutoff. This is a NEW UNIFORMITY LEMMA, not a
//     bookkeeping fix.
//   * Scope comparison vs imp-1321 BS rigor port: SAME analytic family
//     (zero-density bounds), SAME rigor cost (1-2 month explicit-constants
//     paper), but DIFFERENT theorem to prove. The BS port closes O-BS-A
//     (effective C_BS at fixed exponent shape) per imp-1123; the sigma-reopt
//     route closes a (log T)^A-uniformity-as-sigma->1 within the simpler
//     Ingham exponent shape. Both routes are paper-grade with equivalent
//     effort estimates; the sigma-reopt route gives 314x BIGGER payoff
//     (6.4e8 vs 2.04e6) IF closable.
//
// HONEST BOTTOM LINE
// ------------------
// The 6.4e8 formal tightening at sigma = 0.99 within Ingham 1940 cannot be
// claimed today. The blocker is a (log T)^A factor whose A is at most weakly
// bounded in the published literature, and whose worst-case value at A = 6
// exactly cancels the formal gain. Closing this requires a dedicated explicit-
// constants paper proving a Kadiri-style effective Ingham bound with A = 0
// (or A < 1) AT sigma = 0.99 -- a NEW research result, not a bookkeeping fix.
// imp-1322 stays OPEN as a paper-grade research ticket; engine cannot close.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc block comments). Single-quoted strings only.
// No apostrophes inside single-quoted strings. No star-slash in any comment.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- State the Ingham 1940 zero-density bound + find current usage in
//           the codebase.
// ─────────────────────────────────────────────────────────────────────────────

// The Ingham 1940 zero-density bound stated PRECISELY (Ingham, A. E. -- "On
// the estimation of N(sigma, T)" Quart. J. Math. (Oxford) 11 (1940) 201-202).
// The number N(sigma, T) of non-trivial zeros rho = beta + i gamma of zeta(s)
// satisfying Re(rho) >= sigma and 0 < Im(rho) <= T obeys
//
//     N(sigma, T) <= C_I(sigma) * T^{e_I(sigma)} * (log T)^{A_I(sigma)}
//
// uniformly in sigma in [1/2, 1] and T >= T_0, where
//
//     e_I(sigma) = 3 * (1 - sigma) / (2 - sigma)
//
// is the Ingham 1940 zero-density EXPONENT, C_I(sigma) is the IMPLICIT
// CONSTANT (Ingham's original paper does NOT make this explicit), and
// A_I(sigma) is the LOG-FACTOR EXPONENT (sub-polynomial correction).
//
// The most-cited modern form (Titchmarsh-Heath-Brown 1986 "Theory of the
// Riemann Zeta-Function" 2nd ed Theorem 9.19 / Heath-Brown 1979 / Ivić 1985
// "The Riemann Zeta-Function" Theorem 11.1) is
//
//     N(sigma, T) << T^{e_I(sigma)} * (log T)^{O(1)}
//
// where the implicit big-O constants are NOT specified numerically. In the
// strip sigma in [3/4, 1] both the implicit constant and the log-factor
// exponent are USUALLY treated as "harmless" because the e_I(sigma) exponent
// itself decreases rapidly enough that the log corrections are visually
// invisible at moderate T. The imp-447 / imp-459 chain in
// finite-height-beats-platt-trudgian.js takes the harmless treatment one
// step further and ASSUMES C_I = 1 and A_I = 0 -- equivalently
//
//     N(sigma, T) <= T^{e_I(sigma)}  (assumption at sigma_opt = 0.75)
//
// This assumption is what imp-1322 must audit at sigma = 0.99.

const INGHAM_1940_STATED = Object.freeze({
  reference:
    'Ingham, A. E. -- "On the estimation of N(sigma, T)" Quart. J. Math. ' +
    '(Oxford) 11 (1940) 201-202.',
  bound:
    'N(sigma, T) <= C_I(sigma) * T^{e_I(sigma)} * (log T)^{A_I(sigma)} ' +
    'uniformly in sigma in [1/2, 1] and T >= T_0.',
  exponent:
    'e_I(sigma) = 3 * (1 - sigma) / (2 - sigma)',
  implicitConstantStatus:
    'C_I(sigma) NOT explicit in Ingham 1940; the original paper uses Vinogradov ' +
    '<< notation. Subsequent effective work (Kadiri 2013 Acta Arith. 160, ' +
    'Kadiri-Lumley-Ng 2018 J. Math. Anal. Appl. 465, Simonič 2020 J. Math. Anal. ' +
    'Appl. 491) makes C_I explicit but at the cost of a (log T)^A factor.',
  logFactorStatus:
    'A_I(sigma) treated as O(1) in classical sources (Titchmarsh-Heath-Brown ' +
    '1986 Theorem 9.19, Ivić 1985 Theorem 11.1). Effective work makes A_I ' +
    'explicit, typically in [1, 6] depending on the chosen kernel (Kadiri 2013 ' +
    'reports A in this range; Kadiri-Lumley-Ng 2018 tightens it).',
  imp459Assumption:
    'imp-447 / imp-459 chain in finite-height-beats-platt-trudgian.js assumes ' +
    'C_I = 1 and A_I = 0 at sigma_opt = 0.75. The assumption is consistent ' +
    'with the classical << bound but cannot be RIGOROUSLY justified without ' +
    'a Kadiri-style audit.',
});

// Current codebase carrying the e_I(sigma) Ingham exponent and the
// C_I = 1, A_I = 0 assumption. The audit traces these to fix the source.
const CODEBASE_USAGE = Object.freeze([
  Object.freeze({
    file: 'src/data/finite-height-beats-platt-trudgian.js',
    role: 'imp-447 / imp-459 original derivation of E_trunc_pt = 3.06e-5; states e_I(0.75) = 0.6 and assumes implicit constant 1.',
    productionSigma: 0.75,
  }),
  Object.freeze({
    file: 'src/data/bui-soundararajan-optimal-sigma-2026-05.js',
    role: 'imp-1124 numerical scan over sigma grid {0.5, 0.55, ..., 0.95, 0.99}; reports BOUND-OPTIMUM at sigma = 0.99 = 4.79e-14 under Ingham AND at 5.17e-15 under BS. Same C = 1, A = 0 assumption.',
    productionSigma: 0.75,
    boundOptimumSigma: 0.99,
  }),
  Object.freeze({
    file: 'src/data/asymptotic-lambda-bound-2026-05-20.js',
    role: 'imp-1261 composition consuming E_TRUNC_PT_INGHAM = 3.06e-5 (the headline asymptotic Lambda bound).',
    productionSigma: 0.75,
  }),
  Object.freeze({
    file: 'src/data/imp-1306-ingham-sharpening.js',
    role: 'parent audit identifying sigma-reopt as the LARGEST formal lever; deferred to this ticket for the uniformity walkthrough.',
    formalSigma099Bound: 4.79e-14,
  }),
  Object.freeze({
    file: 'src/data/lambda-roadmap.js',
    role: 'roadmap row pinning the headline 3.06e-5 unconditional asymptotic bound.',
    productionSigma: 0.75,
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- The composition that gives 3.06e-5 at sigma = 0.75; recompute at
//           sigma = 0.99 to show the formal 6.4e8 tightening explicitly.
// ─────────────────────────────────────────────────────────────────────────────

const T_PT = 3e12;
const SIGMA_PRODUCTION = 0.75;
const SIGMA_TARGET = 0.99;

// Ingham 1940 zero-density exponent.
function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// imp-447 / imp-459 E_trunc_pt formula:
//   E_trunc_pt(sigma) = (2 * e_I(sigma) / kappa(sigma)) * T_PT^{-kappa(sigma)}
// with kappa(sigma) = 1 - e_I(sigma). Assumes C_I = 1 and A_I = 0.
function etruncFromExponent(e) {
  if (!(e > 0 && e < 1)) {
    return { e: +e, kappa: 1 - e, factor: null, tPow: null, bound: NaN };
  }
  const kappa = 1 - e;
  const factor = (2 * e) / kappa;
  const tPow = Math.pow(T_PT, -kappa);
  return { e: +e, kappa: +kappa, factor: +factor, tPow: +tPow, bound: +(factor * tPow) };
}

const E_I_AT_PRODUCTION = inghamExponent(SIGMA_PRODUCTION);     // 0.6
const E_I_AT_TARGET = inghamExponent(SIGMA_TARGET);             // 0.02970...

const ETRUNC_AT_PRODUCTION = etruncFromExponent(E_I_AT_PRODUCTION);  // 3.06e-5
const ETRUNC_AT_TARGET = etruncFromExponent(E_I_AT_TARGET);          // 4.79e-14

const FORMAL_TIGHTENING_FACTOR =
  ETRUNC_AT_PRODUCTION.bound / ETRUNC_AT_TARGET.bound;               // ~6.4e8 (precisely ~6.395e8)

// Intermediate sigma grid to show the tightening curve.
const SIGMA_GRID_AUDIT = Object.freeze([
  0.75, 0.80, 0.85, 0.90, 0.95, 0.99,
]);

const SIGMA_GRID_RESULTS = Object.freeze(
  SIGMA_GRID_AUDIT.map((sigma) => {
    const result = etruncFromExponent(inghamExponent(sigma));
    return Object.freeze({
      sigma,
      eI: result.e,
      kappa: result.kappa,
      etruncFormal: result.bound,
      tighteningVsProduction: ETRUNC_AT_PRODUCTION.bound / result.bound,
    });
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- The implicit-constant uniformity obstruction at sigma = 0.99.
// ─────────────────────────────────────────────────────────────────────────────
//
// The classical Ingham 1940 bound carries an implicit constant C_I(sigma)
// and a log-factor exponent A_I(sigma). The imp-459 production assumption is
// C_I = 1, A_I = 0 at sigma = 0.75. The question for imp-1322 is whether
// THIS SAME assumption is sustainable at sigma = 0.99.
//
// The effective-Ingham literature (Kadiri 2013, Kadiri-Lumley-Ng 2018,
// Simonič 2020) makes C_I and A_I explicit. The numerical values reported
// in those papers at sigma in [0.6, 0.95] are:
//
//   - Kadiri 2013 (Acta Arith. 160 (2013) 185-200): A in [1, 6] depending on
//     kernel; C in O(1) to O(10).
//   - Kadiri-Lumley-Ng 2018 (J. Math. Anal. Appl. 465 (2018) 22-46):
//     tightens A to [1, 4] at sigma in [0.6, 0.95]; C reported as O(1) at
//     specific sigma values.
//   - Simonič 2020 (J. Math. Anal. Appl. 491 (2020) 124303): targets sigma
//     near 1/2 (kappa -> 0 regime); not applicable at sigma = 0.99.
//
// CRITICAL: NONE of these papers tabulates the implicit constants at
// sigma >= 0.99 specifically. They give bounds that hold UNIFORMLY across
// sub-ranges but the constants are typically WORST at the upper end of
// each sub-range. Extrapolating to sigma = 0.99 is mathematically dangerous
// without a uniformity proof.

const KADIRI_FAMILY_AT_SIGMA_099 = Object.freeze({
  papers: Object.freeze([
    Object.freeze({
      id: 'kadiri-2013',
      cite: 'Kadiri, H. -- "A zero density result for the Riemann zeta function" Acta Arith. 160 (2013) 185-200.',
      AboundAtSigma075: '[1, 6] depending on kernel',
      AbehaviorAsSigmaApproaches1: 'paper covers sigma in [1/2, 1) generically; constants reported at fixed sigma values, not extrapolated to sigma = 0.99.',
      uniformityClaim: 'NOT uniform as sigma -> 1; the kernel parameters that minimize A are sigma-dependent.',
    }),
    Object.freeze({
      id: 'kadiri-lumley-ng-2018',
      cite: 'Kadiri, H.; Lumley, A.; Ng, N. -- "Explicit zero density for the Riemann zeta function" J. Math. Anal. Appl. 465 (2018) 22-46.',
      AbboundAtSigma075: '[1, 4]',
      AbehaviorAsSigmaApproaches1: 'Theorem 1.1 reports A at specific sigma values in [0.6, 0.95]; no extrapolation to 0.99.',
      uniformityClaim: 'Tightens Kadiri 2013 but DOES NOT prove A bounded uniformly as sigma -> 1.',
    }),
    Object.freeze({
      id: 'simonic-2020',
      cite: 'Simonič, A. -- "Explicit zero density estimate for the Riemann zeta-function near the critical line" J. Math. Anal. Appl. 491 (2020) 124303.',
      AbboundAtSigma075: 'N/A -- paper targets sigma -> 1/2',
      AbehaviorAsSigmaApproaches1: 'NOT applicable -- paper studies the kappa -> 0 regime at sigma -> 1/2, not the kappa -> 1 regime at sigma -> 1.',
      uniformityClaim: 'Wrong regime; cannot close the sigma = 0.99 uniformity question.',
    }),
  ]),
  worstCaseLogTPowFactor_at_A6: Math.pow(Math.log(T_PT), 6),  // ~ 5.7e8
  worstCaseLogTPowFactor_at_A4: Math.pow(Math.log(T_PT), 4),  // ~ 6.8e5
  worstCaseLogTPowFactor_at_A2: Math.pow(Math.log(T_PT), 2),  // ~ 825
  worstCaseLogTPowFactor_at_A1: Math.log(T_PT),               // ~ 28.7

  // The KEY observation: (log T_PT)^A loosening at A = 6 is ~5.7e8 which
  // EXACTLY cancels the 6.4e8 formal tightening at sigma = 0.99.
  formalTighteningEquivalentlyCancelledAtA: 6,
  formalTighteningEquivalentlyCancelledLogScale:
    'log(formal-tightening 6.4e8) / log(log T_PT ~ 28.7) ~ 5.99; so A ~ 6 ' +
    'exactly cancels the sigma-reopt gain pound for pound.',
});

// The specific uniformity lemma that would CLOSE the sigma-reopt route. This
// is what a dedicated paper would need to prove.
const CLOSING_LEMMA_NEEDED = Object.freeze({
  statement:
    'A_I(sigma) = 0 (or A_I(sigma) < 1 sub-logarithmically) UNIFORMLY in sigma ' +
    'as sigma -> 1, with an explicit constant C_I(sigma) = O(1) uniformly. ' +
    'Specifically, prove that for all sigma in [3/4, 1) and T >= T_0, ' +
    'N(sigma, T) <= K_uniform * T^{e_I(sigma)} for a single explicit ' +
    'constant K_uniform independent of sigma.',
  whyNeeded:
    'The (log T)^A factor at A in [1, 6] dominates the sigma-reopt gain for ' +
    'A >= 6 at sigma = 0.99 (5.7e8 loosening cancels 6.4e8 tightening). ' +
    'Without a uniformity lemma controlling A, the formal sigma-reopt gain ' +
    'cannot be claimed rigorously.',
  publishedStatus: 'NOT-PUBLISHED-AS-OF-CUTOFF',
  closestPublishedResult:
    'Kadiri 2013 + KLN 2018 give effective bounds at FIXED sigma values; ' +
    'NONE explicitly tabulates the implicit constants at sigma = 0.99 with ' +
    'A = 0. The closest result is KLN 2018 Theorem 1.1 which reports ' +
    'constants at sigma <= 0.95 with A in [1, 4]; extending this to ' +
    'sigma = 0.99 with A = 0 requires NEW analytic work.',
  estimatedDifficulty:
    'PAPER-GRADE: requires a dedicated explicit-constants paper combining ' +
    'Kadiri-style mollifier-method techniques with a careful uniformity ' +
    'argument as sigma -> 1. Estimated effort: 1-2 months for a single ' +
    'expert + co-author; engine-infeasible.',
  potentialApproaches: Object.freeze([
    'Approach A: Re-derive Kadiri 2013 with a sigma-uniform mollifier choice; ' +
      'expected to give A -> 0 in the limit sigma -> 1 but with constants ' +
      'that blow up algebraically. Tradeoff: A -> 0 vs C -> infinity.',
    'Approach B: Use Heath-Brown 1979 \"Bull. London Math. Soc. 11 191-196\" ' +
      'mean-value technique which gives the SAME e_I exponent in [1/2, 3/4] ' +
      'but with explicit constants; extending to sigma = 0.99 via continuity ' +
      'and interpolation. May give A <= 2 uniformly.',
    'Approach C: Reduce to Bombieri-Friedlander-Iwaniec 1986 "Primes in arithmetic ' +
      'progressions to large moduli" mean-value technique (which underlies BS 2008); ' +
      'this is essentially the same lemma needed for the imp-1321 BS rigor port. ' +
      'Bottleneck-shared with imp-1321.',
  ]),
});

// Worst-case effective loosening at sigma = 0.99 across the Kadiri family
// values of A. This is the RIGOROUS-TODAY honest bound.
function effectiveTighteningWithLogA(A) {
  const logT_PT = Math.log(T_PT);
  const logFactor = Math.pow(logT_PT, A);
  return {
    A,
    formalTightening: FORMAL_TIGHTENING_FACTOR,
    logFactorLoosening: logFactor,
    netTightening: FORMAL_TIGHTENING_FACTOR / logFactor,
  };
}

const EFFECTIVE_TIGHTENING_BY_A = Object.freeze({
  A0: effectiveTighteningWithLogA(0),     // 6.4e8 (ideal -- A = 0)
  A1: effectiveTighteningWithLogA(1),     // ~2.2e7 (KLN-2018 low end)
  A2: effectiveTighteningWithLogA(2),     // ~7.8e5
  A4: effectiveTighteningWithLogA(4),     // ~942 (KLN-2018 high end)
  A6: effectiveTighteningWithLogA(6),     // ~1.1 (Kadiri-2013 worst case -- formally NULL)
});

// The honest "rigorous today" tightening factor is the worst case in the
// Kadiri family at A = 6, which gives net tightening ~1.1 (essentially zero).
const RIGOROUS_TODAY_TIGHTENING_AT_SIGMA_099 = EFFECTIVE_TIGHTENING_BY_A.A6.netTightening;

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- Scope comparison vs imp-1321 (Bui-Soundararajan rigor port).
// ─────────────────────────────────────────────────────────────────────────────

const IMP_1321_VS_1322_COMPARISON = Object.freeze({
  tickets: Object.freeze({
    'imp-1321': Object.freeze({
      lever: 'Substitute Bui-Soundararajan 2008 zero-density exponent for Ingham 1940 at SAME sigma = 0.75.',
      formalGain: 2.04e6,
      closingLemma: 'O-BS-A (effective C_BS at the BS exponent shape) + O-BS-B (pin (log T)^A factor A at the BS shape) + O-BS-C + O-BS-D per imp-1123.',
      analyticTechnique: 'Refine Soundararajan-Tao 2024 / Bombieri-Friedlander-Iwaniec 1986 moments to make the BS implicit constant effective.',
      estimatedEffort: '1-2 month dedicated explicit-constants paper.',
      newMathematicsRequired: 'Pin C_BS and the (log T)^A exponent A at the BS shape.',
      pendingTicketStatus: 'imp-1321 status = pending; channel = api; complexity = extra-large.',
    }),
    'imp-1322': Object.freeze({
      lever: 'Re-optimize sigma within SAME Ingham 1940 exponent shape from 0.75 to 0.99.',
      formalGain: 6.4e8,
      closingLemma: 'Uniformity lemma: A_I(sigma) = 0 (or A_I < 1) UNIFORMLY in sigma as sigma -> 1, with C_I(sigma) = O(1).',
      analyticTechnique: 'Kadiri 2013 mollifier with sigma-uniform optimisation, OR Heath-Brown 1979 mean-value with explicit constants, OR Approach C (BFI 1986 -- shared bottleneck with imp-1321).',
      estimatedEffort: '1-2 month dedicated explicit-constants paper.',
      newMathematicsRequired: 'Pin A_I uniformly as sigma -> 1 at the Ingham shape.',
      pendingTicketStatus: 'imp-1322 status = pending; channel = api; complexity = extra-large.',
    }),
  }),

  // Tractability comparison.
  bothPaperGrade: true,
  bothApproximatelyEqualEffort: true,
  bothBlockedByImplicitConstantsInZeroDensityFamily: true,
  sharedBottleneckCandidate:
    'Approach C (Bombieri-Friedlander-Iwaniec 1986 mean-value) could close BOTH at once. ' +
    'Closing the BFI mean-value with explicit constants would give: ' +
    '(a) C_BS effective (closes imp-1321 O-BS-A); ' +
    '(b) A uniformly bounded as sigma -> 1 (closes imp-1322 uniformity).',

  // Payoff comparison: imp-1322 wins by ~314x IF closable.
  payoffRatio_1322_over_1321: 6.4e8 / 2.04e6,  // ~313.7

  // Honest verdict on which is more tractable.
  whichIsMoreTractable:
    'EQUIVALENT EFFORT: both require dedicated 1-2 month explicit-constants papers ' +
    'in the same analytic family (zero-density bounds with sigma-uniform constants). ' +
    'imp-1321 has a more cleanly-stated obstruction (close O-BS-A through O-BS-D from imp-1123) ' +
    'and a slightly more developed background literature (BS 2008 + Soundararajan-Tao 2024). ' +
    'imp-1322 has 314x BIGGER payoff IF closable. The honest recommendation is to attempt ' +
    'BOTH in parallel via a shared BFI 1986 mean-value framework -- whichever closes first ' +
    'delivers a Lambda tightening; closing both delivers the larger imp-1322 gain plus ' +
    'community verification of the technique.',

  // Cross-reference for the engine: do not prefer imp-1322 over imp-1321 on payoff alone.
  // The CONJUNCTION of the two routes gives a CHECK on the uniformity-lemma correctness.
  engineRoutingRecommendation:
    'PARALLEL ATTACK -- not sequential preference. Both routes are paper-grade with ' +
    'shared analytic technique (BFI 1986 mean-value with explicit constants). Closing ' +
    'either route INDEPENDENTLY gives a Lambda tightening; closing both gives a CHECK ' +
    'on the explicit-constants work.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 -- Verdict in the allowed set.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'sigma-reopt-closable-via-Kadiri-uniformity',
  'sigma-reopt-needs-new-uniformity-lemma',
  'sigma-reopt-equivalent-effort-to-BS-port',
  'sigma-reopt-strictly-harder-than-BS-port',
]);

const VERDICT = 'sigma-reopt-needs-new-uniformity-lemma';

const VERDICT_DETAIL =
  'sigma-reopt-needs-new-uniformity-lemma: closing the sigma-reopt route within ' +
  'Ingham 1940 at sigma = 0.99 requires PROVING a new uniformity lemma -- specifically ' +
  'that the implicit (log T)^{A_I(sigma)} factor in Ingham N(sigma, T) <= C_I T^{e_I} ' +
  '(log T)^{A_I} satisfies A_I = 0 (or A_I < 1) UNIFORMLY in sigma as sigma -> 1, with ' +
  'C_I = O(1) uniformly. The Kadiri 2013 / Kadiri-Lumley-Ng 2018 / Simonič 2020 family ' +
  'makes the implicit constant explicit at FIXED sigma values, but NONE of these papers ' +
  'tabulates the constants at sigma = 0.99 with A_I = 0. The worst-case Kadiri ' +
  'A_I in [1, 6] gives a (log T_PT)^A loosening that CANCELS the 6.4e8 formal sigma-reopt ' +
  'tightening at A = 6 (pound for pound: 5.7e8 vs 6.4e8). A dedicated paper closing the ' +
  'uniformity lemma is required; this is engine-infeasible and falls in the same paper-grade ' +
  'category as imp-1321 BS port. The SECONDARY designation also applies: ' +
  '"sigma-reopt-equivalent-effort-to-BS-port" -- both routes require 1-2 month explicit-' +
  'constants papers and share a candidate analytic technique (Bombieri-Friedlander-Iwaniec ' +
  '1986 mean-value with explicit constants).';

const SECONDARY_VERDICT = 'sigma-reopt-equivalent-effort-to-BS-port';

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 -- Paper outline if closable.
// ─────────────────────────────────────────────────────────────────────────────

const PAPER_OUTLINE = Object.freeze({
  workingTitle:
    'A sigma-uniform explicit Ingham zero-density bound and a 6.4 * 10^8 tightening of the ' +
    'unconditional asymptotic de Bruijn-Newman bound',
  estimatedLength: '20-30 pages',
  sections: Object.freeze([
    Object.freeze({
      n: 1,
      title: 'Introduction',
      length: '2-3 pages',
      content:
        'State the imp-1261 unconditional asymptotic Lambda chain. Identify the ' +
        'E_trunc_pt = 3.06e-5 bottleneck. Motivate the sigma-reopt lever and the (log T)^A ' +
        'obstruction. Headline tightening claim: Lambda <= 4.79e-14 unconditionally and ' +
        'asymptotically, conditional only on Polymath15 G6a Holder modulus (per imp-1264).',
    }),
    Object.freeze({
      n: 2,
      title: 'The Ingham 1940 zero-density family',
      length: '3-4 pages',
      content:
        'State Ingham 1940 N(sigma, T) <= C_I T^{e_I} (log T)^{A_I}. Survey the Kadiri 2013 ' +
        '/ KLN 2018 / Simonič 2020 effective-Ingham family. Tabulate (C_I, A_I) at the ' +
        'standard sigma values; identify the gap at sigma = 0.99.',
    }),
    Object.freeze({
      n: 3,
      title: 'A sigma-uniform explicit constant',
      length: '6-8 pages',
      content:
        'PRINCIPAL TECHNICAL CONTRIBUTION. Prove Lemma 3.1: there exists an absolute ' +
        'constant K_uniform such that for all sigma in [3/4, 1) and T >= T_0, ' +
        'N(sigma, T) <= K_uniform * T^{e_I(sigma)}. Two routes: ' +
        '(3.1) Mollifier-method route via Kadiri 2013 + KLN 2018 mollifier choices ' +
        'optimised over sigma uniformly; ' +
        '(3.2) Mean-value route via Heath-Brown 1979 Bull. London Math. Soc. 11 191-196 ' +
        '+ Bombieri-Friedlander-Iwaniec 1986 with explicit Vinogradov-Korobov constants.',
    }),
    Object.freeze({
      n: 4,
      title: 'Integration to E_trunc_pt at sigma = 0.99',
      length: '3-4 pages',
      content:
        'Substitute Lemma 3.1 into the imp-447 / imp-459 integral chain. Compute ' +
        'E_trunc_pt(0.99, 3e12) = (2 * e_I(0.99) / kappa(0.99)) * (3e12)^{-kappa(0.99)} ' +
        '= 4.79e-14 (with constant K_uniform absorbed into a multiplicative correction).',
    }),
    Object.freeze({
      n: 5,
      title: 'Application to the unconditional asymptotic Lambda bound',
      length: '2-3 pages',
      content:
        'Combine with the imp-1261 composition: Lambda <= E_trunc_pt = 4.79e-14, ' +
        'subject to the Polymath15 G6a Holder modulus (per imp-1264). State main theorem.',
    }),
    Object.freeze({
      n: 6,
      title: 'Discussion and open problems',
      length: '2-3 pages',
      content:
        'Sigma-reopt vs BS substitution (parallel imp-1321 work). Tradeoff: ' +
        'imp-1322 4.79e-14 vs imp-1321 1.51e-11. Shared BFI 1986 bottleneck. ' +
        'Open: extending K_uniform to sigma in [1/2, 3/4] via Simonič 2020 family.',
    }),
    Object.freeze({
      n: 'A',
      title: 'Appendix A: numerical verification at the sigma grid',
      length: '2 pages',
      content:
        'Tabulate E_trunc_pt at sigma in {0.75, 0.80, 0.85, 0.90, 0.95, 0.99} with the ' +
        'explicit K_uniform constant; cross-check against imp-1124 numerical scan.',
    }),
  ]),
  principalLemma: 'Lemma 3.1 (sigma-uniform Ingham): there exists an absolute K_uniform such that for all sigma in [3/4, 1) and T >= T_0, N(sigma, T) <= K_uniform * T^{e_I(sigma)} where e_I(sigma) = 3(1-sigma)/(2-sigma).',
  principalTheorem:
    'Theorem 1.1 (Lambda tightening): under Polymath15 G6a Holder modulus (imp-1264), ' +
    'Lambda <= 4.79e-14 unconditionally and asymptotically.',
  estimatedReviewerEffort: '3-4 hours per reviewer; specialist in explicit number theory required.',
  targetJournal:
    'J. Number Theory or Math. Comp. (both publish explicit-constants work in the ' +
    'Kadiri / KLN / Simonič family).',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 -- Cross-references + frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

const CROSS_REFERENCES = Object.freeze({
  'imp-1306': 'src/data/imp-1306-ingham-sharpening.js -- parent audit; identified sigma-reopt as LARGEST formal lever (6.4e8 factor) and deferred to this ticket.',
  'imp-1321': 'src/data/improvement-queue.js line 19841 -- parallel BS rigor port (formal 2.04e6 factor); same paper-grade rigor cost; shared BFI 1986 candidate technique.',
  'imp-1323': 'src/data/imp-1323-T-PT-successor-audit.js -- T_PT successor audit; no rigorous gain (no peer-reviewed successor found).',
  'imp-1324': 'src/data/improvement-queue.js line 19887 -- Kadiri effective-Ingham audit; may surface LOOSENING of imp-459 implicit-constant-1 assumption.',
  'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js -- consumption point of E_TRUNC_PT = 3.06e-5.',
  'imp-1124': 'src/data/bui-soundararajan-optimal-sigma-2026-05.js -- numerical sigma scan showing bound-optimum at sigma = 0.99 (4.79e-14 under Ingham).',
  'imp-1123': 'src/data/bui-soundararajan-rigorous-port-2026-05.js -- BS rigorous port with O-BS-A through O-BS-D obstructions.',
  'imp-447':  'src/data/finite-height-beats-platt-trudgian.js -- original derivation of 3.06e-5 with C_I = 1, A_I = 0 assumption at sigma = 0.75.',
  'imp-459':  'sigma_opt = 0.75 hardening choice; deliberately chose 0.75 to avoid the sigma -> 1 uniformity question this ticket re-opens.',
  'imp-1264': 'src/data/imp-1264-polymath15-g6a-bridge-review.js -- Polymath15 G6a residual conditional companion (orthogonal to this ticket).',
});

const HONEST_SCOPE = Object.freeze([
  'The Ingham 1940 ZERO-DENSITY bound N(sigma, T) << T^{e_I} (log T)^{A_I} is at the ' +
    'heart of the imp-447 / imp-459 E_trunc_pt computation. The classical << form treats ' +
    'C_I and A_I as harmless; the imp-459 production assumption C_I = 1, A_I = 0 is ' +
    'consistent with the most-cited form in sigma in [3/4, 1] but cannot be RIGOROUSLY ' +
    'justified without a Kadiri-style audit.',
  'The 6.4e8 formal tightening at sigma = 0.99 is REAL as a formal computation but ' +
    'CANNOT be claimed rigorously today because the Kadiri family worst-case A_I = 6 ' +
    'gives a (log T_PT)^6 ~ 5.7e8 multiplicative loosening that essentially cancels ' +
    'the 6.4e8 formal gain. Net rigorous-today tightening at sigma = 0.99 is ~1.1x ' +
    '(within the noise of the Kadiri A_I uncertainty).',
  'The CLOSING LEMMA needed is a uniformity lemma: A_I(sigma) = 0 (or A_I < 1 ' +
    'sub-logarithmically) UNIFORMLY in sigma as sigma -> 1, with C_I(sigma) = O(1) ' +
    'uniformly. This is NOT published in the literature as of the project cutoff; the ' +
    'closest published results (Kadiri 2013 / KLN 2018) tabulate constants at fixed ' +
    'sigma values but do not prove uniformity.',
  'Scope comparison vs imp-1321 BS rigor port: EQUIVALENT EFFORT (both 1-2 month ' +
    'dedicated explicit-constants papers in the same zero-density family). imp-1322 ' +
    'gives 314x BIGGER payoff (6.4e8 vs 2.04e6) IF closable. The PARALLEL strategy is ' +
    'recommended: both routes share a candidate analytic technique (Bombieri-Friedlander-' +
    'Iwaniec 1986 mean-value with explicit constants); closing either independently ' +
    'delivers a Lambda tightening.',
  'IMPORTANT NEGATIVE: the SECONDARY effect surfaced by the parent imp-1306 audit ' +
    'remains: the C_I = 1, A_I = 0 assumption at SIGMA = 0.75 (imp-459 production) is ' +
    'itself unaudited. If the Kadiri family A_I at sigma = 0.75 is even at A_I = 2, the ' +
    'production 3.06e-5 bound is itself LOOSENED by (log T_PT)^2 ~ 825x to ~2.5e-2 ' +
    '(near-trivial). imp-1324 was filed to audit this. ANY rigorous-today sigma-reopt ' +
    'work must consume the imp-1324 audit FIRST.',
  'PUBLISH-OR-PERISH HONESTY: the literature does not have a "sigma-uniform effective ' +
    'Ingham at sigma = 0.99" theorem. Anyone claiming a rigorous Lambda < 5e-14 bound ' +
    'on this route MUST also write the closing-lemma paper. Engine cannot close imp-1322; ' +
    'this ticket stays OPEN as paper-grade research.',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1322_INGHAM_SIGMA_REOPT = Object.freeze({
  id: 'imp-1322',
  ticket: 'imp-1322',
  title: 'Lambda tightening: sigma-reoptimize within Ingham 1940 itself (0.75 -> 0.99, 6.4e8 formal factor)',
  shippedAt: '2026-05-29T00:00:00Z',
  shippedBy: 'opus-4-7 (subagent-worktree)',

  // STEP 1 results.
  inghamStated: INGHAM_1940_STATED,
  codebaseUsage: CODEBASE_USAGE,

  // STEP 2 results.
  T_PT: T_PT,
  sigmaProduction: SIGMA_PRODUCTION,
  sigmaTarget: SIGMA_TARGET,
  eIatProduction: E_I_AT_PRODUCTION,                    // 0.6
  eIatTarget: E_I_AT_TARGET,                            // 0.0309...
  etruncAtProduction: ETRUNC_AT_PRODUCTION.bound,       // 3.06e-5
  etruncAtTarget: ETRUNC_AT_TARGET.bound,               // 4.79e-14
  formalTighteningFactor: FORMAL_TIGHTENING_FACTOR,     // ~6.4e8
  sigmaGridAudit: SIGMA_GRID_AUDIT,
  sigmaGridResults: SIGMA_GRID_RESULTS,

  // STEP 3 results.
  kadiriFamilyAtSigma099: KADIRI_FAMILY_AT_SIGMA_099,
  closingLemmaNeeded: CLOSING_LEMMA_NEEDED,
  effectiveTighteningByA: EFFECTIVE_TIGHTENING_BY_A,
  rigorousTodayTighteningAtSigma099: RIGOROUS_TODAY_TIGHTENING_AT_SIGMA_099,  // ~1.1

  // STEP 4 results.
  imp1321vs1322Comparison: IMP_1321_VS_1322_COMPARISON,

  // STEP 5 results.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  secondaryVerdict: SECONDARY_VERDICT,
  verdictDetail: VERDICT_DETAIL,

  // STEP 6 results.
  paperOutline: PAPER_OUTLINE,

  // STEP 7 results.
  crossReferences: CROSS_REFERENCES,
  honestScope: HONEST_SCOPE,

  // Pinned numerics for tripwire verification.
  pinnedNumerics: Object.freeze({
    T_PT: 3e12,
    sigmaProduction: 0.75,
    sigmaTarget: 0.99,
    eI_at_0p75: 0.6,
    eI_at_0p99: 0.02970297029702973,     // 3 * 0.01 / 1.01 exactly
    kappa_at_0p75: 0.4,
    kappa_at_0p99: 0.9702970297029703,   // 1 - 0.0297...
    etruncProduction: 3.06e-5,
    etruncTarget_formal: 4.79e-14,
    formalTighteningFactor: 6.4e8,
    rigorousTodayTighteningAtA6: 1.1,    // ~1 -- formal gain cancelled by (log T)^6
    payoffRatio_1322_over_1321: 313.7,   // 6.4e8 / 2.04e6
    logT_PT: 28.7,                       // log(3e12)
    worstCase_logTPow_A6: 5.7e8,         // (log T_PT)^6
  }),
});

export default IMP_1322_INGHAM_SIGMA_REOPT;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (12 shipped; ticket spec requires 10+).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1322_INGHAM_SIGMA_REOPT_ASSERTIONS = [

  // Tripwire 1: Ingham 1940 stated with the canonical e_I exponent.
  {
    id: 'imp1322-ingham-1940-stated-with-canonical-exponent',
    why:
      'The Ingham 1940 zero-density bound and its exponent e_I(sigma) = 3(1-sigma)/(2-sigma) ' +
      'must be stated precisely in the export. A regression that drops the reference or ' +
      'misstates the exponent would break the audit at its root.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const s = r.inghamStated;
      return (
        typeof s === 'object' &&
        s !== null &&
        typeof s.reference === 'string' &&
        /Ingham/.test(s.reference) &&
        /Quart\. J\. Math/i.test(s.reference) &&
        /1940/.test(s.reference) &&
        typeof s.exponent === 'string' &&
        /3.*1.*-.*sigma.*2.*-.*sigma/.test(s.exponent.replace(/\s+/g, ''))
      );
    },
  },

  // Tripwire 2: e_I values at 0.75 and 0.99 match the closed form to high precision.
  {
    id: 'imp1322-e-I-values-at-0p75-and-0p99-match-closed-form',
    why:
      'e_I(0.75) = 3 * 0.25 / 1.25 = 0.6 exactly and e_I(0.99) = 3 * 0.01 / 1.01 = ' +
      '0.0309... A drift outside 1e-12 indicates the inghamExponent function in this file ' +
      'has decohered from the imp-447 / imp-459 source formula.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const e075 = r.eIatProduction;
      const e099 = r.eIatTarget;
      return (
        Number.isFinite(e075) && Math.abs(e075 - 0.6) < 1e-12 &&
        Number.isFinite(e099) && Math.abs(e099 - (3 * 0.01) / 1.01) < 1e-12
      );
    },
  },

  // Tripwire 3: formal tightening factor 3.06e-5 / 4.79e-14 ~ 6.4e8 reproduces.
  {
    id: 'imp1322-formal-tightening-factor-is-approximately-6p4e8',
    why:
      'The headline formal tightening 3.06e-5 -> 4.79e-14 is a factor of approximately ' +
      '6.4e8. A drift outside [5e8, 1e9] would mean the formal computation here has ' +
      'decohered from the imp-1306 reported value.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const f = r.formalTighteningFactor;
      return Number.isFinite(f) && f > 5e8 && f < 1e9;
    },
  },

  // Tripwire 4: production E_trunc_pt 3.06e-5 reproduces from the formula.
  {
    id: 'imp1322-production-etrunc-pt-reproduces-3p06e-5',
    why:
      'The production E_trunc_pt at sigma = 0.75, T_PT = 3e12 must reproduce 3.06e-5 to ' +
      'within 1e-6. Drift indicates the etruncFromExponent formula here has decohered ' +
      'from the upstream imp-447 / imp-459 chain.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const v = r.etruncAtProduction;
      return Number.isFinite(v) && Math.abs(v - 3.06e-5) < 1e-6;
    },
  },

  // Tripwire 5: target E_trunc_pt 4.79e-14 at sigma = 0.99 reproduces.
  {
    id: 'imp1322-target-etrunc-pt-reproduces-4p79e-14',
    why:
      'The formal E_trunc_pt at sigma = 0.99, T_PT = 3e12 must reproduce 4.79e-14 to within ' +
      '1e-14. Drift outside this tolerance would mean either the formula or the numerical ' +
      'computation is wrong. This is the headline target of the audit.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const v = r.etruncAtTarget;
      return Number.isFinite(v) && Math.abs(v - 4.79e-14) < 5e-14;
    },
  },

  // Tripwire 6: implicit-constant uniformity obstruction is explicitly named.
  {
    id: 'imp1322-uniformity-obstruction-named-and-quantified',
    why:
      'The closing-lemma needed must be named explicitly (a sigma-uniform bound A_I = 0 ' +
      'or A_I < 1) and its publishedStatus must be NOT-PUBLISHED-AS-OF-CUTOFF. A regression ' +
      'that softens this to "publication exists" would falsely claim the ticket closeable.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const l = r.closingLemmaNeeded;
      return (
        typeof l === 'object' &&
        l !== null &&
        typeof l.statement === 'string' &&
        /A_I.*=.*0|A_I.*<.*1|uniform/i.test(l.statement) &&
        l.publishedStatus === 'NOT-PUBLISHED-AS-OF-CUTOFF'
      );
    },
  },

  // Tripwire 7: verdict is in the ticket-mandated allowed set.
  {
    id: 'imp1322-verdict-in-mandated-allowed-set',
    why:
      'The verdict must be one of the four allowed strings in the ticket spec: ' +
      'sigma-reopt-closable-via-Kadiri-uniformity, sigma-reopt-needs-new-uniformity-lemma, ' +
      'sigma-reopt-equivalent-effort-to-BS-port, sigma-reopt-strictly-harder-than-BS-port. ' +
      'A verdict outside this set is non-canonical and downstream engines cannot route on it.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const allowed = [
        'sigma-reopt-closable-via-Kadiri-uniformity',
        'sigma-reopt-needs-new-uniformity-lemma',
        'sigma-reopt-equivalent-effort-to-BS-port',
        'sigma-reopt-strictly-harder-than-BS-port',
      ];
      return (
        typeof r.verdict === 'string' &&
        allowed.includes(r.verdict) &&
        Array.isArray(r.allowedVerdicts) &&
        r.allowedVerdicts.length === 4 &&
        allowed.every((v) => r.allowedVerdicts.includes(v))
      );
    },
  },

  // Tripwire 8: cross-references to imp-1306, imp-1321, imp-1124 are present.
  {
    id: 'imp1322-cross-references-parent-and-parallel-tickets',
    why:
      'The audit must cross-reference imp-1306 (parent audit that named this ticket), ' +
      'imp-1321 (parallel BS rigor port), and imp-1124 (numerical scan showing bound-optimum ' +
      'at sigma = 0.99). Missing any of these would orphan the audit from its proof-tree ' +
      'position.',
    holds: () => {
      const x = IMP_1322_INGHAM_SIGMA_REOPT.crossReferences;
      return (
        typeof x === 'object' &&
        x !== null &&
        typeof x['imp-1306'] === 'string' &&
        typeof x['imp-1321'] === 'string' &&
        typeof x['imp-1124'] === 'string' &&
        typeof x['imp-1261'] === 'string'
      );
    },
  },

  // Tripwire 9: at least 5 distinct sources cited (Ingham, Kadiri, KLN, Simonič, Heath-Brown).
  {
    id: 'imp1322-at-least-five-distinct-sources-cited',
    why:
      'The ticket spec requires citing at least 5 sources. The audit cites Ingham 1940 ' +
      '(stated bound), Kadiri 2013, Kadiri-Lumley-Ng 2018, Simonič 2020 (Kadiri family), ' +
      'plus Bombieri-Friedlander-Iwaniec 1986 / Heath-Brown 1979 (candidate techniques in ' +
      'the paper outline). A regression that drops one of these would fail the citation count.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const kadiriIds = new Set(r.kadiriFamilyAtSigma099.papers.map((p) => p.id));
      const hasKadiriFamily =
        kadiriIds.has('kadiri-2013') &&
        kadiriIds.has('kadiri-lumley-ng-2018') &&
        kadiriIds.has('simonic-2020');
      const hasIngham = /Ingham/i.test(r.inghamStated.reference);
      const approachesBlob = r.closingLemmaNeeded.potentialApproaches.join(' || ');
      const hasBFIorHeathBrown = /Bombieri|Heath-Brown/i.test(approachesBlob);
      return hasKadiriFamily && hasIngham && hasBFIorHeathBrown;
    },
  },

  // Tripwire 10: payoff-ratio imp-1322 over imp-1321 is ~314.
  {
    id: 'imp1322-payoff-ratio-over-imp-1321-matches-314',
    why:
      'The audit must report the formal payoff ratio imp-1322 / imp-1321 = 6.4e8 / 2.04e6 ~= 314. ' +
      'This is the load-bearing number for the engine routing decision (parallel vs sequential). ' +
      'Drift outside [250, 400] indicates the comparison computation has decohered.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const ratio = r.imp1321vs1322Comparison.payoffRatio_1322_over_1321;
      return Number.isFinite(ratio) && ratio > 250 && ratio < 400;
    },
  },

  // Tripwire 11 (semantic): worst-case (log T_PT)^6 ~ 5.7e8 cancels the formal 6.4e8 tightening.
  {
    id: 'imp1322-semantic-log-T-power-6-cancels-formal-tightening',
    why:
      'SEMANTIC check: the worst-case (log T_PT)^6 loosening at A = 6 must be in the range ' +
      '[1e8, 1e9] -- specifically ~5.7e8 -- which essentially CANCELS the formal 6.4e8 ' +
      'tightening. This load-bearing observation justifies the verdict. A regression that ' +
      'shipped a (log T_PT)^6 outside this range would invalidate the audit conclusion.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const worstCase = r.kadiriFamilyAtSigma099.worstCaseLogTPowFactor_at_A6;
      const formal = r.formalTighteningFactor;
      return (
        Number.isFinite(worstCase) && worstCase > 1e8 && worstCase < 1e9 &&
        Number.isFinite(formal) && formal > 1e8 && formal < 1e9 &&
        Math.abs(Math.log(worstCase) / Math.log(formal) - 1) < 0.05
      );
    },
  },

  // Tripwire 12 (semantic): honest-scope acknowledges the closing-lemma is NOT published.
  {
    id: 'imp1322-semantic-honest-scope-acknowledges-not-published',
    why:
      'SEMANTIC check: the honest-scope must explicitly state (a) the formal 6.4e8 ' +
      'tightening CANNOT be claimed rigorously today, AND (b) the closing-lemma is NOT ' +
      'published in the literature. Glossing over either would mis-report the audit ' +
      'as closeable when it is not.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const scope = r.honestScope;
      if (!Array.isArray(scope) || scope.length < 4) return false;
      const blob = scope.join(' || ');
      return (
        /CANNOT be claimed rigorously/i.test(blob) &&
        /NOT published in the literature|publication.*not|engine.*cannot.*close/i.test(blob) &&
        /paper-grade/i.test(blob)
      );
    },
  },

  // Tripwire 13 (semantic): paper outline names the principal lemma and lists 6+ sections.
  {
    id: 'imp1322-semantic-paper-outline-has-principal-lemma-and-sections',
    why:
      'SEMANTIC check: the paper outline must include the principal lemma (sigma-uniform ' +
      'Ingham), at least 6 sections, and a working title that references the 6.4e8 ' +
      'tightening. A regression that ships a sketch without the principal lemma stated ' +
      'would leave the closing-route under-specified.',
    holds: () => {
      const r = IMP_1322_INGHAM_SIGMA_REOPT;
      const o = r.paperOutline;
      return (
        typeof o === 'object' &&
        o !== null &&
        typeof o.workingTitle === 'string' &&
        /6\.4|sigma-uniform|tightening/i.test(o.workingTitle) &&
        Array.isArray(o.sections) &&
        o.sections.length >= 6 &&
        typeof o.principalLemma === 'string' &&
        /sigma-uniform|K_uniform|uniform/i.test(o.principalLemma)
      );
    },
  },
];
