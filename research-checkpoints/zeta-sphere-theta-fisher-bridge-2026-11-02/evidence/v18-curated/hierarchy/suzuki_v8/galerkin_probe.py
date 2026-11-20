import numpy as np
from scipy.linalg import toeplitz
from scipy.integrate import quad
from scipy.special import beta,betainc,gamma
from scipy.sparse.linalg import eigsh

def q(r,w):
 z=-np.expm1(-2*r)
 return 2*np.pi**w/gamma(w)*(np.exp(-(2.5-w)*r)*z**(w-1)-w*np.exp((.5-w)*r)*beta(w,1.5-w)*betainc(w,1.5-w,z))
def intr(fun,l,r,w):
 if l<=0:return quad(lambda z:fun(z**(1/w))*z**(1/w-1)/w,0,r**w,epsabs=1e-10)[0]
 return quad(fun,l,r,epsabs=1e-10)[0]
for w in [.25,.4,.49]:
 for R in [np.log(2),np.log(2.01),np.log(2.1)]:
  n=400; h=R/n; cs=[]
  for k in range(n):
   lo=max(0,(k-1)*h); mid=k*h; hi=(k+1)*h
   val=0
   for shift,fac in [(0,1),(np.log(2),(2**w-2**(-w))/np.sqrt(2))]:
    for l,r in [(lo,mid),(mid,hi)]:
     l=max(l,shift)
     if r>l:val+=fac*intr(lambda u:q(u,w)*max(0,1-abs(u+shift-mid)/h),l-shift,r-shift,w)
   cs.append(val)
  T=toeplitz(cs,np.r_[cs[0],np.zeros(n-1)])
  H=T[:,::-1]
  print(w,R,eigsh(H,k=2,which='LM',return_eigenvectors=False),flush=True)
