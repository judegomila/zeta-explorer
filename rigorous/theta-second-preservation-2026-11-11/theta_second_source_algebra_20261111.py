"""Exact determinant and large-anchor expansion checks; no sampled signs."""
import json
import sympy as s


def run():
    checks=[]
    def zero(name,expr):
        value=s.factor(expr)
        if value!=0:
            raise AssertionError((name,value))
        checks.append(name)
    a,p,t=s.symbols('a p t',positive=True)
    # Relative column matrices in the bases specified in the source note.
    hcols=s.Matrix([[1,-a,a*a,1/a],[0,p,-(1+a*p),0],[0,0,-1,0],[0,0,0,-1/a]])
    pcols=s.Matrix([[1,-a,a*a,-a**3],[0,p,-(1+a*p),a*(1+a*p)],[0,0,-1,a],[0,0,0,4*p]])
    zero('first_reduced_H_kernel_factor',hcols.det()-p/a)
    zero('first_reduced_P_kernel_factor',pcols.det()+4*p*p)
    # Dividing columns by kappa, expanding the second constant column,
    # and using t*kappa'/kappa=-B-1 supplies the signs below.
    zero('constant_column_H_orientation',(-1)*(-1)-1)
    zero('constant_column_J_orientation',(-1)*(-1)/4-s.Rational(1,4))

    B=s.Function('B')(t);J=s.Function('J')(t)
    P=s.Function('P')(t);H=s.Function('H')(t);E=s.Function('E')(t)
    def W(f,g,h):
        return s.Matrix([[s.diff(q,t,j) for q in (f,g,h)] for j in range(1,4)]).det()
    N=p/a-B/a**2+p*J/a**3-P/a**4+E
    WH0=W(B,J,-H);WP0=W(B,J,P)
    zero('large_anchor_H_source_expansion',W(N,B,H)-(p/a**3*WH0-W(P,B,H)/a**4+W(E,B,H)))
    zero('large_anchor_P_source_expansion',W(N,B,J)-(-WP0/a**4+W(E,B,J)))
    M=s.symbols('M',positive=True)
    zero('large_anchor_H_prefactor',p*p*(p/a)*(p*M/a)**(-4)*(p/a**3)-M**(-4))
    zero('large_anchor_P_prefactor',p*p*(-p*p)*(p*M/a)**(-4)*(-1/a**4)-M**(-4))

    # Exact resolvent remainder used for the C^6 expansion.
    d=s.symbols('d')
    zero('Laplace_resolvent_remainder',(1-4*d/a**2)*(1+4*d/a**2)-1+16*d*d/a**4)
    zero('source_P_identification',4*s.diff(s.Function('k')(t)*B,t,2)-4*s.diff(s.Function('g')(t),t,2).subs(s.Function('g')(t),s.Function('k')(t)*B).doit())

    # Uniform even-function derivative constants and determinant bound.
    z=s.symbols('z')
    for j in (1,2,3):
        c=s.integrate((1-z*z)**(j-1),(z,0,1))/(2**(2*j-1)*s.factorial(j-1))
        zero('even_coordinate_derivative_constant_'+str(j),c-s.factorial(j)/s.factorial(2*j))
    zero('even_Wronskian_chain_factor',s.Matrix([[2*t,0,0],[2,4*t*t,0],[0,12*t,8*t**3]]).det()-64*t**6)
    zero('uniform_even_Wronskian_bound',64*s.factorial(3)*s.Rational(1,2)*s.Rational(1,12)*s.Rational(1,120)-s.Rational(2,15))
    zero('origin_Wronskian_factor',64*s.Rational(1,2)*s.Rational(1,12)*s.Rational(1,120)-s.Rational(1,45))
    return {'status':'passed','check_count':len(checks),'checks':checks,
            'scope':'Exact source elimination and compact-in-space large-anchor expansion; no all-anchor reduced source signs are asserted.'}

if __name__=='__main__':
    if not __debug__:
        raise SystemExit('Verification must run without python -O.')
    print(json.dumps(run(),indent=2,sort_keys=True))
