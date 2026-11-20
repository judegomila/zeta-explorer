"""c1-leeyang-krein-limit: decisive first test. float64 (numpy) + mpmath for zeta, E_1. MEASURED only.
Largest planned allocation: chunk of 2.5e7 complex128 terms = 0.4 GB, at most 4 temporaries = 1.6 GB; cap 8 GB via memcap.
"""
import numpy as np, mpmath as mp, json, sys, time
mp.mp.dps = 20
ALPHA = 1.0
S0 = 0.75 + 20j
def primes_upto(n):
    s = np.ones(n + 1, bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
def chi_primes(kind, ps):
    if kind == 'zeta': return np.ones(len(ps), complex)
    if kind == 'U_s0':  # ap-global-bridge Thm C: zero at S0
        k = np.arange(1, len(ps) + 1); eps = (-1.0)**k
        phi = np.arccos(-ps**(S0.real - 1.0))
        return ps**(1j*S0.imag) * np.exp(1j*eps*phi)
    seed = int(kind[-1]); rng = np.random.default_rng(1000 + seed)
    full = np.exp(2j*np.pi*rng.random(100000))   # nested in P
    return full[:len(ps)]
def divisors(ps, chis):
    l = np.zeros(1); a = np.ones(1, complex)
    for p, c in zip(ps, chis):
        l = np.concatenate([l, l + np.log(p)]); a = np.concatenate([a, a*c])
    return l, a
def evalD(l, a, L, s, nder=1, chunk=None):
    """Curie-Weiss stage D(s)=sum a(n) exp(l^2/2L - s l) and derivatives."""
    s = np.atleast_1d(s).astype(complex); out = [np.zeros(len(s), complex) for _ in range(nder + 1)]
    chunk = chunk or max(1, int(2.5e7 // len(l)))
    base = l*l/(2*L)
    for i in range(0, len(s), chunk):
        T = a[None, :]*np.exp(base[None, :] - s[i:i+chunk, None]*l[None, :])
        out[0][i:i+chunk] = T.sum(1)
        if nder >= 1: out[1][i:i+chunk] = -(T*l[None, :]).sum(1)
        if nder >= 2: out[2][i:i+chunk] = (T*(l*l)[None, :]).sum(1)
    return out
def euler(ps, chis, s):
    s = np.atleast_1d(s).astype(complex); r = np.zeros(len(s), complex)
    for i in range(0, len(ps), 4096):
        r += np.log1p(chis[None, i:i+4096]*np.exp(-s[:, None]*np.log(ps[i:i+4096])[None, :])).sum(1)
    return np.exp(r)
def e1(w): return np.array([complex(mp.e1(complex(x))) for x in np.atleast_1d(w)])
def digamma(x): return np.log(x) - 1/(2*x) - 1/(12*x**2) + 1/(120*x**4) - 1/(252*x**6)
def trigamma(x): return 1/x + 1/(2*x**2) + 1/(6*x**3) - 1/(30*x**5) + 1/(42*x**7)
def arch(s):   # d/ds log[s(s-1)pi^{-s/2}Gamma(s/2)] and its derivative
    return (1/s + 1/(s-1) - 0.5*np.log(np.pi) + 0.5*digamma(s/2),
            -1/s**2 - 1/(s-1)**2 + 0.25*trigamma(s/2))
KINDS = ['zeta', 'U_s0', 'rand1', 'rand2', 'rand3']
res = {}; t0 = time.time()
def log(*a):
    print(*a); sys.stdout.flush()

# ---------------- Test 1: stage inner function S_M and its limit -1 ----------------
log("== TEST 1: self-dual stage G=M^{z/2}D_M(1/2+z): min Re L_M on grid (inner iff >0), sup|S_M+1| per abscissa x")
xs = [0.02, 0.1, 0.3, 1.0]; ys = np.linspace(0, 40, 201)
res['test1'] = []
for P in [13, 19, 29, 37, 47, 61]:
    ps = primes_upto(P).astype(float); L = np.log(ps).sum()
    for kind in KINDS:
        l, a = divisors(ps, chi_primes(kind, ps))
        row = dict(P=P, L=L, kind=kind, pred=2/(1 + ALPHA*L/2))
        for x in xs:
            D, D1 = evalD(l, a, L, 0.5 + x + 1j*ys)
            LM = L/2 + D1/D; S = (1 - ALPHA*LM)/(1 + ALPHA*LM)
            row[f'minReL_{x}'] = float(LM.real.min()); row[f'sup_{x}'] = float(abs(S + 1).max()); row[f'maxabsS_{x}'] = float(abs(S).max())
        res['test1'].append(row)
        log(f"P={P:3d} L={L:6.2f} {kind:6s} minReL(x=.02,.1,.3,1)=" + " ".join(f"{row[f'minReL_{x}']:9.3f}" for x in xs)
            + " | sup|S+1|=" + " ".join(f"{row[f'sup_{x}']:.4f}" for x in xs) + f" | 2/(1+aL/2)={row['pred']:.4f} | max|S|={max(row[f'maxabsS_{x}'] for x in xs):.6f}")

# ---------------- Test 2: convergence of pole-renormalised stages ----------------
log("== TEST 2 (zeta phases): rel. error of stage against zeta(s)/zeta(2s), t in [3,40]; raw and pole-renormalised R=stage*exp(E1((s-1)logP))")
sigs = [1.5, 1.1, 0.9, 0.75, 0.6]; ts = np.linspace(3, 40, 75)
targ = {sg: np.array([complex(mp.zeta(complex(sg, t))/mp.zeta(2*complex(sg, t))) for t in ts]) for sg in sigs}
allp = primes_upto(10**6).astype(float)
res['test2'] = []
for P in [13, 19, 29, 37, 47, 61, 10**3, 10**4, 10**5, 10**6]:
    ps = allp[allp <= P]; L = np.log(ps).sum()
    for sg in sigs:
        s = sg + 1j*ts; pf = np.exp(e1((s - 1)*np.log(P)))
        E = euler(ps, np.ones(len(ps), complex), s)
        row = dict(P=P, sigma=sg, euler_raw=float(abs(E/targ[sg] - 1).max()), euler_ren=float(abs(E*pf/targ[sg] - 1).max()),
                   euler_ren_sup=float(abs(E*pf).max()), euler_raw_sup=float(abs(E).max()), scale=float(P**(0.5 - sg)))
        if P <= 61:
            l, a = divisors(ps, np.ones(len(ps), complex)); D = evalD(l, a, L, s, nder=0)[0]
            row.update(cw_raw=float(abs(D/targ[sg] - 1).max()), cw_ren=float(abs(D*pf/targ[sg] - 1).max()))
        res['test2'].append(row)
        log(f"P={P:8d} sigma={sg:4.2f} Euler raw {row['euler_raw']:9.3e} ren {row['euler_ren']:9.3e} (P^(1/2-sigma)={row['scale']:.3e}; sup|raw|={row['euler_raw_sup']:.3e} sup|ren|={row['euler_ren_sup']:.3f})"
            + (f" | CW raw {row['cw_raw']:9.3e} ren {row['cw_ren']:9.3e}" if P <= 61 else ""))

log("== TEST 2b (controls): Euler stages near s0=0.75+20i. raw |E_P(s)|; zero-renormalised Z=E_P*exp(-E1((s-s0)logP)); pole-renormalised Rp=E_P*exp(E1((s-1)logP))")
pts = {'s0-0.15': S0 - 0.15, 's0-0.05': S0 - 0.05, 's0+0.05': S0 + 0.05, 's0+0.15': S0 + 0.15, 's0+0.3i': S0 + 0.3j, 's0': S0}
res['test2b'] = []
for kind in ['zeta', 'U_s0', 'rand1', 'rand2', 'rand3']:
    chis_all = chi_primes(kind, allp)
    for name, s in pts.items():
        row = dict(kind=kind, pt=name, vals=[])
        for P in [47, 10**3, 10**4, 10**5, 10**6]:
            m = allp <= P; E = euler(allp[m], chis_all[m], np.array([s]))[0]
            zr = E*np.exp(-e1((s - S0)*np.log(P)))[0] if name != 's0' else 0j
            pr = E*np.exp(e1((s - 1)*np.log(P)))[0]
            row['vals'].append(dict(P=P, raw=[E.real, E.imag], zero_ren=[zr.real, zr.imag], pole_ren=[pr.real, pr.imag]))
        res['test2b'].append(row)
        log(f"{kind:6s} {name:8s} |raw|: " + " ".join(f"{abs(complex(*v['raw'])):9.3e}" for v in row['vals'])
            + " | zero-ren: " + " ".join(f"{complex(*v['zero_ren']):.4f}" for v in row['vals'][-3:])
            + " | pole-ren: " + " ".join(f"{complex(*v['pole_ren']):.4f}" for v in row['vals'][-3:]))

# ---------------- Test 3: gamma-normalised renormalised stage: anticausal Hankel block on a window ----------------
log("== TEST 3: S~=(1-aL~)/(1+aL~), L~ = arch + D'/D + renormaliser'; poles in Re z>0, 10<Im z<30; Hankel singular values (closed form R*AR conj A)")
Y0, Y1 = 10.0, 30.0; tg = np.arange(Y0, Y1, 0.002)
def ren_log_der(kind, P, s):  # derivative of log renormaliser and its derivative
    lp = np.log(P)
    if kind == 'zeta':   # d/ds E1((s-1)lp) = -P^{1-s}/(s-1)
        u = np.exp((1 - s)*lp); return -u/(s - 1), u*lp/(s - 1) + u/(s - 1)**2
    if kind == 'U_s0':   # d/ds [-E1((s-s0)lp)] = +P^{s0-s}/(s-s0)
        u = np.exp((S0 - s)*lp); return u/(s - S0), -u*lp/(s - S0) - u/(s - S0)**2
    return 0*s, 0*s
res['test3'] = []
for P in [13, 19, 29, 37, 47]:
    ps = primes_upto(P).astype(float); L = np.log(ps).sum()
    for kind in ['zeta', 'U_s0', 'rand1']:
        l, a = divisors(ps, chi_primes(kind, ps))
        def Lt(z, der=False):
            s = 0.5 + z; D, D1, D2 = evalD(l, a, L, s, nder=2)
            A, A1 = arch(s); r, r1 = ren_log_der(kind, P, s)
            v = A + D1/D + r
            return (v, A1 + D2/D - (D1/D)**2 + r1) if der else v
        # stage zeros on the line: D(1/2+it) M^{it/2} e^{-i theta/2} is real up to a constant phase
        D, D1 = evalD(l, a, L, 0.5 + 1j*tg)
        g = D*np.exp(1j*tg*L/2); ph = np.exp(-1j*np.angle(g[np.argmax(abs(g))])); h = (g*ph).real
        if abs((g*ph).imag).max() > 1e-6*abs(g).max():   # twisted: fix phase by conj-self-duality; fall back to modulus minima
            ang = np.unwrap(np.angle(g)); ph2 = np.exp(-1j*np.median(np.mod(ang, np.pi))); h = (g*ph2).real
        idx = np.nonzero(h[:-1]*h[1:] < 0)[0]
        gam = tg[idx] - h[idx]*(tg[idx+1] - tg[idx])/(h[idx+1] - h[idx])
        # weak-* check on the axis: window means of S~+1 (regularised just right of the axis)
        zax = 1e-6 + 1j*tg; A, _ = arch(0.5 + zax); r, _ = ren_log_der(kind, P, 0.5 + zax)
        La = A + D1/D + r; Sa = (1 - ALPHA*La)/(1 + ALPHA*La)
        mean_axis = abs(np.mean(Sa + 1)); sub = [abs(np.mean((Sa + 1)[i:i+1000])) for i in range(0, len(tg) - 999, 1000)]
        # poles of S~
        z = 1j*gam + 1.0/L
        c = Lt(z) - 1/(z - 1j*gam); z = 1j*gam - ALPHA/(1 + ALPHA*c)
        z = np.where(z.real > 0, z, 1j*gam + 0.3/L)
        for it in range(60):
            v, d = Lt(z, der=True); step = (1 + ALPHA*v)/(ALPHA*d)
            step = np.where(abs(step) > 0.5/L, step*0.5/L/abs(step), step); z = z - step
        v, d = Lt(z, der=True); ok = (abs(1 + ALPHA*v) < 1e-8) & (z.real > 1e-9) & (z.imag > Y0) & (z.imag < Y1)
        zp = z[ok]; dp = d[ok]
        _, ui = np.unique(np.round(zp, 7), return_index=True); zp = zp[ui]; dp = dp[ui]
        r = 2/(ALPHA*dp)
        if len(zp):
            Am = 1/(np.conj(zp)[:, None] + zp[None, :]); R = np.diag(r)
            ev = np.linalg.eigvals(R.conj().T @ Am @ R @ Am.conj()); sv = np.sort(np.sqrt(abs(ev)))[::-1]
            iso = abs(r)/(2*zp.real)
        else: sv = np.zeros(1); iso = np.zeros(1)
        # interior comparison with the target bridge function at x = 0.3, 0.6 (zeta phases only)
        intr = {}
        if kind == 'zeta':
            for x in [0.3, 0.6]:
                yy = np.linspace(Y0, Y1, 81); zz = x + 1j*yy; ss = 0.5 + zz
                Lg = arch(ss)[0] + np.array([complex(mp.zeta(complex(q), derivative=1)/mp.zeta(complex(q)) - 2*mp.zeta(2*complex(q), derivative=1)/mp.zeta(2*complex(q))) for q in ss])
                St = (1 - ALPHA*Lg)/(1 + ALPHA*Lg); Lm = Lt(zz); Sm = (1 - ALPHA*Lm)/(1 + ALPHA*Lm)
                intr[str(x)] = float(abs(Sm - St).max())
        row = dict(P=P, L=L, kind=kind, n_stage_zeros=len(gam), expected_zeros=L*(Y1 - Y0)/(2*np.pi), n_poles=len(zp),
                   median_Re_pole_times_L=float(np.median(zp.real)*L) if len(zp) else None, max_Re_pole=float(zp.real.max()) if len(zp) else None,
                   sv_top=[float(x) for x in sv[:5]], sv_count=int((sv > 1e-3).sum()), hs=float(np.sqrt((sv**2).sum())),
                   iso_median=float(np.median(iso)), iso_max=float(iso.max()), mean_axis=float(mean_axis), submean_max=float(max(sub)),
                   sup_axis=float(abs(Sa).max()), interior_sup_diff=intr)
        res['test3'].append(row)
        log(f"P={P:3d} L={L:6.2f} {kind:6s} stage zeros {len(gam):4d} (L*dT/2pi={row['expected_zeros']:.1f}) poles in RHP {len(zp):4d} | median Re(pole)*L={row['median_Re_pole_times_L']} max Re={row['max_Re_pole']}"
            f" | top sv {sv[0]:.4f} #sv>1e-3 {row['sv_count']} HS {row['hs']:.4f} iso median {row['iso_median']:.4f} max {row['iso_max']:.4f}"
            f" | axis: |mean(S~+1)|={mean_axis:.4f} max sub-window mean {max(sub):.4f} sup|S~|={row['sup_axis']:.3f} | interior sup|S~-S_target| {intr}")
json.dump(res, open(__file__.replace('.py', '.json'), 'w'), indent=1)
log("done in %.1fs" % (time.time() - t0))
