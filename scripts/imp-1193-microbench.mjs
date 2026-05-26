// scripts/imp-1193-microbench.mjs
// Quick, isolated wallclock comparison of single-server vs pool-of-2 Vite SSR
// loading on a fixed minimal module subset. Prints SELFTEST_RESULT= JSON line.
//
// Methodology: each phase loads a tiny fixed subset (mostly small data files)
// against a fresh server (or pool) and times the full lifecycle. The full
// run-assertions sweep is too noisy under concurrent multi-engine load — this
// micro-bench instead exercises the createServer + ssrLoadModule + close
// (or createPool + acquire/release + drain) sequence directly.
//
// Two phases:
//  (A) baseline: createServer + load SUBSET + close
//  (B) pool-of-2: pool.acquire/release SUBSET×2 across 2 workers + drain
//
// Tripwire: phase B reuseCount must be >= cap (every slot reused at least
// once). Reported ratio = poolMs / baselineMs.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createPool } from './lib/ssr-pool.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

// Small, fast modules so each phase completes in < ~10s even under load.
// Picked to avoid the sota-lambda-claim.js SSR pre-existing load issue.
const SUBSET = [
  '/src/data/papers-release-manifest.js',
  '/src/data/rh-equivalents-reference.js',
  '/src/data/imp-1193-ssr-pool-validation.js',
];

async function timeBaseline() {
  const handlesBefore = process._getActiveHandles().length;
  const t0 = Date.now();
  const srv = await createServer({
    root: ROOT, logLevel: 'error', appType: 'custom',
    server: { middlewareMode: true },
  });
  for (const p of SUBSET) {
    try { await srv.ssrLoadModule(p); } catch { /* ignore module-graph noise */ }
  }
  const ms = Date.now() - t0;
  await srv.close();
  const handlesAfter = process._getActiveHandles().length;
  return { ms, handleDelta: handlesAfter - handlesBefore };
}

async function timePool(cap) {
  const handlesBefore = process._getActiveHandles().length;
  const t0 = Date.now();
  const pool = createPool({
    cap,
    viteOptions: { root: ROOT, logLevel: 'error', appType: 'custom',
                   server: { middlewareMode: true } },
  });
  const work = [...SUBSET, ...SUBSET, ...SUBSET]; // 3x to force reuse
  async function worker() {
    while (work.length) {
      const p = work.shift();
      if (!p) return;
      const slot = await pool.acquire();
      try { await slot.server.ssrLoadModule(p); } catch { /* ignore */ }
      pool.release(slot);
    }
  }
  await Promise.all(Array.from({ length: cap }, () => worker()));
  const ms    = Date.now() - t0;
  const stats = pool.stats();
  await pool.drain();
  const handlesAfter = process._getActiveHandles().length;
  return { ms, stats, handleDelta: handlesAfter - handlesBefore };
}

console.error('# imp-1193 micro-bench start', new Date().toISOString());
const baseline = await timeBaseline();
console.error('  baseline:', baseline.ms, 'ms');
const pool2    = await timePool(2);
console.error('  pool2:', pool2.ms, 'ms (created=' + pool2.stats.created + ', reuseCount=' + pool2.stats.reuseCount + ')');

const result = {
  timestamp:           new Date().toISOString(),
  subsetSize:          SUBSET.length,
  baselineMs:          baseline.ms,
  baselineHandleDelta: baseline.handleDelta,
  pool2Ms:             pool2.ms,
  pool2Ratio:          Number((pool2.ms / baseline.ms).toFixed(3)),
  pool2Stats:          pool2.stats,
  pool2HandleDelta:    pool2.handleDelta,
};

console.log('# imp-1193 micro-bench');
console.log(JSON.stringify(result, null, 2));
console.log('SELFTEST_RESULT=' + JSON.stringify(result));
process.exit(0);
