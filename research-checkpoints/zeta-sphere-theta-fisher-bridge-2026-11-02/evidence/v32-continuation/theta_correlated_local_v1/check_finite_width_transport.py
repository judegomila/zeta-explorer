"""Owned finite-width signed transport from certified regional moments."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_three_region_payment.py').read_text();exec(s[:s.index('out={}')])
out={}
for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
 small=json.loads((p/f'degree{degree}_eighth_partition_4000.json').read_text());large=json.loads((p/(f'degree{degree}_'+('regional_payment' if shift else 'half_partition')+'_4000.json')).read_text())
 def moments(x):return [arb(0)]+[ball(x['regions']['core']['moments'][str(j+shift)]) for j in range(7)]
 C=moments(small);P=moments(large);M=sub(P,C)
 sc,zc,dc=solve(C);sp,zp,dp=solve(P);sm,zm,dm=solve(M)
 J=sm+quad(dm,sub(zc,zm));K=quad(dp,sub(zp,zc))
 V=quad(dc,sub(zc,zp))+quad(dm,sub(zm,zp))
 stable=sm+V;direct=sp-sc;recovered=sc+stable
 assert stable.lower()>0 and recovered.lower()>0
 out[name]={'source_J':directed(J),'adaptation_K':directed(K),'uncorrelated_gain':directed(J-K),'correlated_gain':directed(stable),'endpoint_gain_crosscheck':directed(direct),'recovered_core':directed(recovered),'gain_fraction_of_source':{'lo':str(stable.lower()/J.upper()),'hi':str(stable.upper()/J.lower())},'scope':'Existing certified finite recovery; no new integration or rung. Initial and final actual regressions, all signed source and adaptation retained. Stable identity uses independently PD middle old block in these examples only.'}
print(json.dumps(out,indent=2))
