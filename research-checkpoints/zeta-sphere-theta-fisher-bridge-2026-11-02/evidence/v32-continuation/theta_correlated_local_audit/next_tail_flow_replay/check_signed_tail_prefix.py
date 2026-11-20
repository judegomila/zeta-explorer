"""Actual known four-dimensional tail prefixes, inward cutoff flow.
No even8/odd9 target moment or gain is read. Signed local matrices allowed.
"""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
N=int(sys.argv[1]) if len(sys.argv)>1 else 1000
w=arb(1)/(8*N)
mom={}
for shift,degree in [(0,6),(1,7)]:
 data=json.loads((p/f'degree{degree}_eighth_partition_4000.json').read_text())['regions']['tail']['moments']
 mom[shift]=[ball(data[str(j+shift)]) for j in range(7)]

def general_ldl(a):
 n=len(a);ell=[[arb(int(i==j)) for j in range(n)] for i in range(n)];ds=[]
 for j in range(n):
  dj=a[j][j]-sum(ell[j][k]**2*ds[k] for k in range(j));assert dj.lower()>0,('old metric failure',j,str(dj));ds.append(dj)
  for i in range(j+1,n):ell[i][j]=(a[i][j]-sum(ell[i][k]*ell[j][k]*ds[k] for k in range(j)))/dj
 return ell,ds

def general_inv(fac,v):
 ell,ds=fac;n=len(v);y=[]
 for i in range(n):y.append(v[i]-sum(ell[i][j]*y[j] for j in range(i)))
 x=[arb(0)]*n
 for i in range(n-1,-1,-1):x[i]=y[i]/ds[i]-sum(ell[j][i]*x[j] for j in range(i+1,n))
 return x
sums={i:{k:arb(0) for k in ['negative_pivot_variation','negative_pivot_variation_lower','inverse_action','sqrt_action_over_pivot','absolute_log_pivot','relative_frobenius']} for i in [0,1]}
mins={i:None for i in [0,1]};initial={};local_signed={}
for i in [0,1]:initial[i]=general_ldl([[mom[i][j+k] for k in range(4)] for j in range(4)])[1][-1]
for k in range(N):
 mid=arb(1)/8-(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper());d0,d1,d2=calc_all(uu);dm=calc(mid,False)
 for shift in [0,1]:
  path=[]
  for j in range(7):
   q=d0[j+shift];lo=w*q.lower() if q.lower()<0 else arb(0);hi=w*q.upper() if q.upper()>0 else arb(0)
   path.append(mom[shift][j]+hull(lo,hi))
  f4=general_ldl([[path[i+j] for j in range(4)] for i in range(4)])
  ss=f4[1][-1];mins[shift]=ss.lower() if mins[shift] is None or ss.lower()<mins[shift] else mins[shift]
  _,z,dc=solve([arb(0)]+path);v=z+[arb(1)]
  q=quadratic(v,d0,shift)
  rr=[sum(d0[i+j+shift]*z[j] for j in range(3))+d0[i+3+shift] for i in range(3)]
  yr=forward(dc,rr);ee=sum(x*x/dd for x,dd in zip(yr,dc[:3]))
  sums[shift]['negative_pivot_variation']+=w*max(arb(0),(-q).upper())
  sums[shift]['negative_pivot_variation_lower']+=w*max(arb(0),(-q).lower())
  sums[shift]['inverse_action']+=w*ee.upper()
  sums[shift]['sqrt_action_over_pivot']+=w*(ee.upper()/ss.lower()).sqrt()
  sums[shift]['absolute_log_pivot']+=w*(abs(q).upper()/ss.lower())
  cols=[general_inv(f4,[d0[j+i+shift] for j in range(4)]) for i in range(4)]
  # trace((A^-1 L)^2), whose exact value is nonnegative; interval upper is safe.
  fr=sum(cols[i][j]*cols[j][i] for i in range(4) for j in range(4));assert fr.upper()>=0
  sums[shift]['relative_frobenius']+=w*fr.upper().sqrt()
  for j in range(7):mom[shift][j]+=w*dm[j+shift]+arb(0,(w**3*abs(d2[j+shift]).upper()/24).upper())
out={'N':N,'bits':ctx.prec,'orientation':'t=1/8-H, t in[0,1/8]; actual known tail prefix increases by signed local density, never assumed PSD.','scope':'Known even4/odd4 tail prefix only; no next target input. All-cell old positivity and rectangle bounds; midpoint moment propagation has rigorous second-derivative errors.'}
for name,shift in [('even8_old',0),('odd9_old',1)]:
 final=general_ldl([[mom[shift][i+j] for j in range(4)] for i in range(4)])[1][-1]
 out[name]={'initial_pivot':directed(initial[shift]),'final_pivot':directed(final),'whole_path_pivot_lower':str(mins[shift]),'reserve_fraction_lower':str((mins[shift]/initial[shift].upper()).lower()),'negative_pivot_variation_lower':str(sums[shift]['negative_pivot_variation_lower'].lower()),'budgets_upper':{key:str(val.upper()) for key,val in sums[shift].items() if key!='negative_pivot_variation_lower'}}
print(json.dumps(out,indent=2))
