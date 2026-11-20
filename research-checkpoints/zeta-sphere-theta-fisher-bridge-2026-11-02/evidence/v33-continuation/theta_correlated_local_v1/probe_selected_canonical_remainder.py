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
 return [mp.mpf((ex[2*j]*((-1)**j*mp.factorial(2*j))).mid().str(110,radius=False))/mp.mpf(400)**j for j in range(20)]
g=gs(0)
for n in range(1,20):
 ep=n%2;N=n//2
 A=mp.matrix([[ms[ep+i+j] for j in range(N)] for i in range(N)]) if N else None
 b=mp.matrix([ms[ep+N+i] for i in range(N)]) if N else None
 c=list(-mp.lu_solve(A,b)) if N else []
 c+=[mp.mpf(1)]
 val=sum(c[i]*c[j]*g[ep+i+j] for i in range(N+1) for j in range(N+1))
 print(n,mp.nstr(val,20))
