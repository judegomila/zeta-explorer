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
B=[[Q(1)],[Q(-47,66),Q(1,66)],[Q(6419,10500),Q(-551,21000),Q(1,10500)],[Q(-1557845,2875000),Q(98976,2875000),Q(-2813,11500000),Q(1,2875000)]]
def conv(p,q):
 out=[Q(0)]*(len(p)+len(q)-1)
 for i,a in enumerate(p):
  for j,b in enumerate(q):out[i+j]+=a*b
 return out
co=[[conv(p,q) for q in B] for p in B]
def moments(d):
 out=[]
 for n in range(7):
  m=2*n;v=[arb(0)]*3
  for j in range(m+1):
   c=(-1)**(n+j)*math.comb(m,j)
   v[0]+=c*d[j]*d[m-j]
   v[1]+=2*c*d[j+1]*d[m-j]
   v[2]+=2*c*(d[j+2]*d[m-j]+d[j+1]*d[m-j+1])
  out.append(v)
 return out
def combine(c,m,k):return sum((A(v)*m[n][k] for n,v in enumerate(c)),arb(0))
N=512;w=arb(2)/N;G=[[arb(0) for _ in range(4)] for _ in range(4)]
for cell in range(N):
 mid=arb(2*cell+1)/N;h=arb(mid,w/2);mc=moments(jets(mid));mr=moments(jets(h))
 s=arb((1+(mid.sinh()/mid).upper())/2,((mid.sinh()/mid).upper()-1)/2)
 for i in range(4):
  for j in range(i,4):
   c=co[i][j];u=combine(c,mr,0);du=combine(c,mr,1);ddu=combine(c,mr,2)
   f=2*h*h*u;fp=4*h*u+2*h*h*du;fpp=4*u+8*h*du+2*h*h*ddu
   er=w**3*8*(abs(fpp)+2*abs(fp)+abs(f))/24
   G[i][j]+=w*s*2*mid*mid*combine(c,mc,0)+arb(0,er.upper())
 if cell%64==0:print('cell',cell,flush=True,file=sys.stderr)
# h>=2, z>=150, derivative <=2 Cj e^(h/2) z^(j+2)e^-z.
# normalized weight <=2e^(3h); transform yields (4/9) C_i C_j z^(2n+5)e^-2z.
ht=[]
for n in range(7):
 coeff=sum(Q(math.comb(2*n,j))*C[j]*C[2*n-j] for j in range(2*n+1))
 ht.append(A(Q(4,9)*coeff)*arb(150)**(2*n+5)*(-arb(300)).exp()/(2-A(Q(2*n+5,150))))
for i in range(4):
 for j in range(i,4):
  t=sum((A(abs(c))*ht[n] for n,c in enumerate(co[i][j])),arb(0));G[i][j]+=arb(0,t.upper());G[j][i]=G[i][j]
marg=[(G[i][i]-sum((abs(G[i][j]) for j in range(4) if j!=i),arb(0))).lower() for i in range(4)]
result={'matrix':[[str(v) for v in r] for r in G],'gershgorin_lower':[str(v) for v in marg],'normalization_upper':str(G[0][0].upper()),'PASS':all(v>arb(1)/60 for v in marg) and G[0][0]<arb(4)/125}
print(json.dumps(result,indent=2));assert result['PASS']
