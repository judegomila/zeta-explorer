"""Inverse Lee-Yang test at fixed size: is a given Lee-Yang polynomial (unit-circle roots, positive coefficients)
the uniform-field partition polynomial of N unit Ising spins with ferromagnetic pair couplings on (a) an open chain,
(b) the complete graph?  a_ij = exp(-2 J_ij) in [0,1].  Least squares, multistart.  numpy/scipy, arrays < 1 MB."""
import numpy as np, itertools, json
from scipy.optimize import least_squares
rng = np.random.default_rng(11)

def poly_from_a(a, N):
    """coefficients c_k = sum over subsets A of size k of prod_{i in A, j not in A} a_ij"""
    c = np.zeros(N + 1)
    for mask in range(1 << N):
        ins = [i for i in range(N) if mask >> i & 1]; outs = [i for i in range(N) if not mask >> i & 1]
        wgt = 1.0
        for i in ins:
            for j in outs: wgt *= a[i, j]
        c[len(ins)] += wgt
    return c

def fit(target, N, graph, starts=60):
    pairs = [(i, i + 1) for i in range(N - 1)] if graph == "chain" else list(itertools.combinations(range(N), 2))
    half = N // 2
    def res(x):
        a = np.ones((N, N))
        for (i, j), v in zip(pairs, x): a[i, j] = a[j, i] = v
        c = poly_from_a(a, N)
        return (c[1:half + 1] - target[1:half + 1])
    best = np.inf
    for _ in range(starts):
        r = least_squares(res, rng.random(len(pairs)), bounds=(0, 1), xtol=1e-14, ftol=1e-14, gtol=1e-14)
        best = min(best, np.abs(r.fun).max())
        if best < 1e-10: break
    return best

def is_ly(c):
    r = np.roots(c[::-1]); return np.abs(np.abs(r) - 1).max() < 1e-7

OUT = {}
# 1. the near-degenerate family  w^6 + d w^5 + e w^4 + e w^3 + e w^2 + d w + 1
for e, d in [(0.3, 0.0), (0.3, 1e-3), (0.3, 1e-2), (0.3, 0.05), (0.3, 0.2)]:
    t = np.array([1, d, e, e, e, d, 1.0])
    row = dict(e=e, d=d, lee_yang=bool(is_ly(t)), chain=float(fit(t, 6, "chain")), complete=float(fit(t, 6, "complete")))
    OUT[f"family_e{e}_d{d}"] = row; print(json.dumps(row), flush=True)
# 2. random Lee-Yang polynomials with positive coefficients, N = 4, 5, 6
for N in [4, 5, 6]:
    fails_chain = fails_complete = tested = 0; worst = 0.0
    while tested < 40:
        th = rng.uniform(0, np.pi, N // 2)
        p = np.array([1.0])
        for x in th: p = np.convolve(p, [1, -2 * np.cos(x), 1])
        if N % 2: p = np.convolve(p, [1, 1])
        if p.min() <= 1e-3: continue
        tested += 1
        rc = fit(p, N, "chain", starts=25)
        if rc > 1e-8:
            fails_chain += 1
            rk = fit(p, N, "complete", starts=25)
            if rk > 1e-8: fails_complete += 1; worst = max(worst, rk)
    row = dict(N=N, tested=tested, not_chain=fails_chain, not_complete_graph=fails_complete, worst_residual_complete=worst)
    OUT[f"random_N{N}"] = row; print(json.dumps(row), flush=True)
json.dump(OUT, open("inverse_ly.json", "w"), indent=1)
