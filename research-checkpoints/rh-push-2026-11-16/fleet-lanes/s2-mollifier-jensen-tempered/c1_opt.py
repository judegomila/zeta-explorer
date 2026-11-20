"""Best tempered multiplicative mollifier for DH (training window, not in the test set).
b(n) = mu(n) prod_{p|n} c(p), c(p) = c_{p mod 5} for p > PMAX, free c(p) for p <= PMAX, all |c| <= 1. Objectives: mean |V psi|^2 (OPTJ), Jensen gap (OPTG).
Usage: c1_opt.py T [PMAX]"""
import sys, json, math, numpy as np, scipy.optimize as so
import core, c1lib
from core import *
T = float(sys.argv[1]); PMAX = int(sys.argv[2]) if len(sys.argv) > 2 else 31
R = 1.3; out = {}
for th in (0.5, 4 / 7):
    y = int(T ** th); tc = 0.71 * T; H = 6000.0
    h, M, Smax = c1lib.window_setup(tc, H, y)
    n = np.arange(1, Smax + 1)
    coefs = {'one': xp.ones(Smax, dtype=xp.complex128), 'chi': xp.asarray(CHI5[n % 5]), 'chib': xp.asarray(np.conj(CHI5[n % 5]))}
    V, w, info = c1lib.all_V(tc, h, M, Smax, R, coefs, want=('DH',))
    Vd = asnp(V['DH']); tt = asnp(w.tau)
    mu = mobius_upto(y); sq = np.nonzero(mu[1:])[0] + 1
    announce('basis matrix complex128[%d x %d]' % (M, len(sq)), 16 * M * len(sq))
    P = np.log(y / sq) / math.log(y)
    ph = np.outer(tt + tc, np.log(sq))
    E = (np.cos(ph) - 1j * np.sin(ph)) * (mu[sq] * P / np.sqrt(sq))[None, :] * Vd[:, None]
    del ph
    pr = primes_upto(y); small = [int(p) for p in pr if p <= PMAX and p != 5]
    # factor table: for each squarefree n, exponent pattern
    fac = {int(p): (sq % p == 0) for p in pr}
    cls = {r: np.zeros(len(sq)) for r in range(1, 5)}
    for p in pr:
        if p > PMAX and p != 5: cls[int(p) % 5] += fac[int(p)]
    has5 = fac[5] if 5 in fac else np.zeros(len(sq), bool)
    def cvec(x):
        z = x[0::2] + 1j * x[1::2]; c = z / np.sqrt(1 + np.abs(z) ** 2) * 1.0
        c = z / np.maximum(1.0, np.abs(z))          # projection on the closed unit disc
        b = np.ones(len(sq), dtype=np.complex128)
        for r in range(1, 5): b *= c[r - 1] ** cls[r]
        for i, p in enumerate(small): b *= np.where(fac[p], c[4 + i], 1.0)
        b[has5] = 0
        return b, c
    def objJ(x):
        b, c = cvec(x); A2 = np.abs(E @ b) ** 2; return math.log(A2.mean())
    def objG(x):
        b, c = cvec(x); A2 = np.abs(E @ b) ** 2; return math.log(A2.mean()) - np.log(A2).mean()
    res = {}
    for name, obj in (('OPTJ', objJ), ('OPTG', objG)):
        best = None
        starts = {'zero': np.zeros(2 * (4 + len(small))), 'chi': None, 'chibar': None, 'half': None}
        def start_from(f):
            x = np.zeros(2 * (4 + len(small)))
            for r in range(1, 5): x[2*(r-1)] = f(r).real; x[2*(r-1)+1] = f(r).imag
            for i, p in enumerate(small): x[2*(4+i)] = f(p % 5).real; x[2*(4+i)+1] = f(p % 5).imag
            return x
        starts['chi'] = start_from(lambda r: CHI5[r]); starts['chibar'] = start_from(lambda r: np.conj(CHI5[r]))
        starts['half'] = start_from(lambda r: 0.5 * CHI5[r].real + 0j)
        for sn, x0 in starts.items():
            r = so.minimize(obj, x0, method='Powell', options={'maxiter': 6000, 'xtol': 1e-3, 'ftol': 1e-6})
            print('theta %.4f %s start %s: start value %.4f -> %.4f' % (th, name, sn, obj(x0), r.fun), flush=True)
            if best is None or r.fun < best[0]: best = (r.fun, r.x, sn)
        b, c = cvec(best[1])
        res[name] = {'class': [[float(v.real), float(v.imag)] for v in c[:4]], 'primes': {str(p): [float(c[4+i].real), float(c[4+i].imag)] for i, p in enumerate(small)},
                     'objective': float(best[0]), 'start': best[2], 'none_value': float(obj(np.zeros(2 * (4 + len(small)))))}
        print(th, name, json.dumps(res[name]), flush=True)
    out['%.4f' % th] = res
json.dump(out, open('dhopt_T%g.json' % T, 'w'), indent=1)
