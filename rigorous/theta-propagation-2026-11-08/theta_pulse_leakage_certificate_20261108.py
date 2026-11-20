"""Interval upper bound on the ACTUAL theta box-pulse forbidden-tail energy.

For alpha=1, let C0 have boundary symbol (F-F')/(F+F'), where
F(z)=xi(1/2+z), and let f0=1_[0,1]. This script certifies

    ||1_(1,infinity) C0 f0||_2^2 < 1/8.

It does NOT establish a zero tail, any exponentially weighted bound, or RH.
The proof uses only unitarity of C0 and its exact action on three translates
of h_+(u)=(1+u/2)kappa(u). All coefficients and centers are fixed rationals.
See theta_pulse_leakage_bound_20261108.md for the analytical remainder proof.

Dependency: mpmath. All reported enclosures use mpmath.iv directed intervals.
"""
from pathlib import Path
import json
import mpmath as mp

iv = mp.iv
iv.dps = 35
mesh_denominator = 1000
step = iv.mpf(1) / mesh_denominator
centers_in_mesh_units = [0, 300, 600]
coefficients = [-iv.mpf(2), iv.mpf(5), -iv.mpf(9)/8]
coefficient_l1 = iv.mpf(65)/8

# Exact rational polynomials P_j with kappa_n^(j)(u)
# = exp(u/4-pi*n^2*exp(u))*P_j(pi*n^2*exp(u)), u>=0.
polynomials = [
    [(0, 1), (-3, 1), (2, 1)],
    [(0, 1), (-15, 4), (15, 2), (-2, 1)],
    [(0, 1), (-75, 16), (165, 8), (-14, 1), (2, 1)],
    [(0, 1), (-375, 64), (1635, 32), (-529, 8), (45, 2), (-2, 1)],
    [(0, 1), (-1875, 256), (15465, 128), (-266, 1),
     (647, 4), (-33, 1), (2, 1)],
]
kappa_caps = [2, 9, 53, 376, 3245]
tail_ratio = (iv.mpf(3)/2)**(iv.mpf(25)/2)*iv.exp(-15)
assert tail_ratio.b < iv.mpf(1)/20000
for j,row in enumerate(polynomials):
    cap = iv.mpf(0)
    for k,(numerator,denominator) in enumerate(row):
        if numerator == 0:
            continue
        power = iv.mpf(k)+iv.mpf(1)/4
        maximizing_argument = iv.mpf(3) if k <= 2 else power
        first = maximizing_argument**power*iv.exp(-maximizing_argument)
        rest = iv.mpf(12)**power*iv.exp(-12)/(1-iv.mpf(1)/20000)
        cap += iv.mpf(abs(numerator))/denominator*(first+rest)
    assert cap.b < kappa_caps[j]

# Uniform positive theta remainder for n>=5, at every u>=0.
theta_tail = (
    2*iv.pi**2*625*iv.exp(-25*iv.pi)
    /(1-iv.exp(iv.mpf(4)/5-10*iv.pi))
)
assert theta_tail.b < iv.mpf('1e-30')

# Values at the exact rational mesh; interval endpoints enclose each point.
kappa_values = []
for j in range(4001):
    u = j*step
    e = iv.exp(u)
    k = iv.mpf(0)
    for n in range(1,5):
        t = iv.pi*n*n*e
        k += iv.exp(u/4-t)*(2*t*t-3*t)
    kappa_values.append(k+iv.mpf([0,'1e-30']))


def feature_values(j):
    f,g = iv.mpf(0),iv.mpf(0)
    for center,coefficient in zip(centers_in_mesh_units,coefficients):
        displacement = (j-center)*step
        k = kappa_values[abs(j-center)]
        f += coefficient*(1+displacement/2)*k
        g += coefficient*(1-displacement/2)*k
    return f,g


def simpson_weight(j,left,right):
    if j in (left,right):
        return 1
    return 4 if (j-left)%2 else 2


f2_sum,box_sum,g2_sum = iv.mpf(0),iv.mpf(0),iv.mpf(0)
for j in range(-3000,4001):
    f,g=feature_values(j)
    f2_sum += simpson_weight(j,-3000,4000)*f*f
    if 0 <= j <= 1000:
        box_sum += simpson_weight(j,0,1000)*f
    if 1000 <= j <= 4000:
        g2_sum += simpson_weight(j,1000,4000)*g*g

f2_simpson = step*f2_sum/3
box_simpson = step*box_sum/3
g2_simpson = step*g2_sum/3

# All translated arguments used in the quadratures have modulus <=4.
# |h_+/-^(j)| <= 3*kappa_caps[j] + (j/2)*kappa_caps[j-1].
feature_caps = []
for j in range(5):
    bound = 3*iv.mpf(kappa_caps[j])
    if j:
        bound += iv.mpf(j)/2*kappa_caps[j-1]
    feature_caps.append(coefficient_l1*bound)
squared_fourth_cap = (
    2*feature_caps[0]*feature_caps[4]
    +8*feature_caps[1]*feature_caps[3]
    +6*feature_caps[2]**2
)
f2_quadrature_error = iv.mpf(7)/180*step**4*squared_fourth_cap
box_quadrature_error = iv.mpf(1)/180*step**4*feature_caps[4]
g2_quadrature_error = iv.mpf(3)/180*step**4*squared_fourth_cap

# For t>=3, kappa(t)<=3*pi^2*exp(9*t/4-pi*exp(t)).
# Thus either feature has squared L2 tail bounded by the following expression.
heat_sum_bound = 16*iv.exp(-3*iv.pi)/(1-iv.exp(2-4*iv.pi))
assert heat_sum_bound.b < iv.mpf(1)/2
single_feature_tail = (
    iv.mpf(225)/4*iv.pi**4*iv.exp(iv.mpf(27)/2-2*iv.pi*iv.exp(3))
    /(2*iv.pi*iv.exp(3)-iv.mpf(49)/10)
)
assert single_feature_tail.b < iv.mpf('1e-45')
f2_omitted_tail = 2*coefficient_l1**2*single_feature_tail
g2_omitted_tail = coefficient_l1**2*single_feature_tail

symmetric = iv.mpf([-1,1])
positive = iv.mpf([0,1])
f2 = f2_simpson+symmetric*f2_quadrature_error+positive*f2_omitted_tail
box_inner_product = box_simpson+symmetric*box_quadrature_error
g_tail_energy = g2_simpson+symmetric*g2_quadrature_error+positive*g2_omitted_tail
approximation_error = 1-2*box_inner_product+f2
assert approximation_error.a > 0
assert g_tail_energy.a > 0
leakage_upper = (iv.sqrt(approximation_error)+iv.sqrt(g_tail_energy))**2
assert leakage_upper.b < iv.mpf(1)/8

result = {
    'status': 'Interval-certified upper bound for actual pulse leakage; no zero-tail or RH claim.',
    'alpha': 1,
    'centers': ['0','3/10','3/5'],
    'coefficients': ['-2','5','-9/8'],
    'interval_decimal_precision': 35,
    'mesh_step': '1/1000',
    'theta_terms': 4,
    'uniform_theta_remainder_upper': '1e-30',
    'f_squared_integral_simpson_error_bound': str(f2_quadrature_error),
    'box_inner_product_simpson_error_bound': str(box_quadrature_error),
    'g_squared_tail_simpson_error_bound': str(g2_quadrature_error),
    'single_feature_tail_after_3_bound': str(single_feature_tail),
    'pulse_approximation_error_squared': str(approximation_error),
    'known_feature_output_tail_squared': str(g_tail_energy),
    'triangle_estimate_squared': str(leakage_upper),
    'conclusion': '||1_(1,infinity) C0 1_[0,1]||_2^2 < 1/8; hence at least 7/8 of output energy lies at u<=1.'
}
output = Path(__file__).with_suffix('.json')
output.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
