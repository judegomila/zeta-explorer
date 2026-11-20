"""Lowest non-real zeros of F_{-eps}(z) (z = s - 1/2) for large eps: sign-change scan on the line + Newton from a seed grid.
   usage: heatzeros.py TMAX OUT.json eps1 eps2 ...      MEASURED (quadrature truncation not enclosed; list not certified complete)"""
import sys, json, math, os
from multiprocessing import Pool
from flint import arb, acb, ctx
import heatlib
BITS = 320

def job(a):
    eps, tmax = a
    ctx.prec = BITS
    H = heatlib.Heat(BITS, tmax + 20, digits=60)
    step = 0.05; n = int(tmax / step)
    vals = [H.Freal_axis(-eps, k * step) for k in range(n + 1)]
    sg = [1 if v > 0 else -1 for v in vals]
    online = []
    for k in range(n):
        if sg[k] != sg[k + 1]:
            lo, hi = k * step, (k + 1) * step
            for _ in range(60):
                mid = (lo + hi) / 2
                if (H.Freal_axis(-eps, mid) > 0) == (sg[k] > 0): lo = mid
                else: hi = mid
            online.append((lo + hi) / 2)
    # seeds: local minima of |F| on the line without a sign change, plus a coarse grid
    seeds = []
    av = [abs(float(v.mid())) if abs(float(v.mid())) > 0 else float(abs(v).log().mid()) for v in vals]
    lg = [float(abs(v).log().mid()) if not v.contains(0) else -1e9 for v in vals]
    for k in range(1, n):
        if lg[k] < lg[k - 1] and lg[k] < lg[k + 1] and sg[k - 1] == sg[k + 1] == sg[k]:
            for x in (0.05, 0.3, 1.0): seeds.append((x, k * step))
    y = 0.5
    while y < tmax:
        for x in (0.2, 1.0, 3.0, 8.0, 20.0, 40.0): seeds.append((x, y))
        y += 1.0
    found = []
    for x, yy in seeds:
        try: z, r = H.newton(-eps, acb(x, yy), it=30)
        except Exception: continue
        if r > 1e-20: continue
        re, im = float(z.real.mid()), float(z.imag.mid())
        re, im = abs(re), abs(im)
        if re < 1e-12 or im > tmax or im < 1e-9: continue
        if all(abs(re - a) + abs(im - b) > 1e-8 for a, b in found): found.append((re, im))
    found.sort(key=lambda p: p[1])
    print('eps', eps, 'online below', tmax, len(online), 'offline pairs', len(found), 'first', found[:3], 'first online', online[:3], flush=True)
    return dict(eps=eps, tmax=tmax, online=online, offline=found)

if __name__ == '__main__':
    tmax = float(sys.argv[1]); out = sys.argv[2]; epss = [float(x) for x in sys.argv[3:]]
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p: res = p.map(job, [(e, tmax) for e in epss], chunksize=1)
    json.dump(res, open(out, 'w'), indent=1); print('DONE')
