# locate off-line zeros (x>0) of Z(w, w/2+x+i tau) by Newton (double), for the pair departing near tau=111.3 (w<1) and near 357.5 / 134.2 (w>1)
import numpy as np, json
from tlib import *
delta,u,W=nodes(0.03); L=logtheta(u,delta)
def G(w,x,t): return evalZ([w],np.array([x]),np.array([t]),u,W,L,delta)[0,0]
def newton(w,x,t):
    for _ in range(60):
        g=G(w,x,t); h=1e-6
        dg=(G(w,x+h,t)-G(w,x-h,t))/(2*h)   # analytic in s: d/dx = d/ds
        st=-g/dg; x+=st.real; t+=st.imag
        if abs(st)<1e-11: break
    return x,t,abs(G(w,x,t))
out=[]
for name,t0,wlist in (('gap33',111.34,[0.93,0.92,0.91,0.90,0.88,0.86,0.84,0.82,0.80]),('gap18',76.3,[0.86,0.85,0.84,0.82,0.80]),('gap173',357.49,[1.03,1.04,1.06,1.08,1.10,1.15,1.2,1.3]),('gap44',134.16,[1.14,1.16,1.2,1.25,1.3])):
    x,t=0.05,t0
    for w in wlist:
        x,t,r=newton(w,max(x,0.03),t)
        print(f'{name} w={w:.2f}: zero at s = w/2 + {x:.8f} + {t:.8f} i   |Z e^(delta tau)|={r:.1e}')
        out.append(dict(name=name,w=w,x=x,tau=t))
json.dump(out,open('offline.json','w'))
job=[dict(w=repr(o['w']),x=repr(round(o['x'],10)),tau=repr(round(o['tau'],10)),kind='offzero') for o in out if o['x']>1e-3]
job+= [dict(w=repr(o['w']),x=repr(round(o['x']+0.01,10)),tau=repr(round(o['tau'],10)),kind='offzero_nearby') for o in out if o['x']>1e-3]
json.dump(job,open('joboff.json','w'))
