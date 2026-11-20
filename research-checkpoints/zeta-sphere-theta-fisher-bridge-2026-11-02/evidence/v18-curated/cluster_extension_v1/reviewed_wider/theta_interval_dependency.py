"""Original interval certificates for confluent normalization, uniform 0<a<=1/2."""
import json,time
from pathlib import Path
from fractions import Fraction as F
from math import comb,factorial
import mpmath as mp
from mpmath import iv
mp.mp.dps=60;iv.dps=50
ROOT=Path(__file__).resolve().parent
POL=[[F(0),F(-3),F(2)]]
for j in range(10):
 old=POL[-1];new=[F(0)]*(len(old)+1)
 for k,c in enumerate(old):new[k]+=(F(1,2)+2*k)*c;new[k+1]-=2*c
 POL.append(new)
assert max(sum(abs(c) for c in row) for row in POL)<10**30
POLI=[[iv.mpf(c.numerator)/c.denominator for c in row] for row in POL]
def psi(x,order):
 if x.b<=0:
  return [z*(-1)**j for j,z in enumerate(psi(-x,order))] if x.a<0 else psi_nonnegative(x,order)
 if x.a<0:
  xx=iv.mpf([0,max(abs(x.a),abs(x.b))]);out=psi_nonnegative(xx,order)
  return [z*(iv.mpf([-1,1]) if j%2 else 1) for j,z in enumerate(out)]
 return psi_nonnegative(x,order)
def psi_nonnegative(x,order):
 r0=iv.pi*iv.exp(2*x);front=4*iv.exp(x/2)
 out=[iv.mpf(0) for _ in range(order+1)]
 for n in range(1,11):
  r=n*n*r0;ex=iv.exp(-r)
  for j in range(order+1):
   pol=POLI[j][-1]
   for c in reversed(POLI[j][:-1]):pol=pol*r+c
   out[j]+=front*pol*ex
 err=iv.mpf([-1,1])*iv.mpf('1e-80')*iv.exp(x/2-r0)*(1+r0)**12
 return [z+err for z in out]
def cosh(x):return (iv.exp(x)+iv.exp(-x))/2

def pjet(h,r,j,ps):
 return sum((comb(r,l)*(-1)**l*comb(j,m)*ps[l+m]*ps[r-l+j-m] for l in range(r+1) for m in range(j+1)),iv.mpf(0))
def w_bound(h,k):
 return 2*cosh(h)*sum((comb(k,l)*(factorial(2)//factorial(2-l))*h**(2-l)/iv.mpf(k-l+1) for l in range(min(2,k)+1)),iv.mpf(0))
def values(h):
 ps=psi(h,4);weight=2*h*h*iv.mpf([1,cosh(h).b])
 return [weight*pjet(h,r,0,ps) for r in (0,2,4)]
def fourths(h):
 ps=psi(h,8)
 return [sum((comb(4,k)*w_bound(h,k)*abs(pjet(h,r,4-k,ps)) for k in range(5)),iv.mpf(0)) for r in (0,2,4)]
def run():
 start=time.time();total=[iv.mpf(0) for _ in range(3)];tol=[iv.mpf('1e-7'),iv.mpf('1e-5'),iv.mpf('1e-3')]
 cuts=[mp.mpf(0),mp.mpf(1)/2,mp.mpf(1),mp.mpf(2),mp.mpf(4)]
 stack=[(lo,hi,values(iv.mpf(lo)),values(iv.mpf(hi))) for lo,hi in zip(cuts[:-1],cuts[1:])];leaves=0
 while stack:
  lo,hi,left,right=stack.pop();mid=(lo+hi)/2;d=hi-lo
  center=values(iv.mpf(mid));dd=fourths(iv.mpf([lo,hi]));err=[z*iv.mpf(d)**5/2880 for z in dd]
  if any(z.b>(tol[j]*iv.mpf(d)/4).a for j,z in enumerate(err)):
   stack.extend([(mid,hi,center,right),(lo,mid,left,center)]);continue
  for j in range(3):total[j]+=iv.mpf(d)*(left[j]+4*center[j]+right[j])/6+iv.mpf([-1,1])*err[j]
  leaves+=1
 rows=[]
 for r,z in zip((0,2,4),total):
  z+=iv.mpf([-1,1])*(iv.mpf('1e-2500')+iv.mpf('1e-30'))
  rows.append({'derivative':r,'lower':str(mp.mpf(z.a)),'upper':str(mp.mpf(z.b))})
  print('order',r,'uniform a jet',z,flush=True)
 (ROOT/'confluent_jet_intervals.json').write_text(json.dumps({'values':rows,'shift_range':'0<a<=1/2','leaves':leaves,'seconds':time.time()-start,'iv_dps':50},indent=2)+'\n')
 print('leaves',leaves,'seconds',time.time()-start,flush=True)
if __name__=='__main__':run()
