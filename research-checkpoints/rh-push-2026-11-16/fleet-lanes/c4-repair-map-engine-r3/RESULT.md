# c4-repair-map-engine-r3: round-3 map entries, closed-family patterns, generator rules, one referee debt

Date: 2026-11-18. Kind: repair. No new mathematics, no attack, no statement about zeros of zeta. No bound moves.
All runs local through `scripts/memcap.sh 8` (Python standard library; the spot check uses mpmath from
`push/c2-cutoff-hecke-defect/.venv`). The compute server was not used; no units were started.

## 0. Verdict

Partial result of a repair lane: the five assigned items are done, with the limits stated in section 5.

- Map: 16 anchored edits (2 new rows, P43 and S12; 175 rows parsed by the engine, 173 before).
- Engine: the merge had not been run since batch 1. After the run: 37 closed outcome entries (28 before; the ten
  batch-2 lanes were still `proposed`), 29 closed families (16 before), 11 edges on controls WT and FM (0 before).
- Generator: rejected 16,486 of 62,055 before; 17,006 of 63,111 with the new families and merge only; 42,311 of
  63,111 with the new rules. Top 60: majority of members on the flow / Lambda side 14 -> 0; no two members sharing
  an object 16 -> 0; containing a planner-named crossing device 0 -> 6.
- Scoreboard: parts A, B, D unchanged; part C changes are accounted for item by item (section 4.4).
- DH derivation (REFEREE2 section 3 of `c3-repair-map-theorem-a`): holds on this reading; one incomplete
  citation in (D7), no error.

## 1. Plan

Decisive first test: whether the generator ranking changes at all when the closed-family patterns are added. It did
not, for a reason found on the way: eleven of the thirteen new patterns match no generated candidate, and the
ranking noise reported by the round-4 planner comes from the keyword role `crossing`, which every one of the old
top 60 already carried. So the device requirement had to be defined more narrowly than "has the role"
(section 3.3). Order of work: baseline run and copies; map; merge script, families, nodes, edges; generator rules;
reruns and comparison on fixed definitions; scoreboard; the text check.

## 2. Map (`push/OBSTRUCTION_MAP.md`)

Applied by `apply_map_r3.py` (16 exact-anchor edits) and `fix_map_r3.py` (4 wording edits to "Defeated by" cells).
Replay from `before/OBSTRUCTION_MAP.md` reproduces the current file byte for byte (checked with `cmp`).

| Place | Edit |
|---|---|
| Header | second update paragraph for this lane |
| Section 2, row WT | pointer to the fixed-window-count filter and row S12 |
| Section 2, Q2 | fixed-window-count filter entry: m, H, eta independent of T is passed by a height translate above T_0(m, H, eta); rigidity needs a window count of Riemann-Siegel size |
| Row P10 | cross-reference to the twisted fixed-s form in T2 |
| Row P41 | Lemma B closed as a restatement, pointer to P43 |
| Row P43 (new) | Lemma B = Weil explicit formula on a non-compactly supported test (Poisson in k); shifted form and the f(sigma_0) log log T cap; statuses and the two referee debts |
| Row G10 | reflected Euler stages: pole count T theta(X)/pi + O(pi(X)), negative squares at density theta(X)/pi, no stage Hamiltonian, kernel not monotone; what is not closed (stage with the functional equation as input) |
| Row Q10 | short form of the same count, pointing to G10 |
| Row S12 (new) | window functional-equation rigidity with a fixed number of windows; proved translate statement, measured finite-model crossover, referee debt |
| Row T2 | twisted fixed-s form: Laplace transform in log P, single-point Landau criterion with both signs, localisation law, Liouville mirror and its scope (referee E1), the ARGUED survey |
| Section 5 | round-3 paragraph with three filter entries |
| Section 7 | three referee-broken claims of round 3 |

Wording taken from the lane records and referee reports (`engine/outcomes/c3-*.json`, the RESULT.md and REFEREE.md
of `c3-fixedt-growingp-onesided`). One sentence in G10 ("the count goes to infinity along the stages and to zero in
the limit") is attributed to the lane; I did not re-derive it. No map row was added for
`c3-helson-tail-fe-selector` or `c3-rs-matched-halfsum-hb` (not assigned); both are named in section 5 of the map
and have closed families in the engine.

## 3. Engine

### 3.1 `merge_outcomes.py`

- 13 families added (5 for rows P41, P42, G25, Q21, Q22; 8 for the round-3 list, of which Lemma B has two and
  lead 20 one). New optional keys `unless` and `row`.
- Running the merge was itself the larger change: `outcomes.json` had the ten batch-2 lanes as `proposed` and
  `nodes-15.json` had 8 nodes. Now 44 entries: 37 closed, 7 partial. `nodes-15.json`: 24 nodes (13 batch-2
  `newNodes`, 3 device nodes).
- Measured reach of the new families on the 63,111 candidates under the old scoring: P42 family 415 (all through
  the single node `telescoping-kernel-projection-domination`), reflected-stage family 49, the other eleven 0.
- First drafts of five patterns were too wide and were narrowed after reading the samples in
  `after/rejected.stageA.json` (the Euler-at-zeros pattern matched the new Rouche node itself; the one-sided-in-P
  pattern matched a 7/8 lemma; the cutoff and window patterns matched across unrelated nodes).
- Bug fixed: `fam-linear-zero-measure-lmi` had double-escaped word boundaries, so `lmi` and `sdp` never matched.
  With the fix alone it rejected 341 candidates through an unrelated KYP node; a third group restricts it (58).
- `CTRL_PATTERNS`: "height translate" maps to WT; code THIN added.

### 3.2 `build_graph.py`

- Control `ctl-THIN`, status conjectural (the table accepts a status now).
- `EXTRA_EDGES`: WT -> U and NR -> FM (special cases stated in map section 2), THIN -> U, WT -> row Q21, WT -> row
  S12, WT -> its source lane, WT and FM -> the family each closes. Two further edges I had inferred (FM -> rows
  P39, Q19) were removed before the final build: the map does not state them.
- Tag `crossing-device` gives roles `crossing` and `device`.
- Graph: 1,509 -> 1,550 nodes (16 reader records, 2 rows, 1 control, 9 outcome nodes, 13 family nodes);
  live 939 -> 952; edges 8,407 -> 8,652; WT / FM edges 0 -> 11.

### 3.3 `generate.py`

Rules (switch: `--no-r4-rules`; samples: `--dump-rejected`):

| Rule | Type | Definition | Fired |
|---|---|---|---|
| (a) crossing device | reject | no member with the curated tag, and no member with role `crossing` that is outside: measured phenomenon; flow / Lambda side; mean-value object; certificate, formal replay, visualisation | 24,823 (25,105 counted independently of order) |
| (c1) target-blind | reject | every arithmetic member is target-blind algebra (tag, or keyword rule without a target-dependent factor) | 109 |
| (c2) shift-reciprocal | reject | all declared tags are prime-side or size tags and no text names sign of Lambda, pole, symmetry line, functional equation, integers | 373 |
| (b) shared object | -3 / +1 | no pair of members with a declared non-generic tag in common or a `uses` / `special-case-of` / `restates` edge | penalty |
| majority flow / Lambda, majority mean-value | -3 each | more than half of the members, no curated device | penalty |

Breakdown of (a): crossing member on the flow / Lambda side 9,091; no member with the role 7,968; measured
phenomenon 3,705; mean-value object 3,159; certificate, replay or visualisation 900.

Nodes added (all status conjectural, written before their lanes reported):
`rouche-fe-symmetrised-euler-stage`, `hecke-compression-lax-phillips`, `helson-discrepancy-rigidity` (tag
`crossing-device`), and control `ctl-THIN`.

## 4. Verification

### 4.1 Rejected counts

| Run | generated | rejected | scored |
|---|---|---|---|
| before (graph and files as found) | 62,055 | 16,486 | 45,569 |
| after merge, families, nodes; rules off | 63,111 | 17,006 | 46,105 |
| after, rules on | 63,111 | 42,311 | 20,800 |

### 4.2 Top 60 on fixed definitions (`compare_top.py`, output `after/compare_top.txt`)

| Quantity | before | rules off | after |
|---|---|---|---|
| majority of members with a declared flow / Lambda tag | 14 | 12 | 0 |
| generator theme "flow" | 12 | 12 | 6 |
| majority mean-value objects | 12 | 12 | 1 |
| no two members share an object | 16 | 17 | 0 |
| contains a device under rule (a) | 23 | 24 | 60 |
| contains a planner-named device (curated tag) | 0 | 3 | 6 |
| matches a closed family | 2 | 0 | 0 |
| shares two nodes with a closed lane | 0 | 0 | 0 |

The planner's count "27 of 60 flow or Lambda-bridge" was a reading; the fixed definition above gives 14 for the
same list. Answer to "how many of the new top 60 touch R4 devices": 60 under rule (a), of which 6 through a device
named by a planner (ranks 8, 10, 11, 14, 29, 33; two per node by the diversity limit). The other 54 rest on the
keyword role.

### 4.3 Controls for the rules

- `--no-r4-rules` reproduces the old scoring on the new graph (17,006 rejected).
- No top-60 candidate matches a closed family or contains two nodes of a closed lane, before or after.
- New device nodes are not rejected by any family (each appears twice in the top 60).

### 4.4 Scoreboard (`campaign/scoreboard.py`)

Parts A (headline 1 of 4), B, D and the history table: identical to the rerun made before the changes, except the
timestamp. Part C:

| Field | before | after | Reason |
|---|---|---|---|
| nodes | 1,509 | 1,550 | 16 + 2 + 1 + 9 + 13 as in 3.2 |
| marked closed | 422 | 446 | 2 rows, 9 outcome nodes, 13 family nodes |
| tags | 131 | 166 | 29 tags of batch-2 records now on outcome nodes; 6 from the new nodes |
| tag-pair families | 8,515 | 13,695 | C(131,2) and C(166,2): the count is all pairs of tags |
| closed | 394 | 394 | read from `outcomes/*.json`, unchanged |
| tried, not closed | 184 | 437 | record tag pairs that were outside the old tag list |
| open, untried | 7,937 | 12,864 | remainder |

The rise in "families" and "open and untried" is an effect of the tag vocabulary, not of search coverage. The
figure before this lane in SCOREBOARD.md (1,502 nodes) was already stale against the planner's rebuild (1,509).

## 5. Referee debt: second reading of the DH derivation

`push/c3-repair-map-theorem-a/REFEREE2.md` section 3, steps (D1)-(D7), read line by line; arithmetic spot checks in
`dh_reading_check.py` (log beside it).

- (D1) The form of X_c follows from the duplication and reflection formulas (checked by hand and at one point,
  difference 1e-31); eps(chi) c_1 = c_2 and eps(conj chi) = conj eps(chi) hold (1e-16); the functional equation of
  f holds numerically at the stated point to float precision of kappa.
- (D3), (D4) Exponents and the constant -i 5^(-1/2) are right; X_{c,+} = -i chi_+; the real-k formula of step (3)
  is stated for every real k > 0 in Section 1, so its use at k/5 is legitimate.
- (D5) Gauss-sum expansion of e(a/5) on (a, 5) = 1 holds (1e-16); f_n = 0 for 5 | n, so the expansion covers all
  terms with (m, 5) = 1; the only pole in Re w >= 1/2 + eps is w = 1, residue (1/5)[...] as stated.
- (D6) The recombination and the passage from eta to delta are right.
- (D7) The constant 4 - 2 sqrt 2 sqrt(1 + kappa^2) = 1.0597 is right. The cited input F3 is the real-part Harnack
  bound, which does not control Re(c_1 z_1 + c_2 z_2) for complex c_1, c_2; the disc form (centre 3 alpha, radius
  2 sqrt 2 alpha at rho = 2^(-1/2)) is what gives the constant, and the bound is attained on the pair of discs.
  `REFEREE.md` section 2 of that lane already uses the disc form.

Result: holds; one citation to tighten; recorded as an addendum at the end of that REFEREE2.md. I found that the
formula already has two derivations (REFEREE2 section 3 and REFEREE.md section 2); this is a further reading, not
a third derivation.

## 6. Controls

Not applicable as an attack. For the generator rules the relevant controls are the ones the rules encode: HEAT and
verified height (flow / Lambda-side members are not devices), MV-CAP (mean-value members are not devices), RZ_b
(rule c2), target-blind algebra (rule c1), WT and FM (new edges and families), THIN (conjectural).

## 7. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 | false | repair lane; no mechanism |
| R2 | false | repair lane |
| R3 | false | repair lane; control edges and filters only |
| R4 | false | three device nodes were recorded as conjectural; none is established |

## 8. Three weakest steps

1. Rule (a) rests on the keyword role `crossing`. Removing four closed classes leaves 55 nodes whose role is
   still a keyword match; 54 of the top 60 depend on it. Examples that remain and are doubtful as devices:
   `map-pos-19`, `overflow-onset-arcsinh1`, `freezing-inertia-tool`. A curated device list for existing nodes
   would be the real repair; I did not make one because it needs judgement on each node.
2. Eleven of thirteen new family patterns match nothing today, so their correctness on future nodes is untested;
   the two that match were checked on samples only. `fam-projection-domination-gonek` closes every combination
   containing one node, which is right only if row P42 covers every prime-side partner, as its text says.
3. The three device nodes and `ctl-THIN` describe lanes that had not reported. If one of those lanes closes its
   device and nobody removes the tag, the generator will rank a closed device at the top. Rules (c1) and (c2)
   have small reach and do not decide covariance.

Also open: the batch-2 "graph repairs to apply at the next rebuild" in ENGINE_LOG are still not applied;
Selberg-named nodes remain in 3 of the top 60; map rows for the Helson tail lane and the half-sum lane were not
written.

## 9. Files changed

Outside this directory:

| File | Reason |
|---|---|
| `push/OBSTRUCTION_MAP.md` | round-3 entries (section 2) |
| `push/c3-repair-map-theorem-a/REFEREE2.md` | addendum: result of the second reading |
| `engine/merge_outcomes.py` | 13 families, `unless` / `row` keys, LMI pattern fix, WT and THIN patterns, 3 device nodes, target-blind tag |
| `engine/build_graph.py` | control THIN with status, `EXTRA_EDGES`, role `device`, family statement text |
| `engine/generate.py` | rules (a), (b), (c1), (c2), majority penalties, `--no-r4-rules`, `--dump-rejected`, `unless`, output fields |
| `engine/outcomes.json` | rebuilt by the merge (batch-2 lanes no longer `proposed`) |
| `engine/nodes/nodes-15.json` | rebuilt by the merge (8 -> 24 nodes) |
| `engine/closed_families.json` | rebuilt by the merge (16 -> 29 families) |
| `engine/IDEA_GRAPH.json` | rebuilt |
| `engine/CANDIDATES.json` | rebuilt (`--top 60`, rules on) |
| `engine/ENGINE_LOG.md` | section "Campaign round 4 repair" |
| `engine/README.md` | new options and rules |
| `engine/scratch/*.before-c4.*` | previous `merge_outcomes.py`, `generate.py`, `build_graph.py`, `closed_families.json`, `outcomes.json`, `nodes-15.json` |
| `campaign/scoreboard.json`, `campaign/SCOREBOARD.md` | rerun of `scoreboard.py` (part C only) |

In this directory: `apply_map_r3.py`, `fix_map_r3.py` (map edits, replayable), `compare_top.py` (top-60
comparison), `dh_reading_check.py` and `.log`, `before/` (copies of every file before change, baseline run
outputs), `after/` (run outputs, rejection samples, comparison, scoreboard copy).
