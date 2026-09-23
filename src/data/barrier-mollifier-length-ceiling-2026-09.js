// @module data/barrier-mollifier-length-ceiling-2026-09
//
// MOLLIFIER-LENGTH LEVER OF THE POLYMATH15 BARRIER / FINITE-LANE CERTIFICATE AT FIXED
// VERIFIED HEIGHT — exact ceiling, computed 2026-09-22.  Import-free; every number is
// either a literal transcribed from the run logs (tmp/torus_floor_logs/) or recomputed
// here from the formulas.  Question answered: can a LONGER mollifier (any length, any
// coefficients) plugged into the y-transfer / finite-lane machinery of the
// Λ ≤ 0.1758354 candidate push a barrier candidate below Λ = 0.145 at the current
// verified height X = 6.0e12 (N0 = 690988)?  Answer: NO — the length lever is capped at
// Λ ≈ 0.154–0.156 (y-flat), and no coefficient-magnitude certificate of any kind exists
// below Λ ≈ 0.1455 at y0.  The cap is not the Levinson θ = 4/7 wall; it is a
// Wiener-algebra invertibility limit of the truncated heat-flow Dirichlet polynomial.
//
// SET-UP (Polymath15 arXiv:1904.12438 §6–7; tmp/ytransfer_proof.md §1; lemma_sweep_genmoll.c)
//   b_t(n) = exp((t/4) ln² n),  q_N = N² − t/16,
//   σ_N(y) = (1+y)/2 + (t/4) ln q_N,   γ_N(y) = exp(y/50 − (y/2) ln q_N),
//   B(s) = Σ_{n≤N} b_t(n) n^{−s},   A(s) = B(s − y)  (coefficients b_t(n) n^{y}).
// For a mollifier M = Σ_d λ_d d^{−s} (λ_1 = 1, finite, ANY length/support/signs) the
// TRIANGLE-weight lane mass certified by the sweep is
//   Mass(M) = Σ_{n≥1} γ |(AM)_n| n^{−σ} + Σ_{n≥2} |(BM)_n| n^{−σ},   lbound = (1 − Mass)/‖M‖ − corr,
// where (AM), (BM) are the coefficients of the PRODUCT Dirichlet polynomials (the sweep's
// "active divisor" rule n ≤ dN is exactly the product rule).  Λ = t + y²/2.
//
// THEOREM (exact fixed-height ceiling of the ℓ¹ certificate class).  Let 𝒜_σ be the Banach
// algebra of Dirichlet series with ‖f‖ = Σ |f_n| n^{−σ} (Dirichlet convolution; the weight
// n^{−σ} is multiplicative so ‖fg‖ ≤ ‖f‖‖g‖; Bohr lift = Wiener algebra of T^∞).
//   (a) If B has a zero on the Bohr torus T^∞ (⇔ B not invertible in 𝒜_σ, Wiener's lemma;
//       ⇔ inf_{x∈ℝ} |B(σ+ix)| = 0 by Kronecker), then Mass(M) ≥ 1 for every M:
//       Σ_{n≥2}|(BM)_n| n^{−σ} ≥ |(BM)(z0) − 1| = 1.
//   (b) More generally, at any torus point z with γ|A(z)| ≥ |B(z)|,
//       Mass(M) ≥ γ|A(z)M(z)| + |B(z)M(z) − 1| ≥ |BM| + |BM − 1| ≥ 1 for every M.
//       This blocks EVERY x-uniform coefficient-magnitude certificate (triangle or improved
//       triangle / L-type weight), since such a certificate is a lower bound valid at all
//       torus points.
//   (c) If B is invertible: with β = ‖BM − 1‖,  ‖AM‖ = ‖(A/B)(BM)‖ ≥ ‖A/B‖(1 − β), hence
//       Mass(M) ≥ γ‖A/B‖(1 − β) + β ≥ min(1, γ‖A/B‖);  the truncations M_X of B^{−1}
//       realise it:  inf_M Mass(M) = min(1, γ ‖A/B‖_{𝒜_σ}).
//   Consequently  inf_M Mass(M) ≥ min(1, γ S_A(X))  for every cutoff X, where
//       S_A(X) = Σ_{n≤X} |(A·B^{−1})_n| n^{−σ}   (partial sums are nondecreasing in X),
//   so γ S_A(X) ≥ 1 at ANY finite X is a rigorous all-mollifier obstruction (float caveat:
//   double-precision Dirichlet inversion; cross-checked against an independent divisor-sum
//   implementation to 8 digits at X = 1e5, tmp/wiener_ceiling_check.py).
//
// COMPUTATIONS (tmp/wiener_ceiling.c: Dirichlet inversion to X = 1e8; tmp/torus_floor_scan.py:
// Bohr-torus minimisation of |B| − γ|A| over all 55,874 prime phases with the exact
// large-prime block decomposition, L-BFGS + restarts; any point with |B| ≤ γ|A| is a
// constructive torus obstruction, points with min > 0 are "not found", not proofs).

// ---------------------------------------------------------------------------
// Parameter formulas (recomputed by the assertions).
// ---------------------------------------------------------------------------
export const N0 = 690988;                       // sqrt(X/4π), X = 6.0e12 verified height
export const Y0 = Math.sqrt(87677 / 2500000);   // 0.187271994703 (candidate y0)
export const T_CANDIDATE = 0.1583;              // Λ ≤ 0.1758354 candidate t0
export function sigmaN(N, t, y) { return (1 + y) / 2 + (t / 4) * Math.log(N * N - t / 16); }
export function gammaN(N, t, y) { return Math.exp(y / 50 - (y / 2) * Math.log(N * N - t / 16)); }

// ---------------------------------------------------------------------------
// (1) The current 287-divisor mollifier at N0 (tmp/moll_0.15830.txt), TRIANGLE mass split.
//     Reproduces the certified sweep floor L12(N0) = 1.872347e-3 exactly (tmp/moll287_mass_split.py).
// ---------------------------------------------------------------------------
export const MOLL287_AT_N0 = Object.freeze({
  t: 0.1583, y: 0.187271994703, sigma: 1.657877, gamma: 0.080920, modmoll: 1.828446,
  B_part: { near: 0.43331, edge: 0.10398, total: 0.53729 },   // killable by length (→ 0 as M → B^{-1})
  A_part: { n1: 0.08092, near: 0.28189, edge: 0.09647, total: 0.45928 }, // pinned near γ‖A/B‖ = 0.428+
  mass: 0.996577, lbound: 1.872347e-3, sweepL12: 1.872347259e-3,
  supportDmax: 1000, divisors: 287, primes: [2, 3, 5, 7, 11, 13, 17],
});

// LP scout (tmp/mollifier_scout_results.json, t = 129/800, y0): optimal TRIANGLE mass by support.
export const LP_SCOUT_T016125 = Object.freeze([
  { support: 'P11 Dmax=1000', S: 192, mass: 0.9394 }, { support: 'P13 Dmax=1000', S: 242, mass: 0.9147 },
  { support: 'P17 Dmax=100', S: 67, mass: 0.9022 }, { support: 'P17 Dmax=1000', S: 287, mass: 0.8973 },
  { support: 'P17 Dmax=5000', S: 676, mass: 0.8968 },
]);

// ---------------------------------------------------------------------------
// (2) Infinite-length limit at N0: γ·S_A(X) vs cutoff X (the mollifier "length" curve).
//     Rows with γS_A(1e8) ≥ 1 are RIGOROUSLY obstructed for every mollifier.
// ---------------------------------------------------------------------------
export const CEILING_N0_Y0 = Object.freeze([
  // t, Λ, γ·S_A at X = 1e3,1e4,1e5,1e6,1e7,1e8 ; S_inv(1e8) = Σ|B^{-1}_n| n^{-σ}
  { t: 0.16125, Lambda: 0.1787854, gSA: [0.11842, 0.13762, 0.18212, 0.31349, 0.37311, 0.38674], Sinv1e8: 2.29097 },
  { t: 0.1583, Lambda: 0.1758354, gSA: [0.12049, 0.14179, 0.19182, 0.34111, 0.41118, 0.42786], Sinv1e8: 2.37823 },
  { t: 0.15, Lambda: 0.1675354, gSA: [0.12708, 0.15557, 0.22511, 0.43891, 0.54938, 0.57885], Sinv1e8: 2.68768 },
  { t: 0.14, Lambda: 0.1575354, gSA: [0.13686, 0.17725, 0.28041, 0.60966, 0.80116, 0.85970], Sinv1e8: 3.24307, gSA1e9: 0.89588, Sinv1e9: 3.32351 },
  { t: 0.1375, Lambda: 0.1550354, gSA: [0.13968, 0.18374, 0.29754, 0.66425, 0.88405, 0.95357], Sinv1e8: 3.42615, gSA1e9: 0.99707, Sinv1e9: 3.52455 },
  { t: 0.135, Lambda: 0.1525354, gSA: [0.14266, 0.19072, 0.31624, 0.72465, 0.97696, 1.05950], Sinv1e8: 3.63215 },
  { t: 0.13, Lambda: 0.1475354, gSA: [0.14917, 0.20634, 0.35896, 0.86541, 1.19796, 1.31439], Sinv1e8: 4.12689 },
  { t: 0.12, Lambda: 0.1375354, gSA: [0.16471, 0.24549, 0.47066, 1.24870, 1.82710, 2.05894], Sinv1e8: 5.57897 },
]);

// X = 1e9 extension (16 GB runs) at y0: t = 0.1375 → γS_A = 0.99707 with per-decade increments
// 0.070 (1e7→1e8), 0.044 (1e8→1e9) — the limit exceeds 1 by ≈ 0.03 (Λ = 0.15504 is obstructed
// in the limit, not yet at a finite cutoff); t = 0.14 → 0.89588, increments 0.059, 0.036 — limit
// ≈ 0.95 < 1 (open).  Ceiling at y0: Λ_ceil ∈ (0.1550, 0.1575), ≈ 0.156.

// (3) y-grid at N0 (X = 1e8).  obstructed = γS_A(1e8) ≥ 1.
export const CEILING_N0_YGRID = Object.freeze([
  { y: 0.10, t: 0.14, Lambda: 0.1450, gSA1e8: 1.44427 }, { y: 0.10, t: 0.15, Lambda: 0.1550, gSA1e8: 1.01494 },
  { y: 0.12, t: 0.145, Lambda: 0.1522, gSA1e8: 1.08333 }, { y: 0.12, t: 0.15, Lambda: 0.1572, gSA1e8: 0.90667 },
  { y: 0.14, t: 0.14, Lambda: 0.1498, gSA1e8: 1.16715 }, { y: 0.14, t: 0.145, Lambda: 0.1548, gSA1e8: 0.96188 },
  { y: 0.17, t: 0.135, Lambda: 0.14945, gSA1e8: 1.18746 }, { y: 0.17, t: 0.14, Lambda: 0.15445, gSA1e8: 0.96557 },
  { y: 0.187272, t: 0.135, Lambda: 0.1525354, gSA1e8: 1.05950 }, { y: 0.187272, t: 0.1375, Lambda: 0.1550354, gSA1e8: 0.95357 },
  { y: 0.20, t: 0.13, Lambda: 0.1500, gSA1e8: 1.20669 }, { y: 0.20, t: 0.135, Lambda: 0.1550, gSA1e8: 0.97167 },
  { y: 0.23, t: 0.125, Lambda: 0.15145, gSA1e8: 1.22591 }, { y: 0.23, t: 0.13, Lambda: 0.15645, gSA1e8: 0.98003 },
  { y: 0.27, t: 0.12, Lambda: 0.15645, gSA1e8: 1.15955 }, { y: 0.27, t: 0.13, Lambda: 0.16645, gSA1e8: 0.73567 },
  { y: 0.32, t: 0.11, Lambda: 0.1612, gSA1e8: 1.29050 }, { y: 0.32, t: 0.12, Lambda: 0.1712, gSA1e8: 0.80566 },
]);

// (4) Height dependence at y0 (X = 1e8): where the ceiling would reach 0.145.
export const CEILING_HEIGHT_Y0 = Object.freeze([
  { N: 690988, t: 0.135, Lambda: 0.1525354, gSA1e8: 1.05950 }, { N: 690988, t: 0.14, Lambda: 0.1575354, gSA1e8: 0.85970 },
  { N: 1500000, t: 0.1275, Lambda: 0.1450354, gSA1e8: 1.00648 }, { N: 1500000, t: 0.13, Lambda: 0.1475354, gSA1e8: 0.89535 },
  { N: 2000000, t: 0.12, Lambda: 0.1375354, gSA1e8: 1.25946 }, { N: 2000000, t: 0.125, Lambda: 0.1425354, gSA1e8: 0.98273 },
  { N: 2000000, t: 0.13, Lambda: 0.1475354, gSA1e8: 0.77239 },
  { N: 6000000, t: 0.11, Lambda: 0.1275354, gSA1e8: 1.27131 }, { N: 6000000, t: 0.115, Lambda: 0.1325354, gSA1e8: 0.95627 },
  { N: 6000000, t: 0.12, Lambda: 0.1375354, gSA1e8: 0.72475 },
]);

// (5) Bohr-torus (Kronecker) obstruction min_z(|B| − γ|A|) at N0 — blocks ANY x-uniform
//     coefficient certificate (triangle AND improved-triangle weights).  G2 ≤ 0 = obstruction found.
export const TORUS_N0 = Object.freeze([
  { y: 0.187272, t: 0.13, Lambda: 0.1475354, G2: 0.0288, absB: 0.5037, gAbsA: 0.4748, found: false },
  { y: 0.187272, t: 0.128, Lambda: 0.1455354, G2: -0.1244, absB: 0.426, gAbsA: 0.551, found: true },
  { y: 0.187272, t: 0.115, Lambda: 0.1325354, G2: -1.0136, absB: 0.000, gAbsA: 1.014, found: true },
  { y: 0.12, t: 0.14, Lambda: 0.1472, G2: 0.3495, found: false }, { y: 0.12, t: 0.13, Lambda: 0.1372, G2: -0.4812, found: true },
  { y: 0.22, t: 0.13, Lambda: 0.1542, G2: 0.2030, found: false }, { y: 0.22, t: 0.12, Lambda: 0.1442, G2: -0.3136, found: true },
  { y: 0.30, t: 0.12, Lambda: 0.1650, G2: 0.2216, found: false }, { y: 0.30, t: 0.115, Lambda: 0.1600, G2: -0.0106, found: true },
]);
// Torus obstruction along the whole Λ = 0.145 line at N0 (any-weight, mollifier-independent):
// found for every y ≥ 0.14; not found (positive gap) for y ≤ 0.12.  |B| stays ≈ 0.41–0.45 across the
// line while γ|A| climbs 0.10 → 0.76 with y, so the residual small-y window (y ≤ 0.12) is exactly the
// window where the ℓ¹ certificate is obstructed hardest (γS_A(1e8) = 1.444 at y = 0.10, Λ = 0.145).
export const TORUS_LINE_0145 = Object.freeze([
  { y: 0.08, t: 0.1418, G2: 0.2812, absB: 0.412, gAbsA: 0.131, found: false },
  { y: 0.10, t: 0.14, G2: 0.3092, absB: 0.414, gAbsA: 0.105, found: false },
  { y: 0.12, t: 0.1378, G2: 0.0348, absB: 0.449, gAbsA: 0.414, found: false },
  { y: 0.14, t: 0.1352, G2: -0.0288, absB: 0.445, gAbsA: 0.474, found: true },
  { y: 0.16, t: 0.1322, G2: -0.0647, absB: 0.444, gAbsA: 0.509, found: true },
  { y: 0.25, t: 0.11375, G2: -0.5170, absB: 0.246, gAbsA: 0.763, found: true },
]);
// B-only torus zero (mollifier non-invertibility, Wiener) at N0, y0: found at t = 0.10 (F = −2.55),
// not found at t ≥ 0.13 (min |S0| − R = +0.35).  The A-term, not B-invertibility, is what binds.

// ---------------------------------------------------------------------------
// Verdict.
// ---------------------------------------------------------------------------
export const VERDICT = Object.freeze({
  q1_lengthLimitKind: 'Not the Levinson/Deshouillers–Iwaniec θ = 4/7 wall. That wall limits the length for which a MEAN-VALUE (twisted second moment) asymptotic is provable. The barrier/finite-lane certificate is pointwise and x-uniform (ℓ¹ mass of the product polynomial B·M); no mean value is ever taken, so any length and any coefficients are admissible. Its limit is algebraic: inf_M Mass = min(1, γ‖A/B‖_{𝒜σ}) (Wiener-algebra norm of B_t(s−y)/B_t(s)); torus points with γ|A| ≥ |B| kill every coefficient certificate. Head-pinning re-read: at t = 0.1583 the 287-divisor mollifier has A-part 0.459 vs its infinite-length value ≥ 0.428 (pinned within 7%); its B-part 0.537 is the entire remaining lever and is fully killable by length. The memory\'s "~0.174 cap" was the cap for P17-smooth SPARSE supports (LP 0.8968 at |S| = 676), not the length limit.',
  q2_thetaNeeded: 'No θ suffices at the current height. γS_A(1e8) ≥ 1 at Λ = 0.1495–0.1525 for every y in [0.12, 0.23] (and at Λ = 0.145/0.155 for y = 0.10); at Λ = 0.1545–0.155 the X = 1e8 partial sums are 0.95–0.97 and still rising; the X = 1e9 run at y0, Λ = 0.15504 gives 0.99707 with shrinking per-decade increments (0.070, 0.044), i.e. a limit ≈ 1.03 (obstructed in the limit), while Λ = 0.15754 gives 0.896 (limit ≈ 0.95, open). Ceiling Λ_ceil(N0) ≈ 0.155–0.157 at y0 and ≈ 0.154–0.157 across y (flat in y). Realising even that needs the mollifier B^{-1} truncated at X ≳ 1e8 divisors (X ≈ N0^{1.36} ≈ x^{0.63}; the current one has 287). Universal (any-weight) torus floor at y0: obstruction at Λ = 0.14554 (t = 0.128); not found at 0.14754.',
  q3_deliverable: 'PRECISE OBSTRUCTION, no new candidate. Λ < 0.145 is unreachable through the fixed-height barrier/y-transfer machinery for every mollifier length: the TRIANGLE-weight ceiling at X = 6.0e12 is Λ ≈ 0.155 (rigorously > 0.1525 at y0 and > 0.1495 across y), and a mollifier-independent torus obstruction sits at Λ = 0.1455 (y0). The ceiling scales with height: at y0 it is ≈ 0.145 for N ≈ 1.6–1.9e6, i.e. verified zero height T = 2πN² ≈ 1.4–2.5e13 (5–8× the current 3e12) — a NECESSARY height for any 0.145 barrier candidate, not a sufficient one (finite mollifier, margins, y-transfer, tail and barrier legs all extra).',
  headroomAtCandidate: 'At the 0.1758354 parameters the infinite-length mass is 0.428 vs the certified 0.9966: a factor 2.3 of mass headroom, all of it mollifier LENGTH; spent optimally it buys Δt ≈ 0.021 (Λ → ≈ 0.155) and no more.',
  status: 'computed, unrefereed; double-precision inversion + L-BFGS torus search; NO QED; RH open; PT Λ ≤ 0.2 remains SOTA; 0.1758354 remains an unrefereed candidate; no bound changes',
});

export const BARRIER_MOLLIFIER_LENGTH_CEILING = Object.freeze({
  id: 'barrier-mollifier-length-ceiling-2026-09', date: '2026-09-22',
  N0, Y0, T_CANDIDATE, MOLL287_AT_N0, LP_SCOUT_T016125, CEILING_N0_Y0, CEILING_N0_YGRID, CEILING_HEIGHT_Y0, TORUS_N0, TORUS_LINE_0145, VERDICT,
  files: ['tmp/wiener_ceiling.c', 'tmp/wiener_ceiling_check.py', 'tmp/torus_floor_scan.py', 'tmp/moll287_mass_split.py', 'tmp/torus_floor_logs/'],
});

// ---------------------------------------------------------------------------
// Toy re-derivation of the mechanism (runs in the harness in milliseconds): Dirichlet
// inversion of B_N at small N, B·B^{-1} = δ exactly, and monotone partial sums S_A(X).
// ---------------------------------------------------------------------------
export function toyInverse(N, t, y, X) {
  const sigma = sigmaN(N, t, y), gamma = gammaN(N, t, y);
  const b = new Float64Array(N + 1), a = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) { const L = Math.log(n); b[n] = Math.exp((t / 4) * L * L); a[n] = b[n] * Math.exp(y * L); }
  const inv = new Float64Array(X + 1); inv[1] = 1;
  for (let m = 1; m <= X; m++) { const im = inv[m]; if (im === 0) continue; const dmax = Math.min(N, Math.floor(X / m)); for (let d = 2; d <= dmax; d++) inv[d * m] -= b[d] * im; }
  // check B * inv = delta
  let maxErr = 0;
  for (let n = 2; n <= X; n++) { let s = 0; for (let d = 1; d <= Math.min(N, n); d++) if (n % d === 0) s += b[d] * inv[n / d]; maxErr = Math.max(maxErr, Math.abs(s)); }
  const c = new Float64Array(X + 1);
  for (let d = 1; d <= N; d++) for (let m = 1; d * m <= X; m++) c[d * m] += a[d] * inv[m];
  const partial = []; let S = 0;
  for (let n = 1; n <= X; n++) { S += Math.abs(c[n]) * Math.pow(n, -sigma); if (n === 10 || n === 100 || n === 1000 || n === X) partial.push(gamma * S); }
  return { sigma, gamma, maxErr, partial };
}

const near = (u, v, tol) => Math.abs(u - v) <= tol;

export const BARRIER_MOLLIFIER_LENGTH_CEILING_ASSERTIONS = Object.freeze([
  {
    name: 'σ_N(y), γ_N(y) at (N0, t0, y0) reproduce the sweep constants (σ = 1.657877, γ = 0.080920) and Λ = t0 + y0²/2 = 0.1758354',
    holds: () => near(sigmaN(N0, T_CANDIDATE, Y0), 1.657877, 1e-6) && near(gammaN(N0, T_CANDIDATE, Y0), 0.080920, 1e-6) && near(T_CANDIDATE + Y0 * Y0 / 2, 0.1758354, 1e-12),
  },
  {
    name: '287-divisor mollifier mass split reproduces the certified L12(N0): (1 − 0.996577)/1.828446 = 1.872347e-3, and B-part + A-part + γ sum to the mass',
    holds: () => {
      const m = MOLL287_AT_N0;
      // mass is baked to 6 decimals, so lbound carries ±5.5e-7 storage error
      return near((1 - m.mass) / m.modmoll, m.sweepL12, 6e-7) && near(m.B_part.near + m.B_part.edge, m.B_part.total, 1e-5)
        && near(m.A_part.n1 + m.A_part.near + m.A_part.edge, m.A_part.total, 1e-5) && near(m.B_part.total + m.A_part.total, m.mass, 1e-5);
    },
  },
  {
    name: 'A-part is pinned: 287-mollifier A-part 0.459 exceeds the infinite-length value γS_A(1e8) = 0.428 by < 8%; B-part 0.537 is the length-killable remainder',
    holds: () => { const lim = CEILING_N0_Y0.find((r) => r.t === 0.1583).gSA[5]; return MOLL287_AT_N0.A_part.total > lim && MOLL287_AT_N0.A_part.total / lim < 1.08 && MOLL287_AT_N0.B_part.total > 0.5; },
  },
  {
    name: 'γS_A(X) partial sums are nondecreasing in X in every N0 row, increasing in 1/t at fixed X, and the 1e7→1e8 increment is below the 1e6→1e7 increment (convergence onset)',
    holds: () => CEILING_N0_Y0.every((r) => r.gSA.every((v, i) => v === null || i === 0 || r.gSA[i - 1] === null || v >= r.gSA[i - 1]))
      && CEILING_N0_Y0.every((r, i) => i === 0 || r.gSA[5] > CEILING_N0_Y0[i - 1].gSA[5])
      && CEILING_N0_Y0.filter((r) => r.gSA[3] !== null).every((r) => (r.gSA[5] - r.gSA[4]) < (r.gSA[4] - r.gSA[3])),
  },
  {
    name: 'rigorous obstruction at N0, y0: γS_A(1e8) ≥ 1 for t ≤ 0.135 (Λ ≤ 0.1525354); open (< 1) for t ≥ 0.1375; hence Λ_ceil(N0, y0) > 0.1525 > 0.145',
    holds: () => CEILING_N0_Y0.every((r) => (r.t <= 0.135) === (r.gSA[5] >= 1)) && 0.1525354 > 0.145,
  },
  {
    name: 'y-flat ceiling: on the y-grid every obstructed row has Λ ≥ 0.1495 (min at y = 0.17) except y = 0.10 which is obstructed even at 0.155; every open row has Λ ≥ 0.1544; no row with Λ < 0.149 is open',
    holds: () => {
      const obs = CEILING_N0_YGRID.filter((r) => r.gSA1e8 >= 1), open = CEILING_N0_YGRID.filter((r) => r.gSA1e8 < 1);
      return obs.every((r) => r.Lambda >= 0.1449) && Math.min(...obs.filter((r) => r.y !== 0.10).map((r) => r.Lambda)) >= 0.1494
        && open.every((r) => r.Lambda >= 0.1544) && open.length >= 8 && obs.length >= 9
        && CEILING_N0_YGRID.every((r) => near(r.Lambda, r.t + r.y * r.y / 2, 2e-6));
    },
  },
  {
    name: 'height crossing at y0: ceiling reaches 0.145 between N = 1.5e6 (obstructed at Λ = 0.1450, γS_A = 1.0065) and N = 2e6 (open at 0.1425); required verified height 2πN² ∈ [1.4e13, 2.5e13] = 4.7–8.4× the current 3e12',
    holds: () => {
      const r15 = CEILING_HEIGHT_Y0.find((r) => r.N === 1500000 && r.t === 0.1275), r20 = CEILING_HEIGHT_Y0.find((r) => r.N === 2000000 && r.t === 0.125);
      const Tlo = 2 * Math.PI * 1.5e6 * 1.5e6, Thi = 2 * Math.PI * 2e6 * 2e6, Tnow = 2 * Math.PI * N0 * N0;
      return r15.gSA1e8 >= 1 && near(r15.Lambda, 0.1450354, 1e-7) && r20.gSA1e8 < 1 && Tlo > 1.4e13 && Thi < 2.6e13 && near(Tnow, 3.0e12, 2e10)
        && CEILING_HEIGHT_Y0.filter((r) => r.N === 6000000).some((r) => r.gSA1e8 < 1 && r.Lambda < 0.135);
    },
  },
  {
    name: 'torus obstruction (any weight) at N0, y0 found at Λ = 0.14554 (t = 0.128, |B| = 0.426 < γ|A| = 0.551), not found at 0.14754; found rows all have G2 ≤ 0 and Λ ≤ 0.16',
    holds: () => {
      const f = TORUS_N0.find((r) => r.t === 0.128);
      return f.found && f.G2 < 0 && f.absB < f.gAbsA && near(f.Lambda, 0.1455354, 1e-7)
        && TORUS_N0.every((r) => r.found === (r.G2 <= 0)) && TORUS_N0.filter((r) => r.found).every((r) => r.Lambda <= 0.16)
        && TORUS_N0.find((r) => r.t === 0.13 && r.y === 0.187272).G2 > 0;
    },
  },
  {
    name: 'Λ = 0.145 line at N0: every row has t + y²/2 = 0.145; torus obstruction found (G2 ≤ 0, |B| < γ|A|) for all y ≥ 0.14, not found for y ≤ 0.12; G2 peaks at y = 0.10 (+0.309) and is strictly decreasing for y ≥ 0.10; the y ≤ 0.12 window is ℓ¹-obstructed instead (γS_A(1e8) = 1.444 at y = 0.10)',
    holds: () => TORUS_LINE_0145.every((r) => near(r.t + r.y * r.y / 2, 0.145, 6e-5))
      && TORUS_LINE_0145.every((r) => r.found === (r.G2 <= 0) && r.found === (r.absB < r.gAbsA) && r.found === (r.y >= 0.14))
      && TORUS_LINE_0145.every((r, i) => i <= 1 || r.G2 < TORUS_LINE_0145[i - 1].G2)
      && Math.max(...TORUS_LINE_0145.map((r) => r.G2)) === TORUS_LINE_0145[1].G2
      && CEILING_N0_YGRID.find((r) => r.y === 0.10 && r.t === 0.14).gSA1e8 > 1.4,
  },
  {
    name: 'toy re-derivation (N = 60, X = 3000, candidate t, y): Dirichlet inverse satisfies B·B^{-1} = δ to 1e-9, partial sums γS_A(X) are nondecreasing and start at γ·1',
    holds: () => {
      const r = toyInverse(60, T_CANDIDATE, Y0, 3000);
      // structural check only: at N = 60 the abscissa σ_60 = 0.918 < 1, so the toy mass exceeds 1 by design
      return r.maxErr < 1e-9 && r.partial.every((v, i) => i === 0 || v >= r.partial[i - 1]) && r.partial[0] > r.gamma && r.sigma < 1;
    },
  },
  {
    name: 'LP scout literals: sparse-support mass floor 0.8968 at P17 Dmax=5000 (t = 0.16125) sits 2.3× above the infinite-length value 0.387 at the same t — the sparse-support cap is not the length cap',
    holds: () => { const lp = LP_SCOUT_T016125[LP_SCOUT_T016125.length - 1].mass, lim = CEILING_N0_Y0[0].gSA[5]; return lp / lim > 2.2 && lp / lim < 2.4 && LP_SCOUT_T016125.every((r, i) => i === 0 || r.mass <= LP_SCOUT_T016125[i - 1].mass); },
  },
  {
    name: 'honest framing: verdict names an obstruction (no new candidate), flags NO QED / RH open / PT SOTA, and does not call 0.1758354 a bound',
    holds: () => /PRECISE OBSTRUCTION, no new candidate/.test(VERDICT.q3_deliverable) && /NO QED/.test(VERDICT.status) && /RH open/.test(VERDICT.status)
      && /PT Λ ≤ 0.2 remains SOTA/.test(VERDICT.status) && /unrefereed candidate/.test(VERDICT.status) && /NECESSARY height/.test(VERDICT.q3_deliverable),
  },
]);

export default BARRIER_MOLLIFIER_LENGTH_CEILING;
