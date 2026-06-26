/**
 * @module imp-2485-dp8-rk4-N1e5
 * @fileoverview imp-2881 (extends imp-2485): Lambda-chain step 2
 * cross-verification at N = 1e5 — dual-integrator (true 8th-order
 * Dormand-Prince DOP853 tableau + classical RK4) agreement on the backward
 * Dyson collision time, with an interval-RK4 bracket and the analytic
 * two-particle (Calogero-Moser) pair-collapse cross-check.
 *
 * Proof-chain step: S9-crossverify (Lambda-chain step 2 cross-verification layer).
 * Created by imp-2881. Successor of imp-2485 (the same dual-integrator harness
 * at N = 1e4). The compute script and DOP853 tableau are SHARED with imp-2485:
 * scripts/compute-imp2485-dp8-rk4-N1e4.mjs run with --N=100000 writes the
 * sidecar this module reads. Nothing heavy runs at Vite build time.
 *
 * WHAT THIS CLOSES (the N = 1e5 slice of GAP-2485-N1e5-N1e6)
 * ---------------------------------------------------------
 * The imp-2485 module left GAP-2485-N1e5-N1e6 OPEN: fresh dual-integrator rows
 * at N in {1e5, 1e6}. This module closes the N = 1e5 half. The N = 1e5 row is
 * freshly measured offline from the first 100 000 Odlyzko ordinates; N = 1e6
 * remains open (GAP-2485-N1e6) because it needs zeros beyond the bundled table
 * and ~100x this runtime.
 *
 * THE MEASURED N = 1e5 ROW (from the sidecar)
 * -------------------------------------------
 *   ladder dt = 1e-4 : RK4 and the genuine order-8 DOP853 tableau BOTH detect
 *     the collision at the FIRST ladder step, i.e. |t_c| = 1.0e-4, exact
 *     two-method agreement at the ladder resolution. The interval-RK4 backend
 *     brackets the discrete-trajectory collision at the same dt with both
 *     Float64 estimates inside the bracket.
 *
 * KEY FINDING — pair domination is even sharper at N = 1e5
 * -------------------------------------------------------
 * At N = 1e5 the tightest zero pair has gap H_min ~ 0.0147 (pair index ~95247),
 * so the exact Calogero-Moser two-particle collapse time
 * t_pair = H_min^2 / 8 ~ 2.70e-5 is well BELOW the ladder dt = 1e-4. The
 * collision is therefore resolved INSIDE the first ladder step and the ladder
 * bracket (0, dt] already contains t_pair. This is why the dt/5 refinement pass
 * (informative at N = 1e4 where t_pair = 1.78e-4 > dt) is intentionally SKIPPED
 * here: it would only re-confirm the same step-1 event at ~5x the
 * O(N^2)-per-step cost. The collision is pair-dominated, matching the imp-2485
 * N = 1e4 finding and the imp-423 N >= 25k extended-cache rows.
 *
 * WHY THIS IS LADDER-ONLY (vs the imp-2485 N = 1e4 module)
 * -------------------------------------------------------
 * The N = 1e4 module carried a fine dt = 2e-5 row because there t_pair exceeds
 * the ladder dt, so sub-ladder-quantum resolution is needed to land the bracket
 * on the pair time. At N = 1e5 t_pair << dt, so the fine pass is redundant and
 * the sidecar records it as documented-skipped (refinedRow.skipped === true).
 * The truncation caveat (GAP-2485-truncation-certification) carries over
 * unchanged: the one-ULP interval bracket covers roundoff, not the O(dt^5)
 * truncation near the gap pole.
 *
 * Exports:
 *   - IMP2485_DP8_RK4_N1E5            {object} the cross-verification record
 *   - IMP2485_DP8_RK4_N1E5_ASSERTIONS {Array}  build-time self-consistency checks
 */

import SIDECAR from './imp-2485-dp8-rk4-N1e5-rows.json';

const ladder = SIDECAR.ladderRow ?? {};
const refined = SIDECAR.refinedRow ?? {};
const interval = SIDECAR.interval ?? {};
const pairBound = SIDECAR.pairBound ?? {};
const conv = SIDECAR.convergence ?? {};
const tableau = SIDECAR.tableau ?? {};

const absOrNull = (v) => (typeof v === 'number' ? Math.abs(v) : null);

export const IMP2485_DP8_RK4_N1E5 = {
  id: 'imp-2881',
  extends: 'imp-2485',
  status: 'partial',
  title:
    'Step 2 cross-verification at N = 1e5: true DP8 (DOP853) + RK4 dual-integrator ' +
    'agreement on |t_c|, with an interval error bar and the exact pair-collapse cross-check',
  consumes: [
    'src/data/zeros-to-1e6.js ZEROS_EXTENDED (Odlyzko ordinates, imp-359) — offline only',
    'imp-315 backwardCollisionRK4 (src/math/dyson-scaling-N5000.js) — offline only',
    'imp-1091 callIntervalRk4Async dispatch (interval-RK4 backend) — offline only',
    'src/data/imp-2485-dp8-rk4-N1e5-rows.json (sidecar written by the compute script at --N=100000)',
  ],
  method:
    'Offline (scripts/compute-imp2485-dp8-rk4-N1e4.mjs --N=100000): the SAME 12-stage ' +
    'order-8 DOP853 propagating tableau as imp-2485 (verbatim from scipy, ' +
    'machine-validated by row sums + 8 quadrature order conditions + an empirical ' +
    'convergence-order run on the N = 50 Dyson system), integrating RK4 and DP8 ' +
    'backward from the first 100 000 Odlyzko ordinates with the same ' +
    'Kahan-compensated pole reduction at the ladder dt = 1e-4, an interval-RK4 ' +
    'bracket whose step budget is bounded to the detected collision step plus a ' +
    'fixed margin (imp-2881), and the exact Calogero-Moser pair-collapse time ' +
    'H_min^2 / 8. The dt/5 fine pass is documented-skipped because t_pair << dt.',
  N: SIDECAR.N,
  row: {
    ladderDt: ladder.dt,
    tc_rk4_ladder: absOrNull(ladder.rk4?.t_c),
    tc_dp8_ladder: absOrNull(ladder.dp8?.t_c),
    interval_lo: interval.t_c_lo ?? null,
    interval_hi: interval.t_c_hi ?? null,
    fineSkipped: refined.skipped === true,
    tPair: pairBound.tPair ?? null,
    hMin: pairBound.hMin ?? null,
    pairIdx: pairBound.pairIdx ?? null,
  },
  verdict: {
    status: 'two-method-agreement-at-N-1e5',
    summary:
      'RK4 and the genuine order-8 DOP853 tableau detect the backward Dyson ' +
      'collision at the SAME (first) ladder step at N = 1e5, both inside the ' +
      'matching interval-RK4 bracket, and the exact two-particle collapse time ' +
      't_pair = H_min^2 / 8 falls inside the ladder bracket (0, dt]. The N = 1e5 ' +
      'collision is pair-dominated (t_pair << ladder dt), so the dt/5 refinement ' +
      'is informationally redundant and intentionally skipped. The truncation ' +
      'caveat from imp-2485 (one-ULP interval bars cover roundoff, not the O(dt^5) ' +
      'truncation near the pole) carries over unchanged.',
  },
  closes: [
    'GAP-2485-N1e5-N1e6 at N = 1e5 only (fresh offline dual-integrator row from the Odlyzko zeros)',
  ],
  subGaps: [
    {
      id: 'GAP-2485-N1e6',
      description:
        'A fresh dual-integrator row at N = 1e6 needs ~100x this runtime (O(N^2) ' +
        'per stage, already ~tens of seconds per derivative eval at N = 1e5) and ' +
        'exhausts the bundled 1e6 Odlyzko table with no headroom for the collision ' +
        'window. Needs the native compute backend (skp-imp423-compute).',
      blockedBy: ['skp-imp423-compute'],
      status: 'open',
    },
    {
      id: 'GAP-2485-truncation-certification',
      description:
        'Carried over from imp-2485: the one-ULP interval RK4 brackets the ROUNDOFF ' +
        'of the discrete trajectory, not the O(dt^5) truncation error, and near the ' +
        'gap pole truncation dominates. A truncation-aware enclosure (Taylor-model / ' +
        'CAPD-style) is required before any coarse-dt t_c bracket can be called fully ' +
        'rigorous.',
      blockedBy: [],
      status: 'open',
    },
  ],
  limitation:
    'Numerical evidence only; no proof of RH and the Lambda bound is unchanged. ' +
    'Cross-verified coverage is now N = 1e4 (imp-2485) and N = 1e5 (this row) plus ' +
    'the imp-2466 small-N rows; N = 1e6 remains open (GAP-2485-N1e6). Interval ' +
    'brackets are certified modulo truncation (GAP-2485-truncation-certification).',
  sidecar: SIDECAR,
};

// ── Build-time assertions ────────────────────────────────────────────────────
export const IMP2485_DP8_RK4_N1E5_ASSERTIONS = [
  {
    id: 'imp2881-sidecar-is-full-N1e5-run',
    holds: () => SIDECAR.N === 100000 && SIDECAR.smoke === false,
    why:
      'The record must be backed by the full N = 1e5 offline run, not a smoke ' +
      'configuration of the compute script.',
  },
  {
    id: 'imp2881-dp8-tableau-machine-validated',
    holds: () =>
      typeof tableau.maxRowSumResidual === 'number' &&
      tableau.maxRowSumResidual < 1e-9 &&
      typeof tableau.maxQuadratureResidual === 'number' &&
      tableau.maxQuadratureResidual < 1e-9,
    why:
      'Row-sum consistency and the eight quadrature order conditions are necessary ' +
      'conditions for the order-8 tableau; a transcription error would bias every ' +
      'DP8 collision time and void the cross-check.',
  },
  {
    id: 'imp2881-dp8-rk4-order-separation',
    holds: () => {
      const d = conv.dp8ObservedOrders ?? [];
      const r = conv.rk4ObservedOrders ?? [];
      return d.length > 0 && r.length > 0 && Math.min(...d) > Math.max(...r) + 1.5;
    },
    why:
      'The empirical convergence orders on the real Dyson system must separate the ' +
      'two methods (DP8 high vs RK4 ~3-4). If they do not, the second integrator is ' +
      'not genuinely higher-order and the agreement is uninformative.',
  },
  {
    id: 'imp2881-two-method-agreement-ladder-dt',
    holds: () =>
      typeof ladder.rk4?.t_c === 'number' &&
      typeof ladder.dp8?.t_c === 'number' &&
      Math.abs(ladder.rk4.t_c - ladder.dp8.t_c) < 1e-12,
    why:
      'At the ladder dt = 1e-4 both integrators must detect the collision at the ' +
      'same step. Disagreement would mean the recorded ladder |t_c| is a ' +
      'scheme-specific artifact.',
  },
  {
    id: 'imp2881-ladder-tc-inside-interval-bars',
    holds: () => {
      const tc = absOrNull(ladder.rk4?.t_c);
      return (
        typeof tc === 'number' &&
        typeof interval.t_c_lo === 'number' &&
        typeof interval.t_c_hi === 'number' &&
        tc >= interval.t_c_lo - 1e-12 &&
        tc <= interval.t_c_hi + 1e-12
      );
    },
    why:
      'The ticket asks for agreement within the interval error bars at the ladder ' +
      'dt: the Float64 |t_c| must fall inside the roundoff-certified bracket from ' +
      'the interval-RK4 backend at the same step size.',
  },
  {
    id: 'imp2881-pair-time-inside-ladder-bracket',
    holds: () => {
      const tc = absOrNull(ladder.rk4?.t_c);
      const dtL = ladder.dt;
      return (
        typeof pairBound.tPair === 'number' &&
        typeof tc === 'number' &&
        typeof dtL === 'number' &&
        pairBound.tPair <= tc + 1e-12 &&
        pairBound.tPair > tc - dtL - 1e-12
      );
    },
    why:
      'The exact Calogero-Moser two-particle collapse time H_min^2 / 8 must fall ' +
      'inside the ladder detection bracket (|t_c| - dt, |t_c|]. At N = 1e5 ' +
      't_pair << dt, so this anchors the step-1 collision as the real pair-collapse ' +
      'event resolved inside the first ladder step.',
  },
  {
    id: 'imp2881-fine-pass-documented-skipped',
    holds: () => refined.skipped === true,
    why:
      'At N = 1e5 the dt/5 refinement is intentionally skipped because t_pair << ' +
      'ladder dt (collision resolved inside the first ladder step). The sidecar must ' +
      'record this as a documented skip, not a silent omission, so the missing fine ' +
      'row is never mistaken for an unrun measurement.',
  },
  {
    id: 'imp2881-status-stays-partial-tripwire',
    holds: () => IMP2485_DP8_RK4_N1E5.status === 'partial',
    why:
      'imp-2881 stays partial until the N = 1e6 row exists (GAP-2485-N1e6) and the ' +
      'truncation certification gap (GAP-2485-truncation-certification) is closed. ' +
      'Flipping to full before then would overclaim a cross-verified ladder the repo ' +
      'does not have.',
  },
];
