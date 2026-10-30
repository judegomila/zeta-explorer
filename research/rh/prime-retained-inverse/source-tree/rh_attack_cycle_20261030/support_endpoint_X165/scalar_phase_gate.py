#!/usr/bin/env python3
"""Fresh exact-X scalar and separated-phase gate. Not support positivity."""
from pathlib import Path
from fractions import Fraction as Q
import sys,json,hashlib,time
from flint import arb,acb,ctx
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
ACTUAL=HERE.parent/'support_endpoint_continuity/generic_actual_head_pilot.py'
sys.path.insert(0,str(ACTUAL.parent))
from generic_actual_head_pilot import inputs,literal_prime_entry
X=Q(33,2);N=2048;J=16384;L=36
start=time.time();ns=inputs(X,32,1000);W,pi,sh=ns['W'],ns['pi'],ns['sh']
C=(2*W*sh+arb(1)/2+arb(55)*W*W/48)/(pi*pi)
beta=arb(1)/4+sum((w for n,w in ns['terms']),arb(0))/pi
assert C<arb(13)/10 and beta+C/2<3 and abs(ns['b'][1])<3
for j in [0,1,2,7,16,32]:
 for k in [0,1,2,7,16,32]:
  a=ns['element'](j,k,True);b=literal_prime_entry(ns,j,k)
  assert a.is_finite() and b.is_finite() and (a-b).contains(0)
raw={Q(1):acb(arb(1)/4)}
for n,w in ns['terms']:raw[Q(n)]=acb(0,-w/(2*pi));raw[Q(1,n)]=acb(0,w/(2*pi))
squared={}
for r,cr in raw.items():
 for s,cs in raw.items():squared[r*s]=squared.get(r*s,acb(0))+cr*cs
# Exact multiplicative reduction proves whether a ratio equals X^k.
def reduce(r):
 while r>=X:r/=X
 while r<1:r*=X
 return r
assert [r for r in squared if reduce(r)==1]==[Q(1)]
constants=[];phase_rows=[]
for name,coeff in [('AA',squared),('AC',raw)]:
 total=arb(0)
 for r,c in coeff.items():
  if r==1:continue
  theta=2*pi*(arb(r.numerator)/r.denominator).log()/W;den=abs(1-acb(0,theta).exp())
  assert den.is_finite() and den>0
  total+=2*abs(c)/den
  if name=='AA':phase_rows.append({'ratio':str(r),'exact_reduced_ratio':str(reduce(r)),'denominator':den.str(90)})
 constants.append(total)
gamma=arb('1.853')+arb(3)/(5*W)+arb(4)/5*(-5*W/2).exp()/(1-(-2*W).exp())
HK=W*(W+2*(1-(-W/2).exp()))/(2*pi*pi)
arch=acb(arb(5)/4,pi*(N+1)/W).digamma().real-pi.log()
out={'status':'PASS_EXACT_SCALAR_AND_ALL_SEPARATED_PHASE_GATES_ONLY','X':str(X),'precision_bits':ctx.prec,'lambda':(arb(X.numerator)/X.denominator).sqrt().str(90),'active_prime_powers':[n for n,w in ns['terms']],'prime_count':len(ns['terms']),'all_36_literal_prime_entries_overlap':True,'Cbeta_formula':C.str(90),'Cbeta':'13/10','beta_abs_bound':beta.str(90),'B3_j_ge2_bound':(beta+C/2).str(90),'b1':ns['b'][1].str(90),'B':'3','raw_phase_count':len(raw),'square_ratio_count':len(squared),'exact_grouped_square_count':len({reduce(r) for r in squared}),'only_identity_phase_is_ratio_one':True,'all_nonidentity_denominators_positive':True,'min_separated_denominator':min(arb(r['denominator']).lower() for r in phase_rows).str(90),'Cosc_all_separated':constants[0].str(90),'Clin_all_separated':constants[1].str(90),'maximum_prime_envelope_for_positive_tail':(arch-gamma-HK/N).str(90),'phase_rows':phase_rows,'seconds':time.time()-start,'sources':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__).resolve(),ACTUAL]},'scope':'Actual 33-mode entry check, fresh asymptotic coefficient envelopes and complete phase classification only. No compatible moment cache exists or is needed for the proposed all-separated treatment. No new endpoint, full positivity or RH claim.'}
(HERE/'SCALAR_PHASE_GATE.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:v for k,v in out.items() if k!='phase_rows'},indent=2))
