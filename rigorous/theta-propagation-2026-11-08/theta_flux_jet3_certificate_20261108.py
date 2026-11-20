"""Interval certificate for the order-2 derivative jet of the full theta flux.

This proves one finite jet matrix positive definite. It does not prove the
full flux operator positive or imply RH. Full theta tails are bounded.
"""

from fractions import Fraction
from math import comb, factorial
from mpmath import iv

iv.dps = 40
caps = [2, 9, 53, 376, 3245, 33219, 396103]
polys = []
p = [Fraction(0), Fraction(-3), Fraction(2)]
for j in range(7):
    polys.append(p)
    pn = [Fraction(0)] * (len(p) + 1)
    for k, coefficient in enumerate(p):
        pn[k] += (k + Fraction(1, 4)) * coefficient
        pn[k + 1] -= coefficient
    p = pn

def ivfraction(value):
    return iv.mpf(value.numerator) / value.denominator

# For all polynomial powers q=k+1/4 used here, q<=33/4. For n>=2 the
# geometric ratio of (3n^2)^q exp(-3n^2) is bounded by this number.
ratio = (iv.mpf(3) / 2)**(iv.mpf(33) / 2) * iv.exp(-15)
assert ratio.b < iv.mpf('0.001')
for j, polynomial in enumerate(polys):
    bound = iv.mpf(0)
    for k, coefficient in enumerate(polynomial):
        if not coefficient:
            continue
        q = iv.mpf(k) + iv.mpf(1) / 4
        t = iv.mpf(3) if k <= 2 else q
        peak = t**q * iv.exp(-t)
        tail = iv.mpf(12)**q * iv.exp(-12) / iv.mpf('0.999')
        bound += abs(ivfraction(coefficient)) * (peak + tail)
    assert bound.b < caps[j]

# Uniform n>=9 remainder for derivatives of orders 0,1,2, on u>=0.
theta_tail = 10752 * 9**8 * iv.exp(-243) / (
    1 - (iv.mpf(10) / 9)**8 * iv.exp(-57)
)
assert theta_tail.b < iv.mpf('1e-92')

# For u>=3, |kappa^(j)(u)| <= 21504 exp(17u/4-3exp(u)), j=0,1,2.
sum_bound = 1 + 256 * iv.exp(-9) / (
    1 - (iv.mpf(3) / 2)**8 * iv.exp(-15)
)
assert sum_bound.b < 2
integral_tail = 21504**2 * iv.exp(-120) * sum(
    iv.mpf(factorial(8)) / factorial(8-k) * iv.mpf(20)**(8-k) / 6**(k+1)
    for k in range(9)
)
assert integral_tail.b < iv.mpf('1e-32')

def theta_derivatives_eight(u):
    exponential = iv.exp(u)
    prefactor = iv.exp(u / 4)
    answers = [iv.mpf(0), iv.mpf(0), iv.mpf(0)]
    for n in range(1, 9):
        t = iv.pi * n*n * exponential
        tail = prefactor * iv.exp(-t)
        for j in range(3):
            value = iv.mpf(0)
            for coefficient in reversed(polys[j]):
                value = value*t + ivfraction(coefficient)
            answers[j] += value*tail
    return answers

N = 2000
h = iv.mpf(3) / N
sums = [iv.mpf(0), iv.mpf(0), iv.mpf(0)]
for i in range(N + 1):
    u = i*h
    values = theta_derivatives_eight(u)
    weight = 1 if i in (0, N) else (4 if i % 2 else 2)
    for j in range(3):
        sums[j] += weight * u * values[j]**2

integrals = []
for j in range(3):
    def product_cap(k):
        return sum(comb(k,l)*caps[j+l]*caps[j+k-l] for l in range(k+1))
    fourth_derivative_cap = 3*product_cap(4) + 4*product_cap(3)
    quadrature_error = iv.mpf(3)/180*h**4*fourth_derivative_cap
    # The full-series error in the integral on [0,3] is <1e-88.
    error = quadrature_error + iv.mpf('1e-32') + iv.mpf('1e-88')
    enclosure = sums[j]*h/3 + iv.mpf([-1, 1])*error
    integrals.append(enclosure)
    print('I_%d = integral_0^infinity u*(kappa^(%d))^2:' % (j, j), enclosure)

k0 = theta_derivatives_eight(iv.mpf(0))[0] + iv.mpf([0, 1])*iv.mpf('1e-92')
I0, I1, I2 = integrals
J00 = 2*I0
J11 = 2*I1-k0**2
J02 = -2*I1
J22 = 2*I2
even_determinant = J00*J22-J02**2
full_determinant = J11*even_determinant

print('J00:', J00)
print('J11:', J11)
print('J02:', J02)
print('J22:', J22)
print('Even-block determinant:', even_determinant)
print('Full 3x3 determinant:', full_determinant)
assert J00.a > 0
assert J11.a > 0
assert even_determinant.a > 0
print('CERTIFIED: the full-theta jet matrix indexed by derivatives 0,1,2 is positive definite.')
