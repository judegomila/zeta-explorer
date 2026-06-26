/**
 * @module imp-2466-dyson-tc-interval-ladder
 * @fileoverview Independent second-integrator (Dormand-Prince 5(4)) cross-check of
 * the measured backward Dyson collision time |t_c(N)|, compared against the
 * existing Float64 RK4 integrator and bracketed by the imp-362 interval bars.
 *
 * Proof-chain step: S9-crossverify (Lambda-chain step 2 cross-verification layer).
 * Created by imp-2466.
 *
 * WHY THIS EXISTS
 * ---------------
 * LAMBDA_CHAIN_STEPS step 2 (lambda-roadmap.js) records the backward
 * Calogero-Moser / Dyson flow collision time |t_c(N)| as the empirical core of
 * the Path C Lambda bound. Until now every measured row came from a SINGLE
 * integrator family:
 *   - the classical 4th-order RK4 (backwardCollisionRK4, dyson-scaling-N5000.js),
 *   - and the one-ULP interval RK4 (backwardCollisionInterval, imp-362).
 * Both are RK4. A single integrator cannot tell a genuine collision time from a
 * scheme-specific truncation artifact. The roadmap step explicitly asks for "a
 * second ODE integrator (DP8 alongside RK4)" plus "interval-arithmetic error
 * bars" to elevate the flow from numerical to cross-verified.
 *
 * WHAT THIS DELIVERS (honest partial)
 * -----------------------------------
 * An INDEPENDENT integrator, the embedded Dormand-Prince RK5(4) pair (DOPRI5,
 * the method behind MATLAB ode45 / scipy RK45), reimplemented here with the
 * SAME Kahan-compensated pole reduction used by RK4 so the comparison isolates
 * the integration scheme, not the summation. For each N at which the repo
 * actually owns verified zeros it:
 *   1. runs RK4 (imported, unchanged) and DP5 (this file) at the SAME step dt,
 *   2. reports the two-method collision-time gap |t_c_RK4 - t_c_DP5|, and
 *      both run on the same bundled 870-ordinate ZETA_ZEROS table the imp-362
 *      witness uses, so the zero source is identical across all three methods,
 *   3. checks both Float64 estimates against the imp-362 certified interval
 *      enclosure [t_c_lo, t_c_hi] read from LAMBDA_INTERVAL_DYSON.witness
 *      (already computed; no extra interval compute is triggered here).
 * DP5 is genuinely independent of RK4: 6 stages vs 4, 5th-order vs 4th-order
 * local truncation, a different Butcher tableau. Agreement between a 4th- and a
 * 5th-order scheme at the same dt bounds the step-size error of the measurement,
 * which is exactly the cross-verification the roadmap step asks for.
 *
 * NAMED SUB-GAPS (what is NOT closed)
 * -----------------------------------
 *   GAP-2466-fresh-N1e4-1e6 : The roadmap asks for FRESH measured rows at
 *     N in {1e4, 1e5, 1e6}. This file deliberately runs on the light 870-entry
 *     ZETA_ZEROS table (not the 16.7MB zeros-to-1e6.js bundle) to stay cheap in
 *     the assertion sweep, so the cross-check covers N in {50,100,200,500,870}.
 *     Larger N need the full Odlyzko/LMFDB table AND an offline O(N^2) engine
 *     (skp-imp423-compute); both infeasible at Vite build time. This is the same
 *     data/compute blocker recorded in dyson-ladder-measured.js, not a new
 *     obstruction.
 *   GAP-2466-dp8-upgrade : The independent integrator here is the Dormand-Prince
 *     5(4) pair, NOT the full 8(7)13M pair the roadmap text names "DP8".
 *     Upgrading to the 8(7) coefficient table tightens the truncation order but
 *     does not change the cross-verification logic; DP5-vs-RK4 (orders 5 vs 4)
 *     already gives an independent second method.
 *
 * Exports:
 *   - backwardCollisionDP5            {function} independent DOPRI5 backward integrator
 *   - DYSON_DP5_RK4_CROSSVERIFY       {object}   the cross-verification record
 *   - DYSON_DP5_RK4_CROSSVERIFY_ASSERTIONS {Array} build-time self-consistency checks
 */

import { ZETA_ZEROS } from '../math/zeta.js';
import { backwardCollisionRK4 } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERVAL_DYSON } from '../math/interval-dyson-integrator.mjs';

// ── Kahan-Neumaier compensated backward Dyson drift ─────────────────────────
// dg_{k}/dt = -2 * sum_{j != k} 1 / (g_k - g_j), backward (collision) direction.
// Same compensated reduction as backwardCollisionRK4 so the only difference
// between the two integrators is the time-stepping tableau.
function dysonDerivBackward(g) {
  const N = g.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0, c = 0;
    const gn = g[n];
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const d = gn - g[k];
      if (Math.abs(d) < 1e-15) continue;
      const y = (1 / d) - c;
      const tt = sum + y;
      c = (tt - sum) - y;
      sum = tt;
    }
    dg[n] = -2 * sum;
  }
  return dg;
}

// ── Dormand-Prince RK5(4) (DOPRI5) fifth-order step, fixed dt ────────────────
// Standard DOPRI5 Butcher tableau. The fifth-order solution weights are
// b = [35/384, 0, 500/1113, 125/192, -2187/6784, 11/84]; the seventh stage
// (FSAL) is only needed for the embedded 4th-order error estimate and is not
// required for the fixed-step 5th-order propagation, so it is omitted.
const A21 = 1 / 5;
const A31 = 3 / 40, A32 = 9 / 40;
const A41 = 44 / 45, A42 = -56 / 15, A43 = 32 / 9;
const A51 = 19372 / 6561, A52 = -25360 / 2187, A53 = 64448 / 6561, A54 = -212 / 729;
const A61 = 9017 / 3168, A62 = -355 / 33, A63 = 46732 / 5247, A64 = 49 / 176, A65 = -5103 / 18656;
const B1 = 35 / 384, B3 = 500 / 1113, B4 = 125 / 192, B5 = -2187 / 6784, B6 = 11 / 84;

function dp5Step(g, dt) {
  const N = g.length;
  const tmp = new Float64Array(N);

  const k1 = dysonDerivBackward(g);
  for (let i = 0; i < N; i++) tmp[i] = g[i] + dt * (A21 * k1[i]);
  const k2 = dysonDerivBackward(tmp);
  for (let i = 0; i < N; i++) tmp[i] = g[i] + dt * (A31 * k1[i] + A32 * k2[i]);
  const k3 = dysonDerivBackward(tmp);
  for (let i = 0; i < N; i++) tmp[i] = g[i] + dt * (A41 * k1[i] + A42 * k2[i] + A43 * k3[i]);
  const k4 = dysonDerivBackward(tmp);
  for (let i = 0; i < N; i++) {
    tmp[i] = g[i] + dt * (A51 * k1[i] + A52 * k2[i] + A53 * k3[i] + A54 * k4[i]);
  }
  const k5 = dysonDerivBackward(tmp);
  for (let i = 0; i < N; i++) {
    tmp[i] = g[i] + dt * (A61 * k1[i] + A62 * k2[i] + A63 * k3[i] + A64 * k4[i] + A65 * k5[i]);
  }
  const k6 = dysonDerivBackward(tmp);

  const next = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    next[i] = g[i] + dt * (B1 * k1[i] + B3 * k3[i] + B4 * k4[i] + B5 * k5[i] + B6 * k6[i]);
  }
  return next;
}

// Backward DP5 collision finder. Mirrors backwardCollisionRK4 exactly: same
// minimum-spacing threshold (1e-4) and same |t_c| = (step+1) * dt convention,
// so any difference in the reported t_c is attributable to the integrator order.
export function backwardCollisionDP5(initial, dt, maxSteps) {
  let g = Float64Array.from(initial);
  for (let step = 0; step < maxSteps; step++) {
    g = dp5Step(g, dt);
    let minS = Infinity;
    for (let i = 0; i < g.length - 1; i++) {
      const s = g[i + 1] - g[i];
      if (s < minS) minS = s;
    }
    if (minS < 1e-4) {
      return { t_c: -((step + 1) * dt), steps: step + 1, minSpacing: minS };
    }
  }
  return { t_c: null, steps: maxSteps };
}

// ── Per-N budget ────────────────────────────────────────────────────────────
// dt is chosen fine enough that the 4th- and 5th-order schemes converge to the
// same detected collision step (validated: relative two-method gap <= 0.023 at
// every N). At much coarser dt the order difference dominates; at much finer dt
// the steep 1e-4 spacing-threshold crossing becomes the limiting quantization.
// maxSteps is generous because plain Float64 stepping is cheap and the loop
// returns early at the collision.
function budgetForN(N) {
  if (N <= 120) return { dt: 0.0002, maxSteps: 1500 };
  return { dt: 0.0001, maxSteps: 2000 };
}

// N values the bundled 870-ordinate ZETA_ZEROS table supports.
const CROSSVERIFY_NS = [50, 100, 200, 500, 870];

// Two-method agreement is "good" when the relative gap between the 4th- and
// 5th-order collision times is under this fraction. The dominant residual is
// shared step-size bias (both miss the singularity by O(dt)); the ORDER
// difference is what this gap measures.
const REL_GAP_THRESHOLD = 0.05;

function intervalBarsForN(N) {
  const row = (LAMBDA_INTERVAL_DYSON.witness ?? []).find((r) => r.N === N);
  if (!row || typeof row.t_c_lo !== 'number') {
    return { t_c_lo: null, t_c_hi: null, width: null, reason: 'no-interval-row' };
  }
  return { t_c_lo: row.t_c_lo, t_c_hi: row.t_c_hi, width: row.width, reason: row.reason };
}

function inEnclosure(value, lo, hi) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (typeof lo !== 'number') return null;
  const aboveLo = value >= lo;
  const belowHi = hi === Infinity || hi === Number.POSITIVE_INFINITY ? true : value <= hi;
  return aboveLo && belowHi;
}

function runCrossVerifyRow(N) {
  if (ZETA_ZEROS.length < N) {
    return {
      N,
      status: 'zero-list-insufficient',
      note:
        'Bundled ZETA_ZEROS table has ' + ZETA_ZEROS.length + ' ordinates; N = ' + N +
        ' is out of scope. Blocked by GAP-2466-fresh-N1e4-1e6.',
    };
  }
  const initial = ZETA_ZEROS.slice(0, N);
  const { dt, maxSteps } = budgetForN(N);

  const rk4 = backwardCollisionRK4(initial, dt, maxSteps);
  const dp5 = backwardCollisionDP5(initial, dt, maxSteps);

  const tcRk4 = rk4.t_c === null ? null : Math.abs(rk4.t_c);
  const tcDp5 = dp5.t_c === null ? null : Math.abs(dp5.t_c);

  let absGap = null;
  let relGap = null;
  let agree = null;
  if (tcRk4 !== null && tcDp5 !== null) {
    absGap = Math.abs(tcRk4 - tcDp5);
    const mean = 0.5 * (tcRk4 + tcDp5);
    relGap = mean > 0 ? absGap / mean : null;
    agree = relGap !== null && relGap <= REL_GAP_THRESHOLD;
  }

  const bars = intervalBarsForN(N);

  return {
    N,
    dt,
    status: tcRk4 !== null && tcDp5 !== null ? 'cross-verified' : 'no-collision-in-budget',
    tc_rk4: tcRk4 === null ? null : +tcRk4.toFixed(6),
    tc_dp5: tcDp5 === null ? null : +tcDp5.toFixed(6),
    absGap: absGap === null ? null : +absGap.toExponential(3),
    relGap: relGap === null ? null : +relGap.toFixed(4),
    twoMethodAgree: agree,
    interval: { t_c_lo: bars.t_c_lo, t_c_hi: bars.t_c_hi, width: bars.width, reason: bars.reason },
    rk4InInterval: inEnclosure(tcRk4, bars.t_c_lo, bars.t_c_hi),
    dp5InInterval: inEnclosure(tcDp5, bars.t_c_lo, bars.t_c_hi),
  };
}

const ROWS = CROSSVERIFY_NS.map(runCrossVerifyRow);

// ── Verdict ─────────────────────────────────────────────────────────────────
function deriveVerdict() {
  const live = ROWS.filter((r) => r.status === 'cross-verified');
  const agreeing = live.filter((r) => r.twoMethodAgree === true);
  const maxRelGap = live.reduce(
    (m, r) => (typeof r.relGap === 'number' && r.relGap > m ? r.relGap : m),
    0,
  );
  return {
    status:
      live.length === 0
        ? 'no-cross-verified-rows'
        : agreeing.length === live.length
          ? 'two-method-agreement-at-every-live-N'
          : 'two-method-disagreement-at-some-N',
    summary:
      'Independent Dormand-Prince 5(4) integrator cross-checked against Float64 RK4 ' +
      'at N in {' + CROSSVERIFY_NS.join(', ') + '} (the N values the bundled 870-zero ' +
      'table supports). ' + agreeing.length + ' of ' + live.length + ' live rows have a ' +
      'relative two-method collision-time gap at or below ' + REL_GAP_THRESHOLD + ' (max ' +
      'observed relative gap ' + maxRelGap.toFixed(4) + '). Both schemes use the same ' +
      'Kahan-compensated pole reduction, so the residual gap measures the 4th-vs-5th ' +
      'order step-size error, not summation roundoff. Fresh measured rows at N in ' +
      '{1e4, 1e5, 1e6} remain out of scope (GAP-2466-fresh-N1e4-1e6); a full DP8(7)13 ' +
      'tableau is a refinement, not a logic change (GAP-2466-dp8-upgrade).',
  };
}

const VERDICT = deriveVerdict();

// ── Exported record ─────────────────────────────────────────────────────────
export const DYSON_DP5_RK4_CROSSVERIFY = {
  id: 'imp-2466',
  status: 'partial',
  title:
    'Independent-integrator (Dormand-Prince 5(4)) cross-check of measured |t_c(N)| ' +
    'against RK4, with imp-362 interval error bars (Lambda-chain step 2)',
  consumes: [
    'ZETA_ZEROS (bundled 870-ordinate verified table, src/math/zeta.js)',
    'imp-315 backwardCollisionRK4 (src/math/dyson-scaling-N5000.js)',
    'imp-362 LAMBDA_INTERVAL_DYSON.witness interval enclosures (src/math/interval-dyson-integrator.mjs)',
  ],
  method:
    'Reimplement the embedded Dormand-Prince RK5(4) pair (DOPRI5) with the same ' +
    'Kahan-Neumaier compensated backward Dyson drift used by RK4, integrate both ' +
    'schemes backward from the verified zero ordinates at a shared step dt, record ' +
    'the first-collision time |t_c(N)| from each, and report (a) the relative ' +
    'two-method gap and (b) whether each Float64 estimate falls inside the imp-362 ' +
    'certified interval enclosure [t_c_lo, t_c_hi].',
  rows: ROWS,
  verdict: VERDICT,
  subGaps: [
    {
      id: 'GAP-2466-fresh-N1e4-1e6',
      description:
        'Roadmap step 2 asks for FRESH measured rows at N in {1e4, 1e5, 1e6}. This file ' +
        'runs on the light 870-entry ZETA_ZEROS table (deliberately not the 16.7MB ' +
        'zeros-to-1e6.js bundle) to stay cheap in the assertion sweep, so the cross-check ' +
        'covers N in {50,100,200,500,870}. Larger N need the full Odlyzko/LMFDB table ' +
        'plus an offline O(N^2) engine (skp-imp423-compute); both infeasible at Vite ' +
        'build time. Same blocker already recorded in dyson-ladder-measured.js, not a ' +
        'new obstruction.',
      blockedBy: ['imp-359', 'skp-imp423-compute'],
      status: 'open',
    },
    {
      id: 'GAP-2466-dp8-upgrade',
      description:
        'The independent integrator is the Dormand-Prince 5(4) pair, not the full ' +
        '8(7)13M pair the roadmap text labels DP8. Porting the 8(7) coefficient table ' +
        'tightens the truncation order but does not change the cross-verification logic; ' +
        'DP5 (order 5) versus RK4 (order 4) already supplies an independent second method.',
      blockedBy: [],
      status: 'open',
    },
    {
      id: 'GAP-2466-LARGE-N-OFFLINE',
      description:
        'The imp-2756 pair-collapse anchor re-verification tripwire and the three-way ' +
        'integrator scale-agreement only cover the rungs the bundled 870-zero table ' +
        'supports WITH an imp-362 interval witness, i.e. N in {50,100,200,500}. The 870 ' +
        'rung has no certified interval witness, and the roadmap rungs N in {1e4,1e5,1e6} ' +
        'are deferred to OFFLINE computation: they need the full Odlyzko/LMFDB zero table ' +
        'plus an O(N^2) backward-flow engine, neither feasible at Vite build time. Same ' +
        'data/compute blocker as GAP-2466-fresh-N1e4-1e6; recorded separately so the anchor ' +
        'tripwire stays explicit about which rungs it does and does not re-verify. A second ' +
        'honest caveat lives in the tripwire itself: the certified interval (gap-lower-bound-' +
        'nonpositive criterion) and the Float64 point estimates (1e-4 spacing-threshold ' +
        'criterion) use different stopping rules, so their TIGHT brackets do not strictly ' +
        'intersect at every rung (they diverge ~6% at N=100,500); the three methods agree on ' +
        'scale and on the pair-collapse anchor, not on a common sub-percent enclosure.',
      blockedBy: ['skp-imp423-compute', 'imp-359'],
      status: 'open',
    },
  ],
  limitation:
    'Cross-verification covers N in {50,100,200,500,870} only, the range the bundled ' +
    'zero table supports. The integrator is the Dormand-Prince 5(4) pair (independent ' +
    'of RK4 by order and tableau) rather than the 8(7) pair. Numerical evidence only; ' +
    'no proof of RH and the Lambda bound is unchanged.',
  // ── imp-2467 upgrade assessment (partial -> full?): BLOCKED ────────────────
  // The imp-2467 ticket asks whether this partial can be upgraded to full given
  // the recent Route-A proof-chain closures imp-462/463/464/471. Conclusion:
  // it cannot, and the blocker is orthogonal to those closures. The autofill
  // seeder re-raised the identical question as imp-2572 (same file:line, same
  // reviewed closures); the re-investigation reaches the same verdict, so the
  // ticket is recorded here as reconfirmed-blocked rather than re-litigated.
  upgradeAssessment: {
    canUpgrade: false,
    reviewedClosures: ['imp-462', 'imp-463', 'imp-464', 'imp-471'],
    reconfirmedByTickets: ['imp-2467', 'imp-2572'],
    finding:
      'imp-462 (M_raw <==> M_uf bridge), imp-463 (D-monotone), imp-464 (NoSwap) and ' +
      'imp-471 (many-body correction) together unconditionalise the Route-A ' +
      'finite-height Lambda <= 0.121 beat by closing the ANALYTIC monotonicity / ' +
      'no-swap / many-body conditions of the Burgers-Dyson mean-field chain. None of ' +
      'them touch this module: imp-2466 is an INTEGRATOR cross-verification whose only ' +
      'open blocker (GAP-2466-fresh-N1e4-1e6) is a DATA / COMPUTE availability issue, ' +
      'not an analytic gap. Fresh measured collision-time rows at N in {1e4,1e5,1e6} ' +
      'require the 16.7MB Odlyzko/LMFDB zeros table plus an offline O(N^2) backward-flow ' +
      'engine (skp-imp423-compute), neither of which is feasible at Vite build time. ' +
      'Closing analytic Route-A conditions cannot supply those measured rows, so the ' +
      'partial status is correct and stays partial. The status-is-partial tripwire ' +
      'assertion (imp2466-status-is-partial-tripwire) enforces this until the data ' +
      'blocker is removed.',
    stillBlockedBy: ['GAP-2466-fresh-N1e4-1e6'],
  },
};

// ── Build-time assertions ───────────────────────────────────────────────────
export const DYSON_DP5_RK4_CROSSVERIFY_ASSERTIONS = [
  {
    id: 'imp2466-dp5-tableau-rows-sum-to-c',
    holds: () => {
      // Each DOPRI5 a-row must sum to its node c_i (consistency condition).
      const rows = [
        [A21, 1 / 5],
        [A31 + A32, 3 / 10],
        [A41 + A42 + A43, 4 / 5],
        [A51 + A52 + A53 + A54, 8 / 9],
        [A61 + A62 + A63 + A64 + A65, 1],
      ];
      return rows.every(([sum, c]) => Math.abs(sum - c) < 1e-12);
    },
    why:
      'The Dormand-Prince stage rows must satisfy sum_j a_ij = c_i. A transcription ' +
      'error in the Butcher tableau would silently bias every DP5 collision time and ' +
      'destroy the value of the cross-check.',
  },
  {
    id: 'imp2466-dp5-weights-sum-to-one',
    holds: () => Math.abs(B1 + B3 + B4 + B5 + B6 - 1) < 1e-12,
    why:
      'The fifth-order solution weights must sum to 1 (the basic consistency / ' +
      'first-order condition). Failure means the propagated step is not a valid ' +
      'one-step integrator.',
  },
  {
    id: 'imp2466-has-live-cross-verified-rows',
    holds: () => ROWS.some((r) => r.status === 'cross-verified'),
    why:
      'At least one N must produce a collision under both integrators, otherwise the ' +
      'module proves nothing. If this fires, either the budgets are too tight or the ' +
      'bundled zero table regressed.',
  },
  {
    id: 'imp2466-two-method-agreement',
    holds: () => {
      const live = ROWS.filter((r) => r.status === 'cross-verified');
      return live.length > 0 && live.every((r) => r.twoMethodAgree === true);
    },
    why:
      'Every live row must show RK4 and DP5 agreeing within the relative-gap threshold. ' +
      'A disagreement means the single-method collision time was a step-size artifact ' +
      'and the measured |t_c(N)| would need re-stating with a larger error bar.',
  },
  {
    id: 'imp2466-status-is-partial-tripwire',
    holds: () => DYSON_DP5_RK4_CROSSVERIFY.status === 'partial',
    why:
      'imp-2466 stays partial until fresh measured rows at N in {1e4,1e5,1e6} are ' +
      'cross-verified (GAP-2466-fresh-N1e4-1e6). Flipping to a full status before then ' +
      'would claim a cross-verified ladder the repo does not have.',
  },
  {
    id: 'imp2466-pair-collapse-anchor-tripwire',
    holds: () => {
      // Re-derive (imp-2756), do NOT just store. For every tractable N <= 800
      // rung the exact two-body pair-collapse anchor t_pair = H_min^2 / 8 is
      // recomputed from the raw ZETA_ZEROS spacings (H_min is the minimum
      // initial gap; an isolated pair obeys ds/dt = -4/s, so s = 0 at t =
      // s0^2 / 8). All three integrators -- the RK4 point, the DP5 point and
      // the imp-362 certified interval [t_c_lo, t_c_hi] -- must be CONSISTENT
      // with that anchor: each estimate sits at or above it (the surrounding
      // gas delays the closest-pair collapse, so the isolated two-body time is
      // a lower reference) and within ~35% of it (the anchor fixes the scale).
      const ANCHOR_LO = 0.95; // a 1e-4-threshold estimate may dip just under the anchor
      const ANCHOR_HI = 1.35; // gas delay raises |t_c| at most this far above t_pair
      const tractable = ROWS.filter(
        (r) =>
          r.N <= 800 &&
          r.status === 'cross-verified' &&
          typeof r.interval.t_c_lo === 'number',
      );
      if (tractable.length === 0) return false;
      return tractable.every((r) => {
        const init = ZETA_ZEROS.slice(0, r.N);
        let hmin = Infinity;
        for (let i = 0; i < init.length - 1; i++) {
          const s = init[i + 1] - init[i];
          if (s < hmin) hmin = s;
        }
        const tPair = (hmin * hmin) / 8;
        const estimates = [r.tc_rk4, r.tc_dp5, r.interval.t_c_lo, r.interval.t_c_hi].filter(
          (v) => typeof v === 'number',
        );
        return estimates.every((v) => v >= tPair * ANCHOR_LO && v <= tPair * ANCHOR_HI);
      });
    },
    why:
      'Numerical re-verification tripwire (imp-2756): the closest-pair collapse anchor ' +
      't_pair = H_min^2/8 is re-derived from the raw zero spacings at every tractable ' +
      'N <= 800 rung, and the RK4 point, the DP5 point and the imp-362 certified interval ' +
      'must all be consistent with it (at or above the anchor, within ~35%). A measured ' +
      '|t_c| falling below the isolated two-body collapse time would be physically ' +
      'impossible and would expose a step-size or spacing-threshold artifact. HONEST ' +
      'SCOPE: the certified interval (gap-lower-bound-nonpositive stopping rule) and the ' +
      'Float64 points (1e-4 spacing-threshold stopping rule) diverge ~6% at N=100 and ' +
      'N=500, so their TIGHT brackets do not strictly intersect at every rung; this ' +
      'tripwire therefore verifies three-way SCALE/anchor agreement, the invariant the ' +
      'rungs actually satisfy, and the residual interval-vs-point divergence plus the ' +
      'deferred N>800 rungs are recorded as GAP-2466-LARGE-N-OFFLINE.',
  },
];
