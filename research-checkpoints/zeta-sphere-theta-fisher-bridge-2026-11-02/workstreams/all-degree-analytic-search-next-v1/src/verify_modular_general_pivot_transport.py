#!/usr/bin/env python3
"""Verify exact constants for the general pivot-transport checkpoint.

The all-degree coefficient-cancellation and root-deletion identities are
analytic arguments in the accompanying note.  This standard-library checker
binds their audited inputs and rigorously evaluates the explicit real-rooted
H5 obstruction using the frozen directed moment intervals.
"""

from __future__ import annotations

import hashlib
import json
import re
from decimal import Decimal, getcontext
from fractions import Fraction
from pathlib import Path


getcontext().prec = 100


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def arb_endpoints(text: str) -> tuple[Decimal, Decimal]:
    match = re.fullmatch(r"\[([^ ]+) \+/- ([^\]]+)\]", text)
    if match is None:
        raise AssertionError(f"unrecognized Arb interval: {text!r}")
    midpoint = Decimal(match.group(1))
    radius = Decimal(match.group(2))
    if radius < 0:
        raise AssertionError(f"negative Arb radius: {text!r}")
    return midpoint - radius, midpoint + radius


def interval_linear_combination(
    coefficients: list[int], intervals: list[tuple[Decimal, Decimal]]
) -> tuple[Decimal, Decimal]:
    lower = Decimal(0)
    upper = Decimal(0)
    for coefficient, (left, right) in zip(coefficients, intervals):
        if coefficient >= 0:
            lower += coefficient * left
            upper += coefficient * right
        else:
            lower += coefficient * right
            upper += coefficient * left
    return lower, upper


def main() -> int:
    source = Path(__file__).resolve()
    workstream = source.parents[1]
    checkpoint = workstream.parents[1]
    note = workstream / "MODULAR_GENERAL_PIVOT_TRANSPORT_NEXT.md"

    h5_receipt = (
        checkpoint
        / "evidence"
        / "v18-curated"
        / "h4_attack_v1"
        / "pointwise_h5_obstruction.json"
    )
    h5_audit = (
        checkpoint
        / "evidence"
        / "v18-curated"
        / "post_v7_audit"
        / "POINTWISE_H5_AUDIT.md"
    )
    h3_audit = (
        checkpoint
        / "evidence"
        / "v18-curated"
        / "latest_bounds_audit"
        / "H3_AUDIT.md"
    )
    cross_parity_audit = (
        checkpoint
        / "evidence"
        / "v20-v26-continuation"
        / "modular_cd_flux_audit"
        / "CROSS_PARITY_AUDIT.md"
    )
    square_receipt = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "integrated_square_payment_64000.json"
    )
    square_manifest = square_receipt.with_name(
        "INTEGRATED_SQUARE_PAYMENT_FROZEN_SHA256.txt"
    )

    expected_hashes = {
        h5_receipt: "019c6fae03ddc4b5458cc808bb9589ecff69b4d17fecabb7d273fecbdaef7d67",
        h5_audit: "9352ff83e35b9f2bc873f8b7319343f3611731b07611f32c63a406c0260f6704",
        h3_audit: "ff860428451d4fa01108ab611ebd954d9ab3d4b98c6f284ff377ee18a04a6179",
        cross_parity_audit: "1874339a9907495a0983c7b5cd76a1e59b34ad25b83f9e965063a5cc23931740",
        square_receipt: "bd25296a2bd9d739fdc6463167198738dd60785ca6fa3ebbec941ba6c423d17e",
        square_manifest: "8a3cc29068a1b55512ff1eec17f7a05e4e3a4167ce6184416b4bef807a4871ae",
    }
    for path, expected in expected_hashes.items():
        actual = sha256(path)
        if actual != expected:
            raise AssertionError(f"frozen input hash mismatch: {path}: {actual}")

    receipt = json.loads(h5_receipt.read_text())
    moments = [
        (Decimal(left), Decimal(right)) for left, right in receipt["moments"]
    ]
    if len(moments) != 6:
        raise AssertionError("expected moments mu_0 through mu_5")

    square = json.loads(square_receipt.read_text())
    if square.get("N") != 64_000 or square.get("bits") != 160:
        raise AssertionError("integrated-square receipt run parameters changed")
    square_lower, _ = arb_endpoints(square["moments"]["0"]["lo"])
    if not square_lower > Decimal(3) / Decimal(100):
        raise AssertionError("complete-theta M0 > 3/100 is not certified")
    expected_square_line = f"{sha256(square_receipt)}  {square_receipt.name}"
    if expected_square_line not in square_manifest.read_text().splitlines():
        raise AssertionError("integrated-square receipt is not frozen by its manifest")

    # w=(c1,c3,c5)=(10847,-263,1).  Expanding w^T M_5 w in
    # mu_1,...,mu_5 gives the following exact integer coefficients.
    c1, c3, c5 = 10847, -263, 1
    moment_coefficients = [
        c1 * c1,
        2 * c1 * c3,
        c3 * c3 + 2 * c1 * c5,
        2 * c3 * c5,
        c5 * c5,
    ]
    quadratic_lower, quadratic_upper = interval_linear_combination(
        moment_coefficients, moments[1:]
    )
    claimed_upper = Decimal(-1_493_000_000)
    if not quadratic_upper < claimed_upper:
        raise AssertionError("explicit H5 direction is not rigorously negative")

    # Physical coefficient vector z satisfies diag(1,1/4,1/16) z=w.
    physical_coefficients = (10847, -1052, 16)
    if physical_coefficients != (c1, 4 * c3, 16 * c5):
        raise AssertionError("physical/Bell coefficient congruence failed")

    # p(t)=t(16 y^2-1052 y+10847), y=t^2.  Positive product and
    # sum plus positive discriminant give two distinct positive y roots.
    discriminant = 1052**2 - 4 * 16 * 10847
    if discriminant != 16 * 25781 or discriminant <= 0:
        raise AssertionError("quintic discriminant check failed")
    if not 1052 > 0 or not 10847 > 0:
        raise AssertionError("quadratic y-root sum/product check failed")

    # Quantitative cubic transport constants.
    cubic_ratio = Fraction(17**3, 4)
    sigma0_lower = Fraction(3, 50)
    cubic_over_a_lower = cubic_ratio * sigma0_lower
    if cubic_ratio != Fraction(4913, 4):
        raise AssertionError("cubic s3/s0 ratio simplification failed")
    if cubic_over_a_lower != Fraction(14739, 200):
        raise AssertionError("cubic s3/a lower simplification failed")

    result = {
        "status": "PASS",
        "scope": (
            "Exact constants and frozen-input checks for general coefficient "
            "cancellation, cubic transport, and a pointwise real-rooted H5 "
            "route obstruction; no integrated degree-five failure, all-degree, "
            "or RH claim."
        ),
        "checks": [
            "frozen H3, H5, cross-parity, and integrated-square input hashes",
            "complete-theta M0 > 3/100 from the frozen directed receipt",
            "w^T M5 w < -1493000000 by directed interval arithmetic",
            "physical/Bell diagonal congruence",
            "real-simple-root quintic discriminant",
            "cubic ratio 17^3/4=4913/4",
            "cubic raw lower (4913/4)*(3/50)=14739/200",
        ],
        "frozen_inputs": {
            str(path.relative_to(checkpoint)): digest
            for path, digest in expected_hashes.items()
        },
        "h5_obstruction": {
            "bell_vector": [c1, c3, c5],
            "physical_polynomial": "16*t^5 - 1052*t^3 + 10847*t",
            "quadratic_interval_lower": str(quadratic_lower),
            "quadratic_interval_upper": str(quadratic_upper),
            "y_discriminant": discriminant,
        },
        "rational_bounds": {
            "s3_over_s0_lower": "4913/4",
            "s3_over_a_lower": "14739/200",
        },
        "proof_note": {
            "path": str(note.relative_to(checkpoint)),
            "sha256": sha256(note),
            "binding": "recorded, not self-frozen by this replay",
        },
        "source_sha256": sha256(source),
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
