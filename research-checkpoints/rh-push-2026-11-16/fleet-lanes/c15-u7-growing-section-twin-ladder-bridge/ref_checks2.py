# Referee check of Proposition 4 in the general form (frequency v0 = log x <= u). float64.
import numpy as np
def primes_upto(N):
    sv = np.ones(N+1, bool); sv[:2] = False
    for i in range(2, int(N**0.5)+1):
        if sv[i]: sv[i*i::i] = False
    return np.nonzero(sv)[0]
delta = 0.5
for (t, P) in [(1e4, 1e6), (1e3, 1e6), (1e5, 1e6), (1e4, 1e4)]:
    u = np.log(P); pr = primes_upto(int(P))
    eps = [np.ones(len(pr))] + [np.random.default_rng(1000+k).integers(0, 2, size=len(pr))*2.0 - 1 for k in range(6)]
    for xf in [np.exp(-1.0), np.exp(-2.0), P**-0.5]:
        x = P*xf; v0 = np.log(x)
        ln = []; lam = []; idx = []; kk = []
        for j, p in enumerate(pr):
            q = p; k = 1
            while q <= P:
                if abs(np.log(q) - v0) < delta: ln.append(np.log(q)); lam.append(np.log(p)); idx.append(j); kk.append(k)
                q *= p; k += 1
        ln = np.array(ln); lam = np.array(lam); idx = np.array(idx); kk = np.array(kk)
        A = lam*np.exp(-0.5*ln)*(1 - ln/u)*(1 - np.abs(ln - v0)/delta)
        tt = t + np.linspace(-100, 100, 10001)
        sups = []
        for e in eps:
            a = A*e[idx]**kk; s = 0
            for b in range(0, len(tt), 200): s = max(s, np.abs(a @ np.exp(-1j*np.outer(ln, tt[b:b+200]))).max())
            sups.append(s)
        print("t=%g P=%g x=%.4g: bound log(t/2pi)=%.3f, trivial %.3f | sup over 10001 heights in t+-100: zeta %.4f ; 6 random sign seeds %s" % (t, P, x, np.log(t/(2*np.pi)), A.sum(), sups[0], " ".join("%.3f" % s for s in sups[1:])), flush=True)
