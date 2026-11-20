"""Combination 1 on zeta: landing time of a planted conjugate pair, against de Bruijn Y^2/2 and against the local density.
A window of zeta ordinates around a site at height T (z = 2 gamma, origin at the site), the zeros outside replaced by a constant
density on both sides (hl.Flow tail 'const').  Variants: 'added' (pair added at the midpoint of a gap), 'hole' (the two zeros of
the gap removed: the pair replaces them, as in DH), 'row' (every zero within RROW mean spacings moved off the line to depth Y:
zeta(s+a)zeta(s-a) locally).  Y = 2 (beta - 1/2).
Usage: c1_plant.py LIST.npy[:offset] OUT.json T1,T2,..  [NSITES] [WIN]"""
import sys, os, json, math, numpy as np
os.environ['OMP_NUM_THREADS'] = '1'   # small systems: one thread per worker (the wrapper exports OMP_NUM_THREADS = cores)
import hl
from multiprocessing import Pool
YS = [0.2, 0.6, 0.87, 1.0]
def mf_time(Y, rho):
    a = 2 * math.pi * rho
    return Y / a - math.log(1 + a * Y) / a ** 2
def one(a):
    g, T, i, variant, Y, win, Tlab = a
    L = math.log(T / (2 * math.pi)); rho = L / (4 * math.pi)       # zeros per unit z
    lo = max(0, i - win); hi = min(len(g), i + 2 + win)
    site = 0.5 * (g[i] + g[i + 1])
    r = 2 * (g[lo:hi] - site); H = min(-r[0], r[-1]) * 0.999
    r = r[np.abs(r) < H]
    if variant == 'hole': r = r[np.abs(r) > (g[i + 1] - g[i]) * 1.0001]
    c = np.zeros(1); u = np.array([-4.0 * Y * Y])
    if variant == 'row':
        m = np.abs(r) < 12.0 / rho                                  # 12 mean spacings each side
        c = np.concatenate([[0.0], r[m]]) if False else r[m]; u = np.full(len(c), -4.0 * Y * Y); r = r[~m]
    fl = hl.Flow(r, c, u, mirror=False, tail=('const', rho, H), ld=False)
    fl.run(0.5 * Y * Y * 1.0002 + 1e-9, rtol=1e-9, atol=1e-11, dt0=1e-8, dtmax=Y * Y / 40, verbose=False)
    if variant == 'row':
        j = int(np.argmin(np.abs(c))); land = float(fl.land[j]); landmax = float(np.nanmax(fl.land)) if np.isfinite(fl.land).any() else float('nan')
    else: land = float(fl.land[0]); landmax = land
    tr = float('nan')
    if variant != 'row' and len(r):
        tr = hl.rung_time(0.0, Y, np.sort(r), rho, W=H)[0]
    return dict(Tlab=Tlab, T=T, site=float(site), gap_norm=float((g[i + 1] - g[i]) * 2 * rho), variant=variant, Y=Y, land=land, land_row_max=landmax,
                debruijn=Y * Y / 2, ratio=land / (Y * Y / 2), mean_field=mf_time(Y, rho), rung=tr, rho_z=rho, Yrho=Y * rho, nreal=int(len(r)), steps=int(fl.steps))
if __name__ == '__main__':
    spec, out, Ts = sys.argv[1:4]; ns = int(sys.argv[4]) if len(sys.argv) > 4 else 20; win = int(sys.argv[5]) if len(sys.argv) > 5 else 300
    fn, _, off = spec.partition(':'); g = np.load(fn, mmap_mode='r'); off = float(off) if off else 0.0
    rng = np.random.default_rng(7); jobs = []; G = {}
    for T in [float(v) for v in Ts.split(',')]:
        if T < 0: T = float(g[len(g) // 2])
        if off: gg = np.array(g); i0 = len(gg) // 2; span = len(gg) // 2 - win - 5
        else:
            i0 = int(np.searchsorted(g, T)); span = int(min(max(ns * 4, 0.03 * i0), 20000)); a0 = max(0, i0 - span - win - 5)
            gg = np.array(g[a0: i0 + span + win + 5]); i0 -= a0
        lo_i = max(win + 2, i0 - span); hi_i = min(len(gg) - win - 3, i0 + span)
        idx = rng.choice(np.arange(lo_i, hi_i), size=min(ns, hi_i - lo_i), replace=False)
        d = np.diff(gg[lo_i:hi_i + 1]); top = lo_i + np.argsort(d)[-max(1, ns // 4):]
        for i in top:
            for Y in YS: jobs.append((gg, (off if off else float(gg[i])), int(i), 'maxgap', Y, win, T))
        for i in idx:
            for variant in ('added', 'hole', 'row'):
                for Y in YS: jobs.append((gg, (off if off else float(gg[i])), int(i), variant, Y, win, T))
    W = int(os.environ.get('RH_WORKERS', '4'))
    with Pool(W) as p: rows = p.map(one, jobs, chunksize=4)
    summ = []
    for T in sorted(set(r['Tlab'] for r in rows)):
        for variant in ('added', 'hole', 'row', 'maxgap'):
            for Y in YS:
                rr = [r for r in rows if r['Tlab'] == T and r['variant'] == variant and r['Y'] == Y and np.isfinite(r['land'])]
                if not rr: continue
                ra = np.array([r['ratio'] for r in rr]); mf = rr[0]['mean_field'] / rr[0]['debruijn']
                summ.append(dict(T=T, variant=variant, Y=Y, n=len(rr), ratio_median=float(np.median(ra)), ratio_min=float(ra.min()), ratio_max=float(ra.max()),
                                 mean_field_ratio=mf, Yrho=rr[0]['Yrho'], land_over_rung_median=float(np.nanmedian([r['land'] / r['rung'] for r in rr])) if variant != 'row' else None, gap_norm_median=float(np.median([r['gap_norm'] for r in rr]))))
    json.dump(dict(list=spec, rows=rows, summary=summ), open(out, 'w'), indent=0)
    for s in summ:
        if s['Y'] in (0.6, 1.0): print('T=%g %-5s Y=%.2f n=%d ratio median %.4f [%.4f, %.4f] mean-field %.4f Y*rho %.3f' % (s['T'], s['variant'], s['Y'], s['n'], s['ratio_median'], s['ratio_min'], s['ratio_max'], s['mean_field_ratio'], s['Yrho']))
