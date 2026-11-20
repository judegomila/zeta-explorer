#!/usr/bin/env python3
"""Certify that adjacent reverse-Turan and Stieltjes positivity do not imply the Schur cap."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys

import flint
from flint import arb, arb_mat, ctx

DEFAULT_PRECISION_BITS = 420
ctx.prec = DEFAULT_PRECISION_BITS
INPUT_REL = "workstreams/all-degree-analytic-search-next-v1/results/following_odd_theta_verification_420.json"
EXPECTED_INPUT_SHA256 = "d48d9dcf06d54256dc6a9e9aef11436cf9e65718317de8b6ceb5a9096e537fe2"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def endpoints(value: arb) -> dict[str, str]:
    return {"lower": value.lower().str(60), "upper": value.upper().str(60), "arb": value.str(45)}


def positive(value: arb, label: str) -> None:
    assert value > 0, f"{label} is not rigorously positive: {value}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--precision-bits", type=int, default=DEFAULT_PRECISION_BITS)
    args = parser.parse_args()
    assert 320 <= args.precision_bits <= 1024
    ctx.prec = args.precision_bits
    root, output = args.root.resolve(), args.output.resolve()
    try:
        output_name = str(output.relative_to(root))
    except ValueError:
        output_name = str(output)
    input_path = root / INPUT_REL
    script_path = Path(__file__).resolve()
    assert digest(input_path) == EXPECTED_INPUT_SHA256
    data = json.loads(input_path.read_text(encoding="utf-8"))
    a, b = arb(data["actual_residual"]["a_arb"]), arb(data["actual_residual"]["b_arb"])
    m = [arb(row["complete_halfline_norm_square_arb"]) for row in data["complete_positive_moments"]]
    assert len(m) == 7
    m6_star = arb(4_500_000_000)

    turan_margins = []
    for j in range(1, 5):
        margin = (2*j+3)*m[j]**2 - (2*j-1)*m[j-1]*m[j+1]
        positive(margin, f"actual reverse-Turan margin j={j}")
        turan_margins.append(margin)
    margin5 = 13*m[5]**2 - 9*m[4]*m6_star
    positive(margin5, "modified reverse-Turan margin j=5")
    positive(m6_star-m[6], "modified moment increase")

    m0, m1, m2, m3, m4, m5, m6 = m
    A = 9*a*a*m2 + 6*a*b*m1 + 30*a*m3 + b*b*m0 + 10*b*m2 + 25*m4
    B = 6*a*a*m2 + 6*a*b*m1 + 26*a*m3 + 20*b*m2 + 20*m4
    C = a*a*m3 + 2*a*b*m2 + 2*a*m4 + b*b*m1 + 2*b*m3 + m5
    E = 3*a*a*m3 + 4*a*b*m2 + 8*a*m4 + b*b*m1 + 6*b*m3 + 5*m5
    Dbar = a*a*m4 + 2*a*b*m3 + 2*a*m5 + b*b*m2 + 2*b*m4
    G, R = A*A-B*B, A*C+E*(A-B)
    positive(A, "A")
    positive(G, "A^2-B^2")
    cap = E*E/A + R*R/(A*G) - Dbar
    turan_upper = arb(13)*m5*m5/(9*m4)
    positive(cap-m6, "actual m6 cap slack")
    positive(m6_star-cap, "modified m6 exceeds cap")

    Dstar = Dbar+m6_star
    Delta, F = A*Dstar-E*E, R*R-(A*Dstar-E*E)*G
    positive(Delta, "modified AD-E^2")
    positive(-F, "modified correlated numerator is negative")

    modified = m[:6]+[m6_star]
    hankel, shifted = [], []
    for size in range(1, 5):
        determinant = arb_mat(size, size, [modified[i+j] for i in range(size) for j in range(size)]).det()
        positive(determinant, f"Hankel determinant size {size}")
        hankel.append(determinant)
    for size in range(1, 4):
        determinant = arb_mat(size, size, [modified[i+j+1] for i in range(size) for j in range(size)]).det()
        positive(determinant, f"shifted Hankel determinant size {size}")
        shifted.append(determinant)

    receipt = {
        "schema_version": "zsv.theta_turan_schur_no_go.v1",
        "status": "PASS",
        "scope": "Adjacent reverse-Turan bounds through j=5 plus strict truncated Stieltjes geometry do not imply the correlated reverse-Schur cap.",
        "runtime": {"python": sys.version, "python_executable": sys.executable, "python_flint": flint.__version__, "arb_precision_bits": args.precision_bits, "network_used": False},
        "provenance": {"verifier": str(script_path.relative_to(root)), "verifier_sha256": digest(script_path), "input_receipt": INPUT_REL, "input_receipt_sha256": digest(input_path)},
        "replay": {"command": f"<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_theta_turan_schur_no_go.py --root . --precision-bits {args.precision_bits} --output {output_name}"},
        "normalization": {"moments": "n_j=||psi^(j)||^2 on h>=0", "spectral_relation": "m_j=4*pi*n_j", "invariance": "all tested signs and normalized ratios are invariant under common 4*pi scaling"},
        "actual_residual": {"a": endpoints(a), "b": endpoints(b)},
        "actual_halfline_moments": [endpoints(value) for value in m],
        "actual_reverse_turan_margins_j1_through_j4": [endpoints(value) for value in turan_margins],
        "modified_newest_moment": {
            "m6_star_exact": "4500000000", "j5_reverse_turan_margin": endpoints(margin5),
            "actual_m6": endpoints(m6), "correlated_cap": endpoints(cap), "adjacent_turan_upper": endpoints(turan_upper),
            "actual_normalized": endpoints(m6*m4/m5**2), "cap_normalized": endpoints(cap*m4/m5**2), "adjacent_turan_constant": "13/9"
        },
        "positive_moment_geometry": {
            "Hankel_leading_determinants_sizes_1_to_4": [endpoints(value) for value in hankel],
            "shifted_Hankel_leading_determinants_sizes_1_to_3": [endpoints(value) for value in shifted],
            "strict_truncated_Stieltjes_interior": True
        },
        "correlated_failure": {"Delta_star": endpoints(Delta), "F_star": endpoints(F), "strict_reverse_schur_failure": True},
        "nonclaims": [
            "The modified m6 is not asserted to be the complete-theta moment.",
            "This is a non-implication theorem, not a theta pivot sign.",
            "No all-degree theorem, first Xi-Laguerre inequality, or RH statement is proved."
        ]
    }
    canonical = json.dumps(receipt, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    receipt["receipt_integrity"] = {"definition": "sha256 of canonical compact sorted JSON with receipt_integrity omitted", "payload_sha256": hashlib.sha256(canonical).hexdigest()}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(receipt, indent=2, sort_keys=True)+"\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "output": output_name, "cap_upper": cap.upper().str(30), "turan_upper_lower": turan_upper.lower().str(30), "F_upper": F.upper().str(30), "source_sha256": digest(script_path), "payload_sha256": receipt["receipt_integrity"]["payload_sha256"]}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
