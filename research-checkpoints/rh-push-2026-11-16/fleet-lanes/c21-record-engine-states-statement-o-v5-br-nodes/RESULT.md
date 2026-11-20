# c21-record-engine-states-statement-o-v5-br-nodes: RESULT

Campaign round 21, kind: repair (record lane B). Date 2026-11-20 UTC. No attack. The lane has no answer for R4 and cannot
score. Nothing in this file or in any edit of this lane is a statement about zeros of zeta. No connection to the compute
server was made; every run of the engine scripts and of the scoreboard went through `scripts/memcap.sh 8` on the Mac.
`merge_outcomes.py` was not run. Paths are relative to `tmp/research-2026-11-16/`; `L/` is this directory.

## 0. Verdict

**Partial result (record lane).** The six items are done within the edit scope (`engine/`, `campaign/`, `L/`). Not done,
with reason: cell U4 stays `cell` (no second referee file for its round-20 lane is on disk); the lane has no independent
referee (`REFEREE.md` is an author check, see section 7); the text repairs in
lane files and in the map are written as proposals, because those files are outside the edit scope; Ingham 1937 itself
was not opened (a written proof of its Theorem 1 in generalised form was).

| item | outcome |
|---|---|
| 1. Statement O version 5 | **Accepted**, as version 5.1: `campaign/STATEMENT_O.md` (copy `L/STATEMENT_O_v5_1.md`), diff `L/statement_o_v5_v5_1.diff` (9 hunks, 18 lines added, 6 replaced). C2 and C4 entered in the statement; C1 entered in STRATEGY and resolved by the files now on disk; C3 found already done by the learn step; C5 registered. No label changed |
| 2. Graph nodes | `engine/nodes/nodes-23.json`: BR-2, BR-3 (also registered as proposed, untested device types, state open) and TS (type tool). Graph 1,759 -> 1,762 nodes. Top 60: 18 keys in common with the before list; 24 of 60 now contain a BR node. TS is in no candidate (it has no role) |
| 3. Cell states | U6 (c): `cell` -> `closed` (second referee file on disk; its scope is Lemma Q only). U6 (a), U6 (b): `cell` -> `closed` in a second edit at 10:37Z, after their second referee file appeared (absent at the first edit, 10:22Z). U4: unchanged; working files of the running referee lane are on disk, no referee file |
| 4. Sources | Opened: a written proof of Ingham's deduction (arXiv:2411.01845v1, Theorems 2.1 and 2.3); Trefethen-Weideman 2014, Theorem 5.1 (verbatim); Bohr's inequality as display (1.6) of arXiv:0805.0825v1 (statement, no proof printed). Not opened, cited as "relative to": Ingham 1937; Bohr 1913; the Bohr lift (1.5) |
| 5. Text repairs | Entered in STRATEGY (items 59, 60, 64, cell paragraph), the two checkpoint files, and the engine evidence of U4, U6 (g) and the band device; register `campaign/CORRECTIONS_R20.md`. MV-CAP written once with hypothesis H_W in Statement O line 10 (label ARGUED). Lane files and map rows: `L/PROPOSED_PUSH_PATCHES.md`, not applied |
| 6. Scoreboard | One entry changed: `C_coverage.nodes` 1,759 -> 1,762. Every other entry unchanged (headline 1 of 4; lanes 180) |

## 1. Plan

1. First step: copies of the files as found (`L/asfound/`), then `build_graph.py`, `generate.py --top 60` and
   `scoreboard.py` rerun before any edit (`L/before/`, `L/logs/before_*.log`), so each later difference has a reference.
2. Read: BRIEF to the end; STRATEGY sections 0c, 1, 2, 4.0; ROUND_LOG round 20 ("Owed") and round 21 allocation;
   ENGINE_LOG tail; RESULT.md and REFEREE.md of the c20 record lane (C1 to C5); the six REFEREE2 files of
   `c20-referee-theorem-d-headline-and-r19`; map rows P29, P43, O1, D10 and section 5 part 1.
3. Engine edit by script (`L/edit_engine.py`): previous files to `engine/scratch/`, node file, block R21; the cell states
   are decided inside the script from the files on disk at that moment.
4. Statement O version 5.1 by script with anchored replacements (`L/build_statement_o_v5_1.py`), diff written.
5. Sources fetched with generic search terms, read as text.
6. Text edits by script (`L/apply_campaign.py`), each anchor matched exactly once, previous files to `engine/scratch/`.
7. Reruns after the engine edit (`L/after/`) and after all edits (`L/final/`); comparison entry by entry.

## 2. Work

### 2.1 Item 1: STATEMENT_O_v5.md, decision and diff

Decision: **accept**. Reason: the campaign referee of the lane that wrote version 5 (a process separate from the lane)
re-derived lines 13 to 17 by hand, checked each on a case different from the lane's, and holds the four relabels (13, 14,
16, 17) and the non-relabel of line 15; its corrections C1 to C5 change no count, state or label. This lane did not
re-derive those lines; the acceptance rests on that report and on the label rule (PROVED = two referee files cover the
closing step), which version 5 applies as written.

| correction | applies to | applied |
|---|---|---|
| C1 | STRATEGY 3.1 items 59, 61, 63 under "closed by this rule" on one referee each; U6 (c) closed in STRATEGY, `cell` in the engine | The second referee files asked for now exist (`push/c20-referee-theorem-d-headline-and-r19/REFEREE2-c19-u4-...md`: holds with corrections; `...-c19-hq2-screen-...md`: holds; `...-c19-u6c-...md`: holds). Each item has a bracketed note naming the file and its scope; item 69 and the engine now agree on U6 (c) |
| C2 | line 17, reflection parenthesis | "for the optimal c" in the step field; a sentence in the Label bullet (L^2/(4T) when Psi(c) = 0 mod 2 pi) |
| C3 | referee fields of the c20 lane line | no edit needed: line 173 of `campaign/lanes.jsonl` was replaced by the learn step with the refereed record (referees 2); checked, not changed |
| C4 | line 13 | "simple" in the construction field |
| C5 | two counts in the c20 RESULT.md; histogram entry | registered in `campaign/CORRECTIONS_R20.md`; the lane file is not edited |

Other changes in version 5.1, each marked "(version 5.1" in place: title and a header paragraph with the decision; a field
"Source of S(theta)" in line 1 and short source fields in lines 5 and 7 (item 4); the statement of MV-CAP in line 10 and
the reworded Owed field there. Labels and the count are those of version 5: PROVED 8, PROVED relative to a cited theorem
1 (line 5), MEASURED 1 (line 2), ARGUED 7 (lines 1, 4, 7, 10, 11, 12, 15). Version 5 is not edited. `campaign/STATEMENT_O.md`
is a new file (there was no earlier file of that name); map row O1 still points to versions 3 to 5 (proposal 4 of
`L/PROPOSED_PUSH_PATCHES.md`).

### 2.2 Item 2: nodes for BR-2, BR-3 and TS

Curated source: `engine/nodes/nodes-23.json` (read by `build_graph.py` through its `nodes-*.json` loader) and block R21
of `engine/curated/mk_devices.py` (which generates `curated/devices.json`).

- `br3-euler-shape-rigidity-regime3`, `br2-sparse-pole-lattice-regime-k`: type open-direction, status conjectural,
  statements copied in substance from STRATEGY section 4.0. Both are also entered as **proposed, untested device types**
  (state `open`), with entry conditions E1 to E6 and the controls that must fail. Reason for the device entry: the rule
  "no open or floored crossing device" of `generate.py` rejects every candidate without such a node, and the graph had no
  open device, so a plain node could not be proposed. The precedent is the two proposed types of round 18; no penalty
  waiver applies to a proposed type. The entries state that BR is an identification question, that an identification or a
  twin scores 0, and that no route from it to zeros of zeta is registered.
- `twin-screen-ts`: type tool, status conjectural (the TS file of `c21-twin-screen-ts` was not on disk as a refereed file).
  A filter, not a device.

Counts (logs `L/logs/before_*.log`, `after_*.log`, `final_*.log`; lists in `L/before/`, `L/after/`, `L/final/`):

| quantity | before | after |
|---|---|---|
| graph nodes / live / rows / edges | 1,759 / 977 / 253 / 9,239 | 1,762 / 980 / 253 / 9,263 |
| composes-with edges | 7,619 | 7,643 |
| device nodes | closed 71, floored 6, open 0 | closed 71, floored 6, open 2 |
| device types in `devices.json` | 56 (55 closed, 1 floored, 0 open) | 58 (55 closed, 1 floored, 2 open) |
| cells | 6 cell, 1 tried, 4 closed | 3 cell, 1 tried, 7 closed (5 / 1 / 5 after the first edit) |
| generated / scored / rejected | 38,485 / 8,415 / 30,070 | 44,016 / 11,400 / 32,616 |
| top 60 with an open device / floored only | 0 / 60 | 24 / 36 |

- **Top-60 overlap: 18 of 60 keys** are in both lists (their ranks move down: before ranks 1, 3, 6, 13 to 17, 19, 20, 29,
  34, 38 to 43 become 9, 17, 24, 31, 32, 34 to 38, 44, 52 to 55, 57, 59, 60). 42 entered, 42 left.
- **Candidates with a BR node: yes.** 24 of the top 60 (12 with BR-3, 12 with BR-2: the per-device cap of 12), at ranks 1
  to 8 and sixteen ranks between 10 and 29; moves M1 18, M3 4, M4 2. In the full scored list (`--dump-all`, 11,400
  entries; the 53 MB dump was deleted after counting, the counts are in `L/logs/after_generate_dump.log` and section 2.2
  here): 2,707 contain BR-3 and 497 contain BR-2. Rank 1: `br3-euler-shape-rigidity-regime3 x catalan-signed-ladder x
  sympow-conductor-normalised-shift`, score 10.5.
- What this ranking is: the weight of an open device applied to the only two open device nodes, with partners chosen by
  shared tags. It is not evidence for the question and the partners are not vetted (the generated "first test" text asks
  for an inequality at three heights, which BR-3 is not).
- **Closed family adjacent to BR-2.** 1,556 generated candidates are now rejected by `fam-pole-lattice-multiplier` and
  111 by `fam-lemmab-sup-bound-halfplane` (both 0 before). Both families are map row P43 (Lemma B: pole-lattice test
  multipliers), and their patterns match the text "2 pi i k / log p" of the BR-2 node with a partner. Row P43 is the closed
  row nearest to BR-2 by text; the BR-2 lane should read it before using pole lattices as test multipliers.
- **TS is not proposed.** The node is live with 10 edges but has no role, and the generator draws from role pools: 0 of
  44,016 generated candidates contain it (`L/logs/generate_node_ts.log`). Giving it a role would need a status (measured or
  proved) that the TS file does not have yet; not forced.
- After the text edits the scripts were rerun: the top 60 is identical to the list after the engine edit (same keys,
  ranks and scores).

### 2.3 Item 3: cell states in `curated/mk_devices.py`

Check made by `L/edit_engine.py` at 2026-11-20 10:22Z (`L/logs/edit_engine_referee_files.json`) and repeated when this
file was written:

| cell | second referee file | on disk | engine state |
|---|---|---|---|
| U6 (c) | `push/c20-referee-theorem-d-headline-and-r19/REFEREE2-c19-u6c-double-cover-k3-run.md` (verdict: holds, one wording point) | yes | `cell` -> **`closed`** |
| U4 | a file of `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u4-second-order-archimedean-mixed-form/` | directory absent at 10:22Z; at 10:37Z it holds scripts and logs (`u4_ref2.py`, `u4_confirm.py`, `u4_scan.py` and outputs) and no file named REFEREE | unchanged (`cell`) |
| U6 (a), U6 (b) | `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE2.md` (verdict: Lemma K and K' hold; the five wording corrections of the first referee accepted; the lane's verdict stands) | absent at 10:22Z; on disk at 10:37Z | `cell` -> **`closed`** in a second edit (`L/edit_engine_step2.py`, `L/logs/edit_engine_step2_referee_files.json`) |

The second file for U6 (a), (b) states its scope: U6 (a) closed for linear groups, the double cover half argued, the
truncated norm of the degenerate P_(2,1) object not derived (inherits row D10); U6 (b): "no candidate norm" is a
statement about the classes examined, not a classification. The evidence text of both cells carries this. After the
second edit the scripts were rerun (`L/final2/`, `L/logs/final2_*.log`): generated, scored, rejected and the top 60
are identical to the run before it (no scored or rejected candidate contained the two cell nodes), and the scoreboard
is unchanged apart from its timestamp.

The second file for U6 (c) says of itself: "Only Lemma Q was refereed"; the Eisenstein values and the cusp-form run have
one referee. The evidence text of the cell says so. `REFEREE2-c19-u4-joint-prime-phase-quadratic-dp-zeros.md` exists, but it
is the second file of the round-19 read of U4; the closure of U4 at every read rests on the two round-20 lanes, whose
second files are the ones that are absent. Previous files: `engine/scratch/mk_devices.pre-c21-record.py`,
`engine/scratch/devices.pre-c21-record.json`. Entry-by-entry difference of `devices.json` (`L/devices_diff.json`): two
device types added (open); state and evidence of U6 (a), U6 (b), U6 (c); evidence only for U4, U6 (g) and the band device;
in each changed entry the old evidence is a prefix of the new one (`L/devices_diff.json` is the comparison after the first
edit; the second edit changes the two states and appends to the two evidence fields).

### 2.4 Item 4: sources (register `campaign/SOURCES_R21.md`)

Search terms were titles, authors and theorem names only. Files in `L/sources_dl/` (PDF, text, SHA-256 in the register).

| item | opened | read | stays "relative to" |
|---|---|---|---|
| Statement O lines 1, 5 (and 7): S(theta) | arXiv:2411.01845v1 (Starichkova, 2024) | Theorem 2.1 restates Ingham 1937, Theorem 1: zero-free region sigma > 1 - A log log t/log t and N(sigma, T) = O(T^(b(1 - sigma)) log^B T) give pi(x) - pi(x - x^theta) ~ x^theta/log x for 1 - 1/(b + B/A) < theta < 1. Theorem 2.3 generalises it with a full proof (displays (13) to (17)) | Ingham 1937 (not opened); the text is a preprint; three inputs quoted by the proof (truncated explicit formula in Wolke's form, a zero-free region of Littlewood or Vinogradov-Korobov strength, two theorems of Titchmarsh); the step from psi to pi; the covering remark that gives the lower-bound form S(theta) is this lane's |
| Lemma Q | Trefethen-Weideman, SIAM Review 56 (2014) 385-458 | Theorem 5.1 verbatim: w analytic in abs(Im x) < a, w -> 0 uniformly in the strip, int abs(w(x + ib)) dx <= M for all b in (-a, a); then abs(I_h - I) <= 2M/(e^(2 pi a/h) - 1), with 2M best possible | nothing for the statement; that the lane's integrands meet the hypotheses is that lane's referee's check |
| Bohr's inequality | Maurizi-Queffelec, arXiv:0805.0825v1 | display (1.6): for f = sum a_n n^-s in H^infinity, sum over primes of abs(a_p) <= norm(f)_inf, attributed to Bohr, given as a corollary of the norm-preserving lift (1.5); no proof printed | the proof (a three-line one from (1.5) is written in the register, unrefereed); the lift (1.5); Bohr 1913 |

Effect on labels: none. Line 5 stays "PROVED relative to S(theta)"; the owed item "Ingham 1937 or a textbook proof" is
marked discharged in the form "a written proof was opened", with the residue listed. Lemma Q and Bohr's inequality can be
cited as CLASSICAL with the statement opened.

### 2.5 Item 5: text repairs and MV-CAP

- Register: `campaign/CORRECTIONS_R20.md` (C1 to C5; the three repairs with the corrected sentence, where entered, where
  not).
- `campaign/STRATEGY.md` (previous file `engine/scratch/STRATEGY.pre-c21-record.md`): bracketed notes "[c21 record lane
  ...]" in section 0c, items 59, 60, 61, 63, 64, 69, the round-19 cell paragraph, and a change-log entry. 10 anchored
  edits. No rule, weight, allocation or family state changed.
- `campaign/CHECKPOINT_R20_INPUT.md`, `campaign/CHECKPOINT_R20_DECISION_SHEET.md`: "even" in row 11 of each (previous files
  in `engine/scratch/`).
- Engine evidence (block R21): U4 (Liouville fails at p q^2, P > 12), U6 (g) (d even, with the two odd counterexamples),
  band device (Lemma P').
- "Liouville passes": `campaign/ROUND_LOG.md` and `campaign/lanes.jsonl` contain the phrase only inside the referee's
  quotation of the error; not edited. The uncorrected sentences are in the round-19 lane file (six lines), listed in
  `L/PROPOSED_PUSH_PATCHES.md` with the Lemma P', "d even", O1, C3/C5 and source-citation proposals (seven items).
- Statement O contains none of the three phrases (searched: 0 occurrences each).
- **MV-CAP, one written statement** (Statement O version 5.1, line 10). Hypothesis H_W(c, h): every zero of zeta with
  abs(Im rho - c) <= h is on the line and simple, and c +- h are not ordinates. Under H_W(c, h + 1), 500 <= h <= 1000, c in
  [3.1e12, 7.5e16]: a cluster lift F_c = zeta R_c with zeta's functional equation, one or more off-line pairs in the window,
  the zeros of zeta elsewhere, and sup over Re s >= sigma of abs(F_c/zeta - 1) <= 2E + E^2, E <= 2.44 abs(Z(t_m)) (c/2 pi)^(-(sigma - 1/2)/2)
  at sigma = 2. Consequence: a mean-square, pointwise or counting premise that zeta satisfies with more room than that is
  satisfied by F_c, so it does not imply "no off-line zero in the window". The field lists what is not covered (H_W
  unknown above the verified height; half-planes Re s >= sigma > 1 only; family and density remarks are separate). It is a
  restatement of Theorem 2 of `b-mvcap-function-side` with its referee's correction (h >= 500). Label ARGUED; two referees
  owed. A version without H_W through the control ZQ is noted as a remark, not derived.

### 2.6 Item 6: scoreboard

`campaign/scoreboard.py` through `scripts/memcap.sh 8`, three times (`L/logs/*_scoreboard.log`; files in `L/before/`,
`L/after/`, `L/final/`; comparison `L/scoreboard_diff.json`).

| entry | as found (file of 09:58Z) | rerun before any edit | after all edits |
|---|---|---|---|
| `C_coverage.nodes` | 1,756 | 1,759 | **1,762** |
| `C_coverage.nodesMarkedClosed` | 611 | 614 | 614 |
| `C_coverage.families` / closed / tried / open untried | 139,128 / 4,157 / 1,351 / 133,620 | 147,696 / 4,301 / 1,354 / 142,041 | the same as before |
| `C_coverage.tags` | 528 | 544 | 544 |
| timestamp | 09:58Z | 10:18Z | 10:38Z |
| every other entry (40 flattened entries in all: headline 1 of 4, lanes 180, refereed 170, hold rate, histogram, history) | | unchanged | unchanged |

Changed by this lane: **`C_coverage.nodes` only** (three nodes; the tags used exist already, so the family count is the
same; the scoreboard counts closed nodes by node status, so the cell state of U6 (c) does not move
`nodesMarkedClosed`). The seven differences between the file as found and the rerun before any edit are not from this
lane: the scoreboard file predated the graph on disk (the graph file was byte-identical before and after my first
rebuild). This lane appended nothing to `campaign/lanes.jsonl`; its line is `L/lanes.jsonl`.

## 3. Controls

No mechanism is claimed, so no control run applies. Control facts carried by the edits, each from a referee file and
not recomputed here: Liouville fails candidate (J) at p q^2 (first atom 12, -1.5230); the constructed sigma of the band
continuation is signed (negative mass 2.247887); X(d), NL(d) fail for odd d at two exact configurations. The proposed
device entries list the controls that a BR statement must fail (non-multiplicative: DH, the Theorem C product, Lemma E
stages; without the functional equation: THIN, DEL; one modified prime: HQ1 to HQ4; and the standing nine). The MV-CAP
statement is a control statement (cluster lifts) and is conditional on H_W.

## 4. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | record lane; no argument. Theorem A behind the BR entries uses no multiplicativity (stated in the entries) |
| R2 (height-uniform, every window) | false | no statement at any height. The MV-CAP statement written here is the reason mean-value inputs do not give every-window conclusions, and it is conditional |
| R3 (every control fails at a named step) | false | no mechanism; the device entries list controls that must fail, none is shown to fail |
| R4 (reaches the critical line) | false | nothing is carried to the line. BR poses R4 only in relative form and is untested |

Score 0. Headline unchanged (1 of 4).

## 5. Three weakest steps

1. **BR as device types.** BR-2 and BR-3 are identification questions; registering them as open crossing devices is
   what makes the generator propose them, and it puts them at ranks 1 to 8 of a list whose score is a heuristic over
   tags. The partners (for instance a Catalan ladder node) have no stated relation to the question. A reader of the top
   60 alone would take BR for a ranked lead with vetted combinations; the entries say otherwise, the list does not. The
   count "0 open device types" of STRATEGY section 0c is now 2 for this reason only. If the planner prefers plain nodes,
   remove block R21 part (2); the nodes stay and are then never proposed.
2. **U6 (a), (b), (c) closed on second files of stated, narrow scope.** For U6 (a), (b) the file appeared between my two
   edits and was written by a lane still running; I read its verdict and scope, not its derivations. For U6 (c): The file exists and holds, which is the condition of the
   assignment, but it covers Lemma Q only; the runs that carry the obstruction (132 of 132; 14 of 14 in float64) have
   one referee. A stricter reading of "two referee files cover the closing step" would keep the state `cell`.
3. **Sources and MV-CAP are one reader's work.** Ingham 1937 was not opened: what was read is a 2024 preprint that
   restates the theorem and proves a generalisation, with three quoted inputs unopened and the psi-to-pi step and the
   covering step not written there. Bohr's inequality was opened as a statement without proof; the short proof in the
   register is mine and unrefereed. The MV-CAP statement condenses Theorem 2 of a lane with one referee; the clauses
   "what the statement does not cover" and the ZQ remark are this lane's reading, not refereed. The acceptance of
   version 5 rests on one campaign referee report; this lane re-derived none of lines 13 to 17.

Files that appeared while the lane ran and are not used by it: `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/nrq-line15/REFEREE2.md`
(second referee of the NR-q construction; it may allow a relabel of Statement O line 15, which version 5.1 leaves ARGUED) and the
second referee files for the line-2, line-4 and euler-shape lanes in the same directory. They belong to the next record edit.

Smaller limits: the text repairs in lane files and map rows are proposals only; TS has a node but cannot be proposed;
`CANDIDATES.json` was rewritten once by a `--node twin-screen-ts` run and then restored by the plain `--top 60` run
(identical to the list after the engine edit); the as-found scoreboard was stale and its old values are quoted from the
copy in `L/asfound/`.

## 6. Files

Edited (previous file in `engine/scratch/`): `engine/curated/mk_devices.py` (`mk_devices.pre-c21-record.py`; intermediate
`mk_devices.c21-record-step1.py`, `mk_devices.c21-record-step2.py`), `engine/curated/devices.json` (`devices.pre-c21-record.json`), `engine/ENGINE_LOG.md`
(`ENGINE_LOG.pre-c21-record.md`), `campaign/STRATEGY.md`, `campaign/CHECKPOINT_R20_INPUT.md`,
`campaign/CHECKPOINT_R20_DECISION_SHEET.md` (`*.pre-c21-record.md`). Regenerated by the scripts: `engine/IDEA_GRAPH.json`,
`engine/CANDIDATES.json`, `campaign/scoreboard.json`, `campaign/SCOREBOARD.md` (copies as found in `L/asfound/`). New:
`engine/nodes/nodes-23.json`, `campaign/STATEMENT_O.md`, `campaign/CORRECTIONS_R20.md`, `campaign/SOURCES_R21.md`. In `L/`:
scripts, logs, `before/`, `after/`, `final/`, `asfound/`, `sources_dl/`, the diff, `PROPOSED_PUSH_PATCHES.md`, `lanes.jsonl`,
`REFEREE.md`.

## 7. Referee status of this lane

No independent referee report exists for this lane. The lane tried to start a separate headless process to write one; the
permission system of the session denied the command, and the lane did not look for another way to start one. `L/REFEREE.md`
is therefore an **author check** (recounts by a second script, `L/author_check.py`, log `L/logs/author_check.log`), and the
lane line records `referees: 0`, `refereeHolds: null`. The brief prepared for a referee is `L/REFEREE_BRIEF.txt`; the
campaign referee step can use it or ignore it.
