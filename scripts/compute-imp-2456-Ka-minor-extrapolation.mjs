#!/usr/bin/env node
// imp-2456: continuum-limit sign of the smallest truncated minor of the
// ghost-absence kernel K_a (Attack I, Conjecture 18.1) -- follow-on to imp-2424.
//
// imp-2424 found that the smallest diagonal-normalized leading principal minor
// of the n x n truncation of K_a stays NEGATIVE, with the indefinite margin
// shrinking roughly like n^{-1.7}, and reported NO n-uniform positive
// certificate. This script pushes the truncation to larger n and a finer
// a-grid, fits the margin decay as a power law |margin_n| ~ C n^{-p}, and
// extrapolates the SIGNED margin to n -> infinity to decide between three
// possibilities:
//   (PSD)        the margin extrapolates to a strictly POSITIVE floor
//                  -> Attack I positivity certificate is achievable;
//   (MARGINAL)   the margin -> 0 from below (p > 0, signed limit ~ 0)
//                  -> K_a sits exactly ON the PSD-cone boundary, no provable
//                     strictly-positive floor but no bounded-away obstruction;
//   (INDEFINITE) the margin extrapolates to a bounded-away NEGATIVE value
//                  -> positivity is structurally blocked.
//
// The kernel, quadrature and LDL^T certificate are identical to
// scripts/compute-imp-2424-Ka-tp-certificate.mjs (re-derived inline so this
// script is self-contained). HONEST NUMERICS -- not a proof of B_a^+ = 1.

import { performance } from 'node:perf_hooks';

// dg_de Bruijn-Newman Phi kernel (same as imp-2424).
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

// Simpson quadrature on [0, U_MAX].
const U_MAX = 2.0;
const NU = 4000;
function buildQuad() {
  const h = U_MAX / NU;
  const u = new Float64Array(NU + 1);
  const w = new Float64Array(NU + 1);
  for (let i = 0; i <= NU; i++) {
    u[i] = i * h;
    w[i] = (i === 0 || i === NU) ? 1 : (i % 2 === 1 ? 4 : 2);
  }
  return { h, u, w };
}
const QUAD = buildQuad();

function precomputeForA(a) {
  const { u } = QUAD;
  const pc = new Float64Array(NU + 1);
  const ps = new Float64Array(NU + 1);
  for (let i = 0; i <= NU; i++) {
    const p = Phi(u[i]);
    pc[i] = p * Math.cosh(a * u[i]);
    ps[i] = p * Math.sinh(a * u[i]);
  }
  return { pc, ps };
}

function channels(z, pc, ps) {
  const { h, u, w } = QUAD;
  let A = 0, B = 0, Ap = 0, Bp = 0;
  for (let i = 0; i <= NU; i++) {
    const zu = z * u[i];
    const c = Math.cos(zu), s = Math.sin(zu);
    const ww = w[i];
    A  += ww * pc[i] * c;
    B  += ww * ps[i] * s;
    Ap += ww * pc[i] * (-u[i] * s);
    Bp += ww * ps[i] * ( u[i] * c);
  }
  const k = h / 3;
  return { A: A * k, B: B * k, Ap: Ap * k, Bp: Bp * k };
}

// symmetric LDL^T pivots (no pivoting); leading minors are prod of pivots.
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

function gramMatrix(n, pre, halfSpan) {
  const { pc, ps } = pre;
  const z = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    z[j] = -halfSpan + (2 * halfSpan) * (j + 0.5) / n;
  }
  const ch = [];
  for (let j = 0; j < n; j++) ch.push(channels(z[j], pc, ps));
  const G = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        G[i][j] = (ch[i].Bp * ch[i].A - ch[i].Ap * ch[i].B) / Math.PI;
      } else {
        G[i][j] = (ch[j].A * ch[i].B - ch[j].B * ch[i].A) /
                  (Math.PI * (z[i] - z[j]));
      }
    }
  }
  return { G, z };
}

// Returns the SIGNED smallest leading principal minor and smallest pivot of the
// diagonal-normalized correlation matrix C (unit |diagonal|), which isolates
// genuine sign from conditioning.
function normalizedMargin(G, n) {
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const m = 0.5 * (G[i][j] + G[j][i]);
      G[i][j] = G[j][i] = m;
    }
  let diagPos = 0, diagNeg = 0;
  for (let i = 0; i < n; i++) (G[i][i] >= 0 ? diagPos++ : diagNeg++);
  const orient = diagNeg > diagPos ? -1 : 1;
  const Go = orient === 1 ? G : G.map((r) => r.map((x) => -x));

  const C = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      C[i][j] = Go[i][j] / Math.sqrt(Math.abs(Go[i][i]) * Math.abs(Go[j][j]));

  const d = ldlPivots(C, n);
  let minPiv = Infinity, negPivots = 0;
  let minor = 1, minMinorSigned = 1;
  for (let i = 0; i < n; i++) {
    if (d[i] < minPiv) minPiv = d[i];
    if (d[i] <= 0) negPivots++;
    minor *= d[i];
    if (Math.abs(minor) < Math.abs(minMinorSigned)) minMinorSigned = minor;
  }
  return { minPivotSigned: minPiv, negativePivots: negPivots,
           smallestMinorSigned: minMinorSigned, isPD: negPivots === 0 };
}

// Fit y = log|margin| against x = log n by ordinary least squares; return the
// slope (decay exponent -p) and intercept. Also report the predominant sign of
// the signed margins (to decide which side of the cone the limit approaches).
function powerLawFit(series) {
  const pts = series.filter((s) => Number.isFinite(s.margin) && s.margin !== 0);
  if (pts.length < 2) return null;
  const xs = pts.map((s) => Math.log(s.n));
  const ys = pts.map((s) => Math.log(Math.abs(s.margin)));
  const mx = xs.reduce((p, q) => p + q, 0) / xs.length;
  const my = ys.reduce((p, q) => p + q, 0) / ys.length;
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  const slope = den !== 0 ? num / den : null;
  const intercept = slope !== null ? my - slope * mx : null;
  // residual R^2 of the log-log fit
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < ys.length; i++) {
    ssTot += (ys[i] - my) ** 2;
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) ** 2;
  }
  const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : null;
  const allNeg = pts.every((s) => s.margin < 0);
  const allPos = pts.every((s) => s.margin > 0);
  return {
    decayExponent: slope !== null ? -slope : null, // p in |margin| ~ C n^{-p}
    coefficient: intercept !== null ? Math.exp(intercept) : null,
    logLogR2: r2,
    marginSign: allNeg ? -1 : allPos ? 1 : 0,
  };
}

function main() {
  const t0 = performance.now();
  // finer a-grid (12 values, geometric-ish spread) and larger n.
  const A_VALUES = [0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0];
  const N_VALUES = [8, 16, 24, 32, 48, 64, 80, 96];
  const HALF_SPAN = 8.0;

  const rows = [];
  for (const a of A_VALUES) {
    const pre = precomputeForA(a);
    const series = [];
    for (const n of N_VALUES) {
      const { G } = gramMatrix(n, pre, HALF_SPAN);
      const m = normalizedMargin(G, n);
      series.push({
        n,
        minPivotSigned: m.minPivotSigned,
        smallestMinorSigned: m.smallestMinorSigned,
        negativePivots: m.negativePivots,
        isPD: m.isPD,
        // The smallest SIGNED normalized pivot is the conditioning-robust margin
        // (Sylvester: sign changes of the leading minors are governed by the
        // pivots). The product-of-pivots minor underflows to 0 for large n and
        // measures conditioning, not sign, so it is unusable as the margin.
        margin: m.minPivotSigned,
      });
    }
    const fit = powerLawFit(series);
    // Power-law extrapolation of the SIGNED margin to n -> infinity.
    // If p > 0 the magnitude -> 0; the signed limit is 0 to within the
    // largest-n residual. We report that residual as the achievable floor.
    const last = series[series.length - 1];
    let limitVerdict = 'inconclusive';
    if (fit && fit.decayExponent !== null) {
      if (fit.decayExponent > 0.15 && fit.marginSign === -1) limitVerdict = 'marginal-cone-boundary';
      else if (fit.decayExponent > 0.15 && fit.marginSign === 1) limitVerdict = 'positive-floor-shrinking';
      else if (fit.marginSign === 1) limitVerdict = 'positive-floor';
      else if (fit.marginSign === -1) limitVerdict = 'bounded-away-negative';
    }
    rows.push({
      a,
      series,
      fit,
      largestNMarginSigned: last.margin,
      limitVerdict,
    });
  }

  const allMarginal = rows.every((r) =>
    r.limitVerdict === 'marginal-cone-boundary' || r.limitVerdict === 'positive-floor');
  const anyBoundedNeg = rows.some((r) => r.limitVerdict === 'bounded-away-negative');
  const anyPositiveFloor = rows.some((r) =>
    r.limitVerdict === 'positive-floor' || r.limitVerdict === 'positive-floor-shrinking');

  const out = {
    ticket: 'imp-2456',
    builtOn: 'imp-2424 (scripts/compute-imp-2424-Ka-tp-certificate.mjs)',
    kernel: 'K_a(w,z) = (A_a(z)B_a(w) - B_a(z)A_a(w)) / (pi (w - z)), de Branges Wronskian form',
    quantity: 'smallest SIGNED pivot of the diagonal-normalized correlation matrix C (conditioning-robust minor margin)',
    grid: { halfSpan: HALF_SPAN },
    quadrature: { uMax: U_MAX, nodes: NU, rule: 'composite Simpson' },
    aValues: A_VALUES,
    nValues: N_VALUES,
    rows,
    summary: {
      everyCellMarginNegativeOrZero: rows.every((r) => r.series.every((s) => s.margin <= 1e-12)),
      allCellsMarginalOrPositive: allMarginal,
      anyBoundedAwayNegative: anyBoundedNeg,
      anyStrictlyPositiveFloor: anyPositiveFloor,
      medianDecayExponent: (() => {
        const ps = rows.map((r) => r.fit && r.fit.decayExponent).filter((x) => Number.isFinite(x)).sort((x, y) => x - y);
        return ps.length ? ps[Math.floor(ps.length / 2)] : null;
      })(),
    },
    elapsedMs: Math.round(performance.now() - t0),
    scope: 'NUMERICAL extrapolation of the K_a minor margin. Not a proof of B_a^+ = 1.',
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

main();
