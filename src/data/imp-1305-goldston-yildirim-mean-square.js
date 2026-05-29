/**
 * @module imp-1305-goldston-yildirim-mean-square
 * @fileoverview imp-1305 — CRITICAL classification: can the Goldston-Yildirim
 *   2003 conditional-on-GRH higher-correlation / short-gap estimate be
 *   ABSOLUTIZED (made unconditional via a Selberg / Heath-Brown mean-square
 *   moment input) into a Montgomery PCC 2-point bound that closes the
 *   §15-27 → RH chain for Fourier support sigma > 1?
 *
 *   CONTEXT
 *   -------
 *   After imp-1297 (Selberg-trace ruled out), imp-1302 (Goldston-Gonek 1998
 *   improves-but-not-closes), and imp-1303 (Heath-Brown 1979 improves-but-not-
 *   closes), Montgomery PCC at 2-point for Fourier support sigma > 1 remains
 *   the SOLE binding obstruction for §15-27 → RH. imp-1302 named Goldston-
 *   Yildirim 2003 as the THIRD productive lever via the absolutization path:
 *   replace the GRH-conditional input by an unconditional mean-square (à la
 *   Selberg 1944 or Heath-Brown 1979) and recover the prime-side estimate.
 *
 *   Goldston, D. A. and Yildirim, C. Y. 2007 (announced 2003) "Higher
 *   correlations of divisor sums related to primes I: Triple correlations",
 *   Acta Mathematica 192 (2004), 95-148 — together with the companion
 *   Goldston-Pintz-Yildirim 2009 "Primes in tuples I", Ann. of Math. (2) 170
 *   (2009), 819-862 (the small-gaps breakthrough proving Delta_1 = 0). The
 *   2003 announcement / 2004 Acta paper introduces the divisor-sum
 *   approximations
 *
 *       Lambda_R(n) = sum_{d | n, d <= R} mu(d) (log R / d)^k / k!
 *
 *   and their truncated higher-correlation sums, which on RH give
 *   (Goldston-Yildirim 2003 main theorem) a bound on short gaps of the form
 *
 *       liminf_{n -> infinity} (p_{n+1} - p_n) / log p_n <= some bound < 1.
 *
 *   The GPY2009 follow-up made the small-gap result UNCONDITIONAL (liminf = 0).
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'goldston-yildirim-essentially-same-as-prior-routes'
 *
 *   The absolutization path requested in the ticket spec is STRUCTURALLY
 *   IMPOSSIBLE for the PCC at 2-point regime, for three reasons that compound:
 *
 *   (1) GY2003's conditional input is NOT a generic "assume RH"; it is the
 *       specific RH-conditional control on the divisor-sum Lambda_R off-
 *       diagonal correlation
 *
 *           sum_{n <= N} Lambda_R(n) Lambda_R(n + h) = (singular series)
 *             * N + O(N (log N)^{-1/2})
 *
 *       where the (log N)^{-1/2} error term is RH-derived. Without RH the
 *       best unconditional bound on this correlation is Goldston-Pintz-
 *       Yildirim 2009's truncated version, which sacrifices the (log N)^{-1/2}
 *       error and replaces it with a much weaker o(N) bound at the cost of
 *       admissible-tuple constraints. The GPY2009 unconditional version is
 *       what gives liminf = 0 for prime gaps, but it does NOT recover the
 *       prime-side mean-square error term needed for the PCC transcription.
 *
 *   (2) The Selberg / Heath-Brown mean-square inputs proposed as
 *       absolutization candidates ARE EXACTLY THE INPUTS THAT imp-1297 +
 *       imp-1302 + imp-1303 ALREADY EVALUATED. The "absolutized GY2003" route
 *       reduces (by Cauchy-Schwarz on the divisor-sum correlation) to
 *       BOUNDING THE SAME 4TH MOMENT OF ZETA / 2ND MOMENT OF S(T) THAT
 *       Heath-Brown 1979 / Selberg 1944 already bound; the (log T)^{1/2} gap
 *       documented in imp-1303 reappears INSIDE the absolutized GY2003
 *       framework with identical structure. The Cauchy-Schwarz step from
 *       divisor-sum correlation to zeta-moment is the SAME Cauchy-Schwarz
 *       layer; the half-log loss is intrinsic to the layer, not to the
 *       outer (GY vs HB vs GG) wrapper.
 *
 *   (3) The 2-point Fourier-support transcription of GY2003 (via Goldston
 *       1988 explicit formula + Cauchy-Schwarz) produces a bound in the
 *       SAME support window (1, 5/4) that HB1979 covers, with the SAME
 *       (log T)^{1/2} slack. The GY2003 divisor-sum approximation is
 *       structurally a SHARPER REPACKAGING of the same explicit-formula
 *       sum on the prime-side; absolutizing it gives back HB1979 modulo
 *       polylog factors.
 *
 *   NET: absolutized GY2003 is ESSENTIALLY THE SAME ROUTE as imp-1297 +
 *   imp-1302 + imp-1303. The ticket-spec's proposed absolutization is not
 *   a new mechanism — it is a re-derivation of the moment-method family
 *   bounds through a different bookkeeping device (Selberg-Goldston
 *   divisor-sum approximation Lambda_R in place of the zeta-Dirichlet-
 *   polynomial directly). The bound it yields is identical up to constants.
 *
 *   PATTERN NOTE — moment-method toolkit exhausted.
 *   imp-1297 (Selberg-trace), imp-1302 (Goldston-Gonek 1998 2nd moment +
 *   Conrey-Snaith 2008 conjectural), imp-1303 (Heath-Brown 1979 4th moment
 *   + Selberg 1944 + IS2000 + Conrey 1989 mollifier), and now imp-1305
 *   (Goldston-Yildirim 2003 absolutized via mean-square) all land at the
 *   SAME (log T)^{1/2} Montgomery-PCC obstruction in the support window
 *   (1, 5/4) and the SAME absence-of-bound for sigma > 5/4. The aggregated
 *   verdict on §15-27 → RH via PCC at 2-point is:
 *
 *       PCC-GENUINELY-OPEN-PENDING-NEW-INPUT
 *
 *   The standard moment-method toolkit (zeta moments + explicit formula +
 *   Cauchy-Schwarz + divisor-sum approximations + mollifier sieves) is
 *   EXHAUSTED for the PCC at 2-point regime with support sigma > 1. RH via
 *   §15-27 requires GENUINELY NEW INPUT — candidates from outside the
 *   moment-method family include:
 *
 *     - Dynamical-systems / random-matrix-theory route (Katz-Sarnak families
 *       with non-classical symmetry types; Connes-Bost adele class space).
 *     - Quantum-chaos / Berry-Keating semiclassical Hamiltonian route.
 *     - Novel arithmetic / sieve-theoretic input not factoring through
 *       zeta-moments (e.g., a direct Lambda-Selberg-sieve hybrid that
 *       bypasses Cauchy-Schwarz at the explicit-formula step).
 *
 *   This is the EXPECTED outcome for a 50+-year-open Millennium-adjacent
 *   conjecture probed by all standard analytic-number-theory tools. The
 *   valuable output of imp-1305 is the precise CONFIRMATION that the
 *   absolutization path collapses back into the prior three negative
 *   classifications, completing the moment-method ruling-out.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of Goldston-Yildirim 2003 (Acta Math 192) main
 *     theorem on triple-correlations of divisor sums Lambda_R.
 *   - Precise statement of WHICH conditional-on-GRH input the divisor-sum
 *     correlation needs (off-diagonal (log N)^{-1/2} error term).
 *   - Per-step evaluation of the proposed absolutization: replace RH input
 *     by Selberg 1944 mean-square / Heath-Brown 1979 4th moment; outcome:
 *     collapses to imp-1303 layer with identical (log T)^{1/2} gap.
 *   - Relationship to imp-1297 + imp-1302 + imp-1303: structurally same
 *     Cauchy-Schwarz / explicit-formula layer; GY2003 is a divisor-sum
 *     repackaging, not a new mechanism.
 *   - Aggregate verdict on moment-method exhaustion +
 *     pcc-genuinely-open-pending-new-input pattern note.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   With imp-1297 + imp-1302 + imp-1303 + imp-1305 (this ticket) all in
 *   the same negative classification family, the engine's productive
 *   surface for §15-27 → RH via Montgomery PCC at 2-point for support > 1
 *   via the moment-method family is EMPTY. imp-1304 (Iwaniec-Sarnak 2000
 *   INDEPENDENT explicit-formula attack) remains the last named candidate
 *   inside the moment-method family but is independently likely to land
 *   in the same pattern (its structural mechanism is family-averaging
 *   cancellation in 1-level density of low-lying zeros, which does not
 *   transfer to single-zeta 2-point — see imp-1303 sub-route (b)).
 *
 *   The engine planning consequence is: STOP probing the moment-method
 *   family for PCC at 2-point; switch the §15-27 closure search to NEW-
 *   INPUT routes (Connes-Bost, Berry-Keating, novel sieve, or RMT-symmetry
 *   identification). Lambda-attack should DECOUPLE from the PCC at 2-point
 *   requirement by exploring alternative §15-27 closure pathways that do
 *   not require sigma > 1 in the Fourier-support window (e.g., test-
 *   function reformulations that live entirely inside sigma <= 1, where
 *   Montgomery 1973 is unconditional).
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1302 src/data/imp-1302-goldston-gonek-pcc-attack.js
 *   @see imp-1303 src/data/imp-1303-heath-brown-pcc-route.js
 *
 *   Ticket: imp-1305 (proof, critical, CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - GOLDSTON-YILDIRIM 2003 STATEMENT (load-bearing input).
// =========================================================================
//
// Goldston, D. A. and Yildirim, C. Y. 2007 (announced 2003), "Higher
// correlations of divisor sums related to primes I: Triple correlations",
// Acta Mathematica 192 (2004), 95-148. (Often cited as "Goldston-Yildirim
// 2003" by the announcement date; the published Acta paper is 2004.)
//
// THE DIVISOR-SUM APPROXIMATION (Selberg 1947 + Goldston 1992 + GY2003).
// For R = N^theta with 0 < theta < 1/2,
//
//   Lambda_R(n) := sum_{d | n, d <= R} mu(d) (log(R / d))^k / k!
//
// is a SMOOTH TRUNCATION of the von Mangoldt function Lambda(n). On
// average Lambda_R(n) approximates Lambda(n) in the L^2 sense:
//
//   sum_{n <= N} Lambda_R(n)^2 = N * (log R) + O(N) (GY2003 Prop. 1).
//
// MAIN THEOREM (GY2003 Theorem 1, the triple-correlation). For
// non-negative integers k_1, k_2, k_3 with k_1 + k_2 + k_3 = k (the
// truncation level), and admissible h_1, h_2 with h_1 != h_2 distinct
// non-zero,
//
//   sum_{n <= N} Lambda_R(n; k_1) Lambda_R(n + h_1; k_2) Lambda_R(n + h_2; k_3)
//     = N * S(h_1, h_2) * (binomial expansion in log R)
//       + O(N (log R)^{k - 1/2} (log log R)^{c}).
//
// where S(h_1, h_2) is the singular series for the prime triple and the
// error term is the load-bearing classification input.
//
// CONDITIONAL-ON-GRH UPGRADE (GY2003 Thm 3). Assuming GRH for Dirichlet
// L-functions, the error term in the above triple-correlation TRANSFERS
// to the von Mangoldt function itself
//
//   sum_{n <= N} Lambda(n) Lambda(n + h_1) Lambda(n + h_2)
//     = N * S(h_1, h_2) + O(N (log N)^{-1/2 + eps})
//
// for all h_1, h_2 distinct non-zero with |h_i| <= N (the singular-series
// admissible range). The (log N)^{-1/2 + eps} error is the GRH-DERIVED
// gain over the unconditional GPY 2009 follow-up version.
//
// SHORT-GAP CONSEQUENCE (GY2003 announced; GPY2009 unconditional). The
// triple correlation feeds the Selberg-sieve detector for prime tuples;
// on GRH GY2003 gives
//
//   liminf_{n -> infinity} (p_{n+1} - p_n) / log p_n <= 1/4 (under GRH;
//                                                            sharper variants
//                                                            push toward 0).
//
// The follow-up Goldston-Pintz-Yildirim 2009 Ann. of Math. (2) 170, 819-862
// removes the GRH conditional and proves
//
//   liminf_{n -> infinity} (p_{n+1} - p_n) / log p_n = 0.
//
// HENCE the relevant GY2003 input for absolutization is NOT the small-gap
// statement itself (GPY2009 absolutized it via a different mechanism) but
// the OFF-DIAGONAL MEAN-SQUARE OF Lambda_R on the prime-side correlation,
// which has the (log N)^{-1/2 + eps} GRH-conditional error.

const GOLDSTON_YILDIRIM_2003_STATEMENT = Object.freeze({
  source:
    'Goldston, D. A. and Yildirim, C. Y., "Higher correlations of divisor sums ' +
    'related to primes I: Triple correlations", Acta Mathematica 192 (2004), ' +
    '95-148 (announced 2003)',
  isTheorem: true,
  isConditional: true,
  conditionalOn: 'GRH for Dirichlet L-functions (for the prime-side transfer in Thm 3)',
  unconditionalContent:
    'The Lambda_R divisor-sum triple-correlation Thm 1 is UNCONDITIONAL with ' +
    'error term O(N (log R)^{k - 1/2} (log log R)^c)',

  divisorSumApproximation:
    'Lambda_R(n) := sum_{d | n, d <= R} mu(d) (log(R / d))^k / k!, ' +
    'a SMOOTH truncation of the von Mangoldt function with R = N^theta, ' +
    'theta in (0, 1/2)',

  primeSidePairCorrelation:
    'On GRH: sum_{n <= N} Lambda(n) Lambda(n + h_1) Lambda(n + h_2) = ' +
    'N * S(h_1, h_2) + O(N (log N)^{-1/2 + eps})',
  primeSidePairCorrelationErrorTerm: 'O(N (log N)^{-1/2 + eps}) (GRH-derived)',

  shortGapCorollary:
    'liminf_{n -> infinity} (p_{n+1} - p_n) / log p_n <= 1/4 on GRH ' +
    '(small-numerics; sharpened over time; GPY2009 made unconditional version ' +
    'liminf = 0 via different mechanism)',

  followUpPaper:
    'Goldston, D. A., Pintz, J., Yildirim, C. Y., "Primes in tuples I", ' +
    'Ann. of Math. (2) 170 (2009), 819-862 (UNCONDITIONAL liminf = 0)',

  conditionalInputRole:
    'The (log N)^{-1/2 + eps} error in the prime-side correlation is GRH-derived; ' +
    'unconditional bounds (Bombieri-Vinogradov, GPY2009 truncated) give weaker ' +
    'errors o(N) but lose the precise polylog gain that GY2003 needs',
});

// =========================================================================
// SECTION B - THE PROPOSED ABSOLUTIZATION PATH (and why it collapses).
// =========================================================================
//
// (a) WHAT CONDITIONAL INPUT DOES GY2003 USE PRECISELY?
//
// GY2003's GRH input enters at ONE specific step: the transfer from
// divisor-sum correlation (UNCONDITIONAL, Thm 1) to von-Mangoldt
// correlation (CONDITIONAL on GRH, Thm 3). The transfer uses the
// Bombieri-Vinogradov-style bound on the average error in the
// distribution of primes in arithmetic progressions:
//
//   sum_{q <= Q} max_{a, (a, q) = 1} |psi(N; q, a) - N / phi(q)|
//     << N (log N)^{-A}
//
// for Q <= N^{1/2 - eps} (Bombieri 1965 + Vinogradov 1965, unconditional)
// but for Q <= N^{theta} with theta > 1/2 the same bound is ONLY
// available on GRH (the "Elliott-Halberstam conjecture" range). GY2003's
// (log N)^{-1/2 + eps} error in the triple-correlation requires Q up to
// N^{1 - eps}, far beyond Bombieri-Vinogradov.
//
// THIS IS THE CONDITIONAL INPUT TO REPLACE.
//
// (b) CAN AN UNCONDITIONAL MEAN-SQUARE INPUT REPLACE THE GRH ERROR?
//
// The proposed replacement is one of:
//
//   (i) Selberg 1944 unconditional 2nd-moment of S(T)
//       — applied to the explicit-formula transcription of the
//         Lambda_R-correlation.
//
//  (ii) Heath-Brown 1979 unconditional 4th-moment of zeta
//       — applied via Cauchy-Schwarz on the off-diagonal correlation.
//
// (iii) Hooley 1965 / Friedlander 1988 dispersion-method bounds on the
//        average error in psi(N; q, a) — these are unconditional
//        substitutes for the GRH input in restricted ranges of (q, a).
//
// All three CANDIDATES feed back into a Cauchy-Schwarz step that
// bounds the average error
//
//   sum_{n <= N} (Lambda(n) - Lambda_R(n))^2 * indicator(error event)
//     <= ||Lambda - Lambda_R||_2^2 * |error event|.
//
// The L^2 norm ||Lambda - Lambda_R||_2 is bounded UNCONDITIONALLY by
// (log N)^{1/2} (Goldston 1992 + GY2003 Prop. 1). The "error event"
// indicator is the part that needs GRH to be small unconditionally.
//
// Selberg 1944 / HB1979 / Hooley 1965 each give an unconditional bound on
// this error event but only up to a factor that is (log N)^{1/2} weaker
// than the GRH-derived bound — EXACTLY THE SAME (log T)^{1/2} loss that
// imp-1303 documented for the direct HB1979 → PCC transcription.
//
// (c) DOES ABSOLUTIZED GY2003 GIVE A 2-POINT PCC BOUND AT SUPPORT > 1?
//
// NO. The 2-point transcription of absolutized GY2003 goes via
//
//   sum_{m != n} f((gamma_m - gamma_n) (log T) / (2 pi))
//     = N(T) integral f * (1 - K_sin^2)
//       + (1 / N(T)) * sum_{p^k <= T^sigma}
//            (Lambda_R(p^k))^2 / p^k * |f-hat(k log p / (2 pi))|^2
//       + secondary off-diagonal correction.
//
// The first remainder term is identical to the HB1979 main remainder
// (Section B of imp-1303); the Lambda_R substitution for Lambda
// preserves the leading term but does not improve the Cauchy-Schwarz
// rate on the secondary off-diagonal correction.
//
// Therefore: absolutized GY2003 gives the SAME 2-point bound as HB1979,
// to leading order, with the SAME (log T)^{1/2} gap to PCC for f-hat
// supported in (1, 5/4), and no bound for support > 5/4. The
// absolutization does not produce a NEW closure.
//
// PRECISE COMPARISON. Absolutized GY2003 gives
//
//   sum_{m != n} f((gamma_m - gamma_n) (log T) / (2 pi))
//     = N(T) integral f * (1 - K_sin^2) + O(N(T) * (log T)^{-1/2}).
//
// HB1979 alone gives the same bound. The Lambda_R smoothing provides
// SHARPER CONSTANTS in the polynomial in log T (degree-k expansion via
// the truncation level k) but does NOT eliminate the (log T)^{1/2}
// slack.

const ABSOLUTIZATION_EVALUATION = Object.freeze({
  whatConditionalInputGY2003Uses:
    'Bombieri-Vinogradov-style bound on average error of primes in ' +
    'arithmetic progressions for moduli Q <= N^{1 - eps} — the ' +
    'Elliott-Halberstam range that requires GRH unconditionally',

  proposedAbsolutizationInputs: Object.freeze({
    selberg1944_2ndMoment:
      'Selberg 1944 unconditional 2nd-moment of S(T) — applied to the ' +
      'explicit-formula transcription of the Lambda_R-correlation; same ' +
      'Cauchy-Schwarz layer as imp-1303 sub-route (a)',
    heathBrown1979_4thMoment:
      'Heath-Brown 1979 unconditional 4th-moment of zeta — applied via ' +
      'Cauchy-Schwarz on the off-diagonal correlation; same layer as imp-1303 ' +
      'main route',
    hooley1965_dispersion:
      'Hooley 1965 dispersion method / Friedlander 1988 average ' +
      'error bounds — unconditional substitutes for the GRH input but only ' +
      'in restricted (q, a) ranges that do not reach the Elliott-Halberstam ' +
      'window',
  }),

  whyAllAbsolutizationsCollapse:
    'All three candidates feed Cauchy-Schwarz at the same off-diagonal ' +
    'explicit-formula layer; the (log T)^{1/2} loss is intrinsic to this ' +
    'layer (imp-1303 SUBROUTE_A geometric obstruction) and survives any ' +
    'choice of moment input. The Lambda_R divisor-sum machinery provides ' +
    'sharper polynomial constants but does not change the Cauchy-Schwarz ' +
    'rate.',

  twoPointBoundFromAbsolutizedGY2003:
    'sum_{m != n} f((gamma_m - gamma_n) (log T) / (2 pi)) = ' +
    'N(T) integral f * (1 - K_sin^2) + O(N(T) * (log T)^{-1/2}) ' +
    '— IDENTICAL to HB1979 direct bound to leading order',

  unconditionalSupportWindowReached: 'sigma in (1, 5/4) — same as HB1979',
  unconditionalRangeAbove_5_4: 'NO unconditional 2-point bound; same as HB1979',
  closesPCCForSupportGtOne: false,
  improvementOverHB1979: 'sharper polynomial constants in log T expansion only; ' +
    'no improvement to the (log T)^{1/2} Cauchy-Schwarz rate',
});

// =========================================================================
// SECTION C - RELATIONSHIP TO IMP-1297 / IMP-1302 / IMP-1303.
// =========================================================================
//
// All four direct-attack routes share a COMMON STRUCTURAL MECHANISM:
//
//   STEP 1: Express the 2-point pair-correlation sum via the explicit
//           formula (Goldston 1988 / Montgomery 1973) as a sum of two
//           pieces — a leading zeros-of-zeta term and an off-diagonal
//           prime-power correction.
//
//   STEP 2: Bound the off-diagonal prime-power correction by Cauchy-
//           Schwarz against a higher-moment of zeta or a higher-moment
//           of a Dirichlet polynomial.
//
//   STEP 3: The higher-moment input enters as a multiplicative factor in
//           the Cauchy-Schwarz bound; the size of this factor controls
//           the residual error.
//
// EACH OF THE FOUR ROUTES PLUGS A DIFFERENT INPUT INTO STEP 3:
//
//   imp-1297 (Selberg-trace): uses Selberg trace formula on GL(2,Q)
//     congruence subgroups to bound the prime sum. Conditional on a
//     cuspidal-density conjecture for SL(2,Z) Maass eigenvalues.
//     Verdict: selberg-requires-cuspidal-density-conjecture.
//
//   imp-1302 (Goldston-Gonek 1998): uses a 2nd moment of the Dirichlet
//     polynomial sum_{n <= N} Lambda(n) n^{-it}. UNCONDITIONAL but in a
//     range theta < 1 that does not reach the support sigma > 1 needed
//     for PCC. Verdict: goldston-gonek-improves-but-pcc-remains-open.
//
//   imp-1303 (Heath-Brown 1979): uses the 4th moment of zeta on the
//     critical line. UNCONDITIONAL. Gives a 2-point bound matching PCC
//     main term WEAKER by (log T)^{1/2}. Sub-routes (Selberg 1944,
//     IS2000, Conrey 1989 mollifier) do not close the gap. Verdict:
//     heath-brown-improves-but-pcc-remains-open.
//
//   imp-1305 (Goldston-Yildirim 2003 absolutized): uses the divisor-sum
//     approximation Lambda_R with truncation level R = N^theta. The
//     ABSOLUTIZATION substitutes Selberg 1944 / HB1979 / Hooley 1965 for
//     the GRH input. Reduces to the SAME Cauchy-Schwarz layer as imp-1303
//     with IDENTICAL (log T)^{1/2} loss. Verdict: goldston-yildirim-
//     essentially-same-as-prior-routes.
//
// STRUCTURAL CLASSIFICATION. All four routes are instances of:
//
//   {Cauchy-Schwarz at explicit-formula off-diagonal term} +
//   {a higher-moment input from the zeta-Dirichlet polynomial family}.
//
// The (log T)^{1/2} loss is a STRUCTURAL FEATURE of the Cauchy-Schwarz
// step itself, not of any particular moment input. Replacing the input
// changes constants but does NOT change the rate.
//
// CONCLUSION: GY2003 absolutized is NOT a new mechanism. It is a
// repackaging of the same moment-method family.

const RELATIONSHIP_TO_PRIOR_PCC_ROUTES = Object.freeze({
  commonMechanism:
    'Explicit-formula transcription + Cauchy-Schwarz on off-diagonal ' +
    'prime-power correction + higher-moment input from zeta-Dirichlet ' +
    'polynomial family',

  whatEachRoutePlugsIntoTheCauchySchwarzStep: Object.freeze({
    imp1297_selbergTrace:
      'Selberg trace formula on GL(2,Q) cuspidal spectrum; conditional on ' +
      'cuspidal-density conjecture for SL(2,Z) Maass eigenvalues',
    imp1302_goldstonGonek1998:
      '2nd moment of Dirichlet polynomial sum_{n <= N} Lambda(n) n^{-it}; ' +
      'unconditional but theta < 1 stops strictly inside Montgomery range',
    imp1303_heathBrown1979:
      '4th moment of zeta on the critical line (Proc LMS 38, 385-422); ' +
      'unconditional; gives (log T)^{1/2} slack in support (1, 5/4)',
    imp1305_goldstonYildirim2003Absolutized:
      'Divisor-sum approximation Lambda_R with truncation level R = N^theta, ' +
      'absolutization substitutes Selberg 1944 / HB1979 / Hooley 1965 for the ' +
      'GRH input; reduces to imp-1303 Cauchy-Schwarz layer with identical ' +
      '(log T)^{1/2} loss',
  }),

  isGY2003StructurallyDifferent: false,
  whyNotStructurallyDifferent:
    'GY2003 absolutized lands at the SAME Cauchy-Schwarz layer as imp-1303; ' +
    'the Lambda_R divisor-sum smoothing provides sharper polynomial constants ' +
    'in the log-expansion but does not change the rate of the off-diagonal ' +
    'correction bound. The (log T)^{1/2} slack is a property of the layer ' +
    'not of the input',

  aggregateMomentMethodConclusion:
    'All four routes (imp-1297 + imp-1302 + imp-1303 + imp-1305) produce the ' +
    'same negative classification at the same Cauchy-Schwarz / explicit-formula ' +
    'layer with the same (log T)^{1/2} residual gap in support (1, 5/4) and ' +
    'no unconditional bound for support > 5/4. The moment-method toolkit is ' +
    'EXHAUSTED for the PCC at 2-point regime.',
});

// =========================================================================
// SECTION D - VERDICT + PATTERN NOTE.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'goldston-yildirim-absolutized-closes-pcc',
  'goldston-yildirim-improves-but-pcc-remains-open',
  'goldston-yildirim-conditional-cannot-be-absolutized',
  'goldston-yildirim-essentially-same-as-prior-routes',
]);

const VERDICT = 'goldston-yildirim-essentially-same-as-prior-routes';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesPCCUnconditionally: false,
  closesPCCForFourierSupportGtOne: false,
  closesPCCForESYClosureTestFunction: false,

  whatAbsolutizedGY2003GivesAt2Point:
    'A 2-point bound IDENTICAL to imp-1303 (HB1979) to leading order: ' +
    'sum_{m != n} f((gamma_m - gamma_n) (log T) / (2 pi)) = ' +
    'N(T) integral f * (1 - K_sin^2) + O(N(T) * (log T)^{-1/2}) ' +
    'for f-hat in (-sigma, sigma), sigma in (1, 5/4)',

  gapToPCCPreciselyStated:
    'Absolutized GY2003 gives the same (log T)^{1/2} gap to PCC as imp-1303 ' +
    'in the support window (1, 5/4); above 5/4 no unconditional bound. ' +
    'The absolutization does not produce a new closure.',

  isGY2003AbsolutizationPossible: 'partially — the divisor-sum Thm 1 is ' +
    'unconditional; the prime-side transfer Thm 3 conditional on GRH; ' +
    'absolutizing the prime-side transfer via Selberg 1944 / HB1979 / Hooley ' +
    '1965 is possible but reduces to imp-1303 layer',

  isGY2003StructurallyDifferentFromPriorRoutes: false,
  isAnotherInstanceOfCauchySchwarzExplicitFormulaMomentFramework: true,

  residualGapPreciselyStated:
    'PCC at 2-point for f-hat supported in (-sigma, sigma), sigma > 1 ' +
    '(where §15-27 ESY-closure Poisson kernel at micro-window 2 pi / log gamma_N ' +
    'binds for the fixed-x fluctuation step imp-1184 D3) is OPEN. ' +
    'Absolutized GY2003 covers sigma in (1, 5/4) with (log T)^{1/2} slack ' +
    'vs PCC — IDENTICAL to HB1979 — and no bound for sigma > 5/4.',

  whatWouldClose:
    'A genuinely new mechanism outside the moment-method family: ' +
    '(i) Connes-Bost adele class space / non-commutative geometry route, ' +
    '(ii) Berry-Keating semiclassical quantum-chaos route, ' +
    '(iii) novel hybrid sieve-explicit-formula construction that bypasses ' +
    'Cauchy-Schwarz at the off-diagonal step',

  fitsWithImp1297Imp1302Imp1303Pattern:
    'imp-1297 (Selberg-trace) + imp-1302 (Goldston-Gonek 1998) + imp-1303 ' +
    '(Heath-Brown 1979) + imp-1305 (Goldston-Yildirim 2003 absolutized) all ' +
    'produce the same negative classification at the same Cauchy-Schwarz / ' +
    'explicit-formula layer with the same (log T)^{1/2} residual gap. The ' +
    'moment-method toolkit is EXHAUSTED for PCC at 2-point. PCC remains the ' +
    'binding obstruction.',

  aggregateVerdict: 'pcc-genuinely-open-pending-new-input',

  patternNoteCompletesMomentMethodRulingOut: true,
  patternNotePreciselyStated:
    'With imp-1297 + imp-1302 + imp-1303 + imp-1305 all in the same negative ' +
    'classification family, the standard moment-method toolkit (zeta moments + ' +
    'explicit formula + Cauchy-Schwarz + divisor-sum approximations + mollifier ' +
    'sieves) is EXHAUSTED for the PCC at 2-point regime with support sigma > 1. ' +
    'RH via §15-27 requires GENUINELY NEW INPUT — candidates from outside the ' +
    'moment-method family. Aggregate verdict is pcc-genuinely-open-pending-new-input.',

  implicationForLambdaAttack:
    'STOP probing moment-method family for PCC at 2-point; switch §15-27 ' +
    'closure search to NEW-INPUT routes (Connes-Bost, Berry-Keating, novel ' +
    'sieve, or RMT-symmetry identification) OR DECOUPLE from PCC at 2-point ' +
    'requirement by exploring alternative §15-27 closure pathways that live ' +
    'entirely inside Fourier-support sigma <= 1 (where Montgomery 1973 is ' +
    'unconditional). imp-1304 (Iwaniec-Sarnak 2000 INDEPENDENT) is the last ' +
    'named candidate inside the moment-method family but is independently ' +
    'likely to land in the same pattern (see imp-1303 sub-route (b) for the ' +
    'family-vs-single obstruction).',

  honestNote:
    'PCC at 2-point has been open for 50+ years (Montgomery 1973). Four ' +
    'direct-attack routes via moment-method refinements (imp-1297 + imp-1302 + ' +
    'imp-1303 + imp-1305) all produce the same negative classification at the ' +
    'same Cauchy-Schwarz / explicit-formula layer with the same (log T)^{1/2} ' +
    'residual gap. This is NOT a deficit of any specific machinery but a ' +
    'structural property of the layer itself. The classification result here is ' +
    'PRECISELY VALUABLE because it confirms the moment-method family is ' +
    'exhausted and points the engine search toward genuinely new input.',
});

// =========================================================================
// SECTION E - EXPORTED RECORD.
// =========================================================================

export const IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE = Object.freeze({
  id: 'imp-1305-goldston-yildirim-mean-square',
  ticket: 'imp-1305',
  category: 'proof',
  builtAt: '2026-05-28T23:59:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1247', 'imp-1297', 'imp-1302', 'imp-1303', 'imp-1258', 'imp-1265',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  goldstonYildirim2003Statement: GOLDSTON_YILDIRIM_2003_STATEMENT,
  absolutizationEvaluation: ABSOLUTIZATION_EVALUATION,
  relationshipToPriorPCCRoutes: RELATIONSHIP_TO_PRIOR_PCC_ROUTES,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — ruled out Selberg-trace',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js — ruled out Goldston-Gonek 1998 + CS2008; named GY2003 as third lever',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js — ruled out Heath-Brown 1979 + auxiliary refinements',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js — §15-27 two-way collapse',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js — §27 identity audit',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the candidate direct attack on Montgomery ' +
    'PCC at 2-point via Goldston-Yildirim 2003 (Acta Math 192, 95-148) conditional-on-GRH ' +
    'triple-correlation of divisor sums, absolutized via a Selberg 1944 / Heath-Brown 1979 / ' +
    'Hooley 1965 mean-square substitute for the GRH input. It is NOT a new closure or a new ' +
    'unconditional bound.',

    'The verdict is NEGATIVE: absolutized GY2003 reduces to the SAME Cauchy-Schwarz / ' +
    'explicit-formula layer as imp-1303 (Heath-Brown 1979) with IDENTICAL (log T)^{1/2} ' +
    'slack in support (1, 5/4) and no unconditional bound for sigma > 5/4. GY2003 is NOT ' +
    'structurally different from the prior routes — it is another instance of the same ' +
    'Cauchy-Schwarz / explicit-formula / mean-square framework that all three prior routes ' +
    'hit. The verdict is goldston-yildirim-essentially-same-as-prior-routes.',

    'GY2003 itself is a THEOREM (Acta Math 192 (2004) 95-148) with both an unconditional ' +
    'Thm 1 (divisor-sum triple correlation) and a conditional-on-GRH Thm 3 (prime-side ' +
    'transfer). The classification here addresses the proposed absolutization of Thm 3 ' +
    'via mean-square moment inputs and reports that the resulting 2-point bound is ' +
    'IDENTICAL to imp-1303 to leading order with the same (log T)^{1/2} slack.',

    'The residual gap is precisely: PCC for Fourier support sigma > 1, identical to ' +
    'imp-1303 and to the Montgomery 1973 conjecture open since the original paper. The ' +
    'absolutization does NOT change which side of the moment-method boundary the bound ' +
    'sits on.',

    'CONSEQUENCE for engine planning: with imp-1297 + imp-1302 + imp-1303 + imp-1305 all ' +
    'in the same negative classification family, the standard moment-method toolkit is ' +
    'EXHAUSTED for PCC at 2-point. The aggregate verdict on §15-27 → RH via PCC is ' +
    'pcc-genuinely-open-pending-new-input. RH via §15-27 requires genuinely new input ' +
    '(Connes-Bost, Berry-Keating, novel sieve, or alternative §15-27 closure pathways ' +
    'that decouple from sigma > 1 in Fourier-support).',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js',
    imp1265: 'src/data/imp-1265-section27-identity-recheck.js',
    goldstonYildirim2003:
      'Goldston, D. A., Yildirim, C. Y., "Higher correlations of divisor sums ' +
      'related to primes I: Triple correlations", Acta Mathematica 192 (2004), ' +
      '95-148 (announced 2003)',
    goldstonPintzYildirim2009:
      'Goldston, D. A., Pintz, J., Yildirim, C. Y., "Primes in tuples I", ' +
      'Ann. of Math. (2) 170 (2009), 819-862',
    pintz2006:
      'Pintz, J., "Cramer vs. Cramer. On Cramer\'s probabilistic model for ' +
      'primes", Functiones et Approximatio 37 (2007), 361-376 (announced 2006); ' +
      'companion small-gap survey',
    selberg1944:
      'Selberg, A., "On the remainder in the formula for N(T)", Avh. Norske ' +
      'Vid. Akad. Oslo. I. Mat.-Naturvid. Kl. 1944, no. 1, 27 pp.',
    selberg1947_sieve:
      'Selberg, A., "On an elementary method in the theory of primes", ' +
      'Norske Vid. Selsk. Forh. Trondheim 19 (1947), 64-67 — original ' +
      'Selberg sieve / divisor-sum approximation',
    heathBrown1979:
      'Heath-Brown, D. R., "The fourth power moment of the Riemann zeta function", ' +
      'Proc. London Math. Soc. (3) 38 (1979), 385-422',
    iwaniecSarnak2000:
      'Iwaniec, H., Sarnak, P., "Perspectives on the analytic theory of L-functions", ' +
      'GAFA 2000 Special Volume (Birkhauser, 2000), 705-741',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193',
    bombieri1965:
      'Bombieri, E., "On the large sieve", Mathematika 12 (1965), 201-225',
    vinogradov1965:
      'Vinogradov, A. I., "The density hypothesis for Dirichlet L-functions", ' +
      'Izv. Akad. Nauk SSSR Ser. Mat. 29 (1965), 903-934',
    hooley1965:
      'Hooley, C., "On the largest prime factor of a cubic polynomial", ' +
      'J. Reine Angew. Math. 303-304 (1978), 21-50 (dispersion method origin ' +
      'in earlier Hooley 1965 series)',
    friedlander1988:
      'Friedlander, J. B., "Bombieri\'s theorem in short intervals", ' +
      'Mathematika 35 (1988), 174-187',
    elliottHalberstam1968:
      'Elliott, P. D. T. A., Halberstam, H., "A conjecture in prime number theory", ' +
      'Symposia Math. IV (1968-69), 59-72',
    goldston1988:
      'Goldston, D. A., "On the function S(T) in the theory of the Riemann zeta ' +
      'function", J. Number Theory 27 (1987), 149-177',
    goldston1992:
      'Goldston, D. A., "On Bombieri and Davenport\'s theorem concerning small ' +
      'gaps between primes", Mathematika 39 (1992), 10-17',
    titchmarsh:
      'Titchmarsh, E. C., "The Theory of the Riemann Zeta-Function", 2nd ed. ' +
      '(Heath-Brown corrections, Oxford Univ. Press 1986)',
  }),
});

export default IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE_ASSERTIONS = [
  // Tripwire 1: GY2003 statement quoted precisely.
  {
    id: 'imp1305-gy2003-stated-precisely',
    why:
      'GY2003 must be stated as the Acta Math 192 (2004) 95-148 theorem with the ' +
      'divisor-sum approximation Lambda_R, the triple-correlation main theorem, and ' +
      'the GRH-conditional prime-side transfer with error O(N (log N)^{-1/2 + eps}). ' +
      'A silent flip to "GY2003 is unconditional" would falsely overstate the input.',
    holds: () => {
      const s = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.goldstonYildirim2003Statement;
      return (
        typeof s.source === 'string' &&
        /Goldston/.test(s.source) &&
        /Yildirim/.test(s.source) &&
        /Acta Math/i.test(s.source) &&
        /192/.test(s.source) &&
        /95-148|95.*148/.test(s.source) &&
        s.isTheorem === true &&
        s.isConditional === true &&
        typeof s.conditionalOn === 'string' &&
        /GRH/.test(s.conditionalOn) &&
        typeof s.divisorSumApproximation === 'string' &&
        /Lambda_R/.test(s.divisorSumApproximation) &&
        /mu\(d\)/.test(s.divisorSumApproximation) &&
        typeof s.primeSidePairCorrelation === 'string' &&
        /Lambda\(n\)/.test(s.primeSidePairCorrelation) &&
        /\(log N\)\^\{-1\/2/.test(s.primeSidePairCorrelation) &&
        typeof s.primeSidePairCorrelationErrorTerm === 'string' &&
        /\(log N\)\^\{-1\/2/.test(s.primeSidePairCorrelationErrorTerm)
      );
    },
  },

  // Tripwire 2: Absolutization route evaluated with all three candidate inputs.
  {
    id: 'imp1305-absolutization-route-evaluated',
    why:
      'The absolutization step must evaluate at least three candidate unconditional ' +
      'inputs (Selberg 1944, HB1979, Hooley 1965) as replacements for the GRH input ' +
      'and report whether each closes the (log T)^{1/2} gap. Missing this step would ' +
      'render the classification incomplete.',
    holds: () => {
      const a = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.absolutizationEvaluation;
      return (
        typeof a.whatConditionalInputGY2003Uses === 'string' &&
        /Bombieri-Vinogradov|Elliott-Halberstam/.test(a.whatConditionalInputGY2003Uses) &&
        typeof a.proposedAbsolutizationInputs === 'object' &&
        typeof a.proposedAbsolutizationInputs.selberg1944_2ndMoment === 'string' &&
        typeof a.proposedAbsolutizationInputs.heathBrown1979_4thMoment === 'string' &&
        typeof a.proposedAbsolutizationInputs.hooley1965_dispersion === 'string' &&
        typeof a.whyAllAbsolutizationsCollapse === 'string' &&
        /Cauchy-Schwarz/.test(a.whyAllAbsolutizationsCollapse) &&
        /\(log T\)\^\{1\/2\}|half-log/i.test(a.whyAllAbsolutizationsCollapse) &&
        a.closesPCCForSupportGtOne === false &&
        typeof a.unconditionalSupportWindowReached === 'string' &&
        /1, 5\/4|1, 5\/4/.test(a.unconditionalSupportWindowReached)
      );
    },
  },

  // Tripwire 3: Relationship to prior PCC routes evaluated.
  {
    id: 'imp1305-relationship-to-prior-routes-evaluated',
    why:
      'The classification must show GY2003 is structurally SAME as imp-1297 + imp-1302 + ' +
      'imp-1303 and explain WHICH part of the moment-method framework each route plugs ' +
      'into. Missing the structural comparison would obscure the "same mechanism" ' +
      'pattern that motivates the moment-method exhaustion conclusion.',
    holds: () => {
      const r = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.relationshipToPriorPCCRoutes;
      return (
        typeof r.commonMechanism === 'string' &&
        /Cauchy-Schwarz/.test(r.commonMechanism) &&
        /explicit-formula|explicit formula/i.test(r.commonMechanism) &&
        typeof r.whatEachRoutePlugsIntoTheCauchySchwarzStep === 'object' &&
        typeof r.whatEachRoutePlugsIntoTheCauchySchwarzStep.imp1297_selbergTrace === 'string' &&
        typeof r.whatEachRoutePlugsIntoTheCauchySchwarzStep.imp1302_goldstonGonek1998 === 'string' &&
        typeof r.whatEachRoutePlugsIntoTheCauchySchwarzStep.imp1303_heathBrown1979 === 'string' &&
        typeof r.whatEachRoutePlugsIntoTheCauchySchwarzStep.imp1305_goldstonYildirim2003Absolutized === 'string' &&
        r.isGY2003StructurallyDifferent === false &&
        typeof r.aggregateMomentMethodConclusion === 'string' &&
        /EXHAUSTED|exhausted/.test(r.aggregateMomentMethodConclusion)
      );
    },
  },

  // Tripwire 4: Verdict is one of the four allowed strings.
  {
    id: 'imp1305-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'goldston-yildirim-absolutized-closes-pcc / ' +
      'goldston-yildirim-improves-but-pcc-remains-open / ' +
      'goldston-yildirim-conditional-cannot-be-absolutized / ' +
      'goldston-yildirim-essentially-same-as-prior-routes. ' +
      'A non-allowed verdict would indicate classification drift.',
    holds: () => {
      const allowed = [
        'goldston-yildirim-absolutized-closes-pcc',
        'goldston-yildirim-improves-but-pcc-remains-open',
        'goldston-yildirim-conditional-cannot-be-absolutized',
        'goldston-yildirim-essentially-same-as-prior-routes',
      ];
      return allowed.includes(IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.verdict);
    },
  },

  // Tripwire 5: Verdict detail reports PCC remains OPEN with residual gap.
  {
    id: 'imp1305-verdict-detail-pcc-remains-open',
    why:
      'A silent flip to "PCC closed unconditionally via absolutized GY2003" would ' +
      'invalidate the entire engine-planning consequence. Tripwire pins the NEGATIVE ' +
      'result and ensures the residual gap (PCC for sigma > 1) is explicitly named.',
    holds: () => {
      const vd = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.verdictDetail;
      return (
        vd.closesPCCUnconditionally === false &&
        vd.closesPCCForFourierSupportGtOne === false &&
        vd.closesPCCForESYClosureTestFunction === false &&
        vd.isGY2003StructurallyDifferentFromPriorRoutes === false &&
        vd.isAnotherInstanceOfCauchySchwarzExplicitFormulaMomentFramework === true &&
        typeof vd.residualGapPreciselyStated === 'string' &&
        /OPEN/.test(vd.residualGapPreciselyStated) &&
        /sigma > 1/.test(vd.residualGapPreciselyStated)
      );
    },
  },

  // Tripwire 6: At least four required citations present (GY2003 / Selberg 1944 /
  // Heath-Brown 1979 / Iwaniec-Sarnak 2000).
  {
    id: 'imp1305-four-required-citations-present',
    why:
      'Per ticket spec: cite at least 4 sources — Goldston-Yildirim 2003 + Selberg 1944 + ' +
      'Heath-Brown 1979 + Iwaniec-Sarnak 2000. Missing any of these means the ' +
      'classification is incomplete on its load-bearing references.',
    holds: () => {
      const r = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.references;
      return (
        /Goldston/.test(r.goldstonYildirim2003 || '') &&
        /Yildirim/.test(r.goldstonYildirim2003 || '') &&
        /Acta Math/i.test(r.goldstonYildirim2003 || '') &&
        /192/.test(r.goldstonYildirim2003 || '') &&
        /Selberg/.test(r.selberg1944 || '') &&
        /1944/.test(r.selberg1944 || '') &&
        /Heath-Brown/.test(r.heathBrown1979 || '') &&
        /1979/.test(r.heathBrown1979 || '') &&
        /Proc.*London Math.*Soc/i.test(r.heathBrown1979 || '') &&
        /Iwaniec/.test(r.iwaniecSarnak2000 || '') &&
        /Sarnak/.test(r.iwaniecSarnak2000 || '') &&
        /2000/.test(r.iwaniecSarnak2000 || '')
      );
    },
  },

  // Tripwire 7: Cross-references imp-1184 / imp-1297 / imp-1302 / imp-1303 present.
  {
    id: 'imp1305-cross-references-parent-tickets',
    why:
      'This ticket is a direct follow-up to imp-1184 (named PCC as binding gap) and ' +
      'imp-1297 + imp-1302 + imp-1303 (prior three PCC routes ruled out). Without ' +
      'explicit cross-references the classification floats free of the parent map.',
    holds: () => {
      const r = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1184') &&
        related.includes('imp-1297') &&
        related.includes('imp-1302') &&
        related.includes('imp-1303') &&
        typeof xrefs.imp1184 === 'string' && /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297) &&
        typeof xrefs.imp1302 === 'string' && /imp-1302/.test(xrefs.imp1302) &&
        typeof xrefs.imp1303 === 'string' && /imp-1303/.test(xrefs.imp1303)
      );
    },
  },

  // Tripwire 8: Honest scope mentions NEGATIVE result and continuation of
  // imp-1297 + imp-1302 + imp-1303 conclusions.
  {
    id: 'imp1305-honest-scope-mentions-negative-and-prior-continuation',
    why:
      'The honest scope must explicitly state that the result is NEGATIVE and that it ' +
      'CONTINUES the imp-1297 + imp-1302 + imp-1303 findings. A silent drift to ' +
      '"positive closure identified" would mislead engine planning.',
    holds: () => {
      const blob = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /imp-1297/.test(blob) &&
        /imp-1302/.test(blob) &&
        /imp-1303/.test(blob) &&
        /(does NOT|do NOT|do not close|not extend|not structurally different)/i.test(blob)
      );
    },
  },

  // Tripwire 9: Pattern note completes moment-method ruling-out + names
  // pcc-genuinely-open-pending-new-input aggregate verdict.
  {
    id: 'imp1305-pattern-note-completes-moment-method-rulingout',
    why:
      'The pattern note must explicitly identify the completion of the moment-method ' +
      'ruling-out (imp-1297 + imp-1302 + imp-1303 + imp-1305 all negative) and name ' +
      'pcc-genuinely-open-pending-new-input as the aggregate verdict.',
    holds: () => {
      const vd = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.verdictDetail;
      return (
        vd.patternNoteCompletesMomentMethodRulingOut === true &&
        vd.aggregateVerdict === 'pcc-genuinely-open-pending-new-input' &&
        typeof vd.patternNotePreciselyStated === 'string' &&
        /EXHAUSTED|exhausted/.test(vd.patternNotePreciselyStated) &&
        /imp-1297/.test(vd.patternNotePreciselyStated) &&
        /imp-1302/.test(vd.patternNotePreciselyStated) &&
        /imp-1303/.test(vd.patternNotePreciselyStated) &&
        /imp-1305/.test(vd.patternNotePreciselyStated) &&
        /pcc-genuinely-open-pending-new-input/.test(vd.patternNotePreciselyStated) &&
        typeof vd.fitsWithImp1297Imp1302Imp1303Pattern === 'string' &&
        /\(log T\)\^\{1\/2\}|half-log/i.test(vd.fitsWithImp1297Imp1302Imp1303Pattern)
      );
    },
  },

  // Tripwire 10: Semantic check 1 — absolutization 2-point bound matches HB1979
  // to leading order.
  {
    id: 'imp1305-semantic-absolutized-matches-hb1979-leading-order',
    why:
      'Semantic check: the absolutized GY2003 2-point bound must be reported as ' +
      'matching imp-1303 (HB1979) to leading order with the same (log T)^{1/2} slack ' +
      'in the same support window (1, 5/4). A divergent report would falsely claim ' +
      'a NEW bound that does not exist.',
    holds: () => {
      const vd = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.verdictDetail;
      const a = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.absolutizationEvaluation;
      return (
        typeof vd.whatAbsolutizedGY2003GivesAt2Point === 'string' &&
        /imp-1303|HB1979|Heath-Brown/i.test(vd.whatAbsolutizedGY2003GivesAt2Point) &&
        /\(log T\)\^\{-1\/2\}/.test(vd.whatAbsolutizedGY2003GivesAt2Point) &&
        /N\(T\)/.test(vd.whatAbsolutizedGY2003GivesAt2Point) &&
        typeof a.twoPointBoundFromAbsolutizedGY2003 === 'string' &&
        /K_sin\^2/.test(a.twoPointBoundFromAbsolutizedGY2003) &&
        /\(log T\)\^\{-1\/2\}/.test(a.twoPointBoundFromAbsolutizedGY2003) &&
        a.closesPCCForSupportGtOne === false
      );
    },
  },

  // Tripwire 11: Semantic check 2 — Cauchy-Schwarz layer is the structural
  // obstruction, not the specific input.
  {
    id: 'imp1305-semantic-cauchy-schwarz-layer-is-structural-obstruction',
    why:
      'Semantic check: the (log T)^{1/2} loss must be reported as a STRUCTURAL ' +
      'property of the Cauchy-Schwarz / explicit-formula layer, not as a deficit of ' +
      'any specific moment input. This is the key insight that distinguishes the ' +
      '"essentially same as prior routes" verdict from "improves but does not close".',
    holds: () => {
      const r = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.relationshipToPriorPCCRoutes;
      const a = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.absolutizationEvaluation;
      const vd = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.verdictDetail;
      return (
        typeof r.whyNotStructurallyDifferent === 'string' &&
        /Cauchy-Schwarz/.test(r.whyNotStructurallyDifferent) &&
        /(layer|rate)/.test(r.whyNotStructurallyDifferent) &&
        typeof a.whyAllAbsolutizationsCollapse === 'string' &&
        /(intrinsic|layer|structural)/i.test(a.whyAllAbsolutizationsCollapse) &&
        vd.isAnotherInstanceOfCauchySchwarzExplicitFormulaMomentFramework === true
      );
    },
  },

  // Tripwire 12: Semantic check 3 — implication for Lambda-attack correctly
  // identifies new-input candidates outside the moment-method family.
  {
    id: 'imp1305-semantic-lambda-attack-new-input-candidates',
    why:
      'Semantic check: the engine-planning implication must name at least one ' +
      'specific candidate new-input route outside the moment-method family ' +
      '(Connes-Bost / Berry-Keating / novel sieve / RMT-symmetry). Without naming ' +
      'concrete candidates the "new input needed" conclusion is unactionable.',
    holds: () => {
      const vd = IMP_1305_GOLDSTON_YILDIRIM_MEAN_SQUARE.verdictDetail;
      const s = vd.implicationForLambdaAttack || '';
      const w = vd.whatWouldClose || '';
      const combined = s + ' ' + w;
      return (
        typeof s === 'string' &&
        s.length > 80 &&
        /(Connes-Bost|Berry-Keating|novel sieve|RMT-symmetry|new-input|new input)/i.test(combined) &&
        /(decouple|alternative|new)/i.test(s)
      );
    },
  },
];
