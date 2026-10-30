#!/usr/bin/env python3
from flint import arb,ctx
import json
from pathlib import Path
out={}
for bits in [192,256]:
 ctx.prec=bits;x=arb(32);r=arb(10000).log()
 margin=(x-2)*arb(2).log()-(x+1).log()-x/2
 assert margin>0 and arb(2).log()-1/(x+1)-arb(1)/2>0
 low=(r/2).exp()/4-r-15;up=(r/2).exp()-r/2-10
 assert low>0 and up>0
 assert (r/2).exp()/8-1>0
 assert 2*(arb(8)/3).log()<3 and 2*(arb(7)/2).log()<3
 assert r>6
 out[str(bits)]={'psi_lower_margin_at32':str(margin),'renormalized_lower_margin_at10000':str(low),'renormalized_upper_margin_at10000':str(up),'B3_future_error_at1e6':str(8/arb(1000000).log()**2+arb(21)/(2*arb(1000000).log()))}
Path('ELEMENTARY_ONSET_CHECKS.json').write_text(json.dumps(out,indent=2,sort_keys=True)+'\n')
print(json.dumps({'status':'PASS','precisions':[192,256],'scope':'Outward-rounded elementary onset scalar inequalities only.'},indent=2))
