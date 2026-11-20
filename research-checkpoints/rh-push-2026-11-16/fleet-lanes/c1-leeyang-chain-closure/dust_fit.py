"""Float screen (not a verdict). Is P0 (atoms +-5 mass 1, +-1 mass c, c = 5/4) approached by laws of sum lambda_i sigma_i of
pair ferromagnets with more spins and free weights lambda_i >= 0 ("dust")?  Least squares on the characteristic function at
64 points of [0, 2 pi], complete graph, multistart. Sanity target c = 1 (two clusters 3 and 2). Arrays: 2^11 x 55 float64 < 1 MB."""
import numpy as np, itertools, json, sys
from scipy.optimize import least_squares
rng = np.random.default_rng(5)
tg = np.linspace(0.05, 2 * np.pi, 64)
def target(c): return (np.cos(5 * tg) + c * np.cos(tg)) / (1 + c)
def make(N):
    sig = np.array(list(itertools.product([-1, 1], repeat=N - 1)), float); sig = np.hstack([np.ones((len(sig), 1)), sig])
    pr = list(itertools.combinations(range(N), 2))
    D = np.array([[sig[k, i] != sig[k, j] for (i, j) in pr] for k in range(len(sig))], float)  # cut indicator
    return sig, D, len(pr)
def model(x, sig, D, npair, N):
    lam = x[:N] ** 2; nlog = -np.exp(x[N:])  # log a_ij = -exp(x) <= 0
    lw = D @ nlog; p = np.exp(lw - lw.max()); p /= p.sum()
    S = sig @ lam
    return np.cos(np.outer(tg, S)) @ p
res = {}
for c in (1.0, 1.25):
    tgt = target(c)
    for N in (5, 6, 7, 8, 9, 10, 11):
        sig, D, npair = make(N); best = np.inf; bx = None
        nstart = 40 if N <= 9 else 16
        for st in range(nstart):
            lam0 = rng.dirichlet(np.ones(N) * rng.choice([0.3, 1, 3])) * rng.uniform(4, 7)
            x0 = np.concatenate([np.sqrt(lam0), rng.normal(0, 2, npair)])
            try:
                r = least_squares(lambda x: model(x, sig, D, npair, N) - tgt, x0, max_nfev=400)
            except Exception: continue
            rms = np.sqrt(np.mean(r.fun ** 2))
            if rms < best: best, bx = rms, r.x
        lam = np.sort(bx[:N] ** 2)[::-1]
        print(f"c={c} N={N}: best RMS residual of characteristic function = {best:.3e}  weights {np.round(lam, 3)}  total {lam.sum():.3f}"); sys.stdout.flush()
        res[f"c{c}_N{N}"] = dict(rms=float(best), weights=lam.tolist())
json.dump(res, open("dust_fit.json", "w"), indent=1)
