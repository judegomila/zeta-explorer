#!/usr/bin/env node
// imp-2456: historical extrapolation of the imp-2424 SURROGATE matrix.
//
// NORMALIZATION RETRACTION (2026-07-24)
// --------------------------------------
// imp-2424 and this script use
//   (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})
// with unscaled cosh(au), cos(zu), sinh(au), sin(zu). The canonical kernel is
//   Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u})
//                    exp(-pi n^2 e^{4u}),
//   X(w) = 8 integral_0^infinity Phi(u) cosh(2wu) du.
// Thus the fitted negative pivots and any "cone boundary" language describe
// only the historical surrogate. They are INVALID FOR T3 and cannot constrain
// the exact Riemann kernel. The historical record reports a positive 60-digit
// canonical four-node numerical check, not replayed here and not a proof.
// The normalization mismatch itself already invalidates the surrogate transfer.
//
// NUMERICAL SAFETY CORRECTION (2026-11-01)
// The old inline sign flip / zero-pivot / nonfinite handling is invalidated.
// This producer now reuses finite diagnostics from imp-2424's safety repair.
// Its historical values remain in the data record, not as verified evidence.
// No corrected full sweep has been replayed as part of this safety repair.
// Neither floating LDL diagnostics nor a finite OLS fit is a certificate.

import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import {
  diagnoseMatrix, summarizeDiagnostics, pivotMagnitudeLogLogSlope,
} from './lib/ka-matrix-diagnostics.mjs';

// Historical imp-2424 surrogate (not the canonical completed-Riemann Phi).
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
let QUAD;
function getQuad() { return QUAD ??= buildQuad(); }

function precomputeForA(a) {
  const { u } = getQuad();
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
  const { h, u, w } = getQuad();
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

// Pure finite-matrix adapter. Keep the raw and normalized results distinct.
// The helper uses positive diagonal congruence; it never changes G to -G.
export function normalizedMargin(G) {
  const diagnostic = diagnoseMatrix(G);
  const normalized = diagnostic.normalized;
  return {
    ...normalized,
    minPivotSigned: normalized.minPivot,
    smallestMinorSigned: normalized.smallestLeadingMinor,
    isPD: normalized.isPositiveDefinite,
    margin: normalized.minPivot,
    raw: diagnostic,
    normalized,
  };
}

// Finite OLS diagnostic only. Any missing/invalid cell blocks the fit;
// there is no silent removal of failed cells and no inferred continuum limit.
export function powerLawFit(series) {
  if (!Array.isArray(series) || series.length < 2 ||
      series.some(s => !s || !s.normalized)) return null;
  const slope = pivotMagnitudeLogLogSlope(series);
  if (slope === null) return null;
  const xs = series.map(s => Math.log(s.n));
  const ys = series.map(s => Math.log(Math.abs(s.normalized.minPivot)));
  const mx = xs.reduce((p, q) => p + q, 0) / xs.length;
  const my = ys.reduce((p, q) => p + q, 0) / ys.length;
  const intercept = my - slope * mx;
  const coefficient = Math.exp(intercept);
  if (!Number.isFinite(coefficient) || coefficient === 0) return null;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < ys.length; i++) {
    ssTot += (ys[i] - my) ** 2;
    ssRes += (ys[i] - (intercept + slope * xs[i])) ** 2;
  }
  const r2 = ssTot === 0 ? null : 1 - ssRes / ssTot;
  if (r2 !== null && !Number.isFinite(r2)) return null;
  const allNeg = series.every(s => s.normalized.minPivot < 0);
  const allPos = series.every(s => s.normalized.minPivot > 0);
  return {
    status: 'finite-log-log-diagnostic', rigorous: false,
    pointCount: series.length,
    decayExponent: slope === 0 ? 0 : -slope,
    coefficient, logLogR2: r2,
    marginSign: allNeg ? -1 : allPos ? 1 : 0,
    continuumInference: null,
    scope: 'Descriptive fit of finite pivot magnitudes, not an asymptotic law, eigenvalue gap or positivity bound.',
  };
}

export function summarizeRows(rows) {
  const validRows = Array.isArray(rows) && rows.length > 0 &&
    Array.from(rows).every(r => r && Array.isArray(r.series) && r.series.length > 0 &&
      Array.from(r.series).every(s => s && s.normalized));
  const cells = validRows ? rows.flatMap(r => r.series) : [];
  const diagnostics = cells.map(s => s?.normalized);
  const numerical = summarizeDiagnostics(diagnostics);
  const complete = validRows &&
    numerical.status === 'complete-numerical-diagnostics' &&
    cells.every(s => Number.isFinite(s.normalized.minPivot));
  const exponents = validRows ? rows.map(r => r.fit?.decayExponent) : [];
  const allFitsAvailable = complete && exponents.every(Number.isFinite);
  const sorted = allFitsAvailable ? [...exponents].sort((a, b) => a - b) : [];
  const middle = Math.floor(sorted.length / 2);
  const median = !sorted.length ? null : sorted.length % 2 ?
    sorted[middle] : sorted[middle - 1] / 2 + sorted[middle] / 2;
  return {
    numerical,
    allExpectedCellsDiagnosed: complete,
    everyCompletedFiniteMarginNonpositive: complete ?
      cells.every(s => s.normalized.minPivot <= 0) : null,
    finiteFitMedianDecayExponent: median,
    // Legacy fields are withdrawn, not false claims of the opposite verdict.
    everyCellMarginNegativeOrZero: null,
    allCellsMarginalOrPositive: null,
    anyBoundedAwayNegative: null,
    anyStrictlyPositiveFloor: null,
    medianDecayExponent: null,
    continuumStatus: 'not-inferred',
    scope: 'Finite floating matrix diagnostics only; incomplete cells remain unknown and no continuum floor or limit follows.',
  };
}

export function main() {
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
      const m = normalizedMargin(G);
      series.push({
        n,
        status: m.status,
        reason: m.reason,
        rigorous: false,
        minPivotSigned: m.minPivotSigned,
        smallestMinorSigned: m.smallestMinorSigned,
        negativePivots: m.negativePivots,
        isPD: m.isPD,
        margin: m.margin,
        raw: m.raw,
        normalized: m.normalized,
      });
    }
    const fit = powerLawFit(series);
    const last = series[series.length - 1];
    rows.push({
      a,
      series,
      fit,
      largestNMarginSigned: last.margin,
      limitVerdict: 'not-inferred-from-finite-diagnostics',
    });
  }

  const out = {
    ticket: 'imp-2456',
    builtOn: 'imp-2424 (scripts/compute-imp-2424-Ka-tp-certificate.mjs)',
    status: 'SURROGATE / INVALID FOR T3',
    kernelModel: 'historical-surrogate-normalization',
    numericalAlgorithm: 'sign-preserving-validated-floating-LDL',
    rigorous: false,
    proofClaim: false,
    historicalDiagnostics: {
      status: 'invalidated-pre-correction-not-current-evidence',
      reason: 'Old orientation flip, zero-pivot substitution and nonfinite comparisons invalidated the diagnostic contract.',
      correctedSweepDuringSafetyRepair: 'not-rerun',
    },
    appliesToExactRiemannKernel: false,
    kernel: 'surrogate Wronskian matrix inherited from imp-2424',
    normalizationAudit: {
      implementedPhi: '(2 pi^2 n^4 e^(4u) - 3 pi n^2 e^(2u)) exp(-pi n^2 e^(4u))',
      canonicalPhi: '(2 pi^2 n^4 e^(9u) - 3 pi n^2 e^(5u)) exp(-pi n^2 e^(4u))',
      canonicalTransform: 'X(w) = 8 integral Phi(u) cosh(2 w u) du',
      omittedTransformArgumentFactor: 2,
    },
    correctedCanonicalFourNodeNumericalCheck: {
      status: 'positive-numerical-only',
      provenance: 'Stored historical claim, not computed or replayed by this producer.',
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
    quantity: 'finite floating minimum pivot of the sign-preserving SURROGATE diagonal congruence, when available',
    grid: { halfSpan: HALF_SPAN },
    quadrature: { uMax: U_MAX, nodes: NU, rule: 'composite Simpson' },
    aValues: A_VALUES,
    nValues: N_VALUES,
    rows,
    summary: summarizeRows(rows),
    elapsedMs: Math.round(performance.now() - t0),
    scope:
      'FINITE SURROGATE DIAGNOSTICS ONLY. No continuum limit or floor is inferred. No negative-minor or PSD-cone-boundary inference ' +
      'applies to exact K_a or T3; no B_a^+, Lambda, or RH conclusion follows.',
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
