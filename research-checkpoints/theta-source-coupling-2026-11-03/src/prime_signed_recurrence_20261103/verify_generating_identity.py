"""Exact rational identities underlying every exponent, not a finite-degree RH check."""
import sympy as s
u,t=s.symbols('u t', nonzero=True)
G=1/(1-(u+1/u)*t+t*t)
H=((u*t)/(1-u*t)-(t/u)/(1-t/u))/2
assert s.factor(u*s.diff(G,u)-2*H*G)==0
assert s.factor((1-(u+1/u)*t+t*t)*G-1)==0
print('PASS: exact formal generating identities for arbitrary prime exponent.')
print('No signed residual or Schur-complement positivity was tested.')
