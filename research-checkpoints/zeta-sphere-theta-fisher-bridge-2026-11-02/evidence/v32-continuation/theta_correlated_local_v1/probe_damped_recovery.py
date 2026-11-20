"""Owned exploratory certified-point scan; not a whole-interval certificate."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_moving_flux_energy.py').read_text();exec(s[:s.index('out={};delta')])
data=json.loads((p/'core_transport_moments_1000.json').read_text());mom=[ball(data['moments'][str(j)]) for j in range(7)]
N=1000;w=arb(3)/(8*N);out=[]
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;inter=mid+arb(0,(w/2).upper());vals=calc(mid,False);sec=calc(inter,True)
 for j in range(7):mom[j]+=w*vals[j]+arb(0,(w**3*abs(sec[j]).upper()/24).upper())
 if (k+1)%25:continue
 H=arb(1)/8+(k+1)*w;local=calc(H,False);vs=jets(H)
 for name,shift in [('odd7',1),('even6',0)]:
  try:
   _,zc,dc=solve([arb(0)]+mom[shift:shift+6]+[arb(0)]);sl,zl,dl=solve([arb(0)]+local[shift:shift+7]);sp=sl+quad(dl,sub(zc,zl));coeff=zc+[arb(1)];ds=[arb(0) for _ in range(8)]
   for i in range(4):
    for j in range(4):ds[i+j+shift]+=coeff[i]*coeff[j]
   beta=2*sum(ds[j]*(H*H*vs[j]**2-(arb(j)/2*vs[j-1]**2 if j else 0)) for j in range(8))
   grad=[4*sum(coeff[j]*flux(i+j+shift,H,vs) for j in range(4)) for i in range(3)]
   rr=[sum(local[i+j+shift]*zc[j] for j in range(3))+local[i+3+shift] for i in range(3)];yr=forward(dc,rr);yg=forward(dc,grad);mixed=sum(a*b/d for a,b,d in zip(yr,yg,dc[:3]));ud=(99*sp+beta+mixed)/100
   out.append({'case':name,'H':str(H),'Uprime':directed(ud),'Sprime':directed(sp),'Unitprime':directed(beta+mixed),'status':'negative' if ud.upper()<0 else 'positive' if ud.lower()>0 else 'inconclusive'})
  except Exception as e:out.append({'case':name,'H':str(H),'status':'old/local interval unresolved','error':str(e)})
print(json.dumps(out,indent=2))
