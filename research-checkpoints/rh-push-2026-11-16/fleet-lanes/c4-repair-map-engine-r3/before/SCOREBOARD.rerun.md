# Campaign scoreboard

Generated 2026-11-18T11:13Z by scoreboard.py. Definitions: METRIC.md. Four parts, reported separately; there is no combined number.

## A. Requirement score (referee-confirmed R1..R4)

Headline (best mechanism that is not the 7/8 architecture): **1 of 4** (`c1-leeyang-krein-limit`); missing: R2, R3, R4.
Lanes with R4 confirmed: none.
Lanes by score 0/1/2/3/4: 33 / 1 / 0 / 0 / 0.

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
- Nodes: 1509 (marked closed in graph: 422); tags: 131
- Combination families (tag pairs): 8515; closed: 394; tried, not closed: 184; open and untried: 7937
- Outcome records read: 44 (files unparsed: 0)
- Open lemmas decided this campaign: 4

## D. Reliability

- Lanes run: 34 (refereed: 34; unparsed lines: 0)
- Referee hold rate: 88.2%
- PROVED claims broken by referees: 4
- Statements with three-referee confirmation: 0 (about zeros of zeta: 0)
- Claims about zeros not yet counted (fewer than three referees hold): none

## History by round (cumulative)

| round | lanes (round) | lanes (cum) | best score | best lane | missing | hold rate | PROVED broken | 3-referee | lemmas decided |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 18 | 18 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 83% | 3 | 0 | 2 |
| 2 | 8 | 26 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 85% | 3 | 0 | 2 |
| 3 | 8 | 34 | 1 | c1-leeyang-krein-limit | R2,R3,R4 | 88% | 4 | 0 | 4 |
