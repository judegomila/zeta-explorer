# Angle 3: finite Euler product as a Lee-Yang / Hermite-Biehler structure function. MEASURED (mpmath, numpy).
import mpmath as mp, numpy as np
mp.mp.dps = 20
def primes_upto(P):
    s = np.ones(P+1, bool); s[:2] = False
    for i in range(2, int(P**0.5)+1):
        if s[i]: s[i*i::i] = False
    return [int(p) for p in np.nonzero(s)[0]]
def logzP(s, pr): return -sum(mp.log(1 - mp.mpf(p)**(-s)) for p in pr)
def theta(t): return mp.siegeltheta(t)
# (a) Bohr lift of the Riemann-Siegel main sum is NOT zero-free on the polydisc: value at z = (-1,...,-1)
def lam(n):
    c = 0; d = 2
    while d*d <= n:
        while n % d == 0: n //= d; c += 1
        d += 1
    if n > 1: c += 1
    return (-1)**c
for N in (2, 3, 5, 10, 50):
    print("D_N(-1,..,-1) = sum_{n<=N} lambda(n)/sqrt(n), N=%d: %s" % (N, mp.nstr(sum(lam(n)/mp.sqrt(n) for n in range(1, N+1)), 6)))
# (b) model Z_P(t) = 2 Re( e^{i theta(t)} zeta_P(1/2+it) ): zeros = { theta(t) + arg zeta_P(1/2+it) = pi/2 mod pi }
def phase(t, pr): return theta(t) + mp.im(logzP(mp.mpc(0.5, t), pr))
truez = [mp.im(mp.zetazero(j)) for j in range(1, 80)]
T0, T1 = 10, 200
for P in (2, 10, 100, 1000, 10000):
    pr = primes_upto(P)
    # monotonicity of the phase (=> exactly one model zero per pi of phase; HB derivative condition on the line)
    ts = np.linspace(T0, T1, 3801); ph = [phase(mp.mpf(float(t)), pr) for t in ts]
    dmin = min((ph[i+1]-ph[i])/(ts[i+1]-ts[i]) for i in range(len(ts)-1))
    # model zeros: phase = pi/2 + m pi
    zs = []
    for i in range(len(ts)-1):
        a, b = ph[i], ph[i+1]
        lo, hi = (a, b) if a < b else (b, a)
        m = mp.ceil((lo - mp.pi/2)/mp.pi)
        while mp.pi/2 + m*mp.pi < hi:
            tgt = mp.pi/2 + m*mp.pi
            zs.append(mp.findroot(lambda u: phase(u, pr) - tgt, (ts[i], ts[i+1]), solver='anderson')); m += 1
    tz = [g for g in truez if T0 < g < T1]
    # match by order
    n = min(len(zs), len(tz))
    err = [abs(zs[i]-tz[i]) for i in range(n)]
    print(f"P={P:6d}: model zeros {len(zs)}, zeta zeros {len(tz)}, min dphase/dt {mp.nstr(dmin,4)}, "
          f"mean|dz| {mp.nstr(sum(err)/n,4)}, max|dz| {mp.nstr(max(err),4)} (mean spacing {mp.nstr((T1-T0)/len(tz),4)})")
# (c) Hermite-Biehler inequality |E(s)| > |E(1-conj s)|, E = gamma(s) zeta_P(s), on sigma in (1/2, 1], t in [10,200]
def hbmargin(sg, t, pr):
    s = mp.mpc(sg, t); sr = mp.mpc(1-sg, t)
    g = lambda w: mp.log(abs(mp.pi**(-w/2)*mp.gamma(w/2)))
    return g(s) - g(sr) + mp.re(logzP(s, pr)) - mp.re(logzP(sr, pr))
for P in (10, 100, 1000, 10000):
    pr = primes_upto(P); worst = (mp.inf, None)
    for sg in (0.52, 0.6, 0.75, 1.0):
        for t in np.linspace(10, 200, 381):
            m = hbmargin(sg, mp.mpf(float(t)), pr)
            if m < worst[0]: worst = (m, (sg, float(t)))
    print(f"P={P:6d}: min HB margin log|E(s)/E(1-conj s)| on grid = {mp.nstr(worst[0],5)} at (sigma,t)={worst[1]}  [>0 => all model zeros on the line there]")
