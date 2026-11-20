"""Own-source floating diagnostic; no interval certificate, no infinite-order extrapolation."""
import math,json
import numpy as np
from numpy.polynomial import Polynomial as Poly
from numpy.polynomial.legendre import leggauss
N=1800;maxn=15;a=.25
x,wt=leggauss(N);u=3*x;wt=3*wt
P=[Poly([0,-3,2])]
for j in range(maxn+1):P.append(.5*P[-1]+2*Poly([0,1])*(P[-1].deriv()-P[-1]))
z=math.pi*np.arange(1,11)[:,None]**2*np.exp(2*abs(u))[None,:]
e=4*np.exp(abs(u)[None,:]/2-z)
psi=np.array([np.sum(e*p(z),axis=0)*np.where(u>=0,1,(-1)**j) for j,p in enumerate(P)])
def calc(lam,n):
 r=a+2*lam*u;ex=np.exp(a*u+lam*u*u)
 E=[sum(math.factorial(j)/(math.factorial(m)*math.factorial(j-2*m))*lam**m*r**(j-2*m) for m in range(j//2+1)) for j in range(n+2)]
 g=np.array([ex*sum(math.comb(j,k)*E[j-k]*psi[k] for k in range(j+1)) for j in range(n+2)])
 idx=list(range(n%2,n+1,2));sign=np.array([(-1)**((n-j)//2) for j in idx]);v=g[idx]*sign[:,None]
 scale=np.sqrt((v*v)@wt);vs=v/scale[:,None]
 H=(vs*(wt*u)[None,:])@vs.T
 co=np.r_[-np.linalg.solve(H[:-1,:-1],H[:-1,-1]),1.];c=co/scale;c*=scale[-1]
 F=c@v;K=sum(cj*sg*j*g[j-1] for cj,sg,j in zip(c,sign,idx) if j)
 Ft=sum(cj*sg*g[j+1] for cj,sg,j in zip(c,sign,idx))
 X=u*u*F+2*u*K
 G=(vs[:-1]*wt)@vs[:-1].T
 gamma=-np.linalg.solve(G,vs[:-1]@(wt*X))
 R=X+gamma@vs[:-1]
 norm=lambda f:np.sqrt(np.dot(wt,f*f))
 rp=F-np.linalg.solve(G,vs[:-1]@(wt*F))@vs[:-1]
 delta=norm(rp)**2
 alpha=np.dot(wt*rp,R)/delta
 Rp=R-alpha*rp
 signed=np.dot(wt*u,F*F)
 Up=u*F-signed/delta*rp
 pf=norm(F)**2;s=np.dot(wt*u,F*F);m=s/pf
 rho1=norm(K)/norm(F);eta=norm(R)/norm(F);um=norm(u*F)/norm(F)
 j=u*F*R;pair=j[N//2:]+j[:N//2][::-1]
 cost=np.dot(wt[N//2:],np.maximum(pair,0))
 C1=math.log(10*(n+2))+1;C2=math.log(10*(n+3))**2+1
 return dict(alpha=alpha,delta_ratio=delta/pf,conditional_cs=norm(Up)*norm(Rp),conditional_eta=norm(Rp)/norm(F),P=pf,S=s,m=m,rho1=rho1,eta=eta,um=um,tau=norm(Ft)**2/pf,cost=cost,cs=norm(u*F)*norm(R),growth_cs=C1*eta*pf,growth_envelope=C1*(C2+2*C1*rho1)*pf,orth_error=abs(np.dot(wt*u,F*(R-X)))/max(abs(s),1e-300))
xl,wl=leggauss(48);ls=(xl+1)/2;wl=wl/2
rows=[]
for n in [2,3,4,5,7,9,12,15]:
 end=calc(1,n);vals=[calc(t,n) for t in ls]
 row=dict(n=n,terminal=end)
 for k in ['cost','cs','growth_cs','growth_envelope']:
  row[k+'_ratio']=2*sum(w*d[k] for w,d in zip(wl,vals))/end['S']
 row['parent_path_ratio']=sum(w*d['P'] for w,d in zip(wl,vals))/end['P']
 row['max_orth_error']=max(d['orth_error'] for d in vals)
 rows.append(row)
print(json.dumps(dict(scope='Floating ten-orbit, |u|<=3 diagnostic, not certified.',N=N,rows=rows),indent=2))
