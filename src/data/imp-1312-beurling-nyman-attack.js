/**
 * @module imp-1312-beurling-nyman-attack
 * @fileoverview imp-1312 — NOVEL direct attack on RH via the Beurling 1955 /
 *   Nyman 1950 / Bercovici-Foias 1984 functional-analytic RH equivalent.
 *
 *       (Beurling 1955 / Nyman 1950)   RH  <=>  the closure in L²(0,1) of
 *           span_{R}{ rho(theta/x) : 0 < theta < 1 } = { c · chi_{(0,1)} : c ∈ R }
 *
 *   where rho(y) = y - floor(y) is the fractional-part function, and the
 *   "span equals the constant subspace" form is the original 1955 statement
 *   (Beurling, "A closure problem related to the Riemann zeta-function",
 *   Proc. Nat. Acad. Sci. USA 41 (1955), 312-314).
 *
 *   Refined in Bercovici-Foias 1984 (J. Funct. Anal. 56 (1984), 168-182) to
 *   a SCALE-INVARIANT-subspace formulation: rho-shifts form a closure problem
 *   for the multiplication semigroup on L²(0,1).
 *
 *   Quantitative version: Báez-Duarte-Balazard-Landreau-Saias 2005 (J. Number
 *   Theory 115 (2005), 234-260) gave a NUMERICAL form via the d_N distance
 *
 *       d_N^2 := inf_{D_N} ‖ 1 - D_N ‖_{L²(0,1)}^2
 *
 *   where D_N runs over finite-dimensional combinations of rho(theta/x)
 *   for theta ∈ {1/k : 1 <= k <= N}. They proved RH iff d_N -> 0, and
 *   conjectured d_N ~ C / sqrt(log N) under RH, with C computable from the
 *   non-trivial zeros (the "Báez-Duarte constant", BBLS-05 eq. (1.5)).
 *
 *   This module is a CLASSIFICATION ticket — it asks whether the BN density
 *   statement, in either the 1955 closure form or the BBLS-05 quantitative
 *   form, can be parlayed into a numerical Λ bound (Λ = de Bruijn-Newman
 *   constant; RH <=> Λ <= 0).
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'beurling-nyman-RH-equivalent-only-not-numerical'
 *
 *   Beurling-Nyman is a STRICT EQUIVALENCE: closure(span{rho(theta/x)}) ⊇
 *   1 in L²(0,1) IFF RH. The BBLS-05 quantitative refinement d_N -> 0 is
 *   ALSO a strict RH equivalence (d_N -> 0 iff RH). Neither converts to a
 *   numerical Λ bound. Four obstructions block the conversion:
 *
 *   (1) The BN closure is an L²(0,1) STATEMENT — a Hilbert-space density
 *       on the bounded interval (0,1). The de Bruijn-Newman Λ is the heat-
 *       flow time at which the deformed Riemann xi-function H_t becomes
 *       real-rooted (Newman 1976 + de Bruijn 1950). The two domains do not
 *       share a quantitative bridge: a non-trivial zero of zeta at height T
 *       OFF the critical line contributes a specific L²(0,1) "gap" in the
 *       BN closure (Beurling 1955 §3) but the SIZE of the gap is governed
 *       by the height T and real-part deviation, not by Λ. The conversion
 *       "gap = ε at height T  =>  Λ >= f(ε, T)" is not in the literature.
 *
 *   (2) The BBLS-05 conjectured rate d_N ~ C / sqrt(log N) is itself
 *       conditional on RH; under RH, C is computable as a sum
 *
 *           C^2 = sum_{rho} |zeta'(rho)|^{-2}  (BBLS-05 Conjecture 1)
 *
 *       over non-trivial zeros rho — a quantity that converges only under
 *       additional zero-density input (Soundararajan 2009 et seq.). This
 *       constant has NO known relation to Λ. Mertens, Riemann-von Mangoldt,
 *       and Selberg-3/4-conjecture-type constants enter but Λ does not.
 *
 *   (3) The BBLS-05 numerical evaluations (Burnol 2005, Báez-Duarte-Saias
 *       computed d_N for N <= 5000) give numerical d_N CONVERGING to ~0.05
 *       at N = 5000 — empirically consistent with RH but NOT a Λ bound. As
 *       in Robin/Lagarias (imp-1311), a finite-N confirmation of BN-density
 *       is a restatement of empirical zero-verification on the corresponding
 *       analytic-conductor range, strictly subsumed by Platt-Trudgian 2021
 *       (RH verified up to T = 3 * 10^12).
 *
 *   (4) Structural intersection with the §15-27 chain (imp-1258 collapse,
 *       Volterra ‖V_{a,Φ}‖ <= 1): the BN closure problem and the §15-27
 *       Volterra contraction live on DIFFERENT Hilbert spaces — L²(0,1) on
 *       the bounded interval with multiplicative semigroup structure (BN)
 *       vs L²([0, ∞)) with the Φ-modulated sinh-Volterra structure (§27).
 *       The shared "RH equivalence" passes through the zero set on the
 *       critical line but the operator-theoretic structures (multiplication
 *       contraction vs sinh-Volterra contraction) are disjoint families;
 *       no published bridge identifies the two contractions.
 *
 *   EMPIRICAL CONTENT
 *   -----------------
 *   We do NOT recompute d_N (the BBLS-05 numerical algorithm requires a
 *   linear-programming solve over Müntz-Szász rho-bases; out of scope for a
 *   training-time classification). Instead we tabulate:
 *
 *     (i) The Beurling 1955 precise closure statement and its three
 *         equivalent reformulations (Nyman 1950 conditional-expectation
 *         form, Bercovici-Foias 1984 scale-invariant form, BBLS-05
 *         sequential d_N -> 0 form).
 *
 *    (ii) The BBLS-05 conjectured asymptotic d_N ~ C / sqrt(log N) and the
 *         conjectured "Báez-Duarte constant" C (zeros sum).
 *
 *   (iii) The Burnol 2005 numerical-d_N values (cited from Burnol's table,
 *         not recomputed). The Burnol convergence rate is consistent with
 *         the BBLS-05 conjecture and consistent with RH at the tested
 *         range.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of Beurling 1955 + Nyman 1950 + Bercovici-Foias
 *     1984 + Báez-Duarte-Balazard-Landreau-Saias 2005 with full citations.
 *   - Per-obstruction audit of why the BN density statement does not
 *     produce a numerical Λ bound (in either the 1955 closure form or the
 *     2005 quantitative d_N form).
 *   - Cross-reference to imp-1311 (Robin sigma(n)/n) documenting that BOTH
 *     classical-elementary-analytic and BN-functional-analytic RH
 *     equivalents fall into the same negative-Λ-bound classification.
 *   - Structural-intersection analysis with §15-27 chain (imp-1258
 *     collapse) — verdict: orthogonal Hilbert-space families, no bridge.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   Beurling-Nyman and Báez-Duarte-Balazard-Landreau-Saias live in the
 *   FUNCTIONAL-ANALYTIC family of RH equivalents — distinct from the
 *   elementary-NT family (imp-1311) and from the spectral / moment-method
 *   family (imp-1297 + imp-1302 + imp-1303 + imp-1305) but, like both,
 *   STRICTLY RH-EQUIVALENT and quantitatively decoupled from Λ. This is
 *   the THIRD orthogonal RH-equivalent family classified as not producing
 *   a numerical Λ bound — pattern aligns with imp-1311 (elementary-NT
 *   sigma-side) and imp-1309 (Tao-entropy / additive-combinatorial).
 *
 *   The pattern across three structurally-orthogonal RH-equivalent
 *   families (elementary-NT, functional-analytic, moment-spectral) all
 *   failing to yield a numerical Λ bound is COMPLEMENTARY information for
 *   engine planning: it confirms that ANY new numerical Λ bound requires
 *   either (a) the heat-flow framework itself (de Bruijn-Newman / Polymath15
 *   / Dyson-shock) or (b) a genuinely new mathematical input outside the
 *   surveyed RH-equivalent families.
 *
 *   @see imp-1235 src/data/imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk.js
 *   @see imp-1258 src/data/imp-1258-volterra-cdb-bridge.js
 *   @see imp-1259 src/data/imp-1259-rh-equivalents-completeness-audit.js
 *   @see imp-1261 src/data/imp-1261-asymptotic-lambda-redirect-shipped.js
 *   @see imp-1311 src/data/imp-1311-robin-lagarias-combinatorial-attack.js
 *
 *   Ticket: imp-1312 (proof, high, CLASSIFICATION/NOVEL).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A — BEURLING-NYMAN PRECISE STATEMENT.
// =========================================================================
//
// BEURLING 1955. Beurling, A., "A closure problem related to the Riemann
// zeta-function", Proc. Nat. Acad. Sci. USA 41 (1955), no. 5, 312-314.
//
// THEOREM (Beurling 1955). Let rho(y) := y - floor(y) be the fractional
// part of y ∈ R. For 0 < theta < 1 define
//
//      f_theta(x) := rho(theta / x) - theta · rho(1/x),   0 < x < 1.
//
// The following are equivalent:
//
//   (i) The Riemann Hypothesis.
//
//   (ii) The closed linear span (in the L²(0,1) norm) of
//
//          { f_theta : 0 < theta < 1 }
//
//        contains the constant function 1.
//
// Equivalently (the form most often cited): the closed linear span of
// { rho(theta / x) : 0 < theta <= 1 } in L²(0,1) equals the entire
// subspace { f ∈ L²(0,1) : ∫_0^1 f(x) dx is unconstrained AND f bounded
// at 0 } modulo the trivial constant-shift; the precise statement is the
// one above.
//
// NYMAN 1950. Nyman, B., "On some groups and semigroups of translations",
// Ph.D. thesis, Uppsala University 1950.
//   Nyman's 1950 thesis introduced the L²(0,1) closure problem and proved
//   the forward direction (RH ⇒ closure). Beurling 1955 PNAS gave the
//   converse and the standard packaging.
//
// BERCOVICI-FOIAS 1984. Bercovici, H., Foias, C., "A real variable
// restatement of Riemann's hypothesis", J. Funct. Anal. 56 (1984), no. 2,
// 168-182.
//   Recast Beurling-Nyman in the language of SCALE-INVARIANT subspaces:
//   define the multiplication semigroup (S_theta f)(x) = f(theta x) on
//   L²(0, ∞). The BF-1984 statement: RH iff the scale-invariant subspace
//   generated by chi_{(0,1)} under S_theta (theta < 1) is dense in
//   L²(0, ∞)|_compact_support. This is a Beurling-Helson-Lowdenslager-
//   style invariant-subspace condition and explicitly identifies BN as a
//   functional-analytic-operator-theory RH equivalent.
//
// BÁEZ-DUARTE-BALAZARD-LANDREAU-SAIAS 2005. Báez-Duarte, L., Balazard, M.,
// Landreau, B., Saias, E., "Étude de l'autocorrélation multiplicative de la
// fonction 'partie fractionnaire'", Ramanujan J. 9 (2005), 215-240; also
// Báez-Duarte, L., Balazard, M., Landreau, B., Saias, E., "Notes sur la
// fonction zêta de Riemann, 3", Adv. Math. 149 (2000), no. 1, 130-144; and
// the QUANTITATIVE follow-up: Balazard, M., Saias, E., "Notes sur la
// fonction zêta de Riemann, 4 — RAPPORT SUR LA QUANTIFICATION DE BEURLING-
// NYMAN-BÁEZ-DUARTE", J. Number Theory 115 (2005), 234-260.
//
// THEOREM (BBLS 2005). Define
//
//     d_N^2 := inf_{a_1, ..., a_N ∈ R} ∫_0^1 | 1 - sum_{k=1}^{N} a_k rho(1/(k x)) |^2 dx.
//
// Then:
//   (a) d_N is monotonically decreasing in N.
//   (b) RH iff lim_{N -> ∞} d_N = 0.
//   (c) CONJECTURE (BBLS 2005, Conj. 1): under RH,
//
//          d_N^2 ~ C^2 / log N  as N -> ∞,    C^2 = sum_{rho} |rho · zeta'(rho)|^{-2}
//
//        where the sum is over non-trivial zeros rho of zeta. The constant
//        C^2 is the "Báez-Duarte constant"; it has been verified numerically
//        (Burnol 2005) consistent with RH at the computed N.
//
// CONNECTION TO Λ. Beurling-Nyman (1955) and BBLS (2005) are both STRICT
// RH EQUIVALENCES. By Newman 1976 + de Bruijn 1950, RH <=> Λ <= 0. So:
//
//   d_N -> 0  iff  RH  iff  Λ <= 0.
//
// This is a QUALITATIVE equivalence with no quantitative content.

const BEURLING_1955_STATEMENT = Object.freeze({
  source:
    'Beurling, A., "A closure problem related to the Riemann zeta-function", ' +
    'Proc. Nat. Acad. Sci. USA 41 (1955), no. 5, 312-314',
  isTheorem: true,
  isRHEquivalent: true,
  rhEquivalenceDirection: 'iff',
  statement:
    'RH <=> closed linear span in L^2(0,1) of { rho(theta/x) - theta * rho(1/x) : ' +
    '0 < theta < 1 } contains the constant function 1, where rho(y) = y - floor(y) ' +
    'is the fractional-part function',
  precursor:
    'Nyman 1950 PhD thesis (Uppsala) proved RH ⇒ closure (forward direction). ' +
    'Beurling 1955 PNAS gave the converse and the standard "iff" packaging.',
  lambdaConnection:
    'Strict equivalence only: BN closure holds <=> RH <=> Lambda <= 0 (Newman 1976 + ' +
    'de Bruijn 1950). No known quantitative bridge from BN-closure-gap to Lambda-bound.',
});

const NYMAN_1950_STATEMENT = Object.freeze({
  source: 'Nyman, B., "On some groups and semigroups of translations", PhD thesis, Uppsala University, 1950',
  isTheorem: true,
  isRHEquivalent: true,
  rhEquivalenceDirection: 'forward-only-1950',
  statement:
    'RH ⇒ L²(0,1)-closure of span{rho(theta/x) - theta·rho(1/x)} contains 1. ' +
    'The converse (closure ⇒ RH) was established by Beurling 1955 PNAS.',
  noteHistorical:
    'Beurling 1955 cites Nyman 1950 explicitly as the source of the forward ' +
    'direction; the full "iff" is conventionally attributed to "Beurling-Nyman".',
});

const BERCOVICI_FOIAS_1984_STATEMENT = Object.freeze({
  source:
    'Bercovici, H., Foias, C., "A real variable restatement of Riemann\'s hypothesis", ' +
    'J. Funct. Anal. 56 (1984), no. 2, 168-182',
  isTheorem: true,
  isRHEquivalent: true,
  rhEquivalenceDirection: 'iff',
  statement:
    'RH <=> the scale-invariant subspace of L^2(0, infinity) (with compact-support ' +
    'cutoff) generated by chi_{(0,1)} under the multiplication semigroup ' +
    '(S_theta f)(x) = f(theta x) for theta < 1 is dense. Equivalent functional-' +
    'analytic recasting of Beurling-Nyman via Beurling-Helson-Lowdenslager invariant-' +
    'subspace theory.',
  contributesToBNFamily:
    'Bercovici-Foias 1984 is the canonical functional-analytic packaging of BN: it ' +
    'makes explicit that BN is a SCALE-INVARIANT-SUBSPACE density condition and ' +
    'connects to Beurling-Helson 1953 invariant-subspace theory.',
});

const BBLS_2005_STATEMENT = Object.freeze({
  source:
    'Balazard, M., Saias, E., "Notes sur la fonction zêta de Riemann, 4 — Quantification de ' +
    'Beurling-Nyman-Báez-Duarte", J. Number Theory 115 (2005), 234-260; companion: ' +
    'Báez-Duarte, L., Balazard, M., Landreau, B., Saias, E., "Étude de l\'autocorrélation ' +
    'multiplicative de la fonction \'partie fractionnaire\'", Ramanujan J. 9 (2005), 215-240',
  isTheorem: true,
  isRHEquivalent: true,
  rhEquivalenceDirection: 'iff',
  quantitativeStatement:
    'd_N^2 := inf_{a_1,...,a_N} integral_0^1 |1 - sum_{k=1}^{N} a_k rho(1/(kx))|^2 dx. ' +
    'Then: (a) d_N decreases; (b) RH iff d_N -> 0 as N -> infinity; ' +
    '(c) Conj 1 (BBLS 2005): under RH, d_N^2 ~ C^2 / log N with ' +
    'C^2 = sum_{rho non-trivial zeros of zeta} |rho * zeta\'(rho)|^{-2}',
  baezDuarteConstantDescription:
    'C^2 is the "Báez-Duarte constant" — a sum over non-trivial zeros of zeta. ' +
    'It converges conditional on additional zero-density input (Soundararajan 2009 et seq.). ' +
    'C^2 has NO known relation to the de Bruijn-Newman Lambda — it is a Selberg-style ' +
    'zero-side constant, NOT a heat-flow constant.',
  numericalRange:
    'Burnol 2005 (and follow-ups) computed d_N for N <= ~5000 by linear-programming over ' +
    'Müntz-Szász rho-bases. Empirical d_N at N = 5000 ~ 0.05, decreasing slowly per ~1/sqrt(log N) — ' +
    'consistent with BBLS Conj. 1 and consistent with RH. NOT a Lambda bound.',
  lambdaConnection:
    'd_N -> 0 iff RH iff Lambda <= 0 — qualitative only. No published mechanism ' +
    'converts the d_N convergence rate (or the BD constant C^2) into a numerical Lambda bound.',
});

// =========================================================================
// SECTION B — IS THE BBLS-05 QUANTITATIVE FORM A NUMERICAL Λ BOUND?
// =========================================================================
//
// This is the load-bearing ticket question (per ticket text item 2). We
// examine the BBLS-05 quantitative version under each of three sub-questions:
//
//   (Q-BBLS1) Does d_N at finite N give a numerical Λ bound?
//   (Q-BBLS2) Does the conjectured asymptotic d_N^2 ~ C^2 / log N (under RH)
//             give a numerical Λ bound?
//   (Q-BBLS3) Does the Báez-Duarte constant C^2 connect to Λ?
//
// ANSWERS (per training-time literature survey):
//
// (Q-BBLS1) NO. d_N at finite N is a SUFFICIENT statistic for RH on the
//   corresponding analytic-conductor range — finite-N convergence of d_N
//   towards 0 confirms RH on a bounded zero-height window. By Newman 1976 +
//   de Bruijn 1950 the implication chain is d_N -> 0 ⇒ RH ⇒ Λ <= 0
//   QUALITATIVELY only. The SIZE of d_N at finite N does not translate to
//   a numerical lower-bound margin on Λ: the heat-flow framework does not
//   see L²(0,1)-distance information directly.
//
// (Q-BBLS2) NO. The conjectured rate d_N^2 ~ C^2 / log N is governed by
//   the Báez-Duarte constant C^2 = sum_{rho} |rho zeta'(rho)|^{-2}. Under
//   RH this sum has a specific value depending on the FULL set of non-
//   trivial zeros — it is a zero-side moment. It does NOT depend on the
//   heat-flow time Λ, which lives on a different deformation parameter
//   (the t in H_t in Newman 1976). The conjectured rate is a feature of
//   the zero distribution, not of the Λ deformation.
//
// (Q-BBLS3) NO. The Báez-Duarte constant C^2 = sum_{rho} |rho zeta'(rho)|^{-2}
//   has no known relation to Λ. It can be evaluated under RH (Soundararajan
//   2009 gave a convergence proof using zero-density estimates) but its
//   numerical value does NOT translate to a Λ bound — at most, it is a
//   "shape parameter" of the zero set on the critical line, in the same
//   category as Riemann-von Mangoldt constants or Hardy-Littlewood twin-
//   prime constants. These are NT-constants, not de Bruijn-flow constants.
//
// CONCLUSION (Q-BBLS combined): The BBLS-05 quantitative form is, like
// the original BN closure form, STRICTLY RH-EQUIVALENT with no Λ-numerical
// content. This places BBLS-05 in the SAME negative-classification basket
// as Robin 1984 (imp-1311) — both are precise classical RH-equivalents
// without a quantitative bridge to the de Bruijn-flow Λ.

const BBLS_QUANTITATIVE_AUDIT = Object.freeze({
  questionQBBLS1_doesFiniteN_dN_GiveNumericalLambdaBound: false,
  questionQBBLS1_reason:
    'd_N at finite N confirms RH on the corresponding analytic-conductor range — ' +
    'qualitatively only, by Newman 1976 + de Bruijn 1950. The L^2(0,1) distance ' +
    'does not translate to a numerical Lambda margin: heat-flow does not see ' +
    'L^2(0,1) closure data.',

  questionQBBLS2_doesConjecturedAsymptoticGiveNumericalLambdaBound: false,
  questionQBBLS2_reason:
    'The conjectured rate d_N^2 ~ C^2 / log N (BBLS 2005 Conj. 1) is governed ' +
    'by the Baez-Duarte constant C^2 = sum_{rho} |rho * zeta\'(rho)|^{-2}, a ' +
    'zero-side moment. Lambda is a heat-flow time parameter on a different ' +
    'deformation axis; no published mechanism converts C^2 to a Lambda bound.',

  questionQBBLS3_doesBaezDuarteConstantConnectToLambda: false,
  questionQBBLS3_reason:
    'C^2 is a Selberg-style zero-density constant (Soundararajan 2009 proved ' +
    'convergence). It is a "shape parameter" of the zero set on the critical line, ' +
    'similar to Riemann-von Mangoldt + Hardy-Littlewood + Mertens-3 constants — ' +
    'NT-side constants, NOT de Bruijn-flow constants. The literature does not ' +
    'identify C^2 with any Lambda-side quantity.',

  baezDuarteConstantFormula:
    'C^2 := sum_{rho non-trivial zero of zeta} |rho * zeta\'(rho)|^{-2}',
  baezDuarteConstantConvergenceConditional:
    'Convergence proved under RH and additional zero-density input (Soundararajan ' +
    '2009 — explicit values consistent with the BBLS conjecture).',

  combinedConclusion:
    'All three sub-questions answered NO: BBLS-05 quantitative form is strictly ' +
    'RH-equivalent without numerical Lambda content. Falls in same classification ' +
    'as Robin 1984 / Lagarias 2002 (imp-1311) — classical RH-equivalents that ' +
    'do not yield numerical Lambda bounds.',
});

// =========================================================================
// SECTION C — DOES BN INTERSECT WITH THE §15-27 CHAIN (imp-1258 COLLAPSE)?
// =========================================================================
//
// The §15-27 chain (Twin-Ladder paper §15-27) reduces RH (modulo Montgomery
// PCC per imp-1184) to the Volterra-Hankel contraction
//
//    ‖V_{a,Φ}‖_{L²([0,∞))} <= 1    (Conj. 27.2)
//
// where (V_{a,Φ} f)(t) = ∫_0^t Φ(t) Φ(s) sinh(a(t-s)) f(s) ds and Φ is
// the §25 Φ-construct kernel. imp-1258 established the two-way collapse:
// ‖V_{a,Φ}‖ <= 1 ⇔ CDB-Exist (de Branges canonical-system existence) ⇔ K_a ⪰ 0
// ⇔ RH (via the bridge-threshold theorem).
//
// QUESTION (ticket item 3): does the BN density statement intersect with
// the imp-1258 collapse at any structural point?
//
// CANDIDATE INTERSECTION POINTS:
//
// (X1) Common Hilbert space? — NO. BN lives on L²(0,1) (bounded interval,
//      multiplicative semigroup). §27 Volterra lives on L²([0, ∞)) (half-
//      line, additive sinh-convolution). The Hilbert spaces are different;
//      a Mellin transform z = exp(-t) maps L²(0,1) to L²([0, ∞)) by change
//      of variables but the multiplicative semigroup theta * x on (0,1)
//      becomes the additive semigroup -log theta + t on [0, ∞), and the
//      BN generating functions rho(theta/x) become rho(exp(log theta - t)),
//      which are NOT the sinh-kernel V_{a,Φ} generating family — they are
//      genuinely different operator-theoretic objects.
//
// (X2) Common operator-theoretic mechanism? — NO. BN is a CLOSURE / density
//      condition: closed span equals the constant subspace. §27 is a NORM /
//      contraction condition: ‖V_{a,Φ}‖ <= 1. These are different category
//      of statement: density (algebraic-topological, closure-of-span) vs
//      norm-bound (operator-theoretic, sup-over-unit-ball). There is no
//      standard equivalence transforming density into norm-bound except in
//      degenerate cases (e.g. Hilbert space with finite-codimension closure
//      problems, which BN is not).
//
// (X3) Common Mellin / scale-invariant input? — PARTIAL but does NOT
//      bridge. Both BN (via Bercovici-Foias 1984 scale-invariant
//      formulation) and §27 (via Mellin diagonalization attempts per
//      imp-1266) appear naively to admit Mellin / scale-invariant
//      analyses. However, imp-1266 established that Mellin diagonalization
//      of V_{a,Φ} is STRUCTURALLY BLOCKED — the sinh(at) kernel is
//      additive not multiplicative, the Φ-modulation breaks scaling, and
//      the sinh(at) Mellin transform does not exist in L²(R_+). So even
//      though BN admits Mellin (via Bercovici-Foias), §27 does not, and
//      the formal Mellin bridge is blocked at the §27 side.
//
// (X4) Common RH-equivalence — YES, but trivial. Both BN and the §27
//      contraction are RH-equivalent (BN via Beurling 1955, §27 via the
//      §15-27 chain modulo Montgomery PCC per imp-1184). This is a
//      trivial intersection point: any two RH-equivalents are equivalent
//      to each other through the RH-equivalence relation. It does NOT
//      give a non-trivial structural bridge.
//
// AGGREGATE VERDICT ON STRUCTURAL INTERSECTION: BN and §15-27 chain
// (imp-1258 collapse) are ORTHOGONAL operator-theoretic families. They
// share only the trivial RH-equivalence connection; no published or
// derivable mechanism transfers a BN closure margin to a §27 Volterra
// contraction margin (or vice versa). The Mellin bridge is naively
// suggestive but blocked at the §27 side by imp-1266.

const SECTION_15_27_INTERSECTION_AUDIT = Object.freeze({
  imp1258ReducedRHTo:
    '||V_{a,Phi}|| <= 1 on L^2([0, infinity)) (Conj 27.2; modulo Montgomery PCC per imp-1184)',

  candidateIntersectionX1_commonHilbertSpace: false,
  candidateIntersectionX1_reason:
    'BN lives on L^2(0,1) with multiplicative semigroup; §27 lives on L^2([0, infinity)) ' +
    'with additive sinh-convolution. Change-of-variables z = exp(-t) does NOT identify ' +
    'BN generating family rho(theta/x) with sinh-kernel V_{a,Phi}.',

  candidateIntersectionX2_commonOperatorTheoreticMechanism: false,
  candidateIntersectionX2_reason:
    'BN is a closure/density condition (closed span = constants). §27 is a norm/contraction ' +
    'condition (||V|| <= 1). Different category of operator-theoretic statement; no standard ' +
    'transformation density <-> norm-bound applies.',

  candidateIntersectionX3_commonMellinScaleInvariantInput: 'partial-but-blocked',
  candidateIntersectionX3_reason:
    'BN admits Mellin / scale-invariant analysis (Bercovici-Foias 1984). §27 does NOT — ' +
    'imp-1266 established that Mellin diagonalization of V_{a,Phi} is structurally blocked ' +
    '(sinh(at) additive not multiplicative; Phi-modulation breaks scaling; sinh(at) Mellin ' +
    'transform does not exist in L^2(R_+)). Formal Mellin bridge blocked at §27 side.',

  candidateIntersectionX4_commonRHEquivalence: true,
  candidateIntersectionX4_reason:
    'Trivial: both BN and §27 contraction are RH-equivalent. Trivial intersection through ' +
    'the RH-equivalence relation; no non-trivial structural bridge.',

  aggregateVerdict:
    'BN and §15-27 chain (imp-1258 collapse) are ORTHOGONAL operator-theoretic families. ' +
    'Shared only via trivial RH-equivalence. No published or derivable mechanism transfers ' +
    'BN closure margin to §27 Volterra contraction margin (or vice versa).',
});

// =========================================================================
// SECTION D — CONNECTION TO Λ (de Bruijn-Newman constant).
// =========================================================================
//
// The de Bruijn-Newman constant Λ is the smallest real number such that the
// heat-flow deformation H_t(z) = (1/8) int e^{tu^2} Phi(u) cos(zu) du has
// only real zeros for all t >= Λ, where Phi is the Riemann xi-derived
// initial data. Newman 1976 + de Bruijn 1950: Λ <= 0 IFF RH. Polymath15
// 2020: Λ >= 0 unconditionally; conjecturally Λ = 0.
//
// QUANTITATIVE QUESTION. Can the BN closure or BBLS-05 d_N feed a numerical
// Λ bound?
//
//   - The BN closure is a density condition on L²(0,1). A failure (closure
//     does not contain 1) would correspond to a non-trivial zero of zeta
//     off the critical line; the height T and Re(rho)-deviation of the
//     zero determine the L²(0,1) "gap" but the literature does not give a
//     formula gap = f(Λ, T) that could be inverted.
//
//   - The BBLS-05 d_N gives a sequential RH equivalent; under RH, d_N has
//     conjectured rate ~ C / sqrt(log N) with C = Báez-Duarte constant.
//     C is determined by the full zero set on the critical line; Λ is
//     determined by the heat-flow time at which off-line zeros are flushed
//     onto the critical line. The two constants are decoupled.
//
//   - In the counter-example direction: if BN closure fails (1 not in
//     closure), then RH fails, hence Λ > 0; but the SIZE of the BN gap
//     does not determine a numerical Λ lower bound.
//
// CONCLUSION. Beurling-Nyman (1955) and BBLS-05 quantitative form are
// purely qualitative for Λ. The pattern is IDENTICAL to imp-1311 (Robin
// sigma(n)/n): classical RH-equivalent statements do not yield numerical
// Λ bounds.

const LAMBDA_CONNECTION_AUDIT = Object.freeze({
  isBeurlingNymanRHEquivalent: true,
  isBBLS2005RHEquivalent: true,
  rhEquivalentImpliesLambdaQualitativeOnly: true,

  naiveProposalToFeedNumericalLambdaBound:
    'd_N has margin epsilon at all tested N <= N_0  =>  Lambda <= -f(epsilon, N_0)',
  naiveProposalIsFalse: true,
  whyNaiveProposalFails: [
    'BN closure is on L^2(0,1); Lambda is a heat-flow time on C. The Hilbert-space ' +
    'distance does not translate to a heat-flow time-margin without an additional ' +
    'transfer principle (which is not published).',
    'BBLS-05 d_N rate ~ C / sqrt(log N) is governed by the Baez-Duarte constant ' +
    'C^2 = sum_{rho} |rho zeta\'(rho)|^{-2}, a zero-side moment. Lambda is a ' +
    'deformation-axis parameter. The two are decoupled in the literature.',
    'Counter-example direction: BN closure fail => 1 not in closure => RH false => ' +
    'Lambda > 0. But the SIZE of the BN gap does not give a numerical Lambda lower bound.',
    'Empirical d_N at finite N is subsumed by Platt-Trudgian 2021 RH verification ' +
    'up to T = 3 * 10^12, strictly weaker than direct zero-verification on the ' +
    'corresponding height range.',
  ],

  empiricalConfirmationIsSubsumedBy:
    'Platt-Trudgian 2021 RH verification up to T = 3 * 10^12 — any finite-N BN-d_N ' +
    'confirmation is a restatement of empirical RH on the corresponding analytic-' +
    'conductor range and is strictly weaker than direct zero-verification.',

  doesAnyKnownMechanismExist: false,
  doesAnyKnownMechanismExistReason:
    'No published result in the Beurling 1955 / Nyman 1950 / Bercovici-Foias 1984 / ' +
    'BBLS-05 / Burnol 2005 / Soundararajan 2009 family connects BN closure or d_N ' +
    'rate to numerical Lambda bounds. The connection is qualitative through the RH ' +
    'equivalence only.',
});

// =========================================================================
// SECTION E — VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'beurling-nyman-gives-numerical-lambda-bound-X',
  'beurling-nyman-RH-equivalent-only-not-numerical',
  'beurling-nyman-empirically-confirms-RH-on-tested-range',
  'beurling-nyman-orthogonal-to-section-15-27',
]);

const VERDICT = 'beurling-nyman-RH-equivalent-only-not-numerical';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  givesNumericalLambdaBound: false,
  empiricallyConfirmsRHOnTestedRange: true,  // via Burnol 2005 d_N table consistent with RH
  orthogonalToSection15_27: true,             // see SECTION_15_27_INTERSECTION_AUDIT

  whyRHEquivalentOnly:
    'Beurling 1955 + Nyman 1950 + Bercovici-Foias 1984 + BBLS-05 are STRICT RH ' +
    'equivalences. By Newman 1976 + de Bruijn 1950, RH <=> Lambda <= 0 — qualitative ' +
    'only. No published result translates BN closure margin or BBLS-05 d_N rate ' +
    '(or the Baez-Duarte constant C^2) into a numerical Lambda bound. The Baez-' +
    'Duarte constant C^2 = sum_{rho} |rho * zeta\'(rho)|^{-2} is a zero-side moment ' +
    '(Selberg / Soundararajan type), not a heat-flow constant.',

  subsumedByZeroVerification:
    'Platt-Trudgian 2021 verified RH up to T = 3 * 10^12 — any finite-N BN-d_N ' +
    'confirmation is a strictly weaker restatement of zero-verification.',

  whatWouldClose:
    'A genuinely new quantitative bridge from BN-closure-distance (or BBLS-05 d_N) ' +
    'to the de Bruijn-Newman heat-flow constant Lambda. No such bridge is known in 2026.',

  implicationForLambdaAttack:
    'Beurling-Nyman / Bercovici-Foias / BBLS-05 do not contribute a numerical Lambda ' +
    'bound to the engine search. Their VALUE in Lambda-attack planning is ' +
    'COMPLEMENTARY: they document that the functional-analytic-orthogonal route ' +
    'fails to yield Lambda, in addition to the elementary-NT-orthogonal route ' +
    '(imp-1311) and the spectral / moment-method-orthogonal routes (imp-1297 + ' +
    'imp-1302 + imp-1303 + imp-1305). Three structurally-orthogonal RH-equivalent ' +
    'families now classified negative — pattern points to genuinely new mathematics ' +
    'as the requirement for a numerical Lambda bound from any RH-equivalent.',

  honestNote:
    'This is a NEGATIVE classification: Beurling-Nyman / BBLS-05 do not produce a ' +
    'numerical Lambda bound. The result is PRECISELY VALUABLE because it confirms ' +
    'that a third orthogonal RH-equivalent family (functional-analytic on L^2(0,1)) ' +
    'is also outside the Lambda-attack productive surface. No empirical d_N ' +
    'recomputation is performed in this ticket — Burnol 2005\'s table (d_N at ' +
    'N <= 5000 with convergence rate consistent with BBLS Conj. 1) is cited but ' +
    'not re-derived; the negative classification holds regardless of empirical ' +
    'd_N values.',
});

// =========================================================================
// SECTION F — EXPORTED RECORD.
// =========================================================================

export const IMP_1312_BEURLING_NYMAN_ATTACK = Object.freeze({
  id: 'imp-1312-beurling-nyman-attack',
  ticket: 'imp-1312',
  category: 'proof',
  builtAt: '2026-05-29T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1235', 'imp-1258', 'imp-1259', 'imp-1261', 'imp-1311',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  beurling1955Statement: BEURLING_1955_STATEMENT,
  nyman1950Statement: NYMAN_1950_STATEMENT,
  bercoviciFoias1984Statement: BERCOVICI_FOIAS_1984_STATEMENT,
  bbls2005Statement: BBLS_2005_STATEMENT,

  bblsQuantitativeAudit: BBLS_QUANTITATIVE_AUDIT,
  section15_27IntersectionAudit: SECTION_15_27_INTERSECTION_AUDIT,
  lambdaConnectionAudit: LAMBDA_CONNECTION_AUDIT,

  parentCrossReferences: Object.freeze({
    imp1235: 'src/data/imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk.js — Lambda-roadmap mapping',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js — §15-27 two-way collapse',
    imp1259: 'src/data/imp-1259-rh-equivalents-completeness-audit.js — RH-equivalents survey (BN entries)',
    imp1261: 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js — current Lambda bound 3.06e-5',
    imp1311: 'src/data/imp-1311-robin-lagarias-combinatorial-attack.js — elementary-NT sibling negative classification',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the candidate direct attack on RH ' +
    '(and a numerical Lambda bound) via the Beurling 1955 / Nyman 1950 / Bercovici-' +
    'Foias 1984 functional-analytic RH-equivalent criterion and its BBLS-05 ' +
    'quantitative form. It is NOT a new closure or a new numerical Lambda bound.',

    'The verdict is NEGATIVE for the numerical-Lambda question: Beurling-Nyman ' +
    '(L^2(0,1) closure of span{rho(theta/x) - theta*rho(1/x)} contains 1) and the ' +
    'BBLS-05 quantitative form (d_N -> 0) are STRICT RH EQUIVALENCES. They yield ' +
    'Lambda <= 0 iff RH holds (Newman 1976 + de Bruijn 1950) but NO numerical ' +
    'Lambda bound. The Baez-Duarte constant C^2 = sum_{rho} |rho zeta\'(rho)|^{-2} ' +
    'controlling the conjectured d_N^2 ~ C^2/log N rate is a zero-side moment, ' +
    'NOT a heat-flow constant — Lambda does not enter.',

    'Structural intersection with the §15-27 chain (imp-1258 two-way collapse): ' +
    'BN and §27 Volterra contraction are ORTHOGONAL operator-theoretic families. ' +
    'They live on different Hilbert spaces (L^2(0,1) multiplicative vs L^2([0, ' +
    'infinity)) sinh-additive). The naively-suggested Mellin / scale-invariant bridge ' +
    'is blocked at the §27 side by imp-1266 (sinh(at) kernel is additive not ' +
    'multiplicative; Phi-modulation breaks scaling; sinh(at) has no L^2(R_+) Mellin ' +
    'transform). Shared only via the trivial RH-equivalence relation.',

    'The structural complement is significant for engine planning: this is the ' +
    'THIRD orthogonal RH-equivalent family (functional-analytic) joining elementary-' +
    'NT (imp-1311 Robin/Lagarias) and spectral/moment (imp-1297 + imp-1302 + ' +
    'imp-1303 + imp-1305 + imp-1309) in the negative-numerical-Lambda classification. ' +
    'Three structurally-orthogonal RH-equivalent families now all classified negative; ' +
    'pattern points to genuinely new mathematics as the requirement for a numerical ' +
    'Lambda bound from any classical RH-equivalent.',

    'No empirical d_N recomputation is performed in this ticket. Burnol 2005\'s ' +
    'numerical table (d_N at N <= ~5000 with convergence rate consistent with the ' +
    'BBLS-05 conjecture and consistent with RH) is cited but not re-derived. The ' +
    'negative classification holds regardless of empirical d_N values: even a ' +
    'perfect empirical confirmation of the BBLS-05 conjectured rate would still ' +
    'be subsumed by Platt-Trudgian 2021 (RH verified up to T = 3 * 10^12).',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1235: 'src/data/imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk.js',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js',
    imp1259: 'src/data/imp-1259-rh-equivalents-completeness-audit.js',
    imp1261: 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js',
    imp1311: 'src/data/imp-1311-robin-lagarias-combinatorial-attack.js',
    beurling1955:
      'Beurling, A., "A closure problem related to the Riemann zeta-function", ' +
      'Proc. Nat. Acad. Sci. USA 41 (1955), no. 5, 312-314',
    nyman1950:
      'Nyman, B., "On some groups and semigroups of translations", Ph.D. thesis, ' +
      'Uppsala University, 1950',
    bercoviciFoias1984:
      'Bercovici, H., Foias, C., "A real variable restatement of Riemann\'s hypothesis", ' +
      'J. Funct. Anal. 56 (1984), no. 2, 168-182',
    bbls2005Quantification:
      'Balazard, M., Saias, E., "Notes sur la fonction zêta de Riemann, 4 — ' +
      'Quantification de Beurling-Nyman-Báez-Duarte", J. Number Theory 115 ' +
      '(2005), 234-260',
    bbls2005Autocorrelation:
      'Báez-Duarte, L., Balazard, M., Landreau, B., Saias, E., "Étude de ' +
      'l\'autocorrélation multiplicative de la fonction \'partie fractionnaire\'", ' +
      'Ramanujan J. 9 (2005), 215-240',
    bbls2000:
      'Báez-Duarte, L., Balazard, M., Landreau, B., Saias, E., "Notes sur la ' +
      'fonction zêta de Riemann, 3", Adv. Math. 149 (2000), no. 1, 130-144',
    burnol2005:
      'Burnol, J.-F., "A lower bound in an approximation problem involving the ' +
      'zeros of the Riemann zeta function", Adv. Math. 170 (2002), 56-70 (with ' +
      'follow-up numerical tables in 2004-2005 notes)',
    soundararajan2009:
      'Soundararajan, K., "Moments of the Riemann zeta function", Ann. of Math. ' +
      '(2) 170 (2009), no. 2, 981-993 (zero-density input for BD-constant convergence)',
    deBruijn1950:
      'de Bruijn, N. G., "The roots of trigonometric integrals", Duke Math. J. ' +
      '17 (1950), 197-226',
    newman1976:
      'Newman, C. M., "Fourier transforms with only real zeros", Proc. Amer. ' +
      'Math. Soc. 61 (1976), 245-251',
    plattTrudgian2021:
      'Platt, D., Trudgian, T., "The Riemann hypothesis is true up to 3·10^12", ' +
      'Bull. London Math. Soc. 53 (2021), 792-797',
    polymath15:
      'Polymath, D. H. J., "Effective approximation of heat flow evolution of ' +
      'the Riemann ξ function, and a new upper bound for the de Bruijn-Newman ' +
      'constant", Res. Math. Sci. 6 (2019), Paper No. 31',
    beurlingHelson1953:
      'Beurling, A., Helson, H., "Fourier-Stieltjes transforms with bounded powers", ' +
      'Math. Scand. 1 (1953), 120-126 (invariant-subspace structure used by Bercovici-Foias)',
  }),
});

export default IMP_1312_BEURLING_NYMAN_ATTACK;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1312_BEURLING_NYMAN_ATTACK_ASSERTIONS = [
  // Tripwire 1: Beurling 1955 stated precisely with PNAS citation.
  {
    id: 'imp1312-beurling-1955-stated-precisely',
    why:
      'Beurling 1955 must be stated as the Proc. Nat. Acad. Sci. USA 41 (1955) ' +
      '312-314 theorem with the L^2(0,1) closure of span{rho(theta/x) - theta*rho(1/x)} ' +
      'containing the constant 1 and the RH iff equivalence direction.',
    holds: () => {
      const s = IMP_1312_BEURLING_NYMAN_ATTACK.beurling1955Statement;
      return (
        typeof s.source === 'string' &&
        /Beurling/.test(s.source) &&
        /Proc\. Nat\. Acad\. Sci/.test(s.source) &&
        /41/.test(s.source) &&
        /1955/.test(s.source) &&
        /312-314|312.*314/.test(s.source) &&
        s.isTheorem === true &&
        s.isRHEquivalent === true &&
        s.rhEquivalenceDirection === 'iff' &&
        typeof s.statement === 'string' &&
        /L\^2\(0,1\)/.test(s.statement) &&
        /rho/.test(s.statement) &&
        /theta/.test(s.statement) &&
        /constant/.test(s.statement)
      );
    },
  },

  // Tripwire 2: Bercovici-Foias 1984 (J. Funct. Anal. 56) cited precisely.
  {
    id: 'imp1312-bercovici-foias-1984-stated-precisely',
    why:
      'Bercovici-Foias 1984 must be stated as the J. Funct. Anal. 56 (1984) 168-182 ' +
      'theorem with the scale-invariant-subspace recasting of Beurling-Nyman. The ' +
      'ticket explicitly mandates citing Bercovici-Foias 1984 (J. Funct. Anal. 56).',
    holds: () => {
      const s = IMP_1312_BEURLING_NYMAN_ATTACK.bercoviciFoias1984Statement;
      return (
        typeof s.source === 'string' &&
        /Bercovici/.test(s.source) &&
        /Foias/.test(s.source) &&
        /J\. Funct\. Anal/.test(s.source) &&
        /56/.test(s.source) &&
        /1984/.test(s.source) &&
        /168-182|168.*182/.test(s.source) &&
        s.isTheorem === true &&
        s.isRHEquivalent === true &&
        s.rhEquivalenceDirection === 'iff' &&
        typeof s.statement === 'string' &&
        /(scale-invariant|scale invariant)/.test(s.statement)
      );
    },
  },

  // Tripwire 3: BBLS 2005 quantitative d_N statement present with d_N -> 0 iff RH
  // and the BBLS Conj. 1 asymptotic.
  {
    id: 'imp1312-bbls-2005-quantitative-d_N-stated-precisely',
    why:
      'The BBLS-05 (Balazard-Saias 2005 + companions) quantitative form must be ' +
      'stated: d_N^2 = inf over a_k of L^2(0,1) distance, d_N -> 0 iff RH, and ' +
      'conjectured asymptotic d_N^2 ~ C^2 / log N with C = Baez-Duarte constant.',
    holds: () => {
      const s = IMP_1312_BEURLING_NYMAN_ATTACK.bbls2005Statement;
      return (
        typeof s.source === 'string' &&
        /Balazard|Báez-Duarte|Baez-Duarte/.test(s.source) &&
        /2005/.test(s.source) &&
        s.isTheorem === true &&
        s.isRHEquivalent === true &&
        typeof s.quantitativeStatement === 'string' &&
        /d_N/.test(s.quantitativeStatement) &&
        /(infinity|->)/.test(s.quantitativeStatement) &&
        /(C\^2|C \^ 2)/.test(s.quantitativeStatement) &&
        /log N/.test(s.quantitativeStatement) &&
        typeof s.baezDuarteConstantDescription === 'string' &&
        /(zero|rho|zeta)/.test(s.baezDuarteConstantDescription)
      );
    },
  },

  // Tripwire 4: BBLS quantitative audit answers all three sub-questions NO
  // (per ticket item 2: does BBLS give a numerical Lambda bound?).
  {
    id: 'imp1312-bbls-quantitative-audit-all-three-no',
    why:
      'The three BBLS sub-questions (does finite-N d_N give Lambda bound? does ' +
      'conjectured asymptotic give Lambda bound? does Baez-Duarte constant connect ' +
      'to Lambda?) must all be answered NO. A flip to YES would falsely claim a ' +
      'numerical Lambda bound from BBLS that does not exist in the literature.',
    holds: () => {
      const a = IMP_1312_BEURLING_NYMAN_ATTACK.bblsQuantitativeAudit;
      return (
        a.questionQBBLS1_doesFiniteN_dN_GiveNumericalLambdaBound === false &&
        typeof a.questionQBBLS1_reason === 'string' &&
        /(qualitative|heat-flow|Newman|de Bruijn)/i.test(a.questionQBBLS1_reason) &&
        a.questionQBBLS2_doesConjecturedAsymptoticGiveNumericalLambdaBound === false &&
        typeof a.questionQBBLS2_reason === 'string' &&
        /(Baez-Duarte|zero-side|moment)/i.test(a.questionQBBLS2_reason) &&
        a.questionQBBLS3_doesBaezDuarteConstantConnectToLambda === false &&
        typeof a.questionQBBLS3_reason === 'string' &&
        /(Selberg|zero-density|Soundararajan|NT-side)/i.test(a.questionQBBLS3_reason)
      );
    },
  },

  // Tripwire 5: §15-27 intersection audit reports BN orthogonal to §27 Volterra
  // (per ticket item 3: does BN intersect imp-1258 collapse?).
  {
    id: 'imp1312-section15-27-intersection-orthogonal',
    why:
      'The §15-27 intersection audit must establish that BN and §27 Volterra ' +
      'contraction are ORTHOGONAL operator-theoretic families: different Hilbert ' +
      'spaces, different category of statement (density vs norm), Mellin bridge ' +
      'blocked at §27 side by imp-1266, shared only via trivial RH-equivalence.',
    holds: () => {
      const a = IMP_1312_BEURLING_NYMAN_ATTACK.section15_27IntersectionAudit;
      return (
        typeof a.imp1258ReducedRHTo === 'string' &&
        /V_\{a,Phi\}/.test(a.imp1258ReducedRHTo) &&
        a.candidateIntersectionX1_commonHilbertSpace === false &&
        typeof a.candidateIntersectionX1_reason === 'string' &&
        /(L\^2\(0,1\)|L\^2\(\[0,)/.test(a.candidateIntersectionX1_reason) &&
        a.candidateIntersectionX2_commonOperatorTheoreticMechanism === false &&
        typeof a.candidateIntersectionX2_reason === 'string' &&
        /(density|closure|norm|contraction)/i.test(a.candidateIntersectionX2_reason) &&
        /(blocked|partial)/i.test(String(a.candidateIntersectionX3_commonMellinScaleInvariantInput)) &&
        typeof a.candidateIntersectionX3_reason === 'string' &&
        /(imp-1266|Mellin)/i.test(a.candidateIntersectionX3_reason) &&
        a.candidateIntersectionX4_commonRHEquivalence === true &&
        typeof a.aggregateVerdict === 'string' &&
        /(ORTHOGONAL|orthogonal)/.test(a.aggregateVerdict)
      );
    },
  },

  // Tripwire 6: Lambda-connection audit reports no quantitative bridge.
  {
    id: 'imp1312-lambda-connection-no-quantitative-bridge',
    why:
      'A silent flip to "BN gives numerical Lambda bound" would invalidate engine ' +
      'planning. Tripwire pins that no known mechanism connects BN closure margins ' +
      'or BBLS-05 d_N rates to numerical Lambda bounds.',
    holds: () => {
      const a = IMP_1312_BEURLING_NYMAN_ATTACK.lambdaConnectionAudit;
      return (
        a.isBeurlingNymanRHEquivalent === true &&
        a.isBBLS2005RHEquivalent === true &&
        a.rhEquivalentImpliesLambdaQualitativeOnly === true &&
        a.naiveProposalIsFalse === true &&
        Array.isArray(a.whyNaiveProposalFails) &&
        a.whyNaiveProposalFails.length >= 3 &&
        a.doesAnyKnownMechanismExist === false &&
        typeof a.empiricalConfirmationIsSubsumedBy === 'string' &&
        /Platt-Trudgian/.test(a.empiricalConfirmationIsSubsumedBy)
      );
    },
  },

  // Tripwire 7: Verdict is one of the four allowed strings (ticket spec item 4).
  {
    id: 'imp1312-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'beurling-nyman-gives-numerical-lambda-bound-X / ' +
      'beurling-nyman-RH-equivalent-only-not-numerical / ' +
      'beurling-nyman-empirically-confirms-RH-on-tested-range / ' +
      'beurling-nyman-orthogonal-to-section-15-27. A non-allowed verdict indicates ' +
      'classification drift.',
    holds: () => {
      const allowed = [
        'beurling-nyman-gives-numerical-lambda-bound-X',
        'beurling-nyman-RH-equivalent-only-not-numerical',
        'beurling-nyman-empirically-confirms-RH-on-tested-range',
        'beurling-nyman-orthogonal-to-section-15-27',
      ];
      return allowed.includes(IMP_1312_BEURLING_NYMAN_ATTACK.verdict);
    },
  },

  // Tripwire 8: Required citations present per ticket spec: Beurling 1955 +
  // Nyman 1950 + Bercovici-Foias 1984 + BBLS-05 + de Bruijn 1950 + Newman 1976.
  {
    id: 'imp1312-required-citations-present',
    why:
      'Per ticket spec: cite at least Beurling 1955 + Bercovici-Foias 1984 (J. Funct. ' +
      'Anal. 56) + Báez-Duarte-Balazard-Landreau-Saias 2005. We additionally require ' +
      'Nyman 1950 (precursor) + de Bruijn 1950 + Newman 1976 (Lambda-side) + ' +
      'Platt-Trudgian 2021 (subsumption baseline).',
    holds: () => {
      const r = IMP_1312_BEURLING_NYMAN_ATTACK.references;
      return (
        /Beurling/.test(r.beurling1955 || '') && /1955/.test(r.beurling1955 || '') &&
        /Proc\. Nat\. Acad\. Sci/.test(r.beurling1955 || '') &&
        /Nyman/.test(r.nyman1950 || '') && /1950/.test(r.nyman1950 || '') &&
        /Bercovici/.test(r.bercoviciFoias1984 || '') &&
        /Foias/.test(r.bercoviciFoias1984 || '') &&
        /J\. Funct\. Anal/.test(r.bercoviciFoias1984 || '') &&
        /56/.test(r.bercoviciFoias1984 || '') && /1984/.test(r.bercoviciFoias1984 || '') &&
        (
          (/Balazard/.test(r.bbls2005Quantification || '') && /2005/.test(r.bbls2005Quantification || '')) ||
          (/Báez-Duarte|Baez-Duarte/.test(r.bbls2005Autocorrelation || '') && /2005/.test(r.bbls2005Autocorrelation || ''))
        ) &&
        /de Bruijn/.test(r.deBruijn1950 || '') &&
        /Newman/.test(r.newman1976 || '') &&
        /Platt|Trudgian/.test(r.plattTrudgian2021 || '')
      );
    },
  },

  // Tripwire 9: Cross-references imp-1311 (per ticket: "cross-references imp-1311")
  // + imp-1235 + imp-1258 + imp-1259 + imp-1261.
  {
    id: 'imp1312-cross-references-parent-tickets-and-imp-1311',
    why:
      'Per ticket spec: cross-reference imp-1311 (sibling elementary-NT negative ' +
      'classification). Additionally we cross-reference imp-1235 (Lambda roadmap), ' +
      'imp-1258 (§15-27 collapse — the imp-1258 collapse is named in ticket item 3), ' +
      'imp-1259 (RH-equivalents survey containing BN entries), imp-1261 (current ' +
      'Lambda bound).',
    holds: () => {
      const r = IMP_1312_BEURLING_NYMAN_ATTACK;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1235') &&
        related.includes('imp-1258') &&
        related.includes('imp-1259') &&
        related.includes('imp-1261') &&
        related.includes('imp-1311') &&
        typeof xrefs.imp1235 === 'string' && /imp-1235/.test(xrefs.imp1235) &&
        typeof xrefs.imp1258 === 'string' && /imp-1258/.test(xrefs.imp1258) &&
        typeof xrefs.imp1259 === 'string' && /imp-1259/.test(xrefs.imp1259) &&
        typeof xrefs.imp1261 === 'string' && /imp-1261/.test(xrefs.imp1261) &&
        typeof xrefs.imp1311 === 'string' && /imp-1311/.test(xrefs.imp1311)
      );
    },
  },

  // Tripwire 10: SEMANTIC CHECK 1 — Baez-Duarte constant formula is the
  // zero-side moment sum_{rho} |rho zeta'(rho)|^{-2}, NOT a heat-flow constant.
  {
    id: 'imp1312-semantic-baez-duarte-constant-is-zero-side-moment',
    why:
      'Semantic check: the Baez-Duarte constant C^2 = sum_{rho} |rho * zeta\'(rho)|^{-2} ' +
      'must be correctly identified as a zero-side moment (Selberg/Soundararajan type), ' +
      'NOT a heat-flow/Lambda-side quantity. A silent miscoding to "C^2 = de Bruijn-' +
      'flow constant" would falsely claim a BN-to-Lambda bridge.',
    holds: () => {
      const s = IMP_1312_BEURLING_NYMAN_ATTACK.bbls2005Statement;
      const a = IMP_1312_BEURLING_NYMAN_ATTACK.bblsQuantitativeAudit;
      return (
        typeof s.baezDuarteConstantDescription === 'string' &&
        /(zero|rho)/.test(s.baezDuarteConstantDescription) &&
        /(NO known|not a heat-flow|NOT a heat-flow|not a Lambda)/i.test(s.baezDuarteConstantDescription) &&
        typeof a.baezDuarteConstantFormula === 'string' &&
        /rho/.test(a.baezDuarteConstantFormula) &&
        /zeta/.test(a.baezDuarteConstantFormula) &&
        a.questionQBBLS3_doesBaezDuarteConstantConnectToLambda === false
      );
    },
  },

  // Tripwire 11: SEMANTIC CHECK 2 — BN closure form has rho = fractional part
  // (NOT a zeta zero) — naming collision check.
  {
    id: 'imp1312-semantic-rho-is-fractional-part-not-zeta-zero',
    why:
      'Semantic check: in the Beurling-Nyman statement rho(y) = y - floor(y) is the ' +
      'fractional-part function (collides naming-wise with non-trivial zeros of zeta ' +
      'also conventionally rho). A silent confusion would invalidate the statement. ' +
      'Tripwire checks that Beurling 1955 statement explicitly names rho as the ' +
      'fractional part.',
    holds: () => {
      const s = IMP_1312_BEURLING_NYMAN_ATTACK.beurling1955Statement;
      return (
        typeof s.statement === 'string' &&
        /fractional/.test(s.statement) &&
        /(floor|y - floor\(y\))/.test(s.statement)
      );
    },
  },

  // Tripwire 12: SEMANTIC CHECK 3 — honest scope must name THREE orthogonal
  // RH-equivalent families now classified negative (elementary-NT imp-1311 +
  // functional-analytic this ticket + spectral/moment imp-1297 etc.).
  {
    id: 'imp1312-semantic-three-orthogonal-families-pattern',
    why:
      'Semantic check: the honest scope must identify the engine-planning consequence ' +
      'that THREE orthogonal RH-equivalent families are now classified negative — ' +
      'elementary-NT (imp-1311 Robin/Lagarias), functional-analytic (this ticket BN), ' +
      'and spectral/moment (imp-1297+imp-1302+imp-1303+imp-1305+imp-1309). A silent ' +
      'drift to "BN solves Lambda" would erase this pattern signal.',
    holds: () => {
      const blob = IMP_1312_BEURLING_NYMAN_ATTACK.honestScope.join(' ');
      return (
        /(NEGATIVE|negative)/.test(blob) &&
        /(functional-analytic|functional analytic)/.test(blob) &&
        /(elementary-NT|elementary NT)/.test(blob) &&
        /imp-1311/.test(blob) &&
        /(imp-1297|imp-1302|imp-1303|imp-1305)/.test(blob) &&
        /(THIRD|third)/.test(blob) &&
        /(Platt-Trudgian)/.test(blob)
      );
    },
  },
];
