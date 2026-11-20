"""Directed-interval checks of explicit all-cardinality tail-positivity margins.

The analytical theorem and full theta envelope are in theta_separated_tail.md.
This checks constants in that theorem, not sampled eigenvalues. It proves no
continuum-kernel positivity, zero pulse leakage, or Riemann hypothesis.
"""
from pathlib import Path
import json
from mpmath import iv

iv.dps = 40
examples = [('0.5', 1200000), ('1', 2000), ('2', 100), ('4', 20), ('8', 8)]
rows = []

for spacing, start in examples:
    delta, radius = iv.mpf(spacing), iv.mpf(start)
    decay = iv.exp(-radius)
    d = 3 * decay / (2 * iv.pi)
    b = decay / (2 * iv.pi * radius)
    c = 7 * decay / (4 * iv.pi)
    assert d < 1 and c < 1
    eta_interval = (1-d)**-4 * ((1-c)**-1 + b*(1-c)**-2) - 1
    # Use an enclosing upper endpoint. At very large R, subtraction from one
    # loses relative precision; outward rounding still supplies a valid bound.
    eta_upper = eta_interval.b
    assert eta_upper >= 0
    argument = 4 * iv.pi / delta
    lower = (4-iv.pi**2/3) / delta * 2 / (iv.exp(argument)+iv.exp(-argument))
    error = (
        4*eta_upper/(iv.exp(delta/2)-1)
        +32*(1+eta_upper)/(iv.exp(2)*radius**2*(iv.exp(delta/4)-1))
    )
    margin = lower-error
    assert margin.a > 0
    rows.append({
        'minimum_spacing': spacing,
        'minimum_coordinate': start,
        'relative_theta_error_upper': str(eta_upper),
        'sech_gram_lower_bound': str(lower),
        'operator_error_upper_bound': str(error),
        'normalized_positive_margin': str(margin),
        'scope': 'Every finite cardinality, all points in one end, fixed minimum spacing.'
    })

result = {
    'status': 'Certified constants for the proved separated-tail theorem; not RH.',
    'interval_decimal_precision': iv.dps,
    'examples': rows,
    'limitations': [
        'No fixed tail threshold uniform as spacing tends to zero.',
        'No statement for configurations mixing the two ends.',
        'No control of the actual pulse regularization limit.'
    ]
}
output = Path(__file__).with_suffix('.json')
output.write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result, indent=2))
