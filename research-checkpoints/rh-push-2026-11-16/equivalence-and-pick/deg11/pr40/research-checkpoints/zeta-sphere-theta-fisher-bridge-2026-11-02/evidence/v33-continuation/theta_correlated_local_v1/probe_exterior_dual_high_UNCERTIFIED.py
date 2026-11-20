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
for n in [22,24,26,28,30,32]:
 N=n//2;ep=n%2;A=mp.matrix([[mm[ep+i+j] for j in range(N)] for i in range(N)]);b=mp.matrix([mm[ep+N+i] for i in range(N)]);c=list(-mp.lu_solve(A,b))+[mp.mpf(1)]
 try:mp.cholesky(A)
 except:print('PREFIX_NUMERIC_FAIL',n,flush=True);continue
 ZZ=[[sum(c[i]*g[ep+i+k] for i in range(N+1)) for k in range(N)] for g in gg]
 FF=[sum(c[i]*c[j]*g[ep+i+j] for i in range(N+1) for j in range(N+1)) for g in gg]
 C=mp.matrix([[sum(w*r[i]*r[j] for w,r in zip(ww,ZZ)) for j in range(N)] for i in range(N)]);Wh=mp.inverse(mp.cholesky(C))
 Z=np.array([[float(sum(Wh[k,j]*ZZ[i][j] for j in range(N))*ww[i]) for i in range(len(points))] for k in range(N)])
 fw=np.array([float(f*w) for f,w in zip(FF,ww)]);wv=np.array(list(map(float,ww)))
 res=linprog(fw/max(abs(fw)),A_eq=np.vstack([wv,Z]),b_eq=np.r_[1,np.zeros(N)],bounds=(0,None),method='highs',options={'dual_feasibility_tolerance':1e-9,'primal_feasibility_tolerance':1e-9})
 print('UNCERTIFIED',n,'localmin',mp.nstr(min(FF),12),'lp',res.success,flush=True)
 if res.success:
  ids=np.where(res.x*wv>1e-25)[0];print('atoms',len(ids),'floatobj',fw@res.x,flush=True)
  if len(ids)==N+1:
   exact=mp.lu_solve(mp.matrix([[1 for i in ids]]+[[ZZ[i][j] for i in ids] for j in range(N)]),mp.matrix([1]+[0]*N));obj=sum(exact[k]*FF[i] for k,i in enumerate(ids));print('refined',mp.nstr(obj,30),'minweight',mp.nstr(min(exact),15),flush=True)
   if obj<0 and min(exact)>0:print('NEGATIVE_CANDIDATE',n,[(str(points[i]),mp.nstr(exact[k],50)) for k,i in enumerate(ids)],flush=True)
