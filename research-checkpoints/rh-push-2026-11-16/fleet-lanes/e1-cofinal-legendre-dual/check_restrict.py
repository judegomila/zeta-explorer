"""Lemma 1 check: the optimum at 2x, restricted to J_x with u' = (u + v log 2)/2, v' = v/2, is feasible at x."""
import sys, math, numpy as np
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-cofinal-legendre-dual')
import lplib
D = 'tmp/research-2026-11-16/push/e1-cofinal-legendre-dual/out/'
for x in (10000, 160000, 1280000):
    for q in (2, 4):
        try: d = np.load(D + f'opt_{q*x}.npz')
        except Exception: continue
        J2, G2, u, v = d['J'], d['G'], float(d['u']), float(d['v'])
        P = lplib.Problem(x)
        idx = np.searchsorted(J2, P.J); assert np.all(J2[idx] == P.J)
        G = G2[idx]; u1 = (u + v * math.log(q)) / q; v1 = v / q
        maxabs, viol, _, _ = P.residuals(G, u1, v1)
        own = float(np.load(D + f'opt_{x}.npz')['value'])
        print(f"x={x} from X={q*x}: max_k|e_k| at x = {maxabs:.9f}, violations {len(viol)}, restricted objective G(x)-v' = {G[-1]-v1:.3f} "
              f"= {(G[-1]-v1)/math.sqrt(x):+.4f} sqrt(x); nu_1(x) = {own:.3f} = {own/math.sqrt(x):+.4f} sqrt(x)")
