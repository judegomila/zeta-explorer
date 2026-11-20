"""Uncertified falsification probe. Existing certified prefix midpoints only."""
import json, re, numpy as np
from scipy.optimize import linprog
base='/workspace/shared/zeta_sphere_campaign/theta_correlated_local_v1/'
src=open(base+'check_degree7_regional_payment.py').read().split('sums=')[0]
src=src.replace('if not derivative:return [weight*v for v in g]','if not derivative:return g')
exec(src)
def midpoint(d):
 return sum(float(re.search(r'\[?([-+0-9.e]+)',d[x]).group(1)) for x in ['lo','hi'])/2
j=json.load(open(base+'degree7_regional_payment_4000.json'))
m={k:sum(midpoint(j['regions'][r]['moments'][str(k)]) for r in ['core','tail'])/100**k for k in range(1,8)}
N=3; ep=1
A=np.array([[m[ep+i+k] for k in range(N)] for i in range(N)])
bb=np.array([m[ep+N+i] for i in range(N)])
c=np.r_[-np.linalg.solve(A,bb),1]
points=np.linspace(0,1.2,121)
grid=[]
for u in points:
 g=calc(arb(str(u)),False)
 grid.append([float(g[k].mid())/100**k for k in range(8)])
G=[np.array([[g[ep+i+k] for k in range(N+1)] for i in range(N+1)]) for g in grid]
Z=np.array([(a@c)[:N] for a in G]).T
f=np.array([c@a@c for a in G])
scale=np.maximum(np.max(np.abs(Z),axis=1),1e-100)
res=linprog(f,A_eq=np.vstack([np.ones(len(points)),Z/scale[:,None]]),b_eq=np.r_[1,np.zeros(N)],bounds=(0,None),method='highs')
print('UNCERTIFIED selected scaled coefficients',c)
print('pointwise minimum',min(f),'at',points[np.argmin(f)])
print('LP status',res.message)
if res.success:
 ids=np.where(res.x>1e-7)[0]
 print('dual objective',res.fun,'atoms',[(float(points[i]),float(res.x[i])) for i in ids])
 print('constraint residual',Z@res.x)
