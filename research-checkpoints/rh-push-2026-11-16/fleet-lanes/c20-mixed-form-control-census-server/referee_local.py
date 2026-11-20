# Referee rerun, independent of the moment code and of the ball code: dense Lambda_2 by direct convolution, direct float64 sums,
# closed-form c written from the definition (sin^4 autocorrelation by numerical quadrature, not from cterms).
import math, numpy as np
def run(t, th, w, tau, deleted=False, liou=False):
    P = int(math.floor((t / (2 * math.pi)) ** th + 1e-9)); u = math.log(P); tw = t + 200.0 * w; x = tw + tau; Lg = math.log(tw / 2 / math.pi)
    N = P - 1
    sieve = np.ones(N + 1, dtype=bool); sieve[:2] = False
    for p in range(2, int(N ** 0.5) + 1):
        if sieve[p]: sieve[p * p::p] = False
    lam = np.zeros(N + 1)
    for p in np.nonzero(sieve)[0].tolist():
        q = p; k = 1
        while q <= N: lam[q] = math.log(p) * ((-1) ** k if liou else 1); q *= p; k += 1
    l2 = lam * np.log(np.maximum(np.arange(N + 1), 1.0))
    for m in np.nonzero(lam)[0].tolist():
        k = N // m
        if k >= 2: l2[m * np.arange(2, k + 1)] += lam[m] * lam[2:k + 1]
    # autocorrelation of sin^4(pi s/u) by Simpson on a fine grid, then interpolation at log n by direct quadrature per point (vectorised in blocks)
    n = np.arange(2, N + 1); ln = np.log(n)
    M = 2000; s = (np.arange(M) + 0.5) / M          # midpoint rule in s/u; the integrand is a trigonometric polynomial, so the rule is exact to rounding
    c = np.empty(len(n))
    for i0 in range(0, len(n), 4000):
        y = ln[i0:i0 + 4000] / u
        S = s[None, :] * (1 - y[:, None])          # s in [0, 1-y]
        c[i0:i0 + 4000] = (np.sin(math.pi * S) ** 4 * np.sin(math.pi * (S + y[:, None])) ** 4).mean(1) * (1 - y) * u
    c0 = 35 * u / 128
    ph = np.exp(-1j * ((x * ln) % (2 * math.pi))) / np.sqrt(n)
    S1 = (lam[2:] * c * ph).sum(); S2 = (l2[2:] * c * ph).sum()
    T1n = (Lg - 2 * S1.real / c0) / Lg; T2n = (Lg * Lg / 2 - 2 * Lg * S1.real / c0 + 2 * S2.real / c0) / Lg ** 2
    K = 2 * S1.imag / c0 / Lg
    return P, T1n, T2n, (T1n * T1n - K * K) / 2
for args, ball in (((1e6, 0.95, 121, -22.65999999999729), -0.009476408061), ((1e6, 0.95, 487, -2.339999999994113, False, True), -0.038108732948)):
    P, T1n, T2n, sect = run(*args)
    print(args[:4], 'P', P, 'T1n %.6f T2n %.9f (ball value %.9f, difference %.1e) sector term %.6f bracket %.6f' % (T1n, T2n, ball, T2n - ball, sect, T2n - sect))
