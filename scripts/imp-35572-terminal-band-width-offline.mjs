// imp-35572 offline probe: does adding the imp-34862 early-transient second rate to the single-rate
// contraction map change the TERMINAL off-by-one band WIDTH (the direct-census resid = pred - measured = -1
// interval) across the reentry band [10^27.08, 10^37.17] by even one iterate? Standalone; replicates the map.

function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  const twoPi = 2 * Math.PI;
  let T = Math.max(twoPi * Math.E, (twoPi * N) / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

const C_C_PINNED = 0.125 * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi), imp-2642/imp-2643
const E_TRUNC_PT = 3.06e-5;
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
const EPS_FP = 2.3e-16;

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) { let N = seed; for (let i = 0; i < iters; i++) N = g(N); return N; }
const N_CROSS_FP = iterate(1e9, 200);
const R_CONTRACT = Math.abs((g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2);
const LN_INV_R = Math.log(1 / R_CONTRACT);
console.log('K_AMPL', K_AMPL, 'N_CROSS_FP', N_CROSS_FP, 'R', R_CONTRACT, 'lnInvR', LN_INV_R);

const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArgSingle = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;

function fitEarlyRateR0(seed, p) {
  let N = g(seed);
  const d0 = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  for (let i = 0; i < p; i++) N = g(N);
  const dp = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  return Math.pow(dp / d0, 1 / p);
}
function xArgTwoRate(seed, p) {
  const d0 = collapseDist(seed);
  const r0 = fitEarlyRateR0(seed, p);
  return p + (Math.log(d0 / EPS_FP) - p * Math.log(1 / r0)) / LN_INV_R;
}
const predSingle = (s) => 1 + Math.ceil(xArgSingle(s));
const predTwo = (s, p) => 1 + Math.ceil(xArgTwoRate(s, p));

function itersToFloorMeasured(seed, cap = 600) {
  let N = seed; let k = 0;
  while (k < cap) { N = g(N); k++; if (N === N_CROSS_FP) break; }
  return k;
}

const REENTRY_EXP = 27.084691;
const EXIT_EXP = 37.167107;

// (1) Dense grid across the band: how many seeds have n_two != n_single? max |n_two - n_single|?
function sweep(p) {
  let pts = 0, differ = 0, maxDelta = 0;
  let residSingleAllMinus1 = true, residTwoAllMinus1 = true;
  for (let e = REENTRY_EXP; e <= EXIT_EXP + 1e-9; e += 0.05) {
    const s = Math.pow(10, e);
    const nS = predSingle(s), nT = predTwo(s, p);
    const m = itersToFloorMeasured(s);
    pts++;
    const d = Math.abs(nT - nS);
    if (d > maxDelta) maxDelta = d;
    if (nT !== nS) differ++;
    if (nS - m !== -1) residSingleAllMinus1 = false;
    if (nT - m !== -1) residTwoAllMinus1 = false;
  }
  return { p, pts, differ, maxDelta, residSingleAllMinus1, residTwoAllMinus1 };
}
for (const p of [1, 2, 3]) console.log('sweep', sweep(p));

// (2) Locate the DIRECT-CENSUS (terminal Picard resid) band edges under single and two-rate.
function bisectExp(lo, hi, pred) {
  for (let i = 0; i < 120; i++) { const m = (lo + hi) / 2; if (pred(m)) hi = m; else lo = m; }
  return (lo + hi) / 2;
}
const residSingleAt = (e) => predSingle(Math.pow(10, e)) - itersToFloorMeasured(Math.pow(10, e));
const residTwoAt = (e, p) => predTwo(Math.pow(10, e), p) - itersToFloorMeasured(Math.pow(10, e));

const CENSUS_ONSET_SINGLE = bisectExp(15, 25, (e) => residSingleAt(e) === -1);
const CENSUS_EXIT_SINGLE = bisectExp(30, 45, (e) => residSingleAt(e) === 0);
console.log('single census onset/exit/width', CENSUS_ONSET_SINGLE, CENSUS_EXIT_SINGLE, CENSUS_EXIT_SINGLE - CENSUS_ONSET_SINGLE);

for (const p of [1, 2, 3]) {
  const onset = bisectExp(15, 25, (e) => residTwoAt(e, p) === -1);
  const exit = bisectExp(30, 45, (e) => residTwoAt(e, p) === 0);
  console.log(`two-rate p=${p} census onset/exit/width`, onset, exit, exit - onset,
    'edge-shift onset/exit(decades)', onset - CENSUS_ONSET_SINGLE, exit - CENSUS_EXIT_SINGLE);
}

// (3) The whole-number iterate-count difference at the band edges (confirm ceil coincides).
for (const e of [REENTRY_EXP, 30, 33, EXIT_EXP]) {
  const s = Math.pow(10, e);
  console.log(`e=${e} n_single=${predSingle(s)} n_two_p1=${predTwo(s, 1)} measured=${itersToFloorMeasured(s)}`);
}

// (4) Extend the two-rate census exit search well above 45 and print the resid ladder.
console.log('--- resid ladder above nominal exit ---');
for (let e = 36; e <= 60; e += 1) {
  const s = Math.pow(10, e);
  const m = itersToFloorMeasured(s);
  console.log(`e=${e} measured=${m} pred_single=${predSingle(s)} resid_s=${predSingle(s)-m} pred_two_p1=${predTwo(s,1)} resid_t=${predTwo(s,1)-m}`);
}
const exitTwoWide = bisectExp(37, 70, (e) => residTwoAt(e, 1) === 0);
console.log('two-rate p=1 census exit (wide search 37..70):', exitTwoWide);
