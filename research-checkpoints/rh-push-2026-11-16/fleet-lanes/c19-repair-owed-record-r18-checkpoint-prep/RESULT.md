# c19-repair-owed-record-r18-checkpoint-prep: RESULT

Campaign round 19, kind: repair (lane B, record). Date 2026-11-20 UTC (2026-11-19 local). No attack.
Nothing in this file or in any edit of this lane is a statement about zeros of zeta. The headline cannot move and does
not: 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4). No computation was started on the server (one read of
`rhstatus`); every local run went through `scripts/memcap.sh 8`. No independent referee has read this lane. Labels of
mathematics quoted from other lanes are those of their referee files; this lane proves nothing and measures nothing
except engine counts.

Paths are relative to `tmp/research-2026-11-16/`. Lane directory: `push/c19-repair-owed-record-r18-checkpoint-prep/`
(`L/` below).

## 0. Verdict

**Partial result (record lane).** Every item of the assignment is done. The limits: each round-18 closure entered
here rests on one referee per lane; the rows were condensed by one reader; the generator's list did not change in
content, because it had already lost the two proposed nodes before this lane ran.

- Device table: `exact-relation-rigidity` and `tz-one-sided-completion-bound-band` open -> closed on the referee
  files of their round-18 lanes (one referee per lane; the count is written into the entry). 55 closed, 1 floored,
  **0 open** (control check of the assignment: passed; no round-19 lane had proposed a device type when this was
  written).
- Map: 211 -> 215 labelled rows (X1, P58, G44, Z37) and control row HQ2 in section 2; Q31 rewritten for two
  referees; P57, D8 (vi), G33 at two referees with the second-pass corrections; D10 addendum with the parity clause
  restated for b = u (u - 1) g; S12b, Q30, P45 marked superseded by Q31; eight rows in section 7.
- Correction notes in three lane files: display (A); Proposition D (c); the parity paragraph and note.
- STRATEGY: section 3.1 items 48 to 58; section 4.0 paragraph "State of the cells after round 18". No rule, weight
  or allocation changed.
- Reruns and comparison, entry by entry: `L/compare_before_after.md`. `merge_outcomes.py` was not run.
- Checkpoint input: `campaign/CHECKPOINT_R20_INPUT.md`.

## 1. Plan

1. Decisive first step: rerun `engine/build_graph.py`, `engine/generate.py --top 60`, `campaign/scoreboard.py` before
   any edit, keep logs and copies (`L/logs/before_*.log`, `L/before/`), so that every later difference has a
   reference.
2. Enter the owed list of round 18 (`campaign/ROUND_LOG.md`, "Round 18 results", line "Owed"), each row worded after
   the lane's REFEREE.md and not after the lane's claim line.
3. Device states and cell evidence in `engine/curated/mk_devices.py`; regenerate `devices.json`.
4. STRATEGY sections 3.1 and 4.0 (record edits only).
5. Rerun the three scripts, compare entry by entry, then add this lane's line and rerun once more.
6. Write the checkpoint input.

All edits are made by scripts kept in `L/` (anchored replacements; each anchor must match exactly once), so each can
be read and reversed from `L/before/`.

## 2. Work

### 2.1 Device states (`engine/curated/mk_devices.py`, block `R18`; script `L/edit_engine.py`)

| device type | before | after | referee files | count |
|---|---|---|---|---|
| `exact-relation-rigidity` | open, "proposed, untested" | closed | `push/c18-exact-relation-rigidity-klein-spinor/REFEREE.md` (holds with corrections E1 to E5) | one referee |
| `tz-one-sided-completion-bound-band` | open, "proposed, untested" | closed | `push/c18-tz-one-sided-bound-fe-reserve-bridge/REFEREE.md` (holds, E1 to E7); `push/c18-tz-band-completion-controls-server/REFEREE.md` (holds after E1, E2) | one referee per lane, two lanes |

Each entry carries a field `closedOn` (round, referee count 1, files, map row) and the sentence that a second referee
is owed by `c19-referee-r18-independent-sources`; the block says how to set a state back to open if a second referee
breaks a closure. No file `REFEREE2.md` existed in any round-18 lane directory when this lane finished. Which entry
condition each closure fails is written into the evidence: for the band type E3 (the step with the completion must
read the coefficients; the identity holds for every series with a_1 = 1), E4 (ZQ passes) and E2 (theta' = 1 is the
target); for the rigidity type E3 (no relation on the reading list has a step that uses multiplicativity).

Cells (same block; states unchanged, evidence extended): U4 (residual (iv) closed for positivity-derived reads; the
joint / quadratic residual stays a cell), U6 (c) (cubic half closed as a known array; the double-cover half stays a
cell), U6 (g) (round-18 addendum), U3, U6 (e), U6 (f) (now two referee passes). Cells 6 / 1 / 4 before and after.
`engine/nodes/nodes-22.json`: name and statement of the two device nodes updated; tags, type and status untouched.

### 2.2 Map rows (`push/OBSTRUCTION_MAP.md`; script `L/apply_map.py`; previous file `L/before/OBSTRUCTION_MAP.md`)

| owed item | where entered | labels carried | referees |
|---|---|---|---|
| X1 | new row X1, section 3.9, after D10 | PROVED (TN1, HQ1, HQ2, Lemma Q, Proposition F, Proposition D (a), (b)); CLASSICAL after the repair (D (c), right half-strip); OPEN (D (d)); "by convention" for ZQ, NR-q, Proposition W at multiplicativity (E2); pole order (E3); Lemma Q counts and does not place (E4); Knopp 1994 (E5) | 1; second owed |
| control HQ2 | section 2 table, after NR-q (table now 14 controls) | has / lacks / use as proposed by the lane with the referee's E3 and E5; referee's numbers at q = 7, eps = 0.2 | 1 |
| the tz row of lane 2, RESULT section 9 | new row P58, after P57 | PROVED (Theorem A with the constant -u), PROVED in the lattice model (Proposition Z, a sufficient bound), CLASSICAL plus ARGUED (Lemma R), ARGUED (other control rows); the fraction "27 to 35 percent" (E6) in place of the lane's "35 to 40"; the factor 2 of the pole bound (E5); "in the lattice model" (E7). The surviving claim of the server lane is entered in the same row: MEASURED, signs certified relative to a hand-derived radius, 96 modes, with the referee's mode-count table | 1 per lane |
| U4 (iv) | new row G44, after G43 (the lane wrote "G42 or the next free label") | PROVED (identity E, (C-F), Lemma GL with (b) as corrected, Theorem T, Lemma S with the repair, Lemma V), MEASURED (tables), ARGUED (height ceiling); E1 to E7 carried | 1; second owed |
| Z24 of `MAP_ROW.md` | new row **Z37**, after Z36: the label Z24 is taken (referee correction 5) | CLASSICAL / PROVED relative to a recalled criterion / MEASURED / OPEN; the six corrections carried (kappa 0.97 to 0.99, not resolved; the cubic twin is theta data; three statements, not four; (K3) not yet a defined statement) | 1 |
| Q31 with two referees | row Q31: bracket replaced; form domain C_c^infinity; W4c and W5c; Remark K for the unwindowed device only; the zeta(s+a) zeta(s-a) cell from the run on its own configuration (with the referee's C2 "at every tested a" and C4 junction note); DH "not established"; sources at secondary level; the pointer to row P58. Rows S12b, Q30, P45: one sentence each, "superseded by Q31" | three labels to ARGUED as the second referee rules | 2 (and one referee on the second pass) |
| referee counts of round-17 lanes | rows P57 (W1, W2), D8 clause (vi) (C1: b = D), G33 (Epstein reading; off-line zeros of the Epstein zeta functions as Newton roots) | no label breaks | 2 each |
| display (A) | row P58 and section 7; correction notes in `push/c18-tz-one-sided-bound-fe-reserve-bridge/RESULT.md` at the display and at step (b) | the constant is -u; no c_0, no log abs(a_P) | |
| Proposition D (c) | row X1 and section 7; correction note in `push/c18-exact-relation-rigidity-klein-spinor/RESULT.md` after part (c) | repaired witnesses f = 1 + 2^-s/4 + 3^-s/4 and f = 2; CLASSICAL on the right half-strip, OPEN in the functional-equation class | |
| c17 parity clause with b = u (u - 1) g | row D10, round-18 addendum (bold sentence), status and source cells; section 7; two correction notes in `push/c18-d10-inertia-law-theorem-t-lemma-d/RESULT.md` | exact instances (2, 1), (1, 2), (16, 1), (15, 2); "instances, not a theorem in a" | 1 |

Section 7: eight rows (referee corrections of round-18 lanes 1 to 6, of `c18-referee-r17-independent-sources`, and
E1 to E5 of the referee of the previous record lane). Row-count line and a fifteenth update paragraph. Checks after
the edit (in the script): 215 distinct row labels plus the control label HQ2, no duplicate; every new or edited row
has six cells, the control row five; `build_graph.py` parses 251 rows (247 before).

Correction notes in lane files (`L/apply_corrections.py`; previous files `L/before/lanefiles/`): the original
sentence stays and a note beginning "[Correction entered 2026-11-20 by lane c19-repair-owed-record-r18-checkpoint-prep"
follows it. Five notes in three files.

### 2.3 STRATEGY (`campaign/STRATEGY.md`; script `L/apply_campaign.py`; previous file `L/before/STRATEGY.md`)

- Section 3.1: items 48 to 53 (round 17: U3 as an inequality; U6 (e); U6 (f); window law; U8 on DU; U6 (g) second
  and third lanes) and 54 to 58 (round 18: the two device types; U4 (iv); U6 (c) cubic half; one item for the referee
  and control records). Each item states its referee count and its state. Items 53 and 58 are not closures. Items
  54, 56, 57 rest on one refereed obstruction each; the item text says so. One bracket in the "tried, not closed"
  paragraph. The heading range is extended.
- Section 4.0: paragraph "State of the cells after round 18" in the order of the cell table. Cells without a passing
  control on file: the joint / quadratic residual of U4 and the double-cover half of U6 (c).
- Section 5: one record-edit bullet.

### 2.4 Reruns and comparison (`L/compare_before_after.md`, `.json`; script `L/compare.py`)

Three runs of the three scripts: before any edit; after the map, device and node edits; after this lane's line in
`campaign/lanes.jsonl`. The comparison file lists every entry of the top 60 before with its fate, every entry of the
top 60 after with its origin, every rejection reason whose count changed, every entry of `scoreboard.json` in four
columns, and every device type and cell.

| quantity | before (rerun) | after | cause |
|---|---|---|---|
| graph: nodes / live / rows / edges | 1,742 / 976 / 247 / 9,192 | 1,746 / 976 / 251 / 9,211 | four row nodes; control-defeats 889 -> 907, obstructs 275 -> 276 |
| device nodes closed / floored / open | 69 / 6 / 2 | 71 / 6 / 0 | the two types |
| crossing pool | 8 | 6 | the two nodes leave it |
| generated / scored | 44,431 / 8,170 | 38,340 / 8,426 | candidates on a proposed node are no longer generated |
| rejected "combination closed in outcomes.json" | 10,526 | 3,806 | see below |
| top 60: open device / floored only / closed device / cell member | 0 / 60 / 0 / 1 | 0 / 60 / 0 / 1 | none |
| entries on a proposed node | 0 | 0 | none |
| rank 1 | `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural`, 10.25 | the same | none |
| lowest score in the list | -0.02 | 0.29 | tail exchange |
| keys in common | | 56 of 60, all 56 with the same score | |

- The top 60 had 0 entries on an open device **before** this lane's edit, not 24. A replica of the old run with a
  full dump (old graph, same outcome file) shows 0 scored candidates containing a proposed node: the learn step of
  round 18 wrote outcome records whose `nodes` field names the proposed node, and the generator rejects every
  candidate containing a combination closed in `outcomes.json`. The figure "open device 0 -> 24" of the previous
  record lane was therefore already void when round 19 was planned (the round-19 planner text "no open device node
  exists" describes the list, not the device table). After the edit the device table and the outcome records agree.
- Tail exchange: ranks 56, 58, 59, 60 of the old list (2.00, 0.09, 0.04, -0.02) are still scored with unchanged
  scores and are displaced by `lean-cg-covering-identity` x `weil-small-support-lean` x `map-open-4` (2.08),
  `meansquare-pointwise-wall` x `seven-eighths-abscissa-formula` (1.25), `zv-polynomial-heat-coefficients` x
  `connes-adelic-truncated-trace` x `map-open-4` (0.30), `zero-ode-ht` x `mixed-group-rigid-profile` x `map-open-4`
  (0.29). The second was scored before (1.25) and cut by a selection cap; the other three were not scored before.
  All four stand on the floored 7/8 type and are not explore slots.
- Scoreboard, entries changed by the edits: `C_coverage.nodes` 1,742 -> 1,746; `C_coverage.nodesMarkedClosed`
  601 -> 605 (the four row nodes); the timestamp. Changed by the lane line: `lanesRun` 164 -> 165; score histogram
  at 0: 162 -> 163; one history entry for round 19. Unchanged: headline 1 of 4, hold rate 0.922 (154 refereed),
  three-referee statements 2 (0 about zeros), families 126,756 / closed 4,004 / tried-not-closed 1,082, outcome
  records 194, lemmas decided 136, proved claims broken 11. The file as found (1,737 nodes, 120,295 families) had
  been written before the graph was last rebuilt; its differences from the rerun are not caused by this lane.
- `merge_outcomes.py`: not run. Nothing of this lane needs it (no outcome record written; the eight round-18 records
  are in `outcomes.json`). Observation only: 30 files in `engine/outcomes/` (the screening-arm lanes `s1-*`, `s2-*`,
  `s3-*`) have no record with the same slug in `outcomes.json`; whether that is intended was not examined.

### 2.5 Checkpoint input (`campaign/CHECKPOINT_R20_INPUT.md`, new)

- Section 1: the twelve lines of Statement O (version 4) labelled MEASURED or ARGUED (1, 2, 4, 7, 10, 11, 12, 13 to
  17) and line 5 (PROVED relative), each with what the label lacks, whether it needs a second referee or a certified
  conversion, referee files written since version 4, and an estimated server cost.
  - Lines 13 to 17: a second-referee file postdating version 4 exists for each
    (`push/c16-referee-r15-j1prime-u8-screening/REFEREE2_*.md`; for line 16 also the re-derivation of D_+ >= 0 by the
    referee of the round-18 U4 lane). The relabel is a decision of the checkpoint; not made here.
  - Certified computations needed: line 2 (independent rerun of the DH kernel and Pick-order certificates) and line 4
    (ball enclosure of one off-line zero of the backward-heat family): two default-size jobs, estimate 8 to 16
    core-hours in total, below 8 GB each.
  - Second referee on a source lane only: lines 1, 12 (Theorem D of the headline lane), 4 (escape law).
  - "PROVED relative to" at most (literature source or hypothesis): lines 1, 5, 7 (short-interval count; Coleman
    1990), 10 (H_W).
- Section 2: the cells in the order of section 4.0 with state, closed part, remainder, passing control, candidate,
  round-19 lane, and cost estimates for the specified cell work.
- Section 3: what the round-19 lanes can still change. Section 4: limits of the file.

## 3. Controls

This lane makes no argument, so no control is run against a mechanism. What it records and checks:

- Control check of the assignment: after the edits `devices.json` has 0 open device types (asserted in
  `mk_devices.py`, block R18: the script fails if an open type remains), and 0 of the top 60 stand on an open device.
- New control HQ2 is entered in the map with the referee's pole-order restriction. It is not in
  `engine/curated/controls.json` (not among the files this lane may edit); the graph has 23 control nodes before and
  after.
- For each new row the defeated-by cell is the referee's reading: P58 has ZQ passing below the Nyquist band (lattice
  model; measured at eta = 0.05), E_a passing for small a on its own configuration, DH and chains passing on 96 modes
  at low theta, and every series with a_1 = 1 satisfying the identity; G44 has E_a and the G_+ lift passing steps
  (1) to (3) and the failures of T-NR, NR-q, Liouville, HEAT, DH each at the sign of one coefficient; X1 has HQ2 and
  TN1 as twins and DH failing multiplicativity; Z37 records that the zeta controls are not formulable on the cover
  (a gap, not a pass).
- Engine self-checks: no duplicate row label; the assertion "no cell node among device nodes" passes; the before
  list was reproduced by a replica run (same 60 keys in the same order) before it was used for attribution.

## 4. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | record lane; no argument. The rows entered say the opposite for their lanes: Theorem A of P58 holds for every Dirichlet series with a_1 = 1; Lemma GL of G44 is atom by atom; X1 shows multiplicativity replaces no clause |
| R2 (height-uniform, every window) | false | no statement at any height |
| R3 (every control fails at a named step) | false | no mechanism; each row entered lists passing controls (ZQ, E_a, HQ2, G_+ lift, symmetric quartets) |
| R4 (reaches the critical line) | false | nothing is carried anywhere; both device types that were entered as questions about R4 are closed |

Score 0. No statement about zeros of zeta.

## 5. Three weakest steps

1. **One reader, one referee per round-18 source, no referee of this lane.** Rows X1, P58, G44, Z37, the D10
   addendum and the two device closures were condensed by one reader from the RESULT and REFEREE files of six lanes,
   each of which has author plus one referee. A wrong condensation would stand in the map, and a second referee
   (`c19-referee-r18-independent-sources`, not filed) could break a closure; the device entries say how to reverse
   it. Row P58 joins two lanes in one row, including measured statements that depend on the number of modes; a reader
   who takes a pass rate from it without the mode count would misread it.
2. **The checkpoint input rests on file names and estimates.** "A second-referee file exists" for lines 13 to 17 was
   established from the headers and ruling tables of the files, not by checking each closing step against its line;
   the cost column is an estimate from the sizes of earlier jobs, with no trial run; the U6 (c) run is not sized
   (the class count is not computed).
3. **The comparison explains the list only down to the rejection class.** The before run had no full dump; the
   attribution "rejected by the outcome records" comes from a replica of the old run in a scratch directory, and for
   three of the four entering tail entries the reason they were not scored before was not determined. Section 3.1
   items 54, 56, 57 are entered as "closed for the stated read" on one refereed obstruction, where the rule of
   section 3 counts two; the items say so, but the list heading still reads "families closed by this rule".

Smaller limits: HQ2 has no engine control code; Statement O was not rewritten (no version 5); the correction notes in
lane files are notes, the original sentences remain next to them; `merge_outcomes.py` was not run; the tags of the
two closed device nodes were left as entered by the previous lane.

## 6. Files edited or written

| file | change | script | previous copy |
|---|---|---|---|
| `push/OBSTRUCTION_MAP.md` | rows X1, P58, G44, Z37; control row HQ2; Q31, S12b, Q30, P45, P57, D8, G33, D10 edited; section 7 +8 rows; row count; update paragraph | `L/apply_map.py` | `L/before/OBSTRUCTION_MAP.md` |
| `push/c18-tz-one-sided-bound-fe-reserve-bridge/RESULT.md` | two correction notes (display (A), step (b)) | `L/apply_corrections.py` | `L/before/lanefiles/` |
| `push/c18-exact-relation-rigidity-klein-spinor/RESULT.md` | one correction note (Proposition D (c)) | same | same |
| `push/c18-d10-inertia-law-theorem-t-lemma-d/RESULT.md` | two correction notes (parity paragraph; note of section 9) | same | same |
| `engine/curated/mk_devices.py`, `engine/curated/devices.json` | block `R18`; header line | `L/edit_engine.py` | `L/before/mk_devices.py`, `L/before/devices.json`, `engine/scratch/mk_devices.pre-c19-repair.py` |
| `engine/nodes/nodes-22.json` | name, statement, source of the two device nodes | same | `L/before/nodes/nodes-22.json` |
| `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json` | regenerated by the engine scripts | - | `L/before/CANDIDATES.json` |
| `engine/ENGINE_LOG.md` | one section appended | by hand | `L/before/ENGINE_LOG.md` |
| `campaign/STRATEGY.md` | section 3.1 items 48 to 58 and heading range; one bracket; section 4.0 paragraph; one bullet in section 5 | `L/apply_campaign.py` | `L/before/STRATEGY.md` |
| `campaign/CHECKPOINT_R20_INPUT.md` | new | by hand | - |
| `campaign/SCOREBOARD.md`, `campaign/scoreboard.json` | rewritten by `scoreboard.py` | - | `L/before/` |
| `campaign/lanes.jsonl` | one line appended | - | `L/before/lanes.jsonl` |

Not edited: `campaign/ROUND_LOG.md`, `engine/outcomes/`, `engine/outcomes.json`, `engine/closed_families.json`,
`engine/curated/controls.json`, `engine/build_graph.py`, `engine/generate.py`, any Statement O file, anything outside
`engine/`, `campaign/`, `push/`. One slip and its repair: the first pass wrote a wrong slug for the round-19 U4 lane
in seven places (map, STRATEGY, checkpoint input, `mk_devices.py`); it was replaced by
`c19-u4-joint-prime-phase-quadratic-dp-zeros` in the files and in the scripts, and `mk_devices.py` and the three
engine scripts were rerun afterwards. Files in `L/`: the five scripts, `compare_before_after.md/.json`, `before/`,
`after/`, `final/`, `logs/` (twelve logs), `lanes_line.json`, `lanes.jsonl`.

## 7. Line in `campaign/lanes.jsonl`

Appended as the last line (copy `L/lanes.jsonl`; readable form `L/lanes_line.json`): round 19, slug
`c19-repair-owed-record-r18-checkpoint-prep`, kind repair, verdict partial-result, aboutZeros false, referees 0,
r1 to r4 false, score 0, nodes [].

## 8. Owed to the next record lane

- Second-referee results for rows X1, P58, G44, Z37 and the D10 addendum; reverse a device state if a closure breaks.
- An engine control code for HQ2 in `engine/curated/controls.json`, with the outcome of the HQ2 screen.
- Statement O version 5 (the five relabels of lines 13 to 17 decided against the files; candidate lines for the
  round-17 and round-18 records).
- Montgomery's Ten Lectures for the factor 2 in Turan's theorem; a referee for W5c beyond the one on file.
- An independent referee for this lane.
