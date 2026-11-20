"""s4-cmv-li-krein-string-reach: shared ball-arithmetic code (python-flint).
Objects F(w) = completed function at s = 1/2 + w.  Definitions of DH, EA, TNR re-typed from
push/s3-lacunary-pick-ghost-index/lib.py and push/c12-control-battery-harness (read as text).
All series are arb_series in t with s = 1/2 + a + t, a real."""
import math
from flint import arb, acb, ctx, arb_series, acb_series, fmpq


def kappa():
    return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)


def _powc(base, s):
    return (s * arb(base).log()).exp()


def xi_series(s):            # s(s-1) pi^(-s/2) Gamma(s/2) zeta(s)
    s0 = s.coeffs()[0]
    if float(s0.mid()) < 0.25: return xi_series(1 - s)       # functional equation xi(s) = xi(1-s)
    if abs(float(s0.mid()) - 1.0) < 1e-12:       # at the pole: (s-1) zeta(s) = 1 + (s-1)(zeta(s) - 1/(s-1))
        return s * _powc(arb.pi(), -s / 2) * (s / 2).gamma() * (1 + (s - 1) * s.zeta(1, True))
    return s * (s - 1) * _powc(arb.pi(), -s / 2) * (s / 2).gamma() * s.zeta()


def gam0(s):                 # pi^(-s/2) Gamma(s/2)
    return _powc(arb.pi(), -s / 2) * (s / 2).gamma()


def per_series(s, q, cf, par):
    tot = None
    for r, c in enumerate(cf, start=1):
        if c is None: continue
        t = s.zeta(arb(r) / q) * c
        tot = t if tot is None else tot + t
    return _powc(arb(q) / arb.pi(), s / 2) * ((s + par) / 2).gamma() * tot * _powc(q, -s)


def completed(code, s):
    """completed function of object `code` at the series s"""
    if code == 'ZETA': return xi_series(s)
    if code == 'DH': return per_series(s, 5, (arb(1), kappa(), -kappa(), arb(-1), None), 1)
    if code == 'LCHI4': return per_series(s, 4, (arb(1), None, arb(-1), None), 1)
    if code == 'LCHI5': return per_series(s, 5, (arb(1), arb(-1), arb(-1), arb(1), None), 0)
    if code == 'LCHI3': return per_series(s, 3, (arb(1), arb(-1), None), 1)
    if code.startswith('EA-'):
        n, d = code[3:].split('/'); a = arb(int(n)) / int(d)
        return xi_series(s + a) * xi_series(s - a)
    if code == 'TNR':
        c = arb('2.2')
        return _powc(3, s) * xi_series(s) * (1 + c * _powc(3, arb(1) / 2 - s) + _powc(3, 1 - 2 * s))
    if code == 'LIOU':       # sign twist eps(p) = -1: zeta(2s)/zeta(s), zeta's gamma factor, no polar factor
        return gam0(s) * (2 * s).zeta() / s.zeta()
    if code == 'LIOUX':      # same with the xi factor s(s-1)
        return s * (s - 1) * gam0(s) * (2 * s).zeta() / s.zeta()
    raise KeyError(code)


def taylor_F(code, a, n):
    """coefficients f_0..f_{n-1} of F(a + t) (list of arb). HEAT<tau> via exp((tau/4) D^2) on zeta's coefficients."""
    if code.startswith('HEAT'):
        tau = arb(code[4:]); c = tau / 4
        # f^tau_k = sum_j c^j (k+2j)!/(j! k!) f_{k+2j}; J chosen so that the last terms are below 2^-prec relative
        J = int(ctx.prec / 8) + 60
        # zeta's Taylor balls lose about 4 to 7 bits per order: compute them at a raised working precision
        p0 = ctx.prec
        ctx.prec = p0 + 8 * (n + 2 * J + 2) + 200
        f = [x.mid() for x in taylor_F('ZETA', a, n + 2 * J + 2)]
        ctx.prec = p0
        out = []
        tails = []
        for k in range(n):
            tot = arb(0); term_coef = arb(1)   # c^j (k+2j)!/(j! k!)
            last = None
            for j in range(J + 1):
                tm = term_coef * f[k + 2 * j]
                tot += tm; last = tm
                term_coef = term_coef * c * (k + 2 * j + 1) * (k + 2 * j + 2) / (j + 1)
            out.append(tot)
            if k in (0, n - 1): tails.append((k, _l2(last) - _l2(tot)))
        taylor_F.heat_tail = tails
        return out
    ctx.cap = max(ctx.cap, n + 2)
    x = arb_series([arb(1) / 2 + arb(a), 1], prec=n)
    F = completed(code, x)
    co = F.coeffs()
    co = list(co) + [arb(0)] * (n - len(co))
    return co[:n]


def _l2(x):
    m = abs(x.mid())
    if m == 0: return -1e18
    return float(m.log().mid()) / math.log(2)


def logder_series(code, a, n, fcoef=None):
    """arb_series (length n) of L(a + t) = F'/F"""
    ctx.cap = max(ctx.cap, n + 2)
    f = fcoef if fcoef is not None else taylor_F(code, a, n + 1)
    F = arb_series(f, prec=n + 1)
    return F.derivative() / arb_series(f[:n], prec=n)


def moments_from_L(Lser, a, n):
    """Phi(z) = 4a L(a(1+z)/(1-z)) = c_0 + 2 sum c_k z^k; returns c_0..c_{n-1} (arb).
    Direct sum: [z^k] (2a z/(1-z))^j = (2a)^j C(k-1, j-1); each c_k is one dot product (no ball wrapping)."""
    from flint import fmpz
    a = arb(a)
    l = list(Lser.coeffs()); l += [arb(0)] * (n - len(l))
    u = [l[j] * (2 * a) ** j for j in range(n)]          # u_j = l_j (2a)^j
    out = [4 * a * l[0]]
    row = [fmpz(1)]                                       # C(k-1, i), i = 0..k-1
    for k in range(1, n):
        acc = arb(0)
        for i in range(k):
            acc += u[i + 1] * row[i]
        out.append(2 * a * acc)
        nr = [fmpz(1)] * (k + 1)
        for i in range(1, k):
            nr[i] = row[i - 1] + row[i]
        row = nr
    return out


def moments(code, a, n):
    return moments_from_L(logder_series(code, a, n), a, n)


def zero_moment(w_re, w_im, a, n):
    """c_k contribution (k = 0..n-1) of the conjugate pair of zeros w, conj w (w = w_re + i w_im, acb arithmetic):
    c_k = 2 Re[4a^2/(a^2 - w^2) eta^-k], eta = (w-a)/(w+a), k >= 1; c_0 = 2 Re[4a/(a - w)]."""
    a = arb(a); w = acb(w_re, w_im)
    eta_inv = (w + a) / (w - a)
    m = 4 * a * a / (a * a - w * w)
    out = [2 * (4 * a / (a - w)).real]
    p = acb(1)
    for k in range(1, n):
        p = p * eta_inv
        out.append(2 * (m * p).real)
    return out


def levinson(c, stop=True, progress=None, track=None, mid=True, nmax=None):
    """Levinson-Durbin on the real Toeplitz matrix [c_|i-j|]. Returns list of (n, k_n, E_n), E_0 = c_0; the section of
    size n+1 is positive definite iff E_0..E_n > 0 (equivalently |k_1|..|k_n| < 1).
    mid=True: midpoint arithmetic (radii dropped after every step; results are MEASURED, to be confirmed at a second precision).
    track(n, k_n, E_n) is called after each step. Stops at the first n with E_n not > 0 (if stop)."""
    N = len(c) if nmax is None else min(len(c), nmax)
    M = (lambda x: x.mid()) if mid else (lambda x: x)
    c = [M(x) for x in c]
    a = [arb(1)]
    E = c[0]
    out = [(0, arb(0), E)]
    if track: track(0, arb(0), E)
    for n in range(1, N):
        acc = arb(0)
        for j in range(n):
            acc += a[j] * c[n - j]
        k = M(-acc / E)
        new = [M(a[j] + k * a[n - j]) for j in range(1, n)]
        a = [arb(1)] + new + [k]
        E = M(E * (1 - k * k))
        out.append((n, k, E))
        if progress and n % progress == 0:
            print('   n', n, 'log2 E', round(_l2(E), 1), 'k', float(k.mid()), flush=True)
        if stop and not (E > 0): break
        if track: track(n, k, E)
    return out


def _l2r(x):
    r = x.rad()
    if r == 0: return -1e18
    return float(arb(r).log().mid()) / math.log(2)


def sign(x):
    if x > 0: return 1
    if x < 0: return -1
    return 0
