"""Own-form Weil positivity of Davenport-Heilbronn (and L(chi_-3) as comparison) on L^2(-a,a) at larger supports:
where does lambda_min change sign in the L^2 limit (the Suzuki cell matrices give 3.89 at mesh log 2 / 64).
usage: python dh_onset.py N prec workers outfile 2a_1 2a_2 ...
"""
import sys, json, time, math, os
import multiprocessing as mp
import numpy as np
from wlib import *
from flint import arf
N = int(sys.argv[1]); PREC = int(sys.argv[2]); WORKERS = int(sys.argv[3]); OUT = sys.argv[4]
SUP = sys.argv[5:]
setprec(PREC)
def ser(M): return [[tuple(int(t) for t in M[i, j].mid().man_exp()) for j in range(M.ncols())] for i in range(M.nrows())]
def des(L): return arb_mat([[arb(arf(t)) for t in row] for row in L])
def stage1(nodes):
    setprec(PREC)
    G = gl(N + 56); panels = 2
    Alog = arb_mat(N, N); T = {s: arb_mat(N, N) for s in SUP}
    I2 = eye(N) * 2
    for (p, k) in nodes:
        x, w = G[k]; lo = arb(2 * p) / panels; hw = arb(1) / panels
        v = lo + hw * (1 + x); wv = w * hw
        S = smat(v, N)
        Alog = Alog + (I2 - S) * (wv / (2 * v))
        for s in SUP:
            a = arb(s) / 2
            T[s] = T[s] + S * (r_z(arb('0.75'), a * v) * a * wv)
    return ser(Alog), {s: ser(M) for s, M in T.items()}
def stage2(s):
    setprec(PREC); t0 = time.time()
    a = arb(s) / 2
    Alog = des(PAY['Alog']); T = des(PAY['T'][s])
    M0 = Alog - eye(N) * (arb.const_euler() + (4 * a).log() + arb.pi().log()) - T
    nmax = int(math.exp(float(s))) + 1
    cd = coef_dh(nmax); cc = coef_chi(nmax, CHI3)
    Md = M0 + eye(N) * arb(5).log(); Mc = M0 + eye(N) * arb(3).log()
    for n in range(2, nmax + 1):
        if not (arb(n).log() < 2 * a): continue
        if float(abs(cd[n].mid())) == 0 and float(abs(cc[n].mid())) == 0: continue
        C = rung(N, a, n); S = C + C.transpose()
        Md = Md - S * cd[n]; Mc = Mc - S * cc[n]
    out = {'twoa': float(s), 'N': N}
    for nm, M in (('DH', Md), ('CHI-3', Mc)):
        for par, pn in ((0, 'even'), (1, 'odd')):
            idx = [i for i in range(N) if i % 2 == par]
            B = sub(M, idx); Bf = tofloat(B)
            w, V = np.linalg.eigh((Bf + Bf.T) / 2)
            lam = float(w[0]); how = 'f64'
            if abs(lam) < 1e-7:
                r = eigmin_subspace(B, w, V); lam = r['lam']; how = 'ball'
            v = V[:, 0]
            # dominant frequency of the minimiser: |ghat(t)|^2 peak, t on a grid (float)
            out['%s_%s' % (nm, pn)] = {'lam': lam, 'how': how, 'neg_count_f64': int(np.sum(w < -1e-9))}
    print(s, json.dumps(out), '%.0fs' % (time.time() - t0), flush=True)
    return s, out
if __name__ == '__main__':
    t0 = time.time()
    print('N = %d, prec %d, supports %s; planned: %d ball matrices %dx%d per worker (< %.1f GB per worker)' % (N, PREC, SUP, len(SUP) + 1, N, N, 3 * (len(SUP) + 1) * N * N * 200 / 1e9), flush=True)
    nodes = [(p, k) for p in range(2) for k in range(N + 56)]
    ctxf = mp.get_context('fork')
    with ctxf.Pool(WORKERS) as pool:
        parts = pool.map(stage1, [nodes[i::WORKERS] for i in range(WORKERS)])
    Alog = arb_mat(N, N); T = {}
    for A_, T_ in parts:
        Alog = Alog + des(A_)
        for key, L in T_.items(): T[key] = des(L) + T[key] if key in T else des(L)
    globals()['PAY'] = {'Alog': ser(Alog), 'T': {k: ser(M) for k, M in T.items()}}
    print('stage 1 done %.0fs' % (time.time() - t0), flush=True)
    with ctxf.Pool(min(WORKERS, len(SUP))) as pool:
        res = dict(pool.map(stage2, SUP, chunksize=1))
    json.dump({'N': N, 'prec': PREC, 'results': res}, open(OUT, 'w'), indent=1)
    print('written', OUT, '%.0fs' % (time.time() - t0))
