"""Whole-recovery known-prefix forcing budgets from certified theta endpoints.
No new target moments or previously certified recovery gain are read.
"""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
out={}
for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
 piv=[]
 for label in ['eighth','half']:
  data=json.loads((p/'core_transport_moments_1000.json').read_text()) if label=='eighth' else json.loads((p/(f'degree{degree}_'+('regional_payment' if shift else 'half_partition')+'_4000.json')).read_text())['regions']['core']
  # Read ONLY old moments, through M5 odd or M4 even.
  mm=[ball(data['moments'][str(j+shift)]) for j in range(5)]
  d0=mm[0]; d1=mm[2]-mm[1]**2/d0
  x=mm[3]-mm[2]*mm[1]/d0
  d2=mm[4]-mm[2]**2/d0-x*x/d1
  assert all(v.lower()>0 for v in [d0,d1,d2])
  piv.append([d0,d1,d2])
 beta=[(piv[1][j]/piv[0][j]).log() for j in range(3)]
 assert all(x.lower()>0 for x in beta)
 forcing=[(beta[0].upper()*beta[1].upper()).sqrt(),((beta[0]+beta[1]).upper()*beta[2].upper()).sqrt()]
 out[name]={'log_pivot_ratios':[directed(x) for x in beta],'integrated_sqrt_forcing_over_pivot_upper':[str(x.upper()) for x in forcing],'reserve':'Every old prefix pivot stays >= its certified initial value, using separately audited local old3x3 positivity throughout the interval.','scope':'Bounds for the two append steps inside the KNOWN three-dimensional old block, not for target even6/odd7 or next even8/odd9.'}
print(json.dumps(out,indent=2))
