"""Interval Rayleigh exclusion of the specific psi=kappa^2 xi candidate.

Research session: 2026-11-07 (America/Los_Angeles).
This does not address RH itself. It excludes the identification of all positive
eigenfrequencies 2*sqrt(lambda_n) of L=-d^2/du^2+psi''/psi, u>=0,
Neumann at 0, with the positive xi ordinates, after removing the zero mode.

Dependency: mpmath. Run: python theta_confining_operator_certificate.py
The accompanying research note proves the theta and integration tail bounds.
"""
from pathlib import Path
import json
import mpmath as mp

iv = mp.iv
iv.dps = 30
N = 2000
step = iv.mpf(3) / N
unit_interval = iv.mpf([0, 1])

# For u>=0, the sum of theta terms with n>=5 is bounded by this constant.
theta_tail = (
    2 * iv.pi**2 * 625 * iv.exp(-25 * iv.pi)
    / (1 - iv.exp(iv.mpf(4) / 5 - 10 * iv.pi))
)
assert theta_tail < iv.mpf('1e-30')

# On u>=3, kappa(u)<=3*pi^2*exp(9*u/4-pi*exp(u)).
tail_bounds = {}
for j in (0, 2, 4):
    bound = (
        81 * iv.pi**8 * 3**j * iv.exp(27 - 4 * iv.pi * iv.exp(3))
        / (4 * iv.pi * iv.exp(3) - 9 - iv.mpf(j) / 3)
    )
    assert bound < iv.mpf('1e-90')
    tail_bounds[str(j)] = str(bound)

# Direct interval cell integration: each cell contains its exact rational
# endpoints. No numerical quadrature error model or monotonicity assumption.
moments = [iv.mpf(0) for _ in range(3)]
for j in range(N):
    u = (j + unit_interval) * step
    v = iv.exp(u)
    kappa = iv.mpf(0)
    for n in range(1, 5):
        t = iv.pi * n * n * v
        kappa += iv.exp(u / 4 - t) * (2 * t * t - 3 * t)
    kappa += iv.mpf([0, '1e-30'])
    density = kappa**4
    for k in range(3):
        moments[k] += step * u**(2 * k) * density
for k in range(3):
    moments[k] += iv.mpf([0, '1e-90'])

m0, m2, m4 = moments
variance_numerator = m4 - m2**2 / m0
assert variance_numerator > 0
rayleigh = 4 * m2 / variance_numerator
frequency_upper_bound = 2 * iv.sqrt(rayleigh)
assert rayleigh < 47
assert frequency_upper_bound < 14

result = {
    'status': 'Interval certificate for a specific candidate operator, not RH.',
    'operator': '-d^2/du^2 + (kappa^2)\'\'/(kappa^2), Neumann at 0',
    'trial': 'kappa(u)^2 * (u^2 - m2/m0)',
    'cells': N,
    'interval': [0, 3],
    'interval_decimal_precision': 30,
    'uniform_omitted_theta_tail': str(theta_tail),
    'moment_tail_bounds': tail_bounds,
    'moments_m0_m2_m4': [str(m) for m in moments],
    'rayleigh_enclosure': str(rayleigh),
    'frequency_upper_bound_enclosure': str(frequency_upper_bound),
    'conclusion': 'lambda_1 < 47, hence 2*sqrt(lambda_1) < 14; exact xi identification fails.'
}
output = Path(__file__).with_suffix('.json')
output.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
