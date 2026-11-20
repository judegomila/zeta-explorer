#!/usr/bin/env python3
"""Exact checks for higher centered-call transfer and source elimination.

Requires sympy==1.14.0. No floating-point evidence is used here.
"""
import json
import sympy as S


def run_checks():
    checks = []

    def check(name, condition):
        if not condition:
            raise AssertionError(name)
        checks.append(name)

    a, r = S.symbols("a r", positive=True)
    y, t, s1, s2, s3 = S.symbols("y t s1 s2 s3")

    # Rows are coefficients in the stated independent source columns.
    # (GB,GJ,GP,GH) -> (n,4b'',4n'',-b).
    matrix_h = S.Matrix([
        [1, -a, 0, 0], [0, r, -a*r, 0],
        [0, 0, 1, 0], [0, 0, 0, a],
    ])
    check("four_green_columns_H", matrix_h.det() == a*r)
    # (GB,GJ,GP,GQ) -> (n,4b'',4n'',16b4).
    matrix_p = S.Matrix([
        [1, -a, 0, 0], [0, r, -a*r, 0],
        [0, 0, 1, -a], [0, 0, 0, r],
    ])
    check("four_green_columns_P", matrix_p.det() == r*r)
    # (n,v,vB,u) -> (n,4b'',4n'',-b).
    matrix_local_h = S.Matrix([
        [1, -a, a*a, 1/a], [0, r, -a*r, 0],
        [0, 0, 1, 0], [0, 0, 0, -1/a],
    ])
    check("low_order_H_before_constant_column", matrix_local_h.det() == -r/a)
    # (n,v,vB,vJ) -> (n,4b'',4n'',16b4).
    matrix_local_p = S.Matrix([
        [1, -a, a*a, -a**3], [0, r, -a*r, a*a*r],
        [0, 0, 1, -a], [0, 0, 0, r],
    ])
    check("low_order_P_before_constant_column", matrix_local_p.det() == r*r)
    for last, answer, name in [(1, 16, "theta_H"), (16, 256, "theta_Q")]:
        theta = S.Matrix([
            [1, -1, 0, 0, 0], [0, -1, 0, 0, 0],
            [0, 0, 4, -12, 0], [0, 0, 0, -4, 0],
            [0, 0, 0, 0, last],
        ])
        check(name + "_five_columns", theta.det() == answer)

    def wr(functions, variable):
        return S.det(S.Matrix([
            [S.diff(f, variable, i) for f in functions]
            for i in range(len(functions))
        ]))

    # A generic quotient check using nontrivial polynomial numerators.
    functions = [1+t, t*t+2, t**3+3*t, t**4+t*t+1]
    h = 1+t*t
    check("quotient_W4", S.cancel(wr([f/h for f in functions], t)
                                   - wr(functions, t)/h**4) == 0)
    source = [t**(2*j) for j in range(1, 5)]
    u = S.symbols("u")
    right = (2*t)**10 * wr([j*u**(j-1) for j in range(1, 5)], u).subs(u, t*t)
    check("origin_tenth_power", S.expand(wr([S.diff(f, t) for f in source], t)-right) == 0)

    transforms = []
    expected = {
        2: y*(1-y)**4*(y+1)/144,
        3: y*y*(1-y)**6*(2*y+3)/8640,
        4: y**3*(1-y)**8*(y+2)/86400,
        5: y**4*(1-y)**10*(2*y+5)/1512000,
        6: y**5*(1-y)**12*(y+3)/2116800,
    }
    for j in range(1, 7):
        transformed = S.expand(
            ((1-y**(j+2))/S.Integer(j+2)
             - y*(1-y**(j+1))/S.Integer(j+1))/j
            - (1-y)**2/S.Integer(2*j*(j+1))
        )
        transforms.append(transformed)
        check(f"uniform_second_derivative_{j}",
              S.expand(S.diff(transformed, y, 2)-y**j/j+S.Rational(1,j*(j+1))) == 0)
    for k in range(2, 7):
        check(f"uniform_W{k}_positive_formula",
              S.expand(wr(transforms[:k], y)-expected[k]) == 0)

    # For uniform mu, Q_y(s)=(s-y^2)/2. The source determinant for
    # q_j'=s^(j-1) is the ordinary Vandermonde in (s1,y,s2,s3).
    source_det = (y-s1)*(s2-s1)*(s3-s1)*(s2-y)*(s3-y)*(s3-s2)
    integrand = S.Rational(1,2)*s1*(1-s2)*(1-s3)*(s3-s2)*source_det
    integral = integrand
    for variable, lower, upper in [(s1, 0, y), (s3, s2, 1), (s2, y, 1)]:
        integral = S.integrate(S.expand(integral), (variable, lower, upper))
    check("four_column_integral_exact", S.expand(integral-expected[4]) == 0)

    # Verify row elimination (2) for a nonconstant density m=2y.
    # q_j=y^j/j, E q_j=2/[j(j+2)]. Integrate centered calls directly.
    q = [y**j/S.Integer(j) for j in range(1, 5)]
    mean = [S.Rational(2,j*(j+2)) for j in range(1,5)]
    variable = S.symbols("z")
    T = [S.integrate((f.subs(y,variable)-c)*(variable-y)*2*variable,
                     (variable,y,1)) for f,c in zip(q,mean)]
    rows = [T, [S.diff(f,y) for f in T],
            [f-c for f,c in zip(q,mean)], [S.diff(f,y) for f in q]]
    check("nonconstant_density_row_elimination", S.expand(wr(T,y)-(2*y)**2*S.det(S.Matrix(rows))) == 0)

    return {
        "status": "passed",
        "checks": len(checks),
        "check_names": checks,
        "arithmetic": "exact symbolic rational arithmetic",
        "scope": "comparison identities only; actual theta source signs and second origin slope are separate",
    }


if __name__ == "__main__":
    if not __debug__:
        raise SystemExit("Do not use python -O for verification")
    print(json.dumps(run_checks(), indent=2))
