#!/usr/bin/env node
// imp-2424: historical finite-matrix experiment.
//
// NORMALIZATION RETRACTION (2026-07-24)
// --------------------------------------
// This script does NOT evaluate the exact completed-Riemann/T3 kernel. It uses
// the surrogate
//   sum_n (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})
// and channels with cosh(au), cos(zu), sinh(au), sin(zu). The canonical
// normalization is
//   Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u})
//                    exp(-pi n^2 e^{4u}),
//   X(w) = 8 integral_0^infinity Phi(u) cosh(2wu) du,
// so the transform arguments also require the factor 2. The historical
// negative pivots below therefore belong only to this surrogate discretization
// and are INVALID FOR T3. A historical record reports a positive 60-digit
// correctly normalized four-node check; it is not recomputed here or a proof.
//
// HISTORICAL CLAIM under test (now retracted for the exact kernel):
//   B_a^+ = 1 is equivalent to the de Branges Wronskian kernel
//     K_a(w, z) = ( A_a(z) B_a(w) - B_a(z) A_a(w) ) / ( pi (w - z) )   (w, z real)
//   being positive semidefinite, where
//     A_a(z) = integral_0^inf Phi(u) cosh(au) cos(zu) du     (even in z)
//     B_a(z) = integral_0^inf Phi(u) sinh(au) sin(zu) du     (odd in z)
//   The implemented Phi/channels were incorrectly identified as the exact
//   de Bruijn-Newman completed-Riemann normalization.
//
//   This script builds the n x n Gram matrix G[j,k] = K_a(z_j, z_k) on a
//   real grid and reports finite floating-point LDL^T diagnostics. In exact
//   arithmetic, a completed nonzero-pivot factorization gives leading minors
//   M_k = prod_{i<=k} d_i; positive pivots then imply positive definiteness.
//   Floating diagnostics are NOT a certificate or a test of total positivity.
//   We report the smallest pivot, the smallest leading principal minor, and
//   how the smallest pivot scales as the truncation dimension n grows.
//
//   SURROGATE NUMERICS ONLY. No inference about exact K_a, T3, B_a^+ or RH.
//
// METHOD
// ------
//   - Historical surrogate Phi(u) =
//     sum_{n=1..N_PHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u}),
//     N_PHI = 10 (double-exponential decay; tail << 1e-30 for u > 0).
//   - A_a, B_a and their z-derivatives via composite Simpson on [0, U_MAX].
//   - Off-diagonal entries use the divided-difference form directly; the
//     diagonal is the de Branges limit z -> w:
//       K_a(w, w) = ( B_a'(w) A_a(w) - A_a'(w) B_a(w) ) / pi   (the phase Wronskian).
//   - Also inspect the positive diagonal congruence
//       C[j,k] = G[j,k] / sqrt(|G[j,j]| |G[k,k]|), when scales are valid.
//     Negative diagonal signs are preserved. This is a conditioning diagnostic,
//     not a rigorous separation of numerical error and genuine indefiniteness.
//
// OUTPUT: JSON summary to stdout.

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { diagnoseMatrix, summarizeDiagnostics, pivotMagnitudeLogLogSlope } from './lib/ka-matrix-diagnostics.mjs';

// ── Historical surrogate (not the canonical completed-Riemann Phi) ─────────
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
// Initialized only by the explicit CLI entry point, never on import.
let QUAD;

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

// ── sweep ───────────────────────────────────────────────────────────────────
export function main() {
  QUAD = buildQuad();
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
      const c = diagnoseMatrix(G);
      series.push({ n, ...c });
    }
    // Descriptive fit on this changing finite grid only; not an eigenvalue,
    // continuum or rigorous sign margin. Do not silently drop invalid cells.
    const slope = pivotMagnitudeLogLogSlope(series);
    rows.push({ a, series, normalizedMinPivotMagnitudeLogLogSlope: slope });
  }

  const rawSummary = summarizeDiagnostics(rows.flatMap(r => r.series));
  const normalizedSummary = summarizeDiagnostics(rows.flatMap(r => r.series.map(s => s.normalized)));
  const out = {
    ticket: 'imp-2424',
    schemaVersion: 2,
    evidence: 'non-certified finite floating-point diagnostics',
    numericalSafety: {
      adaptiveSignReversal: false,
      totalPositivityTested: false,
      unknownValues: 'null with explicit status/reason; never a positive verdict',
      correction: 'Earlier sign-flipped, zero-pivot or nonfinite results are not valid positivity evidence.',
      scope: 'No quadrature, roundoff, all-minors or continuum certificate is supplied.',
    },
    status: 'SURROGATE / INVALID FOR T3',
    kernelModel: 'historical-surrogate-normalization',
    appliesToExactRiemannKernel: false,
    kernel: 'surrogate Wronskian matrix built from the imp-2424 Phi/channels',
    normalizationAudit: {
      implementedPhi: '(2 pi^2 n^4 e^(4u) - 3 pi n^2 e^(2u)) exp(-pi n^2 e^(4u))',
      canonicalPhi: '(2 pi^2 n^4 e^(9u) - 3 pi n^2 e^(5u)) exp(-pi n^2 e^(4u))',
      canonicalTransform: 'X(w) = 8 integral Phi(u) cosh(2 w u) du',
      omittedTransformArgumentFactor: 2,
    },
    correctedCanonicalFourNodeNumericalCheck: {
      status: 'positive-numerical-only',
      provenance: 'historical hardcoded record; not recomputed by this script',
      replayedByThisScript: false,
      rigorous: false,
      precisionDigits: 60,
      a: 0.5,
      realNodes: [-6, -2, 2, 6],
      smallestNormalizedEigenvalue: 4.66922095265e-5,
      normalizedLeadingPrincipalMinors: [
        1,
        0.0387394724,
        0.000150634109,
        1.4487899474e-7,
      ],
    },
    grid: { halfSpan: HALF_SPAN, points: 'n symmetric midpoints on [-halfSpan, halfSpan]' },
    quadrature: { uMax: U_MAX, nodes: NU, rule: 'composite Simpson' },
    aValues: A_VALUES,
    nValues: N_VALUES,
    allTruncationsPositiveDefinite_normalized: normalizedSummary.allPositiveDefinite,
    diagnostics: { raw: rawSummary, normalized: normalizedSummary },
    rows,
    elapsedMs: Math.round(performance.now() - t0),
    scope:
      'SURROGATE NUMERICS ONLY. The negative pivots do not apply to the exact ' +
      'Riemann kernel or T3 and imply no cone-boundary, B_a^+, Lambda, or RH verdict.',
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
