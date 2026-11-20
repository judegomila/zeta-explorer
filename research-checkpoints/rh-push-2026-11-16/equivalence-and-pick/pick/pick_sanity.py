"""Non-rigorous sanity: LDL pivots of k-node Pick matrices of the actual L
(computed from xi via Arb, midpoints at 300 bits) on random node sets."""
import sys, random
sys.path.insert(0, '.')
from xi_series import L_of_x
import mpmath as mp
mp.mp.dps = 80
random.seed(20261116)
def pivots(xs):
    Ls = [mp.mpf(L_of_x(x, prec=400).mid().str(70, radius=False)) for x in xs]
    xs = [mp.mpf(x) for x in xs]
    k = len(xs)
    P = mp.matrix(k, k)
    for i in range(k):
        for j in range(k):
            P[i, j] = (Ls[i] + Ls[j]) / (xs[i] + xs[j])
    piv = []
    for c in range(k):
        p = P[c, c]; piv.append(p)
        for i in range(c + 1, k):
            f = P[i, c] / p
            for j in range(c + 1, k):
                P[i, j] -= f * P[c, j]
    return piv
worst = {}
for k in (7, 8):
    w = mp.inf
    for trial in range(120):
        mode = trial % 4
        if mode == 0: xs = [10 ** random.uniform(-2, 3) for _ in range(k)]
        elif mode == 1:
            c = 10 ** random.uniform(-1, 2.5); xs = [c * (1 + 0.05 * random.random()) for _ in range(k)]
        elif mode == 2: xs = [random.uniform(0.01, 30) for _ in range(k)]
        else: xs = [10 ** random.uniform(1, 6) for _ in range(k)]
        xs = sorted(set(round(x, 12) for x in xs))
        if len(xs) < k: continue
        pv = pivots([mp.mpf(str(x)) for x in xs])
        r = min(pv) / max(pv)
        if r <= 0: print("NONPOSITIVE PIVOT", k, xs, pv)
        w = min(w, r)
    print(k, "min pivot ratio", mp.nstr(w, 4))
