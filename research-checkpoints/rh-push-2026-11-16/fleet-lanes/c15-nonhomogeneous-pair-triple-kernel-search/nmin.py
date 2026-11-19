"""c15 families a2-with, a3-with: Re det[R(u_i + log n_j)], R = K_B / Kpol_A (PREREG section 4).
usage: nmin.py <outdir> [scale] [chunk]"""
import json
import multiprocessing as mp
import os
import sys
import time
import numpy as np
import funcs
import jf
import nobj

PAIRS = None
D = None
NP1 = None
NRAND = 2_000_000


def gen(m, scale):
    g = jf.gen_grid('JA')
    sel = (g['m'] == m) & (g['x'] % 2 == 0)
    g = jf.take(g, sel)
    r = np.random.Generator(np.random.PCG64(152000 + m))
    n = int(NRAND * scale)
    ci = r.integers(0, len(funcs.COLSETS[m]), n)
    u0 = r.uniform(-2.6, 2.6, n)
    h = r.uniform(0.02, 1.2, n)
    gg = r.uniform(-0.12, 0.12, n) if m > 2 else np.zeros(n)
    ok = funcs.minor_window_ok(m, funcs.COLSETS[m][ci], u0, h, gg)
    t = jf.mk(m, 2 * ci[ok], u0[ok], h[ok], gg[ok])
    return jf.cat([g, t]), jf.nfun(g)


def signs(m, tab, pairs):
    P = jf.points('JA', m, tab)
    uq, inv = np.unique(P.ravel(), return_inverse=True)
    inv = inv.reshape(P.shape)
    F = jf.nfun(tab)
    out = np.zeros((F, len(pairs)), dtype=np.int8)
    cache = {}
    for j, p in enumerate(pairs):
        ka = id(p.A)
        if ka not in cache:
            if len(cache) > 30:
                cache.clear()
            K, N = p.A.val(uq, True)
            cache[ka] = (np.asarray(K), np.asarray(N))
        KA, NA = cache[ka]
        kb = id(p.B)
        if p.group in ('P', 'PX', 'PH'):
            if kb not in cache:
                K, N = p.B.val(uq, True)
                cache[kb] = (np.asarray(K), np.asarray(N))
            KB, NB = cache[kb]
        else:
            KB, NB = p.B.val(uq, True)
        with np.errstate(divide='ignore', invalid='ignore'):
            R = KB / KA
            NR = (NB + np.abs(R) * NA) / np.abs(KA)
        bad = ~np.isfinite(R) | ~np.isfinite(NR)
        R = np.where(bad, 0, R)
        NR = np.where(bad, np.inf, NR)
        M = R[inv].T.reshape(F, m, m)
        Nz = NR[inv].T.reshape(F, m, m)
        out[:, j] = funcs.det_sign(M, Nz)
    return out


def crit(S, d, pos, classes):
    X = S[:, pos]
    s = np.where((X == 1).all(1), 1, np.where((X == -1).all(1), -1, 0)).astype(np.int8)
    one = s != 0
    tr = np.stack([(S[:, d['C%d' % k]] == -s[:, None]).any(1) & one for k in classes], 1)
    hf = np.stack([(S[:, d['H%d' % k]] == -s[:, None]).sum(1) for k in classes], 1)
    hf[~one] = 0
    same = (S[:, d['PH']] == s[:, None]).sum(1)
    tt = one & tr.all(1)
    full = tt & (same >= 23) & (hf >= 23).all(1)
    opt = np.zeros(len(S), dtype=bool)
    for sg in (1, -1):
        ok = ~(X == -sg).any(1)
        for k in classes:
            C = d['C%d' % k]
            ok &= ((S[:, C] == -sg) | (S[:, C] == 0)).any(1)
        opt |= ok
    best = int(np.where(one & (same >= 23), hf.min(1), 0).max()) if len(S) else 0
    return dict(one=int(one.sum()), ttrain=int(tt.sum()), full=int(full.sum()), optimistic=int(opt.sum()), best_min_heldout=best,
                rejected=[int(x) for x in tr.sum(0)], nrej_hist=[int(((tr.sum(1) == q) & one).sum()) for q in range(len(classes) + 1)]), tt, opt & ~tt, full


def work(args):
    m, tab, i0 = args
    t = time.time()
    S1 = signs(m, tab, PAIRS[:NP1])
    conflict = (S1 == 1).any(1) & (S1 == -1).any(1)
    sel = np.nonzero(~conflict)[0]
    res = {}
    keep = {}
    if sel.size:
        S2 = signs(m, jf.take(tab, sel), PAIRS[NP1:])
        S = np.concatenate((S1[sel], S2), axis=1)
        PA = np.concatenate((D['P'], D['PX']))
        for name, pos, cl in (('PA/all', PA, nobj.ALLC), ('PA/FE', PA, nobj.FE_CLASSES), ('PZ/all', D['P'], nobj.ALLC)):
            r, tt, und, full = crit(S, D, pos, cl)
            res[name] = r
            keep[name] = dict(ttrain=(i0 + sel[tt]).tolist(), und=(i0 + sel[und]).tolist(), full=(i0 + sel[full]).tolist())
    return i0, len(S1), int(sel.size), float((S1 == 0).mean()), res, keep, time.time() - t


def main():
    global PAIRS, D, NP1
    out = sys.argv[1]
    scale = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
    chunk = int(sys.argv[3]) if len(sys.argv) > 3 else 20000
    skip = tuple(int(x) for x in os.environ.get('C15_SKIP', '').split(',') if x)
    os.makedirs(out, exist_ok=True)
    PAIRS = nobj.build({}, skip)
    G = np.array([p.group for p in PAIRS])
    D = nobj.gidx(G)
    NP1 = int((G == 'P').sum())
    assert (G[:NP1] == 'P').all()
    nw = int(os.environ.get('RH_WORKERS', '4'))
    ctx = mp.get_context('fork')
    with ctx.Pool(nw) as pool:
        for m in (2, 3):
            t1 = time.time()
            tab, ngrid = gen(m, scale)
            F = jf.nfun(tab)
            np.savez(os.path.join(out, 'a%d-with_params.npz' % m), **tab)
            print('a%d-with: %d functionals (%d grid); planned per worker: int8[%d x %d] = %.0f MB and complex128[%d x %d] = %.0f MB'
                  % (m, F, ngrid, chunk, len(PAIRS), chunk * len(PAIRS) / 1e6, chunk * m * m, 4, chunk * m * m * 64 / 1e6), flush=True)
            jobs = [(m, jf.take(tab, slice(i, min(F, i + chunk))), i) for i in range(0, F, chunk)]
            tot = {}
            keep = {}
            st2 = 0
            und = 0.0
            done = 0
            for i0, n, n2, us, res, kp, dt in pool.imap_unordered(work, jobs):
                st2 += n2
                und += us
                for name, r in res.items():
                    if name not in tot:
                        tot[name] = r
                        keep[name] = kp[name]
                    else:
                        for k, v in r.items():
                            tot[name][k] = [a + b for a, b in zip(tot[name][k], v)] if isinstance(v, list) else (max(tot[name][k], v) if k == 'best_min_heldout' else tot[name][k] + v)
                        for k in kp[name]:
                            keep[name][k] += kp[name][k]
                done += 1
                if done % 20 == 0 or done == len(jobs):
                    print('  a%d chunk %d/%d (%.0fs chunk, %.0fs)' % (m, done, len(jobs), dt, time.time() - t1), flush=True)
            json.dump(dict(functionals=F, grid=ngrid, stage2=st2, und_share_stage1=und / len(jobs), tiers=tot, rows=keep),
                      open(os.path.join(out, 'a%d-with_summary.json' % m), 'w'))
            print('a%d-with: F=%d stage2=%d | %s' % (m, F, st2, json.dumps(tot)), flush=True)
    print('MIN-DONE', flush=True)


if __name__ == '__main__':
    main()
