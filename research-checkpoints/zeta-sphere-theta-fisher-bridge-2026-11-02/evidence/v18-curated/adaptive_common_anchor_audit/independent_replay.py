"""Full degree19 odd a=0 core inertia and complement-coupling certificate."""
import json
from pathlib import Path
from fractions import Fraction
import mpmath as mp
from mpmath import iv
OUT=Path(__file__).resolve().parent;P=OUT.parent/'core_inertia_v2';mp.mp.dps=100;iv.dps=100

def load(x):
 a=iv.mpf(x[0]);b=iv.mpf(x[1]);return iv.mpf(x)+iv.mpf([-1,1])*iv.mpf('1e-90')*(1+abs(a)+abs(b))
co=[load(x) for x in json.load(open(OUT.parent/'core_inertia_audit/certificate.json'))['moments']];fu=[load(x) for x in json.load(open(OUT.parent/'actual_tail_repair_audit/actual_total_certificate.json'))['moments']]
# Candidate change of coordinates fixed as exact rationals, not presumed eigenvectors.
cand=json.load(open(P/'full_split_coordinates.json'))
def rat(s):
 f=Fraction(s);return iv.mpf(f.numerator)/f.denominator
s=list(map(rat,cand['scales']));U=[[rat(x) for x in r] for r in cand['U']]
def tr(A):return list(map(list,zip(*A)))
def mm(A,B):return [[sum(x*y for x,y in zip(r,c)) for c in zip(*B)] for r in A]
def add(A,B,sgn=1):return [[a+sgn*b for a,b in zip(r,s)] for r,s in zip(A,B)]
def scale(A,k):return [[k*x for x in r] for r in A]
def inv(A):
 n=len(A);B=[r[:]+[iv.mpf(i==j) for j in range(n)] for i,r in enumerate(A)]
 for k in range(n):
  p=B[k][k];assert p.a>0,(k,p)
  B[k]=[x/p for x in B[k]]
  for i in range(n):
   if i==k:continue
   f=B[i][k];B[i]=[x-f*y for x,y in zip(B[i],B[k])]
 return [r[n:] for r in B]
def ldl(A):
 B=[r[:] for r in A];p=[]
 for k in range(len(B)):
  d=B[k][k];assert d.a>0,(k,d);p.append(d)
  for i in range(k+1,len(B)):
   for j in range(k+1,len(B)):B[i][j]-=B[i][k]*B[k][j]/d
 return p
def mat(mu):return [[mu[i+j+1]/(s[i]*s[j]) for j in range(10)] for i in range(10)]
def split(M):
 A=[r[:2] for r in M[:2]];B=[r[2:] for r in M[:2]];D=[r[2:] for r in M[2:]]
 return A,add(D,mm(mm(tr(B),inv(A)),B),-1)

C=mat(co);M=mat(fu);T=add(M,C,-1);A=[r[:9] for r in M[:9]];ldl(A)
Am=mp.matrix([[mp.mpf(x.mid) for x in row] for row in A]);Rm=Am**-1
Rf=[[Fraction(mp.nstr(Rm[i,j],80)) for j in range(9)] for i in range(9)]
R=[[iv.mpf(x.numerator)/x.denominator for x in row] for row in Rf]
residual=add([[iv.mpf(i==j) for j in range(9)] for i in range(9)],mm(R,A),-1)
rho=iv.mpf(1)/1000
assert all(sum(abs(x) for x in row).b<rho.a for row in residual)
norm=max(sum(abs(x) for x in row) for row in Rf);Minv=(iv.mpf(norm.numerator)/norm.denominator)/(1-rho)
def quadratic(b):
 bm=mp.matrix([mp.mpf(row[0].mid) for row in b]);xm=Rm*bm
 xf=[Fraction(mp.nstr(v,80)) for v in xm];x=[[iv.mpf(v.numerator)/v.denominator] for v in xf]
 r=add(b,mm(A,x),-1)
 err=Minv*sum(abs(row[0])**2 for row in r)
 main=2*mm(tr(b),x)[0][0]-mm(mm(tr(x),A),x)[0][0]
 return main+iv.mpf([0,1])*err
bc=[[C[i][9]] for i in range(9)];bt=[[T[i][9]] for i in range(9)]
qc=quadratic(bc);qt=quadratic(bt);qsum=quadratic(add(bc,bt));cross=(qsum-qc-qt)/2
assert qc.a>0 and qt.a>0
ac=iv.sqrt(qc);at=iv.sqrt(qt);L=ac+at
dc=C[9][9];dt=T[9][9]
base=dc+dt-L**2;cov=2*(ac*at-cross);S=base+cov
b=add(bc,bt);direct=dc+dt-qsum
assert S.a>0 and direct.a>0
# Core lower9 block is genuinely indefinite: its already certified odddegree5 witness principal block has negative determinant.
core3=[r[:3] for r in C[:3]]
def det3(X):return X[0][0]*(X[1][1]*X[2][2]-X[1][2]*X[2][1])-X[0][1]*(X[1][0]*X[2][2]-X[1][2]*X[2][0])+X[0][2]*(X[1][0]*X[2][1]-X[1][1]*X[2][0])
assert det3(core3).b<0
bounds=lambda x:[str(mp.mpf(x.a)),str(mp.mpf(x.b))]
res={'scope':'Actual fulltheta odddegree19,a=0,H=1/16 partition; full9D lower anchor, no localcorePD assumption','qc':bounds(qc),'qt':bounds(qt),'cross':bounds(cross),'optimal_core_weight':bounds(ac/L),'signed_remainder':bounds(base),'angular_covariance':bounds(cov),'combined_S':bounds(S),'direct_S':bounds(direct),'core_lower3_determinant':bounds(det3(core3))}
(OUT/'certificate.json').write_text(json.dumps(res,indent=2));print(json.dumps(res,indent=2))
