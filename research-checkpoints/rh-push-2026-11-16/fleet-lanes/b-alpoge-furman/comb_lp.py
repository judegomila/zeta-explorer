#!/usr/bin/env python3
"""Comb-level bandwidth-one ceiling LP by column generation.

Period-N configurations with N points (multiplicity counted), density 1:
  simple on-line points (mark 1), on-line doubles (mark 2), off-line pairs x +- i y (mode 'sym' only).
Grid form factor: s_j(Z) = |sum_k a_k(j) e^{2 pi i j x_k / N}|^2 / N, j = 1..N-1,
  a = 1 (simple), 2 (double), 2 cosh(2 pi j y / N) (pair).
Primal: minimise E_w[s1/N] over laws w with E_w[s_j] = j/N (j = 1..N-1), sum w = 1.
Any feasible law gives an upper bound for every linear bandwidth-one certificate at comb level N.
Usage: comb_lp.py N mode(on|sym) [rounds] [seed] [warm.json]
"""
import sys, json, itertools, time
import numpy as np
from scipy.optimize import linprog, minimize
from multiprocessing import Pool

N = int(sys.argv[1]); MODE = sys.argv[2]
ROUNDS = int(sys.argv[3]) if len(sys.argv) > 3 else 60
SEED = int(sys.argv[4]) if len(sys.argv) > 4 else 1
WARM = sys.argv[5] if len(sys.argv) > 5 else None
YMAX = 2.0
J = np.arange(1, N)            # constrained harmonics
TH = 2 * np.pi * J / N


def sj(x, typ, y):
    """x positions (K,), typ in {1,2,3} (simple,double,pair), y depths (K,) (0 unless pair). Returns s_j, A_j, amp."""
    amp = np.where(typ[None, :] == 3, 2 * np.cosh(TH[:, None] * y[None, :]), typ[None, :].astype(float))
    ph = np.exp(1j * TH[:, None] * x[None, :])
    A = (amp * ph).sum(axis=1)
    return (A.real ** 2 + A.imag ** 2) / N, A, amp, ph


def rc_and_grad(v, typ, lam, npair):
    K = len(typ)
    x = v[:K]; y = np.zeros(K)
    pidx = np.where(typ == 3)[0]
    y[pidx] = v[K:K + npair]
    s, A, amp, ph = sj(x, typ, y)
    f = -(lam * s).sum()
    # d s_j / d x_k = (2/N) Re(conj(A_j) * amp_jk * i TH_j ph_jk)
    dsx = (2.0 / N) * np.real(np.conj(A)[:, None] * amp * 1j * TH[:, None] * ph)
    gx = -(lam[:, None] * dsx).sum(axis=0)
    g = np.zeros_like(v); g[:K] = gx
    if npair:
        damp = 2 * np.sinh(TH[:, None] * y[None, pidx]) * TH[:, None]
        dsy = (2.0 / N) * np.real(np.conj(A)[:, None] * damp * ph[:, pidx])
        g[K:] = -(lam[:, None] * dsy).sum(axis=0)
    return f, g


def price(args):
    comp, lam, lam0, seed, starts = args
    n1, n2, npair = comp
    typ = np.array([1] * n1 + [2] * n2 + [3] * npair)
    K = len(typ)
    rng = np.random.default_rng(seed)
    cost = n1 / N
    best = (1e9, None)
    bounds = [(None, None)] * K + [(0.0, YMAX)] * npair
    inits = []
    for st in starts:
        if st is not None and len(st) == K + npair:
            inits.append(np.array(st) + 0.05 * rng.standard_normal(K + npair) * np.r_[np.ones(K), 0.2 * np.ones(npair)])
    nrand = 14
    for t in range(nrand):
        if t % 3 == 0:
            x0 = np.sort(rng.uniform(0, N, K))
        elif t % 3 == 1:
            x0 = (np.arange(K) * N / K + rng.uniform(0, N)) % N + 0.3 * rng.standard_normal(K)
        else:
            w = np.where(typ == 1, 1.0, 2.0); rng.shuffle(w)
            x0 = np.cumsum(w) - w / 2 + 0.25 * rng.standard_normal(K)
            # keep type order consistent with shuffled weights
            order = np.argsort(-w, kind='stable')
            tt = np.empty(K, int); xs = np.empty(K)
            heavy = [i for i in range(K) if w[i] == 2.0]; light = [i for i in range(K) if w[i] == 1.0]
            xs[:n1] = x0[light]; xs[n1:] = x0[heavy]; x0 = xs
        y0 = rng.choice([0.0, 0.02, 0.1, 0.3, 0.6, 1.2], size=npair)
        inits.append(np.r_[x0, y0])
    for v0 in inits:
        r = minimize(rc_and_grad, v0, args=(typ, lam, npair), jac=True, method='L-BFGS-B', bounds=bounds,
                     options={'maxiter': 400, 'ftol': 1e-14, 'gtol': 1e-10})
        val = cost - lam0 + r.fun
        if val < best[0]:
            best = (val, r.x.copy())
    return comp, best[0], best[1]


def column(comp, v):
    n1, n2, npair = comp
    typ = np.array([1] * n1 + [2] * n2 + [3] * npair)
    K = len(typ); x = np.array(v[:K]); y = np.zeros(K); y[typ == 3] = v[K:]
    s = sj(x, typ, y)[0]
    return s, n1 / N


def comps():
    out = []
    for n2 in range(0, N // 2 + 1):
        for npair in range(0, N // 2 - n2 + 1):
            if MODE == 'on' and npair:
                continue
            out.append((N - 2 * n2 - 2 * npair, n2, npair))
    return out


def main():
    rng = np.random.default_rng(SEED)
    cols = []   # (comp, v)
    C = comps()
    # seeds: lattice (simple), double lattice, random
    cols.append(((N, 0, 0), list(np.arange(N, dtype=float))))
    if N % 2 == 0:
        cols.append(((0, N // 2, 0), list(2.0 * np.arange(N // 2))))
    for c in C:
        for _ in range(6):
            K = c[0] + c[1] + c[2]
            cols.append((c, list(np.r_[rng.uniform(0, N, K), rng.uniform(0, 0.3, c[2])])))
    if WARM:
        for c, v in json.load(open(WARM))['support']:
            cols.append((tuple(c), v))
    m = N - 1
    BIG = 50.0
    pool = Pool(8)
    hist = []
    t0 = time.time()
    quiet = 0
    for it in range(ROUNDS):
        S = np.array([column(c, v)[0] for c, v in cols]).T     # m x ncol
        cost = np.array([column(c, v)[1] for c, v in cols])
        ncol = S.shape[1]
        Aeq = np.zeros((m + 1, ncol + 2 * m))
        Aeq[:m, :ncol] = S; Aeq[:m, ncol:ncol + m] = np.eye(m); Aeq[:m, ncol + m:] = -np.eye(m)
        Aeq[m, :ncol] = 1.0
        beq = np.r_[J / N, 1.0]
        cc = np.r_[cost, BIG * np.ones(2 * m)]
        res = linprog(cc, A_eq=Aeq, b_eq=beq, bounds=[(0, None)] * len(cc), method='highs')
        if res.status != 0:
            print('LP fail', res.message); break
        duals = res.eqlin.marginals
        lam = duals[:m]; lam0 = duals[m]
        w = res.x[:ncol]; slack = res.x[ncol:].sum()
        sup = [(cols[i], w[i]) for i in range(ncol) if w[i] > 1e-11]
        starts_by_comp = {}
        for (c, v), wi in sup:
            starts_by_comp.setdefault(c, []).append(v)
            # neighbours: double <-> pair conversions as extra starts
        jobs = [(c, lam, lam0, int(rng.integers(1 << 30)), starts_by_comp.get(c, [])[:4]) for c in C]
        out = pool.map(price, jobs)
        minrc = min(o[1] for o in out)
        added = 0
        for c, val, v in out:
            if val < -1e-9 and v is not None:
                cols.append((c, list(v))); added += 1
        hist.append((it, res.fun, slack, minrc, ncol))
        print(f'it {it:3d} obj {res.fun:.10f} slack {slack:.2e} minrc {minrc:+.3e} cols {ncol} added {added} t {time.time()-t0:.0f}s', flush=True)
        if slack < 1e-12 and minrc > -1e-8:
            quiet += 1
            if quiet >= 4:
                break
        else:
            quiet = 0
        # prune columns occasionally
        if ncol > 4000:
            keep = set(i for i in range(ncol) if w[i] > 1e-11)
            keep |= set(range(max(0, ncol - 1500), ncol))
            cols = [cols[i] for i in sorted(keep)]
    # final report
    support = []
    for (c, v), wi in sup:
        support.append({'comp': list(c), 'w': float(wi), 'v': [float(t) for t in v]})
    edge = 0.0
    for (c, v), wi in sup:
        n1, n2, npair = c
        typ = np.array([1] * n1 + [2] * n2 + [3] * npair); K = len(typ)
        x = np.array(v[:K]); y = np.zeros(K); y[typ == 3] = v[K:]
        amp = np.where(typ == 3, 2 * np.cosh(2 * np.pi * y), typ.astype(float))
        edge += wi * abs((amp * np.exp(2j * np.pi * x)).sum()) ** 2 / N
    pairmass = sum(wi * 2 * c[2] / N for (c, v), wi in sup)
    maxdepth = max([max(v[sum(c):], default=0.0) for (c, v), wi in sup if c[2] > 0], default=0.0)
    outj = {'N': N, 'mode': MODE, 'value': float(res.fun), 'slack': float(slack), 'minrc_last': float(minrc),
            'lam0': float(lam0), 'lam': [float(t) for t in lam], 'edge_S(1)': float(edge),
            'pair_point_fraction': float(pairmass), 'max_pair_depth': float(maxdepth),
            'support': [[s['comp'], s['v']] for s in support], 'weights': [s['w'] for s in support], 'hist': hist}
    fn = f'comb_N{N}_{MODE}_s{SEED}.json'
    json.dump(outj, open(fn, 'w'))
    print('FINAL', N, MODE, 'value', res.fun, 'slack', slack, 'minrc', minrc, 'edge', edge, 'pairfrac', pairmass, 'maxdepth', maxdepth, 'nsupport', len(sup))


if __name__ == '__main__':
    main()
