"""Full-theta a=0 core negative subspace; exact rational witnesses and Taylor/Cauchy quadrature."""
import json,math,time
from pathlib import Path
from fractions import Fraction
import mpmath as mp
from mpmath import iv
P=Path(__file__).resolve().parent
mp.mp.dps=100;iv.dps=100

Q=[[0,-3,2]]
for k in range(39):
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
# Independent reflected-square moment integration.
vals=[iv.mpf(0) for _ in range(20)];delta=iv.mpf(1)/256;t=time.time()
for cell in range(768):
 h=iv.mpf(2*cell+1)/512;ps=psi(h)
 sq={}
 for n in range(20):
  for j in range(21):sq[n,j]=sum(math.comb(j,k)*ps[n+k]*ps[n+j-k] for k in range(j+1))
 for n in range(20):
  for j in range(0,21,2):
   f=2*h*h*sq[n,j]
   if j:f+=4*j*h*sq[n,j-1]+4*math.comb(j,2)*sq[n,j-2]
   if n:f-=n*sq[n-1,j]
   vals[n]+=4**n*f*delta**(j+1)/(2**j*math.factorial(j+1))
 if cell%64==63:print('cells',cell+1,'seconds',time.time()-t,flush=True)
for n in range(20):
 q=iv.mpf(5)/128;r=iv.mpf(3)/10
 M=iv.mpf(10)**6*4**n*(20*math.factorial(n)**2/r**(2*n)+(n*math.factorial(n-1)**2/r**(2*n-2) if n else 0))
 err=3*M*q**21/(1-q)
 # z>=1200; integral z^p e^-2z <=1200^p e^-2400 for p<=44.
 B=sum(abs(x) for x in Q[n])/iv.mpf(2)**n
 tail=64*4**n*B**2*iv.mpf(1200)**(2*n+6)*iv.exp(-2400)
 if n:
  B0=sum(abs(x) for x in Q[n-1])/iv.mpf(2)**(n-1)
  tail+=32*n*4**n*B0**2*iv.mpf(1200)**(2*n+2)*iv.exp(-2400)
 vals[n]+=iv.mpf([-1,1])*(err+tail)
def bounds(x):return [str(mp.mpf(x.a)),str(mp.mpf(x.b))]
out={'scope':'Full theta normalized a=0 full moments via reflected identity','moments':[bounds(x) for x in vals],'seconds':time.time()-t}
(P/'actual_total_certificate.json').write_text(json.dumps(out,indent=2));print('COMPLETE',time.time()-t,flush=True)
