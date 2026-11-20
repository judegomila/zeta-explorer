# c10-repair-record-referee-r9: record lane B and the repair slot of round 10

2026-11-19. Kind: repair. Verdict: **partial-result** (record and bookkeeping; no argument about zeta). No
statement about zeros of zeta is made. Requirement flags: R1 = R2 = R3 = R4 = false, unchanged.

## 1. Plan

Assignment in six parts: (1) second referee pass on the 12 lines of Statement O, or the label "relative to
<source>"; remove the joint clause; (2) apply the owed map rows; (3) check outcome records and lane lines of round
9 against the referee files, correct device evidence, rerun the engine; (4) strategy sections 3.1 and 4.0;
(5) server cleanup of one directory; (6) report two untracked files.

Decisive first test: whether the closing step of each line can be checked independently. Reading of the closing
step (REFEREE2 section 0): by definitions A3 and A4 of the statement, a zero-mode line closes with (m) membership of
the control in the read class and (z) one zero. Lines where (m) and (z) are elementary can be covered by a second
file; lines where either rests on an unopened or unrepeated source get "relative to". The test was run first
(`ref2_checks.py`); it did not kill anything, so no pivot was used.

New against the map and the walls: nothing mathematical. This lane adds no route.

## 2. Work

### 2.1 Second pass on Statement O (file `REFEREE2.md`, one section per line)

Runs: `ref2_checks.py` (mpmath 30 digits, 128 s, local, `scripts/memcap.sh 8`, largest allocation a 10 MB sieve;
log `ref2_checks.log`, values `ref2_checks.json`), `ref2_l9_hp.py` (80 digits; `ref2_l9_hp.log`). Cases differ from
the lane's and from the first referee's. Multiprecision evaluations, not interval certificates.

| line | class (short) | this pass | label after the pass |
|---|---|---|---|
| 1 | size / positivity / support of Lambda | Liouville member at rho_4/2 (1.4e-30); step mode not re-run | ARGUED, relative to `screw-canonical`, `twist-rigidity` |
| 2 | FE + kernel positivity, no Euler product | DH: two roots from new starts; argument-principle count 1 on [0.7, 0.9] x [85, 86.5]; defects a(6) - a(2)a(3) = 1.0807, a(14) - a(2)a(7) = -1.0807 | MEASURED (zero step covered twice; membership relative to `pick/`, `c1-missing-controls` Part C) |
| 3 | Euler product + positivity + FE, no SIZE | a = 0.11, gamma_5: 5.0e-31; FE defect 4.5e-31; Lambda(n)(n^a + n^-a) >= 0 and > log n | PROVED (elementary) |
| 4 | backward-heat-stable hypotheses | not re-run | ARGUED, relative to `b-escape-law` |
| 5 | Euler product + positivity + pole, no FE, no integers | source not opened | ARGUED, relative to the Beurling literature |
| 6 | invariance under a local test-vector change | q = 7, c = 5 and q = 11, c = -3: 3.4e-30, 2.3e-30; FE defect 2e-31; multiplicativity defect 0 | PROVED for {multiplicative coefficients, FE, gamma factor, pole}; KER not checked |
| 7 | complete multiplicativity, no periodicity | greedy set at b = 0.8 to 1e7: count within 1 of target; log-singularity constant stable at 0.1110 (coefficient 1/2) | ARGUED, relative to the short-interval prime theorem (Huxley; Coleman 1990 not opened) |
| 8 | frequencies only | zeta(s)(1 - 2^(b-s)), b = 0.83: 2.8e-30; 1 - 9 * 2^-s on Re s = log 9/log 2: 7e-31 | PROVED in the corrected form (the class has no floor) |
| 9 | special values only | twin with prescribed s0 = 0.71 + 40.2i: 0; product zero at s = -12..-17 (80 digits) | PROVED (exact construction) |
| 10 | mean values only | not re-run | ARGUED, relative to H_W and `b-mvcap-function-side` |
| 11 | exact identities | one instance (argument principle for DH reads its zero) | ARGUED, relative to `eq48`, `dh-separator`, `b-euler-detector`, `c5-device-table-extension` |
| 12 | finite stages then a limit | Q21: Kronecker argument; twisted stage on {2, 3, 5} reaches 0.99995 of the torus maximum | ARGUED; Q21 sub-statement covered twice; limit step relative to `c1-leeyang-krein-limit` |

Counts under the statement's own rule (PROVED = two referee files cover the closing step): PROVED 4, MEASURED 1,
ARGUED 7 (before: 0, 3, 9). The four PROVED labels are elementary constructions of controls; they are not
statements about zeros of zeta. Both passes are internal.

### 2.2 Edits to `push/c9-obstruction-record-statement/STATEMENT_O.md` (script `apply_statement.py`, 28 edits; previous file `before/STATEMENT_O.md`)

- Section C: the joint clause ("a device that supplies R1, R3 and R4 together must read, in one step, at least the
  items below") is withdrawn. The table stays as a summary of separate conditional statements, with the reason
  (first referee E1: with the map's input codes {FE, SIZE} excludes the seven original controls without the Euler
  product; at conductor 1, FE with INT is Hamburger uniqueness).
- A1: input codes aligned with the source of the input-level sentence (first referee E2): SIZE = abs(Lambda_F(n))
  <= log n; FE in that sentence = zeta's own functional equation.
- Label and Owed fields of all 12 lines rewritten from REFEREE2. Line 8: floor "1.12 (DH)" withdrawn (E5). Line 12:
  mode (I) only (E6). Lines 5 and 7: "relative to" recorded in place of the debt "open the source".
- Section D: referee counts given with paths (E7); note that the rows called pending or proposed are now in the map.
- Not done: item 2c (control RZ_b) still has no line; it stands as a citation of map row T2. Lines 13 to 20 are not
  rewritten. First-referee E3 (citation count 55, not 56) is not applied to `verify_citations.py`.

### 2.3 Map (`push/OBSTRUCTION_MAP.md`; script `apply_map.py`, 19 edits with assertions; `map_edits.json`; previous file `before/OBSTRUCTION_MAP.md`)

515 -> 551 lines; rows 166 -> 180 (P 51, G 31, Q 27, S 12, Z 35, F 8, T 3, L 5, D 7, O 1).

| owed item | applied as |
|---|---|
| MAP_PENDING Part 2 (C1 to C4, D1 to D6, E1 to E3) | rows Q23, Q24, Q25, Z27, Z28, Z29; edits of rows Q12, Q22, Z15, Z24; section 6 item 1; section 7 |
| single-row bridge | row Q26 |
| Z15d, (E-K), with the window extension | row Z30 (the working label Z15d was used by two lanes; renumbered as in `MAP_ROWS_PROPOSED.md`) |
| Z15d, (E-H), wording of the round-9 referee | row Z31 ("not detected at r <= 5, q = 7", not "absent"; linearity does not imply norm type) |
| Z24b | row Z24b, with the six corrections of its referee |
| positive-term sum rule | row Q27 (five named forms; written here from the lane and its referee) |
| squarefull stratification, lead 17 | row Z32 (written here from the lane and its referee) |
| EIS-w, G31 (drafts held back until a referee holds) | section 2 note and row G31, on the corrected statement held by the second pass of `c9-repair-referee-debts-r8` |
| O1 | new section 3.10; worded as separate conditional statements |
| (added) | ten section-7 rows for claims of rounds 8 and 9 corrected by referees; header update line; row count |

`campaign/MAP_PENDING.md`: status section "fourth" appended (what was applied as what; what is still pending).
The engine's map parser reads 216 rows (202 before): all 14 new rows are parsed.

### 2.4 Outcome records, lane lines, devices, engine

Check of `engine/outcomes/c9-*.json` and the round-9 lines of `campaign/lanes.jsonl` against the eight referee
files: verdicts, scores (0), flags (all false), holds (true), referee counts (1), aboutZeros (false) agree in all
eight. Wording differences found and handled:
- `c9-eh-dual-r5-target-excess`: the outcome field `obstruction` said "so cancellation over non-principal rows is of
  norm type"; its referee (E2) does not hold that inference. Reworded. The lane line's `claim` (first wording:
  "ABSENT", "settled in the model") is kept as the claim made, with a `correction` field.
- `c9-tro6-interstratum-cancellation`: `lesson` said "bounded-level copies"; referee E1: the index can have norm up
  to Q. Reworded. The claim "ratio at least 0.73" is corrected in the `correction` field (0.72, from measured arrays).
- `correction` fields added to 7 of 8 records and lines (all except `c9-repair-referee-debts-r8`, where nothing
  disagreed). Previous files in `before/outcomes/`, `before/lanes.jsonl`.

`engine/curated/mk_devices.py` (states unchanged; previous file `before/mk_devices.py`): evidence text corrected
for `vector-specific-row-mean-square` (closed for two named absolute-value techniques, argued and measured; model
failure in active classes at N = 2, steps, no exponent; untested cases listed), `nonprincipal-row-cancellation`
("not detected at q = 7, r <= 5"), `positive-term-sum-rule` (five named forms, not every sum rule),
`single-row-bridge` (map row Q26).

Engine rerun, each through `scripts/memcap.sh 8` (`engine_rerun.log`, `engine_counts.json`; recorded in
`engine/ENGINE_LOG.md`, last section):

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 31 / 1 / 2 | 31 / 1 / 2 |
| outcome entries (closed) | 92 (63) | 92 (63) |
| closed families | 34 | 34 |
| map rows parsed | 202 | 216 |
| nodes (live) | 1,626 (960) | 1,640 (960) |
| edges | 8,814 | 8,855 |
| generated / scored | 39,138 / 9,333 | 40,671 / 10,311 |

### 2.5 Strategy (`campaign/STRATEGY.md`; previous file `before/STRATEGY.md`)

Section 3.1: items 15 to 21 added (round-9 closed families, each with the limits stated by its referee, and the
bridge junction of rounds 7 and 8); the lead-17 line updated. Section 4.0: state paragraph "ORDER-2 is closed as an
attack lead; bounded checks only", with the three bounded items. Section 2: the checkpoint sentence amended
(separate conditional statements, no joint clause). Change-log entry added. No allocation or weight change.

### 2.6 Server

`rhstatus` read once (rh.slice 11 GB in use; no unit of the lane active). Before removal: the lane's server
outputs are present locally (`acc_1e7.npz` same size, digest logs identical in every printed digit; both server
logs under `c9-tro6-interstratum-cancellation/logs/`; the four code files have equal SHA-256); the input table
`sf_1e7.npz` is at `tmp/sextic/data/`. The npz checksums of `acc_1e7.npz` differ (separate runs on two machines);
the digests of the arrays agree. Removed: `~/rh-push/c9-tro6-interstratum-cancellation` (477 MB) only. No unit was
started, nothing else was touched, no computation was run there.

### 2.7 Untracked files in the repository root

`b1_blocks.json` (1,175 bytes, 2026-11-18 00:11; a list of numeric triples) and `checks.json` (3,366 bytes,
2026-11-18 06:55; keys such as `N1_root_number_plus_one` with 40-digit comparisons). Both untracked, origin not
identified by this lane, left untouched.

## 3. Controls

No mechanism is claimed, so no control has to fail. The controls were run as functions for the record: Liouville
twist, DH, E_a, T-NR, finite modification, interpolation twin, THIN (b = 0.8), a random unimodular twist at stage
level (section 2.1). Not run by this pass: HEAT, Beurling, cluster lifts, the phase-rotated transfer operator,
theta^w.

## 4. Verdict

Partial result (record). Statement O now has a second referee file for every line, with 4 lines covered twice on
the closing step, 1 measured, and 7 labelled "relative to" a named source; the joint clause is withdrawn. The map
holds every row owed from rounds 7 to 9. Records and device evidence agree with the referee files. Nothing here
moves a requirement, a bound, or the headline.

## 5. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | no argument; a table of read classes and bookkeeping |
| R2 height-uniform, every window | false | no conclusion about zeros |
| R3 every control fails at a named step | false | no device; the record lists controls that satisfy read classes |
| R4 reaches the critical line | false | no step toward the line |

## 6. Three weakest steps

1. The "PROVED" labels of lines 3, 6, 8, 9 rest on two internal passes by single agents and on the reading of the
   closing step in REFEREE2 section 0 (membership plus one zero). Membership was checked input by input for the
   inputs named; line 6 excludes KER, and line 3 takes "explicit formula and growth" as inherited without a written
   check.
2. Rows Q27 and Z32 and the round-9 paragraphs of Z30, Z31 were written by this lane from the lane results and
   referee files, not proposed by their lanes; rows Z30, Z31 keep the word "closed" for states that their referees
   narrowed to "argued and measured" or "not detected". The device states (closed) were set by the planner and are
   kept; a reader who takes "closed" as "proved" would be wrong. The engine device `effective-order-two`
   (node `map-open-1`) is still open in `devices.json` while STRATEGY 4.0 now says the lead is closed as an attack
   lead; the planner left it open and this lane did not change it.
3. Lines 4, 10 and the step mode of line 1 were not re-run; lines 5 and 7 rest on sources nobody opened. The
   server cleanup relied on digest equality and file sizes, not on identical checksums of the 203 MB output.

## 7. Files

In this directory: `RESULT.md`, `REFEREE2.md`, `ref2_checks.py/.log/.json`, `ref2_l9_hp.py/.log`, `apply_map.py`,
`map_edits.json`, `apply_statement.py`, `engine_rerun.log`, `engine_counts.json`, `engine_before/`, `before/`
(previous versions of every edited file), `lanes_line.json`.
Edited elsewhere: `push/OBSTRUCTION_MAP.md`, `push/c9-obstruction-record-statement/STATEMENT_O.md`,
`campaign/MAP_PENDING.md`, `campaign/STRATEGY.md`, `campaign/lanes.jsonl` (field `correction` on seven lines),
`engine/curated/mk_devices.py`, `engine/outcomes/c9-*.json` (seven files), `engine/ENGINE_LOG.md`, and the
regenerated `engine/curated/devices.json`, `outcomes.json`, `nodes/nodes-15.json`, `closed_families.json`,
`IDEA_GRAPH.json`, `CANDIDATES.json`.
