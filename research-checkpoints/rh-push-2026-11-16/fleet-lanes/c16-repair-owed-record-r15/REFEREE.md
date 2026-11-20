# REFEREE.md: c16-repair-owed-record-r15

## Independent referee report (2026-11-19, lens: general)

Written by a separate agent that did not author RESULT.md. Own scripts in a scratch directory outside the lane
(text and JSON reads of the state files; one mpmath run at 30 digits through `scripts/memcap.sh 8`; no server
use; no state file rerun or edited). The author's second pass is kept unchanged below this report.

**Outcome: the verdict (partial-result, record lane, no statement about zeros of zeta) HOLDS, with one
substantive correction about the engine state (E1) and five minor ones. Flags: R1 false, R2 false, R3 false,
R4 false. Counts as one referee.**

### Record claims checked against the live files

| claim | check made here | result |
|---|---|---|
| map 202 -> 205 labelled rows, added S12b, Q30, G41, no duplicate label | labels parsed from `before/OBSTRUCTION_MAP.md` and the live map | confirmed |
| map edits are insertions or extensions | line diff before/live: 4 insert blocks, 6 replace blocks, 0 deletions | confirmed |
| control rows ZQ, SG, NR-q in section 2 | present, lines 66 to 68 | confirmed |
| Q25 was taken | row Q25 (family bridge, round 7) is at line 244 | confirmed |
| G41 states the canonical tier NOT CLOSED | text read; figures 22,508 / 67,138 / 12 of 24 / 7,314 match the c15 lane and its referee item 3 | confirmed |
| devices 53 / 1 / 11, pending 7; curated controls 8 | `engine/curated/devices.json`, `controls.json` | confirmed |
| graph 1,718 nodes, 9,118 edges; control 58, obstruction 675, open-direction 39; edge counts by type | live `IDEA_GRAPH.json` | confirmed |
| no obstructs or control-defeats edge at a silent-cell node | 0 found | confirmed |
| outcomes byte-identical | sha256 of 140 outcome files, `outcomes.json`, `closed_families.json` recomputed and compared with `baseline/sha.before` | confirmed |
| `build_graph.py` unedited | byte-identical to `before/build_graph.py` | confirmed |
| top 60 identical after stage 1 | `baseline` against `after1`: same keys, order, scores | confirmed |
| after stage 2: 2 of 60 keys remain, 57 on a silent-cell node | live `CANDIDATES.json`: keys M4-0e299f (rank 50) and M3-e4014a (rank 55) remain; 57 with an open device, 3 without | confirmed |
| ten screening lines, referees 0, no `refereeHolds`, score 0, tags ["screen"] | lines 131 to 140 of `lanes.jsonl` | confirmed |
| first 130 lines of `lanes.jsonl` unchanged by the lane | equal to `before/lanes.jsonl` (they differ from `lanes.jsonl.bak-r15` in 14 lines, changed by the round-15 learn step before this lane started) | confirmed |
| headline 1 of 4, hold rate 0.908, lanes run 141, refereed 130 | live `scoreboard.json` | confirmed |
| 65 source quotes verbatim | `check_sources.py` rerun: 65 entries, 15 files, 0 failed | confirmed |
| report E2 figure 107 of 119 = 89.9%; E3 figure 0.8748866471 above the infimum 0.874886647039964 | arithmetic | confirmed |

### Rows read against the referee files (the check the author's pass did not make)

- S12b against `c15-u5-.../REFEREE.md` E1 to E4 and minor (iii): K_tr with both terms, "second term only for K at
  most 2", "sharp for abs(alpha) <= T/2", absolute test only, a(1) = 0 for the minus sign, scope for
  identification-type conclusions. Faithful. sqrt(T)/log T = 10.9, 27.5, 72.4 recomputed.
- Q30 against `c15-u7-.../REFEREE.md` E1 to E5: T-NR with abs(c) > 2, 4 of 4 unimodular twists, per-zero bound and
  the summed bound below 1e-9, Proposition 5 constant not copied, CLASSICAL in content (Hinkkanen, Lagarias
  recalled). Faithful. The row presents no known theorem as new.
- G41 against `c15-nonhomogeneous-.../REFEREE.md` items 1 to 5: 360 + 392 and 360 + 2,414, one-lift scope of the
  heat blindness, canonical and FE tiers not closed. Faithful.
- ZQ, SG, NR-q and the note against `c15-control-.../REFEREE.md` E1 to E4. Faithful.
- Restrictions 5, 11, 14, 21, 27, 30 read against `LABEL_RESTRICTIONS.md`: same wording. Restriction 8 (Lemma A
  exponents 3(1 - sigma)/(2 - sigma) up to 4/5, 2(1 - sigma)/sigma above) agrees with Montgomery's theorem as
  usually stated (recalled, not opened).

### Steps re-derived (statements the lane copies with the label PROVED)

1. ZQ density. A zero rho of G contributes -x^(rho-1) to the density of -G'/G on x > 1, a pole +x^(rho-1) per
   order. Quartet added, two line pairs removed:
   D = -4 x^(-1/2) cos(gbar L)(cosh(eta L) - cos(d L)). CONFIRMED. Bound: cosh y - 1 <= (y^2/2) e^y,
   1 - cos y <= y^2/2, max of L^2 e^(-aL) is 4 e^-2/a^2 at a = 1/2 - eta: sup abs(D) <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2.
   CONFIRMED. The numerator in Statement O line 13, (t^2 + gbar^2 + eta^2)^2 - 4 gbar^2 t^2, equals
   (t^2 - (gbar - i eta)^2)(t^2 - (gbar + i eta)^2). CONFIRMED.
2. SG. D = -2 x^(-1/2)(cosh(bL) - cos(g1 L)) <= 0; m(1) finite and non-zero. CONFIRMED.
3. NR-q. Zeros of q^w + c + q^(-w): Re w = +-arccosh(abs(c)/2)/log q, Im w = (2k + 1) pi/log q for c > 2; inside the
   strip iff abs(c) < q^(1/2) + q^(-1/2) = 2.1974; local parameter modulus q^(1/2)(c + sqrt(c^2 - 4))/2 = 2.129 at
   c = 2.1. CONFIRMED.
4. G_+ (Statement O line 16, "one derivation, owed a second"). Double poles at 1/2 +- b give +4 x^(-1/2) cosh(bL),
   the quartet gives -4 x^(-1/2) cos(gbar L) cosh(eta L); D_+ >= 4 x^(-1/2)(cosh(bL) - cosh(eta L)) >= 0 for
   b > eta. CONFIRMED: this is a second derivation of D_+ >= 0 (by a referee of this lane, not a second referee of
   the c15 control lane).
5. Lemma L with its pole clause. Real poles of m = G/zeta can sit only at trivial zeros of zeta, and G(-2n) != 0
   gives a pole of G at 1 + 2n through the functional equation; a real zero of m makes -m'/m tend to -infinity
   from the right; Landau then gives an entire transform, and f(sigma) = -f(1 - sigma) with f >= 0 gives f = 0.
   CONFIRMED (relative to Landau's theorem, recalled). G_+ shows the clause is necessary.

### Numeric check rerun with different cases (mpmath, 30 digits)

- NR-q at c = 2.15 (lane: 2.1, 2.2): zero at 0.936724771914753 + 3.564427956382738 i, abs value 7e-32, winding 1.
- SG at b = 0.2 with the first zero (lane: b = 0.3): m(1/2 + b) = 1e-34; Laplace identity -m'/m(3) = integral of
  D x^-s: both sides -0.780885900039879443758701133312.
- ZQ on zeros 34, 35 with eta = 0.05 (lane: pairs (1, 2), (6709, 6710), (298, 299)): Laplace identity at s = 3 agrees
  to 30 digits; sup abs(D) on a grid 0.6436 against the bound 0.9680.
- G_+ on the same pair with b = 0.3, eta = 0.05: Laplace identity agrees to 30 digits; min D_+ on the grid
  4.96e-3 > 0; m_+ vanishes at the quartet point (1e-36).
- Pair (6709, 6710), eta = 0.01: the bound evaluates to 2.05e-3; the row's "1.97e-3 measured" is the measured
  supremum and lies below it. Consistent.

### Errors and corrections

**E1 (substantive; engine semantics; disclosed only in part).** In `engine/generate.py` the device state "open"
means an open crossing device: it fills the requirement slot `crossing`, adds the weight 2 (line 439), and
exempts a candidate from the two penalties of -3 for a majority of flow-side or mean-value members (lines 475
and 480). The eleven silent cells are entered in that state. Their own node texts say "Not a lead; no lane has a
registered reason to expect a crossing here", and U6 (a) says "No candidate object is on file". The live
`CANDIDATES.json` therefore lists, at rank 1 (M3-f0e2d7, 12.03), a candidate whose requirement `crossing` is
`silent-u8-kernel-conditions-beyond-searched-range`, and 57 of the top 60 have a silent cell as their R4 device.
RESULT section 3.2 reports the weight; it does not report the penalty exemption, and the phrase "open device"
in the claim line reads as a state of knowledge when it is a scoring state. A read class on which the record is
silent is not a mechanism for passing to the critical line. Required before the next allocation reads the top
60: move the eleven types to PENDING, or give them a state of their own with weight 0 and no exemption. Until
then the top 60 on file is not a ranking by R4 evidence, and `baseline/CANDIDATES.json` is the list to use. This
does not change any count in the claim; it changes what the claim's last sentence means.

**E2 (count).** Section 3.2 gives per-cell counts 12, 12, 10, 9, 5, 3, 3, 2, 1, 1, 0, which sum to 58 for 57
candidates. One candidate (M3-15b343) contains two silent-cell nodes. The text should say so.

**E3 (stale line, found at 13:44).** `push/s1-klein-annulus-energy/RESULT.md` exists now (written after the
lane's line). The line with verdict "not-reported" is to be replaced by the next record lane.

**E4 (round label).** The ten screening lines carry `round: 15` while their own claim text says "not a campaign
lane of round 15". The scoreboard history row of round 15 changed from 8 to 18 lanes after the fact. Stated in
section 6 of RESULT; a separate round label or kind-based exclusion from the history row is owed.

**E5 (wording, Statement O line 13, "Mode and floor").** "The defect needed to defeat an output abscissa theta is
at most 8 e^-2 ((theta - 1/2)^2 + d^2)/(1 - theta)^2; the infimum over the family is 0". For a fixed theta > 1/2
the infimum of that bound over pairs is 8 e^-2 (theta - 1/2)^2/(1 - theta)^2 > 0. The infimum 0 is over eta -> 0
and d -> 0 together (small gaps exist by Selberg's positive proportion). The two clauses need to be separated.

**E6 (minor).** (i) "622 -> 638 lines": the files have 621 and 637 newline-terminated lines. (ii) "Hold rate 90.8%
unchanged" is true; the rate still counts the author passes of three earlier repair lanes as referee passes
(correction E2 was applied to the report text only, not to `lanes.jsonl`). (iii) Older paragraphs of STRATEGY and
ROUND_LOG still say "Q25 proposed" (stated by the lane).

### Checks on the campaign rules

- RH is not assumed. Verified height is not used; row Q30 states that the measured positivity is implied by it.
- No known theorem is presented as new: Q30 is labelled CLASSICAL in content, Lemma L is relative to Landau,
  restriction 8 is relative to Montgomery.
- No statement about zeros of zeta. The zeros in the rows are zeros of control functions.
- No zeta-only mechanism is claimed, so there is no mechanism to run the controls against. The control
  constructions themselves were rerun (above).
- Edits outside the lane directory are inside `push/`, `campaign/` and `engine/`. Two RESULT files of other lanes
  were edited by marked, dated insertions; the stripped-file equality for the c15 lane was not rerun here.

### Not checked here

Restrictions other than the seven listed; the full text of Statement O sections C and F against the checkpoint
(section F was read once; no error found; U2-POS is stated as undecided, which matches the map note); the 13
"no longer enumerated" candidates and the five scores that moved by 0.01; the claims of the ten screening lanes
(three heads read: "0 survivors" in each).

### Requirement flags (set by this referee)

- R1 false: no argument; nothing uses multiplicativity.
- R2 false: no conclusion about any window.
- R3 false: no mechanism; the rows record controls that pass.
- R4 false: not addressed. Entering silent cells as open devices does not supply R4 (E1).

### Surviving claim

Record lane; nothing about zeros of zeta. The counts of the claim are confirmed on the live files: map 202 -> 205
rows (S12b, Q30, G41 with the canonical tier NOT CLOSED) and control rows ZQ, SG, NR-q, worded faithfully to
the four referee files; 30 restrictions and the notes entered; devices 53 / 1 / 11, pending 7, controls 23;
ten screening lines with referees 0; headline 1 of 4 and hold rate 90.8% unchanged; outcomes byte-identical.
The control constructions ZQ, SG, NR-q, G_+ and Lemma L are re-derived and rechecked numerically in new cases.
Correction: the eleven silent cells are scored by the generator as open crossing devices (weight 2 and
exemption from two penalties); the current top 60 is an effect of that state and is not a ranking of leads; the
state should be changed before the list is used.

---

# Author's second pass (kept unchanged; not a referee)

# REFEREE.md: c16-repair-owed-record-r15

## Status of this file

**This is not an independent referee report.** The assignment asks for an independent REFEREE.md. The agent
that did the lane had no means of starting a second agent, so no independent pass exists. What follows is the
author's second pass, done with a separate script (`ref_checks.py`, text and JSON only; `ref_checks.json`,
`ref_checks.log`). It must be counted as zero referees: the lane line in `campaign/lanes.jsonl` has
`referees: 0` and no `refereeHolds` field, so the scoreboard counts the lane as run and not as refereed. An
independent referee is owed (repair lane A of the next round).

## What the second pass checked (42 checks, 0 failed)

| check | result |
|---|---|
| every source file exists and contains its quoted sentence verbatim (65 entries, 15 files) | pass |
| the map rebuilt by `apply_map.py` from `before/` is byte-identical to the live map | pass |
| map line diff: 622 -> 638 lines, none deleted; old sentences of replaced lines that are not kept verbatim | 7, each an intended replacement (listed below) |
| 205 row labels, no duplicate; new rows have 6 cells, control rows 5 | pass |
| every lane cited in rows S12b, Q30, G41, G37 to G40 has a directory and a RESULT.md | pass |
| the 30 restrictions: item number and a key phrase of each at its stated place | pass |
| row G41 states the canonical tier as NOT CLOSED and names the round-16 lane | pass |
| c15 lane-2 RESULT: three marked insertions and one note; minus them the file equals the filed text | pass |
| c14 pre-filter RESULT: 15 lines added, 0 removed; the filed sentence still present | pass |
| report: four dated markers, a "Corrections" section quoting the filed sentences, figure 0.8748866471 | pass |
| STRATEGY: still version 5; 4 lines replaced, 6 added | pass |
| ROUND_LOG: lines 971 and 980 extended, no other line of the first 1,083 changed | pass |
| lanes.jsonl: first 130 lines unchanged; 10 screening lines, referees 0, no refereeHolds | pass |
| sha256 of `outcomes/` (140 files), `outcomes.json`, `closed_families.json` before = after | pass |
| `engine/build_graph.py` byte-identical to the file found at the start | pass |
| devices 53 / 1 / 11, pending 7; each open type on one graph node of type open-direction | pass |
| no obstructs or control-defeats edge touches a silent-cell node | pass |
| stage 1: top 60 identical in keys, order, scores; scoreboard differs in part C node counts only | pass |
| stage 2: scoreboard differs in the node count only | pass |
| stage 3: graph and top 60 identical; scoreboard differs in lanes run, score-0 count, history | pass |
| headline 1 of 4, hold rate 0.908 | pass |
| Statement O v4 = v3 with insertions only (title line replaced); five new lines; section F | pass |

The seven old sentences not kept verbatim in the map: the "NOT HOLDING, until lane ... reports" clause of the
Lemma F note (now "has reported; replacement at the end"); the sweep sentence of that note (kept, with
"(counts: READ, one reader)" inserted); the "Not covered" sentence of row G38 (kept, with the pointer to row
G41); the Riemann-Siegel count sentence of row S12 (kept, with the round-15 correction in brackets); the
row-count line; two sentences of the last section-7 row ("Open until lane ... reports the repair" replaced by
the reference to Theorem E1').

## Corrections made during the second pass

1. Node wording. The first text of five silent-cell nodes cited neighbouring rows as "map row X". The builder
   reads that pattern as "this node is obstructed by row X" and inherits the row's controls: 4 obstructs and 8
   control-defeats edges onto cells that the rows do not close. Reworded; rerun; no such edge remains
   (`diff_after1_after2.first-wording.json` keeps the first state).
2. `build_graph.py`. A first run added the codes NR-q, ZQ, SG to `CONTROL_CODE_RE`. The lane's engine scope is
   `engine/curated`; the file was restored and stage 1 rerun. The two stage-1 difference files agree in every
   field.
3. Map header. The "twelfth" paragraph was first written on the line directly under the "eleventh" (one
   paragraph when rendered). Fixed by a blank line.
4. Statement O, line 15. A sentence said that T-NR at a rational prime has integer added frequencies; in the
   symmetric normalisation its frequencies are log(n/q), log n, log(nq). Reworded.
5. A check script was first piped to `scripts/memcap.sh` on standard input, which the wrapper does not pass on;
   the check did not run and its input (an 88 MB dump) had been deleted. Rerun from a script file.

## What this pass did not do, and what an independent referee should attack first

1. Read rows S12b, Q30, G41, the three control rows and the ZQ note against the four referee files, sentence by
   sentence. The source check proves that the quoted sentences exist; it does not prove that the rows say what
   the referees meant. Places where the compression is strongest: row G41 (two lanes, two referee files and the
   lift ruling in one row), the S12b sentence on K_tr, the Q30 defeated-by cell.
2. Restrictions 14, 21 and 27 were copied as worded by the second referee and not understood beyond that.
3. Statement O version 4: whether lines 13 to 16 are properly inside the statement at all, given that the
   controls extend class K of A1; whether line 17 duplicates outline line 14; whether section F reads the
   checkpoint correctly (U2-POS and the four identification classes in particular); whether D_+ >= 0 in line
   16 holds (one derivation, in a referee file; not re-derived here).
4. Whether the eleven silent-cell nodes should be open devices. The effect on the top 60 is measured
   (57 of 60); the decision is not argued here beyond the assignment's wording.
5. The ten screening lines: the claims are copied from the heads of the lanes' own RESULT files.
6. Sentences of other files that still carry the superseded wording and were left alone: older paragraphs of
   ROUND_LOG and STRATEGY that say "row Q25 proposed"; `CHECKPOINT_R14_DRAFT.md`; section 2.4 of the report
   beyond the corrected sentence.

## Requirement flags

R1 false, R2 false, R3 false, R4 false. About zeros: no. Score 0. The lane makes no argument.
