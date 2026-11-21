/**
 * @module imp-36077-tc-rk4-dp5-gap-dt-n-scaling
 * @fileoverview MEASUREMENT (not a certificate): how the empirical RK4-vs-DP5
 * first-collision-time disagreement |t_c_RK4 - t_c_DP5| scales with the fixed
 * step dt and the ordinate count N across the imp-321 ladder.
 *
 * Proof-chain step: S-frontier (Lambda-chain step 2, rigorousUpgradeGap
 * obligation G-step-error). Created by imp-36077.
 *
 * WHY THIS EXISTS
 * ---------------
 * lambda-roadmap.js Step-2 rigorousUpgradeGap item G-step-error records the
 * central caveat of the imp-2466 cross-check: the DP5-vs-RK4 collision-time
 * agreement bounds only the scheme DISAGREEMENT, so any error the two
 * integrators share (a common systematic) is invisible to their difference. A
 * fourth-order and a fifth-order scheme that both miss the singularity in the
 * same direction, or that both inherit the same 1e-4 spacing-threshold stopping
 * bias, cancel that common part when you subtract them. imp-2466 measured the
 * gap at a SINGLE dt per N; it never mapped how the gap moves as you refine dt.
 * That dt-dependence is exactly what would reveal (or fail to reveal) a shared
 * truncation error: a genuine order-limited disagreement decays like a clean
 * power of dt, whereas a quantization- or threshold-limited artifact does not.
 *
 * WHAT THIS DELIVERS (honest measurement)
 * ---------------------------------------
 * For each N in the bundled-table slice of the imp-321 ladder and each dt in a
 * geometric ladder, it runs the imported (unchanged) RK4 and the imp-2466 DP5
 * backward Dyson integrators at the SAME dt from the SAME verified zero
 * ordinates, records both first-collision times |t_c|, and reports the absolute
 * and relative two-method gaps and the difference in detected step counts. It
 * then characterizes, per N, whether the gap decays cleanly as dt -> 0.
 *
 * WHAT THE MEASUREMENT SHOWS
 * --------------------------
 * The disagreement is QUANTIZATION-DOMINATED and NON-MONOTONE in dt, NOT a
 * clean truncation-order power law. Because both finders stop at the first step
 * whose minimum spacing drops below 1e-4 and report t_c as an integer multiple
 * of dt, the gap sits at exactly zero whenever both schemes cross the threshold
 * on the same step (which happens at several rungs), and spikes to O(10-21%)
 * relative at isolated (N, dt) rungs where the near-singular drift amplifies a
 * one-or-more-step detection difference (measured: N=200 at dt=5e-5, N=500 at
 * the coarse rungs). Refining dt does NOT drive the gap monotonically to zero.
 *
 * WHAT THIS BOUNDS (and does NOT certify)
 * ---------------------------------------
 * The finest resolvable disagreement is floored by the dt-quantization of the
 * threshold crossing, ~ dt / t_c(N) in relative terms. Any shared systematic
 * smaller than that floor is invisible to the cross-check AT THAT dt, and --
 * this is the honest headline -- shrinking dt does not shrink the blind spot
 * monotonically, so the cross-check cannot be sharpened into a bound on the
 * common-mode error simply by refining the step. The visible disagreement is a
 * poor proxy for the true integration error near the collision front. This is a
 * MEASUREMENT/ASSESSMENT of the blind-spot size, explicitly NOT a certified
 * a-priori step-error bound. No inequality is discharged; NO QED; no refereed bound is changed.
 *
 * NAMED SUB-GAP
 * -------------
 *   GAP-36077-common-mode-uncertified : Bounding the SHARED (common-mode)
 *     truncation error itself still requires an a-priori interval / defect
 *     control on the backward Dyson flow near the pole (imp-362 direction), not
 *     a scheme difference. This file measures how large the scheme difference
 *     is and how it (fails to) shrink with dt; it does not and cannot upgrade
 *     that into a certificate on the common part. Same range limit as
 *     GAP-2466-fresh-N1e4-1e6: the bundled 870-ordinate table caps N; fresh
 *     rows at N in {1e4,1e5,1e6} need the full Odlyzko/LMFDB table plus an
 *     offline O(N^2) engine, infeasible at Vite build time.
 *
 * Exports:
 *   - TC_RK4_DP5_GAP_DT_N_SCALING            {object} the measurement record
 *   - TC_RK4_DP5_GAP_DT_N_SCALING_ASSERTIONS {Array}  build-time self-checks
 */

import { ZETA_ZEROS } from '../math/zeta.js';
import { backwardCollisionRK4 } from '../math/dyson-scaling-N5000.js';
import { backwardCollisionDP5 } from './imp-2466-dyson-tc-interval-ladder.js';

// N slice of the imp-321 ladder the bundled 870-ordinate ZETA_ZEROS supports.
const LADDER_NS = [50, 100, 200, 500];

// Geometric step-size ladder. Fine enough that both schemes resolve the
// collision, coarse enough to keep the build-time sweep cheap.
const DT_LADDER = [4e-4, 2e-4, 1e-4, 5e-5];

// maxSteps is generous: the largest measured |t_c| is ~0.1, so 0.4/dt always
// clears the collision and the finders return early. Never actually reached.
function maxStepsForDt(dt) {
  return Math.ceil(0.4 / dt) + 50;
}

function gapRow(initial, N, dt) {
  const maxSteps = maxStepsForDt(dt);
  const rk4 = backwardCollisionRK4(initial, dt, maxSteps);
  const dp5 = backwardCollisionDP5(initial, dt, maxSteps);

  const tcRk4 = rk4.t_c === null ? null : Math.abs(rk4.t_c);
  const tcDp5 = dp5.t_c === null ? null : Math.abs(dp5.t_c);

  let absGap = null;
  let relGap = null;
  if (tcRk4 !== null && tcDp5 !== null) {
    absGap = Math.abs(tcRk4 - tcDp5);
    const mean = 0.5 * (tcRk4 + tcDp5);
    relGap = mean > 0 ? absGap / mean : null;
  }

  const stepDiff =
    rk4.t_c !== null && dp5.t_c !== null ? (rk4.steps ?? 0) - (dp5.steps ?? 0) : null;

  return {
    N,
    dt,
    steps_rk4: rk4.steps ?? null,
    steps_dp5: dp5.steps ?? null,
    stepDiff,
    tc_rk4: tcRk4 === null ? null : +tcRk4.toFixed(6),
    tc_dp5: tcDp5 === null ? null : +tcDp5.toFixed(6),
    absGap: absGap === null ? null : +absGap.toExponential(3),
    relGap: relGap === null ? null : +relGap.toExponential(3),
    // dt-quantization floor on the relative gap this rung can resolve: one step
    // of dt over the collision time. A shared error below this is invisible here.
    relResolutionFloor:
      tcRk4 !== null && tcRk4 > 0 ? +(dt / tcRk4).toExponential(3) : null,
  };
}

function perNSummary(N, rows) {
  const live = rows.filter((r) => r.relGap !== null);
  const rels = live.map((r) => r.relGap);
  const maxRel = rels.length ? Math.max(...rels) : null;
  const minRel = rels.length ? Math.min(...rels) : null;

  // "Clean decay" would mean relGap decreases every time dt halves. Test it on
  // the ladder as ordered coarse -> fine (DT_LADDER is descending).
  let monotoneDecreasing = live.length >= 2;
  for (let i = 1; i < live.length; i++) {
    if (live[i].relGap > live[i - 1].relGap + 1e-12) {
      monotoneDecreasing = false;
      break;
    }
  }

  const finest = live.length ? live[live.length - 1] : null;

  return {
    N,
    liveRows: live.length,
    maxRelGap: maxRel === null ? null : +maxRel.toExponential(3),
    minRelGap: minRel === null ? null : +minRel.toExponential(3),
    // Does the disagreement shrink cleanly as dt -> 0? Measured answer: no.
    cleanDtDecay: monotoneDecreasing,
    finestDt: finest ? finest.dt : null,
    finestRelGap: finest ? finest.relGap : null,
    finestRelResolutionFloor: finest ? finest.relResolutionFloor : null,
  };
}

const ROWS = [];
const SUMMARIES = [];
for (const N of LADDER_NS) {
  if (ZETA_ZEROS.length < N) {
    SUMMARIES.push({ N, liveRows: 0, status: 'zero-list-insufficient' });
    continue;
  }
  const initial = ZETA_ZEROS.slice(0, N);
  const nRows = DT_LADDER.map((dt) => gapRow(initial, N, dt));
  ROWS.push(...nRows);
  SUMMARIES.push(perNSummary(N, nRows));
}

function deriveVerdict() {
  const live = ROWS.filter((r) => r.relGap !== null);
  const maxRel = live.reduce((m, r) => (r.relGap > m ? r.relGap : m), 0);
  const anyCleanDecay = SUMMARIES.some((s) => s.cleanDtDecay === true);
  const anyZeroGap = live.some((r) => r.absGap === 0);
  const spikes = live.filter((r) => r.relGap >= 0.05).length;
  return {
    status: 'quantization-dominated-non-monotone-gap',
    cleanTruncationOrderDecay: anyCleanDecay,
    maxRelGap: +maxRel.toExponential(3),
    exactTieRungs: anyZeroGap,
    spikeRungsAtOrAbove5pct: spikes,
    summary:
      'RK4-vs-DP5 first-collision-time disagreement |t_c_RK4 - t_c_DP5| measured across N in {' +
      LADDER_NS.join(', ') + '} and dt in {' + DT_LADDER.join(', ') + '}. The gap is ' +
      'QUANTIZATION-DOMINATED and NON-MONOTONE in dt: it is exactly zero at rungs where both ' +
      'schemes cross the 1e-4 spacing threshold on the same step, and spikes to a max relative ' +
      maxRel.toExponential(3) + ' at isolated (N, dt) rungs where the near-singular drift ' +
      'amplifies a step-detection difference (' + spikes + ' rung(s) at or above 5%). No N shows ' +
      'a clean truncation-order power-law decay of the gap as dt halves, so the cross-check ' +
      'CANNOT be sharpened into a common-mode error bound by refining dt. The visible ' +
      'disagreement is floored by the dt-quantization of the threshold crossing (~dt/t_c) and is ' +
      'a poor proxy for the true integration error near the front. Measurement only; the shared ' +
      'systematic remains uncertified (GAP-36077-common-mode-uncertified); NO QED; ' +
      'no refereed bound is changed.',
  };
}

const VERDICT = deriveVerdict();

export const TC_RK4_DP5_GAP_DT_N_SCALING = {
  id: 'imp-36077',
  status: 'measurement',
  title:
    'dt- and N-scaling of the empirical RK4-vs-DP5 first-collision-time disagreement ' +
    '|t_c_RK4 - t_c_DP5| across the imp-321 ladder (bounds, does NOT certify, the ' +
    'Step-2 G-step-error shared-systematic blind spot)',
  consumes: [
    'ZETA_ZEROS (bundled 870-ordinate verified table, src/math/zeta.js)',
    'imp-315 backwardCollisionRK4 (src/math/dyson-scaling-N5000.js)',
    'imp-2466 backwardCollisionDP5 (src/data/imp-2466-dyson-tc-interval-ladder.js)',
  ],
  method:
    'Run RK4 (order 4) and DP5 (order 5) backward Dyson collision finders at a shared ' +
    'step dt from the same verified zero ordinates, over a geometric dt ladder at each ' +
    'N, and record the absolute/relative two-method collision-time gap plus the ' +
    'difference in detected step counts. Characterize per-N whether the gap decays ' +
    'cleanly as dt -> 0.',
  ladderNs: LADDER_NS,
  dtLadder: DT_LADDER,
  rows: ROWS,
  perN: SUMMARIES,
  verdict: VERDICT,
  subGaps: [
    {
      id: 'GAP-36077-common-mode-uncertified',
      description:
        'Bounding the SHARED (common-mode) truncation error itself needs an a-priori ' +
        'interval / defect control on the backward Dyson flow near the pole (imp-362 ' +
        'direction), not a scheme difference. This file measures how large the scheme ' +
        'difference is and how it fails to shrink monotonically with dt; it does not and ' +
        'cannot upgrade that into a certificate on the common part. Range is capped by the ' +
        'bundled 870-ordinate table (same blocker as GAP-2466-fresh-N1e4-1e6): fresh rows at ' +
        'N in {1e4,1e5,1e6} need the full Odlyzko/LMFDB table plus an offline O(N^2) engine.',
      blockedBy: ['imp-362', 'skp-imp423-compute', 'imp-359'],
      status: 'open',
    },
  ],
  limitation:
    'Measurement over N in {50,100,200,500} and dt in {4e-4,2e-4,1e-4,5e-5}, the range ' +
    'the bundled zero table supports cheaply. Numerical evidence only; certifies no bound, ' +
    'discharges no obligation, and the shared-systematic blind spot the Step-2 ' +
    'rigorousUpgradeGap G-step-error flags is characterized, not closed. NO QED.',
};

// ── Build-time self-checks (structural + loose numeric, reproducible) ────────
export const TC_RK4_DP5_GAP_DT_N_SCALING_ASSERTIONS = [
  {
    name: 'every-ladder-N-has-full-dt-sweep',
    pass:
      ROWS.length === LADDER_NS.length * DT_LADDER.length &&
      LADDER_NS.every((N) => ROWS.filter((r) => r.N === N).length === DT_LADDER.length),
    detail: 'each ladder N carries one gap row per dt in the ladder',
  },
  {
    name: 'both-schemes-collide-at-every-rung',
    pass: ROWS.every((r) => r.tc_rk4 !== null && r.tc_dp5 !== null && r.relGap !== null),
    detail: 'RK4 and DP5 both detect a collision inside the step budget at every (N, dt)',
  },
  {
    name: 'abs-gap-equals-tc-difference',
    pass: ROWS.every((r) => Math.abs(Math.abs(r.tc_rk4 - r.tc_dp5) - r.absGap) < 1e-6),
    detail: 'reported absGap reconstructs from the two rounded collision times within 1e-6',
  },
  {
    name: 'relative-gaps-in-unit-interval',
    pass: ROWS.every((r) => r.relGap >= 0 && r.relGap <= 1),
    detail: 'every relative two-method gap lies in [0, 1]',
  },
  {
    name: 'gap-is-non-monotone-in-dt',
    pass: VERDICT.cleanTruncationOrderDecay === false,
    detail:
      'no N shows a clean monotone truncation-order decay of the gap as dt halves; the ' +
      'measured gap is quantization-dominated (this is the honest headline, not a defect)',
  },
  {
    name: 'exact-tie-rungs-exist',
    pass: VERDICT.exactTieRungs === true,
    detail:
      'at least one (N, dt) rung has an exactly-zero gap (both schemes cross the 1e-4 ' +
      'spacing threshold on the same step), confirming quantization-limited resolution',
  },
];

for (const a of TC_RK4_DP5_GAP_DT_N_SCALING_ASSERTIONS) {
  if (!a.pass) {
    throw new Error('imp-36077 assertion failed: ' + a.name + ' -- ' + a.detail);
  }
}
