"""Full cutoff-family bound using independently evaluated starting target Schurs.
Starting positivity is verified by its separate mass-minus-feedback calculation.
"""
from pathlib import Path
import json,sys
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
s=(p/'check_signed_tail_prefix.py').read_text();exec(s[s.index('def general_ldl'):s.index('sums=')])
from theta20_density import theta20,spatial_tail
N=int(sys.argv[1]) if len(sys.argv)>1 else 16000
startdoc=json.loads((p/'starting_tail_targets.json').read_text())
start_s={i:ball(startdoc[name]['starting_tail_schur']) for name,i in [('even8',0),('odd9',1)]}
path_s_min={i:start_s[i].lower() for i in [0,1]}
w=arb(1)/(8*N);data=json.loads((p/'tail_old_cross_fourth_4000.json').read_text())['moments']
mom={shift:[ball(data[str(j+shift)]) for j in range(8)] for shift in [0,1]}
sums={i:arb(0) for i in [0,1]};errs={i:arb(0) for i in [0,1]};negupper={i:arb(0) for i in [0,1]};neglower={i:arb(0) for i in [0,1]};mins={i:None for i in [0,1]};action={i:arb(0) for i in [0,1]}
def qform(v,ds,shift):return sum(v[i]*v[j]*ds[i+j+shift] for i in range(len(v)) for j in range(len(v)))
for k in range(N):
 mid=arb(1)/8-(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper());d0,dx,d2=theta20(uu);dm=theta20(mid)[0];dq=theta20(mid+w/4)[0]
 for shift in [0,1]:
  path=[];halfm=[]
  for j in range(8):
   den=d0[j+shift];lo=w*den.lower() if den.lower()<0 else arb(0);hi=w*den.upper() if den.upper()>0 else arb(0)
   path.append(mom[shift][j]+hull(lo,hi))
   halfm.append(mom[shift][j]+w/2*dq[j+shift]+arb(0,((w/2)**3*abs(d2[j+shift]).upper()/24).upper()))
  fac4=general_ldl([[path[i+j] for j in range(4)] for i in range(4)])
  mins[shift]=fac4[1][-1].lower() if mins[shift] is None or fac4[1][-1].lower()<mins[shift] else mins[shift]
  z=[-v for v in general_inv(fac4,path[4:8])];v=z+[arb(1)]
  r=[sum(d0[i+j+shift]*z[j] for j in range(4))+d0[i+4+shift] for i in range(4)]
  # Prime is inward time, hence minus physical first derivative.
  t=[-sum(dx[i+j+shift]*z[j] for j in range(4))-dx[i+4+shift] for i in range(4)]
  ar=general_inv(fac4,r);at=general_inv(fac4,t)
  third=qform(v,d2,shift)-6*sum(t[i]*ar[i] for i in range(4))+6*qform(ar,d0,shift)
  fm=general_ldl([[halfm[i+j] for j in range(4)] for i in range(4)])
  zm=[-v for v in general_inv(fm,halfm[4:8])];qm=qform(zm+[arb(1)],dm,shift)
  err=w**3*abs(third).upper()/24
  prior_sum=sums[shift]
  sums[shift]+=w*qm+arb(0,err.upper());errs[shift]+=err
  qq=qform(v,d0,shift)
  partial_lower=w*qq.lower() if qq.lower()<0 else arb(0)
  full_s_lower=(start_s[shift]+prior_sum+partial_lower).lower()
  path_s_min[shift]=min(path_s_min[shift],full_s_lower)
  negupper[shift]+=w*max(arb(0),(-qq).upper());neglower[shift]+=w*max(arb(0),(-qq).lower())
  en=sum(r[i]*ar[i] for i in range(4));action[shift]+=w*en.upper()
  for j in range(8):mom[shift][j]+=w*dm[j+shift]+arb(0,(w**3*abs(d2[j+shift]).upper()/24).upper())
out={'N':N,'bits':ctx.prec,'orientation':'inward t=1/8-H on[0,1/8]','scope':'Whole-cutoff-family bound. Independently computed starting target Schur is now an explicit input, and partial-cell signed source bounds retain all losses. No previous global target certificate is used.'}
for name,i in [('even8',0),('odd9',1)]:out[name]={'signed_gain':directed(sums[i]),'midpoint_error_upper':str(errs[i].upper()),'negative_source_integral_upper':str(negupper[i].upper()),'negative_source_integral_lower':str(neglower[i].lower()),'inverse_action_upper':str(action[i].upper()),'old_top_pivot_lower':str(mins[i]),'target_path_schur_lower':str(path_s_min[i]),'target_path_positive':bool(path_s_min[i]>0),'positive_gain':bool(sums[i].lower()>0),'negative_gain':bool(sums[i].upper()<0)}
print(json.dumps(out,indent=2))
