"""Test A2 (scale-free, small n): local optimisation of the cluster shape for the largest passing deepest offset.
Symmetric clusters: positions +-x_k, offsets relative to the deepest (central) one. Nelder-Mead on the shape;
for each shape the threshold in A is found by bisection with the rigorous test. Lower bounds for A*(n, c)."""
import json, math, os, sys, time
from multiprocessing import Pool
from scipy.optimize import minimize
from flint import ctx
import wil
HERE = os.path.dirname(os.path.abspath(__file__))
def build(n, par):
    """par: half = n//2 gaps (positive via abs) and half relative offsets in (0,1]; odd n has a centre pair."""
    half = n // 2
    gaps = [abs(g) + 1e-3 for g in par[:half]]
    rel = [min(1.0, abs(r) + 1e-3) for r in par[half:2 * half]]
    xs, ws = [], []
    if n % 2 == 1:
        xs.append(0.0); ws.append(1.0)
        pos = 0.0
    else:
        pos = -gaps[0] / 2
    for k in range(half):
        pos += gaps[k]
        w = rel[k] if (n % 2 == 1 or k > 0) else 1.0
        xs += [pos, -pos]; ws += [w, w]
    return xs, ws
def task(args):
    c, n = args
    ctx.prec = 512
    dev = wil.Device(1.0, None, c / 2); dev.X = None; dev.o_pts = []
    def thr(par):
        xs, ws = build(n, par)
        A, note = wil.threshold(lambda A: dev.test([(x, A * w) for x, w in zip(xs, ws)]), 0.02, 3.0 * n + 6.0, steps=16)
        return A if A is not None else 0.0
    half = n // 2
    best = (0.0, None)
    for kappa in (1.5, 2.0, 3.0):
        d = 2 * math.pi / kappa
        x0 = [d] * half + [math.cos(math.pi * ((k + 1) / (half + 1)) / 2) ** 2 for k in range(half)]
        res = minimize(lambda p: -thr(p), x0, method="Nelder-Mead", options=dict(maxfev=400 * max(1, half), xatol=1e-3, fatol=1e-3))
        if -res.fun > best[0]:
            best = (-res.fun, list(res.x))
    xs, ws = build(n, best[1])
    rec = dict(c=c, n=n, A=best[0], xs=xs, ws=ws)
    print(json.dumps(rec), flush=True)
    return rec
if __name__ == "__main__":
    tasks = [(c, n) for c in (1.0, 0.01) for n in (2, 3, 4, 5, 6, 8)]
    with Pool(int(os.environ.get("RH_WORKERS", "2"))) as pool:
        out = pool.map(task, tasks, chunksize=1)
    json.dump(out, open(os.path.join(HERE, "out_testA2.json"), "w"))
    print("done", flush=True)
