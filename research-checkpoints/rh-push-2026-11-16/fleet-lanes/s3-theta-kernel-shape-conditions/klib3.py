# s3-theta-kernel-shape-conditions: shared kernel code (python-flint ball arithmetic).
# Convention x = e^{4u}.  F(w) = int_R K(u) e^{2wu} du = completed function at centre + w.
#   zeta:   K = Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u});  F(w) = xi(1/2+w)/4
#   'dir':  F = sum b(n) n^-s, b periodic mod q, parity delta:
#           K = 4 e^{(1+2 delta)u} sum_n b(n) n^delta exp(-pi n^2 e^{4u}/q);  F(w) = (q/pi)^{(s+delta)/2} Gamma((s+delta)/2) F(s), s = 1/2+w
#   'delta': K = 2 e^{12u} Delta(i e^{2u}) = 2 e^{12u} sum tau(n) exp(-2 pi n e^{2u});  F(w) = (2pi)^{-(6+w)} Gamma(6+w) L(Delta, 6+w)
#   'heat': K = e^{tau u^2} K_base
#   'tnr':  K = Phi(u - l/2) + c Phi(u) + Phi(u + l/2), l = log q;  F(w) = (xi(1/2+w)/4)(2 cosh(w log q) + c)
#   'ea':   K = int Phi(u/2+s) Phi(u/2-s) e^{4as} ds;  F(w) = (xi/4)(1/2+w+a) (xi/4)(1/2+w-a)
#   'liou': one-sided, u >= 0 only: K = 4 e^{u} sum lambda(n) exp(-pi n^2 e^{4u})  (no functional equation)
# Series truncation of the theta sums and trapezoid quadrature tails are not enclosed: results are balls for the
# truncated objects (label MEASURED).  Truncation is set 40 bits below the working precision.
import math
from flint import arb, arb_series, acb, ctx, fmpz_poly, arb_mat

LN2 = math.log(2.0)


def setp(prec, cap=1):
    ctx.prec = prec
    ctx.cap = cap


def kronecker(D, n):
    if n == 0:
        return 1 if abs(D) == 1 else 0
    r = 1; t = 0
    while n % 2 == 0:
        n //= 2; t += 1
    if t:
        if D % 2 == 0:
            return 0
        if t % 2 and D % 8 in (3, 5):
            r = -r
    a = D % n; m = n
    while a:
        while a % 2 == 0:
            a //= 2
            if m % 8 in (3, 5):
                r = -r
        a, m = m, a
        if a % 4 == 3 and m % 4 == 3:
            r = -r
        a %= m
    return r if m == 1 else 0


def dh_b():
    k = ((10 - 2*arb(5).sqrt()).sqrt() - 2)/(arb(5).sqrt() - 1)
    return [arb(0), arb(1), k, -k, arb(-1)]


_TAU = None


def tau_table(M=1200):
    global _TAU
    if _TAU is not None and len(_TAU) > M:
        return _TAU
    # prod (1-q^n)^24 = (sum (-1)^k (2k+1) q^{k(k+1)/2})^8 ; tau(n) = coefficient of q^{n-1}
    c = [0]*(M + 1)
    k = 0
    while k*(k + 1)//2 <= M:
        c[k*(k + 1)//2] = (-1)**k*(2*k + 1); k += 1
    p = fmpz_poly(c)
    def trunc(P):
        return fmpz_poly(P.coeffs()[:M + 1])
    p2 = trunc(p*p); p4 = trunc(p2*p2); p8 = trunc(p4*p4)
    co = p8.coeffs()
    _TAU = [0] + [int(x) for x in co] + [0]*(M + 2 - len(co))
    return _TAU


_LIOU = None


def liou_table(M=400):
    global _LIOU
    if _LIOU is None:
        lam = [0, 1] + [0]*(M - 1)
        for n in range(2, M + 1):
            m = n; c = 0; p = 2
            while p*p <= m:
                while m % p == 0:
                    m //= p; c += 1
                p += 1
            if m > 1:
                c += 1
            lam[n] = -1 if c % 2 else 1
        _LIOU = lam
    return _LIOU


def SPEC(name):
    """named kernels of the batch."""
    if name == 'zeta':
        return {'type': 'zeta'}
    if name == 'dh':
        return {'type': 'dir', 'q': 5, 'delta': 1, 'bname': 'dh'}
    if name.startswith('chi'):                       # chi-3, chi-4, chi5, chi-19 ... (fundamental discriminant)
        D = int(name[3:])
        return {'type': 'dir', 'q': abs(D), 'delta': (0 if D > 0 else 1), 'D': D}
    if name == 'delta':
        return {'type': 'delta'}
    if name.startswith('heat'):                      # heat-0.2, heat0.05 : e^{tau u^2} Phi ; heat-0.2:dh etc
        rest = name[4:]
        base = 'zeta'
        if ':' in rest:
            rest, base = rest.split(':')
        return {'type': 'heat', 'tau': rest, 'base': SPEC(base)}
    if name.startswith('tnr'):                       # tnr3_2.2
        q, c = name[3:].split('_')
        return {'type': 'tnr', 'q': int(q), 'c': c}
    if name.startswith('ea'):                        # ea0.35
        return {'type': 'ea', 'a': name[2:]}
    if name == 'liou':
        return {'type': 'liou'}
    raise ValueError(name)


def is_even(spec):
    return spec['type'] != 'liou'


def _bvec(spec):
    if 'bv' not in spec:
        if spec.get('bname') == 'dh':
            spec['bv'] = dh_b()
        else:
            q = spec['q']
            spec['bv'] = [arb(kronecker(spec['D'], n)) for n in range(q)]
        spec['bnz'] = [not (x == 0) for x in spec['bv']]
    return spec['bv']


def _ser_zeta_pos(u0, n):
    """Taylor coefficients of Phi at u0 >= 0 (arb), length n."""
    prec = ctx.prec
    U = arb_series([u0, 1])
    e4 = (4*U).exp(); e5 = (5*U).exp(); e9 = (9*U).exp()
    x0 = float(arb(4*u0).exp().mid())
    pi = arb.pi()
    s = arb_series([0])
    N = 1
    while math.pi*(N*N - 1)*x0 < (prec + 40)*LN2:
        N += 1
    for m in range(1, N + 1):
        m2 = m*m
        s = s + (2*pi*pi*m2*m2*e9 - 3*pi*m2*e5)*(-pi*m2*e4).exp()
    c = s.coeffs()
    return c + [arb(0)]*(n - len(c))


def _ser_dir_pos(spec, u0, n):
    prec = ctx.prec
    b = _bvec(spec); q = spec['q']; d = spec['delta']
    U = arb_series([u0, 1])
    e4 = (4*U).exp()
    x0 = float(arb(4*u0).exp().mid())
    pi = arb.pi()
    s = arb_series([0])
    m = 1
    while True:
        if math.pi*(m*m - 1)*x0/q > (prec + 40)*LN2:
            break
        if spec['bnz'][m % q]:
            s = s + (b[m % q]*(m**d))*(-(pi*m*m/q)*e4).exp()
        m += 1
    s = 4*((1 + 2*d)*U).exp()*s
    c = s.coeffs()
    return c + [arb(0)]*(n - len(c))


def _ser_delta_pos(u0, n):
    prec = ctx.prec
    U = arb_series([u0, 1])
    e2 = (2*U).exp()
    y0 = float(arb(2*u0).exp().mid())
    pi = arb.pi()
    M = int((prec + 100)*LN2/(2*math.pi*y0)) + 3
    tau = tau_table(max(M + 5, 1200))
    s = arb_series([0])
    for m in range(1, M + 1):
        s = s + tau[m]*(-(2*pi*m)*e2).exp()
    s = 2*(12*U).exp()*s
    c = s.coeffs()
    return c + [arb(0)]*(n - len(c))


def _ser_liou_pos(u0, n):
    prec = ctx.prec
    U = arb_series([u0, 1])
    e4 = (4*U).exp()
    x0 = float(arb(4*u0).exp().mid())
    pi = arb.pi()
    lam = liou_table()
    s = arb_series([0])
    m = 1
    while math.pi*(m*m - 1)*x0 <= (prec + 40)*LN2:
        s = s + lam[m]*(-(pi*m*m)*e4).exp()
        m += 1
    s = 4*U.exp()*s
    c = s.coeffs()
    return c + [arb(0)]*(n - len(c))


def _flip(c):
    return [(-x if k % 2 else x) for k, x in enumerate(c)]


def _even_ser(fpos, u0, n):
    u0 = arb(u0)
    if u0 < 0:
        return _flip(fpos(-u0, n))
    return fpos(u0, n)


def _mul(a, b, n):
    return (arb_series(a)*arb_series(b)).coeffs() + [arb(0)]*n


def kser(spec, u0, n):
    """Taylor coefficients c_0..c_{n-1} of the kernel at u0: K(u0+e) = sum c_k e^k.  Requires ctx.cap >= n."""
    assert ctx.cap >= n
    u0 = arb(u0)
    t = spec['type']
    if t == 'zeta':
        return _even_ser(_ser_zeta_pos, u0, n)[:n]
    if t == 'dir':
        return _even_ser(lambda v, k: _ser_dir_pos(spec, v, k), u0, n)[:n]
    if t == 'delta':
        return _even_ser(_ser_delta_pos, u0, n)[:n]
    if t == 'liou':
        assert u0 >= 0
        return _ser_liou_pos(u0, n)[:n]
    if t == 'heat':
        base = kser(spec['base'], u0, n)
        U = arb_series([u0, 1])
        g = (arb(spec['tau'])*U*U).exp()
        return ((arb_series(base)*g).coeffs() + [arb(0)]*n)[:n]
    if t == 'tnr':
        half = arb(spec['q']).log()/2
        a = kser({'type': 'zeta'}, u0 - half, n)
        b = kser({'type': 'zeta'}, u0, n)
        c = kser({'type': 'zeta'}, u0 + half, n)
        cc = arb(spec['c'])
        return [a[k] + cc*b[k] + c[k] for k in range(n)]
    if t == 'ea':
        return _ser_ea(spec, u0, n)
    raise ValueError(t)


def _ser_ea(spec, u0, n, hq=None):
    """K_E(u) = int_R Phi(u/2+s) Phi(u/2-s) e^{4as} ds, trapezoid in s (step hq), even in s after cosh."""
    prec = ctx.prec
    a = arb(spec['a'])
    if hq is None:
        hq = spec.get('hq', 2.0**-6 if prec <= 200 else (2.0**-7 if prec <= 420 else 2.0**-8))
    hq = arb(hq)
    half = arb(u0)/2
    Z = {'type': 'zeta'}
    tot = None
    j = 0
    peak = None
    while True:
        s = hq*j
        A = kser(Z, half + s, n)
        B = kser(Z, half - s, n)
        A = [A[k]/(arb(2)**k) for k in range(n)]
        B = [B[k]/(arb(2)**k) for k in range(n)]
        w = (4*a*s).cosh()*(1 if j == 0 else 2)
        P = (arb_series(A)*arb_series(B)).coeffs()
        P = [w*x for x in P] + [arb(0)]*(n - len(P))
        tot = P if tot is None else [tot[k] + P[k] for k in range(n)]
        m0 = abs(P[0])
        if peak is None:
            peak = m0
        if j > 4 and not (m0 > peak*arb(2)**(-(prec + 40))):
            break
        j += 1
        if j > 4000:
            raise RuntimeError('ea quadrature did not terminate')
    return [hq*x for x in tot][:n]


def kval(spec, u0):
    return kser(spec, u0, 1)[0]


def derivs(c):
    """Taylor coefficients -> derivatives K^{(k)}(u0)."""
    out = []; f = arb(1)
    for k, x in enumerate(c):
        if k > 0:
            f = f*k
        out.append(x*f)
    return out


def sgn(x):
    """certified sign of an arb: +1, -1, or 0 if the ball contains zero."""
    if x > 0:
        return 1
    if x < 0:
        return -1
    return 0


def rle(signs):
    """run-length encoding of a sign sequence."""
    out = []
    for s in signs:
        if out and out[-1][0] == s:
            out[-1][1] += 1
        else:
            out.append([s, 1])
    return out


def gl_nodes(n):
    """Gauss-Legendre nodes and weights on [-1,1] as arb."""
    xs = []; ws = []
    for k in range(n):
        x, w = arb.legendre_p_root(n, k, weight=True)
        xs.append(x); ws.append(w)
    return xs, ws


def kgrid(spec, h, umax, with_neg=False):
    """kernel values K(j h), j = 0..J (J = ceil(umax/h)); for 'ea' the discrete convolution on the same grid
    (trapezoid of step h)."""
    J = int(math.ceil(umax/h))
    hh = arb(h)
    if spec['type'] == 'ea':
        a = arb(spec['a'])
        base = kgrid({'type': 'zeta'}, h, umax + 0.0)
        # A(s) = Phi(s) e^{2as}, B(s) = Phi(s) e^{-2as}; K_E(jh) = h sum_m A(mh) B((j-m)h), m over Z
        Jb = len(base) - 1
        ea = [(2*a*hh*m).exp() for m in range(Jb + 1)]
        def A(m):
            return base[abs(m)]*(ea[m] if m >= 0 else 1/ea[-m]) if abs(m) <= Jb else None
        def B(m):
            return base[abs(m)]*(1/ea[m] if m >= 0 else ea[-m]) if abs(m) <= Jb else None
        Al = {m: A(m) for m in range(-Jb, Jb + 1)}
        Bl = {m: B(m) for m in range(-Jb, Jb + 1)}
        out = []
        for j in range(J + 1):
            s = arb(0)
            for m in range(max(-Jb, j - Jb), min(Jb, j + Jb) + 1):
                s += Al[m]*Bl[j - m]
            out.append(hh*s)
        return out
    return [kval(spec, hh*j) for j in range(J + 1)]


def umax_for(prec, spec=None):
    """u beyond which the kernel is below 2^-prec times its scale (zeta-type: pi e^{4u}/q)."""
    q = 1
    if spec is not None:
        if spec['type'] == 'dir':
            q = spec['q']
        if spec['type'] in ('heat',):
            return umax_for(prec, spec['base']) + 0.05
        if spec['type'] == 'tnr':
            return umax_for(prec) + math.log(spec['q'])/2
        if spec['type'] == 'ea':
            return 2*umax_for(prec) + 0.0
        if spec['type'] == 'delta':
            return 0.5*math.log((prec + 60)*LN2/(2*math.pi)) + 0.3
    return 0.25*math.log(q*(prec + 60)*LN2/math.pi) + 0.15


if __name__ == '__main__':
    import mpmath as mp
    setp(200, 6)
    print('Phi(0) =', kval(SPEC('zeta'), 0), '(known 0.446696900467...)')
    for nm in ['zeta', 'dh', 'chi-3', 'chi-4', 'chi5', 'chi-19', 'delta', 'heat-0.2', 'tnr3_2.2', 'ea0.35']:
        sp = SPEC(nm)
        a = kser(sp, arb('0.3'), 6); b = kser(sp, arb('-0.3'), 6)
        ev = max(abs(float(((a[k] - (-1)**k*b[k])/a[0]).mid())) for k in range(6))
        # finite-difference check of the series
        e = arb('1e-12')
        fd = (kval(sp, arb('0.3') + e) - kval(sp, arb('0.3') - e))/(2*e)
        print('%-10s K(0.3) = %s  evenness defect %.1e  c1 vs FD %.2e' % (nm, a[0].str(15), ev, abs(float(((fd - a[1])/a[1]).mid()))))
    # Fourier identity: int K e^{2wu} du against mpmath, w = 0.4 + 3.7i
    mp.mp.dps = 30
    w = mp.mpc('0.4', '3.7')
    def F_quad(sp, w, h=1/64, U=2.6):
        setp(200, 1)
        J = int(U/h); tot = acb(0)
        ww = acb(mp.nstr(w.real, 25), mp.nstr(w.imag, 25))
        for j in range(-J, J + 1):
            u = arb(h)*j
            tot += acb(kval(sp, u))*(2*ww*u).exp()
        return tot*arb(h)
    def xi4(s):
        return s*(s - 1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)/4
    s = mp.mpf(1)/2 + w
    print('zeta  quad', F_quad(SPEC('zeta'), w).str(18), ' ref', mp.nstr(xi4(s), 18))
    kdh = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
    bb = [0, 1, kdh, -kdh, -1]
    Fdh = sum(bb[r]*mp.zeta(s, mp.mpf(r)/5) for r in range(1, 5))/5**s
    print('dh    quad', F_quad(SPEC('dh'), w).str(18), ' ref', mp.nstr((5/mp.pi)**((s + 1)/2)*mp.gamma((s + 1)/2)*Fdh, 18))
    L3 = (mp.zeta(s, mp.mpf(1)/3) - mp.zeta(s, mp.mpf(2)/3))/3**s
    print('chi-3 quad', F_quad(SPEC('chi-3'), w).str(18), ' ref', mp.nstr((3/mp.pi)**((s + 1)/2)*mp.gamma((s + 1)/2)*L3, 18))
    tau = tau_table()
    print('tau(1..6) =', tau[1:7], ' tau(11) =', tau[11], '(expect 1,-24,252,-1472,4830,-6048; 534612)')
    sD = 6 + mp.mpf('14.0')
    LD = mp.fsum(tau[n]*mp.mpf(n)**(-sD) for n in range(1, 1000))
    print('delta quad', F_quad(SPEC('delta'), mp.mpc(14, 0), h=1/64, U=3.0).str(18), ' ref', mp.nstr((2*mp.pi)**(-sD)*mp.gamma(sD)*LD, 18))
    print('tnr   quad', F_quad(SPEC('tnr3_2.2'), w, U=3.2).str(18), ' ref', mp.nstr(xi4(s)*(2*mp.cosh(w*mp.log(3)) + mp.mpf('2.2')), 18))
    a = mp.mpf('0.35')
    print('ea    quad', F_quad(SPEC('ea0.35'), w, h=1/16, U=3.4).str(18), ' ref', mp.nstr(xi4(s + a)*xi4(s - a), 18))
    setp(200, 1)
    g1 = kgrid(SPEC('ea0.35'), 1/64, 1.0)
    print('ea grid vs series at u=0.5:', g1[32].str(25), kval(SPEC('ea0.35'), arb('0.5')).str(25))
