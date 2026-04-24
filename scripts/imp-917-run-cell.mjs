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
//   node scripts/imp-917-run-cell.mjs --verify-prototype-schema
//   node scripts/imp-917-run-cell.mjs --verify-prototype-schema-json
//   node scripts/imp-917-run-cell.mjs --verify-prototype-env-readers
//   node scripts/imp-917-run-cell.mjs --verify-prototype-env-readers-json
//   node scripts/imp-917-run-cell.mjs --verify-output-target
//   node scripts/imp-917-run-cell.mjs --verify-output-target-json
//   node scripts/imp-917-run-cell.mjs --verify-output-schema
//   node scripts/imp-917-run-cell.mjs --verify-output-schema-json
//   node scripts/imp-917-run-cell.mjs --verify-output-schema-closer
//   node scripts/imp-917-run-cell.mjs --verify-output-schema-closer-json
//   node scripts/imp-917-run-cell.mjs --verify-retuning-coverage
//   node scripts/imp-917-run-cell.mjs --verify-retuning-coverage-json
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
// --verify-prototype-schema asserts that the phased-forcing prototype script
// still reads the IMP857_EPSILONS env var the driver sets per cell — i.e. the
// env-var contract that glues this driver to src/math/imp-857-phase-locked-dyson.mjs
// has not silently broken. Input-side mirror of --verify-output-schema: where
// --verify-prototype only stat()s the file, this check reads it via readFileSync
// and asserts the literal substring `process.env.IMP857_EPSILONS` is present.
// Orthogonal to --verify-prototype (stat-level): catches the silent drift where
// the prototype file exists but the IMP857_EPSILONS reader was renamed or
// removed, which would otherwise only surface at actual spawn time as the
// prototype ignoring the driver's eps triple. Exits 0 on success, 1 with a
// specific diagnostic on read error or missing identifier. Paired with
// --verify-prototype-schema-json for the {shell, JSON} matrix. Wired into
// --preflight as the appended step 7 (shell form) and into --preflight-json
// as the appended step 7 (JSON form), completing the aggregation-level
// {shell, JSON} pair for the input-side prototype-schema check.
//
// --verify-prototype-schema-json is the structural JSON analog of
// --verify-prototype-schema. Emits one object {ok, path, token, error} where
// path is always populated, token is the literal substring sought
// (`process.env.IMP857_EPSILONS`), and error is null on success or a
// human-readable string on failure (read error message, or
// ``identifier `process.env.IMP857_EPSILONS` not found``). Exit status matches
// --verify-prototype-schema (0 on ok, 1 on failure) so Python / jq
// offline-worker drivers can gate the ~20 CPU-hour batch on the JSON body AND
// the process exit code. Reuses the checkPrototypeSchema() helper with
// --verify-prototype-schema so the two diagnostics cannot drift. Completes
// the input-side content-level {shell, JSON} pair for the phased-forcing
// prototype, mirroring the output-side --verify-output-schema /
// --verify-output-schema-json pair. Wired into --preflight as the appended
// step 7 (shell form) and into --preflight-json as the appended step 7
// (JSON form).
//
// --verify-prototype-env-readers broadens the input-side content-level
// check: where --verify-prototype-schema asserts only the single
// `process.env.IMP857_EPSILONS` reader is present, this check asserts
// every one of the six IMP857_* env-var readers the driver binds to is
// present in the prototype — IMP857_N, IMP857_DT, IMP857_NSTEPS, IMP857_K0,
// IMP857_PHASEVEL, and IMP857_EPSILONS. Closes the silent-drift gap
// partial-gg only partially closed: if e.g. the IMP857_K0 reader is renamed
// between infrastructure work and the ~20 CPU-hour offline run, the
// prototype still spawns and still reads EPSILONS, but silently falls back
// to the in-source default k0 = Math.PI and measures the wrong resonance.
// Reads the file via readFileSync and reports each missing token in the
// failure diagnostic. Exits 0 on success, 1 with a specific diagnostic
// naming the missing reader(s) on failure. Paired with
// --verify-prototype-env-readers-json for the {shell, JSON} matrix. Wired
// into --preflight as the appended step 8 (shell form) and into
// --preflight-json as the appended step 8 (JSON form), completing the
// aggregation-level {shell, JSON} pair for the broader input-side
// env-readers check.
//
// --verify-prototype-env-readers-json is the structural JSON analog of
// --verify-prototype-env-readers. Reuses the shared checkPrototypeEnvReaders()
// helper (partial-kk) so the shell and JSON diagnostics cannot drift; both
// consult the same resolved prototypePath, both check the same six
// PROTOTYPE_ENV_READER_TOKENS, both classify read-error and missing-reader
// failures identically. Emits JSON.stringify(r, null, 2) where r carries
// {ok, path, tokens, missing, error}; exits r.ok ? 0 : 1 to match the shell
// form exit semantics so Python / jq offline-worker drivers can gate the ~20
// CPU-hour batch on BOTH the JSON body and the process exit code. Wired into
// --preflight-json as the appended step 8 (matching --preflight's step 8
// from partial-mm) so the aggregated shell and JSON pre-flights both end
// with the same broader env-readers presence check.
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
// (shell form) and into --preflight-json as the appended step 5 (JSON form).
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
// --verify-output-target / --verify-output-target-json pair. Wired into
// --preflight-json as the appended step 5 (matching --preflight's step 5) so
// the aggregated shell and JSON pre-flights both end with the same
// output-schema token check.
//
// --verify-output-schema-closer is a stronger content-level check on the
// transcription target than --verify-output-schema. The opener-only check
// proves `const MEASURED_ROWS = [` is present but does not prove the array
// closer `];` on its own line is still present after the opener. If the
// closer was accidentally removed or corrupted between infrastructure work
// and the ~20 CPU-hour offline run, any automated row-appender that splices
// rows before `];` (the pattern imp-917 offline workers use to transcribe
// maxIntervalWidth rows back into MEASURED_ROWS) would fail to locate its
// insertion anchor — a silent-drift surface --verify-output-schema misses.
// Searches for a standalone newline-`];` token AFTER the opener position, so
// unrelated inline `[];` empty-array literals elsewhere in the file do not
// spuriously satisfy the check. Uses a new checkOutputSchemaCloser() helper
// shaped like checkOutputSchema() ({ok, path, token, error}) so the shell,
// JSON, and aggregated-preflight forms cannot drift. Paired with
// --verify-output-schema-closer-json (partial-pp) for the {shell, JSON}
// matrix. Wired into --preflight as the appended step 9 (shell form,
// partial-qq) and into --preflight-json as the appended step 9 (JSON form,
// partial-rr), completing the aggregation-level {shell, JSON} pair for
// the output-schema closer check and bringing the imp-917 offline-run
// pre-flight surface to full shell/JSON symmetry end to end across all
// nine checks. Exits 0 on success, 1 with a specific diagnostic
// (opener missing, closer missing, or read error) on failure.
//
// --verify-output-schema-closer-json is the structural JSON analog of
// --verify-output-schema-closer. Emits one object {ok, path, token, error}
// where path is always populated, token is the literal closer substring sought
// (newline + `];`), and error is null on success or a human-readable string on
// failure (opener missing, closer missing, or read error). Exit status matches
// --verify-output-schema-closer (0 on ok, 1 on failure) so Python / jq
// offline-worker drivers can gate the ~20 CPU-hour batch on the JSON body AND
// the process exit code. Reuses the checkOutputSchemaCloser() helper with
// --verify-output-schema-closer so the two diagnostics cannot drift. Completes
// the content-level {shell, JSON} pair for the transcription-target closer
// check, matching the opener-level --verify-output-schema /
// --verify-output-schema-json pair. Wired into --preflight as the appended
// step 9 (shell form, partial-qq) and into --preflight-json as the appended
// step 9 (JSON form, partial-rr), completing the aggregation-level
// {shell, JSON} pair for the transcription-target closer check.
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
// --verify-retuning-coverage is a data-integrity pre-flight check on the
// imported IMP_896_RETUNING_CALIBRATION module itself: asserts every N value
// in missingCells has a corresponding row in retuningTable, so the
// (N -> k0_star / phaseVel_star) lookup that resolveCell() performs per
// BATCH_PLAN cell cannot silently miss. Orthogonal to --verify-plan
// (BATCH_PLAN vs MISSING_CELLS coverage) and to the on-disk presence trio
// (--verify-prototype / --verify-output-target / --verify-output-schema):
// catches the silent drift where MISSING_CELLS gains a new N before
// retuningTable does, which would otherwise only surface as a
// "N=<val> not in RETUNING_CALIBRATION" error at dry-run-all / actual
// spawn time with no up-front diagnostic naming the missing N set.
// Prints imp-917 --verify-retuning-coverage OK on success (exit=0); prints
// a FAILED diagnostic listing the uncovered N values on failure (exit=1).
// Uses a new computeRetuningCoverage() helper, shaped like
// computePlanCoverage() (returns {ok, missingCellNs, retuningTableNs,
// uncoveredNs}), so the --verify-retuning-coverage-json analog reuses it
// without drift. Paired with --verify-retuning-coverage-json for the
// {shell, JSON} matrix; wired into --preflight as the appended step 6
// (shell form) and into --preflight-json as the appended step 6 (JSON form).
//
// --verify-retuning-coverage-json is the structural JSON analog of
// --verify-retuning-coverage. Reuses computeRetuningCoverage() so the shell
// and JSON diagnostics cannot drift; both check the same (missingCells N set
// vs retuningTable N set) alignment, both report the same uncoveredNs list.
// Emits JSON.stringify(r, null, 2) of {ok, missingCellNs, retuningTableNs,
// uncoveredNs} and exits r.ok ? 0 : 1, matching the shell form exit
// semantics exactly so Python / jq offline-worker drivers can gate the
// ~20 CPU-hour batch on BOTH the JSON body and the process exit code.
// Completes the data-integrity {shell, JSON} pair, bringing the
// --verify-retuning-coverage check to the same shell/JSON symmetry as
// --verify-plan / --verify-plan-json, --verify-prototype /
// --verify-prototype-json, --verify-output-target /
// --verify-output-target-json, and --verify-output-schema /
// --verify-output-schema-json. Wired into --preflight as the appended step 6
// (shell form) and into --preflight-json as the appended step 6 (JSON form),
// completing the aggregation-level {shell, JSON} pair for every pre-flight
// check.
//
// --preflight runs nine shell pre-flight checks in sequence — --verify-plan
// (BATCH_PLAN vs MISSING_CELLS coverage), --verify-prototype (prototype script
// exists), --dry-run-all (every BATCH_PLAN cell resolves its IMP857_* env-var
// pack), --verify-output-target (transcription target exists),
// --verify-output-schema (transcription target still declares MEASURED_ROWS),
// --verify-retuning-coverage (every N in MISSING_CELLS has a retuningTable
// row), --verify-prototype-schema (prototype still reads
// process.env.IMP857_EPSILONS), --verify-prototype-env-readers (prototype
// reads all six IMP857_* env-var readers: N, DT, NSTEPS, K0, PHASEVEL,
// EPSILONS), and --verify-output-schema-closer (transcription-target
// MEASURED_ROWS array closer `];` still present after the opener) — and
// aggregates the results. Prints a per-step banner and a final PASS /
// FAILED summary. Exits 0 only if all nine pass; otherwise exits with the
// step number (1, 2, 3, 4, 5, 6, 7, 8, or 9) of the first failing step, so
// an offline-worker driver can gate the ~20 CPU-hour batch on a single
// command rather than orchestrating nine separate invocations and nine
// exit codes.
//
// --preflight-json is the structural JSON analog of --preflight. Emits one
// object {ok, firstFailingStep, steps: [{step, name, ok, ...}]} aggregating
// the nine checks. Each step object carries the same body that the single-flag
// JSON analog would emit (plan coverage diff, prototype stat, per-cell resolve
// summary, output-target stat, output-schema token presence, retuning-table
// coverage, prototype-schema token presence, prototype env-readers presence,
// output-schema-closer token presence). Exit status matches --preflight (0 on
// all-ok; 1, 2, 3, 4, 5, 6, 7, 8, or 9 on first failing step) so Python / jq
// offline-worker drivers can gate the batch on a single JSON body and a single
// exit code, completing the {shell, JSON} pair for every pre-flight check:
// --verify-plan / --verify-plan-json, --verify-prototype /
// --verify-prototype-json, --dry-run-all / --dry-run-all-json,
// --verify-output-target / --verify-output-target-json,
// --verify-output-schema / --verify-output-schema-json,
// --verify-retuning-coverage / --verify-retuning-coverage-json,
// --verify-prototype-schema / --verify-prototype-schema-json,
// --verify-prototype-env-readers / --verify-prototype-env-readers-json,
// --verify-output-schema-closer / --verify-output-schema-closer-json, and
// --preflight / --preflight-json.
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
    verifyPrototypeSchema: false,
    verifyPrototypeSchemaJson: false,
    verifyPrototypeEnvReaders: false,
    verifyPrototypeEnvReadersJson: false,
    verifyOutputTarget: false,
    verifyOutputTargetJson: false,
    verifyOutputSchema: false,
    verifyOutputSchemaJson: false,
    verifyOutputSchemaCloser: false,
    verifyOutputSchemaCloserJson: false,
    verifyRetuningCoverage: false,
    verifyRetuningCoverageJson: false,
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
    else if (a === '--verify-prototype-schema') out.verifyPrototypeSchema = true;
    else if (a === '--verify-prototype-schema-json') out.verifyPrototypeSchemaJson = true;
    else if (a === '--verify-prototype-env-readers') out.verifyPrototypeEnvReaders = true;
    else if (a === '--verify-prototype-env-readers-json') out.verifyPrototypeEnvReadersJson = true;
    else if (a === '--verify-output-target') out.verifyOutputTarget = true;
    else if (a === '--verify-output-target-json') out.verifyOutputTargetJson = true;
    else if (a === '--verify-output-schema') out.verifyOutputSchema = true;
    else if (a === '--verify-output-schema-json') out.verifyOutputSchemaJson = true;
    else if (a === '--verify-output-schema-closer') out.verifyOutputSchemaCloser = true;
    else if (a === '--verify-output-schema-closer-json') out.verifyOutputSchemaCloserJson = true;
    else if (a === '--verify-retuning-coverage') out.verifyRetuningCoverage = true;
    else if (a === '--verify-retuning-coverage-json') out.verifyRetuningCoverageJson = true;
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
          '       node scripts/imp-917-run-cell.mjs --verify-prototype-schema\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-prototype-schema-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-prototype-env-readers\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-prototype-env-readers-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-target\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-target-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-schema\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-schema-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-schema-closer\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-output-schema-closer-json\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-retuning-coverage\n' +
          '       node scripts/imp-917-run-cell.mjs --verify-retuning-coverage-json\n' +
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

// Schema-level sibling of checkPrototype(): the stat check only proves the file
// exists, it does not prove the IMP857_EPSILONS env-var reader the driver binds
// to has survived. Shared-shape return ({ok, path, token, error}) matching
// checkOutputSchema() so a future --verify-prototype-schema-json partial can
// reuse it without drift.
const PROTOTYPE_SCHEMA_TOKEN = 'process.env.IMP857_EPSILONS';

function checkPrototypeSchema() {
  try {
    const content = readFileSync(prototypePath, 'utf8');
    if (!content.includes(PROTOTYPE_SCHEMA_TOKEN)) {
      return {
        ok: false,
        path: prototypePath,
        token: PROTOTYPE_SCHEMA_TOKEN,
        error: `identifier \`${PROTOTYPE_SCHEMA_TOKEN}\` not found`,
      };
    }
    return { ok: true, path: prototypePath, token: PROTOTYPE_SCHEMA_TOKEN, error: null };
  } catch (err) {
    return {
      ok: false,
      path: prototypePath,
      token: PROTOTYPE_SCHEMA_TOKEN,
      error: `cannot read: ${err.message}`,
    };
  }
}

if (args.verifyPrototypeSchema) {
  const r = checkPrototypeSchema();
  if (r.ok) {
    console.log(
      `imp-917 --verify-prototype-schema OK: ${r.path} reads \`${PROTOTYPE_SCHEMA_TOKEN}\`.`,
    );
    process.exit(0);
  }
  console.error(`imp-917 --verify-prototype-schema FAILED: ${r.path}: ${r.error}`);
  process.exit(1);
}

if (args.verifyPrototypeSchemaJson) {
  const r = checkPrototypeSchema();
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}

// Broader input-side content-level check than checkPrototypeSchema(): asserts
// every IMP857_* env-var reader the driver binds to per cell is present in
// the prototype, not just IMP857_EPSILONS. Closes the silent-drift gap where
// a non-EPSILONS reader (e.g. IMP857_K0) is renamed between infrastructure
// work and the offline run, causing the prototype to silently fall back to
// its in-source default and measure the wrong cell.
const PROTOTYPE_ENV_READER_TOKENS = [
  'process.env.IMP857_N',
  'process.env.IMP857_DT',
  'process.env.IMP857_NSTEPS',
  'process.env.IMP857_K0',
  'process.env.IMP857_PHASEVEL',
  'process.env.IMP857_EPSILONS',
];

function checkPrototypeEnvReaders() {
  try {
    const content = readFileSync(prototypePath, 'utf8');
    const missing = PROTOTYPE_ENV_READER_TOKENS.filter((t) => !content.includes(t));
    if (missing.length > 0) {
      return {
        ok: false,
        path: prototypePath,
        tokens: PROTOTYPE_ENV_READER_TOKENS,
        missing,
        error: `missing env-var reader(s): ${missing.join(', ')}`,
      };
    }
    return {
      ok: true,
      path: prototypePath,
      tokens: PROTOTYPE_ENV_READER_TOKENS,
      missing: [],
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      path: prototypePath,
      tokens: PROTOTYPE_ENV_READER_TOKENS,
      missing: PROTOTYPE_ENV_READER_TOKENS.slice(),
      error: `cannot read: ${err.message}`,
    };
  }
}

if (args.verifyPrototypeEnvReaders) {
  const r = checkPrototypeEnvReaders();
  if (r.ok) {
    console.log(
      `imp-917 --verify-prototype-env-readers OK: ${r.path} reads all ${r.tokens.length} IMP857_* env-var readers (${r.tokens.join(', ')}).`,
    );
    process.exit(0);
  }
  console.error(
    `imp-917 --verify-prototype-env-readers FAILED: ${r.path}: ${r.error}`,
  );
  process.exit(1);
}

if (args.verifyPrototypeEnvReadersJson) {
  const r = checkPrototypeEnvReaders();
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

// Stronger content-level sibling of checkOutputSchema(): the opener-only check
// proves `const MEASURED_ROWS = [` is present but does NOT prove the array
// closer `\n];` on its own line is still present after the opener. If the
// closer was accidentally removed or corrupted, any automated row-appender
// that splices rows before `];` (the pattern imp-917 offline workers use to
// transcribe maxIntervalWidth rows back into MEASURED_ROWS) would fail to
// locate its insertion anchor — a silent-drift surface --verify-output-schema
// misses. Searches for a standalone `\n];` token AFTER the opener position so
// unrelated `[];` inline empty-array literals elsewhere in the file do not
// spuriously satisfy the check. Shared-shape return ({ok, path, token, error})
// so a future --verify-output-schema-closer-json partial can reuse it without
// drift, matching the checkOutputSchema() / checkPrototypeSchema() cadence.
const OUTPUT_SCHEMA_CLOSER_TOKEN = '\n];';

function checkOutputSchemaCloser() {
  try {
    const content = readFileSync(outputTargetPath, 'utf8');
    const openerPos = content.indexOf(OUTPUT_SCHEMA_TOKEN);
    if (openerPos === -1) {
      return {
        ok: false,
        path: outputTargetPath,
        token: OUTPUT_SCHEMA_CLOSER_TOKEN,
        error: `opener identifier \`${OUTPUT_SCHEMA_TOKEN}\` not found (run --verify-output-schema first)`,
      };
    }
    const closerPos = content.indexOf(
      OUTPUT_SCHEMA_CLOSER_TOKEN,
      openerPos + OUTPUT_SCHEMA_TOKEN.length,
    );
    if (closerPos === -1) {
      return {
        ok: false,
        path: outputTargetPath,
        token: OUTPUT_SCHEMA_CLOSER_TOKEN,
        error: `closer token (newline + \`];\`) not found after opener at position ${openerPos}`,
      };
    }
    return {
      ok: true,
      path: outputTargetPath,
      token: OUTPUT_SCHEMA_CLOSER_TOKEN,
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      path: outputTargetPath,
      token: OUTPUT_SCHEMA_CLOSER_TOKEN,
      error: `cannot read: ${err.message}`,
    };
  }
}

if (args.verifyOutputSchemaCloser) {
  const r = checkOutputSchemaCloser();
  if (r.ok) {
    console.log(
      `imp-917 --verify-output-schema-closer OK: ${r.path} has a standalone \`];\` closer after the \`${OUTPUT_SCHEMA_TOKEN}\` opener.`,
    );
    process.exit(0);
  }
  console.error(
    `imp-917 --verify-output-schema-closer FAILED: ${r.path}: ${r.error}`,
  );
  process.exit(1);
}

if (args.verifyOutputSchemaCloserJson) {
  const r = checkOutputSchemaCloser();
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}

// Data-integrity sibling of computePlanCoverage(): assert every N in
// IMP_896_RETUNING_CALIBRATION.missingCells has a matching row in
// IMP_896_RETUNING_CALIBRATION.retuningTable. Orthogonal to --verify-plan
// (BATCH_PLAN vs MISSING_CELLS) and the on-disk trio (--verify-prototype /
// --verify-output-target / --verify-output-schema): catches the silent drift
// where MISSING_CELLS gains a new N before retuningTable does, which would
// otherwise only surface as an "N=<val> not in RETUNING_CALIBRATION" error
// at dry-run-all / actual spawn time. Shared-shape return so a future
// --verify-retuning-coverage-json partial can reuse it without drift.
function computeRetuningCoverage() {
  const retuningNs = new Set(
    IMP_896_RETUNING_CALIBRATION.retuningTable.map((r) => r.N),
  );
  const missingNs = [
    ...new Set(IMP_896_RETUNING_CALIBRATION.missingCells.map((c) => c.N)),
  ];
  const uncoveredNs = missingNs.filter((n) => !retuningNs.has(n));
  return {
    ok: uncoveredNs.length === 0,
    missingCellNs: missingNs,
    retuningTableNs: [...retuningNs],
    uncoveredNs,
  };
}

if (args.verifyRetuningCoverage) {
  const r = computeRetuningCoverage();
  if (r.ok) {
    console.log(
      `imp-917 --verify-retuning-coverage OK: every N in MISSING_CELLS (${r.missingCellNs.join(', ')}) has a retuningTable row (retuningTable N set: ${r.retuningTableNs.join(', ')}).`,
    );
    process.exit(0);
  }
  console.error(
    `imp-917 --verify-retuning-coverage FAILED: ${r.uncoveredNs.length} MISSING_CELLS N value(s) lack a retuningTable row: ${r.uncoveredNs.join(', ')}`,
  );
  console.error(
    `  (missingCell N set: ${r.missingCellNs.join(', ')}; retuningTable N set: ${r.retuningTableNs.join(', ')})`,
  );
  process.exit(1);
}

if (args.verifyRetuningCoverageJson) {
  const r = computeRetuningCoverage();
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
  // -> verify-output-target -> verify-output-schema -> verify-retuning-coverage
  // -> verify-prototype-schema -> verify-prototype-env-readers ->
  // verify-output-schema-closer. Each step mirrors the corresponding
  // standalone flag so operator output is familiar. On failure, exits with
  // the 1-indexed step number so the driver can tell which step tripped
  // without parsing stdout.
  console.log('=== imp-917 --preflight step 1/9: --verify-plan ===');
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

  console.log('=== imp-917 --preflight step 2/9: --verify-prototype ===');
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

  console.log('=== imp-917 --preflight step 3/9: --dry-run-all ===');
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

  console.log('=== imp-917 --preflight step 4/9: --verify-output-target ===');
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

  console.log('=== imp-917 --preflight step 5/9: --verify-output-schema ===');
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

  console.log('=== imp-917 --preflight step 6/9: --verify-retuning-coverage ===');
  const retuningCoverageResult = computeRetuningCoverage();
  if (!retuningCoverageResult.ok) {
    console.error(
      `imp-917 --preflight FAILED at step 6 (--verify-retuning-coverage): ${retuningCoverageResult.uncoveredNs.length} MISSING_CELLS N value(s) lack a retuningTable row: ${retuningCoverageResult.uncoveredNs.join(', ')}`,
    );
    console.error(
      `  (missingCell N set: ${retuningCoverageResult.missingCellNs.join(', ')}; retuningTable N set: ${retuningCoverageResult.retuningTableNs.join(', ')})`,
    );
    process.exit(6);
  }
  console.log(
    `  OK: every N in MISSING_CELLS (${retuningCoverageResult.missingCellNs.join(', ')}) has a retuningTable row (retuningTable N set: ${retuningCoverageResult.retuningTableNs.join(', ')}).`,
  );

  console.log('=== imp-917 --preflight step 7/9: --verify-prototype-schema ===');
  const prototypeSchemaResult = checkPrototypeSchema();
  if (!prototypeSchemaResult.ok) {
    console.error(
      `imp-917 --preflight FAILED at step 7 (--verify-prototype-schema): ${prototypeSchemaResult.path}: ${prototypeSchemaResult.error}`,
    );
    process.exit(7);
  }
  console.log(
    `  OK: prototype script reads \`${prototypeSchemaResult.token}\` (${prototypeSchemaResult.path}).`,
  );

  console.log('=== imp-917 --preflight step 8/9: --verify-prototype-env-readers ===');
  const prototypeEnvReadersResult = checkPrototypeEnvReaders();
  if (!prototypeEnvReadersResult.ok) {
    console.error(
      `imp-917 --preflight FAILED at step 8 (--verify-prototype-env-readers): ${prototypeEnvReadersResult.path}: ${prototypeEnvReadersResult.error}`,
    );
    process.exit(8);
  }
  console.log(
    `  OK: prototype script reads all ${prototypeEnvReadersResult.tokens.length} IMP857_* env-var readers (${prototypeEnvReadersResult.tokens.join(', ')}).`,
  );

  console.log('=== imp-917 --preflight step 9/9: --verify-output-schema-closer ===');
  const outputSchemaCloserResult = checkOutputSchemaCloser();
  if (!outputSchemaCloserResult.ok) {
    console.error(
      `imp-917 --preflight FAILED at step 9 (--verify-output-schema-closer): ${outputSchemaCloserResult.path}: ${outputSchemaCloserResult.error}`,
    );
    process.exit(9);
  }
  console.log(
    `  OK: transcription target has a standalone \`];\` closer after the \`${OUTPUT_SCHEMA_TOKEN}\` opener (${outputSchemaCloserResult.path}).`,
  );

  console.log('imp-917 --preflight PASS: all 9 steps OK, offline batch ready to launch.');
  process.exit(0);
}

if (args.preflightJson) {
  // Structural JSON analog of --preflight: aggregate the nine checks into one
  // object. Each step body mirrors the corresponding single-flag JSON analog
  // so parsers can reuse the same schema per step. firstFailingStep is the
  // 1-indexed step number of the first failure (or null on all-ok); the process
  // exit code mirrors that number, matching --preflight
  // (0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9).
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
  const outputSchemaResult = checkOutputSchema();
  const retuningCoverageResult = computeRetuningCoverage();
  const prototypeSchemaResult = checkPrototypeSchema();
  const prototypeEnvReadersResult = checkPrototypeEnvReaders();
  const outputSchemaCloserResult = checkOutputSchemaCloser();

  let firstFailingStep = null;
  if (!planResult.ok) firstFailingStep = 1;
  else if (!protoResult.ok) firstFailingStep = 2;
  else if (!resolveOk) firstFailingStep = 3;
  else if (!outputTargetResult.ok) firstFailingStep = 4;
  else if (!outputSchemaResult.ok) firstFailingStep = 5;
  else if (!retuningCoverageResult.ok) firstFailingStep = 6;
  else if (!prototypeSchemaResult.ok) firstFailingStep = 7;
  else if (!prototypeEnvReadersResult.ok) firstFailingStep = 8;
  else if (!outputSchemaCloserResult.ok) firstFailingStep = 9;

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
      {
        step: 5,
        name: '--verify-output-schema',
        ok: outputSchemaResult.ok,
        outputSchema: outputSchemaResult,
      },
      {
        step: 6,
        name: '--verify-retuning-coverage',
        ok: retuningCoverageResult.ok,
        retuningCoverage: retuningCoverageResult,
      },
      {
        step: 7,
        name: '--verify-prototype-schema',
        ok: prototypeSchemaResult.ok,
        prototypeSchema: prototypeSchemaResult,
      },
      {
        step: 8,
        name: '--verify-prototype-env-readers',
        ok: prototypeEnvReadersResult.ok,
        prototypeEnvReaders: prototypeEnvReadersResult,
      },
      {
        step: 9,
        name: '--verify-output-schema-closer',
        ok: outputSchemaCloserResult.ok,
        outputSchemaCloser: outputSchemaCloserResult,
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
