from pathlib import Path
import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=224
p=Path(__file__).parent
x=json.loads((p/'degree11_shift_slabs_16_4000_4000.json').read_text());pp=json.loads((p/'degree11_shift_rational_basis.json').read_text())
e=x['even10'];assert e['all_passed'] and not e['failed_slabs'];assert len(e['slabs'])==16
for i,s in enumerate(e['slabs']):
 assert s['passed'] and arb(s['a_lo'])==arb(i)/32 and arb(s['a_hi'])==arb(i+1)/32
 assert len(s['pivot_lowers'])==6 and all(arb(v).lower()>0 for v in s['pivot_lowers'])
lo=[min(arb(s['pivot_lowers'][j]).lower() for s in e['slabs']) for j in range(6)]
lead=arb(pp['even10']['coefficients'][5][5]);schur=lo[-1]/lead**2
print(json.dumps({'even10':{'uniform_LDL_pivot_lowers':[str(v) for v in lo],'uniform_monic_schur_lower':str(schur.lower())},'odd11':{'status':'INCONCLUSIVE','failed_slabs':x['odd11']['failed_slabs']},'scope':'Even10 compact a[0,1/2],H[0,1/8] only from this run. Accepted odd9 and outerstrip argument give globalH10 foralla>0. NoH11 claim.'},indent=2))
