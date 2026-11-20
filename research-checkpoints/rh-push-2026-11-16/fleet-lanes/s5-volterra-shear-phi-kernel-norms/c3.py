# Combination 3: Phi-weighted shear/pass matrix on phi_j = Phi(tau) tau^j, j = 0..DEG:
#   D_jj = int cosh(a tau) Phi^2 tau^{2j},  H_jk = int sinh(a tau) Phi^2 tau^{j+k},  R_jk = H_jk/sqrt(D_jj D_kk).
# R > 0 entrywise, symmetric: norm = Perron value; enclosure by Collatz-Wielandt bounds in ball arithmetic.
# Locus a_1(DEG): norm R(a) = 1.   key 'flat' (Phi = 1 on [0,1]) is the source object (s = a).
# usage: python c3.py out.json PREC ROOTPREC [keys]
import sys, os, json, math, time
from multiprocessing import Pool
import numpy as np
from flint import arb, ctx
import slib, keys as KK

DEGS = [2, 4, 6, 8, 10, 12, 16, 20, 24, 30, 40, 50, 60]
DMAX = 60
AFIX = [0.5, 1.0, 3.0]


def moments(T, M, a, nmax):
    """p_n = int tau^n Phi^2 cosh(a tau), s_n = int tau^n Phi^2 sinh(a tau), n = 0..nmax."""
    a = arb(a)
    P = [arb(0)]*(nmax + 1); S = [arb(0)]*(nmax + 1)
    P = [arb(0) for _ in range(nmax + 1)]; S = [arb(0) for _ in range(nmax + 1)]
    for t, m in zip(T, M):
        e = (a*t).exp(); ei = 1/e
        c = m*(e + ei)/2; s = m*(e - ei)/2
        for n in range(nmax + 1):
            P[n] += c; S[n] += s
            c = c*t; s = s*t
    return P, S


def amin(zs):
    """exact lower endpoint of the smallest ball (rigorous lower bound of the minimum)."""
    best = None
    for z in zs:
        l = z.mid() - z.rad()
        l = l.mid() - l.rad()
        if best is None or l < best: best = l
    return best


def amax(zs):
    best = None
    for z in zs:
        l = z.mid() + z.rad()
        l = l.mid() + l.rad()
        if best is None or l > best: best = l
    return best


def perron(P, S, deg):
    """returns (lower, upper) arb Collatz-Wielandt bounds, float value, max diagonal (arb)."""
    n = deg + 1
    d = [P[2*j].sqrt() for j in range(n)]
    R = [[S[j + k]/(d[j]*d[k]) for k in range(n)] for j in range(n)]
    Rf = np.array([[float(x) for x in row] for row in R])
    w, v = np.linalg.eigh(Rf)
    x = np.abs(v[:, -1])
    xa = [arb(float(xx)) for xx in x]
    for it in range(400):                      # refine the Perron vector with exact midpoints
        y = [sum((R[j][k]*xa[k] for k in range(n)), arb(0)) for j in range(n)]
        nm = max(y, key=lambda z: float(z))
        xa = [arb((z/nm).mid()) for z in y]
        if it % 10 == 9:
            y2 = [sum((R[j][k]*xa[k] for k in range(n)), arb(0)) for j in range(n)]
            ratios = [y2[j]/xa[j] for j in range(n)]
            lo, hi = amin(ratios), amax(ratios)
            if (hi - lo)/hi < arb(10)**(-0.25*ctx.prec):
                break
    y2 = [sum((R[j][k]*xa[k] for k in range(n)), arb(0)) for j in range(n)]
    ratios = [y2[j]/xa[j] for j in range(n)]
    lo, hi = amin(ratios), amax(ratios)
    positive = all(R[j][k] > 0 for j in range(n) for k in range(n)) and all(z > 0 for z in xa)
    mdiag = max((R[j][j] for j in range(n)), key=lambda z: float(z))
    return lo, hi, float(w[-1]), mdiag, positive, float(w[-2]) if n > 1 else 0.0


def job(arg):
    key, prec, rprec = arg
    if key.startswith('E_b='):
        prec = min(prec, 600)          # convolution table: cost grows with the cube of the precision
    t0 = time.time()
    # root-finding at the low precision
    slib.setprec(rprec)
    T, W, K = slib.table(key)
    M = [w*k*k for w, k in zip(W, K)]
    cache = {}

    def norms(a):
        if a not in cache:
            P, S = moments(T, M, a, 2*DMAX)
            out = {}
            for dg in DEGS:
                n = dg + 1
                d = [math.sqrt(float(P[2*j])) if float(P[2*j]) < 1e300 else None for j in range(n)]
                dd = [P[2*j].sqrt() for j in range(n)]
                Rf = np.array([[float(S[j + k]/(dd[j]*dd[k])) for k in range(n)] for j in range(n)])
                out[dg] = float(np.linalg.eigvalsh(Rf)[-1])
            cache[a] = out
        return cache[a]

    rec = {'key': key, 'prec': prec, 'rootprec': rprec, 'nodes_root': len(T), 'deg': {}}
    for dg in DEGS:
        lo, hi = 1e-6, 1.0
        while norms(hi)[dg] < 1.0 and hi < 2000:
            lo = hi; hi *= 2.0
        while norms(lo)[dg] > 1.0 and lo > 1e-12:
            hi = lo; lo /= 4.0
        for _ in range(48):
            mid = 0.5*(lo + hi)
            if norms(mid)[dg] < 1.0: lo = mid
            else: hi = mid
            if hi - lo < 1e-13*hi: break
        rec['deg'][dg] = {'a1': 0.5*(lo + hi)}
    rec['fixed_a_float'] = {str(a): norms(a) for a in AFIX}
    # certification at the high precision: enclosures at a1 (1 -+ 1e-9), gap at a1
    slib.setprec(prec)
    T, W, K = slib.table(key)
    M = [w*k*k for w, k in zip(W, K)]
    rec['nodes_cert'] = len(T)
    for dg in DEGS:
        a1 = rec['deg'][dg]['a1']
        Pm, Sm = moments(T, M, a1*(1 - 1e-9), 2*dg); lo1, hi1, f1, md1, pos1, _ = perron(Pm, Sm, dg)
        Pp, Sp = moments(T, M, a1*(1 + 1e-9), 2*dg); lo2, hi2, f2, md2, pos2, _ = perron(Pp, Sp, dg)
        P0, S0 = moments(T, M, a1, 2*dg); lo0, hi0, f0, md0, pos0, w2 = perron(P0, S0, dg)
        rec['deg'][dg].update({'below_lt1': bool(hi1 < 1), 'above_gt1': bool(lo2 > 1), 'positive': bool(pos0 and pos1 and pos2),
                               'norm_at_a1': lo0.str(30), 'cw_width_log10': slib.log10abs(hi0 - lo0) if (hi0 - lo0).mid() != 0 else -9999,
                               'max_diag': float(md0), 'gap': float(lo0 - md0), 'second_eig': w2})
    for a in AFIX:
        P0, S0 = moments(T, M, a, 2*DMAX)
        rec.setdefault('fixed_a_cert', {})[str(a)] = {}
        for dg in DEGS:
            lo0, hi0, f0, md0, pos0, w2 = perron(P0, S0, dg)
            rec['fixed_a_cert'][str(a)][dg] = {'norm': lo0.str(25), 'gap': float(lo0 - md0), 'width_log10': slib.log10abs(hi0 - lo0) if (hi0 - lo0).mid() != 0 else -9999}
    rec['sec'] = time.time() - t0
    sys.stderr.write('%s done %.1fs\n' % (key, rec['sec']))
    return rec


if __name__ == '__main__':
    out = sys.argv[1]; prec = int(sys.argv[2]); rprec = int(sys.argv[3])
    ks = sys.argv[4].split(';') if len(sys.argv) > 4 else ['flat'] + KK.MAIN
    nw = int(os.environ.get('RH_WORKERS', '4'))
    with Pool(nw) as p:
        recs = p.map(job, [(k, prec, rprec) for k in ks], chunksize=1)
    json.dump(recs, open(out, 'w'))
    print('wrote', out)
