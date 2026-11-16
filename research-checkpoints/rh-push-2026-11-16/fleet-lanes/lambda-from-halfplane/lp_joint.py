# Joint signed probe LP at t=0.  Certified-form objective:
#   2*sum'_{other pairs} K_y >= sum_i w_i (S(x*+x_i,h_i) - own_i)      [kernel domination, checked on a grid here]
#   sum_i w_i S(x*+x_i,h_i) >= L*w(1) - (1/2) sum_n Lambda(n) |what(n)|,   what(n) = sum_i w_i n^{-sigma_i} cos((x_i/2) log n)
# (symmetric probe pairs).  n <= N exact absolute value, n > N by the triangle inequality.
import numpy as np, mpmath as mp, sys, time
from scipy.optimize import linprog
from scipy.sparse import csr_matrix, vstack, hstack, eye
mp.mp.dps = 25
X = 6000000185827
L = float(mp.log(mp.mpf(X)/(4*mp.pi))/4)
def K(h, d, b): return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)
def vonmangoldt(N):
    out = []
    for n in range(2, N+1):
        m = n; p = None
        for q in range(2, int(n**0.5)+1):
            if m % q == 0: p = q; break
        if p is None: out.append((n, np.log(n))); continue
        while m % p == 0: m //= p
        if m == 1: out.append((n, np.log(p)))
    return out
def solve(y, hs, xs, signed, N=400, verbose=False):
    probes = [(h, x) for h in hs for x in xs]; n = len(probes)
    hh = np.array([p[0] for p in probes]); xx = np.array([p[1] for p in probes]); sig = (1+hh)/2
    ds = np.concatenate([np.linspace(0, 10, 321), np.geomspace(10.05, 300, 70)]); bs = np.linspace(0, y, 11)
    D, B = np.meshgrid(ds, bs, indexing='ij'); D = D.ravel(); B = B.ravel()
    m = ~((D < 1e-9) & (np.abs(B-y) < 1e-12)); D = D[m]; B = B[m]
    cols = np.array([0.5*(K(h, D-x, B)+K(h, D+x, B)) for h, x in probes]).T
    lhs = 2*K(y, D, B); own = K(hh, xx, y)
    vm = vonmangoldt(N); nn = np.array([v[0] for v in vm], float); lam = np.array([v[1] for v in vm])
    F = nn[:, None]**(-sig[None, :])*np.cos(0.5*xx[None, :]*np.log(nn)[:, None])      # what(n) = F @ w
    Afull = np.array([float(-mp.zeta(s, derivative=1)/mp.zeta(s)) for s in sig])
    tail = Afull - (lam[:, None]*nn[:, None]**(-sig[None, :])).sum(0)
    M = len(vm)
    # variables: alpha (n), gamma (n), t (M)
    if signed:
        c = -np.concatenate([(L-own) - 0.5*tail, -(L-own) - 0.5*tail, -0.5*lam])
        A1 = np.hstack([cols, -cols, np.zeros((len(D), M))])
        A2 = np.hstack([F, -F, -np.eye(M)]); A3 = np.hstack([-F, F, -np.eye(M)])
        far = np.concatenate([hh, -hh, np.zeros(M)])[None, :]; pos = np.concatenate([-np.ones(n), np.ones(n), np.zeros(M)])[None, :]
        Aub = np.vstack([A1, A2, A3, far, pos]); bub = np.concatenate([lhs, np.zeros(2*M), [2*y, 0]])
    else:
        c = -np.concatenate([(L-own) - 0.5*tail, -0.5*lam])
        A1 = np.hstack([cols, np.zeros((len(D), M))]); A2 = np.hstack([F, -np.eye(M)]); A3 = np.hstack([-F, -np.eye(M)])
        far = np.concatenate([hh, np.zeros(M)])[None, :]
        Aub = np.vstack([A1, A2, A3, far]); bub = np.concatenate([lhs, np.zeros(2*M), [2*y]])
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=(0, None), method='highs')
    sol = r.x; w = sol[:n] - (sol[n:2*n] if signed else 0)
    if verbose:
        for k in np.argsort(-np.abs(w))[:12]:
            if abs(w[k]) > 1e-5: print('     h=%.3f x=%.3f w=%+.4f' % (hh[k], xx[k], w[k]))
    return -r.fun, w, probes
if __name__ == '__main__':
    ys = [float(a) for a in sys.argv[1:]] or [0.75]
    hs = np.array([1.1, 1.25, 1.4, 1.55, 1.7, 1.88, 2.05, 2.25, 2.5, 2.8, 3.2, 3.8, 4.8, 6.5, 9.0])
    xs = np.linspace(0, 6, 17)
    print('L=%.5f ideal OBJ=2L=%.4f' % (L, 2*L))
    for y in ys:
        for signed in (False, True):
            t0 = time.time(); o, w, pr = solve(y, hs, xs, signed, verbose=True)
            print('y=%.3f signed=%s OBJ=%.4f  rate c=2*OBJ/y=%.3f   (%.0fs)' % (y, signed, o, 2*o/y, time.time()-t0), flush=True)
