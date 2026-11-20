#!/usr/bin/env python3
"""supp.py -- supplementary laws: s -> chi_s(eps) for eps in {-1, w, 2, lambda}, s primary prime to 6.
Finds which residue data of s each depends on. Exact (integer modular arithmetic)."""
import sys, itertools, json
sys.path.insert(0, 'tmp/sextic')
import zomega as Z
pr = Z.sieve(4000)
primes = []
for p in pr:
    p = int(p)
    if p in (2, 3): continue
    if p % 3 == 1:
        pi = Z.split_primary(p)
        for q in (pi, Z.conj(pi)):
            assert Z.is_primary(q); primes.append(Z.PrimeO(q, p, False))
    elif p < 64:
        primes.append(Z.PrimeO((-p, 0), p, True))
gens = {'-1': (-1, 0), 'w': (0, 1), '2': (2, 0), 'lam': Z.LAM}
def key(P, mods):
    a, b = P.pi
    return tuple((a % m, b % m) for m in mods)
print("primes", len(primes))
for name, g in gens.items():
    for mods in [(4,), (9,), (4, 9), (8,), (8, 9), (4, 27), (8, 27)]:
        tab = {}; ok = True
        for P in primes:
            k = key(P, mods); v = P.chi(g)
            if tab.setdefault(k, v) != v: ok = False; break
        if ok:
            print(f"chi_s({name}) is a function of s mod {mods}; classes seen {len(tab)}"); break
    else:
        print(f"chi_s({name}): no dependence found")
# table by mod4 index and mod9 index
tab = {}
for P in primes:
    k = (Z.mod4_index(P.pi), (P.pi[0] % 8, P.pi[1] % 8), Z.mod9_index(P.pi))
    v = tuple(P.chi(g) for g in gens.values())
    assert tab.setdefault(k, v) == v
print("classes (m4, m8, m9) seen:", len(tab))
# which combos eps = (-1)^i w^j 2^a lam^b (exponents mod 6) have chi_s(eps) independent of s mod 9
E0 = []
for i, j, a, b in itertools.product(range(2), range(3), range(6), range(6)):
    good = True; val = {}
    for (m4, m8, m9), v in tab.items():
        e = (i * v[0] + j * v[1] + a * v[2] + b * v[3]) % 6
        if val.setdefault(m4, e) != e: good = False; break
    if good: E0.append((i, j, a, b, [val[k] for k in range(12)]))
print("E0 (i,j,a,b) with chi_s((-1)^i w^j 2^a lam^b) depending on s mod 4 only:", len(E0))
for t in E0: print("  ", t)
json.dump({'E0': E0}, open('supp.json', 'w'))
# R(a,a) chi_a(-1) = 1 ?
bad = 0
for P in primes:
    r = Z.Rrec(P.pi, P.pi); c = P.chi((-1, 0))
    if r * (1 if c == 0 else -1) != 1: bad += 1
    assert c in (0, 3)
print("R(p,p) chi_p(-1) = 1 failures:", bad, "of", len(primes))
print("MOD4_REPS", Z.MOD4_REPS)
