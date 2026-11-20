#!/usr/bin/env python3
"""Staged one-rank-positive actual tail inverse repair; no historical mutation."""
from pathlib import Path
import argparse,hashlib,json,sys,time
from flint import arb,arb_mat,ctx
HERE=Path(__file__).resolve().parent;BASE=HERE.parent;ROOT=BASE.parents[1]
sys.path.insert(0,str(BASE));sys.path.insert(0,str(HERE))
from certify_generic_support import SOURCES as OLD_SOURCES
from retained_prime_rankone_inputs import build_inputs,far_features,add_rank_one,TRIAL,GATE
from certify_structured_lambda25 import near_generators,structured_eliminate,dense_ldl,dense_original,displacement_entry
from certify_structured_factored import certified_factor
SOURCES=OLD_SOURCES+[Path(__file__).resolve(),HERE/'retained_prime_rankone_inputs.py',TRIAL,GATE,
    BASE/'BOUNDED_ATTEMPT_TERMINAL_MANIFEST.json',
    BASE/'near_tail_inverse_repair/certify_prime_retained_direction.py',
    BASE/'near_tail_inverse_repair/COUPLED_PRIME_RETAINED_INVERSE_AND_RANK_ONE_SPEC.md',
    ROOT/'rh_attack_cycle_20261028/tail_coercivity/FULL_TAIL_COERCIVITY.md',
    ROOT/'frequency_sensitive_bound/FREQUENCY_BLOCK_SUPPORT_BOUND.md']
def hashes():return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in SOURCES}

def main():
    ap=argparse.ArgumentParser();mode=ap.add_mutually_exclusive_group(required=True)
    mode.add_argument('--small',action='store_true');mode.add_argument('--full',action='store_true');args=ap.parse_args()
    start=time.time();before=hashes();ns=build_inputs();idx=list(range(33 if args.small else 2049))
    P,H=far_features(ns,idx,'even');F,hr=certified_factor(H);Q=F.transpose()*P
    xs,g,h,diag=near_generators(ns,idx,'even');diag[0]-=1
    xs,g,h,diag=add_rank_one(ns,idx,xs,g,h,diag)
    checks=None
    if args.small:
        C,M=dense_original(ns,idx,'even',P,H);C[0,0]-=1;M[0,0]-=1
        for i,k in enumerate(idx):
            for j,l in enumerate(idx):
                update=ns['repair_u'][k]*ns['repair_u'][l];C[i,j]+=update;M[i,j]+=update
        for i in range(len(idx)):
            assert (diag[i]-C[i,i]).contains(0)
            for j in range(i):assert (displacement_entry(xs,g,h,i,j)-C[i,j]).contains(0)
        mp,mr=dense_ldl(M);checks={'all_direct_dense_and_rank6_entries_overlap':True,'direct_full_repaired_lower':mr}
    setup=time.time()-start;t=time.time();piv,S,cr=structured_eliminate(xs,g,h,diag,Q,True)
    if S is None:tr={'pass_positive':False,'reason':'rank-one repaired core not certified positive'}
    else:
        T=arb_mat(Q.nrows(),Q.nrows())
        for i in range(Q.nrows()):T[i,i]=1
        tp,tr=dense_ldl(T-S)
    if args.small and cr['pass_positive']:
        order=cr['elimination_order'];Cp=arb_mat([[C[i,j] for j in order] for i in order]);cp,cpr=dense_ldl(Cp)
        assert len(cp)==len(piv) and all(a.overlaps(b) for a,b in zip(cp,piv))
        checks['permuted_repaired_core_pivots_overlap']=True
    after=hashes();assert before==after
    passed=cr['pass_positive'] and hr['pass_positive'] and tr['pass_positive']
    out={'status':'PASS' if passed else 'FAILED_OR_INCONCLUSIVE','test_kind':'SMALL_DENSE_GATE' if args.small else 'COMPLETE_FULL_EVEN_TEST',
         'X':'33/2','N':ns['N'],'J':ns['J'],'L':ns['L'],'precision_bits':ctx.prec,'dimension':len(idx),
         'rank_one_lift':False,'positive_rank_one_tail_inverse_correction':True,'core_displacement_rank_bound':6,
         'inverse_c':'2/25','young_epsilon':'1/4','near_B_coefficient':'3/50','far_H_and_rem_multiplier':ns['repair_r'].str(110),
         'E0':ns['repair_E0'].str(110),'whole_prime_envelope':ns['Pschur'].str(110),
         'tail_floor':ns['uniform_tail_floor'].str(110),'scaled_rem':ns['rem'].str(110),
         'repair_builder_checks':ns['repair_checks'],'core':cr,'coefficient_H':hr,'whitened_Schur':tr,'dense_checks':checks,
         'repair_builder_seconds':ns['repair_setup_seconds'],'setup_seconds':setup,'elimination_seconds':time.time()-t,
         'source_sha256_before':before,'source_sha256_after':after,'all_sources_unchanged':True,'seconds':time.time()-start,
         'scope':'Complete PASS plus independent analytic/source clearance and isolated full replay required to accept new finite reflection-even support. Small/frozen-direction gates are not full positivity. No odd/cofinal/RH claim.'}
    filename='PRIME_RETAINED_RANKONE_SMALL_GATE.json' if args.small else 'PRIME_RETAINED_RANKONE_FULL_GATE.json'
    (HERE/filename).write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2),flush=True)
if __name__=='__main__':main()
