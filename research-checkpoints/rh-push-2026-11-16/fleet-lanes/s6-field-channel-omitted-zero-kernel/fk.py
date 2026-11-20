"""Shared library, lane s6-field-channel-omitted-zero-kernel (numpy only; no scipy).

Conventions.  A zero is rho = 1/2 + i y; on-line zeros have real y.  For an adjacent pair a = x_l < b = x_{l+1} of a table,
  K_l = 2 sum over omitted zeros y of 1/((a - y)(b - y))        (all terms positive when the omitted y are real and outside [a, b]).
Flow convention of the source modules (imp-3725, imp-3933): dx_k/dt = -2 sum_{j != k} 1/(x_k - x_j); a lone pair of gap g collides at g^2/8.
  This t equals (de Bruijn-Newman time in z = 2 gamma)/4.
G(x) = sum over all zeros y (symmetric summation) of 1/(x - y) = Re[i Lambda'/Lambda(1/2 + i x)]:
  G(x) = arch(x) + sum_n [Im c_n cos(x log n) - Re c_n sin(x log n)],  c_n = Lambda_F(n)/sqrt(n)   (formal on the line; used smoothed, see ktilde).
"""
import os, sys, math, json, time, ctypes, numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)
def jdump(o, fn):
    def conv(v):
        if isinstance(v, (np.floating,)): return float(v)
        if isinstance(v, (np.integer,)): return int(v)
        if isinstance(v, np.ndarray): return v.tolist()
        if isinstance(v, (np.bool_,)): return bool(v)
        raise TypeError(type(v))
    with open(fn, 'w') as f: json.dump(o, f, indent=1, default=conv)

_k = None
def kern():
    global _k
    if _k is None:
        _k = ctypes.CDLL(os.path.join(HERE, 'libfk.so'))
        dp = np.ctypeslib.ndpointer(np.float64, flags='C'); lp = np.ctypeslib.ndpointer(np.int64, flags='C'); L = ctypes.c_long
        _k.fk_psum.argtypes = [L, dp, L, dp, ctypes.c_void_p, L, dp, dp]
        _k.fk_pairsum.argtypes = [L, dp, L, dp, dp, lp, lp, dp, dp]
        _k.fk_pair_S.argtypes = [L, dp, L, dp]
    return _k

def pairsum(x, a, b, lo, hi):
    """S[q] = sum_{j not in [lo_q, hi_q)} 1/((a_q-x_j)(b_q-x_j)), Sm[q] = sum_j 1/((a_q+x_j)(b_q+x_j))"""
    x = np.ascontiguousarray(x, np.float64); a = np.ascontiguousarray(a, np.float64); b = np.ascontiguousarray(b, np.float64)
    lo = np.ascontiguousarray(lo, np.int64); hi = np.ascontiguousarray(hi, np.int64)
    S = np.zeros(len(a)); Sm = np.zeros(len(a)); kern().fk_pairsum(len(x), x, len(a), a, b, lo, hi, S, Sm); return S, Sm

def pair_S(x, J):
    x = np.ascontiguousarray(x, np.float64); S = np.full(len(x), np.nan); kern().fk_pair_S(len(x), x, J, S); return S

# ------------------------------------------------------------------ gamma-factor functions (complex digamma, log-gamma by Stirling)
_B = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6]
def cdigamma(z):
    z = np.asarray(z, np.complex128).copy(); acc = np.zeros_like(z)
    for _ in range(16): acc -= 1 / z; z += 1
    out = np.log(z) - 1 / (2 * z); zi = 1 / (z * z); p = zi.copy()
    for k, B in enumerate(_B): out -= B / (2 * (k + 1)) * p; p *= zi
    return out + acc
def cloggamma(z):
    z = np.asarray(z, np.complex128).copy(); acc = np.zeros_like(z)
    for _ in range(16): acc -= np.log(z); z += 1
    out = (z - 0.5) * np.log(z) - z + 0.5 * math.log(2 * math.pi); p = 1 / z; zi = p * p
    for k, B in enumerate(_B): out += B / ((2 * k + 2) * (2 * k + 1)) * p; p *= zi
    return out + acc

def dens(y, q=1.0, par=0):
    """smooth density of ordinates: (1/2pi)[log(q/pi) + Re psi((1/2 + par + i y)/2)]"""
    return (math.log(q / math.pi) + cdigamma(0.25 + 0.5 * par + 0.5j * np.asarray(y, np.float64)).real) / (2 * math.pi)
def nsmooth(T, q=1.0, par=0):
    """(1/pi)[(T/2) log(q/pi) + Im log Gamma((1/2 + par + i T)/2)]  (zeta: N(T) = nsmooth + 1 + S(T), principal branch unwrapped by Stirling)"""
    T = np.asarray(T, np.float64)
    return (0.5 * T * math.log(q / math.pi) + cloggamma(0.25 + 0.5 * par + 0.5j * T).imag) / math.pi
def tstar(N, q=1.0, par=0, c0=1.0, T0=None):
    """height T with nsmooth(T) + c0 = N"""
    T = float(T0 if T0 is not None else 2 * math.pi * N / max(math.log(max(N, 3.0)), 1.0))
    for _ in range(60):
        f = float(nsmooth(T, q, par)) + c0 - N; T -= f / float(dens(T, q, par))
        if abs(f) < 1e-12 * max(N, 1): break
    return T
def arch(x, q=1.0, par=0, zeta=True):
    """archimedean part of G(x) = Re[i Lambda'/Lambda(1/2+ix)]: -(1/2) Im psi((1/2+par+ix)/2)  (+ 2x/(1/4+x^2) for the s(s-1) factor of xi)"""
    x = np.asarray(x, np.float64)
    v = -0.5 * cdigamma(0.25 + 0.5 * par + 0.5j * x).imag
    return v + 2 * x / (0.25 + x * x) if zeta else v

_GLc = {}
def gl(n):
    if n not in _GLc: _GLc[n] = np.polynomial.legendre.leggauss(n)
    return _GLc[n]
def tail_int(T, a, b, q=1.0, par=0, n=400):
    """int_T^inf dens(y) dy / ((y - a)(y - b)),  T > max(a, b).  y = b + (T-b)/v, v = w^3."""
    xs, ws = gl(n); w = 0.5 * (xs + 1); ww = 0.5 * ws
    a = np.atleast_1d(np.asarray(a, np.float64))[:, None]; b = np.atleast_1d(np.asarray(b, np.float64))[:, None]
    v = w[None, :] ** 3; y = b + (T - b) / v
    return (dens(y, q, par) / ((T - b) + (b - a) * v) * 3 * w[None, :] ** 2 * ww[None, :]).sum(1)

# ------------------------------------------------------------------ band-limited kernel
# w(u) = 1 on [0, 1/2], 1 - S(2u - 1) on [1/2, 1], S the degree-11 smooth step (five vanishing derivatives at both ends).
# ktilde(rho) = int_0^1 w(u) sin(rho u) du  ->  1/rho for rho >> 1;   k_L(r) = L ktilde(r L) is the kernel 1/r cut at resolution 1/L.
def wfun(u):
    u = np.asarray(u, np.float64); t = np.clip(2 * u - 1, 0, 1)
    S = t ** 6 * (462 + t * (-1980 + t * (3465 + t * (-3080 + t * (1386 - 252 * t)))))
    return np.where(u >= 1, 0.0, 1 - S)
RHOMAX = 3000.0; HSTEP = 0.004
_KT = None
def _ktab():
    global _KT
    if _KT is None:
        fn = os.path.join(HERE, 'data', 'ktab.npz')
        if os.path.exists(fn):
            d = np.load(fn); _KT = (d['k'], d['dk'])
        else:
            rho = np.arange(0, RHOMAX + 3 * HSTEP, HSTEP); k = np.empty(len(rho)); dk = np.empty(len(rho))
            xs, ws = gl(1100); u = np.concatenate([0.25 * (xs + 1), 0.5 + 0.25 * (xs + 1)]); wq = np.concatenate([0.25 * ws, 0.25 * ws]) * wfun(u)
            for s in range(0, len(rho), 4000):
                ph = np.outer(rho[s:s + 4000], u); k[s:s + 4000] = np.sin(ph) @ wq; dk[s:s + 4000] = np.cos(ph) @ (wq * u)
            os.makedirs(os.path.dirname(fn), exist_ok=True); np.savez(fn, k=k, dk=dk); _KT = (k, dk)
    return _KT
def ktilde(rho):
    rho = np.asarray(rho, np.float64); s = np.sign(rho); r = np.abs(rho); out = np.empty(r.shape)
    big = r >= RHOMAX; out[big] = 1 / r[big]
    k, dk = _ktab(); rs = r[~big]; i = np.floor(rs / HSTEP).astype(np.int64); t = rs / HSTEP - i
    h00 = (1 + 2 * t) * (1 - t) ** 2; h10 = t * (1 - t) ** 2; h01 = t * t * (3 - 2 * t); h11 = t * t * (t - 1)
    out[~big] = h00 * k[i] + h10 * HSTEP * dk[i] + h01 * k[i + 1] + h11 * HSTEP * dk[i + 1]
    return s * out
def kL(r, L): return L * ktilde(np.asarray(r) * L)

# ------------------------------------------------------------------ primes
def small_primes(r):
    sv = np.ones(r + 1, bool); sv[:2] = False
    for i in range(2, int(math.isqrt(r)) + 1):
        if sv[i]: sv[i * i::i] = False
    return np.nonzero(sv)[0].astype(np.int64)
def prime_segments(X, seg=1 << 24):
    """yields arrays of primes in consecutive segments up to X"""
    small = small_primes(int(math.isqrt(X)) + 1)
    for lo in range(0, X + 1, seg):
        hi = min(lo + seg, X + 1); s = np.ones(hi - lo, bool)
        if lo == 0: s[:2] = False
        for p in small:
            if p * p >= hi: break
            st = max(p * p, ((lo + p - 1) // p) * p); s[st - lo::p] = False
        yield np.nonzero(s)[0].astype(np.int64) + lo
def higher_powers(X):
    """(n, p, k) for prime powers n = p^k <= X, k >= 2"""
    ps = small_primes(int(math.isqrt(X)) + 1); n = []; b = []; kk = []
    k = 2
    while 2 ** k <= X:
        c = ps[ps <= int(round(X ** (1.0 / k))) + 1]; pk = c ** k; m = pk <= X
        n.append(pk[m]); b.append(c[m]); kk.append(np.full(int(m.sum()), k)); k += 1
    return np.concatenate(n), np.concatenate(b), np.concatenate(kk)

def psum(logn, cS, cC, x, out):
    """out[m, v] += sum_j cS[v, j] sin(x_m logn_j) + cC[v, j] cos(x_m logn_j)"""
    logn = np.ascontiguousarray(logn, np.float64); cS = np.ascontiguousarray(cS, np.float64); x = np.ascontiguousarray(x, np.float64)
    V = cS.shape[0]
    cp = None
    if cC is not None: cC = np.ascontiguousarray(cC, np.float64); cp = cC.ctypes.data_as(ctypes.c_void_p)
    kern().fk_psum(len(logn), logn, V, cS, cp, len(x), x, out)

# ------------------------------------------------------------------ characters
def chi4(p): return np.where(p % 4 == 1, 1.0, np.where(p % 4 == 3, -1.0, 0.0))
def chi5r(p): return np.where((p % 5 == 1) | (p % 5 == 4), 1.0, np.where(p % 5 == 0, 0.0, -1.0))
def chi5c(p):
    """complex character mod 5 with chi(2) = i"""
    t = np.array([0, 1, 1j, -1j, -1]); return t[p % 5]

# ------------------------------------------------------------------ lists
def load_list(fn):
    g = np.load(fn, mmap_mode='r')
    mf = fn.replace('.npy', '.meta.npy')
    return g, (np.load(mf) if os.path.exists(mf) else None)

def unfolded_gaps(g, q=1.0, par=0):
    """gaps times the smooth density at the midpoint"""
    g = np.asarray(g, np.float64); d = np.diff(g); m = 0.5 * (g[1:] + g[:-1])
    return d * (np.log(q * m / (2 * math.pi)) / (2 * math.pi))
