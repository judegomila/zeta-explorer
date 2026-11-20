"""Own-source exact polynomial smoke check of the general integration identity."""
import sympy as s
u=s.symbols('u');a=s.Rational(1,3);r=a-2*u
q=[s.Integer(1)]
for k in range(8):q.append(s.expand(s.diff(q[-1],u)+r*q[-1]))
mu=a/2;v=s.Rational(1,4);mom=[s.Integer(1),mu]
for k in range(2,20):mom.append(s.expand(mu*mom[-1]+(k-1)*v*mom[-2]))
for n in range(8):
 coeff={j:s.Integer(j+1) for j in range(n%2,n+1,2)}
 F=sum(c*q[j] for j,c in coeff.items());K=sum(j*c*q[j-1] for j,c in coeff.items() if j);L=sum(j*(j-1)*c*q[j-2] for j,c in coeff.items() if j>=2)
 P=s.Poly(s.expand(u*u*F*K+u*(K*K+F*L)),u)
 val=s.simplify(sum(c*mom[k[0]] for k,c in P.terms()))
 assert val==0,(n,val)
print('PASS: general integration identity, exact Gaussian moment checks degrees0 through7 with arbitrary parity coefficients.')
