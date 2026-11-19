"""check_brute.py <d> <N> <lam> : rows from the DEFINITION (pure python: sum over primes P and squarefree cofactors A' of zeta_6^(g(P A')) u(A') chi_{P A'}(m))
against the rows assembled from the Y table, for vectors with complex phases (ru), multiplicative signs (cm), a target and mu.  Server (numpy for ylib)."""
import sys, os
import numpy as np
from ylib import *
from vecs import uphase
d, N, lam = (int(x) for x in sys.argv[1:4]); D = os.path.dirname(os.path.abspath(__file__)); y = Y(f'{D}/results/y_q7_N{N}_lam{lam}_d{d}')
ms = [F.idx2poly(i, d) for i in range(q**d)]; As = [F.idx2poly(i, N) for i in range(q**N)]
Ps = [P for P in (F.idx2poly(i, lam) for i in range(q**lam)) if F.irreducible(P)]; assert len(Ps) == y.np
ok = True
for name in ('ru1', 'ru2', 'cm3', 'a', 'mu'):
    u = uphase(name, N, N); rows = [[0]*6 for _ in ms]
    for P in Ps:
        for ai, A in enumerate(As):
            if u[ai] == 100: continue
            c = F.pmul(P, A); g = F.gphase(c, 2)
            if g is None: continue
            for mi, m in enumerate(ms):
                x = F.chi(c, m)
                if x is not None: rows[mi][(g + u[ai] + x) % 6] += 1
    br = [(h[0] - h[2] - h[3] + h[5], h[1] + h[2] - h[4] - h[5]) for h in rows]
    mine = y.rows(np.array(u, dtype=np.uint8))[0][0]; same = br == mine; ok = ok and same
    print(f"{'OK  ' if same else 'DIFF'} {name} at (N, lam, d) = ({N}, {lam}, {d}): {len(ms)} rows from the definition {'identical' if same else 'different'}; sum of norms {sum(norm(r) for r in br)}")
print('BRUTE', 'PASS' if ok else 'FAIL')
