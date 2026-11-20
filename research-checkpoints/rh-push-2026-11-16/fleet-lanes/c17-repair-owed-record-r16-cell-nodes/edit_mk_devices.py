#!/usr/bin/env python3
"""One-off edit of engine/curated/mk_devices.py by lane c17-repair-owed-record-r16-cell-nodes: the eleven
silent-cell tuples leave the device list D and become the list CELLS (node type 'cell'). Text edit only."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.normpath(os.path.join(HERE, '..', '..', 'engine', 'curated', 'mk_devices.py'))
src = open(P, encoding='utf-8').read()
assert 'CELLS = [' not in src, 'already edited'
lines = src.split('\n')
i0 = next(k for k, l in enumerate(lines) if l.startswith(' # ---- silent cells of the refereed checkpoint'))
i1 = next(k for k in range(i0, len(lines)) if lines[k] == ']')
block = '\n'.join(lines[i0 + 1:i1])
tuples = eval('[' + block + ']')
assert len(tuples) == 11 and all(t[1] == 'open' for t in tuples)
STATE = {'silent-cell-u2-pos': 'closed', 'silent-cell-u6g': 'tried-not-closed'}
ADD = {
 'silent-cell-u2-pos': ' Round 16: CLOSED as an identification (PROVED, three referee files hold): Theorem P of push/c16-pos-fe-u2-positivity-rigidity (G = int_[1,inf) x^-s dN, N >= 0, (s-1)G entire of finite order, zeta\'s functional equation => G = r zeta; Poisson-summation rigidity, classical in content; no multiplicativity used). The cell is a cell of U3; map row P56. The quantitative form is target-level.',
 'silent-cell-u6g': ' Round 16: TRIED, NOT CLOSED. push/c16-u6g-scattering-fe-rank2-bridge-stage-a (one independent referee): rank-2 Gram positivity read off the zero set adds the reflection of zeros with 0 < Re a < 1/2 (Lemma R, PROVED relative to the recalled inner product formula); BLS-sym and BLS-right with non-real zeros pass (MEASURED; closure not proved); map row D10. Open until push/c17-rank2-gram-symmetric-blaschke-closure reports. Not tried: the two-variable affine kernel, the archimedean factor.',
 'silent-cell-u3': ' Round 16 (push/c16-qa-filter-silent-cells-geometric-nodes, one reader, one referee): no passing control on file for U3 read as an inequality; U2-POS joined this class (Theorem P).',
 'silent-cell-u4': ' Round 16: the canonical tier of dictionary DN is closed as MEASURED, outcome "none" (push/c16-dn-canonical-tier-ball-conversion; map row G41); the residual of the cell has no passing control on file (c16-qa-filter) and no lane.',
 'silent-cell-u6c': ' Round 16 (c16-qa-filter): no passing control on file; no computation method on file.',
 'silent-cell-u6e': ' Round 16 (c16-qa-filter): no passing control on file. Round-17 lane c17-u6e-bost-connes-non-invariant-state-twin-ladder.',
 'silent-cell-u6f': ' Round 16 (c16-qa-filter): no passing control on file. Round-17 lane c17-u6f-isogenous-points-norm-jensen-gap.',
 'silent-cell-u8': ' Round 16: Lemma H (push/c16-referee-r15-j1prime-u8-screening; one referee) fixes the HEAT column of a monomial functional; a restricted search is gated on a second referee of Lemma H (c17-u8-restricted-search-lemma-h-gated). By Lemma QA of c16-qa-filter a survivor of a compact-parameter sign search is not a device with R3.',
}
out = ['CELLS = [',
       ' # ---- read classes (silent cells) of the refereed checkpoint. NOT crossing devices: planner decision of round 17',
       " # (campaign/ROUND_LOG.md, 'Round 17 allocation'), applied by c17-repair-owed-record-r16-cell-nodes. One node each in",
       ' # nodes/nodes-21.json. generate.py scores a cell node as a tagged node: no device weight, no waived penalty.',
       " # States: 'cell' (no row or lane closes it; the record is silent; not a lead), 'tried-not-closed', 'closed'."]
for cid, st, name, ev, nodes in tuples:
    st2 = STATE.get(cid, 'cell')
    ev2 = ev.replace('OPEN in the sense "no row or lane closes it"; the record is silent, this is not a lead.',
                     'A read class, not a crossing device (planner decision of round 17). State at entry (round 16): no row or lane closes it; the record is silent, this is not a lead.')
    ev2 += ADD.get(cid, '')
    out.append(' (%r, %r, %r,\n  %r,\n  %r),' % (cid, st2, name, ev2, nodes))
out.append(']')
new = lines[:i0] + lines[i1:i1 + 1] + out + lines[i1 + 1:]
src2 = '\n'.join(new)
# header note
src2 = src2.replace("\nimport json, os\nHERE", "\nEdited by c17-repair-owed-record-r16-cell-nodes (round 17): the eleven silent-cell-* entries are no longer device types. They are entries of the list CELLS (node type 'cell', key 'cells' of devices.json), states cell / tried-not-closed / closed; previous file scratch/mk_devices.pre-c17-repair.py. Pending list updated with the round-16 outcomes.\n\"\"\"\nimport json, os\nHERE", 1) if False else src2
src2 = src2.replace("    targetForms=TARGET_FORMS, pending=PENDING)",
 "    cellStates=dict(cell='a read class on which the record is silent: no row or lane closes it; not a crossing device and not a lead',\n"
 "                    **{'tried-not-closed': 'a lane reported on the class with an obstruction that is measured or partial; one more lane allowed (STRATEGY section 3)',\n"
 "                       'closed': 'a refereed lane turned the class into a row (identification, control or restatement); a candidate containing its node is rejected'}),\n"
 "    cells=[dict(id=i, type='cell', state=s, name=n, evidence=e, nodes=nodes) for i, s, n, e, nodes in CELLS],\n"
 "    targetForms=TARGET_FORMS, pending=PENDING)")
src2 = src2.replace("for d in out['devices']:\n    for n in d['nodes']:", "for d in out['devices'] + out['cells']:\n    for n in d['nodes']:")
src2 = src2.replace("    len(seen), len(TARGET_FORMS['nodes']), len(PENDING)))",
 "    len(seen), len(TARGET_FORMS['nodes']), len(PENDING)))\nprint('devices.json: %d cells (%s)' % (\n    len(CELLS), ', '.join('%s %d' % (s, sum(1 for c in CELLS if c[1] == s)) for s in ('cell', 'tried-not-closed', 'closed'))))")
src2 = src2.replace("          'Generated by curated/mk_devices.py; edit that file.',",
 "          'Generated by curated/mk_devices.py; edit that file. Key \"cells\": read classes (silent cells) of the refereed '\n          'checkpoint; they are not devices (round-17 planner decision) and carry no device weight in generate.py.',")
open(P, 'w', encoding='utf-8').write(src2)
print('edited', P)
