# Objects: zeta, Dirichlet arms, DH-type twins, Epstein forms, E_a, T-NR, sign twists, unimodular twist, GL2 amplitude vectors.
import math, numpy as np
from math import gcd
import wf
KAPPA = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)

def spec_zeta(nmax, tab=None):
    L = (tab or wf.sieve_mangoldt(nmax))[0]
    x, w = wf.atoms_from_c(L)
    s = wf.arch_dirichlet(1, 0); s.update(x=x, w=w, poles=(0.5,), name='zeta'); return s

def spec_periodic(aper, q, delta, nmax, name=''):
    """F = sum a(n mod q) n^{-s}, a(1) != 0, gamma factor Gamma_R(s+delta), conductor q, no pole."""
    a1 = aper[1 % q]; A = np.array([aper[n % q]/a1 for n in range(nmax + 1)], float)
    c = wf.logderiv_general(A, nmax); x, w = wf.atoms_from_c(c)
    s = wf.arch_dirichlet(q, delta); s.update(x=x, w=w, poles=(), name=name, c=c); return s

def dh_coeffs(): return [0.0, 1.0, KAPPA, -KAPPA, -1.0]

def spec_Ea(al, nmax, tab=None):
    L = (tab or wf.sieve_mangoldt(nmax))[0]; n = np.nonzero(L)[0]
    s = wf.arch_Ea(al); s.update(x=np.log(n), w=L[n]*(n**al + n**(-al))/np.sqrt(n), poles=(0.5 - al, 0.5 + al), name='E_a(%g)' % al); return s

def spec_tnr(q, c, nmax, bridge='own', tab=None):
    """zeta(s)(1 + c q^{1/2-s} + q^{1-2s}); own bridge: conductor q^2; 'zeta': zeta's bridge."""
    L = (tab or wf.sieve_mangoldt(nmax))[0].copy()
    disc = c*c - 4.0
    cw = np.zeros(nmax + 1); cw[1:] = L[1:]/np.sqrt(np.arange(1, nmax + 1))
    k = 1; qk = q
    while qk <= nmax:
        if disc >= 0: r1 = (-c + math.sqrt(disc))/2; r2 = (-c - math.sqrt(disc))/2; pw = r1**k + r2**k
        else: th = math.atan2(math.sqrt(-disc), -c); pw = 2*math.cos(k*th)
        cw[qk] += -math.log(q)*pw       # c(q^k) q^{-k/2} = -log q (r1^k + r2^k)
        qk *= q; k += 1
    n = np.nonzero(cw)[0]
    s = wf.arch_dirichlet(q*q if bridge == 'own' else 1, 0); s.update(x=np.log(n), w=cw[n], poles=(0.5,), name='TNR(q=%d,c=%g,%s)' % (q, c, bridge)); return s

def spec_signtwist(eps_of_p, nmax, name, tab=None):
    """completely multiplicative eps on prime powers: c(p^k) = eps(p)^k log p; zeta's bridge and pole (formal)."""
    L, P, K = tab or wf.sieve_mangoldt(nmax); n = np.nonzero(L)[0]
    e = np.array([eps_of_p(int(p)) for p in P[n]], float)**K[n]
    s = wf.arch_dirichlet(1, 0); s.update(x=np.log(n), w=e*L[n]/np.sqrt(n), poles=(0.5,), name=name); return s

def spec_unimod(alpha, nmax, tab=None):
    """zeta(s + i alpha) read with zeta's bridge: real part of the prime side, cos(alpha log n) Lambda(n)."""
    L = (tab or wf.sieve_mangoldt(nmax))[0]; n = np.nonzero(L)[0]
    s = wf.arch_dirichlet(1, 0); s.update(x=np.log(n), w=np.cos(alpha*np.log(n))*L[n]/np.sqrt(n), poles=(0.5,), name='WT(%g)' % alpha); return s

def spec_dirichlet_real(chi, q, delta, nmax, name, tab=None):
    L, P, K = tab or wf.sieve_mangoldt(nmax); n = np.nonzero(L)[0]
    e = np.array([chi(int(p)) for p in P[n]], float)**K[n]
    s = wf.arch_dirichlet(q, delta); s.update(x=np.log(n), w=e*L[n]/np.sqrt(n), poles=(), name=name); return s

def spec_gl2_amp(k, N, amp, nmax, name='', tab=None, poles=()):
    """GL2 symbol with amplitude function amp(p, j) = c(p^j)/log p (two copies of zeta: amp = 2)."""
    L, P, K = tab or wf.sieve_mangoldt(nmax); n = np.nonzero(L)[0]
    e = np.array([amp(int(p), int(j)) for p, j in zip(P[n], K[n])], float)
    s = wf.arch_gl2(k, N); s.update(x=np.log(n), w=e*L[n]/np.sqrt(n), poles=poles, name=name); return s

# ---------- Epstein forms ----------
def reduced_forms(D):
    out = []
    a = 1
    while 3*a*a <= -D:
        for b in range(0, a + 1):          # b >= 0 only: (a,-b,c) has the same Epstein zeta function
            if (b*b - D) % (4*a): continue
            c = (b*b - D)//(4*a)
            if c < a: continue
            if gcd(gcd(a, b), c) != 1: continue
            out.append((a, b, c))
        a += 1
    return out

def class_number(D):
    h = 0; a = 1
    while 3*a*a <= -D:
        for b in range(-a + 1, a + 1):
            if (b*b - D) % (4*a): continue
            c = (b*b - D)//(4*a)
            if c < a or (a == c and b < 0): continue
            if gcd(gcd(a, abs(b)), c) != 1: continue
            h += 1
        a += 1
    return h

def rep_counts(form, M):
    """r(m) = #{(x,y) != 0 : Q(x,y) = m}, m <= M (int64 array)."""
    a, b, c = form; D = b*b - 4*a*c
    ymax = int(math.isqrt(int(4*a*M//(-D))) + 1)
    r = np.zeros(M + 1, dtype=np.int64)
    for y in range(0, ymax + 1):
        # a x^2 + b x y + c y^2 <= M
        disc = b*b*y*y - 4*a*(c*y*y - M)
        if disc < 0: continue
        sq = math.sqrt(disc); x0 = int(math.floor((-b*y - sq)/(2*a))) - 1; x1 = int(math.ceil((-b*y + sq)/(2*a))) + 1
        xs = np.arange(x0, x1 + 1, dtype=np.int64); v = a*xs*xs + b*xs*y + c*y*y
        ok = (v <= M) & (v > 0); mult = 1 if y == 0 else 2      # (x,y) and (-x,-y)
        np.add.at(r, v[ok], mult)
    return r

def _ps_inverse(f, n):
    """power-series inverse of f (f[0] = 1) mod z^n by Newton iteration (float FFT)."""
    from scipy import fft as sfft
    g = np.array([1.0]); m = 1
    while m < n:
        m2 = min(2*m, n); L = sfft.next_fast_len(2*m2 + m, real=True)
        Fg = sfft.rfft(g, L); Ff = sfft.rfft(f[:m2], L)
        g = (2*sfft.irfft(Fg, L) - sfft.irfft(Fg*Fg*Ff, L))[:m2]; m = m2
    return g

def _deposit4(n, xs, wt, h):
    """4-point cubic Lagrange deposit of atoms (xs, wt) on the grid j*h: reproduces moments up to degree 3."""
    out = np.zeros(n); j = np.floor(xs/h).astype(np.int64); u = xs/h - j
    ok = (j >= 1) & (j + 2 < n)
    j = j[ok]; u = u[ok]; w = wt[ok]
    np.add.at(out, j - 1, w*(-u*(u - 1)*(u - 2)/6)); np.add.at(out, j, w*((u + 1)*(u - 1)*(u - 2)/2))
    np.add.at(out, j + 1, w*(-(u + 1)*u*(u - 2)/2)); np.add.at(out, j + 2, w*((u + 1)*u*(u - 1)/6))
    return out

def epstein_atoms(form, amax, h=1e-5, tilt=True):
    """atoms of -d/ds log(amin^s Z_Q(s)/r(amin)), x <= 2 amax. Principal forms: exact integer atoms.
    Other forms: measure (x nu) * (delta + nu)^{-1} on a grid of spacing h (cubic deposit, FFT power series)."""
    from scipy import fft as sfft
    a, b, c = form; amin = a
    M = int(amin*math.exp(2*amax)) + 1
    r = rep_counts(form, M); m = np.nonzero(r)[0]; m = m[m > amin]
    info = dict(first_ratio=float(m[0]/amin), beta=float(r[m[0]]/r[amin]), nvalues=int(len(m)))
    if amin == 1:
        A = r/float(r[1]); A[0] = 0; cc = wf.logderiv_general(A, M); x, w = wf.atoms_from_c(cc)
        npp = [int(q) for q in np.nonzero(cc)[0] if q >= 2 and not _is_pp(int(q))][:1]
        info.update(natoms=int(len(x)), exact=True, first_nonpp=npp[0] if npp else None)
        return x, w, info
    # exponential tilt: the series is handled at an abscissa sg0 where it converges absolutely (sum b_q q^{-sg0} <= 0.9), so that
    # every array in the FFT power-series step is bounded; the atoms at abscissa 1/2 are recovered by the factor e^{(sg0-1/2)x}.
    # Without the tilt the coefficients grow like e^{(sigma_c - 1/2) x} and the FFT round-off (relative to the largest entry)
    # contaminates the small-x atoms when the form has zeros far to the right of 1.
    xs = np.log(m/amin); b = r[m]/r[amin]
    sg0 = 0.5
    while float(np.sum(b*np.exp(-sg0*xs))) > 0.9 and sg0 < 60: sg0 += 0.25
    if not tilt: sg0 = 0.5
    wt = b*np.exp(-sg0*xs)
    n = int(2*amax/h) + 8
    nu = _deposit4(n, xs, wt, h); xnu = _deposit4(n, xs, wt*xs, h)
    f = nu.copy(); f[0] = 1.0
    inv = _ps_inverse(f, n)
    L = sfft.next_fast_len(2*n, real=True)
    cw = sfft.irfft(sfft.rfft(xnu, L)*sfft.rfft(inv, L), L)[:n]
    growth = float(np.abs(cw).max()/max(np.abs(cw[:max(8, int(0.3/h))]).max(), 1e-300))
    cw = cw*np.exp((sg0 - 0.5)*h*np.arange(n))
    idx = np.nonzero(np.abs(cw) > 1e-16)[0]
    info.update(natoms=int(len(idx)), exact=False, sg0=sg0)
    return idx*h, cw[idx], info

def _is_pp(n):
    p = 2
    while p*p <= n:
        if n % p == 0:
            while n % p == 0: n //= p
            return n == 1
        p += 1
    return True

def spec_epstein(form, amax, h=1e-5, tilt=True):
    a, b, c = form; D = b*b - 4*a*c
    x, w, info = epstein_atoms(form, amax, h, tilt)
    s = wf.arch_epstein(D, a); s.update(x=x, w=w, poles=(0.5,), name='Q%s' % (form,), info=info); return s

def spec_epstein_exact_principal(D, amax):
    """principal form, integer atoms by the exact recursion (validation of the grid route)."""
    form = reduced_forms(D)[0]; assert form[0] == 1
    M = int(math.exp(2*amax)) + 1; r = rep_counts(form, M); A = r/float(r[1]); A[0] = 0
    cc = wf.logderiv_general(A, M); x, w = wf.atoms_from_c(cc)
    s = wf.arch_epstein(D, 1); s.update(x=x, w=w, poles=(0.5,), name='Q%s exact' % (form,)); return s
