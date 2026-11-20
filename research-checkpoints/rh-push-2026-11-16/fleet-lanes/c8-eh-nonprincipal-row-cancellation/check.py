"""check.py: unit checks of dual.py that do not go through the block totals.
(1) factor(): product of the listed primes reproduces the polynomial. (2) phase(): chi_c(y) against chi_0(Res(c, y)) computed
from the definition Res(c, y) = prod over roots of c ... evaluated by the Euclidean resultant in pure Python. (3) row labels:
the label of y is unchanged when y is multiplied by a sixth power. (4) weights: 'a' against a direct Legendre-type evaluation;
mu against factor(). q = 7, degrees <= 4. Planned memory < 200 MB."""
import random, numpy as np
from dual import *
q = 7; ff = FF(q, 4); rnd = random.Random(5)
def pmul(a, b):
    out = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b): out[i + j] = (out[i + j] + x * y) % q
    return out
def deg(a):
    d = len(a) - 1
    while d >= 0 and a[d] % q == 0: d -= 1
    return d
def res(a, b):
    a = [x % q for x in a]; b = [x % q for x in b]; da, db = deg(a), deg(b); r = 1
    if da < 0 or db < 0: return 0
    while True:
        if db < 0: return 0
        if da < db:
            a, b, da, db = b, a, db, da
            if da & db & 1: r = -r % q
        if db == 0: return r * pow(b[0], da, q) % q
        ib = pow(b[db], q - 2, q); a = a[:da + 1]
        for i in range(da, db - 1, -1):
            f = a[i] * ib % q
            for j in range(db + 1): a[i - db + j] = (a[i - db + j] - f * b[j]) % q
        dr = deg(a)
        if dr < 0: return 0
        if da & db & 1: r = -r % q
        r = r * pow(b[db], da - dr, q) % q
        a, b, da, db = b, a, db, dr
# (1)
bad = 0; n1 = 0
for n in range(1, 5):
    for idx in range(ff.PW[n]):
        f = ff.factor(n, idx); p = [1]
        for pid, v in f.items():
            for _ in range(v): p = pmul(p, ff.primes[pid][2])
        n1 += 1; bad += (p != ff.coeffs(n, idx))
        mu = 0 if any(v > 1 for v in f.values()) else (-1) ** len(f)
        bad += (mu != int(ff.mu[n][idx]))
print("(1) factor() and mu: polynomials", n1, "failures", bad)
# (2)
bad = 0; n2_ = 0
for _ in range(400):
    ny = rnd.randint(1, 4); y = rnd.randrange(ff.PW[ny]); n = rnd.randint(1, 4)
    fac = ff.factor(ny, y); ph = ff.phase(n, fac); yc = ff.coeffs(ny, y)
    for c in rnd.sample(range(ff.PW[n]), min(40, ff.PW[n])):
        R = res(ff.coeffs(n, c), yc); want = 6 if R == 0 else int(ff.L6[R]); n2_ += 1; bad += (int(ph[c]) != want)
print("(2) chi_c(y) = chi_0(Res(c, y)): pairs", n2_, "failures", bad)
# (3)
bad = 0
for _ in range(300):
    ny = rnd.randint(1, 3); y = rnd.randrange(ff.PW[ny]); fac = ff.factor(ny, y)
    lab = tuple(sorted((p, v % 6) for p, v in fac.items() if v % 6))
    p = rnd.randrange(len(ff.primes)); fac2 = dict(fac); fac2[p] = fac2.get(p, 0) + 6
    lab2 = tuple(sorted((p_, v % 6) for p_, v in fac2.items() if v % 6)); bad += (lab != lab2)
print("(3) row label invariant under sixth powers: cases 300 failures", bad)
# (4)
bad = 0; cnt = 0
F = [2, 0, 0, 1]
for n in range(1, 5):
    w = base_weight(ff, 'a', n)
    for c in range(ff.PW[n]):
        R = res(F, ff.coeffs(n, c)); want = 0 if R == 0 else (1 if int(ff.L6[R]) % 2 == 0 else -1); cnt += 1; bad += (int(w[c]) != want)
print("(4) weight a = chi_0^3(Res(T^3 + 2, A)): polynomials", cnt, "failures", bad)
