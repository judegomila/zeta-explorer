# c20-repair-owed-record-r19-statement-o-v5: RESULT

Campaign round 20, kind: repair (lane B, record). Date 2026-11-20 UTC. No attack.
Nothing in this file or in any edit of this lane is a statement about zeros of zeta. The headline cannot move and does
not: 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4). No computation was started on the server and no ssh
connection was made; every local run of the engine scripts went through `scripts/memcap.sh 8`. Labels of mathematics
quoted from other lanes are those of their referee files; this lane proves nothing and measures nothing except engine
counts and one float check of five quoted numbers (section 3). Referee of this lane: `REFEREE.md` in this directory, written by a separate process that did not write the lane (a headless
session started by the lane with a referee brief; it wrote that one file): holds with corrections E1 to E9, all entered
(section 9).

Paths are relative to `tmp/research-2026-11-16/`. Lane directory: `push/c20-repair-owed-record-r19-statement-o-v5/`
(`L/` below).

## 0. Verdict

**Partial result (record lane).** The seven items of the assignment are done. Limits: every round-19 row entered here
rests on one referee per lane and was condensed by one reader; Statement O version 5 relabels four lines, not five; the
checkpoint is not applied.

| item | outcome |
|---|---|
| 1. map rows of round-19 lanes 3, 5, 6 | row X2 (HQ2 screen); control rows HQ3, HQ4 and an HQ2 addendum, with engine codes HQ2, HQ3, HQ4; Z37 round-19 addendum; D10 round-19 addendum; one item in section 6; all worded after the referee files |
| 2. correction E1 (Liouville fails at p q^2, P > 12) | seven notes in the lane's RESULT.md; the lane's `lanes.jsonl`; the `claim` field of its line in `campaign/lanes.jsonl`; map row G45 (the lane's proposed row, entered in the corrected form) |
| 3. Lemma P and the band device | five notes in the lane's RESULT.md with the repaired statement; P58 round-19 addendum; device state `closed` confirmed in `engine/curated/devices.json`, `closedOn` rewritten for the five referee files on record |
| 4. the 23 corrected sentences | `campaign/CORRECTIONS_R18.md` (register); 8 were already in the map, 15 added or completed in rows G44, P58, D10, HQ2, Q31; Q31 cites Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3 |
| 5. STRATEGY | section 3.1 items 59 to 65; paragraph "State of the cells after round 19"; bracketed notes on items 54 to 57; no rule, weight or allocation changed |
| 6. Statement O version 5 | new file `L/STATEMENT_O_v5.md`; lines 13, 14, 16, 17 relabelled PROVED in the form the second referee file confirms; **line 15 not relabelled** (the second file does not cover the NR-q construction); nothing else changed |
| 7. decision sheet | `campaign/CHECKPOINT_R20_DECISION_SHEET.md`: evidence per condition of the rule; work for rounds 21 onward with cost estimates; the checkpoint is not applied |

Scoreboard after the edits: `C_coverage.nodes` 1,750 -> 1,756 and `C_coverage.nodesMarkedClosed` 609 -> 611; every
other entry unchanged. After this lane's line: `lanesRun` 172 -> 173, `lanesRefereed` 162 -> 163, score histogram at 0:
170 -> 171, one history entry for round 20. Each movement is explained in section 2.6.

## 1. Plan

1. Decisive first step: backups (`L/before/`), then `engine/build_graph.py`, `engine/generate.py --top 60` and
   `campaign/scoreboard.py` rerun before any edit, so that every later difference has a reference.
2. Read the "Owed" paragraph of round 19, `CHECKPOINT_R20_INPUT.md`, the tooling of the previous record lane, and for
   each owed item the lane's REFEREE.md before its RESULT.md or MAP_ROW.md.
3. Map rows and control rows (`L/apply_map.py`), engine control codes and device block (`L/edit_engine.py`), correction
   notes (`L/apply_corrections.py`), STRATEGY and the corrections register (`L/apply_campaign.py`).
4. Statement O version 5 by script (`L/build_statement_o_v5.py`): each quoted sentence is asserted to occur in the
   referee file before the file is written; a diff against version 4 lists every changed line.
5. Decision sheet by hand from the files.
6. Rerun the three scripts after the edits and after the lane line; compare entry by entry (`L/compare.py`).

All edits of existing files are made by scripts with anchored replacements (each anchor must match exactly once), so
each can be read and reversed from `L/before/`. `merge_outcomes.py` was not run (no outcome record is written or
changed by this lane).

## 2. Work

### 2.1 Map (`push/OBSTRUCTION_MAP.md`; script `L/apply_map.py`; previous file `L/before/OBSTRUCTION_MAP.md`)

| owed item | where entered | labels carried | referees |
|---|---|---|---|
| HQ3, HQ4 (lane 3) | section 2 table, after HQ2 (table now 16 controls) | PROVED, elementary, re-derived by the referee on the new member (5; 0.07, 0.31); Edrei's theorem CLASSICAL, not opened; Lemma N as a necessary condition (E5) | 1 |
| HQ2 addendum (lane 3) and sentence 18 | row HQ2: log-level positivity lacking (first negative k = 13, 22, 38, 67, 212, 669); exact zero distance; engine code; second referee file | PROVED; exact rational arithmetic for the table | 2 on the construction, 1 on the addendum |
| the row of lane 3 | new row **X2**, after X1 | PROVED (Lemmas N, S, F, C; S, F, C "elementary, known type; novelty not established", E3); CERTIFIED (table, device cells); ARGUED (device rows 10, 11, 12, 18). The referee's main correction E1 is in the row: in the finite class the local-shape read selects the twins the pole clause already rejects | 1 |
| section 6 item (lane 3) | item 23: Euler-shape rigidity for infinitely many modified primes | open question; an identification | - |
| Z37 (lane 5) | round-19 addendum in the stops, status, defeated-by and source cells | PROVED (interchange lemma, theta splitting), CLASSICAL, CERTIFIED for the analytic step (132 of 132), MEASURED float64 (one self-dual cusp form), RECALLED; the referee's corrections 1 to 8 are in the text (correction 8, the heuristic error bar, entered after this lane's referee, E2) (8 real and 4 complex values; radii to 5.1e-4; Eichler mass check; no explicit s_0; scope of "no inequality"; "one self-dual cusp form"; the direction of "(K3) holds") | 1 |
| D10 revision (lane 6) | round-19 addendum (stops, status, defeated-by, source); section 2 note on BLS in rank 2; one row in section 7 for the round-18 Theorem H (X = 0) | PROVED (Lemma 1, Theorems 2 to 4 as reductions, Lemma 5), PROVED-exact (224 configurations: 220 of the lane, 4 of the referee), MEASURED (the deficit count; W-2, W-3), OPEN (NL(d), X(d) for d > 4); W-1, W-4, W-5 in the text. The row stays open | 1 |
| E1 of lane 1 | new row **G45**, after G44 (the lane's proposed row, section 6 of its RESULT.md) | PROVED, CLASSICAL in content (Q2 as a limit over heights with simple zeros, E3, E4; K1 as Bohr equivalence), CHECKED float64, ARGUED (rows ZQ, DH, HEAT); the Liouville entry in bold as corrected; scope E5 | 1 (does not hold as worded; holds after E1) |
| Lemma P of lane 2 | row P58, round-19 addendum (stops, status, defeated-by, source) | Lemma P PROVED under sigma >= 0 only; repaired bound on the mode spaces (E1); medians and cells of the scaled defect (E2); the ZQ obstruction in the form of E3; 422 of 432 certified (E4); MEASURED; ARGUED | 1 |
| sentences 3, 4 | row G44 (Lemma V sentence replaced; Theorem T sentence added); status: second referee file, C1 to C4 | no label breaks | 2 |
| sentences 6, 7, 8, 9, 10 to 13 | row P58 (tail and mean of Re beta; shares at P = 12, 20; ball check; margins at 96 and 192 modes; Form C at 48, 96, 192 modes; the boundary prime; the (1e6, 0.85) row) | MEASURED statements restricted as the second referee rules; "two referees" stated as a count of files with the scope of each second file | 2 per round-18 lane |
| sentences 15, 16 | row D10 (instances for b = (u - 1)(u + a); Theorem Q confirmed through its conclusion at 29 fresh points, factorisation at 12) | no label breaks | 2 on the round-18 lane |
| sentences 22, 23 | row Q31, four edits (three for Turan's theorem, one for W5c): Turan's theorem as Montgomery-Vaughan MNT III (draft), Theorem K.3 (factor 2, constant 8e; Ten Lectures not opened); W5c in the form of its referee (PROVED, Plancherel-Polya step proved inline; one referee) | "PROVED relative to" kept for Corollary T' | 2 on the row, 1 on W5c |
| X1 | status and closing sentence: two referee files | no label breaks | 2 |
| O1 | source cell: pointers to versions 3, 4 and 5 of Statement O (the row named version 3 as current) | count of version 5 | - |

Section 7: eight rows (referee corrections of round-19 lanes 1, 2, 3, 5, 6; the round-18 Theorem H; E1 to E5 of the
referee of `c19-referee-r18-independent-sources`; E1 to E5 of the referee of the previous record lane). Row-count line
and a sixteenth update paragraph. Checks in the script: 217 distinct row labels (P 58, G 45, Q 31, S 13, Z 40, F 8,
T 3, L 6, D 10, X 2, O 1) plus the control labels HQ2, HQ3, HQ4; no duplicate; every new or edited row has six cells,
each control row five. The file grows from 678 to 693 lines (15 inserted lines: 2 control rows, 2 rows, 1 item, 8 rows
of section 7, the update paragraph and a blank line). `build_graph.py` parses 253 rows (251 before).

Not entered as a row: lane 4 (`c19-dp-zero-census-truncation-identity-server`) proposed no row and is not in the owed
list; its results are cited in row G45, in STRATEGY item 62 and in the cell evidence from the round log.

### 2.2 Correction notes in lane files (`L/apply_corrections.py`; previous files `L/before/lanefiles/`)

The original sentence stays; a note beginning "[Correction entered 2026-11-20 by lane
c20-repair-owed-record-r19-statement-o-v5" follows it.

- `push/c19-u4-joint-prime-phase-quadratic-dp-zeros/RESULT.md`, seven notes: the verdict paragraph; summary item 3;
  step M; the stage-A table row (inside the cell); the result paragraph of section 3; the R3 line; the proposed map
  row. Content: Lambda_eps(p^k) = eps(p)^k log p, so for Liouville the cross product has sign (-1)^(j+k); first failing
  atom n = 12 (-2 log 2 log 3 = -1.523), also 18, 20, 28; the lane's check used P = 10; Liouville passes only for
  P <= 12; among sign chains only eps = +1 passes at every P; the opposite-sign member is 1/zeta; the stage-A stop
  stands on E_a and DEL.
- The lane's `lanes.jsonl`: `claim` corrected, the filed text kept in `claimAsFiled`, one field `correction`.
- `campaign/lanes.jsonl`, line 167: field `claim` only (the Liouville clause corrected; "Unrefereed." replaced by the
  referee outcome). `laneClaim`, `errors`, `surviving` and every score field are untouched. Verified: of the 172
  lines, one field of one line differs from `L/before/lanes.jsonl`.
- `push/c19-rs-real-zero-completion-band-server/RESULT.md`, five notes: verdict item 1; the sentence "sigma >= 0 for
  every point set G"; after the proof of Lemma P (the repaired statement, Lemma P'); section 7 item 4; the proposed
  map text. Repaired statement as entered: Lemma P holds under sigma >= 0; the constructed sigma is signed (Arch
  density negative for abs(x) < 6.2898, negative mass 2.2479; counterexample U = 10, h = sin(pi s/10)); for it
  <h, T_sigma h> >= -2.248 sup over abs(x) <= 6.29 of abs(g)^2, at most 2.248 * 4m/(u t_w^2) on m Fourier modes
  centred at t_w (3e-11 Lg at 1e6 with m = 384); the runs enclose lambda_min(T_sigma) per cell, so no number and no
  control verdict changes; the statement holds on the mode spaces m = 96, 192, 384, not on every band.

The 23 sentences are not entered as notes in the five round-18 lane files (precedent of `CORRECTIONS_R16.md`: a
register plus the map). The register names for each sentence the place where the record carries it.

### 2.3 Engine (`L/edit_engine.py`; previous files `L/before/`, `engine/scratch/*.pre-c20-repair.py`)

- `engine/curated/controls.json`: codes HQ2, HQ3, HQ4 (11 curated codes, was 8).
- `engine/build_graph.py`: `CONTROL_CODE_RE` extended by `HQ2|HQ3|HQ4` (one line, one comment). This is what makes the
  codes usable: `build_graph.py` reads control codes from the "Defeated by" cell of each map row and from lane records,
  and `generate.py` reads them through the field `defeatedByControls` of the row nodes. After the rebuild `ctl-HQ2`
  has control-defeats edges to rows X1, X2, G45, and `ctl-HQ3`, `ctl-HQ4` to row X2; 581 of the 8,426 scored
  candidates carry a row verdict that names HQ2, HQ3 or HQ4 (6 in the top 60; 0 before). `generate.py` itself is not
  edited: its move M2 still names only DH, HEAT or TW- as the control to test.
- `engine/curated/mk_devices.py`, block `R19`, and `devices.json` regenerated. **No state changes.** Band device
  `tz-one-sided-completion-bound-band`: state `closed` (as it was); name, status, evidence and `closedOn` now name the
  five referee files on record (two per round-18 lane, one for the round-19 continuation lane), with the note that
  "referees = 2" counts files and that the round-19 lane's Lemma P stands in the repaired form.
  `exact-relation-rigidity`: `closedOn.referees` 1 -> 2. Cells U4, U6 (c), U6 (g): evidence extended. One pending entry
  (`pending`, lane `c17-window-information-law-ctheta-u5`, "Cell U5 beyond a span"): one sentence appended to its name
  (the continuation of the band device is closed as well); its state is unchanged (referee E9: this edit was not
  declared in the first writing of this file). Device table 55 closed / 1 floored / 0 open; cells 6 / 1 / 4, before and
  after.
- U6 (c): the round-19 lane and the learn step record the cell as closed. The engine state is left at `cell`, because
  the rule of STRATEGY section 2 asks for two referee files and each half of the cell has one; the block says where to
  change it. The STRATEGY paragraph says "closed" with this qualifier. (Referee E1 of the previous record lane objected
  to closures entered on one referee file.)
- The assertion "no open device type" of `mk_devices.py` is scoped to the ids of block R18 (referee E2 of the previous
  record lane), so that a new proposed type can be registered.

### 2.4 STRATEGY and the register (`L/apply_campaign.py`; previous file `L/before/STRATEGY.md`)

- Section 3.1: items 59 (U4 quadratic / joint-phase read; G45), 60 (band device continuation; P58), 61 (HQ2 screen;
  X2), 62 (zeros of D_P as a carrier), 63 (U6 (c) double-cover half; Z37), 64 (U6 (g), fourth lane; D10; not a
  closure), 65 (referee and source records; not a closure). Each item states its referee count and state. Bracketed
  round-19 notes on items 54 to 57; one bracket in the tried list; the heading range is extended.
- Section 4.0: paragraph "State of the cells after round 19": U6 (c) closed (one referee file per half; engine state
  pending); zeros of D_P closed as a carrier; U4 residual reduced to the second-order mixed form; band device family
  closed on three refereed lanes of the device type (the round log writes four without naming them; referee E1); HQ3
  and HQ4 in the control set.
- Section 5: one change-log bullet. Sections 1, 2 and the text of section 3 are untouched.
- `campaign/CORRECTIONS_R18.md` (new): the 23 sentences, quoted without change, each with its place in the record.

### 2.5 Statement O version 5 (`L/STATEMENT_O_v5.md`; script `L/build_statement_o_v5.py`; diff `L/statement_o_v4_v5_diff.txt`)

Input `push/c16-repair-owed-record-r15/STATEMENT_O_v4.md`, not edited. Changes: the title line with a version-5 header,
and the Label bullet of lines 13, 14, 16, 17. The diff against version 4 has five blocks in the line matcher of the build script (title and header; four Label
bullets; the referee's diff counts six hunks, the header in two); the seven version-4 lines that were replaced are the title and the six lines of those four bullets, and each
old label is kept in the new bullet as "(Version 4: ...)". Fields Owed and "Lanes and referee count" are untouched and
describe version 4; the new Label bullet says which owed item is discharged.

| line | control | second file read against the closing step | sentence that covers it (quoted in the file, checked by script) | result |
|---|---|---|---|---|
| 13 | ZQ | `c16-referee-r15-j1prime-u8-screening/REFEREE2_control-zq.md` | "m is a function of (s - 1/2)^2, so m(s) = m(1 - s)"; "argument principle: rectangle right of the line around gbar: ZQ 1, zeta 0"; "no point mass is added or changed"; "holds: sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2"; "Referees for ZQ ...: 2 independent" | PROVED. Not relabelled inside the line: the infimum clause (relative to a recalled classical input, in the second file's corrected form); the paper runs against Z34, Z36, P53 (ARGUED) |
| 14 | SG | the same file, last row of the ruling table | "SG has D <= 0", "each re-derived by hand", "cosh >= 1 >= cos", ruling "hold" | PROVED for the step D <= 0 with the functional equation through Lemma A. The weakest of the four: one clause of one table row; numerics at b = 0.3 not rerun; the zero at 1/2 + b is by construction |
| 15 | NR-q | the same file | none: the file covers Lemma A and Lemma D and does not state the integer-frequency part c zeta, the Hecke relation on the cosets q^j N or the zero line; the zero at c = 2.1 was not rerun | **ARGUED, unchanged** |
| 16 | G_+ | the same file; second derivation in `c18-u4-group-law-left-of-one-torus-orbit/REFEREE.md` | "G_+ (pole clause dropped), b = eta + 0.1: min D_+ = 0 at x = 1 and positive elsewhere on the grid, functional-equation defect 7.2e-29, real poles at 1/2 +- b"; "G_+ density: ... gives D_+ = 4 x^(-1/2)(cosh bL - cos(gbar L) cosh(eta L)) >= 0 for eta < b" | PROVED |
| 17 | WT, span form | `REFEREE2_c15-u5-window-count-threshold-translate-control.md` | translate identity "holds"; Lemma 1 (b) "holds under its hypothesis abs(alpha) <= a/2"; span law "holds for translates with abs(alpha) <= T/2 and for K above about 3"; "Referees for the PROVED statements: 2 independent" | PROVED to leading order for the main clause. The parenthesis on the reflection translate is covered only in the form corrected by the referee of the second file's lane (E1: L^2/(8T) is "a lower bound, not the value"; the defect is (L + 2 abs(delta))^2/(8T)) |

Count: PROVED 8 (3, 6, 8, 9, 13, 14, 16, 17), PROVED relative to a cited theorem 1 (5), MEASURED 1 (2), ARGUED 7
(1, 4, 7, 10, 11, 12, 15). `CHECKPOINT_R20_INPUT.md` expected five relabels from file names; the check against the
closing steps gives four, one of them (17) with a scope the input did not record. Whether version 5 replaces version 4
as the current text is left to the checkpoint; map row O1 lists both. No line is added for rounds 17 to 19.

### 2.6 Reruns and comparison (`L/compare_before_after.md`, `.json`; logs `L/logs/`)

Three runs through `scripts/memcap.sh 8`: before any edit; after the edits; after this lane's line in
`campaign/lanes.jsonl` (the generator and the graph do not read that file; `CANDIDATES.json` after = final, byte for
byte). The comparison file lists every entry of the top 60 before and after, every rejection reason whose count
changed, every entry of `scoreboard.json` in three columns, every device type and cell, every control code, and every
line of `lanes.jsonl` that differs.

| quantity | before (rerun) | after | cause |
|---|---|---|---|
| graph: nodes / live / rows / edges | 1,750 / 976 / 251 / 9,213 | 1,756 / 977 / 253 / 9,236 | six nodes: `ctl-HQ2`, `ctl-HQ3`, `ctl-HQ4`, `row-X2`, `row-G45`, `map-open-23` (section 6 item 23; the one live node) |
| edges: composes-with / control-defeats | 7,609 / 907 | 7,619 / 920 | the open item (10); the new and edited "Defeated by" cells (13) |
| device nodes closed / floored / open | 71 / 6 / 0 | 71 / 6 / 0 | none |
| cells closed / cell / tried-not-closed | 4 / 6 / 1 | 4 / 6 / 1 | none |
| generated / scored / rejected | 38,340 / 8,426 / 29,914 | 38,485 / 8,426 / 30,059 | 145 more generated, all rejected: eight rejection reasons rise by 15, 14, 20, 10, 24, 16, 45, 1 (sum 145); 0 scored candidates contain `map-open-23` (run with `--node map-open-23 --dump-all`; `L/after/scored_counts.json`) |
| top 60: open / floored only / closed device / with a cell | 0 / 60 / 0 / 1 | 0 / 60 / 0 / 1 | none |
| top 60 keys, scores, ranks | | 60 of 60 identical | 47 entries identical in every field; 13 differ in `rowsChecked` only (the new rows X2, G45 enter the list of rows checked) |
| rank 1 | `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural`, 10.25 | the same | none |

Scoreboard, entry by entry (`L/compare_before_after.md` section 5):

| entry | before (rerun) | after the edits | after the lane line | explanation |
|---|---|---|---|---|
| `C_coverage.nodes` | 1,750 | 1,756 | 1,756 | the six graph nodes above |
| `C_coverage.nodesMarkedClosed` | 609 | 611 | 611 | the two row nodes X2, G45 (rows have status closed; control nodes and the open item do not) |
| `D_reliability.lanesRun` | 172 | 172 | 173 | this lane's line |
| `D_reliability.lanesRefereed` | 162 | 162 | 163 | this lane's line, after the referee report (referees 1, holds) |
| `A_requirements.scoreHistogram.0` | 170 | 170 | 171 | this lane's line (score 0) |
| `history` | 19 entries | 19 | 20 | one entry for round 20 (1 lane so far; hold rate 0.914, unchanged) |
| `generated` (timestamp) | 08:25Z | 08:41Z | 09:03Z | reruns |
| every other entry | | unchanged | unchanged | headline 1 of 4; hold rate 0.914 (148 of 162 before, 149 of 163 after the lane line); PROVED claims broken 15; three-referee statements 2 (0 about zeros); tags 528; families 139,128 / closed 4,110 / tried-not-closed 1,352 / open 133,666; outcome records 212; lemmas decided 140 |

One difference is not caused by this lane and is reported because it is larger than anything above: the scoreboard
file as found (written 08:17Z by the learn step of round 19) read nodes 1,746, marked closed 605, tags 504, families
126,756, closed 4,007, tried-not-closed 1,263, open 121,486. The first rerun of this lane, before any edit, gave nodes
1,750, tags 528, families 139,128, closed 4,110, tried-not-closed 1,352. The as-found file had been written before the
graph was rebuilt after the round-19 learn step (the round-20 planner's rebuild gives 1,750 nodes; the cause of the tag
count 504 -> 528 was not examined). The round-19
figures quoted in `ROUND_LOG.md` ("126,756 families; 4,007 closed; 1,263 tried") are those of the older graph. This
lane overwrote the as-found `scoreboard.json` with the first rerun before copying it (a slip: `L/before/scoreboard.json`
is the rerun, not the file as found); the as-found values above are taken from `SCOREBOARD.md` as printed at the start
of the lane.

Changed by the edit of line 167 of `lanes.jsonl` (field `claim`): nothing in the scoreboard.

### 2.7 Decision sheet (`campaign/CHECKPOINT_R20_DECISION_SHEET.md`, new)

- Condition A (no lane has passed stage A): eight evidence rows; met on the record through round 19; the one round-20
  lane that could falsify it reports a stage-A stop and has no independent referee.
- Condition B (no silent cell has produced a non-identity statement that no control passes): one row per cell with
  what it produced, its kind, the passing control and the referee count; met on the record through round 19; after
  round 19 the only cell without a passing control on file was the second-order mixed form of U4, on which the round-20
  lane reports that ZQ passes (unrefereed).
- Work for rounds 21 onward: W1 per line of Statement O (what it needs, what round 20 is already running, what is
  left, cost); W2 per cell; W3 (no named new input on file); record work. Estimate: 8 to 11 paper lanes and 1 to 3
  server jobs at default or heavy size, most optional; about two rounds at 8 lanes per round. Four lines cannot become
  PROVED by computation (1, 5, 7: sources; 10: a hypothesis).
- Section 4 of the sheet lists what it does not decide. No rule is applied or changed.

## 3. Controls

This lane makes no argument, so no control is run against a mechanism. What it records and checks:

- New controls HQ3 and HQ4 are entered with the properties their referee re-derived (functional equation, integer
  frequencies, Euler product, nu >= Lambda >= 0, off-line zeros; simple poles off the line; HQ4 with a totally positive
  local sequence), with engine codes. HQ2 gets its engine code and the addendum "log-level positivity lacking".
- For each new row the defeated-by cell is the referee's reading. G45: E_a and DEL pass every step, HQ2 at each P,
  1/zeta the sign step; sign chains, the Liouville twist (at p q^2, P > 12), T-NR and THIN fail at a cross-prime sign;
  ZQ, DH, HEAT, NR-q fail at support (ARGUED). X2: HQ2 fails only the pole clause at coefficient level, HQ3 passes
  log-level positivity, HQ4 local total positivity; no control satisfies the hypotheses of Lemma C (an identification,
  not counted as R3). P58 addendum: ZQ is not excluded for (u eta)^2 below about 6 tau Lg/u. Z37 addendum: Eisenstein
  and one self-dual cusp form are not separated; zeta controls are not formulable on the array (a gap, not a pass).
- Control row "Liouville" is the subject of item 2: a control entry of a round-19 lane was false because its check
  used P = 10, below the first failing atom 12. The corrected entry is in the map, the lane files and the campaign
  line.
- Script checks: every anchor matched exactly once; no duplicate row label; the device script's assertions pass; each
  quotation in Statement O version 5 occurs in its source file; one field of one line of `lanes.jsonl` changed before
  the append.
- One author-side numeric check of five quoted facts (`L/author_check.py`, mpmath 30 digits, local through
  `scripts/memcap.sh 8`, seconds; log `L/logs/author_check.log`): the Liouville cross coefficient at n = 12 is -1.5230
  and at n = 6 is +1.5230; the Arch density has rho(0) = -0.85501, rho(3) = -0.11845, rho(6) = -0.007525, sign change
  at 6.28984 and negative mass 2.24789; the SG density is <= 0 and the G_+ density >= 0 on a grid of 6,001 points in
  log x up to 30 (maximum, resp. minimum, 0 at x = 1; b = 0.3 for SG; b = 0.2, eta = 0.07, zeros 298, 299 for G_+);
  the SG numerator vanishes at 1/2 + b with zeta(0.8) = -4.4375; the HQ2 distance formula gives 0.247294 at q = 7,
  eps = 0.2 (root of the first referee: 0.747293959 + 0.238267738 i). Float checks of entries, not certificates.
  The nine campaign controls are not applicable to a record edit.

## 4. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | record lane; no argument. The rows entered say the opposite for their lanes: Lemma Q2 and Theorem A hold for every Dirichlet series with a_1 = 1; candidate (J) is implied by Lambda >= 0; Lemma C is an identification for finitely many modified primes; Lemma P uses positivity and linearity |
| R2 (height-uniform, every window) | false | no statement at any height. K1 (row G45) shows height-uniform statements on D_P at fixed P are shared by every unimodular chain; the ZQ row of P58 is height-dependent (E3) |
| R3 (every control fails at a named step) | false | no mechanism; each row entered lists passing controls (E_a, DEL, HQ2, HQ3, HQ4, ZQ through the pair form, symmetric quartets) |
| R4 (reaches the critical line) | false | nothing is carried anywhere; the band device family and the zeros of D_P as a carrier are recorded as closed |

Score 0. No statement about zeros of zeta.

## 5. Three weakest steps

1. **The relabel of line 14, and the reading "covers the closing step" in general.** For line 14 the second file
   treats SG in one clause of one table row ("SG has D <= 0 ... each re-derived by hand ... hold"), did not rerun the
   numerics, and does not state the zero location, which this lane takes as following by construction. A stricter
   reader could keep line 14 ARGUED. Lines 13 and 16 rest on 30-digit floating point and grid checks, not interval
   arithmetic; line 17 is PROVED "to leading order" with a parenthesis that is right only in a corrected form. The
   decision that line 15 is not covered is by absence of a sentence; the construction is elementary and a one-page
   referee pass would settle it. One reader made all five decisions.
2. **One reader, one referee per round-19 source.** Rows X2, G45 and the addenda to Z37, D10, P58 were condensed by
   one reader from the RESULT, MAP_ROW and REFEREE files of five lanes, each with author plus one referee; second
   referees are not on file. Two of the five lanes did not hold as written. Row P58 is now very long (three lanes,
   two rounds, measured statements that depend on mode count and height); a reader who takes a number from it without
   its qualifier would misread it. The STRATEGY items 59, 60, 61, 63 are entered under the heading "Families closed by
   this rule" on one refereed obstruction each; the items say so, the heading does not.
3. **What the comparison does and does not show.** The top 60 is identical in keys, scores and ranks, and the scored
   count is unchanged, but the identity of the 8,426 scored candidates as a set was checked on the top 60 only (the
   before run has no full dump). The as-found scoreboard was overwritten before it was copied (section 2.6); its
   values are quoted from printed text. The new control codes change the generator's output only in the field
   `rowsChecked`: no weight, score or rejection rule reads them, so "generate.py can use them" is true in that sense
   only. The decision sheet's costs are estimates with no trial run, and its statements about round-20 lanes come from
   files on disk at about 08:45 UTC that are not in the round log.

Smaller limits: the 23 sentences are in a register and in the map, not as notes in the round-18 lane files; the map
has no row for the census lane; G_+ has no engine code (HQ3 is its integer-frequency form); `engine/nodes/` was not
edited, so the graph nodes of the two closed device types keep status conjectural (referee E3 of the previous record
lane stands); `merge_outcomes.py` was not run; the 30 outcome files without a record in `outcomes.json` noted by the
previous record lane were not examined.

## 6. Files edited or written

| file | change | script | previous copy |
|---|---|---|---|
| `push/OBSTRUCTION_MAP.md` | rows X2, G45; control rows HQ3, HQ4; HQ2, X1, G44, P58, D10, Z37, Q31, O1 edited; BLS note; section 6 item 23; section 7 +8 rows; row count; update paragraph | `L/apply_map.py` | `L/before/OBSTRUCTION_MAP.md` |
| `push/c19-u4-joint-prime-phase-quadratic-dp-zeros/RESULT.md`, `lanes.jsonl` | seven notes; claim line | `L/apply_corrections.py` | `L/before/lanefiles/` |
| `push/c19-rs-real-zero-completion-band-server/RESULT.md` | five notes | same | same |
| `campaign/lanes.jsonl` | line 167, field `claim`; one line appended (line 173) | same; `L/mk_lanes_line.py` | `L/before/lanes.jsonl` |
| `engine/curated/controls.json` | HQ2, HQ3, HQ4 | `L/edit_engine.py` | `L/before/controls.json` |
| `engine/build_graph.py` | `CONTROL_CODE_RE` | same | `L/before/build_graph.py`, `engine/scratch/build_graph.pre-c20-repair.py` |
| `engine/curated/mk_devices.py`, `devices.json` | block R19 (band device, `exact-relation-rigidity` closedOn, three cells, one pending entry name); header line; scoped assertion | same | `L/before/`, `engine/scratch/mk_devices.pre-c20-repair.py` |
| `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json` | regenerated by the engine scripts | - | `L/before/CANDIDATES.json` |
| `engine/ENGINE_LOG.md` | one section appended | by hand | `L/before/ENGINE_LOG.md` |
| `campaign/STRATEGY.md` | section 3.1 items 59 to 65, notes on 54 to 57, heading range, one bracket; section 4.0 paragraph; one change-log bullet | `L/apply_campaign.py` | `L/before/STRATEGY.md` |
| `campaign/CORRECTIONS_R18.md` | new | same | - |
| `campaign/CHECKPOINT_R20_DECISION_SHEET.md` | new | by hand | - |
| `campaign/SCOREBOARD.md`, `campaign/scoreboard.json` | rewritten by `scoreboard.py` | - | `L/before/` (the rerun before edits) |
| `L/STATEMENT_O_v5.md` | new | `L/build_statement_o_v5.py` | version 4 is not edited |

Not edited: `campaign/ROUND_LOG.md`, `campaign/CHECKPOINT_R20_INPUT.md`, `engine/outcomes/`, `engine/outcomes.json`,
`engine/closed_families.json`, `engine/generate.py`, `engine/nodes/`, `engine/merge_outcomes.py` (not run), any
earlier Statement O file, any round-18 lane file, anything outside `engine/`, `campaign/`, `push/`. One slip besides
the scoreboard copy: the first run of `mk_lanes_line.py` stopped on its own guard (the slug already occurred inside the
corrected claim of line 167), so the first "final" rerun ran without the lane line; the guard was fixed, the line
appended and the scoreboard rerun. `generate.py --node map-open-23` overwrote `engine/CANDIDATES.json` for a few
seconds; the standard file was copied back and compared byte for byte with `L/final/CANDIDATES.json`.

Files in `L/`: seven scripts for the edits and the comparison, four check scripts, `STATEMENT_O_v5.md`,
`statement_o_v4_v5_diff.txt`, `compare_before_after.md/.json`, `before/`, `after/`, `final/`, `logs/`,
`lanes_line.json`, `lanes.jsonl`, `REFEREE.md` (not written by the lane), `REFEREE_BRIEF.txt` (the brief given to the
referee process), `apply_referee_corrections.py`.

## 7. Line in `campaign/lanes.jsonl`

Appended as line 173 (copy `L/lanes.jsonl`; readable form `L/lanes_line.json`): round 20, slug
`c20-repair-owed-record-r19-statement-o-v5`, kind repair, verdict partial-result, aboutZeros false, r1 to r4 false,
score 0, nodes []. The line was appended with referees 0; after the referee report it was updated to referees 1,
refereeHolds true, with fields `errors` and `surviving` from the report, and the scoreboard was rerun.

## 8. Owed to the next record lane

- Second-referee results for rows X2, G45 and the round-19 addenda of Z37, D10, P58; set cell U6 (c) to closed in
  `mk_devices.py` block R19 if the second file holds; reverse a state if a closure breaks.
- Map rows and device or cell states for round 20 (the second-order mixed form of U4; U6 (a), (b); Euler-shape
  rigidity; the certified conversions for Statement O lines 2 and 4; Theorem D).
- Statement O: acceptance of version 5; a referee pass on the NR-q construction for line 15; lines for the records of
  rounds 17 to 19 (candidates in the decision sheet).
- The enclosed tail bound for Theorem A; a second referee for `c19-rs-real-zero-completion-band-server`.

## 9. Referee report and corrections entered

`L/REFEREE.md`: independent pass by a separate process (own scripts under `/tmp/ref_c20repair/`, three mpmath checks
through `scripts/memcap.sh 8`; it did not run the engine scripts and wrote only its report). Verdict: **holds with
corrections**; every count recomputed and in agreement; the five decisions on Statement O lines 13 to 17 supported
(line 14 "partly ... agree, in the restricted form version 5 writes"; line 15 "ARGUED stays"); the Liouville correction
and the Lemma P repair confirmed numerically; flags R1 to R4 false. Its nine corrections were entered by
`L/apply_referee_corrections.py` (log `L/logs/apply_referee_corrections.log`); none changes a state, a label decision or
a count:

| # | finding | what was changed |
|---|---|---|
| E1 | "four refereed lanes" for the band device is the figure of `ROUND_LOG.md`; the files this lane names are three lanes | device name in `mk_devices.py` / `devices.json`, row P58, STRATEGY item 60 and the cells paragraph, the decision sheet: "three refereed lanes of the device type", with the round log's figure quoted as unexplained |
| E2 | row Z37: "14 of 14" and 5.7e6 are the lane's figures; the referee's correction 8 (heuristic error bar) was missing | row Z37 says which figures the referee confirmed and that the error bar is heuristic |
| E3 | row G45: "THIN at p q", "T-NR at q^2 p (c > 2)", the K2 formula, "the first such step on file" are the lane's or the round log's, not the referee's | attribution sentence in the status cell |
| E4 | row D10: "exactly when" is the lane's; the referee re-derived one direction | sentence (iv) reworded |
| E5 | row P58: the enclosure of lambda_min(T_sigma) holds "in every zeta cell" | row P58, section 7 row, the lane note, the device evidence |
| E6 | row X2: device rows 12 and 18 are ARGUED and were not marked inline | two inline labels |
| E7 | quotations in Statement O version 5 match after removal of markup | header sentence of version 5 (file rebuilt) |
| E8 | register: quotation boundary of sentence 15; source of sentence 23; place of the second display of sentence 5; "in this form" | register notes and entries; the second display added to row P58 |
| E9 | the pending-entry name edit in `devices.json` was not declared | sections 2.3 and 6 of this file |

After these edits `mk_devices.py`, `build_graph.py`, `generate.py --top 60` and `scoreboard.py` were rerun through
`scripts/memcap.sh 8` (logs `L/logs/final2_*.log`, `final3_scoreboard.log`): graph counts, generated / scored /
rejected and all 60 top entries are identical to the run before the corrections; the scoreboard differs only by
`lanesRefereed` 162 -> 163 (the lane line with its referee count) and the timestamp. `L/final/` and
`L/compare_before_after.md` hold the last state. Limits the referee states for its own report: no before copy of the
graph; rows X1, O1, G44, Q31 and section 7 read as differences only; Montgomery-Vaughan's draft not opened; numeric
checks in floating point; lines 13 and 17 ruled by reading, not by a new derivation.
