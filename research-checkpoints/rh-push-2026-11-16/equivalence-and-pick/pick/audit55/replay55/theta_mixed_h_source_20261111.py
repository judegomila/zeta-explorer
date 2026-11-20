"""Rigorous fixed-source sign for H-source propagation.

Target K_H=W5(B',J',P',Q',H')<0 on the full positive spatial axis.
This file is a research verifier; all continuum claims require both
the compact interval certificates and the analytic tail proof.
"""
from fractions import Fraction as Q
from functools import lru_cache
from itertools import permutations
from math import factorial
import argparse
import json
from pathlib import Path
import sys

_HERE=Path(__file__).resolve().parent
_PRIOR=_HERE/'mathexplorer_second_preservation_checkpoint'/'rigorous'/'theta-second-preservation-2026-11-11'
if _PRIOR.exists():sys.path.insert(0,str(_PRIOR))

from flint import arb,arb_poly,ctx
from theta_ratio_core_certificate_20261110 import ThetaJets,rat,ball
from theta_ratio_c_integral_20261110 import C_point
from theta_ratio_origin_certificate_20261110 import coefficients,polynomial_derivative,kappa_remainder,error_ball

PERMS=[(p,(-1)**sum(p[i]>p[j] for i in range(6) for j in range(i+1,6)))
       for p in permutations(range(6))]


def det6(columns):
    # Cofactor recursion shares each subminor. All operations retain
    # outward-rounded polynomial coefficients; no interval division occurs.
    @lru_cache(maxsize=64)
    def minor(mask):
        if not mask:return 1
        row=6-mask.bit_count();out=0;position=0
        for j in range(6):
            if mask&(1<<j):
                value=columns[j][row]*minor(mask^(1<<j))
                out+=value if position%2==0 else -value
                position+=1
        return out
    return minor(63)


def even_columns(u,k,C):
    return [
        k[:6],
        [-(2*j+1)*k[j]-2*u*k[j+1] for j in range(6)],
        [(8+16*j)*k[j+1]+16*u*k[j+2] for j in range(6)],
        [-(24+64*j+32*j*j)*k[j+1]-(96+64*j)*u*k[j+2]-32*u*u*k[j+3] for j in range(6)],
        [(192+512*j+256*j*j)*k[j+2]+(768+512*j)*u*k[j+3]+256*u*u*k[j+4] for j in range(6)],
        [8*C]+[-k[j] for j in range(5)]
    ]


def core_numerator(t,k,C):
    columns=[k[:6],
             [t*k[j+1]+j*k[j] for j in range(6)],
             k[2:8],
             [t*k[j+3]+j*k[j+2] for j in range(6)],
             k[4:10],
             [4*C]+[-t*k[j-1]-(j-1)*k[j-2] if j>1 else -t*k[0]
                     for j in range(1,6)]]
    return 64*det6(columns)


def exact_checks():
    import sympy as s
    checks=[]
    def zero(name,expression):
        assert s.expand(expression)==0,name
        checks.append(name)
    u,t=s.symbols('u t');K=s.Function('K')(u);C=s.Function('C')(u)
    cols=even_columns(u,[s.diff(K,u,j) for j in range(10)],C)
    targets=[K,-K-2*u*s.diff(K,u),8*s.diff(K,u)+16*u*s.diff(K,u,2),
             -24*s.diff(K,u)-96*u*s.diff(K,u,2)-32*u*u*s.diff(K,u,3),
             192*s.diff(K,u,2)+768*u*s.diff(K,u,3)+256*u*u*s.diff(K,u,4),8*C]
    subs={s.diff(C,u,j):-s.diff(K,u,j-1)/8 for j in range(1,6)}
    for i,(col,target) in enumerate(zip(cols,targets)):
        for j,value in enumerate(col):zero(f'even_column_{i}_jet_{j}',(s.diff(target,u,j)-value).subs(subs))
    M=s.zeros(6)
    M[:,0]=s.Matrix([1,0,0,0,0,0]);M[:,1]=s.Matrix([-1,-1,0,0,0,0])
    M[:,2]=s.Matrix([0,0,4,0,0,0]);M[:,3]=s.Matrix([0,0,-12,-4,0,0])
    M[:,4]=s.Matrix([0,0,0,0,16,0]);M[:,5]=s.Matrix([0,0,0,0,0,1])
    zero('actual_theta_column_factor',M.det()-256)
    row=[s.Integer(0),2*t]+[s.Integer(0)]*4;rows=[row[1:]]
    for _ in range(4):
        new=[s.diff(v,t) for v in row]
        for j in range(1,6):new[j]+=2*t*row[j-1]
        row=new;rows.append(row[1:])
    zero('even_derivative_coordinate_factor',s.Matrix(rows).det()-(2*t)**15)
    k=s.Function('k')(t);c=s.Function('c')(t)
    for j in range(1,6):
        expected=-(t*s.diff(k,t,j-1)+(j-1)*s.diff(k,t,j-2)) if j>1 else -t*k
        zero('C_core_jet_'+str(j),s.diff(-t*k,t,j-1)-expected)
    atoms=s.symbols('x0:36');columns=[[atoms[6*j+i] for i in range(6)] for j in range(6)]
    direct=sum(sign*s.prod(columns[p[i]][i] for i in range(6)) for p,sign in PERMS)
    zero('division_free_determinant_recursion',det6(columns)-direct)
    return {'status':'passed','exact_checks':len(checks),'checks':checks}


def origin_certificate(degree=56,terms=16,cells=256):
    upper=arb(9)/256
    b,tail=coefficients(degree,terms)
    errors=[kappa_remainder(j,degree,upper) for j in range(10)]
    K=[arb_poly(polynomial_derivative(b,j))+arb_poly([error_ball(errors[j])]) for j in range(10)]
    C0=C_point(0)
    integral=[arb(0)]+[b[j]/(j+1) for j in range(degree+1)]
    errC=40000*4**(degree+1)*upper**(degree+2)/(degree+2)/(1-4*upper)/8
    C=arb_poly([C0])-arb_poly(integral)*(arb(1)/8)+arb_poly([error_ball(errC)])
    num=det6(even_columns(arb_poly([0,1]),K,C))
    maximum=None
    for i in range(cells):
        u=upper*(2*i+1)/(2*cells)+ball(upper/(2*cells))
        kk=K[0](u)
        assert kk>0
        value=2**15*num(u)/(8*kk**6)
        assert value<0,(i,value)
        if maximum is None or value.upper()>maximum:maximum=value.upper()
    return {'status':'passed','domain':'0<t<=3/16, with the t^15-normalized origin limit',
            'cells':cells,'degree':degree,'theta_terms':terms,'precision_bits':ctx.prec,
            'normalized_upper_bound':str(maximum),
            'normalized_origin':str(2**15*num(arb(0))/(8*K[0](arb(0))**6)),
            'theta_disk_tail_bound':str(tail),'C_remainder_bound':str(errC),
            'K_derivative_remainders':[str(e) for e in errors]}


def core_certificate(order=16,terms=16,stop=Q(3,16),start=Q(4)):
    jet=ThetaJets(order+9,terms)
    right=start;Cright=C_point(rat(start));maximum=None;cells=0;widths={}
    while right>stop:
        step=Q(1,64)
        while not rat(step)*arb.pi()*rat(right).exp()<=arb(1)/8:step/=2
        step=min(step,right-stop)
        left=right-step
        center=rat((right+left)/2);half=rat(step/2);delta=ball(half)
        jm=jet(center);jb=jet(center+delta)
        tpoly=arb_poly([center,1])
        ktrunc=arb_poly([jm[m]/factorial(m) for m in range(order)])
        integ=(tpoly*ktrunc*(arb(1)/4)).integral()
        rem=rat(right)*abs(jb[order]).upper()/(4*factorial(order)*(order+1))
        E=rem*half**(order+1)
        Cmid=Cright+integ(half)+ball(E)
        Cleft=Cright+integ(half)-integ(-half)+ball(2*E)
        assert Cmid>0 and Cleft>0
        Cpoly=arb_poly([Cmid])-integ+arb_poly([arb(0)]*(order+1)+[ball(rem)])
        K=[arb_poly([jm[j+m]/factorial(m) for m in range(order)]+[jb[j+order]/factorial(order)]) for j in range(10)]
        value=core_numerator(tpoly,K,Cpoly)(delta)
        assert value<0,(left,right,value)
        upperk=jet(rat(left),0)[0].upper()
        normalized=(value/upperk**6).upper()
        if maximum is None or normalized>maximum:maximum=normalized
        Cright=Cleft;right=left;cells+=1
        widths[str(step)]=widths.get(str(step),0)+1
        if cells%512==0:print(json.dumps({'progress':'H_fixed_source_core','cells':cells,'right':str(right)}),flush=True)
    direct=C_point(rat(stop));assert direct.overlaps(Cright)
    return {'status':'passed','domain':f'{stop}<=t<={start}','cells':cells,
            'Taylor_order':order,'theta_terms':terms,'precision_bits':ctx.prec,
            'upper_bound':str(maximum),'cell_widths':widths,
            'C_endpoint_propagated':str(Cright),'C_endpoint_direct':str(direct)}


def tail_certificate():
    import sympy as s
    checks=[]
    def check(name,condition):
        if not bool(condition):raise AssertionError(name)
        checks.append(name)
    def zero(name,expression):check(name,s.factor(expression)==0)
    t,z,H=s.symbols('t z H');D=lambda e:s.diff(e,t)+z*s.diff(e,z)
    ps=[2*z*z-3*z]
    for _ in range(9):ps.append(s.expand((s.Rational(1,4)-z)*ps[-1]+z*s.diff(ps[-1],z)))
    Cjets=[ps[0]*H]+[-(t*ps[j-1]+(j-1)*ps[j-2])/4 if j>1 else -t*ps[0]/4 for j in range(1,6)]
    rows=[[ps[j],t*ps[j+1]+j*ps[j],ps[j+2],t*ps[j+3]+j*ps[j+2],ps[j+4],Cjets[j]] for j in range(6)]
    expression=s.factor(256*s.Matrix(rows).det(method='domain-ge')/ps[0]**6)
    coefficient=s.factor(s.diff(expression,H));constant=s.factor(expression.subs(H,0))
    zero('first_mode_affine',expression-coefficient*H-constant)
    r0=z-s.Rational(9,4)-3/(2*z-3)
    H4=(64*z**3*t+80*z*z*t+64*z*z+116*z*t+96*z+177*t+140)/(256*z**4)
    R4=s.factor(D(H4)-r0*H4+t/4)
    zero('H4_residual',R4-(2082*z*t+1760*z+5841*t+2496)/(1024*z**4*(2*z-3)))
    coefficient_records={}
    def positive(name,expr):
        num,den=s.fraction(s.factor(expr));counts=[]
        for label,part in [('numerator',num),('denominator',den)]:
            poly=s.Poly(s.expand(part.subs({z:z+160,t:t+4})),z,t)
            check(name+'.'+label,all(c>=0 for c in poly.coeffs()) and poly.coeff_monomial(1)>0)
            counts.append(len(poly.terms()))
        coefficient_records[name]=counts
    positive('H4_positive',H4)
    positive('R4_positive',R4)
    positive('R4_decreasing',-D(R4))
    positive('r0_above_half_z',r0-z/2)
    positive('r0_below_z',z-r0)
    positive('r0_prime_above_z',D(r0)-z)
    positive('coefficient_positive',coefficient)
    positive('negative_first_mode_margin',-coefficient*(H4+R4/r0)-constant-1)
    # Error polynomial bound without expanding its determinant. The
    # product of the five column coefficient norms bounds every term.
    rr=s.symbols('r0:10')
    def Dt(e):return s.diff(e,t)+sum(s.diff(e,rr[j])*rr[j+1] for j in range(9))+s.diff(e,H)*(rr[0]*H-t/4)
    B=t*rr[0]-1
    J=4*(rr[0]**2-rr[1])
    P=4*t*(rr[0]**3-3*rr[0]*rr[1]+rr[2])-3*J
    QQ=16*(rr[0]**4-6*rr[0]**2*rr[1]+3*rr[1]**2+4*rr[0]*rr[2]-rr[3])
    norms=[];degrees=[]
    for base in (B,J,P,QQ,H):
        n=[];d=[];value=base
        for _ in range(5):
            value=s.expand(Dt(value));poly=s.Poly(value,t,H,*rr)
            n.append(sum(abs(c) for c in poly.coeffs()));d.append(poly.total_degree())
        norms.append(max(n));degrees.append(max(d))
    norm_bound=factorial(5)*s.prod(norms)
    degree_bound=sum(degrees)
    check('determinant_polynomial_degree_bound',degree_bound<=18)
    check('determinant_polynomial_norm_bound',norm_bound<2**80)
    check('theta_frequency_at_t4',3*s.Rational(19,7)**4>160)
    check('exponential_lower_bound',sum(s.Rational(1,factorial(j)) for j in range(6))>s.Rational(19,7))
    x=s.symbols('x');qpoly=x/(1-x)
    for j in range(11):
        check('q_series_derivative_below_one_'+str(j),qpoly.subs(x,s.Rational(3,320))<1)
        qpoly=s.factor(x*s.diff(qpoly,x))
    check('coarse_tenth_derivative_bound',factorial(10)*s.Rational(3,320)*s.Rational(320,317)**11<2**17)
    check('Touchard_bound',s.bell(10)<2**17)
    check('omitted_mode_geometric_ratio',s.Rational(3,2)**24*s.Rational(1,2)**800<s.Rational(1,2))
    check('theta_derivative_constant',2**10*2**18*2**17*2*2**24==2**70)
    check('logarithm_derivative_constant',2**10*factorial(10)*factorial(9)<2**52)
    delta=2**70*s.Integer(160)**10*s.Rational(1,2)**480
    epsilon=2**122*s.Integer(160)**10*s.Rational(1,2)**480
    check('theta_error_below_one',delta<1)
    check('logarithm_error_below_one',epsilon<1)
    error_coefficient=18*2**80*3**17*2**122
    error_at_160=error_coefficient*s.Integer(160)**27*s.Rational(1,2)**480
    check('full_polynomial_error_below_half',error_at_160<s.Rational(1,2))
    check('full_polynomial_error_decreases',s.Rational(27,160)-3<0)
    return {'status':'passed','domain':'t>=4, z=pi exp(t)>160',
            'exact_checks':len(checks),'checks':checks,
            'shifted_coefficient_counts':coefficient_records,
            'polynomial_column_norms':[str(v) for v in norms],
            'polynomial_column_degrees':degrees,
            'polynomial_norm_bound':str(norm_bound),'polynomial_degree_bound':degree_bound,
            'full_theta_error_at_160_upper':str(error_at_160),
            'conclusion':'K_H<-1/2 on the full spatial tail',
            'scope':'Actual infinite theta sum, with explicit first-mode integral and differentiated omitted-mode errors.'}


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--origin',action='store_true');ap.add_argument('--core',action='store_true');ap.add_argument('--tail',action='store_true');ap.add_argument('--exact',action='store_true');args=ap.parse_args()
    if not __debug__:raise RuntimeError('Do not disable assertions.')
    ctx.prec=512
    if args.origin:out=origin_certificate()
    elif args.core:out=core_certificate()
    elif args.tail:out=tail_certificate()
    elif args.exact:out=exact_checks()
    else:
        out={'status':'passed','exact':exact_checks(),'origin':origin_certificate(),
             'core':core_certificate(),'tail':tail_certificate(),
             'claim':"W5(B',J',P',Q',H')<0 for every positive t."}
        Path('theta_mixed_h_source_replay_20261111.json').write_text(json.dumps(out,indent=2,sort_keys=True)+'\n')
    print(json.dumps(out,indent=2),flush=True)

if __name__=='__main__':main()
