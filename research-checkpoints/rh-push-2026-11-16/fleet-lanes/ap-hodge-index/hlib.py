# Weil form in "intersection" (Hodge-index) coordinates.  All formulas in RESULT.md section 2.
# Test functions: real Gaussians f_j(x) = exp(-(x-x_j)^2/(2 s_j^2)).  Pair data: d = x_j-x_k, v = s_j^2+s_k^2,
# g_jk(u) = amp*exp(-(u-d)^2/(2v)), amp = sqrt(2 pi) s_j s_k/sqrt(v).
#   Z = P - Prime + A   (zero side),   I := P - Z = Prime - A  ("intersection form").
import mpmath as mp
from flint import arb, arb_mat, ctx

def mangoldt_table(N):
    lam = [mp.mpf(0)]*(N+1)
    sieve = list(range(N+1))
    for p in range(2, N+1):
        if sieve[p] == p:
            for q in range(p, N+1, p):
                if sieve[q] == q: sieve[q] = p
    for n in range(2, N+1):
        p = sieve[n]; m = n
        while m % p == 0: m //= p
        if m == 1: lam[n] = mp.log(p)
    return lam

def kappa_dh():
    return (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)

def dh_lambda_table(N):
    k = kappa_dh()
    per = [mp.mpf(0), mp.mpf(1), k, -k, mp.mpf(-1)]
    a = [mp.mpf(0)] + [per[n % 5] for n in range(1, N+1)]
    # a(n) log n = sum_{d|n} Lam(d) a(n/d),  a(1)=1
    lam = [mp.mpf(0)]*(N+1)
    divs = [[] for _ in range(N+1)]
    for d in range(2, N+1):
        for q in range(2*d, N+1, d): divs[q].append(d)
    for n in range(2, N+1):
        acc = a[n]*mp.log(n)
        for d in divs[n]: acc -= lam[d]*a[n//d]
        lam[n] = acc
    return lam

class Obj:
    """poles: list of tau (pole pair at t=+-i tau); gam: list of z (digamma argument, kernel e^{-2 z x}/(1-e^{-2x}));
    cond: constant multiplying g(0);  lam(n): generalized von Mangoldt (weight Lam(n)/sqrt n)."""
    def __init__(self, name, poles, gam, cond, lamfun, growth=0.0):
        self.name, self.poles, self.gam, self.cond, self.lamfun, self.growth = name, poles, gam, cond, lamfun, growth

def make_objects(Nmax, Ndh=2000):
    L = mangoldt_table(Nmax)
    half = mp.mpf(1)/2; q4 = mp.mpf(1)/4
    def ppow(n, p):
        k = 0
        while n % p == 0: n //= p; k += 1
        return k if n == 1 and k > 0 else 0
    O = {}
    O['zeta'] = Obj('zeta', [half], [q4], -mp.log(mp.pi), lambda n: L[n])
    def tw(p, eps):
        def f(n):
            k = ppow(n, p)
            return L[n]*(mp.mpf(eps)**k) if k else L[n]
        return f
    O['tw-_2'] = Obj('tw-_2', [half], [q4], -mp.log(mp.pi), tw(2, -1))
    O['tw+_2half'] = Obj('tw+_2half', [half], [q4], -mp.log(mp.pi), tw(2, mp.mpf(1)/2))
    for p in (2, 3, 5, 7, 11, 13):
        O['drop%d' % p] = Obj('drop%d' % p, [half], [q4], -mp.log(mp.pi), tw(p, 0))
    def trunc(Pm):
        def f(n):
            if L[n] == 0: return L[n]
            p = int(round(mp.exp(L[n])))
            return L[n] if p <= Pm else mp.mpf(0)
        return f
    for Pm in (0, 2, 3, 5, 7, 11, 13, 17, 19, 23):
        O['S<=%d' % Pm] = Obj('S<=%d' % Pm, [half], [q4], -mp.log(mp.pi), trunc(Pm))
    a = mp.mpf(1)/5
    O['EA_0.2'] = Obj('EA_0.2', [half+a, half-a], [q4+a/2, q4-a/2], -2*mp.log(mp.pi),
                      lambda n: L[n]*(mp.mpf(n)**a + mp.mpf(n)**(-a)), growth=0.2)
    def nr(q, c):
        c = mp.mpf(c); Lq = mp.log(q)
        beta = (-c + mp.sqrt(c*c-4))/2
        def f(n):
            k = ppow(n, q)
            if k: return L[n] - Lq*(beta**k + beta**(-k))*mp.sqrt(mp.mpf(n))
            return L[n]
        return Obj('NR_q%d_c%s' % (q, mp.nstr(c, 3)), [half], [q4], -mp.log(mp.pi) + 2*Lq, f, growth=0.5+float(mp.log(abs(1/beta))/Lq) if abs(beta) < 1 else 0.5+float(mp.log(abs(beta))/Lq))
    for c in ('2.2', '-2.2'):
        o = nr(2, c); O[o.name] = o
    D = dh_lambda_table(Ndh)
    O['DH'] = Obj('DH', [], [mp.mpf(3)/4], mp.log(5/mp.pi), lambda n: D[n], growth=1.2)
    return O

_cache = {}
def arch_int(z, d, v, amp):
    """int_0^inf [2g(0)-g(x)-g(-x)] e^{-2 z x}/(1-e^{-2x}) dx,  g(u)=amp*exp(-(u-d)^2/(2v)), plus g(0)*digamma(z)."""
    key = (mp.nstr(z, 30), mp.nstr(abs(d), 40), mp.nstr(v, 40), mp.mp.dps)
    if key in _cache: return _cache[key]*amp
    d = abs(d)
    g0 = mp.exp(-d*d/(2*v))
    sd = mp.sqrt(v)
    m = mp.sqrt(2*mp.log(10)*mp.mp.dps)+2
    def f(x):
        if x == 0: return mp.mpf(0)
        num = 2*g0 - mp.exp(-(x-d)**2/(2*v)) - mp.exp(-(x+d)**2/(2*v))
        return num*mp.exp(-2*z*x)/(-mp.expm1(-2*x))
    pts = [mp.mpf(0)]
    for t in (d-m*sd, d-6*sd, d-2*sd, d, d+2*sd, d+6*sd, d+m*sd):
        if t > pts[-1] + mp.mpf(10)**(-20): pts.append(t)
    pts.append(pts[-1]+3); pts.append(mp.inf)
    val = mp.quad(f, pts) + g0*mp.digamma(z)
    _cache[key] = val
    return val*amp

def reach_of(d, v, growth):
    """log of the last n kept in the prime sum: terms beyond are < 10^-(dps+10) in total."""
    T = mp.log(10)*(mp.mp.dps+10)
    e = max(growth-0.5, 0)+1
    D = mp.sqrt(2*v*T)
    for _ in range(6): D = mp.sqrt(2*v*(T + e*(d+D)))
    return d + D

def pair(xj, sj, xk, sk):
    d = xj-xk; v = sj*sj+sk*sk
    amp = mp.sqrt(2*mp.pi)*sj*sk/mp.sqrt(v)
    return d, v, amp

def entry_parts(obj, xj, sj, xk, sk, nmax_for=None):
    d, v, amp = pair(xj, sj, xk, sk)
    g0 = amp*mp.exp(-d*d/(2*v))
    P = mp.mpf(0)
    for tau in obj.poles:
        P += amp*mp.sqrt(2*mp.pi*v)*mp.exp(v*tau*tau/2)*2*mp.cosh(d*tau)
    A = obj.cond*g0
    for z in obj.gam: A += arch_int(z, d, v, amp)
    # prime sum: n with |log n -+ d| within reach
    N = int(mp.floor(mp.exp(reach_of(abs(d), v, obj.growth))))+1
    if getattr(obj, 'pp', None) is None or obj.ppN < N:
        obj.pp = []
        for n in range(2, N+1):
            ln = obj.lamfun(n)
            if ln != 0: obj.pp.append((mp.log(n), ln/mp.sqrt(n)))
        obj.ppN = N
    Pr = mp.mpf(0); lim = mp.log(N)
    i2v = 1/(2*v)
    for l, w in obj.pp:
        if l > lim: break
        Pr += w*(mp.exp(-(l-d)**2*i2v) + mp.exp(-(l+d)**2*i2v))
    Pr *= amp
    return P, Pr, A

def build(obj, xs, ss, toeplitz=False):
    n = len(xs)
    P = mp.zeros(n); I = mp.zeros(n)
    memo = {}
    for j in range(n):
        for k in range(j+1):
            key = (k-j) if toeplitz else None
            if toeplitz and key in memo:
                Pr, A = memo[key]
                d, v, amp = pair(xs[j], ss[j], xs[k], ss[k])
                Pp = mp.mpf(0)
                for tau in obj.poles:
                    Pp += amp*mp.sqrt(2*mp.pi*v)*mp.exp(v*tau*tau/2)*2*mp.cosh(d*tau)
            else:
                Pp, Pr, A = entry_parts(obj, xs[j], ss[j], xs[k], ss[k])
                if toeplitz: memo[key] = (Pr, A)
            P[j, k] = P[k, j] = Pp
            I[j, k] = I[k, j] = Pr - A
    return P, I          # Z = P - I

def gram(xs, ss):
    n = len(xs); G = mp.zeros(n)
    for j in range(n):
        for k in range(n):
            d, v, amp = pair(xs[j], ss[j], xs[k], ss[k])
            G[j, k] = amp*mp.exp(-d*d/(2*v))
    return G

def pivots(M, lose_digits=25, absrad=None):
    """Leading-principal-minor pivots by elimination without pivoting, in arb balls.
    Entry radius 10^-(dps-lose_digits)*|entry| is assumed.  Returns list of (sign, mid) ; sign 0 = undetermined."""
    n = M.rows
    ctx.prec = int(mp.mp.prec*1.0)+64
    rad = arb(10)**(-(mp.mp.dps-lose_digits))
    A = [[None]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            c = arb(mp.nstr(M[i, j], mp.mp.dps+5))
            A[i][j] = c + c*arb(0, 1)*rad + (arb(0, 1)*arb(mp.nstr(absrad, 5)) if absrad else 0)
    out = []
    for k in range(n):
        p = A[k][k]
        sgn = 1 if p > 0 else (-1 if p < 0 else 0)
        out.append((sgn, float(p.mid()) if abs(float(p.mid())) > 0 else 0.0, p))
        if sgn == 0:
            return out, k
        for i in range(k+1, n):
            f = A[i][k]/p
            for j in range(i, n):
                A[i][j] = A[i][j] - f*A[k][j]
                A[j][i] = A[i][j]
    return out, n
