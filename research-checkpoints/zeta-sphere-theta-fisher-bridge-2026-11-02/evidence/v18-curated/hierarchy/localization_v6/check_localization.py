"""Original symbolic checks; not a substitute for the analytic proof."""
import sympy as s
a,A,b,t,R=s.symbols('a A b t R',positive=True,real=True)
x=s.symbols('x',real=True)
f=(t+s.I*a)**2+b*b
W=s.simplify(-s.im(2*(t+s.I*a)*s.conjugate(f)))
assert s.expand(W-2*a*(a*a+t*t-b*b))==0
avg=s.integrate(W.subs(t,x),(x,t-R,t+R))/(2*R)
assert s.simplify(avg-2*a*(a*a+t*t-b*b+R*R/3))==0
B=2*a*(A*A+t*t-b*b)+s.Rational(2,3)*a*(A*A-a*a)
K=s.Rational(8,3)*a*(A*A-a*a)
assert s.expand(B-K-W)==0
assert s.diff(B,a,2)+s.diff(B,t,2)==0
assert s.simplify(B.subs(a,A)-W.subs(a,A))==0
assert B.subs(a,0)==0
c,h=s.symbols('c h',positive=True)
d=s.integrate(x*s.exp(c*x),(x,0,h))/s.integrate(s.exp(c*x),(x,0,h))
assert s.simplify(d-(h/(1-s.exp(-c*h))-1/c))==0
print('PASS: entire counterexample, interval average, harmonic boundary extension, cost, exponential displacement moment.')
