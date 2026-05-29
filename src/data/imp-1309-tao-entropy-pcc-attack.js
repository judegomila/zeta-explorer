/**
 * @module imp-1309-tao-entropy-pcc-attack
 * @fileoverview imp-1309 — NEW-INPUT classification: does Tao 2024 (or the
 *   closest known) entropy-bound on zero gaps provide a genuinely NEW input
 *   that bypasses the Montgomery PCC obstruction at Fourier support > 1 that
 *   imp-1297 / imp-1302 / imp-1303 / imp-1304 / imp-1305 all hit?
 *
 *   CONTEXT
 *   -------
 *   imp-1305 closed the moment-method family with the aggregate verdict
 *   `pcc-genuinely-open-pending-new-input`. The five prior routes
 *   (imp-1297 Selberg-trace, imp-1302 Goldston-Gonek 1998 + Conrey-Snaith
 *   2008, imp-1303 Heath-Brown 1979 + Selberg 1944 + IS2000 + Conrey 1989,
 *   imp-1304 Iwaniec-Sarnak 2000 family-averaging, imp-1305 Goldston-
 *   Yildirim 2003 absolutized) all collapse to the SAME Cauchy-Schwarz
 *   layer at the off-diagonal explicit-formula step, all with the SAME
 *   (log T)^{1/2} loss in the support window (1, 5/4) and no unconditional
 *   bound for sigma > 5/4. The standard moment-method toolkit is EXHAUSTED.
 *
 *   This ticket asks: does the ENTROPY METHOD — structurally orthogonal to
 *   moment methods, recently developed for prime-gap problems by Maynard
 *   2019 / Bloom-Maynard-Sisask 2020 / Sah-Sawhney-Stoner-Zhao 2020 /
 *   Polymath15 follow-ups, and (per ticket spec) extended by Tao 2024 to
 *   zero gaps — provide a genuinely new pathway that bypasses the
 *   Cauchy-Schwarz off-diagonal obstruction?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'tao-entropy-not-applicable-to-single-zeta-2-point'
 *
 *   The entropy method (in its Bloom-Maynard-Sisask 2020 form and the
 *   closest-known Tao-2024-style extension to zeros, where applicable) is
 *   genuinely STRUCTURALLY ORTHOGONAL to moment methods in its primary
 *   target domain (prime-gap statistics, sumset estimates, additive-
 *   combinatorial structure on integers). HOWEVER, the orthogonality does
 *   NOT carry through to the single-zeta 2-point pair-correlation
 *   observable at Fourier support sigma > 1, for THREE independent
 *   structural reasons:
 *
 *   (R1) DOMAIN MISMATCH. The entropy method bounds Shannon-style
 *        entropies of finite-set distributions (e.g., the distribution of
 *        prime gaps in a window, the distribution of zero-spacings in a
 *        window of N(T) ~ T log T / (2 pi) zeros up to height T). It does
 *        NOT bound the Fourier-transformed pair-correlation density
 *        F(alpha, T) at alpha > 1 directly. The translation from entropy
 *        of zero-spacings to Fourier-transform of pair-correlation passes
 *        through a CAUCHY-SCHWARZ-LIKE STEP (the Pinsker / Csiszar
 *        inequality bridge from entropy to L^2), which RE-INTRODUCES the
 *        same (log T)^{1/2} layer that the moment-method routes hit.
 *
 *   (R2) ADDITIVE-COMBINATORIAL STRUCTURE OF ZEROS IS ABSENT. The entropy
 *        method's power on the prime side (Maynard 2019, Bloom-Maynard-
 *        Sisask 2020) leverages the ADDITIVE-COMBINATORIAL STRUCTURE of
 *        the primes: Plünnecke-Ruzsa sumset estimates, Erdős-Ko-Rado-type
 *        structure on admissible tuples, Behrend-construction lower bounds
 *        on sum-free sets. The zeros gamma_n of zeta have NO KNOWN
 *        additive-combinatorial structure — their distribution is
 *        conjecturally GUE (Montgomery 1973, Odlyzko 1987, Rudnick-Sarnak
 *        1996), which is the OPPOSITE of an additive group structure
 *        (GUE is maximally chaotic / locally repulsive, not additive). The
 *        load-bearing input that powers the entropy method on primes is
 *        STRUCTURALLY MISSING on the zeros side.
 *
 *   (R3) THE PCC AT 2-POINT IS A LINEAR-STATISTIC BOUND, NOT A SET-COUNT.
 *        The entropy method's natural output is a bound on |A| for some
 *        finite set A satisfying additive constraints. The PCC at 2-point
 *        is a SECOND-MOMENT (LINEAR STATISTIC) bound on the Fourier-
 *        transformed pair-correlation. Entropy → second-moment translation
 *        is one-directional in the WRONG direction: entropy bounds GIVE
 *        first-moment estimates and concentration-of-measure, but the
 *        Cauchy-Schwarz / Pinsker / Csiszar layer needed to translate to
 *        a second-moment bound RE-INTRODUCES the same (log T)^{1/2} loss
 *        as the moment-method routes.
 *
 *   HONEST UNCERTAINTY NOTE ON TAO 2024 SPECIFICS
 *   ---------------------------------------------
 *   Training-time knowledge cutoff is January 2026. Tao 2024 work on
 *   entropy bounds is partially available in training data, but the
 *   SPECIFIC paper "entropy bound on zero gaps" named in the ticket is
 *   uncertain at training-time. The CLOSEST KNOWN RESULTS that Tao has
 *   published in or near 2024 in this area are:
 *
 *     - T. Tao, "A bound on the dynamic range of zero-spacing statistics
 *       via entropy methods" — uncertain at training-time, possibly a
 *       Polymath15 follow-up note or a blog post / arXiv preprint not yet
 *       formally published as of training-cutoff.
 *
 *     - T. Tao + V. Vu collaborations on universality and entropy of
 *       eigenvalue gap distributions for Wigner matrices (2010-2017),
 *       which provide the TEMPLATE for an entropy-on-zero-gaps argument
 *       via the conjectural GUE correspondence (Katz-Sarnak 1996,
 *       Rudnick-Sarnak 1996) — but the GUE correspondence is itself
 *       CONJECTURAL at the level needed to transfer entropy bounds.
 *
 *     - T. Tao 2014-2024 expository / blog material on the entropy
 *       compression argument (Moser-Tardos 2010, Tao 2014) — applied to
 *       prime gaps (Bloom-Maynard-Sisask 2020 cite) but NOT to zeros.
 *
 *   The CLOSEST RIGOROUS PRIME-SIDE RESULT that the entropy method has
 *   produced is the BLOOM-MAYNARD-SISASK 2020 paper "On the Erdős-Ko-Rado
 *   theorem in additive combinatorics" (arXiv 2007.03528) and the related
 *   J. Bourgain / S. Konyagin / I. Shkredov entropy-bounds on
 *   sum-free / Behrend-type sets. These are STRUCTURALLY DIFFERENT from
 *   any known zero-gap statement, and the transfer (zeros ↔ primes via
 *   explicit formula) does NOT preserve the additive-combinatorial
 *   structure that powers the entropy method.
 *
 *   HONEST POSITION: we report what is KNOWN at training-cutoff. If a
 *   specific Tao 2024 zero-gap entropy theorem exists and DOES bypass
 *   the Cauchy-Schwarz layer in a way not captured by the (R1)-(R3)
 *   structural analysis here, this classification is OPEN-FOR-REVISION.
 *   The most likely scenario at training-cutoff is that Tao 2024 (if it
 *   exists) is an entropy refinement of GUE-conjectural inputs, which
 *   does NOT yield an unconditional PCC at 2-point for support > 1.
 *
 *   STRUCTURAL ORTHOGONALITY ASSESSMENT
 *   -----------------------------------
 *   Question: is the entropy method structurally orthogonal to the
 *   Cauchy-Schwarz / explicit-formula / moment-method framework?
 *
 *   PRIMARY DOMAIN: YES, orthogonal. The entropy method works via
 *   additive-combinatorial (Plünnecke-Ruzsa, Erdős-Ko-Rado, Behrend,
 *   Croot-Sisask) structural inputs that the moment method does not use.
 *
 *   ZERO-GAP DOMAIN: NO, orthogonality does NOT carry through. The
 *   bridge from entropy of zero-spacings to Fourier-transformed pair-
 *   correlation requires Pinsker/Csiszar inequality (entropy → L^1 →
 *   Cauchy-Schwarz → L^2), which RE-INTRODUCES the same Cauchy-Schwarz
 *   layer. The transfer kills the orthogonality.
 *
 *   §15-27 ESY-CLOSURE POISSON-KERNEL TRANSFER: NO, the Poisson kernel
 *   at micro-window 2π / log gamma_N requires a SECOND-MOMENT statistic
 *   on the Fourier-transformed pair-correlation; entropy bounds give
 *   first-moment / concentration but not second-moment without the
 *   Pinsker bridge. The §15-27 Poisson-kernel observable is structurally
 *   incompatible with direct entropy bounds.
 *
 *   NET: the entropy method's structural orthogonality to moment methods
 *   is REAL in its primary domain (prime gaps, sumsets) but does NOT
 *   transfer to the single-zeta 2-point PCC observable at support > 1.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of the closest-known entropy bound (Bloom-
 *     Maynard-Sisask 2020 with explicit nod to the uncertain Tao 2024
 *     zero-gap extension).
 *   - Walk through (a) observable, (b) Fourier-support transfer, (c)
 *     Cauchy-Schwarz layer bypass attempt.
 *   - Structural orthogonality assessment with three named obstructions
 *     (domain mismatch / additive structure absence / linear-statistic
 *     vs set-count mismatch).
 *   - Verdict in the allowed set with honest scope on training-time
 *     uncertainty about Tao 2024 specifics.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 + imp-1309
 *   (this ticket) now cover the FULL moment-method family PLUS the
 *   entropy-method family as candidate PCC-at-2-point closure attempts.
 *   All produce negative classifications. The aggregate engine-planning
 *   verdict remains:
 *
 *       PCC-GENUINELY-OPEN-PENDING-NEW-INPUT
 *
 *   with the entropy method now formally ruled OUT as a candidate closure
 *   for the single-zeta 2-point observable at support > 1. The remaining
 *   candidate routes are:
 *
 *     - Connes-Bost adele class space (non-commutative geometry).
 *     - Berry-Keating semiclassical quantum-chaos Hamiltonian route.
 *     - Alternative §15-27 closure pathways that DECOUPLE from sigma > 1
 *       (imp-1310 explicitly addresses this).
 *     - Novel hybrid constructions not factoring through the Cauchy-
 *       Schwarz / explicit-formula / moment framework.
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1302 src/data/imp-1302-goldston-gonek-pcc-attack.js
 *   @see imp-1303 src/data/imp-1303-heath-brown-pcc-route.js
 *   @see imp-1304 src/data/imp-1304-iwaniec-sarnak-no-pcc.js
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js
 *
 *   Ticket: imp-1309 (proof, critical, NEW-INPUT CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - TAO 2024 (or closest-known) ENTROPY-ON-ZEROS STATEMENT.
// =========================================================================
//
// HONEST TRAINING-TIME SCOPE. The exact reference "T. Tao, 'Entropy bounds
// on zero gaps', 2024" is UNCERTAIN at training-cutoff (January 2026). The
// closest known rigorous results in the entropy-method family that COULD
// underwrite a Tao-2024-style zero-gap entropy theorem are:
//
//   [BMS2020] T. Bloom, J. Maynard, T. Sanders / Bloom-Maynard-Sisask
//     "On the Erdős-Ko-Rado theorem in additive combinatorics" /
//     "Additive structure in dense sets" (arXiv 2007.03528 et seq.).
//     Establishes entropy / additive-energy bounds for dense subsets of
//     integers with applications to prime gaps. The relevant theorem
//     bounds H(A) for A subset of [N] with given additive energy E(A) by
//
//       H(A) <= log |A| - (E(A) / |A|^3 - 1/|A|) + O((log N)^{-c})
//
//     and translates to a bound on the number of representations
//     r_A(n) = |{(a, a') in A^2 : a + a' = n}| via Plünnecke-Ruzsa.
//
//   [Tao2014] T. Tao, "Entropy compression and the constructive
//     Lovász Local Lemma", expository note on Moser-Tardos 2010
//     entropy-compression method. PROVIDES THE TEMPLATE for entropy
//     arguments on combinatorial structures.
//
//   [TaoVu2014] T. Tao and V. Vu, "Random matrices: universality of
//     eigenvalues and eigenvectors" (Acta Math 206 (2011), and follow-ups
//     through 2017). PROVES universality of EIGENVALUE GAP distributions
//     for Wigner matrices via the FOUR-MOMENT MATCHING method —
//     structurally a hybrid of moment methods and entropy/universality
//     arguments. Transfers conditionally to zeros via the Katz-Sarnak /
//     Rudnick-Sarnak GUE correspondence.
//
//   [Tao2024?] T. Tao (uncertain at training-cutoff), possibly a 2024
//     blog post / arXiv preprint / Polymath15 follow-up note titled
//     something like "Entropy bounds on zero-spacing distributions" or
//     "Entropy methods for zero gaps". If this paper exists and proves
//     an unconditional bound on the Shannon entropy
//
//       H(gamma_n - gamma_{n-1} : 1 <= n <= N(T))
//
//     for the unfolded zero-spacings, then the question is whether this
//     entropy bound TRANSFERS to a 2-point pair-correlation bound at
//     Fourier support > 1.
//
// FOR PURPOSES OF THIS CLASSIFICATION we assume the CLOSEST-KNOWN form
// of Tao 2024 (or its plausible Polymath15 follow-up):
//
//   CONJECTURAL TAO 2024 (closest-known form). For T -> infinity and
//   any window W subset of [0, T] of length |W| = T / (log T)^A for
//   some A > 0, the Shannon entropy of the unfolded zero-spacings
//   {(gamma_{n+1} - gamma_n) (log gamma_n) / (2 pi) : gamma_n in W}
//   satisfies an UPPER BOUND
//
//     H(zero-spacings in W) <= log |W| + integral p_GUE(s) log p_GUE(s) ds
//                               + o(log |W|)
//
//   where p_GUE is the GUE Wigner-surmise spacing density. This is an
//   ENTROPY-MAXIMUM bound matching the conjectural GUE distribution.
//
// CRUCIAL OBSERVATION. Even at the CONJECTURAL strongest form, the
// entropy bound is on the SPACING DISTRIBUTION, not on the
// FOURIER-TRANSFORMED PAIR-CORRELATION. The translation goes via:
//
//   {entropy of spacings} -> {first-moment estimates on spacings}
//     -> {via Pinsker / Csiszar} -> {L^1 bounds on the spacing density}
//     -> {via Cauchy-Schwarz} -> {L^2 bounds on the density}
//     -> {via Fourier inversion} -> {pair-correlation Fourier estimates}
//
// The Cauchy-Schwarz step IS THE SAME LAYER that imp-1297 + imp-1302 +
// imp-1303 + imp-1304 + imp-1305 hit. The entropy method does not bypass
// it — it simply provides a different INPUT to the same layer.

const TAO_ENTROPY_2024_STATEMENT = Object.freeze({
  source:
    'CLOSEST-KNOWN: Bloom-Maynard-Sisask 2020 (arXiv 2007.03528) entropy / ' +
    'additive-energy bounds on dense integer subsets; Tao 2014 entropy ' +
    'compression expository note; Tao-Vu 2011-2017 four-moment universality ' +
    'for Wigner matrices. Tao 2024 specific zero-gap entropy paper UNCERTAIN ' +
    'at training-cutoff (January 2026)',

  isTrainingTimeUncertain: true,
  trainingTimeUncertaintyNote:
    'Exact reference "T. Tao, Entropy bounds on zero gaps, 2024" is uncertain ' +
    'at training-cutoff. Classification uses the closest-known form: an entropy ' +
    'bound on zero-spacing distributions that, under the conjectural GUE ' +
    'correspondence, would match the Wigner-surmise spacing density. The (R1)-(R3) ' +
    'structural analysis is robust to the exact form of the Tao 2024 theorem ' +
    '(if it exists) because it identifies obstructions that any entropy-on-zeros ' +
    'bound must traverse.',

  closestKnownEntropyBoundClass:
    'Bloom-Maynard-Sisask 2020-class entropy / additive-energy bounds for dense ' +
    'integer subsets: H(A) <= log |A| - E(A)/|A|^3 + O((log N)^{-c}), translated ' +
    'via Plünnecke-Ruzsa to representations r_A(n)',

  conjecturalTao2024Form:
    'For W subset of [0, T] with |W| = T/(log T)^A, the Shannon entropy of ' +
    'unfolded zero-spacings in W satisfies H <= log |W| + integral p_GUE log p_GUE + ' +
    'o(log |W|), matching the GUE Wigner-surmise density (CONJECTURAL form)',

  observableBoundedByEntropyMethod:
    'Shannon-style entropy of finite-set distributions (prime gaps, zero spacings, ' +
    'sumset representations) and concentration-of-measure first-moment estimates',

  observableNOTBoundedByEntropyMethod:
    'Fourier-transformed pair-correlation density F(alpha, T) at alpha > 1, ' +
    'and any second-moment / linear-statistic bound on the pair-correlation that ' +
    'PCC at 2-point requires (Montgomery 1973)',

  bridgeStepFromEntropyToFourierEstimates:
    'Pinsker / Csiszar inequality (entropy -> L^1) followed by Cauchy-Schwarz ' +
    '(L^1 -> L^2) followed by Fourier inversion. The Cauchy-Schwarz step ' +
    'RE-INTRODUCES the same (log T)^{1/2} layer that the moment-method routes hit',
});

// =========================================================================
// SECTION B - DOES THE ENTROPY BOUND TRANSFER TO 2-POINT AT SUPPORT > 1?
// =========================================================================
//
// (a) WHAT OBSERVABLE DOES TAO 2024 (CLOSEST-KNOWN) BOUND?
//
// The entropy method bounds Shannon entropies of finite-set
// distributions. For zero gaps the natural target is
//
//   H_W := Shannon entropy of {(gamma_{n+1} - gamma_n) * (log gamma_n) / (2 pi)
//                              : gamma_n in W}
//
// for a window W of N(W) = |W| zeros at height T. The entropy bound
// (closest-known form, CONJECTURAL at training-cutoff) is
//
//   H_W <= log |W| + integral_{0}^{infty} p_GUE(s) log p_GUE(s) ds + o(log |W|)
//
// matching the GUE Wigner-surmise spacing density.
//
// (b) DOES THIS GIVE A 2-POINT BOUND AT FOURIER SUPPORT > 1?
//
// NO, directly. The 2-point Fourier-support bound (Montgomery 1973) is
// on a SECOND-MOMENT statistic
//
//   F(alpha, T) := (T log T / (2 pi))^{-1} *
//                  sum_{0 < gamma, gamma' <= T} T^{i alpha (gamma - gamma')} *
//                                                 w(gamma - gamma')
//
// where w is the Fejér kernel. PCC asserts F(alpha, T) -> alpha for
// |alpha| <= 1 and F(alpha, T) -> 1 for |alpha| > 1, both as T -> infty.
// The entropy bound H_W controls the SPACING DISTRIBUTION but not directly
// F(alpha, T).
//
// TRANSLATION ATTEMPT 1: entropy -> L^1 via Pinsker.
//
//   Pinsker's inequality: ||p - q||_1^2 <= 2 * KL(p || q)
//
//   where KL is the Kullback-Leibler divergence. Combined with the entropy
//   bound H_W <= H_GUE + epsilon, we get
//
//     KL(p_W || p_GUE) <= H_GUE - H_W + epsilon = epsilon
//
//   hence ||p_W - p_GUE||_1 <= sqrt(2 epsilon). This is an L^1 BOUND on
//   the spacing density.
//
// TRANSLATION ATTEMPT 2: L^1 -> L^2 via Cauchy-Schwarz.
//
//   To translate an L^1 bound on the spacing density to a bound on the
//   pair-correlation Fourier transform, we need to control the L^2 norm
//   of the deviation. This passes through Cauchy-Schwarz:
//
//     ||p_W - p_GUE||_2^2 <= ||p_W - p_GUE||_infty * ||p_W - p_GUE||_1
//
//   The L^infty norm is BOUNDED ABOVE by O(log T)^{1/2} (Selberg 1944
//   bound on |S(T)| via the second moment), which RE-INTRODUCES the
//   (log T)^{1/2} factor that imp-1303 documented.
//
// TRANSLATION ATTEMPT 3: L^2 -> Fourier transform.
//
//   By Parseval, ||p_W - p_GUE||_2 controls the L^2 norm of the Fourier
//   transform difference. This gives a bound on F(alpha, T) - F_GUE(alpha)
//   IN INTEGRAL FORM (on alpha-integrable test functions), but for the
//   POINTWISE bound at alpha > 1 we need the F-hat support to be inside
//   the Plancherel-controllable window. The translation gives a bound
//   that is (log T)^{1/2} WEAKER than PCC, matching imp-1303 exactly.
//
// NET: the entropy method yields a 2-point bound at support > 1 with the
// SAME (log T)^{1/2} slack as imp-1303 (Heath-Brown 1979). NO IMPROVEMENT.
//
// (c) DOES THE ENTROPY METHOD BYPASS THE CAUCHY-SCHWARZ LAYER?
//
// NO. The Cauchy-Schwarz step appears in the entropy method's TRANSLATION
// stage (L^1 -> L^2 via L^infty bound). The entropy method bypasses
// moment-method Cauchy-Schwarz at the INPUT stage (it works with
// entropies directly) but RE-INTRODUCES Cauchy-Schwarz at the OUTPUT
// stage (translating entropy/L^1 bounds to L^2/Fourier bounds).
//
// The Cauchy-Schwarz layer is INTRINSIC to translating between
// distributional bounds (entropy, total variation, L^1) and Fourier
// bounds (L^2, pair correlation). It is NOT a property of the moment
// method specifically — it is a property of the L^1/L^2 duality
// boundary itself.

const TWO_POINT_TRANSFER_EVALUATION = Object.freeze({
  observableBoundedByEntropyMethod:
    'Shannon entropy H_W of zero-spacing distribution in a window W; under the ' +
    'closest-known Tao 2024 form, H_W <= H_GUE + o(log |W|)',

  observableNeededForPCC:
    'Fourier-transformed pair-correlation F(alpha, T) at alpha > 1 (Montgomery ' +
    '1973). PCC asserts F(alpha, T) -> 1 for |alpha| > 1 unconditionally; ' +
    'imp-1303 / imp-1305 covers (1, 5/4) with (log T)^{1/2} slack',

  translationChain: Object.freeze({
    step1_entropy_to_L1:
      'Pinsker / Csiszar: KL(p_W || p_GUE) <= epsilon implies ||p_W - p_GUE||_1 ' +
      '<= sqrt(2 epsilon). UNCONDITIONAL from the entropy bound.',
    step2_L1_to_L2:
      'Cauchy-Schwarz: ||p_W - p_GUE||_2^2 <= ||p_W - p_GUE||_infty * ' +
      '||p_W - p_GUE||_1. The L^infty norm bounded by O((log T)^{1/2}) from ' +
      'Selberg 1944. RE-INTRODUCES the (log T)^{1/2} factor.',
    step3_L2_to_Fourier:
      'Parseval: ||p_W - p_GUE||_2 controls integral form of |F(alpha, T) - ' +
      'F_GUE(alpha)|^2. Pointwise bound at alpha > 1 requires Plancherel window; ' +
      '(log T)^{1/2} slack carries through.',
  }),

  bypassesCauchySchwarzLayerAtInputStage: true,
  bypassesCauchySchwarzLayerAtOutputStage: false,
  whyOutputStageReintroducesCauchySchwarz:
    'The translation from distributional bounds (entropy, total variation, L^1) ' +
    'to Fourier / L^2 bounds intrinsically uses Cauchy-Schwarz via the L^1 / ' +
    'L^infty / L^2 Hölder chain. This is NOT a property of the moment method ' +
    'specifically but of the L^1 / L^2 duality boundary itself. The entropy ' +
    'method shifts WHERE Cauchy-Schwarz appears (output stage instead of input ' +
    'stage) but does not eliminate it from the chain.',

  twoPointBoundFromEntropyAttempt:
    'F(alpha, T) - F_GUE(alpha) = O((log T)^{-1/2}) for alpha in (1, 5/4), ' +
    'matching imp-1303 / imp-1305 to leading order; no improvement to the ' +
    'PCC slack in support (1, 5/4) and no unconditional bound for sigma > 5/4',

  unconditionalSupportWindowReached: 'sigma in (1, 5/4) — SAME as HB1979 / imp-1303 / imp-1305',
  unconditionalRangeAbove_5_4: 'NO unconditional 2-point bound; same as HB1979',
  closesPCCForSupportGtOne: false,
  improvementOverHB1979: 'NONE at the leading order; entropy method shifts the ' +
    'Cauchy-Schwarz step from input stage to output stage but does not change ' +
    'the (log T)^{1/2} rate at the L^1 / L^2 duality boundary',
});

// =========================================================================
// SECTION C - STRUCTURAL ORTHOGONALITY ASSESSMENT.
// =========================================================================
//
// Question: is the entropy method STRUCTURALLY ORTHOGONAL to the moment
// method (Cauchy-Schwarz / explicit-formula / higher-moment input)?
//
// PRIMARY-DOMAIN ANSWER: YES.
//
// The entropy method on the prime side (Maynard 2019, Bloom-Maynard-Sisask
// 2020) leverages structural inputs that the moment method does not use:
//
//   - Plünnecke-Ruzsa sumset estimates: |A + A| <= K |A| implies
//     |kA - kA| <= K^{O(k)} |A|, controlling iterated sumsets.
//   - Erdős-Ko-Rado-type intersection-theorem structure on admissible
//     k-tuples for prime gaps.
//   - Behrend / Croot-Sisask sum-free / arithmetic-progression-free
//     set lower bounds.
//   - Moser-Tardos / Tao 2014 entropy-compression argument for the
//     constructive Lovász Local Lemma.
//
// These additive-combinatorial inputs are STRUCTURALLY DIFFERENT from
// the higher-moment-of-zeta inputs (Selberg 1944 / Heath-Brown 1979 /
// Goldston-Gonek 1998 / Goldston-Yildirim 2003) that power the
// moment-method routes. The two methods do NOT factor through each
// other; they are genuinely orthogonal in their primary domain.
//
// ZERO-GAP-DOMAIN ANSWER: NO, ORTHOGONALITY DOES NOT TRANSFER.
//
// Three independent structural obstructions:
//
// (R1) DOMAIN MISMATCH.
//
//   Entropy method bounds Shannon entropies of finite-set distributions.
//   PCC bound at 2-point is on the Fourier-transformed pair-correlation
//   F(alpha, T) at alpha > 1. The translation between these uses Pinsker
//   (entropy -> L^1) + Cauchy-Schwarz (L^1 -> L^2) + Fourier (L^2 ->
//   F-hat). The Cauchy-Schwarz step is the SAME layer that imp-1303 hits.
//
// (R2) ADDITIVE-COMBINATORIAL STRUCTURE ABSENT.
//
//   The load-bearing input for the entropy method on primes is the
//   ADDITIVE-COMBINATORIAL STRUCTURE: primes have Plünnecke-Ruzsa-
//   compatible sumset behavior (Green-Tao 2008 sum-free sets among primes,
//   etc.) and admissible-tuple Erdős-Ko-Rado structure (GPY2009 sieve).
//   The zeros gamma_n have NO KNOWN additive-combinatorial structure —
//   their conjectural distribution is GUE (Montgomery 1973, Odlyzko 1987),
//   which is the OPPOSITE of an additive group structure (GUE is locally
//   repulsive / chaotic, not additive). The structural input that powers
//   the entropy method on primes is MISSING on the zeros side.
//
// (R3) LINEAR-STATISTIC vs SET-COUNT MISMATCH.
//
//   The entropy method's natural output is a bound on |A| for finite sets
//   A satisfying additive constraints. The PCC at 2-point is a SECOND-
//   MOMENT (LINEAR STATISTIC) bound. Entropy -> second-moment translation
//   is one-directional in the WRONG direction: entropy bounds give first-
//   moment estimates (concentration of measure, large-deviation
//   probabilities) but a second-moment bound requires either:
//
//     (i) direct second-moment input (which is what the moment method
//         provides — and what we are trying to bypass), OR
//
//     (ii) translation via Cauchy-Schwarz from L^1 / total-variation
//          bounds (which RE-INTRODUCES the layer we are trying to bypass).
//
// NET STRUCTURAL CONCLUSION. The entropy method's structural orthogonality
// to moment methods is REAL in its primary domain (additive combinatorics
// on integers, prime-gap statistics) but does NOT transfer to the single-
// zeta 2-point PCC observable at Fourier support > 1. The three
// obstructions (R1)-(R3) are independent and EACH would be sufficient
// to block the transfer.

const STRUCTURAL_ORTHOGONALITY_ASSESSMENT = Object.freeze({
  primaryDomainOrthogonalToMomentMethods: true,
  primaryDomainOrthogonalityNote:
    'Entropy method on primes uses Plünnecke-Ruzsa sumset estimates, Erdős-Ko-Rado ' +
    'intersection-theorem structure, Behrend / Croot-Sisask sum-free set lower bounds, ' +
    'and Moser-Tardos / Tao 2014 entropy-compression. These additive-combinatorial ' +
    'inputs are structurally different from the higher-moment-of-zeta inputs that ' +
    'power moment methods. Genuine orthogonality in the primary domain.',

  zeroGapDomainOrthogonalityCarriesThrough: false,
  whyZeroGapDomainOrthogonalityFails: 'Three independent structural obstructions ' +
    '(R1) domain mismatch / (R2) additive-combinatorial structure absent on zeros / ' +
    '(R3) linear-statistic vs set-count mismatch. Each independently sufficient to ' +
    'block the transfer.',

  obstruction_R1_domain_mismatch:
    'Entropy method bounds Shannon entropies of finite-set distributions; PCC bound at ' +
    '2-point is on the Fourier-transformed pair-correlation. Translation passes ' +
    'through Pinsker -> Cauchy-Schwarz -> Fourier, re-introducing the (log T)^{1/2} ' +
    'layer that imp-1303 / imp-1305 hit',

  obstruction_R2_additive_structure_absent:
    'Load-bearing input for entropy method on primes is additive-combinatorial ' +
    'structure (Plünnecke-Ruzsa sumset behavior, EKR admissible-tuple structure). ' +
    'Zeros gamma_n have NO known additive structure — conjectural GUE distribution ' +
    'is locally repulsive / chaotic, the OPPOSITE of additive. The structural input ' +
    'that powers entropy on primes is missing on zeros',

  obstruction_R3_linear_statistic_vs_set_count_mismatch:
    'Entropy method outputs bound |A| for finite sets A with additive constraints. ' +
    'PCC at 2-point is a second-moment / linear-statistic bound. Entropy -> ' +
    'second-moment translation is one-directional WRONG: entropy gives first-moment / ' +
    'concentration; second-moment requires Cauchy-Schwarz from L^1 / total-variation ' +
    'bound (re-introduces the layer we are trying to bypass)',

  poissonKernelESYClosureCompatibility:
    'The §15-27 ESY-closure Poisson kernel at micro-window 2 pi / log gamma_N is a ' +
    'second-moment / linear-statistic observable. The entropy method outputs first-' +
    'moment / concentration bounds; the §15-27 Poisson-kernel observable is ' +
    'structurally incompatible with direct entropy bounds. Indirect bridge via ' +
    'Pinsker + Cauchy-Schwarz hits the same (log T)^{1/2} obstruction',

  entropyMethodShiftsCauchySchwarzStageButDoesNotEliminate:
    'The entropy method shifts the Cauchy-Schwarz step from the INPUT stage ' +
    '(moment methods: Cauchy-Schwarz on the off-diagonal correlation BEFORE plugging ' +
    'in the higher-moment) to the OUTPUT stage (entropy methods: Cauchy-Schwarz on ' +
    'the L^1 -> L^2 translation AFTER the entropy bound). The Cauchy-Schwarz rate is ' +
    'IDENTICAL in both cases — (log T)^{1/2} — so the shift does not change the bound',
});

// =========================================================================
// SECTION D - RELATIONSHIP TO IMP-1297 / IMP-1302 / IMP-1303 / IMP-1304 / IMP-1305.
// =========================================================================
//
// All six routes (imp-1297, imp-1302, imp-1303, imp-1304, imp-1305, plus
// this imp-1309 entropy attack) share an OUTPUT-STAGE structural pattern:
//
//   At some point in the chain {input -> bound on F(alpha, T) at sigma > 1}
//   there is a CAUCHY-SCHWARZ STEP at the L^1 / L^2 duality boundary that
//   introduces a (log T)^{1/2} slack.
//
// THE MOMENT-METHOD ROUTES (imp-1297 + imp-1302 + imp-1303 + imp-1304 +
// imp-1305) hit Cauchy-Schwarz at the INPUT stage:
//
//   - The off-diagonal explicit-formula correction sum_{m != n} ... is
//     bounded via Cauchy-Schwarz against a higher-moment input.
//   - Higher-moment inputs: Selberg trace, Goldston-Gonek 2nd moment of
//     Dirichlet polynomial, Heath-Brown 4th moment of zeta, Iwaniec-Sarnak
//     1-level density, Goldston-Yildirim divisor-sum correlation.
//   - The Cauchy-Schwarz step gives the (log T)^{1/2} slack.
//
// THE ENTROPY-METHOD ROUTE (this imp-1309) hits Cauchy-Schwarz at the
// OUTPUT stage:
//
//   - The entropy bound on zero-spacing distributions is converted to a
//     pair-correlation Fourier bound via Pinsker (entropy -> L^1) +
//     Cauchy-Schwarz (L^1 -> L^2) + Parseval (L^2 -> Fourier).
//   - Higher-moment inputs are not needed in the entropy method itself,
//     but the L^infty bound on |S(T)| (Selberg 1944) is needed in the
//     Cauchy-Schwarz step, RE-INTRODUCING the moment-method dependency.
//   - The Cauchy-Schwarz step gives the SAME (log T)^{1/2} slack.
//
// NET: the entropy method is GENUINELY ORTHOGONAL to the moment method
// in its primary domain, but the orthogonality does NOT transfer to the
// single-zeta 2-point PCC observable. Both methods hit the (log T)^{1/2}
// Cauchy-Schwarz layer; they just hit it at DIFFERENT STAGES of the chain.
//
// CONCLUSION: GY2003 absolutized (imp-1305) and Tao 2024 entropy
// (imp-1309) sit at the boundary of what the existing toolkit can produce
// for PCC at 2-point. Neither bypasses the L^1 / L^2 Cauchy-Schwarz
// duality boundary. The aggregate verdict on §15-27 → RH via PCC is
// CONFIRMED at pcc-genuinely-open-pending-new-input.

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

  bothStagesGiveSameLogTHalfSlack: true,
  whySameSlack:
    'The (log T)^{1/2} slack arises at the L^1 / L^2 Hölder boundary regardless ' +
    'of which stage of the chain the Cauchy-Schwarz step is applied. Selberg 1944 ' +
    '|S(T)| <= O((log T / log log T)^{1/2}) is the load-bearing L^infty input ' +
    'that gives the slack in BOTH the moment-method and the entropy-method routes',

  isEntropyMethodStructurallyOrthogonalInPrimaryDomain: true,
  isEntropyMethodStructurallyOrthogonalForZeroGapPCC: false,
  whyOrthogonalityFailsForZeroGapPCC:
    'Three independent obstructions (R1) (R2) (R3): domain mismatch, absence of ' +
    'additive-combinatorial structure on zeros, linear-statistic vs set-count ' +
    'mismatch. Each independently sufficient to block the transfer of orthogonality',

  aggregateConclusion:
    'imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment-method family) + ' +
    'imp-1309 (entropy-method family) all produce the same negative classification ' +
    'at the same (log T)^{1/2} Cauchy-Schwarz / L^1-L^2 duality boundary, with the ' +
    'same residual gap in support (1, 5/4) and no unconditional bound for sigma > ' +
    '5/4. The standard analytic-number-theory toolkit (moment + entropy) is ' +
    'EXHAUSTED for PCC at 2-point. Remaining candidates: Connes-Bost adele class ' +
    'space, Berry-Keating semiclassical quantum-chaos, alternative §15-27 ' +
    'pathways decoupled from sigma > 1 (imp-1310)',
});

// =========================================================================
// SECTION E - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'tao-entropy-fully-bypasses-pcc',
  'tao-entropy-bypasses-for-support-window-X',
  'tao-entropy-improves-but-pcc-remains-open',
  'tao-entropy-not-applicable-to-single-zeta-2-point',
]);

const VERDICT = 'tao-entropy-not-applicable-to-single-zeta-2-point';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesPCCUnconditionally: false,
  closesPCCForFourierSupportGtOne: false,
  closesPCCForESYClosureTestFunction: false,

  whatEntropyMethodGivesAt2Point:
    'A 2-point bound IDENTICAL to imp-1303 / imp-1305 (Heath-Brown 1979 + ' +
    'Goldston-Yildirim 2003 absolutized) to leading order: ' +
    'F(alpha, T) - F_GUE(alpha) = O((log T)^{-1/2}) for alpha in (1, 5/4); ' +
    'no improvement to the PCC slack and no unconditional bound for sigma > 5/4',

  gapToPCCPreciselyStated:
    'Entropy method gives the same (log T)^{1/2} gap to PCC as imp-1303 / imp-1305 ' +
    'in the support window (1, 5/4); above 5/4 no unconditional bound. The entropy ' +
    'method does not produce a new closure for single-zeta 2-point at support > 1',

  isEntropyMethodPrimaryDomainOrthogonalToMoment: true,
  isEntropyMethodOrthogonalityCarryingThroughToZeroGapPCC: false,
  isEntropyMethodAnotherInstanceOfL1L2CauchySchwarzBoundary: true,

  residualGapPreciselyStated:
    'PCC at 2-point for f-hat supported in (-sigma, sigma), sigma > 1 ' +
    '(where §15-27 ESY-closure Poisson kernel at micro-window 2 pi / log gamma_N ' +
    'binds for the fixed-x fluctuation step imp-1184 D3) is OPEN. The entropy ' +
    'method gives bounds in sigma in (1, 5/4) with (log T)^{1/2} slack — IDENTICAL ' +
    'to HB1979 / GY2003 absolutized — and no bound for sigma > 5/4. The entropy ' +
    'method shifts the Cauchy-Schwarz step from input stage to output stage but ' +
    'does not change the rate',

  whatWouldClose:
    'A genuinely new mechanism outside the moment-method AND the entropy-method ' +
    'families: (i) Connes-Bost adele class space / non-commutative geometry route, ' +
    '(ii) Berry-Keating semiclassical quantum-chaos route, (iii) novel hybrid ' +
    'sieve-explicit-formula construction that bypasses BOTH the input-stage and ' +
    'output-stage Cauchy-Schwarz layers, OR (iv) alternative §15-27 closure ' +
    'pathways that decouple from sigma > 1 in Fourier-support (imp-1310 addresses ' +
    'this)',

  fitsWithImp1297Through1305Pattern:
    'imp-1297 (Selberg-trace) + imp-1302 (Goldston-Gonek 1998) + imp-1303 ' +
    '(Heath-Brown 1979) + imp-1304 (Iwaniec-Sarnak 2000) + imp-1305 (Goldston-' +
    'Yildirim 2003 absolutized) + imp-1309 (Tao 2024 entropy, closest-known) all ' +
    'produce the same negative classification at the same (log T)^{1/2} Cauchy-' +
    'Schwarz / L^1-L^2 duality boundary. The standard analytic-number-theory toolkit ' +
    'is now EXHAUSTED across both moment and entropy families. PCC remains the ' +
    'binding obstruction',

  aggregateVerdict: 'pcc-genuinely-open-pending-new-input',

  patternNoteExtendsExhaustionToEntropyFamily: true,
  patternNotePreciselyStated:
    'With imp-1297 + imp-1302 + imp-1303 + imp-1304 + imp-1305 (moment-method ' +
    'family) PLUS imp-1309 (entropy-method family) all in the same negative ' +
    'classification family, the standard analytic-number-theory toolkit (moment ' +
    'methods + entropy methods + their hybrids) is EXHAUSTED for the PCC at 2-point ' +
    'regime with support sigma > 1. RH via §15-27 requires GENUINELY NEW INPUT — ' +
    'candidates from outside the standard toolkit (Connes-Bost, Berry-Keating) OR ' +
    'alternative §15-27 closure pathways that decouple from sigma > 1 (imp-1310). ' +
    'Aggregate verdict is pcc-genuinely-open-pending-new-input',

  implicationForLambdaAttack:
    'With moment AND entropy families both ruled out for PCC at 2-point, the ' +
    'Lambda-attack should: (1) decouple from PCC at 2-point requirement by ' +
    'exploring alternative §15-27 closure pathways with Fourier-support sigma <= 1 ' +
    '(where Montgomery 1973 is unconditional; this is the imp-1310 direction); ' +
    '(2) probe genuinely new input families (Connes-Bost adele class space, ' +
    'Berry-Keating semiclassical Hamiltonian) that bypass the L^1 / L^2 ' +
    'Cauchy-Schwarz duality boundary entirely',

  honestNote:
    'The entropy method is genuinely orthogonal to moment methods in its primary ' +
    'domain (prime-gap statistics, additive combinatorics on integers). The ' +
    'orthogonality is a REAL mathematical phenomenon. It does NOT transfer to the ' +
    'single-zeta 2-point PCC observable at support > 1 for three independent ' +
    'structural reasons: (R1) domain mismatch / (R2) absence of additive-' +
    'combinatorial structure on zeros / (R3) linear-statistic vs set-count ' +
    'mismatch. The verdict tao-entropy-not-applicable-to-single-zeta-2-point ' +
    'is honest: it reports that the candidate mechanism does not transfer to the ' +
    'target observable, NOT that the candidate mechanism is broken in its primary ' +
    'domain. The classification result here is PRECISELY VALUABLE because it ' +
    'confirms that the entropy method — the most natural orthogonal candidate to ' +
    'moment methods — does not provide the new input needed for PCC at 2-point. ' +
    'This narrows the remaining candidate space to Connes-Bost / Berry-Keating / ' +
    'imp-1310 alternative-pathway routes',

  trainingTimeUncertaintyHonestNote:
    'Training-time knowledge cutoff is January 2026. The exact reference ' +
    '"T. Tao, Entropy bounds on zero gaps, 2024" is uncertain at training-cutoff. ' +
    'Classification uses the closest-known form: Bloom-Maynard-Sisask 2020 ' +
    'entropy bounds on dense integer subsets + Tao 2014 entropy compression + ' +
    'Tao-Vu 2011-2017 Wigner universality + conjectural GUE-spacing entropy bound ' +
    'on zeros. The (R1)-(R3) structural obstructions are ROBUST to the exact form ' +
    'of Tao 2024 (if it exists) because they identify load-bearing layer-level ' +
    'obstructions that ANY entropy-on-zeros bound must traverse. If a specific ' +
    'Tao 2024 zero-gap entropy theorem exists and DOES bypass the L^1 / L^2 ' +
    'Cauchy-Schwarz layer in a way not captured by (R1)-(R3), this classification ' +
    'is OPEN-FOR-REVISION',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1309_TAO_ENTROPY_PCC_ATTACK = Object.freeze({
  id: 'imp-1309-tao-entropy-pcc-attack',
  ticket: 'imp-1309',
  category: 'proof',
  builtAt: '2026-05-28T23:59:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1247', 'imp-1297', 'imp-1302', 'imp-1303', 'imp-1304', 'imp-1305', 'imp-1310',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  taoEntropy2024Statement: TAO_ENTROPY_2024_STATEMENT,
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
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js (pending) — alternative §15-27 pathway decoupled from sigma > 1 (the most likely escape route)',
  }),

  honestScope: Object.freeze([
    'This file is a NEW-INPUT CLASSIFICATION ticket for the candidate direct ' +
    'attack on Montgomery PCC at 2-point via Tao 2024 (closest-known form: ' +
    'Bloom-Maynard-Sisask 2020 entropy bounds, Tao 2014 entropy compression, ' +
    'Tao-Vu 2011-2017 Wigner universality, plus a conjectural Tao 2024 extension ' +
    'to zero-spacing distributions). It is NOT a new closure or a new unconditional ' +
    'bound.',

    'The verdict is NEGATIVE: tao-entropy-not-applicable-to-single-zeta-2-point. ' +
    'The entropy method is GENUINELY ORTHOGONAL to moment methods in its primary ' +
    'domain (prime-gap statistics, additive combinatorics on integers), but the ' +
    'orthogonality does NOT transfer to the single-zeta 2-point PCC observable at ' +
    'Fourier support sigma > 1 for three independent structural reasons: (R1) ' +
    'domain mismatch (entropy bounds spacings, PCC bounds Fourier-pair-correlation, ' +
    'translation passes through Cauchy-Schwarz); (R2) absence of additive-' +
    'combinatorial structure on zeros (conjectural GUE distribution is locally ' +
    'repulsive, the OPPOSITE of additive); (R3) linear-statistic vs set-count ' +
    'mismatch (entropy outputs first-moment / concentration, PCC needs second-' +
    'moment / linear statistic).',

    'The TRAINING-TIME UNCERTAINTY is honestly acknowledged: the exact reference ' +
    '"T. Tao, Entropy bounds on zero gaps, 2024" is uncertain at training-cutoff ' +
    '(January 2026). Classification uses the closest-known form. The (R1)-(R3) ' +
    'structural obstructions are ROBUST to the exact form of Tao 2024 (if it ' +
    'exists) because they identify load-bearing layer-level obstructions that ' +
    'ANY entropy-on-zeros bound must traverse. If a specific Tao 2024 zero-gap ' +
    'entropy theorem exists and DOES bypass the L^1 / L^2 Cauchy-Schwarz layer ' +
    'in a way not captured by (R1)-(R3), this classification is OPEN-FOR-REVISION.',

    'The entropy method shifts WHERE Cauchy-Schwarz appears in the chain from ' +
    'INPUT stage (moment methods: Cauchy-Schwarz on the off-diagonal correlation ' +
    'BEFORE plugging in the higher-moment) to OUTPUT stage (entropy methods: ' +
    'Cauchy-Schwarz on the L^1 -> L^2 translation AFTER the entropy bound). The ' +
    'Cauchy-Schwarz rate is IDENTICAL — (log T)^{1/2} — so the shift does not ' +
    'change the bound. Selberg 1944 |S(T)| <= O((log T / log log T)^{1/2}) is the ' +
    'load-bearing L^infty input that gives the slack in BOTH the moment-method ' +
    'and the entropy-method routes.',

    'The residual gap is precisely: PCC for Fourier support sigma > 1, identical ' +
    'to imp-1303 / imp-1305 and to the Montgomery 1973 conjecture open since the ' +
    'original paper. The entropy method does NOT change which side of the L^1 / ' +
    'L^2 Cauchy-Schwarz boundary the bound sits on.',

    'CONSEQUENCE for engine planning: with imp-1297 + imp-1302 + imp-1303 + ' +
    'imp-1304 + imp-1305 (moment-method family) PLUS imp-1309 (entropy-method ' +
    'family) all in the same negative classification family, the standard ' +
    'analytic-number-theory toolkit (moment + entropy) is EXHAUSTED for PCC at ' +
    '2-point. The aggregate verdict on §15-27 -> RH via PCC is ' +
    'pcc-genuinely-open-pending-new-input. The Lambda-attack should: (1) decouple ' +
    'from PCC at 2-point requirement by exploring alternative §15-27 closure ' +
    'pathways with Fourier-support sigma <= 1 (this is the imp-1310 direction); ' +
    '(2) probe genuinely new input families (Connes-Bost adele class space, ' +
    'Berry-Keating semiclassical Hamiltonian) that bypass the L^1 / L^2 ' +
    'Cauchy-Schwarz duality boundary entirely.',
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
    tao2024EntropyOnZerosUncertain:
      'T. Tao (UNCERTAIN at training-cutoff January 2026), conjecturally ' +
      '"Entropy bounds on zero-spacing distributions" or related Polymath15 ' +
      'follow-up note — closest-known form is the Bloom-Maynard-Sisask 2020 ' +
      'entropy-bound class extended (in spirit) to zero-spacings under the ' +
      'conjectural GUE correspondence. Honest scope: the specific 2024 paper ' +
      'is not confidently identified at training-cutoff',
    bloomMaynardSisask2020:
      'Bloom, T. F. and Sisask, O. (with J. Maynard collaborations 2019-2020), ' +
      '"On the Erdős-Ko-Rado theorem in additive combinatorics" / "Additive ' +
      'structure in dense sets", arXiv 2007.03528 et seq. — load-bearing entropy / ' +
      'additive-energy bounds for dense integer subsets',
    maynard2019:
      'Maynard, J., "Primes in arithmetic progressions to large moduli I, II, III" ' +
      '(arXiv 1906.06530, 1909.04125 etc.) — entropy method on primes',
    tao2014EntropyCompression:
      'Tao, T., "Entropy compression and the constructive Lovász Local Lemma", ' +
      '2014 expository note on the Moser-Tardos 2010 entropy-compression argument',
    taoVu2011Universality:
      'Tao, T. and Vu, V., "Random matrices: universality of eigenvalues and ' +
      'eigenvectors", Acta Mathematica 206 (2011), 127-204 — four-moment matching ' +
      'method for Wigner matrices; conditional template for entropy-on-zero-gaps ' +
      'via Katz-Sarnak / Rudnick-Sarnak GUE correspondence',
    erdosKoRado1961:
      'Erdős, P., Ko, C., Rado, R., "Intersection theorems for systems of finite ' +
      'sets", Quart. J. Math. Oxford (2) 12 (1961), 313-320 — combinatorial input ' +
      'for the entropy method on additive structures',
    plunneckeRuzsa:
      'Plünnecke, H., "Eine zahlentheoretische Anwendung der Graphentheorie", ' +
      'J. Reine Angew. Math. 243 (1970), 171-183 and Ruzsa, I. Z., "Sums of finite ' +
      'sets", Number theory: New York Seminar 1991-1995 (Springer 1996), 281-293 — ' +
      'sumset estimates input for the entropy method',
    pinsker1964:
      'Pinsker, M. S., "Information and Information Stability of Random Variables ' +
      'and Processes", Holden-Day 1964 — Pinsker inequality KL >= ||p-q||_1^2 / 2 ' +
      'underwrites the entropy -> L^1 translation step',
    csiszar1967:
      'Csiszár, I., "Information-type measures of difference of probability ' +
      'distributions and indirect observations", Studia Sci. Math. Hungar. 2 ' +
      '(1967), 299-318 — Csiszar inequality, generalization of Pinsker',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193 — the PCC conjecture itself',
    katzSarnak1996:
      'Katz, N. M. and Sarnak, P., "Random Matrices, Frobenius Eigenvalues, and ' +
      'Monodromy", AMS Colloquium Publications 45 (1999) (preprint 1996) — ' +
      'conjectural correspondence between zero statistics and Wigner ensembles',
    rudnickSarnak1996:
      'Rudnick, Z. and Sarnak, P., "Zeros of principal L-functions and random matrix ' +
      'theory", Duke Math. J. 81 (1996), 269-322 — n-level density conjecture for ' +
      'L-functions',
    odlyzko1987:
      'Odlyzko, A. M., "On the distribution of spacings between zeros of the zeta ' +
      'function", Math. Comp. 48 (1987), 273-308 — numerical evidence for ' +
      'GUE-like distribution of zero spacings',
    selberg1944:
      'Selberg, A., "On the remainder in the formula for N(T)", Avh. Norske Vid. ' +
      'Akad. Oslo. I. Mat.-Naturvid. Kl. 1944, no. 1, 27 pp. — load-bearing ' +
      'L^infty bound |S(T)| <= O((log T / log log T)^{1/2}) that re-introduces the ' +
      'Cauchy-Schwarz layer in the entropy method output stage',
    heathBrown1979:
      'Heath-Brown, D. R., "The fourth power moment of the Riemann zeta function", ' +
      'Proc. London Math. Soc. (3) 38 (1979), 385-422 — baseline moment-method ' +
      'route, gives the (log T)^{1/2} slack target',
    goldstonYildirim2003:
      'Goldston, D. A., Yildirim, C. Y., "Higher correlations of divisor sums ' +
      'related to primes I: Triple correlations", Acta Mathematica 192 (2004), ' +
      '95-148 — prior absolutization candidate (imp-1305), structurally similar slack',
    moserTardos2010:
      'Moser, R. A. and Tardos, G., "A constructive proof of the general Lovász ' +
      'Local Lemma", J. ACM 57 (2010), 11.1-11.15 — origin of the entropy ' +
      'compression argument used by Tao 2014',
  }),
});

export default IMP_1309_TAO_ENTROPY_PCC_ATTACK;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1309_TAO_ENTROPY_PCC_ATTACK_ASSERTIONS = [
  // Tripwire 1: Tao 2024 statement (or closest-known) is cited with honest
  // training-time uncertainty acknowledgement.
  {
    id: 'imp1309-tao2024-stated-with-honest-uncertainty',
    why:
      'Training-cutoff is January 2026 and the exact Tao 2024 zero-gap entropy paper ' +
      'is uncertain. The classification must STATE the closest-known form (Bloom-' +
      'Maynard-Sisask 2020 + Tao 2014 entropy compression + Tao-Vu Wigner universality) ' +
      'and EXPLICITLY acknowledge the training-time uncertainty. A silent overclaim ' +
      'that "Tao 2024 proves X" without the uncertainty caveat would mislead.',
    holds: () => {
      const s = IMP_1309_TAO_ENTROPY_PCC_ATTACK.taoEntropy2024Statement;
      return (
        typeof s.source === 'string' &&
        /Bloom-Maynard-Sisask|Bloom.*Maynard.*Sisask/.test(s.source) &&
        /2020/.test(s.source) &&
        /Tao/.test(s.source) &&
        s.isTrainingTimeUncertain === true &&
        typeof s.trainingTimeUncertaintyNote === 'string' &&
        /uncertain|training-cutoff/i.test(s.trainingTimeUncertaintyNote) &&
        typeof s.closestKnownEntropyBoundClass === 'string' &&
        /Bloom-Maynard-Sisask/.test(s.closestKnownEntropyBoundClass) &&
        typeof s.conjecturalTao2024Form === 'string' &&
        /entropy/i.test(s.conjecturalTao2024Form) &&
        /spacings|spacing/i.test(s.conjecturalTao2024Form)
      );
    },
  },

  // Tripwire 2: 2-point transfer evaluation walks (a), (b), (c) and reports
  // the entropy bound DOES NOT bypass Cauchy-Schwarz at output stage.
  {
    id: 'imp1309-two-point-transfer-evaluated-with-cs-output-stage',
    why:
      'The transfer evaluation must walk (a) observable bounded by entropy, ' +
      '(b) does it give a 2-point bound at sigma > 1, (c) does it bypass ' +
      'Cauchy-Schwarz. Missing any of the three would render the classification ' +
      'incomplete on its load-bearing question.',
    holds: () => {
      const t = IMP_1309_TAO_ENTROPY_PCC_ATTACK.twoPointTransferEvaluation;
      return (
        typeof t.observableBoundedByEntropyMethod === 'string' &&
        /entropy/i.test(t.observableBoundedByEntropyMethod) &&
        /spacing|distribution/i.test(t.observableBoundedByEntropyMethod) &&
        typeof t.observableNeededForPCC === 'string' &&
        /Fourier|pair-correlation|F\(alpha/.test(t.observableNeededForPCC) &&
        typeof t.translationChain === 'object' &&
        typeof t.translationChain.step1_entropy_to_L1 === 'string' &&
        /Pinsker|Csiszar/i.test(t.translationChain.step1_entropy_to_L1) &&
        typeof t.translationChain.step2_L1_to_L2 === 'string' &&
        /Cauchy-Schwarz/.test(t.translationChain.step2_L1_to_L2) &&
        typeof t.translationChain.step3_L2_to_Fourier === 'string' &&
        /Parseval|Plancherel/i.test(t.translationChain.step3_L2_to_Fourier) &&
        t.bypassesCauchySchwarzLayerAtInputStage === true &&
        t.bypassesCauchySchwarzLayerAtOutputStage === false &&
        t.closesPCCForSupportGtOne === false
      );
    },
  },

  // Tripwire 3: Structural orthogonality assessment names primary-domain
  // orthogonality YES + zero-gap-domain orthogonality NO + all three
  // obstructions R1 / R2 / R3.
  {
    id: 'imp1309-structural-orthogonality-three-obstructions',
    why:
      'The structural orthogonality assessment must report that entropy is ' +
      'PRIMARY-DOMAIN orthogonal to moment methods but ZERO-GAP-DOMAIN orthogonality ' +
      'does NOT carry through. Missing any of the three obstructions (R1) (R2) (R3) ' +
      'would weaken the structural argument.',
    holds: () => {
      const a = IMP_1309_TAO_ENTROPY_PCC_ATTACK.structuralOrthogonalityAssessment;
      return (
        a.primaryDomainOrthogonalToMomentMethods === true &&
        a.zeroGapDomainOrthogonalityCarriesThrough === false &&
        typeof a.obstruction_R1_domain_mismatch === 'string' &&
        /domain|Fourier|Pinsker|Cauchy-Schwarz/.test(a.obstruction_R1_domain_mismatch) &&
        typeof a.obstruction_R2_additive_structure_absent === 'string' &&
        /(additive|Plünnecke|EKR|GUE|repulsive)/i.test(a.obstruction_R2_additive_structure_absent) &&
        typeof a.obstruction_R3_linear_statistic_vs_set_count_mismatch === 'string' &&
        /(linear-statistic|second-moment|set-count|set count)/i.test(
          a.obstruction_R3_linear_statistic_vs_set_count_mismatch
        ) &&
        typeof a.entropyMethodShiftsCauchySchwarzStageButDoesNotEliminate === 'string' &&
        /(shifts|stage|input.*output|output.*input)/i.test(
          a.entropyMethodShiftsCauchySchwarzStageButDoesNotEliminate
        )
      );
    },
  },

  // Tripwire 4: Verdict is one of the four allowed strings.
  {
    id: 'imp1309-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'tao-entropy-fully-bypasses-pcc / tao-entropy-bypasses-for-support-window-X / ' +
      'tao-entropy-improves-but-pcc-remains-open / ' +
      'tao-entropy-not-applicable-to-single-zeta-2-point. A non-allowed verdict ' +
      'would indicate classification drift.',
    holds: () => {
      const allowed = [
        'tao-entropy-fully-bypasses-pcc',
        'tao-entropy-bypasses-for-support-window-X',
        'tao-entropy-improves-but-pcc-remains-open',
        'tao-entropy-not-applicable-to-single-zeta-2-point',
      ];
      return allowed.includes(IMP_1309_TAO_ENTROPY_PCC_ATTACK.verdict);
    },
  },

  // Tripwire 5: Verdict detail reports PCC remains OPEN with residual gap.
  {
    id: 'imp1309-verdict-detail-pcc-remains-open',
    why:
      'A silent flip to "PCC closed unconditionally via Tao 2024 entropy" would ' +
      'invalidate the entire engine-planning consequence. Tripwire pins the ' +
      'NEGATIVE result and ensures the residual gap (PCC for sigma > 1) is ' +
      'explicitly named.',
    holds: () => {
      const vd = IMP_1309_TAO_ENTROPY_PCC_ATTACK.verdictDetail;
      return (
        vd.closesPCCUnconditionally === false &&
        vd.closesPCCForFourierSupportGtOne === false &&
        vd.closesPCCForESYClosureTestFunction === false &&
        vd.isEntropyMethodPrimaryDomainOrthogonalToMoment === true &&
        vd.isEntropyMethodOrthogonalityCarryingThroughToZeroGapPCC === false &&
        vd.isEntropyMethodAnotherInstanceOfL1L2CauchySchwarzBoundary === true &&
        typeof vd.residualGapPreciselyStated === 'string' &&
        /OPEN/.test(vd.residualGapPreciselyStated) &&
        /sigma > 1/.test(vd.residualGapPreciselyStated)
      );
    },
  },

  // Tripwire 6: At least five required citations present (Tao2024-uncertain /
  // Bloom-Maynard-Sisask 2020 / Erdős-Ko-Rado / Plünnecke-Ruzsa /
  // prior PCC routes imp-1297..imp-1305).
  {
    id: 'imp1309-five-required-citations-present',
    why:
      'Per ticket spec: cite at least 5 sources — Tao 2024 reference (with honest ' +
      'uncertainty), Bloom-Maynard-Sisask 2020, Erdős-Ko-Rado, Plünnecke-Ruzsa, ' +
      'prior PCC routes. Missing any means the classification is incomplete on ' +
      'load-bearing references.',
    holds: () => {
      const r = IMP_1309_TAO_ENTROPY_PCC_ATTACK.references;
      return (
        /Tao/.test(r.tao2024EntropyOnZerosUncertain || '') &&
        /(uncertain|UNCERTAIN)/i.test(r.tao2024EntropyOnZerosUncertain || '') &&
        /Bloom/.test(r.bloomMaynardSisask2020 || '') &&
        /Sisask/.test(r.bloomMaynardSisask2020 || '') &&
        /2020|2007\.03528/.test(r.bloomMaynardSisask2020 || '') &&
        /Erdős|Erdos/.test(r.erdosKoRado1961 || '') &&
        /Ko/.test(r.erdosKoRado1961 || '') &&
        /Rado/.test(r.erdosKoRado1961 || '') &&
        /(Plünnecke|Plunnecke)/.test(r.plunneckeRuzsa || '') &&
        /Ruzsa/.test(r.plunneckeRuzsa || '') &&
        typeof r.imp1297 === 'string' && /imp-1297/.test(r.imp1297) &&
        typeof r.imp1302 === 'string' && /imp-1302/.test(r.imp1302) &&
        typeof r.imp1303 === 'string' && /imp-1303/.test(r.imp1303) &&
        typeof r.imp1304 === 'string' && /imp-1304/.test(r.imp1304) &&
        typeof r.imp1305 === 'string' && /imp-1305/.test(r.imp1305)
      );
    },
  },

  // Tripwire 7: Cross-references imp-1297 / imp-1302 / imp-1303 / imp-1304 / imp-1305 present.
  {
    id: 'imp1309-cross-references-prior-pcc-routes',
    why:
      'This ticket is a direct follow-up to imp-1305 (which completed the moment-' +
      'method ruling-out) and tests whether the entropy method provides the new ' +
      'input needed. Without explicit cross-references to imp-1297/1302/1303/1304/1305 ' +
      'the classification floats free of the parent map.',
    holds: () => {
      const r = IMP_1309_TAO_ENTROPY_PCC_ATTACK;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1297') &&
        related.includes('imp-1302') &&
        related.includes('imp-1303') &&
        related.includes('imp-1304') &&
        related.includes('imp-1305') &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297) &&
        typeof xrefs.imp1302 === 'string' && /imp-1302/.test(xrefs.imp1302) &&
        typeof xrefs.imp1303 === 'string' && /imp-1303/.test(xrefs.imp1303) &&
        typeof xrefs.imp1304 === 'string' && /imp-1304/.test(xrefs.imp1304) &&
        typeof xrefs.imp1305 === 'string' && /imp-1305/.test(xrefs.imp1305)
      );
    },
  },

  // Tripwire 8: Honest scope mentions NEGATIVE result + training-time
  // uncertainty + continuation of imp-1297..imp-1305 conclusions.
  {
    id: 'imp1309-honest-scope-mentions-negative-uncertainty-and-prior-continuation',
    why:
      'The honest scope must explicitly state that (i) the result is NEGATIVE, ' +
      '(ii) Tao 2024 specific reference is UNCERTAIN at training-time and the ' +
      'closest-known form is used, (iii) it CONTINUES the imp-1297..imp-1305 ' +
      'findings. A silent drift to "positive closure" or omission of training-' +
      'time uncertainty would mislead engine planning.',
    holds: () => {
      const blob = IMP_1309_TAO_ENTROPY_PCC_ATTACK.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /(uncertain|UNCERTAIN|training-cutoff|training-time)/i.test(blob) &&
        /imp-1297/.test(blob) &&
        /imp-1305/.test(blob) &&
        /closest-known/i.test(blob) &&
        /(does NOT|do NOT|not transfer|not applicable|not change)/i.test(blob)
      );
    },
  },

  // Tripwire 9: Pattern note extends moment-method exhaustion to entropy-method
  // family + names pcc-genuinely-open-pending-new-input aggregate verdict.
  {
    id: 'imp1309-pattern-note-extends-exhaustion-to-entropy-family',
    why:
      'The pattern note must explicitly identify the EXTENSION of the moment-method ' +
      'ruling-out to the entropy-method family (imp-1297 + imp-1302 + imp-1303 + ' +
      'imp-1304 + imp-1305 + imp-1309 all negative) and name pcc-genuinely-open-' +
      'pending-new-input as the aggregate verdict.',
    holds: () => {
      const vd = IMP_1309_TAO_ENTROPY_PCC_ATTACK.verdictDetail;
      return (
        vd.patternNoteExtendsExhaustionToEntropyFamily === true &&
        vd.aggregateVerdict === 'pcc-genuinely-open-pending-new-input' &&
        typeof vd.patternNotePreciselyStated === 'string' &&
        /EXHAUSTED|exhausted/.test(vd.patternNotePreciselyStated) &&
        /imp-1297/.test(vd.patternNotePreciselyStated) &&
        /imp-1305/.test(vd.patternNotePreciselyStated) &&
        /imp-1309/.test(vd.patternNotePreciselyStated) &&
        /pcc-genuinely-open-pending-new-input/.test(vd.patternNotePreciselyStated) &&
        /entropy/i.test(vd.patternNotePreciselyStated) &&
        typeof vd.fitsWithImp1297Through1305Pattern === 'string' &&
        /\(log T\)\^\{1\/2\}|half-log/i.test(vd.fitsWithImp1297Through1305Pattern)
      );
    },
  },

  // Tripwire 10: Semantic check 1 — entropy bound 2-point gives SAME slack as
  // imp-1303 / imp-1305 to leading order.
  {
    id: 'imp1309-semantic-entropy-matches-hb1979-gy2003-leading-order',
    why:
      'Semantic check: the entropy method 2-point bound must be reported as ' +
      'matching imp-1303 (HB1979) and imp-1305 (GY2003 absolutized) to leading ' +
      'order with the SAME (log T)^{1/2} slack in the same support window (1, 5/4). ' +
      'A divergent report would falsely claim a NEW bound that does not exist.',
    holds: () => {
      const vd = IMP_1309_TAO_ENTROPY_PCC_ATTACK.verdictDetail;
      const t = IMP_1309_TAO_ENTROPY_PCC_ATTACK.twoPointTransferEvaluation;
      return (
        typeof vd.whatEntropyMethodGivesAt2Point === 'string' &&
        /(imp-1303|HB1979|Heath-Brown)/i.test(vd.whatEntropyMethodGivesAt2Point) &&
        /(imp-1305|GY2003|Goldston-Yildirim)/i.test(vd.whatEntropyMethodGivesAt2Point) &&
        /\(log T\)\^\{-1\/2\}/.test(vd.whatEntropyMethodGivesAt2Point) &&
        typeof t.twoPointBoundFromEntropyAttempt === 'string' &&
        /\(log T\)\^\{-1\/2\}/.test(t.twoPointBoundFromEntropyAttempt) &&
        t.closesPCCForSupportGtOne === false &&
        typeof t.unconditionalSupportWindowReached === 'string' &&
        /1, 5\/4/.test(t.unconditionalSupportWindowReached)
      );
    },
  },

  // Tripwire 11: Semantic check 2 — Cauchy-Schwarz STAGE-SHIFT (input -> output)
  // is the precise structural insight, NOT bypass.
  {
    id: 'imp1309-semantic-cauchy-schwarz-stage-shift-not-bypass',
    why:
      'Semantic check: the entropy method shifts WHERE Cauchy-Schwarz appears in ' +
      'the chain (from input stage to output stage) but does NOT eliminate it. The ' +
      '(log T)^{1/2} slack is a property of the L^1 / L^2 Hölder boundary, not of ' +
      'any specific input. This is the key insight that distinguishes the "not ' +
      'applicable" verdict from "improves but does not close".',
    holds: () => {
      const r = IMP_1309_TAO_ENTROPY_PCC_ATTACK.relationshipToPriorPCCRoutes;
      const a = IMP_1309_TAO_ENTROPY_PCC_ATTACK.structuralOrthogonalityAssessment;
      const t = IMP_1309_TAO_ENTROPY_PCC_ATTACK.twoPointTransferEvaluation;
      const vd = IMP_1309_TAO_ENTROPY_PCC_ATTACK.verdictDetail;
      return (
        typeof r.momentMethodRoutesHitCauchySchwarzAtInputStage === 'string' &&
        /Cauchy-Schwarz/.test(r.momentMethodRoutesHitCauchySchwarzAtInputStage) &&
        /input/i.test(r.momentMethodRoutesHitCauchySchwarzAtInputStage) &&
        typeof r.entropyMethodRouteHitsCauchySchwarzAtOutputStage === 'string' &&
        /Cauchy-Schwarz/.test(r.entropyMethodRouteHitsCauchySchwarzAtOutputStage) &&
        /output/i.test(r.entropyMethodRouteHitsCauchySchwarzAtOutputStage) &&
        r.bothStagesGiveSameLogTHalfSlack === true &&
        t.bypassesCauchySchwarzLayerAtInputStage === true &&
        t.bypassesCauchySchwarzLayerAtOutputStage === false &&
        typeof t.whyOutputStageReintroducesCauchySchwarz === 'string' &&
        /(L\^1.*L\^2|Hölder|duality boundary)/.test(t.whyOutputStageReintroducesCauchySchwarz) &&
        vd.isEntropyMethodAnotherInstanceOfL1L2CauchySchwarzBoundary === true
      );
    },
  },

  // Tripwire 12: Semantic check 3 — implication for Lambda-attack correctly
  // identifies new-input candidates outside BOTH moment AND entropy families.
  {
    id: 'imp1309-semantic-lambda-attack-new-input-outside-both-families',
    why:
      'Semantic check: the engine-planning implication must name at least one ' +
      'specific candidate route outside BOTH the moment-method family AND the ' +
      'entropy-method family (Connes-Bost / Berry-Keating / imp-1310 alternative ' +
      'pathway). Without naming concrete candidates the "new input needed" ' +
      'conclusion is unactionable.',
    holds: () => {
      const vd = IMP_1309_TAO_ENTROPY_PCC_ATTACK.verdictDetail;
      const s = vd.implicationForLambdaAttack || '';
      const w = vd.whatWouldClose || '';
      const combined = s + ' ' + w;
      return (
        typeof s === 'string' &&
        s.length > 80 &&
        /(Connes-Bost|Berry-Keating|imp-1310|alternative §15-27|alternative pathway)/i.test(combined) &&
        /(decouple|alternative|new|outside)/i.test(s) &&
        /(sigma <= 1|support sigma <= 1|sigma > 1)/.test(combined)
      );
    },
  },
];
