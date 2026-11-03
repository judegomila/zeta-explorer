"""Owned full-theta interval check of moving-optimizer flux energy, both parities."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_signed_source_flux.py').read_text();exec(s[:s.index('u0=')])
def forward(d,v):
 d1,d2,d3,l21,l31,l32=d;y1=v[0];y2=v[1]-l21*y1;y3=v[2]-l31*y1-l32*y2
 return [y1,y2,y3]
out={};delta=arb(1)/10**8
for location,H in [('eighth',arb(1)/8),('half',arb(1)/2)]:
 for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
  if location=='eighth':data=json.loads((p/'core_transport_moments_1000.json').read_text())
  else:data=json.loads((p/(f'degree{degree}_'+('regional_payment' if shift else 'half_partition')+'_4000.json')).read_text())['regions']['core']
  m0=[arb(0)]+[ball(data['moments'][str(j+shift)]) for j in range(6)]+[arb(0)]
  u=H+delta/2+arb(0,(delta/2).upper());local=calc(u,False)
  m=[arb(0)]+[m0[j+1]+arb(0,(delta*abs(local[j+shift]).upper()).upper()) for j in range(6)]+[arb(0)]
  _,zc,dc=solve(m);sl,zl,dl=solve([arb(0)]+local[shift:shift+7])
  sprime=sl+quad(dl,sub(zc,zl));vs=jets(u);coeff=zc+[arb(1)];ds=[arb(0) for _ in range(8)]
  for i in range(4):
   for j in range(4):ds[i+j+shift]+=coeff[i]*coeff[j]
  beta=2*sum(ds[j]*(u*u*vs[j]**2-(arb(j)/2*vs[j-1]**2 if j else 0)) for j in range(8))
  grad=[4*sum(coeff[j]*flux(i+j+shift,u,vs) for j in range(4)) for i in range(3)]
  rr=[sum(local[i+j+shift]*zc[j] for j in range(3))+local[i+3+shift] for i in range(3)]
  yr=forward(dc,rr);yg=forward(dc,grad)
  mixed=sum(a*b/d for a,b,d in zip(yr,yg,dc[:3]));er=sum(a*a/d for a,d in zip(yr,dc[:3]));eg=sum(a*a/d for a,d in zip(yg,dc[:3]));comp=beta+mixed
  if location=='eighth':assert comp.lower()>0 and mixed.lower()>0
  else:
   assert (comp.lower()>0 and mixed.upper()<0) if shift else (comp.upper()<0 and mixed.lower()>0)
  if not shift:assert beta.upper()<0
  damped=(99*sprime+comp)/100
  assert damped.lower()>0
  out[name+'_'+location]={'interval':[str(H),str(H+delta)],'old_core_pivots':[directed(x) for x in dc[:3]],'bounds':{k:directed(v) for k,v in [('bulk_beta',beta),('mixed_actual_inverse',mixed),('compensated_derivative',comp),('original_schur_derivative',sprime),('one_percent_flux_derivative',damped),('optimizer_action',er),('flux_gradient_action',eg)]},'absolute_Cauchy_lower':str((beta.lower()-(er.upper()*eg.upper()).sqrt()).lower()),'read_moment_indices':list(range(shift,shift+6)),'scope':'Full interval, actual moving core inverse, old/cross moments only. No target integral or all-degree assumption.'}
print(json.dumps(out,indent=2))
