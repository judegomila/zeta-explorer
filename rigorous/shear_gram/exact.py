"""Strict parsing of user-supplied exact rational strings."""

from __future__ import annotations

import re
from typing import Final

from flint import acb, fmpq


class ExactInputError(ValueError):
    """An input was not an unambiguous, bounded exact rational string."""


_FRACTION_RE: Final = re.compile(r"([+-]?\d+)/(\d+)\Z")
_DECIMAL_RE: Final = re.compile(
    r"([+-]?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?\Z"
)
_MAX_TEXT_LENGTH: Final = 256
_MAX_EXPONENT: Final = 100_000


def parse_rational(text: str, *, name: str = "value") -> fmpq:
    """Parse an integer, fraction, decimal, or decimal exponent exactly.

    Python ``float`` values and JSON numeric values are intentionally rejected.
    Whitespace is rejected too, so a case has a unique canonical spelling after
    normalization.
    """

    if type(text) is not str:  # bool and float must not sneak through
        raise ExactInputError(f"{name} must be a string containing an exact rational")
    if not text or len(text) > _MAX_TEXT_LENGTH or text != text.strip():
        raise ExactInputError(f"{name} is not a bounded canonical rational string")

    fraction = _FRACTION_RE.fullmatch(text)
    if fraction is not None:
        numerator = int(fraction.group(1), 10)
        denominator = int(fraction.group(2), 10)
        if denominator == 0:
            raise ExactInputError(f"{name} has zero denominator")
        return fmpq(numerator, denominator)

    decimal = _DECIMAL_RE.fullmatch(text)
    if decimal is None:
        raise ExactInputError(f"{name} is not an exact rational string")

    sign, whole, fractional, exponent_text = decimal.groups()
    fractional = fractional or ""
    exponent = int(exponent_text or "0", 10)
    if abs(exponent) > _MAX_EXPONENT:
        raise ExactInputError(f"{name} exponent exceeds the safety bound")
    digits = whole + fractional
    numerator = int(digits, 10)
    if sign == "-":
        numerator = -numerator
    decimal_scale = len(fractional) - exponent
    if decimal_scale >= 0:
        return fmpq(numerator, 10**decimal_scale)
    return fmpq(numerator * 10 ** (-decimal_scale), 1)


def canonical_rational(value: fmpq) -> str:
    """Return FLINT's reduced, sign-normalized rational spelling."""

    if not isinstance(value, fmpq):
        raise TypeError("canonical_rational requires flint.fmpq")
    return str(value)


def exact_complex(real: fmpq, imag: fmpq = fmpq(0)) -> acb:
    """Convert exact rationals to an enclosing ACB value at current precision."""

    return acb(real, imag)
