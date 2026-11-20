#!/usr/bin/env python3
"""Campaign and engine text edits of lane c18-repair-owed-record-r17-open-device-nodes: STRATEGY.md (record lines only;
no rule, weight or allocation changed), CORRECTIONS_R16.md, engine/ENGINE_LOG.md, engine/README.md. Anchors match once."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
def patch(rel, jobs, append=None):
    p = os.path.join(ROOT, rel); s = open(p, encoding='utf-8').read()
    assert 'c18-repair-owed-record-r17-open-device-nodes' not in s, rel
    for a, b in jobs:
        assert s.count(a) == 1, (rel, a[:60], s.count(a)); s = s.replace(a, b)
    if append: s = s.rstrip('\n') + '\n\n' + append + '\n'
    open(p, 'w', encoding='utf-8').write(s); print('patched', rel)

patch('campaign/STRATEGY.md', [
 ("The registered prediction R2 <= 1 failed for T < N (sup 1.04 to 1.46), also at EIS-w points.",
  "The registered prediction R2 <= 1 failed for T < N (sup 1.04 to 1.46, for N <= 8 only; R2 <= M/L is a validity statement, not a structural cap; restriction entered by `c18-repair-owed-record-r17-open-device-nodes` after E2 of the referee of the previous record lane), also at EIS-w points."),
 ("(before: 57 with an open device, all through a `silent-*` node).\n",
  "(before: 57 with an open device, all through a `silent-*` node).\n\n"
  "State of the cells after round 17 (entered 2026-11-19 by `c18-repair-owed-record-r17-open-device-nodes`; one referee each, independent second passes owed by `c18-referee-r17-independent-sources`; the tables below are the round-15 state and are kept): U3 read as an inequality closed as target-level (row P57); U6 (e) closed for positivity reads and the eigenstate class (row D8, clause (vi)); U6 (f) closed for norm, Jensen gap and discriminant (row G33); U6 (g) tried, not closed (row D10, round-17 revision; lane `c18-d10-inertia-law-theorem-t-lemma-d`); U8 on dictionary DU closed as MEASURED, outcome \"none\" (row G43), the class beyond DU stays a cell; U5 / C(theta): window information law (row Q31, one referee; rows S12b, Q30, P45 kept until the second referee reports); cells without a passing control on file: the U4 residual and U6 (c) (round-18 lanes). Two proposed, untested device types are entered as open device nodes so that `generate.py` can rank explore slots: `tz-one-sided-completion-bound-band` (source: window law, bound N(theta)) and `exact-relation-rigidity` (source: round-17 lanes 1, 3 and Theorem P), each with entry conditions and the controls that must fail in `../engine/curated/devices.json`. They are questions, not leads; no penalty is waived for them. After the change 24 of the top 60 stand on a proposed node (12 each, the per-device cap) and 36 on the floored 7/8 type. Lane `c18-exact-relation-rigidity-klein-spinor` (0 referees) reports the second type closed for the relation multiplicativity; its state changes when a referee holds. Planner note: `PLANNER_NOTE_R19.md`.\n"),
 ("- Record edits of 2026-11-20, `c17-repair-owed-record-r16-cell-nodes` (no version change; no rule, weight or allocation changed).",
  "- Record edits of 2026-11-19, `c18-repair-owed-record-r17-open-device-nodes` (no version change; no rule, weight or allocation changed). Section 3.1 item 47: scope of the R2 excess (N <= 8) and the reading of R2 <= M/L. Section 4.0: the paragraph \"State of the cells after round 17\" with the two proposed device types. Not edited: the lists of section 3.1 (the round-17 closures are in the map rows P57, G43, Q31, D8 (vi), G33, D10 and in `ROUND_LOG.md`; items for them are left to the next strategy review), headings of items 45 and 47 (E6 of the referee of the previous record lane stands as a reading note: both items state their own status and are not closures).\n"
  "- Record edits of 2026-11-20, `c17-repair-owed-record-r16-cell-nodes` (no version change; no rule, weight or allocation changed)."),
])
patch('campaign/CORRECTIONS_R16.md', [], append=(
 "## Update 2026-11-19 (lane `c18-repair-owed-record-r17-open-device-nodes`, campaign round 18)\n\n"
 "Rows 3 to 11 are now entered in the lane files themselves. In each file the false sentence is kept and a bracketed note "
 "beginning \"[Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes\" follows it with the "
 "corrected sentence of the table above (rows 3 to 8 and 10: directly after the sentence; rows 9 and 11: one line after the "
 "table that holds the counts or cells). Files: `push/c15-u5-window-count-threshold-translate-control/RESULT.md` (row 3), "
 "`push/c15-edge-argument-strip-width-hecke-amplified/RESULT.md` (row 4), `push/c15-u7-growing-section-twin-ladder-bridge/RESULT.md` "
 "(rows 5, 6), `push/c15-klein-transport-lemma-w-stage-a-and-e1/RESULT.md` (rows 7, 8), "
 "`push/c15-nonhomogeneous-pair-triple-kernel-search/RESULT.md` (row 9), `push/s1-prime-torus-orbit/RESULT.md` (row 10), "
 "`push/s1-zero-statistics-gram/RESULT.md` (row 11). Previous files: `push/c18-repair-owed-record-r17-open-device-nodes/before/lanefiles/`. "
 "Script: `apply_corrections.py` in that directory. Not rewritten: other occurrences of the same statements inside those files "
 "(for row 6 the proposed map row of the c15-u7 file, section 8, repeats 'unimodular twists pass'; for row 9 the old counts stand "
 "in four places and one note corrects them), the outcome records and `lanes.jsonl` lines that quote the sentences. No verdict "
 "changes. Also entered in place: the control-table entry 'ZQ (rational form) fails at S3/S4' of "
 "`push/c16-u6g-scattering-fe-rank2-bridge-stage-a/RESULT.md` section 5 (wrong; ZQ in the rational form passes, "
 "`push/c17-rank2-gram-symmetric-blaschke-closure` section 5.2; map row D10 and section 7)."))
patch('engine/README.md', [
 ("| `ENGINE_LOG.md` |",
  "| `nodes/nodes-22.json`, `curated/devices.json` fields `status`, `entryConditions`, `controlsThatMustFail` | two proposed, untested device types entered as open device nodes (lane `c18-repair-owed-record-r17-open-device-nodes`). `generate.py` treats a proposed type as an open device for the R4-device rule and the weight, without the three penalty waivers of an open device; `--proposed-waivers` gives the comparison run |\n| `ENGINE_LOG.md` |")])
