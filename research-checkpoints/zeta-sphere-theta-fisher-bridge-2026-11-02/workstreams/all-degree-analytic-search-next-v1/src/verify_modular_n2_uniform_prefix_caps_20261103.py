#!/usr/bin/env python3
"""Replay the uniform current-prefix caps used by the N=2 modular payment.

This checker performs no quadrature.  It binds and compares the frozen
all-shift integrated-H5 author/audit receipts, reads the independent endpoint
M0 enclosure, and checks the exact rational coefficient bounds.
"""

from __future__ import annotations

import argparse
from decimal import Decimal
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re


SOURCES = {
    "evidence/v18-curated/integrated_h5_v1/INTEGRATED_H5_PROOF.md":
        "542554d5a588830800acf3667b906dc9dc86da4386962ca824c8d596f4aa7c8e",
    "evidence/v18-curated/integrated_h5_v1/certificate.json":
        "ad3dfbd3951d9527a8e42ff27345ccefcfee9c7475324f05d1cfcc260312befa",
    "evidence/v18-curated/post_v7_audit/integrated_h5/AUDIT.md":
        "7e2cf243ec95fd7e0de427468ff4c678738edd48f4f436a7f13553191fda2985",
    "evidence/v18-curated/post_v7_audit/integrated_h5/certificate.json":
        "5d9ac75443a3efee78cc8b29788e5292c008652724db8bbfb6036c73408ee8b2",
    "evidence/v31-continuation/theta_correlated_local_v1/integrated_square_payment_64000.json":
        "bd25296a2bd9d739fdc6463167198738dd60785ca6fa3ebbec941ba6c423d17e",
    "workstreams/all-degree-analytic-search-next-v1/MODULAR_N1_FULL_INTERVAL_PAYMENT_NEXT.md":
        "75c1b743e8a067f450c67fd5a919980ef7130120026aeee91ea63c10fc89b64a",
    "workstreams/all-degree-analytic-search-next-v1/MODULAR_N2_CUBIC_RESERVE_PAYMENT_MAP_20261103.md":
        "afb6431055e8167fdb9ef30e61e01195cfd557cfec91d2114d062f27daee9c93",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def arb_lower(text: str) -> Decimal:
    match = re.fullmatch(r"\[([^ ]+) \+/- ([^\]]+)\]", text)
    if match is None:
        raise AssertionError(f"unrecognized Arb interval: {text!r}")
    midpoint = Decimal(match.group(1))
    radius = Decimal(match.group(2))
    if radius < 0:
        raise AssertionError("negative Arb radius")
    return midpoint - radius


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    root = args.root.resolve()
    checkpoint = (
        root
        if (root / "evidence").is_dir() and (root / "workstreams").is_dir()
        else root / "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
    )
    observed = {}
    for relative, expected in SOURCES.items():
        actual = sha256(checkpoint / relative)
        if actual != expected:
            raise AssertionError(
                f"frozen input hash mismatch for {relative}: {actual} != {expected}"
            )
        observed[relative] = actual

    author = json.loads(
        (checkpoint / "evidence/v18-curated/integrated_h5_v1/certificate.json").read_text()
    )
    audit = json.loads(
        (
            checkpoint
            / "evidence/v18-curated/post_v7_audit/integrated_h5/certificate.json"
        ).read_text()
    )
    for key in ("rows", "orders", "shift_bins"):
        if author[key] != audit[key]:
            raise AssertionError(f"author/audit integrated-H5 mismatch in {key}")
    if author["orders"] != [2, 6, 10, 4, 8]:
        raise AssertionError("unexpected integrated-H5 moment ordering")
    rows = author["rows"]
    if len(rows) != 12 or [row["bin"] for row in rows] != list(range(12)):
        raise AssertionError("integrated-H5 shift coverage changed")
    if not all(row.get("pass") is True for row in rows):
        raise AssertionError("integrated-H5 receipt contains a failed bin")

    # orders=[2,6,10,4,8], so entries zero and three are mu_1 and mu_2.
    mu1_lowers = [Decimal(row["mu_intervals"][0][0]) for row in rows]
    mu1_uppers = [Decimal(row["mu_intervals"][0][1]) for row in rows]
    mu2_uppers = [Decimal(row["mu_intervals"][3][1]) for row in rows]
    mu1_lower = min(mu1_lowers)
    mu1_upper = max(mu1_uppers)
    mu2_upper = max(mu2_uppers)
    if not mu1_lower > Decimal(147) / Decimal(100):
        raise AssertionError("mu1 lower cap failed")
    if not mu1_upper < Decimal(3) / Decimal(2):
        raise AssertionError("mu1 upper cap failed")
    if not mu2_upper < Decimal(209):
        raise AssertionError("mu2 upper cap failed")

    square = json.loads(
        (
            checkpoint
            / "evidence/v31-continuation/theta_correlated_local_v1/integrated_square_payment_64000.json"
        ).read_text()
    )
    m0_lower = arb_lower(square["moments"]["0"]["lo"])
    if not m0_lower > Decimal(1) / Decimal(32):
        raise AssertionError("endpoint M0 > 1/32 failed")

    b1_upper = Fraction(3, 2) / (4 * Fraction(1, 32))
    b2_upper = Fraction(209) / (4 * Fraction(147, 100)) - Fraction(17, 2)
    if b1_upper != 12 or not b2_upper == Fraction(7951, 294):
        raise AssertionError("prefix-cap rational simplification failed")
    if not b2_upper < 30:
        raise AssertionError("b2 cap does not close")

    x_lower = Fraction(627, 4) / Fraction(12) ** 2
    x_upper = Fraction(30) / Fraction(17, 2)
    y_upper = Fraction(4) * Fraction(1, 4) ** 2 / Fraction(17, 2)
    if (x_lower, x_upper, y_upper) != (
        Fraction(209, 192), Fraction(60, 17), Fraction(1, 34)
    ):
        raise AssertionError("reflection rectangle simplification failed")

    def reflection_bound(x: Fraction, y: Fraction) -> Fraction:
        return 4 + x + Fraction(4, 1) / x + 2 * y + (y * y + 5 * y) / x

    endpoint_values = [
        reflection_bound(x_lower, y_upper),
        reflection_bound(x_upper, y_upper),
    ]
    if endpoint_values != [Fraction(103884673, 11596992), Fraction(7151, 816)]:
        raise AssertionError("reflection endpoint values changed")
    if not all(value < 9 for value in endpoint_values):
        raise AssertionError("kappa2/a < 9 failed")

    note = (
        checkpoint
        / "workstreams/all-degree-analytic-search-next-v1/MODULAR_N2_UNIFORM_PREFIX_CAPS_20261103.md"
    )
    payload = {
        "schema_version": "zsv.modular_n2_uniform_prefix_caps.20261103.v1",
        "status": "PASS",
        "scope": (
            "Uniform current-prefix bounds b1<12, b2<30, and kappa2/a<9 on "
            "0<a<=1/4; no Q2-minus bound, strong-payment, higher-degree, "
            "all-degree, or RH claim."
        ),
        "frozen_inputs": observed,
        "author_audit_rows_identical": True,
        "directed_receipt_bounds": {
            "mu1_lower": str(mu1_lower),
            "mu1_upper": str(mu1_upper),
            "mu2_upper": str(mu2_upper),
            "M0_lower": str(m0_lower),
        },
        "rational_caps": {
            "mu1_lower_used": "147/100",
            "mu1_upper_used": "3/2",
            "mu2_upper_used": "209",
            "M0_lower_used": "1/32",
            "b1_upper": str(b1_upper),
            "b2_upper": f"{b2_upper.numerator}/{b2_upper.denominator}",
            "x_lower": "209/192",
            "x_upper": "60/17",
            "y_upper": "1/34",
            "reflection_endpoint_values": [
                f"{value.numerator}/{value.denominator}" for value in endpoint_values
            ],
            "kappa2_over_a_upper": "9 (strict)",
        },
        "proof_note": {
            "path": str(note.relative_to(checkpoint)),
            "sha256": sha256(note),
            "binding": "recorded, not self-frozen by this replay",
        },
        "source_sha256": sha256(Path(__file__).resolve()),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
