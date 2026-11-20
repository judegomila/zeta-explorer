"""New complete-theta interval enclosures for occupancy four."""
import sys,json,time
from pathlib import Path
from math import comb
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'confluent_v4'))
from certify_confluent_jets import psi,cosh,pjet,w_bound
import mpmath as mp
from mpmath import iv
mp.mp.dps=60;iv.dps=50
ROOT=Path(__file__).resolve().parent
start=time.time()
def val(h):return 2*h*h*iv.mpf([1,cosh(h).b])*pjet(h,6,0,psi(h,6))
def fourth(h):
 ps=psi(h,10)
 return sum((comb(4,k)*w_bound(h,k)*abs(pjet(h,6,4-k,ps)) for k in range(5)),iv.mpf(0))
cuts=[mp.mpf(0),mp.mpf('.5'),mp.mpf(1),mp.mpf(2),mp.mpf(4)]
stack=[(lo,hi,val(iv.mpf(lo)),val(iv.mpf(hi))) for lo,hi in zip(cuts[:-1],cuts[1:])];total=iv.mpf(0);leaves=0
while stack:
 lo,hi,left,right=stack.pop();mid=(lo+hi)/2;d=hi-lo;center=val(iv.mpf(mid));err=fourth(iv.mpf([lo,hi]))*iv.mpf(d)**5/2880
 if err.b>(iv.mpf('.01')*iv.mpf(d)/4).a:
  stack.extend([(mid,hi,center,right),(lo,mid,left,center)]);continue
 total+=iv.mpf(d)*(left+4*center+right)/6+iv.mpf([-1,1])*err;leaves+=1
total+=iv.mpf([-1,1])*(iv.mpf('1e-2400')+iv.mpf('1e-30'))
print('K6',total,flush=True)
result={'K6_lower':str(mp.mpf(total.a)),'K6_upper':str(mp.mpf(total.b)),'leaves':leaves}
delta=iv.mpf([-1,1])*iv.mpf('.001');sums={4:iv.mpf(0),6:iv.mpf(0),8:iv.mpf(0)}
for k in range(2048):
 h=iv.mpf([mp.mpf(k)/512,mp.mpf(k+1)/512]);aa=psi(h-delta,8);bb=psi(h+delta,8);weight=2*h*h*cosh(h)
 for r in sums:
  p=sum((comb(r,j)*(-1)**j*aa[j]*bb[r-j] for j in range(r+1)),iv.mpf(0));bound=abs(weight*p);sums[r]+=iv.mpf([0,bound.b])/512
for r,t in sums.items():
 t+=iv.mpf([0,1])*iv.mpf('1e-2400')+iv.mpf([-1,1])*iv.mpf('1e-30');result['M'+str(r)]=str(mp.mpf(t.b));print('M'+str(r),t.b,flush=True)
result['seconds']=time.time()-start;result['shift_range']='0<=a<=.5';result['v_radius']='.001'
(ROOT/'four_channel_bounds.json').write_text(json.dumps(result,indent=2));print(result['seconds'])
