# REFEREE (independent pass, lens: general): c15-repair-record-strategy-v4-report

Date 2026-11-19. Written by an agent that did not do the lane. Target: `RESULT.md` and the files it changed
(`push/OBSTRUCTION_MAP.md`, `engine/build_graph.py`, `engine/curated/*`, `engine/IDEA_GRAPH.json`,
`campaign/STRATEGY.md`, `campaign/CAMPAIGN_REPORT_R15.md`, `campaign/scoreboard.json`, `campaign/lanes.jsonl`).
Checks were redone with separate code (text and JSON only, local, `scripts/memcap.sh 8` for the one numeric run);
the compute server was not contacted (the lane has no numerical question). The lane's own second pass is kept
unchanged below this section.

## Outcome

**Holds as a record lane (verdict "partial-result"), with four wording corrections owed in files the lane wrote
(items E1 to E4). None changes a count, a row label or the decisive check.** No statement about zeros of zeta is
made in any file written or edited. No step assumes RH, no step restates verified height, and no known theorem is
presented as new (the classical items in rows G37 to G40 are labelled CLASSICAL or "relative to" a source).

Flags set by this pass: R1 false, R2 false, R3 false, R4 false. aboutZeros false. Score 0.

## What was redone and confirmed

| claim in RESULT.md | how checked here | result |
|---|---|---|
| map 198 -> 202 rows, G37 to G40 added, none removed, no duplicate label | own parser on `before/OBSTRUCTION_MAP.md` and the live map | confirmed (P 55, G 40, Q 29, S 12, Z 36 + Z15b, Z15c, Z24b, F 8, T 3, L 6, D 9, O 1) |
| the map edit is reproducible and nothing else touched the map | `apply_map.py` run on the `before/` copy into a temporary file, `cmp` with the live map | byte-identical; 24 edits |
| lines of the old map changed | line and character diff | 11 lines: notes BLS, Lemma P; rows P55, G26, G34, G35, G36, Z36, L6, D9; row-count line. Every inserted string is a restriction, a second-referee note or the G37 pointer |
| 13 restrictions present, each in the sense of `c14-referee-r13-independent` section 4 | read against that section item by item | all 13 present; 1 in L6, 2 and 3 in P55 (3 also in note Lemma P), 4 in note BLS and D9, 5 and 6 in D9, 7 to 9 in G34, 10 in G35, 11 and 12 in Z36, 13 in G36 |
| `CONTROL_CODE_RE`: one line changed | `diff` against `before/build_graph.py` | one line (174) |
| regex behaviour | new test strings (not the lane's): "T-NR-vec typed; (NR-vec) and NR, BLS-type; BLS.; UNIV-filter; SUBLS; UNIVERSAL; BLS_x; `NR-vec`" | NR-vec, NR, BLS, UNIV found where written as codes; SUBLS, UNIVERSAL, BLS_x not matched; old codes unchanged. See E5 for three edge strings |
| graph 1,690 -> 1,695 nodes, 9,002 -> 9,020 edges, 848 -> 866 control-defeats | set difference of `before/IDEA_GRAPH.json` and the live graph | new nodes `ctl-NR-vec`, `row-G37` to `row-G40`; 18 new edges, all control-defeats: 17 into the new rows, 1 `ctl-BLS -> row-D9`; no edge removed |
| devices 45 / 1 -> 50 / 1 / 0; pending 9 -> 8; RS-1..3 replaced by U3, U6 (e)-(g), U8 | `devices.json` before and after | confirmed; the removed fourth entry (Lax-Phillips norms) is now a device |
| `merge_outcomes.py` not run; outcomes byte-identical | sha256 of `outcomes.json`, 132 files of `outcomes/`, `closed_families.json` against `before/`; modification time of `outcomes.json` (09:52, before the lane) | identical |
| scoreboard parts A, B, D unchanged; part C attributed | field-by-field flattening of four files (on file, baseline rerun, after edits, live) | on file / baseline / after edits differ only in part C and the timestamp, with the values of RESULT 2.4; the live file differs from "after edits" only by the lane's own line (lanes 123, score-0 lanes 121, history row 15) |
| hold rate 110 of 122 = 0.9016, 111 of 123 = 0.9024 | recomputed from `lanes.jsonl` | confirmed |
| STRATEGY 0a table by kind | recomputed from `lanes.jsonl` (rounds 1 to 14) | every cell reproduced (total 122 / 2 / 110 / 92 / 11) |
| STRATEGY is version 4; v3 kept; directive section kept | headings read; `before/STRATEGY.as-of-v4-edit.md` equals `engine/scratch/STRATEGY.v3.md` | confirmed |
| report: 202 rows, 35 / 138 / 29 / 0 referee-record counts | section table summed by column | sums agree with the totals |

Since the lane finished, another round-15 lane appended a line to `lanes.jsonl` (124 lines now). The map is unchanged.

## Mathematics entered in the record: steps re-derived in this pass

The lane proves nothing; it copies statements. The following copied statements were re-derived or recomputed here,
to test whether the rows say what is true and what the referees said.

1. Note NR-vec. With F = sum b(m) e(mz): (1/q) sum over j mod q of F(z + j/q) keeps the terms with q | m, so F_0
   has coefficients b(m) 1[q does not divide m]; F x chi_q has b(m) chi_q(m); (F_0 - F x chi_q)/2 has
   b(m) 1[(m/q) = -1]. Squares are residues or divisible by q, so every square-index coefficient vanishes at
   every parameter. For the principal character with the Gauss-sum normalisation, g = -1 and the multiplier is 1
   for q not dividing m and -(q - 1) for q | m. The note is correct as written.
2. Row G39, 2-adic control. 2^(1-u) = -1 at u = 1 + i pi k/ln 2, k odd, so 1 + 2^(1-u) = 0 and 1 + 2^(-u) = 1/2.
   Recomputed (Borwein series, float64): abs(zeta(1 + i pi/ln 2)) = 0.729512 (row: 0.7295). Different case:
   k = 3 gives 0.458686, k = 5 gives 1.078803; the control is a family, not one point. The values abs(A(4)),
   abs(A(16)) were not recomputed.
3. Row G39, pole count. Constant-term exponents s, 1 - s with Re s = 1/4 + beta/2 give squared-modulus exponents
   1/2 + beta, 3/2 - beta, 1 +- i gamma; the larger real one is 1 + abs(beta - 1/2); minus abs(beta - 1/2) is 1
   for every beta. Agrees with the row (positions relative to the regularised Rankin-Selberg method, as labelled).
4. Row G37. T_p on constants has eigenvalue p^(1/2) + p^(-1/2). sum over dd' = n of cosh(log(d/d') nu) =
   n^(-nu) sigma_(2 nu)(n). L^q admissibility of y^(1/2+a) in the cusp is q(1/2 + a) < 1. Lemma Q ratio for n
   prime is 1/(1 + n^(-2 theta)): 0.9998979 at n = 9973, theta = 0.499 (row: 0.99990). Different cases:
   0.9999902 at n = 104729, theta = 0.499; 0.9734 at n = 30030, theta = 0.45; 0.8494 at n = 720, theta = 0.33.
   Below 1 and tending to 1, as the row says.
5. Row G38. 3(1 - sigma)/(2 - sigma) and 2(1 - sigma)/sigma both equal 1/2 at sigma = 4/5; the two ranges are
   those of Montgomery's Theorem 12.1 as recalled. Identity TW for a bump supported at log m only is the equality
   chi(m) c = (c chi)(m).
6. Row G40. E*(z, s) at s = rho/2 has constant term xi(rho) y^s + xi(2 - rho) y^(1-s) (using xi(rho - 1) =
   xi(2 - rho)), so cuspidality at a zero in the open strip needs xi(2 - rho) = 0 with Re(2 - rho) > 1. Dictionary:
   abs(Re s - 1/2) = (1 - beta)/2 <= theta is beta >= 1 - 2 theta; for the weight-1/2 object abs(beta - 1/2) <=
   theta. For a torus object with n >= 2 the Rankin-Selberg product has n diagonal zeta factors, so the pole at 1
   is not simple. All agree with the row.
7. Note Lemma F and the E1 entry. R_a(w) = X(w - a)/X(w + a) has a pole at lambda - a, in Re w > 0 only if
   Re lambda > a, cancelled when X(lambda - 2a) = 0. Counter-example re-derived: a = 1/4, zeros +-0.35 +- 3i and
   +-0.15 +- 3i; after cancellation R = product over the two signs of the imaginary part of
   (w - 0.6 -+ 3i)(w - 0.4 -+ 3i)/((w + 0.6 -+ 3i)(w + 0.4 -+ 3i)), each factor of modulus below 1 in Re w > 0
   and 1 on the axis, with zeros of X off the axis. E1 is false as written; NOT HOLDING is the right entry. The
   quoted "supremum 0.99999" is a grid value; the supremum is 1 (approached on the axis and at infinity).
8. Row L6 (restriction 1). 2 cosh(x) + c = 0 with c = 2 has x = i pi (2k + 1) (on the line, double); c > 2 gives
   Re x = +-arccosh(c/2). Agrees.

Numbers quoted in rows G37 to G40 were also located in the four referee files (0.7295, 0.2162, 0.3243, 3.1e-12,
0.99990, 1.4e-8, 141 and 192, 0.07 to 0.10, the six failing entries, "Re w = P - 1").

## Errors and corrections owed

- **E1. `CAMPAIGN_REPORT_R15.md` section 2.4: "no control on file has zeta's own functional equation, so
  requirement R3 cannot be tested there with the control table" is false as written.** Map section 2, row NR,
  lists for T-NR "zeta's gamma factor and field-level functional equation": xi(s)(2 cosh((s - 1/2) log q) + c) is
  invariant under s <-> 1 - s with zeta's gamma factor. HEAT keeps evenness. Hamburger's theorem excludes only
  ordinary Dirichlet series; `STRATEGY.md` 4.0 has the restricted wording ("every control that is an ordinary
  Dirichlet series lacks FE") and the report dropped the restriction. Replace by: "no control on file that is an
  ordinary Dirichlet series has zeta's own functional equation (Hamburger); T-NR and HEAT keep the symmetry and
  lack exact local structure at one prime, respectively a Dirichlet series". The same over-wording is in the
  pending entry U3 only for U3 itself, where it is the definition of the class. Note: lane
  `c15-control-with-zeta-fe-classes-u1-u2` (reported after this lane, unrefereed) claims U1 and U2 are not
  control-free; STRATEGY 4.0, report 2.4 and the pending entries must follow its referee.
- **E2. `CAMPAIGN_REPORT_R15.md` section 1 ("Every referee in this record is an internal adversarial pass by
  another agent") and section 4 ("Lanes run: 122, each refereed at least once") are not true of the files.** The
  REFEREE.md of `c12-repair-sources-statement-o-v3` ("count it as zero independent referees"),
  `c13-repair-map-engine-battery-records` ("refereeHolds should be recorded as null and referees = 0") and
  `c14-repair-map-engine-checkpoint-record` ("It is not an independent referee") are author passes, and
  `lanes.jsonl` records each as refereeHolds true, referees 1. With these three not counted the figures are 119
  lanes with an independent referee, 107 holding, 89.9% (against 110 of 122, 90.2%). The scoreboard figure is
  inherited, not produced by this lane, and RESULT 2.4 states the same convention for the lane's own line; the two
  report sentences are this lane's and need the qualifier "except the author passes of three repair lanes
  (four with this one)". Other lanes were not audited for this; the count may be larger.
- **E3. Part-B figure rounding.** The report and STRATEGY 0a print 0.8748866470 next to the method infimum
  0.874886647039964. As a bound on an abscissa the figure is rounded below the infimum; 0.8748866471, or the
  infimum itself, is the correct form. No dependence of the lane on the last digit.
- **E4. `STRATEGY.md` version 4, first paragraph, carries the compute limits of 2026-11-18** (4 cores, 8 GB,
  3 hours; one heavy lane) after the BRIEF update of 2026-11-19 (8 cores, 12 GB, 6 hours; numerical first tests
  on the server). RESULT states that the lane did not reconcile the lane counts with the directive section; the
  header limits are a second place where version 4 and the BRIEF differ. For the planner.
- E5 (minor, engine). With the new regex "NR-vector" and "NR-vec2" are read as NR, and "UNIV(" is not read
  (the lookahead excludes an opening bracket). No such string is in the map today.
- E6 (minor, report). The referee-record count gives row G32 one record; the map header says "author's check
  only". The report's caveat (count per source lane) covers it, but the sentence "the 35 rows with no referee
  record come from the lanes the map header lists as unrefereed" should not be read as "every other row was
  refereed".
- E7 (minor, device table). "50 closed, 0 open" stands beside 8 pending entries whose state field is "open";
  four of the five new closed types have named open cells, and `dictionary-dj-joint-pair-sign-functionals` is
  closed on a finite search with a ruling on its lifts owed. The report names these; the state word "closed"
  means "closed in the form tested". Edge `ctl-BLS -> row-G37` exists although BLS was not run there (stated in
  RESULT 2.4).

## Not checked

- The wording of rows G37 to G40 was compared with the referee files at the points listed above, not sentence by
  sentence. Restriction 9 (sign of the frequency set at m = q^2 in H_+) was not re-derived here either.
- abs(A(4)), abs(A(16)) at the 2-adic point; the DH twist measurement; the catalogue sources of row G40.
- "Server not used": no unit of this lane was looked for on the server; the lane contains no numerical job.
- Whether `ROUND_LOG.md` and RESULT files of earlier lanes were left unedited (taken from the lane's check).

## Flags (independent pass)

R1 false, R2 false, R3 false, R4 false. aboutZeros false. holds = true for "partial-result (record lane)", with
E1 to E4 owed to the next repair lane.

---

# Earlier pass kept unchanged: same-agent second pass of the lane

# REFEREE: c15-repair-record-strategy-v4-report

Date 2026-11-19. **This is a second pass by the agent that did the lane, with separate check code (`ref_checks.py`, output `ref_checks.json`, log `ref_checks.log`; text and JSON only, run through `scripts/memcap.sh 8`, under 10 s). It is not an independent referee.** The lane could not start another agent. It counts as one referee record under the campaign's convention for repair lanes; an independent pass on rows G37 to G40 and on STRATEGY section 4.0 is owed (the first by `c15-referee-r14-independent-checkpoint`, if it covers the map wording; otherwise by the round-16 repair lane).

Lens: does each record edit say what its source says; is every count reproducible from the files; did any edit touch something outside the assignment; is anything worded as a result about zeros.

## Outcome

**Holds as a record lane, with the corrections below applied before the final rerun.** No statement about zeros of zeta is made in any file written or edited (map rows and notes, device evidence, STRATEGY v4, the report, the engine log). No RH assumption and no restated verified height enter. Flags R1 = R2 = R3 = R4 = false.

## Checks run (all in `ref_checks.json`)

| check | result |
|---|---|
| map rebuilt from `before/OBSTRUCTION_MAP.md` by `apply_map.py` equals the live file byte for byte | true (so no other process edited the map while the lane ran, and the edit is reproducible) |
| labelled rows before / after; added; removed; duplicate labels | 198 / 202; G37, G38, G39, G40; none; none |
| lines of the old map that changed | 11: notes BLS and Lemma P, the row-count line, rows D9, G26, G34, G35, G36, L6, P55, Z36. No other row was touched |
| cells per new row | 6 each (the table has six columns) |
| restriction numbers present in the map | 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13 by number; 5 and 6 are inside "4 to 6" in row D9 (read by eye) |
| E1 marked NOT HOLDING with the name of the repair lane | true (section 2 note and section 7 row) |
| `CONTROL_CODE_RE`: lines changed against the saved copy | 1 |
| regex behaviour on test strings | "T-NR passes; NR-vec (note) passes; BLS passes; UNIV out of scope; EIS-w passes" -> BLS, EIS-w, NR, NR-vec, UNIV; "NR-vec passes" -> NR-vec only (not NR); "BLSX UNIVERSAL" -> nothing; "DH, HEAT, U, B" unchanged |
| 33 numbers and phrases quoted in the new rows and restrictions, searched in the referee files they are attributed to | 32 found verbatim; "(0.62, 9.3)" is written "beta = 0.62, gamma = 9.3" in the source |
| files of round-12 to round-14 lane directories modified after this lane started | none |
| device types; pending; RS entries left in pending | 50 closed, 1 floored; 8; none |
| graph | 1,695 nodes, 9,020 edges, 238 parsed rows, 20 controls, 963 live |
| `outcomes.json` and the 132 files of `outcomes/` against `before/` (sha256) | identical |
| scoreboard part A (headline, histogram), part B, part D: before against after | equal field by field; headline 1 of 4, hold rate 0.902 |
| scoreboard part C | nodes 1,685 -> 1,695, marked closed 561 -> 570, tags 398 -> 423, families 79,003 -> 89,253 (closed 3,034 -> 3,190, tried 633 -> 651, untried 75,336 -> 85,412). The baseline rerun with no edit already gives 1,690 / 566 / 423 / 89,253 / 3,190 / 651 / 85,412; this lane's share is +5 nodes and +4 marked closed |
| top 60: node ids, order, scores | identical; 16 candidates differ in `rowsChecked` only |
| STRATEGY: title; the required sentence; rows U1 to U8; allocation sentence; change-log entry; appended directive section | version 4; present; all eight; present; present; byte-identical to the copy taken before the edit |
| report: headline, figure 0.8748866470, "Riemann hypothesis is open", 202 rows, device counts, Statement O label counts; evaluative words searched | all present; none found |

After the lane line was appended the scoreboard was rerun: lanes 122 -> 123, score-0 lanes 120 -> 121, hold rate 0.9016 -> 0.9024 (printed 90.2% both times), headline unchanged. The hold rate counts this file as a holding referee record although it is a same-agent pass; with the line counted as not refereed the rate would be 110 of 123 = 89.4%.

## Errors found in this pass and corrected

1. **Section 7 row for lane 6 said "list L-c of seven entries".** The lane's list L-c has four entries (E4, E7, E11, E12); the referee moves E7, E11, E12 out and names six entries (E2, E5, E6, E7, E11, E12) that fail at every parameter. Corrected in `apply_map.py`; map rebuilt.
2. **Row G39 said the Hecke relation was "checked to 1e-12".** The referee's figure is a defect of at most 3.1e-12 (the lane's own figure was 1e-13 on other cases). Reworded.
3. **Row Z36 status first said the second referee confirmed the sign rule "on 305 of 305 cases" and Lemma 1 "at three instances of which one modulus is new".** 305 of 305 is the lane's own count; the second referee's new cases are 160 of 160, and Lemma 1 was reproduced at two new instances and one of the lane's at a different J (the referee file of that lane corrects its own summary in the same way). Corrected before the first application.
4. **Engine log said UNIV is named in the cells of rows P54 and Q29.** Only row P54 names it (route and "stops" cells). Corrected.
5. **Report generator**: "Mathlib and three external packages not replayed" -> "Mathlib, LeanCert and two external packages" (map section 1 item 3); the score histogram key was misnamed and printed a placeholder. Corrected and regenerated.
6. **STRATEGY 4.0 first listed rows G33 and Z36 among the rows of the 12 explore lanes.** Those two rows come from combine lanes. The sentence now separates the 12 explore lanes (13 rows) from the combine lanes behind G33, Z36, G40.

## Limits that remain (not corrected; stated in RESULT.md)

- The rows are compressions of referee files by one reader. I re-read each new row against its referee's list of corrections (every numbered correction of lanes 2, 3, 4, 6 appears in the row or in section 7) but did not re-derive any mathematics. Restriction 9 is copied, not understood.
- Row G40 says the Jacquet-Shalika entry has "all hypotheses met exactly when beta = 1/2 (unitarity and genericity)"; the referee's sentence is "only E4 (UNIT, GEN) has all hypotheses met on O2 iff beta = 1/2". Same content; the word "exactly" is the referee's "iff".
- Row G38's sentence that the comparison link "has no content for a control with a positive density of off-line zeros" is the referee's own ARGUED reading (E4 (ii)) and is labelled so.
- "Referee records per row" in the report is a count per source lane. It reports 29 rows with two records; of these only the seven round-13 rows and the round-12 rows are known to this pass to have a second *independent* pass on the row's own statement. The others have a second referee file in the lane directory whose subject was not checked here.
- The dictionary DJ device type has no map row. The pending entries for U3, U6, U8 depend on the unrefereed draft.
- STRATEGY v4 and the appended directive section give different lane counts for compute lanes. Left to the planner.
- Scripts `/tmp/c15_map_new.md` and `/tmp/c15_map_check.md` are scratch outputs outside the lane directory (temporary files; nothing else was written outside `engine/`, `campaign/`, `push/`).

## Flags (this pass)

R1 false, R2 false, R3 false, R4 false. aboutZeros false. holds = true for the verdict "partial-result (record lane)".
