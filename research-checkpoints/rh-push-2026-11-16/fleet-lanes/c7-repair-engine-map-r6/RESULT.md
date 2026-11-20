# c7-repair-engine-map-r6: second referee for the normaliser lemma; engine, map and strategy bookkeeping owed from rounds 5 and 6

2026-11-18. Kind: repair. No attack. No statement about zeros of zeta. Nothing committed, pushed or posted.
Local runs only, each through `scripts/memcap.sh 8` (stdlib python; largest: `generate.py`, under 1 minute). The
compute server was not used (nothing here exceeds the local cap). No repo data module was imported or executed.

## Verdict

**Partial result (repair lane; all four items done, headline unchanged).**

1. Lemma H of `c6-marks-bc-manuscript-check` **holds** on an independent second pass against the manuscript text
   (not the lane's transcription): H_eta = zeta_F^S(2)^-1 L^S(6s-3, psi_eta) E_eta on Re s > 1/2, psi_eta =
   (alpha eta)^6 of infinite order; infinitely many zeros in 7/12 <= Re s < 2/3; MS hypothesis (2.2) false for every
   sigma_0 < 7/12 and every finite S. Lemma S and Theorem B1' also hold as labelled. Four wording points (W1-W4), one
   of which matters to the two round-7 lanes that rest on the lemma: (2.2) holds for every sigma_0 > 2/3 after
   enlarging S and fails at sigma_0 = 2/3 exactly, so "stops at 2/3" is an infimum that is not attained.
2. Engine: `map-open-9` closed for pointwise outputs, `map-open-1` narrowed, three open device nodes added; rerun
   done; top 60 contains no closed device.
3. Map: 11 rows, 5 section-6 updates, 12 section-7 entries, by script.
4. STRATEGY: stale line corrected, obstructions recorded on items 2, 3, 4 of section 4.0, normaliser requirement
   added to ORDER-2, change-log entry.

## 0. Plan

Order as assigned: referee first (two running lanes depend on it), then engine, map, strategy, then controls.
Read: BRIEF to the end; ROUND_LOG round-6 results, lessons, open items, round-7 allocation; MAP_PENDING;
ENGINE_LOG tail; RESULT of the manuscript-check lane sections 1-3; the manuscript text
`~/lean-deps/qrh-verify/paper.txt` at lines 368-402, 516-521, 3098-3360, 4305-4336; map rows Z15, Z18, Z21,
section 6, section 7; referee reports of the round-5 and round-6 lanes whose rows were owed.

## 1. Second referee (file `push/c6-marks-bc-manuscript-check/REFEREE2.md`)

Method: the local factor was derived by hand from MS (7.11), (7.12) at u = 1, (w, z) = (1, 1/6), before the lane's
formula and script were read; then checked against MS table (7.16) row by row (an independent code path:
`ref2_hp.py` sums the four j = 0 row families as truncated double series in exact rationals; difference from the
closed form 2.0e-20 at truncation 40, remainder bound (1/3)^40; `ref2_hp.log`).

| statement | result |
|---|---|
| H_p = (1 - q^2)(1 - D(1-q) - Rq)/((1-R)(1-D)), R = a_p^2 Q^(3-6s) | confirmed (hand derivation; table sum; consistent with the MS bound O(Q^(-363/200)) in region (7.15)) |
| E-form, abs. convergent iff Re s > 1/2; E'-form, iff Re s > 3/7 | confirmed (exact identities at 500 random points; exponents 2 - 6 sigma, 2 - 7 sigma) |
| local non-vanishing on Re s >= 1/2 | confirmed (bound 0.625 at Q = 4; grid minimum 0.3750) |
| psi_eta of infinite order; L(w, psi_eta) entire, no zeros on Re w = 0, 1 | confirmed from MS lines 516-521 (alpha(a) = a/abs(a), primary generators); CLASSICAL, no source opened |
| zeros of H_eta: s = (3 + rho')/6, symmetric about 7/12, infinitely many with 7/12 <= Re s < 2/3 | confirmed |
| (2.2) false for sigma_0 < 7/12, every finite S | confirmed |
| Lemma S (i) <=> (ii) <=> (iii) | confirmed; W3: Landau-lemma disc needs radius 12, not 2; W4: boundary case in the parenthesis of (iii) |
| Theorem B1' (1a), (2a), (2b) | confirmed; (1b) not re-derived (inputs have no source at the vertex, as the lane says); (2c) open |

Not checked: MS Lemma 7.1 itself from (7.10) and the Gauss-sum evaluation (7.8); the conjugation convention in
(7.6) (bars are lost in the text file; either reading gives an infinite-order character).

## 2. Engine

Edits: `engine/curated/mk_devices.py` (rerun; writes `curated/devices.json`), `engine/nodes/nodes-17.json` (new,
three nodes). Rerun of `merge_outcomes.py`, `build_graph.py`, `generate.py --top 60` (log `engine_rerun.log`).

| | before | after |
|---|---|---|
| device types closed / floored / open | 23 / 1 / 2 | 24 / 1 / 4 |
| outcome entries (closed) | 68 (52) | 68 (54) |
| nodes (live) | 1,596 (954) | 1,612 (957) |
| map rows parsed | 191 | 202 |
| edges | 8,627 | 8,713 |
| device nodes closed (live) / floored / open | 57 (50) / 6 / 2 | 58 (51) / 6 / 4 |
| generated / scored / rejected | 36,447 / 8,289 / 28,158 | 41,507 / 8,761 / 32,746 |
| top 60: listed / open device / floored only / closed device | 59 / 0 / 59 / 0 | 60 / 12 / 48 / 0 |

Open device nodes after the rerun: `map-open-1` (narrowed), `laurent-shell-gamma-section`,
`ff-order2-vertex-probe`, `landau-siegel-2026-mechanism`. The generator now proposes one of the three new device
types: all 12 open-device candidates of the top 60 contain `landau-siegel-2026-mechanism`; the other two new nodes
are live but do not reach the top 60.

Two findings about the pipeline (recorded in ENGINE_LOG, not changed):
- `merge_outcomes.py` maps precise-obstruction to closed without reading `refereeHolds`; the rerun therefore turned
  two round-6 entries that the learn step had set to open (`c6-gl3-cover-epsilon-cocycle`,
  `c6-unreflected-marks-kd23`) into closed.
- `map-open-1` cannot appear in any candidate: seven closed outcome entries list it as their only node, and the rule
  "contains a combination closed in outcomes.json" rejects every candidate containing it. This predates the rerun.

## 3. Map (`push/OBSTRUCTION_MAP.md`, 490 -> 515 lines, script `apply_map.py`)

The parser accepts ids of the form letters + digits + optional letter, so A3-C1 .. A3-R became G27 .. G30.

| owed | applied as |
|---|---|
| A3-C1, A3-C2, A3-C3, A3-R | G27, G28, G29, G30 |
| P50 quadratic positivity | P50; section 6 item 9 |
| pair probe | Z15c (referee's corrected classification) |
| double-cover cocycle, narrowed | Z23 (referee's surviving claim); section 6 item 18 |
| normaliser cap at 2/3 | Z24 (two referees; includes W2); note in Z15 |
| `c5-twisted-helson-arcs` | P51 (qualifier limsup abs(S(x))/x > 0); section 6 item 21 |
| `c5-thin-propd-dichotomy`, `c5-marks-circularity-order2` | Z25, Z26; section 6 items 22, 1 |
| section 7, rounds 5 and 6 | 12 entries |

Row count line: P 51, G 30, Q 22, S 12, Z 28, F 8, T 3, L 5, D 7 = 166 (was 155). Not entered: the row proposed by
`c6-unreflected-marks-kd23` (referee does not hold two headline sentences; listed in MAP_PENDING).

## 4. STRATEGY (`campaign/STRATEGY.md`, script `apply_strategy.py`)

Section 3.1 "never run" line corrected (square intertwiner lead and lead 22 were run); ORDER-2 paragraph: added
requirement "the normaliser H of the probe has no zeros in Re s > 1/2"; section 4.0 items 2, 3, 4: obstruction
recorded on each; second-lead paragraph: status; change log: one entry.

## 5. Controls

- Top 60 after the rerun: 0 candidates contain a closed device node (generator meta `topWithClosedDevice` = 0 and
  an independent recount from the node list, `engine_counts.json`); `map-open-9` occurs in no candidate.
- `campaign/scoreboard.py`: `load_lanes` returns 58 lanes for 58 non-empty lines, 0 unparsed; parts A, C, D and the
  history compute on the new graph (`scoreboard_check.log`). The scoreboard files were not rewritten.
- Map: every inserted row has six cells and a new id (assertions in `apply_map.py`); `build_graph.py` parsed
  191 + 11 rows.
- The nine controls of the campaign (DH, backward heat, sign twists, unimodular twist, E_a, T-NR, Beurling,
  phase-rotated transfer operator, theta^w) are not applicable: no argument about zeros is made. Lemma H uses only
  complete multiplicativity and abs(eta(p)) = 1, so it holds for THIN and unimodular twists (stated in row Z24).

## 6. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | repair lane; no argument about zeros |
| R2 (height-uniform, every window) | false | none |
| R3 (every control fails structurally) | false | none; Lemma H is control-blind within completely multiplicative unimodular weights |
| R4 (reaches the critical line) | false | none; the refereed lemma is a cap at abscissa 2/3 for the sextic probe format |

Requirement effect: none on the headline (1 of 4, `c1-leeyang-krein-limit`).

## 7. Three weakest steps

1. Lemma H is exact relative to MS Lemma 7.1 as printed. Neither referee re-derived the j = 0 table from (7.10)
   and the Gauss-sum values (7.8), and the manuscript is unrefereed. The 2/3 cap inherits this.
2. Row texts for G27-G30, Z23, Z25, Z26 and the section-7 entries were composed from the lanes' results, the learn
   records and the referee reports; the referee reports of `c6-square-intertwiner-weyl`,
   `c5-thin-propd-dichotomy` and `c5-marks-circularity-order2` were read in part (error lists and surviving
   claims), not in full. A row may omit a qualifier that sits elsewhere in those reports.
3. The three new device nodes describe proposals of lanes that had not reported; their tags were chosen by hand,
   and the 12 generated candidates with `landau-siegel-2026-mechanism` pair it with partners by tag overlap only.
   W2 of the referee report (failure of (2.2) at sigma_0 = 2/3 exactly) is argued in two lines (Kronecker
   alignment), not written out.

## 8. Files changed

Outside this directory:
- `push/c6-marks-bc-manuscript-check/REFEREE2.md` (new)
- `push/OBSTRUCTION_MAP.md` (edited by `apply_map.py`)
- `engine/curated/mk_devices.py` (edited), `engine/curated/devices.json` (regenerated)
- `engine/nodes/nodes-17.json` (new); `engine/nodes/nodes-15.json` (rewritten by `merge_outcomes.py`)
- `engine/outcomes.json`, `engine/closed_families.json`, `engine/IDEA_GRAPH.json`, `engine/CANDIDATES.json`
  (regenerated by the rerun)
- `engine/ENGINE_LOG.md` (section appended)
- `campaign/STRATEGY.md` (edited by `apply_strategy.py`)
- `campaign/MAP_PENDING.md` (status section appended)

In `push/c7-repair-engine-map-r6/`: `RESULT.md`; `ref2_hp.py`, `ref2_hp.log`; `apply_map.py`, `map_edits.json`;
`apply_strategy.py`; `engine_rerun.log`, `engine_counts.json`; `scoreboard_check.py`, `scoreboard_check.log`;
`before/` (OBSTRUCTION_MAP.md, STRATEGY.md, MAP_PENDING.md as found); `engine_before/` (IDEA_GRAPH.json,
CANDIDATES.json, outcomes.json, closed_families.json, mk_devices.py, devices.json, ENGINE_LOG.md as found).

Not touched: `campaign/lanes.jsonl`, `scoreboard.json`, `SCOREBOARD.md`, `ROUND_LOG.md`, `engine/generate.py`,
`build_graph.py`, `merge_outcomes.py`, outcome record files, anything outside `engine/`, `campaign/`, `push/`.
