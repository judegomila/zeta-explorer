# first negative height of S_v for the full odd family mod q (and controls); reuses cell2b.Fam
import sys, json, time
from flint import arb, ctx, dirichlet_char
from cell2b import Fam, sg
ctx.prec=128
q=int(sys.argv[1]); mode=sys.argv[2]; T=float(sys.argv[3]); dt=float(sys.argv[4])
fam=[n for n in range(2,q) if dirichlet_char(q,n).parity()==1]
F=Fam(q,fam,mode); t0=time.time(); first=None; neg=0; n=int(round(T/dt)); mn=(9,None); und=0
import fractions
for k in range(1,n+1):
    t=arb(k)*arb(str(dt)); tm=F.terms(t); sc=sum(abs(x) for x in tm); S=sum(x.real for x in tm)/sc
    s=sg(S)
    if s==0: und+=1
    if s<0:
        neg+=1
        if first is None: first=(k*dt,S.str(10))
    f=float(S.mid())
    if f<mn[0]: mn=(f,k*dt)
out=dict(q=q,mode=mode,nchars=len(fam),T=T,dt=dt,first_negative=first,neg_fraction=neg/n,min=mn,undetermined=und,seconds=time.time()-t0)
print(out,flush=True); json.dump(out,open(f'cell2c_q{q}_{mode}.json','w'))
