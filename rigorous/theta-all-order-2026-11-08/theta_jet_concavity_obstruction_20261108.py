"""Exact-form interval certificate: squared-variable log concavity is insufficient.

The example k(u)=exp(-u*u)*(3/2+cosh(u)) satisfies both strict ordinary
log concavity and strict concavity of log(k(sqrt(x))). Its cutoff jet
restricted to derivative orders 1 and 3 is nevertheless indefinite.

This is an auxiliary counterexample, not the Riemann theta kernel.
All integrals reduce to finitely many Gaussian moments. The only special
function, erf at |x|<=1/sqrt(2), is enclosed by its alternating series.
"""

from fractions import Fraction
from math import factorial
from mpmath import iv

iv.dps = 50


def rational(q):
    q = Fraction(q)
    return iv.mpf(q.numerator) / q.denominator


def derivative_polynomials(b, maximum=3):
    # D^n exp(-u^2+b*u)=p_n(u;b)*exp(-u^2+b*u).
    answer = [[Fraction(1)]]
    for n in range(maximum):
        p = answer[-1]
        q = [Fraction(0)] * (len(p) + 1)
        for k, coefficient in enumerate(p):
            if k:
                q[k-1] += k*coefficient
            q[k] += b*coefficient
            q[k+1] -= 2*coefficient
        answer.append(q)
    return answer


def multiply(p, q):
    answer = [Fraction(0)] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            answer[i+j] += a*b
    return answer


def erf_enclosure(x, terms=40):
    # Terms decrease because x^2<=1/2. The first omitted absolute term
    # is a rigorous alternating-series error bound, including x<0.
    value = iv.mpf(0)
    for n in range(terms):
        value += (-1)**n*x**(2*n+1)/(factorial(n)*(2*n+1))
    error = abs(x)**(2*terms+1)/(factorial(terms)*(2*terms+1))
    return 2/iv.sqrt(iv.pi)*(value + iv.mpf([-1, 1])*error)


def moments(b, maximum=7):
    # M_j(b)=integral_0^infinity u^j exp(-2u^2+b*u) du.
    b = iv.mpf(b)
    x = b/(2*iv.sqrt(2))
    first = iv.sqrt(iv.pi)/(2*iv.sqrt(2))*iv.exp(b*b/8)*(1+erf_enclosure(x))
    answer = [first, (b*first+1)/4]
    for j in range(1, maximum):
        answer.append((b*answer[j]+j*answer[j-1])/4)
    return answer


components = [(0, Fraction(3, 2)), (-1, Fraction(1, 2)), (1, Fraction(1, 2))]
polynomials = {b: derivative_polynomials(b) for b, weight in components}
gaussian_moments = {b: moments(b) for b in range(-2, 3)}


def product_integral(b, m, c, n, extra_power=0):
    polynomial = multiply(polynomials[b][m], polynomials[c][n])
    return sum(rational(coefficient)*gaussian_moments[b+c][j+extra_power]
               for j, coefficient in enumerate(polynomial))


def jet(m, n):
    result = iv.mpf(0)
    for b, wb in components:
        for c, wc in components:
            value = 2*product_integral(b, m, c, n, 1)
            if m:
                value += m*product_integral(b, m-1, c, n)
            if n:
                value += n*product_integral(b, m, c, n-1)
            result += rational(wb*wc)*value
    return result


J11, J13, J33 = jet(1, 1), jet(1, 3), jet(3, 3)
determinant = J11*J33-J13**2

print('J11:', J11)
print('J13:', J13)
print('J33:', J33)
print('det of odd derivative block {1,3}:', determinant)
assert J11.a > 0
assert J33.a > 0
assert determinant.b < 0

# A fixed rational vector supplies a directly checkable negative direction.
# No fitted irrational eigenvector is required.
coefficient = Fraction(1, 5)
quadratic = J11 + 2*rational(coefficient)*J13 + rational(coefficient**2)*J33
print('Quadratic form on P(D)=D+(1/5)D^3:', quadratic)
assert quadratic.b < 0
print('CERTIFIED fixed rational negative direction.')

print('CERTIFIED: stronger log concavity alone does not imply all-orders jet positivity.')

# Independent actual-theta origin check needed for the smooth coefficient
# b(u)=-u*kappa(u)/kappa'(u). This is not the auxiliary Gaussian kernel.
t = iv.pi
p2 = 2*t**4-14*t**3+rational(Fraction(165, 8))*t*t-rational(Fraction(75, 16))*t
first_theta_term = p2*iv.exp(-t)
remaining_theta_upper = 2*iv.pi**4*256*iv.exp(-4*iv.pi)/(
    1-(iv.mpf(3)/2)**8*iv.exp(-5*iv.pi)
)
assert first_theta_term.a > iv.mpf('-2.179508')
assert (first_theta_term+remaining_theta_upper).b < iv.mpf('-2.005581')
print('CERTIFIED actual theta kappa second derivative at zero lies in (-2.179508,-2.005581).')
