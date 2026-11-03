"""Owned actual-metric versus monomial norm error bounds at four exact cutoffs."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_midpoint_recovery_flow.py').read_text();exec(s[:s.index('N=int(sys.argv')])
out={};determinants={}
for label,H in [('eighth',arb(1)/8),('half',arb(1)/2)]:
 for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
  data=json.loads((p/'core_transport_moments_1000.json').read_text()) if label=='eighth' else json.loads((p/(f'degree{degree}_'+('regional_payment' if shift else 'half_partition')+'_4000.json')).read_text())['regions']['core']
  m=[arb(0)]+[ball(data['moments'][str(j+shift)]) for j in range(6)]+[arb(0)];_,z,dc=solve(m);v=z+[arb(1)];d0,d1,d2=calc_all(H)
  solve([arb(0)]+d0[shift:shift+7]) # certified local-old positive, for trace norm bound
  r=[sum(d0[i+j+shift]*z[j] for j in range(3))+d0[i+3+shift] for i in range(3)];t=[sum(d1[i+j+shift]*z[j] for j in range(3))+d1[i+3+shift] for i in range(3)]
  yr=forward(dc,r);yt=forward(dc,t);er=sum(a*a/d for a,d in zip(yr,dc[:3]));et=sum(a*a/d for a,d in zip(yt,dc[:3]))
  tr=arb(0)
  for i in range(3):tr+=inv(dc,[d0[j+i+shift] for j in range(3)])[i]
  sigma=quadratic(v,d2,shift);invariant=abs(sigma).upper()+6*(er.upper()*et.upper()).sqrt()+6*tr.upper()*er.upper()
  det=dc[0]*dc[1]*dc[2];determinants[(name,label)]=det;trace=m[1]+m[3]+m[5];lam=(det.lower()/trace.upper()**2).lower();assert lam>0 and tr.lower()>0
  B=sum(m[j]**2 for j in [4,5,6]).sqrt().upper();Js=[sum(a[i+j+shift]**2 for i in range(4) for j in range(4)).sqrt().upper() for a in [d0,d1,d2]]
  generic=(1+B*B/(lam*lam))*(Js[2]+6*Js[0]*Js[1]/lam+6*Js[0]**3/(lam*lam))
  out[name+'_'+label]={'H':str(H),'relative_trace':directed(tr),'r_energy':directed(er),'t_energy':directed(et),'residual_second_source':directed(sigma),'invariant_error_upper':str(invariant.upper()),'generic_error_upper':str(generic.upper()),'generic_to_invariant_lower':str((generic.lower()/invariant.upper()).lower()),'actual_lambda_lower':str(lam),'scope':'Exact cutoff only, actual old/cross inverse and full-theta source. Trace bounds relative norm because local-old positivity explicitly checked. Generic bound uses conservative determinant/trace eigenvalue estimate, not actual spectral minimum.'}
for name in ['odd7','even6']:
 budget=(determinants[(name,'half')]/determinants[(name,'eighth')]).log()
 # A step of determinant-log mass <=log(3/2) gives relative increment<=1/2.
 out[name+'_budget']={'logdet_ratio':directed(budget),'budget_over_log_1p5_upper':str((budget/arb('1.5').log()).upper())}
print(json.dumps(out,indent=2))
