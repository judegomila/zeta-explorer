"""Own-source floating Gauss-Legendre diagnostic, NOT certified."""
import math,json
import numpy as np
from numpy.polynomial import Polynomial as Poly
from numpy.polynomial.legendre import leggauss
N=1600;Nlam=80;maxn=7;a=.25
x,wt=leggauss(N);u=3*x;wt=3*wt
P=[Poly([0,-3,2])]
for j in range(maxn):P.append(.5*P[-1]+2*Poly([0,1])*(P[-1].deriv()-P[-1]))
z=math.pi*np.arange(1,11)[:,None]**2*np.exp(2*abs(u))[None,:]
e=4*np.exp(abs(u)[None,:]/2-z)
psi=np.array([np.sum(e*p(z),axis=0)*np.where(u>=0,1,(-1)**j) for j,p in enumerate(P)])
def calc(lam,n):
 r=a+2*lam*u;exp=np.exp(a*u+lam*u*u)
 E=[sum(math.factorial(j)/(math.factorial(m)*math.factorial(j-2*m))*lam**m*r**(j-2*m) for m in range(j//2+1)) for j in range(n+1)]
 g=np.array([exp*sum(math.comb(j,k)*E[j-k]*psi[k] for k in range(j+1)) for j in range(n+1)])
 idx=list(range(n%2,n+1,2));sign=np.array([(-1)**((n-j)//2) for j in idx]);v=g[idx]*sign[:,None]
 H=(v*(wt*u)[None,:])@v.T*math.pi/2
 A=H[:-1,:-1];b=H[:-1,-1];c=np.r_[-np.linalg.solve(A,b),1.] if len(A) else np.ones(1)
 F=c@v;K=sum(cj*sg*j*g[j-1] for cj,sg,j in zip(c,sign,idx) if j);L=sum(cj*sg*j*(j-1)*g[j-2] for cj,sg,j in zip(c,sign,idx) if j>=2)
 S=c@H@c
 J=u**3*F*F+2*u*u*F*K
 # symmetric GL nodes; pair positive/negative before positive part
 pair=J[N//2:]+J[:N//2][::-1]
 Bpair=math.pi/2*np.dot(wt[N//2:],np.maximum(pair,0))
 F1=u*F+K;F2=u*u*F+2*u*K+L;K1=u*K+L
 G=lambda f:math.pi/2*np.dot(wt,f*f)
 B=math.sqrt(G(F1)*G(F2))+math.sqrt(G(K)*G(K1))
 D=math.pi/2*np.dot(wt,J)
 return S,B,Bpair,D,float(np.linalg.eigvalsh(A).min()) if len(A) else None
xl,wl=leggauss(Nlam);lam=(xl+1)/2;wl=wl/2
rows=[]
for n in [2,3,4,5,6,7]:
 vals=np.array([calc(t,n)[:4] for t in lam]);end=calc(1,n);start=calc(0,n)
 rows.append(dict(n=n,S0=start[0],S1=end[0],generic_budget_ratio=2*np.dot(wl,vals[:,1])/end[0],paired_budget_ratio=2*np.dot(wl,vals[:,2])/end[0],paired_paid_lower=end[0]-2*np.dot(wl,vals[:,2]),signed_identity_error=end[0]-2*np.dot(wl,vals[:,3])-start[0],min_sampled_lower_eigenvalue=min(calc(t,n)[4] for t in [0,.25,.5,.75,1])))
print(json.dumps(dict(N=N,Nlambda=Nlam,a=a,Lambda=1,scope='Floating ten-orbit |u|<=3 diagnostic only. No rigorous quadrature/tail or positive-block path certificate.',rows=rows),indent=2))
