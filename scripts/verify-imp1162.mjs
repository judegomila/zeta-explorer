#!/usr/bin/env node
// Quick verification: load the imp-1162 file via Vite SSR, print the
// COMBINED_OLS slope + status verdict + run all tripwires.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

const server = await createServer({
  root: ROOT,
  configFile: false,
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  logLevel: 'silent',
  optimizeDeps: { disabled: true },
});
try {
  const mod = await server.ssrLoadModule('/src/data/esy-lin-stat-extended-sweep-2026-05.js');
  const r = mod.ESY_LIN_STAT_EXTENDED_SWEEP;
  console.log('=== imp-1162 ESY_LIN_STAT_EXTENDED_SWEEP ===');
  console.log('extendedGrid rows :', r.extendedGrid.length);
  console.log('combinedGrid rows :', r.combinedGrid.length);
  console.log('combinedOLS slope :', r.combinedOLS.slope.toFixed(6));
  console.log('combinedOLS R^2   :', r.combinedOLS.R2.toFixed(6));
  console.log('combinedOLS intercept:', r.combinedOLS.intercept.toFixed(6));
  console.log('extendedOnly slope :', r.extendedOnlyOLS.slope.toFixed(6));
  console.log('extendedOnly R^2   :', r.extendedOnlyOLS.R2.toFixed(6));
  console.log('statusVerdict     :', r.statusVerdict);
  console.log('---');
  console.log('Original 5pt slope:', r.comparisonToImp1149SubESY.original5pt.slope.toFixed(6));
  console.log('Original 9pt slope:', r.comparisonToImp1149SubESY.original9pt.slope.toFixed(6));
  console.log('Combined slope    :', r.comparisonToImp1149SubESY.combined.slope.toFixed(6));
  console.log('---');
  console.log('Extended grid:');
  for (const row of r.extendedGrid) {
    console.log(`  N=${row.N}  eta=${row.eta}  variance=${row.variance.toExponential(6)}`);
  }
  console.log('---');
  console.log('=== TRIPWIRES ===');
  const trips = mod.ESY_LIN_STAT_EXTENDED_SWEEP_ASSERTIONS;
  let passed = 0, failed = 0;
  for (const t of trips) {
    const ok = !!t.holds();
    console.log(`${ok ? 'PASS' : 'FAIL'} ${t.id}`);
    if (ok) passed++; else { failed++; console.log('  why:', t.why); }
  }
  console.log(`---\n${passed}/${trips.length} passed`);
  process.exitCode = failed === 0 ? 0 : 1;
} finally {
  await server.close();
}
