#!/usr/bin/env python3
"""lemmaF_check.py -- brute-force check of Lemma F (finite Fourier transform of r -> chi_c(r) g~(-e0 r, s) mod lcm(s, c)).
  fcheck(n) := N(L)^(-1) sum_{r mod L} chi_c(r) g~(-e0 r, s) e(r n / L),   L = lcm(s, c).
  (F1) (s, c) = 1:        fcheck(n) = N(sc)^(-1/2) gamma_1(c) R(s, c) conj chi_c(n) chi_s(n) conj chi_s(e0)
  (F2) s = delta s', delta | c, c = delta c', (s', c) = 1:
       fcheck(n) = N(s'c')^(-1/2) N(delta)^(-1) r_delta(n) gamma_1(c) conj chi_delta(c') conj chi_delta(-e0) conj chi_c'(n) R(s', c') chi_s'(n) conj chi_s'(e0) chi_delta(s')
  (F3) p^2 | s for some p | c:  fcheck = 0.
Direct summation over complete residue systems; exact symbols."""
import sys, math, cmath, random, itertools
sys.path.insert(0, 'tmp/sextic')
import zomega as Z
Z6 = [cmath.exp(1j * math.pi * k / 3) for k in range(6)]
def P_(p, which=0):
    pi = Z.split_primary(p)
    if which: pi = Z.conj(pi)
    return Z.PrimeO(pi, p, False)
def prod(fs):
    r = (1, 0)
    for P in fs: r = Z.mul(r, P.pi)
    return r
def chi(fs, x):
    k = Z.chi_composite(fs, x)
    return 0 if k is None else Z6[k]
def gt(fs, y):                       # g~(y, s) for s = prod fs (repetition allowed)
    return Z.gauss_brute(prod(fs), fs, 1, y)
E0 = Z.mul((-2, 0), Z.power(Z.LAM, 5)); ME0 = Z.neg(E0)
_cache = {}
def ftable(cf, sf, Lf):
    key = (tuple(P.pi for P in cf), tuple(P.pi for P in sf), tuple(P.pi for P in Lf))
    if key not in _cache:
        L = prod(Lf); rs = Z.hnf_residues(L); vals = []
        for r in rs:
            xc = chi(cf, r)
            vals.append(0j if xc == 0 else xc * gt(sf, Z.mul(ME0, r)))
        _cache[key] = (L, rs, vals)
    return _cache[key]
def fcheck(cf, sf, n, Lf):
    L, rs, vals = ftable(cf, sf, Lf); Lc = Z.to_c(L)
    return sum(v * Z.e_add(Z.to_c(Z.mul(r, n)) / Lc) for r, v in zip(rs, vals) if v != 0) / Z.norm(L)
def ram(df, n):
    v = 1
    for P in df: v *= (P.q - 1) if Z.divides(P.pi, n) else -1
    return v
random.seed(5); bad = 0; tot = 0; mx = 0.0
p7, p7b, p13, p13b, p19, p31 = P_(7), P_(7, 1), P_(13), P_(13, 1), P_(19), P_(31)
cases1 = [([p7], [p13]), ([p7], [p13, p19]), ([p13], [p7b, p7b]), ([p7, p13], [p19]), ([p19], [p7, p7b]), ([p7, p13b], [p7b, p7b]), ([p7b], [p7, p7, p7])]
for cf, sf in cases1:
    c = prod(cf); s = prod(sf); g1c = Z.gauss_brute(c, cf, 1)
    for _ in range(6):
        n = (random.randint(-30, 30), random.randint(-30, 30))
        if n == (0, 0): continue
        lhs = fcheck(cf, sf, n, cf + sf)
        rhs = (Z.norm(s) * Z.norm(c)) ** -0.5 * g1c * Z.Rrec(s, c) * (chi(cf, n).conjugate() if chi(cf, n) else 0) * chi(sf, n) * chi(sf, E0).conjugate()
        tot += 1; mx = max(mx, abs(lhs - rhs)); bad += abs(lhs - rhs) > 1e-9
print(f"(F1) coprime case: {tot} comparisons, max |diff| = {mx:.2e}, failures {bad}")
bad2 = 0; tot2 = 0; mx2 = 0.0
cases2 = [([p7], [p7], [p13]), ([p7, p13], [p7], [p19]), ([p7, p13], [p7, p13], [p19]), ([p7], [p7], [p13, p13]), ([p13, p19], [p19], [p7, p7b]), ([p7], [p7], [])]
for cf, df, spf in cases2:
    cpf = [P for P in cf if P not in df]
    c = prod(cf); dl = prod(df); sp = prod(spf); cp = prod(cpf); g1c = Z.gauss_brute(c, cf, 1)
    for _ in range(6):
        n = (random.randint(-30, 30), random.randint(-30, 30))
        if random.random() < 0.5: n = Z.mul(n, dl)
        if n == (0, 0): continue
        lhs = fcheck(cf, df + spf, n, cf + spf)
        xcpn = chi(cpf, n) if cpf else 1
        rhs = (Z.norm(sp) * Z.norm(cp)) ** -0.5 / Z.norm(dl) * ram(df, n) * g1c * (chi(df, cp).conjugate() if cpf else 1) * chi(df, ME0).conjugate() \
              * (xcpn.conjugate() if xcpn else 0) * (Z.Rrec(sp, cp)) * (chi(spf, n) * chi(spf, E0).conjugate() if spf else 1) * (chi(df, sp) if spf else 1)
        tot2 += 1; mx2 = max(mx2, abs(lhs - rhs)); bad2 += abs(lhs - rhs) > 1e-9
print(f"(F2) s = delta s': {tot2} comparisons, max |diff| = {mx2:.2e}, failures {bad2}")
mx3 = 0.0; tot3 = 0
for cf, sf, Lf in [([p7], [p7, p7], [p7, p7]), ([p7], [p7, p7, p13], [p7, p7, p13]), ([p7, p13], [p13, p13], [p7, p13, p13])]:
    for _ in range(4):
        n = (random.randint(-30, 30), random.randint(-30, 30)); tot3 += 1
        mx3 = max(mx3, abs(fcheck(cf, sf, n, Lf)))
print(f"(F3) p^2 | s, p | c: {tot3} comparisons, max |fcheck| = {mx3:.2e}")
