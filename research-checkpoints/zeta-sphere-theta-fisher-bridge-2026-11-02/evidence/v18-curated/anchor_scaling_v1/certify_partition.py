"""Validated fulltheta quarter-region moments for common-anchor scaling diagnostic."""
import sys,json,math,time
from pathlib import Path
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P.parent/'ball_dependencies'))
from flint import arb,arb_poly,ctx
ctx.prec=256
Q=[[0,-3,2]]
for k in range(58):
 r=[0]*(len(Q[-1])+1)
 for j,c in enumerate(Q[-1]):r[j]+=(1+4*j)*c;r[j+1]-=4*c
 Q.append(r)
polys=[arb_poly(q) for q in Q]
coeff={}
for n in range(1,20):
 for j in range(21):
  deg=2*n+j;a=[sum((-1)**k*math.comb(2*n,k)*math.comb(j,t-k) for k in range(max(0,t-j),min(2*n,t)+1)) for t in range(deg+1)]
  coeff[n,j]=[(k,a[k]*(1 if 2*k==deg else 2)) for k in range(deg//2+1) if a[k]]
def psi(h):
 z=arb.pi()*(2*h).exp();zs=[z*n*n for n in range(1,17)];es=[(-x).exp() for x in zs];pref=4*(h/2).exp();ps=[]
 for k,p in enumerate(polys):
  val=pref*sum(p(x)*e for x,e in zip(zs,es))/2**k
  tail=8*(h/2).exp()*sum(abs(v) for v in Q[k])*z**(k+2)*17**(2*k+4)*(-289*z).exp()/2**k
  ps.append(val+arb(0,tail.upper()))
 return ps
def jet(n,j,ps):return sum(c*ps[k]*ps[2*n+j-k] for k,c in coeff[n,j])
rows=[];start=time.time();delta=arb(1)/512
for region in range(4):
 vals=[arb(0) for _ in range(20)]
 for cell in range(region*128,(region+1)*128):
  h=arb(2*cell+1)/1024;ps=psi(h)
  for n in range(1,20):
   for j in range(0,21,2):
    f=2*h*h*jet(n,j,ps)
    if j:f+=4*j*h*jet(n,j-1,ps)+4*math.comb(j,2)*jet(n,j-2,ps)
    vals[n]+=(-1)**n*f*delta**(j+1)/(2**j*math.factorial(j+1))
 for n in range(1,20):
  q=arb(5)/256;err=arb(3)*10**6*math.factorial(2*n)*(arb(10)/3)**(2*n)*q**21/(4*(1-q));vals[n]+=arb(0,err.upper())
 def endpoints(v):return [v.lower().str(100,radius=False,more=True),v.upper().str(100,radius=False,more=True)]
 rows.append({'region':[str(region/4),str((region+1)/4)],'moments':[endpoints(v) for v in vals]})
 print('region',region,'seconds',time.time()-start,flush=True)
(P/'partition_certificate.json').write_text(json.dumps({'scope':'fulltheta a0 moments over four quarterregions of[0,1]','delta':'1/512','Taylor_degree':20,'rows':rows,'seconds':time.time()-start},indent=2))
