#!/usr/bin/env python3
"""Minimal targeted repair: stronger near inverse; old far H/rem unchanged.

PREPARED FOR REVIEW, NOT A FULL POSITIVITY RESULT. Exact support stays161/10.
The old support-keyed raw moment cache is compatible and remains unmodified.
"""
from pathlib import Path
import sys,json,hashlib
from fractions import Fraction as Q
from flint import arb
HERE=Path(__file__).resolve().parent
FAILED=HERE.parent/'support_endpoint_X161'
ROOT=HERE.parents[1]
sys.path.insert(0,str(FAILED))
import generic_full_inputs as old_inputs
from support_config import X
assert X==Q(161,10)
NEW_PRIME_ENVELOPE=Q(3790593,1000000)
PRIME_RECEIPT=FAILED/'diagnosis/X161_POWER8_TARGETED.json'
PRIME_ENUMERATOR=FAILED/'diagnosis/X161_power8_targeted.py'

def build_inputs(bits=1000,order=36):
    ns=old_inputs.build_inputs(bits,order)
    oldP=ns['Pschur'];oldfar=ns['dfar'];oldH=ns['weighted_signed_H'];oldrem=ns['rem']
    newP=arb(NEW_PRIME_ENVELOPE.numerator)/NEW_PRIME_ENVELOPE.denominator
    r=json.loads(PRIME_RECEIPT.read_text())['runs'][0]
    assert r['X']==str(X) and r['prime_count']==10 and len(r['state_counts'])==8
    norm=arb(r['eighth_power_schur_norm_upper']);assert norm.is_finite() and norm<newP
    delta=oldP-newP;assert delta>arb(1)/100
    # The actual head/coupling stays identical. Only the valid full-tail lower
    # comparison and exact near diagonal inverse weights are strengthened.
    ns['ds']={j:d+delta for j,d in ns['ds'].items()}
    ns['uniform_tail_floor']+=delta;ns['dfar']+=delta;ns['Pschur']=newP
    def dnew(j):return ns['arch'](j)-ns['gamma']-newP-ns['HK']/ns['N']
    for a,w in zip(ns['step_endpoints'],ns['step_inverse_weights']):
        assert w>1/dnew(a+1)
    # For all future j, monotonicity of dnew and these original old steps imply
    # 1/dnew_j <=1/dold_j <=old omega_j. Thus old H and rem are still valid.
    assert ns['weighted_signed_H'] is oldH and ns['rem'] is oldrem
    ns.update(far_reference_prime_envelope=oldP,far_reference_denominator=oldfar,
              far_majorant_reused_unchanged=True,prime_norm_power=8,
              exact_prime_envelope_improvement='0.014520',
              far_method='unchanged audited X161 old far H/rem; stronger eighth-power diagonal inverse in near range only')
    return ns

far_features=old_inputs.far_features

if __name__=='__main__':
    n=build_inputs()
    out={'status':'PASS_SCALAR_WRAPPER_PREFLIGHT_NOT_FULL_TEST','X':str(X),'new_prime_envelope':str(NEW_PRIME_ENVELOPE),'exact_denominator_increase':'0.014520','uniform_tail_floor':n['uniform_tail_floor'].str(100),'new_far_diagonal_floor':n['dfar'].str(100),'old_far_reference_floor':n['far_reference_denominator'].str(100),'old_far_H_and_rem_unchanged':True,'all_old_inverse_steps_dominate_new_diagonal_inverse':True,'source_sha256':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__).resolve(),FAILED/'generic_full_inputs.py',FAILED/'support_config.py',FAILED/'MOMENT_CACHE.jsonl',PRIME_ENUMERATOR,PRIME_RECEIPT]},'scope':'Scalar/source implication gate only. No repaired complete head or full positivity test has run.'}
    (HERE/'REPAIR_WRAPPER_PREFLIGHT.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
