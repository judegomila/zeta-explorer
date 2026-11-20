# Second referee: independent mpmath/numpy checks of four lane lemmas (own code, written from the formulas).
import mpmath as mp, numpy as np, json, math, random, cmath
mp.mp.dps = 40
out = {}
# ---------- u6g: Lemma R with own implementation of K_T ----------
def xi(u): return mp.pi**(-u/2)*mp.gamma(u/2)*mp.zeta(u)
def Mz(u): return xi(u)/xi(u+1)
def mk(zs):
    def B(u):
        v = mp.mpf(1)
        for a in zs: v *= (u-a)*(u-mp.conj(a))/((u+mp.conj(a))*(u+a))
        return v
    return (lambda u: Mz(u)*B(u)), B
def orbit(M, z1, z2):
    z3 = z1+z2
    return [((z1, z2), 1), ((-z1, z3), M(z1)), ((z3, -z2), M(z2)), ((z2, -z3), M(z1)*M(z3)), ((-z3, z1), M(z2)*M(z3)), ((-z2, -z1), M(z1)*M(z2)*M(z3))]
def K(M, lam, T):
    o = orbit(M, *lam); s = 0
    for (n1, n2), c in o:
        for (m1, m2), cc in o:
            v1 = n1+mp.conj(m1); v2 = n2+mp.conj(m2)
            s += c*mp.conj(cc)*mp.exp((2*v1*T[0]+v1*T[1]+v2*T[0]+2*v2*T[1])/3)/(v1*v2)
    return s
rows = []
r0 = 1/xi(2)
for a, T in ((mp.mpc('0.27', '2.3'), (0, 0)), (mp.mpc('0.27', '2.3'), (0.5, 1.1)), (mp.mpc('0.41', '5.0'), (0.3, 0.2)), (mp.mpc('0.9', '1.7'), (0, 0.6)), (mp.mpc('1.6', '4.0'), (1.0, 0.0))):
    M, B = mk([a]); A = a.real; r = r0*B(1)
    eps = mp.mpf(10)**-12*mp.mpc(1, 0.7)
    val = abs(eps)**2*K(M, (1-a+eps, a), T)
    pred = r*abs(M(1-a))**2*mp.exp((2*(2*A-1)*T[0]+(2*A-1)*T[1])/3)*(1/(2*A-1)-r*mp.exp(-T[1])/(4*A))
    rows.append(dict(a=str(a), T=T, value=mp.nstr(val.real, 12), predicted=mp.nstr(pred.real, 12), rel=mp.nstr(abs(val-pred)/abs(pred), 3), imag=mp.nstr(abs(val.imag), 3)))
out['u6g_lemmaR'] = rows; print(rows, flush=True)
out['u6g_residue'] = dict(r=mp.nstr(r0, 15), six_over_pi=mp.nstr(6/mp.pi, 15), lim=mp.nstr((mp.mpf(10)**-15)*Mz(1+mp.mpf(10)**-15), 15))
# zeta itself: reflection partner exists (M(1-rho)=0): value at lambda=(1-rho+eps, rho) stays bounded times eps^2 -> 0
rho = mp.zetazero(1); eps = mp.mpf(10)**-8*mp.mpc(1, 0.7)
out['u6g_zeta_at_zero'] = mp.nstr(abs(abs(eps)**2*K(Mz, (1-rho+eps, rho), (0.2, 0.3))), 5)
print(out['u6g_residue'], out['u6g_zeta_at_zero'], flush=True)
# ---------- ctheta: Theorem B (lattice row), Lemma R bound, sinc constant, Turan ----------
def F(u, z): return (1-np.cos(u*z))/(u*z*z)
rows = []
for (d, b, u, y) in ((1.3, 0.3, 4.0, 0.37), (1.3, 0.3, 11.0, 0.37), (0.7, 0.45, 7.0, -0.2), (2.9, 0.1, 9.5, 1.1), (0.5, 0.49, 20.0, 0.05)):
    J = 400000; j = np.arange(-J, J+1)
    lhs = float(np.sum(2*np.real(F(u, y-j*d+1j*b))))
    v1 = 2*math.pi/d; k = 1; rhs = 1.0
    while k*v1 < u: rhs += 2*(1-k*v1/u)*math.cosh(k*v1*b)*math.cos(k*v1*y); k += 1
    rhs *= 2*math.pi/d
    rows.append(dict(d=d, b=b, u=u, y=y, lhs=lhs, rhs=rhs, diff=abs(lhs-rhs), harmonics=k-1, tail_scale=4*math.cosh(u*b)/(u*d*d*J)))
out['ctheta_theoremB'] = rows; print(rows, flush=True)
worst = 0; worst2 = 0; rnd = random.Random(7)
for _ in range(4000):
    u = rnd.uniform(0.5, 30); b = rnd.uniform(0.001, 0.5); y = rnd.uniform(-20, 20)
    E = float(mp.quad(lambda v: 2*(1-v/u)*(mp.cosh(b*v)-1)*mp.cos(y*v), mp.linspace(0, u, max(4, int(abs(y)*u/3)+2)))) if _ < 400 else None
    if E is None: continue
    c = math.cosh(u*b)-1
    bd = min(u*c, (2/y**2)*(3*c/u+b*math.sinh(u*b)))
    bd2 = min(u*c, (2/y**2)*(4*c/u))
    worst = max(worst, abs(E)/bd); worst2 = max(worst2, abs(E)/bd2)
out['ctheta_lemmaR_ratio_lane_bound'] = worst; out['ctheta_lemmaR_ratio_referee_bound_8c_over_u_y2'] = worst2
m = min(((cmath.sin(w)/w)**2).real for w in (rr*cmath.exp(1j*math.pi*k/400) for k in range(800) for rr in (0.1, 0.3, 0.5)))
out['ctheta_min_Re_sinc2_disc_half'] = m
# Turan second main theorem, form used: 1=|z_1|>=...>=|z_n|, m>=0: max_{nu in [m+1,m+n]} |sum c_j z_j^nu| >= 2 (n/(8e(m+n)))^n min_k |c_1+..+c_k|
def tur_ratio(z, c, m):
    n = len(z); order = sorted(range(n), key=lambda i: -abs(z[i])); z = [z[i] for i in order]; c = [c[i] for i in order]
    sc = abs(z[0]); z = [w/sc for w in z]
    mx = max(abs(sum(cj*zj**nu for cj, zj in zip(c, z))) for nu in range(m+1, m+n+1))
    ps = min(abs(sum(c[:k])) for k in range(1, n+1))
    if ps < 1e-9: return None
    return mx/(2*(n/(8*math.e*(m+n)))**n*ps)
best = 1e9; rnd = random.Random(3); trials = 0
for _ in range(60000):
    n = rnd.choice([2, 3, 4, 5, 6]); m = rnd.choice([0, 1, n, 3*n])
    kind = rnd.random()
    if kind < 0.4: z = [cmath.exp(1j*rnd.uniform(0, 2*math.pi)) for _ in range(n)]            # all on the circle (extremal type)
    elif kind < 0.7: z = [cmath.exp(2j*math.pi*(k+rnd.gauss(0, 0.02))/(m+n+1)) for k in range(n)]   # near roots of unity
    else: z = [rnd.uniform(0.3, 1)*cmath.exp(1j*rnd.uniform(0, 2*math.pi)) for _ in range(n)]
    c = [complex(rnd.gauss(0, 1), rnd.gauss(0, 1)) for _ in range(n)] if rnd.random() < 0.5 else [1.0]*n
    r = tur_ratio(z, c, m)
    if r is not None: best = min(best, r); trials += 1
out['turan_trials'] = trials; out['turan_smallest_ratio_lhs_over_rhs'] = best
print({k: v for k, v in out.items() if k.startswith('ctheta_l') or k.startswith('ctheta_m') or k.startswith('turan')}, flush=True)
# ---------- qa: Proposition M constant ----------
rows = []
for eta in (0.002, 0.01, 0.05):
    gbar = 5000.0; d = 1e-4
    L = np.linspace(0, 80, 4000001)
    D = 4*np.exp(-L/2)*np.cos(gbar*L)*(np.cos(d*L)-np.cosh(eta*L))
    sup = float(np.abs(D).max()); neg = float((-D).max())
    bound = 8*math.exp(-2)*(eta**2+d**2)/(0.5-eta)**2
    r = math.e*math.sqrt(sup/8); rows.append(dict(eta=eta, sup_abs_D=sup, sup_neg_part=neg, lane_bound=bound, ratio=sup/bound,
        eta_from_formula_at_eps_equal_bound=(math.e*math.sqrt(bound/8)/2)/(1+math.e*math.sqrt(bound/8)), eta_over_sqrt_sup=eta/math.sqrt(sup)))
out['qa_propM'] = rows; out['qa_const_e_over_4sqrt2'] = math.e/(4*math.sqrt(2)); print(rows, out['qa_const_e_over_4sqrt2'], flush=True)
# ---------- amplifier: (U2) crossing integral against two-dimensional quadrature ----------
mp.mp.dps = 25
def Bq(e, q): return 2*mp.sqrt(1-q)*mp.hyp2f1(0.5, 1-e, 1.5, 1-q)
rows = []
for (c, hi, hj, a, bb) in ((1, mp.mpf('0.5'), mp.mpf('0.8'), mp.mpc('0.25', '7.07'), mp.mpc('0.75', '-7.07')), (2, mp.mpf('0.25'), mp.mpf('0.5'), mp.mpc('0.45', '3.0'), mp.mpc('0.45', '-3.0')),
                           (1, mp.mpf('1')/3, mp.mpf('2'), mp.mpc('0.75', '7.07'), mp.mpc('0.25', '-7.07')), (3, mp.mpf('0.2'), mp.mpf('0.25'), mp.mpc('0.3', '1.0'), mp.mpc('0.7', '-1.0'))):
    q = c*c*hi*hj
    closed = c**(-2*a)/(bb-a)*((c*c*hj)**(a-bb)*Bq(bb-mp.mpf(1)/2, q)-hi**(bb-a)*Bq(a-mp.mpf(1)/2, q))
    # direct: y from hi to 1/(c^2 hj); u from hj to 1/(c^2 y); substitute u = umax - (umax-hj) w^2 to remove the endpoint singularity
    def inner(y):
        um = 1/(c*c*y)
        return mp.quad(lambda w: y**(bb-mp.mpf(3)/2)*(um-(um-hj)*w*w)**(a-mp.mpf(3)/2)*(c*c*y*(um-hj))**(-0.5)*2*(um-hj), [0, 1])
    direct = mp.quad(inner, mp.linspace(hi, 1/(c*c*hj), 6))/c
    rows.append(dict(c=c, hi=str(hi), hj=str(hj), a=str(a), bbar=str(bb), q=mp.nstr(q, 5), closed=mp.nstr(closed, 14), direct=mp.nstr(direct, 14), rel=mp.nstr(abs(closed-direct)/abs(closed), 3)))
    print(rows[-1], flush=True)
out['amp_U2'] = rows
json.dump(out, open('indep.json', 'w'), indent=1, default=str)
