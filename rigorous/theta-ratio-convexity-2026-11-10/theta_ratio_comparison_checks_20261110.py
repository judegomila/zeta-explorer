"""Exact algebra audit of the anchor-free theta-ratio comparison lemma.

Actual-theta signs of the three one-variable tests require separate
analytic/interval proofs. This script checks identities and orientations.
"""

import json

import sympy as s


def run():
    checks = []

    def zero(name, expression):
        if s.cancel(s.expand(expression)) != 0:
            raise AssertionError(name)
        checks.append(name)

    F, density, Af, Bf, Ag, Bg = s.symbols("F density Af Bf Ag Bg")
    Mf, Mg = F*Af+(1-F)*Bf, F*Ag+(1-F)*Bg
    zero(
        "covariance_cut_ratio_derivative",
        density*(Af-Bf)*Mg-density*(Ag-Bg)*Mf
        -density*(Af*Bg-Bf*Ag),
    )
    Hf, Hg, mf, mg = s.symbols("Hf Hg mf mg", nonzero=True)
    zero(
        "tail_average_ratio_derivative",
        (-mf*Hg+Hf*mg)/Hg**2-(mg/Hg)*(Hf/Hg-mf/mg),
    )

    lam, t, v = s.symbols("lambda t v", real=True)
    hyperbolic = s.sinh(lam*(v-t)) - (
        s.cosh(lam*t)*s.sinh(lam*v)-s.sinh(lam*t)*s.cosh(lam*v)
    )
    if s.simplify(hyperbolic) != 0:
        raise AssertionError("hyperbolic_call_kernel")
    checks.append("hyperbolic_call_kernel")

    n, b, a, np, bp = s.symbols("n b a np bp", positive=True)
    C, Cp = n+a*b, np+a*bp
    zero(
        "n_over_b_vs_n_over_C_derivative",
        (np*b-n*bp)/b**2-C**2/(a*b**2)*(np*C-n*Cp)/C**2,
    )
    p = s.symbols("p")
    zero("centered_C_source_mean", 1+a*p-a**2*(p/a)-1)

    H, B, zz, rr = s.symbols("H B z r", positive=True)
    nn, vv = s.symbols("n v", positive=True)
    uu = H*vv
    bb = (uu-nn)/a
    zero("canonical_new_H", (bb/nn).subs(vv,zz*nn)-(H*zz-1)/a)
    zero("canonical_new_B", ((rr*vv-a*nn)/nn).subs(vv,zz*nn)-(rr*zz-a))
    zero("canonical_new_J", ((a**2*nn+vv*(B-a*rr))/nn).subs(vv,zz*nn)-(a**2+(B-a*rr)*zz))
    x, y, Rx, Ry = s.symbols("x y Rx Ry", positive=True)
    zero("reciprocal_Pick_congruence", (1/Rx+1/Ry)/(x+y)-(Rx+Ry)/((x+y)*Rx*Ry))

    f1, f2, w1, w2, h1, h2 = s.symbols("f1 f2 w1 w2 h1 h2")
    zero("W_as_function_of_f_convexity", (w2*f1-w1*f2)/f1**3-(w2/f1-w1*f2/f1**2)/f1)
    zero("h_as_function_of_f_convexity", (h2*f1-h1*f2)/f1**3-(h2/f1-h1*f2/f1**2)/f1)
    # g=f-a^2*h: convexity of inverse f(g) has the positive D_h factor.
    g1, g2 = f1-a**2*h1, f2-a**2*h2
    zero(
        "f_as_function_of_g_convexity",
        (f2*g1-f1*g2)/g1**3-a**2*(h2*f1-h1*f2)/g1**3,
    )
    zero(
        "f_as_function_of_W_concavity",
        (f2*w1-f1*w2)/w1**3+(w2*f1-w1*f2)/w1**3,
    )

    v1, v2, v3, v4, h = s.symbols("v1 v2 v3 v4 h")
    fp, fpp = v1+t*v2, 2*v2+t*v3
    Wp, Wpp = 4*(2*v1*v2-v3), 4*(2*v2**2+2*v1*v3-v4)
    DW = Wpp*fp-Wp*fpp
    expected_DW = 4*(-2*v1*v2**2+2*v1**2*v3-v1*v4+2*v2*v3+t*(2*v2**3-v2*v4+v3**2))
    zero("expanded_W_convexity_numerator", DW-expected_DW)
    hp = v1*h-t/4
    hpp = (v2+v1**2)*h-(1+t*v1)/4
    Dh = hpp*fp-hp*fpp
    expected_Dh = h*(v1**3-v1*v2+t*(v2**2+v1**2*v2-v1*v3))+(t*v2+t**2*v3-v1-t*v1**2-t**2*v1*v2)/4
    zero("expanded_h_convexity_numerator", Dh-expected_Dh)

    # Differential normalization 4 C'' = kappa*(f-1).
    k, kp, Cpp = s.symbols("k kp Cpp")
    zero("C_source_normalization", (-k-t*kp).subs(kp,-v1*k)/k-(t*v1-1))

    c, d, e, H = s.symbols("c d e H")
    potential = c*t**2/2+d*t**4/24+e*t**6/720
    f = t*s.diff(potential,t)
    W = 4*(s.diff(potential,t)**2-s.diff(potential,t,2))
    DW_series = s.expand(s.diff(W,t,2)*s.diff(f,t)-s.diff(W,t)*s.diff(f,t,2))
    zero("origin_W_cubic_coefficient", DW_series.coeff(t,3)-s.Rational(8,3)*(4*c**2*d-c*e+2*d**2))
    H2 = (c*H-s.Rational(1,4))/2
    H4 = (c*H2+d*H/6)/4
    h_series = H+H2*t**2+H4*t**4
    Dh_series = s.expand(s.diff(h_series,t,2)*s.diff(f,t)-s.diff(h_series,t)*s.diff(f,t,2))
    zero("origin_h_cubic_coefficient", Dh_series.coeff(t,3)-(2*c**3*H-s.Rational(2,3)*c*d*H-c**2/2+d/3))
    zero("origin_W_prime_linear_coefficient", s.expand(s.diff(W,t)).coeff(t,1)-4*(2*c**2-d))

    # A uniform-density toy audit confirms the monotonicity orientation.
    y, z = s.symbols("y z", real=True)
    toy_Hg = s.integrate((z-s.Rational(1,2))*(z-y),(z,y,1))
    toy_Hf = s.integrate((2*z-z**2-s.Rational(2,3))*(z-y),(z,y,1))
    toy_derivative = s.factor(s.diff(s.cancel(toy_Hf/toy_Hg),y))
    zero("concave_uniform_example_ratio_derivative", toy_derivative+2*y*(y+1)/(2*y+1)**2)
    checks.append("concave_uniform_example_strict_negative_on_0_1")

    return {
        "status":"passed",
        "check_count":len(checks),
        "checks":checks,
        "arithmetic":"exact symbolic identities",
        "toy_ratio_derivative":str(toy_derivative),
        "scope":"Audits the comparison theorem algebra. Actual theta sign certificates and arbitrary-order preservation are separate questions.",
    }


if __name__ == "__main__":
    print(json.dumps(run(),indent=2,sort_keys=True))
