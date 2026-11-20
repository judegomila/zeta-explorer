"""Combination 4: detection support of a planted off-line quadruple (1/2 +- b +- i gamma0) in zeta, minimised over the
frame span (band of half-width OMEGA around gamma; gamma = 100: whole low band), and T-NR(q) near 2a = log q.
usage: python detect.py pair out.json [gammas] | python detect.py tnr out.json q
env: RH_WORKERS, OMEGA (40), STEP (0.05), NOFF (12)"""
import os, sys
os.environ['OMP_NUM_THREADS'] = '1'; os.environ['OPENBLAS_NUM_THREADS'] = '1'
import math, json, time
import numpy as np
import multiprocessing as mp
from symlib import *

OMEGA = float(os.environ.get('OMEGA', '40')); STEP = float(os.environ.get('STEP', '0.05')); NOFF = int(os.environ.get('NOFF', '12'))
BS = [0.5, 0.4, 0.3, 0.2, 0.1, 0.01]
OBJ = {}

def model_support(b, L):
    f = lambda x: math.sinh(x * b) / b - x - L
    lo, hi = 0.0, 1.0
    while f(hi) < 0: hi *= 2
    for _ in range(80):
        mid = (lo + hi) / 2
        if f(mid) < 0: lo = mid
        else: hi = mid
    return hi

def pair_task(args):
    gam, twoa = args
    a = twoa / 2; L = math.log(gam / (2 * math.pi)); sp = 2 * math.pi / L
    full = gam <= 150
    nu = lattice(a, gam + OMEGA, 2.0, 0.0) if full else lattice(a, OMEGA, 2.0, gam)
    if full: A, B = symbols(OBJ['ZETA'], nu, a)
    else: A, B = symbols(OBJ[gam], nu, a, prime_center=gam)
    M, G = loewner(nu, A, B, a)
    lam, V = np.linalg.eigh(G); keep = lam > 1e-9 * lam[-1]
    Wm = V[:, keep] / np.sqrt(lam[keep])[None, :]
    Mz = Wm.T @ M @ Wm; Mz = (Mz + Mz.T) / 2
    wz = np.linalg.eigvalsh(Mz)
    out = dict(gamma=gam, twoa=twoa, n=len(nu), rank=int(keep.sum()), zeta=float(wz[0]), pairs=[])
    tg = np.linspace(-60, 60, 2401)
    for j in range(NOFF):
        g0 = gam + (2 * j / NOFF - 1) * sp
        for b in BS:
            kp = np.zeros(len(nu), complex); A2 = np.zeros(len(nu), complex); B2 = np.zeros(len(nu), complex)
            for s1 in (1, -1):
                for s2 in (1, -1):
                    dA, dB = (lambda k: ((np.exp(2 * a * k) - 1) / k, (np.exp(2 * a * k) - 1 - 2 * a * k) / (k * k)))(s1 * b + 1j * (nu + s2 * g0))
                    A2 += dA; B2 += dB
            Mp, _ = loewner(nu, A2, B2, a)
            Mt = Mz + Wm.T @ Mp @ Wm; Mt = (Mt + Mt.T) / 2
            w, U = np.linalg.eigh(Mt)
            rec = dict(g0=g0, b=b, lam=float(w[0]))
            if w[0] < 0:
                c = Wm @ U[:, 0]
                d = (g0 + tg)[:, None] - nu[None, :]
                with np.errstate(all='ignore'):
                    S = np.where(np.abs(d) < 1e-12, 2 * a, 2 * np.sin(d * a) / d)
                gh2 = (S @ c) ** 2
                tot = 2 * math.pi * float(c @ G @ c)          # int |ghat|^2 dt = 2 pi ||g||^2
                dt = tg[1] - tg[0]
                rec['mass_within_1sp'] = float(gh2[np.abs(tg) <= sp].sum() * dt / tot)
                rec['mass_within_5'] = float(gh2[np.abs(tg) <= 5].sum() * dt / tot)
                rec['mass_within_60'] = float(gh2.sum() * dt / tot)
            out['pairs'].append(rec)
    return out

def tnr_task(args):
    q, twoa = args
    a = twoa / 2
    nu = lattice(a, OMEGA, 2.0, 0.0)
    out = dict(q=q, twoa=twoa, n=len(nu))
    Wm = None
    for nm in ('ZETA', 'TNR:%d:2.2' % q, 'TNR:%d:1.0' % q, 'TNR:%d:2.01' % q):
        o = OBJ[nm]
        A, B = symbols(o, nu, a)
        M, G = loewner(nu, A, B, a)
        if Wm is None:
            lam, V = np.linalg.eigh(G); keep = lam > 1e-9 * lam[-1]
            Wm = V[:, keep] / np.sqrt(lam[keep])[None, :]; out['rank'] = int(keep.sum())
        Mw = Wm.T @ M @ Wm
        out[nm] = float(np.linalg.eigvalsh((Mw + Mw.T) / 2)[0])
    return out

if __name__ == '__main__':
    mode, outfn = sys.argv[1], sys.argv[2]
    W = int(os.environ.get('RH_WORKERS', '4')); t0 = time.time()
    if mode == 'pair':
        gammas = [float(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else [1e2, 1e3, 1e4, 1e5, 1e6]
        tasks = []
        for g in gammas:
            L = math.log(g / (2 * math.pi)); top = min(float(os.environ.get('TOP', '16.0')), 1.25 * L + 2.0)
            tasks += [(g, round(x, 4)) for x in np.arange(0.4, top + 1e-9, STEP)]
        X = math.exp(max(t[1] for t in tasks)) + 2
        print('pair mode: %d tasks, prime powers up to %.3g, frame size about %d, planned memory per worker < %.2f GB' % (
            len(tasks), X, int(2 * OMEGA * max(t[1] for t in tasks) / math.pi) + 1, 0.3), flush=True)
        OBJ['ZETA'] = make_object('ZETA', X)
        for g in gammas:
            if g > 150: OBJ[g] = twist_coefficients(OBJ['ZETA'], g)
        print('long double eps', np.finfo(np.longdouble).eps, flush=True)
        tasks.sort(key=lambda t: -t[1])
        res = []
        with mp.get_context('fork').Pool(W) as pool:
            for i, r in enumerate(pool.imap_unordered(pair_task, tasks, chunksize=1)):
                res.append(r)
                if i % 50 == 0: print('%d/%d %.0fs' % (i, len(tasks), time.time() - t0), flush=True)
        # thresholds
        summ = []
        for g in gammas:
            L = math.log(g / (2 * math.pi))
            rs = sorted([r for r in res if r['gamma'] == g], key=lambda r: r['twoa'])
            noise = max(1e-7, 10 * max(0.0, -min(r['zeta'] for r in rs)))
            for b in BS:
                th = []
                for j in range(NOFF):
                    first = None
                    for r in rs:
                        p = [x for x in r['pairs'] if x['b'] == b][j]
                        if p['lam'] < -noise:
                            first = (r['twoa'], p); break
                    th.append(first)
                vals = [t[0] for t in th if t]
                summ.append(dict(gamma=g, b=b, L=L, noise=noise, model=model_support(b, L), n_detected=len(vals),
                                 min=min(vals) if vals else None, median=float(np.median(vals)) if vals else None, max=max(vals) if vals else None,
                                 mass_within_1sp=[t[1].get('mass_within_1sp') for t in th if t], mass_within_60=[t[1].get('mass_within_60') for t in th if t],
                                 zeta_min_over_supports=min(r['zeta'] for r in rs)))
                s = summ[-1]
                print('gamma %.0e b %.2f L %.3f model %.3f  2a*: min %s median %s max %s  c = %s  (noise %.1e)' % (
                    g, b, L, s['model'], s['min'], s['median'], s['max'], None if not vals else round(s['median'] / L, 3), noise), flush=True)
        json.dump(dict(summary=summ, raw=res, OMEGA=OMEGA, STEP=STEP, NOFF=NOFF), open(outfn, 'w'))
    else:
        q = int(sys.argv[3]); lq = math.log(q)
        sups = [round(x, 4) for x in np.arange(max(0.6, lq - 1.0), lq + 2.0 + 1e-9, STEP)]
        X = math.exp(sups[-1]) + 2
        print('tnr mode: q = %d, %d supports, prime powers up to %.3g' % (q, len(sups), X), flush=True)
        for nm in ('ZETA', 'TNR:%d:2.2' % q, 'TNR:%d:1.0' % q, 'TNR:%d:2.01' % q): OBJ[nm] = make_object(nm, X)
        with mp.get_context('fork').Pool(W) as pool:
            res = pool.map(tnr_task, [(q, s) for s in sups], chunksize=1)
        for r in res: print(json.dumps(r), flush=True)
        json.dump(res, open(outfn, 'w'))
    print('done %.0fs' % (time.time() - t0), flush=True)
