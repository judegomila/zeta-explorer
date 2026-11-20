#!/usr/bin/env python3
"""Statistic 1 (float64 screen; GPU if cupy is present). See PREREG.md."""
import sys, os, json, math, time
import numpy as np
import sets
from sets import Row, rows_stat1, heights, CUT
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=16 * 1024 ** 3)
    xp = cp
    red = cp.ReductionKernel('float64 s2, float64 a, float64 r4', 'float64 y', 'log(a + r4 * s2)', 'a + b', 'y = a', '0', 'lsum')
except Exception as e:
    print('no cupy:', e, flush=True); cp = None; xp = np
    def red(s2, a, r4, axis=1): return np.log(a + r4 * s2).sum(axis=1)

OUT = 'out1'
def to_np(a): return cp.asnumpy(a) if cp is not None and isinstance(a, cp.ndarray) else np.asarray(a)

def run_row(args, js, n):
    row = Row(**args)
    dl = [2.0 ** (-j) for j in js]
    t, cls = heights(row, n, dl[-1])
    n = len(t)
    CH = max(1000, int(1.0e8 // n))
    print('row %s: count %d, heights %d, chunk %d x %d doubles = %.2f GB per array (<= 4 arrays live)' %
          (row.name, row.count, n, n, CH, n * CH * 8 / 2 ** 30), flush=True)
    tg = xp.asarray(t)
    acc = xp.zeros((n, len(js)))
    t0 = time.time()
    for a in range(0, row.count, CH):
        b = min(a + CH, row.count)
        lam, th = row.chunk(a, b, xp)
        s2 = xp.sin(0.5 * (tg[:, None] * lam[None, :] - th[None, :])); s2 *= s2
        lmin = float(lam[0])
        for ji, d in enumerate(dl):
            if CUT / d < lmin: continue
            m = int(xp.searchsorted(lam, CUT / d, side='right'))
            if m == 0: continue
            om = -xp.expm1(-d * lam[:m]); r4 = 4.0 * xp.exp(-d * lam[:m])
            acc[:, ji] -= 0.5 * red(s2[:, :m], (om * om)[None, :], r4[None, :], axis=1)
        del s2
    y = to_np(acc)
    return row, t, cls, y, time.time() - t0

def slope_stats(js, y):
    k = min(11, len(js))
    x = np.array([j * math.log(2.0) for j in js[-k:]])
    xc = x - x.mean()
    beta = (y[:, -k:] * xc[None, :]).sum(axis=1) / (xc ** 2).sum()
    return beta

def summarize(name, js, t, cls, y, extra=None):
    beta = slope_stats(js, y)
    dev = np.abs(beta - np.round(beta))
    S = dict(name=name, js=[js[0], js[-1]], n=len(t), frac_int=float((dev <= 0.02).mean()),
             pass1=bool((dev <= 0.02).mean() >= 0.99) if len(js) >= 11 else None,
             beta_mean=float(beta.mean()), beta_sd=float(beta.std()), beta_min=float(beta.min()), beta_max=float(beta.max()),
             y_last_sd=float(y[:, -1].std()), y_last_min=float(y[:, -1].min()), y_last_max=float(y[:, -1].max()))
    names = {0: 'pole', 1: 'generic', 2: 'resonant', 3: 'telescoped-pole'}
    for c in sorted(set(cls.tolist())):
        m = cls == c
        S[names[c]] = dict(n=int(m.sum()), frac_int=float((dev[m] <= 0.02).mean()), beta_mean=float(beta[m].mean()), beta_sd=float(beta[m].std()),
                           beta_min=float(beta[m].min()), beta_max=float(beta[m].max()), y_last_sd=float(y[m, -1].std()),
                           y_last_mean=float(y[m, -1].mean()))
    hist = np.bincount(np.clip(np.round(beta).astype(int) + 5, 0, 10)[dev <= 0.02], minlength=11)
    S['int_hist_-5..5'] = hist.tolist()
    if extra: S.update(extra)
    np.savez(os.path.join(OUT, name + '.npz'), t=t, cls=cls, y=y, js=np.array(js), beta=beta)
    json.dump(S, open(os.path.join(OUT, name + '.json'), 'w'), indent=1)
    print(json.dumps(S), flush=True)

def small_rows():
    """DEL, THIN on D1 and D2 (analytic near the line), map HQ1; numpy"""
    js = list(range(4, 19))
    for base in ('D1', 'D2'):
        row = Row(name=base, kind=base, phase='+', Lmax=90.0)
        t, cls = heights(row, 2000, 2.0 ** -18)
        lam, th = row.chunk(0, row.count)
        ph = t[:, None] * lam[None, :]
        for nm in ('DEL', 'THIN'):
            y = np.zeros((len(t), len(js)))
            for ji, j in enumerate(js):
                d = 2.0 ** -j
                r = np.exp(-(0.5 + d) * lam)[None, :]
                y[:, ji] = (0.5 * np.log(1 - 2 * r * np.cos(ph) + r * r)).sum(axis=1)
                if nm == 'THIN':
                    y[:, ji] -= (0.5 * np.log(1 + 2 * r * np.cos(ph) + r * r)).sum(axis=1)
            summarize('%s_%s' % (nm, base), js, t, cls, y, dict(count=int(row.count)))
    row = Row(name='HQ1', kind='HQ1', Lmax=1e9)
    t, cls = heights(row, 2000, 2.0 ** -18)
    l3 = math.log(3.0)
    y = np.zeros((len(t), len(js)))
    for ji, j in enumerate(js):
        u = np.exp(-(2.0 ** -j + 1j * t) * l3)
        y[:, ji] = np.log(np.abs(1 + u / (1 - u) ** 2))
    summarize('HQ1map', js, t, cls, y)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    sel = sys.argv[1:]
    if not sel or 'small' in sel:
        small_rows()
    for args, js, n in rows_stat1():
        if sel and not any(args['name'].startswith(s) for s in sel): continue
        if os.path.exists(os.path.join(OUT, args['name'] + '.json')): continue
        row, t, cls, y, dt = run_row(args, js, n)
        summarize(row.name, js, t, cls, y, dict(count=int(row.count), seconds=dt))
    if cp is not None:
        print('gpu pool used GB', cp.get_default_memory_pool().total_bytes() / 2 ** 30)
    print('DONE', flush=True)
