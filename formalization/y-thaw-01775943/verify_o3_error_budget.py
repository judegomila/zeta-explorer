#!/usr/bin/env python3
"""O3 (y-thaw 0.17759432 package): uniform effective-error budget E_max
over the ENLARGED height range y in [0.1808, sqrt(1 - 2*t0)].

Port of effective_error_budget() from the sealed Proposition 4.10 program
(~/dbn-lambda-audit-review/dan-reworking/code/prop410/prop410_proof.py,
itself line-for-line from verifiers/verify_finite_and_binding.py), with ONE
mathematical change and one precision change:

  * the point height y_0 = sqrt(87677/2500000) (~0.187272) is replaced by
    the full interval hull  y in [sqrt(12769/390625), sqrt(271/400)]
    = [0.1808, y_max] (lower endpoint EXACT: y = 113/625).  Every
    y-dependent quantity (sigma1, the U3a/U3c/G0 gates, the e_C0 exponent)
    is evaluated on that hull, so by inclusion isotonicity the certified
    upper endpoints bound the error at EVERY y in [0.1808, y_max]
    simultaneously — no separate monotonicity-in-y lemma is consumed;
  * interval precision 320 bits (sealed run: 220).

Unchanged from the sealed chain: the t-box [161250000, 161250001]/1e9
containing t0 = 129/800; the worst window N0 = 690988; equation (23) of
arXiv:1904.12438v2 for e_A + e_B; the conservative 10.50 corollary of
Proposition 6.6(vi) for e_C0 (3^ymax + 3^-ymax evaluated at the FIXED
y_max, which is unchanged by the thaw); the m0 = 2000 head/cap split with
its U3b/U3c endpoint gates (the decreasing-direction hypotheses of the
x-side domination, here re-certified on the full y-hull).

Output: certified upper endpoints for e_A+e_B, e_C0, and
E_max' = e_A+e_B+e_C0, uniform over (t-box) x (y in [0.1808, y_max]) at
N = N0, plus comparisons against the sealed E_max and against the
stage-2 sharp floor 0.062718178029 at y = 0.1808.

Exit status 0 iff all 12 gates and all stated bounds hold.
"""

from fractions import Fraction as F
import sys

from mpmath import iv, mp

iv.prec = 320
mp.prec = 320

T0 = F(16125, 100000)
TBOX_LO = F(161250000, 10**9)
TBOX_HI = F(161250001, 10**9)
Y2_NEW = F(12769, 390625)      # 0.1808^2 exactly (y = 113/625) — the thaw
Y2_SEALED = F(350708, 10**7)   # sealed Prop 4.10 anchor (~0.187272^2)
YMAX2 = 1 - 2 * T0             # 271/400, unchanged
N0 = 690_988

# Sealed Prop 4.10 certified bounds (exact rationals), for comparison only.
SEALED_EAB = F(206, 10**14)
SEALED_EC0 = F(233492848188649183, 10**24)
SEALED_EMAX = F(233494905212337849, 10**24)

# Stated NEW bounds certified by this program (exact rationals).
STATED_EAB = F(209, 10**14)                       # 2.09e-12
STATED_EC0 = F(243876578778031045, 10**24)        # 2.43876578778031045e-7
STATED_EMAX = F(243878668361931290, 10**24)       # E_max' = 2.4387866836193129e-7

# Stage-2 sharp floor at y = 0.1808 (imp-95208, global min over the lane).
SHARP_FLOOR = F(62718178029, 10**12)


def itv_fraction(value):
    return iv.mpf(value.numerator) / value.denominator


def hull(left, right):
    return left + (right - left) * iv.mpf([0, 1])


def endpoint_fraction(value):
    sign, mantissa, exponent, _ = mp.mpf(value)._mpf_
    if mantissa == 0 and exponent == 0:
        return F(0)
    result = F(int(mantissa)) * F(2) ** int(exponent)
    return -result if sign else result


def upper_fraction(value):
    return endpoint_fraction(value.b)


def upper_point(value):
    return iv.mpf([value.b, value.b])


def ceil_decimal(value, digits):
    scaled = value * 10**digits
    integer = -((-scaled.numerator) // scaled.denominator)
    sign = "-" if integer < 0 else ""
    text = str(abs(integer)).rjust(digits + 1, "0")
    return sign + text[:-digits] + "." + text[-digits:]


def effective_error_budget():
    """Sealed U1--U5 path; y replaced by the hull [0.1808, ymax]."""
    t = hull(itv_fraction(TBOX_LO), itv_fraction(TBOX_HI))
    ymax = iv.sqrt(itv_fraction(YMAX2))
    # THE change vs the sealed run: y ranges over the whole thawed interval.
    y = hull(iv.sqrt(itv_fraction(Y2_NEW)), ymax)
    pi = iv.pi
    n0 = iv.mpf(N0)
    x0 = 4 * pi * (n0**2 - t / 16)
    log0 = iv.log(n0**2 - t / 16)
    logn0 = iv.log(N0)
    delta1 = upper_point(
        (t / 4) * (-iv.log(1 - t / (16 * n0**2)))
        + t / (2 * x0**2)
    )
    sigma1 = (1 + y) / 2 + (t / 2) * logn0 - delta1
    y1 = iv.mpf("0.02") - log0 / 2 + logn0 / 2
    kappa = upper_point(t / (2 * (x0 - 6)))

    gates = {
        "G0_positive_part": (8 / x0**2).b < (3 * y).a,
        "sigma1_positive": sigma1.a > 0,
        "Y1_negative": y1.b < 0,
        "kappa_domain": kappa.a > 0 and kappa.b < 1,
        "G2a_ratio": (n0**2 / (n0**2 - t / 16)).a > 1,
        "U1_log_domain": log0.a > 2,
        "U2_logN": logn0.a > iv.mpf("0.5").b,
        "U3a_tail_decrease": ((1 + y) / 2 - delta1).a > 0,
        "Y_range": 0 < Y2_NEW < YMAX2 <= 1,
    }

    u1max = upper_point(
        ((t * t / 16) * log0**2 + iv.mpf("0.626"))
        / (x0 - iv.mpf("6.66"))
    )
    pmax = upper_point(
        1
        + iv.exp(iv.mpf("0.02"))
        * (1 - t / (16 * n0**2)) ** (iv.mpf(-1) / 2)
        * iv.exp(t * logn0 / (2 * (x0 - 6)))
    )

    m0 = 2000
    logm0 = iv.log(m0)
    g_t1 = -(t / 2) * logm0 + 1 / (logn0 - logm0)
    g_t2 = (
        (1 - y) / 2
        + delta1
        - (t / 2) * logn0
        + 1 / (logn0 - logm0)
    )
    gates["U3b_first_endpoint"] = g_t1.b < 0
    gates["U3c_second_endpoint"] = g_t2.b < 0
    gates["U5_last_factor"] = F(3, 1) / F(1050, 100) < 1

    head = iv.mpf(0)
    for n in range(2, m0 + 1):
        logn = iv.log(n)
        head += iv.exp((t / 4) * logn**2 - sigma1 * logn)
    head = upper_point(head)

    def exponential_tail(logu):
        return iv.exp(
            (1 - sigma1) * logu + (t / 4) * logu**2
        )

    term1 = upper_point(exponential_tail(logm0) * (logn0 - logm0))
    term2 = upper_point(exponential_tail(logn0) * (logn0 - logm0))
    cap_u = iv.mpf([max(term1.b, term2.b)] * 2)
    smax = upper_point(1 + head + cap_u)
    error_ab = upper_point(pmax * smax * (iv.exp(u1max) - 1))
    error_c0 = upper_point(
        iv.exp(
            -(1 + y) / 4 * log0
            - (t / 16) * log0**2
            + iv.mpf("1.24") * (3**ymax + 3**(-ymax))
            / (n0 - iv.mpf("0.125"))
            + (
                3 * iv.sqrt(log0**2 + (pi / 2) ** 2)
                + iv.mpf("10.50")
            )
            / (x0 - 12)
        )
    )
    if len(gates) != 12:
        raise AssertionError(f"internal error-gate count {len(gates)}")
    return (
        upper_fraction(error_ab + error_c0),
        upper_fraction(error_ab),
        upper_fraction(error_c0),
        gates,
    )


def main():
    if not (TBOX_LO == T0 < TBOX_HI <= F(1, 4)):
        raise AssertionError("t-box does not contain t_0")
    if not (0 < Y2_NEW < Y2_SEALED < YMAX2 <= 1):
        raise AssertionError("invalid thawed y range")
    if F(113, 625) ** 2 != Y2_NEW:
        raise AssertionError("thawed floor is not exactly 0.1808")

    error_max, error_ab, error_c0, gates = effective_error_budget()

    failed = [name for name, passed in gates.items() if not passed]
    checks = (
        ("e_A+e_B <= 2.09e-12 (new)", error_ab <= STATED_EAB),
        ("e_C0 <= 2.43876578778031045e-7 (new)", error_c0 <= STATED_EC0),
        ("e_A+e_B+e_C0 <= E_max' = 2.4387866836193129e-7 (new)",
         error_max <= STATED_EMAX),
        ("E_max' exceeds sealed E_max (growth, as expected)",
         error_max > SEALED_EMAX),
        ("growth factor < 1.0447",
         error_max < SEALED_EMAX * F(10447, 10000)),
        ("sharp floor 0.062718178029 - E_max' > 0.0627179",
         SHARP_FLOOR - STATED_EMAX > F(627179, 10**7)),
    )
    failed_checks = [name for name, passed in checks if not passed]

    print("O3: uniform error budget, N0 = 690988, t-box, "
          "y in [0.1808, sqrt(271/400)]  (iv.prec = 320)")
    print()
    print("Gates (all must hold on the full y-hull):")
    for name in gates:
        print(f"  [{'PASS' if gates[name] else 'FAIL'}] {name}")
    print()
    print("Certified upper endpoints (outward-rounded):")
    print(f"  e_A+e_B      <= {ceil_decimal(error_ab, 24)}")
    print(f"  e_C0         <= {ceil_decimal(error_c0, 24)}")
    print(f"  e_A+e_B+e_C0 <= {ceil_decimal(error_max, 24)}")
    print()
    print("Comparisons (exact rational):")
    print(f"  sealed E_max            = {ceil_decimal(SEALED_EMAX, 24)}")
    growth = error_max / SEALED_EMAX
    print(f"  growth factor           <= {ceil_decimal(growth, 12)}")
    margin = SHARP_FLOOR - error_max
    print(f"  sharp floor - E_max'    >= {ceil_decimal(-(-margin), 12)}"
          f"  (floor 0.062718178029 at y = 0.1808)")
    print(f"  sealed-triangle context: 7.91366e-7 - E_max' "
          f">= {ceil_decimal(F(791366, 10**12) - error_max, 12)}")
    print()
    print("Bound checks:")
    for name, passed in checks:
        print(f"  [{'PASS' if passed else 'FAIL'}] {name}")

    ok = not failed and not failed_checks
    print()
    print("RESULT " + ("PASS: E_max' = 2.4387866836193129e-7 certified "
                       "uniform over y in [0.1808, y_max] at N0 (interval "
                       "evaluation, 320 bits)"
                       if ok else f"FAIL: {failed + failed_checks}"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
