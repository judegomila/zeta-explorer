"""bl: Bohr lifts of finite Dirichlet objects; float64 stage (cupy if available, else numpy).
Float64 output is a screen, never a verdict (BRIEF rule).  Exact stage: exact.py (python-flint).

Notation.  s = 1/2 + x + it.  Lift: p^{-it} -> e^{-i th_p} (th on the torus R^m / 2 pi Z^m), radius p^{-1/2-x}.
A "poly" is a generalised Dirichlet polynomial  D(x, th) = sum_j c_j exp(-(1/2+x) L_j - i V_j.th),
c_j real, L_j = log n_j, V_j = exponent vector of n_j.  Reflection (lift of D(1-s)): D~(x, th) = D(-x, -th).
Lifted completed object:  M = G(s) D(x, th) + G(1-s) D(-x, -th);  diagonal: th_p = t log p.
"""
import math, os, itertools
import numpy as np
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(os.environ.get('BL_GPU_GB', '24')) * 1024 ** 3)
    _ = cp.zeros(4).sum()
    xp, GPU = cp, True
except Exception as e:  # noqa
    xp, GPU = np, False

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
C1 = (1 - 1j * KAPPA) / 2
CHI5 = {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}


def to_np(a):
    return cp.asnumpy(a) if GPU and isinstance(a, cp.ndarray) else np.asarray(a)


def primes_upto(P):
    return [p for p in range(2, P + 1) if all(p % q for q in range(2, int(p ** 0.5) + 1))]


def factor(n):
    f, p = {}, 2
    while p * p <= n:
        while n % p == 0:
            f[p] = f.get(p, 0) + 1
            n //= p
        p += 1
    if n > 1:
        f[n] = f.get(n, 0) + 1
    return f


def coef(inp, n):
    k = inp.split(':')[0]
    if k == 'zeta':
        return 1.0
    if k == 'dh':
        return [0.0, 1.0, KAPPA, -KAPPA, -1.0][n % 5]
    f = factor(n)
    if k == 'tw2m':
        return float((-1) ** f.get(2, 0))
    if k == 'tw2h':
        return 0.5 ** f.get(2, 0)
    if k == 'liou':
        return float((-1) ** sum(f.values()))
    if k == 'ea':
        a = float(inp.split(':')[1])
        return sum((d / (n // d)) ** a for d in range(1, n + 1) if n % d == 0)
    raise ValueError(inp)


def weight(kind, N, n):
    if kind == 'sharp':
        return 1.0
    kk = {'riesz1': 1, 'riesz2': 2}[kind]
    return (1 - math.log(n) / math.log(N + 1)) ** kk


# ------------------------------------------------------------------ polys
def afe_poly(inp, N, P=None, wkind='sharp'):
    """sum_{n<=N, n P-smooth} w_n a_n n^{-s}; returns (c, L, V, primes)."""
    ps = primes_upto(N if P is None else min(P, N))
    c, L, V = [], [], []
    for n in range(1, N + 1):
        f = factor(n)
        if any(p not in ps for p in f):
            continue
        a = coef(inp, n) * weight(wkind, N, n)
        if a == 0.0:
            continue
        c.append(a); L.append(math.log(n)); V.append([f.get(p, 0) for p in ps])
    V = np.array(V, float).reshape(len(c), len(ps))
    keep = [j for j in range(len(ps)) if V[:, j].any()]
    return np.array(c), np.array(L), V[:, keep], [ps[j] for j in keep]


def _expand(factors, ps):
    """factors: list over primes of dict k -> coefficient of y_p^k.  Returns poly (c complex, L, V)."""
    c, L, V = [1.0 + 0j], [0.0], [[0] * len(ps)]
    for j, (p, fac) in enumerate(zip(ps, factors)):
        c2, L2, V2 = [], [], []
        for cc, ll, vv in zip(c, L, V):
            for k, a in fac.items():
                if a == 0:
                    continue
                v = list(vv); v[j] = k
                c2.append(cc * a); L2.append(ll + k * math.log(p)); V2.append(v)
        c, L, V = c2, L2, V2
    return np.array(c), np.array(L), np.array(V, float).reshape(len(c), len(ps))


def euler_poly(inp, P, K):
    """Euler-type lift as a poly.  K finite: prod_p sum_{k<=K} (eps_p y_p)^k.  K = 0 means K = infinity and the
    poly returned is the NUMERATOR over the common denominator (zeta/tw: numerator 1).
    dh: c1 prod_chi + c2 prod_chibar (real coefficients).  Returns (c, L, V, primes)."""
    k = inp.split(':')[0]
    ps = primes_upto(P)
    if k == 'dh':
        ps = [p for p in ps if p != 5]
        if K == 0:   # numerator: c1 prod (1 - chibar y) + c2 prod (1 - chi y)
            a = _expand([{0: 1, 1: -np.conj(CHI5[p % 5])} for p in ps], ps)
            b = _expand([{0: 1, 1: -CHI5[p % 5]} for p in ps], ps)
        else:
            a = _expand([{j: CHI5[p % 5] ** j for j in range(K + 1)} for p in ps], ps)
            b = _expand([{j: np.conj(CHI5[p % 5]) ** j for j in range(K + 1)} for p in ps], ps)
        c = C1 * a[0] + np.conj(C1) * b[0]
        assert np.max(np.abs(c.imag)) < 1e-12
        c = c.real
        keep = np.abs(c) > 1e-14
        return c[keep], a[1][keep], a[2][keep], ps
    if K == 0:
        raise ValueError('numerator is 1')
    eps = {'zeta': lambda p: 1.0, 'tw2m': lambda p: -1.0 if p == 2 else 1.0,
           'tw2h': lambda p: 0.5 if p == 2 else 1.0, 'liou': lambda p: -1.0}
    if k == 'ea':
        a = float(inp.split(':')[1])
        # truncation of 1/((1-p^a y)(1-p^-a y)) at degree K
        facs = [{j: sum(p ** (a * (2 * i - j)) for i in range(j + 1)) for j in range(K + 1)} for p in ps]
    else:
        facs = [{j: eps[k](p) ** j for j in range(K + 1)} for p in ps]
    c, L, V = _expand(facs, ps)
    return c.real, L, V, ps


def poly_eval(poly, x, th, chunk=None):
    """D(x, th) for batch: x (B,), th (B,m) -> complex (B,)."""
    c, L, V = (xp.asarray(a) for a in poly[:3])
    x = xp.asarray(x); th = xp.asarray(th)
    ph = th @ V.T
    return xp.sum(c[None, :] * xp.exp(-(0.5 + x[:, None]) * L[None, :] - 1j * ph), axis=1)


def poly_eval_jac(poly, x, th):
    """D, dD/dx (B,), dD/dth (B,m)."""
    c, L, V = (xp.asarray(a) for a in poly[:3])
    ph = th @ V.T
    T = c[None, :] * xp.exp(-(0.5 + x[:, None]) * L[None, :] - 1j * ph)
    return T.sum(1), -(T * L[None, :]).sum(1), -1j * (T @ V)


# ------------------------------------------------------------------ S1: zeros of D on the closed polydisc path
def s1_search(poly, B=20000, xmax=1.5, iters=400, seed=0, climb=True):
    """Search zeros of D(x, th), x >= 0.  Returns dict: min |D| over start cloud at x in [0,xmax],
    x_sup = largest x of a converged zero (None if none), witness (x, th), n_zero.
    Gauss-Newton on (x, th) with minimum-norm steps; then climbing along the zero set in +x."""
    rng = np.random.default_rng(seed)
    m = poly[2].shape[1]
    x = xp.asarray(rng.uniform(0, xmax, B)); th = xp.asarray(rng.uniform(0, 2 * math.pi, (B, m)))
    D0 = poly_eval(poly, x, th)
    out = {'min_abs_random': float(xp.min(xp.abs(D0))), 'B': B, 'm': m, 'terms': int(len(poly[0]))}
    # also torus-only random minimum (x=0)
    out['min_abs_random_torus'] = float(xp.min(xp.abs(poly_eval(poly, xp.zeros(B), th))))

    def gn(x, th, eta):
        D, Dx, Dth = poly_eval_jac(poly, x, th)
        J = xp.concatenate([Dx[:, None], Dth], axis=1)            # (B, m+1) complex
        Jr, Ji = J.real, J.imag
        a = (Jr * Jr).sum(1); b = (Jr * Ji).sum(1); d = (Ji * Ji).sum(1)
        mu = 1e-12 + 1e-9 * (a + d)
        det = (a + mu) * (d + mu) - b * b
        # null-space projected ascent direction for x
        ex_r, ex_i = Jr[:, 0], Ji[:, 0]
        l1 = ((d + mu) * ex_r - b * ex_i) / det; l2 = (-b * ex_r + (a + mu) * ex_i) / det
        g = -(l1[:, None] * Jr + l2[:, None] * Ji); g[:, 0] += 1.0
        r1, r2 = D.real, D.imag
        k1 = ((d + mu) * r1 - b * r2) / det; k2 = (-b * r1 + (a + mu) * r2) / det
        step = -(k1[:, None] * Jr + k2[:, None] * Ji)
        nrm = xp.sqrt((step * step).sum(1)); sc = xp.minimum(1.0, 0.5 / (nrm + 1e-300))
        u = step * sc[:, None] + eta * g
        return x + u[:, 0], th + u[:, 1:], xp.abs(D)
    for it in range(iters):
        eta = 0.0
        if climb and it > iters // 4:
            eta = 0.03 * (1 - (it - iters // 4) / (iters - iters // 4)) ** 2
        if it >= iters - 12:
            eta = 0.0
        x, th, aD = gn(x, th, eta)
    aD = xp.abs(poly_eval(poly, x, th))
    ok = (aD < 1e-11) & (x > -1e-9)
    out['n_zero_xge0'] = int(ok.sum())
    okall = aD < 1e-11
    out['n_zero_any_x'] = int(okall.sum())
    if int(okall.sum()):
        xs = xp.where(okall, x, -1e9); j = int(xp.argmax(xs))
        out['x_sup'] = float(x[j]); out['witness_th'] = [float(v) for v in to_np(th[j]) % (2 * math.pi)]
        out['witness_absD'] = float(aD[j])
    else:
        out['x_sup'] = None
    return out


# ------------------------------------------------------------------ diagonal / translated sections
def lgam(z):
    """complex log Gamma, Re z > -6 away from poles: shift by 8 then Stirling."""
    z = xp.asarray(z, dtype=xp.complex128)
    acc = xp.zeros_like(z)
    for k in range(8):
        acc = acc + xp.log(z + k)
    w = z + 8
    w2 = 1 / (w * w)
    ser = (1 / 12.0 - w2 * (1 / 360.0 - w2 * (1 / 1260.0 - w2 * (1 / 1680.0 - w2 / 1188.0)))) / w
    return (w - 0.5) * xp.log(w) - w + 0.5 * math.log(2 * math.pi) + ser - acc


def lG(inp, s):
    k = inp.split(':')[0]
    if k == 'dh':
        return lgam((s + 1) / 2) + (s / 2) * math.log(5 / math.pi)
    if k == 'ea':
        a = float(inp.split(':')[1])
        return (lgam((s + a) / 2) + lgam((s - a) / 2) - s * math.log(math.pi))
    return lgam(s / 2) - (s / 2) * math.log(math.pi)


class Obj:
    """Finite object.  scheme 'afe' (size N, optional P), 'euler' (size P, K; K=0 means infinity).
    phi: dict p -> angle; twist omega_p = exp(-i phi_p) (torus translate).  nr: (q, c) extra factor."""

    def __init__(self, inp, scheme, size, K=1, P=None, phi=None, wkind='sharp'):
        self.inp, self.scheme, self.size, self.K = inp, scheme, size, K
        self.kind = inp.split(':')[0]
        phi = phi or {}
        if scheme == 'afe':
            c, L, V, ps = afe_poly(inp, size, P, wkind)
            tw = np.array([sum(V[j, i] * phi.get(p, 0.0) for i, p in enumerate(ps)) for j in range(len(c))]) if phi else np.zeros(len(c))
            self.c = xp.asarray(c * np.exp(-1j * tw)); self.cr = xp.asarray(c * np.exp(1j * tw)); self.L = xp.asarray(L)
        else:
            self.ps = primes_upto(size)
            self.phi = [phi.get(p, 0.0) for p in self.ps]

    def _loc(self, y):
        if self.K == 0:
            return 1 / (1 - y)
        f = xp.ones_like(y); yy = xp.ones_like(y)
        for _ in range(self.K):
            yy = yy * y; f = f + yy
        return f

    def D(self, s, refl=False):
        """lift of the Dirichlet factor at complex s (twist conjugated when refl)."""
        if self.scheme == 'afe':
            c = self.cr if refl else self.c
            out = xp.zeros(s.shape, dtype=xp.complex128)
            for j in range(len(self.L)):
                out += c[j] * xp.exp(-s * self.L[j])
            return out
        k = self.kind
        sg = 1.0 if refl else -1.0
        if k == 'dh':
            a = xp.ones(s.shape, dtype=xp.complex128); b = xp.ones(s.shape, dtype=xp.complex128)
            for p, ph in zip(self.ps, self.phi):
                if p == 5:
                    continue
                y = xp.exp(-s * math.log(p) + sg * 1j * ph); ch = CHI5[p % 5]
                a *= self._loc(ch * y); b *= self._loc(np.conj(ch) * y)
            return C1 * a + np.conj(C1) * b
        out = xp.ones(s.shape, dtype=xp.complex128)
        for p, ph in zip(self.ps, self.phi):
            y = xp.exp(-s * math.log(p) + sg * 1j * ph)
            if k == 'ea':
                a = float(self.inp.split(':')[1])
                if self.K == 0:
                    out *= 1 / ((1 - p ** a * y) * (1 - p ** (-a) * y))
                else:
                    f = xp.ones_like(y); yy = xp.ones_like(y)
                    for j in range(1, self.K + 1):
                        yy = yy * y
                        f = f + sum(p ** (a * (2 * i - j)) for i in range(j + 1)) * yy
                    out *= f
            else:
                e = {'zeta': 1.0, 'nr': 1.0, 'tw2m': -1.0 if p == 2 else 1.0, 'tw2h': 0.5 if p == 2 else 1.0, 'liou': -1.0}[k]
                out *= self._loc(e * y)
        if k == 'nr':
            q = float(self.inp.split(':')[1]); cc = float(self.inp.split(':')[2])
            out *= cc + 2 * xp.cosh((s - 0.5) * math.log(q))
        return out

    def F(self, s):
        """scaled completed object (same zeros): e^{a-m} D(s) + e^{b-m} D~(1-s)."""
        a = lG(self.inp, s); b = lG(self.inp, 1 - s)
        mm = xp.maximum(a.real, b.real)
        return xp.exp(a - mm) * self.D(s) + xp.exp(b - mm) * self.D(1 - s, refl=True)

    def Z(self, t):
        """real function on the line with the zeros of F(1/2+it)."""
        s = 0.5 + 1j * t
        a = lG(self.inp, s)
        return (xp.exp(1j * a.imag) * self.D(s)).real


def _dph(v):
    return xp.angle(v[1:] / v[:-1])


MAXPTS = 3_000_000   # per array (complex128: 48 MB); a handful of temporaries are alive at once


def _chunks(a, b, n):
    """n+1 grid points on [a,b] in chunks with one shared endpoint."""
    k0 = 0
    while k0 < n:
        k1 = min(n, k0 + MAXPTS)
        yield a + (b - a) * xp.arange(k0, k1 + 1) / n
        k0 = k1


def _seg(fun, a, b, n):
    """sum of principal phase steps and max step of fun along the grid."""
    tot, ms = 0.0, 0.0
    for g in _chunks(a, b, n):
        d = _dph(fun(g))
        tot += float(d.sum()); ms = max(ms, float(xp.max(xp.abs(d))))
    return tot, ms


def count_window(obj, ta, tb, W=1.0, dt=0.01, maxref=4, max_total=2e8):
    """zeros of F in |sigma-1/2| < W, ta < t < tb (float winding, half contour x 2 by the mirror symmetry
    F(1 - conj s) = conj F(s)) and sign changes of Z on (ta, tb)."""
    res = {}
    for r in range(maxref + 1):
        n = max(int((tb - ta) / dt) + 1, 16)
        nh = max(int(W / dt) * 4, 400)
        if n > max_total:
            break
        d2, m2 = _seg(lambda t: obj.F(0.5 + W + 1j * t), ta, tb, n)
        d1, m1 = _seg(lambda x: obj.F(x + 1j * ta), 0.5, 0.5 + W, nh)
        d3, m3 = _seg(lambda x: obj.F(x + 1j * tb), 0.5, 0.5 + W, nh)
        ms = max(m1, m2, m3)
        wind = (d1 + d2 - d3) / math.pi
        tot = int(round(wind))
        res = {'tot': tot, 'frac': round(wind - tot, 5), 'maxstep': round(ms, 4), 'dt': dt}
        if ms < 1.2 and abs(wind - tot) < 0.02:
            break
        dt /= 4
    res['resolved'] = bool(res['maxstep'] < 1.2 and abs(res['frac']) < 0.02)
    dl = min(res['dt'], 0.01)
    on = -1
    for r in range(3):
        n = int((tb - ta) / dl) + 1
        if n > max_total:
            break
        on = 0; last = None
        for g in _chunks(ta, tb, n):
            z = xp.sign(obj.Z(g))
            on += int((z[1:] * z[:-1] < 0).sum())
        if on >= res['tot']:
            break
        dl /= 8
    res['on'] = on; res['off'] = res['tot'] - on
    return res


def theta_dot_edges(inp, T0, T1, win):
    return list(np.arange(T0, T1 + 1e-9, win))
