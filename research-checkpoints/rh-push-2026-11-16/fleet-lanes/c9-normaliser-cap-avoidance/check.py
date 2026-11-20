# c9-normaliser-cap-avoidance: small mpmath check. Planned memory: < 50 MB (a few hundred mp numbers).
# Objects: psi = alpha^6 on F = Q(sqrt(-3)), alpha(n) = n/|n| (unit-invariant after the 6th power).
#   Theta(t) = sum_{n in Z[omega], n != 0} n^6 exp(-c N(n) t),  c = 2 pi / sqrt(3)
#   G(s') = int_0^inf Theta(t) t^(s') dt/t = c^(-s') Gamma(s') * 6 * L(s' - 3, alpha^6)
# Functional equation Theta(1/t) = eps t^7 Theta(t) is tested numerically, then
#   G(s') = sum_N A(N) [ (cN)^(-s') Gamma(s', cN) + eps (cN)^(-(7-s')) Gamma(7-s', cN) ].
from fractions import Fraction
import mpmath as mp
mp.mp.dps = 30
NMAX = 60
om = mp.mpc(-0.5, mp.sqrt(3)/2)
A = {}
R = 12
for a in range(-R, R+1):
    for b in range(-R, R+1):
        N = a*a - a*b + b*b
        if 0 < N <= NMAX:
            A[N] = A.get(N, 0) + (a + b*om)**6
A = {N: v.real for N, v in A.items() if abs(v) > 1e-20}
assert all(a*a - a*b + b*b > NMAX for a in (R, -R) for b in range(-R, R+1))
c = 2*mp.pi/mp.sqrt(3)
def Theta(t): return mp.fsum(v*mp.exp(-c*N*t) for N, v in A.items())
print("T1 theta functional equation: Theta(1/t) / (t^7 Theta(t)) at t = 1.3, 1.7:",
      [mp.nstr(Theta(1/t)/(t**7*Theta(t)), 15) for t in (mp.mpf('1.3'), mp.mpf('1.7'))])
eps = int(mp.nint(Theta(1/mp.mpf('1.3'))/(mp.mpf('1.3')**7*Theta(mp.mpf('1.3')))))
print("   eps =", eps)
def G(sp):
    return mp.fsum(v*((c*N)**(-sp)*mp.gammainc(sp, c*N) + eps*(c*N)**(-(7-sp))*mp.gammainc(7-sp, c*N))
                   for N, v in A.items())
def L(w):  # L(w, alpha^6)
    sp = w + 3
    return G(sp)*c**sp/mp.gamma(sp)/6
# T2: compare with the absolutely convergent Dirichlet series at w = 9 (lattice sum to norm 60, tail < 6*sum N^-9)
dir9 = mp.fsum(v*mp.mpf(N)**(-12) for N, v in A.items())/6
print("T2 L(9, alpha^6): formula", mp.nstr(L(mp.mpf(9)), 15), " direct lattice sum", mp.nstr(dir9, 15))
# Euler product check at w = 9 over split primes p = 1 mod 3 (pi, pibar), p = 3, inert p = 2 mod 3, p <= 200
def euler(w, P=400):
    val = mp.mpf(1)
    for p in range(2, P):
        if any(p % d == 0 for d in range(2, int(p**0.5)+1)): continue
        if p == 3:
            val *= 1/(1 - (mp.sqrt(-3+0j))**6/27*mp.mpf(3)**(-w))  # alpha(sqrt(-3))^6 = (-27)/27 = -1
        elif p % 3 == 2:
            val *= 1/(1 - mp.mpf(p)**(-2*w))                    # alpha(p)^6 = 1, norm p^2
        else:
            for a in range(1, p):
                done = False
                for b in range(0, p):
                    if a*a - a*b + b*b == p:
                        z = a + b*om; done = True; break
                if done: break
            u = (z/abs(z))**6
            val *= 1/((1 - u*mp.mpf(p)**(-w))*(1 - mp.conj(u)*mp.mpf(p)**(-w)))
    return val
print("   Euler product (primes < 400) at w = 9:", mp.nstr(euler(mp.mpf(9)), 15))
# T3: zeros on Re w = 1/2: G(7/2 + i g) is real (eps = 1) or imaginary (eps = -1)
def Z(g):
    v = G(mp.mpc(3.5, g))
    return v.real if eps == 1 else v.imag
zs = []
g = mp.mpf('0.05'); prev = Z(g); step = mp.mpf('0.1')
while g < 30:
    g2 = g + step; cur = Z(g2)
    if prev*cur < 0: zs.append(mp.findroot(Z, (g, g2), solver='anderson'))
    g, prev = g2, cur
print("T3 zeros of L(w, alpha^6), w = 1/2 + i gamma', 0 < gamma' < 30:", [mp.nstr(z, 12) for z in zs])
# count check against the main term of N(T) for a degree-2 L-function with conductor 3 * (level of psi) ~ rough
print("   number found:", len(zs))
chi3 = [0, 1, -1]
print("T4 image points s = (3 + w)/6 = 7/12 + i gamma'/6: zeros of H_eta (eta = 1); target zeta_F = zeta * L(chi_-3) there")
for z in zs[:8]:
    s = mp.mpc(mp.mpf(7)/12, z/6)
    print("   s =", mp.nstr(s, 10), " |L(6s-3, psi)| =", mp.nstr(abs(L(6*s-3)), 3),
          " |zeta(s)| =", mp.nstr(abs(mp.zeta(s)), 6), " |L(s, chi_-3)| =", mp.nstr(abs(mp.dirichlet(s, chi3)), 6))
# T5: real axis. L(w, alpha^6) for real w in (0, 1): sign and minimum modulus (THIN has a real zero b; H(b) = 0 iff L(6b-3) = 0)
ws = [mp.mpf(k)/200 for k in range(1, 200)]
vals = [L(w) for w in ws]
print("T5 real w in (0,1): max |Im L| =", mp.nstr(max(abs(mp.im(v)) for v in vals), 3),
      " min Re L =", mp.nstr(min(mp.re(v) for v in vals), 8), " max Re L =", mp.nstr(max(mp.re(v) for v in vals), 8))
# T6: exact ladder arithmetic
x = Fraction(1)
out = []
for k in range(0, 7):
    out.append((k, str(x), float(x)))
    assert x == Fraction(3, 5) + Fraction(2, 5)/6**k
    x = (3 + x)/6
print("T6 ladder x_k = 3/5 + (2/5) 6^-k:", out)
B = Fraction(4, 7); assert 4 - 6*B == B; B2 = Fraction(3, 5); assert 6*B2 - 3 == B2
print("   fixed points: 6b-3 = b at 3/5; 4-6b = b at 4/7; centre 7/12 =", float(Fraction(7, 12)))
f = 0; fr = [0]
for j in range(5): f = 6*f + 6; fr.append(f)
print("   frequencies f_j (f -> 6f + 6):", fr, " other convention (f -> 6f - 6 on |f|):", [0, 6, 30, 174])
