# Independent referee checks for round-13 lanes 1 (Lemmas P, L, E), 2 (Theorems B, C, control BLS) and 4 (LRS lane).
# Own code; python-flint balls + numpy for eigenvalues. Seeds fixed.
import sys, os, json, math, random, itertools, cmath
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fractions import Fraction
import numpy as np
from flint import arb, acb, ctx, dirichlet_char
import item6_kern as K

out = {}
ctx.prec = 200
random.seed(1411)
PI = acb.pi()


def xis(u):  # pi^(-u/2) Gamma(u/2) zeta(u)
    u = acb(u)
    return PI ** (-u / 2) * (u / 2).gamma() * u.zeta()


def cf(z):
    z = acb(z)
    return complex(float(z.real.mid()), float(z.imag.mid()))


# ------------------------------------------------------------------ lane 1
L1 = {}
# (a) T-NR object: not identically zero; zero off the line at the predicted place
for p0, c in ((2, Fraction(20506, 10000)), (3, Fraction(20785, 10000))):
    cc = arb(c.numerator) / c.denominator
    l = arb(p0).log()

    def m(s, cc=cc, l=l):
        return ((s - acb(1) / 2) * l).exp() + ((acb(1) / 2 - s) * l).exp() + cc
    b = (cc / 2).acosh() / l
    s0 = acb(arb(1) / 2 + b, arb.pi() / l)
    F2 = xis(2) * m(acb(2))
    L1['TNR(%d,%s)' % (p0, float(c))] = dict(zero=str(cf(s0)), abs_m_at_zero=float(abs(m(s0)).abs_upper()), abs_zeta_at_zero=float(abs(s0.zeta()).mid()), F_at_2=float(F2.real.mid()),
                                             FE_defect=float(abs(xis(acb(0.3, 2)) * m(acb(0.3, 2)) - xis(acb(0.7, -2)) * m(acb(0.7, -2))).abs_upper()))
# X1 numbers for (3, 2.2): Lambda_F(3^k)/log 3 = 1 - (alpha^k + beta^k), alpha + beta = -c sqrt(3), alpha beta = 3
c = 2.2
S = [2.0, -c * math.sqrt(3)]
for k in range(2, 5):
    S.append(S[1] * S[-1] - 3 * S[-2])
L1['Lambda_F(3^k)/log3'] = [round(1 - S[k], 2) for k in range(1, 5)]


# (b) Lemma L.  Test kernel with a PROVABLE hypothesis: K(x) = exp(-x): det[exp(-xi_r y_j)] has sign (-1)^(k(k-1)/2).
def detm(M):
    return K.det([[acb(x) for x in row] for row in M]).real


def lemmaL_trial(Kf, p0, c, k, x0, rng):
    a = sorted(rng.sample(range(-3, 4), k))
    y = sorted(rng.uniform(0.2, 3.0) for _ in range(k))
    om = {-1: arb(p0) ** (-0.5), 0: arb(c), 1: arb(p0) ** 0.5}
    M = [[sum(om[n] * Kf(arb(x0) * arb(p0) ** (2 * (ai + n)) * arb(yj)) for n in (-1, 0, 1)) for yj in y] for ai in a]
    d = detm(M)
    # Cauchy-Binet
    ms = list(range(a[0] - 1, a[-1] + 2))
    tot = arb(0)
    wmin = None
    for sub in itertools.combinations(ms, k):
        W = [[(om[mm - ai] if (mm - ai) in om else arb(0)) for mm in sub] for ai in a]
        H = [[Kf(arb(x0) * arb(p0) ** (2 * mm) * arb(yj)) for yj in y] for mm in sub]
        dw = detm(W)
        tot += dw * detm(H)
        wmin = dw if wmin is None else (dw if dw < wmin else wmin)
    return d, tot, wmin


rng = random.Random(1411)
expK = lambda x: (-x).exp()
theta = lambda x: 1 + 2 * sum(((-arb.pi() * n * n * x).exp() for n in range(1, 40)), arb(0))
resL = {}
for name, Kf in (('exp(-x)', expK), ('theta', theta)):
    for c in (2.0, 2.0506, 3.0, 1.4142, 0.5):
        for k in (3, 4):
            ctx.prec = 600
            cnt = {'+': 0, '-': 0, '0': 0}
            cb = 0.0
            negW = 0
            for _ in range(100):
                d, tot, wmin = lemmaL_trial(Kf, 2, c, k, 0.37, rng)
                cnt['+' if d > 0 else ('-' if d < 0 else '0')] += 1
                if d != 0:
                    cb = max(cb, float((abs(d - tot) / abs(d)).upper()))
                if wmin < 0:
                    negW += 1
            resL['%s c=%g k=%d' % (name, c, k)] = dict(signs=cnt, cauchy_binet_max_rel_defect=cb, trials_with_a_negative_minor_of_W=negW)
ctx.prec = 200
L1['lemma_L'] = resL
L1['lemma_L_note'] = 'exp(-x): hypothesis of Lemma L holds with eps = (-1)^(k(k-1)/2) (k=3: -, k=4: +); theta: reference signs measured by the lane (k=3: -, k=4: -)'


# (c) S2(d): order-2 dilation minors of theta_w from those of theta (log-convexity of u -> K(e^u))
def th_w(x, p0, c):
    return arb(p0) ** (-0.5) * theta(x / p0 ** 2) + c * theta(x) + arb(p0) ** 0.5 * theta(x * p0 ** 2)


neg = [0, 0]
for _ in range(200):
    lx = sorted(rng.uniform(-1.6, 1.6) for _ in range(2))
    ly = sorted(rng.uniform(-1.6, 1.6) for _ in range(2))
    for idx, Kf in enumerate((theta, lambda x: th_w(x, 3, arb(20785) / 10000))):
        M = [[Kf(arb(a + b).exp()) for b in ly] for a in lx]
        if not (detm(M) > 0):
            neg[idx] += 1
L1['order2_minor_not_positive_of_200'] = dict(theta=neg[0], theta_w_TNR=neg[1])

# (d) Lemma E: int K3(u) e^(zu) du = 2 xi(1/2+z) (Riemann xi) for complex z; convolution kernel log-concave on a grid
ctx.prec = 128
Nn = 30


def k3(v):
    return K._k3zeta_point(acb(v), Nn)


def tr(z):
    z = acb(z)
    return acb.integral(lambda v, an: k3(v) * (z * v).exp() + k3(-v) * (-z * v).exp(), acb(0), acb(4))


def rxi(s):
    s = acb(s)
    return s * (s - 1) / 2 * xis(s)


a = arb(3) / 10
t = arb(37) / 10
v1 = tr(acb(a, t))
v2 = tr(acb(-a, t))
L1['lemma_E_transform'] = dict(int_K3_e_plus=str(cf(v1)), two_xi=str(cf(2 * rxi(acb(arb(1) / 2 + a, t)))), product=str(cf(v1 * v2)),
                               four_abs_xi_sq=float((4 * abs(rxi(acb(arb(1) / 2 + a, t))) ** 2).mid()), ref_abs_xi_sq_lane=0.13091264136,
                               abs_xi_sq=float((abs(rxi(acb(arb(1) / 2 + a, t))) ** 2).mid()))


def k3r(v):  # real-analytic evaluation, even extension used only through the series itself
    return K._k3zeta_point(acb(v), Nn)


def phi_a(u, a):
    u = acb(u)
    return acb.integral(lambda v, an: k3r(v) * (a * v).exp() * k3r(u - v) * (-a * (u - v)).exp(), acb(-4), acb(4)).real


grid = [arb(j) / 20 for j in range(0, 33)]
for aa in (arb(3) / 10, arb(45) / 100):
    vals = [phi_a(u, aa) for u in grid]
    lg = [v.log() for v in vals]
    sd = [float(((lg[j - 1] - 2 * lg[j] + lg[j + 1]) * 400).upper()) for j in range(1, len(lg) - 1)]
    L1['lemma_E_logconcavity_a=%g' % float(aa)] = dict(max_second_difference_of_log=max(sd), all_positive_values=all(v > 0 for v in vals), decreasing=all(vals[j + 1] < vals[j] for j in range(len(vals) - 1)))
# T-NR xi-kernel not log-concave (X5): second derivative of log at u = 0.405, p0 = 2, c = 2.0506
K.setprec(200)
for p0, c, u in ((2, Fraction(20506, 10000), '0.405'), (3, Fraction(20785, 10000), '0.575')):
    j = K.tnr(K.zeta_k3, K.Pt(Fraction(u)), p0, c)
    f0, f1, f2 = j[0].real, j[1].real, 2 * j[2].real
    L1['TNR_xi_kernel_d2log_p0=%d_u=%s' % (p0, u)] = float(((f2 * f0 - f1 * f1) / (f0 * f0)).mid())
jz = K.zeta_k3(K.Pt(Fraction('0.405')))
L1['zeta_xi_kernel_d2log_u=0.405'] = float(((2 * jz[2] * jz[0] - jz[1] * jz[1]) / (jz[0] * jz[0])).real.mid())
out['lane1'] = L1
print(json.dumps(L1, indent=1), flush=True)

# ------------------------------------------------------------------ lane 2
ctx.prec = 200
L2 = {}


def M0(z):
    return xis(z) / xis(acb(z) + 1)


def theta_f(z, a):
    z = acb(z)
    a = acb(a)
    ab = a.conjugate()
    return (z - a) * (z - ab) / ((z + a) * (z + ab))


def phi_bls(alist, inv=False):
    def f(z):
        v = M0(z)
        for a in alist:
            v = v / theta_f(z, a) if inv else v * theta_f(z, a)
        return v
    return f


def phi_tnr(q, c):
    l = arb(q).log()

    def mm(s):
        return ((s - acb(1) / 2) * l).exp() + ((acb(1) / 2 - s) * l).exp() + c

    def f(z):
        z = acb(z)
        return M0(z) * mm(z) / mm(z + 1)
    return f


def Kx(phi, x, z, w):
    z, w = acb(z), acb(w)
    wb = w.conjugate()
    Mz, Mw = phi(z), phi(w).conjugate()
    x = acb(x)
    t1 = 2 * ((x * (z + wb) / 2).exp() - Mz * Mw * (-x * (z + wb) / 2).exp()) / (z + wb)
    t2 = 2 * (Mw * (x * (z - wb) / 2).exp() - Mz * (-x * (z - wb) / 2).exp()) / (z - wb)
    return t1 + t2


def Nfun(phi, x, z):
    z = acb(z)
    S = (-acb(x) * z).exp() * phi(z)
    return z * (1 - S) / (1 + S)


def fz(phi, x, z):
    z = acb(z)
    return (acb(x) * z / 2).exp() + phi(z) * (-acb(x) * z / 2).exp()


abls = acb(arb(9) / 10, arb(145) / 10)
bls = phi_bls([abls])
L2['BLS_a'] = str(cf(abls))
L2['BLS_abs_phi_at_a'] = float(abs(bls(abls)).abs_upper())
zt = acb(0.37, 2.9)
L2['BLS_phi(z)phi(-z)-1'] = float(abs(bls(zt) * bls(-zt) - 1).abs_upper())
L2['BLS_phi_at_test_point'] = str(cf(bls(zt)))
L2['BLS_abs_on_axis'] = float(abs(bls(acb(0, 7.3))).mid())
# f(z)/f(z+1) with f = xi Gamma(z+a)Gamma(z+abar)/(Gamma(z-a)Gamma(z-abar))


def fb(z):
    z = acb(z)
    ab = abls.conjugate()
    return xis(z) * (z + abls).gamma() * (z + ab).gamma() / ((z - abls).gamma() * (z - ab).gamma())


L2['BLS_gamma_form_defect'] = float(abs(fb(zt) / fb(zt + 1) - bls(zt)).abs_upper() / abs(bls(zt)).abs_lower())
# Theorem B identity at random points
mx = 0.0
for _ in range(40):
    z = acb(random.uniform(0.05, 2.5), random.uniform(0.3, 30))
    w = acb(random.uniform(0.05, 2.5), random.uniform(-30, 30))
    x = random.choice([0, 0.5, 1.0, 2.0, -0.7])
    for phi in (M0, bls):
        lhs = Kx(phi, x, z, w)
        rhs = 2 * fz(phi, x, z) * fz(phi, x, w).conjugate() * (Nfun(phi, x, z) - Nfun(phi, x, w).conjugate()) / (z * z - (w * w).conjugate())
        mx = max(mx, float(abs(lhs - rhs).abs_upper() / abs(lhs).abs_lower()))
L2['theoremB_identity_max_rel_defect'] = mx
# evenness of N in z
L2['N_even_defect'] = float(abs(Nfun(bls, 0.5, zt) - Nfun(bls, 0.5, -zt)).abs_upper())


def gram_min_eig(phi, x, pts):
    G = np.array([[cf(Kx(phi, x, zi, zj)) for zj in pts] for zi in pts])
    G = (G + G.conj().T) / 2
    ev = np.linalg.eigvalsh(G)
    return float(ev.min() / abs(ev).max())


def imN_neg(phi, x, n1=24, n2=40, hmax=60.0):
    neg = 0
    tot = 0
    worst = 0.0
    for i in range(n1):
        for j in range(n2):
            z = acb(0.05 + 2.4 * i / (n1 - 1), 0.4 + hmax * j / (n2 - 1))
            om = z * z
            if not (om.imag > 0):
                continue
            v = Nfun(phi, x, z).imag
            tot += 1
            if v < 0:
                neg += 1
                worst = min(worst, float(v.mid()))
    return dict(negative=neg, of=tot, most_negative=worst)


cases = {'zeta M': M0, 'BLS a=0.9+14.5i': bls, 'BLS a=0.25+3i': phi_bls([acb(0.25, 3)]), 'BLS two pairs': phi_bls([acb(0.25, 3), acb(0.8, 21.5)]),
         'anti-control M/Theta a=0.9+14.5i': phi_bls([abls], inv=True), 'T-NR q=2 c=2.1': phi_tnr(2, arb(21) / 10), 'T-NR q=3 c=2.2': phi_tnr(3, arb(22) / 10),
         'minus M': (lambda z: -M0(z))}
rngp = random.Random(77)
ptsets = [[acb(rngp.uniform(0.05, 2.0), rngp.uniform(0.5, 40) * rngp.choice([1, 1, -1])) for _ in range(7)] for _ in range(6)]
G2 = {}
for nm, phi in cases.items():
    row = {}
    for x in (0, 0.5, 1.0, -0.5):
        row['x=%g' % x] = dict(ImN=imN_neg(phi, x), gram_min_rel_eig=min(gram_min_eig(phi, x, P) for P in ptsets))
    G2[nm] = row
    print(nm, json.dumps(row), flush=True)
L2['maass_selberg_tests'] = G2
# T-NR factor as a Blaschke product over its zeros (truncated product)
q, c = 2, arb(21) / 10
l = arb(q).log()
b = (c / 2).acosh() / l
prod = acb(1)
for k in range(-3000, 3000):
    a = acb(arb(1) / 2 + b, arb.pi() * (2 * k + 1) / l)
    a2 = acb(arb(1) / 2 - b, arb.pi() * (2 * k + 1) / l)
    prod *= (zt - a) / (zt + a.conjugate()) * (zt - a2) / (zt + a2.conjugate())
mmz = lambda s: ((s - acb(1) / 2) * l).exp() + ((acb(1) / 2 - s) * l).exp() + c
L2['TNR_factor_vs_truncated_Blaschke_product'] = dict(factor=str(cf(mmz(zt) / mmz(zt + 1))), product_6000_factors=str(cf(prod)))
out['lane2'] = L2
print(json.dumps({k: v for k, v in L2.items() if k != 'maass_selberg_tests'}, indent=1), flush=True)

# ------------------------------------------------------------------ lane 4
ctx.prec = 200
L4 = {}


def G4(w, beta, gam):
    w = acb(w)
    return xis(w + beta - 1) * xis(w + 1 - beta) * xis(w + acb(0, gam)) * xis(w - acb(0, gam))


def resid(w0, beta, gam):
    eps = acb(arb(10) ** (-30), arb(10) ** (-30))
    return eps * G4(acb(w0) + eps, beta, gam)


rho = acb.zeta_zero(1)
gam = rho.imag
half = arb(1) / 2
pts = {'2-beta': acb(arb(3) / 2), 'beta-1': acb(-half), '1+i gamma': acb(1, gam), '1-i gamma': acb(1, -gam), 'i gamma': acb(0, gam), '-i gamma': acb(0, -gam)}
r = {k: float(abs(resid(v, half, gam)).mid()) for k, v in pts.items()}
formula = xis(2) * abs(xis(rho - 1)) ** 2
r['formula xi(3-2beta)|xi(rho-1)|^2'] = float(abs(formula).mid())
eps = acb(arb(10) ** (-20))
r['double-pole coefficient at w=1/2: eps^2 G(1/2+eps)'] = float(abs(eps * eps * G4(half + eps, half, gam)).mid())
r['G regular at 1/2: |G(1/2+eps)|'] = float(abs(G4(half + eps, half, gam)).mid())
L4['first_zero_residues_abs'] = r
# generic parameter (control: E_a / EIS-w object), beta = 0.3, gamma = 14.1347: eight non-zero residues, pole at 2 - beta
be = arb(3) / 10
ga = arb(141347) / 10000
ptsg = {'2-beta': acb(2 - be), 'beta-1': acb(be - 1), 'beta': acb(be), '1-beta': acb(1 - be), '1+i gamma': acb(1, ga), 'i gamma': acb(0, ga)}
L4['generic_beta0.3_residues_abs'] = {k: float(abs(resid(v, be, ga)).mid()) for k, v in ptsg.items()}
L4['generic_residue_formula_at_2-beta'] = float(abs(xis(3 - 2 * be) * xis(acb(2 - be, ga)) * xis(acb(2 - be, -ga))).mid())
# not a pole in between: G finite at P - 0.1 and P + 0.1 ; rightmost pole
L4['G_at_2-beta+0.2_generic'] = float(abs(G4(2 - be + arb(1) / 5, be, ga)).mid())
# gamma pole at 1 - beta for even chi; trivial zero
ch_even = dirichlet_char(5, 4)
ch_odd = dirichlet_char(5, 2)
ch_even7 = dirichlet_char(7, 2)
L4['parity'] = dict(chi5_4=ch_even.parity(), chi5_2=ch_odd.parity(), chi7_2=ch_even7.parity())
L4['abs_L(0,chi)'] = dict(chi5_4_even=float(abs(ch_even.l(acb(0))).abs_upper()), chi7_2_even=float(abs(ch_even7.l(acb(0))).abs_upper()), chi5_2_odd=float(abs(ch_odd.l(acb(0))).mid()))


def tw(chi, w, beta, gam):
    w = acb(w)
    return chi.l(w + beta - 1) * chi.l(w + 1 - beta) * chi.l(w + acb(0, gam)) * chi.l(w - acb(0, gam))


L4['twisted_product_at_w=1-beta_first_zero'] = dict(chi5_4_even=float(abs(tw(ch_even, half, half, gam)).abs_upper()), chi5_2_odd=float(abs(tw(ch_odd, half, half, gam)).mid()))
L4['twisted_product_at_w=1-beta_generic'] = dict(chi5_4_even=float(abs(tw(ch_even, 1 - be, be, ga)).abs_upper()), chi5_2_odd=float(abs(tw(ch_odd, 1 - be, be, ga)).mid()))
# gamma factor of even twists: Gamma_R(w+beta-1) has its pole at w = 1-beta; other factors finite there
gR = lambda u: PI ** (-acb(u) / 2) * (acb(u) / 2).gamma()
L4['gamma_factor_generic'] = dict(rgamma_of_first_factor_at_pole=float(abs((acb(0) / 2).rgamma()).abs_upper()), other_three_finite=float(abs(gR(2 - 2 * be) * gR(acb(1 - be, ga)) * gR(acb(1 - be, -ga))).mid()))
# inequality: w*(P, d) and P - 1


def wstar(P, d):
    A = Fraction(d - 1, 2) + d * (P - 1)
    return (A * P - (P - 1)) / (A + 1)


L4['wstar(1,n^2)'] = {n: str(wstar(Fraction(1), n * n)) + ' vs ' + str(1 - Fraction(2, n * n + 1)) for n in (2, 3, 4)}
L4['wstar(P,4) vs P-1'] = {str(P): (str(wstar(P, 4)), str(P - 1)) for P in (Fraction(1), Fraction(5, 4), Fraction(3, 2), Fraction(7, 4), Fraction(2))}
viol = 0
for i in range(0, 400):
    beta = Fraction(i, 100) - 1  # beta from -1 to 3
    P = 2 - beta
    if P < 1:
        continue
    holds = (1 - beta) <= wstar(P, 4)
    if holds != (beta <= Fraction(7, 4)):
        viol += 1
L4['inequality_equivalent_to_beta<=7/4_mismatches_on_grid(P>=1)'] = viol
# principal-character sum: sum_{n<=Y} |lambda(n)|^2 n^-(1-beta) / Y -> zeta(3-2beta)|zeta(2-beta+i gamma)|^2/zeta(4-2beta)
for (bf, gf, tag) in ((0.5, float(gam.mid()), 'first zero'), (0.3, 14.1347, 'generic 0.3')):
    Y = 200000
    nu = complex((bf - 1) / 2, gf / 2)
    n = np.arange(1, Y + 1, dtype=np.float64)
    lam = np.zeros(Y + 1, dtype=np.complex128)
    pw = np.concatenate([[0], n ** nu])
    pwi = np.concatenate([[0], n ** (-nu)])
    for a in range(1, Y + 1):
        mult = np.arange(a, Y + 1, a)
        lam[mult] += pw[a] * pwi[mult // a]
    s = np.cumsum(np.abs(lam[1:]) ** 2 * n ** (-(1 - bf)))
    cst = (acb(3 - 2 * bf).zeta() * abs(acb(2 - bf, gf).zeta()) ** 2 / acb(4 - 2 * bf).zeta())
    L4['principal_sum_ratio ' + tag] = dict(Y2e4=float(s[19999] / 20000), Y2e5=float(s[-1] / Y), constant=float(cst.real.mid()))
out['lane4'] = L4
print(json.dumps(L4, indent=1), flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
