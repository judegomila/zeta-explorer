# c14-laxphillips-hecke-norm-outside-l2: consistency checks for the lemmas of RESULT.md.
# Small scalar computations only (no arrays above a few hundred entries). mpmath 30 digits.
import json, random, os
from mpmath import mp, mpf, mpc, zetazero, zeta, gamma, pi, besselk, sqrt, cos, exp, log, floor, re, im, fabs
mp.dps = 30
out = {}
random.seed(14)

def xis(s):  # completed zeta pi^(-s/2) Gamma(s/2) zeta(s)
    return pi**(-s/2) * gamma(s/2) * zeta(s)

def lam(nu, p, k=1):  # Hecke eigenvalue of T_{p^k} at parameter nu: sum_j p^((k-2j) nu)
    return sum(mpf(p)**((k-2*j)*nu) for j in range(k+1))

def lam_n(nu, n):
    r = mpf(1); m = n; p = 2
    while p*p <= m:
        if m % p == 0:
            k = 0
            while m % p == 0: m //= p; k += 1
            r *= lam(nu, p, k)
        p += 1
    if m > 1: r *= lam(nu, m, 1)
    return r

def reduce_ht(x, y):  # height of the representative in the standard fundamental domain
    z = mpc(x, y)
    for _ in range(10000):
        z = mpc(re(z) - floor(re(z) + mpf(1)/2), im(z))
        if abs(z) < 1 - mpf(10)**(-25): z = -1/z
        else: break
    return im(z), z

# ---- A. sub-solution: u = ht^s', T_p u >= lambda_{s'-1/2}(p) u on F (Lemma L1) ----
worst = None; cnt = 0
for p in (2, 3, 5, 7):
    for sp in (mpf('0.1'), mpf('0.5'), mpf('0.75'), mpf('0.9'), mpf('1.3')):
        for _ in range(60):
            x = mpf(random.uniform(-0.5, 0.5)); y = mpf(random.uniform(0.0, 6.0))
            if x*x + y*y < 1: y = sqrt(1 - x*x) + y
            u = lambda X, Y: reduce_ht(X, Y)[0]**sp
            Tp = (u(p*x, p*y) + sum(u((x+b)/p, y/p) for b in range(p))) / sqrt(mpf(p))
            ratio = Tp / (lam(sp - mpf(1)/2, p) * u(x, y))
            cnt += 1
            if worst is None or ratio < worst: worst = ratio
out['A_subsolution'] = {'samples': cnt, 'min_ratio_Tp_u_over_lambda_u': float(worst), 'holds': bool(worst >= 1 - mpf(10)**(-20))}

# ---- D. Hecke multiplication for the weight lambda_theta (used in Lemma H1) ----
from math import gcd
maxdev = mpf(0)
for th in (mpf('0.25'), mpf('0.1')):
    for (m, n) in ((4, 6), (12, 18), (8, 8), (30, 45), (7, 49), (36, 60)):
        g = gcd(m, n)
        rhs = sum(lam_n(th, m*n//(d*d)) for d in range(1, g+1) if g % d == 0)
        maxdev = max(maxdev, fabs(lam_n(th, m)*lam_n(th, n) - rhs))
out['D_hecke_relation_weight_maxdev'] = float(maxdev)

# ---- C. Hecke-sup gauge on an eigencharacter: sup_n |lambda_mu(n)| / lambda_theta(n) (Lemma H2) ----
# local sups over k <= K for p <= 13; the global sup is the product of local sups.
def local_sup(mu, th, p, K=60):
    best = mpf(0); arg = 0
    for k in range(K+1):
        v = fabs(lam(mu, p, k)) / lam(th, p, k)
        if v > best: best, arg = v, k
    return best, arg
g1 = im(zetazero(1)); g2 = im(zetazero(2))
rowsC = []
for label, a, gam in (('zeta rho_1 (a=1/4)', mpf(1)/4, g1), ('zeta rho_2 (a=1/4)', mpf(1)/4, g2),
                      ('moved a=0.40, gamma_1', mpf('0.40'), g1), ('moved a=0.10, gamma_1', mpf('0.10'), g1),
                      ('moved a=0.26, gamma_1', mpf('0.26'), g1)):
    mu = mpc(-a, gam/2)
    for th in (mpf('0.25'), mpf('0.20'), mpf('0.30')):
        prod = mpf(1); ks = []
        for p in (2, 3, 5, 7, 11, 13):
            s, k = local_sup(mu, th, p); prod *= s; ks.append(k)
        rowsC.append({'state': label, 'a': float(a), 'theta': float(th), 'sup_over_p_le_13_k_le_60': float(prod) if prod < mpf(10)**300 else str(prod), 'argmax_k': ks,
                      'expected': 'equals 1' if a <= th else 'unbounded in k'})
out['C_gauge'] = rowsC

# ---- E. Eisenstein series by Fourier expansion: sign of E(z, 3/4); Hecke eigen-relation; EIS-w ----
def tau(nu, n):  # sum_{ab=n} (a/b)^nu
    return sum((mpf(d)/(n//d))**nu for d in range(1, n+1) if n % d == 0)
def Eis(x, y, s, N=None):
    nu = s - mpf(1)/2
    if N is None: N = int(12/float(y)) + 12
    phi = xis(2*s-1)/xis(2*s)
    val = mpc(y)**s + phi*mpc(y)**(1-s)
    acc = mpc(0)
    for n in range(1, N+1):
        acc += tau(nu, n) * besselk(nu, 2*pi*n*y) * cos(2*pi*n*x)
    return val + 4*sqrt(y)/xis(2*s) * acc, phi
def Tp_E(p, x, y, s):
    return (Eis(p*x, p*y, s)[0] + sum(Eis((x+b)/p, y/p, s)[0] for b in range(p))) / sqrt(mpf(p))
E_i, phi34 = Eis(mpf(0), mpf(1), mpf(3)/4)
E_hi, _ = Eis(mpf(0), mpf(10), mpf(3)/4)
E_inv, _ = Eis(mpf(0), mpf(1)/2, mpf(3)/4)   # z = i/2 ~ 2i: automorphy check
E_2i, _ = Eis(mpf(0), mpf(2), mpf(3)/4)
out['E_sign'] = {'phi(3/4)': float(re(phi34)), 'E(i,3/4)': float(re(E_i)), 'E(10i,3/4)': float(re(E_hi)),
                 'automorphy |E(i/2)-E(2i)|': float(fabs(E_inv - E_2i))}
rho1 = mpc(mpf(1)/2, g1)
w_res = 1 - rho1/2            # phi(w_res) = 0, Re w = 3/4
w_off = mpc(mpf('0.80'), -g1/2 + mpf('0.37'))   # EIS-w: generic point, phi != 0
rowsE = []
for label, w in (('resonance w = 1 - rho_1/2', w_res), ('EIS-w w = 0.80 + i(0.37 - gamma_1/2)', w_off)):
    x0, y0 = mpf('0.21'), mpf('1.3')
    Ev, ph = Eis(x0, y0, w)
    for p in (2, 3):
        lhs = Tp_E(p, x0, y0, w)
        rhs = lam(w - mpf(1)/2, p) * Ev
        rowsE.append({'state': label, 'p': p, 'abs_phi(w)': float(fabs(ph)), 'abs(T_p E - lambda E)/abs(E)': float(fabs(lhs - rhs)/fabs(Ev)),
                      'abs_lambda': float(fabs(lam(w - mpf(1)/2, p))), 'lambda_at_a=Re(w)-1/2': float(lam(re(w) - mpf(1)/2, p))})
out['E_eigen'] = rowsE

# ---- F. L^q bookkeeping: admissible q < 1/(1/2 + a); spectral radius >= lambda_{1/q-1/2}(p) > lambda_a(p) ----
rowsF = []
for a in (mpf('0.05'), mpf('0.25'), mpf('0.45')):
    qmax = 1/(mpf(1)/2 + a)
    for frac in (mpf('0.5'), mpf('0.99')):
        q = 1 + frac*(qmax - 1); th = 1/q - mpf(1)/2
        rowsF.append({'a': float(a), 'q': float(q), 'theta_q=1/q-1/2': float(th), 'theta_q > a': bool(th > a)})
out['F_Lq'] = rowsF
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'checks.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
