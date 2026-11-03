"""Owned interval Loewner comparison using actual regional old matrices."""
import sys,json
from pathlib import Path
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=192
p=Path(__file__).parent
cases=[('odd7_eighth','degree7_eighth_partition_4000.json',1),('odd7_half','degree7_regional_payment_4000.json',1),('even6_eighth','degree6_eighth_partition_4000.json',0)]
def ball(d):
 lo=arb(d['lo']);hi=arb(d['hi']);return (lo+hi)/2+arb(0,((hi-lo)/2).upper())
def piv(a):
 d1=a[0][0]
 if not d1.lower()>0:return None
 l21=a[1][0]/d1;l31=a[2][0]/d1
 d2=a[1][1]-a[1][0]*l21
 if not d2.lower()>0:return None
 d3=a[2][2]-a[2][0]*l31-(a[2][1]-a[1][0]*l31)**2/d2
 if not d3.lower()>0:return None
 return [d1,d2,d3]
out={}
for name,f,shift in cases:
 d=json.loads((p/f).read_text())
 mats={r:[[ball(d['regions'][r]['moments'][str(i+j+shift)]) for j in range(3)] for i in range(3)] for r in ['core','tail']}
 found=None
 for k in range(-4,21):
  gamma=arb(2)**k
  q=[[gamma*mats['tail'][i][j]-mats['core'][i][j] for j in range(3)] for i in range(3)]
  pp=piv(q)
  if pp is not None:found=(k,gamma,pp);break
 assert found
 k,gamma,pp=found
 V=ball(d['directed']['variation_total']);s=ball(d['directed']['s_core'])
 lower=V/(1+gamma);paid=s+lower
 out[name]={'gamma_power_of_two':k,'gamma':str(gamma),'loewner_difference_pivot_lowers':[str(x.lower()) for x in pp],'variation_core_lower_bound':str(lower.lower()),'core_plus_metric_bound_lower':str(paid.lower()),'metric_bound_pays_core':bool(paid.lower()>0),'scope':'Certified A_core<gamma A_tail; first passing candidate on a discrete grid, not an optimal eigenvalue ratio.'}
print(json.dumps(out,indent=2))
