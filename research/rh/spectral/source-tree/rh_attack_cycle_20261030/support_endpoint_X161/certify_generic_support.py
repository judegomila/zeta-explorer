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
SOURCES=[Path(__file__).resolve(),HERE/'support_config.py',HERE/'generic_full_inputs.py',ACTUAL_HEAD_SOURCE,HERE/'parameterized_near_moments.py',HERE/'compute_moment_cache.py',HERE/'MOMENT_CACHE_META.json',HERE/'MOMENT_CACHE.jsonl',HERE/'MOMENT_CACHE_COMPLETE.json',PRIME_ENUMERATOR,PRIME_RECEIPT,STRUCT/'certify_structured_lambda25.py',STRUCT/'certify_structured_factored.py']
def hashes():return {str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in SOURCES}
def witness(ns):
    src=ROOT/'rh_attack_cycle_20261029/X16_even_feasibility/core_direction/X16_CORE_INVERSE_FROZEN_TRIAL.json'
    v=[arb(x) for x in json.loads(src.read_text())['coordinates']];assert len(v)==2049
    norm=sum((x*x for x in v),arb(0));a=[arb(1)]+[ns['sq2']*(-1)**k for k in range(1,len(v))]
    av=[x*y for x,y in zip(a,v)];t=[k*ns['b'][k] for k in range(len(v))]
    actual=sum((v[k]**2*ns['ed'][k] for k in range(len(v))),arb(0))
    for j in range(1,len(v)):
        actual+=2*av[j]*sum((av[k]*(t[j]-t[k])/(j*j-k*k) for k in range(j)),arb(0))
    near=arb(0)
    for j in range(ns['N']+1,ns['J']+1):
        value=ns['sq2']*sum((av[k]*(j*ns['b'][j]-t[k])/(j*j-k*k) for k in range(len(v))),arb(0))
        near+=value**2/ns['ds'][j]
        if j%2048==0:print('witness near row',j,flush=True)
    P,H=far_features(ns,list(range(len(v))),'even');z=P*arb_mat([[x] for x in v]);far=(z.transpose()*H*z)[0,0]+ns['rem']*norm
    result=(actual-near-far)/norm
    assert all(x.is_finite() for x in [actual,near,far,result,norm])
    return {'status':'PASS_FROZEN_DIRECTION_ONLY' if result>0 else 'FAILED_OR_INCONCLUSIVE_FROZEN_DIRECTION','actual_rayleigh':(actual/norm).str(110),'complete_near':(near/norm).str(110),'complete_far':(far/norm).str(110),'lower_surrogate_rayleigh':result.str(110),'witness_source_sha256':hashlib.sha256(src.read_bytes()).hexdigest()}

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--small',action='store_true');ap.add_argument('--witness',action='store_true');args=ap.parse_args();assert not(args.small and args.witness)
    start=time.time();before=hashes();ns=build_inputs();input_seconds=time.time()-start
    common={'X':str(X),'lambda':f'sqrt({X})','W':f'log({X})','precision_bits':ctx.prec,'N':ns['N'],'J':ns['J'],'L':ns['L'],'alpha':'0','rank_one_lift':False,'input_seconds':input_seconds,'uniform_entire_even_tail_floor':ns['uniform_tail_floor'].str(110),'far_denominator':ns['dfar'].str(110),'whole_prime_norm_rational_envelope':str(PRIME_ENVELOPE),'prime_norm_power':7,'Cbeta':'13/10','B':'3','nonretained_squared_Abel_constant':ns['Cosc'].str(110),'nonretained_linear_Abel_constant':ns['linear_phase_constant'].str(110),'retained_squared_ratios':ns['retained_squared_ratios'],'retained_linear_ratios':ns['retained_linear_ratios'],'isotropic_remainder':ns['rem'].str(110),'near_moment_cache':'complete10437rows,1000bit arithmetic,350digit outward roundtrip,minimum900bit gate'}
    if args.witness:
        out={**common,**witness(ns)};filename='GENERIC_FROZEN_DIRECTION_GATE.json'
    else:
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
