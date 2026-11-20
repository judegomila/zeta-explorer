"""Exact rational checks for the finite constants in the bridge Gram proofs.

Python 3 standard library only. This script checks algebra and finite numerical
inequalities used by the analytic proofs. It does NOT automatically verify
theta modularity, differentiation of infinite sums, Gaussian integral formulas,
operator arguments, or the Riemann hypothesis.

The exponential and pi checks use the standard exponential Taylor series and
the alternating Leibniz series for pi; the analytic identities themselves are
inputs to, rather than outputs of, this arithmetic checker.
"""
from fractions import Fraction as F
from math import comb, factorial
from pathlib import Path
import json

checks = []

def check(name, condition, value=None):
    if not condition:
        raise AssertionError(name)
    entry = {"name": name, "passed": True}
    if value is not None:
        entry["exact_value"] = str(value)
    checks.append(entry)

def add(*polys):
    out = [F(0)] * max(map(len, polys))
    for p in polys:
        for i, value in enumerate(p):
            out[i] += value
    return out

def mul(p, q):
    out = [F(0)] * (len(p) + len(q) - 1)
    for i, x in enumerate(p):
        for j, y in enumerate(q):
            out[i+j] += x*y
    return out

def scale(p, x):
    return [x*v for v in p]

def derivative(p):
    return [i*p[i] for i in range(1, len(p))] or [F(0)]

def shift(p, offset):
    out = [p[-1]]
    for coefficient in reversed(p[:-1]):
        out = add(mul(out, [offset, F(1)]), [coefficient])
    return out

def equal_poly(p, q):
    return all(v == 0 for v in add(p, scale(q, -1)))

def taylor(x, degree):
    return sum((x**j / factorial(j) for j in range(degree+1)), F(0))

# Elementary constants: rational lower and upper bounds derived from series.
pi_lower = 4*sum((F((-1)**j, 2*j+1) for j in range(8)), F(0))
check("Leibniz lower bound for pi exceeds 3", pi_lower > 3, pi_lower)
# The first alternating partial sum gives the strict upper bound pi < 4.
e_lower = taylor(F(1), 4)
e_upper = F(5, 2) + F(1, 6)/(1-F(1, 4))
check("Taylor lower bound for e exceeds 8/3", e_lower > F(8, 3), e_lower)
check("Geometric-series upper bound for e is below 3", e_upper < 3, e_upper)
check("The Gaussian-envelope condition 5/e^2 < 1", e_lower**2 > 5)
check("The theta-tail comparison 1/(e-1) < 1", e_lower > 2)
check("e^(1/2) < 2 follows from e < 3 < 4", F(3) < 2**2)
check("e^(1/4) < 2 follows from e < 3 < 16", F(3) < 2**4)

# Strong log-concavity: individual curvature and the entire mixture tail.
x = [F(3), F(1)]  # x=t+3
den = mul(add(scale(x, 2), [F(-3)]), add(scale(x, 2), [F(-3)]))
curvature_lhs = add(mul(add(scale(x, 4), [F(-19)]), den), scale(x, 24))
curvature_rhs = add([F(0), F(0), F(0), F(16)],
                    scale(mul([F(-3, 5), F(1)], [F(-3, 5), F(1)]), 20),
                    [F(9, 5)])
check("Individual curvature polynomial identity", curvature_lhs == curvature_rhs)
check("Individual curvature positive residual", F(9, 5) > 0, F(9, 5))
e3_lower = taylor(F(3), 8)
check("e^3 > 20", e3_lower > 20, e3_lower)
ratio_prefactor = F(3, 2)**4 * F(5, 2)**2
check("Successive theta-tail polynomial ratio < 32", ratio_prefactor < 32,
      ratio_prefactor)
tail_ratio = F(32, 20**5)
check("Entire theta-tail ratio <= 1/100000", tail_ratio == F(1, 100000),
      tail_ratio)
variance_upper = F(12800, 20**3)/(1-tail_ratio)
check("Entire mixture-variance bound < 2", variance_upper < 2, variance_upper)
check("Full log-curvature bound below -17", 19-variance_upper > 17,
      19-variance_upper)

# Quarter-separated configurations.
exp_quarter_lower = taylor(F(17, 16), 4)
check("e^(17/16) > 20/7", exp_quarter_lower > F(20, 7), exp_quarter_lower)
q_sep = F(7, 20)
row_sep = 2*q_sep/(1-q_sep**3)
check("Separated infinite row bound equals 5600/7657", row_sep == F(5600, 7657),
      row_sep)
check("Separated relative remainder < 3/4", row_sep < F(3, 4))
check("Separated coercivity reserve exceeds 1/4", 1-row_sep > F(1, 4),
      1-row_sep)

# Uniform derivative envelopes for psi, through order two.
base1 = [F(0), F(0), F(0), F(128)]
base2 = [F(0), F(0), F(48)]
first1, first2 = [F(9, 2), F(8)], [F(5, 2), F(8)]
P0 = add(base1, base2)
P1 = add(mul(base1, first1), mul(base2, first2))
P2 = add(mul(base1, add(mul(first1, first1), [F(0), F(16)])),
         mul(base2, add(mul(first2, first2), [F(0), F(16)])))
expected = [
    [0, 0, 48, 128],
    [0, 0, 120, 960, 1024],
    [0, 0, 300, 5280, 14336, 8192],
]
factorial_totals = []
for j, (poly, target) in enumerate(zip([P0, P1, P2], expected)):
    check("Derivative majorant P%d coefficients" % j, poly == list(map(F, target)))
    total = sum((coefficient*factorial(m) for m, coefficient in enumerate(poly)), F(0))
    factorial_totals.append(total)
    check("Derivative factorial total j=%d" % j, total < 2*10**6, total)
check("All three factorial totals", factorial_totals == [864, 30576, 1359384])

# Bridge weight integral and normalization; all bounds are intentionally loose.
I_upper = F(4, 54)  # e^(1/4)<2 and sqrt(pi)<2
check("Bridge weight integral I < 1/10", I_upper < F(1, 10), I_upper)
psi_lower_coefficient = F(4*3*(2*3-3))
check("First theta summand coefficient lower bound 36", psi_lower_coefficient == 36)
norm_coefficient = 2*psi_lower_coefficient**2*F(1, 4)**3/3
check("Normalization integral coefficient 27/2", norm_coefficient == F(27, 2),
      norm_coefficient)
norm_lower = norm_coefficient/F(3**16)
check("Normalization (27/2)e^-16 > 1e-7 using e<3",
      norm_lower > F(1, 10**7), norm_lower)
M = 2*10**19
for j in range(3):
    normalized_upper = F(2**j*(2*10**6)**2, 10)/F(1, 10**7)
    check("Normalized derivative envelope j=%d below M" % j,
          normalized_upper < M, normalized_upper)

# Pair geometry and its local reserve.
check("Pair exponent 40h^2 <= 2/5 for h<=1/10", 40*F(1, 10)**2 == F(2, 5))
check("e^(-2/5) > 1/2 follows from e<3 and 3^2<2^5", 3**2 < 2**5)
center_gap, pair_radius = F(5, 2), F(1, 10)
argument_gap = center_gap-2*pair_radius
check("Cross-cluster minimum argument gap 23/10", argument_gap == F(23, 10))
gaussian_exponent = 10*argument_gap**2
check("Cross-cluster Gaussian exponent 529/10", gaussian_exponent == F(529, 10))
check("Gaussian exponent exceeds 3*17", gaussian_exponent > 3*17)
q_pair = F(1, 20**17)
check("Paired geometric parameter q=20^-17 < 1e-22",
      q_pair < F(1, 10**22), q_pair)
row_pair = 4*M*q_pair/(1-q_pair**3)
check("Paired infinite off-block row norm < 1/100",
      row_pair < F(1, 100), row_pair)
check("Paired relative remainder < 1/50", 2*row_pair < F(1, 50))
check("Paired absolute reserve > 49/100", F(1, 2)-row_pair > F(49, 100))
check("Paired relative reserve > 49/50", 1-2*row_pair > F(49, 50))
check("Uniform within-pair QQ upper bound M/20 is finite", F(M, 20) == 10**18,
      F(M, 20))

# Three confluent channels. Analytic inputs include the positive Laplace
# representation of the exact tail ratio and the bridge moment identities.
# For D=2t*d/dt, D^j(exp(-t))=(-2)^j L_j(t)*exp(-t), with
# L_{j+1}=t*(L_j-L_j'). Arrays hold coefficients in ascending degree order.
laplace_expected = [
    [0, 1],
    [0, -1, 1],
    [0, 1, -3, 1],
    [0, -1, 7, -6, 1],
]
laplace_poly = [F(1)]
for j, target in enumerate(laplace_expected, 1):
    laplace_poly = mul([F(0), F(1)],
                       add(laplace_poly, scale(derivative(laplace_poly), -1)))
    check("Laplace derivative recurrence P%d" % j,
          laplace_poly == list(map(F, target)), laplace_poly)
    shifted = shift(laplace_poly, F(9))
    check("Laplace P%d nonnegative for t>=9 by shifted coefficients" % j,
          all(v >= 0 for v in shifted), shifted)
    monomial = [F(0)]*j + [F(1)]
    upper_difference = shift(add(monomial, scale(laplace_poly, -1)), F(9))
    check("Laplace P%d <= t^%d for t>=9 by shifted coefficients" % (j, j),
          all(v >= 0 for v in upper_difference), upper_difference)

triple_ratio_prefactor = F(3, 2)**4*F(8, 3)**3
check("Triple derivative-tail ratio prefactor equals 96",
      triple_ratio_prefactor == 96, triple_ratio_prefactor)
triple_tail_ratio = triple_ratio_prefactor/F(20**5)
check("Triple entire-tail ratio 96/20^5 < 1e-4",
      triple_tail_ratio < F(1, 10000), triple_tail_ratio)

triple_first_numerators = [640, 13184, 282624]
triple_limits = [F(1, 10), F(2), F(40)]
for j, (numerator, limit) in enumerate(zip(triple_first_numerators, triple_limits), 1):
    laplace_integral_bound = 2**j*2**4*(
        9**j+sum(comb(j, l)*9**(j-l)*factorial(l)*2**l for l in range(j+1)))
    check("Triple derivative first-tail numerator j=%d" % j,
          laplace_integral_bound == numerator, laplace_integral_bound)
    entire_bound = F(numerator, 20**3)/(1-F(1, 10000))
    check("Triple entire derivative-tail bound j=%d" % j,
          entire_bound < limit, entire_bound)

correction_loss = (4*triple_limits[0]*triple_limits[2]
                   + 3*triple_limits[1]**2 + 6*triple_limits[0]**4
                   + 4*triple_limits[1])
check("Triple logarithmic correction loss equals 180003/5000",
      correction_loss == F(180003, 5000), correction_loss)
check("Triple logarithmic correction loss < 37", correction_loss < 37)

# For L=log(f_1), L''=-4z-24z/(2z-3)^2. Differentiate the
# rational correction twice using D=2z*d/dz, retaining its denominator.
z_poly, d_poly = [F(0), F(1)], [F(-3), F(2)]
correction_numerator = scale(z_poly, -24)
twice_differentiated = correction_numerator
for denominator_power in [2, 3]:
    twice_differentiated = mul(scale(z_poly, 2), add(
        mul(derivative(twice_differentiated), d_poly),
        scale(mul(twice_differentiated, derivative(d_poly)), -denominator_power)))
fourth_minus_four_second = add(
    twice_differentiated,
    scale(mul(correction_numerator, mul(d_poly, d_poly)), -4))
check("First-summand fourth-derivative rational identity numerator -3456z^2",
      equal_poly(fourth_minus_four_second, [F(0), F(0), F(-3456)]))
d_fourth = mul(mul(d_poly, d_poly), mul(d_poly, d_poly))
first_summand_residual = shift(add(
    scale(d_fourth, 384), [F(0), F(0), F(-3456)]), F(3))
check("First-summand loss <= 384 for z>=3 by shifted coefficients",
      all(v >= 0 for v in first_summand_residual), first_summand_residual)
check("First-summand loss at z=3 equals 384", F(3456*3**2, (2*3-3)**4) == 384)
full_fourth_loss = F(384+37)
check("Full fourth-log-derivative loss constant 421", full_fourth_loss == 421)
# Put m=-17-y with y>=0. All coefficients of the determinant lower
# polynomial, after subtracting its constant reserve, are nonnegative.
m_poly = [F(-17), F(-1)]
determinant_poly = add(scale(mul(m_poly, m_poly), 8), scale(m_poly, 8),
                       [-2*full_fourth_loss])
check("Triple determinant polynomial at m=-17-y",
      determinant_poly == [F(1334), F(264), F(8)], determinant_poly)
check("Triple determinant reserve >=1334 for m<=-17",
      determinant_poly[0] == 1334 and all(v >= 0 for v in determinant_poly))

report = {
    "description": "Exact rational checks of finite constants in the separated, paired, and three-channel confluent bridge Gram proofs",
    "status": "all checks passed",
    "check_count": len(checks),
    "arithmetic": "Python fractions.Fraction; standard library only",
    "not_verified_automatically": [
        "theta modularity and analytic convergence",
        "differentiation of the full theta sum and bridge integrals",
        "strong-concavity and divided-difference arguments",
        "positive Laplace representation of the full theta tail ratio",
        "three-channel bridge moment and logarithmic derivative identities",
        "Gaussian integral identities and operator/Schur reasoning",
        "full positive definiteness for unrestricted nodes or RH",
    ],
    "checks": checks,
}
destination = Path(__file__).with_suffix(".json")
destination.write_text(json.dumps(report, indent=2)+"\n")
print("%d exact rational checks passed." % len(checks))
print("Separated relative bound:", row_sep, "< 3/4")
print("Paired relative bound: 2 *", row_pair, "< 1/50")
print("Triple logarithmic correction loss:", correction_loss, "< 37")
print("Triple fourth-log-derivative loss:", full_fourth_loss)
print("Triple determinant reserve:", determinant_poly[0])
print("Saved", destination.name)

