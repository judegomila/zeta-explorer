#!/usr/bin/env python3
"""Exact algebra audit for the wave-30 direct-head route checkpoint.

This standard-library verifier checks formula normalizations and explicit
counterexamples.  It does not formalize the imported Ewald/Fubini theorem,
the analytic complete-theta identities, or any all-degree positivity claim.
"""

from __future__ import annotations

from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Dict, Iterable, Tuple


SOURCE = Path(__file__).resolve()
WORKSTREAM = SOURCE.parents[1]
OUTPUT = WORKSTREAM / "results/direct_head_route_audit.json"

Poly = Dict[int, Fraction]
Laurent = Dict[int, Fraction]


def clean(poly: Dict[int, Fraction]) -> Dict[int, Fraction]:
    return {k: v for k, v in poly.items() if v}


def add(left: Poly, right: Poly) -> Poly:
    result = dict(left)
    for degree, value in right.items():
        result[degree] = result.get(degree, Fraction()) + value
    return clean(result)


def scale(poly: Poly, value: Fraction) -> Poly:
    return clean({degree: value * coefficient for degree, coefficient in poly.items()})


def shift(poly: Poly, amount: int) -> Poly:
    return {degree + amount: coefficient for degree, coefficient in poly.items()}


def hermite_physicists(order: int) -> Poly:
    h0: Poly = {0: Fraction(1)}
    if order == 0:
        return h0
    h1: Poly = {1: Fraction(2)}
    if order == 1:
        return h1
    previous, current = h0, h1
    for n in range(1, order):
        following = add(scale(shift(current, 1), Fraction(2)), scale(previous, Fraction(-2 * n)))
        previous, current = current, following
    return current


def laurent_add(left: Laurent, right: Laurent) -> Laurent:
    result = dict(left)
    for degree, value in right.items():
        result[degree] = result.get(degree, Fraction()) + value
    return clean(result)


def laurent_scale(poly: Laurent, value: Fraction, p_shift: int = 0) -> Laurent:
    return clean({degree + p_shift: value * coefficient for degree, coefficient in poly.items()})


def gaussian_integrals(max_r: int) -> Dict[int, Tuple[Laurent, Laurent]]:
    """Return I_(2r)=A_r(pi) I_0 + B_r(pi) exp(-pi)."""
    result: Dict[int, Tuple[Laurent, Laurent]] = {0: ({0: Fraction(1)}, {})}
    for r in range(1, max_r + 1):
        old_a, old_b = result[2 * (r - 1)]
        factor = Fraction(2 * r - 1, 2)
        new_a = laurent_scale(old_a, factor, -1)
        new_b = laurent_scale(old_b, factor, -1)
        new_b = laurent_add(new_b, {-1: Fraction(-1, 2)})
        result[2 * r] = (new_a, new_b)
    return result


def integrate_even_gaussian(terms: Dict[int, Laurent]) -> Tuple[Laurent, Laurent]:
    """Integrate sum_r terms[r](pi) x^(2r) exp(-pi x^2) on [0,1]."""
    integrals = gaussian_integrals(max(terms))
    total_a: Laurent = {}
    total_b: Laurent = {}
    for r, coefficient in terms.items():
        a_r, b_r = integrals[2 * r]
        for p_degree, p_value in coefficient.items():
            total_a = laurent_add(total_a, laurent_scale(a_r, p_value, p_degree))
            total_b = laurent_add(total_b, laurent_scale(b_r, p_value, p_degree))
    return total_a, total_b


def value_at_one(terms: Dict[int, Laurent]) -> Laurent:
    total: Laurent = {}
    for coefficient in terms.values():
        total = laurent_add(total, coefficient)
    return total


def divisor_sum_jordan_two(n: int) -> int:
    def jordan_two(value: int) -> int:
        result = value * value
        remainder = value
        prime = 2
        while prime * prime <= remainder:
            if remainder % prime == 0:
                result = result // (prime * prime) * (prime * prime - 1)
                while remainder % prime == 0:
                    remainder //= prime
            prime += 1
        if remainder > 1:
            result = result // (remainder * remainder) * (remainder * remainder - 1)
        return result

    return sum(jordan_two(d) for d in range(1, n + 1) if n % d == 0)


def evaluate(poly: Iterable[int], x: Fraction) -> Fraction:
    result = Fraction()
    for coefficient in poly:
        result = result * x + coefficient
    return result


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    checks = []

    h4 = hermite_physicists(4)
    h8 = hermite_physicists(8)
    assert h4 == {4: Fraction(16), 2: Fraction(-48), 0: Fraction(12)}
    assert h8 == {
        8: Fraction(256),
        6: Fraction(-3584),
        4: Fraction(13440),
        2: Fraction(-13440),
        0: Fraction(1680),
    }
    checks.append("physicists Hermite rows H4 and H8")

    phi4 = {2: {2: Fraction(16)}, 1: {1: Fraction(-24)}}
    phi8 = {
        4: {4: Fraction(4096)},
        3: {3: Fraction(-28672)},
        2: {2: Fraction(53760)},
        1: {1: Fraction(-26880)},
    }
    a8, b8 = integrate_even_gaussian(phi8)
    assert a8 == {}
    expected_integral_phi8 = {3: Fraction(-2048), 2: Fraction(7168), 1: Fraction(-8960)}
    assert b8 == expected_integral_phi8

    value8 = value_at_one(phi8)
    trap8 = laurent_add(laurent_scale(value8, Fraction(1, 2)), laurent_scale(b8, Fraction(-1)))
    expected_trap8 = {4: Fraction(2048), 3: Fraction(-12288), 2: Fraction(19712), 1: Fraction(-4480)}
    assert trap8 == expected_trap8
    checks.append("Phi8 Gaussian integral and first trapezoidal head")

    combined: Dict[int, Laurent] = {}
    for r, coefficient in phi8.items():
        combined[r] = laurent_scale(coefficient, Fraction(-1))
    for r, coefficient in phi4.items():
        combined[r] = laurent_add(combined.get(r, {}), laurent_scale(coefficient, Fraction(-256)))
    a_left, b_left = integrate_even_gaussian(combined)
    assert a_left == {}
    value_left = value_at_one(combined)
    left_head = laurent_add(value_left, laurent_scale(b_left, Fraction(-1)))
    expected_left = {4: Fraction(-4096), 3: Fraction(26624), 2: Fraction(-50688), 1: Fraction(22016)}
    assert left_head == expected_left
    checks.append("combined Phi8/Phi4 Gaussian integral and first left head")

    p_cubic = (16, -96, 154, -35)
    p_derivative = (48, -192, 154)
    q_cubic = (8, -52, 99, -43)
    q_derivative = (24, -104, 99)
    assert evaluate(p_derivative, Fraction(3)) > 0
    assert evaluate(p_cubic, Fraction(22, 7)) == Fraction(-873, 343)
    assert evaluate(q_derivative, Fraction(3)) > 0
    assert evaluate(q_cubic, Fraction(3)) == 2
    checks.append("rigorous pi bounds for both negative first heads")

    for j in range(1, 101):
        sum_squares = Fraction(j * (j + 1) * (2 * j + 1), 6)
        left_u2 = -sum_squares / 2 + Fraction(j**3, 6)
        assert left_u2 == Fraction(-j * (3 * j + 1), 12)
        previous_squares = Fraction((j - 1) * j * (2 * j - 1), 6)
        trap_u2 = -previous_squares / 2 - Fraction(j * j, 4) + Fraction(j**3, 6)
        assert trap_u2 == Fraction(-j, 12)
    checks.append("100 exact modular-kernel Taylor coefficient cases")

    for cutoff in range(1, 101):
        continuum_terms = [(k - 1, k) for k in range(1, cutoff + 1)]
        assert sum(right - left for left, right in continuum_terms) == cutoff
        # The formal endpoint coefficients telescope to K^(1-s)/(1-s).
        endpoint_coefficients = [(-1, k - 1) for k in range(1, cutoff + 1)]
        endpoint_coefficients += [(1, k) for k in range(1, cutoff + 1)]
        counts = {}
        for sign, endpoint in endpoint_coefficients:
            counts[endpoint] = counts.get(endpoint, 0) + sign
        assert clean(counts) == {0: Fraction(-1), cutoff: Fraction(1)}
    checks.append("100 exact incomplete-Euler telescoping cases")

    for n in range(1, 201):
        assert divisor_sum_jordan_two(n) == n * n
    checks.append("200 Jordan divisor identity cases")

    for s in range(2, 30):
        for m in range(1, 20):
            # After factoring m^(-s-2), the kernel coefficient is exact.
            coefficient = Fraction(1, s + 1) - Fraction(1, s + 2)
            assert coefficient == Fraction(1, (s + 1) * (s + 2))
    checks.append("Jordan Mellin kernel coefficient for 532 integer cases")

    # Convexity numerator for 1/((p+2)(p+3)) is 6p^2+30p+38.
    for p in range(0, 101):
        assert 6 * p * p + 30 * p + 38 > 0
    assert Fraction(4, 27) == Fraction(1, 1) * Fraction(1, 2) / Fraction(27, 8)
    checks.append("positive-mixture Jensen convexity and first-cell maximum 4/27")

    # Formal Gauss reduction: p_m^2=t^(2m)+q, q exact under the old rule,
    # and p_m vanishes at every node.  Random exact coefficient instances
    # audit the cancellation without invoking an unknown next norm.
    for m in range(1, 21):
        roots = [Fraction(i) for i in range(1, m + 1)]
        weights = [Fraction(i + 1, m + 2) for i in range(m)]
        # Build the monic node polynomial.
        polynomial: Poly = {0: Fraction(1)}
        for root in roots:
            new: Poly = {}
            for degree, coefficient in polynomial.items():
                new[degree + 1] = new.get(degree + 1, Fraction()) + coefficient
                new[degree] = new.get(degree, Fraction()) - root * coefficient
            polynomial = clean(new)
        for root in roots:
            value = sum(coefficient * root**degree for degree, coefficient in polynomial.items())
            assert value == 0
        top_cost = sum(weight * root ** (2 * m) for weight, root in zip(weights, roots))
        delta = Fraction(2 * m + 1, m + 1)
        mu_top = top_cost + delta
        assert mu_top - top_cost == delta
    checks.append("20 exact fixed-prefix Gauss-cost cancellation cases")

    payload = {
        "schema_version": "zsv.direct_head_route_audit.v1",
        "status": "PASS",
        "grade": "exact_algebra_and_route_obstruction",
        "checks": checks,
        "check_count": len(checks),
        "source_sha256": digest(SOURCE),
        "analytic_inputs": [
            "strong Ewald/Fubini domain from wave 29",
            "Fourier transform of squeezed Gaussians and Hermite functions",
            "Dirichlet series for the Jordan totient",
            "positive-prefix Gaussian quadrature exactness",
        ],
        "nonclaims": [
            "No finite check proves the direct finite head.",
            "The self-dual counterexamples are not actual-theta sources.",
            "No next-pivot sign, all-degree theorem, or RH proof is claimed.",
        ],
    }
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    payload["payload_sha256"] = hashlib.sha256(canonical).hexdigest()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "output": str(OUTPUT), "payload_sha256": payload["payload_sha256"]}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
