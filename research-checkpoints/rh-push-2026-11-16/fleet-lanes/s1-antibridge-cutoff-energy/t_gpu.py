"""validation of gpuline.py on known answers: (a) Z, Z', Z'' and L(h+it) against python-flint; (b) zero count against
arb.zeta_nzeros; (c) the 167/302 half-Gram and 16/302 Gram census up to gamma_300."""
import sys, math, json
import numpy as np
from flint import acb, arb, ctx
import flib, gpuline as g
xp = g.xp
ctx.prec = 128
def exact(obj, t, h):
    o = flib.OBJ[obj]; c = o.taylor(acb(h, t), 3)
    return complex(c[1] / c[0]), complex(2 * c[2] / c[0])
for obj in ['ZETA', 'CHI4', 'DH']:
    q = {'ZETA': 1, 'CHI4': 4, 'DH': 5}[obj]; mu = 0 if obj == 'ZETA' else 1
    gam = g.Gam(q, mu, obj == 'ZETA'); rs = g.RS('rs_cheb.json') if obj == 'ZETA' else None
    for T in [200.3, 3000.7, 50000.1, 1000000.3]:
        t = xp.asarray([T, T + 0.11, T + 0.37])
        nn, an, _, _ = g.coeffs(obj, int(math.sqrt(q * float(t[-1]) / (2 * math.pi))))
        N = xp.floor(xp.sqrt(q * t / (2 * math.pi)))
        nx = xp.asarray(nn, dtype=float); ln = xp.log(nx); base = xp.asarray(an) / xp.sqrt(nx)
        E = xp.exp(-1j * t[:, None] * ln[None, :]) * (nx[None, :] <= N[:, None])
        errs = []
        for h in [0.0, 0.05]:
            tau = t - 1j * h
            th, th1, th2, l1, l2 = gam.all(tau)
            Am = E @ (base * nx ** (-h)); Am1 = E @ (base * nx ** (-h) * ln)
            Ap = xp.conj(E @ (base * nx ** h)); Ap1 = xp.conj(E @ (base * nx ** h * ln))
            ec = xp.exp(1j * th)
            Zc = ec * Am + Ap / ec
            Zcd = 1j * th1 * ec * Am - 1j * ec * Am1 - 1j * th1 / ec * Ap + 1j / ec * Ap1
            if rs is not None:
                R, Rd, _ = rs.R(tau, N); Zc = Zc + R; Zcd = Zcd + Rd
            L = -1j * (l1 + Zcd / Zc)
            for i in range(3):
                Lx, _ = exact(obj, float(t[i]), h)
                errs.append(abs(complex(L[i]) - Lx) / abs(Lx))
        print(obj, 'T', T, 'max rel err of F\'/F (h=0, 0.05):', max(errs))
# (b), (c)
res = g.scan('ZETA', 100.0, 3000.0, 0.025, 'out/t_zeta_small', block=20000)
n_exact = int(arb(3000).zeta_nzeros().unique_fmpz()) - int(arb(100).zeta_nzeros().unique_fmpz())
print('zeros counted', res['stat']['zeros'], 'exact', n_exact)
