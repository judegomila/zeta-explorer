# symbolic check: with R = r (z + a R1)/(a + z R1)  (inverse of R1 = (r z - a R)/(z R - a r)),
#   (R(x)+R(y))/(x+y) = r a g(x) g(y) + r h(x) h(y) (R1(x)+R1(y))/(x+y),  g = (1+R1)/(a + z R1), h = (z-a)/(a + z R1)
import sympy as sp
x,y,a,r,p,q=sp.symbols('x y a r p q')   # p=R1(x), q=R1(y)
R=lambda z,w: r*(z+a*w)/(a+z*w)
lhs=(R(x,p)+R(y,q))/(x+y)
g=lambda z,w:(1+w)/(a+z*w); h=lambda z,w:(z-a)/(a+z*w)
rhs=r*a*g(x,p)*g(y,q)+r*h(x,p)*h(y,q)*(p+q)/(x+y)
print("identity residual:", sp.simplify(lhs-rhs))
z,Rz=sp.symbols('z Rz'); R1=(r*z-a*Rz)/(z*Rz-a*r)
print("inverse check:", sp.simplify(r*(z+a*R1)/(a+z*R1)-Rz))
