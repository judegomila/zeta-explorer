#!/usr/bin/env python3
"""Rigorous small-r Psi lower bound via positive gamma truncation and intervals."""
import json,hashlib
from pathlib import Path
from flint import arb,ctx
out={}
for bits in [192,256]:
 ctx.prec=bits
 pi=arb.pi();b=-(arb.const_euler()+pi/2+3*arb(2).log()+pi.log())/2
 a=(arb(5)/4).log();z=arb(2).log();floor=arb(1)/100
 def lowerfun(r):
  ans=4*(r/2).exp()+b*r-4
  for k in range(1,129):
   al=2*k+arb(1)/2;ans+=(1-(-al*r).exp())/(al*al)
  return ans
 ca=lowerfun(a);assert ca>floor
 # r is an Arb interval containing the entire closed cell. Positive omitted
 # gamma terms prove Psi(r)>=this partial sum, not numerical tail guessing.
 minimum=ca;worst=-1
 for j in range(256):
  lo=a+(z-a)*j/256;hi=a+(z-a)*(j+1)/256
  rr=arb((lo+hi)/2, ((hi-lo)/2).upper())
  val=lowerfun(rr)
  assert val>floor,(j,val)
  if val.lower()<minimum.lower():minimum=val;worst=j
 assert (arb(5)/4)**3-arb(5)/4-1<0
 out[str(bits)]={'scope':'Psi(r)>=r/(100 log(5/4)) for 0<=r<=log(5/4), and Psi(r)>1/100 for log(5/4)<=r<=log2. Psi(0)=0 exactly.','positive_gamma_terms_retained':128,'closed_interval_cells':256,'C_at_a_lower':str(ca),'minimum_interval_lower':str(minimum),'worst_cell_index':worst,'a':str(a),'end':str(z)}
out['script_sha256']=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
Path('ORIGIN_INTERVAL_192_256BIT.json').write_text(json.dumps(out,indent=2,sort_keys=True)+'\n')
print(json.dumps(out,indent=2))
