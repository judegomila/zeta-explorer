# Volterra V_{a,Phi}: closed-form bracket G/2 <= ||V|| <= G, thresholds, true norm, sign-gauge example.
import numpy as np, mpmath as mp
mp.mp.dps = 30
def Phi(u, N=12):
    u = mp.mpf(u); s = mp.mpf(0)
    for n in range(1, N+1):
        s += (2*mp.pi**2*n**4*mp.e**(9*u) - 3*mp.pi*n**2*mp.e**(5*u))*mp.exp(-mp.pi*n**2*mp.e**(4*u))
    return s
U = 3.0
def G(a):
    a = mp.mpf(a)
    pts = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, U]
    C = mp.quad(lambda t: Phi(t)**2*mp.cosh(2*a*t), pts)
    S = mp.quad(lambda t: Phi(t)**2*mp.sinh(2*a*t), pts)
    I = mp.quad(lambda t: Phi(t)**2, pts)
    return mp.sqrt((C*C - I*I - S*S))/2
print("Phi(0)=", Phi(0))
for a in [0.025, 0.1, 0.5, 1, 5, 10, 20, 30, 31.62, 35, 40]:
    print("a=%g  G=||V||_HS=%s  G/2=%s" % (a, mp.nstr(G(a), 10), mp.nstr(G(a)/2, 10)))
a1 = mp.findroot(lambda a: G(a)-1, 31.0); a2 = mp.findroot(lambda a: G(a)-2, 33.0)
print("G(a)=1 at a_lo =", mp.nstr(a1, 12), "  G(a)=2 at a_up =", mp.nstr(a2, 12))
# true operator norm by Gauss-Legendre Nystrom (symmetrised weights)
def opnorm(a, n=1500, Umax=1.6):
    x, w = np.polynomial.legendre.leggauss(n); t = 0.5*Umax*(x+1); w = 0.5*Umax*w
    ph = np.array([float(Phi(tt, 6)) for tt in t])
    K = ph[:, None]*ph[None, :]*np.sinh(a*(t[:, None]-t[None, :]))
    K = np.tril(K, -1)
    M = np.sqrt(w)[:, None]*K*np.sqrt(w)[None, :]
    return np.linalg.norm(M, 2), np.linalg.norm(M, 'fro')
for a in [0.5, 30, 31.62, 33, 34, 35, 36]:
    for n in (800, 1600):
        o, f = opnorm(a, n); print("a=%g n=%d ||V||_op=%.8g ||V||_HS=%.8g  ratio op/HS=%.5f" % (a, n, o, f, o/f))
from scipy.optimize import brentq
astar = brentq(lambda a: opnorm(a, 1200)[0]-1, 31, 36, xtol=1e-6)
print("true a* (||V||_op=1) ~", astar)
