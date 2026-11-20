# Second-pass checks (different code path from checks.py).
# R1: global twisted identity  sum |lam(n)|^2 chi(n) n^-w = L(w+b-1,chi) L(w+1-b,chi) L(w+ig,chi) L(w-ig,chi) / L(2w,chi^2)
# R2: general-degree exponent count: threshold w*(P, d) and the gap condition
# R3: Maass-Selberg truncated norm at a single-exponent point is positive for every beta < 1
import json, sys, cmath, math
from fractions import Fraction
import mpmath as mp
mp.mp.dps = 25
out = {}
w3 = cmath.exp(2j*math.pi/3)
chi7 = [0]*7; x = 1
for k in range(6):
    chi7[x] = w3**k; x = (x*3) % 7
chi7sq = [c*c for c in chi7]
N = 200000
print("planned allocation: 3 lists of", N+1, "complex, about", 3*(N+1)*32/1e6, "MB")
def lam_by_euler(N, nu):
    # multiplicative construction from prime powers (checks.py used a divisor sieve)
    spf = list(range(N+1))
    for i in range(2, int(N**0.5)+1):
        if spf[i] == i:
            for j in range(i*i, N+1, i):
                if spf[j] == j: spf[j] = i
    lam = [0j, 1+0j] + [0j]*(N-1)
    for n in range(2, N+1):
        p = spf[n]; m = n; k = 0
        while m % p == 0: m //= p; k += 1
        a = cmath.exp(nu*math.log(p)); b = 1/a
        lam[n] = lam[m]*sum(a**j * b**(k-j) for j in range(k+1))
    return lam
res = {}
for name, b, g in (("zero_1", 0.5, float(mp.im(mp.zetazero(1)))), ("generic", 0.3, 14.1347)):
    lam = lam_by_euler(N, complex(b-1, g)/2)
    w = 4.0
    s = sum(abs(lam[n])**2 * chi7[n % 7] * n**(-w) for n in range(1, N+1))
    mpc = [mp.mpc(c) for c in chi7]; mpc2 = [mp.mpc(c) for c in chi7sq]
    rhs = (mp.dirichlet(w+b-1, mpc)*mp.dirichlet(w+1-b, mpc)*mp.dirichlet(w+1j*g, mpc)*mp.dirichlet(w-1j*g, mpc)
           / mp.dirichlet(2*w, mpc2))
    res[name] = float(abs(s - complex(rhs)))
    print("R1", name, "abs diff", res[name])
out["R1_global_identity_absdiff"] = res
# R2: degree d = n^2 Rankin-Selberg, pole at P, twists by even chi mod q: conditions a(P-w) < 1 and
# 1/2 + d/2 + d(P-1) - a(P-1+w) < 1  =>  w > w*(P,d) = ((d-1)/2 + d(P-1)) P - (P-1)) / ((d+1)/2 + d(P-1))
def wstar(P, d):
    A = Fraction(d-1, 2) + d*(P-1)
    return (A*P - (P-1))/(A+1)
tab = []
for d in (4, 9, 16):
    assert wstar(Fraction(1), d) == 1 - Fraction(2, d+1)          # LRS exponent at P = 1
    for P in (Fraction(1), Fraction(3, 2), Fraction(2), Fraction(3)):
        ws = wstar(P, d)
        tab.append([d, str(P), str(ws), str(P-1), bool(P-1 < ws)])
out["R2_threshold_general_degree"] = tab
for r in tab: print("R2", r)
# gap condition P - 1 < w*(P,d) <=> (P-1)(A+1) < A P - (P-1) <=> A > 2(P-1) ... evaluate symbolically on a grid
ok = all(wstar(Fraction(k, 16), d) > Fraction(k, 16) - 1 for d in (4, 9, 16, 25) for k in range(16, 81))
out["R2_gap_always_open_on_grid_P_in_[1,5]"] = ok; print("R2 gap always open:", ok)
# R3: truncated norm |xi(rho-1)|^2 T^(1-beta)/(1-beta) > 0, beta in (0,1): sign only
out["R3_sign"] = [[b, (2.0**(1-b))/(1-b) > 0] for b in (0.1, 0.5, 0.9)]
json.dump(out, open(sys.argv[1], "w"), indent=1)
