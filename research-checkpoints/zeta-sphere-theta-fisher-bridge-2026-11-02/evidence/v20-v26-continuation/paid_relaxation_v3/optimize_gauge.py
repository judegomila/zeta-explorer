"""Own-source exploratory convex gauge fit; numerical only, no certificate."""
import math,json
import numpy as np
from numpy.polynomial import Polynomial as Poly
from numpy.polynomial.legendre import leggauss
from scipy.optimize import linprog
from scipy.sparse import csr_matrix,hstack,eye
N=800;maxn=9;a=.25
x,wt=leggauss(N);u=3*x;wt=3*wt;pos=slice(N//2,None);wp=wt[pos]
P=[Poly([0,-3,2])]
for j in range(maxn):P.append(.5*P[-1]+2*Poly([0,1])*(P[-1].deriv()-P[-1]))
z=math.pi*np.arange(1,11)[:,None]**2*np.exp(2*abs(u))[None,:]
e=4*np.exp(abs(u)[None,:]/2-z)
psi=np.array([np.sum(e*p(z),axis=0)*np.where(u>=0,1,(-1)**j) for j,p in enumerate(P)])
def calc(lam,n,gauge=None,optimize=False):
 r=a+2*lam*u;exp=np.exp(a*u+lam*u*u)
 E=[sum(math.factorial(j)/(math.factorial(m)*math.factorial(j-2*m))*lam**m*r**(j-2*m) for m in range(j//2+1)) for j in range(n+1)]
 g=np.array([exp*sum(math.comb(j,k)*E[j-k]*psi[k] for k in range(j+1)) for j in range(n+1)])
 idx=list(range(n%2,n+1,2));sign=np.array([(-1)**((n-j)//2) for j in idx]);v=g[idx]*sign[:,None]
 H=(v*(wt*u)[None,:])@v.T*math.pi/2
 A=H[:-1,:-1];b=H[:-1,-1];c=np.r_[-np.linalg.solve(A,b),1.]
 F=c@v;K=sum(cj*sg*j*g[j-1] for cj,sg,j in zip(c,sign,idx) if j)
 S=c@H@c;J=u**3*F*F+2*u*u*F*K
 Jp=J[pos]+J[:N//2][::-1]
 Z=u[None,:]*F[None,:]*v[:-1]
 Zp=(Z[:,pos]+Z[:,:N//2][:,::-1]).T
 if optimize:
  scale=max(abs(Jp));zs=np.maximum(np.max(abs(Zp),axis=0),1e-300)
  mat=hstack([csr_matrix(Zp/zs[None,:]),-eye(N//2)],format='csr')
  sol=linprog(np.r_[np.zeros(len(idx)-1),wp],A_ub=mat,b_ub=-Jp/scale,bounds=[(None,None)]*(len(idx)-1)+[(0,None)]*(N//2),method='highs')
  assert sol.success,sol.message
  gauge=sol.x[:len(idx)-1]*scale/zs
 if isinstance(gauge,str):
  if gauge=='paired_L2':
   Ppair=u[pos]*(F[pos]**2+F[:N//2][::-1]**2)
   inv=np.divide(wp,Ppair,out=np.zeros_like(wp),where=Ppair>1e-280)
   Avec=(Zp*inv[:,None]).T@Zp;bv=(Zp*inv[:,None]).T@Jp
   gauge=-np.linalg.solve(Avec,bv)
  else:
   fac=1 if gauge=='psecond' else (n+1)/(n-1)
   gauge=np.array([-fac*(j+2)*(j+1)*c[idx.index(j+2)] for j in idx[:-1]])
 if gauge is None:gauge=np.zeros(len(idx)-1)
 cost=math.pi/2*np.dot(wp,np.maximum(Jp+Zp@gauge,0))
 base=math.pi/2*np.dot(wp,np.maximum(Jp,0))
 return dict(S=float(S),cost=float(cost),base=float(base),D=float(math.pi/2*np.dot(wp,Jp)),gauge=list(map(float,gauge)),coefficients=list(map(float,c)),zero_integral_check=list(map(float,wp@Zp)))
rows=[]
for n in [3,4,5,6,7,8,9]:
 fits=[calc(t,n,optimize=True) for t in [0,.5,1]]
 # Piecewise linear in lambda through fitted coefficients, not fresh per-node LP.
 xx,ww=leggauss(48);ls=(xx+1)/2;ww=ww/2
 costs=[];bases=[]
 for t in ls:
  j=0 if t<=.5 else 1;v=2*(t-.5*j)
  gauge=(1-v)*np.array(fits[j]['gauge'])+v*np.array(fits[j+1]['gauge'])
  out=calc(t,n,gauge=gauge);costs.append(out['cost']);bases.append(out['base'])
 rows.append(dict(n=n,fits=fits,gauged_budget_ratio=float(2*np.dot(ww,costs)/fits[-1]['S']),original_budget_ratio=float(2*np.dot(ww,bases)/fits[-1]['S'])))
print(json.dumps(dict(N=N,a=a,Lambda=1,scope='Floating LP and quadrature diagnostic; fitted gauge integrals must still be interval-certified.',rows=rows),indent=2))
