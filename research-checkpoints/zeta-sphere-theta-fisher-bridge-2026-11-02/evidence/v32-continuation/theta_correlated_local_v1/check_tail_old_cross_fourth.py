from theta20_density import *
import json
N=int(sys.argv[1]) if len(sys.argv)>1 else 4000
w=arb(15)/(8*N);value=[arb(0) for _ in range(9)]
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper())
 d,_,dd=theta20(mid);d4=theta_cross_fourth(uu)
 for j in range(9):value[j]+=w*d[j]+w**3*dd[j]/24+arb(0,(w**5*abs(d4[j]).upper()/1920).upper())
tails=[spatial_tail(j) for j in range(9)]
for j in range(9):value[j]+=arb(0,tails[j].upper())
print(json.dumps({'N':N,'bits':ctx.prec,'quadrature':'corrected midpoint with fourth derivative error','moments':{str(j):{'lo':str(value[j].lower()),'hi':str(value[j].upper())} for j in range(9)},'spatial_tail_max':str(max(t.upper() for t in tails)),'scope':'Fresh old/cross only, same input restrictions as the midpoint preparation.'},indent=2))
