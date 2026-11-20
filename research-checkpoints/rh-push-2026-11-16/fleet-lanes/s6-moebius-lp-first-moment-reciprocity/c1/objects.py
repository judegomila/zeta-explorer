"""Objects for the LP: coefficients w(n), phase u(n) of Lambda_w(n), truth Lambda_w(n), main term of psi_k/X^k."""
import numpy as np, math
from lp import *

XI_DH = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
CHI = {'chi4': np.array([0, 1, 0, -1.0]), 'chi5': np.array([0, 1, -1, -1, 1.0]), 'chi3': np.array([0, 1, -1.0])}

def liouville(X):
    return mult_from_primes(X, lambda p, j: -1.0 if j % 2 else 1.0)

def rand_sign(X, seed=7):
    rng = np.random.default_rng(seed); ps = primes_upto(X); eps = dict(zip(ps.tolist(), rng.choice([-1.0, 1.0], size=len(ps)).tolist()))
    return mult_from_primes(X, lambda p, j: eps[p] ** j), eps

def make(name, X, k, **kw):
    """returns dict(w, u, lam (truth Lambda_w), main (smooth main term of psi_k^w(X)/X^k), note)"""
    m = np.arange(X + 1, dtype=np.float64)
    if name == 'zeta':
        w = np.ones(X + 1); w[0] = 0; lam = lambda_arr(X); u = np.ones(X + 1)
        main = X / FACT[k + 1]
    elif name in CHI:
        per = CHI[name]; w = per[np.arange(X + 1) % len(per)].astype(float); w[0] = 0
        lam = lambda_arr(X) * w; u = w.copy(); main = 0.0
    elif name in ('ded4', 'ded5'):
        per = CHI['chi' + name[-1]]; chi = per[np.arange(X + 1) % len(per)].astype(float)
        w = mult_from_primes(X, lambda p, j: sum(per[p % len(per)] ** i for i in range(j + 1)))
        lam = lambda_arr(X) * (1 + chi); u = np.ones(X + 1)
        if kw.get('mode') == 'drop': u = (chi >= 0).astype(float)      # rows with chi(n) = -1 dropped (Lambda_w(n) = 0 there)
        main = X / FACT[k + 1]
    elif name == 'Ea':
        a = kw['a']; pa = np.zeros(X + 1); pa[1:] = m[1:] ** a
        # w(n) = sum_{d|n} d^a (n/d)^-a = n^-a sigma_{2a}(n): multiplicative
        w = mult_from_primes(X, lambda p, j: sum(p ** (a * (2 * i - j)) for i in range(j + 1)))
        lam = lambda_arr(X); lam[1:] *= (m[1:] ** a + m[1:] ** -a); u = np.ones(X + 1)
        main = sum(X ** s / np.prod([(s + j) for j in range(k + 1)]) for s in (1 + a, 1 - a))
    elif name == 'TNR':
        q = kw['q']; c = kw['c']
        # zeta(s) (1 + c q^{1/2} q^{-s} + q q^{-2s});  local factor at q: 1/(1-u) * (1 + c sqrt q u + q u^2), u = q^-s
        g = [1.0, c * math.sqrt(q), q]
        w = np.ones(X + 1); w[0] = 0
        if q <= X:
            def fq(p, j):
                return sum(g[i] for i in range(min(j, 2) + 1)) if p == q else 1.0
            idx = np.arange(q, X + 1, q); w[idx] = 1 + g[1]
            if q * q <= X: w[np.arange(q * q, X + 1, q * q)] = 1 + g[1] + g[2]
        lam = lambda_arr(X)
        dl = math.acosh(c / 2); al = math.sqrt(q) * math.exp(dl); be = math.sqrt(q) * math.exp(-dl)
        u = np.ones(X + 1); qq = q; j = 1
        while qq <= X:
            extra = (-1) ** (j + 1) * (al ** j + be ** j) * math.log(q)
            lam[qq] += extra; u[qq] = 1.0 if lam[qq] >= 0 else -1.0; qq *= q; j += 1
        main = X / FACT[k + 1]
    elif name == 'liouville':
        w = liouville(X); lam = lambda_arr(X, (lambda p, j: (-1.0) ** j, False)); u = w.copy(); main = -X / FACT[k + 1]
    elif name == 'randsign':
        w, eps = rand_sign(X, kw.get('seed', 7)); lam = lambda_arr(X, (lambda p, j: eps[p] ** j, False)); u = w.copy(); main = 0.0
    elif name == 'unimod':
        al = kw['alpha']; w = np.zeros(X + 1, dtype=np.complex128); w[1:] = np.exp(-1j * al * np.log(m[1:]))
        lam = lambda_arr(X) * w; u = w.copy()
        s = 1 - 1j * al; main = X ** s / np.prod([(s + j) for j in range(k + 1)])
    elif name == 'DH':
        per = np.array([0, 1, XI_DH, -XI_DH, -1]); w = per[np.arange(X + 1) % 5].astype(float); w[0] = 0
        lam, _ = lambda_from_w(w, X)
        mode = kw.get('mode', 'pos')
        if mode == 'pos': u = np.ones(X + 1)                       # the zeta premise Lambda_w >= 0 (false)
        elif mode == 'chi': u = np.sign(CHI['chi5'][np.arange(X + 1) % 5]) # sign pattern of a character (false)
        else: u = np.sign(lam)                                    # oracle: true signs of Lambda_w
        main = 0.0
    else: raise ValueError(name)
    return dict(w=w, u=u, lam=lam, main=main)

def truth(lam, X, k):
    n = np.arange(X + 1, dtype=np.float64)
    return np.sum(lam * (1 - n / X) ** k) / FACT[k]
