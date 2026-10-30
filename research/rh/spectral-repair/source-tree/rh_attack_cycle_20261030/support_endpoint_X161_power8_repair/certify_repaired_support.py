#!/usr/bin/env python3
"""Prepared minimal eighth-power repair driver; explicit --small or --full required.

Uses the old actual head and old all-head far majorant unchanged. Only the
validated near inverse diagonal is strengthened. No accepted source mutation.
Full positivity still requires analytic review and independent complete replay.
"""
from pathlib import Path
import argparse, hashlib, json, sys, time
from flint import arb_mat, ctx
from repaired_inputs import build_inputs, far_features, NEW_PRIME_ENVELOPE, PRIME_RECEIPT, PRIME_ENUMERATOR, FAILED
from support_config import X, ACTUAL_HEAD_SOURCE, PRIME_RECEIPT as OLD_PRIME_RECEIPT, PRIME_ENUMERATOR as OLD_PRIME_ENUMERATOR
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
STRUCT=ROOT/'rh_attack_cycle_20261028/structured_inertia';sys.path.insert(0,str(STRUCT))
from certify_structured_lambda25 import near_generators, structured_eliminate, dense_ldl, dense_original, displacement_entry
from certify_structured_factored import certified_factor
SOURCES=[Path(__file__).resolve(), HERE/'repaired_inputs.py', FAILED/'support_config.py', FAILED/'generic_full_inputs.py', ACTUAL_HEAD_SOURCE, FAILED/'parameterized_near_moments.py', FAILED/'compute_moment_cache.py', FAILED/'MOMENT_CACHE_META.json', FAILED/'MOMENT_CACHE.jsonl', FAILED/'MOMENT_CACHE_COMPLETE.json', OLD_PRIME_ENUMERATOR, OLD_PRIME_RECEIPT, PRIME_ENUMERATOR, PRIME_RECEIPT, STRUCT/'certify_structured_lambda25.py', STRUCT/'certify_structured_factored.py']
def hashes():
    return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in SOURCES}
def main():
    ap=argparse.ArgumentParser(description=__doc__);group=ap.add_mutually_exclusive_group(required=True)
    group.add_argument('--small',action='store_true');group.add_argument('--full',action='store_true');args=ap.parse_args()
    started=time.time();before=hashes();ns=build_inputs();input_seconds=time.time()-started
    idx=list(range(33 if args.small else 2049));t=time.time()
    P,H=far_features(ns,idx,'even');F,hr=certified_factor(H);Q=F.transpose()*P
    xs,g,h,diag=near_generators(ns,idx,'even');diag[0]-=1
    checks=None
    if args.small:
        C,M=dense_original(ns,idx,'even',P,H);C[0,0]-=1;M[0,0]-=1
        for i in range(len(idx)):
            assert C[i,i].is_finite() and diag[i].is_finite() and (diag[i]-C[i,i]).contains(0)
            for j in range(i):
                diff=displacement_entry(xs,g,h,i,j)-C[i,j]
                assert diff.is_finite() and diff.contains(0)
        _,mr=dense_ldl(M);checks={'all_actual_dense_entries_overlap':True,'direct_full_lower_surrogate':mr}
    setup=time.time()-t;t=time.time();piv,S,cr=structured_eliminate(xs,g,h,diag,Q,True)
    if S is None:tr={'pass_positive':False,'reason':'core not certified positive'}
    else:
        T=arb_mat(Q.nrows(),Q.nrows())
        for i in range(Q.nrows()):T[i,i]=1
        _,tr=dense_ldl(T-S)
    if args.small and cr['pass_positive']:
        order=cr['elimination_order'];Cp=arb_mat([[C[i,j] for j in order] for i in order]);cp,_=dense_ldl(Cp)
        assert len(cp)==len(piv) and all(a.is_finite() and b.is_finite() and a.overlaps(b) for a,b in zip(cp,piv))
        checks['permuted_core_pivots_overlap']=True
    after=hashes();assert before==after
    passed=cr['pass_positive'] and hr['pass_positive'] and tr['pass_positive']
    out={'status':'PASS' if passed else 'FAILED_OR_INCONCLUSIVE','test_kind':'SMALL_DENSE_GATE' if args.small else 'COMPLETE_FULL_EVEN_TEST',
      'X':str(X),'lambda':f'sqrt({X})','precision_bits':ctx.prec,'N':ns['N'],'J':ns['J'],'L':ns['L'],'dimension':len(idx),'alpha':'0','rank_one_lift':False,
      'whole_prime_norm_rational_envelope':str(NEW_PRIME_ENVELOPE),'prime_norm_power':8,'exact_near_denominator_increase':'0.014520',
      'uniform_entire_even_tail_floor':ns['uniform_tail_floor'].str(110),'new_far_diagonal_floor':ns['dfar'].str(110),
      'far_reference_denominator':ns['far_reference_denominator'].str(110),'old_far_majorant_reused_unchanged':ns['far_majorant_reused_unchanged'],
      'far_method':ns['far_method'],'Cbeta':'13/10','B':'3','isotropic_remainder':ns['rem'].str(110),
      'core':cr,'coefficient_H':hr,'whitened_Schur':tr,'dense_checks':checks,
      'source_sha256_before':before,'source_sha256_after':after,'all_sources_unchanged':True,
      'input_seconds':input_seconds,'setup_generators_seconds':setup,'elimination_seconds':time.time()-t,'seconds':time.time()-started,
      'scope':'Producer gate only. Actual whole-even positivity requires complete2049head PASS plus the stronger-tail/old-far analytic implication and independent complete replay. No odd/cofinal/RH result. The failed seventh-power certificate and accepted X16.001 artifacts remain untouched.'}
    target=HERE/('REPAIRED_SMALL_DENSE_GATE.json' if args.small else 'REPAIRED_FULL_EVEN_CERTIFICATE.json')
    target.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2),flush=True)
if __name__=='__main__':main()
