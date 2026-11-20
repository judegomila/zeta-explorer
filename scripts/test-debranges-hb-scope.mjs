#!/usr/bin/env node
// Focused exact polynomial/finite-algebra and record-scope regressions.
// These do not execute a research sweep or certify the Riemann kernel.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY as S,
  IMP_2695_DEBRANGES_HB_DOWNSTREAM_VERIFY_ASSERTIONS as assertions,
} from '../src/data/imp-2695-debranges-hb-downstream-verify.js';

const source = await readFile(new URL('../src/data/imp-2695-debranges-hb-downstream-verify.js', import.meta.url), 'utf8');
const complex = (re, im) => ({ re: re === 0 ? 0 : re, im: im === 0 ? 0 : im });
const add = (a, b) => complex(a.re + b.re, a.im + b.im);
const neg = a => complex(-a.re, -a.im);
const sub = (a, b) => add(a, neg(b));
const mul = (a, b) => complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const conj = a => complex(a.re, -a.im);
const abs2 = a => a.re * a.re + a.im * a.im;
const zero = () => ({ re: 0, im: 0 });
const I = { re: 0, im: 1 };
const evaluate = (coefficients, z) =>
  coefficients.reduceRight((value, coefficient) => add(mul(value, z), { re: coefficient, im: 0 }), zero());
const gauges = (model, z) => {
  const A = evaluate(model.aCoefficients, z);
  const B = evaluate(model.bCoefficients, z);
  return { A, B, E: sub(A, mul(I, B)), sharp: add(A, mul(I, B)) };
};
// Source numerator: B(z) A(conj(w)) - A(z) B(conj(w)).
const numerator = (model, w, z) => {
  const gz = gauges(model, z), gw = gauges(model, conj(w));
  return sub(mul(gz.B, gw.A), mul(gz.A, gw.B));
};
const points = [];
for (const re of [-2, -1, 0, 1, 2]) {
  for (const im of [1, 2, 3]) points.push({ re, im });
}

test('historical provenance and no-RH flags survive the current correction', () => {
  assert.equal(S.verifyDate, '2026-06-25');
  assert.equal(S.verifiedByModel, 'opus-4-8');
  assert.equal(S.channel, 'api-pool');
  assert.equal(S.currentStatus.status, 'CORRECTED-MISSING-HYPOTHESES');
  assert.match(S.currentStatus.notice, /withdrawn/);
  assert.match(S.currentStatus.historicalVerdict, /verified-as-clean-conditional/);
  assert.equal(S.antecedent.assertedHere, false);
  assert.equal(S.overall.claimsKaNonneg, false);
  assert.equal(S.overall.collapseConfirmed, false);
  assert.match(S.overall.sotaUnchanged, /Historical 2026-06-25/);
});

test('the corrected record preserves the actual kernel sign and diagonal normalization', () => {
  assert.ok(source.includes('[B_a(z) A_a(conj w) - A_a(z) B_a(conj w)]'));
  assert.ok(source.includes('/ [pi (z - conj w)]'));
  assert.equal(S.kernelScope.diagonalIdentity, 'K(z,z) = (|E(z)|^2 - |E#(z)|^2) / (4*pi*Im(z)).');
  for (const model of [...S.counterexamples, S.validModel]) {
    for (const z of points) {
      const g = gauges(model, z);
      const n = numerator(model, z, z);
      // 2*pi*i*(conj(z)-z)=4*pi*Im(z), with no numerical pi approximation.
      assert.equal(abs2(g.E) - abs2(g.sharp), 2 * n.im);
      assert.equal(n.re, 0);
    }
  }
});

test('A=1,B=0 gives a zero PSD kernel but fails strict HB', () => {
  const model = S.counterexamples[0];
  for (const w of points) for (const z of points) {
    assert.deepEqual(numerator(model, w, z), zero());
  }
  for (const z of points) {
    const g = gauges(model, z);
    assert.equal(abs2(g.E), 1);
    assert.equal(abs2(g.sharp), 1);
  }
});

test('the common-zero example has the exact nonzero rank-one kernel factorization', () => {
  const model = S.counterexamples[1];
  for (const w of points) for (const z of points) {
    const gz = evaluate(model.aCoefficients, z);
    const gw = evaluate(model.aCoefficients, w);
    const denominatorWithoutPi = sub(z, conj(w));
    assert.deepEqual(numerator(model, w, z), mul(mul(gz, conj(gw)), denominatorWithoutPi));
  }
  const atZero = gauges(model, model.commonZero);
  assert.equal(abs2(atZero.E), 0);
  assert.equal(abs2(atZero.sharp), 0);
  assert.equal(abs2(evaluate(model.aCoefficients, { re: 0, im: 2 })), 9);
});

test('rank-one finite complex Gram forms equal a squared norm, including the zero row', () => {
  const model = S.counterexamples[1];
  const zs = [{ re: 0, im: 1 }, { re: 1, im: 1 }, { re: 0, im: 2 }];
  const gs = zs.map(z => evaluate(model.aCoefficients, z));
  const coefficients = [];
  for (const re of [-1, 0, 1]) for (const im of [-1, 0, 1]) coefficients.push({ re, im });
  for (const a of coefficients) for (const b of coefficients) for (const c of coefficients) {
    const cs = [a, b, c];
    let q = zero(), sum = zero();
    for (let i = 0; i < 3; i++) {
      sum = add(sum, mul(cs[i], gs[i]));
      for (let j = 0; j < 3; j++) {
        q = add(q, mul(mul(conj(cs[i]), mul(gs[j], conj(gs[i]))), cs[j]));
      }
    }
    assert.equal(q.im, 0);
    assert.equal(q.re, abs2(sum));
    assert.ok(q.re >= 0);
  }
});

test('both counterexamples retain real-even A and real-odd B', () => {
  for (const model of S.counterexamples) {
    assert.ok(model.aCoefficients.every((x, i) => i % 2 === 0 || x === 0));
    assert.ok(model.bCoefficients.every((x, i) => i % 2 === 1 || x === 0));
  }
  assert.match(S.step1.explicitArgument.join(' '), /finite exponential type/);
});

test('valid A=1,B=z remains strict HB with a PSD but not strictly-PD Gram kernel', () => {
  for (const w of points) for (const z of points) {
    assert.deepEqual(numerator(S.validModel, w, z), sub(z, conj(w)));
  }
  for (const z of points) {
    const g = gauges(S.validModel, z);
    assert.equal(abs2(g.E) - abs2(g.sharp), 4 * z.im);
    assert.ok(abs2(g.E) > abs2(g.sharp));
  }
  // The pi-scaled two-point Gram matrix is [[1,1],[1,1]], determinant zero.
  assert.equal(1 * 1 - 1 * 1, 0);
  assert.match(S.kernelScope.gramBoundary, /not strict positive definiteness/);
  assert.match(S.kernelScope.validDirection, /strict HB.*kernel is PSD/);
});

test('PSD alone is not promoted to strict HB or a verified realization chain', () => {
  assert.equal(S.step1.bidirectional, false);
  assert.match(S.kernelScope.weakConclusion, /<=/);
  assert.match(S.kernelScope.strictCriterion, /every upper-half-plane point/);
  assert.match(S.kernelScope.strictCriterion, /supplied, not inferred from PSD/);
  assert.match(S.conditionalTheorem.hypothesis, /not sufficient by itself/);
  assert.equal(S.conditionalTheorem.honestPartialClosure, false);
  assert.match(S.step2.verdict, /explicit-strict-HB/);
  assert.match(S.step3.verdict, /realization-hypotheses/);
  assert.match(S.honestScope.join(' '), /not freshly verified/);
});

test('fast decay is separated from compact support using the explicit Gaussian growth witness', () => {
  assert.match(S.growthScope.compactSupport, /Compact support.*finite-exponential-type/);
  assert.equal(S.growthScope.fastDecay, 'Fast decay alone does not imply finite exponential type.');
  assert.match(S.growthScope.gaussian, /exp\(\(a-iz\)\^2\/4\)/);
  assert.match(S.growthScope.imaginaryAxis, /quadratic exponential.*every fixed C,tau/);
  // Bounded exponent checks only; no numerical integration or growth certification.
  for (const tau of [0, 1, 2, 4]) for (const logC of [0, 1, 4]) {
    const y = 4 * (tau + logC + 1);
    assert.ok((1 + y) ** 2 / 4 > logC + tau * y);
  }
});

test('only this inspected record’s corrected assertions run', () => {
  assert.equal(assertions.length, 8);
  for (const a of assertions) assert.equal(a.holds(), true, a.id);
});
