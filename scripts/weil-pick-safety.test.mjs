import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  divideComplex, weilPoleBlock, symmetricEigenDiagnostics, pickMatrix,
  hermitianInertiaDiagnostic, evaluatePickDiagnostic, summarizeWeilRows,
} from '../src/math/weil-pick-safety.mjs';
import * as monomial from '../src/data/imp-2442-offline-finite-kappa-pontryagin-2026-06.js';
import * as signed from '../src/data/imp-2454-offline-zero-pick-index-jump-2026-06.js';
import { main as weilMain } from './compute-imp-2440-weil-positivity-scaling.mjs';

const close = (a, b, tolerance = 1e-11) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

test('parity-aware exact pole block; old odd surplus is +4HH^T', () => {
  const H = [1, 2], even = weilPoleBlock(H, 'even'), odd = weilPoleBlock(H, 'odd');
  assert.deepEqual(even, [[2, 4], [4, 8]]);
  assert.deepEqual(odd, [[-2, -4], [-4, -8]]);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) assert.equal(even[i][j] - odd[i][j], 4 * H[i] * H[j]);
  for (const h of [[], Array(2), [NaN], [Infinity], [1e308]]) assert.throws(() => weilPoleBlock(h, 'odd'));
  assert.throws(() => weilPoleBlock(H, 'unknown'));
});

test('Weil summary cannot ignore failed flags, nonfinite or empty input', () => {
  const row = { status: 'diagnostic', lambdaMinC: 0.2, psdC: true };
  assert.equal(summarizeWeilRows([row]).allSampledAboveTolerance, true);
  for (const rows of [[], null, [{ ...row, status: 'invalid' }], [{ ...row, lambdaMinC: NaN }], [{ ...row, lambdaMinC: Infinity }]]) {
    const r = summarizeWeilRows(rows);
    assert.equal(r.status, 'inconclusive'); assert.equal(r.allSampledAboveTolerance, false);
  }
  for (const bad of [{ ...row, psdC: false }, { ...row, lambdaMinC: -0.1 }]) {
    const r = summarizeWeilRows([row, bad]);
    assert.equal(r.allSampledAboveTolerance, false);
    assert.match(r.reading, /fails/);
  }
});

test('equal diagonal Jacobi regression and independent trace/determinant', () => {
  const r = symmetricEigenDiagnostics([[0, 1], [1, 0]]);
  assert.equal(r.status, 'diagnostic');
  close(r.eigenvalues[0], -1); close(r.eigenvalues[1], 1);
  close(r.eigenvalues.reduce((a, b) => a + b), 0);
  close(r.eigenvalues.reduce((a, b) => a * b), -1);
  assert.ok(r.relativeResidual < 1e-12);
  const s = symmetricEigenDiagnostics([[3, -4], [-4, 3]]);
  close(s.eigenvalues[0], -1); close(s.eigenvalues[1], 7);
});

test('scaled Jacobi handles one-by-one, zero, small and large finite matrices', () => {
  assert.deepEqual(symmetricEigenDiagnostics([[3]]).eigenvalues, [3]);
  assert.deepEqual(symmetricEigenDiagnostics([[0, 0], [0, 0]]).eigenvalues, [0, 0]);
  for (const s of [1e-250, 1e250]) {
    const r = symmetricEigenDiagnostics([[0, s], [s, 0]]);
    assert.equal(r.status, 'diagnostic'); close(r.eigenvalues[0] / s, -1); close(r.eigenvalues[1] / s, 1);
  }
});

test('invalid and nonconvergent matrices fail closed', () => {
  for (const A of [[], [[NaN]], [[Infinity]], [[1, 2]], [[1, 3], [2, 1]], null]) {
    assert.equal(symmetricEigenDiagnostics(A).status, 'invalid');
  }
  const r = symmetricEigenDiagnostics([[0, 1], [1, 0]], { maxSweeps: 0 });
  assert.equal(r.status, 'inconclusive'); assert.equal(r.converged, false);
  const h = hermitianInertiaDiagnostic([[[0, 0], [1, 0]], [[1, 0], [0, 0]]], { maxSweeps: 0 });
  assert.equal(h.negIndex, null);
});

test('Hermitian real embedding doubles negative multiplicity before halving', () => {
  const P = [[[0, 0], [0, 1]], [[0, -1], [0, 0]]];
  const r = hermitianInertiaDiagnostic(P);
  assert.equal(r.status, 'diagnostic'); assert.equal(r.realEmbeddingNegativeCount, 2); assert.equal(r.negIndex, 1);
  assert.deepEqual(r.eigenvalues.map((x) => Math.round(x)), [-1, -1, 1, 1]);
  for (const bad of [[], Array(2), [[Array(2)]], [[[NaN, 0]]], [[[1, 2]]], [[[1, 0], [1, 0]], [[0, 0], [1, 0]]]]) {
    assert.equal(hermitianInertiaDiagnostic(bad).status, 'invalid');
    assert.equal(hermitianInertiaDiagnostic(bad).negIndex, null);
  }
});

test('pole domain is rejected before evaluator and NaN never becomes index zero', () => {
  let calls = 0;
  const r = evaluatePickDiagnostic([[8, 2]], () => { calls++; return [1, 0]; }, { poles: [[8, 2]] });
  assert.equal(calls, 0); assert.equal(r.status, 'invalid'); assert.equal(r.negIndex, null);
  assert.match(r.reason, /pole/);
  for (const evaluate of [() => [NaN, 0], () => [Infinity, 0], () => { throw new Error('bad evaluator'); }, () => [1]]) {
    const d = evaluatePickDiagnostic([[0, 1]], evaluate);
    assert.equal(d.status, 'invalid'); assert.equal(d.negIndex, null);
  }
  for (const nodes of [[], Array(2), [Array(2)], [[0, 0]], [[0, -1]], [[Infinity, 1]]]) assert.throws(() => pickMatrix(nodes, (z) => z));
  assert.throws(() => divideComplex([1, 0], [0, 0]));
});

test('meromorphic rational counterexample: rank two and one negative square', () => {
  const m = (z) => add(divideComplex([1, 0], [-z[0], 1 - z[1]]), divideComplex([1, 0], [-z[0], -1 - z[1]]));
  const P = pickMatrix([[0, 2], [0, 3]], m, { poles: [[0, 1]] });
  close(P[0][0][0], 2 / 3); close(P[0][1][0], 5 / 12); close(P[1][1][0], 1 / 4);
  close(P[0][0][0] * P[1][1][0] - P[0][1][0] ** 2, -1 / 144);
  // Exact rational determinant numerator in denominator 144: 24 - 25 = -1.
  assert.equal(2n * 12n - 5n * 5n, -1n);
  assert.equal(hermitianInertiaDiagnostic(P).negIndex, 1);
  assert.equal(evaluatePickDiagnostic([[0, 1]], m, { poles: [[0, 1]] }).negIndex, null);
});

test('global model index need not be attained on a one-node set', () => {
  const zCubed = ([x, y]) => [x * x * x - 3 * x * y * y, 3 * x * x * y - y * y * y];
  const P = pickMatrix([[1, 1]], zCubed);
  assert.deepEqual(P, [[[2, 0]]]); assert.equal(hermitianInertiaDiagnostic(P).negIndex, 0);
});

test('corrected model records preserve invalidated historical results', () => {
  const a = monomial.TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN;
  const b = signed.TWIN_LADDER_OFFLINE_ZERO_PICK_INDEX_JUMP;
  for (const record of [a, b]) {
    assert.equal(record.proofClaim, false);
    assert.equal(record.historicalInvalidated.status, 'invalidated-pre-correction-not-current-evidence');
    assert.deepEqual(record.historicalInvalidated.recordedNaiveIndices, [7, 10, 0, 20]);
  }
  for (const contrast of [a.naiveOfflineContrast, b.naivePoleContrast]) {
    assert.equal(contrast.negIndexPerNodeSet[2], null);
    assert.equal(contrast.diagnostics[2].status, 'invalid');
    assert.equal(contrast.doesNotSaturate, null);
    assert.deepEqual(contrast.negIndexPerNodeSet, [7, 10, null, 20]);
  }
  assert.equal(b.offlineInjection.coordinateStatus, 'manufactured-model-coordinates-not-verified-zeros');
  for (const mod of [monomial, signed]) for (const [key, values] of Object.entries(mod)) {
    if (key.endsWith('_ASSERTIONS')) for (const a of values) assert.equal(a.holds(), true, a.id);
  }
});

test('producer import is inert and actual assembly uses parity helper / dynamic verdict', () => {
  assert.equal(typeof weilMain, 'function');
  const s = readFileSync(new URL('./compute-imp-2440-weil-positivity-scaling.mjs', import.meta.url), 'utf8');
  assert.match(s, /weilPoleBlock\(Fhalf, parity\)/);
  assert.match(s, /const pole = poleBlock\[i\]\[j\]/);
  assert.match(s, /reading: summary\.reading/);
  assert.match(s, /pre-correction-odd-output-invalidated/);
  assert.match(s, /allEvenBlocksMeetTolerance/);
  assert.match(s, /finiteSampleMinimumExceedsHeuristicFloor/);
  assert.doesNotMatch(s, /allEvenBlocksPSD:|allOddBlocksPSD:|boundedAwayFromZero,/);
  assert.doesNotMatch(s, /const pole = 2 \* Fhalf/);
});
