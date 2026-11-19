"""Control: scoreboard.py parses every line of lanes.jsonl after the engine rerun. Writes nothing in campaign/."""
import sys, json, os
C = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'campaign')
sys.path.insert(0, C)
import scoreboard as sb
raw = [l for l in open(os.path.join(C, 'lanes.jsonl'), encoding='utf-8') if l.strip()]
bad = 0
for k, l in enumerate(raw):
    try: json.loads(l)
    except Exception as e: bad += 1; print('bad line', k+1, e)
lanes, unparsed = sb.load_lanes()
print('non-empty lines %d, json-bad %d, lanes parsed by scoreboard.load_lanes %d, unparsed %d' % (len(raw), bad, len(lanes), unparsed))
assert len(lanes) == len(raw) and unparsed == 0 and bad == 0
g = sb.load_graph(); nodes, src = g[0], g[1]
A, D = sb.part_AD(lanes); c = sb.part_C(nodes, src, lanes); h = sb.history(lanes)
print('part A headline:', A.get('headline'))
print('part D:', {k: v for k, v in D.items() if not isinstance(v, (list, dict))})
print('part C:', {k: v for k, v in c.items() if not isinstance(v, (list, dict))})
print('history rounds:', len(h), '(nothing written; scoreboard.json and SCOREBOARD.md untouched)')
