"""Own-source exact generating transport jet identity smoke test."""
import sympy as s
u,z=s.symbols('u z');g=s.symbols('g0:10');E=s.exp(z*u*u)
def D(x):return s.diff(x,u)+sum(s.diff(x,g[j])*g[j+1] for j in range(9))
for k in range(8):
 actual=2*u*E*g[k]*((2*k*u*g[k-1] if k else 0)+(k*(k-1)*g[k-2] if k>=2 else 0))
 rhs=0;flux=0
 if k:
  rhs+=-2*k*(k+1)*u*E*g[k-1]**2-4*k*z*u**3*E*g[k-1]**2
  flux+=E*2*k*u*u*g[k-1]**2
 if k>=2:
  rhs+=k*(k-1)*(6*z*u*E*g[k-2]**2+4*z*z*u**3*E*g[k-2]**2)
  flux+=E*(2*k*(k-1)*u*g[k-1]*g[k-2]-k*(k-1)*(1+2*z*u*u)*g[k-2]**2)
 assert s.simplify(actual-rhs-D(flux))==0,k
print('PASS: all 8 generating characteristic identities exactly zero.')
