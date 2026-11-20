import sys; sys.path.insert(0,'.')
import numpy as np, warnings; warnings.filterwarnings("ignore")
from gates import *
rng=np.random.default_rng(7)
which=sys.argv[1]; ntr=int(sys.argv[2]); depth=int(sys.argv[3])
X,dx,tmax = (14,1e-3,1.5) if which=="zeta" else (70,2.5e-3,3.0)
from collections import Counter
cnt=[Counter() for _ in range(depth+1)]; ex=[{} for _ in range(depth+1)]
for tr in range(ntr):
    A=list(np.exp(rng.uniform(np.log(0.05),np.log(4),depth)))
    if tr%4==0: A=list(np.exp(rng.uniform(np.log(0.05),np.log(1.0),depth)))
    if tr%4==1: A=list(np.exp(rng.uniform(np.log(1),np.log(4),depth)))
    res=check(which,A,X,dx,tmax)
    for lev,f in enumerate(res):
        for k,t in f.items():
            cnt[lev][k]+=1; ex[lev].setdefault(k,([round(a,3) for a in A[:lev]],round(t,3)))
for lev in range(depth+1): print(which,"level",lev,"fail counts /%d:"%ntr,dict(cnt[lev]),"example",ex[lev])
