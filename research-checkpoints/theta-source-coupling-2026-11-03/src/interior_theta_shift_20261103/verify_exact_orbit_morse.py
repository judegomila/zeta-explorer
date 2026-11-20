"""Exact symbolic replay: no numerical tolerance or zero-location assumption."""
import sympy as S
x=S.symbols('x', positive=True)
z,r=S.symbols('z r', real=True)
v=S.Function('v')(x)
D=lambda h:2*x*S.diff(h,x)
B=lambda h:D(h)+(2*x-4)*h
Bt=lambda h:-D(h)+(2*x-4)*h
C=lambda h:D(h)+(2*x-2)*h
Ct=lambda h:-D(h)+(2*x-2)*h
J=lambda h:D(h)+2*x*h
Jt=lambda h:-D(h)+2*x*h
H=lambda h:-D(D(h))+(4*x*x-20*x)*h
assert S.simplify(Bt(B(v))-H(v)-16*v)==0
assert S.simplify(B(Bt(v))-Ct(C(v))-12*v)==0
assert S.simplify(C(Ct(v))-Jt(J(v))-4*v)==0
g=x*x*S.exp(-x)
phi=4*x*(2*x-3)*S.exp(-x)
assert S.simplify(H(g)+16*g)==0
assert S.simplify(H(phi)+4*phi)==0
assert S.simplify(Bt(x*S.exp(-x))-phi/2)==0
assert S.integrate(g*g/(2*x),(x,0,S.oo))==S.Rational(3,16)
assert S.integrate(phi*phi/(2*x),(x,0,S.oo))==6
assert S.integrate(g*phi/(2*x),(x,0,S.oo))==0
# Strip the common exponential e^{-(1+e^{2z})x} and x^r.
# Products include du=dx/(2x); the remaining polynomial is integrated monomialwise.
p_g=S.expand(2*S.pi**(-r)*S.exp(4*z)*(2*x**3-3*x**2))
p_phi=S.expand(8*S.pi**(-r)*(2*x**2-3*x)*(2*S.exp(4*z)*x**2-3*S.exp(2*z)*x)/x)
c=1+S.exp(2*z)
def gamma_integral(poly):
    return sum(coef*S.gamma(r+power[0]+1)/c**(r+power[0]+1)
               for power,coef in S.Poly(poly,x).terms())
Bg=2*S.pi**(-r)*S.exp(4*z)*(2*S.gamma(r+4)/c**(r+4)-3*S.gamma(r+3)/c**(r+3))
Bp=8*S.pi**(-r)*(4*S.exp(4*z)*S.gamma(r+4)/c**(r+4)-6*(S.exp(2*z)+S.exp(4*z))*S.gamma(r+3)/c**(r+3)+9*S.exp(2*z)*S.gamma(r+2)/c**(r+2))
assert S.simplify(gamma_integral(p_g)-Bg)==0
assert S.simplify(gamma_integral(p_phi)-Bp)==0
assert S.simplify(Bg.subs({r:0,z:0}))==0
assert S.simplify(Bp.subs({r:0,z:0}))==6
print('PASS: all three factorizations, eigenfunctions, norms, orthogonality, and both projection generators.')
