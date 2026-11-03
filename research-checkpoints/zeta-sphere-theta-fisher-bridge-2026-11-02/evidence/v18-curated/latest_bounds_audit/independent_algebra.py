# Independently authored audit. Does not import or execute supplied bundle checker.
import sympy as s
from fractions import Fraction as F
z,t,n,v=s.symbols('z t n v', positive=True)
D=lambda f:s.expand(2*z*s.diff(f,z))
L=s.Rational(5,4)*s.log(z)+s.log(2*z-3)-z
L2=D(D(L)); L4=D(D(L2))
assert s.simplify(L4-4*L2+3456*z*z/(2*z-3)**4)==0
x=t+3
assert s.expand((4*x-19)*(2*x-3)**2+24*x-(16*t**3+20*(t-s.Rational(3,5))**2+s.Rational(9,5)))==0
ratio=n*n*(2*z*n*n-3)/(2*z-3)
assert s.simplify(ratio-n**4-s.Rational(3,2)*n*n*(n*n-1)/(z-s.Rational(3,2)))==0
p=s.Integer(1)
for j in range(1,5):
    p=s.expand(t*p-t*s.diff(p,t))
    expected=[None,t,t*t-t,t**3-3*t*t+t,t**4-6*t**3+7*t*t-t][j]
    assert p==expected
l2,l4=s.symbols('l2 l4')
g=s.exp(l2*v*v+l4*v**4/12)
assert s.diff(g,v,2).subs(v,0)==2*l2
assert s.diff(g,v,4).subs(v,0).expand()==2*l4+12*l2*l2
assert F(8*17**2-8*17-842)==1334
assert 4*F(1,10)*40+3*4+6*F(1,10)**4+8==F(180003,5000)
assert F(180003,5000)<37
assert F(640,8000)/(1-F(1,10000))<F(1,10)
assert F(13184,8000)/(1-F(1,10000))<2
assert F(282624,8000)/(1-F(1,10000))<40
assert F(96,20**5)<F(1,10000)
assert F(256,20**5)<F(1,10000)
assert F(32,20**5)==F(1,100000)
assert F(160000,99999)<2
q=F(7,20)
assert 2*q/(1-q**3)==F(5600,7657)<F(3,4)
assert sum(F(17,16)**j/s.factorial(j) for j in range(5))>F(20,7)
assert F(27,2*3**16)>F(1,10**7)
assert 4*(2*10**6)**2*F(1,10)*10**7<2*10**19
q=F(1,20**17)
assert q<F(1,10**22)
assert 4*(2*10**19)*q/(1-q**3)<F(1,100)
# Integral polynomial coefficient sums, distinct from acquired checker.
assert 128*s.factorial(3)+48*s.factorial(2)==864
assert 1024*s.factorial(4)+960*s.factorial(3)+120*s.factorial(2)==30576
assert 8192*s.factorial(5)+14336*s.factorial(4)+5280*s.factorial(3)+300*s.factorial(2)==1359384
print('PASS: independent identities and rational inequalities; analytic review separately documented.')
