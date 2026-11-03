#!/usr/bin/env python3
"""Independent bounded audit of the actual-theta reverse-Schur failure.

The primary verifier is not imported.  This audit independently implements
the target-moment solve with ``arb_mat`` and a determinant-ratio pivot, uses
an exact first-eight-orbit block, and bounds every orbit n >= 9 analytically.
It is an independent implementation and orbit split inside the same campaign,
not external peer review.
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
from flint import arb, arb_mat, ctx


DEFAULT_PRECISION_BITS = 720
ctx.prec = DEFAULT_PRECISION_BITS

MAIN_VERIFIER_REL = "workstreams/all-degree-analytic-search-next-v1/src/verify_reverse_schur_actual_failure.py"
MAIN_RECEIPT_REL = "workstreams/all-degree-analytic-search-next-v1/results/reverse_schur_actual_failure.json"
MAIN_RECEIPT_600_REL = "workstreams/all-degree-analytic-search-next-v1/results/reverse_schur_actual_failure_600.json"
TARGET_REL = "evidence/v18-curated/full_split_audit/actual_total_certificate.json"
PROOF_REL = "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_PROOF.md"
MANIFEST_REL = "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_FROZEN_SHA256.txt"
AUDIT_REL = "evidence/v18-curated/full_split_audit/AUDIT.md"

EXPECTED_MAIN_VERIFIER_SHA256 = "9e0e37a25b1e1b04f93a26959fd30d8cd0b885451665b715ddaace3db3ad08e0"
EXPECTED_MAIN_RECEIPT_SHA256 = "7b909d7d416afd4c7433e5f81669d7c16b4a9be4c0919c5b5bf2da5ed354e6c5"
EXPECTED_MAIN_RECEIPT_600_SHA256 = "46032d588351d17a1fc44024938785ccbd1fc8ee3f411fa0af6366f7d4c6b444"
EXPECTED_TARGET_SHA256 = "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536"
EXPECTED_PROOF_SHA256 = "f6b3d0d7b4322104bd68a2ad01a85039eeab40c1939c9dd9d2672a1bac9f7a06"
EXPECTED_MANIFEST_SHA256 = "373fe7b29163a876dfe25eb1493d30747f094524798d1e20f4998f948b3446ba"
EXPECTED_AUDIT_SHA256 = "c0df6973d7186b53b30e0c47647fc71a3f90ce046cac1fa8c07697906a7d40a5"
EXPECTED_TARGET_SCOPE = "Full theta normalized a=0 full moments via reflected identity"

DECIMAL_PADDING_SCALE = Fraction(1, 10**90)
RESIDUAL_N = 5
MAX_DERIVATIVE_ORDER = 11
EXACT_ORBITS = tuple(range(1, 9))
TAIL_START = 9
TAIL_ENVELOPE_THRESHOLD = 250


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def exact(value: Fraction | int | str) -> arb:
    value = Fraction(value)
    return arb(value.numerator) / value.denominator


def interval(lower: Fraction, upper: Fraction) -> arb:
    assert lower < upper
    midpoint = (lower + upper) / 2
    radius = (upper - lower) / 2
    return arb(exact(midpoint), exact(radius))


def padded_decimal_interval(lower: str, upper: str) -> tuple[arb, Fraction]:
    left, right = Fraction(lower), Fraction(upper)
    padding = DECIMAL_PADDING_SCALE * (1 + abs(left) + abs(right))
    return interval(left - padding, right + padding), padding


def endpoints(value: arb, digits: int = 70) -> dict[str, str]:
    return {
        "lower": value.lower().str(digits),
        "upper": value.upper().str(digits),
        "arb": value.str(min(digits, 45)),
    }


def fraction_text(value: Fraction) -> str:
    return f"{value.numerator}/{value.denominator}"


def next_derivative_polynomial(coefficients: list[Fraction]) -> list[Fraction]:
    """Return P_(j+1)=P_j/2+2z(P_j'-P_j), ascending coefficients."""
    derivative = [
        Fraction(index + 1) * coefficients[index + 1]
        for index in range(len(coefficients) - 1)
    ]
    result = [Fraction(0)] * (len(coefficients) + 1)
    for index, coefficient in enumerate(coefficients):
        result[index] += coefficient / 2
        result[index + 1] -= 2 * coefficient
    for index, coefficient in enumerate(derivative):
        result[index + 1] += 2 * coefficient
    return result


def translate_polynomial(coefficients: list[Fraction], offset: int) -> list[Fraction]:
    translated = [Fraction(0)] * len(coefficients)
    for degree, coefficient in enumerate(coefficients):
        for new_degree in range(degree + 1):
            translated[new_degree] += (
                coefficient
                * comb(degree, new_degree)
                * offset ** (degree - new_degree)
            )
    return translated


def certify_envelope(polynomial: list[Fraction], order: int) -> dict[str, object]:
    """Certify 0<(-1)^j P_j(z)<2^(j+1)z^(j+2) for z>=250."""
    signed_divided = [Fraction((-1) ** order) * item for item in polynomial[1:]]
    leading_envelope = [Fraction(0)] * len(signed_divided)
    leading_envelope[-1] = Fraction(2 ** (order + 1))
    complement = [left - right for left, right in zip(leading_envelope, signed_divided)]
    lower_shifted = translate_polynomial(signed_divided, TAIL_ENVELOPE_THRESHOLD)
    upper_shifted = translate_polynomial(complement, TAIL_ENVELOPE_THRESHOLD)
    assert all(item > 0 for item in lower_shifted)
    assert all(item >= 0 for item in upper_shifted) and upper_shifted[0] > 0
    return {
        "order": order,
        "claim": (
            f"0<(-1)^{order}*P_{order}(z)<"
            f"{2 ** (order + 1)}*z^{order + 2} for z>={TAIL_ENVELOPE_THRESHOLD}"
        ),
        "lower_shifted_coefficients": [fraction_text(item) for item in lower_shifted],
        "upper_shifted_coefficients": [fraction_text(item) for item in upper_shifted],
    }


def upper_incomplete_gamma_monomial(degree: int, lam: arb) -> arb:
    order = arb(2 * degree + 1) / 2
    return lam.gamma_upper(order) / lam**order


def orbit_gram(polynomial: list[Fraction], left_orbit: int, right_orbit: int) -> arb:
    pi = arb.pi()
    lam = pi * (left_orbit**2 + right_orbit**2)
    total = arb(0)
    for left_degree, left_coefficient in enumerate(polynomial):
        for right_degree, right_coefficient in enumerate(polynomial):
            if left_coefficient == 0 or right_coefficient == 0:
                continue
            total += (
                exact(left_coefficient)
                * exact(right_coefficient)
                * (pi * left_orbit**2) ** left_degree
                * (pi * right_orbit**2) ** right_degree
                * upper_incomplete_gamma_monomial(left_degree + right_degree, lam)
            )
    return 8 * total


def first_tail_orbit_norm_bound(order: int, orbit: int) -> arb:
    pi = arb.pi()
    denominator = arb(2) - (arb(2 * order) + arb(7) / 2) / (pi * orbit**2)
    assert denominator > 0
    return (
        arb(8).sqrt()
        * 2 ** (order + 1)
        * pi ** (arb(order) + arb(3) / 2)
        * orbit ** (2 * order + 3)
        * (-pi * orbit**2).exp()
        / denominator.sqrt()
    )


def complete_positive_moments() -> tuple[list[arb], list[dict[str, object]], list[dict[str, object]], arb]:
    polynomials = [[Fraction(0), Fraction(-3), Fraction(2)]]
    for _ in range(MAX_DERIVATIVE_ORDER):
        polynomials.append(next_derivative_polynomial(polynomials[-1]))
    envelopes = [certify_envelope(polynomial, order) for order, polynomial in enumerate(polynomials)]
    assert arb.pi() * TAIL_START**2 > TAIL_ENVELOPE_THRESHOLD

    # The largest power is 2j+3=25 at j=11.  For n>=9, the ratio of
    # consecutive monomial-envelope norm bounds is at most this quantity;
    # the square-root denominator factor only lowers it.
    tail_ratio_bound = (arb(10) / 9) ** 25 * (-19 * arb.pi()).exp()
    assert tail_ratio_bound < arb(1) / 2

    moments: list[arb] = []
    rows: list[dict[str, object]] = []
    for order, polynomial in enumerate(polynomials):
        assembled = arb(0)
        for left_orbit in EXACT_ORBITS:
            for right_orbit in EXACT_ORBITS:
                assembled += orbit_gram(polynomial, left_orbit, right_orbit)
        assert assembled > 0
        tail_norm = 2 * first_tail_orbit_norm_bound(order, TAIL_START)
        norm_square_radius = 2 * tail_norm * assembled.sqrt() + tail_norm**2
        complete = assembled + arb(0, norm_square_radius.upper())
        assert complete > 0
        moments.append(complete)
        rows.append({
            "order": order,
            "exact_orbit_block": list(EXACT_ORBITS),
            "assembled_exact_block_halfline_norm_square": endpoints(assembled),
            "all_n_ge_9_tail_norm_upper": tail_norm.upper().str(70),
            "complete_halfline_norm_square": endpoints(complete),
        })
    return moments, rows, envelopes, tail_ratio_bound


def derivative(polynomial: dict[int, arb], count: int = 1) -> dict[int, arb]:
    result = polynomial
    for _ in range(count):
        result = {
            degree - 1: degree * coefficient
            for degree, coefficient in result.items()
            if degree
        }
    return result


def times_t(polynomial: dict[int, arb]) -> dict[int, arb]:
    return {degree + 1: coefficient for degree, coefficient in polynomial.items()}


def positive_inner(left: dict[int, arb], right: dict[int, arb], moments: list[arb]) -> arb:
    total = arb(0)
    for left_degree, left_coefficient in left.items():
        for right_degree, right_coefficient in right.items():
            assert (left_degree + right_degree) % 2 == 0
            total += left_coefficient * right_coefficient * moments[(left_degree + right_degree) // 2]
    return total


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=DEFAULT_PRECISION_BITS)
    args = parser.parse_args()
    assert 512 <= args.precision_bits <= 1024
    ctx.prec = args.precision_bits

    root = args.root.resolve()
    paths = {
        "main_verifier": root / MAIN_VERIFIER_REL,
        "main_receipt": root / MAIN_RECEIPT_REL,
        "main_receipt_600": root / MAIN_RECEIPT_600_REL,
        "target": root / TARGET_REL,
        "proof": root / PROOF_REL,
        "manifest": root / MANIFEST_REL,
        "full_split_audit": root / AUDIT_REL,
    }
    expected = {
        "main_verifier": EXPECTED_MAIN_VERIFIER_SHA256,
        "main_receipt": EXPECTED_MAIN_RECEIPT_SHA256,
        "main_receipt_600": EXPECTED_MAIN_RECEIPT_600_SHA256,
        "target": EXPECTED_TARGET_SHA256,
        "proof": EXPECTED_PROOF_SHA256,
        "manifest": EXPECTED_MANIFEST_SHA256,
        "full_split_audit": EXPECTED_AUDIT_SHA256,
    }
    for key, path in paths.items():
        assert digest(path) == expected[key]

    target_payload = json.loads(paths["target"].read_text(encoding="utf-8"))
    assert target_payload["scope"] == EXPECTED_TARGET_SCOPE
    target_moments: list[arb] = []
    target_rows: list[dict[str, object]] = []
    for index, (lower, upper) in enumerate(target_payload["moments"][:11]):
        stored, padding = padded_decimal_interval(lower, upper)
        corrected = stored / (4**index)
        target_moments.append(corrected)
        target_rows.append({
            "index": index,
            "stored_mu_interval": [lower, upper],
            "serialization_padding": fraction_text(padding),
            "relation": f"mu_{index}=4^{index}*M_{index}",
            "corrected_M_interval": endpoints(corrected),
        })

    leading_determinants: list[arb] = []
    for size in range(1, RESIDUAL_N + 1):
        block = arb_mat([
            [target_moments[row + column] for column in range(size)]
            for row in range(size)
        ])
        determinant = block.det()
        assert determinant > 0
        leading_determinants.append(determinant)

    old_hankel = arb_mat([
        [target_moments[row + column] for column in range(RESIDUAL_N)]
        for row in range(RESIDUAL_N)
    ])
    extended_hankel = arb_mat([
        [target_moments[row + column] for column in range(RESIDUAL_N + 1)]
        for row in range(RESIDUAL_N + 1)
    ])
    target_column = arb_mat([[target_moments[row + RESIDUAL_N]] for row in range(RESIDUAL_N)])
    coefficients_matrix = old_hankel.solve(-target_column)
    coefficients = [coefficients_matrix[row, 0] for row in range(RESIDUAL_N)]
    pivot_determinant_ratio = extended_hankel.det() / old_hankel.det()
    pivot_schur = target_moments[2 * RESIDUAL_N] + sum(
        (target_moments[row + RESIDUAL_N] * coefficients[row] for row in range(RESIDUAL_N)),
        arb(0),
    )
    assert pivot_determinant_ratio > arb("1e16")
    assert pivot_schur > arb("1e16")
    assert pivot_determinant_ratio.overlaps(pivot_schur)

    q = {2 * index: coefficient for index, coefficient in enumerate(coefficients)}
    q[2 * RESIDUAL_N] = arb(1)
    positive_moments, positive_rows, envelope_rows, tail_ratio_bound = complete_positive_moments()
    q_prime = derivative(q)
    q_second = derivative(q, 2)
    tq = times_t(q)
    A = positive_inner(q_prime, q_prime, positive_moments)
    B = positive_inner(q, q_second, positive_moments)
    C = positive_inner(q, q, positive_moments)
    D = positive_inner(tq, tq, positive_moments)
    E = positive_inner(tq, q_prime, positive_moments)
    Delta = A * D - E * E
    G = A * A - B * B
    R0 = C + E - E * B / A
    V = D - E * E / A
    reverse_schur_cap = A * R0 * R0 / G
    cap_minus_V = reverse_schur_cap - V
    F = (A * C + E * (A - B)) ** 2 - Delta * G
    H_halfline = F / (4 * A * Delta)
    assert A > 0 and Delta > 0 and G > 0 and V > 0 and reverse_schur_cap > 0
    assert cap_minus_V < arb("-8e16")
    assert F < arb("-1e67")
    assert H_halfline < arb("-1e14")

    scalars = {
        "A": A, "B": B, "C": C, "D": D, "E": E,
        "Delta": Delta, "G=A^2-B^2": G,
        "R0=C+E-EB/A": R0, "V=D-E^2/A": V,
        "reverse_schur_cap=A*R0^2/G": reverse_schur_cap,
        "cap_minus_V": cap_minus_V, "F": F, "H_halfline": H_halfline,
    }
    script_path = Path(__file__).resolve()
    receipt = {
        "schema_version": "zsv.reverse_schur_actual_failure.independent_audit.v1",
        "status": "PASS",
        "scope": (
            "Independent bounded audit of the actual complete-theta even (5,0) "
            "reverse-Schur auxiliary failure and positive signed target pivot"
        ),
        "audit_relation": {
            "independent_features": [
                "primary verifier is hash-bound but not imported",
                "arb_mat solve instead of hand-coded LDL solve",
                "signed target pivot checked by determinant ratio and Schur expression",
                "exact theta orbit block n=1..8 instead of n=1..6",
                "independently implemented derivative recurrence, orbit gamma integrals, and n>=9 tail",
            ],
            "qualification": "Independent campaign implementation and orbit split; not external peer review.",
        },
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": flint.__version__,
            "arb_precision_bits": args.precision_bits,
            "network_used": False,
            "quadrature_used": False,
            "finite_orbit_substitution_used": False,
            "exact_orbit_block": list(EXACT_ORBITS),
            "analytic_tail": "all theta orbits n>=9",
            "derivative_orders": list(range(MAX_DERIVATIVE_ORDER + 1)),
        },
        "normalization": {
            "target_archive": "mu_j=4^j*M_j; outward serialization padding applied before exact division",
            "positive_boxes": "n_j=||psi^(j)||^2 on h>=0",
            "spectral_positive_moments": "m_j=4*pi*n_j",
            "homogeneity": "common 4*pi scaling preserves signs of F, H, and cap-V",
        },
        "provenance": {
            "audit_verifier": str(script_path.relative_to(root)),
            "audit_verifier_sha256": digest(script_path),
            **{
                f"{key}_path": str(path.relative_to(root))
                for key, path in paths.items()
            },
            **{
                f"{key}_sha256": digest(path)
                for key, path in paths.items()
            },
        },
        "replay": {
            "working_directory": "checkpoint root",
            "command": (
                "<arb-python> workstreams/all-degree-analytic-search-next-v1/src/"
                "audit_reverse_schur_actual_failure.py --root . --precision-bits "
                f"{args.precision_bits} --output workstreams/all-degree-analytic-search-next-v1/"
                "results/reverse_schur_actual_failure_independent_audit.json"
            ),
        },
        "target_moments": target_rows,
        "old_even_hankel_leading_determinants": [endpoints(value) for value in leading_determinants],
        "actual_residual": {
            "q": "t^10+p4*t^8+p3*t^6+p2*t^4+p1*t^2+p0",
            "coefficients_ascending_even_powers": [endpoints(value) for value in coefficients] + [endpoints(arb(1))],
            "signed_target_pivot_determinant_ratio": endpoints(pivot_determinant_ratio),
            "signed_target_pivot_schur": endpoints(pivot_schur),
            "two_pivot_enclosures_overlap": True,
            "signed_target_pivot_strictly_positive": True,
        },
        "derivative_tail_envelopes": envelope_rows,
        "tail_ratio": {
            "claim": "(10/9)^25*exp(-19*pi)<1/2 for all derivative orders 0..11 and n>=9",
            "bound_arb": tail_ratio_bound.str(),
            "geometric_tail_multiplier": "1/(1-ratio)<2",
        },
        "complete_positive_moments": positive_rows,
        "reverse_schur_evaluation": {key: endpoints(value) for key, value in scalars.items()},
        "strict_conclusion": {
            "old_even_target_prefix_positive_definite": True,
            "actual_signed_target_pivot_positive": True,
            "unresolved_reverse_schur_branch_G_positive": True,
            "reverse_schur_cap_fails": True,
            "two_generator_auxiliary_H_negative": True,
        },
        "nonclaims": [
            "The actual signed theta pivot is not negative; both independent pivot formulas prove it positive.",
            "The audit does not disprove the first Xi-Laguerre inequality, an all-degree target theorem, or RH.",
            "The audit retires only the proposed all-degree reverse-Schur auxiliary.",
            "This is independent campaign verification, not external peer review.",
        ],
    }
    canonical = json.dumps(receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of canonical compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": "PASS",
        "output": str(args.output),
        "target_pivot_det_ratio_lower": pivot_determinant_ratio.lower().str(40),
        "target_pivot_schur_lower": pivot_schur.lower().str(40),
        "cap_minus_V_upper": cap_minus_V.upper().str(40),
        "H_halfline_upper": H_halfline.upper().str(40),
        "source_sha256": digest(script_path),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
