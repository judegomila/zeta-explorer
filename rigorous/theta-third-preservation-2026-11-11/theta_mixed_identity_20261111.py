"""Exact algebra behind oriented level-set compensation for both sources.

The continuum sign and orientation arguments are in the companion note.
The fixed H fifth-source sign and the U positivity/crossing signs are
separate actual-theta certificates.
"""
import json
import sympy as sp


def run_checks():
    checks=[]
    def check(name, expression):
        if sp.simplify(sp.cancel(expression)) != 0:
            raise AssertionError(name)
        checks.append(name)

    x=sp.symbols('x', real=True)
    Y,Q,H=[sp.Function(n)(x) for n in ('Y','Q','H')]
    w=sp.diff(Y,x,2)
    rhoQ=sp.diff(sp.diff(Q,x,2)/w,x)
    rhoH=sp.diff(sp.diff(H,x,2)/w,x)
    W5=sp.Matrix([[sp.diff(f,x,i) for f in (1,x,Y,Q,H)] for i in range(5)]).det()
    check('source_fifth_Wronskian_density_factor',
          W5-w**3*(rhoQ*sp.diff(rhoH,x)-sp.diff(rhoQ,x)*rhoH))
    check('source_ratio_derivative',sp.diff(rhoH/rhoQ,x)
          -(rhoQ*sp.diff(rhoH,x)-sp.diff(rhoQ,x)*rhoH)/rhoQ**2)

    E=sp.eye(6)
    k,tk,k2,tk3,k4,C=[E[:,i] for i in range(6)]
    check('H_theta_six_column_factor',
          sp.Matrix.hstack(k,-k-tk,4*k2,-12*k2-4*tk3,16*k4,C).det()-256)
    tk5=E[:,5]
    check('U_theta_six_column_factor',
          sp.Matrix.hstack(k,-k-tk,4*k2,-12*k2-4*tk3,16*k4,-80*k4-16*tk5).det()+4096)

    a,r=sp.symbols('a r', positive=True)
    E=sp.eye(5)
    g1,g2,g3,g4,g5=[E[:,i] for i in range(5)]
    check('first_reduced_H_source_column_factor',
          sp.Matrix.hstack(g1,r*g2-a*g1,g3-a*r*g2,r*g4-a*g3,-a*g5).det()+a*r*r)
    check('first_reduced_Q_source_column_factor',
          sp.Matrix.hstack(g1,r*g2-a*g1,g3-a*r*g2,r*g4-a*g3,g5-a*r*g4).det()-r*r)

    E=sp.eye(5)
    k,tk,k2,tk3,k4=[E[:,i] for i in range(5)]
    tk5=sp.Matrix(sp.symbols('v0:5'))
    check('U_fourth_source_decomposition',
          sp.Matrix.hstack(k,-k-tk,4*k2,-12*k2-4*tk3,-80*k4-16*tk5).det()
          +1280+256*tk5[4])

    u=sp.symbols('u',real=True)
    p=sp.symbols('p',positive=True)
    N,B=[sp.Function(n)(u) for n in ('N','B')]
    B1=p/N-a
    J1=a*a+(B-a*p)/N
    X1=sp.diff(J1,u)/sp.diff(B1,u)
    phiP=4*(sp.diff(N,u,2)-sp.diff(B,u,2)/sp.diff(B,u)*sp.diff(N,u))
    check('first_prefix_coordinate_origin_formula',sp.diff(X1,u)
          -N*sp.diff(B,u)*phiP/(4*p*sp.diff(N,u)**2))
    check('first_prefix_initial_positive_function',sp.diff(B1,u)+p*sp.diff(N,u)/N**2)

    R,S,U=sp.symbols('R S U',positive=True)
    determinant=sp.Matrix([[z**j for z in (R,S,U)] for j in (1,2,3)]).det()
    check('oriented_three_node_kernel_minor',
          determinant-R*S*U*(S-R)*(U-R)*(U-S))

    g,q,h=[sp.Function(n)(x) for n in ('g','q','h')]
    check('output_ratio_source_sign',
          (q*sp.diff(h,x)-sp.diff(q,x)*h)-q*q*sp.diff(h/q,x))

    t,eta=sp.symbols('t eta',positive=True)
    D=lambda f:sp.diff(f,t)+eta*sp.diff(f,eta)
    b=4*p*eta/t
    j=4*eta**2
    pp=16*p*eta**3/t
    xx=sp.cancel(D(j)/D(b)); yy=sp.cancel(D(pp)/D(b))
    ww=sp.cancel(D(D(yy)/D(xx))/D(xx))
    check('first_prefix_tail_coordinate',sp.limit(xx*p/(2*t*eta),t,sp.oo)-1)
    check('first_prefix_tail_coordinate_derivative',sp.limit(D(xx)*p/(2*t*eta),t,sp.oo)-1)
    check('first_prefix_tail_convexity',sp.limit(ww*t*t/(p*p),t,sp.oo)-6)

    return {'status':'passed','exact_symbolic_checks':len(checks),'checks':checks,
            'scope':'Exact factors, origin coordinate, orientation model, and tail leading model. Global H fifth-source negativity and U positivity/crossing are separate proof inputs; the level-set theorems are analytic.'}


if __name__=='__main__':
    print(json.dumps(run_checks(),indent=2))
