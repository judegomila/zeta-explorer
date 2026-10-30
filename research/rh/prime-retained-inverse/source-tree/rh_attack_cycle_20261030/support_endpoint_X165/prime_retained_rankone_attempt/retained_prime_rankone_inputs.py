#!/usr/bin/env python3
"""Fresh rank-one lower correction derived after a whole-tail inverse bound."""
from pathlib import Path
import json,sys,time
from flint import arb,arb_poly,ctx
HERE=Path(__file__).resolve().parent;BASE=HERE.parent;ROOT=BASE.parents[1]
sys.path.insert(0,str(BASE))
from generic_full_inputs import build_inputs as old_build_inputs,far_features
TRIAL=BASE/'diagnosis/LAST_CORE_FROZEN_TRIAL.json'
GATE=BASE/'near_tail_inverse_repair/PRIME_RETAINED_DIRECTION_GATE.json'

def cauchy_action(x,a):
    """sum_(k!=i) x_k/((a+i)^2-(a+k)^2), a>=1. Arb throughout."""
    assert a>=1
    m=len(x);xp=arb_poly(x);xr=arb_poly(list(reversed(x)))
    f=arb_poly([arb(0)]+[arb(1)/k for k in range(1,m)])
    p=xp*f;pr=xr*f
    g=arb_poly([arb(1)/(2*a+k) for k in range(2*m-1)])
    q=xr*g
    return [(p[i]-pr[m-1-i]+q[m-1+i]-x[i]/(2*(a+i)))/(2*(a+i)) for i in range(m)]

def build_inputs():
    start=time.time();ns=old_build_inputs();N,J=ns['N'],ns['J'];n=N+1
    v=[arb(s) for s in json.loads(TRIAL.read_text())['coordinates']];assert len(v)==n
    aa=[arb(1)]+[ns['sq2']*(-1)**k for k in range(1,n)]
    av=[aa[k]*v[k] for k in range(n)];t=[j*ns['b'][j] for j in range(J+1)]
    seed=av[1:]+[arb(0)]*(J-N);seed_t=[seed[j-1]*t[j] for j in range(1,J+1)]
    h=cauchy_action(seed,1);ht=cauchy_action(seed_t,1)
    x=[];near=arb(0)
    for j in range(N+1,J+1):
        val=ns['sq2']*(t[j]*(v[0]/(j*j)+h[j-1])-ht[j-1])
        x.append(val/ns['ds'][j]);near+=val**2/ns['ds'][j]
    row_checks=[N+1,N+2,4096,8192,J]
    for j in row_checks:
        direct=ns['sq2']*sum((av[k]*(t[j]-t[k])/(j*j-k*k) for k in range(n)),arb(0))/ns['ds'][j]
        assert (direct-x[j-N-1]).contains(0),('Yv',j)

    bp=[];diag=[]
    for j in range(N+1,J+1):
        freq=2*ns['pi']*j/ns['W']
        pairs=[(w,arb(k).log(),freq*arb(k).log()) for k,w in ns['terms']]
        b=sum((w*phase.sin() for w,logk,phase in pairs),arb(0))/ns['pi']
        pd=sum((2*w*(1-logk/ns['W'])*phase.cos() for w,logk,phase in pairs),arb(0))
        bp.append(b);diag.append(-pd+b/j)
    tp=[(N+1+i)*bp[i] for i in range(J-N)]
    hx=cauchy_action(x,N+1);htx=cauchy_action([tp[i]*x[i] for i in range(J-N)],N+1)
    bx=[(ns['Pschur']+diag[i])*x[i]+2*(tp[i]*hx[i]-htx[i]) for i in range(J-N)]
    E0=sum((x[i]*bx[i] for i in range(J-N)),arb(0));assert E0>0
    # Transposed actual near coupling, with the same parity-undone basis.
    ss=[arb(0)]*N+[bx[i]/ns['ds'][N+1+i] for i in range(J-N)]
    hss=cauchy_action(ss,1);htss=cauchy_action([ss[j-1]*t[j] for j in range(1,J+1)],1)
    e=[ns['sq2']*sum((ss[j-1]*t[j]/(j*j) for j in range(N+1,J+1)),arb(0))]
    e += [ns['sq2']*aa[k]*(t[k]*hss[k-1]-htss[k-1]) for k in range(1,n)]
    column_checks=[0,1,32,1024,N]
    for k in column_checks:
        direct=ns['sq2']*aa[k]*sum((ss[j-1]*(t[j]-t[k])/(j*j-k*k) for j in range(N+1,J+1)),arb(0))
        assert (direct-e[k]).contains(0),('YstarBx',k)
    ev=sum((e[k]*v[k] for k in range(n)),arb(0));assert (ev-E0).contains(0)
    norm=sum((w*w for w in v),arb(0));old=json.loads(GATE.read_text())
    assert (near/norm).overlaps(arb(old['old_near_rayleigh']))
    assert (E0/norm).overlaps(arb(old['near_B_energy']))
    M=2*ns['Pschur'];c=arb(2)/25;eps=arb(1)/4
    assert c<ns['uniform_tail_floor']/(ns['uniform_tail_floor']+M)
    beta=c*(1-eps);r=1+c*(1/eps-1)*M/ns['dfar'];u=[(beta/E0).sqrt()*w for w in e]
    assert (sum((u[k]*v[k] for k in range(n)),arb(0))**2-beta*E0).contains(0)
    ns['old_rem']=ns['rem'];ns['rem']*=r
    ns['old_weighted_signed_H']=ns['weighted_signed_H'];ns['weighted_signed_H']=ns['weighted_signed_H']*r
    ns.update(repair_u=u,repair_E0=E0,repair_r=r,repair_beta=beta,repair_c=c,repair_e=e,
              repair_witness=v,repair_near=near,repair_norm=norm,
              repair_checks={'coupling_rows_direct_overlap':row_checks,'transpose_columns_direct_overlap':column_checks,
                             'e_dot_v0_overlaps_E0':True,'old_direction_near_and_B_energy_overlap':True,
                             'rank_one_energy_at_witness_overlaps_beta_E0':True},repair_setup_seconds=time.time()-start)
    return ns

def add_rank_one(ns,idx,xs,g,h,diag):
    for i,k in enumerate(idx):
        u=ns['repair_u'][k];g[i].append(xs[i]*u);h[i].append(u);diag[i]+=u*u
    return xs,g,h,diag
