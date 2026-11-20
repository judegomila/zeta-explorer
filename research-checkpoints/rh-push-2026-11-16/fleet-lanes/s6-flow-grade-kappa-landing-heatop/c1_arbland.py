"""Combination 1, high-precision landing times from the function itself (no zero list, no ODE):
H_t in the variable w (z = 2w): Xi_t(w) = sum_k (-1)^k M_2k(t) w^2k/(2k)!,  M_2k(t) = sum_j (t/4)^j M_{2k+2j}/j!  (moment tables of mom.py).
The off-line zero w(t) (start g - i b) is followed by Newton in t; the landing time is the t at which it reaches the real axis
(bisection on "Newton from the last non-real root converges to a non-real root").
Usage: c1_arbland.py TABLE.pkl OBJ OUT.json g:b [g:b ...]      OBJ as in jl.Tables.series (ZETA, DH, PLANT:..., TNR:..., EA:...)"""
import sys, os, json, time, math
from multiprocessing import Pool
from flint import arb, acb, ctx
import jl
_C = None; _TP = None
def init(fn, obj):
    global _C, _TP
    T = jl.Tables(fn); ctx.prec = T.prec; _TP = T.prec
    c = T.series(obj)                       # c_k = M_2k/(2k)!  (coefficients of X^k, X = -w^2)
    M = []; f = arb(1)
    for k, v in enumerate(c):
        if k: f *= (2 * k - 1) * (2 * k)
        M.append(v * f)
    _C = M
def coeffs_t(t, K, prec):
    """c_k(t) for k < K"""
    ctx.prec = prec
    out = []; f = arb(1); t4 = arb(t) / 4; big = arb(2) ** (prec + 10)
    for k in range(K):
        if k: f *= (2 * k - 1) * (2 * k)
        s = arb(0); term = arb(1); j = 0
        while k + j < len(_C):
            if j: term = term * t4 / j
            a = term * _C[k + j]; s += a; j += 1
            if j > 8 and bool(abs(a) * big < abs(s)): break
        out.append(s / f)
    return out
def newton(w, c, it=80):
    for _ in range(it):
        X = -w * w; s = acb(0); sp = acb(0)
        for v in reversed(c):
            sp = sp * X + s; s = s * X + v
        dw = s / (sp * (-2 * w)); w = w - dw; w = acb(w.real.mid(), w.imag.mid())
        if float(arb(dw.abs_upper()).mid()) < 2.0 ** (-min(ctx.prec // 3, 900)): return w, True
    return w, False
def land(a):
    g, b = a; t0 = time.time(); gf = float(g); bf = float(b)
    prec = int(min(_TP, 600 + 6.0 * gf)); K = int(min(len(_C) - 200, 600 + 5.5 * gf)); ctx.prec = prec
    tdb = 2 * bf * bf                     # de Bruijn bound Y^2/2 with Y = 2b
    w = acb(arb(g), -arb(b)); w, ok = newton(w, coeffs_t(arb(0), K, prec))
    if not ok: return dict(g=g, b=b, note='no convergence at t = 0')
    cpl = lambda w: abs(float(w.imag.mid())) > 1e-30
    lo_t, lo_w = 0.0, w; hi_t = None; dt = tdb / 24
    path = [(0.0, float(w.real.mid()), float(w.imag.mid()))]
    for it in range(400):
        t = lo_t + dt if hi_t is None else 0.5 * (lo_t + hi_t)
        y, ok = newton(lo_w, coeffs_t(arb(t), K, prec))
        good = ok and cpl(y) and abs(float(y.real.mid()) - float(lo_w.real.mid())) < 2.0
        if good:
            lo_t, lo_w = t, y; path.append((t, float(y.real.mid()), float(y.imag.mid())))
        else: hi_t = t
        if hi_t is not None and hi_t - lo_t < 1e-10 * max(tdb, 1e-6): break
        if hi_t is None and t > 1.5 * tdb + 1e-3: break
    return dict(g=g, b=b, landing=0.5 * (lo_t + (hi_t if hi_t is not None else lo_t)), bracket=[lo_t, hi_t], debruijn=tdb,
                ratio=(0.5 * (lo_t + hi_t) / tdb if hi_t is not None else None), landing_w=float(lo_w.real.mid()),
                prec=prec, terms=K, sec=round(time.time() - t0, 1), path=path[:: max(1, len(path) // 12)])
if __name__ == '__main__':
    fn, obj, outfn = sys.argv[1:4]; pairs = [tuple(v.split(':')) for v in sys.argv[4:]]
    if len(pairs) == 1 and pairs[0][0].endswith('.json'):
        lim = int(pairs[0][1]) if len(pairs[0]) > 1 else None
        pairs = [tuple(p) for p in json.load(open(pairs[0][0]))][:lim]
    if os.path.exists('arbland_maxg.txt'):          # cost grows like height^2.5: optional cap on the height of the pairs
        gmax = float(open('arbland_maxg.txt').read()); pairs = [p for p in pairs if float(p[0]) <= gmax]
    W = int(os.environ.get('RH_WORKERS', '4')); res = []
    with Pool(min(W, len(pairs)), initializer=init, initargs=(fn, obj)) as p:
        for r in p.imap(land, pairs, chunksize=1):
            res.append(r); print(json.dumps({k: v for k, v in r.items() if k != 'path'}), flush=True)
    json.dump(dict(obj=obj, table=fn, pairs=res), open(outfn, 'w'), indent=0)
