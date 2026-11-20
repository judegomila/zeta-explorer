# Campaign scoreboard

Generated 2026-11-20T08:41Z by scoreboard.py. Definitions: METRIC.md. Four parts, reported separately; there is no combined number.

## A. Requirement score (referee-confirmed R1..R4)

Headline (best mechanism that is not the 7/8 architecture): **1 of 4** (`c1-leeyang-krein-limit`); missing: R2, R3, R4.
Lanes with R4 confirmed: none.
Lanes by score 0/1/2/3/4: 170 / 2 / 0 / 0 / 0.

Calibration:

| known result | R1 | R2 | R3 | R4 | score | note |
|---|---|---|---|---|---|---|
| 7/8 zero-free half-plane (Lean-checked) | yes | yes | yes | no | 3 | known architecture; excluded from the headline |
| Weil / Pick / bridge identities | - | - | - | - | not counted | restatements (hold at all heights, also for controls); not counted |
| finite Lee-Yang stage theorem | yes | no | yes | no | 2 | R1 and R3 at stage level only; lost in the limit |

## B. Frontier numbers

- Zero-free abscissa, Lean-checked: 7/8 = 0.875
- Zero-free abscissa, claimed: 0.874886647 (depends on: preprints Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835; manuscript Lemmas 14.3, 15.2, 18.1, 14.11 not checked; not in Lean)
- Lambda, accepted: 0.2 (Platt-Trudgian)
- Lambda, conditional: 0.116060 (depends on: abscissa 0.87488665 (unrefereed) plus Raymond chain H2-H4 (tables not verified))
- Lambda, Raymond claim: 0.107964910079. Status: from VERIFICATION_REPORT.md: Status: **replayed and partially refereed.** Not "verified".

## C. Search coverage

- Graph source: IDEA_GRAPH.json
- Nodes: 1756 (marked closed in graph: 611); tags: 528
- Combination families (tag pairs): 139128; closed: 4110; tried, not closed: 1352; open and untried: 133666
- Outcome records read: 212 (files unparsed: 0)
- Open lemmas decided this campaign: 140

## D. Reliability

- Lanes run: 172 (refereed: 162; unparsed lines: 0)
- Referee hold rate: 91.4%
- PROVED claims broken by referees: 15
- Statements with three-referee confirmation: 2 (about zeros of zeta: 0)
- Claims about zeros not yet counted (fewer than three referees hold): none

## History by round (cumulative)

| round | lanes (round) | lanes (cum) | best score | best lane | missing | hold rate | PROVED broken | 3-referee | lemmas decided |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 18 | 18 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 83% | 3 | 0 | 2 |
| 2 | 8 | 26 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 85% | 3 | 0 | 2 |
| 3 | 8 | 34 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 88% | 4 | 0 | 4 |
| 4 | 8 | 42 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 90% | 4 | 0 | 5 |
| 5 | 8 | 50 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 88% | 5 | 0 | 9 |
| 6 | 8 | 58 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 86% | 7 | 0 | 16 |
| 7 | 8 | 66 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 88% | 7 | 0 | 23 |
| 8 | 8 | 74 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 86% | 8 | 1 | 30 |
| 9 | 8 | 82 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 88% | 9 | 1 | 37 |
| 10 | 8 | 90 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 88% | 10 | 1 | 43 |
| 11 | 8 | 98 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 89% | 10 | 1 | 53 |
| 12 | 8 | 106 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 90% | 10 | 1 | 61 |
| 13 | 8 | 114 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 90% | 10 | 1 | 75 |
| 14 | 8 | 122 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 90% | 11 | 1 | 92 |
| 15 | 18 | 140 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 91% | 11 | 1 | 107 |
| 16 | 8 | 148 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 91% | 11 | 2 | 125 |
| 17 | 8 | 156 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 92% | 11 | 2 | 132 |
| 18 | 8 | 164 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 92% | 14 | 2 | 136 |
| 19 | 8 | 172 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 91% | 15 | 2 | 140 |
