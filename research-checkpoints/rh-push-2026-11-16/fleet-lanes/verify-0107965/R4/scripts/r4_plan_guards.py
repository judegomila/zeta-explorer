"""R4: own exact check (stdlib Fractions) that every plan row/node satisfies the row guard (52) of Prop 3.2. Reads JSON only."""
import sys, json
from fractions import Fraction as F
plan = json.load(open(sys.argv[1]))
th = F(19,125); ell = F(2689,100); n = 0; minq = None; hs = set(); vmax = F(0); tmin = None
for row in plan['rows']:
    lo, hi = map(F, row['time'])
    assert 0 <= lo < hi <= th, row['row']
    for nd in row['nodes']:
        h, v = F(nd['height']), F(nd['shift'])
        assert h - F(1,100) >= 0 and h + F(1,100) <= F(601,100) and abs(v) <= F(39,20), (row['row'], nd)
        q = (1 + h - F(1,100))/2 + lo*ell/8
        assert q > F(5,4), (row['row'], nd, q)
        minq = q if minq is None else min(minq, q); hs.add(h); vmax = max(vmax, abs(v)); n += 1
print("rows", len(plan['rows']), "nodes", n, "min guard q =", float(minq), "(needs > 1.25)  heights min/max", float(min(hs)), float(max(hs)), " max|v|", float(vmax))
