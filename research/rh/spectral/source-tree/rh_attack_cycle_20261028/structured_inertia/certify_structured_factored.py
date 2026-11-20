#!/usr/bin/env python3
"""Same lambda2.5 surrogate; interval-LDL-whitened small far coefficient block.

This optional stabilization leaves the first audited implementation unchanged.
H=F F.T is enclosed via exact LDL identities and positive pivot square roots.
Q=F.T P then gives the equivalent final test I-Q C^{-1} Q.T > 0.
"""
import argparse
import json
import time
from pathlib import Path
from flint import arb,arb_mat,ctx
from certify_structured_lambda25 import (baseline_inputs,far_features,
    near_generators,structured_eliminate,dense_ldl,pivot_receipt)


def certified_factor(H):
    n=H.nrows()
    L=[[arb(0) for _ in range(n)] for _ in range(n)]
    ds=[]
    for j in range(n):
        d=H[j,j]-sum((L[j][k]**2*ds[k] for k in range(j)),arb(0))
        assert d>0,('nonpositive or inconclusive coefficient pivot',j,d)
        ds.append(d);L[j][j]=arb(1)
        for i in range(j+1,n):
            L[i][j]=(H[i,j]-sum((L[i][k]*ds[k]*L[j][k]
                for k in range(j)),arb(0)))/d
    sqrt_d=[d.sqrt() for d in ds]
    F=arb_mat([[L[i][j]*sqrt_d[j] for j in range(n)] for i in range(n)])
    difference=H-F*F.transpose()
    assert all(difference[i,j].contains(0) for i in range(n) for j in range(n))
    return F,pivot_receipt(ds)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--max-index',type=int,default=512)
    parser.add_argument('--bits',type=int,default=400)
    parser.add_argument('--natural-order',action='store_true')
    parser.add_argument('--output',default='STRUCTURED_LAMBDA25_FACTORED.json')
    args=parser.parse_args();assert 1<=args.max_index<=512
    start=time.time();ns,source_sha=baseline_inputs(args.bits)
    blocks=[]
    for parity in ['even','odd']:
        t=time.time();idx=list(range(0 if parity=='even' else 1,args.max_index+1))
        P,H=far_features(ns,idx,parity)
        F,hr=certified_factor(H);Q=F.transpose()*P
        xs,g,h,diagonal=near_generators(ns,idx,parity)
        pivots,S,cr=structured_eliminate(xs,g,h,diagonal,Q,not args.natural_order)
        if S is None:
            tr={'pass_positive':False,'reason':'core inconclusive'}
        else:
            T=arb_mat(Q.nrows(),Q.nrows())
            for i in range(Q.nrows()):T[i,i]=1
            T=T-S
            tp,tr=dense_ldl(T)
        row={'parity':parity,'core':cr,'coefficient_H':hr,'whitened_Schur':tr,
            'pass_original_surrogate':cr['pass_positive'] and hr['pass_positive'] and tr['pass_positive'],
            'seconds':time.time()-t}
        blocks.append(row);print(json.dumps(row,indent=2),flush=True)
    output={'status':'PASS' if all(b['pass_original_surrogate'] for b in blocks) else 'FAILED_OR_INCONCLUSIVE',
        'precision_bits':ctx.prec,'lambda_value':'2.5','N':512,'J':2048,'L':12,
        'max_head_index':args.max_index,'alpha':'1e-22','original_source_sha256':source_sha,
        'blocks':blocks,'seconds':time.time()-start,
        'interval_contract':'Exact H=F F.T factor enclosed by outward Arb LDL and square roots; Q=F.T P; structured positive core and I-Q C^-1 Q.T tested with interval LDL. No midpoint sign decisions. Same analytic surrogate and dependencies as original producer.'}
    Path(__file__).with_name(args.output).write_text(json.dumps(output,indent=2)+'\n')


if __name__=='__main__':main()
