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
