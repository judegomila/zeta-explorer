"""Source-exact helpers for the parity-multiplier Schur reduction.

The functions here reconstruct the finite prime-power symbol from an exact
decimal lambda string.  They do not estimate the missing phase-volume lemma
and do not assert a signed-sector floor.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction
from typing import Union

import mpmath as mp


ExactInput = Union[str, int, mp.mpf]


def _mp_exact(value: ExactInput, label: str) -> mp.mpf:
    if isinstance(value, float):
        raise TypeError(f"{label} must not enter through binary64")
    if isinstance(value, str):
        try:
            Fraction(value)
        except (ValueError, ZeroDivisionError) as exc:
            raise ValueError(f"invalid exact decimal {label}") from exc
    if not isinstance(value, (str, int, mp.mpf)):
        raise TypeError(f"{label} must be exact decimal text, int, or mpf")
    return mp.mpf(value)


def parse_lambda(lambda_text: str) -> tuple[Fraction, mp.mpf]:
    """Parse lambda exactly for the integer cutoff and at current mp precision."""

    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact decimal text")
    try:
        exact = Fraction(lambda_text)
    except (ValueError, ZeroDivisionError) as exc:
        raise ValueError("invalid exact decimal lambda") from exc
    if exact <= 1:
        raise ValueError("lambda must exceed one")
    return exact, mp.mpf(lambda_text)


def prime_power_bases(lambda_text: str) -> list[tuple[int, int]]:
    """Return every ``(p**k, p)`` at most lambda squared, exactly once."""

    exact, _ = parse_lambda(lambda_text)
    square = exact * exact
    cutoff = square.numerator // square.denominator
    sieve = [True] * (cutoff + 1)
    if cutoff >= 0:
        sieve[0] = False
    if cutoff >= 1:
        sieve[1] = False
    candidate = 2
    while candidate * candidate <= cutoff:
        if sieve[candidate]:
            for composite in range(candidate * candidate, cutoff + 1, candidate):
                sieve[composite] = False
        candidate += 1

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
    terms.sort()
    return terms


def theta_prime(t: ExactInput) -> mp.mpf:
    """CCM (3.9), differentiated without numerical differentiation."""

    value = _mp_exact(t, "t")
    z = mp.mpf(1) / 4 + mp.j * value / 2
    return (mp.re(mp.digamma(z)) - mp.log(mp.pi)) / 2


def source_mode_transform(lambda_text: str, mode: int, t: ExactInput) -> mp.mpf:
    """Centered transform (4.2a), including its removable values."""

    if not isinstance(mode, int):
        raise TypeError("mode must be an integer")
    _, lam = parse_lambda(lambda_text)
    value = _mp_exact(t, "t")
    length = 2 * mp.log(lam)
    frequency = 2 * mp.pi * mode / length
    denominator = value - frequency
    if denominator == 0:
        return (-1) ** mode * mp.sqrt(length)
    return 2 * mp.sin(value * length / 2) / (mp.sqrt(length) * denominator)


def complete_multiplier(lambda_text: str, t: ExactInput) -> mp.mpf:
    """Equation (2.1), retaining the source minus sign on every prime power."""

    _, _ = parse_lambda(lambda_text)
    value = _mp_exact(t, "t")
    prime_sum = mp.fsum(
        mp.log(prime) / mp.sqrt(integer) * mp.cos(value * mp.log(integer))
        for integer, prime in prime_power_bases(lambda_text)
    )
    return 2 * theta_prime(value) - 2 * prime_sum


def prime_amplitude_sum(lambda_text: str) -> mp.mpf:
    """Return the exact finite sum Sigma_lambda in equation (4.8)."""

    _, _ = parse_lambda(lambda_text)
    return mp.fsum(
        mp.log(prime) / mp.sqrt(integer)
        for integer, prime in prime_power_bases(lambda_text)
    )


def multiplier_absolute_lower(lambda_text: str, t: ExactInput) -> mp.mpf:
    """Return the explicit right side of equation (4.11)."""

    value = _mp_exact(t, "t")
    return (
        mp.digamma(mp.mpf(1) / 4)
        - mp.log(mp.pi)
        + mp.log(1 + 4 * value**2) / 2
        - 2 * prime_amplitude_sum(lambda_text)
    )


def absolute_phase_volume_bound(
    lambda_text: str, U: ExactInput, g: ExactInput
) -> mp.mpf:
    """Point-evaluate the exact bound in (4.12), without directed rounding."""

    shift = _mp_exact(U, "U")
    baseline = _mp_exact(g, "g")
    if baseline <= 0:
        raise ValueError("g must be positive")
    A = (
        baseline
        + shift
        + 2 * prime_amplitude_sum(lambda_text)
        - mp.digamma(mp.mpf(1) / 4)
        + mp.log(mp.pi)
    )
    if A <= 0:
        return mp.mpf(0)
    endpoint = mp.sqrt(mp.expm1(2 * A))
    return endpoint - mp.atan(endpoint)


def fks_linear_chebyshev_constant() -> mp.mpf:
    """Return the explicit C_psi in equation (4.13)."""

    coefficient = mp.mpf("9.22022")
    exponent = mp.mpf("0.8476836")
    return 1 + coefficient * (3 / exponent) ** 3 * mp.exp(-3)


def prime_amplitude_linear_bound(lambda_text: str) -> mp.mpf:
    """Return C_psi(2 lambda-1), the right side of equation (4.14)."""

    _, lam = parse_lambda(lambda_text)
    return fks_linear_chebyshev_constant() * (2 * lam - 1)


def pole_representer_norm_squared(lambda_text: str, parity: int) -> mp.mpf:
    """Return equation (3.4) for parity ``+1`` or ``-1``."""

    _, lam = parse_lambda(lambda_text)
    if parity not in (-1, 1):
        raise ValueError("parity must be +1 or -1")
    ell = mp.log(lam)
    return mp.sinh(ell) + parity * ell


def pole_operator_coefficient(parity: int) -> int:
    """Coefficient of ``|p_epsilon><p_epsilon|`` in equation (3.2)."""

    if parity not in (-1, 1):
        raise ValueError("parity must be +1 or -1")
    return 2 * parity


@dataclass(frozen=True)
class DangerousDimensionBound:
    parity: int
    trace_upper: mp.mpf
    real_dimension_upper: mp.mpf
    integer_dimension_upper_diagnostic: int
    outward_certified: bool


def dangerous_dimension_bound(
    lambda_text: str,
    phase_volume: ExactInput,
    g: ExactInput,
    delta: ExactInput,
    parity: int,
) -> DangerousDimensionBound:
    """Evaluate (5.4) or (5.5) from a supplied rigorous phase-volume bound.

    This function deliberately does not approximate the phase volume.  The
    caller must supply a nonnegative upper enclosure proved independently.
    The mpmath evaluation itself is not outward rounded, so its integer field
    is diagnostic and cannot be used as a certificate.
    """

    _, lam = parse_lambda(lambda_text)
    phi = _mp_exact(phase_volume, "phase_volume")
    gap = _mp_exact(g, "g") - _mp_exact(delta, "delta")
    if parity not in (-1, 1):
        raise ValueError("parity must be +1 or -1")
    if phi < 0:
        raise ValueError("phase-volume upper bound must be nonnegative")
    if gap <= 0 or _mp_exact(delta, "delta") <= 0:
        raise ValueError("require 0 < delta < g")

    length = 2 * mp.log(lam)
    trace = length * phi / (2 * mp.pi)
    if parity == -1:
        trace += 2 * pole_representer_norm_squared(lambda_text, -1)
    real_bound = trace / gap
    return DangerousDimensionBound(
        parity=parity,
        trace_upper=+trace,
        real_dimension_upper=+real_bound,
        integer_dimension_upper_diagnostic=int(mp.floor(real_bound)),
        outward_certified=False,
    )


def dangerous_dimension_bound_rank_one_pole(
    lambda_text: str,
    phase_volume: ExactInput,
    g: ExactInput,
    delta: ExactInput,
    parity: int,
) -> DangerousDimensionBound:
    """Evaluate the rank-one-pole dangerous-rank alternative (5.4)/(5.8).

    In the odd sector the negative pole is isolated as one explicit span,
    rather than charged by its trace.  The returned ``trace_upper`` is the
    multiplier trace only; ``real_dimension_upper`` adds exactly one for the
    odd pole.  As elsewhere in this module, point arithmetic is not an
    outward-rounded certificate.
    """

    _, lam = parse_lambda(lambda_text)
    phi = _mp_exact(phase_volume, "phase_volume")
    gap = _mp_exact(g, "g") - _mp_exact(delta, "delta")
    if parity not in (-1, 1):
        raise ValueError("parity must be +1 or -1")
    if phi < 0:
        raise ValueError("phase-volume upper bound must be nonnegative")
    if gap <= 0 or _mp_exact(delta, "delta") <= 0:
        raise ValueError("require 0 < delta < g")

    length = 2 * mp.log(lam)
    trace = length * phi / (2 * mp.pi)
    real_bound = trace / gap + (1 if parity == -1 else 0)
    return DangerousDimensionBound(
        parity=parity,
        trace_upper=+trace,
        real_dimension_upper=+real_bound,
        integer_dimension_upper_diagnostic=int(mp.floor(real_bound)),
        outward_certified=False,
    )


def schur_floor(
    sigma: ExactInput,
    delta: ExactInput,
    inverse_coupling_norm: ExactInput,
) -> mp.mpf:
    """Point-evaluate the exact floor in (6.3), without directed rounding."""

    sigma_value = _mp_exact(sigma, "sigma")
    delta_value = _mp_exact(delta, "delta")
    coupling = _mp_exact(inverse_coupling_norm, "inverse_coupling_norm")
    if sigma_value <= 0 or delta_value <= 0 or coupling < 0:
        raise ValueError("Schur and high floors must be positive; norm nonnegative")
    return min(sigma_value, delta_value) / (1 + coupling) ** 2


__all__ = [
    "DangerousDimensionBound",
    "absolute_phase_volume_bound",
    "complete_multiplier",
    "dangerous_dimension_bound",
    "dangerous_dimension_bound_rank_one_pole",
    "fks_linear_chebyshev_constant",
    "multiplier_absolute_lower",
    "parse_lambda",
    "pole_operator_coefficient",
    "pole_representer_norm_squared",
    "prime_amplitude_linear_bound",
    "prime_amplitude_sum",
    "prime_power_bases",
    "schur_floor",
    "source_mode_transform",
    "theta_prime",
]
