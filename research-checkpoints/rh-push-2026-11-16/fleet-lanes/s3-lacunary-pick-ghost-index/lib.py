"""s3-lacunary-pick-ghost-index: shared code (python-flint ball arithmetic).
Objects: completed functions F(w) = Lambda(1/2 + w), even in w where a functional equation holds.
  ZETA, LCHI4 (chi_{-4}), LCHI5 (real even character mod 5), DH, EA(a), TNR(q, c), HEAT(tau) (Gaussian convolution of xi),
  Planted(base, delta, gamma) (base times one off-line quadruple +-delta +- i gamma).
Definitions of DH, EA, TNR re-typed from push/c12-control-battery-harness/battery/core.py (read as text).
schur_pivots: LDL pivots of a Pick matrix P_ij = (u_i J u_j^*)/(w_i + conj w_j), J = diag(1,-1), by the displacement
(generalised Schur) recursion, O(n^2) ball operations. A pivot ball strictly below 0 after strictly positive/nonzero
earlier pivots certifies a negative eigenvalue of the leading section; number of negative pivots = negative index."""
import math
from flint import acb, arb, ctx, acb_series


def kappa():
    return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)


def _pc(base, s):
    return (s * arb(base).log()).exp()


class Zeta:
    code = 'ZETA'; real = True
    def completed(self, s):
        return s * (s - 1) * _pc(arb.pi(), -s / 2) * (s / 2).gamma() * s.zeta()


class Per:
    """periodic coefficients c[0..q-1] for residues 1..q, parity 0 (even) or 1 (odd); no pole."""
    real = True
    def __init__(self, code, q, coeffs, parity):
        self.code = code; self.q = q; self.cf = coeffs; self.par = parity
    def value(self, s):
        tot = None
        for a, c in enumerate(self.cf(), start=1):
            if c is None: continue
            t = c * s.zeta(arb(a) / self.q)
            tot = t if tot is None else tot + t
        return tot * _pc(self.q, -s)
    def completed(self, s):
        return _pc(self.q / arb.pi(), s / 2) * ((s + self.par) / 2).gamma() * self.value(s)


def DH():
    return Per('DH', 5, lambda: (arb(1), kappa(), -kappa(), arb(-1), None), 1)
def LCHI4():
    return Per('LCHI4', 4, lambda: (arb(1), None, arb(-1), None), 1)
def LCHI5():
    return Per('LCHI5', 5, lambda: (arb(1), arb(-1), arb(-1), arb(1), None), 0)


class EA:
    real = True
    def __init__(self, num, den):
        self.num = num; self.den = den; self.code = 'EA-%d/%d' % (num, den)
    def completed(self, s):
        a = arb(self.num) / self.den
        z = Zeta()
        return z.completed(s + a) * z.completed(s - a)


class TNR:
    real = True
    def __init__(self, q=3, c='2.2'):
        self.q = q; self.cs = c; self.code = 'TNR'
    def completed(self, s):
        c = arb(self.cs)
        D = 1 + c * _pc(self.q, arb(1) / 2 - s) + _pc(self.q, 1 - 2 * s)
        return _pc(self.q, s) * Zeta().completed(s) * D
    def delta(self):
        return float(((arb(self.cs) / 2).acosh() / arb(self.q).log()).mid())


class Planted:
    real = True
    def __init__(self, base, delta, gamma):
        self.base = base; self.d = delta; self.g = gamma
        self.code = '%s+Q(%s,%s)' % (base.code, delta, gamma)
    def completed(self, s):
        w = s - arb(1) / 2
        lam = acb(arb(self.g), -arb(self.d)); lam = lam * lam
        w2 = w * w
        return self.base.completed(s) * (w2 + lam) * (w2 + lam.conjugate())


class Heat:
    """F_tau(w) = int xi(1/2 + w + i y) exp(-y^2/|tau|) dy / sqrt(pi |tau|), tau < 0 (trapezoid rule, step from precision;
    arb used as multiprecision floats for this object: the quadrature truncation error is modelled, not enclosed)."""
    real = True
    def __init__(self, tau):
        self.tau = tau; self.code = 'HEAT%s' % tau; self._grid = None
    def grid(self):
        key = ctx.prec
        if self._grid is None or self._grid[0] != key:
            A = abs(self.tau); B = ctx.prec * math.log(2) + 120
            h = math.pi * math.sqrt(A / B); ymax = math.sqrt(A * B)
            n = int(math.ceil(ymax / h)); ha = arb(h)
            ys = [ha * j for j in range(-n, n + 1)]
            ws = [(-(y * y) / arb(A)).exp() * ha / (arb.pi() * arb(A)).sqrt() for y in ys]
            self._grid = (key, ys, ws)
        return self._grid[1], self._grid[2]
    def val_der(self, w):
        ys, ws = self.grid(); z = Zeta()
        w = acb(w); f = acb(0); d = acb(0)
        isreal = w.imag.is_zero()
        for y, g in zip(ys, ws):
            if isreal and float(y.mid()) < 0: continue
            x = acb_series([acb(arb(1) / 2) + w + acb(0, y), 1], prec=2)
            v = z.completed(x)
            if isreal:
                m = 1 if float(y.mid()) == 0 else 2
                f += g * m * v[0].real; d += g * m * v[1].real
            else:
                f += g * v[0]; d += g * v[1]
        return f, d


def val(obj, w):
    """F(w) = completed(1/2 + w)"""
    if isinstance(obj, Heat): return obj.val_der(w)[0]
    return obj.completed(acb(arb(1) / 2) + acb(w))


def logder(obj, w):
    """F'/F at w"""
    if isinstance(obj, Heat):
        f, d = obj.val_der(w); return d / f
    x = acb_series([acb(arb(1) / 2) + acb(w), 1], prec=2)
    y = obj.completed(x)
    return y[1] / y[0]


def ratio(obj, w, a):
    """R_a(w) = F(w - a)/F(w + a)"""
    w = acb(w); a = arb(a)
    return val(obj, w - a) / val(obj, w + a)


def get(code):
    if code == 'ZETA': return Zeta()
    if code == 'DH': return DH()
    if code == 'LCHI4': return LCHI4()
    if code == 'LCHI5': return LCHI5()
    if code.startswith('EA-'):
        n, d = code[3:].split('/'); return EA(int(n), int(d))
    if code == 'TNR': return TNR()
    if code.startswith('HEAT'): return Heat(float(code[4:]))
    if code.startswith('PL:'):       # PL:<base>:<delta>:<gamma>
        _, b, d, g = code.split(':'); return Planted(get(b), d, g)
    raise KeyError(code)


# ---------------- Schur / displacement LDL ----------------
def schur_real(nu, c, stop_at_negative=True, progress=None):
    """Real symmetric Loewner-Pick matrix P_ij = (c_i + c_j)/(nu_i + nu_j), nu, c lists of arb.
    Returns list of (k, sign, log2|d_k/P_kk|, log2 relative radius); sign in {+1,-1,0}; 0 = ball contains 0 (undecided)."""
    n = len(nu)
    x = list(c); y = [arb(1)] * n
    out = []
    for k in range(n):
        xk = x[k]; yk = y[k]; nk = nu[k]
        d = xk * yk / nk
        p0 = c[k] / nk
        r = d / p0
        if r > 0: sg = 1
        elif r < 0: sg = -1
        else: sg = 0
        mid = abs(float(r.mid())) if r.mid() != 0 else 0.0
        l2 = _log2(r)
        rr = _log2rad(r) - l2 if l2 is not None else None
        out.append((k, sg, l2, rr))
        if progress and (k % progress == 0): print('   k', k, sg, l2, rr, flush=True)
        if sg == 0 or (sg < 0 and stop_at_negative): break
        dinv = 1 / d
        for i in range(k + 1, n):
            l = (x[i] * yk + y[i] * xk) / (nu[i] + nk) * dinv
            x[i] = x[i] - l * xk
            y[i] = y[i] - l * yk
    return out


def schur_cplx(w, U, stop_at_zero=True, progress=None):
    """Hermitian Pick matrix P_ij = (u_i1 conj u_j1 - u_i2 conj u_j2)/(w_i + conj w_j). U = list of (u1, u2) acb."""
    n = len(w)
    a = [acb(u[0]) for u in U]; b = [acb(u[1]) for u in U]
    p0 = [((a[i] * a[i].conjugate() - b[i] * b[i].conjugate()) / (w[i] + w[i].conjugate())).real for i in range(n)]
    out = []
    for k in range(n):
        ak = a[k].conjugate(); bk = b[k].conjugate(); wk = w[k].conjugate()
        d = ((a[k] * ak - b[k] * bk) / (w[k] + wk)).real
        r = d / abs(p0[k]) if not p0[k].contains(0) else d
        if r > 0: sg = 1
        elif r < 0: sg = -1
        else: sg = 0
        l2 = _log2(r); rr = _log2rad(r) - l2 if l2 is not None else None
        out.append((k, sg, l2, rr))
        if progress and (k % progress == 0): print('   k', k, sg, l2, rr, flush=True)
        if sg == 0 and stop_at_zero: break
        dinv = 1 / d
        a_k = a[k]; b_k = b[k]
        for i in range(k + 1, n):
            l = (a[i] * ak - b[i] * bk) / (w[i] + wk) * dinv
            a[i] = a[i] - l * a_k
            b[i] = b[i] - l * b_k
    return out


def _log2(r):
    m = r.mid()
    if m == 0: return None
    return float(abs(m).log().mid()) / math.log(2)

def _log2rad(r):
    m = r.rad()
    if m == 0: return -1e9
    return float(arb(m).log().mid()) / math.log(2)


def summarize(piv, n):
    """summary dict of a pivot list"""
    neg = [p for p in piv if p[1] < 0]; und = [p for p in piv if p[1] == 0]
    l2 = [p[2] for p in piv if p[2] is not None]
    return dict(n=n, done=len(piv), negatives=len(neg), first_negative=(neg[0][0] if neg else None),
                first_negative_log2=(neg[0][2] if neg else None), undecided_at=(und[0][0] if und else None),
                min_log2_pivot=(min(l2) if l2 else None), max_log2_relrad=max([p[3] for p in piv if p[3] is not None] or [None]))
