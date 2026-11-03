import mpmath as mp
mp.mp.dps=35
pi=mp.pi

def f(u):
 z=pi*mp.exp(2*u)
 return 4*mp.exp(u/2)*(2*z*z-3*z)*mp.exp(-z)
def d(n):return sum(n%k==0 for k in range(1,n+1))
def ell(n):return sum(mp.log(mp.mpf(k*k)/n)**2 for k in range(1,n+1) if n%k==0)
def ac(j):
 r=mp.log(j)/2
 aa=2*mp.quad(lambda v:f(r+v)*f(r-v),[0,mp.mpf('.2'),mp.mpf('.5'),1,2,4])
 cc=2*mp.quad(lambda v:v*v*f(r+v)*f(r-v),[0,mp.mpf('.2'),mp.mpf('.5'),1,2,4])
 return aa,cc
cs=mp.mpf(0);vs=mp.mpf(0)
for j in range(1,13):
 aa,cc=ac(j)
 cs+=d(j)*cc/mp.sqrt(j)
 vs+=ell(j)*aa/(4*mp.sqrt(j))
 if j<=5:print(j,'a=',mp.nstr(aa,20),'c=',mp.nstr(cc,20))
print('Diagnostic only, j<=12 and spatial v<=4; not interval certified.')
print('h/(4pi)=',mp.nstr(cs+vs,24),'half source/(4pi)=',mp.nstr(cs,24),'full source/(4pi)=',mp.nstr(cs-vs,24),'prime correction/(4pi)=',mp.nstr(2*vs,24))
