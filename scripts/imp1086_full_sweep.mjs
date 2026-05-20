// imp-1086 final sweep: RK4 (imp-933 closed rows) + DP45 at MATCHED dt + REFINED dt.
// Tracks collision pair (kStar) for both integrators as a consistency check.
import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import rawRows from '../src/data/imp-911-per-plateau-gronwall-certs-rows.json' with { type: 'json' };
import fs from 'node:fs';

function dysonDerivativesKahan(gammas, direction) {
  const N = gammas.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0, c = 0;
    const gn = gammas[n];
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = gn - gammas[k];
      const term = 1 / diff;
      const t = sum + term;
      c += Math.abs(sum) >= Math.abs(term) ? (sum - t) + term : (term - t) + sum;
      sum = t;
    }
    dg[n] = direction * 2 * (sum + c);
  }
  return dg;
}

const DP45_A = [
  [], [1 / 5], [3 / 40, 9 / 40],
  [44 / 45, -56 / 15, 32 / 9],
  [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
  [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
];
const DP45_B5 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84];

function dp45Step(gammas, dt, direction) {
  const N = gammas.length;
  const k1 = dysonDerivativesKahan(gammas, direction);
  const y2 = new Float64Array(N);
  for (let i = 0; i < N; i++) y2[i] = gammas[i] + dt * DP45_A[1][0] * k1[i];
  const k2 = dysonDerivativesKahan(y2, direction);
  const y3 = new Float64Array(N);
  for (let i = 0; i < N; i++) y3[i] = gammas[i] + dt * (DP45_A[2][0] * k1[i] + DP45_A[2][1] * k2[i]);
  const k3 = dysonDerivativesKahan(y3, direction);
  const y4 = new Float64Array(N);
  for (let i = 0; i < N; i++) y4[i] = gammas[i] + dt * (DP45_A[3][0] * k1[i] + DP45_A[3][1] * k2[i] + DP45_A[3][2] * k3[i]);
  const k4 = dysonDerivativesKahan(y4, direction);
  const y5 = new Float64Array(N);
  for (let i = 0; i < N; i++) y5[i] = gammas[i] + dt * (DP45_A[4][0] * k1[i] + DP45_A[4][1] * k2[i] + DP45_A[4][2] * k3[i] + DP45_A[4][3] * k4[i]);
  const k5 = dysonDerivativesKahan(y5, direction);
  const y6 = new Float64Array(N);
  for (let i = 0; i < N; i++) y6[i] = gammas[i] + dt * (DP45_A[5][0] * k1[i] + DP45_A[5][1] * k2[i] + DP45_A[5][2] * k3[i] + DP45_A[5][3] * k4[i] + DP45_A[5][4] * k5[i]);
  const k6 = dysonDerivativesKahan(y6, direction);
  const result = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    result[i] = gammas[i] + dt * (DP45_B5[0]*k1[i] + DP45_B5[2]*k3[i] + DP45_B5[3]*k4[i] + DP45_B5[4]*k5[i] + DP45_B5[5]*k6[i]);
  }
  return result;
}

function budgetForH(H_raw) {
  const tcPair = (H_raw * H_raw) / 8;
  const dt = Math.max(1e-5, +(tcPair / 5).toPrecision(1));
  return { dt, maxSteps: 40 };
}

function runDp45(N, dt, maxSteps) {
  let gammas = Float64Array.from(ZEROS_EXTENDED.slice(0, N));
  let tAbs = 0;
  for (let step = 0; step < maxSteps; step++) {
    let minGap = Infinity, kStar = -1;
    for (let i = 0; i < gammas.length - 1; i++) {
      const gap = gammas[i + 1] - gammas[i];
      if (gap < minGap) { minGap = gap; kStar = i; }
    }
    if (minGap <= 0) {
      return { closed: true, steps: step, t_c_lo: tAbs - dt, t_c_hi: tAbs, kStar };
    }
    gammas = dp45Step(gammas, dt, -1);
    tAbs += dt;
  }
  return { closed: false, steps: maxSteps, tAbs };
}

const RESCUE_THRESHOLD = 0.12751;
const targets = rawRows.filter(r => r.closed === true && r.N >= 100 && r.N <= 10000);

const REFINE_FACTOR = 2; // 2x finer than imp-933 dt
const out = [];
console.log(`Cross-verifying imp-963 K_bound at ${targets.length} N values in [100, 10^4]:`);
console.log('N\tRK4 t_c_hi\tDP45_match t_c_hi\tDP45_ref t_c_hi\tK_RK4\tK_DP45_match\tK_DP45_ref\trel_match\trel_ref');

for (const r of targets) {
  const { dt: dtMatched, maxSteps: msMatched } = budgetForH(r.H_raw);
  // Matched-dt DP45 (same as imp-933 budget).
  const t0a = Date.now();
  const dp45Match = runDp45(r.N, dtMatched, msMatched);
  const tMs_matched = Date.now() - t0a;
  // Refined-dt DP45 (2x finer dt, more steps).
  const dtRef = dtMatched / REFINE_FACTOR;
  const t0b = Date.now();
  const dp45Ref = runDp45(r.N, dtRef, msMatched * REFINE_FACTOR * 3);
  const tMs_ref = Date.now() - t0b;

  const t_c_pair = (r.H_raw * r.H_raw) / 8;

  function computeK(t_c_hi) {
    const F_mb = Math.abs(t_c_hi - t_c_pair);
    const K_raw = (F_mb * r.H_raw * Math.sqrt(r.N)) / Math.log(r.N);
    return K_raw / RESCUE_THRESHOLD;
  }

  const K_rk4 = r.K_paper_cert_floor;
  const K_dp45_matched = dp45Match.closed ? computeK(dp45Match.t_c_hi) : null;
  const K_dp45_refined = dp45Ref.closed ? computeK(dp45Ref.t_c_hi) : null;

  const relMatch = K_dp45_matched !== null && K_rk4 > 0
    ? (K_dp45_matched - K_rk4) / K_rk4 : null;
  const relRef = K_dp45_refined !== null && K_rk4 > 0
    ? (K_dp45_refined - K_rk4) / K_rk4 : null;

  out.push({
    N: r.N,
    H_raw: r.H_raw,
    t_c_pair: +t_c_pair.toFixed(10),
    plateauIndex: r.plateauIndex,
    // RK4 (imp-933 interval) -- from saved data.
    rk4: {
      dt: r.collisionWidth,
      steps: r.steps,
      t_c_lo: r.t_c_lo,
      t_c_hi: r.t_c_hi,
      F_mb_upper: r.F_mb_upper,
      K_paper_cert_floor: r.K_paper_cert_floor,
      maxIntervalWidth: r.maxIntervalWidth,
      runtimeSec: r.runtimeSec,
    },
    // DP45 matched-dt (same dt as imp-933).
    dp45Matched: {
      dt: +dtMatched.toFixed(8),
      closed: dp45Match.closed,
      steps: dp45Match.steps,
      t_c_hi: dp45Match.closed ? +dp45Match.t_c_hi.toFixed(8) : null,
      kStar: dp45Match.closed ? dp45Match.kStar : null,
      F_mb_upper: dp45Match.closed ? +Math.abs(dp45Match.t_c_hi - t_c_pair).toExponential(6) : null,
      K_paper_cert_floor: K_dp45_matched !== null ? +K_dp45_matched.toExponential(6) : null,
      runtimeMs: tMs_matched,
    },
    // DP45 refined-dt (2x finer).
    dp45Refined: {
      dt: +dtRef.toFixed(8),
      closed: dp45Ref.closed,
      steps: dp45Ref.closed ? dp45Ref.steps : null,
      t_c_hi: dp45Ref.closed ? +dp45Ref.t_c_hi.toFixed(8) : null,
      kStar: dp45Ref.closed ? dp45Ref.kStar : null,
      F_mb_upper: dp45Ref.closed ? +Math.abs(dp45Ref.t_c_hi - t_c_pair).toExponential(6) : null,
      K_paper_cert_floor: K_dp45_refined !== null ? +K_dp45_refined.toExponential(6) : null,
      runtimeMs: tMs_ref,
    },
    // Comparison.
    rel_diff_K_matched: relMatch !== null ? +relMatch.toFixed(6) : null,
    rel_diff_K_refined: relRef !== null ? +relRef.toFixed(6) : null,
    abs_diff_K_matched: K_dp45_matched !== null ? +(K_dp45_matched - K_rk4).toExponential(6) : null,
    abs_diff_K_refined: K_dp45_refined !== null ? +(K_dp45_refined - K_rk4).toExponential(6) : null,
    // Consistency.
    pair_agreement_matched_vs_refined: dp45Match.closed && dp45Ref.closed
      ? (dp45Match.kStar === dp45Ref.kStar)
      : null,
  });

  console.log(`${r.N}\t${r.t_c_hi}\t${dp45Match.t_c_hi?.toFixed(6) ?? 'NA'}\t${dp45Ref.t_c_hi?.toFixed(6) ?? 'NA'}\t${K_rk4.toExponential(3)}\t${K_dp45_matched?.toExponential(3) ?? 'NA'}\t${K_dp45_refined?.toExponential(3) ?? 'NA'}\t${relMatch !== null ? (relMatch*100).toFixed(1)+'%' : 'NA'}\t${relRef !== null ? (relRef*100).toFixed(1)+'%' : 'NA'}`);
}

fs.writeFileSync(
  '/Users/USER/Documents/GitHub/mathexplorer/.claude/worktrees/agent-aae3a2c1039d8b1f4/src/data/imp-1086-crosscheck-rows.json',
  JSON.stringify(out, null, 2),
);

const K_RK4_MAX = Math.max(...out.map(r => r.rk4.K_paper_cert_floor));
const K_DP45_MATCHED_MAX = Math.max(...out.filter(r => r.dp45Matched.K_paper_cert_floor !== null).map(r => r.dp45Matched.K_paper_cert_floor));
const K_DP45_REFINED_MAX = Math.max(...out.filter(r => r.dp45Refined.K_paper_cert_floor !== null).map(r => r.dp45Refined.K_paper_cert_floor));

console.log('\n=== SUMMARY ===');
console.log(`Closed N values: ${out.length}`);
console.log(`K_rk4 max above N=100: ${K_RK4_MAX.toExponential(4)} (imp-963 headline)`);
console.log(`K_dp45_matched max above N=100: ${K_DP45_MATCHED_MAX.toExponential(4)}`);
console.log(`K_dp45_refined max above N=100: ${K_DP45_REFINED_MAX.toExponential(4)}`);

const rk4_rescue_at_100 = K_RK4_MAX * Math.log(100) / Math.sqrt(100);
const dp45_matched_rescue_at_100 = K_DP45_MATCHED_MAX * Math.log(100) / Math.sqrt(100);
const dp45_refined_rescue_at_100 = K_DP45_REFINED_MAX * Math.log(100) / Math.sqrt(100);
console.log(`RK4 rescue lhs at N0=100: ${rk4_rescue_at_100.toFixed(5)} (< 0.12751? ${rk4_rescue_at_100 < 0.12751})`);
console.log(`DP45 matched rescue lhs at N0=100: ${dp45_matched_rescue_at_100.toFixed(5)} (< 0.12751? ${dp45_matched_rescue_at_100 < 0.12751})`);
console.log(`DP45 refined rescue lhs at N0=100: ${dp45_refined_rescue_at_100.toFixed(5)} (< 0.12751? ${dp45_refined_rescue_at_100 < 0.12751})`);

console.log(`Wrote ${out.length} rows.`);
