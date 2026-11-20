"""Validation: (a) zeta Vasyunin entries vs mpmath quadrature; (b) periodic entries vs brute-force summation over breakpoints
(mpmath, 30 digits, independent formula: sum over pieces with trigamma-free telescoping); (c) lam_min(N=250) vs the repo value 2.06e-5."""
import numpy as np, mpmath as mp, math, gram as Gm, scipy.linalg as sl
N = 250
Gz = Gm.zeta_gram(N)
mp.mp.dps = 25
def bz(m, n):   # int_0^inf {1/(mx)}{1/(nx)} dx = int_0^inf {u/m}{u/n} du/u^2 ; pieces between multiples of m and n, periodic mn
    # = sum over u-intervals; use exact piecewise integration up to U and the tail mean
    f = lambda u: (u / m - mp.floor(u / m)) * (u / n - mp.floor(u / n)) / u ** 2
    pts = sorted(set([0] + [m * i for i in range(1, 400 * n + 1)] + [n * i for i in range(1, 400 * m + 1)]))
    s = mp.mpf(0)
    for a, b in zip(pts[:-1], pts[1:]):
        ia = int(a // m); ja = int(a // n)
        # integrand (u/m - ia)(u/n - ja)/u^2 = 1/(mn) - (ia/n + ja/m)/u + ia*ja/u^2
        if a == 0: s += mp.mpf(b) / (m * n)
        else: s += (b - a) / mp.mpf(m * n) - (mp.mpf(ia) / n + mp.mpf(ja) / m) * mp.log(mp.mpf(b) / a) + ia * ja * (1 / mp.mpf(a) - 1 / mp.mpf(b))
    return s, pts[-1]
for (m, n) in [(1, 1), (1, 2), (2, 3), (3, 5), (4, 6), (5, 7)]:
    s, Umax = bz(m, n)
    # tail beyond Umax: mean of {u/m}{u/n} is 1/4 for m != n coprime-ish (1/3 if m == n) -> tail ~ mean/Umax
    mean = 1 / 3 if m == n else (0.25 + (math.gcd(m, n) ** 2) / (12.0 * m * n))
    print('zeta b(%d,%d): vasyunin %.10f  brute %.10f (+tail %.10f)' % (m, n, Gz[m - 1, n - 1], float(s) + mean / Umax, mean / Umax))
w = sl.eigvalsh(Gz)
print('zeta lam_min(250) = %.6e (repo: 2.06e-5); I(1,1)=%.12f (log 2pi - gamma = %.12f)' % (w[0], Gz[0, 0], math.log(2 * math.pi) - np.euler_gamma))
# periodic
names = list(Gm.VECS)
Gs = Gm.periodic_gram(60, names, 0.5)
def brute(a, h, k, periods=4000):
    a = [complex(x) for x in a]
    Ap = [0]
    for j in range(5): Ap.append(Ap[-1] + a[j])
    A = lambda j: Ap[j % 5]
    P = 5 * h * k
    pts = sorted(set([h * i for i in range(1, 5 * k + 1)] + [k * i for i in range(1, 5 * h + 1)]))
    # pieces [x_i, x_{i+1}) within one period (0,P]; value on [x_i, x_{i+1}) : A(floor(x_i/h)) conj(A(floor(x_i/k)))
    s = mp.mpc(0)
    xs = [0] + pts
    for a_, b_ in zip(xs[:-1], xs[1:]):
        val = A(a_ // h) * np.conj(A(a_ // k))
        if val == 0: continue
        # sum_j [1/(a+jP) - 1/(b+jP)] = (psi(b/P) - psi(a/P))/P ; a = 0 piece has val = 0
        s += mp.mpc(val) * (mp.digamma(mp.mpf(b_) / P) - mp.digamma(mp.mpf(a_) / P)) / P
    return complex(s)
mx = 0
for v in names:
    for (h, k) in [(1, 1), (1, 2), (2, 1), (3, 7), (7, 3), (4, 6), (10, 15), (5, 3), (25, 10), (59, 60), (60, 59), (12, 35)]:
        g = math.gcd(h, k)
        b = brute(Gm.VECS[v], h // g, k // g) / g
        e = abs(b - Gs[v][h - 1, k - 1]); mx = max(mx, e)
        if (h, k) in [(1, 1), (3, 7), (25, 10)]: print(v, h, k, Gs[v][h - 1, k - 1], b)
print('periodic: max |closed form - brute| over samples', mx)
for v in names:
    G = Gs[v]; w = sl.eigvalsh(G)
    print(v, 'N=60 lam_min %.4e lam_max %.4f herm defect %.1e F(1)=%s' % (w[0], w[-1], np.abs(G - G.conj().T).max(), Gm.F1(v)))
# independent check of one periodic entry through the frequency side for CHI5R (real character): G(1,1) = sum_j |Ap(j)|^2 (1/j - 1/(j+1))
a = Gm.VECS['CHI5R']; Ap = np.concatenate([[0], np.cumsum(a)])
s = sum(abs(Ap[j % 5]) ** 2 * (1 / j - 1 / (j + 1)) for j in range(1, 2000000))
print('CHI5R G(1,1) direct series', s, 'closed', Gs['CHI5R'][0, 0])
