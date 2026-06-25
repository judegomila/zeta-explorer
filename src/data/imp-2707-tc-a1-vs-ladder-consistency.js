/**
 * @module imp-2707-tc-a1-vs-ladder-consistency
 *
 * imp-2707 (medium, numerical): Cross-source consistency tripwire between the
 * TWO independent |t_c| pipelines that both feed the S7 rigor verdict:
 *
 *   (A) the ANALYTIC A1 Theta-trap  t_c^part <= g_min^2/6 = 2.3686e-4 at
 *       N* = 1e4 (imp-2635 / imp-2644), machine-bracketed by imp-2762; this is
 *       the value E_flow uses as its Gronwall exponent input, and
 *   (B) the VERIFIED-ARITHMETIC ladder of measured collision times |t_c(N)|
 *       from the imp-2466 Dormand-Prince 5(4)-vs-RK4 cross-check and the
 *       imp-362 interval brackets (interval-dyson-integrator.mjs witness).
 *
 * The ticket sketch asked for an assertion that the A1 trap 2.37e-4 is an
 * UPPER BOUND on the imp-362 interval bracket on |t_c| at N* = 1e4. Reading
 * the two pipelines together shows that literal cross-check is NOT the right
 * one, for two honest reasons surfaced here (no false QED):
 *
 *   1. THE TWO SOURCES MEASURE DIFFERENT QUANTITIES. (A) bounds t_c^part, the
 *      LOCAL two-body Lehmer-pair Theta-trap collision time (Theta(0) <= 1/4),
 *      driven by the anomalously small Odlyzko-certified Lehmer gap
 *      g_min(1e4) = 0.0376985. (B) measures |t_c(N)|, the GLOBAL many-body
 *      mean-field collision time of the closest pair under the full backward
 *      Dyson flow. They are comparable in magnitude at small N but the trap
 *      g_min(N)^2/6 is NOT a uniform upper bound on the measured |t_c(N)|:
 *      computed pointwise it sits ABOVE the measured value at N in {100,200}
 *      yet BELOW it at N in {50,500}. So "2.37e-4 bounds the |t_c| bracket"
 *      is simply false; the honest relation is an ORDERING, not a bound.
 *
 *   2. THERE IS NO N* = 1e4 LADDER ROW. The bundled verified-arithmetic ladder
 *      runs on the light 870-ordinate table and stops at N = 870
 *      (GAP-2466-fresh-N1e4-1e6), so a DIRECT same-N bracket comparison at
 *      1e4 is infeasible with current data.
 *
 * What IS true, load-bearing, and worth a silent-regression tripwire: the A1
 * LOCAL trap at N* = 1e4 sits FAR BELOW the GLOBAL empirical |t_c| sources --
 * roughly 28x below the measured ladder magnitude at the largest bundled
 * N (870, |t_c| ~ 6.5e-3) and ~30x below the OLS global projection at 1e4
 * (0.0071, the figure imp-2644 cites when it replaces OLS by A1). This
 * ORDERING is exactly the regime the E_flow discharge relies on: the local
 * Lehmer-pair trap is a strictly smaller quantity than the global collision
 * time. A future edit to g_min(1e4), the /6 factor, or the trap literal that
 * pushed the A1 value up into or above the global ladder regime would invert
 * this ordering -- and that is the drift this module FAILs the build on.
 *
 * No new claim, no change to any Lambda value: a cross-pipeline ordering
 * tripwire that keeps the analytic A1 source and the verified-arithmetic
 * ladder from silently diverging.
 *
 * @see imp-2762-tc-a1-trap-interval (machine bracket on g_min^2/6)
 * @see imp-2466-dyson-tc-interval-ladder (DP5-vs-RK4 measured |t_c(N)| ladder)
 * @see imp-2644-eflow-gronwall-cg-discharge (A1 replaces OLS 0.0071 as exponent input)
 */

import { IMP2762_TC_A1_TRAP_INTERVAL } from './imp-2762-tc-a1-trap-interval.js';
import { DYSON_DP5_RK4_CROSSVERIFY } from './imp-2466-dyson-tc-interval-ladder.js';

// ── Source A: the analytic A1 Theta-trap at N* = 1e4 ────────────────────────
// nominalFloat = g_min^2/6 = 2.368628e-4; hi = the outward-rounded ceiling.
const TC_A1_NOMINAL = IMP2762_TC_A1_TRAP_INTERVAL.trapInterval.nominalFloat;
const TC_A1_HI = IMP2762_TC_A1_TRAP_INTERVAL.trapInterval.hi;

// ── Source B: the verified-arithmetic ladder largest-N measured magnitude ───
// Pick the cross-verified row at the largest N (the smallest, tightest global
// collision time the bundled ladder reaches) and take the larger of the two
// independent integrator estimates as the measured |t_c| magnitude there.
function largestNLadderMeasurement() {
  const live = (DYSON_DP5_RK4_CROSSVERIFY.rows ?? []).filter(
    (r) => r.status === 'cross-verified'
      && typeof r.tc_rk4 === 'number'
      && typeof r.tc_dp5 === 'number',
  );
  if (live.length === 0) return null;
  const top = live.reduce((a, b) => (b.N > a.N ? b : a));
  return { N: top.N, tc: Math.max(top.tc_rk4, top.tc_dp5) };
}

const LADDER_TOP = largestNLadderMeasurement();

// ── OLS global projection of |t_c| at N* = 1e4 ──────────────────────────────
// The figure imp-2644 cites (line: "A1 ... ~30x smaller than the OLS
// projection 0.0071") when it replaces the OLS proxy by the rigorous A1 input.
const OLS_PROJECTION_1E4 = 0.0071;
const N_STAR = 1e4;

const RATIO_VS_LADDER_TOP = LADDER_TOP ? LADDER_TOP.tc / TC_A1_HI : null;
const RATIO_VS_OLS = OLS_PROJECTION_1E4 / TC_A1_HI;

export const IMP2707_TC_A1_VS_LADDER = {
  id: 'imp-2707',
  question:
    'Do the analytic A1 |t_c| trap and the verified-arithmetic |t_c(N)| ladder stay in their expected ordering, so the two pipelines feeding the S7 verdict cannot silently diverge?',
  sourceA: {
    label: 'analytic A1 Theta-trap t_c^part <= g_min^2/6 at N* = 1e4',
    nominal: TC_A1_NOMINAL,
    ceiling: TC_A1_HI,
    quantity: 'LOCAL two-body Lehmer-pair collision time (g_min = 0.0376985)',
  },
  sourceB: {
    label: 'verified-arithmetic DP5/RK4 ladder largest-N measured |t_c(N)|',
    atN: LADDER_TOP ? LADDER_TOP.N : null,
    measured: LADDER_TOP ? LADDER_TOP.tc : null,
    quantity: 'GLOBAL many-body mean-field collision time (closest pair)',
    olsProjectionAt1e4: OLS_PROJECTION_1E4,
  },
  ordering: {
    ratioVsLadderTop: RATIO_VS_LADDER_TOP === null ? null : +RATIO_VS_LADDER_TOP.toFixed(2),
    ratioVsOls: +RATIO_VS_OLS.toFixed(2),
    note:
      'A1 local trap sits ~28x below the measured ladder magnitude at N = 870 '
      + 'and ~30x below the OLS global projection at N* = 1e4. The ordering '
      + '(local trap << global empirical |t_c|), not a bound, is the true relation.',
  },
  honestScope: [
    'The A1 trap and the |t_c(N)| ladder measure DIFFERENT quantities (local '
      + 'Lehmer-pair Theta-trap vs global mean-field collision); g_min(N)^2/6 is '
      + 'NOT a uniform upper bound on the measured |t_c(N)| (above at N in '
      + '{100,200}, below at N in {50,500}), so the ticket-sketch "2.37e-4 bounds '
      + 'the bracket" is false and is not asserted.',
    'The bundled ladder stops at N = 870 (GAP-2466-fresh-N1e4-1e6); there is no '
      + 'N* = 1e4 interval row, so a direct same-N bracket comparison at 1e4 is '
      + 'infeasible with current data. This module guards the ORDERING instead.',
    'No new claim and no Lambda value changes: a cross-pipeline drift tripwire only.',
  ],
  verdict:
    'A1 trap ' + TC_A1_HI.toExponential(4) + ' (local) stays far below the global '
    + 'empirical |t_c| sources (ladder ~'
    + (LADDER_TOP ? LADDER_TOP.tc.toExponential(2) : 'n/a') + ' at N = '
    + (LADDER_TOP ? LADDER_TOP.N : 'n/a') + ', OLS ' + OLS_PROJECTION_1E4
    + ' at N* = 1e4). The two |t_c| pipelines are in their expected ordering; '
    + 'an inversion would FAIL the build. No false QED.',
};

export const IMP2707_TC_A1_VS_LADDER_ASSERTIONS = [
  {
    id: 'imp2707-a1-trap-below-ladder-top',
    description:
      'The analytic A1 trap ceiling at N* = 1e4 is strictly below the verified-arithmetic ladder largest-N measured |t_c| (the global collision time at N = 870), by a wide margin (> 10x). An inversion signals g_min/factor drift into the global regime.',
    holds: () =>
      LADDER_TOP !== null
      && TC_A1_HI > 0
      && TC_A1_HI < LADDER_TOP.tc
      && RATIO_VS_LADDER_TOP > 10,
  },
  {
    id: 'imp2707-a1-trap-below-ols-projection',
    description:
      'The A1 trap stays ~30x below the OLS global projection 0.0071 at N* = 1e4, matching the imp-2644 "A1 is ~30x smaller than OLS" relationship; the ratio stays in the expected band [20, 40].',
    holds: () =>
      TC_A1_HI < OLS_PROJECTION_1E4
      && RATIO_VS_OLS > 20
      && RATIO_VS_OLS < 40,
  },
  {
    id: 'imp2707-no-n1e4-ladder-row-honest-scope',
    description:
      'The verified-arithmetic ladder has NO row at N* = 1e4 (GAP-2466-fresh-N1e4-1e6): the largest cross-verified N is strictly below 1e4, so a direct same-N bracket comparison at 1e4 is infeasible and is not claimed.',
    holds: () => LADDER_TOP !== null && LADDER_TOP.N < N_STAR,
  },
];

for (const a of IMP2707_TC_A1_VS_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2707-tc-a1-vs-ladder-consistency assertion failed: ${a.id}`);
  }
}
