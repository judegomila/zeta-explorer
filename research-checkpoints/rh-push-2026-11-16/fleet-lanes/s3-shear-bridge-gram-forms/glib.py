# s3-shear-bridge-gram-forms: shared kernels (float64) for combinations 1-3.
# Convention x = e^{4u}; Xi_F(w) = int_R Phi_F(u) e^{iwu} du.  Kernel formulas follow
# s1-kernel-shear-norms/klib.py (checked there against the Fourier identity).
import math
import numpy as np

KAPPA = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
DH_B = [0.0, 1.0, KAPPA, -KAPPA, -1.0]
CHI3 = [0.0, 1.0, -1.0]
CHI4 = [0.0, 1.0, 0.0, -1.0]


def phi_zeta(u, N=30):
    """canonical kernel, even; evaluated at |u|."""
    u = np.abs(np.asarray(u, dtype=np.float64))
    e4 = np.exp(4*u); e5 = np.exp(5*u); e9 = np.exp(9*u)
    s = np.zeros_like(u)
    for n in range(1, N + 1):
        s += (2*math.pi**2*n**4*e9 - 3*math.pi*n*n*e5)*np.exp(-math.pi*n*n*e4)
    return s


def phi_repo(u, N=10):
    """kernel as typed in the repo sources (prefactors e^{4u}, e^{2u}), u >= 0 only."""
    u = np.asarray(u, dtype=np.float64)
    e2 = np.exp(2*u); e4 = np.exp(4*u)
    s = np.zeros_like(u)
    for n in range(1, N + 1):
        s += (2*math.pi**2*n**4*e4 - 3*math.pi*n*n*e2)*np.exp(-math.pi*n*n*e4)
    return s


def phi_F(u, b, q, delta):
    """even kernel of a Dirichlet-type function with functional equation; evaluated at |u|."""
    u = np.abs(np.asarray(u, dtype=np.float64))
    e4 = np.exp(4*u)
    N = int(6*math.sqrt(q)*4) + 10
    s = np.zeros_like(u)
    for n in range(1, N + 1):
        bn = b[n % q]
        if bn != 0.0:
            s += bn*(n**delta)*np.exp(-math.pi*n*n*e4/q)
    return 4*np.exp((1 + 2*delta)*u)*s


def liouville(N):
    lam = [0, 1] + [0]*(N - 1)
    for n in range(2, N + 1):
        m = n; c = 0; p = 2
        while p*p <= m:
            while m % p == 0:
                m //= p; c += 1
            p += 1
        if m > 1: c += 1
        lam[n] = -1 if c % 2 else 1
    return lam


_LAM = liouville(60)


def phi_liou(u):
    """sign twist (Liouville) theta kernel 4 e^u sum lambda(n) exp(-pi n^2 e^{4u}); no functional
    equation, not even; used for u >= 0 only."""
    u = np.asarray(u, dtype=np.float64)
    e4 = np.exp(4*u)
    s = np.zeros_like(u)
    for n in range(1, 61):
        s += _LAM[n]*np.exp(-math.pi*n*n*e4)
    return 4*np.exp(u)*s


_GLX, _GLW = np.polynomial.legendre.leggauss(1200)


def _phi_conv_direct(u, b):
    u = np.abs(np.asarray(u, dtype=np.float64))
    V = 2.2
    v = V*_GLX; w = V*_GLW
    pv = phi_zeta(v)*np.exp(4*b*v)
    K = phi_zeta(u[:, None] - v[None, :])            # at most 513 x 1200 doubles
    return np.exp(-2*b*u)*(K*(pv*w)[None, :]).sum(axis=1)


_CONV = {}


def phi_conv(u, b):
    """kernel of xi(s+b) xi(s-b) (up to a constant): (Phi e^{2bu}) * (Phi e^{-2bu}), even.
    Evaluated through a Chebyshev interpolant of degree 512 of its logarithm on [0, 2.2] (below 1e-220 beyond; set to zero)."""
    if b not in _CONV:
        _CONV[b] = np.polynomial.chebyshev.Chebyshev.interpolate(lambda x: np.log(_phi_conv_direct(x, b)), 512, domain=[0.0, 2.2])
    u = np.abs(np.asarray(u, dtype=np.float64))
    return np.where(u < 2.2, np.exp(_CONV[b](np.minimum(u, 2.2))), 0.0)


def phi_nr(u, q=3.0, c=2.2):
    """T-NR single-prime twin xi(s)(2 cosh((s-1/2) log q) + c): Phi(u+l/2)+Phi(u-l/2)+c Phi(u)."""
    u = np.asarray(u, dtype=np.float64)
    l = math.log(q)
    return phi_zeta(u + l/2) + phi_zeta(u - l/2) + c*phi_zeta(u)


def heat(tau):
    return lambda u: np.exp(tau*np.asarray(u, dtype=np.float64)**2)*phi_zeta(u)


KERNELS = {
    'zeta': phi_zeta,
    'zeta_repo': phi_repo,
    'chi-3': lambda u: phi_F(u, CHI3, 3, 1),
    'chi-4': lambda u: phi_F(u, CHI4, 4, 1),
    'chi5': lambda u: phi_F(u, [0.0, 1.0, -1.0, -1.0, 1.0], 5, 0),
    'chi-7': lambda u: phi_F(u, [0.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0], 7, 1),
    'DH': lambda u: phi_F(u, DH_B, 5, 1),
    'heat+0.05': heat(0.05),
    'heat-0.05': heat(-0.05),
    'heat-0.2': heat(-0.2),
    'E_b=0.2': lambda u: phi_conv(u, 0.2),
    'E_b=0.35': lambda u: phi_conv(u, 0.35),
    'T-NR(3,2.2)': phi_nr,
    'liouville': phi_liou,
}
ORDER = list(KERNELS)


def gl(n, a, b):
    x, w = np.polynomial.legendre.leggauss(n)
    return 0.5*(b - a)*x + 0.5*(b + a), 0.5*(b - a)*w


def autocorr(phi, g, Um=6.0, n=3000):
    """one-sided autocorrelation A(g) = int_0^Um Phi(u) Phi(u+g) du, vector g."""
    u, w = gl(n, 0.0, Um)
    pu = phi(u)*w
    g = np.atleast_1d(np.asarray(g, dtype=np.float64))
    out = np.empty(g.shape)
    for i in range(0, len(g), 64):
        gg = g[i:i + 64]
        out[i:i + 64] = (phi(u[None, :] + gg[:, None])*pu[None, :]).sum(axis=1)
    return out


if __name__ == '__main__':
    import mpmath as mp
    mp.mp.dps = 30
    print('Phi_zeta(0) =', phi_zeta(0.0), '(known 0.446696900467)')
    # conv kernel check: transform at w = 0 equals product of transforms of the two factors
    u, w = gl(4000, -5.0, 5.0)
    b = 0.2
    lhs = (phi_conv(u, b)*w).sum()
    uu_ = np.linspace(0, 3, 301); uu_ = np.linspace(0, 2.19, 220); print('conv interpolant max relative error on [0,2.19]:', np.abs(phi_conv(uu_, b)/_phi_conv_direct(uu_, b) - 1).max())
    f1 = (phi_zeta(u)*np.exp(2*b*u)*w).sum()
    print('conv check: int Phi_b =', lhs, ' (int Phi e^{2bu})^2 =', f1*f1)
    xi = lambda s: s*(s - 1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
    print('  xi(1/2+b)/4 =', xi(mp.mpf(1)/2 + b)/4, ' quadrature', f1)
    # T-NR check at w = 1.3
    wv = 1.3
    lhs = (phi_nr(u)*np.cos(wv*u)*w).sum()
    rhs = (phi_zeta(u)*np.cos(wv*u)*w).sum()*(2*math.cos(wv*math.log(3)/2) + 2.2)
    print('T-NR check:', lhs, rhs)
    # DH kernel against s1 klib value via Fourier identity at t = 3.7
    t = 3.7
    lhs = (KERNELS['DH'](u)*np.cos(2*t*u)*w).sum()
    k = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
    bb = [0, 1, k, -k, -1]
    s = mp.mpf(1)/2 + 1j*t
    F = sum(bb[r]*mp.zeta(s, mp.mpf(r)/5) for r in range(1, 5))/5**s
    print('DH Fourier:', lhs, mp.nstr((5/mp.pi)**((s + 1)/2)*mp.gamma((s + 1)/2)*F, 15))
    for k_ in ORDER:
        uu = np.linspace(0, 3, 3001)
        v = KERNELS[k_](uu)
        print('%-12s min on [0,3] %.3e  max %.3e  Phi(0) %.6e' % (k_, v.min(), v.max(), v[0]))
