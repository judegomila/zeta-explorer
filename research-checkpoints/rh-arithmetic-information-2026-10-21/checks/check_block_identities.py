#!/usr/bin/env python3
"""Exact-rational regression for windowed hinges and block reconstruction.

Synthetic rational log positions and masses are algebraic test data, not primes.
This verifies normalization, breakpoints, and reconstruction only. It asserts
no arithmetic positivity bound and imports no numerical or external dataset.
"""

from fractions import Fraction as F
import json


def positive(x):
    return max(x, F(0))


def averaged_hinge(t, h, a):
    """h^-1 integral_t^(t+h) (u-a)_+ du."""
    return (positive(t + h - a) ** 2 - positive(t - a) ** 2) / (2 * h)


def kernel_truncated(s, h):
    return (
        positive(3 * h - s) ** 2
        - 3 * positive(2 * h - s) ** 2
        + 3 * positive(h - s) ** 2
        - positive(-s) ** 2
    ) / (2 * h)


def kernel_pieces(s, h):
    if s < 0 or s > 3 * h:
        return F(0)
    if s <= h:
        return s * s / (2 * h)
    if s <= 2 * h:
        return (-2 * s * s + 6 * h * s - 3 * h * h) / (2 * h)
    return (3 * h - s) ** 2 / (2 * h)


def integrate_polynomial(coeffs, left, right):
    return sum(
        c * (right ** (j + 1) - left ** (j + 1)) / (j + 1)
        for j, c in enumerate(coeffs)
    )


def base_average(t, h):
    """Average of synthetic A(u)=1/7-u/3+2u^2/5+u^3/11."""
    return integrate_polynomial([F(1, 7), -F(1, 3), F(2, 5), F(1, 11)], t, t + h) / h


def response(t, h, events):
    return base_average(t, h) - sum(
        mass * averaged_hinge(t, h, position) for position, mass in events
    )


def forcing(t, h, events):
    smooth = base_average(t + 2 * h, h) - 2 * base_average(t + h, h) + base_average(t, h)
    # Endpoint terms vanish exactly, so the strict window is intentional.
    return smooth - sum(
        mass * kernel_pieces(position - t, h)
        for position, mass in events
        if t < position < t + 3 * h
    )


def main():
    counts = {"hinge_identities": 0, "piece_identities": 0,
              "support_and_nonnegativity": 0, "kernel_masses": 0,
              "response_identities": 0, "reconstruction_identities": 0,
              "endpoint_checks": 0}
    # Includes exact breakpoints and nearby rational values on both sides.
    offsets = [F(-2), -F(1, 100), F(0), F(1, 100), F(1, 2),
               F(99, 100), F(1), F(101, 100), F(3, 2), F(199, 100),
               F(2), F(201, 100), F(5, 2), F(299, 100), F(3),
               F(301, 100), F(4)]
    hs = [F(1, 7), F(2, 5), F(3, 2)]
    for h in hs:
        for r in [F(0), h / 3, 6 * h / 7]:
            for t in [r, r + 2 * h]:
                for offset in offsets:
                    position = t + h * offset
                    direct = (averaged_hinge(t + 2 * h, h, position)
                              - 2 * averaged_hinge(t + h, h, position)
                              + averaged_hinge(t, h, position))
                    k = kernel_truncated(position - t, h)
                    assert direct == k
                    counts["hinge_identities"] += 1
                    assert k == kernel_pieces(position - t, h)
                    counts["piece_identities"] += 1
                    assert k >= 0
                    if offset <= 0 or offset >= 3:
                        assert k == 0
                    counts["support_and_nonnegativity"] += 1
                for offset, value in [(F(0), F(0)), (F(1), h / 2),
                                      (F(2), h / 2), (F(3), F(0))]:
                    assert kernel_truncated(h * offset, h) == value
                    counts["endpoint_checks"] += 1

            # Rational positions model log-prime walls, including repeated
            # support endpoints for successive block windows.
            events = [(r + h * F(j, 2), F((j % 5) + 1, j + 3))
                      for j in range(-1, 19)]
            ws = [response(r + n * h, h, events) for n in range(9)]
            fs = [forcing(r + k * h, h, events) for k in range(7)]
            for k in range(7):
                assert ws[k + 2] - 2 * ws[k + 1] + ws[k] == fs[k]
                counts["response_identities"] += 1
            for n in range(2, 9):
                reconstructed = (ws[0] + n * (ws[1] - ws[0])
                                 + sum((n - 1 - k) * fs[k] for k in range(n - 1)))
                assert ws[n] == reconstructed
                counts["reconstruction_identities"] += 1

        mass = (integrate_polynomial([F(0), F(0), 1 / (2 * h)], F(0), h)
                + integrate_polynomial([-3 * h / 2, F(3), -1 / h], h, 2 * h)
                + integrate_polynomial([9 * h / 2, F(-3), 1 / (2 * h)], 2 * h, 3 * h))
        assert mass == h * h
        counts["kernel_masses"] += 1

    print(json.dumps({"status": "PASS", "arithmetic": "fractions.Fraction exact rationals",
                      "counts": counts, "total_checks": sum(counts.values()),
                      "scope": "Algebra, normalization, endpoints and reconstruction only; synthetic event data; no prime estimate or positivity theorem."}, indent=2))


if __name__ == "__main__":
    main()
