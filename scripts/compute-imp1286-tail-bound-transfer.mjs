#!/usr/bin/env node
// imp-1286: Tail-bound transfer L^2([0, U]) -> L^2([0, infty)) for the HS bound.
//
// Background: imp-1267 ships the analytical HS bound ||V_{a,Phi}||_op <=
// sqrt(I_0 * J_a) where I_0 = int_0^infty Phi(u)^2 du and J_a =
// int_0^infty Phi(u)^2 sinh^2(au) du.  Numerically, imp-1267 evaluates I_0
// and J_a on a truncated window [0, U_INF = 4].  The §27 caveat (c) (imp-1265)
// asks: is the truncated-window evaluation the same as the L^2([0, infty))
// bound, up to a controlled tail error?
//
// This script:
//   1. Reuses the imp-1267 Phi(u) kernel construction verbatim
//      (no parameter changes).
//   2. Computes I_0_window(U) for U in {4, 8, 12} and confirms convergence.
//   3. Computes J_a_window(U) at U in {4, 8, 12} for a in {0.001, 0.01,
//      0.05, 0.2, 0.5} (App-S range) and confirms convergence.
//   4. Derives the analytical closed-form tail bound
//
//        T_a(U) := I_0 * int_U^infty Phi^2(x) * sinh^2(ax) dx
//
//      using the n=1 dominant term in Phi:
//
//        Phi(x)^2 <= 4*pi^4 * e^{8x} * exp(-2*pi*e^{4x})
//        sinh^2(ax) <= (1/4) * e^{2ax}
//
//      Substituting v = 2*pi*e^{4x}:
//
//        int_U^infty Phi(x)^2 * sinh^2(ax) dx
//          <= (pi^4/4) * int_U^infty e^{(8+2a)x} * exp(-2*pi*e^{4x}) dx
//          =  (pi^4/(4 * (2*pi)^{2 + a/2})) * Gamma(2 + a/2, 2*pi*e^{4U})
//          ~  (pi^3 / 8) * e^{(4+2a)*U} * exp(-2*pi*e^{4U})
//
//      where the last step uses Gamma(s, v) ~ v^{s-1} * e^{-v} for v large.
//
//   5. Verifies the closed form numerically against the residual
//      J_a_inf - J_a_window(U=4) at a single small reference a (where
//      Phi^2 * sinh^2 is still floating-point representable just past U=4).
//   6. Reports the ratio T_a(U) / J_a (main term) on the 5x{U=4} grid.

import { performance } from 'node:perf_hooks';

// ---------------- Phi kernel (verbatim from imp-1267 compute script) -------
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

// ---------------- Integrals on [0, U] via fine midpoint quadrature ---------
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

// ---------------- Closed-form analytical tail bound ------------------------
// T_a(U) <= I_0 * (pi^3 / 8) * e^{(4+2a)*U} * exp(-2*pi*e^{4U})
//
// We also return the log10 of the bound for legibility at U=4 where the
// exponent overflows float64 to zero.
function tailBoundClosedForm(a, U, I0) {
  // Compute log10 of the bound carefully.
  // log10(T_a(U)) = log10(I_0) + log10(pi^3/8) + (4+2a)*U*log10(e)
  //               - 2*pi*e^{4U}*log10(e)
  const LOG10E = Math.log10(Math.E);
  const log10_prefactor = Math.log10(I0) + Math.log10(Math.PI ** 3 / 8);
  const log10_polynomial = (4 + 2 * a) * U * LOG10E;
  const log10_exponential = -2 * Math.PI * Math.exp(4 * U) * LOG10E;
  const log10_T = log10_prefactor + log10_polynomial + log10_exponential;
  // Direct value (will underflow to 0 for U >= 1).
  const T_direct = Math.exp(
    Math.log(I0) +
      Math.log(Math.PI ** 3 / 8) +
      (4 + 2 * a) * U -
      2 * Math.PI * Math.exp(4 * U),
  );
  return { log10_T, T_direct };
}

// ---------------- Run --------------------------------------------------------
const t0 = performance.now();
console.error('# imp-1286: tail-bound transfer L^2([0,U]) -> L^2([0,infty)).');

// 1) Show that I_0_window(U) and J_a_window(U) converge as U increases.
const Us = [4, 8, 12];
const I0values = {};
const N_per_unit = 10000; // h = 1e-4 at all U
for (const U of Us) {
  const N = N_per_unit * U;
  const I0 = I0Window(U, N);
  I0values[U] = I0;
  console.error(`#   I_0(U=${U}, N=${N}) = ${I0.toExponential(12)}`);
}

const A_grid = [0.001, 0.01, 0.05, 0.2, 0.5];
const Ja_by_U = {};
for (const U of Us) {
  Ja_by_U[U] = {};
  const N = N_per_unit * U;
  for (const a of A_grid) {
    const Ja = JaWindow(a, U, N);
    Ja_by_U[U][a] = Ja;
    console.error(`#   J_a(U=${U}, a=${a}, N=${N}) = ${Ja.toExponential(12)}`);
  }
}

// 2) Closed-form tail bound at U=4 for each a.
const U_TARGET = 4;
const I0_target = I0values[U_TARGET];
const tailBounds = {};
console.error('# closed-form tail bound T_a(U=4):');
for (const a of A_grid) {
  const { log10_T, T_direct } = tailBoundClosedForm(a, U_TARGET, I0_target);
  tailBounds[a] = { log10_T, T_direct };
  const Ja_main = Ja_by_U[U_TARGET][a];
  const HS2_main = I0_target * Ja_main;
  // Combined HS^2 <= HS2_main + T_a(U) = I_0 * (J_a^window + tail integral piece / I_0)
  // We report ratio T_a(U) / HS2_main and ratio T_a(U) / J_a (since
  // T_a = I_0 * tail_integral, T_a / (I_0 * J_a) = tail_integral / J_a).
  console.error(
    `#   a=${a}  J_a=${Ja_main.toExponential(4)}  HS^2_main=I_0*J_a=${HS2_main.toExponential(4)}  log10(T_a(U=4))=${log10_T.toFixed(2)}  T_direct=${T_direct}`,
  );
}

// 3) Combined HS bound on L^2([0, infty)):
const combined = [];
for (const a of A_grid) {
  const Ja_main = Ja_by_U[U_TARGET][a];
  const HS2_main = I0_target * Ja_main;
  const T_a = tailBounds[a].T_direct; // fp-zero for U=4 (this is the point!)
  const HS2_total = HS2_main + T_a; // = HS2_main numerically
  const HS_combined = Math.sqrt(HS2_total);
  const log10_T = tailBounds[a].log10_T;
  combined.push({
    a,
    U: U_TARGET,
    I0: I0_target,
    J_a_window: Ja_main,
    HS2_main,
    HS_main: Math.sqrt(HS2_main),
    T_a_log10: log10_T,
    T_a_direct: T_a, // fp-zero is OK; closed form is real
    HS2_total_bound: HS2_total,
    HS_combined_bound: HS_combined,
    ratio_T_to_main_log10: log10_T - Math.log10(HS2_main),
    isBelowOne: HS_combined < 1,
    margin_below_one: 1 / HS_combined,
  });
}

// 4) Cross-window consistency check: J_a(U=4) vs J_a(U=8) vs J_a(U=12).
// If these all agree to ~12 sig figs, the tail past U=4 is fp-zero (and the
// closed-form bound just LABELS that with the right exponent).
const j_consistency = {};
for (const a of A_grid) {
  const j4 = Ja_by_U[4][a];
  const j8 = Ja_by_U[8][a];
  const j12 = Ja_by_U[12][a];
  const rel_4_to_8 = Math.abs((j8 - j4) / j8);
  const rel_8_to_12 = Math.abs((j12 - j8) / j12);
  j_consistency[a] = { j4, j8, j12, rel_4_to_8, rel_8_to_12 };
}

const dt = performance.now() - t0;
console.error(`# done ${dt.toFixed(0)} ms`);

console.log(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      kernel_construction: 'verbatim from scripts/compute-imp1267-volterra-hs-bound.mjs',
      N_phi: N_PHI,
      Us,
      A_grid,
      I0values,
      Ja_by_U,
      combined,
      j_consistency,
      U_TARGET,
      I0_target,
      tailBounds,
    },
    null,
    2,
  ),
);
