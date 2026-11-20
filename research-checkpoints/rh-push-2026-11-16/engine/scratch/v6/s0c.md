## 0c. State after round 20: checkpoint applied (180 lines in `lanes.jsonl`: 170 lanes and 10 screening lanes)

| kind | rounds 1-15: lanes / score sum / holds / lemmas decided / PROVED broken | rounds 16-20: same | all |
|---|---|---|---|
| explore | 41 / 0 / 36 / 37 / 5 | 5 / 0 / 4 / 9 / 2 | 46 / 0 / 40 / 46 / 7 |
| deepen | 26 / 1 / 23 / 28 / 2 | 9 / 0 / 9 / 9 / 1 | 35 / 1 / 32 / 37 / 3 |
| combine | 30 / 0 / 28 / 29 / 2 | 6 / 0 / 6 / 13 / 1 | 36 / 0 / 34 / 42 / 3 |
| compute | 15 / 0 / 14 / 11 / 0 | 10 / 0 / 9 / 8 / 1 | 25 / 0 / 23 / 19 / 1 |
| repair | 18 / 0 / 17 / 2 / 2 | 10 / 0 / 10 / 9 / 0 | 28 / 0 / 27 / 11 / 2 |
| screen | 10 / 0 / 0 / 0 / 0 | 0 | 10 / 0 / 0 / 0 / 0 |
| total | 140 / 1 / 118 / 107 / 11 | 40 / 0 / 38 / 48 / 5 | 180 / 1 / 156 / 155 / 16 |

Source: `lanes.jsonl`, recomputed for this review (fields `kind`, `score`, `refereeHolds`, `lemmasDecided`, `brokenProved`). The score sum of rounds 1 to 15 reads 1, not 2 as in section 0b, because the round-20 learn step set the score of `c1-leeyang-krein-limit` to 0 (below).

- Headline (part A): **1 of 4**, through `c4-helson-discrepancy-zerofree` alone (R1 for a theorem relative to zeta; one referee; missing R2, R3, R4; family closed, section 3.1 item 8). The second referee of Theorem D of `c1-leeyang-krein-limit` (`c20-referee-theorem-d-headline-and-r19`) holds the theorem as a restatement and rejects its R1 flag: zero-free exponential stages exist for Davenport-Heilbronn (Lemma E) and Euler stages of T-NR, HQ2, G_q have local zeros. The R1 flag of the c4 lane has not been put to the same test. The other 179 lines score 0. No lane has R2, R3 or R4.
- Frontier (part B): no figure moved in twenty rounds. Zero-free abscissa 7/8 (Lean-checked); 0.8748866471 claimed in unrefereed manuscripts. State of "R4 inside the 7/8 architecture": no probe with h > 1.
- Reliability (part D): 170 refereed, hold rate 91.8%; 16 PROVED claims broken by referees (5 of them in rounds 16 to 20: explore 2, deepen 1, combine 1, compute 1); 2 statements with three referee files, 0 about zeros.
- Coverage (part C): 1,756 nodes; 139,128 tag-pair families, 4,157 closed, 1,351 tried and not closed, 133,620 open and untried; 155 lemmas decided. Device table: 56 types, 55 closed, 1 floored (the 7/8 type), 0 open. Cells: 11, of which 4 closed, 1 tried and not closed, 6 with engine state `cell` (of these six, U4, U6 (a), U6 (b), U6 (c) are closed by their lanes in rounds 19 and 20, section 3.1 items 63 and 66 to 69; U6 (d) and U8 beyond DU have no candidate object).
- Screening arm: 160 combinations in four rounds, 0 survivors (`SCREEN_SURVIVORS.md`).

What paid off in rounds 16 to 20, by kind (no kind scored; the measure is lemmas decided and cells or lines changed):

- combine: 13 lemmas in 6 lanes (2.2 per lane), the highest rate. The lanes that produced controls and filters used by every later lane are combine lanes (the paper filter over the cells in round 16; HQ2 as a screen and the controls HQ3, HQ4 in round 19; Theorem A of `c20-euler-shape-rigidity-infinite-modified-primes`).
- explore: 9 lemmas in 5 lanes, 2 broken PROVED steps, and 0 of 5 passed stage A. Since round 11: 18 of 18 two-stage explore lanes stopped at stage A.
- deepen: 9 lemmas in 9 lanes; the one statement with three referee files of this period (Theorem P of `c16-pos-fe-u2-positivity-rigidity`) and five cell verdicts (U2-POS, U6 (e), U6 (f), U6 (a), U6 (b)).
- compute: 8 lemmas in 10 lanes, 2 dead. Certified conversions paid (DN canonical tier closed as MEASURED; DH Pick certificate to order 148 with Theorem C; enclosures of six backward-heat zeros and the SG and NR-q zeros; the enclosed limit of Theorem A of the census lane). Searches paid nothing: U8 on dictionary DU (4,360,000 family-nodes, outcome none), the band-device runs (items 55, 60), the D_P zero census (no survivor statistic), the mixed-form census (zeta fails T2 >= 0, DEL passes).
- repair: 9 lemmas in 10 lanes; in round 20 the referee lane changed the headline.

Three structural reasons account for every stage-A stop of rounds 16 to 20 (round-20 lessons; each has at least one referee file):

1. Window scalar. On window vectors at height t the archimedean side is a scalar up to log t / t (Lemma S of `c20-u4-second-order-archimedean-mixed-form`), so a form that pairs the prime side below P with the gamma side is the first-order band form times a scalar.
2. Twin invisibility at a stage. Every form reading Lambda(n), n < P, with the gamma side takes the same value for zeta and for twins modified at a prime q >= P (K3-M; HQ1, HQ3, HQ4 at q >= P, HQ2 at q^2 >= P). No stage-level inequality at P = t^theta', theta' < 1, locates zeros near t.
3. Stage-level tests are not arithmetic. Zero-free finite stages exist for Davenport-Heilbronn (Lemma E), and a non-Euler series with off-line zeros passes Pick positivity to any order on bounded node ranges (Theorem C of `c20-statement-o-line2-dh-pick-kernel-certified-server`).

Checkpoint (rule of version 5, section 2; evidence in `CHECKPOINT_R20_DECISION_SHEET.md`). Condition A (no lane has passed stage A): holds; the round-20 explore lane returned a stage-A stop and an independent referee holds it. Condition B (no silent cell has produced a non-identity statement that no control passes): holds; the last cell without a passing control on file (the second-order mixed form of U4) is closed by two round-20 lanes. Both conditions hold, so the consequence is applied in section 1: cell-by-cell explore falls to 0 and the work items W1 to W3 of the decision sheet are scheduled. The campaign result stays in the form of section 0a: a refereed record of obstructions (map of 217 rows, Statement O), the part-B figure relative to unrefereed manuscripts, headline 1 of 4, nothing about zeros of zeta.
