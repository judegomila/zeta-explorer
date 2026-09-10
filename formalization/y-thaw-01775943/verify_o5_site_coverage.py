#!/usr/bin/env python3
"""O5 (y-thaw 0.17759432 package): site coverage at the displaced height.

Re-certifies, at y = 0.1808 exactly (y^2 = 12769/390625, y = 113/625):

    x_{690988} < x_*(0.1808) < x_{690989},
    x_*(y) = X + sqrt(1 - y^2),  X = 6000000185827,
    x_N = 4*pi*(N^2 - t0/16),    t0 = 129/800,

the displaced analogue of the "Site and endpoint coverage" section of
WINDOW_FREEZE_THEOREM.md (sealed anchor y^2 = 87677/2500000). The start
point moves RIGHT by sqrt(1-0.1808^2) - sqrt(1-0.187271994702891^2)
~ 1.2078e-3, against sealed interior margins > 5.377e6 / > 1.198e7.

Two independent lanes, same discipline as verify_window_freeze.py:
  * exact lane: fractions.Fraction throughout, rational Machin-series
    enclosure of pi (width < 1e-100), integer-square-root bracket of
    sqrt(377856/390625) to 90 decimal digits;
  * interval lane: mpmath.iv at 400 bits (>= the 320 requested).

Exit status 0 iff every check passes. No repository inputs.
"""

from fractions import Fraction as F
from math import isqrt
import sys

from mpmath import iv, mp

X = 6_000_000_185_827
T0 = F(129, 800)
Y2_NEW = F(12_769, 390_625)          # 0.1808^2 exactly; y = 113/625
Y2_SEALED = F(87_677, 2_500_000)     # sealed anchor y ~ 0.187271994702891
N0 = 690_988

SQRT_DIGITS = 90
ATAN_TERMS_EVEN = 80

checks = 0
failures = 0


def check(name, condition, detail=""):
    global checks, failures
    checks += 1
    ok = bool(condition)
    failures += 0 if ok else 1
    suffix = f"  {detail}" if detail else ""
    print(f"[{'PASS' if ok else 'FAIL'}] {name}{suffix}")


def floor_decimal(value, digits):
    scale = 10**digits
    integer = (value * scale).numerator // (value * scale).denominator
    sign = "-" if integer < 0 else ""
    text = str(abs(integer)).rjust(digits + 1, "0")
    return sign + text[:-digits] + "." + text[-digits:]


def atan_reciprocal_bounds(inv, even_terms):
    x = F(1, inv)
    partial = F(0)
    for k in range(even_terms):
        term = x ** (2 * k + 1) / (2 * k + 1)
        partial += term if k % 2 == 0 else -term
    lower = partial
    upper = lower + x ** (2 * even_terms + 1) / (2 * even_terms + 1)
    assert lower < upper
    return lower, upper


def pi_bounds():
    a5_lo, a5_hi = atan_reciprocal_bounds(5, ATAN_TERMS_EVEN)
    a239_lo, a239_hi = atan_reciprocal_bounds(239, ATAN_TERMS_EVEN)
    return 16 * a5_lo - 4 * a239_hi, 16 * a5_hi - 4 * a239_lo


def sqrt_bounds(value, digits):
    scale = 10**digits
    floor_scaled = isqrt((value.numerator * scale * scale) // value.denominator)
    lower = F(floor_scaled, scale)
    if lower * lower == value:
        return lower, lower
    upper = F(floor_scaled + 1, scale)
    assert lower * lower < value < upper * upper
    return lower, upper


def q(n):
    return F(n * n) - T0 / 16


def itv(value):
    return iv.mpf(value.numerator) / value.denominator


def main():
    iv.prec = 400
    mp.prec = 400

    print("--- O5 exact lane (rationals; Machin pi; isqrt brackets)")
    check("O5-A1 y is exact", F(113, 625) ** 2 == Y2_NEW)
    check("O5-A2 displaced below sealed anchor", Y2_NEW < Y2_SEALED)

    radius_sq = 1 - Y2_NEW           # 377856/390625
    check("O5-A3 radius^2 exact", radius_sq == F(377_856, 390_625))
    r_lo, r_hi = sqrt_bounds(radius_sq, SQRT_DIGITS)
    check(
        "O5-A4 radius bracket",
        r_lo * r_lo < radius_sq < r_hi * r_hi,
        f"{floor_decimal(r_lo, 18)} < sqrt(1-y^2) < ...",
    )

    rs_lo, rs_hi = sqrt_bounds(1 - Y2_SEALED, SQRT_DIGITS)
    shift_lo, shift_hi = r_lo - rs_hi, r_hi - rs_lo
    check(
        "O5-A5 rightward shift bracket ~ 1.21178e-3 (ledger's ~1.208e-3 was an estimate)",
        F(121178, 10**8) < shift_lo and shift_hi < F(121179, 10**8),
        f"shift in [{floor_decimal(shift_lo, 12)}, {floor_decimal(shift_hi, 12)}]",
    )

    pi_lo, pi_hi = pi_bounds()
    check("O5-A6 pi enclosure narrow", pi_lo < pi_hi and pi_hi - pi_lo < F(1, 10**100))

    x0_lo, x0_hi = 4 * pi_lo * q(N0), 4 * pi_hi * q(N0)
    x1_lo, x1_hi = 4 * pi_lo * q(N0 + 1), 4 * pi_hi * q(N0 + 1)
    start_lo, start_hi = F(X) + r_lo, F(X) + r_hi

    left_margin = start_lo - x0_hi
    right_margin = x1_lo - start_hi
    check(
        "O5-B1 STRICT x_{690988} < x_*(0.1808)",
        left_margin > 0,
        f"margin > {floor_decimal(left_margin, 12)}",
    )
    check(
        "O5-B2 STRICT x_*(0.1808) < x_{690989}",
        right_margin > 0,
        f"margin > {floor_decimal(right_margin, 12)}",
    )
    check("O5-B3 left margin > 5.377e6", left_margin > F(5_377_393, 1))
    check("O5-B4 right margin > 1.198e7", right_margin > F(11_989_041, 1))

    print("--- O5 interval lane (mpmath.iv, 400 bits)")
    r_iv = iv.sqrt(itv(radius_sq))
    x_start_iv = X + r_iv
    x_n0_iv = 4 * iv.pi * (iv.mpf(N0) ** 2 - itv(T0) / 16)
    x_n1_iv = 4 * iv.pi * (iv.mpf(N0 + 1) ** 2 - itv(T0) / 16)
    left_iv = x_start_iv - x_n0_iv
    right_iv = x_n1_iv - x_start_iv
    check(
        "O5-C1 independent interval margins strict",
        left_iv.a > 0 and right_iv.a > 0,
        f"left >= {mp.nstr(left_iv.a, 18)}, right >= {mp.nstr(right_iv.a, 18)}",
    )
    check(
        "O5-C2 interval lane confirms exact-lane margins",
        left_iv.a > 5_377_393 and right_iv.a > 11_989_041,
    )

    print()
    print(f"left  margin (exact lane, floor 12dp): {floor_decimal(left_margin, 12)}")
    print(f"right margin (exact lane, floor 12dp): {floor_decimal(right_margin, 12)}")
    print(f"checks: {checks}, failures: {failures}")
    print("RESULT " + ("PASS: x_*(0.1808) strictly interior to W_690988"
                       if failures == 0 else "FAIL"))
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
