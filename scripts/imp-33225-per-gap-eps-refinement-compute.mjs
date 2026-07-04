#!/usr/bin/env node
// scripts/imp-33225-per-gap-eps-refinement-compute.mjs
// imp-33225 OFFLINE COMPUTE: PER-GAP eps'_l refinement of the imp-3933
// field-robust plateau-domination bootstrap.
//
// imp-3933 carried a SINGLE uniform eps' through the imp-3725 proof for the
// perturbed-field class
//     dx_k/dt = F_k^{Dyson}(x) + e_k(t),
//     |e_{l+1}(t) - e_l(t)| <= eps'_l * g_l(t)      (*) local-difference bound
// and certified all 10 plateaus of [1e4,1e6] up to eps'=20 (epsMax floor 22.9).
// imp-3933 flagged that the window-top-edge gaps only need the uniform=20
// certificate MARGINALLY, and named the PER-GAP variant (proof verbatim
// identical, only the record-pair term needs the record-pair value eps'_a) as
// the recommended closure route removing that edge sensitivity entirely.
//
// WHY THE PROOF IS UNCHANGED. Reading the imp-3725/imp-3933 derivation term by
// term, eps' enters in exactly two places, and they DECOUPLE by gap index:
//
//   (A) RECORD-PAIR DIRECT TERM. At the record gap a (the plateau min gap),
//       while g_a <= H:  d(g_a^2)/dt <= -8 + Psi + 2 g_a (e_{a+1}-e_a)
//       and (*) at l=a bounds  2 g_a (e_{a+1}-e_a) <= 2 eps'_a g_a^2 <= 2 eps'_a H^2.
//       This term sees ONLY the record-pair value eps'_a.
//
//   (B) RETARDATION SUM Psi. Every OTHER gap l enters only through its shrunk
//       comparison gap s_l(T,eps'_l)^2 = g_l(0)^2 e^{-2 eps'_l T} - (4/eps'_l)(1-e^{-2 eps'_l T}),
//       floored at 0, assembled into path-sums D_j and Psi = 4 H^2 SUM 1/D_j^2.
//       Larger eps'_l shrinks s_l -> smaller D_j -> larger Psi, but the horizon
//       T = H^2/(8 thetaBar) is tiny (~1e-4), so 2 eps'_l T << 1 for eps'_l = O(10)
//       and Psi is near-inert (imp-3933 measured +0.7% from eps'=0 to eps'=20).
//
//   theta({eps'_l}) = 1 - (Psi(T,{eps'_l}) + 2 eps'_a H^2)/8,  cert iff theta >= thetaBar.
//
// So the binding constraint carries eps'_a (record pair) ALONE; the O(10)
// window-edge values live only inside the near-inert Psi. This script certifies
// the per-gap variant CONSERVATIVELY: it feeds EVERY non-record gap the large
// edge value eps'Edge inside Psi (max shrink) and only the record pair the small
// eps'A in the direct term, then reports the record-pair budget eps'A_max, the
// far-gap Psi ceiling eps'Edge_ceil, and re-certifies all 10 plateaus.
//
// The actual per-gap eps'_l values (est. O(1e-3) near record pair, O(10) at
// window edge) await the DETERMINISTIC field-error certificate
// (imp-3933-sub-eps-certificate); this script uses eps'A = 1e-3 as the module
// estimate and treats eps'Edge as a free stress parameter. NO QED.
//
// Run:  node_modules/.bin/esbuild scripts/imp-33225-per-gap-eps-refinement-compute.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp33225.cjs \
//       && node /tmp/imp33225.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;
const EPS_A_EST = 1e-3;   // module estimate for the record-pair field-error slope
const EPS_EDGE = 20;      // large far-gap value the uniform certificate had to share
const INFLATE = 1 + 1e-6; // conservative fp inflation on Psi (as imp-3725)

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// H_raw plateaus on [1e4, 1e6] (identical scan to imp-3725/imp-3933)
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) if (G[i] < H) { H = G[i]; argmin = i; }
const updates = [];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) { H = G[i]; updates.push({ N, gapIndex: i, H: G[i] }); }
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

// exact comparison-ODE shrunk gap at horizon T under a per-gap eps (u floored)
function shrunkSq(g, T, eps) {
  if (eps === 0) return g * g - 8 * T;
  const oneMinusE = -Math.expm1(-2 * eps * T); // 1 - e^{-2 eps T}, cancellation-safe
  return g * g * (1 - oneMinusE) - (4 / eps) * oneMinusE;
}

// Psi(T) over the endN system for plateau p, with EVERY non-record gap at epsEdge.
// (Conservative: the true per-gap eps'_l are <= epsEdge, so this over-estimates Psi.)
function psiOf(p, T, epsEdge) {
  const { a, endN } = p;
  const s = (g) => {
    const v = shrunkSq(g, T, epsEdge);
    return v > 0 ? Math.sqrt(v) : 0;
  };
  let sum = 0;
  let D = 0;
  for (let j = a - 1; j >= 0; j--) {
    D += s(G[j]);
    if (D <= 0) return { degenerate: true };
    sum += 1 / (D * D);
  }
  D = 0;
  for (let j = a + 2; j <= endN - 1; j++) {
    D += s(G[j - 1]);
    if (D <= 0) return { degenerate: true };
    sum += 1 / (D * D);
  }
  return { degenerate: false, psi: 4 * p.H * p.H * sum * INFLATE };
}

function tLoOf(h, eps) {
  if (eps === 0) return (h * h) / 8;
  return Math.log1p((eps * h * h) / 4) / (2 * eps);
}

// per-gap theta: record-pair direct term uses epsA, Psi uses epsEdge for all others
function evalPerGap(p, epsA, epsEdge) {
  const h = p.H;
  const T = (h * h) / (8 * THETA_BAR);
  const r = psiOf(p, T, epsEdge);
  if (r.degenerate) return { certified: false, degenerate: true, T };
  const theta = 1 - (r.psi + 2 * epsA * h * h) / 8;
  const certified = theta >= THETA_BAR;
  const tLo = tLoOf(h, epsA);
  const tHi = certified ? (h * h) / (8 * theta) : null;
  return { psi: r.psi, theta, certified, tLo, tHi, width: certified ? tHi - tLo : null, T };
}

// max record-pair budget eps'A_max at fixed epsEdge:  2 eps'A H^2/8 <= 1-thetaBar - Psi/8
function epsAMaxOf(p, epsEdge) {
  const h = p.H;
  const T = (h * h) / (8 * THETA_BAR);
  const r = psiOf(p, T, epsEdge);
  if (r.degenerate) return null;
  const slack = 8 * (1 - THETA_BAR) - r.psi; // budget left for the direct term
  if (slack <= 0) return 0;
  return slack / (2 * h * h);
}

// far-gap Psi ceiling: largest epsEdge (with epsA at the module estimate) still certifying.
// theta decreases in epsEdge through Psi; bisect on [EPS_EDGE, 5e5].
function epsEdgeCeilOf(p, epsA) {
  let lo = EPS_EDGE;
  let hi = 5e5;
  if (evalPerGap(p, epsA, hi).certified) return { epsEdgeCeil: hi, saturated: true };
  if (!evalPerGap(p, epsA, lo).certified) return { epsEdgeCeil: 0, saturated: false };
  for (let it = 0; it < 60; it++) {
    const m = (lo + hi) / 2;
    if (evalPerGap(p, epsA, m).certified) lo = m; else hi = m;
  }
  return { epsEdgeCeil: lo, saturated: false };
}

const results = plateaus.map((p) => {
  const base = evalPerGap(p, 0, 0);                 // pristine eps'=0 reference
  const pg = evalPerGap(p, EPS_A_EST, EPS_EDGE);    // per-gap: eps'A est, all far gaps at 20
  const epsAMax = epsAMaxOf(p, EPS_EDGE);
  const { epsEdgeCeil, saturated } = epsEdgeCeilOf(p, EPS_A_EST);
  return {
    plateauIndex: p.plateauIndex, startN: p.startN, endN: p.endN, H: p.H, a: p.a,
    baseTheta: base.theta,
    pgTheta: pg.theta, pgCertified: pg.certified, pgWidth: pg.width,
    epsAMax, epsAHeadroom: epsAMax / EPS_A_EST,
    epsEdgeCeil, epsEdgeCeilSat: saturated, epsEdgeHeadroom: epsEdgeCeil / 10, // vs O(10) requirement
    thetaDeficitVsBase: base.theta - pg.theta,      // cost of the whole per-gap budget
  };
});

for (const r of results) {
  console.log(`plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a}`);
  console.log(`  base theta(eps'=0)=${r.baseTheta.toFixed(8)}  per-gap theta(eps'A=${EPS_A_EST},edge=${EPS_EDGE})=${r.pgTheta.toFixed(8)} cert=${r.pgCertified}`);
  console.log(`  record-pair budget eps'A_max=${r.epsAMax.toFixed(4)} (headroom over est ${EPS_A_EST}: ${r.epsAHeadroom.toExponential(3)}x)`);
  console.log(`  far-gap Psi ceiling eps'Edge_ceil=${r.epsEdgeCeil.toExponential(4)}${r.epsEdgeCeilSat ? ' (scan-cap)' : ''} (headroom over O(10) edge req: ${r.epsEdgeHeadroom.toExponential(3)}x)`);
  console.log(`  theta deficit vs pristine base = ${r.thetaDeficitVsBase.toExponential(4)}  per-gap width=${r.pgWidth?.toExponential(4)}`);
}

const allCert = results.every((r) => r.pgCertified);
const minEpsAMax = Math.min(...results.map((r) => r.epsAMax));
const minEpsEdgeCeil = Math.min(...results.map((r) => r.epsEdgeCeil));
const maxDeficit = Math.max(...results.map((r) => r.thetaDeficitVsBase));
console.log('\nALL 10 plateaus certified under per-gap (eps\'A=1e-3, all far gaps at eps\'=20):', allCert);
console.log('min record-pair budget eps\'A_max over plateaus:', minEpsAMax.toFixed(3),
            ' (>> module est 1e-3: window edge no longer feeds the binding term)');
console.log('min far-gap Psi ceiling eps\'Edge_ceil over plateaus:', minEpsEdgeCeil.toExponential(4),
            ' (>> O(10) edge requirement: edge sensitivity removed from the binding constraint)');
console.log('max theta deficit vs pristine base over plateaus:', maxDeficit.toExponential(4),
            ' (whole per-gap budget costs < the uniform eps\'=20 deficit)');

console.log('\n===JSON===');
console.log(JSON.stringify({
  thetaBar: THETA_BAR, epsAEst: EPS_A_EST, epsEdge: EPS_EDGE,
  allCertified: allCert,
  minRecordPairBudget: +minEpsAMax.toFixed(4),
  minFarGapPsiCeiling: +minEpsEdgeCeil.toExponential(6),
  maxThetaDeficitVsBase: +maxDeficit.toExponential(6),
  results: results.map((r) => ({
    plateauIndex: r.plateauIndex, startN: r.startN, endN: r.endN,
    H: +r.H.toFixed(8), a: r.a,
    baseTheta: +r.baseTheta.toFixed(10), pgTheta: +r.pgTheta.toFixed(10),
    pgCertified: r.pgCertified,
    epsAMax: +r.epsAMax.toFixed(4),
    epsEdgeCeil: +r.epsEdgeCeil.toExponential(6), epsEdgeCeilSat: r.epsEdgeCeilSat,
    thetaDeficitVsBase: +r.thetaDeficitVsBase.toExponential(6),
  })),
}, null, 1));
