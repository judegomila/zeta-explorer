"""realaxis.py: two statistics that need Z only near the real axis (sel.py transfer operator; MEASURED, float64 determinant).
(B) one-node Hankel/Pick condition: R_a(x) = X(x-a)/X(x+a), X(w) = Z(1/2+w, chi) exp(-Phi(w)) c^{-w}, Phi(w) = pi int_0^w v tan(pi v) dv,
    c = prod 2 sin(pi alpha_j) (X is even by the functional equation). A Schur function has |R_a(x)| <= 1 at every real x > 0;
    the Hankel operator with symbol R_a has norm > 1 on every window as soon as this fails at one node.
(C) Jensen count on the disc |s - 3/2| < 0.95 (reaches Re s = 0.55): (1/2pi) int log|Z| dtheta - log|Z(3/2)| = sum over zeros in the disc of log(0.95/|z - 3/2|).
usage: realaxis.py out.json"""
import sys, json, math, os, warnings
warnings.simplefilter('ignore')
import numpy as np
from scipy.integrate import quad
import sel
CH = [(0.005, 0.01), (0.01, 0.02), (0.02, 0.03), (0.03, 0.05), (0.05, 0.12), (0.10, 0.25), (0.25, 0.60), (1 / 3, 2 / 3)]
def logc(a, b): return sum(math.log(2 * math.sin(math.pi * (x % 1.0))) for x in (a, b, a - b))
def Phi(w): return math.pi * quad(lambda v: v * math.tan(math.pi * v), 0, w)[0]
def Xval(args):
    a, b, w = args
    z = sel.Ztw(0.5 + w, a, b, K=30, prec=800).real
    return z * math.exp(-Phi(w) - w * logc(a, b))
def circ(args):
    a, b, th = args
    s = 1.5 + 0.95 * complex(math.cos(th), math.sin(th))
    z = sel.Zmod(s, K=40, prec=800) if a is None else sel.Ztw(s, a, b, K=30, prec=800)
    return math.log(abs(z))
if __name__ == '__main__':
    import multiprocessing as mp
    pool = mp.Pool(int(os.environ.get('RH_WORKERS', '1')))
    ws = [round(-0.46 + 0.02 * i, 4) for i in range(47)]      # w in [-0.46, 0.46]
    out = dict(hankel={}, jensen={})
    for a, b in CH:
        X = pool.map(Xval, [(a, b, w) for w in ws], chunksize=2)
        Xd = dict(zip(ws, X))
        ev = max(abs(Xd[w] - Xd[-w]) / (abs(Xd[w]) + 1e-300) for w in ws if w > 0)
        rec = dict(w=ws, X=X, evenness_defect=ev, shifts={})
        for sh in (0.02, 0.06, 0.1, 0.2):
            rows = []
            for x in ws:
                lo, hi = round(x - sh, 4), round(x + sh, 4)
                if x > 0 and lo in Xd and hi in Xd: rows.append((x, Xd[lo] / Xd[hi]))
            bad = [(x, r) for x, r in rows if abs(r) > 1 + 1e-9]
            rec['shifts'][str(sh)] = dict(max_abs=max(abs(r) for x, r in rows), n_nodes=len(rows), first_bad=bad[0] if bad else None, n_bad=len(bad))
        out['hankel'][f'{a:.4g}_{b:.4g}'] = rec
        print('chi', a, b, 'evenness defect', ev, {k: (v['max_abs'], v['first_bad']) for k, v in rec['shifts'].items()}, flush=True)
    M = 96; ths = [2 * math.pi * (k + 0.5) / M for k in range(M)]
    for a, b in [(None, None)] + CH:
        vals = pool.map(circ, [(a, b, th) for th in ths], chunksize=2)
        half = sum(vals[::2]) / (M // 2); full = sum(vals) / M
        z0 = sel.Zmod(1.5, K=40, prec=800) if a is None else sel.Ztw(1.5, a, b, K=30, prec=800)
        J = full - math.log(abs(z0)); Jh = half - math.log(abs(z0))
        name = 'PSL2Z' if a is None else f'{a:.4g}_{b:.4g}'
        out['jensen'][name] = dict(J=J, J_half_grid=Jh, implied_zero=1.5 - 0.95 * math.exp(-J))
        print('Jensen', name, 'J =', J, '(48-point value', Jh, ') implied single real zero at', 1.5 - 0.95 * math.exp(-J), flush=True)
    json.dump(out, open(sys.argv[1], 'w'))
