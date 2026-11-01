// Floating-point diagnostics for a supplied finite real symmetric matrix.
// This is neither an interval certificate nor a total-positivity/inertia test.
// Tolerances are numerical stopping rules, not rigorous error enclosures.
const PIVOT_TOL = 128 * Number.EPSILON;
const SYMMETRY_TOL = 64 * Number.EPSILON;
const RESIDUAL_TOL = 512 * Number.EPSILON;

function unavailable(status, reason, extra = {}) {
  return {
    status, reason, rigorous: false, isPositiveDefinite: null,
    minPivot: null, negativePivots: null, smallestLeadingMinor: null,
    leadingMinorStatus: 'unavailable', computedPivots: [],
    completedPivots: 0, relativeResidual: null, ...extra,
  };
}

// Copy before any averaging. A nonzero asymmetry is only accepted within the
// displayed relative tolerance; the result then describes the symmetrized copy.
function prepareMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) return { reason: 'empty-or-invalid-matrix' };
  const n = matrix.length;
  let scale = 0;
  for (let i = 0; i < n; i++) {
    const row = matrix[i];
    if (!(Array.isArray(row) || row instanceof Float64Array) || row.length !== n) {
      return { reason: 'not-square' };
    }
    for (let j = 0; j < n; j++) {
      if (!Number.isFinite(row[j])) return { reason: 'nonfinite-entry' };
      scale = Math.max(scale, Math.abs(row[j]));
    }
  }
  const copy = matrix.map(row => Array.from(row));
  let symmetryError = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = copy[i][j], b = copy[j][i];
      const error = scale === 0 ? 0 : Math.abs(a / scale - b / scale);
      symmetryError = Math.max(symmetryError, error);
      if (error > SYMMETRY_TOL) return { reason: 'not-symmetric' };
      // Equal subnormal entries must not disappear in (a/2 + b/2).
      const mean = a === b ? a : a / 2 + b / 2;
      if (!Number.isFinite(mean)) return { reason: 'nonfinite-symmetrization' };
      copy[i][j] = copy[j][i] = mean;
    }
  }
  return { matrix: copy, scale, symmetryError };
}

function factorPrepared(matrix, scale, symmetryError) {
  const n = matrix.length;
  const metadata = {
    matrixScale: scale, symmetryError,
    symmetrized: symmetryError !== 0,
    relativePivotTolerance: PIVOT_TOL * n,
    relativeResidualTolerance: RESIDUAL_TOL * n,
  };
  if (scale === 0) return unavailable('indeterminate', 'zero-pivot', metadata);
  const A = matrix.map(row => row.map(x => x / scale));
  if (A.some((row, i) => row.some((x, j) => x === 0 && matrix[i][j] !== 0))) {
    return unavailable('invalid', 'rescaling-underflow', metadata);
  }
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const d = [], pivots = [];
  const stop = (status, reason) => unavailable(status, reason, {
    ...metadata, computedPivots: pivots.slice(), completedPivots: pivots.length,
  });
  for (let j = 0; j < n; j++) {
    let pivot = A[j][j];
    for (let k = 0; k < j; k++) pivot -= L[j][k] * L[j][k] * d[k];
    if (!Number.isFinite(pivot)) return stop('invalid', 'nonfinite-factorization');
    if (pivot === 0) return stop('indeterminate', 'zero-pivot');
    if (Math.abs(pivot) <= PIVOT_TOL * n) return stop('indeterminate', 'small-pivot');
    const originalPivot = pivot * scale;
    if (!Number.isFinite(originalPivot) || originalPivot === 0) {
      return stop('invalid', 'unrepresentable-pivot');
    }
    d.push(pivot);
    pivots.push(originalPivot);
    L[j][j] = 1;
    for (let i = j + 1; i < n; i++) {
      let value = A[i][j];
      for (let k = 0; k < j; k++) value -= L[i][k] * L[j][k] * d[k];
      L[i][j] = value / pivot;
      if (!Number.isFinite(L[i][j])) return stop('invalid', 'nonfinite-factorization');
    }
  }
  let residual = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let reconstructed = 0;
      for (let k = 0; k <= Math.min(i, j); k++) reconstructed += L[i][k] * d[k] * L[j][k];
      residual = Math.max(residual, Math.abs(A[i][j] - reconstructed));
    }
  }
  if (!Number.isFinite(residual)) return stop('invalid', 'nonfinite-residual');
  if (residual > RESIDUAL_TOL * n) {
    return { ...stop('indeterminate', 'large-factorization-residual'), relativeResidual: residual };
  }

  // Only a completed factorization can supply these full-matrix statistics.
  // Under/overflow of a minor product is NOT a zero/infinite determinant.
  let product = 1, minMinor = null, minorStatus = 'available';
  for (const pivot of pivots) {
    product *= pivot;
    if (!Number.isFinite(product) || product === 0) {
      minorStatus = product === 0 ? 'underflow' : 'overflow';
      minMinor = null;
      break;
    }
    if (minMinor === null || Math.abs(product) < Math.abs(minMinor)) minMinor = product;
  }
  const negativePivots = pivots.filter(x => x < 0).length;
  return {
    ...metadata,
    status: negativePivots === 0 ? 'numerically-positive-definite' : 'numerically-not-positive-definite',
    reason: null, rigorous: false, isPositiveDefinite: negativePivots === 0,
    minPivot: Math.min(...pivots), negativePivots,
    smallestLeadingMinor: minMinor, leadingMinorStatus: minorStatus,
    computedPivots: pivots, completedPivots: n, relativeResidual: residual,
  };
}

export function diagnoseMatrix(matrix) {
  const prepared = prepareMatrix(matrix);
  if (prepared.reason) {
    return { ...unavailable('invalid', prepared.reason), orientationFlip: false,
      normalized: unavailable('invalid', prepared.reason) };
  }
  const { matrix: G, scale, symmetryError } = prepared;
  const raw = factorPrepared(G, scale, symmetryError);
  let normalized;
  if (G.some((row, i) => row[i] === 0)) {
    normalized = unavailable('invalid', 'zero-diagonal-scale');
  } else {
    // D G D with D_ii = 1/sqrt(|G_ii|), not a change of orientation.
    // Negative diagonals remain -1; this is not necessarily a correlation matrix.
    const roots = G.map((row, i) => Math.sqrt(Math.abs(row[i])));
    const C = G.map((row, i) => row.map((x, j) => (x / roots[i]) / roots[j]));
    if (C.some((row, i) => row.some((x, j) => !Number.isFinite(x) || (x === 0 && G[i][j] !== 0)))) {
      normalized = unavailable('invalid', 'unrepresentable-diagonal-scaling');
    } else {
      const p = prepareMatrix(C);
      normalized = p.reason ? unavailable('invalid', p.reason) : factorPrepared(p.matrix, p.scale, p.symmetryError);
    }
  }
  return { ...raw, orientationFlip: false, normalized };
}

// Invalid, incomplete and empty runs must not become positive by vacuity.
// Unknown takes priority over negative here: a partial sweep is not complete.
export function summarizeDiagnostics(diagnostics) {
  const counts = { total: diagnostics.length, positive: 0, nonPositive: 0, invalid: 0, indeterminate: 0 };
  for (const d of diagnostics) {
    if (d?.status === 'numerically-positive-definite' && d.isPositiveDefinite === true) counts.positive++;
    else if (d?.status === 'numerically-not-positive-definite' && d.isPositiveDefinite === false) counts.nonPositive++;
    else if (d?.status === 'indeterminate') counts.indeterminate++;
    else counts.invalid++;
  }
  const complete = counts.total > 0 && counts.invalid === 0 && counts.indeterminate === 0;
  return {
    status: counts.total === 0 ? 'empty' : complete ? 'complete-numerical-diagnostics' : 'inconclusive',
    rigorous: false, counts,
    allPositiveDefinite: complete ? counts.nonPositive === 0 : null,
  };
}

export function pivotMagnitudeLogLogSlope(series) {
  const complete = summarizeDiagnostics(series.map(s => s.normalized));
  if (complete.allPositiveDefinite === null || series.length < 2) return null;
  if (series.some(s => !Number.isFinite(s.n) || s.n <= 0 || !Number.isFinite(s.normalized.minPivot) || s.normalized.minPivot === 0)) return null;
  const xs = series.map(s => Math.log(s.n));
  const ys = series.map(s => Math.log(Math.abs(s.normalized.minPivot)));
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  const slope = den === 0 ? null : num / den;
  return Number.isFinite(slope) ? slope : null;
}
