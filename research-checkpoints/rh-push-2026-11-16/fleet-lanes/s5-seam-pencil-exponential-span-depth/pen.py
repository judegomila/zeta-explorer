"""Shared code, lane s5-seam-pencil-exponential-span-depth.
Object: rates nu_i (Re nu_i > 0), span E = span{exp(-conj(nu_i) t)} in L2(0,inf),
Lambda(nu,d) = sup_{g in E} int_d^inf |g|^2 / int_0^inf |g|^2 = lambda_max of (D G D*, G), G_ij = 1/(nu_i + conj nu_j).
Computation without the Cauchy Gram: in the Takenaka-Malmquist orthonormal basis
  e_k(s) = sqrt(2 Re nu_k)/(s + conj nu_k) prod_{j<k} (s - nu_j)/(s + conj nu_j)
the left shift g -> g(. + d) has matrix exp(d A), A upper triangular,
  A[k,k] = -conj(nu_k),  A[j,k] = -2 sqrt(Re nu_j Re nu_k)  (j < k),
so Lambda = ||exp(dA)||_2^2, and for a block V (set of columns) preceded in the order by the set U,
  LambdaPerp = ||exp(dA)[:, V]||_2^2  (sup over B_U E_V).  Repeated nodes are allowed (confluent spans).
exp(dA) is a contraction, so scaling-and-squaring loses only additive rounding: absolute error ~ 2^s eps.
"""
import math, numpy as np

def gen_A(nu):
    nu = np.asarray(nu)
    r = np.sqrt(nu.real)
    A = -2.0 * np.triu(np.outer(r, r), 1)
    if np.iscomplexobj(nu):
        A = A.astype(np.complex128)
    A[np.diag_indices(len(nu))] = -np.conj(nu)
    return A

def expm_ss(A, d, xp=np, deg=20):
    """exp(d A) by scaling and squaring (Taylor); returns (T, s)."""
    n1 = float(xp.abs(A).sum(axis=0).max()) * abs(d)
    s = max(0, int(math.ceil(math.log2(max(n1, 1e-300)))) + (2 if deg >= 20 else 6))
    B = A * (d / 2.0 ** s)
    I = xp.eye(A.shape[0], dtype=A.dtype)
    T = I.copy(); term = I.copy()
    for k in range(1, deg + 1):
        term = term @ B / k
        T = T + term
    for _ in range(s):
        T = T @ T
    return T, s

def lam_float(nu, d, xp=np):
    A = xp.asarray(gen_A(nu))
    T, s = expm_ss(A, d, xp)
    sv = xp.linalg.norm(T, 2)
    return float(sv) ** 2

# ---------- Arb ----------
def arb_expm(nu_re, nu_im, d, prec, shift=None):
    """exp(d (A + shift I)) as acb_mat (or arb_mat when nu_im is None). nu_* : lists of strings/floats/arb."""
    import flint
    from flint import arb, acb, arb_mat, acb_mat, ctx
    old = ctx.prec; ctx.prec = prec
    try:
        n = len(nu_re)
        re = [arb(x) for x in nu_re]
        rt = [x.sqrt() for x in re]
        dd = arb(d)
        sh = arb(0) if shift is None else arb(shift)
        if nu_im is None:
            M = arb_mat(n, n)
            for j in range(n):
                M[j, j] = (-re[j] + sh) * dd
                for k in range(j + 1, n):
                    M[j, k] = -2 * rt[j] * rt[k] * dd
        else:
            im = [arb(x) for x in nu_im]
            M = acb_mat(n, n)
            for j in range(n):
                M[j, j] = acb(-re[j] + sh, im[j]) * dd      # -conj(nu) = -re + i im
                for k in range(j + 1, n):
                    M[j, k] = acb(-2 * rt[j] * rt[k] * dd)
        return M.exp()
    finally:
        ctx.prec = old

def mat_to_np(T, prec=None):
    """Arb matrix -> (numpy array scaled by 2^-e, e, max relative radius). Value = arr * 2^e."""
    import flint
    from flint import arb, acb, ctx
    n, m = T.nrows(), T.ncols()
    iscomplex = isinstance(T[0, 0], acb)
    ents = T.entries()
    mx = arb(0); rad = arb(0)
    for z in ents:
        a = abs(z)
        u = a.upper() if hasattr(a, 'upper') else a
        if u > mx: mx = u
    if not (mx > 0):
        return np.zeros((n, m)), 0, 0.0
    e = int(math.floor(float(arb(mx).log() / arb(2).log())))
    sc = arb(2) ** (-e)
    out = np.empty(n * m, dtype=np.complex128 if iscomplex else np.float64)
    mr = 0.0
    for i, z in enumerate(ents):
        w = z * sc
        if iscomplex:
            out[i] = complex(float(w.real.mid()), float(w.imag.mid()))
            r = max(float(w.real.rad()), float(w.imag.rad()))
        else:
            out[i] = float(w.mid()); r = float(w.rad())
        if r > mr: mr = r
    return out.reshape(n, m), e, mr

def lam_arb(nu_re, nu_im, d, prec, cols=None):
    """log(Lambda) (natural log), relative radius of the scaled matrix. cols: list of column-index lists -> also LambdaPerp per block."""
    sh = min(float(x) for x in nu_re)
    T = arb_expm(nu_re, nu_im, d, prec, shift=sh)
    X, e, mr = mat_to_np(T)
    base = 2 * e * math.log(2.0) - 2 * sh * float(d)
    s = np.linalg.norm(X, 2)
    res = {'logLam': 2 * math.log(s) + base, 'relrad': mr / s}
    if cols is not None:
        res['logPerp'] = [2 * math.log(max(np.linalg.norm(X[:, c], 2), 1e-300)) + base for c in cols]
    return res

# ---------- closed forms ----------
def tilt_det_log(nu, d):
    """min over 0<s<min Re nu of  -2 s d + sum_{i,j} log|(nu_i+conj nu_j)/(nu_i+conj nu_j-2s)|; returns (log bound capped at 0, s)."""
    nu = np.asarray(nu, dtype=np.complex128)
    S = nu[:, None] + np.conj(nu[None, :])
    lS = np.log(np.abs(S)).sum()
    smax = nu.real.min()
    def f(s):
        return -2 * s * d + lS - np.log(np.abs(S - 2 * s)).sum()
    lo, hi = 0.0, smax * (1 - 1e-12)
    g = (math.sqrt(5) - 1) / 2
    a, b = hi - g * (hi - lo), lo + g * (hi - lo)
    fa, fb = f(a), f(b)
    for _ in range(80):
        if fa < fb:
            hi, b, fb = b, a, fa; a = hi - g * (hi - lo); fa = f(a)
        else:
            lo, a, fa = a, b, fb; b = lo + g * (hi - lo); fb = f(b)
    s = (lo + hi) / 2
    return min(0.0, f(s)), s

def coal_law(y):
    return math.exp(-2 * y) * (1 + 2 * y * y + 2 * y * math.sqrt(1 + y * y))

def lam2_closed(n1, n2, d):
    w1, w2 = math.exp(-d * n1), math.exp(-d * n2)
    h = (w1 - w2) * (n1 + n2) / (n2 - n1)
    return w1 * w2 + h * h / 2 + (h / 2) * math.sqrt(h * h + 4 * w1 * w2)

def laguerre_vals(N, z, mp):
    """L_0(z)..L_{N-1}(z) with mpmath numbers."""
    L = [mp.mpf(1), 1 - z]
    for k in range(1, N):
        L.append(((2 * k + 1 - z) * L[k] - k * L[k - 1]) / (k + 1))
    return L[:N]

def laguerre_floor_log(N, x, mp):
    """log of e^{-2x} sum_{k<N} (L_k(2x)-L_{k-1}(2x))^2  (L_{-1}=0)."""
    z = mp.mpf(2) * x
    L = laguerre_vals(N, z, mp)
    s = L[0] ** 2 + sum((L[k] - L[k - 1]) ** 2 for k in range(1, N))
    return float(mp.log(s) - 2 * x)

def coal_n_cap_log(N, x, R, mp):
    """log of ( e^{-x}[L_{N-1}(-2Rx) + 2 sum_{k<=N-2} L_k(-2Rx)] )^2."""
    z = -mp.mpf(2) * R * x
    L = laguerre_vals(N, z, mp)
    s = L[N - 1] + 2 * sum(L[:N - 1])
    return float(2 * (mp.log(s) - x))

def evoct_cert(m, x, r=None):
    """certCoalM(m,x): ( sum_k sqrt(coalLaw(2^k x)/Phi_k) )^2, coalescent Phi_k = prod_{l != k} beta_{|k-l|}^8."""
    tot = 0.0
    for k in range(m):
        lphi = 0.0
        for l in range(m):
            if l != k:
                n = abs(k - l)
                lphi += 8 * math.log((2.0 ** n - 1) / (2.0 ** n + 1))
        y = 2.0 ** k * x
        if y > 300:
            continue
        tot += math.sqrt(coal_law(y)) * math.exp(-lphi / 2)
    return tot * tot

def bisect(f, lo, hi, it=80):
    """root of decreasing f - 1 (f(lo) > 1 > f(hi))."""
    for _ in range(it):
        mid = (lo + hi) / 2
        if f(mid) > 1: lo = mid
        else: hi = mid
    return (lo + hi) / 2
