"""Owned finite symbolic checks of general dyadic coefficient formulas."""
from fractions import Fraction as F
import json
for v in range(50):
 assert sum((2*a-v)**2 for a in range(v+1))==v*(v+1)*(v+2)//3
 assert sum(v-m+1 for m in range(1,v+1))==v*(v+1)//2
 assert sum(m*(v-m+1) for m in range(1,v+1))==v*(v+1)*(v+2)//6
 for m in range(50):
  b=lambda j:max(v-j+1,0)
  assert b(m)-2*b(m+1)+b(m+2)==int(v==m)
 for M in range(50):
  assert sum(v-m+1 for m in range(M+1,v+1))==max(v-M,0)*(max(v-M,0)+1)//2
 assert (v-9)*(2*v-17)>=0
# Integer dyadic exponent comparison at log2k=21.
for v in range(22):
 assert F(v*(v+2),3)+F(3,2)*(21-v)>=6+5*v
print(json.dumps({'dyadic_exponents_tested':50,'recurrence_and_cost_coefficients':'PASS','integer_threshold_check':'PASS','scope':'Finite symbolic checks support the separate general proofs; no residual or pivot sign tested.'},indent=2))
