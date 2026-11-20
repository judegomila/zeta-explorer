"""Original interval bound for finite-node normalized shift continuation."""
import json,sys,time
from pathlib import Path
from math import comb,factorial
import mpmath as mp
from mpmath import iv
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'modular_v2'))
from certify_zero_window import psi_derivatives
mp.mp.dps=60;iv.dps=50

def psi_even(x,order):
 if x.b<=0:return [z*((-1)**j) for j,z in enumerate(psi_derivatives(-x,order))]
 assert x.a>=0
 return psi_derivatives(x,order)

def evaluate(h,v,order):
 aa=psi_even(h-v,order);bb=psi_even(h+v,order)
 pp=[sum((comb(k,j)*aa[j]*bb[k-j] for j in range(k+1)),iv.mpf(0)) for k in range(order+1)]
 result=iv.mpf(0)
 for k in range(order+1):
  hp=sum((comb(k,j)*(factorial(4)//factorial(4-j))*h**(4-j)*pp[k-j] for j in range(k+1)),iv.mpf(0))
  hc=(iv.exp(h)+(-1)**(order-k)*iv.exp(-h))/2
  result+=comb(order,k)*hp*hc
 return result

def enclosed(v):
 vi=iv.mpf(v);cuts=sorted(set([mp.mpf(0),v,mp.mpf(1),mp.mpf(2),mp.mpf(4)]))
 stack=[(lo,hi,evaluate(iv.mpf(lo),vi,0),evaluate(iv.mpf(hi),vi,0)) for lo,hi in zip(cuts[:-1],cuts[1:])]
 total=iv.mpf(0);leaves=0
 while stack:
  lo,hi,left,right=stack.pop();mid=(lo+hi)/2;d=hi-lo
  center=evaluate(iv.mpf(mid),vi,0);fourth=evaluate(iv.mpf([lo,hi]),vi,4)
  err=abs(fourth)*iv.mpf(d)**5/2880
  if err.b>(iv.mpf('1e-6')*iv.mpf(d)/4).a:
   stack.extend([(mid,hi,center,right),(lo,mid,left,center)]);continue
  total+=iv.mpf(d)*(left+4*center+right)/6+iv.mpf([-1,1])*err;leaves+=1
 total+=iv.mpf([0,1])*iv.mpf('1e-3000')+iv.mpf([-1,1])*iv.mpf('1e-30')
 return total,leaves
if __name__=='__main__':
 start=time.time();rows=[]
 for j in range(3):
  v=mp.mpf(j)/4;q,n=enclosed(v)
  print('v',v,'M4cosh',q,'leaves',n,'seconds',time.time()-start,flush=True)
  assert q.a>0 and q.b<iv.mpf('.0012').a
  rows.append({'v':str(v),'lower':str(mp.mpf(q.a)),'upper':str(mp.mpf(q.b)),'leaves':n})
 (ROOT/'shift_moment_intervals.json').write_text(json.dumps({'values':rows,'iv_dps':50,'tol':'1e-6'},indent=2)+'\n')
 print('ALL SHIFT MOMENT TARGETS PASS',flush=True)
