#!/usr/bin/env python3
"""Scalar cost/threshold feasibility only; not a positivity certificate.

Exact rational path enumeration generalizes the frozen X16 eighth-power prime
Schur norm. Also counts arithmetic phase channels without alias deletion.
"""
from pathlib import Path
from fractions import Fraction as F
from collections import Counter
import hashlib,json,time
from flint import arb,ctx
HERE=Path(__file__).resolve().parent
ctx.prec=200
TERMS=[(2,2),(3,3),(4,2),(5,5),(7,7),(8,2),(9,3),(11,11),(13,13),(16,2)]
def ball(x):return arb(x.numerator)/x.denominator

def run(X):
    started=time.time();W=ball(X).log();gamma_weight=arb(2)/3
    weights={n:arb(p).log()/arb(n).sqrt() for n,p in TERMS if n<X}
    states={(F(1),F(1),X):arb(1)}
    moves=[(q,w) for n,w in weights.items() for q in (F(n),F(1,n))]
    counts=[]
    for depth in range(1,9):
        following={}
        for (q,lo,hi),c in states.items():
            for shift,w in moves:
                z=q*shift;l=max(lo,1/z);u=min(hi,X/z)
                if l>=u:continue
                key=(z,l,u);following[key]=following.get(key,arb(0))+c*w
        states=following;counts.append(len(states));print("enumeration_depth",depth,"states",len(states),flush=True)
    events={}
    for (q,lo,hi),c in states.items():
        arg=gamma_weight*ball(q).log();A=c*arg.cosh();B=c*arg.sinh()
        for endpoint,sign in [(lo,1),(hi,-1)]:
            a,b=events.get(endpoint,(arb(0),arb(0)))
            events[endpoint]=(a+sign*A,b+sign*B)
    endpoints=sorted(events);assert endpoints[0]==1 and endpoints[-1]==X
    A=arb(0);B=arb(0);values=[]
    for lo,hi in zip(endpoints,endpoints[1:]):
        da,db=events[lo];A+=da;B+=db
        for t in (lo,hi):
            T=(gamma_weight*(ball(t).log()-W/2)).tanh()
            values.append(A+T*B)
    da,db=events[endpoints[-1]]
    assert (A+da).contains(0) and (B+db).contains(0)
    fourth=max(v.upper() for v in values);norm=fourth.root(8)
    # Frequencies r in exact raw beta and beta squared. No approximate aliases.
    raw={F(1)}|{q for n in weights for q in (F(n),F(1,n))}
    square={a*b for a in raw for b in raw}
    def reduce(r):
        while r>=X:r/=X
        while r<1:r*=X
        return r
    grouped={reduce(r) for r in square}
    near=[]
    for r in sorted(grouped):
        if r==1:continue
        phase=2*arb.pi()*ball(r).log()/W
        small=min(phase,2*arb.pi()-phase)
        if small<arb('.1'):
            near.append({'r':str(r),'phase_distance':small.str(35),'J_phase_product':(16384*small).str(35)})
    gamma=arb('1.853')+arb(3)/(5*W)+arb(4)/5*(-5*W/2).exp()/(1-(-2*W).exp())
    from flint import acb
    HK=W*(W+2*(1-(-W/2).exp()))/(2*arb.pi()**2)
    arch=acb(arb(5)/4,arb.pi()*2049/W).digamma().real-arb.pi().log()
    return {'X':str(X),'state_counts':counts,'endpoint_count':len(endpoints),'prime_count':len(weights),
        'eighth_power_schur_norm_upper':norm.str(50),'N2048_tail_floor_with_this_norm':(arch-gamma-norm-HK/2048).str(50),
        'raw_beta_phase_count':len(raw),'raw_square_ratio_count':len(square),'exact_grouped_square_phase_count':len(grouped),
        'near_identity_squared_channels':near,'seconds':time.time()-started}
results=[run(F(33,2))]
out={'status':'SCALAR_FEASIBILITY_ONLY','precision_bits':ctx.prec,'runs':results,
    'scope':'Complete rational eighth-power prime norm enumeration and exact channel counts only. No finite corrected matrix, full positivity, or support extension certificate.'}
(HERE/'X165_POWER8_TARGETED.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
