"""Window information law: exact test of the complete band-u positivity device in ball arithmetic.

Hilbert space H = L^2[-u/2, u/2], v_z(s) = exp(i s z).  For a conjugation-symmetric multiset Z the quadratic form
of the device is <h, T_Z h>, T_Z = sum_z |v_z><v_conj z|.  Background operator
    T0' = 2M + (lattice of spacing 2 pi/Lg through 0)      (explicit inverse, fibrewise)
    T0  = T0' + sum over zeta ordinates in W |v><v| - sum over lattice points in W |v><v|
Cluster: pairs x_j +- i b_j (coefficient +1, involution), removed on-line ordinates (coefficient -1).
T0 + T_cluster >= 0  iff  Rh K Rh + Rh >= 0, Rh = E^* T0^{-1} E in the real basis E, K = diag(+1, -1, -1).
All arithmetic: python-flint arb/acb.  The verdict of test() is rigorous for the synthetic set defined by the
stored floats: 'pass' = all LDL pivots certified > 0, 'fail' = one pivot certified < 0, 'undecided' otherwise.
"""
import json, math, os, sys
from flint import arb, acb, arb_mat, acb_mat, ctx

HERE = os.path.dirname(os.path.abspath(__file__))

def ldl_sign(Mx):
    """Mx: list of lists of arb (symmetric). Returns 'pass' / 'fail' / 'undecided'."""
    n = len(Mx)
    A = [row[:] for row in Mx]
    for k in range(n):
        p = A[k][k]
        if p > 0:
            pass
        elif p < 0:
            return 'fail'
        else:
            return 'undecided'
        inv = 1 / p
        rowk = A[k]
        for i in range(k + 1, n):
            f = A[i][k] * inv
            if f == 0:
                continue
            rowi = A[i]
            for j in range(i, n):
                rowi[j] = rowi[j] - f * rowk[j]
            # keep symmetric copy
        for i in range(k + 1, n):
            for j in range(i + 1, n):
                A[j][i] = A[i][j]
    return 'pass'

class Device:
    def __init__(self, u, Lg=None, M=0.0):
        """u: band (arb/float). Lg: lattice background strength (None: no lattice, tolerance only). M: tolerance."""
        self.u = arb(u)
        self.M = arb(M)
        self.Lg = None if Lg is None else arb(Lg)
        self.terms = []
        half = self.u / 2
        if self.Lg is None:
            if not (self.M > 0):
                raise ValueError("no background and M = 0")
            self.terms.append((0, 1 / (2 * self.M), -half, half))
            return
        uf, Lf = float(self.u), float(self.Lg)
        J = int(math.floor(uf / Lf + 1e-12))
        if abs(uf / Lf - round(uf / Lf)) < 1e-9 and round(uf / Lf) >= 1:
            raise ValueError("u is a multiple of Lg: boundary case not handled")
        bps = [(-uf / 2, -half), (uf / 2, half)]
        for j in range(1, J + 1):
            bps.append((uf / 2 - j * Lf, half - j * self.Lg))
            bps.append((-uf / 2 + j * Lf, -half + j * self.Lg))
        bps.sort(key=lambda t: t[0])
        for (f1, s1), (f2, s2) in zip(bps[:-1], bps[1:]):
            mid = (f1 + f2) / 2
            ms = [m for m in range(-J - 1, J + 2) if -uf / 2 < mid - m * Lf < uf / 2]
            k = len(ms)
            if k == 1:
                diag, off = 1 / (2 * self.M + self.Lg), None
            else:
                if not (self.M > 0):
                    raise ValueError("u > Lg needs M > 0")
                diag = (2 * self.M + (k - 1) * self.Lg) / (2 * self.M * (2 * self.M + k * self.Lg))
                off = -self.Lg / (2 * self.M * (2 * self.M + k * self.Lg))
            for m in ms:
                self.terms.append((m, diag if m == 0 else off, s1, s2))

    def _prep(self):
        """Group the terms: R = (1/(i zeta)) sum_m phase_m(b) sum_k w[m][k] exp(i zeta s_k)."""
        bps, key = [], {}
        def idx(s):
            f = round(float(s), 12)
            if f not in key:
                key[f] = len(bps); bps.append(s)
            return key[f]
        w = {}
        for (m, coef, s1, s2) in self.terms:
            d = w.setdefault(m, {})
            k1, k2 = idx(s1), idx(s2)
            d[k2] = d.get(k2, arb(0)) + coef
            d[k1] = d.get(k1, arb(0)) - coef
        self._bps, self._w = bps, w

    def Rfast(self, a, b):
        """Same as R for zeta = b - conj(a) != 0 (points off the line or distinct)."""
        if not hasattr(self, '_bps'):
            self._prep()
        zeta = b - a.conjugate()
        iz = acb(0, 1) * zeta
        E = [(iz * s).exp() for s in self._bps]
        tot = acb(0)
        for m, d in self._w.items():
            part = acb(0)
            for k, c in d.items():
                part += c * E[k]
            if m != 0:
                part = part * (acb(0, -1) * b * m * self.Lg).exp()
            tot += part
        return tot / iz

    def R(self, a, b):
        """<v_a, T0'^{-1} v_b> for complex a, b (acb)."""
        zeta = b - a.conjugate() if isinstance(a, acb) else b - a
        tot = acb(0)
        for (m, coef, s1, s2) in self.terms:
            val = coef * (s2 - s1) * (acb(0, 1) * zeta * (s1 + s2) / 2).exp() * (zeta * (s2 - s1) / 2).sinc()
            if m != 0:
                val = val * (acb(0, -1) * b * m * self.Lg).exp()
            tot += val
        return tot

    def set_online(self, plus, minus):
        """plus: on-line ordinates added to the lattice (coefficient +1); minus: lattice points removed (-1)."""
        self.o_pts = [acb(x) for x in plus] + [acb(x) for x in minus]
        self.o_c = [1] * len(plus) + [-1] * len(minus)
        n = len(self.o_pts)
        if n == 0:
            self.X = None
            return
        print("planned: on-line block %d x %d arb entries at %d bits (about %.2f GB)" % (n, n, ctx.prec, n * n * (ctx.prec / 8 + 48) * 2 / 1e9), flush=True)
        rows = [[None] * n for _ in range(n)]
        for i in range(n):
            for j in range(i, n):
                r = self.R(self.o_pts[i], self.o_pts[j]).real
                rows[i][j] = r
                rows[j][i] = r
            rows[i][i] = rows[i][i] + self.o_c[i]
        self.X = acb_mat(arb_mat(rows).inv())

    def rtilde(self, pts):
        """V^* T0^{-1} V for the columns v_p, p in pts (list of acb)."""
        n = len(pts)
        offline = [not (p.imag == 0) for p in pts]
        Rcc = [[None] * n for _ in range(n)]
        for i in range(n):
            for j in range(i, n):
                if offline[i] or offline[j]:
                    r = self.Rfast(pts[i], pts[j]) if not (i == j or (offline[i] and offline[j] and float(abs(pts[j] - pts[i].conjugate()).mid()) < 1e-9)) else self.R(pts[i], pts[j])
                else:
                    r = self.R(pts[i], pts[j])
                Rcc[i][j] = r
                Rcc[j][i] = r.conjugate()
        Rcc = acb_mat(Rcc)
        if self.X is not None:
            # rows of conjugate partners: <v_conj(p), W v_o> = conj <v_p, W v_o> for real o (W commutes with h -> conj h(-s))
            rows = []
            i = 0
            while i < n:
                if offline[i] and i + 1 < n and offline[i + 1] and (pts[i + 1] - pts[i].conjugate()).contains(0):
                    row = [self.Rfast(pts[i], o) for o in self.o_pts]
                    rows.append(row); rows.append([r.conjugate() for r in row])
                    i += 2
                else:
                    rows.append([(self.Rfast(pts[i], o) if offline[i] else self.R(pts[i], o)) for o in self.o_pts])
                    i += 1
            Rco = acb_mat(rows)
            Rcc = Rcc - Rco * self.X * Rco.conjugate().transpose()
        return Rcc

    def test(self, pairs, removed=()):
        """pairs: list of (x, b) with b > 0; removed: on-line ordinates removed. Returns verdict string."""
        pts, K = [], []
        for (x, b) in pairs:
            pts.append(acb(x, b)); pts.append(acb(x, -b))
            K += [1, -1]
        for x in removed:
            pts.append(acb(x)); K.append(-1)
        n = len(pts)
        Rt = self.rtilde(pts)
        # real basis: (v_z + v_zbar)/sqrt2, i (v_z - v_zbar)/sqrt2, v_removed
        U = [[acb(0)] * n for _ in range(n)]
        r2 = arb(2).sqrt()
        for j in range(len(pairs)):
            U[2 * j][2 * j] = acb(1) / r2;      U[2 * j + 1][2 * j] = acb(1) / r2
            U[2 * j][2 * j + 1] = acb(0, 1) / r2; U[2 * j + 1][2 * j + 1] = acb(0, -1) / r2
        for j in range(2 * len(pairs), n):
            U[j][j] = acb(1)
        U = acb_mat(U)
        Rh = U.conjugate().transpose() * Rt * U
        Kd = acb_mat([[acb(K[i]) if i == j else acb(0) for j in range(n)] for i in range(n)])
        Mx = Rh * Kd * Rh + Rh
        im = max((abs(float(Mx[i, j].imag.mid())) + float(Mx[i, j].imag.rad())) / (1e-300 + abs(float(Mx[i, i].real.mid()) * float(Mx[j, j].real.mid())) ** 0.5) for i in range(n) for j in range(n)) if n <= 12 else 0.0
        self.last_imag = im
        rows = [[(Mx[i, j].real + Mx[j, i].real) / 2 for j in range(n)] for i in range(n)]
        return ldl_sign(rows)

def threshold(testfun, lo, hi, steps=10):
    """Largest s in [lo, hi] with testfun(s) == 'pass', by bisection (assumes an interval of passing values from lo)."""
    v = testfun(hi)
    if v == 'pass':
        return hi, 'cap'
    v0 = testfun(lo)
    if v0 != 'pass':
        return None, 'lo:' + v0
    note = ''
    for _ in range(steps):
        mid = (lo + hi) / 2
        v = testfun(mid)
        if v == 'pass':
            lo = mid
        else:
            hi = mid
            if v == 'undecided':
                note = 'undecided-seen'
    return lo, note

def load_zeros(T):
    for d in (HERE, os.path.join(HERE, '..', 'c16-ctheta-proposition5-power-sum')):
        p = os.path.join(d, 'zeros_%g.json' % T)
        if os.path.exists(p):
            return json.load(open(p))['zeros_minus_T']
    raise FileNotFoundError(T)

def zeta_device(T, theta, M, H):
    Tb = arb(T)
    Lg = (Tb / (2 * arb.pi())).log()
    u = theta * Tb.log()
    dev = Device(u, Lg, M)
    zs = [g for g in load_zeros(T) if abs(g) <= H]
    d = float(2 * arb.pi() / Lg)
    jmax = int(H / d)
    lat = [(2 * arb.pi() / Lg) * j for j in range(-jmax, jmax + 1)]
    dev.set_online(zs, lat)
    dev.zeros = zs
    return dev
