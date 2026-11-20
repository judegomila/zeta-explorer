"""Original interval Simpson code for full-theta m0,m1,m2; imports reviewed original profile code."""
import sys, json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/hierarchy')
from certify_ratio import psi
import mpmath as mp
from mpmath import iv
from math import comb,factorial
mp.mp.dps=45;iv.dps=40
ks=[0,2,4]
def vals(x):
 p=psi(x,1)[0]**2
 return [x**k*p for k in ks]
def fourth(x):
 a=psi(x)
 p=[sum((comb(m,l)*a[l]*a[m-l] for l in range(m+1)),iv.mpf(0)) for m in range(5)]
 return [sum((comb(4,j)*(factorial(k)//factorial(k-j))*x**(k-j)*p[4-j] for j in range(min(k,4)+1)),iv.mpf(0)) for k in ks]
stack=[(mp.mpf(0),mp.mpf(4))];tot=[iv.mpf(0) for k in ks];leaves=0
# Absolute tolerance per moment, not reliant on numerical estimates.
tol=mp.mpf('1e-10')
while stack:
 lo,hi=stack.pop();mid=(lo+hi)/2;d=hi-lo
 a=vals(iv.mpf(lo));b=vals(iv.mpf(mid));c=vals(iv.mpf(hi));dd=fourth(iv.mpf([lo,hi]))
 errs=[abs(x)*iv.mpf(d)**5/2880 for x in dd]
 if any(e.b>tol*d/4 for e in errs):stack.extend([(lo,mid),(mid,hi)]);continue
 for j in range(3):tot[j]+=(a[j]+4*b[j]+c[j])*iv.mpf(d)/6+iv.mpf([-1,1])*errs[j]
 leaves+=1
# Same integration tail bound as certificate note; k<=4 only improves h>=4 estimate.
tot=[x+iv.mpf([0,mp.mpf('1e-400')]) for x in tot]
negative_mass=(iv.sqrt(tot[0]*tot[2])-tot[1])/4
fraction=negative_mass/tot[1]
print('leaves',leaves)
for k,x in enumerate(tot):print('m'+str(k),x)
print('negative_mass',negative_mass);print('fraction',fraction)
with open('/workspace/shared/zeta_sphere_campaign/hierarchy/coupled_v2/moment_intervals.json','w') as f:
 json.dump({'moments':[[str(mp.mpf(x.a)),str(mp.mpf(x.b))] for x in tot], 'negative_mass':[str(mp.mpf(negative_mass.a)),str(mp.mpf(negative_mass.b))], 'fraction':[str(mp.mpf(fraction.a)),str(mp.mpf(fraction.b))]},f,indent=2)
