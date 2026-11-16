# Recompute the pick-induction order-149 DH certificate vector (same construction as cert.py) and save it.
import sys, json, time
sys.path.insert(0,'../pick-induction')
from toep import series_L
from flint import arb, ctx
a,k,prec='1',148,12000
t=time.time()
out={}
for which in ('dh','zeta'):
    g=series_L(which,a,k,prec); ctx.prec=prec
    c=[g[0]]+[x/2 for x in g[1:]]
    if which=='dh':
        cm=[x.mid() for x in c]
        aco=[arb(1)];E=cm[0]
        for kk in range(1,k+1):
            acc=sum((aco[j]*cm[kk-j]).mid() for j in range(kk)).mid(); al=(-acc/E).mid()
            aco=[arb(1)]+[(aco[j]+al*aco[kk-j]).mid() for j in range(1,kk)]+[al]; E=(E*(1-al*al)).mid()
        w=[x.mid() for x in aco]
    q=arb(0)
    for i in range(k+1):
        row=arb(0)
        for j in range(k+1): row+=w[j]*c[abs(i-j)]
        q+=w[i]*row
    print(which,"q=w^T T_149 w =",q.str(15),"certified sign:", "neg" if q<0 else ("pos" if q>0 else "?"), "time %.0fs"%(time.time()-t),flush=True)
    out[which+'_q']=q.str(20)
    out[which+'_c']=[x.str(60,radius=False) for x in c]
out['w']=[x.str(3700,radius=False) for x in w]
json.dump(out,open('w149.json','w'))
