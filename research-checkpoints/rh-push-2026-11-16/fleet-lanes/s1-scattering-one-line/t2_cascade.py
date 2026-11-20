"""Combination 2: truncated cascade prod_{p<=P} (1 + eps_p p^{-s}) at s = 1/2 + x + it against its limit.
eps: ZETA (+1: limit zeta(s)/zeta(2s)), CHI (chi mod 5: L(s,chi)/L(2s,chi^2)), LIOU (-1: 1/zeta(s)), SGN (random signs, seed 121000-style hash),
U (random unimodular). CPU float64 (sums of < 5e8 terms of size < 1; no GPU). Usage: t2_cascade.py PMAX [workers]"""
import sys, json, math, time, os, numpy as np
from multiprocessing import Pool
PMAX = int(float(sys.argv[1])); WORK = int(sys.argv[2]) if len(sys.argv) > 2 else int(os.environ.get('RH_WORKERS', '4'))
XS = [0.05, 0.1, 0.25]; TS = [5.0, 14.134725141734693, 17.5, 1000.25, 10000.75]
SEG = 1 << 23
CHK = np.unique(np.round(10 ** np.arange(2, math.log10(PMAX) + 1e-9, 0.05)).astype(np.int64)); CHK = CHK[CHK <= PMAX]
CHI5 = np.array([0, 1, 1j, -1j, -1])
def small_primes(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
base = small_primes(int(PMAX**0.5) + 1)
def hash_u(p, salt):
    """deterministic uniform [0,1) per prime (splitmix64)"""
    z = (p.astype(np.uint64) + np.uint64(salt)) * np.uint64(0x9E3779B97F4A7C15)
    z ^= z >> np.uint64(30); z *= np.uint64(0xBF58476D1CE4E5B9); z ^= z >> np.uint64(27); z *= np.uint64(0x94D049BB133111EB); z ^= z >> np.uint64(31)
    return (z >> np.uint64(11)).astype(np.float64) / 2.0**53
def seg_job(lo):
    hi = min(lo + SEG, PMAX + 1)
    s = np.ones(hi - lo, dtype=bool)
    for p in base:
        if p * p >= hi: break
        st = max(p * p, ((lo + p - 1) // p) * p); s[st - lo::p] = False
    if lo == 0: s[:2] = False
    P = np.nonzero(s)[0] + lo
    lp = np.log(P.astype(np.float64))
    eps = {'ZETA': 1.0, 'CHI': CHI5[P % 5], 'LIOU': -1.0, 'SGN': np.where(hash_u(P, 121000) < 0.5, 1.0, -1.0), 'U': np.exp(2j * np.pi * hash_u(P, 120000))}
    idx = np.searchsorted(P, CHK[(CHK >= lo) & (CHK < hi)], side='right')
    res = {}
    for x in XS:
        mag = np.exp(-(0.5 + x) * lp)
        for t in TS:
            ph = t * lp; z = mag * (np.cos(ph) - 1j * np.sin(ph))
            for name, e in eps.items():
                c = np.cumsum(np.log1p(e * z))
                res[(x, t, name)] = (c[idx - 1] * (idx > 0) if len(idx) else np.zeros(0, dtype=complex), c[-1] if len(c) else 0j)
    return lo, res
if __name__ == '__main__':
    t0 = time.time()
    with Pool(WORK) as pool:
        results = pool.map(seg_job, range(0, PMAX + 1, SEG), chunksize=1)
    results.sort(key=lambda r: r[0])
    print('sieve+sums done %.0fs, segments %d' % (time.time() - t0, len(results)), flush=True)
    import mpmath as mp
    mp.mp.dps = 30
    chi = [0, 1, 1j, -1j, -1]; chi2 = [0, 1, -1, -1, 1]
    out = {'PMAX': PMAX, 'checkpoints': CHK.tolist(), 'series': {}, 'fits': {}}
    keys = list(results[0][1].keys())
    for key in keys:
        x, t, name = key
        run = 0j; vals = []
        for lo, res in results:
            part, tot = res[key]
            vals.extend((run + part).tolist()); run += tot
        LP = np.array(vals)                                   # partial log-products at CHK
        s = mp.mpc(0.5 + x, t)
        e1a = np.array([complex(mp.e1((s - 1) * mp.log(int(P)))) for P in CHK]); e1b = np.array([complex(mp.e1((2 * s - 1) * mp.log(int(P)))) for P in CHK])
        if name == 'ZETA': corr = e1a - 0.5 * e1b; target = mp.zeta(s) / mp.zeta(2 * s)
        elif name == 'LIOU': corr = -e1a - 0.5 * e1b; target = 1 / mp.zeta(s)
        elif name == 'CHI': corr = 0 * e1a; target = mp.dirichlet(s, chi) / mp.dirichlet(2 * s, chi2)
        elif name == 'SGN': corr = -0.5 * e1b; target = None
        else: corr = 0 * e1a; target = None
        rec = {}
        if target is not None:
            tg = complex(target)
            rec['raw_err'] = np.abs(np.exp(LP) / tg - 1); rec['corr_err'] = np.abs(np.exp(LP + corr) / tg - 1)
        rec['cauchy'] = np.abs(np.exp(LP + corr - (LP[-1] + corr[-1])) - 1)
        fit = {}
        lg = np.log10(CHK.astype(float))
        for nm, arr in rec.items():
            dec = []
            top = math.log10(PMAX) - (1 if nm == 'cauchy' else 0)
            for d in np.arange(2, top - 1e-9, 1.0):
                sel = (lg >= d) & (lg < d + 1) & (arr > 0)
                if sel.sum() > 3: dec.append((d + 0.5, 0.5 * math.log10(np.mean(arr[sel] ** 2))))
            if len(dec) >= 2:
                a = np.polyfit([u for u, _ in dec], [v for _, v in dec], 1)
                fit[nm] = {'slope': float(a[0]), 'decade_rms_log10': dec}
        out['series']['%g|%g|%s' % key] = {k: v.tolist() for k, v in rec.items()}
        out['fits']['%g|%g|%s' % key] = fit
    json.dump(out, open('t2_result_P%g.json' % PMAX, 'w'))
    print('\nx | t | function | slope raw | slope pole-corrected | slope Cauchy(P -> Pmax) | pole-corrected RMS error in last decade')
    for key in keys:
        f = out['fits']['%g|%g|%s' % key]
        g = lambda k: ('%+.3f' % f[k]['slope']) if k in f else '   -  '
        last = ('%.3e' % 10 ** f['corr_err']['decade_rms_log10'][-1][1]) if 'corr_err' in f else ('%.3e (Cauchy)' % 10 ** f['cauchy']['decade_rms_log10'][-1][1] if 'cauchy' in f else '-')
        print('%.2f | %g | %s | %s | %s | %s | %s' % (key[0], key[1], key[2], g('raw_err'), g('corr_err'), g('cauchy'), last))
    print('\nmean slope over t (pole-corrected where a closed limit exists, else Cauchy), predicted -x:')
    for x in XS:
        for name in ['ZETA', 'CHI', 'LIOU', 'SGN', 'U']:
            sl = []
            for t in TS:
                f = out['fits']['%g|%g|%s' % (x, t, name)]
                sl.append(f['corr_err']['slope'] if 'corr_err' in f else f.get('cauchy', {'slope': float('nan')})['slope'])
            sc = [out['fits']['%g|%g|%s' % (x, t, name)].get('cauchy', {'slope': float('nan')})['slope'] for t in TS]
            print('x=%.2f %s: mean %.3f  (per t: %s)   Cauchy mean %.3f' % (x, name, np.mean(sl), ' '.join('%.3f' % v for v in sl), np.mean(sc)))
