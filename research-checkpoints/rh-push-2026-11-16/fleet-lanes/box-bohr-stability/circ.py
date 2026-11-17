"""Per-variable Lee-Yang circle property (float64, numpy roots; MEASURED).
M(u, w) = u D(w) + u^{-1} D(1/w) on the torus |u| = |w_p| = 1 (real coefficients).  For each variable q:
fraction of random torus points (u, w_{p != q}) at which ALL zeros of w_q -> M lie on |w_q| = 1.
(The zeros in u are always on |u| = 1: u^2 = -D(1/w)/D(w), and |D(1/w)| = |D(w)| on the torus.)
Prediction for a product with K = 1:  fraction = P(|cos beta| <= a_q), a_q = eps_q q^{-1/2}, beta uniform
= 1 - (2/pi) arccos(a_q)."""
import math, json, sys
import numpy as np
import bl
rng = np.random.default_rng(3)
out = {}
def run(name, poly, ns=3000):
    c, Lg, V, ps = poly
    cc = c * np.exp(-0.5 * Lg)
    res = {}
    for j, q in enumerate(ps):
        deg = int(V[:, j].max()); ok = 0
        for _ in range(ns):
            th = rng.uniform(0, 2 * math.pi, len(ps)); u = np.exp(1j * rng.uniform(0, 2 * math.pi))
            oth = cc * np.exp(-1j * (np.delete(V, j, 1) @ np.delete(th, j)))
            co = np.zeros(2 * deg + 1, complex)      # coefficients of w^{k+deg}
            for t, k in zip(oth, V[:, j].astype(int)):
                co[deg + k] += u * t                 # u * c * w^k
                co[deg - k] += np.conj(t) / u        # u^-1 * conj(other part) * w^-k
            r = np.roots(co[::-1])
            ok += bool(len(r) == 2 * deg and np.all(np.abs(np.abs(r) - 1) < 1e-6))
        res[q] = ok / ns
    out[name] = res
    print(name, res, flush=True)
for inp in ('zeta', 'tw2m', 'tw2h', 'dh'):
    for P in (3, 7, 13):
        run(f'euler|{inp}|P{P}|K1', bl.euler_poly(inp, P, 1))
    for N in (2, 3, 6, 10, 20):
        run(f'afe|{inp}|N{N}', bl.afe_poly(inp, N))
print('prediction K=1 product: ', {p: round(1 - 2 / math.pi * math.acos(p ** -0.5), 4) for p in (2, 3, 5, 7, 11, 13)})
json.dump(out, open('results/circ.json', 'w'), indent=1)
