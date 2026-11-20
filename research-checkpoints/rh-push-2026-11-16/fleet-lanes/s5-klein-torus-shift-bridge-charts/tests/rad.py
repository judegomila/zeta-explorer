import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import objs, math
from flint import acb, arb, ctx
for code in ('DH','ZETA','LCHI4','TNR'):
    for bits in (1000, 4064):
        ctx.prec=bits; o=objs.get(code); a=arb('0.1')
        for w in (acb('0.37','11.3'), acb('1.9','-20.1')):
            S=objs.X(o,w-a)/objs.X(o,w+a)
            print(code, bits, 'rel radius 2^', float((S.rad()/abs(S)).log().mid())/math.log(2) if float(S.rad().mid())>0 else None)
