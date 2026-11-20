"""Combination 2: surface of the critical heat time t*(d, n) of the Jensen polynomials J^{d,n} (normalised variable Y = X/s,
s = gamma(n)/gamma(n+1); theta* = t*/s^2) for one object.  Real-root counts from isolated root balls (jl.real_root_count).
Usage: c2_surface.py TABLE.pkl OBJ OUT.json [DMAX] [NMAX]"""
import sys, os, json, time, math
from multiprocessing import Pool
from flint import arb, ctx
import jl
DS = [2, 3, 4, 5, 6, 7, 8, 10, 13, 16, 20, 25, 32, 40, 50, 64, 80, 100, 128, 160, 200, 256, 320, 400]
NS = [0, 1, 2, 3, 5, 8, 12, 20, 30, 50, 100, 200, 500, 1000, 2000, 5000, 10000]
_G = None
def init(fn, obj):
    global _G
    T = jl.Tables(fn); ctx.prec = T.prec; _G = jl.gammas(T.series(obj))
def cell(a):
    d, n = a; t0 = time.time()
    if n + d + 1 >= len(_G): return dict(d=d, n=n, skipped='table too short')
    co, s = jl.jensen(_G, d, n)
    th, br, c0, cert = jl.tstar(co)
    return dict(d=d, n=n, theta_star=th, bracket=br, real_roots_t0=c0, certified_t0=bool(cert), scale=float(s.mid()),
                tstar_raw=(th * float(s.mid()) ** 2 if th not in (0.0, float('inf')) else th), sec=round(time.time() - t0, 1))
if __name__ == '__main__':
    if os.path.exists('out/SKIP_SURF'): print('skipped (out/SKIP_SURF present)'); sys.exit(0)
    if os.path.exists('surf_dlist.txt'): DS = [int(v) for v in open('surf_dlist.txt').read().replace(',', ' ').split()]
    fn, obj, out = sys.argv[1:4]; dmax = int(sys.argv[4]) if len(sys.argv) > 4 else 400; nmax = int(sys.argv[5]) if len(sys.argv) > 5 else 10000
    if os.environ.get('RH_NLIST'): NS = [int(v) for v in os.environ['RH_NLIST'].split(',')]
    cells = [(d, n) for n in NS if n <= nmax for d in DS if d <= dmax]
    cells.sort(key=lambda c: c[0])
    W = int(os.environ.get('RH_WORKERS', '4')); rows = []; t0 = time.time()
    with Pool(W, initializer=init, initargs=(fn, obj)) as p:
        for i, r in enumerate(p.imap_unordered(cell, cells, chunksize=1)):
            rows.append(r)
            if i % 40 == 0: print('%s %d/%d %.0fs last %s' % (obj, i + 1, len(cells), time.time() - t0, r), flush=True)
    rows.sort(key=lambda r: (r['n'], r['d']))
    # d*(n): largest grid degree with theta* = 0 such that all smaller grid degrees also have theta* = 0
    dstar = {}
    for n in sorted(set(r['n'] for r in rows)):
        best = 0
        for r in rows:
            if r['n'] != n or 'theta_star' not in r: continue
            if r['theta_star'] == 0.0 and r['certified_t0']: best = max(best, r['d'])
            else: break
        dstar[n] = best
    res = dict(obj=obj, table=fn, prec=jl.Tables(fn).prec, dstar_grid=dstar, n_cells=len(rows),
               n_positive=sum(1 for r in rows if r.get('theta_star', 0) not in (0.0,)), uncertified=sum(1 for r in rows if not r.get('certified_t0', True)), rows=rows)
    json.dump(res, open(out, 'w'), indent=0)
    print(json.dumps({k: v for k, v in res.items() if k != 'rows'}))
