"""Exact rational upper bound showing M(log 24137) < 0.

Only Python integer arithmetic is used for the certificate. Logarithms
are bounded below using positive truncated atanh series. Square roots
are bounded above using integer square roots. Display decimals are not
inputs to the proof. This tests a proposed sign shortcut, not RH.
"""

import json
from math import isqrt


SCALE = 10**12
TERMS = 18
N = 24137


def log_ratio_lower_scaled(numerator, denominator):
    """Lower bound for SCALE * log(numerator/denominator), ratio >= 1."""
    a = numerator - denominator
    b = numerator + denominator
    # log(y) = 2 sum_{j>=0} ((y-1)/(y+1))**(2j+1)/(2j+1).
    # All omitted terms and every discarded integer remainder are >= 0.
    return sum(
        (2 * SCALE * a ** (2 * j + 1))
        // ((2 * j + 1) * b ** (2 * j + 1))
        for j in range(TERMS)
    )


LOG2_LOWER = log_ratio_lower_scaled(2, 1)


def log_integer_lower_scaled(p):
    k = p.bit_length() - 1
    return k * LOG2_LOWER + log_ratio_lower_scaled(p, 2**k)


def sqrt_upper_scaled(n):
    return isqrt(n * SCALE * SCALE) + 1


def certificate():
    is_prime = bytearray(b"\x01") * (N + 1)
    is_prime[0:2] = b"\x00\x00"
    for p in range(2, isqrt(N) + 1):
        if is_prime[p]:
            is_prime[p * p :: p] = b"\x00" * ((N - p * p) // p + 1)

    weighted_sum_lower = 0
    prime_power_count = 0
    for p in range(2, N + 1):
        if not is_prime[p]:
            continue
        log_lower = log_integer_lower_scaled(p)
        q = p
        while q <= N:
            weighted_sum_lower += (
                log_lower * SCALE // sqrt_upper_scaled(q)
            )
            prime_power_count += 1
            q *= p

    # M(log N) = 2(sqrt(N)-1) - sum_{p^k<=N} log(p)/sqrt(p^k).
    upper_numerator = (
        2 * sqrt_upper_scaled(N) - 2 * SCALE - weighted_sum_lower
    )
    assert upper_numerator < 0
    return {
        "statement": "M(log N) is strictly below this negative rational bound",
        "N": N,
        "upper_bound_numerator": upper_numerator,
        "upper_bound_denominator": SCALE,
        "prime_powers_counted": prime_power_count,
        "log_series_terms": TERMS,
        "arithmetic": "exact integers only",
        "RH_claim": False,
    }


if __name__ == "__main__":
    print(json.dumps(certificate(), indent=2))
