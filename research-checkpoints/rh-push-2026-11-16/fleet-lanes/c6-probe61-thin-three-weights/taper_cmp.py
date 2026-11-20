"""taper_cmp.py -- effect of the taper of V_G: runs with the taper on u in [3.5, 4] (tag G) against [5.5, 6] (tag U6)."""
import json, sys
from show import load
for Z in (1024, 2048, 4096, 8192, 16384):
    r = {}
    for tag in ('G', 'U6'):
        info, Na2, NA02, res = load(f'srv/out_{tag}_{Z}.txt'); s = json.load(open(f'srv/in_{tag}_{Z}.bin.side.json'))
        r[tag] = (res, s)
    line = [f"Z={Z:6d} nodes {r['G'][1]['nodes']} / {r['U6'][1]['nodes']}"]
    for w in (0, 1, 2, 3, 11):
        a, b = r['G'][0][w], r['U6'][0][w]
        Pa = complex(*r['G'][1]['P'][w]); Pb = complex(*r['U6'][1]['P'][w])
        line.append(f"{r['G'][1]['weights'][w]}: dI={abs(a['I'] - b['I']):.2e} dP={abs(Pa - Pb):.2e} d(I-P)={abs((a['I'] - Pa) - (b['I'] - Pb)):.2e} |I|={abs(b['I']):.4f} dNB2/NB2={abs(a['NB2'].sum() - b['NB2'].sum()) / b['NB2'].sum():.1e}")
    print("  ".join(line))
