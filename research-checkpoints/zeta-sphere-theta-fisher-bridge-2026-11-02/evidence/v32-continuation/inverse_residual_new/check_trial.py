from fractions import Fraction as F
from decimal import Decimal, getcontext, ROUND_FLOOR,ROUND_CEILING
import json,re
getcontext().prec=100
j=json.load(open('/workspace/shared/zeta_sphere_campaign/theta_correlated_local_v1/degree7_regional_payment_4000.json'))['regions']
def raw(q,k,t):
 s=j[q]['moments'][str(k)][t]; c,e=re.search(r'\[([^ ]+) \+/- ([^]]+)',s).groups(); return Decimal(c)+(1 if t=='hi' else -1)*Decimal(e)
def rounded(z,up): return F(int((z*Decimal(1000000)).to_integral_value(rounding=ROUND_CEILING if up else ROUND_FLOOR)),1000000)
class I:
 def __init__(self,a,b=None): self.a=F(a);self.b=F(a if b is None else b)
 def __add__(x,y):
  if not isinstance(y,I): y=I(y)
  return I(x.a+y.a,x.b+y.b)
 __radd__=__add__
 def __neg__(x):return I(-x.b,-x.a)
 def __sub__(x,y):return x+-y if isinstance(y,I) else x+(-y)
 def __mul__(x,y):
  if not isinstance(y,I):y=I(y)
  v=[x.a*y.a,x.a*y.b,x.b*y.a,x.b*y.b];return I(min(v),max(v))
 __rmul__=__mul__
 def maxabs(x):return max(abs(x.a),abs(x.b))
m=[I(rounded(raw('core',k,'lo')+raw('tail',k,'lo'),False),rounded(raw('core',k,'hi')+raw('tail',k,'hi'),True)) for k in range(1,8)]
D=[[m[i+j] for j in range(3)] for i in range(3)]; b=m[3:6]; c=m[6]
for lam in ['0.05','0.08']:
 a=[[D[i][j]-(F(lam) if i==j else 0) for j in range(3)] for i in range(3)]
 det=a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0])
 minor=a[0][0]*a[1][1]-a[0][1]*a[1][0];print('lambda',lam,'positive minors lower:',float(a[0][0].a),float(minor.a),float(det.a))
x=[F('180888.008'),F('-15165.297'),F('253.796275')]
r=[b[i]-sum(D[i][j]*x[j] for j in range(3)) for i in range(3)]; E=sum(z.maxabs()**2 for z in r)/F('.08')
q=c-2*sum(b[i]*x[i] for i in range(3))+sum(x[i]*D[i][j]*x[j] for i in range(3) for j in range(3)); print('r max',[float(z.maxabs()) for z in r]);print('E bound',float(E),'q interval',[float(q.a),float(q.b)],'schur lower',float(q.a-E))
