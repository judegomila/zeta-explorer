# box-hodge-signature: Weil form in intersection (Hodge-index) coordinates, ball arithmetic throughout.
#
# Classes: D_j <-> Gaussian f_j(x) = exp(-(x-x_j)^2/(2 s^2)), common width s; fibre classes H, V (one pair per pole pair tau):
#   <H,D_j> = sqrt(c0) e^{v tau^2/4} e^{tau x_j},  <V,D_j> = sqrt(c0) e^{v tau^2/4} e^{-tau x_j},  <H,V> = 1, <H,H> = <V,V> = 0,
#   <D_j,D_k> = I(x_j - x_k) := Prime(d) - A(d)      (v = 2 s^2, c0 = 2 pi s^2, amp = s sqrt(pi)).
# Explicit formula: Z(d) = P(d) - I(d) = sum over zeros rho = 1/2 + i t of c0 e^{-v t^2/2} e^{i t d},  P(d) = c0 sum_tau e^{v tau^2/2} 2 cosh(tau d).
# Schur complement of the fibre block = I - P = -Z.  Inertia(full form) = (npoles + i_-(Z), npoles + i_+(Z), null).
# "Lorentzian" (zeta: exactly one positive eigenvalue) <=> Z >= 0 on the span <=> Weil positivity on the span.
#
# Every entry is an arb ball with a proved radius, except where stated (DH tail hypothesis, see prime_tail_bound).
import math, sys
from flint import arb, acb, ctx

def setprec(dps):
    ctx.prec = int(dps*3.3219281) + 96

def A(x):
    return x if isinstance(x, arb) else arb(x)

# ---------------------------------------------------------------- arithmetic tables
def spf_table(N):
    spf = list(range(N+1))
    i = 2
    while i*i <= N:
        if spf[i] == i:
            for q in range(i*i, N+1, i):
                if spf[q] == q: spf[q] = i
        i += 1
    return spf

def prime_iter(N):
    """primes <= N in increasing order (odd-only bytearray sieve; N/2 bytes)."""
    if N >= 2: yield 2
    half = (N - 1)//2                      # index i <-> 2i+3
    sv = bytearray([1])*max(half, 0)
    i = 0
    while (2*i+3)*(2*i+3) <= N:
        if sv[i]:
            p = 2*i+3; st = (p*p - 3)//2
            sv[st::p] = bytes(len(range(st, half, p)))
        i += 1
    for i in range(half):
        if sv[i]: yield 2*i+3

def prime_powers(N):
    """list of (n, p, k) for prime powers n = p^k <= N, sorted by n."""
    spf = spf_table(max(N, 2))
    out = []
    for p in range(2, N+1):
        if spf[p] == p:
            q = p; k = 1
            while q <= N:
                out.append((q, p, k)); q *= p; k += 1
    out.sort()
    return out

def kappa_dh():
    s5 = arb(5).sqrt()
    return ((10 - 2*s5).sqrt() - 2)/(s5 - 1)

def dh_lambda(N):
    """Lambda_DH(n), 2 <= n <= N, from  a(n) log n = sum_{d|n} Lambda(d) a(n/d);  a = (1, k, -k, -1, 0) mod 5.  list of arb, index n."""
    k = kappa_dh()
    per = [arb(0), arb(1), k, -k, arb(-1)]
    lam = [arb(0)]*(N+1)
    for n in range(2, N+1):
        if n % 5: lam[n] = per[n % 5]*arb(n).log()
    for d in range(2, N//2+1):
        ld = lam[d]
        m = 2; q = 2*d
        while q <= N:
            r = m % 5
            if r:
                lam[q] = lam[q] - ld*per[r]
            m += 1; q += d
    return lam

class Obj:
    """poles: list of tau (pole pair, fibre classes); gam: list of digamma arguments z; cond: arb constant multiplying g(0);
    weights(N): list of (n, w_n) with w_n = Lambda_obj(n)/sqrt(n) (arb), n ascending, all nonzero terms with n <= N;
    growth g: |w_n| <= n^g for n beyond the table (proved for zeta-type objects; hypothesis for DH)."""
    def __init__(self, name, poles, gam, cond, weights, growth, base, note=''):
        self.name, self.poles, self.gam, self.cond, self.weights, self.growth, self.base, self.note = name, poles, gam, cond, weights, growth, base, note

def zeta_like_weights(eps):
    def f(N):
        if N > STREAM_LIMIT: return None
        out = []
        for n, p, k in prime_powers(N):
            e = eps(p, k, n)
            if e is None: continue
            out.append((n, arb(p).log()*e/arb(n).sqrt()))
        return out
    f.eps = eps
    return f

STREAM_LIMIT = 3000000
TABLE_CAP = 3000000          # entries; about 1.2 GB at 100 digits

def make_obj(name):
    half = arb(1)/2; q4 = arb(1)/4
    mlogpi = -arb.pi().log()
    one = arb(1)
    if name == 'zeta':
        return Obj(name, [half], [q4], mlogpi, zeta_like_weights(lambda p, k, n: one), 0.0, 1)
    if name.startswith('tw-_'):          # eps_p = -1 at the single prime p (completely multiplicative): Lambda(p^k) -> (-1)^k Lambda(p^k)
        P = int(name[4:])
        return Obj(name, [half], [q4], mlogpi, zeta_like_weights(lambda p, k, n: (arb(-1)**k if p == P else one)), 0.0, 1)
    if name.startswith('tw+_'):          # eps_p = 1/2 at the single prime p
        P = int(name[4:])
        return Obj(name, [half], [q4], mlogpi, zeta_like_weights(lambda p, k, n: (arb(1)/2**k if p == P else one)), 0.0, 1)
    if name == 'liouville':              # eps_p = -1 at every prime:  Lambda(p^k) -> (-1)^k Lambda(p^k)
        return Obj(name, [half], [q4], mlogpi, zeta_like_weights(lambda p, k, n: arb(-1)**k), 0.0, 1)
    if name.startswith('rand'):          # eps_p = +-1 pseudo-random (fixed LCG seed), completely multiplicative
        seed = int(name[4:] or 1)
        def e(p, k, n):
            x = (p*2654435761 + seed*40503) % 4294967296
            x = (x*1103515245 + 12345) % 2147483648
            sg = 1 if (x >> 16) & 1 else -1
            return arb(sg)**k
        return Obj(name, [half], [q4], mlogpi, zeta_like_weights(e), 0.0, 1)
    if name.startswith('drop'):
        P = int(name[4:])
        return Obj(name, [half], [q4], mlogpi, zeta_like_weights(lambda p, k, n: (None if p == P else one)), 0.0, 1)
    if name.startswith('EA_'):           # zeta(s+a) zeta(s-a)
        a = arb(name[3:])
        af = float(name[3:])
        def e(p, k, n):
            x = arb(n).log()*a
            return x.exp() + (-x).exp()
        return Obj(name, [half+a, half-a], [q4+a/2, q4-a/2], 2*mlogpi, zeta_like_weights(e), af, 2)
    if name == 'DH':
        def w(N):
            lam = dh_lambda(N)
            return [(n, lam[n]/arb(n).sqrt()) for n in range(2, N+1)]
        # proved tail bound: |a(n)| <= 1, a(5k) = 0, so u := sum_{n>=2} |a(n)| n^-2 <= (1 - 1/25) zeta(2) - 1 = 0.5792 < 1;
        # log f = sum_k (-1)^{k+1} (f-1)^k / k gives sum_n |b(n)| n^-2 <= -log(1-u) = 0.8655 with Lambda_DH(n) = b(n) log n,
        # hence |Lambda_DH(n)| <= 0.8655 n^2 log n and |w_n| = |Lambda_DH(n)|/sqrt n <= n^2 for all n >= 1  (growth g = 2).
        return Obj(name, [], [arb(3)/4], (5/arb.pi()).log(), w, 2.0, 0, note='tail bound proved with growth exponent 2 (see bh.py)')
    raise ValueError(name)

# ---------------------------------------------------------------- archimedean term, proved radius
def psi_bound(absu_max):
    # |psi(u)| <= log(1+|u|) + 5 for Re u >= 1/2
    return math.log(1 + absu_max) + 5

class Arch:
    """arch_z(d) = (1/2pi) int c0 e^{-v t^2/2} cos(t d) Re psi(z + i t/2) dt   for 0 <= d <= dmax, absolute error <= rad (added to the ball).
    psi(z+it/2) = psi(z+M+it/2) - sum_{m<M} 1/(z+m+it/2); rational terms in closed form (erfc); the shifted term by the trapezoidal rule
    with the strip bound (half-width a' = 2(z+M)-1) and a Gaussian truncation bound."""
    def __init__(self, z, v, dmax, dps, M=24):
        self.z, self.v, self.M = z, v, M
        zf = float(z.mid()); vf = float(v.mid()); self.vf = vf
        w = zf + M; ap = 2*w - 1
        D = (dps + 12)*math.log(10)
        dt = 2*math.pi*ap/(ap*dmax + vf*ap*ap/2 + D + 40)
        T0 = math.sqrt(2*(D + 40)/vf) + 1
        K = int(T0/dt) + 2
        self.dt = arb(dt)                      # exact double
        self.K = K
        self.dmax = dmax
        # proved error bounds (floats, evaluated with slack factor 4 for float rounding)
        loglin = vf*ap*ap/2 + ap*dmax + math.log(math.sqrt(2*math.pi/vf)*psi_bound(2*w + 0.5/math.sqrt(vf)))
        logtrap = math.log(2) + loglin - 2*math.pi*ap/dt
        Tk = K*dt
        logtrunc = math.log(2*psi_bound(w + Tk/2)/(vf*Tk)) - vf*Tk*Tk/2
        self.log_err = math.log(4) + max(logtrap, logtrunc) + math.log(2)       # error of the full-line integral
        wz = z + M
        self.F = []
        for k in range(K+1):
            t = self.dt*k
            f = (-(v*t*t)/2).exp()*acb(wz, t/2).digamma().real
            if k == 0: f = f/2
            self.F.append(f*self.dt*2)          # full-line trapezoid: 2 * sum' over k >= 0
        self.s2v = (2*v).sqrt()

    def rational(self, d):
        """sum_{m<M} int e^{-v t^2/2} cos(t d)/(a + i t/2) dt,  a = z+m  (= pi [e^{2a^2v-2ad} erfc((2av-d)/sqrt(2v)) + (d -> -d)])."""
        v = self.v; acc = arb(0)
        for m in range(self.M):
            a = self.z + m
            x = 2*a*v
            e0 = 2*a*a*v
            acc += (e0 - 2*a*d).exp()*((x - d)/self.s2v).erfc() + (e0 + 2*a*d).exp()*((x + d)/self.s2v).erfc()
        return acc*arb.pi()

    def uniform(self, h, n, c0):
        """values at d = j h, j = 0..n-1"""
        acc = [arb(0)]*n
        for k, f in enumerate(self.F):
            t = self.dt*k
            th = t*h
            z1 = acb(0, th).exp()              # e^{i t h}; powers by multiplication, restarted from exp every 8 steps
            z = acb(1)                         # (rectangular complex balls grow by up to sqrt 2 per product)
            for j in range(n):
                if j % 8 == 0 and j: z = acb(0, th*j).exp()
                acc[j] = acc[j] + f*z.real
                z = z*z1
        err = arb(0, 1)*arb(self.log_err).exp()
        tp = 2*arb.pi()
        return [c0*(acc[j] + err - self.rational(h*j))/tp for j in range(n)]

    def at(self, d, c0):
        acc = arb(0)
        for k, f in enumerate(self.F):
            acc += f*(self.dt*k*d).cos()
        err = arb(0, 1)*arb(self.log_err).exp()
        return c0*(acc + err - self.rational(d))/(2*arb.pi())

# ---------------------------------------------------------------- prime side, proved radius
def reach(v, dps, extra=40.0):
    return math.sqrt(2*v*((dps + 12)*math.log(10) + extra))

def table_limit(dmax, v, dps, g):
    """log of the table limit L: sum_{n > e^L} n^g e^{-(log n - d)^2/(2v)} <= bound for all 0 <= d <= dmax; returns (L, log bound)."""
    T = (dps + 12)*math.log(10) + 40
    R = math.sqrt(2*v*T)
    for _ in range(60):
        R = math.sqrt(2*v*(T + (g + 1)*(dmax + R)))
    R *= 1.02
    L = dmax + R
    denom = R/v - (g + 1)
    assert denom > 1
    logb = (g + 1)*L - R*R/(2*v) - math.log(denom) + math.log(2)
    return L, logb

class PrimeSide:
    def __init__(self, obj, v, dmax, dps):
        self.vf = float(v.mid()); self.v = v
        self.L, self.logtail = table_limit(dmax, self.vf, dps, obj.growth)
        self.N = int(math.exp(self.L)) + 2
        self.R = reach(self.vf, dps)
        self.obj = obj
        # planned size of the in-memory weight table, checked before allocating (a dense table costs about 400 bytes per entry
        # at 100 digits; DH has one entry per integer).  Refuse instead of allocating beyond TABLE_CAP entries.
        dense = not hasattr(obj.weights, 'eps')
        planned = self.N if dense else (0 if self.N > STREAM_LIMIT else int(1.3*self.N/max(1.0, math.log(self.N))))
        if planned > TABLE_CAP:
            raise MemoryError('planned weight table of %d entries (~%.1f GB) exceeds the cap of %d entries; reduce the cutoff or the width' % (planned, planned*400/1e9, TABLE_CAP))
        ws = obj.weights(self.N)
        if ws is None:
            # streamed (zeta-type weights, |w_n| <= 2 Lambda(n) n^{g-1/2}, g < 1/2):  sum_{n<=N} |w_n| <= 2 psi(N) <= 2.08 N
            self.W = None
            totf = 2.08*self.N
        else:
            self.W = [(n, w, arb(n).log()) for n, w in ws]
            tot = arb(0)
            for n, w, l in self.W: tot += abs(w)
            totf = float(tot.upper())
        # skipped in-table terms: each <= |w_n| e^{-R^2/2v}; two Gaussians per term
        self.logskip = math.log(2*totf + 1e-300) - self.R**2/(2*self.vf)
        self.rad = arb(0, 1)*(arb(self.logskip).exp() + 2*arb(self.logtail).exp())
        self.i2v = 1/(2*v)

    def terms(self):
        if self.W is not None:
            for nn, w, l in self.W: yield w, l
            return
        eps = self.obj.weights.eps; N = self.N
        for p in prime_iter(N):
            lp = arb(p).log(); q = p; k = 1
            while q <= N:
                e = eps(p, k, q)
                if e is not None: yield lp*e/arb(q).sqrt(), lp*k
                q *= p; k += 1

    def uniform(self, h, n, amp):
        hf = float(h.mid()); R = self.R
        acc = [arb(0)]*n
        i2v = self.i2v
        for w, l in self.terms():
            lf = float(l.mid())
            j0 = max(0, int(math.ceil((lf - R)/hf))); j1 = min(n-1, int(math.floor((lf + R)/hf)))
            for j in range(j0, j1+1):
                x = l - h*j
                acc[j] = acc[j] + w*(-(x*x)*i2v).exp()
            if lf < R:
                j1 = min(n-1, int(math.floor((R - lf)/hf)))
                for j in range(0, j1+1):
                    x = l + h*j
                    acc[j] = acc[j] + w*(-(x*x)*i2v).exp()
        return [amp*(a + self.rad) for a in acc]

    def at(self, d, amp):
        df = abs(float(d.mid())); R = self.R; acc = arb(0)
        for w, l in self.terms():
            lf = float(l.mid())
            if lf > df + R: break
            if abs(lf - df) <= R:
                x = l - d; acc += w*(-(x*x)*self.i2v).exp()
            if lf + df <= R:
                x = l + d; acc += w*(-(x*x)*self.i2v).exp()
        return amp*(acc + self.rad)

# ---------------------------------------------------------------- lag tables (uniform family)
def consts(s):
    v = 2*s*s
    amp = s*arb.pi().sqrt()
    c0 = 2*arb.pi()*s*s
    return v, amp, c0

def pole_term(obj, d, v, c0):
    P = arb(0)
    for tau in obj.poles:
        P += c0*(v*tau*tau/2).exp()*2*(d*tau).cosh()
    return P

def lag_table(obj, hstr, rstr, n, dps, log=None):
    """returns dict with lists (length n) of arb: I (= Prime - A), P, and mZ = I - P = -Z."""
    setprec(dps)
    h = arb(hstr); s = h*arb(rstr)
    v, amp, c0 = consts(s)
    dmax = float(h.mid())*(n-1)
    ps = PrimeSide(obj, v, dmax, dps)
    if log: log('prime table: N=%d, %s weights, reach R=%.4f' % (ps.N, 'streamed' if ps.W is None else len(ps.W), ps.R))
    Pr = ps.uniform(h, n, amp)
    Ar = [obj.cond*amp*(-(h*j)**2/(2*v)).exp() for j in range(n)]
    for z in obj.gam:
        ar = Arch(z, v, dmax, dps)
        if log: log('arch z=%s: K=%d trapezoid nodes, dt=%.5f, log10 err=%.1f' % (z.mid().str(6), ar.K, float(ar.dt.mid()), ar.log_err/math.log(10)))
        t = ar.uniform(h, n, c0)
        Ar = [Ar[j] + t[j] for j in range(n)]
    I = [Pr[j] - Ar[j] for j in range(n)]
    P = [pole_term(obj, h*j, v, c0) for j in range(n)]
    return dict(I=I, P=P, mZ=[I[j] - P[j] for j in range(n)], h=h, s=s, v=v, c0=c0, amp=amp)

# ---------------------------------------------------------------- certified inertia
def sgn(x):
    return 1 if x > 0 else (-1 if x < 0 else 0)

def levinson_pivots(t):
    """Symmetric Toeplitz matrix T_n = (t_|j-k|).  Returns the Schur pivots E_m = det T_m/det T_{m-1}, m = 1..n, as arb balls,
    stopping at the first pivot whose ball contains 0.  Signs of E_1..E_m give the inertia of T_m (Jacobi)."""
    n = len(t)
    a = [arb(1)]
    E = t[0]
    piv = [E]
    if sgn(E) == 0: return piv
    for m in range(1, n):
        lam = arb(0)
        for i in range(m): lam += a[i]*t[m-i]
        k = -lam/E
        a.append(arb(0))
        b = [a[i] + k*a[m-i] for i in range(m+1)]
        a = b
        E = E*(1 - k*k)
        piv.append(E)
        if sgn(E) == 0: break
    return piv

def ldl_pivots(M):
    """M: list of lists of arb (symmetric).  Leading pivots by elimination without pivoting; stops at an undetermined pivot."""
    n = len(M)
    Amat = [row[:] for row in M]
    piv = []
    for k in range(n):
        p = Amat[k][k]
        piv.append(p)
        if sgn(p) == 0: break
        rk = Amat[k]
        for i in range(k+1, n):
            f = Amat[i][k]/p
            ri = Amat[i]
            for j in range(i, n):
                ri[j] = ri[j] - f*rk[j]
            for j in range(i+1, n):
                Amat[j][i] = ri[j]
    return piv

def inertia_from_pivots(piv):
    pos = [i+1 for i, p in enumerate(piv) if sgn(p) > 0]
    neg = sum(1 for p in piv if sgn(p) < 0)
    und = sum(1 for p in piv if sgn(p) == 0)
    return pos, neg, und

def log10abs(p):
    m = abs(p.mid())
    if m == 0: return None
    return float(m.log()/arb(10).log())

# ---------------------------------------------------------------- a-posteriori certificate (no interval wrapping)
from flint import arb_mat

def levinson_mid(t):
    """Midpoint Levinson (no radii): rows of the unit lower triangular X with X T X^T ~ diagonal.  Not rigorous by itself."""
    n = len(t)
    t = [x.mid() for x in t]
    a = [arb(1)]
    E = t[0]
    rows = [[arb(1)]]
    zero = arb(0)
    for m in range(1, n):
        if E == 0: break
        lam = zero
        for i in range(m): lam += a[i]*t[m-i]
        k = (-lam/E).mid()
        a.append(zero)
        a = [(a[i] + k*a[m-i]).mid() for i in range(m+1)]
        E = (E*(1 - k*k)).mid()
        rows.append(a[::-1])          # row m: X[m][j] = a[m-j]
    return rows

def ldl_mid(M):
    """Midpoint LDL^T without pivoting; returns unit lower triangular L as list of rows (midpoints)."""
    n = len(M)
    Am = [[x.mid() for x in row] for row in M]
    L = [[arb(0)]*n for _ in range(n)]
    for k in range(n):
        p = Am[k][k]
        L[k][k] = arb(1)
        if p == 0: break
        rk = Am[k]
        for i in range(k+1, n):
            f = (Am[i][k]/p).mid()
            L[i][k] = f
            ri = Am[i]
            for j in range(i, n):
                ri[j] = (ri[j] - f*rk[j]).mid()
            for j in range(i+1, n):
                Am[j][i] = ri[j]
    return L

def certify(Tm, Xrows):
    """Tm: arb_mat (balls, symmetric n x n); Xrows: rows of a unit lower triangular matrix (first len(Xrows) rows).
    B = X T X^T in ball arithmetic.  For every symmetric T' in the ball, inertia(T'_m) = inertia(B'_m) (Sylvester; X is unit triangular,
    and leading blocks correspond).  If the diagonal balls d_i exclude 0 and, after scaling by |d_i|^{-1/2}, the off-diagonal absolute
    row sums of the leading m x m block are < 1, Gershgorin + homotopy give inertia(B'_m) = signs(d_1..d_m).
    Returns (m_cert, diag list of arb, max row sum over the certified block)."""
    k = len(Xrows); n = Tm.nrows()
    flat = []
    for i in range(k):
        r = Xrows[i]
        flat.extend(r); flat.extend([arb(0)]*(n - len(r)))
    X = arb_mat(k, n, flat)
    B = X*Tm*X.transpose()
    ent = B.entries()
    d = [ent[i*k+i] for i in range(k)]
    lo = []
    for i in range(k):
        if sgn(d[i]) == 0: break
        lo.append(float(abs(d[i]).lower())*0.9999999)
        if lo[-1] < 1e-280: lo.pop(); break                   # outside the float range used for the row sums
    kk = len(lo)
    isq = [1/math.sqrt(x) if x > 0 else float('inf') for x in lo]
    rs = [0.0]*kk
    mcert = 0; worst = 0.0
    for m in range(kk):
        s = 0.0; bad = False
        base = m*k
        for j in range(m):
            e = ent[base+j]; e2 = ent[j*k+m]
            f = max(float(abs(e).upper()), float(abs(e2).upper()), 1e-300)*isq[m]*isq[j]*1.0000001      # floor guards float underflow of an upper bound
            s += f; rs[j] += f
            if rs[j] >= 1: bad = True
        rs[m] = s
        if bad or s >= 1 or not (isq[m] < float('inf')): break
        mcert = m+1; worst = max(worst, s)
    if mcert: worst = max(rs[:mcert])
    return mcert, d, worst

def toeplitz_mat(t):
    n = len(t)
    return arb_mat(n, n, [t[abs(i-j)] for i in range(n) for j in range(n)])
