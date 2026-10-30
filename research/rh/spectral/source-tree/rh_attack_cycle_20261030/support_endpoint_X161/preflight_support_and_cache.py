#!/usr/bin/env python3
"""Fresh actual scalar/entry and incompatible-cache rejection gates."""
from pathlib import Path
import hashlib,json,sys,time,copy
from flint import arb,ctx
from support_config import X,PRIME_ENVELOPE,PRIME_RECEIPT,ACTUAL_HEAD_SOURCE
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(ACTUAL_HEAD_SOURCE.parent))
from generic_actual_head_pilot import inputs,literal_prime_entry
from compute_moment_cache import META,validate,worker
ctx.prec=1000;start=time.time();ns=inputs(X,32,1000)
W,pi,sh=ns['W'],ns['pi'],ns['sh'];terms=ns['terms']
assert [n for n,w in terms]==[2,3,4,5,7,8,9,11,13,16]
C=(2*W*sh+arb(1)/2+arb(55)*W*W/48)/(pi*pi)
beta=arb(1)/4+sum((w for n,w in terms),arb(0))/pi
assert C<arb(13)/10 and beta+C/2<3 and abs(ns['b'][1])<3
receipt=json.loads(PRIME_RECEIPT.read_text())['runs'][0]
assert receipt['X']==str(X)
assert arb(receipt['seventh_power_schur_norm_upper'])<arb(PRIME_ENVELOPE.numerator)/PRIME_ENVELOPE.denominator
idx=[0,1,2,7,16,32]
for j in idx:
 for k in idx:
  a=ns['element'](j,k,True);b=literal_prime_entry(ns,j,k)
  assert a.is_finite() and b.is_finite() and (a-b).contains(0)
row=worker((16,2,16384));validate(row)
wrong=copy.deepcopy(row);wrong['analytic_key']['X']='16001/1000'
rejected=False
try:validate(wrong)
except AssertionError:rejected=True
assert rejected
out={'status':'PASS_FRESH_SUPPORT_PREFLIGHT','X':str(X),'active_prime_list':[n for n,w in terms],'all36_literal_prime_entries_overlap_finitely':True,'Cbeta_formula':C.str(100),'Cbeta13over10_reverified':True,'B3_j_ge2_envelope':(beta+C/2).str(100),'b1':ns['b'][1].str(100),'B3_reverified':True,'fresh_prime_norm_envelope':str(PRIME_ENVELOPE),'fresh_prime_receipt_X_matches':True,'incompatible_X_cache_entry_rejected':True,'sample_restored_bits':row['restored_min_relative_accuracy_bits'],'cache_meta':META,'seconds':time.time()-start,'source_sha256':{str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__).resolve(),ACTUAL_HEAD_SOURCE,PRIME_RECEIPT]},'scope':'New support literal-entry/scalar/cache-isolation gate only. No full corrected matrix positivity.'}
(HERE/'PREFLIGHT_SUPPORT_AND_CACHE.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
