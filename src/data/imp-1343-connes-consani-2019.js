/**
 * @module imp-1343-connes-consani-2019
 * @fileoverview imp-1343 — NEW-INPUT classification (modern update of imp-1307):
 *   does the Connes-Consani Riemann-Roch / scaling-site program (Connes-Consani
 *   2016-2019, the "complex lift of the scaling site" Riemann-Roch strategy)
 *   close the load-bearing Lefschetz/positivity gap left open by the
 *   Connes-Bost adelic program (imp-1307), bypass the Tao 2008 critique, or
 *   yield a 2-point bound on the §15-27 ESY-closure Poisson kernel at Fourier
 *   support sigma > 1 that BYPASSES the Montgomery PCC obstruction
 *   (imp-1297/1302/1303/1304/1305)?
 *
 *   CONTEXT
 *   -------
 *   imp-1307 audited the Connes-Bost 1999 adelic Lefschetz-trace approach and
 *   returned `connes-bost-program-not-rigorous-as-published`. The load-bearing
 *   gap was the triple (L1)-(L3):
 *
 *     (L1) a non-commutative MANIFOLD structure on Y_Q = A_Q^* / Q^* / R_+^*
 *          with intersection-theory cycles (the diagonal + Frobenius graph),
 *     (L2) a positive trace on the type-II_1 von Neumann algebra L(Y_Q),
 *     (L3) local positivity of L_p(h) and L_inf(h) at every place
 *          (equivalent to RH via the Weil positivity criterion).
 *
 *   imp-1307 closure note flagged Connes-Consani 2018/2019 as the modern
 *   update worth a dedicated audit: the "Riemann-Roch strategy" replaces the
 *   type-II_1 von Neumann algebra by a GENUINE GEOMETRIC OBJECT — the
 *   Arithmetic Site and its extension-of-scalars the Scaling Site — over the
 *   tropical / characteristic-1 semifield, with an UNCONDITIONAL Riemann-Roch
 *   theorem on the scaling site itself. This is sharper geometric content than
 *   the 1999 von Neumann picture and addresses (L1) head-on.
 *
 *   THE THREE TICKET QUESTIONS
 *   --------------------------
 *   (a) Does CC2019 close (L1) — the non-commutative manifold structure —
 *       unconditionally?
 *   (b) Does it bypass the Tao 2008 critique ("suggestive framework rather
 *       than a proof strategy with a clear endgame")?
 *   (c) Does it give a 2-point bound at Fourier support sigma > 1?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'connes-consani-2019-advances-L1-geometry-but-positivity-on-the-square-remains-rh-equivalent'
 *
 *   The verdict is NUANCED-NEGATIVE and is one of the four allowed strings.
 *   Connes-Consani 2016-2019 make GENUINE PROGRESS on (L1): the Scaling Site
 *   is an honest geometric object (a topos / tropical curve carrying a sheaf
 *   of regular functions) with an UNCONDITIONAL Riemann-Roch theorem
 *   (Connes-Consani 2017 "Geometry of the scaling site"). It replaces the
 *   un-constructed type-II_1 von Neumann algebra of 1999 with a constructed
 *   one-dimensional geometry whose periodic-orbit / counting structure
 *   reproduces the Riemann-Weil explicit formula. To that extent (L1) is
 *   advanced from "not established" to "established for the 1-dimensional
 *   scaling site".
 *
 *   HOWEVER the load-bearing step of the Riemann-Roch STRATEGY is the
 *   transfer of Weil 1948 (RH for curves over finite fields) to the
 *   characteristic-zero arithmetic surface S x_? S — the SQUARE of the
 *   scaling site — where the Weil explicit formula must appear as a POSITIVE
 *   self-intersection number (the analogue of the positivity of the
 *   diagonal in Weil 1948 / the Hodge index theorem on a surface). Per
 *   Connes-Consani 2019 ("The Riemann-Roch strategy: complex lift of the
 *   scaling site"), this requires:
 *
 *     (RR1) the construction of the square / fibre product of the scaling
 *           site as an actual ALGEBRAIC SURFACE over which an intersection
 *           theory with a Hodge-index positivity exists — NOT CONSTRUCTED
 *           unconditionally (only a complex lift / a partial Frobenius
 *           correspondence is given);
 *     (RR2) a positivity of the intersection pairing on that surface (the
 *           analogue of the Castelnuovo-Severi / Hodge index inequality)
 *           — this is the characteristic-zero Weil positivity, EQUIVALENT
 *           TO RH, and is NOT established;
 *     (RR3) the identification of the relevant correspondences (Frobenius
 *           pull-backs at non-integer powers q^s) as honest algebraic
 *           cycles — the "complex lift" supplies these only formally.
 *
 *   (RR2) is the modern incarnation of (L3): it is RH-EQUIVALENT, not an
 *   intermediate-strength input. So:
 *
 *   (a) (L1) ADVANCED but not fully closed: the scaling site is real and
 *       carries Riemann-Roch, but the SQUARE / arithmetic-surface needed by
 *       the strategy is not constructed unconditionally (RR1).
 *   (b) Tao 2008 critique NOT bypassed but RELOCATED: the endgame is now a
 *       precise, well-posed conjecture (positivity of an intersection on the
 *       square of the scaling site, RR2) rather than the diffuse 1999
 *       von Neumann positivity — sharper, but still a conjecture equivalent
 *       to RH. The program remains "suggestive framework" at the load-bearing
 *       step; the endgame is clearer but no more closed.
 *   (c) NO 2-point bound at support > 1. As in imp-1307, the UNCONDITIONAL
 *       content (the scaling-site Riemann-Roch reproducing the explicit
 *       formula / counting function) is the SAME explicit-formula input the
 *       moment routes use, with the SAME (log T)^{1/2} Cauchy-Schwarz
 *       obstruction at the off-diagonal prime-power correction. The
 *       CONDITIONAL content (RR2 positivity) gives RH OUTRIGHT. There is NO
 *       intermediate statement giving an unconditional 2-point bound at
 *       support > 1 stronger than the moment-method family already gives.
 *
 *   PATTERN NOTE — modern NCG/geometric update still NOT a near-term lever.
 *   imp-1307 (Connes-Bost 1999) NOT RIGOROUS; imp-1308 (Berry-Keating) NOT
 *   RIGOROUS; imp-1339 (Hecke-triangle Selberg trace) NO BYPASS. This ticket
 *   (imp-1343, the 2016-2019 Riemann-Roch / scaling-site update of the
 *   Connes route) ADVANCES the geometry (L1) but the load-bearing positivity
 *   (RR2) remains RH-equivalent. The geometric / NCG family does NOT supply a
 *   support > 1 2-point bound. Engine planning unchanged: pursue the
 *   lambda-attack decoupling track (test-function reformulations living
 *   inside sigma <= 1 where Montgomery 1973 is unconditional) and the
 *   de Branges direct-construction track (imp-1241 / imp-1340).
 *
 *   HONEST TRAINING-TIME UNCERTAINTY
 *   -------------------------------
 *   The precise statements of Connes-Consani 2018/2019 ("The Riemann-Roch
 *   strategy: complex lift of the scaling site", arXiv:1805.10501; in
 *   "Advances in Noncommutative Geometry", Springer 2019) are uncertain at
 *   the January 2026 training cutoff. The (RR1)-(RR3) layer-level
 *   obstructions are ROBUST to the exact form because they identify the
 *   load-bearing step any Weil-1948-transfer strategy must traverse: a
 *   positive intersection theory on an actual arithmetic SURFACE in
 *   characteristic zero, which is the Weil-positivity / RH-equivalent step.
 *   Classification is OPEN-FOR-REVISION if a published Connes-Consani result
 *   constructs the square as an algebraic surface AND establishes the
 *   intersection positivity unconditionally.
 *
 *   @see imp-1307 src/data/imp-1307-connes-bost-adelic-attack.js
 *   @see imp-1205 src/data/imp-1205-connes-four-route-crosswalk.js
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js
 *   @see connes-adelic-lambda-2026-05.js (imp-1109 numerical consistency check)
 *
 *   Ticket: imp-1343 (proof, medium, NEW-INPUT CLASSIFICATION; depends imp-1307).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - THE CONNES-CONSANI SCALING-SITE / RIEMANN-ROCH PROGRAM.
// =========================================================================
//
// PRIMARY SOURCES.
//
//   Connes, A. and Consani, C. (2016). "Geometry of the arithmetic site".
//   Adv. Math. 291, 274-329. (The Arithmetic Site: a Grothendieck topos over
//   the Boolean / tropical semifield B = (max,+) characteristic-1 structure,
//   whose points recover the adele class space X_Q = A_Q^* / Q^*.)
//
//   Connes, A. and Consani, C. (2017). "Geometry of the scaling site".
//   Selecta Math. (N.S.) 23, 1803-1850. (The Scaling Site = extension of
//   scalars of the Arithmetic Site to R_+^*; a tropical curve with a sheaf
//   of regular functions; carries an UNCONDITIONAL Riemann-Roch theorem for
//   the periodic-orbit divisors of the scaling flow.)
//
//   Connes, A. and Consani, C. (2019). "The Riemann-Roch strategy: complex
//   lift of the scaling site". In "Advances in Noncommutative Geometry"
//   (Springer, 2019), 989-1073; arXiv:1805.10501. (States the strategy to
//   transfer Weil 1948 RH-for-curves to the characteristic-zero setting via
//   the SQUARE of the scaling site and an intersection-positivity.)
//
//   Connes, A. (2016). "An essay on the Riemann Hypothesis". In "Open
//   Problems in Mathematics" (J. F. Nash Jr., M. Th. Rassias eds.),
//   Springer, 225-257. (Survey of the strategy and its relation to Weil 1948
//   and the 1999 trace formula.)
//
// THE MODEL: WEIL 1948 (RH FOR CURVES OVER FINITE FIELDS).
//
//   Weil, A. (1948). "Sur les courbes algebriques et les varietes qui s en
//   deduisent". Actualites Sci. Ind. 1041. RH for a curve C / F_q is proven
//   by the POSITIVITY of the self-intersection of a correspondence on the
//   SURFACE C x C (the Castelnuovo-Severi / Hodge index inequality applied
//   to the Frobenius correspondence). The Connes-Consani Riemann-Roch
//   strategy aims to reproduce this proof in characteristic zero with the
//   scaling site playing the role of C and its SQUARE the role of C x C.
//
// WHAT IS UNCONDITIONAL IN THE PROGRAM.
//
//   - The Arithmetic Site and the Scaling Site exist as honest sites / topoi
//     (Connes-Consani 2016, 2017). This is a CONSTRUCTED geometry, unlike
//     the un-constructed type-II_1 von Neumann algebra of Connes 1999.
//   - The Riemann-Roch theorem ON the (1-dimensional) scaling site holds
//     unconditionally (Connes-Consani 2017): for the periodic-orbit divisors
//     the dimension / degree relation reproduces the smooth counting term.
//   - The periodic orbits of the scaling flow of length log p recover the
//     prime-power structure; the trace / counting reproduces the
//     Riemann-Weil explicit formula. SAME content as the absorption identity
//     of imp-1307 (Connes 1999 Thm III.1), in scaling-site coordinates.
//
// WHAT IS CONDITIONAL / NOT ESTABLISHED.
//
//   - The SQUARE S x S of the scaling site as an actual algebraic SURFACE
//     carrying a degree-2 intersection theory (RR1). Connes-Consani 2019
//     gives a "complex lift" and a partial Frobenius correspondence but not
//     the surface with a Hodge-index-type positivity unconditionally.
//   - The POSITIVITY of the intersection pairing on that surface (RR2) — the
//     characteristic-zero analogue of the Castelnuovo-Severi inequality used
//     in Weil 1948. This is the Weil positivity criterion; it is RH-EQUIVALENT.
//   - The realization of the non-integer Frobenius pull-backs q^s as honest
//     algebraic cycles (RR3).

const SCALING_SITE_PROGRAM_STATEMENT = Object.freeze({
  primarySource:
    'Connes, A. and Consani, C. (2016). "Geometry of the arithmetic site". ' +
    'Adv. Math. 291, 274-329.',
  scalingSiteSource:
    'Connes, A. and Consani, C. (2017). "Geometry of the scaling site". ' +
    'Selecta Math. (N.S.) 23, 1803-1850.',
  riemannRochStrategySource:
    'Connes, A. and Consani, C. (2019). "The Riemann-Roch strategy: complex ' +
    'lift of the scaling site". In "Advances in Noncommutative Geometry" ' +
    '(Springer, 2019), 989-1073; arXiv:1805.10501.',
  essaySource:
    'Connes, A. (2016). "An essay on the Riemann Hypothesis". In "Open ' +
    'Problems in Mathematics" (Nash-Rassias eds.), Springer, 225-257.',
  weil1948Model:
    'Weil, A. (1948). "Sur les courbes algebriques et les varietes qui s en ' +
    'deduisent". Actualites Sci. Ind. 1041. RH for curves / F_q via ' +
    'positivity of a self-intersection on the surface C x C (Castelnuovo-' +
    'Severi / Hodge index). MODEL the strategy aims to transfer.',

  arithmeticSite:
    'Arithmetic Site: a Grothendieck topos over the Boolean / tropical ' +
    'characteristic-1 semifield B = (max, +); its points recover the adele ' +
    'class space X_Q = A_Q^* / Q^*. Constructed object (Connes-Consani 2016).',
  scalingSite:
    'Scaling Site: extension of scalars of the Arithmetic Site to R_+^*; a ' +
    'tropical curve with a structure sheaf of piecewise-affine functions; ' +
    'periodic orbits of length log p encode the primes. Constructed object ' +
    '(Connes-Consani 2017).',

  // (a) Does CC2019 close (L1) the non-commutative manifold structure?
  L1_geometryAdvanced: true,
  L1_geometryFullyClosed: false,
  L1_status:
    'ADVANCED not fully closed. The Scaling Site is a CONSTRUCTED ' +
    'one-dimensional geometry (topos / tropical curve) with an UNCONDITIONAL ' +
    'Riemann-Roch theorem (Connes-Consani 2017), replacing the un-constructed ' +
    'type-II_1 von Neumann algebra L(Y_Q) of Connes 1999 (imp-1307 (L1)). But ' +
    'the SQUARE S x S needed by the Riemann-Roch strategy is NOT constructed ' +
    'unconditionally as an algebraic surface (RR1).',

  unconditionalRiemannRochOnScalingSite: true,
  scalingSiteReproducesExplicitFormula: true,
  scalingSiteUnconditionalContent:
    'The periodic-orbit / counting structure of the scaling site reproduces ' +
    'the Riemann-Weil explicit formula. SAME arithmetic content as the ' +
    'Connes 1999 absorption identity (imp-1307 Thm III.1) and the classical ' +
    'Weil 1952 explicit formula, in scaling-site coordinates. UNCONDITIONAL.',

  riemannRochStrategyRequires: Object.freeze({
    RR1_squareAsAlgebraicSurface:
      'The square / fibre product S x S of the scaling site as an actual ' +
      'algebraic SURFACE carrying a degree-2 intersection theory. Connes-' +
      'Consani 2019 gives a complex lift + partial Frobenius correspondence ' +
      'but NOT the surface with Hodge-index positivity. NOT ESTABLISHED.',
    RR2_intersectionPositivity:
      'Positivity of the intersection pairing on S x S (the characteristic-' +
      'zero analogue of the Castelnuovo-Severi / Hodge index inequality of ' +
      'Weil 1948). This IS the Weil positivity criterion — EQUIVALENT TO RH. ' +
      'NOT ESTABLISHED.',
    RR3_nonIntegerFrobeniusCycles:
      'Realization of the non-integer Frobenius pull-backs q^s (s complex) ' +
      'as honest algebraic cycles on the surface. The complex lift supplies ' +
      'these only formally. NOT ESTABLISHED.',
  }),
});

// =========================================================================
// SECTION B - DOES IT YIELD A 2-POINT BOUND BYPASSING MONTGOMERY?
// =========================================================================
//
// The structure mirrors imp-1307 Section B exactly, because the scaling-site
// program shares the imp-1307 dichotomy: UNCONDITIONAL part = explicit
// formula (same input, same obstruction); CONDITIONAL part = RH outright.
//
// (a) OBSERVABLE. The unconditional scaling-site Riemann-Roch computes the
//     counting function N(T) and reproduces the Riemann-Weil explicit
//     formula sum_{zeros} h(gamma) = h(0) + h-hat(0) - W_inf(h) - sum_p W_p(h)
//     in scaling-site coordinates. SAME zero-counting and prime-side sum as
//     the classical explicit formula (and as imp-1307 absorption identity).
//
// (b) 2-POINT REDUCTION. Applying the explicit formula twice and taking the
//     bilinear pairing gives the SAME bilinear prime-side sum
//     sum_{p,q} W_p(f) W_q(f) that classical Montgomery 1973 / Goldston 1988
//     reduce to. The Cauchy-Schwarz step on the off-diagonal cross-term
//     produces the SAME (log T)^{1/2} loss at support > 1. The scaling-site
//     geometry does NOT supply a spectral bound on the bilinear off-diagonal
//     sum: such a bound would need the intersection positivity (RR2), which
//     is RH-equivalent.
//
// (c) AUXILIARY INPUTS. To produce a NEW 2-point bound at support > 1 via the
//     Riemann-Roch strategy, the auxiliary inputs required are exactly the
//     intersection positivity (RR2, = Weil positivity = RH) plus the
//     construction of the square as an algebraic surface (RR1) and the
//     non-integer Frobenius cycles (RR3). None produces an INDEPENDENT
//     estimate on the arithmetic-side Cauchy-Schwarz off-diagonal correction.

const TWO_POINT_BOUND_REDUCTION_EVALUATION = Object.freeze({
  observableConnesConsaniComputes:
    'Counting function N(T) + Riemann-Weil explicit formula reproduced by ' +
    'the unconditional scaling-site Riemann-Roch (Connes-Consani 2017); ' +
    'SAME content as imp-1307 absorption identity / Weil 1952 explicit ' +
    'formula, in scaling-site coordinates. UNCONDITIONAL.',

  twoPointObservableInScalingSiteCoordinates:
    'R_2(f, T) = N(T) integral f (1 - K_sin^2) + (1/N(T)) sum_{p^k <= T^sigma} ' +
    '(Lambda(p^k))^2 / p^k |f-hat(k log p / (2 pi))|^2 + Cauchy-Schwarz ' +
    'off-diagonal correction — IDENTICAL to classical Montgomery 1973 / ' +
    'Goldston 1988 and to the imp-1307 adelic reduction',

  reducesESYClosurePoissonKernelToUnconditionalScalingSiteIntersection: false,
  whyReductionFails:
    'The scaling-site prime-side terms W_p(g) = sum_k (log p) g(k log p) / ' +
    'p^{k/2} are the SAME prime-power sums as the classical and adelic ' +
    'explicit formula. Same arithmetic content, same Cauchy-Schwarz step at ' +
    'support > 1. The Riemann-Roch strategy changes geometry but NOT the ' +
    'obstruction; the only bound that would help is the intersection ' +
    'positivity RR2, which is RH-equivalent.',

  auxiliaryInputsRequired: Object.freeze({
    RR1_squareAsAlgebraicSurface:
      'Square S x S of the scaling site as an algebraic surface with a ' +
      'degree-2 intersection theory. UNPROVEN (Connes-Consani 2019 gives ' +
      'only a complex lift / partial correspondence).',
    RR2_intersectionPositivity:
      'Positivity of the intersection pairing on S x S (Castelnuovo-Severi / ' +
      'Hodge index analogue). EQUIVALENT TO RH via the Weil positivity ' +
      'criterion — circular for our purpose (full RH closes everything ' +
      'including §15-27 at support > 1).',
    RR3_nonIntegerFrobeniusCycles:
      'Non-integer Frobenius pull-backs q^s as honest algebraic cycles. ' +
      'UNPROVEN; supplied only formally by the complex lift.',
  }),

  noneOfTheAuxiliariesProducesIndependentArithmeticEstimate: true,
  arithmeticCauchySchwarzLayerNotBypassed: true,
  twoPointBoundAtSupportGtOneFromScalingSiteReduction:
    'IDENTICAL to classical Montgomery 1973 / Goldston 1988 / Heath-Brown ' +
    '1979 and to the imp-1307 adelic reduction to leading order, with the ' +
    'SAME (log T)^{1/2} Cauchy-Schwarz slack in support (1, 5/4) and NO ' +
    'unconditional bound for sigma > 5/4. The Riemann-Roch strategy does NOT ' +
    'produce a new estimate.',
});

// =========================================================================
// SECTION C - DOES IT BYPASS THE TAO 2008 CRITIQUE?
// =========================================================================
//
// Tao 2008 (review of Connes-Marcolli 2008; MR2371808) identified the 1999
// program as a "SUGGESTIVE framework rather than a proof strategy with a
// clear endgame", with the positivity / Lefschetz piece being where the
// program stops being a derivation and becomes a conjecture.
//
// CC2019 does NOT bypass this critique; it RELOCATES and SHARPENS it:
//
//   - The endgame is now a PRECISE, well-posed conjecture: positivity of the
//     intersection pairing on the square of the scaling site (RR2), modeled
//     exactly on the Castelnuovo-Severi inequality that Weil 1948 PROVED for
//     curves over finite fields. This is sharper than the diffuse 1999
//     von Neumann type-II_1 positivity (L2).
//   - BUT (RR2) is still EQUIVALENT TO RH, and the square as an algebraic
//     surface (RR1) is not constructed unconditionally. So the program still
//     STOPS being a derivation at the positivity step. The "clear endgame"
//     Tao asked for is now a clearer TARGET (a specific Hodge-index
//     positivity) but no more CLOSED.
//
// Honest reading: the Riemann-Roch strategy is the strongest geometric
// articulation of the Connes route — it says precisely what would have to be
// proven (a characteristic-zero Weil positivity on an arithmetic surface) —
// but the load-bearing step is exactly as open as Weil positivity / RH.

const TAO_CRITIQUE_EVALUATION = Object.freeze({
  tao2008CritiqueBypassed: false,
  tao2008CritiqueRelocatedAndSharpened: true,
  tao2008ReviewCitation:
    'Tao, T. (2008-09-29). Blog review of Connes-Marcolli "Noncommutative ' +
    'Geometry, Quantum Fields and Motives", terrytao.wordpress.com; expanded ' +
    'as MathSciNet review MR2371808. Identifies the 1999 program as a ' +
    'SUGGESTIVE framework rather than a proof strategy with a clear endgame.',
  whereEndgameNowStops:
    'The endgame is now the precise conjecture RR2 (positivity of the ' +
    'intersection pairing on the square of the scaling site, a characteristic-' +
    'zero Castelnuovo-Severi / Hodge index analogue), modeled on Weil 1948. ' +
    'This is SHARPER than the 1999 von Neumann positivity but is EQUIVALENT ' +
    'TO RH, and the square as an algebraic surface (RR1) is not constructed ' +
    'unconditionally. The program still stops being a derivation at the ' +
    'positivity step.',
  improvementOver1999:
    'The strategy states PRECISELY what would have to be proven (a ' +
    'characteristic-zero Weil positivity on an arithmetic surface), replacing ' +
    'the un-constructed type-II_1 von Neumann algebra of 1999 with a ' +
    'constructed scaling-site geometry carrying an unconditional Riemann-Roch. ' +
    'The TARGET is clearer; the load-bearing step is no more closed.',
});

// =========================================================================
// SECTION D - PROGRAM STATUS (HONEST ASSESSMENT).
// =========================================================================

const PROGRAM_STATUS = Object.freeze({
  whatIsRigorous: Object.freeze([
    'Arithmetic Site as a Grothendieck topos over the tropical / ' +
      'characteristic-1 semifield (Connes-Consani 2016)',
    'Scaling Site as a constructed tropical curve with structure sheaf, ' +
      'replacing the un-constructed 1999 type-II_1 von Neumann algebra ' +
      '(Connes-Consani 2017)',
    'Unconditional Riemann-Roch theorem ON the (1-dimensional) scaling site ' +
      'for periodic-orbit divisors (Connes-Consani 2017)',
    'Scaling-site counting / periodic-orbit structure reproduces the ' +
      'Riemann-Weil explicit formula (SAME content as the 1999 absorption ' +
      'identity and Weil 1952)',
  ]),

  whatIsNotRigorous: Object.freeze([
    'The square S x S of the scaling site as an actual algebraic SURFACE ' +
      'with a degree-2 intersection theory (RR1) — only a complex lift / ' +
      'partial Frobenius correspondence is given',
    'Positivity of the intersection pairing on S x S (RR2) — the ' +
      'characteristic-zero Castelnuovo-Severi / Hodge index analogue, ' +
      'EQUIVALENT TO RH via the Weil positivity criterion',
    'Realization of the non-integer Frobenius pull-backs q^s as honest ' +
      'algebraic cycles (RR3)',
    'The transfer of the Weil 1948 RH-for-curves proof to characteristic ' +
      'zero as a rigorous derivation (not just a strategy)',
  ]),

  weil1948IsTheModel: true,
  loadBearingStepIsRhEquivalent: true,
  asOf2026IntersectionPositivityProved: false,
  yearsSinceConnesConsani2019: 7,
  honestAssessment:
    'Connes-Consani 2016-2019 ADVANCE the geometry of the Connes route: the ' +
    'scaling site is a constructed object with an unconditional Riemann-Roch, ' +
    'replacing the 1999 un-constructed von Neumann algebra and articulating ' +
    'the endgame as a precise characteristic-zero Weil positivity (RR2) ' +
    'modeled on Weil 1948. But RR2 is RH-EQUIVALENT and RR1 (the square as an ' +
    'algebraic surface) is not constructed unconditionally. As in imp-1307, ' +
    'the program either gives back the (unconditional) explicit formula ' +
    '(SAME as classical, with the (log T)^{1/2} obstruction at support > 1) ' +
    'or gives RH outright (conditional on RR2). No intermediate statement ' +
    'unconditionally improves the 2-point bound at Fourier support > 1.',
});

// =========================================================================
// SECTION E - VERDICT + ENGINE-PLANNING CONSEQUENCE.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'connes-consani-2019-fully-closes-pcc-bypass',
  'connes-consani-2019-bypasses-pcc-but-only-conjecturally',
  'connes-consani-2019-advances-L1-geometry-but-positivity-on-the-square-remains-rh-equivalent',
  'connes-consani-2019-program-not-rigorous-as-published',
]);

const VERDICT =
  'connes-consani-2019-advances-L1-geometry-but-positivity-on-the-square-remains-rh-equivalent';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  // (a)
  closesL1NonCommutativeManifoldStructureUnconditionally: false,
  advancesL1Geometry: true,
  L1Answer:
    'PARTIAL. The scaling site is a constructed one-dimensional geometry with ' +
    'an unconditional Riemann-Roch (Connes-Consani 2017), genuinely advancing ' +
    '(L1) over the 1999 un-constructed type-II_1 von Neumann algebra. But the ' +
    'square S x S needed by the Riemann-Roch strategy is NOT constructed ' +
    'unconditionally as an algebraic surface (RR1), so (L1) at the level the ' +
    'strategy needs is not fully closed.',

  // (b)
  bypassesTao2008Critique: false,
  tao2008Answer:
    'NO bypass; the critique is RELOCATED and SHARPENED. The endgame is now ' +
    'the precise conjecture RR2 (intersection positivity on the square, a ' +
    'characteristic-zero Castelnuovo-Severi / Hodge index analogue modeled on ' +
    'Weil 1948), clearer than the diffuse 1999 von Neumann positivity but ' +
    'EQUIVALENT TO RH and resting on the unconstructed surface RR1.',

  // (c)
  closesPCCForFourierSupportGtOne: false,
  bypassesArithmeticCauchySchwarzLayerUnconditionally: false,
  twoPointAnswer:
    'NO 2-point bound at support > 1. The unconditional scaling-site ' +
    'Riemann-Roch reproduces the explicit formula (SAME input, SAME ' +
    '(log T)^{1/2} Cauchy-Schwarz obstruction as the moment routes and as ' +
    'imp-1307); the conditional intersection positivity RR2 gives RH ' +
    'outright. No intermediate-strength bound.',

  whatConnesConsaniProvidesUnconditionally:
    'The scaling-site Riemann-Roch (Connes-Consani 2017) reproducing the ' +
    'Riemann-Weil explicit formula in scaling-site coordinates. SAME content ' +
    'as the classical explicit formula already used in §15-27 / imp-1184 / ' +
    'imp-1247 and as the imp-1307 absorption identity.',

  whatConnesConsaniProvidesConditionally:
    'IF the square S x S were constructed as an algebraic surface (RR1) and ' +
    'the intersection positivity (RR2) established, the Riemann-Roch strategy ' +
    'would transfer Weil 1948 and prove RH OUTRIGHT. Far stronger than the ' +
    '2-point PCC bound at support > 1; the hypotheses are not established.',

  noIntermediateUnconditionalStatementImproves2PointAtSupportGtOne: true,

  reductionToPriorPCCRoutes:
    'The unconditional content of the Connes-Consani scaling-site Riemann-Roch ' +
    'IS the explicit formula already used by the five moment-method routes ' +
    '(imp-1297/1302/1303/1304/1305) and by the imp-1307 adelic absorption ' +
    'identity. The scaling-site rewriting changes geometry but does NOT ' +
    'bypass the Cauchy-Schwarz layer at the off-diagonal prime-power correction.',

  twoPointBoundFromScalingSiteReduction:
    'sum_{m != n} f((gamma_m - gamma_n) (log T) / (2 pi)) = ' +
    'N(T) integral f (1 - K_sin^2) + O(N(T) (log T)^{-1/2}) — IDENTICAL to ' +
    'HB1979 / imp-1303 and to imp-1307 with the same (log T)^{1/2} slack',

  residualGapPreciselyStated:
    'PCC at 2-point for f-hat supported in (-sigma, sigma), sigma > 1 remains ' +
    'OPEN under the Connes-Consani Riemann-Roch strategy. The load-bearing ' +
    'gap is RR2 (intersection positivity on the square of the scaling site), ' +
    'which is RH-equivalent. Named sub-gap GAP-1343-RR2-INTERSECTION-' +
    'POSITIVITY (a characteristic-zero Castelnuovo-Severi / Hodge index on ' +
    'the unconstructed surface RR1).',

  ruledOutAsNearTermClosure: true,
  honestReasonRuledOut:
    'The load-bearing step RR2 (intersection positivity on the square) is the ' +
    'characteristic-zero Weil positivity, EQUIVALENT TO RH, and rests on the ' +
    'unconstructed algebraic surface RR1. The program either gives the ' +
    'unconditional explicit formula (SAME as classical, with the ' +
    '(log T)^{1/2} obstruction) OR gives RH outright (conditional on RR2). ' +
    'No intermediate statement gives an unconditional 2-point bound at ' +
    'support > 1 stronger than the moment-method family.',

  patternNoteModernUpdateStillNotALever: true,
  patternNotePreciselyStated:
    'imp-1307 (Connes-Bost 1999) NOT RIGOROUS; imp-1308 (Berry-Keating) NOT ' +
    'RIGOROUS; imp-1339 (Hecke-triangle Selberg trace) NO BYPASS. This ' +
    'ticket (imp-1343, the 2016-2019 Riemann-Roch / scaling-site update) ' +
    'ADVANCES the geometry (L1) but the load-bearing positivity (RR2) ' +
    'remains RH-equivalent. The geometric / NCG family does NOT supply a ' +
    'support > 1 2-point bound.',

  implicationForLambdaAttack:
    'The Connes-Consani 2019 Riemann-Roch strategy is NOT a productive lever ' +
    'for §15-27 closure at support > 1 at the current state of the program: ' +
    'the load-bearing RR2 positivity is RH-equivalent. Engine-planning ' +
    'consequence unchanged from imp-1307: (i) pursue the lambda-attack ' +
    'decoupling track, exploring test-function reformulations that live ' +
    'entirely inside sigma <= 1 where Montgomery 1973 is unconditional; ' +
    '(ii) pursue the de Branges direct-construction track (imp-1241 unified ' +
    'existence / imp-1340) which is NON-trace-formula. The connes-adelic ' +
    'numerical page (src/data/connes-adelic-lambda-2026-05.js, imp-1109) ' +
    'remains a finite-t consistency check, not a closure mechanism.',

  honestNote:
    'Connes-Consani 2016-2019 are major contributions: the Arithmetic Site / ' +
    'Scaling Site is a genuinely new geometry over characteristic 1 and the ' +
    'scaling-site Riemann-Roch is an unconditional theorem. The NEGATIVE ' +
    'result of this ticket is NOT a criticism of the program but an HONEST ' +
    'CLASSIFICATION of where it sits relative to the 2-point PCC obstruction ' +
    'at support > 1. The program ADVANCES (L1) and articulates the endgame ' +
    'precisely (RR2, modeled on Weil 1948), but RR2 is RH-equivalent and RR1 ' +
    '(the square as an algebraic surface) is unconstructed, so no ' +
    'unconditional intermediate bound at support > 1 results.',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1343_CONNES_CONSANI_2019 = Object.freeze({
  id: 'imp-1343-connes-consani-2019',
  ticket: 'imp-1343',
  category: 'proof',
  builtAt: '2026-06-04T00:00:00Z',
  paperSourcePath: PAPER_REF,
  dependsOn: Object.freeze(['imp-1307']),
  relatedTickets: Object.freeze([
    'imp-1109', 'imp-1184', 'imp-1205', 'imp-1247',
    'imp-1297', 'imp-1305', 'imp-1307', 'imp-1308', 'imp-1339',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  scalingSiteProgramStatement: SCALING_SITE_PROGRAM_STATEMENT,
  twoPointBoundReductionEvaluation: TWO_POINT_BOUND_REDUCTION_EVALUATION,
  taoCritiqueEvaluation: TAO_CRITIQUE_EVALUATION,
  programStatus: PROGRAM_STATUS,

  parentCrossReferences: Object.freeze({
    imp1109: 'src/data/connes-adelic-lambda-2026-05.js — finite-t adelic numerical consistency check',
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named PCC-at-2pt as binding step D3',
    imp1205: 'src/data/imp-1205-connes-four-route-crosswalk.js — earlier Connes route crosswalk',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — Selberg-trace ruled out',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js — GY2003 absolutized ruled out',
    imp1307: 'src/data/imp-1307-connes-bost-adelic-attack.js — Connes-Bost 1999 NOT RIGOROUS; parent of this ticket',
    imp1308: 'src/data/imp-1308-berry-keating-quantum-attack.js — Berry-Keating NOT RIGOROUS',
    imp1339: 'src/data/imp-1339-hecke-triangle-selberg-trace.js — Hecke-triangle NO BYPASS',
  }),

  honestScope: Object.freeze([
    'This file is a NEW-INPUT CLASSIFICATION ticket (modern update of ' +
    'imp-1307) for the Connes-Consani Riemann-Roch / scaling-site program ' +
    '(Connes-Consani 2016-2019) as a candidate route closing the (L1)-(L3) ' +
    'gap of imp-1307 and bypassing the Montgomery PCC obstruction at Fourier ' +
    'support sigma > 1. It is NOT a new closure, not a new bound, not a ' +
    'critique of the Connes-Consani program as a mathematical contribution.',

    'The verdict is NUANCED-NEGATIVE: connes-consani-2019-advances-L1-' +
    'geometry-but-positivity-on-the-square-remains-rh-equivalent. (a) (L1) is ' +
    'ADVANCED — the scaling site is a constructed geometry with an ' +
    'unconditional Riemann-Roch — but not fully closed, since the square ' +
    'S x S needed by the strategy is not constructed unconditionally (RR1). ' +
    '(b) The Tao 2008 critique is NOT bypassed but relocated and sharpened: ' +
    'the endgame RR2 (intersection positivity on the square) is precise but ' +
    'RH-equivalent. (c) NO 2-point bound at support > 1: the unconditional ' +
    'content is the explicit formula (SAME (log T)^{1/2} obstruction as the ' +
    'moment routes and imp-1307); the conditional content gives RH outright.',

    'The honest scope: (i) the Arithmetic Site / Scaling Site and the ' +
    'scaling-site Riemann-Roch are genuine unconditional contributions ' +
    'advancing the 1999 geometry; (ii) the load-bearing positivity (RR2, a ' +
    'characteristic-zero Castelnuovo-Severi / Hodge index modeled on Weil ' +
    '1948) is EQUIVALENT TO RH and rests on the unconstructed surface RR1; ' +
    '(iii) honest training-time uncertainty: the precise Connes-Consani ' +
    '2018/2019 statements are uncertain at the January 2026 cutoff, but the ' +
    '(RR1)-(RR3) layer-level obstructions are robust because they identify ' +
    'the Weil-positivity / RH-equivalent step any Weil-1948-transfer must ' +
    'traverse; OPEN-FOR-REVISION if the square is constructed AND the ' +
    'intersection positivity established unconditionally.',

    'The CONSEQUENCE for engine planning is UNCHANGED from imp-1307: the ' +
    'Connes-Consani 2019 route is NOT a productive lever for §15-27 closure ' +
    'at support > 1. Pursue the lambda-attack decoupling track (test-function ' +
    'reformulations inside sigma <= 1 where Montgomery 1973 is unconditional) ' +
    'and the de Branges direct-construction track (imp-1241 / imp-1340). ' +
    'Named sub-gap GAP-1343-RR2-INTERSECTION-POSITIVITY.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1109: 'src/data/connes-adelic-lambda-2026-05.js',
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1205: 'src/data/imp-1205-connes-four-route-crosswalk.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js',
    imp1307: 'src/data/imp-1307-connes-bost-adelic-attack.js',
    connesConsani2016ArithmeticSite:
      'Connes, A. and Consani, C. (2016). "Geometry of the arithmetic site". ' +
      'Adv. Math. 291, 274-329.',
    connesConsani2017ScalingSite:
      'Connes, A. and Consani, C. (2017). "Geometry of the scaling site". ' +
      'Selecta Math. (N.S.) 23, 1803-1850.',
    connesConsani2019RiemannRochStrategy:
      'Connes, A. and Consani, C. (2019). "The Riemann-Roch strategy: ' +
      'complex lift of the scaling site". In "Advances in Noncommutative ' +
      'Geometry" (Springer, 2019), 989-1073; arXiv:1805.10501.',
    connes2016Essay:
      'Connes, A. (2016). "An essay on the Riemann Hypothesis". In "Open ' +
      'Problems in Mathematics" (Nash-Rassias eds.), Springer, 225-257.',
    weil1948:
      'Weil, A. (1948). "Sur les courbes algebriques et les varietes qui ' +
      's en deduisent". Actualites Sci. Ind. 1041, Hermann. (RH for curves / ' +
      'F_q via positivity of a self-intersection on C x C.)',
    weil1952:
      'Weil, A. (1952). "Sur les formules explicites de la theorie des ' +
      'nombres premiers". Comm. Sem. Math. Univ. Lund (M. Riesz volume), ' +
      '252-265.',
    connes1999:
      'Connes, A. (1999). "Trace formula in noncommutative geometry and the ' +
      'zeros of the Riemann zeta function". Selecta Math. (N.S.) 5, 29-106.',
    tao2008Review:
      'Tao, T. (2008-09-29). Blog review of Connes-Marcolli "Noncommutative ' +
      'Geometry, Quantum Fields and Motives", terrytao.wordpress.com; ' +
      'expanded as MathSciNet review MR2371808.',
    montgomery1973:
      'Montgomery, H. L. (1973). "The pair correlation of zeros of the ' +
      'zeta function". Proc. Sympos. Pure Math. XXIV, 181-193.',
  }),
});

export default IMP_1343_CONNES_CONSANI_2019;

// =========================================================================
// BUILD-TIME TRIPWIRES (9 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1343_CONNES_CONSANI_2019_ASSERTIONS = [
  // Tripwire 1: Connes-Consani scaling-site sources cited precisely.
  {
    id: 'imp1343-connes-consani-sources-cited-precisely',
    why:
      'The ticket spec requires the Connes-Consani 2016 Arithmetic Site, ' +
      '2017 Scaling Site, and 2019 Riemann-Roch strategy to be the primary ' +
      'citations. A silent drift to a vague "Connes adelic" reference would ' +
      'render the modern-update classification ungrounded.',
    holds: () => {
      const s = IMP_1343_CONNES_CONSANI_2019.scalingSiteProgramStatement;
      const r = IMP_1343_CONNES_CONSANI_2019.references;
      return (
        typeof s.primarySource === 'string' &&
        /Connes/.test(s.primarySource) &&
        /Consani/.test(s.primarySource) &&
        /2016/.test(s.primarySource) &&
        /arithmetic site/i.test(s.primarySource) &&
        typeof s.scalingSiteSource === 'string' &&
        /scaling site/i.test(s.scalingSiteSource) &&
        /2017/.test(s.scalingSiteSource) &&
        typeof s.riemannRochStrategySource === 'string' &&
        /Riemann-Roch strategy/i.test(s.riemannRochStrategySource) &&
        /2019|1805\.10501/.test(s.riemannRochStrategySource) &&
        typeof r.connesConsani2017ScalingSite === 'string' &&
        /Selecta/i.test(r.connesConsani2017ScalingSite)
      );
    },
  },

  // Tripwire 2: scaling-site Riemann-Roch identified unconditional and
  // equivalent to the explicit formula; square-positivity conditional.
  {
    id: 'imp1343-scaling-site-rr-unconditional-square-conditional',
    why:
      'The classification must distinguish the UNCONDITIONAL scaling-site ' +
      'Riemann-Roch (Connes-Consani 2017, reproducing the explicit formula) ' +
      'from the CONDITIONAL Riemann-Roch STRATEGY on the square (RR1/RR2/RR3). ' +
      'A silent flip of either status would mislead the verdict.',
    holds: () => {
      const s = IMP_1343_CONNES_CONSANI_2019.scalingSiteProgramStatement;
      return (
        s.unconditionalRiemannRochOnScalingSite === true &&
        s.scalingSiteReproducesExplicitFormula === true &&
        typeof s.scalingSiteUnconditionalContent === 'string' &&
        /UNCONDITIONAL/.test(s.scalingSiteUnconditionalContent) &&
        /explicit formula/i.test(s.scalingSiteUnconditionalContent) &&
        typeof s.riemannRochStrategyRequires === 'object' &&
        /NOT ESTABLISHED/.test(s.riemannRochStrategyRequires.RR1_squareAsAlgebraicSurface) &&
        /NOT ESTABLISHED/.test(s.riemannRochStrategyRequires.RR2_intersectionPositivity)
      );
    },
  },

  // Tripwire 3: (a) (L1) advanced but not fully closed.
  {
    id: 'imp1343-L1-advanced-not-fully-closed',
    why:
      'Ticket question (a): does CC2019 close (L1) the non-commutative ' +
      'manifold structure unconditionally? The honest answer is ADVANCED ' +
      '(scaling site constructed with unconditional Riemann-Roch) but NOT ' +
      'fully closed (square not constructed, RR1). A silent flip to "fully ' +
      'closed" would overstate the result.',
    holds: () => {
      const s = IMP_1343_CONNES_CONSANI_2019.scalingSiteProgramStatement;
      const vd = IMP_1343_CONNES_CONSANI_2019.verdictDetail;
      return (
        s.L1_geometryAdvanced === true &&
        s.L1_geometryFullyClosed === false &&
        typeof s.L1_status === 'string' &&
        /ADVANCED/.test(s.L1_status) &&
        /scaling site/i.test(s.L1_status) &&
        vd.advancesL1Geometry === true &&
        vd.closesL1NonCommutativeManifoldStructureUnconditionally === false &&
        typeof vd.L1Answer === 'string' &&
        /PARTIAL/i.test(vd.L1Answer)
      );
    },
  },

  // Tripwire 4: (b) Tao 2008 critique relocated/sharpened, not bypassed.
  {
    id: 'imp1343-tao-critique-relocated-not-bypassed',
    why:
      'Ticket question (b): does CC2019 bypass the Tao 2008 critique? The ' +
      'honest answer is NO — the critique is relocated and sharpened (the ' +
      'endgame RR2 is precise but RH-equivalent). A silent flip to "bypassed" ' +
      'would falsely claim a clear endgame.',
    holds: () => {
      const t = IMP_1343_CONNES_CONSANI_2019.taoCritiqueEvaluation;
      const vd = IMP_1343_CONNES_CONSANI_2019.verdictDetail;
      return (
        t.tao2008CritiqueBypassed === false &&
        t.tao2008CritiqueRelocatedAndSharpened === true &&
        typeof t.tao2008ReviewCitation === 'string' &&
        /Tao/.test(t.tao2008ReviewCitation) &&
        /2008/.test(t.tao2008ReviewCitation) &&
        /MR2371808/.test(t.tao2008ReviewCitation) &&
        typeof t.whereEndgameNowStops === 'string' &&
        /RR2|positivity/i.test(t.whereEndgameNowStops) &&
        vd.bypassesTao2008Critique === false
      );
    },
  },

  // Tripwire 5: (c) two-point reduction reports NO bypass at support > 1.
  {
    id: 'imp1343-two-point-reduction-reports-no-bypass',
    why:
      'Ticket question (c): does CC2019 give a 2-point bound at support > 1? ' +
      'The load-bearing claim is NO — the scaling-site rewriting does NOT ' +
      'bypass the arithmetic Cauchy-Schwarz layer. A silent flip to "bypass ' +
      'achieved" would invalidate the engine-planning consequence.',
    holds: () => {
      const r = IMP_1343_CONNES_CONSANI_2019.twoPointBoundReductionEvaluation;
      return (
        r.reducesESYClosurePoissonKernelToUnconditionalScalingSiteIntersection === false &&
        r.noneOfTheAuxiliariesProducesIndependentArithmeticEstimate === true &&
        r.arithmeticCauchySchwarzLayerNotBypassed === true &&
        typeof r.twoPointBoundAtSupportGtOneFromScalingSiteReduction === 'string' &&
        /IDENTICAL/i.test(r.twoPointBoundAtSupportGtOneFromScalingSiteReduction) &&
        /\(log T\)\^\{1\/2\}/.test(r.twoPointBoundAtSupportGtOneFromScalingSiteReduction) &&
        /5\/4/.test(r.twoPointBoundAtSupportGtOneFromScalingSiteReduction)
      );
    },
  },

  // Tripwire 6: Weil 1948 is the model and RR2 is RH-equivalent.
  {
    id: 'imp1343-weil1948-model-rr2-rh-equivalent',
    why:
      'The Riemann-Roch strategy is a transfer of Weil 1948 (RH for curves / ' +
      'F_q via positivity of a self-intersection on C x C) to characteristic ' +
      'zero. The load-bearing RR2 intersection positivity is the ' +
      'characteristic-zero Weil positivity, EQUIVALENT TO RH. Both must be ' +
      'stated explicitly or the verdict floats free of its model.',
    holds: () => {
      const ps = IMP_1343_CONNES_CONSANI_2019.programStatus;
      const r = IMP_1343_CONNES_CONSANI_2019.references;
      const aux = IMP_1343_CONNES_CONSANI_2019
        .twoPointBoundReductionEvaluation.auxiliaryInputsRequired;
      return (
        ps.weil1948IsTheModel === true &&
        ps.loadBearingStepIsRhEquivalent === true &&
        ps.asOf2026IntersectionPositivityProved === false &&
        typeof r.weil1948 === 'string' &&
        /Weil/.test(r.weil1948) &&
        /1948/.test(r.weil1948) &&
        typeof aux.RR2_intersectionPositivity === 'string' &&
        /EQUIVALENT TO RH|equivalent to RH/i.test(aux.RR2_intersectionPositivity)
      );
    },
  },

  // Tripwire 7: verdict is one of the four allowed strings.
  {
    id: 'imp1343-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed strings: ' +
      'connes-consani-2019-fully-closes-pcc-bypass / ...-bypasses-pcc-but-' +
      'only-conjecturally / ...-advances-L1-geometry-but-positivity-on-the-' +
      'square-remains-rh-equivalent / ...-program-not-rigorous-as-published. ' +
      'A non-allowed verdict indicates classification drift.',
    holds: () => {
      const allowed = [
        'connes-consani-2019-fully-closes-pcc-bypass',
        'connes-consani-2019-bypasses-pcc-but-only-conjecturally',
        'connes-consani-2019-advances-L1-geometry-but-positivity-on-the-square-remains-rh-equivalent',
        'connes-consani-2019-program-not-rigorous-as-published',
      ];
      return (
        allowed.includes(IMP_1343_CONNES_CONSANI_2019.verdict) &&
        IMP_1343_CONNES_CONSANI_2019.verdictDetail.isAllowedVerdict === true
      );
    },
  },

  // Tripwire 8: cross-references to parent imp-1307 and PCC tickets present.
  {
    id: 'imp1343-cross-references-parent-tickets',
    why:
      'This ticket is the modern-update follow-up to imp-1307 (Connes-Bost ' +
      '1999 NOT RIGOROUS) and depends on it. It must cross-reference imp-1307, ' +
      'imp-1184 (PCC binding gap), and imp-1305 (named the Connes route as a ' +
      'candidate new input). Without these the classification floats free.',
    holds: () => {
      const r = IMP_1343_CONNES_CONSANI_2019;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1307') &&
        related.includes('imp-1184') &&
        related.includes('imp-1305') &&
        Array.isArray(r.dependsOn) &&
        r.dependsOn.includes('imp-1307') &&
        typeof xrefs.imp1307 === 'string' && /imp-1307/.test(xrefs.imp1307) &&
        typeof xrefs.imp1184 === 'string' && /imp-1184/.test(xrefs.imp1184) &&
        typeof xrefs.imp1305 === 'string' && /imp-1305/.test(xrefs.imp1305)
      );
    },
  },

  // Tripwire 9: honest scope mentions NEGATIVE result, names sub-gap, and
  // keeps the engine-planning lambda-attack / de Branges consequence.
  {
    id: 'imp1343-honest-scope-negative-subgap-and-engine-planning',
    why:
      'The honest scope must state the result is NUANCED-NEGATIVE, name the ' +
      'load-bearing sub-gap GAP-1343-RR2-INTERSECTION-POSITIVITY, and keep ' +
      'the actionable engine-planning consequence (lambda-attack sigma <= 1 ' +
      'decoupling + de Branges imp-1241/imp-1340). A silent drift to ' +
      '"positive closure" would mislead.',
    holds: () => {
      const blob = IMP_1343_CONNES_CONSANI_2019.honestScope.join(' ');
      const vd = IMP_1343_CONNES_CONSANI_2019.verdictDetail;
      return (
        /NEGATIVE/.test(blob) &&
        /GAP-1343-RR2-INTERSECTION-POSITIVITY/.test(blob) &&
        /Montgomery 1973/.test(blob) &&
        /(sigma <= 1|sigma<=1)/.test(blob) &&
        /de Branges/i.test(blob) &&
        typeof vd.implicationForLambdaAttack === 'string' &&
        /imp-1241|imp-1340/.test(vd.implicationForLambdaAttack) &&
        vd.ruledOutAsNearTermClosure === true
      );
    },
  },
];
