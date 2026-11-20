"""Owned formal product-module check, not a new positivity computation."""
import sympy as s
L,a=s.symbols('L a',real=True)
t=s.symbols('T0:6',real=True)
# G acts on a product of two jet factors by the exact weighted rule.
def G(expr):
 expr=s.Poly(s.expand(expr),L,*t)
 out=0
 for powers,c in expr.terms():
  m=powers[0]; js=[]
  for j,k in enumerate(powers[1:]): js += [j]*k
  assert len(js)==2
  j,k=js
  if m:out+=c*m*L**(m-1)*t[j]*t[k]
  out+=c*L**m*(t[j+1]*t[k]+t[j]*t[k+1])/2
 return s.expand(out)
T0,T1,T2,T3,T4=t[:5]
B=L**2*(T2+a*T0)**2/2-2*T1**2-2*a*T0**2
R=L**2*(5*T1*T2-T0*T3)/8+L*(-3*T1**2+T0*T2)/2-T0*T1+a*(L**2*T0*T1-2*L*T0**2)
K=T0*T2-T1*T1; E=T0*T4-4*T1*T3+3*T2*T2
S=L**2*(a*a*T0*T0+a*K+E/8)/2
assert s.expand(B-G(R)-S)==0
W=T0**3*T4-4*T0**2*T1*T3+T0**2*T2**2+4*T0*T1**2*T2-2*T1**4
g2=W-1254*T0**4
sos=L**2*(2*a*T0*T0+K)**2/(8*T0*T0)+L**2*g2/(16*T0*T0)+s.Rational(1254,16)*L**2*T0*T0
assert s.cancel(S-sos)==0
assert s.Rational(399,400)**4>s.Rational(9,10)
assert 1+s.Rational(1,10)/(1-s.Rational(1,8000))<s.Rational(9,8)
assert sum(s.Rational(3)**j/s.factorial(j) for j in range(9))>20
assert s.Rational(10,9)**4/(1-s.Rational(16,8000))<2
print('Exact quadratic flux: PASS')
print('Localized square decomposition: PASS')
print('Rational constants and exp(3)>20 Taylor bound: PASS')
print('No general-degree sign inferred.')
