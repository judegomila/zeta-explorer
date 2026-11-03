"""Owned exploratory actual moving-optimizer flux calculation."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_signed_source_flux.py').read_text();exec(s[:s.index('u0=')])
s=(p/'check_nearby_shell_derivative.py').read_text();s=s[s.index('\nout={};delta'):] ;s=s[:s.index('print(json.dumps')]
s=s.replace("data=json.loads((p/f'degree{degree}_eighth_partition_4000.json').read_text())","data={'regions':{'core':json.loads((p/'core_transport_moments_1000.json').read_text())}}")
s=s.replace("out[name]={'interval'", """vs=jets(u);coeff=zc+[arb(1)];ds=[arb(0) for _ in range(8)]
 for i in range(4):
  for j in range(4):ds[i+j+shift]+=coeff[i]*coeff[j]
 beta=2*sum(ds[j]*(u*u*vs[j]**2-(arb(j)/2*vs[j-1]**2 if j else 0)) for j in range(8))
 grad=[4*sum(coeff[j]*flux(i+j+shift,u,vs) for j in range(4)) for i in range(3)]
 rr=[sum(local[i+j+shift]*zc[j] for j in range(3))+local[i+3+shift] for i in range(3)]
 def inv(d,v):
  d1,d2,d3,l21,l31,l32=d;y1=v[0];y2=v[1]-l21*y1;y3=v[2]-l31*y1-l32*y2
  x3=y3/d3;x2=y2/d2-l32*x3;x1=y1/d1-l21*x2-l31*x3
  return [x1,x2,x3]
 d1,d2,d3,l21,l31,l32=dc
 def fw(v):
  y1=v[0];y2=v[1]-l21*y1;y3=v[2]-l31*y1-l32*y2;return [y1,y2,y3]
 yr=fw(rr);yg=fw(grad);mixed=sum(a*b/d for a,b,d in zip(yr,yg,dc[:3]));er=sum(a*a/d for a,d in zip(yr,dc[:3]));ef=sum(a*a/d for a,d in zip(yg,dc[:3]));comp=beta+mixed
 print(name,'beta',beta,'mixed',mixed,'comp',str(comp.lower())+' , '+str(comp.upper()),'er',er,'ef',ef,file=sys.stderr)
 out[name]={'interval'""")
exec(s)
