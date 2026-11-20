"""Falsification probe only. Truncated theta, uncertified quadrature and LP."""
import sys,mpmath as mp,numpy as np,json
from scipy.special import roots_legendre
from scipy.optimize import linprog
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,ctx
mp.mp.dps=140;ctx.prec=640;ctx.cap=65
h=arb_series([0,1],65)
def gs(u):
 z=arb.pi()*(2*arb(str(u))).exp();Z=z*(2*h).exp();r=arb_series([0],65)
 for n in range(2,10):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 ell=h/2+(2*Z-3).log()+Z.log()-Z+(1+r).log()
 ex=arb_series([2*ell[j] if j>0 and j%2==0 else arb(0) for j in range(65)],65).exp()
 return [mp.mpf((ex[2*j]*((-1)**j*mp.factorial(2*j))).mid().str(155,radius=False))/mp.mpf(400)**j for j in range(33)]
def rule(n):
 xx,_=roots_legendre(n);out=[]
 for x in xx:
  t=mp.mpf(str(x))
  for _ in range(5):
   p0=mp.mpf(1);p1=t
   for k in range(2,n+1):p0,p1=p1,((2*k-1)*t*p1-(k-1)*p0)/k
   der=n*(t*p1-p0)/(t*t-1);t-=p1/der
  wt=2/((1-t*t)*der*der);out.append(((t+1)*mp.mpf('1.5'),wt*mp.mpf('1.5')))
 return out
def bw(u):
 z=mp.pi*mp.exp(2*u);psi=4*mp.exp(u/2)*sum((2*(n*n*z)**2-3*n*n*z)*mp.exp(-n*n*z) for n in range(1,10))
 return 2*u*u*psi*psi*(mp.sinh(2*u)/(2*u) if u else 1)
quad=rule(240);qg=[gs(u) for u,w in quad];qw=[w*bw(u) for u,w in quad];mass=sum(qw)
mm=[sum(w*g[j] for w,g in zip(qw,qg))/mass for j in range(32)]
points=[mp.mpf(0)]+[mp.mpf(k)/200 for k in range(1,401)];gg=[gs(u) for u in points];ww=[mp.mpf('1e-5')]+[bw(u)/200/mass for u in points[1:]]

def primal_lp(V,ff,weights):
 d=V.rows;active=list(range(V.cols));w=list(weights)
 while len(active)>d:
  ids=active[:d+1];B=V[:,ids[:d]] if False else mp.matrix([[V[i,j] for j in ids[:d]] for i in range(d)])
  v=list(-mp.lu_solve(B,mp.matrix([V[i,ids[-1]] for i in range(d)])))+[mp.mpf(1)]
  if sum(ff[j]*v[k] for k,j in enumerate(ids))>0:v=[-x for x in v]
  ratios=[(w[j]/(-v[k]),k,j) for k,j in enumerate(ids) if v[k]<0];step,kout,jout=min(ratios)
  for k,j in enumerate(ids):w[j]+=step*v[k]
  active.remove(jout);w[jout]=0
 basis=active;rhs=mp.matrix([1]+[0]*(d-1))
 for iteration in range(2000):
  B=mp.matrix([[V[i,j] for j in basis] for i in range(d)]);Bi=B**-1;wb=Bi*rhs;dual=mp.matrix([[ff[j] for j in basis]])*Bi
  reduced=[ff[j]-sum(dual[i]*V[i,j] for i in range(d)) for j in range(V.cols)]
  scale=max(abs(x) for x in ff)
  eligible=[j for j in range(V.cols) if j not in basis and reduced[j]<-mp.mpf('1e-75')*scale]
  if not eligible:return basis,wb,sum(ff[j]*wb[k] for k,j in enumerate(basis)),iteration
  enter=min(eligible,key=lambda j:reduced[j]);direction=Bi*mp.matrix([V[i,enter] for i in range(d)])
  choices=[(wb[k]/direction[k],k) for k in range(d) if direction[k]>mp.mpf('1e-100')]
  if not choices:raise ValueError('unbounded')
  _,leave=min(choices);basis[leave]=enter
 raise ValueError('iterations')
for n in [24,26,28,30,32]:
 N=n//2;A=mp.matrix([[mm[i+j] for j in range(N)] for i in range(N)]);b=mp.matrix([mm[N+i] for i in range(N)]);c=list(-mp.lu_solve(A,b))+[mp.mpf(1)]
 ZZ=[[sum(c[i]*g[i+k] for i in range(N+1)) for k in range(N)] for g in qg]
 FF=[sum(c[i]*c[j]*g[i+j] for i in range(N+1) for j in range(N+1)) for g in qg]
 ww=[w/mass for w in qw];C=mp.matrix([[sum(w*r[i]*r[j] for w,r in zip(ww,ZZ)) for j in range(N)] for i in range(N)]);Wh=mp.inverse(mp.cholesky(C))
 V=mp.matrix([[1 for g in qg]]+[[sum(Wh[k,j]*ZZ[i][j] for j in range(N)) for i in range(len(qg))] for k in range(N)])
 ids,weights,obj,it=primal_lp(V,FF,ww)
 print('UNCERTIFIED_HIGH_PRECISION_LP',n,mp.nstr(obj,35),'minweight',mp.nstr(min(weights),15),'iterations',it,flush=True)
 if obj<0 and min(weights)>0:print('NEGATIVE_CANDIDATE',n,[(mp.nstr(quad[j][0],60),mp.nstr(weights[k],60)) for k,j in enumerate(ids)],flush=True)
