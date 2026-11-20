# independent check of the ZQ float path: density terms by direct quadrature (no bins, no moments)
import math, numpy as np, mixed
t, th, w = 1e4, 0.95, 2
P = mixed.P_of(t, th); u = math.log(P); tw = t + 200.0 * w; Lg = math.log(tw / 2 / math.pi); c0 = 35 * u / 128
pp = mixed.PP(P); lam = pp.lam(('zeta',)); n = pp.n.astype(float); ln = np.log(n)
ct = mixed.cterms(u)
cfun = lambda x: sum((al + be * x) * np.exp(1j * nu * x) for al, be, nu in ct)
d1, d2 = -0.37, 0.52
taus = np.arange(-mixed.HW, mixed.HW + mixed.STEP / 2, mixed.STEP)[::5]; idx = [0, 137, 399, 400, 401, 410, 555, 800]
xi = np.linspace(0, u, 400001); hq = xi[1] - xi[0]
def integ(f):   # Simpson
    return hq / 3 * (f[0] + f[-1] + 4 * f[1:-1:2].sum() + 2 * f[2:-1:2].sum())
for eta in (0.01, 0.1):
    recs, _ = mixed.job((t, th, w, (d1, d2), [('zeta',), ('ZQ', eta)], ('zeta', 'ZQ')))
    r = recs[1]
    db = (d1 + d2) / 2
    V = [(1j * d1, 1), (1j * d2, 1), (eta + 1j * db, -1), (-eta + 1j * db, -1)]        # demodulated exponents
    worst = 0
    for i in idx:
        tau = taus[i]
        ph = lam / np.sqrt(n) * np.exp(-1j * (tw + tau) * ln)
        S1 = (ph * cfun(ln)).sum(); Sl = (ph * ln * cfun(ln)).sum()
        Sc = 0
        for m in range(len(n)):
            k = (P - 1) // int(n[m]); sel = pp.n <= k
            Sc += ph[m] * (ph[sel] * cfun(ln[m] + ln[sel])).sum()
        ce = cfun(xi) * np.exp(-1j * tau * xi)
        kk = sum(s * np.exp(v * xi) for v, s in V)
        S1 += integ(ce * kk); Sl += integ(ce * xi * kk)
        # k*k
        kc = 0
        for v1, s1 in V:
            for v2, s2 in V:
                kc = kc + s1 * s2 * (xi * np.exp(v1 * xi) if v1 == v2 else (np.exp(v1 * xi) - np.exp(v2 * xi)) / (v1 - v2))
        Sc += integ(ce * kc)
        # 2 (Lambda~ * k): sum_n Lambda n^(-1/2 - i tw) [n^(-i tau)] int_{log n}^u c(xi) e^{-i tau xi} k(xi - log n) e^{...}: demodulated convolution
        for m in range(len(n)):
            x2 = np.linspace(ln[m], u, 4001); h2 = x2[1] - x2[0]
            f = cfun(x2) * np.exp(-1j * tau * x2) * sum(s * np.exp(v * (x2 - ln[m])) for v, s in V)
            Sc += 2 * lam[m] / math.sqrt(n[m]) * np.exp(-1j * tw * ln[m]) * h2 / 3 * (f[0] + f[-1] + 4 * f[1:-1:2].sum() + 2 * f[2:-1:2].sum())
        T2 = (Lg * Lg / 2 - 2 * Lg * S1.real / c0 + 2 * (Sl + Sc).real / c0) / Lg ** 2
        worst = max(worst, abs(T2 - r['T2n_grid'][i]))
        print(eta, 'tau %.1f' % tau, 'quadrature %.10f pipeline %.10f zeta %.10f' % (T2, r['T2n_grid'][i], recs[0]['T2n_grid'][i]))
    print('eta', eta, 'max abs difference', worst)
