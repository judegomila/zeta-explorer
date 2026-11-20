import sympy as s
x,t,a=s.symbols('x t a', real=True)
h=s.Function('h')(x,t)
D=s.diff(h,x)**2-h*s.diff(h,x,2)
rule={s.diff(h,t):-s.diff(h,x,2),s.diff(h,t,x):-s.diff(h,x,3),s.diff(h,t,x,2):-s.diff(h,x,4)}
assert s.simplify((s.diff(D,t)+s.diff(D,x,2)).subs(rule)-2*(s.diff(h,x,2)**2-s.diff(h,x)*s.diff(h,x,3)))==0
eps=s.Rational(24,49)
G=s.exp(-x*x/(4*a))/s.sqrt(a)
P=x**4-12*a*x*x+12*a*a+16*eps*a**4
assert s.simplify(s.diff(G,x,4)+eps*G-G*P/(16*a**4))==0
assert s.simplify((-12*a)**2-4*(12*a*a+16*eps*a**4)-32*a*a*(3-2*eps*a*a))==0
assert (3-2*eps*a*a).subs(a,s.Rational(7,4))==0
print('PASS: determinant identity, quartic Fourier transform, discriminant.')
