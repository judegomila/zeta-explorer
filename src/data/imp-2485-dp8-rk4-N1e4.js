/**
 * @module imp-2485-dp8-rk4-N1e4
 * @fileoverview imp-2485: Lambda-chain step 2 cross-verification at N = 1e4 —
 * dual-integrator (true 8th-order Dormand-Prince DOP853 tableau + classical
 * RK4) agreement on the backward Dyson collision time, with interval-RK4
 * error bars and an analytic two-particle cross-check.
 *
 * Proof-chain step: S9-crossverify (Lambda-chain step 2 cross-verification layer).
 * Created by imp-2485. Successor of imp-2466 (DP5-vs-RK4 at N <= 870).
 *
 * WHAT THIS CLOSES (vs the imp-2466 named sub-gaps)
 * -------------------------------------------------
 *   GAP-2466-dp8-upgrade    : CLOSED. The second integrator is now the genuine
 *     12-stage order-8 Dormand-Prince propagating tableau (DOP853, transcribed
 *     verbatim from scipy v1.13.0 dop853_coefficients.py), machine-validated by
 *     row-sum + quadrature order conditions (residuals < 1e-14) AND an
 *     empirical convergence-order measurement on the real Dyson system
 *     (observed orders ~6.6-7.3 vs ~3.2-3.6 for RK4 on the same grid).
 *   GAP-2466-fresh-N1e4-1e6 : CLOSED AT N = 1e4 ONLY. The N = 1e4 row below is
 *     freshly measured offline from the first 10 000 Odlyzko ordinates
 *     (scripts/compute-imp2485-dp8-rk4-N1e4.mjs writes the JSON sidecar this
 *     module reads; nothing heavy runs at Vite build time). N in {1e5, 1e6}
 *     remain open — see GAP-2485-N1e5-N1e6.
 *
 * THE MEASURED N = 1e4 ROW (from the sidecar)
 * -------------------------------------------
 *   ladder dt = 1e-4 : RK4 and DP8 BOTH detect the collision at step 3, i.e.
 *     |t_c| = 3.0e-4, exact two-method agreement at the ladder resolution.
 *     The Rust interval-RK4 backend brackets the discrete-trajectory collision
 *     in [2.0e-4, 3.0e-4] at the same dt — both Float64 estimates sit inside.
 *   fine dt = 2e-5   : RK4 and DP8 BOTH detect at step 9, |t_c| = 1.8e-4,
 *     again exact agreement; the analytic pair-collapse time
 *     t_pair = H_min^2 / 8 = 1.77647e-4 (tightest gap H_min = 0.0376985 at
 *     pair index 6708) falls INSIDE the fine detection bracket (1.6e-4, 1.8e-4].
 *
 * KEY FINDING — pair domination at N = 1e4
 * ----------------------------------------
 * The measured |t_c(1e4)| ~ 1.78e-4 is ~40x SMALLER than the OLS projection
 * 0.00709 (= 0.0066 + 4.91/N) that the small-N ladder extrapolates. The
 * collision at N = 1e4 is driven by the single tightest zero pair, not the
 * global funnel — three independent witnesses agree (RK4, DOP853, and the
 * exact Calogero-Moser two-particle collapse law). This confirms at N = 1e4
 * the pair-dominated regime imp-423 recorded for N >= 25k (extended-cache
 * t_c_hi = 2e-4 at N = 25k, monotone-consistent with this row).
 *
 * SECOND KEY FINDING — one-ULP interval bars do NOT cover truncation
 * ------------------------------------------------------------------
 * At the ladder dt the roundoff-certified bracket [2.0e-4, 3.0e-4] lies
 * strictly ABOVE the analytic pair time 1.77647e-4. No contradiction: the
 * one-ULP-inflation interval RK4 encloses FLOATING-POINT error of the
 * discrete RK4 trajectory, not the O(dt^5) TRUNCATION error, and near the
 * gap pole the truncation term dominates (the step overshoots the collision).
 * Refining dt by 5x moves the bracket onto the pair time, which is the
 * truncation signature. Consequence: existing "interval-certified" t_c rows
 * at coarse dt are certified-modulo-truncation only. Named sub-gap
 * GAP-2485-truncation-certification.
 *
 * Exports:
 *   - IMP2485_DP8_RK4_N1E4            {object} the cross-verification record
 *   - IMP2485_DP8_RK4_N1E4_ASSERTIONS {Array}  build-time self-consistency checks
 */

import SIDECAR from './imp-2485-dp8-rk4-N1e4-rows.json';

const ladder = SIDECAR.ladderRow ?? {};
const refined = SIDECAR.refinedRow ?? {};
const interval = SIDECAR.interval ?? {};
const intervalFine = SIDECAR.intervalFine ?? {};
const pairBound = SIDECAR.pairBound ?? {};
const conv = SIDECAR.convergence ?? {};
const tableau = SIDECAR.tableau ?? {};

const absOrNull = (v) => (typeof v === 'number' ? Math.abs(v) : null);

export const IMP2485_DP8_RK4_N1E4 = {
  id: 'imp-2485',
  status: 'partial',
  title:
    'Step 2 cross-verification at N = 1e4: true DP8 (DOP853) + RK4 dual-integrator ' +
    'agreement on |t_c|, with interval error bars and the exact pair-collapse cross-check',
  consumes: [
    'src/data/zeros-to-1e6.js ZEROS_EXTENDED (Odlyzko ordinates, imp-359) — offline only',
    'imp-315 backwardCollisionRK4 (src/math/dyson-scaling-N5000.js) — offline only',
    'imp-1091 callIntervalRk4Async dispatch (Rust interval-RK4 CLI) — offline only',
    'src/data/imp-2485-dp8-rk4-N1e4-rows.json (sidecar written by the compute script)',
  ],
  method:
    'Offline (scripts/compute-imp2485-dp8-rk4-N1e4.mjs): transcribe the 12-stage ' +
    'order-8 DOP853 propagating tableau verbatim from scipy, machine-validate it ' +
    '(row sums, 8 quadrature order conditions, and an empirical convergence-order ' +
    'run on the N = 50 Dyson system showing DP8 orders ~6.6-7.3 vs RK4 ~3.2-3.6), ' +
    'then integrate RK4 and DP8 backward from the first 10 000 Odlyzko ordinates ' +
    'with the same Kahan-compensated pole reduction at the ladder dt = 1e-4 and at ' +
    'dt = 2e-5, bracket the collision with the Rust interval-RK4 at both step sizes, ' +
    'and cross-check against the exact Calogero-Moser pair-collapse time H_min^2 / 8.',
  N: SIDECAR.N,
  row: {
    ladderDt: ladder.dt,
    tc_rk4_ladder: absOrNull(ladder.rk4?.t_c),
    tc_dp8_ladder: absOrNull(ladder.dp8?.t_c),
    interval_lo: interval.t_c_lo ?? null,
    interval_hi: interval.t_c_hi ?? null,
    fineDt: refined.dt,
    tc_rk4_fine: absOrNull(refined.rk4?.t_c),
    tc_dp8_fine: absOrNull(refined.dp8?.t_c),
    intervalFine_lo: intervalFine.t_c_lo ?? null,
    intervalFine_hi: intervalFine.t_c_hi ?? null,
    tPair: pairBound.tPair ?? null,
    hMin: pairBound.hMin ?? null,
    pairIdx: pairBound.pairIdx ?? null,
  },
  verdict: {
    status: 'two-method-agreement-at-N-1e4',
    summary:
      'RK4 and the genuine order-8 DOP853 tableau detect the backward Dyson ' +
      'collision at the SAME step at both tested resolutions (|t_c| = 3.0e-4 at ' +
      'dt = 1e-4; |t_c| = 1.8e-4 at dt = 2e-5), both inside the matching ' +
      'interval-RK4 brackets, and the fine bracket contains the exact ' +
      'two-particle collapse time t_pair = H_min^2 / 8 = 1.77647e-4. The N = 1e4 ' +
      'collision is pair-dominated: ~40x faster than the small-N OLS projection ' +
      '0.00709. The dt = 1e-4 interval bracket [2.0e-4, 3.0e-4] sits above ' +
      't_pair, demonstrating that one-ULP interval bars cover roundoff but NOT ' +
      'truncation near the pole — recorded as a standing caveat for every ' +
      'coarse-dt interval row in the ladder.',
  },
  closes: [
    'GAP-2466-dp8-upgrade (true order-8 DP tableau, machine- and empirically validated)',
    'GAP-2466-fresh-N1e4-1e6 at N = 1e4 only (fresh offline measured row from Odlyzko zeros)',
  ],
  subGaps: [
    {
      id: 'GAP-2485-N1e5-N1e6',
      description:
        'Fresh dual-integrator rows at N in {1e5, 1e6}. Same offline harness, but ' +
        'O(N^2) per stage means ~100x (N = 1e5) and ~10000x (N = 1e6) this runtime ' +
        'in plain JS; N = 1e6 also exhausts the bundled zero table. Needs the ' +
        'native backend route (skp-imp423-compute / rust interval-rk4 extension).',
      blockedBy: ['skp-imp423-compute'],
      status: 'open',
    },
    {
      id: 'GAP-2485-truncation-certification',
      description:
        'The one-ULP interval RK4 brackets the ROUNDOFF of the discrete trajectory, ' +
        'not the O(dt^5) truncation error, and near the gap pole truncation dominates: ' +
        'at dt = 1e-4 the bracket [2.0e-4, 3.0e-4] excludes the exact pair time ' +
        '1.77647e-4 that the dt = 2e-5 bracket contains. A truncation-aware enclosure ' +
        '(Taylor-model / CAPD-style, or a certified a-priori step bound near the pole) ' +
        'is required before any coarse-dt t_c bracket can be called fully rigorous. ' +
        'This caveat applies retroactively to coarse-dt interval rows in ' +
        'dyson-ladder-measured.js and the extended cache.',
      blockedBy: [],
      status: 'open',
    },
  ],
  limitation:
    'Numerical evidence only; no proof of RH and the Lambda bound is unchanged. ' +
    'Cross-verified coverage is N = 1e4 (this row) plus the imp-2466 small-N rows; ' +
    'N in {1e5, 1e6} remain open. Interval brackets are certified modulo truncation ' +
    '(GAP-2485-truncation-certification).',
  sidecar: SIDECAR,
};

// ── Build-time assertions ────────────────────────────────────────────────────
export const IMP2485_DP8_RK4_N1E4_ASSERTIONS = [
  {
    id: 'imp2485-sidecar-is-full-N1e4-run',
    holds: () => SIDECAR.N === 10000 && SIDECAR.smoke === false,
    why:
      'The record must be backed by the full N = 1e4 offline run, not the N = 500 ' +
      'smoke configuration of the compute script.',
  },
  {
    id: 'imp2485-dp8-tableau-machine-validated',
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
    id: 'imp2485-dp8-rk4-order-separation',
    holds: () => {
      const d = conv.dp8ObservedOrders ?? [];
      const r = conv.rk4ObservedOrders ?? [];
      return (
        d.length > 0 &&
        r.length > 0 &&
        Math.min(...d) > Math.max(...r) + 1.5
      );
    },
    why:
      'The empirical convergence orders on the real Dyson system must separate the ' +
      'two methods (DP8 ~6.6-7.3 vs RK4 ~3.2-3.6). If they do not, the second ' +
      'integrator is not genuinely higher-order and the agreement is uninformative.',
  },
  {
    id: 'imp2485-two-method-agreement-ladder-dt',
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
    id: 'imp2485-two-method-agreement-fine-dt',
    holds: () =>
      typeof refined.rk4?.t_c === 'number' &&
      typeof refined.dp8?.t_c === 'number' &&
      Math.abs(refined.rk4.t_c - refined.dp8.t_c) < 1e-12,
    why:
      'The agreement must survive a 5x step refinement; if the two methods drifted ' +
      'apart at finer dt the coarse agreement would be quantization coincidence.',
  },
  {
    id: 'imp2485-ladder-tc-inside-interval-bars',
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
    id: 'imp2485-fine-tc-inside-fine-interval-bars',
    holds: () => {
      const tc = absOrNull(refined.rk4?.t_c);
      return (
        typeof tc === 'number' &&
        typeof intervalFine.t_c_lo === 'number' &&
        typeof intervalFine.t_c_hi === 'number' &&
        tc >= intervalFine.t_c_lo - 1e-12 &&
        tc <= intervalFine.t_c_hi + 1e-12
      );
    },
    why:
      'Same enclosure requirement at the refined step size, where the bracket is ' +
      '5x tighter and truncation is correspondingly smaller.',
  },
  {
    id: 'imp2485-pair-time-inside-fine-bracket',
    holds: () => {
      const tc = absOrNull(refined.rk4?.t_c);
      const dtF = refined.dt;
      return (
        typeof pairBound.tPair === 'number' &&
        typeof tc === 'number' &&
        typeof dtF === 'number' &&
        pairBound.tPair <= tc + 1e-12 &&
        pairBound.tPair > tc - dtF - 1e-12
      );
    },
    why:
      'The exact Calogero-Moser two-particle collapse time H_min^2 / 8 must fall ' +
      'inside the fine detection bracket (|t_c| - dt, |t_c|]. This is the analytic ' +
      'anchor showing the measured collision is the real pair-collapse event, not ' +
      'an integrator artifact.',
  },
  {
    id: 'imp2485-status-stays-partial-tripwire',
    holds: () => IMP2485_DP8_RK4_N1E4.status === 'partial',
    why:
      'imp-2485 stays partial until N in {1e5, 1e6} rows exist and the truncation ' +
      'certification gap is closed. Flipping to full before then would overclaim ' +
      'a cross-verified ladder the repo does not have. imp-2573 investigated ' +
      'whether the recent proof-chain closures imp-462/463/464/471 permit the ' +
      'upgrade: they do NOT. Those closures establish the Route-A RAW monotonicity ' +
      'chain (conditions M, D-monotone, NoSwap on the finite-height L_pt beat) — an ' +
      'unrelated object. Both open sub-gaps here are numerical/infrastructure, not ' +
      'proof-chain: GAP-2485-N1e5-N1e6 needs the native compute backend ' +
      '(skp-imp423-compute) to produce fresh high-N dual-integrator rows, and ' +
      'GAP-2485-truncation-certification needs a Taylor-model/CAPD truncation-aware ' +
      'interval enclosure. Neither is touched by the monotonicity proofs, so the ' +
      'partial status is correct and the tripwire stands.',
  },
];
