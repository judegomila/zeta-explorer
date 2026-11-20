"""check_sym.py : symmetry tests of the production rows S_6 (no independent recomputation exists at lam = 10).
(1) one, mu: invariant under T -> T + s, so R(m(T + s)) = R(m) exactly (49 rows -> 7 translation orbits of size 7).
(2) one, mu, a: under T -> cT (c^3 = 1 for a; any c for one, mu) the row changes by a root of unity, so |R|^2 is constant on scaling orbits.
(3) ru1 (no symmetry): the same comparisons must fail."""
import json
from ffpy import FF, norm
q = 7; F = FF(q)
def idx(b, c): return c + q*b          # m = T^2 + b T + c, index = c + q b
def tr(i, s): c, b = i % q, i // q; return idx((b + 2*s) % q, (c + b*s + s*s) % q)
def sc(i, w): c, b = i % q, i // q; iw = pow(w, q - 2, q); return idx(b*iw % q, c*iw*iw % q)   # m(wT)/w^2
for lam in (9, 10):
    J = json.load(open(f'results_srv/rows_lam{lam}.json'))['vectors']
    for name in ('one', 'mu', 'a', 'b', 'cm1', 'ru1'):
        R = [(int(a), int(b)) for a, b in J[name]['S6']]
        t = sum(1 for i in range(49) for s in range(1, 7) if R[tr(i, s)] == R[i]); n3 = sum(1 for i in range(49) for w in (2, 4) if norm(R[sc(i, w)]) == norm(R[i]))
        na = sum(1 for i in range(49) for w in range(2, 7) if norm(R[sc(i, w)]) == norm(R[i]))
        print(f"(6, {lam}, 2) {name}: rows equal under translation {t} of 294; norms equal under T -> wT, w^3 = 1: {n3} of 98; under all scalings: {na} of 245; row at m = T^2: {R[0]}")
