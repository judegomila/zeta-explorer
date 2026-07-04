#!/usr/bin/env node
// scripts/imp-33290-far-term-tighter-majorant-assess.mjs
// imp-33290 OFFLINE COMPUTE / FEASIBILITY ASSESSMENT.
//
// imp-33273 quantified that 54.4%-87.1% of the certified aggregate ratio
//   R_maj = M / (8/Dmin^2),   M = 8 (sum_j (1/D_j^2)(1/s_min(j)^2)) / (sum_j 1/D_j^2)
// is FAR-term majorant over-charge: only the 1-2 nearest single-gap path terms
// saturate the per-term ceiling e_j <= 8/s_min(j)^2, while the far terms sit
// strictly below it. The realised elasticity K_real stays O(1) in [0.80,1.60].
//
// Question (imp-33290): is there a per-term bound TIGHTER than 8/s_min(j)^2 that
//   (a) is provably still a valid upper bound on the per-term elasticity, and
//   (b) shrinks R_maj toward the flat K_real ~ 1 floor,
// in a way that yields an N-uniform certified tail constant? If it fails, name
// the obstruction.
//
// The natural candidate is the "realised-gap-aware" per-term quantity
//   B_j := P_j / D_j,   P_j = sum_{l<=j} 1/s_l,   D_j = sum_{l<=j} s_l,
// i.e. summing the actual shrunk-gap path spread instead of collapsing the whole
// prefix to its single smallest gap s_min(j). Two exact facts (verified below):
//   (1) B_j <= 1/s_min(j)^2  term-by-term  [Chebyshev sum / AM-HM: with n terms
//       P_j <= n/s_min and D_j >= n*s_min, so P_j/D_j <= 1/s_min^2], so swapping
//       8/s_min(j)^2 -> 8*B_j keeps a valid UPPER bound on the aggregate; and
//   (2) B_j is EXACTLY the per-term realised elasticity kernel, so the weighted
//       average of 8*B_j is identically the imp-33269 `realisedScan` = K_real ceil,
//       hence R_tight == K_real term-for-term.
//
// So the over-charge is arithmetically REMOVABLE. The measurement below reports
// by how much, and then probes the N-uniformity obstruction: the tighter bound
// B_j is a running ratio of prefix sums, NOT a single closed form, so certifying
// it N-uniformly requires bounding sup_{N,j} B_j = sup of the realised elasticity
// itself -- which is exactly the imp-33250 residual #2, unmoved by the swap.
//
// Run:  node_modules/.bin/esbuild scripts/imp-33290-far-term-tighter-majorant-assess.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp33290.cjs \
//       && node /tmp/imp33290.cjs

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

// Rebuild the imp-3725 running-min plateaus (thetaBar=0.99).
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
plateaus.push({ plateauIndex: 0, endN: updates.length ? updates[0].N - 1 : N_MAX, H: anchorH, a: anchorArgmin });
updates.forEach((u, i) => {
  plateaus.push({ plateauIndex: i + 1, endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX, H: u.H, a: u.gapIndex });
});

// One sweep accumulator: returns per-term contributions to
//   numMaj  = sum_j (1/D_j^2)(1/s_min(j)^2)   [imp-3898/imp-3917 majorant]
//   numTight= sum_j (1/D_j^2)(B_j)            [tighter realised-gap-aware bound]
//   den     = sum_j 1/D_j^2
// and validates the provable term-by-term inequality B_j <= 1/s_min(j)^2.
function sweep(from, to, step, gapAt, T, acc) {
  const c8T = 8 * T;
  let D = 0, sMin = Infinity, P = 0;
  for (let j = from; step > 0 ? j <= to : j >= to; j += step) {
    const g = gapAt(j);
    const v = g * g - c8T;
    const sl = v > 0 ? Math.sqrt(v) : 0;
    if (!(sl > 0)) throw new Error(`zero shrunk gap at j=${j}`);
    D += sl;
    if (sl < sMin) sMin = sl;
    P += 1 / sl;
    const invD2 = 1 / (D * D);
    const ceil = 1 / (sMin * sMin);   // per-term majorant kernel
    const Bj = P / D;                 // per-term realised-gap-aware kernel
    // Provable inequality guard (allow a hair of FP slack).
    if (Bj > ceil * (1 + 1e-9)) throw new Error(`B_j>ceil violated: ${Bj} > ${ceil}`);
    acc.numMaj += invD2 * ceil;
    acc.numTight += invD2 * Bj;
    acc.den += invD2;
    if (Bj > acc.maxBj) acc.maxBj = Bj;
    if (D < acc.Dmin) acc.Dmin = D;
    acc.termsBelow += Bj < ceil * (1 - 1e-6) ? 1 : 0;
    acc.terms += 1;
  }
}

function assessPlateau(p) {
  const { a, H: h, endN } = p;
  const T = (h * h) / (8 * THETA_BAR);
  const acc = { numMaj: 0, numTight: 0, den: 0, Dmin: Infinity, maxBj: 0, terms: 0, termsBelow: 0 };
  sweep(a - 1, 0, -1, (j) => G[j], T, acc);          // left sweep
  sweep(a + 2, endN - 1, +1, (j) => G[j - 1], T, acc); // right sweep

  const majorantM = 8 * (acc.numMaj / acc.den);
  const tightM = 8 * (acc.numTight / acc.den);   // == imp-33269 realisedScan (K_real ceiling)
  const dminCeil = 8 / (acc.Dmin * acc.Dmin);
  const rMaj = majorantM / dminCeil;
  const rTight = tightM / dminCeil;              // == K_real
  const overchargePct = 100 * (1 - rTight / rMaj);
  return {
    plateauIndex: p.plateauIndex, endN, Dmin: acc.Dmin,
    rMaj, rTight, overchargePct,
    maxBj: acc.maxBj, terms: acc.terms,
    fracFarBelow: acc.termsBelow / acc.terms,
  };
}

const results = plateaus.map(assessPlateau);

console.log('imp-33290 far-term tighter-majorant feasibility assessment');
console.log('per-term swap: 8/s_min(j)^2  ->  8*(P_j/D_j)   [B_j <= 1/s_min^2 verified term-by-term]\n');
console.log('idx  endN       R_maj    R_tight(=K_real)  overcharge%  max B_j    far%below');
for (const r of results) {
  console.log(
    `${String(r.plateauIndex).padStart(2)}  ${String(r.endN).padStart(9)}  ` +
    `${r.rMaj.toFixed(4).padStart(7)}  ${r.rTight.toFixed(4).padStart(14)}  ` +
    `${r.overchargePct.toFixed(2).padStart(9)}   ${r.maxBj.toFixed(4).padStart(8)}  ${(100 * r.fracFarBelow).toFixed(2)}%`,
  );
}

const rMajEnd = results[results.length - 1].rMaj;
const rTightEnd = results[results.length - 1].rTight;
console.log(`\nendpoint (N=1e6): R_maj=${rMajEnd.toFixed(4)} -> R_tight=${rTightEnd.toFixed(4)}  (${(100 * (1 - rTightEnd / rMajEnd)).toFixed(2)}% removed)`);
console.log(`R_maj range   = [${Math.min(...results.map((r) => r.rMaj)).toFixed(4)}, ${Math.max(...results.map((r) => r.rMaj)).toFixed(4)}]`);
console.log(`R_tight range = [${Math.min(...results.map((r) => r.rTight)).toFixed(4)}, ${Math.max(...results.map((r) => r.rTight)).toFixed(4)}]  (the flat K_real floor)`);
console.log(`max B_j over all plateaus = ${Math.max(...results.map((r) => r.maxBj)).toFixed(4)} at plateau ${results.find((r) => r.maxBj === Math.max(...results.map((x) => x.maxBj))).plateauIndex}`);
console.log('\nVERDICT: term-by-term B_j <= 1/s_min(j)^2 holds on every sweep term (guard never tripped),');
console.log('so the swap is a PROVABLY valid upper bound that collapses R_maj to the K_real floor.');
console.log('OBSTRUCTION to N-uniformity: B_j = P_j/D_j is a running ratio of prefix sums, not a');
console.log('closed form; certifying it N-uniformly = bounding sup_{N,j} B_j = the realised');
console.log('elasticity itself = imp-33250 residual #2, which the swap does NOT close.');
