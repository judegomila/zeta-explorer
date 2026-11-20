"""Unvalidated high precision selected-theta diagnostic; no sign certificate."""
import mpmath as mp,numpy as np,argparse,json,time
from fractions import Fraction as F
ap=argparse.ArgumentParser();ap.add_argument('--degree',type=int,default=24);ap.add_argument('--nodes',type=int,default=240);ap.add_argument('--dps',type=int,default=90);ap.add_argument('--orbits',type=int,default=12);ap.add_argument('--output');a=ap.parse_args();mp.mp.dps=a.dps;nmax=a.degree
pp=[[F(0),F(-3),F(2)]]
for k in range(nmax):
 p=pp[-1];q=[F(0)]*(len(p)+1)
 for j,c in enumerate(p):q[j]+=(F(1,2)+2*j)*c;q[j+1]-=2*c
 pp.append(q)
pp=[[mp.mpf(c.numerator)/c.denominator for c in p] for p in pp]
def poly(p,z):
 v=p[-1]
 for c in p[-2::-1]:v=v*z+c
 return v
scale=[mp.sqrt(mp.factorial(j))*mp.mpf(5)**j for j in range(nmax+1)]
ids=[list(range(e,nmax+1,2)) for e in (0,1)]
GX=[mp.matrix(len(j)) for j in ids];GY=[mp.matrix(len(j)) for j in ids]
nodes,weights=np.polynomial.legendre.leggauss(a.nodes);start=time.monotonic()
for index,(nd,wt) in enumerate(zip(nodes,weights)):
 h=(mp.mpf(float(nd))+1)*mp.mpf('1.5');w=mp.mpf(float(wt))*mp.mpf('1.5');E=mp.exp(2*h);ds=[mp.mpf(0)]*(nmax+1)
 for m in range(1,a.orbits+1):
  z=mp.pi*m*m*E;fac=4*mp.exp(h/2-z)
  for k in range(nmax+1):ds[k]+=fac*poly(pp[k],z)
 X=[(2*h*ds[k]+(k*ds[k-1] if k else 0))/scale[k] for k in range(nmax+1)];Y=[(k*ds[k-1] if k else 0)/scale[k] for k in range(nmax+1)]
 for e in (0,1):
  js=ids[e]
  for k,i in enumerate(js):
   for l in range(k+1):
    j=js[l];GX[e][k,l]+=w*X[i]*X[j];GY[e][k,l]+=w*Y[i]*Y[j]
 if (index+1)%80==0:print('nodes',index+1,flush=True)
for e in (0,1):
 for i in range(GX[e].rows):
  for j in range(i):GX[e][j,i]=GX[e][i,j];GY[e][j,i]=GY[e][i,j]
rows=[]
for n in range(3,nmax+1):
 e=n%2;j=(n-e)//2;G=GX[e][:j,:j];H=GY[e][:j,:j];Q=G-H;bx=GX[e][:j,j];by=GY[e][:j,j];c=mp.lu_solve(G,bx);r=by-H*c;A=GX[e][j,j]-(bx.T*c)[0]
 if e:
  hinv=mp.lu_solve(H,by);u=mp.lu_solve(H,r)
 else:
  hinv=mp.matrix(j,1);u=mp.matrix(j,1)
  if j>1:
   hh=H[1:,1:];hinv[1:,:]=mp.lu_solve(hh,by[1:,:]);u[1:,:]=mp.lu_solve(hh,r[1:,:])
 B=GY[e][j,j]-(by.T*hinv)[0];delta=A-B;U=(r.T*u)[0];qq=mp.lu_solve(Q,r);C=U+(r.T*qq)[0];V=U+2*(r.T*qq)[0]+(qq.T*H*qq)[0]
 L=mp.cholesky(G);Li=L**-1;ev=mp.eigsy(Li*Q*Li.T,eigvals_only=True);rho=ev[0]
 row={'degree':n,'C/U':str(C/U),'U/(sqrt(rho)delta)':str(U/(mp.sqrt(rho)*delta)),'UV/delta2':str(U*V/delta**2),'rho':str(rho),'signed/A':str((delta-C)/A)};rows.append(row);print({k:(v if k=='degree' else mp.nstr(mp.mpf(v),14)) for k,v in row.items()},flush=True)
print('seconds',time.monotonic()-start,flush=True)
if a.output:open(a.output,'w').write(json.dumps({'args':vars(a),'rows':rows},indent=2)+'\n')
