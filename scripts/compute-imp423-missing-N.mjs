#!/usr/bin/env node
/**
 * Compute H_raw, t_c_pair, pairIdx for N in {150000, 400000, 600000}
 * for imp-423 ladder extension. O(N) operation, fast at build time NOT
 * required — runs offline once and writes JSON sidecar.
 */
import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const TARGETS = [150000, 400000, 600000];

function compute(N) {
  let minGap = Infinity;
  let minIdx = -1;
  for (let i = 0; i + 1 < N; i++) {
    const g = ZEROS_EXTENDED[i + 1] - ZEROS_EXTENDED[i];
    if (g < minGap) {
      minGap = g;
      minIdx = i;
    }
  }
  const t_c_pair = (minGap * minGap) / 8;
  return { N, H_raw: minGap, t_c_pair, pairIdx: minIdx };
}

const t0 = Date.now();
console.log('ZEROS_EXTENDED.length =', ZEROS_EXTENDED.length);
const results = [];
for (const N of TARGETS) {
  const r = compute(N);
  const estStepSec = Math.round(410 * Math.pow(N / 25000, 2));
  console.log(JSON.stringify({ ...r, estimatedStepSec: estStepSec }));
  results.push({ ...r, estimatedStepSec: estStepSec });
}
console.log('elapsed ms:', Date.now() - t0);
