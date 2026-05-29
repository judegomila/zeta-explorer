#!/usr/bin/env node
// imp-1260: large-a crossover analysis for the central contraction
//
//     ||V_{a,Phi}||_op <= 1   for every a > 0     (Conjecture 27.2)
//
// where  (V_{a,Phi} f)(x) = Phi(x) int_0^x Phi(y) sinh(a(x - y)) f(y) dy
// on L^2([0, infty)), kernel k(x, y) = Phi(x) Phi(y) sinh(a(x - y)) 1_{y<=x}.
//
// STATE OF THE ART (imp-1267 / imp-1266):
//   - Route 1 (Cauchy-Schwarz Hilbert-Schmidt):  ||V|| <= sqrt(I_0 * J_a),
//       I_0 = int Phi^2, J_a = int Phi^2 sinh^2(au). This is < 1 only for
//       small a; it CROSSES 1 around a ~ 2 and is useless past that.
//   - Route 3 (Mellin): structurally blocked (imp-1266).
//
// The single remaining open sub-gap for imp-1260 is therefore the LARGE-a
// regime. This script quantifies it precisely by locating the crossover a*
// (the largest a for which each rigorous bound still proves ||V|| <= 1) for
// THREE bounds of increasing sharpness:
//
//   (1) CS-HS    sqrt(I_0 * J_a)                         [imp-1267 route 1]
//   (2) exact-HS sqrt( int int_{y<=x} |k|^2 dy dx )      [drops the CS step]
//   (3) Schur    sqrt( sup_x R(x) * sup_y C(y) )         [Holmgren/Schur test]
//                  R(x) = int_0^x  k(x,y) dy   (row sum, k >= 0)
//                  C(y) = int_y^oo k(x,y) dx   (col sum)
//
// Each is a rigorous upper bound on ||V||_op. Bound (3) does NOT square the
// kernel, so it is expected to push the crossover well past bound (1)/(2),
// shrinking the open sub-gap.

// ── de Bruijn-Newman Phi kernel (imp-1240/1266/1267 convention) ─────────────
const N_PHI = 10;
function Phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    sum +=
      (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
      Math.exp(-Math.PI * n2 * e4u);
  }
  return sum;
}

// ── Fine grid on [0, U_INF]. Phi(2)^2 ~ exp(-2 pi e^8) ~ 1e-2600 -> fp zero ──
const U_INF = 3.0;
const N = 6000; // h = 5e-4
const H = U_INF / N;
const x = new Float64Array(N);
const phi = new Float64Array(N);
const phi2 = new Float64Array(N);
for (let i = 0; i < N; i++) {
  x[i] = (i + 0.5) * H;
  const p = Phi(x[i]);
  phi[i] = p;
  phi2[i] = p * p;
}

// I_0 = int_0^inf Phi^2 du
let I0 = 0;
for (let i = 0; i < N; i++) I0 += phi2[i] * H;

// ── Bound (1): CS-HS  sqrt(I_0 * J_a),  J_a = int Phi^2 sinh^2(au) ───────────
function J_a(a) {
  let s = 0;
  for (let i = 0; i < N; i++) {
    const sh = Math.sinh(a * x[i]);
    s += phi2[i] * sh * sh * H;
  }
  return s;
}
function csHs(a) {
  return Math.sqrt(I0 * J_a(a));
}

// ── Bound (2): exact-HS  sqrt( int_0^inf Phi(x)^2 G_a(x) dx ),
//     G_a(x) = int_0^x Phi(y)^2 sinh^2(a(x-y)) dy.  O(N^2) double quadrature. ─
function exactHs(a) {
  let s2 = 0;
  for (let i = 0; i < N; i++) {
    const fi2 = phi2[i];
    if (fi2 === 0) continue;
    let inner = 0;
    for (let j = 0; j <= i; j++) {
      const sh = Math.sinh(a * (x[i] - x[j]));
      inner += phi2[j] * sh * sh * H;
    }
    s2 += fi2 * inner * H;
  }
  return Math.sqrt(s2);
}

// ── Bound (3): Schur / Holmgren. k(x,y) = Phi(x)Phi(y)sinh(a(x-y)) >= 0. ─────
//   M1 = sup_x int_0^x k(x,y) dy = sup_x Phi(x) int_0^x Phi(y) sinh(a(x-y)) dy
//   M2 = sup_y int_y^inf k(x,y) dx = sup_y Phi(y) int_y^inf Phi(x) sinh(a(x-y)) dx
//   ||V||_op <= sqrt(M1 * M2).
function schur(a) {
  let M1 = 0;
  for (let i = 0; i < N; i++) {
    if (phi[i] === 0) continue;
    let row = 0;
    for (let j = 0; j <= i; j++) {
      row += phi[j] * Math.sinh(a * (x[i] - x[j])) * H;
    }
    const r = phi[i] * row;
    if (r > M1) M1 = r;
  }
  let M2 = 0;
  for (let j = 0; j < N; j++) {
    if (phi[j] === 0) continue;
    let col = 0;
    for (let i = j; i < N; i++) {
      col += phi[i] * Math.sinh(a * (x[i] - x[j])) * H;
    }
    const c = phi[j] * col;
    if (c > M2) M2 = c;
  }
  return { schurBound: Math.sqrt(M1 * M2), M1, M2 };
}

// ── Locate crossover a* where bound(a*) = 1 by bisection on a monotone f ─────
function crossover(f) {
  let lo = 0.01;
  let hi = 0.02;
  // expand hi until f(hi) > 1 (f is increasing in a)
  let guard = 0;
  while (f(hi) <= 1 && guard++ < 60) hi *= 1.5;
  if (f(hi) <= 1) return { aStar: Infinity, note: 'never-crosses-in-range' };
  for (let it = 0; it < 80; it++) {
    const mid = 0.5 * (lo + hi);
    if (f(mid) <= 1) lo = mid;
    else hi = mid;
  }
  return { aStar: 0.5 * (lo + hi) };
}

// ── Sample table at representative a values ──────────────────────────────────
const A_SAMPLES = [0.5, 1, 2, 3, 4, 5, 6, 8, 10];
const rows = [];
for (const a of A_SAMPLES) {
  const cs = csHs(a);
  const ex = exactHs(a);
  const { schurBound } = schur(a);
  rows.push({ a, csHs: cs, exactHs: ex, schur: schurBound });
}

const aStarCs = crossover(csHs);
const aStarExact = crossover(exactHs);
const aStarSchur = crossover((a) => schur(a).schurBound);

console.log(JSON.stringify({
  U_INF, N, H, I0,
  rows,
  aStarCsHs: aStarCs.aStar,
  aStarExactHs: aStarExact.aStar,
  aStarSchur: aStarSchur.aStar,
}, null, 2));
