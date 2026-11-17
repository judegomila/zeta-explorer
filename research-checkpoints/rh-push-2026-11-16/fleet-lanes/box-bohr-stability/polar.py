"""Multi-affine symmetrisation (Grace-Walsh-Szego polarisation) followed by the polydisc stability test.
Each variable w_p of degree d_p is replaced by d_p variables; w_p^k -> e_k(w_p1..w_pd)/C(d,k).
GWS: for a polynomial of exact degree d in a variable, zero-freeness on a closed disc is preserved in both
directions, so the polarised polynomial is stable on the closed unit polydisc iff the original is.
Float64 search (bl.s1_search), numpy; MEASURED check of that equivalence at small sizes."""
import math, itertools, json
import numpy as np
import bl

def polarise(poly):
    c, L, V, ps = poly
    deg = V.max(0).astype(int)
    newvars = [(p, i) for p, d in zip(ps, deg) for i in range(d)]
    idx = {v: j for j, v in enumerate(newvars)}
    c2, L2, V2 = [], [], []
    for cj, Lj, vj in zip(c, L, V):
        choices = []
        for p, d, k in zip(ps, deg, vj.astype(int)):
            choices.append([(s, 1.0 / math.comb(d, k)) for s in itertools.combinations(range(d), k)])
        for combo in itertools.product(*choices):
            v = np.zeros(len(newvars)); w = cj
            for p, (s, wt) in zip(ps, combo):
                w *= wt
                for i in s:
                    v[idx[(p, i)]] = 1
            c2.append(w); L2.append(Lj); V2.append(v)
    return np.array(c2), np.array(L2), np.array(V2), newvars

out = {}
for name, poly in (('euler zeta P=3 K=2', bl.euler_poly('zeta', 3, 2)), ('euler zeta P=5 K=3', bl.euler_poly('zeta', 5, 3)),
                   ('euler dh P=3 K=1', bl.euler_poly('dh', 3, 1)), ('euler dh P=3 K=2', bl.euler_poly('dh', 3, 2)), ('euler dh P=7 K=2', bl.euler_poly('dh', 7, 2)),
                   ('afe zeta N=2', bl.afe_poly('zeta', 2)), ('afe zeta N=4', bl.afe_poly('zeta', 4)), ('afe zeta N=9', bl.afe_poly('zeta', 9)),
                   ('afe dh N=4', bl.afe_poly('dh', 4)), ('afe dh N=9', bl.afe_poly('dh', 9)), ('afe tw2h N=4', bl.afe_poly('tw2h', 4))):
    a = bl.s1_search(poly, B=3000, iters=400, seed=1)
    pp = polarise(poly)
    b = bl.s1_search(pp, B=3000, iters=400, seed=1)
    out[name] = dict(orig_zero=a['n_zero_xge0'] > 0, orig_xsup=a['x_sup'], pol_vars=len(pp[3]), pol_terms=len(pp[0]), pol_zero=b['n_zero_xge0'] > 0, pol_xsup=b['x_sup'])
    print(name, out[name], flush=True)
json.dump(out, open('results/polar.json', 'w'), indent=1)
