# Idea attack generator (engine)

Directory: `tmp/research-2026-11-16/engine/`. Purpose: hold the results of the repository, the renderer repo and the sibling repos as one machine-readable graph, propose combinations of two or three nodes as attacks on the Riemann hypothesis, reject combinations already closed by the 2026-11-16/17 campaign, and keep a roadmap. The engine proposes and filters. It proves nothing, and its ranking is a heuristic.

## Files

| File | Role |
|---|---|
| `nodes/nodes-*.json` | node records written by the corpus readers (one file per corpus chunk) |
| `index/` | text index of the corpus used by the readers (`MANIFEST.md` lists the chunks) |
| `underused.json` | node ids flagged by readers as under-used, with the reason |
| `outcomes.json` | lanes launched from the engine or in progress, with verdicts |
| `outcomes/<slug>.json` | one record per finished lane (verdict, closed node set, controls, lesson, new nodes) |
| `merge_outcomes.py` | builds `outcomes.json`, `nodes/nodes-15.json` and `closed_families.json` from the records; enters curated candidates as `proposed` |
| `closed_families.json` | closed combination families: regex groups; a candidate is rejected when all groups match its joint text |
| `build_graph.py` | merges nodes, parses the obstruction map, writes `IDEA_GRAPH.json` |
| `generate.py` | builds and scores combinations, writes `CANDIDATES.json` |
| `IDEA_GRAPH.json` | the graph: `meta`, `nodes`, `edges` |
| `CANDIDATES.json` | ranked candidates with reasons and the rows checked |
| `curated/batch-1.json` | the ten hand-selected assignments of batch 1 (written by `mk_batch1.py`) |
| `curated/batch-2.json` | the ten hand-selected assignments of batch 2 (written by `mk_batch2.py`) |
| `curated/devices.json` | curated list of crossing devices with states closed / floored / open (written by `curated/mk_devices.py`); read by `build_graph.py` (node field `device`, role `device`) and `generate.py`. Replaces the keyword role `crossing` (lane `c5-repair-engine-map-r4`) |
| `ENGINE_LOG.md` | one section per batch: lanes, where each stopped, engine changes |
| `ROADMAP.md` | the wall, the families, what is closed, what is open, order of attack |

## Run

```
cd tmp/research-2026-11-16/engine
python3 merge_outcomes.py && python3 build_graph.py && python3 generate.py --top 40
```

Python 3 standard library only. About 20 seconds and under 1 GB. Inside the campaign use the memory cap: `../../../scripts/memcap.sh 8 python3 build_graph.py`. The scripts read `nodes/`, `underused.json`, `outcomes.json` and the markdown files in `../push/` as text. They never import or execute repository modules.

Options of `generate.py`:

- `--top N` number of candidates written (default 40)
- `--node ID` only candidates containing this node (use it to list partners of one idea)
- `--move M1|M2|M3|M4|P2`, `--theme flow|positivity|prime-chain|zero-free|statistics|nyman|geometry`
- `--per-node K`, `--per-family K` diversity limits in the output
- `--dump-all FILE` write every scored candidate (about 200 MB)
- `--dump-rejected FILE` write the rejection counts and up to 25 sample candidates per rejection reason
- `--no-r4-rules` switch off the rules added in campaign round 4 (see below)

Rules added in campaign round 4 (lane `c4-repair-map-engine-r3`; details and limits in `ENGINE_LOG.md`): a candidate is rejected unless one member is a crossing device (curated tag `crossing-device`, role `device`; or the keyword role `crossing` on a node that is not a measured phenomenon, a flow / Lambda-side statement, a mean-value object, a certificate or a visualisation); rejected when its only arithmetic step is target-blind algebra (tag `target-blind`); rejected when every member is a prime-side or size statement with no ingredient that changes under shift and reciprocal (control RZ_b); penalised by 3 when no two members share an object (a declared non-generic tag or a `uses` / `special-case-of` / `restates` edge). `closed_families.json` entries may carry `unless` (a regex that exempts a candidate) and `row` (the map row). Each candidate in `CANDIDATES.json` lists `r4Devices` and `sharedObjects`; `meta.r4Rules` gives the counts.

Changed in campaign round 5 (lane `c5-repair-engine-map-r4`): devices are the nodes listed in `curated/devices.json`. A candidate containing a closed device node is rejected; a candidate needs at least one open or floored device; score part `crossing` is 3 for an open device and 2 for a floored one; a device node may appear `--per-device` times in the output (default 12). The three round-4 device nodes have status `closed` (walls). After editing `curated/mk_devices.py` run it, then `build_graph.py`, then `generate.py`.

## The graph

Counts after batch 1 (2026-11-17, late): 1,246 reader records from 15 node files; 1,463 nodes, 8,258 edges, 927 live nodes, 12 controls (SEL and PERM added), 31 outcome and family nodes. Counts before batch 1: 1,238 reader records from 14 node files merge to 1,202 corpus nodes; 154 obstruction rows, 10 controls, 40 positive-list items and 15 uncovered items come from the map and syntheses; 1,422 nodes, 8,102 edges, 922 live nodes.

Node fields: `id`, `type` (object, mechanism, identity, measured-phenomenon, open-lemma, conjecture, tool, obstruction, control, open-direction, target), `name`, `statement`, `status` (proved, certified, measured, conjectural, closed, refuted), `usesMultiplicativity`, `heightUniform`, `source`, `tags`, plus derived fields:

- `provenance`: every reader record merged into the node (file, id, source); `aliases`: ids merged away
- `tagsInferred`: tags added by keyword rules; `sourceKinds`: imp, form, route, pr, dag, page, mem, zv, sib, lean, map
- `rows`: obstruction rows attached to the node (from `closedBy`, `obstructionRow`, or a row cited in the text)
- `roles`: `wall`, `arith`, `few-primes`, `uniform`, `rigid`, `device` (curated; the keyword role `crossing` was removed in round 5), `phenomenon`, `explainer`, `lemma`, `separator`, `rh-equivalent`, `surrogate`, `flow-stable`, `underused`

Row nodes are `row-<id>` (for example `row-Q10`), controls are `ctl-<code>` (DH, HEAT, TW+, TW-, EA, NR, B, U, THW, PA), positive-list items `map-pos-<n>`, uncovered items `map-open-<n>`, the target `target-rh`.

Edge types: `uses`, `restates`, `special-case-of`, `obstructs`, `control-defeats`, `separates-from`, `composes-with`. A `composes-with` edge needs a shared tag of sufficient weight and complementary roles (for example one node uses multiplicativity and the other is height-uniform); the ten strongest per node are kept.

Deduplication: records with the same id are merged; records whose text cosine similarity is at least 0.69 are merged (12 records into 9 nodes); similarity between 0.50 and 0.69 gives a `restates` edge. A merged node keeps the longest statement, the union of tags and all provenance; a closed or refuted record wins the status.

## The generator

Moves: M1 rigid structure x arithmetic input x crossing mechanism; M2 measured phenomenon x explaining mechanism x control it must fail on; M3 open lemma x proved tool x arithmetic or crossing partner; M4 flow functional x prime-side input x crossing mechanism or DH-separator; P2 under-used node x arithmetic partner.

Hard rejections: every regex group of a closed family in `closed_families.json` matches the joint text of the members; two nodes shared with a closed lane; no member uses multiplicativity; all members flow-stable and none arithmetic; all members attached to one closed row; all members from one module; node set contains a combination closed in `outcomes.json`; node set equal to a launched one.

Score: multiplicativity 0-2, height-uniform 0-3, control failure 0-3, crossing 0-2, under-used 0-4, cheap first test 0-2, cohesion 0-2, breadth of sources 0-1, minus penalties (member attached to a closed row; no functional-equation-side member; only mean-value objects; RH-equivalent statement with no separate lever; overlap with a lane in progress or launched). Each candidate lists `rowsChecked`: the closed rows closest in tags, with the reason the candidate is or is not covered.

Known limits. The score reads labels and tags. It cannot distinguish a mechanism from a restatement of RH, and it ranks flow and Lambda lanes high because their nodes are well labelled. `separator` is detected in 7 live nodes only. In batch 1 the top 40 were read by hand and none was launched as generated; the ten launched candidates were chosen from the graph by hand and rank between 662 and 39,988 by the heuristic. Use the generator to enumerate partners and to check rows, and read the result against the three questions in section 2 of the obstruction map before launching anything.

## Adding nodes

1. Append records to a file `nodes/nodes-<k>.json` (a JSON list). Required fields: `id` (kebab-case, unique), `type`, `name`, `statement` (one to three sentences with the exact formula or number), `status`, `usesMultiplicativity` (yes, no, unknown), `heightUniform` (yes, no, unknown), `source` (path, module id, PR, or lane), `tags` (reuse tags listed in `IDEA_GRAPH.json` `meta.tagIdf`). Optional: `closedBy` or `obstructionRow` with row ids.
2. If the node records where a control fails, write the step in the statement ("fails for DH at ...") so the `separator` role is detected.
3. To flag a node as under-used add `{"id": ..., "why": ...}` to `underused.json`.
4. Rebuild.

New obstruction rows: add them to a table in `../push/OBSTRUCTION_MAP.md` or a `SYNTHESIS*.md` there (first header cell `#`, `Row` or `Row id`; columns for the route, where it stops, and the control outcome). The builder parses every such table.

## Adding outcomes

Preferred: put the lane record in `outcomes/<slug>.json` (fields `slug`, `verdict`, `nodes` = minimal closed set, `launchedNodes`, `tags`, `controlsThatDefeat`, `obstruction`, `lesson`, `newNodes`) and run `python3 merge_outcomes.py`, which regenerates `outcomes.json`. To close a whole mechanism rather than a node set, add a family to `FAMILIES` in `merge_outcomes.py`; keep the patterns narrow (a family closes a mechanism, not a topic). Entries of `outcomes.json` with no record file are kept as they are.

When a lane reports, edit its entry in `outcomes.json` (or add one):

```
{"slug": "e1-cofinal-legendre-dual", "verdict": "closed", "nodes": ["cofinal-legendre-dual", "rig-continuum-sawtooth"],
 "tags": ["landau"], "defeatedBy": ["B"], "title": "...", "path": "push/e1-cofinal-legendre-dual",
 "note": "one sentence: where it stops"}
```

Verdicts: `proposed`, `in-progress`, `closed`, `refuted`, `partial`, `open`. A `closed` or `refuted` outcome becomes an obstruction node `out-<slug>`, and the generator rejects every candidate whose node set contains its `nodes`. Keep `nodes` minimal: list only the members whose combination failed, so that the rejection is not wider than the result. A `partial` or `open` outcome should also add its proved statements as new nodes.

## What the engine does not do

It does not read the large data modules, verify any statement, or check a node's labels against its source. Node statements are the readers' summaries of the corpus, taken from text. A candidate's `reason` and `firstTest` fields are templates filled from node names.
