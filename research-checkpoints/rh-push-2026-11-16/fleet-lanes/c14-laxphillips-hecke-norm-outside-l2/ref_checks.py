# Referee-pass checks (different cases from checks.py). mpmath 30 digits, scalars only.
import json, os, random
from mpmath import mp, mpf, mpc, pi, gamma, zeta, zetazero, besselk, sqrt, cos, quad, fabs, re, im, floor
mp.dps = 30
random.seed(1914)
out = {}
def divs(n): return [d for d in range(1, n+1) if n % d == 0]
def lam_n(nu, n): return sum((mpf(d)/(n//d))**nu for d in divs(n))
# R1. T_n = sum_{dd'=n} U(log d/d') at eigen level, and sum_{dd'=n} e^{theta |log d/d'|} <= 2 lambda_theta(n)
worst = mpf(0); cnt = 0
for n in (6, 12, 30, 64, 97, 360, 1001, 2310):
    for th in (mpf('0.1'), mpf('0.25'), mpf('0.49')):
        s = sum(max(mpf(d)/(n//d), mpf(n//d)/d)**th for d in divs(n))
        worst = max(worst, s/(2*lam_n(th, n))); cnt += 1
out['R1_max_ratio_sum_exp_over_2lambda'] = [float(worst), cnt]
# R2. monotonicity |lambda_mu(n)| <= lambda_a(n) <= lambda_theta(n), a = |Re mu| <= theta, random mu, n <= 400
viol = 0; tot = 0
for _ in range(300):
    a = mpf(random.uniform(0, 0.5)); th = a + mpf(random.uniform(0, 0.3)); g = mpf(random.uniform(-60, 60))
    n = random.randint(1, 400); mu = mpc(-a, g)
    tot += 1
    if not (fabs(lam_n(mu, n)) <= lam_n(a, n)*(1 + mpf(10)**(-25)) and lam_n(a, n) <= lam_n(th, n)*(1 + mpf(10)**(-25))): viol += 1
out['R2_monotonicity_violations'] = [viol, tot]
# R3. lattice cap in a concrete solid norm: N(f) = sup_F |f| ht^(-sigma). T_p^k 1 = lambda_{1/2}(p)^k: trivial identity;
#     test instead T_p (ht^sigma) / ht^sigma: sup over F is the operator norm of T_p on this space (positive operator,
#     weight itself is the extremal function). Sampled sup, sigma = 0.75 (admits resonance states with Re w <= 0.75).
def ht(x, y):
    z = mpc(x, y)
    for _ in range(10000):
        z = mpc(re(z) - floor(re(z) + mpf(1)/2), im(z))
        if abs(z) < 1 - mpf(10)**(-25): z = -1/z
        else: break
    return im(z)
rows = []
for p in (2, 3, 5):
    sg = mpf('0.75'); best = mpf(0); low = None
    for _ in range(400):
        x = mpf(random.uniform(-0.5, 0.5)); y = mpf(random.uniform(0, 3))
        if x*x + y*y < 1: y = sqrt(1 - x*x) + y
        v = (ht(p*x, p*y)**sg + sum(ht((x+b)/p, y/p)**sg for b in range(p)))/sqrt(mpf(p))/ht(x, y)**sg
        best = max(best, v); low = v if low is None else min(low, v)
    rows.append({'p': p, 'sampled_sup_ratio(lower bound for norm)': float(best), 'sampled_min_ratio': float(low),
                 'lambda_{1/4}(p)': float(lam_n(mpf('0.25'), p)), 'lambda_{1/2}(p)': float(lam_n(mpf('0.5'), p))})
out['R3_sup_weighted_norm_sigma_0.75'] = rows
# R4. zero mode of E(z,w) at small y: a_0(y) = y^w + phi(w) y^(1-w); numerical x-average at y = 0.3 for a resonance
#     and for an off-resonance point (reads phi(w) = 0 through the subdominant term).
def xis(s): return pi**(-s/2)*gamma(s/2)*zeta(s)
def Eis(x, y, s):
    nu = s - mpf(1)/2; N = int(12/float(y)) + 12
    acc = sum(lam_n(nu, n)*besselk(nu, 2*pi*n*y)*cos(2*pi*n*x) for n in range(1, N+1))
    return mpc(y)**s + xis(2*s-1)/xis(2*s)*mpc(y)**(1-s) + 4*sqrt(y)/xis(2*s)*acc
g1 = im(zetazero(1)); rows = []
for label, w in (('resonance', 1 - mpc(mpf(1)/2, g1)/2), ('off resonance', mpc(mpf('0.8'), 3))):
    y = mpf('0.3'); M = 64
    avg = sum(Eis(mpf(j)/M, y, w) for j in range(M))/M
    rows.append({'state': label, 'abs(a0 - y^w)': float(fabs(avg - mpc(y)**w)), 'abs(phi(w) y^(1-w))': float(fabs(xis(2*w-1)/xis(2*w)*mpc(y)**(1-w)))})
out['R4_zero_mode_small_y'] = rows
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ref_checks.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
