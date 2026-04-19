#!/usr/bin/env node
// scripts/run-assertions.mjs
// imp-501: Build-time assertion sweep -- run every exported *_ASSERTIONS array
// in src/math/ and src/data/ and exit non-zero if any fail.
//
// Uses Vite ssrLoadModule so ES-module imports between math files work without
// requiring "type":"module" in package.json. The server is created in
// middlewareMode so it does not bind a port.
//
// Usage:
//   node scripts/run-assertions.mjs              # full sweep
//   node scripts/run-assertions.mjs --fast       # skip modules known to be slow
//
// Exit codes:
//   0 -- all assertions pass
//   1 -- one or more assertions fail
//   2 -- script itself failed (Vite init error, module load error)
//
// Output:
//   scripts/logs/assertions-<ISO>.md

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');
const LOGS_DIR   = path.join(__dirname, 'logs');
const FAST_MODE  = process.argv.includes('--fast');

// ── Module lists ──────────────────────────────────────────────────────────────

// Modules with CPU-heavy top-level computations (backward CM simulation etc.).
// In --fast mode these are skipped; in full mode they are loaded last so the
// Vite cache is warm and subsequent re-imports are instant.
const HEAVY_MODULES = [
  '/src/math/d-monotone-analytic-proof.js',
];

// All modules that export *_ASSERTIONS arrays (auto-detected at runtime).
// This list is ordered so heavy dependencies are loaded before the modules
// that re-import them.
const MATH_MODULES = [
  '/src/math/g1-sub-extremal-closure.js',
  '/src/math/path-g-cauchy-rigorous.js',
  '/src/math/m-raw-from-umon-bridge.js',
  '/src/math/rvm-jacobian-lower-bound.js',
  '/src/math/route-a-shift-witness.js',
  '/src/math/many-body-correction-closure.js',
  '/src/math/d-monotone-analytic-proof.js',
  '/src/math/mertens-rate-tightening.js',
  '/src/math/path-c-circularity-resolution.js',
  '/src/math/noswap-closure.js',
  '/src/math/chain-crossverify-N5e5.js',
  '/src/math/route-a-unfolded-reformulation.js',
  '/src/math/route-a-cm-extension.js',
  '/src/math/route-a-argmin-closure.js',
  '/src/math/paper-skeptic-review-2.js',
  '/src/math/verify-imp440-altpath.js',
  '/src/math/paper-skeptic-review-3.js',
  // imp-872: Phase 51 UNCOND-Λ sequence modules (imp-833/834/856).
  '/src/math/route-c-dynamical-analysis.js',
  '/src/math/c-mb-weaker-bound-search.js',
  // imp-857: PATH 3 follow-up — interval-arithmetic certified Dyson sweep.
  '/src/math/c-mb-interval-certified.js',
  // imp-862: PATH 2 escape hatch B2 — CM Hamiltonian rate analysis.
  '/src/math/route-c-cm-hamiltonian.js',
  // imp-864+865+866: alternative-angle scoping (Vinogradov / BBS / Maier).
  '/src/math/c-mb-alternative-angles-eval.js',
  // imp-871: adversarial review 7b (Phase 51 post-state).
  '/src/math/paper-skeptic-review-7b-phase51.js',
  // imp-863: PATH 2 escape hatch B3 — matched asymptotic.
  '/src/math/route-c-matched-asymptotic.js',
];

const DATA_MODULES = [
  '/src/data/lambda-N1e6-final-assembly.js',
  '/src/data/lambda-N1e6-unconditional-beat.js',
  '/src/data/lambda-max-gap-extremal.js',
  '/src/data/lambda-intercept-pooled.js',
  '/src/data/g1-g2-closure.js',
  '/src/data/rh-dag.js',
  '/src/data/interval-dyson-collision.js',
  '/src/data/g6a-sub-hyperbolic-closure.js',
  '/src/data/imp440-cross-verification.js',
  '/src/data/path-c-baseline-fit-v2.js',
  '/src/data/imp-336-post-ladder-update.js',
  '/src/data/lambda-burgers-shock-lipschitz.js',
  '/src/data/soundararajan-bui-gap-bound.js',
  '/src/data/ticket-router.js',
  '/src/data/d-monotone-numerical-witness.js',
  '/src/data/lambda-polymath15-bridge.js',
  '/src/data/lambda-intercept-mingap-heuristic.js',
  '/src/data/lambda-pt-scale-extrapolation.js',
  '/src/data/lambda-roadmap.js',
  '/src/data/lambda-interval-dyson.js',
  '/src/data/guth-maynard-tail-bound.js',
  '/src/data/sota-lambda-claim.js',
  // imp-872: imp-833 PATH 1 empirical sweep extended to N=100k.
  '/src/data/empirical-m-sweep-extended.js',
];

const ALL_MODULES = FAST_MODE
  ? [...MATH_MODULES, ...DATA_MODULES].filter((m) => !HEAVY_MODULES.includes(m))
  : [...MATH_MODULES, ...DATA_MODULES];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + 'Z';
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  let server;
  try {
    server = await createServer({
      root:    ROOT,
      logLevel: 'error',
      appType:  'custom',
      server:   { middlewareMode: true },
    });
  } catch (e) {
    console.error('FATAL: could not create Vite server:', e.message);
    process.exit(2);
  }

  const startMs  = Date.now();
  let passed     = 0;
  let failed     = 0;
  let loadErrors = 0;
  const failures = [];
  const lines    = [];

  function log(msg) { console.log(msg); lines.push(msg); }

  log('# Assertion sweep — ' + new Date().toISOString());
  log('Mode: ' + (FAST_MODE ? 'fast (heavy modules skipped)' : 'full'));
  log('');

  for (const modPath of ALL_MODULES) {
    let mod;
    try {
      mod = await server.ssrLoadModule(modPath);
    } catch (e) {
      const msg = 'LOAD_ERR ' + modPath + ': ' + e.message.slice(0, 120);
      log('  ' + msg);
      loadErrors++;
      failed++;
      failures.push({ id: modPath, why: 'module load error: ' + e.message.slice(0, 80) });
      continue;
    }

    const arrays = Object.entries(mod).filter(
      ([k, v]) => k.endsWith('_ASSERTIONS') && Array.isArray(v)
    );
    if (arrays.length === 0) continue;

    for (const [name, arr] of arrays) {
      let modPass = 0, modFail = 0;
      for (const a of arr) {
        let ok;
        try { ok = a.holds(); } catch (e) {
          ok = false;
          a._err = e.message;
        }
        if (ok) {
          passed++;
          modPass++;
        } else {
          failed++;
          modFail++;
          failures.push({ id: a.id, why: (a.why || a._err || '').slice(0, 100) });
          log('  FAIL: ' + a.id);
        }
      }
      if (modFail === 0) {
        log('  OK  : ' + name + ' (' + modPass + ' assertions)');
      }
    }
  }

  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
  log('');
  log('---');
  log('Passed : ' + passed);
  log('Failed : ' + failed);
  log('Errors : ' + loadErrors + ' load errors');
  log('Time   : ' + elapsed + 's');
  log('');

  if (failures.length > 0) {
    log('## Failures');
    for (const f of failures) {
      log('- `' + f.id + '`: ' + (f.why || '').slice(0, 80));
    }
  }

  // Write log file
  if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
  const logFile = path.join(LOGS_DIR, 'assertions-' + isoTimestamp() + '.md');
  fs.writeFileSync(logFile, lines.join('\n') + '\n');
  console.log('\nLog written to ' + path.relative(ROOT, logFile));

  await server.close();

  if (failed > 0) {
    console.error('\nASSERTION SWEEP FAILED: ' + failed + ' failures');
    process.exit(1);
  } else {
    console.log('\nAll assertions pass.');
    process.exit(0);
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(2);
});
