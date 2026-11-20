import sympy as s
L,x,y,z=s.symbols('L x y z', real=True)
def V(f):
 return s.expand((y+x*x-1)*s.diff(f,x)/2+2*y*(x+z)*s.diff(f,y)+(x*z-y)*s.diff(f,z))
def G(f): return s.expand(s.diff(f,L)+V(f)+x*f/2)
P=[y+s.Rational(3,2)*(x*x-1)]
for j in range(6): P.append(s.expand(2*V(P[-1])+x*P[-1]/2))
for j in range(6):
 assert s.Poly(P[j],x,y,z).total_degree()<=j+2
for j in range(4):
 for k in range(4):
  for m in range(3):
   rhs=(m*L**(m-1)*P[j]*P[k] if m else 0)+L**m*(P[j+1]*P[k]+P[j]*P[k+1])/2
   assert s.expand(G(L**m*P[j]*P[k])-rhs)==0
R=-L*P[0]**2+L**2*P[0]*P[1]/2
B=L**2*P[1]**2/2-P[0]**2
assert s.expand(B-G(R)-L**2*(P[1]**2-P[0]*P[2])/4)==0
print('PASS: 48 module identities, degree bounds through P5, base flux identity')
print('P1:',P[1]);print('P2 at center:',s.expand(P[2].subs({x:0,z:0})))
q,Y,Y1,Y2,Y3,pi=s.symbols('q Y Y1 Y2 Y3 pi')
def D(f):
 return q*(s.diff(f,q)+s.diff(f,Y)*Y1+s.diff(f,Y1)*Y2+s.diff(f,Y2)*Y3)
a=1+4*q*Y1/Y
U=s.factor(2*D(a)+1-a*a)
Vnum=s.factor(D(D(a))+a**3-3*a*D(a)-a)
J=(Y**2*Y3-15*Y*Y1*Y2+30*Y1**3)**2+32*(Y*Y2-3*Y1**2)**3-pi**2*Y**10*(Y*Y2-3*Y1**2)**2
assert s.factor(4*(Vnum**2+U**3)-(pi*q*Y**4)**2*U**2-64*q**6*J/Y**6)==0
print('PASS: transformed classical Jacobi identity')
