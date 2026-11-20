"""c12-control-battery-harness: core objects (python-flint ball arithmetic).

Uniform interface of every object X in OBJECTS (see README.md):
  X.code, X.kind ('closed' = closed form, 30 digits; 'stage' = zeta times a finite product over the 1e7 table;
                  'product' = Euler product over p <= 1e7, Re s > 1 only, float64; 'kernel' = HEAT quadrature)
  X.real_coeffs      F(conj s) = conj F(s)  (rule for negative ordinates)
  X.value(s)         acb at the current ctx.prec (closed and stage objects)
  X.completed(s)     completed function where a functional equation exists (accepts acb or acb_series), else None
  X.fe               dict: symmetry, gamma factor, conductor, root number; None when there is no functional equation
  X.local            dict describing the local parameters
Reused code (read as text and re-typed, sources named): DH coefficients and kappa from push/dh-separator/dhf.py and
euler/dh.py; T-NR factor from push/r3-tnr-control/twin.py; greedy floor rule from
push/c10-thin-deletion-zero-mode-control/del_control.py and push/c4-thin-twist-control-78/thinlib.py.
"""
import math
from flint import acb, arb, ctx, acb_series

SIGMAS = [0.5 + k / 8 for k in range(13)]          # 0.5 .. 2.0
T_STEP = 0.5
T_MAX = 2000.0
N_COEF = 10 ** 7


def kappa():
    """DH constant, recomputed at the working precision (a module constant breaks the FE at 10^-dps; euler/RESULT 2.1)."""
    return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)


def _is_series(s):
    return isinstance(s, acb_series)


def _zeta(s, a=None):
    if a is None:
        return s.zeta()
    return s.zeta(a)


def _exp(x):
    return x.exp()


def _gamma(x):
    return x.gamma()


def _powconst(base, s):
    """base^s for positive real base (arb or number), s acb or acb_series."""
    return _exp(s * arb(base).log())


class Obj:
    code = '?'; kind = 'closed'; real_coeffs = True; fe = None; local = None
    def value(self, s): raise NotImplementedError
    def completed(self, s): return None
    def poles(self): return []          # poles on the grid rectangle (list of (re, im) floats)


class Zeta(Obj):
    code = 'ZETA'
    fe = dict(symmetry='s <-> 1-s', gamma='s(s-1) pi^(-s/2) Gamma(s/2)', conductor=1, root_number=1,
              note='completed() is s(s-1) pi^(-s/2) Gamma(s/2) zeta(s) (no factor 1/2; the normalisation of c11-rs3 screen.py)')
    local = dict(type='Euler product, degree 1', parameter='alpha_p = 1 for every prime')
    def value(self, s): return _zeta(s)
    def completed(self, s):
        return s * (s - 1) * _powconst(arb.pi(), -s / 2) * _gamma(s / 2) * _zeta(s)
    def poles(self): return [(1.0, 0.0)]


class DH(Obj):
    code = 'DH'
    fe = dict(symmetry='s <-> 1-s', gamma='(5/pi)^(s/2) Gamma((s+1)/2)', conductor=5, root_number=1)
    local = dict(type='no Euler product', parameter='coefficients 1, kappa, -kappa, -1, 0 mod 5; a(6) - a(2)a(3) = 1 + kappa^2... (first defect at n = 6)')
    def value(self, s):
        k = kappa()
        c = (arb(1), k, -k, arb(-1))
        tot = c[0] * _zeta(s, arb(1) / 5)
        for a in (2, 3, 4):
            tot = tot + c[a - 1] * _zeta(s, arb(a) / 5)
        return tot * _powconst(5, -s)
    def completed(self, s):
        return _powconst(5 / arb.pi(), s / 2) * _gamma((s + 1) / 2) * self.value(s)


class EA(Obj):
    def __init__(self, num, den):
        self.a = arb(num) / den; self.af = num / den; self.code = 'EA-%d/%d' % (num, den)
        self.fe = dict(symmetry='s <-> 1-s', gamma='pi^(-s) Gamma((s+a)/2) Gamma((s-a)/2)', conductor=1, root_number=1)
        self.local = dict(type='Euler product, degree 2', parameter='alpha_p = p^a, beta_p = p^-a, a = %d/%d (not unimodular)' % (num, den))
    def value(self, s): return _zeta(s + self.a) * _zeta(s - self.a)
    def completed(self, s):
        a = self.a
        return (s + a) * (s + a - 1) * (s - a) * (s - a - 1) * _powconst(arb.pi(), -s) * _gamma((s + a) / 2) * _gamma((s - a) / 2) * self.value(s)
    def poles(self): return [(1 + self.af, 0.0), (1 - self.af, 0.0)]


class TNR(Obj):
    code = 'TNR'
    def __init__(self, q=3, c='2.2'):
        self.q = q; self.cs = c
        self.fe = dict(symmetry='s <-> 1-s', gamma='q^s s(s-1) pi^(-s/2) Gamma(s/2)', conductor=q * q, root_number=1)
        self.local = dict(type='Euler product; non-tempered factor at q', parameter='q = %d, local factor (1 + c q^(1/2-s) + q^(1-2s)), c = %s; alpha_p = 1 for p != q' % (q, c))
    def D(self, s):
        c = arb(self.cs)
        return 1 + c * _powconst(self.q, arb(1) / 2 - s) + _powconst(self.q, 1 - 2 * s)
    def value(self, s): return _zeta(s) * self.D(s)
    def completed(self, s):
        return _powconst(self.q, s) * s * (s - 1) * _powconst(arb.pi(), -s / 2) * _gamma(s / 2) * self.value(s)
    def poles(self): return [(1.0, 0.0)]
    def beta(self):
        c = arb(self.cs)
        return arb(1) / 2 + (c / 2).acosh() / arb(self.q).log()


class WT(Obj):
    code = 'WT'; real_coeffs = False
    def __init__(self, T=1000, k=1):
        self.T = T; self.k = k
        self.fe = dict(symmetry='s <-> 1 - s - 2 i alpha (not s <-> 1-s)', gamma="zeta's, translated", conductor=1, root_number=1)
        self.local = dict(type='Euler product, degree 1, unimodular', parameter='alpha_p = p^(-i alpha), alpha = 2 pi k/log(T/2 pi), T = %d, k = %d' % (T, k))
    def alpha(self): return 2 * arb.pi() * self.k / (arb(self.T) / (2 * arb.pi())).log()
    def value(self, s): return _zeta(s + acb(0, 1) * self.alpha())
    def conj_value(self, s):
        """value of the conjugate-coefficient series: zeta(s - i alpha); F(conj s) = conj(conj_value(s))"""
        return _zeta(s - acb(0, 1) * self.alpha())
    def poles(self): return []


class Liou(Obj):
    code = 'SGN-LIOU'
    local = dict(type='Euler product, degree 1, unimodular', parameter='alpha_p = -1 for every prime')
    def value(self, s): return _zeta(2 * s) / _zeta(s)
    def poles(self): return [(0.5, 0.0)]


class Stage(Obj):
    """zeta(s) * prod_{p in S, p <= X} local(p, s).  mode 'del': (1 - p^-s); mode 'thin': (1 - p^-s)/(1 + p^-s)."""
    kind = 'stage'
    def __init__(self, code, mode, b, S=None):
        self.code = code; self.mode = mode; self.b = b; self.S = S
        self._logp = None
    def load(self, S):
        self.S = list(S); self._logp = None
    def logs(self):
        if self._logp is None:
            self._logp = [arb(p).log() for p in self.S]
        return self._logp
    def G(self, s):
        num = acb(1); den = acb(1)
        ms = -acb(s)
        for lp in self.logs():
            u = (ms * lp).exp()
            num *= (1 - u)
            if self.mode == 'thin': den *= (1 + u)
        return num / den if self.mode == 'thin' else num
    def value(self, s): return acb(s).zeta() * self.G(s)
    def poles(self): return [(1.0, 0.0)]


def make_objects():
    """closed-form objects (30 digits). Stage, product and kernel objects are constructed by the table builders."""
    return [Zeta(), DH(), EA(1, 8), EA(1, 4), EA(1, 2), TNR(), WT(), Liou()]


def by_code(code):
    for o in make_objects():
        if o.code == code: return o
    raise KeyError(code)


# ---------- helpers ----------
def deriv_completed(obj, s, order=1):
    """value and first derivative of obj.completed at s through acb_series."""
    x = acb_series([acb(s), 1], prec=order + 1)
    y = obj.completed(x)
    return y[0], y[1]


def logder(obj, s, completed=True):
    """(Lambda'/Lambda)(s) or (F'/F)(s) through acb_series."""
    x = acb_series([acb(s), 1], prec=2)
    y = obj.completed(x) if completed else obj.value(x)
    return y[1] / y[0]


def dd_split(x):
    """arb -> (hi, lo) float64 with hi + lo = midpoint to about 32 digits."""
    hi = float(x.mid())
    lo = float((x - arb(hi)).mid())
    return hi, lo


def dd_join(hi, lo):
    return arb(float(hi)) + arb(float(lo))
