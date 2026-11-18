"""Joint feasibility LP (window model).
Unknown: nonnegative measure of zeros in the window (relaxation of integer atoms) + one quartet (1/2 +- delta, +-(t0+tq)).
Constraints:
 (0)  Riemann-von Mangoldt count in the window: |mass - expected| <= cslack           [consequence of (i)]
 (ii) explicit formula against J tests of bandwidth L (prime side uses Lambda(n), n <= e^L only)
 (iv) atoms restricted to |Re rho - 1/2| <= sigmax   (sigmax = 0: all other zeros on the line; 3/8; 1/2)
Elastic form: minimise s >= 0 with all (ii) rows relaxed by s.  s* > 0  <=>  infeasible, dual = certificate."""
import numpy as np
from scipy.optimize import linprog
from lib import Bhat

def kern(tj, t, sig, L, m):
    """contribution to test centred tj of zeros at height t, offsets +-sig (sig=0: one on-line zero)"""
    if sig == 0: return Bhat(t[None, :] - tj[:, None], L, m).real
    return 2*Bhat(t[None, :] - tj[:, None] + 1j*sig, L, m).real

def build(L, m, b, tj, Wm, dens, sigmas, dg=0.02):
    t = np.arange(-Wm, Wm + dg/2, dg)
    A = np.hstack([kern(tj, t, s, L, m) for s in sigmas])
    mass = np.concatenate([np.full(len(t), 1.0 if s == 0 else 2.0) for s in sigmas])
    return dict(L=L, m=m, b=b, tj=tj, Wm=Wm, dens=dens, sigmas=sigmas, t=t, A=A, mass=mass)

def solve(M, delta, tq, cslack=7.0, tail=None, eta=1e-5):
    L, m, b, tj, A, mass = M['L'], M['m'], M['b'], M['tj'], M['A'], M['mass']
    a = L/(2*m); marg = M['Wm'] - np.abs(tj).max()
    if tail is None: tail = 3*M['dens']*marg**(1-2*m)/(a**(2*m)*(2*m-1))
    smax = max(M['sigmas']); tailup = 0.0 if smax == 0 else tail*np.cosh(a*smax)**(2*m)
    taillo = tail if smax == 0 else tailup
    tailup += eta; taillo += eta          # eta: allowance for the explicit-formula evaluation error (measured <= 3e-7)
    Q = np.zeros(len(tj)) if delta is None else 2*Bhat(tq - tj + 1j*delta, L, m).real
    qm = 0.0 if delta is None else 2.0
    E = 2*M['Wm']*M['dens']; J, n = A.shape
    Aub = np.vstack([np.hstack([A, -np.ones((J, 1))]), np.hstack([-A, -np.ones((J, 1))]),
                     np.hstack([mass[None, :], [[0.0]]]), np.hstack([-mass[None, :], [[0.0]]])])
    bub = np.concatenate([b + tailup - Q, -(b - taillo - Q), [E + cslack - qm], [-(E - cslack - qm)]])
    c = np.zeros(n+1); c[-1] = 1
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=[(0, None)]*(n+1), method='highs')
    if r.status != 0: raise RuntimeError(f'LP solver status {r.status}')
    mu = -r.ineqlin.marginals; u, v, cp, cm = mu[:J], mu[J:2*J], mu[2*J], mu[2*J+1]
    return dict(status=0, s=r.x[-1], w=r.x[:-1], y=u-v, u=u, v=v, kappa=cp-cm, Q=Q,
                bound=float(u@(b+tailup) - v@(b-taillo) + cp*(E+cslack) - cm*(E-cslack)),
                Gq=float((u-v)@Q + (cp-cm)*qm))

def cert_min(M, sol, sig_fine=None, dg=0.002):
    """min over a fine grid of the dual function G on the allowed region (must be >= 0)."""
    t = np.arange(-M['Wm'], M['Wm'], dg); smax = max(M['sigmas'])
    sigs = [0.0] if smax == 0 else list(np.linspace(0, smax, 25))
    g = np.inf
    for s in sigs:
        G = sol['y'] @ kern(M['tj'], t, s, M['L'], M['m']) + sol['kappa']*(1.0 if s == 0 else 2.0)
        g = min(g, G.min())
    return g

def threshold(M, tq, lo=0.0, hi=None, tol=1e-9, iters=22):
    """smallest delta (bisection) at which the LP is infeasible; None if feasible up to hi"""
    hi = hi if hi is not None else 0.5
    if solve(M, hi, tq)['s'] <= tol: return None
    if solve(M, max(lo, 1e-4), tq)['s'] > tol: return max(lo, 1e-4)
    for _ in range(iters):
        mid = (lo+hi)/2
        if solve(M, mid, tq)['s'] > tol: hi = mid
        else: lo = mid
    return hi

def min_offline(M, delta, tq, cslack=7.0, eta=1e-5):
    """least total mass (number of zeros, relaxed) of OTHER off-line zeros needed for feasibility; None if infeasible"""
    L, m, b, tj, A, mass = M['L'], M['m'], M['b'], M['tj'], M['A'], M['mass']
    a = L/(2*m); marg = M['Wm'] - np.abs(tj).max(); smax = max(M['sigmas'])
    tail = 3*M['dens']*marg**(1-2*m)/(a**(2*m)*(2*m-1))*np.cosh(a*smax)**(2*m) + eta
    Q = 2*Bhat(tq - tj + 1j*delta, L, m).real; E = 2*M['Wm']*M['dens']
    Aub = np.vstack([A, -A, mass[None, :], -mass[None, :]])
    bub = np.concatenate([b + tail - Q, -(b - tail - Q), [E + cslack - 2], [-(E - cslack - 2)]])
    c = np.where(mass > 1.5, 2.0, 0.0)
    r = linprog(c, A_ub=Aub, b_ub=bub, bounds=[(0, None)]*A.shape[1], method='highs')
    return None if r.status != 0 else float(r.fun)
