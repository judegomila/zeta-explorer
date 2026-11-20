import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import objs, math
from flint import acb, arb, ctx
import numpy as np
ctx.prec=100; o=objs.get('DH')
neg=[]
for t in np.arange(0.0, 95.01, 0.25):
    for x in (0.02,0.05,0.1,0.2,0.3,0.45,0.6,0.8,1.0,1.3,1.6,2.0,2.5,3.0,4.0,6.0):
        f,l=objs.XL(o, acb(x,float(t)))
        if float(l.real.mid())<0: neg.append((x,float(t),round(float(l.real.mid()),4)))
print(len(neg)); print(neg[:60])
a=arb('0.1'); mx=0
for t in np.arange(0.0, 60.01, 0.25):
    for x in (0.01,0.05,0.1,0.2,0.5,1,2,3):
        S=abs(objs.X(o,acb(x,float(t))-a)/objs.X(o,acb(x,float(t))+a)); mx=max(mx,float(S.mid()))
print('max |S_a| on grid below 60:', mx)
