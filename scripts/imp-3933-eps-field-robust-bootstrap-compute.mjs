#!/usr/bin/env node
// scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs
// imp-3933 OFFLINE COMPUTE: eps'-FIELD-ROBUST plateau-domination bootstrap.
//
// Extends the imp-3725 per-plateau gap-domination certificate from the pure
// backward-Dyson field to the PERTURBED-FIELD class
//     dx_k/dt = F_k^{Dyson}(x) + e_k(t),
//     |e_{l+1}(t) - e_l(t)| <= eps' * g_l(t)   (local-difference / Lipschitz bound)
// with the SAME initial data (the zero table). Carrying eps' through the
// imp-3725 proof EXACTLY:
//
//   gap identity:  d(g_l^2)/dt = -8 + 4 g_l^2 * SUM_pos + 2 g_l (e_{l+1}-e_l)
//   (LOWER)  d(g_l^2)/dt >= -8 - 2 eps' g_l^2. Comparison ODE
//            u' = -8 - 2 eps' u, u(0)=g0^2 has the exact solution
//            u(t) = g0^2 e^{-2 eps' t} - (4/eps')(1 - e^{-2 eps' t}),
//            hitting 0 at t0(g0) = ln(1 + eps' g0^2/4)/(2 eps'), increasing
//            in g0. Hence t_c >= tLo(eps') = ln(1 + eps' H^2/4)/(2 eps').
//   (UPPER)  frozen shrunk gaps use the SAME comparison solution at the
//            horizon T = H^2/(8 thetaBar):
//            s_l(T,eps')^2 = max(g_l(0)^2 e^{-2 eps' T} - (4/eps')(1-e^{-2 eps' T}), 0),
//            D_j(T,eps') = path-sum of s_l,  Psi(T,eps') = 4 H^2 SUM 1/D_j^2,
//            and while g_a <= H:
//            d(g_a^2)/dt <= -8 + Psi(T,eps') + 2 eps' H^2 = -8 theta(eps'),
//            theta(eps') = 1 - (Psi(T,eps') + 2 eps' H^2)/8.
//            If theta(eps') >= thetaBar (self-consistency H^2/(8 theta) <= T):
//            t_c <= tHi(eps') = H^2/(8 theta(eps')).
//
// Every quantity is an INITIAL-DATA functional of the zero table: no flow
// integration, no Gronwall, no W_1. Outputs per plateau: the enclosure at an
// eps' grid, the max certifiable eps' (theta(eps') = thetaBar bisection), and
// the field-channel modulus slope (width(1) - width(0)).
//
// Run:  node_modules/.bin/esbuild scripts/imp-3933-eps-field-robust-bootstrap-compute.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp3933.cjs \
//       && node /tmp/imp3933.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;
const EPS_GRID = [0, 0.25, 1, 4, 10, 20];
const INFLATE = 1 + 1e-6; // conservative fp inflation on Psi (as imp-3725)

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// H_raw plateaus on [1e4, 1e6] (identical scan to imp-3725)
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) if (G[i] < H) { H = G[i]; argmin = i; }
const updates = [];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) { H = G[i]; updates.push({ N, gapIndex: i, H: G[i] }); }
}
const plateaus = [{ plateauIndex: 0, startN: N_MIN, endN: updates.length ? updates[0].N - 1 : N_MAX, H: G.slice(0, N_MIN - 1).reduce((m, v) => Math.min(m, v), Infinity), a: argmin }];
plateaus[0].H = plateaus[0].H; // anchor
updates.forEach((u, i) => {
  plateaus.push({
    plateauIndex: i + 1,
    startN: u.N,
    endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX,
    H: u.H,
    a: u.gapIndex,
  });
});

// exact comparison-ODE shrunk gap at horizon T under eps' (u may be negative -> floored)
function shrunkSq(g, T, eps) {
  if (eps === 0) return g * g - 8 * T;
  const oneMinusE = -Math.expm1(-2 * eps * T); // 1 - e^{-2 eps T}, cancellation-safe
  return g * g * (1 - oneMinusE) - (4 / eps) * oneMinusE;
}

// Psi(T, eps') over the endN system for plateau p
function psiOf(p, T, eps) {
  const { a, endN } = p;
  const s = (g) => {
    const v = shrunkSq(g, T, eps);
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

function evalAt(p, eps) {
  const h = p.H;
  const T = (h * h) / (8 * THETA_BAR);
  const r = psiOf(p, T, eps);
  if (r.degenerate) return { eps, certified: false, degenerate: true };
  const theta = 1 - (r.psi + 2 * eps * h * h) / 8;
  const certified = theta >= THETA_BAR;
  const tLo = tLoOf(h, eps);
  const tHi = certified ? (h * h) / (8 * theta) : null;
  return {
    eps,
    psi: r.psi,
    theta,
    certified,
    tLo,
    tHi,
    width: certified ? tHi - tLo : null,
  };
}

function epsMaxOf(p) {
  // bisect theta(eps) = THETA_BAR on [0, 4000]; theta strictly decreasing in eps
  let lo = 0;
  let hi = 4000;
  if (evalAt(p, hi).certified) return { epsMax: hi, saturatedScanCap: true };
  for (let it = 0; it < 60; it++) {
    const m = (lo + hi) / 2;
    if (evalAt(p, m).certified) lo = m; else hi = m;
  }
  return { epsMax: lo, saturatedScanCap: false };
}

const results = plateaus.map((p) => {
  const grid = EPS_GRID.map((e) => evalAt(p, e));
  const { epsMax, saturatedScanCap } = epsMaxOf(p);
  const w0 = grid[0].width;
  const w1 = grid.find((r) => r.eps === 1).width;
  return {
    plateauIndex: p.plateauIndex,
    startN: p.startN,
    endN: p.endN,
    H: p.H,
    a: p.a,
    thetaBar: THETA_BAR,
    grid,
    epsMax,
    saturatedScanCap,
    cFieldSlope: w1 !== null && w0 !== null ? w1 - w0 : null, // (width(1)-width(0))/1
  };
});

for (const r of results) {
  console.log(`plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a}`);
  for (const g of r.grid) {
    console.log(`  eps'=${g.eps}: psi=${g.psi?.toExponential(4)} theta=${g.theta?.toFixed(8)} cert=${g.certified} tLo=${g.tLo?.toExponential(6)} tHi=${g.tHi?.toExponential(6)} width=${g.width?.toExponential(4)}`);
  }
  console.log(`  epsMax(thetaBar=0.99)=${r.epsMax.toFixed(3)} cFieldSlope=${r.cFieldSlope?.toExponential(4)}`);
}

const allCert20 = results.every((r) => r.grid.every((g) => g.certified));
const minEpsMax = Math.min(...results.map((r) => r.epsMax));
const maxSlope = Math.max(...results.map((r) => r.cFieldSlope));
console.log('\nALL grid rows (up to eps\'=20) certified:', allCert20);
console.log('min epsMax over plateaus:', minEpsMax.toFixed(3), ' max cFieldSlope:', maxSlope.toExponential(4));

console.log('\n===JSON===');
console.log(JSON.stringify({
  thetaBar: THETA_BAR,
  epsGrid: EPS_GRID,
  results: results.map((r) => ({
    plateauIndex: r.plateauIndex,
    startN: r.startN,
    endN: r.endN,
    H: +r.H.toFixed(8),
    a: r.a,
    epsMax: +r.epsMax.toFixed(4),
    saturatedScanCap: r.saturatedScanCap,
    cFieldSlope: +r.cFieldSlope.toExponential(6),
    grid: r.grid.map((g) => ({
      eps: g.eps,
      psi: +g.psi.toExponential(8),
      theta: +g.theta.toFixed(10),
      tLo: +g.tLo.toExponential(8),
      tHi: +g.tHi.toExponential(8),
      width: +g.width.toExponential(8),
    })),
  })),
}, null, 1));
