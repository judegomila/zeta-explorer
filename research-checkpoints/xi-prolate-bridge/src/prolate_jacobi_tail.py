"""Exact helpers for the infinite even-prolate Jacobi tail.

The functions in this module use ``fractions.Fraction`` only.  They do not
compute a prolate eigenfunction and they do not make a statement about the
finite Weil matrix.  Their purpose is to make the scalar Schur continued
fraction, and its fail-closed hypotheses, independently testable.
"""

from __future__ import annotations

from fractions import Fraction
from typing import Sequence


def _q(value: int | Fraction) -> Fraction:
    if isinstance(value, Fraction):
        return value
    if type(value) is int:
        return Fraction(value)
    raise TypeError(
        "exact int or Fraction input required; binary floating-point is forbidden"
    )


def prolate_tail_floor(index: int) -> int:
    """Lower form bound on the tail beginning at even Legendre index index.

    The corresponding Legendre degree is ``2*index``.  The multiplication
    term ``c^2 z^2`` is positive, so it is not subtracted from this floor.
    """

    if index < 0:
        raise ValueError("tail index must be nonnegative")
    return 2 * index * (2 * index + 1)


def schur_interval_step(
    coupling_squared: int | Fraction,
    diagonal_minus_shift: int | Fraction,
    next_lower: int | Fraction,
    next_upper: int | Fraction,
) -> tuple[Fraction, Fraction]:
    """Propagate one outward-rounded scalar Schur interval exactly.

    If ``r_next`` lies in ``[next_lower,next_upper]`` and

        r = coupling_squared / (diagonal_minus_shift - r_next),

    then this returns the exact enclosing interval for ``r``.  Invalid or
    nonpositive denominator data are rejected rather than widened silently.
    """

    b2 = _q(coupling_squared)
    a = _q(diagonal_minus_shift)
    lo = _q(next_lower)
    hi = _q(next_upper)
    if b2 < 0:
        raise ValueError("squared coupling must be nonnegative")
    if lo < 0 or hi < lo:
        raise ValueError("invalid next self-energy interval")
    if a <= hi:
        raise ValueError("Schur denominator is not certified positive")
    return b2 / (a - lo), b2 / (a - hi)


def backward_self_energy_interval(
    diagonals: Sequence[int | Fraction],
    left_couplings_squared: Sequence[int | Fraction],
    shift: int | Fraction,
    terminal_lower: int | Fraction,
    terminal_upper: int | Fraction,
) -> tuple[Fraction, Fraction]:
    """Enclose a Jacobi tail self-energy by backward continued fraction.

    ``diagonals`` contains ``d_M,...,d_(K-1)`` and
    ``left_couplings_squared`` contains
    ``b_(M-1)^2,...,b_(K-2)^2``.  The terminal interval encloses the load
    ``r_K``.  The return value encloses ``r_M``.
    """

    if len(diagonals) != len(left_couplings_squared):
        raise ValueError("diagonal and coupling lists must have equal length")
    lo = _q(terminal_lower)
    hi = _q(terminal_upper)
    s = _q(shift)
    for d, b2 in zip(reversed(diagonals), reversed(left_couplings_squared)):
        lo, hi = schur_interval_step(b2, _q(d) - s, lo, hi)
    return lo, hi


def ceil_fraction(value: int | Fraction) -> int:
    value = _q(value)
    return -((-value.numerator) // value.denominator)


def uniform_tail_width_bound(
    bandwidth_c: int | Fraction,
    shift: int | Fraction,
    interface: int,
    terminal: int,
) -> Fraction:
    """Uniform width bound for the prolate tail continued fraction.

    For ``c>=1``, ``0<=shift<c^2``, ``interface>=ceil(2c)`` and
    ``terminal>=interface``, the exact self-energy interval obtained from
    the terminal resolvent bound has width at most the returned number.
    """

    c = _q(bandwidth_c)
    s = _q(shift)
    if c < 1:
        raise ValueError("the uniform estimate requires c >= 1")
    if s < 0 or s >= c * c:
        raise ValueError("the uniform estimate requires 0 <= shift < c^2")
    if interface < ceil_fraction(2 * c):
        raise ValueError("interface must be at least ceil(2c)")
    if terminal < interface:
        raise ValueError("terminal index must not precede the interface")
    return c * c / (135 * (1764 ** (terminal - interface)))


def projection_transfer_bound(
    polynomial_projection_tail: int | Fraction,
    lambda_value: int | Fraction,
    source_l2_error: int | Fraction,
) -> Fraction:
    """Safe arithmetic-transfer bound from a source state ball.

    The elementary source estimate is ``||E f|| <= lambda ||f||``.  Exact
    evenization and orthogonal projection are contractions, hence the true
    projection tail is at most ``poly_tail + lambda*source_error``.
    """

    tail = _q(polynomial_projection_tail)
    lam = _q(lambda_value)
    error = _q(source_l2_error)
    if tail < 0 or error < 0 or lam <= 0:
        raise ValueError("projection bounds require nonnegative errors and lambda>0")
    return tail + lam * error


def forced_solve_size(
    residual_size: int | Fraction,
    complement_floor: int | Fraction,
) -> Fraction:
    """Scalar one-direction shifted-solve size, for separation tests only."""

    residual = _q(residual_size)
    floor = _q(complement_floor)
    if residual < 0 or floor <= 0:
        raise ValueError("residual must be nonnegative and floor positive")
    return residual / floor
