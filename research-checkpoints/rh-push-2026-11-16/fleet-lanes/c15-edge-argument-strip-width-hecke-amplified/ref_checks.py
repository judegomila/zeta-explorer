# Second pass with separate code paths (same agent; not an independent referee).
# R1: Lemma 2 (strip y > 1/T against (1 + 10 T) M(T)) at actual zeros; R2: amplified norm by piecewise profile integration
# and the bound R >= N^-delta on random amplifiers; R3: Proposition C table. Arrays < 1 MB.
import json, os, math, random
import mpmath as mp
mp.mp.dps = 20
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ref_checks.json')
res = {}
def xi(s): return mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def tau(nu, n): return sum((mp.mpf(a*a)/n)**nu for a in range(1, n+1) if n % a == 0)
def J(nu, a, t0):
    f = lambda u: abs(mp.besselk(nu, u))**2/u
    pts = [mp.mpf(a)]
    while pts[-1] < t0+40: pts.append(pts[-1]+mp.mpf(1)/2)
    return mp.quad(f, pts)
R1 = []
import ast
if os.environ.get('SKIP_R1'):
    R1 = [ast.literal_eval(l[3:]) for l in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ref_checks_R1.log')) if l.startswith('R1 ')]
for k in ([] if os.environ.get('SKIP_R1') else [1, 2, 3]):
    g = mp.zetazero(k).imag; delta = mp.mpf(1)/2; t0 = g/2; nu = (-delta+1j*g)/2
    B2 = abs(xi(1+delta+1j*g))**2; sc = mp.exp(mp.pi*g/2)
    for T in [1, 2, 4]:
        nmax = int(T*(t0+40)/(2*mp.pi))
        Lsum = 8*sum(abs(tau(nu, n))**2*J(nu, 2*mp.pi*n/T, t0) for n in range(1, nmax+1))
        strip = Lsum + B2*(T**delta-T**(-delta))/delta
        M = B2*T**delta/delta
        d = dict(zero=k, T=T, nonconst_energy=float(Lsum*sc), strip_total=float(strip*sc), M_T=float(M*sc), strip_over_M=float(strip/M), bound_1_plus_10T=1+10*T,
                 flat_mean_bound=float(Lsum/M))
        R1.append(d); print('R1', d, flush=True)
res['R1_lemma2'] = R1
# R2: profile integration. g_m(y) = sum_{ad=m} (a/d)^mu0 y^(s') 1[y <= T d/a]; norm in L^2((0,inf), dy/y^2); T = 1 in the model (scale-free).
random.seed(11)
R2 = []
for k in [1, 3, 5]:
    g = float(mp.zetazero(k).imag)
    for delta in [0.5, 0.1, 0.03]:
        for N in [8, 24]:
            mu0 = complex(delta/2, -g/2)
            worst = 1e9
            for trial in range(40):
                x = [complex(random.gauss(0, 1), random.gauss(0, 1)) for _ in range(N)]
                if trial == 0: x = [1.0]+[0.0]*(N-1)
                # coefficient of y^(s') on the set y <= h: sum over (m, a, d) with d/a >= h
                terms = []
                for m in range(1, N+1):
                    for a in range(1, m+1):
                        if m % a == 0:
                            d_ = m//a; terms.append((d_/a, x[m-1]*(a/d_)**mu0))
                terms.sort(key=lambda u: u[0])
                lam = sum(c for _, c in terms)
                # integrate |coef(y)|^2 y^(delta-1) dy piecewise: on (h_{j-1}, h_j] the coefficient is the sum of terms with h >= h_j
                tot = 0.0; prev = 0.0; suffix = lam; i = 0
                while i < len(terms):
                    h = terms[i][0]
                    tot += abs(suffix)**2*(h**delta-prev**delta)/delta
                    while i < len(terms) and terms[i][0] == h:
                        suffix -= terms[i][1]; i += 1
                    prev = h
                ratio = tot*delta/abs(lam)**2 * N**delta     # must be >= 1 : R(x) >= N^-delta
                worst = min(worst, ratio)
            R2.append(dict(zero=k, delta=delta, N=N, min_over_40_amplifiers_of_R_times_N_pow_delta=worst)); print('R2', R2[-1], flush=True)
res['R2_profile_bound'] = R2
# R3: Proposition C. Normalised M'(delta, gamma) at a hypothetical zero is at least
#   m(delta, gamma) = e^(pi gamma/2) |pi^(-(1+delta+i gamma)/2) Gamma((1+delta+i gamma)/2)|^2 (zeta(2+2 delta)/zeta(1+delta))^2 / delta
R3 = []
mp.mp.dps = 70   # cancellation of terms of size gamma: 20 digits are not enough at gamma = 1e32
for g in [1e2, 1e4, 1e8, 1e16, 1e32]:
    for delta in [0.5/math.log(g), 1/math.log(g), math.log(math.log(g))/math.log(g), 2*math.log(math.log(g))/math.log(g), 0.1, 0.3]:
        s = mp.mpc(1+delta, g)
        lg = 2*mp.re(mp.loggamma(s/2)) - (1+delta)*mp.log(mp.pi) + mp.pi*g/2
        m = mp.exp(lg)*(mp.zeta(2+2*delta)/mp.zeta(1+delta))**2/delta
        R3.append(dict(gamma=g, delta=delta, lower_bound_on_normalised_M=float(m))); print('R3', R3[-1], flush=True)
res['R3_propC'] = R3
json.dump(res, open(OUT, 'w'), indent=1)
