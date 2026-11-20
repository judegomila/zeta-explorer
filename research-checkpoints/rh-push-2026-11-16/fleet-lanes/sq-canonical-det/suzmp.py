"""Multiprecision (python-flint arb, midpoint use only: NOT an interval certificate) Galerkin
compression of Suzuki's K^{omega,nu}[t] on L^2(-t,t), orthonormal Legendre basis of degree < p.

usage: suzmp.py kind om_num om_den nu t_list p_list digits out.json
"""
import sys, json, math, time
from fractions import Fraction
from flint import arb, acb, arb_mat, acb_mat, ctx

def setprec(digits):
    ctx.prec = int(digits * 3.33) + 10

# ---------- arithmetic ----------
def dconv(a, b, N):
    c = [arb(0)] * (N + 1)
    for d in range(1, N + 1):
        ad = a[d]
        if ad == 0:
            continue
        for m in range(1, N // d + 1):
            c[d * m] = c[d * m] + ad * b[m]
    return c

def dinv(a, N):
    b = [arb(0)] * (N + 1)
    b[1] = 1 / a[1]
    for n in range(2, N + 1):
        s = arb(0)
        for d in range(1, n):
            if n % d == 0:
                s += a[n // d] * b[d]
        b[n] = -s / a[1]
    return b

def coeffs(kind, om, nu, N):
    npow = [arb(0)] + [arb(n) ** om for n in range(1, N + 1)]
    nneg = [arb(0)] + [arb(n) ** (-om) for n in range(1, N + 1)]
    one = [arb(0)] + [arb(1)] * N
    if kind in ("zeta", "twist2"):
        mu = dinv(one, N)
        c1 = dconv([one[n] * npow[n] for n in range(N + 1)], [mu[n] * nneg[n] for n in range(N + 1)], N)
        if kind == "twist2":
            f = [arb(0)] * (N + 1); f[1] = arb(1)
            k = 1
            while 2 ** k <= N:
                f[2 ** k] = arb(2) ** (-om * k) * (1 - arb(2) ** (2 * om)); k += 1
            c1 = dconv(dconv(c1, f, N), f, N)
    elif kind == "dh":
        s5 = arb(5).sqrt()
        kap = ((10 - 2 * s5).sqrt() - 2) / (s5 - 1)
        tab = [arb(0), arb(1), kap, -kap, arb(-1)]
        a = [arb(0)] + [tab[m % 5] for m in range(1, N + 1)]
        b = dinv(a, N)
        c1 = dconv([a[n] * npow[n] for n in range(N + 1)], [b[n] * nneg[n] for n in range(N + 1)], N)
    else:
        raise ValueError(kind)
    c = c1
    for _ in range(nu - 1):
        c = dconv(c, c1, N)
    return c

# ---------- gamma kernel ----------
def make_F(kind, om, nu):
    if kind == "dh":
        lc = -om * (arb(5) / arb.pi()).log()
        def F(s):
            return (nu * (lc + ((s + 1 - om) / 2).lgamma() - ((s + 1 + om) / 2).lgamma())).exp()
        sig = om - 1
    else:
        lc = om * arb.pi().log()
        def F(s):
            return ((s - om - 1) / (s + om - 1)) ** nu * (
                nu * (lc + ((s - om) / 2 + 1).lgamma() - ((s + om) / 2 + 1).lgamma())).exp()
        sig = 1 - om
    return F, sig

def talbot(F, sig, w, NT):
    tot = acb(0)
    I = acb(0, 1)
    c1, c2, c3, c4 = arb("0.5017"), arb("0.6407"), arb("0.6122"), arb("0.2645")
    pi = arb.pi()
    for k in range(NT):
        th = -pi + (2 * k + 1) * pi / NT
        c = c2 * th
        ct = c.cos() / c.sin()
        z = (NT / w) * (c1 * th * ct - c3 + I * c4 * th)
        dz = (NT / w) * (c1 * ct - c1 * c2 * th / (c.sin() ** 2) + I * c4)
        s = sig + z
        tot += ((s - arb(1) / 2) * w).exp() * F(s) * dz
    return (tot / (I * NT)).real

class GTable:
    def __init__(self, kind, om, nu, W, digits, h=0.25, deg=None):
        self.beta = nu * om - 1
        self.h = arb(h)
        self.hf = h
        self.npan = int(math.ceil(W / h)) + 1
        if deg is None:
            deg = int(digits * 0.6) + 10
        self.deg = deg
        NT = 2 * (int(digits * 1.75 + 12) // 2 + 1)
        base = ctx.prec
        ctx.prec = int(base + NT * 0.9 * 1.45) + 30       # e^{0.6 NT} cancellation
        F, sig = make_F(kind, om, nu)
        pi = arb.pi()
        xk = [((2 * j + 1) * pi / (2 * (deg + 1))).cos() for j in range(deg + 1)]
        self.cf = []
        for i in range(self.npan):
            vals = []
            for x in xk:
                w = (i + (x + 1) / 2) * self.h
                vals.append(talbot(F, sig, w, NT) / w ** self.beta)
            # chebyshev coefficients c_m = (2/(deg+1)) sum_j v_j cos(m theta_j)
            cf = []
            for m in range(deg + 1):
                s = arb(0)
                for j in range(deg + 1):
                    s += vals[j] * (m * (2 * j + 1) * pi / (2 * (deg + 1))).cos()
                cf.append(2 * s / (deg + 1))
            cf[0] = cf[0] / 2
            self.cf.append([arb(c.mid()) for c in cf])
        ctx.prec = base
        self.tail = max(abs(float(self.cf[i][-1])) + abs(float(self.cf[i][-2])) for i in range(self.npan))
    def A(self, w):
        i = min(int(float(w) / self.hf), self.npan - 1)
        x = 2 * (w - i * self.h) / self.h - 1
        cf = self.cf[i]
        b1 = arb(0); b2 = arb(0)
        for c in reversed(cf[1:]):
            b1, b2 = 2 * x * b1 - b2 + c, b1
        return x * b1 - b2 + cf[0]

# ---------- quadrature / basis ----------
_gl_cache = {}
def gl(n):
    if n not in _gl_cache:
        xs = []; ws = []
        for k in range(n):
            x, w = arb.legendre_p_root(n, k, weight=True)
            xs.append(arb(x.mid())); ws.append(arb(w.mid()))
        _gl_cache[n] = (xs, ws)
    return _gl_cache[n]

def legvals(xi, n, scale):
    """orthonormal Legendre values of degree 0..n-1 at reduced coordinate xi in [-1,1]; scale[k]=sqrt((2k+1)/len)"""
    out = [None] * n
    p0 = arb(1); out[0] = scale[0]
    if n > 1:
        p1 = xi; out[1] = p1 * scale[1]
    for k in range(1, n - 1):
        p2 = ((2 * k + 1) * xi * p1 - k * p0) / (k + 1)
        out[k + 1] = p2 * scale[k + 1]
        p0, p1 = p1, p2
    return out

def moments(tab, a_n, N, t, nq, om_frac, nu, p):
    T2 = 2 * t
    scale = [((2 * k + 1) / T2).sqrt() for k in range(nq)]
    b = om_frac.denominator
    e = nu * om_frac.numerator - 1                  # integer >= 0
    beta = tab.beta
    hp = tab.h
    q1 = ((2 * p + 60) * b + e) // 2 + 4
    q2 = p + 75
    x1, w1 = gl(q1)
    x2, w2 = gl(q2)
    m = [arb(0)] * nq
    for n in range(1, N + 1):
        if a_n[n] == 0:
            continue
        ln = arb(n).log()
        Ln = T2 - ln
        if not (Ln > 0):
            continue
        acc = [arb(0)] * nq
        h0 = hp if (Ln > hp) else Ln
        pref = h0 ** (beta + 1) * b
        for xx, ww in zip(x1, w1):
            x = (xx + 1) / 2
            w = h0 * x ** b
            wt = ww / 2 * pref * x ** e * tab.A(w)
            vals = legvals(2 * (w + ln) / T2 - 1, nq, scale)
            for j in range(nq):
                acc[j] += wt * vals[j]
        lo = h0
        while (Ln - lo) > arb(10) ** (-(ctx.prec // 4)):
            hi = lo + hp if (Ln > lo + hp) else Ln
            for xx, ww in zip(x2, w2):
                w = lo + (xx + 1) / 2 * (hi - lo)
                wt = ww * (hi - lo) / 2 * w ** beta * tab.A(w)
                vals = legvals(2 * (w + ln) / T2 - 1, nq, scale)
                for j in range(nq):
                    acc[j] += wt * vals[j]
            lo = hi
        f = a_n[n] / arb(n).sqrt()
        for j in range(nq):
            m[j] += f * acc[j]
    return [arb(v.mid()) for v in m]

def galerkin(tab, a_n, N, t, p, om_frac, nu):
    nq = 2 * p + 2
    T2 = 2 * t
    mh = moments(tab, a_n, N, t, nq, om_frac, nu, p)
    xg, wg = gl(nq)
    scale_u = [((2 * k + 1) / T2).sqrt() for k in range(nq)]
    scale_x = [((2 * k + 1) / T2).sqrt() for k in range(p)]
    xq, wq = gl(p + 1)
    M = arb_mat(p, p)
    for k in range(nq):
        u = (xg[k] + 1) * t
        vals = legvals(xg[k], nq, scale_u)
        kap = arb(0)
        for j in range(nq):
            kap += vals[j] * mh[j]
        kap = kap * wg[k] * t
        lo = u - t
        half = (t - lo) / 2
        X = []; Y = []
        for xx, ww in zip(xq, wq):
            x = lo + (xx + 1) * half
            vx = legvals(x / t, p, scale_x)
            vy = legvals((u - x) / t, p, scale_x)
            wt = ww * half
            X.append([v * wt for v in vx]); Y.append(vy)
        Xm = arb_mat(p + 1, p, [v for row in X for v in row]).transpose()
        Ym = arb_mat(p + 1, p, [v for row in Y for v in row])
        M = M + kap * (Xm * Ym)
    M = (M + M.transpose()) / 2
    trK = mh[0] * T2.sqrt() / 2          # exact trace: int_{-t}^{t} K(2x) dx = (1/2) int_0^{2t} K(u) du
    return arb_mat(p, p, [arb(M[i, j].mid()) for i in range(p) for j in range(p)]), trK

def analyse(M, p, trK):
    I = arb_mat(p, p, [arb(1) if i == j else arb(0) for i in range(p) for j in range(p)])
    dp = (I + M).det(); dm = (I - M).det()
    ev = acb_mat(M).eig(algorithm="approx")
    import functools
    def _cmp(a, b):
        d = float((a - b).mid())
        return -1 if d < 0 else (1 if d > 0 else 0)
    evr = sorted([arb(e.real.mid()) for e in ev], key=functools.cmp_to_key(_cmp))
    lam_max = evr[-1]; lam_min = evr[0]
    def lg(x):
        return float(abs(x).log().mid())
    tr = []
    for k in (2, 4, 8, 16, 32, 64):
        s = arb(0)
        for e in evr:
            s += e ** k
        tr.append(float(s.mid()))
    gp = 1 - lam_max; gm = 1 + lam_min
    trM = arb(0)
    for i in range(p):
        trM += M[i, i]
    dtr = float((trK - trM).mid())
    return dict(gap_plus=float(gp.mid()), gap_minus=float(gm.mid()),
                gap_plus_s=gp.str(25, radius=False), gap_minus_s=gm.str(25, radius=False),
                lam_max=lam_max.str(40, radius=False), lam_min=lam_min.str(40, radius=False),
                logabs_det_plus=lg(dp), logabs_det_minus=lg(dm),
                sign_det_plus=1 if dp > 0 else (-1 if dp < 0 else 0),
                sign_det_minus=1 if dm > 0 else (-1 if dm < 0 else 0),
                log_gamma_ham=2 * (lg(dp) - lg(dm)), trK=float(trK.mid()), dtr=dtr,
                ld_plus_c=lg(dp) + dtr, ld_minus_c=lg(dm) - dtr, log_gamma_ham_c=2 * (lg(dp) - lg(dm)) + 4 * dtr,
                n_gt1=sum(1 for e in evr if e > 1), n_ltm1=sum(1 for e in evr if e < -1),
                n_near=sum(1 for e in evr if abs(e) > arb("0.5")),
                tr_even={str(k): v for k, v in zip((2, 4, 8, 16, 32, 64), tr)},
                top=[float((1 - e).mid()) for e in evr[-14:]], bottom=[float((1 + e).mid()) for e in evr[:14]])

if __name__ == "__main__":
    kind = sys.argv[1]
    om_frac = Fraction(int(sys.argv[2]), int(sys.argv[3]))
    nu = int(sys.argv[4])
    ts = [Fraction(v) for v in sys.argv[5].split(",")]
    ps = [int(v) for v in sys.argv[6].split(",")]
    digits = int(sys.argv[7]); out = sys.argv[8]
    setprec(digits)
    om = arb(om_frac.numerator) / om_frac.denominator
    tmax = float(max(ts))
    N = int(math.floor(math.exp(2 * tmax) + 1e-9))
    t0 = time.time()
    a_n = coeffs(kind, om, nu, N)
    tab = GTable(kind, om, nu, 2 * tmax + 0.01, digits)
    print("# table built %.1fs, cheb tail %.2e" % (time.time() - t0, tab.tail), flush=True)
    res = []
    for tf in ts:
        t = arb(tf.numerator) / tf.denominator
        Nt = int(math.floor(math.exp(2 * float(tf)) + 1e-9))
        for p in ps:
            t1 = time.time()
            M, trK = galerkin(tab, a_n, Nt, t, p, om_frac, nu)
            r = analyse(M, p, trK)
            r.update(kind=kind, om=float(om_frac), nu=nu, t=float(tf), p=p, digits=digits, secs=time.time() - t1)
            res.append(r)
            print("t=%.4f p=%d gap+=%.4e gap-=%.4e ldc+=%.6f ldc-=%.6f sg=%d,%d n>1=%d n<-1=%d logGamc=%.6f dtr=%.2e (%.0fs)" % (
                r["t"], p, r["gap_plus"], r["gap_minus"], r["ld_plus_c"], r["ld_minus_c"],
                r["sign_det_plus"], r["sign_det_minus"], r["n_gt1"], r["n_ltm1"], r["log_gamma_ham_c"], r["dtr"], r["secs"]), flush=True)
            json.dump(res, open(out, "w"))
