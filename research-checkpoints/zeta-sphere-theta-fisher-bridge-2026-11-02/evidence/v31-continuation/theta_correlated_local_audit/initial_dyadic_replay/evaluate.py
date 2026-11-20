import json,sys
from pathlib import Path
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=160
p=Path(__file__).parent
out={}
def iv(d):
 l=arb(d['lower']);h=arb(d['upper']);return (l+h)/2+arb(0,((h-l)/2).upper())
for mode in ('odd0','even1'):
 d=json.loads((p/(mode+'.json')).read_text());b={int(k):iv(v) for k,v in d['b_m'].items()}
 L=arb(2).log();dt=arb(d['eta_tail_bound'])*7/15
 V=2*arb.pi()*L**2*sum(m*b[m] for m in range(1,6))
 V+=(-1 if mode=='odd0' else 1)*(dt/2+arb(0,(dt/2).upper()))
 Y=(iv(d['h'])-V)/(4*arb.pi())
 out[mode]={'dyadic_piece_lo':str(V.lower()),'dyadic_piece_hi':str(V.upper()),'Y_lo':str(Y.lower()),'Y_hi':str(Y.upper()),'h':d['h'],'E':d['E'],'negative_D':bool(V.upper()<0)}
print(json.dumps(out,indent=2))
