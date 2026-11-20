"""S1 grid (arb balls). One task = (T, N, point). Writes one JSON line per task to grid.jsonl.
Planned memory: per worker one (2D x 2D) acb matrix at 400 bits, D <= 450 -> 900^2 * ~250 B < 0.3 GB."""
import sys, os, json, time
import numpy as np
from multiprocessing import Pool
from flint import acb, arb, ctx, fmpq
import amp

PREC = int(os.environ.get('PREC', '400'))
CELLS = [(1, 2), (1, 8), (1, 32), (2, 4), (2, 16), (2, 64), (4, 8), (4, 32), (4, 128), (2, 2), (4, 4)]
DELTAS = ['0.05', '0.1', '0.2']

ZMAX = int(os.environ.get('ZMAX', '12'))
KINDS = os.environ.get('KINDS', 'ZOE')
def points():
    ctx.prec = PREC
    pts = []
    if ZMAX != 12 or KINDS != 'ZOE':          # extension runs (not the pre-registered grid)
        if 'Z' in KINDS: pts += [('Z', k, '0.5') for k in range(1, ZMAX + 1)]
        if 'E' in KINDS: pts += [('E', k, '0.5') for k in range(1, ZMAX)]
        if 'F' in KINDS: pts += [('F', k, dl) for dl in DELTAS + ['0.01'] for k in range(1, ZMAX + 1)]
        return pts
    for k in range(1, 13):
        pts.append(('Z', k, '0.5'))
    for dl in DELTAS:
        for k in range(1, 13):
            pts.append(('O', k, dl))
    for k in range(1, 12):
        pts.append(('E', k, '0.5'))
    pts.append(('E', 0, '0.5'))
    return pts

def make_point(kind, k, dl):
    ctx.prec = PREC
    if kind == 'Z':
        return amp.Point(arb(1) / 2, acb.zeta_zero(k).imag, zero=True)
    if kind in ('O', 'F'):
        # F = formal: the same point with A set to 0, i.e. the value under the hypothesis that the point is a zero.
        return amp.Point(1 - arb(fmpq(*[int(a) for a in (dl.replace('0.', '') , '1' + '0' * (len(dl) - 2))])), acb.zeta_zero(k).imag, zero=(kind == 'F'))
    if k == 0:
        return amp.Point(arb(1) / 2, arb(10), zero=False)
    return amp.Point(arb(1) / 2, (acb.zeta_zero(k).imag + acb.zeta_zero(k + 1).imag) / 2, zero=False)

def is_prime(n):
    return n > 1 and all(n % p for p in range(2, int(n ** 0.5) + 1))

def bs(x, n=18):
    return arb(x).str(n)

def task(args):
    T, N, kind, k, dl = args
    t0 = time.time()
    ctx.prec = PREC
    pt = make_point(kind, k, dl)
    P, lam, info = amp.gram(pt, T, N)
    MST = pt.MS(T)
    delta = pt.delta
    Nd = arb(N) ** delta
    row = dict(T=T, N=N, kind=kind, k=k, delta=dl, t=pt.t.str(20, radius=False), D=info['D'], ncross=info['ncross'])
    herm = max(abs(P[m, n] - P[n, m].conjugate()).upper() for m in range(N) for n in range(N))
    row['herm'] = float(herm)
    row['P11_over_MS'] = bs((P[0, 0] / MST).real)
    try:
        g, xo = amp.gain_opt(P, lam, MST)
        g = g.real
    except Exception as e:
        row['error'] = repr(e); return row
    ratio = g / Nd
    row['G_opt'] = bs(g); row['Nd'] = bs(Nd); row['ratio_opt'] = bs(ratio)
    row['ratio_lo'] = float(ratio.lower()); row['ratio_hi'] = float(ratio.upper())
    row['rad_rel'] = float((g.rad() / abs(g.mid())).upper()) if g.is_finite() else None
    row['exceeds_certain'] = bool(ratio > 1); row['below_certain'] = bool(ratio < 1)
    # comparator that does not read phi = 0
    MSlow = pt.MS(fmpq(T, N))
    row['MS_T'] = bs(MST); row['MS_formal_T_over_N'] = bs(MSlow)
    if MSlow > 0:
        Rg = MST / MSlow
        row['R_gen'] = bs(Rg); row['ratio_opt_Rgen'] = bs(g / Rg)
    # the same N with truncation height T' = N (no crossing terms): the c15 regime
    P2, lam2, info2 = amp.gram(pt, N, N)
    MSN = pt.MS(N)
    g2, _ = amp.gain_opt(P2, lam2, MSN)
    row['G_opt_TgeN'] = bs(g2.real); row['ratio_TgeN'] = bs(g2.real / Nd)
    MS1 = pt.MS(1)
    if MS1 > 0: row['R_gen_TgeN'] = bs(MSN / MS1)
    # named families
    fam = {}
    lamc = [l.conjugate() for l in lam]
    fam['HECKE'] = lamc
    lN = arb(N).log()
    fam['SELBERG'] = [lamc[m - 1] * (1 - arb(m).log() / lN) for m in range(1, N + 1)]
    fam['PRIMES'] = [lamc[m - 1] if is_prime(m) else acb(0) for m in range(1, N + 1)]
    res = {}
    for name, x in fam.items():
        gg, nv = amp.gain(P, lam, x, MST)
        res[name] = bs(gg / Nd, 12)
    rmax = None
    for kk in range(24):
        rng = np.random.default_rng([20261119, T, N, kk])
        a = rng.standard_normal(N); b = rng.standard_normal(N)
        x = [acb(float(a[i]), float(b[i])) for i in range(N)]
        gg, nv = amp.gain(P, lam, x, MST)
        r = gg / Nd
        if rmax is None or r.mid() > rmax.mid(): rmax = r
        if not (nv.real > 0): res['RANDOM_nonpos_norm'] = True
    res['RANDOM_max'] = bs(rmax, 12)
    row['families_ratio'] = res
    row['fam_exceeds'] = [n for n, v in res.items() if isinstance(v, str) and arb(v) > 1]
    row['sec'] = round(time.time() - t0, 1)
    return row

if __name__ == '__main__':
    workers = int(os.environ.get('RH_WORKERS', '4'))
    sel = sys.argv[1] if len(sys.argv) > 1 else 'all'
    out = sys.argv[2] if len(sys.argv) > 2 else 'grid.jsonl'
    cells = CELLS if sel == 'all' else [tuple(int(a) for a in c.split(',')) for c in sel.split(';')]
    tasks = [(T, N, kind, k, dl) for (T, N) in sorted(cells, key=lambda c: c[1]) for (kind, k, dl) in points()]
    print("tasks", len(tasks), "workers", workers, "prec", PREC, flush=True)
    done = set()
    if os.path.exists(out):
        for line in open(out):
            r = json.loads(line); done.add((r['T'], r['N'], r['kind'], r['k'], r['delta']))
    tasks = [t for t in tasks if t not in done]
    t0 = time.time()
    with Pool(workers) as pool, open(out, 'a') as fh:
        for i, row in enumerate(pool.imap_unordered(task, tasks, chunksize=1)):
            fh.write(json.dumps(row) + "\n"); fh.flush()
            if i % 20 == 0 or row.get('N', 0) >= 64:
                print(i, row['T'], row['N'], row['kind'], row['k'], row['delta'], row.get('ratio_opt'), row.get('sec'), "elapsed %.0f" % (time.time() - t0), flush=True)
    print("DONE", time.time() - t0, flush=True)
