import json
from flint import arb, acb, ctx
D=json.load(open('w149.json')); ctx.prec=2600
w=[arb(x) for x in D['w']]
def H(b,g):
    z=acb(arb(b),arb(g)); ze=(z-1)/(z+1); zi=1/ze
    A=acb(0); B=acb(0)
    for cc in reversed(w):
        A=A*ze+cc; B=B*zi+cc
    return A*B/(1-z*z)
for (b,g,t) in (('0.3085','85.699348','85.2'),('0.5','937.5','937.0'),('0.5','937.9','937.5'),('0.5','101.9','101.5')):
    q4=4*H(b,g).real; p2=2*H('0',t).real
    print("d = quartet(%s+%si) + pair(i%s): <m,d> = %s + %s = %s ; negative: %s"%(b,g,t,q4.str(8),p2.str(8),(q4+p2).str(8),bool(q4+p2<0)))
