"""Owned exact-boundary evaluation for full-theta finite-width source."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_degree7_regional_payment.py').read_text();exec(s[:s.index('sums=')])
s=(p/'check_three_region_payment.py').read_text();exec(s[s.index('def ball'):s.index('out={}')])
flux_terms=json.loads((p/'source_flux_coefficients.json').read_text())
def jets(u):
 z=pi*(2*u).exp();Z=z*(2*h).exp();r=arb_series([0],17)
 for n in range(2,9):r+=n*n*(2*n*n*Z-3)/(2*Z-3)*(-(n*n-1)*Z).exp()
 eps=2*C*9**36*z**16*(-80*z).exp()
 r=arb_series([r[j]+arb(0,(eps/math.factorial(j)).upper()) for j in range(17)],17)
 ell=h/2+(2*Z-3).log()+Z.log()-Z+(1+r).log()
 psi=4*(u/2).exp()*(2*z*z-3*z)*(-z).exp()*(1+r[0])
 ser=(ell-ell[0]).exp()*psi
 return [math.factorial(j)*ser[j] for j in range(17)]
def flux(j,u,v):return sum(arb(coef)*u**power*v[a]*v[b] for power,a,b,coef in flux_terms[str(j)]) if j else arb(0)
u0=arb(1)/8;u1=arb(1)/2;v0=jets(u0);v1=jets(u1)
out={}
for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
 data=json.loads((p/f'degree{degree}_eighth_partition_4000.json').read_text());m0=[arb(0)]+[ball(data['regions']['core']['moments'][str(j+shift)]) for j in range(6)]+[arb(0)]
 _,zc,_=solve(m0);coeff=zc+[arb(1)]
 d=[arb(0) for j in range(8)]
 for i in range(4):
  for j in range(4):d[i+j+shift]+=coeff[i]*coeff[j]
 B0=2*sum(d[j]*flux(j,u0,v0) for j in range(8));B1=2*sum(d[j]*flux(j,u1,v1) for j in range(8));boundary=B1-B0
 prev=json.loads((p/'finite_width_transport.json').read_text())[name]
 J=ball(prev['source_J']);K=ball(prev['adaptation_K']);bulk=J-boundary
 assert bulk.upper()<K.lower()
 if not shift:assert boundary.lower()>K.upper()
 out[name]={'boundary_minus_cost':directed(boundary-K),'bulk_minus_cost':directed(bulk-K),'boundary_at_initial':directed(B0),'boundary_at_final':directed(B1),'boundary_difference':directed(boundary),'signed_bulk':directed(bulk),'source_J':prev['source_J'],'adaptation_K':prev['adaptation_K'],'note':'Bulk is inferred from exact boundary identity and previously certified source; no independent bulk positivity or quadrature is claimed. Polynomial uses initial actual old/cross inverse only.'}
print(json.dumps(out,indent=2))
