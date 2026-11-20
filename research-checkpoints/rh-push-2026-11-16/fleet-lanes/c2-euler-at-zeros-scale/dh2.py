# DH completion pass: localise the count deficit left by dh.py (argument count on a 10-unit ladder), then search each
# deficient interval (fine Z grid for close on-line pairs + Newton from a 2D lattice of starts), recheck the count, redo statistics
import sys, json, math, time, cmath, numpy as np
from multiprocessing import Pool
from scipy.optimize import brentq
import dh
from dh import f, theta, Z, Sarg, psum, KAP, C1
from elib import *
def cnt(T): return theta(T) / math.pi + Sarg(T)
def newt(s):
    for it in range(80):
        h = 1e-6; fs = f(s); df = (f(s + h) - f(s - h)) / (2 * h)
        if df == 0: return None
        ds = fs / df
        if abs(ds) > 0.2: ds *= 0.2 / abs(ds)
        s -= ds
        if abs(ds) < 1e-12: break
    return s if abs(f(s)) < 1e-9 else None
def search(a):
    lo, hi = a; found = []
    tg = np.arange(lo, hi + 0.002, 0.002); z = np.array([Z(t) for t in tg])
    for i in np.nonzero(z[:-1] * z[1:] < 0)[0]: found.append(complex(0.5, brentq(Z, tg[i], tg[i + 1], xtol=1e-12, rtol=1e-15)))
    for t in np.arange(lo, hi, 0.1):
        for sg in (0.52, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.25, 1.4):
            s = newt(complex(sg, t))
            if s is not None and lo - 0.5 < s.imag < hi + 0.5: found.append(complex(max(s.real, 1 - s.real), s.imag) if abs(s.real - 0.5) > 1e-7 else complex(0.5, s.imag))
    return found
if __name__ == '__main__':
    t0 = time.time(); zz = np.load('dh_zeros.npy'); beta, gam, cls = zz
    on = list(gam[cls == 0]); off = [complex(b, g) for b, g in zip(beta[cls == 1], gam[cls == 1])]
    def found_below(T): return sum(1 for g in on if g < T) + 2 * sum(1 for s in off if s.imag < T)
    Ts = [20.5 + 10 * i for i in range(0, 998)]
    Ts = [T + 0.137 if min(abs(T - g) for g in gam[max(0, np.searchsorted(gam, T) - 2):np.searchsorted(gam, T) + 2]) < 0.02 else T for T in Ts]
    with Pool(NW) as pool:
        for rnd in range(3):
            c = pool.map(cnt, Ts, chunksize=4)
            # N(T) counted from height 20: offset fixed at the first rung
            base = round(c[0]) - found_below(Ts[0]) + sum(1 for g in on if g < Ts[0]) * 0
            dfc = [round(ci) - found_below(T) - (round(c[0]) - found_below(Ts[0])) for ci, T in zip(c, Ts)]
            frac = max(abs(ci - round(ci)) for ci in c)
            bad = [(Ts[i], Ts[i + 1]) for i in range(len(Ts) - 1) if dfc[i + 1] != dfc[i]]
            print('round', rnd, 'final deficit', dfc[-1], 'deficient intervals', len(bad), 'max |count - integer|', frac, 'sec', time.time() - t0, flush=True)
            if not bad: break
            res = pool.map(search, bad, chunksize=1); new_on = new_off = 0
            for r in res:
                for s in r:
                    if s.real == 0.5:
                        if min(abs(s.imag - g) for g in on) > 1e-7: on.append(s.imag); new_on += 1
                    elif min([abs(s - u) for u in off] + [1]) > 1e-6: off.append(s); new_off += 1
            print('   new on-line', new_on, 'new off-line pairs', new_off, flush=True)
        on = np.sort(np.array(on)); off = sorted(off, key=lambda s: s.imag)
        beta = np.concatenate([np.full(len(on), 0.5), [s.real for s in off], [1 - s.real for s in off]])
        gam = np.concatenate([on, [s.imag for s in off], [s.imag for s in off]])
        cls = np.concatenate([np.zeros(len(on)), np.ones(len(off)), -np.ones(len(off))])
        o = np.argsort(gam, kind='stable'); beta, gam, cls = beta[o], gam[o], cls[o]
        keep = (gam > 20) & (gam < Ts[-1]); beta, gam, cls = beta[keep], gam[keep], cls[keep]
        np.save('dh_zeros2.npy', np.stack([beta, gam, cls]))
        d = shifts_spacing(gam, 5.0)
        print('zeros', len(gam), 'on', int((cls == 0).sum()), 'off pairs', int((cls == 1).sum()), 'max beta', beta.max(), 'planned memory per worker: %.0f MB' % (len(gam) * 128 * 64e-6), flush=True)
        X = np.stack(pool.map(psum, [(beta, gam + k / KSH * d) for k in range(KSH)], chunksize=1))
    np.save('dh_X2.npy', X); out = dict(n_on=int((cls == 0).sum()), n_off_pairs=int((cls == 1).sum()), final_deficit=dfc[-1], max_beta=float(beta.max()))
    for ci, P in enumerate(CPS):
        n = CPI[ci]; e = np.array([[1, 1j, -1j, -1][int(p) % 5 - 1] if int(p) % 5 else 0 for p in PR[:n]])
        Mref = float((2 * abs(C1) ** 2 * np.prod(1 / (1 - np.abs(e) ** 2 / PR[:n])) + 2 * (C1 ** 2 * np.prod(1 / (1 - e * e / PR[:n]))).real).real)
        Xc = X[:, ci, :]; LA = np.log(Xc)
        for name, m in (('all', np.ones(len(gam), bool)), ('on', cls == 0), ('offR', cls == 1), ('offL', cls == -1)):
            for ws in (500, 2000, int(m.sum())):
                if ws > m.sum() or ws == 0: continue
                rows = win_stats(Xc[:, m], LA[:, m], gam[m], ws, None, Mref if name == 'on' else None)
                out['%s|%d|%d' % (name, P, ws)] = dict(Mref=Mref, rows=rows if ws >= 2000 else None,
                    **{kk: summarize(rows, kk) for kk in ('RU', 'Rhalf', 'Rref', 'Uref', 'RUhann', 'G')})
            A = Xc[:, m].sum(axis=1); out['%s|%d|profile' % (name, P)] = (A / A.mean()).tolist()
    json.dump(out, open('dh2.json', 'w')); print('done', time.time() - t0)
