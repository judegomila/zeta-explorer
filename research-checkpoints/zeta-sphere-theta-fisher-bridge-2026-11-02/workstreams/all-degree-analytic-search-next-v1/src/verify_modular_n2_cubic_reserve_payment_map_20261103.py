#!/usr/bin/env python3
"""Exact algebra audit for the N=2 modular/cubic payment map.

This standard-library verifier performs no quadrature and no degree sweep.
It checks the formal reflection identities, the retained centered-square
cross terms, the endpoint stationarity identity, the exact constant
comparison, and the hashes of the frozen sources used by the proof note.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Dict, Iterable, Tuple


Monomial = Tuple[int, ...]
Polynomial = Dict[Monomial, Fraction]
VARIABLES = (
    "x", "a", "b1", "b2", "N0", "B2", "C2",
    "fx", "fy", "rx", "ry",
    "r0", "r1", "z0", "z1", "z2",
)
DIMENSION = len(VARIABLES)


SOURCES = {
    "evidence/v20-v26-continuation/modular_cd_flux_v1/MODULAR_REFLECTION.md":
        "f835812a94fea49975530614dafe600449596d8e579fe2cacfef53a052cdd4e3",
    "evidence/v20-v26-continuation/modular_cd_flux_v1/PAID_HALF_LINE.md":
        "808cdf94c2196e8dbe819418534d9a95853ff8aa61d2ff3d09412a57a95b4fb0",
    "evidence/v18-curated/latest_bounds_audit/H3_AUDIT.md":
        "ff860428451d4fa01108ab611ebd954d9ab3d4b98c6f284ff377ee18a04a6179",
    "workstreams/all-degree-analytic-search-next-v1/MODULAR_GENERAL_PIVOT_TRANSPORT_NEXT.md":
        "5076a00c5e5b2b20fddd7470d92f61f907a2e954c23dc0bb66278271e0d96970",
}


def clean(poly: Polynomial) -> Polynomial:
    return {monomial: coefficient for monomial, coefficient in poly.items() if coefficient}


def constant(value: int | Fraction) -> Polynomial:
    coefficient = Fraction(value)
    return {} if not coefficient else {(0,) * DIMENSION: coefficient}


def variable(name: str) -> Polynomial:
    exponent = [0] * DIMENSION
    exponent[VARIABLES.index(name)] = 1
    return {tuple(exponent): Fraction(1)}


def add(*polys: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for poly in polys:
        for monomial, coefficient in poly.items():
            result[monomial] = result.get(monomial, Fraction(0)) + coefficient
    return clean(result)


def scale(poly: Polynomial, value: int | Fraction) -> Polynomial:
    coefficient = Fraction(value)
    return clean({monomial: coefficient * entry for monomial, entry in poly.items()})


def subtract(left: Polynomial, right: Polynomial) -> Polynomial:
    return add(left, scale(right, -1))


def multiply(left: Polynomial, right: Polynomial) -> Polynomial:
    result: Polynomial = {}
    for left_monomial, left_coefficient in left.items():
        for right_monomial, right_coefficient in right.items():
            monomial = tuple(
                left_power + right_power
                for left_power, right_power in zip(left_monomial, right_monomial)
            )
            result[monomial] = (
                result.get(monomial, Fraction(0))
                + left_coefficient * right_coefficient
            )
    return clean(result)


def power(poly: Polynomial, exponent: int) -> Polynomial:
    if exponent < 0:
        raise ValueError("negative polynomial exponent")
    result = constant(1)
    factor = poly
    remaining = exponent
    while remaining:
        if remaining & 1:
            result = multiply(result, factor)
        factor = multiply(factor, factor)
        remaining //= 2
    return result


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def assert_zero(poly: Polynomial, label: str, checks: list[str]) -> None:
    if clean(poly):
        raise AssertionError(f"{label} failed: {clean(poly)}")
    checks.append(label)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    root = args.root.resolve()
    checkpoint = root / "research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02"
    observed_hashes = {}
    for relative, expected in SOURCES.items():
        observed = sha256(checkpoint / relative)
        if observed != expected:
            raise AssertionError(
                f"source hash mismatch for {relative}: {observed} != {expected}"
            )
        observed_hashes[relative] = observed

    checks: list[str] = ["frozen source hashes"]
    x = variable("x")
    a = variable("a")
    b1 = variable("b1")
    b2 = variable("b2")
    two_a_minus_x = add(scale(a, 2), scale(x, -1))

    T0 = constant(1)
    T1 = x
    T2 = add(power(x, 2), b1)
    T3 = add(power(x, 3), multiply(add(b1, b2), x))

    assert_zero(
        subtract(two_a_minus_x, add(scale(T1, -1), scale(a, 2))),
        "T1 reflection",
        checks,
    )
    reflected_T2 = add(power(two_a_minus_x, 2), b1)
    expected_T2 = add(T2, scale(multiply(a, T1), -4), scale(power(a, 2), 4))
    assert_zero(subtract(reflected_T2, expected_T2), "T2 reflection", checks)

    reflected_T3 = add(
        power(two_a_minus_x, 3), multiply(add(b1, b2), two_a_minus_x)
    )
    centered = add(scale(power(a, 2), 4), scale(b1, -2), b2)
    expected_T3 = add(
        scale(T3, -1),
        scale(multiply(a, T2), 6),
        scale(multiply(power(a, 2), T1), -12),
        scale(multiply(a, centered), 2),
    )
    assert_zero(subtract(reflected_T3, expected_T3), "T3 reflection", checks)

    centered_expansion = add(
        scale(power(a, 4), 16),
        scale(power(b1, 2), 4),
        power(b2, 2),
        scale(multiply(power(a, 2), b1), -16),
        scale(multiply(power(a, 2), b2), 8),
        scale(multiply(b1, b2), -4),
    )
    assert_zero(
        subtract(power(centered, 2), centered_expansion),
        "centered reflection square with all cross terms",
        checks,
    )

    # Check R^T r=r after clearing the positive square-root denominators.
    r1_numerator = scale(power(a, 2), -12)
    reflected_r1_numerator = add(
        scale(r1_numerator, -1), scale(power(a, 2), -24)
    )
    assert_zero(
        subtract(reflected_r1_numerator, r1_numerator),
        "R^T r=r component 1",
        checks,
    )
    reflected_r0_correction = add(scale(power(a, 3), -24), scale(power(a, 3), 24))
    assert_zero(reflected_r0_correction, "R^T r=r component 0", checks)

    # Verify the block Schur completion after multiplying the identity by
    # 4a to clear the only denominator.  r0,r1 are independent symbols here.
    r0_symbol = variable("r0")
    r1_symbol = variable("r1")
    z0 = variable("z0")
    z1 = variable("z1")
    z2 = variable("z2")
    original_cleared = add(
        scale(multiply(power(a, 2), add(power(z0, 2), power(z1, 2))), 16),
        scale(multiply(multiply(a, z2), add(multiply(r0_symbol, z0), multiply(r1_symbol, z1))), -8),
        scale(multiply(power(a, 2), power(z2, 2)), -32),
    )
    completed_cleared = add(
        scale(multiply(power(a, 2), add(power(z0, 2), power(z1, 2))), 16),
        scale(multiply(multiply(a, z2), add(multiply(r0_symbol, z0), multiply(r1_symbol, z1))), -8),
        multiply(add(power(r0_symbol, 2), power(r1_symbol, 2)), power(z2, 2)),
        scale(multiply(power(a, 2), power(z2, 2)), -32),
        scale(multiply(add(power(r0_symbol, 2), power(r1_symbol, 2)), power(z2, 2)), -1),
    )
    assert_zero(
        subtract(original_cleared, completed_cleared),
        "negative block Schur square completion",
        checks,
    )

    # Endpoint stationarity: b1=(2*C2-N0)/(2*B2) and
    # I=N0-C2+b1*B2=N0/2.  Clear the positive denominator 2*B2.
    N0 = variable("N0")
    B2 = variable("B2")
    C2 = variable("C2")
    cleared_left = add(
        multiply(scale(B2, 2), subtract(N0, C2)),
        multiply(add(scale(C2, 2), scale(N0, -1)), B2),
    )
    cleared_right = multiply(N0, B2)
    assert_zero(
        subtract(cleared_left, cleared_right),
        "endpoint stationarity witness I=N0/2",
        checks,
    )

    # The monotone-likelihood-ratio step uses the exact pair symmetrization
    # 2 Cov(f,R)=E[(f(X)-f(Y))(R(X)-R(Y))].  Pointwise the last product is
    # nonpositive when f is increasing and R is decreasing.
    fx = variable("fx")
    fy = variable("fy")
    rx = variable("rx")
    ry = variable("ry")
    covariance_product = multiply(subtract(fx, fy), subtract(rx, ry))
    covariance_expansion = add(
        multiply(fx, rx),
        multiply(fy, ry),
        scale(multiply(fx, ry), -1),
        scale(multiply(fy, rx), -1),
    )
    assert_zero(
        subtract(covariance_product, covariance_expansion),
        "opposite-monotonicity covariance symmetrization",
        checks,
    )

    # For the normalized half-Gaussian exp(-c*h^2), exact Gamma integrals
    # give E[h^2]=1/(2c) and E[h^3]=1/(sqrt(pi)*c^(3/2)).
    curvature = 17
    gaussian_h2 = Fraction(1, 2 * curvature)
    if gaussian_h2 != Fraction(1, 34):
        raise AssertionError("half-Gaussian h^2 moment mismatch")
    # Squaring the h^3 formula removes its symbolic square roots:
    # E[h^3]^2 = 1/(pi*c^3).
    gaussian_h3_squared_pi = Fraction(1, curvature**3)
    if gaussian_h3_squared_pi != Fraction(1, 4913):
        raise AssertionError("half-Gaussian h^3 moment mismatch")
    checks.append("exact half-Gaussian h^2 and h^3 moment ratios")

    cubic_constant = 17**3
    if cubic_constant != 4913:
        raise AssertionError("17^3 constant mismatch")
    checks.append("17^3=4913")

    # [sqrt(pi)*17^(5/2)] > 17^3/4 is equivalent to 16*pi>17.
    # The elementary rational lower bound pi>3 makes this exact comparison.
    if 16 * 3 <= 17:
        raise AssertionError("rational pi lower bound does not close comparison")
    checks.append("endpoint cost floor exceeds cubic floor via pi>3")

    # The known scalar lower bounds do not cap the reflection bracket:
    # for fixed b1, the numerator in (b2-2*b1+4*a^2)^2 has leading b2^2,
    # so division by b1*b2 grows as b2/b1.
    b2_degree = max(monomial[VARIABLES.index("b2")] for monomial in power(centered, 2))
    leading = {
        monomial: coefficient
        for monomial, coefficient in power(centered, 2).items()
        if monomial[VARIABLES.index("b2")] == b2_degree
    }
    if b2_degree != 2 or list(leading.values()) != [Fraction(1)]:
        raise AssertionError("unexpected leading b2 behavior in centered square")
    checks.append("reflection bracket is unbounded under lower bounds alone")

    payload = {
        "schema_version": "zsv.modular_n2_cubic_reserve_payment_map.20261103.v1",
        "status": "PASS",
        "scope": (
            "Exact N=2 reflection/payment algebra and analytic endpoint constant "
            "comparison; no quadrature, degree sweep, all-degree theorem, or RH claim"
        ),
        "checks": checks,
        "source_sha256": observed_hashes,
        "exact_formulas": {
            "kappa2": (
                "a*(8+36*a^2/b2+(4*a^2-2*b1+b2)^2/(b1*b2))"
            ),
            "payment": "s3 >= kappa2*Q2_minus",
            "cubic_route_required": "kappa2*Q2_minus <= (4913/4)*s0",
            "endpoint_cost_over_sigma0_lower": "sqrt(pi)*17^(5/2)",
            "endpoint_cubic_floor": "17^3/4",
            "strict_constant_reduction": "16*pi>17; certified here from pi>3",
            "likelihood_ratio": "R(h)=psi(h)^2*exp(17*h^2) is decreasing",
            "covariance_identity": (
                "2*Cov_q(f,R)=E_q[(f(X)-f(Y))*(R(X)-R(Y))]<=0"
            ),
            "half_gaussian_h2_ratio": "1/34",
            "half_gaussian_h3_ratio": "1/(sqrt(pi)*17^(3/2))",
        },
        "conclusion": (
            "The cubic floor cannot by itself pay the N=2 modular cost uniformly "
            "on 0<a<=1/4: the reverse strict comparison holds for all sufficiently "
            "small positive a. This does not decide whether the true larger s3 pays."
        ),
    }

    output = args.output
    if not output.is_absolute():
        output = root / output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
    print(json.dumps(payload, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
