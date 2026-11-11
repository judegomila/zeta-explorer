"""Exact first-reduced source-origin formulas and all-large-anchor proof.

The finite-anchor companion certifies 0<a<=100 using fresh theta moments.
This file recomputes the source polynomials, proves a global twelfth
spatial derivative bound, and certifies both origin signs for a>=100.
No diagnostic file or precomputed decimal is accepted as a proof input.
"""
from math import factorial
import json
import sympy as s
from flint import arb,ctx
from theta_preservation_origin_20261110 import Theta,anchor_p
from theta_ratio_c_integral_20261110 import C_point


def source_polynomials():
    q,N,d,c,b,g,k8,h=s.symbols('q N d c b g k8 h')
    Y=q*N-d
    Z=q*Y+4*c*(d+2)
    T=q*Z-16*b*(d+4)
    nn=[N,Y/8,Z/192,T/7680]
    kk=[1,-c/2,b/12,g/120]
    tk=[0,-c,b/3,g/20]
    cc=[h,-s.Rational(1,8),c/16,-b/96]
    k2=[-c,b/2,g/12,k8/120]
    DH=s.factor(64*s.Matrix([[nn[i],kk[i],tk[i],cc[i]] for i in range(4)]).det())
    DP=s.factor(-256*s.Matrix([[nn[i],kk[i],tk[i],k2[i]] for i in range(4)]).det())
    return {'q':q,'N':N,'d':d,'c':c,'b':b,'g':g,'k8':k8,'h':h,
            'Y':Y,'Z':Z,'T':T,'DH':DH,'DP':DP}


def exact_audit(data):
    checks=[]
    def zero(name,expr):
        if s.factor(expr)!=0:
            raise AssertionError(name)
        checks.append(name)
    q,N,d,c,b,g,k8,h=[data[k] for k in ('q','N','d','c','b','g','k8','h')]
    Y,Z,T,DH,DP=[data[k] for k in ('Y','Z','T','DH','DP')]
    zero('first_even_ODE_jet',4*(Y/4)-q*N+d)
    zero('second_even_ODE_jet',4*(Z/16)-q*Y/4-c*(d+2))
    zero('third_even_ODE_jet',4*(T/64)-q*Z/16+b*(d+4))
    for name,expr in [('H',DH),('P',DP)]:
        zero(name+'_linear_in_N',s.diff(expr,N,2))
        zero(name+'_linear_in_d',s.diff(expr,d,2))
        zero(name+'_no_N_d_cross_term',s.diff(expr,N,d))
    zero('H_zero_anchor_cancellation',DH.subs({N:h,d:1,q:0}))
    if not s.cancel(DH.subs({N:h,d:1})/q).is_polynomial(q):
        raise AssertionError('H_deflated_anchor_polynomial')
    checks.append('H_deflated_anchor_polynomial')
    a,p=s.symbols('a p',positive=True)
    for j in range(7):
        moment=(s.Rational(1,4)*((2*j+1)/(a/2)**(2*j+2)+2*p/(a/2)**(2*j+1)))
        zero('Laplace_moment_coefficient_'+str(j),moment-4**j*(1+a*p+2*j)/a**(2*j+2))
    return checks


def evaluate_coefficient(expr,values):
    """Evaluate an exact rational polynomial using outward-rounded Arb."""
    if expr in values:
        return values[expr]
    if expr.is_Rational:
        return arb(int(expr.p))/int(expr.q)
    if expr.is_Add:
        return sum(evaluate_coefficient(v,values) for v in expr.args)
    if expr.is_Mul:
        result=arb(1)
        for v in expr.args:
            result*=evaluate_coefficient(v,values)
        return result
    if expr.is_Pow and expr.exp.is_Integer:
        return evaluate_coefficient(expr.base,values)**int(expr.exp)
    raise TypeError(f'Unsupported coefficient: {expr}')


def certify_global_twelfth(theta,k0,cells=4096):
    if cells!=4096:
        raise ValueError('This certificate uses exactly 4096 closed dyadic cells.')
    maximum=arb(0)
    for i in range(cells):
        midpoint=arb(2*i+1)/2048
        radius=arb(1)/2048
        interval=midpoint+arb(0,radius)
        jm=theta.jets(midpoint)
        ji=theta.jets(interval)
        bound=((jm[12]/k0).abs_upper()
               +radius*(jm[13]/k0).abs_upper()
               +radius**2/2*(ji[14]/k0).abs_upper())
        if not bound<150000000:
            raise AssertionError(('global_twelfth_cell',i,bound))
        if bound>maximum:
            maximum=bound
    if not maximum<141955909:
        raise AssertionError('reported core margin')
    e4=arb(4).exp()
    if not 3*e4>arb(57)/4:
        raise AssertionError('tail majorant must decrease')
    if not arb(2)**28*(-9*e4).exp()<arb(1)/2:
        raise AssertionError('tail theta series ratio')
    tail=2*theta.norms[12]*(4*e4)**14*(1-3*e4).exp()/k0
    if not tail<150000000:
        raise AssertionError('twelfth derivative tail bound')
    return {'cells':cells,'core_upper_bound':str(maximum),'tail_upper_bound':str(tail),
            'global_bound':150000000,
            'method':'Second-order Taylor models on closed dyadic cells in [0,4], analytic monotone theta tail, evenness for negative t.'}


def certify():
    ctx.prec=256
    data=source_polynomials()
    exact_checks=exact_audit(data)
    q,N,d,c,b,g,k8,h=[data[k] for k in ('q','N','d','c','b','g','k8','h')]
    th=Theta(14,16)
    js=th.jets(0);k0=js[0]
    if not k0>0:
        raise AssertionError('positive kappa0')
    C0=C_point(0)
    k10=s.symbols('k10')
    values={c:-js[2]/k0,b:js[4]/k0,g:js[6]/k0,k8:js[8]/k0,
            k10:js[10]/k0,h:C0/k0}
    p100=anchor_p(th,100)
    if not (p100>1 and p100<arb(3)/2):
        raise AssertionError('p100 anchor bounds')
    # Together with the proved 0<a*p'(a)<1/2 for a>=100 in the
    # second-origin companion, this gives 101<=d<=1+3q/200.
    derivative_bound=certify_global_twelfth(th,k0)
    M=s.Integer(derivative_bound['global_bound'])
    model=(d/q-4*c*(d+2)/q**2+16*b*(d+4)/q**3+64*g*(d+6)/q**4
           +256*k8*(d+8)/q**5+1024*k10*(d+10)/q**6)
    coefficient_records={}
    shifted_records={}
    for name,expr,error_sign,coefficient_sign in [
        ('H',data['DH'],-1,1),('P',data['DP'],1,-1)]:
        A=s.factor(s.diff(expr,N))
        ac=s.Poly(A,q)
        av=[evaluate_coefficient(ac.coeff_monomial(q**j),values) for j in range(4)]
        if not all(coefficient_sign*v>0 for v in av):
            raise AssertionError((name,'coefficient_N_sign',av))
        coefficient_records[name]=[str(v) for v in av]
        lower=s.expand(q**7*expr.subs(N,model)+error_sign*4096*M*A*(d+12))
        if not lower.is_polynomial(q,d):
            raise AssertionError((name,'cleared_tail_polynomial'))
        if s.diff(lower,d,2)!=0:
            raise AssertionError((name,'tail_affine_in_d'))
        shifted_records[name]={}
        for label,dd in [('lower_d',s.Integer(101)),('upper_d',1+s.Rational(3,200)*q)]:
            polynomial=s.Poly(s.expand(lower.subs(d,dd).subs(q,q+10000)),q)
            balls=[evaluate_coefficient(v,values) for v in polynomial.all_coeffs()]
            if not all(v>0 for v in balls):
                raise AssertionError((name,label,'shifted_coefficients',balls))
            constant_margins={('H','lower_d'):19*10**23,('H','upper_d'):34*10**23,
                              ('P','lower_d'):38*10**26,('P','upper_d'):31*10**26}
            if not balls[-1]>constant_margins[name,label]:
                raise AssertionError((name,label,'reported constant margin'))
            shifted_records[name][label]={'degree':polynomial.degree(),
                'descending_coefficients':[str(v) for v in balls]}
    return {'status':'passed','precision_bits':ctx.prec,'exact_check_count':len(exact_checks),
            'exact_checks':exact_checks,'anchor_domain':'a>=100',
            'parameters':{str(k):str(v) for k,v in values.items()},
            'kappa0':str(k0),'C0':str(C0),'p100':str(p100),
            'global_twelfth_derivative':derivative_bound,
            'N_coefficient_signs':coefficient_records,'positive_shifted_tail_polynomials':shifted_records,
            'prior_tail_dependency':"0<a*p'(a)<1/2 and p(a)>1 for a>=100, proved in theta_second_origin_20261111.md and its exact checks.",
            'conclusion':'DH>0 and DP>0 for every a>=100. Thus both normalized first-reduced source-origin limits are strictly positive there.',
            'scope':'Together with the finite-anchor companion this closes the first-reduced source origin gate for every a>0; a separate spatial transfer theorem is required for global source signs.'}

if __name__=='__main__':
    if not __debug__:
        raise SystemExit('Verification must run without python -O.')
    print(json.dumps(certify(),indent=2,sort_keys=True))
