"""Owned diagnostic: interval endpoint source in actual regional optimizers."""
from pathlib import Path
import json
p=Path(__file__).parent
src=(p/'check_degree7_regional_payment.py').read_text();exec(src[:src.index('sums=')])
src2=(p/'check_three_region_payment.py').read_text();exec(src2[src2.index('def ball'):src2.index('out={}')])
for name,shift,degree in [('odd7',1,7),('even6',0,6)]:
 for kind,H in [('eighth',arb(1)/8),('half',arb(1)/2)]:
  fn=f'degree{degree}_'+('regional_payment' if degree==7 and kind=='half' else kind+'_partition')+'_4000.json'
  data=json.loads((p/fn).read_text());m=[arb(0)]+[ball(data['regions']['core']['moments'][str(j+shift)]) for j in range(7)]
  sc,zc,dc=solve(m);v=zc+[arb(1)];local=calc(H,False)
  q=sum(v[i]*v[j]*local[i+j+shift] for i in range(4) for j in range(4))
  lm=[arb(0)]+local[shift:shift+7]
  try:
   ls,lz,ld=solve(lm); qstable=ls+quad(ld,[a-b for a,b in zip(zc,lz)]); lss=str(ls)+' stable '+str(qstable.lower())+' , '+str(qstable.upper())
  except Exception:lss='old indefinite or interval unresolved'
  print(name,kind,'Sprime',str(q.lower())+' , '+str(q.upper()) ,'localSchur',lss)
