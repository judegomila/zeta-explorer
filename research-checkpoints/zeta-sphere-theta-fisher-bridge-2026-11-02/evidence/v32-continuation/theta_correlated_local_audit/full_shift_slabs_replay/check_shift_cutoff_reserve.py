"""Fixed rational basis reserve across cutoff H, and complete-theta a^2 cost.
No local PSD assumed; every signed target entry is retained.
"""
from pathlib import Path
import json,sys,math
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
from theta20_density import theta20,spatial_tail
N=int(sys.argv[1]) if len(sys.argv)>1 else 4000
M=int(sys.argv[2]) if len(sys.argv)>2 else 8000
bases=json.loads((p/'shift_rational_basis.json').read_text());coeff={}
for name,shift in [('even8',0),('odd9',1)]:
 P=[[arb(x) for x in row] for row in bases[name]['coefficients']]
 coeff[shift]=[[[sum(P[a][i]*P[b][j] for a in range(5) for b in range(5) if a+b+shift==k) for k in range(10)] for j in range(5)] for i in range(5)]
def transform(ds,shift):return [[sum(coeff[shift][i][j][k]*ds[k] for k in range(10)) for j in range(5)] for i in range(5)]
def reserve(B):return min((B[i][i].lower()-sum(abs(B[i][j]).upper() for j in range(5) if j!=i)).lower() for i in range(5))
data=json.loads((p/'tail_old_cross_fourth_4000.json').read_text())['moments']
mom=[ball(data[str(j)]) for j in range(9)]+[ball(json.loads((p/'tail_target_m9_8000.json').read_text())['M9_tail'])]
beta={i:reserve(transform(mom,i)) for i in [0,1]}
assert all(v>0 for v in beta.values())
w=arb(1)/(8*N)
for k in range(N):
 mid=arb(1)/8-(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper());ds,_,dd=theta20(uu);dm=theta20(mid)[0]
 path=[]
 for j in range(10):
  lo=w*ds[j].lower() if ds[j].lower()<0 else arb(0);hi=w*ds[j].upper() if ds[j].upper()>0 else arb(0)
  path.append(mom[j]+hull(lo,hi))
 for shift in [0,1]:
  rr=reserve(transform(path,shift));assert rr>0,('reserve',shift,k,str(rr));beta[shift]=min(beta[shift],rr)
 for j in range(10):mom[j]+=w*dm[j]+arb(0,(w**3*abs(dd[j]).upper()/24).upper())
absints={i:[[arb(0) for _ in range(5)] for _ in range(5)] for i in [0,1]}
w=arb(2)/M
for k in range(M):
 u=(arb(k)+arb(1)/2)*w+arb(0,(w/2).upper());ds=theta20(u)[0];weight=u*u*u.cosh()
 for shift in [0,1]:
  B=transform(ds,shift)
  for i in range(5):
   for j in range(i,5):absints[shift][i][j]+=w*(weight*abs(B[i][j])).upper()
Z=arb.pi()*arb(4).exp();tails=[256/arb.pi()*math.factorial(2*j)*9**j*Z**(j+6)*(-2*Z).exp() for j in range(10)]
assert 2-arb(15)/Z>1
out={'cutoff_cells':N,'cost_cells':M,'bits':ctx.prec,'scope':'Rational-basis a=0 cutoff reserve plus uniform a^2 perturbation for0<=a<=1/2. No signed local PSD premise.'}
for name,shift in [('even8',0),('odd9',1)]:
 for i in range(5):
  for j in range(i,5):
   absints[shift][i][j]+=sum(abs(arb(coeff[shift][i][j][k])).upper()*tails[k] for k in range(10))
   absints[shift][j][i]=absints[shift][i][j]
 K=(arb(2)/3)*max(sum(absints[shift][i][j] for j in range(5)).upper() for i in range(5))
 exponent=1
 while (arb(2)**(-2*exponent)*K).upper()>=beta[shift]/2:exponent+=1
 a=arb(2)**(-exponent)
 out[name]={'base_reserve_lower':str(beta[shift]),'a_squared_cost_upper':str(K.upper()),'shift_endpoint':str(a),'shift_endpoint_power_two':exponent,'shifted_reserve_lower':str((beta[shift]-a*a*K).lower()),'weighted_tail_entry_max':str(max(sum(abs(arb(coeff[shift][i][j][k])).upper()*tails[k] for k in range(10)) for i in range(5) for j in range(5)).upper())}
print(json.dumps(out,indent=2))
