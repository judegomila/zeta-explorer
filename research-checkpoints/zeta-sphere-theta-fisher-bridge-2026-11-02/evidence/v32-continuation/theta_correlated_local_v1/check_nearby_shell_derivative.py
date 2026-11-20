"""Owned interval test of actual moving-core regression; no target integral input."""
from pathlib import Path
import json
p=Path(__file__).parent
# Definitions from our independently reviewed full-theta interval implementation.
src=(p/'check_degree7_regional_payment.py').read_text();exec(src[:src.index('sums=')])
src2=(p/'check_three_region_payment.py').read_text();exec(src2[src2.index('def ball'):src2.index('out={}')])
def directed(x):return {'lo':str(x.lower()),'hi':str(x.upper())}
out={};delta=arb(1)/10**8
for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
 data=json.loads((p/f'degree{degree}_eighth_partition_4000.json').read_text())
 # Old matrix and target cross column only: exclude unknown/unused top moment.
 m0=[arb(0)]+[ball(data['regions']['core']['moments'][str(j+shift)]) for j in range(6)]+[arb(0)]
 u=arb(1)/8+delta/2+arb(0,(delta/2).upper());local=calc(u,False)
 m=[arb(0)]+[m0[j+1]+arb(0,(delta*abs(local[j+shift]).upper()).upper()) for j in range(6)]+[arb(0)]
 _,zc,dc=solve(m)
 lm=[arb(0)]+local[shift:shift+7]
 sl,zl,dl=solve(lm)
 v=quad(dl,[a-b for a,b in zip(zc,zl)]);deriv=sl+v
 assert (deriv.lower()>0 if shift else deriv.upper()<0)
 out[name]={'interval':['1/8','1/8+1/100000000'],'old_core_pivots':[directed(x) for x in dc[:3]],'local_old_pivots':[directed(x) for x in dl[:3]],'local_signed_target_schur':directed(sl),'actual_regression_mismatch':directed(v),'core_schur_derivative':directed(deriv),'read_moment_indices':list(range(shift,6+shift)),'scope':'Entire stated cutoff interval, actual core inverse enclosure. No target integral loaded. Local target source is computed from full theta; negative local term retained.'}
print(json.dumps(out,indent=2))
