# Check of Theorem A (truncated explicit formula in terms of the zeros of D_P) and a count of
# zeros of D_P right of Re s = 1/2.  float64, small: largest array n_s^2 complex = 1600^2*16 B = 41 MB.
import numpy as np, json, sys
def mangoldt(n):
    for p in range(2, n+1):
        if n % p == 0:
            m = n
            while m % p == 0: m //= p
            return np.log(p) if m == 1 else 0.0
    return 0.0
def zeros_DP(P, T, coeff=None):
    ns = np.arange(1, P+1); ln = np.log(ns)
    a = np.ones(P) if coeff is None else np.asarray(coeff, float)
    def D(s):  return (a*np.exp(-np.outer(s, ln))).sum(1)
    def dD(s): return (-ln*a*np.exp(-np.outer(s, ln))).sum(1)
    sig = np.arange(-8.0, 4.01, 0.25); tt = np.arange(-T-1, T+1, 0.04)
    S = (sig[:, None] + 1j*tt[None, :]).ravel()
    for _ in range(60):
        S = S - D(S)/dD(S)
        S = S[np.abs(S.real) < 30]
    S = S[np.abs(D(S)) < 1e-10]; S = S[np.abs(S.imag) <= T]
    S = S[np.lexsort((S.real, S.imag))]
    out = []
    for z in S:
        if not out or abs(z-out[-1]) > 1e-6:
            if all(abs(z-w) > 1e-6 for w in out[-6:]): out.append(z)
    return np.array(out), D
def run(P, tau, T=150.0, ns=1600, coeff=None, lam=None):
    u = np.log(P); s = (np.arange(ns)+0.5)*u/ns; ds = u/ns
    h = np.sin(np.pi*s/u)**4*np.exp(1j*tau*s)
    nrm = (abs(h)**2).sum()*ds
    # left side: -2 Re <h, A_P h>, (C_a h)(s) = h(s-a), linear interpolation
    lhs = 0.0
    for n in range(2, P):
        L = mangoldt(n) if lam is None else lam[n]
        if L == 0: continue
        a = np.log(n)
        hs = np.interp(s-a, s, h.real, left=0, right=0) + 1j*np.interp(s-a, s, h.imag, left=0, right=0)
        lhs += -2*(L*n**-0.5*(np.conj(h)*hs).sum()*ds).real
    Z, D = zeros_DP(P, T, coeff)
    xi = np.abs(s[:, None]-s[None, :])
    rhs = -u*nrm; bad = 0
    HH = np.conj(h)[:, None]*h[None, :]
    for b in Z:
        w = b-0.5
        rhs += (HH*np.exp(w*xi)).sum().real*ds*ds
        bad += w.real > 0
    return dict(P=P, tau=tau, T=T, nzeros=len(Z), expected_count=2*T*u/(2*np.pi), bad=int(bad),
                lhs=lhs/nrm, rhs=rhs/nrm, diff=(lhs-rhs)/nrm)
res = []
for P, tau in [(3, 0.0), (3, 7.0), (5, 0.0), (5, 11.3), (8, 4.0), (12, 9.0), (20, 15.0), (30, 12.0)]:
    r = run(P, tau); res.append(r); print(r, flush=True)
# a series that is not multiplicative: a = (1, 1, -1, 2, 0.5): log-coefficients computed from the series itself
P = 5; a = [1, 1, -1, 2, 0.5]
# Lambda_a(n) n^{-s} coefficients of -F'/F for n < P from the recursion  a_n log n = sum_{d|n} Lambda_a(d) a_{n/d}
lam = {1: 0.0}
for n in range(2, P+1):
    acc = a[n-1]*np.log(n)
    for d in range(2, n):
        if n % d == 0: acc -= lam[d]*a[n//d-1]
    lam[n] = acc
r = run(P, 6.0, coeff=a, lam=lam); r['series'] = 'non-multiplicative (1,1,-1,2,0.5)'; res.append(r); print(r)
json.dump(res, open('check_theorem_a.json', 'w'), indent=1)
