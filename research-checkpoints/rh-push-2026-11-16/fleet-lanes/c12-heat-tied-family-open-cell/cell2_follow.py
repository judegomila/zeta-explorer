# follow-up on the q = 5 screen: sorted zero list, dedupe, check of the negative-winding cell, value of R at the first zero (two precisions)
import json
from flint import acb, arb, ctx, dirichlet_char
from cell2 import W0, winding
d=json.load(open('cell2_q5_p1_L_T500.json'))
zs=sorted([(float(r['t']),float(r['sigma']),r) for r in d['records'] if r['screen_wn']>0])
print('zeros',len(zs),'distinct',len(set((round(a,8),round(b,8)) for a,b,_ in zs)))
print('first five:',[(r['sigma'][:22],r['t'][:22]) for _,_,r in zs[:5]])
print('sigma range',min(b for _,b,_ in zs),max(b for _,b,_ in zs),' count sigma>0.6:',sum(1 for _,b,_ in zs if b>0.6))
f=W0(5,[2,3])
for prec in (128,400):
    ctx.prec=prec
    r=zs[0][2]; s=acb(arb(r['sigma']),arb(r['t']))
    c2,c3=dirichlet_char(5,2),dirichlet_char(5,3)
    R=(c2.l(s)/c3.l(s))*(c3.l(2-s)/c2.l(2-s))
    print('prec',prec,'R+1 at first zero:',(R+1).str(10),' |w0|:',abs(f(s)).str(5))
neg=[r for r in d['records'] if r['screen_wn']<0]
for r in neg:
    a,b=r['cell']; print('negative cell',r['cell'],'neighbours:',[(z[1],z[0]) for z in zs if abs(z[0]-b)<0.2])
    c=acb(a+0.00625,b+0.0125)
    for (cc,rr,m) in ((c,arb('0.00625'),400),(c,arb('0.02'),800)):
        ok,w=winding(f,cc,rr,m=m,prec=128); print('  ball winding on square centre',complex(cc),'half-side',float(rr),':',ok,w.str(6))
