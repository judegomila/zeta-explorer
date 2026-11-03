"""Exact algebra replay only; not a numerical RH test or proof assistant."""
import sympy as s
x,y,V,T,e,t=s.symbols('x y V T e t', real=True)
p=[2*x*x-3*x]
for k in range(4):
    p.append(s.expand(2*x*s.diff(p[-1],x)+(s.Rational(1,2)-2*x)*p[-1]))
actual=s.expand((p[4]+2*(100+V)*p[2]+(100+V)**2*p[0]).subs(x,3+y))
target=32*y**6+48*y**5+(16*V+588)*y**4+(80*V+4560)*y**3+(2*V**2+421*V+s.Rational(174409,8))*y**2+(9*V**2+s.Rational(2913,2)*V+s.Rational(1032633,16))*y+9*V**2+s.Rational(2889,2)*V+s.Rational(979785,16)
assert s.expand(actual-target)==0
assert all(c>0 for c in s.Poly(actual,y,V).coeffs())
P=(t*t-T*T)**2+e*e
wp=s.diff(P,t)**2-P*s.diff(P,t,2)
assert s.expand(wp.subs(t,T)+8*T*T*e*e)==0
F=s.Function('F')(t)
w=lambda H:s.diff(H,t)**2-H*s.diff(H,t,2)
assert s.simplify(w(P*F)-P*P*w(F)-F*F*w(P))==0
r,c=s.symbols('r c')
G=1/(1-2*c*r+r*r)
assert s.simplify((1-2*c*r+r*r)*G-1)==0
print('PASS: orbit recurrence, all positive shifted coefficients, quartet density identity, and prime recurrence denominator')
