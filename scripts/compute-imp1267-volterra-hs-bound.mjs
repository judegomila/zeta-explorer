#!/usr/bin/env node
// imp-1267: Hilbert-Schmidt upper bound for ||V_{a,Phi}|| on L^2([0, infty)).
//
// Kernel:    k_{a,Phi}(x, y) = Phi(x) Phi(y) sinh(a(x - y)) * 1_{0 <= y <= x}
//
// HS bound:  ||V||_op <= ||V||_HS = (int_0^infty int_0^x |k|^2 dy dx)^{1/2}
//
// Closed-form bound (Cauchy-Schwarz on the sinh-term):
//
//   For 0 <= y <= x: sinh(a(x-y)) <= sinh(ax).
//   => HS^2 <= [int_0^infty Phi(y)^2 dy] * [int_0^infty Phi(x)^2 sinh^2(ax) dx]
//           = I_0 * J_a
//
// where I_0 = ||Phi||_{L^2(R_+)}^2,
//       J_a = int_0^infty Phi(x)^2 sinh^2(ax) dx.
//
// We compute (i) the EXACT HS integral via a fine quadrature, and (ii) the
// analytical bound I_0 * J_a. (i) should match the empirical op-norm from
// imp-1240 within a small constant factor; (ii) should be larger but well
// below 1.
//
// Numerical method:
//   - Truncate [0, infty) to [0, U_MAX] where Phi(u)^2 < 1e-300 (super-exp decay).
//     u = 2 already gives Phi(2)^2 ~ exp(-2 pi e^8) ~ 10^{-2600} -- negligible.
//     We use U_MAX = 4 with N_QUAD = 4000 midpoint nodes (h = 1e-3).
//   - For each (U, a) pair from the imp-1240 grid, compute:
//       hs_exact(a, U)     = sqrt(int_0^U int_0^x |k|^2 dy dx)         (on [0,U])
//       hs_bound_inf(a)    = sqrt(I_0_inf * J_a_inf)                    (analytical)
//       hs_bound_window(a, U) = sqrt(I_0(U) * J_a(U))                   (truncated)

import { performance } from 'node:perf_hooks';

// ── de Bruijn-Newman Phi kernel ─────────────────────────────────────────────
const N_PHI = 10;
function Phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const term =
      (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
      Math.exp(-Math.PI * n2 * e4u);
    sum += term;
  }
  return sum;
}

// ── Integrals on [0, U_INF] -- "infinity" for Phi ───────────────────────────
const U_INF = 4.0;
const N_INF = 40000; // h = 1e-4 -- very fine; Phi is concentrated near zero
const H_INF = U_INF / N_INF;

// Precompute Phi(t_i)^2 on the fine grid for I_0_inf and J_a_inf.
const phi2 = new Float64Array(N_INF);
const t_inf = new Float64Array(N_INF);
for (let i = 0; i < N_INF; i++) {
  t_inf[i] = (i + 0.5) * H_INF;
  const p = Phi(t_inf[i]);
  phi2[i] = p * p;
}

function I0_inf() {
  let s = 0;
  for (let i = 0; i < N_INF; i++) s += phi2[i];
  return s * H_INF;
}

function Ja_inf(a) {
  let s = 0;
  for (let i = 0; i < N_INF; i++) {
    const sh = Math.sinh(a * t_inf[i]);
    s += phi2[i] * sh * sh;
  }
  return s * H_INF;
}

// ── HS integral on [0, U] x [0, x] using midpoint quadrature ────────────────
// HS^2(a, U) = sum_i sum_{j<=i} h^2 * Phi(t_i)^2 * Phi(t_j)^2 * sinh^2(a*(t_i - t_j))
// (using y <= x convention; j indexes y, i indexes x).
function hsSquaredWindow(a, U, N) {
  const h = U / N;
  const tt = new Float64Array(N);
  const pp = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    tt[i] = (i + 0.5) * h;
    const p = Phi(tt[i]);
    pp[i] = p * p;
  }
  let s = 0;
  for (let i = 0; i < N; i++) {
    const ti = tt[i];
    const pi = pp[i];
    let inner = 0;
    for (let j = 0; j <= i; j++) {
      const dt = ti - tt[j];
      const sh = Math.sinh(a * dt);
      inner += pp[j] * sh * sh;
    }
    s += pi * inner;
  }
  return s * h * h;
}

// HS truncated-bound: I_0(U) * J_a(U) where the integrals are taken over [0, U].
function I0Window(U, N) {
  const h = U / N;
  let s = 0;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) * h;
    const p = Phi(t);
    s += p * p;
  }
  return s * h;
}

function JaWindow(a, U, N) {
  const h = U / N;
  let s = 0;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) * h;
    const p = Phi(t);
    const sh = Math.sinh(a * t);
    s += p * p * sh * sh;
  }
  return s * h;
}

// ── Compute for the imp-1240 grid ───────────────────────────────────────────
const U_GRID = [1, 2, 5, 10, 20];
const A_GRID = [0.5, 0.2, 0.1, 0.05, 0.025];

// Empirical op-norm from imp-1240 for comparison.
const IMP1240 = new Map();
for (const row of [
  { U: 1, a: 0.5, norm: 0.00018608612344092002 },
  { U: 1, a: 0.2, norm: 0.00007440659997048165 },
  { U: 1, a: 0.1, norm: 0.00003720131150451293 },
  { U: 1, a: 0.05, norm: 0.000018600407207054478 },
  { U: 1, a: 0.025, norm: 0.000009300172535842251 },
  { U: 2, a: 0.5, norm: 0.0001855277466889771 },
  { U: 2, a: 0.2, norm: 0.0000741833801910759 },
  { U: 2, a: 0.1, norm: 0.000037089710961388445 },
  { U: 2, a: 0.05, norm: 0.000018544608103717918 },
  { U: 2, a: 0.025, norm: 0.000009272273130199163 },
  { U: 5, a: 0.5, norm: 0.00018173409446356508 },
  { U: 5, a: 0.2, norm: 0.0000726668313474798 },
  { U: 5, a: 0.1, norm: 0.000036331501652223323 },
  { U: 5, a: 0.05, norm: 0.000018165511587559465 },
  { U: 5, a: 0.025, norm: 0.00000908272588940248 },
  { U: 10, a: 0.5, norm: 0.0001690714868120457 },
  { U: 10, a: 0.2, norm: 0.00006760488286871405 },
  { U: 10, a: 0.1, norm: 0.00003380074834857395 },
  { U: 10, a: 0.05, norm: 0.0000169001625506353 },
  { U: 10, a: 0.025, norm: 0.0000084500548227384 },
  { U: 20, a: 0.5, norm: 0.00011424877526521004 },
  { U: 20, a: 0.2, norm: 0.00004568172950877526 },
  { U: 20, a: 0.1, norm: 0.000022839594999986143 },
  { U: 20, a: 0.05, norm: 0.000011419638786321353 },
  { U: 20, a: 0.025, norm: 0.0000057097995541275935 },
]) {
  IMP1240.set(`${row.U},${row.a}`, row.norm);
}

const t0 = performance.now();
console.error('# imp-1267: computing I_0 and J_a on [0, U_INF=4] with N_INF=40000');
const I0inf = I0_inf();
console.error(`#   I_0_inf = ${I0inf.toExponential(8)}`);

const rows = [];
for (const U of U_GRID) {
  // Per-U discretization: match imp-1240 grid spacing.
  // imp-1240 used N=200 for U in {1, 2, 5, 10, 20}, but we want a HIGHER
  // resolution since HS is more sensitive to fine structure.
  const N = Math.max(400, 200 * U); // U=1->400, U=2->400, U=5->1000, U=10->2000, U=20->4000
  const I0_U = I0Window(U, N);
  for (const a of A_GRID) {
    const tStart = performance.now();
    const Ja_U = JaWindow(a, U, N);
    const Ja_inf_val = Ja_inf(a);
    const hsBoundWindow = Math.sqrt(I0_U * Ja_U);
    const hsBoundInf = Math.sqrt(I0inf * Ja_inf_val);
    // Exact HS integral via O(N^2) midpoint quadrature.
    // For U=20, N=4000: 4000^2 = 16M ops per (a, U) — affordable.
    const hs2 = hsSquaredWindow(a, U, N);
    const hsExact = Math.sqrt(hs2);
    const opNorm = IMP1240.get(`${U},${a}`);
    rows.push({
      U,
      a,
      N,
      I0_window: I0_U,
      Ja_window: Ja_U,
      Ja_inf: Ja_inf_val,
      hs_bound_window: hsBoundWindow,
      hs_bound_inf: hsBoundInf,
      hs_exact_window: hsExact,
      op_norm_imp1240: opNorm,
      ratio_hs_bound_to_op: hsBoundInf / opNorm,
      ratio_hs_exact_to_op: hsExact ? hsExact / opNorm : null,
      exceedsOne: hsBoundInf > 1,
    });
    const dt = performance.now() - tStart;
    console.error(
      `  U=${U.toString().padStart(3)} N=${N.toString().padStart(5)} a=${a.toFixed(3)}  HS_bound=${hsBoundInf.toExponential(4)}  HS_exact=${hsExact?.toExponential(4) ?? 'skipped'}  op=${opNorm.toExponential(4)}  HS/op=${(hsBoundInf / opNorm).toFixed(2)}  (${dt.toFixed(0)} ms)`
    );
  }
}

const dtAll = performance.now() - t0;
console.error(`# total ${dtAll.toFixed(0)} ms`);

// Linearity-in-a check at fixed U=1:
const aFixed = A_GRID.map((a) => ({
  a,
  hs_bound_inf: rows.find((r) => r.U === 1 && r.a === a).hs_bound_inf,
}));
const linRatios = [];
for (let i = 1; i < aFixed.length; i++) {
  linRatios.push({
    a_lo: aFixed[i].a,
    a_hi: aFixed[i - 1].a,
    a_ratio: aFixed[i - 1].a / aFixed[i].a,
    hs_ratio: aFixed[i - 1].hs_bound_inf / aFixed[i].hs_bound_inf,
  });
}

const summary = {
  generatedAt: new Date().toISOString(),
  I0_inf: I0inf,
  U_INF,
  N_INF,
  rows,
  linearity_in_a: linRatios,
  worst_hs_bound: Math.max(...rows.map((r) => r.hs_bound_inf)),
  hs_bound_le_1: rows.every((r) => r.hs_bound_inf < 1),
  hs_bound_le_001: rows.every((r) => r.hs_bound_inf < 0.01),
  hs_dominates_op: rows.every((r) => r.hs_bound_inf >= r.op_norm_imp1240),
};

console.log(JSON.stringify(summary, null, 2));
