#!/usr/bin/env python3
"""Independent diagnostic replay of the continuous multiplier form.

This path reconstructs CCM (3.5), (3.8)--(3.11), and (3.19) without
importing the producer multiplier helper or a cached Weil matrix.  Its
large-frequency correction uses a displayed asymptotic expansion through
order t**(-6); it is a high-precision factor/sign regression, not a rigorous
interval tail certificate.  It shares mpmath with the source-distribution
path, which is an explicit library limitation.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction

import mpmath as mp


def _parse_lambda(lambda_text: str) -> tuple[Fraction, mp.mpf]:
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact decimal text")
    exact = Fraction(lambda_text)
    if exact <= 1:
        raise ValueError("lambda must exceed one")
    return exact, mp.mpf(lambda_text)


def independent_prime_powers(lambda_text: str) -> list[tuple[int, int]]:
    """Sieve primes, then generate every power through exact lambda squared."""

    exact, _ = _parse_lambda(lambda_text)
    square = exact * exact
    cutoff = square.numerator // square.denominator
    sieve = [True] * (cutoff + 1)
    sieve[0] = False
    if cutoff >= 1:
        sieve[1] = False
    prime = 2
    while prime * prime <= cutoff:
        if sieve[prime]:
            for composite in range(prime * prime, cutoff + 1, prime):
                sieve[composite] = False
        prime += 1

    terms: list[tuple[int, int]] = []
    for prime in range(2, cutoff + 1):
        if not sieve[prime]:
            continue
        power = prime
        while power <= cutoff:
            terms.append((power, prime))
            if power > cutoff // prime:
                break
            power *= prime
    return sorted(terms)


def source_mode_transform(
    lambda_text: str, mode: int, frequency: mp.mpf
) -> mp.mpf:
    """Centered source transform, including its removable lattice values."""

    _, lam = _parse_lambda(lambda_text)
    length = 2 * mp.log(lam)
    lattice = 2 * mp.pi * mode / length
    difference = frequency - lattice
    if difference == 0:
        return (-1) ** mode * mp.sqrt(length)
    return (
        2
        * mp.sin(frequency * length / 2)
        / (mp.sqrt(length) * difference)
    )


def _complex_mode_transform(lambda_text: str, mode: int, z: mp.mpc) -> mp.mpc:
    _, lam = _parse_lambda(lambda_text)
    length = 2 * mp.log(lam)
    lattice = 2 * mp.pi * mode / length
    return 2 * mp.sin(z * length / 2) / (mp.sqrt(length) * (z - lattice))


def pole_entry(lambda_text: str, left: int, right: int) -> mp.mpc:
    """Reconstruct CCM (3.11) after sesquilinear convolution."""

    plus = mp.j / 2
    minus = -plus
    return (
        mp.conj(_complex_mode_transform(lambda_text, left, minus))
        * _complex_mode_transform(lambda_text, right, plus)
        + mp.conj(_complex_mode_transform(lambda_text, left, plus))
        * _complex_mode_transform(lambda_text, right, minus)
    )


def arch_multiplier(t: mp.mpf) -> mp.mpf:
    z = mp.mpf(1) / 4 + mp.j * t / 2
    return mp.re(mp.digamma(z)) - mp.log(mp.pi)


def complete_multiplier(lambda_text: str, t: mp.mpf) -> mp.mpf:
    prime = mp.fsum(
        mp.log(base) / mp.sqrt(integer) * mp.cos(t * mp.log(integer))
        for integer, base in independent_prime_powers(lambda_text)
    )
    return arch_multiplier(t) - 2 * prime


def source_correlation(
    left: int, right: int, x: mp.mpf, length: mp.mpf
) -> mp.mpf:
    """CCM (2.9)--(2.10), independently of the matrix producer."""

    if left == right:
        return 2 * (1 - x / length) * mp.cos(2 * mp.pi * left * x / length)
    return (
        mp.sin(2 * mp.pi * right * x / length)
        - mp.sin(2 * mp.pi * left * x / length)
    ) / (mp.pi * (left - right))


def prime_multiplier_entry_by_fourier_identity(
    lambda_text: str, left: int, right: int
) -> mp.mpf:
    """Exact time-domain value of the minus-prime Fourier multiplier."""

    _, lam = _parse_lambda(lambda_text)
    length = 2 * mp.log(lam)
    return -mp.fsum(
        mp.log(base)
        / mp.sqrt(integer)
        * source_correlation(left, right, mp.log(integer), length)
        for integer, base in independent_prime_powers(lambda_text)
    )


@dataclass(frozen=True)
class DiagnosticTail:
    lambda_text: str
    truncation: mp.mpf
    length: mp.mpf
    prime_terms: tuple[tuple[int, int], ...]
    log_integrals: dict[int, mp.mpf]
    one_integrals: dict[int, mp.mpf]
    prime_integrals: dict[int, mp.mpf]


def _cos_power_tail(power: int, frequency: mp.mpf, truncation: mp.mpf) -> mp.mpf:
    frequency = abs(frequency)
    if frequency == 0:
        return 1 / ((power - 1) * truncation ** (power - 1))
    if power == 2:
        return (
            mp.cos(frequency * truncation) / truncation
            - frequency * (mp.pi / 2 - mp.si(frequency * truncation))
        )
    return mp.quadosc(
        lambda t: mp.cos(frequency * t) / t**power,
        [truncation, mp.inf],
        omega=frequency,
    )


def _sine_squared_cos_tail(
    power: int, frequency: mp.mpf, length: mp.mpf, truncation: mp.mpf
) -> mp.mpf:
    return (
        _cos_power_tail(power, frequency, truncation) / 2
        - _cos_power_tail(power, frequency + length, truncation) / 4
        - _cos_power_tail(power, abs(frequency - length), truncation) / 4
    )


def _sine_squared_log_tail(
    power: int, length: mp.mpf, truncation: mp.mpf
) -> mp.mpf:
    nonoscillatory = (
        mp.log(truncation / (2 * mp.pi)) / (power - 1)
        + 1 / mp.mpf((power - 1) ** 2)
    ) / truncation ** (power - 1)
    oscillatory = mp.quadosc(
        lambda t: (
            mp.cos(length * t)
            * mp.log(t / (2 * mp.pi))
            / t**power
        ),
        [truncation, mp.inf],
        omega=length,
    )
    return (nonoscillatory - oscillatory) / 2


def make_diagnostic_tail(
    lambda_text: str, truncation_text: str = "60"
) -> DiagnosticTail:
    _, lam = _parse_lambda(lambda_text)
    truncation = mp.mpf(truncation_text)
    length = 2 * mp.log(lam)
    if truncation <= 4 * mp.pi / length:
        raise ValueError("diagnostic truncation is too close to source frequencies")
    terms = tuple(independent_prime_powers(lambda_text))
    log_integrals: dict[int, mp.mpf] = {}
    one_integrals: dict[int, mp.mpf] = {}
    prime_integrals: dict[int, mp.mpf] = {}
    for power in (2, 4, 6):
        log_integrals[power] = _sine_squared_log_tail(
            power, length, truncation
        )
        one_integrals[power] = (
            _cos_power_tail(power, mp.mpf(0), truncation)
            - _cos_power_tail(power, length, truncation)
        ) / 2
        prime_integrals[power] = mp.fsum(
            mp.log(base)
            / mp.sqrt(integer)
            * _sine_squared_cos_tail(
                power, mp.log(integer), length, truncation
            )
            for integer, base in terms
        )
    return DiagnosticTail(
        lambda_text=lambda_text,
        truncation=+truncation,
        length=+length,
        prime_terms=terms,
        log_integrals=log_integrals,
        one_integrals=one_integrals,
        prime_integrals=prime_integrals,
    )


def _asymptotic_tail_entry(tail: DiagnosticTail, left: int, right: int) -> mp.mpf:
    """Tail through t**(-6); the omitted remainder is not interval-bounded."""

    left_frequency = 2 * mp.pi * left / tail.length
    right_frequency = 2 * mp.pi * right / tail.length
    square_sum = left_frequency**2 + right_frequency**2
    product = left_frequency * right_frequency
    coefficient_four = square_sum + product
    coefficient_six = (
        square_sum**2 + product * square_sum - product**2
    )
    arch_two = -mp.mpf(1) / 24
    arch_four = -mp.mpf(7) / 960

    combined = tail.log_integrals[2] - 2 * tail.prime_integrals[2]
    combined += (
        coefficient_four
        * (tail.log_integrals[4] - 2 * tail.prime_integrals[4])
        + arch_two * tail.one_integrals[4]
    )
    combined += (
        coefficient_six
        * (tail.log_integrals[6] - 2 * tail.prime_integrals[6])
        + coefficient_four * arch_two * tail.one_integrals[6]
        + arch_four * tail.one_integrals[6]
    )
    return 4 * combined / (mp.pi * tail.length)


def diagnostic_multiplier_entry(
    tail: DiagnosticTail, left: int, right: int, step_text: str = "1"
) -> mp.mpf:
    """Numerically replay the real-axis multiplier with diagnostic tail."""

    step = mp.mpf(step_text)
    if step <= 0:
        raise ValueError("quadrature step must be positive")

    def symmetric_integrand(t: mp.mpf) -> mp.mpf:
        multiplier = complete_multiplier(tail.lambda_text, t)
        positive = source_mode_transform(tail.lambda_text, left, t)
        positive *= source_mode_transform(tail.lambda_text, right, t)
        negative = source_mode_transform(tail.lambda_text, left, -t)
        negative *= source_mode_transform(tail.lambda_text, right, -t)
        return multiplier * (positive + negative) / (2 * mp.pi)

    points = [mp.mpf(0)]
    point = step
    while point < tail.truncation:
        points.append(+point)
        point += step
    points.append(+tail.truncation)
    core = mp.quad(symmetric_integrand, points)
    return core + _asymptotic_tail_entry(tail, left, right)


def diagnostic_weil_entry(
    tail: DiagnosticTail, left: int, right: int, step_text: str = "1"
) -> mp.mpc:
    return diagnostic_multiplier_entry(tail, left, right, step_text) + pole_entry(
        tail.lambda_text, left, right
    )


__all__ = [
    "DiagnosticTail",
    "arch_multiplier",
    "complete_multiplier",
    "diagnostic_multiplier_entry",
    "diagnostic_weil_entry",
    "independent_prime_powers",
    "make_diagnostic_tail",
    "pole_entry",
    "prime_multiplier_entry_by_fourier_identity",
    "source_correlation",
    "source_mode_transform",
]
