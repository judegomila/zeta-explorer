#!/usr/bin/env node
// scripts/verify-zeros-importers.mjs
// imp-2880: Verify assertions in the 65+ src/data and src/math modules that
// import zeros-to-1e6.js.  These modules hang under Vite ssrLoadModule (and
// are watchdog-killed by run-assertions.mjs), so we bundle each one with
// esbuild (bundle:true, platform:node) and run the bundle under plain node.
//
// Usage:
//   node scripts/verify-zeros-importers.mjs           # all heavy importers
//   node scripts/verify-zeros-importers.mjs --list    # just list the modules, no run
//
// Exit codes:
//   0 -- all assertions pass (or no assertions found)
//   1 -- one or more assertion failures
//   2 -- script error

import { build } from 'esbuild';
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');
const LIST_ONLY  = process.argv.includes('--list');

// ── Find heavy importers ───────────────────────────────────────────────────

function findHeavyImporters() {
  const result = execSync(
    'grep -rl "zeros-to-1e6" src/data/ src/math/ 2>/dev/null || true',
    { cwd: ROOT, encoding: 'utf8' }
  );
  return result
    .trim()
    .split('\n')
    .filter((f) => f && !f.endsWith('.bak') && (f.endsWith('.js') || f.endsWith('.mjs')))
    .sort();
}

// ── Build wrapper source ───────────────────────────────────────────────────

function wrapperSource(absPath) {
  // ESM dynamic import so esbuild can resolve and bundle the target module.
  return `
import * as mod from ${JSON.stringify(absPath)};
let passed = 0, failed = 0, total = 0;
for (const [k, v] of Object.entries(mod)) {
  if (!k.endsWith('_ASSERTIONS') || !Array.isArray(v)) continue;
  for (const a of v) {
    total++;
    try {
      if (a.holds()) {
        passed++;
      } else {
        failed++;
        process.stderr.write('FAIL ' + a.id + ': ' + (a.why || '(no why)') + '\\n');
      }
    } catch (e) {
      failed++;
      process.stderr.write('ERROR ' + (a.id || '?') + ': ' + e.message + '\\n');
    }
  }
}
process.stdout.write(JSON.stringify({ passed, failed, total }) + '\\n');
process.exit(failed > 0 ? 1 : 0);
`;
}

// ── Run one module ─────────────────────────────────────────────────────────

async function verifyModule(relPath) {
  const absPath  = path.resolve(ROOT, relPath);
  const tmpDir   = os.tmpdir();
  const safeName = relPath.replace(/[^a-zA-Z0-9]/g, '_');
  const outFile  = path.join(tmpDir, `zpi_${safeName}.mjs`);

  let buildResult;
  try {
    buildResult = await build({
      stdin: {
        contents: wrapperSource(absPath),
        resolveDir: ROOT,
        loader: 'js',
      },
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: outFile,
      write: true,
      logLevel: 'silent',
      // Suppress the massive zeros bundle from being re-read on every module
      // by marking it as external if the module re-exports it without using
      // _ASSERTIONS.  However we must NOT mark it external generically — the
      // assertions themselves may depend on the zeros data.  So we bundle fully.
    });
  } catch (e) {
    return { relPath, status: 'BUILD_ERR', passed: 0, failed: 0, total: 0, error: e.message };
  }

  const run = spawnSync(process.execPath, ['--input-type=module'], {
    input: fs.readFileSync(outFile, 'utf8'),
    encoding: 'utf8',
    timeout: 120_000,
    cwd: ROOT,
  });

  try { fs.unlinkSync(outFile); } catch (_) { /* ignore */ }

  if (run.status === null) {
    return { relPath, status: 'TIMEOUT', passed: 0, failed: 0, total: 0 };
  }

  let result = { passed: 0, failed: 0, total: 0 };
  if (run.stdout && run.stdout.trim()) {
    try { result = JSON.parse(run.stdout.trim().split('\n').pop()); } catch (_) { /* ignore */ }
  }

  const status = run.status !== 0
    ? (result.failed > 0 ? 'FAIL' : 'NODE_ERR')
    : 'PASS';

  return {
    relPath,
    status,
    passed: result.passed,
    failed: result.failed,
    total:  result.total,
    stderr: run.stderr ? run.stderr.trim().slice(0, 500) : '',
  };
}

// ── Main ──────────────────────────────────────────────────────────────────

const heavyModules = findHeavyImporters();

if (heavyModules.length === 0) {
  console.log('No modules importing zeros-to-1e6 found — nothing to verify.');
  process.exit(0);
}

if (LIST_ONLY) {
  console.log(`Heavy importers of zeros-to-1e6 (${heavyModules.length} total):`);
  for (const m of heavyModules) console.log('  ' + m);
  process.exit(0);
}

console.log(`verify-zeros-importers: checking ${heavyModules.length} heavy importer(s) via esbuild+node`);
console.log('(each module is bundled and run outside the Vite SSR path)\n');

const results = [];
let totalPassed = 0, totalFailed = 0, totalNoAssert = 0, totalErr = 0;

for (const relPath of heavyModules) {
  process.stdout.write(`  ${relPath} ... `);
  const r = await verifyModule(relPath);
  results.push(r);

  if (r.status === 'PASS') {
    if (r.total === 0) {
      console.log('(no assertions)');
      totalNoAssert++;
    } else {
      console.log(`PASS (${r.passed}/${r.total})`);
      totalPassed++;
    }
  } else if (r.status === 'FAIL') {
    console.log(`FAIL (${r.passed}/${r.total})`);
    if (r.stderr) console.log('    ' + r.stderr.replace(/\n/g, '\n    '));
    totalFailed++;
  } else {
    console.log(r.status + (r.error ? ': ' + r.error.slice(0, 120) : ''));
    if (r.stderr) console.log('    ' + r.stderr.replace(/\n/g, '\n    '));
    totalErr++;
  }
}

console.log(`\n--- Summary ---`);
console.log(`  PASS:         ${totalPassed}`);
console.log(`  FAIL:         ${totalFailed}`);
console.log(`  No assertions:${totalNoAssert}`);
console.log(`  Errors:       ${totalErr}`);
console.log(`  Total modules:${heavyModules.length}`);

if (totalFailed > 0) {
  console.log('\nSome assertions FAILED under esbuild+node — these are real bugs (not watchdog kills).');
  process.exit(1);
} else if (totalErr > 0) {
  console.log('\nSome modules could not be bundled/run — check BUILD_ERR/NODE_ERR rows above.');
  process.exit(1);
} else {
  console.log('\nAll assertions that could be evaluated PASSED under esbuild+node.');
  process.exit(0);
}
