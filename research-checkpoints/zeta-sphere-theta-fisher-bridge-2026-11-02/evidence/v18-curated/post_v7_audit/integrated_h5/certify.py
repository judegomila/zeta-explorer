"""Authored interval integral certificate, not a pointwise Bell test."""
import json,time
from pathlib import Path
from fractions import Fraction as F
from math import comb,factorial
import mpmath as mp
from mpmath import iv
mp.mp.dps=55;iv.dps=40
ROOT=Path(__file__).resolve().parent
P=[[F(0),F(-3),F(2)]]
for j in range(14):
 q=[F(0)]*(len(P[-1])+1)
 for k,c in enumerate(P[-1]):q[k]+=(F(1,2)+2*k)*c;q[k+1]-=2*c
 P.append(q)
assert max(sum(abs(c) for c in p) for p in P)<10**40
PI=[[iv.mpf(c.numerator)/c.denominator for c in p] for p in P]
def psi(x,order):
 z=iv.pi*iv.exp(2*x);f=4*iv.exp(x/2);out=[iv.mpf(0) for _ in range(order+1)]
 for n in range(1,11):
  r=z*n*n;ee=iv.exp(-r)
  for j in range(order+1):
   v=PI[j][-1]
   for c in reversed(PI[j][:-1]):v=v*r+c
   out[j]+=f*v*ee
 err=iv.mpf([-1,1])*iv.mpf('1e-70')*iv.exp(x/2-z)*(1+z)**16
 return [v+err for v in out]
def pjet(r,j,ps):
 return sum((comb(r,k)*(-1)**k*comb(j,l)*ps[k+l]*ps[r-k+j-l] for k in range(r+1) for l in range(j+1)),iv.mpf(0))
def cosh(x):return (iv.exp(x)+iv.exp(-x))/2
def wb(h,k):
 return 2*cosh(h)*sum((comb(k,l)*(factorial(2)//factorial(2-l))*h**(2-l)/(k-l+1) for l in range(min(k,2)+1)),iv.mpf(0))
A=[iv.mpf([(iv.mpf(j)/24).a,(iv.mpf(j+1)/24).b]) for j in range(12)]
R=[2,6,10,4,8]
def weights(h):
 out=[]
 for a in A:
  x=2*a*h
  sc=sum((x**(2*k)/factorial(2*k+1) for k in range(21)),iv.mpf(0))
  # |x|<=4, Taylor tail <= 2 * 4^42/43! < 1e-27 (successive ratio < 1/2).
  sc+=iv.mpf([0,'1e-27']);out.append(2*h*h*sc)
 return out
def vals(h):
 ps=psi(h,10);q=[(-1)**(r//2)*pjet(r,0,ps) for r in R]
 return [[w*v for v in q] for w in weights(h)]
def fourths(h):
 ps=psi(h,14)
 return [sum((comb(4,k)*wb(h,k)*abs(pjet(r,4-k,ps)) for k in range(5)),iv.mpf(0)) for r in R]
def ldl(G):
 n=len(G);L=[[iv.mpf(int(i==j)) for j in range(n)] for i in range(n)];D=[]
 for i in range(n):
  d=G[i][i]-sum((L[i][k]**2*D[k] for k in range(i)),iv.mpf(0));D.append(d)
  if d.a<=0:return D,False
  for j in range(i+1,n):L[j][i]=(G[j][i]-sum((L[j][k]*L[i][k]*D[k] for k in range(i)),iv.mpf(0)))/d
 return D,True
def run():
 t=time.time();tot=[[iv.mpf(0) for _ in R] for _ in A];tol=list(map(iv.mpf,['1e-6','.02','2000','.0001','5']))
 cuts=list(map(mp.mpf,['0','.5','1','2','4']));stack=[(l,h,vals(iv.mpf(l)),vals(iv.mpf(h))) for l,h in zip(cuts[:-1],cuts[1:])];leaves=0
 while stack:
  l,h,left,right=stack.pop();m=(l+h)/2;d=h-l;mid=vals(iv.mpf(m));dd=fourths(iv.mpf([l,h]));err=[x*iv.mpf(d)**5/2880 for x in dd]
  if any(e.b>(tol[k]*iv.mpf(d)/4).a for k,e in enumerate(err)):
   stack.extend([(m,h,mid,right),(l,m,left,mid)]);continue
  for j in range(len(A)):
   for k in range(len(R)):tot[j][k]+=iv.mpf(d)*(left[j][k]+4*mid[j][k]+right[j][k])/6+iv.mpf([-1,1])*err[k]
  leaves+=1
  if leaves%100==0:print('leaves',leaves,'seconds',time.time()-t,flush=True)
 rows=[]
 for j,q in enumerate(tot):
  q=[x+iv.mpf([-1,1])*iv.mpf('1e-1000') for x in q]
  # mu1,mu3,mu5,mu2,mu4; normalized by diagonal reference square roots 1,200,80000.
  raw=[[q[0],q[3],q[1]],[q[3],q[1],q[4]],[q[1],q[4],q[2]]];sc=[1,200,80000];G=[[raw[r][s]/(sc[r]*sc[s]) for s in range(3)] for r in range(3)]
  D,ok=ldl(G);print('a bin',j,'PASS',ok,'pivots',D,flush=True)
  rows.append({'bin':j,'mu_intervals':[[str(mp.mpf(x.a)),str(mp.mpf(x.b))] for x in q],'ldl':[[str(mp.mpf(x.a)),str(mp.mpf(x.b))] for x in D],'pass':ok})
 (ROOT/'certificate.json').write_text(json.dumps({'rows':rows,'leaves':leaves,'seconds':time.time()-t,'orders':R,'shift_bins':'[j/24,(j+1)/24], j=0..11'},indent=2))
 print('COMPLETE',all(x['pass'] for x in rows),'seconds',time.time()-t,flush=True)
if __name__=='__main__':run()
