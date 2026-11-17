"""Clean counterexamples with small rational coordinates: exact coefficients, exact Schur-Cohn count,
roots to 30 digits (mpmath polyroots at 60 digits; residual printed)."""
import math, json, mpmath as mp
from fractions import Fraction as F
from lylib import *
from schur import G, schur_cohn_count
mp.mp.dps = 60
EX = [(5, [0, 1, 2], [G(F(-24, 25), F(-7, 25)), G(F(-7, 25), F(-24, 25)), G(F(-24, 25), F(-7, 25))], 'unit torus, complex'),
      (5, [0, 1, 2], [G(F(-9, 10), F(-1, 4)), G(F(-1, 4), F(-9, 10)), G(F(-9, 10), F(-1, 4))], 'open polydisc, complex'),
      (13, [0, 1, 2, 7, 11], [G(F(24, 25), F(-7, 25)), G(F(-7, 10), F(7, 10)), G(F(-99, 100), F(1, 13)), G(F(-22, 25), F(9, 20)), G(F(-1, 2), F(21, 25))], 'closed polydisc, complex'),
      (13, [0, 1, 3, 4, 11], [G(-1), G(-1), G(-1), G(F(1, 3)), G(-1)], 'real cube'),
      (11, [0, 1, 4, 6, 8], [G(-1), G(-1), G(-1), G(0), G(-1)], 'real cube')]
res = []
for q, es, z, dom in EX:
    n = len(es); chi = chi_table(q); cnt = counts(q, es, value_tables(q, n-1), chi)
    assert all(v.n2() <= 1 for v in z)
    co = Ncoeffs(q, n, cnt, z, one=G(1, 0))
    r = F(math.isqrt(10**24 // q), 10**12); assert r*r*q < 1
    c = schur_cohn_count(co, r)
    cm = [mp.mpc(mp.mpf(v.a.numerator)/v.a.denominator, mp.mpf(v.b.numerator)/v.b.denominator) for v in co]
    rts = sorted(mp.polyroots(cm[::-1], maxsteps=500, extraprec=200), key=abs)
    resid = max(abs(mp.polyval(cm[::-1], u)) for u in rts)/max(abs(x) for x in cm)
    rec = {'q': q, 'es': es, 'domain': dom, 'z': [f"{v.a} + ({v.b}) i" for v in z], 'max|z_i|^2': str(max(v.n2() for v in z)),
           'N_coeffs_ascending_exact': [f"{v.a} + ({v.b}) i" for v in co],
           'exact_schur_cohn_zeros_in_|u|<r': c, 'r': str(r),
           'roots_30_digits': [mp.nstr(u, 30) for u in rts], 'abs_u_sqrt_q': [mp.nstr(abs(u)*mp.sqrt(q), 25) for u in rts], 'relative_residual': mp.nstr(resid, 3)}
    res.append(rec); print(json.dumps(rec, indent=1))
json.dump(res, open('clean_examples.json', 'w'), indent=1)
