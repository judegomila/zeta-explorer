"""s3 combination 3: Gabor fingerprint matrix W from the prime side.

Box window on [-L/2, L/2], L = log X, tests e_a(u) = 1_box(u) exp(i nu_a u), nu_a = nu0 + a*delta, delta = 2 pi / L (critical spacing).
F_a(t) = int e_a(u) e^{-itu} du = 2 sin((t - nu_a) L/2)/(t - nu_a).
W_box[a,b] = sum over all zeros rho = 1/2 + i gamma_rho (gamma_rho complex off the line) of F_a(gamma_rho) F_b(gamma_rho).
Explicit formula (g_ab = e_a * e_b is supported in |u| <= L, so the prime sum stops at n <= X exactly; no truncation error):
  W_box = POLE + ARCH - PRIME,
  PRIME[a,b] = (-1)^(a-b) (L/(pi (a-b))) (I_b - I_a),  I_a = Im E(nu_a),  E(nu) = sum_{n<=X} c(n) n^{-1/2+i nu}
  PRIME[a,a] = 2 (L Re E(nu_a) - Re D(nu_a)),  D(nu) = sum c(n) log n n^{-1/2+i nu}
  ARCH[a,b]  = (-1)^(a-b) (L/(2 pi (a-b))) (J_a - J_b),
     J(nu) = sum_mu { Im psi((1/2+mu)/2 + i nu/2) + 2 Re[ e^{-i nu0 L} sum_k e^{-(1/2+mu+2k)L}/(i(1/2+mu+2k) - nu) ] }
  ARCH[a,a]  = L Omega(nu_a) + sum_mu { (1/2) Re psi'((1/2+mu)/2 + i nu_a/2) + 2 Re[ e^{-i nu0 L} sum_k e^{-(1/2+mu+2k)L}/(i(1/2+mu+2k) - nu_a)^2 ] }
     Omega(t) = log N - d log pi + sum_mu Re psi((1/2+mu)/2 + i t/2)
  POLE[a,b]  = 2 Re[F_a(i/2) F_b(i/2)]   (zeta-type objects only)
This is the Loewner (boundary Pick) matrix of Phi(nu) = sum_rho 4 sin^2((gamma_rho - nu0)L/2)/(gamma_rho - nu) on the grid.
Any window phi = box * trigonometric polynomial of period L (Hann: 1/4, 1/2, 1/4) gives W_phi = B W_box B^T.
"""
import math, sys, json, time, numpy as np

PI = math.pi
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)


def sieve(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]


def prime_powers(X):
    """arrays (n, p, k) for prime powers n = p^k <= X"""
    ps = sieve(int(X))
    ns = [ps]; pp = [ps]; kk = [np.ones(len(ps), dtype=np.int64)]
    k = 2
    while 2 ** k <= X:
        q = ps[ps.astype(np.float64) ** k <= X + 0.5]
        q = q[np.array([int(p) ** k <= X for p in q], dtype=bool)] if len(q) else q
        if len(q) == 0: break
        ns.append(np.array([int(p) ** k for p in q], dtype=np.int64)); pp.append(q); kk.append(np.full(len(q), k, dtype=np.int64))
        k += 1
    n = np.concatenate(ns); p = np.concatenate(pp); k = np.concatenate(kk)
    o = np.argsort(n)
    return n[o], p[o], k[o]


def dh_logder(X):
    """c(n), n <= X, with -f'/f = sum c(n) n^{-s} for the Davenport-Heilbronn function (coefficients 1, kappa, -kappa, -1, 0 mod 5)."""
    X = int(X)
    a = np.zeros(X + 1); per = np.array([0.0, 1.0, KAPPA, -KAPPA, -1.0])
    a[1:] = per[np.arange(1, X + 1) % 5]
    c = np.zeros(X + 1)
    ln = np.log(np.maximum(np.arange(X + 1), 1).astype(np.float64))
    rhs = a * ln
    # c(n) = a(n) log n - sum_{d | n, 1 < d < n} c(d) a(n/d)  [a(1) = 1]; process d in increasing order
    for d in range(2, X + 1):
        cd = rhs[d]
        c[d] = cd
        if cd != 0.0 and 2 * d <= X:
            m = np.arange(2, X // d + 1)
            rhs[d * m] -= cd * a[m]
    n = np.nonzero(c)[0]
    return n, c[n]


def tnr_extra(X, q=3, cc=2.2):
    """-P'/P = sum_k e_k q^{-ks}, P = 1 + cc q^{1/2-s} + q^{1-2s}"""
    a = cc * math.sqrt(q); b = float(q)
    # x P'/P = (a x + 2 b x^2)/(1 + a x + b x^2) = sum f_k x^k ; -P'/P(s) = log q * sum f_k q^{-ks}
    K = int(math.log(X) / math.log(q) + 1e-9)
    f = [0.0] * (K + 3)
    num = [0.0, a, 2 * b]
    for k in range(1, K + 1):
        v = num[k] if k < 3 else 0.0
        v -= a * f[k - 1]
        if k >= 2: v -= b * f[k - 2]
        f[k] = v
    return [(q ** k, math.log(q) * f[k]) for k in range(1, K + 1)]


def family(name, X, seed=0):
    """returns dict(n, c, mu, logN, pole)"""
    if name == 'DH':
        n, c = dh_logder(X)
        return dict(n=n.astype(np.float64), c=c.astype(np.complex128), mu=[1.0], logN=math.log(5), pole=False)
    n, p, k = prime_powers(X)
    lp = np.log(p.astype(np.float64))
    if name == 'ZETA':
        return dict(n=n.astype(np.float64), c=lp.astype(np.complex128), mu=[0.0], logN=0.0, pole=True)
    if name == 'CHI5R':
        chi = np.array([0, 1, -1, -1, 1.0])[n % 5]
        return dict(n=n.astype(np.float64), c=(chi * lp).astype(np.complex128), mu=[0.0], logN=math.log(5), pole=False)
    if name == 'CHI5C':
        chi = np.array([0, 1, 1j, -1j, -1])[n % 5]
        return dict(n=n.astype(np.float64), c=chi * lp, mu=[1.0], logN=math.log(5), pole=False)
    if name == 'LIOU':
        return dict(n=n.astype(np.float64), c=((-1.0) ** k * lp).astype(np.complex128), mu=[0.0], logN=0.0, pole=True)
    if name == 'RSGN':
        rng = np.random.default_rng(1000 + seed)
        ps = sieve(int(X)); eps = dict(zip(ps.tolist(), rng.choice([-1.0, 1.0], size=len(ps)).tolist()))
        e = np.array([eps[int(x)] for x in p]) ** k
        return dict(n=n.astype(np.float64), c=(e * lp).astype(np.complex128), mu=[0.0], logN=0.0, pole=True)
    if name == 'UNI':
        rng = np.random.default_rng(2000 + seed)
        ps = sieve(int(X)); th = dict(zip(ps.tolist(), rng.uniform(0, 2 * PI, size=len(ps)).tolist()))
        e = np.exp(1j * np.array([th[int(x)] for x in p]) * k)
        return dict(n=n.astype(np.float64), c=e * lp, mu=[0.0], logN=0.0, pole=True)
    if name == 'WT':   # zeta(s + i alpha): c = Lambda(n) n^{-i alpha}; arch and pole terms of zeta kept (formal)
        alpha = 1.0 + seed
        return dict(n=n.astype(np.float64), c=lp * np.exp(-1j * alpha * np.log(n.astype(np.float64))), mu=[0.0], logN=0.0, pole=True)
    if name == 'TNR':
        c = lp.astype(np.complex128).copy()
        for (m, e) in tnr_extra(X):
            i = np.searchsorted(n, m); c[i] += e
        return dict(n=n.astype(np.float64), c=c, mu=[0.0], logN=2 * math.log(3), pole=True)
    raise ValueError(name)


# ---------------------------------------------------------------- float64 build
def trigamma_c(z):
    z = np.asarray(z, dtype=np.complex128); acc = np.zeros_like(z)
    for j in range(12):
        acc += 1 / (z + j) ** 2
    w = z + 12
    return acc + 1 / w + 1 / (2 * w ** 2) + 1 / (6 * w ** 3) - 1 / (30 * w ** 5) + 1 / (42 * w ** 7) - 1 / (30 * w ** 9)


def dirichlet_sums(fam, nu, xp=np, chunk=4_000_000):
    """E(nu_a), D(nu_a) (float64/complex128); nu numpy array"""
    n = fam['n']; c = fam['c'] / np.sqrt(n); u = np.log(n)
    E = np.zeros(len(nu), dtype=np.complex128); D = np.zeros(len(nu), dtype=np.complex128)
    nu_x = xp.asarray(nu)
    step = max(1, chunk // max(1, len(nu)))
    for i in range(0, len(n), step):
        ux = xp.asarray(u[i:i + step]); cx = xp.asarray(c[i:i + step])
        ph = xp.exp(1j * nu_x[:, None] * ux[None, :])
        e = ph @ cx; d = ph @ (cx * ux)
        E += (xp.asnumpy(e) if xp is not np else e); D += (xp.asnumpy(d) if xp is not np else d)
    return E, D


def arch_terms(fam, nu, L, nu0):
    from scipy.special import psi
    J = np.zeros(len(nu)); Jd = np.zeros(len(nu)); Om = np.full(len(nu), fam['logN'] - len(fam['mu']) * math.log(PI))
    ph = np.exp(-1j * nu0 * L)
    for mu in fam['mu']:
        z = (0.5 + mu) / 2 + 0.5j * nu
        ps = psi(z)
        J += ps.imag; Om += ps.real; Jd += 0.5 * trigamma_c(z).real
        for k in range(0, 60):
            a = 0.5 + mu + 2 * k
            if a * L > 80: break
            w = math.exp(-a * L)
            J += 2 * (ph * w / (1j * a - nu)).real
            Jd += 2 * (ph * w / (1j * a - nu) ** 2).real
    return J, Jd + L * Om, Om


def loewner(v, diag, L, xp=np, scale=1.0):
    """M[a,b] = (-1)^(a-b) scale * (v_a - v_b)/(a - b), M[a,a] = diag"""
    n = len(v)
    v = xp.asarray(v); idx = xp.arange(n)
    d = idx[:, None] - idx[None, :]
    sgn = 1.0 - 2.0 * (d % 2)
    dd = xp.where(d == 0, 1, d)
    M = sgn * scale * (v[:, None] - v[None, :]) / dd
    M[idx, idx] = xp.asarray(diag)
    return M


def build_box(fam, nu0, n, X, xp=np, return_parts=False):
    L = math.log(X); delta = 2 * PI / L
    nu = nu0 + delta * np.arange(n)
    E, D = dirichlet_sums(fam, nu, xp)
    J, Jdiag, Om = arch_terms(fam, nu, L, nu0)
    # PRIME: (-1)^m (L/(pi m)) (I_b - I_a) = loewner(-I) * L/pi ;  ARCH: loewner(J) * L/(2 pi)
    v = (L / (2 * PI)) * J + (L / PI) * E.imag
    diag = Jdiag - 2 * (L * E.real - D.real)
    W = loewner(v, diag, L, xp)
    if fam['pole']:
        Fp = 2 * np.sin((0.5j - nu) * L / 2) / (0.5j - nu)
        Fx = xp.asarray(Fp)
        W += 2 * (Fx[:, None] * Fx[None, :]).real
    if return_parts: return W, dict(nu=nu, E=E, D=D, J=J, Om=Om)
    return W


def hann(W, xp=np):
    """W_hann = B W B^T with rows (1/4, 1/2, 1/4)"""
    A = 0.25 * W[:-2, :] + 0.5 * W[1:-1, :] + 0.25 * W[2:, :]
    return 0.25 * A[:, :-2] + 0.5 * A[:, 1:-1] + 0.25 * A[:, 2:]


def zero_side_box(gammas, nu0, n, X):
    """sum over the given (complex) gammas of F_a F_b (numpy complex; returns real part)"""
    L = math.log(X); delta = 2 * PI / L
    nu = nu0 + delta * np.arange(n)
    g = np.asarray(gammas, dtype=np.complex128)
    F = 2 * np.sin((g[:, None] - nu[None, :]) * L / 2) / (g[:, None] - nu[None, :])
    return (F.T @ F).real, F


if __name__ == '__main__':
    # float64 run: w3.py FAMILY T X n [seed] [gpu]
    name = sys.argv[1]; T = float(sys.argv[2]); X = float(sys.argv[3]); n = int(sys.argv[4])
    seed = int(sys.argv[5]) if len(sys.argv) > 5 else 0
    use_gpu = len(sys.argv) > 6 and sys.argv[6] == 'gpu'
    xp = np
    if use_gpu:
        import cupy as cp
        cp.get_default_memory_pool().set_limit(size=24 * 1024 ** 3); xp = cp
    t0 = time.time()
    print('planned allocation: W %d x %d float64 = %.2f GB (x3 with temporaries and eigensolver workspace)' % (n, n, n * n * 8 / 1e9), flush=True)
    fam = family(name, X, seed)
    L = math.log(X)
    W, parts = build_box(fam, T, n, X, xp, return_parts=True)
    out = dict(family=name, T=T, X=X, n=n, seed=seed, L=L, delta=2 * PI / L, H=n * 2 * PI / L, nterms=int(len(fam['n'])), build_s=time.time() - t0)
    for lab, M in (('box', W), ('hann', hann(W, xp))):
        ev = xp.linalg.eigvalsh(M)
        ev = cp.asnumpy(ev) if use_gpu else ev
        fro = float(xp.sum(M * M)); tr = float(xp.trace(M))
        absmax = float(xp.max(xp.abs(M)))
        tol = 1e-13 * absmax * M.shape[0]
        out[lab] = dict(dim=int(M.shape[0]), trace=tr, fro2=fro, absmax=absmax, lam_min=float(ev[0]), lam_max=float(ev[-1]),
                        n_neg_raw=int((ev < 0).sum()), n_neg_tol=int((ev < -tol).sum()), tol=tol,
                        smallest_abs=float(np.min(np.abs(ev))), n_below_1=int((ev < 1.0).sum()),
                        ev_low=[float(x) for x in ev[:12]], ev_quant=[float(np.quantile(ev, q)) for q in (0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9)])
        del ev
    out['time_s'] = time.time() - t0
    print(json.dumps(out), flush=True)
