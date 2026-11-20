# Same gate scan for real primitive Dirichlet L-functions (Euler product; GRH expected) -- are the theta gates Euler properties?
import sys; sys.path.insert(0,'.')
import numpy as np, warnings; warnings.filterwarnings("ignore")
import gates
from collections import Counter
CH={"chi_-3":(3,[0,1,-1],1),"chi_-4":(4,[0,1,0,-1],1),"chi_5":(5,[0,1,-1,-1,1],0),"chi_8":(8,[0,1,0,-1,0,-1,0,1],0),
    "chi_-7":(7,[0,1,1,-1,1,-1,-1],1),"chi_-8":(8,[0,1,0,1,0,-1,0,-1],1),"chi_-11":(11,[0,1,-1,1,1,1,-1,-1,-1,1,-1],1)}
def mk(name):
    q,chi,odd=CH[name]
    def kernel(which,x):
        terms=[(np.pi*n*n/q,{0:float(chi[n%q])*(n if odd else 1)}) for n in range(1,12*q) if chi[n%q]]
        return gates.jets_theta(x,terms,0.75 if odd else 0.25)
    return kernel,q
rng=np.random.default_rng(11); ntr=40; depth=5
for name in CH:
    kern,q=mk(name); gates.kernel=kern
    X=14*q; dx=1e-3*q/2; tmax=np.log(X)-1.2
    cnt=[Counter() for _ in range(depth+1)]; ex=[{} for _ in range(depth+1)]
    for tr in range(ntr):
        A=list(np.exp(rng.uniform(np.log(0.05),np.log(4),depth)))
        for lev,f in enumerate(gates.check(name,A,X,dx,tmax)):
            for k,t in f.items(): cnt[lev][k]+=1; ex[lev].setdefault(k,round(t,3))
    print(name,"tmax=%.2f"%tmax,"| per-level fail counts /%d (first-fail t):"%ntr,[ {k:(c,ex[l][k]) for k,c in cnt[l].items()} for l in range(depth+1)])
