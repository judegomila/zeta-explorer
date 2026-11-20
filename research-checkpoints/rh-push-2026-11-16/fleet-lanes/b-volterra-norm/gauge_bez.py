# (1) sign-gauge example: eps = +1 on [0,t0], -1 on (t0,inf). V_{a,eps*Phi} = M_eps V M_eps (unitary), but Xi_eps has zero i*y0.
# (2) Bezoutian kernel b_a(s,t) = 2 int_{|s+t|/2}^inf Phi(r+d)Phi(r-d) sinh(2 a r) dr, d=(s-t)/2 ; K_a PSD <=> b_a PSD.
import numpy as np
from scipy.optimize import brentq
def phi_np(u, N=6):
    u = np.minimum(np.abs(u), 3.0); s = 0
    for n in range(1, N+1):
        s = s + (2*np.pi**2*n**4*np.exp(9*u) - 3*np.pi*n**2*np.exp(5*u))*np.exp(-np.pi*n**2*np.exp(4*u))
    return s
xg, wg = np.polynomial.legendre.leggauss(400)
def quad(f, a, b):
    t = 0.5*(b-a)*xg + 0.5*(b+a); return 0.5*(b-a)*np.sum(wg*f(t))
def half_xi(y, t0):   # (1/2) Xi_eps(i y)
    f = lambda u: phi_np(u)*np.cosh(y*u)
    return quad(f, 0, t0) - quad(f, t0, 2.5)
print("== sign-gauge ==", flush=True)
for t0 in [0.1, 0.2, 0.3, 0.5]:
    f0 = half_xi(0, t0)
    if f0 <= 0: print("t0=%g: head<tail at y=0, skip" % t0); continue
    hi = 1.0
    while half_xi(hi, t0) > 0: hi *= 2
    y0 = brentq(lambda y: half_xi(y, t0), 0, hi, xtol=1e-12)
    print("t0=%g  Xi_eps(0)/2=%.8g  imaginary zero y0=%.10g  => K_{a,eps} not PSD for every a<y0" % (t0, f0, y0), flush=True)
def bez(a, eps_t0=None, L=1.3, n=131, R=2.6, nr=5201):
    s = np.linspace(-L, L, n); ds = s[1]-s[0]; r = np.linspace(0, R, nr); h = r[1]-r[0]
    def f(u):
        v = phi_np(u)
        if eps_t0 is not None: v = np.where(np.abs(u) > eps_t0, -v, v)
        return v
    sh = np.sinh(2*a*r); step = int(round(ds/2/h))
    tails = {}
    for k in range(-(n-1), n):          # d = k*ds/2
        d = k*ds/2; g = f(r+d)*f(r-d)*sh
        c = np.cumsum(g[::-1])[::-1]     # sum_{k>=k0} g
        tails[k] = 2*h*(c - 0.5*g)       # trapezoid tail from r[k0]
    B = np.empty((n, n))
    for i in range(n):
        for j in range(n):
            m2 = abs((i+j) - (n-1))      # |s_i+s_j|/(ds) ; m = m2*ds/2
            B[i, j] = tails[i-j][m2*step]
    w = np.linalg.eigvalsh(B)
    return w[0], w[-1], B
print("== Bezoutian kernel b_a ==", flush=True)
for a in [1.0, 0.5, 0.375, 0.2, 0.05]:
    lo, hi, B = bez(a); print("zeta Phi   a=%-6g min eig/max eig = %.3e   (min entry %.3e, sym err %.1e)" % (a, lo/hi, B.min(), abs(B-B.T).max()), flush=True)
for a, t0 in [(0.5, 0.5), (0.2, 0.5), (2.0, 0.5), (8.0, 0.5), (20.0, 0.5), (0.5, 0.3)]:
    lo, hi, B = bez(a, eps_t0=t0); print("sign-flipped t0=%g a=%-6g min eig/max eig = %.3e" % (t0, a, lo/hi), flush=True)
