# REFEREE (adversarial, lens: general; campaign referee) for c20-repair-owed-record-r19-statement-o-v5/RESULT.md

Date 2026-11-20 (local). This report is by the campaign's referee step, a process separate from the lane and from
the referee process the lane started itself. That earlier report stood in this file; it is kept verbatim below the
line "Earlier report" so that the references in `RESULT.md` section 9 still resolve. Two reports are therefore in
this one file. Paths are relative to `tmp/research-2026-11-16/`; `L/` is this directory.

What was run. Own scripts under `/tmp/ref2_c20/` (not in the repo): JSON and text recounts with python3; two mpmath
scripts (`chk.py`, `lp.py`; python3.14, 25 to 30 digits, seconds) through `scripts/memcap.sh 8`. No ssh, no server
use. Not run: `build_graph.py`, `generate.py`, `scoreboard.py`, `mk_devices.py`, `merge_outcomes.py`. Only this file
was written. Nothing here is a statement about zeros of zeta.

## Verdict

**Holds, with corrections C1 to C5 (none changes a count, a state or a label decision).** The lane is a record
lane. Every count it claims was recomputed and agrees. The four relabelled lines of Statement O version 5 were
re-derived by hand and checked numerically on cases different from the lane's and from the earlier referee's; each
closing step is correct in the restricted form version 5 writes. Line 15 is mathematically correct and correctly
left ARGUED under the label rule. Corrections E1 to E9 of the earlier report are entered in the files (spot-checked:
E1, E2, E4, E5, E6).

## 1. PROVED steps re-derived (Statement O lines 13 to 17)

Notation: z = s - 1/2, t^2 = s(1 - s) - 1/4 = -z^2, L = log x, and 1/(s - rho) = int_1^inf x^(-s) x^(rho - 1) dx
for Re s > Re rho. For F = zeta m, the added density is D(x) = sum over poles of m of x^(rho-1) minus sum over
zeros of m of x^(rho-1).

| line | derivation (by hand) | numeric check, new case | ruling |
|---|---|---|---|
| 13 ZQ | Numerator (t^2 + gbar^2 + eta^2)^2 - 4 gbar^2 t^2 = ((t - gbar)^2 + eta^2)((t + gbar)^2 + eta^2), zeros t = +-gbar +- i eta, that is s = 1/2 +- eta +- i gbar. Denominator cancels the simple zeros 1/2 +- i g1, 1/2 +- i g2. m is a function of z^2, degree 4 over 4 in t with leading ratio 1. Zeros contribute 4 x^(-1/2) cos(gbar L) cosh(eta L), poles 2 x^(-1/2)(cos g1 L + cos g2 L) = 4 x^(-1/2) cos(gbar L) cos(dL): D = -4 x^(-1/2) cos(gbar L)(cosh eta L - cos dL). Bound: cosh(eta L) - 1 <= (eta L)^2 e^(eta L)/2 and 1 - cos dL <= (dL)^2/2 give abs D <= 2 L^2 e^(-(1/2 - eta)L)(eta^2 + d^2) <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2 | zeros 10, 11, eta = 0.2: Laplace transform of D against -m'/m at 1.4 + 3.1i agrees to 9e-21 (quadrature); m(s) = m(1 - s) exact; m(1/2 + eta + i gbar) = 0; m(1) = 1.00197; zeta m finite non-zero at 1/2 + i g1; sup abs D on 60,001 points 3.39 against bound 31.2 | holds. The bound needs the two zeros simple (true for the pairs used). "Every atom is zeta's" holds as "the discrete part is unchanged", which is what version 5 writes |
| 14 SG | zeros of m at 1/2 +- b give -2 x^(-1/2) cosh bL; removed pair gives +2 x^(-1/2) cos g1 L: D = -2 x^(-1/2)(cosh bL - cos g1 L) <= 0. Numerator b^2 - z^2 vanishes at z = +-b; zeta is negative on (0, 1) (CLASSICAL), so SG(1/2 + b) = 0 | zero 5, b = 0.15: Laplace agreement 9e-21; max D on the grid 0 (at x = 1); numerator 2e-32 at 0.65; zeta(0.65) = -2.3060 | holds in the restricted form (the step D <= 0; zero by construction). The cover by the second file is one clause of one table row, as the lane says |
| 15 NR-q | q^z + c + q^(-z) = 0 iff cosh(z log q) = -c/2; for c > 2: z log q = arccosh(c/2) + i pi (2k + 1); inside the strip iff abs(c) < q^(1/2) + q^(-1/2) = 2.197368. zeta(s)(q^z + c + q^-z) has frequencies log n, log(n/q), log(nq); no power of q = 1 + sqrt 2 is rational, so the integer-frequency part is c zeta | c = 2.02: zero at 0.6603222 + 3.5644280 i, residual 1e-31; c = -2.15: real zero at 0.9367248 | construction correct. `REFEREE2_control-zq.md` and `REFEREE2_c15-control-with-zeta-fe-classes-u1-u2.md` contain neither "NR-q" nor "coset" nor "arccosh" (recounted): ARGUED stays, correctly. Note: `REFEREE2_c15-klein-transport-lemma-w-stage-a-and-e1.md` line 15 confirms the same zero formula for T-NR at q = 2, c = 2.05; it is a rational base, not NR-q, so it does not cover line 15 either |
| 16 G_+ | double poles at 1/2 +- b give 4 x^(-1/2) cosh bL; the quartet gives 4 x^(-1/2) cos(gbar L) cosh(eta L): D_+ = 4 x^(-1/2)(cosh bL - cos(gbar L) cosh(eta L)) >= 0 for eta <= b | zeros 50, 51, eta = 0.1, b = 0.12: Laplace agreement 3e-21; min D_+ = 0 on 60,001 points; m_+(s) = m_+(1 - s) exact; with eta = 0.2 > b the minimum is -0.120; with eta = b the minimum is 0 | holds |
| 17 WT | on the line zeta = chi conj zeta with chi = e^(-2i theta(t)); for F(t) = zeta(1/2 + i(t + alpha)): F - chi conj F = F(1 - e^(i Psi)), Psi = 2 theta(t + alpha) - 2 theta(t), Psi' about alpha/t. Anchored at the midpoint with Psi = 2 pi: abs(Psi - 2 pi) <= alpha L/(2T) = pi L/(T log(T/2 pi)). Reflection alpha = -2c: Psi = -2 theta(2c - t) - 2 theta(t), stationary at t = c with Psi'' = -2/c, so Psi(t) - Psi(c) = -(t - c)^2/c | T = 20000, L = 40: identity defect 5e-28; translate: max abs(1 - e^(i Psi)) = 7.785e-4 against 7.790e-4. Reflection: with Psi(c) = 0 mod 2 pi the maximum is 0.02012 = L^2/(4T); with Psi(c) offset by L^2/(8T) it is 0.01012 = L^2/(8T) (1 + 0.012) | holds to leading order. See C2 |

## 2. Other numeric checks rerun with a different case

- Liouville correction. Lambda_eps(p^k) = (-1)^k log p; the cross coefficient sum over coprime d e = n of
  Lambda_eps(d) Lambda_eps(e), own divisor sum: n = 6: +1.5230; 10: +2.2312; 14: +2.6976; 15: +3.5363;
  12: -1.5230; 18: -1.5230; 20: -2.2312; 28: -2.6976; 45: -3.5363; 24, 36: +1.5230. Negative exactly when the two
  exponents have odd sum. With tests supported in (0, log P) the first failing atom 12 enters for P > 12. Among
  sign chains only eps = +1 passes at every P (p q forces equal signs; p^2 q excludes all minus). Agrees.
- Lemma P repair. rho(0) = -0.8550095, rho(1.5) = -0.2357288, sign change at 6.2898360, negative mass 2.2478871.
  Counterexample at a different band, U = 6, h = sin(pi s/6), g(x) = int_0^U h e^(ixs) ds:
  int abs(g)^2 rho dx = -11.818 with int abs(g)^2 dx = 18.8496 = 2 pi norm(h)^2 (Plancherel check). At U = 10:
  -22.7591 and 31.4159, as quoted. The repaired bound >= -2.248 sup over abs(x) <= 6.29 of abs(g)^2 holds in both
  cases (-32.80 and -91.11). The signed-measure statement and the repaired form are confirmed.

## 3. Counts recomputed (own scripts)

| quantity | claimed | recomputed |
|---|---|---|
| map row labels | 215 -> 217 (P 58, G 45, Q 31, S 13, Z 40, F 8, T 3, L 6, D 10, X 2, O 1), plus HQ2, HQ3, HQ4 | 215 -> 217 with the same split; control labels HQ2 -> HQ2, HQ3, HQ4; no duplicate |
| map lines | 678 -> 693 | 678 -> 693 |
| Statement O v4 -> v5 | title and header; Label bullets of 13, 14, 16, 17 | `diff`: header block, one inserted paragraph after the old header line, four Label bullets; nothing else |
| scoreboard entries that differ (before rerun / final / live) | nodes, nodesMarkedClosed, lanesRun, lanesRefereed, histogram 0, history, timestamp | exactly these: 1,750 -> 1,756; 609 -> 611; 172 -> 173; 162 -> 163; 170 -> 171; 19 -> 20 entries; live file = `L/final` |
| `campaign/lanes.jsonl` | one field of one old line; one appended line | line 167, field `claim` only; line 173 appended; 163 lines with referees >= 1, 149 with refereeHolds true (0.914) |
| devices | 55 closed / 1 floored / 0 open; no state change | 56 types, 55 / 1 / 0 in both files; changed fields: band type (name, status, evidence, closedOn), `exact-relation-rigidity` (closedOn) |
| cells | 6 cell / 1 tried / 4 closed; no state change | the same; evidence changed for U4, U6 (c), U6 (g); one `pending` name edited (declared after E9) |
| control codes | 8 -> 11 | 8 -> 11 |
| correction notes | 7 and 5, originals kept | 7 and 5 inserted blocks, 0 characters deleted in both RESULT.md files |
| register | 23 sentences | 23 table rows |
| STRATEGY | sections 0 to 2 and the rule text of 3 untouched | text before "## 3" identical to `L/before/STRATEGY.md`; the rule paragraph of section 3 unchanged |

## 4. Corrections

- **C1 (heading against rule; one record contradicts another).** STRATEGY section 3 states "Two refereed
  obstructions of the same kind close a family". Items 59, 61 and 63 are entered under "3.1 Families closed by this
  rule" on one refereed obstruction each, and the paragraph "State of the cells after round 19" writes U6 (c) closed
  while `engine/curated/devices.json` keeps `silent-cell-u6c` at state `cell`. The lane discloses both (section 2.3
  and weakest step 2), and the engine state is the conservative one. As it stands a reader of STRATEGY alone takes
  three families as closed by the rule when the rule is not met. Correction: mark items 59, 61, 63 "tried, not
  closed (one referee file)" in their first words, or move them to the tried list, until the second files exist.
  Item 60 is the continuation of a type that already has two refereed obstructions (item 55) and is not affected.
- **C2 (line 17, reflection parenthesis; wording).** L^2/(8T) is the value of the defect only when c is chosen so
  that Psi(c) is offset from a multiple of 2 pi by L^2/(8T) (the phase range is then symmetric about 0). With
  Psi(c) = 0 mod 2 pi the defect is L^2/(4T) (measured 0.02012 at T = 20000, L = 40). Version 5 carries the
  corrected form "(L + 2 abs(delta))^2/(8T)" and "a lower bound, not the value", which is consistent with this;
  the version-4 fields above the Label bullet still print "(L^2/(8T) for the reflection translate)" and K_tr with
  sqrt(8 eta T) without the condition on c. The label "PROVED to leading order" stands for the main clause; the
  parenthesis is an optimum over c, and the Label bullet should say "for the optimal c".
- **C3 (who set the referee fields of the lane line).** The lane started its own referee process with a brief it
  wrote (`L/REFEREE_BRIEF.txt`, which lists the items to check and says the flags are "expected all false"), then
  itself set `referees: 1`, `refereeHolds: true`, `errors`, `surviving` in line 173 and reran the scoreboard
  (`lanesRefereed` 162 -> 163). The report it obtained is substantive and its recounts agree with mine, so the
  figure is not wrong after this report. The process point: the referee fields of a lane line are otherwise written
  by the learn step from the campaign referee; the learn step of round 20 must overwrite, not add to, these fields
  (two reports now exist: the lane-commissioned one and this one). Section 2.6 states `lanesRefereed` 163 as a
  result of "this lane's line"; it should say the count rested on the lane-commissioned report at the time.
- **C4 (scope of "PROVED" for line 13).** The defect bound and the cancellation need the two removed zeros to be
  simple zeros on the line. That is true for every pair used and is implicit in "ordinates of two zeros of zeta on
  the line"; the word "simple" is missing from the construction field. No label changes.
- **C5 (small).** `RESULT.md` header says "one float check of five quoted numbers"; `author_check.py` line 1 says
  "four quoted facts" and section 3 lists more than five numbers. The score histogram entry 0 = 171 counts ten
  lines of `campaign/lanes.jsonl` whose `score` is null as 0 (161 lines have score 0, 2 have 1, 10 have none);
  this is the behaviour of `scoreboard.py`, not of the lane, and the lane's own line has score 0.

Not errors: `trivbound.json` at the repository root was modified at 00:55 inside the lane's time window; it belongs
to `push/c20-mixed-form-control-census-server/trivbound.py`, not to this lane. No other file outside
`tmp/research-2026-11-16/` was modified in the window 00:20 to 01:06.

## 5. Integrity

- Nothing assumes RH. No verified height is restated as a result. No known theorem is presented as new: the four
  relabelled constructions are partial-fraction identities and are labelled as elementary; Bohr equivalence, Landau,
  Selberg, Turan (through Montgomery-Vaughan) are cited as classical.
- No zeta-only mechanism is claimed, so no control run applies. The control facts the lane records (Liouville fails
  at p q^2; sigma is signed; SG, G_+, ZQ, NR-q constructions) were recomputed in sections 1 and 2.
- The decision sheet states in its header and in section 4 that it applies nothing; the STRATEGY comparison confirms
  that no rule text changed. Its two sentences "expected to be met after round 20" are forecasts and are marked so.
- "PROVED" in Statement O is the label of the rule (two referee files cover the closing step), not a certificate;
  version 5 says this. The second file for lines 13, 14, 16 was not blind to the first (stated in version 5).

## 6. Limits of this report

1. The Montgomery-Vaughan draft was not opened; "Theorem K.3" is checked as a citation that matches the source
   file `c19-referee-r18-independent-sources/REFEREE-W5c-and-TURAN-SOURCE.md` only.
2. Rows X2, G45 and the addenda of Z37, D10, P58 were not compared again sentence by sentence with the five
   round-19 referee files; the earlier report did that, and I checked only that its corrections E1, E2, E4, E5, E6
   are now in the text.
3. The before-state of the graph is known only from the lane's own logs and backup.
4. Numeric checks are floating point on grids, not interval arithmetic.
5. The 23 register entries were counted, not re-read against their sources.

## 7. Requirement flags (set by this referee)

- R1 false: no argument; nothing in which multiplicativity is used.
- R2 false: no statement at any height.
- R3 false: no mechanism; the rows entered list passing controls.
- R4 false: nothing is carried to the critical line.

Score 0. Headline unchanged at 1 of 4.

## 8. Surviving claim

Record lane; no statement about zeros of zeta. The map has 217 labelled rows plus control labels HQ2, HQ3, HQ4;
rows X2 and G45, control rows HQ3 and HQ4, and addenda to Z37, D10, P58 are entered; twelve correction notes are
pure insertions; the register has 23 sentences; no device or cell state changed (55 / 1 / 0; 6 / 1 / 4); the
scoreboard moved in nodes (1,756), nodes marked closed (611), lanes run (173), lanes refereed (163), the score-0
count (171) and one history entry. Statement O version 5 relabels lines 13, 14, 16, 17 as PROVED under the label
rule in restricted forms whose closing steps are correct (re-derived and checked on new cases); line 15 is correct
as mathematics and stays ARGUED. The Liouville correction and the Lemma P repair are confirmed on new cases. Open
after this report: C1 (items 59, 61, 63 under a "closed by this rule" heading on one referee each; STRATEGY and
engine disagree on U6 (c)), C2 (the reflection parenthesis is an optimum over c), C3 (the lane set its own referee
fields).

---

# Earlier report (kept verbatim; written by the referee process the lane started; cited in RESULT.md section 9)

## [earlier report, original title] REFEREE (independent, lens: general): c20-repair-owed-record-r19-statement-o-v5

Date 2026-11-20. Written by an independent referee process that did not write the lane and wrote no file of it.
Object: `RESULT.md` of this directory (`L/`) and the record files it edited. Paths are relative to
`tmp/research-2026-11-16/`.

What was run. Text comparison and JSON recounts with own scripts under `/tmp/ref_c20repair/` (not in the repo):
`quotes.py`, `q2.py` (quotations of Statement O version 5), `map.py`, `celld.py`, `cell.py` (map row labels and
character-level row differences against `L/before/OBSTRUCTION_MAP.md`), `s23.py`, `carry.py` (the 23 sentences),
`eng.py` to `eng5.py` (scoreboard, `lanes.jsonl`, controls, devices, graph, top 60), `ds.py` (decision sheet), and
three numeric scripts run through `scripts/memcap.sh 8` with python3.14 and mpmath 1.4.1: `sg.py`, `liou.py`,
`cex.py`. `IDEA_GRAPH.json` was loaded read-only under the cap. Not run: `build_graph.py`, `generate.py`,
`scoreboard.py`, `merge_outcomes.py`. No ssh connection, no server use. The only file written in the repo is this one.

## Verdict

**Holds with corrections.** The lane's claims about what it entered and about engine and scoreboard counts were
recomputed and agree in every count. The relabel decisions for Statement O lines 13 to 17 are supported. Nine
corrections are listed (E1 to E9); none changes a state, a label decision or a count of the scoreboard. E1 (a lane
count that the files named do not support, repeated in five places) and E2 (two figures and one omitted referee
correction in row Z37) are the ones a later reader could carry forward wrongly.

## Counts recomputed

| quantity | claimed | recomputed | agrees |
|---|---|---|---|
| map row labels (distinct) | 217 + HQ2, HQ3, HQ4 | 217 (P 58, G 45, Q 31, S 13, Z 40, F 8, T 3, L 6, D 10, X 2, O 1) + 3; no duplicate; before: 216 + HQ2 | yes |
| map lines | 678 -> 693 | 678 -> 693; 15 inserted lines | yes |
| map rows added / edited | X2, G45, HQ3, HQ4, item 23, 8 rows of section 7, update paragraph / HQ2, X1, G44, P58, D10, Z37, Q31, O1, BLS note, row-count line | the same set and no other changed line | yes |
| Statement O v4 -> v5 | title/header and Label bullets of 13, 14, 16, 17 | six diff hunks: two in the header (lines 1 and 2), four Label bullets; 7 old lines replaced | yes (the lane counts five blocks; the header is two hunks) |
| graph nodes / rows / edges | 1,750 / 251 / 9,213 -> 1,756 / 253 / 9,236 | live graph 1,756 / 253 / 9,236; before values from the meta block of `L/before/CANDIDATES.json` | yes |
| edges composes-with / control-defeats | 7,609 / 907 -> 7,619 / 920 | the same; 10 composes-with edges touch `map-open-23`; `ctl-HQ2` -> rows X1, X2, G45; `ctl-HQ3`, `ctl-HQ4` -> X2 | yes |
| new nodes | `ctl-HQ2/3/4`, `row-X2`, `row-G45`, `map-open-23` | all six present; rows closed, open item conjectural | yes |
| device table | 55 closed / 1 floored / 0 open, before and after | 56 types: 55 / 1 / 0 in both files; no id added or removed; no state changed | yes |
| cells | 6 cell / 1 tried / 4 closed | 6 / 1 / 4 in both files; no state changed | yes |
| device entries edited | band type (name, status, evidence, closedOn), `exact-relation-rigidity` (closedOn), cells U4, U6 (c), U6 (g) (evidence) | the same, plus `pending[2].name` (E9) | yes, with E9 |
| band device | closed | `engine/curated/devices.json`: state `closed`, round 19, five referee files listed | yes |
| control codes | 8 -> 11 | 8 -> 11 (HQ2, HQ3, HQ4 appended); the 8 old entries unchanged | yes |
| generated / scored / rejected | 38,340 / 8,426 / 29,914 -> 38,485 / 8,426 / 30,059 | the same; eight rejection reasons rise by 45, 1, 20, 15, 10, 24, 16, 14 (sum 145) | yes |
| top 60 | 60 of 60 same key, score, rank; 47 identical, 13 differ in `rowsChecked` | the same; rank 1 `M1-e8e505`, 10.25, in both | yes |
| scoreboard entries changed | nodes 1,750 -> 1,756; marked closed 609 -> 611; lanesRun 172 -> 173; histogram 0: 170 -> 171; history 19 -> 20 | exactly these and the timestamp; live file = `L/final` | yes |
| `campaign/lanes.jsonl` | one field of one old line; one appended line | line 167, field `claim` only; line 173 appended (round 20, repair, score 0, r1 to r4 false, referees 0); live file = `L/final` | yes |
| correction notes | 7 and 5 | 7 and 5, all pure insertions (0 characters deleted) | yes |
| 23 sentences | quoted without change | 21 verbatim against section 3 of the source; 2 with a different quotation boundary (E8) | yes, with E8 |
| STRATEGY | sections 1, 2 and rule text of 3 untouched | six diff hunks, all in 3.1 (heading, items 54 to 57 brackets, items 59 to 65, tried list), 4.0 (one paragraph), 5 (one bullet) | yes |
| engine files not edited | `generate.py`, `closed_families.json`, `outcomes.json` | byte-identical to `L/before/`; `build_graph.py` differs in one regex line and one comment | yes |

## Statement O version 5: ruling per line

Mathematics re-derived by hand, with t^2 = -(s - 1/2)^2 and 1/(s - rho) = int_1^inf x^(-s) x^(rho - 1) dx.

| line | second file covers the closing step | own check | ruling on the relabel |
|---|---|---|---|
| 13 ZQ | yes: functional equation, zero count by argument principle, atoms, defect bound, each with a derivation and a rerun on two new pairs | none beyond reading | agree: PROVED, with the three exclusions the lane states (infimum clause, paper runs, floating point) |
| 14 SG | partly: one clause of one table row ("SG has D <= 0", "each re-derived by hand", "cosh >= 1 >= cos", ruling "hold"); functional equation through the Lemma A row. The field "Mode and floor" (zero at 1/2 + b) has no sentence in the second file | removed pair 1/2 +- i g1 gives 2 x^(-1/2) cos(g1 L), added pair 1/2 +- b gives 2 x^(-1/2) cosh(bL), so D = -2 x^(-1/2)(cosh(bL) - cos(g1 L)) <= 0, zero only at x = 1. Numerator t^2 + b^2 = b^2 - (s - 1/2)^2 vanishes at 1/2 +- b, where zeta is finite and non-zero. mpmath, 30 digits, g1 = second zero 21.0220396, b = 0.37: abs SG(0.87) = 4e-34 with zeta(0.87) = -7.12; functional-equation defect 3e-31; Laplace integral of D against -m'/m at 1.6 + 2.3i: 5e-32; max D on 8001 grid points = 0 | agree, in the restricted form version 5 writes (step field only; zero location by construction). The weakest of the four, as the lane says |
| 15 NR-q | no: neither `REFEREE2_control-zq.md` nor `REFEREE2_c15-control-with-zeta-fe-classes-u1-u2.md` contains "NR-q", "coset" or "arccosh" | the zero formula is correct: at c = 2.1, 1/2 + arccosh(1.05)/log q + i pi/log q = 0.857311 + 3.564428 i, multiplier 1e-31 there | agree: ARGUED stays. The construction is right; the label rule is not met |
| 16 G_+ | yes: grid sign, functional-equation defect and real poles in the second file; the derivation in `c18-u4-group-law-left-of-one-torus-orbit/REFEREE.md` line 112 | double poles at 1/2 +- b give 4 x^(-1/2) cosh(bL), the quartet gives 4 x^(-1/2) cos(gbar L) cosh(eta L), so D_+ = 4 x^(-1/2)(cosh bL - cos(gbar L) cosh(eta L)) >= 0 for eta <= b. mpmath, eta = 0.11, b = 0.23, gbar = 17.3: min over 20001 grid points = 0 (at x = 1); Laplace check 2e-31; with eta = 0.3 > b the minimum is -0.20 | agree: PROVED |
| 17 WT | yes for the translate identity, Lemma 1 (a), (b) and the span law; the reflection parenthesis only as corrected by the lane referee's E1 | none beyond reading | agree: PROVED to leading order for the main clause; the version-4 fields still print "(L^2/(8T) for the reflection translate)" and "(1 + o(1))", which are to be read as the Label bullet says |

Quotations: every quoted sentence in the four Label bullets and the header table occurs in the cited file after
removal of markdown markup (E7).

## Errors and corrections

- **E1 (count not supported by the files named).** "Four refereed lanes" for the band device appears in the
  device name in `devices.json`, the P58 addendum, STRATEGY item 60, the paragraph "State of the cells after
  round 19" and row 4 of table W2 of the decision sheet. The `closedOn.files` list of the device names referee files
  of three lanes (`c18-tz-one-sided-bound-fe-reserve-bridge`, `c18-tz-band-completion-controls-server`,
  `c19-rs-real-zero-completion-band-server`); `RESULT.md` section 2.3 describes the same three; the decision sheet's
  condition-B table writes "2 + 2 + 1 over three lanes". The figure four is in `ROUND_LOG.md` (round 19, Lessons),
  which the lane did not write. Correction: name the fourth lane in the device entry and the row, or write three.
- **E2 (row Z37, round-19 addendum).** "The identity fails in 14 of 14 quadruples by 2.6e3 to 5.7e6 error bars":
  the referee file supports the lower figure (2596) and one new quadruple; "14 of 14" and 5.7e6 are the lane's
  (its RESULT.md lines 49, 239). The referee's correction 8 (the Hecke term of the cusp error bar is a heuristic,
  not a propagated bound) is not in the row; `RESULT.md` says corrections 1 to 7 are. Add: "error bars heuristic
  (correction 8); 14 of 14 and the upper figure from the lane's table".
- **E3 (row G45, attribution).** "THIN at p q", "T-NR at q^2 p (c > 2)", the K2 bound formula and "the first such
  step on file" are in the lane's RESULT.md (line 146 for THIN), not in its REFEREE.md, which confirms sign chains
  at p q, T-NR by the values 4.81, -7.52 and the case c < -2, and K2 by a brute count. The row attributes the cell
  to "the referee's reading". Everything else in the row matches the referee file sentence by sentence, including
  E1 to E5.
- **E4 (row D10, round-19 addendum).** "(iv) at symmetric sets these 2d points are null vectors of N exactly when
  1 - a_j is a zero": the referee file confirms the direction "symmetric implies null" (N(p_0k, .) = 0 from
  g(-1 - u) = g(u)); "exactly when" is the lane's. The counts 220 + 4, 60 of 60, the referee's 10, W-1 to W-5 and
  the labels match.
- **E5 (row P58, round-19 addendum).** "The runs enclose lambda_min(T_sigma) >= 2.4e-6 Lg per cell": the referee
  file says "in every zeta cell" (2.4e-6, 2.3e-3, 4.5e-3 Lg at the three heights). Insert "zeta". The rest of the
  addendum (E1 to E4, the repaired bound, the ranges, 422 of 432, the 1e31 remark) matches.
- **E6 (row X2, inline labels).** The stops cell marks "the last two ARGUED" for the spinor and rank-2 rows only;
  Bost-Connes state positivity (device row 12) under "passes every step" and the 7/8 size inputs (device row 18)
  under (b) are also ARGUED in the lane and the referee file. The status cell lists all four (10, 11, 12, 18), so
  the row is consistent only if both cells are read.
- **E7 (Statement O version 5, quotations).** "holds under its hypothesis abs(alpha) <= a/2" stands in the source
  as "holds **under its hypothesis `abs(alpha) <= a/2`**"; several further quotations match only after backticks are
  removed. Words unchanged. "Each quotation occurs in the file" is true modulo markup; say so in the header.
- **E8 (register `CORRECTIONS_R18.md`).** Sentence 15: the closing quotation mark includes the last sentence
  ("The sentence that c17's parity clause fails ... is withdrawn until rerun with this b."), which the source has
  outside the quotation. Sentence 23: section 3 of the source does not quote it; the register takes the text from
  the end of `REFEREE-W5c-and-TURAN-SOURCE.md`, where it is verbatim. Column "where the record carries it", 20
  entries tested: verbatim in the named map row for 4, 6, 7, 8, 9, 10, 11, 12 (short form), 13, 15, 16, 18, 22, 23,
  and 3 with "; E5" inserted; present in substance, not verbatim, for 1, 2, 14, 17, 19, 20, 21 (the register says
  "in this form" for 1). Sentence 5: row P58 carries the first display and "with the constant -u"; the second
  display ("D_P'/D_P(s) = -(log P)/2 + lim ..., with no further constant") was not found by string search in the
  row or in `push/c18-tz-one-sided-bound-fe-reserve-bridge/RESULT.md`. The entry for 5 should name where that
  display stands, or the register is its only place.
- **E9 (undeclared edit, no state change).** `devices.json`, key `pending`, entry 3 (lane
  `c17-window-information-law-ctheta-u5`): one sentence appended to `name` ("Round 19: the continuation of that
  device type ... is closed as well ..."). Not listed in `RESULT.md` sections 2.3 or 6.

Not errors, recorded:

- Liouville (correction E1 of the source lane). Own recursion from a(n) log^2 n = sum c(d) a(n/d) for the
  Liouville series: among atoms with two prime factors, c(6) = +1.523, c(10) = +2.231, c(12) = -1.523000 =
  -2 log 2 log 3; also negative at 18, 20, 28. The test functions have support in (0, log P) (lane RESULT.md lines
  27, 112), so the sum runs over n < P and the atom 12 enters when P > 12. "Passes only for P <= 12" is the right
  threshold under that convention.
- Lemma P repair. rho(0) = -0.855010, rho(3) = -0.118450, sign change at 6.289836, negative mass 2.247887.
  Counterexample U = 10, h = sin(pi s/10): int abs(g)^2 rho dx = -22.7591 against int abs(g)^2 dx = 31.4159.
  All figures in the P58 addendum and in the five notes agree.
- Row Q31 cites Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3. The string
  "Theorem K.3" occurs three times in the row; `RESULT.md` section 2.1 says four places and the register says
  three.
- HQ3, HQ4 rows: zeros at u = q^(+-a) (resp. -q^(+-a)), poles at u = q^(+-b), c_k formulas, the member
  (5; 0.07, 0.31), 0.241, 1.03, 24309 minors: all match the referee file. First negative k = 13, 22, 38, 67, 212,
  669 matches.
- The decision sheet's rule quotation is verbatim from STRATEGY section 2.

## Decision sheet

It does not apply the checkpoint and changes no rule; section 4 says so and the STRATEGY diff confirms it. Evidence
rows sampled (8): the rule text (verbatim); round 19 quotation from `ROUND_LOG.md` (verbatim); "12 of 12" (STRATEGY
0a: "12 lanes ... all 12 stopped at stage A"; in substance); "13 of 13" (STRATEGY change log; verbatim figure);
scoreboard 170 / 2 / 0 / 0 / 0 and no ALERT file (true at the time of writing; now 171); the quotation from
`c20-u4-second-order-archimedean-mixed-form/RESULT.md` (verbatim) and its REFEREE.md being a same-session pass
(true by its header); `c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE.md` marked independent with holds =
true (true); P58 "2 + 2 + 1 over three lanes" (true; see E1). Stronger than the files: the two sentences "expected
to be met after round 20" are forecasts resting on unrefereed or just-refereed round-20 files; they are marked as
such and section 4 item 1 withdraws them as decisions. The cost column has no trial run behind it, as stated.
The state line "172 lines, no round-20 line" was true when written and is not true now (173).

## Integrity

- Nothing in the lane's files assumes RH. No verified height is restated as a result. Known results are labelled
  (Bohr equivalence, Landau, Edrei, Eichler, Siegel, Hermite, Turan through Montgomery-Vaughan); rows X2 and G45
  carry "known type" and "CLASSICAL in content".
- No statement about zeros of zeta is made. The headline is unchanged at 1 of 4.
- Edits outside `engine/`, `campaign/`, `push/`: none found. A scan of the repository (without `.git`,
  `node_modules`, `.claude`) for files modified between 00:20 and 00:52 local time found none outside
  `tmp/research-2026-11-16/{engine,campaign,push}`. `campaign/ROUND_LOG.md` was last modified at 00:21:52, before
  the lane's first backup (00:23), and contains the lane's slug once (the round-20 allocation); it was not edited
  by the lane.
- `L/before/lanes.jsonl` (172 lines) is not the file `campaign/lanes.jsonl.bak-r19` (166 lines, an earlier state);
  the "one field of one line" comparison rests on the lane's own backup.

## Limits of this report

1. The before-state of the graph is known only through the meta block of `L/before/CANDIDATES.json` and the logs;
   no before copy of `IDEA_GRAPH.json` exists. `L/before/scoreboard.json` is a rerun, as the lane states; the
   as-found values (1,746 nodes and so on) could not be checked.
2. Rows X2, G45 and the addenda of Z37, D10, P58 were compared with the five REFEREE.md files sentence by
   sentence. The edits of rows X1, O1, G44, Q31, the BLS note and the eight rows of section 7 were read as
   differences but not traced to their sources, except for the 23 sentences.
3. Montgomery-Vaughan's draft was not opened; "Theorem K.3" is checked as a citation string only.
4. The numeric checks are 20 to 30 digit floating point on grids, one case each; no interval arithmetic.
5. The identity of the 8,426 scored candidates as a set is checked on the top 60 only (same limit as the lane).
6. Referee counts printed in the decision sheet's condition-B table (for example P56 (3), P57 (2)) were not
   recounted.
7. For lines 13 and 17 the ruling rests on reading the second files, not on a new derivation.

## Requirement flags (set by this referee)

- R1 false: record lane; no argument in which multiplicativity is used.
- R2 false: no statement at any height.
- R3 false: no mechanism; every row entered lists passing controls.
- R4 false: nothing is carried to the critical line.

Score 0.

## Surviving claim

No statement about zeros of zeta. The lane entered what it lists: map rows X2 and G45, control rows HQ3 and HQ4
with an HQ2 addendum, round-19 addenda in rows Z37, D10 and P58, section 6 item 23, eight rows in section 7;
twelve correction notes in two round-19 lane files and one corrected `claim` field; a register of 23 sentences;
STRATEGY items 59 to 65 with no rule, weight or allocation changed; three engine control codes with one regex line;
device and cell evidence with no state change (55 / 1 / 0 and 6 / 1 / 4); a decision sheet that applies nothing.
Statement O version 5 differs from version 4 in the title and header and in the Label bullets of lines 13, 14, 16,
17; the four relabels are supported in the restricted forms it writes, and line 15 stays ARGUED. The map has 217
labelled rows plus HQ2, HQ3, HQ4. The scoreboard moved in nodes (1,756), nodes marked closed (611), lanes run
(173), the score-0 count (171) and one history entry, each for the stated reason. The Liouville correction and the
Lemma P repair are numerically confirmed. Corrections E1 to E9 apply to wording, attribution and one undeclared
text edit; E1 and E2 should be entered in the record before the figures are quoted again.
