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
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-by-N
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-by-N-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-max-triple
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-max-triple-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-min-triple
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-min-triple-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-summary
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-summary-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-range
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-range-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-median
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-median-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-stddev
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-stddev-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mad
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mad-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-iqr
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-iqr-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-variance
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-variance-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-geomean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-geomean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-harmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-harmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-cubmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-cubmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quartmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quartmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sextmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sextmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septmean
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
    batchPlanCost: false,
    batchPlanCostJson: false,
    batchPlanCostByN: false,
    batchPlanCostByNJson: false,
    batchPlanCostMaxTriple: false,
    batchPlanCostMaxTripleJson: false,
    batchPlanCostMinTriple: false,
    batchPlanCostMinTripleJson: false,
    batchPlanCostSummary: false,
    batchPlanCostSummaryJson: false,
    batchPlanCostTripleRange: false,
    batchPlanCostTripleRangeJson: false,
    batchPlanCostTripleMean: false,
    batchPlanCostTripleMeanJson: false,
    batchPlanCostTripleMedian: false,
    batchPlanCostTripleMedianJson: false,
    batchPlanCostTripleStddev: false,
    batchPlanCostTripleStddevJson: false,
    batchPlanCostTripleMad: false,
    batchPlanCostTripleMadJson: false,
    batchPlanCostTripleIqr: false,
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
    else if (a === '--batch-plan-cost') out.batchPlanCost = true;
    else if (a === '--batch-plan-cost-json') out.batchPlanCostJson = true;
    else if (a === '--batch-plan-cost-by-N') out.batchPlanCostByN = true;
    else if (a === '--batch-plan-cost-by-N-json') out.batchPlanCostByNJson = true;
    else if (a === '--batch-plan-cost-max-triple') out.batchPlanCostMaxTriple = true;
    else if (a === '--batch-plan-cost-max-triple-json') out.batchPlanCostMaxTripleJson = true;
    else if (a === '--batch-plan-cost-min-triple') out.batchPlanCostMinTriple = true;
    else if (a === '--batch-plan-cost-min-triple-json') out.batchPlanCostMinTripleJson = true;
    else if (a === '--batch-plan-cost-summary') out.batchPlanCostSummary = true;
    else if (a === '--batch-plan-cost-summary-json') out.batchPlanCostSummaryJson = true;
    else if (a === '--batch-plan-cost-triple-range') out.batchPlanCostTripleRange = true;
    else if (a === '--batch-plan-cost-triple-range-json') out.batchPlanCostTripleRangeJson = true;
    else if (a === '--batch-plan-cost-triple-mean') out.batchPlanCostTripleMean = true;
    else if (a === '--batch-plan-cost-triple-mean-json') out.batchPlanCostTripleMeanJson = true;
    else if (a === '--batch-plan-cost-triple-median') out.batchPlanCostTripleMedian = true;
    else if (a === '--batch-plan-cost-triple-median-json') out.batchPlanCostTripleMedianJson = true;
    else if (a === '--batch-plan-cost-triple-stddev') out.batchPlanCostTripleStddev = true;
    else if (a === '--batch-plan-cost-triple-stddev-json') out.batchPlanCostTripleStddevJson = true;
    else if (a === '--batch-plan-cost-triple-mad') out.batchPlanCostTripleMad = true;
    else if (a === '--batch-plan-cost-triple-mad-json') out.batchPlanCostTripleMadJson = true;
    else if (a === '--batch-plan-cost-triple-iqr') out.batchPlanCostTripleIqr = true;
    else if (a === '--batch-plan-cost-triple-iqr-json') out.batchPlanCostTripleIqrJson = true;
    else if (a === '--batch-plan-cost-triple-variance') out.batchPlanCostTripleVariance = true;
    else if (a === '--batch-plan-cost-triple-variance-json') out.batchPlanCostTripleVarianceJson = true;
    else if (a === '--batch-plan-cost-triple-geomean') out.batchPlanCostTripleGeomean = true;
    else if (a === '--batch-plan-cost-triple-geomean-json') out.batchPlanCostTripleGeomeanJson = true;
    else if (a === '--batch-plan-cost-triple-harmean') out.batchPlanCostTripleHarmean = true;
    else if (a === '--batch-plan-cost-triple-harmean-json') out.batchPlanCostTripleHarmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quadmean') out.batchPlanCostTripleQuadmean = true;
    else if (a === '--batch-plan-cost-triple-quadmean-json') out.batchPlanCostTripleQuadmeanJson = true;
    else if (a === '--batch-plan-cost-triple-cubmean') out.batchPlanCostTripleCubmean = true;
    else if (a === '--batch-plan-cost-triple-cubmean-json') out.batchPlanCostTripleCubmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quartmean') out.batchPlanCostTripleQuartmean = true;
    else if (a === '--batch-plan-cost-triple-quartmean-json') out.batchPlanCostTripleQuartmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quintmean') out.batchPlanCostTripleQuintmean = true;
    else if (a === '--batch-plan-cost-triple-quintmean-json') out.batchPlanCostTripleQuintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-sextmean') out.batchPlanCostTripleSextmean = true;
    else if (a === '--batch-plan-cost-triple-sextmean-json') out.batchPlanCostTripleSextmeanJson = true;
    else if (a === '--batch-plan-cost-triple-septmean') out.batchPlanCostTripleSeptmean = true;
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
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-by-N\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-by-N-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-max-triple\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-max-triple-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-min-triple\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-min-triple-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-summary\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-summary-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-range\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-range-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-median\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-median-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-stddev\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-stddev-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mad\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-mad-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-iqr\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-iqr-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-variance\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-variance-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-geomean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-geomean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-harmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-harmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-cubmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-cubmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quartmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quartmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sextmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sextmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septmean\n' +
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

// Per-triple BATCH_PLAN wall-time lookup. Each MISSING_CELLS row carries
// wallSecondsEstPerTripleRun for the triple that contains it; rows at the
// same N share that value (the cost is set by N + nSteps, not by eps). So a
// per-triple cost lookup just picks the first MISSING_CELLS row matching
// each BATCH_PLAN entry N and sums. Distinct from the
// IMP_896_RETUNING_CALIBRATION.totalWallSecondsEstimate reported under
// --missing-cells, which divides by 3 (per-cell amortized upper bound);
// --batch-plan-cost answers the operator question "how long will the full
// 6-triple offline batch take on a single sequential worker" by summing
// per-triple costs, not per-cell shares. Unknown-N BATCH_PLAN rows are
// tagged wallSec=null and contribute zero to the total, defensively
// guarding against future BATCH_PLAN drift. Shared by --batch-plan-cost
// (shell) and --batch-plan-cost-json (JSON) so the two diagnostics cannot
// drift.
function computeBatchPlanCost() {
  const missingByN = new Map();
  for (const c of IMP_896_RETUNING_CALIBRATION.missingCells) {
    if (!missingByN.has(c.N)) missingByN.set(c.N, c);
  }
  const rows = BATCH_PLAN.map((p, i) => {
    const proto = missingByN.get(p.N);
    return {
      index: i + 1,
      N: p.N,
      eps: p.eps,
      label: p.label,
      wallSec: proto ? proto.wallSecondsEstPerTripleRun : null,
    };
  });
  const totalSec = rows.reduce((s, r) => s + (r.wallSec ?? 0), 0);
  const unknownCount = rows.filter((r) => r.wallSec === null).length;
  return { rows, totalSec, unknownCount };
}

if (args.batchPlanCost) {
  const { rows, totalSec, unknownCount } = computeBatchPlanCost();
  const header = ['idx', 'N', 'eps', 'label', 'wallSecEst'];
  const body = rows.map((r) => [
    String(r.index),
    String(r.N),
    r.eps.join(','),
    r.label,
    r.wallSec === null ? 'unknown' : String(r.wallSec),
  ]);
  const widths = header.map((h, col) =>
    Math.max(h.length, ...body.map((r) => r[col].length)),
  );
  const pad = (s, w) => s + ' '.repeat(w - s.length);
  const fmt = (r) => r.map((v, col) => pad(v, widths[col])).join('  ');
  const sep = widths.map((w) => '-'.repeat(w)).join('  ');
  console.log(`imp-917 BATCH_PLAN cost (${rows.length} triple-runs):`);
  console.log(`  ${fmt(header)}`);
  console.log(`  ${sep}`);
  for (const r of body) console.log(`  ${fmt(r)}`);
  const unknownNote = unknownCount > 0 ? ` (${unknownCount} triple-run(s) with unknown N)` : '';
  console.log(
    `  total: ${rows.length} triple-runs, sum ~= ${totalSec.toFixed(0)} s (~${(totalSec / 3600).toFixed(1)} CPU-hours)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostJson) {
  // Structural JSON analog of --batch-plan-cost: emit the per-triple wall-time
  // breakdown as one object {rows, totalSec, totalHours, unknownCount} so
  // Python / jq-based offline-worker drivers can consume the cost data
  // directly without re-parsing the shell table. totalHours is precomputed
  // (totalSec / 3600) so jq one-liners do not need to redo the conversion.
  // Pure data emitter, exit 0 always (no validation gate). Reuses
  // computeBatchPlanCost() with --batch-plan-cost so the two diagnostics
  // cannot drift.
  const { rows, totalSec, unknownCount } = computeBatchPlanCost();
  const body = {
    rows,
    totalSec,
    totalHours: totalSec / 3600,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

// Per-N aggregation of BATCH_PLAN wall-time totals. Re-aggregates the
// per-triple rows from computeBatchPlanCost() by N, the natural axis for
// parallel-worker sharding (e.g. BATCH_PLAN packs two N=10000 triples at
// 72000 s each = 144000 s, dwarfing the N=1000 triple at 1400 s). Unknown-N
// triples (wallSec === null) are aggregated under the "unknown" bucket and
// contribute zero seconds to the total, matching the --batch-plan-cost
// unknownCount handling. Shared by --batch-plan-cost-by-N (shell) and
// --batch-plan-cost-by-N-json (JSON) so the two diagnostics cannot drift.
function computeBatchPlanCostByN() {
  const { rows, totalSec, unknownCount } = computeBatchPlanCost();
  const byN = new Map();
  for (const r of rows) {
    const key = r.wallSec === null ? 'unknown' : String(r.N);
    const entry = byN.get(key) || { N: key, triples: 0, wallSecTotal: 0 };
    entry.triples += 1;
    entry.wallSecTotal += r.wallSec ?? 0;
    byN.set(key, entry);
  }
  const grouped = [...byN.values()].sort((a, b) => {
    if (a.N === 'unknown') return 1;
    if (b.N === 'unknown') return -1;
    return Number(a.N) - Number(b.N);
  });
  return { rows, totalSec, unknownCount, grouped };
}

if (args.batchPlanCostByN) {
  // Shell data emitter: aggregate the per-triple wall-time totals from
  // computeBatchPlanCost() by N, so an operator splitting the offline batch
  // across multiple workers can see which N values dominate the total
  // wall-time budget. Distinct from --batch-plan-cost (per-triple rows,
  // sequential-worker budget) and from --missing-cells (per-cell amortized
  // cost): this is the per-N sequential-worker budget, the natural axis for
  // parallel-worker sharding. Reuses computeBatchPlanCostByN() with
  // --batch-plan-cost-by-N-json so the two diagnostics cannot drift.
  // Pure data emitter, exit 0.
  const { rows, totalSec, unknownCount, grouped } = computeBatchPlanCostByN();
  const header = ['N', 'triples', 'wallSecTotal', 'hours'];
  const body = grouped.map((g) => [
    g.N,
    String(g.triples),
    String(g.wallSecTotal),
    (g.wallSecTotal / 3600).toFixed(1),
  ]);
  const widths = header.map((h, col) =>
    Math.max(h.length, ...body.map((r) => r[col].length)),
  );
  const pad = (s, w) => s + ' '.repeat(w - s.length);
  const fmt = (r) => r.map((v, col) => pad(v, widths[col])).join('  ');
  const sep = widths.map((w) => '-'.repeat(w)).join('  ');
  console.log(`imp-917 BATCH_PLAN cost grouped by N (${grouped.length} distinct N):`);
  console.log(`  ${fmt(header)}`);
  console.log(`  ${sep}`);
  for (const r of body) console.log(`  ${fmt(r)}`);
  const unknownNote = unknownCount > 0 ? ` (${unknownCount} triple-run(s) with unknown N)` : '';
  console.log(
    `  total: ${grouped.length} N, ${rows.length} triple-runs, sum ~= ${totalSec.toFixed(0)} s (~${(totalSec / 3600).toFixed(1)} CPU-hours)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostByNJson) {
  // Structural JSON analog of --batch-plan-cost-by-N: emit the per-N
  // aggregation as one object {grouped, totalSec, totalHours, unknownCount}
  // so Python / jq-based offline-worker drivers can consume the per-N cost
  // breakdown directly without re-parsing the shell table. totalHours is
  // precomputed (totalSec / 3600) so jq one-liners do not need to redo the
  // conversion, matching the --batch-plan-cost-json cadence. Reuses
  // computeBatchPlanCostByN() with --batch-plan-cost-by-N so the two
  // diagnostics cannot drift. Pure data emitter, exit 0 always.
  const { totalSec, unknownCount, grouped } = computeBatchPlanCostByN();
  const body = {
    grouped,
    totalSec,
    totalHours: totalSec / 3600,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

// Critical-path lower bound: the single longest triple-run in BATCH_PLAN.
// Since each triple is a sequential prototype invocation, no parallel schedule
// across workers can finish faster than the longest triple regardless of
// worker count. Unknown-N rows (wallSec === null) are excluded from the max
// search so they do not produce a spurious "null vs number" comparison; the
// unknownCount is reported separately. Returns {maxRow, knownCount,
// unknownCount} where maxRow is null only if every triple has unknown N.
// Shared by --batch-plan-cost-max-triple (shell) and
// --batch-plan-cost-max-triple-json (JSON) so the two diagnostics cannot drift.
function computeBatchPlanCostMaxTriple() {
  const { rows, unknownCount } = computeBatchPlanCost();
  const knownRows = rows.filter((r) => r.wallSec !== null);
  const maxRow = knownRows.length === 0
    ? null
    : knownRows.reduce((best, r) => (r.wallSec > best.wallSec ? r : best), knownRows[0]);
  return { maxRow, knownCount: knownRows.length, unknownCount };
}

if (args.batchPlanCostMaxTriple) {
  // Shell data emitter: surface the single longest triple-run in BATCH_PLAN,
  // the critical-path lower bound for any parallel offline-worker schedule.
  // Distinct from --batch-plan-cost (per-triple rows, sequential single-worker
  // total) and --batch-plan-cost-by-N (per-N aggregation, achievable bound for
  // a worker-per-N schedule): --batch-plan-cost-max-triple is the theoretical
  // best-case bound, achievable only if every triple runs on its own dedicated
  // worker (6 workers). Reuses computeBatchPlanCostMaxTriple() with
  // --batch-plan-cost-max-triple-json so the two diagnostics cannot drift.
  // Pure data emitter, exit 0 unconditionally.
  const { maxRow, unknownCount } = computeBatchPlanCostMaxTriple();
  if (maxRow === null) {
    console.log('imp-917 BATCH_PLAN critical-path lower bound: unknown (all triples have unknown N).');
    process.exit(0);
  }
  const unknownNote = unknownCount > 0 ? ` (${unknownCount} triple-run(s) with unknown N excluded from max search)` : '';
  console.log(
    `imp-917 BATCH_PLAN critical-path lower bound: ${maxRow.wallSec.toFixed(0)} s (~${(maxRow.wallSec / 3600).toFixed(1)} CPU-hours)${unknownNote}.`,
  );
  console.log(
    `  longest triple: idx=${maxRow.index}, N=${maxRow.N}, eps=${maxRow.eps.join(',')}, label="${maxRow.label}"`,
  );
  console.log(
    '  (no parallel schedule across BATCH_PLAN can finish faster than this single triple.)',
  );
  process.exit(0);
}

if (args.batchPlanCostMaxTripleJson) {
  // Structural JSON analog of --batch-plan-cost-max-triple: emit the
  // critical-path lower bound as one object {maxRow, maxSec, maxHours,
  // knownCount, unknownCount} so Python / jq-based offline-worker drivers can
  // consume the best-case parallel-schedule bound directly without re-parsing
  // the shell summary lines. maxSec / maxHours are precomputed from
  // maxRow.wallSec so jq one-liners do not need to redo the conversion,
  // matching the --batch-plan-cost-json / --batch-plan-cost-by-N-json cadence.
  // If every triple has unknown N, maxRow is null and maxSec / maxHours are
  // null; otherwise they carry the same values the shell form prints. Reuses
  // computeBatchPlanCostMaxTriple() with --batch-plan-cost-max-triple so the
  // two diagnostics cannot drift. Pure data emitter, exit 0 unconditionally.
  const { maxRow, knownCount, unknownCount } = computeBatchPlanCostMaxTriple();
  const body = {
    maxRow,
    maxSec: maxRow === null ? null : maxRow.wallSec,
    maxHours: maxRow === null ? null : maxRow.wallSec / 3600,
    knownCount,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

// Canary-probe candidate: the single shortest triple-run in BATCH_PLAN.
// Complements computeBatchPlanCostMaxTriple() (critical-path upper bound for
// parallel schedules) with the per-triple lower extreme, surfacing the
// fastest cell an operator can spawn end-to-end to smoke-test the pipeline
// (retuning lookup, env-var wiring, prototype spawn, maxIntervalWidth row)
// before committing to the full ~20 CPU-hour batch. Unknown-N rows
// (wallSec === null) are excluded from the min search so they do not
// produce a spurious "null vs number" comparison; the unknownCount is
// reported separately. Returns {minRow, knownCount, unknownCount} where
// minRow is null only if every triple has unknown N. Shared-shape result
// matching computeBatchPlanCostMaxTriple() so a future
// --batch-plan-cost-min-triple-json partial can reuse it without drift.
function computeBatchPlanCostMinTriple() {
  const { rows, unknownCount } = computeBatchPlanCost();
  const knownRows = rows.filter((r) => r.wallSec !== null);
  const minRow = knownRows.length === 0
    ? null
    : knownRows.reduce((best, r) => (r.wallSec < best.wallSec ? r : best), knownRows[0]);
  return { minRow, knownCount: knownRows.length, unknownCount };
}

if (args.batchPlanCostMinTriple) {
  // Shell data emitter: surface the single shortest triple-run in BATCH_PLAN
  // as the canary-probe candidate. Distinct from --batch-plan-cost-max-triple
  // (critical-path upper bound; the longest triple no parallel schedule can
  // beat) and from --batch-plan-cost-summary (consolidated 3-bound summary):
  // --batch-plan-cost-min-triple answers the operator question "which single
  // triple should I run first to smoke-test the offline pipeline end-to-end
  // before committing to the full ~20 CPU-hour batch?" The minimum-cost
  // triple is the natural choice since it exercises every code path the
  // larger-N triples will (retuning lookup, env-var wiring, prototype spawn,
  // maxIntervalWidth extraction, MEASURED_ROWS transcription) at the cheapest
  // wall-time. Reuses computeBatchPlanCostMinTriple() (which reuses
  // computeBatchPlanCost()) so the shell output cannot drift from the
  // upstream per-triple cost table. Pure data emitter, exit 0 unconditionally
  // (not a check). Not wired into --preflight / --preflight-json (pure data
  // emitter, not a pre-flight gate).
  const { minRow, unknownCount } = computeBatchPlanCostMinTriple();
  if (minRow === null) {
    console.log('imp-917 BATCH_PLAN canary-probe candidate: unknown (all triples have unknown N).');
    process.exit(0);
  }
  const unknownNote = unknownCount > 0 ? ` (${unknownCount} triple-run(s) with unknown N excluded from min search)` : '';
  console.log(
    `imp-917 BATCH_PLAN canary-probe candidate: ${minRow.wallSec.toFixed(0)} s (~${(minRow.wallSec / 3600).toFixed(1)} CPU-hours)${unknownNote}.`,
  );
  console.log(
    `  shortest triple: idx=${minRow.index}, N=${minRow.N}, eps=${minRow.eps.join(',')}, label="${minRow.label}"`,
  );
  console.log(
    '  (run this triple first to smoke-test the offline pipeline end-to-end before launching the full batch.)',
  );
  process.exit(0);
}

if (args.batchPlanCostMinTripleJson) {
  // Structural JSON analog of --batch-plan-cost-min-triple: emit the
  // canary-probe candidate (shortest triple in BATCH_PLAN) as one object
  // {minRow, minSec, minHours, knownCount, unknownCount} so Python / jq-based
  // offline-worker drivers can consume the per-triple lower extreme directly
  // without re-parsing the shell summary lines. minSec / minHours are
  // precomputed from minRow.wallSec so jq one-liners do not need to redo the
  // seconds-to-hours conversion, matching the --batch-plan-cost-max-triple-json
  // cadence. If every triple has unknown N, minRow is null and minSec /
  // minHours are null. Reuses computeBatchPlanCostMinTriple() with
  // --batch-plan-cost-min-triple so the two diagnostics cannot drift. Pure
  // data emitter, exit 0 unconditionally.
  const { minRow, knownCount, unknownCount } = computeBatchPlanCostMinTriple();
  const body = {
    minRow,
    minSec: minRow === null ? null : minRow.wallSec,
    minHours: minRow === null ? null : minRow.wallSec / 3600,
    knownCount,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostSummary) {
  // Consolidated summary: emits all three parallel-schedule bounds
  // (1-worker serial total, per-N best-case, max-triple critical-path) in one
  // table with speedup ratios relative to the serial total. Reuses
  // computeBatchPlanCost(), computeBatchPlanCostByN(), and
  // computeBatchPlanCostMaxTriple() with zero new math so the four diagnostics
  // (summary + three standalone emitters) cannot drift. Operator convenience:
  // read the full {1-worker, per-N, max-triple} speedup chain in a single
  // invocation rather than running three separate emitters and transcribing
  // the totals before deciding how many workers to provision for the ~20
  // CPU-hour offline batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { totalSec, unknownCount } = computeBatchPlanCost();
  const { grouped } = computeBatchPlanCostByN();
  const { maxRow } = computeBatchPlanCostMaxTriple();
  const serialSec = totalSec;
  const perNSec = grouped.reduce(
    (best, g) => (g.wallSecTotal > best ? g.wallSecTotal : best),
    0,
  );
  const maxTripleSec = maxRow === null ? null : maxRow.wallSec;
  const fmtSec = (s) => (s === null ? 'unknown' : s.toFixed(0));
  const fmtHours = (s) => (s === null ? 'unknown' : (s / 3600).toFixed(2));
  const fmtSpeedup = (s) =>
    s === null || s === 0 || serialSec === 0 ? 'n/a' : (serialSec / s).toFixed(2) + 'x';
  const headers = ['sharding', 'wallSec', 'hours', 'speedup'];
  const body = [
    ['1-worker-serial', fmtSec(serialSec), fmtHours(serialSec), fmtSpeedup(serialSec)],
    ['per-N-best', fmtSec(perNSec), fmtHours(perNSec), fmtSpeedup(perNSec)],
    ['max-triple-best', fmtSec(maxTripleSec), fmtHours(maxTripleSec), fmtSpeedup(maxTripleSec)],
  ];
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...body.map((row) => row[i].length)),
  );
  const pad = (s, w) => s + ' '.repeat(w - s.length);
  const render = (row) => row.map((c, i) => pad(c, widths[i])).join('  ');
  const unknownNote = unknownCount > 0 ? ` (${unknownCount} triple-run(s) with unknown N)` : '';
  console.log('imp-917 BATCH_PLAN parallel-schedule bounds summary:');
  console.log('  ' + render(headers));
  console.log('  ' + '-'.repeat(widths.reduce((a, b) => a + b, 0) + 2 * (widths.length - 1)));
  for (const r of body) console.log('  ' + render(r));
  console.log(
    `  (speedup = serial / bound. Inequality chain: max-triple-best <= per-N-best <= 1-worker-serial${unknownNote}.)`,
  );
  process.exit(0);
}

if (args.batchPlanCostSummaryJson) {
  // Structural JSON analog of --batch-plan-cost-summary: emit the consolidated
  // parallel-schedule bounds as one object {serial, perNBest, maxTripleBest,
  // unknownCount} where each bound carries wallSec / hours / speedup fields so
  // Python / jq-based offline-worker drivers can consume the speedup chain
  // directly without re-parsing the shell table. Reuses computeBatchPlanCost(),
  // computeBatchPlanCostByN(), and computeBatchPlanCostMaxTriple() with zero
  // new math so the shell and JSON forms of the summary cannot drift. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { totalSec, unknownCount } = computeBatchPlanCost();
  const { grouped } = computeBatchPlanCostByN();
  const { maxRow } = computeBatchPlanCostMaxTriple();
  const serialSec = totalSec;
  const perNSec = grouped.reduce(
    (best, g) => (g.wallSecTotal > best ? g.wallSecTotal : best),
    0,
  );
  const maxTripleSec = maxRow === null ? null : maxRow.wallSec;
  const speedup = (s) =>
    s === null || s === 0 || serialSec === 0 ? null : serialSec / s;
  const hours = (s) => (s === null ? null : s / 3600);
  const body = {
    serial: { wallSec: serialSec, hours: hours(serialSec), speedup: speedup(serialSec) },
    perNBest: { wallSec: perNSec, hours: hours(perNSec), speedup: speedup(perNSec) },
    maxTripleBest: { wallSec: maxTripleSec, hours: hours(maxTripleSec), speedup: speedup(maxTripleSec) },
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleRange) {
  // Shell data emitter: surface BATCH_PLAN's per-triple wall-time range
  // (shortest-triple canary + longest-triple critical-path) in a single
  // two-row ASCII table alongside their seconds / CPU-hour values and the
  // max/min ratio as a compactness indicator for the offline batch. Pure
  // composition of computeBatchPlanCostMinTriple() (partial-ddd helper) and
  // computeBatchPlanCostMaxTriple() (partial-zz helper) with zero new math,
  // so this emitter cannot drift from its upstream single-extreme siblings
  // (--batch-plan-cost-min-triple, --batch-plan-cost-max-triple). Answers
  // the operator question "what is the wall-time span across the 6 triples
  // before I decide whether to parallelize?" in one invocation rather than
  // running the two single-extreme emitters separately and eyeballing their
  // outputs. Pure data emitter, exit 0 unconditionally (not a pre-flight
  // gate), not wired into --preflight / --preflight-json.
  const { minRow, unknownCount } = computeBatchPlanCostMinTriple();
  const { maxRow } = computeBatchPlanCostMaxTriple();
  const fmtSec = (s) => (s === null ? 'unknown' : s.toFixed(0));
  const fmtHours = (s) => (s === null ? 'unknown' : (s / 3600).toFixed(2));
  const fmtIdx = (r) => (r === null ? 'n/a' : String(r.index));
  const fmtN = (r) => (r === null ? 'n/a' : String(r.N));
  const fmtEps = (r) => (r === null ? 'n/a' : r.eps.join(','));
  const headers = ['extreme', 'idx', 'N', 'eps', 'wallSec', 'hours'];
  const body = [
    [
      'min-triple',
      fmtIdx(minRow),
      fmtN(minRow),
      fmtEps(minRow),
      fmtSec(minRow === null ? null : minRow.wallSec),
      fmtHours(minRow === null ? null : minRow.wallSec),
    ],
    [
      'max-triple',
      fmtIdx(maxRow),
      fmtN(maxRow),
      fmtEps(maxRow),
      fmtSec(maxRow === null ? null : maxRow.wallSec),
      fmtHours(maxRow === null ? null : maxRow.wallSec),
    ],
  ];
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...body.map((row) => row[i].length)),
  );
  const pad = (s, w) => s + ' '.repeat(w - s.length);
  const render = (row) => row.map((c, i) => pad(c, widths[i])).join('  ');
  const ratio =
    minRow === null || maxRow === null || minRow.wallSec === 0
      ? null
      : maxRow.wallSec / minRow.wallSec;
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from extrema search)`
      : '';
  console.log('imp-917 BATCH_PLAN per-triple wall-time range:');
  console.log('  ' + render(headers));
  console.log(
    '  ' + '-'.repeat(widths.reduce((a, b) => a + b, 0) + 2 * (widths.length - 1)),
  );
  for (const r of body) console.log('  ' + render(r));
  console.log(
    `  (max/min ratio = ${ratio === null ? 'n/a' : ratio.toFixed(2) + 'x'}; compactness indicator across the 6 triples${unknownNote}.)`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleRangeJson) {
  // Structural JSON analog of --batch-plan-cost-triple-range (partial-fff):
  // surface BATCH_PLAN's per-triple wall-time range (shortest-triple canary +
  // longest-triple critical-path) as a single object {min, max, ratio,
  // unknownCount} so Python / jq offline-worker drivers can consume the
  // compactness signal directly without re-parsing the two-row shell table.
  // Pure composition of computeBatchPlanCostMinTriple() (partial-ddd helper)
  // and computeBatchPlanCostMaxTriple() (partial-zz helper) with zero new
  // math, matching the shell form exactly: identical min/max rows selected,
  // identical ratio = max.wallSec / min.wallSec, identical unknown-N handling
  // (unknown-wallSec triples excluded from extrema search, surfaced in
  // unknownCount). Both the min and max extrema carry the full {index, N, eps,
  // wallSec, hours} shape so downstream drivers can key canary / critical-path
  // spawns by BATCH_PLAN index without re-doing the (row -> hours) conversion.
  // Pure data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json.
  const { minRow, unknownCount } = computeBatchPlanCostMinTriple();
  const { maxRow } = computeBatchPlanCostMaxTriple();
  const toExtreme = (r) =>
    r === null
      ? null
      : {
          index: r.index,
          N: r.N,
          eps: r.eps,
          wallSec: r.wallSec,
          hours: r.wallSec === null ? null : r.wallSec / 3600,
        };
  const ratio =
    minRow === null || maxRow === null || minRow.wallSec === 0
      ? null
      : maxRow.wallSec / minRow.wallSec;
  const body = {
    min: toExtreme(minRow),
    max: toExtreme(maxRow),
    ratio,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleMean) {
  // Shell data emitter: surface the arithmetic mean wall-time across the
  // known-wallSec rows of BATCH_PLAN as a central-tendency complement to the
  // existing extrema views (--batch-plan-cost-min-triple canary, partial-ddd;
  // --batch-plan-cost-max-triple critical-path, partial-zz; --batch-plan-cost-
  // triple-range both endpoints, partial-fff). The mean answers the separate
  // operator question "what is the typical per-triple wall-time?" — useful
  // when budgeting an expected-case N-worker schedule where each worker draws
  // triples from a shared queue: expected per-worker wall-time is roughly
  // (mean * knownCount) / N, whereas --batch-plan-cost-by-N bounds the
  // worst-case pinned-N schedule and --batch-plan-cost-max-triple bounds the
  // critical-path floor. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new math; unknown-N rows (wallSec === null) are excluded from
  // both the sum and the count so the mean is computed only across the
  // known-wallSec rows, and an appended note reports any excluded count.
  // All-unknown degenerate case prints a dedicated "unknown (all triples
  // have unknown N)" summary and exits 0 rather than dividing by zero,
  // matching the partial-zz / partial-ddd degenerate cadence. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-mean-json analog can follow mirroring the
  // partial-vv/ww, partial-xx/yy, partial-zz/aaa, partial-ddd/eee, partial-
  // bbb/ccc, and partial-fff/ggg shell-first / JSON-second cadence.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sumSec = known.reduce((s, r) => s + r.wallSec, 0);
  const meanSec = sumSec / known.length;
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from mean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple mean wall-time: ${meanSec.toFixed(0)} s (~${(meanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleMeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-mean (partial-hhh):
  // surface BATCH_PLAN's arithmetic mean per-triple wall-time as a single
  // object {meanSec, meanHours, knownCount, unknownCount} so Python / jq
  // offline-worker drivers can consume the central-tendency signal directly
  // without re-parsing the one-line shell summary. Pure composition of
  // computeBatchPlanCost() (partial-vv helper) with zero new math, matching
  // the shell form exactly: identical known-row filter (wallSec !== null),
  // identical sum / length divide, identical unknown-N handling (excluded
  // from both the sum and the count, surfaced in unknownCount). All-unknown
  // degenerate case emits {meanSec: null, meanHours: null, knownCount: 0,
  // unknownCount} and still exits 0, matching the shell form's graceful
  // degenerate branch (both avoid divide-by-zero the same way). Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Completes the {shell, JSON} pair for
  // partial-hhh and rounds out the full triple-extrema/central-tendency
  // {shell, JSON} quartet alongside --batch-plan-cost-max-triple (partial-zz)
  // / --batch-plan-cost-max-triple-json (partial-aaa), --batch-plan-cost-min-
  // triple (partial-ddd) / --batch-plan-cost-min-triple-json (partial-eee),
  // --batch-plan-cost-triple-range (partial-fff) / --batch-plan-cost-triple-
  // range-json (partial-ggg), and --batch-plan-cost-triple-mean (partial-hhh).
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  const meanSec = known.length === 0 ? null : known.reduce((s, r) => s + r.wallSec, 0) / known.length;
  const meanHours = meanSec === null ? null : meanSec / 3600;
  const body = {
    meanSec,
    meanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleMedian) {
  // Shell data emitter: surface the median per-triple wall-time across the
  // known-wallSec rows of BATCH_PLAN as an outlier-robust complement to the
  // arithmetic mean (--batch-plan-cost-triple-mean, partial-hhh). Where the
  // mean is skewed by BATCH_PLAN's single 72000 s N=10000 critical-path
  // triple (partial-zz max), the median reports the typical per-triple cost
  // that the bulk of the workload actually follows, which is the natural
  // statistic for sizing a shared-queue schedule whose tail-latency is
  // absorbed by overlap rather than by the worst-case per-triple floor.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new math;
  // unknown-N rows (wallSec === null) are excluded from the sort so null
  // entries cannot corrupt the ordering, and unknownCount is reported
  // explicitly in a trailing note. Even-count degenerate case (the current
  // 6-row BATCH_PLAN after all unknowns resolve) averages the two middle
  // values; odd-count picks the single middle value; the all-unknown case
  // prints a dedicated unknown summary and exits 0 without touching the
  // sort, matching the partial-zz / partial-ddd / partial-hhh degenerate
  // cadence. Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Shell-only this partial;
  // a --batch-plan-cost-triple-median-json analog can follow mirroring the
  // partial-vv/ww, partial-xx/yy, partial-zz/aaa, partial-ddd/eee, partial-
  // bbb/ccc, partial-fff/ggg, and partial-hhh/iii shell-first / JSON-second
  // cadence.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple median wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sorted = known.map((r) => r.wallSec).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianSec =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from median)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple median wall-time: ${medianSec.toFixed(0)} s (~${(medianSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleMedianJson) {
  // Structural JSON analog of --batch-plan-cost-triple-median (partial-jjj):
  // surface BATCH_PLAN's outlier-robust median per-triple wall-time as a
  // single object {medianSec, medianHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the central-tendency
  // signal directly without re-parsing the one-line shell summary. Pure
  // composition of computeBatchPlanCost() (partial-vv helper) with zero new
  // math, matching the shell form exactly: identical known-row filter
  // (wallSec !== null), identical sort over known wallSec values, identical
  // even/odd midpoint selection (average of sorted[mid-1] and sorted[mid]
  // when even-count, single sorted[mid] when odd-count), identical
  // unknown-N handling (excluded from the sort and reported via
  // unknownCount). All-unknown degenerate case emits {medianSec: null,
  // medianHours: null, knownCount: 0, unknownCount} and exits 0, matching
  // the shell form's graceful degenerate branch (both avoid sorting an
  // empty array the same way). medianHours is precomputed inline as
  // medianSec / 3600 (null when knownCount === 0) matching the
  // precomputed-hours cadence established across the whole cost-emitter
  // family (--batch-plan-cost-json, --batch-plan-cost-by-N-json,
  // --batch-plan-cost-max-triple-json, --batch-plan-cost-min-triple-json,
  // --batch-plan-cost-triple-range-json, --batch-plan-cost-triple-mean-json)
  // so Python / jq drivers never redo the seconds-to-hours conversion per
  // run. Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Completes the {shell,
  // JSON} pair for partial-jjj and rounds out the full triple-extrema /
  // central-tendency {shell, JSON} family alongside --batch-plan-cost-max-
  // triple (partial-zz) / --batch-plan-cost-max-triple-json (partial-aaa),
  // --batch-plan-cost-min-triple (partial-ddd) / --batch-plan-cost-min-
  // triple-json (partial-eee), --batch-plan-cost-triple-range (partial-fff)
  // / --batch-plan-cost-triple-range-json (partial-ggg), --batch-plan-cost-
  // triple-mean (partial-hhh) / --batch-plan-cost-triple-mean-json
  // (partial-iii), and --batch-plan-cost-triple-median (partial-jjj).
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let medianSec = null;
  if (known.length > 0) {
    const sorted = known.map((r) => r.wallSec).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    medianSec =
      sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }
  const medianHours = medianSec === null ? null : medianSec / 3600;
  const body = {
    medianSec,
    medianHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleStddev) {
  // Shell data emitter: surface the population standard deviation of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN as a dispersion
  // complement to the central-tendency emitters (--batch-plan-cost-triple-mean,
  // partial-hhh; --batch-plan-cost-triple-median, partial-jjj). Where the mean
  // answers "what is the typical cost?" and the median answers "what does the
  // bulk of the workload look like?", the stddev answers "how peaked is the
  // distribution around the mean?" - concretely, BATCH_PLAN packs two N=10000
  // triples at 72000 s each alongside four N<=2000 triples at <=4000 s each,
  // so a large stddev relative to the mean is the signature that the batch is
  // dominated by the two tail triples and is exactly the signal that motivates
  // pinning those two triples to dedicated workers rather than dealing them
  // into a shared queue. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new batch-plan logic; unknown-N rows (wallSec === null) are
  // excluded from both the mean and the squared-deviation sum so nulls cannot
  // corrupt the statistic, and unknownCount is reported explicitly in a
  // trailing note. Uses the population formula (divide by knownCount, not
  // knownCount-1) since the 6 triple-runs ARE the full batch - there is no
  // larger population being sampled. All-unknown degenerate case prints a
  // dedicated unknown summary and exits 0 without dividing by zero, matching
  // the partial-zz / partial-ddd / partial-hhh / partial-jjj degenerate
  // cadence. Also emits the coefficient-of-variation (stddev / mean) as a
  // unit-free spread indicator: CoV > 1 is the signature of a right-skewed
  // batch dominated by a few large jobs, which is exactly what BATCH_PLAN is.
  // Pure data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-stddev-json analog can follow mirroring the
  // shell-first / JSON-second cadence established across the whole cost-
  // emitter family.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple stddev wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const meanSec = known.reduce((s, r) => s + r.wallSec, 0) / known.length;
  const varianceSec =
    known.reduce((s, r) => s + (r.wallSec - meanSec) ** 2, 0) / known.length;
  const stddevSec = Math.sqrt(varianceSec);
  const cov = meanSec === 0 ? null : stddevSec / meanSec;
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from stddev)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple stddev wall-time: ${stddevSec.toFixed(0)} s (~${(stddevSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s); mean ${meanSec.toFixed(0)} s, CoV = ${cov === null ? 'n/a' : cov.toFixed(2)}${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleStddevJson) {
  // Structural JSON analog of --batch-plan-cost-triple-stddev (partial-lll):
  // surface BATCH_PLAN's population standard deviation of per-triple
  // wall-times as a single object {stddevSec, stddevHours, meanSec, cov,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the dispersion signal directly without re-parsing the one-line
  // shell summary. Pure composition of computeBatchPlanCost() (partial-vv
  // helper) with zero new math, matching the shell form exactly: identical
  // known-row filter (wallSec !== null), identical mean and population
  // variance (divide by knownCount, not knownCount-1, since the 6
  // triple-runs ARE the full batch), identical CoV = stddev / mean with
  // null fallback when mean is 0, identical unknown-N handling (excluded
  // from both mean and squared-deviation sum, surfaced via unknownCount).
  // stddevHours is precomputed inline as stddevSec / 3600 (null when
  // knownCount === 0) matching the precomputed-hours cadence established
  // across the whole cost-emitter family (--batch-plan-cost-json,
  // --batch-plan-cost-by-N-json, --batch-plan-cost-max-triple-json,
  // --batch-plan-cost-min-triple-json, --batch-plan-cost-triple-range-json,
  // --batch-plan-cost-triple-mean-json, --batch-plan-cost-triple-median-json)
  // so Python / jq drivers never redo the seconds-to-hours conversion per
  // run. All-unknown degenerate case emits {stddevSec: null, stddevHours:
  // null, meanSec: null, cov: null, knownCount: 0, unknownCount} and exits
  // 0 without dividing by zero, matching the partial-zz / partial-ddd /
  // partial-hhh / partial-jjj / partial-lll degenerate cadence. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Completes the {shell, JSON} pair for
  // partial-lll and rounds out the full per-triple statistical surface
  // {min extremum, max extremum, range-with-ratio, arithmetic mean,
  // median, stddev} x {shell, JSON}.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let stddevSec = null;
  let meanSec = null;
  let cov = null;
  if (known.length > 0) {
    meanSec = known.reduce((s, r) => s + r.wallSec, 0) / known.length;
    const varianceSec =
      known.reduce((s, r) => s + (r.wallSec - meanSec) ** 2, 0) / known.length;
    stddevSec = Math.sqrt(varianceSec);
    cov = meanSec === 0 ? null : stddevSec / meanSec;
  }
  const stddevHours = stddevSec === null ? null : stddevSec / 3600;
  const body = {
    stddevSec,
    stddevHours,
    meanSec,
    cov,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleMad) {
  // Shell data emitter: surface the median absolute deviation (MAD) of
  // per-triple wall-times across the known-wallSec rows of BATCH_PLAN as an
  // outlier-robust dispersion complement to the population stddev
  // (--batch-plan-cost-triple-stddev, partial-lll). MAD is to stddev what the
  // median is to the mean: it answers the same "how spread out is the
  // distribution?" question but ignores tail outliers rather than squaring
  // them. Concretely, on BATCH_PLAN's 6-row known set where two N=10000
  // triples at 72000 s each sit alongside four N<=2000 triples at <=4000 s
  // each, the stddev (29919 s / 8.31 h) is inflated by the two tail triples;
  // MAD reports the typical per-triple deviation that the bulk of the
  // workload actually exhibits from the per-triple median, which is the
  // natural dispersion statistic for sizing a shared-queue schedule whose
  // tail-latency is absorbed by overlap rather than by the worst-case
  // per-triple floor. Formula: MAD = median(|x_i - median(x)|) computed over
  // the known-wallSec values only; unknown-N rows (wallSec === null) are
  // excluded from both the inner median and the deviation-median so null
  // entries cannot corrupt either statistic, and unknownCount is reported in
  // a trailing note. Even-count case averages the two middle values at both
  // stages; odd-count picks the single middle value. All-unknown degenerate
  // case prints a dedicated unknown summary and exits 0 without touching the
  // sort, matching the partial-zz / partial-ddd / partial-hhh / partial-jjj /
  // partial-lll degenerate cadence. Also emits MAD / median as a unit-free
  // dispersion ratio (the robust analog of the CoV in partial-lll), with a
  // null guard when the inner median is 0. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-mad-json analog can follow mirroring the
  // shell-first / JSON-second cadence established across the whole
  // cost-emitter family.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple MAD wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const medianOf = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };
  const values = known.map((r) => r.wallSec);
  const medianSec = medianOf(values);
  const deviations = values.map((v) => Math.abs(v - medianSec));
  const madSec = medianOf(deviations);
  const ratio = medianSec === 0 ? null : madSec / medianSec;
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from MAD)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple MAD wall-time: ${madSec.toFixed(0)} s (~${(madSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s); median ${medianSec.toFixed(0)} s, MAD/median = ${ratio === null ? 'n/a' : ratio.toFixed(2)}${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleMadJson) {
  // Structural JSON analog of --batch-plan-cost-triple-mad (partial-nnn):
  // surface BATCH_PLAN's median absolute deviation of per-triple wall-times as
  // a single object {madSec, madHours, medianSec, ratio, knownCount,
  // unknownCount} so Python / jq offline-worker drivers can consume the
  // outlier-robust dispersion signal directly without re-parsing the one-line
  // shell summary. Pure composition of computeBatchPlanCost() (partial-vv
  // helper) with zero new math, matching the shell form exactly: identical
  // known-row filter (wallSec !== null), identical inner median and
  // deviation-median (unknown-N rows excluded from both stages so nulls cannot
  // corrupt either statistic), identical even/odd midpoint selection at both
  // stages (average of sorted[mid-1] and sorted[mid] when even-count, single
  // sorted[mid] when odd-count), identical ratio = madSec / medianSec with
  // null fallback when medianSec is 0. madHours is precomputed inline as
  // madSec / 3600 (null when knownCount === 0) matching the precomputed-hours
  // cadence established across the whole cost-emitter family
  // (--batch-plan-cost-json, --batch-plan-cost-by-N-json,
  // --batch-plan-cost-max-triple-json, --batch-plan-cost-min-triple-json,
  // --batch-plan-cost-triple-range-json, --batch-plan-cost-triple-mean-json,
  // --batch-plan-cost-triple-median-json, --batch-plan-cost-triple-stddev-json)
  // so drivers never redo the seconds-to-hours conversion per run.
  // All-unknown degenerate case emits {madSec: null, madHours: null,
  // medianSec: null, ratio: null, knownCount: 0, unknownCount} and exits 0
  // without touching the sort, matching the partial-nnn shell
  // graceful-degenerate branch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  // Completes the {shell, JSON} pair for partial-nnn and rounds out the full
  // per-triple statistical surface {min extremum, max extremum,
  // range-with-ratio, arithmetic mean, median, stddev, MAD} x {shell, JSON}.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let madSec = null;
  let medianSec = null;
  let ratio = null;
  if (known.length > 0) {
    const medianOf = (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    };
    const values = known.map((r) => r.wallSec);
    medianSec = medianOf(values);
    const deviations = values.map((v) => Math.abs(v - medianSec));
    madSec = medianOf(deviations);
    ratio = medianSec === 0 ? null : madSec / medianSec;
  }
  const madHours = madSec === null ? null : madSec / 3600;
  const body = {
    madSec,
    madHours,
    medianSec,
    ratio,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleIqr) {
  // Shell data emitter: surface the interquartile range (IQR = Q3 - Q1) of
  // per-triple wall-times across the known-wallSec rows of BATCH_PLAN as a
  // second outlier-robust dispersion view complementary to MAD
  // (--batch-plan-cost-triple-mad, partial-nnn). MAD reports the typical
  // deviation-from-median magnitude; IQR reports the span of the middle 50% of
  // the distribution directly on the wall-time axis. Both are robust against
  // the two N=10000 tail triples that inflate the population stddev
  // (--batch-plan-cost-triple-stddev, partial-lll), but they answer different
  // operator questions: MAD answers "how far does a typical triple sit from
  // the center?", IQR answers "what range contains the middle half of the
  // triples?" -- the latter maps more directly to provisioning a shared-queue
  // worker whose expected completion window is bounded by [Q1, Q3]. Formula:
  // Q1 = median of lower half, Q3 = median of upper half, IQR = Q3 - Q1;
  // halves are split using the exclusive-midpoint rule (Tukey's definition)
  // so for even knownCount the two halves each contain knownCount/2 values
  // and for odd knownCount the middle value is excluded from both halves.
  // Unknown-N rows (wallSec === null) are pre-filtered before splitting so
  // nulls cannot corrupt either quartile. On the current 6-row known set
  // [1400, 2800, 18000, 18000, 72000, 72000] the lower half [1400, 2800,
  // 18000] has Q1 = 2800 s, the upper half [18000, 72000, 72000] has Q3 =
  // 72000 s, and IQR = 69200 s (~19.22 CPU-hours) -- well above the MAD
  // (15900 s / 4.42 h, partial-nnn) because IQR spans Q1-to-Q3 while MAD
  // measures median-symmetric deviation magnitude. Also emits IQR/median as a
  // unit-free spread ratio (robust analog of CoV in partial-lll, sibling of
  // MAD/median in partial-nnn), with a null guard when the median is 0. All-
  // unknown degenerate case prints a dedicated unknown summary and exits 0
  // without touching the sort; knownCount<2 (too few rows to form both halves)
  // is treated as degenerate the same way. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a --batch-plan-cost-triple-iqr-json
  // analog can follow mirroring the shell-first / JSON-second cadence.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length < 2) {
    if (known.length === 0) {
      console.log(
        'imp-917 BATCH_PLAN per-triple IQR wall-time: unknown (all triples have unknown N).',
      );
    } else {
      console.log(
        `imp-917 BATCH_PLAN per-triple IQR wall-time: unknown (only ${known.length} known triple, need at least 2 to form quartiles).`,
      );
    }
    process.exit(0);
  }
  const medianOf = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };
  const sortedValues = known.map((r) => r.wallSec).sort((a, b) => a - b);
  const n = sortedValues.length;
  const half = Math.floor(n / 2);
  const lower = sortedValues.slice(0, half);
  const upper = n % 2 === 0 ? sortedValues.slice(half) : sortedValues.slice(half + 1);
  const q1 = medianOf(lower);
  const q3 = medianOf(upper);
  const iqrSec = q3 - q1;
  const medianSec = medianOf(sortedValues);
  const ratio = medianSec === 0 ? null : iqrSec / medianSec;
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from IQR)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple IQR wall-time: ${iqrSec.toFixed(0)} s (~${(iqrSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s); Q1 ${q1.toFixed(0)} s, Q3 ${q3.toFixed(0)} s, median ${medianSec.toFixed(0)} s, IQR/median = ${ratio === null ? 'n/a' : ratio.toFixed(2)}${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleIqrJson) {
  // Structural JSON analog of --batch-plan-cost-triple-iqr (partial-ppp):
  // surface BATCH_PLAN's interquartile range of per-triple wall-times as a
  // single object {iqrSec, iqrHours, q1Sec, q3Sec, medianSec, ratio,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the robust-dispersion signal directly without re-parsing the
  // one-line shell summary. Pure composition of computeBatchPlanCost()
  // (partial-vv helper) with zero new math, matching the shell form exactly:
  // identical known-row filter (wallSec !== null), identical Tukey
  // exclusive-midpoint half-split (even knownCount splits both halves at
  // knownCount/2, odd knownCount excludes the middle value from both halves),
  // identical inner medianOf() used for Q1, Q3, and overall median, identical
  // ratio = iqrSec / medianSec with null fallback when medianSec is 0.
  // iqrHours is precomputed inline as iqrSec / 3600 (null when knownCount < 2)
  // matching the precomputed-hours cadence established across the whole cost-
  // emitter family (--batch-plan-cost-json, --batch-plan-cost-by-N-json,
  // --batch-plan-cost-max-triple-json, --batch-plan-cost-min-triple-json,
  // --batch-plan-cost-triple-range-json, --batch-plan-cost-triple-mean-json,
  // --batch-plan-cost-triple-median-json, --batch-plan-cost-triple-stddev-json,
  // --batch-plan-cost-triple-mad-json) so drivers never redo the
  // seconds-to-hours conversion per run. Degenerate branches (knownCount < 2,
  // including all-unknown) emit {iqrSec: null, iqrHours: null, q1Sec: null,
  // q3Sec: null, medianSec: (value or null), ratio: null, knownCount,
  // unknownCount} and exit 0 without touching the sort, mirroring the
  // partial-ppp shell graceful-degenerate branch which requires at least 2
  // known triples to form both halves. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Completes the {shell, JSON} pair for partial-ppp and
  // rounds out the full per-triple robust-dispersion surface {MAD, IQR} x
  // {shell, JSON} alongside the parametric {stddev} x {shell, JSON}.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let iqrSec = null;
  let q1Sec = null;
  let q3Sec = null;
  let medianSec = null;
  let ratio = null;
  if (known.length >= 2) {
    const medianOf = (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    };
    const sortedValues = known.map((r) => r.wallSec).sort((a, b) => a - b);
    const n = sortedValues.length;
    const half = Math.floor(n / 2);
    const lower = sortedValues.slice(0, half);
    const upper = n % 2 === 0 ? sortedValues.slice(half) : sortedValues.slice(half + 1);
    q1Sec = medianOf(lower);
    q3Sec = medianOf(upper);
    iqrSec = q3Sec - q1Sec;
    medianSec = medianOf(sortedValues);
    ratio = medianSec === 0 ? null : iqrSec / medianSec;
  } else if (known.length === 1) {
    medianSec = known[0].wallSec;
  }
  const iqrHours = iqrSec === null ? null : iqrSec / 3600;
  const body = {
    iqrSec,
    iqrHours,
    q1Sec,
    q3Sec,
    medianSec,
    ratio,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleVariance) {
  // Shell data emitter: surface the population variance of per-triple wall-
  // times across the known-wallSec rows of BATCH_PLAN as the dimensional
  // second-central-moment sibling to --batch-plan-cost-triple-stddev
  // (partial-lll). Variance (s^2) and stddev (s) carry the same ordering
  // information but different semantics: variance is the quantity that is
  // additive across independent triples (Var(X+Y) = Var(X) + Var(Y) when X, Y
  // are independent), so it is the right metric to propagate when reasoning
  // about the total wall-time of sequentially-composed batches, whereas
  // stddev is the right metric to report alongside the mean on the wall-time
  // axis directly. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new batch-plan logic; unknown-N rows (wallSec === null) are excluded
  // from both the mean and the squared-deviation sum so nulls cannot corrupt
  // the statistic, and unknownCount is reported explicitly in a trailing note.
  // Uses the population formula (divide by knownCount, not knownCount-1)
  // since the 6 triple-runs ARE the full batch -- there is no larger
  // population being sampled. Matches the partial-lll stddev formula exactly
  // (variance is stddev squared when both use the population divisor) so the
  // two flags cannot drift. All-unknown degenerate case prints a dedicated
  // unknown summary and exits 0 without dividing by zero, matching the
  // partial-zz / partial-ddd / partial-hhh / partial-jjj / partial-lll
  // degenerate cadence. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json. Shell-
  // only this partial; a --batch-plan-cost-triple-variance-json analog can
  // follow mirroring the shell-first / JSON-second cadence established
  // across the whole cost-emitter family.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple variance wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const meanSec = known.reduce((s, r) => s + r.wallSec, 0) / known.length;
  const varianceSec2 =
    known.reduce((s, r) => s + (r.wallSec - meanSec) ** 2, 0) / known.length;
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from variance)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple variance wall-time: ${varianceSec2.toFixed(0)} s^2 (~${(varianceSec2 / 3600 / 3600).toFixed(2)} CPU-hours^2) across ${known.length} known triple(s); mean ${meanSec.toFixed(0)} s, sqrt(variance) ${Math.sqrt(varianceSec2).toFixed(0)} s${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleVarianceJson) {
  // Structural JSON analog of --batch-plan-cost-triple-variance (partial-rrr):
  // surface BATCH_PLAN's population variance of per-triple wall-times as a
  // single object {varianceSec2, varianceHours2, meanSec, stddevSec,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the second-central-moment signal directly without re-parsing the
  // one-line shell summary. Pure composition of computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) and identical population divisor (divide by
  // knownCount, not knownCount-1, since the 6 triple-runs ARE the full
  // batch) to the shell form, so the two flags cannot drift. stddevSec is
  // surfaced alongside varianceSec2 as sqrt(varianceSec2) for driver
  // convenience (variance and stddev carry the same ordering information
  // but different dimensional semantics -- variance is additive across
  // independent sequentially-composed batches, stddev is the quantity that
  // shares units with the wall-time mean), so a single JSON body covers
  // both consumers without forcing a second emitter call. varianceHours2
  // is precomputed inline as varianceSec2 / (3600 * 3600) (null when
  // knownCount === 0) matching the precomputed-hours cadence established
  // across the whole cost-emitter family. All-unknown degenerate case emits
  // {varianceSec2: null, varianceHours2: null, meanSec: null, stddevSec:
  // null, knownCount: 0, unknownCount} and exits 0 without dividing by
  // zero, matching the partial-zz / partial-ddd / partial-hhh / partial-jjj
  // / partial-lll / partial-ooo / partial-qqq degenerate cadence. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Completes the {shell, JSON} pair for
  // partial-rrr and rounds out the per-triple dispersion surface
  // {range, stddev, mad, iqr, variance} x {shell, JSON}.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let varianceSec2 = null;
  let meanSec = null;
  let stddevSec = null;
  if (known.length > 0) {
    meanSec = known.reduce((s, r) => s + r.wallSec, 0) / known.length;
    varianceSec2 =
      known.reduce((s, r) => s + (r.wallSec - meanSec) ** 2, 0) / known.length;
    stddevSec = Math.sqrt(varianceSec2);
  }
  const varianceHours2 = varianceSec2 === null ? null : varianceSec2 / (3600 * 3600);
  const body = {
    varianceSec2,
    varianceHours2,
    meanSec,
    stddevSec,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleGeomean) {
  // Shell data emitter: surface the geometric mean of per-triple wall-times
  // across the known-wallSec rows of BATCH_PLAN as a log-space central-
  // tendency sibling to the linear-space --batch-plan-cost-triple-mean
  // (partial-hhh) and the position-based --batch-plan-cost-triple-median
  // (partial-jjj). Where the arithmetic mean answers "what is the typical
  // cost if I add them up?" and the median answers "what is the middle cost
  // sorted by magnitude?", the geometric mean answers "what is the typical
  // cost on a multiplicative scale?" -- computed as exp(mean(ln(wallSec))),
  // it compresses the two N=10000 tail triples (72000 s each) relative to
  // the four smaller triples (<=18000 s) more aggressively than either the
  // arithmetic mean or the median, giving a different operator-facing
  // signal when provisioning workers whose cost ratios (not differences)
  // matter, e.g. deciding whether two triples can share a time-budget
  // multiplier. Reuses computeBatchPlanCost() (partial-vv helper) with zero
  // new batch-plan logic; unknown-N rows (wallSec === null) are excluded
  // from the log-sum so nulls cannot corrupt the statistic, and unknownCount
  // is reported explicitly in a trailing note. Any wallSec <= 0 row in the
  // known set would make the geometric mean collapse to 0 or NaN (since
  // ln(0) = -Infinity and ln(negative) = NaN); the current BATCH_PLAN has
  // no such triples so this is not a concern today, but defensively the
  // handler checks for any known row with wallSec <= 0 and emits an unknown
  // summary to avoid reporting a misleading 0. All-unknown degenerate case
  // prints the dedicated unknown summary and exits 0 without dividing by
  // zero or log-of-zero, matching the partial-zz / partial-ddd /
  // partial-hhh / partial-jjj / partial-lll / partial-nnn / partial-ppp /
  // partial-rrr degenerate cadence. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-geomean-json analog can follow mirroring the
  // shell-first / JSON-second cadence established across the whole
  // cost-emitter family.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0 || known.some((r) => r.wallSec <= 0)) {
    console.log(
      'imp-917 BATCH_PLAN per-triple geomean wall-time: unknown (all triples have unknown N or a known triple has non-positive wallSec).',
    );
    process.exit(0);
  }
  const lnSum = known.reduce((s, r) => s + Math.log(r.wallSec), 0);
  const geomeanSec = Math.exp(lnSum / known.length);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from geomean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple geomean wall-time: ${geomeanSec.toFixed(0)} s (~${(geomeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleGeomeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-geomean (partial-ttt):
  // surface BATCH_PLAN's log-space geometric mean of per-triple wall-times as
  // a single object {geomeanSec, geomeanHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the multiplicative-scale
  // central-tendency signal directly without re-parsing the one-line shell
  // summary. Pure composition of computeBatchPlanCost() (partial-vv helper)
  // with zero new batch-plan logic; identical known-row filter (wallSec !==
  // null) and identical non-positive-guard (any known row with wallSec <= 0
  // would make the geomean collapse to 0 or NaN via log(0) / log(negative))
  // to the shell form, so the two flags cannot drift. geomeanHours is
  // precomputed inline as geomeanSec / 3600 (null when knownCount === 0 or
  // when the non-positive guard fires) matching the precomputed-hours
  // cadence established across the whole cost-emitter family. All-unknown
  // or non-positive-wallSec degenerate case emits {geomeanSec: null,
  // geomeanHours: null, knownCount, unknownCount} and exits 0 without
  // computing log(0), matching the partial-zz / partial-ddd / partial-hhh
  // / partial-jjj / partial-lll / partial-nnn / partial-ppp / partial-rrr
  // / partial-ttt degenerate cadence. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Completes the {shell, JSON} pair for partial-ttt and
  // rounds out the per-triple central-tendency surface
  // {mean, median, geomean} x {shell, JSON}.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let geomeanSec = null;
  if (known.length > 0 && !known.some((r) => r.wallSec <= 0)) {
    const lnSum = known.reduce((s, r) => s + Math.log(r.wallSec), 0);
    geomeanSec = Math.exp(lnSum / known.length);
  }
  const geomeanHours = geomeanSec === null ? null : geomeanSec / 3600;
  const body = {
    geomeanSec,
    geomeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleHarmean) {
  // Shell data emitter: surface the harmonic mean wall-time across the
  // known-wallSec rows of BATCH_PLAN as the third Pythagorean-mean sibling
  // alongside --batch-plan-cost-triple-mean (arithmetic, partial-hhh) and
  // --batch-plan-cost-triple-geomean (geometric, partial-ttt). The harmonic
  // mean H = n / sum(1/x_i) is the reciprocal of the arithmetic mean of
  // reciprocals; it is always bounded above by the geometric mean which is
  // itself bounded above by the arithmetic mean (the AM-GM-HM inequality),
  // so reporting all three gives the operator the full Pythagorean-mean
  // ordering at a glance. The harmonic mean also carries a specific
  // scheduling meaning distinct from arithmetic and geometric forms: when
  // averaging rates (here, per-triple 1/wallSec throughputs), the harmonic
  // mean of wall-times is the wall-time whose reciprocal is the arithmetic
  // mean throughput, which is the right per-triple budget to use if the
  // offline-worker schedule is throughput-bound rather than wall-time-bound.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new batch-
  // plan logic; identical known-row filter (wallSec !== null) and a
  // non-positive-guard (any known row with wallSec <= 0 would make the
  // reciprocal sum diverge via 1/0 or produce a negative harmean via a
  // negative reciprocal) matching the partial-ttt geomean guard. All-unknown
  // or non-positive-wallSec degenerate case prints a dedicated "unknown"
  // summary and exits 0 rather than dividing by zero, matching the partial-
  // hhh / partial-ttt degenerate cadence. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-harmean-json analog can follow mirroring the
  // shell-first / JSON-second cadence established across the whole
  // cost-emitter family.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0 || known.some((r) => r.wallSec <= 0)) {
    console.log(
      'imp-917 BATCH_PLAN per-triple harmonic-mean wall-time: unknown (all triples have unknown N or a known triple has non-positive wallSec).',
    );
    process.exit(0);
  }
  const reciprocalSum = known.reduce((s, r) => s + 1 / r.wallSec, 0);
  const harmeanSec = known.length / reciprocalSum;
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from harmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple harmonic-mean wall-time: ${harmeanSec.toFixed(0)} s (~${(harmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleHarmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-harmean (partial-vvv):
  // surface BATCH_PLAN harmonic mean of per-triple wall-times as a single
  // object {harmeanSec, harmeanHours, knownCount, unknownCount} so Python / jq
  // offline-worker drivers can consume the throughput-bound central-tendency
  // signal directly without re-parsing the one-line shell summary. Pure
  // composition of computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic; identical known-row filter (wallSec !== null) and
  // identical non-positive guard (any known row with wallSec <= 0 would make
  // the reciprocal sum diverge via 1/0 or produce a negative harmean via a
  // negative reciprocal) to the shell form, so the two flags cannot drift.
  // harmeanHours is precomputed inline as harmeanSec / 3600 (null when
  // knownCount === 0 or when the non-positive guard fires) matching the
  // precomputed-hours cadence established across the whole cost-emitter
  // family. All-unknown or non-positive-wallSec degenerate case emits
  // {harmeanSec: null, harmeanHours: null, knownCount, unknownCount} and exits
  // 0 without dividing by zero, matching the partial-ttt / partial-uuu geomean
  // degenerate cadence. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json. Completes
  // the {shell, JSON} pair for partial-vvv and closes the Pythagorean-mean
  // triad {arithmetic, geometric, harmonic} x {shell, JSON} at full parity
  // alongside the symmetric-dispersion {stddev, variance, range} and
  // robust-dispersion {MAD, IQR} surfaces that were already at full parity.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let harmeanSec = null;
  if (known.length > 0 && !known.some((r) => r.wallSec <= 0)) {
    const reciprocalSum = known.reduce((s, r) => s + 1 / r.wallSec, 0);
    harmeanSec = known.length / reciprocalSum;
  }
  const harmeanHours = harmeanSec === null ? null : harmeanSec / 3600;
  const body = {
    harmeanSec,
    harmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuadmean) {
  // Shell data emitter: surface the quadratic mean (root mean square) of
  // per-triple wall-times across the known-wallSec rows of BATCH_PLAN as the
  // fourth power-mean sibling alongside the Pythagorean-mean triad
  // --batch-plan-cost-triple-mean (arithmetic, partial-hhh),
  // --batch-plan-cost-triple-geomean (geometric, partial-ttt) and
  // --batch-plan-cost-triple-harmean (harmonic, partial-vvv). The quadratic
  // mean QM = sqrt(sum(x_i^2) / n) is the power-mean with exponent p=2; by
  // the power-mean inequality it is bounded below by the arithmetic mean for
  // any non-constant positive sample, so the full ordering
  // QM >= AM >= GM >= HM gives the operator the complete spread of Kolmogorov
  // power-means at a glance. RMS is also the natural central-tendency signal
  // when the operator is variance-bound rather than mean-bound: sum(x_i^2)
  // scales with the L2 cost of the batch, so budgeting against RMS instead of
  // AM carries an implicit penalty for long-tail triples already captured in
  // --batch-plan-cost-triple-max-triple (partial-zz) and the dispersion
  // signals (stddev partial-lll, variance partial-rrr). Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic; identical known-row filter (wallSec !== null) to the Pythagorean-
  // mean siblings. Squaring kills the sign so the non-positive-wallSec guard
  // that the harmean handler needed for 1/x is not required here; the only
  // degenerate case is all-unknown (known.length === 0) which prints a
  // dedicated "unknown" summary and exits 0 rather than sqrt(0/0), matching
  // the partial-hhh / partial-ttt / partial-vvv degenerate cadence. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Paired with
  // --batch-plan-cost-triple-quadmean-json (partial-yyy) to complete the
  // {shell, JSON} pair mirroring the shell-first / JSON-second cadence
  // established across the whole cost-emitter family.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quadratic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const squareSum = known.reduce((s, r) => s + r.wallSec * r.wallSec, 0);
  const quadmeanSec = Math.sqrt(squareSum / known.length);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quadmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quadratic-mean wall-time: ${quadmeanSec.toFixed(0)} s (~${(quadmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuadmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-quadmean (partial-xxx):
  // surface BATCH_PLAN quadratic mean (root mean square) of per-triple wall-
  // times as a single object {quadmeanSec, quadmeanHours, knownCount,
  // unknownCount} so Python / jq offline-worker drivers can consume the
  // p=2 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary. Pure composition of computeBatchPlanCost()
  // (partial-vv helper) with zero new batch-plan logic; identical known-row
  // filter (wallSec !== null) to the shell form, so the two flags cannot
  // drift. Squaring kills the sign so no non-positive-wallSec guard is
  // required (mirrors partial-xxx); the only degenerate case is all-unknown
  // (known.length === 0), which emits {quadmeanSec: null, quadmeanHours: null,
  // knownCount, unknownCount} and exits 0 without sqrt(0/0), matching the
  // partial-uuu / partial-www JSON degenerate cadence. quadmeanHours is
  // precomputed inline as quadmeanSec / 3600 (null when knownCount === 0)
  // matching the precomputed-hours cadence established across the whole
  // cost-emitter family. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  // Completes the {shell, JSON} pair for partial-xxx and closes the
  // Kolmogorov power-mean quartet {arithmetic (p=1, partial-hhh/iii),
  // geometric (p=0, partial-ttt/uuu), harmonic (p=-1, partial-vvv/www),
  // quadratic (p=2, partial-xxx/yyy)} x {shell, JSON} at full parity.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quadmeanSec = null;
  if (known.length > 0) {
    const squareSum = known.reduce((s, r) => s + r.wallSec * r.wallSec, 0);
    quadmeanSec = Math.sqrt(squareSum / known.length);
  }
  const quadmeanHours = quadmeanSec === null ? null : quadmeanSec / 3600;
  const body = {
    quadmeanSec,
    quadmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleCubmean) {
  // Shell data emitter: surface the cubic mean (p=3 power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN as the fifth
  // Kolmogorov power-mean sibling, extending the quartet
  // --batch-plan-cost-triple-harmean (p=-1, partial-vvv),
  // --batch-plan-cost-triple-geomean (p=0, partial-ttt),
  // --batch-plan-cost-triple-mean (p=1 arithmetic, partial-hhh) and
  // --batch-plan-cost-triple-quadmean (p=2, partial-xxx) to the quintet
  // {p=-1, p=0, p=1, p=2, p=3}. The cubic mean CM = (sum(x_i^3) / n)^(1/3)
  // is the power-mean with exponent p=3; by the power-mean inequality it
  // dominates the quadratic mean for any non-constant positive sample, so
  // the full ordering CM >= QM >= AM >= GM >= HM gives the operator the
  // complete monotone chain through five power exponents at a glance. CM
  // carries an even stronger long-tail penalty than QM: cubing weights the
  // largest triples 1.5x harder than squaring in log-units, so budgeting
  // against CM makes the L3-cost signature of the longest triple visible
  // without re-running --batch-plan-cost-triple-max-triple (partial-zz).
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new batch-
  // plan logic; identical known-row filter (wallSec !== null) to the
  // p-power-mean siblings. Cubing preserves the sign so the non-positive-
  // wallSec guard that harmean needed for 1/x is not required here; the
  // only degenerate case is all-unknown (known.length === 0) which prints a
  // dedicated "unknown" summary and exits 0 rather than cbrt(0/0), matching
  // the partial-hhh / partial-ttt / partial-vvv / partial-xxx degenerate
  // cadence. Pure data emitter, exit 0 unconditionally (no validation
  // gate), not wired into --preflight / --preflight-json. Paired with
  // --batch-plan-cost-triple-cubmean-json to complete the {shell, JSON} pair
  // mirroring the shell-first / JSON-second cadence established across the
  // whole cost-emitter family.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple cubic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const cubeSum = known.reduce((s, r) => s + r.wallSec * r.wallSec * r.wallSec, 0);
  const cubmeanSec = Math.cbrt(cubeSum / known.length);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from cubmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple cubic-mean wall-time: ${cubmeanSec.toFixed(0)} s (~${(cubmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleCubmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-cubmean (partial-zzz):
  // surface BATCH_PLAN cubic mean (p=3 power-mean) of per-triple wall-times as
  // a single object {cubmeanSec, cubmeanHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the p=3 power-mean central-
  // tendency signal directly without re-parsing the one-line shell summary.
  // Pure composition of computeBatchPlanCost() (partial-vv helper) with zero
  // new batch-plan logic; identical known-row filter (wallSec !== null) to the
  // shell form, so the two flags cannot drift. Cubing preserves the sign so
  // no non-positive-wallSec guard is required (mirrors partial-zzz / partial-
  // xxx / partial-yyy); the only degenerate case is all-unknown
  // (known.length === 0), which emits {cubmeanSec: null, cubmeanHours: null,
  // knownCount, unknownCount} and exits 0 without cbrt(0/0), matching the
  // partial-uuu / partial-www / partial-yyy JSON degenerate cadence.
  // cubmeanHours is precomputed inline as cubmeanSec / 3600 (null when
  // knownCount === 0) matching the precomputed-hours cadence established
  // across the whole cost-emitter family. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Completes the {shell, JSON} pair for partial-zzz and
  // closes the Kolmogorov power-mean quintet {harmonic (p=-1, partial-vvv/
  // www), geometric (p=0, partial-ttt/uuu), arithmetic (p=1, partial-hhh/
  // iii), quadratic (p=2, partial-xxx/yyy), cubic (p=3, partial-zzz/THIS)}
  // x {shell, JSON} at full parity, completing the monotone power-mean chain
  // CM >= QM >= AM >= GM >= HM at structural-JSON parity for offline-worker
  // drivers gating the ~20 CPU-hour batch.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let cubmeanSec = null;
  if (known.length > 0) {
    const cubeSum = known.reduce((s, r) => s + r.wallSec * r.wallSec * r.wallSec, 0);
    cubmeanSec = Math.cbrt(cubeSum / known.length);
  }
  const cubmeanHours = cubmeanSec === null ? null : cubmeanSec / 3600;
  const body = {
    cubmeanSec,
    cubmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuartmean) {
  // Shell data emitter: surface the quartic mean (p=4 power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN as the sixth
  // Kolmogorov power-mean sibling, extending the quintet
  // --batch-plan-cost-triple-harmean (p=-1, partial-vvv),
  // --batch-plan-cost-triple-geomean (p=0, partial-ttt),
  // --batch-plan-cost-triple-mean (p=1 arithmetic, partial-hhh),
  // --batch-plan-cost-triple-quadmean (p=2, partial-xxx) and
  // --batch-plan-cost-triple-cubmean (p=3, partial-zzz) to the sextet
  // {p=-1, p=0, p=1, p=2, p=3, p=4}. The quartic mean
  // QUM = (sum(x_i^4) / n)^(1/4) is the power-mean with exponent p=4; by the
  // generalized power-mean inequality it dominates the cubic mean for any
  // non-constant positive sample, so the full ordering
  // QUM >= CM >= QM >= AM >= GM >= HM now holds inline across all six
  // emitters. QUM carries an even stronger long-tail penalty than CM: the
  // fourth-power sum weights the largest triples 2x harder than squaring in
  // log-units, so budgeting against QUM makes the L4-cost signature of the
  // longest triple visible, aligning the central-tendency axis with any
  // fourth-moment / kurtosis-adjacent dispersion signal an operator might add
  // later without re-running --batch-plan-cost-triple-max-triple (partial-zz).
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new batch-
  // plan logic; identical known-row filter (wallSec !== null) to the p-power-
  // mean siblings. Fourth-power preserves non-negativity so the non-positive-
  // wallSec guard that harmean needed for 1/x is not required here; the only
  // degenerate case is all-unknown (known.length === 0) which prints a
  // dedicated "unknown" summary and exits 0 rather than (0/0)^(1/4) = NaN,
  // matching the partial-hhh / partial-ttt / partial-vvv / partial-xxx /
  // partial-zzz degenerate cadence. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; a --batch-plan-cost-triple-quartmean-json analog
  // can follow as partial-cccc to close the {shell, JSON} pair on this
  // fourteenth per-triple statistical view, mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter axis.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quartic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quartSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    return s + w2 * w2;
  }, 0);
  const quartmeanSec = Math.pow(quartSum / known.length, 1 / 4);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quartmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quartic-mean wall-time: ${quartmeanSec.toFixed(0)} s (~${(quartmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuartmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-quartmean (partial-bbbb):
  // surface BATCH_PLAN quartic mean (p=4 Kolmogorov power-mean) of per-triple
  // wall-times as a single object {quartmeanSec, quartmeanHours, knownCount,
  // unknownCount} so Python / jq offline-worker drivers can consume the p=4
  // power-mean central-tendency signal directly without re-parsing the one-line
  // shell summary. Reuses computeBatchPlanCost() (partial-vv helper) with zero
  // new math; identical known-row filter (wallSec !== null) to the shell form
  // so the two flags cannot drift, and the same no-guard-required observation
  // (fourth-power preserves non-negativity, mirroring partial-yyy quadmean and
  // partial-aaaa cubmean) so a non-positive-wallSec guard is unnecessary.
  // quartmeanHours precomputed inline as quartmeanSec / 3600 (null when
  // knownCount === 0) matching the partial-ww / partial-zz / partial-bbb /
  // partial-eee / partial-ggg / partial-iii / partial-kkk / partial-mmm /
  // partial-ooo / partial-qqq / partial-sss / partial-uuu / partial-www /
  // partial-yyy / partial-aaaa precomputed-hours cadence so offline-worker
  // drivers consuming the p=4 power-mean signal do not need to redo the
  // seconds-to-hours conversion per run. All-unknown degenerate case emits
  // {quartmeanSec: null, quartmeanHours: null, knownCount: 0, unknownCount}
  // and exits 0 without computing (0/0)^(1/4), matching the partial-uuu /
  // partial-www / partial-yyy / partial-aaaa JSON degenerate cadence. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Completes the {shell, JSON} pair for
  // partial-bbbb and brings the Kolmogorov power-mean sextet {harmonic
  // (p=-1, partial-vvv/www), geometric (p=0, partial-ttt/uuu), arithmetic
  // (p=1, partial-hhh/iii), quadratic (p=2, partial-xxx/yyy), cubic (p=3,
  // partial-zzz/aaaa), quartic (p=4, partial-bbbb/THIS)} x {shell, JSON} to
  // full parity, surfacing the complete monotone power-mean ordering
  // QUM >= CM >= QM >= AM >= GM >= HM at structural-JSON parity for offline-
  // worker drivers gating the ~20 CPU-hour batch.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quartmeanSec = null;
  if (known.length > 0) {
    const quartSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      return s + w2 * w2;
    }, 0);
    quartmeanSec = Math.pow(quartSum / known.length, 1 / 4);
  }
  const quartmeanHours = quartmeanSec === null ? null : quartmeanSec / 3600;
  const body = {
    quartmeanSec,
    quartmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuintmean) {
  // Shell data emitter: surface the quintic mean (p=5 power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN as the seventh
  // Kolmogorov power-mean sibling, extending the sextet
  // --batch-plan-cost-triple-harmean (p=-1, partial-vvv),
  // --batch-plan-cost-triple-geomean (p=0, partial-ttt),
  // --batch-plan-cost-triple-mean (p=1 arithmetic, partial-hhh),
  // --batch-plan-cost-triple-quadmean (p=2, partial-xxx),
  // --batch-plan-cost-triple-cubmean (p=3, partial-zzz) and
  // --batch-plan-cost-triple-quartmean (p=4, partial-bbbb) to the septet
  // {p=-1, p=0, p=1, p=2, p=3, p=4, p=5}. The quintic mean
  // QIM = (sum(x_i^5) / n)^(1/5) is the power-mean with exponent p=5; by the
  // generalized power-mean inequality it dominates the quartic mean for any
  // non-constant positive sample, so the full ordering
  // QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline across all seven
  // emitters. QIM carries the strongest long-tail penalty yet: the fifth-power
  // sum weights the largest triples ~2.5x harder than fourth-power in
  // log-units, so budgeting against QIM makes the L5-cost signature of the
  // longest triple visible, aligning the central-tendency axis with any
  // fifth-moment / tail-weighted dispersion signal an operator might add later
  // without re-running --batch-plan-cost-triple-max-triple (partial-zz).
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new batch-
  // plan logic; identical known-row filter (wallSec !== null) to the p-power-
  // mean siblings. Odd-exponent fifth power preserves the sign of the input
  // but since all wallSec values are strictly positive (non-null rows carry
  // measured runtimes > 0), sign preservation is not a concern here; the
  // non-positive-wallSec guard that harmean needed for 1/x is not required.
  // The only degenerate case is all-unknown (known.length === 0) which prints
  // a dedicated "unknown" summary and exits 0 rather than (0/0)^(1/5) = NaN,
  // matching the partial-hhh / partial-ttt / partial-vvv / partial-xxx /
  // partial-zzz / partial-bbbb degenerate cadence. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-quintmean-json analog can follow to close the
  // {shell, JSON} pair on this fifteenth per-triple statistical view,
  // mirroring the shell-first / JSON-second cadence established across every
  // other cost-emitter axis.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    return s + w4 * r.wallSec;
  }, 0);
  const quintmeanSec = Math.pow(quintSum / known.length, 1 / 5);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quintic-mean wall-time: ${quintmeanSec.toFixed(0)} s (~${(quintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuintmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-quintmean (partial-dddd):
  // surface the BATCH_PLAN quintic mean (p=5 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {quintmeanSec, quintmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the p=5 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the shell form so the two flags cannot drift.
  // Since all non-null wallSec values are strictly positive, the odd-exponent
  // fifth power preserves positivity and the non-positive-wallSec guard that
  // harmean needed for 1/x is unnecessary (matching the partial-aaaa cubmean
  // shell/JSON observation on odd-exponent p=3). quintmeanHours precomputed
  // inline as quintmeanSec / 3600 (null when knownCount === 0) matching the
  // partial-ww / partial-zz / partial-bbb / partial-eee / partial-ggg /
  // partial-iii / partial-kkk / partial-mmm / partial-ooo / partial-qqq /
  // partial-sss / partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc precomputed-hours cadence so offline-worker drivers
  // consuming the p=5 power-mean signal do not need to redo the seconds-to-
  // hours conversion per run. All-unknown degenerate case emits
  // {quintmeanSec: null, quintmeanHours: null, knownCount: 0, unknownCount}
  // and exits 0 without computing (0/0)^(1/5), matching the partial-uuu /
  // partial-www / partial-yyy / partial-aaaa / partial-cccc JSON degenerate
  // cadence. Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Completes the {shell,
  // JSON} pair for partial-dddd and brings the Kolmogorov power-mean septet
  // {harmonic (p=-1, partial-vvv/www), geometric (p=0, partial-ttt/uuu),
  // arithmetic (p=1, partial-hhh/iii), quadratic (p=2, partial-xxx/yyy),
  // cubic (p=3, partial-zzz/aaaa), quartic (p=4, partial-bbbb/cccc), quintic
  // (p=5, partial-dddd/THIS)} x {shell, JSON} to full parity, surfacing the
  // complete monotone power-mean ordering QIM >= QUM >= CM >= QM >= AM >= GM
  // >= HM at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quintmeanSec = null;
  if (known.length > 0) {
    const quintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      return s + w4 * r.wallSec;
    }, 0);
    quintmeanSec = Math.pow(quintSum / known.length, 1 / 5);
  }
  const quintmeanHours = quintmeanSec === null ? null : quintmeanSec / 3600;
  const body = {
    quintmeanSec,
    quintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSextmean) {
  // Shell data emitter: surface the sextic mean (p=6 power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN as the eighth
  // Kolmogorov power-mean sibling, extending the septet
  // --batch-plan-cost-triple-harmean (p=-1, partial-vvv),
  // --batch-plan-cost-triple-geomean (p=0, partial-ttt),
  // --batch-plan-cost-triple-mean (p=1 arithmetic, partial-hhh),
  // --batch-plan-cost-triple-quadmean (p=2, partial-xxx),
  // --batch-plan-cost-triple-cubmean (p=3, partial-zzz),
  // --batch-plan-cost-triple-quartmean (p=4, partial-bbbb) and
  // --batch-plan-cost-triple-quintmean (p=5, partial-dddd) to the octet
  // {p=-1, p=0, p=1, p=2, p=3, p=4, p=5, p=6}. The sextic mean
  // SXM = (sum(x_i^6) / n)^(1/6) is the power-mean with exponent p=6; by the
  // generalized power-mean inequality it dominates the quintic mean for any
  // non-constant positive sample, so the full ordering
  // SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline across
  // all eight emitters. SXM carries the strongest long-tail penalty yet: the
  // sixth-power sum weights the largest triples ~3x harder than fifth-power
  // in log-units, so budgeting against SXM makes the L6-cost signature of the
  // longest triple visible, aligning the central-tendency axis with any
  // sixth-moment / heavy-tail dispersion signal an operator might add later
  // without re-running --batch-plan-cost-triple-max-triple (partial-zz).
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new batch-
  // plan logic; identical known-row filter (wallSec !== null) to the power-
  // mean siblings. Even-exponent sixth power forces non-negativity so
  // sum(x^6) is always defined for any real wallSec (mirroring the
  // partial-xxx / partial-bbbb observation on even-p), and since all
  // wallSec values are strictly positive by construction the non-positive-
  // wallSec guard that harmean needed for 1/x is unnecessary. The only
  // degenerate case is all-unknown (known.length === 0) which prints a
  // dedicated "unknown" summary and exits 0 rather than (0/0)^(1/6) = NaN,
  // matching the partial-hhh / partial-ttt / partial-vvv / partial-xxx /
  // partial-zzz / partial-bbbb / partial-dddd degenerate cadence. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-sextmean-json analog can follow to close the
  // {shell, JSON} pair on this sixteenth per-triple statistical view,
  // mirroring the shell-first / JSON-second cadence established across every
  // other cost-emitter axis. Numerical stability: uses the (x^2)^3
  // factorization (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // sextSum += w4 * w2;) to avoid calling Math.pow in the inner reduce loop,
  // matching the partial-xxx / partial-bbbb / partial-dddd inline-multiply
  // cadence that produces the same bit-pattern on IEEE-754 across Node
  // versions.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple sextic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sextSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    return s + w4 * w2;
  }, 0);
  const sextmeanSec = Math.pow(sextSum / known.length, 1 / 6);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from sextmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple sextic-mean wall-time: ${sextmeanSec.toFixed(0)} s (~${(sextmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSextmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-sextmean (partial-ffff):
  // surface the BATCH_PLAN sextic mean (p=6 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {sextmeanSec, sextmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the p=6 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the shell form so the two flags cannot drift.
  // Even-exponent sixth power forces non-negativity so sum(x^6) is always
  // defined for any real wallSec (mirroring the partial-xxx / partial-bbbb /
  // partial-dddd observation on even-p), and since all wallSec values are
  // strictly positive by construction the non-positive-wallSec guard that
  // harmean needed for 1/x is unnecessary. sextmeanHours precomputed inline
  // as sextmeanSec / 3600 (null when knownCount === 0) matching the
  // partial-ww / partial-zz / partial-bbb / partial-eee / partial-ggg /
  // partial-iii / partial-kkk / partial-mmm / partial-ooo / partial-qqq /
  // partial-sss / partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc / partial-eeee precomputed-hours cadence so offline-worker
  // drivers consuming the p=6 power-mean signal do not need to redo the
  // seconds-to-hours conversion per run. All-unknown degenerate case emits
  // {sextmeanSec: null, sextmeanHours: null, knownCount: 0, unknownCount}
  // and exits 0 without computing (0/0)^(1/6), matching the partial-uuu /
  // partial-www / partial-yyy / partial-aaaa / partial-cccc / partial-eeee
  // JSON degenerate cadence. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  // Completes the {shell, JSON} pair for partial-ffff and brings the
  // Kolmogorov power-mean octet {harmonic (p=-1, partial-vvv/www), geometric
  // (p=0, partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii), quadratic
  // (p=2, partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic (p=4,
  // partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/THIS)} x {shell, JSON} to full parity, surfacing the
  // complete monotone power-mean ordering SXM >= QIM >= QUM >= CM >= QM >=
  // AM >= GM >= HM at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Numerical stability: uses the (x^2)^3
  // factorization (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // sextSum += w4 * w2;) to avoid calling Math.pow in the inner reduce loop,
  // matching the partial-ffff inline-multiply cadence that produces the same
  // bit-pattern on IEEE-754 across Node versions.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let sextmeanSec = null;
  if (known.length > 0) {
    const sextSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      return s + w4 * w2;
    }, 0);
    sextmeanSec = Math.pow(sextSum / known.length, 1 / 6);
  }
  const sextmeanHours = sextmeanSec === null ? null : sextmeanSec / 3600;
  const body = {
    sextmeanSec,
    sextmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSeptmean) {
  // Shell data emitter: surface the septic mean (p=7 power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN as the ninth
  // Kolmogorov power-mean sibling, extending the octet
  // --batch-plan-cost-triple-harmean (p=-1, partial-vvv),
  // --batch-plan-cost-triple-geomean (p=0, partial-ttt),
  // --batch-plan-cost-triple-mean (p=1 arithmetic, partial-hhh),
  // --batch-plan-cost-triple-quadmean (p=2, partial-xxx),
  // --batch-plan-cost-triple-cubmean (p=3, partial-zzz),
  // --batch-plan-cost-triple-quartmean (p=4, partial-bbbb),
  // --batch-plan-cost-triple-quintmean (p=5, partial-dddd) and
  // --batch-plan-cost-triple-sextmean (p=6, partial-ffff) to the nonet
  // {p=-1, p=0, p=1, p=2, p=3, p=4, p=5, p=6, p=7}. The septic mean
  // SPM = (sum(x_i^7) / n)^(1/7) is the power-mean with exponent p=7; by the
  // generalized power-mean inequality it dominates the sextic mean for any
  // non-constant positive sample, so the full ordering
  // SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline
  // across all nine emitters. SPM carries the strongest long-tail penalty yet:
  // the seventh-power sum weights the largest triples ~3.5x harder than
  // sixth-power in log-units, so budgeting against SPM makes the L7-cost
  // signature of the longest triple visible, aligning the central-tendency
  // axis with any seventh-moment / heavy-tail dispersion signal an operator
  // might add later without re-running --batch-plan-cost-triple-max-triple
  // (partial-zz). Reuses computeBatchPlanCost() (partial-vv helper) with zero
  // new batch-plan logic; identical known-row filter (wallSec !== null) to
  // the power-mean siblings. Odd-exponent seventh power preserves the sign
  // of the input but since all wallSec values are strictly positive (non-null
  // rows carry measured runtimes > 0), sign preservation is not a concern
  // here; the non-positive-wallSec guard that harmean needed for 1/x is not
  // required (matching the partial-aaaa cubmean and partial-eeee quintmean
  // odd-exponent observation). The only degenerate case is all-unknown
  // (known.length === 0) which prints a dedicated "unknown" summary and exits
  // 0 rather than (0/0)^(1/7) = NaN, matching the partial-hhh / partial-ttt /
  // partial-vvv / partial-xxx / partial-zzz / partial-bbbb / partial-dddd /
  // partial-ffff degenerate cadence. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; a --batch-plan-cost-triple-septmean-json analog
  // can follow to close the {shell, JSON} pair on this seventeenth per-triple
  // statistical view, mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Numerical stability:
  // uses the (x^2)^3 * x factorization (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; septSum += w4 * w2 * r.wallSec;) to avoid calling
  // Math.pow in the inner reduce loop, matching the partial-dddd quintmean
  // inline-multiply cadence that produces the same bit-pattern on IEEE-754
  // across Node versions.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple septic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const septSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    return s + w4 * w2 * r.wallSec;
  }, 0);
  const septmeanSec = Math.pow(septSum / known.length, 1 / 7);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from septmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple septic-mean wall-time: ${septmeanSec.toFixed(0)} s (~${(septmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
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
