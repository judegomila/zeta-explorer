"""Exact rational certificate for a parameter refinement of Xu--Sang v2.

This checks numerical admissibility, NOT the imported analytic theorems.
All acceptance decisions use fractions.Fraction and integer arithmetic.
No third-party dependencies.
"""
from fractions import Fraction as F
from functools import reduce
from math import gcd, lcm
import json
from pathlib import Path

def trim(a):
    a=list(a)
    while len(a)>1 and a[-1]==0: a.pop()
    return a
def add(a,b):
    c=[F(0)]*max(len(a),len(b))
    for i,v in enumerate(a): c[i]+=v
    for i,v in enumerate(b): c[i]+=v
    return trim(c)
def scale(a,c): return trim([v*c for v in a])
def mul(a,b):
    c=[F(0)]*(len(a)+len(b)-1)
    for i,u in enumerate(a):
        for j,v in enumerate(b): c[i+j]+=u*v
    return trim(c)
def ev(a,y): return sum(v*y**i for i,v in enumerate(a))

def endpoint(delta,x,b,ell,kappa):
    c=1/(3*kappa); h=(1+b+3*ell)/2; ly=(1+b-ell)/2
    D=3-(1+2*c)*x; P=(2-2*c*x)*(1-x)
    J=(F(5,6)-delta)*D+delta*P
    R=1-delta+(F(5,6)-delta)*delta*P/(2*J)
    C0=-F(1,4)+b/6+5*ell/4
    E=C0+delta/2+delta*x*(ell+c*(h/4-ly/2))-3*h*(1-R)/4
    return E,J

def certificate(b,ell,kappa,g,zeta,gstar):
    alpha=F(5,6); c=1/(3*kappa)
    lx=(1-b-ell)/2; ly=(1+b-ell)/2; h=(1+b+3*ell)/2
    B=F(11,12)-ell/4; C0=-F(1,4)+b/6+5*ell/4
    amp=ell+c*(h/4-ly/2)
    # y=1/2-x.  J=alpha*D+delta*(P-D).
    D=[F(5,2)-c,1+2*c]
    P=[1-c/2,F(2),2*c]
    U=[F(1,2)+amp/2-3*h/4,-amp]
    PD=add(P,scale(D,-1))
    qa=add(scale(mul(PD,U),-2),scale(P,3*h/4))
    qb=add(add(scale(PD,-2*(C0+g)),scale(mul(D,U),-2*alpha)),scale(P,-3*h*alpha/4))
    qc=scale(D,-2*alpha*(C0+g))
    common=lcm(*(v.denominator for p in [qa,qb,qc] for v in p))
    ints=[[int(v*common) for v in p] for p in [qa,qb,qc]]
    divisor=reduce(gcd,(abs(v) for p in ints for v in p))
    ints=[[v//divisor for v in p] for p in ints]
    multiplier=F(common,divisor)
    A,BB,C=ints
    discr=add(scale(mul(A,C),4),scale(mul(BB,BB),-1))
    assert all(v>0 for v in A), 'leading coefficient is not coefficientwise positive'
    assert all(v>0 for v in discr), 'discriminant complement is not coefficientwise positive'
    # Polynomial identity verified independently from rational E at enough points:
    # degree <= 2 in delta and <= 3 in y, so a 3 by 4 grid identifies it.
    for delta in [F(0),F(1,3),F(5,6)]:
        for y in [F(0),F(1,6),F(1,3),F(1,2)]:
            E,J=endpoint(delta,F(1,2)-y,b,ell,kappa)
            assert 2*multiplier*J*(-E-g)==ev(A,y)*delta**2+ev(BB,y)*delta+ev(C,y)
    # J positive throughout: D(x)>0, P(x)>0 on 0<=x<=1/2,
    # and alpha-delta,delta are nonnegative and not both zero.
    assert D[0]>0 and all(v>=0 for v in D)
    assert P[0]>0 and all(v>=0 for v in P)
    Asm=F(1,2)+(ell/2)*(F(1,2)+2*ell/h)-h/2
    margins={
      'b_positive':b,
      'ell_minus_one_sixth':ell-F(1,6),
      'one_fifth_minus_ell':F(1,5)-ell,
      'B_minus_87_100':B-F(87,100),
      'lx_minus_ell':lx-ell,
      'ly_minus_ell_minus_11b_6':ly-ell-11*b/6,
      'six_kappa_ell_minus_three_quarters':6*kappa*ell-F(3,4),
      'capacity_minus_ell_over_h':1/(6*kappa)-ell/h,
      'prime_supply_minus_21_100':ell/(h+zeta)-F(21,100),
      'ly_minus_half_h':ly-h/2,
      'half_minus_ly':F(1,2)-ly,
      'gstar_positive':gstar,
      'one_thousandth_minus_gstar':F(1,1000)-gstar,
      'twice_zeta_positive':2*zeta,
      'one_thousandth_minus_twice_zeta':F(1,1000)-2*zeta,
      'endpoint_margin_after_extension':g-2*zeta-gstar,
      'small_delta_bound_margin':-F(1,250)-max(C0,C0+Asm/8),
      'floor_bound_margin':-F(1,100)-(C0+(F(1,2)+3*ell/2)/50),
      'small_row_bound_margin':-F(1,20)-(h*(F(17,50)-F(1,6))-ly/2+F(2,100)),
    }
    assert F(29991,40000)<=kappa<=F(3,4)
    assert all(v>0 for v in margins.values()), {k:v for k,v in margins.items() if v<=0}
    assert B==(F(87488665,100000000)) if b==F(17307,200000) and ell==F(2506801,15000000) else True
    return {
      'status':'EXACT_NUMERICAL_ADMISSIBILITY_PASS',
      'analytic_status':'Conditional on the analytic inputs and closure lemma of Xu--Sang arXiv:2610.15291v2; those are not verified by this program.',
      'parameters':{k:str(v) for k,v in {'b':b,'ell':ell,'kappa':kappa,'g':g,'zeta':zeta,'gstar':gstar}.items()},
      'boundary':str(B),'boundary_decimal':float(B),
      'licensing_boundary':str((1+kappa)/2),
      'geometry':{k:str(v) for k,v in {'lx':lx,'ly':ly,'h':h,'C0':C0,'Asm':Asm}.items()},
      'polynomial_identity':'2 * multiplier * J * (-E-g) = A(y)*delta^2 + Bpoly(y)*delta + C(y), y=1/2-x',
      'multiplier':str(multiplier),
      'A_coefficients_low_to_high':A,
      'Bpoly_coefficients_low_to_high':BB,
      'C_coefficients_low_to_high':C,
      'four_AC_minus_B_squared_coefficients_low_to_high':[int(v) for v in discr],
      'strict_scalar_margins':{k:str(v) for k,v in margins.items()},
      'polynomial_identity_check':'Exact 3x4 interpolation grid, sufficient for bidegree at most (2,3); formulas generated directly above.',
      'proved_rectangle':'0 <= delta <= 5/6, 0 <= x <= 1/2',
      'published_boundary_difference':str(F(8748867,10000000)-B),
    }

if __name__=='__main__':
    # Independently recheck source stage 0, which licenses the new stage.
    stage0=certificate(F(173,2000),F(10027,60000),F(3,4),F(1,10**6),F(1,10**7),F(1,2*10**6))
    stage_new=certificate(F(17307,200000),F(2506801,15000000),F(29991,40000),F(1,10**10),F(1,10**12),F(1,10**11))
    assert F(stage0['boundary'])==F(stage_new['licensing_boundary'])
    out={'source':'https://arxiv.org/html/2610.15291v2','source_version':'v2, 15 October 2026','stage0':stage0,'new_stage':stage_new}
    Path(__file__).with_name('parameter_certificate.json').write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({'stage0':stage0['boundary'],'new_bound':stage_new['boundary'],'new_decimal':stage_new['boundary_decimal'],'gain':stage_new['published_boundary_difference'],'status':stage_new['status'],'minimum_discriminant_coefficient':min(stage_new['four_AC_minus_B_squared_coefficients_low_to_high'])},indent=2))
