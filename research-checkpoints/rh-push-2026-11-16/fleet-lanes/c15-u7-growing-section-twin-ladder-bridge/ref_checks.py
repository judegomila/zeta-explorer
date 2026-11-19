# Referee checks, written separately from stage.py (own formulas). float64.
import numpy as np
from scipy.special import digamma
from scipy.integrate import quad
# R-1: Lemma 2 on a grid, K_u by quadrature of the defining integral at random points and by closed form on a grid
rng = np.random.default_rng(7)
worst = 1e9; maxdiff = 0
for u in [0.7, 3.0, 9.2, 18.4]:
    x = np.linspace(0, 3, 301)[:, None]; y = np.linspace(-60, 60, 24001)[None, :] + 1e-7
    w = x + 1j*y
    K = 1/w - (1 - np.exp(-u*w))/(u*w*w)
    worst = min(worst, K.real.min())
    for _ in range(20):
        xx = rng.uniform(0, 3); yy = rng.uniform(-30, 30)
        re = quad(lambda v: (1 - v/u)*np.exp(-xx*v)*np.cos(yy*v), 0, u, limit=400)[0]
        ww = xx + 1j*yy; cf = (1/ww - (1 - np.exp(-u*ww))/(u*ww*ww)).real
        maxdiff = max(maxdiff, abs(re - cf))
print("R-1: min Re K_u on grid x in [0,3], y in [-60,60], u in {0.7,3,9.2,18.4}: %.3e ; closed form vs quadrature max diff %.1e" % (worst, maxdiff))
xneg = -0.2; u = 9.2; y = np.linspace(-5, 5, 20001) + 1e-7; w = xneg + 1j*y
print("R-1b: x = -0.2, u = 9.2: min Re K_u = %.3f (negative expected)" % (1/w - (1 - np.exp(-u*w))/(u*w*w)).real.min())
# R-2: Proposition 4 for zeta, and the integral identity behind it
def primes_upto(N):
    sv = np.ones(N+1, bool); sv[:2] = False
    for i in range(2, int(N**0.5)+1):
        if sv[i]: sv[i*i::i] = False
    return np.nonzero(sv)[0]
def vm(P):
    ln = []; lam = []
    for p in primes_upto(int(P)):
        q = p
        while q <= P: ln.append(np.log(q)); lam.append(np.log(p)); q *= p
    return np.array(ln), np.array(lam)
delta = 0.5
for (t, P) in [(1e4, 1e2), (1e4, 1e4), (1e4, 1e6), (1e5, 1e5), (1e3, 1e6)]:
    u = np.log(P); ln, lam = vm(P)
    sel = ln > u - delta
    c = lam*np.exp(-0.5*ln)*(1 - ln/u)
    Sig = np.sum(c[sel]*(1 - (u - ln[sel])/delta)*np.exp(-1j*t*ln[sel]))
    triv = np.sum(np.abs(c[sel])*(1 - (u - ln[sel])/delta))
    # sup over t' in a window of the same sum (every-window check), 2001 heights
    tt = t + np.linspace(-20, 20, 2001)
    A = (c[sel]*(1 - (u - ln[sel])/delta))
    sup = 0
    for a in range(0, len(tt), 50):
        sup = max(sup, np.abs(A @ np.exp(-1j*np.outer(ln[sel], tt[a:a+50]))).max())
    line = "R-2: t=%g P=%g: abs(Sigma)=%.4f, sup over 2001 heights in t+-20: %.4f, bound log(t/2pi)=%.4f, trivial bound %.3f" % (t, P, abs(Sig), sup, np.log(t/(2*np.pi)), triv)
    if P <= 1e4:
        # integral identity: int Re L_F(1/2+i(t+y)) B(y)(1+cos(uy+phi)) dy on abs(y) <= Y
        Y = 400.0; y = np.linspace(-Y, Y, 400001); dy = y[1]-y[0]
        s = 0.5 + 1j*(t + y)
        K = lambda w: 1/w - (1 - np.exp(-u*w))/(u*w*w)
        z = s/2; gp = 0.25*(1/z + 1/(2*z**2) + 1/(6*z**3))
        gam = (K(s) + K(s-1) + 0.5*digamma(s/2) - 0.5*np.log(np.pi) + gp/u - np.exp(-u*s)/(u*s*s)).real
        pr = np.zeros(len(y))
        for a in range(0, len(ln), 20):
            pr += (c[a:a+20] @ np.exp(-1j*np.outer(ln[a:a+20], t + y))).real
        ReL = gam - pr
        B = (delta/(2*np.pi))*np.sinc(delta*y/(2*np.pi))**2
        for phi in [0.0, 1.3]:
            I = np.sum(ReL*B*(1 + np.cos(u*y + phi)))*dy
            pred = 0.5*np.log(t/(2*np.pi)) - 0.5*(np.exp(1j*phi)*Sig).real
            line += " | phi=%.1f: integral %.4f, formula %.4f" % (phi, I, pred)
    print(line, flush=True)
