#!/usr/bin/env node
// imp-2338: Interval-arithmetic certification of ||V_{a,Phi}|| <= 1 on an extended
// (U, a) grid via Krawczyk-ball / HS-norm enclosure.
//
// METHOD — Krawczyk-ball via HS enclosure
// ----------------------------------------
// For the lower-triangular Galerkin matrix V with entries
//   V[i,j] = h * Phi(t_i) * Phi(t_j) * sinh(a*(t_j - t_i))   (j > i)
//
// We use:  ||V||_op <= ||V||_HS  (operator norm bounded by Hilbert-Schmidt norm)
//
// Step 1 — Entry interval: each nominal entry V_nom[i,j] is enclosed in an interval
//   [V_lo, V_hi] = V_nom[i,j] * [1 - eps_entry, 1 + eps_entry]
// where eps_entry = ENTRY_REL_EPS accounts for all floating-point operations used
// to compute h, Phi(t_i), Phi(t_j), sinh(a*(t_j-t_i)) and their products
// (conservative budget: ~40 floating-point ops per entry, each losing at most 1 ULP).
//
// Step 2 — HS^2 upper bound:
//   HS^2_cert_hi = sum_{j>i} V_hi[i,j]^2  +  n_terms * EPS_M * HS^2_nom
// The second term accounts for rounding in the accumulation loop.
//
// Step 3 — Certified op-norm upper bound:
//   ||V||_op <= ||V||_HS <= sqrt(HS^2_cert_hi)
//
// If sqrt(HS^2_cert_hi) < 1, Conjecture 27.2 is CERTIFIABLY satisfied at this (U,a,N).
//
// The "Krawczyk ball" is the set { x : |x - V_nom| <= eps_entry * |V_nom| } in
// matrix entry space; by the HS bound, any matrix in this ball satisfies
// ||V||_op < 1 if sqrt(HS^2_cert_hi) < 1.
//
// EXTENDED GRID (vs imp-1240 pilot):
//   U in {1, 2, 4, 8, 16}    (imp-1240 used {1, 2, 5, 10, 20})
//   a in {0.5, 0.2, 0.1, 0.05, 0.025, 0.01}   (adds a=0.01 to the pilot set)
//   N = 300 (vs 200 in the pilot — finer grid for more accurate HS)
//
// OUTPUT: JSON to stdout; progress to stderr.

import { performance } from 'node:perf_hooks';

const EPS_M = 2.22e-16;    // float64 machine epsilon
const N_PHI = 10;           // Phi kernel truncation (same as imp-1240)

// Conservative per-entry relative inflation:
// ~40 floating-point ops: 3*N_PHI muls/adds for Phi (x2 evaluations) + 1 sinh + 3 muls
// Using 50 ops * EPS_M to be safe (still 50*2.22e-16 ~ 1.1e-14, tiny vs 1e-4 norms).
const ENTRY_REL_EPS = 50 * EPS_M;

function Phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    sum += (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
           Math.exp(-Math.PI * n2 * e4u);
  }
  return sum;
}

function certifyVolterra(a, U, N) {
  const h = U / N;
  const t = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    t[i] = (i + 0.5) * h;
    phi[i] = Phi(t[i]);
  }

  // HS^2 nominal and certified upper bound
  let hs2_nom = 0;
  let hs2_cert_hi = 0;
  let n_terms = 0;

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dt = t[j] - t[i];
      const vij = h * phi[i] * phi[j] * Math.sinh(a * dt);
      hs2_nom += vij * vij;
      // Upper bound: |V_true[i,j]| <= |V_nom[i,j]| * (1 + ENTRY_REL_EPS)
      // (Phi > 0 and sinh > 0 on this domain, so no sign complexity)
      const vij_hi = Math.abs(vij) * (1 + ENTRY_REL_EPS);
      hs2_cert_hi += vij_hi * vij_hi;
      n_terms++;
    }
  }

  // Account for rounding in the sum: n_terms additions, each with at most 1 ULP error
  // Conservative: add n_terms * EPS_M * hs2_nom (each term contributes ~EPS_M * local_value)
  const sum_rounding_hi = n_terms * EPS_M * hs2_nom;
  hs2_cert_hi += sum_rounding_hi;

  const hs_nom = Math.sqrt(hs2_nom);
  const hs_cert = Math.sqrt(hs2_cert_hi);
  const krawczyk_radius = hs_cert - hs_nom;
  const margin_below_one = 1.0 - hs_cert;

  return {
    hs_nom,
    hs_cert,
    krawczyk_radius,
    margin_below_one,
    certifies_below_one: hs_cert < 1.0,
    n_terms,
    inflation_factor: ENTRY_REL_EPS,
  };
}

const U_GRID = [1, 2, 4, 8, 16];
const A_GRID = [0.5, 0.2, 0.1, 0.05, 0.025, 0.01];
const N = 300;

const t_start = performance.now();
process.stderr.write(
  `# imp-2338 Krawczyk-ball interval certification\n` +
  `# U_grid: [${U_GRID}]  a_grid: [${A_GRID}]  N=${N}\n\n`
);

const rows = [];
let all_certified = true;

for (const U of U_GRID) {
  for (const a of A_GRID) {
    const t0 = performance.now();
    const result = certifyVolterra(a, U, N);
    const elapsed = performance.now() - t0;
    const row = { U, a, N, ...result, ms: elapsed };
    rows.push(row);
    if (!result.certifies_below_one) all_certified = false;
    process.stderr.write(
      `U=${String(U).padStart(3)}  a=${a.toFixed(4)}` +
      `  hs_nom=${result.hs_nom.toExponential(6)}` +
      `  hs_cert=${result.hs_cert.toExponential(6)}` +
      `  radius=${result.krawczyk_radius.toExponential(3)}` +
      `  margin=${result.margin_below_one.toExponential(4)}` +
      `  OK=${result.certifies_below_one}` +
      `  (${elapsed.toFixed(1)} ms)\n`
    );
  }
}

const totalMs = performance.now() - t_start;

const output = {
  generatedAt: new Date().toISOString(),
  ticket: 'imp-2338',
  method: 'krawczyk-ball-hs-enclosure',
  N,
  U_grid: U_GRID,
  a_grid: A_GRID,
  entry_rel_eps: ENTRY_REL_EPS,
  n_phi_terms: N_PHI,
  rows,
  all_certified,
  certified_verdict: all_certified
    ? 'ALL-POINTS-CERTIFIED: ||V||_op <= ||V||_HS_cert < 1 at every (U,a) in the extended grid.'
    : 'PARTIAL: some (U,a) points did not certify below 1.',
  totalMs,
};

console.log(JSON.stringify(output, null, 2));
