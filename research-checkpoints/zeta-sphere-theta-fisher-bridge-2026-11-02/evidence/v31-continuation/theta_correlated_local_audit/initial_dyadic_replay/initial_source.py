"""Owned shared quadrature for actual residual norm, dyadic shifts and paired eta surplus."""
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
assert mode in ['odd0','even1']
K=2 if mode=='odd0' else 4
B_K=6400*(K+2)**2*(K+3)**3;H_K=(2*K+7)*(3*K+7)
assert 64*pi>K*(9+2*K) and 64*pi>arb(H_K)/4 and 64*pi>arb(24*B_K).log()/2
def readball(i,j):
 lo,hi=ball(block['matrix'][i][j]);l=arb(lo.numerator)/lo.denominator;h=arb(hi.numerator)/hi.denominator
 return (l+h)/2+arb(0,((h-l)/2).upper())
g00,g01,g11=readball(0,0),readball(0,1),readball(1,1)
if mode=='odd0':
 a={2:arb(1)/4};sgn=-1
 coeff_report={'polynomial':'t','source_entries':[]}
else:
 alpha=(47*g00+66*g01)/(4*g00)
 a={0:alpha**2,2:alpha/2,4:arb(1)/16};sgn=1
 coeff_report={'alpha':str(alpha),'source_entries':['G00','G01']}
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
moments={j:arb(0) for j in a}
amoments={m:{j:arb(0) for j in a} for m in range(6)}
for idx in range(1,64):
 z=pi*idx;R=arb(idx).log()/2
 divisors=[d for d in range(1,idx+1) if idx%d==0]
 dcount=len(divisors)
 ell=sum((arb(d*d)/idx).log()**2 for d in divisors)
 pieces={j:arb(0) for j in a}
 apieces={j:arb(0) for j in a}
 pp={}
 for j in a:
  c=[arb(0)]*(j+2)
  for p,v in enumerate(qc[j,9]):c[p]+=64*z**4*v
  for p,v in enumerate(qc[j,7]):c[p+1]-=96*z*z*v
  for p,v in enumerate(qc[j,5]):c[p]+=144*z*z*v
  cp=[(p+1)*c[p+1] for p in range(len(c)-1)]
  cpp=[(p+1)*cp[p+1] for p in range(len(cp)-1)]
  pp[j]=(c,cp,cpp)
 for i in range(N):
  mid=arb(3*(2*i+1))/(2*N)
  w=mid+arb(0,arb(3)/(2*N))
  S=2*z*(2*w).cosh();Sp=4*z*(2*w).sinh()
  Sm=2*z*(2*mid).cosh()
  pref=2/arb(idx).sqrt()
  for j in a:
   c,cp,cpp=pp[j]
   value=pref*(dcount*mid*mid+ell/4)*(R-Sm).exp()*poly(c,Sm)
   T0=poly(c,S);T1=poly(cp,S);T2=poly(cpp,S)
   f2=pref*(R-S).exp()*(2*dcount*T0+4*dcount*w*(T1-T0)*Sp+(dcount*w*w+ell/4)*((T2-2*T1+T0)*Sp*Sp+4*S*(T1-T0)))
   err=abs(f2).upper()*width**3/24
   pieces[j]+=width*value+arb(0,err)
   avalue=pref*(R-Sm).exp()*poly(c,Sm)
   af2=pref*(R-S).exp()*((T2-2*T1+T0)*Sp*Sp+4*S*(T1-T0))
   apieces[j]+=width*avalue+arb(0,abs(af2).upper()*width**3/24)
 for j in a:moments[j]+=pieces[j]
 for m in range(6):
  if idx%(2**m)==0:
   n=idx//(2**m);dm=sum(1 for k in range(1,n+1) if n%k==0)
   for j in a:amoments[m][j]+=dm*apieces[j]
 contributions.append({'k':idx,'derivative_intervals':{j:str(v) for j,v in pieces.items()}})
total=sgn*sum(a[j]*moments[j] for j in a)
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
lower=cert-arith_tail if mode=='odd0' else cert
# Shared arithmetic support j<64. Correlations b_m=q^m C_m, including m=0.
L=arb(2).log();q=1/arb(2).sqrt()
bvals={};brems={}
for m in range(6):
 integ=arb(0)
 for idx in range(1,64):
  if idx%(2**m):continue
  n=idx//2**m;dm=sum(1 for k in range(1,n+1) if n%k==0)
  Z=pi*idx*arb(6).exp()
  integ+=2*A/arb(idx).sqrt()*dm*pi**(-arb(3)/4)*Z**(-arb(1)/4)*(-Z/2).exp()
 # d(j/2^m)<=d(j); omit harmless logarithmic weight from prior arithmetic envelope.
 rem=4*B_K/pi*J**(arb(1)/4)*W*(-pi*J/2).exp()
 finite=sgn*sum(a[j]*amoments[m][j] for j in a)+arb(0,integ.upper())
 # Each remaining j>=64 kernel has the actual parity sign.
 bvals[m]=finite + (1 if mode=='even1' else -1)*(rem/2+arb(0,(rem/2).upper()))
 brems[m]=str((integ+rem).upper())
E5=2*pi*L**2*(3*bvals[0]+5*sum(bvals[m] for m in range(1,6)))
etarem=20*L**2*B_K*J**(arb(1)/4)*(1+J.log()/L)*W*(-pi*J/2).exp()
E=E5+(1 if mode=='even1' else -1)*(etarem/2+arb(0,(etarem/2).upper()))
h=4*pi*(cert+(1 if mode=='even1' else -1)*(arith_tail/2+arb(0,(arith_tail/2).upper())))
# The exact paired-filtered quantity equals h+E. Same-prefix computation, not an independent source integral.
S=h+E
out={'mode':mode,'N':N,'precision_bits':ctx.prec,'coefficients':coeff_report,
'b_m':{m:{'lower':str(bvals[m].lower()),'upper':str(bvals[m].upper()),'absolute_omission_bound':brems[m]} for m in bvals},
'C_m':{m:{'lower':str((bvals[m]/q**m).lower()),'upper':str((bvals[m]/q**m).upper())} for m in bvals},
'E5':{'lower':str(E5.lower()),'upper':str(E5.upper())},'eta_tail_bound':str(etarem.upper()),
'E':{'lower':str(E.lower()),'upper':str(E.upper())},'h':{'lower':str(h.lower()),'upper':str(h.upper())},
'paired_filtered_surplus':{'lower':str(S.lower()),'upper':str(S.upper())},
'ratio_h_to_E':str(h/E), 'positive_cost':bool(E.lower()>0),'paid_comparison':bool(h.lower()>0),
'scope':'Shared actual old-prefix arithmetic integration. Paired filtered surplus evaluated through exact S=h+E identity, not an independent integration of filtered Fourier quotient. No next-pivot input.'}
print(json.dumps(out,indent=2))
