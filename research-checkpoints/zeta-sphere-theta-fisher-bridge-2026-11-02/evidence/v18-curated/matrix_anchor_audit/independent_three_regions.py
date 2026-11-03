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

quarters=[[load(x) for x in row['moments']] for row in json.load(open(OUT.parent/'anchor_scaling_audit/partition_certificate.json'))['rows']]
head=[sum(row[k] for row in quarters) for k in range(20)]
parts=[co,[a-b for a,b in zip(head,co)],[a-b for a,b in zip(fu,head)]]
Ms=[mat(p) for p in parts];bs=[[[M[i][9]] for i in range(9)] for M in Ms];ds=[M[9][9] for M in Ms]
qs=[quadratic(b) for b in bs];G=[[iv.mpf(0) for j in range(3)] for i in range(3)]
for i in range(3):
 G[i][i]=qs[i]
 for j in range(i):G[i][j]=G[j][i]=(quadratic(add(bs[i],bs[j]))-qs[i]-qs[j])/2
alpha=[sum(row) for row in G];rho=[d-a for d,a in zip(ds,alpha)]
a=G[0][1];b=G[1][2];w=-G[0][2]
assert a.a>0 and b.a>0 and w.a>0
budget=w*(1/a+1/b);assert budget.b<iv.mpf('.00064').a
assert all(x.a>0 for x in alpha+rho)
L=[[a-w,-a],[-a,a+b]];ldl(L)
bounds=lambda x:[str(mp.mpf(x.a)),str(mp.mpf(x.b))]
res={'scope':'Actual fulltheta degree19,a0,regions[0,1/16],[1/16,1],[1,infinity]; signed featureedge and nontrivial matrix-anchor grouping','positive_edges':[bounds(a),bounds(b)],'negative_edge_weight':bounds(w),'effective_resistance_budget':bounds(budget),'alpha':[bounds(x) for x in alpha],'rho':[bounds(x) for x in rho],'grounded_graph_LDL':[bounds(x) for x in ldl(L)]}
(OUT/'three_region_certificate.json').write_text(json.dumps(res,indent=2));print(json.dumps(res,indent=2))
