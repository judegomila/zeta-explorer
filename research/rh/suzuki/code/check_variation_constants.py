#!/usr/bin/env python3
"""Exact variation algebra and outward-rounded scalar gates; no prime scan."""
import argparse,json,hashlib
from pathlib import Path
import sympy as s
from flint import arb,ctx
ap=argparse.ArgumentParser();ap.add_argument('--bits',type=int,default=192);ap.add_argument('--output',default='VARIATION_CHECKS_192BIT.json');a=ap.parse_args();ctx.prec=a.bits
r,H,d=s.symbols('r H d', positive=True);B=s.symbols('B',positive=True)
w=r*s.exp(-r/2);ell=r-2*s.log(H/2);f=w*ell
checks={}
def ck(k,x):
 assert s.simplify(x)==0,(k,x)
 checks[k]='exact symbolic zero'
ck('flow_derivative',s.diff(f,r)+s.diff(f,H)/2-(s.diff(w,r)*ell+w*(1-1/H)))
ck('subcritical_integral',s.diff(s.exp(-d*r)*(r/d+1/d**2),r)+r*s.exp(-d*r))
ck('power_stieltjes_derivative',s.diff(r*s.exp(-(1+d)*r),r)+s.exp(-(1+d)*r)*((1+d)*r-1))
ck('critical_continuous_integral',s.diff(r**(2-B)/(B-2),r)+r**(1-B))
ck('critical_stieltjes_derivative',s.diff(r**(1-B)*s.exp(-r),r)+s.exp(-r)*(r**(1-B)+(B-1)*r**(-B)))
ck('unweighted_constant',6*r+s.Rational(17,2)*(2*r+4)-(23*r+34))
R=arb(512)
assert arb(2).log()>arb(2)/3
assert 2*(arb(7)/2).log()<3
assert (R/2).exp()>4*R**3
assert R/2+10<(R/2).exp()
assert (R/2).exp()/4>1
assert arb.const_euler()>0 and arb.const_euler()<1
out={'scope':'Exact algebra and scalar gates only. No prime sequence is enumerated and no global signed credit estimate is certified.','bits':a.bits,'exact_checks':checks,'scalar_intervals':{'two_log_7_over_2':str(2*(arb(7)/2).log()),'log2_minus_two_thirds':str(arb(2).log()-arb(2)/3),'critical_B3_tail_at512':str(6/R**2+arb(17)/(2*R)),'unweighted_tail_at512':str((23*R+34)*(-R/2).exp())},'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
Path(a.output).write_text(json.dumps(out,indent=2,sort_keys=True)+'\n');print(json.dumps({'status':'PASS','bits':a.bits,'output':a.output,'exact_checks':len(checks)},indent=2))
