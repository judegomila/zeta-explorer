# Supplement to test1: Whittaker normalisation (zeta factors removed) and the slice d = d0 m^2. Exact, < 50 MB.
import sympy as sp
print("planned allocation: < 50 MB")
x, y, p, c = sp.symbols('x y p chi')
f = (1 - x*y)/((1 - x)*(1 - y)*(1 - p*x**2*y**2))
N = sp.expand(sp.simplify(f*(1 - x**2)*(1 - y**2)*(1 - p*x**2*y**2)))
print("N(x,y) = f * (1-x^2)(1-y^2)(1-p x^2 y^2) =", N)
P = sp.Poly(N, x, y)
print("monomials linear in x:", [(m, co) for m, co in P.terms() if m[0] == 1])
print("monomials linear in y:", [(m, co) for m, co in P.terms() if m[1] == 1])
# functional equation of the six-term polynomial in the unnormalised variables (sign character of S_3):
sq = sp.sqrt(p)
# column of N at y^2 for general chi = chi_d0(p): (1 - chi x)(1 + chi x)-normalised row = Q/zeta-factor
for j in (1,):
    Q = 1 - c*x + p*x**2
    row = sp.series(Q*(1 + c*x)/(1 - x**2)*(1 - x**2), x, 0, 4).removeO()   # L_p/zeta_p(2s) * Q, chi^2 = 1
    print("row series at p^2 || d, general chi, times (1-chi x)^-1 (1-x^2):", sp.expand(Q*(1 + c*x)).subs(c**2, 1))
# slice: coefficient of x^1 y^2 in the Whittaker normalisation, twisted: -chi ; slice sum = d0^-w / L(s+2w, chi_d0)
print("slice generating function at p: 1 - chi x y^2  <->  local factor of 1/L(s + 2w, chi_d0)")
