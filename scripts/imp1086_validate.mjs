import { createServer } from 'vite';
const vite = await createServer({ server: { middlewareMode: true } });
const m = await vite.ssrLoadModule('/src/data/finite-k-c-mb-crosscheck.js');
const c = m.FINITE_K_C_MB_CROSSCHECK;
console.log('--- FINITE_K_C_MB_CROSSCHECK ---');
console.log('id:', c.id);
console.log('status:', c.status);
console.log('summary:');
for (const [k, v] of Object.entries(c.summary)) {
  console.log('  ' + k + ' =', JSON.stringify(v));
}
console.log('\nverdict:');
console.log(c.verdict);
console.log('\nkeyFindings:');
c.keyFindings.forEach((f, i) => console.log('  [' + i + '] ' + f));
console.log('\nTripwires:');
let fail = 0;
for (const a of m.FINITE_K_C_MB_CROSSCHECK_ASSERTIONS) {
  const ok = a.holds();
  console.log('  ' + (ok ? 'PASS' : 'FAIL') + ' ' + a.id);
  if (!ok) {
    fail++;
    console.log('    why: ' + a.why);
  }
}
console.log('\nTOTAL: ' + m.FINITE_K_C_MB_CROSSCHECK_ASSERTIONS.length + ' assertions, ' + fail + ' failures');
await vite.close();
process.exit(fail === 0 ? 0 : 1);
