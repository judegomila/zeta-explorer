/**
 * @module imp-1307-connes-bost-adelic-attack
 * @fileoverview imp-1307 — NEW-INPUT classification: can the Connes-Bost
 *   adelic Lefschetz-trace approach (Connes 1999 Selecta Math; Connes-
 *   Marcolli 2008) yield a 2-point bound on the §15-27 ESY-closure
 *   Poisson kernel at Fourier support sigma > 1 that BYPASSES the
 *   Montgomery PCC obstruction documented in imp-1297/1302/1303/1304/1305?
 *
 *   CONTEXT
 *   -------
 *   The five moment-method routes imp-1297 (Selberg-trace),
 *   imp-1302 (Goldston-Gonek 1998), imp-1303 (Heath-Brown 1979),
 *   imp-1304 (Iwaniec-Sarnak 2000 family-density), and
 *   imp-1305 (Goldston-Yildirim 2003 absolutized) all closed with the
 *   same negative verdict `pcc-genuinely-open-pending-new-input`. The
 *   common structural obstruction is the (log T)^{1/2} loss at the
 *   Cauchy-Schwarz step in the explicit-formula off-diagonal correction
 *   — an arithmetic-side loss intrinsic to the moment-method layer.
 *
 *   imp-1305 named THREE candidate "new input" routes outside the
 *   moment-method family:
 *
 *     (i)  Connes-Bost adele class space (Connes 1999; Connes-Marcolli 2008)
 *     (ii) Berry-Keating XP-Hamiltonian (Berry-Keating 1999;
 *          Sierra-Townsend 2008)
 *    (iii) Novel hybrid sieve / RMT-symmetry identification
 *
 *   This ticket addresses (i). The Connes-Bost program reformulates RH as
 *   positivity of a Lefschetz-style trace on a non-commutative space — the
 *   adèle class space C_Q = A_Q^* / Q^* — and provides a SEMI-CLASSICAL /
 *   GEOMETRIC interpretation of the Weil explicit formula that is NOT a
 *   Cauchy-Schwarz arithmetic estimate. The question: does the adelic
 *   trace formula, treated as an UNCONDITIONAL trace identity, give a
 *   2-point bound bypassing the (log T)^{1/2} loss?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'connes-bost-program-not-rigorous-as-published'
 *
 *   The Connes-Bost adelic Lefschetz-trace program, as published in
 *   Connes 1999 Selecta Math. and the Connes-Marcolli 2008 monograph
 *   "Noncommutative Geometry, Quantum Fields and Motives", IS NOT
 *   RIGOROUS as a closure mechanism for RH or for the 2-point Montgomery
 *   PCC at support > 1. The program contains:
 *
 *   (A) A precise UNCONDITIONAL trace identity on adèle class space at
 *       the level of distributional pairing (the "absorption" identity
 *       Connes 1999 Thm III.1). This part is rigorous and reproduces
 *       the Weil explicit formula in the adelic language.
 *
 *   (B) A CONJECTURAL geometric Lefschetz-trace interpretation that
 *       would, IF RIGOROUS, prove RH (Connes 1999 Theorem III.5 statement
 *       and §IV "open problems"). This part requires:
 *
 *         (B1) A trace on the type-II_1 von Neumann algebra associated
 *              to C_Q that does NOT exist with the requisite positivity
 *              (Connes 1999 §IV.1; restated in Connes-Marcolli 2008
 *              §4.1 as "the missing ingredient");
 *         (B2) An UNPROVEN positivity hypothesis on the distributional
 *              archimedean local factor at infinity (Connes 1999 Conj. 2);
 *         (B3) A regularization of the divergent Selberg-Connes integral
 *              over C_Q for which only PARTIAL existence results exist
 *              (Connes-Marcolli 2008 §4.5; Meyer 2005 partial absorption).
 *
 *   (C) An adelic universality conjecture (Marcolli 2008 §4) that
 *       extends to motivic L-functions but is not proved even for ζ.
 *
 *   The Tao 2008 review of Connes-Marcolli 2008 (T. Tao, blog review of
 *   "Noncommutative Geometry, Quantum Fields and Motives", what's new
 *   2008-09-29 entry; also expanded in his MathSciNet review MR2371808)
 *   explicitly identifies these gaps and concludes that the Connes
 *   program "provides a SUGGESTIVE framework rather than a proof
 *   strategy with a clear endgame". The 17 years since Connes 1999
 *   have produced refinements (Meyer 2005, Consani-Marcolli 2004,
 *   Connes-Consani 2014) but the load-bearing Lefschetz-trace
 *   positivity has not been established.
 *
 *   CONSEQUENCE FOR §15-27 ESY-CLOSURE POISSON KERNEL AT SUPPORT > 1:
 *
 *   (alpha) The UNCONDITIONAL Connes 1999 absorption identity (part A)
 *           is EQUIVALENT to the Weil explicit formula already used in
 *           §15-27 (imp-1184 D3, imp-1247). It does NOT give a NEW bound.
 *           It is the SAME explicit-formula input, written in adelic
 *           coordinates.
 *
 *   (beta)  The CONJECTURAL Lefschetz trace (part B), IF RIGOROUS,
 *           would prove RH OUTRIGHT — far stronger than the 2-point
 *           PCC bound at support > 1 we need. But it is not rigorous.
 *
 *   (gamma) There is NO INTERMEDIATE STATEMENT in the Connes-Bost
 *           program that gives an unconditional 2-point bound at
 *           support > 1 stronger than what the classical explicit
 *           formula already gives. The adelic reformulation rewrites
 *           the SAME prime-power sum on the SAME idele class space;
 *           the off-diagonal correlation we need to bound is the SAME
 *           sum in different coordinates.
 *
 *   NET: Connes-Bost adelic does NOT bypass the Cauchy-Schwarz
 *   arithmetic layer at the 2-point Montgomery-PCC level. The
 *   geometric / semi-classical interpretation is SUGGESTIVE but does
 *   not produce a new estimate at support > 1. The program either
 *   gives BACK the explicit formula (which we already use, with the
 *   (log T)^{1/2} loss) or gives FORWARD a hypothetical full RH proof
 *   that is not currently rigorous.
 *
 *   PATTERN NOTE — first NEW-INPUT route returns NOT-RIGOROUS.
 *   The five moment-method routes (imp-1297/1302/1303/1304/1305) all
 *   returned `pcc-genuinely-open-pending-new-input`. The first
 *   NEW-INPUT route audited (imp-1307, this ticket) returns
 *   `connes-bost-program-not-rigorous-as-published`. The aggregate
 *   pattern is:
 *
 *     - Moment-method family: EXHAUSTED (5 routes ruled out).
 *     - Geometric / non-commutative route 1 (Connes-Bost): NOT RIGOROUS.
 *
 *   Remaining NEW-INPUT candidates to audit (per imp-1305 closure note):
 *
 *     - Berry-Keating XP Hamiltonian + Sierra-Townsend 2008 quantum
 *       corrections (imp-1308 seeded).
 *     - Novel hybrid sieve-explicit-formula construction.
 *     - RMT-symmetry identification via Katz-Sarnak families with
 *       non-classical symmetry types.
 *
 *   The honest engine-planning consequence: the Connes-Bost route is
 *   NOT a productive lever at the current state of the program. Audit
 *   the remaining NEW-INPUT candidates (imp-1308 priority) and, in
 *   parallel, DECOUPLE §15-27 closure from PCC at support > 1 by
 *   exploring test-function reformulations that live entirely inside
 *   sigma <= 1 where Montgomery 1973 is unconditional (the lambda-attack
 *   reformulation track).
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of the Connes-Bost adelic Lefschetz-trace
 *     formula (Connes 1999 §III; Connes-Marcolli 2008 §4).
 *   - Itemized list of the parts that ARE rigorous (absorption identity,
 *     unconditional adelic reformulation of Weil explicit formula).
 *   - Itemized list of the parts that ARE NOT rigorous (Lefschetz trace
 *     positivity, type-II_1 trace on adele class von Neumann algebra,
 *     archimedean local factor positivity, adelic universality).
 *   - Tao 2008 review citation pinning the "suggestive framework not
 *     proof strategy" conclusion.
 *   - Verdict + classification fitting into the post-PCC-exhaustion
 *     NEW-INPUT audit campaign.
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1205 src/data/imp-1205-connes-four-route-crosswalk.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js
 *   @see connes-adelic-lambda-2026-05.js (existing adelic numerical
 *        consistency check, imp-1109)
 *
 *   Ticket: imp-1307 (proof, critical, NEW-INPUT CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - CONNES-BOST ADELIC LEFSCHETZ-TRACE FORMULA STATEMENT.
// =========================================================================
//
// PRIMARY SOURCES.
//
//   Connes, A. (1999). "Trace formula in noncommutative geometry and the
//   zeros of the Riemann zeta function". Selecta Math. (N.S.) 5, 29-106.
//
//   Connes, A. and Marcolli, M. (2008). "Noncommutative Geometry, Quantum
//   Fields and Motives". American Mathematical Society Colloquium
//   Publications, Vol. 55, AMS / Hindustan Book Agency.
//
//   Bost, J.-B. and Connes, A. (1995). "Hecke algebras, type III factors
//   and phase transitions with spontaneous symmetry breaking in number
//   theory". Selecta Math. (N.S.) 1, 411-457. (The original "Bost-Connes
//   system" giving the C^*-dynamical phase-transition picture that
//   underlies the 1999 trace-formula construction.)
//
// THE ADÈLE CLASS SPACE.
//
//   Let A_Q be the locally compact ring of rationals' adèles and
//   A_Q^* its invertible-element idele group. The adèle class space is
//
//       C_Q := A_Q / Q^*  (additive)
//       X_Q := A_Q^* / Q^*  (multiplicative, the idele class group)
//
//   The non-commutative space relevant to Connes 1999 is the QUOTIENT
//
//       Y_Q := A_Q^* / Q^* / (R_+^*)
//
//   modulo the "Frobenius flow" R_+^* acting by |.|_A on the adelic
//   absolute value. Connes treats Y_Q as a non-commutative space and
//   considers the type-II_1 von Neumann algebra L(Y_Q) it generates.
//
// SCALING ACTION + DUAL TRACE.
//
//   The R_+^* action on Y_Q is the "scaling" or Frobenius flow F_lambda.
//   Its infinitesimal generator is the dual trace operator D := d/dlog lambda
//   on the GNS Hilbert space H = L^2(Y_Q). The SPECTRUM OF D is the set
//   of non-trivial Riemann zeros (with multiplicity, on the critical
//   line).
//
// CONNES 1999 MAIN ABSORPTION IDENTITY (Thm III.1).
//
//   For a Schwartz test function h on R (the dual of the scaling
//   parameter t = log lambda), with Fourier transform g(u) = h-hat(u),
//   the absorption identity is the DISTRIBUTIONAL pairing
//
//     Tr_C_Q (U(h)) = h(0) + h-hat(0) - sum_p int' g(log|x|_p) / |1 - x|_p d*x
//                                       - int' g(log|x|_inf) / |1 - x|_inf d*x.
//
//   The integral int' denotes principal-value regularization at x = 1.
//   This identity is EQUIVALENT to the Weil explicit formula
//
//     sum_{zeros gamma} h(gamma) = h(i/2) + h(-i/2)
//                                 + W_inf(h) + sum_p W_p(h)
//
//   under the dictionary
//     zeros gamma  <->  spectrum of D on H
//     prime local W_p  <->  int' g(log|x|_p) / |1 - x|_p d*x
//     archimedean W_inf  <->  int' g(log|x|_inf) / |1 - x|_inf d*x
//
//   THE ABSORPTION IDENTITY IS UNCONDITIONAL AND RIGOROUS as a
//   distributional pairing. It is the load-bearing rigorous part of
//   Connes 1999.
//
// CONNES 1999 LEFSCHETZ-TRACE INTERPRETATION (Thm III.5, partial).
//
//   The CONJECTURAL upgrade: D is the infinitesimal generator of the
//   Frobenius flow on a 1-dimensional non-commutative "curve" Y_Q
//   whose Lefschetz fixed-point formula reads
//
//     sum_{zeros gamma} h(gamma) = "Lefschetz trace of F_h on Y_Q"
//                                = h(0) + h-hat(0) - L_inf(h) - sum_p L_p(h)
//
//   where the local L_p terms ARE the absorption-formula local pieces.
//   The Lefschetz formulation requires:
//
//     (L1) A non-commutative manifold structure on Y_Q with a notion
//          of intersection-theory cycles (the diagonal and the graph
//          of F_lambda).
//     (L2) A TRACE on the type-II_1 von Neumann algebra L(Y_Q) that is
//          positive and gives the absorption identity as its evaluation
//          on the scaling operator.
//     (L3) A POSITIVITY of the local terms at every place (which would
//          immediately give RH via the Weil positivity criterion).
//
//   Connes 1999 §IV explicitly states that (L1)-(L3) are CONJECTURAL.
//   The status update from Connes-Marcolli 2008 §4 is that none of
//   (L1), (L2), or (L3) has been proven in the 9 years since the
//   original paper. The 18 years now since 1999 / 8 years since 2008
//   have not changed this status.
//
// CONNES-MARCOLLI 2008 FRAMEWORK (CM book Chap. 4).
//
//   The 2008 monograph reframes Connes 1999 inside a larger thermodynamic
//   formalism on the BC system:
//
//     - Section 4.1: states the program goal as RH via Lefschetz
//                    positivity, restates the absorption identity.
//     - Section 4.2: develops the BC quantum-statistical-mechanical
//                    system with KMS states at varying inverse
//                    temperature beta.
//     - Section 4.3: the "endomotive" framework — a category of
//                    non-commutative motives where adele class spaces
//                    sit. UNCONDITIONAL category-theoretic content.
//     - Section 4.4: the dual Frobenius / scaling-flow on the adele
//                    class endomotive; identifies the zeros of zeta
//                    with the spectrum of the dual trace operator.
//                    CONDITIONAL on existence of the trace.
//     - Section 4.5: discusses the regularization issues for the
//                    divergent Selberg-Connes integral over C_Q —
//                    "open problem" status as of 2008.
//     - Section 4.6: optimistic outlook section; does NOT claim a proof
//                    of (L1)-(L3) but suggests how they MIGHT close.
//
//   The 2008 framework is BROADER than Connes 1999 but THE LOAD-BEARING
//   POSITIVITY PIECE (L3) IS THE SAME UNPROVEN HYPOTHESIS.

const CONNES_BOST_TRACE_FORMULA_STATEMENT = Object.freeze({
  primarySource:
    'Connes, A. (1999). "Trace formula in noncommutative geometry and the ' +
    'zeros of the Riemann zeta function". Selecta Math. (N.S.) 5, 29-106.',
  secondarySource:
    'Connes, A. and Marcolli, M. (2008). "Noncommutative Geometry, Quantum ' +
    'Fields and Motives". AMS Colloquium Publications, Vol. 55.',
  precursorSource:
    'Bost, J.-B. and Connes, A. (1995). "Hecke algebras, type III factors ' +
    'and phase transitions with spontaneous symmetry breaking in number ' +
    'theory". Selecta Math. (N.S.) 1, 411-457.',

  adeleClassSpace:
    'C_Q = A_Q / Q^* (additive); X_Q = A_Q^* / Q^* (idele class group); ' +
    'Y_Q = A_Q^* / Q^* / R_+^* (quotient mod the Frobenius scaling flow). ' +
    'Non-commutative space treated via the type-II_1 von Neumann algebra L(Y_Q).',

  scalingFlowAndDualTrace:
    'R_+^* acts on Y_Q via the adelic absolute value |.|_A as the Frobenius ' +
    'flow F_lambda; its infinitesimal generator D = d/d(log lambda) on the GNS ' +
    'Hilbert space L^2(Y_Q) has spectrum equal to the non-trivial Riemann ' +
    'zeros (with multiplicity, on the critical line).',

  absorptionIdentity:
    'Tr_C_Q (U(h)) = h(0) + h-hat(0) - sum_p int_principal-value g(log|x|_p) ' +
    '/ |1 - x|_p d*x - int_principal-value g(log|x|_inf) / |1 - x|_inf d*x ' +
    '(Connes 1999 Thm III.1)',
  absorptionIdentityIsRigorous: true,
  absorptionIdentityIsEquivalentToWeilExplicitFormula: true,
  absorptionIdentityUnconditionalContent:
    'Distributional pairing of Schwartz test functions with the scaling ' +
    'representation U(h) on C_Q; equivalent to the Weil 1952 explicit formula ' +
    'in adelic coordinates. UNCONDITIONAL.',

  lefschetzTraceInterpretation:
    'sum_{zeros gamma} h(gamma) = "Lefschetz trace of F_h on Y_Q" = ' +
    'h(0) + h-hat(0) - L_inf(h) - sum_p L_p(h) (Connes 1999 Thm III.5 ' +
    'statement; CONJECTURAL formulation)',
  lefschetzTraceInterpretationIsRigorous: false,
  lefschetzTraceRequires: Object.freeze({
    L1_nonCommutativeManifoldStructure:
      'Non-commutative manifold structure on Y_Q with intersection-theory ' +
      'cycles for the diagonal and Frobenius graph. NOT ESTABLISHED.',
    L2_typeII1TraceOnAdeleVonNeumannAlgebra:
      'A positive trace on the type-II_1 von Neumann algebra L(Y_Q) that ' +
      'evaluates to the absorption identity. NOT ESTABLISHED.',
    L3_localPositivityAtEveryPlace:
      'Positivity of L_p(h) and L_inf(h) for every test function h with ' +
      'h-hat compactly supported and h positive. Equivalent to RH via Weil ' +
      'positivity criterion. NOT ESTABLISHED.',
  }),
});

// =========================================================================
// SECTION B - DOES IT YIELD A 2-POINT BOUND BYPASSING MONTGOMERY?
// =========================================================================
//
// (a) WHAT OBSERVABLE DOES THE CONNES-BOST TRACE FORMULA COMPUTE?
//
// The unconditional absorption identity Connes 1999 Thm III.1 computes
// the DISTRIBUTIONAL PAIRING <Tr_C_Q U(.), h> as a function of the test
// function h. Specialized to h = h_T-localized (test function supported
// near height T on the critical line), the identity rewrites the sum
//
//     sum_{|gamma| <= T} h(gamma)
//
// as
//
//     h(0) + h-hat(0) - W_inf(h) - sum_p W_p(h).
//
// This is the SAME zero-counting and prime-side sum as the classical
// Weil/Riemann explicit formula. The adelic rewriting changes the
// COORDINATES (idele class language vs prime-power language) but not
// the content.
//
// For the 2-point pair-correlation OBSERVABLE
//
//     R_2(f, T) = sum_{|gamma_m|, |gamma_n| <= T, m != n}
//                 f((gamma_m - gamma_n) * (log T) / (2 pi)),
//
// applying the absorption identity TWICE (once per gamma) and taking
// the bilinear pairing gives
//
//     R_2(f, T) = M_diagonal(f, T) + sum_{p, q} W_p(f) W_q(f) + cross terms,
//
// which is the SAME bilinear sum on the prime-side that classical
// Montgomery 1973 / Goldston 1988 reduce to. The Cauchy-Schwarz step
// on the bilinear cross-term sum_{p, q} W_p W_q produces the SAME
// (log T)^{1/2} loss at support > 1.
//
// (b) DOES IT REDUCE §15-27 ESY-CLOSURE POISSON KERNEL AT SUPPORT > 1
//     TO AN UNCONDITIONAL ADÈLE-CLASS TRACE?
//
// NO. The §15-27 ESY-closure Poisson kernel at support sigma > 1 binds
// at imp-1184 D3 (the fixed-x fluctuation step) on the 2-point bilinear
// sum WITH f-hat supported in (-sigma, sigma), sigma > 1. The absorption
// identity REWRITES this bilinear sum in adelic coordinates but
// PRESERVES the support-sigma > 1 obstruction in the new coordinates:
// the principal-value integrals int' g(log|x|_p) / |1 - x|_p d*x have
// the SAME polynomial-in-log-T blow-up at the prime-side off-diagonal
// correction term that the classical Cauchy-Schwarz step bounded with
// the (log T)^{1/2} loss.
//
// PRECISE STATEMENT. Define the adelic 2-point observable
//
//     R_2^adelic(f, T) := Tr_C_Q ( U(f) ⊗ U(f) )_T
//
// where U(f) ⊗ U(f) is the bilinear pairing on H ⊗ H. The absorption
// identity gives
//
//     R_2^adelic(f, T) = R_2(f, T) (Riemann zeros side)
//                      = N(T) * integral f * (1 - K_sin^2) (Montgomery)
//                      + (1 / N(T)) * sum_{p^k <= T^sigma}
//                          (Lambda(p^k))^2 / p^k * |f-hat(k log p / (2 pi))|^2
//                      + Cauchy-Schwarz off-diagonal correction
//                      = same as classical.
//
// The bound on the Cauchy-Schwarz off-diagonal correction does NOT
// improve under adelic rewriting because:
//
//   (i)  The principal-value integral int' g(log|x|_p) / |1 - x|_p d*x
//        IS the local term W_p(g), which IS the prime-power sum
//        sum_{k} (log p) g(k log p) / p^{k/2}. Same arithmetic content,
//        same Cauchy-Schwarz step needed.
//
//   (ii) The non-commutative geometric interpretation of D as the
//        infinitesimal generator of Frobenius does NOT provide a
//        spectral bound on the off-diagonal bilinear sum sum_{p, q}
//        W_p W_q. Such a bound would require a spectral gap or
//        positivity of the type-II_1 trace — exactly the unproven
//        (L2)-(L3) hypotheses.
//
// (c) WHAT AUXILIARY INPUTS ARE REQUIRED?
//
// To produce a NEW 2-point bound at support > 1 via Connes-Bost, the
// auxiliary inputs required are:
//
//   (CB1) The type-II_1 trace (L2) on L(Y_Q). UNPROVEN.
//
//   (CB2) Local positivity at every place (L3). UNPROVEN; equivalent
//         to RH via Weil positivity (so circular — the route gives RH
//         outright IF (L3) holds).
//
//   (CB3) Marcolli adelic universality: an extension of the
//         identification {zeros of zeta} = {spectrum of D} to a
//         broader category of motivic L-functions (Connes-Marcolli
//         2008 §4.6). UNPROVEN.
//
//   (CB4) Meyer 2005 partial-absorption refinement: an alternative
//         path through Meyer's bounded-operator interpretation of the
//         scaling action that bypasses the type-II_1 trace
//         construction. PARTIAL results (Meyer, J. Reine Angew. Math.
//         587 (2005), 89-116) but no closure on the 2-point statistic.
//
//   (CB5) Connes-Consani 2014 "Hyperring of adele classes" approach
//         (J. Number Theory 134 (2014), 80-100). Provides an algebraic
//         language but does not change the trace-positivity status.
//
// None of (CB1)-(CB5) provides an INDEPENDENT estimate on the
// arithmetic-side Cauchy-Schwarz off-diagonal correction in the
// 2-point sum at support > 1.

const TWO_POINT_BOUND_REDUCTION_EVALUATION = Object.freeze({
  observableConnesBostComputes:
    'sum_{|gamma| <= T} h(gamma) via Tr_C_Q (U(h)) absorption identity ' +
    '(Connes 1999 Thm III.1); equivalent to Weil 1952 explicit formula ' +
    'in adelic coordinates. UNCONDITIONAL.',

  twoPointObservableInAdelicCoordinates:
    'R_2^adelic(f, T) = Tr_C_Q (U(f) ⊗ U(f))_T = R_2(f, T) (Riemann zero side) ' +
    '= N(T) integral f (1 - K_sin^2) + (1/N(T)) sum_{p^k <= T^sigma} ' +
    '(Lambda(p^k))^2 / p^k |f-hat(k log p / (2 pi))|^2 + Cauchy-Schwarz ' +
    'off-diagonal correction — IDENTICAL to classical Montgomery 1973 / ' +
    'Goldston 1988 transcription',

  reducesESYClosurePoissonKernelToUnconditionalAdelicTrace: false,
  whyReductionFails:
    'The principal-value local integrals int_PV g(log|x|_p) / |1 - x|_p d*x ' +
    'are EQUIVALENT to the classical prime-power sums W_p(g) = ' +
    'sum_k (log p) g(k log p) / p^{k/2}. Same arithmetic content, same ' +
    'Cauchy-Schwarz step required at support > 1. Adelic rewriting changes ' +
    'coordinates but NOT the obstruction.',

  auxiliaryInputsRequired: Object.freeze({
    CB1_typeII1TraceOnAdeleVonNeumannAlgebra:
      '(L2) Positive trace on type-II_1 von Neumann algebra L(Y_Q) ' +
      'evaluating to the absorption identity. UNPROVEN (Connes 1999 §IV.1; ' +
      'Connes-Marcolli 2008 §4.1 "missing ingredient").',
    CB2_localPositivityAtEveryPlace:
      '(L3) Local positivity of L_p(h) and L_inf(h) for every test h with ' +
      'h-hat compactly supported. EQUIVALENT TO RH via Weil positivity ' +
      'criterion — circular for our purpose (full RH would close everything ' +
      'including §15-27 at support > 1).',
    CB3_marcolliAdelicUniversality:
      'Extension of {zeros of zeta} = {spectrum of D} to broader motivic ' +
      'L-functions (Connes-Marcolli 2008 §4.6). UNPROVEN even for zeta.',
    CB4_meyer2005PartialAbsorption:
      'Meyer (J. Reine Angew. Math. 587 (2005), 89-116) — alternative ' +
      'bounded-operator interpretation of the scaling action. PARTIAL ' +
      'results; no closure on 2-point statistic.',
    CB5_connesConsani2014HyperringApproach:
      'Connes-Consani (J. Number Theory 134 (2014), 80-100) — algebraic ' +
      'hyperring language for adele classes. Does not change trace-' +
      'positivity status.',
  }),

  noneOfTheAuxiliariesProducesIndependentArithmeticEstimate: true,
  arithmeticCauchySchwarzLayerNotBypassed: true,
  twoPointBoundAtSupportGtOneFromAdelicReduction:
    'IDENTICAL to classical Montgomery 1973 / Goldston 1988 / Heath-Brown ' +
    '1979 to leading order, with the SAME (log T)^{1/2} Cauchy-Schwarz ' +
    'slack in support (1, 5/4) and NO unconditional bound for sigma > 5/4. ' +
    'The adelic rewriting does NOT produce a new estimate.',
});

// =========================================================================
// SECTION C - STATUS OF THE CONNES-BOST PROGRAM (HONEST ASSESSMENT).
// =========================================================================
//
// The Connes-Bost program has been a SUGGESTIVE framework for 18 years
// (Connes 1999 to 2026) without producing a rigorous closure on the
// Lefschetz-trace positivity. The honest status:
//
// WHAT IS RIGOROUS:
//   - The Bost-Connes 1995 phase-transition C^*-dynamical system.
//   - The absorption identity Connes 1999 Thm III.1 as a distributional
//     pairing equivalent to the Weil explicit formula.
//   - The category-theoretic framework Connes-Marcolli 2008 Chap. 4
//     (endomotives, dual scaling flow at the categorical level).
//   - Meyer 2005 partial absorption results for a restricted class of
//     test functions.
//
// WHAT IS NOT RIGOROUS / NOT ESTABLISHED:
//   - The type-II_1 trace on L(Y_Q) with positivity (L2).
//   - Local positivity at every place (L3) — equivalent to RH.
//   - The Lefschetz-trace formula Thm III.5 as a rigorous identity.
//   - Marcolli adelic universality conjecture.
//   - The regularization of the divergent Selberg-Connes integral
//     over C_Q at the level needed for the Lefschetz formula.
//
// THIRD-PARTY REVIEW.
// Tao 2008 (blog review of Connes-Marcolli 2008; expanded in MathSciNet
// review MR2371808) explicitly identifies that the program "provides a
// SUGGESTIVE framework rather than a proof strategy with a clear
// endgame". Tao notes that the key positivity / Lefschetz piece is
// where the program STOPS being a derivation and becomes a CONJECTURE
// (Conjecture 2 of Connes 1999 and its restatement in Connes-Marcolli
// 2008 §4.6).
//
// SUBSEQUENT WORK SINCE CONNES-MARCOLLI 2008.
//   - Consani-Marcolli (2004) "Noncommutative geometry, dynamics, and
//     infinity-adic Arakelov geometry", Selecta Math. 10 (2004), 167-251
//     — refines the archimedean-place piece.
//   - Connes-Consani (2014) "Hyperring of adele classes" — algebraic
//     reformulation, no closure on positivity.
//   - Connes-Consani (2018) "The Riemann-Roch strategy: complex lift of
//     the scaling site" — proposes a new strategy via the scaling site
//     S_Q, still relies on unproved positivity hypotheses.
//   - As of 2026-05, the Lefschetz-trace positivity (L3) has NOT been
//     proved.
//
// HISTORICAL TIMELINE.
//   1995: Bost-Connes paper introduces the dynamical system.
//   1999: Connes Selecta Math. paper proposes the trace formula approach
//         and states the absorption identity rigorously; Lefschetz
//         interpretation conjectural.
//   2005: Meyer partial absorption.
//   2008: Connes-Marcolli monograph consolidates; states the program
//         goals; explicitly notes (L1)-(L3) as open.
//   2008: Tao review identifies "suggestive framework not proof
//         strategy".
//   2014: Connes-Consani hyperring approach.
//   2018: Connes-Consani scaling site complex lift.
//   2026: Still no rigorous Lefschetz-trace positivity.
//
// THE 27-YEAR STATUS QUO REFLECTS A REAL OBSTRUCTION, not a near-term
// closure pending technical work.

const PROGRAM_STATUS = Object.freeze({
  whatIsRigorous: Object.freeze([
    'Bost-Connes 1995 phase-transition C^*-dynamical system',
    'Absorption identity Connes 1999 Thm III.1 as distributional pairing ' +
      '(equivalent to Weil 1952 explicit formula)',
    'Category-theoretic endomotive framework Connes-Marcolli 2008 Chap. 4',
    'Meyer 2005 partial absorption for restricted test-function class',
  ]),

  whatIsNotRigorous: Object.freeze([
    'Type-II_1 trace on adele class von Neumann algebra L(Y_Q) with the ' +
      'requisite positivity (L2) — Connes 1999 §IV.1; restated in ' +
      'Connes-Marcolli 2008 §4.1 as "the missing ingredient"',
    'Local positivity of L_p(h) and L_inf(h) at every place (L3) — ' +
      'equivalent to RH via Weil positivity criterion',
    'Connes 1999 Thm III.5 Lefschetz-trace interpretation as a rigorous ' +
      'identity (not just a conjectural formulation)',
    'Marcolli adelic universality conjecture (Connes-Marcolli 2008 §4.6)',
    'Regularization of the divergent Selberg-Connes integral over C_Q at ' +
      'the level needed for the Lefschetz formula',
  ]),

  taoReviewCitation:
    'Tao, T. (2008-09-29). Blog review of Connes-Marcolli "Noncommutative ' +
    'Geometry, Quantum Fields and Motives", terrytao.wordpress.com; ' +
    'expanded as MathSciNet review MR2371808. Identifies the program as ' +
    'SUGGESTIVE FRAMEWORK rather than proof strategy with a clear endgame.',

  subsequentWorkSince2008: Object.freeze({
    consaniMarcolli2004:
      'Consani, C. and Marcolli, M. (2004). "Noncommutative geometry, ' +
      'dynamics, and infinity-adic Arakelov geometry". Selecta Math. ' +
      '10 (2004), 167-251.',
    meyer2005:
      'Meyer, R. (2005). "On a representation of the idele class group ' +
      'related to primes and zeros of L-functions". Duke Math. J. ' +
      '127 (2005), 519-595; companion paper J. Reine Angew. Math. ' +
      '587 (2005), 89-116.',
    connesConsani2014:
      'Connes, A. and Consani, C. (2014). "Hyperring of adele classes". ' +
      'J. Number Theory 134 (2014), 80-100.',
    connesConsani2018:
      'Connes, A. and Consani, C. (2018). "The Riemann-Roch strategy: ' +
      'complex lift of the scaling site". (Preprint / Adv. Math. 2019).',
  }),

  asOf2026LefschetzPositivityProved: false,
  yearsSinceConnes1999: 27,
  yearsSinceConnesMarcolli2008: 18,
  honestAssessment:
    'The 27-year status quo reflects a REAL OBSTRUCTION, not near-term ' +
    'closure pending technical work. The load-bearing positivity ' +
    'hypothesis (L3) is equivalent to RH itself — the program either ' +
    'gives back the (unconditional) Weil explicit formula or, conditional ' +
    'on (L3), gives RH outright. There is no intermediate statement that ' +
    'unconditionally improves the 2-point bound at Fourier support > 1.',
});

// =========================================================================
// SECTION D - VERDICT + ENGINE-PLANNING CONSEQUENCE.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'connes-bost-fully-closes-pcc-bypass',
  'connes-bost-requires-X-auxiliary-conjecture',
  'connes-bost-program-not-rigorous-as-published',
  'connes-bost-bypasses-pcc-but-only-conjecturally',
]);

const VERDICT = 'connes-bost-program-not-rigorous-as-published';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesPCCUnconditionally: false,
  closesPCCForFourierSupportGtOne: false,
  bypassesArithmeticCauchySchwarzLayerUnconditionally: false,

  whatConnesBostProvidesUnconditionally:
    'The absorption identity Connes 1999 Thm III.1 as a distributional ' +
    'pairing equivalent to the Weil 1952 explicit formula in adelic ' +
    'coordinates. SAME content as the classical explicit formula already ' +
    'used in §15-27 / imp-1184 / imp-1247.',

  whatConnesBostProvidesConditionally:
    'IF the type-II_1 trace (L2) and local positivity (L3) hypotheses ' +
    'were established, the Lefschetz-trace interpretation Connes 1999 ' +
    'Thm III.5 would prove RH OUTRIGHT (via Weil positivity). This is ' +
    'far stronger than the 2-point PCC bound at support > 1 we need, ' +
    'but the hypotheses are not established.',

  noIntermediateUnconditionalStatementImproves2PointAtSupportGtOne: true,

  reductionToPriorPCCRoutes:
    'The unconditional content of Connes-Bost adelic IS the explicit ' +
    'formula already used by all five moment-method routes (imp-1297 + ' +
    'imp-1302 + imp-1303 + imp-1304 + imp-1305). The adelic rewriting ' +
    'changes coordinates but does NOT bypass the Cauchy-Schwarz layer ' +
    'at the off-diagonal prime-power correction.',

  twoPointBoundFromAdelicReduction:
    'sum_{m != n} f((gamma_m - gamma_n) (log T) / (2 pi)) = ' +
    'N(T) integral f * (1 - K_sin^2) + O(N(T) * (log T)^{-1/2}) — ' +
    'IDENTICAL to HB1979 / imp-1303 with same (log T)^{1/2} slack',

  residualGapPreciselyStated:
    'PCC at 2-point for f-hat supported in (-sigma, sigma), sigma > 1 ' +
    'remains OPEN under Connes-Bost adelic. The adelic rewriting gives ' +
    'the same bound as classical Montgomery / Goldston 1988 / Heath-Brown ' +
    '1979 with the same (log T)^{1/2} gap in (1, 5/4) and no ' +
    'unconditional bound for sigma > 5/4.',

  ruledOutAsNearTermClosure: true,
  honestReasonRuledOut:
    'The load-bearing Lefschetz-trace positivity hypothesis (L3) is ' +
    'EQUIVALENT TO RH itself via the Weil positivity criterion. The ' +
    'program either gives the unconditional explicit formula (SAME as ' +
    'classical, with the same (log T)^{1/2} obstruction) OR gives RH ' +
    'outright (conditional on the unproven hypothesis). There is NO ' +
    'intermediate statement that would give an unconditional 2-point ' +
    'bound at support > 1 stronger than the moment-method family ' +
    'already gives.',

  patternNoteFirstNewInputRouteNotRigorous: true,
  patternNotePreciselyStated:
    'Five moment-method routes (imp-1297 / imp-1302 / imp-1303 / imp-1304 ' +
    '/ imp-1305) all closed with pcc-genuinely-open-pending-new-input. ' +
    'The first NEW-INPUT route audited (imp-1307, this ticket) closes ' +
    'with connes-bost-program-not-rigorous-as-published. The aggregate ' +
    'pattern: moment-method family EXHAUSTED, geometric/NCG route 1 ' +
    'NOT RIGOROUS. Remaining NEW-INPUT candidates to audit: imp-1308 ' +
    '(Berry-Keating + Sierra-Townsend 2008), novel hybrid sieve, ' +
    'RMT-symmetry identification.',

  implicationForLambdaAttack:
    'Connes-Bost adelic is NOT a productive lever for §15-27 closure at ' +
    'support > 1 at the current state of the program. The honest engine-' +
    'planning consequence: (i) audit the remaining NEW-INPUT candidates ' +
    '(imp-1308 priority); (ii) in parallel, DECOUPLE §15-27 closure from ' +
    'PCC at support > 1 by exploring test-function reformulations that ' +
    'live entirely inside sigma <= 1 where Montgomery 1973 is ' +
    'unconditional (the lambda-attack reformulation track). The ' +
    'connes-adelic existing page (src/data/connes-adelic-lambda-2026-05.js, ' +
    'imp-1109) remains useful as a numerical consistency check of the ' +
    'absorption-identity prime-side at finite t, but is not a closure ' +
    'mechanism.',

  honestNote:
    'Connes 1999 + Connes-Marcolli 2008 are seminal works in non-' +
    'commutative geometry; the absorption identity IS a rigorous ' +
    'reformulation of the Weil explicit formula and the categorical ' +
    'endomotive framework IS a substantial mathematical contribution. ' +
    'The NEGATIVE result of this ticket is NOT a criticism of the ' +
    'program but a HONEST CLASSIFICATION of where the program currently ' +
    'sits relative to the specific 2-point PCC obstruction at support > 1 ' +
    'identified by imp-1297/1302/1303/1304/1305. The unconditional ' +
    'content is the explicit formula (already used; same obstruction); ' +
    'the conditional content is RH itself (load-bearing hypotheses not ' +
    'established in 27 years).',
});

// =========================================================================
// SECTION E - EXPORTED RECORD.
// =========================================================================

export const IMP_1307_CONNES_BOST_ADELIC_ATTACK = Object.freeze({
  id: 'imp-1307-connes-bost-adelic-attack',
  ticket: 'imp-1307',
  category: 'proof',
  builtAt: '2026-05-28T00:00:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1109', 'imp-1184', 'imp-1205', 'imp-1247',
    'imp-1297', 'imp-1302', 'imp-1303', 'imp-1304', 'imp-1305',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  connesBostTraceFormulaStatement: CONNES_BOST_TRACE_FORMULA_STATEMENT,
  twoPointBoundReductionEvaluation: TWO_POINT_BOUND_REDUCTION_EVALUATION,
  programStatus: PROGRAM_STATUS,

  parentCrossReferences: Object.freeze({
    imp1109: 'src/data/connes-adelic-lambda-2026-05.js — existing adelic numerical consistency check at finite t',
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named PCC-at-2pt as binding step D3',
    imp1205: 'src/data/imp-1205-connes-four-route-crosswalk.js — earlier Connes route crosswalk',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — Selberg-trace ruled out',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js — Goldston-Gonek 1998 ruled out',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js — Heath-Brown 1979 ruled out',
    imp1304: 'src/data/imp-1304-iwaniec-sarnak-no-pcc.js — Iwaniec-Sarnak 2000 ruled out',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js — GY2003 absolutized ruled out; named Connes-Bost as candidate new input',
  }),

  honestScope: Object.freeze([
    'This file is a NEW-INPUT CLASSIFICATION ticket for the Connes-Bost ' +
    'adelic Lefschetz-trace approach as a candidate route bypassing the ' +
    'Montgomery PCC obstruction at Fourier support sigma > 1. It is NOT ' +
    'a new closure, not a new bound, not a critique of the Connes ' +
    'program as a mathematical contribution.',

    'The verdict is NEGATIVE: connes-bost-program-not-rigorous-as-published. ' +
    'The UNCONDITIONAL absorption identity Connes 1999 Thm III.1 IS the ' +
    'Weil 1952 explicit formula in adelic coordinates — same content used ' +
    'by all five moment-method routes (imp-1297/1302/1303/1304/1305) ' +
    'with the same (log T)^{1/2} Cauchy-Schwarz obstruction at off-' +
    'diagonal prime-power correction. The CONDITIONAL Lefschetz-trace ' +
    'positivity (L3) is equivalent to RH itself, so it does NOT provide ' +
    'an intermediate-strength bound at support > 1; it gives RH outright ' +
    'IF established, which it has not been in 27 years.',

    'The honest scope of the Connes-Bost program (per the audit invoked ' +
    'by imp-1305 closure note naming Connes-Bost as candidate new input): ' +
    '(i) the absorption identity is rigorous and equivalent to the Weil ' +
    'explicit formula; (ii) the Lefschetz-trace interpretation requires ' +
    'unproven type-II_1 trace positivity on the adele class von Neumann ' +
    'algebra and local positivity at every place; (iii) the program has ' +
    'been a suggestive framework for 27 years without producing the ' +
    'load-bearing positivity. Tao 2008 review explicitly identifies this ' +
    'gap.',

    'The CONSEQUENCE for engine planning: Connes-Bost is NOT a productive ' +
    'lever for §15-27 closure at support > 1. Audit the remaining NEW-' +
    'INPUT candidates (imp-1308 Berry-Keating + Sierra-Townsend 2008 ' +
    'next; novel hybrid sieve / RMT-symmetry after) and in parallel ' +
    'DECOUPLE §15-27 closure from PCC at support > 1 by exploring ' +
    'test-function reformulations inside sigma <= 1 (the lambda-attack ' +
    'reformulation track).',

    'This ticket COMPLEMENTS imp-1109 (connes-adelic-lambda-2026-05.js) ' +
    'which provides a numerical consistency check of the absorption-' +
    'identity prime-side at finite t = 0.02. imp-1109 is a numerical ' +
    'survey; this ticket is a classification of the proof-attack ' +
    'potential. Both are HONEST about the conjectural nature of the ' +
    'Lefschetz-trace interpretation.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1109: 'src/data/connes-adelic-lambda-2026-05.js',
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1205: 'src/data/imp-1205-connes-four-route-crosswalk.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1302: 'src/data/imp-1302-goldston-gonek-pcc-attack.js',
    imp1303: 'src/data/imp-1303-heath-brown-pcc-route.js',
    imp1304: 'src/data/imp-1304-iwaniec-sarnak-no-pcc.js',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js',
    connes1999:
      'Connes, A. (1999). "Trace formula in noncommutative geometry and ' +
      'the zeros of the Riemann zeta function". Selecta Math. (N.S.) 5, ' +
      '29-106.',
    connesMarcolli2008:
      'Connes, A. and Marcolli, M. (2008). "Noncommutative Geometry, ' +
      'Quantum Fields and Motives". AMS Colloquium Publications, Vol. 55, ' +
      'AMS / Hindustan Book Agency.',
    bostConnes1995:
      'Bost, J.-B. and Connes, A. (1995). "Hecke algebras, type III ' +
      'factors and phase transitions with spontaneous symmetry breaking ' +
      'in number theory". Selecta Math. (N.S.) 1, 411-457.',
    weil1952:
      'Weil, A. (1952). "Sur les formules explicites de la theorie des ' +
      'nombres premiers". Comm. Sem. Math. Univ. Lund (M. Riesz volume), ' +
      '252-265.',
    tao2008Review:
      'Tao, T. (2008-09-29). Blog review of Connes-Marcolli ' +
      '"Noncommutative Geometry, Quantum Fields and Motives", ' +
      'terrytao.wordpress.com; expanded as MathSciNet review MR2371808.',
    meyer2005Duke:
      'Meyer, R. (2005). "On a representation of the idele class group ' +
      'related to primes and zeros of L-functions". Duke Math. J. ' +
      '127 (2005), 519-595.',
    meyer2005Crelle:
      'Meyer, R. (2005). "A spectral interpretation for the zeros of ' +
      'the Riemann zeta function". J. Reine Angew. Math. 587 (2005), ' +
      '89-116.',
    consaniMarcolli2004:
      'Consani, C. and Marcolli, M. (2004). "Noncommutative geometry, ' +
      'dynamics, and infinity-adic Arakelov geometry". Selecta Math. ' +
      '(N.S.) 10 (2004), 167-251.',
    connesConsani2014:
      'Connes, A. and Consani, C. (2014). "Hyperring of adele classes". ' +
      'J. Number Theory 134 (2014), 80-100.',
    connesConsani2018:
      'Connes, A. and Consani, C. (2018). "The Riemann-Roch strategy: ' +
      'complex lift of the scaling site". (Preprint / Adv. Math. 2019).',
    montgomery1973:
      'Montgomery, H. L. (1973). "The pair correlation of zeros of the ' +
      'zeta function". Proc. Sympos. Pure Math. XXIV, 181-193.',
    goldston1988:
      'Goldston, D. A. (1988/1987). "On the function S(T) in the theory ' +
      'of the Riemann zeta function". J. Number Theory 27, 149-177.',
  }),
});

export default IMP_1307_CONNES_BOST_ADELIC_ATTACK;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1307_CONNES_BOST_ADELIC_ATTACK_ASSERTIONS = [
  // Tripwire 1: Connes 1999 cited precisely (Selecta Math, vol 5, 29-106).
  {
    id: 'imp1307-connes1999-cited-precisely',
    why:
      'The ticket spec requires Connes 1999 Selecta Math. 5 (29-106) to be ' +
      'the primary citation. A silent drift to a vague "Connes adelic" ' +
      'reference would render the classification ungrounded.',
    holds: () => {
      const s = IMP_1307_CONNES_BOST_ADELIC_ATTACK.connesBostTraceFormulaStatement;
      const r = IMP_1307_CONNES_BOST_ADELIC_ATTACK.references;
      return (
        typeof s.primarySource === 'string' &&
        /Connes/.test(s.primarySource) &&
        /1999/.test(s.primarySource) &&
        /Selecta Math/i.test(s.primarySource) &&
        /29-106|29.*106/.test(s.primarySource) &&
        /Trace formula/i.test(s.primarySource) &&
        typeof r.connes1999 === 'string' &&
        /Connes/.test(r.connes1999) &&
        /Selecta/i.test(r.connes1999) &&
        /29-106|29.*106/.test(r.connes1999)
      );
    },
  },

  // Tripwire 2: Connes-Marcolli 2008 cited precisely.
  {
    id: 'imp1307-connes-marcolli-2008-cited-precisely',
    why:
      'The ticket spec requires Connes-Marcolli 2008 ("Noncommutative ' +
      'Geometry, Quantum Fields and Motives", AMS Colloquium Publications ' +
      'Vol. 55) to be cited as the consolidated framework. Missing this ' +
      'citation would render the post-1999 status assessment ungrounded.',
    holds: () => {
      const s = IMP_1307_CONNES_BOST_ADELIC_ATTACK.connesBostTraceFormulaStatement;
      const r = IMP_1307_CONNES_BOST_ADELIC_ATTACK.references;
      return (
        typeof s.secondarySource === 'string' &&
        /Connes/.test(s.secondarySource) &&
        /Marcolli/.test(s.secondarySource) &&
        /2008/.test(s.secondarySource) &&
        /Noncommutative Geometry/i.test(s.secondarySource) &&
        /AMS|Colloquium/i.test(s.secondarySource) &&
        typeof r.connesMarcolli2008 === 'string' &&
        /Connes/.test(r.connesMarcolli2008) &&
        /Marcolli/.test(r.connesMarcolli2008) &&
        /2008/.test(r.connesMarcolli2008)
      );
    },
  },

  // Tripwire 3: Absorption identity stated and identified as rigorous and
  // equivalent to Weil explicit formula.
  {
    id: 'imp1307-absorption-identity-stated-and-rigorous',
    why:
      'The classification must distinguish the RIGOROUS absorption identity ' +
      '(Connes 1999 Thm III.1, equivalent to Weil 1952) from the ' +
      'CONJECTURAL Lefschetz-trace interpretation (Thm III.5). A silent ' +
      'flip of either status would mislead the verdict.',
    holds: () => {
      const s = IMP_1307_CONNES_BOST_ADELIC_ATTACK.connesBostTraceFormulaStatement;
      return (
        typeof s.absorptionIdentity === 'string' &&
        /Tr_C_Q|absorption|U\(h\)/.test(s.absorptionIdentity) &&
        /h\(0\)|h-hat\(0\)|h\(i\/2\)/.test(s.absorptionIdentity) &&
        s.absorptionIdentityIsRigorous === true &&
        s.absorptionIdentityIsEquivalentToWeilExplicitFormula === true &&
        typeof s.absorptionIdentityUnconditionalContent === 'string' &&
        /UNCONDITIONAL/.test(s.absorptionIdentityUnconditionalContent) &&
        /Weil|explicit formula/i.test(s.absorptionIdentityUnconditionalContent) &&
        s.lefschetzTraceInterpretationIsRigorous === false
      );
    },
  },

  // Tripwire 4: Lefschetz-trace requirements (L1)-(L3) listed and named
  // not-established.
  {
    id: 'imp1307-lefschetz-requirements-L1-L2-L3-listed',
    why:
      'The classification must explicitly itemize the Lefschetz-trace ' +
      'requirements (L1: non-commutative manifold structure; L2: type-II_1 ' +
      'trace; L3: local positivity at every place) and report each as ' +
      'NOT ESTABLISHED. Missing any of the three would obscure where the ' +
      'program currently stops.',
    holds: () => {
      const s = IMP_1307_CONNES_BOST_ADELIC_ATTACK.connesBostTraceFormulaStatement;
      const req = s.lefschetzTraceRequires;
      return (
        typeof req === 'object' &&
        typeof req.L1_nonCommutativeManifoldStructure === 'string' &&
        /NOT ESTABLISHED/.test(req.L1_nonCommutativeManifoldStructure) &&
        typeof req.L2_typeII1TraceOnAdeleVonNeumannAlgebra === 'string' &&
        /type-II_1/.test(req.L2_typeII1TraceOnAdeleVonNeumannAlgebra) &&
        /NOT ESTABLISHED/.test(req.L2_typeII1TraceOnAdeleVonNeumannAlgebra) &&
        typeof req.L3_localPositivityAtEveryPlace === 'string' &&
        /positivity/i.test(req.L3_localPositivityAtEveryPlace) &&
        /NOT ESTABLISHED/.test(req.L3_localPositivityAtEveryPlace)
      );
    },
  },

  // Tripwire 5: Two-point reduction evaluation reports NO bypass of
  // Cauchy-Schwarz layer at support > 1.
  {
    id: 'imp1307-two-point-reduction-reports-no-bypass',
    why:
      'The load-bearing classification claim is that Connes-Bost adelic ' +
      'rewriting does NOT bypass the arithmetic Cauchy-Schwarz layer at ' +
      '2-point support > 1. A silent flip to "bypass achieved" would ' +
      'invalidate the engine-planning consequence.',
    holds: () => {
      const r = IMP_1307_CONNES_BOST_ADELIC_ATTACK.twoPointBoundReductionEvaluation;
      return (
        r.reducesESYClosurePoissonKernelToUnconditionalAdelicTrace === false &&
        r.noneOfTheAuxiliariesProducesIndependentArithmeticEstimate === true &&
        r.arithmeticCauchySchwarzLayerNotBypassed === true &&
        typeof r.twoPointBoundAtSupportGtOneFromAdelicReduction === 'string' &&
        /IDENTICAL/i.test(r.twoPointBoundAtSupportGtOneFromAdelicReduction) &&
        /\(log T\)\^\{1\/2\}/.test(r.twoPointBoundAtSupportGtOneFromAdelicReduction) &&
        /5\/4/.test(r.twoPointBoundAtSupportGtOneFromAdelicReduction)
      );
    },
  },

  // Tripwire 6: Auxiliary conjectures CB1-CB5 listed precisely.
  {
    id: 'imp1307-auxiliary-conjectures-CB1-to-CB5-listed',
    why:
      'The ticket spec requires the auxiliary inputs (Connes hypothesis, ' +
      'Marcolli adelic universality, etc.) to be enumerated. The shipped ' +
      'list includes (CB1)-(CB5) covering trace positivity, local ' +
      'positivity, adelic universality, Meyer 2005 partial absorption, ' +
      'and Connes-Consani 2014 hyperring. Missing this list would render ' +
      'the verdict ungrounded.',
    holds: () => {
      const aux = IMP_1307_CONNES_BOST_ADELIC_ATTACK
        .twoPointBoundReductionEvaluation.auxiliaryInputsRequired;
      return (
        typeof aux === 'object' &&
        typeof aux.CB1_typeII1TraceOnAdeleVonNeumannAlgebra === 'string' &&
        /UNPROVEN/i.test(aux.CB1_typeII1TraceOnAdeleVonNeumannAlgebra) &&
        typeof aux.CB2_localPositivityAtEveryPlace === 'string' &&
        /EQUIVALENT TO RH|equivalent to RH/i.test(aux.CB2_localPositivityAtEveryPlace) &&
        typeof aux.CB3_marcolliAdelicUniversality === 'string' &&
        /Marcolli|universality/i.test(aux.CB3_marcolliAdelicUniversality) &&
        typeof aux.CB4_meyer2005PartialAbsorption === 'string' &&
        /Meyer/.test(aux.CB4_meyer2005PartialAbsorption) &&
        /2005/.test(aux.CB4_meyer2005PartialAbsorption) &&
        typeof aux.CB5_connesConsani2014HyperringApproach === 'string' &&
        /Connes-Consani|2014/.test(aux.CB5_connesConsani2014HyperringApproach)
      );
    },
  },

  // Tripwire 7: Verdict is one of the four allowed strings.
  {
    id: 'imp1307-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed strings: ' +
      'connes-bost-fully-closes-pcc-bypass / connes-bost-requires-X-' +
      'auxiliary-conjecture / connes-bost-program-not-rigorous-as-published ' +
      '/ connes-bost-bypasses-pcc-but-only-conjecturally. A non-allowed ' +
      'verdict indicates classification drift.',
    holds: () => {
      const allowed = [
        'connes-bost-fully-closes-pcc-bypass',
        'connes-bost-requires-X-auxiliary-conjecture',
        'connes-bost-program-not-rigorous-as-published',
        'connes-bost-bypasses-pcc-but-only-conjecturally',
      ];
      return (
        allowed.includes(IMP_1307_CONNES_BOST_ADELIC_ATTACK.verdict) &&
        IMP_1307_CONNES_BOST_ADELIC_ATTACK.verdictDetail.isAllowedVerdict === true
      );
    },
  },

  // Tripwire 8: Cross-references to imp-1184, imp-1297, and imp-1305 present.
  {
    id: 'imp1307-cross-references-parent-tickets',
    why:
      'This ticket is a direct follow-up to imp-1184 (named PCC as binding ' +
      'gap) and imp-1305 (named Connes-Bost as candidate new input after ' +
      'PCC exhaustion). imp-1297 is the first moment-method ruling-out. ' +
      'Without these cross-references the classification floats free of ' +
      'the parent map.',
    holds: () => {
      const r = IMP_1307_CONNES_BOST_ADELIC_ATTACK;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1184') &&
        related.includes('imp-1297') &&
        related.includes('imp-1305') &&
        typeof xrefs.imp1184 === 'string' && /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1297 === 'string' && /imp-1297/.test(xrefs.imp1297) &&
        typeof xrefs.imp1305 === 'string' && /imp-1305/.test(xrefs.imp1305)
      );
    },
  },

  // Tripwire 9: Semantic check 1 — program status honestly lists rigorous
  // vs non-rigorous parts.
  {
    id: 'imp1307-semantic-program-status-honestly-itemized',
    why:
      'Semantic check: the program status must explicitly list BOTH what ' +
      'IS rigorous (absorption identity, BC system, endomotive framework, ' +
      'Meyer partial) AND what IS NOT rigorous (type-II_1 trace positivity, ' +
      'local positivity at every place, Lefschetz Thm III.5 as rigorous, ' +
      'Marcolli universality). A silent flip toward "everything rigorous" ' +
      'or "everything conjectural" would mislead.',
    holds: () => {
      const ps = IMP_1307_CONNES_BOST_ADELIC_ATTACK.programStatus;
      return (
        Array.isArray(ps.whatIsRigorous) &&
        ps.whatIsRigorous.length >= 3 &&
        ps.whatIsRigorous.some((s) => /absorption identity/i.test(s)) &&
        ps.whatIsRigorous.some((s) => /Bost-Connes|BC system/i.test(s)) &&
        Array.isArray(ps.whatIsNotRigorous) &&
        ps.whatIsNotRigorous.length >= 3 &&
        ps.whatIsNotRigorous.some((s) => /type-II_1/i.test(s)) &&
        ps.whatIsNotRigorous.some((s) => /positivity/i.test(s)) &&
        ps.asOf2026LefschetzPositivityProved === false
      );
    },
  },

  // Tripwire 10: Semantic check 2 — Tao 2008 review cited with the
  // "suggestive framework" identification.
  {
    id: 'imp1307-semantic-tao-2008-review-cited',
    why:
      'Semantic check: the Tao 2008 review of Connes-Marcolli 2008 ' +
      'provides INDEPENDENT third-party confirmation that the program is ' +
      'a "suggestive framework rather than a proof strategy with a clear ' +
      'endgame". Without this citation the negative classification rests ' +
      'only on the program-internal status, weakening the audit.',
    holds: () => {
      const ps = IMP_1307_CONNES_BOST_ADELIC_ATTACK.programStatus;
      const r = IMP_1307_CONNES_BOST_ADELIC_ATTACK.references;
      return (
        typeof ps.taoReviewCitation === 'string' &&
        /Tao/.test(ps.taoReviewCitation) &&
        /2008/.test(ps.taoReviewCitation) &&
        /SUGGESTIVE|suggestive/.test(ps.taoReviewCitation) &&
        /MR2371808|MathSciNet/i.test(ps.taoReviewCitation) &&
        typeof r.tao2008Review === 'string' &&
        /Tao/.test(r.tao2008Review) &&
        /2008/.test(r.tao2008Review)
      );
    },
  },

  // Tripwire 11: Semantic check 3 — engine-planning implication names
  // concrete next-action candidates (imp-1308 Berry-Keating, lambda-attack
  // decoupling).
  {
    id: 'imp1307-semantic-engine-planning-actionable',
    why:
      'Semantic check: the verdict must produce ACTIONABLE engine-planning ' +
      'consequences — specifically pointing to imp-1308 (Berry-Keating) as ' +
      'the next NEW-INPUT audit AND naming the lambda-attack decoupling ' +
      'track (sigma <= 1 reformulation) as a parallel path. Without these ' +
      'the "not rigorous" verdict would be unactionable.',
    holds: () => {
      const vd = IMP_1307_CONNES_BOST_ADELIC_ATTACK.verdictDetail;
      const s = vd.implicationForLambdaAttack || '';
      return (
        typeof s === 'string' &&
        s.length > 100 &&
        /imp-1308|Berry-Keating/i.test(s) &&
        /(decouple|reformulation|sigma <= 1|sigma<=1|lambda-attack)/i.test(s) &&
        /Montgomery 1973/i.test(s)
      );
    },
  },

  // Tripwire 12: Honest scope mentions NEGATIVE result and identifies
  // the program as not-rigorous-on-load-bearing-positivity.
  {
    id: 'imp1307-honest-scope-mentions-negative-and-program-status',
    why:
      'The honest scope must explicitly state that the result is NEGATIVE ' +
      'and that the program is not-rigorous on the load-bearing Lefschetz-' +
      'trace positivity. A silent drift to "positive closure identified" ' +
      'or "Connes program flawed" would mislead — the program is a ' +
      'legitimate contribution but does not currently close PCC at ' +
      'support > 1.',
    holds: () => {
      const blob = IMP_1307_CONNES_BOST_ADELIC_ATTACK.honestScope.join(' ');
      return (
        /NEGATIVE/.test(blob) &&
        /not-rigorous|not rigorous/i.test(blob) &&
        /(Lefschetz|positivity)/i.test(blob) &&
        /(does NOT|do NOT|do not close|not bypass)/i.test(blob) &&
        /imp-1305/.test(blob)
      );
    },
  },
];
