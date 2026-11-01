// Pure regressions, not interval certificates or tests of RH.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NumericalEvaluationError, gammaLanczos, divideComplex, xiReal, thetaA,
  sampleTheta, classifySampledModulus, sampleLabel,
} from '../src/math/cayley-schur.mjs';

function near(actual, expected, tolerance = 2e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} ≉ ${expected}`);
}
function nearComplex(actual, expected, tolerance) {
  actual.forEach((x, i) => near(x, expected[i], tolerance));
}
const mul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const conj = ([a, b]) => [a, -b];
const failsWith = code => error => error instanceof NumericalEvaluationError && error.code === code;

test('Lanczos special values catch the exponential sign regression', () => {
  nearComplex(gammaLanczos([1, 0]), [1, 0]);
  nearComplex(gammaLanczos([2, 0]), [1, 0]);
  nearComplex(gammaLanczos([0.5, 0]), [Math.sqrt(Math.PI), 0]);
});

test('Gamma recurrence and conjugation, including the reflection branch', () => {
  for (const z of [[0.25, 0], [0.25, 0.75], [0.5, -2], [1, 1], [3, 4], [10, -3]]) {
    nearComplex(gammaLanczos([z[0] + 1, z[1]]), mul(z, gammaLanczos(z)));
    nearComplex(gammaLanczos(conj(z)), conj(gammaLanczos(z)));
  }
  const g = gammaLanczos([1, 1]);
  near(g[0] ** 2 + g[1] ** 2, Math.PI / Math.sinh(Math.PI));
});

test('Gamma rejects unsupported poles/nonfinite inputs and overflow', () => {
  for (const z of [[0, 0], [-1, 0], [NaN, 0], [1, Infinity]]) {
    assert.throws(() => gammaLanczos(z), failsWith('unsupported-domain'));
  }
  assert.throws(() => gammaLanczos([1000, 0]), failsWith('nonfinite-result'));
});

test('complex division does not silently clamp tiny nonzero denominators', () => {
  nearComplex(divideComplex([1e-200, 0], [1e-200, 0]), [1, 0]);
  nearComplex(divideComplex([1, 0], [1e-20, 0]), [1e20, 0]);
  nearComplex(divideComplex([1e200, 1e200], [1e200, -1e200]), [0, 1]);
  assert.throws(() => divideComplex([1, 0], [0, 0]), failsWith('zero-denominator'));
  for (const d of [[NaN, 0], [1, Infinity]]) {
    assert.throws(() => divideComplex([1, 0], d), failsWith('nonfinite-denominator'));
  }
  assert.throws(() => divideComplex([Infinity, 0], [1, 0]), failsWith('nonfinite-numerator'));
});

test('theta sends the exact centered arguments to an uncentered xi evaluator', () => {
  const argumentsSeen = [];
  const value = thetaA([2, 3], 0.25, s => { argumentsSeen.push(s); return [1, 0]; });
  assert.deepEqual(argumentsSeen, [[3.75, -2], [3.25, -2]]);
  assert.deepEqual(value, [1, 0]);
});

test('sharp is conjugate reflection for an even real-type centered model', () => {
  // X(w)=1+w², xi(s)=X(s-1/2). This verifies the formula, not actual xi accuracy.
  const X = w => { const square = mul(w, w); return [1 + square[0], square[1]]; };
  const xi = ([re, im]) => X([re - 0.5, im]);
  for (const a of [0.001, 0.05, 0.5]) {
    for (const z of [[0, 0], [0.2, 0.3], [-0.7, 1.1]]) {
      const E = ([re, im]) => X([a + im, -re]);
      nearComplex(thetaA(z, a, xi), divideComplex(conj(E(conj(z))), E(z)));
    }
    nearComplex(thetaA([0, 0], a, xi), [1, 0]);
  }
});

test('xi handles its exact removable endpoints, not 0 times a clamped pole', () => {
  assert.deepEqual(xiReal([0, 0]), [0.5, 0]);
  assert.deepEqual(xiReal([1, 0]), [0.5, 0]);
  nearComplex(xiReal([2, 0]), [Math.PI / 6, 0]);
  nearComplex(xiReal([4, 0]), [Math.PI ** 2 / 15, 0]);
  nearComplex(xiReal([0.5, 0]), [0.4971207781883141, 0]);
  assert.deepEqual(thetaA([0, 0], 0.5), [1, 0]);
});

test('real xi symmetry and near-pole guard have explicit domains', () => {
  for (const sigma of [0.001, 0.1, 0.25, 0.499]) {
    nearComplex(xiReal([sigma, 0]), xiReal([1 - sigma, 0]));
  }
  for (const sigma of [1e-8, 1 - 1e-8, 1 + 1e-8]) {
    assert.throws(() => xiReal([sigma, 0]), failsWith('ill-conditioned'));
  }
  for (const s of [[-1, 0], [102, 0], [1, 2 * Math.PI / Math.LN2], [0.5, 14], [NaN, 0]]) {
    assert.throws(() => xiReal(s), failsWith('unsupported-domain'));
  }
});

test('all three actual paths stay real, start at boundary one, and retain every point', () => {
  for (const a of [0.001, 0.05, 0.5]) {
    const run = sampleTheta(a);
    assert.equal(run.status, 'sampled');
    assert.equal(run.samples.length, 150);
    assert.equal(run.validCount, 150);
    assert.equal(run.invalidCount, 0);
    assert.equal(run.samples[0].modulusClass, 'near-one');
    assert.match(sampleLabel(run.samples[0]), /Boundary/);
    near(run.samples[0].abs, 1);
    assert.equal(run.samples.at(-1).t, 100);
    for (const sample of run.samples) {
      assert.equal(sample.status, 'approximate');
      assert.equal(sample.y, 0);
      assert.ok(Number.isFinite(sample.x) && Number.isFinite(sample.abs));
      assert.ok(!('inSchur' in sample));
    }
  }
});

test('NaN/Infinity in either complex component never becomes a successful sample', () => {
  for (const bad of [[NaN, 0], [0, NaN], [Infinity, 0], [0, -Infinity], new Array(2), ['1', 0], null]) {
    const run = sampleTheta(0.05, 1, 3, () => bad);
    assert.equal(run.status, 'all-invalid');
    assert.equal(run.invalidCount, 3);
    assert.equal(run.samples.length, 3);
    assert.ok(run.samples.every(s => s.modulusClass === 'undetermined'));
  }
});

test('finite components with an overflowing modulus are invalid', () => {
  let calls = 0;
  const run = sampleTheta(0.05, 0, 1, () => ++calls % 2 ? [1, 0] : [Number.MAX_VALUE, Number.MAX_VALUE]);
  assert.equal(run.status, 'all-invalid');
  assert.equal(run.samples[0].reason, 'nonfinite-modulus');
});

test('zero denominator, nonfinite numerator and thrown evaluator are explicit', () => {
  assert.equal(sampleTheta(0.05, 1, 2, () => [0, 0]).samples[0].reason, 'zero-denominator');
  let calls = 0;
  const badNumerator = sampleTheta(0.05, 0, 1, () => ++calls === 1 ? [1, 0] : [NaN, 0]);
  assert.equal(badNumerator.samples[0].reason, 'nonfinite-numerator');
  const thrown = sampleTheta(0.05, 1, 3, () => { throw new Error('test failure'); });
  assert.equal(thrown.status, 'all-invalid');
  assert.equal(thrown.invalidCount, 3);
  assert.ok(thrown.samples.every(s => s.reason === 'evaluation-error'));
});

test('mixed valid/invalid samples retain grid positions and reason labels', () => {
  const run = sampleTheta(0.05, 1, 3, s => {
    if (s[0] > 0.9 && s[0] < 1.1) throw new Error('unavailable');
    return [1, 0];
  });
  assert.equal(run.status, 'partial');
  assert.deepEqual(run.samples.map(s => s.t), [0, 0.5, 1]);
  assert.equal(run.validCount, 2);
  assert.equal(run.invalidCount, 1);
  assert.match(sampleLabel(run.samples[1]), /Unavailable/);
});

test('an actual near-pole sample is unavailable, not silently clamped to zero', () => {
  const run = sampleTheta(0.5, 1e-8, 2);
  assert.equal(run.status, 'partial');
  assert.equal(run.samples[0].abs, 1);
  assert.equal(run.samples[1].status, 'invalid');
  assert.equal(run.samples[1].reason, 'ill-conditioned');
  assert.equal(run.validCount, 1);
  assert.equal(run.invalidCount, 1);
});

test('empty and one-point grids never divide by n-1 or report vacuous completion', () => {
  const empty = sampleTheta(0.05, 100, 0);
  assert.equal(empty.status, 'empty');
  assert.equal(empty.validCount, 0);
  assert.deepEqual(empty.samples, []);
  const single = sampleTheta(0.5, 100, 1);
  assert.equal(single.samples.length, 1);
  assert.equal(single.samples[0].t, 0);
  near(single.samples[0].abs, 1);
});

test('invalid grid inputs have an explicit count and do not evaluate xi', () => {
  const cases = [[0, 1, 3], [NaN, 1, 3], [0.6, 1, 3], [0.05, -1, 3],
    [0.05, Infinity, 3], [0.05, 101, 3], [0.05, 1, -1], [0.05, 1, 1.5],
    [0.05, 1, NaN], [0.05, 1, Infinity], [0.05, 1, 10001]];
  for (const args of cases) {
    const run = sampleTheta(...args, () => { assert.fail('must not evaluate invalid input'); });
    assert.equal(run.status, 'invalid-input');
    assert.equal(run.invalidInputCount, 1);
    assert.deepEqual(run.samples, []);
  }
});

test('sampled-modulus labels are not Schur certificates or counterexamples', () => {
  assert.equal(classifySampledModulus(1), 'near-one');
  assert.equal(classifySampledModulus(1 + 1e-12), 'near-one');
  assert.equal(classifySampledModulus(0.9), 'below-one');
  assert.equal(classifySampledModulus(1.1), 'above-one');
  for (const abs of [NaN, Infinity, -1]) assert.equal(classifySampledModulus(abs), 'undetermined');
  for (const abs of [0.9, 1, 1.1]) {
    const label = sampleLabel({ status: 'approximate', t: 1, modulusClass: classifySampledModulus(abs) });
    assert.match(label, /Sampled/);
    assert.doesNotMatch(label, /Schur|certificate|counterexample/);
  }
});
