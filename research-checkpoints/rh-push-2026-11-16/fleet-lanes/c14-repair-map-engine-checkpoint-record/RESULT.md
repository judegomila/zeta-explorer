# c14-repair-map-engine-checkpoint-record: map rows and device entries for round 13, eight relabels, corrected battery records in place, checkpoint draft, engine and scoreboard rerun

Round 14, repair lane. Date 2026-11-19. Nothing here is a statement about zeros of zeta, no bound moves, no attack is made.
Labels: RECORD (bookkeeping edit), MEASURED (numerics). All runs local through `scripts/memcap.sh 8` with
`.venv-arb/bin/python`; longest run under 10 s. **No job was run on the compute server and no rhrun unit was started.**
(One `ssh ... true` was appended by mistake to a read command of this lane; the permission layer refused the command before
it ran, so no connection was made. It was not retried.)

## 0. Verdict

**Partial result (record lane). All four decisive checks pass:**

| decisive check | outcome |
|---|---|
| python syntax check before each rerun | passed for `mk_devices.py`, `merge_outcomes.py`, `build_graph.py`, `generate.py`, `scoreboard.py`, and for this lane's scripts (`engine_rerun.log`) |
| parsed map row count rises by the rows added | 227 -> 234 in `build_graph.py`; 7 rows added (map 191 -> 198) |
| device types closed / floored / open | 39 / 1 / 0 -> **45 / 1 / 0** |
| headline unchanged unless a referee file says otherwise | 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4), unchanged; no referee file says otherwise |
| battery D1 against the corrected record now in `c12-control-battery-harness` (threshold 20 of 20) | **20 of 20** registered numbers; 24 of 24 minima of the four replayed windows within 1e-9 (19 of 20 against the original record, same script) |

"Partial" because: every new row rests on one independent referee pass (the second passes of `c14-referee-r13-independent`
had not reported); the D1 agreement is with a record written after the battery; the checkpoint file is a draft that takes
effect only on the round-14 outcome; nothing was proved.

## 1. Plan

Order of work, decisive test first in time: (3) corrected records into the battery lane and D1; (1) map rows, control BLS
and device entries; (2) the eight relabels in the map rows; (5) engine and scoreboard reruns with before / after counts;
(4) the checkpoint draft, written last so that it cites the final row and device counts. A copy of every file changed
outside this directory was taken first (`before/`). Read before starting: BRIEF.md to the end; STRATEGY v3 sections 2, 3.1
(headings), 4.0; OBSTRUCTION_RECORD_OUTLINE.md; ROUND_LOG round-13 allocation, results, lessons, "Owed", and the round-14
allocation; RESULT.md of `c13-repair-map-engine-battery-records` (procedure, scripts); for each round-13 lane 1 to 6 its
verdict, proposed row or `MAP_ROW.md`, proposal JSON files and the independent referee pass in its REFEREE.md; RESULT.md
section 4 and `referee_updates.json` of `c13-referee-r12-independent`; Statement O version 3 (header, sections A, C, D, E);
map section 2, section 6, rows D8, G33, P53, P54, Z35 and section 7.

Finding on the inputs: only lanes 1 and 3 have a `MAP_ROW.md` and only lanes 1 and 2 an `engine_device_proposal.json`;
for the others the row text was taken from the lane's "row for the map" paragraph (lanes 2, 5, 6) or worded from the
verdict and the referee's surviving claim (lane 4). All six REFEREE.md files now contain an independent pass (the round
log's "Owed" paragraph predates them); every row is worded after that pass.

## 2. Work

### 2.1 Map rows for round-13 lanes 1 to 6 (`push/OBSTRUCTION_MAP.md`, 191 -> 198 rows; script `apply_map.py`)

| lane | row | content and label |
|---|---|---|
| 1 `c13-kacmoody-eisenstein-affine-weyl-shift` | D9 (section 3.9) | **rank-one Levi inequality: PROVED closed** (Theorems B, C; closed under Blaschke factors over non-real conjugate pairs); **two-variable affine kernel: ARGUED**; coefficient census relative to a recalled normalisation; referee corrections 1 to 5 (coefficients not holomorphic in the chamber; DH "no failure found", low-power grid; the T-NR statement holds for the factor D(z)/D(z+1)) |
| 2 `c13-fourier-interpolation-zero-nodes` | G34 (section 3.2) | target enters by division; Lemma M as an identity of kernels; "implies RH, converse argued"; T-NR passes (height selection argued); C1 to C9 |
| 3 `c13-lrs-twist-amplification-zero-representation` | G35 | pole minus gamma pole equals 1 for Borel data at regular parameters, from the Hecke eigenvalues alone; inequality reads beta <= 7/4; LRS exponent count ARGUED; defects 1 to 3 |
| 4 `c13-tnr-invariance-prefilter-noncone-census` | P55 (section 3.1), L6 (section 3.8) | Lemma P with exclusions X1 to X5; census of twelve non-cone types; counts as corrected by the referee (13 device types, 8 passes, 7 failures, 0 disagreements); Edrei-Thoma closed as a device |
| 5 `c13-bilinear-reciprocity-height-antibridge` | Z36 (section 3.5, next to Z34) | sign of the pair entry = parity of the total zero count (referee addition); corrected decay rate and index count (E1 to E4) |
| 6 `c13-noncone-kernel-separator-search` | G36 | **dictionary D closed as MEASURED, finite search** (registered grid and draws only); the seven referee findings on the reading (the one-signed condition is fitted and does not hold out; 73% of the one-signed functionals are adaptive; server-only counts read, not recomputed) |

Also added: one sentence in the introduction of section 3.9 (D8 and D9 are not rows of the round-5 device table); three notes in section 2 (control BLS; NR on a scattering carrier; pre-filter Lemma P with the three-question
pre-filter Q-P, Q-B, Q-S); eight rows in section 7 (six for the round-13 corrections, two for the relabels); the update
line "tenth"; the row-count line (P 55, G 36, Q 29, S 12, Z 39, F 8, T 3, L 6, D 9, O 1 = 198). BLS is a note, not a row
of the control table: it is defined on scattering coefficients, not on Dirichlet series.

### 2.2 The eight relabels of `c13-referee-r12-independent` (RESULT.md section 4), applied to map rows only

The round-12 lanes' RESULT.md files were not edited. None of the eight is used by a closure (the referee's sentence).

| # | lane | statement | action of the second referee | where applied in the map |
|---|---|---|---|---|
| 1 | c12-bost-connes-crossed-product-duality | Lemma C after its first sentence; consequences 2(a), 2(d); flag R1 reason | restrict to the Galois-invariant KMS state | row D8, status cell (the "where it stops" cell already carried the restriction from referee E1); section 7 |
| 2 | same | Lemma P, last sentence | PROVED / CLASSICAL -> ARGUED | row D8, status cell |
| 3 | same | Lemma L, last sentence (divergence of the product of gamma_p on 0 < beta < 1) | false at beta = 1/2 (gamma_p = 1); holds for beta != 1/2 | row D8, status cell; section 7 |
| 4 | same | "T-NR is a bounded inner perturbation of the dynamics" | per beta only; "value of the KMS family on a fixed D >= 1 in C*(Q/Z)" | row D8, item (v); section 7 |
| 5 | c12-depth-aspect-height-transfer | section 3.5 first bullet (bound N/abs(t) + O(1)) | CLASSICAL -> ARGUED; error term misstated; not load-bearing | row Z35 |
| 6 | same | "an exchange exists only for N of about log q" | proved for N >= q^delta with abs(t) bounded below; measured between | row Z35; section 7 |
| 7 | c12-x04-oval-hecke-fricke-loading | Lemma 2(c), "is a T-NR twin" | add "(c < -2, extra zeros outside the strip)"; Lemma 1(a) not re-derived | row G33, where-it-stops and status cells |
| 8 | c12-univ-pointwise-control-wcone | Corollary U4; class-N wording | PROVED-rel -> ARGUED until "connected complement" is read in the primary source; class N as narrowed | row P54, status cell; UNIV note of section 2 (class-N wording was already narrow there) |

Entered with them, not among the eight: the one upgrade of the same referee (row G33: "Cx_p theta > 0" MEASURED at 9
points -> PROVED by a two-line argument); "second independent referee: holds" in the status cells of D8, Z35, G33, P54;
row P53: "second referee for Lemmas S and T owed" replaced by its outcome (hold, given Conrey-Li Theorem 2; three
readings of "tied"). Not applied anywhere: the round log's one-line summaries (ROUND_LOG.md is outside the write set).

### 2.3 Corrected battery records in `c12-control-battery-harness`, D1 rerun (decisive check)

- `records/screen.json` and `tables/zeros_HEAT--0.5.json` replaced by the corrected files of
  `c13-repair-map-engine-battery-records/records_corrected/` (sha256 equal to the sources); originals kept beside them as
  `screen.original.json` and `zeros_HEAT--0.5.original.json` (sha256 equal to the copies in `before/c12/`); note
  `records/CORRECTED_RECORDS.md`. Nothing else in that lane was changed.
- D1 with `d1_corrected.py` (the c13 script: the 20 registered checks, order and tolerances of
  `devices/d1_debranges.py`, recorded numbers read from the record file), battery inputs unchanged, 200 bits, 2 s:
  record in place **20 of 20**, extension 24 of 24; `screen.original.json` 19 of 20 (the known number: DH near 1000,
  min q_1 = -0.33053338578645175 against -0.3348103021277858), extension 17 of 24. The 20 computed values are identical
  to those of the c13 run. Outputs `device_D1.c12_corrected_record.json`, `device_D1.c12_original_record.json`; logs `logs/`.
- The HEAT table in place: 929 on-line zeros, 294 pairs listed, 929 + 2 x 294 = 1517, `count_diagnostic` 0 (read from
  the file; not recomputed here).
- Not done: `devices/d1_debranges.py` has the old numbers typed in and still reports 19 of 20; `tables/device_D1.json`,
  `device_D4.json` (D4 read the 277-pair table; not rerun), `MANIFEST.json` (it does not list either replaced file) and
  the server copy of the battery are unchanged.

### 2.4 Engine (`patch_engine.py`)

- `curated/controls.json`: control `BLS` from `controls_BLS_proposed.json`, status `proved in rank one`, field `scope`,
  limits from the referee passes in `lacks`; source of `UNIV` extended (U4 argued). 3 -> 4 curated controls.
- `curated/mk_devices.py`: six device types, state closed, no node, written with `repr()`:
  `kacmoody-loop-eisenstein-maass-selberg` (rank-one proved, affine kernel argued), `fourier-interpolation-zero-nodes`,
  `lrs-amplification-eisenstein-at-zero`, `edrei-thoma-local-total-positivity` (with Lemma P and the census),
  `bilinear-reciprocity-height-jform`, `dictionary-d-kernel-sign-functionals` (MEASURED, finite search). Each evidence
  text cites the independent referee pass, the map row and the open cells. `PENDING` not changed (RS-1 to RS-3 stay
  until the learn step decides the checkpoint).
- Reruns, each after `py_compile`, through `scripts/memcap.sh 8`: `curated/mk_devices.py`, `merge_outcomes.py`,
  `build_graph.py`, `generate.py --top 60`, then `campaign/scoreboard.py`.

| quantity | before | after |
|---|---|---|
| device types closed / floored / open | 39 / 1 / 0 | 45 / 1 / 0 |
| pending proposals | 9 | 9 |
| outcome entries | 124 | 124 (84 closed) |
| closed families | 34 | 34 |
| map rows parsed | 227 | 234 |
| controls | 18 | 19 |
| nodes (live) | 1,677 (963) | 1,685 (963) |
| edges | 8,937 | 9,002 |
| control-defeats edges | 783 | 848 |
| generated / scored / rejected | 36,558 / 8,437 / 28,121 | unchanged |
| top 60 | | all 60 unchanged, same scores |
| scoreboard headline | 1 of 4 | 1 of 4 |

Three things the table does not show:
1. `merge_outcomes.py` had not been run since the learn steps began writing `outcomes.json` directly. Its rerun rewrote
   24 entries (rounds 11 to 13): fields `batch`, `defeatedBy`, `notSeparated`, `controlsText` filled, `note` regenerated
   without the prefix "round N, score 0, referee holds:"; no field lost, no verdict changed; `closed_families.json` and
   `nodes-15.json` identical. Most of the 65 new control-defeats edges come from these filled lists, which are keyword
   readings and include controls recorded as passing. Previous file: `before/outcomes.json`.
2. `ctl-BLS` has no edge: `build_graph.py` reads row cells with a fixed code list that contains neither BLS nor UNIV;
   that file is outside this lane's write set.
3. A second run was made after one sentence of row G34 was reworded by this lane's own check (section 5): identical
   counts and top 60 (`engine_rerun.second.log`). A third run followed one sentence added to the introduction of map
   section 3.9 (rows D8, D9 come from later lanes): identical again (`engine_rerun.third.log`). Between the scoreboard
   runs two other round-14 lanes appended lines to `campaign/lanes.jsonl` (lanes 114 -> 116, score-0 lanes 112 -> 114,
   lemmas decided 75 -> 78 at the second run); the headline is the same in all three runs.

Full entry: `engine/ENGINE_LOG.md`, "Round 14 repair slot". Status: `campaign/MAP_PENDING.md`, last section.

### 2.5 Checkpoint draft (`campaign/CHECKPOINT_R14_DRAFT.md`)

From Statement O version 3 (`push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md`, which replaces the c9 file)
and the closed device list (45 closed, 1 floored). Content:
- section 1: what the record closed of RS-1, RS-2, RS-3 in rounds 11 to 13 (devices, how each closed, cells left open),
  and the reading that the record closes devices, not the three read sets (no line of O has one of them as read class);
- section 2: eight read classes on which the record is silent, each a separate conditional statement with the reason
  taken from a named line, row or scope list: U1 {FE, GEOM} in one non-identity inequality; U2 {FE, SIZE} with POS at
  the log level; U3 identification classes (no control exists by construction, so R3 needs a different test); U4 joint
  functionals of two or more objects; U5 FE through a number of conditions growing with height; U6 attached objects
  outside the closed carriers (seven cells); U7 sections with P(t) growing like a power of t; U8 single-object kernel
  conditions beyond the searched range;
- section 3: the open items inside the 7/8 mechanism, reported with the part-B figure and not as read sets for R4;
- section 4: limits of the record that the statements inherit; **no joint clause** (stated twice, with the reason from
  O section C);
- section 5: proposed wording for the planner if the checkpoint triggers. STRATEGY.md was not edited.

U1 and U2 are the two minimal input sets of O's input-level paragraph that no control added since has entered
({INT, GEOM}, the third, is now inside the class of THIN and U); this was checked control by control in the draft.

## 3. Controls

No attack is made, so the lane has no control table of its own. Control content of the record work:
- BLS enters the map and the engine with its limits (single real factor not covered; sign not free; argued on the affine
  kernel); T-NR with c > 2 and b < 1/2 is recorded as a case of it.
- Lemma P is recorded as a pre-filter with the corrected consistency counts; it is a statement about T-NR only.
- DH: in row D9 "no failure found on the grid" (not "passes"); in row G36 the count "0 of 629,432" carries the referee's
  reading that it is not a sensitivity to the Euler product.
- The checkpoint draft checks {FE, GEOM} and {FE, SIZE} against every control on file (DH, E_a, EIS-w, T-NR, DEL, THIN,
  U, sign twists, WT, HEAT, interpolation twin, RZ_b, BLS, UNIV): each lacks one input. This is a reading of the
  control definitions in map section 2, not a new result.

## 4. Requirement flags

- R1 false. No inequality and no use of multiplicativity; record lane. Evidence: sections 2.1 to 2.5 contain edits only.
- R2 false. No conclusion about zeta at any height.
- R3 false. No argument to be failed by a control.
- R4 false; not addressed (repair lane). No requirement score is expected by the assignment.

## 5. Three weakest steps

1. **The checkpoint classes are this lane's reading of the record, not a derivation.** U1 and U2 follow the input-level
   paragraph of O, whose source (`stack-combinator`) is unrefereed and whose definitions of SIZE and GEOM are informal for
   controls that are not Dirichlet series (HEAT, BLS). The list U1 to U8 was assembled from "not covered" sentences and
   is not shown to be complete: a read set may lie in none of them and still not be addressed. No referee has read the
   draft, and the round-14 outcomes (two lanes on U4, two on U6) can change it; one of them reported while it was written.
2. **Rows and device entries were worded from lane texts and one independent referee pass each, without re-deriving the
   mathematics.** Lane 4 proposed no row text, so P55 and L6 are this lane's summaries. Dictionary D is a measured finite
   search whose larger stages exist only on the server; the label says so, but the engine state "closed" is the same
   string as for a proved closure, and the generator cannot see the difference (no node).
3. **The D1 pass is against a record written after the battery, and the in-place replacement leaves the battery lane
   internally mixed.** `d1_debranges.py`, `device_D1.json`, `device_D4.json` and the server copy still describe the
   state before the correction; D2 to D5 were not rerun; the HEAT completion is measured, not certified. The engine
   rerun also changed 24 outcome entries through `merge_outcomes.py` (regenerated notes, keyword-filled `defeatedBy`),
   an effect of running the script the assignment names, not of an edit this lane chose.

Own errors made and corrected in this lane: (i) row G34 first read "exponent kappa for all s implies no zero with
Re rho > 2 kappa outside a countable set of s"; the source statement is for s outside a countable set; reworded, map
rebuilt from the copy, engine rerun (identical counts). (ii) `ref_checks.py` first compared the whole part A of the
scoreboard and reported the headline as changed when another lane's line raised the score-0 count; the check now
compares the headline record. (iii) the unintended `ssh` invocation noted at the top (refused; nothing ran).

## 6. Files

In `tmp/research-2026-11-16/push/c14-repair-map-engine-checkpoint-record/`:
`RESULT.md`, `REFEREE.md`, `lanes.jsonl`; `apply_map.py`, `patch_engine.py`, `engine_counts.py`, `d1_corrected.py`,
`ref_checks.py`; `engine_counts_before.json`, `engine_counts_after.json`, `engine_counts_after.first.json`,
`engine_rerun.log`, `engine_rerun.second.log`, `engine_rerun.third.log`, `scoreboard_rerun.log`, `ref_checks.json`, `ref_checks.log`;
`device_D1.c12_corrected_record.json`, `device_D1.c12_original_record.json`; `logs/`; `before/` (map, mk_devices,
devices, controls, ENGINE_LOG, CANDIDATES, IDEA_GRAPH gzipped, outcomes, closed_families, nodes-15, underused,
MAP_PENDING, SCOREBOARD, scoreboard.json, and `c12/` with the two record files and `device_D1.json` as found).

Edited outside this directory:
- `tmp/research-2026-11-16/push/OBSTRUCTION_MAP.md`
- `tmp/research-2026-11-16/push/c12-control-battery-harness/records/screen.json`, `records/screen.original.json` (new), `records/CORRECTED_RECORDS.md` (new), `tables/zeros_HEAT--0.5.json`, `tables/zeros_HEAT--0.5.original.json` (new)
- `tmp/research-2026-11-16/engine/curated/controls.json`, `curated/mk_devices.py`, `curated/devices.json` (generated), `outcomes.json`, `IDEA_GRAPH.json`, `CANDIDATES.json` (generated), `ENGINE_LOG.md`, `scratch/*.pre-c14-repair.*` (copies)
- `tmp/research-2026-11-16/campaign/CHECKPOINT_R14_DRAFT.md` (new), `MAP_PENDING.md`, `SCOREBOARD.md`, `scoreboard.json` (generated)

Not edited: `campaign/STRATEGY.md`, `campaign/ROUND_LOG.md`, `campaign/lanes.jsonl`, `engine/outcomes/`, `engine/build_graph.py`, any lane's RESULT.md or REFEREE.md.
