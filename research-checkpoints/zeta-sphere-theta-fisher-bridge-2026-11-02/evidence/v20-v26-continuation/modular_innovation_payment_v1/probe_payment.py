"""Own-source finite original-theta sanity check only; not a certificate."""
import math,json
import numpy as np
from numpy.polynomial import Polynomial as Poly
from numpy.polynomial.legendre import leggauss
Q=1200;a=.25;lam=0;maxN=5
x,w=leggauss(Q);h=1.5*(x+1);wh=1.5*w
u=np.r_[-h[::-1],h];wt=np.r_[wh[::-1],wh];J=len(h)
P=[Poly([0,-3,2])]
for j in range(maxN+2):P.append(.5*P[-1]+2*Poly([0,1])*(P[-1].deriv()-P[-1]))
z=math.pi*np.arange(1,11)[:,None]**2*np.exp(2*abs(u))[None,:];ee=4*np.exp(abs(u)[None,:]/2-z)
psi=np.array([np.sum(ee*p(z),axis=0)*np.where(u>=0,1,(-1)**j) for j,p in enumerate(P)])
g=np.array([np.exp(a*u)*sum(math.comb(j,k)*a**(j-k)*psi[k] for k in range(j+1)) for j in range(maxN+3)])
Fs=[];Ds=[];Ts=[];ss=[]
for n in range(maxN+2):
 idx=list(range(n%2,n+1,2));sg=np.array([(-1)**((n-j)//2) for j in idx]);v=g[idx]*sg[:,None];sc=np.sqrt((v*v)@wt);vs=v/sc[:,None];H=(vs*(wt*u))@vs.T
 co=np.r_[-np.linalg.solve(H[:-1,:-1],H[:-1,-1]),1.];c=co/sc*sc[-1]
 F=c@v;der=sum(cj*sj*g[j+1] for cj,sj,j in zip(c,sg,idx));T=np.zeros(n+1)
 for cj,sj,j in zip(c,sg,idx):T[j]=cj*sj
 Fs.append(F);Ds.append(der);Ts.append(Poly(T));ss.append(np.dot(wt*u,F*F))
rows=[]
for N in [2,4,5]:
 assert min(ss[:N+1])>0
 roots=np.sqrt(ss[:N+1]);Y=np.array([Fs[j]/roots[j] for j in range(N+1)]);DY=np.array([Ds[j]/roots[j] for j in range(N+1)])
 def coord(p):
  p=Poly(p.coef.copy());out=np.zeros(N+1)
  for j in range(N,-1,-1):
   v=p.coef[j] if len(p.coef)>j else 0
   out[j]=v*roots[j];p=p-out[j]*Ts[j]/roots[j]
  return out
 R=np.array([coord(Ts[j](Poly([2*a,-1]))/roots[j]) for j in range(N+1)])
 Zpoly=Ts[N+1]/roots[N]
 rr=coord(Zpoly(Poly([2*a,-1]))-(-1)**(N+1)*Zpoly)
 kap=4*a*N+np.dot(rr[:-1],rr[:-1])/(4*a)
 idx=list(range((N+1)%2,N,2));V=Y[idx]
 side=[]
 for minus in [False,True]:
  sl=slice(None,J) if minus else slice(J,None)
  F=Y[N,sl][::-1] if minus else Y[N,sl]
  src=DY[N,sl][::-1] if minus else DY[N,sl]
  vv=V[:,sl][:,::-1] if minus else V[:,sl]
  dv=DY[idx,sl][:,::-1] if minus else DY[idx,sl]
  A=(vv*(wh*h))@vv.T;c=vv@(wh*h*src);b=vv@(wh*h*h*F)
  alpha=np.linalg.solve(A,c);delta=np.dot(wh*h,src*src)-c@alpha
  mu=np.dot(wh*h,F*F);nu=np.dot(wh*h**3,F*F)-b@np.linalg.solve(A,b)
  # Plus-side prefix-only integration by parts; physical source at minus carries extra minus.
  cipb=-(vv+dv*h)@(wh*F) if not minus else (vv-dv*h)@(wh*F)
  m=mu+c@np.linalg.solve(A,b) if not minus else mu-c@np.linalg.solve(A,b)
  rrs=[1,3,5]
  BB=np.array([vv@(wh*h**(q+1)*F) for q in rrs]).T
  NN=np.array([[np.dot(wh*h**(q+r+1),F*F) for r in rrs] for q in rrs])-BB.T@np.linalg.solve(A,BB)
  moments=np.array([(q+1)/2*np.dot(wh*h**q,F*F) for q in rrs])
  LL=moments+alpha@BB if not minus else moments-alpha@BB
  duals=[float(LL[:k]@np.linalg.solve(NN[:k,:k],LL[:k])) for k in [1,2,3]]
  side.append(dict(duals=duals,A=A,c=c,alpha=alpha,delta=delta,mu=mu,nu=nu,witness=m*m/nu,ipb_error=float(np.max(abs(c-cipb)))))
 pp,mm=side;AA=pp['A']-mm['A'];diff=mm['alpha']-pp['alpha'];K=mm['A']+mm['A']@np.linalg.solve(AA,mm['A']);feedback=diff@K@diff
 Gmod=np.eye(N+1)+R.T@R
 Zplus=Fs[N+1][J:]/roots[N]
 boundary=2*np.dot(wh*h*np.exp(-4*a*h),Zplus*(Gmod[-1]@Y[:,J:]))
 Ym=Y[:,:J][:,::-1];Zm=Fs[N+1][:J][::-1]/roots[N];Vm=Ym[idx];eps=(-1)**(N+1)
 ell=R[-1].copy();ell[-1]+=(-1)**N
 HH=(Ym*(wh*h))@Ym.T;PP=(Ym*wh)@Ym.T
 ww=R.T@rr
 comm_integral=4*a*np.trace(HH)-2*ww@HH[:,-1]
 lzero=ell.copy();lzero[-1]-=2*(-1)**N
 Xmat=np.zeros((N+1,N+1))
 for j in range(N): Xmat[j,j+1]=roots[j+1]/roots[j];Xmat[j+1,j]=-roots[j+1]/roots[j]
 tt=PP[-1]@(lzero+(-1)**N*np.eye(N+1)[-1])-HH[-1]@Xmat.T@lzero-Xmat[-1]@HH@ell
 prefix_back=2*(-1)**N*tt-2*rr@HH@ell
 UU=ell@Ym;QQ=rr@Ym
 bu=Vm@(wh*h*UU);az=np.linalg.solve(mm['A'],Vm@(wh*h*Zm))
 nuu=np.dot(wh*h,UU*UU)-bu@np.linalg.solve(mm['A'],bu)
 center=2*(eps*np.dot(az,bu)+np.dot(wh*h,QQ*UU))
 back_lower=-center-2*math.sqrt(max(0,mm['delta']*nuu))
 cost=kap*mm['mu'];surplus=pp['delta']-mm['delta']-feedback
 rows.append(dict(N=N,commutator_integral=comm_integral,commutator_over_cost=comm_integral/cost,prefix_boundary=-prefix_back,integrated_feedback_lower=back_lower,integrated_feedback_lower_over_cost=back_lower/cost,feedback_test_nu=nuu,boundary_feedback=boundary,boundary_over_cost=boundary/cost,kappa=kap,mu_plus=pp['mu'],mu_minus=mm['mu'],normalization=pp['mu']-mm['mu'],next_delta_plus=pp['delta'],next_delta_minus=mm['delta'],feedback=feedback,next_surplus=surplus,true_next_ratio=ss[N+1]/ss[N],prefix_witness_plus=pp['witness'],prefix_multi_witnesses=pp['duals'],multi_strong_payment_lowers=[v-mm['delta']-feedback-cost for v in pp['duals']],modular_cost=cost,witness_over_cost=pp['witness']/cost,surplus_over_cost=surplus/cost,strong_payment_lower=pp['witness']-mm['delta']-feedback-cost,max_ipb_error=max(pp['ipb_error'],mm['ipb_error'])))
print(json.dumps(dict(scope='Floating original theta, a=.25, lambda0, finite already-verified rungs only; no interval/tail certificate',Q=Q,rows=rows),indent=2))
