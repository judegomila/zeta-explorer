from theta20_density import *
import json
N=int(sys.argv[1]) if len(sys.argv)>1 else 8000
w=arb(15)/(8*N);value=[arb(0) for _ in range(9)]
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper())
 d=theta20(mid)[0];dd=theta20(uu)[2]
 for j in range(9):value[j]+=w*d[j]+arb(0,(w**3*abs(dd[j]).upper()/24).upper())
tails=[spatial_tail(j) for j in range(9)]
for j in range(9):value[j]+=arb(0,tails[j].upper())
print(json.dumps({'N':N,'bits':ctx.prec,'moments':{str(j):{'lo':str(value[j].lower()),'hi':str(value[j].upper())} for j in range(9)},'spatial_tail_max':str(max(t.upper() for t in tails)),'scope':'Fresh tail old/cross data throughM8 for odd9. Even8 reads onlyM0..7; no even8 target M8 input, no odd9 target M9 input.'},indent=2))
