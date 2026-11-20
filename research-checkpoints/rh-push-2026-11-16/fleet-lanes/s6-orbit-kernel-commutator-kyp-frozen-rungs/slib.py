# s5-volterra-shear-phi-kernel-norms: shared ball-arithmetic kernels and quadrature (python-flint).
# Convention x = e^{4u};  Xi_F(w) = int_R Phi_F(u) e^{iwu} du = Lambda_F(1/2 + i w/2).
# Kernel formulas follow s1-kernel-shear-norms/klib.py and s3-shear-bridge-gram-forms/glib.py.
# Balls enclose rounding only; quadrature truncation is checked by changing the node count.
import math
from flint import arb, acb, ctx

LN2 = math.log(2.0)


def setprec(p):
    ctx.prec = int(p)


# ---------------------------------------------------------------- Gauss-Legendre
_GL = {}


def gl_unit(n):
    key = (n, ctx.prec)
    if key not in _GL:
        xs = []; ws = []
        for k in range(n):
            x, w = arb.legendre_p_root(n, k, weight=True)
            xs.append(x); ws.append(w)
        _GL[key] = (xs, ws)
    return _GL[key]


def gl_panels(panels, npp):
    """nodes and weights on a list of (lo, hi) panels (lo, hi: arb or exact floats)."""
    xs, ws = gl_unit(npp)
    T = []; W = []
    for lo, hi in panels:
        lo = arb(lo); hi = arb(hi)
        h = (hi - lo)/2; m = (hi + lo)/2
        for x, w in zip(xs, ws):
            T.append(m + h*x); W.append(h*w)
    return T, W


def npp_for(prec, extra=24):
    """nodes per panel of width 1/8 for the kernels here (ellipse parameter about 9.7: 6.5 bits per node)."""
    return int(prec/6.5) + extra


def split(lo, hi, step=0.125):
    n = max(1, int(math.ceil((hi - lo)/step - 1e-9)))
    st = (hi - lo)/n
    return [(lo + i*st, lo + (i + 1)*st) for i in range(n)]


# ---------------------------------------------------------------- kernels (arb -> arb)
def _cut():
    return (ctx.prec + 64)*LN2


def phi_zeta(u):
    u = abs(u)
    P = arb.pi()
    e4 = (4*u).exp(); e5 = (5*u).exp(); e9 = (9*u).exp()
    pe = P*e4
    fpe = float(pe); cut = _cut()
    s = arb(0); n = 1
    while True:
        n2 = n*n
        s += (2*P*P*n2*n2*e9 - 3*P*n2*e5)*(-pe*n2).exp()
        if fpe*(n2 + 2*n) > cut:
            break
        n += 1
    return s


def phi_zeta_lead(u):
    P = arb.pi()
    return (2*P*P*(9*u).exp() - 3*P*(5*u).exp())*(-P*(4*u).exp()).exp()


def phi_repo(u):
    """kernel as typed in the repo moment sources (prefactors e^{4u}, e^{2u}); u >= 0."""
    P = arb.pi()
    e2 = (2*u).exp(); e4 = (4*u).exp()
    pe = P*e4; fpe = float(pe); cut = _cut()
    s = arb(0); n = 1
    while True:
        n2 = n*n
        s += (2*P*P*n2*n2*e4 - 3*P*n2*e2)*(-pe*n2).exp()
        if fpe*(n2 + 2*n) > cut:
            break
        n += 1
    return s


def make_F(bfun, q, delta, lead_only=False):
    def f(u):
        u = abs(u)
        P = arb.pi()
        pe = P*(4*u).exp()/q
        fpe = float(pe); cut = _cut()
        b = bfun()
        s = arb(0); n = 1
        while True:
            bn = b[n % q]
            if bn != 0:
                s += bn*(arb(n)**delta)*(-pe*(n*n)).exp()
            if lead_only or fpe*(n*n + 2*n) > cut:
                break
            n += 1
        return 4*((1 + 2*delta)*u).exp()*s
    return f


def _kappa():
    s5 = arb(5).sqrt()
    return ((10 - 2*s5).sqrt() - 2)/(s5 - 1)


def _dh_b():
    k = _kappa()
    return [0, 1, k, -k, -1]


CHARS = {
    'chi-3': ([0, 1, -1], 3, 1),
    'chi-4': ([0, 1, 0, -1], 4, 1),
    'chi5': ([0, 1, -1, -1, 1], 5, 0),
    'chi-7': ([0, 1, 1, -1, 1, -1, -1], 7, 1),
    'chi8': ([0, 1, 0, -1, 0, -1, 0, 1], 8, 0),
}


def _liouville(N):
    lam = [0, 1] + [0]*(N - 1)
    for n in range(2, N + 1):
        m = n; c = 0; p = 2
        while p*p <= m:
            while m % p == 0:
                m //= p; c += 1
            p += 1
        if m > 1: c += 1
        lam[n] = -1 if c % 2 else 1
    return lam


_LAM = _liouville(400)


def phi_liou(u):
    """sign twist (Liouville): 4 e^u sum lambda(n) exp(-pi n^2 e^{4u}); no functional equation; used on u >= 0."""
    P = arb.pi()
    pe = P*(4*u).exp(); fpe = float(pe); cut = _cut()
    s = arb(0); n = 1
    while True:
        s += _LAM[n]*(-pe*(n*n)).exp()
        if fpe*(n*n + 2*n) > cut:
            break
        n += 1
    return 4*u.exp()*s


def make_heat(tau):
    t = arb(tau)
    return lambda u: (t*u*u).exp()*phi_zeta(u)


def make_nr(q, c):
    c = arb(c)

    def f(u):
        l2 = arb(q).log()/2
        return c*phi_zeta(u) + phi_zeta(u - l2) + phi_zeta(u + l2)
    return f


def make_shift(c):
    c = arb(c)
    return lambda u: phi_zeta(u + c)


def make_gauge(t0):
    """zeta kernel with the sign flipped for u > t0 (b-volterra-norm T2); transform has an off-line zero."""
    return lambda u: phi_zeta(u) if float(u) <= t0 else -phi_zeta(u)


# ---------------------------------------------------------------- registry
def u_of_q(q):
    return 1.5 + math.ceil(2*math.log(q))/8.0


def kernel_spec(key):
    """returns (fn or None, panels, note). fn None means a table kernel (E_b)."""
    if key == 'flat': return (lambda u: arb(1)), split(0, 1.0), 'Phi = 1 on [0, 1] (source object of combination 3)'
    if key == 'zeta': return phi_zeta, split(0, 1.5), ''
    if key == 'zeta_lead': return phi_zeta_lead, split(0, 1.5), 'n = 1 theta term of zeta'
    if key == 'zeta_repo': return phi_repo, split(0, 1.5), 'kernel as typed in the repo sources'
    if key == 'liouville': return phi_liou, split(0, 1.5), 'u >= 0 only'
    if key.startswith('gauge'):
        t0 = float(key[5:]); return make_gauge(t0), split(0, t0) + split(t0, 1.5), 'sign flipped for u > %g' % t0
    if key in CHARS:
        b, q, d = CHARS[key]
        return make_F(lambda b=b: b, q, d), split(0, u_of_q(q)), ''
    if key.startswith('lead('):
        q, d = key[5:-1].split(','); q = int(q); d = int(d)
        return make_F(lambda: [0, 1] + [0]*(q - 2) if q > 1 else [1], q, d, lead_only=True), split(0, u_of_q(q)), 'n = 1 theta term'
    if key == 'DH': return make_F(_dh_b, 5, 1), split(0, u_of_q(5)), ''
    if key == 'DH_lead': return make_F(_dh_b, 5, 1, lead_only=True), split(0, u_of_q(5)), ''
    if key.startswith('heat'):
        tau = float(key[4:]); return make_heat(tau), split(0, 1.5), ''
    if key.startswith('slead'):
        c = float(key[5:])
        return (lambda u, c=c: phi_zeta_lead(u + arb(c))), split(0.0, 0.125*math.ceil((1.5 - c)/0.125)), 'n = 1 term of zeta shifted by c, u >= 0'
    if key.startswith('shift'):
        c = float(key[5:])
        lo = max(0.0, -c - 1.5); hi = max(0.25, 1.5 - c)
        n = max(2, int(math.ceil((hi - lo)/0.125)))
        st = (hi - lo)/n
        return make_shift(c), [(lo + i*st, lo + (i + 1)*st) for i in range(n)], ''
    if key.startswith('NR('):
        q, c = key[3:-1].split(','); q = int(q); c = float(c)
        l2 = math.log(q)/2
        if l2 < 3.0:
            pan = split(0, 0.125*math.ceil((l2 + 1.5)/0.125))
        else:
            lo = 0.125*math.floor((l2 - 1.5)/0.125)
            pan = split(0, 1.5) + split(lo, lo + 3.125)
        return make_nr(q, c), pan, ''
    if key.startswith('E_b='):
        return None, split(0, 3.0), 'convolution table'
    raise KeyError(key)


def conv_table(b, T, npp):
    """values of Phi_b(u) = e^{-2bu} int Phi(u-v) Phi(v) e^{4bv} dv at the nodes T (kernel of xi(s+b)xi(s-b))."""
    b = arb(b)
    V, WV = gl_panels(split(-1.5, 1.5), npp)
    pv = [phi_zeta(v)*(4*b*v).exp()*w for v, w in zip(V, WV)]
    fV = [float(v) for v in V]
    out = []
    for u in T:
        fu = float(u)
        s = arb(0)
        for v, fv, p in zip(V, fV, pv):
            if abs(fu - fv) < 1.56:
                s += phi_zeta(u - v)*p
        out.append((-2*b*u).exp()*s)
    return out


EXTRA_U = 0.0     # optional extension of every window at its upper end (combination 4: high moments need a longer tail)


def table(key, npp=None, with_fn=False):
    """nodes T, weights W, kernel values K on the half-line window of `key` at the current precision."""
    fn, panels, note = kernel_spec(key)
    if EXTRA_U > 0:
        top = max(hi for lo, hi in panels)
        panels = panels + split(top, top + EXTRA_U)
    if npp is None:
        npp = npp_for(ctx.prec)
    T, W = gl_panels(panels, npp)
    if fn is None:
        K = conv_table(float(key[4:]), T, npp)
    else:
        K = [fn(t) for t in T]
    return T, W, K


# ---------------------------------------------------------------- moments of Phi^2
def exp_moments(T, W, K, a):
    """I, E_plus, E_minus of Phi^2 with weights 1, e^{2at}, e^{-2at}."""
    a = arb(a)
    I = arb(0); Ep = arb(0); Em = arb(0)
    for t, w, k in zip(T, W, K):
        m = w*k*k
        e = (2*a*t).exp()
        I += m; Ep += m*e; Em += m/e
    return I, Ep, Em


def shear_angle(I, Ep, Em):
    """sin^2 theta = mu^2/(|p|^2 |q|^2) = 4 (E+ E- - I^2) / ((E+ + E-)^2 - 4 I^2)."""
    return 4*(Ep*Em - I*I)/((Ep + Em)**2 - 4*I*I)


def fl(x):
    return float(x)


def log10abs(x):
    """log10 |x| for an arb of any size."""
    m = x.mid()
    if m == 0:
        return float('-inf')
    man, ex = m.man_exp()
    man = int(man); ex = int(ex)
    bl = abs(man).bit_length()
    return (math.log(abs(man) >> max(0, bl - 60)) + (max(0, bl - 60) + ex)*LN2)/math.log(10)


def sgn(x):
    if x > 0: return 1
    if x < 0: return -1
    return 0
