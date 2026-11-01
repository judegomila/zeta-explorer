import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import {
  normalizedMargin, powerLawFit, summarizeRows,
} from './compute-imp-2456-Ka-minor-extrapolation.mjs';
import {
  IMP_2456_KA_MINOR_EXTRAPOLATION as history,
  IMP_2456_KA_MINOR_EXTRAPOLATION_ASSERTIONS as assertions,
} from '../src/data/imp-2456-Ka-minor-extrapolation-2026-06.js';

function finiteTree(value) {
  if (typeof value === 'number') assert.ok(Number.isFinite(value));
  else if (Array.isArray(value)) value.forEach(finiteTree);
  else if (value && typeof value === 'object') Object.values(value).forEach(finiteTree);
}
function serializable(value) {
  finiteTree(value);
  assert.deepEqual(JSON.parse(JSON.stringify(value)), value);
}
function unknown(result) {
  assert.equal(result.isPD, null);
  assert.equal(result.minPivotSigned, null);
  assert.equal(result.smallestMinorSigned, null);
  assert.equal(result.negativePivots, null);
  assert.equal(result.margin, null);
  serializable(result);
}
function fixtureSeries(sign = 1, exponent = 2) {
  // Synthetic completed diagnostic records isolate the fitting contract.
  // They are not output of the historical quadrature sweep.
  return [1, 2, 4].map(n => ({
    n,
    normalized: {
      status: sign > 0 ? 'numerically-positive-definite' : 'numerically-not-positive-definite',
      isPositiveDefinite: sign > 0,
      minPivot: sign * n ** (-exponent),
    },
  }));
}
function row(series) { return { series, fit: powerLawFit(series) }; }
function noContinuumClaim(summary) {
  for (const key of ['everyCellMarginNegativeOrZero', 'allCellsMarginalOrPositive',
    'anyBoundedAwayNegative', 'anyStrictlyPositiveFloor', 'medianDecayExponent']) {
    assert.equal(summary[key], null, key);
  }
  assert.equal(summary.continuumStatus, 'not-inferred');
}

test('negative identity never changes orientation or becomes positive', () => {
  const d = normalizedMargin([[-1, 0], [0, -1]]);
  assert.equal(d.raw.orientationFlip, false);
  assert.equal(d.isPD, false);
  assert.equal(d.raw.isPositiveDefinite, false);
  assert.equal(d.minPivotSigned, -1);
  assert.equal(d.negativePivots, 2);
  assert.equal(d.rigorous, false);
  serializable(d);
});

test('raw and normalized finite diagnostics remain distinct and input is unchanged', () => {
  const G = Object.freeze([Object.freeze([4, 2]), Object.freeze([2, 3])]);
  const d = normalizedMargin(G);
  assert.equal(d.raw.minPivot, 2);
  assert.ok(Math.abs(d.minPivotSigned - 2 / 3) < 1e-14);
  assert.equal(d.isPD, true);
  assert.deepEqual(G, [[4, 2], [2, 3]]);
  serializable(d);
});

test('zero diagonal, zero matrix and zero Schur pivot stay unknown', () => {
  for (const G of [[[0]], [[0, 0], [0, 0]], [[0, 1], [1, 0]],
    [[1, 1], [1, 1]], [[1, 1, 0], [1, 1, 1], [0, 1, 1]]]) {
    unknown(normalizedMargin(G));
  }
  const exchange = normalizedMargin([[0, 1], [1, 0]]);
  assert.equal(exchange.raw.status, 'indeterminate');
  assert.equal(exchange.raw.reason, 'zero-pivot');
  assert.equal(exchange.status, 'invalid');
  assert.equal(exchange.reason, 'zero-diagonal-scale');
});

test('malformed, asymmetric and nonfinite matrices cannot pass', () => {
  for (const G of [[], null, [[1, 2]], [[1, 2], [0, 1]], Array(2),
    [[NaN]], [[Infinity]], [[-Infinity]], [[undefined]], [[null]]]) {
    unknown(normalizedMargin(G));
  }
  for (const bad of [NaN, Infinity, -Infinity]) {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const G = [[1, 0], [0, 1]];
      G[i][j] = bad;
      unknown(normalizedMargin(G));
    }
  }
});

test('finite OLS fixtures reproduce arithmetic without asserting a limit', () => {
  for (const sign of [-1, 1]) {
    const fit = powerLawFit(fixtureSeries(sign));
    assert.equal(fit.status, 'finite-log-log-diagnostic');
    assert.equal(fit.pointCount, 3);
    assert.ok(Math.abs(fit.decayExponent - 2) < 1e-12);
    assert.ok(Math.abs(fit.coefficient - 1) < 1e-12);
    assert.ok(Math.abs(fit.logLogR2 - 1) < 1e-12);
    assert.equal(fit.marginSign, sign);
    assert.equal(fit.rigorous, false);
    assert.equal(fit.continuumInference, null);
    serializable(fit);
  }
});

test('invalid/missing/zero cells block the whole fit, never get dropped', () => {
  const good = fixtureSeries();
  for (const invalid of [undefined, {}, { n: 8, normalized: normalizedMargin([[0]]).normalized },
    { n: 8, normalized: { ...good[0].normalized, minPivot: 0 } },
    { n: 8, normalized: { ...good[0].normalized, minPivot: NaN } }]) {
    assert.equal(powerLawFit([...good, invalid]), null);
  }
  for (const series of [null, [], [good[0]], Array(3),
    [good[0], { ...good[1], n: 1 }],
    [good[0], { ...good[1], n: 0 }]]) assert.equal(powerLawFit(series), null);
});

test('positive shrinking and negative fits establish neither continuum side', () => {
  for (const sign of [-1, 1]) {
    const summary = summarizeRows([row(fixtureSeries(sign))]);
    assert.equal(summary.allExpectedCellsDiagnosed, true);
    assert.equal(summary.numerical.allPositiveDefinite, sign > 0);
    assert.equal(summary.everyCompletedFiniteMarginNonpositive, sign < 0);
    noContinuumClaim(summary);
    serializable(summary);
  }
});

test('empty/incomplete aggregation is unknown and finite median is correctly labeled', () => {
  for (const rows of [[], null, Array(2), [{ series: [] }], [{ series: Array(2) }],
    [row([...fixtureSeries(), { n: 8, normalized: normalizedMargin([[0]]).normalized }])]]) {
    const summary = summarizeRows(rows);
    assert.equal(summary.allExpectedCellsDiagnosed, false);
    assert.equal(summary.numerical.allPositiveDefinite, null);
    assert.equal(summary.finiteFitMedianDecayExponent, null);
    assert.equal(summary.everyCompletedFiniteMarginNonpositive, null);
    noContinuumClaim(summary);
    serializable(summary);
  }
  const s = summarizeRows([row(fixtureSeries(1, 2)), row(fixtureSeries(1, 4))]);
  assert.ok(Math.abs(s.finiteFitMedianDecayExponent - 3) < 1e-12);
  noContinuumClaim(s);
});

test('historical rows and fit values are preserved, explicitly invalidated', () => {
  assert.deepEqual(history.representativeSeriesAHalf.map(x => [x.n, x.minPivotSigned, x.negativePivots]), [
    [8, -3.089129e-3, 4], [16, -9.249354e-4, 9], [24, -4.383043e-4, 14],
    [32, -2.547645e-4, 15], [48, -1.170598e-4, 26], [64, -6.696301e-5, 32],
    [80, -4.329355e-5, 38], [96, -3.026984e-5, 45],
  ]);
  assert.deepEqual(history.fitTable.map(x => [x.a, x.p, x.r2, x.marginSign, x.lastMargin]), [
    [0.05, 1.872, 0.999, -1, -3.041e-5], [0.1, 1.872, 0.999, -1, -3.040e-5],
    [0.2, 1.872, 0.999, -1, -3.039e-5], [0.35, 1.872, 0.999, -1, -3.034e-5],
    [0.5, 1.871, 0.999, -1, -3.027e-5], [0.75, 1.871, 0.999, -1, -3.010e-5],
    [1.0, 1.869, 0.999, -1, -2.985e-5], [1.5, 1.865, 0.999, -1, -2.915e-5],
    [2.0, 1.860, 0.999, -1, -2.816e-5], [3.0, 1.840, 0.999, -1, -2.532e-5],
    [4.0, 1.801, 0.998, -1, -2.127e-5], [6.0, 1.059, 0.751, -1, -9.303e-6],
  ]);
  assert.equal(history.numericalAudit.correctedSweepStatus, 'not-rerun');
  assert.equal(history.numericalAudit.historicalDiagnosticStatus, 'invalidated-pre-correction-not-current-evidence');
  assert.equal(history.continuum.historicalSurrogateEveryCellMarginNegative, null);
  assert.equal(history.historicalInvalidated.recordedEveryCellMarginNegative, true);
  assert.equal(history.continuum.historicalFitDirection, null);
  serializable(history);
});

test('normalization retraction and separate unreplayed canonical claim survive all assertions', () => {
  assert.equal(history.status, 'SURROGATE / INVALID FOR T3');
  assert.equal(history.appliesToExactRiemannKernel, false);
  assert.equal(history.continuum.exactKernelInference, 'RETRACTED');
  assert.equal(history.proofClaim, false);
  const canonical = history.normalizationAudit.correctedCanonicalFourNodeNumericalCheck;
  assert.equal(canonical.rigorous, false);
  assert.equal(canonical.precisionDigits, 60);
  assert.equal(canonical.smallestNormalizedEigenvalue, 4.66922095265e-5);
  assert.deepEqual(canonical.normalizedLeadingPrincipalMinors, [1, 0.0387394724, 0.000150634109, 1.4487899474e-7]);
  assert.match(canonical.provenance, /not replayed/);
  for (const text of [history.honestScope, history.continuum.interpretation]) {
    assert.match(text, /historical record reports a positive canonical/);
    assert.match(text, /not replayed here/);
    assert.match(text, /normalization mismatch/i);
  }
  assert.equal(assertions.length, 6);
  for (const assertion of assertions) assert.equal(assertion.holds(), true, assertion.id);
});

test('producer import is inert and the actual main path uses shared diagnostics', () => {
  const url = new URL('./compute-imp-2456-Ka-minor-extrapolation.mjs', import.meta.url);
  const code = [
    "for (const key of ['exp','cos','sin','cosh','sinh']) Math[key] = () => { throw new Error('quadrature executed'); };",
    "const Original = globalThis.Float64Array;",
    "globalThis.Float64Array = class extends Original { constructor(n) { if (n > 100) throw new Error('quadrature allocated'); super(n); } };",
    `await import(${JSON.stringify(url.href)});`,
  ].join('\n');
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', timeout: 10000 });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(child.stdout, '');
  assert.equal(child.stderr, '');
  const source = readFileSync(url, 'utf8');
  assert.match(source, /const m = normalizedMargin\(G\)/);
  assert.match(source, /summary: summarizeRows\(rows\)/);
  assert.match(source, /const fit = powerLawFit\(series\)/);
  assert.doesNotMatch(source, /function ldlPivots|diagNeg > diagPos|surrogate-bounded-negative/);
  assert.match(source, /not-inferred-from-finite-diagnostics/);
});
