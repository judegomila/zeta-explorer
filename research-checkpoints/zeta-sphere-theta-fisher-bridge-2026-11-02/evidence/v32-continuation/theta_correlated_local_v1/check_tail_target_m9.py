from theta20_density import *
import json
N=int(sys.argv[1]) if len(sys.argv)>1 else 8000
w=arb(15)/(8*N);value=arb(0)
for k in range(N):
 mid=arb(1)/8+(arb(k)+arb(1)/2)*w;uu=mid+arb(0,(w/2).upper())
 d=theta20(mid)[0][9];dd=theta20(uu)[2][9]
 value+=w*d+arb(0,(w**3*abs(dd).upper()/24).upper())
tail=spatial_tail(9);value+=arb(0,tail.upper())
print(json.dumps({'N':N,'bits':ctx.prec,'M9_tail':{'lo':str(value.lower()),'hi':str(value.upper())},'spatial_tail':str(tail.upper()),'scope':'Fresh explicit target mass M9 atH1/8. Not an assumed pivot or a flow input.'},indent=2))
