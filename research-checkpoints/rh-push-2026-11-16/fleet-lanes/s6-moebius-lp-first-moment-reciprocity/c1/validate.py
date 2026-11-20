import numpy as np, math, json
from objects import *
# validation: identity sum_n Lambda_w(n) f_w(nd/X) = tau(d), Lambda vs Dirichlet inversion, equality at c = w^{-1}
for name, kw in [('zeta', {}), ('chi4', {}), ('chi5', {}), ('Ea', dict(a=0.02)), ('TNR', dict(q=101, c=2.2)), ('liouville', {}), ('randsign', {}), ('unimod', dict(alpha=1.0)), ('DH', {})]:
    for k in (0, 1, 2):
        X = 3000 if name != 'TNR' else 30000
        o = make(name, X, k, **kw); s = Sys(X, k, w=o['w'], u=o['u'])
        lam = o['lam']; err = 0
        for d in (1, 2, 3, 7, 50, 300):
            n = np.arange(1, X // d + 1); lhs = np.sum(lam[n] * s.entry(n, d)); err = max(err, abs(lhs - s.obj(d)) / max(1, abs(s.obj(d))))
        lam2, inv = lambda_from_w(o['w'], X)
        e2 = np.abs(lam2 - lam).max()
        phi = phi_all(s, inv[1:], X); e3 = np.abs(phi[2:] - s.rhs(np.arange(2, X + 1.0))).max()
        V = np.sum(inv[1:] * s.obj(np.arange(1, X + 1))); tr = truth(lam, X, k)
        sg = (np.real(lam * np.conj(o['u'])) < -1e-9).sum()
        print(f"{name:9s} k={k} identity {err:.1e}  Lambda vs inversion {e2:.1e}  phi_mu - r {e3:.1e}  V(mu)-truth {abs(V-tr):.1e}  sign violations of u {sg}")
