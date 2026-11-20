# Checks for h-hecke-torus-symmetry. mpmath, single process, < 1 min.
import json, itertools
from mpmath import mp, mpf, mpc, exp, pi, sqrt, gamma, zeta, quad, inf, log, cos, cosh, acosh, findroot, diff
mp.dps = 20
out = {}
import sys
def P(k): print(k, out[k], flush=True)

# 1. Rank-2 sublattice identity: sum_{[L:L']=p} Theta_{L'}(t) = Theta_L(t) + p Theta_L(p^2 t)
def theta_lat(b1, b2, t, N=14):
    s = mpf(0)
    for m in range(-N, N+1):
        for n in range(-N, N+1):
            v = m*b1 + n*b2
            s += exp(-pi*t*(v.real**2 + v.imag**2))
    return s
tau = mpc('0.31', '1.17'); b1 = mpc(1); b2 = tau
res = {}
for p in (2, 3, 5):
    t = mpf('0.9')
    subs = [(p*b1, b2)] + [(b1 + j*b2, p*b2) for j in range(p)]   # p+1 sublattices of index p
    lhs = sum(theta_lat(c1, c2, t) for c1, c2 in subs)
    rhs = theta_lat(b1, b2, t) + p*theta_lat(b1, b2, p*p*t)
    res[p] = float(abs(lhs - rhs))
out['rank2_sublattice_identity_abs_err'] = res

# 2. Rank-1 seed decomposition: kappa(u) = sum n^{-1/2} g0(u + 2 log n), F(z) = zeta(1/2+z) ghat(z)
def g0(u):
    y = u/4
    return (2*pi**2*exp(9*y) - 3*pi*exp(5*y))*exp(-pi*exp(4*y))
def kappa(u, N=25):
    y = u/4
    return sum((2*pi**2*n**4*exp(9*y) - 3*pi*n**2*exp(5*y))*exp(-pi*n**2*exp(4*y)) for n in range(1, N))
u0 = mpf('0.7')
out['seed_sum_err'] = float(abs(kappa(u0) - sum(mpf(n)**-0.5*g0(u0 + 2*log(n)) for n in range(1, 60))))
out['kappa_even_err'] = float(abs(kappa(u0) - kappa(-u0)))
z = mpc('1.3', '2.1')
ghat = quad(lambda u: g0(u)*exp(z*u/2), [-60, -20, -6, 0, 2, 6])
Fz = quad(lambda u: kappa(abs(u))*exp(z*u/2), [-12, -4, 0, 4, 12])
out['F_eq_zeta_times_seed_relerr'] = float(abs(Fz - zeta(mpf(1)/2 + z)*ghat)/abs(Fz))

# 3. Davenport-Heilbronn: partial multiplicativity and the twin
kap = (sqrt(10 - 2*sqrt(5)) - 2)/(sqrt(5) - 1)
a_tab = [0, 1, kap, -kap, -1]          # a(n mod 5)
b_tab = [0, kap, -1, 1, -kap]          # twin b(n mod 5)
chi = [0, 1, 1j, -1j, -1]
a = lambda n: a_tab[n % 5]; b = lambda n: b_tab[n % 5]
e1 = max(abs(a(m*n) - (chi[m % 5].real)*a(n)) for m in range(1, 200) if m % 5 in (1, 4) for n in range(1, 60))
e2 = max(abs(a(p*n) - b(n)) for p in (2, 7, 17, 37) for n in range(1, 60))
e3 = max(abs(a(p*n) + b(n)) for p in (3, 13, 23, 43) for n in range(1, 60))
e4 = max(abs(b(p*n) + a(n)) for p in (2, 7, 17, 37) for n in range(1, 60))
out['DH_a(mn)=chi(m)a(n)_m=+-1mod5_err'] = float(e1)
out['DH_U_p a = b (p=2 mod 5)_err'] = float(e2)
out['DH_U_p a = -b (p=3 mod 5)_err'] = float(e3)
out['DH_U_p b = -a (p=2 mod 5)_err'] = float(e4)
# functional equation signs: Lam(s) = (5/pi)^{s/2} Gamma((s+1)/2) sum c(n) n^-s, via theta integral
def Lam(tab, s):
    th = lambda x: sum(n*tab[n % 5]*exp(-pi*n*n*x/5) for n in range(1, 130))
    # (5/pi)^{(s+1)/2}... use direct Mellin: int_0^inf th(x) x^{(s+1)/2} dx/x = (5/pi)^{(s+1)/2} Gamma((s+1)/2) L(s)
    return quad(lambda x: th(x)*x**((s+1)/2 - 1), [0.01, 0.05, 0.2, 1, 5, 60])
s = mpc('0.3', '4.2')
out['DH_FE_ratio_Lam(1-s)/Lam(s)'] = complex(Lam(a_tab, 1 - s)/Lam(a_tab, s))
out['twin_FE_ratio_Lam(1-s)/Lam(s)'] = complex(Lam(b_tab, 1 - s)/Lam(b_tab, s))

# 4. CM tori with class number 2 (disc -20): single torus is not a Hecke eigen-object, class-character sums are
def reps(A, B, C, N):
    r = [0]*(N+1); M = int((4*N)**0.5) + 3
    for x in range(-M, M+1):
        for y in range(-M, M+1):
            v = A*x*x + B*x*y + C*y*y
            if 0 < v <= N: r[v] += 1
    return r
N = 3000
r1 = reps(1, 0, 5, N); r2 = reps(2, 2, 3, N)
def kron20(n):  # Kronecker symbol (-20/n) for n>0
    n %= 20
    return {1: 1, 3: 1, 7: 1, 9: 1, 11: -1, 13: -1, 17: -1, 19: -1}.get(n, 0)
def Tp(r, p, n):
    return r[p*n] + (kron20(p)*r[n//p] if n % p == 0 else 0)
chk = {}
for p in (3, 7, 29, 41, 11):
    lim = N//p
    same = all(Tp(r1, p, n) == (r1[p]//2 + r2[p]//2 if False else 0) or True for n in range(1, 2))
    # eigenvalue candidates: lam_plus = (r1[p]+r2[p])/2, lam_minus = (r1[p]-r2[p])/2
    lp = (r1[p] + r2[p])//2; lm = (r1[p] - r2[p])//2
    plus = all(Tp(r1, p, n) + Tp(r2, p, n) == lp*(r1[n] + r2[n]) for n in range(1, lim))
    minus = all(Tp(r1, p, n) - Tp(r2, p, n) == lm*(r1[n] - r2[n]) for n in range(1, lim))
    single = all(Tp(r1, p, n)*r1[1] == Tp(r1, p, 1)*r1[n] for n in range(1, lim))
    swap = all(Tp(r1, p, n) == lp*r2[n] for n in range(1, lim)) if lm == -lp else None
    chk[p] = dict(lam_plus=lp, lam_minus=lm, plus_eigen=plus, minus_eigen=minus, single_torus_eigen=single, T_p_maps_torus1_to_torus2=swap)
out['CM_disc_-20'] = chk

# 5. NR control: xi(s)(q^z + q^-z + c), z = s - 1/2: zeros off the line for c > 2
q, c = 2, mpf('2.2')
x0 = acosh(c/2)/log(q)
out['NR_offline_zero_real_offset'] = float(x0)
out['NR_offline_zero_ordinate'] = float(pi/log(q))
zz = mpc(x0, pi/log(q))
out['NR_factor_at_zero'] = float(abs(q**zz + q**(-zz) + c))

json.dump(out, open('hecke_checks.json', 'w'), indent=1, default=str)
print(json.dumps(out, indent=1, default=str))
