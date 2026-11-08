"""Certified rejection of the fixed-midpoint positive-kernel candidate.

Proves that the cosine transform of kappa(u)^2 at frequency 12 is negative.
This is NOT a counterexample to the desired integrated M_x kernel.
The full modular theta kernel is used; truncation, quadrature, and tail
errors are bounded separately. See accompanying notes for the bounds.
"""

from mpmath import iv

iv.dps = 40
N = 1000
h = iv.mpf(3) / N

# kappa_n^(j)(u)=exp(u/4)*p_j(pi*n^2*exp(u))*exp(-pi*n^2*exp(u)).
# The rows give exact rational coefficients indexed by powers of t.
polynomials = [
    [(0, 1), (-3, 1), (2, 1)],
    [(0, 1), (-15, 4), (15, 2), (-2, 1)],
    [(0, 1), (-75, 16), (165, 8), (-14, 1), (2, 1)],
    [(0, 1), (-375, 64), (1635, 32), (-529, 8), (45, 2), (-2, 1)],
    [(0, 1), (-1875, 256), (15465, 128), (-266, 1),
     (647, 4), (-33, 1), (2, 1)],
]
derivative_caps = [2, 9, 53, 376, 3245]
ratio = (iv.mpf(3) / 2)**(iv.mpf(25) / 2) * iv.exp(-15)
assert ratio.b < iv.mpf(1) / 20000
for j, row in enumerate(polynomials):
    bound = iv.mpf(0)
    for k, (numerator, denominator) in enumerate(row):
        if numerator == 0:
            continue
        q = iv.mpf(k) + iv.mpf(1) / 4
        peak_at = iv.mpf(3) if k <= 2 else q
        peak = peak_at**q * iv.exp(-peak_at)
        tail = iv.mpf(12)**q * iv.exp(-12) / (1 - iv.mpf(1) / 20000)
        bound += iv.mpf(abs(numerator)) / denominator * (peak + tail)
    print('Certified derivative bound', j, bound, '<', derivative_caps[j])
    assert bound.b < derivative_caps[j]

theta_tail = 32 * 9**4 * iv.exp(-243) / (
    1 - (iv.mpf(10) / 9)**4 * iv.exp(-57)
)
assert theta_tail.b < iv.mpf('1e-99')
heat_sum_bound = 1 + 16 * iv.exp(-9) / (
    1 - (iv.mpf(3) / 2)**4 * iv.exp(-15)
)
assert heat_sum_bound.b < 2
tail_integral_bound = 8192 * iv.exp(-120) * (
    iv.mpf(20)**4 / 6 + 4 * iv.mpf(20)**3 / 36
    + 12 * iv.mpf(20)**2 / 216 + 24 * iv.mpf(20) / 1296
    + iv.mpf(24) / 7776
)
assert tail_integral_bound.b < iv.mpf('1e-43')


def kappa_eight(u):
    v = iv.exp(u)
    return sum(
        (2 * iv.pi**2 * n**4 * v**(iv.mpf(9) / 4)
         - 3 * iv.pi * n**2 * v**(iv.mpf(5) / 4))
        * iv.exp(-iv.pi * n**2 * v)
        for n in range(1, 9)
    )


def integrand(u):
    k = kappa_eight(u)
    return 2 * k**2 * iv.cos(12 * u)


coefficients = [-2, 9, -19, 24, -19, 9, -2]
spacing = iv.mpf(3) / 20
values = [kappa_eight(j * spacing)**2 for j in range(7)]
quadratic_form = sum(
    coefficients[i] * coefficients[j] * values[abs(i - j)]
    for i in range(7) for j in range(7)
)
quadratic_form += iv.mpf([-1, 1]) * iv.mpf('3e-95')
print('Seven-point full-theta quadratic form:', quadratic_form)
assert quadratic_form.b < 0

positive_midpoint = iv.mpf(1) / 20
shifted_values = [
    kappa_eight(abs(positive_midpoint + j * spacing))
    * kappa_eight(abs(positive_midpoint - j * spacing))
    for j in range(7)
]
shifted_quadratic_form = sum(
    coefficients[i] * coefficients[j] * shifted_values[abs(i - j)]
    for i in range(7) for j in range(7)
) + iv.mpf([-1, 1]) * iv.mpf('3e-95')
print('Positive-midpoint (a=1/20) full-theta quadratic form:', shifted_quadratic_form)
assert shifted_quadratic_form.b < 0


total = integrand(iv.mpf(0)) + integrand(iv.mpf(3))
for j in range(1, N):
    total += (4 if j % 2 else 2) * integrand(j * h)
simpson = total * h / 3

# Global derivative bounds |kappa^(j)| <= [2,9,53,376,3245], j=0,...,4.
# Leibniz gives |(2*kappa^2*cos(12*u))''''| <= 1842772.
quadrature_error = iv.mpf(3) / 180 * h**4 * 1842772
# Integral tail beyond 3 < 10^-43; theta truncation error < 10^-97.
remainder = quadrature_error + iv.mpf('1e-43') + iv.mpf('1e-97')
enclosure = simpson + iv.mpf([-1, 1]) * remainder

print('Interval Simpson value:', simpson)
print('Simpson error bound:', quadrature_error)
print('Full-transform certified enclosure:', enclosure)
assert enclosure.b < 0

