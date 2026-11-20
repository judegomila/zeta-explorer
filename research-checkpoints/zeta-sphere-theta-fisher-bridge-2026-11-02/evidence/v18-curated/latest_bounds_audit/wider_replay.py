"""Own continuation of prior campaign interval proof; no downloaded checker run."""
import sys,json,time
from pathlib import Path
from math import comb
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'confluent_v4'))
from certify_confluent_jets import psi,cosh
import mpmath as mp
from mpmath import iv
mp.mp.dps=60;iv.dps=50
start=time.time();delta=iv.mpf([-1,1])*iv.mpf('0.005')
count=2048;totals={4:iv.mpf(0),6:iv.mpf(0)}
for k in range(count):
 h=iv.mpf([mp.mpf(k)/512,mp.mpf(k+1)/512])
 aa=psi(h-delta,6);bb=psi(h+delta,6);weight=2*h*h*cosh(h)
 for order in totals:
  p=sum((comb(order,j)*(-1)**j*aa[j]*bb[order-j] for j in range(order+1)),iv.mpf(0))
  bound=abs(weight*p)
  totals[order]+=iv.mpf([0,bound.b])/512
rows=[]
for order,val in totals.items():
 val+=iv.mpf([0,1])*iv.mpf('1e-2400')+iv.mpf([-1,1])*iv.mpf('1e-30')
 rows.append({'derivative':order,'upper':str(mp.mpf(val.b))})
 print(order,val.b,flush=True)
(Path(__file__).resolve().parent/'wider_derivative_bounds.json').write_text(json.dumps({'v_radius':'0.005','shift_range':'0<=a<=0.5','cells':count,'values':rows,'seconds':time.time()-start},indent=2))
print('seconds',time.time()-start)
