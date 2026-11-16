# Harmonic (linear-mode) evaluation of the Dyson defect from the diagonal prime form factor.
# Q_lin(L) = -(2/L^2) sum_{n<e^L} Lambda(n)^2/n * W(2 pi log n / L),  W(k) = (2pi-k)(1-cos k)/k ; ramp value = -1.
import numpy as np, math
X = 10**8
sieve = np.ones(X + 1, dtype=bool); sieve[:2] = False
for i in range(2, int(X ** 0.5) + 1):
    if sieve[i]: sieve[i * i::i] = False
pr = np.nonzero(sieve)[0].astype(np.float64)
lp = np.log(pr)
def W(k): return (2 * math.pi - k) * (1 - np.cos(k)) / k
def Qlin(L):
    tot = 0.0
    kmax = 60 if True else 1
    for m in range(1, 60):
        y = m * lp
        msk = (y < L) & (pr ** m <= 1e300) if m < 30 else (y < L)
        if not msk.any(): break
        tot += np.sum(lp[msk] ** 2 * np.exp(-y[msk]) * W(2 * math.pi * y[msk] / L))
    # tail n > X (primes only, PNT density): int_{log X}^{L} y W(2 pi y / L) dy
    a = math.log(X)
    if L > a:
        ys = np.linspace(a, L, 200001); f = ys * W(2 * math.pi * ys / L)
        tot += np.trapezoid(f, ys)
    return -(2 / L ** 2) * tot
for L in [5, 7, 9, 12, 16.62, 21.19, 25.8, 30, 40, 60, 100, 200]:
    q = Qlin(L)
    print('L=%6.2f  Q_lin=%.5f  Q+1=%.5f  L^2(Q+1)=%.3f  L^3(Q+1)=%.1f' % (L, q, q + 1, L * L * (q + 1), L ** 3 * (q + 1)))
