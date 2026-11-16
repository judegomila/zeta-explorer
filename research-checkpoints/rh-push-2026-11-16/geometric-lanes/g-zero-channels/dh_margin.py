"""DH control, part 2 (MEASURED, double precision on normalised jets): Rouche-vs-linear relative margin
mu = max_r [1 - (sum_{n>=2}|b_n| r^n)/(|b_1| r)] at exact zeros of F_tau^DH near height 85.7, for several tau."""
import numpy as np, math
from flint import acb, arb, ctx
import dh_control as D
ctx.prec = 700
J = 160
c = acb(arb(1)/2, arb("85.699348"))
a = D.jet(c, J)
fact = [arb(1)]
for i in range(1, J+2): fact.append(fact[-1]*i)
sc = abs(a[1])
def bcoef(tau, nmax=90):
    out = []
    for n in range(nmax):
        v = acb(0); m = 0
        while n+2*m < J:
            v += a[n+2*m]*fact[n+2*m]/(fact[n]*fact[m]*arb(4)**m)*arb(tau)**m; m += 1
        out.append(complex(v/sc))
    return np.array(out)
def shift(b, h0):
    p = np.polynomial.Polynomial(b)
    return p(np.polynomial.Polynomial([h0, 1])).coef
for tau in (0.0, 0.1, 0.17, 0.19, 0.3, 0.5):
    b = bcoef(tau)
    rts = np.polynomial.Polynomial(b).roots()
    rts = [r for r in rts if abs(r) < 1.6]
    rts.sort(key=lambda r: r.imag)
    out = []
    for r0 in rts:
        bs = shift(b, r0)
        best = -1; rb = 0
        for r in np.geomspace(1e-3, 2, 200):
            q = sum(abs(bs[n])*r**n for n in range(2, len(bs)))
            mu = 1-q/(abs(bs[1])*r)
            if mu <= 0: break
            rb = r
        out.append("(%+.4f%+.4fi: r_max %.3f)" % (r0.real, r0.imag, rb))
    print("tau=%.2f zeros h=s-c within 1.6:" % tau, " ".join(out))
