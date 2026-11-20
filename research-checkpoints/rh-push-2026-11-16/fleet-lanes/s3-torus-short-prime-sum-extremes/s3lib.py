"""Shared code for the lane s3-torus-short-prime-sum-extremes.

- exact phases: frac(log p / 2 pi) as 128-bit integers (python ints); cycles of H log n for integer H are
  integer products mod 2^128; on the GPU a lattice H0 + k*step uses uint64 wrap-around arithmetic.
- type-1 non-uniform FFT (exponential-of-semicircle kernel) for sums sum_j c_j exp(-i k omega_j) on a grid of k.
float64 on GPU (cupy) when present, numpy otherwise. GPU output is a screen, not a verdict.
"""
import os, math
import numpy as np
import mpmath as mp
import torus as T
from torus import xp, GPU, asnp

if GPU:
    import cupy as cp
    import cupyx

BITS = 128
MASK = (1 << BITS) - 1


def frac_logs(ns, prec=220):
    """python ints floor(2^128 frac(log n / 2 pi)) for n in ns (use for primes; extend additively)."""
    out = []
    try:
        import flint
        old = flint.ctx.prec
        flint.ctx.prec = prec
        D = 2 * flint.arb.pi()
        two = flint.arb(2) ** BITS
        for n in ns:
            x = flint.arb(int(n)).log() / D
            x = x - x.floor()
            u = (x * two).floor().unique_fmpz()
            if u is None:
                raise ValueError('ball straddles an integer')
            out.append(int(u) & MASK)
        flint.ctx.prec = old
    except ImportError:
        old = mp.mp.prec
        mp.mp.prec = prec
        D = 2 * mp.pi
        for n in ns:
            x = mp.log(int(n)) / D
            x = x - mp.floor(x)
            out.append(int(mp.floor(mp.ldexp(x, BITS))) & MASK)
        mp.mp.prec = old
    return out


def extend_logs(N, primes, Lp):
    """128-bit fractional logs for all n <= N from those of the primes (python ints, list indexed by n)."""
    spf = np.zeros(N + 1, dtype=np.int64)
    for p in primes:
        p = int(p)
        if p * p > N:
            break
        blk = spf[p * p::p]
        blk[blk == 0] = p
    L = [0] * (N + 1)
    for p, l in zip(primes, Lp):
        L[int(p)] = l
    for n in range(4, N + 1):
        q = int(spf[n])
        if q:
            L[n] = (L[q] + L[n // q]) & MASK
    return L


def cycles_exact(H, L):
    """float cycles frac(H log n / 2 pi) for one integer H, L list of 128-bit logs (exact to 2^-53)."""
    H = int(H)
    return np.array([(((H * l) & MASK) >> (BITS - 53)) for l in L], dtype=np.float64) * 2.0 ** -53


def lattice_tables(H0, step, L):
    """uint64 arrays (base_hi, d_hi, d_lo24) for u_n(k) = top64((H0 + k step) L_n mod 2^128), 0 <= k < 2^24."""
    H0 = int(H0); step = int(step)
    base = np.array([((H0 * l) & MASK) >> 64 for l in L], dtype=np.uint64)
    D = [(step * l) & MASK for l in L]
    dhi = np.array([d >> 64 for d in D], dtype=np.uint64)
    dlo = np.array([(d >> 40) & 0xFFFFFF for d in D], dtype=np.uint64)
    return base, dhi, dlo


def lattice_u(base, dhi, dlo, k):
    """(K, n) uint64 cycles * 2^64; base, dhi, dlo: (n,) xp uint64; k: (K,) xp uint64 < 2^24."""
    k = k[:, None]
    return base[None, :] + k * dhi[None, :] + ((k * dlo[None, :]) >> np.uint64(24))


def u2cyc(u):
    return (u >> np.uint64(11)).astype(xp.float64) * (2.0 ** -53)


# ------------------------------------------------------------------ NUFFT type 1
def es_beta(w, sigma):
    return 0.97 * math.pi * w * (1 - 1 / (2 * sigma))


def es_hat(k, nf, w, beta, nq=96):
    """Fourier transform of the kernel exp(beta (sqrt(1 - z^2) - 1)), z = 2 y / w, at integer modes k (xp array)."""
    xg, wg = np.polynomial.legendre.leggauss(nq)
    out = xp.zeros(k.shape, dtype=xp.float64)
    kk = k.astype(xp.float64) * (math.pi * w / nf)
    for z, q in zip(xg, wg):
        out += (q * math.exp(beta * (math.sqrt(1 - z * z) - 1))) * xp.cos(kk * z)
    return out * (w / 2)


class Spreader:
    """Accumulates sum_j c_j delta(omega_j) on ng grids of size nf (real or complex), then transforms.
    F_g(k) = sum_j c_gj exp(-i k omega_j), k = -M/2 .. M/2 - 1."""

    def __init__(self, ng, nf, M, w=8, dtype=None):
        self.nf, self.M, self.w, self.ng = int(nf), int(M), int(w), int(ng)
        self.sigma = self.nf / self.M
        self.beta = es_beta(self.w, self.sigma)
        self.dtype = dtype or xp.float64
        print(f'planned grids: {ng} x {nf} x {np.dtype(self.dtype).itemsize} B = {ng * nf * np.dtype(self.dtype).itemsize / 2**30:.2f} GiB', flush=True)
        self.G = xp.zeros((self.ng, self.nf), dtype=self.dtype)

    def add(self, omega, C):
        """omega: (n,) xp float in [0, 2 pi); C: (ng, n) xp array of strengths."""
        x = omega * (self.nf / (2 * math.pi))
        j0 = xp.ceil(x - self.w / 2)
        for l in range(self.w):
            j = j0 + l
            z = (j - x) * (2.0 / self.w)
            ker = xp.exp(self.beta * (xp.sqrt(xp.maximum(0.0, 1 - z * z)) - 1))
            idx = (j.astype(xp.int64)) % self.nf
            for g in range(self.ng):
                v = C[g] * ker
                if GPU:
                    if xp.iscomplexobj(v):
                        gv = self.G[g].view(xp.float64)
                        cupyx.scatter_add(gv, 2 * idx, v.real)
                        cupyx.scatter_add(gv, 2 * idx + 1, v.imag)
                    else:
                        cupyx.scatter_add(self.G[g], idx, v)
                else:
                    if np.iscomplexobj(v):
                        self.G[g] += np.bincount(idx, weights=v.real, minlength=self.nf) + 1j * np.bincount(idx, weights=v.imag, minlength=self.nf)
                    else:
                        self.G[g] += np.bincount(idx, weights=v, minlength=self.nf)

    def khat(self):
        k = xp.arange(-self.M // 2, self.M // 2)
        return k, es_hat(k, self.nf, self.w, self.beta)

    def transform(self, g=None, grid=None, shift=0.0, kh=None):
        """F(k + shift), k = -M/2..M/2-1, for grid g (or an explicit grid). shift in (-1, 1) evaluates between modes."""
        G = self.G[g] if grid is None else grid
        if shift != 0.0:
            jj = xp.arange(self.nf, dtype=xp.float64)
            jj = xp.where(jj > self.nf / 2 + self.w, jj - self.nf, jj)      # node positions (wrap: omega in [0, 2 pi) used part only)
            G = G * xp.exp((-2j * math.pi * shift / self.nf) * jj)
        F = xp.fft.fft(G)
        del G
        k = xp.arange(-self.M // 2, self.M // 2)
        out = F[k % self.nf]
        del F
        if kh is None:
            kh = es_hat(k.astype(xp.float64) + shift, self.nf, self.w, self.beta)
        return out / kh


def nufft1(omega, c, M, nf=None, w=8):
    """one-shot: sum_j c_j exp(-i k omega_j), k = -M/2..M/2-1 (omega in [0, 2 pi))."""
    if nf is None:
        nf = 1 << int(math.ceil(math.log2(2 * M)))
    cplx = xp.iscomplexobj(c)
    S = Spreader(1, nf, M, w=w, dtype=xp.complex128 if cplx else xp.float64)
    S.add(xp.asarray(omega), xp.asarray(c)[None, :])
    return S.transform(0)


# ------------------------------------------------------------------ primes
def seg_primes(lo, hi, base):
    """primes in [lo, hi) (lo >= 3 odd handling inside), base = primes <= sqrt(hi)."""
    lo = max(lo, 3)
    if lo % 2 == 0:
        lo += 1
    n = (hi - lo + 1) // 2
    if n <= 0:
        return np.zeros(0, dtype=np.int64)
    s = np.ones(n, dtype=bool)
    for p in base[1:]:
        p = int(p)
        if p * p >= hi:
            break
        st = max(p * p, ((lo + p - 1) // p) * p)
        if st % 2 == 0:
            st += p
        s[(st - lo) // 2::p] = False
    return lo + 2 * np.nonzero(s)[0].astype(np.int64)


def thin_set(primes, b=0.75, half=False):
    """boolean mask of a set S of primes with counting function int_2^x t^(b-1) dt / log t (half of it if half)."""
    xs = np.asarray(primes, dtype=float)
    # L(x) = li(x^b) - li(2^b)
    Lx = np.array([float(mp.li(x ** b) - mp.li(2 ** b)) for x in xs]) if len(xs) < 200000 else None
    if Lx is None:
        from scipy.special import expi
        Lx = expi(b * np.log(xs)) - expi(b * math.log(2))
    if half:
        Lx = Lx / 2
    mask = np.zeros(len(xs), dtype=bool)
    cnt = 0
    for i in range(len(xs)):
        if cnt + 1 <= Lx[i]:
            mask[i] = True
            cnt += 1
    return mask


def hash_unit(p, seed=20261119):
    """deterministic pseudo-random numbers in [0, 1) from integers p (numpy or cupy int64 arrays)."""
    m = xp if (GPU and isinstance(p, cp.ndarray)) else np
    z = p.astype(m.uint64) + m.uint64(seed) * m.uint64(0x9E3779B97F4A7C15)
    z = (z ^ (z >> m.uint64(30))) * m.uint64(0xBF58476D1CE4E5B9)
    z = (z ^ (z >> m.uint64(27))) * m.uint64(0x94D049BB133111EB)
    z = z ^ (z >> m.uint64(31))
    return (z >> m.uint64(11)).astype(m.float64) * 2.0 ** -53
