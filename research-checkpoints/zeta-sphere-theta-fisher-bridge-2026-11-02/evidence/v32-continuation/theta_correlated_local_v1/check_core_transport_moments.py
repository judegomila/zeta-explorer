"""Owned finer core old/cross moments only; no degree7 target moment."""
from pathlib import Path
import json
p=Path(__file__).parent
s=(p/'check_degree7_regional_payment.py').read_text();exec(s[:s.index('sums=')])
N=int(sys.argv[1]) if len(sys.argv)>1 else 1000
width=arb(1)/(8*N);sums=[arb(0) for _ in range(7)]
for i in range(N):
 mid=arb(2*i+1)/(16*N);u=mid+arb(0,(width/2).upper());val=calc(mid,False);sec=calc(u,True)
 for j in range(7):sums[j]+=width*val[j]+arb(0,(abs(sec[j]).upper()*width**3/24).upper())
print(json.dumps({'N':N,'bits':ctx.prec,'interval':'[0,1/8] with full-line factor2','moments':{str(j):{'lo':str(x.lower()),'hi':str(x.upper())} for j,x in enumerate(sums)},'scope':'Finer old/cross moments for moving optimizer only. M7 is not integrated. M6 is read only for odd7 cross column; even6 calculation reads only throughM5.'},indent=2))
