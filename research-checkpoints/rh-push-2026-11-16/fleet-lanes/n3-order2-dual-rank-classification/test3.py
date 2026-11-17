# Adjacent row: order-3 symbol of the conic. T(p) = sum_m chi3(m^2-d), p = 1 mod 3, p <= 500. Arrays of length p.
import numpy as np
def primes(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = False
    return [int(x) for x in np.nonzero(s)[0]]
for d in (2, 5, -1):
    worst = 0; n = 0; reals = 0
    for p in primes(500):
        if p % 3 != 1 or (2*d) % p == 0: continue
        g = next(g for g in range(2, p) if len({pow(g, e, p) for e in range(p-1)}) == p-1)
        ind = np.zeros(p, dtype=np.int64)
        for e in range(p-1): ind[pow(g, e, p)] = e
        m = np.arange(p, dtype=np.int64); v = (m*m - d) % p
        chi = np.where(v == 0, 0, np.exp(2j*np.pi*(ind[v] % 3)/3)); T = chi.sum()
        worst = max(worst, abs(abs(T)**2 - p)); n += 1; reals += abs(T.imag) < 1e-9
    print("d=%d: %d primes p=1 mod 3, max| |T|^2 - p | = %.2e, T real at %d primes" % (d, n, worst, reals))
