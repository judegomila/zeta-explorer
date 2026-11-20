"""Rigorous scalar U-source positivity and fifth-source single crossing.

U=64 C^(6)/kappa, S_U=W4(B',J',P',U'),
K_U=W5(B',J',P',Q',U'). No diagnostics are accepted as proof inputs.
"""
from fractions import Fraction as Q
from functools import lru_cache
from itertools import permutations
from math import factorial
from pathlib import Path
import argparse
import json
import sys

_HERE=Path(__file__).resolve().parent
_PRIOR=_HERE/'mathexplorer_second_preservation_checkpoint'/'rigorous'/'theta-second-preservation-2026-11-11'
if _PRIOR.exists():sys.path.insert(0,str(_PRIOR))
from flint import arb,arb_poly,ctx
from theta_ratio_core_certificate_20261110 import ThetaJets,rat,ball
from theta_ratio_origin_certificate_20261110 import coefficients,polynomial_derivative,kappa_remainder,error_ball

PERMS={n:[(p,(-1)**sum(p[i]>p[j] for i in range(n) for j in range(i+1,n)))
          for p in permutations(range(n))] for n in (5,6)}


def det(columns):
    n=len(columns)
    @lru_cache(maxsize=64)
    def minor(mask):
        if not mask:return 1
        row=n-mask.bit_count();out=0;position=0
        for j in range(n):
            if mask&(1<<j):
                value=columns[j][row]*minor(mask^(1<<j))
                out+=value if position%2==0 else -value
                position+=1
        return out
    return minor((1<<n)-1)


def det_permutation(columns):
    n=len(columns);out=0
    for p,sign in PERMS[n]:
        value=sign
        for i in range(n):value*=columns[p[i]][i]
        out+=value
    return out


def even_columns(u,k,rows=6):
    return [
        k[:rows],
        [-(2*j+1)*k[j]-2*u*k[j+1] for j in range(rows)],
        [(8+16*j)*k[j+1]+16*u*k[j+2] for j in range(rows)],
        [-(24+64*j+32*j*j)*k[j+1]-(96+64*j)*u*k[j+2]-32*u*u*k[j+3] for j in range(rows)],
        [(192+512*j+256*j*j)*k[j+2]+(768+512*j)*u*k[j+3]+256*u*u*k[j+4] for j in range(rows)],
        [-(960+2944*j+2304*j*j+512*j**3)*k[j+2]
         -(5760+6144*j+1536*j*j)*u*k[j+3]
         -(3840+1536*j)*u*u*k[j+4]-512*u**3*k[j+5]
         for j in range(rows)]
    ]


def core_columns(t,k,rows=6):
    return [k[:rows],
            [t*k[j+1]+j*k[j] for j in range(rows)],
            k[2:2+rows],
            [t*k[j+3]+j*k[j+2] for j in range(rows)],
            k[4:4+rows],
            [t*k[j+5]+j*k[j+4] for j in range(rows)]]


def core_numerators(t,k,derivative=False):
    cols=core_columns(t,k,7 if derivative else 6)
    KU=-4096*det([c[:6] for c in cols])
    last=[cols[5][j]+5*cols[4][j] for j in range(5)]
    SU=-256*det([c[:5] for c in cols[:4]]+[last])
    if derivative:
        KUp=-4096*det([[c[j] for j in [0,1,2,3,4,6]] for c in cols])
        normalized_derivative=t*(KUp*k[0]-6*KU*k[1])-15*KU*k[0]
        return SU,KU,normalized_derivative
    return SU,KU


def exact_checks():
    import sympy as s
    u,t=s.symbols('u t');K=s.Function('K')(u)
    targets=[K,-K-2*u*s.diff(K,u),8*s.diff(K,u)+16*u*s.diff(K,u,2),
             -24*s.diff(K,u)-96*u*s.diff(K,u,2)-32*u*u*s.diff(K,u,3),
             192*s.diff(K,u,2)+768*u*s.diff(K,u,3)+256*u*u*s.diff(K,u,4),
             -960*s.diff(K,u,2)-5760*u*s.diff(K,u,3)-3840*u*u*s.diff(K,u,4)-512*u**3*s.diff(K,u,5)]
    cols=even_columns(u,[s.diff(K,u,j) for j in range(11)])
    checks=[]
    for c,(col,target) in enumerate(zip(cols,targets)):
        for j,entry in enumerate(col):
            assert s.expand(s.diff(target,u,j)-entry)==0,(c,j)
            checks.append(f'even_column_{c}_jet_{j}')
    eye=s.eye(6)
    k,tk,k2,tk3,k4,tk5=[eye[:,i] for i in range(6)]
    original=[k,-k-tk,4*k2,-12*k2-4*tk3,16*k4,-80*k4-16*tk5]
    assert s.Matrix.hstack(*original).det()==-4096
    checks.append('K_U_six_column_elimination')
    eye=s.eye(5)
    k,tk,k2,tk3,last=[eye[:,i] for i in range(5)]
    assert s.Matrix.hstack(k,-k-tk,4*k2,-12*k2-4*tk3,-16*last).det()==-256
    checks.append('S_U_five_column_elimination')
    functions=[s.Function('f'+str(j))(u) for j in range(6)]
    w=det([[s.diff(f,u,j) for j in range(6)] for f in functions])
    wp=det([[s.diff(f,u,j) for j in [0,1,2,3,4,6]] for f in functions])
    assert s.expand(s.diff(w,u)-wp)==0
    checks.append('six_column_Wronskian_derivative')
    V=s.Function('V')(t);kk=s.Function('k')(t)
    assert s.cancel(s.diff(V/(t**15*kk**6),t)-(t*(s.diff(V,t)*kk-6*V*s.diff(kk,t))-15*V*kk)/(t**16*kk**7))==0
    checks.append('t15_normalized_derivative')
    for n in (5,6):
        columns=[list(s.symbols('m'+str(c)+'_0:'+str(n))) for c in range(n)]
        assert s.expand(det(columns)-det_permutation(columns))==0
        checks.append('memoized_determinant_order_'+str(n))
    for n in (4,5):
        rows=[];row=[s.Integer(1)]+[s.Integer(0)]*n
        for _ in range(n):
            row=[s.diff(row[k],t)+(2*t*row[k-1] if k else 0) for k in range(n+1)]
            rows.append(row[1:])
        assert s.expand(s.Matrix(rows).det()-(2*t)**(n*(n+1)//2))==0
        checks.append('even_Wronskian_factor_order_'+str(n))
    return {'status':'passed','exact_checks':len(checks),'checks':checks}


def origin_certificate(degree=56,terms=16,cells=256):
    upper=arb(9)/256
    b,tail=coefficients(degree,terms)
    errors=[kappa_remainder(j,degree,upper) for j in range(11)]
    K=[arb_poly(polynomial_derivative(b,j))+arb_poly([error_ball(errors[j])]) for j in range(11)]
    cols=even_columns(arb_poly([0,1]),K)
    SU=det([cols[i][:5] for i in (0,1,2,3,5)])
    KU=det([c[:6] for c in cols])
    lowerSU=None;upperKU=None
    for i in range(cells):
        u=upper*(2*i+1)/(2*cells)+ball(upper/(2*cells));kk=K[0](u)
        assert kk>0
        su=1024*SU(u)/kk**5;ku=32768*KU(u)/kk**6
        assert su>0,('SU',i,su)
        assert ku<0,('KU',i,ku)
        lowerSU=su.lower() if lowerSU is None else min(lowerSU,su.lower())
        upperKU=ku.upper() if upperKU is None else max(upperKU,ku.upper())
    return {'status':'passed','domain':'0<t<=3/16, with t10/t15 normalized limits',
            'cells':cells,'degree':degree,'theta_terms':terms,'precision_bits':ctx.prec,
            'SU_over_t10_lower':str(lowerSU),'KU_over_t15_upper':str(upperKU),
            'SU_over_t10_origin':str(1024*SU(arb(0))/K[0](arb(0))**5),
            'KU_over_t15_origin':str(32768*KU(arb(0))/K[0](arb(0))**6),
            'theta_disk_tail_bound':str(tail),'K_derivative_remainders':[str(e) for e in errors]}


def core_certificate(order=16,terms=16,stop=Q(3,16),start=Q(4)):
    jet=ThetaJets(order+11,terms)
    right=start;cells=0;widths={};counts={'negative_KU':0,'crossing_derivative':0,'positive_KU':0}
    minima={'SU':None,'KU_positive':None,'normalized_KU_derivative':None};maximum_negative=None
    while right>stop:
        step=Q(1,64)
        while not rat(step)*arb.pi()*rat(right).exp()<=arb(1)/8:step/=2
        for split in (Q(9,16),Q(1,2),stop):
            if right>split:step=min(step,right-split)
        left=right-step;center=rat((right+left)/2);half=rat(step/2);delta=ball(half)
        jm=jet(center);jb=jet(center+delta)
        tpoly=arb_poly([center,1])
        K=[arb_poly([jm[j+m]/factorial(m) for m in range(order)]+[jb[j+order]/factorial(order)]) for j in range(12)]
        crossing=(left>=Q(1,2) and right<=Q(9,16))
        values=core_numerators(tpoly,K,crossing)
        su=values[0](delta);ku=values[1](delta);upperk=jet(rat(left),0)[0].upper()
        assert su>0,('SU',left,right,su)
        su=(su/upperk**5).lower()
        minima['SU']=su if minima['SU'] is None else min(minima['SU'],su)
        if crossing:
            der=values[2](delta)
            assert der>0,('KU_derivative',left,right,der)
            bound=(der/(rat(right)**16*upperk**7)).lower()
            minima['normalized_KU_derivative']=bound if minima['normalized_KU_derivative'] is None else min(minima['normalized_KU_derivative'],bound)
            counts['crossing_derivative']+=1
        elif right<=Q(1,2):
            assert ku<0,('KU_negative',left,right,ku)
            bound=(ku/upperk**6).upper()
            maximum_negative=bound if maximum_negative is None else max(maximum_negative,bound)
            counts['negative_KU']+=1
        elif left>=Q(9,16):
            assert ku>0,('KU_positive',left,right,ku)
            bound=(ku/upperk**6).lower()
            minima['KU_positive']=bound if minima['KU_positive'] is None else min(minima['KU_positive'],bound)
            counts['positive_KU']+=1
        else:raise AssertionError(('Unclassified interval',left,right))
        right=left;cells+=1;widths[str(step)]=widths.get(str(step),0)+1
        if cells%512==0:print(json.dumps({'progress':'U_source_core','cells':cells,'right':str(right)}),flush=True)
    endpoints={}
    for tt in (Q(1,2),Q(9,16)):
        t=rat(tt);k=jet(t);value=core_numerators(t,k)[1]/k[0]**6
        assert value<0 if tt==Q(1,2) else value>0
        endpoints[str(tt)]=str(value)
    return {'status':'passed','domain':'3/16<=t<=4','cells':cells,'Taylor_order':order,
            'theta_terms':terms,'precision_bits':ctx.prec,'cell_widths':widths,'region_cell_counts':counts,
            'strict_lower_bounds':{k:str(v) for k,v in minima.items()},
            'KU_negative_upper_bound':str(maximum_negative),'crossing_endpoint_values':endpoints,
            'claim':'SU>0 throughout; KU<0 up to1/2, KU/t15 strictly increasing on[1/2,9/16], KU>0 from9/16 onward.'}


def tail_certificate():
    import sympy as s
    checks=[];records={}
    def check(name,condition):
        if not bool(condition):raise AssertionError(name)
        checks.append(name)
    t,z=s.symbols('t z')
    ps=[2*z*z-3*z]
    for _ in range(10):ps.append(s.expand((s.Rational(1,4)-z)*ps[-1]+z*s.diff(ps[-1],z)))
    rowsK=[[ps[j],t*ps[j+1]+j*ps[j],ps[j+2],t*ps[j+3]+j*ps[j+2],ps[j+4],t*ps[j+5]+j*ps[j+4]] for j in range(6)]
    rowsS=[[ps[j],t*ps[j+1]+j*ps[j],ps[j+2],t*ps[j+3]+j*ps[j+2],t*ps[j+5]+(j+5)*ps[j+4]] for j in range(5)]
    print(json.dumps({'progress':'U_source_tail','phase':'first_mode_determinants'}),flush=True)
    sources={'KU':s.factor(-4096*s.Matrix(rowsK).det(method='domain-ge')/ps[0]**6),
             'SU':s.factor(-256*s.Matrix(rowsS).det(method='domain-ge')/ps[0]**5)}
    for name,expression in sources.items():
        num,den=s.fraction(s.factor(expression-1));counts=[]
        for label,part in [('numerator',num),('denominator',den)]:
            poly=s.Poly(s.expand(part.subs({z:z+160,t:t+4})),z,t)
            check(name+'_first_mode_margin_'+label,all(c>=0 for c in poly.coeffs()) and poly.coeff_monomial(1)>0)
            counts.append({'terms':len(poly.terms()),'degree':poly.total_degree()})
        records[name]={'shifted_positive_coefficient_counts':counts}
    rr=s.symbols('r0:11')
    def Dt(e):return s.diff(e,t)+sum(s.diff(e,rr[j])*rr[j+1] for j in range(10))
    R=[s.Integer(1)]
    for _ in range(5):R.append(s.expand(Dt(R[-1])-rr[0]*R[-1]))
    B=t*rr[0]-1;J=4*R[2];P=-4*(t*R[3]+3*R[2]);QQ=16*R[4];U=-16*(t*R[5]+5*R[4])
    for name,bases in [('KU',(B,J,P,QQ,U)),('SU',(B,J,P,U))]:
        norms=[];degrees=[]
        for base in bases:
            nn=[];dd=[];val=base
            for _ in range(len(bases)):
                val=s.expand(Dt(val));poly=s.Poly(val,t,*rr)
                nn.append(sum(abs(c) for c in poly.coeffs()));dd.append(poly.total_degree())
            norms.append(max(nn));degrees.append(max(dd))
        norm=factorial(len(bases))*s.prod(norms);degree=sum(degrees)
        error=degree*norm*3**(degree-1)*2**122*s.Integer(160)**(degree+9)*s.Rational(1,2)**480
        check(name+'_perturbation_below_half',error<s.Rational(1,2))
        check(name+'_perturbation_decreases',s.Rational(degree+9,160)-3<0)
        records[name].update({'polynomial_column_norms':[str(v) for v in norms],
                              'polynomial_column_degrees':degrees,'polynomial_norm_bound':str(norm),
                              'polynomial_degree_bound':degree,'full_theta_error_at_160_upper':str(error)})
    check('theta_frequency_at_t4',3*s.Rational(19,7)**4>160)
    check('exponential_lower_bound',sum(s.Rational(1,factorial(j)) for j in range(6))>s.Rational(19,7))
    x=s.symbols('x');qpoly=x/(1-x)
    for j in range(11):
        check('first_mode_log_jet_remainder_'+str(j),qpoly.subs(x,s.Rational(3,320))<1)
        qpoly=s.factor(x*s.diff(qpoly,x))
    check('coarse_tenth_derivative_bound',factorial(10)*s.Rational(3,320)*s.Rational(320,317)**11<2**17)
    check('Touchard_bound',s.bell(10)<2**17)
    check('omitted_mode_geometric_ratio',s.Rational(3,2)**24*s.Rational(1,2)**800<s.Rational(1,2))
    check('theta_derivative_constant',2**10*2**18*2**17*2*2**24==2**70)
    check('logarithm_derivative_constant',2**10*factorial(10)*factorial(9)<2**52)
    check('theta_error_below_one',2**70*s.Integer(160)**10*s.Rational(1,2)**480<1)
    check('logarithm_error_below_one',2**122*s.Integer(160)**10*s.Rational(1,2)**480<1)
    return {'status':'passed','domain':'t>=4, z=pi exp(t)>160','exact_checks':len(checks),
            'checks':checks,'sources':records,'conclusion':'SU>1/2 and KU>1/2 throughout the full theta spatial tail',
            'scope':'Exact first-mode shifted polynomial signs and explicit errors for every omitted theta mode and required logarithmic derivative.'}


def certify():
    """Recompute every proof component and return one combined record."""
    if not __debug__:
        raise RuntimeError('Do not disable assertions.')
    ctx.prec=512
    exact=exact_checks()
    origin=origin_certificate()
    core=core_certificate()
    tail=tail_certificate()
    for name,result in [('exact',exact),('origin',origin),('core',core),('tail',tail)]:
        if result.get('status')!='passed':raise AssertionError((name,result))
    return {'status':'passed','precision_bits':ctx.prec,
            'exact_algebra_checks':exact['exact_checks'],
            'exact_tail_checks':tail['exact_checks'],
            'interval_cells':origin['cells']+core['cells'],
            'exact':exact,'origin':origin,'core':core,'tail':tail,
            'scope':'SU is strictly positive for all t>0; KU has exactly one simple negative-to-positive crossing in(1/2,9/16), after the fixed SQ crossing in(0,3/16).'}


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--exact',action='store_true');ap.add_argument('--origin',action='store_true');ap.add_argument('--core',action='store_true');ap.add_argument('--tail',action='store_true');ap.add_argument('--all',action='store_true');args=ap.parse_args()
    if not __debug__:raise RuntimeError('Do not disable assertions.')
    ctx.prec=512
    if args.all:out=certify()
    elif args.exact:out=exact_checks()
    elif args.origin:out=origin_certificate()
    elif args.core:out=core_certificate()
    elif args.tail:out=tail_certificate()
    else:raise SystemExit('Choose a component.')
    print(json.dumps(out,indent=2),flush=True)


if __name__=='__main__':main()
