# Combination 1, part A: orbit-pair Galerkin matrix of the centred theta kernel (source: PR 40, PRIOR_DRIFT_ORBIT_PAIR_OBSTRUCTION, eq. 4, 20).
# phi_n(h) = 4 z (2z - 3) e^{h/2 - z}, z = pi n^2 e^{2h};  kappa_nm = -((s_n - s_m)^2 + s_n' + s_m')/2, s_n = phi_n'/phi_n.
# M_nm = int_0^inf kappa_nm phi_n phi_m dh = 2 int_0^inf phi_n' phi_m' dh + (phi_n(0) phi_m'(0) + phi_m(0) phi_n'(0))/2   (PROVED: integration by parts)
# Closed form: phi_n' = e^{h/2} e^{-al x} P_n(x), x = e^{2h}, al = pi n^2, P_n = -16 al^3 x^3 + 60 al^2 x^2 - 30 al x.
#   int_0^inf phi_n' phi_m' dh = (1/2) sum_k c_k I_{k}(S), I_k = int_1^inf x^{k-1/2} e^{-S x} dx, S = al_n + al_m.
# usage: c1a.py out.json N prec
import sys, json, math, random, time
from flint import arb, acb, ctx
import olib, slib

out_path = sys.argv[1]; N = int(sys.argv[2]); prec = int(sys.argv[3])
olib.setprec(prec)
PI = arb.pi()
al = [None] + [PI*n*n for n in range(1, N + 1)]


def Pc(a):  # coefficients of x^1, x^2, x^3
    return [-30*a, 60*a*a, -16*a**3]


def Jk(S, kmax):
    """scaled e^S I_k(S), k = 0..kmax"""
    r = S.sqrt()
    J0 = PI.sqrt()*(S.exp()*r.erfc())/r
    J = [J0]
    for k in range(1, kmax + 1):
        J.append(((arb(k) - arb(0.5))*J[-1] + 1)/S)
    return J


bt = [None] + [4*a*(2*a - 3) for a in al[1:]]                  # phi_n(0) e^{al}
ct = [None] + [sum(Pc(a)) for a in al[1:]]                     # phi_n'(0) e^{al}
t0 = time.time()
Mt = [[None]*(N + 1) for _ in range(N + 1)]                    # scaled: M_nm e^{al_n + al_m}
Gt = [[None]*(N + 1) for _ in range(N + 1)]
for n in range(1, N + 1):
    pn = Pc(al[n])
    for m in range(n, N + 1):
        pm = Pc(al[m])
        J = Jk(al[n] + al[m], 6)
        g = arb(0)
        for i in range(3):
            for j in range(3):
                g += pn[i]*pm[j]*J[i + j + 2]
        g = g/2
        v = 2*g + (bt[n]*ct[m] + bt[m]*ct[n])/2
        Mt[n][m] = Mt[m][n] = v; Gt[n][m] = Gt[m][n] = g
res = {'N': N, 'prec': prec}
# sign pattern of kappa-integrals: diagonal > 0, off-diagonal < 0
res['diag_all_pos'] = all(Mt[n][n] > 0 for n in range(1, N + 1))
res['offdiag_all_neg'] = all(Mt[n][m] < 0 for n in range(1, N + 1) for m in range(n + 1, N + 1))
res['sigma1_0'] = float(ct[1]/bt[1]); res['c2_over_c1'] = float(ct[2]*(-al[2]).exp()/(ct[1]*(-al[1]).exp()))
# unscaled 2x2 determinant sign, and inertia by pivots of the diagonally normalised matrix
d2 = Mt[1][1]*Mt[2][2] - Mt[1][2]**2
res['det2_scaled'] = d2.str(15); res['det2_negative'] = bool(d2 < 0)
res['all_2x2_principal_minors_negative'] = all(Mt[n][n]*Mt[m][m] - Mt[n][m]**2 < 0 for n in range(1, N + 1) for m in range(n + 1, N + 1))
dg = [None] + [Mt[n][n].sqrt() for n in range(1, N + 1)]
C = [[acb(Mt[n][m]/(dg[n]*dg[m])) for m in range(1, N + 1)] for n in range(1, N + 1)]
iner = {}
for NN in sorted(set([2, 3, 4, 5, 8, 10, 20, 40, 60, 80, 120, 160, 200, 300, 400, N])):
    if NN > N: continue
    r = olib.inertia([row[:NN] for row in C[:NN]], want_pivots=True)
    iner[NN] = {'pos': r[0], 'neg': r[1], 'undecided': r[2], 'log10_min_abs_pivot': min(olib.l10(p) for p in r[3] if not p.contains(0)) if r[3] else None}
res['inertia'] = iner
# Gram of phi_n' alone: positive definite (pivots)
CG = [[acb(Gt[n][m]/(Gt[n][n]*Gt[m][m]).sqrt()) for m in range(1, min(N, 60) + 1)] for n in range(1, min(N, 60) + 1)]
res['gram_dphi_inertia_60'] = olib.inertia(CG)[:3]
# quadratic form with coefficient sequences (unscaled): A_N(a) = sum a_n a_m M_nm
kap = slib._kappa()
def chi(tab):
    q = len(tab); return lambda n: arb(tab[n % q])
def unim(t):
    return lambda n: acb(0, -t*math.log(n)).exp()
lam = slib._LAM
seqs = {'zeta': lambda n: arb(1), 'chi-4': chi([0, 1, 0, -1]), 'chi5': chi([0, 1, -1, -1, 1]), 'chi-3': chi([0, 1, -1]),
        'DH': chi([0, 1, kap, -kap, -1]), 'liouville': lambda n: arb(lam[n]), 'unimodular t=1': unim(1.0), 'unimodular t=14.1347': unim(14.1347),
        'first term only': lambda n: arb(1 if n == 1 else 0)}
random.seed(7)
E = [None] + [(-a).exp() for a in al[1:]]
def AN(seq, NN):
    v = [acb(seq(n))*E[n] for n in range(1, NN + 1)]
    s = acb(0); g2 = acb(0)
    for i in range(NN):
        for j in range(NN):
            s += v[i]*v[j].conjugate()*Mt[i + 1][j + 1]
            g2 += v[i]*v[j].conjugate()*Gt[i + 1][j + 1]
    sb = sum((v[i]*bt[i + 1] for i in range(NN)), acb(0)); sc = sum((v[i]*ct[i + 1] for i in range(NN)), acb(0))
    return s.real, 2*g2.real, (sb.conjugate()*sc).real
NNs = [1, 2, 3, 5, 10, min(N, 30)]
tab = {}
for k, sq in seqs.items():
    row = {}
    for NN in NNs:
        A, twoG, bd = AN(sq, NN)
        row[NN] = {'A': A.str(25), 'two_int_dpsi_sq': twoG.str(12), 'boundary': bd.str(12), 'sign': slib.sgn(A)}
    tab[k] = row
res['A_N'] = tab
# arithmetic-free coefficients: random real a(n) in [-1, 1] with a(1) = 1; random signs; random phases
cnt = {'real_uniform': [0, 0], 'signs': [0, 0], 'phases': [0, 0]}
minv = {}
for kind in cnt:
    mn = None
    for trial in range(2000):
        if kind == 'real_uniform': a = [1.0] + [random.uniform(-1, 1) for _ in range(11)]; sq = lambda n, a=a: arb(a[n - 1])
        elif kind == 'signs': a = [1] + [random.choice((-1, 1)) for _ in range(11)]; sq = lambda n, a=a: arb(a[n - 1])
        else: a = [0.0] + [random.uniform(0, 2*math.pi) for _ in range(11)]; sq = lambda n, a=a: acb(0, a[n - 1]).exp()
        A, twoG, bd = AN(sq, 12)
        cnt[kind][0 if A > 0 else 1] += 1
        r = float(bd/twoG); mn = r if mn is None else min(mn, r)
    minv[kind] = mn
res['random_coefficients_pos_neg'] = cnt; res['random_min_boundary_over_2G'] = minv
# cross-check by quadrature: 2 int_0^inf psi'^2 dh for zeta with psi = 4 Phi(h/2): = 16 int_0^inf Phi'(u)^2 du ... (dh = 2 du, psi' = 2 Phi')
if prec <= 1100:
    T, W, K = slib.table('zeta')
    e = arb(2)**(-(prec//3))
    s = arb(0)
    for t, w in zip(T, W):
        d = (slib.phi_zeta(t + e) - slib.phi_zeta(t - e))/(2*e)
        s += w*d*d
    # psi(h) = 4 Phi(h/2): psi'(h) = 2 Phi'(h/2); int_0^inf psi'^2 dh = 4 * 2 int Phi'^2 du = 8 int Phi'(u)^2 du
    quad = 2*8*s
    A, twoG, bd = AN(seqs['zeta'], min(N, 30))
    res['zeta_quadrature_2int_dpsi_sq'] = quad.str(25); res['zeta_matrix_sum'] = A.str(25)
    res['zeta_rel_diff'] = float(abs(quad - A)/A)
res['seconds'] = time.time() - t0
json.dump(res, open(out_path, 'w'), indent=1)
print(json.dumps({k: res[k] for k in res if k not in ('A_N',)}, indent=1))
for k in tab: print(k, {NN: (tab[k][NN]['sign'], tab[k][NN]['A'][:22], tab[k][NN]['boundary'][:14]) for NN in (1, 2, NNs[-1])})
