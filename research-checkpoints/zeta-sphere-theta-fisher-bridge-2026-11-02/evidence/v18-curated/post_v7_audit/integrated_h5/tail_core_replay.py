"""All-H low-core tail matrix certificate for h in[0,1/8]."""
import json,time
from pathlib import Path
import mpmath as mp
from mpmath import iv
import certify as c
ROOT=Path(__file__).resolve().parent
data=json.loads((ROOT/'certificate.json').read_text());base=[iv.mpf(v) for v in data['rows'][0]['mu_intervals']]
# The first shift bin contains a=0, so these enclosures also bound exactly that limit.
N=1024;step=iv.mpf(1)/(8*N);prefix=[iv.mpf(0) for _ in c.R];worst=[mp.inf]*3;t=time.time();fails=[]
for j in range(N):
 lo=iv.mpf(j)/(8*N);hi=iv.mpf(j+1)/(8*N);h=iv.mpf([lo.a,hi.b]);ps=c.psi(h,10)
 v=[2*h*h*(-1)**(r//2)*c.pjet(r,0,ps) for r in c.R]
 # Any partial-cell integral belongs to [0,step]*v componentwise, including signed entries.
 tail=[base[k]-prefix[k]-iv.mpf([0,step.b])*v[k] for k in range(len(c.R))]
 q=tail;raw=[[q[0],q[3],q[1]],[q[3],q[1],q[4]],[q[1],q[4],q[2]]];sc=[1,200,80000]
 G=[[raw[r][s]/(sc[r]*sc[s]) for s in range(3)] for r in range(3)];D,ok=c.ldl(G)
 if not ok:fails.append(j)
 else:
  for k,d in enumerate(D):worst[k]=min(worst[k],mp.mpf(d.a))
 prefix=[prefix[k]+step*v[k] for k in range(len(c.R))]
print('PASS',not fails,'worst LDL',worst,'seconds',time.time()-t,flush=True)
(ROOT/'tail_core_certificate.json').write_text(json.dumps({'pass':not fails,'fail_cells':fails,'cells':N,'range':'[0,1/8]','worst_pivot_lower':[str(x) for x in worst],'seconds':time.time()-t},indent=2))
