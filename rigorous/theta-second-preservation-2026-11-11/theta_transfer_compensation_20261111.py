#!/usr/bin/env python3
"""Exact checks for the Peano-kernel single-crossing theorem."""
import json
import sympy as S


def run_checks():
    checks=[]
    def check(name, expr):
        if S.cancel(S.expand(expr)) != 0:
            raise AssertionError(name)
        checks.append(name)

    t,x,y,z,s,l,r,c=S.symbols('t x y z s l r c')
    def wr(fs, var=y):
        return S.det(S.Matrix([[S.diff(f,var,i) for f in fs]
                              for i in range(len(fs))]))

    # Source factor with nonconstant f1, nonlinear x, and nonlinear Y.
    f1=1+t
    xc=t+t*t
    Y=x*x+x**3
    h=x**4
    w=S.diff(Y,x,2)
    rho=S.diff(S.diff(h,x,2)/w,x)
    fs=[f1, f1*xc, f1*Y.subs(x,xc), f1*h.subs(x,xc)]
    check('generalized_source_factor',
          wr(fs,t)-f1**4*S.diff(xc,t)**6*(w*w*rho).subs(x,xc))

    # Exact Sylvester factor: W2(Pi_s,Pi_r)=W3(prefix)*W5(prefix,hs,hr).
    gs=[1+y, y*y+2, y**3-y+1]
    hs=y**4+y*y
    hr=y**5+y
    p1,p2=wr(gs+[hs]),wr(gs+[hr])
    check('Sylvester_nonconstant_prefix',wr([p1,p2])-wr(gs)*wr(gs+[hs,hr]))

    # Uniform measure and polynomial source prefix f_j=x^(j-1).
    uniform=[]
    for j in range(1,4):
        uniform.append(S.expand(
            ((1-y**(j+2))/S.Integer(j+2)
             -y*(1-y**(j+1))/S.Integer(j+1))/j
            -(1-y)**2/S.Integer(2*j*(j+1))))
    K_below=z*(1-y)**2/2
    K_above=(1-z)*(z-y*y)/2
    H_below=S.integrate(K_below*(z-s)**2,(z,s,y)) + S.integrate(K_above*(z-s)**2,(z,y,1))
    H_above=S.integrate(K_above*(z-s)**2,(z,s,1))
    Pi_below=s**4*(1-y)**8/S.Integer(17280)
    Pi_above=y**3*(1-s)**4*(1-y)**3*(4*s-y*y-3*y)/S.Integer(17280)
    check('uniform_Pi_s_below_y',wr(uniform+[H_below])-Pi_below)
    check('uniform_Pi_s_above_y',wr(uniform+[H_above])-Pi_above)
    check('uniform_Pi_continuity', (Pi_below-Pi_above).subs(s,y))
    check('uniform_Pi_C1', (S.diff(Pi_below,y)-S.diff(Pi_above,y)).subs(s,y))

    # Each displayed expression is nonnegative on its named domain.
    both_above=wr([Pi_above.subs(s,l),Pi_above.subs(s,r)])
    expected_above=y**6*(r-l)*(1-l)**4*(1-r)**4*(1-y)**6*(2*y+3)/S.Integer(74649600)
    cross=wr([Pi_below.subs(s,l),Pi_above.subs(s,r)])
    expected_cross=l**4*y*y*(r-y)*(1-r)**4*(1-y)**10*(2*y+3)/S.Integer(74649600)
    check('uniform_TP2_both_knots_above',both_above-expected_above)
    check('uniform_TP2_knots_straddle_y',cross-expected_cross)
    check('uniform_TP2_both_knots_below',wr([Pi_below.subs(s,l),Pi_below.subs(s,r)]))

    integral=S.integrate(Pi_below*(s-c),(s,0,y))+S.integrate(Pi_above*(s-c),(s,y,1))
    expected=y**3*(1-y)**8*(8*y*y+(19-14*c)*y+8-28*c)/S.Integer(3628800)
    check('uniform_signed_Peano_integral',integral-expected)
    positive=y**3*(1-y)**8*(8*y*y+S.Rational(31,2)*y+1)/S.Integer(3628800)
    check('uniform_negative_source_positive_output',expected.subs(c,S.Rational(1,4))-positive)
    # Reconstruct h from rho(s)=s-c, w=2, and R_s=(x-s)_+^2.
    reconstructed=S.integrate((s-c)*(x-s)**2,(s,0,x))
    check('uniform_Peano_reconstruction',reconstructed-(x**4/12-c*x**3/3))
    return {'status':'passed','checks':len(checks),'check_names':checks,
            'arithmetic':'exact symbolic rational arithmetic',
            'scope':'comparison theorem and example; transformed theta origin signs remain separate'}


if __name__=='__main__':
    if not __debug__:
        raise SystemExit('Do not use python -O for verification')
    print(json.dumps(run_checks(),indent=2))
