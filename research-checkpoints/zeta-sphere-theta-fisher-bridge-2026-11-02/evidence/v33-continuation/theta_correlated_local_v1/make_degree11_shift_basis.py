"""Candidate basis only; final proof independently verifies actual signed Grams."""
from pathlib import Path
import json,sys,mpmath as mp
p=Path(__file__).parent
sys.path.insert(0,'/workspace/shared/zeta_sphere_campaign/ball_dependencies')
from flint import arb,ctx
ctx.prec=224;mp.mp.dps=110
raw=json.loads((p.parent/'full_split_audit/actual_total_certificate.json').read_text())['moments']
mm=[(mp.mpf(x[0])+mp.mpf(x[1]))/(2*mp.mpf(4)**j) for j,x in enumerate(raw)]
out={}
for name,shift in [('even10',0),('odd11',1)]:
 B=mp.matrix([[mm[i+j+shift] for j in range(6)] for i in range(6)])
 P=mp.inverse(mp.cholesky(B)).T
 out[name]={'shift':shift,'coefficients':[[mp.nstr(P[i,j],45) for j in range(6)] for i in range(6)],'scope':'Exact decimal rational candidate generated from midpoints of existing normalized full moments, conversion Mj=muj/4^j. No prior positive-shift target signs assumed.'}
print(json.dumps(out,indent=2))
