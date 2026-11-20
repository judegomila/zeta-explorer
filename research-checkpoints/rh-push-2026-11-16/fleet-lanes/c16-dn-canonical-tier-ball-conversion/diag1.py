import time, sys
import numpy as np
from flint import arb, acb, ctx
import nobj, nball, jball
P = nobj.build({}, skip=(1,5,6,7,8,9))
from collections import Counter
print(Counter(p.group for p in P))
cases=[('b1-Aw',2.141983762208491,0.08171129709919221),('b2-with',2.3,0.1),('b1-Aw',-2.258515862674757,0.2394795201426731)]
names={}
for p in P:
    names.setdefault(p.group,[]).append(p)
sel=[names['P'][0],names['PX'][0],names['C2'][0],names['C3'][0],names['C4'][0],names['C4'][5]]
for fam,u,h in cases:
    for p in sel:
        for pr in (128,256,512,1024):
            ctx.prec=pr
            nball._CACHE.clear()
            t=time.time()
            try:
                v,_=nball.bvalue(fam,u,h,p)
                print(fam,u,p.name,pr,v.str(8),'%.2fs'%(time.time()-t),flush=True)
            except Exception as e:
                print(fam,u,p.name,pr,'ERR',repr(e)[:80],'%.2fs'%(time.time()-t),flush=True)
