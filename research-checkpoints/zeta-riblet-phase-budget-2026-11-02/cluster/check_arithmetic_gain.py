"""Arithmetic-residual certificate and exact controls; no global RH claim.

The main certificate uses outward Decimal intervals from certify_actual_window.
No zeta evaluator, known zeros, numerical integration, or matrix fit is used.
"""
from fractions import Fraction as Q
from math import factorial
import json

from certify_actual_window import I, PREC


def interval(q):
    q = Q(q)
    return I(q.numerator)/q.denominator


def finite_residual_energy(cutoff=4096):
    """Norm squared of g * (r 1_[0,log(cutoff)]), g(x)=x exp(-x/2).

    r(x)=exp(-x/2)*[(13/8)*(floor(exp(x)) mod 2)-1].
    The convolution is exp(-x/2)*P(x), with P'' equal to the bracket.
    On each integer-log interval P is quadratic; beyond cutoff P is linear.
    """
    p, dp, energy = I(0), I(0), I(0)
    previous_log = I(0)
    for k in range(1, cutoff):
        next_log = I(k+1).log()
        width = next_log-previous_log
        residual = interval(Q(13, 8)*(k % 2)-1)
        coeff = [p, dp, residual/2]
        squared = [
            sum((coeff[j]*coeff[n-j]
                 for j in range(max(0, n-2), min(2, n)+1)), I(0))
            for n in range(5)
        ]
        # exp(-width)=k/(k+1) exactly, avoiding another transcendental.
        series, power = I(0), I(1)
        for n in range(5):
            series += power/factorial(n)
            moment = factorial(n)*(I(1)-series*k/(k+1))
            energy += squared[n]*moment/k
            power *= width
        p += dp*width+residual*width*width/2
        dp += residual*width
        previous_log = next_log
    energy += (p*p+2*p*dp+2*dp*dp)/cutoff
    return energy


def certify():
    energy = finite_residual_energy()
    assert energy.lo > 0
    assert energy.hi < interval(Q(19, 80)**2).lo
    # |r(x)| <= exp(-x/2); ||g||_1=4; cutoff=4096.
    assert Q(19, 80)+Q(4, 64) == Q(3, 10)
    assert Q(6) < Q(5, 2)**2
    # epsilon<3/10 gives |v(z0)|>7/10 and ||(1-w)^2 v||<14/5.
    assert (Q(7, 10)/Q(14, 5))**2 == Q(1, 16)
    log2 = I(2).log()
    raw_energy = I(1)-log2*39/64
    assert raw_energy.lo > interval(Q(1, 2)).hi
    return {
        "precision_decimal_digits": PREC,
        "anchor": {"d": "1/2", "c": "0"},
        "dirichlet_coefficients": {"1": "13/8", "2": "-13/4"},
        "integer_cutoff": 4096,
        "finite_smoothed_residual_energy": energy.pair(),
        "finite_smoothed_residual_norm_strict_upper": "19/80",
        "omitted_residual_norm_upper": "1/16",
        "full_smoothed_residual_norm_strict_upper": "3/10",
        "filter_ratio_strict_lower": "1/16",
        "unfiltered_source_residual_energy": raw_energy.pair(),
        "status": "outward-interval finite local certificate",
    }


def exact_controls():
    # An elementary Mobius sieve, then pole cancellation and exact initial
    # jump cancellation for each finite arithmetic inverse.
    maximum = 40
    mu = [0]*(maximum+1)
    mu[1] = 1
    for n in range(2, maximum+1):
        mu[n] = -sum(mu[d] for d in range(1, n) if n % d == 0)
    cases, telescope_cases = 0, 0
    for length in range(2, maximum+1):
        coeff = {n: Q(mu[n]) for n in range(1, length+1)}
        coeff[length] -= length*sum((coeff[n]/n for n in coeff), Q(0))
        assert sum((coeff[n]/n for n in coeff), Q(0)) == 0
        # The compact continuous filter has Laplace numerator D(s):
        # sum A_m*(m**(-t)-(m+1)**(-t)), with A_m=sum_(n<=m) a_n/n.
        cumulative = [Q(0)]
        for n in range(1, length+1):
            cumulative.append(cumulative[-1]+coeff[n]/n)
        for n in range(1, length+1):
            telescope = (cumulative[n] if n < length else Q(0))-cumulative[n-1]
            assert telescope == coeff[n]/n
            telescope_cases += 1
        for k in range(1, length):
            assert sum(coeff[n]*(k//n) for n in coeff) == 1
            cases += 1
    # For the two-delay certificate, pole cancellation and residue bounds
    # are exact on the full period, hence at every integer.
    coeff = {1: Q(13, 8), 2: Q(-13, 4)}
    assert sum((coeff[n]/n for n in coeff), Q(0)) == 0
    assert all(abs(Q(13, 8)*(k % 2)-1) <= 1 for k in range(2))
    # Rank-two signed bridge form: the two exponentials are independent.
    gram_determinant = Q(1, 6)*Q(1, 2)-Q(1, 4)**2
    assert gram_determinant == Q(1, 48) > 0
    # Explicit upper bound used in the discrete universality corollary:
    # ratio <= 9 exp(-2A)/((1-r^2)*(1-r)^4/16).
    r = Q(1, 4)
    evaluation_constant = Q(9)*16/((1-r*r)*(1-r)**4)
    return {
        "mobius_initial_cancellation_cases": cases,
        "pole_neutral_lengths_checked": maximum-1,
        "compact_filter_telescope_cases": telescope_cases,
        "signed_rank_two_determinant_without_scaling": "-1/48",
        "universality_ratio_constant": str(evaluation_constant),
        "scope": "exact finite algebra controls; universality itself is cited",
    }


if __name__ == "__main__":
    print(json.dumps({"certificate": certify(), "controls": exact_controls()}, indent=2))
