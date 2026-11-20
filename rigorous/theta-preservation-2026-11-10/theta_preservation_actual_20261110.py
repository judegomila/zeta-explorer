"""Exact algebra audit of the actual-theta large-anchor preservation note.

This checks identities. It does not compute A_T, certify finite anchors,
or establish arbitrary-depth preservation.
"""

import json
import sympy as s


def run():
    checks=[]
    def check(name,expression):
        if s.simplify(expression)!=0:
            raise AssertionError((name,s.simplify(expression)))
        checks.append(name)

    t,a,p,x=s.symbols('t a p x',positive=True)
    h=s.Function('h')(t)
    B=s.Function('B')(t)
    W=s.Function('W')(t)
    S=s.Function('S')(t)
    E=s.Function('E')(t)
    C=lambda q,e:s.diff(q,t)*s.diff(e,t,2)-s.diff(q,t,2)*s.diff(e,t)
    N=p/a-B/a**2+p*W/a**3-S/a**4+E
    Dh=-C(h,B)
    DW=C(B,W)
    check('D_h_expansion',C(h,N)-(Dh/a**2+p*C(h,W)/a**3-C(h,S)/a**4+C(h,E)))
    check('D_B_expansion',C(B,N)-(p*DW/a**3-C(B,S)/a**4+C(B,E)))
    check('parity_determinant_derivative',s.diff(C(h,E),t)-(s.diff(h,t)*s.diff(E,t,3)-s.diff(h,t,3)*s.diff(E,t)))
    check('Laplace_density_normalization',2*s.integrate(a*s.exp(-a*x/2)/4,(x,0,s.oo))-1)
    check('Green_source_normalization',-(B-a*p)/a**2-(p/a-B/a**2))
    k=s.Function('k')(t)
    check('B_times_kernel',((-t*s.diff(k,t)/k-1)*k)+s.diff(t*k,t))
    # Formal resolvent expansion: remaining term is (4 D^2/a^2)^2 P*q.
    d=s.symbols('d')
    check('resolvent_remainder',(1-4*d/a**2)*(1+4*d/a**2)-1+16*d**2/a**4)
    zeta=s.symbols('zeta')
    PP=a**2/(a**2-zeta**2)
    check('transform_cancellation',PP*(p/a-zeta*s.Symbol('ell')/a**2)-(zeta*s.Symbol('ell')-a*p)/(zeta**2-a**2))
    n=s.Function('N')(t)
    z=1/n
    Dz=lambda v:s.diff(v,t)/s.diff(z,t)
    check('second_derivative_coordinate',Dz(Dz(h*z))-n**3/(-s.diff(n,t))**3*C(h,n))
    ja=a**2+(B-a*p)/n
    check('J_new_derivative',s.diff(ja,t)-(s.diff(B,t)/n-(B-a*p)*s.diff(n,t)/n**2))
    q0,q2,q4,e0,e2,e4=s.symbols('q0 q2 q4 e0 e2 e4')
    q=q0+q2*t**2/2+q4*t**4/24
    e=e0+e2*t**2/2+e4*t**4/24
    check('origin_cubic_coefficient',s.limit(C(q,e)/t**3,t,0)-(q2*e4-q4*e2)/3)
    check('origin_linear_derivative',s.limit(s.diff(q,t)/t,t,0)-q2)
    return {'status':'passed','check_count':len(checks),'checks':checks,
            'scope':'Exact algebra for the analytic large-anchor/bounded-space preservation theorem. No numerical A_T, finite-anchor theorem, or arbitrary-depth preservation is asserted.'}


if __name__=='__main__':
    print(json.dumps(run(),indent=2))
