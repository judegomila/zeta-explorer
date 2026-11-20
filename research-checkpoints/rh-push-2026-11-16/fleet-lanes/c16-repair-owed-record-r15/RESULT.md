# c16-repair-owed-record-r15: RESULT

Lane of campaign round 16, kind repair (repair lane B: the owed list of round 15). Date 2026-11-19.
No attack. Nothing in this lane is a statement about zeros of zeta. It cannot raise the headline and does not.
All runs local, through `scripts/memcap.sh 8`, each under two minutes. The compute server was not contacted (the
lane has no numerical question).

## Verdict

**partial-result (record lane). Items 1 to 7 of the assignment are entered; the first check passes; the control
holds in the form "unchanged except where a named edit explains the change". One required deliverable is missing:
REFEREE.md is the author's mechanical second pass, not an independent referee (this agent could not start another
agent). The lane line is recorded with referees = 0.**

- Headline 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4) and referee hold rate 90.8%: unchanged.
- Top 60 of the generator: identical in keys, order and scores after the map rows, controls, closed device types
  and label restrictions (stage 1). After the eleven silent-cell nodes (stage 2, item 5 of the assignment) 2 of
  the 60 keys remain and 57 candidates stand on a silent-cell node. This is the effect of one named edit and is
  described in section 3.2; it is not evidence for any cell.
- `engine/outcomes/`, `outcomes.json`, `closed_families.json`: byte-identical (142 sha256 values).
  `merge_outcomes.py` was not run.

## 1. Plan

Nothing mathematical is new against the atlas and the walls. The lane enters round-15 results into the three
state files, each worded after the independent referee file of its lane.

Order of work. (0) Baseline rerun before any edit: `build_graph.py`, `generate.py --top 60`, `scoreboard.py`,
with sha256 of `outcomes/`, `outcomes.json`, `closed_families.json` (`baseline/`). (1) First check, before any
edit: a source table (`sources.py`, 65 entries) giving for every row or note to be edited the lane file and the
sentence relied on, quoted; `check_sources.py` verifies that each file exists and contains the quote verbatim.
Result: 65 entries, 15 files, 0 failed. (2) Edits by scripts with exact-string anchors, each anchor required to
occur once, each script rebuilding its target from the copy in `before/`. (3) Reruns in three stages so that
each change of a count has one cause: stage 1 = map + controls + closed device types; stage 2 = silent-cell
nodes; stage 3 = screening lines in `lanes.jsonl`; a last run after the lane's own line. (4) Second-pass checks
(`ref_checks.py`, 42 checks, 0 failed).

Sources read: BRIEF to the end; `campaign/ROUND_LOG.md` round-15 results, lessons, Owed paragraph and round-16
allocation; map header, section 2, rows S12, Q25, Q29, G36 to G40, O1, section 7; RESULT and REFEREE of the six
round-15 lanes named below; `LABEL_RESTRICTIONS.md`, `CHECKPOINT_R15_REFEREED.md` and the second referee file on
the pre-filter lane in `c15-referee-r14-independent-checkpoint`; RESULT and REFEREE of
`c15-repair-record-strategy-v4-report`; `PROPOSED_E1_REPLACEMENT.md`; STRATEGY version 5 sections 0b, 4.0, 5;
Statement O version 3 sections A, B (line 6), C; `build_graph.py`, `generate.py`, `scoreboard.py`,
`curated/mk_devices.py` as text.

## 2. Work

### 2.1 Item 1: map rows and control rows (`push/OBSTRUCTION_MAP.md`, script `apply_map.py`, 27 edits)

| entry | lane | corrections of the independent referee entered |
|---|---|---|
| **S12b** (section 3.4) | `c15-u5-window-count-threshold-translate-control` | E1: the largest window count is max(eta T log(T/2 pi)/pi, sqrt(8 eta T)), the second term from the reflection translate; "sharp" only for abs(alpha) <= T/2. E2, E3: the finite combination passes an absolute test only; the minus sign has a(1) = 0. E4: closed for identification-type conclusions; for zero-location conclusions MEASURED in a finite model |
| **Q30** (section 3.3) | `c15-u7-growing-section-twin-ladder-bridge` | The lane's label Q25 was taken (family bridge, round 7); the row is Q30. E1: T-NR as the control has abs(c) > 2 and fails through its zeros. E2: random unimodular twists violate (4 of 4). E3: the bound 1e-21 is per zero. E4: the constant of Proposition 5 is not copied. E5: CLASSICAL in content |
| **G41** (section 3.2) | `c15-nonhomogeneous-pair-triple-kernel-search` (DN) and `c14-joint-zeta-twist-noncone-search` (DJ) | DN: count 360 + 392 and 360 + 2,414 (referee item 1); blindness of backward heat is for one lift (item 2); **canonical tier {T-NR, E_a, HEAT} marked NOT CLOSED**, 67,138 float64-undecided nodes, with the pointer to `c16-dn-canonical-tier-ball-conversion` (item 3). DJ had no row; label restrictions 1 to 7 are entered here |
| control rows **ZQ, SG, NR-q** (section 2 table) and one note | `c15-control-with-zeta-fe-classes-u1-u2` | E1: Lemma L with its pole clause, and the referee's control G_+; E2: the headline on U1 and U2 is conditional on reading GEOM, SIZE on atoms; E3: Selberg's theorem as the classical input; E4: scope of Lemma D |

Also edited: header paragraph "twelfth"; row-count line (P 55, G 41, Q 30, S 13, Z 39, F 8, T 3, L 6, D 9,
O 1 = 205; 13 controls in the section 2 table); pointers to S12b in question Q2 and in row S12 (with the
round-15 correction of the Riemann-Siegel count sentence), to G41 in row G38, to version 4 in row O1; seven rows
in section 7 (six new, one updated). Two choices of this lane, stated: DJ and DN share one row (the referee file
lists DJ under "row G38, part"; G38 does not describe DJ); the label Q30.

Not entered (not in the assignment, no row owed): rows for `c15-edge-argument-strip-width-hecke-amplified` (its
proposed label G37 is taken) and `c15-klein-transport-lemma-w-stage-a-and-e1`.

### 2.2 Item 2: the 30 label restrictions (`c15-referee-r14-independent-checkpoint/LABEL_RESTRICTIONS.md`)

Each restriction is quoted in `sources.py` and entered with its item number. Lane RESULT files of round 14 were
not edited for items 1 to 27 (same rule as the two earlier repair lanes); the same sentences are in the device
evidence of `curated/mk_devices.py` in short form.

| items | place | form |
|---|---|---|
| 1 to 7 | row G41 (DJ part); device `dictionary-dj-joint-pair-sign-functionals`; section 7 | seven numbered sentences |
| 8 to 12 | row G38; device `joint-pair-ratio-crossgram-twist-transfer`; section 7 | sentence "Second independent referee pass ... items 8 to 12" |
| 13 to 17 | row G39; device `lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal` | same form; 13 was already in the row |
| 18 to 22 | row G37; device `laxphillips-hecke-norm-outside-l2` | same form; 18 was already in the row |
| 23 to 27 | row G40; device `catalogued-x2-inequality-torus-parameter-eigenobject` | same form |
| 28, 29 | section 2 note Lemma F; section 7; dated note in the c14 RESULT (2.4) | E1 replaced by Theorem E1'; growth hypothesis for a >= 1/2; "none sits between" removed; Q-B for inner functions with real symmetry; T-NR quotient bound PROVED; sweep counts READ |
| 30 | `campaign/ROUND_LOG.md` round 14, result line 8 and lesson 6 (a dated note appended to each line); map note on ZQ; section 7; report 2.4 | "... together with an ordinary Dirichlet series (INT)" |

Check (`ref_checks.py`): all 30 item numbers and a key phrase of each restriction are found at the stated place.

### 2.3 Item 3: corrections E1 to E4 (`c15-repair-record-strategy-v4-report/REFEREE.md`)

- `campaign/CAMPAIGN_REPORT_R15.md`: E1 (section 2.4, the sentence on zeta's own functional equation), E2
  (sections 1 and 4: author passes of three repair lanes counted as referee passes; 107 of 119, 89.9%), E3
  (section 3: 0.8748866471). Each corrected sentence carries a dated marker; a section "Corrections" at the end
  quotes the sentences as filed. The report was not regenerated.
- `campaign/STRATEGY.md`: E3 and E4 were already applied by version 5 (checked: header limits of 2026-11-19;
  0.8748866471 in sections 0a and 0b). Added: a note at the one remaining version-4 figure in the change log; a
  note on the superseded caveat in section 4.0c; row labels Q30 and S12b in section 4.0; a change-log entry.
  Version unchanged, no rule or allocation changed.

### 2.4 Item 4: pole clause of Lemma L; sentence E1 of the c14 pre-filter lane (script `patch_text.py`)

- `push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md`: the clause "with no pole other than s = 1" restored
  in the three places named by the referee (table row F2; section 3 consequence (a); section 6, U2 POS branch),
  each in square brackets with the date and the lane, plus one correction note under the header. Check: the
  file minus the marked insertions equals the filed text (`before/c15-control/RESULT.md`).
- `push/c14-prefilter-sweep-geometric-nodes/RESULT.md`: a dated correction note of 15 lines after verdict item 5
  with the replacement text of `PROPOSED_E1_REPLACEMENT.md`, its hypotheses, and the growth hypothesis of the
  second referee. The filed sentences are left in place; 0 lines removed.

### 2.5 Item 5: `engine/curated` (script `patch_engine.py`, stages 1 and 2)

- `controls.json`: ZQ, SG, NR-q (5 -> 8 curated; 20 -> 23 controls in the graph).
- `mk_devices.py` / `devices.json`: three closed device types for rows S12b, Q30, G41 (the third with the
  canonical tier stated as not closed); evidence of the five round-14 types carries the restrictions; eleven open
  device types `silent-cell-*`, one per cell U3, U2-POS, U4, U6 (a) to (g), U8, each on one node. Pending 8 -> 7:
  the three read-class entries and the two c6 entries that are cells U6 (c), (d) became device nodes; added:
  amplifiers with T < N (`c16-amplifier-below-truncation-eisw-compute`), Proposition 5
  (`c16-ctheta-proposition5-power-sum`), the canonical tier of DN (`c16-dn-canonical-tier-ball-conversion`),
  cell U5 beyond a span (no lane).
- `engine/nodes/nodes-21.json` (new): eleven nodes of type open-direction, status conjectural, each beginning
  "Silent cell of the refereed checkpoint ... Not a lead". Texts from `CHECKPOINT_R15_REFEREED.md` and STRATEGY
  4.0 version 5. A first wording cited neighbouring rows as "map row X" and the builder attached those rows and
  their controls to the cells (4 obstructs and 8 control-defeats edges); the wording was changed and no such
  edge touches a silent-cell node now.
- `engine/curated/CHANGELOG_c16-repair.md`: the account for the planner.

Deviations from the stated edit scope ("engine/curated"), each stated: (a) `engine/nodes/nodes-21.json` is
outside `curated/`; the builder reads nodes only from `nodes/`. (b) `build_graph.py` was edited in a first run
(codes NR-q, ZQ, SG in `CONTROL_CODE_RE`) and then restored byte-identical: the graph is the same with and
without the line because no defeated-by cell names these codes (`diff_baseline_after1.with-regex.json` equals
`diff_baseline_after1.json` field by field). The line is owed. (c) `ENGINE_LOG.md` and `ROADMAP.md` were not
edited; the entry is the change log in `curated/`.

### 2.6 Item 6: screening lanes (`add_screening_lines.py`)

Ten lines appended to `campaign/lanes.jsonl`, one per directory `push/s1-*` other than `s1-allocator` (the
allocator; no lane): kind "screen", round 15 (the date of the runs), referees = 0, no `refereeHolds` field, score
0, tags ["screen"] only (so no tag-pair family is touched). Nine have a RESULT.md and verdict "dead" (the lane's
own count: 4 combinations, 0 survivors each). `s1-klein-annulus-energy` has no RESULT.md; its line has verdict
"not-reported" and claims nothing. The claims are quoted from the heads of the lanes' RESULT files and are not
checked.

### 2.7 Item 7: Statement O version 4 (`STATEMENT_O_v4.md` in this directory; script `build_statement_o.py`)

Version 3 (`push/c12-repair-sources-statement-o-v3/STATEMENT_O_v3.md`) is not edited; version 4 is that text
with insertions only (240 lines added; the title line replaced). Added:

- Lines 13 to 17, one conditional statement per read class: 13 (FE of zeta with atom-level multiplicative
  structure, without INT: control ZQ), 14 (FE, exact atoms, upper bound for Lambda: SG), 15 (FE, integer
  coefficients, Hecke relations at rational primes: NR-q), 16 (FE, exact atoms, Lambda_F >= Lambda >= 0 without
  the pole clause: G_+), 17 (window tests inside one span with an identification-type conclusion: the span
  translate). Each rests on one independent referee file and is counted ARGUED under the label rule of the
  statement (two files). Line 16 rests on one derivation in a referee file.
- A typing condition for lines 13 to 16 (the controls extend class K of A1; referee E2).
- A version-4 paragraph in section C on the input-level sentence and five table entries 7a to 7e.
- Section F: one conditional statement per class on which no line applies (U3 with four identification classes,
  U2-POS, U4, U5 beyond a span, U6 (a) to (g), U8), from the refereed checkpoint. No joint clause.
- Count: PROVED 4, PROVED relative to a cited theorem 1, MEASURED 1, ARGUED 11.

Map row O1 points to the file.

## 3. Before and after

### 3.1 Quantities

"On file" and "baseline rerun" agree in every quantity (candidates byte-identical; scoreboard identical except
the timestamp). Columns: baseline; stage 1 (map, controls, closed device types, restrictions); stage 2
(silent-cell nodes, pending); stage 3 (ten screening lines); final (the lane's own line).

| quantity | baseline | stage 1 | stage 2 | stage 3 | final | cause |
|---|---|---|---|---|---|---|
| map labelled rows | 202 | 205 | 205 | 205 | 205 | S12b, Q30, G41 |
| map rows parsed by the engine | 238 | 241 | 241 | 241 | 241 | same |
| controls in the section 2 table | 10 | 13 | 13 | 13 | 13 | ZQ, SG, NR-q |
| curated controls / controls in the graph | 5 / 20 | 8 / 23 | 8 / 23 | 8 / 23 | 8 / 23 | same |
| device types closed / floored / open | 50 / 1 / 0 | 53 / 1 / 0 | 53 / 1 / 11 | same | same | three round-15 types; eleven silent cells |
| device nodes | 75 | 75 | 86 | 86 | 86 | eleven nodes |
| pending proposals | 8 | 8 | 7 | 7 | 7 | 2.5 |
| graph nodes (live) | 1,701 (963) | 1,707 (963) | 1,718 (974) | same | same | 3 rows + 3 controls; 11 nodes |
| nodes of type control / obstruction / open-direction | 55 / 672 / 28 | 58 / 675 / 28 | 58 / 675 / 39 | same | same | same |
| edges | 9,025 | 9,031 | 9,118 | same | same | below |
| control-defeats | 866 | 871 | 871 | same | same | `ctl-DH`, `ctl-NR` -> `row-Q30`; `ctl-HEAT`, `ctl-NR` -> `row-G41`; `ctl-WT` -> `row-S12b` |
| restates | 185 | 186 | 188 | same | same | `row-Q30` -> `target-rh` ("target" in its defeated-by cell); two similarity edges between old nodes crossed the builder's threshold when the corpus grew |
| composes-with | 7,474 | 7,474 | 7,559 | same | same | 161 added (147 to a silent-cell node, 14 between old nodes), 76 removed, none at a silent-cell node (ten partners kept per node) |
| obstructs / special-case-of / uses / separates-from | 270 / 132 / 94 / 4 | same | same | same | same | - |
| outcome entries; sha256 of 142 files | 140 | same | same | same | same | not touched |
| generated / scored | 36,558 / 8,437 | same | 52,367 / 19,088 | same | same | crossing pool 6 -> 17, lemma pool 150 -> 161 |
| top 60: keys in common with baseline | 60 | 60, same order and scores | 2 | 2 | 2 | 3.2 |
| top 60 with an open device / floored only | 0 / 60 | 0 / 60 | 57 / 3 | same | same | 3.2 |
| scoreboard A: headline | 1 of 4 | same | same | same | same | - |
| scoreboard A: lanes at score 0 | 128 | 128 | 128 | 138 | 139 | ten screening lines; this lane |
| scoreboard D: lanes run / refereed | 130 / 130 | same | same | 140 / 130 | 141 / 130 | same |
| scoreboard D: hold rate, PROVED broken, 3-referee | 90.8%, 11, 1 | same | same | same | same | - |
| scoreboard C: nodes / marked closed | 1,701 / 576 | 1,707 / 579 | 1,718 / 579 | same | same | three rows; nodes |
| scoreboard C: tags, families, closed, tried, untried | 462; 106,491; 3,618; 610; 102,263 | same | same | same | same | - |
| scoreboard history | 15 rows; round 15: 8 lanes, 130 cumulative | same | same | round 15: 18 lanes, 140 cumulative | row for round 16: 1 lane, 141 | the screening lines carry round 15 |
| scoreboard B (frontier) | all figures | same | same | same | same | - |

Stage 1 also changed the `rowsChecked` list of 10 of the 60 candidates (Q30 enters 6, G41 enters 1; other rows
move because the adjacent-row list is a fixed-length ranking). Keys, order and scores are identical.

### 3.2 The top 60 after the silent-cell nodes (the one large change)

Cause, established by the staging: between stage 1 and stage 2 the only edits are `nodes-21.json`, the eleven
open device types and the pending list.

- Rank 1 before: `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural` (10.25). Rank 1
  after: the same two partners with `silent-u8-kernel-conditions-beyond-searched-range` (12.03). The former rank 1
  keeps its score and is the best candidate without a silent-cell node, but is not listed: its two partners have
  used the per-node cap of 2.
- 57 of 60 stand on a silent-cell node (U6 (a) 12, U8 12, U6 (g) 10, U6 (f) 9, U6 (e) 5, U3 3, U4 3, U6 (d) 2,
  U2-POS 1, U6 (c) 1, U6 (b) 0); 3 stand on the floored 7/8 device.
- Of the former 60: 42 are in the new scored set with the same score, 5 with a score moved by 0.01 (cause not
  traced), 13 are no longer enumerated. Mechanism read in `generate.py`: each anchor takes a fixed number of
  partners from the crossing-device pool, the pool grew from 6 to 17 nodes, and the old device nodes
  (`tro6-natural`, `qrh-seven-eighths`, `map-open-*`) left some partner lists (for 2 of the 13 a composes-with
  edge between members was also removed). File: `after/top60_attribution.json`; slim index of the scored set:
  `after/all_scored_slim.json`.
- Reading: the generator's "open device" weight (2, against 0 for the floored device) now applies to read
  classes that the checkpoint calls "not leads". The list says where the generator can compose inside a silent
  cell; it does not rank cells by evidence. The planner can restore the former list by moving the eleven types
  to PENDING in `mk_devices.py` (one edit) or by a lower `--per-device`; the former list is
  `baseline/CANDIDATES.json`.

## 4. Controls

No argument is made, so no control is run against one. Controls enter as record content: three new control
rows with what each keeps and lacks, worded after the referee (reading condition E2 stated in the row and the
note); the referee's G_+ as the control for the class without the pole clause; the defeated-by cells of the three
new rows say which controls pass and in which sense (S12b: identification-type conclusions only; Q30: controls
fail through their zero sets, not at a step; G41: which lifts, and that two campaign controls were not among the
classes). Process controls of the lane: baseline before edits; staged reruns; every anchor matched once; map
rebuilt from `before/` equals the live map; outcomes compared by sha256.

## 5. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument; the round-15 lanes recorded have R1 false by their referees |
| R2 (height-uniform, every window) | false | no conclusion about any window |
| R3 (fails for every control at a structural step) | false | no mechanism; the rows record controls that pass |
| R4 (reaches the critical line) | false | not addressed; the record states that no lane has R4 |

About zeros: no. Score 0.

## 6. Three weakest steps

1. **No independent referee, and the wording is one reader's compression.** REFEREE.md is the author's
   mechanical pass. Rows S12b, Q30, G41, the control rows and the note compress four referee reports; the
   restrictions are entered as the referee lists them and were not re-derived (for example item 21, the H2
   figure, and item 14, the prime 2 in Lemma V, were not understood here beyond their wording). The joint row
   G41 for DJ and DN and the label Q30 are this lane's choices; STRATEGY and ROUND_LOG still say "Q25 proposed"
   in older paragraphs.
2. **The silent-cell nodes change what the generator returns far more than a record edit should.** They were
   asked for and are entered as open devices because that is the only state in which the generator proposes
   with them; the consequence is that 57 of the top 60 stand on read classes that are explicitly not leads, and
   13 former candidates are no longer enumerated. Node texts and tags are this lane's reading of the checkpoint,
   and the tags decide which compositions appear. Whether the cells should stay open devices is a planner
   decision that this lane did not take.
3. **Statement O version 4 extends the statement on thin support.** Lines 13 to 17 rest on one referee file
   each; line 16 on a single derivation inside a referee file; lines 13 to 16 need an extension of class K of A1
   that the statement did not have. The label rule keeps them at ARGUED, but section F and the version-4
   paragraph of section C read the checkpoint (one referee) as settled. A second referee on the ZQ construction
   is owed to repair lane A.

Also recorded: the screening lines carry round 15, so the history row of round 15 now shows 18 lanes;
`s1-klein-annulus-energy` has a line although it has not reported; two lane RESULT files of other lanes were
edited (dated, marked insertions only); `ROUND_LOG.md` was edited in two lines (appended notes) and not in its
"Owed" paragraph.

## 7. Still owed after this lane

- Independent referee for this lane; second referee for lines 13 to 17 of Statement O version 4.
- `CONTROL_CODE_RE` codes NR-q, ZQ, SG in `engine/build_graph.py`; pointers in `ENGINE_LOG.md`, `ROADMAP.md`.
- Device entries and rows for `c15-edge-argument-strip-width-hecke-amplified` and
  `c15-klein-transport-lemma-w-stage-a-and-e1`.
- From the round-15 Owed paragraph, assigned to other lanes: the draw-stage recount of the c14 joint search and
  the canonical tier (`c16-dn-canonical-tier-ball-conversion`); referees for Lemma J1' and the U8 exclusion
  (`c16-referee-r15-j1prime-u8-screening`). Row G41 must follow the first of these.
- Referees for the screening lanes before any of their statements enters the map; a RESULT.md for
  `s1-klein-annulus-energy`.

## 8. Files

In `tmp/research-2026-11-16/push/c16-repair-owed-record-r15/`:
`RESULT.md`, `REFEREE.md`, `STATEMENT_O_v4.md`, `sources.py`, `check_sources.py` (+ `.json`), `apply_map.py`,
`patch_engine.py`, `patch_text.py` (+ `.json`), `add_screening_lines.py`, `screening_lines.jsonl`,
`build_statement_o.py`, `compare.py`, `top60_attribution.py`, `ref_checks.py` (+ `.json`, `.log`),
`lanes_line.json`; state directories `baseline/` (with `onfile/` and `sha.before`), `after1/`, `after2/`,
`after/` (with `sha.after`, `top60_attribution.json`, `all_scored_slim.json`), `after_final/`; differences
`diff_baseline_after1.json`, `diff_after1_after2.json`, `diff_after2_after.json`, `diff_after_final.json`,
`diff_baseline_after.json`, and the two superseded files `diff_baseline_after1.with-regex.json`,
`diff_after1_after2.first-wording.json`; `before/` (copies of every changed file as found).

Changed outside the lane directory: `push/OBSTRUCTION_MAP.md`;
`push/c15-control-with-zeta-fe-classes-u1-u2/RESULT.md` and `push/c14-prefilter-sweep-geometric-nodes/RESULT.md`
(dated notes); `campaign/CAMPAIGN_REPORT_R15.md`, `campaign/STRATEGY.md`, `campaign/ROUND_LOG.md` (two lines),
`campaign/lanes.jsonl` (11 lines appended), `campaign/scoreboard.json`, `campaign/SCOREBOARD.md`;
`engine/curated/controls.json`, `engine/curated/mk_devices.py`, `engine/curated/devices.json`,
`engine/curated/CHANGELOG_c16-repair.md` (new), `engine/nodes/nodes-21.json` (new), `engine/IDEA_GRAPH.json`,
`engine/CANDIDATES.json`, `engine/scratch/mk_devices.pre-c16-repair.py` (copy).
