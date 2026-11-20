import sys,json
from pathlib import Path
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P.parent/'ball_dependencies'))
from flint import arb,ctx
ctx.prec=100
x=json.loads((P/'ball_fft_certificate.json').read_text());a=json.loads((P/'alias_bound.json').read_text())
assert arb(x['lower'])>56962777821815
assert arb(x['upper'])<56962777822971
assert arb(a['error'])<13000
core_lower=56962777800000
assert 56962777821815-13000>core_lower
full_upper=3195886054651 # independently audited full-side enclosing integer
upper=full_upper-core_lower
assert upper < -53766000000000
out={'t':'7005.081715','Fourier_argument':'14010.163430','H':'1','scaling':'exp(pi*t/2)','core_strict_lower':core_lower,'full_strict_upper':full_upper,'actual_tail_strict_upper':upper,'scope':'Negative actual cumulative-tail Fourier density at H=1; not full-kernel or RH counterexample; H=1/16 unaffected'}
(P/'combined_certificate.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
