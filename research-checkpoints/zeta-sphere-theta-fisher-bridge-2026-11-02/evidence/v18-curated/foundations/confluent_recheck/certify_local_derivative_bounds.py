"""Original interval upper sums for local kernel derivative envelopes."""
import json,time
from math import comb
from pathlib import Path
import mpmath as mp
from mpmath import iv
from certify_confluent_jets import psi,cosh
ROOT=Path(__file__).resolve().parent
mp.mp.dps=60;iv.dps=50
start=time.time();delta=iv.mpf([-1,1])*iv.mpf('0.001')
count=2048;totals={4:iv.mpf(0),6:iv.mpf(0)}
for k in range(count):
 h=iv.mpf([mp.mpf(k)/512,mp.mpf(k+1)/512])
 aa=psi(h-delta,6);bb=psi(h+delta,6)
 weight=2*h*h*cosh(h)
 for order in totals:
  p=sum((comb(order,j)*(-1)**j*aa[j]*bb[order-j] for j in range(order+1)),iv.mpf(0))
  bound=abs(weight*p)
  # interval enclosure over the entire cell and all real v in [-.001,.001]
  totals[order]+=iv.mpf([0,bound.b])/512
rows=[]
for order,val in totals.items():
 val+=iv.mpf([0,1])*iv.mpf('1e-2500')+iv.mpf([-1,1])*iv.mpf('1e-30')
 rows.append({'derivative':order,'upper':str(mp.mpf(val.b))})
 print('order',order,'uniform absolute upper',val.b,flush=True)
(ROOT/'local_derivative_bounds.json').write_text(json.dumps({'shift_range':'0<a<=1/2','v_range':'|v|<=1/1000','cells':count,'values':rows,'seconds':time.time()-start},indent=2)+'\n')
print('seconds',time.time()-start,flush=True)
