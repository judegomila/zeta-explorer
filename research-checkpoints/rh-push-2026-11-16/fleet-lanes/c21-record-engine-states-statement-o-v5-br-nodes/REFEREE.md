# REFEREE.md for c21-record-engine-states-statement-o-v5-br-nodes: independent campaign referee (lens: general)

Date 2026-11-20. Written by the campaign referee step, a process separate from the lane. It replaces the lane's author
check, which is kept verbatim as the appendix of this file (the author check counts as no referee). Paths are relative to
`tmp/research-2026-11-16/`; `L/` is this directory. Nothing here is a statement about zeros of zeta. No engine script
(`build_graph.py`, `generate.py`, `scoreboard.py`, `mk_devices.py`, `merge_outcomes.py`) was run; their outputs were read
as JSON and text by a script of my own. One numeric script was run locally under `scripts/memcap.sh 8` (mpmath, single
process, under one minute). No connection to the compute server.

## 0. Verdict

**Holds as a record lane (partial result), with corrections E1 to E7.** The lane makes no attack and no claim about
zeros. Every count I could recount from files on disk agrees with RESULT.md. The lane labels no step of its own as
PROVED; the two short derivations it writes (covering remark, Bohr's inequality from the lift) were re-derived and
hold as stated with their stated dependencies. The corrections concern (E1, E2) the wording of the MV-CAP field
entered in Statement O line 10, (E3) the set condition in the BR-2 node, (E4) two counts with a pointer to a log that
does not contain them, (E5 to E7) record hygiene. None changes a count, a cell state or a label.

Flags set by this referee: **R1 false, R2 false, R3 false, R4 false.** Score 0. No step assumes RH (H_W is a
window hypothesis, stated as a hypothesis and as unknown above the verified height); verified height is not restated
as a result; Ingham's theorem, Trefethen-Weideman Theorem 5.1 and Bohr's inequality are cited as classical, not as new.

## 1. Recounts (own script, from the files on disk at the time of this report)

| quantity | RESULT.md | recount | agrees |
|---|---|---|---|
| graph nodes / edges, before -> live | 1,759 / 9,239 -> 1,762 / 9,263 | the same (`L/before/IDEA_GRAPH.json`, `engine/IDEA_GRAPH.json`) | yes |
| new node ids | BR-2, BR-3, TS | exactly three ids added, none removed | yes |
| composes-with edges | 7,619 -> 7,643 | the same; no other edge type changes | yes |
| device nodes closed / floored / open | 71 / 6 / 0 -> 71 / 6 / 2 | the same | yes |
| device types | 56 -> 58 (55, 1, 2) | 56 -> 58; the two added entries are the BR types; one other entry changed (band device, evidence only, old text a prefix) | yes |
| cells cell / tried / closed | 6 / 1 / 4 -> 5 / 1 / 5 -> 3 / 1 / 7 | the same in `before`, `after`, live | yes |
| cell entries changed | U6 (a), (b), (c) state + evidence; U4, U6 (g) evidence only | the same; in each the old evidence is a prefix of the new | yes |
| generated / scored / rejected | 38,485 / 8,415 / 30,070 -> 44,016 / 11,400 / 32,616 | the same (meta blocks of `before`, `after`, `final`, `final2`, live) | yes |
| top-60 overlap | 18; before ranks 1, 3, 6, 13-17, 19, 20, 29, 34, 38-43; after ranks 9, 17, 24, 31, 32, 34-38, 44, 52-55, 57, 59, 60 | the same | yes |
| top 60 with a BR node | 24 (12 + 12), ranks 1-8 and sixteen between 10 and 29; moves M1 18, M3 4, M4 2 | the same; `--per-device` default 12 in `generate.py` line 198 | yes |
| rank 1 | BR-3 x catalan-signed-ladder x sympow-conductor-normalised-shift, 10.5 | the same | yes |
| TS in top 60 / node | 0; type tool, no role | 0; `roles: []` | yes |
| rejections by `fam-pole-lattice-multiplier` / `fam-lemmab-sup-bound-halfplane` | 0 -> 1,556 / 0 -> 111 | the same | yes |
| live `CANDIDATES.json` | equals `final`, `final2`, `after` lists | equal | yes |
| scoreboard, 40 flattened entries | only `C_coverage.nodes` 1,759 -> 1,762 (and the timestamp) | the same; as-found -> before differs in 7 coverage entries and the timestamp, as stated | yes |
| headline / lanes | 1 of 4; 180 | bestScore 1 (`c4-helson-discrepancy-zerofree`, missing R2, R3, R4); lanesRun 180, lanesRefereed 170 | yes |
| `campaign/lanes.jsonl` | nothing appended | 180 lines, 0 with this slug | yes |
| Statement O diff | 9 hunks, 18 added, 6 replaced | 9 hunks; 18 `+` lines (one blank), 6 `-` lines | yes |
| Statement O labels | none changed | 17 Label bullets; lines 1, 4, 7, 10, 11, 12, 15 ARGUED, 2 MEASURED, 5 PROVED relative, 8 PROVED | yes |
| `campaign/STATEMENT_O.md` | copy of `L/STATEMENT_O_v5_1.md`; version 5 not edited | byte-identical; version-5 file mtime predates the lane | yes |
| STRATEGY, two checkpoint files | insertions only | character-level diff against `engine/scratch/*.pre-c21-record.md`: no deleted character in any changed line; 2 inserted lines (change log) | yes |
| scored candidates with BR-3 / BR-2 | 2,707 / 497, "counts in `L/logs/after_generate_dump.log`" | **not found**: that log has neither number, and the dump is deleted | see E4 |

Referee files (existence and scope, read in full or in the verdict and scope sections):
- U6 (c): `push/c20-referee-theorem-d-headline-and-r19/REFEREE2-c19-u6c-double-cover-k3-run.md` exists, verdict holds,
  scope "Only Lemma Q was refereed". I re-read the place-by-place derivation of Lemma Q (v = infinity, 2, p, q, other
  odd l); it is correct, including the use of p = q = 1 mod 8 at 2 and reciprocity at p, q.
- U6 (a), (b): `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE2.md`
  exists, verdict "Lemma K: holds. Lemma K': holds", scope as quoted in RESULT.md. Lemma K (a Hecke-invariant subspace
  of codimension k misses at most k eigencharacters) is elementary and I confirm it.
- U4: at the time of this report the directory `.../c20-u4-second-order-archimedean-mixed-form/` holds scripts and
  JSON/log outputs and no REFEREE file. "Unchanged" is correct.
- C1: the three files named for items 59, 61, 63 exist with verdicts holds with corrections / holds / holds.

## 2. Derivations redone

1. **Covering remark for S(theta)** (asymptotic for exponent theta1 in (7/12, theta) gives the lower bound
   pi(y + y^theta) - pi(y) >= c y^theta/log y). Re-derived: the intervals (x_(j+1), x_j], x_0 = y + y^theta,
   x_(j+1) = x_j - x_j^theta1, are disjoint, lie in (y, y + y^theta], leave a piece shorter than (2y)^theta1, and each
   carries (1 - eps) x_j^theta1/log x_j primes for y large. Holds. It is needed: the asymptotic at exponent theta
   itself gives an interval that is not contained in (y, y + y^theta]. Instance (new case): y = 10^7, theta = 0.8,
   theta1 = 0.65: 11 intervals, leftover 2,324 < (2y)^theta1 = 55,676, covered primes 24,548 of 24,692, y^theta/log y = 24,699.
2. **Bohr's inequality from the lift.** F_1(z) = (1/2 pi) int F(e^(i phi) z) e^(-i phi) d phi = sum a_p z_p (the
   monomials of degree one are the single variables), so abs(F_1(z)) <= sup abs(F). For the infinite polydisc take
   z = r times unit phases on finitely many coordinates and 0 elsewhere, r < 1, then r -> 1 and the set grows; this
   avoids boundary values. Holds relative to the norm-preserving lift (1.5), which stays unopened; the lane's label
   ARGUED and "CLASSICAL, statement opened, proof relative to (1.5)" are right. Numeric instance (random Dirichlet
   polynomials, n <= 30, ten prime variables, four seeds): the degree-one projection at the aligned point equals
   sum abs(a_p) to 4 decimals (4.7280, 6.3996, 5.9714, 6.9226) and the sup found on the torus is larger in each case.
3. **C2 (Statement O line 17, reflection parenthesis)** on a case different from the c20 referee's (T = 20000, L = 40):
   T = 50000, L = 60 with mpmath `siegeltheta`: maximum of abs(1 - e^(i Psi)) is 0.0179998 with Psi(c) = 0 mod 2 pi
   (L^2/(4T) = 0.018) and 0.00899997 at the offset L^2/(8T) (= 0.009). Also T = 3000, L = 10: 0.00833331 and
   0.00416667. Translate at T = 50000, L = 60: 4.19846e-4 against pi L/(T log(T/2 pi)) = 4.19723e-4. The sentence
   entered in version 5.1 is correct.
4. **Trefethen-Weideman Theorem 5.1**: the text in `L/sources_dl/tw2014.txt` (lines 910 to 921) matches the quotation
   in `campaign/SOURCES_R21.md`. Instance: w = exp(-x^2), h = 1: error 1.8335e-4 against the best bound over a of
   1.8335e-4 (the constant 2M is attained in the limit, as the theorem says); h = 0.7: 6.3390e-9 against 6.3391e-9;
   w = sech, a = 1.5, h = 0.5: 3.36e-8 against 1.05e-7.
5. **Source quotations**: `star2411.txt` lines 137 to 150 (Theorem 2.1 "[10, Theorem 1]") and line 169 on (Theorem 2.3);
   `bds0805.txt` line 233, display (1.6), with no proof printed. The three SHA-256 prefixes in the register match the
   PDFs. The range theta > 1 - 1/b with b = 12/5 gives 7/12: arithmetic correct.
6. **MV-CAP numbers**: 2.37 (c/2 pi)^(-3/4) = 4.03e-9 at c = 3.1e12 and 2.44 (c/2 pi)^(-3/4) = 2.14e-12 at 7.5e16; with
   abs(Z) <= 0.618 c^(1/6) log c (2,146 and 15,594) these give 8.64e-6 and 3.33e-8, the figures of the source lane's
   table. The pairing "h >= 500 with 2.44" follows the source referee's correction 1.

## 3. Errors and corrections

- **E1 (MV-CAP field, Statement O line 10; wording, constant factors).** The consequence says: "If zeta satisfies P with
  relative room above 2E + E^2 (function side) ... then F_c satisfies P". For the mean-square form this threshold is
  too small: with F = zeta (1 + d), abs(d) <= s = 2E + E^2, the integrand changes by a factor abs(1 + d)^2 - 1, up to
  2s + s^2, so the room needed relative to int w abs(A zeta)^2 is 2s + s^2 (the source, Corollary 2 of
  `b-mvcap-function-side`, asks for 3 s). For bounds on log F and F'/F the source needs sigma' > sigma strictly and a
  Cauchy factor on discs of radius sigma' - sigma; the field allows sigma' >= sigma with "relative room". Item (3) of
  "does not cover" quotes the threshold "about 2.4 abs(Z(t_m)) (c/2 pi)^(-(sigma - 1/2)/2)"; the source has twice that.
  For the zero side "room of ... 2 zeros" is 2m zeros when m gaps tie (m = 1 generically; the field says "at least
  one pair"). Repair: quote Corollary 2 with its own thresholds (3 s for mean squares; sigma' > sigma for log F, F'/F;
  2m). The label is ARGUED and no other line uses the constant, so no label or count moves.
- **E2 (MV-CAP field; two corrections of the source referee not carried).** The referee of `b-mvcap-function-side`
  held Theorem 2 with seven corrections; the field carries correction 1 (h >= 500) and 4 (H_W). Not carried:
  correction 2 (the lift's off-line pair sits at height y(eta) -> 0, so the cap is proved for the literal statement
  "no zero off the line in the window" only; a premise aimed at "no zero at distance >= y_0 from the line" is not
  capped by Theorem 2, the mirror instance is MEASURED) and correction 5 (the constants are double-precision values
  on a 6,405-point grid in (c, h, sigma), not interval-certified between grid points; 2.4357 against the quoted 2.44).
  Map row P29 carries the first of these ("covers only the literal t = 0 form"); the "one written statement" should too.
- **E3 (BR-2 node and device entry E1; set condition).** The node says: abs(alpha_p) = p^(1/2) on S "with sum over S of
  p^-sigma finite for every sigma > 1/2 and infinite at 1/2". Regime (K) of the source lane is defined by
  sum abs(1 - alpha_p) p^-sigma (its section 3, table of regimes). With abs(alpha_p) = p^(1/2) that sum is of size
  sum over S of p^(1/2 - sigma), so regime (K) means sum over S of p^-eps finite for every eps > 0 (the "super-sparse"
  sets of the lane and of the server test in the compute row of the STRATEGY allocation table), and the clause "infinite at 1/2" only says S is
  infinite. Read literally (sum over S of p^-sigma), the condition gives sigma_rel = 1, which is regime 3 and a product
  whose relative factor converges only on Re s > 1. The sentence is copied from STRATEGY section 4.0 (line 282), so
  the defect is inherited, but it is now also in `engine/nodes/nodes-23.json` and in `devices.json`. Repair: write
  "sum over S of abs(1 - alpha_p) p^-sigma" in both and in STRATEGY.
- **E4 (two counts without a record).** "2,707 contain BR-3 and 497 contain BR-2 ... the counts are in
  `L/logs/after_generate_dump.log`": that log contains the top-60 table and the per-move summary and neither number;
  the dump was deleted. The counts are plausible (sum 3,204 against 2,985 more scored candidates than before, with
  other pools shifting) but are unverified. Mark them "not on record" or repeat the run with `--dump-all` and log the
  counts.
- **E5 (evidence text of U6 (a), U6 (b)).** The second edit appended to the evidence written by the first, so the
  field now reads "state unchanged (cell) ... Set the state here when that file holds. Second edit ...: state set to
  CLOSED". The state field is right; the stale first sentence should be removed at the next edit of block R21.
- **E6 (closures of narrow scope; disclosed by the lane, confirmed).** `devices.json` defines a closed cell as "a
  refereed lane turned the class into a row", which each of the three cells meets, and the assignment's condition
  (second referee file on disk) is met. Under the Statement O label rule ("two referee files cover the closing step")
  U6 (c) would not qualify: its closing step is the non-vanishing of the defect in the Eisenstein and cusp-form runs
  (132 of 132; 14 of 14 in float64), which have one referee; the second file covers the interchange lemma only.
  U6 (a) is closed for linear groups, with the double-cover half argued. The single state value does not carry
  these restrictions; the evidence text does. A reader of the cell counts ("7 closed") should not read them as
  seven two-referee closures.
- **E7 (current text already behind the files on disk; disclosed).** `nrq-line15/REFEREE2.md` and the second files for
  the line-2, line-4 and euler-shape lanes were on disk (02:34 to 02:38 local) before the lane finished (02:40).
  `campaign/STATEMENT_O.md` is named "the current text" and keeps lines 4 and 15 ARGUED and the BR sources "one
  referee". No error in what was entered; the next record edit owes these.

Remarks, no correction asked:
- **BR as open device types.** `devices.json` describes its list as "crossing devices for requirement R4"; BR-2 and
  BR-3 are identification questions with no registered route to zeros, and they take 24 of the top 60 through the
  open-device weight (ranks 1 to 8), with partners chosen by tag overlap. The lane states this in the entries, in
  RESULT.md section 2.2 and as its weakest step 1, follows the round-18 precedent for proposed types (no penalty
  waiver; `generate.py` lines 82 to 87, 264 to 271) and names the removal (block R21 part (2)). It is a planner
  decision. A consumer of the top 60 should read `meta.r4Rules.topWithProposedDevice` and treat those 24 entries as
  one question each for BR-2 and BR-3, not as 24 leads.
- **Acceptance of version 5** rests on one campaign referee report of the c20 lane; this lane re-derived none of
  lines 13 to 17 (disclosed). My check of C2 on a new case (section 2, item 3) supports that report on line 17 only.
- **Ingham 1937** is not opened; "relative to" is the right citation form. The preprint's Theorem 2.1 is a restatement.
- The header of version 5.1 quotes the phrase "Liouville passes" while saying the phrase has no occurrence in the file;
  the search claim is true for the body.

## 4. Controls

No zeta-only mechanism is claimed, so there is no mechanism to run controls against. The one control statement the
lane writes (MV-CAP) is itself an obstruction; its numbers were recomputed (section 2, item 6) and its wording is
corrected by E1 and E2. The control facts quoted from other referee files (Liouville at p q^2, signed sigma, odd d)
were not recomputed here and are not claims of this lane.

## 5. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; the BR entries state that Theorem A uses no multiplicativity |
| R2 | false | no statement at any height |
| R3 | false | no mechanism; controls are listed as "must fail", none shown to fail |
| R4 | false | nothing is carried to the critical line |

## 6. Surviving claim

Record lane, no attack, nothing about zeros of zeta. On disk and recounted: Statement O version 5.1 = version 5 with
C2, C4, source fields and an MV-CAP field (ARGUED; wording to be repaired per E1, E2), no label changed; graph 1,759 ->
1,762 nodes; BR-2, BR-3 registered as proposed, untested open device types (BR-2 set condition to be repaired per E3)
and TS as a tool node with no role; cells U6 (a), (b), (c) closed on second referee files of narrow scope, U4
unchanged; scored 8,415 -> 11,400, top-60 overlap 18, 24 of 60 with a BR node; scoreboard changed in
`C_coverage.nodes` only; three sources opened as stated, Ingham 1937 not opened. Not established: the counts 2,707 /
497 (E4).

---

# Appendix: the lane's author check (verbatim; counts as no referee)

# REFEREE.md for c21-record-engine-states-statement-o-v5-br-nodes: AUTHOR CHECK, not an independent report

Date 2026-11-20. **This file was written by the lane itself. It is not an independent referee report and is to be counted as
referees = 0.** The lane tried once to start a separate headless process for an independent report; the session's permission
system denied the command and no other way was tried. The campaign referee step should replace this file; a brief is in
`REFEREE_BRIEF.txt`. Paths are relative to `tmp/research-2026-11-16/`; `L/` is this directory. Nothing here is a statement
about zeros of zeta.

What was run. `L/author_check.py` (reads JSON and text only; log `L/logs/author_check.log`), written after the edits and
separate from the scripts that made them. No engine script is called by it. Two derivations redone by hand (section 3).

## 1. Recounts

| quantity | RESULT.md | recount from the live files |
|---|---|---|
| graph nodes / edges | 1,762 / 9,263 | 1,762 / 9,263 |
| device nodes open / floored / closed | 2 / 6 / 71 | 2 / 6 / 71 |
| device types | 58 (55 closed, 1 floored, 2 open) | 58 (55, 1, 2) |
| cells cell / tried / closed | 3 / 1 / 7 | 3 / 1 / 7 (graph and `devices.json` agree) |
| BR nodes | roles device + lemma, state open, status "proposed, untested" | the same |
| TS node | type tool, no role | type tool, `roles: []`, no device |
| top 60 keys in common with the before list | 18 | 18 |
| top 60 with a BR node | 24 (12 + 12) | 24 (12 + 12), ranks 1-8, 10-16, 18-21, 23, 25, 26, 28, 29 |
| top 60 with TS | 0 | 0 |
| generated / scored / rejected | 38,485 / 8,415 / 30,070 -> 44,016 / 11,400 / 32,616 | the same |
| live `CANDIDATES.json` | identical to `L/final/` and `L/final2/` | identical candidates |
| scoreboard entries that differ (before rerun -> live) | `C_coverage.nodes` and the timestamp | `C_coverage.nodes` 1,759 -> 1,762; `generated` |
| STRATEGY | insertions only | 9 changed lines, in each the old line is a subsequence of the new; 2 inserted lines (change log) |
| the two checkpoint files | one word group each | 1 changed line each, old a subsequence of new |
| Statement O labels | none changed | the 17 Label bullets start with the same 60 characters in versions 5 and 5.1 |
| `STATEMENT_O_v5.md` of the c20 lane | not edited | not written by any script of this lane; `campaign/STATEMENT_O.md` equals `L/STATEMENT_O_v5_1.md` |
| quotations of the three sources | present in the text files | Theorem 5.1 and "as small as possible" in `tw2014.txt`; display (1.6) in `bds0805.txt`; "Theorem 2.1. [10, Theorem 1]" and the 1937 reference in `star2411.txt` |
| REFEREE files for the U4 round-20 lane | none | none under `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/c20-u4-second-order-archimedean-mixed-form/` |

Not recounted: the 2,707 / 497 scored candidates with BR-3 / BR-2 (from a dump that was deleted after counting; the run can
be repeated with `--dump-all`); the rejection-reason table (taken from the meta block of the two candidate files).

## 2. Points an independent referee should press (found by the author)

- A1. **BR as open device types.** The rule text in `mk_devices.py` defines a device as a crossing device for R4; BR-2 and
  BR-3 are identification questions with R4 in relative form only. The registration follows the precedent of round 18 and
  the planner's request "so the generator can propose them", and the entries say what BR is not. It still changes the
  device table from 0 open to 2 open and fills 24 of the top 60 through one weight. Whether that is the intended use of
  the device table is a planner decision, not established by this lane.
- A2. **Cell closures on files of narrow scope.** U6 (c): the second file covers Lemma Q only. U6 (a), (b): the second
  file appeared during the lane, from a lane still running; only its verdict and scope sections were read. U6 (a) is
  closed "for linear groups" with the double cover argued; the engine state has one value per cell and does not carry
  that restriction except in the evidence text.
- A3. **The acceptance of version 5** rests on one report (the campaign referee of the c20 lane). This lane re-derived
  none of lines 13 to 17.
- A4. **MV-CAP field.** It is a condensation of Theorem 2 of `b-mvcap-function-side` by one reader. "h between 500 and
  1000" combines the theorem's range [300, 1000] with the referee's remark that the constant 2.44 needs h >= 500; the
  bounds 8.7e-6 and 3.3e-8 for E are quoted from map row P29 and the lane's verdict, not recomputed. The clause on the
  ZQ variant is a remark with no derivation.
- A5. **Sources.** Ingham 1937 not opened. The proof read is in a preprint; three of its inputs were not opened.
- A6. Files that appeared while the lane ran and were not used: `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/nrq-line15/REFEREE2.md`
  (second referee of the NR-q construction; it may allow a relabel of Statement O line 15) and
  `.../c20-statement-o-line4-heat-zero-enclosures-server/REFEREE2.md` (line 4). Version 5.1 does not take them into account.

## 3. Two derivations redone

- Bohr's inequality from the lift. F bounded analytic on the polydisc with sup norm norm(f). For fixed z on the polytorus,
  phi -> F(e^(i phi) z) is a bounded analytic function of w = e^(i phi) in the disc with Taylor expansion sum over m of
  w^m F_m(z), F_m the m-homogeneous part; its first coefficient is F_1(z) = sum over p of a_p z_p (monomials of degree one
  are the single variables, which correspond to primes). Cauchy: abs(F_1(z)) <= norm(F). Choosing z_p = conj(a_p)/abs(a_p)
  on finitely many primes and letting the set grow gives sum abs(a_p) <= norm(F) = norm(f). Uses the norm-preserving lift
  (1.5) (not opened) and, for infinitely many variables, radial limits or the finite-section argument; ARGUED.
- Covering remark. Fix 7/12 < theta1 < theta < 1 and eps > 0. For y large, put x_0 = y + y^theta and x_(j+1) = x_j - x_j^theta1
  while x_(j+1) >= y. The intervals (x_(j+1), x_j] are disjoint, lie in (y, y + y^theta], and cover it except for a piece of
  length at most (2y)^theta1. Each has at least (1 - eps) x_j^theta1/log x_j primes for y >= y_0(eps) (the asymptotic, uniform
  for x >= y_0). Summing: pi(y + y^theta) - pi(y) >= (1 - eps)(y^theta - (2y)^theta1)/log(2y) >= c y^theta/log y. Holds.

## 4. Verdict of the author check

The counts of RESULT.md agree with the live files. No requirement flag is set: R1, R2, R3, R4 false; score 0; no statement
about zeros of zeta. This check does not replace a referee: points A1 to A6 are open to an independent reader.
