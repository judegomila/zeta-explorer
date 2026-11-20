"""Independent recomputation of three cells (mpmath floating point; no code shared with table11.py; own zero finding, own quadrature).
Reads from the table output only the rectangle edges and the rates. usage: referee.py <table.json> <out.json> <A|B|C>
A: DH, row P8 (cells sym, gen, pair).  B: UT (unimodular twist), row P8 (cells gen and sym).  C: zeta, row P45."""
import sys, json, time
import mpmath as mp
T = json.load(open(sys.argv[1])); OUT = sys.argv[2]; WHICH = sys.argv[3]
j = mp.mpc(0, 1)

def rect_int(g, xl, xr, yl, yr, nsub=1):
    """counterclockwise contour integral / (2 pi i), each side split into pieces of length about 1/nsub"""
    def seg(p, q):
        n = max(1, int(abs(q - p)*nsub))
        pts = [p + (q - p)*mp.mpf(k)/n for k in range(n + 1)]
        return mp.quad(g, pts)
    a, b, c, d = mp.mpc(xl, yl), mp.mpc(xr, yl), mp.mpc(xr, yr), mp.mpc(xl, yr)
    return (seg(a, b) + seg(b, c) + seg(c, d) + seg(d, a))/(2*mp.pi*j)

def zeros_in(f, df, xl, xr, yl, yr, hx=0.2, hy=0.1):
    found = []
    x = xl
    while x <= xr + 1e-9:
        y = yl
        while y <= yr + 1e-9:
            z = mp.mpc(x, y)
            try:
                for it in range(60):
                    st = f(z)/df(z); z = z - st
                    if abs(st) < mp.mpf(10)**(-mp.mp.dps + 8): break
                else: z = None
            except Exception: z = None
            if z is not None and xl < z.real < xr and yl < z.imag < yr and all(abs(z - w) > 1e-15 for w in found): found.append(z)
            y += hy
        x += hx
    return sorted(found, key=lambda w: w.imag)

def p8(L, zeros, rate, R):
    X, Ta, Tb = R
    z = rate; x = z.real
    h = lambda s: 1/((s + z)*(mp.conj(z) - s))
    W = sum(h(r) for r in zeros)
    Cc = rect_int(lambda w: h(w)*L(w), -X, X, Ta, Tb, nsub=2)
    Qs = (L(z) + mp.conj(L(z)))/(2*x); Qg = (L(mp.conj(z)) - L(-z))/(2*x)
    Wp = sum((x - r.real)/(x*abs(z - mp.conj(r))**2) for r in zeros)
    cnt = rect_int(lambda w: L(w), -X, X, Ta, Tb, nsub=2)
    return dict(n_zeros=len(zeros), count=mp.nstr(cnt, 15), W=mp.nstr(W, 45), C=mp.nstr(Cc, 45), Q_sym=mp.nstr(Qs, 45), Q_gen=mp.nstr(Qg, 45),
                cell_sym=mp.nstr(Qs - W + Cc, 5), cell_gen=mp.nstr(Qg - W + Cc, 5), cell_pair=mp.nstr(W - Wp, 5),
                zeros=[mp.nstr(r, 30) for r in zeros])

t0 = time.time(); res = {}
if WHICH == 'A':
    mp.mp.dps = 50
    c = T['controls']['DH']; nr = c['narrow']; R = (mp.mpf(nr['rect']['X']), mp.mpf(nr['rect']['Ta']), mp.mpf(nr['rect']['Tb']))
    r0 = c['config']['rates'][0]; rate = mp.mpc(mp.mpf(r0[0]), -mp.mpf(r0[1]))
    kap = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
    chi = [0, 1, j, -j, -1]; chib = [0, 1, -j, j, -1]
    def f(s, d=0): return (1 - j*kap)/2*mp.dirichlet(s, chi, d) + (1 + j*kap)/2*mp.dirichlet(s, chib, d)
    def L(z):
        s = z + mp.mpf(1)/2
        return mp.log(5/mp.pi)/2 + mp.digamma((s + 1)/2)/2 + f(s, 1)/f(s)
    zs = zeros_in(lambda z: f(z + 0.5), lambda z: f(z + 0.5, 1), -1.0, 1.0, R[1], R[2])
    res = p8(L, zs, rate, R); res['control'] = 'DH'; res['row'] = 'P8'
elif WHICH == 'B':
    mp.mp.dps = 50
    c = T['controls']['UT']; nr = c['narrow']; R = (mp.mpf(nr['rect']['X']), mp.mpf(nr['rect']['Ta']), mp.mpf(nr['rect']['Tb']))
    r0 = c['config']['rates'][0]; rate = mp.mpc(mp.mpf(r0[0]), -mp.mpf(r0[1]))
    def L(z):
        s = z + mp.mpf(1)/2 + j                                 # alpha = 1
        return 1/s + 1/(s - 1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
    zs = []
    n = 1
    while True:
        g = mp.zetazero(n).imag
        if g - 1 > R[2]: break
        if g - 1 > R[1]: zs.append(mp.mpc(0, g - 1))            # zeros of xi(1/2 + z + i): z = i(gamma - 1)
        n += 1
    res = p8(L, zs, rate, R); res['control'] = 'UT'; res['row'] = 'P8'
elif WHICH == 'D':
    # T-NR, q = 2, c = 17/8: F(z) = xi(1/2 + z) (2 cosh(z log 2) + c); row P8
    mp.mp.dps = 50
    c = T['controls']['NR']; nr = c['narrow']; R = (mp.mpf(nr['rect']['X']), mp.mpf(nr['rect']['Ta']), mp.mpf(nr['rect']['Tb']))
    r0 = c['config']['rates'][0]; rate = mp.mpc(mp.mpf(r0[0]), -mp.mpf(r0[1]))
    cc = mp.mpf(17)/8; l2 = mp.log(2)
    def L(z):
        s = z + mp.mpf(1)/2
        return (1/s + 1/(s - 1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
                + 2*l2*mp.sinh(z*l2)/(2*mp.cosh(z*l2) + cc))
    zs = []
    n = 1
    while mp.zetazero(n).imag < R[2]:
        g = mp.zetazero(n).imag
        if g > R[1]: zs.append(mp.mpc(0, g))
        n += 1
    d0 = mp.acosh(cc/2)/l2                                   # zeros of the factor: z = +-d0 + i (2k+1) pi/log 2
    k = 0
    while (2*k + 1)*mp.pi/l2 < R[2]:
        y = (2*k + 1)*mp.pi/l2
        if y > R[1]: zs += [mp.mpc(d0, y), mp.mpc(-d0, y)]
        k += 1
    res = p8(L, zs, rate, R); res['control'] = 'NR'; res['row'] = 'P8'
elif WHICH == 'C':
    mp.mp.dps = 95
    c = T['controls']['zeta']['p45']
    sL, sR, Ta, Tb = mp.mpf(c['rect']['sigL']), mp.mpf(c['rect']['sigR']), mp.mpf(c['rect']['Ta']), mp.mpf(c['rect']['Tb'])
    s = mp.mpc(mp.mpf(1)/2, 20); Y = mp.mpf(c['Y']); lY = mp.log(Y)
    k = lambda u: mp.exp((u - s)*lY)/((u - s)**2*lY)
    LD = lambda u: mp.zeta(u, derivative=1)/mp.zeta(u)
    def seg(p, q, n):
        pts = [p + (q - p)*mp.mpf(i)/n for i in range(n + 1)]
        return mp.quad(lambda u: -LD(u)*k(u), pts)
    C3 = (seg(mp.mpc(sL, Ta), mp.mpc(sR, Ta), 50) + seg(mp.mpc(sR, Tb), mp.mpc(sL, Tb), 50) + seg(mp.mpc(sL, Tb), mp.mpc(sL, Ta), 128))/(2*mp.pi*j)
    zs = []
    n = 1
    while mp.zetazero(n).imag < Tb:
        zs.append(mp.zetazero(n)); zs.append(mp.conj(mp.zetazero(n))); n += 1
    LD1 = mp.diff(LD, s)
    Res = -LD(s) - LD1/lY + k(mp.mpf(1)) - sum(k(r) for r in zs)       # pole at 1: multiplicity -1 in the divisor
    cc = sR - s.real; T1 = Ta - s.imag; T2 = Tb - s.imag
    def U(lam):
        return lam*(mp.gammainc(-1, -lam*mp.mpc(cc, T1)) - mp.gammainc(-1, -lam*mp.mpc(cc, T2)))/(2*mp.pi*j*lY)
    N = 6000; SY = 0; TU = 0
    for p in range(2, N + 1):
        if not mp.isprime(p) if hasattr(mp, 'isprime') else any(p % d == 0 for d in range(2, int(p**0.5) + 1)): continue
        q = p
        while q <= N:
            ns = mp.power(q, -s); lq = mp.log(q)
            if q < Y: SY += mp.log(p)*(1 - lq/lY)*ns
            TU += mp.log(p)*ns*U(lY - lq)
            q *= p
    res = dict(control='zeta', row='P45', n_zeros=len(zs), N=N, S_Y=mp.nstr(SY, 45), TU=mp.nstr(TU, 45), C3=mp.nstr(C3, 45), Res=mp.nstr(Res, 45),
               cell=mp.nstr(SY - TU + C3 - Res, 5))
res['dps'] = mp.mp.dps; res['secs'] = time.time() - t0
print(json.dumps(res, indent=1)); json.dump(res, open(OUT, 'w'), indent=1)
