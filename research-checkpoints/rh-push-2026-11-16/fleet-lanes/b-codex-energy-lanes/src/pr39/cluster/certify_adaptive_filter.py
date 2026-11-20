"""Choose dyadic Cayley coefficients from zeta data, then certify their energy.

The arithmetic source covers the fixed band in certify_filtered_ratio.py.
The degree cap is a computation budget. Failure raises an unresolved error.
"""
import argparse
from fractions import Fraction as Q
import json

import numpy as np

from certify_pair_moments import C, R, log_integer, rational, sum_interval
from certify_filtered_ratio import (
    CENTER, JITTER, N, PI, STEP, boundary_bins, em_error, numerator, tail_bound,
)


THRESHOLD = Q(1, 16)
COEFFICIENT_DENOMINATOR = 1024


def propose_coefficients(degree, d, offsets, mass):
    """Floating-point least squares proposes a witness without certifying it."""
    if degree == 0:
        return [(Q(1), Q(0))]
    v = (offsets.lo + offsets.hi) / 2
    w = (1j*v - d) / (1j*v + d)
    weight = STEP * 16*d**5 / (np.pi*(d*d + v*v)**3)
    weight *= np.maximum(0, (mass.lo + mass.hi) / 2)
    basis = w[:, None] ** np.arange(degree + 1)[None, :]
    gram = basis.conj().T @ (weight[:, None] * basis)
    return dyadic_coefficients(gram)


def dyadic_coefficients(gram):
    solution = np.linalg.solve(gram, np.eye(len(gram))[:, 0])
    solution /= solution[0]
    if not np.all(np.isfinite(solution)):
        raise ValueError("non-finite coefficient proposal")
    scale = COEFFICIENT_DENOMINATOR
    return [(Q(1), Q(0))] + [
        (Q(round(z.real*scale), scale), Q(round(z.imag*scale), scale))
        for z in solution[1:]
    ]


def certified_energy(coefficients, d, offsets, mass):
    """Outward energy enclosure, including the entire omitted boundary."""
    v2 = offsets.square()
    inverse = (R(d*d) + v2).inverse_positive()
    w = C((v2 - R(d*d))*inverse, R(2*d)*offsets*inverse)
    polynomial = C(R(0))
    for real, imag in reversed(coefficients):
        polynomial = C(rational(real), rational(imag)) + polynomial*w
    modulus = polynomial.re.square() + polynomial.im.square()
    kernel = R(16*d**5) * PI.inverse_positive() * inverse*inverse*inverse
    finite = sum_interval(mass*kernel*modulus) * R(STEP)
    # |w|=1 on the true boundary. This rational bound covers every tail phase.
    coefficient_bound = sum(abs(real)+abs(imag) for real, imag in coefficients)
    tail = tail_bound(d, 16/d, 0) * rational(coefficient_bound**2)
    return finite + R(0, tail.hi)


def degree_one_ceiling(d, offsets, mass, logs, error):
    """Bound the best possible degree-one ratio using a residual correction."""
    coefficients = propose_coefficients(1, d, offsets, mass)
    real, imag = coefficients[1]
    inverse = (R(d*d) + offsets.square()).inverse_positive()
    w = C((offsets.square()-R(d*d))*inverse, R(2*d)*offsets*inverse)
    kernel = R(16*d**5)*PI.inverse_positive()*inverse*inverse*inverse
    # <w,1+a*w> = integral(conj(w)+a) against the positive boundary measure.
    integrand = C(w.re+rational(real), (-w.im)+rational(imag))
    residual = C(
        sum_interval(mass*kernel*integrand.re)*R(STEP),
        sum_interval(mass*kernel*integrand.im)*R(STEP),
    )
    tail = tail_bound(d, 16/d, 0)*rational(1+abs(real)+abs(imag))
    residual = residual.widen(tail.hi)
    norm = certified_energy(coefficients, d, offsets, mass)
    mass0 = certified_energy([(Q(1), Q(0))], d, offsets, mass)
    minimum = norm - (residual.re.square()+residual.im.square())*mass0.inverse_positive()
    upper = numerator(d, False, logs, error)*minimum.inverse_positive()
    return float(upper.hi)


def adaptive_witness(d, offsets, mass, logs, error, max_degree):
    num = numerator(d, False, logs, error)
    trials = []
    for degree in range(max_degree + 1):
        coefficients = propose_coefficients(degree, d, offsets, mass)
        energy = certified_energy(coefficients, d, offsets, mass)
        ratio = num * energy.inverse_positive()
        trials.append(dict(degree=degree, ratio_lower=float(ratio.lo)))
        if Q(float(ratio.lo)) > THRESHOLD:
            return dict(
                scale=str(Q(d)),
                degree=degree,
                coefficients=[[str(a), str(b)] for a, b in coefficients],
                ratio_lower=float(ratio.lo),
                trials=trials,
            )
    raise ValueError(f"unresolved at d={d}, degree cap {max_degree}: {trials}")


def check_cover():
    # For r=b/d in [3/4,3/2] and |u|<=1/4, the quadratic below is
    # convex in r and increasing in u^2. Both endpoint maxima are negative.
    for r in [Q(3,4), Q(3,2)]:
        assert 15*r*r - 34*r + 15 + Q(15,16) < 0
    # The resulting Euclidean exclusion disk has center 17d/15, radius 8d/15.
    q = THRESHOLD
    assert (1+q)/(1-q) == Q(17,15)
    assert 4*q/(1-q)**2 == Q(64,225)


def check_proposal_models():
    # These inner and outer polynomials have identical boundary weights.
    # Their different center values must prevent a false exclusion certificate.
    zero = (1+2j)/16
    previous = 0
    for degree in range(5):
        gram = np.eye(degree+1, dtype=complex)*(1+abs(zero)**2)
        for j in range(degree):
            gram[j, j+1] = -zero
            gram[j+1, j] = -zero.conjugate()
        dyadic = dyadic_coefficients(gram)
        coeff = np.array([float(a)+1j*float(b) for a,b in dyadic])
        outer_energy = np.sum(abs(np.convolve([1, -zero.conjugate()], coeff))**2)
        inner_energy = np.sum(abs(np.convolve([-zero, 1], coeff))**2)
        assert abs(outer_energy-inner_energy) < 1e-12
        assert abs(zero)**2/inner_energy < float(THRESHOLD)
        ratio = 1/outer_energy
        assert previous <= ratio + 1e-12 <= 1 + 1e-12
        previous = ratio
    assert previous > 0.999


def certify(max_degree):
    if max_degree < 0 or max_degree > 16:
        raise ValueError("degree cap must lie between zero and sixteen")
    check_cover()
    check_proposal_models()
    logs = [log_integer(n) for n in range(1,N+1)]
    logs = R([v.lo for v in logs], [v.hi for v in logs])
    error = em_error()
    offsets, mass = boundary_bins(logs, error)
    ceiling = degree_one_ceiling(0.5, offsets, mass, logs, error)
    if Q(ceiling) >= THRESHOLD:
        raise ValueError("degree-one obstruction unresolved")
    witnesses = [
        adaptive_witness(2.0**-j, offsets, mass, logs, error, max_degree)
        for j in range(1,9)
    ]
    d = 1/256
    inner = (offsets.lo >= -1/8) & (offsets.hi <= 1/8)
    upper = R(6)*R(np.max(mass.hi[inner])) + tail_bound(d, 32, 0)
    small_ratio = numerator(d, True, logs, error) * upper.inverse_positive()
    if Q(float(small_ratio.lo)) <= THRESHOLD:
        raise ValueError("unresolved continuum of small scales")
    return dict(
        center=CENTER,
        height_half_width=JITTER,
        threshold=str(THRESHOLD),
        coefficient_denominator=COEFFICIENT_DENOMINATOR,
        best_degree_one_ratio_upper_at_half=ceiling,
        witnesses=witnesses,
        small_scales=dict(upper_scale=str(Q(d)), ratio_lower=float(small_ratio.lo)),
        status="certified on this band, global termination remains open",
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--max-degree', type=int, default=6)
    args = parser.parse_args()
    print(json.dumps(certify(args.max_degree), indent=2, allow_nan=False))
