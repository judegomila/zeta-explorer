"""s4-gabor-weil-inertia-proportion: shared code.

Object (m23 / Alpoge-Furman): box window on [-L/2, L/2], L = log X, nodes nu_a = nu0 + a*delta, delta = 2 pi/L,
  G = W / L^2,  W[a,b] = sum over all zeros rho (complex ordinate gamma_rho = (rho - 1/2)/i) of F_a(gamma_rho) F_b(gamma_rho),
  F_a(t) = 2 sin((t - nu_a) L/2)/(t - nu_a).
Zero side: G = sum_rho u_rho u_rho^T, u_rho(a) = sinc(pi (y_rho - a)), y = (gamma_rho - nu0) L / 2 pi; |u_rho| = 1 on the infinite grid.
Prime side (w3.py of the s3 lane, validated there to 1e-12): W = POLE + ARCH - PRIME with the prime sum over n <= X only.
Bandwidth lambda = L / log(q T / 2 pi): number of nodes = lambda * (number of zeros).
A window phi = box * p, p(s) = sum_j q_j e^{2 pi i j s} (s = u/L), gives G_phi = B G B^T, B[a, a+j] = q_j, and kernel
  u_rho . u_rho' = Phi_w(y - y'), Phi_w = Fourier transform of w = |p|^2 on [-1/2, 1/2].
"""
import math, sys, json, time, os
import numpy as np
import w3

PI = math.pi


# ------------------------------------------------------------------ families
def family(name, X, seed=0, a=0.0):
    if name == 'EA':   # zeta(s + a) zeta(s - a), a real: every zero off the line at depth a
        n, p, k = w3.prime_powers(X)
        lp = np.log(p.astype(np.float64)); nf = n.astype(np.float64)
        c = lp * (nf ** a + nf ** (-a))
        return dict(n=nf, c=c.astype(np.complex128), mu=[a, -a], logN=0.0, pole=False, poles=[0.5 + a, 0.5 - a])
    f = w3.family(name, X, seed)
    f['poles'] = [0.5] if f['pole'] else []
    f['pole'] = False
    return f


def density_log(fam, t):
    """log of the analytic conductor / (2 pi)^d at height t: mean zero density = this / (2 pi)"""
    d = len(fam['mu'])
    return fam['logN'] + d * math.log(t / (2 * PI))


def count_smooth(fam, t):
    """smooth zero count up to height t (main terms)"""
    d = len(fam['mu'])
    return (t / (2 * PI)) * (fam['logN'] + d * (math.log(t / (2 * PI)) - 1))


# ------------------------------------------------------------------ build
def build_G(fam, nu0, n, X, xp=np, block=2048, log=print):
    """float64 G = W / L^2, built by row blocks (no n x n temporaries beyond the result)."""
    L = math.log(X); delta = 2 * PI / L
    nu = nu0 + delta * np.arange(n)
    t0 = time.time()
    E, D = w3.dirichlet_sums(fam, nu, xp)
    J, Jdiag, Om = w3.arch_terms(fam, nu, L, nu0)
    log('  dirichlet sums %d nodes x %d terms: %.1fs' % (n, len(fam['n']), time.time() - t0))
    v = (L / (2 * PI)) * J + (L / PI) * E.imag
    diag = Jdiag - 2 * (L * E.real - D.real)
    Fp = [2 * np.sin((1j * b - nu) * L / 2) / (1j * b - nu) for b in fam['poles']]
    G = np.empty((n, n), dtype=np.float64)
    idx = np.arange(n)
    sg = 1.0 - 2.0 * (idx % 2)
    for i in range(0, n, block):
        j = min(n, i + block)
        dd = idx[i:j, None] - idx[None, :]
        np.place(dd, dd == 0, 1)
        blk = (v[i:j, None] - v[None, :]) / dd
        blk *= sg[i:j, None]; blk *= sg[None, :]
        for F in Fp:
            blk += 2 * (F[i:j, None] * F[None, :]).real
        G[i:j, :] = blk
    for F in Fp:
        diag = diag + 2 * (F * F).real
    G[idx, idx] = diag
    G /= L * L
    return G, dict(nu=nu, E=E, D=D, Om=Om, L=L, delta=delta)


def zero_side_G(y, n, block=4096):
    """G = sum_rho u u^T, u(a) = sinc(pi(y - a)); y complex array in node units (conjugation-closed for off-line zeros)."""
    y = np.asarray(y)
    cplx = np.iscomplexobj(y)
    G = np.zeros((n, n))
    a = np.arange(n)
    for i in range(0, len(y), block):
        z = y[i:i + block, None] - a[None, :]
        U = np.sinc(z) if not cplx else sinc_c(z)
        G += (U.T @ U).real
    return G


def sinc_c(z):
    z = np.asarray(z, dtype=np.complex128)
    out = np.ones_like(z)
    m = np.abs(z) > 1e-9
    out[m] = np.sin(PI * z[m]) / (PI * z[m])
    return out


# ------------------------------------------------------------------ windows
def mt_window(Jmax=4, grid=20001):
    """cosine expansion of sqrt(cos(sqrt2 s)) on [-1/2, 1/2]: p(s) = sum_{|j|<=J} q_|j| e^{2 pi i j s}; returns q (len J+1),
    C(w) for w = p^2 (closed form functional by quadrature) and C* for w* = cos(sqrt2 s)."""
    s = np.linspace(-0.5, 0.5, grid)
    f = np.sqrt(np.cos(math.sqrt(2) * s))
    q = [np.trapezoid(f, s)]
    for j in range(1, Jmax + 1):
        q.append(np.trapezoid(f * np.cos(2 * PI * j * s), s))
    q = np.array(q)
    p = q[0] + 2 * sum(q[j] * np.cos(2 * PI * j * s) for j in range(1, Jmax + 1))
    return q, C_of_w(p * p, s), C_of_w(np.cos(math.sqrt(2) * s), s)


def C_of_w(w, s):
    """C(w) = (int w^2 + int int |s - s'| w w') / (int w)^2 on a uniform grid (trapezoid)."""
    h = s[1] - s[0]
    tw = np.full(len(s), h); tw[0] = tw[-1] = h / 2
    I1 = float((w * tw).sum()); I2 = float((w * w * tw).sum())
    # int int |s - s'| w w' = 2 int w(s) [ s A(s) - B(s) ] ds, A = int_{-1/2}^s w, B = int_{-1/2}^s s' w
    A = np.concatenate([[0], np.cumsum(0.5 * (w[1:] + w[:-1]) * h)])
    Bm = np.concatenate([[0], np.cumsum(0.5 * (w[1:] * s[1:] + w[:-1] * s[:-1]) * h)])
    I3 = 2 * float((w * (s * A - Bm) * tw).sum())
    return (I2 + I3) / I1 ** 2


def window_stats(G, q, block=2048):
    """trace and squared Frobenius norm of B G B^T (B[a, a+j] = q_|j|, |j| <= J) without storing it; also Phi_w(0) = int w."""
    J = len(q) - 1; n = G.shape[0]; m = n - 2 * J
    coef = [(j, q[abs(j)]) for j in range(-J, J + 1)]
    tr = 0.0; fro = 0.0
    for i in range(0, m, block):
        e = min(m, i + block)
        A = np.zeros((e - i, n))
        for j, c in coef:
            A += c * G[i + J + j: e + J + j, :]
        Bk = np.zeros((e - i, m))
        for j, c in coef:
            Bk += c * A[:, J + j: J + j + m]
        fro += float((Bk * Bk).sum())
        tr += float(np.trace(Bk[:, i:e]))
    w0 = float(q[0] ** 2 + 2 * (q[1:] ** 2).sum())    # int_{-1/2}^{1/2} p^2
    return dict(dim=m, trace=tr, fro2=fro, w0=w0)


def apply_window(G, q):
    J = len(q) - 1; n = G.shape[0]; m = n - 2 * J
    A = np.zeros((m, n))
    for j in range(-J, J + 1):
        A += q[abs(j)] * G[J + j: J + j + m, :]
    Bk = np.zeros((m, m))
    for j in range(-J, J + 1):
        Bk += q[abs(j)] * A[:, J + j: J + j + m]
    return Bk


# ------------------------------------------------------------------ spectrum
THETAS = [-1e-6, 0.0, 1e-3, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0]


def eigs(G):
    """eigenvalues (ascending). GPU 1 through cupy when available (float64 screen), LAPACK dsyevd otherwise. S4_CPU_EIG=1 forces LAPACK."""
    if not os.environ.get('S4_CPU_EIG'):
        try:
            import cupy as cp
            pool = cp.get_default_memory_pool(); pool.set_limit(size=24 * 1024 ** 3)
            n = G.shape[0]
            print('  planned GPU allocation: %d x %d float64 = %.2f GB plus eigensolver workspace' % (n, n, n * n * 8 / 1e9), flush=True)
            t0 = time.time()
            g = cp.empty((n, n), dtype=cp.float64)
            for i in range(0, n, 1024):          # transfer by row blocks: no host staging buffer of the size of G
                g[i:i + 1024] = cp.asarray(G[i:i + 1024])
            ev = cp.asnumpy(cp.linalg.eigvalsh(g)); del g; pool.free_all_blocks()
            print('  gpu eigvalsh n=%d: %.1fs' % (n, time.time() - t0), flush=True)
            return ev
        except Exception as e:
            if os.environ.get('S4_NO_CPU_FALLBACK'): raise
            print('  gpu eigensolve failed (%s); LAPACK used' % (repr(e)[:120]), flush=True)
    from scipy.linalg import eigvalsh
    t0 = time.time()
    ev = eigvalsh(G, overwrite_a=True, check_finite=False, driver='evd')
    print('  cpu eigvalsh n=%d: %.1fs' % (G.shape[0], time.time() - t0), flush=True)
    return ev


def spectrum_summary(ev):
    ev = np.sort(ev); n = len(ev)
    out = dict(dim=n, lam_min=float(ev[0]), lam_max=float(ev[-1]),
               ev_low=[float(x) for x in ev[:10]], ev_high=[float(x) for x in ev[-5:]],
               quant={str(qq): float(np.quantile(ev, qq)) for qq in (0.001, 0.01, 0.05, 0.25, 0.5, 0.75, 0.95, 0.99, 0.999)},
               m=[float((ev ** k).mean()) for k in (1, 2, 3, 4)],
               N_theta={}, gap_theta={})
    for th in THETAS:
        out['N_theta'][str(th)] = int((ev > th).sum())
        out['gap_theta'][str(th)] = float(np.min(np.abs(ev - th)))
    return out
