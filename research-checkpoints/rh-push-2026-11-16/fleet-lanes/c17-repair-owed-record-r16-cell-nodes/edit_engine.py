#!/usr/bin/env python3
"""One-off edits of engine/build_graph.py, engine/generate.py and engine/curated/mk_devices.py (print line) by lane
c17-repair-owed-record-r16-cell-nodes: node type 'cell'. Each replacement must match exactly once."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
def edit(path, reps):
    s = open(path, encoding='utf-8').read()
    for a, b in reps:
        assert s.count(a) == 1, (path, s.count(a), a[:90])
        s = s.replace(a, b)
    open(path, 'w', encoding='utf-8').write(s)
    print('edited', path, len(reps))

edit(os.path.join(ENG, 'curated', 'mk_devices.py'), [
 ("    len(seen), len(TARGET_FORMS['nodes']), len(PENDING)))\nprint(",
  "    sum(len(d['nodes']) for d in out['devices']), len(TARGET_FORMS['nodes']), len(PENDING)))\nprint("),
])

edit(os.path.join(ENG, 'build_graph.py'), [
 ("ROW_ID_RE = re.compile(r'\\b([PGQSZFTLNA]\\d{1,2})\\b')",
  "# ---- curated cells (c17-repair-owed-record-r16-cell-nodes; planner decision of round 17): read classes on which the\n"
  "# record is silent. Key 'cells' of curated/devices.json. A cell node is NOT a device: it gets n['cell'] and the role\n"
  "# 'cell', never n['device'] or the role 'device'. States: cell / tried-not-closed / closed.\n"
  "def load_cells():\n"
  "    path = os.path.join(HERE, 'curated', 'devices.json')\n"
  "    out = {}\n"
  "    if os.path.exists(path):\n"
  "        for d in json.load(open(path, encoding='utf-8')).get('cells', []):\n"
  "            for nid in d['nodes']:\n"
  "                out[nid] = dict(type=d['id'], state=d['state'], evidence=d.get('evidence', ''))\n"
  "    return out\n\n\n"
  "ROW_ID_RE = re.compile(r'\\b([PGQSZFTLNA]\\d{1,2})\\b')"),
 ("    devices = load_devices()\n    crossing_keyword = 0\n",
  "    devices = load_devices()\n    cells = load_cells()\n"
  "    assert not set(devices) & set(cells), 'a node is both a device and a cell'\n    crossing_keyword = 0\n"),
 ("        if n['id'] in devices:\n            n['device'] = devices[n['id']]\n",
  "        if n['id'] in devices:\n            n['device'] = devices[n['id']]\n"
  "        if n['id'] in cells:\n            n['cell'] = cells[n['id']]\n"),
 ("            if n['id'] in devices:\n                roles.append('device')\n",
  "            if n['id'] in devices:\n                roles.append('device')\n"
  "            # c17-repair: a cell is a read class, scored by generate.py as a tagged node (no device role)\n"
  "            if n['id'] in cells:\n                roles.append('cell')\n"),
 ("                    crossingKeyword=crossing_keyword),",
  "                    cells=dict(Counter(n['cell']['state'] for n in nodes if n.get('cell'))),\n"
  "                    crossingKeyword=crossing_keyword),"),
])

edit(os.path.join(ENG, 'generate.py'), [
 ("Run:  python3 generate.py --top 40",
  "Rule changed by lane c17-repair-owed-record-r16-cell-nodes (campaign round 17; planner decision in ROUND_LOG.md,\n"
  "'Round 17 allocation'; previous file scratch/generate.pre-c17-repair.py):\n"
  "  cell       the eleven silent-* nodes are read classes, not crossing devices. They come from the key 'cells' of\n"
  "             curated/devices.json through build_graph.py (node field 'cell', role 'cell', states cell /\n"
  "             tried-not-closed / closed). A cell node is scored as any tagged node: it is not in the device pool, it\n"
  "             carries no device weight, it does not satisfy the R4-device rule, and none of the open-device\n"
  "             exemptions (family match by device text, reuse penalty, flow-side and mean-value majority penalties,\n"
  "             per-device cap) applies to it. A candidate with a closed cell node is rejected. A candidate with a cell\n"
  "             node lists it under 'cells' with a note; meta.r4Rules reports topWithCell.\n\n"
  "Run:  python3 generate.py --top 40"),
 ("    def is_target_blind(i):",
  "    def cell_state(i):\n"
  "        \"\"\"'cell', 'tried-not-closed', 'closed' or None: state of the curated read class (key 'cells' of\n"
  "        curated/devices.json). A cell is not a device: device_kind() is None for it.\"\"\"\n"
  "        d = node[i].get('cell')\n"
  "        return d['state'] if d else None\n\n"
  "    def is_target_blind(i):"),
 ("            # (a) requirement R4: at least one member is an open or floored device of the curated list\n",
  "            # (a00) c17-repair: a member is a read class closed by a refereed lane (key 'cells' of curated/devices.json)\n"
  "            closed_cell = [i for i in mid if cell_state(i) == 'closed']\n"
  "            if closed_cell:\n"
  "                independent['closed cell'] += 1\n"
  "                rej('contains a closed cell: ' + node[closed_cell[0]]['cell']['type'], c)\n"
  "                continue\n"
  "            # (a) requirement R4: at least one member is an open or floored device of the curated list\n"),
 ("        # penalties\n        pen = 0\n",
  "        # c17-repair: cell members are listed, with their state; they change no score part\n"
  "        cell_m = [(i, cell_state(i)) for i in mid if cell_state(i)]\n"
  "        for i, st in cell_m:\n"
  "            notes.append('member ' + i + ' is a read class (cell, state ' + st + '), not a crossing device: it '\n"
  "                         'names where the record is silent and carries no evidence')\n"
  "        # penalties\n        pen = 0\n"),
 ("            r4Devices=[dict(id=i, kind=k, type=node[i]['device']['type']) for i, k in dev],\n",
  "            r4Devices=[dict(id=i, kind=k, type=node[i]['device']['type']) for i, k in dev],\n"
  "            cells=[dict(id=i, state=st, type=node[i]['cell']['type']) for i, st in cell_m],\n"),
 ("                               topWithDevice=sum(1 for s in top if s['r4Devices']),\n",
  "                               topWithDevice=sum(1 for s in top if s['r4Devices']),\n"
  "                               cellNodesLive={st: sorted(i for i in DECL if cell_state(i) == st)\n"
  "                                              for st in ('cell', 'tried-not-closed', 'closed')},\n"
  "                               topWithCell=sum(1 for s in top if s['cells']),\n"),
])
