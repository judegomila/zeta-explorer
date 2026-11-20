"""Combinations 1 and 3: sector-split Weil forms (even / odd), full and pole-free, and Schur complements of the pole block.
usage: python sectors.py N prec workers outfile OBJSET digits 2a_1 2a_2 ...
OBJSET: all | big | bigdh      (big = ZETA, CHI-3, CHI5; bigdh adds DH)
Output: json lines per support in outfile + '.part.<2a>.json'.
"""
import sys, json, time, math, os
import multiprocessing as mp
import numpy as np
from slib import *

N = int(sys.argv[1]); PREC = int(sys.argv[2]); WORKERS = int(sys.argv[3]); OUT = sys.argv[4]; OBJSET = sys.argv[5]
DIGITS = int(sys.argv[6]); SUP = sys.argv[7:]
setprec(PREC)
ZK_ALL = ['0.25', '0.75', '0.3125', '0.1875', '0.375', '0.125']
ZKEYS = ZK_ALL if OBJSET == 'all' else ['0.25', '0.75']
PRIMES = [p for p in range(2, 2000) if all(p % q for q in range(2, int(p ** .5) + 1))]

# family: (z keys, pole list)
FAM = {'ZP': (['0.25'], ['0.5']), 'Z0': (['0.25'], []), 'O0': (['0.75'], []),
       'EA8': (['0.3125', '0.1875'], ['0.625', '0.375']), 'EA4': (['0.375', '0.125'], ['0.75', '0.25'])}


def objects(K):
    """name -> (family, shift = 2 log Q, real coefficient list c(0..K))"""
    O = {}
    O['ZETA'] = ('ZP', arb(0), coef_zeta(K))
    O['CHI-3'] = ('O0', arb(3).log(), coef_chi(K, CHI3))
    O['CHI5'] = ('Z0', arb(5).log(), coef_chi(K, CHI5))
    if OBJSET == 'big': return O
    O['DH'] = ('O0', arb(5).log(), coef_dh(K))
    if OBJSET == 'bigdh': return O
    for q in (2, 3, 5, 7, 11):
        O['TNR-q%d-c2.2' % q] = ('ZP', 2 * arb(q).log(), coef_tnr(K, q, '2.2'))
    O['TNR-q2-c1.0'] = ('ZP', 2 * arb(2).log(), coef_tnr(K, 2, '1.0'))
    O['EA-1/8'] = ('EA8', arb(0), coef_ea(K, arb(1) / 8))
    O['EA-1/4'] = ('EA4', arb(0), coef_ea(K, arb(1) / 4))
    # no functional equation: zeta's gamma factor and pole, changed prime side
    O['LIOUVILLE'] = ('ZP', arb(0), coef_mult(K, lambda p: -1))
    for q in (2, 3, 5, 7):
        O['FLIP%d' % q] = ('ZP', arb(0), coef_mult(K, lambda p, q=q: -1 if p == q else 1))
    for j in range(2):
        rng = np.random.Generator(np.random.PCG64(440000 + j))
        sg = {p: (1 if b else -1) for p, b in zip(PRIMES, rng.integers(0, 2, len(PRIMES)))}
        O['SGN-%02d' % j] = ('ZP', arb(0), coef_mult(K, lambda p, sg=sg: sg[p]))
    for j in range(2):
        rng = np.random.Generator(np.random.PCG64(450000 + j))
        th = dict(zip(PRIMES, 2 * math.pi * rng.random(len(PRIMES))))
        c = [arb(0)] * (K + 1)
        for n in range(2, K + 1):
            pk = primepower(n)
            if pk: c[n] = arb(math.cos(pk[1] * th[pk[0]])) * arb(pk[0]).log()
        O['U-%02d(Re)' % j] = ('ZP', arb(0), c)
    alpha = 1.2393168126993495
    c = [arb(0)] * (K + 1)
    for n in range(2, K + 1):
        pk = primepower(n)
        if pk: c[n] = arb(math.cos(alpha * math.log(n))) * arb(pk[0]).log()
    O['WT(Re)'] = ('ZP', arb(0), c)
    # mismatch probe: DH coefficients in zeta's gamma factor and pole
    O['DHcoef-ZETAarch'] = ('ZP', arb(0), coef_dh(K))
    return O




def worker(group):
    """S1_PART=r/m : assemble only the Gauss nodes k = r mod m and dump the partial sums (one support per call), no stage 2.
    S1_LOAD=m    : load the m partial sums instead of assembling, then stage 2."""
    import pickle
    setprec(PREC); t0 = time.time()
    group = [s for s in group if not os.path.exists('%s.part.%s.json' % (OUT, s))]
    if not group: return
    amax = max(float(s) for s in group) / 2
    Q = N + extra_nodes(amax, DIGITS)
    print('group %s: Gauss nodes %d (rho = %.3f)' % (group, Q, rho_bernstein(amax)), flush=True)
    part = os.environ.get('S1_PART'); load = os.environ.get('S1_LOAD')
    if part:
        r, m = [int(x) for x in part.split('/')]
        Alog, T = stage1_nodes(N, Q, list(range(Q))[r::m], group, ZKEYS)
        for s in group:
            pickle.dump({'Q': Q, 'Alog': [ser(x) for x in Alog], 'T': {z: [ser(x) for x in T[(s, z)]] for z in ZKEYS}},
                        open('%s.s1.%s.%dof%d.pkl' % (OUT, s, r, m), 'wb'))
        print('group %s: partial stage 1 (%d of %d) done %.0fs' % (group, r, m, time.time() - t0), flush=True)
        return
    if load:
        m = int(load)
        for s in group:
            Alog = None; T = {}
            for r in range(m):
                d = pickle.load(open('%s.s1.%s.%dof%d.pkl' % (OUT, s, r, m), 'rb'))
                assert d['Q'] == Q
                A_ = [des(x) for x in d['Alog']]
                Alog = A_ if Alog is None else [Alog[i] + A_[i] for i in range(2)]
                for z in ZKEYS:
                    L = [des(x) for x in d['T'][z]]
                    T[z] = L if z not in T else [T[z][i] + L[i] for i in range(2)]
                del d
            print('group %s: loaded %d partial sums %.0fs' % (group, m, time.time() - t0), flush=True)
            stage2(s, Alog, T)
        return
    Alog, T = stage1_nodes(N, Q, list(range(Q)), group, ZKEYS)
    print('group %s: stage 1 done %.0fs' % (group, time.time() - t0), flush=True)
    for s in group:
        stage2(s, Alog, {z: T[(s, z)] for z in ZKEYS})
        for z in ZKEYS: del T[(s, z)]


def stage2(s, Alog, T):
    part = '%s.part.%s.json' % (OUT, s)
    try:
        res = stage2_inner(s, Alog, T)
    except Exception as ex:
        import traceback
        print(s, 'FAILED', traceback.format_exc(), flush=True)
        return s, {'error': repr(ex)}
    json.dump(res, open(part, 'w'))
    return s, res


def stage2_inner(s, Alog, T):
    setprec(PREC); t0 = time.time()
    a = arb(s) / 2
    K = int(math.exp(float(s))) + 1
    d = [len(par_idx(N, 0)), len(par_idx(N, 1))]
    O = objects(K)
    ns = [n for n in range(2, K + 1) if arb(n).log() < 2 * a and any(float(abs(c[n].mid())) != 0 for (_, _, c) in O.values())]
    # pole-less forms (arch - primes) per object and parity; rungs are subtracted one n at a time (no rung storage)
    MM = {}
    for nm, (fam, shift, coef) in O.items():
        zs, poles = FAM[fam]
        MM[nm] = [arch_block(d[par], a, zs, Alog[par], [T[z][par] for z in zs], shift) for par in (0, 1)]
    for n in ns:
        v = arb(n).log() / a
        Sb = sblocks(v, N); sc = 1 / arb(n).sqrt()
        for nm, (fam, shift, coef) in O.items():
            if float(abs(coef[n].mid())) != 0:
                cf = coef[n] * sc
                for par in (0, 1): MM[nm][par] = MM[nm][par] - Sb[par] * cf
    print(s, 'rungs %d done %.0fs' % (len(ns), time.time() - t0), flush=True)
    polev = {}
    for fam, (zs, poles) in FAM.items():
        for p in poles:
            if p not in polev: polev[p] = pole_vectors(N, a, p)
    xs_vec = xsinh_vector(N, a)
    out = {'twoa': float(s), 'N': N, 'prec': PREC, 'nrungs': len(ns), 'objects': {}}
    for nm, (fam, shift, coef) in O.items():
        zs, poles = FAM[fam]
        rec = {}
        for par, pn in ((0, 'even'), (1, 'odd')):
            M = MM[nm][par]
            cols = [polev[p][par] for p in poles]
            blocks = {'pole': cols} if cols else {'formal': [pole_vectors(N, a, '0.5')[par]]}
            if par == 0 and fam == 'ZP': blocks['literal'] = [cols[0], xs_vec]
            an = analyse(M, cols, 1 if par == 0 else -1, blocks)
            b0 = an['pole'] if cols else an['formal']
            r = {'full': an['full'], 'block': 'pole' if cols else 'formal(cosh(x/2) | sinh(x/2))', 'pf': b0['pf'],
                 'schur': {'S': b0.get('S'), 'S_eigs': b0.get('S_eigs'), 'E_eigs': b0.get('E_eigs'), 'how': b0.get('how'),
                           'S_min': (b0['S_eigs'][0] if b0.get('S_eigs') else None), 'E_min': (b0['E_eigs'][0] if b0.get('E_eigs') else None)}}
            if 'literal' in an:
                b2 = an['literal']
                r['pf2'] = b2['pf']
                r['schur2'] = {'S': b2.get('S'), 'S_eigs': b2.get('S_eigs'), 'E_eigs': b2.get('E_eigs'),
                               'S_min': (b2['S_eigs'][0] if b2.get('S_eigs') else None)}
            rec[pn] = r
        out['objects'][nm] = rec
        MM[nm] = None
        print(s, nm, json.dumps({pn: {'full': rec[pn]['full']['lam'], 'pf': rec[pn]['pf']['lam'], 'S': rec[pn]['schur'].get('S_min')} for pn in rec}), '%.0fs' % (time.time() - t0), flush=True)
    return out


if __name__ == '__main__':
    t0 = time.time()
    d0 = (N + 1) // 2
    order = sorted(SUP, key=lambda x: -float(x))
    groups = [order[i::WORKERS] for i in range(WORKERS)]
    groups = [g for g in groups if g]
    nmat = 2 * (1 + max(len(g) for g in groups) * len(ZKEYS))
    print('N = %d, prec %d bits, target %d digits, supports %s, object set %s' % (N, PREC, DIGITS, SUP, OBJSET), flush=True)
    print('planned allocation: up to %d ball matrices %dx%d per worker plus rungs; about %.2f GB per worker (%.0f bytes per ball), %d workers'
          % (nmat, d0, d0, 4 * nmat * d0 * d0 * (96 + PREC / 4) / 1e9, 96 + PREC / 4, len(groups)), flush=True)
    ctxf = mp.get_context('fork')
    with ctxf.Pool(len(groups)) as pool:
        pool.map(worker, groups, chunksize=1)
    res = {}
    for s in SUP:
        part = '%s.part.%s.json' % (OUT, s)
        if os.path.exists(part): res[s] = json.load(open(part))
    json.dump({'N': N, 'prec': PREC, 'digits': DIGITS, 'results': res}, open(OUT, 'w'), indent=1)
    print('written', OUT, '%.0fs' % (time.time() - t0), flush=True)
