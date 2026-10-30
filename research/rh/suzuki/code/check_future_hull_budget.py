#!/usr/bin/env python3
import json,hashlib
from pathlib import Path
import sympy as s
from flint import arb,ctx
D,lo,hi,m=s.symbols('D lo hi m',real=True)
t=D*(hi-m)/(hi-lo)
assert s.simplify(m*t-lo*t-D*(m-lo)*(hi-m)/(hi-lo))==0
assert s.simplify((hi-lo)**2/4-(m-lo)*(hi-m)-(hi+lo-2*m)**2/4)==0
out={'scope':'Exact hull-loss algebra and outward-rounded scalar budgets only; no future endpoint lower bound.'}
for bits in [192,256]:
 ctx.prec=bits;L=arb(10000).log();eta=arb(1)/20
 assert arb(1)/2+2/L<1
 assert (arb(1)/100).exp()<2
 budgets={}
 for X in [1000000,10000000]:
  r=arb(X).log();v=3*eta/2*(1/r+1/r**2)
  if X==1000000:assert v<arb('0.005822')
  if X==10000000:assert v<arb('0.004942')
  budgets[str(X)]=str(v)
 out[str(bits)]=budgets
out['script_sha256']=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
Path('FUTURE_HULL_BUDGET_192_256BIT.json').write_text(json.dumps(out,indent=2,sort_keys=True)+'\n');print(json.dumps(out,indent=2))
