#!/usr/bin/env python3
"""Staged generic rational support certificate. No accepted source mutation."""
from pathlib import Path
import argparse,hashlib,json,sys,time
from flint import arb,arb_mat,ctx
from support_config import X,PRIME_ENVELOPE,PRIME_RECEIPT,PRIME_ENUMERATOR,ACTUAL_HEAD_SOURCE
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[1]
STRUCT=ROOT/'rh_attack_cycle_20261028/structured_inertia';sys.path.insert(0,str(STRUCT))
from generic_full_inputs import build_inputs,far_features
from certify_structured_lambda25 import near_generators,structured_eliminate,dense_ldl,dense_original,displacement_entry
from certify_structured_factored import certified_factor
SOURCES=[Path(__file__).resolve(),HERE/'support_config.py',HERE/'generic_full_inputs.py',ACTUAL_HEAD_SOURCE,HERE/'scalar_phase_gate.py',HERE/'SCALAR_PHASE_GATE.json',PRIME_ENUMERATOR,PRIME_RECEIPT,STRUCT/'certify_structured_lambda25.py',STRUCT/'certify_structured_factored.py']
def hashes():return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in SOURCES}
def main():
    ap=argparse.ArgumentParser();mode=ap.add_mutually_exclusive_group(required=True);mode.add_argument('--small',action='store_true');mode.add_argument('--full',action='store_true');args=ap.parse_args()
    start=time.time();before=hashes();ns=build_inputs();input_seconds=time.time()-start
    common={'X':str(X),'lambda':f'sqrt({X})','W':f'log({X})','precision_bits':ctx.prec,'N':ns['N'],'J':ns['J'],'L':ns['L'],'alpha':'0','rank_one_lift':False,'input_seconds':input_seconds,'uniform_entire_even_tail_floor':ns['uniform_tail_floor'].str(110),'far_denominator':ns['dfar'].str(110),'whole_prime_norm_rational_envelope':str(PRIME_ENVELOPE),'prime_norm_power':8,'Cbeta':'13/10','B':'3','nonretained_squared_Abel_constant':ns['Cosc'].str(110),'nonretained_linear_Abel_constant':ns['linear_phase_constant'].str(110),'retained_squared_ratios':ns['retained_squared_ratios'],'retained_linear_ratios':ns['retained_linear_ratios'],'isotropic_remainder':ns['rem'].str(110),'near_moment_cache':'NONE: all separated; only fresh Hurwitz identity moments and fresh X33/2 inverse weights','far_AA_Abel_diagonal_charge':(ns['far_scale']*(ns['delta_A']+ns['sigma']*ns['delta_X'])).str(110),'far_CC_Abel_diagonal_charge':(ns['far_scale']*ns['delta_X']/ns['sigma']).str(110),'delta_A':ns['delta_A'].str(110),'delta_X':ns['delta_X'].str(110),'identity_moment_p2':ns['identity_moments'][2].str(110),'identity_mean_beta_square':ns['mean'].str(110),'grouped_square_phase_count':len(ns['grouped_squared_beta']),'grouped_raw_phase_count':len(ns['grouped_raw_beta'])}
    idx=list(range(33 if args.small else 2049));t=time.time();P,H=far_features(ns,idx,'even');F,hr=certified_factor(H);Q=F.transpose()*P
    xs,g,h,diag=near_generators(ns,idx,'even');diag[0]-=1
    checks=None
    if args.small:
        C,M=dense_original(ns,idx,'even',P,H);C[0,0]-=1;M[0,0]-=1
        for i in range(len(idx)):
            assert C[i,i].is_finite() and diag[i].is_finite() and (diag[i]-C[i,i]).contains(0)
            for j in range(i):
                d=displacement_entry(xs,g,h,i,j)-C[i,j];assert d.is_finite() and d.contains(0)
        mp,mr=dense_ldl(M);checks={'all_actual_dense_entries_overlap':True,'direct_full_lower_surrogate':mr}
    setup=time.time()-t;t=time.time();piv,S,cr=structured_eliminate(xs,g,h,diag,Q,True)
    if S is None:tr={'pass_positive':False,'reason':'core not certified positive'}
    else:
        T=arb_mat(Q.nrows(),Q.nrows())
        for i in range(Q.nrows()):T[i,i]=1
        tp,tr=dense_ldl(T-S)
    if args.small and cr['pass_positive']:
        order=cr['elimination_order'];Cp=arb_mat([[C[i,j] for j in order] for i in order]);cp,cpr=dense_ldl(Cp)
        assert len(cp)==len(piv) and all(a.is_finite() and b.is_finite() and a.overlaps(b) for a,b in zip(cp,piv))
        checks['permuted_core_pivots_overlap']=True
    passed=cr['pass_positive'] and hr['pass_positive'] and tr['pass_positive']
    out={**common,'status':'PASS' if passed else 'FAILED_OR_INCONCLUSIVE','test_kind':'SMALL_DENSE_GATE' if args.small else 'COMPLETE_FULL_EVEN_TEST','dimension':len(idx),'core':cr,'coefficient_H':hr,'whitened_Schur':tr,'dense_checks':checks,'setup_generators_seconds':setup,'elimination_seconds':time.time()-t}
    filename='GENERIC_SMALL_DENSE_GATE.json' if args.small else 'GENERIC_FULL_EVEN_CERTIFICATE.json'
    after=hashes();assert before==after
    out.update(source_sha256_before=before,source_sha256_after=after,all_sources_unchanged=True,seconds=time.time()-start,scope='Only a complete2049head PASS, together with validated generic analytic majorant and independent review, establishes actual full even positivity at sqrt(configured exact X). Small or frozen-direction gates are not full positivity. No odd/cofinal/RH result.')
    (HERE/filename).write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2),flush=True)
if __name__=='__main__':main()
