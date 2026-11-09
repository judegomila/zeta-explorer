"""Exact algebra audit of the alternating theta-kernel pair recurrence.

The ratio signs and their preservation are unproved. These checks verify
identities and an asymptotic coefficient, not positivity at later stages.
"""

import json

import sympy as s


def run():
    checks = []

    def identity(name, expression):
        assert s.cancel(s.together(expression)) == 0, name
        checks.append(name)

    z, a, r = s.symbols("z a r", positive=True)
    U, V = s.symbols("U V", nonzero=True)
    divisor = z**2-a**2

    # Type I: R=zU/V becomes U_next/(z V_next).
    response_i = z*U/V
    next_u_i = (z**2*U-a*r*V)/divisor
    next_v_i = (r*V-a*U)/divisor
    identity(
        "type_I_response",
        (z*response_i-a*r)/(z*r-a*response_i)
        -next_u_i/(z*next_v_i),
    )
    identity("type_I_first_pair_relation", next_u_i+a*next_v_i-U)
    identity("type_I_second_pair_relation", a*next_u_i+z**2*next_v_i-r*V)
    # At the anchor, r=a U(a)/V(a).
    identity("type_I_first_source_anchor", (a**2*U-a*r*V).subs(r,a*U/V))
    identity("type_I_second_source_anchor", (r*V-a*U).subs(r,a*U/V))

    # Type II: R=U/(zV) becomes z U_next/V_next.
    response_ii = U/(z*V)
    next_u_ii = (U-a*r*V)/divisor
    next_v_ii = (r*z**2*V-a*U)/divisor
    identity(
        "type_II_response",
        (z*response_ii-a*r)/(z*r-a*response_ii)
        -z*next_u_ii/next_v_ii,
    )
    identity("type_II_first_pair_relation", next_v_ii+a*next_u_ii-r*V)
    identity("type_II_second_pair_relation", z**2*next_u_ii+a*next_v_ii-U)
    identity("type_II_first_source_anchor", (U-a*r*V).subs(r,U/(a*V)))
    identity("type_II_second_source_anchor", (r*a**2*V-a*U).subs(r,U/(a*V)))

    # The first pair satisfies 4 b''=p kappa-a n.
    c, p, q, kappa, n, bpp = s.symbols("c p q kappa n bpp", positive=True)
    identity(
        "second_source_simplification",
        (4*q*bpp-c*n).subs(bpp,(p*kappa-a*n)/4)
        -(q*p*kappa-(a*q+c)*n),
    )

    # Flux conditions: positive factors identify the exact sign equivalence.
    t, d, C, b, Q = s.symbols("t d C b Q", positive=True)
    n_profile = C-a*b
    n_prime = a*d/2-t*kappa/4
    b_prime = -d/2
    kappa_prime = -t*Q*kappa
    lower = b/(2*C)
    flux = d/(t*kappa)
    upper = (1-4*Q*n_profile/kappa)/(2*a)
    identity(
        "first_ratio_flux_equivalence",
        n_prime*b-n_profile*b_prime-C*t*kappa*(flux-lower)/2,
    )
    identity(
        "second_ratio_flux_equivalence",
        n_prime*kappa-n_profile*kappa_prime
        +a*t*kappa**2*(upper-flux)/2,
    )
    identity(
        "flux_band_width",
        upper-lower-n_profile*(1/C-4*Q/kappa)/(2*a),
    )

    # Exact second response, followed by its formal inverse-z coefficient.
    F, L = s.symbols("F L", nonzero=True)
    first_A = F*(z*L-a*p)/(z**2-a**2)
    first_B = F*(p*z-a*L)/(z*(z**2-a**2))
    second_U = (first_A-c*q*first_B)/(z**2-c**2)
    second_V = (q*z**2*first_B-c*first_A)/(z**2-c**2)
    numerator_V = p*q*z**2-(a*q+c)*z*L+a*c*p
    identity(
        "second_denominator_formula",
        second_V-F*numerator_V/((z**2-a**2)*(z**2-c**2)),
    )
    exact_response = ((z**2+a*c*q)*L-p*(a+c*q)*z)/numerator_V
    identity("second_response_formula", z*second_U/second_V-exact_response)
    inverse_z = s.symbols("inverse_z")
    expansion = s.series(exact_response.subs(z,1/inverse_z),inverse_z,0,2).removeO()
    coefficient = (a*q+c)*L**2/(p**2*q**2)-(a+c*q)/q
    identity(
        "second_response_inverse_z_coefficient",
        expansion-L/(p*q)-inverse_z*coefficient,
    )
    identity(
        "leading_quadratic_log_coefficient",
        s.Poly(coefficient,L).coeff_monomial(L**2)-(a*q+c)/(p**2*q**2),
    )

    return {
        "status": "passed",
        "arithmetic": "exact symbolic rational identities",
        "checks": checks,
        "check_count": len(checks),
        "scope": "Ratio signs and their preservation remain unproved; no fourth-stage or all-orders positivity follows from this audit.",
    }


if __name__ == "__main__":
    print(json.dumps(run(), indent=2))
