"""FK cone K_n = cone{ prod_i (1 + w^{k_i}) : k a partition of n }. Theorem B: every lattice law of a zero-field pair ferromagnet
(any graph, hidden spins allowed) of degree n lies in K_n. For n = 5..9: search for a Lee-Yang polynomial with rational
coefficients outside K_n (float LP = screen) and verify an exact rational separating functional y (y.g <= 0 on every generator,
y.P > 0) with sympy rationals. Sizes: at most 30 generators x 5 coordinates."""
import numpy as np, itertools, json
from fractions import Fraction as Fr
from scipy.optimize import linprog
import sympy as sp
rng = np.random.default_rng(2)
def partitions(n, m=None):
    m = n if m is None else m
    if n == 0: yield (); return
    for k in range(min(n, m), 0, -1):
        for rest in partitions(n - k, k): yield (k,) + rest
def pmul(p, q):
    r = [0] * (len(p) + len(q) - 1)
    for i, x in enumerate(p):
        for j, y in enumerate(q): r[i + j] += x * y
    return r
def gen(part):
    p = [1]
    for k in part: p = pmul(p, [1] + [0] * (k - 1) + [1])
    return p
out = {}
for n in range(4, 10):
    h = n // 2; parts = list(partitions(n)); G = np.array([gen(p)[:h + 1] for p in parts], dtype=float); Gi = [gen(p)[:h + 1] for p in parts]
    best = None
    for trial in range(6000):
        r = n // 2; cs = [Fr(int(rng.integers(-12, 13)), 12) for _ in range(r)]
        P = [Fr(1)]
        for c in cs: P = pmul(P, [Fr(1), -2 * c, Fr(1)])
        if n % 2: P = pmul(P, [Fr(1), Fr(1)])
        if min(P) < 0: continue
        Pv = np.array([float(x) for x in P[:h + 1]])
        lp = linprog(-Pv, A_ub=G, b_ub=np.zeros(len(parts)), bounds=[(-1, 1)] * (h + 1))
        if lp.status == 0 and -lp.fun > 1e-7 and (best is None or -lp.fun / np.abs(Pv).sum() > best[0]):
            best = (-lp.fun / np.abs(Pv).sum(), cs, P, lp.x)
    if best is None:
        print(f"n={n}: {len(parts)} generators; no Lee-Yang polynomial outside K_n found in 6000 samples (float LP)"); out[n] = dict(generators=len(parts), outside_found=False); continue
    _, cs, P, y = best
    act = [i for i in range(len(parts)) if abs(G[i] @ y) < 1e-8]
    ns = sp.Matrix([Gi[i] for i in act]).nullspace() if act else []
    ok = False; yex = None
    if len(ns) == 1:
        v = ns[0]; v = v * sp.ilcm(*[sp.Rational(t).q for t in v])
        for sgn in (1, -1):
            yy = [sgn * sp.Rational(t) for t in v]
            if all(sum(a * b for a, b in zip(yy, g)) <= 0 for g in Gi) and sum(a * sp.Rational(b.numerator, b.denominator) for a, b in zip(yy, P[:h + 1])) > 0:
                ok = True; yex = yy
    val = sum(a * sp.Rational(b.numerator, b.denominator) for a, b in zip(yex, P[:h + 1])) if ok else None
    print(f"n={n}: {len(parts)} generators; Lee-Yang polynomial with cosines {[str(c) for c in cs]}{' and factor (w+1)' if n%2 else ''}: coefficients {[str(x) for x in P]}")
    print(f"      exact separating functional y = {yex} on (c0..c{h}); max over generators <= 0: {ok}; y.P = {val}")
    out[n] = dict(generators=len(parts), outside_found=True, cosines=[str(c) for c in cs], coefficients=[str(x) for x in P], y=[str(t) for t in yex] if ok else None, exact_ok=ok, yP=str(val))
json.dump(out, open("fk_cone.json", "w"), indent=1)
