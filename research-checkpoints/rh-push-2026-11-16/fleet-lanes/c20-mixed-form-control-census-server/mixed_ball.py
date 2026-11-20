# Part 2, ball stage: T1 and T2 at single points by direct summation over n < P in python-flint balls.
# Exact coefficients (parameters a = 1/10, b = 1/5, eps = 1/100, c = 11/5 as rationals). ZQ is not implemented here.
import os, sys, json, math, time, bisect
os.environ['OMP_NUM_THREADS'] = '1'
import numpy as np
import flint
from flint import arb, acb
import mixed
from multiprocessing import Pool
CKQ = {0: (3, 8), 1: (-1, 4), -1: (-1, 4), 2: (1, 16), -2: (1, 16)}
DH_PMAX = int(float(os.environ.get('DH_PMAX', '2500000')))

def cterms(u):
    pi = arb.pi(); I = acb(0, 1)
    ck = {k: arb(v[0]) / v[1] for k, v in CKQ.items()}
    om = {k: 2 * pi * k / u for k in ck}
    out = []
    for l in ck:
        al = acb(ck[l] ** 2 * u)
        for k in ck:
            if k != l: al += 2 * ck[k] * ck[l] / (I * (om[l] - om[k]))
        out.append((al, acb(-ck[l] ** 2), -om[l]))
    return out

def local_arb(cls, J):
    if cls == 'TNR': q = 3; num = [arb(1), arb(11) / 5, arb(1)]; den = [arb(1)]
    elif cls == 'HQ2':
        q = 2; e = arb(1) / 100; num = [arb(1), arb(-4), 6 + e, arb(-4), arb(1)]; den = [arb(1), arb(-4), arb(6), arb(-4), arb(1)]
    else:
        q = 2; lq = arb(2).log(); a = arb(1) / 10; b = arb(1) / 5
        al = (a * lq).exp() + (-a * lq).exp(); be = (b * lq).exp() + (-b * lq).exp()
        num = [arb(1), -al if cls == 'HQ3' else al, arb(1)]; den = [arb(1), -be, arb(1)]
    def lg(n):
        n = list(n) + [arb(0)] * (J + 1); l = [arb(0)] * (J + 1)
        for j in range(1, J + 1):
            s = j * n[j]
            for i in range(1, j): s -= i * l[i] * n[j - i]
            l[j] = s / j
        return l
    x, y = lg(num), lg(den)
    return q, [x[j] - y[j] for j in range(J + 1)]

def atoms(obj, P):
    """yields (n, log n, Lambda_F(n)) ascending, balls"""
    cls = obj[0]
    if cls == 'DH':
        if P > DH_PMAX: raise ValueError('DH ball stage limited to P <= %d' % DH_PMAX)
        k = ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
        per = [arb(0), arb(1), k, -k, arb(-1)]
        N = P - 1
        lam = [None] * (N + 1); logs = [None] * (N + 1)
        for n in range(2, N + 1):
            logs[n] = arb(n).log(); lam[n] = per[n % 5] * logs[n]
        for d in range(2, N // 2 + 1):
            v = lam[d]
            for m in range(2, N // d + 1):
                r = m % 5
                if r: lam[d * m] = lam[d * m] - v * per[r]
        for n in range(2, N + 1): yield n, logs[n], lam[n]
        return
    pp = mixed.PP(P)
    fl = pp.lam(('zeta',) if cls == 'ZQ' else obj)
    loc = None
    if cls in ('TNR', 'HQ2', 'HQ3', 'HQ4'):
        loc = local_arb(cls, int(math.log(P) / math.log(mixed.local_poly(cls)[0])) + 2)
    a = arb(1) / 10
    th = None
    if cls == 'haar':
        th = 2 * math.pi * np.random.default_rng(770000 + obj[1]).random(max(mixed.NPMAX, len(pp.pr)))[:len(pp.pr)]
    logp_cache = {}
    for i in range(len(pp.n)):
        n = int(pp.n[i]); p = int(pp.pr[pp.ix[i]]); k = int(pp.k[i])
        if fl[i] == 0: continue
        lp = arb(p).log(); ln = k * lp
        if cls in ('zeta', 'DEL'): L = lp
        elif cls == 'EA': L = lp * ((a * ln).exp() + (-a * ln).exp())
        elif cls in ('chain', 'LIOU'): L = lp if fl[i].real > 0 else -lp
        elif cls == 'haar': L = lp * (acb(0, 1) * arb(float(th[pp.ix[i]])) * k).exp()
        elif loc is not None:
            q, g = loc
            L = lp * (1 + k * g[k] * (arb(q).sqrt()) ** k) if p == q else lp
        else: raise ValueError(cls)
        yield n, ln, L

def ball_point(pt, prec):
    flint.ctx.prec = prec
    t, th, w, obj, tau = pt['t'], pt['theta'], pt['w'], tuple(pt['obj']), pt['tau']
    P = mixed.P_of(t, th); u = arb(P).log(); tw = arb(t + 200.0 * w); x = tw + arb(tau)
    Lg = (tw / (2 * arb.pi())).log()
    R = 2 * Lg if obj[0] == 'EA' else ((5 * tw / (2 * arb.pi())).log() if obj[0] == 'DH' else Lg)
    ct = cterms(u); nl = len(ct); I = acb(0, 1)
    sq = math.isqrt(P - 1)
    at = list(atoms(obj, P))
    small = [n for n, _, _ in at if n <= sq]
    cuts = sorted({(P - 1) // m for m in small}); cp = 0; snap = {}
    U = [acb(0)] * nl; V = [acb(0)] * nl; W = [acb(0)] * nl; Acc = [acb(0)] * nl; Bcc = [acb(0)] * nl
    sm_e = []; sm_pre = []; sm_ln = []
    for n, ln, L in at:
        while cp < len(cuts) and cuts[cp] < n:
            snap[cuts[cp]] = list(U); cp += 1
        base = L * (-ln / 2).exp() * (-I * x * ln).exp()
        e = [base * (I * nu * ln).exp() for _, _, nu in ct]
        for l in range(nl):
            U[l] = U[l] + e[l]; V[l] = V[l] + e[l] * ln; W[l] = W[l] + e[l] * ln * ln
        if n <= sq:
            sm_e.append(e); sm_ln.append(ln); sm_pre.append(list(U))
        else:
            y = (P - 1) // n
            j = bisect.bisect_right(small, y) - 1
            if j >= 0:
                pre = sm_pre[j]
                for l in range(nl):
                    z = e[l] * pre[l]
                    Acc[l] = Acc[l] + z; Bcc[l] = Bcc[l] + z * ln
    while cp < len(cuts):
        snap[cuts[cp]] = list(U); cp += 1
    for m, e, ln in zip(small, sm_e, sm_ln):
        pre = snap[(P - 1) // m]
        for l in range(nl):
            z = e[l] * pre[l]
            Acc[l] = Acc[l] + z; Bcc[l] = Bcc[l] + z * ln
    S1 = acb(0); Sl = acb(0); Sc = acb(0)
    for l, (al, be, nu) in enumerate(ct):
        S1 += al * U[l] + be * V[l]; Sl += al * V[l] + be * W[l]; Sc += al * Acc[l] + 2 * be * Bcc[l]
    c0 = 35 * u / 128
    T1n = (R - 2 * S1.real / c0) / Lg
    T2n = (R * R / 2 - 2 * R * S1.real / c0 + 2 * (Sl.real + Sc.real) / c0) / Lg ** 2
    return T1n, T2n, len(at)

def work(pt):
    t0 = time.time()
    out = dict(pt)
    try:
        T1n, T2n, na = ball_point(pt, pt.get('prec', 128))
        out.update({'T1n': float(T1n.mid()), 'T1n_rad': float(T1n.rad()), 'T2n': float(T2n.mid()), 'T2n_rad': float(T2n.rad()), 'atoms': na,
                    'sign2': 'neg' if T2n < 0 else ('pos' if T2n > 0 else 'undecided'), 'sign1': 'neg' if T1n < 0 else ('pos' if T1n > 0 else 'undecided')})
    except (ValueError, MemoryError) as ex:
        out['error'] = str(ex)
    out['sec'] = time.time() - t0
    return out

if __name__ == '__main__':
    pts = json.load(open(sys.argv[1])); outfn = sys.argv[2]
    nw = int(os.environ.get('RH_WORKERS', '4'))
    pts.sort(key=lambda p: -mixed.P_of(p['t'], p['theta']))
    print('points', len(pts), 'workers', nw, 'largest P', mixed.P_of(pts[0]['t'], pts[0]['theta']), 'planned memory per worker below 1.5 GB (DH lists: about 0.35 GB per 1e6 of P)', flush=True)
    with Pool(nw, maxtasksperchild=2) as pool, open(outfn, 'a') as fo:
        for r in pool.imap_unordered(work, pts, chunksize=1):
            fo.write(json.dumps(r) + '\n'); fo.flush()
            print(r['t'], r['theta'], r['w'], r['obj'], 'tau', r['tau'], 'prec', r.get('prec', 128), 'T2n float %s ball %s rad %s %s' % (r.get('float_T2n'), r.get('T2n'), r.get('T2n_rad'), r.get('sign2', r.get('error'))), 'sec %.0f' % r['sec'], flush=True)
