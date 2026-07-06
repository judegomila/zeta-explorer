// One-off audit script for imp-34440: verify the honest-status caveat block
// (component model NOT a rigorous asymptotic, C_mb GUE-conditional per imp-486,
// no bound change, NO QED, Platt-Trudgian Lambda<=0.2 SOTA) present in the
// imp-34345/34346/34347/34348/34349 module JSDoc also reaches the rendered
// improvements.js `detail` field the ImprovementsPage viewer shows to readers.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const CLUSTER = ['imp-34345', 'imp-34346', 'imp-34347', 'imp-34348', 'imp-34349'];
const CAVEAT_MARKERS = ['NOT a rigorous asymptotic', 'C_mb GUE-conditional per imp-486', 'NO QED'];

const improvementsSrc = fs.readFileSync(path.join(ROOT, 'src/data/improvements.js'), 'utf8');
const viewerSrc = fs.readFileSync(path.join(ROOT, 'src/pages/ImprovementsPage.jsx'), 'utf8');

// Confirm the viewer renders `imp.detail` in full and unconditionally (no slice/truncate).
const rendersFullDetail = /\{imp\.detail &&/.test(viewerSrc)
  && /\{imp\.detail\}/.test(viewerSrc)
  && !/imp\.detail\.(slice|substring|substr)/.test(viewerSrc);

console.log(`ImprovementsPage renders imp.detail in full: ${rendersFullDetail}`);
console.log('');

for (const id of CLUSTER) {
  const idx = improvementsSrc.indexOf(`summary: "${id} `);
  if (idx === -1) {
    console.log(`${id}: NOT FOUND in improvements.js -- cannot audit`);
    continue;
  }
  // Grab this single-line entry (bounded by the next "{ id:" or end of array).
  const nextEntry = improvementsSrc.indexOf('{ id:', idx + 1);
  const entryText = improvementsSrc.slice(idx, nextEntry === -1 ? idx + 20000 : nextEntry);
  const missing = CAVEAT_MARKERS.filter(marker => !entryText.includes(marker));
  if (missing.length === 0) {
    console.log(`${id}: caveat block present in rendered detail (all markers found)`);
  } else {
    console.log(`${id}: MISSING markers in rendered detail: ${missing.join(', ')}`);
  }
}
