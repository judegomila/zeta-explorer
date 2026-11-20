"""Size ladders: at which list size does a control separate from the zeta / L(chi) values?
For prefixes of each list (first n zeros): Hill small-gap exponent (s < 0.2, gaps normalised by the local mean gap, so no counting
function is used), adjacent-box correlation r1 (boxes of 200 mean spacings, local unfolding), on-line fraction.
Usage: extras.py OUT.json SPEC...   (SPEC as in zstats.py)"""
import sys, math, json, numpy as np
import zstats as Z
def hill(g, s0=0.2):
    sm = g[g < s0]
    if len(sm) < 5: return None
    k = len(sm) / float(np.sum(np.log(s0 / sm)))
    return [k, k / math.sqrt(len(sm)), int(len(sm))]
out = {}
for spec in sys.argv[2:]:
    L = Z.load(spec); t, x = L['t'], L['x']
    g = np.diff(x); u = g / Z.moving_mean(g, 2001); xl = np.concatenate([[0.0], np.cumsum(u)])
    rows = []
    sizes = [n for n in [300, 1000, 3000, 10000, 30000, 100000, 300000, 1000000, 3000000, 10000000] if n < len(u)] + [len(u)]
    for n in sizes:
        r1 = Z.r1stat(xl[:n + 1], Ls=(200,))
        rows.append(dict(n=n, t_max=float(t[n]), online_fraction=float(n / (x[n] - x[0])), hill=hill(u[:n]), n_gap_lt_0p05=int((u[:n] < 0.05).sum()), gue_lt_0p05=n * 1.0672e-4 * 1.0,
                         r1_L200=(r1[0]['r1_raw'] if r1 else None), r1_se=(r1[0]['se'] if r1 else None)))
    out[L['name']] = rows
    print(L['name'], ' | '.join('n=%d k=%s r1=%s' % (r['n'], ('%.2f+-%.2f' % tuple(r['hill'][:2])) if r['hill'] else 'NA', ('%.2f' % r['r1_L200']) if r['r1_L200'] is not None else 'NA') for r in rows), flush=True)
    json.dump(out, open(sys.argv[1], 'w'))
