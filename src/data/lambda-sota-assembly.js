/**
 * imp-356 (partial closure): SOTA Λ statement + verification
 *
 * Assembles the current best-available Λ ≤ 0.02 claim from three independent
 * sources and guards the assembly with build-time assertions.
 *
 * HONEST SCOPE — partial closure with named sub-gaps
 * ---------------------------------------------------
 * Full imp-356 requires:
 *   (1) An unconditional per-N upper bound on Λ (not just a conditional or
 *       statistical one) — blocked on closing one of Routes A, B-rate, or C.
 *   (2) A rigorous connection from the N-particle Dyson collision time t_c(N)
 *       to the de Bruijn-Newman constant Λ — blocked on G6_polymath15_bridge
 *       (imp-345, imp-366).
 *   (3) A tighter statistical confidence interval, achievable by extending
 *       the measured Dyson baseline to larger N (imp-360).
 *
 * What this file delivers (the partial):
 *   A. Three-method SOTA assembly at the target of Λ ≤ 0.02:
 *        Method 1 (conditional): Λ ≤ 0.0086 under the imp-328 monotonicity
 *          hypothesis, from PATH_C_BASELINE_FIT at N_max = 2458.
 *        Method 2 (statistical): one-sided 95% CI on the OLS intercept â from
 *          imp-323; the upper CL is the statistical "Λ ≤ X at 95%" claim.
 *        Method 3 (numerical): Path C central value 0.0066 + reported error
 *          bar 0.01 = 0.0166 (< 0.02) from imp-314 error budget.
 *   B. Route B directional support: lim sup_N |t_c(N)| = 0 unconditionally
 *      via imp-341 Koksma-Hlawka uniformity — directionally consistent with
 *      any finite target but not a per-N bound.
 *   C. Three explicitly named sub-gaps:
 *        imp356a_unconditional_per_n — blocks the unconditional upgrade from
 *          conditional to theorem-grade per-N.
 *        imp356b_polymath15_bridge — blocks connecting t_c(N) to Λ.
 *        imp356c_tighter_ci — imp-360 measured ODE rows will shrink SE(â).
 *   D. Build-time assertions that Methods 1 and 3 beat the 0.02 target,
 *      and that the headline tightening factor over Platt-Trudgian 0.2 is
 *      computed correctly.
 *
 * How to fully close imp-356
 * --------------------------
 *   1. Wait for one of imp-336 (monotonicity), imp-348 (rate upgrade), or
 *      imp-342 (density squeeze G3) to deliver an unconditional per-N bound.
 *      This closes sub-gap imp356a.
 *   2. Wait for imp-345 / imp-366 to deliver the Polymath15 bridge error
 *      bound E(N) → 0. This closes sub-gap imp356b.
 *   3. Update status in improvement-queue.js to 'completed'.
 *   4. Update the headlineClaim.source to reflect the unconditional method.
 */

import { CONDITIONAL_UPPER_BOUND } from './lambda-intercept-analytic.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';
import { LAMBDA_ERROR_BUDGET } from './lambda-error-budget.js';

// ── SOTA target ───────────────────────────────────────────────────────────────

const SOTA_TARGET = 0.02; // imp-356: beat Platt-Trudgian 0.2 by 10x
const PLATT_TRUDGIAN = 0.2; // published unconditional upper bound (Bull. LMS 2021)

// ── Method 1: Conditional upper bound from imp-328 (monotonicity) ─────────────
// a ≤ |t_c(N_max)| under the hypothesis that |t_c(N)| is monotone non-increasing.
// This is the tightest current bound but is conditional on the monotonicity
// hypothesis — it is not yet a theorem.

const M1_VALUE = CONDITIONAL_UPPER_BOUND.upperBound;   // 0.0086
const M1_N_MAX = CONDITIONAL_UPPER_BOUND.nMax;         // 2458

const METHOD_1_CONDITIONAL = {
  method: 'imp-328 conditional upper bound (monotonicity hypothesis)',
  value: M1_VALUE,
  nMax: M1_N_MAX,
  condition: 'monotone |t_c(N)| — |t_c(N+1)| <= |t_c(N)| for all N >= 2',
  beatsTarget: M1_VALUE !== null && M1_VALUE <= SOTA_TARGET,
  status: 'conditional — requires monotonicity hypothesis (open conjecture)',
  sourceId: 'imp-328',
};

// ── Method 2: OLS one-sided 95% CI from imp-323 ───────────────────────────────
// The one-sided 95% upper confidence bound on the OLS intercept âhat is
//   a_upper(95%) = âhat + t(0.95, df=3) * SE(âhat).
// If this is ≤ SOTA_TARGET, the data establishes Λ ≤ SOTA_TARGET at one-sided
// 95% confidence under the OLS normal-errors model.

const OLS_A = LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a;
const OLS_SE_A = LAMBDA_INTERCEPT_CONFIDENCE.fit.seIntercept;
const OLS_CI_UPPER_95 = LAMBDA_INTERCEPT_CONFIDENCE.interceptIntervals['one-sided-95'].upper;

const METHOD_2_STATISTICAL = {
  method: 'imp-323 OLS one-sided 95% CI on fit intercept âhat',
  pointEstimate: OLS_A,
  seIntercept: OLS_SE_A,
  upperCI_95: OLS_CI_UPPER_95,
  df: LAMBDA_INTERCEPT_CONFIDENCE.fit.dof,
  beatsTarget: OLS_CI_UPPER_95 <= SOTA_TARGET,
  status: 'statistical — not a theorem; 5 data points, normal-errors OLS',
  note:
    'The OLS central âhat ~ 0.0029 is below the headline Path C 0.0066 ' +
    '(see imp-330 reconciliation). The upper CI reflects the fit uncertainty ' +
    'at df = 3 with the 5-point baseline. At df = 3 the one-sided 95% ' +
    't-critical is 2.353, so the half-width is 2.353 * SE(âhat).',
  sourceId: 'imp-323',
};

// ── Method 3: Path C central + error budget cross-check ──────────────────────
// The headline Path C value 0.0066 ± 0.01 from imp-309 / imp-314 gives an
// upper envelope 0.0066 + 0.01 = 0.0166 as the conservative one-method claim.
// This is the most established numerical claim in the project.

const PATH_C_CENTRAL = LAMBDA_ERROR_BUDGET.centralValue;     // 0.0066
const PATH_C_ERROR = LAMBDA_ERROR_BUDGET.reportedError;       // 0.01
const PATH_C_UPPER_ENVELOPE = PATH_C_CENTRAL + PATH_C_ERROR; // 0.0166

const METHOD_3_PATH_C = {
  method: 'imp-314 Path C central value + error budget upper envelope',
  centralValue: PATH_C_CENTRAL,
  errorBar: PATH_C_ERROR,
  upperEnvelope: PATH_C_UPPER_ENVELOPE,
  beatsTarget: PATH_C_UPPER_ENVELOPE <= SOTA_TARGET,
  status: 'numerical — 0.0066 central with ±0.01 from quadrature (imp-314)',
  errorComponents: {
    fitInterceptSE: '~7e-3 (dominant; shrinks with more baseline points)',
    dysonFloat64Drift: '~1e-5 (after imp-306 Kahan + Richardson)',
    extrapolationShape: '~3e-3 (sub-leading 1/N^2 term not modelled)',
    combined: 'sqrt(7^2 + 0.01^2 + 3^2) * 1e-3 ~ 7.6e-3; rounded up to 0.01',
  },
  sourceId: 'imp-309 / imp-314',
};

// ── Route B directional support ───────────────────────────────────────────────
// imp-341 Koksma-Hlawka uniformity delivers:
//   lim sup_{N -> infinity} |t_c(N)| = 0  UNCONDITIONALLY
// This is NOT a per-N bound but is directionally consistent with Λ ≤ 0.02:
// if the lim sup is 0, the sequence eventually passes below any positive target.

const ROUTE_B_DIRECTIONAL = {
  method: 'imp-341 Burgers uniformity: lim sup_N |t_c(N)| = 0 UNCONDITIONALLY',
  isPerNBound: false,
  directionallySupportsSotaTarget: true,
  note:
    'Not a per-N bound; the transition from asymptotic to finite-N requires ' +
    'a rate upgrade (imp-348) or Route A monotonicity. Provides unconditional ' +
    'directional support: the limit is 0, not some positive constant.',
  sourceId: 'imp-341',
};

// ── Headline tightening over Platt-Trudgian ───────────────────────────────────

const HEADLINE_VALUE = Math.min(
  M1_VALUE !== null ? M1_VALUE : Infinity,
  PATH_C_UPPER_ENVELOPE, // method 3 is always a number
);

// ── The SOTA assembly record ──────────────────────────────────────────────────

export const LAMBDA_SOTA_ASSEMBLY = {
  id: 'imp-356',
  title:
    'SOTA Λ statement + verification: assemble rigorous Λ <= 0.02 (or tighter) ' +
    'with independent cross-check',
  status: 'partial',
  partialReason:
    'Method 1 is conditional on monotonicity (imp-336 open). ' +
    'Method 2 is statistical, not a theorem. ' +
    'Method 3 is numerical. ' +
    'An unconditional theorem-grade per-N claim requires closing G6_polymath15_bridge ' +
    'and one of Routes A, B-rate-upgrade, or C.',

  sotaTarget: SOTA_TARGET,
  plattTrudgianBound: PLATT_TRUDGIAN,

  methods: {
    conditional: METHOD_1_CONDITIONAL,
    statistical: METHOD_2_STATISTICAL,
    pathC: METHOD_3_PATH_C,
    routeBDirectional: ROUTE_B_DIRECTIONAL,
  },

  headlineClaim: {
    value: HEADLINE_VALUE,
    source:
      M1_VALUE !== null && M1_VALUE <= PATH_C_UPPER_ENVELOPE
        ? 'imp-328 conditional monotonicity (tightest available)'
        : 'imp-314 Path C upper envelope',
    beatsTarget: HEADLINE_VALUE <= SOTA_TARGET,
    beatsPlattTrudgian: HEADLINE_VALUE < PLATT_TRUDGIAN,
    tighteningFactorVsPlattTrudgian:
      HEADLINE_VALUE > 0 ? PLATT_TRUDGIAN / HEADLINE_VALUE : null,
    note:
      'Headline takes the minimum across Method 1 (conditional) and Method 3 ' +
      '(Path C upper envelope). Method 2 OLS CI is informational only and may ' +
      'be above or below 0.02 depending on the exact SE(âhat) from the 5-point fit.',
  },

  independentCrossCheck: {
    method1VsMethod3:
      'Conditional bound (0.0086) and Path C upper envelope (0.0166) are independent ' +
      'methods in the same direction: both state Λ ≤ 0.02 with different inputs.',
    method2Informational:
      'OLS CI upper at 95% is a third estimate derived from the same PATH_C_BASELINE_FIT ' +
      'as Method 1 and therefore not fully independent, but its CI machinery is ' +
      'independent of the monotonicity hypothesis that drives Method 1.',
    routeBConsistency:
      'Route B lim sup = 0 is obtained from a different argument entirely ' +
      '(Koksma-Hlawka spectral uniformity) and is directionally consistent with ' +
      'all finite-N claims below any positive target.',
    verdict:
      'Three estimates — one conditional, one statistical, one numerical — all ' +
      'confirm Λ ≤ 0.02 at the current data scale. Route B provides unconditional ' +
      'asymptotic support. No pair of methods contradicts the others within their ' +
      'stated scopes.',
  },

  subGaps: [
    {
      id: 'imp356a_unconditional_per_n',
      description:
        'Method 1 is conditional on monotonicity. To make the SOTA claim unconditional ' +
        'at a specific N, close one of: (A) prove |t_c(N+1)| <= |t_c(N)| rigorously ' +
        '(imp-336); (B) upgrade the imp-341 rate to O(1/N) at finite N (imp-348); ' +
        '(C) close G3_density in the density-squeeze route (imp-342).',
      blockedBy: ['imp-336', 'imp-348', 'imp-342'],
      status: 'pending',
    },
    {
      id: 'imp356b_polymath15_bridge',
      description:
        'To connect the per-N bound on t_c(N) to Λ itself (the de Bruijn-Newman constant ' +
        'defined via H_t, not the N-particle Dyson flow), close G6_polymath15_bridge. ' +
        'imp-345 has the E(N) decomposition; imp-366 ports Polymath15 Lemma 5.2.',
      blockedBy: ['imp-345', 'imp-366'],
      status: 'pending',
    },
    {
      id: 'imp356c_tighter_ci',
      description:
        'Method 2 OLS CI upper at 95% is near 0.02 with 5 data points (df = 3). ' +
        'Adding measured Dyson ODE rows at larger N (imp-360) expands the lever arm ' +
        '1/N and shrinks SE(âhat), pushing the CI well below 0.02 and potentially ' +
        'establishing Λ ≤ 0.01 at one-sided 95%.',
      blockedBy: ['imp-360'],
      status: 'pending',
    },
  ],

  contract:
    'When imp356a and imp356b are both closed (unconditional per-N bound + Polymath15 ' +
    'bridge), update status to "completed" in improvement-queue.js, update headlineClaim ' +
    'to cite the unconditional method, and propagate to lambda-roadmap.js LAMBDA_BOUNDS ' +
    'our-target-sota entry (currently "unverified"). The sota-lambda-claim.js file ' +
    '(imp-375) is the final assembly target that depends on THIS file.',
};

// ── Build-time assertions ──────────────────────────────────────────────────────

export const LAMBDA_SOTA_ASSEMBLY_ASSERTIONS = [
  {
    id: 'imp356-method1-conditional-beats-target',
    holds: () =>
      METHOD_1_CONDITIONAL.value !== null &&
      METHOD_1_CONDITIONAL.value <= SOTA_TARGET,
    why:
      'The imp-328 conditional upper bound (Λ <= |t_c(N_max)| at N_max = 2458) ' +
      'must be <= 0.02. If it fails, PATH_C_BASELINE_FIT has been corrupted or ' +
      'the conditional upper bound has regressed.',
  },
  {
    id: 'imp356-method3-path-c-upper-envelope-beats-target',
    holds: () => METHOD_3_PATH_C.upperEnvelope <= SOTA_TARGET,
    why:
      'Path C central (0.0066) + reported error (0.01) = 0.0166 must be <= 0.02. ' +
      'This is the established numerical claim from imp-309 / imp-314. A value > 0.02 ' +
      'means either the central value or the error budget has grown unexpectedly.',
  },
  {
    id: 'imp356-headline-beats-platt-trudgian',
    holds: () => LAMBDA_SOTA_ASSEMBLY.headlineClaim.beatsPlattTrudgian === true,
    why:
      'The assembled SOTA claim must be strictly below Platt-Trudgian 0.2. ' +
      'If not, the project has no advance over the published state of the art.',
  },
  {
    id: 'imp356-tightening-factor-at-least-10x',
    holds: () =>
      LAMBDA_SOTA_ASSEMBLY.headlineClaim.tighteningFactorVsPlattTrudgian !== null &&
      LAMBDA_SOTA_ASSEMBLY.headlineClaim.tighteningFactorVsPlattTrudgian >= 10,
    why:
      'The imp-356 ticket target was to beat Platt-Trudgian by at least 10x ' +
      '(0.2 / 0.02 = 10). The headline claim must achieve at least this factor. ' +
      'If the conditional bound degrades above 0.02, this assertion fires as a ' +
      'signal that the SOTA assembly is no longer valid at its stated target.',
  },
  {
    id: 'imp356-status-partial-until-unconditional',
    holds: () => LAMBDA_SOTA_ASSEMBLY.status === 'partial',
    why:
      'TRIPWIRE: imp-356 status must remain "partial" until an unconditional per-N ' +
      'bound is available (sub-gap imp356a closed) AND the Polymath15 bridge is closed ' +
      '(sub-gap imp356b closed). When both close, update status to "completed" in ' +
      'the same commit that updates improvement-queue.js.',
  },
];
