"""Part A. Sign-twist controls TW+ (0 <= eps_p <= 1) and TW- (signed), eps completely multiplicative, run through the
   DH-failing steps of the h-* lanes.  Exact rational arithmetic for coefficient-level steps, mpmath (40 digits) for the rest.
   Memory: lists of length N = 3000; planned allocation < 20 MB."""
import json, random
from fractions import Fraction as Fr
import mpmath as mp
mp.mp.dps = 40
N = 3000
print('planned allocation: < 20 MB (coefficient lists of length %d)' % N)
spf = list(range(N + 1))
for i in range(2, int(N ** 0.5) + 1):
    if spf[i] == i:
        for j in range(i * i, N + 1, i):
            if spf[j] == j: spf[j] = i
primes = [p for p in range(2, N + 1) if spf[p] == p]
mu = [0, 1] + [0] * (N - 1)
for n in range(2, N + 1):
    p = spf[n]; m = n // p
    mu[n] = 0 if m % p == 0 else -mu[m]
def cm(eps):          # completely multiplicative sequence from eps(p)
    a = [Fr(0), Fr(1)] + [Fr(0)] * (N - 1)
    for n in range(2, N + 1): a[n] = eps(spf[n]) * a[n // spf[n]]
    return a
rng = random.Random(20261117)
rs = {p: Fr(rng.choice((-1, 1))) for p in primes}
ru = {p: Fr(rng.randint(0, 16), 16) for p in primes}
TW = {
 'zeta (eps=1)':               cm(lambda p: Fr(1)),
 'TW+ a: eps_2=1/2':           cm(lambda p: Fr(1, 2) if p == 2 else Fr(1)),
 'TW+ b: eps_p=1/2 all p':     cm(lambda p: Fr(1, 2)),
 'TW+ c: eps_p random in [0,1]': cm(lambda p: ru[p]),
 'TW- a: eps_2=-1':            cm(lambda p: Fr(-1) if p == 2 else Fr(1)),
 'TW- b: Liouville':           cm(lambda p: Fr(-1)),
 'TW- c: eps_p random signs':  cm(lambda p: rs[p]),
}
k0 = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
adh = [0] + [[0, 1, k0, -k0, -1][n % 5] for n in range(1, N + 1)]
def dirichlet_inverse(a, M):
    inv = [0, 1 / a[1]] + [0] * (M - 1)
    for n in range(2, M + 1):
        s = 0
        for d in range(1, n):
            if n % d == 0 and inv[d] != 0: s += inv[d] * a[n // d]
        inv[n] = -s / a[1]
    return inv
R = {}
# ---- T1: joint Hecke eigen-object  a(pn) = a(p) a(n) for all p <= 31, n with pn <= N   (DH fails at p = +-2 mod 5)
# ---- T2: Dirichlet inverse = mu * a  (DH fails: Lemma 4.1 of h-seven-eighths-in-bridge, Thm E of h-metaplectic-spin)
M = 400
for name, a in list(TW.items()) + [('DH', adh)]:
    d1 = max(abs(a[p * n] - a[p] * a[n]) for p in primes if p <= 31 for n in range(1, N // p + 1))
    inv = dirichlet_inverse(a, M)
    d2 = max(abs(inv[n] - mu[n] * a[n]) for n in range(1, M + 1))
    R[name] = dict(T1_max_eigen_defect=mp.nstr(mp.mpf(float(d1)) if isinstance(d1, Fr) else d1, 8),
                   T2_max_inverse_defect=mp.nstr(mp.mpf(float(d2)) if isinstance(d2, Fr) else d2, 8),
                   exact=isinstance(d1, Fr))
    print(name, R[name], flush=True)
print('DH: a(6)-a(2)a(3) =', mp.nstr(adh[6] - adh[2] * adh[3], 8))
# ---- T3: Theorem B of h-metaplectic-spin: T_{p,eps} f = lambda f on the theta ladder, eps = a(p), lambda = a(p)(1+1/p), nu = 0
def ladder(a, L):
    def f(tau):
        s = mp.mpc(0)
        for n in range(1, 400):
            if a[n] == 0: continue
            t = mp.e ** (2j * mp.pi * n * n * tau / L)
            if abs(t) < mp.mpf(10) ** (-60): break
            s += (mp.mpf(a[n].numerator) / a[n].denominator if isinstance(a[n], Fr) else a[n]) * t
        return s
    return f
def TB_residual(a, L, p, tau0):
    f = ladder(a, L)
    eps = mp.mpf(a[p].numerator) / a[p].denominator if isinstance(a[p], Fr) else a[p]
    U = sum(f((tau0 + L * j) / (p * p)) for j in range(p * p)) / (p * p)
    Nf = f(tau0) - sum(f(tau0 + mp.mpf(L) * j / p) for j in range(p)) / p        # form (iv)
    V = f(p * p * tau0)
    lam = eps * (1 + mp.mpf(1) / p)
    T = U + eps / p * Nf + eps * eps / p * V
    return abs(T - lam * f(tau0)) / abs(f(tau0))
tau0 = mp.mpc('0.31', '0.83')
for name, a in TW.items():
    R[name]['T3_thmB_residual_p3_5_7'] = [mp.nstr(TB_residual(a, 2, p, tau0), 3) for p in (3, 5, 7)]
R['DH']['T3_thmB_residual_p3_7_11 (eps=i, L=10, nu=0)'] = None
print('T3:', {k: v.get('T3_thmB_residual_p3_5_7') for k, v in R.items()}, flush=True)
# ---- T4: Fricke / functional equation. Kernel level: D(x) = (1 + 2 psi(1/x)) / (sqrt(x) (1 + 2 psi(x))), psi = sum a(n) e^{-pi n^2 x}
def psi(a, x): return sum((mp.mpf(a[n].numerator) / a[n].denominator) * mp.e ** (-mp.pi * n * n * x) for n in range(1, 260) if a[n] != 0)
for name, a in TW.items():
    R[name]['T4_fricke_ratio_x_1.5_2_4_8'] = [mp.nstr((1 + 2 * psi(a, 1 / mp.mpf(x))) / (mp.sqrt(x) * (1 + 2 * psi(a, mp.mpf(x)))), 12) for x in (1.5, 2, 4, 8)]
    # small-x growth exponent of psi: zeta has -1/2 (pole at s=1)
    e = mp.log(abs(psi(a, mp.mpf(1) / 400)) / abs(psi(a, mp.mpf(1) / 100))) / mp.log(mp.mpf(1) / 4)
    R[name]['T4_psi_growth_exponent_x_to_0'] = mp.nstr(e, 5)
    print('T4', name, R[name]['T4_fricke_ratio_x_1.5_2_4_8'], R[name]['T4_psi_growth_exponent_x_to_0'], flush=True)
def thDH(x): return sum(adh[n] * n * mp.e ** (-mp.pi * n * n * x / 5) for n in range(1, 400))
R['DH']['T4_fricke_ratio (theta(1/x)/(x^{3/2} theta(x)))'] = [mp.nstr(thDH(1 / mp.mpf(x)) / (mp.mpf(x) ** 1.5 * thDH(mp.mpf(x))), 12) for x in (1.5, 2, 4, 8)]
print('T4 DH', R['DH']['T4_fricke_ratio (theta(1/x)/(x^{3/2} theta(x)))'])
# line level: phase of the completed function on Re s = 1/2 (constant mod pi iff a functional equation s <-> 1-s with real coefficients holds)
def comp(F): return lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2) * F(s)
lineF = {
 'zeta (eps=1)': lambda s: mp.zeta(s),
 'TW+ a: eps_2=1/2': lambda s: mp.zeta(s) * (1 - 2 ** (-s)) / (1 - 2 ** (-s) / 2),
 'TW- a: eps_2=-1': lambda s: mp.zeta(s) * (1 - 2 ** (-s)) / (1 + 2 ** (-s)),
 'TW- b: Liouville': lambda s: mp.zeta(2 * s) / mp.zeta(s),
}
for name, F in lineF.items():
    ph = []
    for t in (5, 10, 17, 30):
        v = comp(F)(mp.mpc(0.5, t)); ph.append(mp.nstr(mp.fmod(mp.arg(v) + 2 * mp.pi, mp.pi), 8))
    R[name]['T4_phase_mod_pi_on_line_t_5_10_17_30'] = ph
    print('T4 line', name, ph, flush=True)
# zeros of the finite twists in the strip = zeros of zeta (factor is zero-free and pole-free in Re s > 0)
for name in ('TW+ a: eps_2=1/2', 'TW- a: eps_2=-1'):
    rho = mp.mpc(0.5, mp.im(mp.zetazero(1)))
    R[name]['value_at_first_zeta_zero'] = mp.nstr(abs(lineF[name](rho)), 5)
R['TW- b: Liouville']['pole_at_first_zeta_zero_|1/F|'] = mp.nstr(abs(1 / lineF['TW- b: Liouville'](mp.mpc(0.5, mp.im(mp.zetazero(1))))), 5)
json.dump(R, open('partA_twist.json', 'w'), indent=1)
print('done')
