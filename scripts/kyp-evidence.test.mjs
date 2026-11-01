// Focused record/rendering regressions and exact small algebraic witnesses.
// These tests do not replay the seven historical reports or certify an RH model.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import katex from 'katex';
import { createServer } from 'vite';
import { KYP_BOUNDED_REAL as K, KYP_ASSERTIONS } from '../src/data/kyp-bounded-real-section.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [M, N, O] = K.apps;
const reportedRows = [
  ['App M', '0.50', '20', 'P_{20} > 0, lambda_min ~ 0.013'],
  ['App M', '0.25', '50', 'P_{50} > 0, lambda_min ~ 2.4e-4'],
  ['App N', '0.10', '10', 'passivity margin ~ 0.008'],
  ['App N', '0.10', '20', 'passivity margin ~ 0.003'],
  ['App O', '0.025', '50', 'lambda_min ~ 1.4e-4, clean'],
  ['App O', '0.010', '20', 'lambda_min ~ 3.8e-5, clean'],
  ['App O', '0.005', '10', 'lambda_min ~ 1.1e-5, clean'],
];

test('all seven original values survive as frozen unverified historical reports', () => {
  assert.deepEqual(K.historicalReports.map(r => [r.app, r.a, r.n, r.result]), reportedRows);
  assert.ok(Object.isFrozen(K.historicalReports));
  for (const row of K.historicalReports) {
    assert.ok(Object.isFrozen(row));
    assert.equal(row.evidenceStatus, 'unverified-historical-report');
    assert.equal(row.replayed, false);
    assert.equal(row.witnessSupplied, false);
    assert.match(row.provenance, /Historical imp-1201/);
  }
  assert.match(K.evidenceStatus, /not certified/);
  assert.match(K.landscape.numericalCertificates, /unverified and not replayed/);
  for (const app of K.apps) assert.match(app.currentStatus, /unverified/);
});

test('all existing and new record tripwires pass, without representing solver checks', () => {
  assert.ok(KYP_ASSERTIONS.length >= 14);
  for (const check of KYP_ASSERTIONS) assert.equal(check.holds(), true, check.id);
});

test('finite-model formula keeps complex adjoints, every output term, and hypotheses', () => {
  assert.equal(M.latexFormula,
    '\\dot x=Ax+Bu,\\quad y=Cx+Du,\\quad A\\text{ Hurwitz},\\quad P=P^*\\succ0,\\qquad ' +
    'Q:=\\begin{pmatrix} A^*P+PA+C^*C & PB+C^*D \\\\ B^*P+D^*C & D^*D-I \\end{pmatrix}\\preceq0');
  assert.match(M.statement, /Sufficient finite-dimensional/);
  assert.match(M.statement, /A Hurwitz/);
  assert.match(M.statement, /Hermitian P > 0/);
  assert.match(M.statement, /conjugate transpose/);
  assert.match(M.statement, /No converse, minimality assumption, or strictly-less-than-one conclusion/);
  assert.match(M.derivation, /x\(0\)=0/);
  assert.match(M.statement, /s=-iz maps Im\(z\)>0 to Re\(s\)>0/);
  assert.match(M.statement, /separate valid bridge realization/);
});

// Exact small real numbers in these witnesses are integers or dyadic rationals.
const det2 = ([[a, b], [c, d]]) => a * d - b * c;
const negativeSemidefinite2 = q =>
  q[0][1] === q[1][0] && q[0][0] <= 0 && q[1][1] <= 0 && det2(q) >= 0;
const block = (A, B, C, D, P) =>
  [[2 * A * P + C * C, P * B + C * D], [B * P + D * C, D * D - 1]];

test('stable minimal gain-10 counterexample passes the old formulas but not the corrected LMI', () => {
  const A = -1, B = 1, C = -10, D = 0, P = 1;
  const oldBlock = [[2 * A * P, P * B], [B * P, -1]];
  assert.deepEqual(oldBlock, [[-2, 1], [1, -1]]);
  assert.ok(negativeSemidefinite2(oldBlock));
  assert.equal(det2(oldBlock), 1); // Strictly negative definite, not a borderline pivot.
  assert.equal(2 * A * P + (P * B + C) / (1 - D * D) * (B * P + D * C), -11);
  assert.ok(A < 0 && B !== 0 && C !== 0); // Stable, controllable and observable scalar model.
  assert.equal(Math.abs(C * (-1 / A) * B + D), 10); // G(0).
  assert.equal(block(A, B, C, D, P)[0][0], 98);
  assert.equal(negativeSemidefinite2(block(A, B, C, D, P)), false);
});

test('gain-one and gain-half models distinguish nonstrict and strict conditions', () => {
  const one = block(-1, 1, 1, 0, 1);
  assert.deepEqual(one, [[-1, 1], [1, -1]]);
  assert.ok(negativeSemidefinite2(one));
  assert.equal(det2(one), 0); // P>0 did not make the gain strictly smaller than one.
  const half = block(-1, 1, 0.5, 0, 1);
  assert.deepEqual(half, [[-1.75, 1], [1, -1]]);
  assert.ok(negativeSemidefinite2(half));
  assert.equal(det2(half), 0.75);
});

test('singular I-D*D is allowed by the block, and expansive feedthrough is rejected', () => {
  const q = block(-1, 1, -1, 1, 1); // G(s)=s/(s+1), stable with norm one.
  assert.deepEqual(q, [[-1, 0], [0, 0]]);
  assert.ok(negativeSemidefinite2(q));
  assert.equal(1 - 1 ** 2, 0); // An ordinary Schur-complement inverse would be illegal.
  assert.equal(negativeSemidefinite2(block(-1, 1, 0, 2, 1)), false);
  assert.match(M.derivation, /No inverse of I-D\*D/);
});

// Gaussian-integer operations: no rounding or numerical eigensolver in this check.
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const star = a => [a[0], -a[1]];
const norm2 = a => mul(star(a), a)[0];
test('complex storage identity uses adjoints rather than transpose and retains feedthrough cross terms', () => {
  const A = [-1, 0], B = [1, 1], C = [1, -2], D = [0, 1], P = 2;
  const qxx = 2 * P * A[0] + norm2(C);
  const qxu = add(mul([P, 0], B), mul(star(C), D));
  const quu = norm2(D) - 1;
  assert.equal(qxx, 1);
  assert.deepEqual(qxu, [0, 3]);
  assert.equal(quu, 0);
  for (let xr = -2; xr <= 2; xr++) for (let xi = -2; xi <= 2; xi++)
    for (let ur = -2; ur <= 2; ur++) for (let ui = -2; ui <= 2; ui++) {
      const x = [xr, xi], u = [ur, ui];
      const dx = add(mul(A, x), mul(B, u));
      const y = add(mul(C, x), mul(D, u));
      const storageSupply = 2 * P * mul(star(x), dx)[0] + norm2(y) - norm2(u);
      const quadratic = qxx * norm2(x) + 2 * mul(mul(star(x), qxu), u)[0] + quu * norm2(u);
      assert.equal(storageSupply, quadratic);
    }
});

test('input supply and initial storage cannot be dropped from the energy argument', () => {
  assert.match(N.latexFormula, /\\leq\\\|u\(t\)\\\|\^2/);
  assert.match(N.statement, /nonnegative storage/);
  assert.match(N.statement, /absolutely continuous/);
  assert.match(N.statement, /zero initial history and V\(x_0\)=0/);
  assert.match(N.statement, /not a general if-and-only-if/);
  // xdot=-x+u, y=x, V=x²: Vdot+y²-u²=-(x-u)².
  for (let x = -5; x <= 5; x++) for (let u = -5; u <= 5; u++) {
    const derivative = 2 * x * (-x + u);
    assert.equal(derivative + x * x - u * u + (x - u) ** 2, 0);
  }
  const x = 1, u = 2;
  assert.ok(2 * x * (-x + u) > -x * x); // The old forced no-input inequality fails.
  // Integrated inequality: Eout <= Ein + V(0) - V(T). Only V(0)=0 removes initial energy.
  assert.equal(0 + 1 - 0, 1);
});

test('diag(1/n) gives positive finite blocks and a noncoercive norm-convergent limit', () => {
  assert.match(K.positivityLimitNote, /not necessary for nonnegative positivity/);
  assert.match(K.positivityLimitNote, /error 1\/\(N\+1\)/);
  assert.match(M.blocker, /not sufficient for convergence/);
  assert.match(K.conjectures[0].statement, /not an equivalent convergence criterion/);
  // Exact finite witnesses: diagonal entries decrease, min=1/N.
  // The infinite tail supremum is 1/(N+1), so no positive lower bound survives.
  for (let N = 1; N <= 128; N++) {
    const diagonal = Array.from({ length: N }, (_, k) => 1 / (k + 1));
    assert.ok(diagonal.every(x => x > 0));
    assert.equal(Math.min(...diagonal), 1 / N);
    assert.ok(1 / (N + 1) < 1 / N);
  }
});

test('existing boundary, convergence-region and sparse-node conjecture gates remain', () => {
  assert.match(K.setup.boundaryStatus, /do not certify RH/);
  assert.match(K.setup.primeDelayLaTeX, /absolute-convergence region/);
  assert.match(O.statement, /which is not proved/);
  assert.match(O.statement, /fixed N/);
  assert.match(K.parallelDelayDiagram.description, /Proposed schematic/);
  assert.match(K.parallelDelayDiagram.description, /not a supplied witness/);
  assert.match(M.blocker, /well-posed realization, operator domains/);
});

test('changed math strings render with strict KaTeX parsing', () => {
  for (const tex of [M.latexFormula, M.derivationLaTeX, N.latexFormula]) {
    const html = katex.renderToString(tex, { throwOnError: true, strict: 'error', displayMode: true });
    assert.match(html, /katex/);
    assert.doesNotMatch(html, /katex-error/);
  }
});

test('actual page repeatedly renders the seven reports with explicit status and no stale verdict', async () => {
  const server = await createServer({
    root, configFile: false, logLevel: 'error', appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true },
  });
  try {
    const { default: Page } = await server.ssrLoadModule('/src/pages/KypBoundedRealPage.jsx');
    const render = route => renderToStaticMarkup(
      React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(Page)));
    const first = render('/kyp-bounded-real');
    const repeated = render('/kyp-bounded-real');
    assert.equal(first, repeated);
    assert.equal((first.match(/Unverified; not replayed; no witness supplied/g) || []).length, 7);
    assert.match(first, /Historical numerical reports/);
    assert.match(first, /Positivity is not coercivity/);
    assert.match(first, /not a near-complete proof step/);
    assert.match(first, /Proposed parallel-delay schematic/);
    assert.doesNotMatch(first, /All pilots confirm positivity|no off-critical zero detected|establish positivity unconditionally|uniform-convergence \(uniform spectral-gap\)/i);
    const escape = s => s.replaceAll('&', '&amp;').replaceAll('>', '&gt;').replaceAll('<', '&lt;');
    for (const row of K.historicalReports) assert.ok(first.includes(escape(row.result)));
    const pageSource = await readFile(path.join(root, 'src/pages/KypBoundedRealPage.jsx'), 'utf8');
    assert.match(pageSource, /K\.historicalReports\.map/);
    assert.match(pageSource, /aria-describedby="kyp-report-status"/);
  } finally {
    await server.close();
  }
});
