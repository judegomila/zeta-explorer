import mpmath as mp
mp.mp.dps=50
pi=mp.pi

def A(R):
 Z=pi*mp.exp(2*R)
 return 16*mp.exp(R)*((4*Z**4+9*Z**2)*mp.besselk(0,2*Z)-12*Z**3*mp.besselk(1,2*Z))
def C(R):
 Z=pi*mp.exp(2*R)
 return mp.diff(lambda a:16*mp.exp(R)*((4*Z**4+9*Z**2)*mp.besselk(a,2*Z)-6*Z**3*(mp.besselk(a-1,2*Z)+mp.besselk(a+1,2*Z))),0,2)/4
def ell(n):return sum(mp.log(mp.mpf(k*k)/n)**2 for k in range(1,n+1) if n%k==0)
for deg in range(0,5):
 s=mp.mpf(0)
 for j in range(2,13):
  a=(-1)**deg*mp.diff(A,mp.log(j)/2,2*deg)/(4**deg)
  if j<=3:print('deg',deg,'j',j,'a',mp.nstr(a,25))
  s+=ell(j)*a/mp.sqrt(j)
 print('deg',deg,'D/(2pi)',mp.nstr(s,30),flush=True)
