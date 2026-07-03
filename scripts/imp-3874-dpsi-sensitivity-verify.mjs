#!/usr/bin/env node
// scripts/imp-3874-dpsi-sensitivity-verify.mjs
// imp-3874 OFFLINE COMPUTE: numerically VERIFY the imp-3854 LEMMA-3854
// sensitivity bound
//     0 <= dPsi_N/dT <= (8/smin^2) Psi_N
// by DIRECT finite-difference of the retardation Psi_N(T) along the frozen
// horizon T = H^2/(8*thetaBar), on representative [1e4, 1e6] plateaus, across
// the feasible thetaBar window [0.99, thetaBarStar].
//
// SETTING (imp-3725 gap-domination bootstrap, unchanged):
//   T       = H^2/(8*thetaBar)
//   s_l(T)  = sqrt(max(g_l(0)^2 - 8T, 0))                 (frozen shrunk gap l)
//   D_j(T)  = sum of s_l over the gap path from the record pair a to zero j
//   Psi_N(T)= 4 H^2 * sum_{j<=N, j not in {a,a+1}} 1/D_j(T)^2
//   smin(T) = min over ACTIVE gaps l != a of s_l(T)   (smallest individual gap)
// imp-3854 STEP-1 gives the EXACT derivative (H fixed, only D_j depends on T):
//   d ln t_j/dT = (8/D_j) * sum_{active l in path j} 1/s_l,  t_j = 4H^2/D_j^2,
// hence  dPsi_N/dT = 32 H^2 * sum_j P_j / D_j^3,  P_j = sum_{active l} 1/s_l >= 0.
// LEMMA-3854: since s_l >= smin and D_j >= |path_j|*smin, d ln t_j/dT <= 8/smin^2
// uniformly, so 0 <= dPsi_N/dT <= (8/smin^2) Psi_N.
//
// THIS SCRIPT verifies, per (plateau, thetaBar):
//   (a) direct Psi_N(T) reproduces the imp-3725 baked psiEnd at thetaBar=0.99;
//   (b) a centered finite difference (Psi(T+h)-Psi(T-h))/(2h) matches the exact
//       analytic dPsi_N/dT to high relative accuracy (validates STEP-1);
//   (c) dPsi_N/dT >= 0  (monotone: shrinking gaps inflate Psi);
//   (d) dPsi_N/dT <= (8/smin^2) Psi_N   (LEMMA-3854, the two-sided bound);
//   (e) the actual log-sensitivity (dPsi/dT)/Psi sits far below the rigorous
//       8/smin^2 ceiling -- consistent with imp-3870 (bound valid but loose).
//
// Run:  node_modules/.bin/esbuild scripts/imp-3874-dpsi-sensitivity-verify.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp3874.cjs \
//       && node /tmp/imp3874.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

// gaps g[i] = Z[i+1] - Z[i], 0-indexed.
const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// Reproduce the imp-3725 running-min plateau structure.
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) {
  if (G[i] < H) { H = G[i]; argmin = i; }
}
const plateaus = [{ plateauIndex: 0, startN: N_MIN, endN: null, H, a: argmin }];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) {
    plateaus[plateaus.length - 1].endN = N - 1;
    H = G[i];
    plateaus.push({ plateauIndex: plateaus.length, startN: N, endN: null, H, a: i });
  }
}
plateaus[plateaus.length - 1].endN = N_MAX;

// imp-3728 feasible-window upper endpoints thetaBarStar (KNOWN reference for the
// 3 originally-sampled plateaus; used to cross-check the recomputed values below).
const THETA_BAR_STAR_REF = {
  0: 0.99822707, 4: 0.99883762, 9: 0.9998958,
};

// Evaluate Psi_N(T), smin(T), and the exact analytic dPsi_N/dT for a plateau
// at a given horizon T. One O(N) pass with running D_j and P_j accumulators.
function evalAt(p, T) {
  const { a, H: h, endN } = p;
  const c8T = 8 * T;
  const s = (g) => { const v = g * g - c8T; return v > 0 ? Math.sqrt(v) : 0; };

  let psiSum = 0;        // sum_j 1/D_j^2
  let dpsiSum = 0;       // sum_j P_j / D_j^3
  let smin = Infinity;

  // left sweep: gaps a-1 .. 0 (zeros a-1 .. 0)
  let D = 0, P = 0;
  for (let j = a - 1; j >= 0; j--) {
    const sl = s(G[j]);
    if (sl > 0) { D += sl; P += 1 / sl; if (sl < smin) smin = sl; }
    if (D > 0) { const inv = 1 / (D * D); psiSum += inv; dpsiSum += P / (D * D * D); }
  }
  // right sweep: gaps a+1 .. endN-2 (zeros a+2 .. endN-1)
  D = 0; P = 0;
  for (let j = a + 2; j <= endN - 1; j++) {
    const sl = s(G[j - 1]);
    if (sl > 0) { D += sl; P += 1 / sl; if (sl < smin) smin = sl; }
    if (D > 0) { const inv = 1 / (D * D); psiSum += inv; dpsiSum += P / (D * D * D); }
  }

  const psi = 4 * h * h * psiSum;
  const dpsi = 32 * h * h * dpsiSum;   // exact analytic dPsi/dT
  return { psi, dpsi, smin };
}

// Centered finite difference of Psi in T (H fixed), relative step hRel.
function fdDpsi(p, T, hRel) {
  const h = hRel * T;
  const plus = evalAt(p, T + h).psi;
  const minus = evalAt(p, T - h).psi;
  return (plus - minus) / (2 * h);
}

// imp-3890: locate the feasible-window upper endpoint thetaBar* per plateau as the
// unique fixed point theta_N(thetaBar*) = thetaBar* (imp-3728), so the LEMMA-3854
// verification can run on ALL 10 imp-3725 plateaus, not just the 3 pre-sampled ones.
// theta_N(thetaBar) = 1 - Psi_N(T)/8 with T = H^2/(8 thetaBar); f(tb) = theta_N - tb
// is decreasing, feasible = f >= 0, so bisect for the largest feasible tb.
function thetaBarStarOf(p) {
  const g = (tb) => (1 - evalAt(p, (p.H * p.H) / (8 * tb)).psi / 8) - tb;
  let lo = 0.5, hi = 0.999999;
  if (g(lo) < 0) return lo;      // should not happen on these plateaus
  if (g(hi) >= 0) return hi;     // wall above search window: clamp
  for (let it = 0; it < 80; it++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) >= 0) lo = mid; else hi = mid;
  }
  return lo;
}

// imp-3890: extend from the 3 pre-sampled plateaus [0,4,9] to ALL imp-3725 plateaus.
const TARGET_PLATEAUS = plateaus.map((_, i) => i);
const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

const out = [];
for (const pi of TARGET_PLATEAUS) {
  const p = plateaus[pi];
  const tbStar = thetaBarStarOf(p);
  const tbStarRef = THETA_BAR_STAR_REF[pi];
  const tbStarRelToRef = tbStarRef !== undefined ? rel(tbStar, tbStarRef) : null;
  // sweep thetaBar across the feasible window [0.99, thetaBarStar]
  const sweep = [];
  const K = 5;
  for (let k = 0; k < K; k++) {
    const thetaBar = 0.99 + (tbStar - 0.99) * (k / (K - 1));
    const T = (p.H * p.H) / (8 * thetaBar);
    const { psi, dpsi, smin } = evalAt(p, T);
    const fd = fdDpsi(p, T, 1e-6);
    const bound = (8 / (smin * smin)) * psi;
    const thetaN = 1 - psi / 8;
    sweep.push({
      thetaBar, T, psi, smin, thetaN,
      dpsiAnalytic: dpsi,
      dpsiFD: fd,
      fdVsAnalyticRel: rel(fd, dpsi),
      bound,
      dpsiOverBound: dpsi / bound,     // < 1 confirms LEMMA; how loose is the ceiling
      logSensitivity: dpsi / psi,       // (dPsi/dT)/Psi = measured 8/smin^2 analogue
      rigorousCeil: 8 / (smin * smin),  // the LEMMA ceiling on log-sensitivity
      nonneg: dpsi >= 0,
      underBound: dpsi <= bound,
    });
  }
  out.push({ plateauIndex: pi, startN: p.startN, endN: p.endN, H: p.H, a: p.a, thetaBarStar: tbStar, thetaBarStarRef: tbStarRef, thetaBarStarRelToRef: tbStarRelToRef, sweep });
}

// Cross-check: direct Psi at thetaBar=0.99, N=endN vs imp-3725 baked psiEnd.
const PSI_END_BAKED = { 0: 0.0141836457, 4: 0.00929912307, 9: 8.33562277e-4 };

console.log('=== imp-3874 LEMMA-3854 finite-difference verification ===\n');
for (const r of out) {
  const base = r.sweep[0];
  const refStr = r.thetaBarStarRef !== undefined
    ? ` (ref=${r.thetaBarStarRef} rel=${r.thetaBarStarRelToRef.toExponential(3)})` : '';
  console.log(
    `plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a} thetaBarStar=${r.thetaBarStar.toFixed(8)}${refStr}`,
  );
  const baked = PSI_END_BAKED[r.plateauIndex];
  const bakedStr = baked !== undefined
    ? `  baked psiEnd=${baked.toExponential(8)}  rel=${rel(base.psi, baked).toExponential(3)}` : '  (no baked psiEnd reference)';
  console.log(`  psi(thetaBar=0.99)=${base.psi.toExponential(8)}${bakedStr}`);
  for (const s of r.sweep) {
    console.log(
      `  tb=${s.thetaBar.toFixed(8)} psi=${s.psi.toExponential(6)} smin=${s.smin.toFixed(8)} ` +
      `dpsiA=${s.dpsiAnalytic.toExponential(6)} dpsiFD=${s.dpsiFD.toExponential(6)} ` +
      `fdRel=${s.fdVsAnalyticRel.toExponential(3)} nonneg=${s.nonneg} underBound=${s.underBound} ` +
      `dpsi/bound=${s.dpsiOverBound.toExponential(3)} logSens=${s.logSensitivity.toExponential(4)} ceil=${s.rigorousCeil.toExponential(4)}`,
    );
  }
  console.log('');
}

// Emit compact JSON for baking (base thetaBar=0.99 point + window extremes).
const baked = out.map((r) => {
  const base = r.sweep[0];
  const top = r.sweep[r.sweep.length - 1];
  const maxFdRel = Math.max(...r.sweep.map((s) => s.fdVsAnalyticRel));
  const maxDpsiOverBound = Math.max(...r.sweep.map((s) => s.dpsiOverBound));
  const allNonneg = r.sweep.every((s) => s.nonneg);
  const allUnderBound = r.sweep.every((s) => s.underBound);
  return {
    plateauIndex: r.plateauIndex,
    startN: r.startN,
    endN: r.endN,
    H: +r.H.toFixed(8),
    a: r.a,
    thetaBarStar: +r.thetaBarStar.toFixed(8),
    thetaBarStarRelToRef: r.thetaBarStarRelToRef !== null && r.thetaBarStarRelToRef !== undefined
      ? +r.thetaBarStarRelToRef.toExponential(4) : null,
    psiBase: +base.psi.toExponential(8),
    psiBaseRelToBaked: PSI_END_BAKED[r.plateauIndex] !== undefined
      ? +rel(base.psi, PSI_END_BAKED[r.plateauIndex]).toExponential(4) : null,
    sminBase: +base.smin.toFixed(8),
    dpsiAnalyticBase: +base.dpsiAnalytic.toExponential(8),
    dpsiFDBase: +base.dpsiFD.toExponential(8),
    boundBase: +base.bound.toExponential(8),
    logSensBase: +base.logSensitivity.toExponential(8),
    rigorousCeilBase: +base.rigorousCeil.toExponential(8),
    dpsiOverBoundBase: +base.dpsiOverBound.toExponential(8),
    // window extremes
    dpsiOverBoundTop: +top.dpsiOverBound.toExponential(8),
    maxFdVsAnalyticRel: +maxFdRel.toExponential(4),
    maxDpsiOverBound: +maxDpsiOverBound.toExponential(8),
    allNonneg,
    allUnderBound,
  };
});
console.log('===JSON===');
console.log(JSON.stringify({ sweepPoints: 5, feasibleWindow: '[0.99, thetaBarStar]', rows: baked }, null, 1));
