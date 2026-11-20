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
# Larger cluster continuation.
m0=F(19,2000)
assert (F(314,10000)-m0)*(F(205,10000)-m0)-F(1536,100000)**2>0
assert F(1477,100000)>m0
d=F(1,200);M4=508;M6=223000;M2=F(1543,1000)
assert F(1536,1000)+M4*d*d/2<M2
err=[[M2*d*d/2,M2*d/10,M4*d*d/200],
     [M2*d/10,M4*d*d/200,M4*d/1000],
     [M4*d*d/200,M4*d/1000,M6*d*d/20000]]
maxrow=max(map(sum,err))
assert maxrow==F(3375,10**6)
assert m0-maxrow>F(3,500)
assert 10*F(2495,1000)**2>60
assert eps/F(3,500)<F(1,5000)
assert F(3,500)-eps>F(599,100000)
print('PASS: wider cluster exact constants. Local margin',float(m0-maxrow),'relative',float(eps/F(3,500)))
