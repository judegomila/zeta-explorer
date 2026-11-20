"""Owned whole-interval moving bulk quadrature with exact signed increment hulls."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_moving_flux_energy.py').read_text();exec(s[:s.index('out={};delta')])
N=int(sys.argv[1]) if len(sys.argv)>1 else 16000
start=json.loads((p/'core_transport_moments_1000.json').read_text());mom=[ball(start['moments'][str(j)]) for j in range(7)];w=arb(3)/(8*N)
sums={k:{t:arb(0) for t in ['bulk','mixed','compensated']} for k in [0,1]};mins={0:[None]*3,1:[None]*3};initial={}
def phi(H,shift,ms):
 _,z,_=solve([arb(0)]+ms[shift:shift+6]+[arb(0)]);c=z+[arb(1)];v=jets(H)
 return 2*sum(c[i]*c[j]*flux(i+j+shift,H,v) for i in range(4) for j in range(4))
for shift in [0,1]:initial[shift]=phi(arb(1)/8,shift,mom)
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;u=mid+arb(0,(w/2).upper());local=calc(u,False);vs=jets(u)
 for shift in [0,1]:
  increments=[]
  for j in range(6):
   q=local[j+shift];lo=w*q.lower() if q.lower()<0 else arb(0);hi=w*q.upper() if q.upper()>0 else arb(0)
   increments.append((lo+hi)/2+arb(0,((hi-lo)/2).upper()))
  m=[arb(0)]+[mom[j+shift]+increments[j] for j in range(6)]+[arb(0)]
  _,zc,dc=solve(m);coeff=zc+[arb(1)];ds=[arb(0) for _ in range(8)]
  for i in range(4):
   for j in range(4):ds[i+j+shift]+=coeff[i]*coeff[j]
  beta=2*sum(ds[j]*(u*u*vs[j]**2-(arb(j)/2*vs[j-1]**2 if j else 0)) for j in range(8))
  sums[shift]['bulk']+=w*beta
  for j in range(3):mins[shift][j]=dc[j].lower() if mins[shift][j] is None or dc[j].lower()<mins[shift][j] else mins[shift][j]
 val=calc(mid,False);sec=calc(u,True)
 for j in range(7):mom[j]+=w*val[j]+arb(0,(w**3*abs(sec[j]).upper()/24).upper())
out={'N':N,'bits':ctx.prec,'scope':'Whole-interval independent moving bulk quadrature. Mixed integral inferred from exact identity, independently bounded endpoint flux and existing certified Schur gain; not independent proof of that gain. Old/cross propagation only, signed interval increment hulls.'}
for name,shift in [('even6',0),('odd7',1)]:
 final=phi(arb(1)/2,shift,mom);fluxdelta=final-initial[shift]
 prior=json.loads((p/'finite_width_transport.json').read_text())[name]
 gain=ball(prior['endpoint_gain_crosscheck']);sums[shift]['compensated']=gain-fluxdelta;sums[shift]['mixed']=sums[shift]['compensated']-sums[shift]['bulk']
 assert (sums[shift]['bulk'].upper()<0 and sums[shift]['mixed'].lower()>0) if shift else (sums[shift]['bulk'].lower()>0 and sums[shift]['mixed'].upper()<0)
 out[name]={'methods':{'bulk':'independent full-interval rectangle quadrature','mixed':'inferred from prior gain minus endpoint flux minus bulk','compensated':'prior gain minus endpoint flux'},'integrals':{k:directed(v) for k,v in sums[shift].items()},'phi_initial':directed(initial[shift]),'phi_final':directed(final),'moving_endpoint_flux':directed(fluxdelta),'previous_gain_reused':directed(gain),'old_path_pivot_minima':[str(v) for v in mins[shift]]}
print(json.dumps(out,indent=2))
