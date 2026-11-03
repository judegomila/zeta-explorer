import numpy as np
from scipy.special import beta,betainc,gamma,roots_legendre
from scipy.linalg import eigvalsh

def Q(r,w):
 r=np.maximum(r,0); z=-np.expm1(-2*r)
 q1int=np.pi**w/gamma(w)*beta(w,1.25-w/2)*betainc(w,1.25-w/2,z)
 q2=2*np.pi**w/gamma(w)*w*np.exp((.5-w)*r)*beta(w,1.5-w)*betainc(w,1.5-w,z)
 return ((.5+w)*q1int-q2)/(.5-w)
def q(r,w):
 z=-np.expm1(-2*r)
 return 2*np.pi**w/gamma(w)*(np.exp(-(2.5-w)*r)*z**(w-1)-w*np.exp((.5-w)*r)*beta(w,1.5-w)*betainc(w,1.5-w,z))
for w in [.4]:
 R=16/15*np.log(2); c2=(2**w-2**(-w))/np.sqrt(2)
 for n in [128,256,384]:
  h=R/n; j=np.arange(n); z,weights=roots_legendre(48)
  xs=(j[:,None]+(z[None,:]+1)/2)*h
  weights=np.broadcast_to(weights*h/2,xs.shape).ravel()
  xs=xs.ravel()
  V=np.zeros((len(xs),n))
  for shift,fac in [(0,1),(np.log(2),c2)]:
   hi=xs[:,None]+(j[None,:]+1)*h-R-shift
   lo=hi-h
   V+=fac*(Q(hi,w)-Q(lo,w))/np.sqrt(h)
  Amat=np.einsum('ikl,k->il',V.reshape(n,48,n),np.array(roots_legendre(48)[1])*h/2)/np.sqrt(h)
  A=(Amat+Amat.T)/2
  resid=V-Amat[np.repeat(j,48),:]/np.sqrt(h)
  G=(resid.T*weights)@resid
  d=2*Q(h,w)+2*h*abs(q(R,w))+2*c2*Q(h,w)
  print(w,n,'d=',d,'Aerr=',np.max(abs(Amat-Amat.T)),'upper',eigvalsh(A+G/(1-d))[-1], 'negative',eigvalsh(-A+G/(1-d))[-1],flush=True)
