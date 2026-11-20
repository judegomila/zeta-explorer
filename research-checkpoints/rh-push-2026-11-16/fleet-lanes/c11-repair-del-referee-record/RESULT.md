# c11-repair-del-referee-record: second referee of the deletion control, Statement O version 3, map, engine, scoreboard

Date 2026-11-19. Slug `c11-repair-del-referee-record`. Kind: repair (referee, repair and record slot of round 11).
No R4 answer (record work); no requirement score. No statement about zeros of zeta is made anywhere in this lane.
The compute server was not used. No process was signalled, stopped or inspected (the `euler` waiters are untouched).
Nothing committed or pushed.

Labels: CONFIRMED (re-derived here) / CONFIRMED-rel X / MEASURED / ARGUED / OPENED / RECALLED.

## Verdict

Partial result (record). The decisive test is positive.

1. **Decisive test.** "Lambda_F >= 0, simple real zero at b in (1/2, 1)" for the thin prime deletion control DEL_b
   **holds as stated, relative to one cited theorem** (a counting form of a short-interval prime theorem; source
   Huxley 1972, asymptotic for theta > 7/12). Lemma 1, the repaired Lemma 0 and the tail bounds were re-derived
   line by line (`REFEREE2.md`). The primary text was not opened; the statement was read in a second, independent
   secondary source. The control is therefore labelled "relative to Huxley 1972", not PROVED outright.
2. **Numeric check (new cases b = 0.6, 0.85 to 2e7, own code).** The object is not identically zero and is not
   zeta (G(2) = 0.93121 and 0.91503; residue G(1) in [0.52750, 0.52758] and [0.27665, 0.28343]). Density one:
   exponent 0.99998 and 1.00002 at b. Density one half: exponent 0.50068 and 0.49997 in X and 0.496, 0.493 in
   s - b at 0.0125, with G/(s - b) growing like (s - b)^(-1/2): a branch point of order two, not a zero.
3. **Statement O version 3** written as a new file (`STATEMENT_O_v3.md`): line 3 repaired, lines 1 and 5 and
   section C rows 1b, 2a rewritten against DEL, previous text kept verbatim in an appendix. Count: PROVED 4,
   PROVED relative to a cited theorem 1 (line 5), MEASURED 1, ARGUED 6. Separate conditional statements per read
   class; no joint clause. The c9 file is unchanged.
4. **Map.** Rows proposed by round-10 lanes 1, 3, 6, 7 applied with their referees' corrections: control row DEL,
   rows P52 and Z33, the slot split in row Z30, four rows of section 7, row O1 updated. 180 -> 182 rows.
5. **Engine.** Three open device types with nodes, control DEL, rerun; counts in `engine/ENGINE_LOG.md`.
6. **Scoreboard** rerun; part C shows the current graph (1,649 nodes). FRONTIER text not edited.

## 0. Plan

Read: BRIEF to the end; STRATEGY sections 1, 2, 3.1, 4.0, 5; ROUND_LOG "Round 10 results" (lessons 7, 9; the list
"NOT done by this step") and the round-11 allocation; MAP_PENDING (status sections); the DEL lane (RESULT,
REFEREE, `del_control.py`, logs); Statement O (c9 file) with both referee files of `c10-repair-record-referee-r9`;
the map's controls section and rows Z30, Z32, T3, O1; the RESULT and REFEREE files of round-10 lanes 1, 6, 7.
Order of work as assigned: (1) referee, (2) Statement O, (3) map, (4) engine, (5) scoreboard. The decisive test
was done first. It did not kill the item, so no pivot was used.

Answers required of every lane (STRATEGY section 1): R1, R2, R3, R4: none; this is a repair lane with no attack.

## 1. Second referee of `c10-thin-deletion-zero-mode-control` (file `REFEREE2.md`)

- Lemma 0: upper bound D <= 0 CONFIRMED (unconditional). Lower bound CONFIRMED-rel S(theta) with the dyadic split
  of the first referee, which is needed and correct (additivity of B; each full piece [z, 2z] and the last short
  piece fall under the two stated cases).
- Lemma 1 (i) to (vi): CONFIRMED-rel S(theta). The factor (s - b) comes from exp(-E_1(w)) = e^gamma w exp(-Ein(w));
  W is an exponential of a function analytic on Re s > max(b - eta, b/2); zeta(b) is finite and non-zero on (0, 1).
  Consistent with Landau's theorem (the first real singularity of log F is the pole at 1).
- Tail bounds: tau_X and Tier 0 CONFIRMED from D <= 0 alone. Tier E derivation CONFIRMED-rel two explicit bounds,
  including one implicit step (the majorant must be monotone across 1.4e25; it is).
- New remarks: (C2) the sources state the theorem for intervals ending at x; the lane's form follows with a
  slightly smaller exponent. (C3) The 4% width of the Tier E enclosure depends on Trudgian 2016 Theorem 2 as
  printed, which neither referee confirmed; with the Fiori-Kadiri-Swidinsky form the upper end is 73 to 165 times
  the lower end. The unconditional lower ends stand. (C4) Relative to the classical prime number theorem alone,
  G(s)/(s - b) tends to a non-zero limit as s -> b+ (ARGUED): a fallback if the secondary sourcing is rejected.
  (C5) DEL and THIN cover read sets with positivity and no unimodular parameters on S, or the reverse; not local
  parameters of modulus strictly between 0 and 1. The lemma needs only a proportion x^(b-1) of the expected
  primes in each interval, still a theorem of Hoheisel type.
- Numeric run `ref2_del.py` (local, `scripts/memcap.sh 8`, 2 s, 20 MB): tables in `REFEREE2.md` section 2. New
  displays: the exponent in the s-direction; stabilisation of the continued factor W_X(s) at points left of b and
  a sign change of zeta(s)(s - b) W_X(s) across b (+0.131 / -0.183 at b = 0.6; +0.479 / -0.948 at b = 0.85).
  These are displays under bounded discrepancy beyond 2e7, not proofs.
- Sources opened today: arXiv:2308.04458v8 introduction (Hoheisel 1 - 1/33000; Huxley theta > 7/12, asymptotic;
  Baker-Harman-Pintz 0.525 as an existence statement); abstract pages of arXiv:1410.7015 and arXiv:1401.2689.

## 2. Statement O version 3 (file `STATEMENT_O_v3.md`, builder `mk_statement_v3.py`)

- **Line 3, the two-sentence repair** (E1 of the round-10 referee). Sentence 1: the proved form is the read set
  {EP, POS, FE (degree 2), finite order}; E_a has these inputs and vanishes on Re s = 1/2 + a. Sentence 2: the
  input ZF(theta) is not part of the proved form; E_a satisfies it exactly for theta >= Theta + a, membership at
  theta = 1/2 + a is equivalent to RH and is not claimed, and the bootstrap sentences are ARGUED relative to lane
  `bootstrap`. Growth and pole wording corrected as the referee asked.
- **Line 1.** Three separate zero-mode statements: (Z-1) DEL for {POS, SUPP, SIZE0, EP, INT, pole, continuation};
  (Z-2) THIN for {SUPP, SIZE0, EP, GEOM, INT, pole, continuation}; (Z-3) E_a for {EP, POS, FE}. Limits stated:
  Lemma C concerns the deleted factor; POS with GEOM at every rational prime is an identification (Lemma I);
  half density is a branch point. Step mode unchanged (ARGUED).
- **Line 5.** Control DEL in both readings (over the integers; as a Beurling system). Label "PROVED relative to
  Huxley 1972" (two referee files on the closing step). The read set excludes the residue normalisation at 1
  (a completely multiplicative a with abs(a(p)) <= 1 and residue 1 is zeta; one-line proof checked here; the
  observation is Lemma J of the sibling lane `c11-del-device-read-confirm`). The P36 cell is left undecided: the
  DEL lane and the sibling re-read disagree and neither has a second reader.
- **Section C.** Row 1b: two separate conditional statements (DEL; THIN) and E_a for its own read set; B removed.
  Row 2a: DEL, THIN, U; "the integers" dropped from the item, because both written controls are ordinary
  Dirichlet series; P36 no longer cited.
- Also changed: control list, count paragraph, one sentence of section D and one of section E. Twelve replaced
  passages are kept verbatim in the appendix; `before/STATEMENT_O.c9-2026-11-18.md` is the unchanged source.
- Reservation: this lane wrote the second DEL referee file and then version 3. No reader stands between them
  (the same pattern as E3 of the round-10 referee). The c9 file was left unchanged for that reason.

## 3. Map (`push/OBSTRUCTION_MAP.md`; scripts `apply_map.py`, `apply_map2.py`; `map_edits.json`)

Previous file: `before/OBSTRUCTION_MAP.md`. 551 -> 561 lines; rows 180 -> 182 (P 52, G 31, Q 27, S 12, Z 36, F 8,
T 3, L 5, D 7, O 1); controls in the section 2 table 9 -> 10. Ten hunks, no row id duplicated.

| lane (round 10) | applied | status words |
|---|---|---|
| 3 `c10-thin-deletion-zero-mode-control` | control row DEL and a note in section 2; row B kept as a literature pointer | PROVED-rel Huxley 1972; two referee files |
| 1 `c10-ff-slot-cross-decomposition` | round-10 text in row Z30 with the referee's four corrections | PROVED (identity), EXACT, MEASURED, POST-HOC, ARGUED; one referee |
| 6 `c10-spectral-reciprocity-signed-moduli` | row P52 (with the n4 lane, which had no row) | CLASSICAL / PROVED for weight 1; ARGUED over recalled formulas; one referee |
| 7 `c10-ff-signal-intersection-square` | row Z33 | PROVED (Lemma 1), EXACT; one referee |
| (bookkeeping) | row O1, section 7 (four rows), header line "seventh", row count | |

`campaign/MAP_PENDING.md` has a status section "fifth" with what is still pending (rows of round-10 lanes 2 and 5;
round-11 proposals that arrived during this lane).

## 4. Engine (`engine/ENGINE_LOG.md`, section "Round 11 repair slot")

- `curated/mk_devices.py`: device types `twist-modulus-reciprocity`, `regular-rep-matrix-bridge`,
  `de-branges-positivity-family`, state open, nodes in the new file `nodes/nodes-20.json`; RS-1 to RS-3 stay
  pending proposals (RS-1 and RS-3 now name their lanes). Previous file `engine/scratch/mk_devices.pre-c11-repair.py`.
- `curated/controls.json`: control DEL (status proved-relative).
- The three explore lanes reported while this lane ran: each stops at stage A (author checks only). The states
  were left open as assigned; the evidence texts state the reports and that closure waits for the learn step.
- Rerun through `scripts/memcap.sh 8` (`engine_rerun.log`): 37 device types (33 closed, 1 floored, 3 open); 100
  outcome entries (66 closed); 34 closed families; 218 map rows parsed; 17 controls; 1,649 nodes (963 live);
  8,900 edges; 44,860 generated; 14,980 scored (before: 1,643 / 8,864 / 36,569 / 8,438). Top 60: 12 on each open
  device node, 24 on the floored 7/8 device.

## 5. Scoreboard (`campaign/scoreboard.py`, not edited; FRONTIER text not edited)

Rerun after the engine and again after this lane's line was appended (the round is in progress: 96 lane lines
at that moment, 6 of round 11, three of them without a referee). Part C: 1,649 nodes (527 marked closed), 287
tags, 41,041 tag-pair families, 2,092 closed, 517 tried and not closed, 38,432 untried. This lane's line has an
empty node list, as the earlier repair lanes, so it marks no device family as tried. The change from 35,511 families is the tag count 267 -> 287,
which was already present in the graph built by the strategy review (1,643 nodes); the six nodes added here add
no tag. Headline unchanged: 1 of 4. Previous files in `before/`.

## 6. Controls

No device is proposed, so there is no control table to fill. The work is on a control:
- DEL is a control with Lambda >= 0 for which the conclusion "no zero in Re s > 1/2 off the line" is false (zero
  at b). Checked not to be identically zero, not to be zeta, and to have a zero and not a branch point.
- Controls on the control: empty S gives zeta; half density gives a branch point; finite truncations are positive
  at b (the zero is not in the data).
- Davenport-Heilbronn, backward heat, sign twist and the others: not applicable to a record lane.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 | false | no argument about zeta; referee and record work |
| R2 | false | no conclusion about zeros in windows |
| R3 | false | no device; a control was confirmed and entered in the record |
| R4 | false | no step toward the critical line (declared in the assignment) |

aboutZeros = false. Score 0 by construction.

## 8. Three weakest steps

1. **The short-interval theorem is still read at second hand.** Two secondary sources agree on Huxley's statement;
   the primary text was not opened, and the passage from "asymptotic for intervals ending at x" to the lane's
   counting form is two lines written by referees. Every use of DEL (lines 1 and 5, map row DEL) is relative to it.
2. **No reader between the second referee file and version 3.** The same lane confirmed the lemma and then raised
   the label of line 5 to "PROVED relative". The second pass was a re-derivation with new cases, but it is one
   agent's reading; the Tier E enclosure in particular rests on an explicit bound that nobody confirmed.
3. **Map rows written from lane and referee text, not replayed.** Rows P52, Z33 and the Z30 addition carry the
   referees' corrections, but no computation of those lanes was rerun here; the DEL row quotes a device count
   (14 / 20) that a sibling lane has since changed to 11 / 23 without an independent referee; the P36 cell for
   DEL is undecided.

## 9. Not done, for the planner

- Outcome records and device closures for the three round-11 explore lanes (learn step).
- Replacement of the c9 Statement O file by version 3 (needs a reader who is not this lane).
- Rows G32, Landau-Siegel, P36 cell, Statement O row 3 (proposed by `c11-del-device-read-confirm`, unrefereed).
- The owner decision on the `euler` waiters (round-10 lesson 9a): still open; no action taken here.
- The literature rescan of STRATEGY section 2 was not run in this slot (last scan 2026-11-18).

## Files

`RESULT.md`, `REFEREE2.md` (second referee of the DEL lane), `REFEREE.md` (author's own check of this lane, not
an independent referee), `ref2_del.py`, `ref2_del.json`, `ref2_del.log`, `STATEMENT_O_v3.md`,
`mk_statement_v3.py`, `apply_map.py`, `apply_map2.py`, `map_edits.json`, `engine_counts.py`,
`engine_counts_before.json`, `engine_counts_after.json`, `engine_rerun.log`, `engine_rerun.first.log`,
`lanes_line.json`, `before/` (previous map, Statement O, devices, scoreboard, lanes, graph, candidates, logs).
Edited outside this directory, as assigned: `push/OBSTRUCTION_MAP.md`; `engine/curated/mk_devices.py`,
`engine/curated/controls.json`, `engine/curated/devices.json`, `engine/nodes/nodes-20.json`,
`engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json`, `engine/outcomes.json`, `engine/closed_families.json`,
`engine/nodes/nodes-15.json` (regenerated), `engine/ENGINE_LOG.md`, `engine/scratch/` (two previous files);
`campaign/MAP_PENDING.md`, `campaign/SCOREBOARD.md`, `campaign/scoreboard.json`, `campaign/lanes.jsonl` (one line).
