"""Full degree19 odd a=0 core inertia and complement-coupling certificate."""
import json
from pathlib import Path
from fractions import Fraction
import mpmath as mp
from mpmath import iv
OUT=Path(__file__).resolve().parent;P=OUT.parent/'core_inertia_v2';mp.mp.dps=100;iv.dps=100

def load(x):
 a=iv.mpf(x[0]);b=iv.mpf(x[1]);return iv.mpf(x)+iv.mpf([-1,1])*iv.mpf('1e-90')*(1+abs(a)+abs(b))
co=[load(x) for x in json.load(open(P/'certificate.json'))['moments']];fu=[load(x) for x in json.load(open(P/'actual_total_certificate.json'))['moments']]
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
Ac,Sc=split(mat(co));At,St=split(mat([a-b for a,b in zip(fu,co)]))
Cp=mm(mm(tr(U),Sc),U);Tp=mm(mm(tr(U),St),U)
Cnn=[r[:3] for r in Cp[:3]];Cnp=[r[3:] for r in Cp[:3]];Cpp=[r[3:] for r in Cp[3:]]
H=mm(inv(Cpp),tr(Cnp));N=add(scale(Cnn,-1),mm(Cnp,H))
Tnn=[r[:3] for r in Tp[:3]];Tnp=[r[3:] for r in Tp[:3]];Tpp=[r[3:] for r in Tp[3:]]
Tnn=add(add(add(Tnn,mm(Tnp,H),-1),mm(tr(H),tr(Tnp)),-1),mm(mm(tr(H),Tpp),H))
Tnp=add(Tnp,mm(tr(H),Tpp),-1)
cross=mm(mm(Tnp,inv(add(Cpp,Tpp))),tr(Tnp))

ldl(mm(tr(U),U));ldl(Cpp);ldl(N);ldl(St)
# Direction-matched reserve, no scalar kappa/eta relaxation.
A=add(Cpp,Tpp);E=[r[:] for r in Tnn];rows=[]
for j in range(5):
 b=[[Tnp[i][j]] for i in range(3)]
 if j:
  old=[r[:j] for r in A[:j]];d=[[A[i][j]] for i in range(j)];ai=inv(old)
  u=add(b,mm(mm([r[:j] for r in Tnp],ai),d),-1)
  sch=A[j][j]-mm(mm(tr(d),ai),d)[0][0]
 else:u=b;sch=A[0][0]
 assert sch.a>0
 R=add(E,scale(N,100),-1)
 ratio=mm(mm(tr(u),inv(R)),u)[0][0]/sch
 assert ratio.b<1
 E=add(E,scale(mm(u,tr(u)),1/sch),-1)
 pivots=ldl(add(E,scale(N,100),-1))
 rows.append({'channel':j+1,'rank_one_relative_cost':[str(mp.mpf(ratio.a)),str(mp.mpf(ratio.b))],'reserve_LDL':[[str(mp.mpf(v.a)),str(mp.mpf(v.b))] for v in pivots]})
ldl(add(add(Tnn,cross,-1),scale(N,100),-1))
Cfull=mat(co);Tfull=mat([a-b for a,b in zip(fu,co)])
lower_pivots=ldl(add(Tfull,scale(Cfull,400)))
upper_pivots=ldl(add(Tfull,scale(Cfull,-50)))
res={'actual_core_tail_relative_lower':'C > -T/400','actual_core_tail_relative_upper':'C < T/50','relative_lower_LDL':[[str(mp.mpf(x.a)),str(mp.mpf(x.b))] for x in lower_pivots],'relative_upper_LDL':[[str(mp.mpf(x.a)),str(mp.mpf(x.b))] for x in upper_pivots],'scope':'a=0 odd degree19, fixed3negative/5positive core split; full complement recurrence retaining100times core cost','rows':rows}
(OUT/'certificate.json').write_text(json.dumps(res,indent=2));print(json.dumps(res,indent=2))
