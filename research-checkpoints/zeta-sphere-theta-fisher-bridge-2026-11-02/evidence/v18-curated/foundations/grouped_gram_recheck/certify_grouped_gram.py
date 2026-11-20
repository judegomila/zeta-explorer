"""Original interval certificate for corrected Ewald grouping, a=1/4, N=3.
Axes are analytically closed first; six axis indices integrated with exact remainder.
See GROUPED_GRAM_CERTIFICATE.md. No acquired research code executed.
"""
import json,time
from fractions import Fraction as F
from math import comb,factorial
from pathlib import Path
import mpmath as mp
from mpmath import iv
mp.mp.dps=60;iv.dps=50
ROOT=Path(__file__).resolve().parent
AA=F(1,4);N=3

def I(x):
 if isinstance(x,F):return iv.mpf(x.numerator)/x.denominator
 return iv.mpf(x)

def poly_axis(r,k):
 c=[F(1)]
 for _ in range(k):
  d=[F(0)]*(len(c)+1)
  for j,z in enumerate(c):d[j]+=(r+2*j)*z;d[j+1]-=2*z
  c=d
 return c

def terms_for_v(v):
 a=I(AA);c2=8*a*a+2;c0=(4*a*a-1)**2;groups=[]
 def add_group(c,lp,dp,base,scale):
  ts=[]
  for sign in (1,-1):
   for k,z in enumerate(lp):ts.append((z*scale*sign/(2*a),F(k)+sign*AA+base,1))
   for k,z in enumerate(dp):ts.append((z*scale/2,F(k)+sign*AA+base,0))
  groups.append((c,ts))
 # Axis closure H, factor 1/32 after expanding theta-1.
 for n in range(1,7):
  c=iv.pi*n*n*iv.exp(2*v)
  for r,base,scale in [(0,F(-1,2),I(F(1,32))),(1,F(-1),-iv.exp(v)/32)]:
   p2=poly_axis(r,2);p4=poly_axis(r,4)
   lp=[I(p4[k])-(c2*I(p2[k]) if k<len(p2) else 0)+(c0 if k==0 else 0) for k in range(5)]
   dp=[-16*I(p2[k])+(16*(4*a*a-1) if k==0 else 0) for k in range(3)]
   lp=[z*c**k for k,z in enumerate(lp)];dp=[z*c**k for k,z in enumerate(dp)]
   add_group(c,lp,dp,base,scale)
 for n in range(1,N+1):
  for m in range(1,N+1):
   left=n*n*iv.exp(-2*v);right=m*m*iv.exp(2*v)
   c=iv.pi*(left+right);z=2*iv.pi*(right-left)
   lp=[c0,-16*c+4*c2*c,16*z*z+48*c*c-c2*z*z,-24*c*z*z,z**4]
   dp=[16*(4*a*a-1),64*c,-16*z*z]
   add_group(c,lp,dp,F(-1,2),I(F(1,16)))
 return groups

_cache={}
def fall(b,j):
 key=(b,j)
 if key not in _cache:
  prod=F(1)
  for k in range(j):prod*=b-k
  der=sum((__import__('functools').reduce(lambda x,y:x*y,(b-k for k in range(j) if k!=l),F(1)) for l in range(j)),F(0))
  _cache[key]=(I(prod),I(der))
 return _cache[key]

def evaluate(x,groups,order):
 logx=iv.log(x);powers={};total=I(0)
 def power(b):
  if b not in powers:powers[b]=x**I(b)
  return powers[b]
 for c,terms in groups:
  acc=I(0)
  for coeff,b,logflag in terms:
   term=I(0)
   for j in range(order+1):
    f,df=fall(b,j)
    base=power(b-j)*(f*logx+df if logflag else f)
    term+=comb(order,j)*(-c)**(order-j)*base
   acc+=coeff*term
  total+=iv.exp(-c*x)*acc
 return total

def enclose(v):
 groups=terms_for_v(I(v));tol=I('0.00001');total=I(0);leaves=0
 breaks=[mp.mpf(k) for k in [1,2,4,8,16,32]]
 stack=[(lo,hi,evaluate(I(lo),groups,0),evaluate(I(hi),groups,0)) for lo,hi in zip(breaks[:-1],breaks[1:])]
 while stack:
  lo,hi,left,right=stack.pop();mid=(lo+hi)/2;d=hi-lo
  center=evaluate(I(mid),groups,0)
  fourth=evaluate(iv.mpf([lo,hi]),groups,4)
  err=abs(fourth)*I(d)**5/2880
  if err.b>(tol*I(d)/31).a:
   stack.extend([(mid,hi,center,right),(lo,mid,left,center)]);continue
  total+=I(d)*(left+4*center+right)/6+iv.mpf([-1,1])*err
  leaves+=1
 # Exact remaining axis n>=7, plus x>=32 tails of all retained terms.
 total+=iv.mpf([-1,1])*(I('1e-50')+I('1e-24')+I('1e-30'))
 return total,leaves

if __name__=='__main__':
 start=time.time();rows=[]
 for j in range(3):
  v=mp.mpf(j)/4;val,n=enclose(v)
  print('v=',v,'D3/a=',val,'leaves',n,'seconds',time.time()-start,flush=True)
  rows.append({'v':str(v),'lower':str(mp.mpf(val.a)),'upper':str(mp.mpf(val.b)),'leaves':n})
  (ROOT/'grouped_gram_intervals.json').write_text(json.dumps({'a':'1/4','N':3,'values':rows,'iv_dps':50,'tol':'1e-5'},indent=2)+'\n')
 assert iv.mpf([rows[0]['lower'],rows[0]['upper']]).a>I('.031').b
 assert abs(iv.mpf([rows[1]['lower'],rows[1]['upper']])).b<I('.008').a
 assert abs(iv.mpf([rows[2]['lower'],rows[2]['upper']])).b<I('.001').a
 print('GROUPED GRAM TARGETS PASS: lambda_min(D3/a)>.015; exact relative remainder q<.08',flush=True)
