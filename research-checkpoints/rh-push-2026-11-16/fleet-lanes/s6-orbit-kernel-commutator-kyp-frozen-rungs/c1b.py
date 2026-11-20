# Combination 1, part B: translation (Polya-frequency) minors det[Phi(x_i - y_j)] and Hankel (Turan-type) minors det[Phi(u0 + (i+j) h)]
# of orders 3..10 at random node tuples on a grid of step 1/64, in three ranges:
#   bulk    : nodes in [-1.5, 1.5]                (differences up to 3; inside the ranges of the earlier searches, orders above theirs)
#   cluster : nodes in a random window of width 1/2 (near-confluent: Wronskian regime)
#   far     : nodes in [-5, 5]                    (differences up to 10; outside every recorded range)
# Every sign is the sign of a python-flint ball; "und" counts balls containing 0.
# usage: c1b.py out.json prec tuples_per_cell [obj1,obj2,...]
import sys, json, math, random, time, os
from multiprocessing import Pool
from flint import arb, arb_mat, ctx
import slib, olib

D = 64
ORDERS = list(range(3, 11))


def kernel_fn(key):
    if key == 'gauss': return lambda u: (-(u*u)*3).exp()
    if key == 'cauchy': return lambda u: 1/(1 + u*u)          # not PF_2 beyond |u| > 1 (known-answer control: mixed signs)
    if key == 'zeta_os': return slib.phi_zeta
    fn, panels, note = slib.kernel_spec(key)
    return fn


def build_table(key, kmax, prec):
    ctx.prec = prec
    if key.startswith('E_b='):
        T = [arb(k)/D for k in range(0, kmax + 1)]
        return slib.conv_table(float(key[4:]), T, slib.npp_for(prec))
    fn = kernel_fn(key)
    return [fn(arb(k)/D) for k in range(0, kmax + 1)]


def lu_det(ent, r):
    """determinant in balls for badly scaled matrices: columns are permuted by the maximum-weight assignment of
    log|a_ij| (the dominant permutation of the Leibniz sum), then elimination without pivoting."""
    import numpy as np
    from scipy.optimize import linear_sum_assignment
    A = [ent[i*r:(i + 1)*r] for i in range(r)]
    C = np.empty((r, r))
    for i in range(r):
        for j in range(r):
            v = A[i][j]
            C[i, j] = -slib.log10abs(v) if (v > 0 or v < 0) else 1e300
    C = np.minimum(C, 1e300)
    rows, cols = linear_sum_assignment(C)
    perm = list(cols)
    sign = 1
    seen = [False]*r
    for i in range(r):
        if not seen[i]:
            j = i; L = 0
            while not seen[j]:
                seen[j] = True; j = perm[j]; L += 1
            if L % 2 == 0: sign = -sign
    A = [[A[i][perm[k]] for k in range(r)] for i in range(r)]
    det = arb(sign)
    for k in range(r):
        p = A[k][k]
        if not (p > 0 or p < 0):
            return arb(0, 1)
        det = det*p
        for i in range(k + 1, r):
            f = A[i][k]/p
            Ai = A[i]; Ak = A[k]
            for j in range(k + 1, r):
                Ai[j] = Ai[j] - f*Ak[j]
    return det


def run_object(args):
    key, prec, ntup, seed = args
    t0 = time.time()
    ctx.prec = prec
    onesided = key in ('liouville', 'zeta_os')
    far_ok = not key.startswith('E_b=')
    kmax = 10*D if far_ok else 3*D
    tab = build_table(key, kmax, prec)
    tb = time.time() - t0
    rnd = random.Random(seed)
    res = {}

    def val(k):
        return tab[abs(k)]

    def cell(family, regime, r):
        npos = nneg = nund = 0
        for _ in range(ntup):
            if family == 'trans':
                if regime == 'cluster':
                    c0 = rnd.randint(-96, 96 - 32); lo, hi = c0, c0 + 32
                else:
                    W = 96 if regime == 'bulk' else 320
                    lo, hi = -W, W
                if onesided:
                    W = 96 if regime != 'far' else 320
                    if regime == 'cluster':
                        xs = sorted(rnd.sample(range(W - 32, W + 1), r)); ys = sorted(rnd.sample(range(-32, 1), r))
                    else:
                        xs = sorted(rnd.sample(range(0, W + 1), r)); ys = sorted(rnd.sample(range(-W, 1), r))
                else:
                    xs = sorted(rnd.sample(range(lo, hi + 1), r)); ys = sorted(rnd.sample(range(lo, hi + 1), r))
                ent = [val(x - y) for x in xs for y in ys]
            else:
                # Hankel: arguments u0 + (i + j) h, i, j = 0..r-1
                if regime == 'cluster':
                    h = rnd.randint(1, 2); span = (2*r - 2)*h
                    u0 = rnd.randint(0 if onesided else -96, 96 - span)
                else:
                    W = 96 if regime == 'bulk' else 640
                    hmax = max(1, (2*W if not onesided else W)//(2*r - 2)) if regime == 'bulk' else max(1, W//(2*r - 2))
                    h = rnd.randint(1, hmax); span = (2*r - 2)*h
                    if regime == 'bulk':
                        u0 = rnd.randint(0 if onesided else -W, W - span)
                    else:
                        u0 = rnd.randint(0 if onesided else -(W - span)//2, W - span)
                ent = [val(u0 + (i + j)*h) for i in range(r) for j in range(r)]
            d = arb_mat(r, r, ent).det()
            if not (d > 0 or d < 0):
                d = lu_det(ent, r)
            if d > 0: npos += 1
            elif d < 0: nneg += 1
            else: nund += 1
        return [npos, nneg, nund]

    for family in ('trans', 'hankel'):
        for regime in ('bulk', 'cluster', 'far'):
            if regime == 'far' and not far_ok: continue
            for r in ORDERS:
                res['%s|%s|%d' % (family, regime, r)] = cell(family, regime, r)
    return key, res, tb, time.time() - t0


if __name__ == '__main__':
    out_path = sys.argv[1]; prec = int(sys.argv[2]); ntup = int(sys.argv[3])
    objs = sys.argv[4].split(';') if len(sys.argv) > 4 else ['gauss', 'cauchy', 'zeta', 'chi-4', 'chi5', 'chi-3', 'DH', 'E_b=0.25', 'NR(1000003,2.2)', 'NR(3,2.2)',
                                                             'heat-0.5', 'heat-2', 'liouville', 'zeta_os', 'zeta_lead', 'NR(3,1.9)']
    print('planned: %d objects, table of at most %d balls of %d bits each (%.1f MB per object)' % (len(objs), 10*D + 1, prec, (10*D + 1)*prec/8/2**20), flush=True)
    out = {'prec': prec, 'tuples_per_cell': ntup, 'grid_step': 1.0/D, 'objects': {}}
    with Pool(min(olib.workers(), len(objs))) as p:
        for key, res, tb, tt in p.imap_unordered(run_object, [(k, prec, ntup, 1000 + i) for i, k in enumerate(objs)]):
            out['objects'][key] = res
            print(key, 'table %.1fs total %.1fs' % (tb, tt), flush=True)
            json.dump(out, open(out_path, 'w'), indent=1)
    tot = sum(sum(v) for o in out['objects'].values() for v in o.values())
    out['total_tuples'] = tot
    json.dump(out, open(out_path, 'w'), indent=1)
    print('total tuples', tot)
