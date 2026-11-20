"""Interval evaluation of actual tail reserve on certified core witness subspace."""
import json
from pathlib import Path
from fractions import Fraction
import mpmath as mp
from mpmath import iv
P=Path(__file__).resolve().parent;mp.mp.dps=100;iv.dps=100
def load_interval(x):
 a=iv.mpf(x[0]);b=iv.mpf(x[1]);pad=iv.mpf('1e-90')*(1+abs(a)+abs(b));return iv.mpf(x)+iv.mpf([-1,1])*pad
core=[load_interval(x) for x in json.loads((P/'certificate.json').read_text())['moments']]
full=[load_interval(x) for x in json.loads((P/'actual_total_certificate.json').read_text())['moments']]
cs=[[Fraction(x) for x in row] for row in json.loads((P/'witnesses.json').read_text())]
Z=[[iv.mpf(cs[j][i].numerator)/cs[j][i].denominator for j in range(3)] for i in range(2,10)]
def tr(A):return list(map(list,zip(*A)))
def mm(A,B):return [[sum(x*y for x,y in zip(row,col)) for col in zip(*B)] for row in A]
def add(A,B,sgn=1):return [[a+sgn*b for a,b in zip(r,s)] for r,s in zip(A,B)]
def inv2(A):
 d=A[0][0]*A[1][1]-A[0][1]*A[1][0];assert A[0][0].a>0 and d.a>0
 return [[A[1][1]/d,-A[0][1]/d],[-A[1][0]/d,A[0][0]/d]]
def split(mu):
 M=[[mu[i+j+1] for j in range(10)] for i in range(10)];A=[r[:2] for r in M[:2]];B=[r[2:] for r in M[:2]];D=[r[2:] for r in M[2:]]
 R=mm(inv2(A),B);return A,R,add(D,mm(tr(B),R),-1)
Ac,Rc,Sc=split(core);At,Rt,St=split([a-b for a,b in zip(full,core)])
D=add(Rc,Rt,-1);cov=mm(mm(tr(D),inv2(add(inv2(Ac),inv2(At)))),D)
project=lambda S:mm(mm(tr(Z),S),Z)
Cp,Tp,Vp=map(project,[Sc,St,cov]);repaired=add(add(Cp,Tp),Vp)
def ldl(A):
 A=[r[:] for r in A];out=[]
 for k in range(len(A)):
  pivot=A[k][k];out.append(pivot);assert pivot.a>0,(k,pivot)
  for i in range(k+1,len(A)):
   for j in range(k+1,len(A)):A[i][j]-=A[i][k]*A[k][j]/pivot
 return out
def bounds(x):return [str(mp.mpf(x.a)),str(mp.mpf(x.b))]
res={'scope':'a=0 actual core/tail repair on fixed 3D rational residual witness subspace; NOT entire degree19 positivity','tail_dominates_600_times_negative_core_LDL':[bounds(x) for x in ldl(add(Tp,[[600*x for x in row] for row in Cp]))],'tail_projected_LDL':[bounds(x) for x in ldl(Tp)],'repaired_projected_LDL':[bounds(x) for x in ldl(repaired)],'core_projected':[[bounds(x) for x in r] for r in Cp],'tail_projected':[[bounds(x) for x in r] for r in Tp]}
(P/'actual_repair_certificate.json').write_text(json.dumps(res,indent=2));print(json.dumps(res,indent=2))
