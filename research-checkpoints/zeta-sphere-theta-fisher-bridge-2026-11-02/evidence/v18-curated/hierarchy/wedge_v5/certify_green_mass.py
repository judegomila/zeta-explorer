"""Original interval Simpson certificate for C_(1/2)(0) and Green mass budget."""
import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/hierarchy')
from certify_ratio import psi
import mpmath as mp
from mpmath import iv
from math import comb
mp.mp.dps=45;iv.dps=40

def hyp(x,j):return (iv.exp(x)+(-1)**(j+1)*iv.exp(-x))/2 # sinh^(j)
def values(x):return x*hyp(x,0)*psi(x,1)[0]**2
def fourth(x):
 a=psi(x);p=[sum((comb(m,l)*a[l]*a[m-l] for l in range(m+1)),iv.mpf(0)) for m in range(5)]
 K=[x*hyp(x,j)+(j*hyp(x,j-1) if j else 0) for j in range(5)]
 return sum((comb(4,j)*K[j]*p[4-j] for j in range(5)),iv.mpf(0))
stack=[(mp.mpf(0),mp.mpf(4))];total=iv.mpf(0);leaves=0;tol=mp.mpf('1e-11')
while stack:
 lo,hi=stack.pop();mid=(lo+hi)/2;d=hi-lo
 a=values(iv.mpf(lo));b=values(iv.mpf(mid));c=values(iv.mpf(hi))
 error=abs(fourth(iv.mpf([lo,hi])))*iv.mpf(d)**5/2880
 if error.b>tol*d/4:stack.extend([(lo,mid),(mid,hi)]);continue
 total+=(a+4*b+c)*iv.mpf(d)/6+iv.mpf([-1,1])*error;leaves+=1
# h*sinh(h)*psi(h)^2 tail bounded by same 1e-400 majorant as reviewed prior certificate.
total+=iv.mpf([0,mp.mpf('1e-400')])
# Conservative serialization inflation above forty-digit conversion uncertainty.
total+=iv.mpf([-1,1])*iv.mpf('1e-30')
d=json.load(open('/workspace/shared/zeta_sphere_campaign/hierarchy/coupled_v2/moment_intervals.json'))
m1=iv.mpf(d['moments'][1])+iv.mpf([-1,1])*iv.mpf('1e-30')
q=1-m1/total+iv.mpf([-1,1])*iv.mpf("1e-30")
print('C_half_zero',total);print('q_average_limit',q);print('leaves',leaves)
with open('/workspace/shared/zeta_sphere_campaign/hierarchy/wedge_v5/green_mass_intervals.json','w') as f:
 json.dump({'C_half_zero':[str(mp.mpf(total.a)),str(mp.mpf(total.b))],'q_average_limit':[str(mp.mpf(q.a)),str(mp.mpf(q.b))],'leaves':leaves},f,indent=2)
