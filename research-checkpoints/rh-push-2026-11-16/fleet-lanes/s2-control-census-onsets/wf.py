# Shared Weil-form engine (float64). W(g) on real g supported in [-a,a], G = autocorrelation of g:
#   W(g) = ||g||^2 [C + tau(a)] + int_0^{2a} k(x) (||g||^2 - G(x)) dx - 2 sum_q w_q G(x_q) + sum_poles 2[(int g cosh mu x)^2 - (int g sinh mu x)^2]
# with atoms (x_q, w_q) = (log q, c(q) q^{-1/2}), -F'/F = sum c(q) q^{-s}; k, C, tau from the gamma factor and conductor.
# Basis on [-a,a]: a^{-1/2} p_n(x/a)(1-x^2/a^2)^3, p_n orthonormal Gegenbauer(6.5) (same basis as route 44); even/odd sectors.
# G1_ij(v) = int phi_i(y) phi_j(y+v) dy (symmetrised) is a polynomial in v on [0,2] of degree <= 4N+11: it is stored at K
# Chebyshev nodes once; every (object, a) then needs only K scalar node weights.
import os, math
for _k in ('VECLIB_MAXIMUM_THREADS', 'OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[_k] = '1'
import numpy as np
from numpy.polynomial.legendre import leggauss
from scipy.special import digamma, gammaln
LAM = 6.5
USE_NUFFT = int(os.environ.get('WF_NUFFT', 1)); USE_GPU = 0; _CP = [None, False]
def _cupy():
    if not _CP[1]:
        _CP[1] = True
        try:
            import cupy
            cupy.get_default_memory_pool().set_limit(size=int(float(os.environ.get('WF_GPU_GB', 2.5))*1024**3))
            _CP[0] = cupy
        except Exception as e:
            print('cupy unavailable: %r' % (e,), flush=True)
    return _CP[0]
MU0 = math.exp(0.5*math.log(math.pi) + gammaln(7.0) - gammaln(7.5))

def phis(x, N, parity):
    x = np.asarray(x, float); shp = x.shape; x = x.ravel(); inside = np.abs(x) < 1
    out = np.empty((x.size, N)); pm1 = np.zeros_like(x); p = np.full_like(x, 1/math.sqrt(MU0))
    col = 0
    if parity == 0: out[:, 0] = p; col = 1
    deg = 0
    while col < N:
        n = deg + 1
        bn = math.sqrt(n*(n + 2*LAM - 1)/(4*(n + LAM)*(n + LAM - 1)))
        bnm1 = math.sqrt((n-1)*(n - 2 + 2*LAM)/(4*(n - 1 + LAM)*(n - 2 + LAM))) if n > 1 else 0.0
        pn = (x*p - bnm1*pm1)/bn
        pm1, p = p, pn; deg = n
        if deg % 2 == parity: out[:, col] = p; col += 1
    w = np.where(inside, (1 - x*x)**3, 0.0)
    return (out*w[:, None]).reshape(shp + (N,))

def G1stack(vs, N, parity, chunk=32):
    M = 2*N + 10; xg, wg = leggauss(M); vs = np.asarray(vs, float); out = np.empty((len(vs), N, N))
    for s in range(0, len(vs), chunk):
        v = vs[s:s+chunk]; hi = 1.0 - v
        Y = -1.0 + (hi[:, None] + 1.0)*(xg[None, :] + 1)/2
        WY = wg[None, :]*(hi[:, None] + 1.0)/2
        A = phis(Y, N, parity)*WY[:, :, None]; B = phis(Y + v[:, None], N, parity)
        S = np.einsum('jmk,jml->jkl', A, B, optimize=True)
        out[s:s+chunk] = 0.5*(S + S.transpose(0, 2, 1))
    return out

class Basis:
    def __init__(self, N, cache=None):
        self.N = N; K = self.K = 4*N + 20
        th = (np.arange(K) + 0.5)*np.pi/K; self.v = 1 + np.cos(th)
        fn = None if cache is None else os.path.join(cache, 'G1_N%d.npy' % N)
        if fn and os.path.exists(fn): self.G = np.load(fn)
        else:
            print('Basis: G1 stack 2 x %d x %d x %d float64 = %.2f GB' % (K, N, N, 2*K*N*N*8/1e9), flush=True)
            self.G = np.stack([G1stack(self.v, N, 0), G1stack(self.v, N, 1)])
            if fn: np.save(fn, self.G)
        self.Cn = (2.0/K)*np.cos(np.outer(th, np.arange(K))); self.Cn[:, 0] *= 0.5
        Mg = 2*N + 160; xg, wg = leggauss(Mg); self.vg = xg + 1; self.wg = wg
        self.Tg = np.cos(np.outer(np.arccos(xg), np.arange(K)))
        Mp = 2*N + 200; yp, wp = leggauss(Mp); self.yp = yp
        self.Php = [phis(yp, N, par)*wp[:, None] for par in (0, 1)]
        self.kk = np.arange(K)

    def atom_moments(self, x, w, a, spec=None):
        """M_k = sum_q w_q T_k(x_q/a - 1), k < K, over atoms with x_q < 2a. Direct cosines for few atoms;
        otherwise a type-1 non-uniform FFT (Gaussian gridding, oversampling 3, half-width 14 points; error ~1e-14 relative,
        checked against the direct sum in validate_nufft.py)."""
        m = int(np.searchsorted(x, 2*a, side='left')); K = self.K
        if m*K <= 3000000 or not USE_NUFFT:
            out = np.zeros(K); step = max(1, 4000000//K)
            for s in range(0, m, step):
                u = np.clip(x[s:min(m, s+step)]/a - 1.0, -1.0, 1.0)
                out += w[s:min(m, s+step)] @ np.cos(np.outer(np.arccos(u), self.kk))
            return out
        R = 3; Msp = 14; Mm = 2*K; Mr = R*Mm; tau = math.pi*Msp/(Mm*Mm*R*(R - 0.5)); d = 2*math.pi/Mr
        l = np.arange(-Msp, Msp + 1); grid = np.zeros(Mr)
        for s in range(0, m, 100000):
            th = np.arccos(np.clip(x[s:min(m, s+100000)]/a - 1.0, -1.0, 1.0)); ww = w[s:min(m, s+100000)]
            m0 = np.rint(th/d).astype(np.int64); idx = m0[:, None] + l[None, :]
            val = ww[:, None]*np.exp(-(th[:, None] - idx*d)**2/(4*tau))
            grid += np.bincount((idx % Mr).ravel(), weights=val.ravel(), minlength=Mr)
        F = np.fft.fft(grid)[:K]
        return (math.sqrt(math.pi/tau)*np.exp(self.kk*self.kk*tau)*F/Mr).real

    def forms(self, spec, a):
        """returns [Q_even, Q_odd] (N x N)."""
        N = self.N
        kw = self.wg*a*spec['kern'](a*self.vg)
        Mom = kw @ self.Tg + 2.0*self.atom_moments(spec['x'], spec['w'], a, spec)
        om = self.Cn @ Mom
        c = spec['C'] + spec['tail'](a) + kw.sum()
        out = []
        for par in (0, 1):
            Q = c*np.eye(N) - np.tensordot(om, self.G[par], axes=(0, 0))
            for mu in spec.get('poles', ()):
                f = np.cosh(mu*a*self.yp) if par == 0 else np.sinh(mu*a*self.yp)
                P = math.sqrt(a)*(f @ self.Php[par])
                Q += (2.0 if par == 0 else -2.0)*np.outer(P, P)
            out.append(0.5*(Q + Q.T))
        return out

    def lam(self, spec, a):
        Qs = self.forms(spec, a); self.nrm = max(float(np.abs(Q).max()) for Q in Qs)
        return [float(np.linalg.eigvalsh(Q)[0]) for Q in Qs]

    def neg(self, spec, a, FL=1e-11):
        """(is_negative, lam): negative means below the double-precision floor -FL*max(1, max|Q|) (route 44 convention)."""
        l = self.lam(spec, a); return (min(l) < -FL*max(1.0, self.nrm)), l

    def onset(self, spec, lo=0.15, hi=3.0, tol=0.005, FL=1e-11, coarse=0.25):
        """smallest a with a sector below the floor (lambda_min is non-increasing in a up to basis error).
        returns (a_lo, a_hi, sector, lam at a_hi); a_hi None if not negative at hi; a_lo None if negative at lo."""
        ng, l = self.neg(spec, hi, FL)
        if not ng: return (hi, None, None, l)
        ng0, l0 = self.neg(spec, lo, FL)
        if ng0: return (None, lo, int(np.argmin(l0)), l0)
        a0 = lo; a1 = hi; l1 = l; g = lo + coarse
        while g < hi:
            ngg, lg = self.neg(spec, g, FL)
            if ngg: a1 = g; l1 = lg; break
            a0 = g; g += coarse
        while a1 - a0 > tol:
            mid = 0.5*(a0 + a1); ngm, lm = self.neg(spec, mid, FL)
            if ngm: a1 = mid; l1 = lm
            else: a0 = mid
        return (a0, a1, int(np.argmin(l1)), l1)

# ---------- gamma-factor data ----------
def _tail_exp_sinh(alpha, half):
    """tau(a) = int_{2a}^inf e^{-alpha x}/sinh(x/half_div) dx with sinh(x) (half=1) or sinh(x/2) (half=2)."""
    if half == 1:   # e^{-alpha x}/sinh x = 2 sum_m e^{-(2m+1+alpha)x}
        return lambda a: float(sum(2*math.exp(-(2*m + 1 + alpha)*2*a)/(2*m + 1 + alpha) for m in range(4000)))
    return lambda a: float(sum(2*math.exp(-(m + 0.5 + alpha)*2*a)/(m + 0.5 + alpha) for m in range(8000)))

def arch_dirichlet(q, delta):
    """Gamma_R(s+delta), conductor q: C = log(q/pi) + psi(b), k = e^{-(2b-1)x}/sinh x, b = 1/4 + delta/2."""
    b = 0.25 + delta/2; al = 2*b - 1
    return dict(C=math.log(q/math.pi) + float(digamma(b)), kern=lambda x: np.exp(-al*x)/np.sinh(x), tail=_tail_exp_sinh(al, 1))

def arch_gl2(k, N):
    """Gamma(s+(k-1)/2), (sqrt N/2pi)^s: C = log N - 2 log 2pi + 2 psi(k/2), k(x) = e^{-(k-1)x/2}/sinh(x/2)."""
    al = (k - 1)/2.0
    return dict(C=math.log(N) - 2*math.log(2*math.pi) + 2*float(digamma(k/2.0)), kern=lambda x: np.exp(-al*x)/np.sinh(x/2), tail=_tail_exp_sinh(al, 2))

def arch_epstein(D, amin):
    return arch_gl2(1, abs(D)/float(amin)**2)   # 2 log(sqrt|D|/(2 pi amin)) + 2 psi(1/2), k = 1/sinh(x/2)

def arch_Ea(al):
    """zeta(s+al) zeta(s-al): two Gamma_R factors."""
    C = -2*math.log(math.pi) + float(digamma(0.25 + al/2) + digamma(0.25 - al/2))
    t1 = _tail_exp_sinh(-0.5 + al, 1); t2 = _tail_exp_sinh(-0.5 - al, 1)
    return dict(C=C, kern=lambda x: 2*np.exp(x/2)*np.cosh(al*x)/np.sinh(x), tail=lambda a: t1(a) + t2(a))

# ---------- coefficient tables ----------
def sieve_mangoldt(nmax):
    """returns (L, P, Kexp): Lambda(n), base prime and exponent for prime powers (0 otherwise)."""
    L = np.zeros(nmax + 1); P = np.zeros(nmax + 1, dtype=np.int64); Kx = np.zeros(nmax + 1, dtype=np.int64)
    sv = np.ones(nmax + 1, dtype=bool); sv[:2] = False
    for p in range(2, int(nmax**0.5) + 1):
        if sv[p]: sv[p*p::p] = False
    for p in np.nonzero(sv)[0]:
        pk = int(p); k = 1
        while pk <= nmax: L[pk] = math.log(p); P[pk] = p; Kx[pk] = k; pk *= int(p); k += 1
    return L, P, Kx

def logderiv_general(A, nmax):
    """c(n) with sum_{d|n} c(d) A(n/d) = A(n) log n, A(1) = 1 (A: array 0..nmax)."""
    c = np.zeros(nmax + 1); logn = np.log(np.maximum(np.arange(nmax + 1), 1))
    rhs = A*logn
    for d in range(2, nmax + 1):
        cd = rhs[d]; c[d] = cd
        if cd != 0.0 and 2*d <= nmax:
            m = np.arange(2, nmax//d + 1)
            rhs[d*m] -= cd*A[m]
    return c

def atoms_from_c(c, nmax=None):
    n = np.nonzero(c)[0]; n = n[n >= 2]
    return np.log(n), c[n]/np.sqrt(n)
