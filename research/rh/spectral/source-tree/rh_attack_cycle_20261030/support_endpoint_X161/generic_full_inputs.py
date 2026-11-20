#!/usr/bin/env python3
"""Exact-X parameterized actual inputs and retained-near-phase far majorant.

Production path only: requires a complete, validated support-specific scalar moment cache.
The accepted X16 builders and all pilot/review sources remain unchanged.
"""
from pathlib import Path
from fractions import Fraction as Q
import hashlib,json
from flint import arb,acb,arb_mat,ctx
import sys
from support_config import X,N,J,L,BITS,PRIME_ENVELOPE,PRIME_RECEIPT,ACTUAL_HEAD_SOURCE
sys.path.insert(0,str(ACTUAL_HEAD_SOURCE.parent))
from generic_actual_head_pilot import inputs
HERE=Path(__file__).resolve().parent
assert Q(16)<X<Q(17)

def load_moments():
    from compute_moment_cache import META,validate,key,BOUNDS
    metadata=json.loads((HERE/'MOMENT_CACHE_META.json').read_text());assert metadata==META
    complete=json.loads((HERE/'MOMENT_CACHE_COMPLETE.json').read_text())
    assert complete['status']=='COMPLETE' and complete['cached_total']==10437 and complete['meta']==META
    cache={}
    for line in (HERE/'MOMENT_CACHE.jsonl').read_text().splitlines():
        row=json.loads(line);v=validate(row);k=(row['ratio'],row['power'],row['A']);assert k not in cache;cache[k]=v
    required={(16,p,A) for p in range(2,144) for A in BOUNDS}|{(256,p,A) for p in range(2,144,2) for A in BOUNDS}
    assert set(cache)==required
    return cache,BOUNDS

def build_inputs(bits=1000,order=36):
    assert bits==1000 and order==36
    ctx.prec=bits;ns=inputs(X,N,bits)
    W,pi,sh=ns['W'],ns['pi'],ns['sh'];b=ns['b'];terms=ns['terms']
    Pschur=arb(PRIME_ENVELOPE.numerator)/PRIME_ENVELOPE.denominator
    receipt=json.loads(PRIME_RECEIPT.read_text());rr=receipt['runs'][0]
    assert rr['X']==str(X) and rr['prime_count']==10 and len(rr['state_counts'])==7
    assert arb(rr['seventh_power_schur_norm_upper']).is_finite() and arb(rr['seventh_power_schur_norm_upper'])<Pschur
    gamma=arb('1.853')+arb(3)/(5*W)+arb(4)/5*(-5*W/2).exp()/(1-(-2*W).exp())
    HK=W*(W+2*(1-(-W/2).exp()))/(2*pi*pi)
    arch=lambda j:acb(arb(5)/4,pi*j/W).digamma().real-pi.log()
    def d(j):return arch(j)-gamma-Pschur-HK/N
    uniform_tail_floor=d(N+1);dfar=d(J+1)
    assert uniform_tail_floor>0 and dfar>0
    ds={j:d(j) for j in range(N+1,J+2)}
    assert all(v>0 for v in ds.values())
    for j in range(N+1,J+2):
        freq=2*pi*j/W;ss=acb(arb(1)/4,freq/2).digamma().imag/2
        for a,e in ns['exps']:ss-=e*freq/(a*a+freq*freq)
        ss+=arb(0,(ns['ee']*freq/(ns['aend']**2)).upper())
        ps=sum((w*(freq*arb(n).log()).sin() for n,w in terms),arb(0))
        b.append(32*W*j*sh/(W*W+16*pi*pi*j*j)+ss/pi+ps/pi)
    B=arb(3);Cbeta=arb(13)/10;eps=arb(1)/10;epsb=arb(1)/10;alpha=arb(0)
    beta_abs=arb(1)/4+sum((w for n,w in terms),arb(0))/pi
    Cformula=(2*W*sh+arb(1)/2+arb(55)*W*W/48)/(pi*pi)
    assert Cformula<Cbeta and beta_abs+Cformula/2<B and abs(b[1])<B
    rem=4*B*B*sum(k**(4*L) for k in range(1,N+1))/(arb(J)**(4*L+1)*(4*L+1)*(1-arb(N)/(J+1))**2)*(1+1/eps)/dfar
    raw={Q(1):acb(arb(1)/4)}
    for n,w in terms:
        raw[Q(n)]=acb(0,-w/(2*pi));raw[Q(1,n)]=acb(0,w/(2*pi))
    squared={}
    for r,cr in raw.items():
        for s,cs in raw.items():squared[r*s]=squared.get(r*s,acb(0))+cr*cs
    assert len(raw)==21 and len(squared)==193
    mean=squared[Q(1)].real;assert squared[Q(1)].imag==0
    retained_AA={Q(1),Q(16),Q(1,16),Q(256),Q(1,256)}
    retained_AC={Q(1),Q(16),Q(1,16)}
    def phase_error(coeff,retained):
        total=arb(0)
        for r,c in coeff.items():
            if r in retained:continue
            theta=2*pi*(arb(r.numerator)/r.denominator).log()/W
            den=abs(1-acb(0,theta).exp());assert den.is_finite() and den>0
            total+=2*abs(c)/den
        return total
    Cosc=phase_error(squared,retained_AA);Clin=phase_error(raw,retained_AC)
    cache,bounds=load_moments();weights=[1/d(a+1) for a in bounds]
    assert all(a>b for a,b in zip(weights,weights[1:]))
    mom0={};m16={};m256={}
    for p in range(2,145):
        tails=[arb(p).zeta(a+1)*arb(J)**(p-2) for a in bounds]
        mom0[p]=sum((weights[i]*(tails[i]-tails[i+1]) for i in range(48)),arb(0))+weights[-1]*tails[-1]
    for ratio,dest,orders in [(16,m16,range(2,144)),(256,m256,range(2,144,2))]:
        for p in orders:
            tails=[cache[(ratio,p,a)] for a in bounds]
            dest[p]=sum((weights[i]*(tails[i]-tails[i+1]) for i in range(48)),acb(0))+weights[-1]*tails[-1]
    AA={p:mean*mom0[p]+2*(squared[Q(16)]*m16[p]).real+2*(squared[Q(256)]*m256[p]).real for p in range(2,144,2)}
    AC={p:mom0[p]/4+2*(raw[Q(16)]*m16[p]).real for p in range(3,144,2)}
    sigma=arb(1)/8;scale=2*(1+eps)*(1+epsb)
    delta_A=L*Cosc*weights[0]/arb(J+1)**2
    delta_X=L*Clin*weights[0]/arb(J+1)**2
    H=arb_mat(2*L,2*L)
    for p in range(L):
        for q in range(L):
            H[p,q]=scale*AA[2*(p+q)+2]+2*(1+eps)*(1+1/epsb)*Cbeta**2*mom0[2*(p+q)+4]/(J*J)
            H[L+p,L+q]=scale*mom0[2*(p+q)+4]
            H[p,L+q]=H[L+q,p]=-scale*AC[2*(p+q)+3]
        H[p,p]+=scale*(delta_A+sigma*delta_X)
        H[L+p,L+p]+=scale*delta_X/sigma
    def elem(j,k,parity):
        assert parity=='even'
        return ns['element'](j,k)
    ns.update(N=N,J=J,L=L,alpha=alpha,eps=eps,epsb=epsb,B=B,Cbeta=Cbeta,
        Pschur=Pschur,gamma=gamma,HK=HK,arch=arch,ds=ds,uniform_tail_floor=uniform_tail_floor,dfar=dfar,
        rem=rem,elem=elem,weighted_signed_H=H,Cosc=Cosc,linear_phase_constant=Clin,mean=mean,
        beta_absolute_bound=beta_abs,Cformula=Cformula,step_endpoints=bounds,step_inverse_weights=weights,
        far_method='signed exact near-resonance moments + separated-phase global Abel + fixed monotone inverse steps',
        raw_beta=raw,squared_beta=squared,retained_squared_ratios=['1','16','1/16','256','1/256'],retained_linear_ratios=['1','16','1/16'])
    return ns

def far_features(ns,idx,parity):
    assert parity=='even';P=arb_mat(2*L,len(idx))
    for ell in range(L):
        for i,k in enumerate(idx):
            a=arb(1) if k==0 else ns['sq2']*(-1)**k;q=arb(k)/J
            P[ell,i]=a*q**(2*ell);P[L+ell,i]=a*ns['b'][k]*q**(2*ell+1)
    return P,ns['weighted_signed_H']
