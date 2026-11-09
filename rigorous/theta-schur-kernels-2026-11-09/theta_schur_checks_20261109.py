"""Exact algebra and rational-bound audit for the third theta Pick stage.

This script does not re-run the published finite-height RH verification.
It checks the new algebra and rational margins, and runs the independent
integer certificate for the sign of the compensated prime count.
"""

from fractions import Fraction as Q
import json
import platform

import sympy as s

from theta_compensated_count_certificate_20261109 import certificate


def run():
    checks = []

    def identity(name, expression):
        assert s.simplify(expression) == 0, name
        checks.append(name)

    x, y, a, p, f, g, lam = s.symbols("x y a p f g lam", positive=True)
    rx = (x*f-a*p)/(x*p-a*f)
    ry = (y*g-a*p)/(y*p-a*g)
    residual = (f+g)/(x+y)-a*(f+p)*(g+p)/(p*(x+a)*(y+a))
    multiplier = (x*p-a*f)*(y*p-a*g)/(p*(x+a)*(y+a))
    identity("one-anchor Pick Schur congruence",
             residual-multiplier*(rx+ry)/(x+y))

    u, v, hv = s.symbols("u v hv", positive=True)
    h = s.Function("h")(u)
    transform = (u*h-v*hv)/(hv-h)
    tangent_g = 1/h-1/hv+(u-v)*s.diff(h,u)/h**2
    identity("first curvature tangent reduction",
             s.diff(transform,u)-h**2*hv*tangent_g/(hv-h)**2)
    tangent_j = v*hv-u*h-(v-u)*s.diff(u*h,u)
    identity("second curvature tangent reduction",
             s.diff(transform/u,u)-hv*tangent_j/(u**2*(hv-h)**2))

    L = s.Function("L")(x)
    H = L/x
    Hp = s.diff(H,x)/(2*x)
    Hpp = s.diff(Hp,x)/(2*x)
    G = L**2+x*L*s.diff(L,x)+x**2*L*s.diff(L,x,2)-2*x**2*s.diff(L,x)**2
    identity("curvature conversion to xi logarithmic derivative",
             H*Hpp-2*Hp**2-G/(4*x**6))
    identity("second curvature conversion",
             2*Hp+x**2*Hpp-(x**2*s.diff(L,x,2)+x*s.diff(L,x)-L)/(4*x**3))

    F, Fp = s.symbols("F Fp")
    numerator = (x*Fp-a*p*F)/(x**2-a**2)
    denominator = (p*x*F-a*Fp)/(x*(x**2-a**2))
    identity("positive kernel decomposition", numerator+a*denominator-Fp/x)
    identity("positive kernel forced equation", a*numerator+x**2*denominator-p*F)

    b,q,A,B = s.symbols("b q A B")
    U = (A-b*q*B)/(x**2-b**2)
    Vnext = (q*x**2*B-b*A)/(x**2-b**2)
    identity("second reduced response",
             (x*A/(x*B)-b*q)/(x*q-b*A/(x*B))-x*U/Vnext)
    identity("second pair first relation", Vnext+b*U-q*B)
    identity("second pair second relation", x**2*U+b*Vnext-A)

    theta = s.symbols("theta",positive=True)
    m = s.Function("m")(theta)
    gprime = s.diff(4*m,theta)/(8*theta)
    identity("theta mixed-moment curvature conversion",
             s.diff(gprime,theta)/(8*theta)
             -(theta*s.diff(m,theta,2)-s.diff(m,theta))/(16*theta**3))

    gamma_left = (x/(lam*(lam+x))+y/(lam*(lam+y)))/(x+y)
    gamma_right = (1+2*x*y/(lam*(x+y)))/((x+lam)*(y+lam))
    identity("gamma energy square factorization", gamma_left-gamma_right)
    pole_left = (1/(x-s.Rational(1,2))+1/(y-s.Rational(1,2)))/(x+y)
    pole_right = (1-1/(x+y))/((x-s.Rational(1,2))*(y-s.Rational(1,2)))
    identity("pole boundary-square minus norm", pole_left-pole_right)

    w, r = s.symbols("w r", positive=True)
    auxiliary = w/8+r*s.sinh(w/4)/(4*(2+r*s.cosh(w/4)))
    coefficients = [
        (4+3*r)/(16*(2+r)),
        r*(1-r)/(768*(2+r)**2),
        r*(4-26*r+16*r**2)/(491520*(2+r)**3),
    ]
    for degree, value in zip((1,3,5), coefficients):
        identity(f"auxiliary Taylor coefficient {degree}",
                 s.diff(auxiliary,w,degree).subs(w,0)/s.factorial(degree)-value)
    c1,c3,c5 = s.symbols("c1 c3 c5")
    confluent = s.Matrix([[c1,0,c3],[0,-c3,0],[c3,0,c5]])
    identity("confluent third Pick determinant",
             confluent.det()-(-c3)*(c1*c5-c3**2))
    eps = s.symbols("eps")
    V = s.Matrix([[1,i*eps,(i*eps)**2] for i in (1,2,3)])
    identity("three-node Vandermonde factor", V.det()**2-4*eps**6)

    # Exact rational margins in the continuum proof.
    cutoff = 3*10**12
    head_margin = Q(8*216**2, 10484**6)
    tail_error = Q(6,cutoff**2)+Q(18,cutoff**4)
    assert head_margin > Q(24,10**20)
    assert tail_error < Q(7,10**25)
    assert head_margin-tail_error > 0
    assert Q(512,225) < 3
    assert Q(112,81)-Q(11,1000) > Q(4,3)
    assert Q(511,1000) < Q(3,5)
    assert Q(521,1000) < Q(3,5)
    large_margin = Q(4,3)**2-Q(3,5)*Q(4,3)-Q(18,25)
    assert large_margin == Q(58,225)
    assert Q(500000,49*2**99) < Q(1,1000)
    assert 4-26*Q(5,4)+16*Q(5,4)**2 == -Q(7,2)
    assert 4-26*Q(4,3)+16*Q(4,3)**2 == -Q(20,9)

    return {
        "status": "passed",
        "python": platform.python_version(),
        "sympy": s.__version__,
        "symbolic_checks": checks,
        "compact_curvature": {
            "range_u": "0 <= u <= 10000",
            "published_finite_RH_cutoff": cutoff,
            "positive_head_lower_bound": str(head_margin),
            "tail_error_upper_bound": str(tail_error),
            "remaining_lower_bound": str(head_margin-tail_error),
            "external_inputs": [
                "Platt-Trudgian finite-height theorem (not replayed here)",
                "Published first-zero intervals (14,15) and (21,22)",
            ],
        },
        "large_curvature": {"range_x": "x >= 100", "lower_bound": str(large_margin)},
        "compensated_prime_count": certificate(),
        "scope": "Exact algebra and rational bounds; no all-orders positivity or RH proof",
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))
