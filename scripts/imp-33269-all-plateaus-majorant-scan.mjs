#!/usr/bin/env node
// scripts/imp-33269-all-plateaus-majorant-scan.mjs
// imp-33269 OFFLINE COMPUTE: extend the imp-3910 certified weighted path-local
// majorant scan from 3 plateaus (0,4,9) to ALL 10 plateaus on N in [1e4,1e6].
//
// For each imp-3725 running-min plateau (thetaBar=0.99) the scan reuses the EXACT
// imp-3725 frozen-gap path machinery
//   s_l(T) = sqrt(max(g_l^2 - 8T, 0)),  T = H^2/(8*thetaBar),
// left+right sweeps from the record pair, accumulating per path term j:
//   D_j (running sum of shrunk gaps), s_min(j) (running min shrunk gap),
//   P_j = sum 1/s_l (running), giving the EXACT weighted majorant
//     M = 8 (sum_j (1/D_j^2)(1/s_min(j)^2)) / (sum_j 1/D_j^2)
// and, as a live cross-check, the realised elasticity
//     realised = 8 (sum_j P_j/D_j^3) / (sum_j 1/D_j^2) = (dPsi/dT)/Psi.
// Then C = M*Dmin^2 (collapse constant) and R_maj = M/(8/Dmin^2) = C/8.
//
// Purpose: MEASURE whether R_maj keeps climbing past the plateau-9 sample max
// (6.82) or turns over once the remaining 7 plateaus are filled in.
//
// Run:  node_modules/.bin/esbuild scripts/imp-33269-all-plateaus-majorant-scan.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp33269.cjs \
//       && node /tmp/imp33269.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// Rebuild the running-min plateaus exactly as imp-3725 does.
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
plateaus.push({
  plateauIndex: 0,
  startN: N_MIN,
  endN: updates.length ? updates[0].N - 1 : N_MAX,
  H: anchorH,
  a: anchorArgmin,
});
updates.forEach((u, i) => {
  plateaus.push({
    plateauIndex: i + 1,
    startN: u.N,
    endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX,
    H: u.H,
    a: u.gapIndex,
  });
});

function scanPlateau(p) {
  const { a, H: h, endN } = p;
  const T = (h * h) / (8 * THETA_BAR);
  const c8T = 8 * T;
  const s = (g) => {
    const v = g * g - c8T;
    return v > 0 ? Math.sqrt(v) : 0;
  };

  // A path in imp-3725 is either the left sweep (a-1..0) or the right sweep
  // (a+2..endN-1). D, s_min and P accumulate independently on each sweep, since
  // the two sweeps are two disjoint paths radiating from the pair. We aggregate
  // the majorant / realised weighted sums over BOTH sweeps' terms.
  let numMaj = 0;   // sum_j (1/D_j^2)(1/s_min(j)^2)
  let den = 0;      // sum_j 1/D_j^2
  let numReal = 0;  // sum_j P_j/D_j^3
  let Dmin = Infinity;

  // left sweep
  {
    let D = 0, sMin = Infinity, P = 0;
    for (let j = a - 1; j >= 0; j--) {
      const sl = s(G[j]);
      if (!(sl > 0)) throw new Error(`zero shrunk gap left j=${j} plateau ${p.plateauIndex}`);
      D += sl;
      if (sl < sMin) sMin = sl;
      P += 1 / sl;
      const invD2 = 1 / (D * D);
      numMaj += invD2 / (sMin * sMin);
      den += invD2;
      numReal += P / (D * D * D);
      if (D < Dmin) Dmin = D;
    }
  }
  // right sweep
  {
    let D = 0, sMin = Infinity, P = 0;
    for (let j = a + 2; j <= endN - 1; j++) {
      const sl = s(G[j - 1]);
      if (!(sl > 0)) throw new Error(`zero shrunk gap right j=${j} plateau ${p.plateauIndex}`);
      D += sl;
      if (sl < sMin) sMin = sl;
      P += 1 / sl;
      const invD2 = 1 / (D * D);
      numMaj += invD2 / (sMin * sMin);
      den += invD2;
      numReal += P / (D * D * D);
      if (D < Dmin) Dmin = D;
    }
  }

  const majorantM = 8 * (numMaj / den);
  const realisedScan = 8 * (numReal / den);
  const dminCeil = 8 / (Dmin * Dmin);
  const collapseConstantC = majorantM * Dmin * Dmin;
  const rMaj = majorantM / dminCeil;          // = C/8
  const rReal = realisedScan / dminCeil;      // realised ratio K_real (imp-33250)
  return { ...p, Dmin, majorantM, realisedScan, dminCeil, collapseConstantC, rMaj, rReal };
}

const results = plateaus.map(scanPlateau);

console.log('plateaus:', results.length, '(expect 10)');
console.log('idx  endN       H          Dmin       M          C=M*Dmin^2  R_maj=C/8  realised');
for (const r of results) {
  console.log(
    `${String(r.plateauIndex).padStart(2)}  ${String(r.endN).padStart(9)}  ` +
    `${r.H.toFixed(7)}  ${r.Dmin.toFixed(6)}  ${r.majorantM.toFixed(5).padStart(10)}  ` +
    `${r.collapseConstantC.toFixed(4).padStart(9)}  ${r.rMaj.toFixed(4).padStart(8)}  ${r.realisedScan.toFixed(5)}`,
  );
}

const rMajValues = results.map((r) => r.rMaj);
const rMajMax = Math.max(...rMajValues);
const argMax = results.find((r) => r.rMaj === rMajMax);
console.log('\nR_maj max =', rMajMax.toFixed(4), 'at plateau', argMax.plateauIndex, '(endN', argMax.endN, ')');
console.log('plateau-9 R_maj =', results[9].rMaj.toFixed(4), '(prior 3-sample max)');
console.log('C max =', Math.max(...results.map((r) => r.collapseConstantC)).toFixed(4));
const rReals = results.map((r) => r.rReal);
console.log('K_real range = [', Math.min(...rReals).toFixed(4), ',', Math.max(...rReals).toFixed(4),
  '] max at plateau', results.find((r) => r.rReal === Math.max(...rReals)).plateauIndex);

console.log('\n===JSON===');
console.log(JSON.stringify(results.map((r) => ({
  plateauIndex: r.plateauIndex,
  endN: r.endN,
  H: +r.H.toFixed(8),
  Dmin: +r.Dmin.toFixed(9),
  majorantM: +r.majorantM.toFixed(8),
  collapseConstantC: +r.collapseConstantC.toFixed(6),
  rMaj: +r.rMaj.toFixed(6),
  realisedScan: +r.realisedScan.toFixed(8),
  rReal: +r.rReal.toFixed(6),
})), null, 1));
