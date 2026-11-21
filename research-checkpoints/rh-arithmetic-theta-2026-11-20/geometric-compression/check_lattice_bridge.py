"""Exact controls for LATTICE_AND_TWIN_LADDER.md; not an RH checker."""

import json
from pathlib import Path

import sympy as s


checks = []


def record(name, condition, **details):
    passed = bool(condition)
    checks.append({"name": name, "passed": passed, **details})
    if not passed:
        raise AssertionError(name)


# The integral matrix is expressed in lattice bases, not orthonormal bases.
integral_map = s.Matrix([[2, 1], [0, 3]])
source_gram = s.diag(4, 9)
target_gram = s.diag(1, 4)
source_volume = s.sqrt(source_gram.det())
target_volume = s.sqrt(target_gram.det())
orthonormal_map = s.diag(1, 2) * integral_map * s.diag(s.Rational(1, 2), s.Rational(1, 3))
index = abs(integral_map.det())
image_gram = integral_map.T * target_gram * integral_map
image_volume = s.sqrt(image_gram.det())
jacobian = abs(orthonormal_map.det())
hs_sq = s.trace(orthonormal_map.T * orthonormal_map)

record(
    "index_and_volume_identity_in_nonorthonormal_metrics",
    image_volume == index * target_volume == jacobian * source_volume,
    index=str(index), source_volume=str(source_volume),
    target_volume=str(target_volume), image_volume=str(image_volume),
    norm_determinant=str(jacobian),
)
record(
    "hilbert_schmidt_determinant_bound_rank_two",
    jacobian <= hs_sq / 2,
    hs_squared=str(hs_sq), determinant_upper_bound=str(hs_sq / 2),
)
record(
    "slope_index_identity_after_exponentiating",
    index == source_volume / target_volume * jacobian,
    qualification="Exponentiating r*(mu(N)-mu(L)) yields vol(L)/vol(N).",
)

# Q(i), Lambda=a Z[i], h(x,y)=conj(x)y: the bound is attained.
a = s.symbols("a", positive=True, integer=True)
degree, discriminant = s.Integer(2), s.Integer(4)
q = a**4
beta = s.Rational(1, 4) / a**2
field_norm_beta = beta**2
trace_beta = 2 * beta
lower_bound = degree / s.sqrt(q * discriminant**2)
record(
    "gaussian_integer_trace_dual_bound_is_sharp",
    s.simplify(trace_beta - lower_bound) == 0,
    beta=str(beta), trace=str(trace_beta), lower_bound=str(lower_bound),
)
record(
    "gaussian_integer_norm_index_discriminant_accounting",
    s.simplify(field_norm_beta * q * discriminant**2) == 1,
    qualification="This checks the discriminant squared and index factors.",
)

# At X=12 and m=4 all weights and rounding errors are rational.
X, multiplicity = s.Integer(12), s.Integer(4)
primes = list(s.primerange(2, int(X) + 1))
weights, exponents, remainders = {}, {}, {}
Q = s.Integer(1)
for p in primes:
    weight = s.Integer(0)
    power = p
    while power <= X:
        weight += X / power - 1
        power *= p
    exponent = s.floor(multiplicity * weight)
    remainder = multiplicity * weight - exponent
    weights[p] = weight
    exponents[p] = exponent
    remainders[p] = remainder
    Q *= s.Integer(p)**exponent

record(
    "ramp_divisibility_prime_exponents",
    exponents == {2: 30, 3: 13, 5: 5, 7: 2, 11: 0},
    integer_Q=str(Q), exponents={str(p): str(n) for p, n in exponents.items()},
)
record(
    "ramp_divisibility_exact_remainder_coefficients",
    remainders == {2: 0, 3: s.Rational(1, 3), 5: s.Rational(3, 5),
                   7: s.Rational(6, 7), 11: s.Rational(4, 11)},
    remainders={str(p): str(n) for p, n in remainders.items()},
)
record(
    "rounding_error_is_below_theta_termwise",
    all(0 <= remainder < 1 for remainder in remainders.values()),
    qualification="Every log(p) is positive, so these exact coefficient bounds certify the finite example.",
)
record(
    "integer_factorization_matches_prime_encoding",
    s.factorint(Q) == {p: int(n) for p, n in exponents.items() if n},
)

# Rescaling a target metric cannot erase its combined slope/norm cost.
c, scalar_Q = s.symbols("c scalar_Q", positive=True)
rescaled_slope = -s.log(c)
rescaled_log_norm = s.log(c * scalar_Q)
record(
    "rank_one_metric_rescaling_preserves_combined_cost",
    s.expand_log(rescaled_slope + rescaled_log_norm - s.log(scalar_Q), force=True) == 0,
)

report = {
    "status": "PASS",
    "checks_passed": len(checks),
    "checks_total": len(checks),
    "sympy_version": s.__version__,
    "scope": (
        "Exact finite controls for arithmetic index, metric normalization, a sharp trace-dual example, "
        "and the prime-ramp integer encoding. General theorems are proved in prose. "
        "This does not establish a theta-lift cost estimate, verify the external Lean dependency graph, or prove RH."
    ),
    "checks": checks,
}
output = Path(__file__).with_name("LATTICE_BRIDGE_CHECKS.json")
output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": report["status"], "passed": len(checks), "report": str(output)}))
