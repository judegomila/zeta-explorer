#!/usr/bin/env python3
"""bdelta.py -- abscissa B as a function of an assumed saving delta in the sextic theta-row correlation
(exceptional term P_a^{(1-delta)/6} in place of P_a^{1/6}), 200 values of delta in [0, 1]. Two MODELS, no certificate:
 (P)  paper system: tmp/sextic/conj_reopt.py (probe geometry re-optimised, Section-20 closing inequalities, c15 = 4);
 (XS) balanced scalar system of Liu II / Xu-Sang as coded in push/r3-critical-count/caps.py (LP in (b, l), fixed point
      kappa = max(13/18, 2B - 1)); the saving enters the low-side exponent as -delta b/12, i.e. B = 11/12 - l/4 - delta b/12.
      Modes 'optimistic' (count rows only) and 'gates' (with the gates of Remark 14.1).
usage: bdelta.py P|XS out.json"""
import sys, os, json, time
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
which, outp = sys.argv[1], sys.argv[2]
grid = [i / 199 for i in range(200)]
res = []; t0 = time.time()
if which == 'P':
    sys.path.insert(0, os.path.join(REPO, 'tmp', 'sextic')); sys.argv = ['x']
    import conj_reopt as C
    seed = (1 / 6, 1 / 8)
    for e in grid:
        S = dict(C.S_.BASE); S['cp'] = (1 - e) / 6; S['c15'] = 4
        r = C.solve(S, seeds=(seed, (1 / 6, 1 / 8)))
        if r is None: res.append(dict(delta=e, B=None)); continue
        s0, ell, b, act = r; seed = (ell, b)
        res.append(dict(delta=e, B=s0, ell=ell, b=b, active=act))
        print(f"{e:.4f} {s0:.7f} {ell:.5f} {b:.5f} {act} {time.time() - t0:.0f}s", flush=True)
        json.dump(res, open(outp, 'w'))
else:
    sys.path.insert(0, os.path.join(HERE, '..', '..', 'r3-critical-count'))
    import caps
    from scipy.optimize import linprog
    def step(k, R, d, x, mode, eta):
        ck = 1 / (3 * k); dx = d * x
        cb = 1 / 6 - dx * ck / 8 - (3 / 8) * (1 - R); cl = 5 / 4 + dx * (1 + 5 * ck / 8) - (9 / 8) * (1 - R); c0 = -1 / 4 + d / 2 - dx * ck / 8 - (3 / 8) * (1 - R)
        A = [np.c_[cb.ravel(), cl.ravel()]]; ub = [-c0.ravel()]
        def add(row, rhs): A.append(np.array([row])); ub.append(np.array([rhs]))
        add([-1, 0], 0); add([0, 1], 1 / 5)
        if mode == 'gates':
            e = 1e-9
            add([0, -1], -1 / 6); add([1, 3], 1 - e); add([17 / 6, 3], 1 - e); add([0, -6 * k], -3 / 4 - e); add([-1, 12 * k - 3], 1 - e)
            add([0.21, 0.63 - 2], -0.21 - e); add([-1, 5], 1 - e); add([1, -1], -e)
            g = (6 * k - 2 * dx); A.append(np.c_[(R / 2).ravel(), (1.5 * R - g).ravel()]); ub.append((-R / 2).ravel())
            add([1 / 6, 5 / 4], 1 / 4 - 1 / 250); add([1 / 6, 5 / 4 + 3 / 100], 1 / 4 - 1 / 50); add([13 / 150 - 1 / 4, 39 / 150 + 1 / 4], -1 / 20 - 1 / 50 - 13 / 150 + 1 / 4)
        r = linprog([-eta / 3, -1], A_ub=np.vstack(A), b_ub=np.concatenate(ub), bounds=[(None, None)] * 2, method='highs')
        if r.status != 0: return None
        return 11 / 12 - r.x[1] / 4 - eta * r.x[0] / 12, r.x[0], r.x[1]
    d = np.linspace(1 / 8, 5 / 6, 141)[:, None]; x = np.linspace(0, .5, 21)[None, :]
    cache = {}
    def R_of(k):
        kk = round(k, 7)
        if kk not in cache: cache[kk] = caps.count(d, x, kk, nt=101, nr=301)
        return cache[kk]
    # validation of the copy: eta = 0 reproduces caps.solve
    for mode in ('optimistic', 'gates'):
        for e in grid:
            k = 0.75; out = None
            for it in range(40):
                out = step(k, R_of(k), d, x, mode, e)
                if out is None: break
                kn = max(13 / 18, 2 * out[0] - 1)
                if abs(kn - k) < 1e-7: break
                k = kn
            res.append(dict(mode=mode, delta=e, B=None if out is None else out[0], b=None if out is None else out[1], l=None if out is None else out[2], kappa=k))
            print(mode, f"{e:.4f}", out, f"kappa {k:.6f} {time.time() - t0:.0f}s", flush=True)
            json.dump(res, open(outp, 'w'))
print("done", flush=True)
