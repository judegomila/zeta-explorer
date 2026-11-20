"""Adversarial search over real node sets for the decoupling constant: maximise eps = max_t ||C^-1 R(1/2, t) C^-T||_F
(S_out = C C^T) over K-node sets, by random restarts + coordinate moves in log-node space.  Screen only (the reported
values are Arb upper bounds at the node sets found; the supremum over all node sets is not certified).
usage: nodesearch.py T K nstarts nworkers"""
import sys, json, random, math
from multiprocessing import Pool
from flint import arb, acb, ctx
import pickdec as pd
def eps_of(T, K, logx, prec=4000, W=35, tpts=(-35, -25, -15, -5, 5, 15, 25, 35)):
    ctx.prec = prec
    xs = [arb(math.exp(v)) for v in sorted(logx)]
    if min(b - a for a, b in zip(sorted(logx), sorted(logx)[1:])) < 1e-3: return -1.0
    zs = eps_of.z.setdefault((T, W), pd.window_zeros(T, W)[0])
    Lt = [pd.Ltrue(x) for x in xs]; Lw = [sum((pd.Lon(x, g) for g in zs), arb(0)) for x in xs]
    So = pd.pick([a - b for a, b in zip(Lt, Lw)], xs); Co, _ = pd.chol(So)
    if Co is None: return float('nan')
    e = 0.0
    for dt in tpts:
        D = pd.pick([pd.Lq(x, arb(1)/2, arb(T) + dt) - 2*pd.Lon(x, arb(T) + dt) for x in xs], xs)
        f, _ = pd.relF(Co, D)
        if not f.is_finite(): return float('nan')
        e = max(e, float(f.upper()))
    return e
eps_of.z = {}
def climb(a):
    T, K, seed = a; rng = random.Random(seed)
    lo, hi = math.log(0.02), math.log(5*T)
    x = sorted(rng.uniform(lo, hi) for _ in range(K)) if seed % 3 else sorted(math.log(rng.uniform(0.05, 8)) for _ in range(K))
    best = eps_of(T, K, x); hist = [best]; step = 0.5
    for it in range(60):
        y = list(x); i = rng.randrange(K); y[i] = min(hi, max(lo, y[i] + rng.gauss(0, step)))
        e = eps_of(T, K, y)
        if e != e: return dict(T=T, K=K, seed=seed, status='NOT_PD_or_nonfinite', nodes=[math.exp(v) for v in sorted(y)], best_before=best)
        if e > best: best, x = e, sorted(y); 
        else: step = max(0.02, step*0.97)
    return dict(T=T, K=K, seed=seed, status='ok', eps=best, nodes=[math.exp(v) for v in x])
if __name__ == '__main__':
    T = int(float(sys.argv[1])); K = int(sys.argv[2]); ns = int(sys.argv[3])
    with Pool(int(sys.argv[4])) as p:
        res = []
        for r in p.imap_unordered(climb, [(T, K, s) for s in range(ns)]):
            print(json.dumps(r), flush=True); res.append(r)
    ok = [r for r in res if r['status'] == 'ok']
    print('SUMMARY', json.dumps(dict(T=T, K=K, starts=ns, not_pd=len(res)-len(ok), eps_max=max(r['eps'] for r in ok) if ok else None)))
