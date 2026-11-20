# Theorem G check: closed formula for N(p_ij, p_kl) at the crossing points p_ij = (r_i, r_j) against direct polynomial evaluation, and
# inertia of the n^2 x n^2 Gram matrix against the inertia of H (exact), random real simple roots, n = 2..5.
import random, json
from lib import *
from explore4 import ghat
from explore2 import gram
rng = random.Random(8); tot = bad = ineq = 0
for n in (2, 3, 4, 5):
    for rep in range(8 if n < 5 else 4):
        r = [q(rng.randint(-50, 50), 7) + q(t+1, 1000+rep) for t in range(n)]
        try: Gh = ghat(r)
        except ZeroDivisionError: continue
        G, idx, D = gram(r)
        ok = all(G[a, c] == D(*idx[a])*D(*idx[c])*Gh[a, c] for a in range(n*n) for c in range(n*n))
        iG, iH = inertia(G), inertia(fitH(r)[0])
        tot += 1; bad += (not ok); ineq += (iG != iH)
        print('n', n, 'formula == direct', ok, 'rank', G.rank(), 'inertia Gram', iG, 'inertia H', iH, flush=True)
print('cases', tot, 'formula mismatches', bad, 'inertia mismatches', ineq)
json.dump(dict(cases=tot, formula_mismatches=bad, inertia_mismatches=ineq), open('theorem_g_check.json', 'w'))
