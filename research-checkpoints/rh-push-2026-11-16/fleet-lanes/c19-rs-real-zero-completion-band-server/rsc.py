# rsc.py: shared functions. Forms of positive measures (point sets + density on an interval) on m Fourier modes of [0, U],
# band-limited to shifts < b; prime-side moments; ball enclosures of extreme eigenvalues. python-flint balls, 128 bits.
import math, json
import numpy as np
from flint import arb, acb, arb_mat, ctx
import tz

ctx.prec = 128
PI = arb.pi()
LOGPI = PI.log()
LW = 720.0
S_WIN = 128.0
EULER = arb.const_euler()


def nodes_off(U, m):
    D = 2 * PI / U
    return [(j - arb(m - 1) / 2) * D for j in range(m)], D


def zacc(yj, U, b, dgs, same):
    """Point set {t_w + dg}: band-b part of sum |v_g><v_g| on modes with offsets yj. Returns (imF, diag) lists (not divided by U).
    imF_j = sum (1 - cos(b y))/y ; diag_j = sum 2 (U - b) sin(b y)/y + 2 (1 - cos(b y))/y^2 , y = dg - y_j."""
    m = len(yj)
    cj = [(b * y).cos() for y in yj]
    sj = [(b * y).sin() for y in yj]
    imF = [arb(0)] * m
    dg_ = [arb(0)] * m
    Ub2 = 2 * (U - b)
    one = arb(1)
    for g in dgs:
        ga = arb(float(g))
        bg = b * ga
        cg = bg.cos()
        sg = bg.sin()
        if same:
            for j in range(m):
                y = ga - yj[j]
                q = (one - cg * cj[j] - sg * sj[j]) / y
                imF[j] += q
                dg_[j] += 2 * q / y
        else:
            for j in range(m):
                y = ga - yj[j]
                q = (one - cg * cj[j] - sg * sj[j]) / y
                imF[j] += q
                dg_[j] += (Ub2 * (sg * cj[j] - cg * sj[j]) + 2 * q) / y
    return imF, dg_


def cin(z):
    """Cin(z) = int_0^z (1 - cos t)/t dt for z > 0."""
    return EULER + z.log() - z.ci()


def rhoacc(yj, U, b, r0, r1, lw=LW):
    """Density rho(t_w + d) = r0 + r1 d on abs(d) <= lw: band-b part of int rho |v_x><v_x| dx. Returns (imF, diag)."""
    m = len(yj)
    imF, dg_ = [], []
    lw = arb(lw)
    for j in range(m):
        y1 = -lw - yj[j]
        y2 = lw - yj[j]
        c0 = r0 + r1 * yj[j]
        cin2, cin1 = cin(b * abs(y2)), cin(b * abs(y1))
        si2, si1 = (b * y2).si(), (b * y1).si()
        c2, c1 = (b * y2).cos(), (b * y1).cos()
        s2, s1 = (b * y2).sin(), (b * y1).sin()
        imF.append(c0 * (cin2 - cin1) + r1 * ((y2 - s2 / b) - (y1 - s1 / b)))
        dg_.append(c0 * (2 * (U - b) * (si2 - si1) + 2 * (-(1 - c2) / y2 + (1 - c1) / y1 + b * (si2 - si1)))
                   + r1 * (2 * (U - b) * (-c2 + c1) / b + 2 * (cin2 - cin1)))
    return imF, dg_


def assemble(m, D, U, imF, dg_):
    A = arb_mat(m, m)
    for j in range(m):
        A[j, j] = dg_[j] / U
        for k in range(j + 1, m):
            v = 2 * (imF[k] - imF[j]) / ((k - j) * D) / U
            A[j, k] = v
            A[k, j] = v
    return A


def sub_acc(a, b_):
    return [x - y for x, y in zip(a[0], b_[0])], [x - y for x, y in zip(a[1], b_[1])]


def rho_chord(tw, kind="zeta", lw=LW):
    """chord of rho = vartheta'/pi through the end points of J (rho concave: chord <= rho on J)."""
    def rho(t):
        if kind == "zeta":
            return (acb(arb(1) / 4, arb(t) / 2).digamma().real / 2 - LOGPI / 2) / PI
        return (acb(arb(3) / 4, arb(t) / 2).digamma().real / 2 + (arb(5) / PI).log() / 2) / PI
    a, b_ = rho(arb(tw) - arb(lw)), rho(arb(tw) + arb(lw))
    return (a + b_) / 2, (b_ - a) / (2 * arb(lw))


# ---------- enclosures ----------
def spec(A, scale=1.0):
    """Extreme eigenvalues of the symmetric ball matrix A, divided by scale.
    A = A_mid + R, norm(R) <= d = Frobenius norm of the radii. lambda_min(A_mid) >= c is certified by strict diagonal dominance
    of V^T (A_mid - c) V (V = float eigenvectors as exact numbers); upper bound by the ball Rayleigh quotient. Same for lambda_max."""
    m = A.nrows()
    mids = [[A[i, j].mid() for j in range(m)] for i in range(m)]
    r2 = 0.0
    for i in range(m):
        for j in range(m):
            r = float(A[i, j].rad())
            r2 += r * r
    d = math.sqrt(r2) * 1.0001 + 1e-30
    An = np.array([[float(x) for x in row] for row in mids])
    An = (An + An.T) / 2
    ev, V = np.linalg.eigh(An)
    Am = arb_mat(m, m, [x for row in mids for x in row])
    Vb = arb_mat(m, m, [arb(float(x)) for x in V.ravel()])
    Vt = Vb.transpose()
    C = Vt * Am * Vb
    G = Vt * Vb
    nrm = max(abs(ev[0]), abs(ev[-1]), 1e-300)

    def dom(sign, c):
        # sign = +1: A_mid - c > 0 ; sign = -1: c - A_mid > 0
        Dm = (C - G * arb(c)) if sign > 0 else (G * arb(c) - C)
        for i in range(m):
            s = Dm[i, i]
            for j in range(m):
                if j != i:
                    s -= abs(Dm[i, j])
            if not (s > 0):
                return False
        return True
    out = {"d": d / scale}
    lam = float(ev[0])
    lo = None
    tol = 1e-11 * nrm
    for _ in range(9):
        if dom(+1, lam - tol):
            lo = lam - tol - d
            break
        tol *= 10
    hi = float((C[0, 0] / G[0, 0]).upper()) + d
    out.update(min=lam / scale, min_lo=(lo / scale if lo is not None else None), min_hi=hi / scale)
    lam = float(ev[-1])
    up = None
    tol = 1e-11 * nrm
    for _ in range(9):
        if dom(-1, lam + tol):
            up = lam + tol + d
            break
        tol *= 10
    lo2 = float((C[m - 1, m - 1] / G[m - 1, m - 1]).lower()) - d
    out.update(max=lam / scale, max_lo=lo2 / scale, max_hi=(up / scale if up is not None else None))
    return out


def madd(*mats):
    A = mats[0]
    for B in mats[1:]:
        A = A + B
    return A


# ---------- prime side ----------
def radfac(X):
    return 2e-14 + 2.4e-16 * min(X / 512.0 + 1, 1.3 * 2 ** 21 / math.log(max(X, 3.0)))


def cell_of(x):
    return int(math.floor(math.log(float(x)) * 512.0))


def cellsum(main, bnd, obj, w, Xb):
    """cell moments of sum over n <= Xb for object obj and window index w. main: files covering n-ranges disjointly; bnd: boundary-cell files."""
    cb = cell_of(Xb)
    Qn = main[0].Q
    cover = max(F.XMAX for F in main if obj < F.NOBJ and (obj == 0 or F.XCHAIN >= min(F.XMAX, Xb)))
    reg = [F for F in list(main) + list(bnd) if Xb in F.XB and obj < F.NOBJ]
    if cover < Xb - 1 and not reg:
        return None, None
    Mc = np.zeros((cb + 1, Qn), dtype=np.complex128)
    for F in main:
        if obj < F.NOBJ and F.XSTART <= Xb:
            F.add_cells(Mc, obj, w, cb)
    if reg:
        for F in reg:
            e = F.EX[F.XB.index(Xb), obj, w]
            Mc[cb] += e[..., 0] + 1j * e[..., 1]
    else:
        if cover > Xb:
            raise RuntimeError("boundary %d not registered and files extend beyond it" % Xb)
        for F in main:
            if obj < F.NOBJ and F.C0 <= cb < F.C0 + F.NC:
                g = F.G[obj, cb - F.C0, w]
                Mc[cb] += g[..., 0] + 1j * g[..., 1]
    ac = (np.arange(cb + 1) + 0.5) / 512.0
    return Mc, ac


def meval(Mc, ac, y):
    """chunked tz.Moments.eval"""
    y = np.asarray(y, dtype=np.complex128)
    D = np.empty(len(y), dtype=np.complex128)
    D1 = np.empty(len(y), dtype=np.complex128)
    step = max(1, int(2e7 // max(1, len(ac))))
    for a in range(0, len(y), step):
        D[a:a + step], D1[a:a + step] = tz.Moments.eval(Mc, ac, y[a:a + step])
    return D, D1


def prime_rad(Xb, ymax, a=0.0):
    """radius of a moment sum over Lambda(n) n^(-1/2 +- a) terms, n <= Xb, evaluated at abs(offset) <= ymax:
    c18 rounding formula times sum abs(amp) <= 2.08 sqrt(Xb) (Chebyshev), plus the remainder of the 8-term expansion."""
    sabs = 2.08 * math.sqrt(Xb) * Xb ** a
    return sabs * (radfac(Xb) + ((ymax + a) / 1024.0) ** 8 / 40320.0 * math.exp((ymax + a) / 1024.0))


def ball_list(vals, rad):
    return [acb(arb(float(v.real), rad), arb(float(v.imag), rad)) for v in vals]


def prime_form(m, D, U, Mc, ac, yfl, Xb, a=None, sabs=None):
    """-2 Re A_P / U as a ball matrix on the nodes with float offsets yfl."""
    ymax = float(np.max(np.abs(yfl)))
    lx = math.log(Xb) + 1
    if a is None:
        d0, d1 = meval(Mc, ac, yfl)
        rad = prime_rad(Xb, ymax) if sabs is None else sabs * (2e-11 + (ymax / 1024.0) ** 8 / 40320.0 * 1.2)
    else:
        p0, p1 = meval(Mc, ac, yfl + 1j * a)
        q0, q1 = meval(Mc, ac, yfl - 1j * a)
        d0, d1 = p0 + q0, p1 + q1
        rad = 2 * prime_rad(Xb, ymax, a)
    return tz.loewner(m, D, U, ball_list(d0, rad), ball_list(d1, rad * lx), -1), float(np.max(np.abs(d0)))


def ident(m, c):
    A = arb_mat(m, m)
    for i in range(m):
        A[i, i] = c
    return A


def load_files(dirs_patterns):
    import glob
    out = []
    for p in dirs_patterns:
        for f in sorted(glob.glob(p)):
            out.append(tz.Moments(f))
    return out


def hq2_weights(kmax, q=2.0, eps=0.01):
    """a_k = k l_k for log(1 + eps w^2/(1-w)^4) = sum l_k w^k; weights log q * a_k."""
    mk = [arb(1), arb(0)] + [arb(eps) * (j + 1) * j * (j - 1) / 6 for j in range(2, kmax + 1)]
    a = [arb(0)] * (kmax + 1)
    for k in range(1, kmax + 1):
        s = k * mk[k]
        for i in range(1, k):
            s -= a[i] * mk[k - i]
        a[k] = s
    lq = arb(q).log()
    return [lq * x for x in a]


def row_form(m, D, U, tau, weights, lq, sign=-1):
    """sign * 2 Re sum_k w_k C_(k lq) / U, k = 1..len(weights)-1 (shifts k lq < U are the caller's choice)."""
    Fn, F1n = [], []
    for j in range(m):
        f = acb(0)
        f1 = acb(0)
        for k in range(1, len(weights)):
            e = (acb(0, -1) * tau[j] * (k * lq)).exp()
            f += weights[k] * e
            f1 += weights[k] * (k * lq) * e
        Fn.append(f)
        F1n.append(f1)
    return tz.loewner(m, D, U, Fn, F1n, sign)
