"""General cluster model F = zeta*(p+q)/p with q = e^{s0} (c1 + c2 (t - t0)); helpers. See model.py for coordinates."""
import numpy as np, math
from scipy.optimize import minimize_scalar
PREQ = 4.3743

def logp(g, t):
    t = np.atleast_1d(t).astype(complex)
    return np.sum(np.log(t[:, None] - g[None, :]), axis=1)

def gap_extrema(g):
    """critical points of p between consecutive zeros: returns (t_i, log|p(t_i)|, sign)"""
    out = []
    for i in range(len(g) - 1):
        lo, hi = g[i], g[i + 1]; w = hi - lo
        r = minimize_scalar(lambda t: -np.sum(np.log(np.abs(t - g))), bounds=(lo + 1e-9 * w, hi - 1e-9 * w), method='bounded', options=dict(xatol=1e-12))
        sgn = (-1) ** (len(g) - 1 - i)
        out.append((r.x, -r.fun, sgn))
    return out

def build(g, t0, delta, eta=0.0):
    """delta > 0: pair-lift with (p+q)(t0 + i delta) = 0.  delta == 0: constant lift q = -(1+eta) p(t0)."""
    if delta > 0:
        lp = logp(g, t0 + 1j * delta)[0]; s0 = lp.real; ph = np.exp(1j * lp.imag)
        return dict(g=g, t0=t0, s0=s0, c1=-ph.real, c2=-ph.imag / delta)
    lp = logp(g, t0 + 0j)[0]; sgn = math.cos(lp.imag)
    return dict(g=g, t0=t0, s0=lp.real, c1=-(1 + eta) * np.sign(sgn), c2=0.0)

def ratio(m, t):
    t = np.atleast_1d(t).astype(complex)
    return (m['c1'] + m['c2'] * (t - m['t0'])) * np.exp(m['s0'] - logp(m['g'], t))

def new_roots(m):
    g = m['g']; k = len(g)
    diff = g[:, None] - g[None, :]; np.fill_diagonal(diff, 1.0)
    lpp = np.sum(np.log(np.abs(diff)), axis=1); sg = np.prod(np.sign(diff), axis=1)
    r = (m['c1'] + m['c2'] * (g - m['t0'])) * np.exp(m['s0'] - lpp) * sg
    w = np.linalg.eigvals(np.diag(g).astype(float) - np.outer(np.ones(k), r)).astype(complex)
    for _ in range(40):
        d = w[:, None] - g[None, :]
        ok = np.min(np.abs(d), axis=1) > 1e-13
        d[~ok] = 1.0
        f = 1 + np.sum(r[None, :] / d, axis=1); fp = -np.sum(r[None, :] / d ** 2, axis=1)
        step = f / fp
        step = np.where(ok & np.isfinite(step) & (np.abs(step) < 0.05), step, 0)
        w = w - step
        if np.max(np.abs(step)) < 1e-13: break
    d = w[:, None] - g[None, :]; ok = np.min(np.abs(d), axis=1) > 1e-13; d[~ok] = 1.0
    res = np.abs(1 + np.sum(r[None, :] / d, axis=1))[ok]
    w = np.where(np.abs(w.imag) < 1e-10, w.real, w)
    return w, r, (res.max() if len(res) else 0.0)

def pulls(w, outside_real, dens_x, edge_x, tol=1e-9):
    real = np.concatenate([w[np.abs(w.imag) < tol].real, outside_real])
    nr = w[np.abs(w.imag) >= tol]
    out = []
    for z in nr[nr.imag > 0]:
        x = 2 * z.real; y = 2 * z.imag
        D = x - 2 * real
        P = np.sum(2 * y / (D ** 2 + y ** 2)) + 2 * (2 * y) * dens_x / edge_x
        oth = nr[(np.abs(nr - z) > 1e-9) & (np.abs(nr - np.conj(z)) > 1e-9)]   # the conjugate partner is not part of M_t
        Dn = x - 2 * oth.real; yn = 2 * np.abs(oth.imag)
        top = bool(np.all(yn[np.abs(Dn) <= 2] <= y + 1e-12))
        near = np.abs(Dn) < 2
        M = P + np.sum(2 * y / (Dn[near] ** 2 + 4 * y ** 2)) + np.sum(2 * y / Dn[~near] ** 2)
        out.append((z.real, y, top, P, M))
    return out
