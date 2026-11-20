# Ball-arithmetic evaluation of the canonical theta reduction (PR 50/54 eq. (1)) at a confluent anchor a,
# and of the seven "full class" signs at sample points t, for xi and for twins.
#
# Frequency side.  Lf(z) = int f(t) e^{zt/2} dt = int f e^{pt} dt, p = z/2.  D = d/dt  <->  -p,  z^2 <-> 4 D^2.
# Level pair (u_k, v_k):  L u_k, L v_k are combinations of
#     Phi_i := (4D^2-a^2)^{-i} kappa        (L Phi_i = F/(z^2-a^2)^i)
#     Psi_i := (4D^2-a^2)^{-i} C            (L Psi_i = (F'/z)/(z^2-a^2)^i),   C = (1/4) int_t^inf s kappa(s) ds
# Reduction:  b = (4D^2-a^2)^{-1}(r v - a u),  n = u - a b,  r = R(a) = a Lu(a)/Lv(a);  (u,v) <- (b,n).
# For i >= 1 the decaying solution is the one-sided convolution (difference is a homogeneous solution that decays
# superexponentially at +inf, hence zero):
#     ((p-beta)^{-m} f)(t) = I^beta_{m-1}[f](t) := int_0^inf tau^{m-1}/(m-1)! e^{beta tau} f(t+tau) dtau .
# Moments of a theta term e^{al0 s} y^j e^{-y}, y = lam e^s, come from the eps-expansion of the upper incomplete
# gamma function:  with X = e^t, z = lam X, c0 = beta + al0 + j,
#     I^beta_m = lam^j e^{-beta t} [eps^m] ( e^{-eps (t + log lam)} lam^{-c0} Gamma(c0+eps)
#                                           - X^{c0} e^{-z} sum_n z^n / prod_{i<=n} (c0+i+eps) ).
# Every truncation carries an explicit bound added to the ball radius.
import sys, math, time, json
from flint import arb, arb_series, ctx, fmpq

def Q(s):
    return fmpq(*[int(x) for x in s.split('/')]) if '/' in s else fmpq(int(s)) if s.lstrip('-').isdigit() else fmpq(int(round(float(s)*10**6)), 10**6)
def qa(q):
    return arb(q.p) / arb(q.q)
def f(x):
    return float(arb(x).mid())
def l2(x):
    x = abs(float(arb(x).abs_upper())) if not isinstance(x, float) else abs(x)
    return math.log2(x) if x > 0 else -1e9
def l2f(x):
    """log2 |x| as a float, safe for magnitudes outside the double range."""
    x = arb(x)
    m = abs(x.mid())
    if m == 0: return -1e18
    return float((m.log() / arb(2).log()).mid())
RHO = 128
def pm(r):
    return arb(0, r)          # ball [-r, r]

# ---------------------------------------------------------------- theta kernels
class Theta:
    def __init__(self, kind):
        self.kind = kind
        if kind == 'zeta':
            self.al0 = fmpq(1, 4); self.den = 1
        elif kind == 'dh':
            self.al0 = fmpq(3, 4); self.den = 5
        elif kind == 'chi4':
            self.al0 = fmpq(3, 4); self.den = 4
        else:
            raise ValueError(kind)
    def lam(self, n):
        return arb.pi() * n * n / self.den
    def lamf(self, n):
        return math.pi * n * n / self.den
    def poly(self, n):
        # dict j -> coefficient (arb) of y^j ; None if the term is absent
        if self.kind == 'zeta':
            return {1: arb(-3), 2: arb(2)}
        if self.kind == 'dh':
            if n % 5 == 0: return None
            kap = ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
            return {0: [None, arb(1), kap, -kap, arb(-1)][n % 5] * n}
        if self.kind == 'chi4':
            if n % 2 == 0: return None
            return {0: arb(n if n % 4 == 1 else -n)}
    def cabs(self, n):      # upper bound for sum |coef| over j, as float, valid for all n
        return 5.0 if self.kind == 'zeta' else float(n)
    def jmax(self):
        return 2 if self.kind == 'zeta' else 0

def kappa_jets(th, t, dmax, bits):
    """d^k/dt^k kappa(t), k = 0..dmax, as balls.  bits: relative target; terms kept while z_n - z_1 <= bits ln2."""
    X = arb(t).exp(); Xf = math.exp(float(t))
    al0 = qa(th.al0)
    out = [arb(0) for _ in range(dmax + 1)]
    z1 = th.lamf(1) * Xf
    n = 0
    while True:
        n += 1
        zf = th.lamf(n) * Xf
        if zf - z1 > bits * 0.6932 and n > 2 and zf > 4 * (dmax + 4):
            break
        p = th.poly(n)
        if p is None: continue
        y = th.lam(n) * X; e = (-y).exp()
        for k in range(dmax + 1):
            out[k] += sum(c * y ** j for j, c in p.items()) * e
            q = {}
            for j, c in p.items():
                q[j] = q.get(j, arb(0)) + c * (al0 + j); q[j + 1] = q.get(j + 1, arb(0)) - c
            p = q
    # tail n' >= n: |d^k term| <= cabs * (al0+J+y)^k-type bound; use crude  cabs(n) * (y+J+1)^(J+k) e^{-y}, J=jmax,
    # (each derivative multiplies the polynomial in y by at most (al0 + j + y) <= (y + J + k + 1)); geometric decay
    # of ratio <= 1/2 holds because y_{n+1}-y_n >= z1 (2n+1) and the polynomial factor grows by < (1+1/n)^{2(J+k)+1}.
    J = th.jmax()
    yN = th.lam(n) * X
    for k in range(dmax + 1):
        ratio = (1 + 1.0 / n) ** (2 * (J + k) + 1 + 2 * (J + k)) * math.exp(-z1 * (2 * n + 1))
        assert ratio < 0.5, ("tail ratio", ratio)
        bnd = 2 * th.cabs(n) * (yN + J + k + 1) ** (J + k) * (-yN).exp()
        out[k] += pm(bnd.abs_upper())
    ea = (al0 * arb(t)).exp()
    return [o * ea for o in out]

_gam_cache = {}
def gamma_series(c0q, M):
    key = (c0q.p, c0q.q, M, ctx.prec)
    if key not in _gam_cache:
        old = ctx.cap; ctx.cap = M + 1
        g = arb_series([qa(c0q), 1]).gamma()
        _gam_cache[key] = [g[m] for m in range(M + 1)]
        ctx.cap = old
    return _gam_cache[key]

def term_moments(lam, lamf_, t, betaq, al0q, j, M):
    """[eps^m] of X^{-eps} int_X^inf x^{c0+eps-1} e^{-lam x} dx  times lam^j e^{-beta t},  m = 0..M  (balls)."""
    c0q = betaq + al0q + j
    c0 = qa(c0q); c0f = float(c0q.p) / float(c0q.q)
    tt = arb(t); X = tt.exp(); z = lam * X; zf = lamf_ * math.exp(float(t))
    # part 1: e^{-eps(t+log lam)} lam^{-c0} Gamma(c0+eps)
    g = gamma_series(c0q, M)
    w = -(tt + lam.log())
    ex = [arb(1)]
    for m in range(1, M + 1): ex.append(ex[-1] * w / m)
    old = ctx.cap; ctx.cap = M + 1
    p1 = arb_series(g) * arb_series(ex)
    ctx.cap = old
    lc = (-c0 * lam.log()).exp()
    # part 2: X^{c0} e^{-z} sum_n z^n / prod_{i<=n}(c0+i+eps)
    s = []
    inv = 1 / c0; cur = inv
    for m in range(M + 1):
        s.append(cur); cur = -cur * inv
    acc = list(s)
    # distance of c0 to the nonpositive integers
    dmin = min(abs(c0f + i) for i in range(0, max(1, int(-c0f) + 3)))
    rho = dmin / 2
    n = 0
    logprod = -math.log(abs(c0f) - rho)       # log of z^n prod 1/(|c0+i|-rho)
    target = -(ctx.prec + 40) * 0.6932
    while True:
        n += 1
        d = c0 + n
        zi = z / d; di = 1 / d
        prev = arb(0)
        for m in range(M + 1):
            v = s[m] * zi - prev * di
            s[m] = v; prev = v; acc[m] += v
        logprod += math.log(zf) - math.log(abs(c0f + n) - rho)
        if n > 2 * zf + abs(c0f) + rho + 3 and logprod - M * math.log(rho) < target:
            break
    # tail: sum_{n'>n} z^{n'} rho^{-m} prod_{i<=n'} 1/(|c0+i|-rho) <= 2 * (next term), ratio <= 1/2 after n > 2z+...
    nb = arb(0)
    lb = arb(1)
    # rigorous value of z^{n+1} prod_{i<=n+1} 1/(|c0+i|-rho) via exp of an upper bound of its log
    lg = arb(0)
    for i in range(n + 2):
        lg += (z / (abs(c0 + i) - arb(rho))).log() if i > 0 else (1 / (abs(c0) - arb(rho))).log()
    tb = 2 * lg.exp()
    rinv = 1 / arb(rho)
    rp = arb(1)
    pref = (c0 * tt - z).exp()
    lj = lam ** j * (-qa(betaq) * tt).exp()
    out = []
    for m in range(M + 1):
        a2 = acc[m] + pm((tb * rp).abs_upper())
        rp = rp * rinv
        out.append(lj * (lc * p1[m] - pref * a2))
    return out

def moments(th, t, betas, M, bits, absk=False):
    """I^beta_m[kappa](t), m=0..M, for each beta in betas (fmpq).  dict beta_index -> list of balls."""
    Xf = math.exp(float(t)); z1 = th.lamf(1) * Xf
    res = [[arb(0) for _ in range(M + 1)] for _ in betas]
    cmax = max(0.0, max(float((bq + th.al0 + th.jmax()).p) / float((bq + th.al0 + th.jmax()).q) for bq in betas))
    n = 0
    while True:
        n += 1
        zf = th.lamf(n) * Xf
        if zf - z1 > bits * 0.6932 and n > 2 and zf > 8 and zf > 2 * cmax + 4:
            break
        p = th.poly(n)
        if p is None: continue
        lam = th.lam(n)
        for bi, bq in enumerate(betas):
            for j, c in p.items():
                tm = term_moments(lam, th.lamf(n), t, bq, th.al0, j, M)
                r = res[bi]
                cc = abs(c) if absk else c
                for m in range(M + 1): r[m] += cc * tm[m]
    # tail n' >= n:  |I_m term| <= cabs lam^J e^{-beta t} X^{-1} int_X^inf x^{c0} e^{-lam x} dx
    #                           <= cabs lam^J e^{-beta t} X^{c0-1} e^{-z} / (lam - max(c0,0)/X),   (u^m/m! <= e^u)
    # use the largest j (J) for lam^j (lam X >= 1 checked) and bound the sum by twice the first omitted term.
    J = th.jmax(); tt = arb(t); X = tt.exp()
    lamN = th.lam(n)
    assert th.lamf(n) * Xf > 1
    for bi, bq in enumerate(betas):
        c0 = qa(bq + th.al0 + J); c0f = float(c0.mid())
        ratio = (1 + 1.0 / n) ** (2 * J + 2 + 2 * max(c0f, 0) + 2) * math.exp(-z1 * (2 * n + 1))
        assert ratio < 0.5 and th.lamf(n) * Xf > 2 * max(c0f, 0) + 2, ("moment tail", ratio)
        bnd = 2 * th.cabs(n) * (lamN * X) ** J * (-qa(bq) * tt).exp() * (qa(bq + th.al0) * tt).exp() / X * (-lamN * X).exp() / (lamN / 2)
        b = pm(bnd.abs_upper())
        for m in range(M + 1): res[bi][m] += b
    return res

# ---------------------------------------------------------------- F series at z = a + x
def F_series(kind, aq, n, extra=None):
    """Taylor coefficients (balls) of F(a+x), F = L kappa up to a positive constant, order n."""
    old = ctx.cap; ctx.cap = n + 3
    x = arb_series([0, 1]); a = qa(aq)
    zz = a + x
    s = zz + arb(1) / 2
    if kind == 'zeta':
        F = (s * (s - 1) / 2) * (-(s / 2) * arb.pi().log() + (s / 2).lgamma()).exp() * s.zeta()
    elif kind == 'dh':
        kap = ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
        c = [1, kap, -kap, -1]
        ff = sum((s.zeta(arb(r + 1) / 5)) * c[r] for r in range(4))
        F = (-s * arb(5).log() + s / 2 * (arb(5) / arb.pi()).log() + ((s + 1) / 2).lgamma()).exp() * ff
    elif kind == 'chi4':
        ff = s.zeta(arb(1) / 4) - s.zeta(arb(3) / 4)
        F = (-s * arb(4).log() + s / 2 * (arb(4) / arb.pi()).log() + ((s + 1) / 2).lgamma()).exp() * ff
    out = [F[k] for k in range(n + 3)]
    ctx.cap = old
    return out

def smul(A, B, n):
    old = ctx.cap; ctx.cap = n
    r = arb_series(A) * arb_series(B)
    ctx.cap = old
    return [r[k] for k in range(n)]
def sdiv(A, B, n):
    old = ctx.cap; ctx.cap = n
    r = arb_series(A) / arb_series(B)
    ctx.cap = old
    return [r[k] for k in range(n)]
def sder(A):
    return [A[k] * k for k in range(1, len(A))]

# ---------------------------------------------------------------- function specs
class Spec:
    """base: Theta kind; shifts: [(shift arb-able str/None, weight)], init polys in w = z^2 for u0, v0:
       L u0 = PU(w) F'/z + QU(w) F,  L v0 = PV(w) F'/z + QV(w) F  (F is the transform of the shifted-sum kernel)."""
    def __init__(self, name):
        self.name = name
        self.PU = [arb(1)]; self.QU = [arb(0)]; self.PV = [arb(0)]; self.QV = [arb(1)]
        self.shifts = [(None, arb(1))]
        self.nr = None
        if name in ('zeta', 'dh', 'chi4'):
            self.base = name
        elif name.startswith('twin:'):      # twin:gamma:delta  -> xi * (1 - w/w1)(1 - w/conj w1), w1 = (delta + i gamma)^2
            parts = name.split(':')
            if len(parts) == 4: _, self.base, g, d = parts
            else:
                _, g, d = parts; self.base = 'zeta'
            g = arb(g); d = arb(d)
            re = d * d - g * g; im = 2 * d * g; mod2 = re * re + im * im      # w1 = re + i im
            Qw = [arb(1), -2 * re / mod2, 1 / mod2]
            self.PU = Qw; self.QU = [2 * Qw[1], 4 * Qw[2]]; self.PV = [arb(0)]; self.QV = Qw
        elif name.startswith('move:'):      # move:n:delta -> xi with the n-th zero pair moved to +-delta+-i gamma_n.
            # r-chain only (common factor P^2 multiplied into both transforms; kernels u,v are NOT those of the twin).
            _, nn, d = name.split(':')
            import mpmath as mp
            mp.mp.dps = 320
            gz = mp.zetazero(int(nn)).imag
            g = arb(mp.nstr(gz, 310)) + arb(0, 1e-300); d = arb(d)
            self.base = 'zeta'
            re_ = d * d - g * g; im = 2 * d * g; mod2 = re_ * re_ + im * im
            Qw = [arb(1), -2 * re_ / mod2, 1 / mod2]; Pw = [arb(1), 1 / (g * g)]
            pm_ = lambda A, B: [sum(A[i] * B[k - i] for i in range(len(A)) if 0 <= k - i < len(B)) for k in range(len(A) + len(B) - 1)]
            dw = lambda A: [A[k] * k for k in range(1, len(A))] or [arb(0)]
            QP = pm_(Qw, Pw)
            t1 = pm_(dw(Qw), Pw); t2 = pm_(Qw, dw(Pw))
            self.PU = QP; self.QU = [2 * (t1[k] - (t2[k] if k < len(t2) else 0)) for k in range(len(t1))]
            self.PV = [arb(0)]; self.QV = QP
        elif name.startswith('nr:'):        # nr:q:c -> xi(1/2+z) (q^z + q^-z + c)
            _, q, c = name.split(':')
            self.base = 'zeta'
            q = arb(q); c = arb(c)
            self.nr = (q, c)
            sh = 2 * q.log()
            self.shifts = [(None, c), (sh, arb(1)), (-sh, arb(1))]
        else:
            raise ValueError(name)
    def Fser(self, aq, n):
        F = F_series(self.base, aq, n)
        if self.nr:
            q, c = self.nr
            old = ctx.cap; ctx.cap = n + 3
            x = arb_series([0, 1]); zz = qa(aq) + x
            e = (zz * q.log()).exp(); g = e + 1 / e + c
            ctx.cap = old
            F = smul(F, [g[k] for k in range(n + 3)], n + 3)
        return F

def poly_shift(P, a2):
    """coefficients of P(D + a2) in powers of D."""
    out = [arb(0)] * len(P)
    out = list(out)
    for j, c in enumerate(P):
        # (D + a2)^j
        for i in range(j + 1):
            out[i] = out[i] + c * math.comb(j, i) * a2 ** (j - i)
    return out

def reduction(spec, aq, K):
    """returns r[0..K-1] and coefficient tables: for level k, dicts i -> coef for (uPsi, uPhi, vPsi, vPhi)."""
    a = qa(aq); n = K + 4
    F = spec.Fser(aq, n)
    Fp = sder(F) + [arb(0)]
    zser = [a, arb(1)] + [arb(0)] * (n + 1)
    Fpz = sdiv(Fp[:n + 2], zser[:n + 2], n + 2)
    wser = [a * a, 2 * a, arb(1)] + [arb(0)] * n
    def polyser(P):
        acc = [arb(0)] * (n + 2)
        pw = [arb(1)] + [arb(0)] * (n + 1)
        for c in P:
            acc = [acc[i] + c * pw[i] for i in range(n + 2)]
            pw = smul(pw, wser[:n + 2], n + 2)
        return acc
    def comb(P, Qp):
        A = smul(polyser(P), Fpz, n + 2); B = smul(polyser(Qp), F[:n + 2], n + 2)
        return [A[i] + B[i] for i in range(n + 2)]
    Su = comb(spec.PU, spec.QU); Sv = comb(spec.PV, spec.QV)
    a2 = a * a
    def vec(P):
        c = poly_shift(P, a2)
        return {-j: c[j] for j in range(len(c)) if not (c[j] == 0)}
    lev = [(vec(spec.PU), vec(spec.QU), vec(spec.PV), vec(spec.QV))]
    rs = []
    L = n + 2
    for k in range(K):
        r = a * Su[k] / Sv[k]
        rs.append(r)
        Sb = [arb(0)] * (k + 1) + [r * Sv[i] - a * Su[i] for i in range(k + 1, L)]
        Sn = [arb(0)] * (k + 1) + [2 * a * Su[i - 1] + (Su[i - 2] if i >= 2 else 0) - a * Sb[i] for i in range(k + 1, L)]
        uPs, uPh, vPs, vPh = lev[-1]
        def bvec(U, V):
            out = {}
            for i in set(U) | set(V):
                out[i + 1] = r * V.get(i, arb(0)) - a * U.get(i, arb(0))
            return out
        bPs = bvec(uPs, vPs); bPh = bvec(uPh, vPh)
        def nvec(U, Bv):
            out = {}
            for i in set(U) | set(Bv):
                out[i] = U.get(i, arb(0)) - a * Bv.get(i, arb(0))
            return out
        lev.append((bPs, bPh, nvec(uPs, bPs), nvec(uPh, bPh)))
        Su, Sv = Sb, Sn
    return rs, lev

# ---------------------------------------------------------------- basis jets at a point t
def pf_coeffs(aq, K):
    """g[e][i][n], n < i: Taylor coefficients at p = alpha of (alpha+x)^{-e} (2 alpha + x)^{-i}, e in {-1,0,1}; exact."""
    al = aq / 2
    g = {-1: {}, 0: {}, 1: {}}
    for i in range(1, K + 1):
        g0 = [fmpq((-1) ** n * math.comb(i + n - 1, n)) / aq ** (i + n) for n in range(i)]
        g[0][i] = g0
        g[-1][i] = [al * g0[n] + (g0[n - 1] if n else 0) for n in range(i)]
        # divide by (alpha + x): h_n = (g0_n - h_{n-1})/alpha
        h = []
        for n in range(i):
            h.append((g0[n] - (h[n - 1] if n else 0)) / al)
        g[1][i] = h
    return g

def basis_jets_ser(spec, aq, K, t, bits, ineg=2):
    """Second path (no partial fractions): (p^2-al^2)^{-i} = sum_m C(m+i-1,m) al^{2m} p^{-(2i+2m)}, 1/p^{j+1} <-> I^0_j.
    Unweighted iterated tail integrals only; tail of the m-series bounded with |I^0_j| <= rho^{-j} A_rho,
    A_rho = int_0^inf e^{rho tau} kappa_abs(t+tau) dtau (kappa_abs: theta series with |coefficients|)."""
    assert len(spec.shifts) == 1
    th = Theta(spec.base)
    a = qa(aq); a2 = a * a; al = aq / 2; alf = float(al.p) / float(al.q)
    rho = fmpq(RHO)
    rhof = float(rho.p)
    x2 = (alf / rhof) ** 2
    dmax = 4 + 2 * ineg + 1
    tt = arb(t)
    A = moments(th, tt, [rho], 0, bits, absk=True)[0][0]
    kj0 = kappa_jets(th, tt, 0, 64)[0]
    lA = l2f(A); lk = l2f(kj0); zf = th.lamf(1) * math.exp(float(t))
    lg2 = lambda n: math.lgamma(n + 1) / math.log(2)
    def enough(M0):
        if not x2 * (M0 + 1 + K) / (M0 + 2) * (1 + 2.0 / (2 * M0)) < 0.5: return False
        for i in (1, K):
            tail = 1 + lg2(M0 + i) - lg2(M0 + 1) - lg2(i - 1) + (2 * M0 + 2) * math.log2(alf) - (2 * i + 2 * M0 + 1) * math.log2(rhof) + lA
            proxy = lk - 2 * i * math.log2(4 * max(zf, 1.0)) - 2 * i
            if tail > proxy - bits - 40: return False
        return True
    M0 = 2
    while not enough(M0): M0 += 1
    Mm = 2 * K + 2 * M0 + 3
    I0 = moments(th, tt, [fmpq(0)], Mm + 1, bits)[0]
    kj = kappa_jets(th, tt, dmax, bits)
    F0 = [(tt * I0[j] + (j + 1) * I0[j + 1]) / 2 for j in range(Mm + 1)]
    rh = arb(rhof)
    bK = lambda j: A / rh ** j                                   # |I0_j| <=
    bF = lambda j: A / rh ** j * (abs(tt) + (j + 1) / rh) / 2    # |F0_j| <=
    Cj = [F0[0] / 2] + [-(tt * kj[d - 1] + ((d - 1) * kj[d - 2] if d >= 2 else 0)) / 4 for d in range(1, dmax + 1)]
    Phi = {0: kj[:dmax + 1]}; Psi = {0: Cj}
    for j in range(1, ineg + 1):
        P = Phi[-j + 1]; S = Psi[-j + 1]
        Phi[-j] = [4 * P[d + 2] - a2 * P[d] for d in range(len(P) - 2)]
        Psi[-j] = [4 * S[d + 2] - a2 * S[d] for d in range(len(S) - 2)]
    alq2 = al * al
    for i in range(1, K + 1):
        s4 = arb(1) / arb(4) ** i
        ph = arb(0); ph1 = arb(0); ps = arb(0); ps1 = arb(0)
        c = fmpq(1)                       # C(m+i-1,m) al^{2m}
        for m in range(M0 + 1):
            ca = qa(c)
            ph += ca * I0[2 * i + 2 * m - 1]; ph1 += ca * I0[2 * i + 2 * m - 2]
            ps += ca * F0[2 * i + 2 * m]; ps1 += ca * F0[2 * i + 2 * m - 1]
            c = c * (m + i) / (m + 1) * alq2
        ca = qa(c)                        # first omitted coefficient (m = M0+1); ratios < 1/2 (asserted in M0 loop)
        m = M0 + 1
        ph += pm((2 * ca * bK(2 * i + 2 * m - 1)).abs_upper()); ph1 += pm((2 * ca * bK(2 * i + 2 * m - 2)).abs_upper())
        ps += pm((2 * ca * bF(2 * i + 2 * m)).abs_upper()); ps1 += pm((2 * ca * bF(2 * i + 2 * m - 1)).abs_upper())
        ph = ph * s4; ph1 = -ph1 * s4; ps = ps * s4 / 2; ps1 = -ps1 * s4 / 2
        Pp = Phi[i - 1]; Sp = Psi[i - 1]
        J = [ph, ph1]; Jp = [ps, ps1]
        for d in range(2, 5):
            J.append((a2 * J[d - 2] + Pp[d - 2]) / 4)
            Jp.append((a2 * Jp[d - 2] + Sp[d - 2]) / 4)
        Phi[i] = J; Psi[i] = Jp
    return Phi, Psi

def basis_jets(spec, aq, K, t, bits, ineg=2, g=None):
    """jets (orders 0..4) of Phi_i, Psi_i, i = -ineg..K at t.  returns (Phi, Psi) dict i -> [5 balls]."""
    th = Theta(spec.base)
    a = qa(aq); a2 = a * a; al = aq / 2
    M = K + 1
    dmax = 4 + 2 * ineg + 1
    tt = arb(t)
    Ia = [arb(0)] * (M + 1); Im = [arb(0)] * (M + 1); I0 = [arb(0)] * 2
    kj = [arb(0)] * (dmax + 1)
    for sh, wgt in spec.shifts:
        ts = tt if sh is None else tt + sh
        mo = moments(th, ts, [al, -al], M, bits)
        m0 = moments(th, ts, [fmpq(0)], 1, bits)[0]
        jj = kappa_jets(th, ts, dmax, bits)
        Ia = [Ia[m] + wgt * mo[0][m] for m in range(M + 1)]
        Im = [Im[m] + wgt * mo[1][m] for m in range(M + 1)]
        I0 = [I0[m] + wgt * m0[m] for m in range(2)]
        kj = [kj[d] + wgt * jj[d] for d in range(dmax + 1)]
    # f1 = t kappa / 2 moments
    Fa = [(tt * Ia[m] + (m + 1) * Ia[m + 1]) / 2 for m in range(M)]
    Fm = [(tt * Im[m] + (m + 1) * Im[m + 1]) / 2 for m in range(M)]
    F00 = (tt * I0[0] + I0[1]) / 2
    Cj = [F00 / 2] + [-(tt * kj[d - 1] + ((d - 1) * kj[d - 2] if d >= 2 else 0)) / 4 for d in range(1, dmax + 1)]
    Phi = {0: kj[:dmax + 1]}; Psi = {0: Cj}
    for j in range(1, ineg + 1):
        P = Phi[-j + 1]; S = Psi[-j + 1]
        Phi[-j] = [4 * P[d + 2] - a2 * P[d] for d in range(len(P) - 2)]
        Psi[-j] = [4 * S[d + 2] - a2 * S[d] for d in range(len(S) - 2)]
    if g is None: g = pf_coeffs(aq, K)
    alq = al
    for i in range(1, K + 1):
        s4 = arb(1) / arb(4) ** i
        g0 = g[0][i]; gm = g[-1][i]; g1 = g[1][i]
        ph = arb(0); ph1 = arb(0); ps = arb(0); ps1 = arb(0)
        for m in range(1, i + 1):
            sg = 1 if m % 2 == 0 else -1
            c0 = qa(g0[i - m]); cm = qa(gm[i - m]); c1 = qa(g1[i - m])
            ph += c0 * (Ia[m - 1] + sg * Im[m - 1])
            ph1 += cm * (Ia[m - 1] - sg * Im[m - 1])
            ps += c1 * (Fa[m - 1] - sg * Fm[m - 1])
            ps1 += c0 * (Fa[m - 1] + sg * Fm[m - 1])
        c00 = 1 / qa((-(alq * alq)) ** i)
        ph = ph * s4; ph1 = -ph1 * s4
        ps = (ps + c00 * F00) * s4 / 2; ps1 = -ps1 * s4 / 2
        Pp = Phi[i - 1]; Sp = Psi[i - 1]
        J = [ph, ph1]; Jp = [ps, ps1]
        for d in range(2, 5):
            J.append((a2 * J[d - 2] + Pp[d - 2]) / 4)
            Jp.append((a2 * Jp[d - 2] + Sp[d - 2]) / 4)
        Phi[i] = J; Psi[i] = Jp
    return Phi, Psi

GATES = ["u>0", "v>0", "H'<0", "B'>0", "J'>0", "HBconv", "JBconv"]
def gate_values(u, v):
    q = lambda f0, f1, g0, g1: (f1 * g0 - f0 * g1) / g0 ** 2
    def q2(f0, f1, f2, g0, g1, g2): return (f2 * g0 - f0 * g2) / g0 ** 2 - 2 * g1 * (f1 * g0 - f0 * g1) / g0 ** 3
    H1 = q(u[0], u[1], v[0], v[1]); B1 = 4 * q(u[2], u[3], v[0], v[1]); J1 = 4 * q(v[2], v[3], v[0], v[1])
    H2 = q2(u[0], u[1], u[2], v[0], v[1], v[2]); B2 = 4 * q2(u[2], u[3], u[4], v[0], v[1], v[2]); J2 = 4 * q2(v[2], v[3], v[4], v[0], v[1], v[2])
    return [u[0], v[0], -H1, B1, J1, H2 * B1 - H1 * B2, J2 * B1 - J1 * B2]

def sgn(x):
    if x > 0: return '+'
    if x < 0: return '-'
    return '?'

def level_jets(lev, Phi, Psi):
    uPs, uPh, vPs, vPh = lev
    u = [arb(0)] * 5; v = [arb(0)] * 5
    for i, c in uPs.items():
        u = [u[d] + c * Psi[i][d] for d in range(5)]
    for i, c in uPh.items():
        u = [u[d] + c * Phi[i][d] for d in range(5)]
    for i, c in vPs.items():
        v = [v[d] + c * Psi[i][d] for d in range(5)]
    for i, c in vPh.items():
        v = [v[d] + c * Phi[i][d] for d in range(5)]
    return u, v

def run_point(args):
    name, astr, K, t, bits, prec = args[:6]
    mode = args[6] if len(args) > 6 else 'pf'
    ctx.prec = prec
    spec = Spec(name); aq = Q(astr)
    t0 = time.time()
    rs, lev = reduction(spec, aq, K)
    Phi, Psi = basis_jets(spec, aq, K, t, bits) if mode == 'pf' else basis_jets_ser(spec, aq, K, t, bits)
    rows = []
    for k in range(K + 1):
        u, v = level_jets(lev[k], Phi, Psi)
        gv = gate_values(u, v)
        rows.append({"k": k, "s": "".join(sgn(x) for x in gv),
                     "lg": [round(l2f(x) / 3.3219, 1) for x in gv],
                     "rel": max(round((l2f(x.rad()) - l2f(x)) / 3.3219, 0) for x in [u[0], v[0]]),
                     "u0": u[0].str(8), "v0": v[0].str(8)})
    return {"name": name, "a": astr, "mode": mode, "t": str(t), "K": K, "prec": prec, "bits": bits,
            "r_sign": "".join(sgn(r) for r in rs), "r": [r.str(8) for r in rs],
            "rows": rows, "sec": round(time.time() - t0, 1)}

if __name__ == "__main__":
    name, astr, K, bits, prec = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
    ts = sys.argv[6].split(',')
    nproc = int(sys.argv[7]) if len(sys.argv) > 7 else 1
    out = sys.argv[8] if len(sys.argv) > 8 else None
    mode = sys.argv[9] if len(sys.argv) > 9 else 'pf'
    jobs = [(name, astr, K, t, bits, prec, mode) for t in ts]
    if nproc > 1:
        import multiprocessing as mp
        with mp.Pool(nproc) as pool: res = pool.map(run_point, jobs, chunksize=1)
    else:
        res = [run_point(j) for j in jobs]
    if out:
        json.dump(res, open(out, "w"))
    for R in res:
        print("##", R["name"], "a=" + R["a"], "t=" + R["t"], "prec", R["prec"], "sec", R["sec"])
        print("   r signs:", R["r_sign"])
        for row in R["rows"]:
            print("   k=%3d  %s  rel10^%d  u=%s v=%s" % (row["k"], row["s"], row["rel"], row["u0"], row["v0"]))
