"""Exact symbolic checks for REMOTE_QUARTET_INTERIOR_OBSTRUCTION.md.

These check algebra, not the complete analytic theorem.
"""
import sympy as s

x, a, R, d = s.symbols("x a R d", real=True)
z = s.symbols("z")
P = ((z - R)**2 + d**2) * ((z + R)**2 + d**2) / (R**2 + d**2)**2
expanded = (z**4 + 2*(d**2-R**2)*z**2 + (R**2+d**2)**2)/(R**2+d**2)**2
assert s.factor(P - expanded) == 0
p = P.subs(z, x+s.I*a)
dp = s.diff(P, z).subs(z, x+s.I*a)
W = s.simplify(-s.im(dp*s.conjugate(p))/a)
quotient = s.simplify(W.subs(x, R)/(p*s.conjugate(p)).subs(x, R))
pair_formula = 2/(a*a-d*d) + 2*(4*R*R+a*a-d*d)/(
    (4*R*R+(a-d)**2)*(4*R*R+(a+d)**2)
)
assert s.factor(quotient-pair_formula) == 0
at_zero = (s.diff(P,z)**2-P*s.diff(P,z,2)).subs(z,x)
assert s.factor(W.subs(a,0)-at_zero) == 0
assert s.Poly(s.together(W).as_numer_denom()[0], x, a).degree(x) <= 6
y, V = s.symbols("y V", real=True)
orbit = 2*x*x-3*x
derivative = lambda p: s.expand((s.Rational(1,2)-2*x)*p+2*x*s.diff(p,x))
orbit2 = derivative(derivative(orbit))
orbit4 = derivative(derivative(orbit2))
source = s.expand((orbit4+2*(V+100)*orbit2+(V+100)**2*orbit).subs(x,y+3))
expected = (
    32*y**6+48*y**5+(16*V+588)*y**4+(80*V+4560)*y**3
    +(2*V**2+421*V+s.Rational(174409,8))*y**2
    +(9*V**2+s.Rational(2913,2)*V+s.Rational(1032633,16))*y
    +9*V**2+s.Rational(2889,2)*V+s.Rational(979785,16)
)
assert s.expand(source-expected)==0
assert all(c > 0 for monomial,c in s.Poly(source,y,V).terms())
print("PASS: quartet expansion, normalized pair density, removable zero shift, degree bound, and positive orbit polynomial.")
