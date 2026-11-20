"""post3.py -- summary statistic for drop3: R = rms of z(X) over the grid points with X >= 3e4 (7 points, strongly correlated),
with a null distribution from 60 random-phase series per window (support: all nodes)."""
import sys, json, math
import numpy as np
D = 'tmp/research-2026-11-16/push/e2-theta-dual-mseries-fe/'
sys.path.insert(0, D); sys.path.insert(0, 'tmp/sextic')
import drop3, alib as A
r = json.load(open(D + 'drop3.json')); g = np.array(r['grid']); top = g >= 3e4
T = A.SFTable('tmp/sextic/data/sf_1e7.npz')
N = T.N.astype(float); lnN = np.log(N); rt = N ** -0.5
rng = np.random.default_rng(99); null = {}
for key in [(3, 0, 1), (3, 1, 0), (6, 0, 1), (6, 1, 0), (6, 2, 0)]:
    lx, V = drop3.window(*key)
    W = np.array([np.interp(lnN - math.log(X), lx, V, left=0.0, right=0.0) * rt for X in g[top]])     # 7 x n
    sig = np.sqrt((W * W).sum(axis=1))
    Rs = []
    for k in range(60):
        a = np.exp(2j * np.pi * rng.random(T.n))
        Rs.append(float(np.sqrt(np.mean((np.abs(W @ a) / sig) ** 2))))
    Rs = np.sort(Rs); null[key] = Rs
    print(f"null window n={key[0]} |l|={key[1]} kill={key[2]}: R quantiles 2%/10%/50%/90% = {Rs[1]:.3f} {Rs[6]:.3f} {Rs[30]:.3f} {Rs[54]:.3f}; min {Rs[0]:.3f}")
def key_of(name):
    if name.startswith('cub l=0'): return (3, 0, 1)
    if name.startswith('cub'): return (3, 1, 0)
    if name.startswith('sex l=0'): return (6, 0, 1)
    if 'l=+1' in name or 'l=-1' in name: return (6, 1, 0)
    return (6, 2, 0)
out = {}
for name, row in r['rows'].items():
    if name.startswith('rnd') or 'win' in name: continue
    F = np.array([complex(a, b) for a, b in row['F']]); z = np.abs(F) / np.array(row['sig'])
    R = float(np.sqrt(np.mean(z[top] ** 2))); k = key_of(name); frac = float((null[k] <= R).mean())
    # onset: first grid X after which z stays below 0.2
    below = z < 0.2; on = None
    for i in range(len(g)):
        if below[i:].all(): on = float(g[i]); break
    out[name] = {'R': R, 'null_frac_below': frac, 'onset': on}
    print(f"{name:24s} R = {R:.3f}   fraction of null draws with smaller R: {frac:.3f}   onset(z<0.2 from X on): {on if on is None else round(on)}")
json.dump({'null': {str(k): v.tolist() for k, v in null.items()}, 'rows': out}, open(D + 'post3.json', 'w'))
