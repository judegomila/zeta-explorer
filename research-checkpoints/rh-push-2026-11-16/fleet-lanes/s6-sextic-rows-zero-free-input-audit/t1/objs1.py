"""objs1.py -- column weights a_F(m), m = N(n) a rational integer <= L, for the objects of the control battery."""
import math, numpy as np
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
ALPHA = 1.2393168126993495
OBJ = ['zeta', 'chi4', 'chi5', 'DH', 'hash', 'liou', 'unimod', 'Ea25', 'randmult', 'randiid']

def hbit(x):
    x = (int(x) + 0x9E3779B97F4A7C15) & (2 ** 64 - 1)
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & (2 ** 64 - 1)
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & (2 ** 64 - 1)
    x ^= x >> 31
    return (x >> 17) & 1

def spf_table(L):
    spf = np.zeros(L + 1, np.int64)
    for i in range(2, L + 1):
        if spf[i] == 0:
            spf[i::i] = np.where(spf[i::i] == 0, i, spf[i::i])
    return spf

def coeff_tables(L, seed=11):
    """dict name -> complex array a[0..L] (a[0] unused). randiid is per column and is not in this table."""
    spf = spf_table(L)
    m = np.arange(L + 1)
    out = {'zeta': np.ones(L + 1, complex)}
    out['chi4'] = np.array([0, 1, 0, -1])[m % 4].astype(complex)
    out['chi5'] = np.array([0, 1, -1, -1, 1])[m % 5].astype(complex)
    out['DH'] = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])[m % 5].astype(complex)
    mm = np.maximum(m, 1).astype(float)
    out['unimod'] = np.exp(-1j * ALPHA * np.log(mm))
    rng = np.random.default_rng(seed)
    ph = np.exp(2j * np.pi * rng.random(L + 1))
    h = np.ones(L + 1, complex); li = np.ones(L + 1, complex); rm = np.ones(L + 1, complex); ea = np.ones(L + 1, complex)
    a = 0.25
    for v in range(2, L + 1):
        p = int(spf[v]); w = v; k = 0
        while w % p == 0: w //= p; k += 1
        e = 1 - 2 * hbit(p)
        h[v] = h[w] * (e ** k); li[v] = li[w] * ((-1) ** k); rm[v] = rm[w] * ph[p] ** k
        ea[v] = ea[w] * sum(p ** (a * (2 * i - k)) for i in range(k + 1))     # sum_{d | p^k} d^a (p^k/d)^{-a}
    out['hash'] = h; out['liou'] = li; out['randmult'] = rm; out['Ea25'] = ea
    return out
