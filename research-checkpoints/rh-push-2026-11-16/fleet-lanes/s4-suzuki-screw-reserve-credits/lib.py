"""Shared definitions for the s4-suzuki-screw-reserve-credits screening batch.
Box functional of the Weil form: Psi_F(r) = C_F(r) - sum_{n<=e^r} c_F(n) n^{-1/2} (r - log n)
 = sum over zeros of (1-cos(gamma r))/gamma^2  (gamma = (rho-1/2)/i), with
C_F(r) = A0 + A1 r - sum_j U_{c_j}(r) + sum_poles P (cosh(kappa r) - 1),
U_c(r) = sum_{k>=0} exp(-(2k+2c) r)/(2k+2c)^2,  A0 = sum_j trigamma(c_j)/4,
A1 = (1/2)[log N - d log pi + sum_j digamma(c_j)],  pole at s = 1/2 +- kappa: P = 2/kappa^2.
zeta: c = 1/4, N = 1, kappa = 1/2 (this equals Suzuki's a r + T(r) - D(r))."""
import math
import mpmath as mp
import numpy as np
mp.mp.dps = 40

def consts():
    a = (mp.digamma(mp.mpf(5)/4) - mp.log(mp.pi))/2
    return dict(a=a, b=a-2, Tinf=mp.polygamma(1, mp.mpf(5)/4)/4)

def bridge(kind, N=1, a=0, q0=None):
    """returns dict(A0, A1, cs=[2c_j], poles=[(kappa, P)])"""
    if kind == 'zeta':
        cs = [mp.mpf(1)/4]; poles = [(mp.mpf(1)/2, mp.mpf(8))]; d = 1
    elif kind == 'even':
        cs = [mp.mpf(1)/4]; poles = []; d = 1
    elif kind == 'odd':
        cs = [mp.mpf(3)/4]; poles = []; d = 1
    elif kind == 'Ea':
        a = mp.mpf(a); cs = [mp.mpf(1)/4 + a/2, mp.mpf(1)/4 - a/2]; d = 2
        poles = [(mp.mpf(1)/2 - a, 2/(mp.mpf(1)/2 - a)**2), (mp.mpf(1)/2 + a, 2/(mp.mpf(1)/2 + a)**2)]
    else: raise ValueError(kind)
    A0 = sum(mp.polygamma(1, c) for c in cs)/4
    A1 = (mp.log(N) - d*mp.log(mp.pi) + sum(mp.digamma(c) for c in cs))/2
    return dict(A0=A0, A1=A1, cs=[2*c for c in cs], poles=poles)

def U(al, r):
    """sum_{k>=0} exp(-(2k+al) r)/(2k+al)^2, r > 0 (mp)"""
    r = mp.mpf(r)
    if r == 0: return mp.polygamma(1, al/2)/4
    K = int(mp.ceil((mp.mp.dps*2.4 + 5)/(2*r))) + 2
    s = mp.mpf(0); e2 = mp.exp(-2*r); t = mp.exp(-al*r)
    for k in range(K):
        s += t/(2*k + al)**2; t *= e2
    return s

def Cfun(br, r):
    r = mp.mpf(r)
    v = br['A0'] + br['A1']*r
    for al in br['cs']: v -= U(al, r)
    for kap, P in br['poles']: v += P*(mp.cosh(kap*r) - 1)
    return v

def Cfun_alpha(br, r, alpha):
    """modulated box: test e^{i alpha x} 1_box.  arch_alpha + pole_alpha (real alpha or complex)"""
    r = mp.mpf(r); alpha = mp.mpmathify(alpha)
    v = mp.mpf(0)
    d = len(br['cs'])
    # A1 part: (r/2)[log N - d log pi + sum Re psi(c + i alpha/2)]
    base = 2*br['A1'] - sum(mp.digamma(al/2) for al in br['cs'])
    v += (r/2)*(base + sum(mp.re(mp.digamma(al/2 + 1j*alpha/2)) for al in br['cs']))
    for al in br['cs']:
        K = int(mp.ceil((mp.mp.dps*2.4 + 5)/(2*r))) + 2
        s = mp.mpf(0)
        for k in range(K):
            z = 2*k + al - 1j*alpha
            s += mp.re((1 - mp.exp(-z*r))/z**2)
        # tail k >= K: sum Re 1/z^2
        s += mp.re(mp.zeta(2, (2*K + al - 1j*alpha)/2))/4
        v += s
    for kap, P in br['poles']:
        m = P*kap**2/2          # multiplicity (1 for a simple pole pair)
        for z0 in (1j*kap, -1j*kap):
            z = z0 - alpha
            v += m*mp.re((1 - mp.cos(z*r))/z**2)
    return v

# ---------- prime tables ----------
def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]

def prime_powers(nmax, kmin=1):
    """sorted list of (n, p, k) for p^k <= nmax, k >= kmin"""
    out = []
    ps = primes_upto(int(nmax**(1.0/kmin)) + 2)
    for p in ps:
        p = int(p); k = 1; q = p
        while q <= nmax:
            if k >= kmin: out.append((q, p, k))
            q *= p; k += 1
    out.sort(); return out

# ---------- objects: amplitude amp(p,k) with c(p^k) = amp log p ----------
KAPPA_DH = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
def hash_u(p, seed):
    x = (int(p)*0x9E3779B97F4A7C15 + seed*0xBF58476D1CE4E5B9) & 0xFFFFFFFFFFFFFFFF
    x ^= x >> 31; x = (x*0x94D049BB133111EB) & 0xFFFFFFFFFFFFFFFF; x ^= x >> 29
    x = (x*0xBF58476D1CE4E5B9) & 0xFFFFFFFFFFFFFFFF; x ^= x >> 32
    return x/2.0**64
def chi4(p): return 0 if p % 2 == 0 else (1 if p % 4 == 1 else -1)
def chi5(p): return (0, 1, -1, -1, 1)[p % 5]
def tnr_roots(c):
    d = c*c - 4.0
    return ((-c + math.sqrt(d))/2, (-c - math.sqrt(d))/2)
def tnr_extra(q0, c, k):
    """extra weight at q0^k in units of c(n) n^{-1/2}: -log q0 (r1^k + r2^k) (exact for |c|>=2)"""
    if abs(c) >= 2:
        r1, r2 = tnr_roots(c); return -math.log(q0)*(r1**k + r2**k)
    th = math.atan2(math.sqrt(4 - c*c), -c); return -math.log(q0)*2*math.cos(k*th)

OBJ = [  # name, bridge spec, amp(p,k) or None, flags
 dict(name='zeta', br=('zeta',), amp=lambda p, k: 1.0),
 dict(name='L_chi-4', br=('odd', 4), amp=lambda p, k: float(chi4(p))**k),
 dict(name='L_chi5', br=('even', 5), amp=lambda p, k: float(chi5(p))**k),
 dict(name='liouville', br=('zeta',), amp=lambda p, k: (-1.0)**k),
 dict(name='randsign', br=('zeta',), amp=lambda p, k: (1.0 if hash_u(p, 1) < 0.5 else -1.0)**k),
 dict(name='flip10', br=('zeta',), amp=lambda p, k: (-1.0 if hash_u(p, 2) < 0.1 else 1.0)**k),
 dict(name='unimod3', br=('zeta',), amp=lambda p, k: math.cos(3.0*k*math.log(p))),
 dict(name='Ea0.05', br=('Ea', 0.05), amp=lambda p, k: 2*math.cosh(0.05*k*math.log(p))),
 dict(name='Ea0.10', br=('Ea', 0.10), amp=lambda p, k: 2*math.cosh(0.10*k*math.log(p))),
 dict(name='Ea0.25', br=('Ea', 0.25), amp=lambda p, k: 2*math.cosh(0.25*k*math.log(p))),
 dict(name='TNR3_2.2', br=('zeta',), amp=lambda p, k: 1.0, tnr=(3, 2.2), own=True),
 dict(name='TNR3_2.01', br=('zeta',), amp=lambda p, k: 1.0, tnr=(3, 2.01), own=True),
 dict(name='TNR3_2.2zb', br=('zeta',), amp=lambda p, k: 1.0, tnr=(3, 2.2), own=False),
]
def obj_bridge(o):
    b = o['br']
    if b[0] == 'zeta': br = bridge('zeta')
    elif b[0] in ('odd', 'even'): br = bridge(b[0], N=b[1])
    else: br = bridge('Ea', a=b[1])
    if o.get('own') and 'tnr' in o:
        br = dict(br); br['A1'] = br['A1'] + mp.log(o['tnr'][0])
    return br
def obj_weight(o, p, k):
    """c(p^k) p^{-k/2}"""
    w = o['amp'](p, k)*math.log(p)/p**(k/2.0)
    if 'tnr' in o and p == o['tnr'][0]: w += tnr_extra(p, o['tnr'][1], k)
    return w

def dh_lambda(N):
    """Lambda_DH(n), n <= N (float64), by Dirichlet inversion (small N only)."""
    a5 = np.array([0, 1, KAPPA_DH, -KAPPA_DH, -1.0])
    a = a5[np.arange(N + 1) % 5]; a[0] = 0
    b = np.zeros(N + 1); b[1] = 1
    for m in range(1, N//2 + 1):
        if b[m] != 0:
            ks = np.arange(2, N//m + 1); b[ks*m] -= a[ks]*b[m]
    lam = np.zeros(N + 1); al = a*np.log(np.maximum(np.arange(N + 1), 1))
    for d in range(2, N + 1):
        if al[d] != 0:
            ms = np.arange(1, N//d + 1); lam[d*ms] += al[d]*b[ms]
    return lam
