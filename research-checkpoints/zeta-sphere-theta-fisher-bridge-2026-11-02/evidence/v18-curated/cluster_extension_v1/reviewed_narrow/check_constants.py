# New independent exact arithmetic for the cluster theorem, not acquired code.
from fractions import Fraction as F
from math import factorial, comb
p={2:F(2),1:F(-3)}
constants=[]
for j in range(5):
    b=4*sum(abs(c)*3**(k+1)*factorial(k+1) for k,c in p.items())
    constants.append(b)
    assert b<3*10**9
    q={}
    for k,c in p.items():
        q[k]=q.get(k,F(0))+(F(1,2)+2*k)*c
        q[k+1]=q.get(k+1,F(0))-2*c
    p=q
assert F(2499,1000)**2*10>60
q=F(1,20**20)
eps=6*2*10**19*q/(1-q**3)
m=F(9,2000)
assert eps<F(12,10**7)
assert eps/m<F(1,3000)
assert m-eps>F(449,100000)
print('Derivative constants:',[str(x) for x in constants])
print('Off-block norm upper:',float(eps))
print('Relative norm upper:',float(eps/m))
print('Full lower margin:',float(m-eps))
print('PASS: all exact inequalities.')
