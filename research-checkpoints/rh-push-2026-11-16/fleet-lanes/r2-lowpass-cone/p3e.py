import json, math
from flint import arb, acb, ctx
D=json.load(open('w149.json')); ctx.prec=2600
w=[arb(x) for x in D['w']]
def H(b,g):
    z=acb(arb(b),arb(g)); ze=(z-1)/(z+1); zi=1/ze
    A=acb(0); B=acb(0)
    for cc in reversed(w):
        A=A*ze+cc; B=B*zi+cc
    return A*B/(1-z*z)
for b in ('0.474','0.45','0.3'):
    lo,hi=arb('937.5'),arb('945')
    for _ in range(40):
        mid=(lo+hi)/2
        if H(b,mid).real<0: lo=mid
        else: hi=mid
    print("beta",b,"sup gamma with Re H<0:",lo.str(9))
for (b,g,t) in (('0.45','937.8','937.3'),('0.45','937.85','937.4'),('0.45','937.6','937.1'),('0.45','101.9','101.5')):
    q4=4*H(b,g).real; p2=2*H('0',t).real
    bb=float(b); gg=float(g); tt=float(t)
    ratio=2*math.exp(-(gg*gg-tt*tt-bb*bb)*math.pi/(4*bb*gg))
    print("d = quartet(%s+%si) + pair(i%s): <m,d> = %s ; negative: %s ; heat-trace ratio bound %.3f (<1 needed)"%(b,g,t,(q4+p2).str(8),bool(q4+p2<0),ratio))
