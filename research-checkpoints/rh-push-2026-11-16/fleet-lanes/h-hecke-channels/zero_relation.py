from mpmath import *
from hecke_checks import Estar, neighbours, reduce_tau
mp.dps = 30
chi4 = [0, 1, 0, -1]
zs = [zetazero(k) for k in (1, 2, 5)]
l4 = [findroot(lambda s: dirichlet(s, chi4), mpc(0.5, t)) for t in (6.02, 10.24)]
print("zeros of the square-torus field E*(i,s): zeta zeros", [nstr(z.imag, 10) for z in zs], " L(chi_-4) zeros", [nstr(z.imag, 10) for z in l4])
for rho in zs + l4:
    for p in (2, 3, 5):
        vals = {}
        for t in neighbours(mpc(0, 1), p):
            key = nstr(reduce_tau(t), 6)
            vals.setdefault(key, []).append(Estar(t, rho))
        scale = max(abs(v[0]) for v in vals.values())
        tot = sum(sum(v) for v in vals.values())
        desc = "; ".join("%s x%d |E*|=%s" % (k, len(v), nstr(abs(v[0]), 4)) for k, v in vals.items())
        print("t=%s p=%d  %s   |sum over p+1|/max = %s" % (nstr(rho.imag, 8), p, desc, nstr(abs(tot)/scale, 3)))
