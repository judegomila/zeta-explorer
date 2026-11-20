# Combinations 1(a), 3(a), 3(b): pointwise kernel sign conditions on a u-grid, ball arithmetic.
#   light pass (series length 6):  pos  K > 0 ; lc  (log K)'' < 0 ; c1  u l'' - l' < 0  (Csordas: t -> log K(sqrt t) concave);
#       S1 f' > 0 (f = u V', V = -log K) ; S3 W' > 0 (W = K''/K) ; S4 W'' f' - W' f'' > 0
#   heavy pass (series length 17, C(u) = int_u^inf s K(s) ds):  S2 h' < 0 (h = C/K) ; S5 h'' f' - h' f'' > 0 ;
#       Wronskian ladders A_m = W_m(K, uK', K'', uK''', ...)/K^m and B_m = W_m(K, uK', ..., [m-1 columns], C)/K^m, m = 2..8
#       (A_5 = S_Q/256 and B_5 = S_H/16 of PR 53: the "next source determinants").
# The kernel variable is u (x = e^{4u}); the source variable is t = 4u; every sign here is invariant under t -> 4u.
# usage: python t_shape.py <light|heavy> <out.json> <npts> <umax> <prec> <kernel,kernel,...> [npts_ea]
import sys, os, json, time, math
from multiprocessing import Pool
from flint import arb, arb_series, arb_mat, ctx
import klib3 as K3

_CT = {}


def _rate(sp, u):
    t = sp['type']
    if t in ('ea', 'delta'):
        return 4*math.pi*math.exp(2*u) + 24
    if t == 'tnr':
        return 4*math.pi*math.exp(4*u)*sp['q']**2 + 24
    if t == 'heat':
        return _rate(sp['base'], u)
    return 4*math.pi*math.exp(4*u) + 24


def ctable(name, prec, umax):
    """C(G_k) = int_{G_k}^inf s K(s) ds on breakpoints G_k with cell width min(1/64, 1/rate); 40-node Gauss-Legendre
    per cell.  The integral is cut at 'top' where K(top) < 2^-(prec+60) K(umax)."""
    key = (name, prec, umax)
    if key in _CT:
        return _CT[key]
    sp = K3.SPEC(name)
    cap = ctx.cap; ctx.cap = 1
    kref = abs(K3.kval(sp, arb(umax)))*arb(2)**(-(prec + 60))
    top = umax + 0.02
    while abs(K3.kval(sp, arb(top))) > kref:
        top += 0.02
        if top > umax + 3:
            raise RuntimeError('ctable: top not found')
    G = [0.0]
    while G[-1] < top:
        G.append(G[-1] + min(1.0/64, 1.0/_rate(sp, G[-1])))
    xs, ws = K3.gl_nodes(40)
    n = len(G) - 1
    tab = [arb(0)]*(n + 1)
    for k in range(n - 1, -1, -1):
        a = arb(G[k]); b = arb(G[k + 1])
        s = arb(0)
        for x, w in zip(xs, ws):
            u = (a + b)/2 + (b - a)/2*x
            s += w*u*K3.kval(sp, u)
        tab[k] = tab[k + 1] + s*(b - a)/2
    ctx.cap = cap
    _CT[key] = (tab, G, xs, ws)
    return _CT[key]


def cval(name, sp, prec, u0, umax):
    import bisect
    tab, G, xs, ws = ctable(name, prec, umax)
    k = bisect.bisect_right(G, float(u0.mid()))
    if k >= len(G):
        return arb(0)
    b = arb(G[k])
    cap = ctx.cap; ctx.cap = 1
    s = arb(0)
    for x, w in zip(xs, ws):
        u = (u0 + b)/2 + (b - u0)/2*x
        s += w*u*K3.kval(sp, u)
    ctx.cap = cap
    return tab[k] + s*(b - u0)/2


def point_light(sp, u0):
    c = K3.kser(sp, u0, 6)
    Ks = arb_series(c)
    U = arb_series([u0, 1])
    k0, k1, k2, k3 = c[0], c[1], 2*c[2], 6*c[3]
    out = {}
    out['pos'] = K3.sgn(k0)
    lc = k2*k0 - k1*k1
    out['lc'] = K3.sgn(lc)
    out['c1'] = K3.sgn(u0*lc - k1*k0)
    out['S1'] = K3.sgn(-((k1 + u0*k2)*k0 - u0*k1*k1))
    out['S3'] = K3.sgn((k3*k0 - k2*k1)*k0)          # sign of W' = (K'''K - K''K')/K^2
    if out['pos'] == 0:
        out['S4'] = 0
        return out
    K1s = Ks.derivative(); K2s = K1s.derivative()
    W = K2s/Ks
    f = -(U*K1s)/Ks
    w = W.coeffs(); ff = f.coeffs()
    out['S4'] = K3.sgn(2*w[2]*ff[1] - w[1]*2*ff[2])
    return out


def point_heavy(name, sp, prec, u0, umax):
    n = 17
    c = K3.kser(sp, u0, n)
    Ks = arb_series(c)
    U = arb_series([u0, 1])
    C0 = cval(name, sp, prec, u0, umax)
    Cs = arb_series([C0]) - (U*Ks).integral()
    out = {'pos': K3.sgn(c[0])}
    if out['pos'] != 0:
        h = (Cs/Ks).coeffs()
        f = (-(U*Ks.derivative())/Ks).coeffs()
        out['S1'] = K3.sgn(f[1])
        out['S2'] = K3.sgn(h[1])
        out['S5'] = K3.sgn(2*h[2]*f[1] - h[1]*2*f[2])
    else:
        out['S1'] = out['S2'] = out['S5'] = 0
    # columns g_j, j = 0..7
    cols = []
    D = Ks
    for j in range(8):
        g = (U*D) if (j % 2) else D
        cols.append(g.coeffs())
        D = D.derivative()
    cc = Cs.coeffs()
    fact = [arb(1)]
    for i in range(1, 9):
        fact.append(fact[-1]*i)
    def col(g, m):
        return [(g[i] if i < len(g) else arb(0))*fact[i] for i in range(m)]
    sK = out['pos']
    for m in range(2, 9):
        M = arb_mat(m, m, [col(cols[j], m)[i] for i in range(m) for j in range(m)])
        s = K3.sgn(M.det())
        out['A%d' % m] = s*(sK**m) if sK else 0
        cl = [col(cols[j], m) for j in range(m - 1)] + [col(cc, m)]
        M = arb_mat(m, m, [cl[j][i] for i in range(m) for j in range(m)])
        s = K3.sgn(M.det())
        out['B%d' % m] = s*(sK**m) if sK else 0
    return out


def work(task):
    mode, name, prec, umax, npts, j0, j1 = task
    sp = K3.SPEC(name)
    K3.setp(prec, 6 if mode == 'light' else 17)
    res = {}
    for j in range(j0, j1):
        u0 = arb(umax)*j/npts
        o = point_light(sp, u0) if mode == 'light' else point_heavy(name, sp, prec, u0, umax)
        for k, v in o.items():
            res.setdefault(k, []).append(v)
    return name, j0, res


if __name__ == '__main__':
    mode, outf = sys.argv[1], sys.argv[2]
    npts = int(sys.argv[3]); umax = float(sys.argv[4]); prec = int(sys.argv[5])
    names = sys.argv[6].split(',')
    npts_ea = int(sys.argv[7]) if len(sys.argv) > 7 else max(npts//10, 100)
    nw = int(os.environ.get('RH_WORKERS', '4'))
    tasks = []
    meta = {}
    for nm in names:
        n = npts_ea if nm.startswith('ea') else npts
        meta[nm] = n
        ch = max(1, n//(8*nw))
        j = 1
        while j <= n:
            tasks.append((mode, nm, prec, umax, n, j, min(j + ch, n + 1)))
            j += ch
    t0 = time.time()
    acc = {}
    with Pool(nw) as pool:
        for nm, j0, res in pool.imap_unordered(work, tasks, chunksize=1):
            acc.setdefault(nm, []).append((j0, res))
    out = {'mode': mode, 'umax': umax, 'prec': prec, 'kernels': {}}
    for nm in names:
        parts = sorted(acc[nm])
        conds = {}
        for j0, res in parts:
            for k, v in res.items():
                conds.setdefault(k, []).extend(v)
        n = meta[nm]
        o = {'npts': n, 'conds': {}}
        for k, v in conds.items():
            r = K3.rle(v)
            # positions (u) of the run boundaries
            pos = []; j = 1
            for s, ln in r:
                pos.append([s, round(umax*j/n, 6), round(umax*(j + ln - 1)/n, 6)])
                j += ln
            o['conds'][k] = {'plus': v.count(1), 'minus': v.count(-1), 'undet': v.count(0), 'runs': pos[:60], 'nruns': len(pos)}
        out['kernels'][nm] = o
        print(nm, {k: (d['plus'], d['minus'], d['undet'], d['nruns']) for k, d in o['conds'].items()}, flush=True)
    out['seconds'] = time.time() - t0
    json.dump(out, open(outf, 'w'), indent=0)
    print('DONE', outf, '%.1f s' % (time.time() - t0))
