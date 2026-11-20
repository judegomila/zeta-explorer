"""Shared definitions for lane s6: coefficient vectors c(n) of -F'/F and archimedean data of each object.
Weil symbol: w(t) = const + sum_z Re psi(z + i t/2) - sum_n 2 c(n) n^(-1/2) cos(t log n)   (form: (1/2pi) int w |ghat|^2 + pole terms)."""
import math
import numpy as np
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
LOGPI = math.log(math.pi)
TNR_Q, TNR_C = 1000003, 2.1
UNI_TAU = 1.2393

def mangoldt(N):
    """Lambda(n) for n <= N (float array), and the base prime of each prime power (0 otherwise)"""
    lam = np.zeros(N + 1); base = np.zeros(N + 1, dtype=np.int64)
    sieve = np.ones(N + 1, dtype=bool); sieve[:2] = False
    for i in range(2, int(N ** 0.5) + 1):
        if sieve[i]: sieve[i * i::i] = False
    for p in np.nonzero(sieve)[0]:
        q = int(p); lp = math.log(q)
        while q <= N:
            lam[q] = lp; base[q] = p; q *= int(p)
    return lam, base

def dh_lambda(N):
    """Lambda_DH(n), n <= N: a(n) log n = sum_{d | n} Lambda(d) a(n/d), a periodic mod 5: (1, kappa, -kappa, -1, 0)"""
    a = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])[np.arange(N + 1) % 5]
    acc = a * np.log(np.maximum(np.arange(N + 1), 1))
    for d in range(2, N // 2 + 1):
        if acc[d] != 0.0: acc[2 * d::d] -= acc[d] * a[2:N // d + 1]
    acc[:2] = 0.0
    return acc

def obj(name, N):
    """returns dict: n (int array), c (coefficients of -F'/F at n, real or complex), gam (list of z), const, poles (list of tau: pole pair at 1/2 +- tau), note"""
    lam, base = mangoldt(N); n = np.arange(N + 1)
    d = dict(gam=[0.25], const=-LOGPI, poles=[0.5], hermitian=False)
    if name == 'zeta': c = lam
    elif name == 'p2only': c = np.where(base == 2, lam, 0.0)
    elif name == 'chim4': c = lam * np.array([0, 1, 0, -1.0])[n % 4]; d.update(gam=[0.75], const=math.log(4) - LOGPI, poles=[])
    elif name == 'chi5': c = lam * np.array([0, 1, -1, -1, 1.0])[n % 5]; d.update(const=math.log(5) - LOGPI, poles=[])
    elif name.startswith('ea'):
        a = float(name[2:] or 0.2); ln = np.log(np.maximum(n, 1))
        c = lam * (np.exp(a * ln) + np.exp(-a * ln)); d.update(gam=[0.25 + a / 2, 0.25 - a / 2], const=-2 * LOGPI, poles=[0.5 + a, 0.5 - a])
    elif name == 'tnr':
        c = lam.copy(); q = TNR_Q; disc = math.sqrt(TNR_C ** 2 - 4); r1 = -math.sqrt(q) * (TNR_C + disc) / 2; r2 = -math.sqrt(q) * (TNR_C - disc) / 2
        k = 1
        while q ** k <= N: c[q ** k] -= math.log(q) * (r1 ** k + r2 ** k); k += 1
        d.update(const=-LOGPI + 2 * math.log(q))
    elif name == 'dh': c = dh_lambda(N); d.update(gam=[0.75], const=math.log(5) - LOGPI, poles=[])
    elif name == 'liou':
        c = lam.copy(); kk = np.zeros(N + 1, dtype=np.int64); nz = base > 0
        kk[nz] = np.rint(np.log(n[nz]) / np.log(base[nz])).astype(np.int64); c = np.where(kk % 2 == 1, -lam, lam)
    elif name == 'uni':
        c = lam * np.exp(-1j * UNI_TAU * np.log(np.maximum(n, 1))); d.update(hermitian=True)
    else: raise ValueError(name)
    nz = np.nonzero(c)[0]
    d.update(name=name, n=nz, c=c[nz])
    return d

def arch(o, t):
    """archimedean part of the symbol at real t (numpy array)"""
    from scipy.special import digamma
    out = np.full(len(t), o['const'])
    for z in o['gam']: out += digamma(z + 0.5j * t).real
    return out

if __name__ == '__main__':
    lam, base = mangoldt(100)
    assert abs(lam[64] - math.log(2)) < 1e-15 and lam[6] == 0 and abs(lam[97] - math.log(97)) < 1e-15
    L = dh_lambda(100)
    print('DH c(2), c(3), c(4), c(6), c(7):', L[2], L[3], L[4], L[6], L[7], '(route 30: 0.19690858829, -0.31209..., -1.44223196461, 1.93635607662, 0.5528)')
    o = obj('zeta', 10); print('2theta\'(0) =', arch(o, np.array([0.0]))[0], ' w_2all(0) =', arch(o, np.array([0.0]))[0] - 2 * math.log(2) / (math.sqrt(2) - 1), '(source -8.719)')
    o = obj('tnr', 2 * 10 ** 6); i = list(o['n']).index(TNR_Q); print('tnr c(q)/sqrt(q)/log q =', o['c'][i] / math.sqrt(TNR_Q) / math.log(TNR_Q), '(= c + q^-1/2)')
