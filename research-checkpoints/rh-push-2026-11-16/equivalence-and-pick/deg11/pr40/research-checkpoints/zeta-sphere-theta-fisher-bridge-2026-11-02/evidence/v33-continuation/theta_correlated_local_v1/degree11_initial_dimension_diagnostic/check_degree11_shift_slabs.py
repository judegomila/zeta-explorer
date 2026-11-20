"""Direct signed shifted six-channel matrices on continuous a/H slabs.
Complete theta and full spatial tails. Fixed rational bases are candidates only.
"""
from pathlib import Path
import json,sys,math
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
s=(p/'check_signed_tail_prefix.py').read_text();exec(s[s.index('def general_ldl'):s.index('sums=')])
from theta24_density import theta24
NS=int(sys.argv[1]) if len(sys.argv)>1 else 16
N=int(sys.argv[2]) if len(sys.argv)>2 else 4000
NC=int(sys.argv[3]) if len(sys.argv)>3 else 4000
bases=json.loads((p/'degree11_shift_rational_basis.json').read_text());coeff={}
for name,shift in [('even10',0),('odd11',1)]:
 P=[[arb(x) for x in row] for row in bases[name]['coefficients']]
 coeff[shift]=[[[sum((P[a][i]*P[b][j] for a in range(6) for b in range(6) if a+b+shift==k),arb(0)) for k in range(12)] for j in range(6)] for i in range(6)]
def transform(ds,shift):return [[sum(coeff[shift][i][j][k]*ds[k] for k in range(12)) for j in range(6)] for i in range(6)]
def sinhc(x):return arb(1) if x.is_zero() else x.sinh()/x

def weight_range(alo,ahi,ulo,uhi):return hull(sinhc(2*alo*ulo).lower(),sinhc(2*ahi*uhi).upper())
slabs=[(arb(i)/(2*NS),arb(i+1)/(2*NS)) for i in range(NS)]
mats={i:[[[arb(0) for _ in range(6)] for _ in range(6)] for _ in slabs] for i in [0,1]}
w=arb(15)/(8*N)
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper());dm=theta24(mid)[0];d0,d1,d2=theta24(uu)
 for shift in [0,1]:
  bm=transform(dm,shift);b0=transform(d0,shift);b1=transform(d1,shift);b2=transform(d2,shift)
  for si,(alo,ahi) in enumerate(slabs):
   wm=weight_range(alo,ahi,mid,mid);x=2*ahi*uu.upper();v0=x.cosh();v1=ahi*x.sinh();v2=4*ahi*ahi*x.cosh()/3
   for i in range(6):
    for j in range(i,5):
     second=(v0*abs(b2[i][j]).upper()+2*v1*abs(b1[i][j]).upper()+v2*abs(b0[i][j]).upper()).upper()
     mats[shift][si][i][j]+=w*wm*bm[i][j]+arb(0,(w**3*second/24).upper())
Z=arb.pi()*arb(4).exp();tails=[256/arb.pi()*math.factorial(2*j)*9**j*Z**(j+5)*(-2*Z).exp() for j in range(12)];assert 2-arb(16)/Z>1
mins={i:[[None]*6 for _ in slabs] for i in [0,1]};failed={i:set() for i in [0,1]}
def check_matrix(B,shift,si):
 try:
  ds=general_ldl(B)[1]
  for j in range(6):mins[shift][si][j]=ds[j].lower() if mins[shift][si][j] is None else min(mins[shift][si][j],ds[j].lower())
 except AssertionError:failed[shift].add(si)
for shift in [0,1]:
 for si in range(NS):
  for i in range(6):
   for j in range(i,5):
    tail=sum(abs(coeff[shift][i][j][k]).upper()*tails[k] for k in range(12))
    mats[shift][si][i][j]+=arb(0,tail.upper());mats[shift][si][j][i]=mats[shift][si][i][j]
  check_matrix(mats[shift][si],shift,si)
w=arb(1)/(8*NC)
for k in range(NC):
 mid=arb(1)/8-(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper());dm=theta24(mid)[0];d0,d1,d2=theta24(uu)
 for shift in [0,1]:
  bm=transform(dm,shift);b0=transform(d0,shift);b1=transform(d1,shift);b2=transform(d2,shift)
  for si,(alo,ahi) in enumerate(slabs):
   if si in failed[shift]:continue
   wm=weight_range(alo,ahi,mid,mid);wc=weight_range(alo,ahi,max(arb(0),uu.lower()),uu.upper());x=2*ahi*uu.upper();v0=x.cosh();v1=ahi*x.sinh();v2=4*ahi*ahi*x.cosh()/3
   B=[[arb(0) for _ in range(6)] for _ in range(6)]
   for i in range(6):
    for j in range(i,5):
     local=wc*b0[i][j];lo=w*local.lower() if local.lower()<0 else arb(0);hi=w*local.upper() if local.upper()>0 else arb(0)
     B[i][j]=mats[shift][si][i][j]+hull(lo,hi);B[j][i]=B[i][j]
   check_matrix(B,shift,si)
   for i in range(6):
    for j in range(i,5):
     second=(v0*abs(b2[i][j]).upper()+2*v1*abs(b1[i][j]).upper()+v2*abs(b0[i][j]).upper()).upper()
     mats[shift][si][i][j]+=w*wm*bm[i][j]+arb(0,(w**3*second/24).upper());mats[shift][si][j][i]=mats[shift][si][i][j]
out={'shift_slabs':NS,'tail_cells':N,'cutoff_cells':NC,'bits':ctx.prec,'scope':'Continuous a in[0,1/2], H in[0,1/8], both signed6x6 blocks. Failed interval LDL is inconclusive, not negative.'}
for name,shift in [('even10',0),('odd11',1)]:out[name]={'failed_slabs':sorted(failed[shift]),'slabs':[{'a_lo':str(a),'a_hi':str(b),'passed':si not in failed[shift],'pivot_lowers':[None if x is None else str(x) for x in mins[shift][si]]} for si,(a,b) in enumerate(slabs)],'all_passed':not failed[shift]}
print(json.dumps(out,indent=2))
