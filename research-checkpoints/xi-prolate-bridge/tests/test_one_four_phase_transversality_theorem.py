#!/usr/bin/env python3
"""Exact certificate for universal phase transversality on the 1:4 hull."""

from __future__ import annotations

from collections import defaultdict
from fractions import Fraction as F
from functools import lru_cache
import hashlib
from math import factorial, gcd, isqrt
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "ONE_FOUR_PHASE_TRANSVERSALITY_THEOREM.md"
TEST = Path(__file__).resolve()

PROTECTED_HASHES = {
    "P0_SOURCE_LOCK.json":
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251",
    "P0_NORMALIZATION_AUDIT.md":
        "37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df",
    "P3_SOURCE_LOCK.json":
        "42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3",
    "notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md":
        "ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1",
    "notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md":
        "a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc",
    "notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md":
        "00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff",
    "notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md":
        "6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959",
}

# All univariate arrays in this file use ascending coefficient order.
A22 = (
    1360, 115736, 4254025, 82881760, 779447045, -353413835,
    -87068768619, -787343072055, -1153130554575, 20541499047585,
    89926191488475, -173299299276987, -1153131765850865,
    1568325646562255, 5164077479972215, -13700312433186645,
    12941135831418555, -6093019025096445, 1520789944741520,
    -197655894310745, 12341642524400, -309507026688, 1998950400,
)
B19 = (
    -2160, -45480, 258805, 21691870, 362475465, 2583842440,
    -7503727430, -366026551980, -3879605283270, -20620549071840,
    -40962341556975, 117551322457150, 623910742489261,
    -143409733259376, -2502674934555392, 3097986513571840,
    -1331208639283200, 213968193847296, -10347532517376,
    65229815808,
)
B2 = (-3, -17, 16)
B17 = (
    720, 11080, -145215, -6348645, -85623980, -409937700,
    4367561550, 95073000810, 777748418100, 2973331325700,
    953227903225, -28727631866925, -40096451433312,
    121802432584960, -69836547440640, 12691238092800,
    -642389114880, 4076863488,
)
E12 = (
    -180, 4015, 181094, 635494, -12914410, -77354780,
    83877890, 783185514, -499088826, -677834595, 411630320,
    -44437760, 512000,
)

Gaussian = tuple[int, int]
Sparse = dict[tuple[int, int], Gaussian]  # exponents of x and R
Bivar = dict[tuple[int, int], F]          # exponents of s=x^2 and u=R^2
Poly = list[F]
Interval = tuple[F, F]


# ---------------------------------------------------------------------------
# Exact sparse Gaussian arithmetic and the fraction-free H | K reduction.


def sp_clean(poly: Sparse) -> Sparse:
    return {key: value for key, value in poly.items() if value != (0, 0)}


def sp_add(left: Sparse, right: Sparse) -> Sparse:
    result: dict[tuple[int, int], Gaussian] = defaultdict(lambda: (0, 0))
    for key, (real, imaginary) in left.items():
        old_real, old_imaginary = result[key]
        result[key] = old_real + real, old_imaginary + imaginary
    for key, (real, imaginary) in right.items():
        old_real, old_imaginary = result[key]
        result[key] = old_real + real, old_imaginary + imaginary
    return sp_clean(dict(result))


def sp_neg(poly: Sparse) -> Sparse:
    return {key: (-value[0], -value[1]) for key, value in poly.items()}


def sp_sub(left: Sparse, right: Sparse) -> Sparse:
    return sp_add(left, sp_neg(right))


def sp_mul(left: Sparse, right: Sparse) -> Sparse:
    result: dict[tuple[int, int], Gaussian] = defaultdict(lambda: (0, 0))
    for (x_left, r_left), (a, b) in left.items():
        for (x_right, r_right), (c, d) in right.items():
            key = x_left + x_right, r_left + r_right
            old_real, old_imaginary = result[key]
            result[key] = (
                old_real + a * c - b * d,
                old_imaginary + a * d + b * c,
            )
    return sp_clean(dict(result))


def sp_power(poly: Sparse, exponent: int) -> Sparse:
    result = sp_const(1)
    factor = poly
    while exponent:
        if exponent & 1:
            result = sp_mul(result, factor)
        factor = sp_mul(factor, factor)
        exponent >>= 1
    return result


def sp_conjugate(poly: Sparse) -> Sparse:
    return {key: (value[0], -value[1]) for key, value in poly.items()}


def sp_const(value: int) -> Sparse:
    return {} if value == 0 else {(0, 0): (value, 0)}


X: Sparse = {(1, 0): (1, 0)}
RR: Sparse = {(0, 1): (1, 0)}
II: Sparse = {(0, 0): (0, 1)}


def yp_add(left: list[Sparse], right: list[Sparse]) -> list[Sparse]:
    result = [
        sp_add(
            left[index] if index < len(left) else {},
            right[index] if index < len(right) else {},
        )
        for index in range(max(len(left), len(right)))
    ]
    while len(result) > 1 and not result[-1]:
        result.pop()
    return result


def yp_mul(left: list[Sparse], right: list[Sparse]) -> list[Sparse]:
    result = [{} for _ in range(len(left) + len(right) - 1)]
    for left_index, left_value in enumerate(left):
        for right_index, right_value in enumerate(right):
            result[left_index + right_index] = sp_add(
                result[left_index + right_index],
                sp_mul(left_value, right_value),
            )
    while len(result) > 1 and not result[-1]:
        result.pop()
    return result


def yp_power(poly: list[Sparse], exponent: int) -> list[Sparse]:
    result = [sp_const(1)]
    factor = poly
    while exponent:
        if exponent & 1:
            result = yp_mul(result, factor)
        factor = yp_mul(factor, factor)
        exponent >>= 1
    return result


def yp_pseudo_remainder(dividend: list[Sparse], divisor: list[Sparse]) -> list[Sparse]:
    """Fraction-free pseudo-remainder by a quadratic in ascending order."""
    remainder = dividend[:]
    while len(remainder) >= len(divisor):
        lead = remainder[-1]
        shift = len(remainder) - len(divisor)
        divisor_lead = divisor[-1]
        remainder = [sp_mul(value, divisor_lead) for value in remainder]
        for index, value in enumerate(divisor):
            remainder[index + shift] = sp_sub(
                remainder[index + shift], sp_mul(lead, value)
            )
        while len(remainder) > 1 and not remainder[-1]:
            remainder.pop()
    return remainder


def zp_add(left: dict[int, Sparse], right: dict[int, Sparse]) -> dict[int, Sparse]:
    result = dict(left)
    for exponent, coefficient in right.items():
        result[exponent] = sp_add(result.get(exponent, {}), coefficient)
        if not result[exponent]:
            del result[exponent]
    return result


def zp_sub(left: dict[int, Sparse], right: dict[int, Sparse]) -> dict[int, Sparse]:
    return zp_add(left, {key: sp_neg(value) for key, value in right.items()})


def zp_mul(left: dict[int, Sparse], right: dict[int, Sparse]) -> dict[int, Sparse]:
    result: dict[int, Sparse] = {}
    for left_exponent, left_value in left.items():
        for right_exponent, right_value in right.items():
            exponent = left_exponent + right_exponent
            result[exponent] = sp_add(
                result.get(exponent, {}), sp_mul(left_value, right_value)
            )
            if not result[exponent]:
                del result[exponent]
    return result


def zp_scale(poly: dict[int, Sparse], scale: Sparse) -> dict[int, Sparse]:
    return {
        exponent: product
        for exponent, value in poly.items()
        if (product := sp_mul(scale, value))
    }


# ---------------------------------------------------------------------------
# Exact rational univariate arithmetic.


def q_normalize(poly: list[int | F] | tuple[int | F, ...]) -> Poly:
    result = [F(value) for value in poly]
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result if result else [F(0)]


def q_add(left: Poly, right: Poly) -> Poly:
    return q_normalize([
        (left[index] if index < len(left) else F(0))
        + (right[index] if index < len(right) else F(0))
        for index in range(max(len(left), len(right)))
    ])


def q_neg(poly: Poly) -> Poly:
    return q_normalize([-value for value in poly])


def q_sub(left: Poly, right: Poly) -> Poly:
    return q_add(left, q_neg(right))


def q_scale(poly: Poly, scale: int | F) -> Poly:
    return q_normalize([F(scale) * value for value in poly])


def q_mul(left: Poly, right: Poly) -> Poly:
    result = [F(0)] * (len(left) + len(right) - 1)
    for left_index, left_value in enumerate(left):
        for right_index, right_value in enumerate(right):
            result[left_index + right_index] += left_value * right_value
    return q_normalize(result)


def q_power(poly: Poly, exponent: int) -> Poly:
    result = [F(1)]
    factor = poly
    while exponent:
        if exponent & 1:
            result = q_mul(result, factor)
        factor = q_mul(factor, factor)
        exponent >>= 1
    return result


def q_derivative(poly: Poly) -> Poly:
    return q_normalize([F(index) * poly[index] for index in range(1, len(poly))])


def q_divmod(dividend: Poly, divisor: Poly) -> tuple[Poly, Poly]:
    dividend = q_normalize(dividend)
    divisor = q_normalize(divisor)
    if divisor == [F(0)]:
        raise ZeroDivisionError
    quotient = [F(0)] * max(1, len(dividend) - len(divisor) + 1)
    remainder = dividend[:]
    while len(remainder) >= len(divisor) and remainder != [F(0)]:
        degree = len(remainder) - len(divisor)
        coefficient = remainder[-1] / divisor[-1]
        quotient[degree] = coefficient
        for index, value in enumerate(divisor):
            remainder[index + degree] -= coefficient * value
        remainder = q_normalize(remainder)
    return q_normalize(quotient), remainder


def q_gcd(left: Poly, right: Poly) -> Poly:
    left = q_normalize(left)
    right = q_normalize(right)
    while right != [F(0)]:
        _, remainder = q_divmod(left, right)
        left, right = right, remainder
    return q_scale(left, F(1, 1) / left[-1])


def q_eval(poly: Poly, value: F) -> F:
    result = F(0)
    for coefficient in reversed(poly):
        result = result * value + coefficient
    return result


def q_mod(poly: Poly, modulus: Poly) -> Poly:
    return q_divmod(poly, modulus)[1]


def q_xgcd(left: Poly, right: Poly) -> tuple[Poly, Poly, Poly]:
    r0, r1 = q_normalize(left), q_normalize(right)
    s0, s1 = [F(1)], [F(0)]
    t0, t1 = [F(0)], [F(1)]
    while r1 != [F(0)]:
        quotient, remainder = q_divmod(r0, r1)
        r0, r1 = r1, remainder
        s0, s1 = s1, q_sub(s0, q_mul(quotient, s1))
        t0, t1 = t1, q_sub(t0, q_mul(quotient, t1))
    scale = F(1, 1) / r0[-1]
    return q_scale(r0, scale), q_scale(s0, scale), q_scale(t0, scale)


def q_inverse_mod(poly: Poly, modulus: Poly) -> Poly:
    common, coefficient, _ = q_xgcd(poly, modulus)
    if common != [F(1)]:
        raise ZeroDivisionError
    return q_mod(coefficient, modulus)


def ip_mul(left: list[int] | tuple[int, ...], right: list[int] | tuple[int, ...]) -> list[int]:
    result = [0] * (len(left) + len(right) - 1)
    for left_index, left_value in enumerate(left):
        for right_index, right_value in enumerate(right):
            result[left_index + right_index] += left_value * right_value
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def ip_power(poly: list[int] | tuple[int, ...], exponent: int) -> list[int]:
    result = [1]
    factor = list(poly)
    while exponent:
        if exponent & 1:
            result = ip_mul(result, factor)
        factor = ip_mul(factor, factor)
        exponent >>= 1
    return result


def content_gcd(poly: tuple[int, ...]) -> int:
    result = 0
    for value in poly:
        result = gcd(result, abs(value))
    return result


def sp_component_to_bivar(
    poly: Sparse, component: int, x_min: int, r_min: int, content_power: int
) -> Bivar:
    by_u: dict[int, Poly] = {}
    for (x_exponent, r_exponent), value in poly.items():
        coefficient = value[component]
        if not coefficient:
            continue
        assert (x_exponent - x_min) % 2 == 0
        assert (r_exponent - r_min) % 2 == 0
        s_exponent = (x_exponent - x_min) // 2
        u_exponent = (r_exponent - r_min) // 2
        target = by_u.setdefault(u_exponent, [F(0)] * (s_exponent + 1))
        if len(target) <= s_exponent:
            target.extend([F(0)] * (s_exponent + 1 - len(target)))
        target[s_exponent] += coefficient

    known_content = q_mul(
        q_power([F(1), F(1)], content_power),
        q_power([F(1, 16), F(1)], content_power),
    )
    result: Bivar = {}
    for u_exponent, coefficient_poly in by_u.items():
        quotient, remainder = q_divmod(coefficient_poly, known_content)
        assert remainder == [F(0)]
        for s_exponent, coefficient in enumerate(quotient):
            if coefficient:
                assert coefficient.denominator == 1
                result[s_exponent, u_exponent] = coefficient
    return result


@lru_cache(maxsize=1)
def symbolic_data() -> tuple[
    Sparse, Sparse, Sparse, Sparse, Sparse, Sparse, Sparse, tuple[Bivar, ...]
]:
    one = sp_const(1)
    x_squared = sp_power(X, 2)
    d_a = sp_power(sp_add(one, x_squared), 2)
    d_c = sp_power(sp_add(one, sp_mul(sp_const(16), x_squared)), 2)
    n_a = sp_add(
        sp_sub(one, x_squared), sp_mul(sp_const(-2), sp_mul(II, X))
    )
    n_c = sp_add(
        sp_sub(one, sp_mul(sp_const(16), x_squared)),
        sp_mul(sp_const(-8), sp_mul(II, X)),
    )
    a = sp_mul(n_a, d_c)
    c = sp_mul(n_c, d_a)
    a_bar = sp_conjugate(a)
    c_bar = sp_conjugate(c)

    h2 = sp_mul(RR, sp_mul(a_bar, sp_mul(c, sp_sub(c, a_bar))))
    h1 = sp_add(
        sp_mul(a, sp_mul(a_bar, sp_sub(a, a_bar))),
        sp_mul(sp_power(RR, 2), sp_mul(c, sp_mul(c_bar, sp_sub(c, c_bar)))),
    )
    h0 = sp_mul(RR, sp_mul(a, sp_mul(c_bar, sp_sub(a, c_bar))))

    u_poly = [{}, a, sp_mul(RR, c)]
    t_poly = [sp_mul(RR, c_bar), a_bar]
    k_poly = yp_add(
        yp_power(t_poly, 3), [{}, {}] + yp_power(u_poly, 3)
    )
    remainder = yp_pseudo_remainder(k_poly, [h0, h1, h2])
    assert len(remainder) == 2

    reduced: list[Bivar] = []
    for index, coefficient in enumerate(remainder):
        r_min = 4 if index == 0 else 3
        content_power = 18 if index == 0 else 14
        reduced.append(sp_component_to_bivar(
            coefficient, 0, 8, r_min, content_power
        ))
        reduced.append(sp_component_to_bivar(
            coefficient, 1, 7, r_min, content_power
        ))
    return a, c, a_bar, c_bar, h0, h1, h2, tuple(reduced)


# ---------------------------------------------------------------------------
# Finite-field polynomial and quotient-field arithmetic.


def fp_normalize(poly: list[int], prime: int) -> list[int]:
    result = [value % prime for value in poly]
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    return result


def fp_add(left: list[int], right: list[int], prime: int) -> list[int]:
    return fp_normalize([
        (left[index] if index < len(left) else 0)
        + (right[index] if index < len(right) else 0)
        for index in range(max(len(left), len(right)))
    ], prime)


def fp_sub(left: list[int], right: list[int], prime: int) -> list[int]:
    return fp_add(left, [-value for value in right], prime)


def fp_mul(left: list[int], right: list[int], prime: int) -> list[int]:
    result = [0] * (len(left) + len(right) - 1)
    for left_index, left_value in enumerate(left):
        for right_index, right_value in enumerate(right):
            result[left_index + right_index] = (
                result[left_index + right_index] + left_value * right_value
            ) % prime
    return fp_normalize(result, prime)


def fp_scale(poly: list[int], scale: int, prime: int) -> list[int]:
    return fp_normalize([scale * value for value in poly], prime)


def fp_divmod(
    dividend: list[int], divisor: list[int], prime: int
) -> tuple[list[int], list[int]]:
    remainder = fp_normalize(dividend, prime)
    divisor = fp_normalize(divisor, prime)
    if divisor == [0]:
        raise ZeroDivisionError
    quotient = [0] * max(1, len(remainder) - len(divisor) + 1)
    inverse_lead = pow(divisor[-1], prime - 2, prime)
    while len(remainder) >= len(divisor) and remainder != [0]:
        degree = len(remainder) - len(divisor)
        coefficient = remainder[-1] * inverse_lead % prime
        quotient[degree] = coefficient
        for index, value in enumerate(divisor):
            remainder[index + degree] = (
                remainder[index + degree] - coefficient * value
            ) % prime
        remainder = fp_normalize(remainder, prime)
    return fp_normalize(quotient, prime), remainder


def fp_gcd(left: list[int], right: list[int], prime: int) -> list[int]:
    left = fp_normalize(left, prime)
    right = fp_normalize(right, prime)
    while right != [0]:
        _, remainder = fp_divmod(left, right, prime)
        left, right = right, remainder
    return fp_scale(left, pow(left[-1], prime - 2, prime), prime)


def fp_modmul(
    left: list[int], right: list[int], modulus: list[int], prime: int
) -> list[int]:
    return fp_divmod(fp_mul(left, right, prime), modulus, prime)[1]


def fp_modpower(
    poly: list[int], exponent: int, modulus: list[int], prime: int
) -> list[int]:
    result = [1]
    factor = fp_divmod(poly, modulus, prime)[1]
    while exponent:
        if exponent & 1:
            result = fp_modmul(result, factor, modulus, prime)
        factor = fp_modmul(factor, factor, modulus, prime)
        exponent >>= 1
    return result


def fp_xgcd(
    left: list[int], right: list[int], prime: int
) -> tuple[list[int], list[int], list[int]]:
    r0, r1 = fp_normalize(left, prime), fp_normalize(right, prime)
    s0, s1 = [1], [0]
    t0, t1 = [0], [1]
    while r1 != [0]:
        quotient, remainder = fp_divmod(r0, r1, prime)
        r0, r1 = r1, remainder
        s0, s1 = s1, fp_sub(s0, fp_mul(quotient, s1, prime), prime)
        t0, t1 = t1, fp_sub(t0, fp_mul(quotient, t1, prime), prime)
    inverse = pow(r0[-1], prime - 2, prime)
    return (
        fp_scale(r0, inverse, prime),
        fp_scale(s0, inverse, prime),
        fp_scale(t0, inverse, prime),
    )


def field_normalize(poly: list[int], modulus: list[int], prime: int) -> list[int]:
    return fp_divmod(fp_normalize(poly, prime), modulus, prime)[1]


def field_add(
    left: list[int], right: list[int], modulus: list[int], prime: int
) -> list[int]:
    return field_normalize(fp_add(left, right, prime), modulus, prime)


def field_sub(
    left: list[int], right: list[int], modulus: list[int], prime: int
) -> list[int]:
    return field_normalize(fp_sub(left, right, prime), modulus, prime)


def field_mul(
    left: list[int], right: list[int], modulus: list[int], prime: int
) -> list[int]:
    return field_normalize(fp_mul(left, right, prime), modulus, prime)


def field_inverse(poly: list[int], modulus: list[int], prime: int) -> list[int]:
    common, coefficient, _ = fp_xgcd(poly, modulus, prime)
    if common != [1]:
        raise ZeroDivisionError("the selected quotient is not a field")
    return field_normalize(coefficient, modulus, prime)


def fu_normalize(poly: list[list[int]]) -> list[list[int]]:
    result = [value[:] for value in poly]
    while len(result) > 1 and result[-1] == [0]:
        result.pop()
    return result


def fu_divmod(
    dividend: list[list[int]],
    divisor: list[list[int]],
    modulus: list[int],
    prime: int,
) -> tuple[list[list[int]], list[list[int]]]:
    remainder = fu_normalize(dividend)
    divisor = fu_normalize(divisor)
    quotient = [[0] for _ in range(max(1, len(remainder) - len(divisor) + 1))]
    inverse_lead = field_inverse(divisor[-1], modulus, prime)
    while len(remainder) >= len(divisor) and remainder != [[0]]:
        degree = len(remainder) - len(divisor)
        coefficient = field_mul(remainder[-1], inverse_lead, modulus, prime)
        quotient[degree] = coefficient
        for index, value in enumerate(divisor):
            remainder[index + degree] = field_sub(
                remainder[index + degree],
                field_mul(coefficient, value, modulus, prime),
                modulus,
                prime,
            )
        remainder = fu_normalize(remainder)
    return fu_normalize(quotient), remainder


def fu_gcd(
    left: list[list[int]],
    right: list[list[int]],
    modulus: list[int],
    prime: int,
) -> list[list[int]]:
    while fu_normalize(right) != [[0]]:
        _, remainder = fu_divmod(left, right, modulus, prime)
        left, right = right, remainder
    inverse_lead = field_inverse(left[-1], modulus, prime)
    return [field_mul(value, inverse_lead, modulus, prime) for value in left]


def bivar_to_fu(poly: Bivar, modulus: list[int], prime: int) -> list[list[int]]:
    maximum_u = max(u_exponent for _, u_exponent in poly)
    result = [[0] for _ in range(maximum_u + 1)]
    for (s_exponent, u_exponent), coefficient in poly.items():
        modular_coefficient = (
            coefficient.numerator % prime
            * pow(coefficient.denominator % prime, prime - 2, prime)
        ) % prime
        term = [0] * (s_exponent + 1)
        term[s_exponent] = modular_coefficient
        result[u_exponent] = field_add(
            result[u_exponent], term, modulus, prime
        )
    return fu_normalize(result)


def component_u_gcd(
    reduced: tuple[Bivar, ...], modulus: list[int], prime: int
) -> list[list[int]]:
    polynomials = [bivar_to_fu(poly, modulus, prime) for poly in reduced]
    result = polynomials[0]
    for poly in polynomials[1:]:
        result = fu_gcd(result, poly, modulus, prime)
    return result


def irreducible_certificate(poly: tuple[int, ...], prime: int) -> bool:
    """Rabin irreducibility test, exact over F_p."""
    modulus = fp_normalize(list(poly), prime)
    degree = len(modulus) - 1
    derivative = [(index * modulus[index]) % prime for index in range(1, len(modulus))]
    if fp_gcd(modulus, derivative, prime) != [1]:
        return False
    x_poly = [0, 1]
    x_power = x_poly
    prime_divisors: list[int] = []
    value = degree
    divisor = 2
    while divisor * divisor <= value:
        if value % divisor == 0:
            prime_divisors.append(divisor)
            while value % divisor == 0:
                value //= divisor
        divisor += 1
    if value > 1:
        prime_divisors.append(value)
    for divisor in prime_divisors:
        check = fp_modpower(x_poly, prime ** (degree // divisor), modulus, prime)
        if fp_gcd(modulus, fp_sub(check, x_poly, prime), prime) != [1]:
            return False
    x_power = fp_modpower(x_poly, prime ** degree, modulus, prime)
    return fp_sub(x_power, x_poly, prime) == [0]


# ---------------------------------------------------------------------------
# Modular resultants, exact CRT, and deterministic projection certificate.


def bivar_linear_combination(
    polynomials: tuple[Bivar, ...], coefficients: tuple[int, ...]
) -> Bivar:
    result: Bivar = {}
    for poly, scale in zip(polynomials, coefficients, strict=True):
        for key, value in poly.items():
            result[key] = result.get(key, F(0)) + scale * value
    return {key: value for key, value in result.items() if value}


def bivar_eval_u(poly: Bivar, s_value: int, prime: int) -> list[int]:
    maximum_u = max(u_exponent for _, u_exponent in poly)
    result = [0] * (maximum_u + 1)
    for (s_exponent, u_exponent), coefficient in poly.items():
        value = (
            coefficient.numerator % prime
            * pow(coefficient.denominator % prime, prime - 2, prime)
        ) % prime
        result[u_exponent] = (
            result[u_exponent] + value * pow(s_value, s_exponent, prime)
        ) % prime
    return result


def determinant_mod(matrix: list[list[int]], prime: int) -> int:
    matrix = [row[:] for row in matrix]
    result = 1
    size = len(matrix)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if matrix[row][column] % prime),
            None,
        )
        if pivot is None:
            return 0
        if pivot != column:
            matrix[column], matrix[pivot] = matrix[pivot], matrix[column]
            result = -result
        pivot_value = matrix[column][column] % prime
        result = result * pivot_value % prime
        inverse = pow(pivot_value, prime - 2, prime)
        for row in range(column + 1, size):
            scale = matrix[row][column] * inverse % prime
            if scale:
                for index in range(column, size):
                    matrix[row][index] = (
                        matrix[row][index] - scale * matrix[column][index]
                    ) % prime
    return result % prime


def resultant_value(left: list[int], right: list[int], prime: int) -> int:
    # The formal u-degrees are retained even if this specialization drops degree.
    left_degree = len(left) - 1
    right_degree = len(right) - 1
    left_reversed = list(reversed(left))
    right_reversed = list(reversed(right))
    size = left_degree + right_degree
    matrix = []
    for shift in range(right_degree):
        matrix.append(
            [0] * shift + left_reversed
            + [0] * (size - shift - len(left_reversed))
        )
    for shift in range(left_degree):
        matrix.append(
            [0] * shift + right_reversed
            + [0] * (size - shift - len(right_reversed))
        )
    return determinant_mod(matrix, prime)


def interpolate_consecutive(values: list[int], prime: int) -> list[int]:
    differences = [value % prime for value in values]
    newton_coefficients = []
    factorial_value = 1
    for index in range(len(values)):
        if index:
            factorial_value = factorial_value * index % prime
        newton_coefficients.append(
            differences[0] * pow(factorial_value, prime - 2, prime) % prime
        )
        differences = [
            (differences[j + 1] - differences[j]) % prime
            for j in range(len(differences) - 1)
        ]
    result = [0]
    basis = [1]
    for index, coefficient in enumerate(newton_coefficients):
        result = fp_add(
            result, [(coefficient * value) % prime for value in basis], prime
        )
        basis = fp_mul(basis, [(-index) % prime, 1], prime)
    return fp_normalize(result, prime)


def resultant_interpolation(left: Bivar, right: Bivar, prime: int) -> list[int]:
    left_u = max(u for _, u in left)
    right_u = max(u for _, u in right)
    left_s = max(s for s, _ in left)
    right_s = max(s for s, _ in right)
    degree_bound = left_u * right_s + right_u * left_s
    values = [
        resultant_value(
            bivar_eval_u(left, s_value, prime),
            bivar_eval_u(right, s_value, prime),
            prime,
        )
        for s_value in range(degree_bound + 1)
    ]
    return interpolate_consecutive(values, prime)


def is_prime(value: int) -> bool:
    if value < 2:
        return False
    if value % 2 == 0:
        return value == 2
    divisor = 3
    while divisor * divisor <= value:
        if value % divisor == 0:
            return False
        divisor += 2
    return True


def next_prime(value: int) -> int:
    value += 1
    while not is_prime(value):
        value += 1
    return value


def crt_pair(old: int, modulus: int, new: int, prime: int) -> int:
    correction = (new - old) % prime
    correction = correction * pow(modulus % prime, prime - 2, prime) % prime
    return (old + modulus * correction) % (modulus * prime)


def fraction_mod(value: F, prime: int) -> int:
    if value.denominator % prime == 0:
        raise ZeroDivisionError("bad reduction prime")
    return value.numerator % prime * pow(value.denominator % prime, prime - 2, prime) % prime


@lru_cache(maxsize=1)
def exact_projection_certificate() -> dict[str, object]:
    reduced = symbolic_data()[-1]
    combinations = (
        ((1, 2, 3, 5), (7, 11, 13, 17)),
        ((19, 23, 29, 31), (37, 41, 43, 47)),
        ((53, 59, 61, 67), (71, 73, 79, 83)),
    )
    pairs = tuple(
        (
            bivar_linear_combination(reduced, left),
            bivar_linear_combination(reduced, right),
        )
        for left, right in combinations
    )
    maximum_coefficient = max(
        abs(value.numerator)
        for pair in pairs
        for poly in pair
        for value in poly.values()
    )
    assert all(
        value.denominator == 1
        for pair in pairs for poly in pair for value in poly.values()
    )
    coefficient_bound = (
        factorial(14) * 41 ** 14 * maximum_coefficient ** 14
    )

    residues: list[list[int]] | None = None
    modulus = 1
    prime = 1000003
    primes: list[int] = []
    formal_length = 561
    while modulus <= 2 * coefficient_bound:
        modular_resultants = []
        for left, right in pairs:
            resultant = resultant_interpolation(left, right, prime)
            resultant += [0] * (formal_length - len(resultant))
            assert len(resultant) == formal_length
            modular_resultants.append(resultant)
        if residues is None:
            residues = [resultant[:] for resultant in modular_resultants]
            modulus = prime
        else:
            residues = [
                [
                    crt_pair(old, modulus, new, prime)
                    for old, new in zip(old_row, new_row, strict=True)
                ]
                for old_row, new_row in zip(
                    residues, modular_resultants, strict=True
                )
            ]
            modulus *= prime
        primes.append(prime)
        prime = next_prime(prime)
    assert residues is not None

    exact_resultants: list[Poly] = []
    for row in residues:
        centered = [
            value - modulus if value > modulus // 2 else value for value in row
        ]
        exact_resultants.append(q_normalize(centered))

    d_integer = ip_mul(
        [0, 0, 0, 0, 1],
        ip_mul(
            ip_power([1, 1], 150),
            ip_mul(
                ip_power([1, 16], 76),
                ip_mul(ip_power(A22, 2), ip_power(B19, 3)),
            ),
        ),
    )
    d_poly = q_normalize(d_integer)
    quotients = []
    for resultant in exact_resultants:
        quotient, remainder = q_divmod(resultant, d_poly)
        assert remainder == [F(0)]
        quotients.append(quotient)

    good_prime = 1000003
    quotient_mods = [
        fp_normalize([fraction_mod(value, good_prime) for value in quotient], good_prime)
        for quotient in quotients
    ]
    quotient_gcd = fp_gcd(quotient_mods[0], quotient_mods[1], good_prime)
    quotient_gcd = fp_gcd(quotient_gcd, quotient_mods[2], good_prime)

    resultant_mods = [
        fp_normalize([fraction_mod(value, good_prime) for value in resultant], good_prime)
        for resultant in exact_resultants
    ]
    full_gcd = fp_gcd(resultant_mods[0], resultant_mods[1], good_prime)
    full_gcd = fp_gcd(full_gcd, resultant_mods[2], good_prime)
    d_mod = fp_normalize(d_integer, good_prime)
    d_mod = fp_scale(d_mod, pow(d_mod[-1], good_prime - 2, good_prime), good_prime)

    return {
        "maximum_coefficient": maximum_coefficient,
        "coefficient_bound": coefficient_bound,
        "prime_count": len(primes),
        "modulus": modulus,
        "degrees": tuple(len(value) - 1 for value in exact_resultants),
        "coefficient_bits": tuple(
            max(abs(value.numerator).bit_length() for value in resultant)
            for resultant in exact_resultants
        ),
        "d_degree": len(d_integer) - 1,
        "quotient_degrees": tuple(len(value) - 1 for value in quotients),
        "quotient_leads": tuple(value[-1] for value in quotient_mods),
        "quotient_gcd": quotient_gcd,
        "full_gcd": full_gcd,
        "d_mod": d_mod,
    }


# ---------------------------------------------------------------------------
# Exact characteristic-zero triangular identities and real-root certificates.


def rational_reconstruct(residue: int, modulus: int) -> F | None:
    residue %= modulus
    bound = isqrt(modulus // 2)
    r0, r1 = modulus, residue
    t0, t1 = 0, 1
    while r1 and abs(r1) > bound:
        quotient = r0 // r1
        r0, r1 = r1, r0 - quotient * r1
        t0, t1 = t1, t0 - quotient * t1
    if not r1 or not t1 or abs(r1) > bound or abs(t1) > bound:
        return None
    if t1 < 0:
        r1, t1 = -r1, -t1
    if gcd(abs(r1), t1) != 1 or (r1 - residue * t1) % modulus:
        return None
    return F(r1, t1)


@lru_cache(maxsize=1)
def reconstruct_a_quadratic() -> tuple[tuple[F, ...], tuple[F, ...]]:
    reduced = symbolic_data()[-1]
    residues: list[int] | None = None
    modulus = 1
    prime = 1000003
    primes = []
    for _ in range(19):
        a_mod = fp_normalize(list(A22), prime)
        gcd_u = component_u_gcd(reduced, a_mod, prime)
        assert len(gcd_u) == 3 and gcd_u[-1] == [1]
        flat = []
        for coefficient in gcd_u[:2]:
            coefficient = coefficient + [0] * (22 - len(coefficient))
            assert len(coefficient) == 22
            flat.extend(coefficient)
        if residues is None:
            residues = flat
            modulus = prime
        else:
            residues = [
                crt_pair(old, modulus, new, prime)
                for old, new in zip(residues, flat, strict=True)
            ]
            modulus *= prime
        primes.append(prime)
        prime = next_prime(prime)
    assert residues is not None and len(primes) == 19
    reconstructed = [rational_reconstruct(value, modulus) for value in residues]
    assert all(value is not None for value in reconstructed)
    values = tuple(value for value in reconstructed if value is not None)
    return values[:22], values[22:]


def bivar_to_qu(poly: Bivar, modulus: Poly) -> list[Poly]:
    maximum_u = max(u for _, u in poly)
    result = [[F(0)] for _ in range(maximum_u + 1)]
    for (s_exponent, u_exponent), coefficient in poly.items():
        term = [F(0)] * (s_exponent + 1)
        term[s_exponent] = coefficient
        result[u_exponent] = q_mod(q_add(result[u_exponent], term), modulus)
    while len(result) > 1 and result[-1] == [F(0)]:
        result.pop()
    return result


def qu_divmod_monic(
    dividend: list[Poly], divisor: list[Poly], modulus: Poly
) -> tuple[list[Poly], list[Poly]]:
    remainder = [q_mod(value, modulus) for value in dividend]
    quotient = [[F(0)] for _ in range(max(1, len(remainder) - len(divisor) + 1))]
    assert divisor[-1] == [F(1)]
    while len(remainder) >= len(divisor) and remainder != [[F(0)]]:
        degree = len(remainder) - len(divisor)
        coefficient = remainder[-1]
        quotient[degree] = coefficient
        for index, value in enumerate(divisor):
            remainder[index + degree] = q_mod(
                q_sub(
                    remainder[index + degree],
                    q_mul(coefficient, value),
                ),
                modulus,
            )
        while len(remainder) > 1 and remainder[-1] == [F(0)]:
            remainder.pop()
    return quotient, remainder


def kq_add(left: Poly, right: Poly, modulus: Poly) -> Poly:
    return q_mod(q_add(left, right), modulus)


def kq_sub(left: Poly, right: Poly, modulus: Poly) -> Poly:
    return q_mod(q_sub(left, right), modulus)


def kq_mul(left: Poly, right: Poly, modulus: Poly) -> Poly:
    return q_mod(q_mul(left, right), modulus)


def qu_normalize(poly: list[Poly]) -> list[Poly]:
    result = [q_normalize(value) for value in poly]
    while len(result) > 1 and result[-1] == [F(0)]:
        result.pop()
    return result


def qu_divmod_field(
    dividend: list[Poly], divisor: list[Poly], modulus: Poly
) -> tuple[list[Poly], list[Poly]]:
    """Euclidean division in (Q[s]/modulus)[u]."""
    remainder = qu_normalize([q_mod(value, modulus) for value in dividend])
    divisor = qu_normalize([q_mod(value, modulus) for value in divisor])
    if divisor == [[F(0)]]:
        raise ZeroDivisionError
    quotient = [[F(0)] for _ in range(max(1, len(remainder) - len(divisor) + 1))]
    inverse_lead = q_inverse_mod(divisor[-1], modulus)
    while len(remainder) >= len(divisor) and remainder != [[F(0)]]:
        degree = len(remainder) - len(divisor)
        coefficient = kq_mul(remainder[-1], inverse_lead, modulus)
        quotient[degree] = coefficient
        for index, value in enumerate(divisor):
            remainder[index + degree] = kq_sub(
                remainder[index + degree],
                kq_mul(coefficient, value, modulus),
                modulus,
            )
        remainder = qu_normalize(remainder)
    return qu_normalize(quotient), remainder


def qu_gcd_with_degrees(
    left: list[Poly], right: list[Poly], modulus: Poly
) -> tuple[list[Poly], tuple[int, ...]]:
    """Exact quotient-field gcd plus the nonzero Euclidean degree trace."""
    left = qu_normalize(left)
    right = qu_normalize(right)
    degrees = [len(left) - 1]
    if len(right) - 1 != degrees[-1]:
        degrees.append(len(right) - 1)
    while right != [[F(0)]]:
        _, remainder = qu_divmod_field(left, right, modulus)
        left, right = right, remainder
        if right != [[F(0)]]:
            degrees.append(len(right) - 1)
    inverse_lead = q_inverse_mod(left[-1], modulus)
    monic = [kq_mul(value, inverse_lead, modulus) for value in left]
    return qu_normalize(monic), tuple(degrees)


def sturm_sequence(poly: Poly) -> tuple[Poly, ...]:
    sequence = [q_normalize(poly), q_derivative(poly)]
    while sequence[-1] != [F(0)]:
        _, remainder = q_divmod(sequence[-2], sequence[-1])
        if remainder == [F(0)]:
            break
        sequence.append(q_neg(remainder))
    return tuple(sequence)


def sign(value: F) -> int:
    return 1 if value > 0 else -1 if value < 0 else 0


def sturm_variations(sequence: tuple[Poly, ...], point: F) -> int:
    signs = [sign(q_eval(poly, point)) for poly in sequence]
    signs = [value for value in signs if value]
    return sum(left != right for left, right in zip(signs, signs[1:]))


def sturm_variations_infinity(sequence: tuple[Poly, ...]) -> int:
    signs = [sign(poly[-1]) for poly in sequence]
    return sum(left != right for left, right in zip(signs, signs[1:]))


def sturm_count(sequence: tuple[Poly, ...], left: F, right: F) -> int:
    return sturm_variations(sequence, left) - sturm_variations(sequence, right)


def positive_root_count(poly: Poly) -> int:
    sequence = sturm_sequence(poly)
    return sturm_variations(sequence, F(0)) - sturm_variations_infinity(sequence)


def cauchy_integer_bound(poly: Poly) -> int:
    ratio = max(abs(value / poly[-1]) for value in poly[:-1])
    return 2 + ratio.numerator // ratio.denominator


def isolate_positive_roots(poly: Poly) -> list[Interval]:
    sequence = sturm_sequence(poly)
    upper = F(cauchy_integer_bound(poly))
    total = sturm_count(sequence, F(0), upper)
    stack = [(F(0), upper, total)]
    result: list[Interval] = []
    while stack:
        left, right, count = stack.pop()
        if count == 0:
            continue
        if count == 1:
            result.append((left, right))
            continue
        middle = (left + right) / 2
        assert q_eval(poly, middle) != 0
        left_count = sturm_count(sequence, left, middle)
        stack.append((middle, right, count - left_count))
        stack.append((left, middle, left_count))
    return sorted(result)


def refine_root_box(poly: Poly, box: Interval, predicate) -> Interval:
    sequence = sturm_sequence(poly)
    left, right = box
    for _ in range(320):
        if predicate((left, right)):
            return left, right
        middle = (left + right) / 2
        assert q_eval(poly, middle) != 0
        if sturm_count(sequence, left, middle) == 1:
            right = middle
        else:
            left = middle
    raise AssertionError("exact interval predicate did not separate")


def i_add(left: Interval, right: Interval) -> Interval:
    return left[0] + right[0], left[1] + right[1]


def i_neg(value: Interval) -> Interval:
    return -value[1], -value[0]


def i_sub(left: Interval, right: Interval) -> Interval:
    return i_add(left, i_neg(right))


def i_mul(left: Interval, right: Interval) -> Interval:
    products = (
        left[0] * right[0], left[0] * right[1],
        left[1] * right[0], left[1] * right[1],
    )
    return min(products), max(products)


def i_inverse(value: Interval) -> Interval:
    if value[0] <= 0 <= value[1]:
        raise ZeroDivisionError
    return min(F(1, 1) / value[0], F(1, 1) / value[1]), max(
        F(1, 1) / value[0], F(1, 1) / value[1]
    )


def i_div(left: Interval, right: Interval) -> Interval:
    return i_mul(left, i_inverse(right))


def i_power(value: Interval, exponent: int) -> Interval:
    result = (F(1), F(1))
    factor = value
    while exponent:
        if exponent & 1:
            result = i_mul(result, factor)
        factor = i_mul(factor, factor)
        exponent >>= 1
    return result


def i_poly(poly: tuple[F, ...] | Poly, value: Interval) -> Interval:
    result = (F(0), F(0))
    for coefficient in reversed(poly):
        result = i_add(i_mul(result, value), (coefficient, coefficient))
    return result


def interval_q_data(
    s_box: Interval, q0: tuple[F, ...], q1: tuple[F, ...]
) -> tuple[Interval, Interval, Interval, Interval, Interval]:
    q0_box = i_poly(q0, s_box)
    q1_box = i_poly(q1, s_box)
    discriminant = i_sub(i_power(q1_box, 2), i_mul((F(4), F(4)), q0_box))
    h = i_power(
        i_div(
            i_add((F(1), F(1)), i_mul((F(16), F(16)), s_box)),
            i_add((F(1), F(1)), s_box),
        ),
        2,
    )
    q_at_h = i_add(i_add(i_power(h, 2), i_mul(q1_box, h)), q0_box)
    derivative_at_h = i_add(i_mul((F(2), F(2)), h), q1_box)
    return q0_box, q1_box, discriminant, q_at_h, derivative_at_h


def bivar_substitute_ratio(poly: Bivar, numerator: Poly, denominator: Poly) -> Poly:
    maximum_u = max(u for _, u in poly)
    result = [F(0)]
    for (s_exponent, u_exponent), coefficient in poly.items():
        coefficient_poly = [F(0)] * (s_exponent + 1)
        coefficient_poly[s_exponent] = coefficient
        term = q_mul(
            coefficient_poly,
            q_mul(
                q_power(numerator, u_exponent),
                q_power(denominator, maximum_u - u_exponent),
            ),
        )
        result = q_add(result, term)
    return result


def sparse_even_to_bivar(poly: Sparse, component: int = 0) -> Bivar:
    result: Bivar = {}
    for (x_exponent, r_exponent), value in poly.items():
        assert x_exponent % 2 == 0 and r_exponent % 2 == 0
        if value[component]:
            result[x_exponent // 2, r_exponent // 2] = F(value[component])
    return result


def gaussian_power(value: tuple[F, F], exponent: int) -> tuple[F, F]:
    result = (F(1), F(0))
    factor = value
    while exponent:
        if exponent & 1:
            result = (
                result[0] * factor[0] - result[1] * factor[1],
                result[0] * factor[1] + result[1] * factor[0],
            )
        factor = (
            factor[0] ** 2 - factor[1] ** 2,
            2 * factor[0] * factor[1],
        )
        exponent >>= 1
    return result


def inverse_square_interval(multiplier: int, x_box: Interval) -> tuple[Interval, Interval]:
    n_squared_x_squared = i_mul(
        (F(multiplier * multiplier), F(multiplier * multiplier)),
        i_power(x_box, 2),
    )
    denominator = i_power(
        i_add((F(1), F(1)), n_squared_x_squared), 2
    )
    real = i_div(i_sub((F(1), F(1)), n_squared_x_squared), denominator)
    imaginary = i_div(
        i_mul((F(-2 * multiplier), F(-2 * multiplier)), x_box),
        denominator,
    )
    return real, imaginary


def phase_value_interval(
    x_box: Interval, ratio_box: Interval, phase: tuple[F, F]
) -> Interval:
    a_real, a_imaginary = inverse_square_interval(1, x_box)
    c_real, c_imaginary = inverse_square_interval(4, x_box)
    phase_four = gaussian_power(phase, 4)
    low = i_sub(
        i_mul(a_real, (phase[0], phase[0])),
        i_mul(a_imaginary, (phase[1], phase[1])),
    )
    high = i_sub(
        i_mul(c_real, (phase_four[0], phase_four[0])),
        i_mul(c_imaginary, (phase_four[1], phase_four[1])),
    )
    return i_add(low, i_mul(ratio_box, high))


# ---------------------------------------------------------------------------
# Certificate tests.


class OneFourPhaseTransversalityTheoremTests(unittest.TestCase):
    def test_frozen_dependencies(self) -> None:
        for relative, expected in PROTECTED_HASHES.items():
            digest = hashlib.sha256((ROOT / relative).read_bytes()).hexdigest()
            self.assertEqual(digest, expected, relative)

    def test_h_k_structure_and_reduced_integer_system(self) -> None:
        a, c, a_bar, c_bar, h0, h1, h2, reduced = symbolic_data()
        f_poly = {
            8: sp_mul(RR, c), 5: a, 3: a_bar, 0: sp_mul(RR, c_bar)
        }
        g_poly = {
            8: sp_mul(RR, sp_power(c, 2)),
            5: sp_power(a, 2),
            3: sp_power(a_bar, 2),
            0: sp_mul(RR, sp_power(c_bar, 2)),
        }
        l_poly = zp_sub(zp_scale(f_poly, c), g_poly)
        h_from_combination = zp_sub(
            zp_mul({3: sp_mul(RR, c), 0: a}, l_poly),
            zp_scale(f_poly, sp_mul(a, sp_sub(c, a))),
        )
        self.assertEqual(h_from_combination, {6: h2, 3: h1, 0: h0})
        self.assertTrue(h2)

        degree_data = tuple(
            (max(s for s, _ in poly), max(u for _, u in poly))
            for poly in reduced
        )
        self.assertEqual(degree_data, ((32, 6), (32, 6), (40, 7), (40, 7)))
        self.assertEqual(tuple(len(poly) for poly in reduced), (222, 224, 315, 319))
        self.assertTrue(all(
            value.denominator == 1 for poly in reduced for value in poly.values()
        ))

    def test_deterministic_exact_projection_certificate(self) -> None:
        certificate = exact_projection_certificate()
        self.assertEqual(int(certificate["maximum_coefficient"]).bit_length(), 206)
        self.assertLess(int(certificate["coefficient_bound"]), 2 ** 2983)
        self.assertGreater(
            int(certificate["modulus"]), 2 * int(certificate["coefficient_bound"])
        )
        self.assertEqual(certificate["prime_count"], 150)
        self.assertEqual(int(certificate["modulus"]).bit_length(), 2990)
        self.assertEqual(certificate["degrees"], (542, 542, 542))
        self.assertEqual(certificate["coefficient_bits"], (2410, 2418, 2438))
        self.assertEqual(certificate["d_degree"], 331)
        self.assertEqual(certificate["quotient_degrees"], (211, 211, 211))
        self.assertEqual(certificate["quotient_leads"], (810823, 233257, 258940))
        self.assertEqual(certificate["quotient_gcd"], [1])
        self.assertEqual(certificate["full_gcd"], certificate["d_mod"])

    def test_a22_triangular_lifts_sturm_counts_and_rho_classification(self) -> None:
        reduced = symbolic_data()[-1]
        a_poly = q_normalize(A22)
        b_poly = q_normalize(B19)
        self.assertEqual(content_gcd(A22), 1)
        self.assertEqual(q_gcd(a_poly, q_derivative(a_poly)), [F(1)])
        self.assertEqual(q_gcd(a_poly, b_poly), [F(1)])
        self.assertEqual(positive_root_count(a_poly), 12)

        q0_tuple, q1_tuple = reconstruct_a_quadratic()
        a_monic = q_scale(a_poly, F(1, 1) / a_poly[-1])
        divisor = [list(q0_tuple), list(q1_tuple), [F(1)]]
        cofactors = []
        for poly in reduced:
            quotient, remainder = qu_divmod_monic(
                bivar_to_qu(poly, a_monic), divisor, a_monic
            )
            self.assertEqual(remainder, [[F(0)]])
            cofactors.append(quotient)

        cofactor_gcd, degree_trace = qu_gcd_with_degrees(
            cofactors[0], cofactors[1], a_monic
        )
        self.assertEqual(cofactor_gcd, [[F(1)]])
        self.assertEqual(degree_trace, (4, 3, 2, 1, 0))

        good_prime = 1153
        self.assertTrue(irreducible_certificate(A22, good_prime))
        modular_gcd = component_u_gcd(
            reduced, fp_normalize(list(A22), good_prime), good_prime
        )
        self.assertEqual(len(modular_gcd) - 1, 2)
        expected_modular = []
        for coefficient in (q0_tuple, q1_tuple):
            expected_modular.append(fp_normalize(
                [fraction_mod(value, good_prime) for value in coefficient],
                good_prime,
            ))
        expected_modular.append([1])
        self.assertEqual(modular_gcd, expected_modular)

        initial_boxes = isolate_positive_roots(a_poly)
        self.assertEqual(len(initial_boxes), 12)

        def separated(box: Interval) -> bool:
            q0_box, q1_box, discriminant, q_at_h, derivative = interval_q_data(
                box, q0_tuple, q1_tuple
            )
            return (
                q1_box[1] < 0
                and discriminant[0] > 0
                and (q0_box[0] > 0 or q0_box[1] < 0)
                and (q_at_h[0] > 0 or q_at_h[1] < 0)
                and (derivative[0] > 0 or derivative[1] < 0)
            )

        boxes = [refine_root_box(a_poly, box, separated) for box in initial_boxes]
        q0_signs = []
        positive_lifts = []
        below_threshold = 0
        for index, box in enumerate(boxes):
            q0_box, q1_box, discriminant, q_at_h, derivative = interval_q_data(
                box, q0_tuple, q1_tuple
            )
            self.assertLess(q1_box[1], 0)
            self.assertGreater(discriminant[0], 0)
            q0_sign = 1 if q0_box[0] > 0 else -1
            q0_signs.append(q0_sign)
            lift_count = 2 if q0_sign > 0 else 1
            positive_lifts.append(lift_count)

            if q0_sign < 0:
                # h>0 lies between the negative and positive roots exactly when Q(h)<0.
                self.assertLess(q_at_h[1], 0)
            elif index == 0:
                # h lies strictly between the two positive roots.
                self.assertLess(q_at_h[1], 0)
                below_threshold += 1
            else:
                # Q(h)>0 and Q'(h)<0 put h below both positive roots.
                self.assertGreater(q_at_h[0], 0)
                self.assertLess(derivative[1], 0)

        self.assertEqual(q0_signs, [1, -1] * 6)
        self.assertEqual(positive_lifts, [2, 1] * 6)
        self.assertEqual(sum(positive_lifts), 18)
        self.assertEqual(below_threshold, 1)

        # Locate the sole rho<1 branch inside the coarse four-phase fixture.
        first_box = boxes[0]
        x_box = (F(3349, 10000), F(67, 200))
        ratio_box = (F(431, 200), F(539, 250))
        low_u = ratio_box[0] ** 2
        high_u = ratio_box[1] ** 2

        def coarse_ratio_separated(box: Interval) -> bool:
            local_q0 = i_poly(q0_tuple, box)
            local_q1 = i_poly(q1_tuple, box)
            local_low = i_add(
                i_add(
                    (low_u ** 2, low_u ** 2),
                    i_mul(local_q1, (low_u, low_u)),
                ),
                local_q0,
            )
            local_high = i_add(
                i_add(
                    (high_u ** 2, high_u ** 2),
                    i_mul(local_q1, (high_u, high_u)),
                ),
                local_q0,
            )
            local_derivative = i_add((2 * high_u, 2 * high_u), local_q1)
            return (
                local_low[0] > 0
                and local_high[1] < 0
                and local_derivative[1] < 0
            )

        first_box = refine_root_box(a_poly, first_box, coarse_ratio_separated)
        self.assertLessEqual(x_box[0] ** 2, first_box[0])
        self.assertGreaterEqual(x_box[1] ** 2, first_box[1])
        q0_box = i_poly(q0_tuple, first_box)
        q1_box = i_poly(q1_tuple, first_box)
        at_low = i_add(
            i_add((low_u ** 2, low_u ** 2), i_mul(q1_box, (low_u, low_u))),
            q0_box,
        )
        at_high = i_add(
            i_add((high_u ** 2, high_u ** 2), i_mul(q1_box, (high_u, high_u))),
            q0_box,
        )
        derivative_high = i_add((2 * high_u, 2 * high_u), q1_box)
        self.assertGreater(at_low[0], 0)
        self.assertLess(at_high[1], 0)
        self.assertLess(derivative_high[1], 0)

    def test_b19_degenerate_lift_compatibility_and_repeated_h(self) -> None:
        reduced = symbolic_data()[-1]
        self.assertEqual(ip_mul(B2, B17), list(B19))
        self.assertEqual(content_gcd(B19), 1)
        self.assertEqual(content_gcd(B17), 1)
        b_poly = q_normalize(B19)
        self.assertEqual(q_gcd(b_poly, q_derivative(b_poly)), [F(1)])
        self.assertEqual(positive_root_count(b_poly), 9)

        amplitude_numerator = q_power([F(1), F(16)], 2)
        amplitude_denominator = q_power([F(1), F(1)], 2)
        for factor, prime in ((B2, 1009), (B17, 1069)):
            factor_poly = q_normalize(factor)
            self.assertEqual(q_gcd(factor_poly, amplitude_denominator), [F(1)])
            factor_monic = q_scale(factor_poly, F(1, 1) / factor_poly[-1])
            amplitude = kq_mul(
                amplitude_numerator,
                q_inverse_mod(amplitude_denominator, factor_monic),
                factor_monic,
            )
            linear_divisor = [q_neg(amplitude), [F(1)]]
            cofactors = []
            for poly in reduced:
                substituted = bivar_substitute_ratio(
                    poly, amplitude_numerator, amplitude_denominator
                )
                self.assertEqual(q_mod(substituted, factor_poly), [F(0)])
                quotient, remainder = qu_divmod_monic(
                    bivar_to_qu(poly, factor_monic),
                    linear_divisor,
                    factor_monic,
                )
                self.assertEqual(remainder, [[F(0)]])
                cofactors.append(quotient)
            cofactor_gcd, degree_trace = qu_gcd_with_degrees(
                cofactors[0], cofactors[1], factor_monic
            )
            self.assertEqual(cofactor_gcd, [[F(1)]])
            expected_trace = (5, 2, 1, 0) if factor == B2 else (5, 4, 3, 2, 1, 0)
            self.assertEqual(degree_trace, expected_trace)
            self.assertTrue(irreducible_certificate(factor, prime))
            modular_factor = fp_normalize(list(factor), prime)
            modular_gcd = component_u_gcd(reduced, modular_factor, prime)
            self.assertEqual(len(modular_gcd) - 1, 1)

            denominator_mod = fp_normalize(
                [fraction_mod(value, prime) for value in amplitude_denominator], prime
            )
            numerator_mod = fp_normalize(
                [fraction_mod(value, prime) for value in amplitude_numerator], prime
            )
            inverse = field_inverse(denominator_mod, modular_factor, prime)
            amplitude_mod = field_mul(numerator_mod, inverse, modular_factor, prime)
            self.assertEqual(
                modular_gcd,
                [field_sub([0], amplitude_mod, modular_factor, prime), [1]],
            )

        a, c, a_bar, c_bar, h0, h1, h2, _ = symbolic_data()
        e_hat = sp_sub(
            sp_mul(
                sp_power(a_bar, 4),
                sp_mul(c, sp_power(sp_sub(c_bar, a_bar), 3)),
            ),
            sp_mul(
                sp_power(a, 4),
                sp_mul(c_bar, sp_power(sp_sub(a, c), 3)),
            ),
        )
        self.assertTrue(all(value[1] == 0 for value in e_hat.values()))
        self.assertTrue(all(r_exponent == 0 for _, r_exponent in e_hat))
        e_after_x4 = [0] * 23
        for (x_exponent, _), value in e_hat.items():
            self.assertGreaterEqual(x_exponent, 4)
            self.assertEqual(x_exponent % 2, 0)
            e_after_x4[(x_exponent - 4) // 2] = value[0]
        expected_e = ip_mul([1, 1], ip_mul(ip_power([1, 16], 9), E12))
        expected_e = [-54 * value for value in expected_e]
        self.assertEqual(e_after_x4, expected_e)
        self.assertEqual(q_gcd(q_normalize(B19), q_normalize(E12)), [F(1)])

        discriminant = sp_sub(sp_power(h1, 2), sp_mul(sp_const(4), sp_mul(h2, h0)))
        self.assertTrue(all(value[1] == 0 for value in discriminant.values()))
        discriminant_bivar = sparse_even_to_bivar(discriminant)
        repeated_numerator = bivar_substitute_ratio(
            discriminant_bivar, amplitude_numerator, amplitude_denominator
        )
        repeated_gcd = q_gcd(repeated_numerator, q_normalize(B19))
        self.assertEqual(repeated_gcd, [F(-3, 16), F(-17, 16), F(1)])
        self.assertEqual(positive_root_count(repeated_gcd), 1)

    def test_exceptional_branch_four_phase_sign_fixture(self) -> None:
        x_box = (F(3349, 10000), F(67, 200))
        ratio_box = (F(431, 200), F(539, 250))
        phases = (
            (F(1), F(0)),
            (F(7, 25), F(24, 25)),
            (F(0), F(1)),
            (F(-1), F(0)),
        )
        values = tuple(
            phase_value_interval(x_box, ratio_box, phase) for phase in phases
        )
        self.assertGreater(values[0][0], F(49, 100))
        self.assertLess(values[1][1], F(-1, 25))
        self.assertGreater(values[2][0], F(8, 25))
        self.assertLess(values[3][1], F(-93, 100))
        signs = tuple(1 if value[0] > 0 else -1 if value[1] < 0 else 0 for value in values)
        self.assertEqual(signs, (1, -1, 1, -1))
        self.assertEqual(sum(
            signs[index] != signs[(index + 1) % 4] for index in range(4)
        ), 4)

    def test_note_serialization_and_fail_closed_scope(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        required = (
            "some phase has }P>0\\text{ and }{\\cal C}<0",
            "global exact bound",
            "at most two distinct common roots",
            "h_2y^2+h_1y+h_0\\mid K(y)",
            "Deterministic exact projection certificate",
            "150` consecutive primes",
            "A_{22}(s)^2B_{19}(s)^3",
            "good prime `1153`",
            "exactly eighteen",
            "multiplier-degenerate",
            "E_{12}",
            "gcd(B_{19},E_{12})=1",
            "17+\\sqrt{481}",
            "rho>1` on seventeen",
            "{7+24i\\over25}",
            "at least four distinct sign-changing zeros",
            "P0_INVALIDATED",
            "Primitive `1:q` problems for even `q >= 6`",
            "No such actual-zeta",
            "changes no checkpoint status",
        )
        for token in required:
            self.assertIn(token, text)

        forbidden = (
            "RH is proved",
            "RH is false unconditionally",
            "equation (5.2) is proved",
            "all finite phase-locked edges are solved",
            "primitive `1:q` with even `q>=6` is closed",
            "actual zeta edge has ratio `1:4`",
            "CRT stabilization proves",
            "Numerical searches prove",
        )
        for token in forbidden:
            self.assertNotIn(token, text)
        self.assertEqual(text.count(r"\["), text.count(r"\]"))
        tags = re.findall(r"\\tag\{([^}]+)\}", text)
        self.assertEqual(len(tags), len(set(tags)))

    def test_package_contains_only_clean_raw_bytes(self) -> None:
        for path in (NOTE, TEST):
            bad = [
                (offset, byte)
                for offset, byte in enumerate(path.read_bytes())
                if (byte < 32 and byte != 10) or byte == 127
            ]
            self.assertEqual(bad, [], path.name)


if __name__ == "__main__":
    unittest.main()
