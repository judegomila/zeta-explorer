"""Exact symbolic audit of the odd-kernel obstruction.

Run: python3 factorization_audit.py
Requires SymPy. Writes factorization-audit.json next to this script.
No numerical eigensolver or quadrature is used in this audit.
"""
from pathlib import Path
import json
import sympy as s

x, y, t, a, b, lam = s.symbols('x y t a b lam', real=True)
m, d = (x+y)/2, (x-y)/2
P = lambda u: 1+a*u**2+b*u**4
poly = s.Poly(s.expand(P(t-d)*P(t+d)), t)
integrated = 0
for (power,), coefficient in poly.terms():
    assert power % 2 == 0
    j = power//2
    incomplete_gamma_polynomial = (
        s.factorial(j)/(2*lam)**(j+1)
        *sum((2*lam*m*m)**r/s.factorial(r) for r in range(j+1))
    )
    integrated += coefficient*incomplete_gamma_polynomial

odd = s.Poly(s.expand(integrated-integrated.subs(y, -y)), x, y)
M = s.Matrix([
    [(a*a*lam*lam+2*a*b*lam+3*b*b-2*b*lam*lam)/lam**4, a*b/lam**2],
    [a*b/lam**2, 2*b*b/lam**2],
])
assert s.expand(odd.as_expr()-(s.Matrix([[x,x**3]])*M*s.Matrix([y,y**3]))[0]) == 0
det_expected = b*b*(a*a*lam*lam+4*a*b*lam+6*b*b-4*b*lam*lam)/lam**6
assert s.simplify(M.det()-det_expected) == 0

control = {a:s.Rational(1,10), b:s.Rational(1,300), lam:1}
M0 = M.subs(control)
assert M0 == s.Matrix([[s.Rational(121,30000),s.Rational(1,3000)],
                      [s.Rational(1,3000),s.Rational(1,45000)]])
assert M0.det() == -s.Rational(29,1350000000)
moment = s.Matrix([1,-15])
assert (moment.T*M0*moment)[0] == -s.Rational(29,30000)

q = 1+t/10+t*t/300
V_second = s.simplify((s.diff(q,t)**2-q*s.diff(q,t,2))/q**2)
assert s.simplify(V_second-2*(t*t+30*t+150)/(t*t+30*t+300)**2) == 0

# Exact half-Gaussian moments on the positive half-line.
def gaussian_moment(power, rate=2):
    return s.gamma(s.Rational(power+1,2))/(2*s.Rational(rate)**s.Rational(power+1,2))

moments = s.Matrix([65*gaussian_moment(2)-84*gaussian_moment(4),
                   65*gaussian_moment(4)-84*gaussian_moment(6)])
assert s.simplify(moments-s.sqrt(s.pi)/(4*s.sqrt(2))*moment) == s.zeros(2,1)
energy = s.simplify((moments.T*M0*moments)[0])
assert energy == -29*s.pi/960000
norm_squared = s.simplify(65**2*gaussian_moment(2)-2*65*84*gaussian_moment(4)
                          +84**2*gaussian_moment(6))
assert s.simplify(norm_squared-s.Rational(1325,4)*s.sqrt(s.pi/2)) == 0

features = s.Matrix([[s.exp(-1),s.exp(-1)], [2*s.exp(-4),8*s.exp(-4)]])
gram = features*M0*features.T
coeff = s.Matrix([19*s.E/3,-8*s.exp(4)/3])
assert s.simplify(features.T*coeff-moment) == s.zeros(2,1)
assert s.simplify((coeff.T*gram*coeff)[0]) == -s.Rational(29,30000)
assert s.simplify(gram.det()+29*s.exp(-10)/37500000) == 0

# Polynomial-Gaussian transform discriminant, with e^(zu/2) convention.
z = s.symbols('z')
laplace_poly = (1+a/(2*lam)+3*b/(4*lam**2)
                +(a/(16*lam**2)+3*b/(16*lam**3))*z**2
                +b*z**4/(256*lam**4))
assert s.expand(laplace_poly.subs(control)-(z**4+528*z**2+80832)/76800) == 0
disc = s.discriminant(s.Poly(laplace_poly.subs(z**4,t*t).subs(z**2,t),t))
assert s.simplify(M.det()-256*b*b*disc) == 0

# Bounds used for the explicit double-exponential perturbation.
u = s.symbols('u')
bound_poly = s.Poly(s.expand((5+u*u)*(1+u*u/10+u**4/300)/4),u)
M_bound = sum(coef*2*gaussian_moment(power[0],1) for power,coef in bound_poly.terms())
assert s.simplify(M_bound-187*s.sqrt(s.pi)/128) == 0
shift = s.symbols('shift')
N_bound = sum(coef*s.diff(s.exp(shift**2/4),shift,power[0]).subs(shift,1)
              for power,coef in bound_poly.terms())*s.sqrt(s.pi)
assert s.simplify(N_bound-40477*s.sqrt(s.pi)*s.exp(s.Rational(1,4))/25600) == 0
perturbed_upper = -s.Rational(29,320000)+30000*s.Rational(1,10**9)
assert perturbed_upper == -s.Rational(97,1600000)

result = {
    'status':'All exact symbolic assertions passed',
    'sympy_version':s.__version__,
    'scope':'Explicit control kernels, not the actual Jacobi theta kernel',
    'convexity_second_derivative':str(V_second),
    'odd_feature_matrix':[[str(v) for v in row] for row in M0.tolist()],
    'odd_feature_determinant':str(M0.det()),
    'smooth_witness':'p(x)=exp(-x^2)*x*(65-84*x^2)',
    'smooth_witness_energy':str(energy),
    'smooth_witness_norm_squared':str(norm_squared),
    'two_node_coefficients':[str(v) for v in coeff],
    'two_node_determinant':str(s.simplify(gram.det())),
    'double_exponential_epsilon':'1/1000000000',
    'perturbed_energy_strict_upper_bound':str(perturbed_upper),
    'M_bound':str(s.simplify(M_bound)),
    'N_bound':str(s.simplify(N_bound)),
}
Path(__file__).with_name('factorization-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
