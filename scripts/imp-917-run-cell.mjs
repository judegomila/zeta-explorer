#!/usr/bin/env node
// imp-917 per-cell offline-worker driver for the phased-forcing grid sweep.
//
// imp-896 INFRASTRUCTURE-COMPLETE closure published RETUNING_CALIBRATION and a
// per-cell env-var invocation recipe for src/math/imp-857-phase-locked-dyson.mjs.
// imp-917 is the ~20 CPU-hour execution of the 14 remaining (N, eps) cells.
// This script is the thin driver that reads the retuning table by N, picks
// the (k0_star, phaseVel_star) pair, and spawns the prototype with the right
// IMP857_* env vars. Offline workers invoke it per cell; engine turns do not.
//
// Usage:
//   node scripts/imp-917-run-cell.mjs --N 1000 --eps 0,0.02,0.1 [--nSteps 40] [--dt 1e-4]
//   node scripts/imp-917-run-cell.mjs --N 1000 --eps 0,0.02,0.1 --dry-run
//   node scripts/imp-917-run-cell.mjs --list
//   node scripts/imp-917-run-cell.mjs --verify-plan
//   node scripts/imp-917-run-cell.mjs --dry-run-all
//
// --eps must be a comma-separated triple; the first entry is conventionally 0
// (baseline) so ratio rows can be computed against it. Defaults for nSteps/dt
// are taken from the MISSING_CELLS row of imp-896-retuning-calibration.js
// matching the requested N (imp-857-phased-forcing-sweep.js schedule).
//
// --list prints the full 6-invocation batch plan that packs the 14 missing
// cells into triple-runs (baseline eps=0 + two eps values per invocation),
// ready to be piped into GNU parallel / xargs by an offline worker. No
// --N/--eps required in this mode.
//
// --verify-plan asserts that the BATCH_PLAN below exactly covers the 14
// MISSING_CELLS in imp-896-retuning-calibration.js (every missing (N, eps)
// pair appears in at least one triple-run; no extraneous pairs). Exits 0 on
// success, prints a diff and exits 1 on mismatch. Run this before launching
// an offline worker — a silent BATCH_PLAN/MISSING_CELLS drift would waste the
// full ~20 CPU-hour budget on the wrong grid.
//
// --dry-run resolves the full IMP857_* env var set for the given --N/--eps
// cell (exactly as a real run would) and prints them as copy-pastable shell
// `export` statements, then exits 0 without spawning the prototype. Intended
// as a per-cell pre-flight check after --verify-plan: lets an offline worker
// sanity-check k0_star / phaseVel_star lookup and nSteps/dt defaults before
// consuming the ~3 CPU-hour wall-time of a real cell run.
//
// --dry-run-all iterates the full BATCH_PLAN and emits the resolved env-var
// exports for every cell in sequence, with a banner per cell. Intended as the
// single final pre-flight an offline worker runs after --verify-plan and
// before piping --list into GNU parallel: confirms that every one of the 6
// triple-run invocations resolves cleanly (retuning lookup, nSteps/dt default,
// epsTriple parse) in a single command, without the operator having to re-run
// --dry-run per cell. Exits non-zero if any single cell fails to resolve.
//
// On completion the prototype prints a three-row comparison table; copy the
// final-row maxIntervalWidth values into a new MEASURED_ROWS entry in
// src/data/imp-857-phased-forcing-sweep.js.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { IMP_896_RETUNING_CALIBRATION } from '../src/data/imp-896-retuning-calibration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');

function parseArgs(argv) {
  const out = {
    N: null,
    eps: null,
    nSteps: null,
    dt: null,
    list: false,
    verifyPlan: false,
    dryRun: false,
    dryRunAll: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--N') out.N = Number(argv[++i]);
    else if (a === '--eps') out.eps = argv[++i];
    else if (a === '--nSteps') out.nSteps = Number(argv[++i]);
    else if (a === '--dt') out.dt = Number(argv[++i]);
    else if (a === '--list') out.list = true;
    else if (a === '--verify-plan') out.verifyPlan = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--dry-run-all') out.dryRunAll = true;
    else if (a === '--help' || a === '-h') {
      console.log(
        'usage: node scripts/imp-917-run-cell.mjs --N <N> --eps <e0,e1,e2> [--nSteps <k>] [--dt <dt>] [--dry-run]\n' +
          '       node scripts/imp-917-run-cell.mjs --list\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-plan\n' +
          '       node scripts/imp-917-run-cell.mjs --dry-run-all',
      );
      process.exit(0);
    } else {
      console.error('unknown arg:', a);
      process.exit(2);
    }
  }
  return out;
}

// Batch plan: the 14 MISSING_CELLS from imp-896-retuning-calibration.js pack
// into 6 triple-runs, each re-measuring the eps=0 baseline for internal
// consistency with the ratio. Emitted by --list as shell one-liners so an
// offline worker can pipe the list into GNU parallel / xargs without manual
// transcription. Each line carries a trailing `# <label>` comment for grep.
const BATCH_PLAN = [
  { N: 1000,  eps: [0, 0.02, 0.1],  label: 'N1000-eps-0p02-0p1' },
  { N: 2000,  eps: [0, 0.02, 0.1],  label: 'N2000-eps-0p02-0p1' },
  { N: 5000,  eps: [0, 0.01, 0.02], label: 'N5000-eps-0p01-0p02' },
  { N: 5000,  eps: [0, 0.05, 0.1],  label: 'N5000-eps-0p05-0p1' },
  { N: 10000, eps: [0, 0.01, 0.02], label: 'N10000-eps-0p01-0p02' },
  { N: 10000, eps: [0, 0.05, 0.1],  label: 'N10000-eps-0p05-0p1' },
];

const args = parseArgs(process.argv);

if (args.list) {
  for (const p of BATCH_PLAN) {
    console.log(
      `node scripts/imp-917-run-cell.mjs --N ${p.N} --eps ${p.eps.join(',')}  # ${p.label}`,
    );
  }
  process.exit(0);
}

if (args.verifyPlan) {
  // Flatten BATCH_PLAN into covered (N, eps) pairs. Skip eps=0 baselines when
  // N is in {1000, 2000}: MISSING_CELLS only lists {0.02, 0.1} for those N
  // (imp-893 already measured the eps=0 baseline at those N), so the baseline
  // re-measurement in the triple-run is an internal-consistency probe, not a
  // missing-cell target. For N in {5000, 10000}, eps=0 IS a missing cell and
  // must be counted exactly once.
  const key = (N, eps) => `${N}|${eps}`;
  const missingSet = new Set(
    IMP_896_RETUNING_CALIBRATION.missingCells.map((c) => key(c.N, c.eps)),
  );
  const coveredSet = new Set();
  for (const p of BATCH_PLAN) {
    for (const e of p.eps) {
      const isSmallN = p.N === 1000 || p.N === 2000;
      if (isSmallN && e === 0) continue;
      coveredSet.add(key(p.N, e));
    }
  }
  const missingButUncovered = [...missingSet].filter((k) => !coveredSet.has(k));
  const coveredButNotMissing = [...coveredSet].filter((k) => !missingSet.has(k));
  const ok =
    missingButUncovered.length === 0 &&
    coveredButNotMissing.length === 0 &&
    coveredSet.size === missingSet.size;
  if (ok) {
    console.log(
      `imp-917 --verify-plan OK: BATCH_PLAN covers all ${missingSet.size} MISSING_CELLS exactly.`,
    );
    process.exit(0);
  }
  console.error('imp-917 --verify-plan FAILED:');
  if (missingButUncovered.length) {
    console.error(
      '  cells in MISSING_CELLS not covered by BATCH_PLAN:',
      missingButUncovered.join(', '),
    );
  }
  if (coveredButNotMissing.length) {
    console.error(
      '  cells covered by BATCH_PLAN not in MISSING_CELLS:',
      coveredButNotMissing.join(', '),
    );
  }
  console.error(
    `  (MISSING_CELLS size=${missingSet.size}, covered size=${coveredSet.size})`,
  );
  process.exit(1);
}

const prototypePath = resolve(
  REPO_ROOT,
  'src/math/imp-857-phase-locked-dyson.mjs',
);

// Resolve one (N, epsTriple) cell into the full IMP857_* env-var set, using
// the retuning table and MISSING_CELLS nSteps/dt defaults. Returns
// { nSteps, dt, retuning, env } on success, or { error } on any lookup /
// validation failure. Shared by the single-cell path and --dry-run-all.
function resolveCell(N, epsTriple, argsNSteps, argsDt) {
  if (!Number.isFinite(N)) return { error: '--N <integer> is required' };
  if (!Array.isArray(epsTriple) || epsTriple.length !== 3) {
    return { error: '--eps <e0,e1,e2> required (exactly 3 numbers)' };
  }
  if (epsTriple.some((e) => !Number.isFinite(e))) {
    return { error: '--eps values must all be finite numbers' };
  }
  const retuning = IMP_896_RETUNING_CALIBRATION.retuningTable.find(
    (r) => r.N === N,
  );
  if (!retuning) {
    return {
      error:
        `N=${N} not in RETUNING_CALIBRATION (supported: ` +
        IMP_896_RETUNING_CALIBRATION.retuningTable.map((r) => r.N).join(', ') +
        ')',
    };
  }
  const cellRow = IMP_896_RETUNING_CALIBRATION.missingCells.find(
    (c) => c.N === N,
  );
  const nSteps = argsNSteps ?? cellRow?.nSteps ?? null;
  const dt = argsDt ?? cellRow?.dt ?? null;
  if (!Number.isFinite(nSteps) || !Number.isFinite(dt)) {
    return {
      error: `no MISSING_CELLS default for N=${N}; pass --nSteps and --dt explicitly`,
    };
  }
  const env = {
    ...process.env,
    IMP857_N: String(N),
    IMP857_NSTEPS: String(nSteps),
    IMP857_DT: String(dt),
    IMP857_K0: String(retuning.k0_star),
    IMP857_PHASEVEL: String(retuning.phaseVel_star),
    IMP857_EPSILONS: epsTriple.join(','),
  };
  return { nSteps, dt, retuning, env };
}

const SHELL_KEYS = [
  'IMP857_N',
  'IMP857_NSTEPS',
  'IMP857_DT',
  'IMP857_K0',
  'IMP857_PHASEVEL',
  'IMP857_EPSILONS',
];

function printCellBanner(N, nSteps, dt, retuning, epsTriple) {
  console.log('imp-917 cell:');
  console.log(`  N         = ${N}`);
  console.log(`  nSteps    = ${nSteps}`);
  console.log(`  dt        = ${dt}`);
  console.log(`  k0_star   = ${retuning.k0_star}`);
  console.log(`  phaseVel* = ${retuning.phaseVel_star}`);
  console.log(`  epsilons  = ${epsTriple.join(', ')}`);
}

function printDryRunExports(env) {
  console.log('--dry-run: prototype NOT spawned. Copy-pastable shell exports:');
  for (const k of SHELL_KEYS) {
    console.log(`  export ${k}=${env[k]}`);
  }
  console.log(`  node ${prototypePath}`);
}

if (args.dryRunAll) {
  // Pre-flight: resolve every BATCH_PLAN cell and emit its env-var set. Intended
  // as a single final sanity-check after --verify-plan and before piping --list
  // into an offline worker. Any single-cell resolve failure aborts the whole
  // batch so the operator sees it before burning CPU hours.
  let failures = 0;
  for (let i = 0; i < BATCH_PLAN.length; i++) {
    const p = BATCH_PLAN[i];
    console.log(
      `=== BATCH_PLAN cell ${i + 1}/${BATCH_PLAN.length}: ${p.label} ===`,
    );
    const r = resolveCell(p.N, p.eps, null, null);
    if (r.error) {
      console.error(`  ERROR: ${r.error}`);
      failures++;
      continue;
    }
    printCellBanner(p.N, r.nSteps, r.dt, r.retuning, p.eps);
    printDryRunExports(r.env);
    console.log();
  }
  if (failures > 0) {
    console.error(
      `imp-917 --dry-run-all FAILED: ${failures} of ${BATCH_PLAN.length} cells did not resolve.`,
    );
    process.exit(1);
  }
  console.log(
    `imp-917 --dry-run-all OK: all ${BATCH_PLAN.length} BATCH_PLAN cells resolved cleanly.`,
  );
  process.exit(0);
}

if (!Number.isFinite(args.N)) {
  console.error('imp-917-run-cell: --N <integer> is required');
  process.exit(2);
}
if (!args.eps || args.eps.split(',').length !== 3) {
  console.error(
    'imp-917-run-cell: --eps <e0,e1,e2> is required (exactly 3 comma-separated numbers)',
  );
  process.exit(2);
}
const epsTriple = args.eps.split(',').map((s) => Number(s.trim()));

const resolved = resolveCell(args.N, epsTriple, args.nSteps, args.dt);
if (resolved.error) {
  console.error(`imp-917-run-cell: ${resolved.error}`);
  process.exit(2);
}
const { nSteps, dt, retuning, env } = resolved;

printCellBanner(args.N, nSteps, dt, retuning, epsTriple);

if (args.dryRun) {
  printDryRunExports(env);
  process.exit(0);
}

console.log('spawning prototype:', prototypePath);
console.log('---');

const startedAt = Date.now();
const res = spawnSync('node', [prototypePath], {
  env,
  stdio: 'inherit',
  cwd: REPO_ROOT,
});
const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

console.log('---');
console.log(`imp-917 cell finished in ${elapsedSec} s (status=${res.status})`);
if (res.status !== 0) process.exit(res.status ?? 1);
