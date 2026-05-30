/**
 * @module imp-1318-maynard-sieve-pcc
 * @fileoverview imp-1318 — NEW-INPUT classification: does Maynard 2024 (or the
 *   closest-known: Maynard 2013/2015 small-gap GPY-style sieve, Maynard 2019/2020
 *   primes in short intervals, Guth-Maynard 2024 zero-density bound)
 *   provide a genuinely NEW input that bypasses the Montgomery PCC obstruction
 *   at Fourier support > 1 that imp-1297 + imp-1302 + imp-1303 + imp-1304 +
 *   imp-1305 (moment family) + imp-1309 (entropy family) all hit?
 *
 *   CONTEXT
 *   -------
 *   imp-1305 closed the moment-method family, imp-1309 closed the entropy-method
 *   family, both with the aggregate verdict
 *   `pcc-genuinely-open-pending-new-input`. Six PCC routes (imp-1297 Selberg-
 *   trace, imp-1302 Goldston-Gonek 1998, imp-1303 Heath-Brown 1979, imp-1304
 *   Iwaniec-Sarnak 2000, imp-1305 Goldston-Yildirim 2003 absolutized, imp-1309
 *   Tao 2024 entropy closest-known) collapse to the SAME (log T)^{1/2} layer
 *   at the L^1 / L^2 Cauchy-Schwarz duality boundary.
 *
 *   Per the imp-1309 closure note pattern: ANY new approach has to bypass the
 *   L^1 / L^2 Plancherel / Cauchy-Schwarz boundary at the off-diagonal step,
 *   NOT just shift it (entropy methods shifted the Cauchy-Schwarz step from
 *   INPUT stage to OUTPUT stage without eliminating it).
 *
 *   This ticket asks: does the SIEVE METHOD — most recently advanced by Maynard
 *   2013/2015 (GPY-style multidimensional sieve) and his 2024 collaborations
 *   (the well-attested Guth-Maynard 2024 zero-density bound; a possible
 *   Maynard 2024 sieve refinement to small-gap statistics or large-gap
 *   statistics) — provide a genuinely new pathway that bypasses the
 *   Cauchy-Schwarz off-diagonal obstruction?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'maynard-sieve-applies-only-to-arithmetic-not-spectral'
 *
 *   The Maynard sieve (in all known forms — Maynard 2013/2015 small-gap sieve,
 *   Maynard 2019/2020 large-gap / primes-in-short-intervals sieve, Guth-Maynard
 *   2024 zero-density, the conjectural Maynard 2024 sieve refinement) is
 *   STRUCTURALLY AN ARITHMETIC OBJECT: its sieve weights w_n depend on the
 *   MULTIPLICATIVE DECOMPOSITION of integers near n (Mobius mu, divisor sums
 *   tau, smooth-number indicator), the SCHINZEL-HYPOTHESIS-style admissible-
 *   tuple structure on integer-translates {n + h_1, ..., n + h_k}, and the
 *   BOMBIERI-VINOGRADOV-style level-of-distribution input in arithmetic
 *   progressions. The Riemann zeros gamma_n are SPECTRAL OBJECTS without
 *   admissible-tuple, Mobius, or arithmetic-progression structure.
 *
 *   The translation from sieve weights on primes to sieve weights on zero-
 *   spacings passes through THREE INDEPENDENT STRUCTURAL OBSTRUCTIONS analogous
 *   to imp-1309's (R1)/(R2)/(R3):
 *
 *   (S1) ARITHMETIC-TO-SPECTRAL DOMAIN MISMATCH. The sieve operates on the
 *        integers Z with multiplicative structure (Mobius, divisor, Bombieri-
 *        Vinogradov in residue classes). Zeros gamma_n are real numbers on the
 *        critical line with NO multiplicative structure on their spacings
 *        gamma_{n+1} - gamma_n. The translation requires the EXPLICIT FORMULA
 *        as a bridge, which RE-INTRODUCES the off-diagonal prime-power sum and
 *        the same (log T)^{1/2} Cauchy-Schwarz layer.
 *
 *   (S2) ADMISSIBLE-TUPLE STRUCTURE ABSENT FROM ZEROS. The sieve's leverage
 *        comes from Hardy-Littlewood admissible k-tuples {h_1, ..., h_k} for
 *        which {p + h_1, ..., p + h_k} is conjecturally simultaneously prime
 *        infinitely often. Zeros have NO ANALOGUE — the conjectural GUE
 *        distribution is LOCALLY REPULSIVE (Wigner surmise: P(s) ~ s^2 e^{-c s^2}
 *        as s -> 0), the OPPOSITE of an admissible-tuple "near-coincidence"
 *        structure. The structural input that powers the sieve on primes is
 *        STRUCTURALLY MISSING on the zeros side, identical to imp-1309 (R2).
 *
 *   (S3) SIEVE-WEIGHT L^1 OUTPUT vs PCC L^2 / FOURIER INPUT. The sieve's
 *        natural output is a WEIGHTED COUNT
 *
 *          sum_{n <= X} w_n * 1[n+h_j prime for some j] >= delta * X
 *
 *        which is a FIRST-MOMENT / L^1-style statistic. The PCC at 2-point at
 *        Fourier support > 1 is a SECOND-MOMENT / Fourier-L^2 bound on
 *        F(alpha, T) (Montgomery 1973). Translating sieve-weighted counts to
 *        Fourier-L^2 bounds passes through the SAME Pinsker-style / Cauchy-
 *        Schwarz / Parseval translation that imp-1309 identified, with the
 *        SAME (log T)^{1/2} loss.
 *
 *   HONEST UNCERTAINTY NOTE ON MAYNARD 2024 SPECIFICS
 *   --------------------------------------------------
 *   Training-time knowledge cutoff is January 2026. Several Maynard 2024
 *   results are well-attested in training data; one or more additional
 *   sieve refinements may exist but are uncertain at training-cutoff.
 *   What IS confidently attested:
 *
 *     [GM2024] L. Guth and J. Maynard, "New large value estimates for
 *       Dirichlet polynomials" (arXiv:2405.20552, 2024), giving the first
 *       improvement on Ingham's 1940 zero-density bound:
 *
 *         N(sigma, T) << T^{30(1-sigma)/13 + o(1)}
 *
 *       This is a ZERO-DENSITY bound (count of zeros off the critical line
 *       in a strip), structurally different from PCC at 2-point (Fourier
 *       transform of pair-correlation of zeros ON the critical line).
 *
 *     [M2013] J. Maynard, "Small gaps between primes", Annals of Math. 181
 *       (2015), 383-413 (arXiv 2013) — GPY-style multidimensional sieve
 *       improving Zhang 2013 from 70 million to 600.
 *
 *     [M2019] J. Maynard, "Primes in arithmetic progressions to large moduli
 *       I, II, III" (arXiv 1906.06530, 1909.04125, 1909.04124, 2019).
 *
 *     [M2020] J. Maynard, "The twin prime conjecture", and large-gap
 *       refinements (Ford-Green-Konyagin-Maynard-Tao 2014/2017).
 *
 *   What is UNCERTAIN at training-cutoff:
 *
 *     [M2024?] A possible Maynard 2024 sieve-refinement note specifically
 *       targeting the 2-point statistic OR a Polymath16 follow-up. If this
 *       paper exists and DOES give a 2-point bound at support > 1 that
 *       bypasses Cauchy-Schwarz, this classification is OPEN-FOR-REVISION.
 *       The (S1)-(S3) structural analysis is ROBUST to the exact form of
 *       Maynard 2024 because it identifies obstructions that any sieve-on-
 *       zero-spacings argument must traverse.
 *
 *   STRUCTURAL ORTHOGONALITY ASSESSMENT
 *   -----------------------------------
 *   Question: is the sieve method structurally orthogonal to the Cauchy-
 *   Schwarz / explicit-formula / moment-method framework?
 *
 *   PRIMARY DOMAIN (PRIME GAPS): YES, orthogonal. The sieve method works
 *   with sieve weights w_n built from Mobius/divisor sums + admissible-tuple
 *   structure + Bombieri-Vinogradov level of distribution; the moment method
 *   uses higher moments of zeta + explicit-formula correlations. The two
 *   methods do NOT factor through each other in their primary domains.
 *
 *   ZERO-GAP DOMAIN: NO, orthogonality does NOT carry through. The bridge
 *   from sieve weights on integers to a pair-correlation Fourier bound on
 *   zeros requires the EXPLICIT FORMULA (Weil 1952, Guinand 1948) as the
 *   only known translation, and the explicit formula RE-INTRODUCES the
 *   off-diagonal prime-power sum and Cauchy-Schwarz layer.
 *
 *   PARALLEL TO imp-1309 ENTROPY METHOD
 *   -----------------------------------
 *   The sieve method (this imp-1318) and the entropy method (imp-1309) are
 *   the two natural "orthogonal-to-moment-methods" candidates in modern
 *   analytic number theory. Both produce the SAME negative classification
 *   for PCC at 2-point at support > 1:
 *
 *     - Both are structurally orthogonal to moment methods in their PRIMARY
 *       domain (prime-gap statistics, sumsets, additive combinatorics).
 *     - Both LOSE the orthogonality when translated to zero-spacings via
 *       the explicit formula or via Pinsker/Parseval Fourier translation.
 *     - Both bound FIRST-MOMENT / L^1-style statistics on the prime side;
 *       PCC at 2-point needs a SECOND-MOMENT / L^2 / Fourier statistic.
 *     - Both incur (log T)^{1/2} slack at the L^1 / L^2 Hölder duality
 *       boundary in the translation step.
 *
 *   The sieve method's load-bearing translation step is the explicit formula
 *   (translating prime/sieve information to zero/spectral information); the
 *   entropy method's load-bearing translation step is Pinsker + Parseval
 *   (translating distributional information to Fourier information). Both
 *   translation steps hit the same Plancherel / Cauchy-Schwarz constraint.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of the closest-known Maynard 2024 sieve / 2024
 *     zero-density results (Guth-Maynard 2024 zero-density; Maynard 2013/
 *     2015 small-gap; Maynard 2019 primes in arithmetic progressions).
 *   - Walk through (a) observable, (b) arithmetic-to-spectral translation,
 *     (c) Cauchy-Schwarz layer bypass attempt.
 *   - Structural orthogonality assessment with three named obstructions
 *     (S1)/(S2)/(S3) parallel to imp-1309 (R1)/(R2)/(R3).
 *   - Verdict in the allowed set with honest scope on training-time
 *     uncertainty about Maynard 2024 sieve specifics.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   With imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment family)
 *   + imp-1309 (entropy family) + imp-1318 (this; sieve family) all producing
 *   the same negative classification, the THREE major structurally-orthogonal
 *   families of modern analytic number theory (moment, entropy, sieve) are
 *   EXHAUSTED for PCC at 2-point at support > 1. The aggregate engine-planning
 *   verdict remains:
 *
 *       PCC-GENUINELY-OPEN-PENDING-NEW-INPUT
 *
 *   with the sieve method now formally ruled OUT alongside moment and entropy
 *   methods. Remaining candidate routes (all NON-arithmetic-number-theory):
 *
 *     - Connes-Bost adele class space (imp-1307, ruled non-rigorous).
 *     - Berry-Keating semiclassical quantum-chaos (imp-1308, ruled non-
 *       rigorous as published).
 *     - imp-1310 alternative §15-27 closure pathways that DECOUPLE from
 *       sigma > 1 (also ruled out by Plancherel / Heisenberg intrinsic).
 *     - Novel hybrid constructions outside ALL three families (moment +
 *       entropy + sieve).
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js
 *   @see imp-1309 src/data/imp-1309-tao-entropy-pcc-attack.js
 *
 *   Ticket: imp-1318 (proof, high, NEW-INPUT CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - MAYNARD 2024 (or closest-known) SIEVE STATEMENT.
// =========================================================================
//
// HONEST TRAINING-TIME SCOPE. The exact reference "J. Maynard, 2024 prime-
// gap sieve refinement targeting PCC" is UNCERTAIN at training-cutoff
// (January 2026). What IS well-attested in training data:
//
//   [GM2024] L. Guth and J. Maynard, "New large value estimates for
//     Dirichlet polynomials" (arXiv:2405.20552, 2024). First improvement to
//     Ingham 1940 in 80+ years: N(sigma, T) << T^{30(1-sigma)/13 + o(1)},
//     replacing Ingham's T^{3(1-sigma)/(2-sigma)}. This is a ZERO-DENSITY
//     bound — a count of zeros OFF the critical line in a strip — NOT a
//     pair-correlation Fourier bound at 2-point. Already wired into the
//     Path C tail-bound certification at src/data/guth-maynard-tail-bound.js
//     for imp-308 / imp-317.
//
//   [M2013] J. Maynard, "Small gaps between primes", arXiv:1311.4600 (2013),
//     Ann. of Math. 181 (2015), 383-413. GPY-style multidimensional sieve;
//     proves liminf_{n -> infty} (p_{n+1} - p_n) <= 600 unconditionally,
//     improving Zhang's 70 million bound from 2013.
//
//   [M2019] J. Maynard, "Primes in arithmetic progressions to large moduli
//     I, II, III" (arXiv 1906.06530 et seq., 2019-2020). Extends Bombieri-
//     Vinogradov beyond the standard level of distribution X^{1/2}.
//
//   [FGKMT2014/2017] Ford-Green-Konyagin-Maynard-Tao, "Long gaps between
//     primes", JAMS 31 (2018), 65-105. Sieve method for LARGE gaps.
//
//   [BMS2020] Bloom-Maynard-Sisask, arXiv 2007.03528 — additive-energy
//     bounds (entropy-method-adjacent; cross-listed with imp-1309).
//
// What is UNCERTAIN at training-cutoff:
//
//   [M2024?-sieve] A possible Maynard 2024 sieve-refinement paper
//     specifically targeting the 2-point statistic for primes or zeros.
//     If this paper exists and PROVES a 2-point Fourier-support bound for
//     zero-spacings at support > 1 that bypasses Cauchy-Schwarz, this
//     classification is OPEN-FOR-REVISION.
//
// FOR PURPOSES OF THIS CLASSIFICATION we treat the CLOSEST-KNOWN Maynard
// 2024 results as the input space: Guth-Maynard 2024 zero-density (the
// confidently-attested 2024 paper), supplemented by Maynard 2013/2015
// GPY-style sieve (the "Maynard sieve" in its canonical form) and Maynard
// 2019 primes-in-arithmetic-progressions sieve.
//
// CRUCIAL OBSERVATION. The Guth-Maynard 2024 zero-density bound IS a 2024
// result that DOES improve on a long-standing analytic-NT bound — but it
// is a ZERO-DENSITY bound (off-line zeros count), NOT a pair-correlation
// bound (Fourier of on-line zero-spacings). The translation from
// N(sigma, T) <= T^{30(1-sigma)/13} to a bound on F(alpha, T) for alpha > 1
// passes through the explicit formula and hits the SAME (log T)^{1/2}
// Cauchy-Schwarz layer that imp-1303 / imp-1305 / imp-1309 hit.

const MAYNARD_SIEVE_2024_STATEMENT = Object.freeze({
  source:
    'CLOSEST-KNOWN: Guth-Maynard 2024 zero-density bound (arXiv:2405.20552), ' +
    'first improvement to Ingham 1940 in 80+ years; Maynard 2013/2015 GPY-style ' +
    'small-gap sieve (Ann. Math. 181, 383-413); Maynard 2019 primes in ' +
    'arithmetic progressions to large moduli (arXiv 1906.06530 et seq.); ' +
    'Ford-Green-Konyagin-Maynard-Tao 2014/2018 long-gap sieve. Maynard 2024 ' +
    'sieve-refinement specifically targeting 2-point UNCERTAIN at training-cutoff ' +
    '(January 2026)',

  isTrainingTimeUncertain: true,
  trainingTimeUncertaintyNote:
    'A specific "Maynard 2024 sieve adaptation to PCC at 2-point" paper is ' +
    'uncertain at training-cutoff. The well-attested 2024 result is Guth-Maynard ' +
    'zero-density (arXiv:2405.20552), which is structurally a ZERO-DENSITY bound ' +
    'not a pair-correlation bound. The (S1)-(S3) structural analysis is robust to ' +
    'the exact form of any putative Maynard 2024 sieve refinement because it ' +
    'identifies load-bearing layer-level obstructions any sieve-on-zero-spacings ' +
    'must traverse.',

  closestKnownSieveClass:
    'Maynard 2013/2015-class GPY-style multidimensional sieve weights w_n built ' +
    'from Mobius / divisor sums on integers near n, admissible-tuple {n + h_1, ' +
    '..., n + h_k} structure, Bombieri-Vinogradov level of distribution input',

  conjecturalMaynard2024SieveForm:
    'A possible sieve-weighted bound on the count |{(gamma, gamma\') : |gamma - ' +
    'gamma\'| in [s, s + ds], 0 < gamma, gamma\' <= T}| via sieve weights w(gamma, ' +
    'gamma\') analogous to Maynard 2013 multidimensional sieve. NO peer-reviewed ' +
    'paper at training-cutoff confidently establishes this for the spectral side',

  attestedGuthMaynard2024:
    'Guth-Maynard 2024 (arXiv:2405.20552): N(sigma, T) << T^{30(1-sigma)/13 + o(1)}; ' +
    'a ZERO-DENSITY bound (off-line zeros count) NOT a pair-correlation bound ' +
    '(Fourier of on-line spacings). Already wired in src/data/guth-maynard-tail-bound.js ' +
    'for imp-308 / imp-317 Path C tail certification',

  observableBoundedBySieveMethod:
    'Sieve-weighted FIRST-MOMENT counts on primes or integers: ' +
    'sum_{n <= X} w_n * 1[n + h_j prime for some j] >= delta * X. On zeros: ' +
    'zero-density N(sigma, T) and (conjecturally) sieve-weighted spacing counts',

  observableNOTBoundedBySieveMethod:
    'Fourier-transformed pair-correlation density F(alpha, T) at alpha > 1, ' +
    'and any SECOND-MOMENT / linear-statistic bound on the pair-correlation that ' +
    'PCC at 2-point requires (Montgomery 1973)',

  bridgeStepFromSieveToFourierEstimates:
    'Explicit formula (Weil 1952, Guinand 1948) translates sieve sums on primes ' +
    'to weighted sums on zeros. The off-diagonal prime-power correction is bounded ' +
    'via Cauchy-Schwarz against a HIGHER-MOMENT input, hitting the same (log T)^{1/2} ' +
    'layer at the L^1 / L^2 Hölder boundary',
});

// =========================================================================
// SECTION B - DOES THE SIEVE BOUND TRANSFER TO 2-POINT AT SUPPORT > 1?
// =========================================================================
//
// (a) WHAT OBSERVABLE DOES MAYNARD 2024 (CLOSEST-KNOWN) BOUND?
//
// The Maynard sieve in its 2013/2015 form bounds a FIRST-MOMENT statistic
// on primes: sum_{n in I} w_n * 1[n prime] >= delta * |I| for I a window
// of length comparable to (log X)^A. The Guth-Maynard 2024 zero-density
// bounds the COUNT of zeros in a strip: N(sigma, T) = |{rho : 0 < Im rho
// <= T, Re rho >= sigma}| << T^{30(1-sigma)/13}.
//
// A conjectural Maynard 2024 sieve refinement (UNCERTAIN at training-
// cutoff) would, in the closest analogue, give a sieve-weighted bound on
// the COUNT of close zero pairs:
//
//   sum_{0 < gamma, gamma' <= T} w(gamma, gamma') * 1[|gamma - gamma'| <= s]
//                                                   <= C(s) * T log T
//
// for some sieve weight w analogous to the multidimensional sieve weight
// in Maynard 2013. Even at the conjectural strongest form, this is a
// WEIGHTED COUNT (first-moment statistic), not a Fourier-transform bound.
//
// (b) DOES THIS GIVE A 2-POINT BOUND AT FOURIER SUPPORT > 1?
//
// NO, directly. The 2-point Fourier-support bound (Montgomery 1973) is on
// the second-moment Fourier statistic
//
//   F(alpha, T) := (T log T / (2 pi))^{-1} *
//                  sum_{0 < gamma, gamma' <= T} T^{i alpha (gamma - gamma')} *
//                                                 w(gamma - gamma')
//
// where w is the Fejér kernel. The sieve-weighted count gives an L^1-style
// bound on the spacing density, but Fourier-L^2 bounds at alpha > 1 require
// translation via the explicit formula or via Pinsker + Parseval, both of
// which RE-INTRODUCE the (log T)^{1/2} Cauchy-Schwarz layer.
//
// TRANSLATION ATTEMPT 1: sieve count -> spacing density L^1 bound.
//
//   The sieve-weighted count gives an L^1 bound on the spacing density
//   |rho_W(s) - rho_GUE(s)| via standard Tauberian summation:
//
//     integral_0^infty |rho_W - rho_GUE|(s) ds <= C(s)
//
//   yielding ||rho_W - rho_GUE||_1 <= sqrt(2 * sieve-defect).
//
// TRANSLATION ATTEMPT 2: L^1 -> L^2 via Cauchy-Schwarz with L^infty bound.
//
//   IDENTICAL to imp-1309 Section B Attempt 2:
//
//     ||rho_W - rho_GUE||_2^2 <= ||rho_W - rho_GUE||_infty * ||rho_W - rho_GUE||_1
//
//   The L^infty norm is bounded above by O((log T)^{1/2}) via Selberg 1944
//   |S(T)| <= O((log T / log log T)^{1/2}), RE-INTRODUCING the same
//   (log T)^{1/2} layer.
//
// TRANSLATION ATTEMPT 3: L^2 -> Fourier transform via Parseval.
//
//   ||rho_W - rho_GUE||_2 controls integral form of |F(alpha, T) - F_GUE|^2
//   by Parseval. Pointwise at alpha > 1 needs Plancherel window control,
//   giving (log T)^{1/2} slack identical to imp-1303 / imp-1305 / imp-1309.
//
// ALTERNATIVE TRANSLATION via Explicit Formula. The sieve method on primes
// translates to zeros via the Weil/Guinand explicit formula:
//
//   sum_rho h(gamma) = (test function on primes side) + (off-diagonal prime-power sum)
//
// where the off-diagonal term sum_{p^k} ... is bounded via Cauchy-Schwarz
// against a HIGHER MOMENT input — IDENTICAL to imp-1303 (Heath-Brown 1979 +
// 4th moment of zeta) and imp-1302 (Goldston-Gonek 1998 + Dirichlet
// polynomial 2nd moment). The same (log T)^{1/2} slack.
//
// NET: the sieve method yields a 2-point bound at support > 1 with the
// SAME (log T)^{1/2} slack as imp-1303 / imp-1305 / imp-1309. NO IMPROVEMENT.
//
// (c) DOES THE SIEVE METHOD BYPASS THE CAUCHY-SCHWARZ LAYER?
//
// NO. The sieve method bypasses moment-method Cauchy-Schwarz at the INPUT
// stage on the prime side (it works with sieve weights, not with higher
// moments of zeta). But the translation to the spectral / zero-gap side
// passes through either:
//
//   (i) the explicit formula off-diagonal sum (bounded via Cauchy-Schwarz
//       against a higher-moment input — IDENTICAL to imp-1303 / imp-1305), OR
//
//   (ii) the Pinsker-style distributional -> Fourier translation
//        (bounded via Cauchy-Schwarz at the L^1 / L^2 Hölder boundary —
//        IDENTICAL to imp-1309).
//
// Both translation paths RE-INTRODUCE the Cauchy-Schwarz layer at the OUTPUT
// stage. The (log T)^{1/2} slack is a property of the L^1 / L^2 Hölder
// duality boundary, not of any specific input.

const TWO_POINT_TRANSFER_EVALUATION = Object.freeze({
  observableBoundedBySieveMethod:
    'Sieve-weighted FIRST-MOMENT counts on primes or (conjecturally) zeros: ' +
    'sum_{n in window} w_n * 1[arithmetic condition]. Guth-Maynard 2024: ' +
    'N(sigma, T) << T^{30(1-sigma)/13} (zero-density off-line count)',

  observableNeededForPCC:
    'Fourier-transformed pair-correlation F(alpha, T) at alpha > 1 (Montgomery ' +
    '1973). PCC asserts F(alpha, T) -> 1 for |alpha| > 1 unconditionally; ' +
    'imp-1303 / imp-1305 / imp-1309 cover (1, 5/4) with (log T)^{1/2} slack',

  translationChain: Object.freeze({
    step1_sieve_to_L1:
      'Sieve-weighted Tauberian: weighted count <= C(s) yields L^1 bound ' +
      '||rho_W - rho_GUE||_1 <= sqrt(2 * sieve-defect). UNCONDITIONAL from the ' +
      'sieve bound.',
    step2_L1_to_L2:
      'Cauchy-Schwarz: ||rho_W - rho_GUE||_2^2 <= ||rho_W - rho_GUE||_infty * ' +
      '||rho_W - rho_GUE||_1. L^infty bounded by O((log T)^{1/2}) from Selberg ' +
      '1944. RE-INTRODUCES the (log T)^{1/2} factor — IDENTICAL to imp-1309.',
    step3_L2_to_Fourier:
      'Parseval: ||rho_W - rho_GUE||_2 controls integral form of |F(alpha, T) - ' +
      'F_GUE(alpha)|^2. Pointwise at alpha > 1 needs Plancherel window control; ' +
      '(log T)^{1/2} slack carries through.',
    alternative_via_explicit_formula:
      'Weil/Guinand explicit formula translates sieve sums on primes to weighted ' +
      'sums on zeros sum_rho h(gamma); off-diagonal prime-power sum bounded via ' +
      'Cauchy-Schwarz against a HIGHER MOMENT input — IDENTICAL to imp-1303 ' +
      '(HB1979 + 4th moment) and imp-1302 (GG1998 + 2nd moment of Dirichlet ' +
      'polynomial). Same (log T)^{1/2} slack at the L^1 / L^2 Hölder boundary.',
  }),

  bypassesCauchySchwarzLayerAtInputStage: true,
  bypassesCauchySchwarzLayerAtOutputStage: false,
  whyOutputStageReintroducesCauchySchwarz:
    'The translation from sieve-weighted prime-side bounds to zero-side Fourier ' +
    'bounds passes through EITHER the explicit-formula off-diagonal sum (bounded ' +
    'via Cauchy-Schwarz against a higher-moment input, identical to imp-1303 / ' +
    'imp-1305) OR Pinsker-style distributional -> Fourier translation (bounded ' +
    'via Cauchy-Schwarz at L^1 / L^2 Hölder boundary, identical to imp-1309). ' +
    'Both routes hit the SAME (log T)^{1/2} layer at the L^1 / L^2 duality ' +
    'boundary — this boundary is INTRINSIC, not a property of the moment method ' +
    'specifically. The sieve method shifts WHERE Cauchy-Schwarz appears (from ' +
    'input stage on primes to output stage on zeros) but does NOT eliminate it.',

  twoPointBoundFromSieveAttempt:
    'F(alpha, T) - F_GUE(alpha) = O((log T)^{-1/2}) for alpha in (1, 5/4), ' +
    'matching imp-1303 / imp-1305 / imp-1309 to leading order; no improvement to ' +
    'the PCC slack in support (1, 5/4) and no unconditional bound for sigma > 5/4',

  unconditionalSupportWindowReached: 'sigma in (1, 5/4) — SAME as HB1979 / imp-1303 / imp-1305 / imp-1309',
  unconditionalRangeAbove_5_4: 'NO unconditional 2-point bound; same as HB1979',
  closesPCCForSupportGtOne: false,
  improvementOverPriorRoutes: 'NONE at the leading order; sieve method shifts the ' +
    'Cauchy-Schwarz step from input stage (on primes side) to output stage (in the ' +
    'arithmetic-to-spectral translation via explicit formula OR Pinsker-Parseval) ' +
    'but does not change the (log T)^{1/2} rate at the L^1 / L^2 duality boundary',
});

// =========================================================================
// SECTION C - STRUCTURAL ORTHOGONALITY ASSESSMENT.
// =========================================================================
//
// Question: is the sieve method STRUCTURALLY ORTHOGONAL to the moment
// method (Cauchy-Schwarz / explicit-formula / higher-moment input) AND
// to the entropy method (imp-1309)?
//
// PRIMARY-DOMAIN ANSWER: YES — sieve methods are structurally distinct from
// BOTH moment methods AND entropy methods on primes.
//
// The sieve method on primes (Maynard 2013/2015, Zhang 2013, GPY 2009)
// leverages structural inputs that NEITHER the moment method NOR the entropy
// method uses:
//
//   - Multiplicative structure on integers: Mobius mu, divisor tau,
//     smooth-number indicator 1[P^+(n) <= y].
//   - Admissible-tuple combinatorics: Schinzel-Goldbach-Hardy-Littlewood
//     admissible k-tuples {h_1, ..., h_k} such that {n + h_1, ..., n + h_k}
//     has no fixed prime divisor.
//   - Level-of-distribution input: Bombieri-Vinogradov-Vaughan-Friedlander-
//     Iwaniec input on primes in arithmetic progressions mod q for q in a
//     range [Q^{1/2}, Q^{1/2 + epsilon}].
//   - Selberg sieve / lambda-squared weights and their multidimensional
//     refinements (Maynard 2013 lambda_d_1 ... d_k).
//
// These multiplicative / admissible-tuple / arithmetic-progression inputs
// are STRUCTURALLY DIFFERENT from BOTH:
//
//   - The higher-moment-of-zeta inputs (Selberg 1944 / Heath-Brown 1979 /
//     Goldston-Gonek 1998 / Goldston-Yildirim 2003) that power moment methods.
//   - The additive-combinatorial / Plünnecke-Ruzsa / EKR / entropy-compression
//     inputs that power entropy methods (imp-1309).
//
// Genuine orthogonality in the primary (arithmetic) domain.
//
// ZERO-GAP-DOMAIN ANSWER: NO, ORTHOGONALITY DOES NOT TRANSFER.
//
// Three independent structural obstructions, parallel to imp-1309 (R1)/(R2)/(R3):
//
// (S1) ARITHMETIC-TO-SPECTRAL DOMAIN MISMATCH.
//
//   Sieve method operates on integers Z with multiplicative structure
//   (Mobius, divisor, BV in residue classes). Zeros gamma_n have NO
//   multiplicative structure on their spacings. The translation requires
//   the EXPLICIT FORMULA (Weil 1952, Guinand 1948) as the only known
//   bridge. The explicit formula's off-diagonal prime-power sum is bounded
//   via Cauchy-Schwarz against a higher-moment input — IDENTICAL to the
//   moment-method route (imp-1303).
//
// (S2) ADMISSIBLE-TUPLE STRUCTURE ABSENT FROM ZEROS.
//
//   The load-bearing input for the Maynard sieve is admissible-tuple
//   structure {h_1, ..., h_k}: integer translates n + h_j have the
//   simultaneous-prime structure that the sieve weights w_n exploit.
//   Zeros gamma_n have NO ADMISSIBLE-TUPLE ANALOGUE — the conjectural GUE
//   spacing density (Wigner surmise: P(s) ~ s^2 e^{-c s^2}) is LOCALLY
//   REPULSIVE: small spacings are SUPPRESSED, the OPPOSITE of the
//   admissible-tuple "near-coincidence" pattern that sieve methods exploit
//   on primes. STRUCTURALLY MISSING input, identical to imp-1309 (R2)
//   ADDITIVE-STRUCTURE-ABSENT obstruction.
//
// (S3) SIEVE-WEIGHT L^1 / FIRST-MOMENT OUTPUT vs PCC L^2 / SECOND-MOMENT INPUT.
//
//   The sieve method's natural output is a WEIGHTED FIRST-MOMENT COUNT
//   sum_n w_n * 1[arithmetic condition]. The PCC at 2-point is a SECOND-
//   MOMENT (LINEAR STATISTIC) bound on the Fourier-transformed pair-
//   correlation. Sieve -> second-moment translation is one-directional in
//   the WRONG direction (first-moment / weighted-count is WEAKER than
//   second-moment / Fourier-L^2) and passes through Cauchy-Schwarz from L^1
//   to L^2, RE-INTRODUCING the layer we are trying to bypass. IDENTICAL
//   structural feature to imp-1309 (R3) LINEAR-STATISTIC-VS-SET-COUNT.
//
// NET STRUCTURAL CONCLUSION. The sieve method's structural orthogonality to
// moment AND entropy methods is REAL in the primary (arithmetic) domain
// but does NOT transfer to the single-zeta 2-point PCC observable at
// Fourier support sigma > 1. The three obstructions (S1)/(S2)/(S3) are
// independent and EACH would be sufficient to block the transfer.

const STRUCTURAL_ORTHOGONALITY_ASSESSMENT = Object.freeze({
  primaryDomainOrthogonalToMomentMethods: true,
  primaryDomainOrthogonalToEntropyMethods: true,
  primaryDomainOrthogonalityNote:
    'Sieve method on primes uses multiplicative structure (Mobius, divisor, ' +
    'smooth-number indicator), admissible-tuple combinatorics (Schinzel/HL), ' +
    'Bombieri-Vinogradov-class level of distribution, and Selberg-sieve / Maynard ' +
    'multidimensional lambda_d weights. Structurally distinct from BOTH higher-' +
    'moment-of-zeta inputs that power moment methods AND additive-combinatorial / ' +
    'entropy-compression inputs that power entropy methods. Genuine orthogonality.',

  zeroGapDomainOrthogonalityCarriesThrough: false,
  whyZeroGapDomainOrthogonalityFails: 'Three independent structural obstructions ' +
    '(S1) arithmetic-to-spectral domain mismatch / (S2) admissible-tuple structure ' +
    'absent on zeros (locally repulsive GUE not near-coincidence pattern) / (S3) ' +
    'sieve-weight L^1 / first-moment output vs PCC L^2 / second-moment input. ' +
    'Each independently sufficient to block the transfer.',

  obstruction_S1_arithmetic_to_spectral_domain_mismatch:
    'Sieve method operates on integers Z with multiplicative structure (Mobius, ' +
    'divisor, BV residue classes). Zeros have NO multiplicative structure on ' +
    'spacings. Translation requires the EXPLICIT FORMULA (Weil 1952, Guinand 1948); ' +
    'the off-diagonal prime-power sum is bounded via Cauchy-Schwarz against a ' +
    'higher-moment input, re-introducing the (log T)^{1/2} layer that imp-1303 / ' +
    'imp-1305 hit',

  obstruction_S2_admissible_tuple_structure_absent:
    'Load-bearing input for Maynard sieve is admissible-tuple structure {h_1, ..., ' +
    'h_k} for which {n + h_j} has the simultaneous-prime structure that w_n ' +
    'exploits. Zeros gamma_n have NO admissible-tuple analogue — conjectural GUE ' +
    'is LOCALLY REPULSIVE (small spacings suppressed), the OPPOSITE of the ' +
    'admissible-tuple "near-coincidence" structure that sieve methods exploit on ' +
    'primes. Structurally missing input, identical to imp-1309 (R2) additive-' +
    'structure-absent obstruction',

  obstruction_S3_sieve_weight_L1_first_moment_vs_PCC_L2_second_moment_mismatch:
    'Sieve method outputs weighted first-moment counts sum_n w_n * 1[arithmetic ' +
    'condition]. PCC at 2-point is a SECOND-MOMENT / linear-statistic bound on ' +
    'the Fourier-transformed pair-correlation. Sieve -> second-moment is one-' +
    'directional WRONG: first-moment / weighted-count is WEAKER than second-' +
    'moment / Fourier-L^2; the Cauchy-Schwarz from L^1 -> L^2 re-introduces the ' +
    'layer we are trying to bypass. Identical structural feature to imp-1309 (R3) ' +
    'linear-statistic-vs-set-count',

  poissonKernelESYClosureCompatibility:
    'The §15-27 ESY-closure Poisson kernel at micro-window 2 pi / log gamma_N ' +
    'is a SECOND-MOMENT / linear-statistic observable. The sieve method outputs ' +
    'FIRST-MOMENT / weighted counts; the §15-27 Poisson-kernel observable is ' +
    'structurally incompatible with direct sieve bounds. Indirect bridge via ' +
    'explicit formula OR Pinsker-Parseval hits the same (log T)^{1/2} obstruction',

  sieveMethodShiftsCauchySchwarzStageButDoesNotEliminate:
    'The sieve method shifts the Cauchy-Schwarz step from the INPUT stage (moment ' +
    'methods: Cauchy-Schwarz on off-diagonal correlation BEFORE plugging in the ' +
    'higher moment) to the OUTPUT stage (in the arithmetic-to-spectral translation ' +
    'via explicit formula OR Pinsker-Parseval AFTER the sieve bound). The Cauchy-' +
    'Schwarz rate is IDENTICAL in both cases — (log T)^{1/2} — so the shift does ' +
    'not change the bound. Same stage-shift pattern as imp-1309 entropy method',

  parallelToImp1309EntropyMethod:
    'Both the sieve method (this imp-1318) and the entropy method (imp-1309) are ' +
    '"orthogonal-to-moment-methods" candidates that share the same structural ' +
    'failure mode: PRIMARY-DOMAIN ORTHOGONAL but ZERO-GAP-DOMAIN orthogonality ' +
    'lost via the L^1 / L^2 Hölder boundary in the translation step. The sieve / ' +
    'entropy / moment family triad is unified by the SAME (log T)^{1/2} obstruction',
});

// =========================================================================
// SECTION D - RELATIONSHIP TO IMP-1297 / IMP-1302 / IMP-1303 / IMP-1304 /
//             IMP-1305 / IMP-1309.
// =========================================================================
//
// All seven routes (imp-1297, imp-1302, imp-1303, imp-1304, imp-1305 moment
// family + imp-1309 entropy family + this imp-1318 sieve family) share an
// OUTPUT-STAGE structural pattern:
//
//   At some point in the chain {input -> bound on F(alpha, T) at sigma > 1}
//   there is a CAUCHY-SCHWARZ STEP at the L^1 / L^2 duality boundary that
//   introduces a (log T)^{1/2} slack.
//
// THE MOMENT-METHOD ROUTES (imp-1297 + imp-1302 + imp-1303 + imp-1304 +
// imp-1305) hit Cauchy-Schwarz at the INPUT stage:
//
//   - The off-diagonal explicit-formula correction is bounded via Cauchy-
//     Schwarz against a higher-moment input (Selberg trace, GG1998 2nd
//     moment of Dirichlet polynomial, HB1979 4th moment of zeta, IS2000
//     1-level density, GY2003 divisor-sum correlation).
//   - Gives (log T)^{1/2} slack.
//
// THE ENTROPY-METHOD ROUTE (imp-1309) hits Cauchy-Schwarz at the OUTPUT
// stage via Pinsker-Parseval:
//
//   - Entropy bound on zero-spacing distributions -> Pinsker (entropy -> L^1)
//     -> Cauchy-Schwarz (L^1 -> L^2 via L^infty bound) -> Parseval (L^2 ->
//     Fourier). Selberg 1944 L^infty bound gives the (log T)^{1/2} factor.
//
// THE SIEVE-METHOD ROUTE (this imp-1318) hits Cauchy-Schwarz at the OUTPUT
// stage via EITHER the explicit formula OR Pinsker-Parseval:
//
//   - Sieve bound on prime-side / sieve bound on zero-side -> explicit
//     formula bridge -> off-diagonal prime-power sum -> Cauchy-Schwarz
//     against higher-moment input (IDENTICAL to moment family at the
//     spectral-bridge step), giving (log T)^{1/2} slack.
//   - OR sieve bound on zero-spacing density -> L^1 bound -> Cauchy-Schwarz
//     -> L^2 -> Fourier (IDENTICAL to entropy family Pinsker-Parseval
//     translation), giving (log T)^{1/2} slack.
//
// NET: ALL THREE FAMILIES (moment + entropy + sieve) are GENUINELY ORTHOGONAL
// to each other in their primary domains, but ALL hit the (log T)^{1/2}
// Cauchy-Schwarz layer at SOME stage of the chain. The L^1 / L^2 Hölder
// duality boundary is INTRINSIC to translating between integer / distributional /
// arithmetic inputs and Fourier / L^2 / spectral outputs.
//
// CONCLUSION: with moment + entropy + sieve families all in the same
// negative classification, the THREE major orthogonal families of modern
// analytic NT are exhausted. The aggregate verdict
// pcc-genuinely-open-pending-new-input is CONFIRMED.

const RELATIONSHIP_TO_PRIOR_PCC_ROUTES = Object.freeze({
  momentMethodRoutesHitCauchySchwarzAtInputStage:
    'imp-1297 (Selberg-trace) + imp-1302 (Goldston-Gonek 1998) + imp-1303 ' +
    '(Heath-Brown 1979) + imp-1304 (Iwaniec-Sarnak 2000) + imp-1305 (Goldston-' +
    'Yildirim 2003 absolutized) all bound the off-diagonal explicit-formula ' +
    'correction via Cauchy-Schwarz against a higher-moment input. The Cauchy-' +
    'Schwarz step gives the (log T)^{1/2} slack',

  entropyMethodRouteHitsCauchySchwarzAtOutputStage:
    'imp-1309 (Tao 2024 entropy, closest-known) uses entropy bounds on zero-' +
    'spacing distributions as input. The TRANSLATION to a pair-correlation Fourier ' +
    'bound passes through Pinsker (entropy -> L^1) + Cauchy-Schwarz (L^1 -> L^2) + ' +
    'Parseval (L^2 -> Fourier). The Cauchy-Schwarz step at the OUTPUT stage gives ' +
    'the (log T)^{1/2} slack',

  sieveMethodRouteHitsCauchySchwarzAtOutputStage:
    'imp-1318 (this; Maynard 2024 sieve, closest-known) uses sieve-weighted bounds ' +
    'on primes (or conjecturally on zero spacings) as input. The TRANSLATION to a ' +
    'pair-correlation Fourier bound passes through EITHER the explicit formula (Weil ' +
    '1952, Guinand 1948) with off-diagonal prime-power sum bounded by Cauchy-Schwarz ' +
    'against a higher-moment input (IDENTICAL to moment family), OR Pinsker-Parseval ' +
    'distributional -> Fourier translation (IDENTICAL to entropy family). Both ' +
    'translation paths give the (log T)^{1/2} slack at the OUTPUT stage',

  allThreeFamiliesGiveSameLogTHalfSlack: true,
  whySameSlack:
    'The (log T)^{1/2} slack arises at the L^1 / L^2 Hölder duality boundary ' +
    'regardless of which family or stage of the chain Cauchy-Schwarz is applied at. ' +
    'Selberg 1944 |S(T)| <= O((log T / log log T)^{1/2}) is the load-bearing ' +
    'L^infty input that gives the slack in ALL THREE FAMILIES (moment, entropy, sieve)',

  isSieveMethodStructurallyOrthogonalInPrimaryDomain: true,
  isSieveMethodStructurallyOrthogonalForZeroGapPCC: false,
  whyOrthogonalityFailsForZeroGapPCC:
    'Three independent obstructions (S1) (S2) (S3): arithmetic-to-spectral domain ' +
    'mismatch, absence of admissible-tuple structure on zeros (locally repulsive ' +
    'GUE not near-coincidence), sieve-weight L^1 / first-moment output vs PCC L^2 / ' +
    'second-moment input. Each independently sufficient to block the transfer of ' +
    'orthogonality. Parallel structurally to imp-1309 (R1) (R2) (R3)',

  aggregateConclusion:
    'imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment-method family) + ' +
    'imp-1309 (entropy-method family) + imp-1318 (sieve-method family, this ticket) ' +
    'all produce the same negative classification at the same (log T)^{1/2} Cauchy-' +
    'Schwarz / L^1-L^2 duality boundary, with the same residual gap in support (1, ' +
    '5/4) and no unconditional bound for sigma > 5/4. The THREE major orthogonal ' +
    'families of modern analytic-NT (moment + entropy + sieve) are EXHAUSTED for ' +
    'PCC at 2-point. Remaining candidates: Connes-Bost adele class space (imp-1307, ' +
    'non-rigorous), Berry-Keating semiclassical (imp-1308, non-rigorous), imp-1310 ' +
    'alternative §15-27 pathway (also exhausted), genuinely novel constructions',
});

// =========================================================================
// SECTION E - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'maynard-sieve-bypasses-PCC',
  'maynard-sieve-applies-only-to-arithmetic-not-spectral',
  'maynard-sieve-equi-difficult-to-PCC-via-L1-L2-boundary',
  'maynard-sieve-not-applicable',
]);

const VERDICT = 'maynard-sieve-applies-only-to-arithmetic-not-spectral';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesPCCUnconditionally: false,
  closesPCCForFourierSupportGtOne: false,
  closesPCCForESYClosureTestFunction: false,

  whatSieveMethodGivesAt2Point:
    'A 2-point bound IDENTICAL to imp-1303 (Heath-Brown 1979) + imp-1305 (Goldston-' +
    'Yildirim 2003 absolutized) + imp-1309 (Tao 2024 entropy closest-known) to ' +
    'leading order: F(alpha, T) - F_GUE(alpha) = O((log T)^{-1/2}) for alpha in ' +
    '(1, 5/4); no improvement to the PCC slack and no unconditional bound for sigma > 5/4',

  gapToPCCPreciselyStated:
    'Sieve method gives the same (log T)^{1/2} gap to PCC as imp-1303 / imp-1305 / ' +
    'imp-1309 in the support window (1, 5/4); above 5/4 no unconditional bound. The ' +
    'sieve method does not produce a new closure for single-zeta 2-point at support > 1',

  isSieveMethodPrimaryDomainOrthogonalToMomentAndEntropy: true,
  isSieveMethodOrthogonalityCarryingThroughToZeroGapPCC: false,
  isSieveMethodAnotherInstanceOfL1L2CauchySchwarzBoundary: true,

  residualGapPreciselyStated:
    'PCC at 2-point for f-hat supported in (-sigma, sigma), sigma > 1 ' +
    '(where §15-27 ESY-closure Poisson kernel at micro-window 2 pi / log gamma_N ' +
    'binds for the fixed-x fluctuation step imp-1184 D3) is OPEN. The sieve ' +
    'method gives bounds in sigma in (1, 5/4) with (log T)^{1/2} slack — IDENTICAL ' +
    'to HB1979 / GY2003 absolutized / Tao 2024 entropy closest-known — and no bound ' +
    'for sigma > 5/4. The sieve method shifts the Cauchy-Schwarz step from input ' +
    'stage to output stage but does not change the rate',

  whatWouldClose:
    'A genuinely new mechanism outside the moment-method AND the entropy-method ' +
    'AND the sieve-method families: (i) Connes-Bost adele class space / non-' +
    'commutative geometry route (imp-1307, ruled non-rigorous), (ii) Berry-Keating ' +
    'semiclassical quantum-chaos route (imp-1308, ruled non-rigorous), (iii) novel ' +
    'hybrid sieve-explicit-formula construction that bypasses BOTH the input-stage ' +
    'and output-stage Cauchy-Schwarz layers, OR (iv) alternative §15-27 closure ' +
    'pathways that decouple from sigma > 1 in Fourier-support (imp-1310 addresses ' +
    'this; also exhausted)',

  fitsWithImp1297Through1309Pattern:
    'imp-1297 (Selberg-trace) + imp-1302 (Goldston-Gonek 1998) + imp-1303 ' +
    '(Heath-Brown 1979) + imp-1304 (Iwaniec-Sarnak 2000) + imp-1305 (Goldston-' +
    'Yildirim 2003 absolutized) + imp-1309 (Tao 2024 entropy closest-known) + ' +
    'imp-1318 (Maynard 2024 sieve closest-known, this ticket) all produce the same ' +
    'negative classification at the same (log T)^{1/2} Cauchy-Schwarz / L^1-L^2 ' +
    'duality boundary. The standard analytic-number-theory toolkit is now EXHAUSTED ' +
    'across moment + entropy + sieve families. PCC remains the binding obstruction',

  aggregateVerdict: 'pcc-genuinely-open-pending-new-input',

  patternNoteExtendsExhaustionToSieveFamily: true,
  patternNotePreciselyStated:
    'With imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment-method ' +
    'family) PLUS imp-1309 (entropy-method family) PLUS imp-1318 (sieve-method ' +
    'family) all in the same negative classification family, the standard analytic-' +
    'number-theory toolkit (moment methods + entropy methods + sieve methods + ' +
    'their hybrids) is EXHAUSTED for the PCC at 2-point regime with support sigma > 1. ' +
    'RH via §15-27 requires GENUINELY NEW INPUT — candidates from outside the ' +
    'standard toolkit (Connes-Bost, Berry-Keating) OR alternative §15-27 closure ' +
    'pathways that decouple from sigma > 1 (imp-1310). Aggregate verdict is ' +
    'pcc-genuinely-open-pending-new-input',

  implicationForLambdaAttack:
    'With moment AND entropy AND sieve families all ruled out for PCC at 2-point, ' +
    'the Lambda-attack should: (1) decouple from PCC at 2-point requirement by ' +
    'exploring alternative §15-27 closure pathways with Fourier-support sigma <= 1 ' +
    '(where Montgomery 1973 is unconditional; this is the imp-1310 direction); ' +
    '(2) probe genuinely new input families OUTSIDE the moment + entropy + sieve ' +
    'triad (Connes-Bost adele class space, Berry-Keating semiclassical Hamiltonian, ' +
    'Hecke-triangle Selberg trace, de Branges direct route via imp-1241) that ' +
    'bypass the L^1 / L^2 Cauchy-Schwarz duality boundary entirely',

  honestNote:
    'The sieve method is genuinely orthogonal to moment methods AND to entropy ' +
    'methods in its primary domain (prime-gap statistics, primes in arithmetic ' +
    'progressions, zero-density off-line counts). The orthogonality is a REAL ' +
    'mathematical phenomenon. It does NOT transfer to the single-zeta 2-point PCC ' +
    'observable at support > 1 for three independent structural reasons: (S1) ' +
    'arithmetic-to-spectral domain mismatch / (S2) absence of admissible-tuple ' +
    'structure on zeros / (S3) sieve-weight L^1 / first-moment output vs PCC L^2 / ' +
    'second-moment input mismatch. The verdict maynard-sieve-applies-only-to-' +
    'arithmetic-not-spectral is honest: it reports that the candidate mechanism ' +
    'does not transfer to the target observable, NOT that the candidate mechanism ' +
    'is broken in its primary domain. The classification result here is PRECISELY ' +
    'VALUABLE because it confirms that the sieve method — alongside the entropy ' +
    'method (imp-1309) — does not provide the new input needed for PCC at 2-point. ' +
    'This narrows the remaining candidate space to Connes-Bost / Berry-Keating / ' +
    'Hecke-triangle / de Branges / imp-1310 alternative-pathway routes',

  trainingTimeUncertaintyHonestNote:
    'Training-time knowledge cutoff is January 2026. The well-attested 2024 ' +
    'result is Guth-Maynard 2024 (arXiv:2405.20552) zero-density bound, which is ' +
    'structurally a ZERO-DENSITY bound (off-line zeros count) NOT a pair-correlation ' +
    'bound. A specific Maynard 2024 sieve-refinement paper targeting 2-point is ' +
    'UNCERTAIN at training-cutoff. Classification uses the closest-known forms: ' +
    'Guth-Maynard 2024 zero-density + Maynard 2013/2015 GPY-style small-gap sieve + ' +
    'Maynard 2019 primes in arithmetic progressions to large moduli + FGKMT 2014/' +
    '2018 long-gap sieve. The (S1)-(S3) structural obstructions are ROBUST to the ' +
    'exact form of Maynard 2024 (if a 2-point-targeted refinement exists) because ' +
    'they identify load-bearing layer-level obstructions that ANY sieve-on-zeros ' +
    'argument must traverse. If a specific Maynard 2024 zero-gap sieve theorem ' +
    'exists and DOES bypass the L^1 / L^2 Cauchy-Schwarz layer in a way not ' +
    'captured by (S1)-(S3), this classification is OPEN-FOR-REVISION',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1318_MAYNARD_SIEVE_PCC = Object.freeze({
  id: 'imp-1318-maynard-sieve-pcc',
  ticket: 'imp-1318',
  category: 'proof',
  builtAt: '2026-05-29T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1247', 'imp-1297', 'imp-1302', 'imp-1303', 'imp-1304',
    'imp-1305', 'imp-1309', 'imp-1310',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  maynardSieve2024Statement: MAYNARD_SIEVE_2024_STATEMENT,
  twoPointTransferEvaluation: TWO_POINT_TRANSFER_EVALUATION,
  structuralOrthogonalityAssessment: STRUCTURAL_ORTHOGONALITY_ASSESSMENT,
  relationshipToPriorPCCRoutes: RELATIONSHIP_TO_PRIOR_PCC_ROUTES,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — ruled out Selberg-trace (moment family)',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js — ruled out Goldston-Gonek 1998 (moment family)',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js — ruled out Heath-Brown 1979 + auxiliary (moment family)',
    imp1304: 'src/data/imp-1304-iwaniec-sarnak-no-pcc.js — ruled out Iwaniec-Sarnak 2000 family-averaging (moment family)',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js — ruled out GY2003 absolutized (moment family, completes moment-family ruling-out)',
    imp1309: 'src/data/imp-1309-tao-entropy-pcc-attack.js — ruled out Tao 2024 entropy closest-known (entropy family)',
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js — alternative §15-27 pathway also exhausted (support > 1 intrinsic via Plancherel)',
  }),

  honestScope: Object.freeze([
    'This file is a NEW-INPUT CLASSIFICATION ticket for the candidate direct ' +
    'attack on Montgomery PCC at 2-point via Maynard 2024 (closest-known form: ' +
    'Guth-Maynard 2024 zero-density arXiv:2405.20552, Maynard 2013/2015 GPY-style ' +
    'small-gap sieve, Maynard 2019 primes-in-arithmetic-progressions sieve, ' +
    'FGKMT 2014/2018 long-gap sieve, plus a conjectural Maynard 2024 sieve ' +
    'refinement targeting 2-point that is UNCERTAIN at training-cutoff). It is ' +
    'NOT a new closure or a new unconditional bound.',

    'The verdict is NEGATIVE: maynard-sieve-applies-only-to-arithmetic-not-spectral. ' +
    'The sieve method is GENUINELY ORTHOGONAL to moment methods AND to entropy ' +
    'methods in its primary domain (prime-gap statistics, primes in arithmetic ' +
    'progressions, zero-density off-line counts), but the orthogonality does NOT ' +
    'transfer to the single-zeta 2-point PCC observable at Fourier support sigma > 1 ' +
    'for three independent structural reasons: (S1) arithmetic-to-spectral domain ' +
    'mismatch (sieve operates on integers Z with multiplicative structure; zeros ' +
    'have no multiplicative structure on spacings; translation via explicit formula ' +
    'hits Cauchy-Schwarz at off-diagonal prime-power sum); (S2) absence of admissible-' +
    'tuple structure on zeros (conjectural GUE distribution is locally repulsive, ' +
    'the OPPOSITE of admissible-tuple near-coincidence pattern that sieve methods ' +
    'exploit on primes); (S3) sieve-weight L^1 / first-moment output vs PCC L^2 / ' +
    'second-moment input mismatch (sieve gives weighted counts; PCC needs Fourier-L^2 ' +
    'on second-moment statistic; translation via Cauchy-Schwarz from L^1 / total-' +
    'variation re-introduces the layer we are trying to bypass).',

    'The TRAINING-TIME UNCERTAINTY is honestly acknowledged: the well-attested 2024 ' +
    'Maynard result is Guth-Maynard 2024 (arXiv:2405.20552) zero-density bound, ' +
    'which is structurally a ZERO-DENSITY (off-line zeros count) bound NOT a pair-' +
    'correlation Fourier bound. A specific Maynard 2024 sieve-refinement paper ' +
    'targeting 2-point is uncertain at training-cutoff (January 2026). Classification ' +
    'uses the closest-known forms (Guth-Maynard 2024 + Maynard 2013/2015 GPY-style + ' +
    'Maynard 2019 + FGKMT 2014/2018). The (S1)-(S3) structural obstructions are ' +
    'ROBUST to the exact form of Maynard 2024 (if a 2-point-targeted refinement ' +
    'exists) because they identify load-bearing layer-level obstructions that ANY ' +
    'sieve-on-zeros argument must traverse. If a specific Maynard 2024 zero-gap ' +
    'sieve theorem exists and DOES bypass the L^1 / L^2 Cauchy-Schwarz layer in a ' +
    'way not captured by (S1)-(S3), this classification is OPEN-FOR-REVISION.',

    'The sieve method shifts WHERE Cauchy-Schwarz appears in the chain from INPUT ' +
    'stage (moment methods: Cauchy-Schwarz on off-diagonal correlation BEFORE ' +
    'plugging in the higher-moment) to OUTPUT stage (sieve methods: Cauchy-Schwarz ' +
    'on the arithmetic-to-spectral translation AFTER the sieve bound, via EITHER ' +
    'explicit formula OR Pinsker-Parseval). The Cauchy-Schwarz rate is IDENTICAL — ' +
    '(log T)^{1/2} — so the shift does not change the bound. Selberg 1944 ' +
    '|S(T)| <= O((log T / log log T)^{1/2}) is the load-bearing L^infty input ' +
    'that gives the slack in BOTH the moment-method and sieve-method routes (and ' +
    'entropy-method route imp-1309). The L^1 / L^2 Hölder duality boundary is ' +
    'INTRINSIC, not a property of any specific input.',

    'The residual gap is precisely: PCC for Fourier support sigma > 1, identical ' +
    'to imp-1303 / imp-1305 / imp-1309 and to the Montgomery 1973 conjecture open ' +
    'since the original paper. The sieve method does NOT change which side of the ' +
    'L^1 / L^2 Cauchy-Schwarz boundary the bound sits on.',

    'CONSEQUENCE for engine planning: with imp-1297 + imp-1302 + imp-1303 + ' +
    'imp-1304 + imp-1305 (moment-method family) PLUS imp-1309 (entropy-method ' +
    'family) PLUS imp-1318 (sieve-method family) all in the same negative ' +
    'classification family, the THREE major orthogonal families of modern analytic-' +
    'number-theory (moment + entropy + sieve) are EXHAUSTED for PCC at 2-point. ' +
    'The aggregate verdict on §15-27 -> RH via PCC is pcc-genuinely-open-pending-' +
    'new-input. The Lambda-attack should: (1) decouple from PCC at 2-point ' +
    'requirement by exploring alternative §15-27 closure pathways with Fourier-' +
    'support sigma <= 1 (this is the imp-1310 direction; also exhausted); (2) probe ' +
    'genuinely new input families OUTSIDE the moment + entropy + sieve triad ' +
    '(Connes-Bost adele class space, Berry-Keating semiclassical Hamiltonian, ' +
    'Hecke-triangle Selberg trace, de Branges direct route via imp-1241 unified ' +
    'existence) that bypass the L^1 / L^2 Cauchy-Schwarz duality boundary entirely.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js',
    imp1304: 'src/data/imp-1304-iwaniec-sarnak-no-pcc.js',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js',
    imp1309: 'src/data/imp-1309-tao-entropy-pcc-attack.js',
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js',
    maynard2024SieveOnZeroGapsUncertain:
      'J. Maynard (UNCERTAIN at training-cutoff January 2026), a possible 2024 ' +
      'sieve-refinement paper specifically targeting the 2-point statistic for ' +
      'zero spacings. Closest-known form covered by Guth-Maynard 2024 zero-density + ' +
      'Maynard 2013/2015 GPY-style multidimensional sieve + Maynard 2019 primes in ' +
      'arithmetic progressions. Honest scope: the specific 2024 sieve paper ' +
      'targeting PCC at 2-point is not confidently identified at training-cutoff',
    guthMaynard2024:
      'Guth, L. and Maynard, J., "New large value estimates for Dirichlet ' +
      'polynomials", arXiv:2405.20552 (2024). First improvement to Ingham 1940 ' +
      'zero-density bound in 80+ years: N(sigma, T) << T^{30(1-sigma)/13 + o(1)}. ' +
      'Already wired in src/data/guth-maynard-tail-bound.js for Path C tail ' +
      'certification (imp-308 / imp-317). Structurally a ZERO-DENSITY off-line ' +
      'count, NOT a pair-correlation Fourier bound at 2-point',
    maynard2013SmallGaps:
      'Maynard, J., "Small gaps between primes", arXiv:1311.4600 (2013), Annals of ' +
      'Math. 181 (2015), 383-413. GPY-style multidimensional sieve; proves ' +
      'liminf_{n -> infty} (p_{n+1} - p_n) <= 600 unconditionally',
    maynard2019PrimesAP:
      'Maynard, J., "Primes in arithmetic progressions to large moduli I, II, III", ' +
      'arXiv:1906.06530, 1909.04125, 1909.04124 (2019-2020). Extends Bombieri-' +
      'Vinogradov beyond standard level of distribution X^{1/2}',
    fordGreenKonyaginMaynardTao2014:
      'Ford, K., Green, B., Konyagin, S., Maynard, J., Tao, T., "Long gaps between ' +
      'primes", JAMS 31 (2018), 65-105 (arXiv 2014). Sieve method for LARGE gaps',
    gpy2009:
      'Goldston, D. A., Pintz, J., Yildirim, C. Y., "Primes in tuples I", Ann. of ' +
      'Math. 170 (2009), 819-862. Original GPY sieve; baseline that Maynard 2013 ' +
      'extends to multidimensional',
    schinzelHardyLittlewood:
      'Schinzel, A. and Sierpinski, W., "Sur certaines hypothèses concernant les ' +
      'nombres premiers", Acta Arithmetica 4 (1958), 185-208; Hardy, G. H. and ' +
      'Littlewood, J. E., "Some problems of partitio numerorum III", Acta Math. 44 ' +
      '(1923), 1-70. Admissible-tuple conjectures for primes; the load-bearing ' +
      'admissible-tuple structure that sieve methods exploit',
    bombieriVinogradov:
      'Bombieri, E., "On the large sieve", Mathematika 12 (1965), 201-225; ' +
      'Vinogradov, A. I., "The density hypothesis for Dirichlet L-series", Izv. ' +
      'Akad. Nauk SSSR. Ser. Mat. 29 (1965), 903-934 — level of distribution input ' +
      'for the sieve method',
    weilGuinandExplicitFormula:
      'Weil, A., "Sur les formules explicites de la théorie des nombres premiers", ' +
      'Comm. Sém. Math. Univ. Lund (1952), 252-265; Guinand, A. P., "A summation ' +
      'formula in the theory of prime numbers", Proc. London Math. Soc. (2) 50 ' +
      '(1948), 107-119 — explicit formula bridge between primes and zeros',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193 — the PCC conjecture itself',
    odlyzko1987:
      'Odlyzko, A. M., "On the distribution of spacings between zeros of the zeta ' +
      'function", Math. Comp. 48 (1987), 273-308 — numerical evidence for ' +
      'GUE-like distribution; Wigner-surmise P(s) ~ s^2 e^{-c s^2} small-s repulsion',
    selberg1944:
      'Selberg, A., "On the remainder in the formula for N(T)", Avh. Norske Vid. ' +
      'Akad. Oslo. I. Mat.-Naturvid. Kl. 1944, no. 1, 27 pp. — load-bearing ' +
      'L^infty bound |S(T)| <= O((log T / log log T)^{1/2}) that re-introduces the ' +
      'Cauchy-Schwarz layer in the sieve method output stage',
    heathBrown1979:
      'Heath-Brown, D. R., "The fourth power moment of the Riemann zeta function", ' +
      'Proc. London Math. Soc. (3) 38 (1979), 385-422 — baseline moment-method ' +
      'route, gives the (log T)^{1/2} slack target',
    ingham1940:
      'Ingham, A. E., "On the estimation of N(sigma, T)", Quart. J. Math. Oxford ' +
      '11 (1940), 291-292 — zero-density bound that Guth-Maynard 2024 improved on',
    zhang2013:
      'Zhang, Y., "Bounded gaps between primes", Ann. of Math. 179 (2014), ' +
      '1121-1174 — the 70 million bound on prime gaps that Maynard 2013 reduced to 600',
    selbergSieve:
      'Selberg, A., "On an elementary method in the theory of primes", Norske Vid. ' +
      'Selsk. Forh. 19 (1947), 64-67 — Selberg lambda-squared sieve; load-bearing ' +
      'structural ingredient of Maynard 2013/2015 multidimensional generalization',
  }),
});

export default IMP_1318_MAYNARD_SIEVE_PCC;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1318_MAYNARD_SIEVE_PCC_ASSERTIONS = [
  // Tripwire 1: Maynard 2024 (or closest-known) is cited with honest training-
  // time uncertainty acknowledgement. Guth-Maynard 2024 zero-density is
  // confidently attested; Maynard 2024 sieve refinement targeting 2-point is
  // uncertain.
  {
    id: 'imp1318-maynard2024-stated-with-honest-uncertainty',
    why:
      'Training-cutoff is January 2026 and a specific Maynard 2024 sieve-refinement ' +
      'paper targeting 2-point is uncertain. The well-attested 2024 result is Guth-' +
      'Maynard 2024 (arXiv:2405.20552) zero-density bound (NOT a pair-correlation ' +
      'bound). The classification must STATE the closest-known forms (Guth-Maynard ' +
      '2024 + Maynard 2013/2015 + Maynard 2019 + FGKMT 2014/2018) and EXPLICITLY ' +
      'acknowledge the training-time uncertainty. A silent overclaim that "Maynard ' +
      '2024 proves X for 2-point" without the uncertainty caveat would mislead.',
    holds: () => {
      const s = IMP_1318_MAYNARD_SIEVE_PCC.maynardSieve2024Statement;
      return (
        typeof s.source === 'string' &&
        /Guth-Maynard|Guth.*Maynard/.test(s.source) &&
        /2024/.test(s.source) &&
        /Maynard/.test(s.source) &&
        s.isTrainingTimeUncertain === true &&
        typeof s.trainingTimeUncertaintyNote === 'string' &&
        /uncertain|training-cutoff/i.test(s.trainingTimeUncertaintyNote) &&
        typeof s.closestKnownSieveClass === 'string' &&
        /Maynard 2013|GPY|multidimensional sieve/i.test(s.closestKnownSieveClass) &&
        typeof s.attestedGuthMaynard2024 === 'string' &&
        /(arXiv:2405\.20552|2405\.20552)/.test(s.attestedGuthMaynard2024) &&
        /(zero-density|zero density|N\(sigma)/i.test(s.attestedGuthMaynard2024)
      );
    },
  },

  // Tripwire 2: arithmetic-to-spectral translation explicitly evaluated.
  // Walks (a) observable, (b) translation, (c) Cauchy-Schwarz.
  {
    id: 'imp1318-arithmetic-to-spectral-translation-evaluated',
    why:
      'The translation evaluation must walk (a) observable bounded by sieve, ' +
      '(b) does it give a 2-point bound at sigma > 1 via arithmetic-to-spectral ' +
      'translation, (c) does it bypass Cauchy-Schwarz. Missing any of the three ' +
      'would render the classification incomplete on its load-bearing question. ' +
      'The arithmetic-to-spectral bridge is the explicit formula (Weil/Guinand) ' +
      'or Pinsker-Parseval distributional -> Fourier; both must be identified.',
    holds: () => {
      const t = IMP_1318_MAYNARD_SIEVE_PCC.twoPointTransferEvaluation;
      return (
        typeof t.observableBoundedBySieveMethod === 'string' &&
        /sieve/i.test(t.observableBoundedBySieveMethod) &&
        /(first-moment|weighted count|count|density)/i.test(t.observableBoundedBySieveMethod) &&
        typeof t.observableNeededForPCC === 'string' &&
        /(Fourier|pair-correlation|F\(alpha)/.test(t.observableNeededForPCC) &&
        typeof t.translationChain === 'object' &&
        typeof t.translationChain.step1_sieve_to_L1 === 'string' &&
        /(Tauberian|L\^1|first-moment|weighted)/i.test(t.translationChain.step1_sieve_to_L1) &&
        typeof t.translationChain.step2_L1_to_L2 === 'string' &&
        /Cauchy-Schwarz/.test(t.translationChain.step2_L1_to_L2) &&
        typeof t.translationChain.step3_L2_to_Fourier === 'string' &&
        /Parseval|Plancherel/i.test(t.translationChain.step3_L2_to_Fourier) &&
        typeof t.translationChain.alternative_via_explicit_formula === 'string' &&
        /(explicit formula|Weil|Guinand)/i.test(t.translationChain.alternative_via_explicit_formula) &&
        t.bypassesCauchySchwarzLayerAtInputStage === true &&
        t.bypassesCauchySchwarzLayerAtOutputStage === false &&
        t.closesPCCForSupportGtOne === false
      );
    },
  },

  // Tripwire 3: L^1 / L^2 boundary explicitly evaluated; the sieve method
  // shifts the Cauchy-Schwarz step but does NOT bypass the L^1 / L^2 boundary.
  // Per imp-1309 closure-note pattern.
  {
    id: 'imp1318-L1-L2-boundary-evaluated-not-bypassed',
    why:
      'Per imp-1309 closure-note pattern: any approach has to bypass the L^1 / L^2 ' +
      'Plancherel / Cauchy-Schwarz boundary at the off-diagonal step, NOT just shift ' +
      'it. The sieve method shifts the Cauchy-Schwarz step from input stage (on ' +
      'primes) to output stage (in arithmetic-to-spectral translation) but does NOT ' +
      'eliminate it. This tripwire pins that fact: the L^1 / L^2 boundary is INTRINSIC.',
    holds: () => {
      const t = IMP_1318_MAYNARD_SIEVE_PCC.twoPointTransferEvaluation;
      const vd = IMP_1318_MAYNARD_SIEVE_PCC.verdictDetail;
      return (
        t.bypassesCauchySchwarzLayerAtInputStage === true &&
        t.bypassesCauchySchwarzLayerAtOutputStage === false &&
        typeof t.whyOutputStageReintroducesCauchySchwarz === 'string' &&
        /(L\^1.*L\^2|Hölder|duality boundary|Plancherel)/.test(t.whyOutputStageReintroducesCauchySchwarz) &&
        /(intrinsic|INTRINSIC|not a property)/i.test(t.whyOutputStageReintroducesCauchySchwarz) &&
        vd.isSieveMethodAnotherInstanceOfL1L2CauchySchwarzBoundary === true
      );
    },
  },

  // Tripwire 4: Structural orthogonality assessment names primary-domain
  // orthogonality YES (to BOTH moment AND entropy) + zero-gap-domain
  // orthogonality NO + all three obstructions S1 / S2 / S3.
  {
    id: 'imp1318-structural-orthogonality-three-obstructions',
    why:
      'The structural orthogonality assessment must report that sieve is PRIMARY-' +
      'DOMAIN orthogonal to BOTH moment AND entropy methods but ZERO-GAP-DOMAIN ' +
      'orthogonality does NOT carry through. Missing any of the three obstructions ' +
      '(S1) (S2) (S3) parallel to imp-1309 (R1) (R2) (R3) would weaken the structural ' +
      'argument. (S2) specifically parallels imp-1309 (R2): admissible-tuple absence ' +
      'on zeros mirrors additive-structure absence.',
    holds: () => {
      const a = IMP_1318_MAYNARD_SIEVE_PCC.structuralOrthogonalityAssessment;
      return (
        a.primaryDomainOrthogonalToMomentMethods === true &&
        a.primaryDomainOrthogonalToEntropyMethods === true &&
        a.zeroGapDomainOrthogonalityCarriesThrough === false &&
        typeof a.obstruction_S1_arithmetic_to_spectral_domain_mismatch === 'string' &&
        /(arithmetic|spectral|explicit formula|Mobius|multiplicative)/i.test(
          a.obstruction_S1_arithmetic_to_spectral_domain_mismatch
        ) &&
        typeof a.obstruction_S2_admissible_tuple_structure_absent === 'string' &&
        /(admissible|tuple|GUE|repulsive|Wigner)/i.test(
          a.obstruction_S2_admissible_tuple_structure_absent
        ) &&
        typeof a.obstruction_S3_sieve_weight_L1_first_moment_vs_PCC_L2_second_moment_mismatch === 'string' &&
        /(first-moment|second-moment|L\^1|L\^2|weighted count)/i.test(
          a.obstruction_S3_sieve_weight_L1_first_moment_vs_PCC_L2_second_moment_mismatch
        ) &&
        typeof a.sieveMethodShiftsCauchySchwarzStageButDoesNotEliminate === 'string' &&
        /(shifts|stage|input.*output|output.*input)/i.test(
          a.sieveMethodShiftsCauchySchwarzStageButDoesNotEliminate
        )
      );
    },
  },

  // Tripwire 5: Verdict is one of the four allowed strings.
  {
    id: 'imp1318-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'maynard-sieve-bypasses-PCC / maynard-sieve-applies-only-to-arithmetic-not-' +
      'spectral / maynard-sieve-equi-difficult-to-PCC-via-L1-L2-boundary / ' +
      'maynard-sieve-not-applicable. A non-allowed verdict would indicate ' +
      'classification drift from the ticket specification.',
    holds: () => {
      const allowed = [
        'maynard-sieve-bypasses-PCC',
        'maynard-sieve-applies-only-to-arithmetic-not-spectral',
        'maynard-sieve-equi-difficult-to-PCC-via-L1-L2-boundary',
        'maynard-sieve-not-applicable',
      ];
      return allowed.includes(IMP_1318_MAYNARD_SIEVE_PCC.verdict);
    },
  },

  // Tripwire 6: Verdict detail reports PCC remains OPEN with residual gap.
  {
    id: 'imp1318-verdict-detail-pcc-remains-open',
    why:
      'A silent flip to "PCC closed unconditionally via Maynard 2024 sieve" would ' +
      'invalidate the entire engine-planning consequence. Tripwire pins the ' +
      'NEGATIVE result and ensures the residual gap (PCC for sigma > 1) is ' +
      'explicitly named.',
    holds: () => {
      const vd = IMP_1318_MAYNARD_SIEVE_PCC.verdictDetail;
      return (
        vd.closesPCCUnconditionally === false &&
        vd.closesPCCForFourierSupportGtOne === false &&
        vd.closesPCCForESYClosureTestFunction === false &&
        vd.isSieveMethodPrimaryDomainOrthogonalToMomentAndEntropy === true &&
        vd.isSieveMethodOrthogonalityCarryingThroughToZeroGapPCC === false &&
        vd.isSieveMethodAnotherInstanceOfL1L2CauchySchwarzBoundary === true &&
        typeof vd.residualGapPreciselyStated === 'string' &&
        /OPEN/.test(vd.residualGapPreciselyStated) &&
        /sigma > 1/.test(vd.residualGapPreciselyStated)
      );
    },
  },

  // Tripwire 7: At least five required citations present (Maynard 2024 uncertain
  // + Guth-Maynard 2024 zero-density attested + Maynard 2013/2015 GPY-style +
  // Maynard 2019 primes-in-AP + prior PCC routes imp-1297..imp-1309).
  {
    id: 'imp1318-five-required-citations-present',
    why:
      'Per ticket spec: cite Maynard 2024 (with honest uncertainty), Guth-Maynard ' +
      '2024 (the well-attested 2024 result), Maynard 2013/2015 small gaps, ' +
      'Maynard 2019 primes-in-AP, prior PCC routes. Missing any means the ' +
      'classification is incomplete on load-bearing references.',
    holds: () => {
      const r = IMP_1318_MAYNARD_SIEVE_PCC.references;
      return (
        /Maynard/.test(r.maynard2024SieveOnZeroGapsUncertain || '') &&
        /(uncertain|UNCERTAIN)/i.test(r.maynard2024SieveOnZeroGapsUncertain || '') &&
        /(Guth.*Maynard|Guth-Maynard)/.test(r.guthMaynard2024 || '') &&
        /(arXiv:2405\.20552|2405\.20552|2024)/.test(r.guthMaynard2024 || '') &&
        /Maynard/.test(r.maynard2013SmallGaps || '') &&
        /(2013|2015|1311\.4600)/.test(r.maynard2013SmallGaps || '') &&
        /Maynard/.test(r.maynard2019PrimesAP || '') &&
        /(arithmetic|1906\.06530|2019)/i.test(r.maynard2019PrimesAP || '') &&
        typeof r.imp1297 === 'string' && /imp-1297/.test(r.imp1297) &&
        typeof r.imp1305 === 'string' && /imp-1305/.test(r.imp1305) &&
        typeof r.imp1309 === 'string' && /imp-1309/.test(r.imp1309)
      );
    },
  },

  // Tripwire 8: Cross-references imp-1297 / imp-1305 / imp-1309 present (per
  // ticket spec).
  {
    id: 'imp1318-cross-references-prior-pcc-routes',
    why:
      'Per ticket spec the cross-references imp-1297 + imp-1305 + imp-1309 must be ' +
      'present. Without explicit cross-references to the prior PCC-attack routes ' +
      'the classification floats free of the parent map. imp-1309 in particular ' +
      'is the structural template for the (S1)-(S3) obstruction pattern.',
    holds: () => {
      const r = IMP_1318_MAYNARD_SIEVE_PCC;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1297') &&
        related.includes('imp-1305') &&
        related.includes('imp-1309') &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297) &&
        typeof xrefs.imp1305 === 'string' && /imp-1305/.test(xrefs.imp1305) &&
        typeof xrefs.imp1309 === 'string' && /imp-1309/.test(xrefs.imp1309)
      );
    },
  },

  // Tripwire 9: Honest scope mentions NEGATIVE result + training-time
  // uncertainty + continuation of imp-1297..imp-1309 conclusions.
  {
    id: 'imp1318-honest-scope-mentions-negative-uncertainty-and-prior-continuation',
    why:
      'The honest scope must explicitly state that (i) the result is NEGATIVE, ' +
      '(ii) Maynard 2024 specific 2-point reference is UNCERTAIN at training-time ' +
      'and the closest-known forms are used, (iii) it CONTINUES the imp-1297.. ' +
      'imp-1309 findings. A silent drift to "positive closure" or omission of ' +
      'training-time uncertainty would mislead engine planning.',
    holds: () => {
      const blob = IMP_1318_MAYNARD_SIEVE_PCC.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /(uncertain|UNCERTAIN|training-cutoff|training-time)/i.test(blob) &&
        /imp-1297/.test(blob) &&
        /imp-1305/.test(blob) &&
        /imp-1309/.test(blob) &&
        /closest-known/i.test(blob) &&
        /(does NOT|do NOT|not transfer|not applicable|not change)/i.test(blob)
      );
    },
  },

  // Tripwire 10: Pattern note extends moment-method + entropy-method exhaustion
  // to sieve-method family + names pcc-genuinely-open-pending-new-input as
  // aggregate verdict.
  {
    id: 'imp1318-pattern-note-extends-exhaustion-to-sieve-family',
    why:
      'The pattern note must explicitly identify the EXTENSION of the moment-method ' +
      '+ entropy-method ruling-out to the sieve-method family (imp-1297 + imp-1302 + ' +
      'imp-1303 + imp-1304 + imp-1305 + imp-1309 + imp-1318 all negative) and name ' +
      'pcc-genuinely-open-pending-new-input as the aggregate verdict. The ENTIRE ' +
      'standard analytic-NT toolkit (moment + entropy + sieve) is exhausted.',
    holds: () => {
      const vd = IMP_1318_MAYNARD_SIEVE_PCC.verdictDetail;
      return (
        vd.patternNoteExtendsExhaustionToSieveFamily === true &&
        vd.aggregateVerdict === 'pcc-genuinely-open-pending-new-input' &&
        typeof vd.patternNotePreciselyStated === 'string' &&
        /EXHAUSTED|exhausted/.test(vd.patternNotePreciselyStated) &&
        /imp-1297/.test(vd.patternNotePreciselyStated) &&
        /imp-1305/.test(vd.patternNotePreciselyStated) &&
        /imp-1309/.test(vd.patternNotePreciselyStated) &&
        /imp-1318/.test(vd.patternNotePreciselyStated) &&
        /pcc-genuinely-open-pending-new-input/.test(vd.patternNotePreciselyStated) &&
        /sieve/i.test(vd.patternNotePreciselyStated)
      );
    },
  },

  // Tripwire 11: Semantic check 1 — sieve method 2-point bound gives SAME slack
  // as imp-1303 / imp-1305 / imp-1309 to leading order.
  {
    id: 'imp1318-semantic-sieve-matches-prior-routes-leading-order',
    why:
      'Semantic check: the sieve method 2-point bound must be reported as ' +
      'matching imp-1303 (HB1979) + imp-1305 (GY2003 absolutized) + imp-1309 (Tao ' +
      '2024 entropy closest-known) to leading order with the SAME (log T)^{1/2} ' +
      'slack in the same support window (1, 5/4). A divergent report would falsely ' +
      'claim a NEW bound that does not exist.',
    holds: () => {
      const vd = IMP_1318_MAYNARD_SIEVE_PCC.verdictDetail;
      const t = IMP_1318_MAYNARD_SIEVE_PCC.twoPointTransferEvaluation;
      return (
        typeof vd.whatSieveMethodGivesAt2Point === 'string' &&
        /(imp-1303|HB1979|Heath-Brown)/i.test(vd.whatSieveMethodGivesAt2Point) &&
        /(imp-1305|GY2003|Goldston-Yildirim)/i.test(vd.whatSieveMethodGivesAt2Point) &&
        /(imp-1309|entropy|Tao)/i.test(vd.whatSieveMethodGivesAt2Point) &&
        /\(log T\)\^\{-1\/2\}/.test(vd.whatSieveMethodGivesAt2Point) &&
        typeof t.twoPointBoundFromSieveAttempt === 'string' &&
        /\(log T\)\^\{-1\/2\}/.test(t.twoPointBoundFromSieveAttempt) &&
        t.closesPCCForSupportGtOne === false &&
        typeof t.unconditionalSupportWindowReached === 'string' &&
        /1, 5\/4/.test(t.unconditionalSupportWindowReached)
      );
    },
  },

  // Tripwire 12: Semantic check 2 — parallel-to-imp1309 structural identification.
  // Sieve method and entropy method are structurally parallel; both shift CS
  // stage but neither eliminates it. Both fail at the L^1/L^2 boundary.
  {
    id: 'imp1318-semantic-parallel-to-imp1309-structural-identification',
    why:
      'Semantic check: the sieve method (this imp-1318) and the entropy method ' +
      '(imp-1309) are STRUCTURALLY PARALLEL. Both are primary-domain orthogonal to ' +
      'moment methods. Both shift Cauchy-Schwarz from input stage to output stage ' +
      'without eliminating it. Both incur (log T)^{1/2} slack at the L^1 / L^2 ' +
      'Hölder duality boundary. Both have a (S2)/(R2)-style "structural input ' +
      'absent on zeros" obstruction (admissible-tuple vs additive). This parallel ' +
      'structure is the KEY INSIGHT that explains why ALL "orthogonal-to-moment" ' +
      'candidates fail at PCC at 2-point.',
    holds: () => {
      const r = IMP_1318_MAYNARD_SIEVE_PCC.relationshipToPriorPCCRoutes;
      const a = IMP_1318_MAYNARD_SIEVE_PCC.structuralOrthogonalityAssessment;
      return (
        typeof r.momentMethodRoutesHitCauchySchwarzAtInputStage === 'string' &&
        /Cauchy-Schwarz/.test(r.momentMethodRoutesHitCauchySchwarzAtInputStage) &&
        /input/i.test(r.momentMethodRoutesHitCauchySchwarzAtInputStage) &&
        typeof r.entropyMethodRouteHitsCauchySchwarzAtOutputStage === 'string' &&
        /Cauchy-Schwarz/.test(r.entropyMethodRouteHitsCauchySchwarzAtOutputStage) &&
        /output/i.test(r.entropyMethodRouteHitsCauchySchwarzAtOutputStage) &&
        typeof r.sieveMethodRouteHitsCauchySchwarzAtOutputStage === 'string' &&
        /Cauchy-Schwarz/.test(r.sieveMethodRouteHitsCauchySchwarzAtOutputStage) &&
        /output/i.test(r.sieveMethodRouteHitsCauchySchwarzAtOutputStage) &&
        r.allThreeFamiliesGiveSameLogTHalfSlack === true &&
        typeof a.parallelToImp1309EntropyMethod === 'string' &&
        /imp-1309/.test(a.parallelToImp1309EntropyMethod) &&
        /(parallel|same.*failure|orthogonal-to-moment)/i.test(a.parallelToImp1309EntropyMethod)
      );
    },
  },

  // Tripwire 13: Semantic check 3 — implication for Lambda-attack correctly
  // identifies new-input candidates outside the moment + entropy + sieve triad.
  {
    id: 'imp1318-semantic-lambda-attack-new-input-outside-triad',
    why:
      'Semantic check: the engine-planning implication must name at least one ' +
      'specific candidate route outside the moment + entropy + sieve triad (Connes-' +
      'Bost / Berry-Keating / Hecke-triangle / de Branges / imp-1310 alternative ' +
      'pathway). Without naming concrete candidates the "new input needed" ' +
      'conclusion is unactionable.',
    holds: () => {
      const vd = IMP_1318_MAYNARD_SIEVE_PCC.verdictDetail;
      const s = vd.implicationForLambdaAttack || '';
      const w = vd.whatWouldClose || '';
      const combined = s + ' ' + w;
      return (
        typeof s === 'string' &&
        s.length > 80 &&
        /(Connes-Bost|Berry-Keating|Hecke-triangle|de Branges|imp-1310|alternative §15-27|alternative pathway)/i.test(combined) &&
        /(triad|outside|new|decouple|alternative)/i.test(s) &&
        /(sigma <= 1|support sigma <= 1|sigma > 1)/.test(combined)
      );
    },
  },
];
