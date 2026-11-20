"""Statement O line 11: per-control table of the cited identities in Arb balls (python-flint).
Rows P8 (order 1), P1 (order 2), EF (prime side, wide rectangle), P45 (Fejer kernel). See PREREG.md and RESULT.md.
usage: table11.py <out.json> [control,control,...]
"""
import os, sys, json, math, time, importlib.util
from multiprocessing import Pool
from flint import acb, arb, acb_series, ctx

HERE = os.path.dirname(os.path.abspath(__file__))
P_MAIN, P_45 = 256, 400
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
I = acb(0, 1)

# ---------------------------------------------------------------- exact transfer of balls between processes
def _pk(x):
    m, e = x.mid().man_exp(); rm, re_ = x.rad().man_exp()
    return (int(m), int(e), int(rm), int(re_))
def _up(t):
    m, e, rm, re_ = t
    mid = arb(m)*arb(2)**e; rad = arb(rm)*arb(2)**re_
    return arb(mid, arb(rad.upper()))
def pack(v):
    v = acb(v); return (_pk(v.real), _pk(v.imag))
def unpack(t): return acb(_up(t[0]), _up(t[1]))
def fl(x): return float(arb(x).mid())
def cfl(v): return complex(fl(v.real), fl(v.imag))
def A(x): return arb(x)
def C(p): return acb(arb(p[0]), arb(p[1]))

# ---------------------------------------------------------------- series jets
def jets(ser):
    c = list(ser.coeffs()) + [acb(0)]*3
    return c[0], c[1], 2*c[2]
def X(u):
    ctx.cap = 3
    return acb_series([u, 1])

def kappa_dh():
    return ((10 - 2*arb(5).sqrt()).sqrt() - 2)/(arb(5).sqrt() - 1)

class Factor:
    def __init__(self, name, ser, sign, poles):
        self.name, self.ser, self.sign, self.poles = name, ser, sign, poles
    def jet(self, u): return jets(self.ser(u))

# ---------------------------------------------------------------- arithmetic helpers (plain python)
def mangoldt(N):
    """list lam[n] = (p, k) if n = p^k else None"""
    out = [None]*(N + 1); sieve = bytearray([1])*(N + 1)
    for p in range(2, N + 1):
        if sieve[p]:
            for m in range(p*p, N + 1, p): sieve[m] = 0
            q, k = p, 1
            while q <= N:
                out[q] = (p, k); q *= p; k += 1
    return out

def M2():
    ctx.cap = 2
    z = jets(acb_series([acb(2), 1]).zeta())
    return (-z[1].real)/(2 - z[0].real)          # (-zeta'(2))/(2 - zeta(2))

class Control:
    """Dirichlet-series control: D = prod factor^sign, completed F = G D (G'/G = gld)."""
    heat = False
    def __init__(self, name):
        self.name = name
        a = arb(5)/16; al = arb(1); q = arb(2); c = arb(17)/8          # exact dyadic parameters
        lq = lambda: arb(2).log()
        self.symmetric = name in ('zeta', 'DH', 'EA', 'NR')
        zg = lambda s: 1/s + 1/(s - 1) - arb.pi().log()/2 + (s/2).digamma()/2
        if name == 'zeta':
            self.factors = [Factor('zeta(u)', lambda u: X(u).zeta(), 1, [acb(1)])]
            self.gld = zg
        elif name == 'EA':
            self.a = a
            self.factors = [Factor('zeta(u+a)', lambda u: X(u + a).zeta(), 1, [acb(1 - a)]),
                            Factor('zeta(u-a)', lambda u: X(u - a).zeta(), 1, [acb(1 + a)])]
            self.gld = lambda s: zg(s + a) + zg(s - a)
        elif name == 'NR':
            self.q, self.c = q, c
            def K(u):
                e = ((X(u) - arb(1)/2)*lq()).exp()
                return e + c + e.inv()
            self.factors = [Factor('zeta(u)', lambda u: X(u).zeta(), 1, [acb(1)]), Factor('K(u)', K, 1, [])]
            self.gld = zg
        elif name == 'UT':
            self.al = al
            self.factors = [Factor('zeta(u+i alpha)', lambda u: X(u + I*al).zeta(), 1, [acb(1) - I*al])]
            self.gld = lambda s: zg(s + I*al)
        elif name == 'TW':
            def z2(u):
                ctx.cap = 3
                return acb_series([2*u, 2]).zeta()
            self.factors = [Factor('zeta(2u)', z2, 1, [acb(arb(1)/2)]), Factor('zeta(u)', lambda u: X(u).zeta(), -1, [acb(1)])]
            self.gld = lambda s: acb(0)
        elif name == 'DH':
            def direct(x):
                k = kappa_dh(); co = [arb(1), k, -k, arb(-1)]; l5 = arb(5).log(); tot = None
                for j in range(4):
                    t = x.zeta(acb(arb(j + 1)/5))*co[j]
                    tot = t if tot is None else tot + t
                return tot*(x*(-l5)).exp()
            def reflected(u):
                # functional equation Lambda_DH(s) = Lambda_DH(1 - s) (CLASSICAL), Lambda_DH(s) = (5/pi)^(s/2) Gamma((s+1)/2) f(s):
                # f(u) = (5/pi)^(1/2 - u) Gamma(1 - u/2) / Gamma((u+1)/2) f(1 - u)
                ctx.cap = 3
                x = acb_series([u, 1]); y = acb_series([1 - u, -1])
                return ((-(x - arb(1)/2))*(arb(5)/arb.pi()).log()).exp()*(1 - x/2).gamma()*((x + 1)/2).rgamma()*direct(y)
            def f(u):
                # direct Hurwitz evaluation for Re u >= -2 (all narrow-rectangle and P45 contours); reflected form left of that
                if fl(acb(u).real) < -2: return reflected(u)
                return direct(X(u))
            self.dh_direct = lambda u: direct(X(u)); self.dh_reflected = reflected
            self.factors = [Factor('f(u)', f, 1, [])]
            self.gld = lambda s: (arb(5)/arb.pi()).log()/2 + ((s + 1)/2).digamma()/2
        else: raise ValueError(name)
    # log-derivatives
    def LD(self, u):
        t = acb(0)
        for f in self.factors:
            v, d1, d2 = f.jet(u); t += f.sign*d1/v
        return t
    def LD1(self, u):
        t = acb(0)
        for f in self.factors:
            v, d1, d2 = f.jet(u); t += f.sign*(d2/v - (d1/v)**2)
        return t
    def Lz(self, z):
        s = z + arb(1)/2
        return self.gld(s) + self.LD(s)
    def zfactors(self):
        return [(f.name, (lambda z, f=f: f.jet(z + arb(1)/2)[:2]), f.sign) for f in self.factors]
    def absF_lower(self, z):
        """lower bound for abs D at s = 1/2 + z (non-vanishing check; D, not the completion)."""
        s = z + arb(1)/2; v = acb(1)
        for f in self.factors:
            w = f.jet(s)[0]; v = v*w if f.sign > 0 else v/w
        return abs(v)
    # coefficients
    def lam(self, N):
        """dict n -> Lambda_D(n) (acb), 1 <= n <= N, zero entries omitted."""
        nm = self.name; out = {}
        if nm == 'DH':
            k_ = kappa_dh(); co = [arb(1), k_, -k_, arb(-1)]
            a = [None] + [co[(n % 5) - 1] if n % 5 else arb(0) for n in range(1, N + 1)]
            inv = [arb(0)]*(N + 1); inv[1] = arb(1)
            for d in range(1, N + 1):
                if d > 1: inv[d] = -inv[d]
                idv = inv[d]
                if idv == 0: continue
                for m in range(2, N//d + 1):
                    if a[m] != 0: inv[d*m] += a[m]*idv       # accumulates sum_{e|n, e<n} a(n/e) inv(e); sign flipped at d = n
            lg = [None] + [arb(n).log() for n in range(1, N + 1)]
            L = [arb(0)]*(N + 1)
            for d in range(1, N + 1):
                idv = inv[d]
                if idv == 0: continue
                for m in range(2, N//d + 1):
                    if a[m] != 0: L[d*m] += a[m]*lg[m]*idv
            for n in range(2, N + 1): out[n] = acb(L[n])
            return out
        mg = mangoldt(N)
        for n in range(2, N + 1):
            if mg[n] is None: continue
            p, k = mg[n]; lp = arb(p).log()
            if nm in ('zeta', 'NR'): v = acb(lp)
            elif nm == 'EA': v = acb(lp*((self.a*arb(n).log()).exp() + (-self.a*arb(n).log()).exp()))
            elif nm == 'UT': v = lp*(-I*self.al*arb(n).log()).exp()
            elif nm == 'TW': v = acb(lp*(-1)**k)
            out[n] = v
        if nm == 'NR':
            lq = self.q.log(); out[1] = acb(-lq); k = 1; r = (self.c/2).acosh().exp()      # r + 1/r = c
            while 2**k <= N:
                g = lq*(-1)**(k - 1)*(r**k + r**(-k))*(arb(2)**k).sqrt()
                out[2**k] = out[2**k] + g; k += 1
        return out
    def lamtail(self, N, sigma):
        """upper bound for sum_{n>N} abs(Lambda_D(n)) n^-sigma (sigma real arb, sigma >= 4)."""
        m2 = M2(); N = arb(N); nm = self.name
        if nm in ('zeta', 'DH', 'UT', 'TW'): return m2*N**(-(sigma - 2))
        if nm == 'EA': return 2*m2*N**(-(sigma - self.a - 2))
        if nm == 'NR':
            rho = (self.c/2).acosh().exp()*arb(2)**(arb(1)/2 - sigma); K0 = int(math.floor(math.log2(fl(N))))
            return m2*N**(-(sigma - 2)) + 2*self.q.log()*rho**(K0 + 1)/(1 - rho)

# ---------------------------------------------------------------- HEAT (c20 lane code, loaded once per tau)
HEATMOD = {}
def load_heat(tag, cfgfile):
    old = sys.argv
    sys.argv = ['heat_c20.py', cfgfile, str(P_MAIN), '/dev/null']
    spec = importlib.util.spec_from_file_location('heat_' + tag, os.path.join(HERE, 'heat_c20.py'))
    m = importlib.util.module_from_spec(spec); sys.modules['heat_' + tag] = m; spec.loader.exec_module(m)
    sys.argv = old
    HEATMOD[tag] = m
    return m

class Heat:
    heat = True; symmetric = True
    RC = arb('0.25')                                       # Cauchy radius for the derivative error
    def __init__(self, name, tag):
        self.name = name; self.m = HEATMOD[tag]; m = self.m
        cfg = m.CFG
        self.w0 = acb(m.XC + arb(cfg['dx']), -arb(cfg['eta']))        # located zero in the w-plane (non-rigorous start)
        self.z0 = I*self.w0/2
        self.Xz = arb(cfg['eta'])/2 + arb('0.35')
        self.Hh = arb('0.45')
        # validity box in w (with margin), then error bounds on the box enlarged by RC
        self.bbox = abs(m.Y0) + arb('1.5')             # after reflection Im w <= 0 (midpoint); the contour reaches Im w = -2 Xz
        self.dbox = abs(arb(cfg['dx'])) + 2*self.Hh + arb('2.5')
        et, el, Ma = m.error_bounds(arb((self.bbox + self.RC).upper()), arb((self.dbox + self.RC).upper()))
        self.eps = arb((et + el).upper()); self.eps1 = arb((self.eps/self.RC).upper())
    def FdF(self, w):
        # F is real on the real w-axis (H_0 is, and the Gaussian is real): F(w) = conj F(conj w). Points with Im w > 0 are
        # evaluated through this reflection, which keeps them near the sample line Im w = y0 < 0 (no cancellation).
        if fl(w.imag) > 0:
            F, dF = self._FdF(w.conjugate())
            return F.conjugate(), dF.conjugate()
        return self._FdF(w)
    def _FdF(self, w):
        m = self.m
        dzx = w.real - m.XC; zy = w.imag
        if not (abs(zy - m.Y0) < self.bbox and abs(dzx) < self.dbox):
            return acb(arb('nan')), acb(arb('nan'))
        tot = acb(0); td = acb(0); b = zy - m.Y0; q = 1/(4*m.TAU)
        for j, c in m.SAMP:
            d = acb(dzx - m.H*j, b)
            v = c*(-d*d*q).exp()
            tot += v; td += v*(-d*2*q)
        nrm = m.H/(4*arb.pi()*m.TAU).sqrt()
        e0 = acb(arb(0, 1)*self.eps, arb(0, 1)*self.eps); e1 = acb(arb(0, 1)*self.eps1, arb(0, 1)*self.eps1)
        return tot*nrm + e0, td*nrm + e1
    def zjet(self, z):
        F, dF = self.FdF(-2*I*z)
        return F, -2*I*dF
    def Lz(self, z):
        F, dF = self.zjet(z)
        return dF/F
    def zfactors(self): return [('H_-tau', self.zjet, 1)]
    def absF_lower(self, z): return abs(self.zjet(z)[0])

CTRL = {}
def ctrl(name):
    if name not in CTRL:
        CTRL[name] = Heat(name, name) if name.startswith('HEAT') else Control(name)
    return CTRL[name]

# ---------------------------------------------------------------- configuration
# rect = (X, Ta, Tb): z-plane rectangle abs(Re z) <= X, Ta <= Im z <= Tb; rates z_j = x_j - i tau_j (poles of h at height +tau_j)
CFG = {
 'zeta': dict(rect=('2', '10', '45'), rates=[('0.375', '14.375'), ('0.875', '21.5')], wide=('12.5', '10', '45'), z3=('11.5', '20.25'),
              p45=dict(s=('0.5', '20'), T=('-32', '32'))),
 'DH':   dict(rect=('2', '84', '87.5'), rates=[('0.375', '85.75'), ('0.875', '86.375')], wide=('12.5', '84', '87.5'), z3=('11.5', '85.875'),
              p45=dict(s=('0.5', '85'), T=('82', '88'))),
 'EA':   dict(rect=('2', '10', '35'), rates=[('0.375', '14.375'), ('0.875', '21.5')], wide=('12.5', '10', '35'), z3=('11.5', '20.25'),
              p45=dict(s=('0.5', '20'), T=('-32', '32'))),
 'NR':   dict(rect=('2', '2', '20'), rates=[('0.375', '4.625'), ('0.875', '13.25')], wide=('12.5', '2', '20'), wideTa='8', z3=('11.5', '9.25'),
              p45=dict(s=('0.5', '10'), T=('-20', '20'))),
 'TW':   dict(rect=('2', '5', '16'), rates=[('0.375', '7.25'), ('0.875', '10.25')], z3=('11.5', '8.25'),
              p45=dict(s=('0.5', '5'), T=('-9', '9'))),
 'UT':   dict(rect=('2', '10', '45'), rates=[('0.375', '13.375'), ('0.875', '20.5')], z3=('11.5', '20.25'),
              p45=dict(s=('0.5', '19'), T=('-33', '31'))),
 'HEAT1': dict(), 'HEAT025': dict(),
}
HEATCFG = {'HEAT1': 'cfg_t1_first_A.json', 'HEAT025': 'cfg_t0p25_strip_A.json'}
B2 = [acb(1), acb(arb(-3)/4, arb(1)/2)]                 # exact
SIGL, SIGR, YF = arb(-1)/2, arb(24), arb(61)/2          # exact
ABSTOL = arb(2)**(-156); RELTOL = arb(2)**(-170); CNTTOL = arb(2)**(-40)

def heat_cfg(name):
    h = ctrl(name)
    g0 = fl(h.z0.imag); X = fl(h.Xz)
    dy = lambda v: repr(round(v*64)/64)                 # exact dyadic decimals
    return dict(rect=(dy(X - 1/128), dy(g0 - 0.45), dy(g0 + 0.45)),
                rates=[('0.375', dy(g0 + 0.1)), ('0.625', dy(g0 - 0.2))])

# ---------------------------------------------------------------- zeros
def find_zeros(jet, box, step, prec, tag=''):
    """box = (xl, xr, yl, yr) floats. Newton from a grid at 128 bits, then certification at prec. Returns list of acb enclosures
    (each: a unique simple zero inside the ball, interval Newton test)."""
    xl, xr, yl, yr = box
    ctx.prec = 128
    cands = []
    nx = max(1, int(round((xr - xl)/step[0]))); ny = max(1, int(round((yr - yl)/step[1])))
    for a in range(nx + 1):
        for b in range(ny + 1):
            z = acb(xl + (xr - xl)*a/nx, yl + (yr - yl)*b/ny); ok = False
            for it in range(40):
                try:
                    v, d = jet(z)[:2]
                    st = v/d
                except Exception: break
                if not st.is_finite(): break
                z = z - st; z = acb(z.real.mid(), z.imag.mid())
                zf = cfl(z)
                if not (xl - 1 < zf.real < xr + 1 and yl - 1 < zf.imag < yr + 1): break
                if abs(cfl(st)) < 1e-28: ok = True; break
            if ok:
                zf = cfl(z)
                if xl <= zf.real <= xr and yl <= zf.imag <= yr and all(abs(zf - cfl(c)) > 1e-12 for c in cands):
                    cands.append(z)
    ctx.prec = prec
    out = []; fails = []
    for z in cands:
        for it in range(4):
            v, d = jet(z)[:2]; z = z - v/d; z = acb(z.real.mid(), z.imag.mid())
        done = False
        for rb in (prec - 70, prec - 100, prec - 130, 100, 70):
            r = arb(2)**(-rb)
            Bx = acb(arb(z.real, r), arb(z.imag, r))
            v = jet(z)[0]; dB = jet(Bx)[1]
            Nw = z - v/dB
            if Nw.is_finite() and Bx.contains(Nw):
                out.append(Nw); done = True; break
        if not done: fails.append(cfl(z))
    out.sort(key=lambda w: (fl(w.imag), fl(w.real)))
    return out, fails

def pick_edge(target, ims):
    best = None
    for k in range(-8, 9):
        e = target + 0.0625*k
        d = min([abs(e - y) for y in ims] + [9.0]) - 1e-3*abs(k)
        if best is None or d > best[0]: best = (d, e)
    return best[1], best[0] + 0

def phase1(job):
    """zeros of each factor in the enlarged box; returns edges and packed zeros."""
    name, plane, cf = job
    t0 = time.time()
    c = ctrl(name)
    if plane == 'z':
        prec = P_MAIN; ctx.prec = prec
        Xr = float(cf['rect'][0]); Ta, Tb = float(cf['rect'][1]), float(cf['rect'][2])
        fac = c.zfactors()
        xs = (-min(Xr, 1.2), min(Xr, 1.2)) if not c.heat else (-Xr, Xr)
        step = (0.3, 0.25) if not c.heat else (0.3, 0.15)
        ext = 1.0 if not c.heat else 0.6
    else:
        prec = P_45; ctx.prec = prec
        Ta, Tb = float(cf['p45']['T'][0]), float(cf['p45']['T'][1])
        fac = [(f.name, (lambda u, f=f: f.jet(u)[:2]), f.sign) for f in c.factors]
        xs = (-0.4, 1.7); step = (0.3, 0.25); ext = 1.0
    res = []
    allim = []
    for (fname, jet, sign) in fac:
        zs, fails = find_zeros(jet, (xs[0], xs[1], Ta - ext, Tb + ext), step, prec, fname)
        res.append((fname, sign, zs, fails)); allim += [fl(w.imag) for w in zs]
    Ta2, da = pick_edge(Ta, allim); Tb2, db = pick_edge(Tb, allim)
    out = dict(name=name, plane=plane, Ta=Ta2, Tb=Tb2, edge_dist=(da, db), secs=time.time() - t0, factors=[])
    for fname, sign, zs, fails in res:
        ins = [w for w in zs if Ta2 < fl(w.imag) < Tb2]
        out['factors'].append(dict(name=fname, sign=sign, zeros=[pack(w) for w in ins], n_found_big=len(zs), fails=[str(x) for x in fails]))
    return out

# ---------------------------------------------------------------- integrands
def hfun(rates, bs):
    def h(s):
        V = acb(0); Vs = acb(0)
        for zj, bj in zip(rates, bs):
            V += bj/(s + zj); Vs += bj.conjugate()/(zj.conjugate() - s)
        return V*Vs
    return h

def sides(xl, xr, yl, yr):
    a, b, c, d = acb(xl, yl), acb(xr, yl), acb(xr, yr), acb(xl, yr)
    return [(a, b), (b, c), (c, d), (d, a)]              # bottom, right, top, left (counterclockwise)

def kern(s, lY):
    return lambda u: ((u - s)*lY).exp()/((u - s)**2*lY)

def integ(task):
    """task = (name, kind, side, params) -> packed integral over one side (not divided by 2 pi i)."""
    name, kind, side, par = task
    t0 = time.time()
    c = ctrl(name)
    prec = P_45 if kind.startswith('u') else P_MAIN
    ctx.prec = prec
    if kind.startswith('u'):
        xl, xr, yl, yr = SIGL, SIGR, arb(par['Ta']), arb(par['Tb'])
    else:
        Xr = arb(par['X']); xl, xr, yl, yr = -Xr, Xr, arb(par['Ta']), arb(par['Tb'])
    p0, p1 = sides(xl, xr, yl, yr)[side]
    tol = ABSTOL
    if kind.startswith('cnt'):                       # z-plane count of factor k
        k = int(kind[3:]); jet = c.zfactors()[k][1]
        def g(w, _):
            v, d = jet(w)[:2]; return d/v
        tol = CNTTOL
    elif kind.startswith('ucnt'):
        k = int(kind[4:]); f = c.factors[k]
        def g(w, _):
            v, d, d2 = f.jet(w); return d/v
        tol = CNTTOL
    elif kind.startswith('h'):                       # h1: order 1 at rate 0; h2: order 2; h3: order 1 at z3
        if kind == 'h1': rates, bs = [C(par['rates'][0])], [acb(1)]
        elif kind == 'h2': rates, bs = [C(r) for r in par['rates']], B2
        else: rates, bs = [C(par['z3'])], [acb(1)]
        rates = [acb(r.real, -r.imag) for r in rates]            # z_j = x_j - i tau_j
        h = hfun(rates, bs)
        def g(w, _): return h(w)*c.Lz(w)
    elif kind == 'up45':
        s = C(par['s']); lY = YF.log(); kf = kern(s, lY)
        def g(w, _): return -c.LD(w)*kf(w)
    else: raise ValueError(kind)
    npc = max(1, int(math.ceil(abs(cfl(p1) - cfl(p0))/(0.125 if c.heat else 2.0))))          # pieces of length <= 2 (HEAT: 1/8); break points p0 + (p1 - p0) i/npc as balls
    val = acb(0); worst = 0.0
    for i in range(npc):
        q0 = p0 + (p1 - p0)*i/npc if i else p0
        q1 = p0 + (p1 - p0)*(i + 1)/npc if i + 1 < npc else p1
        pv = acb.integral(g, q0, q1, rel_tol=(arb(2)**(-(P_45 - 30)) if kind.startswith('u') else RELTOL), abs_tol=tol/npc, eval_limit=3*10**5, depth_limit=10**4)
        val += pv
    if not val.is_finite(): return (name, kind, side, None, time.time() - t0, float('inf'))
    return (name, kind, side, pack(val), time.time() - t0, float(val.rad()))

# ---------------------------------------------------------------- assembly
def S40(v):
    v = acb(v)
    return '%s + %s i' % (v.real.str(45), v.imag.str(45))
def cell(v):
    v = acb(v)
    fin = v.is_finite()
    return dict(mid=[fl(v.real), fl(v.imag)] if fin else None, rad=float(max(v.real.rad(), v.imag.rad())) if fin else None,
                contains0=bool(fin and v.real.contains(0) and v.imag.contains(0)),
                rad_below_1e_40=bool(fin and max(v.real.rad(), v.imag.rad()) < arb(10)**(-40)))

def Qforms(c, rates, bs):
    """Q_sym (needs L at z_j) and Q_gen (needs L at conj z_j and -z_i)."""
    n = len(rates); Qg = acb(0); Qs = acb(0)
    Lz = None if c.heat else [c.Lz(z) for z in rates]
    Lc = [c.Lz(z.conjugate()) for z in rates]; Lm = [c.Lz(-z) for z in rates]
    for i in range(n):
        for j in range(n):
            den = rates[i] + rates[j].conjugate(); bb = bs[i]*bs[j].conjugate()
            Qg += bb*(Lc[j] - Lm[i])/den
            if Lz is not None: Qs += bb*(Lz[i] + Lz[j].conjugate())/den
    return (Qs if Lz is not None else None), Qg

def assemble_z(name, cf, p1, ints, wide=False):
    """rows P8, P1 (narrow) or EF (wide)."""
    c = ctrl(name); ctx.prec = P_MAIN
    twopi_i = 2*arb.pi()*I
    Ta_ = float(cf['wideTa']) if (wide and 'wideTa' in cf) else p1['Ta']       # the wide rectangle may start higher (T-NR)
    out = dict(rect=dict(X=cf['wide'][0] if wide else cf['rect'][0], Ta=Ta_, Tb=p1['Tb']), factors=[])
    zeros = []                                         # (enclosure, multiplicity sign)
    pre = 'cntw' if wide else 'cnt'
    ok_count = True
    for k, f in enumerate(p1['factors']):
        zs = [w for w in (unpack(t) for t in f['zeros']) if fl(w.imag) > Ta_]
        cnt = sum((unpack(ints[(name, '%s%d' % (pre, k), sd)]) for sd in range(4)), acb(0))/twopi_i
        n = cnt.real.unique_fmpz()
        good = (n is not None) and cnt.imag.contains(0) and int(n) == len(zs)
        ok_count = ok_count and good
        out['factors'].append(dict(name=f['name'], sign=f['sign'], zeros_certified=len(zs), contour_count=str(cnt.real.str(12)),
                                   contour_count_integer=(int(n) if n is not None else None), complete=bool(good), newton_fails=f['fails'],
                                   zeros=[[w.real.str(30), w.imag.str(30)] for w in zs]))
        zeros += [(w, f['sign']) for w in zs]
    out['zero_list_complete'] = bool(ok_count)
    rows = {}
    todo = [('EF', 'h3', [C(cf['z3'])], [acb(1)])] if wide else [('P8', 'h1', [C(cf['rates'][0])], [acb(1)]), ('P1', 'h2', [C(r) for r in cf['rates']], B2)]
    for row, kind, rates, bs in todo:
        rates = [acb(r.real, -r.imag) for r in rates]
        h = hfun(rates, bs)
        W = sum((sg*h(w) for w, sg in zeros), acb(0))
        Cint = sum((unpack(ints[(name, kind, sd)]) for sd in range(4)), acb(0))/twopi_i
        Qs, Qg = Qforms(c, rates, bs)
        r = dict(rates=[S40(z)[:60] for z in rates], W_R=S40(W), C_R=S40(Cint), Q_gen=S40(Qg), cell_gen=cell(Qg - W + Cint),
                 absD_at_rates_lower=[float(c.absF_lower(z.conjugate() if c.heat else z).lower()) for z in rates], absW=float(abs(W).mid()), absC=float(abs(Cint).mid()))
        if Qs is not None:
            r['Q_sym'] = S40(Qs); r['cell_sym'] = cell(Qs - W + Cint); r['sym_defect'] = cell(Qs - Qg)
        if row == 'P8':
            z = rates[0]; x = z.real
            Wp = sum((sg*(x - w.real)/(x*abs(z - w.conjugate())**2) for w, sg in zeros), arb(0))
            r['W_pair'] = S40(Wp); r['cell_pair'] = cell(W - Wp)
        if row == 'EF':
            z = rates[0]; s = z + arb(1)/2; x = z.real
            sig = s.real
            N = 64
            while not (c.lamtail(N, sig)/x < arb(10)**(-46)): N *= 2
            lam = c.lam(N)
            Sm = acb(0)
            for n_, v in lam.items(): Sm += v*(-s*arb(n_).log()).exp()
            tl = arb(c.lamtail(N, sig).upper())
            Lp = c.gld(s) - Sm + acb(arb(0, 1)*tl, arb(0, 1)*tl)
            Qp = acb(Lp.real/x)
            r.update(N=N, tail_bound=float(tl), Q_prime=S40(Qp), cell_prime=cell(Qp - W + Cint),
                     cell_pointwise=cell(c.LD(s) + Sm + acb(arb(0, 1)*tl, arb(0, 1)*tl)), abs_prime_sum=float(abs(Sm).mid()))
        rows[row] = r
    out['rows'] = rows
    return out

def pointwise_ef(name, cf):
    """for controls without the symmetric form: D'/D(s) + sum Lambda_D(n) n^-s at s = 1/2 + z3 (and at conj)."""
    c = ctrl(name); ctx.prec = P_MAIN
    z = C(cf['z3']); z = acb(z.real, -z.imag); s = z + arb(1)/2; sig = s.real
    N = 64
    while not (c.lamtail(N, sig) < arb(10)**(-46)): N *= 2
    lam = c.lam(N); Sm = acb(0)
    for n_, v in lam.items(): Sm += v*(-s*arb(n_).log()).exp()
    tl = arb(c.lamtail(N, sig).upper())
    return dict(s=S40(s)[:60], N=N, tail_bound=float(tl), abs_prime_sum=float(abs(Sm).mid()), minus_LD=S40(-c.LD(s)),
                cell_pointwise=cell(c.LD(s) + Sm + acb(arb(0, 1)*tl, arb(0, 1)*tl)))

def gam_m1(v):
    """Gamma(-1, v), principal branch, by two Arb routes; the tighter enclosure is returned (both are enclosures of the same number):
    acb.gamma_upper, and e^-v U(2, 2, v) (Kummer U; Gamma(s, v) = e^-v U(1 - s, 1 - s, v))."""
    g = v.gamma_upper(acb(-1))
    try: h = (-v).exp()*v.hypgeom_u(acb(2), acb(2))
    except Exception: h = None
    if h is None or not h.is_finite(): return g
    if not g.is_finite(): return h
    return h if max(h.real.rad(), h.imag.rad()) < max(g.real.rad(), g.imag.rad()) else g

def Un(lam_, cc, T1, T2, lY):
    """(1/(2 pi i log Y)) [int_{c+iT2}^{c+i inf} + int_{c-i inf}^{c+iT1}] e^{lam w} w^-2 dw, T1 < 0 < T2, lam != 0."""
    g1 = gam_m1(-lam_*acb(cc, T1)); g2 = gam_m1(-lam_*acb(cc, T2))
    return lam_*(g1 - g2)/(2*arb.pi()*I*lY)

def assemble_p45(name, cf, p1, ints):
    c = ctrl(name); ctx.prec = P_45
    twopi_i = 2*arb.pi()*I; lY = YF.log()
    s = C(cf['p45']['s']); T1 = arb(repr(p1['Ta'])); T2 = arb(repr(p1['Tb']))
    kf = kern(s, lY)
    out = dict(rect=dict(sigL=str(SIGL), sigR=str(SIGR), Ta=p1['Ta'], Tb=p1['Tb']), s=S40(s)[:40], Y=str(YF), factors=[])
    div = []; ok_count = True
    inside = lambda p: (SIGL < p.real and p.real < SIGR and T1 < p.imag and p.imag < T2)
    for k, f in enumerate(p1['factors']):
        zs = [unpack(t) for t in f['zeros']]
        F = c.factors[k]
        poles = [p for p in F.poles if inside(p)]
        cnt = sum((unpack(ints[(name, 'ucnt%d' % k, sd)]) for sd in range(4)), acb(0))/twopi_i
        n = cnt.real.unique_fmpz()
        good = (n is not None) and cnt.imag.contains(0) and int(n) == len(zs) - len(poles)
        ok_count = ok_count and good
        out['factors'].append(dict(name=f['name'], sign=f['sign'], zeros_certified=len(zs), poles_inside=len(poles),
                                   contour_count_integer=(int(n) if n is not None else None), complete=bool(good), newton_fails=f['fails'],
                                   zeros=[[w.real.str(30), w.imag.str(30)] for w in zs]))
        div += [(w, f['sign']) for w in zs] + [(p, -f['sign']) for p in poles]
    out['zero_list_complete'] = bool(ok_count)
    cc = SIGR - s.real; T1p = T1 - s.imag; T2p = T2 - s.imag
    assert T1p < 0 and T2p > 0
    pref = (cc*lY).exp()/(2*cc*lY)
    N = 64
    while not (pref*c.lamtail(N, SIGR) < arb(10)**(-46)): N *= 2
    lam = c.lam(N)
    SY = acb(0); TU = acb(0); Yf = fl(YF); wr = (0.0, 0)
    for n_, v in lam.items():
        ln = arb(n_).log(); ns = (-s*ln).exp()
        if n_ < Yf: SY += v*(1 - ln/lY)*ns
        tt = v*ns*Un(lY - ln, cc, T1p, T2p, lY); TU += tt
        if float(tt.rad()) > wr[0]: wr = (float(tt.rad()), n_)
    tl = arb((pref*c.lamtail(N, SIGR)).upper())
    C3 = sum((unpack(ints[(name, 'up45', sd)]) for sd in (0, 2, 3)), acb(0))/twopi_i
    Res = -c.LD(s) - c.LD1(s)/lY - sum((mu*kf(d) for d, mu in div), acb(0))
    val = SY - TU + C3 - Res + acb(arb(0, 1)*tl, arb(0, 1)*tl)
    Zs = sum((mu*kf(d) for d, mu in div), acb(0))
    out.update(N=N, tail_bound=float(tl), widest_TU_term=wr, S_Y=S40(SY), TU=S40(TU), C3=S40(C3), Res=S40(Res), divisor_sum=S40(Zs),
               minus_LD=S40(-c.LD(s)), cell=cell(val), absD_at_s_lower=float(c.absF_lower(s - arb(1)/2).lower()),
               n_divisor_points=len(div))
    # self-test of the closed form of the tails: J_n + U_n = (1 - log n/log Y)_+
    st = []
    for n_ in (1, 2, 29, 31, 500):
        lam_ = lY - arb(n_).log()
        J = acb.integral(lambda w, _: (lam_*w).exp()/(w*w), acb(cc, T1p), acb(cc, T2p), rel_tol=arb(2)**(-(P_45 - 30)), abs_tol=arb(10)**(-60))/(twopi_i*lY)
        wt = (1 - arb(n_).log()/lY) if n_ < Yf else arb(0)
        scale = (lam_*cc).exp()                      # size of the integrand
        st.append(dict(n=n_, cell=cell(J + Un(lam_, cc, T1p, T2p, lY) - wt), integrand_size=float(scale.mid())))
    out['tail_closed_form_selftest'] = st
    return out

def _hs(args):
    tag, j = args
    return HEATMOD[tag]._sample(j)

if __name__ == '__main__':
    t00 = time.time()
    OUT = sys.argv[1]
    names = sys.argv[2].split(',') if len(sys.argv) > 2 else list(CFG)
    ctx.prec = P_MAIN
    print('PLAN: controls %s; prec %d bits (rows P8, P1, EF), %d bits (row P45); workers %d; largest allocation: lists of < 1e5 balls '
          '(coefficients Lambda_D(n), n <= N) and < 4000 HEAT samples per tau: < 200 MB per process' % (names, P_MAIN, P_45, WORKERS), flush=True)
    for nm in names:
        if nm in HEATCFG: load_heat(nm, os.path.join(HERE, HEATCFG[nm]))
    for nm in names:
        if nm in HEATCFG:
            m = HEATMOD[nm]; t0 = time.time()
            with Pool(WORKERS) as pool:
                cs = [m.unpack(t) for t in pool.map(_hs, [(nm, j) for j in range(-m.NN, m.NN + 1)], chunksize=16)]
            m.SAMP = list(zip(range(-m.NN, m.NN + 1), cs))
            CFG[nm] = heat_cfg(nm)
            h = ctrl(nm)
            print('HEAT %s: %d samples in %.1fs; eps = %s, eps1 = %s; cfg %s' % (nm, len(cs), time.time() - t0, h.eps.str(5), h.eps1.str(5), CFG[nm]), flush=True)
    res = {'controls': {}, 'prec': [P_MAIN, P_45]}
    INTS = OUT + '.ints.json'
    def save_state(P1, ints):
        json.dump(dict(P1={'%s|%s' % k: v for k, v in P1.items()}, ints={'%s|%s|%d' % k: v for k, v in ints.items()},
                       CFG={n: CFG[n] for n in names}), open(INTS + '.tmp', 'w'))
        os.replace(INTS + '.tmp', INTS)
    if os.environ.get('ASSEMBLE_ONLY') or os.environ.get('WIDE_ONLY'):
        st = json.load(open(INTS))
        P1 = {tuple(k.split('|')): v for k, v in st['P1'].items()}
        ints = {(k.split('|')[0], k.split('|')[1], int(k.split('|')[2])): v for k, v in st['ints'].items()}
        import copy
        CODE = copy.deepcopy(CFG)
        for n in names:
            CFG[n] = st['CFG'][n]
            for key in ('wide', 'wideTa'):
                if key in CODE[n]: CFG[n][key] = CODE[n][key]
        for n in os.environ.get('DROP_WIDE', '').split(','):
            for k in [k for k in ints if k[0] == n and (k[1].startswith('cntw') or k[1] == 'h3')]: del ints[k]
    if os.environ.get('WIDE_ONLY'):
      with Pool(WORKERS) as pool:
        tw = []
        for nm in names:
            cf = CFG[nm]; pz = P1[(nm, 'z')]; c = ctrl(nm)
            if 'wide' not in cf: continue
            parw = dict(X=cf['wide'][0], Ta=cf.get('wideTa', repr(pz['Ta'])), Tb=repr(pz['Tb']), rates=cf['rates'], z3=cf.get('z3'))
            for sd in range(4):
                for k in range(len(c.zfactors())): tw.append((nm, 'cntw%d' % k, sd, parw))
                tw.append((nm, 'h3', sd, parw))
        tw = [t for t in tw if (t[0], t[1], t[2]) not in ints]
        print('wide only: %d side integrals' % len(tw), flush=True)
        todo = [((n, 'cnt' + k[4:] if k.startswith('cntw') else k, s, p), k) for (n, k, s, p) in tw]
        hs = {pool.apply_async(integ, (t,)): k for t, k in todo}
        pend = dict(hs); ndone = 0
        while pend:
            for hnd in list(pend):
                if hnd.ready():
                    name, kind, side, pk, secs, rad = hnd.get(); k = pend.pop(hnd)
                    ndone += 1
                    if pk is not None: ints[(name, k, side)] = pk
                    print('  int %s %s side %d: rad %.2e, %.1fs' % (name, k, side, rad, secs), flush=True)
                    save_state(P1, ints)
            time.sleep(1)
    elif not os.environ.get('ASSEMBLE_ONLY'):
      with Pool(WORKERS) as pool:
        jobs = []
        for nm in names:
            jobs.append((nm, 'z', CFG[nm]))
            if 'p45' in CFG[nm]: jobs.append((nm, 'u', CFG[nm]))
        P1 = {}
        for o in pool.imap_unordered(phase1, jobs):
            P1[(o['name'], o['plane'])] = o
            print('phase1 %s %s: edges %s %s (dist %.3f %.3f); zeros %s; fails %s; %.1fs' % (o['name'], o['plane'], o['Ta'], o['Tb'], o['edge_dist'][0], o['edge_dist'][1],
                  [len(f['zeros']) for f in o['factors']], [f['fails'] for f in o['factors']], o['secs']), flush=True)
        tasks = []; tw = []; tu = []
        for nm in names:
            cf = CFG[nm]; pz = P1[(nm, 'z')]; c = ctrl(nm)
            par = dict(X=cf['rect'][0], Ta=repr(pz['Ta']), Tb=repr(pz['Tb']), rates=cf['rates'], z3=cf.get('z3'))
            nf = len(c.zfactors())
            for sd in range(4):
                for k in range(nf): tasks.append((nm, 'cnt%d' % k, sd, par))
                tasks.append((nm, 'h1', sd, par)); tasks.append((nm, 'h2', sd, par))
            if 'wide' in cf:
                parw = dict(par); parw['X'] = cf['wide'][0]
                for sd in range(4):
                    for k in range(nf): tw.append((nm, 'cntw%d' % k, sd, parw))
                    tw.append((nm, 'h3', sd, parw))
            if 'p45' in cf:
                pu = P1[(nm, 'u')]
                paru = dict(Ta=repr(pu['Ta']), Tb=repr(pu['Tb']), s=cf['p45']['s'])
                for sd in range(4):
                    for k in range(len(c.factors)): tu.append((nm, 'ucnt%d' % k, sd, paru))
                    if sd != 1: tu.append((nm, 'up45', sd, paru))
        # 'cntw' is the z-plane count on the wide rectangle: same integrand as 'cnt'
        tasks = [((n, ('cnt' + k[4:]) if k.startswith('cntw') else k, s, p), k) for (n, k, s, p) in tasks + tu + tw]
        print('phase2: %d side integrals' % len(tasks), flush=True)
        ints = {}
        def done(r, k):
            name, kind, side, pk, secs, rad = r
            if pk is not None: ints[(name, k, side)] = pk
            print('  int %s %s side %d: rad %.2e, %.1fs' % (name, k, side, rad, secs), flush=True)
        handles = [(k, t, pool.apply_async(integ, (t,))) for t, k in tasks]
        for i, (k, t, hnd) in enumerate(handles):
            done(hnd.get(), k)
            if i % 10 == 9: save_state(P1, ints)
        save_state(P1, ints)
    for nm in names:
        cf = CFG[nm]; r = {'config': cf}
        t0 = time.time()
        def tryit(key, fn):
            try: r[key] = fn()
            except Exception as e:
                import traceback; r[key + '_error'] = traceback.format_exc(); print('ERROR %s %s: %s' % (nm, key, r[key + '_error']), flush=True)
        tryit('narrow', lambda: assemble_z(nm, cf, P1[(nm, 'z')], ints))
        if 'wide' in cf: tryit('wide', lambda: assemble_z(nm, cf, P1[(nm, 'z')], ints, wide=True))
        elif 'z3' in cf: tryit('pointwise_EF', lambda: pointwise_ef(nm, cf))
        if 'p45' in cf: tryit('p45', lambda: assemble_p45(nm, cf, P1[(nm, 'u')], ints))
        res['controls'][nm] = r
        print('assembled %s in %.1fs' % (nm, time.time() - t0), flush=True)
        json.dump(res, open(OUT, 'w'), indent=1)
        try:
            nar = r['narrow']['rows']
            print(json.dumps({'control': nm, 'complete': r['narrow']['zero_list_complete'],
                          'P8': {k: nar['P8'].get(k) for k in ('cell_gen', 'cell_sym', 'cell_pair', 'sym_defect')},
                          'P1': {k: nar['P1'].get(k) for k in ('cell_gen', 'cell_sym', 'sym_defect')},
                          'EF': ({k: r['wide']['rows']['EF'].get(k) for k in ('cell_gen', 'cell_sym', 'cell_prime', 'cell_pointwise')} if 'wide' in r else r.get('pointwise_EF', {}).get('cell_pointwise')),
                          'P45': (r['p45']['cell'] if 'p45' in r else None)}), flush=True)
        except Exception as e: print('summary failed', nm, e, flush=True)
    res['wall_s'] = time.time() - t00
    json.dump(res, open(OUT, 'w'), indent=1)
    print('DONE %.1fs' % (time.time() - t00))
