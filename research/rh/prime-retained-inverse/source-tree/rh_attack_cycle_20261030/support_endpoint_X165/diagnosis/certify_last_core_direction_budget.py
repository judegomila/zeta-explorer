#!/usr/bin/env python3
"""Fresh energy budget of the exact rational last-core-pivot proposal.

Midpoint factor fidelity is not used to assert negativity; every actual head entry
and every near row is freshly evaluated on the exact frozen decimal coefficients.
"""
from pathlib import Path
from fractions import Fraction as Q
import sys,json,hashlib,time
from flint import arb,arb_mat,ctx
HERE=Path(__file__).resolve().parent;BASE=HERE.parent;ROOT=BASE.parents[1]
sys.path.insert(0,str(BASE));from generic_full_inputs import build_inputs,far_features
from certify_generic_support import SOURCES
SRC=HERE/'LAST_CORE_FROZEN_TRIAL.json'
start=time.time();ctx.prec=1000
pins=lambda:{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in SOURCES+[Path(__file__).resolve(),SRC]}
before=pins();trial=json.loads(SRC.read_text());assert trial['X']=='33/2';coords=trial['coordinates'];n=len(coords);assert n==2049
# From here the exact decimal coefficients are the mathematical trial vector.
v=[arb(s) for s in coords];ns=build_inputs();norm=sum((x*x for x in v),arb(0));aa=[arb(1)]+[ns['sq2']*(-1)**k for k in range(1,n)];av=[x*y for x,y in zip(aa,v)];t=[k*ns['b'][k] for k in range(n)]
actual=sum((v[k]**2*ns['ed'][k] for k in range(n)),arb(0))
for j in range(1,n):actual+=2*av[j]*sum((av[k]*(t[j]-t[k])/(j*j-k*k) for k in range(j)),arb(0))
rows=[];near=arb(0);bands=[arb(0),arb(0),arb(0)]
for j in range(ns['N']+1,ns['J']+1):
 val=ns['sq2']*sum((av[k]*(j*ns['b'][j]-t[k])/(j*j-k*k) for k in range(n)),arb(0));square=val*val;d=ns['ds'][j]
 rows.append((square,d));charge=square/d;near+=charge;bands[0 if j<=4096 else 1 if j<=8192 else 2]+=charge
 if j%4096==0:print('fresh near row',j,'seconds',time.time()-start,flush=True)
P,H=far_features(ns,list(range(n)),'even');z=P*arb_mat([[x] for x in v]);farH=(z.transpose()*H*z)[0,0];rem=ns['rem']*norm
near_at=lambda delta:sum((s/(d+arb(delta.numerator)/delta.denominator) for s,d in rows),arb(0))
serialize=lambda x:x.str(110)
# Monotone root bracketing for this fixed vector only. No support, precision,
# prime-power or full-matrix sweep is performed or hidden in this scalar solve.
def threshold(extra):
 base=actual-near-extra
 if base>0:return {'status':'ALREADY_POSITIVE_FOR_THIS_DIRECTION','delta':'0','rayleigh':serialize(base/norm)}
 assert base<0
 if not actual-extra>0:return {'status':'NEAR_DENOMINATOR_CHANGE_ALONE_NOT_SUFFICIENT_FOR_THIS_DIRECTION'}
 lo=Q(0);hi=Q(1,100)
 while not actual-near_at(hi)-extra>0:
  hi*=2
  assert hi<=1,'No bounded conditional threshold found'
 for _ in range(32):
  mid=(lo+hi)/2;val=actual-near_at(mid)-extra
  assert val>0 or val<0,'Uncertain threshold sign'
  if val>0:hi=mid
  else:lo=mid
 vlo=(actual-near_at(lo)-extra)/norm;vhi=(actual-near_at(hi)-extra)/norm
 assert vlo<0 and vhi>0
 return {'status':'EXACT_MONOTONE_CONDITIONAL_THRESHOLD_BRACKET_FOR_THIS_DIRECTION_ONLY','negative_delta':str(lo),'positive_delta':str(hi),'negative_delta_decimal':serialize(arb(lo.numerator)/lo.denominator),'positive_delta_decimal':serialize(arb(hi.numerator)/hi.denominator),'negative_rayleigh':serialize(vlo),'positive_rayleigh':serialize(vhi),'required_prime_envelope_for_direction_sufficiency':serialize(ns['Pschur']-arb(hi.numerator)/hi.denominator)}
core=(actual-near-rem)/norm;full=(actual-near-rem-farH)/norm
out={'status':'STRICTLY_NEGATIVE_FROZEN_LAST_CORE_PROPOSAL' if core<0 else 'LAST_CORE_PROPOSAL_NOT_NEGATIVE_OR_INCONCLUSIVE','X':'33/2','precision_bits':ctx.prec,'is_exact_original_last_pivot_witness':False,'proposal_from_matching_actual_last_pivot':True,'norm_squared':serialize(norm),'actual_rayleigh':serialize(actual/norm),'complete_near_rayleigh':serialize(near/norm),'post_near_rayleigh':serialize((actual-near)/norm),'isotropic_remainder_rayleigh':serialize(rem/norm),'core_rayleigh':serialize(core),'far_H_rayleigh':serialize(farH/norm),'full_surrogate_rayleigh':serialize(full),'near_band_rayleigh':{k:serialize(x/norm) for k,x in zip(['2049..4096','4097..8192','8193..16384'],bands)},'core_conditional_denominator_threshold':threshold(rem),'full_surrogate_with_old_far_conditional_threshold':threshold(rem+farH),'source_sha256_before':before,'source_sha256_after':pins(),'trial_sha256':hashlib.sha256((HERE/'LAST_CORE_FROZEN_TRIAL.json').read_bytes()).hexdigest(),'seconds':time.time()-start,'scope':'One exact rational direction with fresh actual X33/2 entries and every near row. Conditional denominator thresholds are necessary/sufficient only for this direction and retained sufficient surrogate, never a proof of a new prime bound or a full positivity certificate. Negative surrogate is not actual negative Weil energy.'}
assert out['source_sha256_before']==out['source_sha256_after']
(HERE/'LAST_CORE_DIRECTION_BUDGET.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2),flush=True)
