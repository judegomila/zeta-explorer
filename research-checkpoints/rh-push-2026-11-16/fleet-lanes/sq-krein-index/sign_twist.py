# Control 3 (sign twist Lambda(n) -> eps_n Lambda(n)): the only place the Euler product enters the index formula is the
# far-edge term  E(t) = -(1/pi) sum_n eps_n Lambda(n) n^{-sigma} sin(t log n)/log n  (sigma = 1/2 + X > 1).
# Its size bound log zeta(sigma)/pi is sign-blind; measured here for eps = +1, Liouville-type random signs, and eps = -1.
import numpy as np
rng = np.random.default_rng(3)
Nmax = 200000
sieve = np.ones(Nmax+1, bool); sieve[:2] = False
for p in range(2, int(Nmax**0.5)+1):
    if sieve[p]: sieve[p*p::p] = False
primes = np.nonzero(sieve)[0]
ns, lam = [], []
for p in primes:
    q = p
    while q <= Nmax:
        ns.append(q); lam.append(np.log(p)); q *= p
ns = np.array(ns, float); lam = np.array(lam); ln = np.log(ns)
t = np.linspace(0, 2000, 40001)
for sigma in (2.0, 1.5, 1.1):
    w = lam/ln*ns**(-sigma)
    bound = w.sum()/np.pi
    out = []
    for name, eps in (("+1", np.ones_like(w)), ("random +-1", rng.choice([-1.0, 1.0], size=w.size)), ("-1", -np.ones_like(w))):
        E = np.zeros_like(t)
        for i in range(0, w.size, 2000):
            E -= (np.sin(np.outer(t, ln[i:i+2000]))*(eps[i:i+2000]*w[i:i+2000])).sum(axis=1)/np.pi
        out.append("%s: max|E|=%.4f" % (name, np.abs(E).max()))
    print("sigma=%.1f  bound (n<=2e5) log zeta/pi = %.4f   " % (sigma, bound) + "   ".join(out))
