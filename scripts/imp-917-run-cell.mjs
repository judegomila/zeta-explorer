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
//   node scripts/imp-917-run-cell.mjs --plan-json
//   node scripts/imp-917-run-cell.mjs --verify-plan
//   node scripts/imp-917-run-cell.mjs --verify-plan-json
//   node scripts/imp-917-run-cell.mjs --verify-prototype
//   node scripts/imp-917-run-cell.mjs --verify-prototype-json
//   node scripts/imp-917-run-cell.mjs --dry-run-all
//   node scripts/imp-917-run-cell.mjs --dry-run-all-json
//   node scripts/imp-917-run-cell.mjs --cell 3 [--dry-run]
//   node scripts/imp-917-run-cell.mjs --cell 3 --dry-run-json
//   node scripts/imp-917-run-cell.mjs --N 1000 --eps 0,0.02,0.1 --dry-run-json
//   node scripts/imp-917-run-cell.mjs --preflight
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
// --plan-json emits the BATCH_PLAN as a JSON array (one object per cell,
// fields: index, N, eps, label) so Python / jq-based offline-worker drivers
// can consume the plan without re-parsing the --list shell one-liners.
// Pairs naturally with --verify-plan (assert coverage) -> --plan-json (feed
// into a custom runner) when GNU parallel is not the preferred launcher.
//
// --verify-plan asserts that the BATCH_PLAN below exactly covers the 14
// MISSING_CELLS in imp-896-retuning-calibration.js (every missing (N, eps)
// pair appears in at least one triple-run; no extraneous pairs). Exits 0 on
// success, prints a diff and exits 1 on mismatch. Run this before launching
// an offline worker — a silent BATCH_PLAN/MISSING_CELLS drift would waste the
// full ~20 CPU-hour budget on the wrong grid.
//
// --verify-plan-json is the structural JSON analog of --verify-plan. Emits a
// single JSON object with {ok, missingCount, coveredCount, missingButUncovered,
// coveredButNotMissing} where the two arrays list the "N|eps" keys on each
// side of the coverage diff. Exit status matches --verify-plan (0 on ok, 1 on
// mismatch) so Python / jq offline-worker drivers can gate on the JSON body
// AND the exit status without re-parsing the shell-style console output.
//
// --verify-prototype asserts that the phased-forcing prototype script itself
// (src/math/imp-857-phase-locked-dyson.mjs — the target of spawnSync below)
// exists and is a regular file. Orthogonal to --verify-plan / --verify-plan-json
// (which check BATCH_PLAN vs MISSING_CELLS coverage) and to --dry-run-all
// (which only checks retuning-table lookup + env-var wiring, not the prototype
// binary): guards against the silent failure where the prototype gets moved,
// renamed, or deleted between infrastructure work and the ~20 CPU-hour offline
// run, which would otherwise only surface when node cannot resolve the entry
// point at cell spawn time. Exits 0 on success, 1 with an error message on
// missing / non-regular-file.
//
// --verify-prototype-json is the structural JSON analog of --verify-prototype.
// Emits one object {ok, path, sizeBytes, error} where path is always populated,
// sizeBytes is the regular-file size on success and null on failure, and error
// is null on success or a human-readable string on failure (stat error message,
// or "not a regular file"). Exit status matches --verify-prototype (0 on ok,
// 1 on failure) so Python / jq offline-worker drivers can gate the ~20 CPU-hour
// run on the JSON body AND the process exit code, completing the {shell, JSON}
// output matrix for all four pre-flight checks: --verify-plan / --verify-plan-json,
// --verify-prototype / --verify-prototype-json.
//
// --preflight runs the three existing shell pre-flight checks in sequence —
// --verify-plan (BATCH_PLAN vs MISSING_CELLS coverage), --verify-prototype
// (prototype script exists), --dry-run-all (every BATCH_PLAN cell resolves its
// IMP857_* env-var pack) — and aggregates the results. Prints a per-step banner
// and a final PASS / FAILED summary. Exits 0 only if all three pass; otherwise
// exits with the step number (1, 2, or 3) of the first failing step, so an
// offline-worker driver can gate the ~20 CPU-hour batch on a single command
// rather than orchestrating three separate invocations and three exit codes.
//
// --dry-run resolves the full IMP857_* env var set for the given --N/--eps
// cell (exactly as a real run would) and prints them as copy-pastable shell
// `export` statements, then exits 0 without spawning the prototype. Intended
// as a per-cell pre-flight check after --verify-plan: lets an offline worker
// sanity-check k0_star / phaseVel_star lookup and nSteps/dt defaults before
// consuming the ~3 CPU-hour wall-time of a real cell run.
//
// --dry-run-json is the structural JSON analog of --dry-run. Resolves the
// single (N, epsTriple) cell (from --N/--eps or --cell) and emits ONE object
// with {index, label, N, eps, nSteps, dt, k0_star, phaseVel_star, env} —
// the same per-cell shape that --dry-run-all-json emits for every row, but
// for a single cell. Fills the {shell, JSON} x {single, all} output matrix:
// --dry-run (single, shell), --dry-run-json (single, JSON), --dry-run-all
// (all, shell), --dry-run-all-json (all, JSON). When invoked via --cell,
// index and label are populated; in --N/--eps mode they are null since the
// pair may or may not map to a BATCH_PLAN row. Exits 0 on success, non-zero
// with {error: ...} body on any resolve failure, matching --dry-run.
//
// --dry-run-all iterates the full BATCH_PLAN and emits the resolved env-var
// exports for every cell in sequence, with a banner per cell. Intended as the
// single final pre-flight an offline worker runs after --verify-plan and
// before piping --list into GNU parallel: confirms that every one of the 6
// triple-run invocations resolves cleanly (retuning lookup, nSteps/dt default,
// epsTriple parse) in a single command, without the operator having to re-run
// --dry-run per cell. Exits non-zero if any single cell fails to resolve.
//
// --dry-run-all-json is the structural JSON analog of --dry-run-all. It emits
// the full BATCH_PLAN as a JSON array, one object per cell, each with the
// fully-resolved env-var pack (IMP857_N/NSTEPS/DT/K0/PHASEVEL/EPSILONS) plus
// the retuning inputs (k0_star, phaseVel_star, nSteps, dt). Python / jq-based
// offline-worker drivers can consume the array directly — no need to re-parse
// shell-export text or re-implement the (N -> retuning) lookup out-of-band.
// Pairs with --plan-json (index-only) and --dry-run-all (shell exports) to
// complete the {shell, JSON-index, JSON-resolved} output matrix. Exits
// non-zero if any single cell fails to resolve, matching --dry-run-all.
//
// --cell <index> picks BATCH_PLAN[index-1] (1-indexed, matching the cell
// numbers printed by --list) and invokes the single-cell path with that
// cell N/eps. Exclusive with --N/--eps. Composes with --dry-run so an
// offline worker can pre-flight a specific cell before spawning. Intended
// to eliminate the transcription-error surface between the --list output
// and manual --N/--eps invocation: the verified BATCH_PLAN is the single
// source of truth for which (N, eps) triple each index resolves to.
//
// On completion the prototype prints a three-row comparison table; copy the
// final-row maxIntervalWidth values into a new MEASURED_ROWS entry in
// src/data/imp-857-phased-forcing-sweep.js.

import { spawnSync } from 'node:child_process';
import { statSync } from 'node:fs';
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
    planJson: false,
    verifyPlan: false,
    verifyPlanJson: false,
    verifyPrototype: false,
    verifyPrototypeJson: false,
    dryRun: false,
    dryRunJson: false,
    dryRunAll: false,
    dryRunAllJson: false,
    preflight: false,
    cell: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--N') out.N = Number(argv[++i]);
    else if (a === '--eps') out.eps = argv[++i];
    else if (a === '--nSteps') out.nSteps = Number(argv[++i]);
    else if (a === '--dt') out.dt = Number(argv[++i]);
    else if (a === '--list') out.list = true;
    else if (a === '--plan-json') out.planJson = true;
    else if (a === '--verify-plan') out.verifyPlan = true;
    else if (a === '--verify-plan-json') out.verifyPlanJson = true;
    else if (a === '--verify-prototype') out.verifyPrototype = true;
    else if (a === '--verify-prototype-json') out.verifyPrototypeJson = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--dry-run-json') out.dryRunJson = true;
    else if (a === '--dry-run-all') out.dryRunAll = true;
    else if (a === '--dry-run-all-json') out.dryRunAllJson = true;
    else if (a === '--preflight') out.preflight = true;
    else if (a === '--cell') out.cell = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log(
        'usage: node scripts/imp-917-run-cell.mjs --N <N> --eps <e0,e1,e2> [--nSteps <k>] [--dt <dt>] [--dry-run]\n' +
          '       node scripts/imp-917-run-cell.mjs --list\n' +
          '       node scripts/imp-917-run-cell.mjs --plan-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-plan\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-plan-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-prototype\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-prototype-json\n' +
          '       node scripts/imp-917-run-cell.mjs --dry-run-all\n' +
          '       node scripts/imp-917-run-cell.mjs --dry-run-all-json\n' +
          '       node scripts/imp-917-run-cell.mjs --cell <index> [--dry-run|--dry-run-json]\n' +
          '       node scripts/imp-917-run-cell.mjs --N <N> --eps <e0,e1,e2> --dry-run-json\n' +
          '       node scripts/imp-917-run-cell.mjs --preflight',
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

if (args.planJson) {
  const rows = BATCH_PLAN.map((p, i) => ({
    index: i + 1,
    N: p.N,
    eps: p.eps,
    label: p.label,
  }));
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

// Flatten BATCH_PLAN into covered (N, eps) pairs and diff against MISSING_CELLS.
// Skip eps=0 baselines when N is in {1000, 2000}: MISSING_CELLS only lists
// {0.02, 0.1} for those N (imp-893 already measured the eps=0 baseline at
// those N), so the baseline re-measurement in the triple-run is an
// internal-consistency probe, not a missing-cell target. For N in {5000,
// 10000}, eps=0 IS a missing cell and must be counted exactly once. Shared by
// --verify-plan (shell output) and --verify-plan-json (JSON output).
function computePlanCoverage() {
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
  return {
    ok,
    missingCount: missingSet.size,
    coveredCount: coveredSet.size,
    missingButUncovered,
    coveredButNotMissing,
  };
}

if (args.verifyPlan) {
  const r = computePlanCoverage();
  if (r.ok) {
    console.log(
      `imp-917 --verify-plan OK: BATCH_PLAN covers all ${r.missingCount} MISSING_CELLS exactly.`,
    );
    process.exit(0);
  }
  console.error('imp-917 --verify-plan FAILED:');
  if (r.missingButUncovered.length) {
    console.error(
      '  cells in MISSING_CELLS not covered by BATCH_PLAN:',
      r.missingButUncovered.join(', '),
    );
  }
  if (r.coveredButNotMissing.length) {
    console.error(
      '  cells covered by BATCH_PLAN not in MISSING_CELLS:',
      r.coveredButNotMissing.join(', '),
    );
  }
  console.error(
    `  (MISSING_CELLS size=${r.missingCount}, covered size=${r.coveredCount})`,
  );
  process.exit(1);
}

if (args.verifyPlanJson) {
  const r = computePlanCoverage();
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}

const prototypePath = resolve(
  REPO_ROOT,
  'src/math/imp-857-phase-locked-dyson.mjs',
);

// Shared by --verify-prototype (shell) and --verify-prototype-json (JSON) so
// the two diagnostics cannot drift: both check the same path, both classify
// "not a regular file" the same way, both report the same size.
function checkPrototype() {
  try {
    const s = statSync(prototypePath);
    if (!s.isFile()) {
      return {
        ok: false,
        path: prototypePath,
        sizeBytes: null,
        error: 'not a regular file',
      };
    }
    return { ok: true, path: prototypePath, sizeBytes: s.size, error: null };
  } catch (err) {
    return {
      ok: false,
      path: prototypePath,
      sizeBytes: null,
      error: `cannot stat: ${err.message}`,
    };
  }
}

if (args.verifyPrototype) {
  const r = checkPrototype();
  if (r.ok) {
    console.log(
      `imp-917 --verify-prototype OK: prototype script present (${r.path}, ${r.sizeBytes} bytes).`,
    );
    process.exit(0);
  }
  console.error(`imp-917 --verify-prototype FAILED: ${r.path}: ${r.error}`);
  process.exit(1);
}

if (args.verifyPrototypeJson) {
  const r = checkPrototype();
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}

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

if (args.dryRunAllJson) {
  // Structural JSON analog of --dry-run-all: one object per BATCH_PLAN cell,
  // each carrying both the retuning inputs and the fully-resolved IMP857_*
  // env-var pack. Python / jq runners can consume this directly without
  // re-implementing the (N -> retuning) lookup or re-parsing shell exports.
  const rows = [];
  let failures = 0;
  for (let i = 0; i < BATCH_PLAN.length; i++) {
    const p = BATCH_PLAN[i];
    const r = resolveCell(p.N, p.eps, null, null);
    if (r.error) {
      rows.push({
        index: i + 1,
        label: p.label,
        N: p.N,
        eps: p.eps,
        error: r.error,
      });
      failures++;
      continue;
    }
    const envSubset = {};
    for (const k of SHELL_KEYS) envSubset[k] = r.env[k];
    rows.push({
      index: i + 1,
      label: p.label,
      N: p.N,
      eps: p.eps,
      nSteps: r.nSteps,
      dt: r.dt,
      k0_star: r.retuning.k0_star,
      phaseVel_star: r.retuning.phaseVel_star,
      env: envSubset,
    });
  }
  console.log(JSON.stringify(rows, null, 2));
  if (failures > 0) process.exit(1);
  process.exit(0);
}

if (args.preflight) {
  // Sequenced shell pre-flight: verify-plan -> verify-prototype -> dry-run-all.
  // Each step mirrors the corresponding standalone flag so operator output is
  // familiar. On failure, exits with the 1-indexed step number so the driver
  // can tell which step tripped without parsing stdout.
  console.log('=== imp-917 --preflight step 1/3: --verify-plan ===');
  const planResult = computePlanCoverage();
  if (!planResult.ok) {
    console.error('imp-917 --preflight FAILED at step 1 (--verify-plan):');
    if (planResult.missingButUncovered.length) {
      console.error(
        '  cells in MISSING_CELLS not covered by BATCH_PLAN:',
        planResult.missingButUncovered.join(', '),
      );
    }
    if (planResult.coveredButNotMissing.length) {
      console.error(
        '  cells covered by BATCH_PLAN not in MISSING_CELLS:',
        planResult.coveredButNotMissing.join(', '),
      );
    }
    process.exit(1);
  }
  console.log(
    `  OK: BATCH_PLAN covers all ${planResult.missingCount} MISSING_CELLS exactly.`,
  );

  console.log('=== imp-917 --preflight step 2/3: --verify-prototype ===');
  const protoResult = checkPrototype();
  if (!protoResult.ok) {
    console.error(
      `imp-917 --preflight FAILED at step 2 (--verify-prototype): ${protoResult.path}: ${protoResult.error}`,
    );
    process.exit(2);
  }
  console.log(
    `  OK: prototype script present (${protoResult.path}, ${protoResult.sizeBytes} bytes).`,
  );

  console.log('=== imp-917 --preflight step 3/3: --dry-run-all ===');
  let resolveFailures = 0;
  for (let i = 0; i < BATCH_PLAN.length; i++) {
    const p = BATCH_PLAN[i];
    const r = resolveCell(p.N, p.eps, null, null);
    if (r.error) {
      console.error(`  cell ${i + 1}/${BATCH_PLAN.length} (${p.label}): ERROR: ${r.error}`);
      resolveFailures++;
      continue;
    }
    console.log(`  cell ${i + 1}/${BATCH_PLAN.length} (${p.label}): OK`);
  }
  if (resolveFailures > 0) {
    console.error(
      `imp-917 --preflight FAILED at step 3 (--dry-run-all): ${resolveFailures} of ${BATCH_PLAN.length} cells did not resolve.`,
    );
    process.exit(3);
  }
  console.log(
    `  OK: all ${BATCH_PLAN.length} BATCH_PLAN cells resolved cleanly.`,
  );

  console.log('imp-917 --preflight PASS: all 3 steps OK, offline batch ready to launch.');
  process.exit(0);
}

let cellIndex = null;
let cellLabel = null;
if (Number.isFinite(args.cell)) {
  if (Number.isFinite(args.N) || args.eps !== null) {
    console.error(
      'imp-917-run-cell: --cell is exclusive with --N/--eps (BATCH_PLAN is the single source of truth)',
    );
    process.exit(2);
  }
  const idx = args.cell;
  if (!Number.isInteger(idx) || idx < 1 || idx > BATCH_PLAN.length) {
    console.error(
      `imp-917-run-cell: --cell must be an integer in [1, ${BATCH_PLAN.length}], got ${args.cell}`,
    );
    process.exit(2);
  }
  const p = BATCH_PLAN[idx - 1];
  args.N = p.N;
  args.eps = p.eps.join(',');
  cellIndex = idx;
  cellLabel = p.label;
  if (!args.dryRunJson) {
    console.log(`imp-917 --cell ${idx}: ${p.label} (N=${p.N}, eps=${args.eps})`);
  }
}

if (!Number.isFinite(args.N)) {
  if (args.dryRunJson) {
    console.log(JSON.stringify({ error: '--N <integer> is required' }, null, 2));
    process.exit(2);
  }
  console.error('imp-917-run-cell: --N <integer> is required');
  process.exit(2);
}
if (!args.eps || args.eps.split(',').length !== 3) {
  const msg = '--eps <e0,e1,e2> is required (exactly 3 comma-separated numbers)';
  if (args.dryRunJson) {
    console.log(JSON.stringify({ error: msg }, null, 2));
    process.exit(2);
  }
  console.error(`imp-917-run-cell: ${msg}`);
  process.exit(2);
}
const epsTriple = args.eps.split(',').map((s) => Number(s.trim()));

const resolved = resolveCell(args.N, epsTriple, args.nSteps, args.dt);
if (resolved.error) {
  if (args.dryRunJson) {
    console.log(
      JSON.stringify(
        { index: cellIndex, label: cellLabel, N: args.N, eps: epsTriple, error: resolved.error },
        null,
        2,
      ),
    );
    process.exit(2);
  }
  console.error(`imp-917-run-cell: ${resolved.error}`);
  process.exit(2);
}
const { nSteps, dt, retuning, env } = resolved;

if (args.dryRunJson) {
  const envSubset = {};
  for (const k of SHELL_KEYS) envSubset[k] = env[k];
  const row = {
    index: cellIndex,
    label: cellLabel,
    N: args.N,
    eps: epsTriple,
    nSteps,
    dt,
    k0_star: retuning.k0_star,
    phaseVel_star: retuning.phaseVel_star,
    env: envSubset,
  };
  console.log(JSON.stringify(row, null, 2));
  process.exit(0);
}

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
