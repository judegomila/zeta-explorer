#!/usr/bin/env python3
"""Certify a source-free barrier for the prior-derivative score rule.

For the positive even Schwartz profile W(t)=exp(-t^4),

    W'(t)^2-W(t)W''(t) = 12 t^2 exp(-2t^4) >= 0.

Thus every true Galerkin target is positive.  This verifier constructs the
actual monic same-parity residuals for that positive target measure and
checks that

    span{q_N', t q_N, q_(N-1)'}

nevertheless has negative projected auxiliary at the even degree-eight and
odd degree-seven rungs.  The result is a source-free route obstruction, not a
test of the complete theta profile and not an RH claim.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from flint import arb, arb_mat, ctx


def endpoints(value: arb, digits: int = 70) -> dict[str, str]:
    return {
        "lower": value.lower().str(digits),
        "upper": value.upper().str(digits),
        "arb": value.str(50),
    }


def positive_moment(order: int) -> arb:
    """Return integral_R t^(2*order) exp(-2*t^4) dt."""

    exponent = arb(2 * order + 1) / 4
    return ((-exponent * arb(2).log()).exp() * exponent.gamma()) / 2


def derivative(polynomial: dict[int, arb]) -> dict[int, arb]:
    return {
        degree - 1: degree * coefficient
        for degree, coefficient in polynomial.items()
        if degree > 0
    }


def times_t(polynomial: dict[int, arb]) -> dict[int, arb]:
    return {degree + 1: coefficient for degree, coefficient in polynomial.items()}


def inner(
    first: dict[int, arb],
    second: dict[int, arb],
    moments: list[arb],
) -> arb:
    result = arb(0)
    for first_degree, first_coefficient in first.items():
        for second_degree, second_coefficient in second.items():
            total_degree = first_degree + second_degree
            if total_degree % 2 == 0:
                result += (
                    first_coefficient
                    * second_coefficient
                    * moments[total_degree // 2]
                )
    return result


def residual(
    target_moments: list[arb],
    order_n: int,
    parity_epsilon: int,
) -> dict[int, arb]:
    matrix = arb_mat(
        [
            [target_moments[row + column + parity_epsilon] for column in range(order_n)]
            for row in range(order_n)
        ]
    )
    right_hand_side = arb_mat(
        [
            [-target_moments[order_n + row + parity_epsilon]]
            for row in range(order_n)
        ]
    )
    coefficients = matrix.solve(right_hand_side)
    polynomial = {
        2 * index + parity_epsilon: coefficients[index, 0]
        for index in range(order_n)
    }
    polynomial[2 * order_n + parity_epsilon] = arb(1)
    return polynomial


def polynomial_record(polynomial: dict[int, arb]) -> dict[str, dict[str, str]]:
    return {
        str(degree): endpoints(polynomial[degree])
        for degree in sorted(polynomial)
    }


def certify_rung(
    target_moments: list[arb],
    positive_moments: list[arb],
    order_n: int,
    parity_epsilon: int,
) -> dict[str, object]:
    q = residual(target_moments, order_n, parity_epsilon)
    q_prior = residual(target_moments, order_n - 1, parity_epsilon)
    q_prime = derivative(q)
    t_q = times_t(q)
    prior_prime = derivative(q_prior)
    q_second = derivative(q_prime)
    prior_second = derivative(prior_prime)

    kappa = 2 * order_n + parity_epsilon
    assert max(t_q) == kappa + 1
    assert max(q_prime) == kappa - 1
    assert max(prior_prime) == kappa - 3

    A = inner(q_prime, q_prime, positive_moments)
    B = inner(q, q_second, positive_moments)
    C = inner(q, q, positive_moments)
    D = inner(t_q, t_q, positive_moments)
    E = inner(q_prime, t_q, positive_moments)
    F = inner(q_prime, prior_prime, positive_moments)
    G = inner(t_q, prior_prime, positive_moments)
    T = inner(prior_prime, prior_prime, positive_moments)
    R = inner(q, prior_second, positive_moments)
    Y = C + E

    K2 = arb_mat([[A, E], [E, D]])
    K3 = arb_mat([[A, E, F], [E, D, G], [F, G, T]])
    y3 = arb_mat([[B], [Y], [R]])
    delta2 = K2.det()
    det_k3 = K3.det()
    assert delta2 > 0
    assert det_k3 > 0

    projected3 = (y3.transpose() * K3.solve(y3))[0, 0]
    H3 = (projected3 - A) / 4

    Hnum = D * B * B - 2 * E * B * Y + A * Y * Y - A * delta2
    Snum = T * delta2 - (D * F * F - 2 * E * F * G + A * G * G)
    Dnum = R * delta2 - (D * F - E * G) * B - (A * G - E * F) * Y
    N3 = Dnum * Dnum + Hnum * Snum
    H3_cleared = N3 / (4 * delta2 * Snum)
    assert Snum > 0
    assert det_k3.overlaps(Snum)
    assert H3.overlaps(H3_cleared)
    assert N3 < 0
    assert H3 < 0

    # The true target measure is pointwise nonnegative.  Its current-rung
    # norm uses the new target moment only as an independent scope check;
    # none of the auxiliary construction above uses it.
    true_target = inner(q, q, target_moments)
    assert true_target > 0

    bordered = arb_mat(
        [
            [A, E, F, B],
            [E, D, G, Y],
            [F, G, T, R],
            [B, Y, R, A],
        ]
    )
    bordered_determinant = bordered.det()
    assert bordered_determinant.overlaps(-N3 / delta2)
    assert bordered_determinant > 0

    return {
        "order_N": order_n,
        "parity_epsilon": parity_epsilon,
        "degree_kappa": kappa,
        "basis": ["q_prime", "t_q", "q_prior_prime"],
        "q": polynomial_record(q),
        "q_prior": polynomial_record(q_prior),
        "old_target_moments_used_through": kappa - 1,
        "new_target_moment_absent_from_auxiliary": True,
        "certified_quantities": {
            "A": endpoints(A),
            "Delta2": endpoints(delta2),
            "det_K3": endpoints(det_k3),
            "Hnum": endpoints(Hnum),
            "Snum": endpoints(Snum),
            "Dnum": endpoints(Dnum),
            "N3": endpoints(N3),
            "H_prior": endpoints(H3),
            "H_prior_over_A": endpoints(H3 / A),
            "true_target_norm": endpoints(true_target),
            "bordered_determinant": endpoints(bordered_determinant),
        },
        "strict_checks": {
            "rank_three_by_distinct_leading_degrees": True,
            "Delta2_positive": True,
            "det_K3_positive": True,
            "N3_negative": True,
            "H_prior_negative": True,
            "true_target_positive": True,
            "bordered_determinant_positive": True,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=384)
    args = parser.parse_args()
    ctx.prec = args.precision_bits

    positive_moments = [positive_moment(index) for index in range(12)]
    target_moments = [12 * positive_moments[index + 1] for index in range(10)]
    rungs = [
        certify_rung(target_moments, positive_moments, 4, 0),
        certify_rung(target_moments, positive_moments, 3, 1),
    ]

    source = Path(__file__).read_bytes()
    receipt = {
        "schema_version": "zsv.prior_derivative_supergaussian_barrier.v1",
        "status": "PASS",
        "scope": {
            "kind": "source-free analytic countermodel",
            "complete_theta_test": False,
            "finite_rungs": [7, 8],
            "rh_claim": False,
            "statement": (
                "The prior-derivative auxiliary is not implied by a positive "
                "even Schwartz profile, nonnegative true target density, and "
                "actual Galerkin residual alignment."
            ),
        },
        "model": {
            "W": "exp(-t^4)",
            "true_target_density": "W'^2-W*W''=12*t^2*exp(-2*t^4)>=0",
            "positive_moment_formula": (
                "J_k=(1/2)*2^(-(2k+1)/4)*Gamma((2k+1)/4)"
            ),
            "target_moments": "M_k=12*J_(k+1)",
        },
        "rungs": rungs,
        "reproducibility": {
            "python_flint_precision_bits": ctx.prec,
            "script_sha256": hashlib.sha256(source).hexdigest(),
        },
        "nonclaims": [
            "This profile is not the complete Jacobi theta source.",
            "The result does not refute the finite theta certificates.",
            "The result does not determine the all-degree theta inequality.",
            "No finite computation proves or disproves RH.",
        ],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n")
    print(
        json.dumps(
            {
                "status": "PASS",
                "output": str(args.output),
                "kappa7_H_upper": rungs[1]["certified_quantities"]["H_prior"][
                    "upper"
                ],
                "kappa8_H_upper": rungs[0]["certified_quantities"]["H_prior"][
                    "upper"
                ],
                "script_sha256": receipt["reproducibility"]["script_sha256"],
            },
            sort_keys=True,
        )
    )


if __name__ == "__main__":
    main()
