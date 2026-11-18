"""Controls for LP-E: same LP with the integers replaced by a weight sequence w and Lambda_w = w^{-1} * (w log).
E_a: w = coefficients of zeta(s+a) zeta(s-a) (Lambda_w = Lambda (n^a + n^-a) >= 0).
Liouville: w = lambda (Lambda_w = lambda Lambda, signed).  DH: w = Davenport-Heilbronn coefficients (period 5)."""
import sys, math, json, numpy as np
from lrlib import *

def dconv_inv_apply(w, h, X):
    """Lambda_w = w^{-1} * h  (w(1) = 1)"""
    inv = np.zeros(X + 1); acc = np.zeros(X + 1)
    for n in range(1, X + 1):
        inv[n] = (1.0 if n == 1 else 0.0) - acc[n]
        top = X // n
        if top >= 2: acc[2 * n: top * n + 1: n] += inv[n] * w[2: top + 1]
    out = np.zeros(X + 1)
    for d in range(1, X + 1):
        if inv[d] != 0.0: out[d:: d] += inv[d] * h[1: X // d + 1]
    return out

def run(name, w, X, k, th, main=None, norm=None):
    m = np.arange(X + 1, dtype=np.float64); lg = np.zeros(X + 1); lg[1:] = np.log(m[1:])
    h = w * lg
    lamw = dconv_inv_apply(w, h, X)
    truth = float(np.sum(lamw * (1 - m / X) ** k) / FACT[k])
    sysm = Sys(X, k, w=w, hrhs=h)
    D = int(round(X ** th))
    r = solve(sysm, D)
    rec = dict(name=name, X=X, k=k, theta=th, D=D, min_Lambda_w=float(lamw.min()), neg_count=int((lamw < -1e-12).sum()),
               neg_mass=float(-lamw[lamw < 0].sum()), truth=truth, status=r['status'])
    if r['status'] == 0:
        rec.update(val=r['val'], val_minus_truth=r['val'] - truth, worst=float(r['worst']), it=r['it'])
        if main is not None: rec.update(main=main, excess=r['val'] - main, norm=norm, excess_over_norm=(r['val'] - main) / norm, excess_over_sqrtX=(r['val'] - main) / math.sqrt(X))
    else: rec.update(msg=str(r.get('msg'))[:120])
    print(json.dumps(rec), flush=True); return rec

out = []
k, th = 1, 0.7
for X in (1000, 10000, 100000):
    m = np.arange(X + 1, dtype=np.float64)
    # zeta
    w = np.ones(X + 1); w[0] = 0
    out.append(run('zeta', w, X, k, th, main=X / FACT[k + 1], norm=math.sqrt(X)))
    # E_a
    for a in (0.1, 0.2):
        pa = np.zeros(X + 1); pa[1:] = m[1:] ** a; pm = np.zeros(X + 1); pm[1:] = m[1:] ** -a
        w = np.zeros(X + 1)
        for d in range(1, X + 1): w[d:: d] += pa[d] * pm[1: X // d + 1]
        main = sum(X ** (1 + s) / X ** 0 / np.prod([(j + 1 + s) for j in range(k + 1)]) for s in (a, -a))
        out.append(run(f'E_a a={a}', w, X, k, th, main=main, norm=X ** (0.5 + a)))
    if X <= 10000:
        # Liouville
        lam = sieve_lambda(X); om = np.zeros(X + 1, dtype=np.int64)
        for p in np.nonzero((lam > 0))[0]:
            # p is a prime power q^j; add 1 on multiples (counts Omega)
            om[p:: p] += 1
        w = np.where(om % 2 == 0, 1.0, -1.0); w[0] = 0
        out.append(run('Liouville', w, X, k, th))
        # sign twist with eps_n = +-1 pseudo-random completely multiplicative on primes
        # DH
        xi = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
        per = np.array([0, 1, xi, -xi, -1]); w = per[np.arange(X + 1) % 5].astype(float); w[0] = 0
        out.append(run('DH', w, X, k, th))
json.dump(out, open('out/controls.json', 'w'), indent=0)
