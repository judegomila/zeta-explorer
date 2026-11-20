# REFEREE.md: c17-repair-owed-record-r16-cell-nodes

Independent referee pass (lens: general), 2026-11-19 PST (2026-11-20 UTC). Separate session from the lane. Only
this file was written. All runs local through `scripts/memcap.sh 8`, on a copy of `engine/`, the map, the SYNTHESIS
files, `campaign/scoreboard.py` and `campaign/lanes.jsonl` in a scratch directory outside the repo
(`/tmp/refc17.*`); no file of the campaign was rerun in place. The server was not used. No large data module was
imported.

**Outcome: the verdict (partial result, record lane, nothing about zeros of zeta, headline 1 of 4, four flags
false) HOLDS. Every engine count in the claim line was reproduced. The lane contains no PROVED step of its own.
Seven corrections are owed (E1 to E7); two matter for readers (E1: the literature line; E2: one count in row G42
entered without its referee's restriction). None changes a count, a state or the verdict.**

## A. What was recomputed

| claim | check | result |
|---|---|---|
| graph 1,727 nodes, 974 live, 244 rows, 9,127 edges | `build_graph.py` rerun on the copy | byte-identical `IDEA_GRAPH.json` |
| generated / scored / rejected 38,082 / 8,432 / 29,650; top 60 | `generate.py --top 60 --dump-all` rerun on the copy | `CANDIDATES.json` identical except the `dump_all` path in the meta block |
| scoreboard at the end | `scoreboard.py` rerun on the copy | identical except the timestamp: 1,727 nodes, 588 closed, 117,370 families, 3,797 / 988 / 112,585, 150 lanes, 168 outcome records, 130 lemmas, 1 of 4 |
| devices 53 closed / 1 floored / 0 open; cells 9 / 1 / 1; pending 7 -> 6 | counted from `devices.json` and `scratch/devices.pre-c17-repair.json` | confirmed; U2-POS closed, U6 (g) tried-not-closed; no node is both a device and a cell |
| top 60: open 57 -> 0, floored only 3 -> 60, closed 0 -> 0 | counted with my own classifier from the device lists (not from `meta.r4Rules`) on the baseline and final files | 57 / 3 / 0 and 0 / 60 / 0; the 57 are exactly the entries with a `silent-*` member |
| 12 entries on each of five floored nodes | counted | tro6-natural, qrh-seven-eighths, map-open-2, seven-eighths-abscissa-formula, map-open-4: 12 each |
| 2 top-60 entries keep a cell member (ranks 13, 44; 8.25, 3.0) | counted | confirmed |
| all 8,432 scored: 0 with crossing > 0, 0 with a `silent-*` device, 0 with the closed cell, 23 with a cell member, best 8.25 | recounted from my own dump | confirmed; every `r4Devices` entry is of kind floored |
| rejected for a closed cell: 49; no device: 14,549 | rerun log | confirmed |
| stage 1 (cells alone) and final list identical in keys, order, scores | compared `after1/` with the final file | confirmed |
| one key in common before / after (rank 50 -> 9) | compared | confirmed |
| against the pre-silent list of `c16-repair-owed-record-r15/after1`: 45 common, 39 same score, 6 differ by 0.01 | compared | confirmed (four at -0.01, two at +0.01) |
| edges: composes-with +61 -57; control-defeats +5 (four into row-D10, one into row-G42) | edge sets of baseline and final graph compared | confirmed: ctl-BLS, ctl-DH, ctl-EISW, ctl-ZQ -> row-D10; ctl-EISW -> row-G42; no edge removed; no other edge type changed |
| map 205 -> 208 labelled rows | row labels parsed from both files | 208 against 205; new P56, G42, D10; changed P45, G41, Q30, S12b; no duplicate label; P 56, G 42, Q 30, S 13, Z 39, F 8, T 3, L 6, D 10, O 1; the three new rows have six cells |
| lane files not edited | files under `push/` newer than the lane's first baseline file | only `OBSTRUCTION_MAP.md` and files of other lanes (c17-*, s2-*, s3-*, four `REFEREE2.md` of a different lane); none of the nine lane RESULT files named in section 2.3 changed |
| eight round-16 lanes have outcome records | `engine/outcomes/c16-*.json` and `outcomes.json` | 8 of 8 present, each older than the lane's start, one entry each in `outcomes.json`, no `secondReferee` field |
| generator rule | diff of `generate.py` and `build_graph.py` against the `pre-c17-repair` files | the device pool, the `crossing` part, the family-match exemption, the two majority penalties and the per-device cap all key on `device_kind()`, which is None for a cell: the four exemptions cannot apply. Weights unchanged |
| planner decision | `ROUND_LOG.md`, "Round 17 allocation" | matches: node type `cell` scored as a tag; U2-POS closed; U6 (g) tried-not-closed; the others cells |

## B. Numeric and mathematical checks on quoted statements (different cases)

The lane proves nothing; these are checks of sentences it entered in the map and the register.

1. Sentence 10 (exact Haar variance): (1/2) sum over p <= P of Li_2(1/p), computed here with a sieve to 1e7:
   P = 1e2: 0.97092; 1e3: 1.16876; 1e5: 1.42237; 1e7: 1.59046. The register's "0.971 ... 1.590" is correct, and
   (1/2) log log P + 0.21 gives 0.9736 and 1.6000 at the ends, so the lane sentence "to within 0.02" fails only
   against the sampled column, as the register says.
2. Sentence 4 (tau(p)): with tau = alpha + 1/alpha, alpha = i gives 0 and alpha = i p^(-delta/2) gives
   -i (p^(delta/2) - p^(-delta/2)). Correct.
3. Sentence 7 (E_a0): abs(e + a0) + abs(e - a0) >= 2 a0, and by the arithmetic-geometric mean inequality
   T^(2A x) + T^(2A y) >= 2 T^(A (x + y)) >= 2 T^(2A a0) for T >= 1, A > 0. Correct.
4. Sentence 2 (ZQ defect): abs D <= 2 (eta^2 + d^2) L^2 e^(-(1/2 - eta) L) and max over L of L^2 e^(-aL) =
   4 e^(-2)/a^2 give 8 e^(-2) (eta^2 + d^2)/(1/2 - eta)^2. Correct arithmetic; agrees with
   `REFEREE2_control-zq.md`.
5. Row P56, trace identity: for G = zeta (N the counting measure of the positive integers, r = 1) and real phi
   supported in (-1/2, 1/2), Parseval on the unit circle gives sum over n >= 1 of abs(phihat(n))^2 =
   (1/2)(norm(phi)^2 - abs(integral phi)^2): the identity as written in the row. With phi tending to the
   indicator of the interval the right side tends to 0 and phihat to sinc, which places N on the positive
   integers. The row's statement and its labels agree with the three referee files (all three hold; finite-order
   necessity not addressed; 35 distinct programs; members 2.5 to 3.5 percent below ZQ in 5 of 5 cells).
6. Row D10 and the note "BLS in rank 2" against the independent pass in the lane's REFEREE.md: E1 (restricted
   BLS-right; 335, 233, 365 of 700, so "between 233 and 365" is right), E2 (DH: 0 negative on 400 diagonals;
   failure through zeros right of 1 ARGUED, not reached), E3 (sign pattern not monotone), Q/eta^2 = 4.198:
   carried correctly. Labels PROVED-rel / PROVED / MEASURED / ARGUED match.
7. Row S12b against E1 of `c16-referee-r15-j1prime-u8-screening/REFEREE.md`: the form after E1 is the one
   entered. Correct.
8. Row G42 against the independent part of the amplifier lane's REFEREE.md (section 6, surviving claim): range
   T <= 4, N <= 128, gamma <= 541, 463 formal rows, factor in [0.987, 1.0094], OPEN items: carried correctly.
   One count is not (E2 below).

## C. Errors and restrictions

- **E1 (literature line; misleading as worded).** Section 6 and the verdict line say "no preprint dated November
  2026 found", and the claim line "Literature rescan found no 2611 preprint". As a report of what one search
  returned this may be true (the lane keeps no log of the search, so it cannot be checked). As a statement of
  the record it is wrong: the campaign files already hold at least 14 distinct identifiers 2611.*, among them
  three on the zero-free half-plane and the 7/8 architecture, opened by `c10-new-inputs-scan-2026`:
  2611.00924 (the claimed figure 0.874462, also in `campaign/STRATEGY.md` section 0b), 2611.16665 (17
  occurrences in the campaign files) and 2611.12500. The lane's list "on file already" names only the three
  2610 identifiers. So the rescan did not return preprints the campaign already knows; its recall is low and
  "none found" carries no information about new November preprints. Corrected sentence: "The search returned
  no 2611 identifier; it also did not return 2611.00924, 2611.16665 or 2611.12500, which are on file
  (`c10-new-inputs-scan-2026`), so the rescan is not evidence that nothing new exists." The four identifiers
  listed as not on file are indeed absent from `campaign/`, the map, the BRIEF and the lane RESULT files
  (text search repeated here); none was opened by the lane or by this pass, and the attribution of 2603.21490
  to named authors is unchecked.
- **E2 (row G42, one count entered without its referee's restriction).** The defeated-by cell says "EIS-w
  passes every step (...; gain above N^delta in 394 of 528 rows; the R2 excess is present)". Item 5.5 of the
  independent referee of `c16-amplifier-below-truncation-eisw-compute` rules that this count is "a comparison
  against the wrong scale for the control" (off a zero N^delta is not the bound the argument gives; the count
  mixes the generic effect with small MS(1) at midpoints; the quantity that carries weight is undefined in 90
  of the 528 rows). The row should read "EIS-w passes every step (one control; it shows that no step reads
  phi = 0)" and drop or scope the count. Also in the same row and in STRATEGY item 47: "sup R2 between 1.04 and
  1.46" is for N <= 8 (float64, local optimiser), a scope the row places under "T <= 4, N <= 128"; and item 5.3
  ("R2 <= M/L" is a validity statement, not a structural cap on the amplifier) is not carried. This
  contradicts the last bullet of section 3 of RESULT.md ("the restricted forms were used where a referee
  restricted a claim") for this row. No label changes.
- **E3 (one attribution in section 5 is incomplete).** Families tried-not-closed 861 -> 988 is attributed to
  "outcome files `s2-*` of the screening arm". Rerun here with one input removed at a time: without the line
  of `c17-u6e-bost-connes-non-invariant-state-twin-ladder` in `lanes.jsonl` the figure is 978 (untried
  112,595); without the ten `s2-*` files it is 872. So 117 of the 127 come from the `s2-*` files and 10 from
  the `c17-u6e` line. Both are files of other lanes, so the sentence "not this lane" stands, and the wording
  in `ENGINE_LOG.md` ("by files of other lanes written meanwhile") is correct; the RESULT table names the
  wrong single cause. The lane's own line changes only lanes run (149 -> 150) and score-0 lanes, confirmed.
  Lemmas decided 125 -> 130 is the `c17-u6e` line (5), confirmed.
- **E4 (wording of the headline).** "The eleven nodes are now node type 'cell'": in `IDEA_GRAPH.json` the
  eleven nodes keep `type: open-direction` and the roles `['cell', 'lemma']`; what is new is the field `cell`,
  the role `cell`, and the entry type `cell` in `devices.json`. RESULT.md says so in weakest step 2, but the
  claim line, STRATEGY 4.0 ("node type `cell`") and the lesson line do not. The lesson in `lanes.jsonl`, "as a
  tagged node it does not [change the ranking]", is too strong against the lane's own section 2.2: 15 of 60
  keys differ from the pre-cell list and 2 entries of the top 60 carry a cell member. Read: "as a tagged node
  it no longer dominates the ranking".
- **E5 (an engine change not listed in RESULT.md).** `build_graph.py` also changed `CONTROL_CODE_RE` (codes
  NR-q, ZQ, SG added). It is in `ENGINE_LOG.md` and not in sections 2.2 or 11 of RESULT.md. Its effect was
  measured here: the only edge it creates is ctl-ZQ -> row-D10; no existing edge is removed or re-typed (an
  NR-q cell was previously read as NR; no such edge changed).
- **E6 (STRATEGY, list headings).** Items 45 (U6 (g): "tried, not closed") and 47 (amplifiers with T < N:
  "not a proved closure") are entered under the heading "3.1 Families closed by this rule". Each item states
  its own status, so no reader is misled by the item, but a count of "47 closed families" would be wrong by
  two. The tried list has the heading "one more lane allowed" and the amplifier entry "no follow-up lane";
  the entry wins, and the heading should say so.
- **E7 (state already stale; owed list incomplete).** `lanes.jsonl` holds a round-17 line saying cell U6 (e)
  "closes at the first lemma" (not refereed). The cell state is `cell`, which is right until a referee holds,
  but rank 44 of the new top 60 stands on that node, and section 10 lists only U6 (g) as a state to revise.
  Four `REFEREE2.md` files for round-16 lanes (u6g, amplifier, ctheta, qa-filter) were written by another lane
  while this lane ran; rows D10, G42, Q30 say "one independent referee pass" and are to be reread against them
  by the next record lane. Not an error of this lane.

Not errors: dates "2026-11-20" in the map, STRATEGY and ENGINE_LOG are UTC dates (local time 16:38 to 16:54 PST
on 2026-11-19). The count 0 / 60 / 0 is forced by the selection rule once no open device exists (five floored
nodes times the per-device cap of 12 = 60; the list runs down to score 0.29), as the lane says: it is a
statement about the generator, not about leads.

## D. Checks required by the assignment

- RH assumed anywhere: no. No argument is made. The edited rows state where a quoted statement is implied by RH
  (C(theta)) or implies it (the quantitative form of POS-FE: target-level).
- Restates verified height: no claim rests on it; row Q30 records that the measured positivity for zeta is
  implied by verified height, which is a restriction, correctly kept.
- Known theorem presented as new: no. Theorem P is entered as "CLASSICAL in content, new to the campaign record
  only"; Lemma S as elementary; row Q30 as classical in content.
- Zeta-only mechanism: none claimed. No control battery applies to a record lane. The control statements in the
  new rows are quotations; they were compared with the referee files (section B), not rerun.
- PROVED steps of the lane itself: none. The PROVED labels in rows D10, P56, G42 are those of the source
  referee files and were confirmed against them; items 2 to 5 of section B were re-derived here.

## E. Requirement flags (set by this referee)

- R1 false. No argument; nothing uses multiplicativity.
- R2 false. No conclusion at any height.
- R3 false. No device; no control fails anything.
- R4 false. No statement on or towards the critical line.

## F. Surviving claim

Record lane; no attack; nothing about zeros of zeta; headline unchanged at 1 of 4. The eleven `silent-*` nodes
are cells in `engine/curated/devices.json` (U2-POS closed, U6 (g) tried-not-closed, nine cells) with the field
and role `cell` in the graph (graph node type unchanged: open-direction); `generate.py` gives them no device
weight and no waived penalty. Top 60 with an open device 57 -> 0, floored only 3 -> 60, closed 0 -> 0
(reproduced byte for byte). Map 205 -> 208 rows (D10, P56, G42) with G41, Q30, P45, S12b and the BLS notes
edited; the rows agree with their referee files except that row G42 carries the count "394 of 528" without the
restriction of its referee (E2). STRATEGY 0b, 3.1 (items 42 to 47, of which 45 and 47 are not closures) and 4.0
updated. S2 disposition recorded. No round-16 outcome record was missing; `merge_outcomes.py` not run. Changed
numbers are attributed in ENGINE_LOG; in RESULT.md section 5 the increase 861 -> 988 is 117 from the `s2-*`
files and 10 from the `c17-u6e` line (E3). Nine of the eleven corrected sentences stand uncorrected in lane
files and are in the map and `campaign/CORRECTIONS_R16.md`. Literature: one search returned no 2611 identifier
and missed three that are on file; it is not evidence about new preprints (E1). Referees: 1 (this pass).
