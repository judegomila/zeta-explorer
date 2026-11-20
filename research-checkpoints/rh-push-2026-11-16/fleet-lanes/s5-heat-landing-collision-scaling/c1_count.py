"""Combination 1, premise on zeta: number of real zeros of H_t in blocks covering gamma in [1000, GMAX] (z = 2 gamma up to X = 2 GMAX)
for t = 0 and the listed t > 0, against the Riemann-von Mangoldt count of the block.
H_t is represented by the Riemann-Siegel sum with the n-th term multiplied by exp(-(t/4) log n (log(T/2pi) - log n)) (the main terms of the
Polymath15 A + B approximation; sampler of lane s1-zero-flow-dynamics, copied to zgen/, validated there against the zero ODE).
Usage: c1_count.py GMAX OUT.json T1 T2 ..."""
import sys, os, math, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zgen'))
os.environ['RH_BACKEND'] = 'cpu'; os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
import numpy as np
from multiprocessing import Pool
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zgen'))
import zl
NW = int(os.environ.get('RH_WORKERS', '4'))
def blocks(Ta, Tmax, maxsamp=2e6):
    T = Ta; out = []
    while T < Tmax:
        L = math.log(T / (2 * math.pi)); h = 2 * math.pi / L / 4
        Tb = min(Tmax, int(min(T * 1.2, T + maxsamp * h)))
        out.append((T, Tb)); T = Tb
    return out
def work(a):
    Ta, Tb, ts = a
    L0 = math.log(Ta / (2 * math.pi)); row = dict(Ta=Ta, Tb=Tb)
    for t in ts:
        g, nh, bad, ex = zl.zeta_block(Ta, Tb, t * L0 ** 2 / (16 * math.pi ** 2), budget=2e7)
        s = np.diff(g) * math.log(0.5 * (Ta + Tb) / (2 * math.pi)) / (2 * math.pi)
        row['%g' % t] = dict(count=int(len(g)), hidden=int(nh), min_gap=float(s.min()), var_gap=float(s.var()), frac_below_0p1=float((s < 0.1).mean()))
        row['expected'] = ex
    return row
if __name__ == '__main__':
    gmax = int(float(sys.argv[1])); out = sys.argv[2]; ts = [0.0] + [float(v) for v in sys.argv[3:]]
    bl = [(a, b, ts) for a, b in blocks(1000, gmax)]
    zl.log('blocks', len(bl), 'workers', NW)
    with Pool(NW) as p: rows = p.map(work, bl[::-1], chunksize=1)[::-1]
    tot = {('%g' % t): sum(r['%g' % t]['count'] for r in rows) for t in ts}
    exp = sum(r['expected'] for r in rows)
    res = dict(gmax=gmax, X_z=2 * gmax, blocks=len(rows), expected_total=exp, totals=tot,
               max_abs_block_diff_vs_t0={('%g' % t): max(abs(r['%g' % t]['count'] - r['0']['count']) for r in rows) for t in ts[1:]},
               blocks_with_fewer_than_t0={('%g' % t): sum(r['%g' % t]['count'] < r['0']['count'] - 1 for r in rows) for t in ts[1:]},
               max_abs_block_diff_vs_expected={('%g' % t): max(abs(r['%g' % t]['count'] - r['expected']) for r in rows) for t in ts},
               min_gap={('%g' % t): min(r['%g' % t]['min_gap'] for r in rows) for t in ts}, rows=rows)
    json.dump(res, open(os.path.join('..', out), 'w'), indent=1)
    print(json.dumps({k: v for k, v in res.items() if k != 'rows'}, indent=1))
