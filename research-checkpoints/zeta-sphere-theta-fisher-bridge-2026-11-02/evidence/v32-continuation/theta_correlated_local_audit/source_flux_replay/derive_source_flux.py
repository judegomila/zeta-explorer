"""Owned exact symbolic finite-interval moment flux generation."""
import sympy as s,json
from pathlib import Path
u=s.Symbol('u');v=s.symbols('v0:17')
def D(x):return s.diff(x,u)+sum(s.diff(x,v[k])*v[k+1] for k in range(16))
out={}
for j in range(1,8):
 gj=(-1)**j*s.Rational(1,4)**j*sum((-1)**k*s.binomial(2*j,k)*v[k]*v[2*j-k] for k in range(2*j+1))
 target=s.expand(u*u*gj-u*u*v[j]**2+s.Rational(j,2)*v[j-1]**2)
 basis=[]
 for power,total in [(2,2*j-1),(1,2*j-2),(0,2*j-3)]:
  if total<0:continue
  for k in range(total//2+1):basis.append(u**power*v[k]*v[total-k])
 cs=s.symbols('c:'+str(len(basis)));expr=sum(c*t for c,t in zip(cs,basis));eq=s.Poly(s.expand(D(expr)-target),u,*v).coeffs();sol=s.solve(eq,cs);F=s.expand(expr.subs(sol));assert s.expand(D(F)-target)==0
 Fgeneral=0
 for k in range(1,j+1):
  base=v[j-k]**2; derivatives=[base]
  for t in range(2*k-1):derivatives.append(s.expand(D(derivatives[-1])))
  part=u*u*derivatives[2*k-1]-2*u*derivatives[2*k-2]
  if k>=2:part+=2*derivatives[2*k-3]
  Fgeneral+=s.binomial(j,k)*s.Rational(-1,4)**k*part
 assert s.expand(Fgeneral-F)==0
 terms=[]
 for (powers,coef) in s.Poly(F,u,*v).terms():
  inds=[]
  for k,m in enumerate(powers[1:]):inds.extend([k]*m)
  assert len(inds)==2
  terms.append([powers[0],*inds,str(coef)])
 out[j]=terms
print(json.dumps(out,indent=2))
