import { createServer } from 'vite';
import path from 'node:path';
const ROOT = path.resolve(process.cwd());
const s = await createServer({ root: ROOT, server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const m = await s.ssrLoadModule('/src/data/imp440-cross-verification.js');
  const asrts = m.IMP440_CROSS_VERIFICATION_ASSERTIONS;
  let fail = 0;
  for (const a of asrts) {
    const ok = a.holds();
    console.log(ok ? 'PASS' : 'FAIL', a.id);
    if (!ok) fail++;
  }
  const ic = m.IMP440_CROSS_VERIFICATION.intermediateComparison;
  console.log('intermediate rows:');
  for (const row of ic.rows) {
    console.log(' ', row.component.padEnd(7), 'primary=', row.primary, 'alt=', row.alt, 'relErr=', row.relErr, row.passes ? 'OK' : 'FAIL');
  }
  console.log('exit fail=', fail);
  process.exit(fail ? 1 : 0);
} finally {
  await s.close();
}
