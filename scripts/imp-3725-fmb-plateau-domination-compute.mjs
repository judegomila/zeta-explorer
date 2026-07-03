#!/usr/bin/env node
// scripts/imp-3725-fmb-plateau-domination-compute.mjs
// imp-3725 OFFLINE COMPUTE: per-plateau gap-domination bootstrap certificate
// for the TRUE-FLOW backward-Dyson collision time on N in [1e4, 1e6].
//
// For each H_raw-plateau [N1, N2] on [1e4, 1e6] (min-gap pair at gap index a,
// H = g_a(0)) the bootstrap lemma gives, with T = H^2/(8*thetaBar) and
//   s_l(T)  = sqrt(max(g_l(0)^2 - 8T, 0))          (frozen shrunk gap l)
//   D_j(T)  = sum of s_l over the gap path from the pair to zero j
//   Psi_N(T)= 4 H^2 * sum_{j <= N, j not in pair} 1 / D_j(T)^2
//   theta_N = 1 - Psi_N(T)/8,
// the enclosure  H^2/8 <= t_c(N) <= H^2/(8*theta_N)  whenever
// theta_N >= thetaBar (self-consistency H^2/(8 theta_N) <= T).
// Psi_N is a partial sum of positive N-independent terms, hence MONOTONE
// nondecreasing in N on the plateau: one evaluation at N2 dominates all N.
//
// Run:  node_modules/.bin/esbuild scripts/imp-3725-fmb-plateau-domination-compute.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp3725.cjs \
//       && node /tmp/imp3725.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const RHO_FLOOR = 0.12751;

if (Z.length < N_MAX) {
  throw new Error(`zero table too short: ${Z.length}`);
}

// gaps g[i] = Z[i+1] - Z[i], 0-indexed; gap i sits between zeros i and i+1.
const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// Running-min scan: anchor at N_MIN (zero-count), argmin index.
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) {
  if (G[i] < H) { H = G[i]; argmin = i; }
}
const anchorH = H;
const anchorArgmin = argmin;

// Updates on (N_MIN, N_MAX]: zero-count N (1-indexed) adds gap index N-2.
const updates = [];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) { H = G[i]; updates.push({ N, gapIndex: i, H: G[i] }); }
}

// Plateaus: [startN, endN, H, pair gap index a]
const plateaus = [];
plateaus.push({
  plateauIndex: 0,
  startN: N_MIN,
  endN: updates.length ? updates[0].N - 1 : N_MAX,
  H: anchorH,
  a: anchorArgmin,
  type: 'carry-over',
});
updates.forEach((u, i) => {
  plateaus.push({
    plateauIndex: i + 1,
    startN: u.N,
    endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX,
    H: u.H,
    a: u.gapIndex,
    type: 'fresh-update',
  });
});

const THETA_LADDER = [0.99, 0.97, 0.95, 0.9, 0.8, 0.75, 0.6, 0.5];

function certifyPlateau(p) {
  const { a, H: h, startN, endN } = p;
  for (const thetaBar of THETA_LADDER) {
    const T = (h * h) / (8 * thetaBar);
    const c8T = 8 * T;
    const s = (g) => {
      const v = g * g - c8T;
      return v > 0 ? Math.sqrt(v) : 0;
    };
    // left sweep: zeros j = a-1 .. 0, D accumulates shrunk gaps a-1 .. j
    let sumEnd = 0;      // sum of 1/D^2 over all j in the N2 system
    let sumStart = 0;    // partial sum restricted to zeros j < startN
    let Dmin = Infinity;
    let degenerate = false;
    let D = 0;
    for (let j = a - 1; j >= 0; j--) {
      D += s(G[j]);
      if (D <= 0) { degenerate = true; break; }
      const t = 1 / (D * D);
      sumEnd += t;
      sumStart += t; // all left zeros are < startN (a < startN - 1)
      if (D < Dmin) Dmin = D;
    }
    if (degenerate) continue;
    // right sweep: zeros j = a+2 .. endN-1 (0-indexed), D over gaps a+1 .. j-1
    D = 0;
    for (let j = a + 2; j <= endN - 1; j++) {
      D += s(G[j - 1]);
      if (D <= 0) { degenerate = true; break; }
      const t = 1 / (D * D);
      sumEnd += t;
      if (j <= startN - 1) sumStart += t;
      if (D < Dmin) Dmin = D;
    }
    if (degenerate) continue;

    // conservative fp inflation: 1e-6 relative on the sums
    const INFLATE = 1 + 1e-6;
    const psiEnd = 4 * h * h * sumEnd * INFLATE;
    const psiStart = 4 * h * h * sumStart * INFLATE;
    const theta = 1 - psiEnd / 8;
    if (theta >= thetaBar) {
      const FmbUpper = ((h * h) / 8) * (1 / theta - 1);
      const tcLo = (h * h) / 8;
      const tcHi = (h * h) / (8 * theta);
      const sqrtOverLogEnd = Math.sqrt(endN) / Math.log(endN);
      const KrawBound = FmbUpper * h * sqrtOverLogEnd;
      const KpaperBound = KrawBound / RHO_FLOOR;
      return {
        ...p,
        thetaBar,
        T_bar: T,
        psiStart,
        psiEnd,
        theta,
        adjGapLeft: a > 0 ? G[a - 1] : null,
        adjGapRight: a + 1 < G.length ? G[a + 1] : null,
        Dmin,
        tcLo,
        tcHi,
        FmbUpper,
        RrelUpper: FmbUpper / tcLo,
        KrawBound,
        KpaperBound,
        certified: true,
      };
    }
  }
  return { ...p, certified: false };
}

const results = plateaus.map(certifyPlateau);

console.log('anchor H at N=1e4:', anchorH, 'argmin gap index (0-based):', anchorArgmin,
  'zeros:', Z[anchorArgmin], Z[anchorArgmin + 1]);
console.log('updates on (1e4,1e6]:', updates.length);
console.log('');
for (const r of results) {
  if (!r.certified) {
    console.log(`plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H}: FAILED to certify`);
    continue;
  }
  console.log(
    `plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a}\n` +
    `  thetaBar=${r.thetaBar} Psi(N1)=${r.psiStart.toExponential(4)} Psi(N2)=${r.psiEnd.toExponential(4)} theta=${r.theta.toFixed(8)}\n` +
    `  adjGaps=[${r.adjGapLeft?.toFixed(6)}, ${r.adjGapRight?.toFixed(6)}] Dmin=${r.Dmin.toExponential(4)}\n` +
    `  t_c in [${r.tcLo.toExponential(6)}, ${r.tcHi.toExponential(6)}]  Fmb<=${r.FmbUpper.toExponential(4)} Rrel<=${r.RrelUpper.toExponential(4)}\n` +
    `  Kraw<=${r.KrawBound.toExponential(4)}  Kpaper<=${r.KpaperBound.toExponential(4)}`,
  );
}

const certifiedAll = results.every((r) => r.certified);
const KpaperMax = Math.max(...results.map((r) => (r.certified ? r.KpaperBound : Infinity)));
console.log('\nALL CERTIFIED:', certifiedAll, ' max Kpaper bound on [1e4,1e6]:', KpaperMax.toExponential(4));
console.log('carryforward K = 0.2014; margin factor:', (0.2014 / KpaperMax).toExponential(3));

// JSON dump for baking into the data module
console.log('\n===JSON===');
console.log(JSON.stringify({
  anchorH,
  anchorArgmin,
  updateCount: updates.length,
  results: results.map((r) => ({
    plateauIndex: r.plateauIndex,
    startN: r.startN,
    endN: r.endN,
    H: +r.H.toFixed(8),
    a: r.a,
    gammaLeft: +Z[r.a].toFixed(9),
    gammaRight: +Z[r.a + 1].toFixed(9),
    type: r.type,
    certified: r.certified,
    thetaBar: r.thetaBar,
    psiStart: +r.psiStart.toExponential(8),
    psiEnd: +r.psiEnd.toExponential(8),
    theta: +r.theta.toFixed(10),
    adjGapLeft: r.adjGapLeft != null ? +r.adjGapLeft.toFixed(8) : null,
    adjGapRight: r.adjGapRight != null ? +r.adjGapRight.toFixed(8) : null,
    Dmin: r.Dmin != null ? +r.Dmin.toExponential(8) : null,
    tcLo: +r.tcLo.toExponential(8),
    tcHi: +r.tcHi.toExponential(8),
    FmbUpper: +r.FmbUpper.toExponential(8),
    RrelUpper: +r.RrelUpper.toExponential(8),
    KrawBound: +r.KrawBound.toExponential(8),
    KpaperBound: +r.KpaperBound.toExponential(8),
  })),
}, null, 1));
