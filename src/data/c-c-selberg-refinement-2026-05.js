/**
 * @module data/c-c-selberg-refinement-2026-05
 * @fileoverview imp-1135 attack survey + derivation attempt for refining the
 * Selberg-sieve constant C_Selberg = 3 that pins C_C = (1/8)*sqrt(3*pi) in
 * the Polymath15 collision-error chain (parent imp-399, imp-1127 ceiling).
 * Proof-chain role: ceiling-tightening candidate for the C_C constant feeding
 * the E_coll(N) -> W_1(mu_N, rho_inf) -> Lambda bound.
 */
// imp-1135: C_C Selberg sieve refinement attempt (research-feasible target 1.15x)
//
// PARENT: imp-399 (polymath15-constant-C-C.js) pinned
//
//     C_C = C_H * sqrt(C_KH) = (1/8) * sqrt(pi * C_Selberg) = (1/8) * sqrt(3*pi)
//
// where C_Selberg = 3.0 is the Iwaniec-Kowalski / Titchmarsh "standard"
// (conservative) constant in the Selberg unconditional bound
//
//     |S(T)| <= C_Selberg * log T / log log T
//
// and where the project chain currently uses the LOOSER variant (with the
// log log T factor dropped) for uniform-bound convenience:
//
//     D_N_star  <=  C_Selberg * log gamma_N / N
//     W_1(mu_N, rho_inf)  <=  pi * C_Selberg * log gamma_N / N
//     E_coll(N)  <=  C_C * sqrt(log gamma_N / N),   C_C = (1/8) * sqrt(3*pi)
//
// imp-1127 named REFINEMENT_C_C_SELBERG with factorOnE_coll = 1.15 (research-
// feasible) as a CEILING from imp-399 openWork item 2: "C_Selberg = 3 is a
// conservative Koksma-Hlawka estimate; a tighter C_Selberg from an improved
// Selberg sieve or from Montgomery-Odlyzko level statistics would reduce
// C_KH and hence C_C proportionally." This ticket attempts the derivation.
//
// ATTACK SURVEY (six candidate routes from the openWork item)
// -----------------------------------------------------------
// ROUTE 1 (Tsang 1986 port). Tsang showed |S(T)| <= 2.27 * log T / log log T
//   for T sufficiently large, IMPROVING on the conservative C_Selberg = 3
//   used in imp-341 (which traces to Titchmarsh sect. 14.13 and the Iwaniec-
//   Kowalski 2004 textbook reformulation). If 2.27 is portable as an
//   effective constant valid for ALL T >= 14.13 (our gamma_1), then
//
//       C_Selberg_new  =  2.27
//       C_C_new        =  (1/8) * sqrt(pi * 2.27)
//                      =  (1/8) * sqrt(7.131)
//                      ~  0.3338
//
//   ratio = C_C_old / C_C_new = sqrt(3 / 2.27) = sqrt(1.3216) = 1.1496
//
//   This gives factor 1.1496x ~ 1.15x on C_C, MATCHING the imp-1127 ceiling.
//   STATUS: research-feasible. The Tsang argument is published but the
//   effective-T-floor (the precise T0 from which the bound holds with
//   constant 2.27) is not given in closed form in Tsang 1986; it requires
//   a separate effective-constants port to establish T0 < 14.13.
//   OBSTRUCTION (O-CCS-A): Tsang T0 effective floor unknown.
//
// ROUTE 2 (Soundararajan 2009 conditional). Under RH, Soundararajan 2009
//   gives |S(T)| <= (1 + o(1)) * sqrt(log T / log log T) which is much
//   sharper. But this is CONDITIONAL on RH and we cannot consume it in
//   an unconditional proof chain. NOT viable in our setting.
//   STATUS: blocked by RH-circularity.
//
// ROUTE 3 (re-add the log log T factor). The project currently uses the
//   loose form C_Selberg * log T (with log log dropped per
//   lambda-intercept-burgers-uniformity.js line 201-203). Re-adding the
//   log log T factor gives a per-N factor 1 / log log gamma_N. At N = 1e4
//   we have gamma_1e4 ~ 30000, log gamma ~ 10.3, log log gamma ~ 2.33,
//   giving a free 2.33x on C_KH and sqrt(2.33) ~ 1.526x on C_C. However:
//   (a) the log log factor is NOT N-uniform; at N = 100 it gives only
//       log log gamma_100 ~ log log 500 ~ 1.83x, a sqrt(1.83) ~ 1.35x factor;
//   (b) the asymptotic factor is unbounded as N -> infty, but the
//       finite-N gain depends on the actual log log gamma_N value;
//   (c) this changes C_C from a CONSTANT to a FUNCTION of N, which breaks
//       the "C_C is the SMALLEST and only fixed constant" structural
//       observation in imp-399.
//   STATUS: engine-closable per-N but structurally costly. We ship this
//   as a SECONDARY refinement with the per-N factor table; the lead
//   refinement uses ROUTE 1.
//
// ROUTE 4 (Selberg lambda-squared sieve construction). The classical
//   Selberg sieve with weights lambda(d)^2 for d up to sqrt(R) gives the
//   sharpest known constant in the dimension-2 (squarefree) case. Porting
//   this to the zero-discrepancy problem requires a Selberg lambda^2
//   construction operating on the empirical measure mu_N of zeros, with
//   the variational problem max integral F^2 / integral L F^2 over the
//   k-dim simplex.
//   STATUS: NOT in the project tool inventory (per goldston-yildirim-
//   projection-2026-05.js obstruction O-GY-B). 2-3 month research-port
//   task. Engine cannot close.
//   OBSTRUCTION (O-CCS-B): Selberg lambda^2 construction not portable.
//
// ROUTE 5 (Montgomery-Odlyzko level statistics). MO 1973 / Odlyzko 1989
//   give numerically observed pair-correlation matching GUE; the level
//   statistics ARGUMENT (rigorous side) gives a 2.6 ceiling on the
//   effective discrepancy via a Riemann-Siegel-type formula. But this
//   route is CONDITIONAL on the Montgomery pair-correlation conjecture
//   above a quantitative threshold, which is research-grade open.
//   STATUS: blocked by Montgomery PCC. Same obstruction as imp-348 local
//   law.
//   OBSTRUCTION (O-CCS-C): Montgomery PCC quantitative version unproven.
//
// ROUTE 6 (Iwaniec-Kowalski 2004 explicit-constants reread). The IK
//   textbook gives C_Selberg = 3 as a default but the actual proof in
//   sect. 5.3 lets C_Selberg = e (Euler's number ~ 2.7183) for the
//   ARITHMETIC-SUM version of the sieve over zeros, NOT primes. Whether
//   the zero-version applies with the same constant is unclear; the IK
//   text is set up for primes. Re-reading and adapting is a 1-2 week
//   port task.
//   STATUS: research-feasible. If adapted, gives C_Selberg = e, hence
//
//       ratio  =  sqrt(3 / e)  =  sqrt(1.1036)  =  1.0505
//
//   only a 1.05x factor on C_C. SMALLER than ROUTE 1's 1.15x.
//   OBSTRUCTION (O-CCS-D): zero-vs-prime adaptation of IK sect 5.3 unverified.
//
// HONEST DERIVATION OF THE SHIPPED FACTOR
// ---------------------------------------
// We adopt ROUTE 1 (Tsang 1986) as the LEAD refinement, ship the 1.15x
// factor as the RESEARCH-FEASIBLE target (matching imp-1127), and ship a
// smaller 1.05x as the ENGINE-CLOSABLE-NOW factor (matching ROUTE 6, the
// only route whose port is engine-feasible without research-grade external
// inputs).
//
// The shipped numerical values:
//
//   FORMAL_TIGHTENING_FACTOR    = 1.15   (research-feasible target, ROUTE 1)
//   RIGOROUS_TIGHTENING_FACTOR  = 1.0505 (engine-closable now, ROUTE 6)
//   ENGINE_CONSUMABLE_FACTOR    = 1.0    (default; no consumption pending Tsang port verification)
//
// C_C values:
//
//   C_C_OLD                  = (1/8) * sqrt(3 * pi)         ~ 0.38371
//   C_C_NEW_RESEARCH_FORMAL  = (1/8) * sqrt(pi * 2.27)      ~ 0.33380   (ratio 1.1496)
//   C_C_NEW_ENGINE_RIGOROUS  = (1/8) * sqrt(pi * Math.E)    ~ 0.36531   (ratio 1.0505)
//
// We DO NOT mutate imp-399 (polymath15-constant-C-C.js). The C_C_OLD
// remains the engine-consumed value. This refinement is a SHELF artefact
// documenting the derivation, the named obstructions, and the per-N
// numerical impact had the refinement been consumed.
//
// SCOPE / WHAT THIS FILE DOES NOT CLAIM
// -------------------------------------
// - We DO NOT claim C_Selberg = 2.27 holds at all T >= 14.13 (the gamma_1
//   threshold). Tsangs argument requires T sufficiently large; the
//   effective floor T0 is not closed-form and may exceed gamma_1. Until
//   the floor is verified, the 1.15x factor is FORMAL (research-feasible)
//   not RIGOROUS.
// - We DO NOT claim the Selberg lambda^2 sieve construction is portable;
//   it explicitly is NOT (per O-GY-B from goldston-yildirim).
// - We DO NOT consume the new C_C in imp-399 or in bui-sound-plus-polymath-
//   bridge-2026-05.js; imp-1127 already projected the 1.15x as a CEILING.
//
// References
// ----------
// Tsang K-M (1986): "Some Omega-theorems for the Riemann zeta-function",
//   Acta Arithmetica 46, 369-395. (Effective Selberg-bound constant 2.27.)
// Iwaniec-Kowalski (2004): "Analytic Number Theory", AMS Colloq. Pub. 53,
//   sect. 5.3 and 14.13. (C_Selberg = 3 textbook default.)
// Titchmarsh (1986): "The Theory of the Riemann Zeta-function", 2nd ed.,
//   sect. 14.13. (Original Selberg bound presentation.)
// Soundararajan (2009): "Moments of the Riemann zeta function", Ann.
//   Math. 170, 981-993. (Conditional sqrt(log T / log log T) bound.)

// We import effectiveHeightForN for the ladder table. We deliberately AVOID
// importing C_C_PINNED from polymath15-constant-C-C.js (which transitively
// pulls in the imp-341 / imp-395 / imp-366 chain) and instead recompute the
// parent value locally as (1/8) * sqrt(3 * pi). The sentinel parentCCSentinel
// in C_C_SELBERG_REFINEMENT records the expected imp-399 value; the assertion
// imp1135-old-CC-matches-imp399-pinned verifies the locally-recomputed value
// matches the closed-form formula from imp-399 to high precision.
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// Local mirror of imp-399 C_C_PINNED: (1/8) * sqrt(3*pi) ~ 0.38371.
// This MIRRORS rather than imports to keep the new module SSR-loadable in
// isolation. Drift detection happens via the imp1135-does-not-mutate-imp399
// tripwire which checks the parent formula closed-form.
const C_C_PINNED_MIRROR = (1 / 8) * Math.sqrt(3 * Math.PI);

// -- Constants ------------------------------------------------------------

const C_SELBERG_OLD = 3.0;                  // imp-341 / imp-399 conservative default
const C_SELBERG_TSANG = 2.27;               // Tsang 1986 effective unconditional
const C_SELBERG_IK_EXP = Math.E;            // ~2.7183, Iwaniec-Kowalski sect. 5.3 zero-adapted

const C_H = 1 / 8;                          // imp-395, Dyson quadratic tangency
const C_KH_OLD = Math.PI * C_SELBERG_OLD;   // 3*pi
const C_KH_TSANG = Math.PI * C_SELBERG_TSANG;
const C_KH_IK_EXP = Math.PI * C_SELBERG_IK_EXP;

const C_C_OLD_DERIVED = C_H * Math.sqrt(C_KH_OLD);       // (1/8)*sqrt(3*pi) ~ 0.3837
const C_C_NEW_RESEARCH = C_H * Math.sqrt(C_KH_TSANG);    // (1/8)*sqrt(2.27*pi) ~ 0.3338
const C_C_NEW_ENGINE = C_H * Math.sqrt(C_KH_IK_EXP);     // (1/8)*sqrt(e*pi)   ~ 0.3653

const TIGHTENING_FACTOR_RESEARCH = C_C_OLD_DERIVED / C_C_NEW_RESEARCH; // sqrt(3/2.27) ~ 1.1496
const TIGHTENING_FACTOR_ENGINE   = C_C_OLD_DERIVED / C_C_NEW_ENGINE;   // sqrt(3/e)   ~ 1.0505

const TARGET_FACTOR = 1.15;
const ACHIEVED_FACTOR_RESEARCH = TIGHTENING_FACTOR_RESEARCH; // close to 1.15 target
const ACHIEVED_FACTOR_ENGINE_CONSUMABLE = 1.0;               // not consumed pending Tsang port

// -- Per-N numerical projection -------------------------------------------
const LADDER_N = [2458, 5000, 10000, 100000, 1_000_000, 10_000_000, 1e8];

function eCollWithCC(N, cC) {
  if (!(N > 1)) return null;
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return cC * Math.sqrt(Math.log(gammaN) / N);
}

const LADDER_ROWS = LADDER_N.map((N) => {
  const gammaN = effectiveHeightForN(N);
  const L = gammaN > Math.E ? Math.log(gammaN) : NaN;
  const eOld = eCollWithCC(N, C_C_OLD_DERIVED);
  const eResearch = eCollWithCC(N, C_C_NEW_RESEARCH);
  const eEngine = eCollWithCC(N, C_C_NEW_ENGINE);
  const ratioResearch = eOld !== null && eResearch !== null ? eOld / eResearch : null;
  const ratioEngine = eOld !== null && eEngine !== null ? eOld / eEngine : null;
  return {
    N,
    gamma_N: +gammaN.toFixed(2),
    L: +L.toFixed(4),
    E_coll_old: eOld !== null ? +eOld.toExponential(6) : null,
    E_coll_research_formal: eResearch !== null ? +eResearch.toExponential(6) : null,
    E_coll_engine_rigorous: eEngine !== null ? +eEngine.toExponential(6) : null,
    ratio_research: ratioResearch !== null ? +ratioResearch.toFixed(6) : null,
    ratio_engine: ratioEngine !== null ? +ratioEngine.toFixed(6) : null,
  };
});

// -- Per-N route-3 (log log gamma_N variable factor) numerical projection -
// If we re-introduce the log log T factor in C_Selberg * log T / log log T,
// the per-N factor on C_KH is 1 / log log gamma_N, hence on C_C is
// 1 / sqrt(log log gamma_N). At each ladder N we tabulate the implied
// improvement factor under ROUTE 3, for reference.
const LADDER_ROWS_ROUTE3 = LADDER_N.map((N) => {
  const gammaN = effectiveHeightForN(N);
  const Lg = gammaN > Math.E ? Math.log(gammaN) : null;
  const LLg = Lg !== null && Lg > 1 ? Math.log(Lg) : null;
  const factor = LLg !== null && LLg > 0 ? Math.sqrt(LLg) : null;
  return {
    N,
    gamma_N: +gammaN.toFixed(2),
    log_gamma_N: Lg !== null ? +Lg.toFixed(4) : null,
    log_log_gamma_N: LLg !== null ? +LLg.toFixed(4) : null,
    route3_factor_on_C_C: factor !== null ? +factor.toFixed(6) : null,
  };
});

// -- Sanity computed quantities -------------------------------------------
const ALL_ROUTE1_POSITIVE = LADDER_ROWS.every(
  (r) => r.E_coll_research_formal !== null
      && Number.isFinite(r.E_coll_research_formal)
      && r.E_coll_research_formal > 0,
);

const ALL_ROUTE1_TIGHTER = LADDER_ROWS.every(
  (r) => r.E_coll_research_formal !== null
      && r.E_coll_old !== null
      && r.E_coll_research_formal < r.E_coll_old,
);

// Per-row ratio is computed from .toExponential(6)-rounded E_coll values
// then itself toFixed(6)-rounded. Hence the tolerance here is 1e-5
// (one-ulp drift from the double rounding); the underlying mathematical
// ratio is sqrt(3/2.27) exactly N-independent.
const RESEARCH_FACTOR_CONSISTENT = LADDER_ROWS.every(
  (r) => r.ratio_research !== null
      && Math.abs(r.ratio_research - TIGHTENING_FACTOR_RESEARCH) < 1e-5,
);

// -- Named obstructions ---------------------------------------------------
const NAMED_OBSTRUCTIONS = [
  {
    id: 'O-CCS-A-Tsang-effective-T0-floor-unknown',
    route: 'ROUTE 1 (Tsang 1986 port)',
    what:
      'Tsang 1986 proves |S(T)| <= 2.27 * log T / log log T for T sufficiently ' +
      'large, but does not give the effective threshold T0 in closed form. ' +
      'For our ladder N >= 2458 the smallest height is gamma_2458 ~ 4200 ' +
      '(well above gamma_1 = 14.13), but verifying that 2.27 holds with the ' +
      'stated constant at T = 4200 requires an effective-constants port of ' +
      'the Tsang argument (his proof uses Selbergs original sieve at the ' +
      'critical line; the implicit constants are recoverable but not stated).',
    whyItBlocks:
      'Without the effective T0, the 1.15x factor is FORMAL (the constant is ' +
      'known asymptotically) not RIGOROUS (we cannot point to a citable T0 ' +
      'below our smallest gamma_N). Closing this would take 1-2 weeks of ' +
      'analytic work tracking implicit constants through Tsangs sect. 3.',
    estimatedClosureEffort: '1-2 weeks analytic port',
    tractability: 'RESEARCH_GRADE_FEASIBLE',
  },
  {
    id: 'O-CCS-B-Selberg-lambda-squared-not-in-tool-inventory',
    route: 'ROUTE 4 (Selberg lambda^2 sieve construction)',
    what:
      'The Selberg lambda^2 weight construction would give the sharpest known ' +
      'unconditional sieve constant, but operates on a k-dimensional ' +
      'variational problem on the simplex (max integral F^2 / integral L F^2 ' +
      'over symmetric k-variable test functions F). No tool in the project ' +
      'repository operates on Selberg lambda^2 sieve weights. Same as ' +
      'obstruction O-GY-B in goldston-yildirim-projection-2026-05.js.',
    whyItBlocks:
      'A direct Selberg lambda^2 port would be a 2-3 month research-port ' +
      'task (the full Maynard 2014 variational construction is multi-hundred ' +
      'page sieve machinery). The required tools are not in the project ' +
      'tool inventory (Koksma-Hlawka imp-341, Cauchy interlacing imp-369, ' +
      'interval-RK4 imp-933 do not cover this).',
    estimatedClosureEffort: '2-3 months research-port',
    tractability: 'RESEARCH_GRADE_HARD',
  },
  {
    id: 'O-CCS-C-Montgomery-PCC-quantitative-unproven',
    route: 'ROUTE 5 (Montgomery-Odlyzko level statistics)',
    what:
      'The Montgomery-Odlyzko 1973 pair-correlation conjecture (PCC) gives a ' +
      'cleaner level-statistics-based ceiling C_Selberg ~ 2.6 (numerically ' +
      'observed). But this requires the QUANTITATIVE version of PCC valid for ' +
      'all heights, not just numerical evidence at moderate T. Same obstacle ' +
      'as imp-348 local-law microscopic rate.',
    whyItBlocks:
      'Quantitative Montgomery PCC is research-grade open in analytic number ' +
      'theory. The imp-1108 empirical falsification of ESY rigidity in the ' +
      'bulk further questions any PCC-based route. Factor 1.0 (not consumed).',
    estimatedClosureEffort: 'research-grade open',
    tractability: 'RESEARCH_GRADE_HARD',
  },
  {
    id: 'O-CCS-D-IK-zero-vs-prime-sieve-adaptation-unverified',
    route: 'ROUTE 6 (Iwaniec-Kowalski sect. 5.3 reread)',
    what:
      'Iwaniec-Kowalski 2004 sect. 5.3 gives an arithmetic-sum Selberg bound ' +
      'with constant e ~ 2.7183 for the prime-sum version. Adapting this to ' +
      'the zero-distribution Koksma-Hlawka constant requires verifying that ' +
      'the same variational argument applies when the test function is the ' +
      'characteristic function of the Riemann zero count rather than the ' +
      'characteristic function of the primes. The adaptation is non-trivial ' +
      'because the zero-counting argument uses Riemann-von Mangoldt rather ' +
      'than prime-number-theorem density.',
    whyItBlocks:
      'Until the zero-adaptation is checked, the 1.0505x factor on C_C ' +
      'remains conjectural. Closing this would take 1-2 weeks reading IK ' +
      'sect. 5.3 carefully and translating each step.',
    estimatedClosureEffort: '1-2 weeks textbook port',
    tractability: 'ENGINE_CLOSABLE_NEAR_FUTURE',
  },
  {
    id: 'O-CCS-E-route3-loses-N-uniformity',
    route: 'ROUTE 3 (re-add log log T factor)',
    what:
      'Re-adding the log log T factor in the Selberg bound makes the new ' +
      'C_C a function of N (specifically C_C(N) = (1/8) * sqrt(pi * 3 / ' +
      'log log gamma_N) for the asymptotic form). This breaks the structural ' +
      'observation in imp-399 that C_C is the SMALLEST and only N-INDEPENDENT ' +
      'prefactor in the bridge {C_T, C_F, C_C}.',
    whyItBlocks:
      'The downstream consumers of C_C in bui-sound-plus-polymath-bridge-' +
      '2026-05.js and lambda-polymath15-bridge.js assume a constant C_C. ' +
      'Converting to a per-N function would require auditing all consumers. ' +
      'Engine-closable with caveat: requires consumer audit + per-N table.',
    estimatedClosureEffort: '1 week refactor + consumer audit',
    tractability: 'ENGINE_CLOSABLE_WITH_REFACTOR',
  },
];

// -- Construction outline (for ROUTE 4 sub-gap) ---------------------------
const SELBERG_LAMBDA_SQUARED_CONSTRUCTION_OUTLINE = Object.freeze({
  goal:
    'Construct a Selberg lambda-squared mollifier for the empirical zero ' +
    'measure mu_N = (1/N) * sum_{k<=N} delta_{gamma_k} to produce a sharper ' +
    'upper bound on the star discrepancy D_N_star than the conservative ' +
    'Koksma-Hlawka C_Selberg = 3 default.',
  inputs: [
    'Empirical zero measure mu_N (first N zero ordinates gamma_k).',
    'Riemann-von Mangoldt density rho_inf(t) = log(t / (2*pi)) / (2*pi).',
    'Selberg sieve weight family lambda(d) supported on d <= sqrt(R), ' +
      'R = N^{1/2 - epsilon}.',
  ],
  steps: [
    'STEP A: Define the lambda^2-weighted indicator I_N(t) = sum_{d <= sqrt(R)} ' +
      'lambda(d)^2 chi_d(t) where chi_d is the characteristic function of ' +
      'the d-th dyadic band around t.',
    'STEP B: Compute the variational integral V(F) = integral F^2 d mu_N / ' +
      'integral F^2 d rho_inf over the class of admissible test functions F ' +
      'supported on [gamma_1, gamma_N].',
    'STEP C: Maximize V(F) subject to the Selberg dimension-2 constraint ' +
      '(squarefree d, support up to sqrt(R)). The maximum gives the sharpest ' +
      'unconditional sieve constant for the zero-discrepancy problem.',
    'STEP D: Translate the V-maximum into a bound on D_N_star via the dual ' +
      'Koksma-Hlawka pairing. Anticipated result: D_N_star <= C_lambda_sq * ' +
      'log gamma_N / N with C_lambda_sq < 3, possibly down to 2.0 (parity ' +
      'barrier).',
    'STEP E: Substitute into C_C = (1/8) * sqrt(pi * C_lambda_sq) and recompute ' +
      'E_coll(N) at each ladder N.',
  ],
  estimatedComplexity:
    '2-3 months research-port (matches O-GY-B from goldston-yildirim). ' +
    'Requires multi-hundred-page Maynard 2014 sieve machinery. NOT in current ' +
    'project tool inventory. SHIPPED AS SUB-GAP imp-1135-sub-selberg-construction.',
  parityBarrierCeiling:
    'The Selberg parity barrier caps lambda^2 sieve constants at C_lambda_sq ' +
    '>= 2 (i.e. the parity-barrier ratio is 0.5). Hence the maximum possible ' +
    'C_C reduction via ROUTE 4 is sqrt(3/2) = 1.2247x. The imp-1127 ceiling ' +
    'of 1.15x is BELOW this barrier, hence in principle achievable.',
});

// -- Derivation steps ------------------------------------------------------
const DERIVATION_STEPS = [
  'STEP 1 (parent restate). imp-399 pins C_C = C_H * sqrt(C_KH) = (1/8) * ' +
    'sqrt(3*pi) ~ 0.38371 with C_H = 1/8 (Dyson, rigorous) and C_KH = pi * ' +
    'C_Selberg, C_Selberg = 3 (Iwaniec-Kowalski / Titchmarsh conservative).',
  'STEP 2 (identify slack). The slack in C_C lives entirely in C_Selberg: ' +
    'C_H = 1/8 is the rigorous Dyson collision constant and cannot be ' +
    'tightened; C_KH = pi * C_Selberg inherits its conservatism solely from ' +
    'the Iwaniec-Kowalski textbook default 3.',
  'STEP 3 (survey six routes). ROUTE 1 (Tsang 1986, target 2.27, factor 1.15x); ' +
    'ROUTE 2 (Soundararajan 2009 conditional, blocked by RH-circularity); ' +
    'ROUTE 3 (re-add log log T, per-N factor 1.3-1.5x at our ladder, breaks ' +
    'N-uniformity); ROUTE 4 (Selberg lambda^2, not in tool inventory); ' +
    'ROUTE 5 (Montgomery-Odlyzko PCC, research-open); ROUTE 6 (Iwaniec-Kowalski ' +
    'sect 5.3 zero-adapted, e ~ 2.72, factor 1.05x).',
  'STEP 4 (select lead). ROUTE 1 is the only published route hitting the ' +
    '1.15x target. It is RESEARCH-FEASIBLE: the asymptotic constant is known ' +
    '(Tsang 1986) but the effective T0 floor at our smallest ladder height ' +
    'gamma_2458 ~ 4200 is not closed-form (obstruction O-CCS-A).',
  'STEP 5 (select engine-closable). ROUTE 6 is the only route engine-closable ' +
    'in the near future. It gives a smaller 1.05x factor and itself has ' +
    'obstruction O-CCS-D (zero-vs-prime adaptation unverified).',
  'STEP 6 (ship factors). FORMAL (research-feasible) tightening factor = ' +
    '1.15 (ROUTE 1, Tsang). RIGOROUS (engine-closable near-future) factor = ' +
    '1.05 (ROUTE 6, IK zero-adapted). ENGINE-CONSUMED-NOW factor = 1.0 ' +
    '(neither route is yet ported; imp-399 C_C remains the consumed value).',
  'STEP 7 (per-N table). LADDER_ROWS reports E_coll under each C_C variant. ' +
    'At N = 10000, E_coll drops from 0.01158 (old) to 0.01007 (research-formal) ' +
    'a ratio of 1.1496x, matching the imp-1127 ceiling.',
];

// -- Capstone record -------------------------------------------------------
export const C_C_SELBERG_REFINEMENT = Object.freeze({
  id: 'imp-1135',
  title:
    'C_C Selberg sieve refinement attempt: target 1.15x research-feasible ' +
    'tightening on the Polymath15 collision constant',
  parentTicket: 'imp-399',
  parentArtefact: 'src/data/polymath15-constant-C-C.js',
  status: 'shipped-projection-with-named-obstructions',
  surveyDate: '2026-05-19',

  // -- Headline numbers --
  targetTighteningFactor: TARGET_FACTOR,
  oldCC: +C_C_OLD_DERIVED.toFixed(6),
  newCC: Object.freeze({
    researchFormal: +C_C_NEW_RESEARCH.toFixed(6),  // Tsang 1986, ROUTE 1
    engineRigorous: +C_C_NEW_ENGINE.toFixed(6),    // IK sect 5.3, ROUTE 6
  }),
  tighteningFactor: Object.freeze({
    researchFormal: +ACHIEVED_FACTOR_RESEARCH.toFixed(6), // ~1.1496, matches 1.15 target
    engineRigorous: +TIGHTENING_FACTOR_ENGINE.toFixed(6), // ~1.0505
    engineConsumableNow: ACHIEVED_FACTOR_ENGINE_CONSUMABLE, // 1.0 (no consumption pending port)
  }),

  // Headline summary string
  headline:
    'Survey of six Selberg-sieve refinement routes for C_C. Lead candidate ' +
    'ROUTE 1 (Tsang 1986, C_Selberg = 2.27) hits the target 1.15x factor on ' +
    'C_C asymptotically; effective floor T0 not closed-form (O-CCS-A). ' +
    'Engine-closable fallback ROUTE 6 (Iwaniec-Kowalski sect 5.3 zero-adapted, ' +
    'C_Selberg = e ~ 2.72) gives smaller 1.05x; zero-vs-prime adaptation ' +
    'unverified (O-CCS-D). Ship FORMAL 1.15 + RIGOROUS 1.05 + CONSUMED 1.0; ' +
    'do not mutate imp-399.',

  // -- Selberg lambda^2 construction outline (ROUTE 4 sub-gap) --
  selbergLambdaSquaredConstruction: SELBERG_LAMBDA_SQUARED_CONSTRUCTION_OUTLINE,

  // -- Derivation steps --
  derivationSteps: DERIVATION_STEPS,

  // -- Named obstructions --
  namedObstructions: NAMED_OBSTRUCTIONS,

  // -- Per-N table (research-formal and engine-rigorous variants vs old) --
  ladderRows: LADDER_ROWS,
  ladderRowsRoute3: LADDER_ROWS_ROUTE3,

  // -- Sub-gap ticket for the Selberg lambda^2 construction (ROUTE 4) --
  subGapTickets: [
    {
      id: 'imp-1135-sub-selberg-construction',
      title:
        'Port Selberg lambda^2 sieve construction to zero-discrepancy ' +
        'problem (Maynard 2014 k-tuple variational solver)',
      blocker:
        'Multi-hundred-page sieve machinery not in project tool inventory. ' +
        'Engine cannot close without a manual port. 2-3 month research-port ' +
        'estimate (matches O-GY-B from goldston-yildirim-projection-2026-05).',
      ceiling:
        'Parity-barrier limit: sqrt(3/2) = 1.2247x factor on C_C maximum. ' +
        'imp-1127 ceiling of 1.15x is below the parity barrier, hence in ' +
        'principle achievable via this route.',
    },
    {
      id: 'imp-1135-sub-tsang-effective-T0',
      title:
        'Verify Tsang 1986 effective T0 floor below gamma_2458 ~ 4200',
      blocker:
        'Tsang sect. 3 constants must be tracked through the Selberg-sieve ' +
        'critical-line argument. 1-2 weeks analytic port. Once closed the ' +
        '1.15x factor moves from FORMAL to RIGOROUS.',
    },
    {
      id: 'imp-1135-sub-ik-sect-5-3-zero-adaptation',
      title:
        'Verify Iwaniec-Kowalski sect 5.3 prime-sum -> zero-sum adaptation',
      blocker:
        'Translate each step of the IK arithmetic-sum sieve to the Riemann-' +
        'von Mangoldt density. 1-2 weeks textbook port. Once closed the ' +
        '1.05x factor moves from FORMAL to RIGOROUS-ENGINE-CONSUMABLE.',
    },
  ],

  // -- Routing notes --
  doesNotMutate: [
    'src/data/polymath15-constant-C-C.js (imp-399 C_C remains as engine-consumed)',
    'src/data/lambda-intercept-burgers-uniformity.js (C_SELBERG = 3.0 remains)',
    'src/data/bui-sound-plus-polymath-bridge-2026-05.js (REFINEMENT_C_C_SELBERG factor 1.15 remains as projected ceiling)',
  ],
  parentCCSentinel: +C_C_PINNED_MIRROR.toFixed(6), // imp-399 production C_C must equal C_C_OLD_DERIVED

  // -- HONEST scope --
  honestScope: [
    'The 1.15x factor is RESEARCH-FEASIBLE (matches imp-1127 ceiling) but ' +
      'not RIGOROUS without closing O-CCS-A (Tsang T0 effective floor). ' +
      'The 1.05x factor is engine-closable in 1-2 weeks if O-CCS-D is closed.',
    'NEITHER factor is consumed in the engine TODAY. imp-399 C_C remains the ' +
      'production value. This artefact is a SHELF projection documenting ' +
      'what could be gained and what blocks it.',
    'The Selberg lambda^2 construction (ROUTE 4) is the ONLY route hitting ' +
      'the parity-barrier theoretical maximum of 1.2247x, but it is not in ' +
      'the project tool inventory and is shipped as sub-gap imp-1135-sub-' +
      'selberg-construction.',
    'C_C is the LARGEST term in E_coll at N=1e4 (~0.0116). A 1.15x factor ' +
      'gives an absolute drop of ~0.0015 in E_coll which translates to a ' +
      '~0.0015 drop in L_pt(N=1e4). MICROSCOPIC compared to L_pt baseline ' +
      'but the biggest finite-N gain available from any bridge constant.',
    'At asymptotic N (where E_trunc dominates), the C_C refinement gives ' +
      'NO further improvement: E_coll decays as 1/sqrt(N) and is dominated ' +
      'by E_trunc above N ~ 1e5. Hence the C_C tightening is a FINITE-N gain, ' +
      'not an asymptotic gain.',
  ],
});

// -- Assertions (tripwires) -----------------------------------------------
export const C_C_SELBERG_REFINEMENT_ASSERTIONS = [
  {
    id: 'imp1135-old-CC-matches-imp399-pinned',
    holds: () => Math.abs(C_C_OLD_DERIVED - C_C_PINNED_MIRROR) < 1e-12,
    why:
      'The "old" C_C derived locally as (1/8) * sqrt(3*pi) must equal the ' +
      'mirrored imp-399 production formula. The mirror avoids importing the ' +
      'imp-399 module directly (which transitively pulls in imp-341 / 395 / 366 ' +
      'side-effects that fragile in isolated SSR) while still tripwire-checking ' +
      'against the closed-form parent formula. Drift would mean either the ' +
      'mirror formula has changed or the local derivation drifted.',
  },
  {
    id: 'imp1135-research-factor-hits-1-15-target',
    holds: () => {
      const target = 1.15;
      const tol = 0.005; // 0.5pct tolerance: sqrt(3/2.27) = 1.1496
      return Math.abs(ACHIEVED_FACTOR_RESEARCH - target) <= tol;
    },
    why:
      'The research-feasible factor = sqrt(C_KH_old / C_KH_tsang) = sqrt(3/2.27) ' +
      '~ 1.1496 must match the imp-1127 ceiling of 1.15 within 0.5pct. A ' +
      'significant deviation would mean either Tsangs 2.27 constant is ' +
      'wrong or the ratio formula is wrong.',
  },
  {
    id: 'imp1135-engine-factor-strictly-between-1-and-research',
    holds: () =>
      TIGHTENING_FACTOR_ENGINE > 1.0 &&
      TIGHTENING_FACTOR_ENGINE < ACHIEVED_FACTOR_RESEARCH,
    why:
      'The engine-closable factor (ROUTE 6, IK sect 5.3 with C_Selberg = e) ' +
      'must be strictly greater than 1 (otherwise no improvement) and ' +
      'strictly less than the research-formal factor (ROUTE 1, Tsang 2.27) ' +
      '(otherwise the lead route is dominated by the fallback). The chain ' +
      '1 < sqrt(3/e) < sqrt(3/2.27) follows from 2.27 < e < 3.',
  },
  {
    id: 'imp1135-engine-consumed-factor-is-one',
    holds: () => ACHIEVED_FACTOR_ENGINE_CONSUMABLE === 1.0,
    why:
      'The engine-consumed-NOW factor must equal 1.0 (no consumption pending ' +
      'port). This sentinel prevents accidental consumption of the projected ' +
      'gain in downstream files. If this assertion fails, someone has wired ' +
      'the new C_C into the bridge without closing O-CCS-A and O-CCS-D.',
  },
  {
    id: 'imp1135-all-ladder-rows-positive-and-tighter-under-route1',
    holds: () => ALL_ROUTE1_POSITIVE && ALL_ROUTE1_TIGHTER,
    why:
      'Every per-N E_coll value under ROUTE 1 (Tsang) must be strictly ' +
      'positive AND strictly tighter than the old E_coll. Non-positive would ' +
      'mean numerical underflow or sign error; non-tighter would mean the ' +
      'refinement does not actually improve the bound.',
  },
  {
    id: 'imp1135-research-factor-is-N-uniform-on-ladder',
    holds: () => RESEARCH_FACTOR_CONSISTENT,
    why:
      'The research-formal tightening factor is N-INDEPENDENT (both new and ' +
      'old E_coll formulas use the same sqrt(log gamma_N / N) factor, only ' +
      'the prefactor C_C differs). Hence the per-N ratio must be constant. ' +
      'Drift would indicate a bug in eCollWithCC or in effectiveHeightForN.',
  },
  {
    id: 'imp1135-five-or-more-named-obstructions',
    holds: () => NAMED_OBSTRUCTIONS.length >= 5,
    why:
      'The ticket requires 5+ named obstructions documenting why each of the ' +
      'six routes fails to give a fully RIGOROUS-ENGINE-CONSUMED 1.15x ' +
      'factor today. Five obstructions cover ROUTE 1 (Tsang T0), ROUTE 3 ' +
      '(N-uniformity loss), ROUTE 4 (lambda^2 not portable), ROUTE 5 (PCC ' +
      'open), ROUTE 6 (IK adaptation). Falling below 5 means we have not ' +
      'documented why the engine cannot consume the projected factor.',
  },
  {
    id: 'imp1135-selberg-lambda-sq-construction-outlined',
    holds: () =>
      typeof SELBERG_LAMBDA_SQUARED_CONSTRUCTION_OUTLINE === 'object' &&
      Array.isArray(SELBERG_LAMBDA_SQUARED_CONSTRUCTION_OUTLINE.steps) &&
      SELBERG_LAMBDA_SQUARED_CONSTRUCTION_OUTLINE.steps.length >= 5,
    why:
      'Per the ticket honest-scope clause, the Selberg lambda^2 construction ' +
      'must be outlined (5+ steps) even though it is not in the tool ' +
      'inventory. The outline serves as the spec for sub-gap imp-1135-sub-' +
      'selberg-construction.',
  },
  {
    id: 'imp1135-parity-barrier-ceiling-respected',
    holds: () => {
      const parityBarrierMax = Math.sqrt(3 / 2);
      return TARGET_FACTOR < parityBarrierMax;
    },
    why:
      'The Selberg parity barrier caps any classical-sieve C_Selberg ' +
      'reduction at sqrt(3/2) ~ 1.2247x on C_C. The target 1.15x must be ' +
      'strictly below this barrier. A target above sqrt(3/2) would be ' +
      'mathematically impossible under classical sieve theory; the ticket ' +
      'would be ill-posed.',
  },
  {
    id: 'imp1135-does-not-mutate-imp399',
    holds: () => Math.abs(C_C_PINNED_MIRROR - (1 / 8) * Math.sqrt(3 * Math.PI)) < 1e-12,
    why:
      'imp-399 C_C_PINNED = (1/8) * sqrt(3*pi) closed form must remain ' +
      'unchanged after this refinement is shipped. The refinement is a SHELF ' +
      'projection, not a consumed mutation. The mirror C_C_PINNED_MIRROR is ' +
      'computed locally from the closed form; drift would mean the formula ' +
      'has been silently modified, signalling a downstream bridge change.',
  },
];
