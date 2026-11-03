"""Owned exact checks of coefficient-envelope identities, not pivot computations."""
from math import comb
from fractions import Fraction as F
import json
for K in range(2,31,2):
 B=6400*(K+2)**2*(K+3)**3
 H=(2*K+7)*(3*K+7)
 for j in range(K+1):
  A=sum(comb(j,l)*40*(2*l+7)**l*(2*(l+2))**(l+2)*40*(2*(j-l)+7)**(j-l)*(j-l+3)**(j-l+3) for l in range(j+1))
  assert A<=B*H**j
# Pure exact arithmetic sample of positive-root polynomial coefficients.
def mul(a,b):
 out=[F(0)]*(len(a)+len(b)-1)
 for i,x in enumerate(a):
  for j,y in enumerate(b):out[i+j]+=x*y
 return out
poly=[F(1)]
for root in [F(1,3),F(7,2),F(11)]:poly=mul(poly,mul([root,F(1,4)],[root,F(1,4)]))
assert all(c>0 for c in poly)
print(json.dumps({'even_K_tested':'2..30','convolution_envelopes':'PASS','positive_root_coefficient_identity':'PASS','scope':'Exact elementary identities only; no signed arithmetic core or theta pivot evaluated.'},indent=2))
