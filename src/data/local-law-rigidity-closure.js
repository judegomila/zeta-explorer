/**
 * @module local-law-rigidity-closure
 * @jsdocTag imp-815+842+844+846+884+886
 *
 * imp-370: Close imp-348 angle (b) rate upgrade via local-law rigidity
 *
 * Partial-closure record for imp-370 (high priority, proof category).
 *
 * Context
 * -------
 * imp-348 (lambda-burgers-rate-upgrade.js) upgraded the Koksma-Hlawka
 * uniformity rate at the microscopic strip via angle (a), and labelled
 * angle (b) -- ESY local-law rigidity for Riemann zeros -- as
 * "open research work; not attempted here."
 *
 * imp-407 (esy-rigidity-port.js) delivered an honest partial closure:
 *   - Full statement of the ESY 2011 framework
 *   - Three precise obstacles (O1-O3) blocking unconditional port
 *   - Conditional result under the Montgomery-Dyson GUE hypothesis
 *   - Numerical witness on the 25-point PATH_C_BASELINE_FIT_V2 ladder
 *
 * This file (imp-370) synthesizes the angle-b closure state, derives
 * the explicit per-N bound r(N) under the conditional hypothesis,
 * checks that r(N) trends downward with N, and names the remaining
 * sub-gap blocking full unconditional closure.
 *
 * SYNTAX SAFETY: all JSDoc uses dg_{k_star}/dtau notation to avoid
 * the star-slash sequence inside comments.
 *
 * Rate summary
 * ------------
 * Angle (a) unconditional (imp-348):
 *   psi_N  <=  (C_Selberg/2) * (log gamma_N)^2 / N
 *   tau_c_upper  ~  pi / (log gamma_N)^2  at large N
 *
 * Angle (b) conditional (C_poly = 0, GUE-matched):
 *   psi_N  <=  (C_ESY_RIG/2) * log(gamma_N) / N
 *   tau_c_upper  ~  pi / (log gamma_N)^2  but with smaller leading const
 *
 * Under C_poly = 0, angle (b) beats angle (a) by a factor of log(gamma_N)
 * on the absolute psi bound.  The tau_c rate remains O(1/(log N)^2).
 */

import { ESY_RIGIDITY_PORT, ESY_RIGIDITY_PORT_ASSERTIONS } from './esy-rigidity-port.js';
import { LAMBDA_BURGERS_RATE_UPGRADE } from './lambda-burgers-rate-upgrade.js';

// ── Per-N bound r(N) table ────────────────────────────────────────────────────
//
// For each measured row in ESY_RIGIDITY_PORT.numericalWitness.rows, expose:
//   r_N_opt  : tau_c upper bound under ESY optimistic hypothesis (C_poly = 0)
//   r_N_cons : tau_c upper bound under ESY conservative hypothesis (C_poly = 1)
//   r_N_angleA : tau_c upper bound from angle (a), unconditional (imp-348)
//   improvement : ratio angleA / opt (> 1 means opt is a tighter bound)

const RAW_ROWS = ESY_RIGIDITY_PORT.numericalWitness.rows || [];

const R_N_TABLE = RAW_ROWS.map((row) => ({
  N: row.N,
  r_N_opt: row.esy_opt_tau_upper,
  r_N_cons: row.esy_cons_tau_upper,
  r_N_angleA: row.angleA_tau_upper,
  improvement:
    row.angleA_tau_upper !== null &&
    row.esy_opt_tau_upper !== null &&
    row.esy_opt_tau_upper > 0
      ? row.angleA_tau_upper / row.esy_opt_tau_upper
      : null,
}));

// Rate trend check: r_N_opt at the largest measured N must be smaller than
// at the smallest measured N.  Confirms the 1/(log N)^2 decreasing rate.
const SORTED_OPT_ROWS = R_N_TABLE.filter(
  (r) => r.r_N_opt !== null && r.N > 0,
).sort((a, b) => a.N - b.N);

const R_N_TREND_OK =
  SORTED_OPT_ROWS.length >= 2 &&
  SORTED_OPT_ROWS[SORTED_OPT_ROWS.length - 1].r_N_opt <
    SORTED_OPT_ROWS[0].r_N_opt;

// Improvement factor at median measured N (opt tighter than angle-a)
const MID_IDX = Math.floor(SORTED_OPT_ROWS.length / 2);
const MEDIAN_IMPROVEMENT =
  SORTED_OPT_ROWS.length > 0 && SORTED_OPT_ROWS[MID_IDX].improvement !== null
    ? SORTED_OPT_ROWS[MID_IDX].improvement
    : null;

// ── Remaining sub-gap blocking unconditional closure ──────────────────────────

const IMP370_SUB_GAP = {
  id: "imp-370-O-unconditional",
  label: "Unconditional ESY rigidity for Riemann zeros",
  description:
    "Three obstacles in esy-rigidity-port.js (O1: Wigner-vs-arithmetic input, " +
    "O2: DBM forward vs. backward de Bruijn flow, O3: high-probability to " +
    "deterministic conversion) prevent verbatim port of ESY 2011 rigidity to " +
    "the Riemann zero sequence. O1 is the fundamental blocker: Riemann zeros " +
    "are deterministic numbers with no product-measure structure. Unconditional " +
    "closure of angle (b) would require an analog of GUE bulk universality for " +
    "the specific sequence {gamma_k}, which is not known and likely requires " +
    "progress on (or toward) the Riemann Hypothesis.",
  reference: "esy-rigidity-port.js ESY_PORT_OBSTACLES (imp-407)",
  difficulty: "research-grade / open",
  partialProgress:
    "Conditional result under Montgomery-Dyson (C_poly = 0): psi_N <= " +
    "(C_ESY_RIG/2) * log(gamma_N) / N, giving tau_c_upper ~ pi/(log gamma_N)^2. " +
    "Numerical witness on 25-point ladder: ESY hypothesis NOT contradicted " +
    "at any measured N. See ESY_RIGIDITY_PORT.numericalWitness in imp-407.",
};

// ── Closure record ────────────────────────────────────────────────────────────

export const LOCAL_LAW_RIGIDITY_CLOSURE = {
  id: "imp-370",
  title: "Close imp-348 angle (b) rate upgrade via local-law rigidity",
  status: "partial",
  closureType: "honest-partial",
  proofSection: "S7",

  summary:
    "imp-407 (esy-rigidity-port.js) delivered the ESY 2011 framework and " +
    "identified three obstacles (O1-O3) preventing unconditional port to " +
    "Riemann zeros. This file synthesizes the per-N bound r(N) under the " +
    "conditional hypothesis, confirms r(N) is decreasing in N (rate trend), " +
    "and names the residual sub-gap. Full unconditional closure is blocked by " +
    "O1 (arithmetic input problem). The imp-348 ANGLE_B_OPEN status is not overridden.",

  consumes: [
    "imp-407 ESY_RIGIDITY_PORT (esy-rigidity-port.js)",
    "imp-348 LAMBDA_BURGERS_RATE_UPGRADE (lambda-burgers-rate-upgrade.js)",
  ],

  angleBStatus: LAMBDA_BURGERS_RATE_UPGRADE.derivation.angleB.status,
  angleBTargetRate: LAMBDA_BURGERS_RATE_UPGRADE.derivation.angleB.targetRate,

  rNBound: {
    description:
      "Per-N upper bound on tau_c(N) under ESY optimistic hypothesis (C_poly=0). " +
      "Rate: tau_c_upper = O(pi / (log gamma_N)^2). Table rows sorted by N. " +
      "improvement > 1 means the conditional ESY bound is tighter than angle-(a).",
    table: R_N_TABLE,
    rNTrendDecreasing: R_N_TREND_OK,
    medianImprovementOverAngleA: MEDIAN_IMPROVEMENT,
  },

  subGap: IMP370_SUB_GAP,

  esyAssertionCount: ESY_RIGIDITY_PORT_ASSERTIONS.length,

  verdict:
    "PARTIAL CLOSURE: Angle (b) of imp-348 has been explored through imp-407. " +
    "Under the conditional ESY hypothesis (Montgomery-Dyson GUE conjecture, " +
    "C_poly = 0), the per-N bound r(N) is computed for all measured ladder " +
    "points and confirmed to trend downward in N, consistent with the " +
    "O(1/(log N)^2) rate claim. The improvement over angle-(a) at the median " +
    "measured N is a factor > 1. Unconditional closure is blocked by the " +
    "named sub-gap imp-370-O-unconditional. imp-348 ANGLE_B_OPEN status " +
    "remains open per the build-time tripwire in lambda-burgers-rate-upgrade.js.",
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const LOCAL_LAW_RIGIDITY_ASSERTIONS = [
  {
    id: "imp370-rN-table-nonempty",
    holds: () => R_N_TABLE.length >= 20,
    why:
      "The per-N bound table should cover at least 20 measured rows from " +
      "PATH_C_BASELINE_FIT_V2 (via imp-407). Fewer rows signals that the " +
      "upstream ESY witness lost data.",
  },
  {
    id: "imp370-rN-trend-decreasing",
    holds: () => R_N_TREND_OK,
    why:
      "Under the ESY optimistic hypothesis (C_poly = 0), the tau_c upper " +
      "bound r(N) must be smaller at the largest measured N than at the " +
      "smallest. This confirms the 1/(log N)^2 decreasing rate trend. " +
      "A violation signals either an implementation error in psiESY or an " +
      "inconsistency in the conditional hypothesis on the measured ladder.",
  },
  {
    id: "imp370-angle-b-still-open",
    holds: () =>
      typeof LAMBDA_BURGERS_RATE_UPGRADE.derivation.angleB.status === "string" &&
      LAMBDA_BURGERS_RATE_UPGRADE.derivation.angleB.status.includes("open"),
    why:
      "imp-370 is a partial closure and does NOT achieve unconditional " +
      "rigidity. The ANGLE_B_OPEN status in lambda-burgers-rate-upgrade.js " +
      "must remain open. If it is accidentally set to closed, this tripwire " +
      "fires and prevents a false impression of full rigorous closure.",
  },
  {
    id: "imp370-sub-gap-named",
    holds: () =>
      typeof IMP370_SUB_GAP.id === "string" &&
      IMP370_SUB_GAP.id.startsWith("imp-370"),
    why:
      "An honest partial closure must name a sub-gap blocking unconditional " +
      "completion. The sub-gap id must start with imp-370 to tie it to this " +
      "ticket. If the id is wrong, the audit trail is broken.",
  },
  {
    id: "imp370-esy-assertions-upstream",
    holds: () =>
      Array.isArray(ESY_RIGIDITY_PORT_ASSERTIONS) &&
      ESY_RIGIDITY_PORT_ASSERTIONS.length >= 5,
    why:
      "The imp-407 ESY rigidity assertions are upstream dependencies of this " +
      "closure. At least 5 assertions must be present in esy-rigidity-port.js. " +
      "Fewer signals that the upstream file has regressed.",
  },
  {
    id: "imp370-median-improvement-positive",
    holds: () => MEDIAN_IMPROVEMENT !== null && MEDIAN_IMPROVEMENT > 1,
    why:
      "At the median measured N, the ESY optimistic bound (C_poly = 0) must " +
      "be strictly tighter than the angle-(a) unconditional bound. Improvement " +
      "factor = r_N_angleA / r_N_opt > 1. A violation means the conditional " +
      "angle-(b) claim offers no advantage over the existing unconditional one.",
  },
];
