"""Owned interval old-metric path probe; no target integration."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_moving_flux_energy.py').read_text();exec(s[:s.index('out={};delta')])
N=int(sys.argv[1]) if len(sys.argv)>1 else 1000
start=json.loads((p/'core_transport_moments_1000.json').read_text());mom=[ball(start['moments'][str(j)]) for j in range(7)];w=arb(3)/(8*N);mins={0:[None]*3,1:[None]*3}
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;inter=mid+arb(0,(w/2).upper());local=calc(inter,False)
 for shift in [0,1]:
  m=[arb(0)]+[mom[j+shift]+arb(0,(w*abs(local[j+shift]).upper()).upper()) for j in range(6)]+[arb(0)]
  try:_,_,dc=solve(m)
  except:print('FAIL',k,shift);raise
  for j in range(3):mins[shift][j]=dc[j].lower() if mins[shift][j] is None or dc[j].lower()<mins[shift][j] else mins[shift][j]
 val=calc(mid,False);sec=calc(inter,True)
 for j in range(7):mom[j]+=w*val[j]+arb(0,(w**3*abs(sec[j]).upper()/24).upper())
print('PASS',mins)
