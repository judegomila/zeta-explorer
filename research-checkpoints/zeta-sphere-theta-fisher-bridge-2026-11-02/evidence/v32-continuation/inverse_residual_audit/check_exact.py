from fractions import Fraction as F
from pathlib import Path
import json,re
P=Path('/workspace/shared/zeta_sphere_campaign')
exec((P/'inverse_residual_new/check_trial.py').read_text().split('m=[I(')[0])
j=json.loads((P/'theta_correlated_local_audit/regional_metric_replay/degree7_regional_payment_4000.json').read_text())['regions']
def endpoint(region,k,side):
 s=j[region]['moments'][str(k)][side]
 c,e=re.fullmatch(r'\[([^ ]+) \+/- ([^]]+)\]',s).groups()
 return F(c)+(-1 if side=='lo' else 1)*F(e)
def floorq(q): return F((q*10**6).__floor__(),10**6)
def ceilq(q): return F((q*10**6).__ceil__(),10**6)
m=[I(floorq(endpoint('core',k,'lo')+endpoint('tail',k,'lo')),ceilq(endpoint('core',k,'hi')+endpoint('tail',k,'hi'))) for k in range(1,8)]
D=[[m[i+j] for j in range(3)] for i in range(3)];b=m[3:6];c=m[6];lam=F(2,25)
a=[[D[i][j]-(lam if i==j else 0) for j in range(3)] for i in range(3)]
minor=a[0][0]*a[1][1]-a[0][1]*a[1][0]
det=a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0])
assert all(q.a>0 for q in [a[0][0],minor,det])
x=[F('180888.008'),F('-15165.297'),F('253.796275')]
r=[b[i]-sum(D[i][j]*x[j] for j in range(3)) for i in range(3)]
E=sum(z.maxabs()**2 for z in r)/lam
q=c-2*sum(b[i]*x[i] for i in range(3))+sum(x[i]*D[i][j]*x[j] for i in range(3) for j in range(3))
low=q.a-E
assert low>5028566847 and low>5028000000
out={'lambda':str(lam),'minor_lowers':[str(z.a) for z in [a[0][0],minor,det]],'residual_abs_upper':[str(z.maxabs()) for z in r],'residual_cost_upper':str(E),'trial_quadratic_lower':str(q.a),'schur_lower_exact':str(low),'schur_lower_integer_floor':low.__floor__(),'strict_claim_gt_5028000000':True,'moment_input':'auditor independently replayed degree7 regional moments; reused, not regenerated'}
print(json.dumps(out,indent=2))
