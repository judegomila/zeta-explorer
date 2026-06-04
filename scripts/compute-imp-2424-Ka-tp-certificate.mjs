#!/usr/bin/env node
// imp-2424: explicit total-positivity / PSD certificate for a finite
// truncation of the ghost-absence kernel K_a (Attack I, Conjecture 18.1).
//
// CLAIM under test (src/data/three-attacks-section.js, Attack I):
//   B_a^+ = 1 is equivalent to the de Branges Wronskian kernel
//     K_a(w, z) = ( A_a(z) B_a(w) - B_a(z) A_a(w) ) / ( pi (w - z) )   (w, z real)
//   being positive semidefinite, where
//     A_a(z) = integral_0^inf Phi(u) cosh(au) cos(zu) du     (even in z)
//     B_a(z) = integral_0^inf Phi(u) sinh(au) sin(zu) du     (odd in z)
//   and Phi is the de Bruijn-Newman completed-Riemann kernel.
//
//   This script builds the n x n Gram matrix G[j,k] = K_a(z_j, z_k) on a
//   real grid and computes an explicit certificate via the symmetric LDL^T
//   factorization: the leading principal minors are M_k = prod_{i<=k} d_i,
//   so Sylvesters criterion gives  G positive definite  <=>  all pivots d_i > 0.
//   We report the smallest pivot, the smallest leading principal minor, and
//   how the smallest pivot scales as the truncation dimension n grows.
//
//   NUMERICAL EVIDENCE toward the B_a^+ = 1 / PSD claim, NOT a proof.
//
// METHOD
// ------
//   - Phi(u) = sum_{n=1..N_PHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u}),
//     N_PHI = 10 (double-exponential decay; tail << 1e-30 for u > 0).
//   - A_a, B_a and their z-derivatives via composite Simpson on [0, U_MAX].
//   - Off-diagonal entries use the divided-difference form directly; the
//     diagonal is the de Branges limit z -> w:
//       K_a(w, w) = ( B_a'(w) A_a(w) - A_a'(w) B_a(w) ) / pi   (the phase Wronskian).
//   - To separate genuine indefiniteness from mere ill-conditioning we also
//     factor the diagonal-normalized correlation matrix
//       C[j,k] = G[j,k] / sqrt(|G[j,j]| |G[k,k]|).
//
// OUTPUT: JSON summary to stdout.

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
    sum += (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
           Math.exp(-Math.PI * n2 * e4u);
  }
  return sum;
}

// ── Simpson quadrature nodes / weights on [0, U_MAX] ────────────────────────
const U_MAX = 2.0;   // Phi(u)cosh(au) is < 1e-150 well before u = 2
const NU = 4000;     // even -> composite Simpson
function buildQuad() {
  const h = U_MAX / NU;
  const u = new Float64Array(NU + 1);
  const w = new Float64Array(NU + 1); // Simpson weights (without the h/3 factor)
  for (let i = 0; i <= NU; i++) {
    u[i] = i * h;
    w[i] = (i === 0 || i === NU) ? 1 : (i % 2 === 1 ? 4 : 2);
  }
  return { h, u, w };
}
const QUAD = buildQuad();

// Precompute, for a fixed a, the weighted kernels Phi(u)cosh(au) and Phi(u)sinh(au).
function precomputeForA(a) {
  const { u } = QUAD;
  const pc = new Float64Array(NU + 1); // Phi(u) cosh(au)
  const ps = new Float64Array(NU + 1); // Phi(u) sinh(au)
  for (let i = 0; i <= NU; i++) {
    const p = Phi(u[i]);
    pc[i] = p * Math.cosh(a * u[i]);
    ps[i] = p * Math.sinh(a * u[i]);
  }
  return { pc, ps };
}

// A_a(z), B_a(z) and derivatives via Simpson, given precomputed pc, ps.
function channels(z, pc, ps) {
  const { h, u, w } = QUAD;
  let A = 0, B = 0, Ap = 0, Bp = 0;
  for (let i = 0; i <= NU; i++) {
    const zu = z * u[i];
    const c = Math.cos(zu), s = Math.sin(zu);
    const ww = w[i];
    A  += ww * pc[i] * c;          // Phi cosh(au) cos(zu)
    B  += ww * ps[i] * s;          // Phi sinh(au) sin(zu)
    Ap += ww * pc[i] * (-u[i] * s); // d/dz cos(zu) = -u sin(zu)
    Bp += ww * ps[i] * ( u[i] * c); // d/dz sin(zu) =  u cos(zu)
  }
  const k = h / 3;
  return { A: A * k, B: B * k, Ap: Ap * k, Bp: Bp * k };
}

// ── symmetric LDL^T: returns pivots d_i (no pivoting). ──────────────────────
// Leading principal minors are M_k = prod_{i<=k} d_i; G is PD iff all d_i > 0.
function ldlPivots(G, n) {
  const L = Array.from({ length: n }, () => new Float64Array(n));
  const d = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    let sum = G[j][j];
    for (let k = 0; k < j; k++) sum -= L[j][k] * L[j][k] * d[k];
    d[j] = sum;
    L[j][j] = 1;
    for (let i = j + 1; i < n; i++) {
      let s = G[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k] * d[k];
      L[i][j] = d[j] !== 0 ? s / d[j] : 0;
    }
  }
  return d;
}

// ── build the n x n Gram matrix of K_a on a symmetric real grid ─────────────
function gramMatrix(n, a, pre, halfSpan) {
  const { pc, ps } = pre;
  // n symmetric points in [-halfSpan, halfSpan], excluding 0 (where B_a = 0).
  const z = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    z[j] = -halfSpan + (2 * halfSpan) * (j + 0.5) / n;
  }
  // NB: build a plain array — Float64Array.map would coerce objects to NaN.
  const ch = [];
  for (let j = 0; j < n; j++) ch.push(channels(z[j], pc, ps));
  const G = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        // de Branges diagonal limit.
        G[i][j] = (ch[i].Bp * ch[i].A - ch[i].Ap * ch[i].B) / Math.PI;
      } else {
        G[i][j] = (ch[j].A * ch[i].B - ch[j].B * ch[i].A) /
                  (Math.PI * (z[i] - z[j]));
      }
    }
  }
  return { G, z };
}

// Symmetrize tiny numerical asymmetry and return certificate stats.
function certify(G, n) {
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const m = 0.5 * (G[i][j] + G[j][i]);
      G[i][j] = G[j][i] = m;
    }
  // diagonal sign (orientation of the kernel)
  let diagPos = 0, diagNeg = 0;
  for (let i = 0; i < n; i++) (G[i][i] >= 0 ? diagPos++ : diagNeg++);
  const orient = diagNeg > diagPos ? -1 : 1; // flip if kernel written with opposite sign

  const Go = orient === 1 ? G : G.map((r) => r.map((x) => -x));
  const d = ldlPivots(Go, n);
  let minPiv = Infinity, negPivots = 0, minMinor = Infinity, minor = 1;
  for (let i = 0; i < n; i++) {
    if (d[i] < minPiv) minPiv = d[i];
    if (d[i] <= 0) negPivots++;
    minor *= d[i];
    if (Math.abs(minor) < Math.abs(minMinor)) minMinor = minor;
  }

  // diagonal-normalized correlation matrix (unit diagonal) to isolate
  // positivity from conditioning.
  const C = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      C[i][j] = Go[i][j] / Math.sqrt(Math.abs(Go[i][i]) * Math.abs(Go[j][j]));
  const dc = ldlPivots(C, n);
  let minPivC = Infinity, negPivC = 0;
  for (let i = 0; i < n; i++) {
    if (dc[i] < minPivC) minPivC = dc[i];
    if (dc[i] <= 0) negPivC++;
  }

  return {
    orientationFlip: orient === -1,
    minPivot: minPiv,
    negativePivots: negPivots,
    smallestLeadingMinor: minMinor,
    isPositiveDefinite: negPivots === 0,
    normalized: { minPivot: minPivC, negativePivots: negPivC, isPositiveDefinite: negPivC === 0 },
  };
}

// ── sweep ───────────────────────────────────────────────────────────────────
function main() {
  const t0 = performance.now();
  const A_VALUES = [0.1, 0.25, 0.5, 1.0, 2.0];
  const N_VALUES = [4, 8, 16, 24, 32];
  const HALF_SPAN = 8.0; // grid spread on the real axis

  const rows = [];
  for (const a of A_VALUES) {
    const pre = precomputeForA(a);
    const series = [];
    for (const n of N_VALUES) {
      const { G } = gramMatrix(n, a, pre, HALF_SPAN);
      const c = certify(G, n);
      series.push({ n, ...c });
    }
    // scaling exponent of |smallest normalized pivot| vs n (log-log slope).
    // A negative slope means the indefinite margin SHRINKS toward 0 as the
    // truncation grows (consistent with a near-PSD, ill-conditioned kernel);
    // a non-negative slope would mean the indefiniteness persists or grows.
    const pts = series.filter((s) => s.normalized.minPivot !== 0 && Number.isFinite(s.normalized.minPivot));
    let slope = null;
    if (pts.length >= 2) {
      const xs = pts.map((s) => Math.log(s.n));
      const ys = pts.map((s) => Math.log(Math.abs(s.normalized.minPivot)));
      const mx = xs.reduce((p, q) => p + q, 0) / xs.length;
      const my = ys.reduce((p, q) => p + q, 0) / ys.length;
      let num = 0, den = 0;
      for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
      slope = den !== 0 ? num / den : null;
    }
    rows.push({ a, series, normalizedMinPivotMagnitudeLogLogSlope: slope });
  }

  const allPD = rows.every((r) => r.series.every((s) => s.normalized.isPositiveDefinite));
  const out = {
    ticket: 'imp-2424',
    kernel: 'K_a(w,z) = (A_a(z)B_a(w) - B_a(z)A_a(w)) / (pi (w - z)), de Branges Wronskian form',
    grid: { halfSpan: HALF_SPAN, points: 'n symmetric midpoints on [-halfSpan, halfSpan]' },
    quadrature: { uMax: U_MAX, nodes: NU, rule: 'composite Simpson' },
    aValues: A_VALUES,
    nValues: N_VALUES,
    allTruncationsPositiveDefinite_normalized: allPD,
    rows,
    elapsedMs: Math.round(performance.now() - t0),
    scope: 'NUMERICAL EVIDENCE toward B_a^+ = 1 (PSD of K_a). Not a proof.',
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

main();
