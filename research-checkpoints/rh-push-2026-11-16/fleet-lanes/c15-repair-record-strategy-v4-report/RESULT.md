# c15-repair-record-strategy-v4-report: RESULT

Lane of campaign round 15, kind repair (record slot added by the checkpoint rule). Date 2026-11-19.
No attack. Nothing in this lane is a statement about zeros of zeta. R4 is not addressed.
All runs local, through `scripts/memcap.sh 8`, each under one minute; the compute server was not contacted.

## Verdict

**partial-result (record lane; all four parts of the assignment done; decisive check passes).**

- Map: 198 -> 202 labelled rows (G37, G38, G39, G40), control note NR-vec, note Lemma F with sentence E1 marked NOT HOLDING, the 13 label restrictions of `c14-referee-r13-independent` on seven rows and two notes, five rows in the referee-broken index.
- Engine: `CONTROL_CODE_RE` extended (one line); control NR-vec; device types 45 closed / 1 floored -> 50 closed / 1 floored / 0 open; pending 9 -> 8 with RS-1..RS-3 replaced by U3, U6 (e)-(g), U8. `merge_outcomes.py` not run; outcomes byte-identical.
- `campaign/STRATEGY.md` is version 4 (previous version in `engine/scratch/STRATEGY.v3.md`).
- `campaign/CAMPAIGN_REPORT_R15.md` written.
- Decisive check: scoreboard headline 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4) and hold rate 90.2% are unchanged; parts A, B and D of `scoreboard.json` are equal field by field before and after. Part C moved; each move is attributed in section 3.3.

## 1. Plan

What is new against the atlas and the walls: nothing mathematical. The lane enters results of round 14 into the three state files, each worded after the referee file of its lane, and writes the campaign result in the form the checkpoint rule prescribes.

Order of work: (0) copies of every file to be changed in `before/`; (1) decisive check first as a baseline: rerun `build_graph.py`, `generate.py --top 60`, `scoreboard.py` with no edit, so that drift already on disk is separated from this lane's edits; (2) map edits by one script of exact-string replacements (`apply_map.py`, each string must match once); (3) engine edits by one script (`patch_engine.py`), syntax check, rerun, diff; (4) STRATEGY v4 by one script (`patch_strategy.py`); (5) report generated from the files on disk (`mk_report.py`, `row_referee_counts.py`); (6) second-pass checks (`ref_checks.py`).

Sources read: BRIEF (to the end, including the update of 2026-11-19 that appeared while the lane ran); map sections 2, 3.2, 3.9, 3.10, 7 and rows G26, G34 to G36, P55, L6, Z36, D9, O1; ROUND_LOG round-14 allocation, results, lessons, round-15 allocation; `CHECKPOINT_R14_DRAFT.md` in full; STRATEGY v3 sections 0 to 2, 4.0, 5; RESULT / REFEREE / MAP_ROW / device-proposal files of round-14 lanes 1 to 6; RESULT and REFEREE of `c14-referee-r13-independent` and of `c14-repair-map-engine-checkpoint-record`; `STATEMENT_O_v3.md` header.

## 2. Work

### 2.1 Map rows and notes of round 14 (`push/OBSTRUCTION_MAP.md`)

Each of the four lanes has one independent referee pass that holds with corrections. Only lanes 3 and 6 had a `MAP_ROW.md`; lanes 2 and 4 proposed their row inside RESULT.md (sections 7). Each row below is the lane's proposal rewritten with the referee's corrections.

| row | lane | referee corrections entered in the row |
|---|---|---|
| G37 | `c14-laxphillips-hecke-norm-outside-l2` (lane 4; label G37 proposed by the lane) | Theorem L is for the full-space operator norm; on the mean-zero subspace the bound is implied by admissibility (referee repair); Lemma Q restated on functions with cosh(t sqrt(L)), one-directional; "ratio at most 0.989" replaced (tends to 1; 0.99990 at n = 9973); closure for four named families only, general gauges ARGUED; BLS is defined in the map and was not run against M_B; the L^q_0 interpolation sentence is OPEN |
| G38 | `c14-joint-pair-design-ratio-vortex-cross-bridge` (lane 2) | exponent 3(1 - sigma)/(2 - sigma) on [1/2, 4/5] only (E1); COMP for T-NR is "the same statement as for zeta plus a common term", the E_a line ARGUED (E2); general form of the twist-transfer finding ARGUED (E3); DH reading: COMP expected to hold for DH with a larger window, measurement MEASURED float64 (E4) |
| G39 | `c14-theta-orthogonal-metaplectic-eigenobject` (lane 3) | the vanishing row is not "one condition b(1) = 0" (odd p only; 2-adic zero as counter-example), it is Lemma 1' (correction 1); Lemma V with the repaired twist (correction 2); stale table values pointed to `ref_check.json` (correction 3); Lemma E (iii) relative to an unopened source, "other rows do not vanish" MEASURED (correction 4) |
| G40 | `c14-x2-step-catalogue-zero-indexed-objects` (lane 6) | "pole at 1" is never simple for n >= 2, only the position part is equivalent to the exponent-0 conclusion (error 1); list L-c is the Jacquet-Shalika entry alone, six entries fail at every parameter (error 2); forced vanishing on the line Re w = P - 1, not "at real w" (error 4); non-Borel cell closed for torus parameters, ARGUED for isobaric sums (error 5); control rows are typings, not runs |

Section 2 notes added: control **NR-vec** (definition as repaired by the referee: f_q = (F_0 - F x chi_q)/2 with F_0 = F - (1/q) sum_j F(z + j/q); the lane's principal-twist definition does not give the indicator), with the 2-adic zero recorded as a second control of the same referee pass; **Lemma F** (the three-question pre-filter as one lemma), a sufficient test for "a control passes".

Sentence E1 of `c14-prefilter-sweep-geometric-nodes` ("for a < 1/2 an off-line zero is a pole and the Schur condition is the zero-free statement itself", labelled PROVED) is recorded as **NOT HOLDING** in the Lemma F note and in section 7, with the referee's counter-example and the statement that stands, "until lane `c15-klein-transport-lemma-w-stage-a-and-e1` reports". That lane's directory was empty when this lane finished.

Section 7 (referee-broken claims index): five rows (lanes 2, 3, 4, 6 and the E1 row). Row G26 now points to G37. Header: update paragraph "eleventh". Row count line: P 55, G 40, Q 29, S 12, Z 39, F 8, T 3, L 6, D 9, O 1 = 202.

Not added: a map row for lane 1 (`c14-joint-zeta-twist-noncone-search`, dictionary DJ) and for the sweep of lane 5. They are not in the assignment; lane 1 has no row proposal file. Lane 1 has a device entry (2.3); the sweep is described in the Lemma F note.

### 2.2 The 13 label restrictions of `c14-referee-r13-independent` (RESULT.md section 4)

Applied to the map and, where the same sentence stands there, to the device evidence in `curated/mk_devices.py`. The RESULT files of the round-13 lanes were not edited (same rule as the round-14 repair lane; checked by modification time).

| # | restriction | where applied | how |
|---|---|---|---|
| 1 | "exactly when the zeros leave the line" -> c >= 2; zeros off the line for c > 2 | row L6 | sentence added; row P55 already carried it (referee R-4) |
| 2 | lattice rows "PROVED from the zeta row" -> relative to the measured zeta row | row P55, status cell | added |
| 3 | Lemma P use rule: all hypotheses typed in one normalisation | section 2 note Lemma P; row P55 | added in both |
| 4 | "arbitrary conjugate pairs" -> non-real pairs, or real points with even multiplicity | section 2 note BLS; row D9 | added in both |
| 5 | c = -2.1 and single real factors: MEASURED only | row D9 | added |
| 6 | "no constraint on numerator zeros": proved for (I), OPEN for (I_aff) | row D9; device `kacmoody-loop-eisenstein-maass-selberg`; `controls.json` BLS status unchanged ("proved in rank one") | added |
| 7 | display of BRS (4.6): subtracted term in H_+, h^+_1 := 0 | row G34 | added with the display |
| 8 | factorisation and orbit statement restricted to H_- | row G34 (two places, status cell); device `fourier-interpolation-zero-nodes` | added |
| 9 | Lemma T: frequency set has one sign at m = q^2 in the H_+ family | row G34 | entered as stated by the referee; not re-derived here |
| 10 | "the one displayed inequality" -> relative to the reconstructed threshold | row G35; device `lrs-amplification-eisenstein-at-zero` | added |
| 11 | Lemma 1 decay exponent -(J + 3/2 + c), -1 < c < -1/2 | row Z36 | exponent was already in the row (E1); range of c added |
| 12 | sign of R_chi(t): hypothesis L(1/2, chi) != 0 | row Z36 | added |
| 13 | Lemma H consequence relative to classical log-concavity of the Riemann-Polya kernel (source not opened) | row G36 | added |

Status cells of rows P55, D9, G34, G35, G36, Z36 and the BLS note now record the second independent referee pass, with what it did and did not redo (G36: grid stage only; "DH never opposite" for the battery member only; Z36: Lemma 1 reproduced numerically at two new instances and one of the lane's with a different J, not re-proved).

### 2.3 Engine

- `build_graph.py` line 174: `CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(NR-vec|BLS|UNIV|DH|HEAT|...`. One line changed (checked against the saved copy). Deviation from the assignment text, stated: NR-vec is added with BLS and UNIV and placed before NR, because otherwise the string "NR-vec" in the defeated-by cell of row G39 is read as the control T-NR. Syntax check: `python3 -m py_compile` on `build_graph.py` and `curated/mk_devices.py` after the edit and before any run; the previous file is `engine/scratch/build_graph.pre-c15-repair.py`.
- `curated/controls.json`: entry `NR-vec` (19 -> 20 controls).
- `curated/mk_devices.py`: five closed device types (the four with rows G37 to G40 and `dictionary-dj-joint-pair-sign-functionals`, closed as MEASURED on the independent referee pass of lane 1; no node for any of them); three evidence strings carry restrictions 6, 7 to 9, 10.
- Pending proposals: RS-1, RS-2, RS-3 removed. One entry per class U1 to U8 that has no lane. Reading used: U1 and U2 have `c15-edge-argument-strip-width-hecke-amplified` and `c15-control-with-zeta-fe-classes-u1-u2`; U4 has `c15-nonhomogeneous-pair-triple-kernel-search`; U5 has `c15-u5-window-count-threshold-translate-control`; U7 has `c15-u7-growing-section-twin-ladder-bridge`. So entries were written for **U3**, **U6 cells (e), (f), (g)** (cells (a), (b) closed in round 14; cells (c), (d) are two existing entries of the list) and **U8**. The proposal "Lax-Phillips Hecke norms outside the weighted-L2 family" moved to devices. Pending 9 -> 8. The pending list is not read by `build_graph.py`, `generate.py` or `scoreboard.py`.
- `merge_outcomes.py` was not run. `engine/outcomes.json`, all 132 files of `engine/outcomes/` and `closed_families.json` are byte-identical to the copies in `before/` (sha256).
- `engine/ENGINE_LOG.md`: section "Round 15 repair slot". `engine/ROADMAP.md`: section 12 (five lines; state after round 14).

### 2.4 Counts that moved, attributed

Three states: the files found at the start; a baseline rerun with no edit; the rerun after the edits. Logs: `engine_rerun.baseline.log`, `engine_rerun.log`; counts: `engine_counts_onfile.json`, `engine_counts_before.json`, `engine_counts_after.json`.

| quantity | on file at start | baseline rerun | after edits | cause |
|---|---|---|---|---|
| map labelled rows | 198 | 198 | 202 | G37 to G40 |
| map rows parsed by the engine | 234 | 234 | 238 | same |
| device types closed / floored / open | 45 / 1 / 0 | 45 / 1 / 0 | 50 / 1 / 0 | five round-14 types |
| pending proposals | 9 | 9 | 8 | 2.3 |
| controls | 19 | 19 | 20 | NR-vec |
| graph nodes (live) | 1,690 (963) | 1,690 (963) | 1,695 (963) | `row-G37` to `row-G40`, `ctl-NR-vec` |
| graph edges | 9,002 | 9,002 | 9,020 | 18 control-defeats edges |
| control-defeats edges | 848 | 848 | 866 | 17 from the four new rows; 1 from the regex change (`ctl-BLS` -> `row-D9`) |
| outcome entries | 132 | 132 | 132 | not touched |
| generated / scored / rejected | 36,558 / 8,437 / 28,121 | same | same | - |
| top 60: node keys, order, scores | - | identical | identical | 16 candidates have a changed `rowsChecked` list (G40 in 8, G39 in 6, D9 in 5, G37 in 3, G38 in 2) |
| scoreboard A: headline, score histogram | 1 of 4; 120 / 2 / 0 / 0 / 0 | same | same | - |
| scoreboard B | all five figures | same | same | - |
| scoreboard D: lanes, hold rate, PROVED broken, 3-referee | 122, 90.2%, 11, 1 | same | same | - |
| scoreboard C: nodes | 1,685 | 1,690 | 1,695 | first step: the scoreboard on file predates the round-15 planner's graph rebuild (five round-14 outcome nodes); second step: this lane (five nodes) |
| scoreboard C: nodes marked closed | 561 | 566 | 570 | first step as above; second: the four rows |
| scoreboard C: tags | 398 | 423 | 423 | planner rebuild only |
| scoreboard C: families / closed / tried / untried | 79,003 / 3,034 / 633 / 75,336 | 89,253 / 3,190 / 651 / 85,412 | same as baseline | planner rebuild only (new tags of the round-14 outcome nodes); not an effect of this lane |

A third rerun (`engine_rerun.final.log`, `engine_counts_final.json`) followed two wording corrections found by the second pass (REFEREE.md items 1, 2): every count of the table and the top 60 are identical to the "after edits" column.

After this lane appended its own line to `campaign/lanes.jsonl`, `scoreboard.py` was run once more (`scoreboard_rerun.with-lane-line.log`; the state before it is `scoreboard.after-edits.json`). Changes, all caused by the one new line: lanes 122 -> 123, lanes at score 0 120 -> 121, a history row for round 15; hold rate 110 of 122 -> 111 of 123, printed 90.2% in both (0.9016 and 0.9024; the new line counts a same-agent second pass as its referee, as for earlier repair lanes); headline unchanged. `CAMPAIGN_REPORT_R15.md` keeps the state after round 14 (122 lanes).

The 18 edges were listed one by one (`ref_checks`, section 3 of the log entry). UNIV received no edge: no defeated-by cell names it. BLS received one edge on an old row (D9) and four on the new rows. A cell that says "passes" and a cell that says "typed, not run" both produce a control-defeats edge; the edge type is the builder's name, not a verdict.

### 2.5 STRATEGY version 4 (`campaign/STRATEGY.md`)

- Title and version line; section 0a (state after round 14: table by lane kind recomputed from `lanes.jsonl`, 12 explore lanes of rounds 11 to 14 all stopped at stage A, form of the campaign result).
- Section 1: allocation **1 explore, 2 repair-and-record**; the other five slots (up to 2 deepen, up to 2 combine, 1 compute) only on items that would turn a silent class into a verdict; frontier slot withdrawn.
- Section 2: checkpoint marked APPLIED; rule for leaving the checkpoint state; rule on `merge_outcomes.py`.
- Section 4.0 replaced: U1 to U8 in one table (read set, why the record is silent, round-15 lane or none), with the sentence "These are the classes on which the record is silent, not leads", the caveat that U1 and U2 are silent for the same by-construction reason as U3 (defect 1 of the draft's referee), the round-14 narrowing of U4 and U6, and the note that the draft has no independent referee yet. "Current best lead: RS-1" withdrawn. Version 3's section 4.0 kept as 4.0b.
- Section 5: change-log entry v4 with the reason (the rule of version 3; 12 explore lanes, score sum 0, no frontier figure moved).
- Previous version: `engine/scratch/STRATEGY.v3.md`.

Event during the edit: between this lane's first copy of STRATEGY.md (17:57Z) and the edit, another process appended a section "Directive from the user, 2026-11-19" to the file (server use, three heavy compute lanes, a screening file). This lane kept that section byte-identical at the end of the file, placed the v4 change-log entry before it, and re-copied the file with the section to `engine/scratch/STRATEGY.v3.md`. The first copy without the section is `before/STRATEGY.md`; the copy with it is `before/STRATEGY.as-of-v4-edit.md`. The section sets lane counts that differ from the version-4 table; the entry says the planner resolves this. This lane did not act on the section.

### 2.6 Campaign report (`campaign/CAMPAIGN_REPORT_R15.md`)

Generated by `mk_report.py` from `scoreboard.json`, `devices.json`, the map and `lanes.jsonl`. Content: RH open, no statement about zeros, headline 1 of 4; Statement O version 3 (12 lines, labels PROVED 4, PROVED-relative 1, MEASURED 1, ARGUED 6, referee files); map 202 rows with referee records per section and per row (appendix A); 51 device types listed (50 closed, 1 floored), with the two closed on measured searches and the two with an argued or restricted part named; the silent classes; part-B figure 0.8748866470 with its dependencies (the 7/8 manuscript and preprints Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835; the lemmas not checked; not in Lean); reliability; limits.

Referee records per row (`row_referee_counts.py`; the count is the largest number of referee records among the lanes cited in the row's source cell; per source lane, not per statement): 35 rows with none (the pre-campaign lanes the map header lists as unrefereed), 138 with one, 29 with two, none with three.

## 3. Controls

Not applicable as a test of an argument: the lane makes no argument. Controls enter as record content:

- New control NR-vec (map note; engine code). Coefficient statement elementary and re-derived by the lane-3 referee; level relative to an unopened source; not computed as a function.
- Each new row's defeated-by cell is worded after its referee, including which control rows are typings or paper statements and not runs (G39: T-NR, DH; G40: T-NR, BLS, DH; G37: BLS at model level only).
- Process control of this lane: baseline rerun before edits; every edit script asserts one match per string; map rebuilt from `before/` by the script equals the live file; outcomes compared by sha256.

## 4. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | no argument is made; the four lanes recorded all have R1 false by their referees |
| R2 (height-uniform, every window) | false | no conclusion about any window |
| R3 (fails for every control at a structural step) | false | no mechanism; the rows record controls that pass |
| R4 (reaches the critical line) | false | not addressed; the record states that no lane has R4 |

About zeros: no. Score 0.

## 5. Three weakest steps

1. **The row and restriction wording is one reader's rewriting of referee files.** Rows G37 to G40 compress four referee reports; a referee correction may be entered in the wrong place or with a changed sense. Restriction 9 (sign of the frequency set at m = q^2 in the H_+ family) is entered as the referee states it and was not understood well enough here to re-derive. The independent referee of round 14 owed by `c15-referee-r14-independent-checkpoint` may change these rows again.
2. **STRATEGY 4.0 rests on an unrefereed draft, and "which classes have no lane" is a reading of the round-15 allocation.** U3 is counted as having no lane although `c15-control-with-zeta-fe-classes-u1-u2` may change what R3 means there; U6 is split by cell. If the checkpoint referee rewrites or merges classes, section 4.0 and the three pending entries must follow. The version-4 lane counts also stand next to an appended directive that asks for more compute lanes; this lane did not reconcile the two.
3. **Two mechanical counts carry more weight in the report than they can bear.** (a) "Referee records per row" counts records of the source lane, not review of the row's statement; second passes filed in repair-lane directories are missed unless the learn step raised the `referees` field, and a lane with a second referee file about a different statement is counted as two. (b) The control-defeats edges created by the new control codes are keyword hits in a cell. Neither enters the headline or the hold rate.

Also recorded: the fifth device type (dictionary DJ) and the NR-vec regex entry go beyond the literal assignment; no map row was written for lane 1; `ROUND_LOG.md`, `SCOREBOARD.md` wording and `MAP_PENDING.md` were not edited by hand (`scoreboard.py` has no notes field; the checkpoint sentence is in the report and in STRATEGY 0a).

## 6. Files

In `tmp/research-2026-11-16/push/c15-repair-record-strategy-v4-report/`:
`RESULT.md`, `REFEREE.md`, `apply_map.py`, `patch_engine.py`, `patch_strategy.py`, `mk_report.py`, `row_referee_counts.py` (+ `.json`), `engine_counts.py`, `engine_counts_onfile.json`, `engine_counts_before.json`, `engine_counts_after.json`, `engine_rerun.baseline.log`, `engine_rerun.log`, `engine_rerun.final.log`, `engine_counts_final.json`, `ref_checks.py` (+ `.json`, `.log`), `scoreboard.after-edits.json`, `SCOREBOARD.after-edits.md`, `scoreboard_rerun.with-lane-line.log`, `lanes_line.json`, and `before/` (copies of every changed file as found: `OBSTRUCTION_MAP.md`, `STRATEGY.md`, `STRATEGY.as-of-v4-edit.md`, `scoreboard.json`, `SCOREBOARD.md`, the two baseline-run scoreboard files, `lanes.jsonl`, `ROUND_LOG.md` (not changed), `build_graph.py`, `mk_devices.py`, `devices.json`, `controls.json`, `outcomes.json`, `outcomes/`, `CANDIDATES.json`, `IDEA_GRAPH.json`, `ROADMAP.md`, `ENGINE_LOG.md`, `closed_families.json`).

Changed outside the lane directory: `push/OBSTRUCTION_MAP.md`; `engine/build_graph.py`, `engine/curated/controls.json`, `engine/curated/mk_devices.py`, `engine/curated/devices.json`, `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json`, `engine/ENGINE_LOG.md`, `engine/ROADMAP.md`, `engine/scratch/` (five copies); `campaign/STRATEGY.md`, `campaign/CAMPAIGN_REPORT_R15.md` (new), `campaign/scoreboard.json`, `campaign/SCOREBOARD.md`, `campaign/lanes.jsonl` (one line appended).
