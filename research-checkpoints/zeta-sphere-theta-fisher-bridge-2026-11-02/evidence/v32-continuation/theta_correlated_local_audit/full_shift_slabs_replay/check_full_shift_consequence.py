from pathlib import Path
import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=192
p=Path(__file__).parent
x=json.loads((p/'full_shift_slabs_16_4000_4000.json').read_text());pp=json.loads((p/'shift_rational_basis.json').read_text());out={}
assert x['shift_slabs']==16
for name in ['even8','odd9']:
 assert x[name]['all_passed'] and not x[name]['failed_slabs']
 assert len(x[name]['slabs'])==16
 for i,sl in enumerate(x[name]['slabs']):
  assert sl['passed'] and arb(sl['a_lo'])==arb(i)/32 and arb(sl['a_hi'])==arb(i+1)/32
  assert all(arb(v).lower()>0 for v in sl['pivot_lowers'])
 lo=[min(arb(sl['pivot_lowers'][j]).lower() for sl in x[name]['slabs']) for j in range(5)]
 lead=arb(pp[name]['coefficients'][4][4]);schur=lo[-1]/lead**2
 out[name]={'uniform_LDL_pivot_lowers':[str(v) for v in lo],'uniform_monic_schur_lower':str(schur.lower()),'scope':'All0<=a<=1/2 and0<=H<=1/8; LDL pivots not eigenvalues. GlobalH0 extension toalla>0 uses the separate outer-strip proof.'}
print(json.dumps(out,indent=2))
