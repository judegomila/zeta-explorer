# REFEREE (adversarial, lens: general) for c19-repair-owed-record-r18-checkpoint-prep/RESULT.md

Date 2026-11-19 (local). One referee, independent of the author. Local runs only, through `scripts/memcap.sh 8`
(mpmath 40 digits, seconds); no server use. The check script is not stored (this file only); inputs are stated below.

## Verdict

**Holds, with corrections E1 to E5 (none changes the verdict).** The lane is a record lane: it proves nothing, makes
no statement about zeros of zeta, and the headline stays 1 of 4. Every count in the claim line was recomputed from
the files and agrees. The mathematics it quotes from other lanes (labels PROVED there) was re-derived where the
record depends on it and is correct. Nothing assumes RH, nothing restates verified height, and the quoted known
results (Knopp 1994, Voronin, Hermite-Biehler) are labelled as known.

Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false (agree with the lane).

## Counts recomputed from the files (all agree)

| claim | how checked | result |
|---|---|---|
| device table 55 closed / 1 floored / 0 open (before: 53 / 1 / 2) | `engine/curated/devices.json`, `before/devices.json`, `final/devices.json` | agree; cells 6 / 1 / 4 before and after |
| `closedOn` with referee count 1 on both types | `devices.json` | present, files and map rows named |
| map 211 -> 215 rows plus HQ2; no duplicate label | first-cell labels of the live map against `before/OBSTRUCTION_MAP.md` | 216 distinct labels against 211; added exactly X1, P58, G44, Z37, HQ2; per-letter sum 58+44+31+13+40+8+3+6+10+1+1 = 215 |
| top 60: 56 keys in common, same scores; rank 1 unchanged at 10.25; minimum -0.02 -> 0.29 | node-set keys of `before/`, `after/`, `final/`, live `CANDIDATES.json` | agree; the four leaving entries (2.00, 0.09, 0.04, -0.02) and four entering (2.08, 1.25, 0.30, 0.29) are as listed; `after` = `final` = live |
| 0 entries on a proposed node before and after | search of node ids in all four candidate files, including the as-found file | 0 in each; as-found and rerun lists have the same 60 keys |
| reason: round-18 outcome records name the proposed nodes | `engine/outcomes.json` | three c18 records with `nodes` = the proposed node, state closed |
| graph 1,742 / 976 / 247 / 9,192 -> 1,746 / 976 / 251 / 9,211; pool 8 -> 6; generated / scored; rejection 10,526 -> 3,806 | `meta` blocks | agree |
| scoreboard: nodes 1,742 -> 1,746, marked closed 601 -> 605, lanesRun 164 -> 165, otherwise unchanged | `before/scoreboard.rerun.json`, `after/`, `final/`, live | agree (families 126,756, outcome records 194, broken 11, headline) |
| eight round-18 records in `outcomes.json`; 30 outcome files without a record | slugs | agree (164 records, 194 files, the 30 are `s1-`, `s2-`, `s3-`) |
| STRATEGY: items 48 to 58, one bracket, one 4.0 paragraph, one change-log bullet; no rule change | diff against `before/STRATEGY.md` | agree; sections 1, 2, 3 text untouched |
| Statement O v4: 12 lines MEASURED or ARGUED | header of `STATEMENT_O_v4.md` (PROVED 4, PROVED relative 1, MEASURED 1, ARGUED 11) | agree; the REFEREE2 files cited for lines 13 to 17 exist |
| five correction notes in three lane files | grep | five, each after the original sentence |
| `lanes.jsonl` line | parsed | valid; referees 0, flags false, score 0 |

## Quoted PROVED steps, re-derived

- **HQ2** (row X1, control row): u -> 1/u fixes u^2/(1-u)^4; u^2(1-u)^-4 = sum_{k>=2} C(k+1,3) u^k, so the product
  with zeta is the convolution of 1 with a function supported on powers of q: multiplicative, a(q^v) = 1 + eps
  sum_{2<=j<=v} C(j+1,3) q^(j/2) >= 1. Zeros: (1-u)^4 = -eps u^2, four roots at angles pi/4 + k pi/2 about u = 1,
  real offset eps^(1/4)/(sqrt 2 log q) to leading order. Correct.
- **TN1, Proposition F**: zeros of 1 + q^(3/4-s) on Re s = 3/4; eps = c_q + 2 gives cosh(theta) = c_q/2,
  theta = (log q)/4, abs(u) = q^(+-1/4). Correct.
- **Display (A), constant -u** (row P58 and the two notes): for an exponential polynomial D_P with a_1 = 1,
  a_P != 0, D'/D tends to 0 as Re s -> +infinity and to -log P as Re s -> -infinity, and the symmetric zero sum
  tends to +-(pi times the zero density) = +-(log P)/2; hence D'/D = -(log P)/2 + sum 1/(s - beta) with no
  further constant, for every a_P. Hand case D = 1 + a 2^-s: the zero sum is (log 2 / 2) coth, and
  -(log 2)/2 + (log 2 / 2)(2^s - a)/(2^s + a) = -a log 2/(2^s + a) = D'/D. The note is correct; no log abs(a_P).
- **Proposition D (c) repair**: f = 1 + 2^-s/4 + 3^-s/4 has abs(f - 1) <= 0.3212 < 1/2 on Re s > 1/2 and
  a(6) = 0 != a(2) a(3) = 1/16. Correct as a Voronin target on the whole right half-strip.
- **Fraction of right zeros of D_P** (row P58): 18/52, 24/76, 30/98, 18/66, 26/84, 26/92, 42/132, 46/170, 60/186
  are 27.1 to 34.6 percent: "27 to 35" is the referee's range. Correct.
- **G_+ inequality** quoted in the checkpoint file: cosh(bL) >= cosh(eta L) >= cos(gbar L) cosh(eta L) for eta < b.
  Correct.
- **D10 parity instances** (2,1), (1,2), (16,1), (15,2): match the table of the source referee file line by line;
  not recomputed here (entered as instances, not as a theorem; that wording is right).

## Numeric check rerun on different cases

HQ2 at (q, eps) = (5, 0.1) and (11, 0.03), neither in the lane, its source, or the source referee (which used 7, 0.2):

| case | root (findroot) | closed form agreement | offset / leading term | FE residual (completed function, two points) | zeros minus poles, small circle / radius 0.45 |
|---|---|---|---|---|---|
| 5, 0.1 | 0.7501991547 + 0.2436992927 i | 1.7e-42 | 1.0127 | 1.5e-40, 1.1e-41 | -4 / 0 |
| 11, 0.03 | 0.6235935891 + 0.1218230867 i | 2.8e-42 | 1.0071 | 2.1e-41, 0 | -4 / 0 |

Coefficients (n < 3000): minimum 1; 0 violations of multiplicativity on coprime pairs below 60; Dirichlet series
at s = 8 + i against the closed form: 8.5e-26, 6.5e-26. So: pole of order 4 at 1/2, exactly four zeros within 0.45,
ratio 1 + O(sqrt eps). Proposition F at q = 11 (k = 0, 2): abs(G) <= 4.7e-42 on Re s = 3/4 with abs(zeta) = 0.77,
1.00. TN1 at q = 11, k = 1: 1.1e-40. The control row HQ2 as entered is confirmed.

## Controls

The lane claims no mechanism, so there is none to run controls against. The one new control it records (HQ2) was
run above and behaves as the row says (passes FE, integer frequencies, multiplicativity, coefficients >= 1; fails
only the pole clause).

## Errors and corrections

**E1 (closure on one refereed obstruction, against the rule of STRATEGY section 3).** Section 3 reads: two
refereed obstructions close a family; one marks it "tried, not closed". The device type `exact-relation-rigidity`
and items 54, 56, 57 of section 3.1 are entered as closed on one referee file each, under the heading "Families
closed by this rule". The lane discloses it (weakest step 3) and the instruction came from the round-18 "Owed"
line, so this is not an unreported slip; but the state "closed" for these three is a planner instruction, not an
application of the rule, and should be read as "closed pending the second referee". (`tz-one-sided-completion-
bound-band` has two refereed lanes and meets the rule.) No file `REFEREE2.md` exists in a c18 directory at the time
of this report and `c19-referee-r18-independent-sources` has no RESULT.md.

**E2 (a new hard assertion in the engine, described as a check only).** `engine/curated/mk_devices.py` line 411,
`assert not [d for d in D if d[1] == 'open']`, makes the script fail whenever any device type is open. The next
record lane that registers a proposed type (state open), or that reverses one of these two closures as the block
itself describes, must delete this line first. RESULT section 3 presents it as a control check of this assignment;
it is a standing constraint on the file and should be stated as such, or scoped to the two R18 ids.

**E3 (graph nodes of the closed types keep status "conjectural").** In the regenerated `IDEA_GRAPH.json` the nodes
`exact-relation-rigidity` and `tz-one-sided-completion-bound-band` still have status conjectural (the lane left
tags, type and status untouched; listed among its smaller limits). Their exclusion from the generator rests on the
device table and on the three outcome records, not on node status. A reader of the graph alone would see two
conjectural nodes. Not an error of count; a state recorded in two places with different values.

**E4 ("outcome records 194").** The scoreboard entry counts files in `engine/outcomes/` (194); `outcomes.json`,
which the generator reads for the rejection "combination closed in outcomes.json", has 164 records. The lane
reports the 30-file difference as an observation; the sentence "outcome records 194 ... unchanged" should name
which count it is. Not caused by this lane.

**E5 (wording).** "the fraction '27 to 35 percent' in place of the lane's '35 to 40'": the source lane prints
"34 to 41 percent ... at P <= 30" in its body and "about 35 to 40" in its proposed row; the referee's E6 corrects
the former. The row text is right; the attribution in RESULT 2.2 is to the proposed row only.

## Limits of this report

Rows G44, Z37, Q31, P57, D8 (vi), G33 were not compared sentence by sentence with their referee files (X1, HQ2,
P58 in part, and the D10 addendum were). The replica run behind "0 scored candidates containing a proposed node
in the old run" was not repeated; the weaker statement (0 of the top 60, in the as-found and rerun files) was
verified directly, together with the three outcome records that explain it. The checkpoint file's cost estimates
are estimates and were not tested.

## Surviving claim

Record lane; no statement about zeros of zeta; headline 1 of 4 unchanged. The owed list of round 18 is entered:
device table 55 closed / 1 floored / 0 open, with `exact-relation-rigidity` closed on one refereed obstruction
(pending a second referee; E1) and `tz-one-sided-completion-bound-band` on two refereed lanes; map 215 rows plus
control HQ2 (confirmed numerically on two new cases); corrections of display (A), Proposition D (c) and the parity
clause entered as notes and are mathematically right; STRATEGY record items 48 to 58 with no rule change; the top
60 had 0 entries on a proposed node before and after, 56 of 60 keys in common; scoreboard nodes 1,742 -> 1,746.
`mk_devices.py` now refuses any open device type (E2). Score 0.
