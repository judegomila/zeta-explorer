"""Owned symbolic checks only; not a certificate of general SOS feasibility."""
import sympy as s
L,x,y,z,v=s.symbols('L x y z v')
coords=[x,y,z,v]
vec=[(y+x*x-1)/2,2*y*(x+z),x*z-y,x*(1-v)-2*v*z]
def V(g):return s.expand(sum(a*s.diff(g,b) for a,b in zip(vec,coords)))
c=y*v-x*x+1
assert s.expand(V(c)-x*c)==0
print('constraint V(C)=xC: PASS')
b=s.Rational(9,2)*x+4*z
T=[1+s.Rational(3,2)*v]
P=[y+s.Rational(3,2)*(x*x-1)]
for j in range(5):
 assert s.cancel((y*T[j]-P[j]).subs(v,(x*x-1)/y))==0
 assert s.Poly(T[j],x,y,z,v).total_degree()<=j+1
 print('jet',j,'factorization and degree: PASS')
 if j<4:
  T.append(s.expand(2*V(T[j])+b*T[j]))
  P.append(s.expand(2*V(P[j])+x*P[j]/2))
def G(g):return s.expand(s.diff(g,L)+V(g)+b*g)
R=-L*T[0]**2+L**2*T[0]*T[1]/2
B=L**2*T[1]**2/2-T[0]**2
g1=T[1]**2-T[0]*T[2]-17*T[0]**2
S=17*L**2*T[0]**2/4+L**2*g1/4
assert s.expand(B-G(R)-S)==0
assert s.Poly(R,L,x,y,z,v).total_degree()<=5
assert s.Poly(B,L,x,y,z,v).total_degree()<=6
print('n1 SOS base identity and trial degrees: PASS')
print('No general SOS feasibility or theta pivot inferred.')
