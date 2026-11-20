"""Local checks for lane c19-u4-joint-prime-phase-quadratic-dp-zeros (float64; not ball arithmetic).
(1) Lemma Q2: sum_{n<P} Lambda_2(n) n^-1/2 phi(log n) = sum_beta phihat(w_beta) D''(beta)/D'(beta)
    and first order sum Lambda(n) n^-1/2 phi(log n) = - sum_beta phihat(w_beta), zeros beta of D_P, w = beta - 1/2.
(2) Sign tables of Lambda_G(q^j) for T-NR (both signs of c), HQ2, and cross-atom signs for sign chains.
"""
import json, math, cmath
import numpy as np

def lam_coeffs(a):
    """a[1..P] with a[1]=1 -> Lambda_a[1..P] (coefficients of -F'/F) and Lambda_2 (coefficients of F''/F)."""
    P = len(a) - 1
    L = [0.0] * (P + 1)
    for n in range(2, P + 1):
        s = a[n] * math.log(n)
        for d in range(2, n):
            if n % d == 0:
                s -= L[d] * a[n // d]
        L[n] = s
    L2 = [0.0] * (P + 1)
    for n in range(2, P + 1):
        s = L[n] * math.log(n)
        for d in range(2, n):
            if n % d == 0:
                s += L[d] * L[n // d]
        L2[n] = s
    return L, L2

def zeros_of(a, T):
    P = len(a) - 1
    ns = np.arange(1, P + 1, dtype=float)
    ln = np.log(ns)
    co = np.array(a[1:], dtype=complex)
    def D(s, k=0):
        return ((co * (-ln) ** k)[None, :] * np.exp(-s[:, None] * ln[None, :])).sum(axis=1)
    nz = [n for n in range(1, P + 1) if a[n] != 0]
    # left bound: last term dominates; right bound: first term dominates
    lo = -math.log(sum(abs(a[n]) for n in nz[:-1]) / abs(a[nz[-1]]) + 1) / math.log(nz[-1] / nz[-2]) - 1.0
    hi = math.log(sum(abs(a[n]) for n in nz[1:]) + 1) / math.log(2) + 1.0
    xs = np.arange(lo, hi, 0.2); ys = np.arange(-T - 1, T + 1, 0.1)
    X, Y = np.meshgrid(xs, ys)
    s = (X + 1j * Y).ravel()
    for _ in range(60):
        d1 = D(s, 1)
        step = D(s) / np.where(abs(d1) > 1e-300, d1, 1e-300)
        # damp large steps
        m = np.abs(step); step = np.where(m > 0.5, step * 0.5 / m, step)
        s = s - step
    ok = (np.abs(D(s)) < 1e-9 * (1 + np.exp(-s.real * ln[-1]))) & (np.abs(s.imag) < T)
    s = s[ok]
    s = s[np.lexsort((s.real, s.imag))]
    out = []
    for z in s:
        if not out or abs(z - out[-1]) > 1e-6:
            if all(abs(z - w) > 1e-6 for w in out[-6:]):
                out.append(z)
    out = np.array(out)
    # winding number on rectangle [lo-1, hi+1] x [-T, T]
    def seg(p, q, m):
        t = np.linspace(0, 1, m)
        return p + (q - p) * t
    m = int(40 * T * 4)
    path = np.concatenate([seg(lo - 1 - 1j * T, hi + 1 - 1j * T, 20000), seg(hi + 1 - 1j * T, hi + 1 + 1j * T, m),
                           seg(hi + 1 + 1j * T, lo - 1 + 1j * T, 20000), seg(lo - 1 + 1j * T, lo - 1 - 1j * T, m * 8)])
    vals = np.concatenate([D(path[i:i + 200000]) for i in range(0, len(path), 200000)])
    wind = np.sum(np.angle(vals[1:] / vals[:-1])) / (2 * math.pi)
    return out, wind, D

def run_identity(name, a, T):
    P = len(a) - 1
    while a[P] == 0: P -= 1
    a = a[:P + 1]
    u = math.log(P)
    L, L2 = lam_coeffs(a)
    Z, wind, D = zeros_of(a, T)
    M = 20001
    xi = np.linspace(0, u, M); h = xi[1] - xi[0]
    def phi(x): return np.sin(math.pi * x / u) ** 8 * np.exp(0.3 * x)
    ph = phi(xi)
    w = Z - 0.5
    # trapezoid (phi vanishes to order 8 at both ends)
    phat = np.array([np.sum(ph * np.exp(wk * xi)) * h for wk in w])
    lhs1 = sum(L[n] * n ** -0.5 * float(phi(np.array([math.log(n)]))[0]) for n in range(2, P))
    lhs2 = sum(L2[n] * n ** -0.5 * float(phi(np.array([math.log(n)]))[0]) for n in range(2, P))
    rhs1 = -np.sum(phat)
    ratio = D(Z, 2) / D(Z, 1)
    rhs2 = np.sum(phat * ratio)
    # the same with half the height, to show convergence
    half = np.abs(Z.imag) < T / 2
    rec = dict(series=name, P=P, T=T, zeros=len(Z), winding=round(float(wind), 3),
               right_of_half=int(np.sum(Z.real > 0.5)),
               lhs1=lhs1, rhs1=[float(rhs1.real), float(rhs1.imag)], defect1=abs(lhs1 - rhs1),
               lhs2=lhs2, rhs2=[float(rhs2.real), float(rhs2.imag)], defect2=abs(lhs2 - rhs2),
               defect1_halfT=abs(lhs1 + np.sum(phat[half])), defect2_halfT=abs(lhs2 - np.sum((phat * ratio)[half])),
               min_Lambda2=min(L2[2:]), neg_Lambda2_at=[n for n in range(2, P + 1) if L2[n] < -1e-12])
    return rec

def series_zeta(P): return [0.0] + [1.0] * P
def series_chain(P, S):
    a = [0.0] * (P + 1)
    for n in range(1, P + 1):
        m, e = n, 1.0
        for p in S:
            while m % p == 0: m //= p; e = -e
        a[n] = e
    return a
def series_Ea(P, al): 
    return [0.0] + [sum((d / (n // d)) ** al for d in range(1, n + 1) if n % d == 0) for n in range(1, P + 1)]

out = {"identity": [], "signs": {}}
T = 120
cases = [("zeta P=6", series_zeta(6)), ("zeta P=10", series_zeta(10)), ("zeta P=14", series_zeta(14)),
         ("sign chain eps(3)=-1, P=10", series_chain(10, [3])),
         ("sign chain eps(2)=eps(5)=-1, P=12", series_chain(12, [2, 5])),
         ("Liouville P=10", series_chain(10, [2, 3, 5, 7])),
         ("E_a a=0.2, P=10", series_Ea(10, 0.2)),
         ("non-multiplicative 1,1,-1,2,0.5,1,1", [0.0, 1, 1, -1, 2, 0.5, 1, 1])]
for name, a in cases:
    r = run_identity(name, a, T)
    out["identity"].append(r)
    print(json.dumps(r))

# ---- sign tables
def tnr_lambda(q, c, J):
    # local factor (1 + c sqrt(q) x + q x^2), x = q^-s ; log = -sum (r1^j + r2^j) x^j / j * (-1)... computed by series
    # Lambda_T(q^j)/log q = 1 - (r1^j + r2^j), (1 - r1 x)(1 - r2 x) = 1 + c sqrt(q) x + q x^2
    disc = cmath.sqrt(c * c * q - 4 * q)
    r1 = (-c * math.sqrt(q) + disc) / 2; r2 = (-c * math.sqrt(q) - disc) / 2
    return [float((1 - (r1 ** j + r2 ** j)).real) for j in range(1, J + 1)]
out["signs"]["T-NR q=3 c=2.2: Lambda(q^j)/log q, j=1..8"] = tnr_lambda(3, 2.2, 8)
out["signs"]["T-NR q=3 c=-2.2: Lambda(q^j)/log q, j=1..8"] = tnr_lambda(3, -2.2, 8)

def hq2_lambda(q, eps, J):
    # local factor of HQ2 relative to zeta: 1 + eps u^2/(1-u)^4, u = sqrt(q) x.  log coefficients in u^k, k=1..J
    N = J + 1
    f = np.zeros(N); 
    for k in range(2, N):
        f[k] = eps * math.comb(k + 1, 3)       # u^2/(1-u)^4 = sum_{k>=2} C(k+1,3) u^k
    # log(1+f): l_k = f_k - (1/k) sum_{j=1}^{k-1} j l_j f_{k-j}
    l = np.zeros(N)
    for k in range(1, N):
        l[k] = f[k] - sum(j * l[j] * f[k - j] for j in range(1, k)) / k
    # Lambda_HQ(q^k)/log q = 1 + k * l_k * q^(k/2)
    return [1 + k * l[k] * q ** (k / 2) for k in range(1, N)]
for eps in (0.01, 0.1, 1.0):
    v = hq2_lambda(3, eps, 40)
    neg = [k + 1 for k, x in enumerate(v) if x < 0]
    out["signs"][f"HQ2 q=3 eps={eps}: first j with Lambda(q^j)<0"] = neg[:3]
    out["signs"][f"HQ2 q=3 eps={eps}: Lambda(q^j)/log q, j=1..10"] = [float(x) for x in v[:10]]
json.dump(out, open(__import__("os").path.join(__import__("os").path.dirname(__import__("os").path.abspath(__file__)), "checks.json"), "w"), indent=1)
print(json.dumps(out["signs"], indent=1))
