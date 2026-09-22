#!/usr/bin/env node
// scripts/imp-3933-sub-eps-discrete-t0-audit.mjs
//
// AUDIT ATTACK on residual (i) of imp-3933-sub-eps-certificate:
// sg-33228-rvm-continuum-vs-discrete — replace the imp-33228 RvM-CONTINUUM
// PROXY for the realised field-Lipschitz constants eps'_l by
//   (D) EXACT discrete sums over every omitted zero PRESENT IN THE TABLE
//       (above-window indices endN..1e6-1, and all 1e6 mirror zeros -gamma_j), plus
//   (T) a RIGOROUS one-sided upper bound for zeros ABOVE the table top U,
//       using the unconditional Trudgian (2014) zero-counting bound
//         |N(T) - R(T)| <= Q(T) = 0.112 ln T + 0.278 ln ln T + 3.385 + 0.2/T,
//         R(T) = (T/2pi) ln(T/(2pi e)) + 7/8,
//       via Stieltjes integration by parts:
//         SUM_{gamma > U} f(gamma) = INT_U^inf (-f'(u)) (N(u) - N(U)) du
//                                 <= 2 f(U) Q(U) + INT_U^inf f(u) w(u) du,
//         w(u) = rho(u) + 0.112/u + 0.278/(u ln u),  rho(u) = ln(u/2pi)/(2pi)
//       (valid for any positive DECREASING kernel f; here f is each of
//        2/((u-a)(u-b)), 2/((u-b)^2), 2/((u+a)(u+b)), all decreasing above b).
//       The integral is bounded one-sidedly with dyadic monotone envelopes and
//       EXACT closed-form kernel antiderivatives (no free quadrature), plus an
//       analytic closed-form final tail beyond V >= max(2b, 1e12).
//
// It then RE-CERTIFIES the imp-33225 per-gap bootstrap with the MEASURED
// t=0 constants: record pair at eps'_a = discrete value, every far gap at
// eps'Edge = the rigorous window-max ENVELOPE bound
//   sup_l eps'_tail(l) <= E(b_top) = 2 SUM_{y omitted} 1/(y - b_top)^2 (+ tail),
//   sup_l eps'_mir(l)  <= mirror at gap 0,
// (monotone in b_l / a_l, so one computation dominates every window gap).
//
// HONEST SCOPE: this discharges ONLY the t = 0 leg (and only up to float
// rounding, inflated 1+1e-9; not formal interval arithmetic). It does NOT
// touch the displacement leg (extending |e_{l+1}-e_l| <= eps'_l g_l from t=0
// to t in [0,T]) nor the edge no-collision check, and plateau 9's window top
// coincides with the table top, so its edge envelope is DATA-LIMITED. NO QED.
//
// Run: node_modules/.bin/esbuild scripts/imp-3933-sub-eps-discrete-t0-audit.mjs \
//        --bundle --format=cjs --platform=node --outfile=/tmp/imp3933audit.cjs \
//      && node /tmp/imp3933audit.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const L = Z.length;                       // 1e6
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;
const INFLATE = 1 + 1e-9;                 // float-rounding inflation on assembled bounds
const PSI_INFLATE = 1 + 1e-6;             // conservative Psi inflation (as imp-3725/33225)
const TWO_PI = 2 * Math.PI;
const U_TOP = Z[L - 1];                   // table top ordinate

if (L !== N_MAX) throw new Error(`expected exactly 1e6 zeros, got ${L}`);

// gaps
const G = new Float64Array(L - 1);
for (let i = 0; i < L - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}`);
  G[i] = d;
}

// ---- plateaus: identical running-min scan to imp-3725/3933/33225/33228 ----
let Hrun = Infinity, argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) if (G[i] < Hrun) { Hrun = G[i]; argmin = i; }
const updates = [];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < Hrun) { Hrun = G[i]; updates.push({ N, gapIndex: i, H: G[i] }); }
}
const plateaus = [{
  plateauIndex: 0, startN: N_MIN,
  endN: updates.length ? updates[0].N - 1 : N_MAX,
  H: G.slice(0, N_MIN - 1).reduce((m, v) => Math.min(m, v), Infinity), a: argmin,
}];
updates.forEach((u, i) => {
  plateaus.push({
    plateauIndex: i + 1, startN: u.N,
    endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX,
    H: u.H, a: u.gapIndex,
  });
});

// ---- unconditional counting bounds (Trudgian 2014) ----
const Qbound = (T) => 0.112 * Math.log(T) + 0.278 * Math.log(Math.log(T)) + 3.385 + 0.2 / T;
const rho = (u) => Math.log(u / TWO_PI) / TWO_PI;
const wEnv = (u) => rho(u) + 0.112 / u + 0.278 / (u * Math.log(u)); // >= rho + Q' pointwise

// exact antiderivative pieces: INT f du over [x,y]
// fAB(u) = 2/((u-a)(u-b)), a<b<x:   (2/g) ln((u-b)/(u-a)),  g=b-a
const intAB = (a, b, x, y) => {
  const g = b - a;
  return (2 / g) * (Math.log((y - b) / (y - a)) - Math.log((x - b) / (x - a)));
};
// fSQ(u) = 2/((u-b)^2):             -2/(u-b)
const intSQ = (b, x, y) => 2 / (x - b) - 2 / (y - b);
// fMIR(u) = 2/((u+a)(u+b)), a<b:    (2/g) ln((u+a)/(u+b))
const intMIR = (a, b, x, y) => {
  const g = b - a;
  return (2 / g) * (Math.log((y + a) / (y + b)) - Math.log((x + a) / (x + b)));
};

// rigorous upper bound for SUM_{gamma > U} f(gamma), f positive decreasing on [U,inf):
//   <= 2 f(U) Q(U) + SUM_dyadic wMax_k * INT_k f du + analytic final tail
// kernelKind: 'AB' | 'SQ' | 'MIR' with params {a,b}
function tailAbove(kind, a, b, U) {
  const fAt = (u) => (kind === 'AB' ? 2 / ((u - a) * (u - b))
    : kind === 'SQ' ? 2 / ((u - b) * (u - b))
      : 2 / ((u + a) * (u + b)));
  const intF = (x, y) => (kind === 'AB' ? intAB(a, b, x, y)
    : kind === 'SQ' ? intSQ(b, x, y)
      : intMIR(a, b, x, y));
  let bound = 2 * fAt(U) * Qbound(U);
  // dyadic monotone envelope for INT_U^V f w du: rho increasing (take right end),
  // 0.112/u + 0.278/(u ln u) decreasing (take left end)
  let x = U;
  const V_TARGET = Math.max(2 * Math.abs(b), 1e12, 2 * U);
  while (x < V_TARGET) {
    const y = Math.min(2 * x, V_TARGET);
    const wMax = rho(y) + 0.112 / x + 0.278 / (x * Math.log(x));
    bound += wMax * intF(x, y);
    x = y;
  }
  const V = x;
  // analytic final tail beyond V: for AB/SQ kernels, u - b >= u/2 for u >= V >= 2b
  // so f <= 8/u^2; for MIR, f <= 2/u^2. INT_V^inf (c/u^2) w(u) du closed forms:
  //   INT ln(u/2pi)/u^2 = (ln(V/2pi)+1)/V ; INT 1/u^3 = 1/(2V^2); INT 1/(u^3 ln u) <= 1/(2 V^2 ln V)
  const c = kind === 'MIR' ? 2 : 8;
  bound += c * ((Math.log(V / TWO_PI) + 1) / (TWO_PI * V)
    + 0.112 / (2 * V * V) + 0.278 / (2 * V * V * Math.log(V)));
  return bound * INFLATE;
}

// exact in-table discrete sums (all terms positive; summed ascending magnitude irrelevant at 1e-10 rel)
function discreteAboveAB(a, b, fromIdx) {
  let s = 0;
  for (let j = L - 1; j >= fromIdx; j--) s += 1 / ((Z[j] - a) * (Z[j] - b));
  return 2 * s;
}
function discreteAboveSQ(b, fromIdx) {
  let s = 0;
  for (let j = L - 1; j >= fromIdx; j--) { const d = Z[j] - b; s += 1 / (d * d); }
  return 2 * s;
}
function discreteMirror(a, b) {
  let s = 0;
  for (let j = L - 1; j >= 0; j--) s += 1 / ((Z[j] + a) * (Z[j] + b));
  return 2 * s;
}

// ---- imp-3725/33225 bootstrap machinery (verbatim) ----
function shrunkSq(g, T, eps) {
  if (eps === 0) return g * g - 8 * T;
  const oneMinusE = -Math.expm1(-2 * eps * T);
  return g * g * (1 - oneMinusE) - (4 / eps) * oneMinusE;
}
function psiOf(p, T, epsEdge) {
  const { a, endN } = p;
  const s = (g) => { const v = shrunkSq(g, T, epsEdge); return v > 0 ? Math.sqrt(v) : 0; };
  let sum = 0, D = 0;
  for (let j = a - 1; j >= 0; j--) { D += s(G[j]); if (D <= 0) return null; sum += 1 / (D * D); }
  D = 0;
  for (let j = a + 2; j <= endN - 1; j++) { D += s(G[j - 1]); if (D <= 0) return null; sum += 1 / (D * D); }
  return 4 * p.H * p.H * sum * PSI_INFLATE;
}
const tLoOf = (h, eps) => (eps === 0 ? (h * h) / 8 : Math.log1p((eps * h * h) / 4) / (2 * eps));

// ---- per-plateau audit ----
const rows = plateaus.map((p) => {
  const { endN } = p;
  const aIdx = p.a;
  const aa = Z[aIdx], bb = Z[aIdx + 1];

  // (1) record-pair eps'_a, discrete-exact + rigorous tail
  const recInTable = endN < L ? discreteAboveAB(aa, bb, endN) : 0;
  const recTail = tailAbove('AB', aa, bb, U_TOP);
  const recMirIn = discreteMirror(aa, bb);
  const recMirTail = tailAbove('MIR', aa, bb, U_TOP);
  const epsA = (recInTable + recTail + recMirIn + recMirTail) * INFLATE;

  // (2) window-max envelope: sup_l eps'_l <= E_tail(b_top) + mirror(gap 0)
  const bTop = Z[endN - 1];
  const gBoundary = endN < L ? Z[endN] - Z[endN - 1] : null; // window-top to first omitted zero
  let envTail = null, edgeDataLimited = false;
  if (endN < L) {
    envTail = (discreteAboveSQ(bTop, endN) + tailAbove('SQ', 0, bTop, U_TOP)) * INFLATE;
  } else {
    edgeDataLimited = true; // plateau 9: window top == table top; envelope diverges without more zeros
  }
  const mir0 = (discreteMirror(Z[0], Z[1]) + tailAbove('MIR', Z[0], Z[1], U_TOP)) * INFLATE;
  const windowMax = envTail === null ? null : envTail + mir0;

  // exact top-gap eps' with the true (u-a)(u-b) kernel, for comparison with imp-33228
  let topGapEps = null;
  if (endN < L) {
    const at = Z[endN - 2], bt = Z[endN - 1];
    topGapEps = (discreteAboveAB(at, bt, endN) + tailAbove('AB', at, bt, U_TOP)
      + discreteMirror(at, bt) + tailAbove('MIR', at, bt, U_TOP)) * INFLATE;
  }

  // (3) per-gap re-certification with MEASURED t=0 constants
  const h = p.H, T = (h * h) / (8 * THETA_BAR);
  const epsEdgeUsed = windowMax === null ? null : windowMax;
  const psi = epsEdgeUsed === null ? null : psiOf(p, T, epsEdgeUsed);
  const theta = psi === null ? null : 1 - (psi + 2 * epsA * h * h) / 8;
  const certified = theta !== null && theta >= THETA_BAR;
  const tLo = tLoOf(h, epsA);
  const tHi = certified ? (h * h) / (8 * theta) : null;

  // record-pair budget at this epsEdge (imp-33225 formula)
  const epsAMax = psi === null ? null : (8 * (1 - THETA_BAR) - psi) / (2 * h * h);

  // (4) boundary no-collision numbers (necessary-condition style; NOT a proof)
  const boundarySurvivalRatio = gBoundary === null ? null : (gBoundary * gBoundary / 8) / T;

  return {
    plateauIndex: p.plateauIndex, startN: p.startN, endN, H: h, a: aIdx,
    epsA, recInTable, recTail, recMirIn, recMirTail,
    windowMax, envTail, mir0, topGapEps, edgeDataLimited,
    gBoundary, boundarySurvivalRatio,
    psi, theta, certified, epsAMax,
    tLo, tHi, width: certified ? tHi - tLo : null,
  };
});

for (const r of rows) {
  console.log(`plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a}`);
  console.log(`  record-pair eps'_a (discrete+rigorous tail) = ${r.epsA.toExponential(4)}`
    + `  [in-table ${r.recInTable.toExponential(3)} + tail<=${r.recTail.toExponential(3)}`
    + ` + mir ${r.recMirIn.toExponential(3)} + mirTail<=${r.recMirTail.toExponential(3)}]`);
  if (r.edgeDataLimited) {
    console.log('  window-max envelope: DATA-LIMITED (window top == table top; needs zeros above 1e6)');
  } else {
    console.log(`  window-max envelope sup_l eps'_l <= ${r.windowMax.toExponential(4)}`
      + `  (top-gap exact eps' = ${r.topGapEps.toExponential(4)}; mirror@gap0 = ${r.mir0.toExponential(3)})`);
    console.log(`  per-gap re-cert @ measured constants: Psi=${r.psi.toExponential(4)} theta=${r.theta.toFixed(8)}`
      + ` cert=${r.certified}  eps'A budget=${r.epsAMax.toFixed(3)} (headroom ${(r.epsAMax / r.epsA).toExponential(2)}x)`);
    console.log(`  width tHi-tLo = ${r.width.toExponential(4)}`);
  }
  if (r.gBoundary !== null) {
    console.log(`  boundary gap (top window zero -> first omitted) = ${r.gBoundary.toFixed(6)};`
      + ` survival ratio g_b^2/8 / T = ${r.boundarySurvivalRatio.toFixed(1)}x`);
  }
}

const closed = rows.filter((r) => !r.edgeDataLimited);
const allCert = closed.every((r) => r.certified);
console.log('\n=== SUMMARY (t=0 leg, discrete-exact + Trudgian tail) ===');
console.log('plateaus 0-8 per-gap certified at MEASURED t=0 constants:', allCert);
console.log('max record-pair eps\'_a:', Math.max(...rows.map((r) => r.epsA)).toExponential(4));
console.log('max window-max envelope (0-8):', Math.max(...closed.map((r) => r.windowMax)).toExponential(4));
console.log('min eps\'A headroom (0-8):', Math.min(...closed.map((r) => r.epsAMax / r.epsA)).toExponential(3), 'x');
console.log('min boundary survival ratio:', Math.min(...rows.filter((r) => r.boundarySurvivalRatio !== null)
  .map((r) => r.boundarySurvivalRatio)).toFixed(1), 'x');
console.log('plateau 9 edge: DATA-LIMITED (table ends at window top); record-pair still bounded:',
  rows[9].epsA.toExponential(4));

// ---- RE-ANCHORING PASS ------------------------------------------------------
// Finding above: at the plateau-boundary window sizes (N = endN), the first
// omitted zero is the OTHER HALF OF THE NEXT RECORD PAIR (distance H_{p+1}),
// so (a) the realised top-edge eps' is 49..507 (not the imp-33228 half-mean-
// spacing estimate ~6.7), and (b) the boundary virtual gap collapses at
// ~0.4-0.9 x the horizon T: the true flow leaves the field-Lipschitz class (*)
// BEFORE T at those window sizes. FIX: the transfer anchor is a FREE CHOICE of
// window size N' within the plateau (H, record pair unchanged for all
// N' in [startN, endN]); pick N' maximizing the boundary gap G[N'-1] and
// re-certify everything there.
console.log('\n=== RE-ANCHORED WINDOWS (boundary gap maximized within each plateau) ===');
const reanchored = plateaus.map((p) => {
  const h = p.H, T = (h * h) / (8 * THETA_BAR);
  // choose N' in [startN, min(endN, L-1)] maximizing boundary gap G[N'-1]
  let bestN = -1, bestG = -1;
  const hiN = Math.min(p.endN, L - 1);
  for (let N = p.startN; N <= hiN; N++) {
    if (G[N - 1] > bestG) { bestG = G[N - 1]; bestN = N; }
  }
  const Np = bestN, gB = bestG;
  const survivalRatio = (gB * gB / 8) / T;
  // record pair (same a, H) — recompute eps'_a with omitted set starting at Np
  const aa = Z[p.a], bbz = Z[p.a + 1];
  const epsA = (discreteAboveAB(aa, bbz, Np) + tailAbove('AB', aa, bbz, U_TOP)
    + discreteMirror(aa, bbz) + tailAbove('MIR', aa, bbz, U_TOP)) * INFLATE;
  // window-max envelope at the new top
  const bTop = Z[Np - 1];
  const envTail = (discreteAboveSQ(bTop, Np) + tailAbove('SQ', 0, bTop, U_TOP)) * INFLATE;
  const mir0b = (discreteMirror(Z[0], Z[1]) + tailAbove('MIR', Z[0], Z[1], U_TOP)) * INFLATE;
  const windowMax = envTail + mir0b;
  // exact top-gap eps' at the re-anchored window
  const at = Z[Np - 2], bt = Z[Np - 1];
  const topGapEps = (discreteAboveAB(at, bt, Np) + tailAbove('AB', at, bt, U_TOP)
    + discreteMirror(at, bt) + tailAbove('MIR', at, bt, U_TOP)) * INFLATE;
  // per-gap re-certification over the N'-window
  const pw = { a: p.a, endN: Np, H: h };
  const psi = psiOf(pw, T, windowMax);
  const theta = psi === null ? null : 1 - (psi + 2 * epsA * h * h) / 8;
  const certified = theta !== null && theta >= THETA_BAR;
  const tLo = tLoOf(h, epsA);
  const tHi = certified ? (h * h) / (8 * theta) : null;
  return {
    plateauIndex: p.plateauIndex, NPrime: Np, gBoundary: gB,
    survivalRatio, epsA, windowMax, topGapEps,
    psi, theta, certified, width: certified ? tHi - tLo : null,
  };
});
for (const r of reanchored) {
  console.log(`plateau ${r.plateauIndex} N'=${r.NPrime}  boundary gap=${r.gBoundary.toFixed(4)}  `
    + `survival ratio=${r.survivalRatio.toFixed(0)}x`);
  console.log(`  eps'_a=${r.epsA.toExponential(4)}  sup_l eps'_l <= ${r.windowMax.toExponential(4)}  `
    + `top-gap eps'=${r.topGapEps.toExponential(4)}`);
  console.log(`  Psi=${r.psi.toExponential(4)} theta=${r.theta.toFixed(8)} cert=${r.certified}  `
    + `width=${r.width === null ? 'n/a' : r.width.toExponential(4)}`);
}
const allReCert = reanchored.every((r) => r.certified);
const minSurvival = Math.min(...reanchored.map((r) => r.survivalRatio));
const maxWindowMaxRe = Math.max(...reanchored.map((r) => r.windowMax));
console.log('\nALL 10 re-anchored windows certified:', allReCert,
  ' min boundary survival ratio:', minSurvival.toFixed(0), 'x',
  ' max window envelope:', maxWindowMaxRe.toExponential(3));

console.log('\n===JSON===');
console.log(JSON.stringify({
  thetaBar: THETA_BAR,
  allCertified0to8: allCert,
  rows: rows.map((r) => ({
    plateauIndex: r.plateauIndex, startN: r.startN, endN: r.endN, H: +r.H.toFixed(8), a: r.a,
    epsA: +r.epsA.toExponential(6),
    windowMax: r.windowMax === null ? null : +r.windowMax.toExponential(6),
    topGapEps: r.topGapEps === null ? null : +r.topGapEps.toExponential(6),
    edgeDataLimited: r.edgeDataLimited,
    gBoundary: r.gBoundary === null ? null : +r.gBoundary.toFixed(8),
    boundarySurvivalRatio: r.boundarySurvivalRatio === null ? null : +r.boundarySurvivalRatio.toFixed(2),
    psi: r.psi === null ? null : +r.psi.toExponential(6),
    theta: r.theta === null ? null : +r.theta.toFixed(10),
    certified: r.certified,
    epsAMax: r.epsAMax === null ? null : +r.epsAMax.toFixed(4),
    width: r.width === null ? null : +r.width.toExponential(6),
  })),
}, null, 1));

// ---- BAD-ANCHOR CENSUS: window sizes N whose boundary gap is too tight ------
// The true flow survives the horizon at window size N only if the boundary
// virtual gap G[N-1] cannot collapse before tHi ~ H(N)^2/(8*0.99), i.e. needs
// G[N-1] >= H(N)/sqrt(0.99) (necessary-condition census; safety factor 2 also shown).
{
  let h = Infinity;
  for (let i = 0; i < N_MIN - 1; i++) if (G[i] < h) h = G[i];
  let bad = 0, bad2x = 0, total = 0;
  for (let N = N_MIN; N <= N_MAX - 1; N++) {
    if (G[N - 2] < h) h = G[N - 2];
    total++;
    const ratio = 0.99 * (G[N - 1] / h) * (G[N - 1] / h);
    if (ratio < 1) bad++;
    if (ratio < 4) bad2x++;
  }
  console.log(`\nBAD-ANCHOR CENSUS over N in [1e4, 1e6): boundary-collapse-before-horizon (ratio<1): ${bad} of ${total}`
    + ` (${(100 * bad / total).toExponential(2)}%); marginal (ratio<4): ${bad2x} (${(100 * bad2x / total).toFixed(4)}%)`);
}
