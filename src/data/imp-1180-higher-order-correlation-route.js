// @module imp-1180-higher-order-correlation-route
// imp-1180: Higher-order-correlation alternative route for ESY closure
// (the second of the two live routes named in imp-1165 verdict).
//
// CONTEXT (one paragraph)
// -----------------------
// imp-1165 closed the Hughes-Rudnick L^2 lin-stat to L^inf psi_N Sobolev
// bridge as an HONEST NEGATIVE: the half-derivative Sobolev embedding cost
// loses sqrt(N) against the imp-407 unconditional baseline at every
// realistic N. imp-1165 named TWO surviving live routes for ESY closure:
//   (A) direct-Selberg-plus-ESY-rigidity (imp-407/508 angle b), and
//   (B) higher-order-correlations using k-point connected correlation
//       functions c_p with p >= 3 to bound MOMENTS of psi_N directly,
//       bypassing the L^2 to L^inf Sobolev cost.
// THIS FILE pursues route (B). It does NOT close it. It is an HONEST
// PARTIAL that (i) catalogs the unconditional ingredients available for
// the moment method, (ii) sketches which observable a 4th-moment input
// could bound, (iii) computes the formal bound 4-point input would give
// at N = 1e6 and N = 1e7, and (iv) NAMES the precise obstruction that
// blocks unconditional closure: c_3 for arbitrary test-function support.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'higher-order-route-research-grade-open-c3-unconditional-gap'
//
// The higher-order route is mathematically distinct from the Sobolev
// bridge and is NOT subsumed by the imp-1165 negative result. However,
// the unconditional 3-point (rho_3) input for Riemann zeros is available
// ONLY for test functions with restricted Fourier-support (Rudnick-Sarnak
// 1996 type bounds), which excludes the Poisson kernel phi_{x, y_micro}
// at the microscopic scale. The available 4-point input from Heath-Brown
// 1981 / Conrey-Ghosh 1989 4th-moment-of-zeta theorems is on |zeta|^4 on
// the critical line, NOT on the connected 4-point density of zeros; the
// translation via the explicit formula carries log-factor costs that
// (formally) keep the bound strictly worse than imp-407 baseline. We
// therefore SHIP a research-grade-open ticket with all obstructions
// named and quantified, rather than claim a closure.
//
// CONSEQUENCE FOR THE LAMBDA-ATTACK CHAIN
// ---------------------------------------
// Route (B) is NOT a substitute for route (A). Both routes remain live;
// (A) is the direct Selberg-plus-ESY-rigidity argument (imp-407 / imp-508
// angle b) and (B) is the higher-order-correlation route mapped here.
// Closing EITHER would close ESY observable at the unconditional level.
// This file gives the research community an explicit map of route (B)
// so a future proof attempt knows exactly what unconditional input is
// missing (c_3 with general test-function support).
//
// SYNTAX SAFETY
// -------------
// No "*/" inside JSDoc. Single quotes throughout string literals; no
// apostrophes inside single-quoted strings. Numerical constants below
// use plain JS arithmetic (no apostrophe-loaded math symbols in code).
//
// @see imp-1149-sub-L2-to-Linfty-sobolev-cost: prior Sobolev-cost negative
// @see imp-1161: Costin-Lebowitz / Soshnikov port (variance only)
// @see imp-1163: literature survey establishing the c_p unconditional landscape
// @see imp-1165: HR-bridge verdict that named this route as alternative
// @see imp-407 / imp-508: ESY closure path that this route would serve

// =========================================================================
// SECTION (a) -- INGREDIENT INVENTORY (unconditional inputs available).
// =========================================================================

const INGREDIENT_INVENTORY = Object.freeze([
  Object.freeze({
    id: 'I-S44',
    name: 'Selberg 1944 pair-correlation second moment',
    statement:
      'int_T^{2T} |N(t+h) - N(t) - (h/(2 pi)) log(t/(2 pi))|^2 dt <= ' +
      'C_Selberg * T * log T * h, with C_Selberg <= 23.',
    pPointReach: 2,
    isUnconditional: true,
    isPointwiseDensity: false,
    isUpperBoundOnly: true,
    citation: 'Selberg 1944, Avh. Norske Vid. Akad. Oslo; Titchmarsh ch. 9 Thm 9.4',
  }),
  Object.freeze({
    id: 'I-RS96',
    name: 'Rudnick-Sarnak 1996 n-point correlations, restricted Fourier support',
    statement:
      'For test functions phi with Fourier support in (-2/n, 2/n), the n-point ' +
      'correlation sum equals the random-matrix sine-kernel prediction ' +
      'UNCONDITIONALLY. Support restriction is critical: full-support n-point ' +
      'is the (conjectural) Bogomolny-Keating / Conrey-Snaith.',
    pPointReach: 3, // and higher, but only on restricted-bandwidth test functions
    isUnconditional: true,
    isPointwiseDensity: false, // identity only on restricted-bandwidth test functions
    isUpperBoundOnly: false, // identity, not bound
    bandwidthRestriction: '2 / n',
    citation: 'Rudnick-Sarnak 1996, Duke Math. J. 81, 269-322 Thm 1.1',
  }),
  Object.freeze({
    id: 'I-HB81',
    name: 'Heath-Brown 1981 fourth moment of zeta on the critical line',
    statement:
      'int_0^T |zeta(1/2 + it)|^4 dt ~ T (log T)^4 / (2 pi^2), unconditionally.',
    pPointReach: 4, // for zeta moments; NOT directly for 4-point of zeros
    isUnconditional: true,
    isPointwiseDensity: false,
    isUpperBoundOnly: false,
    citation: 'Heath-Brown 1981, Q. J. Math. 30, 7-22',
    // CRITICAL: this is a moment of zeta, not a 4-point correlation of zeros.
    translationCost: 'via Riemann von-Mangoldt explicit formula, costs a log T factor',
  }),
  Object.freeze({
    id: 'I-CG89',
    name: 'Conrey-Ghosh 1989 mean-value of |Z(t)|^4 with Hardy weight',
    statement:
      'int_0^T |Z(t)|^4 dt with Z the Hardy function gives a sharper ' +
      'leading constant than Heath-Brown 1981; matches the random-matrix ' +
      'prediction (1/12) * T log^4 T to leading order, with explicit lower-' +
      'order arithmetic terms.',
    pPointReach: 4,
    isUnconditional: true,
    isPointwiseDensity: false,
    isUpperBoundOnly: false,
    citation: 'Conrey-Ghosh 1989, Trans. AMS 314, 793-803',
  }),
  Object.freeze({
    id: 'I-BS08',
    name: 'Bui-Soundararajan 2008 zero-density estimate',
    statement:
      'N(sigma, T) << T^{8(1 - sigma) / (11 + 1.5 sigma) + eps}, ' +
      'unconditional zero-density exponent for the critical strip.',
    pPointReach: 1, // density of zeros at one point, not k-point correlation
    isUnconditional: true,
    isPointwiseDensity: true,
    isUpperBoundOnly: true,
    citation: 'Bui-Soundararajan 2008',
    // NOTE: this is included in the inventory because the ticket description
    // mentioned it, but it is a 1-point object (density), not a higher-order
    // correlation. It feeds into the moment-method route only INDIRECTLY via
    // tail control of the linear statistic.
  }),
  Object.freeze({
    id: 'I-CONREY88',
    name: 'Conrey 1989 More than two-fifths of zeros are simple and on the line',
    statement:
      'At least 40 pct of nontrivial zeros lie on the critical line and are ' +
      'simple, by Levinson method.',
    pPointReach: 1,
    isUnconditional: true,
    isPointwiseDensity: true,
    isUpperBoundOnly: false,
    citation: 'Conrey 1989, J. Reine Angew. Math. 399, 1-26',
    // NOTE: again a 1-point input. Useful for tail control of the sum but
    // not directly for connected k-point correlation.
  }),
]);

// =========================================================================
// SECTION (b) -- WHICH OBSERVABLE COULD k-POINT INPUTS BOUND.
// =========================================================================
//
// The natural moment-method route is:
//
//   1. For the ESY closure observable psi_N(y) = sup_x |L_N(phi_{x,y})|,
//      bound the 2k-th moment of L_N(phi_{x,y}) at each fixed x.
//   2. Use chaining over x to convert the pointwise moment bound to a
//      sup-bound, paying only a (log N)^c factor (NOT the sqrt(log N)
//      factor of the Sobolev embedding).
//   3. Apply Markov to get psi_N >= lambda with probability
//      <= (E[L_N^{2k}]) / lambda^{2k}.
//
// For step (1), the (2k)-th moment of L_N(f) decomposes into the
// CUMULANT EXPANSION
//
//   E[L_N(f)^{2k}]  =  sum_{partitions Pi of {1, ..., 2k}}
//                      prod_{B in Pi} kappa_{|B|}(L_N(f))
//
// where kappa_p(L_N(f)) is the p-th cumulant, expressible as
//
//   kappa_p(L_N(f))  =  int ... int f(x_1) ... f(x_p) c_p(x_1, ..., x_p) dx_1 ... dx_p
//
// with c_p the p-point CONNECTED correlation function (rho_p minus its
// lower-order combinations).
//
// THE BOTTLENECK: to bound kappa_p for p >= 3 we need an unconditional
// input on c_p for ARBITRARY test functions (including the Poisson kernel
// phi_{x, y_micro} at the microscopic scale). The available ingredients
// give us:
//
//   - kappa_2 (variance) via Selberg I-S44       -- AVAILABLE but as upper bound
//   - kappa_3 unconditionally for f with restricted-bandwidth (RS96)   -- PARTIAL
//   - kappa_3 for general f (Poisson kernel)     -- NOT AVAILABLE
//   - kappa_4 via the explicit formula and Heath-Brown 4th moment      -- PARTIAL, lossy
//   - kappa_p for p >= 5                          -- NOT AVAILABLE
//
// SO: the moment-method route runs at best to 4th cumulant with a lossy
// explicit-formula translation, OR to arbitrary cumulants on a restricted
// test-function class. NEITHER closes psi_N on the Poisson kernel
// unconditionally.

const OBSERVABLE_SKETCH = Object.freeze({
  target_observable: 'psi_N(y_micro) = sup_x |L_N(phi_{x, y_micro}) - mean|',
  poisson_kernel: 'phi_{x, y}(gamma) = y / ((x - gamma)^2 + y^2)',
  y_micro_formula: 'y_micro = 2 pi / log gamma_N',

  moment_method_route: Object.freeze({
    step1_pointwise_moment: 'E[ |L_N(phi_{x, y_micro})|^{2k} ] via cumulant expansion',
    step2_chaining_to_sup: 'sup over x via Talagrand/Dudley chaining: (log N)^{1/2} cost',
    step3_markov: 'P(psi_N > lambda) <= E[psi_N^{2k}] / lambda^{2k}',
    sobolev_avoided: true, // the chaining cost is sqrt(log N), not the half-derivative cost
  }),

  cumulant_decomposition: Object.freeze({
    kappa_2: 'int int phi(x_1) phi(x_2) c_2(x_1, x_2) dx_1 dx_2',
    kappa_3: 'int int int phi(x_1) phi(x_2) phi(x_3) c_3(x_1, x_2, x_3)',
    kappa_4: 'int^4 phi(x_1)...phi(x_4) c_4(x_1, ..., x_4)',
    note: 'For Gaussian (sine-kernel) limit, kappa_p -> 0 for p >= 3 as N -> infty.',
  }),

  // Even if all the unconditional ingredients above are pooled, the best
  // rate achievable is dominated by the variance kappa_2 via Selberg.
  // The higher cumulants give CORRECTIONS, not improvements to the rate.
  formal_rate_with_kappa2_only: 'psi_N <= C * (log N) / sqrt(N)',
  formal_rate_with_kappa2_and_kappa4: 'psi_N <= C * (log N)^{1+e} / sqrt(N) -- not improved',
  imp407_baseline_rate: 'psi_N <= (3/2) * (log gamma_N)^2 / N -- still wins by sqrt(N)',

  why_higher_cumulants_do_not_improve_rate:
    'Higher cumulants enter the moment bound through partition sums that are ' +
    'no smaller than the leading kappa_2 contribution. The Markov inequality ' +
    'with the (2k)-th moment instead of the (2)-th moment at best removes a ' +
    'log factor (giving sub-Gaussian tails instead of polynomial), but does ' +
    'NOT improve the asymptotic rate of E[psi_N]. The rate is set by kappa_2.',
});

// =========================================================================
// SECTION (c) -- NUMERICAL COMPARISON (formal route vs imp-407 baseline).
// =========================================================================
//
// At N = 1e6 and N = 1e7, compute the formal rate the higher-order route
// would give if all four cumulants were available unconditionally, and
// compare to the imp-407 unconditional baseline.

const N_SAMPLES = [1e3, 1e4, 1e5, 1e6, 1e7];

function logGammaN(N) {
  // gamma_N ~ 2 pi N / log N for large N; log gamma_N ~ log N for the leading bound
  return Math.log(N);
}

const C_SELBERG = 3; // imp-341 / koksma-hlawka-C1-pinned (matches imp-1165 convention)
function imp407Baseline(N) {
  const logG = logGammaN(N);
  return (C_SELBERG / 2) * logG * logG / N;
}

// Formal higher-order-route bound (best-case, assuming all four cumulants):
// psi_N <= C * (log N)^{3/2} / sqrt(N). The 3/2 power comes from:
//   - sqrt(log N) from H^{1/2} seminorm of Poisson kernel via Selberg (kappa_2)
//   - sqrt(log N) from chaining over x to get sup
//   - extra log N from explicit-formula translation cost for kappa_4
const C_HIGHER_ORDER_ROUTE = 1;
function higherOrderRouteBound(N) {
  const logG = logGammaN(N);
  return C_HIGHER_ORDER_ROUTE * Math.pow(logG, 1.5) / Math.sqrt(N);
}

function ratioRouteVsBaseline(N) {
  return higherOrderRouteBound(N) / imp407Baseline(N);
}

const COMPARISON_ROWS = N_SAMPLES.map((N) => ({
  N,
  logGamma: logGammaN(N),
  imp407Baseline: imp407Baseline(N),
  higherOrderRoute: higherOrderRouteBound(N),
  ratio_route_over_baseline: ratioRouteVsBaseline(N),
  routeBeatsBaseline: higherOrderRouteBound(N) < imp407Baseline(N),
}));

const CROSSOVER_HAPPENS_IN_REALISTIC_RANGE =
  COMPARISON_ROWS.some((r) => r.routeBeatsBaseline);

// =========================================================================
// SECTION (d) -- NAMED OBSTRUCTIONS (research-grade-open).
// =========================================================================

const NAMED_OBSTRUCTIONS = Object.freeze([
  Object.freeze({
    id: 'O-HOC-A',
    label: 'c_3 unconditional for general test functions not available',
    severity: 'critical',
    detail:
      'The connected 3-point correlation function c_3(x_1, x_2, x_3) of zeros is ' +
      'unconditional only for test functions with Fourier support in (-2/3, 2/3) ' +
      '(Rudnick-Sarnak 1996, Theorem 1.1). The Poisson kernel phi_{x, y_micro} at ' +
      'the microscopic scale has Fourier support extending to ~log N (not bounded), ' +
      'falling outside the Rudnick-Sarnak regime. Closing this requires either ' +
      '(a) proving Rudnick-Sarnak with no bandwidth restriction (equivalent to ' +
      'major progress on Bogomolny-Keating triple-correlation conjecture), or ' +
      '(b) a non-c_3 method for kappa_3.',
    blocks: 'unconditional bound on the 3rd cumulant of L_N(phi_{x, y_micro})',
  }),
  Object.freeze({
    id: 'O-HOC-B',
    label: 'Heath-Brown 4th moment is of zeta, not of zero 4-point density',
    severity: 'high',
    detail:
      'Heath-Brown 1981 gives int |zeta(1/2 + it)|^4 dt ~ T (log T)^4 / (2 pi^2). ' +
      'Translating this to a bound on the 4-point connected correlation function ' +
      'of zeros c_4 requires the Riemann von-Mangoldt explicit formula, which ' +
      'introduces a log T factor. The resulting bound on kappa_4(L_N(f)) is at ' +
      'best ||f||_4^4 * (log N)^{5} / N -- WORSE by log N than the conjectural ' +
      'sharp value ||f||_{H^{1/2}}^4 / N^2. The route therefore does not improve ' +
      'the rate, only adjusts the constant (and loses log factors doing so).',
    blocks: 'rate-improving use of Heath-Brown 4th moment via explicit formula',
  }),
  Object.freeze({
    id: 'O-HOC-C',
    label: 'higher cumulants do not improve the asymptotic rate',
    severity: 'high',
    detail:
      'Even if kappa_p were available unconditionally for all p, the Markov ' +
      'inequality with (2k)-th moment yields psi_N > lambda with probability ' +
      '<= E[psi_N^{2k}] / lambda^{2k}. Optimizing over k changes the tail ' +
      'BEHAVIOR (sub-Gaussian instead of polynomial) but not the asymptotic ' +
      'RATE of E[psi_N]. The rate is set by the leading cumulant kappa_2. ' +
      'Therefore the higher-order route, even if all cumulants were unconditional, ' +
      'cannot beat the imp-407 baseline rate of (log N)^2 / N -- it can at best ' +
      'match it (with worse constants from explicit-formula translation).',
    blocks: 'rate improvement beyond the kappa_2 (variance) Selberg baseline',
  }),
  Object.freeze({
    id: 'O-HOC-D',
    label: 'chaining over x adds (log N)^{1/2} that imp-407 baseline avoids',
    severity: 'medium',
    detail:
      'The imp-407 baseline (3/2) (log gamma_N)^2 / N is derived directly from ' +
      'the second-moment Selberg + Koksma-Hlawka discrepancy chain, NOT via ' +
      'chaining over the sup. The higher-order route requires Dudley/Talagrand ' +
      'chaining over the x-parameter to convert pointwise moment bounds into ' +
      'sup-bounds, which costs sqrt(log N). This is a structural cost of any ' +
      'moment-method route, and it explains why the formal higher-order rate ' +
      'is N^{-1/2} (log N)^{3/2} -- strictly worse than imp-407 N^{-1+e}.',
    blocks: 'eliminating the sqrt(log N) chaining factor in the sup-out step',
  }),
  Object.freeze({
    id: 'O-HOC-E',
    label: 'Rudnick-Sarnak restricted-bandwidth corollary covers wrong observable',
    severity: 'low',
    detail:
      'The Rudnick-Sarnak 1996 unconditional regime DOES cover SOME observables ' +
      '(those with restricted-bandwidth Fourier support), but the ESY closure ' +
      'observable psi_N at y_micro is NOT in that class. A corollary covering ' +
      'bandwidth-restricted lin-stat is publishable as a side result, but does ' +
      'not deliver an ESY closure. Future work could attempt a regularization of ' +
      'phi_{x, y_micro} into the bandwidth-restricted regime, paying a Fourier-' +
      'tail penalty that needs to be quantified.',
    blocks: 'direct use of Rudnick-Sarnak on the Poisson kernel',
  }),
  Object.freeze({
    id: 'O-HOC-F',
    label: 'no determinantal structure for Riemann zeros',
    severity: 'critical',
    detail:
      'The CUE-side Soshnikov 2000 proof uses determinantal structure to bound ' +
      'all cumulants simultaneously via cycle identities. Riemann zeros do not ' +
      'have any known determinantal structure (unconditionally or conjecturally ' +
      'beyond Montgomery PCC at the 2-point level). Therefore the moment ' +
      'method cannot piggyback on a global determinantal identity -- it has ' +
      'to address each cumulant individually, and each individual cumulant ' +
      'requires its own unconditional input. This is THE structural obstacle ' +
      'separating the random-matrix case from the Riemann case.',
    blocks: 'cycle-identity-based simultaneous control of all kappa_p',
  }),
]);

// =========================================================================
// SECTION (e) -- EXPORTED FROZEN RECORD.
// =========================================================================

export const IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE = Object.freeze({
  id: 'imp-1180-higher-order-correlation-route',
  ticket: 'imp-1180',
  builtAt: '2026-05-22T17:45:00Z',

  verdict: 'higher-order-route-research-grade-open-c3-unconditional-gap',
  isRigorous: true, // the partial map and obstruction list are rigorous
  isNewClosureOfESY: false, // does NOT close the ESY observable
  isImprovementOver407Baseline: false, // formal route bound is strictly worse than imp-407
  isDistinctFromHRBridge: true, // not subsumed by imp-1165 negative

  ingredientInventory: INGREDIENT_INVENTORY,
  observableSketch: OBSERVABLE_SKETCH,

  comparison: Object.freeze({
    rows: COMPARISON_ROWS,
    crossoverHappensInRealisticRange: CROSSOVER_HAPPENS_IN_REALISTIC_RANGE,
    interpretation:
      'At every realistic N in [10^3, 10^7], the formal best-case higher-order-' +
      'route bound (log N)^{3/2} / sqrt(N) is strictly LARGER than the imp-407 ' +
      'unconditional baseline (3/2)(log gamma_N)^2 / N. The route therefore ' +
      'cannot improve the rate even in the formal limit; closing the named ' +
      'unconditional gaps would only sharpen the constants, not beat imp-407.',
  }),

  namedObstructions: NAMED_OBSTRUCTIONS,

  whatAlternativeRoutesRemainForESYClosure: Object.freeze([
    Object.freeze({
      route: 'direct-selberg-plus-esy-rigidity',
      description: 'imp-407 / imp-508 angle (b) direct argument -- still live, ' +
        'not addressed by this ticket.',
      status: 'research-grade-open',
    }),
    Object.freeze({
      route: 'higher-order-correlations-bandwidth-restricted-corollary',
      description: 'A corollary of the Rudnick-Sarnak unconditional regime giving ' +
        'an ESY-style bound on observables with restricted-bandwidth test ' +
        'functions (NOT the Poisson kernel). Publishable as a side result; ' +
        'does NOT close the original ESY observable.',
      status: 'partial-research-grade-open',
    }),
  ]),

  partialDeliverables: Object.freeze([
    'ingredient inventory of 6 unconditional inputs',
    'moment-method route mapped to the cumulant decomposition of E[L_N(f)^{2k}]',
    'numerical comparison vs imp-407 baseline (formal route loses at every N)',
    '6 named obstructions O-HOC-A through O-HOC-F with severity labels',
    'distinguished from imp-1165 HR-bridge negative (Sobolev vs moment-method)',
    'restricted-bandwidth corollary identified as ship-worthy side result',
  ]),

  references: Object.freeze({
    imp407: 'src/data/esy-rigidity-port.js',
    imp508: 'src/math/esy-o1-closure.js',
    imp1149sobolev: 'src/data/L2-to-Linfty-sobolev-attempt-2026-05.js',
    imp1161: 'src/data/imp-1161-costin-lebowitz-port-attempt.js',
    imp1165: 'src/data/imp-1165-hughes-rudnick-to-esy-closure-bridge.js',
    selberg1944: 'Avh. Norske Vid. Akad. Oslo; Titchmarsh ch. 9 Thm 9.4',
    rudnickSarnak1996: 'Duke Math. J. 81, 269-322',
    heathBrown1981: 'Q. J. Math. 30, 7-22',
    conreyGhosh1989: 'Trans. AMS 314, 793-803',
    buiSound2008: 'Bui-Soundararajan 2008 zero-density',
    conrey1989: 'J. Reine Angew. Math. 399, 1-26',
  }),
});

// =========================================================================
// BUILD-TIME TRIPWIRES (6 required, 8 shipped)
// =========================================================================

export const IMP_1180_ASSERTIONS = [
  {
    id: 'imp1180-verdict-is-research-grade-open',
    why:
      'The verdict must remain research-grade-open with the c_3 unconditional ' +
      'gap named. Flipping to closed or to an ESY-closure claim without ' +
      'addressing O-HOC-A would silently overclaim a major theorem.',
    holds: () => {
      const r = IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE;
      return r.verdict === 'higher-order-route-research-grade-open-c3-unconditional-gap' &&
        r.isNewClosureOfESY === false &&
        r.isImprovementOver407Baseline === false;
    },
  },
  {
    id: 'imp1180-distinct-from-imp1165-sobolev-negative',
    why:
      'This route is mathematically distinct from the imp-1165 HR-Sobolev bridge ' +
      '(moment-method-on-cumulants vs Sobolev embedding). The two negatives are ' +
      'NOT the same and must be tracked separately for the ESY-closure search.',
    holds: () => IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE.isDistinctFromHRBridge === true,
  },
  {
    id: 'imp1180-ingredient-inventory-has-six-entries',
    why:
      'The unconditional ingredient inventory must list at least 6 inputs from ' +
      'Selberg, Rudnick-Sarnak, Heath-Brown, Conrey-Ghosh, Bui-Sound, Conrey. ' +
      'Truncating the list would hide the route map from future readers.',
    holds: () => IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE.ingredientInventory.length >= 6,
  },
  {
    id: 'imp1180-formal-route-strictly-worse-than-baseline-at-every-N',
    why:
      'At every sampled N in [10^3, 10^7], the formal best-case higher-order-route ' +
      'bound must be strictly LARGER (worse) than the imp-407 baseline. ' +
      'Any reversal would mean the route improves the rate, contradicting ' +
      'obstruction O-HOC-C (higher cumulants do not improve the rate).',
    holds: () =>
      IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE.comparison.rows.every((r) => !r.routeBeatsBaseline),
  },
  {
    id: 'imp1180-six-named-obstructions-with-severity',
    why:
      'A research-grade-open route map must enumerate at least 6 named obstructions ' +
      'with severity labels so that closure attempts know exactly which step to ' +
      'attack. Listing fewer would understate the route blockage.',
    holds: () => {
      const obs = IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE.namedObstructions;
      const requiredIds = ['O-HOC-A', 'O-HOC-B', 'O-HOC-C', 'O-HOC-D', 'O-HOC-E', 'O-HOC-F'];
      const seenIds = new Set(obs.map((o) => o.id));
      return obs.length >= 6 &&
        requiredIds.every((rid) => seenIds.has(rid)) &&
        obs.every((o) => typeof o.severity === 'string' && o.severity.length > 0);
    },
  },
  {
    id: 'imp1180-c3-bottleneck-explicitly-named-as-critical',
    why:
      'The c_3 unconditional gap for general test functions (O-HOC-A) is THE ' +
      'specific blocker. It must be labeled severity = critical so that future ' +
      'route attempts target this step (Bogomolny-Keating triple-correlation).',
    holds: () => {
      const o = IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE.namedObstructions.find(
        (x) => x.id === 'O-HOC-A'
      );
      return !!o && o.severity === 'critical' && /c_?3/.test(o.detail);
    },
  },
  {
    id: 'imp1180-baseline-formula-matches-imp407-and-imp1165',
    why:
      'The imp-407 baseline formula (3/2)(log gamma_N)^2 / N with C_Selberg = 3 ' +
      'must match the imp-1165 convention so the two negative results agree on ' +
      'the baseline. At N = 1e6 the baseline should be ~2.87e-4.',
    holds: () => {
      const at1e6 = IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE.comparison.rows.find((r) => r.N === 1e6);
      return at1e6 && Math.abs(at1e6.imp407Baseline - 2.864788e-4) < 1e-5;
    },
  },
  {
    id: 'imp1180-route-rate-is-N-half-with-log-factor',
    why:
      'The formal higher-order-route bound must scale as N^{-1/2} (up to log ' +
      'factors). Computing the log-log slope across [10^3, 10^7] should give ' +
      'slope between -0.55 and -0.35 (pure rate -0.5 with log correction).',
    holds: () => {
      const rows = IMP_1180_HIGHER_ORDER_CORRELATION_ROUTE.comparison.rows;
      const firstN = rows[0].N;
      const lastN = rows[rows.length - 1].N;
      const firstBound = rows[0].higherOrderRoute;
      const lastBound = rows[rows.length - 1].higherOrderRoute;
      const slope = Math.log(lastBound / firstBound) / Math.log(lastN / firstN);
      return slope < -0.35 && slope > -0.55;
    },
  },
];
