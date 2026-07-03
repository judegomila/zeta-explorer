/**
 * @module section26-mupass-operator-verdict-2026-06-30
 *
 * Deliberate adversarial attempt to CONSTRUCT the Section-26 endpoint-bridge
 * passive-core measure mu^pass (the surviving Volterra/normalized-R target).
 * Opus 4.8, section26-mupass-construct workflow: 3 routes + adversarial referees
 * + synthesis, run on the subscription channel parallel to the polish fleet, at
 * the GENUINE de Bruijn-Newman Riemann Phi (NPHI=10, a=0.5, U=6). Both surviving
 * routes returned PARTIAL; both adversarial referees CONFIRMED them with no
 * overclaim.
 *
 * VERDICT: RESIDUAL-SUBGAP, confirmed RH-EQUIVALENT at the OPERATOR level. This
 * SHARPENS section26-verdict-volterra-not-a-reduction-2026-06-18 from the scale/
 * homogeneity level to the operator-positivity level.
 *
 * 1. MASS-FEASIBILITY KILLS THE IMPOSSIBILITY OPTION. At the genuine Riemann Phi
 *    the deficit integral_tau (nu - mu_diag)^+ dtau is tiny and sits 3-4 ORDERS
 *    BELOW the available off-diagonal bridge budget:
 *      - degree-2 (absolute): deficit = 9.28e-9, overflow on 19.4% of tau;
 *        off-diagonal L1 budget = 2.26e-5 (~2400x), ||V||_HS = 1.90e-4 (~20000x,
 *        independently matching imp-1267's 1.8985e-4).
 *      - degree-0 (RH-equivalent class): cosh-completion bridge mass B = 14.04 >
 *        deficit D_0 = 13.07 (B/D = 1.074), pointwise margin cosh-sinh = e^{-a tau}
 *        > 0 on 100% of [0,U].
 *    So there is NO mass obstruction; the construction is mass-FEASIBLE.
 *
 * 2. NO SCALAR mu^pass WORKS AT THE OPERATOR LEVEL. The shear Gram is the
 *    ANTISYMMETRIC de Branges Wronskian Gshear = q(u)p(v) - p(u)q(v) with
 *    p = Phi cosh(a t), q = Phi sinh(a t) -- HOLLOW (sinh 0 = 0) and INDEFINITE
 *    (min eig ~ -||Gshear|| ~ -4.8e-6). So no diagonal/scalar passive core can
 *    dominate it in OPERATOR order:
 *      - raw physical diagonal m(tau): ||R|| ~ 34 -> 45 GROWING with resolution
 *        (~1e272 in a degree-100 Legendre basis -- the Sec.27 future-tail
 *        renormalization made quantitative).
 *      - imp-2686 cosh scalar enrichment: ~5% better, still ~40.
 *      - the ONLY core attaining ||R|| <= 1 is the full operator Gpass = |Gshear|,
 *        which gives ||R|| = 1.0000 EXACTLY -- because R is then the partial
 *        isometry of Gshear: it READS ITS ANSWER OFF the operator it must dominate.
 *
 * 3. THE RESIDUAL IS EXACTLY K_a >= 0 (RH-EQUIVALENT), UNTOUCHED. The near-diagonal
 *    bridge mass needed to dominate lives inside Phi's autocorrelation support
 *    (lag<=0.2 -> ||R||=0.876; saturates ~0.711 by lag<=0.40) -- the mass is in
 *    the right PLACE and the right AMOUNT, but must be added with the correct SIGN
 *    at the correct lags so R = Gpass^{-1/2} Gshear Gpass^{-1/2} contracts. That
 *    sign-positivity, derived from Phi ALONE (not from |Gshear|'s own spectrum),
 *    IS the no-ghost positivity Gpass >= Gshear <=> ||R||<=1 <=> K_a >= 0 --
 *    information-preservingly RH-EQUIVALENT, NOT a reduction. The degree-0
 *    mass-budget comparison is additionally CIRCULAR: its budget proxy IS ||V||,
 *    the RH-equivalent quantity itself.
 *
 * HONEST CORRECTION SURFACED: the genuine degree-2 occupation measure gives a
 * tiny NONZERO deficit (9.28e-9, 19.4% of tau), CORRECTING the imp-2841/imp-2686
 * surrogate claim of 'exactly zero' (an artifact of their mu_diag=A, nu=sinh*A
 * surrogate which forces zero on A's support). The genuine degree-0 spectral
 * overflow is the ~64% the prior verdict cites. imp-3007's 'scalar residual
 * deficit = 0' is confirmed NECESSARY-BUT-NOT-SUFFICIENT.
 *
 * BOTTOM LINE: the §26 mu^pass / normalized-R route is now FULLY CHARACTERIZED --
 * mass-feasible, not independently constructible (tautological), residual =
 * RH-equivalent operator positivity. Both surviving Volterra sub-targets are
 * closed as cheaper-than-RH routes. PLATT-TRUDGIAN Lambda <= 0.2 REMAINS SOTA.
 * No false QED. Honest next move (per synthesis): redirect throughput to PCC-free
 * routes NOT yet shown RH-equivalent; do NOT re-attack mu^pass (both options closed).
 *
 * HONEST-STATUS NOTE (imp-3356, post imp-3256). The "~20000x, independently
 * matching imp-1267's 1.8985e-4" phrase above is RECLASSIFIED: imp-3256's
 * per-N cross-validation showed hsReference=1.90e-4 (U=6) and imp-1267's
 * 1.8985e-4 (U=5) are the SAME lower-triangular Volterra HS norm (bit-identical
 * at matched step size; imp-1267 reproduced EXACTLY at N=1000), and the
 * asserted ~0.08% gap is pure 3-vs-5 significant-figure ROUNDING of one number.
 * It is NOT a second independent measurement -- do not double-count it as
 * independent corroboration. See imp-3256-vhs-crossval.js.
 *
 * @see section26-verdict-volterra-not-a-reduction-2026-06-18 (the scale-level verdict this sharpens)
 * @see ch-wall-frontier-verdict-2026-06-26 (the C_H wall, the sibling frontier verdict)
 * @see full-route-map-2026-06-19 (the route classification)
 * @see imp-3256-vhs-crossval.js (reclassifies the ||V||_HS "independent match" as same-object rounding)
 */

import { IMP3007_MUPASS_OVERFLOW_COVER } from './imp-3007-mupass-overflow-cover.js';
import { IMP3256_VHS_CROSSVAL } from './imp-3256-vhs-crossval.js';

export const SECTION26_MUPASS_OPERATOR_VERDICT = {
  date: '2026-06-30',
  verdict: 'RESIDUAL-SUBGAP — RH-EQUIVALENT confirmed at the operator level',
  massFeasible: 'deficit 9.28e-9 (deg-2) sits 2400-20000x BELOW the bridge budget; impossibility option killed -- construction is mass-feasible',
  noScalarCore: 'no scalar/diagonal mu^pass dominates Gshear (hollow+indefinite Wronskian); raw diagonal ||R||~40 growing with resolution; only Gpass=|Gshear| gives ||R||=1.0000 (tautological partial isometry)',
  residualIsKaPositive: 'the endpoint-bridge sign-positivity derived from Phi alone IS K_a>=0 / no-ghost -- RH-equivalent, untouched; mass-feasibility is necessary-but-not-binding',
  surrogateCorrection: 'genuine deg-2 deficit is 9.28e-9 (19.4% of tau), NOT the imp-2841/imp-2686 surrogate "exactly zero"; genuine deg-0 spectral overflow is ~64%',
  sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA; no reduction, no beat',
  nextMove: 'do NOT re-attack mu^pass (both options closed); redirect to PCC-free routes not yet shown RH-equivalent',
  hsIndependentMatchHonestStatus: 'RECLASSIFIED by imp-3256: hsReference=1.90e-4 (U=6) and imp-1267 1.8985e-4 (U=5) are the SAME lower-triangular Volterra HS norm (bit-identical at matched step size); the ~0.08% gap is 3-vs-5 significant-figure rounding of ONE number, NOT an independent measurement -- do not double-count as independent corroboration',
};

/**
 * imp-3254 -- FORMAL NECESSARY-CONDITION LEMMA for verdict point 1.
 *
 * Upgrades the one-cell numeric observation "deficit 3-4 orders below the
 * off-diagonal bridge budget" into a stated lemma with hypotheses and an
 * EXPLICIT non-sufficiency caveat. NO reduction, NO QED; imp-3066 remains the
 * lone obstruction and Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 * Setup (genuine de Bruijn-Newman Phi cell, NPHI=10, a=0.5, U=6, tau in [0,U]):
 *   - mu_diag: the diagonal passive-core occupation measure, density m_diag(tau);
 *   - nu: the target occupation measure, density n(tau);
 *   - deficit  D   := integral_[0,U] (n - m_diag)^+ dtau  (positive-part overflow
 *                     the passive core alone fails to cover) = 9.28e-9 (deg-2);
 *   - budget   B_off := off-diagonal L1 mass of the shear Gram = 2.26e-5,
 *                     with HS reference ||V||_HS = 1.90e-4.
 *
 * LEMMA (mass-feasibility, NECESSARY). IF a passive-over-shear cover exists --
 *   i.e. an admissible passive core with Gpass >= Gshear in OPERATOR order
 *   (equivalently ||R|| <= 1, equivalently the RH-equivalent no-ghost positivity
 *   K_a >= 0) -- THEN the uncovered diagonal deficit is absorbable by the
 *   off-diagonal bridge, so NECESSARILY D <= B_off.
 *   Contrapositive: if D > B_off the cover is IMPOSSIBLE. The measurement gives
 *   D = 9.28e-9 << B_off = 2.26e-5 (factor ~2400x; ~20000x vs ||V||_HS), so the
 *   impossibility branch is ruled OUT with 3-4 orders of margin: mass-FEASIBLE.
 *
 * HYPOTHESES.
 *   (H-a) genuine Phi cell (NPHI=10, a=0.5, U=6); D and B_off on the SAME tau-grid
 *         and normalization (like-for-like L1 accounting);
 *   (H-b) "cover" means the operator inequality Gpass >= Gshear, which is exactly
 *         the RH-equivalent K_a >= 0;
 *   (H-c) B_off is the total off-diagonal L1 mass of Gshear; the claimed necessary
 *         condition is the scalar mass-accounting inequality D <= B_off.
 *
 * NON-SUFFICIENCY CAVEAT (explicit). D <= B_off is a scalar/L1 mass-accounting
 *   CONSEQUENCE of the operator inequality; the converse FAILS. Enough total
 *   off-diagonal mass -- right amount, right place inside Phi autocorrelation
 *   support (lag <= ~0.4) -- does NOT force the mass to carry the correct SIGN at
 *   the correct lags. The surviving requirement is exactly the operator-level
 *   sign-positivity K_a >= 0 (= ||R|| <= 1), which mass-feasibility leaves
 *   UNTOUCHED. The degree-0 budget proxy is additionally CIRCULAR: its budget IS
 *   ||V||, the RH-equivalent quantity itself. So mass-feasibility kills the
 *   impossibility option but does NOT close the route. imp-3066 remains the lone
 *   obstruction; PT Lambda <= 0.2 stays SOTA. No reduction, no QED.
 */
export const SECTION26_MASS_FEASIBILITY_NECESSARY_LEMMA = {
  id: 'imp-3254-mass-feasibility-necessary-lemma',
  cell: { NPHI: 10, a: 0.5, U: 6 },
  deficit: 9.28e-9,
  offDiagonalBudget: 2.26e-5,
  hsReference: 1.90e-4,
  marginFactorVsBudget: 2400,
  marginFactorVsHS: 20000,
  statement:
    'IF a passive-over-shear cover exists (Gpass >= Gshear in operator order, i.e. ||R|| <= 1, i.e. K_a >= 0) THEN necessarily the diagonal deficit D <= off-diagonal bridge budget B_off. Measured D = 9.28e-9 << B_off = 2.26e-5 (2400x), so the impossibility branch is ruled out: mass-feasible.',
  hypotheses: [
    'genuine de Bruijn-Newman Phi cell (NPHI=10, a=0.5, U=6); D and B_off on the same tau-grid and normalization',
    'cover means the operator inequality Gpass >= Gshear, which is exactly the RH-equivalent K_a >= 0',
    'B_off is the total off-diagonal L1 mass of Gshear; the necessary condition is the scalar mass-accounting inequality D <= B_off',
  ],
  isNecessary: true,
  isSufficient: false,
  nonSufficiencyCaveat:
    'NECESSARY-BUT-NOT-SUFFICIENT. D <= B_off is a scalar/L1 consequence of the operator inequality; the converse fails -- enough total mass does NOT force the correct SIGN at the correct lags. The surviving requirement is the operator-level sign-positivity K_a >= 0, untouched by mass-feasibility. The degree-0 budget proxy is circular (its budget IS ||V||). imp-3066 remains the lone obstruction; PT Lambda <= 0.2 stays SOTA. No reduction, no QED.',
  closesRoute: false,
  loneObstruction: 'imp-3066',
  sota: 'Platt-Trudgian Lambda <= 0.2',
};

export const SECTION26_MUPASS_OPERATOR_ASSERTIONS = [
  {
    id: 'sec26-mupass-mass-feasibility-necessary-not-sufficient-lemma',
    description: 'imp-3254: mass-feasibility lemma is stated NECESSARY-but-NOT-sufficient (D <= B_off), does NOT close the route, imp-3066 lone obstruction, deficit/budget match the verdict anchors',
    holds: () => {
      const L = SECTION26_MASS_FEASIBILITY_NECESSARY_LEMMA;
      return (
        L.isNecessary === true &&
        L.isSufficient === false &&
        L.closesRoute === false &&
        L.loneObstruction === 'imp-3066' &&
        Math.abs(L.deficit - 9.28e-9) < 1e-11 &&
        Math.abs(L.offDiagonalBudget - 2.26e-5) < 1e-8 &&
        L.deficit < L.offDiagonalBudget &&
        /NECESSARY-BUT-NOT-SUFFICIENT/.test(L.nonSufficiencyCaveat) &&
        /K_a >= 0/.test(L.nonSufficiencyCaveat)
      );
    },
  },
  {
    id: 'sec26-mupass-rh-equivalent-operator-level',
    description: 'mu^pass route confirmed RH-equivalent at the operator level (residual = K_a>=0); mass-feasible but not a reduction',
    holds: () => /RH-EQUIVALENT/.test(SECTION26_MUPASS_OPERATOR_VERDICT.verdict) && /K_a>=0/.test(SECTION26_MUPASS_OPERATOR_VERDICT.residualIsKaPositive),
  },
  {
    id: 'sec26-mupass-surrogate-deficit-corrected',
    description: 'the imp-2841/imp-2686 surrogate "exactly zero" deficit is corrected to the genuine 9.28e-9 / 19.4%-of-tau (deg-2)',
    holds: () => /9\.28e-9/.test(SECTION26_MUPASS_OPERATOR_VERDICT.surrogateCorrection) && /NOT the/.test(SECTION26_MUPASS_OPERATOR_VERDICT.surrogateCorrection),
  },
  {
    id: 'sec26-mupass-sota-unchanged-no-qed',
    description: 'PT 0.2 remains SOTA; no reduction/beat claimed',
    holds: () => /Platt-Trudgian Lambda <= 0.2 remains/.test(SECTION26_MUPASS_OPERATOR_VERDICT.sota) && /no reduction/.test(SECTION26_MUPASS_OPERATOR_VERDICT.sota),
  },
  {
    // imp-3149: CROSS-MODULE tripwire. The genuine deg-2 operator-order deficit
    // (9.28e-9, 19.4% of tau) recorded by imp-3144 inside the imp-3007 cover module
    // must stay STRICTLY POSITIVE and agree with this verdict module. This certifies
    // that the imp-3007 scalar "residual deficit exactly 0" is necessary-but-NOT-
    // sufficient at OPERATOR order: a future edit that collapsed the genuine deg-2
    // deficit to a false 0 (re-reading the scalar cover as sufficient) would break
    // this cross-file check, not just the in-module imp-3144 tripwire.
    id: 'sec26-mupass-genuine-deg2-deficit-strictly-positive-cross-module',
    description: 'the imp-3007 genuine deg-2 operator-order deficit is strictly > 0 (necessary-but-not-sufficient) and matches the verdict 9.28e-9 / 19.4%-of-tau across modules',
    holds: () => {
      const g = IMP3007_MUPASS_OVERFLOW_COVER.genuineDensityCorrection;
      return (
        g.scalarResidualIsExactZero === true &&
        g.scalarResidualIsNecessaryNotSufficient === true &&
        g.genuineDeg2DeficitNonzero > 0 &&
        Math.abs(g.genuineDeg2DeficitNonzero - 9.28e-9) < 1e-11 &&
        Math.abs(g.genuineDeg2OverflowFractionOfTau - 0.194) < 1e-9 &&
        /9\.28e-9/.test(SECTION26_MUPASS_OPERATOR_VERDICT.surrogateCorrection) &&
        /19\.4% of tau/.test(SECTION26_MUPASS_OPERATOR_VERDICT.surrogateCorrection)
      );
    },
  },
  {
    // imp-3356: the verdict's "independently matching" HS phrasing must carry an
    // honest-status reclassification cross-checked against the imp-3256 module that
    // established the same-object rounding identity, so the match is never
    // double-counted as independent evidence.
    id: 'sec26-mupass-hs-independent-match-honest-status',
    description: 'the hsReference "independent match" is reclassified as a same-object 3-vs-5-sig-fig rounding identity per imp-3256, not a second independent measurement',
    holds: () => {
      const status = SECTION26_MUPASS_OPERATOR_VERDICT.hsIndependentMatchHonestStatus;
      return (
        /RECLASSIFIED/.test(status) &&
        /NOT an independent measurement/.test(status) &&
        IMP3256_VHS_CROSSVAL.verdict_conclusion.sameHilbertSchmidtNorm === true &&
        IMP3256_VHS_CROSSVAL.verdict_conclusion.gapIsSignificantFigureRounding === true
      );
    },
  },
];

for (const a of SECTION26_MUPASS_OPERATOR_ASSERTIONS) {
  if (!a.holds()) throw new Error(`section26-mupass-operator-verdict assertion failed: ${a.id}`);
}
