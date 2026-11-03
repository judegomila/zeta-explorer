"""Owned correlated whole-interval Schur flow; no prior target gain input."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_moving_flux_energy.py').read_text();exec(s[:s.index('out={};delta')])
N=int(sys.argv[1]) if len(sys.argv)>1 else 16000
start=json.loads((p/'core_transport_moments_1000.json').read_text());mom=[ball(start['moments'][str(j)]) for j in range(7)];w=arb(3)/(8*N)
sums={k:arb(0) for k in [0,1]};neg={k:arb(0) for k in [0,1]};pos={k:arb(0) for k in [0,1]};counts={k:{'positive':0,'negative':0,'unresolved':0} for k in [0,1]};mins={k:[None]*3 for k in [0,1]};localmins={k:[None]*3 for k in [0,1]}
def hull(lo,hi):return (lo+hi)/2+arb(0,((hi-lo)/2).upper())
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;u=mid+arb(0,(w/2).upper());local=calc(u,False)
 for shift in [0,1]:
  inc=[]
  for j in range(6):
   q=local[j+shift];lo=w*q.lower() if q.lower()<0 else arb(0);hi=w*q.upper() if q.upper()>0 else arb(0);inc.append(hull(lo,hi))
  m=[arb(0)]+[mom[j+shift]+inc[j] for j in range(6)]+[arb(0)]
  _,zc,dc=solve(m);sl,zl,dl=solve([arb(0)]+local[shift:shift+7]);q=sl+quad(dl,sub(zc,zl));sums[shift]+=w*q
  qlo=q.lower();qhi=q.upper();neg[shift]+=w*hull(qlo if qlo<0 else arb(0),qhi if qhi<0 else arb(0));pos[shift]+=w*hull(qlo if qlo>0 else arb(0),qhi if qhi>0 else arb(0))
  counts[shift]['positive' if qlo>0 else 'negative' if qhi<0 else 'unresolved']+=1
  for j in range(3):
   mins[shift][j]=dc[j].lower() if mins[shift][j] is None or dc[j].lower()<mins[shift][j] else mins[shift][j]
   localmins[shift][j]=dl[j].lower() if localmins[shift][j] is None or dl[j].lower()<localmins[shift][j] else localmins[shift][j]
 val=calc(mid,False);sec=calc(u,True)
 for j in range(7):mom[j]+=w*val[j]+arb(0,(w**3*abs(sec[j]).upper()/24).upper())
out={'N':N,'bits':ctx.prec,'scope':'Fresh correlated whole-interval derivative integration. No target integral or prior gain file read; only initial old/cross inputs. The local target density and all signed terms are computed from full theta.'}
for name,shift in [('even6',0),('odd7',1)]:out[name]={'gain':directed(sums[shift]),'negative_part':directed(neg[shift]),'positive_part':directed(pos[shift]),'cell_counts':counts[shift],'old_minima':[str(v) for v in mins[shift]],'local_old_minima':[str(v) for v in localmins[shift]]}
print(json.dumps(out,indent=2))
