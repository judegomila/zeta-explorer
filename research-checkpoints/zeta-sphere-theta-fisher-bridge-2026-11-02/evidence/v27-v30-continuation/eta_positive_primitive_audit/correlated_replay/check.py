"""Own-source rational reuse of an existing certificate; executes no acquired code."""
from fractions import Fraction as F
import json
from pathlib import Path
src=Path('/workspace/shared/zeta_sphere_campaign/source_0145_audit/private/source/integrated_pivots_certificate.json')
d=json.loads(src.read_text()); b=next(b for b in d['blocks'] if b['parity']==0)
# JSON uses numerator strings.
def ball(v):return F(int(v['lo']),int(v['denominator'])),F(int(v['hi']),int(v['denominator']))
M=[[ball(v) for v in row] for row in b['matrix']]
reserves=[M[i][i][0]-sum(max(abs(M[i][j][0]),abs(M[i][j][1])) for j in range(3) if j!=i) for i in range(3)]
assert min(reserves)>F(1,40)
assert M[0][0][0]>F(3,100)
assert max(abs(M[0][1][0]),abs(M[0][1][1]))<F(1,10000)
alpha_bound=F(47,4)+F(66,4)*F(1,10000)/F(3,100)
assert alpha_bound<12
import math
Qs=[]
for r in range(3):
 total=0
 for j,c in [(0,12),(1,1)]:
  m=2*j+1
  for ell in range(min(m,r)+1):
   k=m-ell;power=r-ell
   E=1 if power==0 else 5**power+1
   total+=64*c*math.comb(m,ell)*math.factorial(r)//math.factorial(r-ell)*E*math.factorial(k)*3**k
 Qs.append(total)
Bupper=F(44,7)*(Qs[1]**2+Qs[0]*Qs[2]);s=10**10
h_lower=F(1089*3,40)
scaled_lower=h_lower-Bupper/s
assert Bupper/s<8 and scaled_lower>70
print(json.dumps(dict(scope='Rigorous finite N1 diagnostic reusing a pre-existing full-theta certificate, not a new ladder result',source=str(src),gershgorin_lower=[str(x) for x in reserves],alpha_upper=str(alpha_bound),Q_bounds=Qs,B_upper=str(Bupper),s=s,B_over_s=str(Bupper/s),h_lower=str(h_lower),scaled_residual_lower=str(scaled_lower),pass_scaled_residual_gt70=True),indent=2))
# Second existing even pivot, same already-audited certificate.
assert max(abs(M[0][2][0]),abs(M[0][2][1]))<F(1,20000)
assert max(abs(M[1][2][0]),abs(M[1][2][1]))<F(1,3000)
leading=F(10500,16)
regression_coeff_bound=leading*40*(F(1,20000)+F(1,3000))
assert regression_coeff_bound<11
assert F(551,8)+F(44,66)<70
assert F(6419,16)+F(11*47,66)+11<421
Qs2=[]
for r in range(3):
 total=0
 for j,c in [(0,421),(1,70),(2,1)]:
  m=2*j+1
  for ell in range(min(m,r)+1):
   k=m-ell;power=r-ell;E=1 if power==0 else 5**power+1
   total+=64*c*math.comb(m,ell)*math.factorial(r)//math.factorial(r-ell)*E*math.factorial(k)*3**k
 Qs2.append(total)
B2=F(44,7)*(Qs2[1]**2+Qs2[0]*Qs2[2]);s2=10**12
h2=F(3,10)*leading**2
assert h2-B2/s2>100000
Path(__file__).with_name('correlated_diagnostic_N2.json').write_text(json.dumps(dict(scope='Rigorous diagnostic of already certified second even pivot, not a new positivity result',regression_coefficient_bound=str(regression_coeff_bound),polynomial_coefficient_bounds=[421,70,1],Q_bounds=Qs2,B_upper=str(B2),s=s2,h_lower=str(h2),scaled_residual_lower=str(h2-B2/s2),pass_scaled_residual_gt100000=True),indent=2))
