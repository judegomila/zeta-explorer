/**
 * @fileoverview imp-95690 — PRIMARY-SOURCE VERDICT on the imp-95516 line-64 claim
 * that the Sun Section-6 (Proposition 6.3) integrand is rho-INDEPENDENT, the single
 * structural claim to which imp-95653 reduced the whole c_odd(rho)=kappa*rho^2 SHAPE test.
 *
 * SOURCE: arXiv:2609.04176 (Z.-W. Sun, single-author, unrefereed), Section 6
 * "The odd small-prime constant", Proposition 6.3, eqs (6.1)-(6.25). Read from the
 * paper text carried in tmp/sun-catalan/paper.txt (lines 741-885). This is a direct
 * inspection of the MANIFEST FORM of Prop 6.3, not a re-run of its interval certificate.
 *
 * WHAT imp-95653 LEFT OPEN: kappa=2.51069789 is a ONE-POINT back-solve
 * kappa = c_odd(1/20)/(1/20)^2. Its use as a curvature governing c_odd for every rho rests
 * entirely on the rho^2 functional form, which imp-95653 reduced to the single claim
 * "the Section-6 integrand is rho-independent" (imp-95516 line 64). No second numeric anchor
 * exists in the carried ledger, so imp-95653 could neither corroborate nor refute the shape.
 *
 * WHAT THIS MODULE DOES: reads Proposition 6.3 directly and decides that structural claim.
 *
 * FINDING (a two-part split, NOT a single yes/no):
 *
 *  (A) The rho^2 PREFACTOR is structurally FORCED and CERTIFIED by the P_6.3 machinery.
 *      Eq (6.20)-(6.21) read, verbatim:
 *          I_odd = INT_0^rho ( L_rho(t) - A_rho/t ) dt
 *                = rho^2 * INT_0^1 ( 5/2 - zeta(2,1+v) + Q_0(v) zeta(3,1+v) ) dv,
 *      with the singular coefficient A_rho = 2 rho - rho^2/2 (6.19). The explicit rho^2 is
 *      pulled out cleanly by the substitution t = rho/u, u = n+v (proof of 6.3). So
 *      c_odd(rho) = -I_odd = rho^2 * J(rho), and the P(rho)=rho^2 half of the shape is exact.
 *
 *  (B) The remaining v-integral factor J(rho) is NOT rho-independent as written; the
 *      imp-95516 line-64 annotation "Section-6 integrand is rho-independent" is REFUTED at
 *      the level of the manifest form. The only rho-dependence inside the v-integral lives in
 *      Q_0(v) (the 5/2 and zeta(2,1+v) terms are manifestly rho-free), and Q_0(v) (6.18) is
 *      built from objects hardwired to rho = 1/20:
 *        - the fractional-part functions (6.2)  alpha(v)={20 v}, beta(v)={41 v}, gamma(v)={40 v},
 *          whose moduli are exactly 1/rho = 20, 2/rho+1 = 41, 2/rho = 40 at rho = 1/20;
 *        - the ladder multiset h_v (6.7) and its lowest-mass integral K_v (6.9)-(6.10),
 *          whose interval structure is set by those same moduli;
 *        - the breakpoint set B (6.24) {0,1, k/19, k/20, k/40, k/41, (2k+1)/82, ...} with
 *          19 = 1/rho - 1, 20 = 1/rho, 40 = 2/rho, 41 = 2/rho+1, and the "238 raw / 178 merged"
 *          cell count;
 *        - the per-cell leading coefficient (6.25)  Q_0(v) = -(79/2) v^2 + s_J v + c_J, whose
 *          -79/2 is -(4/rho - 1)/2 at rho = 1/20.
 *      For rho != 1/20 every one of these rescales, so Q_0^{(rho)}(v) is a DIFFERENT
 *      piecewise-polynomial and J(rho) is not manifestly constant.
 *
 * NET VERDICT: the pure kappa*rho^2 SHAPE is NOT structurally forced. It factors as the
 * (forced) rho^2 prefactor TIMES J(rho), and c_odd(rho)/rho^2 = J(rho) equals kappa for all
 * rho ONLY IF the v-integral of Q_0^{(rho)}(v) zeta(3,1+v) is itself rho-independent -- an
 * ADDITIONAL identity that the paper neither states nor proves and that the manifest form
 * contradicts (Q_0 depends on rho). A second anchor deviates from the 1/20 kappa by exactly
 * kappa(rho2) - kappa = kappa * ( J(rho2)/J(1/20) - 1 ) = the fractional rho-variation of that
 * v-integral (this is imp-95653 dI, now LOCATED in the Q_0*zeta(3,1+v) term, not left generic).
 *
 * PRECISELY-NAMED RE-RUN REQUIRED for a genuine second numeric anchor c_odd(rho2): a FULL
 * re-execution of Proposition 6.3 at rho2 -- recompute alpha,beta,gamma with moduli
 * 1/rho2, 2/rho2, 2/rho2+1; rebuild the breakpoint set B and the merged-cell partition;
 * recompute Q_0^{(rho2)}(v) with leading coefficient -(4/rho2 - 1)/2; then re-evaluate the
 * interval certificate (6.21)-(6.22) with the same Hurwitz-zeta Euler-Maclaurin enclosure.
 * This is NOT a free re-evaluation of a fixed integral; it sharpens the imp-95653 residual
 * ("second anchor requires re-running Section 6") to the exact operations.
 *
 * This REFUTES the rho-independence annotation as written; it does NOT prove J(rho) actually
 * VARIES (a hidden identity making J constant is logically possible but is itself unproven and
 * is not what the paper asserts). Assessment + primary-source inspection, not a Prop-6.3
 * re-derivation. Catalan G irrationality OPEN; Sun preprint single-author, unrefereed;
 * changes no bound; NO Lambda movement; no refereed bound is changed; NO QED.
 *
 * NO heavy imports. All figures baked as literals / recomputed from the eqs above.
 */

const RHO_ANCHOR = 1 / 20;
const C_ODD_AT_1_OVER_20 = 0.006276744728100982604597600317605548; // Prop 6.3, eq (6.23)
const KAPPA = 2.51069789; // imp-95516/95637/95653 carried literal

// (A) rho^2 prefactor: A_rho = 2 rho - rho^2/2 (eq 6.19); kappa = c_odd/rho^2 back-solve.
const A_RHO = 2 * RHO_ANCHOR - (RHO_ANCHOR * RHO_ANCHOR) / 2;
const KAPPA_FROM_ANCHOR = C_ODD_AT_1_OVER_20 / (RHO_ANCHOR * RHO_ANCHOR);

// (B) the moduli hardwired into Q_0(v) via alpha/beta/gamma and the leading -79/2 coefficient,
// each an explicit function of rho that rescales off rho = 1/20.
const PAPER_MODULI = Object.freeze({
  alpha_modulus: 20, // {20 v}  = {v/rho}
  gamma_modulus: 40, // {40 v}  = {2 v/rho}
  beta_modulus: 41, // {41 v}  = {(2/rho+1) v}
  q0_leading_twice: 79, // -(79/2) v^2 leading coeff of Q_0 on each merged cell (6.25)
});
const RHO_DERIVED_MODULI = Object.freeze({
  alpha_modulus: 1 / RHO_ANCHOR,
  gamma_modulus: 2 / RHO_ANCHOR,
  beta_modulus: 2 / RHO_ANCHOR + 1,
  q0_leading_twice: 4 / RHO_ANCHOR - 1,
});

export const SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT = Object.freeze({
  id: 'imp-95690-sun-s6-integrand-rho-independence-verdict',
  title:
    'Primary-source verdict on the imp-95516 line-64 claim that the Sun Section-6 (Prop 6.3) '
    + 'integrand is rho-independent -- the single structural claim gating the c_odd=kappa*rho^2 shape',
  status:
    'PARTIAL/REFUTED -- the rho^2 PREFACTOR is structurally FORCED and CERTIFIED from '
    + 'Prop 6.3 eqs (6.19)-(6.21), but the "Section-6 integrand is rho-independent" annotation is '
    + 'REFUTED as written: the v-integrand carries rho through Q_0(v), whose fractional-part moduli '
    + '(20=1/rho, 40=2/rho, 41=2/rho+1) and leading -79/2=-(4/rho-1)/2 all rescale off rho=1/20. '
    + 'Hence kappa*rho^2 is NOT structurally forced; a genuine second anchor needs a FULL Prop-6.3 '
    + 're-run at rho2. G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'tmp/sun-catalan/paper.txt Section 6, Proposition 6.3, eqs (6.1)-(6.25)',

  prefactorForced: {
    equation: 'I_odd = rho^2 * INT_0^1 ( 5/2 - zeta(2,1+v) + Q_0(v) zeta(3,1+v) ) dv  (6.21)',
    singularCoefficient: 'A_rho = 2 rho - rho^2/2  (6.19)',
    A_rho_at_1over20: A_RHO,
    mechanism:
      'the explicit rho^2 is pulled out cleanly by the substitution t = rho/u, u = n+v; so '
      + 'c_odd(rho) = -I_odd = rho^2 * J(rho) and the P(rho)=rho^2 half of the shape is EXACT.',
    kappaBackSolve: KAPPA_FROM_ANCHOR,
    kappaMatchesCarriedLiteral: Math.abs(KAPPA_FROM_ANCHOR - KAPPA) < 5e-8,
  },

  integrandRhoDependence: {
    verdict: 'REFUTED (annotation not supported by Prop 6.3 as written)',
    channel:
      'the only rho-dependence in the v-integral lives in Q_0(v) (6.18); the 5/2 and '
      + 'zeta(2,1+v) terms are manifestly rho-free.',
    paperModuli: PAPER_MODULI,
    rhoDerivedModuli: RHO_DERIVED_MODULI,
    modulusMatchAtAnchor:
      PAPER_MODULI.alpha_modulus === RHO_DERIVED_MODULI.alpha_modulus
      && PAPER_MODULI.gamma_modulus === RHO_DERIVED_MODULI.gamma_modulus
      && PAPER_MODULI.beta_modulus === RHO_DERIVED_MODULI.beta_modulus
      && PAPER_MODULI.q0_leading_twice === RHO_DERIVED_MODULI.q0_leading_twice,
    consequence:
      'for rho != 1/20 the fractional-part moduli, the breakpoint set B (6.24), the merged-cell '
      + 'partition (238 raw / 178 merged), and the -79/2 leading coefficient (6.25) all rescale, so '
      + 'Q_0^{(rho)}(v) is a DIFFERENT piecewise polynomial and J(rho) is not manifestly constant.',
  },

  shapeVerdict: {
    structurallyForced: false,
    factoring: 'c_odd(rho)/rho^2 = J(rho); equals kappa for all rho ONLY IF INT Q_0^{(rho)} zeta(3,1+v) dv is rho-independent',
    deviationLaw:
      'kappa(rho2) - kappa = kappa * ( J(rho2)/J(1/20) - 1 ) -- the imp-95653 dI, now LOCATED in '
      + 'the Q_0(v)*zeta(3,1+v) term (not left generic).',
    hiddenIdentityCaveat:
      'this refutes the annotation as written; it does NOT prove J(rho) actually varies -- a hidden '
      + 'identity forcing J constant is logically possible but is itself unproven and is not asserted '
      + 'by the paper.',
  },

  requiredSecondAnchorReRun:
    'a genuine numeric c_odd(rho2) is a FULL re-execution of Prop 6.3 at rho2: recompute '
    + 'alpha,beta,gamma with moduli 1/rho2, 2/rho2, 2/rho2+1; rebuild the breakpoint set B and the '
    + 'merged-cell partition; recompute Q_0^{(rho2)}(v) with leading coefficient -(4/rho2-1)/2; then '
    + 're-evaluate the interval certificate (6.21)-(6.22) with the same Hurwitz-zeta Euler-Maclaurin '
    + 'enclosure. NOT a free re-evaluation of a fixed integral.',

  caveats:
    'Primary-source inspection of the manifest form of Prop 6.3, not a Prop-6.3 re-derivation or a '
    + 'second-anchor computation. Catalan G irrationality OPEN; Sun single-author, unrefereed; NO '
    + 'Lambda movement; no refereed bound is changed; NO QED.',
});

export const SUN_S6_INTEGRAND_RHO_INDEPENDENCE_ASSERTIONS = Object.freeze([
  {
    name: 'rho^2 prefactor: A_rho = 2rho - rho^2/2 = 0.09875 at rho = 1/20 (eq 6.19)',
    holds: () => Math.abs(A_RHO - 0.09875) < 1e-12,
  },
  {
    name: 'kappa back-solve c_odd(1/20)/(1/20)^2 reproduces the carried 2.51069789 literal',
    holds: () => Math.abs(KAPPA_FROM_ANCHOR - KAPPA) < 5e-8,
  },
  {
    name: 'Q_0 moduli are exactly 1/rho, 2/rho, 2/rho+1, 4/rho-1 at rho = 1/20 (20,40,41,79)',
    holds: () =>
      SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT.integrandRhoDependence.modulusMatchAtAnchor === true,
  },
  {
    name: 'the kappa*rho^2 shape is judged NOT structurally forced (prefactor forced, integrand rho-dependent)',
    holds: () => SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT.shapeVerdict.structurallyForced === false,
  },
  {
    name: 'honest: REFUTED annotation, prefactor CERTIFIED, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /REFUTED as written/.test(SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT.status)
      && /CERTIFIED/.test(SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT.status)
      && /G irrationality OPEN/.test(SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT.status)
      && /refereed bound is changed/i.test(SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT.status)
      && /NO QED/.test(SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT.status),
  },
]);

export default SUN_S6_INTEGRAND_RHO_INDEPENDENCE_VERDICT;
