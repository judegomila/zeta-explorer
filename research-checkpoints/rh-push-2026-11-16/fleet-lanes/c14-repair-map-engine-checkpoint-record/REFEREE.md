# REFEREE: c14-repair-map-engine-checkpoint-record

Second pass by the lane's own agent with a separate script (`ref_checks.py`, output `ref_checks.json`, `ref_checks.log`;
text and JSON only, run through `scripts/memcap.sh 8`). **It is not an independent referee.** An independent pass is owed
before the checkpoint draft is used by the planner. Lens: does each record edit say exactly what its source says; did any
file change that should not have; is anything stated beyond what is established.

## 1. Checks run (all in `ref_checks.log`)

| check | outcome |
|---|---|
| map diff against `before/OBSTRUCTION_MAP.md` (line level) | 20 lines added (update line and a blank line, 3 notes of section 2, 7 rows, 8 rows of section 7); 8 existing lines modified (UNIV note, rows P53, P54, G33, Z35, D8, the introduction of section 3.9, the row-count line); 0 lines deleted |
| labelled rows | 191 -> 198; new labels D9, G34, G35, G36, L6, P55, Z36; no duplicate label; every labelled row has 6 cells |
| numbers in the new rows against the lane files | 24 strings checked (12,994,697; 629,432; 459,547; 841,651; 0.646; 0.287; 0.193; 1,226; 0.738; 2.2423; "13 device types with a record, 8 recorded passes, 7 recorded failures"; beta <= 7/4; the decay exponent; and others): all present in the cited RESULT or REFEREE file |
| labels required by the assignment | row D9 contains "rank-one Levi inequality: PROVED" and "ARGUED" for the affine kernel; row G36 and device `dictionary-d-kernel-sign-functionals` contain "MEASURED, finite search"; device `kacmoody-loop-eisenstein-maass-selberg` contains "rank-one PROVED, affine kernel ARGUED" |
| battery records | sha256 of `c12/records/screen.json` and `c12/tables/zeros_HEAT--0.5.json` equal the c13 corrected files; the two `.original` files equal the copies taken before the change |
| D1 | 20 of 20 against the record in place, 19 of 20 against the original; the 20 computed values equal those of the c13 run value by value |
| HEAT table in place | 929 on-line, 294 pairs listed, 929 + 2 x 294 = 1517, diagnostic 0 |
| engine | 45 closed, 1 floored, 0 open; ids unique; each of the six new entries cites the independent referee pass, a map row and an open cell; rows parsed 227 -> 234; top 60 identical before and after |
| scoreboard | headline record identical (1 of 4, `c1-leeyang-krein-limit`); differences in parts A and D come from two lines appended to `campaign/lanes.jsonl` by other round-14 lanes during this lane |
| checkpoint draft | 8 statements U1 to U8; every map row it cites exists; "No joint clause" and "their conjunction is not asserted" present; STRATEGY.md modification time unchanged (01:11) |

## 2. Corrections made during the pass (applied; listed so the record shows them)

1. Row G34: the Littlewood-type sentence had the quantifier on s in the wrong place. Source (lane RESULT, Proposition G
   (ii), with referee C2): for s outside a countable set, partial sums of size x^kappa imply no zero with Re rho > 2 kappa.
   Reworded; map rebuilt from the copy; engine rerun with identical counts.
2. `ref_checks.py` compared all of scoreboard part A and reported "headline changed" when another lane's line arrived.
   It now compares the headline record and prints the differences of parts A and D separately.
3. Section 3.9 of the map says "Seven device types tested by one lane" above a table that has had a row D8 from another
   lane since round 13 and now D9. One sentence added to the introduction.
4. The third engine rerun first skipped `generate.py` because of a shell quoting error in this lane's loop (logged exit 1);
   the step was run again and the log section replaced. `CANDIDATES.json` is from that run.

## 3. Objections that remain

1. **Replacing the two c12 files in place.** The assignment says "copy the corrected battery records into
   c12-control-battery-harness (corrected records only)". This lane replaced `records/screen.json` and
   `tables/zeros_HEAT--0.5.json` and kept the originals under new names. The alternative (adding the corrected files beside
   the originals) would have left every reader of the battery on the uncorrected data. The cost of the choice made: the
   lane's own `d1_debranges.py` (numbers typed in) now disagrees with the record beside it, `device_D4.json` was computed
   from the 277-pair table, and the server copy differs from the local one. `records/CORRECTED_RECORDS.md` states all
   three; nothing was rerun to remove them.
2. **`merge_outcomes.py` rewrote 24 outcome entries.** The assignment names the script, and no field was lost, but the
   regenerated notes drop the learn-step prefix and the filled `defeatedBy` lists are keyword readings that include
   controls recorded as passing (for example NR and DH for the loop-group lane, where both pass). 65 new
   control-defeats edges follow. They changed no candidate and no count the planner uses, but the edge type name
   overstates them. The previous file is kept.
3. **The engine state "closed" for dictionary D** is the same value as for proved closures. The evidence text says
   MEASURED, finite search; a consumer that reads only `state` does not see it. `mk_devices.py` has three states and
   this lane did not add a fourth.
4. **Checkpoint draft, U3.** "R3 cannot be tested with the control battery on an identification class" is this lane's
   reading of O row 1b and of the Hamburger and Kaczorowski-Perelli statements; the suggested replacement test (relax one
   hypothesis inside a family where the conclusion is false) is a proposal, not a recorded rule.
5. **Checkpoint draft, completeness.** U1 to U8 were collected from the "not covered" sentences of O section E, the
   rows closed in rounds 11 to 13, map section 6 and the pending list. Rows closed before round 11 were not re-read for
   open cells beyond what O section E and map section 6 already list. The draft says the list is not shown to be complete.
6. **Row L6, one gloss.** "It selects real non-negative local parameters, not unimodular ones" is this lane's reading
   of the Edrei-Thoma criterion applied to an Euler factor, consistent with the lane's list of passes and failures; it is
   not a sentence of the lane or of its referee.
7. **Relabel 1 and relabel 8 (class-N wording)** were already reflected in rows D8 and P54 from the first independent
   referee; this lane added the explicit relabel markers in the status cells. A reader comparing the before and after
   texts will find little change in the "where it stops" cells for those two; that is correct, not an omission.
8. **Second referees.** Rows D9, G34, G35, G36, P55, L6, Z36 rest on one independent pass each. If
   `c14-referee-r13-independent` narrows a statement, the row and the device evidence need the same edit.

## 4. Requirement flags (second pass)

R1 false, R2 false, R3 false, R4 false: a record lane with no argument about zeta. No statement about zeros of zeta is
made in any file written or edited by this lane (searched: the new rows, the notes, the device evidence, the checkpoint
draft each describe obstructions, controls or read sets).

## 5. Verdict of the pass

Holds as a partial result (record lane): the four decisive checks pass and the edits match their sources in the items
checked. Not verified by this pass: the mathematics of the round-13 lanes (taken from their referee files); the
completeness of the checkpoint list; the server copy of the battery.

---

# Independent referee pass (lens: general), 2026-11-19

Written by a separate agent that did not take part in the lane. The text above this line is the lane's own second
pass and is left unchanged. This pass used its own scripts (kept outside the lane: `/tmp/ref_c14/chk.py`,
`/tmp/ref_c14/bls.py`; run through `scripts/memcap.sh 8` with `.venv-arb/bin/python`, mpmath only, under 1 minute
each) and plain-python reads of the JSON and Markdown files. No server use. No file other than this one was written.

## I. Verdict

**Holds as a partial result (record lane).** Every count in the claim was recomputed from the files and agrees. The
one numeric check of the lane (D1) was reproduced with an independent implementation and a different case. No
statement about zeros of zeta is made, RH is not assumed anywhere, verified height is not restated as a result, and
no classical theorem is presented as new (rows D9, G35 and L6 say "classical" or "not a new theorem" where it
applies). Six defects of wording or of record content are listed in section IV; none changes a count or a label.

## II. What was recomputed

| claim | this pass | outcome |
|---|---|---|
| map 191 -> 198 labelled rows; new labels D9, G34, G35, G36, L6, P55, Z36 | own parser on `before/OBSTRUCTION_MAP.md` and the map in place; per-letter counts P 55, Z 39, G 36, Q 29, S 12, D 9, F 8, L 6, T 3, O 1 = 198; no duplicate label; no row deleted | confirmed |
| relabels applied to rows D8, Z35, G33, P54 (and P53, UNIV note) | sentence-level diff of the five rows against `referee_updates.json` of `c13-referee-r12-independent`: each of the eight relabels appears with its restriction; the one upgrade (G33) is marked as such | confirmed |
| lane RESULT / REFEREE files of rounds 12, 13 untouched | modification times all at or before 07:24, before this lane's first file (07:41) | confirmed |
| corrected records in c12, originals kept | sha256 recomputed: `screen.json` = c13 `screen.corrected.json` (88960cfa...), `zeros_HEAT--0.5.json` = c13 corrected (f31a13d9...); the two `.original` files equal `before/c12/` | confirmed |
| D1 20 of 20 on the record in place, 19 of 20 on the original | independent code (mpmath, 40 digits, numerical derivative, no flint, own formulas for the completed functions). Zeta zero 34 from `zetazero(34)`: unnormalised value -5.389100507182945181443853e-69 (record: same to 25 digits). DH window 1000 to 1020: 17 on-line zeros, fail counts 0, 0, 0, 3, 10, 16, minima 0.705888337404966, 0.3103807260967289, 0.022224165438735833, -0.33053338578645175, -0.8703400738555503, -0.9992806838983552: all six equal the corrected record to the printed digits and differ from the original record in all six (for example -0.3348103021277858 at h = 1) | confirmed; the corrected record is the right one |
| different case | DH window 1020 to 1040, h = 1 (not in any record): 20 on-line zeros, 2 failures, minimum -0.3056. The device step fails for DH there as in the registered windows | consistent |
| HEAT table in place | 929 on-line, 294 listed pairs, 929 + 588 = 1517, diagnostic 0 (read from the file; MEASURED, as the lane says) | confirmed as a read |
| device types 39 / 1 / 0 -> 45 / 1 / 0; pending 9 | `devices.json` before and after: six ids added, none removed, no existing entry changed, the other top-level keys identical | confirmed |
| graph 1,677 -> 1,685 nodes, 8,937 -> 9,002 edges, control-defeats 783 -> 848 | read from both graph files; the eight new node ids are `ctl-BLS` and the seven `row-*` | confirmed |
| `merge_outcomes` rewrote 24 entries, no field lost, no verdict changed | 124 entries before and after, same slugs; 24 differ; fields added: `batch`, `defeatedBy`, `notSeparated`, `controlsText`; field changed: `note`; no field removed or emptied; verdict counts identical (84 closed, 37 partial, 3 open) | confirmed (see IV.3) |
| top 60 unchanged | keys and scores identical in order | confirmed for keys, scores, ranks (see IV.4) |
| headline 1 of 4 | `SCOREBOARD.md` in place | confirmed |
| checkpoint draft: U1 to U8, separate statements, no joint clause | read in full | confirmed; "No joint clause" is stated in sections 2 and 4 |

## III. Mathematics recorded as PROVED: what this pass re-derived

The lane proves nothing itself; it copies labels. Re-derived here, to check that the copied labels are not wrong:

1. **Row D9 / control BLS, Theorem B.** With z = x + iy, S = T^(-z) M(z), the Maass-Selberg expression is
   T^x [(1 - abs(S)^2)/x - 2 Im S / y], and Im N / Im z^2 = [(1 - abs(S)^2)/x - 2 Im S / y] / (2 abs(1 + S)^2) for
   N = z(1 - S)/(1 + S). The equivalence holds as an identity. For a Blaschke pair b, the corresponding function is
   n_0(w) = 2 Re(a) w / (w + abs(a)^2), a Nevanlinna function of w = z^2; for a single real factor it is the
   constant a and the composition w(n + a)/(w + n a) is not Nevanlinna for all Nevanlinna n (n = c < 0 real fails),
   which matches "a single real factor is not covered". The general composition step of Theorem C was not re-derived
   here; it was tested: 1,500 random points in 0.02 < x < 3, 0.05 < y < 60, T = 1, 1.7, 10.
   Zeta: no negative value. BLS with three pairs (0.37 + 5.3i, 1.9 + 0.8i, 0.05 + 14.2i): none. T-NR factor
   D(z)/D(z+1) with q = 5, c = 2.6 (b = 0.47; a different case from the lane's): none. Sign control -M: negative at
   252, 60, 4 points. T = 0.8 (outside the statement): negative at 398 points. All as the row says.
2. **T-NR zeros** (section 2 note): x^2 + c x + 1 = 0 with x = q^(1/2 - s), c > 2 gives s = 1/2 +- b - i(2k+1) pi / log q,
   b = arccosh(c/2)/log q: non-real conjugate pairs, inside the strip for b < 1/2; D(iy) is the conjugate of D(1 + iy),
   so the factor has modulus 1 on Re z = 0. Confirmed.
3. **Row D9, DH sentence.** Sum over n >= 2 of abs(a_n) n^(-3/2) = 0.73759 (Hurwitz zeta, 40 digits). The row's 0.738 holds.
4. **Row G35.** The eight poles of G(w) = xi(w + beta - 1) xi(w + 1 - beta) xi(w + i gamma) xi(w - i gamma) were listed
   by hand: six are cancelled by xi at rho, conj rho, 1 - rho or 1 - conj rho; the two that remain are w = 2 - beta
   and w = beta - 1. Pole minus gamma pole = (2 - beta) - (1 - beta) = 1. Confirmed.
5. **Row G33, relabel 7.** c = -(3^(3/2) + 3^(1/2)) = -6.928; arccosh(3.464)/log 3 = 1.7423; extra zeros at Re s = 1/2 +- 1.7423,
   so 2.2423. Confirmed.
6. **Row L6 gloss** (the lane's objection 6 above): by the Edrei-Thoma theorem a factor is totally positive exactly when
   its numerator roots and denominator poles give non-negative real parameters; 1 + c q^(1/2) x + q x^2 has real
   negative roots exactly for c >= 2; 1/(1 + x) and a tempered degree-2 factor with non-real parameters fail. The
   gloss is correct and classical.

Not re-derived: relabel 3 (gamma_p = 1 at beta = 1/2), the Z36 sign rule, Lemma P, the G34 quantifier (checked only
that the reworded sentence has the quantifier where the source string "outside a countable set" has it).

## IV. Defects found (none changes a count; items 1 and 2 should be corrected before the planner uses the draft)

1. **Checkpoint draft, U1 and U2 overlap U3, and the draft does not say so.** The draft defines FE as zeta's own
   functional equation (conductor 1, zeta's gamma factor), as O does for the input-level sentence. With that reading
   every control that is an ordinary Dirichlet series lacks FE by Hamburger's theorem (O says this in the same
   paragraph: "the input level by itself carries no information on which arithmetic input a proof must use"). So
   "every control lacks an input of {FE, GEOM}" and of {FE, SIZE} is true by construction for the same reason as in
   U3, and the caveat of U3 (R3 cannot be tested with the control battery; a relaxation test is needed) applies to
   U1 and U2 as well. The draft states this caveat for U3 only and lists U1, U2 as if the control check carried
   information.
2. **Checkpoint draft, U1, reasons per control.** Several reasons name an input that is not in the set: "DH lacks EP"
   (O's own sentence is that DH lacks FE in this reading; it also has no local parameters), "HEAT is not an ordinary
   Dirichlet series" (INT), "BLS is defined on scattering coefficients only", "UNIV is ... out of scope". And "E_a,
   EIS-w and T-NR lack GEOM" is written as if they had FE; in the draft's own definition they do not (different
   gamma factor; conductor q^2). The conclusion (each control lacks FE or GEOM) is correct; the listed reasons mix
   the strict and the loose reading of FE.
3. **RESULT section 2.5, last paragraph.** "({INT, GEOM}, the third, is now inside the class of THIN and U); this was
   checked control by control in the draft": the string {INT, GEOM} does not occur in the draft. The statement is
   consistent with O line 1 (THIN's class contains GEOM and INT) but it is a sentence of RESULT.md only.
4. **"Top 60 unchanged" is true for keys, scores and order only.** 20 of the 60 candidates have a changed
   `rowsChecked` list (new rows enter: G34 in 11, G36 in 5, D9 in 4, G35 and P55 in 1 each, each displacing an older
   adjacent row from the list of six), and one candidate has its `reason` notes reordered. This is the intended
   effect of the new rows and should be reported as such.
5. **`merge_outcomes` and the note prefix.** "No field lost" is exact. The dropped prefix "round N, score 0, referee
   holds:" carried the round and the score; the 24 rewritten entries have no `round` or `score` field (they have
   `refereeHolds`; the round is readable from the slug only, the score from `campaign/lanes.jsonl` only). All 24 get
   `batch` 0. The `defeatedBy` list of `c13-kacmoody-eisenstein-affine-weyl-shift` is [NR, DH, EA] while its
   `controlsText` says E_a "fails on grids" in the formal kernel and DH is "measured": the lane discloses this
   (objection 2 above); it remains uncorrected in the engine.
6. **Small.** RESULT section 0 says "all four decisive checks pass" above a table of five. The lane's `lanes.jsonl`
   line is not in `campaign/lanes.jsonl` at the time of this pass (0 matches), so the scoreboard does not yet count
   this lane. The c12 battery lane is left internally mixed (its `d1_debranges.py` still reports 19 of 20;
   `device_D4.json` was computed from the 277-pair table); disclosed, not repaired.

## V. Controls

No zeta-only mechanism is claimed, so there is no control table to break. The control content that the lane records
was run where it could be: BLS, T-NR and the sign control on the rank-one inequality (III.1), DH on the D1 step in a
new window (II). Results agree with the rows. The single real Blaschke factor (a = 0.6) showed no negative value on
this pass's grid; the row says "not covered", not "fails", which is the correct wording.

## VI. Requirement flags (set by this pass)

R1 false, R2 false, R3 false, R4 false. A record lane: no inequality, no conclusion at any height, no mechanism
that a control could fail, no passage to the critical line.

## VII. Surviving claim

Record lane, nothing about zeros of zeta. Map 191 -> 198 rows with the labels stated (D9 rank-one PROVED and affine
kernel ARGUED; G36 MEASURED, finite search); eight relabels applied to map rows only; corrected battery records in
place in c12 with originals kept, and D1 agrees with the corrected record (20 of 20; confirmed by an independent
implementation); engine 45 closed / 1 floored / 0 open, parsed rows 227 -> 234, top-60 keys and scores unchanged
(adjacent-row lists of 20 candidates changed), 24 outcome entries rewritten with no field lost and the round / score
prefix of their notes dropped; headline 1 of 4. The checkpoint draft is an unrefereed reading: U1 and U2 need the
caveat of U3 (IV.1) and corrected per-control reasons (IV.2) before use.
