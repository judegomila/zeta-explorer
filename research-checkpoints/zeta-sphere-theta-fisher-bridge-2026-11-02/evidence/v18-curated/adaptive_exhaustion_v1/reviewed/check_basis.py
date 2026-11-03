# Independent exact checks and explicitly illustrative floating diagnostics.
from fractions import Fraction as F
from math import comb,tanh,pi,log,ceil
p=[[F(1)],[F(0),F(2)]]
for n in range(1,9):
 row=[F(0)]*(n+2)
 for j,c in enumerate(p[n]):row[j+1]+=2*c/(n+1)
 for j,c in enumerate(p[n-1]):row[j]-=F(n,n+1)*c
 p.append(row)
# Taylor coefficients of sec(t/2); moments of sech(pi*x) dx.
E=[1]
for n in range(1,10):E.append(-sum(comb(2*n,2*j)*E[j] for j in range(n)))
mu={2*n:F((-1)**n*E[n],2**(2*n)) for n in range(10)}
for i in range(10):
 for j in range(10):
  val=sum((a*b*mu.get(r+s,F(0)) for r,a in enumerate(p[i]) for s,b in enumerate(p[j])),F(0))
  assert val==(1 if i==j else 0)
assert 6*6912**2<3*10**8
print('PASS: exact orthogonality through degree9 and spectral constant arithmetic.')
print('Illustrative floating bounds only, m=5, additive allowance divided by J:')
for D in [.001,.005,.01,.1,1]:
 q=tanh(pi*D/2);print(D,6e8*q**6)
print('Illustrative degree m sufficient by universal bound for J=100, epsilon=1e-6:')
for D in [.01,.1,1,2]:
 q=tanh(pi*D/2);m=max(0,ceil(log(1e-6/(6e8*100))/log(q))-1);print(D,m)
