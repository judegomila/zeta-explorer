"""Owned interval consequences of actual low-shift outputs; no extra quadrature."""
import json,sys
from pathlib import Path
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=160
p=Path(__file__).parent
out={}
def interval(d):
 lo=arb(d['lower']);hi=arb(d['upper']);return (lo+hi)/2+arb(0,((hi-lo)/2).upper())
for mode in ['odd0','even1']:
 d=json.loads((p/f'{mode}_dyadic_signs.json').read_text())
 b={int(k):interval(v) for k,v in d['b_m'].items()}
 L=arb(2).log();pi=arb.pi()
 # 2pi L² sum_(m>=6) m b_m tail <= (7/15)*eta_tail_bound at J=64.
 # General proof supplied in note, retaining actual polynomial W.
 dt=arb(d['eta_tail_bound'])*arb(7)/15
 Dmain=sum(m*b[m] for m in range(1,6))
 Dyad=2*pi*L**2*Dmain+(1 if mode=='even1' else -1)*(dt/2+arb(0,(dt/2).upper()))
 h=interval(d['h']);E=interval(d['E'])
 Y=(h-Dyad)/(4*pi)
 X1=b[1]-2*b[2]+b[3]
 assert Dyad.upper()<0 if mode=='odd0' else Y.upper()<0

 out[mode]={'X1':{'lower':str(X1.lower()),'upper':str(X1.upper())},
 'dyadic_target_piece':{'lower':str(Dyad.lower()),'upper':str(Dyad.upper())},
 'remaining_Y_aggregate':{'lower':str(Y.lower()),'upper':str(Y.upper())},
 'h_over_E_lower':str((arb(d['h']['lower'])/arb(d['E']['upper'])).lower()),
 'h_over_E_upper':str((arb(d['h']['upper'])/arb(d['E']['lower'])).upper()),
 'scope':'Finite consequences of actual prefix-only integrals, not an all-degree sign rule.'}
print(json.dumps(out,indent=2))
