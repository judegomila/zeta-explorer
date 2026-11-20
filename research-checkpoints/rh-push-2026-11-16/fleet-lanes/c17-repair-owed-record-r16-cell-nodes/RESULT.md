# c17-repair-owed-record-r16-cell-nodes: RESULT

Campaign round 17, kind: repair (lane B, record). No attack. Nothing in this file or in any edit of this lane is a
statement about zeros of zeta. The headline cannot move and does not: 1 of 4 (`c1-leeyang-krein-limit`; missing R2,
R3, R4). Labels used for mathematics quoted from other lanes are those of their referee files (PROVED, PROVED-rel X,
MEASURED, ARGUED, CLASSICAL, OPEN); this lane proves nothing and measures nothing except engine counts.

Paths are relative to `tmp/research-2026-11-16/`. Lane directory: `push/c17-repair-owed-record-r16-cell-nodes/`
(called `L/` below).

## 0. Verdict

**Partial result (record lane).** Items 1 to 6 of the assignment are done. One part of item 2 could not be done in
place: nine of the eleven corrected sentences stand in lane files under `push/`, outside the edit scope of this lane;
they are entered in the map (section 7, rows S12b, Q30, G42) and in a register (`campaign/CORRECTIONS_R16.md`), and
the lane files are unchanged. No independent referee has read this lane.

- Node type `cell`: the eleven `silent-*` nodes are read classes in `engine/curated/devices.json` (key `cells`), no
  longer device types. `generate.py` gives a cell no device weight and no waived penalty. Top 60: with an open
  device 57 -> 0; with a floored device only 3 -> 60; with a closed device 0 -> 0.
- Map: 205 -> 208 labelled rows (D10, P56, G42), rows G41, Q30, P45, S12b edited, three note edits in section 2,
  seven rows in section 7.
- STRATEGY: section 0b (two sentences), section 3.1 (items 42 to 47, five notes, tried list), section 4.0 (POS-FE
  decided; Proposition 5 decided; state of the cells), change log.
- Disposition of the fired clause S2 recorded in four places.
- All eight round-16 lanes already had an outcome record; none was written; `merge_outcomes.py` was not run.
- Engine and scoreboard rerun three times; every changed number has its cause in `engine/ENGINE_LOG.md` (entry of
  2026-11-20) and in section 5 below.
- Literature rescan: no preprint dated November 2026 found; four identifiers not on file listed in section 6.

## 1. Plan

1. Baseline: rerun `engine/build_graph.py`, `engine/generate.py --top 60`, `campaign/scoreboard.py` through
   `scripts/memcap.sh 8` before any edit; keep logs and copies (`L/baseline/`, `L/before/`).
2. Cell node type, alone, then rerun (stage 1), so that its effect on the top 60 is separated from the map rows.
3. Map rows, STRATEGY entries, corrected sentences, disposition.
4. Check outcome records; final rerun; attribution of every changed number.
5. Literature rescan with generic terms.

No server use: every run is a text/JSON script below 1 GB and under a minute. No large data module was imported.

## 2. Work

### 2.1 Baseline (before any edit)

| file | state |
|---|---|
| `engine/IDEA_GRAPH.json` | rerun byte-identical to the file on file (1,724 nodes, 974 live, 241 rows, 9,118 edges) |
| `engine/CANDIDATES.json` | rerun byte-identical (52,367 generated, 19,088 scored; top 60: 57 with an open device, 3 floored only, 0 closed) |
| `campaign/scoreboard.json` | changed by the rerun in part C only: the file on file was older than the graph (1,718 nodes, 462 tags, 106,491 families); rerun: 1,724 nodes, 585 marked closed, 485 tags, 117,370 families, 3,797 closed, 861 tried, 112,712 untried. Headline, lanes (148), hold rate (91.3%), lemmas (125) unchanged |

Logs: `L/baseline/build_graph.log`, `generate.log`, `scoreboard.log`; sha1 before and after in `L/baseline/sha.*`.

### 2.2 Item 1: node type `cell`

Decision applied (ROUND_LOG, "Round 17 allocation"): the eleven `silent-*` nodes are read classes, not crossing
devices.

- `engine/curated/mk_devices.py` -> `devices.json`: list `CELLS`, written as key `cells` (type `cell`), with
  `cellStates`. States: `silent-cell-u2-pos` closed (identification, Theorem P); `silent-cell-u6g` tried-not-closed;
  the other nine `cell`. Device types 53 closed / 1 floored / 11 open -> 53 / 1 / 0.
- `engine/build_graph.py`: a cell node gets the field `cell` and the role `cell`; it has no field `device` and no
  role `device`.
- `engine/generate.py`, rule `cell`: a cell node is scored as any tagged node. It is not in the device pool; the
  part `crossing` is 0 for it; it does not satisfy the R4-device rule; the four exemptions that an open device had
  (closed family matched through the device text, the 3-point reuse penalty, the flow-side and mean-value majority
  penalties, the per-device cap of 12) do not apply. A candidate with a closed cell node is rejected. Cell members
  are listed under `cells` with a note. Weights unchanged.
- Previous files: `engine/scratch/generate.pre-c17-repair.py`, `build_graph.pre-c17-repair.py`,
  `mk_devices.pre-c17-repair.py`, `devices.pre-c17-repair.json`. Edit scripts: `L/edit_mk_devices.py`,
  `L/edit_mk_devices2.py`, `L/edit_engine.py`.

Check on the full scored list after the change (`L/after/all_scored_slim.json`, 8,432 candidates): 0 have a
`crossing` part above 0; 0 list a `silent-*` node as a device; 0 contain the closed cell; 23 have a cell member
(best score 8.25).

Counts, top 60:

| quantity | before | after |
|---|---|---|
| topWithOpenDevice | 57 | 0 |
| floored (topWithFlooredDeviceOnly) | 3 | 60 |
| closed (topWithClosedDevice) | 0 | 0 |
| with a `silent-*` member | 57 (as open devices) | 2 (as tagged open-lemma members: rank 13, U6 (a), 8.25; rank 44, U6 (e), 3.0) |
| keys in common | - | 1 (former rank 50 is rank 9) |
| generated / scored / rejected | 52,367 / 19,088 / 33,279 | 38,082 / 8,432 / 29,650 |
| device pool (nodes) | 17 | 6 |
| rejected: no open or floored device | 13,534 | 14,549 |
| rejected: contains a closed cell (U2-POS) | - | 49 |
| rank 1 | `silent-u8-...` x `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift`, 12.03 | `capture-ratio-psd-slope` x `sympow-conductor-normalised-shift` x `tro6-natural`, 10.25 |

After the change every listed candidate stands on a node of the one floored device type
`coherent-set-large-sieve` (`tro6-natural`, `qrh-seven-eighths`, `seven-eighths-abscissa-formula`, `map-open-2`,
`map-open-4`; 12 entries each, which is the per-device cap). The list is again a list of part-B work; it contains
no lead for R4.

Comparison with the last list made before the silent cells were entered
(`push/c16-repair-owed-record-r15/after1/CANDIDATES.json`): 45 of 60 keys in common, 39 with the same score, 6
differing by 0.01 in the cohesion part. 15 left: 4 are no longer enumerated, 11 have the same score and are
displaced by the selection caps. 15 entered, 2 with a cell member. The list is therefore close to, and not equal
to, the pre-cell list; the eleven nodes are still live tagged nodes and shift tag weights and partner lists
(`L/top60_vs_presilent.json`).

The entry-by-entry table is section 7 (also `L/top60_before_after.md`, `.json`).

### 2.3 Item 2: owed list of round 16

Map (`push/OBSTRUCTION_MAP.md`; script `L/apply_map.py`; previous file `L/before/OBSTRUCTION_MAP.md`):

| owed item | entered as | label carried |
|---|---|---|
| U6 (g) device row | row D10 (section 3.9): rank-2 Gram positivity of truncated SL_3 Eisenstein data read off the zero set; state tried, not closed | PROVED-rel the recalled inner product formula (Lemma R); PROVED (Lemma S); MEASURED (passing controls); ARGUED (T-NR as the infinite case) |
| restricted BLS-right row | section 2, new note "BLS in rank 2": BLS-left fails; BLS-sym passes; BLS-right passes for non-real conjugate pairs or real zeros of even total multiplicity, and fails for an odd number of real zeros other than a single zero at 1 | PROVED-rel (BLS-left); MEASURED (the rest) |
| corrected BLS row | section 2, BLS note: "lacks f(z) = f(1 - z)" holds only for zero sets not closed under a -> 1 - conj a (Lemma S) | PROVED (elementary) |
| U2-POS identification row | row P56: Theorem P; cell U2-POS is a cell of U3 | PROVED (three referee files); CLASSICAL in content; MEASURED (screen) |
| Q30 / P45 addendum | both rows: Proposition 5 is not a two-sided correspondence; window form; cluster bound | PROVED (window form); PROVED given Turan, recalled; MEASURED (attainment; all-heights form) |
| G41 update | canonical tier of DN: closed as MEASURED, outcome "none"; the 22,508 float64 T-train nodes not ball-confirmed; FE tier not closed | MEASURED |
| family 31 note | row G42 (the amplified edge argument had no map row): "Family 31 item T < N: measured obstruction on T <= 4, N <= 128" | PROVED (T >= N; Gram formula); MEASURED (T < N on the range); OPEN (all N) |
| referee-broken claims | section 7: six rows for round-16 lanes 1 to 6, one row for the second referee of the round-15 lanes | as in the referee files |
| second referee of ZQ | section 2 note on ZQ | holds |

Row count line and the update paragraph ("thirteenth") are entered. 205 -> 208 labelled rows (P 56, G 42, D 10).
Table integrity checked by script: the seven edited or new table rows have six cells, the section 7 rows three.

STRATEGY (`campaign/STRATEGY.md`; script `L/apply_strategy.py`; previous file `L/before/STRATEGY.md`; no version
change, no rule, weight or allocation changed):

- Section 4.0: a record paragraph for POS-FE (decided, true as an identification; map row P56; the registered
  outcome is "identification, score 0"; the three-lane rule is not triggered; no longer the least blocked item);
  the decision of Proposition 5 under C(theta); the state of the cells after round 16. The version-5 text below
  these entries is kept as written.
- Section 3.1: items 42 (POS-FE / U2-POS), 43 (Proposition 5 / C(theta)), 44 (DN canonical tier, MEASURED), 45
  (U6 (g) at rank 2, tried not closed), 46 (the 71 geometric nodes under question Q-A), 47 (amplifiers with
  T < N, measured on the range, with the disposition); notes on items 31, 34, 37, 39, 41; tried list updated.
- Section 0b: the two sentences (five kinds of separation in place of four; the ZQ defect bound in place of
  "O(eta^2 + d^2)"), plus the scope line for functionals of on-line ordinates.
- Section 5: change-log entry.

The eleven corrected sentences (`push/c16-referee-r15-j1prime-u8-screening/RESULT.md` section 3):

| # | place | done |
|---|---|---|
| 1, 2 | `campaign/STRATEGY.md` section 0b | corrected in place |
| 3 | c15 translate lane | not edited (outside scope); map row S12b carries the form after E1 of the referee of the referee lane; register |
| 4 | c15 edge lane | not edited; map row G42; register |
| 5, 6 | c15 U7 lane | not edited; map row Q30 (already corrected by the first referee; the 6-of-6 rerun added); register |
| 7, 8 | c15 Klein lane | not edited; map section 7; register |
| 9 | c15 DN lane | not edited; map row G41 already had 360 + 392 and 360 + 2,414; register |
| 10 | `s1-prime-torus-orbit` | not edited; map section 7; register |
| 11 | `s1-zero-statistics-gram` | not edited; STRATEGY 0b scope line; map section 7; register |

Register: `campaign/CORRECTIONS_R16.md` (file, sentence as written, sentence to use, where the record carries it).
Sentence 3 is entered in its form after E1 (`REFEREE.md` of that lane says the first replacement is not exact).

### 2.4 Item 3: disposition of the fired clause S2

Recorded text: "set aside; the clause had no control comparison; EIS-w shares the excess; no follow-up lane".
Places: map row G42 and its section 7 row; STRATEGY section 3.1 item 47 and the tried list; `engine/curated/
devices.json`, pending entry for the amplifier item (state `tried-not-closed`); `campaign/CORRECTIONS_R16.md`.
Family 31 item "T < N" stays "measured obstruction on T <= 4, N <= 128", not a proved closure.

### 2.5 Item 4: outcome records

All eight round-16 lanes have a file in `engine/outcomes/` and an entry in `engine/outcomes.json`, each with
result and referee files that exist. Each lacks the optional field `secondReferee`, which is correct (no second
referee yet). No record was written or changed by this lane. `merge_outcomes.py` was not run. Ten files
`engine/outcomes/s2-*.json` appeared at 16:42 local, written by the screening arm, not by this lane.

### 2.6 Item 5: reruns and changed numbers

See section 5 and `engine/ENGINE_LOG.md`, entry "2026-11-20, campaign round 17, repair lane B".

## 3. Controls

A record lane has no device, so the control battery is not run against an argument. Controls of the edit itself:

- The cell change was run alone (stage 1) before the map rows (final). Between stage 1 and final the top 60 is
  identical in keys, order and scores; only `rowsChecked` lists change (35 entries; P45 enters 18, P56 enters 15,
  Q30 enters 3). So the whole change of the list is caused by the cell rule.
- Invariant checks on all 8,432 scored candidates (section 2.2).
- The defeated-by cell of row P56 names no control code, so the graph has no control-defeats edge into an
  identification row; a first wording produced an edge `row-P56 -> target-rh` ("restates") through the word
  "target" and was reworded.
- Scoreboard attribution by a second run of `scoreboard.py` on a copy holding the lanes file and the outcome
  directory as they stood before this lane (`L/attrib/`, `L/scoreboard_attribution.json`).
- Each new or edited map sentence was written from the lane's REFEREE.md, not from its claim line; the restricted
  forms were used where a referee restricted a claim (BLS-right; "incumbent" for the MILP screen; window form of
  Theorem B; 22,508 nodes not ball-confirmed).

## 4. Requirement flags

- R1 false. No argument is made; nothing uses multiplicativity.
- R2 false. No conclusion at any height.
- R3 false. No device; no control fails anything.
- R4 false. No statement on or towards the critical line.

Evidence: the lane edits records and engine code only. Score 0.

## 5. Changed numbers and causes

| quantity | on file | baseline rerun | final | cause |
|---|---|---|---|---|
| device types closed / floored / open | 53 / 1 / 11 | same | 53 / 1 / 0 | cells |
| cells (cell / tried-not-closed / closed) | none | none | 9 / 1 / 1 | new node type |
| pending proposals | 7 | 7 | 6 | Proposition 5 and DN canonical tier out; rank-2 closure in |
| map labelled rows | 205 | 205 | 208 | D10, P56, G42 |
| rows parsed by the builder | 241 | 241 | 244 | same |
| graph nodes (live) | 1,724 (974) | same | 1,727 (974) | three row nodes |
| edges | 9,118 | 9,118 | 9,127 | composes-with 7,559 -> 7,563 (61 added, 57 removed: role `device` removed from eleven nodes); control-defeats 871 -> 876 (four into row-D10, one into row-G42) |
| generated / scored / rejected | 52,367 / 19,088 / 33,279 | same | 38,082 / 8,432 / 29,650 | device pool 17 -> 6 |
| top 60 open / floored only / closed | 57 / 3 / 0 | same | 0 / 60 / 0 | cells |
| scoreboard nodes / marked closed | 1,718 / 579 | 1,724 / 585 | 1,727 / 588 | baseline: stale file; final: three row nodes |
| scoreboard tags / families / closed / tried / untried | 462 / 106,491 / 3,648 / 830 / 102,013 | 485 / 117,370 / 3,797 / 861 / 112,712 | 485 / 117,370 / 3,797 / 988 / 112,585 | baseline: stale file; final: outcome files `s2-*` of the screening arm (not this lane) |
| outcome records read | 158 | 158 | 168 | `s2-*` files (not this lane) |
| lanes run / score-0 lanes / lemmas decided | 148 / 146 / 125 | same | 149 / 147 / 130 before this lane's own line | line of `c17-u6e-...` in `lanes.jsonl` (not this lane) |
| headline; hold rate; PROVED broken; three-referee statements | 1 of 4; 91.3%; 11; 2 (about zeros 0) | same | same | - |

After this lane's own line is appended to `campaign/lanes.jsonl` the scoreboard is rerun once more; the numbers of
that run are in `L/after/scoreboard.final.log` and section 8.

## 6. Literature rescan (generic search terms; titles and identifiers only; nothing is claimed or checked)

Search terms: zero-free region Riemann zeta 2026; zero-free half-plane 7/8; quasi-Riemann hypothesis abscissa;
arXiv 2611. Web search, 2026-11-19/20. No preprint with an arXiv identifier 2611.* on zero-free regions or the 7/8
abscissa was returned.

On file already (BRIEF, scoreboard part B):
- arXiv:2610.12234, "Improved zero-free half-planes for the quasi-Riemann hypothesis".
- arXiv:2610.15291, "Amplified moments and a refinement of the quasi-Riemann hypothesis".
- arXiv:2610.26835 (title not returned by the search; identifier as in the BRIEF).

Returned by the search and not found in the campaign files (text search for the identifier in `campaign/`, the
map, the BRIEF and the lane RESULT files):
- arXiv:2603.21490, Bellotti, Trudgian, Yang: an explicit zero-free region for the zeta function of classical
  form (title not returned by the search; identifier and authors only).
- arXiv:2610.12803, "A conditional bound Lambda <= 0.13963 for the de Bruijn-Newman constant".
- arXiv:2610.17090, "What the Machine Invented: Mining New Mathematical Instruments from OpenAI's October 2026
  Release of AI-Generated Mathematics".
- arXiv:2605.24363, "The theta = infinity Conjecture and the Riemann Hypothesis for Automorphic L-functions".

None was opened. No content, status or constant of any of them is asserted here. Search-engine summaries were not
used as statements.

## 7. Top 60 before and after, entry by entry

Before: baseline rerun (`L/baseline/CANDIDATES.base.json`, identical to the file on file). After: final run (`L/after/CANDIDATES.json`). Each cell: score, move, members, then in brackets the device member with its kind and, after the change, any cell member with its state. "now at rank": where the before-entry stands in the new list; "was at rank": where the after-entry stood in the old list. Counts: topWithOpenDevice 57 -> 0; floored (floored device only) 3 -> 60; closed 0 -> 0.

| rank | before: score, move, members (device / cell) | now at rank | after: score, move, members (device kind) | was at rank |
|---|---|---|---|---|
| 1 | 12.03 M3 silent-u8-kernel-conditions-beyond-searched-range x capture-ratio-psd-slope x sympow-conductor-normalised-shift [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 10.25 M1 capture-ratio-psd-slope x sympow-conductor-normalised-shift x tro6-natural [tro6-natural:floored] | new |
| 2 | 11.50 M3 silent-u6d-rank2-compact-squares-without-hecke-rule x gauss-plancherel-alias-lemma x sympow-conductor-normalised-shift [silent-u6d-rank2-compact-squares-without-hecke-rule:open] | not listed | 9.53 M1 autocorrelation-moment-ladder x sympow-conductor-normalised-shift x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 3 | 11.00 M1 sun-prop63-plus4-offset x mem-sextic-theta-squarefree x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 9.25 M1 sun-prop63-plus4-offset x katz-sarnak-family-checks x tro6-natural [tro6-natural:floored] | new |
| 4 | 10.75 M1 capture-ratio-psd-slope x tro6-natural x silent-u6a-rank2-nonborel-metaplectic-eigenobject [tro6-natural:floored, silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 9.00 M1 theta-density-positivity-p-pos x alias-width-law-octave-weight x tro6-natural [tro6-natural:floored] | new |
| 5 | 10.75 M3 ramanujan-cube-satake-point x cmv-truncation-from-taylor-data x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 8.75 M1 gl2-weil-symbol x finite-support-euler-detector x tro6-natural [tro6-natural:floored] | new |
| 6 | 10.70 M1 lean-weil-small-support x mem-atlas-closing-line x silent-u8-kernel-conditions-beyond-searched-range [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 8.75 M1 sun-prop63-plus4-offset x mem-sextic-theta-squarefree x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 7 | 10.50 M1 sun-prop63-plus4-offset x tro6-natural x silent-u6f-isogenous-points-nonlinear-functionals [tro6-natural:floored, silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 8.75 M1 autocorrelation-moment-ladder x route-m-first-moment-kappa x tro6-natural [tro6-natural:floored] | new |
| 8 | 10.50 M3 silent-u8-kernel-conditions-beyond-searched-range x zv-theta-kernel-phi x staged-strip-triangular-inequality [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 8.75 M3 tro6-natural x gauss-plancherel-alias-lemma x mem-qrh-7-8 [tro6-natural:floored] | new |
| 9 | 10.25 M3 silent-u6f-isogenous-points-nonlinear-functionals x sextic-theta-mean-square x route-m-first-moment-kappa [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 8.50 M4 theta-density-positivity x staged-strip-triangular-inequality x tro6-natural [tro6-natural:floored] | 50 |
| 10 | 10.25 M3 silent-u3-identification-relaxation x finite-support-euler-detector x alias-sign-determinacy [silent-u3-identification-relaxation:open] | not listed | 8.48 M1 curvature-charge-d x route-m-vasyunin-gram x tro6-natural [tro6-natural:floored] | new |
| 11 | 10.25 M3 silent-u6f-isogenous-points-nonlinear-functionals x zv-gaussian-damped-extension x ramanujan-cube-satake-point [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 8.25 M1 capture-ratio-psd-slope x prime-delay-domination-15-4 x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 12 | 10.00 M1 zv-annulus-boundary-conditions x star-min-pointwise-prime-bound x silent-u6f-isogenous-points-nonlinear-functionals [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 8.25 M1 lean-weil-small-support x star-min-pointwise-prime-bound x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 13 | 10.00 M1 zv-annulus-dtn-operator x star-min-pointwise-prime-bound x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 8.25 M3 silent-u6a-rank2-nonborel-metaplectic-eigenobject x qrh-seven-eighths x ramanujan-cube-satake-point [qrh-seven-eighths:floored; cell silent-u6a-rank2-nonborel-metaplectic-eigenobject:cell] | new |
| 14 | 10.00 M1 theta-density-positivity-p-pos x residue-averaged-sign-image x silent-u8-kernel-conditions-beyond-searched-range [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 8.00 M1 zv-infinity-end-coordinate x ramanujan-cube-satake-point x tro6-natural [tro6-natural:floored] | new |
| 15 | 10.00 M1 theta-modular-ode-system x selberg-geodesic-ground-truth x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 7.99 M1 zv-boundary-kernel-pa x pole-term-schur-complement x tro6-natural [tro6-natural:floored] | new |
| 16 | 10.00 M1 gl2-weil-symbol x gauss-plancherel-alias-lemma x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 7.75 M1 subleading-k-closed-form x mem-chi4-signed-ladder x tro6-natural [tro6-natural:floored] | new |
| 17 | 10.00 M1 mesoscopic-density-floor-cotangent x h-desc-mirror-palm-surplus x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 7.75 M3 sun-catalan-preprint-verdict x mem-qrh-7-8 x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 18 | 10.00 M1 zv-boundary-kernel-pa x zv-divisor-cosine-euler-product x silent-u8-kernel-conditions-beyond-searched-range [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 7.75 M4 start-substitution-lemma x tro6-natural x euler-detection-depth-law [tro6-natural:floored] | new |
| 19 | 10.00 M4 tilt-det-majorant x prime-delay-domination-15-4 x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 7.75 M4 zv-signed-shear-w x staged-strip-triangular-inequality x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 20 | 9.75 M1 subleading-k-closed-form x mem-sextic-theta-squarefree x silent-u6e-bost-connes-states-outside-d8 [silent-u6e-bost-connes-states-outside-d8:open] | not listed | 7.66 M2 phi-truncation-leftmost-zero x qrh-seven-eighths x ctl-DH [qrh-seven-eighths:floored] | new |
| 21 | 9.75 M1 sep-opt-lattice-extremal x tro6-natural x silent-u6e-bost-connes-states-outside-d8 [tro6-natural:floored, silent-u6e-bost-connes-states-outside-d8:open] | not listed | 7.25 M1 zv-boundary-kernel-pa x restricted-mobius-delay-lift x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 22 | 9.75 M1 autocorrelation-moment-ladder x cotangent-second-moment-upper-lemma x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 7.25 M2 sextic-theta-numerics x qrh-seven-eighths x ctl-DH [qrh-seven-eighths:floored] | new |
| 23 | 9.75 M1 subleading-k-closed-form x route-m-vasyunin-gram x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 6.75 M1 multi-rung-weil-symbol x finite-support-euler-detector x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 24 | 9.75 M1 sep-opt-lattice-extremal x residue-averaged-sign-image x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 6.55 M1 virtual-rungs-positive-extension x selberg-geodesic-ground-truth x qrh-seven-eighths [qrh-seven-eighths:floored] | new |
| 25 | 9.50 M1 coal-n-laguerre-law x selberg-zeta-freeze-sandbox x silent-u6c-gl3-cover-global-whittaker-constants [silent-u6c-gl3-cover-global-whittaker-constants:open] | not listed | 5.75 M1 lean-weil-small-support x v7-floor-theorem-c x map-open-2 [map-open-2:floored] | new |
| 26 | 9.50 M1 zv-shear-reflection-parity x prime-delay-domination-15-4 x silent-u6f-isogenous-points-nonlinear-functionals [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 5.25 M1 subleading-k-closed-form x route-m-vasyunin-gram x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 27 | 9.48 M4 zv-signed-shear-w x pascal-carry-ballot x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 5.09 M1 gl2-weil-symbol x sextic-theta-numerics x map-open-2 [map-open-2:floored] | new |
| 28 | 9.48 M4 isolation-ratio-rate-identity x dyadic-near-frequency-target x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 5.00 M1 multi-rung-weil-symbol x prime-delay-domination x map-open-2 [map-open-2:floored] | new |
| 29 | 9.25 M1 m23-poisson-reproducing-identity x katz-sarnak-family-checks x silent-u6e-bost-connes-states-outside-d8 [silent-u6e-bost-connes-states-outside-d8:open] | not listed | 4.81 M1 zv-infinity-end-coordinate x star-min-pointwise-prime-bound x map-open-4 [map-open-4:floored] | new |
| 30 | 9.25 M1 mesoscopic-density-floor-cotangent x katz-sarnak-family-checks x silent-u6f-isogenous-points-nonlinear-functionals [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 4.75 M4 dbn-native-triangle-binding x route-m-first-moment-kappa x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 31 | 9.25 M1 bridge-winding-equals-NT x two-tents-joint-zero-completeness x silent-u6f-isogenous-points-nonlinear-functionals [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 4.50 M3 map-open-2 x frobenius-gcd-factorisation x lane-audit-h-desc [map-open-2:floored] | new |
| 32 | 9.25 M1 sawtooth-s-of-t-lemma x prime-tent-rh-equivalence x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 4.50 M3 near-muntz-threshold-cones x arch-native-prime-jordan-product x map-open-4 [map-open-4:floored] | new |
| 33 | 9.25 M1 heat-family-h-tau x qrh-seven-eighths x silent-u8-kernel-conditions-beyond-searched-range [qrh-seven-eighths:floored, silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 4.14 M4 theta-density-positivity x katz-sarnak-family-checks x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 34 | 9.25 M3 silent-u6g-scattering-exact-normalisation-affine-kernel x zv-schur-frozen-block-inertia x arch-native-prime-jordan-product [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 3.86 M1 bbm-growth-class-implication x selberg-zeta-freeze-sandbox x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 35 | 9.25 M3 silent-u3-identification-relaxation x alias-energy-in-sieve-algebra x vonmangoldt-weighted-sign-image [silent-u3-identification-relaxation:open] | not listed | 3.75 M4 zv-signed-shear-w x ns-rigid-loophole-dirichlet-coefficients x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 36 | 9.00 M1 zv-jacobi-uniformization-involutions x bohr-torus-scan-certification x silent-u6f-isogenous-points-nonlinear-functionals [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 3.60 M1 ingham-offlattice-riesz-floor x mv-cap-function-side-gap x map-open-2 [map-open-2:floored] | new |
| 37 | 9.00 M1 mirror-pair-lemma x h-desc-mirror-palm-surplus x silent-u8-kernel-conditions-beyond-searched-range [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 3.50 M4 exact-witness-quadratic-cosine x connes-twin-ladder-crosswalk x map-open-4 [map-open-4:floored] | new |
| 38 | 9.00 M3 silent-u4-joint-functionals-not-scaling-invariant x map-pos-20 x mem-atlas-closing-line [silent-u4-joint-functionals-not-scaling-invariant:open] | not listed | 3.25 M2 pr14-boundary-certificate x seven-eighths-abscissa-formula x ctl-DH [seven-eighths-abscissa-formula:floored] | new |
| 39 | 8.94 M1 zv-annulus-boundary-conditions x selberg-geodesic-ground-truth x silent-u6e-bost-connes-states-outside-d8 [silent-u6e-bost-connes-states-outside-d8:open] | not listed | 3.25 M3 map-open-2 x rm-kappa-arith-exact x rm-kappa-total-measured [map-open-2:floored] | new |
| 40 | 8.80 M4 theta-density-positivity x ns-rigid-loophole-dirichlet-coefficients x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 3.22 M4 tilt-det-majorant x route-i-krein-certificate x map-open-4 [map-open-4:floored] | new |
| 41 | 8.75 M1 phi-autocorrelation-weight x lambda-slope-per-theta x silent-u8-kernel-conditions-beyond-searched-range [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 3.00 M1 ff-lambda-of-elliptic-curve x spec-z-graph-class-pairing x map-open-4 [map-open-4:floored] | new |
| 42 | 8.75 M3 silent-u6d-rank2-compact-squares-without-hecke-rule x mem-qrh-7-8 x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6d-rank2-compact-squares-without-hecke-rule:open, silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 3.00 M3 map-open-2 x rm-parity-sign-law x rm-sign-law-t-negative [map-open-2:floored] | new |
| 43 | 8.75 M3 silent-u6a-rank2-nonborel-metaplectic-eigenobject x sextic-theta-mean-square x sextic-theta-numerics [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 3.00 M3 map-open-22 x cm-eta-heights-lambda1 x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 44 | 8.66 M1 ff-lambda-of-elliptic-curve x hasse-weil-checks x silent-u8-kernel-conditions-beyond-searched-range [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 3.00 M3 silent-u6e-bost-connes-states-outside-d8 x seven-eighths-abscissa-formula x mem-semilocal-fourier-fs [seven-eighths-abscissa-formula:floored; cell silent-u6e-bost-connes-states-outside-d8:cell] | new |
| 45 | 8.50 M1 winding-monotone-under-heat x euler-transport-flow x silent-u8-kernel-conditions-beyond-searched-range [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 2.97 M1 mem-freeze-flow-interlacing x route-m-kappa-first-moment x map-open-2 [map-open-2:floored] | new |
| 46 | 8.50 M1 zv-annulus-dtn-operator x bohr-torus-scan-certification x silent-u6a-rank2-nonborel-metaplectic-eigenobject [silent-u6a-rank2-nonborel-metaplectic-eigenobject:open] | not listed | 2.75 M1 debruijn-landing-rate-thm13 x mem-landau-siegel-uniform x map-open-2 [map-open-2:floored] | new |
| 47 | 8.50 M3 silent-u6e-bost-connes-states-outside-d8 x connes-twin-ladder-crosswalk x mem-semilocal-fourier-fs [silent-u6e-bost-connes-states-outside-d8:open] | not listed | 2.75 M1 ff-lambda-of-elliptic-curve x hasse-weil-checks x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 48 | 8.50 M3 silent-u6g-scattering-exact-normalisation-affine-kernel x confluent-laguerre-floor x kyp-bounded-real-prime-delay [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 2.75 M4 collision-ladder-data x route-m-conductor-tones x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 49 | 8.50 M3 silent-u4-joint-functionals-not-scaling-invariant x zv-divisor-cosine-euler-product x prime-tent-rh-equivalence [silent-u4-joint-functionals-not-scaling-invariant:open] | not listed | 2.75 M4 tilt-det-majorant x rung-toeplitz-euler-detector x map-open-2 [map-open-2:floored] | new |
| 50 | 8.50 M4 theta-density-positivity x staged-strip-triangular-inequality x tro6-natural [tro6-natural:floored] | 9 | 2.68 M4 confluent-laguerre-floor x pole-term-schur-complement x map-open-4 [map-open-4:floored] | new |
| 51 | 8.48 M1 m23-rank-trace-lemma x dyadic-near-frequency-target x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 2.56 M4 zv-taylor-rouche-channel-criterion x h6-symbol-offline-poisson x seven-eighths-abscissa-formula [seven-eighths-abscissa-formula:floored] | new |
| 52 | 8.47 M4 tilt-det-majorant x arch-native-prime-jordan-product x silent-u4-joint-functionals-not-scaling-invariant [silent-u4-joint-functionals-not-scaling-invariant:open] | not listed | 2.50 M3 map-open-2 x mem-mollifier-proportion-loophole x ns-rigid-loophole-dirichlet-coefficients [map-open-2:floored] | new |
| 53 | 8.25 M1 zv-infinity-end-coordinate x sunit-count-cubic x silent-u6f-isogenous-points-nonlinear-functionals [silent-u6f-isogenous-points-nonlinear-functionals:open] | not listed | 2.26 M1 route-b-limsup-stieltjes x corr23-continuity-spectral-criterion x map-open-4 [map-open-4:floored] | new |
| 54 | 8.25 M3 silent-u8-kernel-conditions-beyond-searched-range x gap-domination-bootstrap x mirror-euler-rate-t0 [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 2.25 M3 map-open-2 x rm-e0-uniform-remainder x binet-positive-kernel [map-open-2:floored] | new |
| 55 | 8.25 M3 tro6-natural x map-pos-49 x mem-qrh-7-8 [tro6-natural:floored] | not listed | 2.08 M4 lean-cg-covering-identity x weil-small-support-lean x map-open-4 [map-open-4:floored] | new |
| 56 | 8.00 M3 silent-u2-pos-fe-positivity-rigidity x flat-window-diagonal-v7 x landau-transport-lemma-l [silent-u2-pos-fe-positivity-rigidity:open] | not listed | 2.00 M3 mem-concentration-dip-open x seven-eighths-abscissa-formula x af-hl-star-hierarchy [seven-eighths-abscissa-formula:floored] | new |
| 57 | 8.00 M3 silent-u3-identification-relaxation x catalan-signed-ladder x zpo-divergence-law-at-half [silent-u3-identification-relaxation:open] | not listed | 2.00 M4 frozen-rung-winding-identity x prime-delay-domination x map-open-4 [map-open-4:floored] | new |
| 58 | 8.00 M3 silent-u8-kernel-conditions-beyond-searched-range x gue-palm-coalesced-pair x af-hl-star-hierarchy [silent-u8-kernel-conditions-beyond-searched-range:open] | not listed | 1.29 M4 ch-holder-half-sharp x corr23-mixed-prolate-ladder x map-open-4 [map-open-4:floored] | new |
| 59 | 8.00 M4 burgers-fluid-bridge x zpo-kinetic-equals-logzeta-dd x silent-u6g-scattering-exact-normalisation-affine-kernel [silent-u6g-scattering-exact-normalisation-affine-kernel:open] | not listed | 0.30 M4 zv-polynomial-heat-coefficients x connes-adelic-truncated-trace x map-open-4 [map-open-4:floored] | new |
| 60 | 8.00 M4 zv-theta-kernel-phi x alias-width-law-octave-weight x tro6-natural [tro6-natural:floored] | not listed | 0.29 M4 zero-ode-ht x mixed-group-rigid-profile x map-open-4 [map-open-4:floored] | new |

## 8. After the lane's own line

Own line appended to `campaign/lanes.jsonl` (also `L/lanes.jsonl`, `L/lanes_line.json`), then `scoreboard.py` rerun (`L/after/scoreboard.final.log`): lanes run 149 -> 150, score-0 lanes 147 -> 148; nothing else changes. State of the scoreboard at the end of this lane: headline 1 of 4 (`c1-leeyang-krein-limit`; missing R2, R3, R4); 150 lanes, 138 refereed, hold rate 91.3%; PROVED broken 11; three-referee statements 2 (about zeros of zeta: 0); nodes 1,727 (588 marked closed); tags 485; families 117,370 (closed 3,797; tried, not closed 988; untried 112,585); outcome records 168; lemmas decided 130.

## 9. Three weakest steps

1. No independent referee. The new map rows D10, P56, G42 and the edits of G41, Q30, P45, S12b were written by
   one reader from the lanes' RESULT and REFEREE files. Row G42 joins a round-15 lane that had no map row with a
   round-16 lane; its "T >= N" half was written from the claim line and the second-referee table of
   `c16-referee-r15-j1prime-u8-screening`, not from a full reading of the c15 lane. A referee should check each
   row against its source and the labels cell by cell.
2. What "scored as a tag" means was decided by this lane. The implementation keeps cell nodes as live tagged
   nodes with the role `lemma` (they are of type open-direction), so they still enter candidates as the open-lemma
   member of M3 triples (23 scored, 2 in the top 60) and still shift tag weights and partner lists (6 scores move
   by 0.01; 15 of 60 keys differ from the pre-cell list). A stricter reading (cell nodes excluded from candidate
   membership) would give a different list. The rejection of candidates containing the closed cell U2-POS is also
   this lane's reading of "closed". Neither changes the counts 0 / 60 / 0.
3. Nine of the eleven corrected sentences still stand uncorrected in lane files, because this lane may not edit
   them. A reader who opens those RESULT files without the map or `campaign/CORRECTIONS_R16.md` sees the false
   sentences. The quotations of sentences 7 and 8 in `engine/outcomes/c15-klein-transport-lemma-w-stage-a-and-e1.json`
   and in `lanes.jsonl`, and the shorthand "O(eta^2 + d^2)" in `ROUND_LOG.md`, were left as logs.

Also open, not weakest: the scoreboard moved during the lane through files of other lanes (attributed, section 5);
the literature rescan relies on one search engine and found identifiers, not contents.

## 10. Owed after this lane

- Independent referee for this lane.
- Dated correction notes in the nine lane files (a lane with edit scope in `push/`).
- U6 (g): the cell state `tried-not-closed` and row D10 are to be revised when
  `c17-rank2-gram-symmetric-blaschke-closure` and the source check of the rank-2 inner product formula report.
- Second referees for round-16 lanes 1, 3, 4, 5, 6 (lane `c17-referee-r16-lemma-h-sources`); rows D10, G41, G42,
  Q30 say "one independent referee pass" until then.
- Outcome records and map rows for round-17 lanes (learn step and next repair lane).

## 11. Files

Edited outside the lane directory: `push/OBSTRUCTION_MAP.md`; `campaign/STRATEGY.md`, `campaign/CORRECTIONS_R16.md`
(new), `campaign/lanes.jsonl` (own line), `campaign/scoreboard.json`, `campaign/SCOREBOARD.md` (reruns);
`engine/generate.py`, `engine/build_graph.py`, `engine/curated/mk_devices.py`, `engine/curated/devices.json`,
`engine/curated/CHANGELOG_c16-repair.md` (superseding note), `engine/ENGINE_LOG.md`, `engine/ROADMAP.md` (note
13.6), `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json` (reruns), four previous files in `engine/scratch/`.

In `L/`: `baseline/` (logs, copies), `before/` (previous files), `after1/` (stage 1), `after/` (final),
`edit_mk_devices.py`, `edit_mk_devices2.py`, `edit_engine.py`, `apply_map.py`, `apply_strategy.py`,
`compare_top60.py`, `attribute_vs_presilent.py`, `top60_before_after.md/.json`, `top60_stage1_cells.md/.json`,
`top60_stage2_rows.md/.json`, `top60_vs_presilent.json`, `scoreboard_attribution.json`, `attrib/`, `lanes_line.json`.
Nothing was written to the repository root.
