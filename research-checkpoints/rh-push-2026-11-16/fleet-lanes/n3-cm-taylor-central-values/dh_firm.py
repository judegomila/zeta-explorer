import re
src=open("controls.py").read()
head=src.split('print("=== (A)')[0]
exec(head)
chi=lambda n: 0 if n%5==0 else 1j**dlog[n%5]
u=series([(n,n*mpc(chi(n))) for n in range(1,40) if n%5],mpf(1)/5,mpf(3)/2)
def eps(a,b,m):
    if m%5==0: return 0
    return 1j**(dlog[(a+3*b)%5]+3*dlog[(a+2*b)%5])
prev=None
from mpmath import identify
for m in range(0,13):
    k=4*m+3
    L,W=central(k,eps,800)
    R=abs(L)*factorial(2*m+1)/(abs(u[m])*factorial(m))**2
    print("m=%2d k=%2d |W|-1=%s |L|=%s R=%s quotient=%s"%(m,k,nstr(abs(W)-1,2),nstr(abs(L),15),nstr(R,30),nstr(R/prev,30) if prev else "-"))
    prev=R
    if m==0: R0=R
Om=gamma(mpf(1)/4)**2/(2*sqrt(2*pi))
print("R_0 =",nstr(R0,40)," R_0/Omega=",nstr(R0/Om,30)," R0^2=",nstr(R0**2,30), "R0/pi", nstr(R0/pi,30))
