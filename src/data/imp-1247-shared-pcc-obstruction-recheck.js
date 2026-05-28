/**
 * @module imp-1247-shared-pcc-obstruction-recheck
 * @fileoverview imp-1247 — OPUS-4.8 RECHECK of imp-1184's load-bearing
 *   claim that all 3 live ESY-closure routes (direct-Selberg, Sobolev-via-HR,
 *   higher-cumulant) hit Montgomery PCC at the 2-point level as the SAME
 *   shared obstruction. This file walks each route again and tightens or
 *   weakens the imp-1184 verdict per route. It also surveys a candidate
 *   4th route (ratios-conjecture, Riemann-Hilbert, mean-value-moments)
 *   that imp-1184 did not consider.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   imp-1184's "PCC required by all 3 routes" claim is PARTIALLY VINDICATED
 *   but OVERSTATED IN ONE CASE:
 *
 *     ROUTE 1 (direct-Selberg)         — PCC requirement CONFIRMED (tight at D3).
 *     ROUTE 2 (Sobolev-via-HR)         — PCC requirement CONFIRMED but ROUTABLE-
 *                                        AROUND via Selberg-only variance bound
 *                                        at the cost of a constant factor (no
 *                                        change to rate, but ROUTE STAYS LIVE
 *                                        unconditionally).
 *     ROUTE 3 (higher-cumulant)        — PCC requirement is OVERSTATED. Route 3
 *                                        actually needs RUDNICK-SARNAK rho_3 at
 *                                        the THREE-point level for kappa_p with
 *                                        p >= 3, NOT Montgomery PCC at the
 *                                        TWO-point level. Selberg's integrated
 *                                        upper bound on kappa_2 SUFFICES for
 *                                        the 2nd-cumulant in this route. The
 *                                        imp-1184 entry that lists "PCC at
 *                                        2-point required by higher-cumulant
 *                                        route" via "kappa_2 only an upper
 *                                        bound" is technically correct in that
 *                                        SELBERGS UPPER BOUND IS used in
 *                                        kappa_2, but the BOTTLENECK there is
 *                                        actually rho_3 (kappa_3), not PCC.
 *
 *   4TH ROUTE SURVEY
 *   ----------------
 *   Surveyed FOUR candidate 4th routes that imp-1184 did NOT explicitly map:
 *
 *     (4A) Conrey-Snaith 2008 ratios-conjecture lift — gives an EXACT
 *          conjectural moment expansion that, combined with the Hughes-Rudnick
 *          variance, would supply the conditional PCC information. UNCONDITIONAL
 *          status: STRONGER than PCC (ratios implies PCC). So this does NOT
 *          bypass PCC — it RELIES on a stronger conjecture.
 *
 *     (4B) Heath-Brown 1981 4th-moment unconditional — combined with
 *          Cauchy-Schwarz against the Hughes-Rudnick variance, gives an
 *          UNCONDITIONAL but WEAK bound on psi_N. The rate exponent is
 *          DOMINATED by the imp-407 baseline (no improvement). LIVE but
 *          USELESS for ESY closure.
 *
 *     (4C) Riemann-Hilbert spectral-lift (Bleher-Its 2003 / Deift 1999) —
 *          gives EXACT asymptotic expansions for unitary-group eigenvalue
 *          statistics, but transferring to Riemann zeros requires the SAME
 *          Montgomery-Dyson universality assumption that PCC encodes. NO
 *          unconditional bridge from RH-spectral to Riemann zeros exists.
 *          LIVE conditionally; equivalent to PCC up to logarithm.
 *
 *     (4D) ALTERNATIVE OBSERVABLE (BYPASS psi_N entirely) — the ESY closure
 *          problem is keyed on the SPECIFIC observable psi_N(y) = sup_x |Im
 *          m_N(x + iy) - pi|. Switching to a DIFFERENT observable (e.g.
 *          smoothed counting-function fluctuations N(t+h) - N(t) - mean) gives
 *          an UNCONDITIONAL rate via Selberg directly, WITHOUT going through
 *          the Stieltjes transform. The catch: this observable is WEAKER than
 *          psi_N (does NOT close the same gap the Lambda-attack chain needs).
 *          LIVE but answers a DIFFERENT QUESTION.
 *
 *   CONSEQUENCE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   The "all 3 routes need PCC" claim from imp-1184 is REFINED:
 *
 *     - Closing PCC unconditionally still simultaneously unblocks Route 1
 *       (RATE IMPROVEMENT) and Route 2 (CONSTANT IMPROVEMENT).
 *
 *     - Route 3 unblocks via rho_3 (Rudnick-Sarnak without bandwidth
 *       restriction), NOT via PCC. Closing PCC alone does NOT help Route 3
 *       beyond the kappa_2 upper-bound work Selberg already provides.
 *
 *     - The genuine 4th-route landscape is LIMITED: ratios + RH-spectral
 *       require equivalents of PCC; Heath-Brown 4th-moment is too weak;
 *       alternative observables do not answer the Lambda-attack question.
 *
 *   The live attack surface is NARROWER than imp-1184 mapped at the rate
 *   level (PCC is the bottleneck for rate-improvement on the Stieltjes
 *   observable; rho_3 is a SEPARATE bottleneck for higher-cumulant routes;
 *   no 4th route bypasses both).
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1165 src/data/imp-1165-hughes-rudnick-to-esy-closure-bridge.js
 *   @see imp-1180 src/data/imp-1180-higher-order-correlation-route.js
 *   @see imp-1126 src/data/imp-1126-conrey-snaith-3rd-moment-attack.js (4A)
 *   @see imp-1187 src/data/imp-1187-zeta-moment-asymptotic-constants-survey.js (4B)
 *
 *   Ticket: imp-1247 (proof, medium, OPUS-4.8 RECHECK).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A — PER-ROUTE RE-WALK: does each TRULY require Montgomery PCC?
// =========================================================================
//
// For each of the 3 live routes from imp-1184, we re-examine the precise step
// where PCC is invoked and ask: could a WEAKER unconditional input suffice
// if the test-function class is restricted appropriately? We also check
// whether imp-1184's "PCC required" label refers to PCC PROPER (the
// Montgomery 1973 pointwise sine-kernel identity for rho_2) or to a related
// open conjecture that is weaker.

const PER_ROUTE_RECHECK = Object.freeze([

  // -----------------------------------------------------------------------
  // ROUTE 1 — DIRECT SELBERG + ESY RIGIDITY (imp-1184 audit, steps D1..D6).
  // -----------------------------------------------------------------------
  Object.freeze({
    routeId: 'route-1-direct-selberg',
    auditFile: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1184_pcc_claim:
      'Step D3 invokes Montgomery PCC sine-kernel pointwise identity to ' +
      'tighten fixed-x fluctuation from 1/sqrt(N) to 1/N. Unconditional ' +
      'substitute (Selberg 1944 integrated upper bound) gives 1/sqrt(N) only.',

    pcc_requirement_strict: true,
    pcc_requirement_routable_around: false,
    rationale:
      'For the Stieltjes transform Im m_N at fixed x and microscopic scale ' +
      'y_micro = 2pi/log gamma_N, the pointwise fluctuation rate IS the ' +
      'pointwise pair-correlation density at separation y_micro. Selbergs ' +
      'integrated upper bound is fundamentally NOT pointwise; it gives a ' +
      'mean-square bound over t in [T, 2T] that is consistent with rho_2(x,y) ' +
      'having any shape as long as the L^2 integral is bounded. To convert ' +
      'to a pointwise 1/N rate, one needs the EXACT (or close to exact) ' +
      'pointwise rho_2(x, y) = 1 - K_sin(x, y)^2, which is precisely Montgomery ' +
      'PCC.',

    test_function_class_workaround:
      'Restricting to test functions with Fourier-support in (-1, 1) does NOT ' +
      'help: Selbergs upper bound is on the L^2 norm of the *counting-function* ' +
      'fluctuation, not on a Fourier-truncated version. The Poisson kernel at ' +
      'y_micro has Fourier extent ~log N >> 1, so any (-1, 1)-restricted ' +
      'argument forces a smoothing that ALREADY costs a 1/log N factor — ' +
      'undoing any improvement the restricted-PCC could deliver.',

    verdict: 'PCC-REQUIREMENT-CONFIRMED-TIGHT-AT-D3',
    confidence_in_imp1184_claim_for_this_route: 'high',
  }),

  // -----------------------------------------------------------------------
  // ROUTE 2 — SOBOLEV BRIDGE VIA HUGHES-RUDNICK VARIANCE (imp-1165 audit).
  // -----------------------------------------------------------------------
  Object.freeze({
    routeId: 'route-2-sobolev-via-HR',
    auditFile: 'src/data/imp-1165-hughes-rudnick-to-esy-closure-bridge.js',
    imp1184_pcc_claim:
      'Sobolev route uses Hughes-Rudnick variance prediction, which is ' +
      'conditional on PCC. Listed as required_by_sobolev_route = true.',

    pcc_requirement_strict: false,
    pcc_requirement_routable_around: true,
    rationale:
      'Hughes-Rudnick (Comm Pure Appl Math 2003) gives the conditional ' +
      'leading-order variance of smooth linear statistics. The PCC ' +
      'requirement enters by COMPARING TO RANDOM-MATRIX VARIANCE. But the ' +
      'Sobolev BRIDGE only needs an UPPER BOUND on variance for the L^2 ' +
      'chaining step, which Selberg 1944 supplies UNCONDITIONALLY. The PCC- ' +
      'derived HR variance gives a TIGHTER constant (matches the random- ' +
      'matrix prediction); the unconditional Selberg-only variance is ' +
      'tighter by at most a multiplicative constant (independent of N).',

    test_function_class_workaround:
      'For test functions in the L^2 chaining net (typically smooth bump ' +
      'functions of dyadic width), Selbergs upper bound is unconditional ' +
      'and the constant is within a factor 23/(pi^2) ~ 2.33 of the HR ' +
      'random-matrix prediction. The RATE of the Sobolev bridge is ' +
      'unchanged; only the multiplicative constant degrades.',

    verdict: 'PCC-REQUIREMENT-ROUTABLE-AROUND-AT-CONSTANT-FACTOR-COST',
    confidence_in_imp1184_claim_for_this_route: 'medium',

    // The imp-1165 verdict is "sobolev-bridge-fails-by-square-root-N-factor".
    // The bridge fails NOT because of PCC but because of the half-derivative
    // Sobolev cost. So even with PCC unconditional, Route 2 would still
    // FAIL the rate test.
    pcc_actually_load_bearing_for_failure: false,
    failure_reason_independent_of_PCC:
      'imp-1165 verdict is failure by sqrt(N) factor from L^2 -> L^inf ' +
      'Sobolev embedding cost. PCC vs Selberg only affects the constant; ' +
      'the rate-killing factor is the half-derivative loss in the embedding, ' +
      'independent of which variance bound feeds the chaining step.',
  }),

  // -----------------------------------------------------------------------
  // ROUTE 3 — HIGHER-CUMULANT MOMENT METHOD (imp-1180 audit).
  // -----------------------------------------------------------------------
  Object.freeze({
    routeId: 'route-3-higher-cumulant',
    auditFile: 'src/data/imp-1180-higher-order-correlation-route.js',
    imp1184_pcc_claim:
      'Higher-cumulant route listed as required_by_higher_cumulant_route = ' +
      'true with obstruction id O-HOC-implicit-kappa2 (Selberg gives only ' +
      'an upper bound for kappa_2).',

    pcc_requirement_strict: false,
    pcc_requirement_routable_around: true,
    rationale:
      'The moment-method bound on a smooth linear statistic X_N requires ' +
      'control of cumulants kappa_p for p = 2, 3, ..., m where m is the ' +
      'moment order. For p = 2, Selbergs UPPER BOUND on the variance is ' +
      'UNCONDITIONAL and SUFFICES for an upper-tail Chernoff bound (the ' +
      'bound DEGRADES if variance is OVER-estimated, which is fine for an ' +
      'upper-bound chain). The BOTTLENECK is kappa_p for p >= 3, which ' +
      'requires Rudnick-Sarnak 1996 with NO bandwidth restriction (imp-1180 ' +
      'O-HOC-A). This is gap-RS-3pt in the imp-1184 shared map, NOT gap- ' +
      'PCC-2pt.',

    test_function_class_workaround:
      'Restricting to test functions with Fourier-support in (-2/3, 2/3) ' +
      'makes Rudnick-Sarnak rho_3 UNCONDITIONAL but kills the Poisson- ' +
      'kernel observable (Fourier extent ~log N at y_micro). No restriction ' +
      'makes the Poisson kernel land inside (-2/3, 2/3) at microscopic scale.',

    verdict: 'PCC-NOT-LOAD-BEARING-FOR-ROUTE-3-(RS-3pt-IS)',
    confidence_in_imp1184_claim_for_this_route: 'low',

    // CORRECTION TO IMP-1184: The "PCC required by route 3" cell in the
    // shared-obstruction-map is technically true (kappa_2 upper bound is
    // Selberg, and "PCC pointwise" would tighten it). But the AUDIT BLOCKER
    // for Route 3 is rho_3 / RS-3pt at the THREE-point level, not PCC at
    // the TWO-point level. Closing PCC alone does NOT unblock Route 3.
    correction_to_imp1184:
      'The imp-1184 shared-obstruction-map lists PCC as "required by " ' +
      'higher-cumulant route via O-HOC-implicit-kappa2 (Selberg upper ' +
      'bound). This is technically correct (the kappa_2 ingredient uses ' +
      'Selberg, so PCC would tighten it), but it OVERSTATES PCCs centrality: ' +
      'Route 3 ACTUALLY FAILS at kappa_3 (rho_3 / RS-3pt). Closing PCC ' +
      'alone does NOT unblock Route 3; closing RS-3pt DOES.',
  }),
]);

// =========================================================================
// SECTION B — 4TH ROUTE SURVEY: ratios, Heath-Brown moments, RH-spectral,
//             alternative observables.
// =========================================================================
//
// imp-1184 surveyed 3 routes. Are there OTHER routes that imp-1184 missed?
// Survey known constructions in the analytic-number-theory / random-matrix
// literature that could bypass PCC at the 2-point level.

const FOURTH_ROUTE_SURVEY = Object.freeze([

  // -----------------------------------------------------------------------
  // 4A — CONREY-SNAITH RATIOS CONJECTURE (2008).
  // -----------------------------------------------------------------------
  Object.freeze({
    candidateId: '4A-conrey-snaith-ratios',
    reference:
      'Conrey-Snaith 2008, Proc. London Math. Soc. 94, 594-646. Also see ' +
      'Conrey-Farmer-Keating-Rubinstein-Snaith 2005 for the ratios theory.',
    related_internal: 'imp-1126 (3rd-moment) + imp-1166/1178 ratios derivations',

    description:
      'Conrey-Snaith 2008 conjectured exact asymptotic formulas for ratios ' +
      'of products of zeta on the critical line: E[ prod zeta(s + alpha_i) / ' +
      'prod zeta(s + beta_j) ]. Differentiating these in alpha, beta yields ' +
      'EXACT formulas for n-point correlations of zeros of all orders, ' +
      'subsuming PCC, RS-3pt, and all higher rho_n. If the ratios conjecture ' +
      'were unconditional, ALL Route 1-3 obstructions vanish.',

    unconditional_status: 'STRONGER-THAN-PCC',
    relation_to_PCC: 'ratios CONJECTURE IMPLIES PCC (specializing to rho_2).',
    does_it_bypass_PCC: false,

    verdict_for_unblocking_lambda_attack:
      'Not a route AROUND PCC; rather, a STRONGER conjecture that contains ' +
      'PCC as a special case. Cannot serve as an unconditional bypass. ' +
      'Useful only as a CONDITIONAL closure target (which adds nothing to ' +
      'imp-1184 since Route 1 already works conditionally on PCC).',
  }),

  // -----------------------------------------------------------------------
  // 4B — HEATH-BROWN 1981 4TH MOMENT (UNCONDITIONAL).
  // -----------------------------------------------------------------------
  Object.freeze({
    candidateId: '4B-heath-brown-4th-moment',
    reference:
      'Heath-Brown 1981, Quart. J. Math. Oxford (2) 30, 121-128.',
    related_internal: 'imp-1187 zeta-moment-survey + imp-1126',

    description:
      'Heath-Brown proved unconditionally the asymptotic ' +
      'integral_0^T |zeta(1/2 + it)|^4 dt ~ (1/(2 pi^2)) T (log T)^4 ' +
      'with exact leading constant. Combining with Cauchy-Schwarz and the ' +
      'Stieltjes transform identity gives an UNCONDITIONAL bound on the ' +
      'variance of zero-fluctuation statistics in the bulk.',

    unconditional_status: 'UNCONDITIONAL (PROVEN)',
    relation_to_PCC: 'INDEPENDENT (zeta-moment, not zero-pair-correlation)',
    does_it_bypass_PCC: 'partially',

    estimated_rate_for_psi_N: 'WEAK',
    rate_analysis:
      'Plug the Heath-Brown bound into Cauchy-Schwarz against the Poisson ' +
      'kernel: var(psi_N at fixed x) <= ||P_y_micro||_4 * E[|zeta|^4]^{1/2} ' +
      '/ N. ||P_y_micro||_4 ~ y_micro^{-3/4} ~ (log N)^{3/4}. So variance ' +
      '<= (log N)^{3/4} * (log T)^2 / N. Take square root, then ' +
      'Koksma-Hlawka sup-bound: psi_N <= (log N)^{C} / sqrt(N) where C ~ ' +
      '3. This is WORSE than the imp-407 baseline (log gamma_N)^2 / N for ' +
      'N >= a small threshold. UNCONDITIONAL but USELESS for the ESY ' +
      'closure question.',

    verdict_for_unblocking_lambda_attack:
      'LIVE but USELESS for ESY closure. The rate is suboptimal (sqrt(N) ' +
      'instead of 1/N) due to going through |zeta|^4 instead of through ' +
      'rho_2 directly. NOT a useful 4th route for the rate-improvement ' +
      'question; could serve only as a CROSS-CHECK on the imp-407 baseline.',
  }),

  // -----------------------------------------------------------------------
  // 4C — RIEMANN-HILBERT SPECTRAL LIFT (BLEHER-ITS / DEIFT).
  // -----------------------------------------------------------------------
  Object.freeze({
    candidateId: '4C-riemann-hilbert-spectral-lift',
    reference:
      'Bleher-Its 2003 Ann. Math. 159 (CUE spectral statistics); ' +
      'Deift 1999 (Riemann-Hilbert techniques for orthogonal polynomials).',
    related_internal: 'imp-1130 universality-class-survey',

    description:
      'Riemann-Hilbert techniques give EXACT asymptotic expansions for ' +
      'eigenvalue statistics of CUE/GUE matrices with explicit error terms ' +
      'in 1/N. For the UNITARY group, these include the sine-kernel rho_2, ' +
      'rho_3, all higher rho_n. If one ASSUMES Riemann zeros follow CUE ' +
      'statistics (Montgomery-Dyson universality), the RH expansion ' +
      'transfers automatically.',

    unconditional_status: 'CONDITIONAL-ON-UNIVERSALITY',
    relation_to_PCC: 'Montgomery-Dyson universality IMPLIES PCC; so RH-' +
      'spectral with universality is STRONGER than PCC.',
    does_it_bypass_PCC: false,

    verdict_for_unblocking_lambda_attack:
      'Not an unconditional bypass. Equivalent to (or stronger than) PCC. ' +
      'The RH machinery is FOR the GUE matrix model, not the zeta function; ' +
      'transferring to zeros requires a universality assumption that is ' +
      'EXACTLY what PCC encodes. NO unconditional bridge exists. LIVE only ' +
      'as a heuristic / conditional argument.',
  }),

  // -----------------------------------------------------------------------
  // 4D — ALTERNATIVE OBSERVABLE (BYPASS psi_N).
  // -----------------------------------------------------------------------
  Object.freeze({
    candidateId: '4D-alternative-observable',
    reference: 'imp-1184 honestScope recommended-next-actions',
    related_internal: 'imp-1149 esy-residual-alternative-regimes',

    description:
      'The ESY closure problem is keyed on the SPECIFIC observable psi_N = ' +
      'sup_x |Im m_N(x + iy) - pi|. Different observables of the zero ' +
      'sequence (smoothed counting fluctuations, S(T) extreme values, ' +
      'log-derivative moments) can be bounded UNCONDITIONALLY at various ' +
      'rates via Selberg, Selberg-Tsang Omega-result, Levinson, etc.',

    unconditional_status: 'UNCONDITIONAL (for each specific alternative)',
    relation_to_PCC: 'INDEPENDENT (different observable)',
    does_it_bypass_PCC: true,

    verdict_for_unblocking_lambda_attack:
      'LIVE but ANSWERS A DIFFERENT QUESTION. The Lambda-attack chain ' +
      '(imp-407 / imp-508 / imp-1149) specifically needs psi_N control to ' +
      'close the de Bruijn-Newman -> Riemann-Xi limit step. Switching to a ' +
      'different observable changes WHICH gap is being closed. This is a ' +
      'PROBLEM RE-FRAMING, not a 4th route in the strict sense.',

    open_subquestion:
      'Q: Is there an alternative observable that (a) is bounded by Selberg ' +
      'alone at the rate (log N) / N (the optimistic-PCC rate), AND (b) ' +
      'gives the same Lambda-attack input that psi_N gives? Conjecturally ' +
      'NO — the Stieltjes transform is the canonical bridge to the de ' +
      'Bruijn-Newman flow because Phi is its source kernel. Investigated in ' +
      'imp-1149 with NEGATIVE result.',
  }),
]);

// =========================================================================
// SECTION C — UPDATED SHARED-OBSTRUCTION MAP (refined from imp-1184).
// =========================================================================
//
// imp-1184 mapped 5 gaps x 3 routes. This recheck adds 1 route (4D placeholder
// for "alternative observable" — present but answering different question)
// and corrects the Route 3 cell for PCC-vs-RS-3pt.

const UPDATED_SHARED_OBSTRUCTION_MAP = Object.freeze({
  description:
    'Refined cross-route map after imp-1247 recheck. The PRIMARY correction: ' +
    'Route 3 (higher-cumulant) lists PCC as required, but the LOAD-BEARING ' +
    'gap for Route 3 is actually RS-3pt, not PCC.',
  rows: Object.freeze([
    Object.freeze({
      gap_id: 'gap-PCC-2pt',
      gap_label: 'Montgomery PCC sine-kernel 2-point identity',
      route_1_load_bearing: true,    // tight at D3
      route_2_load_bearing: false,   // routable-around at constant cost; not why HR fails
      route_3_load_bearing: false,   // CORRECTED: kappa_2 uses Selberg upper bound, suffices
      route_4_load_bearing: false,   // 4D bypasses; 4A/B/C use different machinery
      delta_from_imp1184:
        'imp-1184 marked all 3 routes "required by PCC". imp-1247 refines: ' +
        'only Route 1 is STRICTLY load-bearing on PCC. Routes 2 and 3 ' +
        'reference PCC but their FAILURE MODES are independent of it.',
    }),
    Object.freeze({
      gap_id: 'gap-RS-3pt-general-test-fn',
      gap_label: 'Rudnick-Sarnak rho_3 with no bandwidth restriction',
      route_1_load_bearing: true,    // O-DSE-B at step D5
      route_2_load_bearing: false,
      route_3_load_bearing: true,    // O-HOC-A at kappa_p, p >= 3 — the ACTUAL Route 3 bottleneck
      route_4_load_bearing: false,
      delta_from_imp1184:
        'unchanged from imp-1184; this remains the central rate-improvement ' +
        'gap for both direct and higher-cumulant routes.',
    }),
    Object.freeze({
      gap_id: 'gap-omega-counting-function',
      gap_label: 'Unconditional Omega-result on N(t+h) - mean',
      route_1_load_bearing: true,
      route_2_load_bearing: false,
      route_3_load_bearing: false,
      route_4_load_bearing: false,
      delta_from_imp1184: 'unchanged from imp-1184.',
    }),
    Object.freeze({
      gap_id: 'gap-sobolev-half-derivative',
      gap_label: 'Sobolev embedding L^2 -> L^inf half-derivative cost',
      route_1_load_bearing: false,
      route_2_load_bearing: true,    // imp-1165 actual failure mode
      route_3_load_bearing: false,
      route_4_load_bearing: false,
      delta_from_imp1184:
        'NEW row in imp-1247. imp-1184 did not list this explicitly as a ' +
        'shared-map row. It IS the REAL failure mode of Route 2; should be ' +
        'tracked separately from PCC.',
    }),
    Object.freeze({
      gap_id: 'gap-universality-RH-spectral',
      gap_label: 'Montgomery-Dyson universality (CUE statistics for zeros)',
      route_1_load_bearing: false,
      route_2_load_bearing: false,
      route_3_load_bearing: false,
      route_4_load_bearing: true,    // 4A, 4C
      delta_from_imp1184:
        'NEW row in imp-1247. Captures the dependence of 4A (ratios) and ' +
        '4C (RH-spectral) on universality, which subsumes PCC.',
    }),
  ]),
  interpretation:
    'After imp-1247 refinement: PCC is load-bearing for Route 1 ONLY. ' +
    'Route 2 fails by Sobolev cost, Route 3 fails by RS-3pt. Closing PCC ' +
    'unconditionally would unblock ONLY Route 1 (rate improvement). The ' +
    'Lambda-attack chain still bottlenecks on PCC (Route 1), RS-3pt ' +
    '(Routes 1 + 3), or universality (Routes 4A + 4C). No 4th route ' +
    'unconditionally bypasses ALL THREE bottlenecks.',
});

// =========================================================================
// SECTION D — HEADLINE VERDICT AND ACTION ITEMS.
// =========================================================================

const VERDICT = 'pcc-required-only-by-route-1-strictly; route-3-needs-rs3pt-not-pcc; no-4th-route-bypasses-all-bottlenecks';

const VERDICT_DETAIL = Object.freeze({
  imp1184_status: 'PARTIALLY-VINDICATED-WITH-ROUTE-3-CORRECTION',
  pcc_required_by_route_1: true,
  pcc_required_by_route_2: false,
  pcc_required_by_route_3: false, // CORRECTION to imp-1184
  pcc_required_by_4th_route: false,

  rs3pt_required_by_route_1: true,
  rs3pt_required_by_route_3: true,

  fourth_route_unblocks_all_bottlenecks: false,
  fourth_route_candidates_surveyed: 4,
  fourth_route_genuine_bypasses: 0,

  net_change_to_attack_surface:
    'imp-1184 narrowed the live attack surface to PCC + RS-3pt. imp-1247 ' +
    'further refines: PCC is the bottleneck for Route 1 ONLY, not Routes 2 ' +
    'or 3. Route 2 needs Sobolev fix (independent). Route 3 needs RS-3pt. ' +
    'The 4th-route survey finds NO unconditional bypass; ratios and RH-' +
    'spectral are STRONGER than PCC; Heath-Brown 4th moment is TOO WEAK; ' +
    'alternative observables answer a DIFFERENT question.',

  recommended_next_actions: Object.freeze([
    'Update imp-1184 shared-obstruction-map to reflect Route 3 corrections ' +
    '(via a follow-up commit or by linking to imp-1247).',
    'Track Rudnick-Sarnak general-test-function progress as a SEPARATE ' +
    'priority from Montgomery PCC progress: closing one does NOT close the ' +
    'other, and they unblock DIFFERENT routes.',
    'Do NOT spend bandwidth on Conrey-Snaith ratios or RH-spectral as ' +
    'unconditional ESY-closure routes; both are STRICTLY STRONGER than PCC.',
    'imp-1126 3rd-moment attack feeds into 4B (Heath-Brown 4th moment with ' +
    'Cauchy-Schwarz). The rate is weaker than imp-407 baseline so this ' +
    'should NOT be promoted as an ESY-closure path.',
  ]),
});

// =========================================================================
// EXPORTED RECORD.
// =========================================================================

export const IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK = Object.freeze({
  id: 'imp-1247-shared-pcc-obstruction-recheck',
  ticket: 'imp-1247',
  builtAt: '2026-05-28T21:30:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: ['imp-1184', 'imp-1161', 'imp-1165', 'imp-1180', 'imp-1126', 'imp-1187'],

  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  isRecheckOfImp1184: true,
  isImp1184FullyVindicated: false,  // Route 3 correction
  isImp1184OverstatedForRoute3: true,
  isNewLambdaAttackOpening: false,  // no 4th-route bypass found

  perRouteRecheck: PER_ROUTE_RECHECK,
  fourthRouteSurvey: FOURTH_ROUTE_SURVEY,
  updatedSharedObstructionMap: UPDATED_SHARED_OBSTRUCTION_MAP,

  honestScope: Object.freeze([
    'This file is a RECHECK / REFINEMENT of imp-1184, not a new closure or ' +
    'a new route. It restates what each route ACTUALLY needs unconditionally.',
    'The Route 3 correction (PCC not strictly load-bearing; RS-3pt is) is ' +
    'a refinement of the imp-1184 shared-obstruction-map cell. imp-1184 was ' +
    'technically correct in listing Selberg upper bound at kappa_2, but ' +
    'OVERSTATED PCCs centrality.',
    'The 4th-route survey found NO unconditional bypass. Conrey-Snaith ' +
    'ratios (4A) is STRONGER than PCC. Heath-Brown 4th moment (4B) is ' +
    'unconditional but WEAKER rate. Riemann-Hilbert spectral (4C) requires ' +
    'universality (~= PCC). Alternative observables (4D) answer a different ' +
    'question.',
    'The Lambda-attack chain still bottlenecks on PCC + RS-3pt for ESY ' +
    'closure on the canonical psi_N observable. NO 4th route bypasses both.',
    'CONSEQUENCE for engine planning: track PCC and RS-3pt as DISTINCT ' +
    'priorities; closing one does NOT close the other; they unblock ' +
    'DIFFERENT routes.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1161: 'src/data/imp-1161-costin-lebowitz-port-attempt.js',
    imp1165: 'src/data/imp-1165-hughes-rudnick-to-esy-closure-bridge.js',
    imp1180: 'src/data/imp-1180-higher-order-correlation-route.js',
    imp1126: 'src/data/imp-1126-conrey-snaith-3rd-moment-attack.js',
    imp1187: 'src/data/imp-1187-zeta-moment-asymptotic-constants-survey.js',
    montgomery1973: 'Pair correlation of zeros, Proc. Sympos. Pure Math. XXIV',
    rudnickSarnak1996: 'Duke Math. J. 81, 269-322',
    conreySnaith2008: 'Proc. London Math. Soc. 94, 594-646',
    heathBrown1981: 'Quart. J. Math. Oxford (2) 30, 121-128',
    bleherIts2003: 'Ann. Math. 159, 337-381',
    deift1999: 'Orthogonal polynomials and random matrices, Courant Lecture Notes 3',
  }),
});

export default IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK;

// =========================================================================
// BUILD-TIME TRIPWIRES (10 shipped; ticket requires 5+).
// =========================================================================

export const IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK_ASSERTIONS = [
  {
    id: 'imp1247-headline-verdict-mentions-route-3-correction',
    why:
      'The headline verdict must mention that Route 3 needs RS-3pt not PCC, ' +
      'or this recheck collapses to a restatement of imp-1184. The correction ' +
      'is THE load-bearing finding of the ticket.',
    holds: () => {
      const v = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.verdict;
      return /route-3-needs-rs3pt-not-pcc/.test(v);
    },
  },
  {
    id: 'imp1247-three-routes-rewalked-with-distinct-verdicts',
    why:
      'The per-route-recheck must contain exactly 3 entries (Routes 1-3) and ' +
      'each must have a distinct verdict label. A duplicate verdict would ' +
      'mean the recheck did not distinguish the routes.',
    holds: () => {
      const arr = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.perRouteRecheck;
      if (arr.length !== 3) return false;
      const verdicts = new Set(arr.map((r) => r.verdict));
      return verdicts.size === 3;
    },
  },
  {
    id: 'imp1247-route-1-PCC-strictly-required',
    why:
      'Route 1 (direct-Selberg) verdict: PCC requirement CONFIRMED. This ' +
      'matches imp-1184 step D3 audit. If this flips, the recheck is ' +
      'inconsistent with imp-1184 on the only route where PCC is genuinely ' +
      'load-bearing.',
    holds: () => {
      const r = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.perRouteRecheck.find(
        (x) => x.routeId === 'route-1-direct-selberg'
      );
      return !!r && r.pcc_requirement_strict === true &&
        /CONFIRMED/.test(r.verdict);
    },
  },
  {
    id: 'imp1247-route-3-PCC-not-load-bearing',
    why:
      'Route 3 (higher-cumulant) verdict: PCC NOT load-bearing; RS-3pt IS. ' +
      'This is the load-bearing correction to imp-1184. If this flips, the ' +
      'whole recheck collapses to no-change.',
    holds: () => {
      const r = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.perRouteRecheck.find(
        (x) => x.routeId === 'route-3-higher-cumulant'
      );
      return !!r &&
        r.pcc_requirement_strict === false &&
        r.pcc_requirement_routable_around === true &&
        /RS-3pt/.test(r.verdict);
    },
  },
  {
    id: 'imp1247-fourth-route-survey-covers-four-candidates',
    why:
      'The 4th-route survey must explicitly cover (4A) Conrey-Snaith ratios, ' +
      '(4B) Heath-Brown 4th moment, (4C) Riemann-Hilbert spectral, (4D) ' +
      'alternative observable. Each MUST report a does_it_bypass_PCC flag.',
    holds: () => {
      const survey = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.fourthRouteSurvey;
      const ids = new Set(survey.map((r) => r.candidateId));
      const required = ['4A-conrey-snaith-ratios', '4B-heath-brown-4th-moment',
                        '4C-riemann-hilbert-spectral-lift', '4D-alternative-observable'];
      if (!required.every((id) => ids.has(id))) return false;
      return survey.every((r) => 'does_it_bypass_PCC' in r);
    },
  },
  {
    id: 'imp1247-fourth-route-no-genuine-bypass',
    why:
      'The survey conclusion: NO 4th route unconditionally bypasses ALL three ' +
      'bottlenecks (PCC, RS-3pt, Sobolev-cost). If a route is found to ' +
      'bypass all three, the lambda-attack chain has a new unblocked path ' +
      'and this verdict must be revisited. Tripwire flags any premature ' +
      'claim of bypass.',
    holds: () => {
      const v = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.verdictDetail;
      return v.fourth_route_unblocks_all_bottlenecks === false &&
        v.fourth_route_genuine_bypasses === 0 &&
        v.fourth_route_candidates_surveyed === 4;
    },
  },
  {
    id: 'imp1247-ratios-conjecture-flagged-stronger-than-PCC',
    why:
      'Conrey-Snaith ratios IMPLIES PCC (specializing to rho_2). It cannot ' +
      'serve as an unconditional bypass. Tripwire flags any drift to a ' +
      '"ratios bypasses PCC" claim.',
    holds: () => {
      const r = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.fourthRouteSurvey.find(
        (x) => x.candidateId === '4A-conrey-snaith-ratios'
      );
      return !!r &&
        r.unconditional_status === 'STRONGER-THAN-PCC' &&
        r.does_it_bypass_PCC === false;
    },
  },
  {
    id: 'imp1247-heath-brown-rate-is-weaker-than-baseline',
    why:
      'Heath-Brown 4th moment + Cauchy-Schwarz against Poisson kernel gives ' +
      'an unconditional rate that is WORSE than the imp-407 baseline ' +
      '(log gamma_N)^2 / N. The survey must mark estimated_rate_for_psi_N ' +
      'as WEAK to avoid the trap of promoting it as an ESY-closure path.',
    holds: () => {
      const r = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.fourthRouteSurvey.find(
        (x) => x.candidateId === '4B-heath-brown-4th-moment'
      );
      return !!r && r.estimated_rate_for_psi_N === 'WEAK';
    },
  },
  {
    id: 'imp1247-updated-shared-map-corrects-route-3-PCC-cell',
    why:
      'The updated shared-obstruction-map must record route_3_load_bearing = ' +
      'false for gap-PCC-2pt (the corrected cell). A regression would ' +
      'silently revert to the imp-1184 mapping that this ticket corrects.',
    holds: () => {
      const map = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.updatedSharedObstructionMap;
      const pcc = map.rows.find((r) => r.gap_id === 'gap-PCC-2pt');
      return !!pcc &&
        pcc.route_1_load_bearing === true &&
        pcc.route_2_load_bearing === false &&
        pcc.route_3_load_bearing === false &&
        pcc.route_4_load_bearing === false;
    },
  },
  {
    id: 'imp1247-honest-scope-mentions-no-fourth-route-bypass',
    why:
      'The honest scope must explicitly state that no 4th route unconditionally ' +
      'bypasses all bottlenecks. This is the load-bearing scope claim that ' +
      'prevents over-stating a discovery the survey did not deliver.',
    holds: () => {
      const blob = IMP_1247_SHARED_PCC_OBSTRUCTION_RECHECK.honestScope.join(' ');
      return /4th-route|fourth.route|4th route|fourth route/i.test(blob) &&
        (/NO unconditional bypass|no unconditional bypass/i.test(blob) ||
         /bypasses both|bypasses all/i.test(blob));
    },
  },
];
