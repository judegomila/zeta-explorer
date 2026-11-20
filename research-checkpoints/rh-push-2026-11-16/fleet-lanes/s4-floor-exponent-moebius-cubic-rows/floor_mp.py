# Combination 1, higher-precision re-check (mpmath, 60 digits) of the lowest eigenvalue of the Weil form on [-a,a]
# in the first N basis functions per parity sector (same basis and same formula as wf.py):
#   Q = (C + tail(a)) I + int_0^{2a} k(x) (I - G(x)) dx - 2 sum_q w_q G(log q) +- 2 sum_poles P P^T.
# Objects: zeta; E_a (a = 1/8); T-NR(3, 2.2) read with zeta's bridge; Liouville sign twist. Compared with float64 (wf.py) at the same N.
import sys, math, json
import mpmath as mp
import numpy as np
import wf, objs
mp.mp.dps = 60
LAM = mp.mpf('6.5')
def polys(N, par):
    """coefficient lists (ascending) of q_n(y) = p_n(y) (1 - y^2)^3, p_n orthonormal Gegenbauer(6.5), first N of parity par."""
    mu0 = mp.sqrt(mp.pi)*mp.gamma(7)/mp.gamma(mp.mpf('7.5'))
    pm1 = [mp.mpf(0)]; p = [1/mp.sqrt(mu0)]; out = []; deg = 0
    w = [1, 0, -3, 0, 3, 0, -1]
    def mulw(c): 
        r = [mp.mpf(0)]*(len(c) + 6)
        for i, ci in enumerate(c):
            for j, wj in enumerate(w): r[i + j] += ci*wj
        return r
    if par == 0: out.append(mulw(p))
    while len(out) < N:
        n = deg + 1
        bn = mp.sqrt(mp.mpf(n)*(n + 2*LAM - 1)/(4*(n + LAM)*(n + LAM - 1)))
        bnm1 = mp.sqrt(mp.mpf(n - 1)*(n - 2 + 2*LAM)/(4*(n - 1 + LAM)*(n - 2 + LAM))) if n > 1 else mp.mpf(0)
        xp = [mp.mpf(0)] + p; q = [(xp[i] - (bnm1*pm1[i] if i < len(pm1) else 0))/bn for i in range(len(xp))]
        pm1, p = p, q; deg = n
        if deg % 2 == par: out.append(mulw(p))
    return out
def pv(c, y): return mp.polyval(c[::-1], y)
def Gmat(P, v, nq):
    """G_ij(v) = int_{-1}^{1-v} q_i(y) q_j(y+v) dy, symmetrised (Gauss-Legendre, exact for these degrees)."""
    xs, ws = GL[nq]; hi = 1 - v; N = len(P); half = (hi + 1)/2
    A = [[pv(c, -1 + half*(x + 1)) for x in xs] for c in P]; Bm = [[pv(c, -1 + half*(x + 1) + v) for x in xs] for c in P]
    G = mp.matrix(N, N)
    for i in range(N):
        for j in range(N):
            G[i, j] = half*mp.fsum(ws[k]*A[i][k]*Bm[j][k] for k in range(len(xs)))
    return (G + G.T)/2
GL = {}
def gl(n):
    if n not in GL:
        X = mp.calculus.quadrature.GaussLegendre(mp.mp); nodes = X.calc_nodes(int(math.ceil(math.log2(n/3.0))) + 1, mp.mp.prec)   # 3*2^(d-1) nodes
        GL[n] = ([x for x, w in nodes], [w for x, w in nodes])
    return GL[n]
def weil(P, par, a, C, kern, tail, atoms, poles):
    N = len(P); nq = 96; gl(nq); xs, ws = GL[nq]; a = mp.mpf(a)
    Q = (C + tail)*mp.eye(N)
    for x, w in zip(xs, ws):                     # x-integral over (0, 2a): v = x/a in (0,2)
        v = 1 + x; G = Gmat(P, v, nq); Q += w*a*kern(a*v)*(mp.eye(N) - G)
    for lq, wq in atoms:
        if lq < 2*a: Q -= 2*wq*Gmat(P, lq/a, nq)
    f = mp.cosh if par == 0 else mp.sinh
    for mu in poles:
        vec = [mp.sqrt(a)*mp.fsum(w*f(mu*a*x)*pv(c, x) for x, w in zip(xs, ws)) for c in P]
        for i in range(N):
            for j in range(N): Q[i, j] += (2 if par == 0 else -2)*vec[i]*vec[j]
    return (Q + Q.T)/2
def obj(name, a):
    nmax = int(math.exp(2*a)) + 1; pp = []
    for n in range(2, nmax + 1):
        f = [p for p in range(2, n + 1) if n % p == 0 and all(p % d for d in range(2, p))]
        if len(f) == 1:
            k = 0; m = n
            while m % f[0] == 0: m //= f[0]; k += 1
            pp.append((n, f[0], k))
    psi = mp.digamma
    zC = -mp.log(mp.pi) + psi(mp.mpf(1)/4); zk = lambda x: mp.exp(x/2)/mp.sinh(x); ztail = mp.quad(zk, [2*a, 2*a + 10, mp.inf])
    if name == 'zeta': return zC, zk, ztail, [(mp.log(n), mp.log(p)/mp.sqrt(n)) for n, p, k in pp], [mp.mpf(1)/2]
    if name == 'LIOU': return zC, zk, ztail, [(mp.log(n), (-1)**k*mp.log(p)/mp.sqrt(n)) for n, p, k in pp], [mp.mpf(1)/2]
    if name == 'TNR':
        c = mp.mpf('2.2'); r1 = (-c + mp.sqrt(c*c - 4))/2; r2 = (-c - mp.sqrt(c*c - 4))/2; at = []
        for n, p, k in pp: at.append((mp.log(n), mp.log(p)/mp.sqrt(n) - (mp.log(3)*(r1**k + r2**k) if p == 3 else 0)))
        return zC, zk, ztail, at, [mp.mpf(1)/2]
    if name == 'EA':
        al = mp.mpf(1)/8; C = -2*mp.log(mp.pi) + psi(mp.mpf(1)/4 + al/2) + psi(mp.mpf(1)/4 - al/2); k_ = lambda x: 2*mp.exp(x/2)*mp.cosh(al*x)/mp.sinh(x)
        return C, k_, mp.quad(k_, [2*a, 2*a + 10, mp.inf]), [(mp.log(n), mp.log(p)*(mp.mpf(n)**al + mp.mpf(n)**(-al))/mp.sqrt(n)) for n, p, k in pp], [mp.mpf(1)/2 - al, mp.mpf(1)/2 + al]
if __name__ == '__main__':
    N = int(sys.argv[1]); out = []
    Bs = wf.Basis(N); 
    for a in [float(t) for t in sys.argv[3:]]:
        NM = int(math.exp(2*a)) + 3; TAB = wf.sieve_mangoldt(NM)
        fl = {'zeta': objs.spec_zeta(NM, TAB), 'LIOU': objs.spec_signtwist(lambda p: -1, NM, 'L', TAB), 'TNR': objs.spec_tnr(3, 2.2, NM, 'zeta', TAB), 'EA': objs.spec_Ea(0.125, NM, TAB)}
        for name in ('zeta', 'EA', 'TNR', 'LIOU'):
            C, kern, tail, atoms, poles = obj(name, a); lam = []
            for par in (0, 1):
                Q = weil(polys(N, par), par, a, C, kern, tail, atoms, poles); E = mp.eigsy(Q, eigvals_only=True); lam.append(min(E))
            lf = Bs.lam(fl[name], a)
            out.append(dict(obj=name, a=a, N=N, lam_mp=[mp.nstr(l, 15) for l in lam], lam_float64=lf))
            print('%-5s a=%.3f N=%d  mp 60 digits: (%s, %s)   float64: (% .3e, % .3e)' % (name, a, N, mp.nstr(lam[0], 12), mp.nstr(lam[1], 12), lf[0], lf[1]), flush=True)
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
