/**
 * @module imp-35726-w1-sign-reconciliation-cost-scope
 *
 * imp-35726 (proof/assessment, S-frontier): COST the sign reconciliation that
 * stands between the repo held negative-time heat-flow proxy and seeding the
 * imp-35653 Part-E work-item W1 (the Polymath15 effective approximation
 * H_t = A + B - C, interval-bounded at T_PT = 3e12).
 *
 * imp-35717 ENUMERATED the sign-reconciliation prerequisites R1-R4 and named the
 * pivotal well-posedness fork (R2). This module goes one step further and asks the
 * ticket question directly: whether the negative-time proxy can be analytically
 * continued or re-anchored to positive t, AT WHAT COST, and whether any repo
 * infrastructure supports it. It COSTS the two candidate routes and INVENTORIES the
 * existing repo machinery against them.
 *
 * ASSESSMENT / SCOPING ONLY. Continues nothing; discharges nothing; changes no
 * bound; establishes no positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * PART A -- TWO CANDIDATE ROUTES FROM NEGATIVE-t PROXY TO POSITIVE-t BARRIER
 * -----------------------------------------------------------------------------
 * The repo proxy sits at de Bruijn time t_repo = -4 tau_repo (winding-thread /
 * imp-35674); the Polymath15 barrier H_t = A + B - C lives at a POSITIVE de Bruijn
 * time. Only two operations could carry the held object to the positive side:
 *   Route (a) ANALYTIC CONTINUATION / DECONVOLUTION: apply the inverse heat operator
 *             (Gaussian deconvolution) to sharpen the proxy up past t = 0.
 *   Route (b) FORWARD-EVOLUTION CERTIFICATE: treat the held negative-time proxy as an
 *             INITIAL DATUM and evolve it FORWARD through the t = 0 endpoint up to the
 *             positive barrier time -- the well-posed fork flagged by imp-35717 R2.
 * This module costs each and asks whether repo code supports it.
 *
 * PART B -- COST OF ROUTE (a): ILL-POSED, COST IS UNBOUNDED (not a constant)
 * -----------------------------------------------------------------------------
 * Gaussian convolution of the Riemann xi (H_0) with width w multiplies the frequency
 * (u-) spectrum by exp(-w^2 u^2 / 2), which maps H_0 to a NEGATIVE de Bruijn time --
 * the smoothing, well-posed side (this is exactly why the repo proxy lands at t < 0).
 * Reaching a POSITIVE de Bruijn time is the INVERSE operation: multiply the spectrum
 * by exp(+(dt) u^2), i.e. the inverse heat operator / deconvolution. High-frequency
 * modes are amplified by the unbounded factor exp(+(dt) u^2): any proxy error of size
 * eps in mode u is inflated to eps * exp((dt) u^2), with no continuous dependence on
 * the data (the canonical backward-heat ill-posedness). So the "cost" of Route (a) is
 * not a bounded re-anchoring constant -- it is an UNBOUNDED spectral amplification
 * factor. Route (a) is REJECTED as a stable computation. This quantifies WHY the
 * imp-35717 R2 backward direction is ill-posed: the cost is the amplification, not a
 * price one can pay.
 *
 * PART C -- COST OF ROUTE (b): WELL-POSED, BUT A FRESH FULL CERTIFICATE AT T_PT
 * -----------------------------------------------------------------------------
 * Route (b) is well-posed in principle (imp-35717 R2), but its cost is a FRESH
 * certificate, not a re-use of the held object. The forward-evolution certificate must
 * transport H_t across the whole interval [t_repo, 0, t_PM15] uniformly over the
 * x-range at T_PT = 3e12, certifying that NO zero lifts off the line during the flow
 * (a de Bruijn Theorem 13 style no-lift-off statement re-anchored at T_PT). That is a
 * uniform-in-x analytic certificate of the same breakthrough tier as the positive-t
 * barrier itself; it earns nothing from the held negative-time object beyond its role
 * as initial datum. Cost of Route (b) ~ cost of building the positive-t barrier
 * directly.
 *
 * PART D -- REPO INFRASTRUCTURE INVENTORY (does any code support either route?)
 * -----------------------------------------------------------------------------
 *   (1) Gaussian-convolution proxy (heatEvolvedXi, src/math/supercritical.js): the
 *       operative repo object. Convolution is STRUCTURALLY one-sided -- it multiplies
 *       the spectrum by exp(-w^2 u^2 / 2) and can only reach de Bruijn t <= 0. It can
 *       never produce a POSITIVE de Bruijn time. Supports NEITHER route to positive t.
 *   (2) Exact de Bruijn integral evaluator
 *       (scripts/imp-34813-exact-debruijn-winding-offline.mjs): evaluates H_t directly
 *       at any t via the integral representation, sidestepping deconvolution -- BUT
 *       double-precision roundoff caps it at x ~< 104 (gamma ~< 52), because |H_0| ~
 *       exp(-pi x / 8) sends the signal under the ~1e-17 floor beyond that. It is an
 *       infinite-system collision-time meter, NOT a height-T_PT tool; its x-ceiling of
 *       104 is astronomically below the T_PT = 3e12 height. Supports NEITHER route at
 *       T_PT.
 *   (3) de Bruijn Theorem 13 monotonicity (classical; imp-34813): supplies the
 *       inequality DIRECTION only (imp-35717 R3) and transports no object.
 * NET: no repo infrastructure bridges negative -> positive de Bruijn time at T_PT. The
 * convolution machinery is one-sided (t <= 0 only); the exact evaluator is height-
 * capped at x ~< 104, far below T_PT.
 *
 * PART E -- COST VERDICT: SEEDING W1 FROM THE PROXY IS NET-NEGATIVE
 * -----------------------------------------------------------------------------
 * Route (a) costs an unbounded (ill-posed) inversion -- rejected. Route (b) costs a
 * fresh forward-evolution certificate at T_PT that no repo infrastructure supports and
 * that is comparable in difficulty to the positive-t barrier itself. Either way the
 * proxy supplies ZERO usable reduction toward W1: the greenfield positive-t A + B - C
 * interval seed (imp-35717 R4 / imp-35681 Part A) remains untouched. CONCLUSION:
 * seeding W1 from the repo negative-time proxy is NET-NEGATIVE versus constructing the
 * Polymath15 positive-t A + B - C directly at T_PT; the cheapest path BYPASSES the
 * proxy entirely. Assessment only; ports nothing; changes no bound; NO QED.
 *
 * @see imp-35717-w1-tsign-reconciliation-scope (enumerates prerequisites R1-R4; names R2 fork)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part C: negative de Bruijn time = harder side)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: structure held at wrong t-sign)
 * @see imp-35653-sbarrier-finite-check-porting-scope (names W1 in the S_barrier port)
 * @see project winding-thread (Gaussian conv proxy = de Bruijn flow at NEGATIVE time t = -4 tau_repo)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; de Bruijn Thm 13); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35717 / imp-35674) ---
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT (imp-35674 Part D)
const X_EXACT_CAP = 104; // exact de Bruijn evaluator x-ceiling (scripts/imp-34813-...offline.mjs)

export const IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE = {
  id: 'imp-35726',
  proofSection: 'S-frontier',
  question:
    'Cost the sign reconciliation between the repo held negative-time heat-flow proxy (de Bruijn flow at ' +
    't = -4 tau_repo, imp-35674) and the positive-time Polymath15 barrier H_t = A + B - C before the proxy ' +
    'can seed the imp-35653 W1 interval-bounded approximation at T_PT = 3e12: whether the negative-time ' +
    'proxy can be analytically continued or re-anchored to positive t, AT WHAT COST, and whether any repo ' +
    'infrastructure supports it. Assessment/scoping only; ports nothing; changes no bound; NO QED.',
  candidateRoutes: {
    routeA_analyticContinuation:
      'Apply the inverse heat operator (Gaussian deconvolution) to sharpen the proxy up past t = 0 to a ' +
      'positive de Bruijn time.',
    routeB_forwardEvolutionCertificate:
      'Treat the held negative-time proxy as an INITIAL DATUM and evolve it FORWARD through the t = 0 ' +
      'endpoint up to the positive barrier time -- the well-posed fork flagged by imp-35717 R2.',
  },
  routeA_cost: {
    mechanism:
      'Gaussian convolution of H_0 with width w multiplies the u-spectrum by exp(-w^2 u^2 / 2), landing at ' +
      'a NEGATIVE de Bruijn time (why the repo proxy sits at t < 0). Reaching positive t is the INVERSE: ' +
      'multiply the spectrum by exp(+(dt) u^2), the inverse heat operator / deconvolution.',
    costIsUnbounded:
      'High-frequency modes are amplified by the UNBOUNDED factor exp(+(dt) u^2): a proxy error eps in mode ' +
      'u inflates to eps * exp((dt) u^2), with no continuous dependence on the data (canonical backward-heat ' +
      'ill-posedness). The cost is not a bounded re-anchoring constant -- it is an unbounded amplification.',
    verdict: 'REJECTED as a stable computation; quantifies WHY the imp-35717 R2 backward direction is ill-posed.',
  },
  routeB_cost: {
    wellPosed: 'Well-posed in principle (imp-35717 R2), but the cost is a FRESH certificate, not a re-use of the held object.',
    obligation:
      'The forward-evolution certificate must transport H_t across [t_repo, 0, t_PM15] uniformly over the ' +
      'x-range at T_PT = 3e12, certifying that NO zero lifts off during the flow (a de Bruijn Theorem 13 ' +
      'style no-lift-off statement re-anchored at T_PT).',
    costComparison:
      'A uniform-in-x analytic certificate of the same breakthrough tier as the positive-t barrier itself; ' +
      'the held negative-time object earns nothing beyond serving as initial datum. Cost ~ cost of building ' +
      'the positive-t barrier directly.',
  },
  repoInfrastructureInventory: {
    gaussianConvolutionProxy:
      'heatEvolvedXi (src/math/supercritical.js): STRUCTURALLY one-sided -- convolution multiplies the ' +
      'spectrum by exp(-w^2 u^2 / 2) and can only reach de Bruijn t <= 0; it can never produce a POSITIVE ' +
      'de Bruijn time. Supports NEITHER route to positive t.',
    exactDeBruijnEvaluator:
      'scripts/imp-34813-exact-debruijn-winding-offline.mjs evaluates H_t directly at any t via the integral ' +
      'representation (sidestepping deconvolution) BUT double-precision roundoff caps it at x ~< 104 ' +
      '(gamma ~< 52) because |H_0| ~ exp(-pi x / 8) drops under the ~1e-17 floor beyond that. An infinite-' +
      'system collision-time meter, NOT a height-T_PT tool; its x-ceiling is astronomically below T_PT. ' +
      'Supports NEITHER route at T_PT.',
    deBruijnThm13:
      'Classical monotonicity (imp-34813): supplies the inequality DIRECTION only (imp-35717 R3) and ' +
      'transports no object.',
    net:
      'No repo infrastructure bridges negative -> positive de Bruijn time at T_PT: the convolution machinery ' +
      'is one-sided (t <= 0 only) and the exact evaluator is height-capped at x ~< 104, far below T_PT.',
    exactEvaluatorXCap: X_EXACT_CAP,
  },
  retainedTermsAtTPT: N_AT_TPT,
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). Two routes could carry the held negative-time ' +
    'proxy to the positive Polymath15 barrier. (A) Analytic continuation / Gaussian deconvolution is the ' +
    'inverse heat operator: high frequencies amplify by the UNBOUNDED factor exp(+(dt) u^2), so its cost is ' +
    'not a constant but an unbounded amplification (canonical backward-heat ill-posedness) -- REJECTED, and ' +
    'this quantifies WHY the imp-35717 R2 backward direction is ill-posed. (B) The forward-evolution ' +
    'certificate is well-posed but a FRESH uniform-in-x no-lift-off certificate over [t_repo, 0, t_PM15] at ' +
    'T_PT = 3e12, of the same breakthrough tier as building the positive-t barrier directly. REPO INFRA: ' +
    'the Gaussian-convolution proxy (heatEvolvedXi) is one-sided (de Bruijn t <= 0 only) and can never reach ' +
    'positive t; the exact de Bruijn evaluator (imp-34813 offline) is height-capped at x ~< 104 (|H_0| ~ ' +
    'exp(-pi x / 8) under the ~1e-17 floor), far below T_PT -- so NO repo code supports either route at ' +
    'T_PT. NET: seeding W1 from the proxy is NET-NEGATIVE versus constructing the positive-t A + B - C ' +
    'directly; the proxy supplies ZERO usable reduction and the greenfield interval seed (imp-35717 R4) ' +
    'stays untouched. The cheapest path BYPASSES the proxy entirely. Ports nothing; discharges nothing; ' +
    'changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35717 (enumerates prerequisites R1-R4; names the R2 well-posedness fork); imp-35674 Part C ' +
    '(negative de Bruijn time = harder side); imp-35681 Part A (structure held at wrong t-sign); imp-35653 ' +
    '(names W1 in the S_barrier port); winding-thread (Gaussian conv proxy = de Bruijn flow at NEGATIVE ' +
    'time t = -4 tau_repo; exact evaluator scripts/imp-34813-...offline.mjs capped at x ~< 104); ' +
    'Polymath15 2019 (effective approximation H_t = A + B - C; de Bruijn Thm 13); Platt-Trudgian 2021.',
};

export const IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE_ASSERTIONS = [
  {
    // Part B: Route (a) is the inverse heat operator; cost is the unbounded exp(+(dt) u^2) amplification.
    id: 'imp35726-routeA-ill-posed-unbounded-cost',
    description: 'Route (a) analytic continuation = inverse heat operator; cost is unbounded amplification, rejected',
    holds: () =>
      /inverse heat operator/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.routeA_cost.mechanism) &&
      /UNBOUNDED/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.routeA_cost.costIsUnbounded) &&
      /REJECTED/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.routeA_cost.verdict),
  },
  {
    // Part C: Route (b) is well-posed but a fresh full certificate at T_PT, comparable to a direct build.
    id: 'imp35726-routeB-fresh-certificate-cost',
    description: 'Route (b) forward-evolution is well-posed but a fresh T_PT certificate ~ cost of the direct barrier',
    holds: () =>
      /FRESH certificate/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.routeB_cost.wellPosed) &&
      /no-lift-off/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.routeB_cost.obligation) &&
      /building\s.*positive-t barrier directly/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.routeB_cost.costComparison),
  },
  {
    // Part D: repo infra inventory -- convolution one-sided (t<=0), exact evaluator capped at x<~104, neither supports positive-t at T_PT.
    id: 'imp35726-repo-infra-neither-supports',
    description: 'Repo infra: convolution one-sided (t<=0), exact evaluator capped at x~<104; NEITHER supports positive-t at T_PT',
    holds: () =>
      /one-sided/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.repoInfrastructureInventory.gaussianConvolutionProxy) &&
      /NEITHER route to positive t/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.repoInfrastructureInventory.gaussianConvolutionProxy) &&
      /NEITHER route at T_PT/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.repoInfrastructureInventory.exactDeBruijnEvaluator) &&
      X_EXACT_CAP === 104 && X_EXACT_CAP < T_PT,
  },
  {
    // Part E + honesty gate: net-negative seeding, greenfield untouched, no discharge, no QED, no refereed bound is changed.
    id: 'imp35726-honesty-gate-net-negative-no-qed',
    description: 'Seeding W1 from the proxy is NET-NEGATIVE; greenfield untouched; scoping only, no QED, no refereed bound is changed',
    holds: () =>
      IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      /NET-NEGATIVE/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.verdict) &&
      /stays untouched/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.verdict) &&
      /NO QED/.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE.verdict),
  },
];

for (const a of IMP35726_W1_SIGN_RECONCILIATION_COST_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35726-w1-sign-reconciliation-cost-scope assertion failed: ${a.id}`);
  }
}
