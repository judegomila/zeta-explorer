#!/usr/bin/env node
// scripts/imp-33532-refined-plateau-maxbj-near-95248.mjs
// imp-33532 OFFLINE MEASUREMENT (HONEST, measurement-only, NO QED).
//
// imp-33309 fit the growth law of max_j B_j (= max_j P_j/D_j, the realised-gap-
// aware per-term elasticity kernel = the imp-33250 residual dg2) across the 10
// imp-3725 plateaus of [1e4,1e6] and found the GLOBAL maximum 6.4537 at plateau
// 5 (endN ~ 95248), but on a COARSE grid of one max-B_j sample per plateau it
// could NOT distinguish a slow unbounded drift from a bounded lattice
// fluctuation -- the residual scatter dwarfs the trend and the dg2 obstruction
// stays OPEN both ways.
//
// This script REFINES the grid around the plateau-5 peak. Keeping plateau 5s
// own (anchor a, running-min H, T=H^2/(8*thetaBar)) fixed, it asks whether the
// 6.4537 reading is:
//   (A) a GENUINE INTERIOR maximum -- attained at a specific interior term j*
//       and NOT exceeded as the window is extended, so a finer endN grid would
//       not raise it (bounded-reading evidence); or
//   (B) an UNDER-RESOLVED boundary value -- B_j still climbing at the plateau-5
//       cutoff, so extending the window past endN=95248 keeps raising it
//       (drift-reading evidence).
//
// It does this three ways, all with plateau 5s fixed kernel:
//   1. Reproduce max B_j = 6.4537 (cross-check vs imp-33290/imp-33309) and
//      report whether the argmax sits on the LEFT sweep (fixed, anchor-anchored,
//      endN-independent) or the RIGHT sweep (grows with the endN cutoff), plus
//      the argmax term index and its gap-distance from the anchor.
//   2. A FINE endN sub-grid inside plateau 5: running max B_j at many cutoffs
//      from the anchor out to endN=95248, showing where the running max
//      saturates (how far before the cutoff the peak is already locked in).
//   3. A bounded WINDOW EXTENSION past 95248 with plateau 5s SAME T, sweeping
//      further right (skipping any term whose shrunk gap v=g^2-8T<=0, which the
//      smaller plateau-6 min gap forces) up to endN=354769, testing whether the
//      running max ever EXCEEDS 6.4537.
//
// Measurement only; delivers NO N-uniform certified constant; the imp-33250 dg2
// stays as characterized; imp-3066 UNTOUCHED; Platt-Trudgian Lambda<=0.2 SOTA;
// NO QED.
//
// Run:  node_modules/.bin/esbuild scripts/imp-33532-refined-plateau-maxbj-near-95248.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp33532.cjs \
//       && node /tmp/imp33532.cjs

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

// Rebuild the imp-3725 running-min plateaus (thetaBar=0.99), exactly as imp-33290.
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

const P5 = plateaus.find((p) => p.plateauIndex === 5);
const P6 = plateaus.find((p) => p.plateauIndex === 6);
if (!P5) throw new Error('plateau 5 not found');
const T5 = (P5.H * P5.H) / (8 * THETA_BAR);
const c8T = 8 * T5;

// --- 1. Reproduce max B_j and locate the argmax (left vs right sweep). ------
// Left sweep: j = a-1 .. 0 using G[j]. Right sweep: j = a+2 .. endN-1 using
// G[j-1]. Each is an INDEPENDENT prefix accumulation outward from the anchor.
function sweepMax(from, to, step, gapAt, label) {
  let D = 0, sMin = Infinity, P = 0;
  let maxBj = 0, argAt = -1, termsFromAnchor = 0, argTerms = 0;
  for (let j = from; step > 0 ? j <= to : j >= to; j += step) {
    const g = gapAt(j);
    const v = g * g - c8T;
    const sl = v > 0 ? Math.sqrt(v) : 0;
    if (!(sl > 0)) throw new Error(`zero shrunk gap at j=${j} on ${label}`);
    D += sl; if (sl < sMin) sMin = sl; P += 1 / sl;
    termsFromAnchor += 1;
    const Bj = P / D;
    if (Bj > maxBj) { maxBj = Bj; argAt = j; argTerms = termsFromAnchor; }
  }
  return { label, maxBj, argAt, argTerms, totalTerms: termsFromAnchor };
}

const left = sweepMax(P5.a - 1, 0, -1, (j) => G[j], 'left');
const right = sweepMax(P5.a + 2, P5.endN - 1, +1, (j) => G[j - 1], 'right');
const reproMaxBj = Math.max(left.maxBj, right.maxBj);
const peakSweep = left.maxBj >= right.maxBj ? left : right;

// --- 2. Fine endN sub-grid inside plateau 5 (right sweep running max). ------
// Record the running max B_j at a fine ladder of endN cutoffs, and the earliest
// cutoff at which the running max already reaches within 1e-4 of the plateau max.
const startN = plateaus.find((p) => p.plateauIndex === 5).a + 3; // just inside the right sweep
const subGridCuts = [];
{
  const GRID = 24;
  for (let k = 1; k <= GRID; k++) {
    subGridCuts.push(startN + Math.round(((P5.endN - startN) * k) / GRID));
  }
}
const subGrid = [];
{
  let D = 0, sMin = Infinity, P = 0, runMax = 0;
  let cutPtr = 0;
  const earliestReachN = { n: P5.endN, reached: false };
  for (let j = P5.a + 2; j <= P5.endN - 1; j++) {
    const g = G[j - 1];
    const v = g * g - c8T;
    const sl = v > 0 ? Math.sqrt(v) : 0;
    if (!(sl > 0)) throw new Error(`zero shrunk gap at j=${j} on subgrid`);
    D += sl; if (sl < sMin) sMin = sl; P += 1 / sl;
    const Bj = P / D;
    if (Bj > runMax) runMax = Bj;
    if (!earliestReachN.reached && runMax >= right.maxBj - 1e-4) {
      earliestReachN.reached = true; earliestReachN.n = j + 1;
    }
    while (cutPtr < subGridCuts.length && j + 1 >= subGridCuts[cutPtr]) {
      subGrid.push({ endN: subGridCuts[cutPtr], runMaxBj: runMax });
      cutPtr++;
    }
  }
  subGrid.earliestReachN = earliestReachN;
}

// --- 3. Bounded window extension past 95248 with plateau 5s SAME T. ----------
// Continue the right sweep beyond endN=95248, skipping any term whose shrunk gap
// is non-positive (the smaller plateau-6 min gap forces this), up to endN=354769.
// Test whether the running max ever exceeds 6.4537.
const extEnd = Math.min(P6 ? P6.endN : N_MAX, N_MAX);
let extResult;
{
  // Re-run the right sweep from the anchor through endN=95248 to carry the exact
  // prefix state, then continue past the cutoff.
  let D = 0, sMin = Infinity, P = 0, runMax = 0;
  let skipped = 0, maxBeyond = 0, argBeyondN = -1, exceededPeak = false;
  let firstDegenerateN = -1;
  for (let j = P5.a + 2; j <= extEnd - 1; j++) {
    const g = G[j - 1];
    const v = g * g - c8T;
    if (!(v > 0)) {
      skipped++;
      if (firstDegenerateN < 0) firstDegenerateN = j + 1;
      continue; // skip degenerate term, keep the running prefix state
    }
    const sl = Math.sqrt(v);
    D += sl; if (sl < sMin) sMin = sl; P += 1 / sl;
    const Bj = P / D;
    if (Bj > runMax) runMax = Bj;
    if (j + 1 > P5.endN) {
      if (Bj > maxBeyond) { maxBeyond = Bj; argBeyondN = j + 1; }
      if (Bj > reproMaxBj + 1e-6) exceededPeak = true;
    }
  }
  extResult = {
    extEnd, runMaxOverExtended: runMax, maxBeyondCut: maxBeyond,
    argBeyondN, exceededPeak, skippedDegenerate: skipped, firstDegenerateN,
  };
}

// --- Report ----------------------------------------------------------------
console.log('imp-33532 refined plateau-5 (endN ~ 95248) max B_j measurement\n');
console.log(`plateau 5: anchor gapIndex a=${P5.a}  H=${P5.H.toExponential(6)}  T=${T5.toExponential(6)}  endN=${P5.endN}`);
console.log(`reproduced max B_j = ${reproMaxBj.toFixed(4)} (imp-33290/imp-33309 baked 6.4537)\n`);

console.log('1. ARGMAX LOCATION (which sweep carries the peak)');
console.log(`   left  sweep: max B_j=${left.maxBj.toFixed(4)}  at gapIndex ${left.argAt} (${left.argTerms}/${left.totalTerms} terms from anchor)`);
console.log(`   right sweep: max B_j=${right.maxBj.toFixed(4)}  at gapIndex ${right.argAt} (${right.argTerms}/${right.totalTerms} terms from anchor, endN~${right.argAt + 1})`);
console.log(`   => peak on the ${peakSweep.label.toUpperCase()} sweep; ` +
  (peakSweep.label === 'left'
    ? 'LEFT-sweep peaks are anchor-anchored and endN-INDEPENDENT (a finer endN grid cannot move them).'
    : 'RIGHT-sweep peak position vs the cutoff decides interior-vs-boundary.'));

console.log('\n2. FINE endN SUB-GRID (right-sweep running max B_j inside plateau 5)');
console.log('   endN        runMaxBj');
for (const r of subGrid) {
  console.log(`   ${String(r.endN).padStart(9)}   ${r.runMaxBj.toFixed(4)}`);
}
console.log(`   earliest endN at which the running max reaches the plateau peak (within 1e-4): ` +
  `${subGrid.earliestReachN.n} of ${P5.endN} ` +
  `(${(100 * subGrid.earliestReachN.n / P5.endN).toFixed(1)}% of the window)`);

console.log('\n3. BOUNDED WINDOW EXTENSION past 95248 (same plateau-5 T)');
console.log(`   extended right sweep to endN=${extResult.extEnd} (plateau-6 end); skipped ${extResult.skippedDegenerate} degenerate (v<=0) terms`);
console.log(`   first degenerate term at endN~${extResult.firstDegenerateN} (smaller plateau-6 min gap)`);
console.log(`   max B_j strictly BEYOND the cut (endN>95248) = ${extResult.maxBeyondCut.toFixed(4)} at endN~${extResult.argBeyondN}`);
console.log(`   did the extension EXCEED the 6.4537 peak? ${extResult.exceededPeak}`);

const interior = peakSweep.label === 'left' || (right.argAt + 1) < P5.endN * 0.999;
console.log('\nVERDICT (measurement-only):');
if (!extResult.exceededPeak && interior) {
  console.log('   6.4537 is a GENUINE INTERIOR maximum of plateau 5s realised-elasticity kernel:');
  console.log('   the argmax sits strictly inside the window and extending the SAME-T sweep past');
  console.log('   endN=95248 does NOT exceed it. So the peak is NOT a coarse-plateau sampling');
  console.log('   artifact -- a finer endN grid re-confirms it rather than dissolving it.');
} else {
  console.log('   the plateau-5 peak keeps climbing at/after the cutoff -- UNDER-RESOLVED (drift reading).');
}
console.log('   BUT this is a per-plateau interior fact, NOT an N-uniform bound: it pins WHERE the');
console.log('   window max sits, not sup_{N,j} B_j across ALL plateaus. The imp-33250 dg2 obstruction');
console.log('   stays OPEN (still non-monotone across plateaus per imp-33309). No certified constant;');
console.log('   imp-3066 UNTOUCHED; Platt-Trudgian Lambda<=0.2 SOTA; NO QED.');
