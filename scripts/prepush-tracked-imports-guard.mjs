#!/usr/bin/env node
/**
 * prepush-tracked-imports-guard — catches the shared-worktree deploy race.
 *
 * The recurring failure: a fleet engine commits a page (or wires an import into
 * App.jsx / run-assertions.mjs) whose target data module exists in the WORKING
 * TREE but was never `git add`ed. A local `vite build` passes (the file is on
 * disk), the push succeeds, and Vercel's clean checkout then fails with
 * "Could not resolve ../data/<module>.js". This guard is a fast, build-free
 * static check: every ./pages import in App.jsx and every ../data (or ./ , ../math)
 * import inside src/pages, src/components, src/data, and scripts/run-assertions.mjs
 * must resolve to a file that is TRACKED by git (`git ls-files`), not merely
 * present on disk. Exits non-zero and lists offenders if any import is untracked.
 *
 * Usage (wire into the fleet auto-push, before `git push`):
 *   node scripts/prepush-tracked-imports-guard.mjs || { echo "guard blocked push"; skip-push; }
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tracked = new Set(
  execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\n').filter(Boolean),
);

// Files whose relative imports we check, and the dir each resolves imports against.
const scanRoots = ['src/pages', 'src/components', 'src/data'];
const scanFiles = ['src/App.jsx', 'scripts/run-assertions.mjs'];
const files = [];
for (const d of scanRoots) {
  const abs = path.join(ROOT, d);
  if (fs.existsSync(abs)) for (const f of fs.readdirSync(abs)) if (/\.(jsx?|mjs)$/.test(f)) files.push(path.join(d, f));
}
for (const f of scanFiles) if (fs.existsSync(path.join(ROOT, f))) files.push(f);

const IMPORT_RE = /(?:import|from)\s*\(?\s*['"](\.\.?\/[^'"]+?)['"]/g;
const offenders = [];
for (const rel of files) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const dir = path.dirname(rel);
  let m;
  while ((m = IMPORT_RE.exec(src)) !== null) {
    let spec = m[1];
    if (!/\.(jsx?|mjs|json|css)$/.test(spec)) spec += '.js'; // bare specifier -> .js (vite resolves)
    const target = path.normalize(path.join(dir, spec)).replace(/\\/g, '/');
    if (!/^src\/|^scripts\//.test(target)) continue; // only local source
    if (!tracked.has(target)) {
      // tolerate .js<->.jsx resolution
      const alt = target.replace(/\.js$/, '.jsx');
      if (tracked.has(alt)) continue;
      const onDisk = fs.existsSync(path.join(ROOT, target)) || fs.existsSync(path.join(ROOT, alt));
      offenders.push({ from: rel, import: m[1], target, onDisk });
    }
  }
}

if (offenders.length) {
  console.error(`\n✗ prepush guard: ${offenders.length} import(s) target UNTRACKED files (would break Vercel's clean build):`);
  for (const o of offenders) {
    console.error(`  ${o.from} -> "${o.import}"  [${o.target}]  ${o.onDisk ? '(present on disk but NOT git-tracked — git add it!)' : '(missing entirely)'}`);
  }
  console.error('\nFix: `git add` the on-disk-but-untracked modules before pushing.\n');
  process.exit(1);
}
console.log('✓ prepush guard: all page/data/assertion imports are git-tracked.');
process.exit(0);
