/**
 * Λ error-budget audit (imp-314)
 *
 * The Path C result Λ = 0.0066 ± 0.01 (commit 229f...) has an error bar
 * larger than its central value, so the SIGN of Λ is not currently
 * decidable from this scale. imp-314 asked: where does the ±0.01 come
 * from, how big is each piece, and which pieces are tightenable?
 *
 * This file enumerates the three identified sources, gives a quantified
 * contribution for each (with the reasoning behind the number), and
 * pairs each source with the cheapest realistic mitigation. It is
 * intentionally a data file rather than a doc so other modules and
 * tests can import the budget and refuse to silently overstate the
 * combined error.
 *
 * Sources of the ±0.01
 * --------------------
 *
 *   (i)   SCALING-FIT INTERCEPT — the |t_c| = 0.0066 + 4.91/N fit
 *         (R² = 0.943) is taken across N ∈ {50, 100, 200, 500, 2458}.
 *         The intercept IS our Λ estimate, so its standard error
 *         dominates the budget. With 5 points, residual variance
 *         R² = 0.943 (i.e. ~5.7% unexplained variance), and the lever
 *         arm 1/N spanning [4·10⁻⁴, 0.02], the intercept SE is roughly
 *         √(σ²·Σ(1/N)²/Δ) ≈ 7·10⁻³. This is the LARGEST contributor.
 *         Tightening: imp-315 adds N = 5000 (and ideally N = 3500),
 *         which doubles the lever arm and re-tests the linear shape.
 *
 *   (ii)  DYSON RK4 FLOAT64 DRIFT — accumulated roundoff in the 1/(γ_n−γ_k)
 *         reduction over ~10⁴ RK4 steps for the 2458-zero ODE. Pre-imp-306
 *         this was the dominant source (~1·10⁻³ per collision-time
 *         estimate). After imp-306 (Kahan summation + step-doubling
 *         Richardson local error /15), the residual integration error
 *         is bounded by the accumulated Richardson estimate, typically
 *         O(10⁻⁵) per trajectory. So this source is now SMALL relative
 *         to (i) and (iii). Tightening: switch the sum to a binary
 *         tree reduction (further halves the error) or run in
 *         arbitrary-precision near the collision; both already scoped.
 *
 *   (iii) FINITE-N EXTRAPOLATION SHAPE — even with a perfect fit and
 *         zero integration error, our largest data point is N = 2458,
 *         and we extrapolate to N → ∞. The leading correction is
 *         4.91/N ≈ 2·10⁻³ at N = 2458. If the true scaling has a
 *         sub-leading 1/N² (or 1/N · log N) term we are not modelling,
 *         it shifts the intercept by some fraction of that 2·10⁻³.
 *         Conservative estimate: ~3·10⁻³. Tightening: fit
 *         |t_c| = a + b/N + c/N² and check whether c is significant;
 *         this is also blocked on imp-315 adding more points at
 *         large N to make the fit identifiable.
 *
 * Combination
 * -----------
 * The three sources are approximately independent. Adding them in
 * quadrature gives
 *
 *     √( 7² + 0.01² + 3² ) · 10⁻³ ≈ 7.6 · 10⁻³,
 *
 * which is consistent with the reported ±0.01 (the published number
 * rounds up for safety and absorbs second-order effects we have not
 * yet itemised — e.g. zero-list rounding, Turing-method tail).
 *
 * Decidability target
 * -------------------
 * For the sign of Λ to become decidable at THIS central value of
 * 0.0066, the combined error has to drop below ~5·10⁻³. The budget
 * shows that almost all of that has to come from source (i): even if
 * (ii) goes to zero and (iii) is halved, the fit-intercept SE is the
 * binding constraint. Hence imp-315 (extend N) and a re-fit with the
 * sub-leading term are the prerequisites for any "Λ > 0 numerically
 * verified" claim at this scale — see imp-314 / imp-315 in the queue.
 */

export const LAMBDA_ERROR_BUDGET = {
  centralValue: 0.0066,
  reportedError: 0.01,
  centralValueSource: 'imp-307 / commit 229139',
  zeroCount: 2458,
  verifiedHeight: 3000, // T_0 of the underlying zero list

  sources: [
    {
      id: 'fit-intercept-se',
      name: 'Scaling-fit intercept standard error',
      contribution: 7.0e-3,
      dominant: true,
      reasoning:
        '5-point fit |t_c| = a + b/N over N ∈ {50,100,200,500,2458} with R² = 0.943. ' +
        'Residual variance and short lever arm in 1/N give an intercept SE near 7·10⁻³.',
      mitigation: 'imp-315: extend to N = 3500, 5000 to double the lever arm and re-fit.',
      tightenable: true,
    },
    {
      id: 'rk4-roundoff',
      name: 'Dyson RK4 float64 accumulated roundoff',
      contribution: 1.0e-5,
      dominant: false,
      reasoning:
        'Post-imp-306 the 1/(γ_n−γ_k) sum uses Kahan compensation and the integrator ' +
        'tracks a step-doubling Richardson local error /15, accumulated over ~10⁴ steps. ' +
        'The bounded estimate is O(10⁻⁵) per trajectory — already negligible vs (i).',
      mitigation: 'Tree reduction or arbitrary-precision near collision; low priority.',
      tightenable: true,
    },
    {
      id: 'finite-n-extrapolation',
      name: 'Finite-N extrapolation shape (missing 1/N², 1/N·log N)',
      contribution: 3.0e-3,
      dominant: false,
      reasoning:
        'Extrapolating from N_max = 2458 to N → ∞ with a pure 1/N model. ' +
        'The 4.91/N term at N = 2458 is ≈ 2·10⁻³, so an unmodelled sub-leading term ' +
        'can plausibly bias the intercept by a few·10⁻³.',
      mitigation:
        'Fit a + b/N + c/N²; identifiability requires more large-N points (imp-315).',
      tightenable: true,
    },
  ],

  // Quadrature combination of the listed sources
  combinedQuadrature: Math.sqrt(7.0e-3 ** 2 + 1.0e-5 ** 2 + 3.0e-3 ** 2),

  // The threshold below which the sign of Λ becomes decidable at the
  // current central value of 0.0066.
  signDecidabilityThreshold: 5.0e-3,

  // What the audit concludes
  bindingConstraint: 'fit-intercept-se',
  preconditionForSignClaim: 'imp-315 (extend N to 3500, 5000) + re-fit with 1/N² term',

  // Plain-English caveat for any UI surface
  uiDisclaimer:
    'The ±0.01 on Λ = 0.0066 is dominated by the standard error of the ' +
    '5-point 1/N scaling fit (~7·10⁻³). Until that fit gains more large-N ' +
    'points (imp-315), the sign of Λ cannot be claimed at this scale.',
};

// Sanity assertions — used by tests to refuse silent edits.
export const ERROR_BUDGET_ASSERTIONS = [
  {
    id: 'quadrature-within-reported',
    holds: () =>
      LAMBDA_ERROR_BUDGET.combinedQuadrature <= LAMBDA_ERROR_BUDGET.reportedError,
    why: 'Quadrature sum of itemised sources must not exceed the reported ±0.01.',
  },
  {
    id: 'binding-source-exists',
    holds: () =>
      LAMBDA_ERROR_BUDGET.sources.some(
        (s) => s.id === LAMBDA_ERROR_BUDGET.bindingConstraint && s.dominant,
      ),
    why: 'The named binding constraint must point at a source flagged dominant.',
  },
  {
    id: 'sign-not-decidable-yet',
    holds: () =>
      LAMBDA_ERROR_BUDGET.reportedError > LAMBDA_ERROR_BUDGET.centralValue,
    why: 'imp-314: until the error bar shrinks below the central value, the sign of Λ stays undecided.',
  },
];
