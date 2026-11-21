/**
 * @module imp-96613-route-m-lammin-nuniform-lowerbound-obstruction-assessment
 *
 * imp-96613 (proof, ASSESSMENT ONLY): assess the imp-96563 limiting-spectrum sub-gap
 * (IMP96563_SUBGAP) as the route that would BYPASS the double-precision certification
 * limit N ~ 1.08e5 (imp-96591) and the imp-96584 double-double reach N ~ 2.67e10. The
 * question: what limiting-spectrum / Szego-type statement would give an N-UNIFORM
 * analytic lower bound lam_min(G_N) >= A N^-p (valid for ALL N at once, not per-rung),
 * and what is the concrete obstruction -- the multiplicative kernel and the
 * log-divergent unbounded edge (imp-96562 / imp-96586) -- that has so far blocked it.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim. It is a
 * structural consolidation of imp-96562 (top edge), imp-96582 (bottom edge), imp-96586
 * (mean-field) and imp-96591 (cert crossover) against the imp-96428 measured lam_min
 * ladder (A=0.8187, p=1.9179). NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- WHY only an N-uniform ANALYTIC bound bypasses the crossover.
 * -------------------------------------------------------------------------------
 * The per-rung verified-Cholesky enclosure (imp-96563 FINDING 1) certifies
 * lam_min(G_N) > 0 only at the single N where the Cholesky is actually run, and the
 * rounding shift delta(N) = g_{n+1} I(1,1) H_N overtakes lam_min ~ A N^-p at the
 * crossover N ~ 1.0757e5 in double precision (imp-96591) and N ~ 2.67e10 in double-double
 * (imp-96584). Neither reaches the conditioning ceiling N ~ 2.59e7 / 4.11e7 in a way that
 * is both rigorous and unbounded in N. A single N-UNIFORM analytic statement
 * lam_min(G_N) >= A N^-p with an explicit constant A and exponent p, proved once, holds
 * for EVERY N simultaneously with zero compute -- so it is the ONLY object that both
 * bypasses the precision crossover and certifies the ceiling figure (indeed all N). This
 * is exactly the imp-96563 / imp-96582 residual sub-gap, now stated as the precision-
 * bypass requirement.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- it is a finite-section RATE (coercivity) statement, NOT a limiting
 *              spectral-distribution statement; classical Szego cannot supply it.
 * -------------------------------------------------------------------------------
 * A Szego / Grenander limiting-spectrum theorem pins the eigenvalue COUNTING MEASURE and
 * its edges as N -> oo. But imp-96582 FINDING 1 showed the bottom edge of the limiting
 * spectrum is 0 (lam_min collapses by ~1179x, monotone; 0 lies in the spectrum of the
 * infinite multiplicative Vasyunin operator). So a limiting spectral-distribution
 * statement yields only the trivial lam_min -> 0 with NO rate. The needed object is the
 * finite-N RATE of approach -- equivalently an N-uniform COERCIVITY / lower-frame bound
 *
 *     <G_N x, x> >= A N^-p ||x||^2   for all x in C^N,
 *
 * an edge-SCALING law (Fisher-Hartwig / Widom class for a vanishing-symbol edge), which
 * lives OUTSIDE bulk limiting-spectral-distribution theory. So no bounded-symbol Szego
 * ess-inf -- additive or otherwise -- can deliver it; the framework addresses the wrong
 * object (measure, not rate).
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the concrete obstruction is threefold and structural.
 * -------------------------------------------------------------------------------
 *   (a) WRONG GROUP (multiplicative, not additive-Toeplitz). G_{hk} =
 *       gcd(h,k) I(h/g,k/g)/(hk) is translation invariant on the MULTIPLICATIVE
 *       semigroup (a Dirichlet-type / Bohr-lift kernel), not on the additive group Z, so
 *       it has no additive symbol. Both the Szego edge theorem AND the additive
 *       Fisher-Hartwig / Widom edge-scaling theory -- the only additive framework that
 *       produces a RATE for a vanishing / singular symbol -- require that symbol and so
 *       cannot be invoked (imp-96562 FINDING 2a; imp-96582 FINDING 2a).
 *   (b) NON-COMPACT / UNBOUNDED companion edge. The TOP edge diverges as ~0.3526 log N
 *       (imp-96562 / imp-96586), the fingerprint of a NON-COMPACT multiplicative operator
 *       with a Dirichlet-series singularity. Non-compactness removes the stable-finite-
 *       section / compact-perturbation route that would otherwise upgrade a per-rung
 *       enclosure into a uniform rate: the finite sections do not converge in norm to a
 *       compact limiting operator, so no Baxter / Gohberg-Feldman stability argument
 *       transfers invertibility with a rate.
 *   (c) COLLECTIVE effect, no mean-field surrogate. imp-96586 FINDING 2 showed the peak
 *       (k=1) row is Hilbert-Schmidt (Sum_k G_{1,k}^2 converges to ~4.055), so every
 *       rank-one / mean-field / Cesaro averaged-symbol surrogate saturates to a finite
 *       edge and carries NO log-divergence; the spectral behaviour at both edges is a
 *       genuinely collective multi-index effect. Hence not even a HEURISTIC derivation of
 *       the constant A or exponent p is available from an averaged symbol.
 *
 * -------------------------------------------------------------------------------
 * FINDING 4 -- the closest available analytic machinery bounds the WRONG edge.
 * -------------------------------------------------------------------------------
 * The natural analytic home for the multiplicative gcd kernel is the GCD-sum / Gal-type
 * literature (Gal 1949; Lindqvist-Seip; Bondarenko-Seip large GCD sums; Montgomery-Vaughan
 * large sieve). That machinery produces UPPER bounds on quadratic forms in gcd(h,k)/(hk)-
 * type kernels -- i.e. it controls the TOP of the spectrum (a lam_max / off-diagonal-mass
 * quantity, the imp-96562 direction), which is exactly the edge for which imp-96548 already
 * has the rigorous trace-domination upper bound. It does NOT supply the LOWER frame /
 * coercivity bound (a positive-definite comparison kernel, or a large-sieve LOWER
 * inequality) that lam_min >= A N^-p requires. So the one body of theory that speaks the
 * right (multiplicative) language addresses the wrong edge; no lower-frame analog is
 * available.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * NO N-uniform analytic lower bound lam_min(G_N) >= A N^-p is available, and none is in
 * reach of the named machinery. The sub-gap is a finite-section edge-SCALING (lower-frame /
 * coercivity) statement for a NON-COMPACT MULTIPLICATIVE operator whose limiting spectrum
 * contains 0: (a) no additive symbol exists, so neither Szego nor additive Fisher-Hartwig /
 * Widom edge-scaling applies; (b) non-compactness (the ~0.3526 log N divergent top edge)
 * blocks stable-finite-section transfer of a per-rung enclosure into a uniform rate; (c)
 * the effect is collective (Hilbert-Schmidt peak row), so mean-field / averaged-symbol
 * heuristics give nothing; (d) the closest right-language machinery (GCD-sum / Gal /
 * Bondarenko-Seip / large sieve) bounds the TOP edge, not the lower frame. Until a
 * multiplicative lower-frame inequality is proved, the imp-96591 double-precision crossover
 * N ~ 1.08e5 and the imp-96584 double-double reach N ~ 2.67e10 remain the only certified
 * routes and the conditioning-ceiling FIGURE stays fit-extrapolated. Changes no bound; no
 * operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (names IMP96563_SUBGAP)
 * @see imp-96582-route-m-lammin-bottom-edge-szego-assessment.js (bottom edge value 0)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (top edge log-divergence / unbounded symbol)
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (Hilbert-Schmidt peak row; collective effect)
 * @see imp-96591-route-m-lammin-cert-limit-crossover-measurement.js (double-precision crossover N~1.08e5)
 * @see imp-96584-route-m-lammin-doubledouble-cert-reach.js (double-double reach N~2.67e10)
 *
 * Ticket: imp-96613 (proof, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Inputs reused verbatim from the record (imp-96428 fit + ceilings + crossovers).
export const IMP96613_INPUTS = Object.freeze({
  lamMinA: 0.8186721, // imp-96428 fit lam_min ~ A N^-p (the target constant a uniform bound would need)
  lamMinP: 1.917927,
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N
  topEdgeSlope: 0.3526253785070698, // imp-96562 lam_max ~ 0.3526 log N (unbounded / non-compact edge)
  bottomCollapseRatio: 1179.0, // imp-96582: lam_min collapse across N=250..1e4 (bottom edge -> 0)
  peakRowHilbertSchmidt: 4.0547, // imp-96586: Sum_k G_{1,k}^2 converges (rank-one surrogate saturates)
  doublePrecCrossoverN: 107565.5, // imp-96591 measured double-precision cert crossover ~1.0757e5
  doubleDoubleReachN: 2.67e10, // imp-96584 double-double verified-Cholesky reach
  conditioningCeilingN: 25900000, // imp-96548 rigorous-lam_max conditioning ceiling ~2.59e7
  measuredCeilingN: 41088904.757400334, // imp-96548 measured-fit ceiling ~4.11e7
});

// FINDING 1 -- only an N-uniform analytic bound bypasses the precision crossover.
export const IMP96613_BYPASS_REQUIREMENT = Object.freeze({
  perRungEnclosureIsPointwise: true, // verified Cholesky certifies only the single N run
  doublePrecCrossoverN: IMP96613_INPUTS.doublePrecCrossoverN,
  doubleDoubleReachN: IMP96613_INPUTS.doubleDoubleReachN,
  // the double-double reach is still finite and below neither ceiling by a large margin,
  // but a proved N-uniform bound covers ALL N at once -- the true bypass.
  doubleDoubleReachAboveCeiling:
    IMP96613_INPUTS.doubleDoubleReachN > IMP96613_INPUTS.conditioningCeilingN,
  uniformBoundCoversAllN: true,
  statement:
    'a per-rung verified-Cholesky enclosure certifies lam_min > 0 only at the N actually ' +
    'run and expires at the double-precision crossover N ~ 1.08e5 (imp-96591) / the ' +
    'double-double reach N ~ 2.67e10 (imp-96584); a single proved N-UNIFORM analytic bound ' +
    'lam_min(G_N) >= A N^-p holds for every N at once with zero compute, so it is the only ' +
    'object that bypasses the precision crossover and certifies the ceiling figure.',
});

// FINDING 2 -- rate/coercivity statement, not limiting spectral distribution.
export const IMP96613_STATEMENT_NEEDED = Object.freeze({
  form: 'coercivity / lower-frame bound: <G_N x, x> >= A N^-p ||x||^2 for all x in C^N, uniform in N',
  isLimitingSpectralDistribution: false, // LSD gives only the trivial bottom edge 0 (imp-96582 F1)
  isEdgeScalingRate: true, // Fisher-Hartwig / Widom-class vanishing-edge phenomenon
  szegoEssInfGivesOnlyTrivialZero: true,
  note:
    'the bottom edge of the limiting spectrum is 0 (imp-96582), so a Szego / Grenander ' +
    'spectral-distribution statement yields only lam_min -> 0 with no rate; the needed object ' +
    'is the finite-N RATE (an N-uniform coercivity / lower-frame bound), an edge-scaling law ' +
    'outside bulk limiting-spectral-distribution theory.',
});

// FINDING 3 -- the threefold concrete obstruction.
export const IMP96613_OBSTRUCTION = Object.freeze({
  wrongGroup:
    'the Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) is translation invariant on the ' +
    'MULTIPLICATIVE semigroup (a Dirichlet / Bohr-lift kernel), not on the additive group Z, ' +
    'so it has no additive symbol; neither the Szego edge theorem nor the additive ' +
    'Fisher-Hartwig / Widom edge-scaling theory (the only additive framework producing a RATE ' +
    'for a vanishing / singular symbol) can be invoked.',
  nonCompactUnboundedEdge:
    'the companion TOP edge diverges as ~0.3526 log N (imp-96562 / imp-96586), the fingerprint ' +
    'of a NON-COMPACT multiplicative operator with a Dirichlet-series singularity; ' +
    'non-compactness removes the stable-finite-section / compact-perturbation (Baxter / ' +
    'Gohberg-Feldman) route that would upgrade a per-rung enclosure into a uniform rate.',
  collectiveNoMeanField:
    'the peak (k=1) row is Hilbert-Schmidt (Sum_k G_{1,k}^2 -> ~4.055, imp-96586), so every ' +
    'rank-one / mean-field / Cesaro averaged-symbol surrogate saturates to a finite edge and ' +
    'carries no log-divergence; both spectral edges are collective multi-index effects, so not ' +
    'even a heuristic derivation of A or p is available.',
});

// FINDING 4 -- closest analytic machinery bounds the wrong edge.
export const IMP96613_NEAREST_MACHINERY = Object.freeze({
  literature:
    'GCD-sum / Gal-type theory (Gal 1949; Lindqvist-Seip; Bondarenko-Seip large GCD sums; ' +
    'Montgomery-Vaughan large sieve) is the natural analytic home for the multiplicative gcd kernel.',
  whatItGives: 'UPPER bounds on gcd(h,k)/(hk)-type quadratic forms -- a lam_max / off-diagonal-mass (top-edge) control',
  whyInsufficient:
    'the top edge already has the rigorous imp-96548 trace-domination upper bound; the LOWER ' +
    'frame / coercivity bound lam_min >= A N^-p needs a positive-definite comparison kernel or ' +
    'a large-sieve LOWER inequality, for which no GCD-sum analog is available. The one body of ' +
    'theory in the right (multiplicative) language addresses the wrong edge.',
  boundsWrongEdge: true,
});

export const IMP96613_VERDICT = Object.freeze({
  question:
    'what limiting-spectrum / Szego-type statement would give an N-uniform analytic lower ' +
    'bound lam_min(G_N) >= A N^-p bypassing the imp-96591 double-precision cert limit, and ' +
    'what concrete obstruction (multiplicative kernel; log-divergent unbounded edge) blocks it?',
  uniformAnalyticLowerBoundExists: false,
  statementNeeded: 'N-uniform coercivity / lower-frame bound <G_N x, x> >= A N^-p ||x||^2',
  isSpectralDistributionStatement: false,
  isEdgeScalingRate: true,
  obstructionWrongGroup: true,
  obstructionNonCompact: true,
  obstructionCollective: true,
  nearestMachineryBoundsWrongEdge: true,
  anyBoundMoved: false,
  conclusion:
    'NO N-uniform analytic lower bound lam_min(G_N) >= A N^-p is available and none is in reach ' +
    'of the named machinery. The sub-gap is a finite-section edge-SCALING (lower-frame / ' +
    'coercivity) statement for a NON-COMPACT MULTIPLICATIVE operator whose limiting spectrum ' +
    'contains 0: (a) no additive symbol, so neither Szego nor additive Fisher-Hartwig / Widom ' +
    'edge-scaling applies; (b) non-compactness (the ~0.3526 log N divergent top edge) blocks ' +
    'stable-finite-section transfer; (c) the effect is collective (Hilbert-Schmidt peak row), so ' +
    'mean-field heuristics give nothing; (d) the closest right-language machinery (GCD-sum / Gal / ' +
    'Bondarenko-Seip / large sieve) bounds the TOP edge, not the lower frame. So the imp-96591 ' +
    'double-precision crossover N ~ 1.08e5 and the imp-96584 double-double reach N ~ 2.67e10 stay ' +
    'the only certified routes and the conditioning-ceiling FIGURE stays fit-extrapolated. Changes ' +
    'no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96613_SUBGAP = Object.freeze({
  id: 'imp-96613-lammin-nuniform-multiplicative-lower-frame-bound',
  statement:
    'the residual open piece (= IMP96563_SUBGAP / IMP96582_SUBGAP, unchanged) is specifically an ' +
    'N-UNIFORM lower-frame / coercivity inequality <G_N x, x> >= A N^-p ||x||^2 for the ' +
    'multiplicative Vasyunin operator gcd(h,k) I(h/g,k/g)/(hk), with explicit A and p. No additive ' +
    'Szego / Fisher-Hartwig / Widom theorem reaches it (wrong group), non-compactness blocks the ' +
    'finite-section stability route, the effect is collective (no mean-field surrogate), and the ' +
    'nearest GCD-sum / large-sieve machinery bounds the top edge only. Until one is proved, the ' +
    'imp-96548 / imp-96563 conditioning-ceiling FIGURE stays fit-extrapolated.',
});

export const IMP96613_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: this is a structural ' +
  'consolidation of imp-96562 (top edge), imp-96582 (bottom edge), imp-96586 (mean-field) and ' +
  'imp-96591 / imp-96584 (precision crossovers) against the imp-96428 measured lam_min ladder. No ' +
  'Gram was rebuilt, no bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96613_ASSERTIONS = [
  {
    id: 'imp96613-uniform-bound-is-the-bypass',
    holds: () =>
      IMP96613_BYPASS_REQUIREMENT.perRungEnclosureIsPointwise === true &&
      IMP96613_BYPASS_REQUIREMENT.uniformBoundCoversAllN === true &&
      IMP96613_BYPASS_REQUIREMENT.doublePrecCrossoverN > 1.0e5 &&
      IMP96613_BYPASS_REQUIREMENT.doublePrecCrossoverN < 1.1e5,
    why: 'a per-rung enclosure is pointwise and expires at the double-precision crossover ~1.08e5; only a proved N-uniform analytic bound covers all N and bypasses the crossover.',
  },
  {
    id: 'imp96613-rate-not-distribution',
    holds: () =>
      IMP96613_STATEMENT_NEEDED.isLimitingSpectralDistribution === false &&
      IMP96613_STATEMENT_NEEDED.isEdgeScalingRate === true &&
      IMP96613_STATEMENT_NEEDED.szegoEssInfGivesOnlyTrivialZero === true &&
      IMP96613_INPUTS.bottomCollapseRatio > 1000,
    why: 'the bottom edge of the limiting spectrum is 0 (collapse >1000x), so limiting spectral distribution gives only the trivial 0; the needed object is the finite-N coercivity RATE.',
  },
  {
    id: 'imp96613-obstruction-threefold',
    holds: () =>
      /multiplicative/i.test(IMP96613_OBSTRUCTION.wrongGroup) &&
      /non-compact/i.test(IMP96613_OBSTRUCTION.nonCompactUnboundedEdge) &&
      /Hilbert-Schmidt/.test(IMP96613_OBSTRUCTION.collectiveNoMeanField) &&
      IMP96613_INPUTS.topEdgeSlope > 0.35 &&
      IMP96613_INPUTS.topEdgeSlope < 0.36,
    why: 'the obstruction is threefold: wrong (multiplicative) group, non-compact unbounded top edge (~0.3526 log N), and a collective (Hilbert-Schmidt peak row) effect with no mean-field surrogate.',
  },
  {
    id: 'imp96613-nearest-machinery-wrong-edge',
    holds: () =>
      IMP96613_NEAREST_MACHINERY.boundsWrongEdge === true &&
      /GCD-sum/.test(IMP96613_NEAREST_MACHINERY.literature) &&
      /UPPER/.test(IMP96613_NEAREST_MACHINERY.whatItGives),
    why: 'the closest right-language machinery (GCD-sum / Gal / Bondarenko-Seip / large sieve) gives UPPER bounds on the top edge, not the lower frame bound lam_min >= A N^-p needs.',
  },
  {
    id: 'imp96613-honesty-gate-no-qed',
    holds: () =>
      IMP96613_VERDICT.anyBoundMoved === false &&
      IMP96613_VERDICT.uniformAnalyticLowerBoundExists === false &&
      /NO QED/.test(IMP96613_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96613_HONEST_BANNER) &&
      /RH open/.test(IMP96613_HONEST_BANNER) &&
      /lower-frame/.test(IMP96613_SUBGAP.id),
    why: 'assessment only: no bound moved, no uniform analytic lower bound claimed, the honesty markers and the lower-frame sub-gap slug are present.',
  },
];

for (const a of IMP96613_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96613-route-m-lammin-nuniform-lowerbound-obstruction-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96613_INPUTS,
  bypassRequirement: IMP96613_BYPASS_REQUIREMENT,
  statementNeeded: IMP96613_STATEMENT_NEEDED,
  obstruction: IMP96613_OBSTRUCTION,
  nearestMachinery: IMP96613_NEAREST_MACHINERY,
  verdict: IMP96613_VERDICT,
  subGap: IMP96613_SUBGAP,
  banner: IMP96613_HONEST_BANNER,
};
