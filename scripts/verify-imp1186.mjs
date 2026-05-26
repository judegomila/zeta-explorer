#!/usr/bin/env node
// Quick verification: load the imp-1186 file via Vite SSR, print the
// 20-point combined OLS slope + bootstrap CI + verdict + run all tripwires.

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
  const mod = await server.ssrLoadModule('/src/data/imp-1186-lin-stat-20point-sweep.js');
  const r = mod.IMP1186_LIN_STAT_20POINT_SWEEP;
  console.log('=== imp-1186 IMP1186_LIN_STAT_20POINT_SWEEP ===');
  console.log('combinedGrid20 rows :', r.combinedGrid20.length);
  console.log('imp1186NewRows rows :', r.imp1186NewRows.length);
  console.log('imp1162FrozenRows   :', r.imp1162FrozenRows.length);
  console.log('---');
  console.log('combinedOLS20 slope    :', r.combinedOLS20.slope.toFixed(6));
  console.log('combinedOLS20 R^2      :', r.combinedOLS20.R2.toFixed(6));
  console.log('combinedOLS20 intercept:', r.combinedOLS20.intercept.toFixed(6));
  console.log('newOnlyOLS slope       :', r.newOnlyOLS.slope.toFixed(6));
  console.log('newOnlyOLS R^2         :', r.newOnlyOLS.R2.toFixed(6));
  console.log('extensionBeyond1e6 slope:', r.extensionBeyond1e6OLS.slope.toFixed(6));
  console.log('---');
  console.log('Bootstrap (n_replicates =', r.bootstrap.nReplicates, 'finite =', r.bootstrap.nFinite, ')');
  console.log('  slope CI 95%:', `[${r.bootstrap.slopeCI.ci_low_95.toFixed(6)}, ${r.bootstrap.slopeCI.ci_high_95.toFixed(6)}]`,
              ' central:', r.bootstrap.slopeCI.central.toFixed(6),
              ' width:', r.bootstrap.ciWidth.toFixed(6));
  console.log('---');
  console.log('Comparison to imp-1162 13pt:');
  const c = r.comparisonToImp1162;
  console.log('  imp1162_13pt_raw_slope:', c.imp1162_13pt_raw_slope.toFixed(6));
  console.log('  imp1186_20pt_slope    :', c.imp1186_20pt_slope.toFixed(6));
  console.log('  slopeShift            :', c.slopeShift.toFixed(6),
              ' |shift| =', c.absSlopeShift.toFixed(6));
  console.log('  imp1162_13pt CI raw   :',
              `[${c.imp1162_13pt_bootstrap_raw_CI.ci_low_95.toFixed(6)}, ${c.imp1162_13pt_bootstrap_raw_CI.ci_high_95.toFixed(6)}]`,
              ' width:', c.ciWidth13.toFixed(6));
  console.log('  imp1186_20pt CI       :',
              `[${c.imp1186_20pt_bootstrap_CI.ci_low_95.toFixed(6)}, ${c.imp1186_20pt_bootstrap_CI.ci_high_95.toFixed(6)}]`,
              ' width:', c.ciWidth20.toFixed(6));
  console.log('  ciTightened           :', c.ciTightened, '(factor:', c.ciTighteningFactor.toFixed(3), ')');
  console.log('---');
  console.log('verdict:', r.verdict);
  console.log('---');
  console.log('=== NEW ROWS ===');
  for (const row of r.imp1186NewRows) {
    console.log(`  N=${row.N}  eta=${row.eta}  variance=${row.variance.toExponential(6)}  src=${row.source}`);
  }
  console.log('---');
  console.log('=== TRIPWIRES ===');
  const trips = mod.IMP1186_LIN_STAT_20POINT_SWEEP_ASSERTIONS;
  let passed = 0, failed = 0;
  for (const t of trips) {
    let ok;
    try { ok = !!t.holds(); } catch (e) { ok = false; console.log('  ERR', t.id, e.message); }
    console.log(`${ok ? 'PASS' : 'FAIL'} ${t.id}`);
    if (ok) passed++; else { failed++; console.log('  why:', t.why); }
  }
  console.log(`---\n${passed}/${trips.length} passed`);
  process.exitCode = failed === 0 ? 0 : 1;
} finally {
  await server.close();
}
