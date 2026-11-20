"""Combination 2, large degrees: the non-real root of J^{d,n} that continues an off-line zero.
P_{d,n}(x) = J^{d,n}(x/d) = sum_j prod_{i<j}(1 - i/d) gamma(n+j) x^j / j!  ->  F^(n)(x) as d -> infinity (F(X) = sum c_k X^k).
The root is followed by Newton from x_rho = -(g - i b)^2 (n = 0; for n > 0 from the zero of F^(n-1)) down in d; d_pair(n) = the
degree at which the pair becomes real (bisection on integer d).  J^{d,n} is not hyperbolic for d > d_pair.
Usage: c2_track.py TABLE.pkl OBJ OUT.json NLIST g:b [g:b ...]"""
import sys, os, json, time, math
from multiprocessing import Pool
from flint import arb, acb, ctx
import jl
_G = None; _PREC = None
def init(fn, obj):
    global _G, _PREC
    T = jl.Tables(fn); ctx.prec = T.prec; _G = jl.gammas(T.series(obj)); _PREC = T.prec

def PdP(x, d, n):
    """P and P' at x (acb); d = None means infinity. Terms are summed until they are below 2^-(prec) of the largest term."""
    s = acb(0); sp = acb(0); term = acb(1); big = -10 ** 9; J = len(_G) - n - 1
    if d is not None: J = min(J, d)
    for j in range(0, J + 1):
        if j:
            term = term * x / j
            if d is not None: term = term * (d - j + 1) / d
        tj = term * _G[n + j]
        s += tj
        if j < J:
            # derivative: sum_j ff_{j+1} gamma(n+j+1) x^j / j!
            tp = term * _G[n + j + 1]
            if d is not None: tp = tp * (d - j) / d
            sp += tp
        e = float(arb(tj.abs_upper()).log().mid()) if tj != 0 else -10 ** 9
        if e > big: big = e
        elif e < big - 0.6932 * (ctx.prec + 20) and j > 20: break
    PdP.last_terms = j
    return s, sp, big

def newton(x, d, n, it=60):
    for k in range(it):
        f, fp, big = PdP(x, d, n)
        dx = f / fp; x = x - dx
        x = acb(x.real.mid(), x.imag.mid())
        if float(arb(dx.abs_upper()).mid()) < float(arb(x.abs_upper()).mid()) * 2.0 ** (-min(ctx.prec // 3, 900)): return x, True, big
    return x, False, big

def is_cplx(x):
    return abs(float(x.imag.mid())) > 1e-25 * abs(float(x.real.mid()))

def track(a):
    g, b, nlist = a; t0 = time.time(); out = dict(g=g, b=b, rows=[])
    ctx.prec = int(min(_PREC, 700 + 6.0 * float(g))); out['prec'] = ctx.prec
    x = -(acb(arb(g), -arb(b))) ** 2
    xn = x
    for n in range(0, max(nlist) + 1):
        xn, ok, big = newton(xn, None, n)
        if not ok or not is_cplx(xn):
            out['rows'].append(dict(n=n, note='the zero of F^(n) continued from the off-line zero is real or lost', x=[float(xn.real.mid()), float(xn.imag.mid())])); break
        if n not in nlist: continue
        wn = (-xn).sqrt()          # w with x = -w^2
        row = dict(n=n, zero_of_Fn_w=[float(wn.real.mid()), float(wn.imag.mid())], cancel_bits=None)
        # cone bound of Lemma 1 for this zero alone: (|x|/Im x)^2
        row['D0_pair'] = float(((xn.abs_upper()) / abs(xn.imag)).mid()) ** 2 if True else None
        # descend in d
        d = 1 << 40; xd = xn; last = None; lo = None
        ratio = 0.5
        while d > 3:
            y, ok, big = newton(xd, d, n)
            good = ok and is_cplx(y) and float(arb((y - xd).abs_upper()).mid()) < 0.5 * float(arb(xd.abs_upper()).mid())
            if good:
                last = (d, y); xd = y
                nd = int(d * ratio)
                if lo is not None and nd <= lo: nd = (d + lo) // 2
                if nd == d or (lo is not None and d - lo <= 1): break
                d = nd
            else:
                if last is None: break
                lo = d
                if last[0] - lo <= 1: break
                d = (last[0] + lo) // 2; xd = last[1]
        if last is not None:
            row['d_pair'] = last[0]; row['d_pair_lower'] = lo; row['root_at_d_pair'] = [float(last[1].real.mid()), float(last[1].imag.mid())]
            row['ratio_to_D0'] = last[0] / row['D0_pair']; newton(last[1], last[0], n); row['terms_used'] = PdP.last_terms; row['log2_largest_term'] = round(newton(last[1], last[0], n)[2] / 0.6931, 1)
        out['rows'].append(row)
    out['sec'] = round(time.time() - t0, 1)
    return out

if __name__ == '__main__':
    fn, obj, outfn, nl = sys.argv[1:5]; nlist = [int(v) for v in nl.split(',')]
    if sys.argv[5].endswith('.json'):
        import itertools
        pj = json.load(open(sys.argv[5])); lim = int(sys.argv[6]) if len(sys.argv) > 6 else len(pj); pairs = [(p[0], p[1], nlist) for p in pj[:lim]]
    else: pairs = [(v.split(':')[0], v.split(':')[1], nlist) for v in sys.argv[5:]]
    W = int(os.environ.get('RH_WORKERS', '4')); res = []
    with Pool(min(W, len(pairs)), initializer=init, initargs=(fn, obj)) as p:
        for r in p.imap(track, pairs, chunksize=1):
            res.append(r); print(json.dumps(r), flush=True)
    json.dump(dict(obj=obj, table=fn, pairs=res), open(outfn, 'w'), indent=0)
