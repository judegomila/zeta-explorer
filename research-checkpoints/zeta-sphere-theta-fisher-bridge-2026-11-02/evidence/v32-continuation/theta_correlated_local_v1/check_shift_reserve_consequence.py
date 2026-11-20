from pathlib import Path
import sys,json
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=192
p=Path(__file__).parent
x=json.loads((p/'shift_cutoff_reserve_4000_8000.json').read_text());basis=json.loads((p/'shift_rational_basis.json').read_text())
out={}
for name,endpoint in [('even8',arb(1)/4),('odd9',arb(1)/8)]:
 beta=arb(x[name]['base_reserve_lower']).lower();K=arb(x[name]['a_squared_cost_upper']).upper()
 reserve=beta-endpoint**2*K;assert reserve.lower()>0
 lead=arb(basis[name]['coefficients'][4][4]);schur=reserve/lead**2
 out[name]={'a_endpoint':str(endpoint),'rational_basis_reserve_lower':str(reserve.lower()),'monic_schur_lower':str(schur.lower()),'scope':'For all0<=a<=endpoint and0<=H<=1/8, actual normalized complete-theta block. Matrix reserve includes the full signed perturbation; monicSchur follows from fixed upper-triangular basis.'}
print(json.dumps(out,indent=2))
