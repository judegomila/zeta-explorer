# Task (3): geometric functionals along the T-NR family X_c(z) = F0(z) * (2cosh(z log q) + c).
# F0 = xi(1/2+z) ("zeta"), F0 = completed Davenport-Heilbronn ("DH"), or F0 = 1 ("symbol").
import mpmath as mp, json, sys
mp.mp.dps = 50
q = int(sys.argv[1]) if len(sys.argv) > 1 else 3
lq = mp.log(q)
half = mp.mpf(1)/2
def xi(s): return half*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def Lxi(s): return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
A5 = [0, 1, kap, -kap, -1]
def dh(s): return 5**(-s)*sum(A5[k]*mp.zeta(s, mp.mpf(k)/5) for k in range(1,5))
def dh1(s): return -mp.log(5)*dh(s) + 5**(-s)*sum(A5[k]*mp.zeta(s, mp.mpf(k)/5, derivative=1) for k in range(1,5))
def LDH(s): return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 + dh1(s)/dh(s)
BASE = {'zeta': lambda z: Lxi(half+z), 'DH': lambda z: LDH(half+z), 'symbol': lambda z: mp.mpf(0)}
def LD(z, c): return 2*lq*mp.sinh(z*lq)/(2*mp.cosh(z*lq)+c)
def LD1(z, c): return 2*lq**2*(2 + c*mp.cosh(z*lq))/(2*mp.cosh(z*lq)+c)**2
OUT = {'q': q}
CG = [mp.mpf(k)/8 for k in range(-24, 25)] + [mp.mpf(s) for s in ('-2.01','-2.001','-1.999','-1.99','1.99','1.999','2.001','2.01')]
CG = sorted(set(CG))

# ---------- 1. sector matrices on fixed real node sets ----------
NODES = {'geo7': [mp.mpf('0.6')*mp.mpf('1.3')**k for k in range(7)],
         'lin12': [mp.mpf('0.55')+mp.mpf('0.35')*k for k in range(12)]}
base_vals = {}
for bn, Lb in BASE.items():
    for nn, xs in NODES.items():
        base_vals[(bn, nn)] = ([Lb(x) for x in xs], [mp.diff(Lb, x) if bn != 'symbol' else mp.mpf(0) for x in xs])
def sector_mineigs(bn, nn, c):
    xs = NODES[nn]; L0, L01 = base_vals[(bn, nn)]
    L = [L0[i] + LD(xs[i], c) for i in range(len(xs))]
    L1 = [L01[i] + LD1(xs[i], c) for i in range(len(xs))]
    n = len(xs)
    P = mp.matrix(n, n); B = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            P[i,j] = (L[i]+L[j])/(xs[i]+xs[j])
            B[i,j] = -L1[i] if i == j else -(L[i]-L[j])/(xs[i]-xs[j])
    res = []
    for M in (P, P+B, P-B):
        d = [mp.sqrt(abs(M[i,i])) for i in range(n)]
        N = mp.matrix(n, n)
        for i in range(n):
            for j in range(n): N[i,j] = M[i,j]/(d[i]*d[j])
        N = (N + N.T)/2
        res.append(mp.eigsy(N, eigvals_only=True)[0])
    return res
def bisect(f, a, b, it=60):
    fa, fb = f(a), f(b)
    if fa*fb > 0: return None
    for _ in range(it):
        m = (a+b)/2; fm = f(m)
        if fa*fm <= 0: b, fb = m, fm
        else: a, fa = m, fm
    return (a+b)/2
sec = {}
for bn in BASE:
    for nn in NODES:
        rows = []
        for c in CG:
            if c == -2 and bn == 'symbol': continue
            try: e = sector_mineigs(bn, nn, c)
            except ZeroDivisionError: continue
            rows.append([float(c)] + [mp.nstr(v, 8) for v in e])
        cstar = {}
        for k, name in enumerate(('P', 'Ke', 'Ko')):
            f = lambda c, k=k: sector_mineigs(bn, nn, c)[k]
            up = bisect(f, mp.mpf('1.2'), mp.mpf('2.9'))
            lo = bisect(f, mp.mpf('-1.2'), mp.mpf('-2.2'))
            cstar[name] = [mp.nstr(up, 20) if up is not None else None, mp.nstr(lo, 20) if lo is not None else None]
        sec['%s/%s' % (bn, nn)] = {'rows_c_P_Ke_Ko': rows, 'cstar_pos_neg': cstar}
        print('SECTOR', bn, nn, cstar, flush=True)
OUT['sector'] = sec

# ---------- 4. Laguerre: Lam(t) = Re L'(it) = (f'^2 - f f'')/f^2, f(t) = X(1/2+it) ----------
t0 = mp.pi/lq
lag = {}
for bn in ('zeta', 'DH'):
    Lb = BASE[bn]
    Lp_t0 = mp.re(mp.diff(Lb, 1j*t0)); Lp_0 = mp.re(mp.diff(Lb, mp.mpc(0, mp.mpf('1e-12'))))
    rows = []
    for c in CG:
        # unnormalised Laguerre expression divided by F0(it0)^2: (c-2)^2 Lp + 2 lq^2 (2-c)   at t0
        a = (c-2)**2*Lp_t0 + 2*lq**2*(2-c)
        b = (c+2)**2*Lp_0 + 2*lq**2*(2+c)      # at t = 0
        rows.append([float(c), mp.nstr(a, 12), mp.nstr(b, 12)])
    lag[bn] = {'t0': mp.nstr(t0, 15), "L0'(i t0)": mp.nstr(Lp_t0, 15), "L0'(0)": mp.nstr(Lp_0, 15),
               'second_root_pos': mp.nstr(2 + 2*lq**2/Lp_t0, 12), 'second_root_neg': mp.nstr(-2 - 2*lq**2/Lp_0, 12),
               'rows_c_Lag(t0)_Lag(0)': rows}
    print('LAG', bn, lag[bn]['t0'], lag[bn]["L0'(i t0)"], lag[bn]["L0'(0)"], lag[bn]['second_root_pos'], lag[bn]['second_root_neg'], flush=True)
# grid minimum of the normalised expression for zeta base, t in (0, 30]
mp.mp.dps = 20
ts = [mp.mpf(k)/20 for k in range(1, 601)]
Lz1 = [mp.re(mp.diff(BASE['zeta'], 1j*t)) for t in ts]
rows = []
for c in CG:
    vals = [Lz1[i] + mp.re(LD1(1j*ts[i], c)) for i in range(len(ts))]
    m = min(vals); rows.append([float(c), mp.nstr(m, 8), float(ts[vals.index(m)])])
lag['zeta_grid_min_normalised'] = rows
mp.mp.dps = 50
OUT['laguerre'] = lag

# ---------- 5. passive section: min over phase of Re L_D on Re z = x ----------
sect = {}
for x in ('0.02', '0.05', '0.1', '0.25', '0.5'):
    xm = mp.mpf(x)
    def mn(c, xm=xm):
        return min(mp.re(LD(mp.mpc(xm, 2*mp.pi*k/(720*lq)), c)) for k in range(720))
    up = bisect(mn, mp.mpf('1.0'), mp.mpf('2.95'), it=45); lo = bisect(mn, mp.mpf('-1.0'), mp.mpf('-2.95'), it=45)
    sect[x] = {'cstar_pos': mp.nstr(up, 15) if up else None, 'cstar_neg': mp.nstr(lo, 15) if lo else None,
               '2cosh(x log q)': mp.nstr(2*mp.cosh(xm*lq), 15),
               'rows_c_min': [[float(c), mp.nstr(mn(c), 8)] for c in CG if abs(c) != 2]}
    print('SECTION x=%s' % x, sect[x]['cstar_pos'], sect[x]['cstar_neg'], sect[x]['2cosh(x log q)'], flush=True)
OUT['section'] = sect

# ---------- 6/7. coefficient-level quantities ----------
co = []
sq = mp.sqrt(q)
for c in CG:
    m1 = 1 + c*sq
    co.append([float(c), mp.nstr(4 - c**2, 10), mp.nstr(1 - m1**2, 10),
               (mp.nstr(q/(1 + c*sq), 10) if 1 + c*sq != 0 else None)])
OUT['coeff_rows_c_disc_T_q1_Uq_defect'] = co

# ---------- 3. anticausal block: poles of S = (1 - a L)/(1 + a L) in Re z > 0 ----------
mp.mp.dps = 30
gm = {}
for alpha in (mp.mpf(1), mp.mpf('0.3')):   # poles with Re z ~ delta0^2/(2 alpha) below 1e-3 are not always found by the secant solver
    rows = []
    for c in [mp.mpf(s) for s in ('2.001','2.01','2.1','2.2','2.5','3','-2.001','-2.01','-2.1','-2.2','-2.5','-3')]:
        d0 = mp.acosh(abs(c)/2)/lq
        def f(z):
            if abs(z.imag) > 60 or abs(z.real) > 5: raise ValueError('left the search region')
            return Lxi(half+z) + LD(z, c) + 1/alpha
        f1 = lambda z: mp.diff(lambda w: Lxi(half+w), z) + LD1(z, c)
        zs = []; rs = []
        for k in range(3):
            tk = (mp.pi*(2*k+1) if c > 0 else 2*mp.pi*k)/lq
            # near a simple zero z0 of X: L ~ 1/(z - z0) + b, pole of S at z ~ z0 - alpha/(1 + alpha b)
            try:
                z = mp.findroot(f, mp.mpc(mp.sqrt(alpha**2+d0**2)-alpha, tk), maxsteps=40)
                if abs(z.imag - tk) > 1: continue
            except Exception as e:
                continue
            if z.real <= 0: continue
            if any(abs(z-w) < 1e-10 for w in zs): continue
            zs.append(z); rs.append(2/(alpha*f1(z)))
        # include conjugates for the Hilbert-Schmidt sum
        Z = []; R = []
        for z, r in zip(zs, rs):
            Z.append(z); R.append(r)
            if abs(z.imag) > 1e-12: Z.append(mp.conj(z)); R.append(mp.conj(r))
        hs = sum(mp.conj(R[j])*R[k]/(mp.conj(Z[j])+Z[k])**2 for j in range(len(Z)) for k in range(len(Z)))
        rows.append({'c': float(c), 'delta0': mp.nstr(d0, 10),
                     'poles': [[mp.nstr(z, 10), mp.nstr(r, 8), mp.nstr(abs(r)/(2*z.real), 8)] for z, r in zip(zs, rs)],
                     'isolated_model_alpha/sqrt(alpha^2+delta0^2)': mp.nstr(alpha/mp.sqrt(alpha**2+d0**2), 8),
                     'HS2_first_poles_with_conj': mp.nstr(mp.re(hs), 10)})
        print('GAMMA alpha=%s' % alpha, rows[-1], flush=True)
    gm[str(alpha)] = rows
OUT['gamma_minus'] = gm
json.dump(OUT, open(sys.argv[2], 'w'), indent=1)
