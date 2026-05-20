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
  // imp-857 alt-path: phased-forcing proof-path memo + commutator bound.
  '/src/math/imp-857-phased-forcing-memo.js',
  '/src/math/imp-857-commutator-bound.js',
  // imp-857 GUE-elimination pathway — merges imp-362 + imp-899 rows.
  '/src/math/imp-857-gue-elimination.js',
  // imp-903: uniform-K-bound structural reduction (27 H_raw plateaus).
  '/src/math/imp-857-uniform-K-bound.js',
  // imp-925: eml-interval primitive (Odrzywołek arXiv:2603.21852v2).
  '/src/math/imp-925-eml-interval-primitive.mjs',
  // imp-924: eml-normal-form rewrites + cancellation-search NEGATIVE result.
  '/src/math/imp-924-eml-normal-form.js',
  // imp-911 sharper cumulative Lipschitz bound: width-independent C_∞ ≈ 0.4382
  // replaces the imp-911 universal-per-step W × 0.6796 bound.
  '/src/math/imp-911-sharper-cumulative-lipschitz.js',
  // imp-911: formal Lipschitz bound on plateau F_mb growth (step 3 upgrade).
  '/src/math/imp-903-F-mb-plateau-lipschitz-proof.js',
  // imp-897: Richardson-extrapolated certified C_mb_empirical interval bound
  // from the phased-forcing grid, closed against the imp-892 residual.
  '/src/math/imp-857-phased-forcing-richardson.js',
  // imp-899 HONEST PARTIAL: bilinear linear-response fit + saddle-point
  // analysis of the imp-894 2x2 pilot (nSteps=30 regime only).
  '/src/math/imp-899-linear-response-bilinear-fit.js',
  // imp-370 / imp-508: HONEST PARTIAL closure of ESY port obstacle O1
  // (arithmetic input via Burgers-envelope KH bound + Cauchy interlacing).
  // Tripwires keep the residual O1-remaining-concentration sub-gap honest
  // and prevent a silent flip to "closed".
  '/src/math/esy-o1-closure.js',
];

// ── Data module registrations for imp-857 baseline sweep result. ──
// (Kept local to the change in case the top-level list becomes stale.)

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
  // imp-857-baseline-sweep-partial: disproves "blow-up at N>=1000" premise.
  '/src/data/imp-857-baseline-sweep-result.js',
  // imp-903 27-point H_raw-update sweep: rescue satisfied from N_0 = 100.
  '/src/data/imp-903-uniform-sweep-result.js',
  // imp-904 dense-N-grid partial closure: 31-N combined catalog over [10, 10^4].
  '/src/data/imp-904-dense-grid-analysis.js',
  // imp-933: per-plateau interior interval-RK4 certs (replaces universal Gronwall exp(1)).
  '/src/data/imp-911-per-plateau-gronwall-certs.js',
  // imp-963: finite-K C_mb unconditional closure for imp-856 / imp-835 / imp-440.
  '/src/data/finite-k-c-mb-unconditional.js',
  // imp-1086: cross-verification of imp-963 K = 0.2014 with DP45 second integrator.
  '/src/data/finite-k-c-mb-crosscheck.js',
  // imp-962 HONEST PARTIAL: plateau-structure scan on (10⁴, 10⁶].
  '/src/data/imp-962-plateau-structure-N10k-to-N1e6.js',
  // imp-360 / imp-423: extended measured ladder at N ∈ {25k…1M} (one-ULP interval RK4).
  '/src/data/imp-360-extended-ladder-N1e6.js',
  // imp-962: per-plateau START+INTERIOR interval-RK4 certs for N ∈ (10⁴, 10⁶].
  '/src/data/imp-962-per-plateau-gronwall-certs-N10k-to-N1e6.js',
  // imp-1081: paper appendix C — rigorous unconditional finite-height beat at N* = 1e4.
  '/src/data/paper-appendix-C-finite-height-beat.js',
  // imp-1083: arXiv front-matter abstract rewrite leading with the rigorous finite-N* beat.
  '/src/data/paper-abstract-rewrite-2026-05.js',
  // imp-1094: paper Sections 1-3 draft (Introduction, Background, Main Result).
  '/src/data/paper-sections-1-3.js',
  // imp-1105: paper publication record (compiled PDF + sectionsIncluded + tripwires).
  '/src/data/paper-publication-2026-05.js',
  // imp-1090: Rust interval-RK4 backend Phase 1 MVP validation record.
  '/src/data/rust-port-phase1-validation.js',
  // imp-1091: Rust interval-RK4 Phase 2 wire-up validation (CLI dispatch).
  '/src/data/rust-port-phase2-wire-validation.js',
  // imp-1092: Rust interval-RK4 Phase 3 PILOT (1-of-9 plateaus measured, N=2e4).
  '/src/data/rust-port-phase3-pilot-validation.js',
  // imp-1093: Lambda timeline visualization page build-time validation.
  '/src/data/lambda-timeline-page-validation.js',
  // imp-1095: LIVE Lean toolchain installed + per-module lake build executed.
  '/src/data/lean-toolchain-validation-2026-05.js',
  // imp-1114: Constants.lean 4 elaboration errors fixed (closes imp-1095-sub-elaboration-fixes).
  '/src/data/lean-constants-elaboration-fixes-2026-05.js',
  // imp-1099: GUE Wigner surmise vs first 10000 Riemann zero spacings.
  '/src/data/gue-vs-zeros-comparison.js',
  // imp-1100: Voronin universality theorem numerical witness.
  '/src/data/voronin-universality-numerical.js',
  // imp-1098: Montgomery pair correlation conjecture numerical exploration.
  '/src/data/pair-correlation-montgomery-numerical.js',
  // imp-1097: Riemann-Siegel Z(t) high-precision explorer data + tripwires.
  '/src/data/riemann-siegel-z-explorer.js',
  // imp-1101: Berry-Keating xp Hamiltonian -- truncated-Hermite spectral data.
  '/src/data/berry-keating-xp-spectral.js',
  // imp-1102: Hardy Z(t) asymptotic comparison data file (sonnet-4-6 bucket).
  '/src/data/hardy-z-asymptotic-comparison.js',
  // imp-1096: page health audit refresh after user-reported /#/full-story load failure.
  '/src/data/page-health-audit-2026-05-18.js',
  // imp-1107: SOTA attack 2 -- survey of 3 alternative asymptotic routes.
  '/src/data/sota-asymptotic-alternatives-2026-05.js',
  // imp-1106: SOTA attack 1 -- ESY rigidity SMALL-WEDGE attempt (wedge failed cleanly, 3 obstructions named).
  '/src/data/esy-small-wedge-attempt-2026-05.js',
  // imp-1109: SOTA attack 4 -- Connes adelic spectral interpretation + truncated trace positivity at t = 0.02.
  '/src/data/connes-adelic-lambda-2026-05.js',
  // imp-1108: SOTA attack 3 -- empirical psi_N measurement of ESY rigidity at our existing N.
  '/src/data/esy-rigidity-empirical-2026-05.js',
  // imp-1112: Rust-only sanity sweep diagnostic at plateau N in (1e4, 1e6].
  '/src/data/rust-port-sanity-sweep-2026-05.js',
  // imp-1110: Rust interval-RK4 Phase 4 rayon parallel plateau sweep.
  '/src/data/rust-port-phase4-rayon-validation.js',
  // imp-1124: Bui-Sound optimal sigma finder for E_trunc_pt under the BS exponent.
  '/src/data/bui-soundararajan-optimal-sigma-2026-05.js',
  // imp-1128: EDGE rigidity attack -- psi_N measurement near gamma_1 (vs imp-1108 bulk).
  '/src/data/edge-rigidity-empirical-2026-05.js',
  // imp-1123: Bui-Soundararajan PRIMARY rigorous-port attack on asymptotic SOTA.
  '/src/data/bui-soundararajan-rigorous-port-2026-05.js',
  // imp-1125: Goldston-Yildirim sieve + Maynard k-tuple numerical projection on imp-440 chain.
  '/src/data/goldston-yildirim-projection-2026-05.js',
  // imp-1127: HYBRID attack -- Bui-Sound density (imp-1123) + Polymath15 bridge refinement (imp-397/398/399).
  '/src/data/bui-sound-plus-polymath-bridge-2026-05.js',
  // imp-1135: C_C Selberg sieve refinement attempt (research-feasible 1.15x ceiling).
  '/src/data/c-c-selberg-refinement-2026-05.js',
  // imp-1131: JSDoc asterisk-slash audit for Polymath15 constants and consumers.
  '/src/data/polymath15-jsdoc-audit-2026-05.js',
  // imp-1134: C_F engine-closable refinement audit -- the imp-1127 hypothetical 1.05x is sign-flipped; honest factor = 1.00x.
  '/src/data/c-f-bulk-refinement-2026-05.js',
  // imp-1132: V2 intercept attack -- Barnes-Hut O(N log N) sparse drift sum in Rust.
  '/src/data/rust-port-phase7-barnes-hut.js',
  // imp-1139: BH multipole extension (monopole + dipole + quadrupole) -- O((extent/dist)^3) envelope.
  '/src/data/rust-port-phase8-multipole.js',
  // imp-1111: Rust port Phase 5 Verner 8(7) triangulation contract (HONEST PARTIAL).
  '/src/data/rust-port-phase5-verner-triangulation.js',
  // imp-1142: API channel engine (5th engine variant via Anthropic API direct).
  '/src/data/api-channel-engine-2026-05.js',
  // imp-1136: Phase 3 production sweep with Barnes-Hut backend -- HONEST PARTIAL.
  '/src/data/k-plateau-ladder-measured-2026-05.js',
  // imp-1137: V2 OLS interval-arithmetic refit -- rigorous error bar on the asymptotic intercept.
  '/src/data/v2-ols-interval-2026-05.js',
  // imp-1144: USER-REPORTED click-links audit (TOC fix on /#/full-story + app-wide click sweep).
  '/src/data/click-links-audit-2026-05-19.js',
  // imp-1147: composed rigorous asymptotic Lambda upper bound (~8e-4, 250x tighter than PT 2021).
  '/src/data/asymptotic-lambda-bound-2026-05-20.js',
  // imp-1129: Path C heuristic error-bar refit using imp-1136 9-plateau BH sweep.
  '/src/data/path-c-error-bar-refit-2026-05-20.js',
  // imp-1149: HONEST PARTIAL Koksma-Hlawka 2nd-moment attempt — intermediate N^{3/2} rate result.
  '/src/data/koksma-hlawka-2nd-moment-deviation-bound.js',
  // imp-1141: Rust full-chain port (C_mb + E_trunc + E_flow + E_coll + L_pt in chain.rs).
  '/src/data/rust-port-phase10-full-chain.js',
  // imp-1140: Verner 8(7) / Fehlberg RK7(8) third integrator for bug-class triangulation.
  '/src/data/rust-port-phase9-verner-triangulation.js',
  // imp-1086-sub-interval-dp45: DP45 interval-arithmetic cross-check (extends imp-1086 from point to interval).
  '/src/data/rust-port-phase11-dp45-triangulation.js',
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
