"""Original local exact algebra checks; no acquired code executed."""
import sympy as s
x,y,a=s.symbols('x y a', real=True)
P=x**4-16*x*x+260
D=lambda p:s.expand(s.diff(p,x)-x*p/2)
p=[P]
for k in range(4): p.append(D(p[-1]))
L1=s.expand(p[1]**2-p[0]*p[2])
L2=s.expand(p[0]*p[4]/12-p[1]*p[3]/3+p[2]**2/4)
sos=y*y*(y-12)**2+568*(y-s.Rational(846,71))**2+s.Rational(255312,71)
assert s.expand(2*L1-sos.subs(y,x*x))==0
assert L2.subs(x,4)==-1334
# Universal recurrence checked on generic polynomial at n=0,1,2,3.
f=sum(s.Symbol('c'+str(k))*x**k for k in range(9))
def L(f,n):
    return s.expand(sum((-1)**(j+n)*s.diff(f,x,j)*s.diff(f,x,2*n-j)/(s.factorial(j)*s.factorial(2*n-j)) for j in range(2*n+1)))
for n in range(4):
    assert s.expand((2*n+2)*(2*n+1)*L(f,n+1)-4*L(s.diff(f,x),n)+s.diff(L(f,n),x,2))==0
print('PASS: rational SOS, negative L2(4), and universal recurrence n=0..3 for generic degree-eight polynomial.')
