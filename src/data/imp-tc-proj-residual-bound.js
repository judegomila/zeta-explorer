/**
 * @module imp-tc-proj-residual-bound
 *
 * imp-2846 (high, accuracy): Certify |t_c_proj| as an OLS PROJECTION (not a
 * bound) and decide whether the regression confidence/prediction band yields an
 * honest RIGOROUS one-sided upper bound on t_c at N* = 1e4 -- or certify that it
 * cannot.
 *
 * BACKGROUND
 * ----------
 * The surviving finite-N* = 1e4 beat composes its binding term as
 *     L_cond = |t_c_proj| + E_flow + E_coll   (imp-2631 / imp-2633)
 * where |t_c_proj| approx 0.0071 is the OLS POINT ESTIMATE a + b/N evaluated at
 * N* = 1e4, read from PATH_C_BASELINE_FIT_V2 (imp-400). imp-2632 classified it as
 * an OLS PROJECTION, NOT a rigorous upper bound on t_c(1e4); imp-2689 stress-
 * tested the slope (B1) and intercept (B2) sub-lemmas and found B1 CM-model-
 * conditional and B2 GUE-conditional. This module asks the remaining question:
 * the OLS fit ALSO ships a Student-t confidence band on the intercept
 * (PATH_C_BASELINE_FIT_V2.fit.interceptUpperCL_95). Does that band -- or a
 * prediction interval at N* = 1e4 -- constitute an honest RIGOROUS one-sided
 * upper envelope on the true collision time t_c(1e4)?
 *
 * THE REGRESSION (stated precisely)
 * ---------------------------------
 * Basis        : x = 1/N, model |t_c|(N) = a + b.x  (ordinary least squares).
 * Data         : the imp-360 measured Dyson backward-collision ladder
 *                (DYSON_LADDER_MEASURED, n >= 23 rows; each row a certified
 *                interval [t_c_lo, t_c_hi] from the imp-362 interval integrator).
 * Point sample : tc = midpoint (t_c_lo + t_c_hi)/2 when the interval closed, else
 *                the certified lower bound t_c_lo (budget-exhausted rows).
 * Coefficients : intercept a approx 0.0066, slope b approx 4.91 (imp-2689 records
 *                B1_EMPIRICAL_SLOPE = 4.91); R^2 approx 0.94.
 * Evaluation   : t_c_proj(1e4) = a + b/1e4 approx 0.0071 (cache olsProjection
 *                field = 0.00714 at N = 10000).
 * Band         : PATH_C_BASELINE_FIT_V2 computes a one-sided 95 pct Student-t
 *                ceiling interceptUpperCL_95 = a + t_{0.95, df}.se(a); imp-416
 *                (finite-height-lambda-bound.js) reads it as the "statistical CI
 *                bound" tc_ci_bound = interceptUpperCL_95 + b/N at N* = 1e4.
 *
 * CAN THE CONFIDENCE / PREDICTION BAND BE A RIGOROUS BOUND? -- NEGATIVE
 * --------------------------------------------------------------------
 * A Student-t band converts to a deterministic bound on the true value ONLY if
 * its coverage statement is valid, which requires THREE classical OLS hypotheses.
 * EACH fails here, so the band carries no rigorous one-sided guarantee:
 *
 *   (R1) Correct model specification (no omitted terms).
 *        FAILS. a + b/N is a TRUNCATED asymptotic series; the true |t_c(N)| of
 *        the Calogero-Moser backward flow carries higher-order O(1/N^2) and log
 *        corrections (the same tail that imp-371 barrier-extrapolation probes).
 *        Omitted curvature makes the residuals carry a SYSTEMATIC, sign-coherent
 *        component, so they are not mean-zero. The band centres on a BIASED
 *        target and its width (built from the residual variance) does not bound
 *        that bias. A confidence interval around a misspecified mean is not a
 *        bound on the true t_c(1e4).
 *
 *   (R2) Random sampling with a genuine error distribution.
 *        FAILS. The tc values are DETERMINISTIC outputs of the interval RK4
 *        integrator (imp-362), not draws from a population. There is no sampling
 *        distribution, so the Student-t quantile t_{0.95, df} has no
 *        probabilistic meaning; the nominal "95 pct coverage" is vacuous as a
 *        statement about the deterministic number t_c(1e4).
 *
 *   (R3) Homoskedastic mean-zero Gaussian residuals.
 *        FAILS. Each point estimate is the midpoint of a certified interval whose
 *        half-width [t_c_hi - t_c_lo]/2 varies row to row (and collapses to a
 *        one-sided lower bound for budget-exhausted rows). The point-estimate
 *        error is therefore heteroskedastic, structured, and often one-sided --
 *        not i.i.d. Gaussian. OLS standard errors built on that assumption do not
 *        bound the realised error.
 *
 * WHAT IS ACTUALLY RIGOROUS (for contrast, no upgrade claimed)
 * ------------------------------------------------------------
 * The ONLY deterministic one-sided objects in this stack are
 *   - the per-N certified interval endpoints t_c_lo / t_c_hi at a FIXED N from
 *     the imp-362 interval integrator, and
 *   - the Koksma-Hlawka / Selberg per-N bound tau_c_upper_bound(N) (imp-341,
 *     Weyl-only), recorded in imp-2689 as B2.perNboundUB approx 0.0094.
 * Neither is the OLS band. Extracting a rigorous a + b/N envelope needs the
 * analytic slope/intercept lemmas B1 + B2, which imp-2689 certifies as CM-model-
 * / GUE-conditional. So the regression contributes a SHARP POINT ESTIMATE, not a
 * theorem-grade upper bound.
 *
 * VERDICT -- NEGATIVE CERTIFICATION
 * ---------------------------------
 * The OLS confidence/prediction band gives NO rigorous one-sided upper bound on
 * t_c(1e4). |t_c_proj| approx 0.0071 stays an OLS POINT ESTIMATE (a PROJECTION).
 * The nominal Student-t ceiling interceptUpperCL_95 + b/N is a statistical, NOT
 * theorem-grade, number (consistent with imp-416's honest verdict). This funnels
 * into the same route-map wall as imp-2689; no false QED.
 *
 * @see path-c-baseline-fit-v2 (imp-400, the OLS fit + interceptUpperCL_95)
 * @see imp-2689-tc-proj-b1-b2-status (B1/B2 conditional status of the same term)
 * @see imp-2633-l-cond-constant-discharge (names |t_c_proj| as residual P1)
 * @see finite-height-lambda-bound (imp-416, reads interceptUpperCL_95 + b/N)
 * @see barrier-extrapolation-imp371 (probes the omitted 1/N^2 curvature tail)
 */

// Light certification module -- baked reference literals, NO heavy imports (the
// PATH_C_BASELINE_FIT_V2 fit transitively pulls the interval integrator and the
// 16.7MB zeros bundle and runs live integration on import; we record its pinned
// values here instead, per the build-hang guidance).

// The OLS regression, evaluated at N* = 1e4 (PATH_C_BASELINE_FIT_V2, imp-400).
const TC_PROJ_N1E4 = 0.0071;        // a + b/N point estimate (cache olsProjection 0.00714)
const FIT_INTERCEPT_A = 0.0066;     // OLS intercept a (asymptotic ceiling)
const FIT_SLOPE_B = 4.91;           // OLS slope b (imp-2689 B1_EMPIRICAL_SLOPE)
const FIT_R2 = 0.94;                // coefficient of determination (approx)
const FIT_MIN_POINTS = 23;          // n >= 23 measured rows in the ladder fit

export const IMP2846_TC_PROJ_RESIDUAL_BOUND = {
  id: 'imp-2846',
  question:
    'Certify |t_c_proj| as an OLS projection (not a bound), state the regression and its confidence/prediction band at N* = 1e4, and decide whether the band yields a rigorous one-sided upper bound on t_c(1e4) -- or certify that it cannot.',
  classification: 'NEGATIVE-CERTIFICATION',
  bindingResidual: 'P1 (= |t_c_proj| in L_cond, imp-2633)',

  regression: {
    basis: 'x = 1/N',
    model: '|t_c|(N) = a + b.x  (ordinary least squares)',
    intercept_a: FIT_INTERCEPT_A,
    slope_b: FIT_SLOPE_B,
    R2: FIT_R2,
    nPointsAtLeast: FIT_MIN_POINTS,
    dataSource:
      'imp-360 DYSON_LADDER_MEASURED; per-row certified interval [t_c_lo, t_c_hi] from the imp-362 interval integrator; point estimate = interval midpoint, falling back to t_c_lo for budget-exhausted rows',
  },

  evaluationAtN1e4: {
    N: 1e4,
    tcProj: TC_PROJ_N1E4,
    status: 'OLS-POINT-ESTIMATE-NOT-RIGOROUS',
    form: 't_c_proj(1e4) = a + b/1e4 approx 0.0071  (cache olsProjection field = 0.00714)',
    nominalBand:
      'PATH_C_BASELINE_FIT_V2.fit.interceptUpperCL_95 + b/N is the one-sided 95 pct Student-t ceiling read by imp-416; STATISTICAL, not theorem-grade',
  },

  // Does the Student-t confidence/prediction band give a RIGOROUS one-sided
  // bound on the true t_c(1e4)? Each required OLS hypothesis fails.
  bandRigorVerdict: {
    yieldsRigorousBound: false,
    failedHypotheses: [
      {
        id: 'R1-model-specification',
        requirement: 'the linear-in-1/N model is correctly specified (no omitted terms)',
        fails: true,
        reason:
          'a + b/N is a TRUNCATED asymptotic series; the true |t_c(N)| carries higher-order O(1/N^2) and log corrections (probed by imp-371), so residuals carry a systematic sign-coherent bias and the band centres on a biased target; the band width does not bound that bias.',
      },
      {
        id: 'R2-random-sampling',
        requirement: 'observations are random draws with a genuine error distribution',
        fails: true,
        reason:
          'the tc values are DETERMINISTIC interval-integrator outputs (imp-362), not population samples; with no sampling distribution the Student-t quantile has no probabilistic meaning and the nominal 95 pct coverage is vacuous for the deterministic number t_c(1e4).',
      },
      {
        id: 'R3-homoskedastic-gaussian-residuals',
        requirement: 'residuals are i.i.d. mean-zero homoskedastic Gaussian',
        fails: true,
        reason:
          'each point estimate is the midpoint of a row-dependent certified interval (one-sided lower bound for budget-exhausted rows), so the point-estimate error is heteroskedastic, structured, and often one-sided -- not i.i.d. Gaussian, so OLS standard errors do not bound the realised error.',
      },
    ],
  },

  rigorousAlternativesForContrast: {
    perNcertifiedInterval:
      't_c_lo / t_c_hi at a FIXED N from the imp-362 interval integrator (deterministic two-sided enclosure)',
    koksmaHlawkaPerNbound:
      'tau_c_upper_bound(N) approx 0.0094 (imp-341, Weyl-only; imp-2689 B2.perNboundUB)',
    note:
      'Neither is the OLS band. A rigorous a + b/N envelope would require the analytic slope/intercept lemmas B1 + B2, certified CM-model-/GUE-conditional by imp-2689.',
  },

  funnelsIntoWall: true,
  honestVerdict:
    'NEGATIVE CERTIFICATION: the OLS confidence/prediction band gives NO rigorous ' +
    'one-sided upper bound on t_c(1e4). |t_c_proj| approx 0.0071 stays an OLS POINT ' +
    'ESTIMATE (a PROJECTION); the nominal Student-t ceiling interceptUpperCL_95 + b/N ' +
    'is statistical, not theorem-grade. All three OLS coverage hypotheses (model ' +
    'specification, random sampling, i.i.d. Gaussian residuals) fail for the ' +
    'deterministic interval-integrator ladder. Funnels into the same route-map wall ' +
    'as imp-2689; no false QED.',
  citation:
    'path-c-baseline-fit-v2.js (imp-400 OLS fit + interceptUpperCL_95); imp-2689-tc-proj-b1-b2-status.js (B1/B2 conditional status); imp-2633-l-cond-constant-discharge.js (P1 naming); finite-height-lambda-bound.js (imp-416, statistical CI read); barrier-extrapolation-imp371.js (1/N^2 curvature tail)',
};

export const IMP2846_TC_PROJ_RESIDUAL_BOUND_ASSERTIONS = [
  {
    id: 'imp2846-classified-negative-certification',
    description: 'The deliverable is marked a NEGATIVE certification: OLS gives no rigorous bound',
    holds: () =>
      IMP2846_TC_PROJ_RESIDUAL_BOUND.classification === 'NEGATIVE-CERTIFICATION' &&
      IMP2846_TC_PROJ_RESIDUAL_BOUND.bandRigorVerdict.yieldsRigorousBound === false,
  },
  {
    id: 'imp2846-tcproj-is-point-estimate',
    description: '|t_c_proj| at N* = 1e4 is recorded as an OLS point estimate (~0.0071), NOT a rigorous bound',
    holds: () =>
      IMP2846_TC_PROJ_RESIDUAL_BOUND.evaluationAtN1e4.status === 'OLS-POINT-ESTIMATE-NOT-RIGOROUS' &&
      IMP2846_TC_PROJ_RESIDUAL_BOUND.evaluationAtN1e4.tcProj === 0.0071,
  },
  {
    id: 'imp2846-all-three-ols-hypotheses-fail',
    description: 'All three OLS coverage hypotheses (specification, sampling, i.i.d. Gaussian) are recorded as failing',
    holds: () => {
      const f = IMP2846_TC_PROJ_RESIDUAL_BOUND.bandRigorVerdict.failedHypotheses;
      return f.length === 3 && f.every((h) => h.fails === true);
    },
  },
  {
    id: 'imp2846-regression-form-pinned',
    description: 'The regression is pinned as OLS in x = 1/N with slope ~4.91 and intercept ~0.0066',
    holds: () =>
      IMP2846_TC_PROJ_RESIDUAL_BOUND.regression.basis === 'x = 1/N' &&
      IMP2846_TC_PROJ_RESIDUAL_BOUND.regression.slope_b === 4.91 &&
      IMP2846_TC_PROJ_RESIDUAL_BOUND.regression.intercept_a === 0.0066,
  },
  {
    id: 'imp2846-funnels-into-wall-no-false-qed',
    description: 'The negative certification funnels into the route-map wall (no false QED)',
    holds: () => IMP2846_TC_PROJ_RESIDUAL_BOUND.funnelsIntoWall === true,
  },
];

for (const a of IMP2846_TC_PROJ_RESIDUAL_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-tc-proj-residual-bound assertion failed: ${a.id}`);
  }
}
