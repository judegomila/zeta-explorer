"""Owned endpoint diagnostic for integrated moving-flux compensation."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_signed_source_flux.py').read_text();exec(s[:s.index('u0=')])
out={}
for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
 phis=[]
 for label,H in [('eighth',arb(1)/8),('half',arb(1)/2)]:
  data=json.loads((p/'core_transport_moments_1000.json').read_text()) if label=='eighth' else json.loads((p/(f'degree{degree}_'+('regional_payment' if shift else 'half_partition')+'_4000.json')).read_text())['regions']['core']
  m=[arb(0)]+[ball(data['moments'][str(j+shift)]) for j in range(6)]+[arb(0)];_,zc,dc=solve(m);coeff=zc+[arb(1)];ds=[arb(0) for j in range(8)]
  for i in range(4):
   for j in range(4):ds[i+j+shift]+=coeff[i]*coeff[j]
  vs=jets(H);phi=2*sum(ds[j]*flux(j,H,vs) for j in range(8));phis.append(phi)
 prev=json.loads((p/'finite_width_transport.json').read_text())[name];gain=ball(prev['endpoint_gain_crosscheck']);delta=phis[1]-phis[0];comp=gain-delta
 out[name]={'phi_initial':directed(phis[0]),'phi_final':directed(phis[1]),'flux_difference':directed(delta),'schur_gain':directed(gain),'integrated_bulk_plus_mixed':directed(comp)}
print(json.dumps(out,indent=2))
