"""Exact algebra audit for the second-order comparison and full theta tail.

The analytic integration, covariance determinant, and remainder proofs
are in theta_preservation_comparison_20261110.md. This file audits their
finite identities, rational signs, and deliberately conservative constants.
No sampled theta values enter these proof checks.
"""

import json
from math import factorial

import sympy as s


def run():
    checks=[]

    def check(name,value):
        if not bool(value):
            raise AssertionError(name)
        checks.append(name)

    def zero(name,expr):
        check(name,s.factor(expr)==0)

    # Exact call-kernel derivative determinant, in its one nonzero region.
    F,F1,F2,F3,m,A,Q2,Q3=s.symbols('F F1 F2 F3 m A Q2 Q3')
    col1=s.Matrix([F1*A,-F1*(1-F),m*F1])
    col2=s.Matrix([(1-F2)*Q2,-F*(1-F2),-m*(1-F2)])
    col3=s.Matrix([(1-F3)*Q3,-F*(1-F3),-m*(1-F3)])
    zero('call_kernel_three_column_identity',s.det(s.Matrix.hstack(col1,col2,col3))
         -m*F1*(1-F2)*(1-F3)*(Q3-Q2))
    below2=s.Matrix([F2*A,-F2*(1-F),m*F2])
    below3=s.Matrix([F3*A,-F3*(1-F),m*F3])
    above1=s.Matrix([(1-F1)*s.Symbol('Q1'),-F*(1-F1),-m*(1-F1)])
    zero('call_kernel_two_below_zero',s.det(s.Matrix.hstack(col1,below2,col3)))
    zero('call_kernel_all_below_zero',s.det(s.Matrix.hstack(col1,below2,below3)))
    zero('call_kernel_all_above_zero',s.det(s.Matrix.hstack(above1,col2,col3)))
    zero('call_kernel_two_above_identity',s.det(s.Matrix.hstack(col2[:2,:],col3[:2,:]))
         -F*(1-F2)*(1-F3)*(Q3-Q2))
    zero('call_kernel_cross_two_identity',s.det(s.Matrix.hstack(col1[:2,:],col2[:2,:]))
         -F1*(1-F2)*((1-F)*Q2-F*A))

    x=s.symbols('x')
    f=s.Function('f')(x);g=s.Function('g')(x);hfun=s.Function('h')(x)
    wr=s.det(s.Matrix([[s.diff(q,x,j) for q in (f,g,hfun)] for j in range(3)]))
    X=g/f;Y=hfun/f
    zero('projective_Wronskian_identity',wr-f**3*(s.diff(X,x)*s.diff(Y,x,2)-s.diff(Y,x)*s.diff(X,x,2)))
    R,r,a,z=s.symbols('R r a z')
    reduction=(z*R-a*r)/(z*r-a*R)
    reciprocal=(z/R-a/r)/(z/r-a/R)
    zero('reciprocal_reduction_commutes',reciprocal-1/reduction)

    # Uniform-measure polynomial example for the whole transfer identity.
    y,w=s.symbols('y w')
    tq=[]
    for j in (1,2,3):
        tq.append(s.integrate(w**j*(w-y),(w,y,1))-s.Rational(1,j+1)*(1-y)**2/2)
    wt=s.factor(s.det(s.Matrix([[s.diff(q,y,k) for q in tq] for k in range(3)])))
    zero('uniform_example_Wronskian',wt-y**2*(1-y)**6*(2*y+3)/s.Integer(1440))

    # The extra criterion has content beyond the original comparison class.
    tt=s.symbols('tt',positive=True)
    hg=(tt**2+5)**s.Rational(-1,2)
    bg=4*(s.diff(hg,tt,2)-4*tt*s.diff(hg,tt)+(4*tt**2-2)*hg)
    jg=16*tt**2-8
    wg=s.det(s.Matrix([[s.diff(q,tt,j) for q in (bg,jg,-hg)] for j in range(1,4)]))
    zero('counterexample_excluded_by_new_Wronskian',wg-1536*tt**6*(2*tt**6+30*tt**4+15*tt**2-950)/(tt**2+5)**8)
    check('counterexample_negative_on_unit_interval',2+30+15-950<0)

    # Universal differential polynomials for the two source Wronskians.
    t,H=s.symbols('t H')
    rr=s.symbols('r0:6')

    def Dt(expr):
        return s.diff(expr,t)+sum(s.diff(expr,rr[j])*rr[j+1] for j in range(5))

    B=[t*rr[0]-1]
    J=[4*(rr[0]**2-rr[1])]
    PP=[4*t*(rr[0]**3-3*rr[0]*rr[1]+rr[2])-3*J[0]]
    HH=[H]
    for _ in range(3):
        B.append(s.expand(Dt(B[-1])))
        J.append(s.expand(Dt(J[-1])))
        PP.append(s.expand(Dt(PP[-1])))
        HH.append(s.expand(Dt(HH[-1])+s.diff(HH[-1],H)*(rr[0]*H-t/4)))
    WH=s.expand(s.det(s.Matrix([[B[j],J[j],-HH[j]] for j in range(1,4)])))
    WP=s.expand(s.det(s.Matrix([[B[j],J[j],PP[j]] for j in range(1,4)])))
    norms={}
    for name,expr,expected in [('H',WH,419),('P',WP,11344)]:
        poly=s.Poly(expr,*rr,t,H)
        norm=sum(abs(c) for c in poly.coeffs())
        check(name+'_polynomial_degree',poly.total_degree()==8)
        check(name+'_polynomial_norm',norm==expected and norm<2**20)
        norms[name]={'degree':poly.total_degree(),'coefficient_norm':int(norm)}

    p=s.symbols('p')
    D=lambda expr:s.diff(expr,t)+p*s.diff(expr,p)
    r0=p-s.Rational(9,4)-3/(2*p-3)
    rj=[r0]
    for _ in range(5):rj.append(s.factor(D(rj[-1])))
    sub=dict(zip(rr,rj))
    WH0=s.factor(WH.subs(sub));WP0=s.factor(WP.subs(sub))
    coeff=s.factor(s.diff(WH0,H));constant=s.factor(WH0.subs(H,0))
    H3=(16*p*p*t+20*p*t+16*p+29*t+24)/(64*p**3)
    residual=s.factor(D(H3)-r0*H3+t/4)
    zero('H3_residual_identity',residual-(354*p*t+280*p+609*t+156)/(256*p**3*(2*p-3)))

    def shifted_positive(name,expr):
        num,den=s.fraction(s.factor(expr))
        for label,part in [('numerator',num),('denominator',den)]:
            poly=s.Poly(s.expand(part.subs({p:p+128,t:t+4})),p,t)
            check(name+'.'+label,all(c>=0 for c in poly.coeffs()) and poly.coeff_monomial(1)>0)

    shifted_positive('H3_positive',H3)
    shifted_positive('residual_positive',residual)
    shifted_positive('residual_decreases',-D(residual))
    shifted_positive('negative_h_coefficient',-coeff)
    shifted_positive('H_Wronskian_upper_subsolution_margin',coeff*(H3+residual/r0)+constant-1)
    shifted_positive('P_Wronskian_margin',WP0-1)
    shifted_positive('r_above_half_p',r0-p/2)
    shifted_positive('r_below_p',p-r0)
    shifted_positive('r_prime_above_p',D(r0)-p)

    check('p_at_t4_above128',3*s.Rational(8,3)**4>128)
    check('geometric_q_parameter',s.Rational(3,256)<s.Rational(1,64))
    check('q_derivative_bound',720*s.Rational(1,64)*s.Rational(64,63)**7<16)
    check('Touchard_coefficient_bound',s.bell(6)==203 and s.bell(6)<256)
    check('theta_gaussian_ratio',s.Rational(3,2)**16*s.Rational(1,2)**640<s.Rational(1,2))
    check('theta_derivative_constant',2**6*32*256*2*2**16<2**40)
    check('log_derivative_constant',2**6*factorial(6)*factorial(5)<2**24)
    check('delta_at128',2**40*s.Integer(128)**6*s.Rational(1,2)**384==s.Rational(1,2)**302)
    check('epsilon_at128',2**64*s.Integer(128)**6*s.Rational(1,2)**384==s.Rational(1,2)**278)
    check('polynomial_error_constant',8*2**20*3**7*2**64<2**128)
    check('common_error_at128',2**128*s.Integer(128)**20*s.Rational(1,2)**384==s.Rational(1,2)**116)
    check('common_error_decreases',s.Rational(20,128)-3<0)
    check('common_error_below_half',s.Rational(1,2)**116<s.Rational(1,2))

    return {
        'status':'passed',
        'arithmetic':'exact symbolic identities and rational coefficient checks',
        'check_count':len(checks),'checks':checks,
        'source_Wronskian_polynomials':norms,
        'tail_domain':'t>=4; p=pi exp(t)>128',
        'tail_conclusion':'W(B_prime,J_prime,-H_prime)>1/2 and W(B_prime,J_prime,P_prime)>1/2',
        'common_error_bound':'less than 2^(-116)',
        'scope':'Audits the comparison algebra and analytic tail proof. Bounded interval signs and initial new-J slope are separate inputs. No all-depth preservation or RH assertion.',
    }


if __name__=='__main__':
    print(json.dumps(run(),indent=2,sort_keys=True))
