# Independent interval replay from serialized matrices; analytic error budget audited separately.
import json, mpmath as m
from pathlib import Path
m.iv.dps=45
p=Path('/workspace/shared/zeta_sphere_campaign/hierarchy/suzuki_v8/block_certificate_data.json')
d=json.loads(p.read_text(),parse_float=str); n=d['n'];I=m.iv
eta=I.mpf('1.00001e-10'); den=I.mpf('.3439')
for s in (-1,1):
 L=[[I.mpf(0) for j in range(n)]for i in range(n)]; piv=[]
 for i in range(n):
  for j in range(i+1):
   a=I.mpf(d['A'][i][j])+I.mpf([-1,1])*eta
   g=I.mpf(d['G'][i][j])+I.mpf([-1,1])*eta
   z=(I.mpf('.9997') if i==j else 0)+s*a-g/den
   z-=sum((L[i][r]*L[j][r]for r in range(j)),I.mpf(0))
   if i==j:
    assert m.mpf(z.a)>0
    piv.append(m.mpf(z.a));L[i][j]=I.sqrt(z)
   else:L[i][j]=z/L[j][j]
 print('sign',s,'minimum pivot lower',min(piv),'PASS',flush=True)
