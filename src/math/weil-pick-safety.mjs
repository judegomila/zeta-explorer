// Finite floating-point diagnostics, not interval or arithmetic certificates.
// No zeta evaluator, corpus, file access, or computation at module load.

const finiteComplex = (z) => Array.isArray(z) && z.length === 2 && Array.from(z).every(Number.isFinite);
const invalid = (reason) => ({ status: 'invalid', reason, negIndex: null });

export function divideComplex(a, b) {
  if (!finiteComplex(a) || !finiteComplex(b)) throw new RangeError('nonfinite complex input');
  const scale = Math.max(Math.abs(b[0]), Math.abs(b[1]));
  if (scale === 0) throw new RangeError('pole / zero denominator');
  const br = b[0] / scale, bi = b[1] / scale, den = br * br + bi * bi;
  const ar = a[0] / scale, ai = a[1] / scale;
  const value = [(ar * br + ai * bi) / den, (ai * br - ar * bi) / den];
  if (!finiteComplex(value)) throw new RangeError('nonfinite complex quotient');
  return value;
}

export function weilPoleBlock(halfTransforms, parity) {
  if (!['even', 'odd'].includes(parity)) throw new RangeError('parity must be even or odd');
  if (!Array.isArray(halfTransforms) || !halfTransforms.length || !Array.from(halfTransforms).every(Number.isFinite)) {
    throw new RangeError('finite nonempty half-transform vector required');
  }
  const sign = parity === 'odd' ? -2 : 2;
  const block = halfTransforms.map((a) => halfTransforms.map((b) => sign * a * b));
  if (!block.every((r) => r.every(Number.isFinite))) throw new RangeError('nonfinite pole block');
  return block;
}

// Jacobi rotations on a scaled real symmetric matrix. Residuals check the
// computed eigenpairs against the original matrix; these are NOT error balls.
export function symmetricEigenDiagnostics(input, { maxSweeps = 200, tolerance = 1e-13 } = {}) {
  const n = input?.length;
  if (!Number.isInteger(n) || n < 1 || !Array.from(input).every((r) =>
    r?.length === n && Array.from(r).every(Number.isFinite))) return invalid('finite nonempty square matrix required');
  if (!Number.isInteger(maxSweeps) || maxSweeps < 0 || !Number.isFinite(tolerance) || tolerance <= 0 || tolerance > 1e-6) {
    return invalid('invalid eigensolver options');
  }
  let scale = 0;
  for (const row of input) for (const x of row) scale = Math.max(scale, Math.abs(x));
  scale ||= 1;
  const original = Array.from(input, (r) => Array.from(r, (x) => x / scale));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (Math.abs(original[i][j] - original[j][i]) > tolerance) return invalid('matrix is not symmetric');
  }
  const A = original.map((r) => r.slice());
  const V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j)));
  const offNorm = () => {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off = Math.hypot(off, A[i][j]);
    return Math.SQRT2 * off;
  };
  const norm = Math.hypot(...original.flat()) || 1;
  let sweeps = 0;
  while (offNorm() > tolerance * norm && sweeps < maxSweeps) {
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      const apq = A[p][q];
      if (Math.abs(apq) <= tolerance * norm / (n * n)) continue;
      const theta = (A[q][q] - A[p][p]) / (2 * apq);
      // theta = 0 requires a 45-degree rotation, not Math.sign(0) = 0.
      const t = (theta < 0 ? -1 : 1) / (Math.abs(theta) + Math.hypot(theta, 1));
      const c = 1 / Math.hypot(1, t), s = t * c;
      const app = A[p][p], aqq = A[q][q];
      A[p][p] = app - t * apq;
      A[q][q] = aqq + t * apq;
      A[p][q] = A[q][p] = 0;
      for (let k = 0; k < n; k++) {
        if (k !== p && k !== q) {
          const akp = A[k][p], akq = A[k][q];
          A[k][p] = A[p][k] = c * akp - s * akq;
          A[k][q] = A[q][k] = s * akp + c * akq;
        }
        const vkp = V[k][p], vkq = V[k][q];
        V[k][p] = c * vkp - s * vkq;
        V[k][q] = s * vkp + c * vkq;
      }
    }
    sweeps++;
  }
  let residual = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    let av = 0;
    for (let k = 0; k < n; k++) av += original[i][k] * V[k][j];
    residual = Math.hypot(residual, av - V[i][j] * A[j][j]);
  }
  const relativeResidual = residual / norm, offDiagonalResidual = offNorm() / norm;
  const eigenpairs = A.map((r, i) => ({ value: r[i] * scale, vec: V.map((v) => v[i]) })).sort((a, b) => a.value - b.value);
  if (!eigenpairs.every((p) => Number.isFinite(p.value) && p.vec.every(Number.isFinite)) ||
      !Number.isFinite(relativeResidual) || !Number.isFinite(offDiagonalResidual)) return invalid('nonfinite eigensolver output');
  const converged = offDiagonalResidual <= tolerance && relativeResidual <= 10 * tolerance;
  return {
    status: converged ? 'diagnostic' : 'inconclusive',
    reason: converged ? null : 'Jacobi convergence / residual tolerance not met',
    eigenpairs, eigenvalues: eigenpairs.map((p) => p.value), sweeps,
    relativeResidual, offDiagonalResidual, converged, certified: false,
  };
}

export function pickMatrix(nodes, evaluate, { poles = [] } = {}) {
  if (!Array.isArray(nodes) || !nodes.length || !Array.from(nodes).every((z) => finiteComplex(z) && z[1] > 0)) {
    throw new RangeError('nonempty finite upper-half-plane nodes required');
  }
  if (typeof evaluate !== 'function' || !Array.isArray(poles) || !Array.from(poles).every(finiteComplex)) {
    throw new RangeError('evaluator and finite pole list required');
  }
  // Check the whole domain before even evaluating m, including known poles.
  if (nodes.some((z) => poles.some((p) => z[0] === p[0] && z[1] === p[1]))) {
    throw new RangeError('node coincides with a pole');
  }
  const values = nodes.map((z) => {
    const v = evaluate(z);
    if (!finiteComplex(v)) throw new RangeError('nonfinite m(node)');
    return v;
  });
  return nodes.map((z, j) => nodes.map((w, k) => divideComplex(
    [values[j][0] - values[k][0], values[j][1] + values[k][1]],
    [z[0] - w[0], z[1] + w[1]],
  )));
}

export function hermitianInertiaDiagnostic(P, options = {}) {
  const n = P?.length;
  if (!Number.isInteger(n) || n < 1 || !Array.isArray(P) || !Array.from(P).every((r) =>
    Array.isArray(r) && r.length === n && Array.from(r).every(finiteComplex))) return invalid('finite nonempty Hermitian matrix required');
  let scale = 1;
  for (const row of P) for (const z of row) scale = Math.max(scale, Math.abs(z[0]), Math.abs(z[1]));
  const M = Array.from({ length: 2 * n }, () => Array(2 * n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (Math.abs(P[i][j][0] / scale - P[j][i][0] / scale) > 1e-13 ||
        Math.abs(P[i][j][1] / scale + P[j][i][1] / scale) > 1e-13) return invalid('matrix is not Hermitian');
    const [a, b] = P[i][j];
    M[i][j] = M[i + n][j + n] = a;
    M[i + n][j] = b; M[i][j + n] = -b;
  }
  const result = symmetricEigenDiagnostics(M, options);
  if (result.status !== 'diagnostic') return { ...result, negIndex: null };
  const maxAbs = Math.max(...result.eigenvalues.map(Math.abs));
  const threshold = 1e-9 * maxAbs;
  const negativeCount = result.eigenvalues.filter((x) => x < -threshold).length;
  // Every Hermitian eigenvalue occurs twice in the real embedding.
  if (negativeCount % 2) return { ...result, status: 'inconclusive', reason: 'unpaired real-embedding negative count', negIndex: null, threshold };
  return { ...result, negIndex: negativeCount / 2, realEmbeddingNegativeCount: negativeCount, threshold,
    scope: 'thresholded finite floating-point inertia, not a certified exact index' };
}

export function evaluatePickDiagnostic(nodes, evaluate, options = {}) {
  try {
    return hermitianInertiaDiagnostic(pickMatrix(nodes, evaluate, options), options);
  } catch (error) {
    return invalid(error instanceof Error ? error.message : String(error));
  }
}

export function summarizeWeilRows(rows, threshold = -1e-8) {
  const valid = Array.isArray(rows) && rows.length > 0 && Number.isFinite(threshold) &&
    Array.from(rows).every((r) => r?.status === 'diagnostic' && Number.isFinite(r.lambdaMinC) && typeof r.psdC === 'boolean');
  if (!valid) return { status: 'inconclusive', allSampledAboveTolerance: false,
    reading: 'Invalid, empty, nonfinite or unconverged block: no positivity conclusion. Not an RH test certificate.' };
  const allSampledAboveTolerance = rows.every((r) => r.psdC && r.lambdaMinC >= threshold);
  return { status: 'diagnostic', allSampledAboveTolerance,
    reading: allSampledAboveTolerance
      ? 'All computed blocks meet the stated floating tolerance. Finite quadrature and eigenvalue diagnostics only; no certified PSD, uniform floor, or RH conclusion.'
      : 'At least one computed block fails the floating positivity tolerance. This is a numerical diagnostic, not a certified negative Weil vector or an RH counterexample.' };
}
