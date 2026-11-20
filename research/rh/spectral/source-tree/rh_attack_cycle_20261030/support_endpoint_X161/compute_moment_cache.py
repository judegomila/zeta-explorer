#!/usr/bin/env python3
"""Checkpoint/resumable validated near-resonance moment production.

Each stored complex ball is roundtripped against the original at1000bits;
nonfinite or <900bit results fail closed. No automatic precision escalation.
"""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor,as_completed
import argparse,hashlib,json,time,os
from flint import arb,acb,ctx
from fractions import Fraction as Q
from support_config import X,J,BITS,TOLERANCE_BITS,MIN_CACHE_BITS,CACHE_DIGITS
HERE=Path(__file__).resolve().parent
PRIMITIVE=HERE/'parameterized_near_moments.py'
DIGITS=CACHE_DIGITS;MIN_BITS=MIN_CACHE_BITS
BOUNDS=[J*(2**o)*(8+k)//8 for o in range(6) for k in range(8)]+[64*J]
SHA=hashlib.sha256(PRIMITIVE.read_bytes()).hexdigest()
META={'X':str(X),'J':J,'precision_bits':BITS,'digits':DIGITS,'required_min_relative_accuracy_bits':MIN_BITS,'quadrature_U':1600,'abs_rel_tolerance_bits':TOLERANCE_BITS,'primitive_sha256':SHA,'support_config_sha256':hashlib.sha256((HERE/'support_config.py').read_bytes()).hexdigest()}
def key(job):return ':'.join(map(str,job))
def worker(job):
    from parameterized_near_moments import moment
    ctx.prec=BITS;ratio,p,A=job;start=time.time()
    value,error,analytic_key=moment(X,Q(ratio),p,A,J=J,bits=BITS,tolerance_bits=TOLERANCE_BITS)
    assert analytic_key['X']==str(X) and analytic_key['primitive_sha256']==SHA
    if not value.is_finite():raise RuntimeError(f'Nonfinite moment {job}')
    bits=min(value.real.rel_accuracy_bits(),value.imag.rel_accuracy_bits())
    if bits<MIN_BITS:raise RuntimeError(f'Insufficient original precision {job}: {bits}')
    re=value.real.str(DIGITS);im=value.imag.str(DIGITS);loaded=acb(arb(re),arb(im))
    if not loaded.real.contains(value.real) or not loaded.imag.contains(value.imag):raise RuntimeError(f'Roundtrip containment failure {job}')
    rb=min(loaded.real.rel_accuracy_bits(),loaded.imag.rel_accuracy_bits())
    if rb<MIN_BITS or rb<bits-4:raise RuntimeError(f'Insufficient restored precision {job}: {rb}')
    return {'analytic_key':analytic_key,'key':key(job),'ratio':ratio,'power':p,'A':A,'real_ball':re,'imag_ball':im,'original_min_relative_accuracy_bits':bits,'restored_min_relative_accuracy_bits':rb,'roundtrip_contains_original':True,'seconds':time.time()-start}
def validate(row):
    ctx.prec=BITS
    assert row['key']==key((row['ratio'],row['power'],row['A']))
    k=row['analytic_key'];assert k['X']==str(X) and k['ratio']==str(Q(row['ratio'])) and k['power']==row['power'] and k['A']==row['A'] and k['J']==J and k['precision_bits']==BITS and k['abs_rel_tolerance_bits']==TOLERANCE_BITS and k['primitive_sha256']==SHA
    v=acb(arb(row['real_ball']),arb(row['imag_ball']))
    assert v.is_finite() and min(v.real.rel_accuracy_bits(),v.imag.rel_accuracy_bits())>=MIN_BITS
    assert row['roundtrip_contains_original']
    return v

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--workers',type=int,default=4);ap.add_argument('--limit',type=int);args=ap.parse_args()
    meta=HERE/'MOMENT_CACHE_META.json';cache=HERE/'MOMENT_CACHE.jsonl'
    if meta.exists():assert json.loads(meta.read_text())==META
    else:meta.write_text(json.dumps(META,indent=2)+'\n')
    prior={}
    if cache.exists():
        for line in cache.read_text().splitlines():
            row=json.loads(line);validate(row);assert row['key'] not in prior;prior[row['key']]=row
    jobs=[(16,p,A) for p in range(2,144) for A in BOUNDS]+[(256,p,A) for p in range(2,144,2) for A in BOUNDS]
    assert len(jobs)==10437
    # Deterministic spread makes the initial real batch sample different orders,
    # phases and step endpoints instead of only the fastest low-order cases.
    ordered=sorted(jobs,key=lambda j:hashlib.sha256(key(j).encode()).digest())
    pending=[j for j in ordered if key(j) not in prior]
    if args.limit is not None:pending=pending[:args.limit]
    start=time.time();done=[]
    print(json.dumps({'status':'RUNNING','previous':len(prior),'batch_size':len(pending),'total_required':len(jobs),'workers':args.workers}),flush=True)
    with cache.open('a') as fh,ProcessPoolExecutor(max_workers=args.workers) as pool:
        futures={pool.submit(worker,j):j for j in pending}
        try:
            for future in as_completed(futures):
                row=future.result();validate(row);fh.write(json.dumps(row,separators=(',',':'))+'\n');fh.flush();done.append(row)
                if len(done)%32==0:print(json.dumps({'completed_this_batch':len(done),'total_cached':len(prior)+len(done),'wall_seconds':time.time()-start,'minimum_cached_accuracy_bits':min(x['restored_min_relative_accuracy_bits'] for x in done)}),flush=True)
        except BaseException as e:
            for f in futures:f.cancel()
            print(json.dumps({'status':'FAILED_CLOSED','error':repr(e),'verified_cached_before_failure':len(prior)+len(done)}),flush=True)
            raise
    elapsed=time.time()-start
    report={'status':'COMPLETE' if len(prior)+len(done)==len(jobs) else 'PARTIAL_CHECKPOINT','cached_total':len(prior)+len(done),'required_total':len(jobs),'new_this_batch':len(done),'workers':args.workers,'wall_seconds':elapsed,'sum_worker_seconds':sum(x['seconds'] for x in done),'mean_worker_seconds':sum(x['seconds'] for x in done)/max(1,len(done)),'minimum_new_restored_bits':min((x['restored_min_relative_accuracy_bits'] for x in done),default=None),'meta':META,'source_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    name='MOMENT_CACHE_COMPLETE.json' if report['status']=='COMPLETE' else 'MOMENT_CACHE_INITIAL_BATCH.json'
    (HERE/name).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2),flush=True)
if __name__=='__main__':main()
