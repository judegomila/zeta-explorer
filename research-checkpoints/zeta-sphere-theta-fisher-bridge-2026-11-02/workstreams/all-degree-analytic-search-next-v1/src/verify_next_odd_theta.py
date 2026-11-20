#!/usr/bin/env python3
"""Deterministically replay the next-odd complete-theta Sobolev proof.

The replay is bounded: it evaluates five fixed derivative orders, three fixed
first-two-orbit pairings per order, and one exact degree-eight Sturm chain.
No network, sampling grid, or finite theta-orbit substitution is used.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from math import comb
from pathlib import Path
import sys

import flint
from flint import arb, ctx


PRECISION_BITS = 300
ctx.prec = PRECISION_BITS

SCRIPT_RELATIVE = "src/verify_next_odd_theta.py"
DEFAULT_RECEIPT_RELATIVE = "results/next_odd_theta_verification.json"
COMMAND = (
    f"{sys.executable} {SCRIPT_RELATIVE} "
    f"--output {DEFAULT_RECEIPT_RELATIVE}"
)


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def sha256_path(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def canonical_bytes(payload: object) -> bytes:
    return json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=True,
    ).encode("utf-8")


def component_sha256(payload: object) -> str:
    return sha256_bytes(canonical_bytes(payload))


def arb_fraction(value: Fraction | int) -> arb:
    value = Fraction(value)
    return arb(f"{value.numerator}/{value.denominator}")


def fraction_text(value: Fraction) -> str:
    return f"{value.numerator}/{value.denominator}"


def sign(value: Fraction) -> str:
    if value > 0:
        return "+"
    if value < 0:
        return "-"
    return "0"


def sign_variations(signs: list[str]) -> int:
    nonzero = [value for value in signs if value != "0"]
    return sum(left != right for left, right in zip(nonzero, nonzero[1:]))


def next_derivative_polynomial(coefficients: list[Fraction]) -> list[Fraction]:
    derivative = [
        Fraction(index + 1) * coefficients[index + 1]
        for index in range(len(coefficients) - 1)
    ]
    result = [Fraction(0)] * (len(coefficients) + 1)
    for index, coefficient in enumerate(coefficients):
        result[index] += coefficient / 2
    for index, coefficient in enumerate(derivative):
        result[index + 1] += 2 * coefficient
    for index, coefficient in enumerate(coefficients):
        result[index + 1] -= 2 * coefficient
    return result


def derivative_polynomials() -> list[list[Fraction]]:
    polynomials = [[Fraction(0), Fraction(-3), Fraction(2)]]
    for _ in range(4):
        polynomials.append(next_derivative_polynomial(polynomials[-1]))
    expected_p4 = [
        Fraction(0),
        Fraction(-1875, 16),
        Fraction(15465, 8),
        Fraction(-4256),
        Fraction(2588),
        Fraction(-528),
        Fraction(32),
    ]
    assert polynomials[4] == expected_p4

    # These exact thresholds certify 0 < P4(z) < 32 z^6 on z >= 27.
    lower_thresholds = [
        Fraction(33, 2),
        Fraction(4256, 2588),
        Fraction(1875, 2 * 15465),
    ]
    upper_thresholds = [
        Fraction(2588, 528),
        Fraction(15465, 8 * 4256),
    ]
    assert all(threshold < 27 for threshold in lower_thresholds + upper_thresholds)
    assert 9 * arb.pi() > 27
    return polynomials


def translate_polynomial(
    coefficients: list[Fraction], offset: int
) -> list[Fraction]:
    """Return coefficients of p(y+offset), in ascending powers of y."""

    translated = [Fraction(0)] * len(coefficients)
    for degree, coefficient in enumerate(coefficients):
        for new_degree in range(degree + 1):
            translated[new_degree] += (
                coefficient
                * comb(degree, new_degree)
                * Fraction(offset) ** (degree - new_degree)
            )
    return translated


def derivative_monomial_certificates(
    polynomials: list[list[Fraction]],
) -> list[dict[str, object]]:
    """Certify 0<(-1)^j P_j(z)<2^(j+1)z^(j+2) for z>=27."""

    rows: list[dict[str, object]] = []
    for order, polynomial in enumerate(polynomials):
        # Every P_j has a factor z.  Divide by z and correct its leading sign.
        signed_divided = [
            Fraction((-1) ** order) * coefficient
            for coefficient in polynomial[1:]
        ]
        envelope = [Fraction(0)] * len(signed_divided)
        envelope[-1] = Fraction(2 ** (order + 1))
        complement = [
            envelope[index] - signed_divided[index]
            for index in range(len(envelope))
        ]
        lower_translated = translate_polynomial(signed_divided, 27)
        upper_translated = translate_polynomial(complement, 27)
        assert all(coefficient > 0 for coefficient in lower_translated)
        assert all(coefficient >= 0 for coefficient in upper_translated)
        assert upper_translated[0] > 0
        rows.append(
            {
                "order": order,
                "claim": (
                    f"0<(-1)^{order}*P_{order}(z)<"
                    f"{2 ** (order + 1)}*z^{order + 2} for z>=27"
                ),
                "lower_after_z_equals_y_plus_27_ascending": [
                    fraction_text(value) for value in lower_translated
                ],
                "upper_complement_after_z_equals_y_plus_27_ascending": [
                    fraction_text(value) for value in upper_translated
                ],
                "lower_coefficients_strictly_positive": True,
                "upper_coefficients_nonnegative_with_positive_constant": True,
            }
        )
    return rows


def upper_incomplete_gamma_monomial(degree: int, lam: arb) -> arb:
    order = arb(2 * degree + 1) / 2
    return lam.gamma_upper(order) / lam**order


def orbit_gram(
    polynomial: list[Fraction], orbit_m: int, orbit_n: int
) -> arb:
    pi = arb.pi()
    lam = pi * (orbit_m * orbit_m + orbit_n * orbit_n)
    total = arb(0)
    for left_degree, left_coefficient in enumerate(polynomial):
        for right_degree, right_coefficient in enumerate(polynomial):
            if left_coefficient == 0 or right_coefficient == 0:
                continue
            total += (
                arb_fraction(left_coefficient)
                * arb_fraction(right_coefficient)
                * (pi * orbit_m * orbit_m) ** left_degree
                * (pi * orbit_n * orbit_n) ** right_degree
                * upper_incomplete_gamma_monomial(
                    left_degree + right_degree, lam
                )
            )
    return 8 * total


def remaining_orbit_bound(order: int, orbit: int) -> arb:
    pi = arb.pi()
    denominator = arb(2) - (
        arb(2 * order) + arb(7) / 2
    ) / (pi * orbit * orbit)
    assert denominator > 0
    return (
        arb(8).sqrt()
        * 2 ** (order + 1)
        * pi ** (arb(order) + arb(3) / 2)
        * orbit ** (2 * order + 3)
        * (-pi * orbit * orbit).exp()
        / denominator.sqrt()
    )


def interval_from_endpoints(lower: Fraction, upper: Fraction) -> arb:
    assert lower < upper
    midpoint = (lower + upper) / 2
    radius = (upper - lower) / 2
    return arb(arb_fraction(midpoint), arb_fraction(radius))


def coefficient_intervals(moment_boxes: list[arb]) -> list[arb]:
    m0, m1, m2, m3, m4 = moment_boxes
    coefficients: list[arb] = [arb(0)] * 9
    coefficients[8] = 5 * m0**2 * m1**2 - m0**3 * m2
    coefficients[7] = (
        -36 * m0 * m1**3
        - 14 * m0**2 * m1 * m2
        + 2 * m0**3 * m3
    )
    coefficients[6] = (
        36 * m1**4
        + 210 * m0 * m1**2 * m2
        + 25 * m0**2 * m2**2
        - 14 * m0**2 * m1 * m3
        - m0**3 * m4
    )
    coefficients[5] = (
        -324 * m1**3 * m2
        - 492 * m0 * m1 * m2**2
        - 18 * m0**2 * m2 * m3
        + 18 * m0**2 * m1 * m4
    )
    coefficients[4] = (
        1053 * m1**2 * m2**2
        + 72 * m1**3 * m3
        + 441 * m0 * m2**3
        + 228 * m0 * m1 * m2 * m3
        - 72 * m0 * m1**2 * m4
        + 25 * m0**2 * m3**2
        - 27 * m0**2 * m2 * m4
    )
    coefficients[3] = (
        -1782 * m1 * m2**3
        - 288 * m1**2 * m2 * m3
        - 474 * m0 * m2**2 * m3
        - 156 * m0 * m1 * m3**2
        + 252 * m0 * m1 * m2 * m4
    )
    coefficients[2] = (
        1215 * m2**4
        + 1170 * m1 * m2**2 * m3
        + 36 * m1**2 * m3**2
        - 216 * m1**2 * m2 * m4
        + 306 * m0 * m2 * m3**2
        - 207 * m0 * m2**2 * m4
    )
    coefficients[1] = (
        -1350 * m2**3 * m3
        - 540 * m1 * m2 * m3**2
        + 594 * m1 * m2**2 * m4
    )
    coefficients[0] = 729 * m2**2 * m3**2 - 405 * m2**3 * m4
    return coefficients


def trim(polynomial: list[Fraction]) -> list[Fraction]:
    result = list(polynomial)
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def derivative(polynomial: list[Fraction]) -> list[Fraction]:
    return [
        Fraction(index) * polynomial[index]
        for index in range(1, len(polynomial))
    ]


def divide_with_remainder(
    dividend: list[Fraction], divisor: list[Fraction]
) -> tuple[list[Fraction], list[Fraction]]:
    remainder = trim(dividend)
    divisor = trim(divisor)
    quotient = [Fraction(0)] * max(1, len(remainder) - len(divisor) + 1)
    while len(remainder) >= len(divisor) and any(remainder):
        offset = len(remainder) - len(divisor)
        factor = remainder[-1] / divisor[-1]
        quotient[offset] = factor
        for index, coefficient in enumerate(divisor):
            remainder[index + offset] -= factor * coefficient
        remainder = trim(remainder)
    return trim(quotient), trim(remainder)


def sturm_sequence(polynomial: list[int]) -> list[list[Fraction]]:
    sequence = [list(map(Fraction, polynomial))]
    sequence.append(derivative(sequence[0]))
    while len(sequence[-1]) > 1:
        _, remainder = divide_with_remainder(sequence[-2], sequence[-1])
        assert any(remainder)
        sequence.append([-coefficient for coefficient in remainder])
    return sequence


def serialize_fraction_polynomial(polynomial: list[Fraction]) -> list[str]:
    return [fraction_text(coefficient) for coefficient in polynomial]


def build_receipt(script_path: Path) -> dict[str, object]:
    polynomials = derivative_polynomials()
    monomial_certificates = derivative_monomial_certificates(polynomials)

    ratio_bound = (arb(4) / 3) ** 11 * (-7 * arb.pi()).exp()
    assert ratio_bound < arb(1) / 2

    tail_upper_bounds = [
        Fraction(6527, 10**13),
        Fraction(3763, 10**11),
        Fraction(2171, 10**9),
        Fraction(125313, 10**9),
        Fraction(7241877, 10**9),
    ]
    coarse_endpoints = [
        (Fraction("0.6395036226"), Fraction("0.6395036248")),
        (Fraction("6.5277744550"), Fraction("6.5277748400")),
        (Fraction("191.63712160"), Fraction("191.63724190")),
        (Fraction("8973.2404"), Fraction("8973.2880")),
        (Fraction("563469.09"), Fraction("563490.85")),
    ]

    orbit_rows: list[dict[str, object]] = []
    moment_enclosures: list[arb] = []
    for order, polynomial in enumerate(polynomials):
        gram_11 = orbit_gram(polynomial, 1, 1)
        gram_12 = orbit_gram(polynomial, 1, 2)
        gram_22 = orbit_gram(polynomial, 2, 2)
        first_two_norm_square = gram_11 + 2 * gram_12 + gram_22
        assert first_two_norm_square > 0

        b_order_3 = remaining_orbit_bound(order, 3)
        tail_norm = 2 * b_order_3
        assert tail_norm < arb_fraction(tail_upper_bounds[order])

        enclosure_radius = (
            2 * tail_norm * first_two_norm_square.sqrt()
            + tail_norm * tail_norm
        )
        moment_enclosure = first_two_norm_square + arb(
            0, enclosure_radius.upper()
        )
        coarse_box = interval_from_endpoints(*coarse_endpoints[order])
        assert coarse_box.contains(moment_enclosure)
        moment_enclosures.append(moment_enclosure)

        orbit_rows.append(
            {
                "order": order,
                "gram_11_arb": gram_11.str(),
                "gram_12_arb": gram_12.str(),
                "gram_22_arb": gram_22.str(),
                "first_two_norm_square_arb": first_two_norm_square.str(),
                "b_order_3_arb": b_order_3.str(),
                "tail_norm_upper_arb": tail_norm.str(),
                "tail_norm_claim_upper": fraction_text(
                    tail_upper_bounds[order]
                ),
                "complete_moment_enclosure_arb": moment_enclosure.str(),
                "coarse_lower": fraction_text(coarse_endpoints[order][0]),
                "coarse_upper": fraction_text(coarse_endpoints[order][1]),
                "coarse_contains_complete_enclosure": True,
            }
        )

    coarse_boxes = [
        interval_from_endpoints(lower, upper)
        for lower, upper in coarse_endpoints
    ]
    coefficient_boxes = coefficient_intervals(coarse_boxes)
    even_lower_bounds = {
        0: 549500000000000,
        2: 3564000000000,
        4: 3974300000,
        6: 1054700,
        8: 37,
    }
    odd_lower_bounds = {
        1: -59420000000000,
        3: -141800000000,
        5: -78290000,
        7: -8873,
    }
    coefficient_rows: list[dict[str, object]] = []
    for degree, coefficient in enumerate(coefficient_boxes):
        if degree % 2 == 0:
            assert coefficient > even_lower_bounds[degree]
            direction = "positive_even_lower"
            claimed_bound = even_lower_bounds[degree]
        else:
            assert coefficient > odd_lower_bounds[degree]
            assert coefficient < 0
            direction = "negative_odd_lower_and_upper_zero"
            claimed_bound = odd_lower_bounds[degree]
        coefficient_rows.append(
            {
                "degree": degree,
                "arb_interval": coefficient.str(),
                "direction": direction,
                "claimed_lower_bound": claimed_bound,
            }
        )

    lower_polynomial = [
        549500000000000,
        -59420000000000,
        3564000000000,
        -141800000000,
        3974300000,
        -78290000,
        1054700,
        -8873,
        37,
    ]
    sequence = sturm_sequence(lower_polynomial)
    assert [len(row) - 1 for row in sequence] == list(range(8, -1, -1))
    zero_signs = [sign(row[0]) for row in sequence]
    infinity_signs = [sign(row[-1]) for row in sequence]
    assert zero_signs == ["+", "-", "-", "-", "+", "+", "-", "-", "+"]
    assert infinity_signs == ["+", "+", "-", "+", "+", "-", "-", "+", "+"]
    zero_variations = sign_variations(zero_signs)
    infinity_variations = sign_variations(infinity_signs)
    assert zero_variations == infinity_variations == 4
    assert lower_polynomial[0] > 0

    polynomial_payload = [
        serialize_fraction_polynomial(polynomial) for polynomial in polynomials
    ]
    sturm_payload = [
        serialize_fraction_polynomial(polynomial) for polynomial in sequence
    ]
    numeric_payload = {
        "orbit_rows": orbit_rows,
        "coefficient_rows": coefficient_rows,
    }

    receipt: dict[str, object] = {
        "schema_version": "zsv.next_odd_theta_verification.v1",
        "status": "pass",
        "scope": (
            "Complete-theta two-generator sufficient condition at "
            "(N,epsilon)=(1,1), uniformly for every real residual coefficient."
        ),
        "nonclaims": [
            "No higher-rung or parity induction is proved.",
            "No all-degree positivity theorem is proved.",
            "No first Xi-Laguerre theorem is proved.",
            "No statement proving the Riemann hypothesis is made.",
        ],
        "command": COMMAND,
        "runtime": {
            "python": sys.version.split()[0],
            "python_executable": sys.executable,
            "python_flint": flint.__version__,
            "arb_precision_bits": PRECISION_BITS,
            "bounded_fixed_orders": [0, 1, 2, 3, 4],
            "network_used": False,
        },
        "normalization": {
            "computed_moments": "n_j=||psi^(j)||^2 on the positive half-line",
            "spectral_moments": "m_j=4*pi*n_j",
            "sign_invariance": "F[m]=(4*pi)^4 F[n]",
        },
        "derivative_polynomials_ascending": polynomial_payload,
        "derivative_monomial_bounds": monomial_certificates,
        "p4_domain_certificate": {
            "domain": "z>=9*pi>27",
            "claim": "0<P4(z)<32*z^6",
            "lower_group_thresholds": ["33/2", "1064/647", "125/2062"],
            "upper_group_thresholds": ["647/132", "15465/34048"],
            "all_thresholds_below_27": True,
        },
        "first_two_orbit_and_tail": {
            "formula": (
                "G_j,mn=8*integral_1^inf x^(-1/2) "
                "P_j(pi*m^2*x)P_j(pi*n^2*x)exp(-pi*(m^2+n^2)*x)dx"
            ),
            "monomial_formula": (
                "J_d(lambda)=lambda^(-d-1/2)*Gamma(d+1/2,lambda)"
            ),
            "tail_ratio_bound_arb": ratio_bound.str(),
            "tail_ratio_claim": "(4/3)^11*exp(-7*pi)<1/2",
            "orders": orbit_rows,
        },
        "coefficient_certificate": {
            "coefficient_order": "ascending powers of c",
            "rows": coefficient_rows,
            "c_nonpositive_argument": (
                "even coefficients positive and odd coefficients negative, "
                "so every f_k*c^k is nonnegative for c<=0 and the constant "
                "term is strictly positive"
            ),
            "lower_polynomial_ascending": lower_polynomial,
        },
        "sturm_certificate": {
            "sequence_coefficients_ascending": sturm_payload,
            "degrees": [len(row) - 1 for row in sequence],
            "signs_at_zero": zero_signs,
            "signs_at_positive_infinity": infinity_signs,
            "variations_at_zero": zero_variations,
            "variations_at_positive_infinity": infinity_variations,
            "positive_roots": 0,
            "constant_term_positive": True,
            "lower_polynomial_positive_for_c_nonnegative": True,
        },
        "conclusion": {
            "F_theta_positive_for_every_real_c": True,
            "two_generator_margin_positive": True,
            "actual_next_odd_rung_closed": True,
        },
        "hashes": {
            "source_sha256": sha256_path(script_path),
            "derivative_polynomials_sha256": component_sha256(polynomial_payload),
            "numeric_evidence_sha256": component_sha256(numeric_payload),
            "lower_polynomial_sha256": component_sha256(lower_polynomial),
            "sturm_sequence_sha256": component_sha256(sturm_payload),
        },
    }
    receipt["hashes"]["payload_without_payload_hash_sha256"] = component_sha256(
        receipt
    )
    return receipt


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    script_path = Path(__file__).resolve()
    receipt = build_receipt(script_path)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    rendered = json.dumps(receipt, indent=2, sort_keys=True) + "\n"
    args.output.write_text(rendered, encoding="utf-8")
    print(
        json.dumps(
            {
                "output": str(args.output),
                "payload_sha256": receipt["hashes"][
                    "payload_without_payload_hash_sha256"
                ],
                "source_sha256": receipt["hashes"]["source_sha256"],
                "status": receipt["status"],
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
