"""Own-source exact polynomial-jet identity replay."""
import sympy as s
u=s.symbols('u');g=s.symbols('g0:12')
def D(expr):return s.diff(expr,u)+sum(s.diff(expr,g[j])*g[j+1] for j in range(11))
rows=[]
for k in range(8):
 for q in range(5):
  m=2*q+1
  actual=2*u**m*g[k]*(u*u*g[k]+(2*k*u*g[k-1] if k else 0)+(k*(k-1)*g[k-2] if k>=2 else 0))
  vol=2*u**(m+2)*g[k]**2
  if k:vol-=2*k*(k+2*q+1)*u**m*g[k-1]**2
  if k>=2 and q:vol+=2*q*(2*q+1)*k*(k-1)*u**(m-2)*g[k-2]**2
  flux=0
  if k:flux+=2*k*u**(m+1)*g[k-1]**2
  if k>=2:flux+=2*k*(k-1)*u**m*g[k-1]*g[k-2]-k*(k-1)*m*u**(m-1)*g[k-2]**2
  assert s.expand(actual-vol-D(flux))==0,(k,q)
  rows.append((k,q))
print('PASS: all 40 local flux polynomial-jet identities exactly zero.')
