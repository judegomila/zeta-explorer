"""(K3) for a cusp form: F = sym^2 of the first odd Maass form of SL2(Z). K_F(G) = sum_{Q in G} F(Q)/|O(Q)|.
float64; error bar per class = spread of F over basis orderings (measured invariance defect)."""
import sys, json, os, itertools, math, time
import numpy as np
from fractions import Fraction
from genus import *
import gl3

def F_with_err(k, E):
    A = np.array(gram_from_key(k), float)
    cands = []
    for perm in itertools.permutations(range(3)):
        Sp = A[np.ix_(perm, perm)]
        _, _, _, y1, y2 = gl3.coords(Sp)
        cands.append((min(y1, y2), perm))
    cands.sort(reverse=True)
    vals = []; st = {}
    for i, (my, perm) in enumerate(cands[:3]):
        if i > 0 and my < 0.6: continue
        s = {}
        vals.append(gl3.phi(A[np.ix_(perm, perm)], E, s)); st = st or s
    st['orderings'] = len(vals)
    return vals[0], max(abs(v - vals[0]) for v in vals) + 2e-8*abs(vals[0]) + 1e-10, st

def run_quad(p, q, E):
    gl3.ktab()
    out = dict(p=p, q=q, E=E)
    K = {}; err = {}; info = {}
    for name, d, pr in (('1', 1, ()), ('p', p, (p,)), ('q', q, (q,)), ('pq', p*q, (p, q))):
        t0 = time.time()
        target = genus_inv(((1,0,0),(0,1,0),(0,0,d)), pr)
        L = classes(d, pr)[target]
        tot = 0.0; e = 0.0; rows = []; absum = 0.0
        for k, o in L:
            v, dv, st = F_with_err(k, E)
            tot += v/o; e += dv/o; absum += abs(v)/o
            rows.append(dict(form=list(k), aut=o, F=v, spread=dv, terms=st.get('terms'), m2max=st.get('m2max'), orderings=st.get('orderings'), y=[st.get('y1'), st.get('y2')]))
        K[name] = tot; err[name] = e + 1e-8*absum   # 1e-8: Hecke data accuracy (two-height defect 2e-9) with margin
        info[name] = dict(d=d, classes=len(L), K=tot, err=err[name], sum_abs=absum, rows=rows, seconds=time.time()-t0)
        print(p, q, name, "d=%d classes=%d K=%.12e err=%.2e sum|F|/|O|=%.4e (%.0fs)" % (d, len(L), tot, err[name], absum, time.time()-t0), flush=True)
    D = K['1']*K['pq'] - K['p']*K['q']
    De = abs(K['1'])*err['pq'] + abs(K['pq'])*err['1'] + abs(K['p'])*err['q'] + abs(K['q'])*err['p'] + err['1']*err['pq'] + err['p']*err['q']
    out.update(K=K, err=err, Delta=D, Delta_err=De, Delta_nonzero=bool(abs(D) > 10*De),
               K_nonzero={n: bool(abs(K[n]) > 10*err[n]) for n in K},
               rho=(K['1']*K['pq']/(K['p']*K['q']) - 1) if K['p']*K['q'] != 0 else None, info=info)
    print(json.dumps({k: out[k] for k in ('p', 'q', 'K', 'err', 'Delta', 'Delta_err', 'Delta_nonzero', 'K_nonzero', 'rho')}), flush=True)
    return out

def invariance_test(n=6, seed=1):
    rng = np.random.default_rng(seed); worst = 0.0; rows = []
    for t in range(n):
        B = rng.normal(size=(3, 3)); S = B@B.T + 0.5*np.eye(3)
        # reduce roughly: use as is, compare with U S U^T for a random unimodular U (product of elementary matrices)
        U = np.eye(3)
        for _ in range(4):
            i, j = rng.choice(3, 2, replace=False); El = np.eye(3); El[i, j] = rng.integers(-1, 2); U = El@U
        S2 = U@S@U.T
        vals = []
        for SS in (S, S2):
            best = max(itertools.permutations(range(3)), key=lambda pm: min(gl3.coords(SS[np.ix_(pm, pm)])[3:]))
            ys = gl3.coords(SS[np.ix_(best, best)])[3:]
            if min(ys) < 0.25: vals.append(None); continue
            vals.append(gl3.phi(SS[np.ix_(best, best)], 30.0))
        if None in vals: continue
        rows.append((vals[0], vals[1])); worst = max(worst, abs(vals[0]-vals[1]))
    return worst, rows

if __name__ == "__main__":
    quads = [tuple(map(int, a.split(','))) for a in sys.argv[2].split(';')]
    E = float(sys.argv[3]) if len(sys.argv) > 3 else 30.0
    gl3.ktab()
    w, rows = invariance_test()
    print("invariance under random unimodular U: max |F(S)-F(USU^T)| =", w, rows, flush=True)
    from multiprocessing import Pool
    nw = int(os.environ.get('RH_WORKERS', '2'))
    with Pool(min(nw, len(quads))) as P:
        outs = P.starmap(run_quad, [(p, q, E) for p, q in quads])
    json.dump(dict(invariance_defect=w, invariance_rows=rows, quads=outs, R=gl3.R), open(sys.argv[1], 'w'), indent=1)
