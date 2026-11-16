# Theorem A check (zeta).  K = Phi (Polymath), F(z) = xi(1/2+z) = 4 int_R K(u) e^{2zu} du.
#   T_ab = int_0^inf [2r K^(a)K^(b) + a K^(a-1)K^(b) + b K^(a)K^(b-1)] dr
#   claim: T_ab = sum over all zeros rho of M_a(rho) M_b(-rho),  M_a(z) = int_0^inf K^(a)(s) e^{2zs} ds
#   under RH (used only to list the zeros numerically): = 2 sum_{gamma>0} Re[ M_a(i gamma) conj M_b(i gamma) ].
import numpy as np
from mpmath import mp, mpf, zetazero, pi as mpi, exp as mexp, diff, quad, log
mp.dps = 20
def Kmp(u): return sum((2*mpi**2*n**4*mexp(9*u)-3*mpi*n**2*mexp(5*u))*mexp(-mpi*n**2*mexp(4*u)) for n in range(1, 6))
x, w = np.polynomial.legendre.leggauss(200)
PAN = 40; Umax = 1.3
us = np.concatenate([(x+1)/2*Umax/PAN + k*Umax/PAN for k in range(PAN)]); ws = np.concatenate([w/2*Umax/PAN]*PAN)
def Kd(u, a):   # derivative via w^5 P(y) e^{-cy}, D -> 5P+4yP'-4cyP ; float64 is enough for a 9-digit check
    y = np.exp(4*u); tot = 0
    for n in range(1, 6):
        c = np.pi*n*n; P = np.array([-3*np.pi*n*n, 2*np.pi**2*n**4])
        for _ in range(a):
            Q = np.zeros(len(P)+1); k = np.arange(len(P))
            Q[:-1] += (5+4*k)*P; Q[1:] -= 4*c*P; P = Q
        tot = tot + np.exp(5*u)*np.polyval(P[::-1], y)*np.exp(-c*y)
    return tot
D = [Kd(us, a) for a in range(4)]
def T(a, b):
    v = 2*us*D[a]*D[b]
    if a: v = v + a*D[a-1]*D[b]
    if b: v = v + b*D[a]*D[b-1]
    return float(np.sum(ws*v))
NZ = 400
gam = np.array([float(zetazero(k).imag) for k in range(1, NZ+2)])
def zsum(a, b):
    tot = 0.0; terms = []
    for g in gam[:NZ]:
        e = np.exp(2j*g*us)
        Ma = np.sum(ws*D[a]*e); Mb = np.sum(ws*D[b]*e)
        terms.append(2*(Ma*np.conj(Mb)).real)
    return np.array(terms)
K0, K2 = float(Kmp(0)), float(diff(Kmp, 0, 2))
for (a, b) in [(1, 1), (1, 3), (3, 3), (0, 0), (0, 2), (2, 2)]:
    t = zsum(a, b); direct = T(a, b)
    print('T_%d%d direct %.12e   zero sum (%d zeros) %.12e   last term %.2e   rel diff %.2e' % (a, b, direct, NZ, t.sum(), t[-1], t.sum()/direct-1))
