"""Exact algebra only, not an RH or all-degree Schur-sign test."""
import sympy as s
x,z,T,e=s.symbols('x z T e')
P=2*x*x-3*x
d=lambda p:s.expand(2*x*s.diff(p,x)+(s.Rational(1,2)-2*x)*p)
assert s.expand(d(d(P))-4*d(P)+s.Rational(15,4)*P+2*x*(d(P)+s.Rational(5,2)*P))==0
M=z**4+2*T*T*z*z+T**4+e*e
assert s.degree(s.expand(M.subs(z,z+2)-M),z)==3
for n in range(1,101):
 J=lambda k:sum(s.mobius(d)*(k//d)**2 for d in s.divisors(k))
 assert sum(J(k) for k in s.divisors(n))==n*n
print('PASS: exact minimal orbit equation, nonzero quartic commutator, and Jordan divisor identity through n=100 (general proof is convolution)')
