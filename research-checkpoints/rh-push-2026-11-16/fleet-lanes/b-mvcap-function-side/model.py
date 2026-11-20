"""Cluster pair-lift counter-model  F = zeta * (p + q)/p,  p = prod_{g in C}(t - g), q = l(t) linear with (p+q)(t0 + i delta) = 0.
Coordinates: t = ordinate offset from T0 (complex; zeta zero rho = 1/2 + i(T0 + t), so Re s = 1/2 + a  <=>  Im t = -a).
"""
import numpy as np, math

PREQ = 4.3743

def build(zeros, t0, h, delta):
    g = zeros[np.abs(zeros - t0) <= h]
    ts = t0 + 1j * delta
    lp = np.sum(np.log(ts - g))            # complex log p(t*)
    s0 = lp.real; ph = np.exp(1j * lp.imag)   # p(t*) = e^{s0} ph
    # l(t) = e^{s0} (c1 + c2 (t - t0)),  c1 + i c2 delta = -ph
    c1 = -ph.real; c2 = -ph.imag / delta
    return dict(g=g, t0=t0, delta=delta, s0=s0, c1=c1, c2=c2, h=h)

def ratio(m, t):
    """q(t)/p(t) for complex array t."""
    t = np.atleast_1d(t).astype(complex)
    lp = np.sum(np.log(t[:, None] - m['g'][None, :]), axis=1)
    return (m['c1'] + m['c2'] * (t - m['t0'])) * np.exp(m['s0'] - lp)

def E_line(m, a, span=4.0, n=4001):
    tau = np.linspace(-span * m['h'] - 10, span * m['h'] + 10, n)
    v = np.abs(ratio(m, m['t0'] + tau - 1j * a))
    i = int(np.argmax(v))
    return v[i], tau[i], v[n // 2]

def new_roots(m):
    g = m['g']; k = len(g)
    # residues r_j = q(g_j)/p'(g_j)
    diff = g[:, None] - g[None, :]
    np.fill_diagonal(diff, 1.0)
    lpp = np.sum(np.log(np.abs(diff)), axis=1); sg = np.prod(np.sign(diff), axis=1)
    r = (m['c1'] + m['c2'] * (g - m['t0'])) * np.exp(m['s0'] - lpp) * sg
    A = np.diag(g).astype(float) - np.outer(np.ones(k), r)
    w = np.linalg.eigvals(A)
    # Newton polish on f(x) = 1 + sum r_j/(x - g_j)
    for _ in range(30):
        d = w[:, None] - g[None, :]
        f = 1 + np.sum(r[None, :] / d, axis=1); fp = -np.sum(r[None, :] / d ** 2, axis=1)
        step = f / fp
        w = w - step
        if np.max(np.abs(step)) < 1e-13: break
    d = w[:, None] - g[None, :]
    res = np.abs(1 + np.sum(r[None, :] / d, axis=1))
    return w, r, res.max()

def pulls(w, outside_real, dens_x, edge_x, tol=1e-9):
    """For each nonreal new root in the upper half plane: (ordinate, y, topmost?, P, M0) in H_0 coordinates x = 2*ordinate, y = 2*Im."""
    real = np.concatenate([w[np.abs(w.imag) < tol].real, outside_real])
    nr = w[np.abs(w.imag) >= tol]
    out = []
    for z in nr[nr.imag > 0]:
        x = 2 * z.real; y = 2 * z.imag
        D = x - 2 * real
        P = np.sum(2 * y / (D ** 2 + y ** 2)) + 2 * (2 * y) * dens_x / edge_x     # far-field tail beyond the sampled block
        oth = nr[np.abs(nr - z) > 1e-9]
        Dn = x - 2 * oth.real; yn = 2 * np.abs(oth.imag)
        top = bool(np.all(yn[np.abs(Dn) <= 2] <= y + 1e-12))
        near = np.abs(Dn) < 2
        M = P + np.sum(2 * y / (Dn[near] ** 2 + 4 * y ** 2)) + np.sum(2 * y / Dn[~near] ** 2)
        out.append((z.real, y, top, P, M))
    return out
