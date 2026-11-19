"""R5: activation edge cases. x chosen at the exact threshold where N0+m first becomes active (smallest s for that set),
and very large s. mpmath 40 digits for the threshold, sums in mpmath (few terms) or numpy (large s)."""
import math, numpy as np
from mpmath import mp, mpf, log, exp, pi, floor, sqrt
mp.dps = 40
N0 = 690988; v0 = log(N0); Vm = mpf(2689) / 200; Vp = mpf(6723) / 500; DEL = mpf(10) ** -12
worstA = worstD = 0
for (h, tl, tr) in [(mpf(2), mpf(0), mpf(1) / 400), (mpf('1.21'), mpf(43) / 400, mpf(87) / 800), (mpf(6), mpf(0), mpf(1) / 400), (mpf('3.63'), mpf(43) / 400, mpf(87) / 800), (mpf('1.826'), mpf(9) / 400, mpf(1) / 40)]:
    d = (h - 1) / 2; p = (h + 1) / 2; a = tl * Vm / 2; k = a + d; c = a + h; U = 1 / d - 1 / p
    C = exp(-tl * Vm ** 2 / 4 - d * Vm + mpf(1) / 5000)
    Aa = Vp / (2 * d) + 1 / (2 * d * d); Ak = Vp * U / 2 + (1 / d ** 2 - 1 / p ** 2) / 2; Bk = U / 2; Ac = Vp / (2 * p) + 1 / (2 * p * p); Bc = 1 / p
    A3 = lambda s: exp(-a * s) / d - U * exp(-k * s) - exp(-c * s) / p
    D3 = lambda s: Aa * exp(-a * s) - (Ak + Bk * s) * exp(-k * s) - (Ac + Bc * s) * exp(-c * s)
    for t in (tl, tr):
        for m in (1, 2, 3, 10, 100):
            # smallest x with N(x) = N0+m : x/(4 pi) + t/16 = (N0+m)^2
            x = 4 * pi * ((N0 + m) ** 2 - t / 16); L = log(x / (4 * pi)); s = L / 2 - v0
            assert floor(sqrt(x / (4 * pi) + t / 16) + mpf(10) ** -30) == N0 + m and s > 0
            aA = aD = mpf(0)
            for n in range(N0 + 1, N0 + m + 1):
                ln = log(n); base = exp(t * ln ** 2 / 4 - (mpf(1) / 2 + t * L / 4) * ln)
                f1 = base * exp(-h * ln / 2); f2 = base * exp(-h * (L - ln) / 2)
                aA += f1 + f2; aD += ln / 2 * f1 + (L - ln) / 2 * f2
                assert ln - v0 <= s + DEL
            u = s + DEL
            rA = aA / (C * A3(u)); rD = aD / (C * D3(u)); worstA = max(worstA, rA); worstD = max(worstD, rD)
            print('h=%s t=%s first activation of N0+%d: s=%s  actual/(C A(u))=%s  actual/(C D(u))=%s  actual/(2Cu)=%s' % (mp.nstr(h, 5), mp.nstr(t, 5), m, mp.nstr(s, 6), mp.nstr(rA, 10), mp.nstr(rD, 10), mp.nstr(aA / (2 * C * u), 10)))
    # very large s with numpy (float64): s = 3.0 -> N ~ 1.39e7 ; planned allocation 1.4e7 float64 x 5 arrays ~ 0.6 GB
    for t in (float(tl), float(tr)):
        for s in (3.0,):
            L = 2 * (float(v0) + s); N = int(math.isqrt(int(math.exp(L) + t / 16)))
            ln = np.log(np.arange(N0 + 1, N + 1, dtype=np.float64)); base = np.exp(t * ln ** 2 / 4 - (0.5 + t * L / 4) * ln)
            f1 = base * np.exp(-float(h) * ln / 2); f2 = base * np.exp(-float(h) * (L - ln) / 2)
            aA = float((f1 + f2).sum()); aD = float((ln / 2 * f1 + (L - ln) / 2 * f2).sum()); u = mpf(s) + DEL
            rA = aA / (C * A3(u)); rD = aD / (C * D3(u)); worstA = max(worstA, rA); worstD = max(worstD, rD)
            print('h=%s t=%g s=%g N=%d: actual/(C A(u))=%s actual/(C D(u))=%s' % (mp.nstr(h, 5), t, s, N, mp.nstr(rA, 10), mp.nstr(rD, 10)))
            del ln, base, f1, f2
print('worst ratios: A', mp.nstr(worstA, 12), ' D', mp.nstr(worstD, 12), ' (<= 1 required)')
