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
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-decmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-decmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-undecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-undecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duodecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duodecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tredecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tredecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuordecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuordecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quindecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quindecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sedecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sedecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septendecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septendecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octodecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octodecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novendecmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novendecmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-vigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-vigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unvigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unvigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duovigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duovigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresvigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresvigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorvigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorvigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinvigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinvigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexvigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexvigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenvigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenvigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octovigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octovigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemvigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemvigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-trigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-trigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-untrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-untrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duotrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duotrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tritrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tritrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tetratrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tetratrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-pentatrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-pentatrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-hexatrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-hexatrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-heptatrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-heptatrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octotrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octotrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonatrigintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonatrigintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquadragintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquadragintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquinquagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquinquagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unsexagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unsexagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duosexagintmean
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duosexagintmean-json
//   node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tressexagintmean
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
    else if (a === '--batch-plan-cost-triple-septmean-json') out.batchPlanCostTripleSeptmeanJson = true;
    else if (a === '--batch-plan-cost-triple-octmean') out.batchPlanCostTripleOctmean = true;
    else if (a === '--batch-plan-cost-triple-octmean-json') out.batchPlanCostTripleOctmeanJson = true;
    else if (a === '--batch-plan-cost-triple-nonmean') out.batchPlanCostTripleNonmean = true;
    else if (a === '--batch-plan-cost-triple-nonmean-json') out.batchPlanCostTripleNonmeanJson = true;
    else if (a === '--batch-plan-cost-triple-decmean') out.batchPlanCostTripleDecmean = true;
    else if (a === '--batch-plan-cost-triple-decmean-json') out.batchPlanCostTripleDecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-undecmean') out.batchPlanCostTripleUndecmean = true;
    else if (a === '--batch-plan-cost-triple-undecmean-json') out.batchPlanCostTripleUndecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-duodecmean') out.batchPlanCostTripleDuodecmean = true;
    else if (a === '--batch-plan-cost-triple-duodecmean-json') out.batchPlanCostTripleDuodecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-tredecmean') out.batchPlanCostTripleTredecmean = true;
    else if (a === '--batch-plan-cost-triple-tredecmean-json') out.batchPlanCostTripleTredecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quattuordecmean') out.batchPlanCostTripleQuattuordecmean = true;
    else if (a === '--batch-plan-cost-triple-quattuordecmean-json') out.batchPlanCostTripleQuattuordecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quindecmean') out.batchPlanCostTripleQuindecmean = true;
    else if (a === '--batch-plan-cost-triple-quindecmean-json') out.batchPlanCostTripleQuindecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-sedecmean') out.batchPlanCostTripleSedecmean = true;
    else if (a === '--batch-plan-cost-triple-sedecmean-json') out.batchPlanCostTripleSedecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-septendecmean') out.batchPlanCostTripleSeptendecmean = true;
    else if (a === '--batch-plan-cost-triple-septendecmean-json') out.batchPlanCostTripleSeptendecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-octodecmean') out.batchPlanCostTripleOctodecmean = true;
    else if (a === '--batch-plan-cost-triple-octodecmean-json') out.batchPlanCostTripleOctodecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-novendecmean') out.batchPlanCostTripleNovendecmean = true;
    else if (a === '--batch-plan-cost-triple-novendecmean-json') out.batchPlanCostTripleNovendecmeanJson = true;
    else if (a === '--batch-plan-cost-triple-vigintmean') out.batchPlanCostTripleVigintmean = true;
    else if (a === '--batch-plan-cost-triple-vigintmean-json') out.batchPlanCostTripleVigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-unvigintmean') out.batchPlanCostTripleUnvigintmean = true;
    else if (a === '--batch-plan-cost-triple-unvigintmean-json') out.batchPlanCostTripleUnvigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-duovigintmean') out.batchPlanCostTripleDuovigintmean = true;
    else if (a === '--batch-plan-cost-triple-duovigintmean-json') out.batchPlanCostTripleDuovigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-tresvigintmean') out.batchPlanCostTripleTresvigintmean = true;
    else if (a === '--batch-plan-cost-triple-tresvigintmean-json') out.batchPlanCostTripleTresvigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quattuorvigintmean') out.batchPlanCostTripleQuattuorvigintmean = true;
    else if (a === '--batch-plan-cost-triple-quattuorvigintmean-json') out.batchPlanCostTripleQuattuorvigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quinvigintmean') out.batchPlanCostTripleQuinvigintmean = true;
    else if (a === '--batch-plan-cost-triple-quinvigintmean-json') out.batchPlanCostTripleQuinvigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-sexvigintmean') out.batchPlanCostTripleSexvigintmean = true;
    else if (a === '--batch-plan-cost-triple-sexvigintmean-json') out.batchPlanCostTripleSexvigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-septenvigintmean') out.batchPlanCostTripleSeptenvigintmean = true;
    else if (a === '--batch-plan-cost-triple-septenvigintmean-json') out.batchPlanCostTripleSeptenvigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-octovigintmean') out.batchPlanCostTripleOctovigintmean = true;
    else if (a === '--batch-plan-cost-triple-octovigintmean-json') out.batchPlanCostTripleOctovigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-novemvigintmean') out.batchPlanCostTripleNovemvigintmean = true;
    else if (a === '--batch-plan-cost-triple-novemvigintmean-json') out.batchPlanCostTripleNovemvigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-trigintmean') out.batchPlanCostTripleTrigintmean = true;
    else if (a === '--batch-plan-cost-triple-trigintmean-json') out.batchPlanCostTripleTrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-untrigintmean') out.batchPlanCostTripleUntrigintmean = true;
    else if (a === '--batch-plan-cost-triple-untrigintmean-json') out.batchPlanCostTripleUntrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-duotrigintmean') out.batchPlanCostTripleDuotrigintmean = true;
    else if (a === '--batch-plan-cost-triple-duotrigintmean-json') out.batchPlanCostTripleDuotrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-tritrigintmean') out.batchPlanCostTripleTritrigintmean = true;
    else if (a === '--batch-plan-cost-triple-tritrigintmean-json') out.batchPlanCostTripleTritrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-tetratrigintmean') out.batchPlanCostTripleTetratrigintmean = true;
    else if (a === '--batch-plan-cost-triple-tetratrigintmean-json') out.batchPlanCostTripleTetratrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-pentatrigintmean') out.batchPlanCostTriplePentatrigintmean = true;
    else if (a === '--batch-plan-cost-triple-pentatrigintmean-json') out.batchPlanCostTriplePentatrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-hexatrigintmean') out.batchPlanCostTripleHexatrigintmean = true;
    else if (a === '--batch-plan-cost-triple-hexatrigintmean-json') out.batchPlanCostTripleHexatrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-heptatrigintmean') out.batchPlanCostTripleHeptatrigintmean = true;
    else if (a === '--batch-plan-cost-triple-heptatrigintmean-json') out.batchPlanCostTripleHeptatrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-octotrigintmean') out.batchPlanCostTripleOctotrigintmean = true;
    else if (a === '--batch-plan-cost-triple-octotrigintmean-json') out.batchPlanCostTripleOctotrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-nonatrigintmean') out.batchPlanCostTripleNonatrigintmean = true;
    else if (a === '--batch-plan-cost-triple-nonatrigintmean-json') out.batchPlanCostTripleNonatrigintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quadragintmean') out.batchPlanCostTripleQuadragintmean = true;
    else if (a === '--batch-plan-cost-triple-quadragintmean-json') out.batchPlanCostTripleQuadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-unquadragintmean') out.batchPlanCostTripleUnquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-unquadragintmean-json') out.batchPlanCostTripleUnquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-duoquadragintmean') out.batchPlanCostTripleDuoquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-duoquadragintmean-json') out.batchPlanCostTripleDuoquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-tresquadragintmean') out.batchPlanCostTripleTresquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-tresquadragintmean-json') out.batchPlanCostTripleTresquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quattuorquadragintmean') out.batchPlanCostTripleQuattuorquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-quattuorquadragintmean-json') out.batchPlanCostTripleQuattuorquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quinquequadragintmean') out.batchPlanCostTripleQuinquequadragintmean = true;
    else if (a === '--batch-plan-cost-triple-quinquequadragintmean-json') out.batchPlanCostTripleQuinquequadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-sexquadragintmean') out.batchPlanCostTripleSexquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-sexquadragintmean-json') out.batchPlanCostTripleSexquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-septenquadragintmean') out.batchPlanCostTripleSeptenquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-septenquadragintmean-json') out.batchPlanCostTripleSeptenquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-octoquadragintmean') out.batchPlanCostTripleOctoquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-octoquadragintmean-json') out.batchPlanCostTripleOctoquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-novemquadragintmean') out.batchPlanCostTripleNovemquadragintmean = true;
    else if (a === '--batch-plan-cost-triple-novemquadragintmean-json') out.batchPlanCostTripleNovemquadragintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quinquagintmean') out.batchPlanCostTripleQuinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-quinquagintmean-json') out.batchPlanCostTripleQuinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-unquinquagintmean') out.batchPlanCostTripleUnquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-unquinquagintmean-json') out.batchPlanCostTripleUnquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-duoquinquagintmean') out.batchPlanCostTripleDuoquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-duoquinquagintmean-json') out.batchPlanCostTripleDuoquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-tresquinquagintmean') out.batchPlanCostTripleTresquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-tresquinquagintmean-json') out.batchPlanCostTripleTresquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quattuorquinquagintmean') out.batchPlanCostTripleQuattuorquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-quattuorquinquagintmean-json') out.batchPlanCostTripleQuattuorquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-quinquequinquagintmean') out.batchPlanCostTripleQuinquequinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-quinquequinquagintmean-json') out.batchPlanCostTripleQuinquequinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-sexquinquagintmean') out.batchPlanCostTripleSexquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-sexquinquagintmean-json') out.batchPlanCostTripleSexquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-septenquinquagintmean') out.batchPlanCostTripleSeptenquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-septenquinquagintmean-json') out.batchPlanCostTripleSeptenquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-octoquinquagintmean') out.batchPlanCostTripleOctoquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-octoquinquagintmean-json') out.batchPlanCostTripleOctoquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-novemquinquagintmean') out.batchPlanCostTripleNovemquinquagintmean = true;
    else if (a === '--batch-plan-cost-triple-novemquinquagintmean-json') out.batchPlanCostTripleNovemquinquagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-sexagintmean') out.batchPlanCostTripleSexagintmean = true;
    else if (a === '--batch-plan-cost-triple-sexagintmean-json') out.batchPlanCostTripleSexagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-unsexagintmean') out.batchPlanCostTripleUnsexagintmean = true;
    else if (a === '--batch-plan-cost-triple-unsexagintmean-json') out.batchPlanCostTripleUnsexagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-duosexagintmean') out.batchPlanCostTripleDuosexagintmean = true;
    else if (a === '--batch-plan-cost-triple-duosexagintmean-json') out.batchPlanCostTripleDuosexagintmeanJson = true;
    else if (a === '--batch-plan-cost-triple-tressexagintmean') out.batchPlanCostTripleTressexagintmean = true;
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
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-decmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-decmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-undecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-undecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duodecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duodecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tredecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tredecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuordecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuordecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quindecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quindecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sedecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sedecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septendecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septendecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octodecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octodecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novendecmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novendecmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-vigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-vigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unvigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unvigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duovigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duovigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresvigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresvigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorvigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorvigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinvigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinvigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexvigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexvigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenvigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenvigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octovigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octovigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemvigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemvigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-trigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-trigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-untrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-untrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duotrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duotrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tritrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tritrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tetratrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tetratrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-pentatrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-pentatrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-hexatrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-hexatrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-heptatrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-heptatrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octotrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octotrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonatrigintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-nonatrigintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquadragintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquadragintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duoquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tresquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quattuorquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-quinquequinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-septenquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-octoquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquinquagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-novemquinquagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-sexagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unsexagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-unsexagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duosexagintmean\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-duosexagintmean-json\n' +
          '       node scripts/imp-917-run-cell.mjs --batch-plan-cost-triple-tressexagintmean\n' +
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

if (args.batchPlanCostTripleSeptmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-septmean (partial-hhhh):
  // surface the BATCH_PLAN septic mean (p=7 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {septmeanSec, septmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the p=7 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the shell form so the two flags cannot drift.
  // Odd-exponent seventh power preserves the sign of the input but since
  // all wallSec values are strictly positive by construction the non-
  // positive-wallSec guard that harmean needed for 1/x is unnecessary
  // (matching the partial-aaaa cubmean-json and partial-eeee quintmean-json
  // odd-exponent JSON observation). septmeanHours precomputed inline as
  // septmeanSec / 3600 (null when knownCount === 0) matching the
  // partial-ww / partial-zz / partial-bbb / partial-eee / partial-ggg /
  // partial-iii / partial-kkk / partial-mmm / partial-ooo / partial-qqq /
  // partial-sss / partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc / partial-eeee / partial-gggg precomputed-hours cadence so
  // offline-worker drivers consuming the p=7 power-mean signal do not need
  // to redo the seconds-to-hours conversion per run. All-unknown degenerate
  // case emits {septmeanSec: null, septmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without computing (0/0)^(1/7) = NaN, matching
  // the partial-uuu / partial-www / partial-yyy / partial-aaaa / partial-cccc
  // / partial-eeee / partial-gggg JSON degenerate cadence. Pure data emitter,
  // exit 0 unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Completes the {shell, JSON} pair for partial-hhhh and
  // brings the Kolmogorov power-mean nonet {harmonic (p=-1, partial-vvv/www),
  // geometric (p=0, partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii),
  // quadratic (p=2, partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic
  // (p=4, partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/gggg), septic (p=7, partial-hhhh/THIS)} x {shell, JSON} to
  // full parity, surfacing the complete monotone power-mean ordering
  // SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM at structural-JSON
  // parity for offline-worker drivers gating the ~20 CPU-hour batch.
  // Numerical stability: uses the (x^2)^3 * x factorization (const w2 =
  // r.wallSec * r.wallSec; const w4 = w2 * w2; septSum += w4 * w2 *
  // r.wallSec;) to avoid calling Math.pow in the inner reduce loop, matching
  // the partial-hhhh shell-form inline-multiply cadence that produces the
  // same bit-pattern on IEEE-754 across Node versions.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let septmeanSec = null;
  if (known.length > 0) {
    const septSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      return s + w4 * w2 * r.wallSec;
    }, 0);
    septmeanSec = Math.pow(septSum / known.length, 1 / 7);
  }
  const septmeanHours = septmeanSec === null ? null : septmeanSec / 3600;
  const body = {
    septmeanSec,
    septmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleOctmean) {
  // Shell data emitter: surface the octic mean (p=8 power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN as the tenth
  // Kolmogorov power-mean sibling, extending the nonet
  // --batch-plan-cost-triple-harmean (p=-1, partial-vvv),
  // --batch-plan-cost-triple-geomean (p=0, partial-ttt),
  // --batch-plan-cost-triple-mean (p=1 arithmetic, partial-hhh),
  // --batch-plan-cost-triple-quadmean (p=2, partial-xxx),
  // --batch-plan-cost-triple-cubmean (p=3, partial-zzz),
  // --batch-plan-cost-triple-quartmean (p=4, partial-bbbb),
  // --batch-plan-cost-triple-quintmean (p=5, partial-dddd),
  // --batch-plan-cost-triple-sextmean (p=6, partial-ffff) and
  // --batch-plan-cost-triple-septmean (p=7, partial-hhhh) to the dectet
  // {p=-1, p=0, p=1, p=2, p=3, p=4, p=5, p=6, p=7, p=8}. The octic mean
  // OCM = (sum(x_i^8) / n)^(1/8) is the power-mean with exponent p=8; by the
  // generalized power-mean inequality it dominates the septic mean for any
  // non-constant positive sample, so the full ordering
  // OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds
  // inline across all ten emitters. OCM carries the strongest long-tail
  // penalty yet: the eighth-power sum weights the largest triples ~4x harder
  // than seventh-power in log-units, so budgeting against OCM makes the
  // L8-cost signature of the longest triple visible, aligning the central-
  // tendency axis with any eighth-moment / heavy-tail dispersion signal an
  // operator might add later without re-running --batch-plan-cost-triple-max
  // -triple (partial-zz). Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new batch-plan logic; identical known-row filter
  // (wallSec !== null) to the power-mean siblings. Even-exponent eighth power
  // is strictly non-negative for any real input but since all wallSec values
  // are strictly positive by construction (non-null rows carry measured
  // runtimes > 0), the non-positive-wallSec guard that harmean needed for
  // 1/x is not required (matching the partial-xxx quadmean and partial-bbbb
  // quartmean even-exponent observation). The only degenerate case is
  // all-unknown (known.length === 0) which prints a dedicated "unknown"
  // summary and exits 0 rather than (0/0)^(1/8) = NaN, matching the
  // partial-hhh / partial-ttt / partial-vvv / partial-xxx / partial-zzz /
  // partial-bbbb / partial-dddd / partial-ffff / partial-hhhh degenerate
  // cadence. Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Shell-only this partial;
  // a --batch-plan-cost-triple-octmean-json analog can follow to close the
  // {shell, JSON} pair on this nineteenth per-triple statistical view,
  // mirroring the shell-first / JSON-second cadence established across every
  // other cost-emitter axis. Numerical stability: uses the (((x^2)^2)^2)
  // factorization (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // octSum += w4 * w4;) to avoid calling Math.pow in the inner reduce loop,
  // matching the partial-hhhh septmean inline-multiply cadence that produces
  // the same bit-pattern on IEEE-754 across Node versions.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple octic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const octSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    return s + w4 * w4;
  }, 0);
  const octmeanSec = Math.pow(octSum / known.length, 1 / 8);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from octmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple octic-mean wall-time: ${octmeanSec.toFixed(0)} s (~${(octmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleOctmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-octmean (partial-jjjj):
  // surface the BATCH_PLAN octic mean (p=8 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {octmeanSec, octmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the p=8 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the shell form so the two flags cannot drift.
  // Even-exponent eighth power is strictly non-negative for any real input
  // but since all wallSec values are strictly positive by construction
  // (non-null rows carry measured runtimes > 0), the non-positive-wallSec
  // guard that harmean needed for 1/x is unnecessary (matching the
  // partial-yyy quadmean-json, partial-cccc quartmean-json and partial-gggg
  // sextmean-json even-exponent JSON observation). octmeanHours precomputed
  // inline as octmeanSec / 3600 (null when knownCount === 0) matching the
  // partial-ww / partial-zz / partial-bbb / partial-eee / partial-ggg /
  // partial-iii / partial-kkk / partial-mmm / partial-ooo / partial-qqq /
  // partial-sss / partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc / partial-eeee / partial-gggg / partial-iiii precomputed-
  // hours cadence so offline-worker drivers consuming the p=8 power-mean
  // signal do not need to redo the seconds-to-hours conversion per run.
  // All-unknown degenerate case emits {octmeanSec: null, octmeanHours: null,
  // knownCount: 0, unknownCount} and exits 0 without computing
  // (0/0)^(1/8) = NaN, matching the partial-uuu / partial-www / partial-yyy
  // / partial-aaaa / partial-cccc / partial-eeee / partial-gggg /
  // partial-iiii JSON degenerate cadence. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Completes the {shell, JSON} pair for partial-jjjj and
  // brings the Kolmogorov power-mean dectet {harmonic (p=-1, partial-vvv/
  // www), geometric (p=0, partial-ttt/uuu), arithmetic (p=1, partial-hhh/
  // iii), quadratic (p=2, partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa),
  // quartic (p=4, partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee),
  // sextic (p=6, partial-ffff/gggg), septic (p=7, partial-hhhh/iiii), octic
  // (p=8, partial-jjjj/THIS)} x {shell, JSON} to full parity, surfacing the
  // complete monotone power-mean ordering
  // OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM at
  // structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Numerical stability: uses the (((x^2)^2)^2)
  // factorization (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // octSum += w4 * w4;) to avoid calling Math.pow in the inner reduce loop,
  // matching the partial-jjjj shell-form inline-multiply cadence that
  // produces the same bit-pattern on IEEE-754 across Node versions.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let octmeanSec = null;
  if (known.length > 0) {
    const octSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      return s + w4 * w4;
    }, 0);
    octmeanSec = Math.pow(octSum / known.length, 1 / 8);
  }
  const octmeanHours = octmeanSec === null ? null : octmeanSec / 3600;
  const body = {
    octmeanSec,
    octmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleNonmean) {
  // Shell data emitter: surface the nonic mean (p=9 Kolmogorov power-mean) of
  // per-triple wall-times across the known-wallSec rows of BATCH_PLAN as the
  // eleventh power-mean sibling, extending the already-paired dectet
  // {harmonic (p=-1, partial-vvv/www), geometric (p=0, partial-ttt/uuu),
  // arithmetic (p=1, partial-hhh/iii), quadratic (p=2, partial-xxx/yyy),
  // cubic (p=3, partial-zzz/aaaa), quartic (p=4, partial-bbbb/cccc),
  // quintic (p=5, partial-dddd/eeee), sextic (p=6, partial-ffff/gggg),
  // septic (p=7, partial-hhhh/iiii), octic (p=8, partial-jjjj/kkkk)} upward
  // to p=9. Computed as NPM = (sum(x_i^9) / n)^(1/9) via Math.pow(s, 1/9);
  // by the generalized power-mean inequality NPM dominates every lower-p
  // sibling so the full ordering
  // NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now
  // holds inline across all eleven emitters. Handler uses the
  // (((x^2)^2)^2) * x factorization (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; nonSum += w8 * r.wallSec;) to
  // avoid calling Math.pow in the inner reduce loop, matching the
  // partial-jjjj octmean (((x^2)^2)^2) cadence and the partial-hhhh septmean
  // (x^2)^3 * x odd-exponent cadence that produces the same bit-pattern on
  // IEEE-754 across Node versions. Odd ninth-power preserves sign, but all
  // wallSec values are strictly positive by construction (non-null rows
  // carry measured runtimes > 0) so the non-positive-wallSec guard that
  // harmean needed for 1/x is not required (mirroring the partial-zzz /
  // partial-dddd / partial-hhhh odd-exponent observation). The only
  // degenerate case is all-unknown (known.length === 0) which prints a
  // dedicated "unknown" summary and exits 0 rather than (0/0)^(1/9) = NaN,
  // matching the partial-hhh / partial-ttt / partial-vvv / partial-xxx /
  // partial-zzz / partial-bbbb / partial-dddd / partial-ffff / partial-hhhh
  // / partial-jjjj degenerate cadence. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-nonmean-json analog can follow as partial-mmmm
  // mirroring the shell-first / JSON-second cadence established across
  // every other cost-emitter axis. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple nonic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const nonSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    return s + w8 * r.wallSec;
  }, 0);
  const nonmeanSec = Math.pow(nonSum / known.length, 1 / 9);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from nonmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple nonic-mean wall-time: ${nonmeanSec.toFixed(0)} s (~${(nonmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleNonmeanJson) {
  // JSON data emitter: structural analog of --batch-plan-cost-triple-nonmean
  // (partial-llll). Surfaces the nonic mean (p=9 Kolmogorov power-mean) of
  // per-triple wall-times across the known-wallSec rows of BATCH_PLAN as a
  // single object {nonmeanSec, nonmeanHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the p=9 power-mean
  // central-tendency signal directly without re-parsing the one-line shell
  // summary and without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence already established across every other JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with zero
  // new math; identical known-row filter (wallSec !== null) to the
  // partial-llll shell form so the two flags cannot drift. Handler uses the
  // same (((x^2)^2)^2) * x factorization as partial-llll
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4;
  // nonSum += w8 * r.wallSec;) for numerical-stability parity, then
  // nonmeanSec = Math.pow(nonSum / known.length, 1 / 9). Odd-exponent p=9
  // preserves sign (mirroring partial-zzz cubmean, partial-dddd quintmean,
  // partial-hhhh septmean) and all wallSec values are strictly positive by
  // construction so no non-positive-wallSec guard is required. All-unknown
  // degenerate case (known.length === 0) emits {nonmeanSec: null,
  // nonmeanHours: null, knownCount: 0, unknownCount} and exits 0 without
  // attempting (0/0)^(1/9) = NaN, matching the partial-uuu / partial-www /
  // partial-yyy / partial-aaaa / partial-cccc / partial-eeee / partial-gggg /
  // partial-iiii / partial-kkkk JSON degenerate cadence. Completes the
  // {shell, JSON} pair for partial-llll and brings the Kolmogorov power-mean
  // elevenet at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9} (HM, GM, AM, QM, CM,
  // QUM, QIM, SXM, SPM, OCM, NPM) x {shell, JSON} to full parity, surfacing
  // the complete monotone ordering
  // NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM at
  // structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let nonmeanSec = null;
  if (known.length > 0) {
    const nonSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      return s + w8 * r.wallSec;
    }, 0);
    nonmeanSec = Math.pow(nonSum / known.length, 1 / 9);
  }
  const nonmeanHours = nonmeanSec === null ? null : nonmeanSec / 3600;
  const body = {
    nonmeanSec,
    nonmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleDecmean) {
  // Shell data emitter: surface the decic mean (p=10 Kolmogorov power-mean) of
  // per-triple wall-times across the known-wallSec rows of BATCH_PLAN as the
  // twelfth power-mean sibling, extending the already-paired undectet
  // {harmonic (p=-1, partial-vvv/www), geometric (p=0, partial-ttt/uuu),
  // arithmetic (p=1, partial-hhh/iii), quadratic (p=2, partial-xxx/yyy),
  // cubic (p=3, partial-zzz/aaaa), quartic (p=4, partial-bbbb/cccc),
  // quintic (p=5, partial-dddd/eeee), sextic (p=6, partial-ffff/gggg),
  // septic (p=7, partial-hhhh/iiii), octic (p=8, partial-jjjj/kkkk),
  // nonic (p=9, partial-llll/mmmm)} upward to p=10. Computed as
  // DCM = (sum(x_i^10) / n)^(1/10) via Math.pow(s, 1/10); by the generalized
  // power-mean inequality DCM dominates every lower-p sibling so the full
  // ordering
  // DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all twelve emitters. Handler uses the
  // (((x^2)^2)^2) * (x^2) factorization (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; decSum += w8 * w2;) to avoid
  // calling Math.pow in the inner reduce loop, matching the partial-xxx
  // quadmean (x^2) cadence and the partial-bbbb quartmean ((x^2)^2) cadence
  // and the partial-ffff sextmean ((x^2)^2) * (x^2) cadence and the
  // partial-jjjj octmean (((x^2)^2)^2) cadence that produce the same
  // bit-pattern on IEEE-754 across Node versions. Even tenth-power is
  // non-negative regardless of sign, but all wallSec values are strictly
  // positive by construction (non-null rows carry measured runtimes > 0) so
  // the non-positive-wallSec guard that harmean needed for 1/x is not
  // required (mirroring the partial-xxx / partial-bbbb / partial-ffff /
  // partial-jjjj even-exponent observation). The only degenerate case is
  // all-unknown (known.length === 0) which prints a dedicated "unknown"
  // summary and exits 0 rather than (0/0)^(1/10) = NaN, matching the
  // partial-hhh / partial-ttt / partial-vvv / partial-xxx / partial-zzz /
  // partial-bbbb / partial-dddd / partial-ffff / partial-hhhh / partial-jjjj
  // / partial-llll degenerate cadence. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-decmean-json analog can follow as partial-oooo
  // mirroring the shell-first / JSON-second cadence established across every
  // other cost-emitter axis. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple decic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const decSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    return s + w8 * w2;
  }, 0);
  const decmeanSec = Math.pow(decSum / known.length, 1 / 10);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from decmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple decic-mean wall-time: ${decmeanSec.toFixed(0)} s (~${(decmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleUndecmean) {
  // Shell data emitter: surface the undecic mean (p=11 Kolmogorov power-mean)
  // of per-triple wall-times across the known-wallSec rows of BATCH_PLAN as
  // the thirteenth power-mean sibling, extending the already-paired
  // duodectet {harmonic (p=-1, partial-vvv/www), geometric (p=0,
  // partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii), quadratic (p=2,
  // partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic (p=4,
  // partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/gggg), septic (p=7, partial-hhhh/iiii), octic (p=8,
  // partial-jjjj/kkkk), nonic (p=9, partial-llll/mmmm), decic (p=10,
  // partial-nnnn/oooo)} upward to p=11. Computed as
  // UDM = (sum(x_i^11) / n)^(1/11) via Math.pow(s, 1/11); by the generalized
  // power-mean inequality UDM dominates every lower-p sibling so the full
  // ordering UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >=
  // QM >= AM >= GM >= HM now holds inline across all thirteen emitters.
  // Handler uses the (((x^2)^2)^2) * (x^2) * x factorization (const
  // w2 = r.wallSec * r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4;
  // undecSum += w8 * w2 * r.wallSec;) to avoid calling Math.pow in the
  // inner reduce loop, matching the partial-zzz cubmean (x^2) * x cadence
  // and the partial-dddd quintmean ((x^2)^2) * x cadence and the
  // partial-hhhh septmean ((x^2)^2 * (x^2)) * x cadence and the
  // partial-llll nonmean (((x^2)^2)^2) * x cadence that produce the same
  // bit-pattern on IEEE-754 across Node versions. Unlike even-p siblings,
  // odd p=11 preserves sign, but all wallSec values are strictly positive
  // by construction (non-null rows carry measured runtimes > 0) so no sign
  // handling is required (mirroring the partial-zzz / partial-dddd /
  // partial-hhhh / partial-llll odd-exponent observation). The only
  // degenerate case is all-unknown (known.length === 0) which prints a
  // dedicated "unknown" summary and exits 0 rather than (0/0)^(1/11) = NaN,
  // matching the partial-hhh / partial-ttt / partial-vvv / partial-xxx /
  // partial-zzz / partial-bbbb / partial-dddd / partial-ffff / partial-hhhh
  // / partial-jjjj / partial-llll / partial-nnnn degenerate cadence. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-undecmean-json analog can follow as
  // partial-qqqq mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple undecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const undecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    return s + w8 * w2 * r.wallSec;
  }, 0);
  const undecmeanSec = Math.pow(undecSum / known.length, 1 / 11);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from undecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple undecic-mean wall-time: ${undecmeanSec.toFixed(0)} s (~${(undecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleDuodecmean) {
  // Shell data emitter: surface the duodecic mean (p=12 Kolmogorov power-mean)
  // of per-triple wall-times across the known-wallSec rows of BATCH_PLAN as
  // the fourteenth power-mean sibling, extending the already-paired
  // tredectet {harmonic (p=-1, partial-vvv/www), geometric (p=0,
  // partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii), quadratic (p=2,
  // partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic (p=4,
  // partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/gggg), septic (p=7, partial-hhhh/iiii), octic (p=8,
  // partial-jjjj/kkkk), nonic (p=9, partial-llll/mmmm), decic (p=10,
  // partial-nnnn/oooo), undecic (p=11, partial-pppp/qqqq)} upward to p=12.
  // Computed as DUM = (sum(x_i^12) / n)^(1/12) via Math.pow(s, 1/12); by the
  // generalized power-mean inequality DUM dominates every lower-p sibling so
  // the full ordering
  // DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >=
  //   QM >= AM >= GM >= HM
  // now holds inline across all fourteen emitters. Handler uses the
  // (((x^2)^2)^2) * ((x^2)^2) factorization (const w2 = r.wallSec *
  // r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4; duodecSum += w8 * w4;)
  // to avoid calling Math.pow in the inner reduce loop, matching the
  // partial-bbbb quartmean (x^2)^2 cadence, the partial-jjjj octmean
  // (((x^2)^2)^2) cadence, and the partial-nnnn decmean (((x^2)^2)^2) *
  // (x^2) cadence that produce the same bit-pattern on IEEE-754 across
  // Node versions. Even-exponent p=12 forces non-negativity (mirroring
  // partial-xxx quadmean p=2, partial-bbbb quartmean p=4, partial-ffff
  // sextmean p=6, partial-jjjj octmean p=8, partial-nnnn decmean p=10
  // even-p observation) and all wallSec values are strictly positive by
  // construction so no sign handling is required. The only degenerate case
  // is all-unknown (known.length === 0) which prints a dedicated "unknown"
  // summary and exits 0 rather than (0/0)^(1/12) = NaN, matching the
  // partial-hhh / partial-ttt / partial-vvv / partial-xxx / partial-zzz /
  // partial-bbbb / partial-dddd / partial-ffff / partial-hhhh / partial-jjjj
  // / partial-llll / partial-nnnn / partial-pppp degenerate cadence. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-duodecmean-json analog can follow as
  // partial-ssss mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple duodecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const duodecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    return s + w8 * w4;
  }, 0);
  const duodecmeanSec = Math.pow(duodecSum / known.length, 1 / 12);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from duodecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple duodecic-mean wall-time: ${duodecmeanSec.toFixed(0)} s (~${(duodecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleDecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-decmean (partial-nnnn):
  // surface the BATCH_PLAN decic mean (p=10 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {decmeanSec, decmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the p=10 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the seconds-
  // to-hours conversion, matching the precomputed-hours cadence already
  // established across every other JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math; identical
  // known-row filter (wallSec !== null) to the partial-nnnn shell form so the
  // two flags cannot drift. Handler uses the same (((x^2)^2)^2) * (x^2)
  // factorization as partial-nnnn (const w2 = r.wallSec * r.wallSec; const
  // w4 = w2 * w2; const w8 = w4 * w4; decSum += w8 * w2;) for numerical-
  // stability parity, avoiding Math.pow in the inner reduce loop so the JSON
  // and shell bodies agree bit-for-bit on IEEE-754 across Node versions, then
  // decmeanSec = Math.pow(decSum / known.length, 1 / 10). Even-exponent p=10
  // forces non-negativity (mirroring partial-yyy quadmean-json, partial-cccc
  // quartmean-json, partial-gggg sextmean-json, partial-kkkk octmean-json
  // even-p observation) and all wallSec values are strictly positive by
  // construction so no non-positive-wallSec guard is required. All-unknown
  // degenerate case (known.length === 0) emits {decmeanSec: null,
  // decmeanHours: null, knownCount: 0, unknownCount} and exits 0 without
  // attempting (0/0)^(1/10) = NaN, matching the partial-uuu / partial-www /
  // partial-yyy / partial-aaaa / partial-cccc / partial-eeee / partial-gggg /
  // partial-iiii / partial-kkkk / partial-mmmm JSON degenerate cadence.
  // Completes the {shell, JSON} pair for partial-nnnn and brings the
  // Kolmogorov power-mean duodectet at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10} (HM, GM, AM, QM, CM, QUM, QIM,
  // SXM, SPM, OCM, NPM, DCM) x {shell, JSON} to full shell/JSON parity,
  // surfacing the complete monotone ordering
  // DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let decmeanSec = null;
  if (known.length > 0) {
    const decSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      return s + w8 * w2;
    }, 0);
    decmeanSec = Math.pow(decSum / known.length, 1 / 10);
  }
  const decmeanHours = decmeanSec === null ? null : decmeanSec / 3600;
  const body = {
    decmeanSec,
    decmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleUndecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-undecmean (partial-pppp):
  // surface the BATCH_PLAN undecic mean (p=11 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {undecmeanSec, undecmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the p=11 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the seconds-
  // to-hours conversion, matching the precomputed-hours cadence already
  // established across every other JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math; identical
  // known-row filter (wallSec !== null) to the partial-pppp shell form so
  // the two flags cannot drift. Handler uses the same (((x^2)^2)^2) * (x^2)
  // * x factorization as partial-pppp (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; undecSum += w8 * w2 * r.wallSec;)
  // for numerical-stability parity, avoiding Math.pow in the inner reduce
  // loop so the JSON and shell bodies agree bit-for-bit on IEEE-754 across
  // Node versions, then undecmeanSec = Math.pow(undecSum / known.length,
  // 1 / 11). Odd-exponent p=11 preserves sign (mirroring partial-aaaa
  // cubmean-json, partial-eeee quintmean-json, partial-iiii septmean-json,
  // partial-mmmm nonmean-json odd-p observation) but all wallSec values are
  // strictly positive by construction so no non-positive-wallSec guard is
  // required. All-unknown degenerate case (known.length === 0) emits
  // {undecmeanSec: null, undecmeanHours: null, knownCount: 0, unknownCount}
  // and exits 0 without attempting (0/0)^(1/11) = NaN, matching the
  // partial-uuu / partial-www / partial-yyy / partial-aaaa / partial-cccc /
  // partial-eeee / partial-gggg / partial-iiii / partial-kkkk /
  // partial-mmmm / partial-oooo JSON degenerate cadence. Completes the
  // {shell, JSON} pair for partial-pppp and brings the Kolmogorov power-mean
  // tredectet at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM) x
  // {shell, JSON} to full shell/JSON parity, surfacing the complete monotone
  // ordering
  // UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let undecmeanSec = null;
  if (known.length > 0) {
    const undecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      return s + w8 * w2 * r.wallSec;
    }, 0);
    undecmeanSec = Math.pow(undecSum / known.length, 1 / 11);
  }
  const undecmeanHours = undecmeanSec === null ? null : undecmeanSec / 3600;
  const body = {
    undecmeanSec,
    undecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleDuodecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-duodecmean (partial-rrrr):
  // surface the BATCH_PLAN duodecic mean (p=12 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {duodecmeanSec, duodecmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can consume
  // the p=12 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence already established across every
  // other JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new math; identical known-row filter (wallSec !== null) to the
  // partial-rrrr shell form so the two flags cannot drift. Handler uses the
  // same (((x^2)^2)^2) * ((x^2)^2) factorization as partial-rrrr
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4;
  // duodecSum += w8 * w4;) for numerical-stability parity, avoiding Math.pow in
  // the inner reduce loop so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then duodecmeanSec =
  // Math.pow(duodecSum / known.length, 1 / 12). Even-exponent p=12 forces non-
  // negativity (mirroring partial-yyy quadmean-json p=2, partial-cccc
  // quartmean-json p=4, partial-gggg sextmean-json p=6, partial-kkkk
  // octmean-json p=8, partial-oooo decmean-json p=10 even-p observation) and
  // all wallSec values are strictly positive by construction so no non-positive-
  // wallSec guard is required. All-unknown degenerate case (known.length === 0)
  // emits {duodecmeanSec: null, duodecmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/12) = NaN, matching
  // the partial-uuu / partial-www / partial-yyy / partial-aaaa / partial-cccc /
  // partial-eeee / partial-gggg / partial-iiii / partial-kkkk / partial-mmmm /
  // partial-oooo / partial-qqqq JSON degenerate cadence. Completes the
  // {shell, JSON} pair for partial-rrrr and brings the Kolmogorov power-mean
  // quattuordectet at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM, DUM) x
  // {shell, JSON} to full shell/JSON parity, surfacing the complete monotone
  // ordering
  // DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >=
  //   QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let duodecmeanSec = null;
  if (known.length > 0) {
    const duodecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      return s + w8 * w4;
    }, 0);
    duodecmeanSec = Math.pow(duodecSum / known.length, 1 / 12);
  }
  const duodecmeanHours = duodecmeanSec === null ? null : duodecmeanSec / 3600;
  const body = {
    duodecmeanSec,
    duodecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTredecmean) {
  // Shell data emitter: surface the tredecic mean (p=13 Kolmogorov power-mean)
  // of per-triple wall-times across the known-wallSec rows of BATCH_PLAN as
  // the fifteenth power-mean sibling, extending the already-paired
  // quattuordectet {harmonic (p=-1, partial-vvv/www), geometric (p=0,
  // partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii), quadratic (p=2,
  // partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic (p=4,
  // partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/gggg), septic (p=7, partial-hhhh/iiii), octic (p=8,
  // partial-jjjj/kkkk), nonic (p=9, partial-llll/mmmm), decic (p=10,
  // partial-nnnn/oooo), undecic (p=11, partial-pppp/qqqq), duodecic (p=12,
  // partial-rrrr/ssss)} upward to p=13. Computed as
  // TRM = (sum(x_i^13) / n)^(1/13) via Math.pow(s, 1/13); by the generalized
  // power-mean inequality TRM dominates every lower-p sibling so the full
  // ordering TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >=
  // QUM >= CM >= QM >= AM >= GM >= HM now holds inline across all fifteen
  // emitters. Handler uses the (((x^2)^2)^2) * ((x^2)^2) * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4;
  // tredecSum += w8 * w4 * r.wallSec;) to avoid calling Math.pow in the
  // inner reduce loop, matching the partial-zzz cubmean (x^2) * x cadence,
  // the partial-dddd quintmean ((x^2)^2) * x cadence, the partial-hhhh
  // septmean (((x^2)^2) * (x^2)) * x cadence, the partial-llll nonmean
  // (((x^2)^2)^2) * x cadence, and the partial-pppp undecmean
  // (((x^2)^2)^2) * (x^2) * x cadence that produce the same bit-pattern on
  // IEEE-754 across Node versions. Unlike even-p siblings, odd p=13
  // preserves sign, but all wallSec values are strictly positive by
  // construction (non-null rows carry measured runtimes > 0) so no sign
  // handling is required (mirroring the partial-zzz / partial-dddd /
  // partial-hhhh / partial-llll / partial-pppp odd-exponent observation).
  // The only degenerate case is all-unknown (known.length === 0) which
  // prints a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/13) = NaN, matching the partial-hhh / partial-ttt / partial-vvv
  // / partial-xxx / partial-zzz / partial-bbbb / partial-dddd / partial-ffff
  // / partial-hhhh / partial-jjjj / partial-llll / partial-nnnn /
  // partial-pppp / partial-rrrr degenerate cadence. Pure data emitter, exit
  // 0 unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-tredecmean-json analog can follow as
  // partial-uuuu mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple tredecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const tredecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    return s + w8 * w4 * r.wallSec;
  }, 0);
  const tredecmeanSec = Math.pow(tredecSum / known.length, 1 / 13);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from tredecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple tredecic-mean wall-time: ${tredecmeanSec.toFixed(0)} s (~${(tredecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleTredecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-tredecmean (partial-tttt):
  // surface the BATCH_PLAN tredecic mean (p=13 Kolmogorov power-mean) of per-
  // triple wall-times as a single object {tredecmeanSec, tredecmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can consume
  // the p=13 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence already established across every
  // other JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new math; identical known-row filter (wallSec !== null) to the
  // partial-tttt shell form so the two flags cannot drift. Handler uses the
  // same (((x^2)^2)^2) * ((x^2)^2) * x factorization as partial-tttt
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4;
  // tredecSum += w8 * w4 * r.wallSec;) for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop so the JSON and shell bodies agree bit-
  // for-bit on IEEE-754 across Node versions, then tredecmeanSec =
  // Math.pow(tredecSum / known.length, 1 / 13). Unlike even-p siblings, odd
  // p=13 preserves sign (mirroring partial-aaaa cubmean-json p=3, partial-eeee
  // quintmean-json p=5, partial-iiii septmean-json p=7, partial-mmmm
  // nonmean-json p=9, partial-qqqq undecmean-json p=11 odd-p observation) but
  // all wallSec values are strictly positive by construction so no sign-
  // handling is required. All-unknown degenerate case (known.length === 0)
  // emits {tredecmeanSec: null, tredecmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/13) = NaN, matching
  // the partial-uuu / partial-www / partial-yyy / partial-aaaa / partial-cccc /
  // partial-eeee / partial-gggg / partial-iiii / partial-kkkk / partial-mmmm /
  // partial-oooo / partial-qqqq / partial-ssss JSON degenerate cadence.
  // Completes the {shell, JSON} pair for partial-tttt and brings the
  // Kolmogorov power-mean quindectet at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM, DUM, TRM) x
  // {shell, JSON} to full shell/JSON parity, surfacing the complete monotone
  // ordering
  // TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >=
  //   QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let tredecmeanSec = null;
  if (known.length > 0) {
    const tredecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      return s + w8 * w4 * r.wallSec;
    }, 0);
    tredecmeanSec = Math.pow(tredecSum / known.length, 1 / 13);
  }
  const tredecmeanHours = tredecmeanSec === null ? null : tredecmeanSec / 3600;
  const body = {
    tredecmeanSec,
    tredecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuordecmean) {
  // Shell data emitter: surface the quattuordecic mean (p=14 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the sixteenth power-mean sibling, extending the already-
  // paired quindectet {harmonic (p=-1, partial-vvv/www), geometric (p=0,
  // partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii), quadratic (p=2,
  // partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic (p=4,
  // partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/gggg), septic (p=7, partial-hhhh/iiii), octic (p=8,
  // partial-jjjj/kkkk), nonic (p=9, partial-llll/mmmm), decic (p=10,
  // partial-nnnn/oooo), undecic (p=11, partial-pppp/qqqq), duodecic (p=12,
  // partial-rrrr/ssss), tredecic (p=13, partial-tttt/uuuu)} upward to p=14.
  // Computed as QDM = (sum(x_i^14) / n)^(1/14) via Math.pow(s, 1/14); by the
  // generalized power-mean inequality QDM dominates every lower-p sibling so
  // the full ordering QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >=
  // SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline across
  // all sixteen emitters. Handler uses the (((x^2)^2)^2) * ((x^2)^2) * (x^2)
  // factorization (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; quattuordecSum += w8 * w4 * w2;) to avoid calling
  // Math.pow in the inner reduce loop, matching the partial-xxx quadmean (x^2)
  // cadence, the partial-bbbb quartmean (x^2)^2 cadence, the partial-ffff
  // sextmean ((x^2)^2) * (x^2) cadence, the partial-jjjj octmean ((x^2)^2)^2
  // cadence, the partial-nnnn decmean (((x^2)^2)^2) * (x^2) cadence, and the
  // partial-rrrr duodecmean (((x^2)^2)^2) * ((x^2)^2) cadence that produce the
  // same bit-pattern on IEEE-754 across Node versions. Even p=14 erases sign
  // but all wallSec values are strictly positive by construction so no sign
  // handling is required (mirroring the partial-xxx / partial-bbbb /
  // partial-ffff / partial-jjjj / partial-nnnn / partial-rrrr even-exponent
  // observation). The only degenerate case is all-unknown (known.length === 0)
  // which prints a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/14) = NaN, matching the partial-hhh / partial-ttt / partial-vvv
  // / partial-xxx / partial-zzz / partial-bbbb / partial-dddd / partial-ffff
  // / partial-hhhh / partial-jjjj / partial-llll / partial-nnnn /
  // partial-pppp / partial-rrrr / partial-tttt degenerate cadence. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-quattuordecmean-json analog can follow as
  // partial-wwww mirroring the shell-first / JSON-second cadence established
  // across every other cost-emitter axis. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quattuordecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quattuordecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    return s + w8 * w4 * w2;
  }, 0);
  const quattuordecmeanSec = Math.pow(quattuordecSum / known.length, 1 / 14);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quattuordecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quattuordecic-mean wall-time: ${quattuordecmeanSec.toFixed(0)} s (~${(quattuordecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuordecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-quattuordecmean
  // (partial-vvvv): surface the BATCH_PLAN quattuordecic mean (p=14 Kolmogorov
  // power-mean) of per-triple wall-times as a single object
  // {quattuordecmeanSec, quattuordecmeanHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the p=14 power-mean
  // central-tendency signal directly without re-parsing the one-line shell
  // summary and without redoing the seconds-to-hours conversion, matching
  // the precomputed-hours cadence already established across every other
  // JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new math; identical known-row filter (wallSec !== null) to
  // the partial-vvvv shell form so the two flags cannot drift. Handler
  // uses the same (((x^2)^2)^2) * ((x^2)^2) * (x^2) factorization as
  // partial-vvvv (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; quattuordecSum += w8 * w4 * w2;) for numerical-
  // stability parity, avoiding Math.pow in the inner reduce loop so the
  // JSON and shell bodies agree bit-for-bit on IEEE-754 across Node
  // versions, then quattuordecmeanSec = Math.pow(quattuordecSum /
  // known.length, 1 / 14). Even-exponent p=14 forces non-negativity
  // (mirroring partial-yyy quadmean-json p=2, partial-cccc quartmean-json
  // p=4, partial-gggg sextmean-json p=6, partial-kkkk octmean-json p=8,
  // partial-oooo decmean-json p=10, partial-ssss duodecmean-json p=12
  // even-p observation) and all wallSec values are strictly positive by
  // construction so no non-positive-wallSec guard is required. All-unknown
  // degenerate case (known.length === 0) emits {quattuordecmeanSec: null,
  // quattuordecmeanHours: null, knownCount: 0, unknownCount} and exits 0
  // without attempting (0/0)^(1/14) = NaN, matching the partial-uuu /
  // partial-www / partial-yyy / partial-aaaa / partial-cccc / partial-eeee
  // / partial-gggg / partial-iiii / partial-kkkk / partial-mmmm /
  // partial-oooo / partial-qqqq / partial-ssss / partial-uuuu JSON
  // degenerate cadence. Completes the {shell, JSON} pair for partial-vvvv
  // and brings the Kolmogorov power-mean sedectet at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM, DUM, TRM,
  // QDM) x {shell, JSON} to full shell/JSON parity, surfacing the complete
  // monotone ordering
  // QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >=
  //   QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quattuordecmeanSec = null;
  if (known.length > 0) {
    const quattuordecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      return s + w8 * w4 * w2;
    }, 0);
    quattuordecmeanSec = Math.pow(quattuordecSum / known.length, 1 / 14);
  }
  const quattuordecmeanHours =
    quattuordecmeanSec === null ? null : quattuordecmeanSec / 3600;
  const body = {
    quattuordecmeanSec,
    quattuordecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuindecmean) {
  // Shell data emitter: surface the quindecic mean (p=15 Kolmogorov power-mean)
  // of per-triple wall-times across the known-wallSec rows of BATCH_PLAN as
  // the seventeenth power-mean sibling, extending the already-paired
  // sedectet {harmonic (p=-1, partial-vvv/www), geometric (p=0,
  // partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii), quadratic (p=2,
  // partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic (p=4,
  // partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/gggg), septic (p=7, partial-hhhh/iiii), octic (p=8,
  // partial-jjjj/kkkk), nonic (p=9, partial-llll/mmmm), decic (p=10,
  // partial-nnnn/oooo), undecic (p=11, partial-pppp/qqqq), duodecic (p=12,
  // partial-rrrr/ssss), tredecic (p=13, partial-tttt/uuuu), quattuordecic
  // (p=14, partial-vvvv/wwww)} upward to p=15. Computed as
  // QIM15 = (sum(x_i^15) / n)^(1/15) via Math.pow(s, 1/15); by the generalized
  // power-mean inequality QIM15 dominates every lower-p sibling so the full
  // ordering QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >=
  // SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline across
  // all seventeen emitters. Handler uses the x * (x^2) * ((x^2)^2) *
  // (((x^2)^2)^2) factorization (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4;
  // quindecSum += w8 * w4 * w2 * r.wallSec;) to avoid calling Math.pow in the
  // inner reduce loop, matching the partial-zzz cubmean (x^2) * x cadence,
  // the partial-dddd quintmean ((x^2)^2) * x cadence, the partial-hhhh
  // septmean (((x^2)^2) * (x^2)) * x cadence, the partial-llll nonmean
  // (((x^2)^2)^2) * x cadence, the partial-pppp undecmean
  // (((x^2)^2)^2) * (x^2) * x cadence, and the partial-tttt tredecmean
  // (((x^2)^2)^2) * ((x^2)^2) * x cadence that produce the same bit-pattern
  // on IEEE-754 across Node versions (8+4+2+1 = 15). Unlike even-p siblings,
  // odd p=15 preserves sign, but all wallSec values are strictly positive by
  // construction (non-null rows carry measured runtimes > 0) so no sign
  // handling is required (mirroring the partial-zzz / partial-dddd /
  // partial-hhhh / partial-llll / partial-pppp / partial-tttt odd-exponent
  // observation). The only degenerate case is all-unknown (known.length ===
  // 0) which prints a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/15) = NaN, matching the partial-hhh / partial-ttt / partial-vvv
  // / partial-xxx / partial-zzz / partial-bbbb / partial-dddd / partial-ffff
  // / partial-hhhh / partial-jjjj / partial-llll / partial-nnnn /
  // partial-pppp / partial-rrrr / partial-tttt / partial-vvvv degenerate
  // cadence. Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-quindecmean-json analog can follow as
  // partial-yyyy mirroring the shell-first / JSON-second cadence established
  // across every other cost-emitter axis. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quindecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quindecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    return s + w8 * w4 * w2 * r.wallSec;
  }, 0);
  const quindecmeanSec = Math.pow(quindecSum / known.length, 1 / 15);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quindecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quindecic-mean wall-time: ${quindecmeanSec.toFixed(0)} s (~${(quindecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuindecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-quindecmean
  // (partial-xxxx): surface the BATCH_PLAN quindecic mean (p=15 Kolmogorov
  // power-mean) of per-triple wall-times as a single object
  // {quindecmeanSec, quindecmeanHours, knownCount, unknownCount} so Python /
  // jq offline-worker drivers can consume the p=15 power-mean central-
  // tendency signal directly without re-parsing the one-line shell summary
  // and without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence already established across every other JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-xxxx shell form so the two flags cannot drift. Handler uses
  // the same x * (x^2) * ((x^2)^2) * (((x^2)^2)^2) factorization as
  // partial-xxxx (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; quindecSum += w8 * w4 * w2 * r.wallSec;) for
  // numerical-stability parity, avoiding Math.pow in the inner reduce loop
  // so the JSON and shell bodies agree bit-for-bit on IEEE-754 across Node
  // versions (8+4+2+1 = 15), then
  // quindecmeanSec = Math.pow(quindecSum / known.length, 1 / 15).
  // Odd-exponent p=15 preserves sign (mirroring partial-aaaa cubmean-json
  // p=3, partial-eeee quintmean-json p=5, partial-iiii septmean-json p=7,
  // partial-mmmm nonmean-json p=9, partial-qqqq undecmean-json p=11,
  // partial-uuuu tredecmean-json p=13 odd-p observation) but all wallSec
  // values are strictly positive by construction so no non-positive-wallSec
  // guard is required. All-unknown degenerate case (known.length === 0)
  // emits {quindecmeanSec: null, quindecmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/15) = NaN,
  // matching the partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc / partial-eeee / partial-gggg / partial-iiii /
  // partial-kkkk / partial-mmmm / partial-oooo / partial-qqqq /
  // partial-ssss / partial-uuuu / partial-wwww JSON degenerate cadence.
  // Completes the {shell, JSON} pair for partial-xxxx and brings the
  // Kolmogorov power-mean septendectet at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM, DUM, TRM,
  // QDM, QIM15) x {shell, JSON} to full shell/JSON parity, surfacing the
  // complete monotone ordering
  // QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >=
  //   QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quindecmeanSec = null;
  if (known.length > 0) {
    const quindecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      return s + w8 * w4 * w2 * r.wallSec;
    }, 0);
    quindecmeanSec = Math.pow(quindecSum / known.length, 1 / 15);
  }
  const quindecmeanHours =
    quindecmeanSec === null ? null : quindecmeanSec / 3600;
  const body = {
    quindecmeanSec,
    quindecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSedecmean) {
  // Shell data emitter: surface the sedecic mean (p=16 Kolmogorov power-mean)
  // of per-triple wall-times across the known-wallSec rows of BATCH_PLAN as
  // the eighteenth power-mean sibling, extending the already-paired
  // septendectet {harmonic (p=-1, partial-vvv/www), geometric (p=0,
  // partial-ttt/uuu), arithmetic (p=1, partial-hhh/iii), quadratic (p=2,
  // partial-xxx/yyy), cubic (p=3, partial-zzz/aaaa), quartic (p=4,
  // partial-bbbb/cccc), quintic (p=5, partial-dddd/eeee), sextic (p=6,
  // partial-ffff/gggg), septic (p=7, partial-hhhh/iiii), octic (p=8,
  // partial-jjjj/kkkk), nonic (p=9, partial-llll/mmmm), decic (p=10,
  // partial-nnnn/oooo), undecic (p=11, partial-pppp/qqqq), duodecic (p=12,
  // partial-rrrr/ssss), tredecic (p=13, partial-tttt/uuuu), quattuordecic
  // (p=14, partial-vvvv/wwww), quindecic (p=15, partial-xxxx/yyyy)} upward
  // to p=16. Computed as SDM = (sum(x_i^16) / n)^(1/16) via Math.pow(s,
  // 1/16); by the generalized power-mean inequality SDM dominates every
  // lower-p sibling so the full ordering SDM >= QIM15 >= QDM >= TRM >= DUM
  // >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >=
  // AM >= GM >= HM now holds inline across all eighteen emitters. Handler
  // uses the (((x^2)^2)^2)^2 factorization (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // sedecSum += w16;) to avoid calling Math.pow in the inner reduce loop,
  // matching the partial-xxx quadmean (x^2) cadence, the partial-bbbb
  // quartmean (x^2)^2 cadence, the partial-ffff sextmean ((x^2)^2) * (x^2)
  // cadence, the partial-jjjj octmean ((x^2)^2)^2 cadence, the partial-nnnn
  // decmean (((x^2)^2)^2) * (x^2) cadence, the partial-rrrr duodecmean
  // (((x^2)^2)^2) * ((x^2)^2) cadence, and the partial-vvvv quattuordecmean
  // (((x^2)^2)^2) * ((x^2)^2) * (x^2) cadence that produce the same bit-
  // pattern on IEEE-754 across Node versions (16 = 2*8 = 2^4). Even p=16
  // erases sign but all wallSec values are strictly positive by construction
  // so no sign handling is required (mirroring the partial-xxx / partial-bbbb
  // / partial-ffff / partial-jjjj / partial-nnnn / partial-rrrr /
  // partial-vvvv even-exponent observation). The only degenerate case is
  // all-unknown (known.length === 0) which prints a dedicated "unknown"
  // summary and exits 0 rather than (0/0)^(1/16) = NaN, matching the
  // partial-hhh / partial-ttt / partial-vvv / partial-xxx / partial-zzz /
  // partial-bbbb / partial-dddd / partial-ffff / partial-hhhh /
  // partial-jjjj / partial-llll / partial-nnnn / partial-pppp /
  // partial-rrrr / partial-tttt / partial-vvvv / partial-xxxx degenerate
  // cadence. Pure data emitter, exit 0 unconditionally (no validation
  // gate), not wired into --preflight / --preflight-json. Shell-only this
  // partial; a --batch-plan-cost-triple-sedecmean-json analog can follow
  // as the next partial mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple sedecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sedecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16;
  }, 0);
  const sedecmeanSec = Math.pow(sedecSum / known.length, 1 / 16);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from sedecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple sedecic-mean wall-time: ${sedecmeanSec.toFixed(0)} s (~${(sedecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSedecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-sedecmean
  // (partial-zzzz): surface the BATCH_PLAN sedecic mean (p=16 Kolmogorov
  // power-mean) of per-triple wall-times as a single object
  // {sedecmeanSec, sedecmeanHours, knownCount, unknownCount} so Python / jq
  // offline-worker drivers can consume the p=16 power-mean central-tendency
  // signal directly without re-parsing the one-line shell summary and
  // without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence already established across every other JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-zzzz shell form so the two flags cannot drift. Handler uses
  // the same (((x^2)^2)^2)^2 factorization as partial-zzzz
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; sedecSum += w16;) for
  // numerical-stability parity, avoiding Math.pow in the inner reduce loop
  // so the JSON and shell bodies agree bit-for-bit on IEEE-754 across Node
  // versions (16 = 2*8 = 2^4), then
  // sedecmeanSec = Math.pow(sedecSum / known.length, 1 / 16).
  // Even-exponent p=16 erases sign (mirroring partial-yyy quadmean-json
  // p=2, partial-cccc quartmean-json p=4, partial-gggg sextmean-json p=6,
  // partial-kkkk octmean-json p=8, partial-oooo decmean-json p=10,
  // partial-ssss duodecmean-json p=12, partial-wwww quattuordecmean-json
  // p=14 even-p observation) and all wallSec values are strictly positive
  // by construction so no non-positive-wallSec guard is required.
  // All-unknown degenerate case (known.length === 0) emits
  // {sedecmeanSec: null, sedecmeanHours: null, knownCount: 0, unknownCount}
  // and exits 0 without attempting (0/0)^(1/16) = NaN, matching the
  // partial-uuu / partial-www / partial-yyy / partial-aaaa / partial-cccc
  // / partial-eeee / partial-gggg / partial-iiii / partial-kkkk /
  // partial-mmmm / partial-oooo / partial-qqqq / partial-ssss /
  // partial-uuuu / partial-wwww / partial-yyyy JSON degenerate cadence.
  // Completes the {shell, JSON} pair for partial-zzzz and brings the
  // Kolmogorov power-mean octodectet at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM, DUM, TRM,
  // QDM, QIM15, SDM) x {shell, JSON} to full shell/JSON parity, surfacing
  // the complete monotone ordering
  // SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  //   >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let sedecmeanSec = null;
  if (known.length > 0) {
    const sedecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16;
    }, 0);
    sedecmeanSec = Math.pow(sedecSum / known.length, 1 / 16);
  }
  const sedecmeanHours =
    sedecmeanSec === null ? null : sedecmeanSec / 3600;
  const body = {
    sedecmeanSec,
    sedecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSeptendecmean) {
  // Shell data emitter: surface the septendecic mean (p=17 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the nineteenth power-mean sibling, extending the
  // already-paired octodectet {HM (p=-1, partial-vvv/www), GM (p=0,
  // partial-ttt/uuu), AM (p=1, partial-hhh/iii), QM (p=2, partial-xxx/yyy),
  // CM (p=3, partial-zzz/aaaa), QUM (p=4, partial-bbbb/cccc), QIM (p=5,
  // partial-dddd/eeee), SXM (p=6, partial-ffff/gggg), SPM (p=7,
  // partial-hhhh/iiii), OCM (p=8, partial-jjjj/kkkk), NPM (p=9,
  // partial-llll/mmmm), DCM (p=10, partial-nnnn/oooo), UDM (p=11,
  // partial-pppp/qqqq), DUM (p=12, partial-rrrr/ssss), TRM (p=13,
  // partial-tttt/uuuu), QDM (p=14, partial-vvvv/wwww), QIM15 (p=15,
  // partial-xxxx/yyyy), SDM (p=16, partial-zzzz/aaaaa)} upward to p=17.
  // Computed as SPM17 = (sum(x_i^17) / n)^(1/17) via Math.pow(s, 1/17); by
  // the generalized power-mean inequality SPM17 dominates every lower-p
  // sibling so the full ordering SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM
  // >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >=
  // AM >= GM >= HM now holds inline across all nineteen emitters. Handler
  // uses the (((x^2)^2)^2)^2 * x factorization (const w2 = r.wallSec *
  // r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // septdecSum += w16 * r.wallSec;) to avoid calling Math.pow in the inner
  // reduce loop (17 = 16+1), extending the partial-zzzz sedecmean
  // (((x^2)^2)^2)^2 even-exponent factorization upward by one multiplication
  // and mirroring the partial-pppp undecmean (((x^2)^2)^2) * (x^2) * x and
  // partial-tttt tredecmean (((x^2)^2)^2) * ((x^2)^2) * x odd-exponent
  // cadence. Unlike even-p siblings, odd p=17 preserves sign, but all
  // wallSec values are strictly positive by construction (non-null rows
  // carry measured runtimes > 0) so no sign handling is required (mirroring
  // the partial-zzz / partial-dddd / partial-hhhh / partial-llll /
  // partial-pppp / partial-tttt / partial-xxxx odd-exponent observation).
  // The only degenerate case is all-unknown (known.length === 0) which
  // prints a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/17) = NaN. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; a --batch-plan-cost-triple-septendecmean-json
  // analog can follow as the next partial mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple septendecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const septdecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * r.wallSec;
  }, 0);
  const septendecmeanSec = Math.pow(septdecSum / known.length, 1 / 17);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from septendecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple septendecic-mean wall-time: ${septendecmeanSec.toFixed(0)} s (~${(septendecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSeptendecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-septendecmean
  // (partial-bbbbb): surface the BATCH_PLAN septendecic mean (p=17
  // Kolmogorov power-mean) of per-triple wall-times as a single object
  // {septendecmeanSec, septendecmeanHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the p=17 power-mean
  // central-tendency signal directly without re-parsing the one-line shell
  // summary and without redoing the seconds-to-hours conversion, matching
  // the precomputed-hours cadence already established across every other
  // JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new math; identical known-row filter (wallSec !== null) to
  // the partial-bbbbb shell form so the two flags cannot drift. Handler
  // uses the same (((x^2)^2)^2)^2 * x factorization as partial-bbbbb
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8;
  // septdecSum += w16 * r.wallSec;) for numerical-stability parity,
  // avoiding Math.pow in the inner reduce loop (17 = 16+1) so the JSON and
  // shell bodies agree bit-for-bit on IEEE-754 across Node versions, then
  // septendecmeanSec = Math.pow(septdecSum / known.length, 1 / 17).
  // Odd-exponent p=17 preserves sign, but all wallSec values are strictly
  // positive by construction so no sign-handling guard is required
  // (mirroring the partial-aaaa cubmean-json / partial-eeee
  // quintmean-json / partial-iiii septmean-json / partial-mmmm
  // nonmean-json / partial-qqqq undecmean-json / partial-uuuu
  // tredecmean-json / partial-yyyy quindecmean-json odd-p observation).
  // All-unknown degenerate case (known.length === 0) emits
  // {septendecmeanSec: null, septendecmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/17) = NaN,
  // matching the partial-uuu / partial-www / partial-yyy / partial-aaaa
  // / partial-cccc / partial-eeee / partial-gggg / partial-iiii /
  // partial-kkkk / partial-mmmm / partial-oooo / partial-qqqq /
  // partial-ssss / partial-uuuu / partial-wwww / partial-yyyy /
  // partial-aaaaa JSON degenerate cadence. Completes the {shell, JSON}
  // pair for partial-bbbbb and brings the Kolmogorov power-mean
  // nineteen-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM, DUM, TRM,
  // QDM, QIM15, SDM, SPM17) x {shell, JSON} to full shell/JSON parity,
  // surfacing the complete monotone ordering
  // SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM
  //   >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let septendecmeanSec = null;
  if (known.length > 0) {
    const septdecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * r.wallSec;
    }, 0);
    septendecmeanSec = Math.pow(septdecSum / known.length, 1 / 17);
  }
  const septendecmeanHours =
    septendecmeanSec === null ? null : septendecmeanSec / 3600;
  const body = {
    septendecmeanSec,
    septendecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleOctodecmean) {
  // Shell data emitter: surface the octodecic mean (p=18 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the twentieth power-mean sibling, extending the
  // already-paired nineteen-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2),
  // CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8),
  // NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13), QDM (p=14),
  // QIM15 (p=15), SDM (p=16), SPM17 (p=17, partial-bbbbb/ccccc)} upward to
  // p=18 as partial-ddddd. Computed as OCDM18 = (sum(x_i^18) / n)^(1/18)
  // via Math.pow(s, 1/18); by the generalized power-mean inequality OCDM18
  // dominates every lower-p sibling so the full ordering OCDM18 >= SPM17
  // >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >=
  // SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds
  // inline across all twenty emitters. Handler uses the
  // (((x^2)^2)^2)^2 * x^2 factorization (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // octodecSum += w16 * w2;) to avoid calling Math.pow in the inner
  // reduce loop (18 = 16+2), extending the partial-zzzz sedecmean
  // (((x^2)^2)^2)^2 even-exponent factorization upward by one w2
  // multiplication and mirroring the partial-rrrr duodecmean
  // (((x^2)^2)^2) * (x^2)^2 and partial-vvvv quattuordecmean
  // (((x^2)^2)^2) * ((x^2)^2) * (x^2) even-exponent cadence. Since p=18 is
  // even, x_i^18 is strictly non-negative for any real x_i so no sign-flip
  // or absolute-value guard is required (mirroring the partial-xxx /
  // partial-bbbb / partial-ffff / partial-jjjj / partial-nnnn /
  // partial-rrrr / partial-vvvv / partial-zzzz even-exponent observation;
  // the analogous odd-p siblings at p in {1, 3, 5, 7, 9, 11, 13, 15, 17}
  // likewise need no sign handling because all wallSec values are strictly
  // positive by construction but would require it for general real inputs).
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // "unknown" summary and exits 0 rather than (0/0)^(1/18) = NaN. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Shell-only this partial; a
  // --batch-plan-cost-triple-octodecmean-json analog can follow as the
  // next partial mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple octodecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const octodecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w2;
  }, 0);
  const octodecmeanSec = Math.pow(octodecSum / known.length, 1 / 18);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from octodecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple octodecic-mean wall-time: ${octodecmeanSec.toFixed(0)} s (~${(octodecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleOctodecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-octodecmean
  // (partial-ddddd): surface the BATCH_PLAN octodecic mean (p=18 Kolmogorov
  // power-mean) of per-triple wall-times as a single object
  // {octodecmeanSec, octodecmeanHours, knownCount, unknownCount} so Python
  // / jq offline-worker drivers can consume the p=18 power-mean central-
  // tendency signal directly without re-parsing the one-line shell summary
  // and without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence already established across every other JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-ddddd shell form so the two flags cannot drift. Handler uses
  // the same (((x^2)^2)^2)^2 * x^2 factorization as partial-ddddd
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; octodecSum += w16 * w2;) for
  // numerical-stability parity, avoiding Math.pow in the inner reduce loop
  // (18 = 16+2) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then octodecmeanSec =
  // Math.pow(octodecSum / known.length, 1 / 18). Even-exponent p=18 means
  // x_i^18 is strictly non-negative for any real x_i so no sign-flip or
  // absolute-value guard is required (mirroring the partial-xxx /
  // partial-bbbb / partial-ffff / partial-jjjj / partial-nnnn /
  // partial-rrrr / partial-vvvv / partial-zzzz even-exponent observation).
  // All-unknown degenerate case (known.length === 0) emits
  // {octodecmeanSec: null, octodecmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/18) = NaN,
  // matching the partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc / partial-eeee / partial-gggg / partial-iiii /
  // partial-kkkk / partial-mmmm / partial-oooo / partial-qqqq /
  // partial-ssss / partial-uuuu / partial-wwww / partial-yyyy /
  // partial-aaaaa / partial-ccccc JSON degenerate cadence. Completes the
  // {shell, JSON} pair for partial-ddddd and brings the Kolmogorov
  // power-mean twenty-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18}
  // (HM, GM, AM, QM, CM, QUM, QIM, SXM, SPM, OCM, NPM, DCM, UDM, DUM, TRM,
  // QDM, QIM15, SDM, SPM17, OCDM18) x {shell, JSON} to full shell/JSON
  // parity, surfacing the complete monotone ordering
  // OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM
  //   >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM
  //   >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let octodecmeanSec = null;
  if (known.length > 0) {
    const octodecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w2;
    }, 0);
    octodecmeanSec = Math.pow(octodecSum / known.length, 1 / 18);
  }
  const octodecmeanHours =
    octodecmeanSec === null ? null : octodecmeanSec / 3600;
  const body = {
    octodecmeanSec,
    octodecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleNovendecmean) {
  // Shell data emitter: surface the novendecic mean (p=19 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the twenty-first power-mean sibling, extending the
  // already-paired twenty-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2),
  // CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8),
  // NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13), QDM (p=14),
  // QIM15 (p=15), SDM (p=16), SPM17 (p=17), OCDM18 (p=18)} upward to p=19
  // as the novendecic sibling. Computed as NVDM19 = (sum(x_i^19) / n)^(1/19)
  // via Math.pow(s, 1/19); by the generalized power-mean inequality NVDM19
  // dominates every lower-p sibling so the full monotone chain NVDM19 >=
  // OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >=
  // NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all twenty-one emitters. Handler uses the
  // (((x^2)^2)^2)^2 * (x^2) * x factorization (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // novendecSum += w16 * w2 * r.wallSec;) to avoid calling Math.pow in the
  // inner reduce loop (19 = 16+2+1), extending the partial-bbbbb septendecmean
  // w16 * r.wallSec (17 = 16+1) and partial-ddddd octodecmean w16 * w2
  // (18 = 16+2) factorizations by composing both offsets. Odd p=19 preserves
  // sign, but all wallSec values are strictly positive by construction so no
  // sign handling is required (mirroring the partial-zzz / partial-dddd /
  // partial-hhhh / partial-llll / partial-pppp / partial-tttt / partial-xxxx /
  // partial-bbbbb odd-exponent observation). All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and exits 0
  // rather than (0/0)^(1/19) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; a --batch-plan-cost-triple-novendecmean-json
  // analog can follow as the next partial mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple novendecic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const novendecSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w2 * r.wallSec;
  }, 0);
  const novendecmeanSec = Math.pow(novendecSum / known.length, 1 / 19);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from novendecmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple novendecic-mean wall-time: ${novendecmeanSec.toFixed(0)} s (~${(novendecmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleNovendecmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-novendecmean
  // (partial-fffff): surface the BATCH_PLAN novendecic mean (p=19 Kolmogorov
  // power-mean) of per-triple wall-times as a single object
  // {novendecmeanSec, novendecmeanHours, knownCount, unknownCount} so Python
  // / jq offline-worker drivers can consume the p=19 power-mean central-
  // tendency signal directly without re-parsing the one-line shell summary
  // and without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence already established across every other JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-fffff shell form so the two flags cannot drift. Handler uses
  // the same (((x^2)^2)^2)^2 * (x^2) * x factorization as partial-fffff
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8;
  // novendecSum += w16 * w2 * r.wallSec;) for numerical-stability parity,
  // avoiding Math.pow in the inner reduce loop (19 = 16+2+1) so the JSON
  // and shell bodies agree bit-for-bit on IEEE-754 across Node versions,
  // then novendecmeanSec = Math.pow(novendecSum / known.length, 1 / 19).
  // Odd p=19 preserves sign, but all wallSec values are strictly positive
  // by construction so no sign handling is required (mirroring the
  // partial-zzz / partial-dddd / partial-hhhh / partial-llll / partial-pppp
  // / partial-tttt / partial-xxxx / partial-bbbbb odd-exponent observation).
  // All-unknown degenerate case (known.length === 0) emits
  // {novendecmeanSec: null, novendecmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/19) = NaN,
  // matching the partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc / partial-eeee / partial-gggg / partial-iiii /
  // partial-kkkk / partial-mmmm / partial-oooo / partial-qqqq /
  // partial-ssss / partial-uuuu / partial-wwww / partial-yyyy /
  // partial-aaaaa / partial-ccccc / partial-eeeee JSON degenerate cadence.
  // Completes the {shell, JSON} pair for partial-fffff and brings the
  // Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19}
  // x {shell, JSON} to full shell/JSON parity at twenty-one exponents,
  // surfacing the complete monotone ordering
  // NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM
  //   >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM
  //   >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let novendecmeanSec = null;
  if (known.length > 0) {
    const novendecSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w2 * r.wallSec;
    }, 0);
    novendecmeanSec = Math.pow(novendecSum / known.length, 1 / 19);
  }
  const novendecmeanHours =
    novendecmeanSec === null ? null : novendecmeanSec / 3600;
  const body = {
    novendecmeanSec,
    novendecmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleVigintmean) {
  // Shell data emitter: surface the vigintic mean (p=20 Kolmogorov power-mean)
  // of per-triple wall-times across the known-wallSec rows of BATCH_PLAN as
  // the twenty-second power-mean sibling, extending the already-paired
  // twenty-one-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2), CM (p=3),
  // QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8), NPM (p=9),
  // DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13), QDM (p=14), QIM15 (p=15),
  // SDM (p=16), SPM17 (p=17), OCDM18 (p=18), NVDM19 (p=19, partial-fffff/ggggg)}
  // upward to p=20 as partial-hhhhh. Computed as VGM20 =
  // (sum(x_i^20) / n)^(1/20) via Math.pow(s, 1/20); by the generalized
  // power-mean inequality VGM20 dominates every lower-p sibling so the full
  // monotone chain VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >=
  // QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >=
  // QUM >= CM >= QM >= AM >= GM >= HM now holds inline across all
  // twenty-two emitters. Handler uses the (((x^2)^2)^2)^2 * ((x^2)^2)
  // factorization (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; vigintSum += w16 * w4;) to
  // avoid calling Math.pow in the inner reduce loop (20 = 16+4), extending
  // the partial-ddddd octodecmean w16 * w2 (18 = 16+2) even-exponent
  // factorization by one w2-squaring step and mirroring the partial-zzzz
  // sedecmean (((x^2)^2)^2)^2, partial-vvvv quattuordecmean
  // (((x^2)^2)^2) * ((x^2)^2) * (x^2), and partial-rrrr duodecmean
  // (((x^2)^2)^2) * (x^2)^2 even-exponent cadence. Since p=20 is even,
  // x_i^20 is strictly non-negative for any real x_i so no sign-flip or
  // absolute-value guard is required (mirroring the partial-xxx /
  // partial-bbbb / partial-ffff / partial-jjjj / partial-nnnn /
  // partial-rrrr / partial-vvvv / partial-zzzz / partial-ddddd even-exponent
  // observation). All-unknown degenerate case (known.length === 0) prints a
  // dedicated "unknown" summary and exits 0 rather than (0/0)^(1/20) = NaN.
  // Pure data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-vigintmean-json analog is added in partial-iiiii
  // below mirroring the shell-first / JSON-second cadence established across
  // every other cost-emitter axis. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple vigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const vigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w4;
  }, 0);
  const vigintmeanSec = Math.pow(vigintSum / known.length, 1 / 20);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from vigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple vigintic-mean wall-time: ${vigintmeanSec.toFixed(0)} s (~${(vigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleVigintmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-vigintmean
  // (partial-hhhhh): surface the BATCH_PLAN vigintic mean (p=20 Kolmogorov
  // power-mean) of per-triple wall-times as a single object
  // {vigintmeanSec, vigintmeanHours, knownCount, unknownCount} so Python /
  // jq offline-worker drivers can consume the p=20 power-mean central-
  // tendency signal directly without re-parsing the one-line shell summary
  // and without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence already established across every other JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-hhhhh shell form so the two flags cannot drift. Handler uses
  // the same (((x^2)^2)^2)^2 * ((x^2)^2) factorization as partial-hhhhh
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; vigintSum += w16 * w4;) for
  // numerical-stability parity, avoiding Math.pow in the inner reduce
  // loop (20 = 16+4) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then
  // vigintmeanSec = Math.pow(vigintSum / known.length, 1 / 20).
  // Since p=20 is even, x_i^20 is strictly non-negative for any real x_i
  // so no sign-flip or absolute-value guard is required (mirroring the
  // partial-xxx / partial-bbbb / partial-ffff / partial-jjjj / partial-nnnn
  // / partial-rrrr / partial-vvvv / partial-zzzz / partial-ddddd even-
  // exponent observation). All-unknown degenerate case (known.length === 0)
  // emits {vigintmeanSec: null, vigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/20) = NaN,
  // matching the partial-uuu / partial-www / partial-yyy / partial-aaaa /
  // partial-cccc / partial-eeee / partial-gggg / partial-iiii /
  // partial-kkkk / partial-mmmm / partial-oooo / partial-qqqq /
  // partial-ssss / partial-uuuu / partial-wwww / partial-yyyy /
  // partial-aaaaa / partial-ccccc / partial-eeeee / partial-ggggg JSON
  // degenerate cadence. Completes the {shell, JSON} pair for partial-hhhhh
  // and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}
  // x {shell, JSON} to full shell/JSON parity at twenty-two exponents,
  // surfacing the complete monotone ordering
  // VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM
  //   >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM
  //   >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let vigintmeanSec = null;
  if (known.length > 0) {
    const vigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w4;
    }, 0);
    vigintmeanSec = Math.pow(vigintSum / known.length, 1 / 20);
  }
  const vigintmeanHours =
    vigintmeanSec === null ? null : vigintmeanSec / 3600;
  const body = {
    vigintmeanSec,
    vigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleUnvigintmean) {
  // Shell data emitter: surface the unvigintic mean (p=21 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the twenty-third power-mean sibling, extending the
  // already-paired twenty-two-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2),
  // CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8),
  // NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13), QDM (p=14),
  // QIM15 (p=15), SDM (p=16), SPM17 (p=17), OCDM18 (p=18), NVDM19 (p=19),
  // VGM20 (p=20, partial-hhhhh/iiiii)} upward to p=21 as partial-jjjjj.
  // Computed as UVGM21 = (sum(x_i^21) / n)^(1/21) via Math.pow(s, 1/21); by
  // the generalized power-mean inequality UVGM21 dominates every lower-p
  // sibling so the full monotone chain UVGM21 >= VGM20 >= NVDM19 >= OCDM18
  // >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >=
  // OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds
  // inline across all twenty-three shell emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2) * x factorization (const w2 = r.wallSec *
  // r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // unvigintSum += w16 * w4 * r.wallSec;) to avoid calling Math.pow in the
  // inner reduce loop (21 = 16+4+1), extending the partial-hhhhh vigintmean
  // w16 * w4 (20 = 16+4) even-exponent factorization by one trailing
  // wallSec factor and mirroring the partial-fffff novendecmean
  // w16 * w2 * x (19 = 16+2+1) and partial-bbbbb septendecmean w16 * x
  // (17 = 16+1) odd-exponent cadence. Odd p=21 preserves sign, but all
  // wallSec values are strictly positive by construction so no sign
  // handling is required (mirroring the partial-zzz / partial-dddd /
  // partial-hhhh / partial-llll / partial-pppp / partial-tttt /
  // partial-xxxx / partial-bbbbb / partial-fffff odd-exponent observation).
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // "unknown" summary and exits 0 rather than (0/0)^(1/21) = NaN. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Paired with
  // --batch-plan-cost-triple-unvigintmean-json (partial-kkkkk) as the
  // structural JSON analog, completing the shell/JSON pair for the p=21
  // Kolmogorov power-mean sibling and mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter
  // axis. Reuses computeBatchPlanCost() (partial-vv helper) with zero
  // new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple unvigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const unvigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w4 * r.wallSec;
  }, 0);
  const unvigintmeanSec = Math.pow(unvigintSum / known.length, 1 / 21);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from unvigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple unvigintic-mean wall-time: ${unvigintmeanSec.toFixed(0)} s (~${(unvigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleUnvigintmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-unvigintmean
  // (partial-jjjjj): surface the BATCH_PLAN unvigintic mean (p=21
  // Kolmogorov power-mean) of per-triple wall-times as a single object
  // {unvigintmeanSec, unvigintmeanHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the p=21 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence already established across
  // every other JSON cost-emitter. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-jjjjj shell form so the two flags
  // cannot drift. Handler uses the same
  // (((x^2)^2)^2)^2 * ((x^2)^2) * x factorization as partial-jjjjj
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8;
  // unvigintSum += w16 * w4 * r.wallSec;) for numerical-stability parity,
  // avoiding Math.pow in the inner reduce loop (21 = 16+4+1) so the JSON
  // and shell bodies agree bit-for-bit on IEEE-754 across Node versions,
  // then unvigintmeanSec = Math.pow(unvigintSum / known.length, 1 / 21).
  // Odd p=21 preserves sign, but all wallSec values are strictly positive
  // by construction so no sign handling is required (mirroring the
  // partial-zzz / partial-dddd / partial-hhhh / partial-llll /
  // partial-pppp / partial-tttt / partial-xxxx / partial-bbbbb /
  // partial-fffff / partial-jjjjj odd-exponent observation). All-unknown
  // degenerate case (known.length === 0) emits {unvigintmeanSec: null,
  // unvigintmeanHours: null, knownCount: 0, unknownCount} and exits 0
  // without attempting (0/0)^(1/21) = NaN, matching the JSON degenerate
  // cadence established across every prior JSON power-mean emitter.
  // Completes the {shell, JSON} pair for partial-jjjjj and brings the
  // Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21}
  // x {shell, JSON} to full shell/JSON parity at twenty-three exponents,
  // surfacing the complete monotone ordering
  // UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM
  //   >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM
  //   >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let unvigintmeanSec = null;
  if (known.length > 0) {
    const unvigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w4 * r.wallSec;
    }, 0);
    unvigintmeanSec = Math.pow(unvigintSum / known.length, 1 / 21);
  }
  const unvigintmeanHours =
    unvigintmeanSec === null ? null : unvigintmeanSec / 3600;
  const body = {
    unvigintmeanSec,
    unvigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleDuovigintmean) {
  // Shell data emitter: surface the duovigintic mean (p=22 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the twenty-fourth power-mean sibling, extending the
  // already-paired twenty-three-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2),
  // CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8),
  // NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13), QDM (p=14),
  // QIM15 (p=15), SDM (p=16), SPM17 (p=17), OCDM18 (p=18), NVDM19 (p=19),
  // VGM20 (p=20), UVGM21 (p=21, partial-jjjjj/kkkkk)} upward to p=22 as
  // partial-lllll. Computed as DVGM22 = (sum(x_i^22) / n)^(1/22) via
  // Math.pow(s, 1/22); by the generalized power-mean inequality DVGM22
  // dominates every lower-p sibling so the full monotone chain DVGM22 >=
  // UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >=
  // TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM
  // >= QM >= AM >= GM >= HM now holds inline across all twenty-four shell
  // emitters. Handler uses the (((x^2)^2)^2)^2 * ((x^2)^2) * (x^2)
  // factorization (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; duovigintSum += w16 * w4 * w2;)
  // to avoid calling Math.pow in the inner reduce loop (22 = 16+4+2),
  // extending the partial-hhhhh vigintmean w16 * w4 (20 = 16+4) even-exponent
  // factorization by one trailing w2 factor and mirroring the partial-ddddd
  // octodecmean w16 * w2 (18 = 16+2) and partial-zzzz sedecmean
  // (((x^2)^2)^2)^2 (16 = 16) even-exponent cadence. Since p=22 is even,
  // x_i^22 is strictly non-negative for any real x_i so no sign-flip or
  // absolute-value guard is required (mirroring the partial-xxx /
  // partial-bbbb / partial-ffff / partial-jjjj / partial-nnnn / partial-rrrr
  // / partial-vvvv / partial-zzzz / partial-ddddd / partial-hhhhh
  // even-exponent observation). All-unknown degenerate case (known.length
  // === 0) prints a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/22) = NaN. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the --batch-plan-cost-triple-duovigintmean-json
  // analog will be added in a later partial mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple duovigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const duovigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w4 * w2;
  }, 0);
  const duovigintmeanSec = Math.pow(duovigintSum / known.length, 1 / 22);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from duovigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple duovigintic-mean wall-time: ${duovigintmeanSec.toFixed(0)} s (~${(duovigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleDuovigintmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-duovigintmean
  // (partial-lllll): surface the BATCH_PLAN duovigintic mean (p=22
  // Kolmogorov power-mean) of per-triple wall-times as a single object
  // {duovigintmeanSec, duovigintmeanHours, knownCount, unknownCount} so
  // Python / jq offline-worker drivers can consume the p=22 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence already established across
  // every other JSON cost-emitter. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-lllll shell form so the two flags
  // cannot drift. Handler uses the same
  // (((x^2)^2)^2)^2 * ((x^2)^2) * (x^2) factorization as partial-lllll
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8;
  // duovigintSum += w16 * w4 * w2;) for numerical-stability parity,
  // avoiding Math.pow in the inner reduce loop (22 = 16+4+2) so the JSON
  // and shell bodies agree bit-for-bit on IEEE-754 across Node versions,
  // then duovigintmeanSec = Math.pow(duovigintSum / known.length, 1 / 22).
  // Since p=22 is even, x_i^22 is strictly non-negative for any real x_i
  // so no sign-flip or absolute-value guard is required (mirroring the
  // partial-xxx / partial-bbbb / partial-ffff / partial-jjjj /
  // partial-nnnn / partial-rrrr / partial-vvvv / partial-zzzz /
  // partial-ddddd / partial-hhhhh / partial-lllll even-exponent
  // observation). All-unknown degenerate case (known.length === 0)
  // emits {duovigintmeanSec: null, duovigintmeanHours: null,
  // knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/22) = NaN, matching the JSON degenerate cadence established
  // across every prior JSON power-mean emitter. Completes the
  // {shell, JSON} pair for partial-lllll and brings the Kolmogorov
  // power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22}
  // x {shell, JSON} to full shell/JSON parity at twenty-four exponents,
  // surfacing the complete monotone ordering
  // DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM
  //   >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  //   >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let duovigintmeanSec = null;
  if (known.length > 0) {
    const duovigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w4 * w2;
    }, 0);
    duovigintmeanSec = Math.pow(duovigintSum / known.length, 1 / 22);
  }
  const duovigintmeanHours =
    duovigintmeanSec === null ? null : duovigintmeanSec / 3600;
  const body = {
    duovigintmeanSec,
    duovigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTresvigintmean) {
  // Shell data emitter: surface the tresvigintic mean (p=23 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the twenty-fifth power-mean sibling, extending the
  // already-paired twenty-four-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2),
  // CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8),
  // NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13), QDM (p=14),
  // QIM15 (p=15), SDM (p=16), SPM17 (p=17), OCDM18 (p=18), NVDM19 (p=19),
  // VGM20 (p=20), UVGM21 (p=21), DVGM22 (p=22, partial-lllll/mmmmm)} upward
  // to p=23 as partial-nnnnn. Computed as TVGM23 = (sum(x_i^23) / n)^(1/23)
  // via Math.pow(s, 1/23); by the generalized power-mean inequality TVGM23
  // dominates every lower-p sibling so the full monotone chain TVGM23 >=
  // DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >=
  // QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >=
  // QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline across all
  // twenty-five shell emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2) * (x^2) * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8;
  // tresvigintSum += w16 * w4 * w2 * r.wallSec;) to avoid calling Math.pow
  // in the inner reduce loop (23 = 16+4+2+1), extending the partial-lllll
  // duovigintmean w16 * w4 * w2 (22 = 16+4+2) even-exponent factorization by
  // one trailing r.wallSec factor and mirroring the partial-jjjjj unvigintmean
  // w16 * w4 * r.wallSec (21 = 16+4+1) odd-exponent cadence. Since p=23 is
  // odd, x_i^23 preserves sign, but all wallSec values are strictly positive
  // by construction so no sign handling is required (mirroring the
  // partial-zzz / partial-dddd / partial-hhhh / partial-llll / partial-pppp
  // / partial-tttt / partial-xxxx / partial-bbbbb / partial-fffff /
  // partial-jjjjj odd-exponent observation). All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and exits 0
  // rather than (0/0)^(1/23) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the --batch-plan-cost-triple-tresvigintmean-json
  // analog will be added in a later partial mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple tresvigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const tresvigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w4 * w2 * r.wallSec;
  }, 0);
  const tresvigintmeanSec = Math.pow(tresvigintSum / known.length, 1 / 23);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from tresvigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple tresvigintic-mean wall-time: ${tresvigintmeanSec.toFixed(0)} s (~${(tresvigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleTresvigintmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-tresvigintmean
  // (partial-nnnnn): surface the BATCH_PLAN tresvigintic mean (p=23
  // Kolmogorov power-mean) of per-triple wall-times as a single object
  // {tresvigintmeanSec, tresvigintmeanHours, knownCount, unknownCount}
  // so Python / jq offline-worker drivers can consume the p=23
  // power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence already
  // established across every other JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-nnnnn
  // shell form so the two flags cannot drift. Handler uses the same
  // (((x^2)^2)^2)^2 * ((x^2)^2) * (x^2) * x factorization as
  // partial-nnnnn (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // tresvigintSum += w16 * w4 * w2 * r.wallSec;) for numerical-stability
  // parity, avoiding Math.pow in the inner reduce loop
  // (23 = 16+4+2+1) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then tresvigintmeanSec =
  // Math.pow(tresvigintSum / known.length, 1 / 23). Odd p=23 preserves
  // sign, but all wallSec values are strictly positive by construction
  // so no sign handling is required (mirroring the partial-zzz /
  // partial-dddd / partial-hhhh / partial-llll / partial-pppp /
  // partial-tttt / partial-xxxx / partial-bbbbb / partial-fffff /
  // partial-jjjjj / partial-kkkkk odd-exponent observation).
  // All-unknown degenerate case (known.length === 0) emits
  // {tresvigintmeanSec: null, tresvigintmeanHours: null,
  // knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/23) = NaN, matching the JSON degenerate cadence
  // established across every prior JSON power-mean emitter. Completes
  // the {shell, JSON} pair for partial-nnnnn and brings the Kolmogorov
  // power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23}
  // x {shell, JSON} to full shell/JSON parity at twenty-five exponents,
  // surfacing the complete monotone ordering
  // TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17
  //   >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM
  //   >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let tresvigintmeanSec = null;
  if (known.length > 0) {
    const tresvigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w4 * w2 * r.wallSec;
    }, 0);
    tresvigintmeanSec = Math.pow(tresvigintSum / known.length, 1 / 23);
  }
  const tresvigintmeanHours =
    tresvigintmeanSec === null ? null : tresvigintmeanSec / 3600;
  const body = {
    tresvigintmeanSec,
    tresvigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuorvigintmean) {
  // Shell data emitter: surface the quattuorvigintic mean (p=24 Kolmogorov
  // power-mean) of per-triple wall-times across the known-wallSec rows of
  // BATCH_PLAN as the twenty-sixth power-mean sibling, extending the
  // already-paired twenty-five-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2),
  // CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8),
  // NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13), QDM (p=14),
  // QIM15 (p=15), SDM (p=16), SPM17 (p=17), OCDM18 (p=18), NVDM19 (p=19),
  // VGM20 (p=20), UVGM21 (p=21), DVGM22 (p=22), TVGM23 (p=23)} upward to
  // p=24 as partial-ppppp. Computed as QVGM24 = (sum(x_i^24) / n)^(1/24)
  // via Math.pow(s, 1/24); by the generalized power-mean inequality QVGM24
  // dominates every lower-p sibling so the full monotone chain QVGM24 >=
  // TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >=
  // SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  // >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline
  // across all twenty-six shell emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 factorization (const w2 = r.wallSec *
  // r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // quattuorvigintSum += w16 * w8;) to avoid calling Math.pow in the inner
  // reduce loop (24 = 16+8), which at p=24 is cleaner than the
  // partial-nnnnn tresvigintmean w16*w4*w2*r.wallSec (23 = 16+4+2+1) or
  // the partial-lllll duovigintmean w16*w4*w2 (22 = 16+4+2) decompositions:
  // the even exponent 24 splits into two existing powers of two (16 and 8)
  // rather than needing three or four summands. Even p=24 erases sign and
  // wallSec values are strictly positive by construction so no sign guard
  // is required (mirroring the partial-yyy / partial-cccc / partial-gggg /
  // partial-kkkk / partial-oooo / partial-ssss / partial-wwww /
  // partial-aaaaa / partial-eeeee / partial-iiiii / partial-mmmmm even-p
  // cadence). All-unknown degenerate case (known.length === 0) prints a
  // dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/24) = NaN. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the --batch-plan-cost-triple-quattuorvigintmean-json
  // analog will be added in a later partial mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quattuorvigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quattuorvigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8;
  }, 0);
  const quattuorvigintmeanSec = Math.pow(quattuorvigintSum / known.length, 1 / 24);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quattuorvigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quattuorvigintic-mean wall-time: ${quattuorvigintmeanSec.toFixed(0)} s (~${(quattuorvigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuorvigintmeanJson) {
  // Structural JSON analog of --batch-plan-cost-triple-quattuorvigintmean
  // (partial-ppppp): surface the BATCH_PLAN quattuorvigintic mean (p=24
  // Kolmogorov power-mean) of per-triple wall-times as a single object
  // {quattuorvigintmeanSec, quattuorvigintmeanHours, knownCount,
  // unknownCount} so Python / jq offline-worker drivers can consume the
  // p=24 power-mean central-tendency signal directly without re-parsing
  // the one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence already
  // established across every other JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-ppppp
  // shell form so the two flags cannot drift. Handler uses the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 factorization as partial-ppppp (const
  // w2 = r.wallSec * r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4;
  // const w16 = w8 * w8; quattuorvigintSum += w16 * w8;) for
  // numerical-stability parity, avoiding Math.pow in the inner reduce
  // loop (24 = 16+8) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then quattuorvigintmeanSec =
  // Math.pow(quattuorvigintSum / known.length, 1 / 24). Even p=24
  // erases sign and wallSec values are strictly positive by construction
  // so no sign guard is required (mirroring the partial-yyy /
  // partial-cccc / partial-gggg / partial-kkkk / partial-oooo /
  // partial-ssss / partial-wwww / partial-aaaaa / partial-eeeee /
  // partial-iiiii / partial-mmmmm even-p JSON cadence). All-unknown
  // degenerate case (known.length === 0) emits
  // {quattuorvigintmeanSec: null, quattuorvigintmeanHours: null,
  // knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/24) = NaN, matching the JSON degenerate cadence
  // established across every prior JSON power-mean emitter. Completes
  // the {shell, JSON} pair for partial-ppppp and brings the Kolmogorov
  // power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24}
  // x {shell, JSON} to full shell/JSON parity at twenty-six exponents,
  // surfacing the monotone ordering
  // QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18
  //   >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM
  //   >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM
  //   >= GM >= HM
  // at structural-JSON parity for offline-worker drivers gating the
  // ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quattuorvigintmeanSec = null;
  if (known.length > 0) {
    const quattuorvigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8;
    }, 0);
    quattuorvigintmeanSec = Math.pow(quattuorvigintSum / known.length, 1 / 24);
  }
  const quattuorvigintmeanHours =
    quattuorvigintmeanSec === null ? null : quattuorvigintmeanSec / 3600;
  const body = {
    quattuorvigintmeanSec,
    quattuorvigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuinvigintmean) {
  // partial-rrrrr: surface the BATCH_PLAN quinvigintic mean (p=25
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // shell summary, extending partial-nnnnn tresvigintmean (p=23) and
  // partial-ppppp quattuorvigintmean (p=24) upward to p=25. Computed
  // as QIVGM25 = (sum(x_i^25) / n)^(1/25) via Math.pow(s, 1/25); by
  // the generalized power-mean inequality QIVGM25 dominates every
  // lower-p sibling so the monotone chain
  // QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20
  //   >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM
  //   >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM
  //   >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all twenty-seven shell emitters. Handler
  // uses the (((x^2)^2)^2)^2 * ((x^2)^2)^2 * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  quinvigintSum += w16 * w8 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop
  // (25 = 16+8+1), extending the partial-ppppp quattuorvigintmean
  // w16 * w8 (24 = 16+8) two-summand even-p decomposition by one
  // trailing r.wallSec factor for the odd exponent. Odd p=25
  // preserves sign but wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the
  // partial-zzz / partial-dddd / partial-hhhh / partial-llll /
  // partial-pppp / partial-tttt / partial-xxxx / partial-bbbbb /
  // partial-fffff / partial-jjjjj / partial-kkkkk / partial-nnnnn
  // odd-exponent observation). All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and
  // exits 0 rather than (0/0)^(1/25) = NaN. Pure data emitter,
  // exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-quinvigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quinvigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quinvigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8 * r.wallSec;
  }, 0);
  const quinvigintmeanSec = Math.pow(quinvigintSum / known.length, 1 / 25);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quinvigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quinvigintic-mean wall-time: ${quinvigintmeanSec.toFixed(0)} s (~${(quinvigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuinvigintmeanJson) {
  // partial-sssss: structural JSON analog of partial-rrrrr
  // --batch-plan-cost-triple-quinvigintmean (p=25 Kolmogorov power-mean).
  // Emits one object {quinvigintmeanSec, quinvigintmeanHours, knownCount,
  // unknownCount} so Python / jq offline-worker drivers can consume the
  // p=25 power-mean central-tendency signal directly without re-parsing
  // the one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-rrrrr shell form so the two flags
  // cannot drift. Applies the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  quinvigintSum += w16 * w8 * r.wallSec;)
  // as partial-rrrrr for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (25 = 16+8+1) so the JSON and shell bodies
  // agree bit-for-bit on IEEE-754 across Node versions, then
  // quinvigintmeanSec = Math.pow(quinvigintSum / known.length, 1 / 25).
  // Odd p=25 preserves sign but wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the partial-zzz
  // / partial-dddd / partial-hhhh / partial-llll / partial-pppp /
  // partial-tttt / partial-xxxx / partial-bbbbb / partial-fffff /
  // partial-jjjjj / partial-kkkkk / partial-nnnnn odd-exponent
  // observation). All-unknown degenerate case (known.length === 0)
  // emits {quinvigintmeanSec: null, quinvigintmeanHours: null,
  // knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/25) = NaN, matching the JSON degenerate cadence established
  // across every prior JSON power-mean emitter. Completes the
  // {shell, JSON} pair for partial-rrrrr and brings the Kolmogorov
  // power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25}
  // x {shell, JSON} to full shell/JSON parity at twenty-seven exponents;
  // the monotone ordering
  // QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  //   >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM
  //   >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM
  //   >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quinvigintmeanSec = null;
  if (known.length > 0) {
    const quinvigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8 * r.wallSec;
    }, 0);
    quinvigintmeanSec = Math.pow(quinvigintSum / known.length, 1 / 25);
  }
  const quinvigintmeanHours =
    quinvigintmeanSec === null ? null : quinvigintmeanSec / 3600;
  const body = {
    quinvigintmeanSec,
    quinvigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSexvigintmean) {
  // partial-ttttt: surface the BATCH_PLAN sexvigintic mean (p=26
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the Kolmogorov power-mean family from
  // the already-paired twenty-six-tet {HM (p=-1), GM (p=0), AM (p=1),
  // QM (p=2), CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7),
  // OCM (p=8), NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12),
  // TRM (p=13), QDM (p=14), QIM15 (p=15), SDM (p=16), SPM17 (p=17),
  // OCDM18 (p=18), NVDM19 (p=19), VGM20 (p=20), UVGM21 (p=21),
  // DVGM22 (p=22), TVGM23 (p=23), QVGM24 (p=24), QIVGM25 (p=25)}
  // upward to p=26 as partial-ttttt. Computed as SXVGM26 =
  // (sum(x_i^26) / n)^(1/26) via Math.pow(s, 1/26); by the
  // generalized power-mean inequality SXVGM26 dominates every lower-p
  // sibling so the full monotone chain SXVGM26 >= QIVGM25 >= QVGM24
  // >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18
  // >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM
  // >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM
  // >= GM >= HM now holds inline across all twenty-eight shell
  // emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * (x^2) factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  sexvigintSum += w16 * w8 * w2;)
  // to avoid calling Math.pow in the inner reduce loop (26 = 16+8+2),
  // extending the partial-ppppp quattuorvigintmean w16 * w8 (24 =
  // 16+8) two-summand even-p decomposition by one trailing w2 factor
  // to reach the next even exponent. This mirrors the partial-lllll
  // duovigintmean w16*w4*w2 (22 = 16+4+2) three-summand even-p
  // pattern at a higher magnitude: where duovigintmean uses the
  // {16,4,2} partition, sexvigintmean uses the {16,8,2} partition,
  // and both stay within the cached w2/w4/w8/w16 powers without
  // re-multiplying wallSec directly. Even p=26 erases sign and
  // wallSec values are strictly positive by construction so no sign
  // guard is required (mirroring the partial-yyy / partial-cccc /
  // partial-gggg / partial-kkkk / partial-oooo / partial-ssss /
  // partial-wwww / partial-aaaaa / partial-eeeee / partial-iiiii /
  // partial-mmmmm / partial-qqqqq even-p cadence). All-unknown
  // degenerate case (known.length === 0) prints a dedicated
  // "unknown" summary and exits 0 rather than (0/0)^(1/26) = NaN.
  // Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Shell-only this
  // partial; the --batch-plan-cost-triple-sexvigintmean-json analog
  // will be added in a later partial mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter
  // axis. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple sexvigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sexvigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8 * w2;
  }, 0);
  const sexvigintmeanSec = Math.pow(sexvigintSum / known.length, 1 / 26);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from sexvigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple sexvigintic-mean wall-time: ${sexvigintmeanSec.toFixed(0)} s (~${(sexvigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSexvigintmeanJson) {
  // partial-uuuuu: structural JSON analog of partial-ttttt
  // --batch-plan-cost-triple-sexvigintmean (p=26 Kolmogorov power-mean).
  // Emits one object {sexvigintmeanSec, sexvigintmeanHours, knownCount,
  // unknownCount} so Python / jq offline-worker drivers can consume the
  // p=26 power-mean central-tendency signal directly without re-parsing
  // the one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-ttttt shell form so the two flags
  // cannot drift. Applies the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * (x^2) factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  sexvigintSum += w16 * w8 * w2;)
  // as partial-ttttt for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (26 = 16+8+2) so the JSON and shell bodies
  // agree bit-for-bit on IEEE-754 across Node versions, then
  // sexvigintmeanSec = Math.pow(sexvigintSum / known.length, 1 / 26).
  // Even p=26 erases sign and wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the partial-yyy
  // / partial-cccc / partial-gggg / partial-kkkk / partial-oooo /
  // partial-ssss / partial-wwww / partial-aaaaa / partial-eeeee /
  // partial-iiiii / partial-mmmmm / partial-qqqqq even-p JSON cadence).
  // All-unknown degenerate case (known.length === 0) emits
  // {sexvigintmeanSec: null, sexvigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/26) = NaN,
  // matching the JSON degenerate cadence established across every prior
  // JSON power-mean emitter. Completes the {shell, JSON} pair for
  // partial-ttttt and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26}
  // x {shell, JSON} to full shell/JSON parity at twenty-eight exponents;
  // the monotone ordering
  // SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20
  //   >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM
  //   >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM
  //   >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let sexvigintmeanSec = null;
  if (known.length > 0) {
    const sexvigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8 * w2;
    }, 0);
    sexvigintmeanSec = Math.pow(sexvigintSum / known.length, 1 / 26);
  }
  const sexvigintmeanHours =
    sexvigintmeanSec === null ? null : sexvigintmeanSec / 3600;
  const body = {
    sexvigintmeanSec,
    sexvigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSeptenvigintmean) {
  // partial-vvvvv: surface the BATCH_PLAN septenvigintic mean (p=27
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the Kolmogorov power-mean family from
  // the already-paired twenty-seven-tet {HM (p=-1), GM (p=0), AM (p=1),
  // QM (p=2), CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7),
  // OCM (p=8), NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12),
  // TRM (p=13), QDM (p=14), QIM15 (p=15), SDM (p=16), SPM17 (p=17),
  // OCDM18 (p=18), NVDM19 (p=19), VGM20 (p=20), UVGM21 (p=21),
  // DVGM22 (p=22), TVGM23 (p=23), QVGM24 (p=24), QIVGM25 (p=25),
  // SXVGM26 (p=26)} upward to p=27 as partial-vvvvv. Computed as
  // SPVGM27 = (sum(x_i^27) / n)^(1/27) via Math.pow(s, 1/27); by the
  // generalized power-mean inequality SPVGM27 dominates every lower-p
  // sibling so the full monotone chain SPVGM27 >= SXVGM26 >= QIVGM25
  // >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  // >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM
  // >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM
  // >= AM >= GM >= HM now holds inline across all twenty-nine shell
  // emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * (x^2) * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  septenvigintSum += w16 * w8 * w2 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (27 = 16+8+2+1),
  // extending the partial-ttttt sexvigintmean w16 * w8 * w2 (26 =
  // 16+8+2) three-summand decomposition by one trailing r.wallSec
  // factor to reach the next odd exponent. This mirrors the
  // partial-nnnnn tresvigintmean w16*w4*w2*r.wallSec (23 = 16+4+2+1)
  // four-summand odd-p pattern at a higher magnitude: where
  // tresvigintmean uses the {16,4,2,1} partition, septenvigintmean
  // uses the {16,8,2,1} partition, and both stay within the cached
  // w2/w4/w8/w16 powers plus one trailing wallSec without re-multiplying
  // wallSec more than once. Odd p=27 preserves sign but wallSec values
  // are strictly positive by construction (wall clock measurements)
  // so no sign guard is required. All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and
  // exits 0 rather than (0/0)^(1/27) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-septenvigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple septenvigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const septenvigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8 * w2 * r.wallSec;
  }, 0);
  const septenvigintmeanSec = Math.pow(septenvigintSum / known.length, 1 / 27);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from septenvigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple septenvigintic-mean wall-time: ${septenvigintmeanSec.toFixed(0)} s (~${(septenvigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSeptenvigintmeanJson) {
  // partial-wwwww: structural JSON analog of partial-vvvvv
  // --batch-plan-cost-triple-septenvigintmean (p=27 Kolmogorov power-mean).
  // Emits one object {septenvigintmeanSec, septenvigintmeanHours,
  // knownCount, unknownCount} so Python / jq offline-worker drivers can
  // consume the p=27 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-vvvvv
  // shell form so the two flags cannot drift. Applies the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * (x^2) * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  septenvigintSum += w16 * w8 * w2 * r.wallSec;)
  // as partial-vvvvv for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (27 = 16+8+2+1) so the JSON and shell
  // bodies agree bit-for-bit on IEEE-754 across Node versions, then
  // septenvigintmeanSec = Math.pow(septenvigintSum / known.length, 1 / 27).
  // Odd p=27 preserves sign but wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the odd-p JSON
  // cadence at partial-uuu / partial-aaaa / partial-eeee / partial-iiii /
  // partial-mmmm / partial-qqqq / partial-uuuu / partial-yyyy /
  // partial-cccccc / partial-gggggg / partial-kkkkk / partial-sssss).
  // All-unknown degenerate case (known.length === 0) emits
  // {septenvigintmeanSec: null, septenvigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/27) = NaN,
  // matching the JSON degenerate cadence established across every prior
  // JSON power-mean emitter. Completes the {shell, JSON} pair for
  // partial-vvvvv and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26, 27}
  // x {shell, JSON} to full shell/JSON parity at twenty-nine exponents;
  // the monotone ordering
  // SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21
  //   >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM
  //   >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM
  //   >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers gating
  // the ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let septenvigintmeanSec = null;
  if (known.length > 0) {
    const septenvigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8 * w2 * r.wallSec;
    }, 0);
    septenvigintmeanSec = Math.pow(septenvigintSum / known.length, 1 / 27);
  }
  const septenvigintmeanHours =
    septenvigintmeanSec === null ? null : septenvigintmeanSec / 3600;
  const body = {
    septenvigintmeanSec,
    septenvigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleOctovigintmean) {
  // partial-xxxxx: surface the BATCH_PLAN octovigintic mean (p=28
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the Kolmogorov power-mean family from
  // the already-paired twenty-nine-tet {HM (p=-1), GM (p=0), AM (p=1),
  // QM (p=2), CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7),
  // OCM (p=8), NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12),
  // TRM (p=13), QDM (p=14), QIM15 (p=15), SDM (p=16), SPM17 (p=17),
  // OCDM18 (p=18), NVDM19 (p=19), VGM20 (p=20), UVGM21 (p=21),
  // DVGM22 (p=22), TVGM23 (p=23), QVGM24 (p=24), QIVGM25 (p=25),
  // SXVGM26 (p=26), SPVGM27 (p=27)} upward to p=28 as partial-xxxxx.
  // Computed as OVGM28 = (sum(x_i^28) / n)^(1/28) via Math.pow(s, 1/28);
  // by the generalized power-mean inequality OVGM28 dominates every
  // lower-p sibling so the full monotone chain OVGM28 >= SPVGM27
  // >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21
  // >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM
  // >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM
  // >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline across
  // all thirty shell emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  octovigintSum += w16 * w8 * w4;)
  // to avoid calling Math.pow in the inner reduce loop (28 = 16+8+4),
  // extending the partial-vvvvv septenvigintmean w16 * w8 * w2 * x
  // (27 = 16+8+2+1) four-summand odd-p decomposition by replacing the
  // trailing w2 * x pair (= x^3) with a single w4 (= x^4) factor to
  // reach the next even exponent via a cleaner three-summand cadence.
  // This mirrors the partial-ppppp quattuorvigintmean w16 * w8
  // (24 = 16+8) two-summand even-p pattern at a higher magnitude:
  // where quattuorvigintmean uses the {16,8} partition, octovigintmean
  // uses the {16,8,4} partition, and both stay within the cached
  // w2/w4/w8/w16 powers without re-multiplying wallSec directly.
  // Even p=28 erases sign and wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the
  // partial-yyy / partial-cccc / partial-gggg / partial-kkkk /
  // partial-oooo / partial-ssss / partial-wwww / partial-aaaaa /
  // partial-eeeee / partial-iiiii / partial-mmmmm / partial-qqqqq /
  // partial-ttttt even-p cadence). All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and
  // exits 0 rather than (0/0)^(1/28) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-octovigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple octovigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const octovigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8 * w4;
  }, 0);
  const octovigintmeanSec = Math.pow(octovigintSum / known.length, 1 / 28);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from octovigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple octovigintic-mean wall-time: ${octovigintmeanSec.toFixed(0)} s (~${(octovigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleOctovigintmeanJson) {
  // partial-yyyyy: structural JSON analog of partial-xxxxx
  // --batch-plan-cost-triple-octovigintmean (p=28 Kolmogorov power-mean).
  // Emits one object {octovigintmeanSec, octovigintmeanHours, knownCount,
  // unknownCount} with octovigintmeanHours = octovigintmeanSec / 3600
  // (null when knownCount===0) so Python / jq offline-worker drivers can
  // consume the p=28 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-xxxxx
  // shell form so the two flags cannot drift. Applies the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  octovigintSum += w16 * w8 * w4;)
  // as partial-xxxxx for numerical-stability parity, avoiding Math.pow in
  // the inner reduce loop (28 = 16+8+4) so the JSON and shell bodies agree
  // bit-for-bit on IEEE-754 across Node versions, then octovigintmeanSec =
  // Math.pow(octovigintSum / known.length, 1 / 28). Even p=28 erases sign
  // and wallSec values are strictly positive by construction so no sign
  // guard is required (mirroring the partial-yyy / partial-cccc /
  // partial-gggg / partial-kkkk / partial-oooo / partial-ssss /
  // partial-wwww / partial-aaaaa / partial-eeeee / partial-iiiii /
  // partial-mmmmm / partial-qqqqq / partial-uuuuu even-p JSON cadence).
  // All-unknown degenerate case (known.length===0) emits
  // {octovigintmeanSec: null, octovigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/28) = NaN,
  // matching the JSON degenerate cadence across every prior JSON
  // power-mean emitter. Completes the {shell, JSON} pair for partial-xxxxx
  // and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28}
  // x {shell, JSON} to full shell/JSON parity at thirty exponents; the
  // monotone ordering
  // OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22
  //   >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15
  //   >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM
  //   >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers gating
  // the ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let octovigintmeanSec = null;
  if (known.length > 0) {
    const octovigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8 * w4;
    }, 0);
    octovigintmeanSec = Math.pow(octovigintSum / known.length, 1 / 28);
  }
  const octovigintmeanHours =
    octovigintmeanSec === null ? null : octovigintmeanSec / 3600;
  const body = {
    octovigintmeanSec,
    octovigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleNovemvigintmean) {
  // partial-zzzzz: surface the BATCH_PLAN novemvigintic mean (p=29
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the Kolmogorov power-mean family from the
  // already-paired thirty-tet {HM (p=-1), GM (p=0), AM (p=1), QM (p=2),
  // CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7), OCM (p=8),
  // NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12), TRM (p=13),
  // QDM (p=14), QIM15 (p=15), SDM (p=16), SPM17 (p=17), OCDM18 (p=18),
  // NVDM19 (p=19), VGM20 (p=20), UVGM21 (p=21), DVGM22 (p=22),
  // TVGM23 (p=23), QVGM24 (p=24), QIVGM25 (p=25), SXVGM26 (p=26),
  // SPVGM27 (p=27), OVGM28 (p=28)} upward to p=29 as partial-zzzzz.
  // Computed as NVGM29 = (sum(x_i^29) / n)^(1/29) via Math.pow(s, 1/29);
  // by the generalized power-mean inequality NVGM29 dominates every
  // lower-p sibling so the full monotone chain NVGM29 >= OVGM28
  // >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22
  // >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15
  // >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM
  // >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline across
  // all thirty-one shell emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  novemvigintSum += w16 * w8 * w4 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (29 = 16+8+4+1),
  // extending the partial-xxxxx octovigintmean w16 * w8 * w4
  // (28 = 16+8+4) three-summand even-p decomposition by one trailing
  // r.wallSec factor to reach the next odd exponent. This mirrors the
  // partial-vvvvv septenvigintmean w16 * w8 * w2 * x (27 = 16+8+2+1)
  // four-summand odd-p pattern at a higher magnitude: where
  // septenvigintmean uses the {16,8,2,1} partition, novemvigintmean
  // uses the {16,8,4,1} partition, and both stay within the cached
  // w2/w4/w8/w16 powers plus one trailing wallSec without re-multiplying
  // wallSec more than once. Odd p=29 preserves sign but wallSec values
  // are strictly positive by construction (wall clock measurements)
  // so no sign guard is required (mirroring the partial-uuu /
  // partial-aaaa / partial-eeee / partial-iiii / partial-mmmm /
  // partial-qqqq / partial-uuuu / partial-yyyy / partial-cccccc /
  // partial-gggggg / partial-kkkkk / partial-sssss / partial-vvvvv
  // odd-p cadence). All-unknown degenerate case (known.length === 0)
  // prints a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/29) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the
  // --batch-plan-cost-triple-novemvigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis.
  // Reuses computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple novemvigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const novemvigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8 * w4 * r.wallSec;
  }, 0);
  const novemvigintmeanSec = Math.pow(novemvigintSum / known.length, 1 / 29);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from novemvigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple novemvigintic-mean wall-time: ${novemvigintmeanSec.toFixed(0)} s (~${(novemvigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleNovemvigintmeanJson) {
  // partial-aaaaaa: structural JSON analog of partial-zzzzz
  // --batch-plan-cost-triple-novemvigintmean (p=29 Kolmogorov power-mean).
  // Emits one object {novemvigintmeanSec, novemvigintmeanHours, knownCount,
  // unknownCount} with novemvigintmeanHours = novemvigintmeanSec / 3600
  // (null when knownCount===0) so Python / jq offline-worker drivers can
  // consume the p=29 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-zzzzz
  // shell form so the two flags cannot drift. Applies the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  novemvigintSum += w16 * w8 * w4 * r.wallSec;)
  // as partial-zzzzz for numerical-stability parity, avoiding Math.pow in
  // the inner reduce loop (29 = 16+8+4+1) so the JSON and shell bodies
  // agree bit-for-bit on IEEE-754 across Node versions, then
  // novemvigintmeanSec = Math.pow(novemvigintSum / known.length, 1 / 29).
  // Odd p=29 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required
  // (mirroring the partial-uuu / partial-aaaa / partial-eeee /
  // partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-sssss / partial-wwwww odd-p JSON cadence).
  // All-unknown degenerate case (known.length===0) emits
  // {novemvigintmeanSec: null, novemvigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/29) = NaN,
  // matching the JSON degenerate cadence across every prior JSON
  // power-mean emitter. Completes the {shell, JSON} pair for partial-zzzzz
  // and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29}
  // x {shell, JSON} to full shell/JSON parity at thirty-one exponents; the
  // monotone ordering
  // NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23
  //   >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM
  //   >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  //   >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers gating
  // the ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let novemvigintmeanSec = null;
  if (known.length > 0) {
    const novemvigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8 * w4 * r.wallSec;
    }, 0);
    novemvigintmeanSec = Math.pow(novemvigintSum / known.length, 1 / 29);
  }
  const novemvigintmeanHours =
    novemvigintmeanSec === null ? null : novemvigintmeanSec / 3600;
  const body = {
    novemvigintmeanSec,
    novemvigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTrigintmean) {
  // partial-bbbbbb: surface the BATCH_PLAN trigintic mean (p=30
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the Kolmogorov power-mean family from the
  // already-paired thirty-one-tet {HM (p=-1), GM (p=0), AM (p=1),
  // QM (p=2), CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7),
  // OCM (p=8), NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12),
  // TRM (p=13), QDM (p=14), QIM15 (p=15), SDM (p=16), SPM17 (p=17),
  // OCDM18 (p=18), NVDM19 (p=19), VGM20 (p=20), UVGM21 (p=21),
  // DVGM22 (p=22), TVGM23 (p=23), QVGM24 (p=24), QIVGM25 (p=25),
  // SXVGM26 (p=26), SPVGM27 (p=27), OVGM28 (p=28), NVGM29 (p=29)}
  // upward to p=30 as partial-bbbbbb. Computed as
  // TGM30 = (sum(x_i^30) / n)^(1/30) via Math.pow(s, 1/30); by the
  // generalized power-mean inequality TGM30 dominates every lower-p
  // sibling so the full monotone chain TGM30 >= NVGM29 >= OVGM28
  // >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22
  // >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15
  // >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM
  // >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds inline
  // across all thirty-two shell emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) * (x^2) factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  trigintSum += w16 * w8 * w4 * w2;)
  // to avoid calling Math.pow in the inner reduce loop (30 = 16+8+4+2),
  // extending the partial-zzzzz novemvigintmean w16 * w8 * w4 * r.wallSec
  // (29 = 16+8+4+1) four-summand odd-p decomposition by replacing the
  // trailing r.wallSec factor with a cached w2 to reach the next even
  // exponent. This mirrors the partial-xxxxx octovigintmean w16 * w8 * w4
  // (28 = 16+8+4) three-summand even-p pattern at a higher magnitude:
  // where octovigintmean uses the {16,8,4} partition, trigintmean uses
  // the {16,8,4,2} partition, and both stay within the cached
  // w2/w4/w8/w16 powers without re-multiplying wallSec directly. Even
  // p=30 erases sign and wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the
  // partial-yyy / partial-cccc / partial-gggg / partial-kkkk /
  // partial-oooo / partial-ssss / partial-wwww / partial-aaaaa /
  // partial-eeeee / partial-iiiii / partial-mmmmm / partial-qqqqq /
  // partial-ttttt / partial-xxxxx even-p cadence). All-unknown
  // degenerate case (known.length === 0) prints a dedicated "unknown"
  // summary and exits 0 rather than (0/0)^(1/30) = NaN. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-trigintmean-json analog will be added in
  // a later partial mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple trigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const trigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8 * w4 * w2;
  }, 0);
  const trigintmeanSec = Math.pow(trigintSum / known.length, 1 / 30);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from trigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple trigintic-mean wall-time: ${trigintmeanSec.toFixed(0)} s (~${(trigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleTrigintmeanJson) {
  // partial-cccccc: structural JSON analog of partial-bbbbbb
  // --batch-plan-cost-triple-trigintmean (p=30 Kolmogorov power-mean).
  // Emits one object {trigintmeanSec, trigintmeanHours, knownCount,
  // unknownCount} with trigintmeanHours = trigintmeanSec / 3600
  // (null when knownCount===0) so Python / jq offline-worker drivers can
  // consume the p=30 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-bbbbbb
  // shell form so the two flags cannot drift. Applies the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) * (x^2) factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  trigintSum += w16 * w8 * w4 * w2;)
  // as partial-bbbbbb for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (30 = 16+8+4+2) so the JSON and shell
  // bodies agree bit-for-bit on IEEE-754 across Node versions, then
  // trigintmeanSec = Math.pow(trigintSum / known.length, 1 / 30).
  // Even p=30 erases sign and wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the
  // partial-yyy / partial-cccc / partial-gggg / partial-kkkk /
  // partial-oooo / partial-ssss / partial-wwww / partial-aaaaa /
  // partial-eeeee / partial-iiiii / partial-mmmmm / partial-qqqqq /
  // partial-ttttt / partial-xxxxx even-p JSON cadence). All-unknown
  // degenerate case (known.length===0) emits
  // {trigintmeanSec: null, trigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/30) = NaN,
  // matching the JSON degenerate cadence across every prior JSON
  // power-mean emitter. Completes the {shell, JSON} pair for
  // partial-bbbbbb and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30}
  // x {shell, JSON} to full shell/JSON parity at thirty-two exponents;
  // the monotone ordering
  // TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25
  //   >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  //   >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM
  //   >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM
  //   >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let trigintmeanSec = null;
  if (known.length > 0) {
    const trigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8 * w4 * w2;
    }, 0);
    trigintmeanSec = Math.pow(trigintSum / known.length, 1 / 30);
  }
  const trigintmeanHours =
    trigintmeanSec === null ? null : trigintmeanSec / 3600;
  const body = {
    trigintmeanSec,
    trigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleUntrigintmean) {
  // partial-dddddd: surface the BATCH_PLAN untrigintic mean (p=31
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the Kolmogorov power-mean family from the
  // already-paired thirty-two-tet {HM (p=-1), GM (p=0), AM (p=1),
  // QM (p=2), CM (p=3), QUM (p=4), QIM (p=5), SXM (p=6), SPM (p=7),
  // OCM (p=8), NPM (p=9), DCM (p=10), UDM (p=11), DUM (p=12),
  // TRM (p=13), QDM (p=14), QIM15 (p=15), SDM (p=16), SPM17 (p=17),
  // OCDM18 (p=18), NVDM19 (p=19), VGM20 (p=20), UVGM21 (p=21),
  // DVGM22 (p=22), TVGM23 (p=23), QVGM24 (p=24), QIVGM25 (p=25),
  // SXVGM26 (p=26), SPVGM27 (p=27), OVGM28 (p=28), NVGM29 (p=29),
  // TGM30 (p=30)} upward to p=31 as partial-dddddd, the first
  // untrigint-prefixed exponent. Computed as
  // UTGM31 = (sum(x_i^31) / n)^(1/31) via Math.pow(s, 1/31); by the
  // generalized power-mean inequality UTGM31 dominates every lower-p
  // sibling so the full monotone chain UTGM31 >= TGM30 >= NVGM29
  // >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23
  // >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM
  // >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  // >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM now holds
  // inline across all thirty-three shell emitters. Handler uses the
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) * (x^2) * x
  // factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  untrigintSum += w16 * w8 * w4 * w2 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (31 = 16+8+4+2+1),
  // extending the partial-bbbbbb trigintmean w16 * w8 * w4 * w2
  // (30 = 16+8+4+2) four-summand even-p decomposition by one trailing
  // r.wallSec factor to reach the next odd exponent. This mirrors the
  // partial-zzzzz novemvigintmean w16 * w8 * w4 * r.wallSec
  // (29 = 16+8+4+1) four-summand odd-p pattern at a higher magnitude:
  // where novemvigintmean uses the {16,8,4,1} partition, untrigintmean
  // uses the {16,8,4,2,1} partition, and both stay within the cached
  // w2/w4/w8/w16 powers plus one trailing wallSec without re-multiplying
  // wallSec more than once. Odd p=31 preserves sign but wallSec values
  // are strictly positive by construction (wall clock measurements)
  // so no sign guard is required (mirroring the partial-uuu /
  // partial-aaaa / partial-eeee / partial-iiii / partial-mmmm /
  // partial-qqqq / partial-uuuu / partial-yyyy / partial-cccccc /
  // partial-gggggg / partial-kkkkk / partial-sssss / partial-vvvvv /
  // partial-zzzzz odd-p cadence). All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and
  // exits 0 rather than (0/0)^(1/31) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-untrigintmean-json analog will be added
  // in a later partial mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple untrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const untrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    return s + w16 * w8 * w4 * w2 * r.wallSec;
  }, 0);
  const untrigintmeanSec = Math.pow(untrigintSum / known.length, 1 / 31);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from untrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple untrigintic-mean wall-time: ${untrigintmeanSec.toFixed(0)} s (~${(untrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleUntrigintmeanJson) {
  // partial-eeeeee: structural JSON analog of partial-dddddd
  // --batch-plan-cost-triple-untrigintmean (p=31 Kolmogorov power-mean).
  // Emits one object {untrigintmeanSec, untrigintmeanHours, knownCount,
  // unknownCount} with untrigintmeanHours = untrigintmeanSec / 3600
  // (null when knownCount===0) so Python / jq offline-worker drivers can
  // consume the p=31 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-dddddd
  // shell form so the two flags cannot drift. Applies the same
  // (((x^2)^2)^2)^2 * ((x^2)^2)^2 * ((x^2)^2) * (x^2) * x factorization
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  untrigintSum += w16 * w8 * w4 * w2 * r.wallSec;)
  // as partial-dddddd for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (31 = 16+8+4+2+1) so the JSON and shell
  // bodies agree bit-for-bit on IEEE-754 across Node versions, then
  // untrigintmeanSec = Math.pow(untrigintSum / known.length, 1 / 31).
  // Odd p=31 preserves sign but wallSec values are strictly positive
  // by construction (wall clock measurements) so no sign guard is
  // required (mirroring the partial-vvv / partial-bbbb / partial-ffff /
  // partial-jjjj / partial-nnnn / partial-rrrr / partial-vvvv /
  // partial-zzzz / partial-dddddd / partial-hhhhhh / partial-llllll /
  // partial-tttttt / partial-wwwwww odd-p JSON cadence). All-unknown
  // degenerate case (known.length===0) emits
  // {untrigintmeanSec: null, untrigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/31) = NaN,
  // matching the JSON degenerate cadence across every prior JSON
  // power-mean emitter. Completes the {shell, JSON} pair for
  // partial-dddddd and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31}
  // x {shell, JSON} to full shell/JSON parity at thirty-three exponents;
  // the monotone ordering
  // UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26
  //   >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20
  //   >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM
  //   >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let untrigintmeanSec = null;
  if (known.length > 0) {
    const untrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      return s + w16 * w8 * w4 * w2 * r.wallSec;
    }, 0);
    untrigintmeanSec = Math.pow(untrigintSum / known.length, 1 / 31);
  }
  const untrigintmeanHours =
    untrigintmeanSec === null ? null : untrigintmeanSec / 3600;
  const body = {
    untrigintmeanSec,
    untrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleDuotrigintmean) {
  // partial-ffffff: surface the BATCH_PLAN duotrigintic mean (p=32
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the already-paired thirty-three-tet at
  // p in {-1, 0, 1, ..., 31} upward to p=32 as the first
  // duotrigint-prefixed exponent. Computed as
  // DTGM32 = (sum(x_i^32) / n)^(1/32) via Math.pow(s, 1/32); by the
  // generalized power-mean inequality DTGM32 dominates every lower-p
  // sibling so the monotone chain DTGM32 >= UTGM31 >= TGM30
  // >= NVGM29 >= ... >= AM >= GM >= HM now holds inline across all
  // thirty-four shell emitters. Handler uses the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32;)
  // to avoid calling Math.pow in the inner reduce loop (32 = 2^5 so
  // one extra squaring beyond the cached w16), extending the
  // partial-bbbbbb trigintmean w16 * w8 * w4 * w2 (30 = 16+8+4+2)
  // four-summand even-p decomposition by collapsing to a single
  // w16^2 product at the next power of two -- the cleanest
  // factorization the cache admits at this exponent. Even p=32
  // erases sign and wallSec values are strictly positive by
  // construction so no sign guard is required (mirroring the
  // partial-yyy / partial-cccc / partial-gggg / partial-kkkk /
  // partial-oooo / partial-ssss / partial-wwww / partial-aaaaa /
  // partial-eeeee / partial-iiiii / partial-mmmmm / partial-qqqqq /
  // partial-ttttt / partial-xxxxx / partial-bbbbbb even-p cadence).
  // All-unknown degenerate case (known.length === 0) prints a
  // dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/32) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the --batch-plan-cost-triple-duotrigintmean-json
  // analog will be added in a later partial mirroring the
  // shell-first / JSON-second cadence established across every other
  // cost-emitter axis. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple duotrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const duotrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32;
  }, 0);
  const duotrigintmeanSec = Math.pow(duotrigintSum / known.length, 1 / 32);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from duotrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple duotrigintic-mean wall-time: ${duotrigintmeanSec.toFixed(0)} s (~${(duotrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleDuotrigintmeanJson) {
  // partial-gggggg: structural JSON analog of partial-ffffff
  // --batch-plan-cost-triple-duotrigintmean (p=32 Kolmogorov power-mean).
  // Emits one object {duotrigintmeanSec, duotrigintmeanHours, knownCount,
  // unknownCount} with duotrigintmeanHours = duotrigintmeanSec / 3600
  // (null when knownCount===0) so Python / jq offline-worker drivers can
  // consume the p=32 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-ffffff
  // shell form so the two flags cannot drift. Applies the same
  // power-of-two squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; duotrigintSum += w32;)
  // as partial-ffffff for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (32 = 2^5 so one extra squaring beyond
  // the cached w16) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then duotrigintmeanSec =
  // Math.pow(duotrigintSum / known.length, 1 / 32). Even p=32 erases
  // sign and wallSec values are strictly positive by construction so
  // no sign guard is required (mirroring the partial-zzz / partial-dddd /
  // partial-hhhh / partial-llll / partial-pppp / partial-tttt /
  // partial-xxxx / partial-bbbbb / partial-fffff / partial-jjjjj /
  // partial-nnnnn / partial-rrrrr / partial-uuuuu / partial-yyyyy /
  // partial-aaaaaa / partial-cccccc even-p JSON cadence).
  // All-unknown degenerate case (known.length===0) emits
  // {duotrigintmeanSec: null, duotrigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/32) = NaN,
  // matching the JSON degenerate cadence across every prior JSON
  // power-mean emitter. Completes the {shell, JSON} pair for
  // partial-ffffff and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32}
  // x {shell, JSON} to full shell/JSON parity at thirty-four
  // exponents; the monotone ordering
  // DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27
  //   >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21
  //   >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM
  //   >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM
  //   >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let duotrigintmeanSec = null;
  if (known.length > 0) {
    const duotrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32;
    }, 0);
    duotrigintmeanSec = Math.pow(duotrigintSum / known.length, 1 / 32);
  }
  const duotrigintmeanHours =
    duotrigintmeanSec === null ? null : duotrigintmeanSec / 3600;
  const body = {
    duotrigintmeanSec,
    duotrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTritrigintmean) {
  // partial-hhhhhh: surface the BATCH_PLAN tritrigintic mean (p=33
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the already-paired thirty-four-tet at
  // p in {-1, 0, 1, ..., 32} upward to p=33 as the first
  // tritrigint-prefixed exponent. Computed as
  // TRGM33 = (sum(x_i^33) / n)^(1/33) via Math.pow(s, 1/33); by the
  // generalized power-mean inequality TRGM33 dominates every lower-p
  // sibling so the monotone chain TRGM33 >= DTGM32 >= UTGM31 >= TGM30
  // >= NVGM29 >= ... >= AM >= GM >= HM now holds inline across all
  // thirty-five shell emitters. Handler uses the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (33 = 32+1 =
  // 16+16+1), extending the partial-ffffff duotrigintmean w16 * w16
  // (32 = 16+16) two-summand even-p decomposition by one trailing
  // r.wallSec factor to reach the next odd exponent. Mirrors the
  // partial-dddddd untrigintmean w16 * w8 * w4 * w2 * r.wallSec
  // (31 = 16+8+4+2+1) five-summand odd-p pattern at a higher magnitude:
  // where untrigintmean uses the {16,8,4,2,1} partition, tritrigintmean
  // uses the {32,1} partition, and both stay within the cached
  // w2/w4/w8/w16/w32 powers plus one trailing wallSec without
  // re-multiplying wallSec more than once. Odd p=33 preserves sign but
  // wallSec values are strictly positive by construction (wall clock
  // measurements) so no sign guard is required (mirroring the
  // partial-uuu / partial-aaaa / partial-eeee / partial-iiii /
  // partial-mmmm / partial-qqqq / partial-uuuu / partial-yyyy /
  // partial-cccccc / partial-gggggg / partial-kkkkk / partial-sssss /
  // partial-vvvvv / partial-zzzzz / partial-dddddd odd-p cadence).
  // All-unknown degenerate case (known.length === 0) prints a
  // dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/33) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the --batch-plan-cost-triple-tritrigintmean-json
  // analog will be added in a later partial mirroring the
  // shell-first / JSON-second cadence established across every other
  // cost-emitter axis. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple tritrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const tritrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * r.wallSec;
  }, 0);
  const tritrigintmeanSec = Math.pow(tritrigintSum / known.length, 1 / 33);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from tritrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple tritrigintic-mean wall-time: ${tritrigintmeanSec.toFixed(0)} s (~${(tritrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleTritrigintmeanJson) {
  // partial-iiiiii: structural JSON analog of partial-hhhhhh
  // --batch-plan-cost-triple-tritrigintmean (p=33 Kolmogorov power-mean).
  // Emits one object {tritrigintmeanSec, tritrigintmeanHours, knownCount,
  // unknownCount} with tritrigintmeanHours = tritrigintmeanSec / 3600
  // (null when knownCount===0) so Python / jq offline-worker drivers can
  // consume the p=33 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-hhhhhh
  // shell form so the two flags cannot drift. Applies the same
  // power-of-two squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; tritrigintSum += w32 * r.wallSec;)
  // as partial-hhhhhh for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (33 = 32+1 = 16+16+1) so the JSON and shell
  // bodies agree bit-for-bit on IEEE-754 across Node versions, then
  // tritrigintmeanSec = Math.pow(tritrigintSum / known.length, 1 / 33).
  // Odd p=33 preserves sign but wallSec values are strictly positive by
  // construction (wall clock measurements) so no sign guard is required.
  // All-unknown degenerate case (known.length===0) emits
  // {tritrigintmeanSec: null, tritrigintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/33) = NaN,
  // matching the JSON degenerate cadence across every prior JSON
  // power-mean emitter. Completes the {shell, JSON} pair for
  // partial-hhhhhh and brings the Kolmogorov power-mean family at p in
  // {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  //  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33}
  // x {shell, JSON} to full shell/JSON parity at thirty-five
  // exponents; the monotone ordering
  // TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27
  //   >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21
  //   >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM
  //   >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM
  //   >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let tritrigintmeanSec = null;
  if (known.length > 0) {
    const tritrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * r.wallSec;
    }, 0);
    tritrigintmeanSec = Math.pow(tritrigintSum / known.length, 1 / 33);
  }
  const tritrigintmeanHours =
    tritrigintmeanSec === null ? null : tritrigintmeanSec / 3600;
  const body = {
    tritrigintmeanSec,
    tritrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTetratrigintmean) {
  // partial-jjjjjj: surface the BATCH_PLAN tetratrigintic mean (p=34
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the already-paired thirty-five-tet at
  // p in {-1, 0, 1, ..., 33} upward to p=34 as the second
  // tritrigint-prefixed exponent (tessera-triginta = 4+30) and first
  // even exponent past the p=33 odd milestone. Computed as
  // TTGM34 = (sum(x_i^34) / n)^(1/34) via Math.pow(s, 1/34); by the
  // generalized power-mean inequality TTGM34 dominates every lower-p
  // sibling so the monotone chain TTGM34 >= TRGM33 >= DTGM32 >= UTGM31
  // >= TGM30 >= NVGM29 >= ... >= AM >= GM >= HM now holds inline across
  // all thirty-six shell emitters. Handler uses the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w2;)
  // to avoid calling Math.pow in the inner reduce loop (34 = 32+2 =
  // 16+16+2, the cleanest {32,2}-partition factorization the cache
  // admits at this exponent), extending the partial-hhhhhh tritrigintmean
  // w32 * r.wallSec (33 = 32+1) two-summand odd-p decomposition by
  // bumping the trailing factor from r.wallSec to the cached w2 to reach
  // the next even exponent -- contrasting partial-ffffff duotrigintmean
  // w16 * w16 (32 = 16+16) which collapsed to a single w16^2 at the prior
  // power of two. Even p=34 erases sign and wallSec values are strictly
  // positive by construction so no sign guard is required (mirroring the
  // partial-yyy / partial-cccc / partial-gggg / partial-kkkk /
  // partial-oooo / partial-ssss / partial-wwww / partial-aaaaa /
  // partial-eeeee / partial-iiiii / partial-mmmmm / partial-qqqqq /
  // partial-ttttt / partial-xxxxx / partial-bbbbbb / partial-ffffff
  // even-p cadence). All-unknown degenerate case (known.length === 0)
  // prints a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/34) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the --batch-plan-cost-triple-tetratrigintmean-json
  // analog will be added in a later partial mirroring the
  // shell-first / JSON-second cadence established across every other
  // cost-emitter axis. Reuses computeBatchPlanCost() (partial-vv helper)
  // with zero new batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple tetratrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const tetratrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w2;
  }, 0);
  const tetratrigintmeanSec = Math.pow(tetratrigintSum / known.length, 1 / 34);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from tetratrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple tetratrigintic-mean wall-time: ${tetratrigintmeanSec.toFixed(0)} s (~${(tetratrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleTetratrigintmeanJson) {
  // partial-kkkkkk: structural JSON analog of partial-jjjjjj
  // --batch-plan-cost-triple-tetratrigintmean (p=34 Kolmogorov power-mean).
  // Emits one object {tetratrigintmeanSec, tetratrigintmeanHours,
  // knownCount, unknownCount} with tetratrigintmeanHours =
  // tetratrigintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=34 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-jjjjjj shell form so the two
  // flags cannot drift. Applies the same power-of-two squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; tetratrigintSum += w32 * w2;)
  // as partial-jjjjjj for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (34 = 32+2 = 16+16+2, the
  // cleanest {32,2}-partition factorization the cache admits at this
  // exponent) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then tetratrigintmeanSec =
  // Math.pow(tetratrigintSum / known.length, 1 / 34). Even p=34
  // erases sign and wallSec values are strictly positive by
  // construction (wall clock measurements) so no sign guard is
  // required (mirroring the partial-zzz / partial-dddd / partial-hhhh
  // / partial-llll / partial-pppp / partial-tttt / partial-xxxx /
  // partial-bbbbb / partial-fffff / partial-jjjjj / partial-nnnnn /
  // partial-rrrrr / partial-uuuuu / partial-yyyyy / partial-aaaaaa /
  // partial-cccccc / partial-gggggg even-p JSON cadence).
  // All-unknown degenerate case (known.length===0) emits
  // {tetratrigintmeanSec: null, tetratrigintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/34) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-jjjjjj and brings the Kolmogorov power-mean
  // family at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  // 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  // 29, 30, 31, 32, 33, 34} x {shell, JSON} to full shell/JSON
  // parity at thirty-six exponents; the monotone ordering
  // TTGM34 >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29
  //   >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24
  //   >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18
  //   >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM
  //   >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM
  //   >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let tetratrigintmeanSec = null;
  if (known.length > 0) {
    const tetratrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w2;
    }, 0);
    tetratrigintmeanSec = Math.pow(tetratrigintSum / known.length, 1 / 34);
  }
  const tetratrigintmeanHours =
    tetratrigintmeanSec === null ? null : tetratrigintmeanSec / 3600;
  const body = {
    tetratrigintmeanSec,
    tetratrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTriplePentatrigintmean) {
  // partial-llllll: surface the BATCH_PLAN pentatrigintic mean (p=35
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the already-paired thirty-six-tet at
  // p in {-1, 0, 1, ..., 34} upward to p=35 as the first odd exponent
  // past the p=34 even milestone. Computed as
  // PTGM35 = (sum(x_i^35) / n)^(1/35) via Math.pow(s, 1/35); by the
  // generalized power-mean inequality PTGM35 dominates every lower-p
  // sibling so the monotone chain PTGM35 >= TTGM34 >= TRGM33 >= DTGM32
  // >= UTGM31 >= TGM30 >= NVGM29 >= ... >= AM >= GM >= HM now holds
  // inline across all thirty-seven shell emitters. Handler uses the
  // cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w2 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (35 = 32+2+1 =
  // 16+16+2+1, the cleanest {32,2,1}-partition factorization the cache
  // admits at this exponent), extending the partial-jjjjjj
  // tetratrigintmean w32 * w2 (34 = 32+2) two-summand even-p
  // decomposition by one trailing r.wallSec factor to reach the next
  // odd exponent -- contrasting partial-hhhhhh tritrigintmean
  // w32 * r.wallSec (33 = 32+1) which used only the {32,1} partition.
  // Odd p=35 preserves sign but wallSec values are strictly positive
  // by construction (wall clock measurements) so no sign guard is
  // required (mirroring the partial-uuu / partial-aaaa / partial-eeee
  // / partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-cccccc / partial-gggggg / partial-kkkkk /
  // partial-sssss / partial-vvvvv / partial-zzzzz / partial-dddddd /
  // partial-hhhhhh odd-p cadence). All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and
  // exits 0 rather than (0/0)^(1/35) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-pentatrigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple pentatrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const pentatrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w2 * r.wallSec;
  }, 0);
  const pentatrigintmeanSec = Math.pow(pentatrigintSum / known.length, 1 / 35);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from pentatrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple pentatrigintic-mean wall-time: ${pentatrigintmeanSec.toFixed(0)} s (~${(pentatrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleHexatrigintmean) {
  // partial-nnnnnn: surface the BATCH_PLAN hexatrigintic mean (p=36
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the already-paired thirty-seven-tet at
  // p in {-1, 0, 1, ..., 35} upward to p=36 as the next even exponent
  // past the p=35 odd milestone. Computed as
  // HTGM36 = (sum(x_i^36) / n)^(1/36) via Math.pow(s, 1/36); by the
  // generalized power-mean inequality HTGM36 dominates every lower-p
  // sibling so the monotone chain HTGM36 >= PTGM35 >= TTGM34 >= TRGM33
  // >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= ... >= AM >= GM >= HM
  // now holds inline across all thirty-eight shell emitters. Handler
  // uses the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w4;)
  // to avoid calling Math.pow in the inner reduce loop (36 = 32+4 =
  // 16+16+4, the cleanest {32,4}-partition factorization the cache
  // admits at this exponent), extending the partial-llllll
  // pentatrigintmean w32 * w2 * r.wallSec (35 = 32+2+1) three-summand
  // odd-p decomposition by promoting the w2*r.wallSec tail to w4 to
  // reach the next even exponent -- contrasting partial-jjjjjj
  // tetratrigintmean w32 * w2 (34 = 32+2) which used the {32,2}
  // partition at two lower.
  // Even p=36 makes the inner summand a perfect square of w18 so the
  // sum is non-negative regardless of wallSec sign; wallSec values are
  // strictly positive by construction anyway (wall-clock measurements)
  // mirroring the partial-vv / partial-zzzz / partial-cccc / partial-gggg
  // / partial-kkkk / partial-oooo / partial-ssss / partial-wwww /
  // partial-aaaa even-p cadence. All-unknown degenerate case
  // (known.length === 0) prints a dedicated "unknown" summary and
  // exits 0 rather than (0/0)^(1/36) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-hexatrigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple hexatrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const hexatrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w4;
  }, 0);
  const hexatrigintmeanSec = Math.pow(hexatrigintSum / known.length, 1 / 36);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from hexatrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple hexatrigintic-mean wall-time: ${hexatrigintmeanSec.toFixed(0)} s (~${(hexatrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTriplePentatrigintmeanJson) {
  // partial-mmmmmm: structural JSON analog of partial-llllll
  // --batch-plan-cost-triple-pentatrigintmean (p=35 Kolmogorov power-mean).
  // Emits one object {pentatrigintmeanSec, pentatrigintmeanHours,
  // knownCount, unknownCount} with pentatrigintmeanHours =
  // pentatrigintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=35 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-llllll shell form so the two
  // flags cannot drift. Applies the same power-of-two squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16;
  //  pentatrigintSum += w32 * w2 * r.wallSec;)
  // as partial-llllll for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (35 = 32+2+1 = 16+16+2+1, the
  // cleanest {32,2,1}-partition factorization the cache admits at this
  // exponent) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then pentatrigintmeanSec =
  // Math.pow(pentatrigintSum / known.length, 1 / 35). Odd p=35
  // preserves sign but wallSec values are strictly positive by
  // construction (wall clock measurements) so no sign guard is
  // required (mirroring the partial-uuu / partial-aaaa / partial-eeee
  // / partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-cccccc / partial-gggggg / partial-kkkkk /
  // partial-sssss / partial-vvvvv / partial-zzzzz / partial-dddddd /
  // partial-hhhhhh / partial-llllll odd-p cadence).
  // All-unknown degenerate case (known.length===0) emits
  // {pentatrigintmeanSec: null, pentatrigintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/35) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-llllll and brings the Kolmogorov power-mean
  // family at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  // 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  // 29, 30, 31, 32, 33, 34, 35} x {shell, JSON} to full shell/JSON
  // parity at thirty-seven exponents; the monotone ordering
  // PTGM35 >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30
  //   >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25
  //   >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  //   >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM
  //   >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let pentatrigintmeanSec = null;
  if (known.length > 0) {
    const pentatrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w2 * r.wallSec;
    }, 0);
    pentatrigintmeanSec = Math.pow(pentatrigintSum / known.length, 1 / 35);
  }
  const pentatrigintmeanHours =
    pentatrigintmeanSec === null ? null : pentatrigintmeanSec / 3600;
  const body = {
    pentatrigintmeanSec,
    pentatrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleHexatrigintmeanJson) {
  // partial-oooooo: structural JSON analog of partial-nnnnnn
  // --batch-plan-cost-triple-hexatrigintmean (p=36 Kolmogorov power-mean).
  // Emits one object {hexatrigintmeanSec, hexatrigintmeanHours,
  // knownCount, unknownCount} with hexatrigintmeanHours =
  // hexatrigintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=36 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-nnnnnn shell form so the two
  // flags cannot drift. Applies the same power-of-two squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16;
  //  hexatrigintSum += w32 * w4;)
  // as partial-nnnnnn for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (36 = 32+4, the cleanest
  // {32,4}-partition factorization the cache admits at this exponent,
  // one step past partial-jjjjjj tetratrigintmean w32 * w2 two-summand
  // 34=32+2 and partial-ffffff duotrigintmean w32 single-summand
  // 32=2^5 decomposition) so the JSON and shell bodies agree
  // bit-for-bit on IEEE-754 across Node versions, then
  // hexatrigintmeanSec = Math.pow(hexatrigintSum / known.length, 1 / 36).
  // Even p=36 makes the inner summand a perfect square of w18 so the
  // sum is non-negative regardless of wallSec sign; wallSec values are
  // strictly positive by construction anyway (wall clock measurements)
  // mirroring the partial-vv / partial-zzzz / partial-cccc / partial-gggg
  // / partial-kkkk / partial-oooo / partial-ssss / partial-wwww /
  // partial-aaaa / partial-cccccc / partial-gggggg / partial-kkkkkk
  // even-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {hexatrigintmeanSec: null, hexatrigintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/36) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-nnnnnn and brings the Kolmogorov power-mean
  // family at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  // 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  // 29, 30, 31, 32, 33, 34, 35, 36} x {shell, JSON} to full
  // shell/JSON parity at thirty-eight exponents; the monotone ordering
  // HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30
  //   >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25
  //   >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  //   >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM
  //   >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let hexatrigintmeanSec = null;
  if (known.length > 0) {
    const hexatrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w4;
    }, 0);
    hexatrigintmeanSec = Math.pow(hexatrigintSum / known.length, 1 / 36);
  }
  const hexatrigintmeanHours =
    hexatrigintmeanSec === null ? null : hexatrigintmeanSec / 3600;
  const body = {
    hexatrigintmeanSec,
    hexatrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleHeptatrigintmean) {
  // partial-pppppp: surface the BATCH_PLAN heptatrigintic mean (p=37
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, extending the already-paired thirty-eight-tet at
  // p in {-1, 0, 1, ..., 36} upward to p=37 as the first odd exponent
  // past the p=36 even milestone. Computed as
  // HPTGM37 = (sum(x_i^37) / n)^(1/37) via Math.pow(s, 1/37); by the
  // generalized power-mean inequality HPTGM37 dominates every lower-p
  // sibling so the monotone chain HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34
  // >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= ... >= AM >= GM
  // >= HM now holds inline across all thirty-nine shell emitters.
  // Handler uses the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w4 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (37 = 32+4+1 =
  // 16+16+4+1, the cleanest {32,4,1}-partition factorization the cache
  // admits at this exponent), extending the partial-nnnnnn
  // hexatrigintmean w32 * w4 (36 = 32+4) two-summand even-p
  // decomposition by one trailing r.wallSec factor to reach the next
  // odd exponent -- contrasting partial-llllll pentatrigintmean
  // w32 * w2 * r.wallSec (35 = 32+2+1) which used the {32,2,1}
  // partition two lower.
  // Odd p=37 preserves sign but wallSec values are strictly positive
  // by construction (wall clock measurements) so no sign guard is
  // required (mirroring the partial-uuu / partial-aaaa / partial-eeee
  // / partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-cccccc / partial-gggggg / partial-kkkkk /
  // partial-sssss / partial-vvvvv / partial-zzzzz / partial-dddddd /
  // partial-hhhhhh / partial-llllll odd-p cadence).
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // "unknown" summary and exits 0 rather than (0/0)^(1/37) = NaN. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. Shell-only this partial;
  // the --batch-plan-cost-triple-heptatrigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple heptatrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const heptatrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w4 * r.wallSec;
  }, 0);
  const heptatrigintmeanSec = Math.pow(heptatrigintSum / known.length, 1 / 37);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from heptatrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple heptatrigintic-mean wall-time: ${heptatrigintmeanSec.toFixed(0)} s (~${(heptatrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleHeptatrigintmeanJson) {
  // partial-qqqqqq: structural JSON analog of partial-pppppp
  // --batch-plan-cost-triple-heptatrigintmean (p=37 Kolmogorov power-mean).
  // Emits one object {heptatrigintmeanSec, heptatrigintmeanHours,
  // knownCount, unknownCount} with heptatrigintmeanHours =
  // heptatrigintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=37 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-pppppp shell form so the two
  // flags cannot drift. Applies the same power-of-two squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16;
  //  heptatrigintSum += w32 * w4 * r.wallSec;)
  // as partial-pppppp for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (37 = 32+4+1 = 16+16+4+1, the
  // cleanest {32,4,1}-partition factorization the cache admits at this
  // exponent, extending the partial-nnnnnn hexatrigintmean w32 * w4
  // 36=32+4 two-summand even-p decomposition by one trailing r.wallSec
  // factor to reach the next odd exponent, contrasting partial-llllll
  // pentatrigintmean w32 * w2 * r.wallSec 35=32+2+1 which used the
  // {32,2,1} partition two lower) so the JSON and shell bodies agree
  // bit-for-bit on IEEE-754 across Node versions, then
  // heptatrigintmeanSec = Math.pow(heptatrigintSum / known.length, 1 / 37).
  // Odd p=37 preserves sign but wallSec values are strictly positive
  // by construction (wall clock measurements) so no sign guard is
  // required, mirroring the partial-uuu / partial-aaaa / partial-eeee
  // / partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-cccccc / partial-gggggg / partial-kkkkk /
  // partial-sssss / partial-vvvvv / partial-zzzzz / partial-dddddd /
  // partial-hhhhhh / partial-llllll / partial-pppppp odd-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {heptatrigintmeanSec: null, heptatrigintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/37) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-pppppp and brings the Kolmogorov power-mean
  // family at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  // 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  // 29, 30, 31, 32, 33, 34, 35, 36, 37} x {shell, JSON} to full
  // shell/JSON parity at thirty-nine exponents; the monotone ordering
  // HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31
  //   >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25
  //   >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  //   >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM
  //   >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let heptatrigintmeanSec = null;
  if (known.length > 0) {
    const heptatrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w4 * r.wallSec;
    }, 0);
    heptatrigintmeanSec = Math.pow(heptatrigintSum / known.length, 1 / 37);
  }
  const heptatrigintmeanHours =
    heptatrigintmeanSec === null ? null : heptatrigintmeanSec / 3600;
  const body = {
    heptatrigintmeanSec,
    heptatrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleOctotrigintmean) {
  // partial-rrrrrr: surface the BATCH_PLAN octotrigintic mean (p=38
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, the fortieth power-mean sibling extending partial-pppppp
  // heptatrigintmean (p=37) upward to p=38 as the first octotrigint-
  // prefixed exponent (octo-triginta = 8 + 30) and the first even
  // exponent past the p=37 odd milestone. Computed as
  // OTGM38 = (sum(x_i^38) / n)^(1/38) via Math.pow(s, 1/38); by the
  // generalized power-mean inequality OTGM38 dominates every lower-p
  // sibling so the monotone chain
  // OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32
  //   >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26
  //   >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20
  //   >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM
  //   >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all forty shell emitters. Handler uses the
  // cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w4 * w2;)
  // to avoid calling Math.pow in the inner reduce loop (38 = 32+4+2 =
  // 16+16+4+2, the cleanest {32,4,2}-partition factorization the cache
  // admits at this exponent), promoting the partial-pppppp
  // heptatrigintmean w32 * w4 * r.wallSec (37 = 32+4+1) three-summand
  // odd-p tail to the pre-cached w2 to reach the next even exponent --
  // contrasting partial-nnnnnn hexatrigintmean w32 * w4 (36 = 32+4)
  // which used a smaller two-summand {32,4} partition two lower.
  // Even p=38 makes the inner summand a perfect square of
  // w19 = w16 * w2 * r.wallSec so the running sum is non-negative
  // regardless of wallSec sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) anyway. All-unknown
  // degenerate case (known.length === 0) prints a dedicated "unknown"
  // summary and exits 0 rather than (0/0)^(1/38) = NaN. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-octotrigintmean-json analog will follow in
  // a later partial mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple octotrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const octotrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w4 * w2;
  }, 0);
  const octotrigintmeanSec = Math.pow(octotrigintSum / known.length, 1 / 38);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from octotrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple octotrigintic-mean wall-time: ${octotrigintmeanSec.toFixed(0)} s (~${(octotrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleOctotrigintmeanJson) {
  // partial-ssssss: structural JSON analog of partial-rrrrrr
  // --batch-plan-cost-triple-octotrigintmean (p=38 Kolmogorov power-mean).
  // Emits one object {octotrigintmeanSec, octotrigintmeanHours,
  // knownCount, unknownCount} with octotrigintmeanHours =
  // octotrigintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=38 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-rrrrrr shell form so the two
  // flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16;
  //  octotrigintSum += w32 * w4 * w2;)
  // as partial-rrrrrr for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (38 = 32+4+2, the cleanest
  // {32,4,2}-partition factorization the cache admits at this even
  // exponent, promoting the partial-pppppp heptatrigintmean
  // w32 * w4 * r.wallSec (37=32+4+1) three-summand odd-p tail to the
  // pre-cached w2 to reach the next even exponent) so the JSON and
  // shell bodies agree bit-for-bit on IEEE-754 across Node versions,
  // then octotrigintmeanSec = Math.pow(octotrigintSum / known.length, 1 / 38).
  // Even p=38 erases sign and wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is
  // required, mirroring the partial-yyy / partial-cccc / partial-gggg
  // / partial-kkkk / partial-oooo / partial-ssss / partial-wwww /
  // partial-aaaaa / partial-eeeee / partial-iiiii / partial-mmmmm /
  // partial-qqqqq / partial-uuuuu / partial-yyyyy / partial-ccccccc /
  // partial-eeeeee / partial-jjjjjj / partial-nnnnnn even-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {octotrigintmeanSec: null, octotrigintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/38) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-rrrrrr and brings the Kolmogorov power-mean
  // family at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  // 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  // 29, 30, 31, 32, 33, 34, 35, 36, 37, 38} x {shell, JSON} to full
  // shell/JSON parity at forty exponents; the monotone ordering
  // OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32
  //   >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26
  //   >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20
  //   >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM
  //   >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let octotrigintmeanSec = null;
  if (known.length > 0) {
    const octotrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w4 * w2;
    }, 0);
    octotrigintmeanSec = Math.pow(octotrigintSum / known.length, 1 / 38);
  }
  const octotrigintmeanHours =
    octotrigintmeanSec === null ? null : octotrigintmeanSec / 3600;
  const body = {
    octotrigintmeanSec,
    octotrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleNonatrigintmean) {
  // partial-tttttt: surface the BATCH_PLAN nonatrigintic mean (p=39
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, the forty-first power-mean sibling extending partial-rrrrrr
  // octotrigintmean (p=38) upward to p=39 as the first odd exponent past
  // the p=38 even milestone (nona-triginta = 9 + 30). Computed as
  // NTGM39 = (sum(x_i^39) / n)^(1/39) via Math.pow(s, 1/39); by the
  // generalized power-mean inequality NTGM39 dominates every lower-p
  // sibling so the monotone chain
  // NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33
  //   >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27
  //   >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21
  //   >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM
  //   >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM
  //   >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all forty-one shell emitters. Handler uses
  // the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w4 * w2 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (39 = 32+4+2+1,
  // the {32,4,2,1}-partition factorization the cache admits at this
  // exponent), promoting the partial-rrrrrr octotrigintmean w32 * w4 *
  // w2 (38 = 32+4+2) three-summand even-p decomposition by one trailing
  // r.wallSec factor to reach the next odd exponent -- contrasting
  // partial-pppppp heptatrigintmean w32 * w4 * r.wallSec (37 = 32+4+1)
  // which used the {32,4,1} partition two lower.
  // Odd p=39 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required
  // (mirroring the partial-uuu / partial-aaaa / partial-eeee /
  // partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-cccccc / partial-gggggg / partial-kkkkk /
  // partial-sssss / partial-vvvvv / partial-zzzzz / partial-dddddd /
  // partial-hhhhhh / partial-llllll / partial-pppppp odd-p cadence).
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // "unknown" summary and exits 0 rather than (0/0)^(1/39) = NaN. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. Shell-only this partial;
  // the --batch-plan-cost-triple-nonatrigintmean-json analog will be
  // added in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple nonatrigintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const nonatrigintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w4 * w2 * r.wallSec;
  }, 0);
  const nonatrigintmeanSec = Math.pow(nonatrigintSum / known.length, 1 / 39);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from nonatrigintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple nonatrigintic-mean wall-time: ${nonatrigintmeanSec.toFixed(0)} s (~${(nonatrigintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleNonatrigintmeanJson) {
  // partial-uuuuuu: structural JSON analog of partial-tttttt
  // --batch-plan-cost-triple-nonatrigintmean (p=39 Kolmogorov power-mean).
  // Emits one object {nonatrigintmeanSec, nonatrigintmeanHours,
  // knownCount, unknownCount} with nonatrigintmeanHours =
  // nonatrigintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=39 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-tttttt shell form so the two
  // flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16;
  //  nonatrigintSum += w32 * w4 * w2 * r.wallSec;)
  // as partial-tttttt for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (39 = 32+4+2+1, the {32,4,2,1}-
  // partition factorization the cache admits at this odd exponent,
  // promoting the partial-rrrrrr octotrigintmean w32 * w4 * w2
  // (38 = 32+4+2) three-summand even-p decomposition by one trailing
  // r.wallSec factor to reach the next odd exponent -- contrasting
  // partial-pppppp heptatrigintmean w32 * w4 * r.wallSec (37 = 32+4+1)
  // which used the {32,4,1} partition two lower) so the JSON and
  // shell bodies agree bit-for-bit on IEEE-754 across Node versions,
  // then nonatrigintmeanSec = Math.pow(nonatrigintSum / known.length, 1 / 39).
  // Odd p=39 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is
  // required, mirroring the partial-uuu / partial-aaaa / partial-eeee /
  // partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-cccccc / partial-gggggg / partial-kkkkk /
  // partial-sssss / partial-vvvvv / partial-zzzzz / partial-dddddd /
  // partial-hhhhhh / partial-llllll / partial-pppppp / partial-tttttt
  // odd-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {nonatrigintmeanSec: null, nonatrigintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/39) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-tttttt and brings the Kolmogorov power-mean
  // family at p in {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  // 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  // 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39} x {shell, JSON} to full
  // shell/JSON parity at forty-one exponents; the monotone ordering
  // NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33
  //   >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27
  //   >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21
  //   >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM
  //   >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM
  //   >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let nonatrigintmeanSec = null;
  if (known.length > 0) {
    const nonatrigintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w4 * w2 * r.wallSec;
    }, 0);
    nonatrigintmeanSec = Math.pow(nonatrigintSum / known.length, 1 / 39);
  }
  const nonatrigintmeanHours =
    nonatrigintmeanSec === null ? null : nonatrigintmeanSec / 3600;
  const body = {
    nonatrigintmeanSec,
    nonatrigintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuadragintmean) {
  // partial-vvvvvv: surface the BATCH_PLAN quadragintic mean (p=40
  // Kolmogorov power-mean) of per-triple wall-times as a one-line
  // diagnostic, the forty-second power-mean sibling extending
  // partial-tttttt nonatrigintmean (p=39) upward to p=40 as the first
  // quadragint-prefixed exponent (quadraginta = 40) and the first even
  // exponent past the p=39 odd milestone. Computed as
  // QGM40 = (sum(x_i^40) / n)^(1/40) via Math.pow(s, 1/40); by the
  // generalized power-mean inequality QGM40 dominates every lower-p
  // sibling so the monotone chain
  // QGM40 >= NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34
  //   >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28
  //   >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22
  //   >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15
  //   >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM
  //   >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all forty-two shell emitters. Handler uses
  // the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w8;)
  // to avoid calling Math.pow in the inner reduce loop (40 = 32+8,
  // the cleanest two-summand {32,8}-partition factorization the cache
  // admits at this even exponent), trimming the partial-tttttt
  // nonatrigintmean w32 * w4 * w2 * r.wallSec (39 = 32+4+2+1)
  // four-summand odd-p decomposition back to a compact two-summand
  // form at the next even exponent -- contrasting partial-rrrrrr
  // octotrigintmean w32 * w4 * w2 (38 = 32+4+2) which used the
  // {32,4,2} three-summand partition two lower. Even p=40 makes the
  // inner summand a perfect square of w20 = w16 * w4 so the running
  // sum is non-negative regardless of wallSec sign; wallSec values
  // are strictly positive by construction (wall-clock measurements)
  // anyway. All-unknown degenerate case (known.length === 0) prints
  // a dedicated "unknown" summary and exits 0 rather than
  // (0/0)^(1/40) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Shell-only this partial; the
  // --batch-plan-cost-triple-quadragintmean-json analog will follow in
  // a later partial mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8;
  }, 0);
  const quadragintmeanSec = Math.pow(quadragintSum / known.length, 1 / 40);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quadragintic-mean wall-time: ${quadragintmeanSec.toFixed(0)} s (~${(quadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuadragintmeanJson) {
  // partial-wwwwww: structural JSON analog of
  // --batch-plan-cost-triple-quadragintmean (p=40 Kolmogorov power-mean).
  // Emits one object {quadragintmeanSec, quadragintmeanHours,
  // knownCount, unknownCount} with quadragintmeanHours =
  // quadragintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=40 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-vvvvvv shell form so the two
  // flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; quadragintSum += w32 * w8;)
  // as partial-vvvvvv for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (40 = 32+8, the cleanest
  // two-summand {32,8}-partition factorization the cache admits at
  // this even exponent, trimming the partial-uuuuuu nonatrigintmean-json
  // w32 * w4 * w2 * r.wallSec (39 = 32+4+2+1) four-summand odd-p
  // decomposition back to a compact two-summand form at the next even
  // exponent) so the JSON and shell bodies agree bit-for-bit on
  // IEEE-754 across Node versions, then
  // quadragintmeanSec = Math.pow(quadragintSum / known.length, 1 / 40).
  // Even p=40 erases sign and wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is
  // required, mirroring the partial-yyy / partial-cccc / partial-gggg /
  // partial-kkkk / partial-oooo / partial-ssss / partial-wwww /
  // partial-aaaaa / partial-eeeee / partial-iiiii / partial-mmmmm /
  // partial-qqqqq / partial-uuuuu / partial-yyyyy / partial-ccccccc /
  // partial-eeeeee / partial-jjjjjj / partial-nnnnnn / partial-rrrrrr
  // even-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {quadragintmeanSec: null, quadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/40) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-vvvvvv and brings the Kolmogorov power-mean family
  // at p in {-1, 0, 1..40} x {shell, JSON} to full shell/JSON parity at
  // forty-two exponents (eighty-four emitters in total across the
  // power-mean axis); the monotone ordering
  // QGM40 >= NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34
  //   >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28
  //   >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22
  //   >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15
  //   >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM
  //   >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quadragintmeanSec = null;
  if (known.length > 0) {
    const quadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8;
    }, 0);
    quadragintmeanSec = Math.pow(quadragintSum / known.length, 1 / 40);
  }
  const quadragintmeanHours =
    quadragintmeanSec === null ? null : quadragintmeanSec / 3600;
  const body = {
    quadragintmeanSec,
    quadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleUnquadragintmean) {
  // partial-xxxxxx: pure-shell data emitter surfacing the unquadragintic
  // mean (p=41 Kolmogorov power-mean) of per-triple wall-times across
  // the known-wallSec rows of BATCH_PLAN as the forty-third power-mean
  // sibling extending partial-vvvvvv quadragintmean (p=40) upward to
  // p=41 as the first unquadragint-prefixed exponent (un-quadraginta =
  // 1 + 40) and the first odd exponent past the p=40 even milestone.
  // Computed as UQGM41 = (sum(x_i^41) / n)^(1/41) via Math.pow(s, 1/41);
  // by the generalized power-mean inequality UQGM41 dominates every
  // lower-p sibling so the monotone chain
  // UQGM41 >= QGM40 >= NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35
  //   >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29
  //   >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23
  //   >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM
  //   >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  //   >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all forty-three shell emitters. Handler uses
  // the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w8 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (41 = 32+8+1,
  // the cleanest {32,8,1}-partition factorization the cache admits at
  // this odd exponent), promoting the partial-vvvvvv quadragintmean
  // w32 * w8 (40 = 32+8) two-summand even-p decomposition by one
  // trailing r.wallSec factor to reach the next odd exponent --
  // contrasting partial-tttttt nonatrigintmean
  // w32 * w4 * w2 * r.wallSec (39 = 32+4+2+1) which used the
  // {32,4,2,1} four-summand partition two lower. Odd p=41 preserves
  // sign but wallSec values are strictly positive by construction
  // (wall-clock measurements) so no sign guard is required, mirroring
  // the partial-uuu / partial-aaaa / partial-eeee / partial-iiii /
  // partial-mmmm / partial-qqqq / partial-uuuu / partial-yyyy /
  // partial-cccccc / partial-gggggg / partial-kkkkk / partial-sssss /
  // partial-vvvvv / partial-zzzzz / partial-dddddd / partial-hhhhhh /
  // partial-llllll / partial-pppppp / partial-tttttt odd-p cadence.
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // unknown summary and exits 0 rather than (0/0)^(1/41) = NaN. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. Shell-only this partial;
  // the --batch-plan-cost-triple-unquadragintmean-json analog will
  // follow in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple unquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const unquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8 * r.wallSec;
  }, 0);
  const unquadragintmeanSec = Math.pow(unquadragintSum / known.length, 1 / 41);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from unquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple unquadragintic-mean wall-time: ${unquadragintmeanSec.toFixed(0)} s (~${(unquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleUnquadragintmeanJson) {
  // partial-yyyyyy: structural JSON analog of
  // --batch-plan-cost-triple-unquadragintmean (p=41 Kolmogorov power-mean).
  // Emits one object {unquadragintmeanSec, unquadragintmeanHours,
  // knownCount, unknownCount} with unquadragintmeanHours =
  // unquadragintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=41 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-xxxxxx shell form so the two
  // flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; unquadragintSum += w32 * w8 * r.wallSec;)
  // as partial-xxxxxx for numerical-stability parity, avoiding
  // Math.pow in the inner reduce loop (41 = 32+8+1, the cleanest
  // {32,8,1}-partition factorization the cache admits at this odd
  // exponent, promoting the partial-wwwwww quadragintmean-json
  // w32 * w8 (40 = 32+8) two-summand even-p decomposition by one
  // trailing r.wallSec factor to reach the next odd exponent --
  // contrasting partial-uuuuuu nonatrigintmean-json
  // w32 * w4 * w2 * r.wallSec (39 = 32+4+2+1) which used the
  // {32,4,2,1} four-summand partition two lower) so the JSON and
  // shell bodies agree bit-for-bit on IEEE-754 across Node versions,
  // then
  // unquadragintmeanSec = Math.pow(unquadragintSum / known.length, 1 / 41).
  // Odd p=41 preserves sign but wallSec values are strictly positive
  // by construction (wall-clock measurements) so no sign guard is
  // required, mirroring the partial-uuu / partial-aaaa / partial-eeee /
  // partial-iiii / partial-mmmm / partial-qqqq / partial-uuuu /
  // partial-yyyy / partial-cccccc / partial-gggggg / partial-kkkkk /
  // partial-sssss / partial-vvvvv / partial-zzzzz / partial-dddddd /
  // partial-hhhhhh / partial-llllll / partial-pppppp / partial-tttttt
  // odd-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {unquadragintmeanSec: null, unquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/41) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. Completes the {shell, JSON}
  // pair for partial-xxxxxx and brings the Kolmogorov power-mean family
  // at p in {-1, 0, 1..41} x {shell, JSON} to full shell/JSON parity at
  // forty-three exponents (eighty-six emitters in total across the
  // power-mean axis); the monotone ordering
  // UQGM41 >= QGM40 >= NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36 >= PTGM35
  //   >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29
  //   >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23
  //   >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM
  //   >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  //   >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let unquadragintmeanSec = null;
  if (known.length > 0) {
    const unquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8 * r.wallSec;
    }, 0);
    unquadragintmeanSec = Math.pow(unquadragintSum / known.length, 1 / 41);
  }
  const unquadragintmeanHours =
    unquadragintmeanSec === null ? null : unquadragintmeanSec / 3600;
  const body = {
    unquadragintmeanSec,
    unquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleDuoquadragintmean) {
  // partial-zzzzzz: pure-shell data emitter surfacing the duoquadragintic
  // mean (p=42 Kolmogorov power-mean) of per-triple wall-times across
  // the known-wallSec rows of BATCH_PLAN as the forty-fourth power-mean
  // sibling extending partial-xxxxxx unquadragintmean (p=41) upward to
  // p=42 as the second duoquadragint-prefixed exponent past the p=40
  // quadragint milestone (duo-quadraginta = 2 + 40) and the next even
  // exponent after p=40. Computed as DQGM42 = (sum(x_i^42) / n)^(1/42)
  // via Math.pow(s, 1/42); by the generalized power-mean inequality
  // DQGM42 dominates every lower-p sibling so the monotone chain
  // DQGM42 >= UQGM41 >= QGM40 >= NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36
  //   >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30 >= NVGM29
  //   >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24 >= TVGM23
  //   >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18 >= SPM17 >= SDM
  //   >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM
  //   >= SXM >= QIM >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all forty-four shell emitters. Handler uses
  // the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w8 * w2;)
  // to avoid calling Math.pow in the inner reduce loop (42 = 32+8+2,
  // the cleanest {32,8,2}-partition factorization the cache admits at
  // this even exponent), promoting the partial-xxxxxx unquadragintmean
  // w32 * w8 * r.wallSec (41 = 32+8+1) three-summand odd-p decomposition
  // by swapping the trailing r.wallSec for w2 to reach the next even
  // exponent -- contrasting partial-vvvvvv quadragintmean
  // w32 * w8 (40 = 32+8) two-summand even-p decomposition two lower
  // which did not need a trailing square. Even p=42 makes sign a non-issue
  // (x^42 >= 0 for all real x) but wallSec values are strictly positive
  // by construction (wall-clock measurements) anyway, so no sign guard
  // is required, mirroring the partial-vv / partial-zz / partial-dddd /
  // partial-hhhh / partial-llll / partial-pppp / partial-tttt /
  // partial-xxxx / partial-bbbbbb / partial-ffffff / partial-jjjjjj /
  // partial-nnnnnn / partial-rrrrrr / partial-vvvvvv even-p cadence.
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // unknown summary and exits 0 rather than (0/0)^(1/42) = NaN. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. Shell-only this partial;
  // the --batch-plan-cost-triple-duoquadragintmean-json analog will
  // follow in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple duoquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const duoquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8 * w2;
  }, 0);
  const duoquadragintmeanSec = Math.pow(duoquadragintSum / known.length, 1 / 42);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from duoquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple duoquadragintic-mean wall-time: ${duoquadragintmeanSec.toFixed(0)} s (~${(duoquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleDuoquadragintmeanJson) {
  // partial-aaaaaaa: structural JSON analog of
  // --batch-plan-cost-triple-duoquadragintmean (p=42 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-zzzzzz and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..42} x {shell, JSON}
  // to full shell/JSON parity at forty-four exponents (eighty-eight
  // emitters in total across the power-mean axis).
  // Emits one object {duoquadragintmeanSec, duoquadragintmeanHours,
  // knownCount, unknownCount} with duoquadragintmeanHours =
  // duoquadragintmeanSec / 3600 (null when knownCount===0) so Python / jq
  // offline-worker drivers can consume the p=42 power-mean central-tendency
  // signal directly without re-parsing the one-line shell summary and
  // without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence established across every prior JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-zzzzzz shell form so the two flags cannot drift. Applies the
  // same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; duoquadragintSum += w32 * w8 * w2;)
  // as partial-zzzzzz for numerical-stability parity, avoiding Math.pow
  // in the inner reduce loop (42 = 32+8+2, the cleanest {32,8,2}-partition
  // factorization the cache admits at this even exponent, promoting the
  // partial-yyyyyy unquadragintmean-json w32 * w8 * r.wallSec (41 = 32+8+1)
  // three-summand odd-p decomposition by swapping the trailing r.wallSec
  // for w2 to reach the next even exponent -- contrasting partial-wwwwww
  // quadragintmean-json w32 * w8 (40 = 32+8) two-summand even-p
  // decomposition two lower which did not need a trailing square) so the
  // JSON and shell bodies agree bit-for-bit on IEEE-754 across Node
  // versions, then
  // duoquadragintmeanSec = Math.pow(duoquadragintSum / known.length, 1 / 42).
  // Even p=42 makes x^42 >= 0 for all real x and wallSec values are
  // strictly positive by construction (wall-clock measurements) so no sign
  // guard is required, mirroring the partial-ww / partial-aaaa (actually
  // even-p) / partial-bbbbbb / partial-ffffff / partial-jjjjjj /
  // partial-nnnnnn / partial-rrrrrr / partial-vvvvvv even-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {duoquadragintmeanSec: null, duoquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/42) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. The monotone ordering
  // DQGM42 >= UQGM41 >= QGM40 >= NTGM39 >= OTGM38 >= HPTGM37 >= HTGM36
  //   >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31 >= TGM30
  //   >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25 >= QVGM24
  //   >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19 >= OCDM18
  //   >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM >= DCM
  //   >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM >= AM
  //   >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let duoquadragintmeanSec = null;
  if (known.length > 0) {
    const duoquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8 * w2;
    }, 0);
    duoquadragintmeanSec = Math.pow(duoquadragintSum / known.length, 1 / 42);
  }
  const duoquadragintmeanHours =
    duoquadragintmeanSec === null ? null : duoquadragintmeanSec / 3600;
  const body = {
    duoquadragintmeanSec,
    duoquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTresquadragintmean) {
  // partial-bbbbbbb: pure-shell data emitter surfacing the tresquadragintic
  // mean (p=43 Kolmogorov power-mean) of per-triple wall-times across
  // the known-wallSec rows of BATCH_PLAN as the forty-fifth power-mean
  // sibling extending partial-zzzzzz duoquadragintmean (p=42) upward to
  // p=43 as the third tresquadragint-prefixed exponent (tres-quadraginta
  // = 3 + 40) past the p=40 quadragint milestone and the next odd
  // exponent after p=41. Computed as TQGM43 = (sum(x_i^43) / n)^(1/43)
  // via Math.pow(s, 1/43); by the generalized power-mean inequality
  // TQGM43 dominates every lower-p sibling so the monotone chain
  // TQGM43 >= DQGM42 >= UQGM41 >= QGM40 >= NTGM39 >= OTGM38 >= HPTGM37
  //   >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31
  //   >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25
  //   >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  //   >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM
  //   >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM
  //   >= AM >= GM >= HM
  // now holds inline across all forty-five shell emitters. Handler uses
  // the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w8 * w2 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (43 = 32+8+2+1,
  // the cleanest {32,8,2,1}-partition factorization the cache admits at
  // this odd exponent), promoting the partial-zzzzzz duoquadragintmean
  // w32 * w8 * w2 (42 = 32+8+2) three-summand even-p decomposition by
  // appending a trailing r.wallSec factor to reach the next odd
  // exponent, and contrasting partial-xxxxxx unquadragintmean
  // w32 * w8 * r.wallSec (41 = 32+8+1) three-summand odd-p decomposition
  // two lower which used a {32,8,1} three-summand partition without the
  // w2 middle factor. Odd p=43 preserves sign but wallSec values are
  // strictly positive by construction (wall-clock measurements) so no
  // sign guard is required, mirroring the partial-uuu / partial-aaaa /
  // partial-eeee / partial-iiii / partial-mmmm / partial-qqqq /
  // partial-uuuu / partial-yyyy / partial-cccccc / partial-gggggg /
  // partial-kkkkk / partial-sssss / partial-vvvvv / partial-zzzzz /
  // partial-dddddd / partial-hhhhhh / partial-llllll / partial-pppppp /
  // partial-tttttt / partial-xxxxxx odd-p cadence.
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // unknown summary and exits 0 rather than (0/0)^(1/43) = NaN. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. Shell-only this partial;
  // the --batch-plan-cost-triple-tresquadragintmean-json analog will
  // follow in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple tresquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const tresquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8 * w2 * r.wallSec;
  }, 0);
  const tresquadragintmeanSec = Math.pow(tresquadragintSum / known.length, 1 / 43);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from tresquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple tresquadragintic-mean wall-time: ${tresquadragintmeanSec.toFixed(0)} s (~${(tresquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleTresquadragintmeanJson) {
  // partial-ccccccc: structural JSON analog of
  // --batch-plan-cost-triple-tresquadragintmean (p=43 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-bbbbbbb and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..43} x {shell, JSON}
  // to full shell/JSON parity at forty-five exponents (ninety emitters in
  // total across the power-mean axis).
  // Emits one object {tresquadragintmeanSec, tresquadragintmeanHours,
  // knownCount, unknownCount} with tresquadragintmeanHours =
  // tresquadragintmeanSec / 3600 (null when knownCount===0) so Python / jq
  // offline-worker drivers can consume the p=43 power-mean central-tendency
  // signal directly without re-parsing the one-line shell summary and
  // without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence established across every prior JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-bbbbbbb shell form so the two flags cannot drift. Applies the
  // same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; tresquadragintSum += w32 * w8 * w2 * r.wallSec;)
  // as partial-bbbbbbb for numerical-stability parity, avoiding Math.pow in
  // the inner reduce loop (43 = 32+8+2+1, the cleanest {32,8,2,1}-partition
  // factorization the cache admits at this odd exponent), promoting the
  // partial-aaaaaaa duoquadragintmean-json w32 * w8 * w2 (42 = 32+8+2)
  // three-summand even-p decomposition by appending a trailing r.wallSec
  // factor to reach the next odd exponent, and contrasting partial-yyyyyy
  // unquadragintmean-json w32 * w8 * r.wallSec (41 = 32+8+1) three-summand
  // odd-p decomposition two lower which used a {32,8,1} three-summand
  // partition without the w2 middle factor, so the JSON and shell bodies
  // agree bit-for-bit on IEEE-754 across Node versions, then
  // tresquadragintmeanSec = Math.pow(tresquadragintSum / known.length, 1 / 43).
  // Odd p=43 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // mirroring the partial-uu / partial-yy / partial-cccc / partial-gggg /
  // partial-kkkk / partial-oooo / partial-ssss / partial-wwww /
  // partial-aaaaa / partial-eeeee / partial-iiiii / partial-mmmmm /
  // partial-qqqqq / partial-uuuuu / partial-yyyyy / partial-bbbbbb /
  // partial-ffffff / partial-jjjjjj / partial-nnnnnn / partial-rrrrrr /
  // partial-vvvvvv / partial-zzzzzz / partial-iiiiii odd-p JSON cadence.
  // All-unknown degenerate case (known.length===0) emits
  // {tresquadragintmeanSec: null, tresquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/43) = NaN, matching the JSON degenerate cadence across
  // every prior JSON power-mean emitter. The monotone ordering
  // TQGM43 >= DQGM42 >= UQGM41 >= QGM40 >= NTGM39 >= OTGM38 >= HPTGM37
  //   >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32 >= UTGM31
  //   >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26 >= QIVGM25
  //   >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20 >= NVDM19
  //   >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM >= DUM >= UDM
  //   >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM >= CM >= QM
  //   >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers
  // gating the ~20 CPU-hour batch. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let tresquadragintmeanSec = null;
  if (known.length > 0) {
    const tresquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8 * w2 * r.wallSec;
    }, 0);
    tresquadragintmeanSec = Math.pow(tresquadragintSum / known.length, 1 / 43);
  }
  const tresquadragintmeanHours =
    tresquadragintmeanSec === null ? null : tresquadragintmeanSec / 3600;
  const body = {
    tresquadragintmeanSec,
    tresquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuorquadragintmean) {
  // partial-ddddddd: pure-shell data emitter surfacing the quattuorquadragintic
  // mean (p=44 Kolmogorov power-mean) of per-triple wall-times across
  // the known-wallSec rows of BATCH_PLAN as the forty-sixth power-mean
  // sibling extending partial-bbbbbbb tresquadragintmean (p=43) upward
  // to p=44 as the fourth quadragint-prefixed exponent
  // (quattuor-quadraginta = 4 + 40) past the p=40 quadragint milestone
  // and the next even exponent after p=43. Computed as
  // QQGM44 = (sum(x_i^44) / n)^(1/44) via Math.pow(s, 1/44); by the
  // generalized power-mean inequality QQGM44 dominates every lower-p
  // sibling so the monotone chain
  // QQGM44 >= TQGM43 >= DQGM42 >= UQGM41 >= QGM40 >= NTGM39 >= OTGM38
  //   >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32
  //   >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26
  //   >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20
  //   >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM
  //   >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all forty-six shell emitters. Handler uses
  // the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w8 * w4;)
  // to avoid calling Math.pow in the inner reduce loop (44 = 32+8+4,
  // the cleanest three-summand {32,8,4}-partition factorization the
  // cache admits at this even exponent), promoting the partial-vvvvvv
  // quadragintmean w32 * w8 (40 = 32+8) two-summand even-p decomposition
  // four lower by appending a trailing w4 factor to reach the next
  // multiple-of-four exponent, and contrasting partial-bbbbbbb
  // tresquadragintmean w32 * w8 * w2 * r.wallSec (43 = 32+8+2+1)
  // four-summand odd-p decomposition one lower which used the
  // {32,8,2,1} four-summand partition to reach the prior odd exponent.
  // Even p=44 = 2 * 22 makes the inner summand a perfect square of
  // w22 = w16 * w4 * w2 so the running sum is non-negative regardless
  // of wallSec sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) anyway. All-unknown
  // degenerate case (known.length === 0) prints a dedicated "unknown"
  // summary and exits 0 rather than (0/0)^(1/44) = NaN. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Shell-only this partial; the
  // --batch-plan-cost-triple-quattuorquadragintmean-json analog will
  // follow in a later partial mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quattuorquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quattuorquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8 * w4;
  }, 0);
  const quattuorquadragintmeanSec = Math.pow(quattuorquadragintSum / known.length, 1 / 44);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quattuorquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quattuorquadragintic-mean wall-time: ${quattuorquadragintmeanSec.toFixed(0)} s (~${(quattuorquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuorquadragintmeanJson) {
  // partial-eeeeeee: structural JSON analog of
  // --batch-plan-cost-triple-quattuorquadragintmean (p=44 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-ddddddd and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..44} x {shell, JSON} to
  // full shell/JSON parity at forty-six exponents (ninety-two emitters in
  // total across the power-mean axis).
  // Emits one object {quattuorquadragintmeanSec, quattuorquadragintmeanHours,
  // knownCount, unknownCount} with quattuorquadragintmeanHours =
  // quattuorquadragintmeanSec / 3600 (null when knownCount===0) so Python / jq
  // offline-worker drivers can consume the p=44 power-mean central-tendency
  // signal directly without re-parsing the one-line shell summary and
  // without redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence established across every prior JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-ddddddd shell form so the two flags cannot drift. Applies the
  // same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; quattuorquadragintSum += w32 * w8 * w4;)
  // as partial-ddddddd for numerical-stability parity, avoiding Math.pow in
  // the inner reduce loop (44 = 32+8+4, the cleanest {32,8,4}-partition
  // factorization the cache admits at this even exponent), promoting the
  // partial-vvvvvv quadragintmean w32 * w8 (40 = 32+8) two-summand even-p
  // decomposition four lower by appending a trailing w4 factor to reach the
  // next multiple-of-four exponent, and contrasting partial-ccccccc
  // tresquadragintmean-json w32 * w8 * w2 * r.wallSec (43 = 32+8+2+1)
  // four-summand odd-p decomposition one lower which used a {32,8,2,1}
  // four-summand partition to reach the prior odd exponent, so the JSON and
  // shell bodies agree bit-for-bit on IEEE-754 across Node versions, then
  // quattuorquadragintmeanSec = Math.pow(quattuorquadragintSum / known.length, 1 / 44).
  // Even p=44 = 2 * 22 makes the inner summand a perfect square of
  // w22 = w16 * w4 * w2 so the running sum is non-negative regardless of
  // wallSec sign; wallSec values are strictly positive by construction
  // (wall-clock measurements) anyway. All-unknown degenerate case
  // (known.length===0) emits
  // {quattuorquadragintmeanSec: null, quattuorquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/44) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. The monotone ordering
  // QQGM44 >= TQGM43 >= DQGM42 >= UQGM41 >= QGM40 >= NTGM39 >= OTGM38
  //   >= HPTGM37 >= HTGM36 >= PTGM35 >= TTGM34 >= TRGM33 >= DTGM32
  //   >= UTGM31 >= TGM30 >= NVGM29 >= OVGM28 >= SPVGM27 >= SXVGM26
  //   >= QIVGM25 >= QVGM24 >= TVGM23 >= DVGM22 >= UVGM21 >= VGM20
  //   >= NVDM19 >= OCDM18 >= SPM17 >= SDM >= QIM15 >= QDM >= TRM
  //   >= DUM >= UDM >= DCM >= NPM >= OCM >= SPM >= SXM >= QIM >= QUM
  //   >= CM >= QM >= AM >= GM >= HM
  // now holds at structural-JSON parity for offline-worker drivers gating
  // the ~20 CPU-hour batch. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quattuorquadragintmeanSec = null;
  if (known.length > 0) {
    const quattuorquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8 * w4;
    }, 0);
    quattuorquadragintmeanSec = Math.pow(quattuorquadragintSum / known.length, 1 / 44);
  }
  const quattuorquadragintmeanHours =
    quattuorquadragintmeanSec === null ? null : quattuorquadragintmeanSec / 3600;
  const body = {
    quattuorquadragintmeanSec,
    quattuorquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuinquequadragintmean) {
  // partial-fffffff: pure-shell data emitter surfacing the quinquequadragintic
  // mean (p=45 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, extending partial-ddddddd
  // quattuorquadragintmean (p=44) upward to p=45 as the fifth
  // quinquequadragint-prefixed exponent (quinque-quadraginta = 5 + 40) past
  // the p=40 quadragint milestone and the next odd exponent after p=43.
  // Computed as QQGM45 = (sum(x_i^45) / n)^(1/45) via Math.pow(s, 1/45);
  // by the generalized power-mean inequality QQGM45 dominates every lower-p
  // sibling so the monotone chain
  // QQGM45 >= QQGM44 >= TQGM43 >= DQGM42 >= UQGM41 >= QGM40 >= ...
  //   >= QUM >= CM >= QM >= AM >= GM >= HM
  // now holds inline across all forty-seven shell emitters. Handler uses
  // the cache pattern
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; return s + w32 * w8 * w4 * r.wallSec;)
  // to avoid calling Math.pow in the inner reduce loop (45 = 32+8+4+1, the
  // cleanest {32,8,4,1}-partition factorization the cache admits at this
  // odd exponent), contrasting partial-bbbbbbb tresquadragintmean
  // w32 * w8 * w2 * r.wallSec (43 = 32+8+2+1) four-summand odd-p
  // decomposition two lower which used a {32,8,2,1} partition rather than
  // {32,8,4,1}. Odd p=45 preserves sign but wallSec values are strictly
  // positive by construction (wall-clock measurements) so no sign guard is
  // required. All-unknown degenerate case (known.length === 0) prints a
  // dedicated unknown summary and exits 0 rather than (0/0)^(1/45) = NaN.
  // Pure data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. The structural JSON analog
  // --batch-plan-cost-triple-quinquequadragintmean-json landed in partial-ggggggg,
  // closing the {shell, JSON} pair at p=45 and mirroring the shell-first /
  // JSON-second cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by one
  // exponent.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quinquequadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quinquequadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8 * w4 * r.wallSec;
  }, 0);
  const quinquequadragintmeanSec = Math.pow(quinquequadragintSum / known.length, 1 / 45);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quinquequadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quinquequadragintic-mean wall-time: ${quinquequadragintmeanSec.toFixed(0)} s (~${(quinquequadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuinquequadragintmeanJson) {
  // partial-ggggggg: structural JSON analog of
  // --batch-plan-cost-triple-quinquequadragintmean (p=45 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-fffffff and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..45} x {shell, JSON} to
  // full shell/JSON parity at forty-seven exponents (ninety-four emitters in
  // total across the power-mean axis). Emits one object
  // {quinquequadragintmeanSec, quinquequadragintmeanHours, knownCount,
  // unknownCount} with quinquequadragintmeanHours = quinquequadragintmeanSec /
  // 3600 (null when knownCount===0) so Python / jq offline-worker drivers can
  // consume the p=45 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math; identical
  // known-row filter (wallSec !== null) to the partial-fffffff shell form so
  // the two flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8;
  //  const w32 = w16 * w16; quinquequadragintSum += w32 * w8 * w4 * r.wallSec;)
  // as partial-fffffff for numerical-stability parity, avoiding Math.pow in
  // the inner reduce loop (45 = 32+8+4+1, the cleanest {32,8,4,1}-partition
  // factorization the cache admits at this odd exponent), contrasting
  // partial-ccccccc tresquadragintmean-json w32 * w8 * w2 * r.wallSec
  // (43 = 32+8+2+1) four-summand odd-p decomposition two lower which used the
  // {32,8,2,1} partition rather than {32,8,4,1}, so the JSON and shell bodies
  // agree bit-for-bit on IEEE-754 across Node versions, then
  // quinquequadragintmeanSec = Math.pow(quinquequadragintSum / known.length, 1 / 45).
  // Odd p=45 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required.
  // All-unknown degenerate case (known.length===0) emits
  // {quinquequadragintmeanSec: null, quinquequadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/45) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=45.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quinquequadragintmeanSec = null;
  if (known.length > 0) {
    const quinquequadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8 * w4 * r.wallSec;
    }, 0);
    quinquequadragintmeanSec = Math.pow(quinquequadragintSum / known.length, 1 / 45);
  }
  const quinquequadragintmeanHours =
    quinquequadragintmeanSec === null ? null : quinquequadragintmeanSec / 3600;
  const body = {
    quinquequadragintmeanSec,
    quinquequadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSexquadragintmean) {
  // partial-hhhhhhh: added --batch-plan-cost-triple-sexquadragintmean, a
  // pure-shell data emitter surfacing the sexquadragintic mean (p=46
  // Kolmogorov power-mean) of per-triple wall-times across the known-wallSec
  // rows of BATCH_PLAN, as the forty-eighth power-mean sibling extending
  // partial-fffffff quinquequadragintmean (p=45) upward to p=46 and the first
  // even exponent past the p=45 odd milestone. Computed as
  // SXQM46 = (sum(x_i^46) / n)^(1/46) via Math.pow(s, 1/46); by the
  // generalized power-mean inequality SXQM46 dominates every lower-p sibling,
  // so the monotone chain
  // SXQM46 >= QIQM45 >= QQM44 >= TQM43 >= DQM42 >= UQM41 >= QM40 >= NTGM39
  //        >= OTGM38 >= HPTGM37 >= HTGM36 >= ... >= VGM20 >= ... >= AM
  //        >= GM >= HM
  // now holds inline. Handler uses the w32 * w8 * w4 * w2 (46 = 32+8+4+2)
  // four-summand even-p decomposition (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; sexquadragintSum += w32 * w8 * w4 * w2;) to avoid
  // calling Math.pow in the inner reduce loop: the cleanest
  // {32,8,4,2}-partition the cache admits at this even exponent, promoting
  // the partial-fffffff quinquequadragintmean w32 * w8 * w4 * r.wallSec
  // (45 = 32+8+4+1) four-summand odd-p tail to the pre-cached w2 to reach
  // the next even exponent. Even p=46 erases sign and wallSec values are
  // strictly positive by construction (wall-clock measurements) so no sign
  // guard is required. All-unknown degenerate case (known.length === 0)
  // prints a dedicated unknown summary and exits 0 rather than
  // (0/0)^(1/46) = NaN. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json. The
  // structural JSON analog --batch-plan-cost-triple-sexquadragintmean-json
  // will follow in a future partial, mirroring the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by one
  // exponent.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple sexquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sexquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8 * w4 * w2;
  }, 0);
  const sexquadragintmeanSec = Math.pow(sexquadragintSum / known.length, 1 / 46);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from sexquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple sexquadragintic-mean wall-time: ${sexquadragintmeanSec.toFixed(0)} s (~${(sexquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSexquadragintmeanJson) {
  // partial-iiiiiii: structural JSON analog of
  // --batch-plan-cost-triple-sexquadragintmean (p=46 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-hhhhhhh and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..46} x {shell, JSON} to
  // full shell/JSON parity at forty-eight exponents (ninety-six emitters in
  // total across the power-mean axis). Emits one object
  // {sexquadragintmeanSec, sexquadragintmeanHours, knownCount, unknownCount}
  // with sexquadragintmeanHours = sexquadragintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume the
  // p=46 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter (wallSec !== null)
  // to the partial-hhhhhhh shell form so the two flags cannot drift. Applies
  // the same cached squaring chain (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; sexquadragintSum += w32 * w8 * w4 * w2;) as
  // partial-hhhhhhh for numerical-stability parity, avoiding Math.pow in the
  // inner reduce loop (46 = 32+8+4+2, the cleanest {32,8,4,2}-partition the
  // cache admits at this even exponent), then
  // sexquadragintmeanSec = Math.pow(sexquadragintSum / known.length, 1 / 46).
  // Even p=46 erases sign and wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required.
  // All-unknown degenerate case (known.length===0) emits
  // {sexquadragintmeanSec: null, sexquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/46) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=46.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let sexquadragintmeanSec = null;
  if (known.length > 0) {
    const sexquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8 * w4 * w2;
    }, 0);
    sexquadragintmeanSec = Math.pow(sexquadragintSum / known.length, 1 / 46);
  }
  const sexquadragintmeanHours =
    sexquadragintmeanSec === null ? null : sexquadragintmeanSec / 3600;
  const body = {
    sexquadragintmeanSec,
    sexquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSeptenquadragintmean) {
  // partial-jjjjjjj: pure-shell data emitter surfacing the septenquadragintic
  // mean (p=47 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, as the forty-ninth power-mean sibling
  // extending partial-hhhhhhh sexquadragintmean (p=46) upward to p=47 and the
  // next odd exponent past the p=46 even milestone. Computed as
  // SPQM47 = (sum(x_i^47) / n)^(1/47) via Math.pow(s, 1/47); by the
  // generalized power-mean inequality SPQM47 dominates every lower-p sibling,
  // so the monotone chain
  // SPQM47 >= SXQM46 >= QIQM45 >= QQM44 >= TQM43 >= DQM42 >= UQM41 >= QM40
  //        >= NTGM39 >= ... >= VGM20 >= ... >= AM >= GM >= HM
  // now holds inline across all forty-nine shell emitters. Handler uses the
  // w32 * w8 * w4 * w2 * r.wallSec (47 = 32+8+4+2+1) five-summand odd-p
  // decomposition (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  // septenquadragintSum += w32 * w8 * w4 * w2 * r.wallSec;) to avoid calling
  // Math.pow in the inner reduce loop: the cleanest {32,8,4,2,1}-partition
  // the cache admits at this odd exponent, promoting the partial-hhhhhhh
  // sexquadragintmean w32 * w8 * w4 * w2 (46 = 32+8+4+2) four-summand even-p
  // tail with the pre-cached r.wallSec to reach the next odd exponent. Odd
  // p=47 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required.
  // All-unknown degenerate case (known.length === 0) prints a dedicated
  // unknown summary and exits 0 rather than (0/0)^(1/47) = NaN. Pure data
  // emitter, exit 0 unconditionally (no validation gate), not wired into
  // --preflight / --preflight-json. The structural JSON analog
  // --batch-plan-cost-triple-septenquadragintmean-json will follow in a
  // future partial, mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by one
  // exponent.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple septenquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const septenquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w8 * w4 * w2 * r.wallSec;
  }, 0);
  const septenquadragintmeanSec = Math.pow(septenquadragintSum / known.length, 1 / 47);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from septenquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple septenquadragintic-mean wall-time: ${septenquadragintmeanSec.toFixed(0)} s (~${(septenquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSeptenquadragintmeanJson) {
  // partial-kkkkkkk: structural JSON analog of
  // --batch-plan-cost-triple-septenquadragintmean (p=47 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-jjjjjjj and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..47} x {shell, JSON} to
  // full shell/JSON parity at forty-nine exponents (ninety-eight emitters in
  // total across the power-mean axis). Emits one object
  // {septenquadragintmeanSec, septenquadragintmeanHours, knownCount, unknownCount}
  // with septenquadragintmeanHours = septenquadragintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume the
  // p=47 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter (wallSec !== null)
  // to the partial-jjjjjjj shell form so the two flags cannot drift. Applies
  // the same cached squaring chain (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; septenquadragintSum += w32 * w8 * w4 * w2 * r.wallSec;)
  // as partial-jjjjjjj for numerical-stability parity, avoiding Math.pow in
  // the inner reduce loop (47 = 32+8+4+2+1, the cleanest {32,8,4,2,1}-partition
  // the cache admits at this odd exponent), then
  // septenquadragintmeanSec = Math.pow(septenquadragintSum / known.length, 1 / 47).
  // Odd p=47 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required.
  // All-unknown degenerate case (known.length===0) emits
  // {septenquadragintmeanSec: null, septenquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/47) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=47.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let septenquadragintmeanSec = null;
  if (known.length > 0) {
    const septenquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w8 * w4 * w2 * r.wallSec;
    }, 0);
    septenquadragintmeanSec = Math.pow(septenquadragintSum / known.length, 1 / 47);
  }
  const septenquadragintmeanHours =
    septenquadragintmeanSec === null ? null : septenquadragintmeanSec / 3600;
  const body = {
    septenquadragintmeanSec,
    septenquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleOctoquadragintmean) {
  // partial-lllllll: pure-shell data emitter surfacing the octoquadragintic
  // mean (p=48 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, as the fiftieth power-mean sibling
  // extending partial-jjjjjjj septenquadragintmean (p=47) upward to p=48 and
  // the next even exponent past the p=47 odd milestone. Computed as
  // OQM = (sum(x_i^48) / n)^(1/48) via Math.pow(s, 1/48); by the generalized
  // power-mean inequality OQM dominates every lower-p sibling, so the monotone
  // chain OQM >= SPQM47 >= SXQM46 >= QIQM45 >= ... >= AM >= GM >= HM now holds
  // inline across all fifty shell emitters. Handler uses the w32 * w16
  // (48 = 32+16) two-summand even-p decomposition (const w2 = r.wallSec *
  // r.wallSec; const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; octoquadragintSum += w32 * w16;) to avoid calling
  // Math.pow in the inner reduce loop: the cleanest {32,16}-partition the
  // cache admits at this even exponent, promoting the partial-jjjjjjj
  // septenquadragintmean w32 * w8 * w4 * w2 * r.wallSec five-summand odd-p
  // decomposition to a strictly shorter two-summand even-p form using the
  // same cached squaring chain. Even p=48 erases sign but wallSec values are
  // strictly positive by construction (wall-clock measurements) so no sign
  // guard is required. All-unknown degenerate case (known.length === 0)
  // prints a dedicated unknown summary and exits 0 rather than (0/0)^(1/48)
  // = NaN. Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. The structural JSON
  // analog --batch-plan-cost-triple-octoquadragintmean-json will follow in
  // a future partial, mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by one
  // exponent.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple octoquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const octoquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16;
  }, 0);
  const octoquadragintmeanSec = Math.pow(octoquadragintSum / known.length, 1 / 48);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from octoquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple octoquadragintic-mean wall-time: ${octoquadragintmeanSec.toFixed(0)} s (~${(octoquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleOctoquadragintmeanJson) {
  // partial-mmmmmmm: structural JSON analog of
  // --batch-plan-cost-triple-octoquadragintmean (p=48 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-lllllll and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..48} x {shell, JSON} to
  // full shell/JSON parity at fifty exponents (one hundred emitters in total
  // across the power-mean axis). Emits one object
  // {octoquadragintmeanSec, octoquadragintmeanHours, knownCount, unknownCount}
  // with octoquadragintmeanHours = octoquadragintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume the
  // p=48 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter (wallSec !== null)
  // to the partial-lllllll shell form so the two flags cannot drift. Applies
  // the same cached squaring chain (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; octoquadragintSum += w32 * w16;) as partial-lllllll
  // for numerical-stability parity, avoiding Math.pow in the inner reduce
  // loop (48 = 32+16, the cleanest {32,16} two-summand partition the cache
  // admits at this even exponent), then
  // octoquadragintmeanSec = Math.pow(octoquadragintSum / known.length, 1 / 48).
  // Even p=48 erases sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required.
  // All-unknown degenerate case (known.length===0) emits
  // {octoquadragintmeanSec: null, octoquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/48) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=48.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let octoquadragintmeanSec = null;
  if (known.length > 0) {
    const octoquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16;
    }, 0);
    octoquadragintmeanSec = Math.pow(octoquadragintSum / known.length, 1 / 48);
  }
  const octoquadragintmeanHours =
    octoquadragintmeanSec === null ? null : octoquadragintmeanSec / 3600;
  const body = {
    octoquadragintmeanSec,
    octoquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleNovemquadragintmean) {
  // partial-nnnnnnn: pure-shell data emitter surfacing the novemquadragintic
  // mean (p=49 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, as the fifty-first power-mean sibling
  // extending partial-lllllll octoquadragintmean (p=48) upward to p=49 and
  // the next odd exponent past the p=48 even milestone. Computed as
  // NQM49 = (sum(x_i^49) / n)^(1/49) via Math.pow(s, 1/49); by the
  // generalized power-mean inequality NQM49 dominates every lower-p sibling,
  // so the monotone chain NQM49 >= OQM48 >= SPQM47 >= SXQM46 >= ... >= AM >=
  // GM >= HM now holds inline across all fifty-one shell emitters. Handler
  // uses the w32 * w16 * r.wallSec (49 = 32+16+1) three-summand odd-p
  // decomposition (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  // novemquadragintSum += w32 * w16 * r.wallSec;) to avoid calling Math.pow
  // in the inner reduce loop: extends the partial-lllllll octoquadragintmean
  // w32 * w16 (48 = 32+16) two-summand even-p decomposition by one trailing
  // r.wallSec factor to reach the next odd exponent, staying within the
  // cached w2/w4/w8/w16/w32 powers plus one r.wallSec multiplication. Odd
  // p=49 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required
  // (mirroring the partial-jjjjjjj septenquadragintmean and every prior
  // odd-p cadence). All-unknown degenerate case (known.length === 0) prints
  // a dedicated unknown summary and exits 0 rather than (0/0)^(1/49) = NaN.
  // Pure data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. The structural JSON analog
  // --batch-plan-cost-triple-novemquadragintmean-json will follow in a
  // future partial, mirroring the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial extends the power-mean family by one exponent.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple novemquadragintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const novemquadragintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * r.wallSec;
  }, 0);
  const novemquadragintmeanSec = Math.pow(novemquadragintSum / known.length, 1 / 49);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from novemquadragintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple novemquadragintic-mean wall-time: ${novemquadragintmeanSec.toFixed(0)} s (~${(novemquadragintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleNovemquadragintmeanJson) {
  // partial-ooooooo: structural JSON analog of
  // --batch-plan-cost-triple-novemquadragintmean (p=49 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-nnnnnnn and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..49} x {shell, JSON} to
  // full shell/JSON parity at fifty-one exponents (one hundred two emitters
  // in total across the power-mean axis). Emits one object
  // {novemquadragintmeanSec, novemquadragintmeanHours, knownCount, unknownCount}
  // with novemquadragintmeanHours = novemquadragintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume the
  // p=49 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter (wallSec !== null)
  // to the partial-nnnnnnn shell form so the two flags cannot drift. Applies
  // the same cached squaring chain (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; novemquadragintSum += w32 * w16 * r.wallSec;) as
  // partial-nnnnnnn for numerical-stability parity and IEEE-754 bit parity,
  // avoiding Math.pow in the inner reduce loop (49 = 32+16+1, the
  // three-summand partition the cache admits at this odd exponent, reusing
  // the partial-lllllll w32*w16 even-p backbone plus one trailing r.wallSec
  // multiplication), then
  // novemquadragintmeanSec = Math.pow(novemquadragintSum / known.length, 1 / 49).
  // Odd p=49 preserves sign but wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required
  // (mirroring the partial-mmmmmmm octoquadragintmean-json even-p form and
  // every prior odd-p JSON emitter). All-unknown degenerate case
  // (known.length===0) emits
  // {novemquadragintmeanSec: null, novemquadragintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/49) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=49.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let novemquadragintmeanSec = null;
  if (known.length > 0) {
    const novemquadragintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * r.wallSec;
    }, 0);
    novemquadragintmeanSec = Math.pow(novemquadragintSum / known.length, 1 / 49);
  }
  const novemquadragintmeanHours =
    novemquadragintmeanSec === null ? null : novemquadragintmeanSec / 3600;
  const body = {
    novemquadragintmeanSec,
    novemquadragintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuinquagintmean) {
  // partial-ppppppp: pure-shell data emitter surfacing the quinquagintic mean
  // (p=50 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, as the fifty-second power-mean sibling
  // extending partial-nnnnnnn novemquadragintmean (p=49) upward to p=50 and
  // the next even exponent past the p=49 odd milestone, crossing the p=50
  // quinquagint prefix boundary (quinquaginta = 50). Computed as
  // QGM50 = (sum(x_i^50) / n)^(1/50) via Math.pow(s, 1/50); by the
  // generalized power-mean inequality QGM50 dominates every lower-p sibling,
  // so the monotone chain QGM50 >= NQM49 >= OQM48 >= SPQM47 >= ... >= AM >=
  // GM >= HM now holds inline across all fifty-two shell emitters. Handler
  // uses the w32 * w16 * w2 (50 = 32+16+2) three-summand even-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  // quinquagintSum += w32 * w16 * w2;) to avoid calling Math.pow in the
  // inner reduce loop: extends the partial-nnnnnnn novemquadragintmean
  // w32 * w16 * r.wallSec (49 = 32+16+1) three-summand odd-p decomposition
  // by promoting the trailing r.wallSec factor to w2 to reach the next even
  // exponent, staying within the cached w2/w4/w8/w16/w32 powers with no
  // additional multiplications. Even p=50 preserves sign; wallSec values are
  // strictly positive by construction (wall-clock measurements) so no sign
  // guard is required, matching every prior even-p cadence. All-unknown
  // degenerate case (known.length === 0) prints a dedicated unknown summary
  // and exits 0 rather than (0/0)^(1/50) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Paired in partial-qqqqqqq with the structural JSON
  // analog --batch-plan-cost-triple-quinquagintmean-json, completing the
  // shell/JSON pair at p=50 and matching the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost()
  // (partial-vv helper) with zero new batch-plan logic. Honest-partial:
  // imp-917 stays pending -- the ~20 CPU-hour offline execution of the 14
  // measurement rows remains the honest closure condition; this partial
  // extends the power-mean family by one exponent across the p=50 prefix
  // boundary.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w2;
  }, 0);
  const quinquagintmeanSec = Math.pow(quinquagintSum / known.length, 1 / 50);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quinquagintic-mean wall-time: ${quinquagintmeanSec.toFixed(0)} s (~${(quinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuinquagintmeanJson) {
  // partial-qqqqqqq: structural JSON analog of
  // --batch-plan-cost-triple-quinquagintmean (p=50 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-ppppppp and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..50} x {shell, JSON} to
  // full shell/JSON parity at fifty-two exponents (one hundred four emitters
  // in total across the power-mean axis, crossing the p=50 quinquaginta
  // prefix boundary in both forms). Emits one object
  // {quinquagintmeanSec, quinquagintmeanHours, knownCount, unknownCount}
  // with quinquagintmeanHours = quinquagintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume the
  // p=50 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter (wallSec !== null)
  // to the partial-ppppppp shell form so the two flags cannot drift. Applies
  // the same cached squaring chain (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; quinquagintSum += w32 * w16 * w2;) as
  // partial-ppppppp for numerical-stability parity and IEEE-754 bit parity,
  // avoiding Math.pow in the inner reduce loop (50 = 32+16+2, the
  // three-summand even-p partition the cache admits, extending the
  // partial-ooooooo novemquadragintmean-json w32*w16*r.wallSec (49=32+16+1)
  // odd-p decomposition by promoting the trailing r.wallSec factor to w2 to
  // reach the next even exponent with no additional multiplications). Even
  // p=50 preserves sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // matching every prior even-p JSON emitter. All-unknown degenerate case
  // (known.length===0) emits
  // {quinquagintmeanSec: null, quinquagintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/50) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=50.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quinquagintmeanSec = null;
  if (known.length > 0) {
    const quinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w2;
    }, 0);
    quinquagintmeanSec = Math.pow(quinquagintSum / known.length, 1 / 50);
  }
  const quinquagintmeanHours =
    quinquagintmeanSec === null ? null : quinquagintmeanSec / 3600;
  const body = {
    quinquagintmeanSec,
    quinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleUnquinquagintmean) {
  // partial-rrrrrrr: pure-shell data emitter surfacing the unquinquagintic
  // mean (p=51 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, as the fifty-third power-mean sibling
  // extending partial-ppppppp quinquagintmean (p=50) upward to p=51 and the
  // next odd exponent past the p=50 even milestone (un=1, quinquaginta=50,
  // so unquinquaginta=51). Computed as UQGM51 = (sum(x_i^51) / n)^(1/51) via
  // Math.pow(s, 1/51); by the generalized power-mean inequality UQGM51
  // dominates every lower-p sibling, so the monotone chain UQGM51 >= QGM50
  // >= NQM49 >= OQM48 >= ... >= AM >= GM >= HM now holds inline across all
  // fifty-three shell emitters. Handler uses the w32 * w16 * w2 * r.wallSec
  // (51 = 32+16+2+1) four-summand odd-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  // unquinquagintSum += w32 * w16 * w2 * r.wallSec;) to avoid calling
  // Math.pow in the inner reduce loop: extends the partial-ppppppp
  // quinquagintmean w32 * w16 * w2 (50 = 32+16+2) three-summand even-p
  // decomposition by re-introducing the trailing r.wallSec factor to reach
  // the next odd exponent, staying within the cached w2/w4/w8/w16/w32 powers
  // with exactly one additional multiplication. Odd p=51 preserves sign;
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so no sign guard is required, matching every prior odd-p
  // cadence. All-unknown degenerate case (known.length === 0) prints a
  // dedicated unknown summary and exits 0 rather than
  // (0/0)^(1/51) = NaN. Pure data emitter, exit 0 unconditionally (no
  // validation gate), not wired into --preflight / --preflight-json. Paired
  // in partial-sssssss with the structural JSON analog
  // --batch-plan-cost-triple-unquinquagintmean-json, completing the
  // shell/JSON pair at p=51 and matching the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper)
  // with zero new batch-plan logic. Honest-partial: imp-917 stays
  // pending -- the ~20 CPU-hour offline execution of the 14 measurement
  // rows remains the honest closure condition; this partial extends the
  // power-mean family by one exponent across the p=51 un-quinquagint prefix
  // boundary.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple unquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const unquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w2 * r.wallSec;
  }, 0);
  const unquinquagintmeanSec = Math.pow(unquinquagintSum / known.length, 1 / 51);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from unquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple unquinquagintic-mean wall-time: ${unquinquagintmeanSec.toFixed(0)} s (~${(unquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleUnquinquagintmeanJson) {
  // partial-sssssss: structural JSON analog of
  // --batch-plan-cost-triple-unquinquagintmean (p=51 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-rrrrrrr and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..51} x {shell, JSON} to
  // full shell/JSON parity at fifty-three exponents (one hundred six
  // emitters in total across the power-mean axis, crossing the p=51
  // un-quinquagint prefix boundary in both forms). Emits one object
  // {unquinquagintmeanSec, unquinquagintmeanHours, knownCount, unknownCount}
  // with unquinquagintmeanHours = unquinquagintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume the
  // p=51 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter (wallSec !== null)
  // to the partial-rrrrrrr shell form so the two flags cannot drift. Applies
  // the same cached squaring chain (const w2 = r.wallSec * r.wallSec;
  // const w4 = w2 * w2; const w8 = w4 * w4; const w16 = w8 * w8;
  // const w32 = w16 * w16; unquinquagintSum += w32 * w16 * w2 * r.wallSec;)
  // as partial-rrrrrrr for numerical-stability parity and IEEE-754 bit
  // parity, avoiding Math.pow in the inner reduce loop (51 = 32+16+2+1, the
  // four-summand odd-p partition the cache admits, extending the
  // partial-qqqqqqq quinquagintmean-json w32*w16*w2 (50=32+16+2) even-p
  // decomposition by re-introducing the trailing r.wallSec factor to reach
  // the next odd exponent with exactly one additional multiplication). Odd
  // p=51 preserves sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // matching every prior odd-p JSON emitter. All-unknown degenerate case
  // (known.length===0) emits
  // {unquinquagintmeanSec: null, unquinquagintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/51) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=51.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let unquinquagintmeanSec = null;
  if (known.length > 0) {
    const unquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w2 * r.wallSec;
    }, 0);
    unquinquagintmeanSec = Math.pow(unquinquagintSum / known.length, 1 / 51);
  }
  const unquinquagintmeanHours =
    unquinquagintmeanSec === null ? null : unquinquagintmeanSec / 3600;
  const body = {
    unquinquagintmeanSec,
    unquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleDuoquinquagintmean) {
  // partial-ttttttt: pure-shell data emitter surfacing the duoquinquagintic
  // mean (p=52 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, as the fifty-fourth power-mean sibling
  // extending partial-rrrrrrr unquinquagintmean (p=51) upward to p=52 and the
  // next even exponent past the p=51 odd milestone (duo=2, quinquaginta=50,
  // so duoquinquaginta=52). Computed as DQGM52 = (sum(x_i^52) / n)^(1/52) via
  // Math.pow(s, 1/52); by the generalized power-mean inequality DQGM52
  // dominates every lower-p sibling, so the monotone chain DQGM52 >= UQGM51
  // >= QGM50 >= NQM49 >= ... >= AM >= GM >= HM now holds inline across all
  // fifty-four shell emitters. Handler uses the w32 * w16 * w4 (52 = 32+16+4)
  // three-summand even-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  // const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  // duoquinquagintSum += w32 * w16 * w4;) to avoid calling Math.pow in the
  // inner reduce loop: extends the partial-rrrrrrr unquinquagintmean
  // w32 * w16 * w2 * r.wallSec (51 = 32+16+2+1) four-summand odd-p
  // decomposition by collapsing the trailing w2 * r.wallSec factor pair into
  // the cached w4 power to reach the next even exponent, dropping back to
  // three multiplications. Even p=52 preserves sign; wallSec values are
  // strictly positive by construction (wall-clock measurements) so no sign
  // guard is required, matching every prior even-p cadence. All-unknown
  // degenerate case (known.length === 0) prints a dedicated unknown summary
  // and exits 0 rather than (0/0)^(1/52) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog --batch-plan-cost-triple-duoquinquagintmean-json
  // can follow in a future partial, matching the shell-first / JSON-second
  // cadence established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial extends the power-mean family by one exponent
  // across the p=52 duo-quinquagint prefix boundary.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple duoquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const duoquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w4;
  }, 0);
  const duoquinquagintmeanSec = Math.pow(duoquinquagintSum / known.length, 1 / 52);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from duoquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple duoquinquagintic-mean wall-time: ${duoquinquagintmeanSec.toFixed(0)} s (~${(duoquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleDuoquinquagintmeanJson) {
  // partial-uuuuuuu: structural JSON analog of partial-ttttttt
  // --batch-plan-cost-triple-duoquinquagintmean (p=52 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-ttttttt and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..52} x {shell, JSON} to
  // full shell/JSON parity at fifty-four exponents (one hundred eight
  // emitters in total across the power-mean axis, crossing the p=52
  // duoquinquaginta prefix boundary in both forms). Emits one object
  // {duoquinquagintmeanSec, duoquinquagintmeanHours, knownCount, unknownCount}
  // with duoquinquagintmeanHours = duoquinquagintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume the
  // p=52 power-mean central-tendency signal directly without re-parsing the
  // one-line shell summary and without redoing the seconds-to-hours
  // conversion, matching the precomputed-hours cadence established across
  // every prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-ttttttt shell form so the two flags
  // cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  duoquinquagintSum += w32 * w16 * w4;) as partial-ttttttt for
  // numerical-stability parity and IEEE-754 bit parity, avoiding Math.pow in
  // the inner reduce loop (52 = 32+16+4, the three-summand even-p partition
  // the cache admits at this even exponent, collapsing the partial-sssssss
  // unquinquagintmean-json w32 * w16 * w2 * r.wallSec (51 = 32+16+2+1)
  // four-summand odd-p decomposition trailing w2 * r.wallSec factor pair
  // into the cached w4 power, dropping back to three multiplications), then
  // duoquinquagintmeanSec = Math.pow(duoquinquagintSum / known.length, 1 / 52).
  // Even p=52 preserves sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // matching every prior even-p JSON emitter. All-unknown degenerate case
  // (known.length===0) emits
  // {duoquinquagintmeanSec: null, duoquinquagintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/52) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair at
  // p=52.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let duoquinquagintmeanSec = null;
  if (known.length > 0) {
    const duoquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w4;
    }, 0);
    duoquinquagintmeanSec = Math.pow(duoquinquagintSum / known.length, 1 / 52);
  }
  const duoquinquagintmeanHours =
    duoquinquagintmeanSec === null ? null : duoquinquagintmeanSec / 3600;
  const body = {
    duoquinquagintmeanSec,
    duoquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTresquinquagintmean) {
  // partial-vvvvvvv: pure-shell data emitter surfacing the tresquinquagintic
  // mean (p=53 Kolmogorov power-mean) of per-triple wall-times across the
  // known-wallSec rows of BATCH_PLAN, as the fifty-fifth power-mean sibling
  // extending partial-ttttttt duoquinquagintmean (p=52) upward to p=53 and
  // the next odd exponent past the p=52 even milestone (tres=3,
  // quinquaginta=50, so tresquinquaginta=53; matches the "tres" prefix
  // cadence the project already uses at p=43 tresquadragintmean and the
  // smaller tres- siblings). Computed as TQGM53 = (sum(x_i^53) / n)^(1/53)
  // via Math.pow(s, 1/53); by the generalized power-mean inequality TQGM53
  // dominates every lower-p sibling, so the monotone chain TQGM53 >= DQGM52
  // >= UQGM51 >= QGM50 >= NQM49 >= ... >= AM >= GM >= HM now holds inline
  // across all fifty-five shell emitters. Handler uses the
  // w32 * w16 * w4 * r.wallSec (53 = 32+16+4+1) four-summand odd-p
  // decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  tresquinquagintSum += w32 * w16 * w4 * r.wallSec;) to avoid calling
  // Math.pow in the inner reduce loop: extends the partial-ttttttt
  // duoquinquagintmean w32 * w16 * w4 (52 = 32+16+4) three-summand even-p
  // decomposition by re-introducing the trailing r.wallSec factor to reach
  // the next odd exponent with exactly one additional multiplication,
  // matching the partial-rrrrrrr unquinquagintmean (51 = 32+16+2+1) odd-p
  // cadence at the next four-summand odd exponent. Odd p=53 preserves sign;
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so no sign guard is required, matching every prior odd-p
  // shell emitter. All-unknown degenerate case (known.length === 0) prints
  // a dedicated unknown summary and exits 0 rather than (0/0)^(1/53) = NaN.
  // Pure data emitter, exit 0 unconditionally (no validation gate), not
  // wired into --preflight / --preflight-json. Paired in partial-wwwwwww
  // with the structural JSON analog
  // --batch-plan-cost-triple-tresquinquagintmean-json. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by one
  // exponent at the next odd p=53 sibling.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple tresquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const tresquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w4 * r.wallSec;
  }, 0);
  const tresquinquagintmeanSec = Math.pow(tresquinquagintSum / known.length, 1 / 53);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from tresquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple tresquinquagintic-mean wall-time: ${tresquinquagintmeanSec.toFixed(0)} s (~${(tresquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleTresquinquagintmeanJson) {
  // partial-wwwwwww: structural JSON analog of partial-vvvvvvv
  // --batch-plan-cost-triple-tresquinquagintmean (p=53 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-vvvvvvv and bringing the
  // Kolmogorov power-mean family at p in {-1, 0, 1..53} x {shell, JSON} to
  // full shell/JSON parity at fifty-five exponents (one hundred ten
  // emitters in total across the power-mean axis). Emits one object
  // {tresquinquagintmeanSec, tresquinquagintmeanHours, knownCount,
  //  unknownCount} with tresquinquagintmeanHours = tresquinquagintmeanSec
  // / 3600 (null when knownCount===0) so Python / jq offline-worker
  // drivers can consume the p=53 power-mean central-tendency signal
  // directly without re-parsing the one-line shell summary and without
  // redoing the seconds-to-hours conversion, matching the
  // precomputed-hours cadence established across every prior JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-vvvvvvv shell form so the two flags cannot drift. Applies the
  // same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  tresquinquagintSum += w32 * w16 * w4 * r.wallSec;) as
  // partial-vvvvvvv for numerical-stability parity and IEEE-754 bit
  // parity, avoiding Math.pow in the inner reduce loop (53 = 32+16+4+1,
  // the four-summand odd-p decomposition extending the partial-uuuuuuu
  // duoquinquagintmean-json w32 * w16 * w4 (52 = 32+16+4) three-summand
  // even-p decomposition by re-introducing the trailing r.wallSec factor
  // to reach the next odd exponent with exactly one additional
  // multiplication), then tresquinquagintmeanSec
  // = Math.pow(tresquinquagintSum / known.length, 1 / 53). Odd p=53
  // preserves sign; wallSec values are strictly positive by construction
  // (wall-clock measurements) so no sign guard is required, matching
  // every prior odd-p JSON emitter. All-unknown degenerate case
  // (known.length===0) emits
  // {tresquinquagintmeanSec: null, tresquinquagintmeanHours: null,
  //  knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/53) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Honest-partial: imp-917 stays pending -- the ~20
  // CPU-hour offline execution of the 14 measurement rows remains the
  // honest closure condition; this partial closes the JSON half of the
  // power-mean pair at p=53.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let tresquinquagintmeanSec = null;
  if (known.length > 0) {
    const tresquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w4 * r.wallSec;
    }, 0);
    tresquinquagintmeanSec = Math.pow(tresquinquagintSum / known.length, 1 / 53);
  }
  const tresquinquagintmeanHours =
    tresquinquagintmeanSec === null ? null : tresquinquagintmeanSec / 3600;
  const body = {
    tresquinquagintmeanSec,
    tresquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuorquinquagintmean) {
  // partial-xxxxxxx: pure-shell data emitter surfacing the
  // quattuorquinquagintic mean (p=54 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // fifty-sixth power-mean sibling extending partial-vvvvvvv
  // tresquinquagintmean (p=53) upward to p=54 and the next even exponent
  // past the p=53 odd milestone (quattuor=4, quinquaginta=50, so
  // quattuorquinquaginta=54; matches the "quattuor" prefix cadence the
  // project already uses at p=44 quattuorquadragintmean and the smaller
  // quattuor- siblings). Computed as QQGM54 = (sum(x_i^54) / n)^(1/54)
  // via Math.pow(s, 1/54); by the generalized power-mean inequality
  // QQGM54 dominates every lower-p sibling, so the monotone chain QQGM54
  // >= TQGM53 >= DQGM52 >= UQGM51 >= QGM50 >= NQM49 >= ... >= AM >= GM
  // >= HM now holds inline across all fifty-six shell emitters. Handler
  // uses the w32 * w16 * w4 * w2 (54 = 32+16+4+2) four-summand even-p
  // decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  quattuorquinquagintSum += w32 * w16 * w4 * w2;) to avoid calling
  // Math.pow in the inner reduce loop: extends the partial-vvvvvvv
  // tresquinquagintmean w32 * w16 * w4 * r.wallSec (53 = 32+16+4+1)
  // four-summand odd-p decomposition by promoting the trailing
  // r.wallSec factor to the cached w2 power to reach the next even
  // exponent, holding multiplication count steady at three. Even p=54
  // preserves sign; wallSec values are strictly positive by construction
  // (wall-clock measurements) so no sign guard is required, matching
  // every prior even-p shell emitter. All-unknown degenerate case
  // (known.length === 0) prints a dedicated unknown summary and exits 0
  // rather than (0/0)^(1/54) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog
  // --batch-plan-cost-triple-quattuorquinquagintmean-json can follow in
  // a future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by
  // one exponent across the p=54 quattuor-quinquagint prefix boundary.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quattuorquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quattuorquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w4 * w2;
  }, 0);
  const quattuorquinquagintmeanSec = Math.pow(quattuorquinquagintSum / known.length, 1 / 54);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quattuorquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quattuorquinquagintic-mean wall-time: ${quattuorquinquagintmeanSec.toFixed(0)} s (~${(quattuorquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuattuorquinquagintmeanJson) {
  // partial-yyyyyyy: structural JSON analog of partial-xxxxxxx
  // --batch-plan-cost-triple-quattuorquinquagintmean (p=54 Kolmogorov
  // power-mean), completing the {shell, JSON} pair for partial-xxxxxxx and
  // bringing the Kolmogorov power-mean family at p in {-1, 0, 1..54} x
  // {shell, JSON} to full shell/JSON parity at fifty-six exponents.
  // Emits one object {quattuorquinquagintmeanSec,
  // quattuorquinquagintmeanHours, knownCount, unknownCount} with
  // quattuorquinquagintmeanHours = quattuorquinquagintmeanSec / 3600 (null
  // when knownCount===0) so Python / jq offline-worker drivers can consume
  // the p=54 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-xxxxxxx
  // shell form so the two flags cannot drift. Applies the same cached
  // squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  quattuorquinquagintSum += w32 * w16 * w4 * w2;) as partial-xxxxxxx
  // for numerical-stability parity and IEEE-754 bit parity, avoiding
  // Math.pow in the inner reduce loop (54 = 32+16+4+2, the four-summand
  // even-p decomposition extending the partial-wwwwwww
  // tresquinquagintmean-json w32 * w16 * w4 * r.wallSec (53 = 32+16+4+1)
  // four-summand odd-p decomposition by promoting the trailing r.wallSec
  // factor to the cached w2 power to reach the next even exponent,
  // holding multiplication count steady at three), then
  // quattuorquinquagintmeanSec
  // = Math.pow(quattuorquinquagintSum / known.length, 1 / 54). Even p=54
  // preserves sign; wallSec values are strictly positive by construction
  // (wall-clock measurements) so no sign guard is required, matching
  // every prior even-p JSON emitter. All-unknown degenerate case
  // (known.length===0) emits {quattuorquinquagintmeanSec: null,
  // quattuorquinquagintmeanHours: null, knownCount: 0, unknownCount} and
  // exits 0 without attempting (0/0)^(1/54) = NaN, matching the JSON
  // degenerate cadence across every prior JSON power-mean emitter. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Honest-partial: imp-917 stays
  // pending -- the ~20 CPU-hour offline execution of the 14 measurement
  // rows remains the honest closure condition; this partial closes the
  // JSON half of the power-mean pair at p=54.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quattuorquinquagintmeanSec = null;
  if (known.length > 0) {
    const quattuorquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w4 * w2;
    }, 0);
    quattuorquinquagintmeanSec = Math.pow(quattuorquinquagintSum / known.length, 1 / 54);
  }
  const quattuorquinquagintmeanHours =
    quattuorquinquagintmeanSec === null ? null : quattuorquinquagintmeanSec / 3600;
  const body = {
    quattuorquinquagintmeanSec,
    quattuorquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleQuinquequinquagintmean) {
  // partial-zzzzzzz: pure-shell data emitter surfacing the
  // quinquequinquagintic mean (p=55 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // fifty-seventh power-mean sibling extending partial-xxxxxxx
  // quattuorquinquagintmean (p=54) upward to p=55 and the next odd
  // exponent past the p=54 even milestone (quinque=5,
  // quinquaginta=50, so quinquequinquaginta=55; matches the "quinque"
  // prefix cadence the project already uses at p=45 quinquequadragintmean
  // and the smaller quinque- siblings). Computed as QQGM55 =
  // (sum(x_i^55) / n)^(1/55) via Math.pow(s, 1/55); by the generalized
  // power-mean inequality QQGM55 dominates every lower-p sibling, so the
  // monotone chain QQGM55 >= QQGM54 >= TQGM53 >= DQGM52 >= UQGM51 >=
  // QGM50 >= ... >= AM >= GM >= HM now holds inline across all
  // fifty-seven shell emitters. Handler uses the
  // w32 * w16 * w4 * w2 * r.wallSec (55 = 32+16+4+2+1) five-summand
  // odd-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  quinquequinquagintSum += w32 * w16 * w4 * w2 * r.wallSec;) to
  // avoid calling Math.pow in the inner reduce loop: extends the
  // partial-xxxxxxx quattuorquinquagintmean w32 * w16 * w4 * w2
  // (54 = 32+16+4+2) four-summand even-p decomposition by
  // re-introducing the trailing r.wallSec factor to reach the next odd
  // exponent with exactly one additional multiplication, matching the
  // partial-vvvvvvv tresquinquagintmean (53 = 32+16+4+1) odd-p cadence
  // at the prior four-summand odd exponent. Odd p=55 preserves sign;
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so no sign guard is required, matching every prior
  // odd-p shell emitter. All-unknown degenerate case
  // (known.length === 0) prints a dedicated unknown summary and exits 0
  // rather than (0/0)^(1/55) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog
  // --batch-plan-cost-triple-quinquequinquagintmean-json can follow in
  // a future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by
  // one exponent at the next odd p=55 sibling.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple quinquequinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const quinquequinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w4 * w2 * r.wallSec;
  }, 0);
  const quinquequinquagintmeanSec = Math.pow(quinquequinquagintSum / known.length, 1 / 55);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from quinquequinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple quinquequinquagintic-mean wall-time: ${quinquequinquagintmeanSec.toFixed(0)} s (~${(quinquequinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleQuinquequinquagintmeanJson) {
  // partial-aaaaaaaa: structural JSON analog of partial-zzzzzzz
  // --batch-plan-cost-triple-quinquequinquagintmean (p=55 Kolmogorov
  // power-mean), completing the {shell, JSON} pair for partial-zzzzzzz and
  // bringing the Kolmogorov power-mean family at p in {-1, 0, 1..55} x
  // {shell, JSON} to full shell/JSON parity at fifty-seven exponents (one
  // hundred eight emitters in total across the power-mean axis), crossing
  // the p=55 quinquequinquaginta boundary in both forms. Emits one object
  // {quinquequinquagintmeanSec, quinquequinquagintmeanHours, knownCount,
  // unknownCount} with quinquequinquagintmeanHours =
  // quinquequinquagintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=55 power-mean
  // central-tendency signal directly without re-parsing the one-line shell
  // summary and without redoing the seconds-to-hours conversion, matching
  // the precomputed-hours cadence established across every prior JSON
  // cost-emitter. Reuses computeBatchPlanCost() (partial-vv helper) with
  // zero new math; identical known-row filter (wallSec !== null) to the
  // partial-zzzzzzz shell form so the two flags cannot drift. Applies the
  // same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  quinquequinquagintSum += w32 * w16 * w4 * w2 * r.wallSec;) as
  // partial-zzzzzzz for numerical-stability parity and IEEE-754 bit
  // parity, avoiding Math.pow in the inner reduce loop (55 = 32+16+4+2+1,
  // the five-summand odd-p decomposition extending the partial-yyyyyyy
  // quattuorquinquagintmean-json w32 * w16 * w4 * w2 (54 = 32+16+4+2)
  // four-summand even-p decomposition by re-introducing the trailing
  // r.wallSec factor with exactly one additional multiplication), then
  // quinquequinquagintmeanSec
  // = Math.pow(quinquequinquagintSum / known.length, 1 / 55). Odd p=55
  // preserves sign; wallSec values are strictly positive by construction
  // (wall-clock measurements) so no sign guard is required, matching every
  // prior odd-p JSON emitter. All-unknown degenerate case
  // (known.length===0) emits {quinquequinquagintmeanSec: null,
  // quinquequinquagintmeanHours: null, knownCount: 0, unknownCount} and
  // exits 0 without attempting (0/0)^(1/55) = NaN, matching the JSON
  // degenerate cadence across every prior JSON power-mean emitter. Pure
  // data emitter, exit 0 unconditionally (no validation gate), not wired
  // into --preflight / --preflight-json. Honest-partial: imp-917 stays
  // pending -- the ~20 CPU-hour offline execution of the 14 measurement
  // rows remains the honest closure condition; this partial closes the
  // JSON half of the power-mean pair at p=55.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let quinquequinquagintmeanSec = null;
  if (known.length > 0) {
    const quinquequinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w4 * w2 * r.wallSec;
    }, 0);
    quinquequinquagintmeanSec = Math.pow(quinquequinquagintSum / known.length, 1 / 55);
  }
  const quinquequinquagintmeanHours =
    quinquequinquagintmeanSec === null ? null : quinquequinquagintmeanSec / 3600;
  const body = {
    quinquequinquagintmeanSec,
    quinquequinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSexquinquagintmean) {
  // partial-bbbbbbbb: pure-shell data emitter surfacing the
  // sexquinquagintic mean (p=56 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // fifty-eighth power-mean sibling extending partial-zzzzzzz
  // quinquequinquagintmean (p=55) upward to p=56 and the next even
  // exponent (sex=6, quinquaginta=50, so sexquinquaginta=56; matches
  // the "sex" prefix cadence the project already uses at p=46
  // sexquadragintmean and the smaller sex- siblings). Computed as
  // SQGM56 = (sum(x_i^56) / n)^(1/56) via Math.pow(s, 1/56); by the
  // generalized power-mean inequality SQGM56 dominates every lower-p
  // sibling, so the monotone chain SQGM56 >= QQGM55 >= QQGM54 >=
  // TQGM53 >= DQGM52 >= UQGM51 >= QGM50 >= ... >= AM >= GM >= HM now
  // holds inline across all fifty-eight shell emitters. Handler uses
  // the w32 * w16 * w8 (56 = 32+16+8) three-summand even-p
  // decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  sexquinquagintSum += w32 * w16 * w8;) to avoid calling Math.pow
  // in the inner reduce loop: collapses the partial-zzzzzzz
  // quinquequinquagintmean w32 * w16 * w4 * w2 * r.wallSec
  // (55 = 32+16+4+2+1) five-summand odd-p decomposition by promoting
  // the trailing w4 * w2 * r.wallSec product chain to the cached w8
  // power, dropping from five multiplications back to two and matching
  // the partial-ttttttt duoquinquagintmean (52 = 32+16+4) and
  // partial-llllll dyochilic-style three-summand even-p cadence at
  // the next three-summand even exponent. Even p=56 preserves sign;
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so no sign guard is required, matching every prior
  // even-p shell emitter. All-unknown degenerate case
  // (known.length === 0) prints a dedicated unknown summary and exits
  // 0 rather than (0/0)^(1/56) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog
  // --batch-plan-cost-triple-sexquinquagintmean-json can follow in a
  // future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic. Honest-partial: imp-917 stays pending -- the
  // ~20 CPU-hour offline execution of the 14 measurement rows remains
  // the honest closure condition; this partial extends the power-mean
  // family by one exponent at the next even p=56 sibling.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple sexquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sexquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8;
  }, 0);
  const sexquinquagintmeanSec = Math.pow(sexquinquagintSum / known.length, 1 / 56);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from sexquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple sexquinquagintic-mean wall-time: ${sexquinquagintmeanSec.toFixed(0)} s (~${(sexquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSexquinquagintmeanJson) {
  // partial-cccccccc: structural JSON analog of partial-bbbbbbbb
  // --batch-plan-cost-triple-sexquinquagintmean (p=56 Kolmogorov
  // power-mean), completing the {shell, JSON} pair for partial-bbbbbbbb
  // and bringing the Kolmogorov power-mean family at p in {-1, 0, 1..56} x
  // {shell, JSON} to full shell/JSON parity at fifty-eight exponents (one
  // hundred ten emitters in total across the power-mean axis), crossing
  // the p=56 sexquinquaginta boundary in both forms. Emits one object
  // {sexquinquagintmeanSec, sexquinquagintmeanHours, knownCount,
  // unknownCount} with sexquinquagintmeanHours = sexquinquagintmeanSec /
  // 3600 (null when knownCount===0) so Python / jq offline-worker drivers
  // can consume the p=56 power-mean central-tendency signal directly
  // without re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-bbbbbbbb
  // shell form so the two flags cannot drift. Applies the same cached
  // squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  sexquinquagintSum += w32 * w16 * w8;) as partial-bbbbbbbb for
  // numerical-stability parity and IEEE-754 bit parity, avoiding Math.pow
  // in the inner reduce loop (56 = 32+16+8, the three-summand even-p
  // decomposition collapsing the partial-aaaaaaaa quinquequinquagintmean-json
  // w32 * w16 * w4 * w2 * r.wallSec (55 = 32+16+4+2+1) five-summand odd-p
  // decomposition by promoting the trailing w4 * w2 * r.wallSec product
  // chain to the cached w8 power, dropping from five multiplications back
  // to two and matching the partial-yyyyyyy quattuorquinquagintmean-json
  // (54 = 32+16+4) three-summand even-p cadence at the prior even
  // exponent), then sexquinquagintmeanSec = Math.pow(sexquinquagintSum /
  // known.length, 1 / 56). Even p=56 preserves sign; wallSec values are
  // strictly positive by construction (wall-clock measurements) so no
  // sign guard is required, matching every prior even-p JSON emitter.
  // All-unknown degenerate case (known.length===0) emits
  // {sexquinquagintmeanSec: null, sexquinquagintmeanHours: null,
  // knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/56) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Honest-partial: imp-917 stays pending -- the ~20
  // CPU-hour offline execution of the 14 measurement rows remains the
  // honest closure condition; this partial closes the JSON half of the
  // power-mean pair at p=56.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let sexquinquagintmeanSec = null;
  if (known.length > 0) {
    const sexquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w8;
    }, 0);
    sexquinquagintmeanSec = Math.pow(sexquinquagintSum / known.length, 1 / 56);
  }
  const sexquinquagintmeanHours =
    sexquinquagintmeanSec === null ? null : sexquinquagintmeanSec / 3600;
  const body = {
    sexquinquagintmeanSec,
    sexquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSeptenquinquagintmean) {
  // partial-dddddddd: pure-shell data emitter surfacing the
  // septenquinquagintic mean (p=57 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // fifty-ninth power-mean sibling extending partial-bbbbbbbb
  // sexquinquagintmean (p=56) upward to p=57 and the next odd exponent
  // (septen=7, quinquaginta=50, so septenquinquaginta=57; matches the
  // "septen" prefix cadence the project already uses at p=47
  // septenquadragintmean and the smaller septen- siblings). Computed as
  // SQGM57 = (sum(x_i^57) / n)^(1/57) via Math.pow(s, 1/57); by the
  // generalized power-mean inequality SQGM57 dominates every lower-p
  // sibling, so the monotone chain SQGM57 >= SQGM56 >= QQGM55 >= QQGM54
  // >= TQGM53 >= DQGM52 >= UQGM51 >= QGM50 >= ... >= AM >= GM >= HM now
  // holds inline across all fifty-nine shell emitters. Handler uses the
  // w32 * w16 * w8 * r.wallSec (57 = 32+16+8+1) four-summand odd-p
  // decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  septenquinquagintSum += w32 * w16 * w8 * r.wallSec;) to avoid
  // calling Math.pow in the inner reduce loop: extends the
  // partial-bbbbbbbb sexquinquagintmean w32 * w16 * w8 (56 = 32+16+8)
  // three-summand even-p decomposition by re-introducing the trailing
  // r.wallSec factor with exactly one additional multiplication to
  // reach the next odd exponent, matching the partial-vvvvvvv
  // tresquinquagintmean (53 = 32+16+4+1) odd-p four-summand cadence at
  // the prior four-summand odd exponent. Odd p=57 preserves sign;
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so no sign guard is required, matching every prior
  // odd-p shell emitter. All-unknown degenerate case
  // (known.length === 0) prints a dedicated unknown summary and exits
  // 0 rather than (0/0)^(1/57) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog
  // --batch-plan-cost-triple-septenquinquagintmean-json can follow in
  // a future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic. Honest-partial: imp-917 stays pending -- the
  // ~20 CPU-hour offline execution of the 14 measurement rows remains
  // the honest closure condition; this partial extends the power-mean
  // family by one exponent at the next odd p=57 sibling.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple septenquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const septenquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8 * r.wallSec;
  }, 0);
  const septenquinquagintmeanSec = Math.pow(septenquinquagintSum / known.length, 1 / 57);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from septenquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple septenquinquagintic-mean wall-time: ${septenquinquagintmeanSec.toFixed(0)} s (~${(septenquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSeptenquinquagintmeanJson) {
  // partial-eeeeeeee: structural JSON analog of partial-dddddddd
  // --batch-plan-cost-triple-septenquinquagintmean (p=57 Kolmogorov
  // power-mean), completing the {shell, JSON} pair for partial-dddddddd
  // and bringing the Kolmogorov power-mean family at p in {-1, 0, 1..57} x
  // {shell, JSON} to full shell/JSON parity at fifty-nine exponents,
  // crossing the p=57 septenquinquaginta boundary in both forms. Emits one
  // object {septenquinquagintmeanSec, septenquinquagintmeanHours,
  // knownCount, unknownCount} with septenquinquagintmeanHours =
  // septenquinquagintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=57 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-dddddddd shell form so the two
  // flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  septenquinquagintSum += w32 * w16 * w8 * r.wallSec;) as
  // partial-dddddddd for numerical-stability parity and IEEE-754 bit
  // parity, avoiding Math.pow in the inner reduce loop (57 = 32+16+8+1,
  // the four-summand odd-p decomposition extending the partial-cccccccc
  // sexquinquagintmean-json w32 * w16 * w8 (56 = 32+16+8) three-summand
  // even-p decomposition by re-introducing the trailing r.wallSec
  // factor with exactly one additional multiplication to reach the next
  // odd exponent), then septenquinquagintmeanSec =
  // Math.pow(septenquinquagintSum / known.length, 1 / 57). Odd p=57
  // preserves sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // matching every prior odd-p JSON emitter. All-unknown degenerate
  // case (known.length===0) emits {septenquinquagintmeanSec: null,
  // septenquinquagintmeanHours: null, knownCount: 0, unknownCount} and
  // exits 0 without attempting (0/0)^(1/57) = NaN, matching the JSON
  // degenerate cadence across every prior JSON power-mean emitter.
  // Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Honest-partial:
  // imp-917 stays pending -- the ~20 CPU-hour offline execution of the
  // 14 measurement rows remains the honest closure condition; this
  // partial closes the JSON half of the power-mean pair at p=57.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let septenquinquagintmeanSec = null;
  if (known.length > 0) {
    const septenquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w8 * r.wallSec;
    }, 0);
    septenquinquagintmeanSec = Math.pow(septenquinquagintSum / known.length, 1 / 57);
  }
  const septenquinquagintmeanHours =
    septenquinquagintmeanSec === null ? null : septenquinquagintmeanSec / 3600;
  const body = {
    septenquinquagintmeanSec,
    septenquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleOctoquinquagintmean) {
  // partial-ffffffff: pure-shell data emitter surfacing the
  // octoquinquagintic mean (p=58 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // sixtieth power-mean sibling extending partial-dddddddd
  // septenquinquagintmean (p=57) upward to p=58 and the next even
  // exponent past the p=57 odd milestone (octo=8, quinquaginta=50, so
  // octoquinquaginta=58; matches the project octo- prefix cadence
  // already in use at p=48 octoquadragintmean and at the smaller octo-
  // siblings). Computed as OQGM58 = (sum(x_i^58) / n)^(1/58) via
  // Math.pow(s, 1/58); by the generalized power-mean inequality OQGM58
  // dominates every lower-p sibling, so the monotone chain
  // OQGM58 >= SQGM57 >= SQGM56 >= QQGM55 >= QQGM54 >= TQGM53 >= DQGM52
  // >= UQGM51 >= QGM50 >= ... >= AM >= GM >= HM now holds inline across
  // all sixty shell emitters. Handler uses the
  // w32 * w16 * w8 * w2 (58 = 32+16+8+2) four-summand even-p
  // decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  octoquinquagintSum += w32 * w16 * w8 * w2;) to avoid calling
  // Math.pow in the inner reduce loop: extends the partial-dddddddd
  // septenquinquagintmean w32 * w16 * w8 * r.wallSec (57 = 32+16+8+1)
  // four-summand odd-p decomposition by promoting the trailing
  // r.wallSec factor to the cached w2 power to reach the next even
  // exponent at the same multiplication count, matching the
  // partial-xxxxxxx quattuorquinquagintmean (54 = 32+16+4+2)
  // four-summand even-p cadence at the prior four-summand even
  // exponent. Even p=58 preserves sign; wallSec values are strictly
  // positive by construction (wall-clock measurements) so no sign
  // guard is required, matching every prior even-p shell emitter.
  // All-unknown degenerate case (known.length === 0) prints a
  // dedicated unknown summary and exits 0 rather than (0/0)^(1/58) =
  // NaN. Pure data emitter, exit 0 unconditionally (no validation
  // gate), not wired into --preflight / --preflight-json. JSON analog
  // --batch-plan-cost-triple-octoquinquagintmean-json can follow in a
  // future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic. Honest-partial: imp-917 stays pending -- the
  // ~20 CPU-hour offline execution of the 14 measurement rows remains
  // the honest closure condition; this partial extends the power-mean
  // family by one exponent at the next even p=58 sibling.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple octoquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const octoquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8 * w2;
  }, 0);
  const octoquinquagintmeanSec = Math.pow(octoquinquagintSum / known.length, 1 / 58);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from octoquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple octoquinquagintic-mean wall-time: ${octoquinquagintmeanSec.toFixed(0)} s (~${(octoquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleOctoquinquagintmeanJson) {
  // partial-gggggggg: structural JSON analog of partial-ffffffff
  // --batch-plan-cost-triple-octoquinquagintmean (p=58 Kolmogorov
  // power-mean), completing the {shell, JSON} pair for partial-ffffffff
  // and bringing the Kolmogorov power-mean family at p in {-1, 0, 1..58} x
  // {shell, JSON} to full shell/JSON parity at sixty exponents, crossing
  // the p=58 octoquinquaginta even-p boundary in both forms. Emits one
  // object {octoquinquagintmeanSec, octoquinquagintmeanHours,
  // knownCount, unknownCount} with octoquinquagintmeanHours =
  // octoquinquagintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=58 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-ffffffff shell form so the two
  // flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  octoquinquagintSum += w32 * w16 * w8 * w2;) as partial-ffffffff
  // for numerical-stability parity and IEEE-754 bit parity, avoiding
  // Math.pow in the inner reduce loop (58 = 32+16+8+2, the four-summand
  // even-p decomposition extending the partial-eeeeeeee
  // septenquinquagintmean-json w32 * w16 * w8 * r.wallSec
  // (57 = 32+16+8+1) four-summand odd-p decomposition by promoting the
  // trailing r.wallSec factor to the cached w2 power to reach the next
  // even exponent at the same multiplication count), then
  // octoquinquagintmeanSec =
  // Math.pow(octoquinquagintSum / known.length, 1 / 58). Even p=58
  // preserves sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // matching every prior even-p JSON emitter. All-unknown degenerate
  // case (known.length===0) emits {octoquinquagintmeanSec: null,
  // octoquinquagintmeanHours: null, knownCount: 0, unknownCount} and
  // exits 0 without attempting (0/0)^(1/58) = NaN, matching the JSON
  // degenerate cadence across every prior JSON power-mean emitter.
  // Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Honest-partial:
  // imp-917 stays pending -- the ~20 CPU-hour offline execution of the
  // 14 measurement rows remains the honest closure condition; this
  // partial closes the JSON half of the power-mean pair at p=58.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let octoquinquagintmeanSec = null;
  if (known.length > 0) {
    const octoquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w8 * w2;
    }, 0);
    octoquinquagintmeanSec = Math.pow(octoquinquagintSum / known.length, 1 / 58);
  }
  const octoquinquagintmeanHours =
    octoquinquagintmeanSec === null ? null : octoquinquagintmeanSec / 3600;
  const body = {
    octoquinquagintmeanSec,
    octoquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleNovemquinquagintmean) {
  // partial-hhhhhhhh: pure-shell data emitter surfacing the
  // novemquinquagintic mean (p=59 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // sixty-first power-mean sibling extending partial-ffffffff
  // octoquinquagintmean (p=58) upward to p=59 and the next odd exponent
  // past the p=58 even milestone (novem=9, quinquaginta=50, so
  // novemquinquaginta=59; matches the project novem- prefix cadence
  // already in use at p=49 novemquadragintmean and at the smaller
  // novem- siblings). Computed as NQGM59 = (sum(x_i^59) / n)^(1/59) via
  // Math.pow(s, 1/59); by the generalized power-mean inequality NQGM59
  // dominates every lower-p sibling, so the monotone chain
  // NQGM59 >= OQGM58 >= SQGM57 >= SQGM56 >= QQGM55 >= QQGM54 >= TQGM53
  // >= DQGM52 >= UQGM51 >= QGM50 >= ... >= AM >= GM >= HM now holds
  // inline across all sixty-one shell emitters. Handler uses the
  // w32 * w16 * w8 * w2 * r.wallSec (59 = 32+16+8+2+1) five-summand
  // odd-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  novemquinquagintSum += w32 * w16 * w8 * w2 * r.wallSec;) to avoid
  // calling Math.pow in the inner reduce loop: extends the
  // partial-ffffffff octoquinquagintmean w32 * w16 * w8 * w2
  // (58 = 32+16+8+2) four-summand even-p decomposition by re-introducing
  // the trailing r.wallSec factor with exactly one additional
  // multiplication to reach the next odd exponent at the same cached
  // squaring chain, matching the partial-aaaaaaaa
  // quinquequinquagintmean-json (55 = 32+16+4+2+1) five-summand odd-p
  // cadence at the prior five-summand odd exponent. Odd p=59 preserves
  // sign; wallSec values are strictly positive by construction
  // (wall-clock measurements) so no sign guard is required, matching
  // every prior odd-p shell emitter. All-unknown degenerate case
  // (known.length === 0) prints a dedicated unknown summary and exits
  // 0 rather than (0/0)^(1/59) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog
  // --batch-plan-cost-triple-novemquinquagintmean-json can follow in a
  // future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic. Honest-partial: imp-917 stays pending -- the
  // ~20 CPU-hour offline execution of the 14 measurement rows remains
  // the honest closure condition; this partial extends the power-mean
  // family by one exponent at the next odd p=59 sibling.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple novemquinquagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const novemquinquagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8 * w2 * r.wallSec;
  }, 0);
  const novemquinquagintmeanSec = Math.pow(novemquinquagintSum / known.length, 1 / 59);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from novemquinquagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple novemquinquagintic-mean wall-time: ${novemquinquagintmeanSec.toFixed(0)} s (~${(novemquinquagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleNovemquinquagintmeanJson) {
  // partial-iiiiiiii: structural JSON analog of partial-hhhhhhhh
  // --batch-plan-cost-triple-novemquinquagintmean (p=59 Kolmogorov
  // power-mean), completing the {shell, JSON} pair for partial-hhhhhhhh
  // and bringing the Kolmogorov power-mean family at p in {-1, 0, 1..59} x
  // {shell, JSON} to full shell/JSON parity at sixty-one exponents,
  // crossing the p=59 novemquinquaginta odd-p boundary in both forms.
  // Emits one object {novemquinquagintmeanSec, novemquinquagintmeanHours,
  // knownCount, unknownCount} with novemquinquagintmeanHours =
  // novemquinquagintmeanSec / 3600 (null when knownCount===0) so
  // Python / jq offline-worker drivers can consume the p=59 power-mean
  // central-tendency signal directly without re-parsing the one-line
  // shell summary and without redoing the seconds-to-hours conversion,
  // matching the precomputed-hours cadence established across every
  // prior JSON cost-emitter. Reuses computeBatchPlanCost() (partial-vv
  // helper) with zero new math; identical known-row filter
  // (wallSec !== null) to the partial-hhhhhhhh shell form so the two
  // flags cannot drift. Applies the same cached squaring chain
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  novemquinquagintSum += w32 * w16 * w8 * w2 * r.wallSec;) as
  // partial-hhhhhhhh for numerical-stability parity and IEEE-754 bit
  // parity, avoiding Math.pow in the inner reduce loop
  // (59 = 32+16+8+2+1, the five-summand odd-p decomposition extending
  // the partial-gggggggg octoquinquagintmean-json w32 * w16 * w8 * w2
  // (58 = 32+16+8+2) four-summand even-p decomposition by re-introducing
  // the trailing r.wallSec factor with exactly one additional
  // multiplication to reach the next odd exponent at the same cached
  // squaring chain), then novemquinquagintmeanSec =
  // Math.pow(novemquinquagintSum / known.length, 1 / 59). Odd p=59
  // preserves sign; wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // matching every prior odd-p JSON emitter. All-unknown degenerate
  // case (known.length===0) emits {novemquinquagintmeanSec: null,
  // novemquinquagintmeanHours: null, knownCount: 0, unknownCount} and
  // exits 0 without attempting (0/0)^(1/59) = NaN, matching the JSON
  // degenerate cadence across every prior JSON power-mean emitter.
  // Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Honest-partial:
  // imp-917 stays pending -- the ~20 CPU-hour offline execution of the
  // 14 measurement rows remains the honest closure condition; this
  // partial closes the JSON half of the power-mean pair at p=59.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let novemquinquagintmeanSec = null;
  if (known.length > 0) {
    const novemquinquagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w8 * w2 * r.wallSec;
    }, 0);
    novemquinquagintmeanSec = Math.pow(novemquinquagintSum / known.length, 1 / 59);
  }
  const novemquinquagintmeanHours =
    novemquinquagintmeanSec === null ? null : novemquinquagintmeanSec / 3600;
  const body = {
    novemquinquagintmeanSec,
    novemquinquagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleSexagintmean) {
  // partial-jjjjjjjj: pure-shell data emitter surfacing the
  // sexagintic mean (p=60 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // sixty-second power-mean sibling extending partial-hhhhhhhh
  // novemquinquagintmean (p=59) upward to p=60 and crossing the
  // p=60 sexaginta boundary at the next even exponent past p=58
  // octoquinquagintmean (sexaginta=60, matching the project sexaginta
  // prefix unprefixed at the round decade boundary, paralleling
  // partial-ppppppp quinquagintmean at the p=50 round boundary).
  // Computed as SGM60 = (sum(x_i^60) / n)^(1/60) via Math.pow(s, 1/60);
  // by the generalized power-mean inequality SGM60 dominates every
  // lower-p sibling, so the monotone chain
  // SGM60 >= NQGM59 >= OQGM58 >= SQGM57 >= SQGM56 >= QQGM55 >= QQGM54
  // >= TQGM53 >= DQGM52 >= UQGM51 >= QGM50 >= ... >= AM >= GM >= HM
  // now holds inline across all sixty-two shell emitters. Handler
  // uses the w32 * w16 * w8 * w4 (60 = 32+16+8+4) four-summand even-p
  // decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  sexagintSum += w32 * w16 * w8 * w4;) to avoid calling Math.pow
  // in the inner reduce loop: rotates the partial-ffffffff
  // octoquinquagintmean w32 * w16 * w8 * w2 (58 = 32+16+8+2) four-summand
  // even-p decomposition by promoting the trailing w2 factor to w4 with
  // exactly zero additional multiplications at the same cached squaring
  // chain (w4 is already computed for the chain), matching the four-summand
  // even-p cadence at the prior even exponent. Even p=60 cannot induce
  // sign cancellation for any input; wallSec values are strictly positive
  // by construction (wall-clock measurements) so no sign guard is required,
  // matching every prior even-p shell emitter. All-unknown degenerate case
  // (known.length === 0) prints a dedicated unknown summary and exits
  // 0 rather than (0/0)^(1/60) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog
  // --batch-plan-cost-triple-sexagintmean-json can follow in a
  // future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic. Honest-partial: imp-917 stays pending -- the
  // ~20 CPU-hour offline execution of the 14 measurement rows remains
  // the honest closure condition; this partial extends the power-mean
  // family by one exponent at the next even p=60 sibling crossing the
  // sexaginta decade boundary.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple sexagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const sexagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8 * w4;
  }, 0);
  const sexagintmeanSec = Math.pow(sexagintSum / known.length, 1 / 60);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from sexagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple sexagintic-mean wall-time: ${sexagintmeanSec.toFixed(0)} s (~${(sexagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleSexagintmeanJson) {
  // partial-kkkkkkkk: structural JSON analog of partial-jjjjjjjj
  // --batch-plan-cost-triple-sexagintmean (p=60 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-jjjjjjjj and bringing
  // the Kolmogorov power-mean family at p in {-1, 0, 1..60} x
  // {shell, JSON} to full shell/JSON parity at sixty-two exponents,
  // crossing the p=60 sexaginta decade boundary in both forms.
  // Emits one object {sexagintmeanSec, sexagintmeanHours, knownCount,
  // unknownCount} with sexagintmeanHours = sexagintmeanSec / 3600
  // (null when knownCount===0) so Python / jq offline-worker drivers
  // can consume the p=60 power-mean central-tendency signal directly
  // without re-parsing the one-line shell summary and without redoing
  // the seconds-to-hours conversion, matching the precomputed-hours
  // cadence established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-jjjjjjjj
  // shell form so the two flags cannot drift. Applies the same cached
  // squaring chain (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  sexagintSum += w32 * w16 * w8 * w4;) as partial-jjjjjjjj for
  // numerical-stability parity and IEEE-754 bit parity, avoiding
  // Math.pow in the inner reduce loop (60 = 32+16+8+4, the four-summand
  // even-p decomposition rotating partial-ffffffff octoquinquagintmean
  // w32 * w16 * w8 * w2 (58 = 32+16+8+2) by promoting the trailing w2
  // factor to w4 with exactly zero additional multiplications at the
  // same cached squaring chain), then sexagintmeanSec =
  // Math.pow(sexagintSum / known.length, 1 / 60). Even p=60 cannot
  // induce sign cancellation; wallSec values are strictly positive by
  // construction (wall-clock measurements) so no sign guard is required,
  // matching every prior even-p JSON emitter. All-unknown degenerate
  // case (known.length===0) emits {sexagintmeanSec: null,
  // sexagintmeanHours: null, knownCount: 0, unknownCount} and
  // exits 0 without attempting (0/0)^(1/60) = NaN, matching the JSON
  // degenerate cadence across every prior JSON power-mean emitter.
  // Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. Honest-partial:
  // imp-917 stays pending -- the ~20 CPU-hour offline execution of the
  // 14 measurement rows remains the honest closure condition; this
  // partial closes the JSON half of the power-mean pair at p=60.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let sexagintmeanSec = null;
  if (known.length > 0) {
    const sexagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w8 * w4;
    }, 0);
    sexagintmeanSec = Math.pow(sexagintSum / known.length, 1 / 60);
  }
  const sexagintmeanHours =
    sexagintmeanSec === null ? null : sexagintmeanSec / 3600;
  const body = {
    sexagintmeanSec,
    sexagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleUnsexagintmean) {
  // partial-llllllll: pure-shell data emitter surfacing the
  // unsexagintic mean (p=61 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // sixty-third power-mean sibling extending partial-jjjjjjjj
  // sexagintmean (p=60) upward to p=61 as the first odd exponent
  // past the p=60 sexaginta decade boundary (un-sexaginta = 1+60 = 61,
  // matching the project un- prefix cadence at the start of the
  // sexaginta decade as un-quinquaginta=51 opened the quinquaginta
  // decade and un-quadraginta=41 opened the quadraginta decade).
  // Computed as USGM61 = (sum(x_i^61) / n)^(1/61) via Math.pow(s, 1/61);
  // by the generalized power-mean inequality USGM61 dominates every
  // lower-p sibling so the monotone chain
  // USGM61 >= SGM60 >= NQGM59 >= OQGM58 >= SQGM57 >= SQGM56 >= ...
  // >= AM >= GM >= HM now holds inline across all sixty-three shell
  // emitters. Handler uses the w32 * w16 * w8 * w4 * r.wallSec
  // (61 = 32+16+8+4+1) five-summand odd-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  unsexagintSum += w32 * w16 * w8 * w4 * r.wallSec;) to avoid
  // calling Math.pow in the inner reduce loop: promotes the
  // partial-jjjjjjjj sexagintmean w32 * w16 * w8 * w4 (60 = 32+16+8+4)
  // four-summand even-p decomposition to the next odd exponent by
  // appending the trailing r.wallSec factor for the +1 odd-p tail at
  // exactly one additional multiplication on the same cached squaring
  // chain, matching the four-summand-even -> five-summand-odd cadence
  // (partial-zz/partial-aaa pair, partial-eeee/partial-ffff pair,
  // partial-gggg/partial-hhhh pair, partial-jjjj/partial-kkkk pair, ...).
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so the trailing odd factor cannot induce sign
  // cancellation; no sign guard is required, matching every prior
  // odd-p shell emitter. All-unknown degenerate case (known.length===0)
  // prints a dedicated unknown summary and exits 0 rather than
  // (0/0)^(1/61) = NaN. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // JSON analog --batch-plan-cost-triple-unsexagintmean-json can follow
  // in a future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new
  // batch-plan logic. Honest-partial: imp-917 stays pending -- the
  // ~20 CPU-hour offline execution of the 14 measurement rows remains
  // the honest closure condition; this partial extends the power-mean
  // family by one exponent at the next odd p=61 sibling crossing past
  // the p=60 sexaginta decade boundary.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple unsexagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const unsexagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8 * w4 * r.wallSec;
  }, 0);
  const unsexagintmeanSec = Math.pow(unsexagintSum / known.length, 1 / 61);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from unsexagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple unsexagintic-mean wall-time: ${unsexagintmeanSec.toFixed(0)} s (~${(unsexagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleUnsexagintmeanJson) {
  // partial-mmmmmmmm: structural JSON analog of partial-llllllll
  // --batch-plan-cost-triple-unsexagintmean (p=61 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-llllllll and bringing
  // the Kolmogorov power-mean family at p in {-1, 0, 1..61} x
  // {shell, JSON} to full shell/JSON parity at sixty-three exponents,
  // crossing the first odd exponent past the p=60 sexaginta decade
  // boundary in both forms. Emits one object {unsexagintmeanSec,
  // unsexagintmeanHours, knownCount, unknownCount} with
  // unsexagintmeanHours = unsexagintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume
  // the p=61 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-llllllll
  // shell form so the two flags cannot drift. Applies the same cached
  // squaring chain (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  unsexagintSum += w32 * w16 * w8 * w4 * r.wallSec;) as
  // partial-llllllll for numerical-stability parity and IEEE-754 bit
  // parity, avoiding Math.pow in the inner reduce loop (61 = 32+16+8+4+1,
  // the five-summand odd-p decomposition promoting partial-jjjjjjjj
  // sexagintmean w32 * w16 * w8 * w4 (60 = 32+16+8+4) to the next odd
  // exponent by appending the trailing r.wallSec factor at exactly one
  // additional multiplication on the same cached squaring chain), then
  // unsexagintmeanSec = Math.pow(unsexagintSum / known.length, 1 / 61).
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so the trailing odd factor cannot induce sign
  // cancellation; no sign guard is required, matching every prior odd-p
  // JSON emitter. All-unknown degenerate case (known.length===0) emits
  // {unsexagintmeanSec: null, unsexagintmeanHours: null, knownCount: 0,
  // unknownCount} and exits 0 without attempting (0/0)^(1/61) = NaN,
  // matching the JSON degenerate cadence across every prior JSON
  // power-mean emitter. Pure data emitter, exit 0 unconditionally
  // (no validation gate), not wired into --preflight / --preflight-json.
  // Honest-partial: imp-917 stays pending -- the ~20 CPU-hour offline
  // execution of the 14 measurement rows remains the honest closure
  // condition; this partial closes the JSON half of the power-mean pair
  // at p=61.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let unsexagintmeanSec = null;
  if (known.length > 0) {
    const unsexagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w8 * w4 * r.wallSec;
    }, 0);
    unsexagintmeanSec = Math.pow(unsexagintSum / known.length, 1 / 61);
  }
  const unsexagintmeanHours =
    unsexagintmeanSec === null ? null : unsexagintmeanSec / 3600;
  const body = {
    unsexagintmeanSec,
    unsexagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleDuosexagintmean) {
  // partial-nnnnnnnn: pure-shell data emitter surfacing the
  // duosexagintic mean (p=62 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // sixty-fourth power-mean sibling extending partial-llllllll
  // unsexagintmean (p=61) upward by one exponent to the next even p
  // past the p=60 sexaginta decade boundary (duo-sexaginta = 2+60 = 62,
  // matching the project duo- prefix cadence at the next even sibling
  // inside the sexaginta decade as duo-quinquaginta=52 followed
  // un-quinquaginta=51 inside the quinquaginta decade and
  // duo-quadraginta=42 followed un-quadraginta=41 inside the
  // quadraginta decade). Computed as DSGM62 = (sum(x_i^62) / n)^(1/62)
  // via Math.pow(s, 1/62); by the generalized power-mean inequality
  // DSGM62 dominates every lower-p sibling so the monotone chain
  // DSGM62 >= USGM61 >= SGM60 >= NQGM59 >= OQGM58 >= ... >= AM >= GM
  // >= HM now holds inline across all sixty-four shell emitters.
  // Handler uses the w32 * w16 * w8 * w4 * w2 (62 = 32+16+8+4+2)
  // five-summand even-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  duosexagintSum += w32 * w16 * w8 * w4 * w2;) to avoid calling
  // Math.pow in the inner reduce loop: promotes the partial-llllllll
  // unsexagintmean w32 * w16 * w8 * w4 * r.wallSec (61 = 32+16+8+4+1)
  // five-summand odd-p decomposition to the next even exponent by
  // promoting the trailing r.wallSec odd-tail factor to w2 at exactly
  // zero additional multiplications on the same cached squaring chain
  // (w2 is already computed for the chain), matching the
  // five-summand-odd -> five-summand-even cadence (partial-aaa/partial-bbbb
  // pair at p=51/52, partial-ffff/partial-gggg pair at p=53/54,
  // partial-jjjj/partial-kkkk pair at p=55/56, ...). Even p=62 cannot
  // induce sign cancellation for any input; wallSec values are strictly
  // positive by construction (wall-clock measurements) so no sign guard
  // is required, matching every prior even-p shell emitter. All-unknown
  // degenerate case (known.length===0) prints a dedicated unknown summary
  // and exits 0 rather than (0/0)^(1/62) = NaN. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. JSON analog
  // --batch-plan-cost-triple-duosexagintmean-json can follow in a future
  // partial, matching the shell-first / JSON-second cadence established
  // across every other cost-emitter axis. Reuses computeBatchPlanCost()
  // (partial-vv helper) with zero new batch-plan logic. Honest-partial:
  // imp-917 stays pending -- the ~20 CPU-hour offline execution of the
  // 14 measurement rows remains the honest closure condition; this
  // partial extends the power-mean family by one exponent at the next
  // even p=62 sibling inside the sexaginta decade.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple duosexagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const duosexagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8 * w4 * w2;
  }, 0);
  const duosexagintmeanSec = Math.pow(duosexagintSum / known.length, 1 / 62);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from duosexagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple duosexagintic-mean wall-time: ${duosexagintmeanSec.toFixed(0)} s (~${(duosexagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
  );
  process.exit(0);
}

if (args.batchPlanCostTripleDuosexagintmeanJson) {
  // partial-oooooooo: structural JSON analog of partial-nnnnnnnn
  // --batch-plan-cost-triple-duosexagintmean (p=62 Kolmogorov power-mean),
  // completing the {shell, JSON} pair for partial-nnnnnnnn and bringing
  // the Kolmogorov power-mean family at p in {-1, 0, 1..62} x
  // {shell, JSON} to full shell/JSON parity at sixty-four exponents,
  // crossing the first even exponent past the p=61 unsexaginta sibling
  // inside the sexaginta decade in both forms. Emits one object
  // {duosexagintmeanSec, duosexagintmeanHours, knownCount, unknownCount}
  // with duosexagintmeanHours = duosexagintmeanSec / 3600 (null when
  // knownCount===0) so Python / jq offline-worker drivers can consume
  // the p=62 power-mean central-tendency signal directly without
  // re-parsing the one-line shell summary and without redoing the
  // seconds-to-hours conversion, matching the precomputed-hours cadence
  // established across every prior JSON cost-emitter. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new math;
  // identical known-row filter (wallSec !== null) to the partial-nnnnnnnn
  // shell form so the two flags cannot drift. Applies the same cached
  // squaring chain (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  duosexagintSum += w32 * w16 * w8 * w4 * w2;) as partial-nnnnnnnn for
  // numerical-stability parity and IEEE-754 bit parity, avoiding Math.pow
  // in the inner reduce loop (62 = 32+16+8+4+2, the five-summand even-p
  // decomposition promoting partial-llllllll unsexagintmean
  // w32 * w16 * w8 * w4 * r.wallSec (61 = 32+16+8+4+1) to the next even
  // exponent by promoting the trailing r.wallSec odd-tail factor to w2 at
  // exactly zero additional multiplications on the same cached squaring
  // chain), then duosexagintmeanSec = Math.pow(duosexagintSum / known.length,
  // 1 / 62). Even p=62 cannot induce sign cancellation for any input;
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so no sign guard is required, matching every prior
  // even-p JSON emitter. All-unknown degenerate case (known.length===0)
  // emits {duosexagintmeanSec: null, duosexagintmeanHours: null,
  // knownCount: 0, unknownCount} and exits 0 without attempting
  // (0/0)^(1/62) = NaN, matching the JSON degenerate cadence across every
  // prior JSON power-mean emitter. Pure data emitter, exit 0
  // unconditionally (no validation gate), not wired into --preflight /
  // --preflight-json. Honest-partial: imp-917 stays pending -- the
  // ~20 CPU-hour offline execution of the 14 measurement rows remains
  // the honest closure condition; this partial closes the JSON half of
  // the power-mean pair at p=62.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  let duosexagintmeanSec = null;
  if (known.length > 0) {
    const duosexagintSum = known.reduce((s, r) => {
      const w2 = r.wallSec * r.wallSec;
      const w4 = w2 * w2;
      const w8 = w4 * w4;
      const w16 = w8 * w8;
      const w32 = w16 * w16;
      return s + w32 * w16 * w8 * w4 * w2;
    }, 0);
    duosexagintmeanSec = Math.pow(duosexagintSum / known.length, 1 / 62);
  }
  const duosexagintmeanHours =
    duosexagintmeanSec === null ? null : duosexagintmeanSec / 3600;
  const body = {
    duosexagintmeanSec,
    duosexagintmeanHours,
    knownCount: known.length,
    unknownCount,
  };
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

if (args.batchPlanCostTripleTressexagintmean) {
  // partial-pppppppp: pure-shell data emitter surfacing the
  // tressexagintic mean (p=63 Kolmogorov power-mean) of per-triple
  // wall-times across the known-wallSec rows of BATCH_PLAN, as the
  // sixty-fifth power-mean sibling extending partial-nnnnnnnn
  // duosexagintmean (p=62) upward by one exponent to the next odd p
  // inside the sexaginta decade. sexaginta=60, so tressexaginta=63;
  // matches the "tres" prefix cadence the project already uses at p=23
  // tresvigintmean, p=43 tresquadragintmean, and p=53 tresquinquagintmean
  // (the sole exception remains the trigint decade where p=33 collapses
  // to tritrigintmean to avoid the awkward tres+trigint cluster).
  // Computed as TSGM63 = (sum(x_i^63) / n)^(1/63) via Math.pow(s, 1/63);
  // by the generalized power-mean inequality TSGM63 dominates every
  // lower-p sibling so the monotone chain
  // TSGM63 >= DSGM62 >= USGM61 >= SGM60 >= NQGM59 >= ... >= AM >= GM
  // >= HM now holds inline across all sixty-five shell emitters.
  // Handler uses the w32 * w16 * w8 * w4 * w2 * r.wallSec
  // (63 = 32+16+8+4+2+1) six-summand odd-p decomposition
  // (const w2 = r.wallSec * r.wallSec; const w4 = w2 * w2;
  //  const w8 = w4 * w4; const w16 = w8 * w8; const w32 = w16 * w16;
  //  tressexagintSum += w32 * w16 * w8 * w4 * w2 * r.wallSec;) to avoid
  // calling Math.pow in the inner reduce loop: promotes the
  // partial-nnnnnnnn duosexagintmean w32 * w16 * w8 * w4 * w2
  // (62 = 32+16+8+4+2) five-summand even-p decomposition to the next
  // odd exponent by appending the trailing r.wallSec factor at exactly
  // one additional multiplication on the same cached squaring chain,
  // matching the five-summand-even -> six-summand-odd cadence
  // (partial-bbbb/partial-cccc pair at p=52/53, partial-gggg/partial-hhhh
  // pair at p=54/55, partial-kkkk/partial-llll pair at p=56/57, ...).
  // wallSec values are strictly positive by construction (wall-clock
  // measurements) so the trailing odd factor cannot induce sign
  // cancellation; no sign guard is required, matching every prior odd-p
  // shell emitter. All-unknown degenerate case (known.length===0) prints
  // a dedicated unknown summary and exits 0 rather than (0/0)^(1/63) =
  // NaN. Pure data emitter, exit 0 unconditionally (no validation gate),
  // not wired into --preflight / --preflight-json. JSON analog
  // --batch-plan-cost-triple-tressexagintmean-json can follow in a
  // future partial, matching the shell-first / JSON-second cadence
  // established across every other cost-emitter axis. Reuses
  // computeBatchPlanCost() (partial-vv helper) with zero new batch-plan
  // logic. Honest-partial: imp-917 stays pending -- the ~20 CPU-hour
  // offline execution of the 14 measurement rows remains the honest
  // closure condition; this partial extends the power-mean family by
  // one exponent at the next odd p=63 sibling inside the sexaginta
  // decade.
  const { rows, unknownCount } = computeBatchPlanCost();
  const known = rows.filter((r) => r.wallSec !== null);
  if (known.length === 0) {
    console.log(
      'imp-917 BATCH_PLAN per-triple tressexagintic-mean wall-time: unknown (all triples have unknown N).',
    );
    process.exit(0);
  }
  const tressexagintSum = known.reduce((s, r) => {
    const w2 = r.wallSec * r.wallSec;
    const w4 = w2 * w2;
    const w8 = w4 * w4;
    const w16 = w8 * w8;
    const w32 = w16 * w16;
    return s + w32 * w16 * w8 * w4 * w2 * r.wallSec;
  }, 0);
  const tressexagintmeanSec = Math.pow(tressexagintSum / known.length, 1 / 63);
  const unknownNote =
    unknownCount > 0
      ? ` (${unknownCount} triple-run(s) with unknown N excluded from tressexagintmean)`
      : '';
  console.log(
    `imp-917 BATCH_PLAN per-triple tressexagintic-mean wall-time: ${tressexagintmeanSec.toFixed(0)} s (~${(tressexagintmeanSec / 3600).toFixed(2)} CPU-hours) across ${known.length} known triple(s)${unknownNote}.`,
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
