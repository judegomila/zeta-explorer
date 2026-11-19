"""Own analysis (floats; MEASURED, not a certificate). Compares the paper's certified arc rates with
(a) the same-height-lattice class ceiling r_ceil(q) = (2 y L coth(yL) - 2)/q, y = sqrt q, L = log(X/4pi)/4,
(b) the project's F2 run (0.116091) at equal q.
Usage: python3 -I rate_compare.py <packet_workspace_dir> <F2 steps.jsonl.gz> <out.json>"""
import sys, json, gzip, math, bisect
from fractions import Fraction as F
ws, f2path, out = sys.argv[1:4]
X = 6000000185827
L = math.log(X/(4*math.pi))/4
def rceil(q):
    y = math.sqrt(q); z = y*L
    return (2*z/math.tanh(z) - 2)/q if z > 1e-6 else 2*L*L/3
print('planned: parse FLOW.json.gz (~150 MB text, est < 2 GB resident)', flush=True)
flow = json.load(gzip.open(ws + '/lambda_round16/ordinary_7_8_flow/full_flow/FLOW.json.gz', 'rt'))
arcs = flow['records']; n = len(arcs)
P = [(float(F(a['t'])), float(F(a['qin'])), float(F(a['rate'])), a['row'], float(F(a['source_lower'])), float(F(a['own_upper'])), float(F(a['dt']))) for a in arcs]
Tend = float(F(arcs[-1]['t']) + F(arcs[-1]['dt'])); qT = float(F(arcs[-1]['qout']))
del flow, arcs
f2 = []
with gzip.open(f2path, 'rt') as fh:
    for line in fh:
        # only the leading q and rate fields are needed; avoid parsing the huge outq fraction
        i = line.index('"rate": "') ; j = line.index('"', i+9)
        qi = line.index('"q": "'); qj = line.index('"', qi+6)
        f2.append((float(F(line[qi+6:qj])), float(F(line[i+9:j]))))
dt2 = 1/512000
f2q = [-q for q, c in f2]   # increasing
def f2_at(q):
    k = bisect.bisect_left(f2q, -q)
    k = min(max(k, 0), len(f2)-1)
    return f2[k][1], k*dt2
res = {'L': L, 'n_arcs': n, 'T': Tend, 'qT': qT, 'bound': Tend + qT/2, 'f2_steps': len(f2)}
res['ceiling_time_from_9_16'] = math.log(math.cosh(0.75*L))/L**2
# integrate the ceiling ODE q' = -2 - rceil(q) q numerically as a cross-check
q = 0.5625; t = 0.0; h = 1e-6
while q > 0:
    q -= (2 + rceil(q)*q)*h; t += h
res['ceiling_time_numeric'] = t
mx = max(P, key=lambda p: p[2]/rceil(p[1]))
res['max_rate_over_ceiling'] = {'ratio': mx[2]/rceil(mx[1]), 't': mx[0], 'q': mx[1], 'rate': mx[2], 'row': mx[3]}
res['n_arcs_rate_above_ceiling'] = sum(1 for p in P if p[2] > rceil(p[1]))
rows = {}
for p in P: rows.setdefault(p[3], []).append(p)
tab = []
for r in sorted(rows):
    a = rows[r][0]; b = rows[r][-1]
    c2, t2 = f2_at(a[1])
    tab.append({'row': r, 't0': a[0], 'q0': a[1], 'rate0': a[2], 'source0': a[4], 'own0': a[5], 'ceil0': rceil(a[1]), 'rate_over_ceil': a[2]/rceil(a[1]),
                'F2_rate_at_q0': c2, 'rate_over_F2': a[2]/c2, 'F2_time_at_q0': t2, 'time_lead': t2 - a[0]})
res['rows'] = tab
ratios = sorted(p[2]/f2_at(p[1])[0] for p in P[::20])
res['rate_over_F2_quantiles'] = {'min': ratios[0], 'q25': ratios[len(ratios)//4], 'median': ratios[len(ratios)//2], 'q75': ratios[3*len(ratios)//4], 'max': ratios[-1]}
rc = sorted(p[2]/rceil(p[1]) for p in P[::20])
res['rate_over_ceiling_quantiles'] = {'min': rc[0], 'median': rc[len(rc)//2], 'max': rc[-1]}
fc = sorted(c/rceil(q) for q, c in f2[::20] if q > 0)
res['F2_rate_over_ceiling_quantiles'] = {'min': fc[0], 'median': fc[len(fc)//2], 'max': fc[-1]}
res['F2_first_rate'] = f2[0][1]; res['paper_first_rate'] = P[0][2]; res['ceiling_first_rate'] = rceil(0.5625)
json.dump(res, open(out, 'w'), indent=1)
print(json.dumps({k: v for k, v in res.items() if k != 'rows'}, indent=1))
for r in tab[::4] + [tab[-1]]:
    print('row %2d t0 %.5f q0 %.6f rate %.3f src %.4f own %.4f ceil %.3f r/ceil %.3f F2rate %.3f r/F2 %.3f lead %.5f' % (r['row'], r['t0'], r['q0'], r['rate0'], r['source0'], r['own0'], r['ceil0'], r['rate_over_ceil'], r['F2_rate_at_q0'], r['rate_over_F2'], r['time_lead']))
