"""Owned complete-theta local moment jets through g11 with second derivatives.
Twelve explicit orbits; complete omitted tail through derivative24.
"""
import sys,math
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,ctx
ctx.prec=224;ctx.cap=25
pi=arb.pi();hh=arb_series([0,1],25);CC=2**29*math.factorial(24)*4**24
assert (arb(1)/2)*(1-arb(3)/(2*pi))**-25<2**27
assert 3*2**27/pi<2**28
assert (arb(14)/13)**52*(-27*pi).exp()<arb(1)/2
fac24=[(-1)**j*math.factorial(2*j)/arb(4)**j for j in range(12)]
def theta24(u):
 z=pi*(2*u).exp();Z=z*(2*hh).exp();r=arb_series([0],25)
 for n in range(2,13):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 eps=2*CC*13**52*z**24*(-168*z).exp()
 r=arb_series([r[j]+arb(0,(eps/math.factorial(j)).upper()) for j in range(25)],25)
 ell=hh/2+(2*Z-3).log()+Z.log()-Z+(1+r).log()
 q0=arb_series([2*ell[j] if j>0 and j%2==0 else arb(0) for j in range(23)],23)
 q1=arb_series([2*(j+1)*ell[j+1] if j>0 and j%2==0 else arb(0) for j in range(23)],23)
 q2=arb_series([2*(j+1)*(j+2)*ell[j+2] if j>0 and j%2==0 else arb(0) for j in range(23)],23)
 ex=q0.exp();ex1=ex*q1;ex2=ex*(q2+q1*q1)
 gg=[fac24[j]*ex[2*j] for j in range(12)]
 psi=4*(u/2).exp()*(2*z*z-3*z)*(-z).exp()*(1+r[0]);psi2=psi*psi
 weight=2*u*u*psi2;l=ell[1];k=2*ell[2]
 w1=(4*u+4*u*u*l)*psi2;w2=(4+16*u*l+4*u*u*(k+2*l*l))*psi2
 return [weight*x for x in gg],[w1*gg[j]+weight*fac24[j]*ex1[2*j] for j in range(12)],[w2*gg[j]+2*w1*fac24[j]*ex1[2*j]+weight*fac24[j]*ex2[2*j] for j in range(12)]
def check_outer24():
 z=arb(100);e=8*math.factorial(24)*4**24*2**52*z**24*(-3*z).exp()
 assert e<arb('1e-10') and math.factorial(24)*e*(1+e)**23<1
 for k in range(2,25):
  rr=arb(3)/(2*z)
  assert (arb(1)/2)*(1-rr)**-25<1
  assert 2**k*z+2**k*math.factorial(k-1)*rr/(1-rr)**k+1<2**(k+2)*math.factorial(k)*z
check_outer24()
