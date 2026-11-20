"""Exact polynomial identities for the all-shift odd-base debit proof."""
import sympy as s
Z,a,y=s.symbols('Z a y')
P=Z**2*(4*Z**2+6*a+9)
Q=-12*Z**3
for _ in range(2):
 P,Q=(s.expand((1+2*a)*P+2*Z*s.diff(P,Z)-4*Z*Q),
      s.expand(-(1+2*a)*Q+2*Z*s.diff(Q,Z)-4*Z*P))
assert s.expand(P-Z**2*(64*Z**4+(16*a*a+240*a+1140)*Z**2+24*a**3+156*a*a+330*a+225))==0
assert s.expand(Q+12*Z**3*(40*Z**2+4*a*a+55))==0
B=s.cancel((P+Q*(1+1/(2*Z)))/Z**2)
expected=(64*y**4+1056*y**3+(16*a*a+240*a+6084)*y**2
 +(144*a*a+2880*a+13596)*y+24*a**3+420*a*a+8970*a+7599)
assert s.expand(B.subs(Z,y+6)-expected)==0
assert all(c>0 for _,c in s.Poly(expected,a,y).terms())
print('PASS: exact derivative polynomials and coefficient-positive lower bound.')
print('Analytic order comparison, convergence, and endpoint interpretation are in the note.')
