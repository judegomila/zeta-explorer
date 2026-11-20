"""lylib: finite-stage objects for L-function-like inputs and certified real-rootedness tests.

Normalisation.  s = 1/2 + i z.  For an input F with completed function Lam_F(s) = Lam_F(1-s),
the reference entire function is X_F(z) = Lam_F(1/2 + i z); it is even and real on the real z-axis,
and "Lee-Yang property" means: all zeros of the object in the z-plane are real.

Inputs (strings):
  zeta          a_n = 1, gamma factor G(s) = (s(s-1)/2) pi^{-s/2} Gamma(s/2)
  dh            Davenport-Heilbronn: a_n periodic mod 5 = (1, k, -k, -1, 0), G(s) = (5/pi)^{s/2} Gamma((s+1)/2)
  tw2m          completely multiplicative sign twist eps_2 = -1 (others +1); zeta gamma factor (no FE)
  tw2h          completely multiplicative twist eps_2 = 1/2 (0 <= eps <= 1); zeta gamma factor (no FE)
  liou          eps_p = -1 for all p (Liouville); zeta gamma factor (no FE)
  ea:<a>        zeta(s+a) zeta(s-a): a_n = sum_{d|n} d^a (n/d)^{-a}, G(s) = Gz(s+a) Gz(s-a)
  nr:<q>:<c>    T-NR twin xi(s) (2 cosh((s-1/2) log q) + c)            (Taylor-coefficient schemes only)
  heat:<lam>    zeta kernel multiplied by exp(lam u^2) (lam < 0: backward heat; de Bruijn-Newman time = 4 lam)

Schemes (univariate objects; see make_object):
  afe      G(s) D_N(s) + G(1-s) D_N(1-s),  D_N = sum_{n<=N} w_n a_n n^{-s}   (weights: sharp | riesz1 | riesz2)
           = full-line Fourier transform of the N-term theta kernel, symmetrised by the functional equation
           = N-rung twin-ladder truncation plus its reflection
  euler    G(s) E_P(s) + G(1-s) E_P(1-s),  E_P = prod_{p<=P} local factor
  thalf    2 int_0^oo Phi_N(u) cos(zu) du, Phi_N = N-term theta kernel (closed form: incomplete gamma)
  polya    Polya-Hejhal cosh-symmetrised N-term kernel (closed form: K-Bessel)
  dbn      2 int_0^oo exp(lam u^2) Phi_N(u) cos(zu) du (certified quadrature)
Jensen polynomials are handled by jensen_coeffs / sturm_real_roots.  Bohr lifts are in bohr.py.

All ball arithmetic is python-flint (Arb).  Verdicts PASS / FAIL returned by lee_yang_window and
jensen_test are certified (interval arithmetic); UNRESOLVED means the certificate was not obtained.
"""
import math, cmath
from flint import arb, acb, arb_poly, arb_series, acb_series, ctx, fmpz


class Unresolved(Exception):
    pass


# ----------------------------------------------------------------------------- inputs
def _factor(n):
    f, p = {}, 2
    while p * p <= n:
        while n % p == 0:
            f[p] = f.get(p, 0) + 1
            n //= p
        p += 1
    if n > 1:
        f[n] = f.get(n, 0) + 1
    return f


def primes_upto(P):
    return [p for p in range(2, P + 1) if all(p % q for q in range(2, int(p ** 0.5) + 1))]


def kappa_dh():
    s5 = arb(5).sqrt()
    return ((10 - 2 * s5).sqrt() - 2) / (s5 - 1)


def gtype(inp):
    k = inp.split(':')[0]
    return {'dh': 'd', 'ea': 'ea'}.get(k, 'z')


def ea_shift(inp):
    return arb(inp.split(':')[1])


def coef(inp, n):
    """Dirichlet coefficient a_n as an arb."""
    k = inp.split(':')[0]
    if k in ('zeta', 'heat'):
        return arb(1)
    if k == 'dh':
        kp = kappa_dh()
        return [arb(0), arb(1), kp, -kp, arb(-1)][n % 5]
    f = _factor(n)
    if k == 'tw2m':
        return arb((-1) ** f.get(2, 0))
    if k == 'tw2h':
        return arb(1) / (2 ** f.get(2, 0))
    if k == 'liou':
        return arb((-1) ** sum(f.values()))
    if k == 'ea':
        a = ea_shift(inp)
        tot = arb(0)
        for d in range(1, n + 1):
            if n % d == 0:
                tot += (a * (arb(d).log() - arb(n // d).log())).exp()
        return tot
    raise ValueError('no Dirichlet coefficients for input ' + inp)


def eps_p(inp, p):
    """Local parameter of a completely multiplicative input."""
    k = inp.split(':')[0]
    if k == 'zeta':
        return arb(1)
    if k == 'tw2m':
        return arb(-1 if p == 2 else 1)
    if k == 'tw2h':
        return arb(1) / 2 if p == 2 else arb(1)
    if k == 'liou':
        return arb(-1)
    raise ValueError('no Euler product for input ' + inp)


def Gz(s):
    return s * (s - 1) / 2 * (-(s / 2) * arb.pi().log()).exp() * (s / 2).gamma()


def Gfac(inp, s):
    t = gtype(inp)
    if t == 'z':
        return Gz(s)
    if t == 'd':
        return ((s / 2) * (arb(5) / arb.pi()).log()).exp() * ((s + 1) / 2).gamma()
    a = ea_shift(inp)
    return Gz(s + a) * Gz(s - a)


def weights(kind, N):
    if kind == 'sharp':
        return [arb(1)] * (N + 1)
    kk = {'riesz1': 1, 'riesz2': 2}[kind]
    LN = arb(N + 1).log()
    return [arb(0)] + [(1 - arb(n).log() / LN) ** kk for n in range(1, N + 1)]


# ----------------------------------------------------------------------------- objects
def make_object(scheme, inp, size, opt=None):
    """Return (F, Ymax, note): F maps an acb z (possibly a wide ball) to an acb enclosure of the object.
    Ymax bounds the |Im z| in which F is known to be pole-free."""
    opt = opt or {}
    half = arb(1) / 2
    I = acb(0, 1)
    gt = gtype(inp)
    if scheme == 'afe':
        N = size
        w = weights(opt.get('weight', 'sharp'), N)
        terms = [(arb(n).log(), w[n] * coef(inp, n)) for n in range(1, N + 1)]
        terms = [(L, c) for (L, c) in terms if not (c.is_zero())]

        def A(s):
            D = acb(0)
            for L, c in terms:
                D += c * (-s * L).exp()
            return Gfac(inp, s) * D

        def F(z):
            s = half + I * z
            return A(s) + A(1 - s)
        return F, {'z': 1.9, 'd': 1.4, 'ea': 1.9}[gt], ''
    if scheme == 'euler':
        ps = primes_upto(size)
        if gt == 'd':
            raise ValueError('not formulable: dh has no Euler product')
        if gt == 'ea':
            a = ea_shift(inp)
            loc = [(arb(p).log(), None) for p in ps]

            def E(s):
                r = acb(1)
                for L, _ in loc:
                    r *= (1 - (-(s - a) * L).exp()) * (1 - (-(s + a) * L).exp())
                return 1 / r
            ymax = 0.45 - float(a.mid()) if float(a.mid()) < 0.4 else 0.02
        else:
            loc = [(arb(p).log(), eps_p(inp, p)) for p in ps]

            def E(s):
                r = acb(1)
                for L, e in loc:
                    r *= (1 - e * (-s * L).exp())
                return 1 / r
            ymax = 0.45

        def F(z):
            s = half + I * z
            return Gfac(inp, s) * E(s) + Gfac(inp, 1 - s) * E(1 - s)
        return F, ymax, 'poles on Re s = 0, 1 (reflected Euler factors): window restricted to the open strip'
    if scheme == 'thalf':
        N = size
        if gt == 'ea':
            raise ValueError('not formulable: no single theta kernel in this library for ea')
        pi = arb.pi()
        if gt == 'z':
            terms = [(coef(inp, n), arb(n).log(), acb(pi * n * n)) for n in range(1, N + 1)]
            lp = pi.log()

            def g(s, L, x):
                return (-(s / 2) * lp - s * L).exp() * (2 * x.gamma_upper(s / 2 + 2) - 3 * x.gamma_upper(s / 2 + 1))
        else:
            terms = [(coef(inp, n) * n, (pi * n * n / 5).log(), acb(pi * n * n / 5)) for n in range(1, N + 1)]

            def g(s, L, x):
                return (-((s + 1) / 2) * L).exp() * x.gamma_upper((s + 1) / 2)
        terms = [t for t in terms if not t[0].is_zero()]

        def F(z):
            s = half + I * z
            r = acb(0)
            for c, L, x in terms:
                r += c * (g(s, L, x) + g(1 - s, L, x))
            return r
        return F, 4.0, 'entire'
    if scheme == 'polya':
        N = size
        if gt == 'ea':
            raise ValueError('not formulable: no single theta kernel in this library for ea')
        pi = arb.pi()
        if gt == 'z':
            terms = [(coef(inp, n), n, acb(2 * pi * n * n)) for n in range(1, N + 1)]

            def F(z):
                r = acb(0)
                h = I * z / 2
                for c, n, x in terms:
                    if c.is_zero():
                        continue
                    r += c * (2 * pi * pi * n ** 4 * (x.bessel_k(arb(9) / 4 + h) + x.bessel_k(arb(9) / 4 - h))
                              - 3 * pi * n * n * (x.bessel_k(arb(5) / 4 + h) + x.bessel_k(arb(5) / 4 - h)))
                return r
        else:
            terms = [(coef(inp, n) * n, n, acb(2 * pi * n * n / 5)) for n in range(1, N + 1)]

            def F(z):
                r = acb(0)
                h = I * z / 2
                for c, n, x in terms:
                    if c.is_zero():
                        continue
                    r += c * (x.bessel_k(arb(3) / 4 + h) + x.bessel_k(arb(3) / 4 - h))
                return r
        return F, 4.0, 'entire'
    if scheme == 'dbn':
        N = size
        lam = arb(opt.get('lam', '0'))
        if gt == 'ea':
            raise ValueError('not formulable: no single theta kernel in this library for ea')
        pi = arb.pi()
        cs = [(coef(inp, n), n) for n in range(1, N + 1)]
        cs = [(c, n) for c, n in cs if not c.is_zero()]
        U = 3
        if float(lam.mid()) > 1:
            raise ValueError('dbn: lam > 1 not supported by the tail bound')
        # tail bound: for u >= 3, lam <= 1, |Im z| <= 4:  integrand <= 80 N^5 exp(-pi e^{2u}/10 ... ) e^{-u}
        tail = arb(80 * N ** 5) * (-(pi * arb(6).exp()) / 10).exp()

        def kern(u):
            e2 = (2 * u).exp()
            r = acb(0)
            if gt == 'z':
                e52, e92 = (u * 5 / 2).exp(), (u * 9 / 2).exp()
                for c, n in cs:
                    r += c * (4 * pi * pi * n ** 4 * e92 - 6 * pi * n * n * e52) * (-pi * n * n * e2).exp()
            else:
                e32 = (u * 3 / 2).exp()
                for c, n in cs:
                    r += c * 2 * n * e32 * (-pi * n * n / 5 * e2).exp()
            return r

        def F(z):
            p = ctx.prec
            val = acb.integral(lambda u, _: (lam * u * u).exp() * kern(u) * 2 * (z * u).cos(), 0, U,
                               rel_tol=arb(2) ** (-p + 10), abs_tol=arb(2) ** (-4 * p))
            return val + acb(arb(0, 1) * tail, arb(0, 1) * tail)
        return F, 4.0, 'entire; certified quadrature on [0,3] plus explicit tail radius'
    raise ValueError('unknown scheme ' + scheme)


# ----------------------------------------------------------------------------- certified winding
def _ball(za, zb):
    mr, mi = (za.real + zb.real) / 2, (za.imag + zb.imag) / 2
    rr = abs(zb.real - za.real) / 2 * (1 + 1e-12) + 1e-15 * (1 + abs(mr))
    ri = abs(zb.imag - za.imag) / 2 * (1 + 1e-12) + 1e-15 * (1 + abs(mi))
    return acb(arb(mr, rr), arb(mi, ri))


def _pt(F, z, cache):
    v = cache.get(z)
    if v is None:
        w = F(acb(z.real, z.imag))
        if w.contains(0) or not w.is_finite():
            raise Unresolved('point enclosure contains 0 at %r' % (z,))
        v = complex(w)
        if v == 0:
            sc = max(abs(w.real), abs(w.imag))
            w = w / sc.mid()
            v = complex(w)
        else:
            v = v / abs(v) if (abs(v) < 1e-280 or abs(v) > 1e280) else v
        cache[z] = v
    return v


def _unit(F, z, cache):
    """Unit-modulus float approximation of F(z)/|F(z)| (robust to under/overflow)."""
    v = cache.get(z)
    if v is None:
        w = F(acb(z.real, z.imag))
        if w.contains(0) or not w.is_finite():
            raise Unresolved('point enclosure contains 0 at %r' % (z,))
        a = max(abs(w.real.mid()), abs(w.imag.mid()))
        w = w / a
        v = complex(w)
        v /= abs(v)
        cache[z] = v
    return v


def darg(F, za, zb, cache, stats, h0=0.05, minlen=1e-7):
    """Certified change of arg F along the straight segment za -> zb (python complex endpoints).
    Each accepted sub-segment has an Arb enclosure of F excluding 0, so the image lies in a half-plane
    and the increment equals the principal value of arg(F(end)/F(start))."""
    n0 = max(1, int(math.ceil(abs(zb - za) / h0)))
    pts = [za + (zb - za) * k / n0 for k in range(n0)] + [zb]
    stack = [(pts[k], pts[k + 1]) for k in range(n0 - 1, -1, -1)]
    tot = 0.0
    while stack:
        a, b = stack.pop()
        stats['box'] = stats.get('box', 0) + 1
        if stats['box'] > stats.get('budget', 10 ** 7):
            raise Unresolved('box budget exhausted')
        w = F(_ball(a, b))
        if w.is_finite() and not w.contains(0):
            tot += cmath.phase(_unit(F, b, cache) / _unit(F, a, cache))
        else:
            if abs(b - a) < minlen:
                raise Unresolved('zero on or within %g of the contour near %r' % (minlen, a))
            m = (a + b) / 2
            stack.append((m, b))
            stack.append((a, m))
    return tot


def _round_count(x):
    n = round(x)
    if abs(n - x) > 0.02:
        raise Unresolved('winding sum %r is not near an integer' % x)
    return int(n)


def sign_changes(F, T, h):
    """Certified lower bound for the number of real zeros in (0, T): strict sign changes of the real
    even function F on a grid of step h.  Returns (count, number of undecided grid points)."""
    n = int(math.floor(T / h))
    last, cnt, und = 0, 0, 0
    for k in range(0, n + 1):
        x = k * h if k < n else T
        v = F(acb(x)).real
        sg = 1 if v > 0 else (-1 if v < 0 else 0)
        if sg == 0:
            und += 1
            continue
        if last and sg != last:
            cnt += 1
        last = sg
    return cnt, und


def lee_yang_window(F, T, Y, eta=0.02, h=0.05, budget=2_000_000, locate=True):
    """Certified test of the Lee-Yang property in the window |Re z| <= T, |Im z| <= Y for an even
    function F, real on the real axis and analytic on the closed window.
      n_up   = zeros with eta < Im z < Y, |Re z| < T         (argument principle, half contour x 2)
      n_tot  = zeros in the full rectangle                    (argument principle, quarter contour x 4)
      n_real = certified sign changes on (0, T)               (lower bound for real zeros in (0, T))
    FAIL if n_up > 0.  PASS if n_up == 0 and n_tot == 2 n_real (then every zero in the window is real
    and simple).  Otherwise UNRESOLVED."""
    cache, stats = {}, {'budget': budget}
    out = {'T': T, 'Y': Y, 'eta': eta}
    c = complex
    bottom = darg(F, c(0, eta), c(T, eta), cache, stats)
    right_hi = darg(F, c(T, eta), c(T, Y), cache, stats)
    top = darg(F, c(T, Y), c(0, Y), cache, stats)
    n_up = _round_count(2 * (bottom + right_hi + top) / (2 * math.pi))
    out['n_up'] = n_up
    if n_up > 0:
        out['verdict'] = 'FAIL'
        if locate:
            lo, hi = 0.0, T
            for _ in range(7):
                mid = (lo + hi) / 2
                try:
                    b = darg(F, c(0, eta), c(mid, eta), cache, stats)
                    r = darg(F, c(mid, eta), c(mid, Y), cache, stats)
                    t = darg(F, c(mid, Y), c(0, Y), cache, stats)
                    k = _round_count(2 * (b + r + t) / (2 * math.pi))
                except Unresolved:
                    break
                if k > 0:
                    hi = mid
                else:
                    lo = mid
            out['lowest_offaxis_re_in'] = [lo, hi]
        out['boxes'] = stats.get('box', 0)
        return out
    right_lo = darg(F, c(T, 0), c(T, eta), cache, stats)
    n_tot = _round_count(4 * (right_lo + right_hi + top) / (2 * math.pi))
    out['n_tot'] = n_tot
    n_real = 0
    for hh in (h, h / 8):
        n_real, und = sign_changes(F, T, hh)
        out['n_real'], out['undecided_pts'] = n_real, und
        if 2 * n_real == n_tot:
            break
    out['verdict'] = 'PASS' if 2 * n_real == n_tot else 'UNRESOLVED'
    if out['verdict'] == 'UNRESOLVED':
        out['why'] = 'n_tot != 2 n_real with no zero above eta: zeros within eta of the axis not separated'
    out['boxes'] = stats.get('box', 0)
    return out


# ----------------------------------------------------------------------------- Taylor coefficients, Jensen
def _xi_series(shift=None):
    s = arb_series([arb(1) / 2 + (shift if shift is not None else 0), 1])
    return s * (s - 1) / 2 * (-(s / 2) * arb.pi().log()).exp() * (s / 2).gamma() * s.zeta()


def taylor_even(inp, K):
    """Arb enclosures of c_0, c_2, ..., c_{2K} with Lam_F(1/2 + x) = sum c_j x^j  (c_odd = 0 by the FE).
    With w = -z^2:  X_F(z) = sum_k c_{2k} w^k."""
    k = inp.split(':')[0]
    order = 2 * K + 2
    old = ctx.cap
    ctx.cap = order
    try:
        if k == 'zeta':
            ser = _xi_series()
        elif k == 'ea':
            a = ea_shift(inp)
            ser = _xi_series(a) * _xi_series(-a)
        elif k == 'nr':
            q, c = arb(inp.split(':')[1]), arb(inp.split(':')[2])
            x = arb_series([0, q.log()])
            ser = _xi_series() * (x.exp() + (-x).exp() + c)
        elif k == 'dh':
            s = arb_series([arb(1) / 2, 1])
            kp = kappa_dh()
            f = s.zeta(arb(1) / 5) + kp * s.zeta(arb(2) / 5) - kp * s.zeta(arb(3) / 5) - s.zeta(arb(4) / 5)
            f = f * (-s * arb(5).log()).exp()
            ser = ((s / 2) * (arb(5) / arb.pi()).log()).exp() * ((s + 1) / 2).gamma() * f
        elif k == 'heat':
            lam = arb(inp.split(':')[1])
            return _heat_coeffs(lam, K)
        else:
            raise ValueError('not formulable: no functional equation / Taylor data for input ' + inp)
        cs = [ser[2 * j] for j in range(K + 1)]
        odd_ok = all(ser[2 * j + 1].contains(0) for j in range(K))
        if not odd_ok:
            raise Unresolved('odd Taylor coefficient excludes 0: functional equation check failed')
        return cs
    finally:
        ctx.cap = old


def _heat_coeffs(lam, K):
    """Even Taylor coefficients of the zeta kernel times exp(lam u^2):
       c'_{2m} (2m)! = sum_j lam^j/j! c_{2(m+j)} (2(m+j))!     (moments b'_m = sum_j lam^j/j! b_{m+j}).
    The j-sum is cut at J; the tail is enclosed using b_k <= 1.72 Gamma(k+1/2) (2 pi)^{-k-1/2}
    (from Phi(u) <= 1.72 exp(-2 pi u^2) on u >= 0), which needs |lam| < 2 pi."""
    al = abs(float(lam.mid())) + float(lam.rad())
    if al >= 3.0:
        raise ValueError('heat: |lam| >= 3 not supported by the tail bound')
    prec = ctx.prec
    J = int(prec * math.log(2) / math.log(2 * math.pi / max(al, 1e-9))) + int(K * al / (5 - al)) + 20
    # the factorial weights (2k)! amplify the series enclosures: raise the working precision accordingly
    ctx.prec = prec + int(math.lgamma(2 * (K + J) + 3) / math.log(2)) + 64
    try:
        return _heat_inner(lam, K, J, al)
    finally:
        ctx.prec = prec


def _heat_inner(lam, K, J, al):
    ctx.cap = 2 * (K + J) + 2
    ser = _xi_series()
    b = []
    fac = arb(1)
    for k in range(K + J + 1):          # b_k = c_{2k} (2k)!
        if k > 0:
            fac *= (2 * k) * (2 * k - 1)
        b.append(ser[2 * k] * fac)
    out = []
    twopi = 2 * arb.pi()
    absl = abs(lam)
    lamp = [arb(1)]
    for j in range(1, J + 2):
        lamp.append(lamp[-1] * lam / j)             # lam^j / j!
    fac = arb(1)
    for m in range(K + 1):
        if m > 0:
            fac *= (2 * m) * (2 * m - 1)
        Jm = J
        sm = arb(0)
        for j in range(0, Jm + 1):
            sm += lamp[j] * b[m + j]
        # tail: first omitted term bound and geometric ratio
        k1 = m + Jm + 1
        B = arb('1.72') * (arb(k1) + arb(1) / 2).gamma() / twopi ** k1 / twopi.sqrt()
        t1 = abs(lamp[Jm + 1]) * B
        r = absl / twopi * max(1.0, (m + Jm + 2.5) / (Jm + 2))
        if not (r < arb('0.9')):
            raise Unresolved('heat tail ratio not < 0.9; increase J')
        tail = t1 / (1 - r)
        sm += arb(0, 1) * tail
        out.append(sm / fac)
    return out


def jensen_coeffs(cs, d, n):
    """Coefficients (ascending) of J^{d,n}(X) = sum_j C(d,j) gamma(n+j) X^j, gamma(k) = k! c_{2k}."""
    out = []
    g = arb(1)
    for k in range(1, n + 1):
        g *= k
    binom = fmpz(1)
    for j in range(d + 1):
        out.append(cs[n + j] * g * arb(binom))
        g *= (n + j + 1)
        binom = binom * (d - j) // (j + 1)
    return out


def sturm_real_roots(coeffs):
    """Number of distinct real roots of the real polynomial with Arb coefficients (ascending), by a
    Sturm chain in ball arithmetic.  Every sign decision is certified; if a leading coefficient of the
    chain cannot be separated from 0, raises Unresolved (raise the precision and retry).
    Returns (count, chain_length)."""
    p0 = arb_poly(coeffs)
    d = p0.degree()
    if p0[d].contains(0):
        raise Unresolved('leading coefficient contains 0')
    p1 = p0.derivative()
    signs_pos, signs_neg = [], []

    def push(p):
        k = p.degree()
        lc = p[k]
        if lc > 0:
            sg = 1
        elif lc < 0:
            sg = -1
        else:
            raise Unresolved('Sturm leading coefficient not separated from 0 at degree %d' % k)
        signs_pos.append(sg)
        signs_neg.append(sg if k % 2 == 0 else -sg)
        return k

    push(p0)
    a, b = p0, p1
    while True:
        kb = push(b)
        if kb == 0:
            break
        r = -(a % b)
        # certified degree: every coefficient of r above its top separated coefficient must be exactly 0
        k = r.degree()
        if k < 0:
            raise Unresolved('zero remainder: repeated root (gcd of degree %d)' % kb)
        if k != kb - 1 or not (r[k] != 0):
            raise Unresolved('irregular or undecided Sturm step at degree %d' % kb)
        sc = abs(r[k]).mid()
        a, b = b, r * (1 / arb(sc))
    var = lambda s: sum(1 for i in range(len(s) - 1) if s[i] != s[i + 1])
    return var(signs_neg) - var(signs_pos), len(signs_pos)


def jensen_test(inp, d, n, cs=None, prec0=None, prec_max=1 << 20):
    """Certified hyperbolicity test of J^{d,n}.  Returns dict with real_roots, verdict, prec."""
    prec = prec0 or max(128, 12 * d + 64)
    while True:
        ctx.prec = prec
        try:
            c = cs if (cs is not None and cs[0] == prec) else (prec, taylor_even(inp, d + n))
            cnt, _ = sturm_real_roots(jensen_coeffs(c[1], d, n))
            return {'real_roots': cnt, 'degree': d, 'shift': n, 'prec': prec,
                    'verdict': 'PASS' if cnt == d else 'FAIL'}, c
        except Unresolved as e:
            cs = None
            if prec * 2 > prec_max:
                return {'degree': d, 'shift': n, 'prec': prec, 'verdict': 'UNRESOLVED', 'why': str(e)}, None
            prec *= 2
