#!/usr/bin/env python3
"""One fresh exact-vector prime-retained inverse gate, not a full matrix test.

All cross-band terms are covered by the PSD-seminorm triangle or Young bound.
Finite prime energy uses exact Arb polynomial-convolution Cauchy action, with
small direct-entry comparisons. No changed support or prime-power norm run.
"""
from pathlib import Path
from fractions import Fraction
import hashlib,json,sys,time
from flint import arb,arb_poly,arb_mat,ctx

HERE=Path(__file__).resolve().parent; BASE=HERE.parent; ROOT=BASE.parents[1]
sys.path.insert(0,str(BASE))
from generic_full_inputs import build_inputs,far_features
from certify_generic_support import SOURCES

TRIAL=BASE/'diagnosis/LAST_CORE_FROZEN_TRIAL.json'
OLD_BUDGET=BASE/'diagnosis/LAST_CORE_DIRECTION_BUDGET.json'
TERMINAL=BASE/'BOUNDED_ATTEMPT_TERMINAL_MANIFEST.json'
DECOMPOSITION=ROOT/'rh_attack_cycle_20261029/fluid_criticality/FIXED_FLOOR_SCALE_PASS_20261029.md'
EVEN_LOWER=ROOT/'rh_attack_cycle_20261028/independent_review/recovery/X10_COMPLEMENTARY_SHIFT_AND_SCALARS_AUDIT.md'
start=time.time();ctx.prec=1000
pins=lambda:{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest()
             for p in SOURCES+[Path(__file__).resolve(),TRIAL,OLD_BUDGET,TERMINAL,DECOMPOSITION,EVEN_LOWER]}
before=pins()
assert before[str(TERMINAL.relative_to(ROOT))]=='ac80ae840bc9fb057bc5858c8473aa30b82bb3a0be5693499512d5cb30e8980c'

def cauchy_action(x,a):
    """h_i=sum_(k!=i) x_k/((a+i)^2-(a+k)^2), a positive integer."""
    m=len(x); xp=arb_poly(x); xr=arb_poly(list(reversed(x)))
    f=arb_poly([arb(0)]+[arb(1)/k for k in range(1,m)])
    p=xp*f; pr=xr*f
    g=arb_poly([arb(1)/(2*a+k) for k in range(2*m-1)])
    q=xr*g
    return [(p[i]-pr[m-1-i]+q[m-1+i]-x[i]/(2*(a+i)))/(2*(a+i)) for i in range(m)]

def prime_coefficients(ns,a,m):
    bp=[];diag=[]
    for j in range(a,a+m):
        freq=2*ns['pi']*j/ns['W']
        pairs=[(w,arb(n).log(),freq*arb(n).log()) for n,w in ns['terms']]
        b=sum((w*phase.sin() for w,logn,phase in pairs),arb(0))/ns['pi']
        pd=sum((2*w*(1-logn/ns['W'])*phase.cos() for w,logn,phase in pairs),arb(0))
        bp.append(b);diag.append(-pd+b/j)
    return bp,diag

def prime_quadratic(x,a,bp,diag):
    h=cauchy_action(x,a)
    return sum((x[i]**2*diag[i]+4*(a+i)*bp[i]*x[i]*h[i] for i in range(len(x))),arb(0))

ns=build_inputs()
# Independent literal finite checks, including shifted blocks and signed entries.
checks=[]
for a,m in [(1,7),(2049,9),(4093,13)]:
    x=[arb((-1)**i*(i+1))/(i+3) for i in range(m)]
    h=cauchy_action(x,a)
    direct=[sum((x[k]/((a+i)**2-(a+k)**2) for k in range(m) if k!=i),arb(0)) for i in range(m)]
    assert all((v-w).contains(0) for v,w in zip(h,direct))
    bp,dd=prime_coefficients(ns,a,m)
    qdirect=sum((x[i]**2*dd[i] for i in range(m)),arb(0))
    qdirect+=4*sum((x[i]*x[k]*((a+i)*bp[i]-(a+k)*bp[k])/((a+i)**2-(a+k)**2)
                    for i in range(m) for k in range(i)),arb(0))
    assert (prime_quadratic(x,a,bp,dd)-qdirect).contains(0)
    if a==1:
        vv=[(-1)**(a+i)*x[i] for i in range(m)]
        literal=sum((vv[i]*vv[k]*ns['element'](a+i,a+k,True) for i in range(m) for k in range(m)),arb(0))
        assert (qdirect-literal).contains(0)
    checks.append({'first_index':a,'dimension':m,'cauchy_all_entries_overlap':True,'prime_quadratic_direct_overlap':True})
print('convolution/direct checks passed',time.time()-start,flush=True)

trial=json.loads(TRIAL.read_text());assert trial['X']=='33/2'
v=[arb(s) for s in trial['coordinates']]; n=len(v); assert n==2049
norm=sum((x*x for x in v),arb(0)); av=[v[0]]+[ns['sq2']*(-1)**k*v[k] for k in range(1,n)]
t=[k*ns['b'][k] for k in range(n)]
actual=sum((v[k]**2*ns['ed'][k] for k in range(n)),arb(0))
for j in range(1,n):actual+=2*av[j]*sum((av[k]*(t[j]-t[k])/(j*j-k*k) for k in range(j)),arb(0))
a=ns['N']+1; m=ns['J']-ns['N']; x=[];near=arb(0)
for j in range(a,ns['J']+1):
    # The omitted (-1)^j sign is exactly undone in prime_quadratic's x basis.
    val=ns['sq2']*sum((av[k]*(j*ns['b'][j]-t[k])/(j*j-k*k) for k in range(n)),arb(0))
    d=ns['ds'][j]; x.append(val/d); near+=val**2/d
    if j%4096==0: print('fresh coupling row',j,time.time()-start,flush=True)
P,H=far_features(ns,list(range(n)),'even');z=P*arb_mat([[s] for s in v])
farH=(z.transpose()*H*z)[0,0]; rem=ns['rem']*norm; F=farH+rem
old=json.loads(OLD_BUDGET.read_text())
for computed,key in [(actual/norm,'actual_rayleigh'),(near/norm,'complete_near_rayleigh'),(farH/norm,'far_H_rayleigh')]:
    assert computed.overlaps(arb(old[key])),key

bp,diag=prime_coefficients(ns,a,m)
qp=prime_quadratic(x,a,bp,diag)
xnorm=sum((s*s for s in x),arb(0));Pstar=ns['Pschur'];M=2*Pstar
E=Pstar*xnorm+qp
assert E>0
dmin=ns['uniform_tail_floor'];dfar=ns['dfar']; c=arb(2)/25
ceiling=dmin/(dmin+M);assert c<ceiling
G=M*F/dfar
assert E>G
gain=c*(E.sqrt()-G.sqrt())**2
old_lower=actual-near-F
new_lower=old_lower+gain
# Fixed epsilon gives a single quadratic lower form, valid for ALL head vectors.
eps=arb(1)/4
young_gain=c*((1-eps)*E-(1/eps-1)*G)
young_lower=old_lower+young_gain
assert new_lower>0 and young_lower>0
ser=lambda q:q.str(110)
after=pins();assert before==after
out={'status':'PASS_FIXED_DIRECTION_WITH_RIGOROUS_GLOBAL_INVERSE_BOUND',
     'precision_bits':ctx.prec,'X':'33/2','N':ns['N'],'J':ns['J'],'prime_norm_power':8,
     'prime_retained_B':'Pstar I minus compressed actual prime translation operator',
     'inverse_c':'2/25','permitted_c_ceiling':ser(ceiling),'young_epsilon':'1/4',
     'norm_squared':ser(norm),'actual_rayleigh':ser(actual/norm),'old_near_rayleigh':ser(near/norm),
     'old_far_plus_remainder_rayleigh':ser(F/norm),'old_full_surrogate_rayleigh':ser(old_lower/norm),
     'near_preconditioned_norm_squared':ser(xnorm/norm),'actual_negative_prime_quadratic':ser(qp/norm),
     'near_B_energy':ser(E/norm),'far_B_energy_upper':ser(G/norm),
     'rigorous_nonlinear_inverse_gain':ser(gain/norm),'new_frozen_direction_lower':ser(new_lower/norm),
     'rigorous_quadratic_young_gain':ser(young_gain/norm),'quadratic_young_frozen_direction_lower':ser(young_lower/norm),
     'new_far_multiplier':ser(1+c*(1/eps-1)*M/dfar),'near_B_coefficient':ser(c*(1-eps)),
     'convolution_direct_checks':checks,'old_mathematical_budget_overlap':True,
     'source_sha256_before':before,'source_sha256_after':after,'seconds':time.time()-start,
     'scope':'A global operator inverse inequality and ONE exact rational head direction. Includes all cross-band terms through PSD seminorm triangle/Young. Not a full repaired matrix certificate or new support endpoint. No RH result.'}
(HERE/'PRIME_RETAINED_DIRECTION_GATE.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2),flush=True)
