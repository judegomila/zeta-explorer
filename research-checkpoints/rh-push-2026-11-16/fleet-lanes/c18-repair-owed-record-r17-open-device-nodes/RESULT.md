# c18-repair-owed-record-r17-open-device-nodes: RESULT

Campaign round 18, kind: repair (lane B, record). Date 2026-11-19 (file times in UTC run into 2026-11-20). No attack.
Nothing in this file or in any edit of this lane is a statement about zeros of zeta. The headline cannot move and does
not: 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4). No computation on the server; every local run went through
`scripts/memcap.sh 8`. No independent referee has read this lane. Labels of mathematics quoted from other lanes are
those of their referee files; this lane proves nothing and measures nothing except engine counts.

Paths are relative to `tmp/research-2026-11-16/`. Lane directory: `push/c18-repair-owed-record-r17-open-device-nodes/`
(`L/` below).

## 0. Verdict

**Partial result (record lane).** Every item of the assignment is done; the limits are that each new or edited map row
rests on one referee, that the generator change produces a list whose content is fixed by the tags given to the two new
nodes, and that one of the two proposed device types was reported closed by a sibling lane (0 referees) while this lane
ran.

- Map: 208 -> 211 labelled rows (P57, G43, Q31); rows D8, G33, D10, G42, the BLS note of section 2 edited; rows S12b,
  Q30, P45 carry a cross-reference to Q31 and are not replaced; eight rows added in section 7.
- The nine corrected sentences of round 16 that still stood in lane files are entered in those files (original kept,
  bracketed correction after it). The c16 control-table entry "ZQ (rational form) fails at S3/S4" is corrected in place.
- Cells: U3 read as an inequality, U6 (e), U6 (f) closed (one referee each); U6 (g) tried-not-closed; U8 stays a cell
  with the DU result in its evidence. Cells 9 / 1 / 1 -> 6 / 1 / 4 (cell / tried-not-closed / closed).
- Outcome records: all eight round-17 lanes already had one in `engine/outcomes/`; none was missing, none written.
- Generator: two proposed, untested device types entered as open nodes with entry conditions and the controls that
  must fail. Top 60 with an open device 0 -> 24 (12 per proposed node), with a floored device only 60 -> 36.
- Scoreboard rerun by `scoreboard.py`; planner note `campaign/PLANNER_NOTE_R19.md`.

## 1. Plan

1. Rerun `engine/build_graph.py`, `engine/generate.py --top 60`, `campaign/scoreboard.py` before any edit; keep logs
   and copies (`L/logs/before_*.log`, `L/before/`).
2. Part 1: the owed list of round 17 (`campaign/ROUND_LOG.md`, "Round 17 results", line "Owed"), each row worded after
   the lane's REFEREE.md, not after the lane's own claim line.
3. Part 2: two proposed device types as open nodes; no cell node re-entered as a device; before/after comparison.
4. Part 3: `scoreboard.py`; planner note for round 19.

All edits are made by scripts kept in `L/` (anchored replacements; each anchor must match exactly once), so each can be
read and reversed from `L/before/`.

## 2. Work, part 1: the owed list of round 17

### 2.1 Map rows (`push/OBSTRUCTION_MAP.md`; script `L/apply_map.py`; previous file `L/before/OBSTRUCTION_MAP.md`)

| owed item | where entered | labels carried | referees |
|---|---|---|---|
| D8 (vi) for cell U6 (e) | row D8, clause (vi) in the mechanism cell; status, defeated-by and lane cells extended | PROVED (Lemmas E, K, T, S (a), (c), (d)); CLASSICAL (Lemma G, Kakutani; referee E3); scope "algebraic Hecke algebra and absolutely summable elements" (E2); adjoint as corrected (E1); conjugation form of the twin (E4) | 1; second owed |
| G33 wording for cell U6 (f) | row G33, last clause replaced: norm, Jensen gap, discriminant; "closed for seven forms"; residual degree >= 3 "not excluded", ARGUED | PROVED (norm identity, Jensen gap); CLASSICAL (discriminant sign; referee correction 1); E_a row "D = 0 (degenerate)" | 1; second owed |
| U3 as an inequality, target-level, with the NR-q note | new row P57 | PROVED (defect term 0.0485883, Proposition W, Lemma LR, Proposition TL); RELATIVE to Statement O; MEASURED (float64, symmetrised model); ARGUED (Phi_1); referee E1 to E5 carried (square-root law belongs to birth on the line only; ratio column is multiplicativity plus bounds; only z = +-1 has the exact functional equation) | 1; second owed |
| U8 row of c17-u8 RESULT section 8 | new row G43 | MEASURED, finite; the referee's completed counts are the ones entered (4,360,000 family-nodes, 1,923 T-train, 0 hold-out survivors, 0 undecided, five two-class passes all identifications); float64 exclusions named as float64 (11,915 ball decisions) | 1 (with completion run) |
| window-law row | new row Q31, heading marked **one referee**; S12b, Q30, P45 each get one sentence pointing to Q31 and are kept | classical frame (Weil; referee E6); PROVED in the lattice model; relative to Turan (secondary source); MEASURED; W4, W5 ARGUED (E4, E5); the lane's control rows for E_a and DH replaced by the referee's (E1, E2) | 1; `c18-referee-r17-independent-sources` had not filed when this lane finished |
| D10 revision | row D10: revision paragraph (Miller source; Lemma M; Theorem T; search counts; inertia pattern "at most kappa, equal in 318 of 320"; **ZQ in rational form passes**; **DH-base note**; backward heat; method note); status, defeated-by, lane cells; section 2 note on BLS in rank 2 | PROVED (Lemma M identity, conditional apex reduction; Theorem T in the rational model); MEASURED with certificate; backward heat MEASURED non-rigorous | 1 on the round-17 lane; the round-16 lane now has two (REFEREE2.md) |
| the c16 "ZQ fails" entry | map section 7 (row 1 of the eight); row D10; and in place in `push/c16-u6g-scattering-fe-rank2-bridge-stage-a/RESULT.md` section 5 (`L/apply_zq_c16.py`) | wrong as entered (ARGUED) -> passes, MEASURED, 3,360 certified matrices | |
| G42 restriction (E2 of the referee of the previous record lane) | row G42: the count "394 of 528" is dropped with the reason; "sup R2 1.04 to 1.46" scoped to N <= 8; "R2 <= M/L is a validity statement"; `campaign/STRATEGY.md` item 47 | no label change | |

Section 7 of the map: eight rows (the c16 ZQ entry; the referee corrections of the round-17 lanes rank-2, U6 (e),
U6 (f), U3, window law, U8; E1 and E2 of the referee of `c17-repair-owed-record-r16-cell-nodes`). Row-count line and
a fourteenth update paragraph. Check after the edit: 211 distinct row labels, each new or edited row has six cells,
`build_graph.py` parses 247 rows (244 before).

### 2.2 The nine sentence corrections (`L/apply_corrections.py`; previous files `L/before/lanefiles/`)

Rows 3 to 11 of `campaign/CORRECTIONS_R16.md`. In each file the false sentence stays and a note beginning
"[Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes" follows with the corrected
sentence of the register.

| register row | file | place |
|---|---|---|
| 3 | `push/c15-u5-window-count-threshold-translate-control/RESULT.md` | verdict item 1, after "does better." |
| 4 | `push/c15-edge-argument-strip-width-hecke-amplified/RESULT.md` | section 3, S4, after "one has tau(p) = 0," |
| 5, 6 | `push/c15-u7-growing-section-twin-ladder-bridge/RESULT.md` | Q-P paragraph ("T-NR has no Euler product."); R3 line ("unimodular twists and T-NR (c <= 2) pass.") |
| 7, 8 | `push/c15-klein-transport-lemma-w-stage-a-and-e1/RESULT.md` | E_a0 control line; "No control fails at a step ..." sentence |
| 9 | `push/c15-nonhomogeneous-pair-triple-kernel-search/RESULT.md` | one note after the table of section 6 (the old counts stand in four places) |
| 10 | `push/s1-prime-torus-orbit/RESULT.md` | section 2.1, after the variance clause |
| 11 | `push/s1-zero-statistics-gram/RESULT.md` | one note after the main table |

One slip and its repair: the first run put the note of row 9 between two rows of a table; it was moved below the
table by hand (recorded at the end of the script). Not rewritten: repetitions of the same statements elsewhere in the
files (the proposed map row in section 8 of the c15-u7 file), outcome records and `lanes.jsonl` lines that quote
them. `campaign/CORRECTIONS_R16.md` has an update section saying so.

### 2.3 Outcome records and cell states

- `engine/outcomes/`: the eight files `c17-*.json` exist, each with verdict, `referees: 1`, `refereeHolds: true`. None
  written.
- `engine/curated/devices.json` (through `curated/mk_devices.py`, block `R17_CELLS`; script `L/edit_engine.py`):

| cell | state before | state after | basis |
|---|---|---|---|
| U3 (`silent-cell-u3`) | cell | closed (read as an inequality) | row P57; one referee |
| U6 (e) | cell | closed (positivity reads; eigenstate class) | row D8 (vi); one referee |
| U6 (f) | cell | closed (norm, Jensen gap, discriminant) | row G33; one referee |
| U6 (g) | tried-not-closed | tried-not-closed (evidence extended) | row D10 revision; inertia law for zeta open |
| U8 | cell | cell (evidence: DU closed as MEASURED) | row G43; class beyond DU open |
| U4, U6 (c) | cell | cell (evidence names the round-18 lane) | |
| U2-POS, U6 (a), (b), (d) | unchanged | unchanged | |

A closed cell node rejects every candidate that contains it: 277 rejections "closed cell" in the new run.

## 3. Work, part 2: two proposed device types

Reason (ROUND_LOG round 17): after the cells left the device pool the generator had no open device node, all 60
entries stood on the floored 7/8 type and the list could not rank explore slots.

### 3.1 What was added

`engine/curated/devices.json`, key `devices`, two entries with state `open` and the extra fields `status`, `sources`,
`entryConditions`, `controlsThatMustFail`; one node each in `engine/nodes/nodes-22.json`.

**(a) `tz-one-sided-completion-bound-band`: one-sided completion bound in the band 1/2 < theta <= 1.** Status
"proposed, untested". Source: window information law (`c17-window-information-law-ctheta-u5`, bound N(theta), Lemma E;
map row Q31; one referee). Entry conditions:

- E1. One displayed one-sided bound for the band operator T_Z on an interval of length u = theta log(t/2 pi),
  1/2 < theta <= 1, with an explicit completion term (reflected half of the approximate functional equation, or the
  pole term), with its dependence on t.
- E2. Not the exact device above u = log(t/2 pi) at tolerance 0 (the target in a window), not implied by a mean value
  (MV-CAP), not a restatement of verified height.
- E3. The step using the completion term reads the coefficients against the functional-equation reserve; the
  factorisation alone holds for every completely multiplicative chain (Lemma E) and is not that step.
- E4. Run on paper against every control below before any proof attempt; a control passing every step closes the type.
- E5. Uniformity in t is needed for R2, a proved passage from the band to the line for R4; finitely many heights are
  MEASURED support only.

Controls that must fail, each at a named step: DH; E_a (its zero set is a row of spacing 2 pi/log(t/2 pi) and passes
the complete band device for u <= log(t/2 pi) in the lattice model, so it must fail at the completion step); T-NR and
its symmetric form with q -> 1 (Proposition W); ZQ and SG; sign-twisted primes and random sign chains; unimodular
twist; backward heat; NR-q; Beurling; phase-rotated transfer operator; theta^w.

**(b) `exact-relation-rigidity`.** Source: round-17 lanes 1 and 3 with Theorem P. Entry conditions:

- E1. One displayed exact relation that zeta satisfies, on a named class excluding the Proposition W twins by the
  support clause and NR-q by integrality.
- E2. Rigidity form only; "zeros within f(defect), f(0) = 0" is the target (row P57) and does not enter.
- E3. Not an identification already on file (Hamburger; Kaczorowski-Perelli in degree one; Theorem P; Lemma L), and
  one step of the proof uses multiplicativity.
- E4. Not positivity of a state or kernel (conjugation invariance; row D8 (vi)).
- E5. A stated consequence for the zero set; otherwise the result is a map row, not a score.

Controls that must fail: T-NR in the conjugation form and Proposition W; finite DEL and the gauge twins; NR-q (it can
fail through integrality only, which gives R3 for that control and not R1); ZQ and SG; E_a; DH; sign-twisted primes;
unimodular twist; backward heat; Beurling; phase-rotated transfer operator; theta^w; Epstein forms at inert primes
for relations of Hecke type.

**Fact that arrived while this lane ran.** `push/c18-exact-relation-rigidity-klein-spinor/RESULT.md` was filed (author
only, 0 referees): precise obstruction; with the relation "multiplicativity" the branch closes, with a new control
HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s). The status line of type (b) therefore reads "proposed,
untested by a refereed lane; one unrefereed lane ... reports the branch closed for the relation multiplicativity"
(`L/edit_engine2.py`). The state stays `open` because the record lanes change a state on a referee file only.

### 3.2 Rule in `generate.py`

A proposed type is an open device for the R4-device rule and for the weight `deviceOpen` (2), and keeps the rejection
exemption "closed family matched by the device text alone". The three penalty waivers that an open device carries
(reuse of a node of a closed lane; flow-side majority; mean-value majority) are **not** applied to it. The option
`--proposed-waivers` applies them, for comparison. `mk_devices.py` asserts that no cell node is a device node.
`build_graph.py` carries the field `status` into the graph. Weights unchanged.

### 3.3 Before and after (top 60; `L/top60_before_after.md`, `.json`; script `L/compare_top60.py`)

| | before (rerun before any edit) | after | after with `--proposed-waivers` |
|---|---|---|---|
| graph: nodes / live / rows / edges | 1,732 / 974 / 244 / 9,129 | 1,737 / 976 / 247 / 9,189 | same |
| generated / scored | 38,082 / 8,432 | 44,431 / 12,315 | same |
| entries with an open device | 0 | 24 | 24 |
| on `tz-one-sided-completion-bound-band` | - | 12 | 12 |
| on `exact-relation-rigidity` | - | 12 | 12 |
| entries with a floored device only | 60 | 36 | 36 |
| entries with a closed device | 0 | 0 | 0 |
| entries with a cell member | 2 | 2 | 2 |
| lowest score in the list | 0.29 | 2.75 | 2.75 |
| rank 1 | `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural`, 10.25 | same partners x `tz-one-sided-completion-bound-band`, 11.25 | same as after |

- Keys in common before/after: 23 of 60, 22 with the same score. 37 left: 33 are still scored (32 with the same score)
  and are displaced; 4 are not among the scored candidates of the new run (one contains the now closed cell
  `silent-u6e`; three contain `map-open-4`, cause not determined). 37 entered: 24 on a proposed node, 13 on the floored
  type.
- Final list against the waiver run: 56 of 60 keys in common, same rank 1, same counts. So the choice not to waive
  penalties moves four entries.
- Scored candidates containing a proposed node: 1,827 (first type; best 11.25; 636 with a penalty) and 2,330 (second
  type; best 10.75; 1,134 with a penalty); 12 contain both (`L/after/scored_counts.json`).
- 12 per proposed node is the per-device cap of the selection, not a property of the types.

### 3.4 User geometric program in the new top 60

Counted on members other than the proposed node, by declared tag (the proposed nodes themselves carry `bridge`,
`antibridge` and `klein`, `spinor`, `twin-ladder`; counting them would make the answer trivially yes).

| tag | before | after |
|---|---|---|
| twin-ladder | 13 | 17 |
| bridge | 11 | 16 |
| shear | 6 | 9 |
| torus | 6 | 6 |
| zero-channel | 4 | 5 |
| klein | 2 | 4 |
| vortex | 2 | 1 |
| antibridge | 0 | 0 |
| spinor | 0 | 0 |
| twistor | 0 | 0 |
| entries with at least one such partner | 31 | 38 |

20 of the 24 entries on a proposed node have such a partner (bridge 10, twin-ladder 9, shear 5, torus 3, klein 3,
zero-channel 3). Twin ladder, bridge, shear, torus, Klein, zero channels and vortex appear; antibridge, spinor and
twistor do not appear as partners in the top 60. They exist among the scored candidates on the proposed nodes and are
cut by the selection caps: best score with an antibridge partner 10.5 (first type), with a twistor partner 10.0
(second type), with a spinor partner 9.0 (second type) (`L/after/geo_best.json`). The appearance of these tags is a
consequence of the tags one reader gave the two nodes (section 6, weakest step 2); it is not a finding.

## 4. Work, part 3: scoreboard and planner note

`campaign/SCOREBOARD.md` and `scoreboard.json` were written by `scoreboard.py` only (three runs: before any edit, after
the engine edits, after this lane's line in `lanes.jsonl`; logs in `L/logs/`).

| quantity | before (rerun) | final | cause |
|---|---|---|---|
| headline | 1 of 4 | 1 of 4 | none |
| hold rate; three-referee statements (about zeros) | 91.8%; 2 (0) | same | none |
| nodes | 1,732 | 1,737 | this lane: two device nodes, three row nodes |
| nodes marked closed | 593 | 596 | this lane: the three row nodes |
| lanes run; lanes with score 0 | 156; 154 | 158; 156 | one line of `c18-exact-relation-rigidity-klein-spinor` (other lane), one line of this lane |
| families tried, not closed; open and untried | 1,080; 115,343 | 1,081; 115,342 | the line of the other lane (the count was already 1,081 before this lane's line was added) |
| families closed; outcome records | 3,872; 186 | same | none |

`campaign/PLANNER_NOTE_R19.md`: the 24 entries on a proposed node, one line each. Result: on the first type 5 triples
are usable in the sense defined there (ranks 13, 19, 27, 32, 33), one for definition and calibration (30), one as a
control row (15), 5 not (among them rank 1); on the second type none as a lane, two as carriers (8, 20), and all 12
are held until the referee of the sibling lane reports. The 36 entries on the floored 7/8 type are not usable as
explore slots (no named new input).

## 5. Controls

This lane makes no argument, so no control is run against a mechanism. What it records about controls:

- For each new or edited map row the defeated-by cell is the referee's table, not the lane's: Q31 has
  zeta(s+a) zeta(s-a) passing in the lattice model for u <= log(t/2 pi) (the lane's "fails in a window" is wrong) and DH
  "not run"; D10 has ZQ in the rational form passing and the DH-base note; P57 has NR-q failing through integrality
  while multiplicative on its own semigroup; D8 (vi) has T-NR in the conjugation form, DEL, E_a passing every step;
  G33 has the Epstein forms passing at inert primes; G43 covers three control classes only.
- For each proposed device type the controls that must fail are written into `devices.json` (section 3.1). No control
  has been run on either type by this lane. The sibling lane's HQ2 is not yet in the map (0 referees).
- Engine self-check: the new list has 0 entries with a closed device; the assertion "no cell node among device nodes"
  passes; `--proposed-waivers` changes four entries.

## 6. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | record lane; no argument. The rows entered say the opposite for their lanes: no proved step of P57, Q31, D8 (vi), G33, D10 uses multiplicativity |
| R2 (height-uniform, every window) | false | no statement at any height |
| R3 (every control fails at a named step) | false | no mechanism; the two proposed types list controls that must fail and none has been tested |
| R4 (reaches the critical line) | false | nothing is carried anywhere; a proposed device node is a question |

Score 0. No statement about zeros of zeta.

## 7. Three weakest steps

1. **One reader, one referee per source, no referee of this lane.** Rows P57, G43, Q31 and the edits of D8, G33, D10
   were condensed by one reader from RESULT and REFEREE files of six lanes; a wrong condensation would stand in the
   map. The four rows behind D8 (vi), G33, P57, Q31 wait for `c18-referee-r17-independent-sources`, which had not
   filed. Q31 is marked; the other three say "second pass owed" in their status cell only.
2. **The tags of the two proposed nodes decide the list.** The generator pairs by tags. The tags (`bridge`,
   `antibridge`, `hankel`, `toeplitz`, `weil`, ... and `klein`, `spinor`, `twin-ladder`, `bost-connes`, `hecke`, ...)
   were chosen by this lane from the round-18 allocation text. Rank 1 is joined to its device node by `bridge` and
   `shear` alone and is not usable; only 5 of the 24 proposed-node entries are judged usable in the planner note,
   and that judgement is also one reader's. The geometric-program counts of section 3.4
   are an effect of these tags.
3. **The rule for proposed types is a reading of the assignment, and one type may already be closed.** "No waived
   penalty beyond the open-device rule" was implemented as: R4-device rule and open weight yes, family-text exemption
   kept, three penalty waivers off. Another reading (all waivers on) changes four entries (measured). The open weight
   2 puts untested questions above every floored entry by construction. `exact-relation-rigidity` was reported closed
   by an unrefereed sibling lane during this lane; it is still `open` in `devices.json` and holds 12 of the 60 places
   until the next record lane acts on a referee file.

Smaller limits: `generate.py` was not regression-tested with the two nodes removed (the code path for non-proposed
devices is unchanged by inspection); three of the four entries that are no longer scored have no determined cause;
STRATEGY section 3.1 has no items for the round-17 closures; the corrections in lane files are notes, the false
sentences remain readable next to them; `merge_outcomes.py` was not run.

## 8. Files edited or written

| file | change | script | previous copy |
|---|---|---|---|
| `push/OBSTRUCTION_MAP.md` | rows P57, G43, Q31 added; D8, G33, D10, G42, S12b, Q30, P45, BLS note edited; section 7 +8 rows; row count; update paragraph | `L/apply_map.py` | `L/before/OBSTRUCTION_MAP.md` |
| `push/c15-u5-window-count-threshold-translate-control/RESULT.md` | correction note (register row 3) | `L/apply_corrections.py` | `L/before/lanefiles/` |
| `push/c15-edge-argument-strip-width-hecke-amplified/RESULT.md` | correction note (row 4) | same | same |
| `push/c15-u7-growing-section-twin-ladder-bridge/RESULT.md` | two correction notes (rows 5, 6) | same | same |
| `push/c15-klein-transport-lemma-w-stage-a-and-e1/RESULT.md` | two correction notes (rows 7, 8) | same | same |
| `push/c15-nonhomogeneous-pair-triple-kernel-search/RESULT.md` | correction note (row 9), moved below the table by hand | same | same |
| `push/s1-prime-torus-orbit/RESULT.md` | correction note (row 10) | same | same |
| `push/s1-zero-statistics-gram/RESULT.md` | correction note (row 11) | same | same |
| `push/c16-u6g-scattering-fe-rank2-bridge-stage-a/RESULT.md` | bracket in the ZQ (rational form) row of the section 5 table | `L/apply_zq_c16.py` | same |
| `engine/curated/mk_devices.py`, `engine/curated/devices.json` | blocks `R17_CELLS`, `PROPOSED`; two device types; two pending entries; header | `L/edit_engine.py`, `L/edit_engine2.py` | `L/before/mk_devices.py`, `L/before/devices.json`, `engine/scratch/mk_devices.pre-c18-repair.py` |
| `engine/nodes/nodes-22.json` | new: two nodes | `L/edit_engine.py` | - |
| `engine/build_graph.py` | `load_devices()` carries `status` | same | `L/before/build_graph.py`, `engine/scratch/build_graph.pre-c18-repair.py` |
| `engine/generate.py` | rule `proposed`; option `--proposed-waivers`; meta fields | same | `L/before/generate.py`, `engine/scratch/generate.pre-c18-repair.py` |
| `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json` | regenerated by the engine scripts | - | `L/before/CANDIDATES.json` (before-rerun) |
| `engine/ENGINE_LOG.md` | one section appended | by hand | `L/before/ENGINE_LOG.md` |
| `engine/README.md` | one table row | `L/apply_campaign.py` | `L/before/README.md` |
| `campaign/STRATEGY.md` | item 47 scope; paragraph "State of the cells after round 17"; one record-edit bullet. No rule, weight or allocation changed | `L/apply_campaign.py` | `L/before/STRATEGY.md` |
| `campaign/CORRECTIONS_R16.md` | update section appended | same | `L/before/CORRECTIONS_R16.md` |
| `campaign/PLANNER_NOTE_R19.md` | new | by hand | - |
| `campaign/SCOREBOARD.md`, `campaign/scoreboard.json` | rewritten by `scoreboard.py` | - | `L/before/` |
| `campaign/lanes.jsonl` | one line appended (below) | - | `L/before/lanes.jsonl` |

Not edited: `campaign/ROUND_LOG.md`, `engine/outcomes/`, `engine/outcomes.json`, `engine/closed_families.json`,
`engine/ROADMAP.md`, anything outside `engine/`, `campaign/`, `push/`. Files in `L/`: the scripts named above,
`compare_top60.py`, `attrib_counts.py`, `geo_best.py`, `top60_before_after.md/.json`, `after/` (final
`CANDIDATES.json`, `scoreboard.json`, `scored_counts.json`, `geo_best.json`), `after_waivers/CANDIDATES.json`,
`before/`, `logs/` (nine logs), `lanes_line.json`, `lanes.jsonl`.

## 9. Line in `campaign/lanes.jsonl`

Appended as the last line (copy: `L/lanes.jsonl`; readable form: `L/lanes_line.json`): round 18, slug
`c18-repair-owed-record-r17-open-device-nodes`, kind repair, verdict partial-result, aboutZeros false, referees 0,
r1 to r4 false, score 0, nodes [] (the two device nodes are not listed, so the scoreboard does not count their tag
pairs as tried).

## 10. Owed to the next record lane

- State of `exact-relation-rigidity` on the referee of `c18-exact-relation-rigidity-klein-spinor` (closed if it holds;
  control HQ2 into map section 2); state of `tz-one-sided-completion-bound-band` on the two round-18 tz lanes.
- Rows S12b, Q30, P45: replace the reach statements by row Q31 once the second referee of the window law reports;
  remove the "one referee" mark of Q31 or correct the row.
- Second-referee results for D8 (vi), G33, P57.
- STRATEGY section 3.1 items for the round-17 closures (next strategy review).
- An independent referee for this lane.
