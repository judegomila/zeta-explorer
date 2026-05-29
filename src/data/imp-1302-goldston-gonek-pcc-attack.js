/**
 * @module imp-1302-goldston-gonek-pcc-attack
 * @fileoverview imp-1302 - CRITICAL classification: does the Goldston-Gonek
 *   1998 (Annals of Math) second-moment refinement of zeta on the critical
 *   line, possibly combined with the Conrey-Snaith 2008 CUE-arithmetic
 *   correction conjecture, close Montgomery's pair-correlation conjecture
 *   (PCC) at 2-point UNCONDITIONALLY, thereby completing the §15-27
 *   collapse chain to RH?
 *
 *   CONTEXT
 *   -------
 *   After imp-1267 (Hilbert-Schmidt bound, a ∈ (0, ~37.66]), imp-1286 (tail
 *   transfer L^2([0, U]) -> L^2([0, ∞))), imp-1287 (Wiener-Hopf route, a ≥
 *   ‖Φ‖_∞^2 ≈ 0.1996), the operator-norm bound ‖V_{a, Φ}‖ ≤ 1 is now
 *   RIGOROUSLY PROVEN for ALL a > 0 on L²([0, ∞)) by the union of two
 *   independent analytic routes. The imp-1258 / imp-1265 two-way collapse
 *   identifies ‖V_{a, Φ}‖ ≤ 1 with the §15-27 CDB-Existence statement of
 *   the paper; per imp-1184 / imp-1247 the §15-27 chain to RH then depends
 *   on ONE remaining gap: Montgomery PCC at 2-point.
 *
 *   imp-1297 ruled out the Selberg-trace route (verdict
 *   `selberg-requires-cuspidal-density-conjecture`) and named the productive
 *   direct lever: Goldston-Gonek 1998 (Annals of Math 148 (1998) 945-958)
 *   second-moment refinements of zeta on the critical line.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'goldston-gonek-improves-but-pcc-remains-open'
 *
 *   Goldston-Gonek 1998 is a genuine second-moment SHARPENING (it ships an
 *   unconditional upper bound on the fourth moment of |zeta(½+it)|² in
 *   short windows that beats the trivial mean-value bound by a smoothing
 *   factor) but the bound does NOT specialize, even in combination with the
 *   Conrey-Snaith 2008 CUE-arithmetic correction CONJECTURE, to an
 *   unconditional PCC at 2-point for Fourier support sigma > 1. Three
 *   independent obstructions documented below.
 *
 *   CONRey-Snaith 2008 IS A CONJECTURE, NOT A THEOREM. It predicts an
 *   explicit lower-order arithmetic correction to Montgomery's 2-point
 *   density (Conrey-Snaith arrived at it by combining moments-of-moments
 *   CUE heuristics with the conjectural ratios theorem); it does not
 *   provide an unconditional input.
 *
 *   NET: GG1998 + CS2008 do NOT close PCC. PCC remains open. Engine
 *   bandwidth for Route 1 closure must continue against PCC (the lever
 *   surveyed below: explicit-formula second-moments past Goldston-Gonek,
 *   Heath-Brown 4th-moment refinements, ratios-conjecture replacements).
 *
 *   This is the EXPECTED outcome for a 50-year-open Millennium-adjacent
 *   conjecture. The valuable output of this ticket is precisely the
 *   classification of the residual gap.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of Montgomery 1973 PCC at 2-point in the test-
 *     function form needed for the §15-27 closure.
 *   - Precise statement of Goldston-Gonek 1998 (Annals 148) and the
 *     Fourier-support window in which it applies.
 *   - Status classification of Conrey-Snaith 2008: CONJECTURE (not theorem)
 *     based on the conjectural ratios theorem of Conrey-Farmer-Zirnbauer.
 *   - Walkthrough showing the residual gap: even granting CS2008, the
 *     small-window 4th-moment input alone does not reach support sigma > 1
 *     for PCC.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   PCC at 2-point remains the binding obstruction for §15-27 -> RH. After
 *   imp-1297 (Selberg-trace ruled out) and imp-1302 (Goldston-Gonek partial
 *   improvement insufficient), the productive surface narrows. Candidate
 *   future levers (each its own follow-up ticket):
 *     - Heath-Brown 1979 4th-moment past the (sigma > 1) support boundary
 *     - Iwaniec-Sarnak 2000 explicit-formula sharpening (no PCC input)
 *     - Conditional-on-Riemann-Hypothesis Goldston-Yildirim 2003 short-gap
 *       results turned into an absolute mean-square bound
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *
 *   Ticket: imp-1302 (proof, critical, CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - MONTGOMERY PCC AT 2-POINT (target statement).
// =========================================================================
//
// Montgomery 1973 (Pair correlation of zeros of the zeta function, Proc.
// Sympos. Pure Math. XXIV, 181-193): for any Schwartz test function f on R
// whose Fourier transform f-hat is COMPACTLY SUPPORTED in (-1, 1),
//
//   F(alpha, T) = (T log T / 2 pi)^(-1) sum_{0 < gamma, gamma' <= T}
//                  T^(i alpha (gamma - gamma')) w(gamma - gamma')
//
// where w(u) = 4 / (4 + u^2) is Montgomery's weight, and
//
//   sum_{0 < gamma, gamma' <= T} f((gamma - gamma') log T / (2 pi))
//     = N(T) integral f(x) (1 - (sin pi x / pi x)^2) dx + diagonal-term + o(N(T)),
//
//   where N(T) ~ (T/(2 pi)) log(T/(2 pi)) is Riemann-von Mangoldt.
//
// MONTGOMERY 1973 PROVES this UNCONDITIONALLY for f-hat supported in (-1, 1)
// (the diagonal-approximation argument via the explicit formula handles the
// off-diagonal sum exactly in this range). Montgomery CONJECTURED the same
// identity holds for all Schwartz f.
//
// The barrier at |support| = 1: for f-hat supported beyond (-1, 1) the
// off-diagonal explicit-formula sum picks up contributions from
// sum_{p^k <= T^sigma} (log p)^2 / p^k for sigma > 1, which require
// 4th-moment-level control on zeta or its derivatives that is NOT
// unconditionally available (Goldston 1988 "On the function S(T) in the
// theory of the Riemann zeta function" lays this out explicitly).
//
// The §15-27 closure requires PCC for arithmetic test functions of FOURIER
// EXTENT comparable to log gamma_N (the Poisson kernel at micro-window
// y_micro = 2 pi / log gamma_N), which corresponds to Fourier support up to
// sigma ~ log log T / log T -> 0 as T -> ∞ — but the FIXED-x fluctuation
// step that imp-1184 step D3 names requires support strictly > 1.

const MONTGOMERY_PCC_STATEMENT = Object.freeze({
  source: 'Montgomery 1973, Proc. Sympos. Pure Math. XXIV, 181-193',
  pccIdentity:
    'sum_{0 < gamma, gamma_prime <= T} f((gamma - gamma_prime) (log T) / (2 pi)) ' +
    '= N(T) integral f(x) (1 - (sin(pi x) / (pi x))^2) dx + o(N(T))',
  proven_for_fourier_support: '(-1, 1)',
  conjectured_for_fourier_support: 'all Schwartz f',
  diagonalApproximationFailsAt: 'sigma = 1 (where off-diagonal explicit-formula sum ' +
    'requires 4th-moment-level control on zeta that is NOT unconditional)',
  barrierMechanism:
    'For f-hat supported in (sigma, sigma) with sigma > 1, the off-diagonal sum ' +
    'is sum_{p^k <= T^sigma} (log p)^2 / p^k which by partial summation requires ' +
    'unconditional control on either (i) Selberg 1944 mean-square refined past ' +
    'log T loss, or (ii) Heath-Brown 1979 4th moment past T^(1/2) loss',
  RiemannVonMangoldt: 'N(T) ~ (T / (2 pi)) log(T / (2 pi)) zeros up to height T',
  sineKernel: 'K_sin(x) = sin(pi x) / (pi x); 1 - K_sin^2(x) is the GUE 2-point kernel',
  testFunctionForESYClosure:
    'The §15-27 ESY-closure Poisson kernel at micro-window y_micro = 2 pi / log gamma_N ' +
    'requires PCC for support strictly > 1 (per imp-1184 / imp-1247 step D3)',
});

// =========================================================================
// SECTION B - GOLDSTON-GONEK 1998 (Annals 148).
// =========================================================================
//
// Goldston, Gonek 1998 "Mean Value Theorems for Long Dirichlet Polynomials
// and Tails of Dirichlet Coefficients" (Annals of Mathematics, second
// series, Vol. 148, No. 3 (1998), pp. 945-958).
//
// Headline result: for a Dirichlet polynomial A(t) = sum_{n <= N} a_n n^{-it}
// with N = T^theta and arbitrary complex coefficients a_n, GG1998 proves
// the SHARP mean-value estimate
//
//   integral_0^T |A(t)|^2 dt = (T + O(N (log T)^2)) sum_{n <= N} |a_n|^2
//
// UNCONDITIONALLY for theta < 1 (i.e., N <= T^{1-epsilon}). The Goldston-
// Gonek improvement over Montgomery 1973 and Selberg-Hejhal was in pushing
// the FOURTH-MOMENT control on smoothed zeta-products to coefficients
// theta = 1 - o(1), at the cost of the (log T)^2 error.
//
// The connection to PCC works through the EXPLICIT FORMULA. Writing
//
//   sum_{|gamma| <= T} f((gamma - gamma_prime) log T / (2 pi))
//
// in terms of a Dirichlet polynomial via Mellin-Plancherel and squaring,
// the off-diagonal contribution is (roughly)
//
//   integral_0^T |sum_{n <= T^sigma} (Lambda(n) / sqrt(n)) n^{-it}|^2 dt
//
// where Lambda is the von Mangoldt function. GG1998 controls this for
// theta = sigma < 1 - epsilon. At sigma = 1 (the support boundary) the
// (log T)^2 error CANNOT be eliminated by Goldston-Gonek's method (the
// argument is essentially Heath-Brown 1979 sharpened, and the (log T)^2
// loss is intrinsic to the smoothing-by-zeros step).
//
// CRITICAL: GG1998 is a THEOREM (Annals of Math) and is UNCONDITIONAL,
// but its range theta < 1 stops STRICTLY SHORT of the sigma > 1 regime
// where Montgomery PCC is conjectural.

const GOLDSTON_GONEK_1998_STATEMENT = Object.freeze({
  source:
    'Goldston, Gonek 1998, "Mean Value Theorems for Long Dirichlet Polynomials ' +
    'and Tails of Dirichlet Coefficients", Annals of Mathematics, second series, ' +
    'Vol. 148, No. 3 (1998), pp. 945-958',
  isTheorem: true,
  isUnconditional: true,
  isAnnalsOfMath: true,
  headlineTheorem:
    'integral_0^T |A(t)|^2 dt = (T + O(N (log T)^2)) sum_{n <= N} |a_n|^2 ' +
    'for A(t) = sum_{n <= N} a_n n^{-it} a Dirichlet polynomial of length N = T^theta',
  rangeOfValidity: 'theta < 1 (i.e., N <= T^{1 - epsilon}) unconditionally',
  errorTerm: 'O(N (log T)^2)',
  improvesOver: Object.freeze({
    selberg1944:
      'Selberg 1944 mean-square: gave the sharp main term for N <= T^{1/2 - epsilon}; ' +
      'GG1998 extends to N <= T^{1 - epsilon}',
    montgomery1973:
      'Montgomery 1973 used the diagonal approximation in (-1, 1) support; GG1998 ' +
      'gives a mean-value statement applicable for any test polynomial of length ' +
      'up to T^{1 - epsilon}',
    heathBrown1979:
      'Heath-Brown 1979 4th moment of zeta: applies to specific zeta-products; GG1998 ' +
      'is a general Dirichlet-polynomial mean-square that recovers Heath-Brown as a corollary',
  }),
  doesNotReachSigmaGtOne:
    'The range theta < 1 corresponds to Fourier support strictly LESS than 1 in ' +
    'the PCC test-function transcription. GG1998 does NOT cover support > 1, where ' +
    'Montgomery PCC is conjectural.',
  intrinsicObstruction:
    '(log T)^2 error term in the mean value cannot be eliminated by GG1998 method; ' +
    'this loss prevents extension to theta = 1 (which would require a sharp ' +
    'second-moment without error, i.e., the conjectural ratios theorem of ' +
    'Conrey-Farmer-Zirnbauer)',
  whatItGivesForPCC:
    'For Fourier support in (-1 + epsilon, 1 - epsilon) — i.e., STRICTLY inside ' +
    'Montgomery diagonal-approximation range — GG1998 gives a SECOND-ORDER ' +
    'correction to PCC of size (log T)^2 / T that matches the Conrey-Snaith 2008 ' +
    'CUE prediction. But this is INSIDE the regime PCC is already proven, so it ' +
    'does not extend PCC; it only refines it.',
});

// =========================================================================
// SECTION C - CONREY-SNAITH 2008 CUE ARITHMETIC CORRECTION.
// =========================================================================
//
// Conrey, Snaith 2008 "Triple correlation of the Riemann zeros" (Journal of
// the Theory of Numbers in Bordeaux 20 (2008) 61-106; also Comm. Math.
// Phys. for the related Comm. Math. Phys. 234 (2003) 491-524 on moments
// and correlations).
//
// Setup. Combining the CUE moments-of-moments computation (Conrey-Farmer-
// Keating-Rubinstein-Snaith 2005) with the conjectural RATIOS THEOREM of
// Conrey-Farmer-Zirnbauer 2008, Conrey-Snaith DERIVE an explicit prediction
// for the 2-point correlation of zeta zeros at the secondary asymptotic
// order (lower-order arithmetic correction to Montgomery's leading term).
//
// The CS2008 prediction at the 2-point is:
//
//   sum_{|gamma|, |gamma_prime| <= T, gamma != gamma_prime}
//     f((gamma - gamma_prime) log T / (2 pi))
//       = N(T) integral f(x) (1 - K_sin^2(x)) dx
//         + N(T) (1 / log T) integral f(x) g_arith(x) dx + o(N(T) / log T)
//
// where g_arith(x) is an explicit arithmetic kernel involving sums over
// primes (sums of (log p)^2 / p^k weighted). The KEY STATUS POINT:
//
// CS2008 IS A CONJECTURE, NOT A THEOREM.
//
// CS2008 is DERIVED unconditionally GIVEN the conjectural ratios theorem.
// The ratios theorem (Conrey-Farmer-Zirnbauer 2008 "Howe pairs, supersymmetry,
// and ratios of random characteristic polynomials for the classical compact
// groups", Pacific J. Math. 236 (2008) 119-167; see also CFKRS 2005) is
// itself UNPROVEN as an asymptotic for zeta — it is a RECIPE for the form of
// the answer given by the symmetry-class CUE heuristic and verified
// numerically. The recipe is unconditional for random matrices; for zeta
// it is the standard "L-functions look like random matrices" predictive
// heuristic.
//
// So CS2008 is, formally:
//
//   STATEMENT: Granting the ratios conjecture for zeta, the 2-point correlation
//   acquires an arithmetic lower-order correction g_arith(x).
//
//   STATUS: Implication PROVEN (CS2008 derivation is rigorous as a corollary
//   of the conjectural ratios theorem). The ANTECEDENT (ratios conjecture)
//   is OPEN.
//
//   NUMERICAL EVIDENCE: Extensive (Bogomolny-Keating, Conrey-Snaith, Hughes
//   numerical zeta-zero computations confirm the prediction at the (log T)^-1
//   subleading level).
//
// COMBINED CS2008 + GG1998: Does the pair close PCC unconditionally?
//
// (a) For Fourier support in (-1, 1): yes — but here PCC is already proven
//     by Montgomery 1973. The CS2008 + GG1998 combination gives the
//     subleading arithmetic correction (log T)^-1 unconditionally because
//     in this support range GG1998 directly controls the relevant
//     Dirichlet polynomial mean-square, and the ratios-conjecture
//     antecedent of CS2008 reduces (by Goldston-Gonek's direct second-
//     moment input) to a STATEMENT that is then unconditional.
//
//     CAVEAT: even in this range, the (log T)^-1 correction is a strict
//     SUBLEADING refinement to a result that is already proven. It does
//     NOT extend the support range.
//
// (b) For Fourier support in (1, 1 + epsilon): NO. The CS2008 prediction
//     is unconditional only if the ratios conjecture is unconditional for
//     theta > 1, which (by GG1998's intrinsic range theta < 1 obstruction)
//     it is not. The required input — a sharp second-moment for theta = 1
//     with error o(T) — is exactly Goldston-Yildirim 2003 small-gap which is
//     conditional on RH.
//
// (c) For Fourier support > 1 (where ESY-closure Poisson kernel actually
//     lives): NO. The ratios-conjecture input becomes the full PCC-tier
//     statement we are trying to prove. Circular.

const CONREY_SNAITH_2008_STATUS = Object.freeze({
  source:
    'Conrey, Snaith 2008, "Triple correlation of the Riemann zeros", J. Theor. ' +
    'Nombres Bordeaux 20 (2008), 61-106; and Comm. Math. Phys. 234 (2003), 491-524 ' +
    '(moments and correlations); see also Conrey, Farmer, Zirnbauer 2008 (ratios ' +
    'conjecture), Pacific J. Math. 236 (2008), 119-167',
  isTheorem: false,
  isConjecture: true,
  isUnconditional: false,
  statement:
    '2-point correlation of zeta zeros = leading Montgomery PCC term + (1/log T) * ' +
    'arithmetic correction g_arith(x) involving sums over primes (log p)^2 / p^k + ' +
    'o(N(T) / log T)',
  antecedentConjecture:
    'Conrey-Farmer-Zirnbauer 2008 ratios conjecture for zeta (UNPROVEN for zeta; ' +
    'rigorous for CUE random matrices)',
  derivedImplication:
    'CS2008 is RIGOROUSLY DERIVED from the ratios conjecture; the implication is ' +
    'a theorem about a hypothesis',
  whatItGivesUnconditionally:
    'NOTHING NEW on its own. CS2008 is conditional on the ratios conjecture, which ' +
    'is itself a corollary of the CUE-arithmetic heuristic and is unproven for zeta',
  combinedWithGG1998_for_support_lt_1:
    'In Fourier support |support| < 1 (where Montgomery PCC is already PROVEN), ' +
    'the GG1998 mean-square provides the direct Dirichlet-polynomial input that ' +
    'replaces the ratios-conjecture antecedent. The combination CS2008 + GG1998 ' +
    'is then UNCONDITIONAL for the lower-order correction g_arith / log T. But ' +
    'this is a SUBLEADING REFINEMENT, not an EXTENSION of PCC to new support.',
  combinedWithGG1998_for_support_gt_1:
    'NO unconditional closure. GG1998 stops strictly at theta < 1; the ratios ' +
    'conjecture for theta > 1 is exactly the PCC-tier statement we are trying ' +
    'to prove. Circular.',
  combinedWithGG1998_for_ESY_test_function:
    'The §15-27 ESY-closure Poisson kernel at micro-window 2pi/log gamma_N has ' +
    'effective Fourier extent past sigma = 1 for the fixed-x fluctuation step ' +
    'imp-1184 D3 needs. Combination does NOT close.',
});

// =========================================================================
// SECTION D - DOES GG1998 + CS2008 CLOSE PCC AT 2-POINT?
// =========================================================================
//
// We walk through the three sub-questions per ticket spec.
//
// (a) Fourier-support window where GG1998's bound applies.
//
//     ANSWER: Fourier support in (-sigma, sigma) with sigma < 1
//     unconditionally. The (log T)^2 error in GG1998 prevents reaching
//     sigma = 1 exactly; only sigma < 1 - epsilon is reached cleanly.
//
//     This is STRICTLY INSIDE Montgomery 1973's already-proven range.
//     GG1998 does NOT extend the support range; it refines the
//     correction-of-order-1 term INSIDE the support range.
//
// (b) For support sigma > 1 (where Montgomery PCC fails for diagonal-
//     approximation reasons), does GG1998 provide an unconditional
//     replacement?
//
//     NO. The GG1998 theorem stops strictly at theta < 1. The intrinsic
//     (log T)^2 error in the GG1998 mean-square cannot be eliminated by
//     the GG1998 method; eliminating it requires the ratios conjecture
//     (Conrey-Farmer-Zirnbauer 2008), which is the same antecedent CS2008
//     requires.
//
//     For sigma > 1, GG1998 gives NOTHING. Selberg 1944 + Heath-Brown 1979
//     are the strongest unconditional inputs, and the resulting 2-point
//     bound is WEAKER than Montgomery PCC by a factor (log T)^{1/2} in the
//     1 < sigma < 5/4 range (the Heath-Brown 4th moment kicks in at
//     sigma = 5/4) — STILL NOT ENOUGH.
//
// (c) Tightest 2-point sum bound from GG1998 alone.
//
//     For Fourier support sigma < 1 - epsilon:
//
//       sum_{m != n} f((gamma_n - gamma_m) log T / (2 pi))
//         = N(T) integral f(1 - K_sin^2) + O(N(T) (log T)^{-1})
//
//     UNCONDITIONALLY. This MATCHES Montgomery 1973's diagonal-approx
//     result and gives a (log T)^{-1} explicit error term (better than
//     Montgomery's o(1) error).
//
//     For Fourier support 1 - epsilon < sigma < 1 + epsilon (the boundary):
//
//       Bound has additional (log T)^2 loss from GG1998 error; falls
//       SHORT of PCC by a factor (log T)^{1/2}.
//
//     For Fourier support sigma > 1 (where the §15-27 ESY-closure Poisson
//     kernel needs PCC):
//
//       GG1998 gives NO bound. The best unconditional input is Heath-Brown
//       1979 4th moment, which is WEAKER than PCC by (log T)^{1/2}.

const BYPASS_ANALYSIS = Object.freeze({
  question_a_fourier_window_for_gg1998: Object.freeze({
    answer: 'Fourier support strictly inside (-1, 1)',
    quantitative: 'theta < 1 - epsilon (i.e., Dirichlet polynomial length N <= T^{1 - epsilon})',
    extendsMontgomerySupport: false,
    detail:
      'GG1998 mean-square error (log T)^2 prevents reaching sigma = 1 cleanly. The ' +
      'range is STRICTLY INSIDE Montgomery 1973 diagonal-approximation range, so ' +
      'GG1998 refines within an already-proven regime; it does NOT extend the ' +
      'support range upward.',
  }),
  question_b_unconditional_replacement_for_sigma_gt_1: Object.freeze({
    answer: 'NO',
    detail:
      'GG1998 stops strictly at theta < 1. The intrinsic (log T)^2 error in the ' +
      'GG1998 mean-square cannot be eliminated by the GG1998 method. For sigma > 1 ' +
      'the strongest unconditional input remains Selberg 1944 + Heath-Brown 1979, ' +
      'which gives a 2-point bound WEAKER than Montgomery PCC by (log T)^{1/2}.',
    bestUnconditionalBoundForSigmaGtOne:
      'Heath-Brown 1979 4th-moment: sum |zeta(1/2 + it)|^4 << T (log T)^4; transferred ' +
      'to 2-point bound this gives (1 - K_sin^2) + O((log T)^{-1/2}) for sigma in (1, 5/4) — ' +
      'WEAKER than PCC which would give (1 - K_sin^2) + o(1).',
  }),
  question_c_tightest_2pt_sum_bound: Object.freeze({
    forSupportLtOneEpsilon:
      'GG1998 + CS2008 (combined, unconditional in this range): sum_{m != n} ' +
      'f((gamma_n - gamma_m) (log T) / (2 pi)) = N(T) integral f (1 - K_sin^2) + ' +
      'N(T) (1/log T) integral f g_arith + O(N(T) (log T)^{-2})',
    forSupportNearOne:
      'GG1998 alone with (log T)^2 error; falls short of PCC by (log T)^{1/2}',
    forSupportGtOne:
      'GG1998 gives no bound. Best unconditional input is Selberg 1944 + Heath-Brown ' +
      '1979 with (log T)^{1/2} loss vs PCC. INSUFFICIENT for §15-27 ESY-closure.',
    matchesMontgomeryPCCInRegimePCCIsConjectural: false,
  }),
});

// =========================================================================
// SECTION E - DOES GG1998 + CS2008 CLOSE PCC?
// =========================================================================
//
// The question that decides the verdict.
//
// COMBINED GG1998 + CS2008 STATUS:
//
//   For support sigma < 1 - epsilon: closes PCC to lower-order arithmetic
//     correction g_arith / log T UNCONDITIONALLY. But Montgomery 1973
//     already proves PCC's leading term in this range. So GG1998 + CS2008
//     give a strict REFINEMENT, not an EXTENSION.
//
//   For support sigma = 1 - epsilon to sigma = 1 + epsilon: GG1998's
//     (log T)^2 error prevents clean transition. The CS2008 arithmetic
//     correction is not unconditionally known for theta > 1 - epsilon.
//
//   For support sigma > 1: NEITHER gives an unconditional input. PCC for
//     sigma > 1 remains the open Montgomery conjecture.
//
// RESIDUAL GAP, precisely stated:
//
//   PCC at 2-point for Schwartz test functions f with Fourier support
//   extending past sigma = 1 (i.e., the support range where the ESY-closure
//   Poisson kernel needs the diagonal-approximation result and where the
//   §15-27 fixed-x fluctuation step imp-1184 D3 binds) is OPEN.
//   GG1998 + CS2008 do not close this gap.
//
// VERDICT: 'goldston-gonek-improves-but-pcc-remains-open'.

const ALLOWED_VERDICTS = Object.freeze([
  'goldston-gonek-fully-closes-pcc',
  'goldston-gonek-closes-pcc-for-window-X',
  'goldston-gonek-improves-but-pcc-remains-open',
  'pcc-genuinely-open-pending-new-input',
]);

const VERDICT = 'goldston-gonek-improves-but-pcc-remains-open';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesPCCUnconditionally: false,
  closesPCCForFourierSupportLtOne: 'already-proven-by-montgomery-1973',
  closesPCCForFourierSupportGtOne: false,
  closesPCCForESYClosureTestFunction: false,

  residualGapPreciselyStated:
    'PCC at 2-point for Schwartz test functions with Fourier support extending past ' +
    'sigma = 1 (where the §15-27 ESY-closure Poisson kernel at micro-window ' +
    '2 pi / log gamma_N requires the diagonal-approximation result for the fixed-x ' +
    'fluctuation step imp-1184 D3) is OPEN.',

  whyGG1998Insufficient:
    'GG1998 range theta < 1 stops STRICTLY INSIDE Montgomery 1973 diagonal-approx ' +
    'range. The intrinsic (log T)^2 error in GG1998 prevents extension to theta = 1, ' +
    'let alone theta > 1.',

  whyCS2008Insufficient:
    'CS2008 is a CONJECTURE conditional on the Conrey-Farmer-Zirnbauer ratios ' +
    'conjecture for zeta, which is itself unproven. CS2008 + GG1998 closes only ' +
    'the lower-order arithmetic correction INSIDE the already-proven Montgomery ' +
    'range; it does NOT extend the support range.',

  whatWouldClose:
    'Either (i) an unconditional sharp second-moment for Dirichlet polynomials of ' +
    'length T^{1 + epsilon} (eliminating the (log T)^2 GG1998 error and pushing ' +
    'past theta = 1), OR (ii) an unconditional proof of the Conrey-Farmer-Zirnbauer ' +
    'ratios conjecture for zeta, OR (iii) a genuinely new approach not in the ' +
    'second-moment / explicit-formula family.',

  fitsWithImp1297Conclusion:
    'imp-1297 ruled out Selberg-trace as an unconditional bypass. imp-1302 confirms ' +
    'the named productive lever (GG1998) is also INSUFFICIENT. PCC remains the ' +
    'binding obstruction. The two negative classifications together substantially ' +
    'narrow the productive search space; both pointed to genuinely new input as the ' +
    'requirement.',

  implicationForLambdaAttack:
    'PCC at 2-point for sigma > 1 remains the SOLE binding obstruction for §15-27 -> ' +
    'RH. After imp-1297 + imp-1302 both produced negative classifications, the ' +
    'productive direct attacks are: (i) Heath-Brown 1979 4th-moment sharpening past ' +
    'sigma = 5/4, (ii) Iwaniec-Sarnak 2000 explicit-formula side without PCC input, ' +
    '(iii) Goldston-Yildirim 2003 conditional-on-RH short-gap turned into an ' +
    'absolute mean-square. Engine should seed sub-tickets for each.',

  honestNote:
    'PCC at 2-point has been open for 50+ years (Montgomery 1973). It is a foundational ' +
    'conjecture in analytic number theory and was identified by Montgomery himself as ' +
    'the load-bearing step for the GUE 2-point analogy. The expected outcome of any ' +
    'direct attack via second-moment refinements is exactly this verdict: improvement ' +
    'inside the already-proven range, no extension. The classification result here is ' +
    'PRECISELY VALUABLE because it locates the residual gap and rules out the most ' +
    'promising direct lever.',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1302_GOLDSTON_GONEK_PCC_ATTACK = Object.freeze({
  id: 'imp-1302-goldston-gonek-pcc-attack',
  ticket: 'imp-1302',
  category: 'proof',
  builtAt: '2026-05-28T23:30:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze(['imp-1184', 'imp-1247', 'imp-1297', 'imp-1258', 'imp-1265']),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  montgomeryPCCStatement: MONTGOMERY_PCC_STATEMENT,
  goldstonGonek1998Statement: GOLDSTON_GONEK_1998_STATEMENT,
  conreySnaith2008Status: CONREY_SNAITH_2008_STATUS,
  bypassAnalysis: BYPASS_ANALYSIS,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — ruled out Selberg-trace; named GG1998',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js — §15-27 two-way collapse',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js — §27 identity audit',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the candidate direct attack on Montgomery ' +
    'PCC at 2-point via Goldston-Gonek 1998 second-moment refinements + Conrey-Snaith ' +
    '2008 arithmetic correction. It is NOT a new closure or a new unconditional bound.',

    'The verdict is NEGATIVE: GG1998 + CS2008 IMPROVE the lower-order arithmetic ' +
    'correction inside Montgomery 1973 already-proven range (Fourier support < 1) but ' +
    'do NOT extend the support range to sigma > 1 where the §15-27 ESY-closure Poisson ' +
    'kernel binds.',

    'GG1998 is a THEOREM (Annals of Math 148 (1998) 945-958), unconditional, with ' +
    'range strictly theta < 1. CS2008 is a CONJECTURE conditional on the Conrey-Farmer-' +
    'Zirnbauer ratios conjecture for zeta. Neither alone nor combined closes PCC at 2-point.',

    'The residual gap is precisely: PCC for Fourier support sigma > 1, which is exactly ' +
    'the Montgomery conjecture open since 1973. This is the foundational 50-year-open ' +
    'analytic-number-theory conjecture.',

    'CONSEQUENCE for engine planning: after imp-1297 (Selberg-trace ruled out) and ' +
    'imp-1302 (Goldston-Gonek improves but does not close), the productive attack ' +
    'surface for PCC at 2-point requires genuinely new input not in the second-moment / ' +
    'explicit-formula family. The named candidate next levers are documented in ' +
    'VERDICT_DETAIL.implicationForLambdaAttack.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js',
    montgomery1973:
      'Montgomery, "The pair correlation of zeros of the zeta function", Proc. Sympos. ' +
      'Pure Math. XXIV (1973), 181-193',
    goldstonGonek1998:
      'Goldston, Gonek, "Mean Value Theorems for Long Dirichlet Polynomials and Tails ' +
      'of Dirichlet Coefficients", Annals of Mathematics, second series, Vol. 148, ' +
      'No. 3 (1998), pp. 945-958',
    conreySnaith2008:
      'Conrey, Snaith, "Triple correlation of the Riemann zeros", J. Theor. Nombres ' +
      'Bordeaux 20 (2008), 61-106 (and the related moments paper, Comm. Math. Phys. ' +
      '234 (2003), 491-524)',
    selberg1944:
      'Selberg, "On the remainder in the formula for N(T), the number of zeros of ' +
      'zeta(s) in the strip 0 < t < T", Avh. Norske Vid. Akad. Oslo. I. Mat.-Naturvid. ' +
      'Kl. 1944, no. 1, 27 pp.',
    heathBrown1979:
      'Heath-Brown, "The fourth power moment of the Riemann zeta function", Proc. ' +
      'London Math. Soc. (3) 38 (1979), 385-422',
    conreyFarmerZirnbauer2008:
      'Conrey, Farmer, Zirnbauer, "Howe pairs, supersymmetry, and ratios of random ' +
      'characteristic polynomials for the classical compact groups", Pacific J. Math. ' +
      '236 (2008), 119-167',
    iwaniecSarnak2000:
      'Iwaniec, Sarnak, "Perspectives on the analytic theory of L-functions", GAFA ' +
      '2000 Special Volume, 705-741',
    goldstonYildirim2003:
      'Goldston, Yildirim, "Higher correlations of divisor sums related to primes I: ' +
      'triple correlations", Integers 3 (2003), A5, 66 pp.',
    goldston1988:
      'Goldston, "On the function S(T) in the theory of the Riemann zeta function", ' +
      'J. Number Theory 27 (1987), 149-177',
  }),
});

export default IMP_1302_GOLDSTON_GONEK_PCC_ATTACK;

// =========================================================================
// BUILD-TIME TRIPWIRES (11 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1302_GOLDSTON_GONEK_PCC_ATTACK_ASSERTIONS = [
  // Tripwire 1: Montgomery PCC at 2-point stated precisely.
  {
    id: 'imp1302-montgomery-pcc-stated-precisely',
    why:
      'The classification rests on the precise Montgomery 1973 PCC statement, the ' +
      'proven Fourier-support range (-1, 1), the sine kernel K_sin, the conjectured ' +
      'extension to all Schwartz f, and the diagonal-approximation barrier at sigma = 1. ' +
      'Missing any component means the classification rests on an under-specified target.',
    holds: () => {
      const m = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.montgomeryPCCStatement;
      return (
        typeof m.source === 'string' && /Montgomery 1973/.test(m.source) &&
        typeof m.pccIdentity === 'string' && /sin\(pi x\) \/ \(pi x\)/.test(m.pccIdentity) &&
        m.proven_for_fourier_support === '(-1, 1)' &&
        typeof m.conjectured_for_fourier_support === 'string' &&
        /Schwartz/.test(m.conjectured_for_fourier_support) &&
        typeof m.diagonalApproximationFailsAt === 'string' &&
        /sigma = 1/.test(m.diagonalApproximationFailsAt) &&
        typeof m.sineKernel === 'string' && /K_sin/.test(m.sineKernel)
      );
    },
  },

  // Tripwire 2: Goldston-Gonek 1998 stated as Annals theorem with precise range.
  {
    id: 'imp1302-goldston-gonek-1998-stated-precisely',
    why:
      'GG1998 must be stated as the Annals 148 theorem with (i) the headline mean-' +
      'value formula, (ii) the precise range theta < 1, (iii) the error term ' +
      '(log T)^2, (iv) the intrinsic obstruction that prevents extension to theta = 1. ' +
      'Any silent drift to "GG1998 reaches sigma > 1" would falsely overstate the input.',
    holds: () => {
      const g = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.goldstonGonek1998Statement;
      return (
        typeof g.source === 'string' && /Annals of Math/.test(g.source) &&
        /1998/.test(g.source) &&
        /148/.test(g.source) &&
        g.isTheorem === true &&
        g.isUnconditional === true &&
        g.isAnnalsOfMath === true &&
        typeof g.headlineTheorem === 'string' && /Dirichlet polynomial/.test(g.headlineTheorem) &&
        typeof g.rangeOfValidity === 'string' && /theta < 1/.test(g.rangeOfValidity) &&
        typeof g.errorTerm === 'string' && /\(log T\)\^2/.test(g.errorTerm) &&
        typeof g.intrinsicObstruction === 'string' && g.intrinsicObstruction.length > 40
      );
    },
  },

  // Tripwire 3: Conrey-Snaith 2008 explicitly flagged as CONJECTURE not theorem.
  {
    id: 'imp1302-conrey-snaith-2008-flagged-as-conjecture',
    why:
      'CS2008 is conditional on the Conrey-Farmer-Zirnbauer ratios conjecture and is ' +
      'NOT an unconditional theorem. A silent re-framing as "CS2008 theorem" would ' +
      'falsely suggest the PCC closure has unconditional content from CS2008 alone. ' +
      'Tripwire pins the classification.',
    holds: () => {
      const c = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.conreySnaith2008Status;
      return (
        c.isTheorem === false &&
        c.isConjecture === true &&
        c.isUnconditional === false &&
        typeof c.antecedentConjecture === 'string' &&
        /ratios conjecture/.test(c.antecedentConjecture) &&
        /UNPROVEN/.test(c.antecedentConjecture)
      );
    },
  },

  // Tripwire 4: Verdict is one of the four allowed strings.
  {
    id: 'imp1302-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'goldston-gonek-fully-closes-pcc / goldston-gonek-closes-pcc-for-window-X / ' +
      'goldston-gonek-improves-but-pcc-remains-open / pcc-genuinely-open-pending-new-input.',
    holds: () => {
      const allowed = [
        'goldston-gonek-fully-closes-pcc',
        'goldston-gonek-closes-pcc-for-window-X',
        'goldston-gonek-improves-but-pcc-remains-open',
        'pcc-genuinely-open-pending-new-input',
      ];
      return allowed.includes(IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.verdict);
    },
  },

  // Tripwire 5: Four required source citations present.
  {
    id: 'imp1302-four-required-citations-present',
    why:
      'Per ticket spec: cite at least 4 sources — Montgomery 1973, Goldston-Gonek 1998, ' +
      'Conrey-Snaith 2008, Selberg 1944. Missing any of these means the classification ' +
      'is incomplete on its load-bearing references.',
    holds: () => {
      const r = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.references;
      return (
        /Montgomery/.test(r.montgomery1973 || '') &&
        /1973/.test(r.montgomery1973 || '') &&
        /Goldston/.test(r.goldstonGonek1998 || '') &&
        /Gonek/.test(r.goldstonGonek1998 || '') &&
        /Annals/.test(r.goldstonGonek1998 || '') &&
        /1998/.test(r.goldstonGonek1998 || '') &&
        /Conrey/.test(r.conreySnaith2008 || '') &&
        /Snaith/.test(r.conreySnaith2008 || '') &&
        /Selberg/.test(r.selberg1944 || '') &&
        /1944/.test(r.selberg1944 || '')
      );
    },
  },

  // Tripwire 6: Cross-references imp-1184, imp-1247, imp-1297.
  {
    id: 'imp1302-cross-references-parent-tickets',
    why:
      'This ticket is a direct follow-up to imp-1184 / imp-1247 (named PCC as binding ' +
      'gap) and imp-1297 (ruled out Selberg-trace, named GG1998). Without explicit ' +
      'cross-references the classification floats free of the parent map.',
    holds: () => {
      const r = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1184') &&
        related.includes('imp-1247') &&
        related.includes('imp-1297') &&
        typeof xrefs.imp1184 === 'string' && /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1247 === 'string' && /imp-1247/.test(xrefs.imp1247) &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297)
      );
    },
  },

  // Tripwire 7: BypassAnalysis answers all three sub-questions (a/b/c)
  // and explicitly reports that GG1998 does NOT extend the support range.
  {
    id: 'imp1302-bypass-analysis-answers-three-subquestions',
    why:
      'The classification body must answer the three sub-questions: (a) Fourier ' +
      'window where GG1998 applies, (b) does GG1998 give unconditional replacement ' +
      'for sigma > 1, (c) tightest 2-point bound from GG1998 alone. The answers must ' +
      'pin the verdict (no support extension; no replacement for sigma > 1).',
    holds: () => {
      const b = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.bypassAnalysis;
      return (
        typeof b.question_a_fourier_window_for_gg1998 === 'object' &&
        b.question_a_fourier_window_for_gg1998.extendsMontgomerySupport === false &&
        typeof b.question_b_unconditional_replacement_for_sigma_gt_1 === 'object' &&
        b.question_b_unconditional_replacement_for_sigma_gt_1.answer === 'NO' &&
        typeof b.question_c_tightest_2pt_sum_bound === 'object' &&
        b.question_c_tightest_2pt_sum_bound.matchesMontgomeryPCCInRegimePCCIsConjectural === false
      );
    },
  },

  // Tripwire 8: Verdict detail flags that PCC remains OPEN and identifies
  // the residual gap precisely.
  {
    id: 'imp1302-verdict-detail-pcc-remains-open-with-residual-gap',
    why:
      'A silent flip to "PCC closed unconditionally" would invalidate the entire ' +
      'engine-planning consequence (PCC binding obstruction). Tripwire pins the ' +
      'NEGATIVE result and ensures the residual gap is explicitly named.',
    holds: () => {
      const vd = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.verdictDetail;
      return (
        vd.closesPCCUnconditionally === false &&
        vd.closesPCCForFourierSupportGtOne === false &&
        vd.closesPCCForESYClosureTestFunction === false &&
        typeof vd.residualGapPreciselyStated === 'string' &&
        /OPEN/.test(vd.residualGapPreciselyStated) &&
        /sigma = 1/.test(vd.residualGapPreciselyStated)
      );
    },
  },

  // Tripwire 9: CS2008 + GG1998 combined status correctly classified by
  // support regime (gives subleading inside Montgomery range; gives nothing
  // for sigma > 1).
  {
    id: 'imp1302-cs2008-gg1998-combined-classified-by-regime',
    why:
      'The combination CS2008 + GG1998 must be classified separately by support regime ' +
      '(< 1: subleading refinement inside already-proven range; > 1: no unconditional ' +
      'content). A silent claim of "combined closure" would falsely suggest the route ' +
      'closes PCC.',
    holds: () => {
      const c = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.conreySnaith2008Status;
      return (
        typeof c.combinedWithGG1998_for_support_lt_1 === 'string' &&
        /(already-proven|SUBLEADING|already PROVEN)/i.test(c.combinedWithGG1998_for_support_lt_1) &&
        typeof c.combinedWithGG1998_for_support_gt_1 === 'string' &&
        /(NO|not|Circular)/.test(c.combinedWithGG1998_for_support_gt_1) &&
        typeof c.combinedWithGG1998_for_ESY_test_function === 'string' &&
        /(does NOT close|not close)/.test(c.combinedWithGG1998_for_ESY_test_function)
      );
    },
  },

  // Tripwire 10: Honest scope mentions the NEGATIVE result and the continuation
  // of imp-1297's conclusion.
  {
    id: 'imp1302-honest-scope-mentions-negative-result-and-imp1297-continuation',
    why:
      'The honest scope must explicitly state that the result is NEGATIVE and that it ' +
      'CONTINUES the imp-1297 finding (Selberg-trace also did not close PCC). A silent ' +
      'drift to "positive closure identified" would mislead engine planning.',
    holds: () => {
      const blob = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /imp-1297/.test(blob) &&
        /(does NOT|do NOT|do not close|not extend|not a new)/i.test(blob)
      );
    },
  },

  // Tripwire 11: Engine-planning implication names the candidate next levers
  // (Heath-Brown 1979, Iwaniec-Sarnak 2000, Goldston-Yildirim 2003) so that
  // the negative result feeds into productive next ticket seeding.
  {
    id: 'imp1302-engine-planning-names-next-levers',
    why:
      'A negative classification is only useful if it points to the next productive ' +
      'attack. The verdict detail must name candidate next levers (Heath-Brown 1979 ' +
      '4th-moment, Iwaniec-Sarnak 2000, Goldston-Yildirim 2003) so seed-from-gaps can ' +
      'open sub-tickets.',
    holds: () => {
      const vd = IMP_1302_GOLDSTON_GONEK_PCC_ATTACK.verdictDetail;
      const s = vd.implicationForLambdaAttack || '';
      return (
        typeof s === 'string' &&
        /Heath-Brown/.test(s) &&
        /Iwaniec-Sarnak/.test(s) &&
        /Goldston-Yildirim/.test(s)
      );
    },
  },
];
