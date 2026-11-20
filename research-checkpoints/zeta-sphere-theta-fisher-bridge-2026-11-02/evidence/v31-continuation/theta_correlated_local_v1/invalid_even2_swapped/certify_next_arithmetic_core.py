"""Owned independent arithmetic diagnostics of already-known even2 or odd1 pivots."""
import sys,math,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
from fractions import Fraction as F
from pathlib import Path
src=Path("/workspace/shared/zeta_sphere_campaign/source_0145_audit/private/source/integrated_pivots_certificate.json")
data=json.loads(src.read_text())
block=next(b for b in data["blocks"] if b["parity"]==0)
def ball(v):return F(int(v["lo"]),int(v["denominator"])),F(int(v["hi"]),int(v["denominator"]))
g00=ball(block["matrix"][0][0]);g01=ball(block["matrix"][0][1])
assert g00[0]>F(3,100) and max(abs(x) for x in g01)<F(1,10000)
assert F(66,4)*F(1,10000)/F(3,100)==F(11,200)
ctx.prec=160
N=int(sys.argv[1]) if len(sys.argv)>1 else 12000
pi=arb.pi();z=pi
mode=sys.argv[2] if len(sys.argv)>2 else 'odd1'
assert mode in ['odd1','even2']
K=6 if mode=='odd1' else 8
B_K=6400*(K+2)**2*(K+3)**3;H_K=(2*K+7)*(3*K+7)
assert 64*pi>K*(9+2*K) and 64*pi>arb(H_K)/4 and 64*pi>arb(24*B_K).log()/2
def readball(i,j):
 lo,hi=ball(block['matrix'][i][j]);l=arb(lo.numerator)/lo.denominator;h=arb(hi.numerator)/hi.denominator
 return (l+h)/2+arb(0,((h-l)/2).upper())
g00,g01,g11=readball(0,0),readball(0,1),readball(1,1)
if mode=='odd1':
 ek2=47*g00+66*g01;ek4=66**2*g11+2*47*66*g01+47**2*g00
 beta=ek4/(4*ek2)
 assert beta.lower()>0
 a={2:beta**2/4,4:beta/8,6:arb(1)/64};sgn=-1
 coeff_report={'beta':str(beta),'source_entries':['G00','G01','G11']}
else:
 g02,g12=readball(0,2),readball(1,2)
 det=g00*g11-g01*g01;assert det.lower()>0
 lead=arb(10500)/16
 aa=-lead*(g11*g02-g01*g12)/det;bb=-lead*(g00*g12-g01*g02)/det
 c1=-arb(551)/8+2*aa/33;c0=arb(6419)/16-47*aa/66+bb
 assert c1.upper()<0 and c0.lower()>0
 q=[c0,-c1/4,arb(1)/16]
 a={2*j:sum(q[l]*q[j-l] for l in range(3) if 0<=j-l<3) for j in range(5)};sgn=1
 coeff_report={'c0':str(c0),'c1':str(c1),'source_entries':['G00','G01','G11','G02','G12']}
def qcoef(k,b):
 c=[1]
 for _ in range(k):
  d=[0]*(len(c)+1)
  for j,x in enumerate(c):d[j]+=(b+2*j)*x;d[j+1]-=2*x
  c=d
 return c
def poly(c,x):
 y=arb(0)
 for v in reversed(c):y=y*x+v
 return y
qc={(j,b):qcoef(j,b) for j in a for b in [5,7,9]}
total=arb(0);width=arb(3)/N
contributions=[]
for idx in range(1,64):
 z=pi*idx;R=arb(idx).log()/2
 divisors=[d for d in range(1,idx+1) if idx%d==0]
 dcount=len(divisors)
 ell=sum((arb(d*d)/idx).log()**2 for d in divisors)
 piece=arb(0)
 for i in range(N):
  w=arb(3*(2*i+1))/(2*N)+arb(0,arb(3)/(2*N))
  S=2*z*(2*w).cosh()
  val=arb(0)
  for j in a:
   val+=a[j]*(64*z**4*poly(qc[j,9],S)-96*z*z*S*poly(qc[j,7],S)+144*z*z*poly(qc[j,5],S))
  piece+=width*2/arb(idx).sqrt()*(dcount*w*w+ell/4)*(R-S).exp()*val
 piece*=sgn
 total+=piece
 contributions.append({'k':idx,'interval':str(piece),'lower':str(piece.lower()),'upper':str(piece.upper())})
# All omitted |w|>=3, with f not assumed positive or even.
def T(j):return 40*(2*j+7)**j*(2*(j+2))**(j+2)
def M(j):return 40*(2*j+7)**j*(j+3)**(j+3)
au={j:arb(x.upper()) for j,x in a.items()}
A=sum(au[j]*sum(math.comb(j,l)*T(l)*M(j-l) for l in range(j+1)) for j in a)
tail=arb(0)
for idx in range(1,64):
 divisors=[d for d in range(1,idx+1) if idx%d==0]
 ell=sum((arb(d*d)/idx).log()**2 for d in divisors)
 Z=pi*idx*arb(6).exp()
 tail+=2*A/arb(idx).sqrt()*(len(divisors)+ell/4)*pi**(-arb(3)/4)*Z**(-arb(1)/4)*(-Z/2).exp()
cert=total+arb(0,tail.upper())
J=arb(64)
W=sum(au[j]*(4*pi*J)**j for j in a)
arith_tail=4*B_K/pi*J**(arb(1)/4)*(1+J.log()**2/4)*W*(-pi*J/2).exp()
assert J>arb(2).exp() and J>arb(H_K)/(4*pi) and J>4*(K+3)/pi
lower=cert-arith_tail if mode=='odd1' else cert
passed=bool(lower.lower()>0)
out={'mode':mode,'N':N,'precision_bits':ctx.prec,'coefficients':coeff_report,'finite_core':str(total),'integration_tail_upper':str(tail.upper()),'arithmetic_tail_upper':str(arith_tail.upper()),'paid_lower_endpoint':str(lower.lower()),'proved_positive':passed,'source_prefix_only':str(src),'contributions':contributions,'scope':'Independent arithmetic check of already-known rung, no next moment or next-pivot reserve read; not a ladder extension.'}
print(json.dumps(out,indent=2))
