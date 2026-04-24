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
//   node scripts/imp-917-run-cell.mjs --plan-table
//   node scripts/imp-917-run-cell.mjs --plan-json
//   node scripts/imp-917-run-cell.mjs --missing-cells
//   node scripts/imp-917-run-cell.mjs --missing-cells-json
//   node scripts/imp-917-run-cell.mjs --retuning-table
//   node scripts/imp-917-run-cell.mjs --retuning-table-json
//   node scripts/imp-917-run-cell.mjs --verify-plan
//   node scripts/imp-917-run-cell.mjs --verify-plan-json
//   node scripts/imp-917-run-cell.mjs --verify-prototype
//   node scripts/imp-917-run-cell.mjs --verify-prototype-json
//   node scripts/imp-917-run-cell.mjs --verify-output-target
//   node scripts/imp-917-run-cell.mjs --verify-output-target-json
//   node scripts/imp-917-run-cell.mjs --verify-output-schema
//   node scripts/imp-917-run-cell.mjs --verify-output-schema-json
//   node scripts/imp-917-run-cell.mjs --dry-run-all
//   node scripts/imp-917-run-cell.mjs --dry-run-all-json
//   node scripts/imp-917-run-cell.mjs --cell 3 [--dry-run]
//   node scripts/imp-917-run-cell.mjs --cell 3 --dry-run-json
//   node scripts/imp-917-run-cell.mjs --N 1000 --eps 0,0.02,0.1 --dry-run-json
//   node scripts/imp-917-run-cell.mjs --preflight
//   node scripts/imp-917-run-cell.mjs --preflight-json
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
// --plan-table prints BATCH_PLAN as a human-readable ASCII table (columns:
// idx, N, eps, label), matching the --missing-cells and --retuning-table
// cadence. Shell table analog of --plan-json: both read the same BATCH_PLAN
// constant so the two diagnostics cannot drift. Orthogonal to --list (which
// emits shell one-liners for GNU parallel piping, not a padded ASCII table):
// --plan-table exposes the 6-row triple-run packing in the column-aligned
// format an operator would eyeball before launching the ~20 CPU-hour batch.
// Pure data emitter, exits 0 unconditionally (not a check). Completes the
// BATCH_PLAN shell output pair with --list (piping form) + --plan-table
// (table form) and mirrors the {shell-table, JSON} pair established by
// --missing-cells / --missing-cells-json and
// --retuning-table / --retuning-table-json.
//
// --plan-json emits the BATCH_PLAN as a JSON array (one object per cell,
// fields: index, N, eps, label) so Python / jq-based offline-worker drivers
// can consume the plan without re-parsing the --list shell one-liners.
// Pairs naturally with --verify-plan (assert coverage) -> --plan-json (feed
// into a custom runner) when GNU parallel is not the preferred launcher.
//
// --missing-cells prints the ground-truth MISSING_CELLS list as a
// human-readable ASCII table (columns: idx, N, eps, dt, nSteps,
// wallSecEst), and a final summary line with row count and total
// wall-seconds. Shell analog of --missing-cells-json: both read from
// IMP_896_RETUNING_CALIBRATION.missingCells so the two diagnostics cannot
// drift. Useful for operators who want to eyeball the 14 target cells
// before launching an offline batch without piping JSON through jq.
//
// --missing-cells-json emits the ground-truth MISSING_CELLS list from
// src/data/imp-896-retuning-calibration.js verbatim as a JSON array, one
// object per target cell (fields: N, eps, dt, nSteps, wallSecondsEstPerTripleRun).
// Orthogonal to --plan-json (which emits BATCH_PLAN, the triple-run packing
// of MISSING_CELLS): gives offline-worker drivers direct structural access to
// the 14 (N, eps) pairs the batch is meant to cover, without requiring them
// to re-derive the set from BATCH_PLAN via the same coverage logic that
// --verify-plan / --verify-plan-json already encode. Useful for post-batch
// transcription validators that need to enumerate the target cells
// independent of the packing. Pairs with --plan-json (packing structure),
// --verify-plan-json (coverage diff), and --missing-cells (shell analog)
// to form the MISSING_CELLS source-of-truth quartet: plan shape, target
// shape (shell + JSON), coverage check.
//
// --retuning-table prints IMP_896_RETUNING_CALIBRATION.retuningTable as a
// human-readable ASCII table (columns: N, k0_star, phaseVel_star, omega_star),
// the per-N retuning-calibration lookup that resolveCell() consults to pack
// IMP857_K0 / IMP857_PHASEVEL. Orthogonal to --missing-cells (the 14 target
// (N, eps) pairs the batch is meant to cover) and to --plan-json / --list
// (the 6 triple-run invocations): exposes the (N -> k0_star / phaseVel_star)
// lookup directly so offline-worker operators can eyeball the retuning
// inputs without opening src/data/imp-896-retuning-calibration.js or running
// --dry-run per cell to reconstruct the table row by row. Pure data emitter,
// exits 0 unconditionally (not a check). Pairs with --retuning-table-json for
// the shell/JSON symmetry established by the other data emitters.
//
// --retuning-table-json is the structural JSON analog of --retuning-table.
// Emits IMP_896_RETUNING_CALIBRATION.retuningTable verbatim via
// JSON.stringify(..., null, 2) so Python / jq offline-worker drivers can
// consume the per-N (k0_star, phaseVel_star, omega_star) lookup directly
// without re-parsing the shell table or reading
// src/data/imp-896-retuning-calibration.js out-of-band. Completes the
// {shell, JSON} pair for the retuning-table data emitter, matching the
// --missing-cells / --missing-cells-json and --plan-json / --list pairings.
// Pure data emitter, exits 0 unconditionally (not a check). Not wired into
// --preflight / --preflight-json (pure data emitter, not a pre-flight gate).
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
// --verify-output-target asserts that the transcription target — the JS file
// src/data/imp-857-phased-forcing-sweep.js where the 14 measured rows must be
// appended to MEASURED_ROWS after the batch completes — exists and is a regular
// file. Orthogonal to --verify-prototype (which checks the input side: the
// prototype binary invoked by spawnSync): catches the silent failure where the
// output file has been moved, renamed, or deleted between infrastructure work
// and the ~20 CPU-hour offline run, which would otherwise only surface when
// the operator tries to transcribe rows back and finds no MEASURED_ROWS block
// to edit. Exits 0 on success, 1 with a diagnostic on missing / non-regular-file.
//
// --verify-output-schema asserts that the transcription target file still
// declares the MEASURED_ROWS array — the exact identifier where the 14 measured
// rows must be appended after the batch completes. Orthogonal to
// --verify-output-target (which only stat()s the file): catches the silent
// failure where the file exists but the transcription target identifier has
// been renamed, deleted, or restructured between infrastructure work and the
// ~20 CPU-hour offline run, which would otherwise only surface when the
// operator tries to append measured rows and cannot find the MEASURED_ROWS
// block. Reads the file via readFileSync and checks for the literal substring
// `const MEASURED_ROWS = [`. Exits 0 on success, 1 with a specific diagnostic
// on read error or missing identifier. Paired with --verify-output-schema-json
// for the {shell, JSON} matrix. Wired into --preflight as the appended step 5
// (shell form; --preflight-json JSON-analog wiring is a separate future partial).
//
// --verify-output-schema-json is the structural JSON analog of
// --verify-output-schema. Emits one object {ok, path, token, error} where path
// is always populated, token is the literal substring sought
// (`const MEASURED_ROWS = [`), and error is null on success or a
// human-readable string on failure (read error message, or
// ``identifier `const MEASURED_ROWS = [` not found``). Exit status matches
// --verify-output-schema (0 on ok, 1 on failure) so Python / jq offline-worker
// drivers can gate the ~20 CPU-hour batch on the JSON body AND the process
// exit code. Reuses the checkOutputSchema() helper with --verify-output-schema
// so the two diagnostics cannot drift. Completes the content-level
// {shell, JSON} pair for the transcription target, matching the stat-level
// --verify-output-target / --verify-output-target-json pair. Not wired into
// --preflight / --preflight-json yet (aggregation extension is a separate
// future partial).
//
// --verify-output-target-json is the structural JSON analog of
// --verify-output-target. Emits one object {ok, path, sizeBytes, error} where
// path is always populated, sizeBytes is the regular-file size on success and
// null on failure, and error is null on success or a human-readable string on
// failure (stat error message, or "not a regular file"). Exit status matches
// --verify-output-target (0 on ok, 1 on failure) so Python / jq offline-worker
// drivers can gate the ~20 CPU-hour run on the JSON body AND the process exit
// code, completing the {shell, JSON} output matrix for all five pre-flight
// checks: --verify-plan / --verify-plan-json, --verify-prototype /
// --verify-prototype-json, --verify-output-target / --verify-output-target-json.
// Reuses the checkOutputTarget() helper with --verify-output-target so the two
// diagnostics cannot drift. Wired into --preflight-json as the appended step 4
// (matching --preflight's step 4) so the aggregated shell and JSON pre-flights
// both end with the same output-target stat check.
//
// --preflight runs five shell pre-flight checks in sequence — --verify-plan
// (BATCH_PLAN vs MISSING_CELLS coverage), --verify-prototype (prototype script
// exists), --dry-run-all (every BATCH_PLAN cell resolves its IMP857_* env-var
// pack), --verify-output-target (transcription target exists), and
// --verify-output-schema (transcription target still declares MEASURED_ROWS) —
// and aggregates the results. Prints a per-step banner and a final PASS /
// FAILED summary. Exits 0 only if all five pass; otherwise exits with the step
// number (1, 2, 3, 4, or 5) of the first failing step, so an offline-worker
// driver can gate the ~20 CPU-hour batch on a single command rather than
// orchestrating five separate invocations and five exit codes.
//
// --preflight-json is the structural JSON analog of --preflight. Emits one
// object {ok, firstFailingStep, steps: [{step, name, ok, ...}]} aggregating
// the four checks. Each step object carries the same body that the single-flag
// JSON analog would emit (plan coverage diff, prototype stat, per-cell resolve
// summary, output-target stat). Exit status matches --preflight (0 on all-ok;
// 1, 2, 3, or 4 on first failing step) so Python / jq offline-worker drivers
// can gate the batch on a single JSON body and a single exit code, completing
// the {shell, JSON} pair for every pre-flight check: --verify-plan /
// --verify-plan-json, --verify-prototype / --verify-prototype-json,
// --dry-run-all / --dry-run-all-json, --verify-output-target /
// --verify-output-target-json, and --preflight / --preflight-json.
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
import { readFileSync, statSync } from 'node:fs';
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
    planTable: false,
    planJson: false,
    missingCells: false,
    missingCellsJson: false,
    retuningTable: false,
    retuningTableJson: false,
    verifyPlan: false,
    verifyPlanJson: false,
    verifyPrototype: false,
    verifyPrototypeJson: false,
    verifyOutputTarget: false,
    verifyOutputTargetJson: false,
    verifyOutputSchema: false,
    verifyOutputSchemaJson: false,
    dryRun: false,
    dryRunJson: false,
    dryRunAll: false,
    dryRunAllJson: false,
    preflight: false,
    preflightJson: false,
    cell: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--N') out.N = Number(argv[++i]);
    else if (a === '--eps') out.eps = argv[++i];
    else if (a === '--nSteps') out.nSteps = Number(argv[++i]);
    else if (a === '--dt') out.dt = Number(argv[++i]);
    else if (a === '--list') out.list = true;
    else if (a === '--plan-table') out.planTable = true;
    else if (a === '--plan-json') out.planJson = true;
    else if (a === '--missing-cells') out.missingCells = true;
    else if (a === '--missing-cells-json') out.missingCellsJson = true;
    else if (a === '--retuning-table') out.retuningTable = true;
    else if (a === '--retuning-table-json') out.retuningTableJson = true;
    else if (a === '--verify-plan') out.verifyPlan = true;
    else if (a === '--verify-plan-json') out.verifyPlanJson = true;
    else if (a === '--verify-prototype') out.verifyPrototype = true;
    else if (a === '--verify-prototype-json') out.verifyPrototypeJson = true;
    else if (a === '--verify-output-target') out.verifyOutputTarget = true;
    else if (a === '--verify-output-target-json') out.verifyOutputTargetJson = true;
    else if (a === '--verify-output-schema') out.verifyOutputSchema = true;
    else if (a === '--verify-output-schema-json') out.verifyOutputSchemaJson = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--dry-run-json') out.dryRunJson = true;
    else if (a === '--dry-run-all') out.dryRunAll = true;
    else if (a === '--dry-run-all-json') out.dryRunAllJson = true;
    else if (a === '--preflight') out.preflight = true;
    else if (a === '--preflight-json') out.preflightJson = true;
    else if (a === '--cell') out.cell = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log(
        'usage: node scripts/imp-917-run-cell.mjs --N <N> --eps <e0,e1,e2> [--nSteps <k>] [--dt <dt>] [--dry-run]\n' +
          '       node scripts/imp-917-run-cell.mjs --list\n' +
          '       node scripts/imp-917-run-cell.mjs --plan-table\n' +
          '       node scripts/imp-917-run-cell.mjs --plan-json\n' +
          '       node scripts/imp-917-run-cell.mjs --missing-cells\n' +
          '       node scripts/imp-917-run-cell.mjs --missing-cells-json\n' +
          '       node scripts/imp-917-run-cell.mjs --retuning-table\n' +
          '       node scripts/imp-917-run-cell.mjs --retuning-table-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-plan\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-plan-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-prototype\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-prototype-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-target\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-target-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-schema\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-schema-json\n' +
          '       node scripts/imp-917-run-cell.mjs --dry-run-all\n' +
          '       node scripts/imp-917-run-cell.mjs --dry-run-all-json\n' +
          '       node scripts/imp-917-run-cell.mjs --cell <index> [--dry-run|--dry-run-json]\n' +
          '       node scripts/imp-917-run-cell.mjs --N <N> --eps <e0,e1,e2> --dry-run-json\n' +
          '       node scripts/imp-917-run-cell.mjs --preflight\n' +
          '       node scripts/imp-917-run-cell.mjs --preflight-json',
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

if (args.planTable) {
  // Shell table analog of --plan-json: render BATCH_PLAN as a column-aligned
  // ASCII table. Reads the same BATCH_PLAN constant the JSON form reads so the
  // two diagnostics cannot drift. Pure data emitter (no check, exit 0).
  const header = ['idx', 'N', 'eps', 'label'];
  const body = BATCH_PLAN.map((p, i) => [
    String(i + 1),
    String(p.N),
    p.eps.join(','),
    p.label,
  ]);
  const widths = header.map((h, col) =>
    Math.max(h.length, ...body.map((row) => row[col].length)),
  );
  const pad = (s, w) => s + ' '.repeat(w - s.length);
  const fmt = (row) => row.map((v, col) => pad(v, widths[col])).join('  ');
  const sep = widths.map((w) => '-'.repeat(w)).join('  ');
  console.log(`imp-917 BATCH_PLAN (${BATCH_PLAN.length} triple-runs):`);
  console.log(`  ${fmt(header)}`);
  console.log(`  ${sep}`);
  for (const r of body) console.log(`  ${fmt(r)}`);
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

if (args.missingCells) {
  // Shell analog of --missing-cells-json: human-readable ASCII table of the
  // 14 ground-truth MISSING_CELLS rows. Reads from the same source
  // (IMP_896_RETUNING_CALIBRATION.missingCells) so shell and JSON cannot drift.
  const rows = IMP_896_RETUNING_CALIBRATION.missingCells;
  const header = ['idx', 'N', 'eps', 'dt', 'nSteps', 'wallSecEst'];
  const body = rows.map((c, i) => [
    String(i + 1),
    String(c.N),
    String(c.eps),
    String(c.dt),
    String(c.nSteps),
    String(c.wallSecondsEstPerTripleRun),
  ]);
  const widths = header.map((h, col) =>
    Math.max(h.length, ...body.map((r) => r[col].length)),
  );
  const pad = (s, w) => s + ' '.repeat(w - s.length);
  const fmt = (r) => r.map((v, col) => pad(v, widths[col])).join('  ');
  const sep = widths.map((w) => '-'.repeat(w)).join('  ');
  console.log(`imp-917 MISSING_CELLS (${rows.length} rows):`);
  console.log(`  ${fmt(header)}`);
  console.log(`  ${sep}`);
  for (const r of body) console.log(`  ${fmt(r)}`);
  const totalWallSec = IMP_896_RETUNING_CALIBRATION.totalWallSecondsEstimate;
  console.log(
    `  total: ${rows.length} rows, totalWallSecondsEstimate ~= ${totalWallSec.toFixed(
      0,
    )} s (~${(totalWallSec / 3600).toFixed(1)} CPU-hours).`,
  );
  process.exit(0);
}

if (args.missingCellsJson) {
  console.log(
    JSON.stringify(IMP_896_RETUNING_CALIBRATION.missingCells, null, 2),
  );
  process.exit(0);
}

if (args.retuningTable) {
  // Shell emitter for the per-N retuning-calibration lookup. Prints one row
  // per retuningTable entry with (k0_star, phaseVel_star, omega_star) formatted
  // to fixed precision for operator readability. Pure data emitter matching
  // the --missing-cells cadence (no check, exit 0).
  const rows = IMP_896_RETUNING_CALIBRATION.retuningTable;
  const header = ['N', 'k0_star', 'phaseVel_star', 'omega_star'];
  const body = rows.map((r) => [
    String(r.N),
    r.k0_star.toFixed(6),
    r.phaseVel_star.toFixed(6),
    r.omega_star.toFixed(6),
  ]);
  const widths = header.map((h, col) =>
    Math.max(h.length, ...body.map((row) => row[col].length)),
  );
  const pad = (s, w) => s + ' '.repeat(w - s.length);
  const fmt = (row) => row.map((v, col) => pad(v, widths[col])).join('  ');
  const sep = widths.map((w) => '-'.repeat(w)).join('  ');
  console.log(
    `imp-917 RETUNING_CALIBRATION.retuningTable (${rows.length} rows):`,
  );
  console.log(`  ${fmt(header)}`);
  console.log(`  ${sep}`);
  for (const r of body) console.log(`  ${fmt(r)}`);
  process.exit(0);
}

if (args.retuningTableJson) {
  // Structural JSON analog of --retuning-table: emit the per-N retuning lookup
  // verbatim so Python / jq runners can consume it directly. Pure data emitter
  // (no check, exit 0) matching the --missing-cells-json cadence.
  console.log(
    JSON.stringify(IMP_896_RETUNING_CALIBRATION.retuningTable, null, 2),
  );
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

const outputTargetPath = resolve(
  REPO_ROOT,
  'src/data/imp-857-phased-forcing-sweep.js',
);

// Mirror of checkPrototype() for the output side: assert the transcription
// target file exists and is a regular file. Shared-shape return so a future
// --verify-output-target-json partial can reuse it without drift.
function checkOutputTarget() {
  try {
    const s = statSync(outputTargetPath);
    if (!s.isFile()) {
      return {
        ok: false,
        path: outputTargetPath,
        sizeBytes: null,
        error: 'not a regular file',
      };
    }
    return { ok: true, path: outputTargetPath, sizeBytes: s.size, error: null };
  } catch (err) {
    return {
      ok: false,
      path: outputTargetPath,
      sizeBytes: null,
      error: `cannot stat: ${err.message}`,
    };
  }
}

if (args.verifyOutputTarget) {
  const r = checkOutputTarget();
  if (r.ok) {
    console.log(
      `imp-917 --verify-output-target OK: transcription target present (${r.path}, ${r.sizeBytes} bytes).`,
    );
    process.exit(0);
  }
  console.error(`imp-917 --verify-output-target FAILED: ${r.path}: ${r.error}`);
  process.exit(1);
}

if (args.verifyOutputTargetJson) {
  const r = checkOutputTarget();
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}

// Schema-level sibling of checkOutputTarget(): the stat check only proves the
// file exists, it does not prove the MEASURED_ROWS identifier the transcription
// step targets has survived. Shared-shape return so a future
// --verify-output-schema-json partial can reuse it without drift.
const OUTPUT_SCHEMA_TOKEN = 'const MEASURED_ROWS = [';

function checkOutputSchema() {
  try {
    const content = readFileSync(outputTargetPath, 'utf8');
    if (!content.includes(OUTPUT_SCHEMA_TOKEN)) {
      return {
        ok: false,
        path: outputTargetPath,
        token: OUTPUT_SCHEMA_TOKEN,
        error: `identifier \`${OUTPUT_SCHEMA_TOKEN}\` not found`,
      };
    }
    return { ok: true, path: outputTargetPath, token: OUTPUT_SCHEMA_TOKEN, error: null };
  } catch (err) {
    return {
      ok: false,
      path: outputTargetPath,
      token: OUTPUT_SCHEMA_TOKEN,
      error: `cannot read: ${err.message}`,
    };
  }
}

if (args.verifyOutputSchema) {
  const r = checkOutputSchema();
  if (r.ok) {
    console.log(
      `imp-917 --verify-output-schema OK: ${r.path} declares \`${OUTPUT_SCHEMA_TOKEN}\`.`,
    );
    process.exit(0);
  }
  console.error(`imp-917 --verify-output-schema FAILED: ${r.path}: ${r.error}`);
  process.exit(1);
}

if (args.verifyOutputSchemaJson) {
  const r = checkOutputSchema();
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
  // Sequenced shell pre-flight: verify-plan -> verify-prototype -> dry-run-all
  // -> verify-output-target -> verify-output-schema. Each step mirrors the
  // corresponding standalone flag so operator output is familiar. On failure,
  // exits with the 1-indexed step number so the driver can tell which step
  // tripped without parsing stdout.
  console.log('=== imp-917 --preflight step 1/5: --verify-plan ===');
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

  console.log('=== imp-917 --preflight step 2/5: --verify-prototype ===');
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

  console.log('=== imp-917 --preflight step 3/5: --dry-run-all ===');
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

  console.log('=== imp-917 --preflight step 4/5: --verify-output-target ===');
  const outputTargetResult = checkOutputTarget();
  if (!outputTargetResult.ok) {
    console.error(
      `imp-917 --preflight FAILED at step 4 (--verify-output-target): ${outputTargetResult.path}: ${outputTargetResult.error}`,
    );
    process.exit(4);
  }
  console.log(
    `  OK: transcription target present (${outputTargetResult.path}, ${outputTargetResult.sizeBytes} bytes).`,
  );

  console.log('=== imp-917 --preflight step 5/5: --verify-output-schema ===');
  const outputSchemaResult = checkOutputSchema();
  if (!outputSchemaResult.ok) {
    console.error(
      `imp-917 --preflight FAILED at step 5 (--verify-output-schema): ${outputSchemaResult.path}: ${outputSchemaResult.error}`,
    );
    process.exit(5);
  }
  console.log(
    `  OK: transcription target declares \`${outputSchemaResult.token}\` (${outputSchemaResult.path}).`,
  );

  console.log('imp-917 --preflight PASS: all 5 steps OK, offline batch ready to launch.');
  process.exit(0);
}

if (args.preflightJson) {
  // Structural JSON analog of --preflight: aggregate the four checks into one
  // object. Each step body mirrors the corresponding single-flag JSON analog
  // so parsers can reuse the same schema per step. firstFailingStep is the
  // 1-indexed step number of the first failure (or null on all-ok); the process
  // exit code mirrors that number, matching --preflight (0 / 1 / 2 / 3 / 4).
  const planResult = computePlanCoverage();
  const protoResult = checkPrototype();
  const resolveRows = [];
  let resolveFailures = 0;
  for (let i = 0; i < BATCH_PLAN.length; i++) {
    const p = BATCH_PLAN[i];
    const r = resolveCell(p.N, p.eps, null, null);
    if (r.error) {
      resolveRows.push({ index: i + 1, label: p.label, N: p.N, eps: p.eps, ok: false, error: r.error });
      resolveFailures++;
    } else {
      resolveRows.push({ index: i + 1, label: p.label, N: p.N, eps: p.eps, ok: true });
    }
  }
  const resolveOk = resolveFailures === 0;
  const outputTargetResult = checkOutputTarget();

  let firstFailingStep = null;
  if (!planResult.ok) firstFailingStep = 1;
  else if (!protoResult.ok) firstFailingStep = 2;
  else if (!resolveOk) firstFailingStep = 3;
  else if (!outputTargetResult.ok) firstFailingStep = 4;

  const body = {
    ok: firstFailingStep === null,
    firstFailingStep,
    steps: [
      { step: 1, name: '--verify-plan', ok: planResult.ok, coverage: planResult },
      { step: 2, name: '--verify-prototype', ok: protoResult.ok, prototype: protoResult },
      {
        step: 3,
        name: '--dry-run-all',
        ok: resolveOk,
        cellsTotal: BATCH_PLAN.length,
        cellsFailed: resolveFailures,
        cells: resolveRows,
      },
      {
        step: 4,
        name: '--verify-output-target',
        ok: outputTargetResult.ok,
        outputTarget: outputTargetResult,
      },
    ],
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(firstFailingStep ?? 0);
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
