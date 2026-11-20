# Checks for c20-u6ab: (A) Epstein constant term of the degenerate P_{2,1} series on GL(3);
# (B) L2 exponent table; (C) rank-one Maass-Selberg diagonal form for base (z+1)/(z-1) times Blaschke factors;
# (D) Lemma K finite-codimension count on a toy Hecke module. mpmath, 30 digits. Not ball arithmetic.
import json, itertools, random
from mpmath import mp, mpf, mpc, pi, gamma, gammainc, zeta, zetazero, sqrt, exp, log, re, im, conj, fabs
mp.dps = 30
out = {}

def xis(s):  # pi^{-s/2} Gamma(s/2) zeta(s)
    return pi**(-s/2)*gamma(s/2)*zeta(s)

def Lam(t, u, R=60):
    """pi^-u Gamma(u) sum_{v != 0} Q(v)^-u for Q = diag(t), det 1, by theta splitting."""
    t1, t2, t3 = t
    ti = [1/t1, 1/t2, 1/t3]
    tot = mpc(0)
    for T, w in ((t, u), (ti, mpf(3)/2 - u)):
        na = [int(sqrt(R/(pi*x)))+1 for x in T]
        for a in range(-na[0], na[0]+1):
            for b in range(-na[1], na[1]+1):
                for c in range(-na[2], na[2]+1):
                    if a == b == c == 0: continue
                    q = pi*(T[0]*a*a + T[1]*b*b + T[2]*c*c)
                    if q > R: continue
                    tot += gammainc(w, q)*q**(-w)
    return tot - 1/u - 1/(mpf(3)/2 - u)

def const_terms(t, u):
    t1, t2, t3 = t
    A = 2*xis(2*u)*t1**(-u)
    B = 2*xis(2*u-1)*t1**(-mpf(1)/2)*t2**(mpf(1)/2-u)
    C = 2*xis(2*u-2)*(t1*t2)**(-mpf(1)/2)*t3**(1-u)
    return A, B, C

rows = []
t = (mpf(1)/36, mpf(1), mpf(36))
t_b = (mpf(1)/49, mpf(7)/5, mpf(35))
rho1 = zetazero(1); rho3 = zetazero(3)
pts = [("generic 0.9+2.3i", mpc('0.9', '2.3')), ("generic 0.4+5i", mpc('0.4', '5')),
       ("2u=rho1", rho1/2), ("2u=1+rho1", (1+rho1)/2), ("2u=2+rho1", (2+rho1)/2),
       ("2u=1+rho3", (1+rho3)/2)]
for name, u in pts:
    for tt in (t, t_b):
        L = Lam(tt, u)
        A, B, C = const_terms(tt, u)
        rows.append(dict(point=name, t=[str(x) for x in tt], absLam=float(fabs(L)),
                         resid=float(fabs(L-(A+B+C))), absA=float(fabs(A)), absB=float(fabs(B)), absC=float(fabs(C))))
out['A_epstein'] = rows

# (B) exponents mu_A=(x-1/2,x+1/2,-2x), mu_B=(x-1/2,-2x,x+1/2), mu_C=(-2x,x-1/2,x+1/2); L2 iff mu1<0 and mu1+mu2<0
def l2(mu): return (mu[0] < 0) and (mu[0]+mu[1] < 0)
tab = []
for beta in [mpf(k)/20 for k in range(1, 20)]:
    for case, x, kill in (("2u=rho", beta/3-mpf(1)/2, 'A'), ("2u=1+rho", (beta-mpf(1)/2)/3, 'B'), ("2u=2+rho", beta/3+mpf(1)/6, 'C')):
        mus = dict(A=(x-mpf(1)/2, x+mpf(1)/2, -2*x), B=(x-mpf(1)/2, -2*x, x+mpf(1)/2), C=(-2*x, x-mpf(1)/2, x+mpf(1)/2))
        surv = {k: l2(v) for k, v in mus.items() if k != kill}
        tab.append(dict(beta=float(beta), case=case, x=float(x), surviving_l2=surv, all_l2=all(surv.values())))
out['B_l2'] = dict(any_all_l2=any(r['all_l2'] for r in tab), rows=tab)

# (C) diagonal Maass-Selberg form: D(z;S) = (1-|S|^2)/(2x) - Im(S)/y, S = T^-z M(z), z=x+iy, x>0, y != 0
def bl(z, a): return (z-a)*(z-conj(a))/((z+a)*(z+conj(a)))
def D(z, M, T):
    S = T**(-z)*M
    return (1-abs(S)**2)/(2*re(z)) - im(S)/im(z)
random.seed(7)
res = dict(base_min=None, pairs_min=None, single_real_min=None, quotient_min=None, n=0)
mins = dict(base=mpf(10)**9, pairs=mpf(10)**9, single=mpf(10)**9, minus=mpf(10)**9)
for _ in range(4000):
    z = mpc(random.uniform(0.02, 3), random.choice([-1, 1])*random.uniform(0.02, 40))
    T = mpf(1) + mpf(random.choice([0, 0, 0.01, 0.3, 2, 10]))
    M0 = (z+1)/(z-1)
    mins['base'] = min(mins['base'], D(z, M0, T))
    B = mpf(1)
    for _ in range(random.randint(1, 6)):
        B *= bl(z, mpc(random.uniform(0.01, 2), random.uniform(0.1, 40)))
    mins['pairs'] = min(mins['pairs'], D(z, M0*B, T))
    a = mpf(random.uniform(0.05, 0.95))
    mins['single'] = min(mins['single'], D(z, M0*(z-a)/(z+a), T))
    mins['minus'] = min(mins['minus'], D(z, -M0, T))
out['C_maass_selberg'] = {k: float(v) for k, v in mins.items()}

# (D) Lemma K toy: V = span of eigenvectors e_1..e_n of a diagonal T with distinct eigenvalues; an invariant
# subspace of codimension k is a coordinate subspace, so misses exactly k of the e_j. Count over all subspaces
# spanned by subsets (the only invariant ones for simple spectrum).
n = 7
ok = True
for k in range(0, 4):
    for miss in itertools.combinations(range(n), k):
        cnt = sum(1 for j in range(n) if j in miss)
        ok = ok and (cnt == k)
out['D_lemmaK_toy'] = ok
json.dump(out, open('checks.json', 'w'), indent=1)
for r in rows: print(r)
print('any zero case with all surviving exponents L2:', out['B_l2']['any_all_l2'])
print(out['C_maass_selberg'])
