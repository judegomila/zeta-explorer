"""Owned interval reuse of accepted prefix-only arithmetic-tail envelopes."""
import sys,json
from pathlib import Path
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=160
b=Path(__file__).parent
J=arb(64);L=arb(2).log()
factor=5*arb.pi()*L**2*(1+J.log()/L)/(1+J.log()**2/4)
out={}
for mode,cap in [('odd1','6e-18'),('even2','3e-12')]:
 data=json.loads((b/f'{mode}_midpoint_core_6000.json').read_text())
 assert data['mode']==mode
 bound=arb(data['arithmetic_tail_upper'])*factor
 assert bound<arb(cap)
 out[mode]={'M':5,'J':64,'eta_cost_tail_upper':str(bound.upper()),'certified_upper':cap,'eventual_cost_tail_sign':'negative' if mode=='odd1' else 'positive','scope':'Tail envelope uses prefix coefficients only; no pivot reserve used.'}
print(json.dumps(out,indent=2))
