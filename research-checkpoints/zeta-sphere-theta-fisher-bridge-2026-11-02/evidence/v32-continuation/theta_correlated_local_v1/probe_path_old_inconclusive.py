from pathlib import Path
p=Path('/workspace/shared/zeta_sphere_campaign/theta_correlated_local_v1');s=(p/'check_degree7_regional_payment.py').read_text();exec(s[:s.index('sums=')]);s=(p/'check_three_region_payment.py').read_text();exec(s[s.index('def ball'):s.index('out={}')])
N=1000;mins=[None,None]
for i in range(N):
 u=arb(1)/8+arb(3)*(2*i+1)/(16*N)+arb(0,arb(3)/(16*N));loc=calc(u,False)
 for j in [0,1]:
  try:_,_,ds=solve([arb(0)]+loc[j:j+7]);val=ds[2].lower();mins[j]=val if mins[j] is None or val<mins[j] else mins[j]
  except Exception:print('FAIL',i,j,flush=True);raise
print('PASS',mins)
