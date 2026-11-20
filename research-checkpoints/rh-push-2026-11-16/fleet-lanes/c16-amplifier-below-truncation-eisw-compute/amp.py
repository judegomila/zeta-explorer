"""Closed form (arb balls) of the Gram matrix P_mn = <T_m Lambda^T f, T_n Lambda^T f>, f = E*(z, s/2),
for every T > 0 and every m, n (crossing coset terms included). PREREG.md section 2 (L-a)-(L-c).
python-flint only. No large allocation: the largest object is a (2D x 2D) acb matrix, D <= ~450 heights."""
from flint import acb, arb, ctx, acb_mat, fmpq
import math

def xi(s):
    return (acb.pi() ** (-s / 2)) * (s / 2).gamma() * s.zeta()

def divisors(m):
    return [a for a in range(1, m + 1) if m % a == 0]

def phi_euler(c):
    r = c; p = 2; n = c
    while p * p <= n:
        if n % p == 0:
            while n % p == 0: n //= p
            r -= r // p
        p += 1
    if n > 1: r -= r // n
    return r

def cpow(h, e):
    """h^e for positive rational/arb h and complex e."""
    return (e * acb(h).log()).exp()

class Point:
    def __init__(self, sigma, t, zero=False):
        self.sigma = arb(sigma); self.t = arb(t); self.zero = zero
        self.s = acb(self.sigma, self.t)
        self.w = self.s / 2
        self.nu = self.w - acb(1) / 2
        self.A = acb(0) if zero else xi(self.s)
        self.B = xi(2 - self.s)
        self.delta = 1 - self.sigma
        self.E = [self.w, 1 - self.w]          # exponents of the two constant-term pieces
        self.C = [self.A, self.B]
        self._bq = {}

    def lam(self, m):
        r = acb(0)
        for a in divisors(m):
            r += cpow(fmpq(a * a, m), self.nu)
        return r

    def MS(self, H):
        """Maass-Selberg expression at height H (the norm^2 of Lambda^H f when H >= 1)."""
        sp = self.w.real; tp = self.w.imag
        H = arb(H)
        a2 = abs(self.A) ** 2; b2 = abs(self.B) ** 2
        k = 2 * sp - 1
        r = (a2 * H ** k - b2 * H ** (-k)) / k
        r += (self.A * self.B.conjugate() * cpow(H, acb(0, 2 * tp))).imag / tp
        return r

    def Bq(self, q, sign):
        """int_q^1 t^(e-1) (1-t)^(-1/2) dt, e = sign*nu, q rational in (0,1)."""
        key = (q, sign)
        v = self._bq.get(key)
        if v is None:
            e = self.nu * sign
            x = acb(1 - q)
            v = 2 * x.sqrt() * x.hypgeom_2f1(acb(1) / 2, 1 - e, acb(3) / 2)
            self._bq[key] = v
        return v

def heights_for(T, m):
    """list of (h, a, d) for T_m: h = T d / a."""
    return [(fmpq(T) * fmpq(m // a, a), a, m // a) for a in divisors(m)]

def gram(pt, T, N, Hfac=1, ms=None):
    """P (N x N acb_mat), lam (list), using reference height H = Hfac * max(T N, N / T)."""
    T = fmpq(T)
    H = fmpq(Hfac) * max(T * N, fmpq(N) / T)
    types = [1] if pt.zero else [0, 1]
    hs = sorted({h for m in range(1, N + 1) for (h, a, d) in heights_for(T, m)})
    hidx = {h: i for i, h in enumerate(hs)}
    D = len(hs); nt = len(types); dim = D * nt
    w = pt.w; E = pt.E; C = pt.C
    # U[m][col] : coefficient kappa of piece (height, type) in Psi_m ; Phi_m = - sum kappa y^E 1_(h<y<=H)
    U = acb_mat(N, dim)
    lam = []
    for m in range(1, N + 1):
        lam.append(pt.lam(m))
        for (h, a, d) in heights_for(T, m):
            r = cpow(fmpq(a, d), pt.nu)
            for ti, ty in enumerate(types):
                coef = (r if ty == 0 else 1 / r) * C[ty]
                col = hidx[h] * nt + ti
                U[m - 1, col] = U[m - 1, col] + coef
    # exponent tables
    sp2 = 2 * w.real - 1          # 2 sigma' - 1
    it2 = acb(0, 2 * w.imag)      # 2 i t'
    def pm1(ta, tb):              # a + conj(b) - 1
        a = E[ta]; b = E[tb].conjugate()
        return a + b - 1
    # powers of heights for the four exponents p-1 (and their negatives are among them)
    exps = {}
    for ta in types:
        for tb in types:
            exps[(ta, tb)] = pm1(ta, tb)
    hp = {}
    for key, e in exps.items():
        hp[key] = [cpow(h, e) for h in hs]
    Hp = {key: cpow(H, e) for key, e in exps.items()}
    # G0[col] = <g, E(piece)>-building block: int_h^H c0 * conj(y^b) dy/y^2 = sum_ta C[ta] (H^(p-1)-h^(p-1))/(p-1)
    g0 = []
    for j in range(D):
        for tb in types:
            v = acb(0)
            for ta in types:
                e = exps[(ta, tb)]
                v += C[ta] * (Hp[(ta, tb)] - hp[(ta, tb)][j]) / e
            g0.append(v)
    # Q[(i,ta),(j,tb)] : first piece u^E[ta] 1_(u>h_i), conj piece y^E[tb] 1_(y>h_j)
    Q = acb_mat(dim, dim)
    ncross = 0
    cache_c = {}
    for i in range(D):
        hi = hs[i]
        for j in range(D):
            hj = hs[j]
            mx = max(i, j)
            prod = hi * hj
            cmax = 0
            if prod < 1:
                cmax = math.isqrt(int((1 / prod).p // (1 / prod).q))
                while fmpq(cmax * cmax) * prod >= 1: cmax -= 1
                while fmpq((cmax + 1) ** 2) * prod < 1: cmax += 1
            for ia, ta in enumerate(types):
                for ib, tb in enumerate(types):
                    e = exps[(ta, tb)]
                    val = (Hp[(ta, tb)] - hp[(ta, tb)][mx]) / e
                    if cmax:
                        a = E[ta]; bb = E[tb].conjugate()
                        sa = 1 if ta == 0 else -1     # a - 1/2 = sa*nu
                        sb = 1 if tb == 0 else -1     # conj(b) - 1/2 = conj(sb*nu)
                        dab = bb - a
                        # first-side threshold = hi, conj-side threshold = hj
                        t_first = cpow(hi, -dab)      # (h_first)^(a - bbar)
                        t_conj = cpow(hj, dab)        # (h_conj)^(bbar - a)
                        for c in range(1, cmax + 1):
                            q = prod * c * c
                            k = (c, ta, tb)
                            cc = cache_c.get(k)
                            if cc is None:
                                cc = (cpow(c, -2 * a), cpow(c, -2 * dab))
                                cache_c[k] = cc
                            I = cc[0] / dab * (cc[1] * t_first * pt.Bq(q, sb).conjugate() - t_conj * pt.Bq(q, sa))
                            val += phi_euler(c) * I
                            ncross += 1
                    Q[i * nt + ia, j * nt + ib] = val
    MSH = pt.MS(H)
    Uc = U.conjugate()
    EE = U * Q * Uc.transpose()                    # <E(Phi_m), E(Phi_n)>
    gvec = [sum((Uc[n, col] * g0[col] for col in range(dim)), acb(0)) for n in range(N)]   # -<g, E(Phi_n)>
    P = acb_mat(N, N)
    for m in range(N):
        for n in range(N):
            P[m, n] = lam[m] * lam[n].conjugate() * MSH - lam[m] * gvec[n] - lam[n].conjugate() * gvec[m].conjugate() + EE[m, n]
    info = dict(D=D, dim=dim, ncross=ncross, H=str(H), nbq=len(pt._bq))
    return P, lam, info

def quad_form(P, x):
    """x^T P conj(x)"""
    N = len(x)
    r = acb(0)
    for m in range(N):
        for n in range(N):
            r += x[m] * P[m, n] * x[n].conjugate()
    return r

def gain_opt(P, lam, MST):
    N = len(lam)
    Pt_ = P.transpose()
    rhs = acb_mat(N, 1, lam)
    sol = Pt_.solve(rhs)
    r = acb(0)
    for m in range(N):
        r += lam[m].conjugate() * sol[m, 0]
    xopt = [sol[m, 0].conjugate() for m in range(N)]      # maximiser x = conj((P^T)^-1 lam)
    return MST * r, xopt

def gain(P, lam, x, MST):
    lx = sum((x[m] * lam[m] for m in range(len(lam))), acb(0))
    nv = quad_form(P, x)
    return (abs(lx) ** 2) * MST / nv.real, nv
