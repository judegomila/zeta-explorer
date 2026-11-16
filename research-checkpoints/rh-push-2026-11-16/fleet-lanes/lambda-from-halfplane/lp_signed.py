# Signed probe LP at t=0: maximise certified lower bound OBJ for 2*sum'_{other pairs} K_y(d_j,b_j)
# given two-sided trivial bounds on S(x,h,0) = (1/2) Re xi'/xi at sigma=(1+h)/2.
import numpy as np, mpmath as mp, sys
from scipy.optimize import linprog
mp.mp.dps = 30
X = 6000000185827
L = float(mp.log(mp.mpf(X)/(4*mp.pi))/4)       # main term (1/4) log(x/4pi) at x = X
def A(s): return float(-mp.zeta(s, derivative=1)/mp.zeta(s))
def K(h, d, b): return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)
def solve(y, hmin, signed=True, hmax=8.0, nh=28, nx=25, xmax=6.0, verbose=False):
    hs = np.unique(np.concatenate([np.linspace(hmin, min(hmin+1.5,hmax), 16), np.geomspace(hmin, hmax, nh)]))
    xs = np.linspace(0, xmax, nx)
    probes = [(h, x) for h in hs for x in xs]
    lo = {h: L - A((1+h)/2)/2 for h in hs}
    up = {h: L + (A((1+h)/2) - 2*A(1+h))/2 for h in hs}
    # constraint grid
    ds = np.concatenate([np.linspace(0, 12, 481), np.geomspace(12.05, 400, 120)])
    bs = np.linspace(0, y, 16)
    D, B = np.meshgrid(ds, bs, indexing='ij'); D = D.ravel(); B = B.ravel()
    mask = ~((D < 1e-9) & (np.abs(B - y) < 1e-12)); D = D[mask]; B = B[mask]
    def col(h, x):   # symmetric probe pair at +-x, average
        return 0.5*(K(h, D-x, B) + K(h, D+x, B))
    cols = np.array([col(h, x) for h, x in probes]).T
    lhs = 2*K(y, D, B)
    own = np.array([K(h, x, y) for h, x in probes])
    gainA = np.array([lo[h] for h, x in probes]) - own
    costG = np.array([up[h] for h, x in probes]) - own
    n = len(probes)
    if signed:
        c = -np.concatenate([gainA, -costG])
        Aub = np.hstack([cols, -cols]); bub = lhs
        # far field: sum a h - sum g h <= 2y ; and sum a - sum g >= 0
        hh = np.array([h for h, x in probes])
        Aub = np.vstack([Aub, np.concatenate([hh, -hh]), np.concatenate([-np.ones(n), np.ones(n)])]); bub = np.concatenate([bub, [2*y, 0]])
    else:
        c = -gainA; hh = np.array([h for h, x in probes])
        Aub = np.vstack([cols, hh]); bub = np.concatenate([lhs, [2*y]])
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=(0, None), method='highs')
    obj = -r.fun
    if verbose:
        sol = r.x
        for k in np.argsort(-sol)[:14]:
            if sol[k] > 1e-6:
                kk = k % n; print('   ', 'alpha' if k < n else 'gamma', 'h=%.3f x=%.3f w=%.4f' % (probes[kk][0], probes[kk][1], sol[k]))
    return obj, r, probes
if __name__ == '__main__':
    y = float(sys.argv[1]) if len(sys.argv) > 1 else 0.75
    print('L =', L, ' ideal 2*pi*D =', 2*L)
    for hmin in [1.3, 1.5, 1.7, 1.88, 2.18]:
        o1, _, _ = solve(y, hmin, signed=False)
        o2, _, _ = solve(y, hmin, signed=True, verbose=(hmin in (1.5, 1.88)))
        print('y=%.3f hmin=%.2f  positive-only OBJ=%.4f (rate c=%.3f)   signed OBJ=%.4f (rate c=%.3f)' % (y, hmin, o1, 2*o1/y, o2, 2*o2/y), flush=True)
