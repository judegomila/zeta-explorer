// scripts/imp-1193-quick-reuse-test.mjs
// Fast (< 1s under quiet load, < 30s under heavy contention) cache-hit /
// reuse-counter validation of the ssr-pool. Does NOT compete with engine
// sweeps — it creates exactly ONE Vite server total (cap=1) and exercises
// acquire/release/drain. Emits SELFTEST_RESULT= JSON line.

import { createPool } from './lib/ssr-pool.mjs';

const handlesBefore = process._getActiveHandles().length;
const t0 = Date.now();

const pool = createPool({
  cap: 1,
  viteOptions: {
    root: process.cwd(),
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true },
  },
});

const s1 = await pool.acquire();
pool.release(s1);
const s2 = await pool.acquire();
pool.release(s2);
const s3 = await pool.acquire();
pool.release(s3);

const stats = pool.stats();
await pool.drain();

const totalMs       = Date.now() - t0;
const handlesAfter  = process._getActiveHandles().length;
const handleDelta   = handlesAfter - handlesBefore;

const result = {
  timestamp:       new Date().toISOString(),
  totalMs,
  acquireCount:    3,
  created:         stats.created,
  reuseCount:      stats.reuseCount,
  cap:             stats.cap,
  reuseRate:       Number((stats.reuseCount / 3).toFixed(3)),
  handleDelta,
  firstAcquireReused:  s1.reused,
  secondAcquireReused: s2.reused,
  thirdAcquireReused:  s3.reused,
};

console.log('# imp-1193 quick reuse test');
console.log(JSON.stringify(result, null, 2));
console.log('SELFTEST_RESULT=' + JSON.stringify(result));
process.exit(0);
