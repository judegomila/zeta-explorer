"""Owned full-theta moment density and first/second spatial derivatives to g9.
Complete orbit derivatives through20; no acquired code execution.
"""
import sys,math
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,ctx
ctx.prec=192;ctx.cap=21
pi=arb.pi();hh=arb_series([0,1],21);CC=2**25*math.factorial(20)*4**20
assert (arb(1)/2)*(1-arb(3)/(2*pi))**-21<2**23
assert 3*2**23/pi<2**24
assert (arb(10)/9)**44*(-19*pi).exp()<arb(1)/2
fac20=[(-1)**j*math.factorial(2*j)/arb(4)**j for j in range(10)]
def theta20(u):
 z=pi*(2*u).exp();Z=z*(2*hh).exp();r=arb_series([0],21)
 for n in range(2,9):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 eps=2*CC*9**44*z**20*(-80*z).exp()
 r=arb_series([r[j]+arb(0,(eps/math.factorial(j)).upper()) for j in range(21)],21)
 ell=hh/2+(2*Z-3).log()+Z.log()-Z+(1+r).log()
 q0=arb_series([2*ell[j] if j>0 and j%2==0 else arb(0) for j in range(19)],19)
 q1=arb_series([2*(j+1)*ell[j+1] if j>0 and j%2==0 else arb(0) for j in range(19)],19)
 q2=arb_series([2*(j+1)*(j+2)*ell[j+2] if j>0 and j%2==0 else arb(0) for j in range(19)],19)
 ex=q0.exp();ex1=ex*q1;ex2=ex*(q2+q1*q1)
 gg=[fac20[j]*ex[2*j] for j in range(10)]
 psi=4*(u/2).exp()*(2*z*z-3*z)*(-z).exp()*(1+r[0]);psi2=psi*psi
 weight=2*u*u*psi2;l=ell[1];k=2*ell[2]
 w1=(4*u+4*u*u*l)*psi2;w2=(4+16*u*l+4*u*u*(k+2*l*l))*psi2
 return [weight*x for x in gg],[w1*gg[j]+weight*fac20[j]*ex1[2*j] for j in range(10)],[w2*gg[j]+2*w1*fac20[j]*ex1[2*j]+weight*fac20[j]*ex2[2*j] for j in range(10)]

def spatial_tail(j):
 z=arb(100);e=8*math.factorial(20)*4**20*2**44*z**20*(-3*z).exp()
 assert e<arb('1e-10') and math.factorial(20)*e*(1+e)**19<1
 for k in range(2,21):
  rr=arb(3)/(2*z)
  assert (arb(1)/2)*(1-rr)**-21<1
  assert 2**k*z+2**k*math.factorial(k-1)*rr/(1-rr)**k+1<2**(k+2)*math.factorial(k)*z
 Z=pi*arb(4).exp()
 return 256/pi.sqrt()*math.factorial(2*j)*9**j*Z**(arb(9)/2+j)*(-2*Z).exp()
