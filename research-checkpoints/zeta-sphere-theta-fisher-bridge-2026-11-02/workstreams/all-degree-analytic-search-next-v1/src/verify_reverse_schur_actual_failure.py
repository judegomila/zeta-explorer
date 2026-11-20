#!/usr/bin/env python3
"""Certify failure of the reverse-Schur auxiliary at the actual theta (5,0) residual.

This bounded replay uses the archived all-orbit signed target-moment boxes,
exact first-six-orbit derivative correlations, and one analytic tail norm
containing every theta orbit n >= 7.  It proves a failure of the sufficient
two-generator auxiliary, not a failure of the actual signed theta pivot.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import importlib.util
import json
from math import comb
from pathlib import Path
import sys

import flint
from flint import arb, ctx


DEFAULT_PRECISION_BITS = 400
ctx.prec = DEFAULT_PRECISION_BITS

HELPER_REL = "workstreams/all-degree-analytic-search-next-v1/src/verify_next_odd_theta.py"
TARGET_REL = "evidence/v18-curated/full_split_audit/actual_total_certificate.json"
PROOF_REL = "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_PROOF.md"
MANIFEST_REL = "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_FROZEN_SHA256.txt"
AUDIT_REL = "evidence/v18-curated/full_split_audit/AUDIT.md"
EXPECTED_HELPER_SHA256 = "b71b09559a5ee4b1f79c0946888acf8f854f1152f482b9131500a0903558c96b"
EXPECTED_TARGET_SHA256 = "06b56542d907b50d397263a88da4a39da75ac94463cd48d54da8a5e43198b536"
EXPECTED_PROOF_SHA256 = "f6b3d0d7b4322104bd68a2ad01a85039eeab40c1939c9dd9d2672a1bac9f7a06"
EXPECTED_MANIFEST_SHA256 = "373fe7b29163a876dfe25eb1493d30747f094524798d1e20f4998f948b3446ba"
EXPECTED_AUDIT_SHA256 = "c0df6973d7186b53b30e0c47647fc71a3f90ce046cac1fa8c07697906a7d40a5"
EXPECTED_TARGET_SCOPE = "Full theta normalized a=0 full moments via reflected identity"
DECIMAL_PADDING_SCALE = Fraction(1, 10**90)
RESIDUAL_N = 5
RESIDUAL_EPSILON = 0
MAX_DERIVATIVE_ORDER = 11
EXACT_ORBITS = tuple(range(1, 7))
TAIL_START = 7
TAIL_ENVELOPE_THRESHOLD = 150


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def exact(value: Fraction | int | str) -> arb:
    value = Fraction(value)
    return arb(value.numerator) / value.denominator


def interval_from_fraction_endpoints(lower: Fraction, upper: Fraction) -> arb:
    assert lower < upper
    midpoint = (lower + upper) / 2
    radius = (upper - lower) / 2
    return arb(exact(midpoint), exact(radius))


def padded_decimal_interval(lower: str, upper: str) -> tuple[arb, Fraction]:
    left, right = Fraction(lower), Fraction(upper)
    assert left < right
    padding = DECIMAL_PADDING_SCALE * (1 + abs(left) + abs(right))
    return interval_from_fraction_endpoints(left - padding, right + padding), padding


def endpoints(value: arb, digits: int = 70) -> dict[str, str]:
    return {
        "lower": value.lower().str(digits),
        "upper": value.upper().str(digits),
        "arb": value.str(min(digits, 45)),
    }


def load_helper(path: Path):
    spec = importlib.util.spec_from_file_location("theta_orbit_helper", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


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


def fraction_text(value: Fraction) -> str:
    return f"{value.numerator}/{value.denominator}"


def certify_derivative_envelope(
    polynomial: list[Fraction], order: int
) -> dict[str, object]:
    """Prove 0 < (-1)^j P_j(z) < 2^(j+1) z^(j+2) for z >= 150."""
    signed_divided = [Fraction((-1) ** order) * item for item in polynomial[1:]]
    envelope = [Fraction(0)] * len(signed_divided)
    envelope[-1] = Fraction(2 ** (order + 1))
    complement = [left - right for left, right in zip(envelope, signed_divided)]
    lower_shifted = translate_polynomial(signed_divided, TAIL_ENVELOPE_THRESHOLD)
    upper_shifted = translate_polynomial(complement, TAIL_ENVELOPE_THRESHOLD)
    assert all(item > 0 for item in lower_shifted)
    assert all(item >= 0 for item in upper_shifted)
    assert upper_shifted[0] > 0
    return {
        "order": order,
        "claim": (
            f"0<(-1)^{order}*P_{order}(z)<"
            f"{2 ** (order + 1)}*z^{order + 2} for z>={TAIL_ENVELOPE_THRESHOLD}"
        ),
        "lower_shifted_coefficients": [fraction_text(item) for item in lower_shifted],
        "upper_shifted_coefficients": [fraction_text(item) for item in upper_shifted],
    }


def complete_positive_moments(helper) -> tuple[list[arb], list[dict[str, object]], list[dict[str, object]]]:
    polynomials = [[Fraction(0), Fraction(-3), Fraction(2)]]
    for _ in range(MAX_DERIVATIVE_ORDER):
        polynomials.append(helper.next_derivative_polynomial(polynomials[-1]))
    envelopes = [
        certify_derivative_envelope(polynomial, order)
        for order, polynomial in enumerate(polynomials)
    ]
    assert arb.pi() * TAIL_START**2 > TAIL_ENVELOPE_THRESHOLD
    # For j<=11 and n>=7, the successive monomial-envelope norm bounds have
    # ratio at most (8/7)^(2j+3)*exp(-pi*((n+1)^2-n^2)).  The denominator
    # factor in remaining_orbit_bound decreases this ratio.  Its uniform
    # maximum is therefore the following number, so twice the first omitted
    # bound contains the entire n>=7 norm tail.
    tail_ratio_bound = (arb(8) / 7) ** 25 * (-15 * arb.pi()).exp()
    assert tail_ratio_bound < arb(1) / 2

    moments: list[arb] = []
    rows: list[dict[str, object]] = []
    for order, polynomial in enumerate(polynomials):
        assembled = arb(0)
        for left in EXACT_ORBITS:
            for right in EXACT_ORBITS:
                assembled += helper.orbit_gram(polynomial, left, right)
        assert assembled > 0
        tail_norm = 2 * helper.remaining_orbit_bound(order, TAIL_START)
        radius = 2 * tail_norm * assembled.sqrt() + tail_norm * tail_norm
        complete = assembled + arb(0, radius.upper())
        assert complete > 0
        moments.append(complete)
        rows.append({
            "order": order,
            "exact_orbit_block": list(EXACT_ORBITS),
            "assembled_exact_block_halfline_norm_square": endpoints(assembled),
            "all_n_ge_7_tail_norm_upper": tail_norm.upper().str(70),
            "complete_halfline_norm_square": endpoints(complete),
        })
    envelopes.append({
        "tail_ratio_claim": "(8/7)^25*exp(-15*pi)<1/2 for all orders 0..11 and n>=7",
        "tail_ratio_bound_arb": tail_ratio_bound.str(),
        "geometric_tail_multiplier": "1/(1-ratio)<2",
    })
    return moments, rows, envelopes


def ldl_decompose(matrix: list[list[arb]]) -> tuple[list[list[arb]], list[arb]]:
    size = len(matrix)
    lower = [[arb(0) for _ in range(size)] for _ in range(size)]
    diagonal: list[arb] = []
    for row in range(size):
        lower[row][row] = arb(1)
        pivot = matrix[row][row] - sum(
            (lower[row][k] ** 2 * diagonal[k] for k in range(row)), arb(0)
        )
        assert pivot > 0
        diagonal.append(pivot)
        for next_row in range(row + 1, size):
            numerator = matrix[next_row][row] - sum(
                (
                    lower[next_row][k] * lower[row][k] * diagonal[k]
                    for k in range(row)
                ),
                arb(0),
            )
            lower[next_row][row] = numerator / pivot
    return lower, diagonal


def ldl_solve(lower: list[list[arb]], diagonal: list[arb], rhs: list[arb]) -> list[arb]:
    size = len(rhs)
    forward: list[arb] = []
    for row in range(size):
        forward.append(rhs[row] - sum(
            (lower[row][k] * forward[k] for k in range(row)), arb(0)
        ))
    scaled = [forward[i] / diagonal[i] for i in range(size)]
    solution = [arb(0) for _ in range(size)]
    for row in range(size - 1, -1, -1):
        solution[row] = scaled[row] - sum(
            (lower[k][row] * solution[k] for k in range(row + 1, size)), arb(0)
        )
    return solution


def derivative(polynomial: dict[int, arb], count: int = 1) -> dict[int, arb]:
    result = polynomial
    for _ in range(count):
        result = {degree - 1: degree * coefficient for degree, coefficient in result.items() if degree}
    return result


def times_t(polynomial: dict[int, arb]) -> dict[int, arb]:
    return {degree + 1: coefficient for degree, coefficient in polynomial.items()}


def positive_inner(
    left: dict[int, arb], right: dict[int, arb], moments: list[arb]
) -> arb:
    total = arb(0)
    for left_degree, left_coefficient in left.items():
        for right_degree, right_coefficient in right.items():
            assert (left_degree + right_degree) % 2 == 0
            total += (
                left_coefficient
                * right_coefficient
                * moments[(left_degree + right_degree) // 2]
            )
    return total


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=DEFAULT_PRECISION_BITS)
    args = parser.parse_args()
    assert 320 <= args.precision_bits <= 1024
    ctx.prec = args.precision_bits

    root = args.root.resolve()
    output_path = args.output.resolve()
    try:
        output_display = str(output_path.relative_to(root))
    except ValueError:
        output_display = str(output_path)
    helper_path = root / HELPER_REL
    target_path = root / TARGET_REL
    proof_path = root / PROOF_REL
    manifest_path = root / MANIFEST_REL
    audit_path = root / AUDIT_REL
    script_path = Path(__file__).resolve()
    assert digest(helper_path) == EXPECTED_HELPER_SHA256
    assert digest(target_path) == EXPECTED_TARGET_SHA256
    assert digest(proof_path) == EXPECTED_PROOF_SHA256
    assert digest(manifest_path) == EXPECTED_MANIFEST_SHA256
    assert digest(audit_path) == EXPECTED_AUDIT_SHA256
    helper = load_helper(helper_path)

    target_payload = json.loads(target_path.read_text(encoding="utf-8"))
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

    old_hankel = [
        [target_moments[i + j] for j in range(RESIDUAL_N)]
        for i in range(RESIDUAL_N)
    ]
    target_column = [target_moments[i + RESIDUAL_N] for i in range(RESIDUAL_N)]
    lower, pivots = ldl_decompose(old_hankel)
    coefficients = ldl_solve(lower, pivots, [-entry for entry in target_column])
    signed_target_pivot = target_moments[2 * RESIDUAL_N] + sum(
        (target_column[index] * coefficients[index] for index in range(RESIDUAL_N)),
        arb(0),
    )
    assert signed_target_pivot > arb("1e16")

    q = {2 * index: coefficient for index, coefficient in enumerate(coefficients)}
    q[2 * RESIDUAL_N] = arb(1)
    positive_moments, positive_rows, envelope_rows = complete_positive_moments(helper)
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
    cap = A * R0 * R0 / G
    cap_slack = cap - V
    F = (A * C + E * (A - B)) ** 2 - Delta * G
    H_halfline = F / (4 * A * Delta)
    assert A > 0 and Delta > 0 and G > 0 and V > 0 and cap > 0
    assert cap_slack < arb("-8e16")
    assert F < arb("-1e67")
    assert H_halfline < arb("-1e14")

    scalar_values = {
        "A": A, "B": B, "C": C, "D": D, "E": E,
        "Delta": Delta, "G=A^2-B^2": G,
        "R0=C+E-EB/A": R0, "V=D-E^2/A": V,
        "reverse_schur_cap=A*R0^2/G": cap,
        "cap_minus_V": cap_slack,
        "F": F, "H_halfline": H_halfline,
    }

    receipt = {
        "schema_version": "zsv.reverse_schur_actual_failure.v1",
        "status": "PASS",
        "scope": (
            "Actual complete-theta even residual (N,epsilon)=(5,0): "
            "strict reverse-Schur auxiliary failure with strict positive signed target pivot"
        ),
        "runtime": {
            "python": sys.version,
            "python_executable": sys.executable,
            "python_flint": flint.__version__,
            "arb_precision_bits": args.precision_bits,
            "network_used": False,
            "quadrature_used": False,
            "finite_orbit_substitution_used": False,
            "exact_orbit_block": list(EXACT_ORBITS),
            "analytic_tail": "all theta orbits n>=7",
            "derivative_orders": list(range(MAX_DERIVATIVE_ORDER + 1)),
        },
        "normalization": {
            "target_archive": "mu_j=4^j*M_j; padding precedes exact division",
            "positive_boxes": "n_j=||psi^(j)||^2 on h>=0",
            "spectral_positive_moments": "m_j=4*pi*n_j",
            "homogeneity": "common 4*pi scaling preserves signs of F, H, and cap-V",
        },
        "provenance": {
            "verifier": str(script_path.relative_to(root)),
            "verifier_sha256": digest(script_path),
            "orbit_helper": HELPER_REL,
            "orbit_helper_sha256": digest(helper_path),
            "target_certificate": TARGET_REL,
            "target_certificate_sha256": digest(target_path),
            "normalization_proof": PROOF_REL,
            "normalization_proof_sha256": digest(proof_path),
            "normalization_manifest": MANIFEST_REL,
            "normalization_manifest_sha256": digest(manifest_path),
            "full_split_audit": AUDIT_REL,
            "full_split_audit_sha256": digest(audit_path),
        },
        "replay": {
            "working_directory": "checkpoint root",
            "command": (
                "<arb-python> workstreams/all-degree-analytic-search-next-v1/src/"
                "verify_reverse_schur_actual_failure.py --root . --precision-bits "
                f"{args.precision_bits} --output {output_display}"
            ),
        },
        "target_moments": target_rows,
        "old_even_hankel_ldl_pivots": [endpoints(value) for value in pivots],
        "actual_residual": {
            "q": "t^10+p4*t^8+p3*t^6+p2*t^4+p1*t^2+p0",
            "coefficients_ascending_even_powers": [
                endpoints(coefficients[index]) for index in range(RESIDUAL_N)
            ] + [endpoints(arb(1))],
            "signed_target_pivot": endpoints(signed_target_pivot),
            "signed_target_pivot_strictly_positive": True,
        },
        "derivative_tail_envelopes": envelope_rows,
        "complete_positive_moments": positive_rows,
        "reverse_schur_evaluation": {
            key: endpoints(value) for key, value in scalar_values.items()
        },
        "strict_conclusion": {
            "old_even_target_prefix_positive_definite": True,
            "actual_signed_target_pivot_positive": True,
            "unresolved_reverse_schur_branch_G_positive": True,
            "reverse_schur_cap_fails": True,
            "two_generator_auxiliary_H_negative": True,
        },
        "nonclaims": [
            "This does not make the actual signed theta pivot negative; the replay proves it is positive.",
            "This does not disprove the first Xi-Laguerre inequality, an all-degree target theorem, or RH.",
            "This retires the proposed all-degree reverse-Schur auxiliary, not the signed-cell or other correlated routes.",
        ],
    }
    canonical = json.dumps(receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    receipt["receipt_integrity"] = {
        "definition": "sha256 of canonical compact sorted JSON with receipt_integrity omitted",
        "payload_sha256": hashlib.sha256(canonical).hexdigest(),
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": "PASS",
        "output": output_display,
        "signed_target_pivot_lower": signed_target_pivot.lower().str(40),
        "cap_minus_V_upper": cap_slack.upper().str(40),
        "H_halfline_upper": H_halfline.upper().str(40),
        "source_sha256": digest(script_path),
        "payload_sha256": receipt["receipt_integrity"]["payload_sha256"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
