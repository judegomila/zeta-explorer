"""check_L1.py -- brute-force check of Lemma L1 and L2 (RESULT.md section 2).
L1: gamma_2(c) = mu(c) alpha(c) G(c) conj(gamma_1(c)) on squarefree primary c, G = conj(chi_c(4)) gamma_3(c).
L2: for (m,c)=1: gamma_2(c) chi_c(m) = mu(c) alpha(c) G(c) conj(gt_1(m,c)),  gt_1(m,c) = N(c)^{-1/2} sum_d chi_c(d) e(md/c).
L3: for p | c (c squarefree) gt_1(p,c) = 0, so L2 holds for every m with both sides 0 when (m,c)>1.
Usage: python3 check_L1.py
"""
import sys, os, math, random, itertools
import numpy as np
sys.path.insert(0, 'tmp/sextic')
import zomega as Z
random.seed(7)
ps = [p for p in Z.sieve(80) if p % 6 == 1]
primes = [Z.PrimeO(Z.split_primary(int(p)), int(p), False) for p in ps]
primes += [Z.PrimeO((-5, 0), 5, True)]
e1 = e2 = 0.0; e3min = 0.0; n = 0
combos = [c for r in (1, 2, 3) for c in itertools.combinations(primes, r)]
for fs in combos:
    c = (1, 0)
    for P in fs: c = Z.mul(c, P.pi)
    if Z.norm(c) > 9000: continue
    assert Z.is_primary(c)
    facs = list(fs)
    g = {j: Z.gauss_brute(c, facs, j) for j in (1, 2, 3)}
    mu = (-1) ** len(fs); al = Z.to_c(c) / abs(Z.to_c(c))
    G = np.conj(Z.ZETA6[Z.chi_composite(facs, (4, 0))]) * g[3]
    e1 = max(e1, abs(g[2] - mu * al * G * np.conj(g[1])))
    for _ in range(3):
        while True:
            m = (random.randint(-40, 40), random.randint(-40, 40))
            if m != (0, 0) and Z.chi_composite(facs, m) is not None: break
        km = Z.chi_composite(facs, m)
        lhs = g[2] * Z.ZETA6[km]
        rhs = mu * al * G * np.conj(Z.gauss_brute(c, facs, 1, m))
        e2 = max(e2, abs(lhs - rhs))
    # non-coprime index: m = p * m0
    P = fs[0]
    val = Z.gauss_brute(c, facs, 1, P.pi)
    e3min = max(e3min, abs(val))
    n += 1
print(f"moduli tested: {n}")
print(f"L1 max err {e1:.3e}")
print(f"L2 max err {e2:.3e}")
print(f"L3 max |gt_1(p,c)| over moduli = {e3min:.3e} (expected 0: both sides of L2 vanish at non-coprime index)")
