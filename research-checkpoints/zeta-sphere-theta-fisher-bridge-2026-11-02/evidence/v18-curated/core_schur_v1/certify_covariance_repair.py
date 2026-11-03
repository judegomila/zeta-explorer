"""Actual theta H5 core/tail Schur covariance repair, rigorous intervals.
Reuses previously authored and independently audited full-theta derivative routine.
"""
import sys,json,time
from pathlib import Path
import mpmath as mp
from mpmath import iv
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'integrated_h5_v1'))
import certify as c
mp.mp.dps=60;iv.dps=45
# Rebuild exact polynomial coefficient intervals at this precision.
c.PI=[[iv.mpf(v.numerator)/v.denominator for v in p] for p in c.P]
def mm(A,B):return [[sum(A[i][k]*B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]
def add(A,B):return [[a+b for a,b in zip(r,s)] for r,s in zip(A,B)]
def inv(A):
 assert A[0][0].a>0
 d=A[0][0]*A[1][1]-A[0][1]*A[1][0]
 assert d.a>0
 return [[A[1][1]/d,-A[0][1]/d],[-A[1][0]/d,A[0][0]/d]]
def schur(M):
 A=[r[:2] for r in M[:2]];b=[[M[0][2]],[M[1][2]]];r=mm(inv(A),b)
 S=M[2][2]-sum(b[i][0]*r[i][0] for i in range(2))
 return A,r,S
def bounds(v):return [str(mp.mpf(v.a)),str(mp.mpf(v.b))]
t=time.time();N=0;core=[iv.mpf(0) for _ in c.R]
H=mp.mpf(1)/16
# Adaptive Simpson with an explicit fourth-derivative bound and complete theta tail.
def density(h):
 ps=c.psi(h,10)
 return [2*h*h*(-1)**(r//2)*c.pjet(r,0,ps) for r in c.R]
tols=list(map(iv.mpf,['1e-12','1e-7','.001','1e-10','1e-5']))
stack=[(mp.mpf(0),H,density(iv.mpf(0)),density(iv.mpf(H)))]
while stack:
 l,h,left,right=stack.pop();mid=(l+h)/2;d=h-l;middle=density(iv.mpf(mid))
 dd=c.fourths(iv.mpf([l,h]));err=[x*iv.mpf(d)**5/2880 for x in dd]
 if any(e.b>(tols[k]*iv.mpf(d)/iv.mpf(H)).a for k,e in enumerate(err)):
  stack.extend([(mid,h,middle,right),(l,mid,left,middle)]);continue
 for k in range(len(core)):core[k]+=iv.mpf(d)*(left[k]+4*middle[k]+right[k])/6+iv.mpf([-1,1])*err[k]
 N+=1
base=[iv.mpf(v) for v in json.loads((ROOT.parent/'integrated_h5_v1/certificate.json').read_text())['rows'][0]['mu_intervals']]
def matrix(q):
 raw=[[q[0],q[3],q[1]],[q[3],q[1],q[4]],[q[1],q[4],q[2]]];sc=[1,200,80000]
 return [[raw[i][j]/(sc[i]*sc[j]) for j in range(3)] for i in range(3)]
M=matrix(base);C=matrix(core);T=matrix([a-b for a,b in zip(base,core)])
Ac,rc,Sc=schur(C);At,rt,St=schur(T);A,r,S=schur(M)
parallel=inv(add(inv(Ac),inv(At)))
diff=[[rc[i][0]-rt[i][0]] for i in range(2)];pd=mm(parallel,diff)
gain=sum(diff[i][0]*pd[i][0] for i in range(2))
print('Sc interval beforeassert',Sc,flush=True)
assert Sc.b<0
assert St.a>0
assert gain.a>0
print('coreSchur',Sc,'tailSchur',St,'gain',gain,'gain+core',gain+Sc,flush=True)
q=-Sc/(gain+St)
assert q.b<1
out={'shift_scope':'normalized zero-shift a=0 only; weight exactly 2h^2','core':'[0,1/16]','tail':'[1/16,infinity)','core_cells':N,'fixed_congruence_scaling':[1,200,80000],'core_S':bounds(Sc),'tail_S':bounds(St),'covariance_gain':bounds(gain),'gain_minus_core_deficit':bounds(gain+Sc),'relative_deficit_to_tail_plus_gain':bounds(q),'total_S':bounds(S),'seconds':time.time()-t}
(ROOT/'covariance_repair.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
