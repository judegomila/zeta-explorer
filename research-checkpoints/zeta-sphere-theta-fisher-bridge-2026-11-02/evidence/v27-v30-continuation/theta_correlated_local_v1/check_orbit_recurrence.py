"""Owned exact-rational checks. Symbolic recurrence only, no pivot certificate."""
from math import comb
from fractions import Fraction as F
import json
checks=[]
for beta in [5,7,9]:
    q=[1]
    for k in range(25):
        assert q[-1]==(-2)**k
        B=beta+2*k
        for j,c in enumerate(q):
            assert abs(c)<=comb(k,j)*2**j*B**(k-j)
        checks.append([beta,k])
        r=[0]*(len(q)+1)
        for j,c in enumerate(q):
            r[j]+=(beta+2*j)*c
            r[j+1]-=2*c
        q=r
# e^(1/4)<4/3: bound tail from j=2 geometrically, ratio at most1/12.
e_bound=1+F(1,4)+F(1,32)/(1-F(1,12))
assert e_bound<F(4,3)
assert F(2,3)-F(4,3)*F(1,8)==F(1,2)
assert F(4,3)*(1+F(1,8))==F(3,2)
# T/S >=9/2 pays the only negative central-pair term.
assert 32*F(9,2)-144==0
print(json.dumps({'recurrence_coefficient_checks':len(checks),'k_max':24,'exp_quarter_upper':str(e_bound),'scope':'Exact symbolic diagnostic only; no original pivot or full signed mean certified.'},indent=2))
