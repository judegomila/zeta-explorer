from fractions import Fraction as F
from math import factorial
m0=F(1,250)
assert (F(1477,100000)-m0)*(F(47029,1000000)-m0)-F(214382,10**7)**2>0
alpha=[F(1),F(1,10),F(1,100),F(1,1000)];d=F(1,1000)
M={2:F(1537,1000),4:F(310),6:F(101000),8:F(62000000)}
E=[]
for i in range(4):
 row=[]
 for j in range(4):
  k=i+j;v=d*M[k+1] if k%2 else d*d*M[k+2]/2
  row.append(alpha[i]*alpha[j]*v)
 E.append(row)
eta=max(map(sum,E));assert eta==F(135605,10**8)
assert m0-eta>F(13,5000)
p={2:F(2),1:F(-3)}
for j in range(7):
 c=4*sum(abs(x)*3**(k+1)*factorial(k+1) for k,x in p.items());assert c<10**13
 q={}
 for k,x in p.items():q[k]=q.get(k,F(0))+(F(1,2)+2*k)*x;q[k+1]=q.get(k+1,F(0))-2*x
 p=q
assert 10*F(2999,1000)**2>87
q=F(1,20**29);eps=8*10**27*q/(1-q**3)
assert eps/F(13,5000)<F(1,10**7)
assert F(13,5000)-eps>F(2599,10**6)
print('PASS exact constants. eta=',float(eta),'local reserve=',float(m0-eta),'off norm=',float(eps),'relative=',float(eps/F(13,5000)))
