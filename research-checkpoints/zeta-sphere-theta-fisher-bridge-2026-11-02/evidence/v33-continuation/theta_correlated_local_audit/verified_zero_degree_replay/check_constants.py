from fractions import Fraction as F
from math import factorial
c=F(228,10000);x=F(4949,10000);d=F(3064,1000000);T=F(43,10);V=F(38,10)
assert c-d*V**2/2>0
assert -d/2+c*c<0
integ=c*c*(T*V-V**2/2)-c*d*(T*V**3/3-V**4/4)+d*d/4*(T*V**5/5-V**6/6)
core=4*(c*x-d*T*T/4+integ)
assert core==F(6299958915587,3662109375000000)
assert core>F(172,100000)
assert 4*c*x>core
assert sum(F(12,5)**j/factorial(j) for j in range(12))>10
for n,H,threshold in [(10**10,10**12,10**11),(3*10**10,29*10**11,2*10**11)]:
 assert H>=F(8,3)*(2*n+8)
 assert F(2050)/F(3,4)<10**4
 assert (n+1)**2<10**22
 assert 1+H<10**13
 exponent=F(27*n+130)*F(12,5)-F(3,4)*H
 assert exponent < -threshold
 print('degree',n,'height',H,'log-tail upper',exponent,'PASS')
print('core reserve exact',core,'>',F(172,100000),'PASS')
print('log(10)<12/5 via positive exponential Taylor polynomial: PASS')
