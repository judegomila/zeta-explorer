"""Zeta values on a real node set from ONE Taylor expansion of xi (ball arithmetic, enclosed truncation).
xi(1/2 + w) = sum_j f_j (w - w0)^j. Coefficients from acb_series (zeta, gamma) at s0 = 1/2 + w0.
Tail: xi(1/2 + z) has non-negative Taylor coefficients at z = 0 (CLASSICAL), so |xi(1/2 + z)| <= xi(1/2 + |z|) and on
|w - w0| = R: |F| <= M = xi(1/2 + w0 + R). Cauchy: |f_j| <= M R^-j. For |w - w0| <= r < R, q = r/R:
  |sum_{j>=D} f_j (w-w0)^j| <= M q^D/(1-q),   |sum_{j>=D} j f_j (w-w0)^(j-1)| <= (M/r) q^D (D (1-q) + q)/(1-q)^2.
Both bounds are added to the balls, so c = F'/F is an enclosure.
usage as module: values_taylor(family, n, bits, w0, D, pool) -> list of packed arb (same format as lib2.values)"""
import os, pickle, time, math
from flint import arb, acb, ctx, acb_series, arb_poly
import lib, lib2

_G = {}
def _eval(args):
    k, family, bits, fn = args
    ctx.prec = bits + 64
    if fn not in _G:
        co, w0, tailF, tailD = pickle.load(open(fn, 'rb'))
        _G.clear(); _G[fn] = ([lib2.unpack(t) for t in co], arb(w0), lib2.unpack(tailF), lib2.unpack(tailD))
    co, w0, tF, tD = _G[fn]
    t = lib2.node(family, k) - w0
    v = arb(0); d = arb(0)
    for cj in reversed(co):
        d = d * t + v; v = v * t + cj
    v = v + arb(0, 1) * tF; d = d + arb(0, 1) * tD
    return k, lib2.pack(d / v)

def values_taylor(family, n, bits, w0, r, D, pool):
    os.makedirs('cache', exist_ok=True)
    tagf = family.replace(':', '_').replace('/', '_')
    out_fn = 'cache/c_ZETA_%s_%d_%d.pkl' % (tagf, n, bits)          # same name as lib2.values: run1.py picks it up
    if os.path.exists(out_fn): return pickle.load(open(out_fn, 'rb'))
    cf = 'cache/ZT_%s_%d_%d.pkl' % (str(w0).replace('/', '_'), D, bits)
    if not os.path.exists(cf):
        t0 = time.time(); ctx.prec = bits + 128; ctx.cap = D + 4
        x = acb_series([acb(arb(1) / 2 + arb(w0)), 1], prec=D)
        y = lib.Zeta().completed(x)
        co = [c.real for c in y.coeffs()]; co += [arb(0)] * (D - len(co))
        # tail bound, R chosen on a grid to minimise M q^D
        best = None
        for R in [r * 1.5 ** i for i in range(2, 40)]:
            M = lib.Zeta().completed(acb(arb(1) / 2 + arb(w0) + arb(R))).real
            q = arb(r) / arb(R)
            tF = M * q ** D / (1 - q); tD = M / arb(r) * q ** D * (D * (1 - q) + q) / ((1 - q) ** 2)
            l = lib._log2(tD)
            if best is None or l < best[0]: best = (l, R, tF, tD)
        l, R, tF, tD = best
        print('  ZT series: D=%d bits=%d sec=%.1f | tail radius log2 = %.0f at R = %.3g | log2 F(w0) = %.1f | max coeff ball log2 radius = %.0f'
              % (D, bits, time.time() - t0, l, R, lib._log2(co[0]), max(lib._log2rad(c) for c in co)), flush=True)
        pickle.dump(([lib2.pack(c) for c in co], str(w0), lib2.pack(arb(tF.upper())), lib2.pack(arb(tD.upper()))), open(cf, 'wb'))
    t1 = time.time()
    jobs = [(k, family, bits, cf) for k in range(n)]
    res = dict(pool.imap_unordered(_eval, jobs, chunksize=4))
    out = [res[k] for k in range(n)]
    pickle.dump(out, open(out_fn, 'wb'))
    print('  ZT values', family, n, bits, 'sec %.1f' % (time.time() - t1), flush=True)
    return out

if __name__ == '__main__':
    import sys
    from multiprocessing import Pool
    family, n, bits, w0, r, D = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4], float(sys.argv[5]), int(sys.argv[6])
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
        v = values_taylor(family, n, bits, w0, r, D, pool)
        if '--check' in sys.argv:        # compare with direct evaluation on a few nodes
            ctx.prec = bits + 64; worst = -1e9; rad = -1e9
            for k in list(range(0, n, max(1, n // 12))) + [n - 1]:
                a = lib2.unpack(v[k]); b = lib2.logder(lib.Zeta(), lib2.node(family, k)).real
                assert a.overlaps(b), k
                worst = max(worst, lib._log2rad(a) - lib._log2(a))
            print('  check against direct evaluation: balls overlap on %d nodes; worst log2 relative radius %.0f' % (len(range(0, n, max(1, n // 12))) + 1, worst))
