# Combination 3 (random node tuples): determinants of orders 2..8.
#   pick   : real Pick matrices P = [(L(x_i)+L(x_j))/(x_i+x_j)], L = F'/F, at random positive nodes; sign of every
#            leading principal minor of orders 1..8 (LDL pivots, ball arithmetic).
#   colloc : collocation determinants det[g_j(u_i)]_{i,j<m} / prod K(u_i) of the source ladder
#            g = (K, uK', K'', uK''', K'''', uK^(5), K^(6), uK^(7)) (series A) and with the last column replaced by
#            C(u) = int_u^inf sK (series B), m = 2..8, at random increasing node tuples (the multi-node form of the
#            Wronskians of t_shape.py).
#   schw   : four-node criterion of PR 50: 2h'h''' - 3h''^2 > 0 and 2j'j''' - 3j''^2 > 0, h(U) = L(sqrt U)/sqrt U, j = U h.
# usage: python t_tp.py <pick|colloc|schw> <out.json> <kernels> <ntuples|npts> [prec] [pool]
import sys, os, json, time, math
import multiprocessing as mp
import numpy as np
from flint import arb, arb_series, acb, ctx
import klib3 as K3
import t_expfam as TE
import t_shape as TS

_G = {}
ORD = int(os.environ.get('PICK_ORDER', '8'))


def Lval(name, sp, x, prec, kmax=1):
    f = TE.Fvals(name, sp, x, prec, None)
    F = f(0, kmax) if sp['type'] not in ('ea', 'tnr') else f(0)
    return [v.real for v in F]


# ---------------- Pick ----------------
def pick_pool_item(args):
    name, prec, xs = args
    sp = K3.SPEC(name)
    K3.setp(prec, 1)
    out = []
    for x in xs:
        F = Lval(name, sp, arb(x), prec)
        out.append((F[1]/F[0]).str(int(prec*0.30103) - 8, radius=False))
    return out


def pick_chunk(args):
    name, prec, seed, ntup, M = args
    xs, Ls = _G['pick'][name]
    K3.setp(prec, 1)
    rng = np.random.Generator(np.random.PCG64(seed))
    pos = [0]*(ORD + 1); neg = [0]*(ORD + 1); und = [0]*(ORD + 1)
    first_fail = [0]*(ORD + 2)
    ex = None
    for _ in range(ntup):
        idx = rng.choice(M, size=ORD, replace=False)
        x = [xs[i] for i in idx]; L = [Ls[i] for i in idx]
        A = [[(L[i] + L[j])/(x[i] + x[j]) for j in range(ORD)] for i in range(ORD)]
        sdet = 1
        ff = ORD + 1
        for k in range(ORD):
            p = A[k][k]
            s = K3.sgn(p)
            if s == 0:
                for m in range(k + 1, ORD + 1):
                    und[m] += 1
                pass
                sdet = 0
                break
            sdet *= s
            if sdet > 0:
                pos[k + 1] += 1
            else:
                neg[k + 1] += 1
            if s < 0 and ff == ORD + 1:
                ff = k + 1
                if ex is None or k + 1 < ex[0]:
                    ex = (k + 1, [float(v.mid()) for v in x[:k + 1]])
            Ak = A[k]
            for i in range(k + 1, ORD):
                Ai = A[i]
                f = Ai[k]/p
                for j in range(k + 1, ORD):
                    Ai[j] = Ai[j] - f*Ak[j]
        first_fail[ff] += 1
    return name, pos, neg, und, first_fail, ex


def run_pick(outf, names, ntup, prec, M):
    nw = int(os.environ.get('RH_WORKERS', '4'))
    rng = np.random.Generator(np.random.PCG64(20261119))
    xa = rng.uniform(0.0, 4.0, M//2)
    xb = np.exp(rng.uniform(math.log(0.01), math.log(100.0), M - M//2))
    xf = [float(v) for v in np.concatenate([xa, xb])]
    xstr = [repr(v) for v in xf]
    ctxm = mp.get_context('fork')
    res = {}
    _G['pick'] = {}
    t0 = time.time()
    with ctxm.Pool(nw) as pool:
        for nm in names:
            ch = max(1, M//(4*nw))
            tasks = [(nm, prec, xstr[i:i + ch]) for i in range(0, M, ch)]
            parts = pool.map(pick_pool_item, tasks, chunksize=1)
            Ls = [v for p in parts for v in p]
            K3.setp(prec, 1)
            _G['pick'][nm] = ([arb(s) for s in xstr], [arb(s) for s in Ls])
            print('pool', nm, '%.1f s' % (time.time() - t0), flush=True)
    K3.setp(prec, 1)
    with ctxm.Pool(nw) as pool:                 # fork after the pools exist
        nch = 8*nw
        tasks = [(nm, prec, 1000 + 17*c, ntup//nch, M) for nm in names for c in range(nch)]
        for nm, pos, neg, und, ff, ex in pool.imap_unordered(pick_chunk, tasks, chunksize=1):
            r = res.setdefault(nm, {'pos': [0]*(ORD + 1), 'neg': [0]*(ORD + 1), 'und': [0]*(ORD + 1), 'first_negative_pivot_order': [0]*(ORD + 2), 'example': None})
            for k in range(ORD + 1):
                r['pos'][k] += pos[k]; r['neg'][k] += neg[k]; r['und'][k] += und[k]
            for k in range(ORD + 2):
                r['first_negative_pivot_order'][k] += ff[k]
            if ex is not None and (r['example'] is None or ex[0] < r['example'][0]):
                r['example'] = ex
    for nm in names:
        r = res[nm]
        r['tuples'] = sum(r['first_negative_pivot_order'])
        print(nm, 'det sign counts by order (pos/neg/und):', [(r['pos'][k], r['neg'][k], r['und'][k]) for k in range(1, ORD + 1)],
              'first negative pivot order hist', r['first_negative_pivot_order'], flush=True)
    json.dump({'mode': 'pick', 'order': ORD, 'prec': prec, 'pool': M, 'nodes': 'half uniform (0,4), half log-uniform [0.01,100]',
               'kernels': res, 'seconds': time.time() - t0}, open(outf, 'w'), indent=0)


# ---------------- collocation ----------------
def col_pool_item(args):
    name, prec, us, umax = args
    sp = K3.SPEC(name)
    K3.setp(prec, 9)
    out = []
    dig = int(prec*0.30103) - 8
    for ustr in us:
        u0 = arb(ustr)
        c = K3.kser(sp, u0, 9)
        d = K3.derivs(c)
        row = [(d[j]*u0 if j % 2 else d[j]) for j in range(8)]
        C0 = TS.cval(name, sp, prec, u0, umax)
        row.append(C0)
        out.append([v.str(dig, radius=False) for v in row] + [K3.sgn(c[0])])
    return out


def col_chunk(args):
    name, prec, seed, ntup, M = args
    us, rows, sk = _G['col'][name]
    K3.setp(prec, 1)
    rng = np.random.Generator(np.random.PCG64(seed))
    cnt = {('A', m): [0, 0, 0] for m in range(2, 9)}
    cnt.update({('B', m): [0, 0, 0] for m in range(2, 9)})
    for _ in range(ntup):
        idx = [int(i) for i in rng.choice(M, size=8, replace=False)]
        A = [list(rows[i]) for i in idx]           # 8 x 9
        uf = [us[i] for i in idx]
        sdet = 1
        skp = 1
        ok = True
        for k in range(8):
            m = k + 1
            # parity of the permutation sorting the first m nodes
            inv = 0
            for a in range(m):
                for b in range(a + 1, m):
                    if uf[a] > uf[b]:
                        inv += 1
            par = -1 if inv % 2 else 1
            skp *= sk[idx[k]]
            if m >= 2 and ok:
                sB = K3.sgn(A[k][8])*sdet*par*skp
                cnt[('B', m)][0 if sB > 0 else (1 if sB < 0 else 2)] += 1
            elif m >= 2:
                cnt[('B', m)][2] += 1
            if ok:
                s = K3.sgn(A[k][k])
                if s == 0:
                    ok = False
            if not ok:
                if m >= 2:
                    cnt[('A', m)][2] += 1
                continue
            sdet *= s
            if m >= 2:
                sA = sdet*par*skp
                cnt[('A', m)][0 if sA > 0 else 1] += 1
            p = A[k][k]
            for i in range(k + 1, 8):
                f = A[i][k]/p
                Ai = A[i]; Ak = A[k]
                for j in range(k + 1, 9):
                    Ai[j] = Ai[j] - f*Ak[j]
    return name, {'%s%d' % k: v for k, v in cnt.items()}


def run_colloc(outf, names, ntup, prec, M, umax=1.5):
    nw = int(os.environ.get('RH_WORKERS', '4'))
    rng = np.random.Generator(np.random.PCG64(20261120))
    ua = rng.uniform(0.0, umax, M//2)
    ub = np.exp(rng.uniform(math.log(1e-3), math.log(umax), M - M//2))
    uf = [float(v) for v in np.concatenate([ua, ub])]
    ustr = [repr(v) for v in uf]
    ctxm = mp.get_context('fork')
    _G['col'] = {}
    t0 = time.time()
    with ctxm.Pool(nw) as pool:
        for nm in names:
            ch = max(1, M//(4*nw))
            tasks = [(nm, prec, ustr[i:i + ch], umax) for i in range(0, M, ch)]
            parts = pool.map(col_pool_item, tasks, chunksize=1)
            rows = [v for p in parts for v in p]
            K3.setp(prec, 1)
            _G['col'][nm] = (uf, [[arb(s) for s in r[:9]] for r in rows], [r[9] for r in rows])
            print('pool', nm, '%.1f s' % (time.time() - t0), flush=True)
    res = {}
    with ctxm.Pool(nw) as pool:
        nch = 8*nw
        tasks = [(nm, prec, 5000 + 13*c, ntup//nch, M) for nm in names for c in range(nch)]
        for nm, cnt in pool.imap_unordered(col_chunk, tasks, chunksize=1):
            r = res.setdefault(nm, {})
            for k, v in cnt.items():
                a = r.setdefault(k, [0, 0, 0])
                for i in range(3):
                    a[i] += v[i]
    for nm in names:
        print(nm, {k: res[nm][k] for k in sorted(res[nm])}, flush=True)
    json.dump({'mode': 'colloc', 'prec': prec, 'pool': M, 'umax': umax, 'counts': '[plus, minus, undetermined]',
               'nodes': 'half uniform (0,umax], half log-uniform [1e-3,umax]', 'kernels': res, 'seconds': time.time() - t0},
              open(outf, 'w'), indent=0)


# ---------------- Schwarzian ----------------
def schw_item(args):
    name, prec, xs = args
    sp = K3.SPEC(name)
    out = []
    for xstr in xs:
        K3.setp(prec, 1)
        x0 = arb(xstr)
        ctx.cap = 6
        fact = [arb(1), arb(1), arb(2), arb(6), arb(24), arb(120)]
        def lser(spz, xx):
            F = Lval('z', spz, xx, prec, 5)
            ctx.cap = 6
            Fs = arb_series([F[k]/fact[k] for k in range(6)])
            return (Fs.derivative()/Fs).coeffs()
        if sp['type'] == 'ea':
            a = arb(sp['a'])
            L1 = lser({'type': 'zeta'}, x0 + a); L2 = lser({'type': 'zeta'}, x0 - a)
            Ls = [L1[k] + L2[k] for k in range(5)]
        elif sp['type'] == 'tnr':
            L1 = lser({'type': 'zeta'}, x0)
            l = arb(sp['q']).log()
            W = arb_series([x0, 1])*l
            ms = 2*(W.exp() + (-W).exp())/2 + arb(sp['c'])
            L2 = (ms.derivative()/ms).coeffs()
            Ls = [L1[k] + L2[k] for k in range(5)]
        else:
            Ls = lser(sp, x0)                       # L(x0 + d) = sum Ls[k] d^k, k <= 4
        ctx.cap = 6
        U0 = x0*x0
        xs_ = arb_series([U0, 1]).sqrt()            # x as a series in dU
        d = xs_ - x0
        acc = arb_series([Ls[4]])
        for k in (3, 2, 1, 0):
            acc = acc*d + Ls[k]
        h = acc/xs_
        j = arb_series([U0, 1])*h
        hc = h.coeffs(); jc = j.coeffs()
        Sh = 2*hc[1]*6*hc[3] - 3*(2*hc[2])**2
        Sj = 2*jc[1]*6*jc[3] - 3*(2*jc[2])**2
        out.append([xstr, K3.sgn(Sh), K3.sgn(Sj), K3.sgn(hc[0]), K3.sgn(hc[1])])
    return name, out


def run_schw(outf, names, npts, prec):
    nw = int(os.environ.get('RH_WORKERS', '4'))
    xs = [repr(10**(-2 + 4*i/(npts - 1))) for i in range(npts)]
    tasks = []
    for nm in names:
        ch = max(1, npts//(4*nw))
        for i in range(0, npts, ch):
            tasks.append((nm, prec, xs[i:i + ch]))
    res = {}
    t0 = time.time()
    with mp.get_context('fork').Pool(nw) as pool:
        for nm, out in pool.imap_unordered(schw_item, tasks, chunksize=1):
            res.setdefault(nm, []).extend(out)
    summ = {}
    for nm in names:
        rows = sorted(res[nm], key=lambda r: float(r[0]))
        o = {}
        for lab, col in (('S_h', 1), ('S_j', 2), ('h', 3), ('hprime', 4)):
            sig = [r[col] for r in rows]
            rr = []; i = 0
            for s, ln in K3.rle(sig):
                rr.append([s, round(float(rows[i][0]), 5), round(float(rows[i + ln - 1][0]), 5)]); i += ln
            o[lab] = rr
        summ[nm] = o
        print(nm, json.dumps(o), flush=True)
    json.dump({'mode': 'schw', 'prec': prec, 'x_grid': 'log-spaced 0.01..100, U = x^2', 'kernels': summ,
               'seconds': time.time() - t0}, open(outf, 'w'), indent=0)


if __name__ == '__main__':
    mode, outf = sys.argv[1], sys.argv[2]
    names = sys.argv[3].split(',')
    n = int(sys.argv[4])
    if mode == 'pick':
        run_pick(outf, names, n, int(sys.argv[5]) if len(sys.argv) > 5 else 1024, int(sys.argv[6]) if len(sys.argv) > 6 else 2048)
    elif mode == 'colloc':
        run_colloc(outf, names, n, int(sys.argv[5]) if len(sys.argv) > 5 else 512, int(sys.argv[6]) if len(sys.argv) > 6 else 2048)
    else:
        run_schw(outf, names, n, int(sys.argv[5]) if len(sys.argv) > 5 else 256)
