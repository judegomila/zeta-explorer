import scipy.special as sp
from scipy.integrate import quad
import numpy as np

def q(r,w):
 z=-np.expm1(-2*r)
 A=2*np.pi**w/sp.gamma(w)
 return A*(np.exp(-(2.5-w)*r)*z**(w-1)-w*np.exp((.5-w)*r)*sp.beta(w,1.5-w)*sp.betainc(w,1.5-w,z))
# singularity integrated with r=y^(1/w)
def integ(fun,R,w):
 return quad(lambda y: fun(y**(1/w))*y**(1/w-1)/w,0,R**w,epsabs=1e-10,limit=200)[0]
for w in [.1,.2,.25,.3,.4,.49]:
 for R in [np.log(2),np.log(2.01),np.log(2.1)]:
  c2=2**w-2**(-w)
  def k(s):return q(s,w)+(c2/np.sqrt(2)*q(s-np.log(2),w) if s>np.log(2) else 0)
  val=integ(lambda s:abs(k(s)),min(R,np.log(2)),w)
  if R>np.log(2):val+=integ(lambda r:abs(k(r+np.log(2))),R-np.log(2),w)
  print(w,R,val, 'qend',q(R,w))
print('weighted Schur exploratory')
for w in [.2,.25,.3,.4]:
 R=np.log(2.01); c2=(2**w-2**(-w))/np.sqrt(2)
 for p in [w/3,w/2,w*.75,w]:
  vals=[]
  for x in np.linspace(.0001,R,150):
   fun=lambda s:abs(q(s,w))*(R-x+s)**p/x**p
   val=integ(fun,x,w)
   if x>np.log(2):
    # triangle separately, deliberately avoids signed arithmetic cancellation
    val+=c2*integ(lambda s:abs(q(s,w))*(R-x+s+np.log(2))**p/x**p,x-np.log(2),w)
   vals.append(val)
  print(w,p,max(vals))
