"""Exact algebra for the mixed-source anchor-tail and uniform origin collar.

The unbounded-domain theorem is analytic and is proved in the accompanying
note. These checks validate its cancellations, source factors, and even
normalizations; they are not sampled positivity certificates.
"""
import json
import sympy as sp


def run_checks():
    checks = []

    def identity(name, expression):
        assert sp.simplify(expression) == 0, name
        checks.append(name)

    a, t, u, v = sp.symbols('a t u v', positive=True)
    p = sp.Function('p')(a)
    A = sp.Function('A')(u)
    V = sp.Function('V')(u)
    E = sp.Function('E')(a, u)
    s = sp.Function('s')(a)
    F = sp.Function('F')(a, u)

    def wr(f, g, coordinate=u):
        return f * sp.diff(g, coordinate) - sp.diff(f, coordinate) * g

    def mixed(f):
        return wr(f, sp.diff(f, a))

    identity('anchor_scalar_cancels_from_mixed_sign', mixed(s*F)-s**2*mixed(F))
    r = p/a
    q = 1/(a*p)
    identity('H_anchor_coefficient_derivative', sp.diff(r, a)+(p-a*sp.diff(p, a))/a**2)
    identity('P_anchor_coefficient_derivative', sp.diff(q, a)+(p+a*sp.diff(p, a))/(a**2*p**2))
    identity('H_two_term_mixed_coefficient', mixed((A+r*V)/a**2)+(p-a*sp.diff(p,a))*wr(A,V)/a**6)
    identity('P_two_term_mixed_coefficient', mixed(p*(A+q*V)/a**3)+(p+a*sp.diff(p,a))*wr(A,V)/a**8)
    rhs = (sp.diff(r,a)*wr(A,V)+wr(A,sp.diff(E,a))
           +r*wr(V,sp.diff(E,a))-sp.diff(r,a)*wr(V,E)
           +wr(E,sp.diff(E,a)))
    identity('exact_remainder_determinant_expansion', mixed(A+r*V+E)-rhs)

    H, B, J, P = [sp.Function(name)(u) for name in ('H','B','J','P')]
    def TH(f):
        return 4*(sp.diff(H,u,2)/sp.diff(H,u)*sp.diff(f,u)-sp.diff(f,u,2))
    def TP(f):
        return 4*(sp.diff(f,u,2)-sp.diff(B,u,2)/sp.diff(B,u)*sp.diff(f,u))
    def w3(functions):
        return sp.Matrix([[sp.diff(f,u,j) for f in functions] for j in range(3)]).det()
    WH = w3([sp.diff(B,u),sp.diff(J,u),-sp.diff(H,u)])
    WP = w3([sp.diff(B,u),sp.diff(J,u),sp.diff(P,u)])
    identity('H_original_source_factor', wr(-TH(B),TH(J))-16*WH/sp.diff(H,u))
    identity('P_original_source_factor', wr(TP(J),-TP(P))+16*WP/sp.diff(B,u))
    identity('H_operator_annihilates_H', TH(H))
    identity('P_operator_annihilates_B', TP(B))
    identity('H_operator_annihilates_constant', TH(sp.Integer(1)))
    identity('P_operator_annihilates_constant', TP(sp.Integer(1)))

    phi = sp.Function('phi')(a,u)
    # Total derivatives in the independent jet algebra avoid differently
    # named Subs/Dummy representations of equal abstract mixed derivatives.
    derivative_t = lambda expr: sp.diff(expr,t)+2*t*sp.diff(expr,u)
    derivative_a = lambda expr: sp.diff(expr,a)+2*a*sp.diff(expr,v)
    f = t**2*phi
    Dt = f*derivative_t(sp.diff(f,a))-sp.diff(f,a)*derivative_t(f)
    identity('spatial_even_mixed_normalization', Dt-2*t**5*mixed(phi))
    psi = sp.Function('psi')(v,u)
    pH = v*psi
    Dv = pH*sp.diff(pH,v,u)-sp.diff(pH,v)*sp.diff(pH,u)
    identity('H_anchor_even_deflation', Dv-v**2*(psi*sp.diff(psi,v,u)-sp.diff(psi,v)*sp.diff(psi,u)))
    f = a**2*t**2*psi
    Dt = f*derivative_t(derivative_a(f))-derivative_a(f)*derivative_t(f)
    identity('H_double_endpoint_factor', Dt-4*a**5*t**5*(psi*sp.diff(psi,v,u)-sp.diff(psi,v)*sp.diff(psi,u)))
    f = t**2*psi
    Dt = f*derivative_t(derivative_a(f))-derivative_a(f)*derivative_t(f)
    identity('P_double_endpoint_factor', Dt-4*a*t**5*(psi*sp.diff(psi,v,u)-sp.diff(psi,v)*sp.diff(psi,u)))

    z = sp.symbols('z')
    identity('third_resolvent_remainder', 1/(1-z)-(1+z+z**2)-z**3/(1-z))
    identity('second_resolvent_remainder', 1/(1-z)-(1+z)-z**2/(1-z))
    x = sp.symbols('x', nonnegative=True)
    l1 = sp.integrate((1-x)*sp.exp(-x),(x,0,1))+sp.integrate((x-1)*sp.exp(-x),(x,1,sp.oo))
    identity('anchor_derivative_kernel_L1', l1-2/sp.E)

    return {'status':'passed','exact_identity_checks':len(checks),'checks':checks,
            'scope':'Exact mixed-source factors, resolvent cancellations, and endpoint deflations. Analytic uniform bounds and prior positive source certificates are stated proof inputs in the note; no numerical anchor threshold is asserted.'}


if __name__ == '__main__':
    if not __debug__:
        raise SystemExit('Run verification without python -O.')
    print(json.dumps(run_checks(), indent=2))
