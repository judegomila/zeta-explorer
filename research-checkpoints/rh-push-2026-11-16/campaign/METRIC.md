# Campaign progress metric (version 1, 2026-11-17)

Computed by `scoreboard.py` (pure Python, text/JSON only; run as `scripts/memcap.sh 8 python3 tmp/research-2026-11-16/campaign/scoreboard.py`). Output: `scoreboard.json`, `SCOREBOARD.md`. The metric has four parts. All four are reported. They are not merged into one number.

## The requirements

- R1: the argument uses all primes together, with multiplicativity essential at a named step.
- R2: the conclusion is uniform in height and holds in every window.
- R3: the argument fails for every control (Davenport-Heilbronn, backward heat, sign-twisted primes, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w) for a structural reason.
- R4: it passes from finite stages, or from the region right of 1, to the critical line.

## A. Requirement score per lane (0 to 4)

The score of a lane is the number of R1..R4 that the REFEREE confirms. The author's own flags do not count. A lane whose referee does not hold, or that the referee classes as a restatement (an identity equivalent to its target, or one that holds for a control), scores 0.

Headline: the best score among lanes whose mechanism is not the known 7/8 architecture, with the lane slug and the list of missing requirements. Ties go to the lane with R4 confirmed. Also reported: lanes with R4 confirmed, and the count of lanes at each score.

Calibration (fixed):

| known result | R1 | R2 | R3 | R4 | score |
|---|---|---|---|---|---|
| 7/8 zero-free half-plane | yes | yes | yes | no | 3 (known architecture; excluded from the headline) |
| Weil / Pick / bridge identities | - | all heights, but restatement | - | - | not counted |
| finite Lee-Yang stage theorem | stage level | no | stage level | no | 2 |

A headline of 3 from a new mechanism equals the calibration level of the 7/8 result. A score of 4 is a claimed proof and is treated under part D: it is not a statement about zeros until three referees hold.

## B. Frontier numbers

- Zero-free abscissa: Lean-checked 7/8; claimed 0.874886647 with its dependencies (preprints; manuscript lemmas not checked; not in Lean).
- Lambda: accepted 0.2; conditional 0.116060 (depends on the unrefereed abscissa and Raymond's chain H2-H4); Raymond claim 0.107964910079 with the status read from `push/verify-0107965/VERIFICATION_REPORT.md` (first verdict/status/conclusion line) once that file exists, otherwise "claimed, unverified".

Values change only through `campaign/frontier.json` (same keys as `FRONTIER` in scoreboard.py: `zeroFree.*`, `lambda.*`), edited after a three-referee confirmation. scoreboard.py never changes a frontier number from a lane record.

## C. Search coverage

- Nodes: nodes in `engine/IDEA_GRAPH.json` (fallback `engine/nodes/*.json`).
- Combination family: an unordered pair of distinct tags occurring in the graph.
- A record (an `engine/outcomes/*.json` object or a lane line) touches a family when its tag set contains both tags; the tag set is its own `tags` plus the tags of its `nodes`.
- Closed: at least two refereed closing records of the same obstruction kind touch the family (the stopping rule of STRATEGY.md). A closing record has one of: obstruct, closed, no-go, refuted, dead, restatement, circular in its verdict/status/outcome/kind.
- Tried, not closed: touched by at least one record. Open and untried: touched by none.
- Open lemmas decided this campaign: sum of `lemmasDecided` over lanes.

## D. Reliability

- Lanes run; lanes refereed.
- Referee hold rate: lanes whose main claim the referee holds / lanes refereed.
- PROVED claims broken by referees: sum of `brokenProved`.
- Statements with three-referee confirmation: lanes with `refereeHolds` true and `referees` >= 3; the subset with `aboutZeros` is listed separately. A statement about zeros of zeta counts only in that subset.

## Record formats

`campaign/lanes.jsonl`, one JSON object per finished lane:

```
{"slug": "...", "round": 1, "kind": "explore|deepen|combine|compute|repair",
 "verdict": "PROVED|PARTIAL|OBSTRUCTION|REFUTED|MEASURED|NOT-RUN: one line",
 "refereeHolds": true|false|null, "referees": 1,
 "r1": false, "r2": false, "r3": false, "r4": false,
 "aboutZeros": false, "file": "push/<slug>/RESULT.md",
 "nodes": ["node-id", ...], "tags": ["..."], "obstructionKind": "...",
 "restatement": false, "knownArchitecture": false, "brokenProved": 0, "lemmasDecided": 0}
```

The first ten keys are required; the rest are optional (defaults false / 0 / empty). r1..r4 are the referee's flags; they may also be given as `refereeFlags: {r1:..}`. `refereeHolds: null` means not refereed.

`engine/outcomes/*.json`: object or list of objects; read keys are `nodes` (or `nodeIds`, `inputs`), `tags`, `verdict`/`status`/`outcome`, `obstructionKind` (or `obstruction`, `wall`, `kind`), `refereed` (default true). Unknown keys are ignored; unparsed files are counted and reported.

## What the metric does not say

Coverage counts families, not their difficulty. A high hold rate with a headline of 0 means reliable negative results. No part is a probability of success.
