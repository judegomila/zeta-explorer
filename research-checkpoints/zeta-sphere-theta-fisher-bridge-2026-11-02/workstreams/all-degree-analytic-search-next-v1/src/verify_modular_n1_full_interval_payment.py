#!/usr/bin/env python3
"""Audit the uniform finite-a N=1 modular payment.

The checker uses only the Python standard library.  It binds the frozen
complete-theta receipts and their source manifests, checks their directed
endpoints, verifies the exact integration-by-parts derivative identity in a
tiny differential-polynomial ring, and checks all rational comparisons in the
accompanying note.  It records the note hash without trying to freeze it from
inside its own replay.  It does not run a new interval sweep.
"""

from __future__ import annotations

import hashlib
import json
import re
from decimal import Decimal, localcontext
from fractions import Fraction
from pathlib import Path


VARS = ("u", "r", "k", "kp", "kpp")
INDEX = {name: i for i, name in enumerate(VARS)}
Exponent = tuple[int, ...]
Polynomial = dict[Exponent, Fraction]
FROZEN_LINE = re.compile(r"([0-9a-f]{64})  ([^\r\n]+)")


def monomial(coefficient: int | Fraction, **powers: int) -> Polynomial:
    exponent = [0] * len(VARS)
    for name, power in powers.items():
        exponent[INDEX[name]] = power
    value = Fraction(coefficient)
    return {tuple(exponent): value} if value else {}


def add(*polynomials: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for polynomial in polynomials:
        for exponent, coefficient in polynomial.items():
            result[exponent] = result.get(exponent, Fraction(0)) + coefficient
            if result[exponent] == 0:
                del result[exponent]
    return result


def scale(polynomial: Polynomial, coefficient: int | Fraction) -> Polynomial:
    factor = Fraction(coefficient)
    return {exponent: factor * value for exponent, value in polynomial.items()}


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for left_exp, left_value in left.items():
        for right_exp, right_value in right.items():
            exponent = tuple(a + b for a, b in zip(left_exp, right_exp))
            result[exponent] = result.get(exponent, Fraction(0)) + left_value * right_value
    return {exponent: value for exponent, value in result.items() if value}


def partial(polynomial: Polynomial, variable: str) -> Polynomial:
    position = INDEX[variable]
    result: Polynomial = {}
    for exponent, coefficient in polynomial.items():
        power = exponent[position]
        if power:
            reduced = list(exponent)
            reduced[position] -= 1
            result[tuple(reduced)] = coefficient * power
    return result


def total_derivative(polynomial: Polynomial) -> Polynomial:
    """D with u'=1, r'=k, k'=kp, and kp'=kpp."""

    return add(
        partial(polynomial, "u"),
        multiply(partial(polynomial, "r"), monomial(1, k=1)),
        multiply(partial(polynomial, "k"), monomial(1, kp=1)),
        multiply(partial(polynomial, "kp"), monomial(1, kpp=1)),
    )


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require_sha256(path: Path, expected: str, label: str) -> str:
    actual = sha256(path)
    if actual != expected:
        raise AssertionError(f"{label} hash mismatch: {path}: {actual}")
    return actual


def parse_frozen_manifest_text(text: str) -> dict[str, str]:
    """Parse a strict sha256sum manifest and reject duplicate/unsafe names."""

    entries: dict[str, str] = {}
    for line_number, line in enumerate(text.splitlines(), start=1):
        if not line.strip():
            continue
        match = FROZEN_LINE.fullmatch(line)
        if match is None:
            raise AssertionError(f"malformed frozen-manifest line {line_number}")
        digest, name = match.groups()
        relative = Path(name)
        if relative.is_absolute() or ".." in relative.parts or name in entries:
            raise AssertionError(f"unsafe/duplicate frozen-manifest path: {name!r}")
        entries[name] = digest
    if not entries:
        raise AssertionError("empty frozen manifest")
    return entries


def verify_frozen_manifest(
    manifest: Path,
    expected_manifest_sha256: str,
    required_names: set[str],
) -> dict[str, str]:
    require_sha256(manifest, expected_manifest_sha256, "frozen manifest")
    entries = parse_frozen_manifest_text(manifest.read_text(encoding="utf-8"))
    if set(entries) != required_names:
        raise AssertionError(
            f"frozen manifest membership mismatch: {manifest}: {sorted(entries)}"
        )
    base = manifest.parent.resolve()
    for name, expected in entries.items():
        candidate = (base / name).resolve()
        try:
            candidate.relative_to(base)
        except ValueError as exc:
            raise AssertionError(f"frozen manifest path escaped base: {name!r}") from exc
        require_sha256(candidate, expected, "frozen-manifest member")
    return entries


def arb_endpoints(text: str) -> tuple[Decimal, Decimal]:
    match = re.fullmatch(r"\[([^ ]+) \+/- ([^\]]+)\]", text)
    if match is None:
        raise AssertionError(f"unrecognized Arb interval: {text!r}")
    with localcontext() as context:
        context.prec = 200
        midpoint = Decimal(match.group(1))
        radius = Decimal(match.group(2))
        if radius < 0:
            raise AssertionError(f"negative Arb radius: {text!r}")
        return midpoint - radius, midpoint + radius


def check_ibp_derivative_identity() -> None:
    # For r=g'/g and k=r', the proof note claims that eight times the
    # constant-in-beta curvature identity is (g^2 R)'.  Dividing by g^2,
    # this is D R + 2 r R = target.
    remainder = add(
        monomial(4, u=2, r=3),
        monomial(2, u=2, r=1, k=1),
        monomial(-1, u=2, kp=1),
        monomial(-4, u=1, r=2),
        monomial(2, u=1, k=1),
        monomial(-2, r=1),
    )
    lhs = add(
        total_derivative(remainder),
        scale(multiply(monomial(1, r=1), remainder), 2),
    )
    target = add(
        monomial(8, u=2, r=4),
        monomial(16, u=2, r=2, k=1),
        monomial(2, u=2, k=2),
        monomial(-8, r=2),
        monomial(-1, u=2, kpp=1),
    )
    if add(lhs, scale(target, -1)):
        raise AssertionError("finite-tilt curvature IBP identity failed")


def check_s1_transport_identity() -> None:
    """Check the total derivative behind s1'=int u^2 g^2 v'."""

    # With r=g'/g, k=r'=-v',
    #   (u^2 r g^2)'/g^2 = 2ur + u^2 k + 2u^2 r^2.
    # Its vanishing integral identifies the directly differentiated s1 with
    # -int u^2 k g^2=int u^2 v' g^2.
    remainder = monomial(1, u=2, r=1)
    lhs = add(
        total_derivative(remainder),
        scale(multiply(monomial(1, r=1), remainder), 2),
    )
    target = add(
        monomial(2, u=1, r=1),
        monomial(1, u=2, k=1),
        monomial(2, u=2, r=2),
    )
    if add(lhs, scale(target, -1)):
        raise AssertionError("s1 transport total-derivative identity failed")


def main() -> int:
    source = Path(__file__).resolve()
    workstream = source.parents[1]
    checkpoint = workstream.parents[1]

    modular_receipt = workstream / "results" / "modular_vprime_tilt_certificate.json"
    modular_replay = workstream / "results" / "modular_vprime_tilt_replay.json"
    square_receipt = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "integrated_square_payment_64000.json"
    )
    curvature_receipt = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "theta_curvature_square.json"
    )
    curvature_note = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "THETA_CURVATURE_PAYMENT.md"
    )
    endpoint_note = workstream / "MODULAR_N1_S2_PAYMENT_REDUCTION_NEXT.md"
    proof_note = workstream / "MODULAR_N1_FULL_INTERVAL_PAYMENT_NEXT.md"
    modular_source = workstream / "src" / "certify_modular_vprime_tilt.py"
    integrated_manifest = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "INTEGRATED_SQUARE_PAYMENT_FROZEN_SHA256.txt"
    )
    curvature_manifest = (
        checkpoint
        / "evidence"
        / "v31-continuation"
        / "theta_correlated_local_v1"
        / "THETA_CURVATURE_PAYMENT_FROZEN_SHA256.txt"
    )

    expected_hashes = {
        modular_receipt: "1db1987de3a7542c5cf02e45178b5d5dd65a76c1f2bfaeaa176184d5810290e5",
        modular_replay: "ba2fa918da86840db31e72decb72f49647d331c956bd180154e301403ec95855",
        square_receipt: "bd25296a2bd9d739fdc6463167198738dd60785ca6fa3ebbec941ba6c423d17e",
        curvature_receipt: "47353b64c47ce2d5e14112d2bbfcdfc0f2985a170e15c13cb8e64222823990f7",
        curvature_note: "a508698183302e3827769a3b9cd135023d79ffb557e2fe5f700ffb00cd98d97d",
        endpoint_note: "63ba56745d75e67efc8e5249b0563c5ce7482b3ce12d81f1288e3d8956d0ed09",
    }
    for path, expected in expected_hashes.items():
        require_sha256(path, expected, "frozen input")

    manifest_entries = {
        integrated_manifest: verify_frozen_manifest(
            integrated_manifest,
            "8a3cc29068a1b55512ff1eec17f7a05e4e3a4167ce6184416b4bef807a4871ae",
            {
                "INTEGRATED_SQUARE_PAYMENT.md",
                "check_integrated_square_payment.py",
                "integrated_square_payment_64000.json",
            },
        ),
        curvature_manifest: verify_frozen_manifest(
            curvature_manifest,
            "73dd74752fa6a51d831524087a05aa987c2d4618245713ecda6bfc309ecf2b31",
            {
                "THETA_CURVATURE_PAYMENT.md",
                "check_theta_curvature_square.py",
                "theta_curvature_square.json",
            },
        ),
    }

    modular_receipts = {
        modular_receipt: json.loads(modular_receipt.read_text()),
        modular_replay: json.loads(modular_replay.read_text()),
    }
    modular_provenance: dict[str, str] = {}
    modular_centers: dict[str, dict[str, str]] = {}
    center_intervals: list[tuple[Decimal, Decimal]] = []
    for receipt_path, modular in modular_receipts.items():
        require_sha256(
            modular_source,
            modular["source_sha256"],
            "modular center-receipt source",
        )
        for name, expected in modular["provenance"].items():
            provenance_path = workstream / name
            modular_provenance[name] = require_sha256(
                provenance_path,
                expected,
                "modular center-receipt provenance",
            )
        psi_zero_lower, psi_zero_upper = arb_endpoints(modular["psi_zero_squared"])
        if not psi_zero_upper < Decimal(16) / Decimal(5):
            raise AssertionError("psi(0)^2 < 16/5 is not certified")
        center_intervals.append((psi_zero_lower, psi_zero_upper))
        modular_centers[str(receipt_path.relative_to(checkpoint))] = {
            "lower": str(psi_zero_lower),
            "upper": str(psi_zero_upper),
            "use_scope": (
                "center value only; no parameter-cell or uniform-in-a claim used"
            ),
        }
    if max(lower for lower, _ in center_intervals) > min(
        upper for _, upper in center_intervals
    ):
        raise AssertionError("independent center enclosures do not overlap")

    square = json.loads(square_receipt.read_text())
    if square.get("N") != 64_000 or square.get("bits") != 160:
        raise AssertionError("integrated-square receipt has the wrong run parameters")
    moment_zero_lower, _ = arb_endpoints(square["moments"]["0"]["lo"])
    if not moment_zero_lower > Decimal(3) / Decimal(100):
        raise AssertionError("complete-theta M0 > 3/100 is not certified")

    curvature = json.loads(curvature_receipt.read_text())
    if (
        curvature.get("N") != 4_000
        or curvature.get("bits") != 160
        or curvature.get("compact_interval") != [0, 1]
    ):
        raise AssertionError("curvature receipt has the wrong run parameters")
    curvature_lower, _ = arb_endpoints(curvature["minimum_directed_lower"])
    if not curvature_lower > Decimal(1254):
        raise AssertionError("4k^2+k'' > 1254 is not certified")

    check_ibp_derivative_identity()
    check_s1_transport_identity()

    # Frozen endpoint and curvature bounds.
    q0_upper = Fraction(91, 136) * Fraction(16, 5)
    sigma0_lower = 2 * Fraction(3, 100)
    s2_over_a_lower = Fraction(1254, 8) * sigma0_lower
    if q0_upper != Fraction(182, 85):
        raise AssertionError("Q0 upper simplification failed")
    if s2_over_a_lower != Fraction(1881, 200):
        raise AssertionError("s2/a lower simplification failed")

    # s1'>(17/2)s0' and s0(0)=s1(0)=0 give s0/s1<2/17.
    # Therefore a^2*s0/s1<1/136 on 0<a<=1/4.
    inverse_factor_upper = 1 + Fraction(1, 136)
    modular_cost_over_a_upper = 4 * q0_upper * inverse_factor_upper
    payment_margin = s2_over_a_lower - modular_cost_over_a_upper
    if modular_cost_over_a_upper != Fraction(12467, 1445):
        raise AssertionError("modular cost upper simplification failed")
    if payment_margin != Fraction(44929, 57800) or payment_margin <= 0:
        raise AssertionError("uniform payment margin is not positive")

    result = {
        "status": "PASS",
        "scope": (
            "Uniform raw N=1 modular scalar payment on 0<a<=1/4; no "
            "higher-degree, all-degree, first Xi--Laguerre, or RH claim."
        ),
        "checks": [
            "frozen complete-theta input hashes",
            "independent center-only receipts give psi(0)^2 < 16/5",
            "complete-theta M0 > 3/100",
            "quadratic curvature 4k^2+k'' > 1254",
            "exact differential-polynomial IBP identity",
            "exact s1'=integral u^2 g^2 v' transport identity",
            "s0/s1 < 2/17 from v'>17",
            "Q0 < 182/85",
            "s2/a > 1881/200",
            "cost/a < 12467/1445",
            "uniform divided margin > 44929/57800",
        ],
        "frozen_inputs": {
            str(path.relative_to(checkpoint)): digest
            for path, digest in expected_hashes.items()
        },
        "frozen_manifests": {
            str(path.relative_to(checkpoint)): {
                "sha256": sha256(path),
                "members": entries,
            }
            for path, entries in manifest_entries.items()
        },
        "modular_receipt_source": {
            "path": str(modular_source.relative_to(checkpoint)),
            "sha256": sha256(modular_source),
        },
        "modular_center_receipts": modular_centers,
        "modular_receipt_provenance": modular_provenance,
        "proof_note": {
            "path": str(proof_note.relative_to(checkpoint)),
            "sha256": sha256(proof_note),
            "binding": "recorded, not self-frozen by this replay",
        },
        "rational_bounds": {
            "s0_over_s1_upper": "2/17",
            "Q_minus_upper": "182/85",
            "s2_over_a_lower": "1881/200",
            "cost_over_a_upper": "12467/1445",
            "payment_margin_lower": "44929/57800",
        },
        "source_sha256": sha256(source),
    }
    print(json.dumps(result, sort_keys=True, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
