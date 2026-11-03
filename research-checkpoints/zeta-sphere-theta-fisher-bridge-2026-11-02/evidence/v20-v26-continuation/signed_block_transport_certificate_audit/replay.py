"""Own-source endpoint-block Arb certificate; no path positivity assertion."""
import sys,json,time,math
from fractions import Fraction
from pathlib import Path
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,arb_mat,ctx
ctx.prec=160
N=int(sys.argv[1]) if len(sys.argv)>1 else 3072
n=int(sys.argv[2]) if len(sys.argv)>2 else 9
assert N%24==0 and n in (7,9)
idx=list(range(1,n+1,2));m=len(idx);scale=[100**i for i in range(m)];sgn=[(-1)**((n-j)//2) for j in idx];order=n+4
pi=arb.pi();dh=arb(3)/N;a=arb(1)/4;tail=arb(0,arb('1e-100'));err=arb(0,arb('1e-95'))
P=[[Fraction(0),Fraction(-3),Fraction(2)]]
for _ in range(order):
 q=[Fraction(0)]*(len(P[-1])+1)
 for k,c in enumerate(P[-1]):q[k]+=(Fraction(1,2)+2*k)*c;q[k+1]-=2*c
 P.append(q)
assert max(sum(map(abs,p)) for p in P)<10**16
P=[[arb(c.numerator)/c.denominator for c in p] for p in P]
assert 4*10**16*arb(363)**16*(-arb(363)).exp()/(1-arb('1e-18'))<arb('1e-95')
def ps(u):
 out=[arb(0) for _ in P];z0=pi*(2*u).exp()
 for nn in range(1,11):
  z=z0*nn*nn;e=4*(u/2-z).exp()
  for j in range(order+1):
   v=P[j][-1]
   for c in reversed(P[j][:-1]):v=v*z+c
   out[j]+=e*v
 return [v+err for v in out]
def gj(u,p,lam,sign):
 x=sign*u;r=a+2*lam*x;ex=(a*x+lam*u*u).exp();E=[arb(1),r]
 for j in range(2,order+1):E.append(r*E[-1]+2*(j-1)*lam*E[-2])
 return [ex*sum((math.comb(j,k)*E[j-k]*p[k]*sign**k for k in range(j+1)),arb(0)) for j in range(order+1)]
t=time.time();points=[];ranges=[]
for k in range(2*N+1):
 u=arb(3)*k/(2*N);points.append((u,ps(u)))
for k in range(N):
 u=arb(arb(3)*(2*k+1)/(2*N),arb(3)/(2*N));raw=ps(u);mid=points[2*k+1][1];d=arb(0,arb(3)/(2*N));dp=[arb(1),d,d*d,d*d*d,d*d*d*d]
 for j in range(n+1):raw[j]=sum((mid[j+r]*dp[r]/math.factorial(r) for r in range(4)),arb(0))+raw[j+4]*dp[4]/24
 ranges.append((u,raw))
print('precomputed',time.time()-t,flush=True,file=sys.stderr)
pairs=[(i,j) for i in range(m) for j in range(i,m)]
def fourth(u,g,h,i,j):
 def one(v):return u*sum((math.comb(4,k)*v[i+k]*v[j+4-k] for k in range(5)),arb(0))+4*sum((math.comb(3,k)*v[i+k]*v[j+3-k] for k in range(4)),arb(0))
 return one(g)-one([(-1)**k*v for k,v in enumerate(h)])
def integrate_gram(lam):
 pd=[(u,gj(u,p,lam,1),gj(u,p,lam,-1)) for u,p in points]
 rd=[(u,gj(u,p,lam,1),gj(u,p,lam,-1)) for u,p in ranges]
 vals=[[sgn[i]*sgn[j]*u*(g[idx[i]]*g[idx[j]]-h[idx[i]]*h[idx[j]])/(scale[i]*scale[j]) for i,j in pairs] for u,g,h in pd]
 sums=[arb(0) for _ in pairs]
 for k,(u,g,h) in enumerate(rd):
  for z,(i,j) in enumerate(pairs):
   v=dh*(vals[2*k][z]+4*vals[2*k+1][z]+vals[2*k+2][z])/6
   rad=abs(fourth(u,g,h,idx[i],idx[j]))*dh**5/(2880*scale[i]*scale[j]);sums[z]+=v+arb(0,rad.upper())
 H=[[arb(0) for _ in idx] for _ in idx]
 for v,(i,j) in zip(sums,pairs):H[i][j]=H[j][i]=v+tail
 return H,pd,rd
def solve(H):
 A=[row[:-1] for row in H[:-1]];b=arb_mat([[-row[-1]] for row in H[:-1]])
 L=[[arb(int(i==j)) for j in range(m-1)] for i in range(m-1)];D=[]
 for i in range(m-1):
  d=A[i][i]-sum((L[i][k]*L[i][k]*D[k] for k in range(i)),arb(0));assert d>0,('LDL',i,str(d));D.append(d)
  for j in range(i+1,m-1):L[j][i]=(A[j][i]-sum((L[j][k]*L[i][k]*D[k] for k in range(i)),arb(0)))/d
 c=arb_mat(A).solve(b,algorithm='precond');y=[c[i,0] for i in range(m-1)]+[arb(1)]
 assert all(abs(x)<10**10 for x in y)
 return y,D
edges=[0,N//24,N//12,N//6,N//3,2*N//3,N]
def local_energies(y,pd,rd):
 def fj(g):return [sum((y[i]*sgn[i]*g[idx[i]+r]/scale[i] for i in range(m)),arb(0)) for r in range(5)]
 vals=[]
 for u,g,h in pd:
  f=fj(g)[0];fm=fj(h)[0];vals.append(u*(f*f-fm*fm))
 blocks=[arb(0) for _ in range(6)];j=0
 for k,(u,g,h) in enumerate(rd):
  if k==edges[j+1]:j+=1
  f=fj(g);fm=fj(h);rad=abs(fourth(u,f,fm,0,0))*dh**5/2880
  blocks[j]+=dh*(vals[2*k]+4*vals[2*k+1]+vals[2*k+2])/6+arb(0,rad.upper())
 return blocks+[tail]
rows=[]
for lam in (0,1):
 H,pd,rd=integrate_gram(arb(lam));y,D=solve(H);blocks=local_energies(y,pd,rd);S=sum(blocks,arb(0));schur=H[-1][-1]+sum((y[i]*H[i][-1] for i in range(m-1)),arb(0))
 assert S.overlaps(schur)
 rows.append(dict(lam=lam,coefficients=list(map(str,y)),ldl=list(map(str,D)),blocks=list(map(str,blocks)),terminal=str(S),schur=str(schur)))
 if lam==0:B0=blocks
 else:B1=blocks
 print('endpoint',lam,'S',S,'elapsed',time.time()-t,flush=True,file=sys.stderr)
reserve=sum(((x+y-abs(x-y))/2 for x,y in zip(B0,B1)),arb(0))
budget=sum((((y-x)+abs(y-x))/2 for x,y in zip(B0,B1)),arb(0))
assert reserve>arb(3)/1000 if n==9 else reserve>0
result=dict(n=n,N=N,normalization=f'physical energies divided by {scale[-1]**2}; common pi/2 omitted',edges=['0','1/8','1/4','1/2','1','2','3','infinity'],reserve=str(reserve),reserve_lower=str(reserve.lower()),terminal1_lower=str(sum(B1,arb(0)).lower()),budget_upper=str(budget.upper()),PASS=bool(reserve>0),seconds=time.time()-t,rows=rows)
print(json.dumps(result,indent=2))
