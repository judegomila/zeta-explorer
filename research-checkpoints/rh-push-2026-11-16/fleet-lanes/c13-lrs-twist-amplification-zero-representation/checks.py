# Checks for c13-lrs-twist-amplification-zero-representation. mpmath only; peak memory < 200 MB.
import json, sys
from fractions import Fraction
import mpmath as mp
mp.mp.dps = 30
OUT = {}
def xi(u):  # completed zeta, residue +1 at u=1, -1 at u=0
    return mp.pi**(-u/2) * mp.gamma(u/2) * mp.zeta(u)
def G(w, beta, gam):
    return xi(w+beta-1)*xi(w+1-beta)*xi(w+1j*gam)*xi(w-1j*gam)
def residue(f, w0, r=mp.mpf('0.05')):
    # (1/2 pi i) contour integral on a circle, independent of the closed formula
    g = lambda th: f(w0 + r*mp.e**(1j*th)) * r*mp.e**(1j*th)
    return mp.quad(g, mp.linspace(0, 2*mp.pi, 9)) / (2*mp.pi)

# A. Lemma 1: pole pattern of G at a zero and at generic parameters
gam1 = mp.im(mp.zetazero(1)); gam2 = mp.im(mp.zetazero(2))
cases = {"zero_1": (mp.mpf(1)/2, gam1), "zero_2": (mp.mpf(1)/2, gam2),
         "generic_offline_beta0.3": (mp.mpf('0.3'), gam1), "generic_online_t15": (mp.mpf(1)/2, mp.mpf(15))}
A = {}
for name, (b, g) in cases.items():
    poles = {"2-beta": 2-b, "beta-1": b-1, "beta": b, "1-beta": 1-b,
             "1+i gamma": 1+1j*g, "1-i gamma": 1-1j*g, "i gamma": 1j*g, "-i gamma": -1j*g}
    row = {}
    for pn, p in poles.items():
        if name.startswith("zero") or name == "generic_online_t15":
            # beta = 1/2: poles "beta" and "1-beta" coincide; radius kept below spacing to others
            pass
        res = residue(lambda w: G(w, b, g), p, r=mp.mpf('0.03'))
        row[pn] = float(abs(res))
    A[name] = row
    print(name, {k: "%.3e" % v for k, v in row.items()})
OUT["A_residue_abs"] = A
# closed formula for the surviving residue at w = 2 - beta: xi(3-2beta) |xi(2-beta+i gamma)|^2
b, g = cases["zero_1"]
cf = xi(3-2*b)*abs(xi(2-b+1j*g))**2
OUT["A_surviving_residue_formula_vs_contour"] = [float(cf), A["zero_1"]["2-beta"]]
print("surviving residue: formula", cf, "contour", A["zero_1"]["2-beta"])
# value of G at w = 1 - beta (= beta here) at a zero: double zero against simple pole -> G = 0
OUT["A_G_at_gamma_pole_near"] = float(abs(G(1-b+mp.mpf('1e-8'), b, g)))
print("abs G(1-beta+1e-8) at zero_1:", OUT["A_G_at_gamma_pole_near"])

# B. Local Ramanujan identity at primes, twisted: sum_k |lam(p^k)|^2 (chi x)^k = (1-(chi x)^2 ... )
def local_check(p, nu, chi_p, w):
    x = chi_p * mp.mpf(p)**(-w)
    al = mp.mpf(p)**nu; be = mp.mpf(p)**(-nu)
    lam = lambda k: sum(al**j * be**(k-j) for j in range(k+1))
    lhs = mp.nsum(lambda k: abs(lam(int(k)))**2 * x**int(k), [0, mp.inf])
    prod = 1
    for a in (al, be):
        for c in (mp.conj(al), mp.conj(be)):
            prod *= 1/(1 - a*c*x)
    rhs = prod * (1 - x*x)
    return abs(lhs - rhs)
mx = 0
for (b, g) in [(mp.mpf(1)/2, gam1), (mp.mpf('0.3'), gam1), (mp.mpf('0.8'), mp.mpf(21))]:
    nu = (b + 1j*g - 1)/2
    for p in (2, 3, 5, 7, 101):
        for chi_p in (1, -1, mp.e**(2j*mp.pi/3)):
            mx = max(mx, local_check(p, nu, chi_p, mp.mpf(3)))
OUT["B_local_identity_maxdiff"] = float(mx)
print("B local identity max diff:", mx)

# C. trivial zero L(0, chi) = 0 for even non-principal chi; value for odd chi for contrast
chi5_even = [0, 1, -1, -1, 1]            # Legendre symbol mod 5 (even)
chi5_odd = [0, 1, 1j, -1j, -1]           # order 4 (odd)
w3 = mp.e**(2j*mp.pi/3)
# mod 7, generator 3: 3^k: 3,2,6,4,5,1 ; cubic character chi(3^k) = w3^k (even since chi(-1)=chi(3^3)=1)
chi7 = [0]*7
x = 1
for k in range(6):
    chi7[x] = w3**k; x = (x*3) % 7
C = {"L(0,chi5_even)": float(abs(mp.dirichlet(0, chi5_even))), "L(0,chi7_cubic_even)": float(abs(mp.dirichlet(0, chi7))),
     "L(0,chi5_odd)": float(abs(mp.dirichlet(0, chi5_odd)))}
# twisted product at the gamma pole w = 1 - beta, zero_1: L(0,chi) L(2-2beta,chi) L(1-beta+i g,chi) L(1-beta-i g,chi)
b, g = cases["zero_1"]
for nm, ch in (("chi5_even", chi5_even), ("chi7_cubic_even", chi7), ("chi5_odd", chi5_odd)):
    v = mp.dirichlet(0, ch)*mp.dirichlet(2-2*b, ch)*mp.dirichlet(1-b+1j*g, ch)*mp.dirichlet(1-b-1j*g, ch)
    C["twisted_product_at_1-beta_"+nm] = float(abs(v))
OUT["C"] = C; print("C", C)

# D. growth of the trivial-character sum at w = 1 - beta: sum_{n<=Y} |lam(n)|^2 n^{-(1-beta)} ~ c Y
def coeffs(N, nu):
    # lam(n) = sum_{ab=n} (a/b)^nu ; sieve by divisors, float complex
    import cmath, math
    nu = complex(nu)
    pw = [0j] + [cmath.exp(nu*math.log(n)) for n in range(1, N+1)]
    lam = [0j]*(N+1)
    for a in range(1, N+1):
        pa = pw[a]
        for m in range(a, N+1, a):
            lam[m] += pa/pw[m//a]
    return lam
N = 200000
print("planned allocation: 2 lists of", N+1, "complex (about", 2*(N+1)*32/1e6, "MB)")
D = {}
for name in ("zero_1", "generic_offline_beta0.3"):
    b, g = cases[name]
    lam = coeffs(N, (b + 1j*g - 1)/2)
    c = mp.zeta(3-2*b)*abs(mp.zeta(2-b+1j*g))**2/mp.zeta(4-2*b)   # residue of the Dirichlet series at w = 2 - beta
    rows = []
    s = 0.0; fb = float(b)
    marks = {2000, 20000, 200000}
    for n in range(1, N+1):
        s += abs(lam[n])**2 * n**(-(1-fb))
        if n in marks:
            rows.append([n, s/n, float(c)])
    D[name] = rows
    print("D", name, rows)
OUT["D_trivial_character_sum_over_Y_vs_residue"] = D

# E. exponent count: threshold w*(P) = (4P^2 - 3.5P + 1)/(4P - 1.5); gamma pole at P - 1
E = []
for P in (Fraction(1), Fraction(5, 4), Fraction(3, 2), Fraction(7, 4), Fraction(2)):
    ws = (4*P*P - Fraction(7, 2)*P + 1)/(4*P - Fraction(3, 2))
    E.append([str(P), str(ws), str(P-1), bool(P-1 < ws)])
OUT["E_threshold_table"] = E; print("E", E)
# cuspidal case P = 1: threshold 3/5 = 1 - 2/(n^2+1), n = 2
assert E[0][1] == "3/5"

json.dump(OUT, open(sys.argv[1], "w"), indent=1)
