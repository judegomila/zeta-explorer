"""Combination 4, dependence on neighbours: v_exit, v_coll of zero k recomputed from the polynomial with the K nearest zeros
on each side (polynomial heat, exact) and compared with the values from the full function (jets).
Usage: c4_local.py FULL.jsonl LIST.npz stride"""
import sys, json, math, numpy as np
import chan as C
from flint import arb
C.setprec(256, 100)
R = [json.loads(l) for l in open(sys.argv[1])]; R = [r for r in R if 'error' not in r and r.get('online') and r.get('c4_status') == 'ok' and 'v_exit_0.7' in r]
d = np.load(sys.argv[2]); on = np.sort(d['on']); offx = d['offx']; offg = d['offg']
R = [r for r in R if ('trunc' not in r or (r['trunc'][0] and abs(r['trunc'][0] - r['v_coll']) < 1e-6 * r['v_coll']))][::int(sys.argv[3])]
print('zeros used', len(R))
for DRIFT, K in ((0, 1), (0, 2), (0, 4), (0, 8), (0, 16), (1, 1), (1, 2), (1, 4), (1, 8), (1, 16)):
    dr = []; dc = []; dx = []; nf = 0
    for r in R:
        k = int(np.argmin(np.abs(on - r['im'])))
        if k < K or k > len(on) - K - 1: continue
        roots = [complex(on[j] - on[k]) for j in range(k - K, k + K + 1) if j != k]
        if len(offg):
            for j in np.where(np.abs(offg - on[k]) < (on[k + K] - on[k - K]) / 2)[0]:
                roots += [complex(offg[j] - on[k], offx[j]), complex(offg[j] - on[k], -offx[j])]
        p = np.poly(roots + [0.0]).real[::-1]; p = p / p[1]
        if DRIFT:
            S1m = sum(1 / (0 - z) for z in roots).real; c = (-r['Qim'] / 2) - S1m
            e = [c ** m / math.factorial(m) for m in range(40)]; p = np.convolve(p, e); p = p / p[1]
        ev = C.c4_events([arb(float(c)) for c in p], r['g'], rexit=(0.7,), vcap=50 * r['g'] ** 2)
        if 'v_coll' not in ev or 'v_exit_0.7' not in ev: nf += 1; continue
        dc.append(ev['v_coll'] / r['v_coll']); dx.append(ev['v_exit_0.7'] / r['v_exit_0.7']); dr.append((ev['v_exit_0.7'] / ev['v_coll'], r['v_exit_0.7'] / r['v_coll']))
    dr = np.array(dr); dc = np.array(dc); dx = np.array(dx)
    print(('with drift term e^{ch}, ' if DRIFT else '') + 'K = %2d neighbours each side: %d zeros (no event in the model: %d) ; model/full v_coll median %.4f, quantiles 10/90%% %.4f %.4f ; v_exit median %.4f (%.4f %.4f) ; ratio: correlation %.4f, median |difference| %.4f' % (
        K, len(dr), nf, np.median(dc), *np.quantile(dc, (0.1, 0.9)), np.median(dx), *np.quantile(dx, (0.1, 0.9)), np.corrcoef(dr[:, 0], dr[:, 1])[0, 1], np.median(np.abs(dr[:, 0] - dr[:, 1]))))
