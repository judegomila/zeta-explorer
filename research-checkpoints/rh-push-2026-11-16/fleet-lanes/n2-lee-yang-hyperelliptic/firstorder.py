"""First-order motion of the nontrivial roots at z=(-1,...,-1).
u_j(z) root of N; du_j/dz_i = -(dN/dz_i)/(dN/du).  rho_ij = (du_j/dz_i)/u_j  (log-derivative).
Polydisc stability at first order needs rho_ij real >= 0 (all directions Re dz_i >= 0 push outward);
real-cube stability at first order needs Re rho_ij >= 0.
usage: firstorder.py q n maxsets"""
import sys, json, itertools, numpy as np
from lylib import *
q, n, maxsets = map(int, sys.argv[1:4])
chi = chi_table(q); vals = value_tables(q, n-1)
subs = [s for s in itertools.combinations(range(q), n) if s[0]==0 and s[1]==1][:maxsets]
dbl = 0; tot = 0; neg_re = 0; nonreal = 0; rows = []
for es in subs:
    cnt = counts(q, list(es), vals, chi)
    def co(z): return np.array([complex(c) for c in Ncoeffs(q, n, cnt, list(z), one=1+0j)])
    c0 = co(-np.ones(n)); r = np.roots(c0[::-1]); r = r[abs(abs(r)*q**.5-1) < 1e-6]
    assert len(r) == n-1
    dNu = np.polyval(np.polyder(c0[::-1]), r)
    for i in range(n):
        e = np.zeros(n); e[i] = 1
        dc = co(-np.ones(n)+e) - c0            # exact: N is affine in z_i
        rho = -np.polyval(dc[::-1], r)/dNu/r
        for j, x in enumerate(rho):
            if abs(dNu[j]) < 1e-5: dbl += 1; continue
            tot += 1; neg_re += x.real < -1e-9; nonreal += abs(x.imag) > 1e-9
            rows.append((es, i, complex(r[j]), complex(x)))
worst = min(rows, key=lambda t: t[3].real)
print("double-root pairs skipped:", dbl, "| sorted distinct Re rho:", sorted(set(round(t[3].real,6) for t in rows))[:12]); print(f"q={q} n={n} sets={len(subs)} (root,i) pairs={tot}: Re rho<0 in {neg_re}; Im rho !=0 in {nonreal}; min Re rho={worst[3].real:.6f} at es={worst[0]} i={worst[1]} u0*sqrt(q)={worst[2]*q**.5:.5f} rho={worst[3]:.5f}")
