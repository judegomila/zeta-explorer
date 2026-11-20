"""c17-u8-restricted-search-lemma-h-gated: dictionary DU (PREREGISTRATION.md).
Objects, ball kernels, functionals, exact one-dimensional threshold scan (balls and float64), node classifiers.
Kernels: kern.py / ballk.py copied unchanged from c16-dn-canonical-tier-ball-conversion."""
import math
import functools
import numpy as np
from flint import arb, acb, ctx, arb_mat, acb_mat
import kern
import ballk

SEED = 170000
LADDER = (128, 256, 512, 1024, 2048, 4096, 8192, 16384)
WIN = {False: 4.0, True: 3.0}          # pol -> window
LN2 = math.log(2)
kern.Heat.UMAX = 3.2
TIERS = {'full': ('T', 'E', 'H'), 'TE': ('T', 'E'), 'TH': ('T', 'H'), 'EH': ('E', 'H')}
RHO = [s * r for r in (1e-3, 1e-2, 1e-1, 10 ** -0.5, 1.0, 10 ** 0.5, 10.0, 1e2, 1e3) for s in (1, -1)]


def rng(k):
    return np.random.Generator(np.random.PCG64(SEED + k))


class NeedPrec(Exception):
    pass


# ---------------------------------------------------------------- objects
class Ob:
    """kind in zeta, chi, tnr, ea, heat, syn; grp in P, PH, T, E, H (training) and hT, hE, hH (held-out)."""

    def __init__(self, kind, name, grp, k=None, par=None):
        self.kind = kind
        self.name = name
        self.grp = grp
        self.k = k
        self.par = par
        self.b = ballk.wrap(k) if k is not None and kind != 'heat' else None
        self.cplx = bool(getattr(k, 'cplx', False)) if k is not None else False
        self._hf = None

    def vals(self, pts, pol, ptfun=None):
        """ball values of the kernel read at the points (list of arb).  ptfun: callable returning the same points at
        the current precision (used by E_a, which needs the points at a higher working precision)."""
        if self.kind == 'heat':
            tau = arb(self.par)
            if not pol:
                return [ballk.BZ.jets(u, 0, False)[0] * (tau * u * u / 4).exp() for u in pts]
            return heat_pol_batch(self.par, pts)
        if self.kind == 'syn':
            sg, al, c = self.par
            return [sg * (-arb(al) * u * u).exp() * (1 + arb(c) * u * u) for u in pts]
        if self.kind == 'ea':
            if ptfun is not None:
                p0 = ctx.prec
                ctx.prec = int(4.6 * p0) + 128
                try:
                    pts = ptfun()
                finally:
                    ctx.prec = p0
            return [self._ea_ball(u, pol) for u in pts]
        return [self.b.jets(u, 0, pol)[0] for u in pts]

    def _ea_ball(self, u, pol):
        """E_a ball.  ballk.BEA with one change: for X <= 0.7 prec each K_a(X) is evaluated at working precision
        prec + 2.9 X + 64 bits, with X formed at that precision from the point u (which must be given at about
        3.1 prec bits): the Bessel enclosure of the library loses about 2 X / log 2 bits where it falls back on
        I_(-a) - I_a.  The result is an enclosure at every precision."""
        b = self.b
        neg = bool(u < 0)
        p0 = ctx.prec
        ctx.prec = 5 * p0 + 256                 # the negation rounds to the context precision
        try:
            v = -u if neg else u
        finally:
            ctx.prec = p0
        a, c1, c2 = b.consts()
        e1 = acb(0.5) + a
        e2 = acb(0.5) - a
        K = 0 if pol else 4
        B = _ea_bessel_part(b, v, K)
        if pol:
            d = B[0] + c1 * (e1 * v).exp() + c2 * (e2 * v).exp()
        else:
            b1 = e1 * e1
            b2 = e2 * e2
            d = B[4] * 24 - (b1 + b2) * B[2] * 2 + b1 * b2 * B[0]
        return d.real

    def ea_float(self, pts_float, pol):
        """float64 E_a kernel (screen only): returns (log abs K, sign).  Bessel part through scaled K_a (scipy kve)
        and f'' = (X^2 + a^2) f for f(x) = K_a(c e^x); common factor exp(-2 pi e^v) kept in the logarithm."""
        from scipy.special import kve
        a = float(self.k.a)
        v = np.abs(np.asarray(pts_float, dtype=np.float64))
        y = np.exp(v)
        X1 = 2 * math.pi * y
        acc = [np.zeros_like(v) for _ in range(5)]
        for n in range(1, 10):
            X = n * X1
            sc = np.exp(-(X - X1))
            sig = sum(d ** (-2 * a) for d in range(1, n + 1) if n % d == 0)
            cn = 4 * n ** a * sig
            f0 = kve(a, X)
            f1 = -X * kve(a - 1, X) - a * f0
            Wd = X * X + a * a
            f2 = Wd * f0
            f3 = 2 * X * X * f0 + Wd * f1
            f4 = 4 * X * X * f0 + 4 * X * X * f1 + Wd * f2
            f = (f0, f1, f2, f3, f4)
            for k in range(5):
                g = sum(math.comb(k, j) * 0.5 ** (k - j) * f[j] for j in range(k + 1))
                acc[k] = acc[k] + cn * sc * g
        if pol:
            Bv = np.exp(v / 2 - X1) * acc[0]
            val = self.k.c1 * np.exp(self.k.e1 * v) + self.k.c2 * np.exp(self.k.e2 * v) + Bv
            return np.log(np.abs(val)), np.sign(val)
        b1 = self.k.e1 ** 2
        b2 = self.k.e2 ** 2
        val = acc[4] - (b1 + b2) * acc[2] + b1 * b2 * acc[0]
        return v / 2 - X1 + np.log(np.abs(val)), np.sign(val)

    def heat_float(self, pts_float):
        """float64 Kpol of a HEAT member (screen only)."""
        if self._hf is None:
            self._hf = kern.Heat(self.par, self.name)
        return self._hf.jn(np.asarray(pts_float, dtype=np.float64), 0, True)[0][0]


def char_list(qlo, qhi):
    out = []
    for q in range(qlo, qhi + 1):
        for m, v, real in kern.primitive_reps(q):
            out.append((q, m, v, real))
    return out


def build_objects():
    O = [Ob('zeta', 'ZETA', 'P', kern.ZETA)]
    for q, m, v, real in char_list(3, 13):
        O.append(Ob('chi', 'chi%d.%d%s' % (q, m, '' if real else 'c'), 'P', kern.Chi(q, v, 'x')))
    ho = char_list(14, 60)
    idx = np.sort(rng(0).choice(len(ho), 48, replace=False))
    for i in idx:
        q, m, v, real = ho[i]
        O.append(Ob('chi', 'chi%d.%d%s' % (q, m, '' if real else 'c'), 'PH', kern.Chi(q, v, 'x')))
    r = rng(2)
    for j in range(32):
        p0 = int(r.choice([2, 3, 5, 7, 11, 13]))
        t = r.uniform(0.05, 0.95)
        c = 2 + t * (math.sqrt(p0) + 1 / math.sqrt(p0) - 2)
        O.append(Ob('tnr', 'TNR%d_%.6f' % (p0, c), 'T' if j < 8 else 'hT', kern.TNR(p0, c, 'x')))
    r = rng(3)
    for j in range(32):
        a = float(r.uniform(0.03, 0.47))
        O.append(Ob('ea', 'EA%.6f' % a, 'E' if j < 8 else 'hE', kern.EA(a, 'x')))
    r = rng(4)
    taus = [-10 ** float(r.uniform(-4, math.log10(0.005))) for _ in range(31)]
    tr = taus[:7] + [-0.005]
    for j, tau in enumerate(tr + taus[7:]):
        O.append(Ob('heat', 'HEAT%.8f' % tau, 'H' if j < 8 else 'hH', None, tau))
    return O


def build_planted(which):
    """which = 'minor': positives exp(-al u^2), controls -exp(+al u^2); 'turan': controls exp(-al u^2)(1 + c u^2)."""
    r = np.random.Generator(np.random.PCG64(175000))
    O = []
    for g in ['P'] * 24 + ['PH'] * 48:
        al = math.exp(r.uniform(math.log(0.3), math.log(3)))
        O.append(Ob('syn', 'G%d_%.4f' % (len(O), al), g, None, (1, al, 0.0)))
    for k in 'TEH':
        for g in [k] * 8 + ['h' + k] * 24:
            al = math.exp(r.uniform(math.log(0.3), math.log(3)))
            cc = al * r.uniform(2.5, 6)
            if which == 'minor':
                O.append(Ob('syn', 'N%d_%.4f' % (len(O), al), g, None, (-1, -al, 0.0)))
            else:
                O.append(Ob('syn', 'S%d_%.4f_%.4f' % (len(O), al, cc), g, None, (1, al, cc)))
    return O


def _ea_bessel_part(b, v, K):
    """Taylor coefficients 0..K of 4 sqrt(y) sum n^a sigma_(-2a)(n) K_a(2 pi n y), y = e^x, at x = v >= 0
    (copy of ballk.BEA.bessel_part with the Bessel values at raised working precision)."""
    from flint import acb_series
    a, _, _ = b.consts()
    p0 = ctx.prec
    ctx.cap = K + 1
    x = acb_series([acb(v), 1])
    tot = acb_series([0])
    need = p0 * LN2 + 60
    y = float(v.exp().mid())
    N = int(need / (2 * math.pi * y)) + 2
    for n in range(1, N + 1):
        Xf = 2 * math.pi * n * y
        if Xf <= 1.2 * p0:
            ctx.prec = p0 + int(2.9 * Xf) + 64
        try:
            c = 2 * arb.pi() * n
            X = acb(c * v.exp())
            k0 = X.bessel_k(a)
            km = X.bessel_k(a - 1)
        finally:
            ctx.prec = p0
        c = 2 * arb.pi() * n
        f = [k0, -X * km - a * k0]
        Wser = (c * c) * (2 * x).exp() + a * a
        Wc = [Wser[j] if j < Wser.length() else acb(0) for j in range(K + 1)]
        for k in range(K - 1):
            sm = acb(0)
            for j in range(k + 1):
                sm += Wc[j] * f[k - j]
            f.append(sm / ((k + 2) * (k + 1)))
        sig = acb(0)
        for dv in range(1, n + 1):
            if n % dv == 0:
                sig += (-2 * a * acb(dv).log()).exp()
        cn = 4 * (a * acb(n).log()).exp() * sig
        tot = tot + cn * acb_series(f[:K + 1])
    tot = tot * (x / 2).exp()
    Xn = 2 * math.pi * (N + 1) * y * 0.999
    r = arb(64 * (N + 1) ** 2) * (v / 2).exp() * arb(Xn + abs(complex(a)) + K + 1) ** K * (-arb(Xn)).exp()
    r = arb(0, 1) * r
    return [(tot[k] if k < tot.length() else acb(0)) + acb(r, r) for k in range(K + 1)]


# ---------------------------------------------------------------- HEAT with polar terms, batched
_HB = {}


def _heat_integrand(tau, sgn):
    key = (tau, sgn)
    if key not in _HB:
        _HB[key] = ballk.BHeat(kern.Synth(1.0, 0.0, 'dummy'))
        _HB[key].o = type('T', (), {'tau': tau})()
    return _HB[key]._integrand(sgn)


def heat_pol_batch(tau, pts):
    """Kpol_tau(u) = c e^(v/2) + e^(-v/2) J1(v) - e^(v/2) I2(v), v = abs(u); J1 = int_v^inf K3 g e^(t/2), I2 with
    e^(-t/2), c = J1(0) + I2(0).  Integrals are accumulated over consecutive points from the largest downward (all
    integrands positive on t >= 0: no cancellation).  The part beyond T is enclosed by 9.03 W^1.5 e^(-W),
    W = pi e^(2T) (PREREG section 7; bound: K3(t) e^(t/2) <= 16 w^2 e^(-w) e^t, w = pi e^(2t) >= pi)."""
    p = ctx.prec
    vs = []
    for u in pts:
        if u > 0:
            vs.append(u)
        elif u < 0:
            vs.append(-u)
        else:
            vs.append(abs(u.mid()) if u.rad() == 0 else None)
            if vs[-1] is None:
                raise NeedPrec()
    order = sorted(range(len(vs)), key=lambda i: -float(vs[i].mid()))
    vmax = float(vs[order[0]].upper())
    W = math.pi * math.exp(2 * vmax) + p * LN2 + 100
    T = 0.5 * math.log(W / math.pi) * (1 + 1e-12) + 1e-12
    Wb = arb.pi() * (2 * arb(T)).exp()
    rem = arb(0, float((9.04 * Wb ** 1.5 * (-Wb).exp()).upper()) or 0.0)
    rem = arb(0, 1) * (9.04 * Wb ** 1.5 * (-Wb).exp())
    gp = _heat_integrand(tau, 1)
    gm = _heat_integrand(tau, -1)
    rt = arb(2) ** (-p)
    at = arb(2) ** (-p - 60000)
    J = rem
    I = rem
    prev = acb(T)
    Jv = {}
    for i in order:
        v = acb(vs[i])
        J = J + acb.integral(gp, v, prev, rel_tol=rt, abs_tol=at).real
        I = I + acb.integral(gm, v, prev, rel_tol=rt, abs_tol=at).real
        prev = v
        Jv[i] = (J, I)
    J0 = J + acb.integral(gp, acb(0), prev, rel_tol=rt, abs_tol=at).real
    I0 = I + acb.integral(gm, acb(0), prev, rel_tol=rt, abs_tol=at).real
    c = J0 + I0
    out = []
    for i in range(len(vs)):
        ep = (vs[i] / 2).exp()
        em = (-vs[i] / 2).exp()
        out.append(c * ep + em * Jv[i][0] - ep * Jv[i][1])
    return out


# ---------------------------------------------------------------- families: points and functional values
def fam_info(fam):
    """-> (kind, m, thresholded)  kind in 'TM', 'DM', 'T3', 'T6'."""
    if fam in ('T3', 'T6'):
        return fam, 0, True
    thr = fam[2] == 't'
    return fam[:2], int(fam[-1]), thr


def node_points(fam, node):
    """node: dict of exact float parameters -> list of arb points read (minors: row-major m x m)."""
    kind, m, thr = fam_info(fam)
    if kind in ('TM', 'DM'):
        u0, h, g = arb(node['u0']), arb(node['h']), arb(node.get('g', 0.0))
        xs = [u0 + i * h + (i * i) * g for i in range(m)]
        if kind == 'TM':
            ys = [j * arb(node['k']) for j in range(m)]
        else:
            ys = [arb(int(n)).log() for n in node['cols']]
        return [x + y for x in xs for y in ys]
    u, h = arb(node['u']), arb(node['h'])
    if kind == 'T3':
        return [u, u - 2 * h, u + 2 * h, u - h, u + h]
    return [u - h / 2, u + h / 2, u - 5 * h / 2, u + 5 * h / 2, u - 3 * h / 2, u + 3 * h / 2]


def node_points_float(fam, node):
    kind, m, thr = fam_info(fam)
    if kind in ('TM', 'DM'):
        xs = [node['u0'] + i * node['h'] + i * i * node.get('g', 0.0) for i in range(m)]
        ys = [j * node['k'] for j in range(m)] if kind == 'TM' else [math.log(n) for n in node['cols']]
        return [x + y for x in xs for y in ys]
    u, h = node['u'], node['h']
    if kind == 'T3':
        return [u, u - 2 * h, u + 2 * h, u - h, u + h]
    return [u - h / 2, u + h / 2, u - 5 * h / 2, u + 5 * h / 2, u - 3 * h / 2, u + 3 * h / 2]


def _re(z):
    return z.real if isinstance(z, acb) else z


def minor_V(vals, m):
    """(Re det, Re prod diag)"""
    cplx = isinstance(vals[0], acb)
    M = (acb_mat if cplx else arb_mat)(m, m, vals)
    d = M.det()
    pr = vals[0]
    for i in range(1, m):
        pr = pr * vals[i * m + i]
    return _re(d), _re(pr)


def turan_M(vals):
    """the three monomials (real parts): first, second (coefficient mu), third (coefficient lam)."""
    if len(vals) == 5:
        return _re(vals[0] * vals[0]), _re(vals[1] * vals[2]), _re(vals[3] * vals[4])
    return _re(vals[0] * vals[1]), _re(vals[2] * vals[3]), _re(vals[4] * vals[5])


def strict_sign(x):
    if x > 0:
        return 1
    if x < 0:
        return -1
    raise NeedPrec()


# ---------------------------------------------------------------- exact threshold scan
# Each object has a breakpoint r = V1/V2 known to lie in an interval [lo, hi] (a ball, or a float64 value with an
# error band) and a sign s2 of V2 (0 = unknown).  For a threshold t: sign(V1 - t V2) = s2 if r > t, -s2 if r < t.
# The endpoints cut the line into elementary intervals; in each, an object is above, below, or "wild" (its interval
# contains the elementary interval).  certified = the required signs hold with no wild object used;
# favourable = they could hold if wild objects are read in favour.  A node is T-train iff some elementary interval
# is certified, excluded iff none is favourable; otherwise the precision is raised (balls) or the node is
# float64-undecided.
def _evcmp(x, y):
    if x[0] < y[0]:
        return -1
    if x[0] > y[0]:
        return 1
    return x[1] - y[1]                       # equal position: starts (0) before ends (1)


def scan_core(objs, exact, pos=None, wild=None):
    """objs: list of (lo, hi, s2, grp); lo = None: wild everywhere.  Returns list of dict grp -> [plus, minus, wild].
    pos (a list), if given, receives the sorted event positions: interval i lies between pos[i-1] and pos[i]."""
    ev = []
    cur = {}
    state = []
    for i, (lo, hi, s2, g) in enumerate(objs):
        c = cur.setdefault(g, [0, 0, 0])
        if lo is None or s2 == 0:
            c[2] += 1
            state.append(None)
            continue
        c[0 if s2 > 0 else 1] += 1          # threshold below everything: r above t: sign = s2
        state.append(0)
        ev.append((lo, 0, i))
        ev.append((hi, 1, i))
    if exact:
        ev.sort(key=functools.cmp_to_key(_evcmp))
    else:
        ev.sort(key=lambda e: (e[0], e[1]))
    out = [{g: tuple(v) for g, v in cur.items()}]
    if pos is not None:
        pos.extend(e[0] for e in ev)
    ws = set(i for i, st in enumerate(state) if st is None)
    if wild is not None:
        wild.append(tuple(ws))
    for _p, typ, i in ev:
        if wild is not None:
            if typ == 0:
                ws.add(i)
            else:
                ws.discard(i)
        lo, hi, s2, g = objs[i]
        c = cur[g]
        if typ == 0:                         # above -> wild
            c[0 if s2 > 0 else 1] -= 1
            c[2] += 1
        else:                                # wild -> below: sign = -s2
            c[2] -= 1
            c[1 if s2 > 0 else 0] += 1
        out.append({g: tuple(v) for g, v in cur.items()})
        if wild is not None:
            wild.append(tuple(ws))
    return out


class Refine(Exception):
    """objects whose balls must be refined before the node can be decided."""

    def __init__(self, names):
        self.names = names


def need_objs(items, classes, hold=False):
    """names of the objects that are wild in an elementary interval that is favourable but not certified."""
    wild = []
    ivs = scan_core(ball_objs(items), True, None, wild)
    out = set()
    for cnt, w in zip(ivs, wild):
        for sgn in (1, -1):
            t = train_state(cnt, classes, sgn)
            if hold and t:
                t = min(t, hold_state(cnt, classes, sgn))
            if t == 1:
                out.update(items[i][3] for i in w)
    return out


NPOS, NPH, NCL = 24, 48, 24
PH_MIN, CL_MIN = 46, 23


def train_state(cnt, classes, s):
    """2 certified, 1 favourable only, 0 not possible, for sign s of the positives."""
    a, b = (0, 1) if s > 0 else (1, 0)
    if cnt['P'][b] > 0:
        return 0
    if any(cnt[c][b] + cnt[c][2] < 1 for c in classes):
        return 0
    if cnt['P'][2] == 0 and all(cnt[c][b] >= 1 for c in classes):
        return 2
    return 1


def hold_state(cnt, classes, s):
    a, b = (0, 1) if s > 0 else (1, 0)
    if cnt['PH'][a] + cnt['PH'][2] < PH_MIN or any(cnt['h' + c][b] + cnt['h' + c][2] < CL_MIN for c in classes):
        return 0
    if cnt['PH'][a] >= PH_MIN and all(cnt['h' + c][b] >= CL_MIN for c in classes):
        return 2
    return 1


def tier_status(ivs, classes, hold=False):
    """-> 1 (certified), 0 (excluded), -1 (not decided at this accuracy)."""
    best = 0
    for cnt in ivs:
        for s in (1, -1):
            t = train_state(cnt, classes, s)
            if hold and t:
                t = min(t, hold_state(cnt, classes, s))
            if t == 2:
                return 1
            best = max(best, t)
    return -1 if best == 1 else 0


def ball_objs(items):
    out = []
    for V1, V2, g in (it[:3] for it in items):
        if V2 > 0:
            s2 = 1
        elif V2 < 0:
            s2 = -1
        else:
            out.append((None, None, 0, g))
            continue
        r = V1 / V2
        out.append((r.lower(), r.upper(), s2, g))
    return out


# ---------------------------------------------------------------- node classifiers (balls)
VALCACHE = {}


class NodeEval:
    """values of one functional node; every object has its own precision level (index into LADDER)."""

    def __init__(self, fam, node, pol):
        self.fam = fam
        self.node = node
        self.pol = pol
        self.kind, self.m, self.thr = fam_info(fam)
        self.level = {}
        self.cache = {}
        self.maxlev = 0

    def bump(self, names):
        """raise the level of the named objects; False if one of them is already at the last rung."""
        okk = True
        for n in names:
            l = self.level.get(n, 0)
            if l + 1 >= len(LADDER):
                okk = False
            else:
                self.level[n] = l + 1
                self.maxlev = max(self.maxlev, l + 1)
        return okk

    def V(self, o):
        """(V1, V2) balls of the object (sign families: V2 = 1) at the object's own precision."""
        lev = self.level.get(o.name, 0)
        key = (o.name, lev)
        if key not in self.cache:
            p0 = ctx.prec
            ctx.prec = LADDER[lev]
            try:
                pts = node_points(self.fam, self.node)
                ck = (o.name, self.fam, self.node.get('id'), self.pol, ctx.prec)
                if ck not in VALCACHE:
                    if len(VALCACHE) > 4000:
                        VALCACHE.clear()
                    try:
                        VALCACHE[ck] = o.vals(pts, self.pol, lambda: node_points(self.fam, self.node))
                    except NeedPrec:
                        raise Refine([o.name])
                v = VALCACHE[ck]
                if self.kind in ('TM', 'DM'):
                    d, pr = minor_V(v, self.m)
                    self.cache[key] = (d, pr if self.thr else arb(1))
                else:
                    M1, M2, M0 = turan_M(v)
                    mu = arb(self.node['srho']) * arb(self.node['Lr']).exp()
                    self.cache[key] = (M1 + mu * M2, M0)
            finally:
                ctx.prec = p0
        return self.cache[key]

    def sign(self, o):
        """strict sign of V1, refining this object alone; 0 if not decided at the last rung."""
        while True:
            x = self.V(o)[0]
            if x > 0:
                return 1
            if x < 0:
                return -1
            if not self.bump([o.name]):
                return 0


def classify_threshold(ev, O, need=('full',), lazy=True):
    """thresholded family at the current precision levels of ev.  Positives first; then the training classes
    (K3 read: H, T, E; Kpol read: T, E, H).  lazy: the node is excluded for the full tier as soon as no elementary
    interval is favourable for the classes added so far (the two-class tiers are then not evaluated: -2).
    Tiers listed in `need` must be decided: otherwise Refine names the objects whose balls block the decision.
    Held-out members are evaluated for the tiers that are T-train."""
    pol = ev.pol
    by = {}
    for o in O:
        by.setdefault(o.grp, []).append(o)
    items = [ev.V(o) + ('P', o.name) for o in by['P']]
    res = dict(status='excl', tiers={k: 0 for k in TIERS}, hold={k: 0 for k in TIERS})
    if tier_status(scan_core(ball_objs(items), True), ()) == 0:
        res['why'] = 'P'
        return res
    res['posfeas'] = 1
    order = 'TEH' if pol else 'HTE'
    done = []
    for c in order:
        items += [ev.V(o) + (c, o.name) for o in by[c]]
        done.append(c)
        if lazy and c != order[-1]:
            if tier_status(scan_core(ball_objs(items), True), done) == 0:
                res['why'] = 'lazy:' + ''.join(done)
                res['lazy'] = 1
                res['tiers'] = {k: (0 if k == 'full' else -2) for k in TIERS}
                res['hold'] = dict(res['tiers'])
                return res
    pos = []
    ivs = scan_core(ball_objs(items), True, pos)
    for k, cl in TIERS.items():
        res['tiers'][k] = tier_status(ivs, cl)
        if res['tiers'][k] == -1:
            res['hold'][k] = -1
            if k in need:
                raise Refine(need_objs(items, cl))
    if not any(v == 1 for v in res['tiers'].values()):
        res['why'] = 'C'
        return res
    if res['tiers']['full'] == 1:
        res['status'] = 'ttrain'
        zr = ev.V(by['P'][0])
        res['rz'] = (zr[0] / zr[1]).str(30, radius=False)
        res['rH'] = [(ev.V(o)[0] / ev.V(o)[1]).str(30, radius=False) for o in by['H']]
        segs = []
        for i, cnt in enumerate(ivs):
            for sgn in (1, -1):
                if train_state(cnt, TIERS['full'], sgn) == 2:
                    segs.append([None if i == 0 else pos[i - 1].str(30, radius=False), None if i == len(pos) else pos[i].str(30, radius=False), sgn])
        res['segs'] = segs[:6]
        res['nseg'] = len(segs)
    for c in ('PH', 'hT', 'hE', 'hH'):
        items += [ev.V(o) + (c, o.name) for o in by[c]]
    gall = scan_core(ball_objs(items), True)
    res['best'] = {}
    for k, cl in TIERS.items():
        if res['tiers'][k] != 1:
            continue
        res['hold'][k] = tier_status(gall, cl, hold=True)
        if res['hold'][k] == -1 and k in need:
            raise Refine(need_objs(items, cl, hold=True))
        best = 0
        for cnt in gall:
            for sgn in (1, -1):
                if train_state(cnt, cl, sgn):
                    a_, b_ = (0, 1) if sgn > 0 else (1, 0)
                    best = max(best, min([(cnt['PH'][a_] + cnt['PH'][2]) / 2.0] + [cnt['h' + c][b_] + cnt['h' + c][2] for c in cl]))
        res['best'][k] = best
    return res


class Undecided(Exception):
    pass


def classify_sign(ev, O, loco):
    """sign family (minor).  Order: zeta, HEAT column (K3 read), characters (stop at the first strict conflict),
    T-NR, E_a, HEAT (Kpol read, only if needed).  Each object is refined on its own ladder."""
    pol = ev.pol
    by = {}
    for o in O:
        by.setdefault(o.grp, []).append(o)

    def sg(o):
        x = ev.sign(o)
        if x == 0:
            raise Undecided()
        return x
    res = dict(status='excl', tiers={k: 0 for k in TIERS}, hold={k: 0 for k in TIERS})
    sz = sg(by['P'][0])
    res['sz'] = sz
    rej = {}
    if not pol:
        rej['H'] = any(sg(o) != sz for o in by['H'])
        res['heat_rej'] = int(rej['H'])
        if not rej['H'] and not loco:
            res['why'] = 'HEATcol'
            return res
    for i, o in enumerate(by['P'][1:]):
        if sg(o) != sz:
            res['why'] = 'P'
            res['npos'] = i + 1
            return res
    res['onesigned'] = 1
    rej['T'] = any(sg(o) != sz for o in by['T'])
    if 'H' in rej:
        need_E = rej['T'] or rej['H']
    else:
        need_E = True
    rej['E'] = any(sg(o) != sz for o in by['E']) if need_E else False
    if 'H' not in rej:
        rej['H'] = any(sg(o) != sz for o in by['H']) if (rej['T'] or rej['E']) else False
    res['rej'] = {k: int(v) for k, v in rej.items()}
    for k, cl in TIERS.items():
        res['tiers'][k] = int(all(rej[c] for c in cl))
    if res['tiers']['full']:
        res['status'] = 'ttrain'
    if not any(res['tiers'].values()):
        res['why'] = 'C'
        return res
    nph = sum(1 for o in by['PH'] if sg(o) == sz)
    res['nph'] = nph
    opp = {}
    for k, cl in TIERS.items():
        if not res['tiers'][k]:
            continue
        for c in cl:
            if c not in opp:
                opp[c] = sum(1 for o in by['h' + c] if sg(o) != sz)
        res['hold'][k] = int(nph >= PH_MIN and all(opp[c] >= CL_MIN for c in cl))
    res['opp'] = opp
    return res


def decide(fam, node, pol, O, need=('full',), lazy=True, loco=False, soft=()):
    """classify one node with per-object refinement.  Tiers in `need` are decided up to the last rung; tiers in
    `soft` (two-class tiers of the recount) are refined only up to 1024 bits and reported -1 beyond."""
    ctx.prec = LADDER[0]
    ev = NodeEval(fam, node, pol)
    thr = ev.thr
    und = dict(status='undecided', tiers={k: -1 for k in TIERS}, hold={k: -1 for k in TIERS})
    cur_need = tuple(need) + tuple(soft)
    while True:
        ctx.prec = LADDER[ev.maxlev]            # breakpoints V1/V2 are formed at the highest precision in use
        try:
            if thr:
                r = classify_threshold(ev, O, need=cur_need, lazy=lazy)
            else:
                r = classify_sign(ev, O, loco)
            break
        except Undecided:
            r = und
            break
        except Refine as e:
            names = list(e.names)
            if soft and cur_need != tuple(need) and (not names or max(ev.level.get(n, 0) for n in names) >= 3):
                cur_need = tuple(need)          # stop refining for the two-class tiers
                continue
            if not names or not ev.bump(names):
                if cur_need != tuple(need):
                    cur_need = tuple(need)
                    continue
                r = und
                break
        except (ZeroDivisionError, ValueError, RuntimeError, AssertionError, OverflowError) as e:
            r = dict(und, err=repr(e))
            break
    ctx.prec = LADDER[0]
    r['prec'] = LADDER[ev.maxlev]
    return r


def ladder(fn, *a, **kw):
    """run fn on the precision ladder; a ball containing 0 or overlapping breakpoints raise the precision."""
    for pr in LADDER:
        ctx.prec = pr
        try:
            r = fn(*a, **kw)
            r['prec'] = pr
            return r
        except NeedPrec:
            continue
        except (ZeroDivisionError, ValueError, RuntimeError, AssertionError, OverflowError) as e:
            last = repr(e)
            continue
    ctx.prec = 128
    return dict(status='undecided', prec=LADDER[-1], tiers={k: -1 for k in TIERS}, hold={k: -1 for k in TIERS}, err=locals().get('last'))


# ---------------------------------------------------------------- draws
def draw_nodes(fam, pol, n, start=0, dev=False):
    """deterministic stream per (family, read); returns nodes start..start+n-1 (the stream is replayed).
    dev = True: a separate stream (seed offset 500) used only by the tests."""
    kind, m, thr = fam_info(fam)
    W = WIN[pol]
    fid = ['TM5', 'TM6', 'DM5', 'DM6', 'TMt5', 'TMt6', 'DMt5', 'DMt6', 'T3', 'T6'].index(fam)
    r = rng(10 + 2 * fid + int(pol) + (500 if dev else 0))
    out = []
    cnt = 0
    while len(out) < n:
        if kind in ('TM', 'DM'):
            nd = dict(u0=float(r.uniform(-W, W)), h=float(r.uniform(0.05, 1.2)))
            nd['g'] = 0.0 if fam.startswith('TMt') else float(r.uniform(-0.1, 0.1))
            if kind == 'TM':
                nd['k'] = float(r.uniform(0.05, 1.2)) * (1 if r.random() < 0.5 else -1)
            else:
                nd['cols'] = sorted(int(x) for x in r.choice(np.arange(1, 14), m, replace=False))
            xs = [nd['u0'] + i * nd['h'] + i * i * nd['g'] for i in range(m)]
            if any(xs[i + 1] <= xs[i] + 1e-3 for i in range(m - 1)):
                continue
        else:
            nd = dict(u=float(r.uniform(-W, W)), h=float(r.uniform(0.02, W / 2)))
        p = node_points_float(fam, nd)
        if max(abs(x) for x in p) > W:
            continue
        if cnt >= start:
            nd['id'] = ('dev%d' % cnt) if dev else cnt
            out.append(nd)
        cnt += 1
    return out


# ---------------------------------------------------------------- float64 scan for T3 / T6
def ball_log_phase(v):
    """ball -> (log modulus, sign or cos-phase carrier): returns (float log|v|, complex unit) from the midpoint."""
    if isinstance(v, acb):
        la = float(abs(acb(v.real.mid(), v.imag.mid())).log())
        z = complex(float((v.real.mid() / abs(acb(v.real.mid(), v.imag.mid()))).mid()),
                    float((v.imag.mid() / abs(acb(v.real.mid(), v.imag.mid()))).mid()))
        return la, z
    m = v.mid()
    return float(abs(m).log()), complex(1.0 if m > 0 else -1.0, 0.0)


def turan_logs(fam, node, pol, objs):
    """per object: (log|Mi|, cos factor) for the three monomials, from 128-bit balls (HEAT Kpol: float64 quadrature).
    Returns arrays L[nobj, 3], C[nobj, 3]."""
    pts = node_points(fam, node)
    ptf = node_points_float(fam, node)
    L = np.zeros((len(objs), 3))
    C = np.zeros((len(objs), 3))
    pairs = ((0, 0), (1, 2), (3, 4)) if fam == 'T3' else ((0, 1), (2, 3), (4, 5))
    for i, o in enumerate(objs):
        if o.kind == 'heat' and pol:
            kv = o.heat_float(ptf)
            lp = [(math.log(abs(x)), complex(1.0 if x > 0 else -1.0, 0)) for x in kv]
        elif o.kind == 'ea':
            la, sg = o.ea_float(ptf, pol)
            lp = [(float(x), complex(float(y), 0)) for x, y in zip(la, sg)]
        else:
            lp = [ball_log_phase(v) for v in o.vals(pts, pol)]
        for j, (a, b) in enumerate(pairs):
            L[i, j] = lp[a][0] + lp[b][0]
            C[i, j] = (lp[a][1] * lp[b][1]).real
    return L, C


def float_objs(sr, ell, s2, canc, grps, wide=None, tol=1e-12):
    """float64 intervals in the coordinate (sign r, sign r * log abs r)."""
    out = []
    for i in range(len(sr)):
        if not np.isfinite(ell[i]) or s2[i] == 0 or canc[i] > 1e9:
            out.append((None, None, 0, grps[i]))
            continue
        e = 50 * tol * (1.0 + canc[i]) * (1.0 + abs(ell[i]))
        if wide is not None and wide[i]:
            e = max(e, 5e-8 * (1.0 + abs(ell[i])))
        if sr[i] > 0:
            lo, hi = (1, ell[i] - e), (1, ell[i] + e)
        else:
            lo, hi = (-1, -(ell[i] + e)), (-1, -(ell[i] - e))
        out.append((lo, hi, int(s2[i]), grps[i]))
    return out


def float_items(L, C, srho):
    """V1 = M1 + mu M2 (mu = srho exp(L_zeta1 - L_zeta2); object 0 = zeta), V2 = M0, per object, in per-object
    units.  Returns sign r, log|r| (in units of zeta's M1/M0), sign V2, cancellation factor."""
    lmu = math.log(abs(srho)) + L[0, 0] - L[0, 1]
    a = L[:, 0]
    b = L[:, 1] + lmu
    mx = np.maximum(a, b)
    v = C[:, 0] * np.exp(a - mx) + math.copysign(1.0, srho) * C[:, 1] * np.exp(b - mx)
    with np.errstate(divide='ignore'):
        lV1 = mx + np.log(np.abs(v))
        lV2 = L[:, 2] + np.log(np.abs(C[:, 2]))
    s1 = np.sign(v)
    s2 = np.where(np.abs(C[:, 2]) < 1e-9, 0.0, np.sign(C[:, 2]))
    ell = lV1 - lV2 - (L[0, 0] - L[0, 2])
    with np.errstate(divide='ignore'):
        canc = 1.0 / np.abs(v) + 1.0 / np.abs(C[:, 2])
    return s1 * np.where(s2 == 0, 1.0, s2), ell, s2, canc


# ---------------------------------------------------------------- workers
TRAIN = ('P', 'T', 'E', 'H')


def turan_node(fam, nd, pol, O, ball=True):
    """one (u, h): float64 scan over the 18 values of mu and the whole threshold line; ball stage for every
    node-mu whose full tier is float64 T-train or float64-undecided, and for every node-mu with a two-class tier
    whose hold-out read is certified or undecided in float64.  Returns (counts dict, records list)."""
    ctx.prec = 128
    tr = [o for o in O if o.grp in TRAIN]
    ho = [o for o in O if o.grp not in TRAIN]
    L, C = turan_logs(fam, nd, pol, tr)
    gt = [o.grp for o in tr]
    wt = [(o.kind == 'heat' and pol) or o.kind == 'ea' for o in tr]
    Lr = float(L[0, 0] - L[0, 1])
    cnt = dict(n=0, posfeas=0, ball=0, b_excl=0, b_ttrain=0, b_undecided=0)
    for k in TIERS:
        for p in ('ft_', 'fu_', 'fh_', 'fhu_', 'bt_', 'bh_', 'bu_'):
            cnt[p + k] = 0
    recs = []
    LC = None
    for srho in RHO:
        cnt['n'] += 1
        ivs = scan_core(float_objs(*float_items(L, C, srho), gt, wt), False)
        if tier_status(ivs, ()) != 0:
            cnt['posfeas'] += 1
        tf = {k: tier_status(ivs, cl) for k, cl in TIERS.items()}
        for k in TIERS:
            cnt['ft_' + k] += int(tf[k] == 1)
            cnt['fu_' + k] += int(tf[k] == -1)
        hf = {k: 0 for k in TIERS}
        if any(v != 0 for v in tf.values()):
            if LC is None:
                Lh, Ch = turan_logs(fam, nd, pol, ho)
                LC = (np.vstack([L, Lh]), np.vstack([C, Ch]), gt + [o.grp for o in ho], wt + [(o.kind == 'heat' and pol) or o.kind == 'ea' for o in ho])
            gall = scan_core(float_objs(*float_items(LC[0], LC[1], srho), LC[2], LC[3]), False)
            for k, cl in TIERS.items():
                if tf[k] != 0:
                    hf[k] = tier_status(gall, cl, hold=True)
                    cnt['fh_' + k] += int(hf[k] == 1)
                    cnt['fhu_' + k] += int(hf[k] == -1)
        need = [k for k in TIERS if (k == 'full' and tf[k] != 0) or hf[k] != 0]
        if need and ball:
            cnt['ball'] += 1
            n2 = dict(nd, srho=srho, Lr=Lr)
            r = decide(fam, n2, pol, O, need=tuple(need), lazy=(need == ['full'] and tf['full'] == -1))
            cnt['b_' + r['status']] += 1
            for k in TIERS:
                cnt['bt_' + k] += int(r['tiers'][k] == 1)
                cnt['bh_' + k] += int(r['hold'][k] == 1)
                cnt['bu_' + k] += int(k in need and (r['tiers'][k] == -1 or r['hold'][k] == -1))
            if r['status'] != 'excl' or any(v == 1 for v in r['hold'].values()):
                recs.append(dict(node=n2, res=r, float=dict(t=tf, h=hf)))
            cnt['prec_%d' % r['prec']] = cnt.get('prec_%d' % r['prec'], 0) + 1
            if r.get('lazy'):
                cnt['b_lazy'] = cnt.get('b_lazy', 0) + 1
    return cnt, recs


def minor_node(fam, nd, pol, O, loco):
    kind, m, thr = fam_info(fam)
    if thr:
        r = decide(fam, nd, pol, O, need=('full',), lazy=not loco, soft=tuple(k for k in TIERS if k != 'full') if loco else ())
    else:
        r = decide(fam, nd, pol, O, loco=loco)
    cnt = dict(n=1)
    cnt['s_' + r['status']] = 1
    cnt['why_' + str(r.get('why'))] = 1
    cnt['prec_%d' % r['prec']] = 1
    for k in ('onesigned', 'posfeas', 'heat_rej', 'lazy'):
        if r.get(k):
            cnt[k] = 1
    if loco:
        cnt['loco_n'] = 1
        if r.get('onesigned') or r.get('posfeas'):
            cnt['loco_pos'] = 1
        for k in TIERS:
            cnt['lt_' + k] = int(r['tiers'][k] == 1)
            cnt['lh_' + k] = int(r['hold'][k] == 1)
        if r['status'] == 'undecided':
            cnt['loco_undecided'] = 1
    rec = None
    if r['status'] != 'excl' or any(v == 1 for v in r['tiers'].values()) or r.get('heat_rej'):
        rec = dict(node=nd, res=r)
    return cnt, rec
