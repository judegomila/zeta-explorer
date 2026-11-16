"""Uniform LDL pivot lower bounds and monic Schur lower bound for even10 and odd11
from a check_degree11_shift_slabs.py output. Mirrors check_degree10_consequence.py
(same asserts, same formula lo[-1]/P55^2). Usage: python consequence_both.py OUT.json BASIS.json"""
import sys,json
from pathlib import Path
from flint import arb,ctx
ctx.prec=224
x=json.loads(Path(sys.argv[1]).read_text());pp=json.loads(Path(sys.argv[2]).read_text())
res={'run':{k:x[k] for k in ['shift_slabs','tail_cells','cutoff_cells','bits']}}
for name in ['even10','odd11']:
 e=x[name];assert e['all_passed'] and not e['failed_slabs'] and len(e['slabs'])==16
 for i,s in enumerate(e['slabs']):
  assert s['passed'] and arb(s['a_lo'])==arb(i)/32 and arb(s['a_hi'])==arb(i+1)/32
  assert len(s['pivot_lowers'])==6 and all(arb(v).lower()>0 for v in s['pivot_lowers'])
 lo=[min(arb(s['pivot_lowers'][j]).lower() for s in e['slabs']) for j in range(6)]
 lead=arb(pp[name]['coefficients'][5][5]);schur=lo[-1]/lead**2
 res[name]={'uniform_LDL_pivot_lowers':[v.str(12) for v in lo],'leading_coefficient_P55':pp[name]['coefficients'][5][5],'uniform_monic_schur_lower':schur.lower().str(15)}
print(json.dumps(res,indent=1))
