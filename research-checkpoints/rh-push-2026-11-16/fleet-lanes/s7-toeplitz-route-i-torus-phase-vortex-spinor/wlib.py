"""Shared code, lane s2-weil-coefficient-rigidity.
Legendre-Galerkin matrices of Weil forms on L^2(-a,a), python-flint ball arithmetic (midpoints used; radii reported).
Form for an object F with completed function Q^s prod_j pi^{-s/2} Gamma((s+kappa_j)/2) F(s), poles of F at 1/2 +- p:
  W_F(g) = sum_poles (|ghat(ip)|^2 + |ghat(-ip)|^2) + (1/2pi) int w_arch(t) |ghat(t)|^2 dt
           - sum_n n^{-1/2} (c(n) h(log n) + conj c(n) h(-log n)),   h(u) = int g(x) conj g(x-u) dx,
  w_arch(t) = 2 log Q + sum_j (Re psi(z_j + it/2) - log pi),  z_j = 1/4 + kappa_j/2.
Time-domain form of the archimedean part (Gauss integral for psi), g real, basis phi_i = sqrt((2i+1)/(2a)) P_i(x/a):
  Arch_z = A_log - (gamma + log 4a + log pi) I - a int_0^2 r_z(a v) S(v) dv,
  A_log = int_0^2 (2I - S(v))/(2v) dv,  r_z(u) = e^{-2zu}/(1-e^{-2u}) - 1/(2u),
  S(v) = C(v) + C(v)^T,  C(v)_{ij} = sqrt((2i+1)(2j+1))/2 int_{-1+v}^{1} P_i(s) P_j(s-v) ds   (h(u) <-> C(u/a)).
"""
import math, sys, time
import numpy as np
from flint import arb, acb, arb_mat, ctx

def setprec(bits): ctx.prec = bits

_GL = {}
def gl(Q):
    if Q not in _GL:
        _GL[Q] = [arb.legendre_p_root(Q, k, weight=True) for k in range(Q)]
    return _GL[Q]

def legrows(xs, N):
    """rows [sqrt(2i+1) P_i(x)]_{i<N} for x in xs"""
    sq = [arb(2 * i + 1).sqrt() for i in range(N)]
    out = []
    for x in xs:
        x = arb(x.mid())
        p0 = arb(1); p1 = x; row = [p0, p1][:N]
        for n in range(1, N - 1):
            p2 = arb((((2 * n + 1) * x * p1 - n * p0) / (n + 1)).mid())     # midpoint arithmetic: ball recurrences inflate radii like (1+sqrt 2)^n
            row.append(p2); p0, p1 = p1, p2
        out.append([row[i] * sq[i] for i in range(N)])
    return out

def chat(v, N):
    """C(v) as arb_mat (N x N), 0 <= v < 2."""
    v = arb(v)
    G = gl(N + 1)
    half = (2 - v) / 2; mid = v / 2
    xs = [mid + half * x for x, w in G]
    A = legrows(xs, N)
    B = legrows([x - v for x in xs], N)
    ws = [w * half / 2 for x, w in G]
    Bm = arb_mat([[B[k][j] * ws[k] for j in range(N)] for k in range(len(G))])
    return arb_mat(A).transpose() * Bm

def smat(v, N):
    C = chat(v, N)
    return C + C.transpose()

def r_z(z, u):
    return (-2 * z * u).exp() / (1 - (-2 * u).exp()) - 1 / (2 * u)

def eye(N):
    M = arb_mat(N, N)
    for i in range(N): M[i, i] = 1
    return M

def assemble_arch(N, specs, panels=2, extra=56, log=None):
    """specs: list of (a, [z_j]) ; returns (A_log, [T_spec]) with T_spec = sum_j a int_0^2 r_{z_j}(a v) S(v) dv.
    Arch matrix for a spec = len(z) * (A_log - (gamma + log 4a + log pi) I) - T_spec (+ 2 log Q I added by caller)."""
    Q = N + extra
    G = gl(Q)
    Alog = arb_mat(N, N); T = [arb_mat(N, N) for _ in specs]
    I2 = eye(N) * 2
    t0 = time.time()
    for p in range(panels):
        lo = arb(2 * p) / panels; hw = arb(1) / panels
        for k, (x, w) in enumerate(G):
            v = lo + hw * (1 + x); wv = w * hw
            S = smat(v, N)
            Alog = Alog + (I2 - S) * (wv / (2 * v))
            for si, (a, zs) in enumerate(specs):
                a = arb(a)
                coef = sum((r_z(arb(z), a * v) for z in zs), arb(0)) * a * wv
                T[si] = T[si] + S * coef
        if log: print('assemble panel %d/%d done, %.1fs' % (p + 1, panels, time.time() - t0), file=log, flush=True)
    return Alog, T

def arch_matrix(N, a, zs, Alog, Tspec, logQ2=0):
    a = arb(a)
    const = len(zs) * (arb.const_euler() + (4 * a).log() + arb.pi().log()) - arb(logQ2)
    return Alog * len(zs) - eye(N) * const - Tspec

def rung(N, a, n):
    """n^{-1/2} (C, S) at v = log n / a; zero if log n >= 2a"""
    v = arb(n).log() / arb(a)
    if not (v < 2): return None
    C = chat(v, N)
    s = 1 / arb(n).sqrt()
    return C * s

def pole_vec(N, a, p, sign):
    """v_i = int phi_i(x) e^{sign p x} dx"""
    a = arb(a); p = arb(p)
    G = gl(N + 48)
    rows = legrows([x for x, w in G], N)
    out = []
    for i in range(N):
        s = arb(0)
        for k, (x, w) in enumerate(G):
            s += w * rows[k][i] * (sign * p * a * x).exp()
        out.append(s * (a / 2).sqrt())
    return out

# ---------- linear algebra ----------
def tofloat(M):
    n, m = M.nrows(), M.ncols()
    return np.array([[float(M[i, j].mid()) for j in range(m)] for i in range(n)])

def maxrad(M):
    r = 0.0
    for i in range(M.nrows()):
        for j in range(M.ncols()):
            r = max(r, float(M[i, j].rad()))
    return r

def midmat(M):
    n, m = M.nrows(), M.ncols()
    return arb_mat([[arb(M[i, j].mid()) for j in range(m)] for i in range(n)])

def sub(M, idx):
    return arb_mat([[M[i, j] for j in idx] for i in idx])

def complement(cols, n):
    """orthonormal basis (arb_mat n x (n-c)) of the orthogonal complement of the given column vectors (lists of arb)."""
    Hs = []
    Qm = eye(n)
    c = 0
    for col in cols:
        y = Qm.transpose() * arb_mat([[x] for x in col])
        u = [y[i, 0] for i in range(n)]
        for i in range(c): u[i] = arb(0)
        nrm = sum((x * x for x in u), arb(0)).sqrt()
        if float(nrm.mid()) < 1e-60: continue
        sgn = -1 if float(u[c].mid()) > 0 else 1
        u[c] = u[c] - sgn * nrm
        uu = sum((x * x for x in u), arb(0))
        um = arb_mat([[x] for x in u])
        Qm = Qm - (Qm * um) * um.transpose() * (2 / uu)
        c += 1
    return midmat(arb_mat([[Qm[i, j] for j in range(c, n)] for i in range(n)]))

def ldl_neg(M, sigma):
    """number of negative pivots of M - sigma I (Gaussian elimination without pivoting on midpoints); None if a pivot is not sign-definite"""
    d = M.nrows()
    B = [[M[i, j] - (sigma if i == j else 0) for j in range(d)] for i in range(d)]
    neg = 0
    for k in range(d):
        dk = B[k][k]
        if dk < 0: neg += 1
        elif not (dk > 0): return None
        rk = B[k]
        for i in range(k + 1, d):
            ri = B[i]
            f = ri[k] / dk
            for j in range(k + 1, d):
                ri[j] = ri[j] - f * rk[j]
    return neg

def eigmin(M, check=True):
    """lowest eigenvalue of symmetric arb_mat M: float eigh + Rayleigh quotient iteration in ball arithmetic.
    returns dict(lam=float, lam_str, vec=list of arb, float_lam, neg_below)"""
    d = M.nrows()
    Mf = tofloat(M)
    w, V = np.linalg.eigh((Mf + Mf.T) / 2)
    x = arb_mat([[arb(float(V[i, 0]))] for i in range(d)])
    lam = None
    for it in range(8):
        Mx = M * x
        num = (x.transpose() * Mx)[0, 0]; den = (x.transpose() * x)[0, 0]
        lam_new = arb((num / den).mid())
        if lam is not None and abs(float((lam_new - lam).mid())) <= 1e-30 * max(abs(float(lam.mid())), 1e-300) + 1e-90:
            lam = lam_new; break
        lam = lam_new
        try:
            y = (M - eye(d) * lam).solve(x)
        except Exception:
            break
        nr = sum((y[i, 0] * y[i, 0] for i in range(d)), arb(0)).sqrt()
        if not nr.is_finite() or not (nr > 0): break
        x = midmat(y * (1 / nr))
    nb = None
    if check:
        lf = float(lam.mid())
        delta = max(abs(lf) * 1e-6, 1e-80)
        nb = ldl_neg(midmat(M), lam - arb(delta))
    return dict(lam=float(lam.mid()), lam_str=lam.mid().str(25, radius=False), vec=[x[i, 0] for i in range(d)], float_lam=float(w[0]), neg_below=nb, w=w)

def eigmin_robust(M):
    r = eigmin(M)
    if r['neg_below'] in (0,):
        return r
    # fall back: bisection on inertia between float estimate bounds, then inverse iteration
    d = M.nrows(); Mm = midmat(M)
    lo = arb(r['float_lam'] - 1e-9 - abs(r['float_lam']) * 1e-9); hi = arb(r['lam'] if math.isfinite(r['lam']) else r['float_lam'] + 1e-9)
    for it in range(200):
        mid = (lo + hi) / 2
        nb = ldl_neg(Mm, mid)
        if nb is None: mid = mid + (hi - lo) * arb('1e-3'); nb = ldl_neg(Mm, mid)
        if nb and nb >= 1: hi = mid
        else: lo = mid
        if float((hi - lo).mid()) < max(abs(float(hi.mid())) * 1e-12, 1e-85): break
    lam = arb(((lo + hi) / 2).mid())
    x = arb_mat([[arb(1 + 0.37 * math.sin(3.1 * i + 1))] for i in range(d)])
    for it in range(4):
        try: y = (M - eye(d) * lo).solve(x)
        except Exception: break
        nr = sum((y[i, 0] * y[i, 0] for i in range(d)), arb(0)).sqrt()
        x = midmat(y * (1 / nr))
    Mx = M * x
    lam2 = (x.transpose() * Mx)[0, 0] / (x.transpose() * x)[0, 0]
    return dict(lam=float(lam2.mid()), lam_str=lam2.mid().str(25, radius=False), vec=[x[i, 0] for i in range(d)], float_lam=r['float_lam'], neg_below=0, w=r['w'], fallback=True)

def quad(M, x):
    d = len(x); xm = arb_mat([[v] for v in x])
    return (xm.transpose() * (M * xm))[0, 0]

# ---------- coefficients ----------
def vonmangoldt(n):
    for p in range(2, n + 1):
        if n % p == 0:
            m = n
            while m % p == 0: m //= p
            return (p, True) if m == 1 else (None, False)
    return (None, False)

def primepower(n):
    """(p,k) if n = p^k else None"""
    for p in range(2, n + 1):
        if n % p == 0:
            m = n; k = 0
            while m % p == 0: m //= p; k += 1
            return (p, k) if m == 1 else None
    return None

def kappa_dh():
    s5 = arb(5).sqrt()
    return ((10 - 2 * s5).sqrt() - 2) / (s5 - 1)

def coef_dh(K):
    kap = kappa_dh(); ap = [arb(0), arb(1), kap, -kap, arb(-1)]
    c = [arb(0)] * (K + 1)
    for n in range(2, K + 1):
        s = ap[n % 5] * arb(n).log()
        for d in range(2, n):
            if n % d == 0: s -= c[d] * ap[(n // d) % 5]
        c[n] = s
    return c

def coef_mult(K, eps):
    """c(p^k) = eps(p)^k log p; eps: function p -> number (arb/acb/int)"""
    c = [arb(0)] * (K + 1)
    for n in range(2, K + 1):
        pk = primepower(n)
        if pk:
            p, k = pk
            e = eps(p)
            c[n] = (acb(e) ** k if isinstance(e, (acb, complex)) else arb(e) ** k) * arb(p).log()
    return c

def coef_zeta(K): return coef_mult(K, lambda p: 1)

def coef_tnr(K, q, cpar):
    """zeta(s)(1 + c q^{1/2-s} + q^{1-2s}); c(q^k) = (1 - alpha^k - beta^k) log q, alpha+beta = -c sqrt q, alpha beta = q"""
    c = coef_zeta(K)
    sq = arb(q).sqrt(); cp = arb(cpar)
    pk_prev2 = arb(2); pk_prev1 = -cp * sq     # power sums s_0 = 2, s_1 = alpha+beta
    k = 1; n = q
    while n <= K:
        c[n] = c[n] - pk_prev1 * arb(q).log()
        s_next = (-cp * sq) * pk_prev1 - arb(q) * pk_prev2
        pk_prev2, pk_prev1 = pk_prev1, s_next
        n *= q
    return c

def coef_ea(K, b):
    c = coef_zeta(K); b = arb(b)
    return [c[n] * (arb(n) ** b + arb(n) ** (-b)) if n >= 2 else arb(0) for n in range(K + 1)]

CHI3 = [0, 1, -1]
CHI5 = [0, 1, -1, -1, 1]
def coef_chi(K, tab):
    q = len(tab); c = coef_zeta(K)
    return [c[n] * tab[n % q] for n in range(K + 1)]

def eigmin_subspace(M, w=None, V=None, cut=1e-6, iters=3):
    """lowest eigenvalue when several eigenvalues lie below `cut` in absolute value: inverse subspace iteration (shift 0)
    in ball arithmetic started from the float eigenvectors of that cluster, then Rayleigh-Ritz on the cluster (mpmath)."""
    import mpmath as mpm
    d = M.nrows()
    if w is None:
        Mf = tofloat(M); w, V = np.linalg.eigh((Mf + Mf.T) / 2)
    r = max(1, int(np.sum(w < cut)))
    r = min(r, d)
    X = arb_mat([[arb(float(V[i, j])) for j in range(r)] for i in range(d)])
    def orth(Y):
        cols = [[Y[i, j] for i in range(d)] for j in range(r)]
        out = []
        for c in cols:
            for rep in range(2):
                for q in out:
                    dot = sum((a * b for a, b in zip(c, q)), arb(0))
                    c = [a - dot * b for a, b in zip(c, q)]
            nr = sum((a * a for a in c), arb(0)).sqrt()
            out.append([arb((a / nr).mid()) for a in c])
        return arb_mat([[out[j][i] for j in range(r)] for i in range(d)])
    M = midmat(M)
    for it in range(iters):
        try:
            Y = M.solve(X)
        except Exception:
            break
        ok = all(Y[i, j].is_finite() for i in range(d) for j in range(r))
        if not ok: break
        X = orth(Y)
    B = X.transpose() * (M * X)
    if not all(B[i, j].is_finite() for i in range(r) for j in range(r)):
        rr = eigmin_robust(midmat(M)); rr['cluster'] = None; rr['r'] = r; rr['fallback'] = 'nonfinite'
        return rr
    old = mpm.mp.prec; mpm.mp.prec = ctx.prec
    try:
        Bm = mpm.matrix(r, r)
        for i in range(r):
            for j in range(r):
                Bm[i, j] = (mpm.mpf(B[i, j].mid().str(int(ctx.prec * 0.31), radius=False)) + mpm.mpf(B[j, i].mid().str(int(ctx.prec * 0.31), radius=False))) / 2
        try:
            E, Q = mpm.eigsy(Bm)
        except Exception:
            mpm.mp.prec = old
            rr = eigmin_robust(midmat(M)); rr['cluster'] = None; rr['r'] = r; rr['fallback'] = 'eigsy'
            return rr
        k = min(range(r), key=lambda i: E[i])
        lam = E[k]
        vec = [sum((X[i, j] * arb(str(Q[j, k])) for j in range(r)), arb(0)) for i in range(d)]
        lam_f = float(lam); lam_s = mpm.nstr(lam, 25)
        cluster = sorted(float(E[i]) for i in range(r))
    finally:
        mpm.mp.prec = old
    return dict(lam=lam_f, lam_str=lam_s, vec=vec, float_lam=float(w[0]), cluster=cluster, r=r)
