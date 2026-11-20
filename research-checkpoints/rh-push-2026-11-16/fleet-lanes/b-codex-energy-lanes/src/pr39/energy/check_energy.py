"""Exact controls and outward-interval model checks for SMALL_VALUE_ENERGY.md.

Standard library only. No actual-zeta or global RH conclusion. The interval
primitive is shared with the existing contour checker, not an external audit.
"""
from fractions import Fraction as F
from pathlib import Path
import json
import random
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'cluster'))
from certify_actual_window import I, PREC


def add(a, b):
    return a[0] + b[0], a[1] + b[1]


def sub(a, b):
    return a[0] - b[0], a[1] - b[1]


def mul(a, b):
    return a[0]*b[0] - a[1]*b[1], a[0]*b[1] + a[1]*b[0]


def power(a, n):
    v = (F(1), F(0))
    for _ in range(n):
        v = mul(v, a)
    return v


def norm2(a):
    return a[0]**2 + a[1]**2


def norm1(a):
    return abs(a[0]) + abs(a[1])


def dot(a, b):
    return a[0]*b[0] + a[1]*b[1]


def regularizer(u, eta):
    if eta <= 0:
        raise ValueError('eta must be positive')
    d = norm2(u) + eta**2
    return u[0]/d, u[1]/d


def backward(u, v, eta):
    return max(F(0), -dot(v, regularizer(u, eta)))


def fi(q):
    q = F(q)
    return I(q.numerator)/q.denominator


def run():
    counts = {}
    count = 0
    # Compare the shear factorization against the actual complex polynomial.
    for b in (F(1, 3), F(1, 100), F(1, 10**6)):
        for xmul in (F(0), F(1, 4), F(1, 2), F(1), F(2)):
            for ymul in (F(-2), F(-1, 2), F(0), F(1, 2), F(2)):
                x, y = b*xmul, b*ymul
                z = (x, y)
                value = sub(power(z, 2), (b*b, F(0)))
                deriv = (2*x, 2*y)
                shear = dot(deriv, value)
                expected = 2*x*(x*x+y*y-b*b)
                assert shear == expected
                assert max(F(0), -shear) == 2*x*max(F(0), b*b-x*x-y*y)
                count += 1
        # Integrate the expanded radial polynomial exactly; units are pi.
        radial = 2*(b**8/F(4) - 2*b**8/F(6) + b**8/F(8))
        assert radial == b**8/F(12)
        count += 1
    counts['symmetric_shear_and_integrated_pocket'] = count

    count = 0
    for m in (1, 2, 3, 5, 8):
        # Full disk: angular integral is pi/2 and radial exponent is 4m-1.
        assert F(m*m, 2)*F(1, 4*m) == F(m, 8)
        if m > 1:
            assert F(m, 8) != F(m*m, 8)
        for x in (F(0), F(1, 100), F(1, 2)):
            for y in (F(-1), F(0), F(1, 3)):
                z = (x, y)
                c = (F(2), F(-3))
                value = mul(c, power(z, m))
                dv = mul(c, power(z, m-1))
                deriv = (m*dv[0], m*dv[1])
                # A boundary monomial has no negative shear on x>=0.
                assert dot(deriv, value) >= 0
                assert backward(value, deriv, F(1, 10**8)) == 0
                count += 1
    counts['boundary_monomial_signs'] = count
    counts['multiplicity_coefficients'] = 5

    rng = random.Random(391105)
    count = 0
    for eta in (F(1), F(1, 10), F(1, 10**6)):
        for j in range(400):
            def rv():
                return tuple(F(rng.randint(-20, 20), rng.randint(1, 30)) for _ in range(2))
            u, v, u0, v0 = rv(), rv(), rv(), rv()
            if j % 11 == 0:
                u = (F(0), F(0))
            if j % 13 == 0:
                u0 = (F(0), F(0))
            if j % 17 == 0:
                u = (eta, F(0))
            gu, gu0 = regularizer(u, eta), regularizer(u0, eta)
            assert norm2(gu) <= F(1)/(4*eta**2)
            assert norm2(sub(gu, gu0)) <= norm2(sub(u, u0))/eta**4
            # L1 sizes are rigorous upper bounds for complex moduli.
            d0, d1, l0 = norm1(sub(u, u0)), norm1(sub(v, v0)), norm1(v0)
            budget = d1/(2*eta) + l0*d0/eta**2
            assert abs(backward(u, v, eta)-backward(u0, v0, eta)) <= budget
            count += 1
    counts['regularized_map_and_approximation_cases'] = count
    for eta in (F(0), F(-1)):
        try:
            regularizer((F(0), F(0)), eta)
        except ValueError:
            pass
        else:
            raise AssertionError('nonpositive eta accepted')
    counts['invalid_eta_rejections'] = 2

    # Independent integral enclosure for the monomial energy. In logarithmic
    # radius y=log(|c|r^m/eta), E/pi=(m/2) integral (1+exp(-2y))^-2 dy.
    # Monotonicity supplies lower/upper sums on whole intervals. The omitted
    # y<-20 tail is <=exp(-80)/4 before the m/2 factor.
    rows = []
    for h in (2, 8, 20):
        n = 1024
        a = F(-20)
        step = (F(h)-a)/n
        values = []
        for j in range(n+1):
            y = fi(a+j*step)
            values.append(I(1)/(I(1)+(-2*y).exp()).square())
        lower = sum((I(v.lo) for v in values[:-1]), I(0))*fi(step)
        upper = sum((I(v.hi) for v in values[1:]), I(0))*fi(step)
        tail = I(-80).exp()/4
        for m in (1, 2, 5):
            enclosure = fi(F(m, 2))*I(lower.lo, (upper+tail).hi)
            t = I(2*h).exp()
            closed = fi(F(m, 4))*((1+t).log()+1/(1+t)-1)
            assert enclosure.lo <= closed.lo <= closed.hi <= enclosure.hi
            if m > 1:
                wrong = closed*m  # incorrect m^2 rather than m scaling
                assert wrong.lo > enclosure.hi
            rows.append({'multiplicity': m, 'log_amplitude_over_eta': h,
                         'integral_enclosure_E_over_pi': enclosure.pair(),
                         'closed_formula_E_over_pi': closed.pair()})
    counts['interval_monomial_integral_checks'] = len(rows)

    # At R=1, c=1 the normalized count is m plus O(1/log(1/eta)).
    # Tiny c tests why normalization must be resolved before taking a limit.
    resolution = []
    for m in (1, 2, 5):
        for amp_power in (0, 20):
            ratios = []
            for eta_power in (10, 40, 100):
                amp = I(1)/(10**amp_power)
                eta = I(1)/(10**eta_power)
                u = (amp/eta).square()
                count_estimate = fi(F(m, 2))*((1+u).log()+1/(1+u)-1)/(I(1)/eta).log()
                if amp_power == 0:
                    lower = fi(F(m))*(1-I(1)/(2*(I(1)/eta).log()))
                    assert count_estimate.hi < m
                    # At eta=10^-100 the positive correction is smaller than
                    # the interval rounding scale: require consistency, not
                    # an unresolvable strict separation of the two enclosures.
                    assert count_estimate.hi >= lower.lo
                if amp_power == 20 and eta_power == 10:
                    # log(1+u)+1/(1+u)-1 <= u^2/2 for u>=0.
                    bound = fi(F(m, 4))*u.square()/(I(1)/eta).log()
                    assert count_estimate.hi < bound.hi
                ratios.append({'eta_power_of_ten': eta_power,
                               'normalized_E_over_log': count_estimate.pair()})
            resolution.append({'multiplicity': m, 'amplitude_power_of_ten': amp_power,
                               'rows': ratios})

    return {'status': 'model checks passed; small-value zeta estimate remains open',
            'precision_decimal_digits': PREC, 'checks': counts,
            'interval_checks': rows, 'finite_resolution_examples': resolution,
            'scope': 'Exact rational and outward-interval comparison checks; no new actual-zeta certificate, no independent external audit, no RH proof.'}


if __name__ == '__main__':
    print(json.dumps(run(), indent=2))
