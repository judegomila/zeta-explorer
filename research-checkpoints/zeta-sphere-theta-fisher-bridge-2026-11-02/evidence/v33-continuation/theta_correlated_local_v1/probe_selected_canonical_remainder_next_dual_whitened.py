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
points=[(mp.mpf(k)+mp.mpf('.5'))/100 for k in range(140)]
FF=[];ZZ=[];weights=[]
for u in points:
 g=gs(u)
 ZZ.append([sum(c[i]*g[i+k] for i in range(N+1)) for k in range(N)])
 FF.append(sum(c[i]*c[j]*g[i+j] for i in range(N+1) for j in range(N+1)))
 z=mp.pi*mp.exp(2*u)
 psi=4*mp.exp(u/2)*sum((2*(n*n*z)**2-3*n*n*z)*mp.exp(-n*n*z) for n in range(1,9))
 weights.append(2*u*u*psi*psi/100/ms[0])
C=mp.matrix([[sum(w*row[i]*row[j] for w,row in zip(weights,ZZ)) for j in range(N)] for i in range(N)])
Wh=mp.inverse(mp.cholesky(C))
Z=np.array([[float(sum(Wh[k,j]*ZZ[i][j] for j in range(N))*weights[i]) for i in range(len(points))] for k in range(N)])
fw=np.array([float(f*w) for f,w in zip(FF,weights)]);w=np.array(list(map(float,weights)))
res=linprog(fw/max(abs(fw)),A_eq=np.vstack([w,Z]),b_eq=np.r_[1,np.zeros(N)],bounds=(0,None),method='highs',options={'dual_feasibility_tolerance':1e-9,'primal_feasibility_tolerance':1e-9})
print('UNCERTIFIED whitened',res.message)
if res.success:
 mass=res.x*w;ids=np.where(mass>1e-30)[0]
 print('objective',sum(mass[i]*float(FF[i]) for i in ids),'atoms',[(float(points[i]),float(mass[i])) for i in ids])
 print('whitened residual',max(abs(Z@res.x)))
 if len(ids)==N+1:
  AA=mp.matrix([[1 for i in ids]]+[[ZZ[i][j] for i in ids] for j in range(N)])
  ww=mp.lu_solve(AA,mp.matrix([1]+[0]*N))
  print('high precision corrected weights',list(map(str,ww)))
  print('corrected objective',sum(ww[k]*FF[i] for k,i in enumerate(ids)))
