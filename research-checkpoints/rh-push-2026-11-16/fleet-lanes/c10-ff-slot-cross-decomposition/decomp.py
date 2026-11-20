"""decomp.py : POST-HOC exact decomposition of the completed N = 3 row energy, E = E_0 + E_1 + cross, in units of the diagonal X D:
E_0 = sum_m |S_3(m)|^2 (squarefree part), E_1 = q sum_m V(m)^2 |S_0(m)|^2 (cube part: n linear, cofactor A' = 1), cross = 2 Re sum_m conj(S_3) Jbar V S_0.
Also e_U = energy / diagonal of the companion row S_0 (N = 0: the marked row with trivial cofactor, sum_P g_3(1,P) chi_P(m)) and mean of V^2."""
from fractions import Fraction as Fr
from plan import *
import analyze
from ffpy import FF, norm
L = ['q (N,lam,d) vector | e completed | E_0/XD | E_1/XD | cross/XD | e_U of the companion row (N=0) | mean V(m)^2']
for fam, (q, N, d, lams) in FAM.items():
    if N != 3: continue
    F = FF(q); Wq = weights(q); names = list(Wq)
    for lam in lams:
        W = analyze.load(q, N, lam, d); W0 = analyze.load(q, 0, lam, d)
        if W is None or W0 is None: continue
        for i, name in enumerate(names):
            if name in ('al', 'r1'): continue
            sn, dg = analyze.completed(q, lam, d, name, W[i], W0, F); V = analyze.completed.V; S0 = analyze.completed.S0
            E0 = W[i]['sumnorm']; E1 = q * sum(V[mi]**2 * norm(S0[mi]) for mi in range(q**d)); cr = sn - E0 - E1
            eU = W0[0]['sumnorm'] / W0[0]['diag']
            L.append(f"{q} ({N},{lam},{d}) {name} | {sn/dg:.4g} | {E0/dg:.4g} | {E1/dg:.4g} | {cr/dg:.4g} | {eU:.4g} | {sum(v*v for v in V)/len(V):.4g}")
open('decomp.txt', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))
