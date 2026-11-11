"""Actual-theta S_U positivity for the next P-source compensation.

S_U=W4(B',J',P',U'), U=64 C^(6)/kappa. Interval origin and core,
then an exact first-mode tail with explicit omitted-mode errors.
"""
from fractions import Fraction as Q
from functools import lru_cache
from math import comb, factorial
import argparse
import json
from pathlib import Path
import sys
import time

_HERE=Path(__file__).resolve().parent
_PRIOR=_HERE/'mathexplorer_second_preservation_checkpoint'/'rigorous'/'theta-second-preservation-2026-11-11'
if _PRIOR.exists():sys.path.insert(0,str(_PRIOR))

from flint import arb,arb_poly,ctx
from theta_ratio_core_certificate_20261110 import ThetaJets,rat,ball
from theta_ratio_origin_certificate_20261110 import coefficients,polynomial_derivative,kappa_remainder,error_ball


def det5(columns):
    @lru_cache(maxsize=32)
    def minor(mask):
        if not mask:return 1
        row=5-mask.bit_count();out=0;position=0
        for j in range(5):
            if mask&(1<<j):
                value=columns[j][row]*minor(mask^(1<<j))
                out+=value if position%2==0 else -value
                position+=1
        return out
    return minor(31)


def even_column(u,k,terms):
    return [sum(coef*comb(j,l)*factorial(power)//factorial(power-l)
                *u**(power-l)*k[index+j-l]
                for coef,power,index in terms for l in range(min(j,power)+1))
            for j in range(5)]


def even_columns(u,k):
    return [k[:5],
            even_column(u,k,[(-1,0,0),(-2,1,1)]),
            even_column(u,k,[(8,0,1),(16,1,2)]),
            even_column(u,k,[(-24,0,1),(-96,1,2),(-32,2,3)]),
            even_column(u,k,[(-960,0,2),(-5760,1,3),(-3840,2,4),(-512,3,5)])]


def core_numerator(t,k):
    columns=[k[:5],
             [t*k[j+1]+j*k[j] for j in range(5)],
             k[2:7],
             [t*k[j+3]+j*k[j+2] for j in range(5)],
             [t*k[j+5]+(j+5)*k[j+4] for j in range(5)]]
    return -256*det5(columns)


def origin_certificate(degree=56,terms=16,cells=256):
    upper=arb(9)/256
    b,tail=coefficients(degree,terms)
    errors=[kappa_remainder(j,degree,upper) for j in range(10)]
    K=[arb_poly(polynomial_derivative(b,j))+arb_poly([error_ball(errors[j])]) for j in range(10)]
    num=det5(even_columns(arb_poly([0,1]),K))
    minimum=None
    for i in range(cells):
        u=upper*(2*i+1)/(2*cells)+ball(upper/(2*cells))
        kk=K[0](u)
        assert kk>0
        value=2**10*num(u)/kk**5
        assert value>0,(i,value)
        if minimum is None or value.lower()<minimum:minimum=value.lower()
    return {'status':'passed','domain':'0<t<=3/16, with the t^10-normalized origin limit',
            'cells':cells,'degree':degree,'theta_terms':terms,'precision_bits':ctx.prec,
            'normalized_lower_bound':str(minimum),
            'normalized_origin':str(2**10*num(arb(0))/K[0](arb(0))**5),
            'theta_disk_tail_bound':str(tail),
            'K_derivative_remainders':[str(e) for e in errors]}


def core_certificate(order=16,terms=16,stop=Q(3,16),start=Q(4)):
    jet=ThetaJets(order+9,terms)
    right=start;minimum=None;cells=0;widths={}
    while right>stop:
        step=Q(1,64)
        while not rat(step)*arb.pi()*rat(right).exp()<=arb(1)/8:step/=2
        step=min(step,right-stop);left=right-step
        center=rat((right+left)/2);half=rat(step/2);delta=ball(half)
        jm=jet(center);jb=jet(center+delta)
        tpoly=arb_poly([center,1])
        K=[arb_poly([jm[j+m]/factorial(m) for m in range(order)]
                    +[jb[j+order]/factorial(order)]) for j in range(10)]
        value=core_numerator(tpoly,K)(delta)
        assert value>0,(left,right,value)
        assert jb[0]>0
        normalized=(value/jb[0].upper()**5).lower()
        if minimum is None or normalized<minimum:minimum=normalized
        right=left;cells+=1;widths[str(step)]=widths.get(str(step),0)+1
        if cells%512==0:print(json.dumps({'progress':'U_fixed_source_core','cells':cells,'right':str(right)}),flush=True)
    return {'status':'passed','domain':f'{stop}<=t<={start}','cells':cells,
            'Taylor_order':order,'theta_terms':terms,'precision_bits':ctx.prec,
            'lower_bound':str(minimum),'cell_widths':widths}


def first_mode_expression():
    import sympy as s
    t,z=s.symbols('t z');ps=[2*z*z-3*z]
    for _ in range(9):ps.append(s.expand((s.Rational(1,4)-z)*ps[-1]+z*s.diff(ps[-1],z)))
    rows=[[ps[j],t*ps[j+1]+j*ps[j],ps[j+2],t*ps[j+3]+j*ps[j+2],
           t*ps[j+5]+(j+5)*ps[j+4]] for j in range(5)]
    expr=s.factor(-256*s.Matrix(rows).det(method='domain-ge')/ps[0]**5)
    return s,t,z,expr


def tail_algebra():
    s,t,z,expr=first_mode_expression()
    num,den=s.fraction(s.factor(expr-1));records=[]
    for part in (num,den):
        pp=s.Poly(s.expand(part.subs({z:z+160,t:t+4})),z,t)
        records.append({'degree':pp.total_degree(),'terms':len(pp.terms()),
                        'minimum_coefficient':str(min(pp.coeffs())),
                        'constant':str(pp.coeff_monomial(1)),
                        'positive':bool(all(c>=0 for c in pp.coeffs()) and pp.coeff_monomial(1)>0)})
    return {'status':'diagnostic_algebra','expression':str(expr),'shifted_margin':records}


def exact_checks():
    import sympy as s
    checks=[]
    def check(name,e):
        assert s.simplify(e)==0,(name,e)
        checks.append(name)
    columns=list(s.eye(5).columnspace())
    k,tk,k2,tk3,last=columns
    check('ordinary_source_column_factor',s.Matrix.hstack(k,-k-tk,4*k2,-4*tk3-12*k2,-16*last).det()+256)
    u,t=s.symbols('u t');cc=s.symbols('c0:13')
    C=sum(cc[j]*u**j for j in range(13));K=-8*s.diff(C,u)
    kvals=[s.diff(K,u,j) for j in range(10)]
    ecol=even_columns(u,kvals)
    Hraw=[K,-K-2*u*s.diff(K,u),8*s.diff(K,u)+16*u*s.diff(K,u,2),
          -24*s.diff(K,u)-96*u*s.diff(K,u,2)-32*u*u*s.diff(K,u,3),
          64*s.diff(C.subs(u,t*t),t,6).subs(t,s.sqrt(u))]
    for name,col,base in zip(['kappa','B','J','P','U'],ecol,Hraw):
        check('even_column_'+name,sum((j+1)*(s.expand(col[j]-s.diff(base,u,j)))**2 for j in range(5)))
    check('C_sixth_derivative',64*s.diff(C.subs(u,t*t),t,6)
          +16*t*s.diff(K.subs(u,t*t),t,5)+80*s.diff(K.subs(u,t*t),t,4))
    return {'status':'passed','exact_checks':len(checks),'check_names':checks,
            'scope':'Actual ordinary column factor, even differentiated columns, and sixth C derivative.'}


def tail_certificate():
    s,t,z,expression=first_mode_expression();checks=[]
    def check(name,condition):
        if not bool(condition):raise AssertionError(name)
        checks.append(name)
    num,den=s.fraction(s.factor(expression-1));counts=[]
    for name,part in [('numerator',num),('denominator',den)]:
        poly=s.Poly(s.expand(part.subs({z:z+160,t:t+4})),z,t)
        check('positive_first_mode_margin_'+name,all(c>=0 for c in poly.coeffs()) and poly.coeff_monomial(1)>0)
        counts.append(len(poly.terms()))
    rr=s.symbols('r0:10')
    def Dt(e):return s.diff(e,t)+sum(s.diff(e,rr[j])*rr[j+1] for j in range(9))
    k=[s.Integer(1)]
    for _ in range(5):k.append(s.expand(Dt(k[-1])-rr[0]*k[-1]))
    B=t*rr[0]-1;J=4*k[2];P=-4*t*k[3]-12*k[2];U=-16*t*k[5]-80*k[4]
    norms=[];degrees=[]
    for base in (B,J,P,U):
        n=[];d=[];value=base
        for _ in range(4):
            value=s.expand(Dt(value));poly=s.Poly(value,t,*rr)
            n.append(sum(abs(c) for c in poly.coeffs()));d.append(poly.total_degree())
        norms.append(max(n));degrees.append(max(d))
    norm_bound=factorial(4)*s.prod(norms);degree_bound=sum(degrees)
    check('determinant_polynomial_degree_bound',degree_bound<=14)
    check('determinant_polynomial_norm_bound',norm_bound<2**42)
    # Recheck the shared differentiated omitted-mode majorants. They are
    # analytic inequalities on all z>=160, not samples of theta derivatives.
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
    error_coefficient=14*2**42*3**13*2**122
    error_at_160=error_coefficient*s.Integer(160)**23*s.Rational(1,2)**480
    check('full_polynomial_error_below_half',error_at_160<s.Rational(1,2))
    check('full_polynomial_error_decreases',s.Rational(23,160)-3<0)
    return {'status':'passed','domain':'t>=4, z=pi exp(t)>160',
            'exact_checks':len(checks),'checks':checks,
            'shifted_coefficient_counts':counts,
            'polynomial_column_norms':[str(v) for v in norms],
            'polynomial_column_degrees':degrees,
            'polynomial_norm_bound':str(norm_bound),'polynomial_degree_bound':degree_bound,
            'full_theta_error_at_160_upper':str(error_at_160),
            'conclusion':'S_U>1/2 on the full spatial tail',
            'scope':'Actual infinite theta sum with differentiated omitted-mode bounds.'}


def probe():
    jet=ThetaJets(9,16);rows=[]
    for tt in ['0.001','0.01','0.0625','0.125','0.1875','0.5','1','2','3','4']:
        t=arb(tt);k=jet(t);value=core_numerator(t,k)/k[0]**5
        rows.append({'t':tt,'S_U':str(value),'S_U_t10':str(value/t**10)})
    return {'status':'point_diagnostic_only','rows':rows}


def certify():
    if not __debug__:raise RuntimeError('Do not disable assertions.')
    ctx.prec=512
    started=time.monotonic();records={}
    for name,callback in [('exact',exact_checks),('origin',origin_certificate),
                          ('core',core_certificate),('tail',tail_certificate)]:
        records[name]=callback()
        assert records[name]['status']=='passed'
    return {'status':'passed','seconds':round(time.monotonic()-started,3),
            'conclusion':'S_U=W4(B_prime,J_prime,P_prime,U_prime)>0 for every t>0.',
            'interval_cells':records['origin']['cells']+records['core']['cells'],
            'new_exact_identity_checks':records['exact']['exact_checks'],
            'tail_exact_rational_checks':records['tail']['exact_checks'],
            'components':records,
            'scope':'Actual theta on the entire positive spatial axis; no diagnostic sample is a proof input.'}


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--origin',action='store_true');ap.add_argument('--core',action='store_true');ap.add_argument('--tail-algebra',action='store_true');ap.add_argument('--probe',action='store_true');ap.add_argument('--tail',action='store_true');ap.add_argument('--exact',action='store_true');ap.add_argument('--all',action='store_true');args=ap.parse_args()
    if not __debug__:raise RuntimeError('Do not disable assertions.')
    ctx.prec=512
    if args.origin:out=origin_certificate()
    elif args.core:out=core_certificate()
    elif args.tail_algebra:out=tail_algebra()
    elif args.probe:out=probe()
    elif args.tail:out=tail_certificate()
    elif args.exact:out=exact_checks()
    elif args.all:
        out=certify()
        (_HERE/'theta_mixed_u_source_replay_20261111.json').write_text(json.dumps(out,indent=2,sort_keys=True)+'\n')
    else:raise SystemExit('Choose a component.')
    print(json.dumps(out,indent=2),flush=True)


if __name__=='__main__':main()
