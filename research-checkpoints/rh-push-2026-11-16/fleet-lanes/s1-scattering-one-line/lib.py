"""Shared code for lane s1-scattering-one-line.
Evaluator A: Euler-Maclaurin on Hurwitz sums (no functional equation used), any sigma, t up to ~1e7.
Evaluator B: sharp-cut approximate functional equation, for sigma near 1 and t up to 4e10 (float64 screen).
xp = cupy when available (one device, pool limit set), else numpy."""
import math, os, sys
import numpy as np
try:
    if os.environ.get('S1_NOGPU'): raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S1_POOL_GB', '10')) * 1024**3))
    xp = cp; GPU = True
except Exception:
    cp = None; xp = np; GPU = False

def asnp(a):
    return cp.asnumpy(a) if GPU and isinstance(a, cp.ndarray) else np.asarray(a)

def announce(what, nbytes):
    print('planned allocation: %s = %.1f MB' % (what, nbytes / 1e6), flush=True)

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
CHI5 = np.array([0, 1, 1j, -1j, -1], dtype=np.complex128)      # odd character mod 5, chi(2) = i
C1 = (1 - 1j * KAPPA) / 2; C2 = (1 + 1j * KAPPA) / 2            # DH = C1 L(chi) + C2 L(chibar)
DHPER = np.array([0, 1, KAPPA, -KAPPA, -1.0])

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

def mobius_upto(n):
    mu = np.ones(n + 1, dtype=np.int8); mu[0] = 0
    for p in primes_upto(n):
        mu[p::p] *= -1; mu[p*p::p*p] = 0
    return mu

def dirichlet_inverse(a, n):
    """b with a*b = delta, a[1] = 1; a complex array indexed 0..n"""
    b = np.zeros(n + 1, dtype=np.complex128); b[1] = 1
    for m in range(1, n // 2 + 1):          # push contributions b[m] a[k] to b[m k], k >= 2
        if b[m] != 0:
            ks = np.arange(2, n // m + 1)
            b[m * ks] -= b[m] * a[ks]
    return b
# note: the loop above is valid because b[m] is final when m is reached (all proper divisors d < m were processed)

BERN = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6, -3617/510, 43867/798, -174611/330, 854513/138,
        -236364091/2730, 8553103/6, -23749461029/870, 8615841276005/14322, -7709321041217/510,
        2577687858367/6, -26315271553053477373/1919190, 2929993913841559/6, -261082718496449122051/13530]

def hurwitz_batch(t, sigma, q, want_deriv=True, chunk_elems=4e7, Nfac=0.5):
    """Sums R_a(s) = sum_{n = a mod q, n >= 1} n^{-s} (analytically continued) and d/ds, a = 1..q, s = sigma + i t.
    Returns arrays (q, B) complex. Euler-Maclaurin with N = Nfac * tmax + 30 head terms per residue."""
    t = np.asarray(t, dtype=np.float64); B = len(t)
    N = int(Nfac * max(float(np.max(np.abs(t))), 10.0)) + 30
    K = len(BERN)
    tg = xp.asarray(t)
    R = np.zeros((q, B), dtype=np.complex128); Rd = np.zeros((q, B), dtype=np.complex128)
    C = max(1, int(chunk_elems // B))
    s = sigma + 1j * t
    for a in range(1, q + 1):
        al = a / q
        H = xp.zeros(B, dtype=xp.complex128); Hd = xp.zeros(B, dtype=xp.complex128)
        for n0 in range(0, N, C):
            v = xp.arange(n0, min(n0 + C, N), dtype=xp.float64) + al
            lv = xp.log(v); w = xp.exp(-sigma * lv)
            ph = xp.outer(tg, lv)
            E = xp.cos(ph) - 1j * xp.sin(ph)
            H += E @ w.astype(xp.complex128)
            if want_deriv: Hd -= E @ (w * lv).astype(xp.complex128)
            del ph, E
        H = asnp(H); Hd = asnp(Hd)
        X = N + al; lX = math.log(X)
        Xs = np.exp(-s * lX)
        T0 = X * Xs / (s - 1); T1 = Xs / 2
        Z = H + T0 + T1
        Zd = Hd + T0 * (-lX - 1 / (s - 1)) + T1 * (-lX)
        poch = s.copy(); hs = 1 / s; fact = 2.0          # (s)_{2k-1}, sum 1/(s+j), (2k)!
        for k in range(1, K + 1):
            if k > 1:
                j1 = 2 * k - 3; j2 = 2 * k - 2
                poch = poch * (s + j1) * (s + j2); hs = hs + 1 / (s + j1) + 1 / (s + j2)
                fact *= (2 * k - 1) * (2 * k)
            Tk = BERN[k - 1] / fact * poch * Xs * X ** (-(2 * k - 1))
            Z = Z + Tk; Zd = Zd + Tk * (hs - lX)
        qs = np.exp(-s * math.log(q)) if q > 1 else 1.0
        R[a - 1] = qs * Z; Rd[a - 1] = qs * (Zd - (math.log(q) if q > 1 else 0.0) * Z)
    return R, Rd

def lgamma_stirling(z):
    """log Gamma(z), complex numpy array, |z| large (shifted up by 8 for safety)"""
    z = np.asarray(z, dtype=np.complex128); sh = np.zeros_like(z)
    for j in range(8): sh += np.log(z + j)
    w = z + 8
    return (w - 0.5) * np.log(w) - w + 0.5 * math.log(2 * math.pi) + 1/(12*w) - 1/(360*w**3) + 1/(1260*w**5) - 1/(1680*w**7) - sh

def chi_zeta(s):
    """zeta(s) = chi(s) zeta(1-s)"""
    return np.exp((s - 0.5) * math.log(math.pi) + lgamma_stirling((1 - s) / 2) - lgamma_stirling(s / 2))

TAU5 = sum(CHI5[a] * np.exp(2j * np.pi * a / 5) for a in range(1, 5))
EPS5 = TAU5 / (1j * math.sqrt(5))
def X_chi5(s, conj=False):
    """L(s,chi) = X(s) L(1-s, chibar), chi the odd character mod 5 with chi(2) = i (conj=True: for chibar)"""
    eps = np.conj(EPS5) if conj else EPS5
    return eps * np.exp((0.5 - s) * math.log(5 / math.pi) + lgamma_stirling((2 - s) / 2) - lgamma_stirling((s + 1) / 2))

def theta_generic(t, q, kap):
    """theta_F(t) = (t/2) log(q/pi) + Im log Gamma((1/2 + kap + i t)/2), continuous, theta(0) = 0"""
    t = np.asarray(t, dtype=np.float64)
    return 0.5 * t * math.log(q / math.pi) + lgamma_stirling((0.5 + kap + 1j * t) / 2).imag

def oneline_batch(t, sigmas=(1.0,), nchunk=None, chunk_elems=6e7, logn_hi=None):
    """Sharp-cut approximate functional equation at s = sigma + i t for sigma in sigmas (zeta) and sigma = 1 (mod 5).
    Returns dict: 'zeta'[sigma] (B,), 'Lchi', 'Lchibar' (B,) at sigma = 1, 'zeta2' = zeta(2 + 2 i t) by the direct sum."""
    t = np.asarray(t, dtype=np.float64); B = len(t)
    Nz = np.floor(np.sqrt(t / (2 * math.pi))).astype(np.int64)
    N5 = np.floor(np.sqrt(5 * t / (2 * math.pi))).astype(np.int64)
    Nmax = int(N5.max())
    tg = xp.asarray(t); Nzg = xp.asarray(Nz); N5g = xp.asarray(N5)
    ns = len(sigmas)
    Sz = xp.zeros((B, 2 * ns + 1), dtype=xp.complex128)      # direct sums sigma_j, dual sums, zeta2 direct
    S5 = xp.zeros((B, 8), dtype=xp.complex128)               # residue a = 1..4: weights n^-1 then n^0
    C = max(1, int(chunk_elems // B))
    for n0 in range(1, Nmax + 1, C):
        n = xp.arange(n0, min(n0 + C, Nmax + 1), dtype=xp.float64)
        ln = xp.log(n)
        ph = xp.outer(tg, ln)
        E = xp.cos(ph) - 1j * xp.sin(ph)                      # n^{-it}
        del ph
        m5 = (n[None, :] <= N5g[:, None])
        E5 = E * m5
        res = (n.astype(xp.int64) % 5)
        W5 = xp.zeros((len(n), 8), dtype=xp.complex128)
        for a in range(1, 5):
            W5[:, a - 1] = (res == a) / n
            W5[:, 4 + a - 1] = (res == a)
        S5 += E5 @ W5
        del E5, W5
        if n0 <= int(Nz.max()):
            mz = (n[None, :] <= Nzg[:, None])
            Ez = E * mz
            Wz = xp.zeros((len(n), 2 * ns + 1), dtype=xp.complex128)
            for j, sg in enumerate(sigmas):
                Wz[:, j] = xp.exp(-sg * ln); Wz[:, ns + j] = xp.exp((sg - 1) * ln)
            Sz[:, :2 * ns] += Ez @ Wz[:, :2 * ns]
            Sz[:, 2 * ns] += (Ez * Ez) @ (1 / (n * n)).astype(xp.complex128)
            del Ez, Wz, mz
        del E, m5
    Sz = asnp(Sz); S5 = asnp(S5)
    out = {'zeta': {}, 'Sz': Sz, 'S5': S5}
    for j, sg in enumerate(sigmas):
        s = sg + 1j * t
        out['zeta'][sg] = Sz[:, j] + chi_zeta(s) * np.conj(Sz[:, ns + j])
    out['zeta2'] = Sz[:, 2 * ns]
    s = 1 + 1j * t
    A = S5[:, :4]; D = S5[:, 4:]
    chi = CHI5[1:5]
    Lc_dir = A @ chi; Lcb_dir = A @ np.conj(chi)
    # dual of L(s,chi): sum chibar(n) n^{s-1} = sum chibar(n) n^{it} = conj( sum chi(n) n^{-it} )
    out['Lchi'] = Lc_dir + X_chi5(s) * np.conj(D @ chi)
    out['Lchibar'] = Lcb_dir + X_chi5(s, conj=True) * np.conj(D @ np.conj(chi))
    return out
