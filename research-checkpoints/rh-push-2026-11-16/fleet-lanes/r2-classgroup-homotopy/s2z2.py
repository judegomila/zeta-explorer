from stage2 import *
import json
out = {}
for T in (20.01, 100.01, 200.01, 264.01, 1000.01, 2000.01):
    N, npc = count(T, 'Z2', arb(1), arb(-1), 1, True); print(T, '3pi/4 (Z2)', N.str(12), npc, flush=True)
    out['%s|3pi/4 (Z2)' % T] = float(N.mid())
json.dump(out, open('stage2_counts_z2fix.json', 'w'), indent=1)
