#!/usr/bin/env node
// scripts/smoke-tests.mjs
// imp-594: Smoke tests for critical math functions using Node built-in assert
// + Vite SSR (no extra dependencies). Covers foundational functions whose
// breakage would silently corrupt every page that depends on them.
//
// Usage:
//   node scripts/smoke-tests.mjs
//   npm test
//
// Exit codes:
//   0 -- all tests pass
//   1 -- one or more tests fail
//   2 -- script setup failed

import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function ok(name, fn) {
  try {
    fn();
    console.log('  PASS: ' + name);
    passed++;
  } catch (e) {
    console.error('  FAIL: ' + name + ' — ' + e.message);
    failed++;
  }
}

async function main() {
  let server;
  try {
    server = await createServer({
      root:    ROOT,
      logLevel: 'error',
      appType:  'custom',
      server:   { middlewareMode: true },
    });
  } catch (e) {
    console.error('FATAL: could not create Vite server:', e.message);
    process.exit(2);
  }

  console.log('# Smoke tests — ' + new Date().toISOString());
  console.log('');

  // ── src/math/primes.js ────────────────────────────────────────────────────
  console.log('## primes.js');
  const primes = await server.ssrLoadModule('/src/math/primes.js');

  ok('sieveOfEratosthenes(10) = [2,3,5,7]', () => {
    assert.deepEqual(primes.sieveOfEratosthenes(10), [2, 3, 5, 7]);
  });

  ok('getPrimes(5) = first 5 primes', () => {
    assert.deepEqual(primes.getPrimes(5), [2, 3, 5, 7, 11]);
  });

  ok('vonMangoldt(2) = log(2)', () => {
    assert.ok(Math.abs(primes.vonMangoldt(2) - Math.log(2)) < 1e-12);
  });

  ok('vonMangoldt(4) = log(2)  [prime power 2^2]', () => {
    assert.ok(Math.abs(primes.vonMangoldt(4) - Math.log(2)) < 1e-12);
  });

  ok('vonMangoldt(6) = 0  [not a prime power]', () => {
    assert.strictEqual(primes.vonMangoldt(6), 0);
  });

  ok('primeFrequency(p) = log(p)', () => {
    assert.ok(Math.abs(primes.primeFrequency(7) - Math.log(7)) < 1e-12);
  });

  console.log('');

  // ── src/math/zeta.js ──────────────────────────────────────────────────────
  console.log('## zeta.js');
  const zeta = await server.ssrLoadModule('/src/math/zeta.js');

  ok('cAdd([1,2],[3,4]) = [4,6]', () => {
    assert.deepEqual(zeta.cAdd([1, 2], [3, 4]), [4, 6]);
  });

  ok('cSub([5,6],[1,2]) = [4,4]', () => {
    assert.deepEqual(zeta.cSub([5, 6], [1, 2]), [4, 4]);
  });

  ok('cMul([1,0],[0,1]) = [0,1]  [i*1=i]', () => {
    const r = zeta.cMul([1, 0], [0, 1]);
    assert.ok(Math.abs(r[0]) < 1e-12 && Math.abs(r[1] - 1) < 1e-12);
  });

  ok('cMul([0,1],[0,1]) = [-1,0]  [i*i=-1]', () => {
    const r = zeta.cMul([0, 1], [0, 1]);
    assert.ok(Math.abs(r[0] + 1) < 1e-12 && Math.abs(r[1]) < 1e-12);
  });

  ok('cAbs([3,4]) = 5', () => {
    assert.ok(Math.abs(zeta.cAbs([3, 4]) - 5) < 1e-12);
  });

  ok('cDiv([1,0],[1,0]) = [1,0]', () => {
    const r = zeta.cDiv([1, 0], [1, 0]);
    assert.ok(Math.abs(r[0] - 1) < 1e-12 && Math.abs(r[1]) < 1e-12);
  });

  ok('zetaDirichlet([2,0], 5000) near pi^2/6', () => {
    const r = zeta.zetaDirichlet([2, 0], 5000);
    const expected = Math.PI * Math.PI / 6; // ~1.6449
    assert.ok(
      Math.abs(r[0] - expected) < 0.01,
      'real part ' + r[0].toFixed(6) + ' expected ~' + expected.toFixed(6)
    );
    assert.ok(Math.abs(r[1]) < 1e-10, 'imaginary part should be ~0');
  });

  ok('zetaDirichlet([1.5,0], 5000) > 1', () => {
    const r = zeta.zetaDirichlet([1.5, 0], 5000);
    assert.ok(r[0] > 1, 'zeta(1.5) should be > 1');
  });

  console.log('');

  // ── src/math/interval-arithmetic.js ──────────────────────────────────────────
  console.log('## interval-arithmetic.js');
  const { Interval } = await server.ssrLoadModule('/src/math/interval-arithmetic.js');

  ok('Interval.exact(3) has lo=hi=3 and contains 3', () => {
    const iv = Interval.exact(3);
    assert.strictEqual(iv.lo, 3);
    assert.strictEqual(iv.hi, 3);
    assert.ok(iv.contains(3));
  });

  ok('Interval add: [1,2] + [3,4] contains 4 and 6', () => {
    const r = new Interval(1, 2).add(new Interval(3, 4));
    assert.ok(r.lo <= 4 && r.hi >= 6, 'sum interval must contain [4,6]');
  });

  ok('Interval mul: [2,3] * [4,5] contains 8 and 15', () => {
    const r = new Interval(2, 3).mul(new Interval(4, 5));
    assert.ok(r.lo <= 8 && r.hi >= 15, 'product interval must contain [8,15]');
  });

  console.log('');

  // ── src/math/odd-zeta.js ──────────────────────────────────────────────────────
  console.log('## odd-zeta.js');
  const oddZeta = await server.ssrLoadModule('/src/math/odd-zeta.js');

  ok('oddZetaValue(3) reference value near 1.20206', () => {
    const res = oddZeta.oddZetaValue(3, 100);
    assert.ok(Math.abs(res.value - 1.2020569031595942) < 1e-10, 'zeta(3) reference value');
    assert.ok(res.relativeError < 0.01, 'Euler product error < 1%');
  });

  ok('oddZetaValue(5) reference value near 1.03693', () => {
    const res = oddZeta.oddZetaValue(5, 100);
    assert.ok(Math.abs(res.value - 1.0369277551433699) < 1e-10, 'zeta(5) reference value');
  });

  ok('oddZetaValue(4) returns NaN (even input rejected)', () => {
    const res = oddZeta.oddZetaValue(4, 10);
    assert.ok(Number.isNaN(res.value), 'even n must yield NaN');
  });

  console.log('');

  // ── src/math/pascal.js ────────────────────────────────────────────────────────
  console.log('## pascal.js');
  const pascal = await server.ssrLoadModule('/src/math/pascal.js');

  ok('binomial(5,2) = 10', () => {
    assert.strictEqual(pascal.binomial(5, 2), 10);
  });

  ok('binomial(0,0) = 1', () => {
    assert.strictEqual(pascal.binomial(0, 0), 1);
  });

  ok('pascalRow(4) = [1,4,6,4,1]', () => {
    assert.deepEqual(pascal.pascalRow(4), [1, 4, 6, 4, 1]);
  });

  console.log('');

  // ── src/math/memo.js ──────────────────────────────────────────────────────────
  // imp-811: smoke coverage for memoization utilities (LRU cache, memoize,
  // clearAllCaches). These are used throughout visualization pages so silent
  // regressions would corrupt cached computations everywhere.
  console.log('## memo.js');
  const memo = await server.ssrLoadModule('/src/math/memo.js');

  ok('memoize: returns cached result on repeat call (call count = 1)', () => {
    let calls = 0;
    const f = memo.memoize((a, b) => { calls++; return a + b; });
    assert.strictEqual(f(2, 3), 5);
    assert.strictEqual(f(2, 3), 5);
    assert.strictEqual(f(2, 3), 5);
    assert.strictEqual(calls, 1, 'underlying fn should be invoked exactly once');
  });

  ok('memoize: LRU eviction drops oldest entry when maxSize exceeded', () => {
    let calls = 0;
    const f = memo.memoize((x) => { calls++; return x * 2; }, undefined, 2);
    f(1); // cache: [1]
    f(2); // cache: [1,2]
    f(3); // cache: [2,3] — evicts 1
    assert.strictEqual(calls, 3);
    f(2); // hit — still in cache
    assert.strictEqual(calls, 3, 'f(2) should be cached');
    f(1); // miss — was evicted
    assert.strictEqual(calls, 4, 'f(1) should have been evicted and recomputed');
  });

  ok('clearAllCaches: wipes every registered memoize cache', () => {
    let calls = 0;
    const f = memo.memoize((x) => { calls++; return x + 1; });
    f(10); f(10);
    assert.strictEqual(calls, 1);
    memo.clearAllCaches();
    f(10);
    assert.strictEqual(calls, 2, 'cache should have been cleared');
  });

  console.log('');
  console.log('---');
  console.log('Passed : ' + passed);
  console.log('Failed : ' + failed);

  await server.close();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(2);
});
