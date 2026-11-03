"""Full-theta a=0 core negative subspace; exact rational witnesses and Taylor/Cauchy quadrature."""
import json,math,time
from pathlib import Path
from fractions import Fraction
import mpmath as mp
from mpmath import iv
P=Path(__file__).resolve().parent
mp.mp.dps=100;iv.dps=100
cs=[[Fraction(x) for x in row] for row in json.loads((P/'witnesses.json').read_text())]
Q=[[0,-3,2]]
for k in range(58):
 q=Q[-1];r=[0]*(len(q)+1)
 for j,c in enumerate(q):r[j]+=(1+4*j)*c;r[j+1]-=4*c
 Q.append(r)
def poly(q,z):
 s=iv.mpf(0)
 for c in reversed(q):s=s*z+c
 return s
def psi(h):
 z=iv.pi*iv.exp(2*h);pref=4*iv.exp(h/2);out=[]
 zs=[z*n*n for n in range(1,17)];es=[iv.exp(-x) for x in zs]
 for k,q in enumerate(Q):
  val=pref*sum(poly(q,x)*y for x,y in zip(zs,es))/2**k
  tail=8*iv.exp(h/2)*sum(abs(x) for x in q)*z**(k+2)*17**(2*k+4)*iv.exp(-289*z)/2**k
  out.append(val+iv.mpf([-1,1])*tail)
 return out
coeff={}
for n in range(1,20):
 for j in range(21):
  r=2*n;deg=r+j
  a=[sum((-1)**k*math.comb(r,k)*math.comb(j,t-k) for k in range(max(0,t-j),min(r,t)+1)) for t in range(deg+1)]
  coeff[n,j]=[(k,a[k]*(1 if 2*k==deg else 2)) for k in range(deg//2+1) if a[k]]
def pj(n,j,ps):return sum(c*ps[k]*ps[2*n+j-k] for k,c in coeff[n,j])
vals=[iv.mpf(0) for _ in range(20)];delta=iv.mpf(1)/1024;t=time.time()
for cell in range(64):
 h=iv.mpf(2*cell+1)/2048;ps=psi(h)
 for n in range(1,20):
  for j in range(0,21,2):
   f=2*h*h*pj(n,j,ps)
   if j:f+=j*4*h*pj(n,j-1,ps)+math.comb(j,2)*4*pj(n,j-2,ps)
   vals[n]+=(-1)**n*f*delta**(j+1)/(2**j*math.factorial(j+1))
 if cell%8==7:print('cells',cell+1,'seconds',time.time()-t,flush=True)
for n in range(1,20):
 q=iv.mpf(5)/512
 err=iv.mpf(10)**6*math.factorial(2*n)*(iv.mpf(10)/3)**(2*n)*q**21/(16*(1-q))
 vals[n]+=iv.mpf([-1,1])*err
ci=[[iv.mpf(c.numerator)/c.denominator for c in a] for a in cs]
G=[[sum(ci[a][i]*ci[b][j]*vals[i+j+1] for i in range(10) for j in range(10)) for b in range(3)] for a in range(3)]
A=[[-x for x in row] for row in G];piv=[]
for k in range(3):
 pivot=A[k][k];piv.append(pivot);assert pivot.a>0,(k,pivot)
 for i in range(k+1,3):
  for j in range(k+1,3):A[i][j]-=A[i][k]*A[k][j]/pivot

def bounds(x):return [str(mp.mpf(x.a)),str(mp.mpf(x.b))]
res={'scope':'Full theta, normalized a=0, core [0,1/16], odd degree <=19: negative index at least 3','cells':64,'Taylor_degree':20,'precision':100,'Gram':[[bounds(x) for x in row] for row in G],'negative_Gram_LDL_pivots':[bounds(x) for x in piv],'moments':[bounds(x) for x in vals],'seconds':time.time()-t}
(P/'certificate.json').write_text(json.dumps(res,indent=2));print(json.dumps(res,indent=2),flush=True)
