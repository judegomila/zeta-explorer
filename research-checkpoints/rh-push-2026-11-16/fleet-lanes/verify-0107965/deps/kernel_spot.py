"""Own float spot check (MEASURED; not a certificate) of the paper's kernel hypothesis in this project's Theorem C form:
R(d,y) = sum_i (w_i/2) [K_{h_i}(d - v_i, y) + K_{h_i}(d + v_i, y)] (symmetric nodes, paper sec 2.3) <= 4/(d^2+4y^2) on the boundary line b = y, for y^2 in (0, cap], plus the necessary
moment conditions sum w h <= 2, sum w <= 1/y. Jet rows (extra derivative terms) are evaluated without the overlay and flagged.
Usage: python3 -I kernel_spot.py <packet_workspace_dir> <sign: -1 means K_h(d+v,b), the paper's (31)>"""
import sys, json, math
from fractions import Fraction as F
SGN = int(sys.argv[2])
p = json.load(open(sys.argv[1] + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json'))
def K(h, d, b): return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)
worst = []; mom = []
ds = [i/50 for i in range(0, 3001)]
for r in p['rows']:
    nodes = [(float(F(n['height'])), float(F(n['shift'])), float(F(n['weight']))) for n in r['nodes']]
    cap = float(F(r['q_interval'][1]))
    swh = sum(w*h for h, v, w in nodes); sw = sum(w for h, v, w in nodes)
    mom.append((r['row'], swh, sw, 1/math.sqrt(cap)))
    best = None
    for k in range(1, 41):
        y = math.sqrt(cap*k/40)
        for sgn in (SGN,):
            for d in ds:
                R = sum(0.5*w*(K(h, d - v, y) + K(h, d + v, y)) for h, v, w in nodes)
                m = 4/(d*d+4*y*y) - R
                rel = m*(d*d+4*y*y)/4
                if best is None or rel < best[0]: best = (rel, d, y*y, sgn)
    worst.append((r['row'], r['mode'], bool(r.get('joint_jet_overlay'))) + best)
print('max sum w*h', max(m[1] for m in mom), 'min', min(m[1] for m in mom))
print('rows with sum w > 1/sqrt(cap):', [m[0] for m in mom if m[2] > m[3]])
bad = [w for w in worst if w[3] < 0]
print('SGN', SGN, 'rows with a negative relative margin on the grid:', [(w[0], w[2], round(w[3], 6), w[4]) for w in bad])
print('smallest relative margin, jet rows (overlay omitted):', min((w[3], w[0]) for w in worst if w[2]))
print('smallest relative margin over non-jet rows:', min((w[3], w[0]) for w in worst if not w[2]))
