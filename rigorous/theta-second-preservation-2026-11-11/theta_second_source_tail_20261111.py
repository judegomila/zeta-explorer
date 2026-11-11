"""Exact audit for the fifth theta source determinant tail theorem.

No point samples enter these checks. The full analytic error bounds and
source normalization are documented in theta_second_source_20261111.md.
The theorem is restricted to t>=4; the same source determinants are
negative near zero and are not a valid global sufficient criterion.
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

    # Column changes: (k, kB, kJ, kP, kH) from (k,tk',k'',tk''',C).
    column_matrix=s.Matrix([[1,-1,0,0,0],[0,-1,0,0,0],[0,0,4,-12,0],[0,0,0,-4,0],[0,0,0,0,1]])
    zero('H_fifth_kernel_factor',column_matrix.det()-16)
    column_matrix[4,4]=16
    zero('Q_fifth_kernel_factor',column_matrix.det()-256)
    t,H=s.symbols('t H')
    chain=s.Matrix([[2*t,0,0,0],[2,4*t*t,0,0],[0,12*t,8*t**3,0],[0,12,48*t*t,16*t**4]])
    zero('even_coordinate_factor',chain.det()-1024*t**10)

    # Differential polynomials control the error between k and its first mode.
    rr=s.symbols('r0:8')
    def Dt(expr):
        return s.diff(expr,t)+sum(s.diff(expr,rr[j])*rr[j+1] for j in range(7))
    B=[t*rr[0]-1]
    J=[4*(rr[0]**2-rr[1])]
    P=[4*t*(rr[0]**3-3*rr[0]*rr[1]+rr[2])-3*J[0]]
    Q=[16*(rr[0]**4-6*rr[0]**2*rr[1]+3*rr[1]**2+4*rr[0]*rr[2]-rr[3])]
    HH=[H]
    for _ in range(4):
        for series in (B,J,P,Q):
            series.append(s.expand(Dt(series[-1])))
        HH.append(s.expand(Dt(HH[-1])+s.diff(HH[-1],H)*(rr[0]*H-t/4)))
    SH=s.expand(s.Matrix([[B[j],J[j],P[j],HH[j]] for j in range(1,5)]).det(method='domain-ge'))
    SQ=s.expand(s.Matrix([[B[j],J[j],P[j],Q[j]] for j in range(1,5)]).det(method='domain-ge'))
    norms={}
    for name,expr,degree,norm in [('H',SH,13,302068),('Q',SQ,12,60260864)]:
        poly=s.Poly(expr,*rr,t,H)
        check(name+'_polynomial_degree',poly.total_degree()==degree)
        check(name+'_polynomial_coefficient_norm',sum(abs(c) for c in poly.coeffs())==norm)
        norms[name]={'degree':degree,'coefficient_norm':norm}
    check('uniform_polynomial_degree',max(v['degree'] for v in norms.values())==13)
    check('uniform_polynomial_norm',max(v['coefficient_norm'] for v in norms.values())<2**26)

    # Evaluate the first mode through exact derivative polynomials of its kernel.
    p=s.symbols('p')
    D=lambda e:s.diff(e,t)+p*s.diff(e,p)
    derivative_polynomials=[2*p*p-3*p]
    for _ in range(8):
        last=derivative_polynomials[-1]
        derivative_polynomials.append(s.expand((s.Rational(1,4)-p)*last+p*s.diff(last,p)))
    ps=derivative_polynomials
    Cjets=[ps[0]*H]+[-(t*ps[j-1]+(j-1)*ps[j-2])/4 if j>1 else -t*ps[0]/4 for j in range(1,5)]
    base=[[ps[j],t*ps[j+1]+j*ps[j],ps[j+2],t*ps[j+3]+j*ps[j+2]] for j in range(5)]
    SH0=s.factor(16*s.Matrix([base[j]+[Cjets[j]] for j in range(5)]).det(method='domain-ge')/ps[0]**5)
    SQ0=s.factor(256*s.Matrix([base[j]+[ps[j+4]] for j in range(5)]).det(method='domain-ge')/ps[0]**5)
    coefficient=s.factor(s.diff(SH0,H))
    constant=s.factor(SH0.subs(H,0))
    zero('H_first_mode_affine',SH0-coefficient*H-constant)
    r0=p-s.Rational(9,4)-3/(2*p-3)
    H4=(64*p**3*t+80*p*p*t+64*p*p+116*p*t+96*p+177*t+140)/(256*p**4)
    residual=s.factor(D(H4)-r0*H4+t/4)
    zero('H4_residual_identity',residual-(2082*p*t+1760*p+5841*t+2496)/(1024*p**4*(2*p-3)))

    def shifted_positive(name,expr):
        num,den=s.fraction(s.factor(expr))
        for label,part in [('numerator',num),('denominator',den)]:
            poly=s.Poly(s.expand(part.subs({p:p+128,t:t+4})),p,t)
            check(name+'.'+label,all(c>=0 for c in poly.coeffs()) and poly.coeff_monomial(1)>0)
    shifted_positive('H4_positive',H4)
    shifted_positive('H4_residual_positive',residual)
    shifted_positive('H_coefficient_positive',coefficient)
    shifted_positive('H_first_mode_margin',coefficient*H4+constant-1)
    shifted_positive('Q_first_mode_margin',SQ0-1)
    shifted_positive('r_above_half_p',r0-p/2)
    shifted_positive('r_below_p',p-r0)
    shifted_positive('r_prime_above_p',D(r0)-p)

    # Conservative exact constants for the theta and logarithmic remainders.
    check('p_at_t4_above128',3*s.Rational(8,3)**4>128)
    check('q_geometric_parameter',s.Rational(3,256)<s.Rational(1,64))
    check('q_eight_derivative_bound',factorial(8)*s.Rational(1,64)*s.Rational(64,63)**9<1024)
    check('q_seven_derivative_bound',factorial(7)*s.Rational(1,64)*s.Rational(64,63)**8<128)
    check('Touchard_coefficient_bound',s.bell(8)==4140 and s.bell(8)<2**13)
    check('theta_gaussian_ratio',s.Rational(3,2)**20*s.Rational(1,2)**640<s.Rational(1,2))
    check('theta_derivative_constant',2**8*2**11*2**13*2*2**20<2**54)
    check('logarithm_partition_constant',2**8*factorial(8)*factorial(7)<2**38)
    check('delta_at128',2**54*s.Integer(128)**8*s.Rational(1,2)**384==s.Rational(1,2)**274)
    check('epsilon_at128',2**92*s.Integer(128)**8*s.Rational(1,2)**384==s.Rational(1,2)**236)
    check('remainder_decreases',s.Rational(8,128)-3<0)
    check('polynomial_error_constant',13*2**26*3**12*2**92<2**144)
    check('common_error_at128',2**144*s.Integer(128)**20*s.Rational(1,2)**384==s.Rational(1,2)**100)
    check('common_error_decreases',s.Rational(20,128)-3<0)
    check('common_error_below_half',s.Rational(1,2)**100<s.Rational(1,2))

    return {'status':'passed','arithmetic':'exact identities and rational coefficient signs',
            'check_count':len(checks),'checks':checks,'source_polynomial_norms':norms,
            'tail_domain':'t>=4, p=pi exp(t)>128',
            'tail_conclusion':'SH>1/2 and SQ>1/2',
            'common_error_bound':'less than 2^(-100)',
            'scope':'Only the fifth-source tail is proved. The source signs fail near zero; this is not an all-anchor or arbitrary-depth preservation theorem.'}

if __name__=='__main__':
    if not __debug__:
        raise SystemExit('Verification must run without python -O.')
    print(json.dumps(run(),indent=2,sort_keys=True))
