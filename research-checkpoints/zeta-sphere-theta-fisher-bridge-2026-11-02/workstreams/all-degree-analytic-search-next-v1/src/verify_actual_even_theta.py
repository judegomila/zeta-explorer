#!/usr/bin/env python3
"""Replay the actual complete-theta (N,epsilon)=(2,0) Sobolev auxiliary."""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

import flint
from flint import arb, ctx


PRECISION_BITS = 300
ctx.prec = PRECISION_BITS
TARGET_REL = "evidence/v18-curated/core_inertia_v2/actual_total_certificate.json"
TARGET_GEN_REL = "evidence/v18-curated/core_inertia_v2/certify_actual_tail.py"
TARGET_PROOF_REL = "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_PROOF.md"
TARGET_MANIFEST_REL = "evidence/v18-curated/core_inertia_v2/ACTUAL_REPAIR_FROZEN_SHA256.txt"
ODD_VERIFY_REL = "workstreams/all-degree-analytic-search-next-v1/src/verify_next_odd_theta.py"
ACTUAL_VERIFY_REL = "workstreams/all-degree-analytic-search-next-v1/src/verify_actual_even_theta.py"
EXPECTED_TARGET_SHA = "80ccd716236e5d7686dcbfdd3b90c4fb879ec091bf963ec71cb3e9283f5b5361"
EXPECTED_GEN_SHA = "7d26a3265be6c304db574b61e3f5b60c19e12ec1a3c57267e6ee5b15b43b43ec"
EXPECTED_PROOF_SHA = "f6b3d0d7b4322104bd68a2ad01a85039eeab40c1939c9dd9d2672a1bac9f7a06"
EXPECTED_SCOPE = "Full theta normalized a=0 full moments via reflected identity"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def exact(value: str | int | Fraction) -> arb:
    value = Fraction(value)
    return arb(value.numerator) / value.denominator


def interval(lo: str, hi: str, padded: bool = False) -> arb:
    left, right = exact(lo), exact(hi)
    assert left < right
    if padded:
        pad = exact(Fraction(1, 10**90)) * (1 + abs(left) + abs(right))
        left -= pad
        right += pad
    return (left + right) / 2 + arb(0, ((right - left) / 2).upper())


def endpoints(value: arb) -> dict[str, str]:
    return {
        "lower": value.lower().str(90),
        "upper": value.upper().str(90),
        "arb": value.str(50),
    }


def import_odd(path: Path):
    spec = importlib.util.spec_from_file_location("verify_next_odd_theta", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def p5_polynomial(odd) -> list[Fraction]:
    p5 = odd.next_derivative_polynomial(odd.derivative_polynomials()[4])
    assert p5 == [
        Fraction(0), Fraction(-9375, 32), Fraction(142935, 16),
        Fraction(-126121, 4), Fraction(30510), Fraction(-10720),
        Fraction(1456), Fraction(-64),
    ]
    # Pairwise coefficient groupings prove -64*z^7<P5(z)<0 on z>=27.
    thresholds = [
        Fraction(1456, 64), Fraction(30510, 10720),
        Fraction(142935, 4 * 126121), Fraction(10720, 1456),
        Fraction(126121, 4 * 30510), Fraction(9375, 2 * 142935),
    ]
    assert all(item < 27 for item in thresholds)
    assert 9 * arb.pi() > 27
    return p5


def positive_moments(odd) -> tuple[list[arb], list[dict[str, object]]]:
    polynomials = odd.derivative_polynomials() + [p5_polynomial(odd)]
    assert (arb(4) / 3) ** 13 * (-7 * arb.pi()).exp() < arb(1) / 2
    coarse = [
        ("0.638", "0.641"), ("6.50", "6.56"), ("190", "193"),
        ("8900", "9050"), ("558000", "569000"),
        ("42000000", "46000000"),
    ]
    moments, rows = [], []
    for order, polynomial in enumerate(polynomials):
        first_two = (
            odd.orbit_gram(polynomial, 1, 1)
            + 2 * odd.orbit_gram(polynomial, 1, 2)
            + odd.orbit_gram(polynomial, 2, 2)
        )
        assert first_two.lower() > 0
        tail = 2 * odd.remaining_orbit_bound(order, 3)
        radius = 2 * tail * first_two.sqrt() + tail * tail
        complete = first_two + arb(0, radius.upper())
        assert interval(*coarse[order]).contains(complete)
        moments.append(complete)
        rows.append({
            "order": order,
            "first_two_orbit_norm_square": endpoints(first_two),
            "all_n_ge_3_tail_norm_upper": tail.upper().str(90),
            "complete_halfline_norm_square": endpoints(complete),
        })
    return moments, rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = args.checkpoint_root.resolve()
    target_path, generator_path = root / TARGET_REL, root / TARGET_GEN_REL
    proof_path, manifest_path = root / TARGET_PROOF_REL, root / TARGET_MANIFEST_REL
    odd_path = root / ODD_VERIFY_REL
    assert digest(target_path) == EXPECTED_TARGET_SHA
    assert digest(generator_path) == EXPECTED_GEN_SHA
    assert digest(proof_path) == EXPECTED_PROOF_SHA
    manifest = manifest_path.read_text(encoding="utf-8")
    assert f"{EXPECTED_TARGET_SHA}  actual_total_certificate.json" in manifest
    assert f"{EXPECTED_GEN_SHA}  certify_actual_tail.py" in manifest

    target = json.loads(target_path.read_text(encoding="utf-8"))
    assert target["scope"] == EXPECTED_SCOPE
    # The archive stores mu_j=4^j*M_j; each decimal endpoint also receives
    # the padding prescribed by ACTUAL_REPAIR_PROOF.md.
    mu = [interval(*row, padded=True) for row in target["moments"][:4]]
    M = [value / 4**order for order, value in enumerate(mu)]
    M0, M1, M2, M3 = M
    assert M0.lower() > 0
    old_det = M0 * M2 - M1 * M1
    assert old_det.lower() > 0
    a = (M1 * M2 - M0 * M3) / old_det
    b = (M1 * M3 - M2 * M2) / old_det

    odd = import_odd(odd_path)
    moments, moment_rows = positive_moments(odd)
    m0, m1, m2, m3, m4, m5 = moments
    A = 4*a*a*m1 + 16*a*m2 + 16*m3
    B = 2*a*b*m0 + 14*a*m2 + (2*a*a + 12*b)*m1 + 12*m3
    C = b*b*m0 + 2*a*b*m1 + (a*a + 2*b)*m2 + 2*a*m3 + m4
    D = b*b*m1 + 2*a*b*m2 + (a*a + 2*b)*m3 + 2*a*m4 + m5
    E = 2*a*b*m1 + (2*a*a + 4*b)*m2 + 6*a*m3 + 4*m4
    Delta = A*D - E*E
    u, v = -(A+B)/2, -(C+2*E)/2
    N = D*u*u - 2*E*u*v + A*v*v + u*Delta
    H_n = N / Delta
    H_original = 4 * arb.pi() * H_n
    assert A.lower() > 0 and Delta.lower() > 0
    assert N.lower() > 0 and H_n.lower() > 0 and H_original.lower() > 0

    values = {
        "old_signed_determinant": old_det, "residual_a": a, "residual_b": b,
        "A_n": A, "B_n": B, "C_n": C, "D_n": D, "E_n": E,
        "Delta_n": Delta, "u_n": u, "v_n": v, "N_n": N,
        "H_n": H_n, "H_original": H_original,
    }
    receipt = {
        "schema_version": "zsv.actual_even_theta_sobolev.v1",
        "status": "pass",
        "scope": "Actual complete-theta (N,epsilon)=(2,0) two-generator condition.",
        "nonclaims": [
            "No coefficient-free bivariate condition is proved.",
            "No higher-rung or all-degree theorem is proved.",
            "No first Xi-Laguerre theorem or RH is proved.",
        ],
        "runtime": {
            "python": sys.version.split()[0], "python_executable": sys.executable,
            "python_flint": flint.__version__, "arb_precision_bits": PRECISION_BITS,
            "network_used": False, "quadrature_used": False,
            "finite_orbit_substitution_used": False,
        },
        "provenance": {
            "actual_even_verifier": ACTUAL_VERIFY_REL,
            "actual_even_verifier_sha256": digest(Path(__file__).resolve()),
            "target_certificate": TARGET_REL, "target_sha256": digest(target_path),
            "target_generator": TARGET_GEN_REL, "target_generator_sha256": digest(generator_path),
            "target_proof": TARGET_PROOF_REL, "target_proof_sha256": digest(proof_path),
            "target_manifest": TARGET_MANIFEST_REL,
            "positive_moment_verifier": ODD_VERIFY_REL,
            "positive_moment_verifier_sha256": digest(odd_path),
        },
        "replay": {
            "command": (
                "<arb-python> " + ACTUAL_VERIFY_REL
                + " --checkpoint-root <checkpoint-root>"
                + " --output workstreams/all-degree-analytic-search-next-v1/results/"
                + "actual_even_theta_sobolev.json"
            ),
        },
        "normalization": {
            "target_archive": "mu_j=4^j*M_j; rescaled before residual construction",
            "positive_boxes": "n_j=||psi^(j)||^2 on h>=0",
            "original_positive_moments": "m_j=4*pi*n_j",
            "homogeneity": "Delta[m]=(4*pi)^2 Delta[n], N[m]=(4*pi)^3 N[n], H[m]=4*pi H[n]",
        },
        "complete_positive_moments": moment_rows,
        "correlated_evaluation": {key: endpoints(value) for key, value in values.items()},
        "conclusion": {
            "old_signed_block_positive": True, "actual_residual_used": True,
            "Delta_positive": True, "N_positive": True,
            "two_generator_margin_positive": True,
            "actual_even_2_0_pivot_strictly_positive": True,
        },
    }
    payload = json.dumps(receipt, sort_keys=True, separators=(",", ":")).encode()
    receipt["payload_sha256_before_self_hash"] = hashlib.sha256(payload).hexdigest()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(receipt, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "status": "pass", "output": str(args.output),
        "N_lower": N.lower().str(60),
        "H_original_lower": H_original.lower().str(60),
        "payload_sha256": receipt["payload_sha256_before_self_hash"],
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
