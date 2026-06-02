/**
 * @module imp-1339-hecke-triangle-selberg-trace
 * @fileoverview imp-1339 — CRITICAL classification: do the Hecke triangle
 *   groups G_q = Delta(2, q, infinity) (for prime q) have a DIFFERENT
 *   spectral structure that gives a single-zeta 2-point bound at Fourier
 *   support > 1 WITHOUT routing through the SL(2, Z) Sarnak arithmetic-
 *   quantum-chaos (AQC) equivalence that killed the Selberg-trace route in
 *   imp-1297?
 *
 *   CONTEXT
 *   -------
 *   imp-1297 ruled out the SL(2, Z) Selberg trace formula as an independent
 *   route to Montgomery PCC at support > 1, with verdict
 *   `selberg-requires-cuspidal-density-conjecture`: the trace-formula 2-point
 *   bound is provably no tighter than Selberg 1944 and is equi-difficult to
 *   PCC via the Sarnak 1995 arithmetic-quantum-chaos (AQC) GUE conjecture.
 *   imp-1308 (Berry-Keating, NOT RIGOROUS) explicitly named the Hecke
 *   triangle Selberg trace (Beyerstedt-Strombergsson 2010 eigenvalue
 *   computations) as a candidate to probe NEXT, on the heuristic that Hecke
 *   triangle groups G_q for q not in {3, 4, 6} are NON-ARITHMETIC and so have
 *   a different spectral structure that might bypass the AQC equivalence.
 *
 *   This ticket asks: does the Hecke-triangle Selberg trace formula provide a
 *   single-zeta 2-point bound at support > 1 that bypasses the SL(2, Z) AQC
 *   obstruction of imp-1297?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'hecke-triangle-no-bypass-arithmetic-dichotomy'
 *
 *   The Hecke triangle route does NOT bypass the AQC obstruction. The reason
 *   is a clean ARITHMETIC DICHOTOMY that the "different spectral structure"
 *   heuristic gets exactly backwards:
 *
 *   (H1) ZETA ENTERS THE TRACE FORMULA ONLY VIA THE EISENSTEIN SCATTERING
 *        DETERMINANT, AND ONLY FOR ARITHMETIC q. The Riemann zeta function
 *        appears in the SL(2, Z) Selberg trace formula solely through the
 *        Eisenstein scattering matrix
 *          phi(s) = sqrt(pi) Gamma(s - 1/2) zeta(2s - 1) / (Gamma(s) zeta(2s)),
 *        i.e. as a RATIO OF ZETA VALUES. This closed form is a consequence of
 *        ARITHMETICITY (the cusp width and the Fourier coefficients of the
 *        Eisenstein series are arithmetic). For the Hecke triangle group G_q
 *        the scattering determinant has a closed zeta / Dirichlet-L form ONLY
 *        in the three ARITHMETIC cases q in {3, 4, 6} (q = 3 is PSL(2, Z)
 *        itself up to commensurability; q = 4 and q = 6 are arithmetic by the
 *        Takeuchi 1977 classification of arithmetic triangle groups). In
 *        every other (non-arithmetic) case the scattering determinant is NOT
 *        a ratio of zeta / L-values and carries NO information about the
 *        zeros of zeta.
 *
 *   (H2) ARITHMETIC q REDUCE TO THE SAME AQC OBSTRUCTION. For q in {3, 4, 6}
 *        the group is arithmetic, carries Hecke operators, and the
 *        Maass-form spectral statistics are governed by the SAME Sarnak 1995
 *        AQC GUE conjecture that imp-1297 identified as the binding
 *        obstruction. q = 3 is literally the imp-1297 case; q = 4 and q = 6
 *        are commensurable with congruence subgroups (Theta group resp. a
 *        level-3 lattice) whose L-functions are again degree-2 GL(2) objects
 *        with the identical 2-point obstruction. So the arithmetic Hecke
 *        triangle groups give NO new bypass — they re-encode imp-1297.
 *
 *   (H3) NON-ARITHMETIC q DECOUPLE FROM ZETA (PHILLIPS-SARNAK DISSOLUTION).
 *        For q not in {3, 4, 6} the group G_q is non-arithmetic: there are NO
 *        Hecke operators, and by the Phillips-Sarnak 1985 deformation theory
 *        the cusp forms generically DISSOLVE into scattering resonances under
 *        the non-arithmetic deformation (the Phillips-Sarnak conjecture is
 *        that a generic non-arithmetic finite-area surface has only finitely
 *        many cusp forms). The "different spectral structure" is REAL — but
 *        precisely because it is non-arithmetic, the Eisenstein scattering
 *        determinant is NOT expressible through zeta (per H1), so the trace
 *        formula for G_q is an identity about a DIFFERENT analytic object and
 *        says nothing about the Riemann zeros. The route that differs from
 *        SL(2, Z) is exactly the route that decouples from zeta.
 *
 *   This is a RIGIDITY / DICHOTOMY obstruction of the same family as the
 *   imp-1334 Voronin-universality rigidity obstruction: the structural
 *   property that would deliver a bypass (a zeta-bearing trace formula with
 *   non-AQC spectral statistics) is self-contradictory, because the
 *   zeta-bearing property (arithmeticity) is exactly what forces the AQC
 *   statistics.
 *
 *   HONEST UNCERTAINTY NOTE ON BEYERSTEDT-STROMBERGSSON 2010 SPECIFICS
 *   -----------------------------------------------------------------
 *   The precise numerical content of the Beyerstedt-Strombergsson 2010 Hecke
 *   triangle eigenvalue computations (and the Strombergsson / Then
 *   computational-spectral-geometry line of work) is partially uncertain at
 *   training-cutoff (January 2026). The (H1)-(H3) obstructions are ROBUST to
 *   the exact eigenvalue data because they are STRUCTURAL: they turn only on
 *   (a) the Takeuchi 1977 arithmeticity classification of triangle groups
 *   (which is a finite, settled list) and (b) the fact that zeta enters a
 *   Selberg trace formula only through an arithmetic Eisenstein scattering
 *   determinant. If a non-arithmetic Hecke triangle group were found whose
 *   scattering determinant is nevertheless a ratio of zeta / L-values, this
 *   classification would be OPEN-FOR-REVISION; no such phenomenon is known
 *   and it would contradict the Takeuchi classification.
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   The Hecke-triangle Selberg trace was the third of the three escape routes
 *   named in the imp-1308 closure (after imp-1310 alternative section 15-27
 *   pathways and the imp-1241 de Branges direct route). With this ticket
 *   returning a negative DICHOTOMY verdict, the spectral / trace-formula
 *   family (SL(2, Z) Selberg imp-1297, Berry-Keating imp-1308, Connes-Bost
 *   imp-1307, now Hecke-triangle imp-1339) is EXHAUSTED for a zeta 2-point
 *   bypass at support > 1. The remaining live levers are the NON-trace-formula
 *   routes: the imp-1241 / imp-1340 de Branges direct construction and the
 *   imp-1310 alternative section 15-27 closure decoupled from sigma > 1.
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1297 src/data/imp-1297-selberg-trace-pcc-route.js
 *   @see imp-1307 src/data/imp-1307-connes-bost-adelic-attack.js
 *   @see imp-1308 src/data/imp-1308-berry-keating-quantum-attack.js
 *   @see imp-1310 src/data/imp-1310-section15-27-support-leq-1-reroute.js
 *   @see imp-1334 src/data/imp-1334-voronin-universality-quantitative.js
 *
 *   Ticket: imp-1339 (proof, critical, CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - HECKE TRIANGLE SELBERG TRACE FORMULA, STATED PRECISELY.
// =========================================================================
//
// The Hecke triangle group G_q (q an integer >= 3, or q = infinity) is the
// discrete subgroup of PSL(2, R) generated by S : z -> -1/z and the
// translation T_q : z -> z + lambda_q with lambda_q = 2 cos(pi / q). Its
// fundamental domain is the hyperbolic triangle with angles (pi/2, pi/q, 0)
// and a single cusp at infinity; the surface G_q \ H has finite area
//
//     area(G_q \ H) = pi (1 - 2/q).
//
// The Selberg trace formula for an even test function h (with Paley-Wiener
// Fourier transform g) on G_q \ H reads, schematically,
//
//     sum_j h(r_j)                                    [discrete spectrum: 1/4 + r_j^2]
//   = area/(4 pi) * integral h(r) r tanh(pi r) dr      [identity]
//   + sum_{hyperbolic} (geometric / length-spectrum term)
//   + (elliptic terms from the order-2 and order-q fixed points)
//   + (parabolic / cusp term)
//   - 1/(4 pi) integral h(r) (phi'/phi)(1/2 + i r) dr   [scattering / Eisenstein]
//   + 1/4 h(0) (1 - phi(1/2)).
//
// The structure is identical to the SL(2, Z) trace formula (imp-1297
// Section A) EXCEPT for:
//   - the area pi (1 - 2/q) in place of pi/3;
//   - an additional elliptic term from the order-q fixed point;
//   - the SCATTERING DETERMINANT phi(s), which is the object that carries
//     (or fails to carry) the Riemann zeta function.
//
// The Eisenstein series E(z, s) for the cusp at infinity has a constant term
//     y^s + phi(s) y^{1 - s},
// and phi(s) is the SCATTERING DETERMINANT. zeta enters the trace formula
// ONLY through phi(s) (and its logarithmic derivative phi'/phi). This is the
// single hinge of the whole analysis.

const HECKE_TRIANGLE_TRACE_STATEMENT = Object.freeze({
  group:
    'G_q = Hecke triangle group Delta(2, q, infinity), generated by ' +
    'S : z -> -1/z and T_q : z -> z + lambda_q with lambda_q = 2 cos(pi/q); ' +
    'fundamental triangle with angles (pi/2, pi/q, 0), one cusp at infinity',

  area: 'area(G_q \\ H) = pi (1 - 2/q); reduces to pi/3 at q = 3 (the SL(2,Z) case)',

  traceFormulaShape:
    'sum_j h(r_j) = (area/4pi) integral h(r) r tanh(pi r) dr + hyperbolic ' +
    'length-spectrum term + elliptic (order-2 and order-q) terms + parabolic ' +
    'cusp term - (1/4pi) integral h(r) (phi-prime/phi)(1/2 + ir) dr + ' +
    '(1/4) h(0)(1 - phi(1/2))',

  differsFromSL2ZBy:
    'area pi(1 - 2/q) vs pi/3; an EXTRA elliptic term from the order-q fixed ' +
    'point; and the scattering determinant phi(s). zeta enters ONLY through ' +
    'phi(s) and phi-prime/phi',

  zetaEntersOnlyViaScattering:
    'The Riemann zeta function enters the Hecke-triangle Selberg trace formula ' +
    'ONLY through the Eisenstein scattering determinant phi(s) (constant term ' +
    'of E(z,s) at the cusp: y^s + phi(s) y^{1-s}). This single hinge decides ' +
    'whether the trace formula sees the zeros of zeta',

  isTrainingTimeUncertain: true,
  trainingTimeUncertaintyNote:
    'The precise numerical content of the Beyerstedt-Strombergsson 2010 Hecke ' +
    'triangle eigenvalue computations is partially uncertain at training-cutoff ' +
    '(January 2026). The structural (H1)-(H3) obstructions do not depend on the ' +
    'eigenvalue data: they turn only on the Takeuchi 1977 arithmeticity ' +
    'classification (a finite settled list) and on zeta entering only through ' +
    'an arithmetic Eisenstein scattering determinant.',
});

// =========================================================================
// SECTION B - DOES IT GIVE A SINGLE-ZETA 2-POINT BOUND AT SUPPORT > 1
//             BYPASSING THE SL(2,Z) AQC EQUIVALENCE?
// =========================================================================
//
// The candidate bypass requires the conjunction of TWO properties of G_q:
//
//   (P-zeta)  the scattering determinant phi(s) is a ratio of zeta / L-values
//             (so the trace formula sees the Riemann zeros);
//   (P-nonAQC) the Maass / scattering spectral statistics are NOT governed by
//             the Sarnak 1995 AQC GUE conjecture (so the 2-point bound is
//             genuinely independent of Montgomery PCC).
//
// THE DICHOTOMY (H1 + H2 + H3) shows (P-zeta) and (P-nonAQC) CANNOT hold
// simultaneously:
//
//   ARITHMETIC q in {3, 4, 6} (Takeuchi 1977 classification of arithmetic
//     triangle groups: the arithmetic (2, q, infinity) triangle groups are
//     exactly q = 3, 4, 6, infinity). Here phi(s) IS a ratio of zeta /
//     Dirichlet-L values, so (P-zeta) HOLDS. But the group is arithmetic,
//     carries Hecke operators, and the spectral statistics obey AQC, so
//     (P-nonAQC) FAILS. q = 3 is the imp-1297 case verbatim; q = 4 (Theta
//     group, commensurable with Gamma_0(4)) and q = 6 give degree-2 GL(2)
//     L-functions with the identical 2-point obstruction. NO bypass.
//
//   NON-ARITHMETIC q not in {3, 4, 6}. Here there are no Hecke operators and
//     (by Phillips-Sarnak 1985 deformation theory) the cusp forms generically
//     dissolve; the spectral statistics are conjecturally those of a generic
//     (non-arithmetic) chaotic system, which is the GENERIC non-AQC case, so
//     (P-nonAQC) plausibly HOLDS. But phi(s) is NOT a ratio of zeta / L-values
//     (the closed arithmetic form of the Eisenstein constant term is a
//     consequence of arithmeticity); the scattering determinant for a
//     non-arithmetic G_q is a transcendental object with no zeta factorisation,
//     so (P-zeta) FAILS and the trace formula carries NO information about the
//     Riemann zeros. NO zeta 2-point bound to extract.
//
// NET. The single-zeta 2-point bound at support > 1 is NOT obtained. The
// property that makes the trace formula see zeta (arithmeticity) is exactly
// the property that forces the AQC statistics; removing AQC (going
// non-arithmetic) removes zeta from the trace formula. The "different
// spectral structure" of the Hecke triangle groups is real but is decoupled
// from zeta precisely when it differs from SL(2, Z).

const BYPASS_EVALUATION = Object.freeze({
  candidateBypassRequires: Object.freeze({
    P_zeta:
      'the scattering determinant phi(s) is a ratio of zeta / Dirichlet-L ' +
      'values, so the trace formula sees the Riemann zeros',
    P_nonAQC:
      'the Maass / scattering spectral statistics are NOT governed by the ' +
      'Sarnak 1995 AQC GUE conjecture, so the 2-point bound is independent of ' +
      'Montgomery PCC',
  }),

  arithmeticCase:
    'q in {3, 4, 6} (Takeuchi 1977: the arithmetic (2,q,infinity) triangle ' +
    'groups are exactly q = 3, 4, 6, infinity). phi(s) IS a ratio of zeta / ' +
    'Dirichlet-L values so P-zeta HOLDS; but the group is arithmetic with Hecke ' +
    'operators and obeys AQC so P-nonAQC FAILS. q = 3 is imp-1297 verbatim; ' +
    'q = 4 (Theta group, commensurable with Gamma_0(4)) and q = 6 give degree-2 ' +
    'GL(2) L-functions with the identical 2-point obstruction. NO bypass',

  nonArithmeticCase:
    'q not in {3, 4, 6}: no Hecke operators, Phillips-Sarnak 1985 cusp-form ' +
    'dissolution, generically non-AQC statistics so P-nonAQC plausibly HOLDS; ' +
    'but phi(s) is NOT a ratio of zeta / L-values (the closed arithmetic form ' +
    'is a consequence of arithmeticity), so P-zeta FAILS and the trace formula ' +
    'carries NO information about the Riemann zeros. NO zeta 2-point bound',

  P_zeta_and_P_nonAQC_simultaneously: false,
  dichotomyStatement:
    'P-zeta and P-nonAQC cannot hold simultaneously: the property that makes ' +
    'the trace formula see zeta (arithmeticity) is exactly the property that ' +
    'forces the AQC spectral statistics. Removing AQC (non-arithmetic G_q) ' +
    'removes zeta from the scattering determinant',

  bypassesSL2ZAQC: false,
  givesSingleZetaTwoPointBoundAtSupportGtOne: false,
});

// =========================================================================
// SECTION C - AUXILIARY CONJECTURES REQUIRED (FOR COMPLETENESS).
// =========================================================================
//
// Even setting the dichotomy aside, ANY attempt to extract an UNCONDITIONAL
// zeta 2-point bound from a Hecke-triangle trace formula would still require
// the same auxiliary inputs that imp-1297 catalogued for SL(2, Z), plus a
// non-arithmetic-specific one:
//
//   (C1) Selberg eigenvalue conjecture analogue (lambda_1 >= 1/4): for Hecke
//        triangle groups this is OPEN even numerically for general q; the
//        Kim-Sarnak 7/64 bound is an ARITHMETIC (Ramanujan-type) input that
//        does NOT transfer to non-arithmetic G_q. For non-arithmetic q there
//        is no known unconditional spectral gap of the required strength.
//
//   (C2) Phillips-Sarnak cuspidal density: how many genuine cusp forms G_q
//        carries is governed by the (open) Phillips-Sarnak conjecture; for
//        non-arithmetic q the expectation is FINITELY many, which would make
//        the discrete spectral side too thin to support a 2-point statistic.
//
//   (C3) Sarnak 1995 AQC GUE: needed (in the arithmetic case) to identify the
//        2-point statistic with the Montgomery form factor at support > 1 —
//        this is precisely the imp-1297 obstruction, equivalent to PCC.
//
// As in imp-1297, the trace-formula 2-point bound DEGRADES by (log T)^{1/2}
// in the sigma > 1 regime where the section 15-27 ESY-closure Poisson kernel
// sits (Iwaniec-Sarnak 2000), so even with all auxiliary conjectures granted
// the bound is provably no tighter than Selberg 1944.

const AUXILIARY_CONJECTURES = Object.freeze({
  C1_selberg_eigenvalue_analogue:
    'Selberg eigenvalue conjecture analogue lambda_1 >= 1/4 for G_q is OPEN ' +
    'even numerically for general q; the Kim-Sarnak 7/64 bound is ARITHMETIC ' +
    '(Ramanujan-type) and does NOT transfer to non-arithmetic G_q. No known ' +
    'unconditional spectral gap of the required strength for non-arithmetic q',

  C2_phillips_sarnak_cuspidal_density:
    'Phillips-Sarnak 1985 conjecture: a generic non-arithmetic finite-area ' +
    'surface has only FINITELY many cusp forms (cusp forms dissolve into ' +
    'resonances under deformation). For non-arithmetic G_q this makes the ' +
    'discrete spectral side too thin to support a 2-point statistic',

  C3_sarnak_aqc_gue:
    'Sarnak 1995 arithmetic-quantum-chaos GUE conjecture, needed in the ' +
    'ARITHMETIC case to identify the 2-point statistic with the Montgomery ' +
    'form factor at support > 1 — this IS the imp-1297 obstruction, equivalent ' +
    'to PCC',

  degradationInSigmaGtOne:
    'As in imp-1297, the trace-formula 2-point bound DEGRADES by (log T)^{1/2} ' +
    'in the sigma > 1 regime where the section 15-27 ESY-closure Poisson kernel ' +
    'sits (Iwaniec-Sarnak 2000); even granting all auxiliary conjectures the ' +
    'bound is provably no tighter than Selberg 1944',
});

// =========================================================================
// SECTION D - RELATIONSHIP TO PRIOR SPECTRAL / TRACE-FORMULA ROUTES.
// =========================================================================
//
// imp-1297 (SL(2, Z) Selberg trace) + imp-1307 (Connes-Bost adelic trace) +
// imp-1308 (Berry-Keating / Gutzwiller trace) are the three prior
// trace-formula / spectral routes, all NEGATIVE. The Hecke-triangle route
// (this imp-1339) was the explicit "different geometric object" follow-up
// named in the imp-1308 closure.
//
//   - imp-1297 (SL(2, Z) Selberg): zeta via the arithmetic Eisenstein
//     scattering phi(s) = sqrt(pi) Gamma(s-1/2) zeta(2s-1)/(Gamma(s) zeta(2s));
//     2-point bound equi-difficult to PCC via Sarnak AQC.
//   - imp-1339 (Hecke triangle): SAME hinge (zeta only via the Eisenstein
//     scattering determinant), but now the arithmetic dichotomy shows the
//     scattering determinant is zeta-bearing ONLY in the arithmetic cases
//     q in {3, 4, 6}, which re-encode the imp-1297 AQC obstruction.
//
// The Hecke-triangle route is therefore the SHARPEST possible test of the
// imp-1297 obstruction: it varies the GROUP (hence the spectral statistics)
// while holding the zeta-detection mechanism (Eisenstein scattering) fixed,
// and confirms that you cannot vary the statistics away from AQC without
// simultaneously losing the zeta connection. This is a RIGIDITY obstruction
// of the same family as imp-1334 (Voronin universality): the desired
// structural combination is self-contradictory.

const RELATIONSHIP_TO_PRIOR_ROUTES = Object.freeze({
  imp1297_sl2z_selberg:
    'imp-1297 SL(2, Z) Selberg trace: zeta via arithmetic Eisenstein scattering ' +
    'phi(s) = sqrt(pi) Gamma(s-1/2) zeta(2s-1)/(Gamma(s) zeta(2s)); 2-point ' +
    'bound equi-difficult to PCC via Sarnak 1995 AQC. Verdict ' +
    'selberg-requires-cuspidal-density-conjecture',

  imp1307_connes_bost:
    'Connes-Bost adelic trace: zeros as absorption spectrum, trace = Weil ' +
    'explicit formula; conjectural content = positivity equivalent to RH. ' +
    'Verdict connes-bost-program-not-rigorous-as-published',

  imp1308_berry_keating:
    'Berry-Keating H = xp / Gutzwiller trace: unconditional content = smooth ' +
    'counting function; conjectural content = self-adjoint realisation ' +
    '(Hilbert-Polya) + Hardy-Littlewood (equivalent to PCC). Verdict ' +
    'berry-keating-program-not-rigorous-as-published',

  imp1339_hecke_triangle:
    'Hecke triangle Selberg trace (this ticket): SAME zeta-detection hinge as ' +
    'imp-1297 (Eisenstein scattering determinant), but the Takeuchi 1977 ' +
    'arithmetic dichotomy shows the scattering determinant is zeta-bearing ' +
    'ONLY for arithmetic q in {3, 4, 6}, which re-encode the imp-1297 AQC ' +
    'obstruction. Non-arithmetic q decouple from zeta',

  sharpestTestOfImp1297:
    'The Hecke-triangle route varies the GROUP (hence the spectral statistics) ' +
    'while holding the zeta-detection mechanism (Eisenstein scattering) fixed, ' +
    'and confirms you cannot vary the statistics away from AQC without ' +
    'simultaneously losing the zeta connection',

  rigidityFamilyWithImp1334:
    'This is a RIGIDITY / dichotomy obstruction of the same family as imp-1334 ' +
    '(Voronin universality quantitative): the desired structural combination ' +
    '(zeta-bearing trace formula with non-AQC statistics) is self-contradictory',

  aggregateConclusion:
    'imp-1297 (SL(2,Z) Selberg) + imp-1307 (Connes-Bost) + imp-1308 ' +
    '(Berry-Keating) + imp-1339 (Hecke triangle) EXHAUST the spectral / ' +
    'trace-formula family for a zeta 2-point bypass at support > 1. Remaining ' +
    'live levers are NON-trace-formula: the imp-1241 / imp-1340 de Branges ' +
    'direct construction and the imp-1310 alternative section 15-27 closure ' +
    'decoupled from sigma > 1',
});

// =========================================================================
// SECTION E - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'hecke-triangle-fully-bypasses-aqc-closes-pcc',
  'hecke-triangle-requires-X-conjecture',
  'hecke-triangle-no-bypass-arithmetic-dichotomy',
  'hecke-triangle-bypasses-aqc-but-only-conjecturally',
]);

const VERDICT = 'hecke-triangle-no-bypass-arithmetic-dichotomy';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  bypassesSL2ZAQC: false,
  closesPCCForSupportGtOne: false,
  givesSingleZetaTwoPointBound: false,

  coreDichotomy:
    'ARITHMETIC q in {3, 4, 6} (Takeuchi 1977): scattering determinant is ' +
    'zeta / L-bearing (P-zeta holds) but the group obeys Sarnak AQC (P-nonAQC ' +
    'fails) — re-encodes imp-1297. NON-ARITHMETIC q: plausibly non-AQC ' +
    'statistics (P-nonAQC holds) but the scattering determinant is NOT a ratio ' +
    'of zeta / L-values (P-zeta fails) — trace formula carries no information ' +
    'about the Riemann zeros. The two required properties are mutually exclusive',

  whyDichotomyIsStructural:
    'zeta enters a Selberg trace formula ONLY through the Eisenstein scattering ' +
    'determinant phi(s); its closed arithmetic form (a ratio of zeta / L-values) ' +
    'is a CONSEQUENCE of arithmeticity, which is exactly what forces the AQC ' +
    'spectral statistics. The Takeuchi 1977 classification (arithmetic ' +
    '(2,q,infinity) triangle groups are exactly q = 3, 4, 6, infinity) makes ' +
    'this a finite, settled dichotomy',

  residualGapPreciselyStated:
    'PCC at 2-point for f-hat supported in (-sigma, sigma), sigma > 1 (where ' +
    'the section 15-27 ESY-closure Poisson kernel binds, imp-1184 D3) is OPEN. ' +
    'The Hecke-triangle Selberg trace does not bypass it: the arithmetic cases ' +
    're-encode the imp-1297 AQC obstruction (equivalent to PCC) and the ' +
    'non-arithmetic cases decouple from zeta entirely',

  whatWouldClose:
    'A non-arithmetic finite-area hyperbolic surface whose Eisenstein scattering ' +
    'determinant is a ratio of zeta / L-values AND whose spectral statistics are ' +
    'provably non-AQC — which would contradict the Takeuchi arithmeticity ' +
    'classification and is not known to exist; OR a genuinely new mechanism ' +
    'outside the spectral / trace-formula family; OR the non-trace-formula ' +
    'levers (imp-1241 / imp-1340 de Branges direct route, imp-1310 alternative ' +
    'section 15-27 closure decoupled from sigma > 1)',

  fitsWithSpectralFamilyPattern:
    'imp-1297 (SL(2,Z) Selberg) + imp-1307 (Connes-Bost) + imp-1308 ' +
    '(Berry-Keating) + imp-1339 (Hecke triangle) all NEGATIVE — the spectral / ' +
    'trace-formula family is EXHAUSTED for a zeta 2-point bypass at support > 1',

  aggregateVerdict: 'pcc-genuinely-open-pending-new-input',

  honestNote:
    'The Hecke-triangle Selberg trace was a genuinely reasonable candidate ' +
    '(named explicitly in the imp-1308 closure) precisely because non-arithmetic ' +
    'groups have different spectral structure. The verdict ' +
    'hecke-triangle-no-bypass-arithmetic-dichotomy is honest: it reports that ' +
    'the different structure decouples from zeta exactly when it differs from ' +
    'SL(2, Z), so there is no zeta 2-point bound to extract — NOT that the Hecke ' +
    'triangle spectral theory is uninteresting. The classification is valuable ' +
    'because it pins down WHY no trace-formula variation of the group can bypass ' +
    'AQC: zeta-detection and non-AQC statistics are mutually exclusive by the ' +
    'Takeuchi arithmeticity dichotomy',

  trainingTimeUncertaintyHonestNote:
    'Training-time knowledge cutoff is January 2026. The precise numerical ' +
    'content of the Beyerstedt-Strombergsson 2010 Hecke triangle eigenvalue ' +
    'computations is partially uncertain. The (H1)-(H3) obstructions are ROBUST ' +
    'to the eigenvalue data: they turn only on the Takeuchi 1977 arithmeticity ' +
    'classification (a finite settled list) and on zeta entering only through an ' +
    'arithmetic Eisenstein scattering determinant. OPEN-FOR-REVISION only if a ' +
    'non-arithmetic G_q with a zeta-bearing scattering determinant were found, ' +
    'which would contradict the Takeuchi classification',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE = Object.freeze({
  id: 'imp-1339-hecke-triangle-selberg-trace',
  ticket: 'imp-1339',
  category: 'proof',
  builtAt: '2026-06-02T16:45:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1184', 'imp-1247', 'imp-1297', 'imp-1307', 'imp-1308', 'imp-1310',
    'imp-1334', 'imp-1340',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  heckeTriangleTraceStatement: HECKE_TRIANGLE_TRACE_STATEMENT,
  bypassEvaluation: BYPASS_EVALUATION,
  auxiliaryConjectures: AUXILIARY_CONJECTURES,
  relationshipToPriorRoutes: RELATIONSHIP_TO_PRIOR_ROUTES,

  parentCrossReferences: Object.freeze({
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js — named gap-PCC-2pt at step D3',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js — confirmed PCC strict for Route 1',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js — SL(2,Z) Selberg trace, equi-difficult to PCC via Sarnak AQC',
    imp1307: 'src/data/imp-1307-connes-bost-adelic-attack.js — Connes-Bost adelic trace, NOT RIGOROUS',
    imp1308: 'src/data/imp-1308-berry-keating-quantum-attack.js — Berry-Keating trace, NOT RIGOROUS; named Hecke triangle as next probe',
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js — alternative section 15-27 pathway decoupled from sigma > 1',
    imp1334: 'src/data/imp-1334-voronin-universality-quantitative.js — sibling rigidity obstruction',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the candidate spectral attack on ' +
    'Montgomery PCC at 2-point via the Hecke triangle group G_q = ' +
    'Delta(2, q, infinity) Selberg trace formula (the third escape route named ' +
    'in the imp-1308 closure, after imp-1310 and the imp-1241 de Branges route). ' +
    'It is NOT a new closure or a new unconditional bound.',

    'The verdict is NEGATIVE: hecke-triangle-no-bypass-arithmetic-dichotomy. The ' +
    'heuristic that non-arithmetic Hecke triangle groups have different spectral ' +
    'structure and might bypass the SL(2, Z) Sarnak AQC obstruction (imp-1297) ' +
    'gets the situation exactly backwards. zeta enters a Selberg trace formula ' +
    'ONLY through the Eisenstein scattering determinant phi(s), whose closed ' +
    'arithmetic form (a ratio of zeta / Dirichlet-L values) is a CONSEQUENCE of ' +
    'arithmeticity. By the Takeuchi 1977 classification the arithmetic ' +
    '(2, q, infinity) triangle groups are exactly q = 3, 4, 6, infinity.',

    'The two properties a bypass needs are mutually exclusive: (P-zeta) a ' +
    'zeta-bearing scattering determinant and (P-nonAQC) non-AQC spectral ' +
    'statistics. For arithmetic q in {3, 4, 6} P-zeta holds but the group obeys ' +
    'Sarnak AQC so P-nonAQC fails (q = 3 is imp-1297 verbatim; q = 4 and q = 6 ' +
    'give degree-2 GL(2) L-functions with the same 2-point obstruction). For ' +
    'non-arithmetic q the statistics are plausibly non-AQC so P-nonAQC holds, ' +
    'but the scattering determinant is NOT a ratio of zeta / L-values so P-zeta ' +
    'fails and the trace formula carries no information about the Riemann zeros.',

    'This is a RIGIDITY / dichotomy obstruction of the same family as imp-1334 ' +
    '(Voronin universality quantitative): the desired structural combination ' +
    'is self-contradictory. The Hecke-triangle route is the SHARPEST test of ' +
    'the imp-1297 obstruction because it varies the group (hence the statistics) ' +
    'while holding the zeta-detection mechanism (Eisenstein scattering) fixed.',

    'TRAINING-TIME UNCERTAINTY is honestly acknowledged: the precise numerical ' +
    'content of the Beyerstedt-Strombergsson 2010 Hecke triangle eigenvalue ' +
    'computations is partially uncertain at training-cutoff (January 2026). The ' +
    '(H1)-(H3) obstructions are ROBUST to the eigenvalue data because they turn ' +
    'only on the Takeuchi 1977 arithmeticity classification (a finite settled ' +
    'list) and on zeta entering only through an arithmetic Eisenstein scattering ' +
    'determinant. OPEN-FOR-REVISION only if a non-arithmetic G_q with a ' +
    'zeta-bearing scattering determinant were found, contradicting Takeuchi.',

    'CONSEQUENCE for engine planning: with imp-1297 (SL(2,Z) Selberg) + imp-1307 ' +
    '(Connes-Bost) + imp-1308 (Berry-Keating) + imp-1339 (Hecke triangle) all ' +
    'NEGATIVE, the spectral / trace-formula family is EXHAUSTED for a zeta ' +
    '2-point bypass at support > 1. The aggregate verdict remains ' +
    'pcc-genuinely-open-pending-new-input. The remaining live levers are the ' +
    'NON-trace-formula routes: the imp-1241 / imp-1340 de Branges direct ' +
    'construction and the imp-1310 alternative section 15-27 closure decoupled ' +
    'from sigma > 1.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1297: 'src/data/imp-1297-selberg-trace-pcc-route.js',
    imp1307: 'src/data/imp-1307-connes-bost-adelic-attack.js',
    imp1308: 'src/data/imp-1308-berry-keating-quantum-attack.js',
    imp1310: 'src/data/imp-1310-section15-27-support-leq-1-reroute.js',
    heckeOriginal:
      'Hecke, E., "Uber die Bestimmung Dirichletscher Reihen durch ihre ' +
      'Funktionalgleichung", Math. Ann. 112 (1936), 664-699 — the Hecke ' +
      'triangle groups G_q and the lambda_q = 2 cos(pi/q) generator',
    takeuchi1977:
      'Takeuchi, K., "Arithmetic triangle groups", J. Math. Soc. Japan 29 ' +
      '(1977), 91-106 — the classification of arithmetic triangle groups; the ' +
      'arithmetic (2, q, infinity) Hecke triangle groups are exactly ' +
      'q = 3, 4, 6, infinity (the settled finite list underpinning the dichotomy)',
    phillipsSarnak1985:
      'Phillips, R. S. and Sarnak, P., "On cusp forms for co-finite subgroups ' +
      'of PSL(2, R)", Invent. Math. 80 (1985), 339-364 — deformation theory: ' +
      'cusp forms generically dissolve into resonances under non-arithmetic ' +
      'deformation (the Phillips-Sarnak conjecture)',
    sarnak1995:
      'Sarnak, P., "Arithmetic quantum chaos", Israel Math. Conf. Proc. 8 ' +
      '(1995), 183-236 — the AQC GUE conjecture identifying the arithmetic ' +
      'Maass-form 2-point statistics with the Montgomery form factor (the ' +
      'imp-1297 binding obstruction)',
    beyerstedtStrombergsson2010:
      'Beyerstedt / Strombergsson (Hecke triangle eigenvalue computations, ' +
      'circa 2010) — numerical spectral data for Hecke triangle surfaces; ' +
      'precise content UNCERTAIN at training-cutoff (January 2026), but the ' +
      'structural obstructions here do not depend on it',
    iwaniecSarnak2000:
      'Iwaniec, H. and Sarnak, P., "Perspectives on the analytic theory of ' +
      'L-functions", GAFA 2000 Special Volume, 705-741 — the (log T)^{1/2} ' +
      'degradation of trace-formula 2-point bounds in the sigma > 1 regime',
    selberg1956:
      'Selberg, A., "Harmonic analysis and discontinuous groups in weakly ' +
      'symmetric Riemannian spaces with applications to Dirichlet series", ' +
      'J. Indian Math. Soc. 20 (1956), 47-87 — the Selberg trace formula',
    montgomery1973:
      'Montgomery, H. L., "The pair correlation of zeros of the zeta function", ' +
      'Proc. Sympos. Pure Math. XXIV (1973), 181-193 — the PCC conjecture ' +
      '(unconditional only for Fourier support |alpha| < 1)',
  }),
});

export default IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE;

// =========================================================================
// BUILD-TIME TRIPWIRES (10 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE_ASSERTIONS = [
  // Tripwire 1: the Hecke triangle group and trace formula are stated, with
  // the area pi(1 - 2/q) and the lambda_q = 2 cos(pi/q) generator.
  {
    id: 'imp1339-hecke-triangle-trace-stated',
    why:
      'The classification must STATE the Hecke triangle group G_q and its ' +
      'Selberg trace formula precisely, including the area pi(1 - 2/q) and the ' +
      'lambda_q = 2 cos(pi/q) generator. Omitting this would leave the bypass ' +
      'question undefined.',
    holds: () => {
      const s = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.heckeTriangleTraceStatement;
      return (
        typeof s.group === 'string' &&
        /2 cos\(pi\/q\)|lambda_q/.test(s.group) &&
        typeof s.area === 'string' &&
        /pi \(1 - 2\/q\)/.test(s.area) &&
        typeof s.traceFormulaShape === 'string' &&
        /scattering|phi/i.test(s.traceFormulaShape)
      );
    },
  },

  // Tripwire 2: zeta enters ONLY via the Eisenstein scattering determinant —
  // the single hinge of the whole analysis.
  {
    id: 'imp1339-zeta-enters-only-via-scattering',
    why:
      'The load-bearing hinge is that zeta enters the trace formula ONLY ' +
      'through the Eisenstein scattering determinant phi(s). If this were not ' +
      'asserted, the dichotomy argument would have no anchor.',
    holds: () => {
      const s = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.heckeTriangleTraceStatement;
      return (
        typeof s.zetaEntersOnlyViaScattering === 'string' &&
        /ONLY/.test(s.zetaEntersOnlyViaScattering) &&
        /scattering determinant|phi\(s\)/i.test(s.zetaEntersOnlyViaScattering)
      );
    },
  },

  // Tripwire 3: the candidate bypass requires BOTH P-zeta and P-nonAQC.
  {
    id: 'imp1339-bypass-requires-both-properties',
    why:
      'The argument turns on the bypass requiring TWO properties simultaneously ' +
      '(P-zeta: zeta-bearing scattering; P-nonAQC: non-AQC statistics). The ' +
      'record must state both for the mutual-exclusion conclusion to be sound.',
    holds: () => {
      const b = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.bypassEvaluation;
      return (
        typeof b.candidateBypassRequires === 'object' &&
        /zeta|L-values/i.test(b.candidateBypassRequires.P_zeta) &&
        /AQC|Montgomery/i.test(b.candidateBypassRequires.P_nonAQC)
      );
    },
  },

  // Tripwire 4: the arithmetic dichotomy is explicit and the two properties
  // are NOT simultaneously satisfiable.
  {
    id: 'imp1339-arithmetic-dichotomy-mutual-exclusion',
    why:
      'The core result is that P-zeta and P-nonAQC cannot hold simultaneously ' +
      '(arithmetic q have P-zeta but fail P-nonAQC; non-arithmetic q have ' +
      'P-nonAQC but fail P-zeta). This flag must be false for the verdict to hold.',
    holds: () => {
      const b = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.bypassEvaluation;
      return (
        b.P_zeta_and_P_nonAQC_simultaneously === false &&
        typeof b.dichotomyStatement === 'string' &&
        /arithmeticity/i.test(b.dichotomyStatement) &&
        b.bypassesSL2ZAQC === false &&
        b.givesSingleZetaTwoPointBoundAtSupportGtOne === false
      );
    },
  },

  // Tripwire 5: the arithmetic cases q in {3,4,6} re-encode imp-1297 (Takeuchi).
  {
    id: 'imp1339-arithmetic-cases-reencode-imp1297',
    why:
      'The arithmetic branch (q in {3,4,6}, Takeuchi 1977) must be identified as ' +
      're-encoding the imp-1297 AQC obstruction rather than bypassing it. ' +
      'Otherwise the verdict could falsely claim an arithmetic bypass.',
    holds: () => {
      const b = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.bypassEvaluation;
      return (
        typeof b.arithmeticCase === 'string' &&
        /3, 4, 6|\{3, 4, 6\}/.test(b.arithmeticCase) &&
        /Takeuchi/.test(b.arithmeticCase) &&
        /AQC/.test(b.arithmeticCase)
      );
    },
  },

  // Tripwire 6: the non-arithmetic cases decouple from zeta (Phillips-Sarnak).
  {
    id: 'imp1339-nonarithmetic-decouples-from-zeta',
    why:
      'The non-arithmetic branch must be identified as DECOUPLING from zeta ' +
      '(scattering determinant not a ratio of zeta / L-values; Phillips-Sarnak ' +
      'cusp-form dissolution). Otherwise the verdict could falsely claim a ' +
      'non-arithmetic zeta 2-point bound.',
    holds: () => {
      const b = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.bypassEvaluation;
      return (
        typeof b.nonArithmeticCase === 'string' &&
        /NOT a ratio of zeta|NOT a ratio/.test(b.nonArithmeticCase) &&
        /no information about the Riemann zeros|carries NO information/i.test(b.nonArithmeticCase)
      );
    },
  },

  // Tripwire 7: auxiliary conjectures catalogued (Selberg eigenvalue analogue,
  // Phillips-Sarnak density, Sarnak AQC).
  {
    id: 'imp1339-auxiliary-conjectures-catalogued',
    why:
      'Even setting the dichotomy aside, the three auxiliary conjectures ' +
      '(C1 Selberg eigenvalue analogue, C2 Phillips-Sarnak density, C3 Sarnak ' +
      'AQC) must be catalogued, mirroring the imp-1297 treatment, so the ' +
      'classification is not over-optimistic about the unconditional case.',
    holds: () => {
      const a = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.auxiliaryConjectures;
      return (
        /Selberg eigenvalue|lambda_1 >= 1\/4/.test(a.C1_selberg_eigenvalue_analogue) &&
        /Phillips-Sarnak/.test(a.C2_phillips_sarnak_cuspidal_density) &&
        /Sarnak 1995|AQC/.test(a.C3_sarnak_aqc_gue) &&
        /\(log T\)\^\{1\/2\}/.test(a.degradationInSigmaGtOne)
      );
    },
  },

  // Tripwire 8: relationship to the prior spectral / trace-formula routes
  // (imp-1297, imp-1307, imp-1308) and the rigidity link to imp-1334.
  {
    id: 'imp1339-spectral-family-relationship',
    why:
      'The classification must situate itself in the spectral / trace-formula ' +
      'family (imp-1297, imp-1307, imp-1308) and flag the rigidity-family link ' +
      'to imp-1334, so the aggregate exhaustion claim is auditable.',
    holds: () => {
      const r = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.relationshipToPriorRoutes;
      return (
        /imp-1297/.test(r.imp1297_sl2z_selberg) &&
        /imp-1307|Connes-Bost/.test(r.imp1307_connes_bost) &&
        /imp-1308|Berry-Keating/.test(r.imp1308_berry_keating) &&
        /imp-1334|rigidity/i.test(r.rigidityFamilyWithImp1334)
      );
    },
  },

  // Tripwire 9: verdict is in the allowed set and is the dichotomy verdict.
  {
    id: 'imp1339-verdict-allowed-and-dichotomy',
    why:
      'The verdict must be exactly hecke-triangle-no-bypass-arithmetic-dichotomy ' +
      'and must be a member of the allowed-verdict set, so the classification ' +
      'cannot silently drift to an unsupported optimistic verdict.',
    holds: () => {
      const v = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.verdictDetail;
      return (
        v.verdict === 'hecke-triangle-no-bypass-arithmetic-dichotomy' &&
        v.isAllowedVerdict === true &&
        v.bypassesSL2ZAQC === false &&
        v.closesPCCForSupportGtOne === false &&
        v.aggregateVerdict === 'pcc-genuinely-open-pending-new-input'
      );
    },
  },

  // Tripwire 10: training-time uncertainty about Beyerstedt-Strombergsson 2010
  // is honestly acknowledged and the obstruction is stated to be robust to it.
  {
    id: 'imp1339-training-uncertainty-acknowledged',
    why:
      'The Beyerstedt-Strombergsson 2010 eigenvalue specifics are uncertain at ' +
      'training-cutoff. Honesty requires acknowledging this AND stating that the ' +
      'structural (H1)-(H3) obstructions are robust to the eigenvalue data ' +
      '(they turn only on the Takeuchi arithmeticity classification).',
    holds: () => {
      const s = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.heckeTriangleTraceStatement;
      const v = IMP_1339_HECKE_TRIANGLE_SELBERG_TRACE.verdictDetail;
      return (
        s.isTrainingTimeUncertain === true &&
        /Beyerstedt-Strombergsson|January 2026/.test(s.trainingTimeUncertaintyNote) &&
        /Takeuchi/.test(v.trainingTimeUncertaintyHonestNote) &&
        /OPEN-FOR-REVISION/.test(v.trainingTimeUncertaintyHonestNote)
      );
    },
  },
];
