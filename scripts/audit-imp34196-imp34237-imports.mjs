// One-off audit script for imp-34277: verify imp-34196's data module and the
// Imp34237 viz page do not transitively pull in the 16.7MB(+) zeros bundles.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src');
const HEAVY_FILES = new Set(['zeros-to-1e6.js', 'zeros-first-25.js']);

function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.')) return null; // ignore package imports (react, etc.)
  let p = path.resolve(path.dirname(fromFile), spec);
  const candidates = [p, p + '.js', p + '.jsx'];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function getImports(file) {
  const text = fs.readFileSync(file, 'utf8');
  const specs = [];
  const importRe = /^import\s+(?:[^'"]+?from\s+)?['"]([^'"]+)['"]/gm;
  const dynImportRe = /import\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = importRe.exec(text))) specs.push(m[1]);
  while ((m = dynImportRe.exec(text))) specs.push(m[1]);
  return specs;
}

function traceHeavy(entryFile) {
  const visited = new Set();
  const hits = [];
  function walk(file, chain) {
    if (visited.has(file)) return;
    visited.add(file);
    const base = path.basename(file);
    if (HEAVY_FILES.has(base)) {
      hits.push([...chain, base].join(' -> '));
      return;
    }
    for (const spec of getImports(file)) {
      const resolved = resolveImport(file, spec);
      if (resolved) walk(resolved, [...chain, base]);
    }
  }
  walk(entryFile, []);
  return hits;
}

const targets = [
  'data/imp-34196-fixed-band-peak-increment-minimum-subwindow-refine.js',
  'data/imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js',
  'pages/Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx',
  'data/imp-34274-fixed-band-peak-increment-minimum-viz-data.js',
  'pages/Imp34274FixedBandPeakIncrementMinimumViz.jsx',
];

for (const rel of targets) {
  const entry = path.join(ROOT, rel);
  const hits = traceHeavy(entry);
  console.log(`\n${rel}:`);
  if (hits.length === 0) {
    console.log('  clean -- no transitive heavy zeros-bundle import found');
  } else {
    for (const h of hits) console.log(`  HEAVY IMPORT CHAIN: ${h}`);
  }
}
