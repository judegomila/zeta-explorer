"""Verify exact algebra in the theta modular reduction.

Symbolic checks certify the stated polynomial identities. Numerical checks
only audit normalization against the defining theta series; they do not
certify any all-orders energy or RH statement. The rational-cusp obstruction
is proved analytically in the companion note, not by numerical sampling.
"""

import json
import sympy as s
import mpmath as mp

a, c, v = s.symbols('a c v', real=True)
H = s.symbols('H', positive=True)
fa = 2*a*a + (v-1)/8
fc = 4*a*c + 2*v
fv = v*(8*a-c)


def flow(f):
    return s.expand(s.diff(f,a)*fa+s.diff(f,c)*fc+s.diff(f,v)*fv)


q = 3*a*a + v/8-s.Rational(3,16)
w = s.Rational(1,16)-a*a
d = c-16*a
assert s.simplify(fa-q-w) == 0
assert s.simplify(flow(d)-(4*a*d+32*a*a+2)) == 0
assert s.simplify(flow(q)+(d+2*a)*q+3*w*(d+6*a)) == 0
assert s.simplify(flow(w)+2*a*(q+w)) == 0
assert s.simplify(-(a+flow(q)/q)-(d+a+3*w*(d+6*a)/q)) == 0
assert s.simplify(flow(c*c+4*v)-8*a*(c*c+4*v)) == 0

# H'=aH. These are the two positive backward-propagation equations.
def extended_flow(f):
    return s.simplify(flow(f)+s.diff(f,H)*a*H)

U = q/(v*H**6)
V = H**2*w
beta = 3*(d+6*a)/(v*H**8)
gamma = 2*a*v*H**8
assert s.simplify(extended_flow(U)+beta*V) == 0
assert s.simplify(extended_flow(V)+gamma*U) == 0

# An exact outward-pointing boundary of the proposed simple positivity cone.
point = {a:s.Rational(1,8),c:s.Integer(2),v:s.Rational(9,8)}
assert q.subs(point) == 0
assert flow(q).subs(point) == -s.Rational(27,256)
assert s.diff(fc,v)*s.diff(fv,c) == -2*v

# Generator parity proves the induction at every order in the note.
reflect = {a:-a,c:-c}
assert s.expand(fa.xreplace(reflect)-fa) == 0
assert s.expand(fc.xreplace(reflect)-fc) == 0
assert s.expand(fv.xreplace(reflect)+fv) == 0
assert s.expand(q.xreplace(reflect)-q) == 0

R = [q]
for n in range(4):
    R.append(s.expand(flow(R[-1])+a*R[-1]))
Rfun = [s.lambdify((a,c,v), polynomial, 'mpmath') for polynomial in R]

# Normalization audit against independent theta sums.
mp.mp.dps = 70
theta_polynomials = [[mp.mpf(0),mp.mpf(-3),mp.mpf(2)]]
for n in range(4):
    old = theta_polynomials[-1]
    new = [mp.mpf(0)]*(len(old)+1)
    for j,value in enumerate(old):
        new[j] += (mp.mpf(j)+mp.mpf(1)/4)*value
        new[j+1] -= value
    theta_polynomials.append(new)


def theta_derivative(u,n):
    t = mp.exp(u)
    total = mp.mpf(0)
    for k in range(1,31):
        z = mp.pi*k*k*t
        total += mp.exp(u/4-z)*mp.polyval(theta_polynomials[n][::-1],z)
    return total


errors = []
for u in [mp.mpf(0),mp.mpf('0.3'),mp.mpf(1)]:
    t = mp.exp(u)
    nome = mp.exp(-mp.pi*t)
    T2,T3,T4 = [mp.jtheta(j,0,nome) for j in [2,3,4]]
    X,Y = T2**4,T4**4
    E = 1-24*sum(k*nome**(2*k)/(1-nome**(2*k)) for k in range(1,61))
    aval = mp.mpf(1)/4-mp.pi*t*(E+X-Y)/12
    cval = mp.pi*t*(Y-X)
    vval = mp.pi**2*t*t*X*Y
    Hval = mp.exp(u/4)*T3
    for n,polynomial in enumerate(Rfun):
        err = abs(Hval*polynomial(aval,cval,vval)-theta_derivative(u,n))
        assert err < mp.mpf('1e-55')
        errors.append(err)

print(json.dumps({
    'symbolic_modular_and_volterra_identities':'passed',
    'simple_cone_outward_derivative':'-27/256',
    'variational_negative_two_cycle':'-2*v',
    'normalization_checks':len(errors),
    'maximum_normalization_absolute_error':mp.nstr(max(errors),8),
    'scope':'No all-orders energy positivity is asserted; cusp obstruction has a separate analytic proof.'
},indent=2))
