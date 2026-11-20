# engine/curated: edits of lane c16-repair-owed-record-r15 (2026-11-19, campaign round 16, repair lane B)

Record lane; no attack; nothing here is a statement about zeros of zeta. This file stands in `engine/curated/`
because the lane's edit scope in the engine is `engine/curated/`; `engine/ENGINE_LOG.md` and `engine/ROADMAP.md`
were not edited. Full account with the before/after table: `push/c16-repair-owed-record-r15/RESULT.md`.

Superseded in part on 2026-11-20 by `c17-repair-owed-record-r16-cell-nodes` (planner decision of round 17): the eleven
`silent-cell-*` entries are no longer device types. They are entries of the key `cells` of `devices.json` (type `cell`;
U2-POS closed, U6 (g) tried-not-closed, nine cells), and `generate.py` gives them no device weight. Device types are
53 closed / 1 floored / 0 open. The owed `CONTROL_CODE_RE` line and the `ENGINE_LOG.md` / `ROADMAP.md` entries are applied.
The text below describes the state of round 16 and is kept as written.

## What changed

- `controls.json`: controls ZQ, SG, NR-q (5 -> 8 curated controls; 20 -> 23 controls in the graph). Source:
  `push/c15-control-with-zeta-fe-classes-u1-u2` with the corrections of its independent referee.
- `mk_devices.py`, `devices.json`:
  - three closed device types for the round-15 rows: `window-fe-rigidity-growing-count-one-span` (map row S12b;
    closed for identification-type conclusions), `fejer-section-prime-chain-growing-p` (row Q30),
    `dictionary-dn-nonhomogeneous-pair-triple-sign-functionals` (row G41; MEASURED at the nine-class and six-class
    tiers; the canonical tier {T-NR, E_a, HEAT} is NOT closed). No node.
  - evidence of the five round-14 types carries the 30 label restrictions of
    `push/c15-referee-r14-independent-checkpoint/LABEL_RESTRICTIONS.md`.
  - eleven open device types `silent-cell-*`, one per silent cell of the refereed checkpoint (U3, U2-POS, U4,
    U6 (a) to (g), U8), each standing on one node of `../nodes/nodes-21.json`.
  - device types: 50 closed / 1 floored / 0 open -> 53 / 1 / 11. Pending 8 -> 7 (three read-class entries and the
    two c6 entries that are cells U6 (c), (d) became device nodes; four entries added: amplifiers with T < N,
    Proposition 5 of C(theta), the canonical tier of DN, cell U5 beyond a span).
- `../nodes/nodes-21.json` (new; outside `curated/`, required for the nodes): eleven nodes of type open-direction.
- Not changed: `build_graph.py`, `generate.py`, `merge_outcomes.py`, `outcomes/`, `outcomes.json`,
  `closed_families.json` (sha256 of all 142 files identical before and after). `merge_outcomes.py` was not run.
- Previous `mk_devices.py`: `../scratch/mk_devices.pre-c16-repair.py`.

## Effect on the generator (read this before using the top 60)

"Open" for a `silent-cell-*` type means: no row or lane closes the cell and the record is silent. It is not a
lead and carries no evidence. With the current weights (open device 2, floored device 0) and `--per-device 12`:

| quantity | before | after rows, controls, closed types (stage 1) | after silent-cell nodes (stage 2) |
|---|---|---|---|
| graph nodes (live) | 1,701 (963) | 1,707 (963) | 1,718 (974) |
| edges | 9,025 | 9,031 | 9,118 |
| generated / scored | 36,558 / 8,437 | same | 52,367 / 19,088 |
| top 60: keys, order, scores | - | identical | 2 of 60 keys kept |
| top 60 with an open device / floored only | 0 / 60 | 0 / 60 | 57 / 3 |
| rank 1 | capture-ratio-psd-slope x sympow-conductor-normalised-shift x tro6-natural (10.25) | same | silent-u8 x capture-ratio-psd-slope x sympow-conductor-normalised-shift (12.03) |

- The former rank 1 is still the best candidate without a silent-cell node (10.25) but is not in the list: the
  per-node cap (2 appearances) is used up by candidates that add a silent-cell node to the same partners.
- 13 of the former top 60 are no longer enumerated: the crossing-device pool grew from 6 to 17 nodes, and the
  generator keeps a fixed number of device partners per anchor, so old device nodes (`tro6-natural`,
  `qrh-seven-eighths`, `map-open-*`) left some partner lists. 42 keep their score; 5 moved by 0.01 (cause not traced). Detail: `push/c16-repair-owed-record-r15/after/top60_attribution.json`.
- Appearances in the top 60: U6 (a) 12, U8 12, U6 (g) 10, U6 (f) 9, U6 (e) 5, U3 3, U4 3, U6 (d) 2, U2-POS 1,
  U6 (c) 1, U6 (b) 0.
- To see the list without the silent cells, set their state to something other than open or floored in
  `mk_devices.py` (for example move them to PENDING), or lower `--per-device`. The list before this lane is
  `push/c16-repair-owed-record-r15/baseline/CANDIDATES.json`.

## Owed

- `CONTROL_CODE_RE` of `build_graph.py`: codes NR-q, ZQ, SG (NR-q before NR, as for NR-vec). Not applied (outside
  the edit scope). No defeated-by cell of the map names them today; the graph is identical with and without the
  line (run with the line: `push/c16-repair-owed-record-r15/diff_baseline_after1.with-regex.json`).
- An entry in `ENGINE_LOG.md` and `ROADMAP.md` pointing to this file.
- Device entries for the two round-15 lanes without a map row: `c15-edge-argument-strip-width-hecke-amplified`
  (its proposed label G37 is taken) and `c15-klein-transport-lemma-w-stage-a-and-e1`.
