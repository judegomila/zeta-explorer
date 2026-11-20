"""UNCERTIFIED falsification only; existing moment midpoints, truncated orbit jets."""
import json,sys,mpmath as mp
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_series,ctx
ctx.prec=384;ctx.cap=41;mp.mp.dps=100
raw=json.load(open('/workspace/shared/zeta_sphere_campaign/full_split_audit/actual_total_certificate.json'))['moments']
ms=[sum(map(mp.mpf,x))/(2*mp.mpf(400)**j) for j,x in enumerate(raw)]
h=arb_series([0,1],41)
def gs(u):
 z=arb.pi()*(2*arb(str(u))).exp();Z=z*(2*h).exp()
 r=arb_series([0],41)
 for n in range(2,9):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 ell=h/2+(2*Z-3).log()+Z.log()-Z+(1+r).log()
 ex=arb_series([2*ell[j] if j>0 and j%2==0 else arb(0) for j in range(41)],41).exp()
 return [mp.mpf((ex[2*j]*((-1)**j*mp.factorial(2*j))).mid().str(110,radius=False))/mp.mpf(400)**j for j in range(21)]
import numpy as np
from scipy.optimize import linprog
n=20;ep=0;N=10
A=mp.matrix([[ms[i+j] for j in range(N)] for i in range(N)])
b=mp.matrix([ms[N+i] for i in range(N)])
c=list(-mp.lu_solve(A,b))+[mp.mpf(1)]
points=[mp.mpf(k)/100 for k in range(151)]
f=[];Z=[]
for u in points:
 g=gs(u)
 Z.append([float(sum(c[i]*g[i+k] for i in range(N+1))) for k in range(N)])
 f.append(float(sum(c[i]*c[j]*g[i+j] for i in range(N+1) for j in range(N+1))))
Z=np.array(Z).T; f=np.array(f);scale=np.max(np.abs(Z),axis=1)
# restrict huge-tail range, which otherwise masks low-point constraints
for end in [70,90,110,151]:
 ZZ=Z[:,:end];ff=f[:end];sc=np.max(np.abs(ZZ),axis=1)
 res=linprog(ff/max(abs(ff)),A_eq=np.vstack([np.ones(end),ZZ/sc[:,None]]),b_eq=np.r_[1,np.zeros(N)],bounds=(0,None),method='highs',options={'dual_feasibility_tolerance':1e-9,'primal_feasibility_tolerance':1e-9})
 print('UNCERTIFIED range',end,'status',res.message)
 if res.success:
  ids=np.where(res.x>1e-7)[0]
  print('objective',float(ff@res.x),'atoms',[(float(points[i]),float(res.x[i])) for i in ids])
  print('relative constraint residual',max(abs(ZZ@res.x)/sc))
print('scaled c',list(map(str,c)))
