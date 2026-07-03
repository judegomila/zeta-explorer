#!/usr/bin/env node
// scripts/imp-3870-smin-dmin-slack-compute.mjs
// imp-3870 OFFLINE COMPUTE: measure the smin (smallest INDIVIDUAL shrunk gap)
// vs Dmin (nearest CUMULATIVE frozen distance) slack per H_raw-plateau on
// [1e4, 1e6], and test whether the smin/Dmin < 1 slack (with endpoint
// concavity) reproduces the imp-3854 measured-vs-predicted residual factor
// (predictionRatio in [0.79, 1.56]).
//
// SETTING (imp-3725 gap-domination bootstrap, thetaBar = 0.99, unchanged):
//   T       = H^2/(8*thetaBar),  8T frozen
//   s_l(T)  = sqrt(max(g_l(0)^2 - 8T, 0))          (frozen shrunk gap l)
//   D_j(T)  = sum of s_l over the gap path from the record pair a to zero j
//   Dmin    = min_j D_j(T)   (nearest cumulative distance; adjacent-gap driven)
//   smin    = min over gaps l != a of s_l(T)  (smallest INDIVIDUAL shrunk gap)
// imp-3854 LEMMA: d ln t_j/dT <= 8/smin^2 uniformly, so the RIGOROUS elasticity
// constant is (H/smin)^2 >= (H/Dmin)^2. imp-3854 substituted Dmin for smin
// ("smin ~= Dmin refinement") and confirmed the O((H/Dmin)^2) prediction to a
// factor predictionRatio in [0.79, 1.56], attributing the residual to
//   (i)  smin/Dmin < 1 slack   (predictionRatio > 1: tightest gap beyond pair)
//   (ii) endpoint-concavity slack (predictionRatio < 1 elsewhere).
// This script MEASURES smin, Dmin, smin/Dmin, and the correction factor
// (Dmin/smin)^2, then checks whether the rigorous smin-based elasticity turns
// the Dmin-based over-shoot (predictionRatio > 1) back into a valid upper
// bound (predictionRatio * (smin/Dmin)^2 <= 1), i.e. whether the slack is
// smin/Dmin as imp-3854 claimed.
//
// Run:  node_modules/.bin/esbuild scripts/imp-3870-smin-dmin-slack-compute.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp3870.cjs \
//       && node /tmp/imp3870.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

// gaps g[i] = Z[i+1] - Z[i], 0-indexed.
const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// Running-min scan reproducing the imp-3725 plateau structure.
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) {
  if (G[i] < H) { H = G[i]; argmin = i; }
}
const anchorH = H;
const anchorArgmin = argmin;
const updates = [];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) { H = G[i]; updates.push({ N, gapIndex: i, H: G[i] }); }
}
const plateaus = [];
plateaus.push({ plateauIndex: 0, startN: N_MIN, endN: updates.length ? updates[0].N - 1 : N_MAX, H: anchorH, a: anchorArgmin });
updates.forEach((u, i) => {
  plateaus.push({ plateauIndex: i + 1, startN: u.N, endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX, H: u.H, a: u.gapIndex });
});

// For each plateau: scan the full endN system to find smin (smallest single
// shrunk gap in any path, i.e. over all gap indices != a) and Dmin (nearest
// cumulative distance), plus the location of the smin gap relative to a.
function measure(p) {
  const { a, H: h, endN } = p;
  const T = (h * h) / (8 * THETA_BAR);
  const c8T = 8 * T;
  const s = (g) => { const v = g * g - c8T; return v > 0 ? Math.sqrt(v) : 0; };

  let Dmin = Infinity;
  let smin = Infinity;
  let sminGapIndex = -1;

  // left sweep: gaps a-1 .. 0
  let D = 0;
  for (let j = a - 1; j >= 0; j--) {
    const sl = s(G[j]);
    if (sl < smin) { smin = sl; sminGapIndex = j; }
    D += sl;
    if (D < Dmin) Dmin = D;
  }
  // right sweep: gaps a+1 .. endN-2 (gap index j-1 for zero j = a+2..endN-1)
  D = 0;
  for (let j = a + 2; j <= endN - 1; j++) {
    const sl = s(G[j - 1]);
    if (sl < smin) { smin = sl; sminGapIndex = j - 1; }
    D += sl;
    if (D < Dmin) Dmin = D;
  }

  const sminRawGap = G[sminGapIndex];          // raw (unshrunk) gap that realises smin
  const distFromPair = sminGapIndex - a;        // signed offset in gap-index space
  const isAdjacent = Math.abs(distFromPair) === 1;
  return {
    plateauIndex: p.plateauIndex,
    startN: p.startN,
    endN,
    H: h,
    a,
    T,
    Dmin,
    smin,
    sminGapIndex,
    sminRawGap,
    distFromPair,
    isAdjacent,
    sminOverDmin: smin / Dmin,
    dminOverSminSq: (Dmin / smin) ** 2,          // rigorous elasticity correction factor
    hOverSminSq: (h / smin) ** 2,
    hOverDminSq: (h / Dmin) ** 2,
  };
}

const rows = plateaus.map(measure);

console.log('anchor H at N=1e4:', anchorH, 'argmin:', anchorArgmin, 'plateaus:', plateaus.length);
console.log('');
for (const r of rows) {
  console.log(
    `plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a}\n` +
    `  Dmin=${r.Dmin.toFixed(8)} smin=${r.smin.toFixed(8)} smin/Dmin=${r.sminOverDmin.toFixed(6)} (Dmin/smin)^2=${r.dminOverSminSq.toFixed(6)}\n` +
    `  smin raw gap=${r.sminRawGap.toFixed(8)} at gap idx ${r.sminGapIndex} (offset ${r.distFromPair} from pair; adjacent=${r.isAdjacent})`,
  );
}

console.log('\n===JSON===');
console.log(JSON.stringify({
  thetaBar: THETA_BAR,
  rows: rows.map((r) => ({
    plateauIndex: r.plateauIndex,
    startN: r.startN,
    endN: r.endN,
    H: +r.H.toFixed(8),
    a: r.a,
    Dmin: +r.Dmin.toFixed(8),
    smin: +r.smin.toFixed(8),
    sminGapIndex: r.sminGapIndex,
    sminRawGap: +r.sminRawGap.toFixed(8),
    distFromPair: r.distFromPair,
    isAdjacent: r.isAdjacent,
    sminOverDmin: +r.sminOverDmin.toFixed(8),
    dminOverSminSq: +r.dminOverSminSq.toFixed(8),
    hOverSminSq: +r.hOverSminSq.toExponential(8),
    hOverDminSq: +r.hOverDminSq.toExponential(8),
  })),
}, null, 1));
