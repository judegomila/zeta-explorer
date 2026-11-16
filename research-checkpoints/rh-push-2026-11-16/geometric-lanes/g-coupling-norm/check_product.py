# Interval check of the Schur-Blaschke factorization  1 - rho(X;y)^2 = prod_k b_k^2 (1-phi_k^2)/(1-b_k^2 phi_k^2)
import json
from flint import arb, ctx
from lib import *
ctx.prec = 1500
out = {}
for func, Lf in (('xi', L_xi), ('dh', L_dh)):
    for fam, N in (('B', 6), ('C', 6), ('A', 5)):
        xs = nodes(fam, N+1); X, y = xs[:N], xs[N]
        LX = [Lf(x) for x in X]; Ly = Lf(y)
        A, _ = pick_normalized(xs, LX+[Ly])
        piv = ldl_pivots(A)[N]
        # Richards recursion on the values at the remaining nodes and at y
        vals = LX + [Ly]; pts = X + [y]
        prod = arb(1); phis = []
        for k in range(N):
            xk, lk = pts[k], vals[k]
            b = (y-xk)/(y+xk)
            phi = ((vals[-1]-lk)/(vals[-1]+lk))/b
            phis.append(phi.str(8))
            prod *= b*b*(1-phi*phi)/(1-b*b*phi*phi)
            new = list(vals)
            for i in range(k+1, N+1):
                z, lz = pts[i], vals[i]
                new[i] = lk*(z*lz - xk*lk)/(z*lk - xk*lz)
            vals = new
        out[f'{func}_{fam}_{N}'] = dict(pivot=piv.str(12), product=prod.str(12), overlap=bool(piv.overlaps(prod)), phis=phis)
print(json.dumps(out, indent=1)); json.dump(out, open('check_product.json', 'w'), indent=1)
