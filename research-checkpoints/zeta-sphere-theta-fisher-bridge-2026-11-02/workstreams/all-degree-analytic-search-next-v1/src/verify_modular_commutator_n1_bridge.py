#!/usr/bin/env python3
"""Exact stdlib replay for the N=1 modular-commutator bridge.

This checker deliberately uses no floating arithmetic and no third-party
computer-algebra package.  A tiny Laurent-polynomial implementation verifies
the 2 by 2 reflection/commutator calculation.  The scalar factorization is
verified after clearing only the displayed positive normalizers.

It is an algebra replay, not a theta inequality certificate and not an RH
claim.
"""

from __future__ import annotations

from dataclasses import dataclass
from fractions import Fraction
from hashlib import sha256
from typing import Iterable


NAMES = ("a", "rho", "Ip", "Im", "Pp", "Pm", "Kp", "Km")
ZERO_POWER = (0,) * len(NAMES)


@dataclass(frozen=True)
class Laurent:
    terms: dict[tuple[int, ...], Fraction]

    def __post_init__(self) -> None:
        clean = {power: value for power, value in self.terms.items() if value}
        object.__setattr__(self, "terms", clean)

    @staticmethod
    def constant(value: int | Fraction) -> "Laurent":
        value = Fraction(value)
        return Laurent({ZERO_POWER: value} if value else {})

    @staticmethod
    def variable(name: str) -> "Laurent":
        power = [0] * len(NAMES)
        power[NAMES.index(name)] = 1
        return Laurent({tuple(power): Fraction(1)})

    def __add__(self, other: object) -> "Laurent":
        rhs = promote(other)
        out = dict(self.terms)
        for power, value in rhs.terms.items():
            out[power] = out.get(power, Fraction(0)) + value
        return Laurent(out)

    __radd__ = __add__

    def __neg__(self) -> "Laurent":
        return Laurent({power: -value for power, value in self.terms.items()})

    def __sub__(self, other: object) -> "Laurent":
        return self + (-promote(other))

    def __rsub__(self, other: object) -> "Laurent":
        return promote(other) - self

    def __mul__(self, other: object) -> "Laurent":
        rhs = promote(other)
        out: dict[tuple[int, ...], Fraction] = {}
        for left_power, left_value in self.terms.items():
            for right_power, right_value in rhs.terms.items():
                power = tuple(x + y for x, y in zip(left_power, right_power))
                out[power] = out.get(power, Fraction(0)) + left_value * right_value
        return Laurent(out)

    __rmul__ = __mul__

    def __pow__(self, exponent: int) -> "Laurent":
        if exponent < 0:
            if len(self.terms) != 1:
                raise ValueError("negative powers are supported only for monomials")
            (power, coefficient), = self.terms.items()
            if coefficient not in (1, -1):
                raise ValueError("negative power coefficient must be +/-1")
            sign = coefficient**exponent
            return Laurent({tuple(exponent * item for item in power): Fraction(sign)})
        result = Laurent.constant(1)
        base = self
        count = exponent
        while count:
            if count & 1:
                result = result * base
            base = base * base
            count //= 2
        return result

    def is_zero(self) -> bool:
        return not self.terms


def promote(value: object) -> Laurent:
    if isinstance(value, Laurent):
        return value
    if isinstance(value, (int, Fraction)):
        return Laurent.constant(value)
    return NotImplemented  # type: ignore[return-value]


Matrix = list[list[Laurent]]


def matrix(rows: Iterable[Iterable[object]]) -> Matrix:
    return [[promote(value) for value in row] for row in rows]


def transpose(value: Matrix) -> Matrix:
    return [list(column) for column in zip(*value)]


def matmul(left: Matrix, right: Matrix) -> Matrix:
    return [
        [sum((left[i][k] * right[k][j] for k in range(len(right))), Laurent.constant(0))
         for j in range(len(right[0]))]
        for i in range(len(left))
    ]


def matsub(left: Matrix, right: Matrix) -> Matrix:
    return [
        [left[i][j] - right[i][j] for j in range(len(left[0]))]
        for i in range(len(left))
    ]


def assert_matrix_equal(left: Matrix, right: Matrix, label: str) -> None:
    difference = matsub(left, right)
    if any(not entry.is_zero() for row in difference for entry in row):
        raise AssertionError(label)


def main() -> None:
    a, rho, ip, im, pp, pm, kp, km = (Laurent.variable(name) for name in NAMES)
    identity = matrix([[1, 0], [0, 1]])

    # N=1 reflection data in the archive's current-pivot normalization.
    reflection = matrix([[1, 0], [2 * a * rho, -1]])
    boundary = matrix([[4 * a**2 * rho], [-4 * a]])
    eta = matmul(transpose(reflection), boundary)
    assert_matrix_equal(matmul(reflection, reflection), identity, "R^2 != I")
    assert_matrix_equal(eta, matrix([[-4 * a**2 * rho], [4 * a]]), "eta mismatch")

    # X_1 uses sqrt(s1/s0)=rho^{-1}.  All Laurent powers cancel in C.
    generator = matrix([[0, rho**-1], [-(rho**-1), 0]])
    metric = matrix([[1, 0], [0, 1]])
    metric = [
        [metric[i][j] + matmul(transpose(reflection), reflection)[i][j] for j in range(2)]
        for i in range(2)
    ]
    commutator = matsub(matmul(metric, generator), matmul(generator, metric))
    expected_commutator = matrix(
        [[4 * a, 4 * a**2 * rho], [4 * a**2 * rho, -4 * a]]
    )
    assert_matrix_equal(commutator, expected_commutator, "C_1 mismatch")
    reflected_commutator = matmul(
        transpose(reflection), matmul(commutator, reflection)
    )
    assert_matrix_equal(
        reflected_commutator, commutator, "R^T C_1 R != C_1"
    )

    # Half-line integration-by-parts reductions:
    # Q_+=K_+-aP_+-a^2I_+, Q_-=K_-+aP_--a^2I_-.
    s0 = ip - im
    qplus = kp - a * pp - a**2 * ip
    qminus = km + a * pm - a**2 * im
    s1 = kp - km - a * (pp + pm) - a**2 * s0
    if not (s1 - (qplus - qminus)).is_zero():
        raise AssertionError("s1 != Qplus-Qminus")

    # H00=I-/s0, H01=P-/(2 sqrt(s0*s1)), H11=Q-/s1.
    # Clearing s0*s1/(4a) from tr(C_1 H) leaves the left side below.
    cleared_integrated = im * s1 - s0 * qminus + a * s0 * pm

    # The claimed factor has B=I_+(M_+-M_-)-a(P_++P_-).
    # Clearing the sole remaining I_- denominator gives I_-*B below.
    cleared_factor = im * kp - ip * km - a * im * (pp + pm)
    if not (cleared_integrated - cleared_factor).is_zero():
        raise AssertionError("integrated commutator factorization mismatch")

    # A collateral normalized shifted-derivative difference D satisfies
    # B=I_+ D + a P_- (I_+/I_- - 1).  This is not the archived scalar.
    shifted_difference_numerator = im * kp - ip * km - a * (im * pp + ip * pm)
    shifted_relation = (
        cleared_factor
        - shifted_difference_numerator
        - a * pm * s0
    )
    if not shifted_relation.is_zero():
        raise AssertionError("shifted derivative relation mismatch")

    checked = (
        "R^2=I",
        "R^T r=(-4*a^2*rho,4*a)^T=-r",
        "C1=[[4*a,4*a^2*rho],[4*a^2*rho,-4*a]]",
        "R^T*C1*R=C1",
        "Qp=Kp-a*Pp-a^2*Ip",
        "Qm=Km+a*Pm-a^2*Im",
        "s1=Kp-Km-a*(Pp+Pm)-a^2*(Ip-Im)",
        "Cint=4*a*Im/((Ip-Im)*s1)*(Ip*(Mp-Mm)-a*(Pp+Pm))",
        "B=Ip*D+a*Pm*(Ip/Im-1)",
    )
    digest = sha256("\n".join(checked).encode("ascii")).hexdigest()
    print("PASS: exact N=1 reflection, matrix commutator, half-line reductions,")
    print("      archived integrated-scalar factorization, and shifted-energy relation.")
    print(f"equation_manifest_sha256={digest}")
    print("scope=algebra only; no theta inequality, pivot sign, all-degree result, or RH claim")


if __name__ == "__main__":
    main()
