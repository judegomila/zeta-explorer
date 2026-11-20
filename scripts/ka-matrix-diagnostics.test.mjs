import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { diagnoseMatrix, summarizeDiagnostics, pivotMagnitudeLogLogSlope } from './lib/ka-matrix-diagnostics.mjs';

const roundTrip = value => JSON.parse(JSON.stringify(value));
function assertFiniteTree(value) {
  if (typeof value === 'number') assert.ok(Number.isFinite(value), `nonfinite output: ${value}`);
  else if (Array.isArray(value)) value.forEach(assertFiniteTree);
  else if (value && typeof value === 'object') Object.values(value).forEach(assertFiniteTree);
}
function assertUnknown(d) {
  assert.equal(d.isPositiveDefinite, null);
  assert.equal(d.minPivot, null);
  assert.equal(d.negativePivots, null);
  assert.equal(d.smallestLeadingMinor, null);
  assert.ok(d.reason);
  assertFiniteTree(d);
  assert.deepEqual(roundTrip(d), d);
}

test('negative identity keeps its sign in raw and diagonally scaled diagnostics', () => {
  const d = diagnoseMatrix([[-1, 0], [0, -1]]);
  assert.equal(d.orientationFlip, false);
  for (const result of [d, d.normalized]) {
    assert.equal(result.isPositiveDefinite, false);
    assert.equal(result.negativePivots, 2);
    assert.equal(result.minPivot, -1);
    assert.equal(result.rigorous, false);
  }
});

test('NaN and either infinity in every matrix location are invalid, never positive', () => {
  for (const bad of [NaN, Infinity, -Infinity, undefined, '1', null]) {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const G = [[1, 0], [0, 1]];
      G[i][j] = bad;
      const d = diagnoseMatrix(G);
      assert.equal(d.status, 'invalid');
      assertUnknown(d);
      assertUnknown(d.normalized);
    }
  }
});

test('empty, sparse, ragged and wrong-type matrices cannot pass by vacuity', () => {
  for (const G of [[], null, {}, [[1, 2]], [[1], [0, 1]], Array(2), [Array(1)], [new Int32Array([1])]]) {
    const d = diagnoseMatrix(G);
    assert.equal(d.status, 'invalid');
    assertUnknown(d);
  }
});

test('zero-pivot exchange matrix does not invent an LDL determinant or normalized verdict', () => {
  const G = [[0, 1], [1, 0]]; // exact determinant -1, eigenvalues +/-1
  assert.equal(G[0][0] * G[1][1] - G[0][1] * G[1][0], -1);
  const d = diagnoseMatrix(G);
  assert.equal(d.status, 'indeterminate');
  assert.equal(d.reason, 'zero-pivot');
  assert.equal(d.completedPivots, 0);
  assertUnknown(d);
  assert.equal(d.normalized.reason, 'zero-diagonal-scale');
  assertUnknown(d.normalized);
});

test('zero and rank-deficient positive semidefinite matrices are not declared PD', () => {
  for (const G of [[[0]], [[0, 0], [0, 0]], [[1, 1], [1, 1]]]) {
    const d = diagnoseMatrix(G);
    assert.equal(d.status, 'indeterminate');
    assertUnknown(d);
    assert.equal(d.normalized.isPositiveDefinite, null);
  }
  assert.equal(diagnoseMatrix([[1, 1], [1, 1]]).completedPivots, 1);
});

test('identity and a well-conditioned SPD matrix have finite completed numerical results', () => {
  for (const G of [[[1]], [[1, 0], [0, 1]], [[4, 2], [2, 3]]]) {
    const d = diagnoseMatrix(G);
    for (const result of [d, d.normalized]) {
      assert.equal(result.status, 'numerically-positive-definite');
      assert.equal(result.isPositiveDefinite, true);
      assert.equal(result.completedPivots, G.length);
      assert.equal(result.negativePivots, 0);
      assert.ok(result.relativeResidual <= result.relativeResidualTolerance);
      assert.equal(result.rigorous, false);
      assertFiniteTree(result);
    }
  }
  const d = diagnoseMatrix([[4, 2], [2, 3]]);
  assert.deepEqual(d.computedPivots, [4, 2]);
  assert.equal(d.smallestLeadingMinor, 4); // smallest absolute leading minor, not the final determinant8
});

test('positive definite is not total positivity', () => {
  const G = [[1, -0.5], [-0.5, 1]];
  assert.equal(G[0][0] * G[1][1] - G[0][1] * G[1][0], 0.75);
  assert.ok(G[0][1] < 0); // a negative ordered 1x1 minor refutes TP
  const d = diagnoseMatrix(G);
  assert.equal(d.isPositiveDefinite, true);
  assert.equal(d.rigorous, false);
  assert.equal('isTotallyPositive' in d, false);
});

test('complete indefinite and mixed-sign factorizations keep negative pivots', () => {
  for (const G of [[[1, 2], [2, 1]], [[-2, 0], [0, 3]]]) {
    const d = diagnoseMatrix(G);
    assert.equal(d.isPositiveDefinite, false);
    assert.equal(d.negativePivots, 1);
    assert.equal(d.normalized.isPositiveDefinite, false);
    assert.equal(d.orientationFlip, false);
    assertFiniteTree(d);
  }
});

test('small pivots stop with an explicit relative tolerance, not a clamped zero', () => {
  const d = diagnoseMatrix([[1, 1], [1, 1 + Number.EPSILON]]);
  assert.equal(d.reason, 'small-pivot');
  assertUnknown(d);
  assert.equal(d.completedPivots, 1);
  assert.ok(d.relativePivotTolerance > 0);
});

test('global rescaling handles tiny and huge diagonals without false zero determinants', () => {
  for (const scale of [Number.MIN_VALUE, 1e-200, 1e200, Number.MAX_VALUE]) {
    const d = diagnoseMatrix([[scale, 0], [0, scale]]);
    assert.equal(d.isPositiveDefinite, true);
    assert.equal(d.normalized.isPositiveDefinite, true);
    assertFiniteTree(d);
    assert.equal(d.smallestLeadingMinor, null);
    assert.equal(d.leadingMinorStatus, scale < 1 ? 'underflow' : 'overflow');
  }
});

test('unrepresentable rescaling and pivot arithmetic fail closed', () => {
  const underflow = diagnoseMatrix([[Number.MAX_VALUE, Number.MIN_VALUE], [Number.MIN_VALUE, 1]]);
  assert.equal(underflow.reason, 'rescaling-underflow');
  assertUnknown(underflow);
  const overflow = diagnoseMatrix([[1e308, 1e308], [1e308, -1e308]]);
  assert.equal(overflow.reason, 'unrepresentable-pivot');
  assertUnknown(overflow);
  assertFiniteTree(overflow.normalized);
});

test('non-symmetry is rejected; tiny accepted averaging is explicit and does not mutate input', () => {
  const bad = [[1, 1], [-1, 1]];
  assert.equal(diagnoseMatrix(bad).reason, 'not-symmetric');
  assert.deepEqual(bad, [[1, 1], [-1, 1]]);
  const G = Object.freeze([Object.freeze([2, 0.5]), Object.freeze([0.5 + Number.EPSILON, 2])]);
  const d = diagnoseMatrix(G);
  assert.equal(d.symmetrized, true);
  assert.ok(d.symmetryError > 0);
  assert.equal(d.isPositiveDefinite, true);
  assert.equal(G[1][0], 0.5 + Number.EPSILON);
  const typed = [new Float64Array([2, 1]), new Float64Array([1, 2])];
  assert.equal(diagnoseMatrix(typed).isPositiveDefinite, true);
  assert.deepEqual(Array.from(typed[0]), [2, 1]);
});

test('small exact integer 2x2 witnesses never turn non-PD into a positive numerical result', () => {
  for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) {
    const exactPD = a > 0 && a * c - b * b > 0;
    const d = diagnoseMatrix([[a, b], [b, c]]);
    for (const result of [d, d.normalized]) {
      assertFiniteTree(result);
      if (result.isPositiveDefinite !== null) assert.equal(result.isPositiveDefinite, exactPD);
    }
  }
});

test('empty, all-invalid and mixed incomplete aggregate diagnostics remain inconclusive', () => {
  const positive = diagnoseMatrix([[1]]), negative = diagnoseMatrix([[-1]]);
  const invalid = diagnoseMatrix([[NaN]]), unknown = diagnoseMatrix([[0]]);
  assert.equal(summarizeDiagnostics([]).status, 'empty');
  assert.equal(summarizeDiagnostics([]).allPositiveDefinite, null);
  for (const list of [[invalid], [unknown], [positive, invalid], [negative, unknown], [{}]]) {
    const s = summarizeDiagnostics(list);
    assert.equal(s.status, 'inconclusive');
    assert.equal(s.allPositiveDefinite, null);
    assert.deepEqual(roundTrip(s), s);
  }
  assert.equal(summarizeDiagnostics([positive, positive]).allPositiveDefinite, true);
  assert.equal(summarizeDiagnostics([positive, negative]).allPositiveDefinite, false);
});

test('serialization preserves the true/false/null distinction and reasons', () => {
  const rows = [diagnoseMatrix([[1]]), diagnoseMatrix([[-1]]), diagnoseMatrix([[NaN]]), diagnoseMatrix([[0]])];
  const output = { rows, diagnostics: summarizeDiagnostics(rows) };
  assertFiniteTree(output);
  const parsed = roundTrip(output);
  assert.deepEqual(parsed.rows.map(r => r.isPositiveDefinite), [true, false, null, null]);
  assert.equal(parsed.diagnostics.allPositiveDefinite, null);
  assert.equal(parsed.rows[2].reason, 'nonfinite-entry');
  assert.equal(parsed.rows[3].reason, 'zero-pivot');
});

test('pivot slope requires a complete finite series, never silently drops invalid cells', () => {
  const row = (n, minPivot) => ({ n, normalized: { ...diagnoseMatrix([[1]]).normalized, minPivot } });
  assert.ok(Math.abs(pivotMagnitudeLogLogSlope([row(2, 0.25), row(4, 0.0625)]) + 2) < 1e-12);
  for (const series of [[], [row(2, 1)], [row(2, 1), row(2, 1)], [row(0, 1), row(2, 1)], [row(2, null), row(4, 1)], [row(2, Infinity), row(4, 1)], [row(2, 1), { n: 4, normalized: diagnoseMatrix([[NaN]]) }]]) {
    assert.equal(pivotMagnitudeLogLogSlope(series), null);
  }
});

test('importing the generator is side-effect free and never runs the quadrature sweep', () => {
  const url = new URL('./compute-imp-2424-Ka-tp-certificate.mjs', import.meta.url).href;
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(url)})`], { encoding: 'utf8', timeout: 5000 });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(child.stdout, '');
  assert.equal(child.stderr, '');
});

test('generator keeps the normalization retraction and labels the historical record as not replayed', () => {
  const source = readFileSync(new URL('./compute-imp-2424-Ka-tp-certificate.mjs', import.meta.url), 'utf8');
  for (const required of ['NORMALIZATION RETRACTION (2026-07-24)', 'SURROGATE / INVALID FOR T3', 'appliesToExactRiemannKernel: false', 'rigorous: false', 'precisionDigits: 60', '4.66922095265e-5', '0.0387394724', '0.000150634109', '1.4487899474e-7', 'replayedByThisScript: false', 'totalPositivityTested: false', 'schemaVersion: 2']) assert.ok(source.includes(required), required);
  assert.ok(source.includes('normalizedSummary.allPositiveDefinite'));
  assert.ok(source.includes('No quadrature, roundoff, all-minors or continuum certificate'));
  assert.ok(!source.includes('diagNeg > diagPos'));
});
