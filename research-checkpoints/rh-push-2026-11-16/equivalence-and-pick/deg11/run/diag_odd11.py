"""Diagnostic: reproduce odd11 H=1/8 tail-stage matrix for selected slabs; print widths and LDL pivots (no assert)."""
import sys,json,math
from pathlib import Path
p=Path(__file__).parent;sys.path.insert(0,str(p))
ARGS=sys.argv[:];sys.argv=[sys.argv[0]]
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
from theta24_density import theta24
NS=16;N=int(ARGS[1]);SL=[int(x) for x in ARGS[2].split(',')]
bases=json.loads((p/'degree11_shift_rational_basis.json').read_text());coeff={}
for name,shift in [('even10',0),('odd11',1)]:
 P=[[arb(x) for x in row] for row in bases[name]['coefficients']]
 coeff[shift]=[[[sum((P[a][i]*P[b][j] for a in range(6) for b in range(6) if a+b+shift==k),arb(0)) for k in range(12)] for j in range(6)] for i in range(6)]
def transform(ds,shift):return [[sum(coeff[shift][i][j][k]*ds[k] for k in range(12)) for j in range(6)] for i in range(6)]
def sinhc(x):return arb(1) if x.is_zero() else x.sinh()/x
def weight_range(alo,ahi,ulo,uhi):return hull(sinhc(2*alo*ulo).lower(),sinhc(2*ahi*uhi).upper())
slabs=[(arb(i)/(2*NS),arb(i+1)/(2*NS)) for i in range(NS)]
# separate accumulators: center value (point a=alo), weight-hull width, quadrature error
acc={sh:{si:{'M':[[arb(0)]*6 for _ in range(6)],'Q':[[0.0]*6 for _ in range(6)],'raw':[arb(0)]*12,'absraw':[0.0]*12} for si in SL} for sh in [0,1]}
w=arb(15)/(8*N)
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper());dm=theta24(mid)[0];d0,d1,d2=theta24(uu)
 for shift in [0,1]:
  bm=transform(dm,shift);b0=transform(d0,shift);b1=transform(d1,shift);b2=transform(d2,shift)
  for si in SL:
   alo,ahi=slabs[si]
   wm=weight_range(alo,ahi,mid,mid);x=2*ahi*uu.upper();v0=x.cosh();v1=ahi*x.sinh();v2=4*ahi*ahi*x.cosh()/3
   A=acc[shift][si]
   for i in range(6):
    for j in range(i,6):
     second=(v0*abs(b2[i][j]).upper()+2*v1*abs(b1[i][j]).upper()+v2*abs(b0[i][j]).upper()).upper()
     A['M'][i][j]=A['M'][i][j]+w*wm*bm[i][j];A['Q'][i][j]+=float((w**3*second/24).upper())
   if shift==1:
    for kk in range(12):A['raw'][kk]+=w*dm[kk];A['absraw'][kk]+=float(abs(w*dm[kk]).upper())
def ldl_noassert(a):
 n=len(a);ell=[[arb(int(i==j)) for j in range(n)] for i in range(n)];ds=[]
 for j in range(n):
  dj=a[j][j]-sum(ell[j][k]**2*ds[k] for k in range(j));ds.append(dj)
  if not dj.lower()>0: return ds,False
  for i in range(j+1,n):ell[i][j]=(a[i][j]-sum(ell[i][k]*ell[j][k]*ds[k] for k in range(j)))/dj
 return ds,True
out={}
for shift in [0,1]:
 for si in SL:
  A=acc[shift][si];B=[[None]*6 for _ in range(6)]
  for i in range(6):
   for j in range(i,6):
    B[i][j]=A['M'][i][j]+arb(0,A['Q'][i][j]);B[j][i]=B[i][j]
  ds,ok=ldl_noassert(B)
  key=f"shift{shift}_slab{si}"
  out[key]={'ok':ok,'pivots':[f"{float(d.mid()):.6g} +/- {float(d.rad()):.3g}" for d in ds],
   'diag_mid':[f"{float(B[i][i].mid()):.6g}" for i in range(6)],
   'diag_hullrad':[f"{float(A['M'][i][i].rad()):.3g}" for i in range(6)],
   'diag_quadrad':[f"{A['Q'][i][i]:.3g}" for i in range(6)],
   'max_offdiag_rad':f"{max(float(B[i][j].rad()) for i in range(6) for j in range(6) if i!=j):.3g}"}
  if shift==1: out[key]['raw_moment_mid_over_abs']=[f"{float(A['raw'][k].mid())/A['absraw'][k]:.3g}" for k in range(12)]
print(json.dumps(out,indent=1))
