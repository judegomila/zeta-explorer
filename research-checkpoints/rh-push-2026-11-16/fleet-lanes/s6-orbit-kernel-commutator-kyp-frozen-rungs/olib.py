# s6-orbit-kernel-commutator-kyp-frozen-rungs: shared code (python-flint balls).
# Coordinates: s = 1/2 + z.  Lambda_F(s) completed object.  Theta_{F,a}(z) = Lambda_F(1/2+z-a)/Lambda_F(1/2+z+a).
# A zero of Lambda_F at s = 1/2 + delta + i g is a pole of Theta at z = (delta - a) + i g: Re > 0 iff delta > a.
# Schur kernel (right half-plane) K(z,w) = (1 - Theta(z) conj Theta(w)) / (2 pi (z + conj w))   (Lean: FrozenRung.schurKernel).
# Kernel convention of slib.py: x = e^{4u}, Xi_F(w) = int Phi_F(u) e^{iwu} du = Lambda_F(1/2 + i w/2), so w = -2 i z.
import math, os
from flint import arb, acb, ctx, dirichlet_char, acb_mat
import slib


def setprec(p):
    ctx.prec = int(p)


def xi(s):
    s = acb(s)
    return s*(s - 1)/2*acb.pi()**(-s/2)*(s/2).gamma()*s.zeta()


_CH = {}


def _char(q, n):
    if (q, n) not in _CH:
        _CH[(q, n)] = dirichlet_char(q, n)
    return _CH[(q, n)]


def lam_chi(q, n, par):
    ch = _char(q, n)

    def f(s):
        s = acb(s)
        return (arb(q)/arb.pi())**((s + par)/2)*((s + par)/2).gamma()*ch.l(s)
    return f


def lam_dh(s):
    """Davenport-Heilbronn: f = ((1 - i k)/2) L(s, chi) + ((1 + i k)/2) L(s, chibar), chi mod 5, chi(2) = i; odd."""
    s = acb(s)
    k = slib._kappa()
    c1 = acb(1, -k)/2; c2 = acb(1, k)/2
    f = c1*_char(5, 2).l(s) + c2*_char(5, 3).l(s)
    return (arb(5)/arb.pi())**(s/2)*((s + 1)/2).gamma()*f


def make_lambda(key):
    """Lambda_F as a function of s (acb). Keys: zeta, chi-4, chi5, DH, E_b=<b>, NR(q,c), liou, uni=<t>, plant(g,delta)."""
    if key == 'zeta': return xi
    if key == 'chi-4': return lam_chi(4, 3, 1)
    if key == 'chi5': return lam_chi(5, 4, 0)
    if key == 'chi-3': return lam_chi(3, 2, 1)
    if key == 'DH': return lam_dh
    if key.startswith('E_b='):
        b = arb(key[4:])
        return lambda s: xi(acb(s) + b)*xi(acb(s) - b)
    if key.startswith('NR('):
        q, c = key[3:-1].split(','); l = arb(int(q)).log(); c = arb(c)
        return lambda s: xi(s)*(((acb(s) - arb(0.5))*l).exp() + ((arb(0.5) - acb(s))*l).exp() + c)
    if key == 'liou':
        # sign-twisted primes: sum lambda(n) n^-s = zeta(2s)/zeta(s); no functional equation, gamma factor omitted
        return lambda s: (2*acb(s)).zeta()/acb(s).zeta()
    if key.startswith('uni='):
        t = arb(key[4:])
        return lambda s: xi(acb(s) + acb(0, 1)*t)
    raise KeyError(key)


def make_theta(key, a):
    """Theta_{F,a}(z).  Extra keys: 'zeta+plant(g,delta)', 'chi-4+plant(..)', 'heat<tau>' (quadrature), 'zeta~twin(g,W)'."""
    a = arb(a)
    if '+plant(' in key:
        base, rest = key.split('+plant(')
        g, d = rest[:-1].split(','); g = arb(g); d = arb(d)
        th0 = make_theta(base, a)
        lams = [acb(d, g), acb(-d, g), acb(d, -g), acb(-d, -g)]

        def f(z):
            z = acb(z); v = th0(z)
            for l in lams:
                v = v*(z - a - l)/(z + a - l)
            return v
        return f
    if key.startswith('heat'):
        tau = float(key[4:])
        X = heat_xi(tau)
        mi2 = acb(0, -2)
        return lambda z: X(mi2*(acb(z) - a))/X(mi2*(acb(z) + a))
    L = make_lambda(key)
    h = arb(0.5)
    return lambda z: L(h + acb(z) - a)/L(h + acb(z) + a)


def twin_factor(a, old, new):
    """multiplies Theta by the factor that moves on-line zeros i*old[k] to i*new[k] (and nothing else)."""
    a = arb(a)

    def f(z):
        z = acb(z); v = acb(1)
        for go, gn in zip(old, new):
            lo = acb(0, go); ln = acb(0, gn)
            v = v*((z - a - ln)*(z + a - lo))/((z + a - ln)*(z - a - lo))
        return v
    return f


_HEAT = {}


def heat_xi(tau, npp=None):
    """Xi_tau(w) = 2 int_0^1.5 e^{tau u^2} Phi(u) cos(w u) du, complex w (quadrature; truncation not enclosed)."""
    key = (tau, ctx.prec, npp)
    if key not in _HEAT:
        T, W, K = slib.table('heat%g' % tau, npp=npp)
        _HEAT[key] = (T, [w*k for w, k in zip(W, K)])
    T, WK = _HEAT[key]

    def f(w):
        w = acb(w); s = acb(0)
        for t, wk in zip(T, WK):
            s += wk*(w*t).cos()
        return 2*s
    return f


# ---------------------------------------------------------------- Gram matrices and inertia
def schur_gram(th, Z):
    """K(z_j, z_k) for nodes Z (acb, Re > 0); th = list of Theta(z_j)."""
    n = len(Z)
    tp = 2*arb.pi()
    M = [[None]*n for _ in range(n)]
    for j in range(n):
        for k in range(j, n):
            v = (1 - th[j]*th[k].conjugate())/(tp*(Z[j] + Z[k].conjugate()))
            M[j][k] = v
            M[k][j] = v.conjugate()
    return M


def inertia(M, want_pivots=False):
    """signs of the pivots of the Hermitian matrix M (list of lists of acb) without pivoting.
    Returns (npos, nneg, nundecided[, pivots]); the count of negative pivots is the negative index when every
    leading minor is nonzero (ball-decided).  Stops at the first undecided pivot (returns nund = remaining)."""
    n = len(M)
    A = [row[:] for row in M]
    npos = nneg = 0; piv = []
    for k in range(n):
        d = A[k][k].real
        piv.append(d)
        if d > 0: npos += 1
        elif d < 0: nneg += 1
        else:
            return (npos, nneg, n - k) + ((piv,) if want_pivots else ())
        rk = A[k]
        for i in range(k + 1, n):
            f = A[i][k]/d
            ri = A[i]
            for j in range(i, n):
                ri[j] = ri[j] - f*rk[j]
            for j in range(k + 1, i):
                pass
        for i in range(k + 1, n):
            for j in range(i + 1, n):
                A[j][i] = A[i][j].conjugate()
    return (npos, nneg, 0) + ((piv,) if want_pivots else ())


def first_neg(M):
    """least k such that the leading k x k block has a negative pivot (0 if none); -k if the k-th pivot is undecided.
    Works on the upper triangle only (Hermitian elimination)."""
    n = len(M)
    A = [row[:] for row in M]
    for k in range(n):
        d = A[k][k].real
        if d < 0: return k + 1
        if not (d > 0): return -(k + 1)
        rk = A[k]
        for i in range(k + 1, n):
            f = rk[i].conjugate()/d
            ri = A[i]
            for j in range(i, n):
                ri[j] = ri[j] - f*rk[j]
    return 0


def nsmooth(t):
    """smooth zero count theta(t)/pi + 1 for zeta (arb)."""
    t = arb(t)
    th = (acb(0.25, t/2).lgamma()).imag - t/2*arb.pi().log()
    return th/arb.pi() + 1


def smooth_ordinate(k, t0):
    """solve nsmooth(t) = k - 1/2 by Newton from t0 (float start); returns arb midpoint ball."""
    t = arb(t0)
    for _ in range(60):
        f = nsmooth(t) - (arb(k) - arb(0.5))
        d = (t/(2*arb.pi())).log()/(2*arb.pi())
        t2 = arb((t - f/d).mid())
        if abs(float(t2 - t)) < 2.0**(-ctx.prec + 20)*max(1.0, float(t)):
            return t2
        t = t2
    return t


def nzeta(t):
    """Riemann-von Mangoldt main term (t/2pi) log(t/2 pi e) + 7/8 as a float."""
    return t/(2*math.pi)*math.log(t/(2*math.pi*math.e)) + 0.875


def workers():
    return int(os.environ.get('RH_WORKERS', '4'))


def fl(x):
    return float(x)


def l10(x):
    return slib.log10abs(x if isinstance(x, arb) else abs(x))
