"""Owned interval certificate for first arithmetic term, not next pivot."""
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
alpha=arb(47)/4+arb(0,arb(11)/200)
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
qc={(j,b):qcoef(j,b) for j in [0,2,4] for b in [5,7,9]}
a={0:alpha**2,2:alpha/2,4:arb(1)/16}
total=arb(0);width=arb(3)/N
for i in range(N):
 w=arb(3*(2*i+1))/(2*N)+arb(0,arb(3)/(2*N))
 S=2*z*(2*w).cosh()
 val=arb(0)
 for j in [0,2,4]:
  val+=a[j]*(64*z**4*poly(qc[j,9],S)-96*z*z*S*poly(qc[j,7],S)+144*z*z*poly(qc[j,5],S))
 total+=width*2*w*w*(-S).exp()*val
# All omitted |w|>=3, with f not assumed positive or even.
def T(j):return 40*(2*j+7)**j*(2*(j+2))**(j+2)
def M(j):return 40*(2*j+7)**j*(j+3)**(j+3)
ahi=arb(2361)/200
au={0:ahi**2,2:ahi/2,4:arb(1)/16}
A=sum(au[j]*sum(math.comb(j,l)*T(l)*M(j-l) for l in range(j+1)) for j in [0,2,4])
Z=pi*arb(6).exp()
tail=2*A*pi**(-arb(3)/4)*Z**(-arb(1)/4)*(-Z/2).exp()
cert=total+arb(0,tail.upper())
assert cert.upper()<-19
out={'N':N,'precision_bits':ctx.prec,'alpha_interval':str(alpha),'finite_integral':str(total),'tail_upper':str(tail.upper()),'full_interval':str(cert),'upper_bound':str(cert.upper()),'proved_negative':True,'proved_upper_lt_minus19':True,'source_old_contacts_only':str(src),'scope':'Only k=1 arithmetic summand using old-prefix root enclosure; no next pivot certified.'}
print(json.dumps(out,indent=2))
