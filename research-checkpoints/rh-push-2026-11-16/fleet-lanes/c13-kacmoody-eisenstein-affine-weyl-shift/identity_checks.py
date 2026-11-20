# c13-kacmoody-eisenstein-affine-weyl-shift: identity and control checks (mpmath only, local, memcap 8 GB).
# No large allocation: largest object is a grid of 40 x 120 complex numbers (< 1 MB).
import json, sys, random
from mpmath import mp, mpf, mpc, zeta, gamma, pi, exp, log, sqrt, dirichlet, re, im, conj, fabs, matrix, eigh, acosh
mp.dps = 30
OUT = sys.argv[1]
res = {}

def xi(s):  # completed zeta, poles at 0 and 1, xi(s)=xi(1-s)
    return pi**(-s/2)*gamma(s/2)*zeta(s)
def M(z):   # Gindikin-Karpelevich ratio
    return xi(z)/xi(z+1)

# ---------- A. affine Weyl group of SL_2: cocycle, argument list, level-1 telescoping
# nu = (z, c): z = <nu, alpha^vee>, c = <nu, K>.  s1: z -> -z ; s0: z -> 2c - z.
# positive real coroots: alpha^vee + kK (k>=0) -> z + k c ; -alpha^vee + kK (k>=1) -> k c - z.
def act(word, z, c):      # word = list of 0/1, applied right to left
    for g in reversed(word):
        z = -z if g == 1 else 2*c - z
    return z
def cfac(word, z, c):     # c(w,nu) by the cocycle c(s_i w', nu) = M(<w' nu, alpha_i^vee>) c(w', nu), reduced words only
    val = mpc(1); zz = z
    for g in reversed(word):
        arg = zz if g == 1 else c - zz
        val *= M(arg)
        zz = -zz if g == 1 else 2*c - zz
    return val
def cprod_chain(kind, n, z, c):   # product over the inversion set
    v = mpc(1)
    if kind == 'A':   # {alpha + k delta, k=0..n-1}
        for k in range(n): v *= M(z + k*c)
    else:             # {k delta - alpha, k=1..n}
        for k in range(1, n+1): v *= M(k*c - z)
    return v
z0, c0 = mpc('0.37', '2.3'), mpc('0.9', '-0.7')
dev = 0
for n in range(1, 7):
    # reduced word ending (rightmost) in s1 of length n has inversion set chain A; ending in s0: chain B
    wA = [(1 if (n-1-j) % 2 == 0 else 0) for j in range(n)]   # rightmost letter s1
    wB = [(0 if (n-1-j) % 2 == 0 else 1) for j in range(n)]   # rightmost letter s0
    dev = max(dev, fabs(cfac(wA, z0, c0)/cprod_chain('A', n, z0, c0) - 1), fabs(cfac(wB, z0, c0)/cprod_chain('B', n, z0, c0) - 1))
res['A1_cocycle_vs_inversion_product_maxrel'] = float(dev)
# level c = 1: every non-identity coefficient equals xi(z)/xi(z+n), n in Z\{0}
dev = 0
zt = mpc('0.31', '5.2')
for n in range(1, 7):
    dev = max(dev, fabs(cprod_chain('A', n, zt, 1)/(xi(zt)/xi(zt+n)) - 1), fabs(cprod_chain('B', n, zt, 1)/(xi(zt)/xi(zt-n)) - 1))
res['A2_level1_telescoping_maxrel'] = float(dev)
# at a zero rho of zeta and c = 1 all non-identity coefficients vanish
from mpmath import zetazero
rho = zetazero(1)
res['A3_level1_coeffs_at_rho1_maxabs'] = float(max(max(fabs(cprod_chain('A', n, rho, 1)), fabs(cprod_chain('B', n, rho, 1))) for n in range(1, 6)))
# argument list: real parts of numerator / denominator arguments in three regions
def arglist(z, c, K=40):
    num = [z + k*c for k in range(K)] + [k*c - z for k in range(1, K)]
    return min(re(a) for a in num), min(re(a)+1 for a in num), sum(1 for a in num if mpf('0.5') < re(a) < 1)
res['A4_args_godement(z=1.5,c=3.2)'] = [float(x) for x in arglist(mpc(1.5, 3), mpc(3.2, 1))]
res['A4_args_chamber(z=0.3,c=0.45)'] = [float(x) for x in arglist(mpc(0.3, 3), mpc(0.45, 1))]
res['A4_args_level1(z=0.3,c=1)'] = [float(x) for x in arglist(mpc(0.3, 3), mpc(1, 0))]

# ---------- B. rank-one Maass-Selberg kernel = Wronskian = Nevanlinna kernel
def Kms(phi, z, w, x):
    A1, B1 = exp(x*z/2), phi(z)*exp(-x*z/2)
    A2, B2 = conj(exp(x*w/2)), conj(phi(w)*exp(-x*w/2))
    return 2*(A1*A2 - B1*B2)/(z + conj(w)) + 2*(A1*B2 - B1*A2)/(z - conj(w))
def Nfun(phi, z, x):
    S = phi(z)*exp(-x*z)
    return z*(1 - S)/(1 + S)
def Knev(phi, z, w, x):
    fz = exp(x*z/2) + phi(z)*exp(-x*z/2); fw = exp(x*w/2) + phi(w)*exp(-x*w/2)
    return 2*fz*conj(fw)*(Nfun(phi, z, x) - conj(Nfun(phi, w, x)))/(z*z - conj(w*w))
dev = 0
random.seed(7)
for _ in range(12):
    z = mpc(random.uniform(0.1, 2), random.uniform(1, 30)); w = mpc(random.uniform(0.1, 2), random.uniform(-30, -1))
    dev = max(dev, fabs(Kms(M, z, w, 0.4)/Knev(M, z, w, 0.4) - 1))
res['B1_MS_kernel_equals_Nevanlinna_kernel_maxrel'] = float(dev)
# displayed bound |M(z)| <= T^{Re z}(sqrt(1+e^2)+e), e = Re z/|Im z|, T = 1
worst = 0
for i in range(1, 30):
    for j in range(1, 80):
        z = mpc(i*0.07, j*0.61)
        e = re(z)/fabs(im(z))
        worst = max(worst, fabs(M(z))/(sqrt(1 + e*e) + e))
res['B2_bound_ratio_max_T=1'] = float(worst)

# ---------- C. Lemma M (Moebius step) random check
bad = 0
for _ in range(20000):
    om = mpc(random.uniform(-50, 50), random.uniform(1e-3, 50)); N = mpc(random.uniform(-50, 50), random.uniform(0, 50))
    a = mpc(random.uniform(0.01, 3), random.uniform(-40, 40)); kap, m = 2*re(a), fabs(a)**2
    Np = (N*(om + m) + kap*om)/(om + m + kap*N)
    if im(Np) < -mpf(10)**(-20): bad += 1
res['C1_lemmaM_violations_of_20000'] = bad
# formula N_{S Theta} = mu(N_S)
def blpair(a):
    return lambda z: (z - a)*(z - conj(a))/((z + a)*(z + conj(a)))
a = mpc('0.25', '3.0'); Th = blpair(a)
z = mpc('0.6', '4.4'); x = 0.3
N1 = Nfun(M, z, x); N2 = Nfun(lambda u: M(u)*Th(u), z, x); om = z*z
res['C2_composition_formula_rel'] = float(fabs((N1*(om + fabs(a)**2) + 2*re(a)*om)/(om + fabs(a)**2 + 2*re(a)*N1)/N2 - 1))

# ---------- D. pointwise Nevanlinna test on a grid of the first quadrant: sign of Im N(z^2) (must be >= 0)
GR = [0.02 + 0.075*i for i in range(40)]
GI = [0.13 + 0.5*j for j in range(120)]
def nev_grid(phi, x):
    mn = mpf('inf'); arg = None; neg = 0
    for a_ in GR:
        for b_ in GI:
            z = mpc(a_, b_)
            v = im(Nfun(phi, z, x))/fabs(Nfun(phi, z, x))
            if v < -mpf(10)**(-15): neg += 1
            if v < mn: mn, arg = v, (a_, b_)
    return {'neg_points': neg, 'of': len(GR)*len(GI), 'min_sin_argN': float(mn), 'at': arg}
# controls
q = mpf(2); cc = mpf('2.1')
def Tq(z): return q**(z - mpf(1)/2) + q**(mpf(1)/2 - z) + cc
def M_tnr(z): return M(z)*Tq(z)/Tq(z + 1)
aB = mpc('0.25', '3.0')    # prescribed zero of M*Theta off the line Re z = 1/2
def M_bl(z): return M(z)*blpair(aB)(z)
def M_anti(z): return M(z)/blpair(aB)(z)
ea = mpf('0.2')
def M_ea(z): return M(z + ea)*M(z - ea)
kappa = (sqrt(10 - 2*sqrt(5)) - 2)/(sqrt(5) - 1)
chi = [0, 1, mpc(0, 1), mpc(0, -1), -1]; chib = [0, 1, mpc(0, -1), mpc(0, 1), -1]
def fdh(s): return ((1 - mpc(0, 1)*kappa)*dirichlet(s, chi) + (1 + mpc(0, 1)*kappa)*dirichlet(s, chib))/2
def xidh(s): return (pi/5)**(-s/2)*gamma((s + 1)/2)*fdh(s)
st = mpc('0.3', '7.7')
res['D0_DH_functional_equation_rel'] = float(fabs(xidh(st)/xidh(1 - st) - 1))
def M_dh(z): return xidh(z)/xidh(z + 1)
res['D0_TNR_b'] = float(acosh(cc/2)/log(q))
tests = {'zeta_x=0': (M, 0), 'zeta_x=0.5': (M, 0.5), 'zeta_x=-0.5': (M, -0.5), 'zeta_x=-2': (M, -2),
         'ARCH-BL_a=0.25+3i_x=0': (M_bl, 0), 'ARCH-BL_x=0.5': (M_bl, 0.5), 'TNR_q=2_c=2.1_x=0': (M_tnr, 0),
         'ANTI-BL(pole in RHP)_x=0': (M_anti, 0), 'E_a_a=0.2_x=0': (M_ea, 0), 'E_a_a=0.2_x=0.5': (M_ea, 0.5),
         'DH_x=0': (M_dh, 0), 'DH_x=0.5': (M_dh, 0.5)}
for name, (phi, x) in tests.items():
    res['D_' + name] = nev_grid(phi, x)
    print(name, res['D_' + name], flush=True)

# ---------- E. Gram matrices of the MS kernel at 10 points (dps 50), smallest/largest eigenvalue
mp.dps = 50
random.seed(11)
pts = [mpc(random.uniform(0.1, 1.5), random.uniform(0.5, 30)*random.choice([1, -1])) for _ in range(10)]
def gram(phi, x):
    G = matrix(10, 10)
    for i in range(10):
        for j in range(10):
            G[i, j] = Kms(phi, pts[i], pts[j], x)
    G = (G + G.H)/2
    ev = eigh(G, eigvals_only=True)
    return [float(ev[0]/ev[9]), float(ev[9])]
for name, (phi, x) in tests.items():
    res['E_' + name] = gram(phi, x)
    print('gram', name, res['E_' + name], flush=True)
json.dump(res, open(OUT, 'w'), indent=1, default=str)
for k, v in res.items():
    if not k.startswith(('D_', 'E_')): print(k, v)
