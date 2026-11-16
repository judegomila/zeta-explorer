# tail scan of the sign of Re H for the order-149 DH vector, python-flint, 2200 bits
import json, time
from flint import arb, acb, ctx
ctx.prec=2200
D=json.load(open('w149.json')); w=[arb(x) for x in D['w']]
def H(b,g):
    z=acb(arb(b),arb(g)); ze=(z-1)/(z+1); zi=1/ze
    A=acb(0); B=acb(0)
    for c in reversed(w):
        A=A*ze+c; B=B*zi+c
    return A*B/(1-z*z)
t=time.time()
for b in ('0.5','0.3','0.1','0.02'):
    neg=[]; g=400.0
    while g<60000:
        h=H(b,str(g))
        if h.real<0: neg.append(g)
        g+= 0.1 if g<3000 else (0.25 if g<10000 else 1.0)
    iv=[]
    for x in neg:
        if iv and x-iv[-1][1]<1.01: iv[-1][1]=x
        else: iv.append([x,x])
    print("beta=%s gamma in [400,6e4]: negative intervals: %s  (%.0fs)"%(b," ".join("[%.1f,%.1f]"%tuple(i) for i in iv),time.time()-t),flush=True)
for g in ('1e5','1e6','1e9','3e12'):
    h=H('0.5',g); print("gamma",g,"cos(arg H) =",(h.real/abs(h)).str(8))
