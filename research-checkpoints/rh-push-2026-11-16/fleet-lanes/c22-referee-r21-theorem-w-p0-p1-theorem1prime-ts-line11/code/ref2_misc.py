# Referee rechecks, items 2, 3, 5, 6. New code, Arb (python-flint).
import json, math, sys
import flint
from flint import arb, acb, fmpz
import mpmath as mp
flint.ctx.prec = 300
mp.mp.dps = 1200
out = {}
def nearest_prime(x):
    c = int(mp.nint(x)); d = 0
    while True:
        for s in ((c-d, c+d) if d else (c,)):
            if s > 1 and fmpz(s).is_probable_prime(): return s
        d += 1
def logs(f, kexact, K):
    L = []
    for k in range(1, K+1):
        fk = f(k)
        if k <= kexact:
            L.append(arb(fmpz(nearest_prime(mp.exp(fk)))).log())
        else:
            a = arb(mp.nstr(fk, 80)); L.append(a + arb(0, 2.0**-200))   # log q = f(k) to far below this radius
    return L
# ---------- item 2: P0 (S1, t = 0) and P1 / Lemma P (S0 pole points)
S1 = logs(lambda k: mp.exp(mp.mpf(k)/2), 13, 75)
rows = []
for j in (4, 10, 16, 22, 28, 34, 40):
    d = arb(2)**(-j)
    y = arb(0)
    for lk in S1:
        y += -(1 - (-d*lk).exp()).log() + (1 - (-(arb(1)/2 + d)*lk).exp()).log()
    # P0 upper bound on R_S: R <= C * prod_{i<=M} (delta log q_i) with M = 5
    C = arb(0)
    for lk in S1: C += -(1 - (-lk/2).exp()).log()
    M5 = arb(0)
    for lk in S1[:5]: M5 += (d*lk).log()
    rows.append(dict(j=j, y=float(y.mid()), rad=float(y.rad()), P0_bound_logR_M5=float((C + M5).mid()), logR=float((-y).mid()),
                     P0_ok=bool((-y) < (C + M5))))
out['P0_S1_t0'] = rows
S0 = logs(lambda k: mp.exp(mp.mpf(k)), 7, 40)
out['S0_first_primes'] = [str(nearest_prime(mp.exp(mp.exp(mp.mpf(k))))) for k in range(1, 5)]
rows = []
twopi = 2*arb.pi()
cS = arb(0)
for lk in S0: cS += (1 - (-lk/2).exp()).log()
for (jp, n) in [(1, 1), (2, 1), (2, 5), (3, 2), (5, 3)]:
    t0 = twopi*n/S0[jp-1]
    worst = None; ys = []; rows_ok = True
    for j in range(4, 41, 4):
        d = arb(2)**(-j)
        y = arb(0); Lj = arb(0)
        for i, lk in enumerate(S0):
            num = (1 - (acb(-(arb(1)/2 + d)*lk, -t0*lk)).exp())
            if i == jp-1:
                y += abs(num).log() - (1 - (-d*lk).exp()).log()
            else:
                den = (1 - (acb(-d*lk, -t0*lk)).exp())
                y += abs(num).log() - abs(den).log()
                Lj += (1 + (-d*lk).exp()).log()
        lower = cS - Lj - (1 - (-d*S0[jp-1]).exp()).log()
        gap = y - lower
        ys.append(float(y.mid()))
        ok = bool(gap > 0)
        slope_floor = float((y - (1 - math.log(2))*(arb(2)**j).log()).mid())
        worst = slope_floor if worst is None else min(worst, slope_floor)
        if not ok: print('LEMMA P VIOLATION', jp, n, j)
        rows_ok = rows_ok and ok
    rows.append(dict(prime_index=jp, n=n, y_j4_to_40=ys, min_y_minus_0p307_log=worst, lemmaP_holds_all_j=rows_ok,
                     ols_slope=float(((ys[-1]-ys[0])/(36*math.log(2))))))
out['P1_S0_pole_points'] = rows
print(json.dumps(out, indent=1), flush=True)
# ---------- item 3: NWM, kappa = 4: certified zero of 1 + R off the line; zeta != 0 there
flint.ctx.prec = 160
kap = arb(4)
def lg(t, an):
    try: return t.log(analytic=an)
    except TypeError: return t.log()
def gint(z, j, T=200):
    eps = arb(2)**(-300)
    f = lambda t, an: (t**j)*(z*t - t*lg(t, an)).exp()
    v = acb.integral(f, eps, T)
    x = z.real
    c = arb(T).log() - x
    assert bool(c > 1)
    tail = (-c*T).exp()*(arb(T)**2/c + 2*T/c**2 + 2/c**3)
    err = tail + 4*eps
    return v + acb(arb(0, float(err.upper())), arb(0, float(err.upper())))
def Rfun(s):
    z = acb(0, -1)*kap*(s - arb(1)/2)
    return gint(z, 0) + gint(-z, 0)
def Rp(s):
    z = acb(0, -1)*kap*(s - arb(1)/2)
    return acb(0, -1)*kap*(gint(z, 1) - gint(-z, 1))
s0 = acb(arb('0.9476686720276245'), arb('-0.7846755606466836'))
f0 = 1 + Rfun(s0); f1 = Rp(s0)
rho = arb('1e-9')
z0 = acb(0, -1)*kap*(s0 - arb(1)/2)
x0 = abs(z0.real) + kap*rho
M2 = kap**2*(gint(acb(x0), 2).real + gint(acb(x0), 2).real)       # bound for |f''| on the disc (monotone in |Re z|)
lhs = abs(f0) + rho**2*M2/2; rhs = abs(f1)*rho
zb = acb(s0.real + arb(0, 1e-9), s0.imag + arb(0, 1e-9)).zeta()
s2 = acb(2, arb('0.7'))
lap = 2*acb.integral(lambda r, an: (r*lg(r, an)).sin()*((arb.pi()/2 - kap*(s2 - arb(1)/2))*r).exp(), arb(2)**(-300), 200)
out['NWM'] = dict(s0=str(s0), f0_abs_upper=float(abs(f0).upper()), fprime=str(f1), fpp_bound=float(M2.upper()),
                  rouche_lhs=float(lhs.upper()), rouche_rhs=float(rhs.lower()), zero_certified_in_disc_radius_1e_9=bool(lhs < rhs),
                  zeta_on_disc=str(zb), zeta_nonzero_on_disc=(not zb.contains(0)),
                  one_plus_R_at_3=str(1 + Rfun(acb(3))), one_plus_R_at_6=str(1 + Rfun(acb(6))),
                  bound_at_3=float((2/(kap*arb('2.5') - arb.pi()/2)).mid()),
                  R_entire_form_2p0p7i=str(Rfun(s2)), R_laplace_form_2p0p7i=str(lap),
                  R_on_line_t=[(t, float(abs(Rfun(acb(arb(1)/2, arb(t)))).mid())) for t in (0.25, 0.5, 0.75, 1.0)])
print(json.dumps(out['NWM'], indent=1), flush=True)
# ---------- item 5: symmetric vs general form
flint.ctx.prec = 256
def L0(z):
    s = arb(1)/2 + z
    zs = flint.acb_series([s, 1], prec=2).zeta()
    return 1/s + 1/(s-1) - arb.pi().log()/2 + (s/2).digamma()/2 + zs[1]/zs[0]
def Qs(L, zs_, bs):
    qs = acb(0); qg = acb(0)
    for zi, bi in zip(zs_, bs):
        for zj, bj in zip(zs_, bs):
            den = zi + zj.conjugate()
            qs += bi*bj.conjugate()*(L(zi) + L(zj).conjugate())/den
            qg += bi*bj.conjugate()*(L(zj.conjugate()) - L(-zi))/den
    return qs, qg
z1 = acb(arb('0.375'), arb('-14.375')); z2 = acb(arb('0.625'), arb('-21.5'))
bs = [acb(1), acb(arb('-0.75'), arb('0.5'))]
qs, qg = Qs(L0, [z1], [acb(1)])
r = dict(zeta_P8_Qgen=str(qg), zeta_P8_sym_minus_gen=str(qs-qg))
zt = acb(arb('0.375'), arb('-13.375'))
Ltw = lambda z: L0(z + acb(0, 1))
qs, qg = Qs(Ltw, [zt], [acb(1)])
r['unimodular_alpha1_P8_Qgen'] = str(qg); r['unimodular_alpha1_P8_sym_minus_gen'] = str(qs-qg)
kq = arb('0.7')
Lg = lambda z: L0(z) + acb(0, 1)*kq/2          # F = exp(i kq z/2) xi(1/2+z): not even, not real
qs, qg = Qs(Lg, [z1, z2], bs)
r['gauge_order2_sym_minus_gen'] = str(qs-qg); r['gauge_L(z)+L(-z)'] = str(Lg(z1)+Lg(-z1)); r['gauge_L(conj z)-conj L(z)'] = str(Lg(z1.conjugate()) - Lg(z1).conjugate())
qs, qg = Qs(Ltw, [zt, z2], bs); r['unimodular_order2_sym_minus_gen'] = str(qs-qg)
out['line11'] = r
print(json.dumps(r, indent=1), flush=True)
# ---------- item 6: step (a) = H(a): a_n = kappa(n) - Re l_f(n) >= 0
N = 3000
def kappa(n):
    for p in range(2, n+1):
        if n % p == 0:
            k = 0; m = n
            while m % p == 0: m //= p; k += 1
            return arb(1)/k if m == 1 else arb(0)
def ha(f):                                # f: list index 1..N of acb
    lg = [None, None] + [arb(n).log() for n in range(2, N+1)]
    Lam = [acb(0)]*(N+1)
    divs = [[] for _ in range(N+1)]
    for d in range(2, N+1):
        for m in range(2*d, N+1, d): divs[m].append(d)
    amin = None; first = None; nneg = 0; mx = 0.0
    for n in range(2, N+1):
        v = f[n]*lg[n]
        for d in divs[n]: v -= Lam[d]*f[n//d]
        Lam[n] = v
        a = kappa(n) - (v/lg[n]).real
        am = float(a.mid()); mx = max(mx, abs(am))
        if bool(a < 0):
            nneg += 1
            if first is None: first = (n, am)
        if amin is None or am < amin[1]: amin = (n, am)
    return dict(first_negative=first, n_negative=nneg, min=amin, max_abs_a=mx)
def with_local(q, g):                     # F = zeta * sum_k g_k q^(-ks); q need not be prime
    f = [acb(0)]*(N+1)
    for n in range(1, N+1):
        s = acb(0); k = 0; m = n
        while True:
            s += g(k)
            if m % q: break
            m //= q; k += 1
        f[n] = s
    return f
def series_quot(num, den, K):
    c = []
    for k in range(K+1):
        v = (num[k] if k < len(num) else arb(0))
        for i in range(1, min(k, len(den)-1)+1): v -= den[i]*c[k-i]
        c.append(v/den[0])
    return c
res = {}
fV6 = with_local(6, lambda k: acb(1 if k == 0 else 2*(-1)**k))
res['V6'] = ha(fV6); res['V6_f_is_pm1'] = all(bool(abs(fV6[n] - (-1)**sum(1 for k in range(1, 6) if n % 6**k == 0)) < 1e-30) for n in range(1, N+1))
res['V6_partial_sum_minus_5x7'] = [(x, float(sum(fV6[n].real for n in range(1, x+1)).mid()) - 5*x/7) for x in (100, 1000, 3000)]
res['V6_a_6_216'] = None
q = 2
res['HQ1_q2_eps1'] = ha(with_local(2, lambda k: acb(1) if k == 0 else acb(1*k*arb(2).sqrt()**k)))
res['HQ1_q2_eps5'] = ha(with_local(2, lambda k: acb(1) if k == 0 else acb(5*k*arb(2).sqrt()**k)))
res['HQ2_q7_eps0.2'] = ha(with_local(7, lambda k: acb(1) if k == 0 else acb(arb('0.2')*math.comb(k+1, 3)*arb(7).sqrt()**k)))
def hq34(sign, q, a, b):
    al = arb(q)**arb(a) + arb(q)**(-arb(a)); be = arb(q)**arb(b) + arb(q)**(-arb(b))
    c = series_quot([arb(1), sign*al, arb(1)], [arb(1), -be, arb(1)], 14)
    return with_local(q, lambda k: acb(c[k]*arb(q).sqrt()**k))
res['HQ3_5_0.07_0.31'] = ha(hq34(-1, 5, '0.07', '0.31'))
res['HQ4_5_0.07_0.31'] = ha(hq34(+1, 5, '0.07', '0.31'))
aE = arb('0.2')
fE = [acb(0)]*(N+1)
pw = [None] + [arb(n)**aE for n in range(1, N+1)]
for d in range(1, N+1):
    for m in range(d, N+1, d):
        fE[m] += pw[d]/pw[m//d]
res['E_a_0.2'] = ha(fE)
res['zeta'] = ha([acb(1)]*(N+1))
# THIN x V6 style member and Liouville for contrast
lio = [acb(0)]*(N+1)
for n in range(1, N+1):
    m = n; om = 0; p = 2
    while m > 1:
        while m % p == 0: m //= p; om += 1
        p += 1
    lio[n] = acb((-1)**om)
res['Liouville'] = ha(lio)
out['Ha'] = res
print(json.dumps(res, indent=1), flush=True)
json.dump(out, open('misc.json', 'w'), indent=1)
print('DONE')
