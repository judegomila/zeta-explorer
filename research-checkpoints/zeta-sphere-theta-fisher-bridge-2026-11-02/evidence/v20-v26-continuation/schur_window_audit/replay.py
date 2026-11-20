# Independently authored Arb replay from the mathematical H6 moment/quadrature specification.
# Does not import or execute acquired source code.
import sys,json,math
from fractions import Fraction as Q
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=256
P=[[Q(0),Q(-12),Q(8)]]
for j in range(14):
 p=P[-1];r=[Q(0)]*(len(p)+1)
 for k,c in enumerate(p):r[k]+=(Q(1,2)+2*k)*c;r[k+1]-=2*c
 P.append(r)
def A(q):return arb(q.numerator)/q.denominator if isinstance(q,Q) else arb(q)
C=[sum(map(abs,p)) for p in P]
# n>=7, z>=3n²; h exponential <=z^.25. Polynomial bound Cj z^(j+2).
tails=[]
for j,c in enumerate(C):
 r=A(Q(8,7))**(2*j+Q(9,2))*(-arb(45)).exp();assert r<1
 tails.append(A(c)*arb(147)**A(Q(4*j+9,4))*(-arb(147)).exp()/(1-r))
def hor(p,x):
 y=arb(0)
 for c in reversed(p):y=y*x+A(c)
 return y
def jets(h):
 out=[arb(0) for _ in range(15)]
 for n in range(1,7):
  z=arb.pi()*n*n*(2*h).exp();fac=(h/2-z).exp();mid=z.mid()
  for j,p in enumerate(P):
   der=[k*p[k] for k in range(1,len(p))]
   out[j]+=fac*(hor(p,mid)+(z-mid)*hor(der,z))
 return [v+arb(0,t.upper()) for v,t in zip(out,tails)]

def evaluate(lo,hi):
 h=arb(A((lo+hi)/2),A((hi-lo)/2));d=jets(h);qs=[]
 for n in range(6):
  qs.append(sum(((-1)**(n+j)*math.comb(2*n,j)*d[j]*d[2*n-j] for j in range(2*n+1)),arb(0))/(d[0]*d[0]))
 den=qs[1]*qs[3]-qs[2]**2
 if not den>0:return None
 return qs[5]-(qs[3]**3-2*qs[2]*qs[3]*qs[4]+qs[1]*qs[4]**2)/den
counts=[]
for lo,hi,target in [(Q(0),Q(1,10),-2000000000),(Q(1,10),Q(1,8),0),(Q(3,20),Q(1,5),3000000000)]:
 stack=[(lo,hi)];num=0;low=None
 while stack:
  l,r=stack.pop();v=evaluate(l,r)
  if v is not None and v>target:
   num+=1;low=v.lower() if low is None else min(low,v.lower())
  else:
   assert r-l>Q(1,10**7),(l,r,str(v));m=(l+r)/2;stack.extend([(l,m),(m,r)])
 counts.append({'region':[str(lo),str(hi)],'target':target,'accepted_cells':num,'lower':str(low)});print(counts[-1],file=sys.stderr,flush=True)
p0=jets(arb(0))[0];p2=jets(arb(1)/5)[0];ratio=(p2/p0)**2;assert ratio>arb(1)/4
print(json.dumps({'PASS':True,'regions':counts,'profile_ratio_squared':str(ratio),'tail_dependency':'Previously independently audited h5_tail_v1 establishes odd local positivity for h>=1/8'},indent=2))
