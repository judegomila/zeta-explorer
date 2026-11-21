"""Exact internal negative controls for the direct theta-kernel attempt.

Requires SymPy. This checks finite algebra and elementary tail majorants.
It neither certifies complete theta-kernel positivity nor proves RH.
"""
import json
from pathlib import Path
import sympy as s

checks = {}
a = s.symbols('a', positive=True)
g1 = s.Rational(3, 17)
g2 = s.Rational(15, 41)
q = s.factor(g1/a + g2/(2*a) - 2*(g1+g2)/(3*a))
checks['two_rate_negative_control'] = q == -s.Rational(3,1394)/a
checks['first_hyperbolic_value'] = (
    (s.Rational(2)-s.Rational(1,2))/2
    / (3+(s.Rational(2)+s.Rational(1,2))/2) == g1
)
checks['second_hyperbolic_value'] = (
    (s.Rational(4)-s.Rational(1,4))/2
    / (3+(s.Rational(4)+s.Rational(1,4))/2) == g2
)
checks['strong_log_concavity_bound'] = -s.Rational(1,8)+s.Rational(4,64) == -s.Rational(1,16)

r, A = s.symbols('r A', real=True)
term = (2*A*A*s.exp(s.Rational(9,4)*r)
        -3*A*s.exp(s.Rational(5,4)*r))*s.exp(-A*s.exp(r))
poly = 2*A**4-14*A**3+s.Rational(165,8)*A*A-s.Rational(75,16)*A
checks['theta_second_derivative_polynomial'] = (
    s.simplify(s.diff(term,r,2).subs(r,0)-s.exp(-A)*poly) == 0
)
absolute_majorant = 2*A**4+14*A**3+s.Rational(165,8)*A*A+s.Rational(75,16)*A
u = s.symbols('u', nonnegative=True)
shifted = s.Poly(s.expand((3*A**4-absolute_majorant).subs(A,u+243)),u)
checks['second_derivative_tail_polynomial_bound'] = all(c>0 for c in shifted.all_coeffs())

# For m>=9, pi>3 and exp(57)>1+57=58 give these rational upper bounds.
checks['degree4_tail_ratio_below_half'] = s.Rational(10,9)**4/58 < s.Rational(1,2)
checks['degree8_tail_ratio_below_half'] = s.Rational(10,9)**8/58 < s.Rational(1,2)
# For r>=4: pi>3, exp(r)>5, exp(45)>46 imply ratio <=16/46<1/2.
checks['large_r_first_term_tail_ratio'] = s.Rational(16,46) < s.Rational(1,2)
# 3(1+r+r^2/2)-9r/2 = (3/2)(r-1/2)^2+21/8 > 0.
checks['large_r_exponent_absorption'] = s.expand(
    3*(1+r+r*r/2)-s.Rational(9,2)*r
    -(s.Rational(3,2)*(r-s.Rational(1,2))**2+s.Rational(21,8))
) == 0

assert all(checks.values()), checks
result = {
    'status':'all exact symbolic and rational checks passed',
    'checks':{k:bool(v) for k,v in checks.items()},
    'negative_control':'-3/(1394*log(2))',
    'scope':'finite algebra and analytic-tail majorants; no RH proof or global positivity claim',
}
out=Path(__file__).with_name('OBSTRUCTION_CHECKS.json')
out.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
